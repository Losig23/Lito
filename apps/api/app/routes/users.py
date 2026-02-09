from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.deps import get_db
from app.models import User
from app.schemas.users import UserCreate, UserOut

router = APIRouter(prefix="/users", tags=["users"])

@router.get("", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    users = db.execute(select(User).order_by(User.id)).scalars().all()
    return users

@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    # basic uniqueness checks (good for nicer errors)
    existing_email = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if existing_email:
        raise HTTPException(status_code=409, detail="Email already exists")

    existing_username = db.execute(select(User).where(User.username == payload.username)).scalar_one_or_none()
    if existing_username:
        raise HTTPException(status_code=409, detail="Username already exists")

    user = User(email=payload.email, username=payload.username)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
