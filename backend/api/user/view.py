from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_current_user
from backend.api.user import crud
from backend.api.user.models import UserSchema, CreateUserSchema
from backend.database.engine import create_session

router = APIRouter(prefix='/user', tags=['User'])

@router.post('/', response_model=UserSchema)
async def create_user(user: CreateUserSchema, session: AsyncSession = Depends(create_session)):
    return await crud.create_user(user, session)


@router.get('/protected')
async def protected(current_user = Depends(get_current_user)):
    return current_user


@router.get('/')
async def get_users_by_id(user_ids: list[int], session: AsyncSession = Depends(create_session)):
    return await crud.get_users_by_id(user_ids, session)

@router.put('/')
async def update_user():
    ...

@router.delete('/')
async def delete_user():
    ...