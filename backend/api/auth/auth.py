from datetime import timedelta, datetime

from jose import jwt, JWTError

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from passlib.context import CryptContext

from backend.config import becfg

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="oauth2/authorize")

secret_key = becfg.SECRET_KEY
algorithm = becfg.ALGORITHM

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        uid: int = payload.get("id")
        login: str = payload.get("login")
        privilege: int = payload.get("privilege")

        if uid is None or login is None:
            raise credentials_exception

        return {"id": uid, "login": login, "privilege": privilege}
    except JWTError:
        raise credentials_exception

def create_access_token(payload: dict, expires_delta: timedelta = timedelta(days=7)):
    expire = datetime.now() + expires_delta
    payload.update({"exp": expire})
    return jwt.encode(payload, secret_key, algorithm=algorithm)

def verify_password(password, hashed_password, salt=''):
    return bcrypt_context.verify(password + salt, hashed_password)

def get_password_hash(password, salt=''):
    return bcrypt_context.hash(password + salt)

