from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import TYPE_CHECKING, List
from uuid import UUID, uuid4

from fastapi import UploadFile
from sqlalchemy import Column, DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, relationship
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.query import Query

from ..core.db import PGUUID, Base, ModifiesQuery
from ..core.fs import fs
from ..core.settings import settings

if TYPE_CHECKING:
    from ..user.models import User  # noqa: F401

from .errors import DuplicateFilenameException, MemeNotFound
from .schemas import MemeCreate, MemeUpdate
from .tasks import ocr_meme


class Meme(Base):
    __tablename__ = "memes"

    id = Column(
        PGUUID,
        primary_key=True,
        index=True,
        default=uuid4,
        unique=True,
    )
    uploader_id = Column(PGUUID, ForeignKey("users.id"), index=True, nullable=False)
    title = Column(
        String,
        nullable=False,
        # Default title is the filename
        default=lambda ctx: ctx.current_parameters.get("filename"),
    )
    filename = Column(String, nullable=False)
    accessibility_text = Column(Text(), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), nullable=False, default=datetime.now)
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.now,
        onupdate=datetime.now,
    )

    uploader = relationship("User", back_populates="uploads")
    ocr_results = relationship("OCRResult", back_populates="meme", uselist=True)

    __table_args__ = (
        UniqueConstraint("filename", "uploader_id", name="_uploader_filename_uc"),
    )

    @property
    def file_path(self) -> Path:
        return Path(
            f"{str(settings.MEDIA_PATH)}/{str(self.uploader_id)}/{self.filename}"
        )

    @property
    def file_url(self) -> str:
        return f"{settings.MEDIA_URL}/{str(self.uploader_id)}/{self.filename}"

    @staticmethod
    def get_owned_query(
        db: Session,
        uploader_id: UUID,
    ) -> Query[Meme]:
        return db.query(Meme).filter(Meme.uploader_id == str(uploader_id))

    @classmethod
    def get_owned_meme_query(
        cls,
        db: Session,
        meme_id: UUID,
        uploader_id: UUID,
    ) -> Query[Meme]:
        return cls.get_owned_query(db, uploader_id).filter(Meme.id == meme_id)

    @classmethod
    def get_memes_owned_by(
        cls,
        db: Session,
        uploader_id: UUID,
        modifiers: List[ModifiesQuery[Meme]] = [],
    ) -> Query[Meme]:
        query = cls.get_owned_query(db, uploader_id)

        for modifier in modifiers:
            query = modifier.modify_query(query)

        return query

    @staticmethod
    def create_meme(db: Session, *, meme: MemeCreate, commit: bool = True) -> Meme:
        db_meme = Meme(**meme.to_orm())
        db.add(db_meme)
        if commit:
            db.commit()
            db.refresh(db_meme)

        return db_meme

    @staticmethod
    async def create_meme_from_upload_file(
        db: Session, uploader_id: UUID, file: UploadFile
    ) -> Meme:
        try:
            meme = Meme.create_meme(
                db,
                meme=MemeCreate(uploader_id=uploader_id, filename=file.filename),
                commit=False,
            )
            # flush to throw integrity errors for duplicate files
            # but don't commit cuz saving might fail.
            db.flush()
            db.refresh(meme)
            await fs.save_meme(meme, file)
            await ocr_meme.defer_async(meme_id=str(meme.id))
            db.commit()

            return meme
        except IntegrityError:
            db.rollback()
            raise DuplicateFilenameException(file.filename)

    @classmethod
    def get_meme_owned_by(cls, db: Session, meme_id: UUID, uploader_id: UUID) -> Meme:
        try:
            return cls.get_owned_meme_query(db, meme_id, uploader_id).one()
        except NoResultFound:
            raise MemeNotFound(meme_id)

    @classmethod
    def update_meme_owned_by(
        cls,
        db: Session,
        meme_id: UUID,
        uploader_id: UUID,
        *,
        update: MemeUpdate,
    ) -> Meme:
        results = cls.get_owned_meme_query(db, meme_id, uploader_id).update(
            update.dict()
        )

        if results == 0:
            raise MemeNotFound(meme_id)

        db.commit()

        return cls.get_meme_owned_by(db, meme_id, uploader_id)


class OCRResult(Base):
    __tablename__ = "ocr_result"

    id = Column(
        PGUUID,
        primary_key=True,
        index=True,
        default=uuid4,
        unique=True,
    )
    started_at = Column(DateTime(timezone=True), nullable=False)
    finished_at = Column(DateTime(timezone=True), nullable=False, default=datetime.now)
    meme_id = Column(PGUUID, ForeignKey("memes.id"), index=True)
    output = Column(Text(), nullable=False)

    meme = relationship("Meme", back_populates="ocr_results")
