from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db

app = FastAPI()

@app.get("/health")
def read_root():
    return {"status": "ok"}

@app.get("/health/db")
def get_db_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError:
        print("/health/db: db connection error!")
        raise HTTPException(
            status_code=500,
            detail="Internal Error",
        )
    return {"db": "ok"}