from contextlib import asynccontextmanager

import logging
import uvicorn

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.engine import global_init, create_session
from src.database.tables.user import User


@asynccontextmanager
async def lifespan(app: FastAPI):
    await global_init()
    logger.info('Database initialization was finished.')
    yield

app = FastAPI(title='Reporting System', version='0.0.1', lifespan=lifespan)
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
    user = User(password="passwd", name="name", surname="surname", lastname="lastname")
    session.add(user)
    await session.commit()
    return {'Ping': 'Pong'}


if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)