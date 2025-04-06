from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Δημιουργία του engine
SQLALCHEMY_DATABASE_URL = "sqlite:///legal_db.sqlite"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Δημιουργία του SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 