
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <h2>Lab Booking</h2>

      <div className="nav-links">
        {user.role === "admin" ? (
          <Link to="/admin/dashboard">Admin Dashboard</Link>
        ) : (
          <>
            <Link to="/resources">Resources</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </>
        )}

        <span>{user.name} ({user.role})</span>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
