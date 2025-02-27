from typing import List, Optional

from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.api.auth.auth import get_current_user
from backend.api.groups import crud
from backend.api.groups.models import GroupModel, CreateGroupModel, UpdateGroupModel
from backend.database.engine import create_session

router = APIRouter(prefix='/api/group', tags=['Groups'])

@router.post(
    '',
    response_model=GroupModel,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new educational group",
    description="Requires teacher/admin privileges. Creates a new group with the given name."
)
async def create_group(
    new_group: CreateGroupModel,
    session: AsyncSession = Depends(create_session),
    current_user: dict = Depends(get_current_user)
) -> GroupModel:
    """
    Create a new group with the following checks:
    - User authentication
    - Sufficient privileges (teacher/admin)
    - Group name validity

    **Response:**
    - 201 Created: Group successfully created
    - 401 Unauthorized: Missing authentication
    - 403 Forbidden: Insufficient privileges
    """
    return await crud.create_group(new_group, session, current_user)

@router.get(
    '',
    response_model=List[GroupModel],
    status_code=status.HTTP_200_OK,
    summary="Retrieve groups",
    description="Get all groups or filter by ID. Returns groups with associated students."
)
async def get_group(
    group_id: Optional[int] = None,
    session: AsyncSession = Depends(create_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve groups with the following behavior:
    - Returns all groups if no ID provided
    - Returns specific group if ID provided
    - Includes nested student data

    **Response:**
    - 200 OK: List of groups
    - 403 Forbidden: Guest access attempt
    - 404 Not Found: Requested group doesn't exist
    """
    return await crud.get_group(group_id, session, current_user)

@router.put(
    '',
    status_code=status.HTTP_200_OK,
    summary="Bulk update groups",
    description="Update multiple groups' names. Requires teacher/admin privileges."
)
async def update_group(
    groups: List[UpdateGroupModel],
    session: AsyncSession = Depends(create_session),
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Update multiple groups.
    """
    return await crud.update_group(groups, session, current_user)

@router.delete(
    '',
    status_code=status.HTTP_200_OK,
    summary="Bulk delete groups",
    description="Delete multiple groups by ID list. Requires admin privileges."
)
async def delete_group(
    group_ids: List[int] = Query(
        ...,
        description="List of group IDs to delete",
        example=[1, 2, 3]
    ),
    session: AsyncSession = Depends(create_session),
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Delete groups with:
    - Authentication check
    - Admin privilege requirement
    - Existence validation

    **Response:**
    - 200 OK: { "status": "success", "deleted": 3 }
    - 403 Forbidden: Non-admin access
    - 404 Not Found: Any group ID invalid
    """
    return await crud.delete_group(group_ids, session, current_user)

@router.post(
    '/add',
    status_code=status.HTTP_200_OK,
    summary="Add student to group",
    description="Assign a student to a group. Requires teacher/admin privileges."
)
async def add_student_to_group(
    student_id: int = Query(..., description="ID of the student to add"),
    group_id: int = Query(..., description="Target group ID"),
    session: AsyncSession = Depends(create_session),
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Student assignment with:
    - Privilege check
    - Existence verification for both student and group
    - Duplicate membership prevention
    
    **Response:**
    - 200 OK: { "status": "success", "group_id": 1, "student_id": 123 }
    - 403 Forbidden: Guest access
    - 404 Not Found: Invalid student/group ID
    - 409 Conflict: Student already in group
    """

    return await crud.add_student_to_group(student_id, group_id, session, current_user)