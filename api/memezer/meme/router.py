from uuid import UUID

from fastapi import APIRouter, Body, Depends, File, UploadFile
from fastapi_pagination import Page
from sqlalchemy.orm import Session

from ..auth.depends import get_authed_user_id
from ..core.db import get_db
from .models import Meme
from .schemas import MemeUpdate, MemeView
from .search import MemeParams

router = APIRouter(
    prefix="/memes",
    tags=["meme"],
)


@router.get("", response_model=Page[MemeView])
def get_memes(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_authed_user_id),
    params: MemeParams = Depends(MemeParams),
) -> Page[Meme]:
    return params.respond(db, user_id)


@router.post("", response_model=MemeView, status_code=201)
async def upload_meme(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_authed_user_id),
    file: UploadFile = File(...),
) -> Meme:
    return await Meme.create_meme_from_upload_file(db, user_id, file)


@router.get("/{meme_id}", response_model=MemeView)
async def get_meme(
    meme_id: UUID,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_authed_user_id),
) -> Meme:
    return Meme.get_meme_owned_by(db, meme_id, user_id)


@router.put("/{meme_id}", response_model=MemeView)
async def update_meme(
    meme_id: UUID,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_authed_user_id),
    update: MemeUpdate = Body(...),
) -> Meme:
    return Meme.update_meme_owned_by(db, meme_id, user_id, update=update)
