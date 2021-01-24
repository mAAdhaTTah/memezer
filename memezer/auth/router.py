from core.db import get_db
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from user.models import User

from .schemas import Token
from .token import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/login", response_model=Token, status_code=201)
def get_users(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> dict:
    user = User.authenticate(db, form_data.username, form_data.password)

    if user is None:
        raise HTTPException(401, "Username or password is incorrect")

    return {"access_token": create_access_token(user), "token_type": "bearer"}
