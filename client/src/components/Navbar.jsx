// This is a shared navigation bar shown at the top of every page after login.

import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="navbar">
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/doctors">Doctors</Link>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navbar;
