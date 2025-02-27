from typing import List, Optional, Sequence
from fastapi import HTTPException, status
from sqlalchemy import select, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from backend.api.groups.models import CreateGroupModel, GroupModel, UpdateGroupModel
from backend.database.tables import Group, Student

# Константы уровней привилегий
GUEST_PRIVILEGE = 0
TEACHER_PRIVILEGE = 1
ADMIN_PRIVILEGE = 2 


async def create_group(group: CreateGroupModel, session: AsyncSession, current_user: dict) -> GroupModel:
    """
    Создает новую группу при наличии достаточных прав.

    Проверяет права пользователя и создает новую группу в базе данных.
    Записывает изменения в БД и возвращает созданную группу.

    Args:
        group: Модель данных для создания группы
        session: Асинхронная сессия SQLAlchemy
        current_user: Данные текущего пользователя

    Returns:
        GroupModel: Созданная группа

    Raises:
        HTTPException: При недостаточных правах (403)
    """
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Создание групп запрещено для гостей"
        )

    new_group = Group(name=group.name)
    session.add(new_group)
    await session.commit()
    await session.refresh(new_group)
    return GroupModel.model_validate(new_group)


async def get_group(group_id: Optional[int], session: AsyncSession, current_user: dict) -> Sequence[Group]:
    """
    Получает список групп или конкретную группу с учениками.

    Args:
        group_id: Идентификатор группы (None для всех групп)
        session: Асинхронная сессия SQLAlchemy
        current_user: Данные текущего пользователя

    Returns:
        Sequence[Group]: Список групп с предзагруженными учениками

    Raises:
        HTTPException: При недостаточных правах (403)
        HTTPException: Если запрашиваемая группа не найдена (404)
    """
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Просмотр групп запрещен для гостей"
        )

    query = select(Group).options(selectinload(Group.students))

    if group_id is not None:
        query = query.where(Group.id == group_id)
        result = await session.execute(query)
        group = result.scalars().first()
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Группа с ID {group_id} не найдена"
            )
        return [group]

    return (await session.execute(query.order_by(Group.id))).scalars().all()


async def add_student_to_group(
        student_id: int,
        group_id: int,
        session: AsyncSession,
        current_user: dict
) -> dict:
    """
    Добавляет ученика в группу при наличии прав.

    Args:
        student_id: ID ученика
        group_id: ID группы
        session: Асинхронная сессия
        current_user: Данные пользователя

    Returns:
        dict: Статус операции

    Raises:
        HTTPException: При недостаточных правах (403)
        HTTPException: Если группа/ученик не найдены (404)
        HTTPException: Если ученик уже в группе (409)
    """
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Изменение состава групп запрещено для гостей"
        )

    group = await session.get(Group, group_id)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Группа {group_id} не найдена"
        )

    student = await session.get(Student, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ученик {student_id} не найден"
        )

    if student in group.students:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ученик уже состоит в группе"
        )

    group.students.append(student)
    await session.commit()
    return {"status": "success", "group_id": group_id, "student_id": student_id}


async def update_group(groups: List[UpdateGroupModel], session: AsyncSession, current_user: dict) -> dict:
    """
    Обновляет несколько групп (bulk update).

    Args:
        groups: Список моделей обновления групп
        session: Асинхронная сессия
        current_user: Данные пользователя

    Returns:
        dict: Статус операции

    Raises:
        HTTPException: При недостаточных правах (403)
        HTTPException: Если какая-либо группа не найдена (404)
    """
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Обновление групп запрещено для гостей")

    existing_groups = (await session.execute(select(Group.id))).scalars().all()
    group_ids = [g.id for g in groups]

    # Проверяем существование всех групп
    for group_id in group_ids:
        if group_id not in existing_groups:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Группа {group_id} не найдена")

    # Пакетное обновление
    for group in groups:
        await session.execute(
            update(Group)
            .where(Group.id == group.id)
            .values(name=group.name)
        )

    await session.commit()
    return {"status": "success", "updated": len(groups)}


async def delete_group(group_ids: List[int], session: AsyncSession, current_user: dict) -> dict:
    """
    Удаляет несколько групп (bulk delete).

    Args:
        group_ids: Список ID удаляемых групп
        session: Асинхронная сессия
        current_user: Данные пользователя

    Returns:
        dict: Статус операции

    Raises:
        HTTPException: При недостаточных правах (403)
        HTTPException: Если какая-либо группа не найдена (404)
    """
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Удаление групп запрещено для гостей")

    existing_groups = (await session.execute(select(Group.id))).scalars().all()
    missing = [gid for gid in group_ids if gid not in existing_groups]

    if missing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Группы {missing} не найдены")

    await session.execute(delete(Group).where(Group.id.in_(group_ids)))
    await session.commit()

    return {"status": "success", "deleted": len(group_ids)}