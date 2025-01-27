from typing import Optional

from pydantic import BaseModel

class StudentModel(BaseModel):
    id: int
    educational_id: str
    name: str
    surname: str
    lastname: str | None
    entrance: bool | None

    class Config:
        from_attributes = True

class CreateStudentModel(BaseModel):
    educational_id: str
    name: str
    surname: str
    lastname: str | None
    entrance: bool | None

    class Config:
        from_attributes = True


class UpdateStudentModel(BaseModel):
    id: int
    educational_id: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    lastname: Optional[str] = None
    entrance: Optional[bool] = None

    class Config:
        from_attributes = True


class InfoStudentModel(BaseModel):
    id: int
    educational_id: str = None
    name: str = None
    surname: str = None
    lastname: str = None
    entrance: bool = None
    group: str = None
    diploma: str = None
    exams: int = None
