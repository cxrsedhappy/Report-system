from typing import Optional

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
    login: str = Field(..., min_length=4, max_length=50)
    password: str = Field(..., min_length=8, max_length=50)
    name: str = Field(...)
    surname: str = Field(...)
    lastname: str = Field(...)
    privilege: int = Field(...)

    class Config:
        from_attributes = True


class UserParamSchema(BaseModel):
    id: int
    login: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    lastname: Optional[str] = None
    privilege: Optional[int] = None

    class Config:
        from_attributes = True
