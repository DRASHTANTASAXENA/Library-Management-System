from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from database import Base

class Admin(Base):
    __tablename__ = "admins"
    id = Column(String, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    category = Column(String)
    issued_to = Column(String, ForeignKey("users.id"), nullable=True)
    issue_date = Column(DateTime, nullable=True)
