from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import Config

engine = create_async_engine(Config.DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession)
Base = declarative_base()


async def get_db() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()