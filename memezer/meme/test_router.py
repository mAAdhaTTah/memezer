from typing import IO

from fastapi.testclient import TestClient

from .models import Meme


def test_should_require_auth_to_view_memes(client: TestClient) -> None:
    response = client.get("/memes")

    assert response.status_code == 401


def test_should_return_authed_users_memes(
    authed_client: TestClient, meme: Meme
) -> None:
    response = authed_client.get("/memes")

    assert response.status_code == 200
    assert response.json() == [{"filename": meme.filename, "title": meme.title}]


def test_should_require_auth_to_create_memes(client: TestClient) -> None:
    response = client.post("/memes", data={})

    assert response.status_code == 401


def test_should_create_meme(authed_client: TestClient, meme_file: IO) -> None:
    response = authed_client.post(
        "/memes", files={"file": ("trollface.png", meme_file, "image/png")}
    )

    assert response.status_code == 201
    assert response.json() == {"filename": "trollface.png", "title": "trollface.png"}
