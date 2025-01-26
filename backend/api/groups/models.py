from pydantic import BaseModel


class CreateGroupModel(BaseModel):
    name: str

    class Config:
        from_attributes = True


class GroupModel(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

