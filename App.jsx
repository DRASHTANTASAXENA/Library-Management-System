import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout"; // Imported Layout

// PUBLIC PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

// ADMIN PAGES
import AdminHome from "./pages/admin/AdminHome";
import AdminBooks from "./pages/admin/AdminBooks";
import UserList from "./pages/admin/UserList";
import AdminIssueControl from "./pages/admin/AdminIssueControl";

// USER PAGES
import UserHome from "./pages/user/UserHome";
import UserBooks from "./pages/user/UserBooks";
import UserIssuedBooks from "./pages/user/UserIssuedBooks";

// PROTECTED ROUTE
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Layout> {/* This ensures Footer & Navbar show up everywhere */}
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

        {/* ADMIN */}
        <Route path="/admin/home" element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>} />
        <Route path="/admin/books" element={<ProtectedRoute role="admin"><AdminBooks /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserList /></ProtectedRoute>} />
        <Route path="/admin/issue-books" element={<ProtectedRoute role="admin"><AdminIssueControl /></ProtectedRoute>} />

        {/* USER */}
        <Route path="/user/home" element={<ProtectedRoute role="user"><UserHome /></ProtectedRoute>} />
        <Route path="/user/books" element={<ProtectedRoute role="user"><UserBooks /></ProtectedRoute>} />
        <Route path="/user/my-books" element={<ProtectedRoute role="user"><UserIssuedBooks /></ProtectedRoute>} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

function DashboardRedirect() {
  const role = localStorage.getItem("role");
  if (role === "admin") return <Navigate to="/admin/home" />;
  if (role === "user") return <Navigate to="/user/home" />;
  return <Navigate to="/login" />;
}