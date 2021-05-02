import os
from datetime import datetime
from pathlib import Path
from shutil import copyfile
from typing import IO, Generator, Tuple

import procrastinate
import procrastinate.testing
import pytest
import requests
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from .app import queue, wsgi
from .auth.token import create_access_token
from .core.db import Base, SessionLocal, engine
from .meme.models import Meme, OCRResult
from .meme.schemas import MemeCreate
from .user.models import User
from .user.schemas import UserCreate

assets_path = Path(__file__).parent.parent / "assets"


@pytest.fixture
def db() -> Generator[Session, None, None]:
    Base.metadata.create_all(engine)
    session = SessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def memory_connector(
    monkeypatch: pytest.MonkeyPatch,
) -> Generator[procrastinate.testing.InMemoryConnector, None, None]:
    connector = procrastinate.testing.InMemoryConnector()
    monkeypatch.setattr(queue, "connector", connector)
    monkeypatch.setattr(queue.job_manager, "connector", connector)
    yield connector
    connector.reset()


@pytest.fixture
def client(
    memory_connector: procrastinate.testing.InMemoryConnector,
) -> Generator[requests.Session, None, None]:
    with TestClient(wsgi) as client:
        yield client


@pytest.fixture
def authed_client(client: TestClient, user: User) -> TestClient:
    access_token = create_access_token(user.id)

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
def two_users(db: Session, user: User) -> Tuple[User, User]:
    second_user = User.create_user(
        db,
        user=UserCreate(
            username="SecondUser",
            email="second_user@example.com",
            password="password",
            confirm_password="password",
        ),
    )

    return user, second_user


@pytest.fixture
def meme(db: Session, user: User, trollface_path: Path) -> Meme:
    meme = Meme.create_meme(
        db, meme=MemeCreate(uploader_id=user.id, filename="trollface.png")
    )
    os.makedirs(meme.file_path.parent)
    copyfile(trollface_path, meme.file_path)

    return meme


@pytest.fixture
def meme_with_file_and_ocr(db: Session, meme: Meme, trollface_path: str) -> Meme:
    db.add(OCRResult(started_at=datetime.now(), meme=meme, output="Some result"))
    db.commit()

    copyfile(trollface_path, meme.file_path)

    return meme


@pytest.fixture
def trollface_path() -> Path:
    return assets_path / "trollface.png"


@pytest.fixture
def trollface_file(trollface_path: Path) -> Generator[IO, None, None]:
    with open(trollface_path, "rb") as f:
        yield f


@pytest.fixture
def goodpun_path() -> Path:
    return assets_path / "good-pun.jpg"


@pytest.fixture
def goodpun_file(goodpun_path: Path) -> Generator[IO, None, None]:
    with open(goodpun_path, "rb") as f:
        yield f
