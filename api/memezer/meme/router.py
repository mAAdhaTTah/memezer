from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from ..auth.depends import get_authed_user_id
from ..core.db import get_db
from .models import Meme
from .schemas import MemeView
from .search import MemeSearchParams

router = APIRouter(
    prefix="/memes",
    tags=["meme"],
)


@router.get("", response_model=List[MemeView])
def get_memes(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_authed_user_id),
    search: MemeSearchParams = Depends(MemeSearchParams),
) -> List[Meme]:
    return Meme.get_memes_from_uploader_id(db, user_id, modifier=search)


@router.post("", response_model=MemeView, status_code=201)
async def upload_meme(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_authed_user_id),
    file: UploadFile = File(...),
) -> Meme:
    return await Meme.create_meme_from_upload_file(db, user_id, file)
