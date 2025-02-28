from typing import List, Optional

import string
import secrets

from fastapi import HTTPException, status
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_password_hash
from backend.api.user.models import UserSchema, CreateUserSchema, UserParamSchema
from backend.database.tables import User


async def create_user(user: CreateUserSchema, session: AsyncSession) -> UserSchema:
    """
    Создает нового пользователя с хешированием пароля.

    Проверяет уникальность логина, генерирует соль и хеш пароля.

    Args:
        user: Данные для создания пользователя
        session: Асинхронная сессия БД

    Returns:
        UserSchema: Созданный пользователь

    Raises:
        HTTPException: 409 - Логин занят
    """
    # Проверка уникальности логина
    existing_user = await session.execute(select(User).where(User.login == user.login))

    if existing_user.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Логин '{user.login}' уже занят"
        )

    # Генерация криптографически безопасной соли
    salt = ''.join(secrets.choice(string.ascii_letters + string.digits + string.punctuation) for _ in range(16))
    hashed_password = get_password_hash(user.password, salt)

    new_user = User(
        login=user.login,
        password=hashed_password,
        salt=salt,
        name=user.name,
        surname=user.surname,
        lastname=user.lastname,
        privilege=user.privilege
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return UserSchema.model_validate(new_user)


async def get_users_by_id(user_id: Optional[int] = None, session: AsyncSession = None) -> List[UserSchema]:
    """
    Получает пользователей по ID или всех пользователей.

    Args:
        user_id: ID пользователя или None для всех
        session: Асинхронная сессия

    Returns:
        Список пользователей
    """
    query = select(User)
    if user_id is not None:
        query = query.where(User.id == user_id)

    result = await session.execute(query.order_by(User.id))
    return [UserSchema.model_validate(u) for u in result.scalars().all()]


async def update_user(updates: List[UserParamSchema], session: AsyncSession, current_user: dict) -> dict:
    """
    Пакетное обновление пользователей с проверкой прав.

    Args:
        updates: Список обновлений
        session: Сессия БД
        current_user: Текущий пользователь

    Returns:
        Статус операции

    Raises:
        HTTPException: 403 - Недостаточно прав
        HTTPException: 404 - Пользователь не найден
    """
    # Предварительная проверка существования пользователей
    _ = await session.execute(select(User.id))
    existing_ids = {u for u in _.scalars().all()}
    update_ids = {u.id for u in updates}
    missing = update_ids - existing_ids
    if missing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователи {missing} не найдены"
        )

    # Пакетное обновление
    for user_update in updates:
        # Проверка прав на изменение
        if current_user['id'] != user_update.id and current_user['privilege'] < 2:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Недостаточно прав для изменения чужих данных"
            )

        # Проверка прав на изменение привилегий
        if user_update.privilege is not None and current_user['privilege'] < 2:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Только администратор может менять привилегии"
            )

        # Обновление логина
        if user_update.login:
            if current_user['id'] != user_update.id and current_user['privilege'] < 2:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Только владелец или администратор может менять логин"
                )

        # Сборка параметров обновления
        update_data = user_update.model_dump(exclude_unset=True)
        if 'password' in update_data:
            raise NotImplementedError("Смена пароля требует отдельной реализации")

        await session.execute(update(User).where(User.id == user_update.id).values(**update_data))

    await session.commit()
    return {"status": "success", "updated": len(updates)}


async def delete_user(user_ids: List[int], session: AsyncSession, current_user: dict) -> dict:
    """
    Удаляет пользователей по ID.

    Args:
        user_ids: Список ID пользователей
        session: Сессия БД
        current_user: Текущий пользователь

    Returns:
        Статус операции

    Raises:
        HTTPException: 403 - Недостаточно прав
        HTTPException: 404 - Пользователи не найдены
    """
    if current_user['privilege'] < 2:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только администратор может удалять пользователей"
        )

    _ = await session.execute(select(User.id))
    existing = set(_.scalars().all())
    to_delete = set(user_ids)
    missing = to_delete - existing

    if missing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователи {missing} не найдены"
        )

    await session.execute(
        delete(User)
        .where(User.id.in_(user_ids))
    )
    await session.commit()
    return {"status": "success", "deleted": len(user_ids)}
