from fastapi import FastAPI
from sqlalchemy import text
from app.db import engine

from app.routes.users import router as users_router

app = FastAPI(title="Lito API", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/db")
def health_db():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"db": "ok"}

# Feature routers
app.include_router(users_router, prefix="/api")