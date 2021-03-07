from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..auth.depends import get_authed_user_id
from ..core.db import get_db
from .models import User
from .schemas import UserView

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get("/me", response_model=UserView)
def get_users(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_authed_user_id),
) -> User:
    user = User.get_by_id(db, id=user_id)
    if user is None:
        raise Exception("no user")
    return user
