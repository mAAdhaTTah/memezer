from __future__ import annotations

from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column, String, or_
from sqlalchemy.orm import Query, Session, relationship
from sqlalchemy.orm.exc import NoResultFound

from ..auth.password import verify_password
from ..core.db import PGUUID, Base

if TYPE_CHECKING:
    from ..meme.models import Meme  # noqa: F401

from .errors import AuthenticationFailed, UserNotFound
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
    def by_id_query(db: Session, id: UUID) -> Query[User]:
        return db.query(User).filter(User.id == id)

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

    @classmethod
    def get_by_id(cls, db: Session, id: UUID) -> User:
        try:
            return cls.by_id_query(db, id).one()
        except NoResultFound:
            raise UserNotFound(id)

    @classmethod
    def authenticate(cls, db: Session, username_or_email: str, password: str) -> User:
        user = cls.get_by_username_or_email(db, username_or_email)

        if user is not None and verify_password(password, user.password):
            return user

        raise AuthenticationFailed(username_or_email)
