from pydantic import BaseModel

class CreateStudentModel(BaseModel):
    educational_id: str
    name: str
    surname: str
    lastname: str | None
    entrance: bool | None

    class Config:
        from_attributes = True


class StudentModel(BaseModel):
    id: int
    educational_id: str
    name: str
    surname: str
    lastname: str | None
    entrance: bool | None

    class Config:
        from_attributes = True
