from uuid import uuid4

from fastapi.testclient import TestClient

from ..auth.token import create_access_token
from ..core.db import Session
from .models import User


def test_should_return_current_user(authed_client: TestClient, user: User) -> None:
    response = authed_client.get("/api/users/me")

    assert response.status_code == 200
    assert response.json() == {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
    }


def test_should_require_auth(client: TestClient) -> None:
    response = client.get("/api/users/me")

    assert response.status_code == 401


def test_should_401_if_id_in_token_not_found(client: TestClient, db: Session) -> None:
    access_token = create_access_token(uuid4())

    client.headers.update({"Authorization": f"Bearer {access_token}"})

    response = client.get("/api/users/me")

    assert response.status_code == 401
