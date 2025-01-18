from __future__ import annotations

import sys
import logging

from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from backend.config import dbcfg
from backend.database.tables import Base

print(dbcfg.URL)
engine = create_async_engine(
    url=dbcfg.URL,
    echo=dbcfg.ECHO
)

logger = logging.getLogger('uvicorn.error')

session_factory = async_sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False
)


async def global_init():
    """Database initialization"""
    async with engine.begin() as connection:
        try:
            if dbcfg.DROPS_AFTER_START:
                logger.info("Dropping existed tables. DROPS_AFTER_START=True.")
                await connection.run_sync(Base.metadata.drop_all)

            await connection.run_sync(Base.metadata.create_all)
            logger.info("Database tables created successfully.")
        except OperationalError as e:
            logger.error(f"Error occurred when trying create tables: {e}.")
            sys.exit(1)


async def create_session() -> AsyncSession:
    async with session_factory() as session:
        yield session