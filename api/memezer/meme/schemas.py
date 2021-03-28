from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import AnyHttpUrl, BaseModel


class MemeFilename(BaseModel):
    filename: str


class MemeView(MemeFilename):
    id: UUID
    title: str
    uploaded_at: datetime
    file_url: AnyHttpUrl
    overlay_text: Optional[str]

    class Config:
        orm_mode = True


class MemeCreate(MemeFilename):
    uploader_id: UUID
    title: Optional[str] = None

    def to_orm(self) -> dict:
        model = self.dict()
        model.update({"uploader_id": str(model["uploader_id"])})

        return model


class MemeUpdate(BaseModel):
    title: str
    overlay_text: str
