from typing import IO

from fastapi.encoders import jsonable_encoder
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

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
            "filename": meme.filename,
            "title": meme.title,
            "uploaded_at": jsonable_encoder(meme.uploaded_at),
        }
    ]


def test_should_require_auth_to_create_memes(client: TestClient) -> None:
    response = client.post("/api/memes", data={})

    assert response.status_code == 401


def test_should_create_meme(
    authed_client: TestClient, meme_file: IO, db: Session
) -> None:
    response = authed_client.post(
        "/api/memes", files={"file": ("trollface.png", meme_file, "image/png")}
    )
    meme = db.query(Meme).one()

    assert response.status_code == 201
    assert response.json() == {
        "filename": "trollface.png",
        "title": "trollface.png",
        "uploaded_at": jsonable_encoder(meme.uploaded_at),
    }
