from authx import AuthX, AuthXConfig

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import becfg
from src.api.user import UserLogin
from src.database.tables import User
from src.database.engine import create_session

router = APIRouter(prefix='/auth', tags=['User'])

cfg = AuthXConfig()
cfg.JWT_SECRET_KEY = becfg.JWT_SECRET_KEY
cfg.JWT_ACCESS_COOKIE_NAME = "access_token"
cfg.JWT_REFRESH_COOKIE_NAME = "refresh_token"
cfg.JWT_TOKEN_LOCATION = ["cookies"]

security = AuthX(config=cfg)

@router.post("/login")
async def login(creds: UserLogin, session: AsyncSession = Depends(create_session)):
    statement = select(User).where(User.login == creds.login)
    result = await session.execute(statement)
    user: User = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.password != creds.password:
        raise HTTPException(status_code=401, detail="Incorrect credentials")

    token = security.create_access_token(uid=f'{user.id}')
    return {"access_token": token, "token_type": "bearer"}