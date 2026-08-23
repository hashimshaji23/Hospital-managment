// This page shows right after login - a simple welcome screen
// with quick links to Patients and Doctors.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(function () {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div>
      <Navbar />

      <div className="page-content">
        {user && (
          <p>
            Welcome, <strong>{user.name}</strong> ({user.role})
          </p>
        )}

        <h2>Quick Links</h2>

        <div className="dashboard-links">
          <Link to="/patients" className="dashboard-card">
            View / Add Patients
          </Link>

          <Link to="/doctors" className="dashboard-card">
            View / Add Doctors
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
