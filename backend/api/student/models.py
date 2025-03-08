from typing import Optional

from pydantic import BaseModel

class StudentModel(BaseModel):
    id: int
    educational_id: str
    name: str
    surname: str
    lastname: str | None
    phone: str | None
    entrance: bool | None

    class Config:
        from_attributes = True

class CreateStudentModel(BaseModel):
    educational_id: str
    name: str
    surname: str
    lastname: str | None
    phone: str | None
    group_id: int | None
    entrance: bool | None

    class Config:
        from_attributes = True


class UpdateStudentModel(BaseModel):
    id: int
    educational_id: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    lastname: Optional[str] = None
    group_id: Optional[int] = None
    phone: str | None
    entrance: Optional[bool] = None

    class Config:
        from_attributes = True


class InfoStudentModel(BaseModel):
    id: int
    educational_id: str | None = None
    name: str = None
    surname: str = None
    lastname: str = None
    phone: str | None
    entrance: bool = None
    group: str | None = None
    diploma: str | None = None
    exams: int | None = None
