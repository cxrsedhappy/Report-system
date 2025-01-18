from contextlib import asynccontextmanager

import logging
import uvicorn

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database.engine import global_init, create_session
from backend.database.tables.user import User
from backend.api import user_router, auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('Database initialization was started.')
    await global_init()
    logger.info('Database initialization was finished.')
    yield

app = FastAPI(title='Reporting System', version='0.0.1', lifespan=lifespan)
app.include_router(user_router)
app.include_router(auth_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
logger = logging.getLogger('uvicorn.error')
@app.get('/')
async def index(session: AsyncSession = Depends(create_session)):
    user = User(login="login", password="passwd", name="name", surname="surname", lastname="lastname", privilege=3)
    session.add(user)
    await session.commit()
    return {'Ping': 'Pong'}


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)