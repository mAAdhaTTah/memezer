from typing import List
from uuid import UUID

from auth.depends import get_authed_user_id
from core.db import get_db
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from .models import Meme
from .schemas import MemeView

router = APIRouter(
    prefix="/memes",
    tags=["meme"],
)


@router.get("", response_model=List[MemeView])
def get_memes(
    db: Session = Depends(get_db), user_id: UUID = Depends(get_authed_user_id)
) -> List[Meme]:
    return Meme.get_memes_from_uploader_id(db, user_id)


@router.post("", response_model=MemeView, status_code=201)
async def upload_meme(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_authed_user_id),
    file: UploadFile = File(...),
) -> Meme:
    return await Meme.create_meme_from_upload_file(db, user_id, file)
