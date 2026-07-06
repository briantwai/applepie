# backend/app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# We'll use a local SQLite file 'leads.db' for easy setup. No installation needed!
SQLALCHEMY_DATABASE_URL = "sqlite:///./leads.db"

engine = create_engine(
    # check_same_thread=False is only needed for SQLite
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# This dependency yields a database session to our API routes and closes it when done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()