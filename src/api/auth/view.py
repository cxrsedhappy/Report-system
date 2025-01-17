from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response

from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.auth.auth import create_access_token, verify_password
from src.api.auth.models import Credentials
from src.database.tables import User
from src.database.engine import create_session

auth = APIRouter(prefix='/oauth2', tags=['oauth2'])

@auth.post("/authorize")
async def login(response: Response, creds: Credentials, session: AsyncSession = Depends(create_session)):
    statement = select(User).where(User.login == creds.login)
    result = await session.execute(statement)
    user: User = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(creds.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")

    payload = {"id": user.id, "login": user.login}
    token = create_access_token(payload, timedelta(days=30))
    response.set_cookie(key="access_token", value=token, max_age=30 * 24 * 60 * 60)

    return {"access_token": token, "token_type": "bearer"}