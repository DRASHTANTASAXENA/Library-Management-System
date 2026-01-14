from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime

def get_books(db: Session):
    return db.query(models.Book).all()

def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def issue_book(db: Session, book_id: int, user_id: int):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        return None, "Book not found"
    if book.issued_to:
        return None, "Book already issued"

    book.issued_to = user_id
    book.issue_date = datetime.now()
    db.commit()
    return book, None

def return_book(db: Session, book_id: int):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        return None, "Book not found"
    book.issued_to = None
    book.issue_date = None
    book.return_date = datetime.now()
    db.commit()
    return book, None
