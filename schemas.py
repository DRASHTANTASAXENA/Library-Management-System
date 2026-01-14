from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class BookCreate(BaseModel):
    title: str
    author: str
    category: str

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    category: str
    issued_to: Optional[str] = None
    issue_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: Optional[str] = None

    class Config:
        from_attributes = True

class UserChangePassword(BaseModel):
    old_password: str
    new_password: str

class ReturnRequest(BaseModel):
    fine_paid: bool
    remarks: str = ""