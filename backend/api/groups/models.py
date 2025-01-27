from pydantic import BaseModel

class GroupModel(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class CreateGroupModel(BaseModel):
    name: str

    class Config:
        from_attributes = True

