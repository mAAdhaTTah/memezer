from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from ..user.schemas import UserView


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: UUID
    expires: datetime


class RegisterView(BaseModel):
    user: UserView
    token: Token
