from pydantic import BaseModel

from backend.api.student.models import StudentModel


class GroupModel(BaseModel):
    id: int
    name: str
    students: list[StudentModel] = []

    class Config:
        from_attributes = True

class CreateGroupModel(BaseModel):
    name: str

    class Config:
        from_attributes = True

