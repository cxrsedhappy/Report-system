from sqlalchemy.ext.asyncio import AsyncSession

from src.api.user.models import CreateUser
from src.database.tables import User


async def create_user(user: CreateUser, session: AsyncSession):
    _ = User(
        login=user.login,
        password=user.password,
        name=user.name,
        surname=user.surname,
        lastname=user.lastname
    )
    session.add(_)
    await session.commit()
