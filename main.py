from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import models, schemas, auth
from database import SessionLocal, engine

# Recreate tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="LMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- AUTHENTICATION ----------

@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=user.email).first() or \
       db.query(models.Admin).filter_by(email=user.email).first():
        raise HTTPException(400, "Email already registered.")

    if user.role == "admin":
        count = db.query(models.Admin).count() + 1
        new_entry = models.Admin(
            id=f"ADMIN_{count}",
            name=user.name,
            email=user.email,
            password=auth.hash_password(user.password)
        )
    else:
        count = db.query(models.User).count() + 1
        new_entry = models.User(
            id=f"USER{count}",
            name=user.name,
            email=user.email,
            password=auth.hash_password(user.password)
        )

    db.add(new_entry)
    db.commit()
    return {"message": f"Registered successfully with ID: {new_entry.id}"}


@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    u = db.query(models.User).filter_by(email=user.email).first()
    a = db.query(models.Admin).filter_by(email=user.email).first()

    target = u or a
    role = "user" if u else "admin"

    if not target or not auth.verify_password(user.password, target.password):
        raise HTTPException(401, "Invalid email or password")

    token = auth.create_access_token({
        "sub": target.email,
        "role": role,
        "id": target.id
    })
    return {"access_token": token, "role": role}


# ---------- PROFILE & SECURITY (FIXED 404s) ----------

@app.get("/profile")
def get_profile(db: Session = Depends(get_db), current_user=Depends(auth.get_current_user)):
    """Fetches full profile data for either Admin or User to fix 404 error."""
    user_id = current_user["id"]

    # Check User table first
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        # Check Admin table
        user = db.query(models.Admin).filter(models.Admin.id == user_id).first()

    if not user:
        raise HTTPException(404, "Profile not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": current_user["role"]
    }


@app.post("/user/change-password")
def change_password(data: dict, db: Session = Depends(get_db), current_user=Depends(auth.get_current_user)):
    """Handles password updates to fix 404 error."""
    user_id = current_user["id"]
    new_password = data.get("new_password")

    if not new_password:
        raise HTTPException(400, "New password is required")

    hashed_pw = auth.hash_password(new_password)

    # Update in correct table
    if current_user["role"] == "admin":
        db.query(models.Admin).filter(models.Admin.id == user_id).update({"password": hashed_pw})
    else:
        db.query(models.User).filter(models.User.id == user_id).update({"password": hashed_pw})

    db.commit()
    return {"message": "Password updated successfully"}


# ---------- ADMIN SECTION ----------

@app.get("/admin/stats")
def admin_stats(db: Session = Depends(get_db), current_user=Depends(auth.admin_required)):
    return {
        "total_users": db.query(models.User).count(),
        "total_books": db.query(models.Book).count(),
        "total_issued": db.query(models.Book).filter(models.Book.issued_to != None).count()
    }


@app.get("/admin/users", response_model=list[schemas.UserResponse])
def admin_list_users(db: Session = Depends(get_db), current_user=Depends(auth.admin_required)):
    users = db.query(models.User).all()
    for u in users:
        u.role = "user"
    return users


@app.post("/admin/books")
def admin_add_book(book: schemas.BookCreate, count: int = 1, db: Session = Depends(get_db), current_user=Depends(auth.admin_required)):
    new_books = []
    for _ in range(count):
        db_book = models.Book(title=book.title, author=book.author, category=book.category)
        db.add(db_book)
        new_books.append(db_book)
    db.commit()
    return {"message": f"Added {count} copies of {book.title}"}


@app.post("/admin/issue-book")
def admin_issue_book(book_id: int, user_id: str, db: Session = Depends(get_db), current_user=Depends(auth.admin_required)):
    student = db.query(models.User).filter(models.User.id == user_id).first()
    if not student:
        raise HTTPException(404, "Invalid Student ID (e.g. USER1).")

    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book or book.issued_to:
        raise HTTPException(400, "Book unavailable for issue.")

    book.issued_to = user_id
    book.issue_date = datetime.now()
    db.commit()
    return {"message": f"Successfully issued to {student.name}"}


# @app.post("/books/return/{book_id}")
# def admin_return_book(book_id: int, db: Session = Depends(get_db), current_user=Depends(auth.admin_required)):
#     book = db.query(models.Book).filter(models.Book.id == book_id).first()
#     if not book or not book.issued_to:
#         raise HTTPException(400, "Book is not currently issued")
#     book.issued_to = None
#     book.issue_date = None
#     db.commit()
#     return {"message": "Book returned successfully"}

@app.post("/books/return/{book_id}")
def admin_return_book(
    book_id: int, 
    data: schemas.ReturnRequest, 
    db: Session = Depends(get_db), 
    current_user=Depends(auth.admin_required)
):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    
    if not book or not book.issued_to:
        raise HTTPException(400, "Return failed: Book is either invalid or not currently issued.")

    # Logic: Calculate fine (Example: $1 per day after 7 days)
    days_held = (datetime.now() - book.issue_date).days
    calculated_fine = max(0, days_held - 7)

    # Validation: If fine exists, fine_paid MUST be True
    if calculated_fine > 0 and not data.fine_paid:
        raise HTTPException(
            status_code=400, 
            detail=f"Outstanding fine of ${calculated_fine} must be paid to complete return."
        )

    # Clear circulation data
    book.issued_to = None
    book.issue_date = None
    # If your model has a remarks column, you can save data.remarks here
    
    db.commit()
    return {"message": "Transaction successfully completed."}

# ---------- USER SECTION ----------

@app.get("/books", response_model=list[schemas.BookResponse])
def list_books(db: Session = Depends(get_db), current_user=Depends(auth.get_current_user)):
    return db.query(models.Book).all()


@app.get("/user/issued-books", response_model=list[schemas.BookResponse])
def user_issued_books(db: Session = Depends(get_db), current_user=Depends(auth.get_current_user)):
    return db.query(models.Book).filter(models.Book.issued_to == current_user["id"]).all()

from datetime import timedelta

# --- ADD MEMBERSHIP ---
@app.post("/admin/membership")
def add_membership(user_id: str, duration: str, db: Session = Depends(get_db), current_user=Depends(auth.admin_required)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    # Set membership end date based on selection
    months = 6 # Default
    if duration == "1 year": months = 12
    elif duration == "2 years": months = 24
    
    user.membership_end = datetime.now() + timedelta(days=months*30)
    db.commit()
    return {"message": f"Membership activated for {duration}."}

# --- UPDATE/EXTEND MEMBERSHIP ---
@app.patch("/admin/membership/{user_id}")
def update_membership(user_id: str, action: str, db: Session = Depends(get_db), current_user=Depends(auth.admin_required)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    if action == "cancel":
        user.membership_end = datetime.now() # Expires now
        message = "Membership cancelled."
    else:
        # Default 6-month extension
        user.membership_end += timedelta(days=180)
        message = "Membership extended by 6 months."

    db.commit()
    return {"message": message}