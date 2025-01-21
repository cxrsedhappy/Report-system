from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_current_user
from backend.database.engine import create_session

router = APIRouter(prefix='/api/subject', tags=['Subject'])

@router.post('')
async def create_subject(session: AsyncSession = Depends(create_session), current_user = Depends(get_current_user)):
    ...

@router.get('')
async def get_subjects(session: AsyncSession = Depends(create_session), current_user = Depends(get_current_user)):
    ...

@router.put('')
async def update_subject(session: AsyncSession = Depends(create_session), current_user = Depends(get_current_user)):
    ...

@router.delete('')
async def delete_subject(session: AsyncSession = Depends(create_session), current_user = Depends(get_current_user)):
    ...