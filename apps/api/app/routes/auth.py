from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.deps import get_db, get_current_user
from app.models import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.users import UserOut
from app.jwt import create_access_token
from app.security import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    # uniqueness checks
    if db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already exists")

    if db.execute(select(User).where(User.username == payload.username)).scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Username already exists")

    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
