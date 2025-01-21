from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_current_user
from backend.api.user import crud
from backend.api.user.models import UserSchema, CreateUserSchema, UpdateUserSchema
from backend.database.engine import create_session

router = APIRouter(prefix='/api/user', tags=['User'])

@router.post('', response_model=UserSchema)
async def create_user(user: CreateUserSchema, session: AsyncSession = Depends(create_session)):
    return await crud.create_user(user, session)


@router.get('/protected')
async def protected(current_user = Depends(get_current_user)):
    return current_user


@router.get('')
async def get_users_by_id(
        user_ids: list[int] = None,
        session: AsyncSession = Depends(create_session)
):
    return await crud.get_users_by_id(user_ids, session)

@router.put('')
async def update_user(
        updated_user_info: UpdateUserSchema = None,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.update_user(updated_user_info, session, current_user)

@router.delete('')
async def delete_user(
        user_id: int,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    await crud.delete_user(user_id, session, current_user)