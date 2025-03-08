from typing import List

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.subject.models import CreateSubjectModel, UpdateSubjectModel, SubjectModel
from backend.database.tables.student import Subject

# Константы уровней привилегий
GUEST_PRIVILEGE = 0
TEACHER_PRIVILEGE = 1
ADMIN_PRIVILEGE = 2

async def create_subject(subject: CreateSubjectModel, session: AsyncSession, current_user: dict) -> SubjectModel:
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Создание предмета запрещено для гостей'
        )

    new_subject = Subject(name=subject.name)
    session.add(new_subject)
    await session.commit()
    await session.refresh(new_subject)
    return SubjectModel.model_validate(new_subject)


async def get_subject(subject_id: int, session: AsyncSession, current_user: dict) -> List[SubjectModel]:
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Получение предмета запрещено для гостей'
        )

    query = select(Subject).where(Subject.id == subject_id)



async def update_subject(subjects: list[UpdateSubjectModel], session: AsyncSession, current_user: dict):
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Обновление предмета запрещено для гостей'
        )

async def delete_subject(subject_ids: list[int], session: AsyncSession, current_user: dict):
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Удаление предмета запрещено для гостей'
        )
