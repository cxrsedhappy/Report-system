import random
import string

from sqlalchemy.ext.asyncio import AsyncSession

from src.api.auth.auth import get_password_hash
from src.api.user.models import CreateUserSchema
from src.database.tables import User


async def create_user(user: CreateUserSchema, session: AsyncSession):
    salt = ''.join(random.choices(string.digits + string.punctuation + string.ascii_letters, k=8))
    hashed_password = get_password_hash(user.password, salt)

    new_user = User(
        login=user.login,
        password=hashed_password,
        salt=salt,
        name=user.name,
        surname=user.surname,
        lastname=user.lastname
    )
    session.add(new_user)
    await session.commit()
    return new_user
