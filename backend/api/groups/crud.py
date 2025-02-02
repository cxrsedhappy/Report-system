from typing import List, Optional, Sequence
from fastapi import HTTPException
from sqlalchemy import select, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from backend.api.groups.models import CreateGroupModel, GroupModel, UpdateGroupModel
from backend.database.tables import Group, Student

# Constants for privilege levels
GUEST_PRIVILEGE = 0
TEACHER_PRIVILEGE = 1
ADMIN_PRIVILEGE = 2


async def create_group(group: CreateGroupModel, session: AsyncSession, current_user: dict) -> GroupModel:
    """Create a new group if the user has sufficient privileges."""
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(status_code=403, detail="Insufficient privileges to create a group")

    new_group = Group(name=group.name)
    session.add(new_group)
    await session.commit()
    await session.refresh(new_group)
    return GroupModel.model_validate(new_group)


async def get_group(group_id: Optional[int], session: AsyncSession, current_user: dict) -> Sequence[Group]:
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(status_code=403, detail="Insufficient privileges to retrieve groups")

    if group_id is None:
        statement = select(Group).options(selectinload(Group.students)).order_by(Group.id)
    else:
        statement = select(Group).where(Group.id == group_id).options(selectinload(Group.students))

    result = await session.execute(statement)
    groups = result.scalars().all()

    return groups


async def add_student_to_group(student_id: int, group_id: int, session: AsyncSession, current_user: dict):
    """Add a student to a group if the user has sufficient privileges."""
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(status_code=403, detail="Insufficient privileges to add a student to a group")

    group = await session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail=f"Group with id {group_id} not found")

    student = await session.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student with id {student_id} not found")

    group.students.append(student)
    await session.commit()
    return {"status": "success"}


async def update_group(groups: List[UpdateGroupModel], session: AsyncSession, current_user: dict):
    """Update multiple groups if the user has sufficient privileges."""
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(status_code=403, detail="Insufficient privileges to update groups")

    for group in groups:
        gid = group.id
        name = group.name
        statement = (
            update(Group)
            .where(Group.id == gid)
            .values(name=name)
        )
        await session.execute(statement)
        await session.commit()

    return {"status": "success"}


async def delete_group(group_ids: List[int], session: AsyncSession, current_user: dict):
    """Delete multiple groups if the user has sufficient privileges."""
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(status_code=403, detail="Insufficient privileges to delete groups")

    await session.execute(delete(Group).where(Group.id.in_(group_ids)))
    await session.commit()
    return {"status": "success"}