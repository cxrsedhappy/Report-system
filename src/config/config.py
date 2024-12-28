import os

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class DataBaseConfig(BaseModel):
    NAME: str = 'ReportSystem'
    USER: str = 'postgres'
    PASSWORD: str = 'admin12345'
    HOST: str = 'localhost'
    PORT: int = 5432
    PLUGIN: str = 'asyncpg'
    URL: str = f"postgresql+{PLUGIN}://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}"
    ECHO: bool = True
    DROPS_AFTER_START: bool = True


class BackEndConfig(BaseModel):
    ALGORITHM: str = os.environ.get('ALGORITHM')
    SECRET_KEY: str = os.environ.get('SECRET_KEY')


dbcfg = DataBaseConfig()    # dbcfg stands for Database Config
becfg = BackEndConfig()     # becfg stands for BackEnd Config
