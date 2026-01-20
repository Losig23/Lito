from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base

class Ping(Base):
    __tablename__ = "ping"

    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str] = mapped_column(String(50), nullable=False)
