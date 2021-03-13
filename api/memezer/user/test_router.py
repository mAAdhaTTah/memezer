from fastapi.testclient import TestClient

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
