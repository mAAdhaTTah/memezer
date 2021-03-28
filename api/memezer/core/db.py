import uuid
from contextlib import contextmanager
from typing import Generator, Generic, TypeVar, cast

import sqlalchemy
import sqlalchemy.dialects.postgresql
import sqlalchemy.ext.declarative
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.orm.query import Query

from .settings import settings

engine = create_engine(settings.POSTGRES_DSN)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def session() -> Generator[Session, None, None]:
    return get_db()


Q = TypeVar("Q", bound=Base)


class ModifiesQuery(Generic[Q]):
    def modify_query(self, query: "Query[Q]") -> "Query[Q]":
        return query


PGUUID = cast(
    "sqlalchemy.types.TypeEngine[uuid.UUID]",
    sqlalchemy.dialects.postgresql.UUID(as_uuid=True),
)
