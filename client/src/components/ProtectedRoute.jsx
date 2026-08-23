// This component wraps pages that require login.
// If there's no token saved, it sends the user back to the Login page.

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
