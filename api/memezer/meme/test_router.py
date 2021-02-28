from os import path
from typing import IO

from fastapi.encoders import jsonable_encoder
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from ..core.settings import settings
from ..user.models import User
from .models import Meme


def test_should_require_auth_to_view_memes(client: TestClient) -> None:
    response = client.get("/api/memes")

    assert response.status_code == 401


def test_should_return_authed_users_memes(
    authed_client: TestClient, meme: Meme
) -> None:
    response = authed_client.get("/api/memes")

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": str(meme.id),
            "filename": meme.filename,
            "title": meme.title,
            "file_url": meme.file_url,
            "uploaded_at": jsonable_encoder(meme.uploaded_at),
        }
    ]


def test_should_require_auth_to_create_memes(client: TestClient) -> None:
    response = client.post("/api/memes", data={})

    assert response.status_code == 401


def test_should_create_meme(
    authed_client: TestClient, meme_file: IO, db: Session, user: User
) -> None:
    response = authed_client.post(
        "/api/memes", files={"file": ("trollface.png", meme_file, "image/png")}
    )
    meme = db.query(Meme).one()

    assert response.status_code == 201
    assert response.json() == {
        "id": str(meme.id),
        "filename": "trollface.png",
        "title": "trollface.png",
        "file_url": f"http://localhost:8080/media/{user.id}/trollface.png",
        "uploaded_at": jsonable_encoder(meme.uploaded_at),
    }

    assert path.exists(f"{settings.MEDIA_PATH}/{str(user.id)}/trollface.png")
