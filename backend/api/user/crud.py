import random
import string

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.auth import get_password_hash
from backend.api.user.models import UserSchema, CreateUserSchema
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
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    user_schema = UserSchema.model_validate(new_user)
    return user_schema

async def get_users_by_id(ids: list[int], session: AsyncSession) -> list[UserSchema]:
    statement = select(User).where(User.id.in_(ids))
    result = await session.execute(statement)
    users = result.scalars().all()
    return [UserSchema.model_validate(user) for user in users]
