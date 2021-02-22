from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from .models import User


def test_should_create_new_user(client: TestClient, db: Session) -> None:
    email = "fake2@example.com"
    response = client.post(
        "/api/users",
        json={
            "username": "NewUser",
            "email": email,
            "password": "password",
            "confirm_password": "password",
        },
    )

    assert response.status_code == 201

    user = User.get_by_email(db, email)

    assert user is not None
    assert response.json() == {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
    }


def test_should_not_create_new_user_if_password_missing(
    client: TestClient, db: Session
) -> None:
    email = "fake2@example.com"
    response = client.post(
        "/api/users",
        json={"email": email},
    )

    assert response.status_code == 422


def test_should_not_create_new_user_if_passwords_dont_match(
    client: TestClient, db: Session
) -> None:
    email = "fake2@example.com"
    response = client.post(
        "/api/users",
        json={
            "email": email,
            "password": "password",
            "confirm_password": "other_password",
        },
    )

    assert response.status_code == 422


def test_should_return_current_user(authed_client: TestClient, user: User) -> None:
    response = authed_client.get("/api/users/me")

    assert response.status_code == 200
    assert response.json() == {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
    }


# TODO: we get correct error codes for various header errors
def test_should_require_auth(client: TestClient) -> None:
    response = client.get("/api/users/me")

    assert response.status_code == 401
