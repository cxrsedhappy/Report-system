from fastapi import APIRouter, Depends, status
from fastapi.responses import FileResponse

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_current_user
from backend.api.user import crud
from backend.api.user.models import UserSchema, CreateUserSchema, UserParamSchema
from backend.database.engine import create_session

router = APIRouter(prefix='/api/user', tags=['User'])

@router.post('', response_model=UserSchema)
async def create_user(user: CreateUserSchema, session: AsyncSession = Depends(create_session)):
    return await crud.create_user(user, session)


@router.get('/get_report')
async def protected(group_id: int, session: AsyncSession = Depends(create_session)):
   return await crud.get_group_report(group_id, session, 4)


@router.get(
    '',
    summary="Получить пользователей по ID",
    response_model=list[UserSchema]
)
async def get_users_by_id(user_id: int = None, session: AsyncSession = Depends(create_session)) -> list[UserSchema]:
    """
    Получает список пользователей по ID (или всех пользователей, если ID не указан)

    Args:
        user_id: Идентификатор пользователя (опционально)
        session: Асинхронная сессия SQLAlchemy

    Returns:
        list[UserSchema]: Список пользователей

    Raises:
        HTTPException: 404 - Пользователь не найден
    """
    return await crud.get_users_by_id(user_id, session)

@router.put(
    '',
    summary="Обновить пользователей",
    response_model=list[UserSchema]
)
async def update_user(
    updated_users: list[UserParamSchema],
    session: AsyncSession = Depends(create_session),
    current_user: UserSchema = Depends(get_current_user)
) -> dict:
    """
    Обновляет данные пользователей (требует авторизации)

    Args:
        updated_users: Список пользователей с обновленными данными
        session: Асинхронная сессия SQLAlchemy
        current_user: Текущий авторизованный пользователь

    Returns:
        list[UserSchema]: Обновленные пользователи

    Raises:
        HTTPException: 403 - Недостаточно прав
        HTTPException: 404 - Пользователь не найден
    """
    return await crud.update_user(updated_users, session, current_user)


@router.delete(
    '',
    summary="Удалить пользователей",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_users(
    user_ids: list[int],
    session: AsyncSession = Depends(create_session),
    current_user: UserSchema = Depends(get_current_user)
) -> None:
    """
    Удаляет пользователей по списку ID (требует авторизации)

    Args:
        user_ids: Список идентификаторов пользователей
        session: Асинхронная сессия SQLAlchemy
        current_user: Текущий авторизованный пользователь

    Raises:
        HTTPException: 403 - Недостаточно прав
        HTTPException: 404 - Пользователь не найден
    """
    await crud.delete_user(user_ids, session, current_user)