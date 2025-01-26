from contextlib import asynccontextmanager

import logging
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database.engine import global_init
from backend.api import user_router, auth_router, student_router, subject_router, group_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('Database initialization was started.')
    await global_init()
    logger.info('Database initialization was finished.')
    yield

app = FastAPI(title='Reporting System', version='0.0.1', lifespan=lifespan)
app.include_router(user_router)
app.include_router(student_router)
app.include_router(subject_router)
app.include_router(group_router)
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
logger = logging.getLogger('uvicorn.error')


if __name__ == '__main__':
    uvicorn.run('main:app', host='localhost', port=8000, reload=True)