from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_current_user
from backend.database.engine import create_session

router = APIRouter(prefix='/api/student', tags=['Student'])

@router.post('')
async def create_student(session: AsyncSession = Depends(create_session), current_user = Depends(get_current_user)):
    ...

@router.get('')
async def get_student(session: AsyncSession = Depends(create_session), current_user = Depends(get_current_user)):
    ...

@router.put('')
async def update_student(session: AsyncSession = Depends(create_session), current_user = Depends(get_current_user)):
    ...

@router.delete('')
async def delete_student(session: AsyncSession = Depends(create_session), current_user = Depends(get_current_user)):
    ...