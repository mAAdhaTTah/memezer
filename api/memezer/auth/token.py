from datetime import datetime, timedelta
from uuid import UUID

from jose import jwt

from ..core.settings import settings
from .schemas import TokenData


def create_access_token(
    user_id: UUID,
    expires_delta: timedelta = timedelta(minutes=60),
) -> str:
    token_data = {
        "user_id": str(user_id),
        "expires": str(datetime.utcnow() + expires_delta),
    }
    return jwt.encode(
        token_data, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )


def get_token_data(token: str) -> TokenData:
    payload = jwt.decode(
        token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
    )
    return TokenData(**payload)
