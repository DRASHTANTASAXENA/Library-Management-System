📚 LIBSYS: Next-Gen Library Management System
A full-stack library management application with role-based access control, real-time fine calculation, and membership management.

🚀 Features
Admin Suite:

Bulk book entry and circulation control.

Membership lifecycle management (Create, Extend, Cancel).

Process returns with mandatory fine-check validation.

User Suite:

Personal dashboard with membership countdown.

Live fine tracking on issued books.

Digital catalog browsing.

Security: JWT-based authentication with role-based protected routing.

📂 Project Structure
Frontend (React + Vite + Tailwind CSS)
Plaintext

libsys-frontend/
├── src/
│   ├── api/
│   │   └── api.js              # Axios instance with JWT interceptors
│   ├── components/
│   │   ├── Layout.jsx          # Conditional Navbar/Footer wrapper
│   │   ├── Navbar.jsx          # Transparent-to-Solid navigation
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── admin/              # Admin-only restricted pages
│   │   │   ├── AddMembership.jsx
│   │   │   ├── AdminBooks.jsx
│   │   │   ├── AdminHome.jsx
│   │   │   ├── AdminIssueControl.jsx
│   │   │   ├── ReturnBook.jsx
│   │   │   └── UpdateMembership.jsx
│   │   ├── user/               # Student/User restricted pages
│   │   │   ├── UserBooks.jsx
│   │   │   ├── UserHome.jsx
│   │   │   └── UserIssuedBooks.jsx
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Profile.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # Role-based gatekeeper
│   └── App.jsx                 # Route definitions
├── tailwind.config.js
└── package.json
Backend (FastAPI + SQLAlchemy + SQLite)
Plaintext

libsys-backend/
├── auth.py             # JWT logic & Password hashing (bcrypt)
├── database.py         # SQLAlchemy engine & Session setup
├── main.py             # API Endpoints & Business logic
├── models.py           # Database Schemas (User, Admin, Book)
├── schemas.py          # Pydantic data validation
└── library.db          # SQLite Database file
🛠️ Setup Instructions
1. Backend Setup
Navigate to the backend folder.

Install dependencies: pip install fastapi uvicorn sqlalchemy passlib python-multipart python-jose.

Run the server:

Bash

uvicorn main:app --reload
2. Frontend Setup
Navigate to the frontend folder.

Install dependencies: npm install.

Run the development server:

Bash

npm run dev
🔑 Default Logic & Rules
Fines: Calculated at $1.00/day after a 7-day grace period.

Returns: Admins cannot process a return if a fine is detected unless the "Fine Paid" checkbox is checked.

Membership: Users must have an active membership to have books issued to them.

Routes:

/admin/* paths require a token with role: "admin".

/user/* paths require a token with role: "user".

🎨 Design System
Primary Color: #2563eb (Blue-600)

Background: #f8fafc (Gray-50)

Typography: Inter / Sans-serif (Bold/Black weights for headers)

Styling: Neumorphic-influenced cards with high-border-radius (2.5rem).
