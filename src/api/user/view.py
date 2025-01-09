from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from src.api.user.models import User, CreateUser
from src.database.engine import create_session
from src.api.user import crud

router = APIRouter(prefix='/user', tags=['User'])

@router.post('/', response_model=User)
async def create_user(user: CreateUser, session: AsyncSession = Depends(create_session)):
    await crud.create_user(user, session)

@router.get('/')
async def get_user():
    ...

@router.get('/')
async def update_user():
    ...

@router.get('/')
async def delete_user():
    ...