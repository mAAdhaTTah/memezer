from pathlib import Path
from typing import IO, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from .auth.token import create_access_token
from .core.db import Base, SessionLocal, engine
from .meme.models import Meme
from .meme.schemas import MemeCreate
from .user.models import User
from .user.schemas import UserCreate
from .wsgi import app


@pytest.fixture(scope="function")
def db() -> Generator[Session, None, None]:
    Base.metadata.create_all(engine)
    session = SessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db: Session) -> TestClient:
    return TestClient(app)


@pytest.fixture
def authed_client(client: TestClient, user: User) -> TestClient:
    access_token = create_access_token(user)

    client.headers.update({"Authorization": f"Bearer {access_token}"})

    return client


@pytest.fixture
def user(db: Session) -> User:
    return User.create_user(
        db,
        user=UserCreate(
            username="NewUser",
            email="user@example.com",
            password="password",
            confirm_password="password",
        ),
    )


@pytest.fixture
def meme(db: Session, user: User) -> Meme:
    return Meme.create_meme(
        db, meme=MemeCreate(uploader_id=user.id, filename="test-file.jpg")
    )


@pytest.fixture
def meme_file() -> Generator[IO, None, None]:
    with open(Path(__file__).parent / "trollface.png", "rb") as f:
        yield f
