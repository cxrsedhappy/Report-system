from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from src.api.auth.auth import get_current_user
from src.api.user import crud
from src.api.user.models import CreateUserSchema
from src.database.engine import create_session

router = APIRouter(prefix='/user', tags=['User'])

@router.post('/')
async def create_user(user: CreateUserSchema, session: AsyncSession = Depends(create_session)):
    user = await crud.create_user(user, session)
    return user


@router.get('/protected')
async def protected(current_user = Depends(get_current_user)):
    return current_user


@router.get('/')
async def get_user():
    ...

@router.put('/')
async def update_user():
    ...

@router.delete('/')
async def delete_user():
    ...