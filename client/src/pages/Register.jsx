// This page lets a new user create an account.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await api.post("/auth/register", {
        name: name,
        email: email,
        password: password,
        role: role,
      });

      // save token and log the user in right away
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <label>Role</label>
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="patient">Patient</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="receptionist">Receptionist</option>
          <option value="nurse">Nurse</option>
          <option value="pharmacist">Pharmacist</option>
        </select>

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
