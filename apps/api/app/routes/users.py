from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.deps import get_db, get_current_user
from app.models import User
from app.schemas.users import UserOut

router = APIRouter(prefix="/users", tags=["users"])

@router.get("", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    users = db.execute(select(User).order_by(User.id)).scalars().all()
    return users

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
