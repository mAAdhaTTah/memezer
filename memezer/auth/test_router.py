from fastapi.testclient import TestClient
from user.models import User


def test_should_return_token(client: TestClient, user: User) -> None:
    response = client.post(
        "/auth/login", data={"username": user.username, "password": "password"}
    )

    assert response.status_code == 201
