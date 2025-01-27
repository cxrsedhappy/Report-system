from fastapi import APIRouter, Depends, status

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_current_user
from backend.api.student import crud
from backend.api.student.models import StudentModel, CreateStudentModel, UpdateStudentModel, InfoStudentModel
from backend.database.engine import create_session

router = APIRouter(prefix='/api/student', tags=['Student'])

@router.post('', response_model=StudentModel, status_code=status.HTTP_201_CREATED)
async def create_student(
        student: CreateStudentModel,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.create_student(student, session, current_user)

@router.get('', response_model=list[InfoStudentModel], status_code=status.HTTP_200_OK)
async def get_student(
        student_id: int = None,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.get_student(student_id, session, current_user)

@router.put('', status_code=status.HTTP_200_OK)
async def update_student(
        user_ids: list[UpdateStudentModel],
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.update_student(user_ids, session, current_user)

@router.delete('', status_code=status.HTTP_200_OK)
async def delete_student(
        student_ids: list[int],
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
):
    return await crud.delete_student(student_ids, session, current_user)