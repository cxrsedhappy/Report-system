import random
import string

from fastapi import HTTPException

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.groups.models import CreateGroupModel, GroupModel
from backend.database.tables import Group, Student


# 2 - Гульнара Рифовна
# 1 - Преподаватели
# 0 - Гости

async def create_group(group: CreateGroupModel, session: AsyncSession, current_user) -> GroupModel:
    # if current_user.get('privilege') == 0:
    #     raise HTTPException(403, detail="You don't have rights to create group")

    new_group = Group(name=group.name)
    session.add(new_group)
    print(session.is_active)
    await session.commit()
    await session.refresh(new_group)
    return GroupModel.model_validate(new_group)


async def get_group(group_id: int | None, session: AsyncSession, current_user) -> list[GroupModel]:
    # if current_user.get('privilege') == 0:
    #     raise HTTPException(403, detail="You don't have rights to get student")

    if group_id is None:
        statement = select(Group).order_by(Group.id)
    else:
        statement = select(Group).where(Group.id == group_id).order_by(Group.id)

    result = await session.execute(statement)
    groups = result.scalars().all()
    return [GroupModel.model_validate(group) for group in groups]


async def add_student_to_group(student_id: int, group_id: int, session: AsyncSession, current_user) -> bool:
    # if current_user.get('privilege') == 0:
    #     raise HTTPException(403, detail="You don't have rights to get student")

    group = await session.get(Group, group_id)
    student = await session.get(Student, student_id)
    print(group, '\n', student)
    group.students.append(student)
    await session.commit()
    return True


async def update_student():
    ...


async def delete_student(group_ids: list[int], session: AsyncSession, current_user) -> bool:
    # if current_user.get('privilege') == 0:
    #     raise HTTPException(403, detail="You don't have rights to delete student")

    await session.execute(delete(Group).where(Group.id.in_(group_ids)))
    await session.commit()
    return True