from pydantic import BaseModel, validator


class UserBase(BaseModel):
    username: str
    email: str

    @validator("username")
    def username_valid(cls, v: str) -> str:
        if " " in v:
            raise ValueError("username cannot have spaces")
        return v


class UserView(UserBase):
    pass

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
