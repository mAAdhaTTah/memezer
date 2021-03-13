from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from ..user.models import User


def test_should_register_new_user(client: TestClient, db: Session) -> None:
    email = "fake2@example.com"
    response = client.post(
        "/api/auth/register",
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
    body = response.json()
    assert body["user"] == {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
    }
    assert type(body["token"]["access_token"]) == str
    assert body["token"]["token_type"] == "bearer"


def test_should_not_register_new_user_if_password_missing(
    client: TestClient, db: Session
) -> None:
    email = "fake2@example.com"
    response = client.post(
        "/api/auth/register",
        json={"email": email},
    )

    assert response.status_code == 422


def test_should_not_register_new_user_if_passwords_dont_match(
    client: TestClient, db: Session
) -> None:
    email = "fake2@example.com"
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": "password",
            "confirm_password": "other_password",
        },
    )

    assert response.status_code == 422


def test_should_return_token(client: TestClient, user: User) -> None:
    response = client.post(
        "/api/auth/login", data={"username": user.username, "password": "password"}
    )

    assert response.status_code == 201
