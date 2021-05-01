import filecmp
from os import path
from pathlib import Path
from typing import IO, List, Tuple
from unittest import mock

import procrastinate
from fastapi.encoders import jsonable_encoder
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from ..core.fs import SaveMemeException
from ..core.settings import settings
from ..user.models import User
from .models import Meme, OCRResult


def test_should_require_auth_to_view_memes(client: TestClient) -> None:
    response = client.get("/api/memes")

    assert response.status_code == 401


def test_should_return_authed_users_memes(
    authed_client: TestClient, meme: Meme
) -> None:
    response = authed_client.get("/api/memes")

    assert response.status_code == 200
    assert response.json() == {
        "total": 1,
        "items": [
            {
                "id": str(meme.id),
                "filename": meme.filename,
                "title": meme.title,
                "file_url": meme.file_url,
                "uploaded_at": jsonable_encoder(meme.uploaded_at),
                "accessibility_text": None,
            }
        ],
        "page": 0,
        "size": 50,
    }


def test_should_require_auth_to_create_memes(client: TestClient) -> None:
    response = client.post("/api/memes", data={})

    assert response.status_code == 401


def test_should_create_meme(
    authed_client: TestClient,
    trollface_file: IO,
    db: Session,
    user: User,
    memory_connector: procrastinate.testing.InMemoryConnector,
) -> None:
    response = authed_client.post(
        "/api/memes", files={"file": ("trollface.png", trollface_file, "image/png")}
    )
    meme = db.query(Meme).one()

    assert response.status_code == 201
    assert response.json() == {
        "id": str(meme.id),
        "filename": "trollface.png",
        "title": "trollface.png",
        "file_url": f"{settings.MEDIA_URL}/{user.id}/trollface.png",
        "uploaded_at": jsonable_encoder(meme.uploaded_at),
        "accessibility_text": None,
    }

    assert path.exists(f"{settings.MEDIA_PATH}/{str(user.id)}/trollface.png")
    assert len(memory_connector.jobs) == 1
    assert memory_connector.jobs[1]["task_name"] == "memezer.meme.tasks.ocr_meme"
    assert memory_connector.jobs[1]["args"] == {"meme_id": str(meme.id)}


def test_should_not_create_meme_with_shared_filename(
    authed_client: TestClient, goodpun_file: IO, trollface_path: Path, meme: Meme
) -> None:
    response = authed_client.post(
        "/api/memes", files={"file": (meme.filename, goodpun_file, "image/png")}
    )

    assert response.status_code == 409
    assert filecmp.cmp(meme.file_path, trollface_path)  # should not be overwritten


@mock.patch("memezer.core.fs.fs.save_meme", side_effect=SaveMemeException())
def test_should_not_create_meme_when_saving_fails(
    mock_save_file: mock.AsyncMock,
    db: Session,
    authed_client: TestClient,
    trollface_file: IO,
) -> None:
    response = authed_client.post(
        "/api/memes", files={"file": ("trollface.png", trollface_file, "image/png")}
    )

    assert mock_save_file.called
    assert response.status_code == 500
    assert response.json() == {"message": "Failed to save."}
    assert db.query(Meme).count() == 0


def test_should_require_auth_to_view_meme(client: TestClient, meme: Meme) -> None:
    response = client.get(f"/api/memes/{meme.id}")

    assert response.status_code == 401


def test_should_return_meme(authed_client: TestClient, meme: Meme, user: User) -> None:
    response = authed_client.get(f"/api/memes/{meme.id}")

    assert response.status_code == 200
    assert response.json() == {
        "id": str(meme.id),
        "filename": "trollface.png",
        "title": "trollface.png",
        "file_url": f"{settings.MEDIA_URL}/{user.id}/trollface.png",
        "uploaded_at": jsonable_encoder(meme.uploaded_at),
        "accessibility_text": None,
    }


def test_should_not_return_other_users_meme(
    authed_client: TestClient, two_users: List[User], db: Session, meme: Meme
) -> None:
    meme.uploader_id = two_users[1].id
    db.commit()

    response = authed_client.get(f"/api/memes/{meme.id}")

    assert response.status_code == 404


def test_should_require_auth_to_update_meme(client: TestClient, meme: Meme) -> None:
    body = {
        "title": "New title",
        "accessibility_text": "New overlay test",
    }
    response = client.put(f"/api/memes/{meme.id}", json=body)

    assert response.status_code == 401


def test_should_not_allow_updating_others_meme(
    authed_client: TestClient, db: Session, meme: Meme, two_users: Tuple[User, User]
) -> None:
    meme.uploader_id = two_users[1].id
    db.commit()

    body = {
        "title": "New title",
        "accessibility_text": "New accessibility test",
    }
    response = authed_client.put(f"/api/memes/{meme.id}", json=body)

    assert response.status_code == 404


def test_should_update_title_and_accessibility_text(
    authed_client: TestClient, db: Session, meme: Meme, user: User
) -> None:
    body = {
        "title": "New title",
        "accessibility_text": "New accessibility test",
    }
    response = authed_client.put(f"/api/memes/{meme.id}", json=body)

    db.refresh(meme)

    assert response.json() == {
        "id": str(meme.id),
        "filename": "trollface.png",
        "title": body["title"],
        "file_url": f"{settings.MEDIA_URL}/{user.id}/trollface.png",
        "uploaded_at": jsonable_encoder(meme.uploaded_at),
        "accessibility_text": body["accessibility_text"],
    }

    assert body == {
        "title": meme.title,
        "accessibility_text": meme.accessibility_text,
    }


def test_should_require_auth_to_delete_meme(client: TestClient, meme: Meme) -> None:
    response = client.get(f"/api/memes/{meme.id}")

    assert response.status_code == 401


def test_should_not_allow_deleting_others_meme(
    authed_client: TestClient, db: Session, meme: Meme, two_users: Tuple[User, User]
) -> None:
    meme.uploader_id = two_users[1].id
    db.commit()

    body = {
        "title": "New title",
        "accessibility_text": "New accessibility test",
    }
    response = authed_client.put(f"/api/memes/{meme.id}", json=body)

    assert response.status_code == 404


def test_should_delete_meme(
    authed_client: TestClient, db: Session, meme_with_file_and_ocr: Meme
) -> None:
    response = authed_client.delete(f"/api/memes/{meme_with_file_and_ocr.id}")

    assert response.status_code == 204
    assert response.content == b""
    assert db.query(Meme).count() == 0
    assert db.query(OCRResult).count() == 0
    assert not meme_with_file_and_ocr.file_path.exists()
