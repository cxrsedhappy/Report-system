from pydantic import BaseModel

class CreateSubjectModel(BaseModel):
    name: str

    class Config:
        from_attributes = True

class SubjectModel(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True

class UpdateSubjectModel(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True
