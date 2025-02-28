from typing import List
from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.api.auth.auth import get_current_user
from backend.api.student import crud
from backend.api.student.models import (
    StudentModel,
    CreateStudentModel,
    UpdateStudentModel,
    InfoStudentModel
)
from backend.database.engine import create_session

router = APIRouter(prefix='/api/student', tags=['Student Management'])


@router.post(
    '',
    response_model=StudentModel,
    status_code=status.HTTP_201_CREATED,
    summary="Create new student",
    description=(
            "Requires teacher/admin privileges. "
            "Creates student with unique educational ID. "
            "Validates data integrity and access rights."
    ),
    responses={
        201: {"description": "Student created"},
        403: {"description": "Insufficient privileges"},
        409: {"description": "Duplicate educational ID"}
    }
)
async def create_student(
        student: CreateStudentModel,
        session: AsyncSession = Depends(create_session),
        current_user: dict = Depends(get_current_user)
) -> StudentModel:
    """
    Create student with:
    - Privilege check (teacher/admin)
    - Educational ID uniqueness validation
    - Data integrity checks

    Args:
        student: Student creation data
        session: Database session
        current_user: Authenticated user info

    Returns:
        Created student data
    """
    return await crud.create_student(student, session, current_user)


@router.get(
    '',
    response_model=List[InfoStudentModel],
    status_code=status.HTTP_200_OK,
    summary="Retrieve students",
    description=(
            "Get all students or filter by ID. "
            "Includes related group, diploma, and exam data. "
            "Requires authentication."
    ),
    responses={
        200: {"description": "List of students"},
        403: {"description": "Guest access forbidden"},
        404: {"description": "Student not found"}
    }
)
async def get_student(
        student_id: int = Query(
            None,
            description="Filter by specific student ID",
            example=1,
            ge=1
        ),
        session: AsyncSession = Depends(create_session),
        current_user: dict = Depends(get_current_user)
) -> List[InfoStudentModel]:
    """
    Retrieve students with:
    - Optional ID filtering
    - Relationship data loading
    - Access control

    Args:
        student_id: Optional student ID filter
        session: Database session
        current_user: Authenticated user info

    Returns:
        List of students with extended info
    """
    return await crud.get_student(student_id, session, current_user)


@router.put(
    '',
    status_code=status.HTTP_200_OK,
    summary="Bulk update students",
    description=(
            "Update multiple students. "
            "Requires teacher/admin privileges. "
            "Validates existence and access rights."
    ),
    responses={
        200: {"description": "Update success count"},
        403: {"description": "Insufficient privileges"},
        404: {"description": "Some students not found"},
        409: {"description": "Duplicate educational ID"}
    }
)
async def update_student(
        updates: List[UpdateStudentModel],
        session: AsyncSession = Depends(create_session),
        current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Bulk update students with:
    - Existence validation
    - Privilege check
    - Conflict detection

    Args:
        updates: List of student updates
        session: Database session
        current_user: Authenticated user info

    Returns:
        Operation status with update count
    """
    return await crud.update_student(updates, session, current_user)


@router.delete(
    '',
    status_code=status.HTTP_200_OK,
    summary="Bulk delete students",
    description=(
            "Delete multiple students by ID. "
            "Requires admin privileges. "
            "Validates existence."
    ),
    responses={
        200: {"description": "Deletion success count"},
        403: {"description": "Non-admin access"},
        404: {"description": "Some students not found"}
    }
)
async def delete_student(
        student_ids: List[int] = Query(
            ...,
            description="List of student IDs to delete",
            example=[1, 2],
            ge=1
        ),
        session: AsyncSession = Depends(create_session),
        current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Bulk delete students with:
    - Admin privilege check
    - Existence validation

    Args:
        student_ids: List of student IDs
        session: Database session
        current_user: Authenticated user info

    Returns:
        Operation status with deletion count
    """
    return await crud.delete_student(student_ids, session, current_user)