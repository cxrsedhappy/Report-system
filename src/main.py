from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from database.engine import global_init
from database.tables.student import Student
from src.database.engine import create_session


@asynccontextmanager
async def lifespan(app: FastAPI):
    await global_init()
    yield

app = FastAPI(title='Reporting System', version='0.0.1', lifespan=lifespan)

@app.get('/')
async def index(session: AsyncSession = Depends(create_session)):
    s = Student(id=1, name='ASD')
    session.add(s)
    await session.commit()
    return {'Ping': 'Pong'}


if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)