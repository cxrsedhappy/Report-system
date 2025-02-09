import random
import string

from fastapi import HTTPException

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_password_hash
from backend.api.user.models import UserSchema, CreateUserSchema, UserParamSchema
from backend.database.tables import User


async def create_user(user: CreateUserSchema, session: AsyncSession) -> UserSchema:
    salt = ''.join(random.choices(string.digits + string.punctuation + string.ascii_letters, k=8))
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
    user_schema = UserSchema.model_validate(new_user)
    return user_schema


async def get_users_by_id(user_id: int, session: AsyncSession) -> list[UserSchema]:
    if not user_id:
        statement = select(User).order_by(User.id)
    else:
        statement = select(User).where(User.id == user_id).order_by(User.id)

    result = await session.execute(statement)
    users = result.scalars().all()
    return [UserSchema.model_validate(user) for user in users]


async def update_user(
        updated_users: list[UserParamSchema],
        session: AsyncSession,
        current_user: dict
):
    for user in updated_users:

        user_id = user.id
        login = user.login
        name = user.name
        surname = user.surname
        lastname = user.lastname
        privilege = user.privilege

        # Проверка прав пользователя
        if current_user['id'] != user_id and current_user.get('privilege') == 0:
            raise HTTPException(status_code=403, detail="You can't change other user's data")

        # Обновление логина
        if login:
            if current_user['id'] != user_id:
                raise HTTPException(status_code=403, detail="You can't change other user's login")

            await _update_user_field(session, user_id, login=login)

        # Обновление других данных
        if current_user.get('privilege') != 2 and privilege is not None:
            raise HTTPException(status_code=403, detail="You have no rights to change user's privilege")

        # Обновление имени, фамилии, отчества
        if name:
            await _update_user_field(session, user_id, name=name)

        if surname:
            await _update_user_field(session, user_id, surname=surname)

        if lastname:
            await _update_user_field(session, user_id, lastname=lastname)

        # Обновление привилегий
        if privilege is not None:
            await _update_user_field(session, user_id, privilege=privilege)

        await session.commit()

async def _update_user_field(session: AsyncSession, user_id: int, **fields):
    """Обновление указанных полей пользователя."""
    statement = (
        update(User)
        .where(User.id == user_id)
        .values(**fields)
    )
    await session.execute(statement)

async def delete_user(user_ids: list[int], session, current_user):
    privilege = current_user.get('privilege')

    if privilege != 3:
        raise HTTPException(status_code=403, detail='You have no rights to delete users')

    statement = (
        delete(User)
        .where(User.id.in_(user_ids))
    )
    await session.execute(statement)
    await session.commit()
