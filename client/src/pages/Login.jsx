// This page lets a user log in with their email and password.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

function Login() {
  // useState gives us a variable that React "remembers" and re-renders when it changes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // this lets us change the page (redirect) after login
  const navigate = useNavigate();

  // this function runs when the form is submitted
  async function handleSubmit(event) {
    event.preventDefault(); // stops the page from refreshing

    setErrorMessage(""); // clear old errors

    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      // save the token and user info so we stay logged in
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // go to the dashboard page
      navigate("/dashboard");
    } catch (error) {
      // if the backend sent an error message, show it
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
        <h2>Login</h2>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

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

        <button type="submit">Login</button>

        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
