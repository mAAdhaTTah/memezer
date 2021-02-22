from __future__ import annotations

import uuid
from datetime import datetime
from pathlib import Path
from typing import TYPE_CHECKING, List

from fastapi import UploadFile
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Session, relationship

from ..core.db import Base
from ..core.fs import save_file
from ..core.settings import settings

if TYPE_CHECKING:
    from ..user.models import User  # noqa: F401

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

    @staticmethod
    def get_memes_from_uploader_id(db: Session, uploader_id: uuid.UUID) -> List[Meme]:
        return db.query(Meme).filter(Meme.uploader_id == str(uploader_id)).all()

    @staticmethod
    def create_meme(db: Session, *, meme: MemeCreate) -> Meme:
        meme_data = meme.dict()
        # TODO UUID -> str cast built-in somewhere?
        meme_data.update({"uploader_id": str(meme_data["uploader_id"])})

        db_meme = Meme(**meme_data)
        db.add(db_meme)
        db.commit()
        db.refresh(db_meme)

        return db_meme

    @staticmethod
    async def create_meme_from_upload_file(
        db: Session, uploader_id: uuid.UUID, file: UploadFile
    ) -> Meme:
        db_meme = Meme.create_meme(
            db, meme=MemeCreate(uploader_id=uploader_id, filename=file.filename)
        )
        await save_file(db_meme.file_path, file)

        return db_meme

    @property
    def file_path(self) -> Path:
        return settings.MEDIA_PATH / str(self.uploader_id) / self.filename
