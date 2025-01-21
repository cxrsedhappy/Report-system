from pydantic import BaseModel, Field


class UserSchema(BaseModel):
    id: int
    login: str
    name: str
    surname: str
    lastname: str
    privilege: int

    class Config:
        from_attributes = True


class CreateUserSchema(BaseModel):
    login: str = Field(..., min_length=4, max_length=20)
    password: str = Field(..., min_length=8, max_length=20)
    name: str = Field(...)
    surname: str = Field(...)
    lastname: str = Field(...)

    class Config:
        from_attributes = True


class UpdateUserSchema(BaseModel):
    user_id: int = None
    login: str = None
    password: str = None
    name: str = None
    surname: str = None
    lastname: str = None
    privilege: int = None

    class Config:
        from_attributes = True
