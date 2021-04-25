from uuid import UUID

from pydantic import BaseModel, validator

from ..auth.password import hash_password


class UserBase(BaseModel):
    username: str
    email: str

    @validator("username")
    def username_valid(cls, v: str) -> str:
        if " " in v:
            raise ValueError("username cannot have spaces")
        return v


class UserView(UserBase):
    id: UUID

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    password: str
    confirm_password: str

    @validator("password")
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("password is too short")
        return v

    @validator("confirm_password")
    def confirm_matches(cls, v: str, values: dict, **kwargs: dict) -> str:
        if "password" in values and v != values["password"]:
            raise ValueError("passwords do not match")
        return v

    def to_orm(self) -> dict:
        user_data = self.dict(exclude={"confirm_password"})
        user_data.update({"password": hash_password(self.password)})

        return user_data
