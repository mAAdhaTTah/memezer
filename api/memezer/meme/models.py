from __future__ import annotations

import uuid
from datetime import datetime
from pathlib import Path
from typing import TYPE_CHECKING, List, Optional

from fastapi import UploadFile
from sqlalchemy import Column, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, relationship

from ..core.db import Base, ModifiesQuery
from ..core.fs import save_file
from ..core.settings import settings

if TYPE_CHECKING:
    from ..user.models import User  # noqa: F401

from .errors import DuplicateFilenameException
from .schemas import MemeCreate


class Meme(Base):
    __tablename__ = "memes"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        default=uuid.uuid4,
        unique=True,
    )
    uploader_id = Column(UUID(), ForeignKey("users.id"), index=True)
    title = Column(
        String,
        nullable=False,
        # Default title is the filename
        default=lambda ctx: ctx.current_parameters.get("filename"),
    )
    filename = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), nullable=False, default=datetime.now)

    uploader = relationship("User", back_populates="uploads")

    __table_args__ = (
        UniqueConstraint("filename", "uploader_id", name="_uploader_filename_uc"),
    )

    @staticmethod
    def get_memes_from_uploader_id(
        db: Session,
        uploader_id: uuid.UUID,
        modifier: Optional[ModifiesQuery[Meme]] = None,
    ) -> List[Meme]:
        query = db.query(Meme).filter(Meme.uploader_id == str(uploader_id))
        query = modifier.modify_query(query) if modifier is not None else query
        return query.all()

    @staticmethod
    def create_meme(db: Session, *, meme: MemeCreate) -> Meme:
        db_meme = Meme(**meme.to_orm())
        db.add(db_meme)
        db.commit()
        db.refresh(db_meme)

        return db_meme

    @staticmethod
    async def create_meme_from_upload_file(
        db: Session, uploader_id: uuid.UUID, file: UploadFile
    ) -> Meme:
        try:
            db_meme = Meme.create_meme(
                db, meme=MemeCreate(uploader_id=uploader_id, filename=file.filename)
            )
            await save_file(db_meme.file_path, file)

            return db_meme
        except IntegrityError:
            raise DuplicateFilenameException(file.filename)

    @property
    def file_path(self) -> Path:
        return Path(
            f"{str(settings.MEDIA_PATH)}/{str(self.uploader_id)}/{self.filename}"
        )

    @property
    def file_url(self) -> str:
        return f"{settings.MEDIA_URL}/{str(self.uploader_id)}/{self.filename}"
