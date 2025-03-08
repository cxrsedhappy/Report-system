from typing import List

from fastapi import APIRouter, Depends, status

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_current_user
from backend.database.engine import create_session
from backend.api.subject import crud
from backend.api.subject.models import SubjectModel, CreateSubjectModel, UpdateSubjectModel

router = APIRouter(prefix='/api/subject', tags=['Subject'])

@router.post(
    '',
    response_model=SubjectModel,
    status_code=status.HTTP_201_CREATED,
    summary="Create new subject",
    description=(
        "Requires teacher/admin privileges."
        "Creates student with unique educational ID."
        "Validates data integrity and access rights."
    ),
    responses={
        201: {"description": "Subject created"},
        403: {"description": "Insufficient privileges"},
        409: {"description": "Duplicate educational ID"}
    }
)
async def create_subject(
        subject: CreateSubjectModel,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
) -> SubjectModel:
    return await crud.create_subject(subject, session, current_user)

@router.get(
    '',
    response_model=List[SubjectModel],
    status_code=status.HTTP_200_OK,
    summary="Retrieve subject",
    description=(
            "Get all subjects or filter by ID. "
            "Requires authentication."
    ),
    responses={
        200: {"description": "List of subjects"},
        403: {"description": "Guest access forbidden"},
        404: {"description": "Subject not found"}
    }
)
async def get_subject(
        subject_id: int,
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
) -> List[SubjectModel]:
    return await crud.get_subject(subject_id, session, current_user)

@router.put(
    '',
    status_code=status.HTTP_200_OK,
    summary="Bulk update subjects",
    description=(
            "Update multiple subjects."
            "Requires teacher/admin privileges."
            "Validates existence and access rights."
    ),
    responses={
        200: {"description": "Update success"},
        403: {"description": "Insufficient privileges"},
        404: {"description": "Some subjects not found"},
    }
)
async def update_subject(
        subjects: list[UpdateSubjectModel],
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
) -> dict:
    return await crud.update_subject(subjects, session, current_user)

@router.delete(
    '',
    status_code=status.HTTP_200_OK,
    summary="Bulk delete subject",
    description=(
            "Delete multiple subjects by ID. "
            "Requires admin privileges. "
            "Validates existence."
    ),
    responses={
        200: {"description": "Deletion success"},
        403: {"description": "Non-admin/teacher access"},
        404: {"description": "Some subjects not found"}
    }
)
async def delete_subject(
        subject_ids: list[int],
        session: AsyncSession = Depends(create_session),
        current_user = Depends(get_current_user)
) -> dict:
    return await crud.delete_subject(subject_ids, session, current_user)