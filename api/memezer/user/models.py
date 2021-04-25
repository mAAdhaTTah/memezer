from __future__ import annotations

from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column, String, or_
from sqlalchemy.orm import Session, relationship

from ..auth.password import verify_password
from ..core.db import PGUUID, Base

if TYPE_CHECKING:
    from ..meme.models import Meme  # noqa: F401

from .schemas import UserCreate


class User(Base):
    __tablename__ = "users"

    id = Column(
        PGUUID,
        primary_key=True,
        index=True,
        default=uuid4,
        unique=True,
    )
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    uploads = relationship("Meme", back_populates="uploader", uselist=True)

    @staticmethod
    def get_by_id(db: Session, id: UUID) -> Optional[User]:
        return db.query(User).filter(User.id == id).first()

    @staticmethod
    def get_by_username(db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_username_or_email(db: Session, username_or_email: str) -> Optional[User]:
        return (
            db.query(User)
            .filter(
                or_(User.email == username_or_email, User.username == username_or_email)
            )
            .first()
        )

    @staticmethod
    def create_user(db: Session, *, user: UserCreate) -> User:
        db_user = User(**user.to_orm())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user

    @staticmethod
    def authenticate(
        db: Session, username_or_email: str, password: str
    ) -> Optional[User]:
        user = User.get_by_username_or_email(db, username_or_email)

        if user is not None and verify_password(password, user.password):
            return user

        return None
