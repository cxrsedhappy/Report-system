from __future__ import annotations

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.declarative import declarative_base

from src.config import dbcfg

Base = declarative_base()

engine = create_async_engine(
    url=dbcfg.URL,
    echo=dbcfg.ECHO
)

session_factory = async_sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False
)


async def global_init():
    """Database initialization"""
    async with engine.begin() as connection:
        if dbcfg.DROPS_AFTER_START:
            await connection.run_sync(Base.metadata.drop_all)

        await connection.run_sync(Base.metadata.create_all)
        print(engine.url)


async def create_session() -> AsyncSession:
    async with session_factory() as session:
        yield session