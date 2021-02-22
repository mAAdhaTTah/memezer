from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class MemeBase(BaseModel):
    filename: str


class MemeView(MemeBase):
    title: str
    uploaded_at: datetime

    class Config:
        orm_mode = True


class MemeCreate(MemeBase):
    uploader_id: UUID
    title: Optional[str] = None
