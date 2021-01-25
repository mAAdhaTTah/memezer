from uuid import UUID

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from .token import get_token_data

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_authed_user_id(token: str = Depends(oauth2_scheme)) -> UUID:
    token_data = get_token_data(token)
    return token_data.user_id
