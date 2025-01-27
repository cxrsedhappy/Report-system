from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_current_user
from backend.database.engine import create_session
from backend.api.student.models import StudentModel, CreateStudentModel
from backend.api.student import crud

router = APIRouter(prefix='/api/student', tags=['Student'])

@router.post('')
async def create_student(
        student: CreateStudentModel,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.create_student(student, session, current_user)

@router.get('')
async def get_student(
        student_id: int = None,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.get_student(student_id, session, current_user)

@router.put('')
async def update_student(
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    ...

@router.delete('')
async def delete_student(
        student_id: list[int],
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.delete_student(student_id, session, current_user)