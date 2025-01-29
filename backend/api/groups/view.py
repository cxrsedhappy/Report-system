from fastapi import APIRouter, Depends, status

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_current_user
from backend.api.groups import crud
from backend.api.groups.models import GroupModel, CreateGroupModel
from backend.database.engine import create_session

router = APIRouter(prefix='/api/group', tags=['Groups'])

@router.post('', response_model=GroupModel, status_code=status.HTTP_201_CREATED)
async def create_group(
        new_group: CreateGroupModel,
        session: AsyncSession = Depends(create_session),
        current_user = 2
):
    return await crud.create_group(new_group, session, current_user)


@router.get('', status_code=status.HTTP_200_OK)
async def get_group(
        group_ids: int = None,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.get_group(group_ids, session, current_user)

@router.put('', status_code=status.HTTP_200_OK)
async def update_group(
        groups: list[GroupModel],
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.update_group(groups, session, current_user)

@router.delete('', status_code=status.HTTP_200_OK)
async def delete_group(
        group_ids: list[int],
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.delete_group(group_ids, session, current_user)

@router.post('/add', status_code=status.HTTP_200_OK)
async def add_student_to_group(
        student_id: int,
        group_id: int,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.add_student_to_group(student_id, group_id, session, current_user)