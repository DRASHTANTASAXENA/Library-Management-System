from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ---------- DATABASE URL ----------
# SQLite (you can change it to PostgreSQL/MySQL if needed)
SQLALCHEMY_DATABASE_URL = "sqlite:///./library.db"

# ---------- ENGINE ----------
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    pool_size=10,       # Increase from 5 to 10
    max_overflow=20     # Allow up to 20 extra connections
)
# ---------- SESSION ----------
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ---------- BASE ----------
Base = declarative_base()


# ---------- DEPENDENCY ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
