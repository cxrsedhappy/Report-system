from pydantic import BaseModel, Field


class User(BaseModel):
    id: int
    login: str
    name: str
    surname: str
    lastname: str
    privilege: int

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    login: str = Field(...)
    password: str = Field(...)

    class Config:
        from_attributes = True

class CreateUser(BaseModel):
    login: str = Field(..., min_length=4, max_length=20)
    password: str = Field(..., min_length=8, max_length=20)
    name: str = Field(...)
    surname: str = Field(...)
    lastname: str = Field(...)

    class Config:
        from_attributes = True
