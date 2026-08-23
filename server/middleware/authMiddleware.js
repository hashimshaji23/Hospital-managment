// Middleware = a function that runs BEFORE the actual route handler.
// This one checks: "Does the user have a valid login token?"

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Step 1: check if the user sent a valid token (are they logged in?)
async function protect(req, res, next) {
  // The token is normally sent like this in the request header:
  // Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({ message: "No token provided. Please login." });
    return;
  }

  try {
    // authHeader looks like "Bearer abc123", we only want "abc123"
    const token = authHeader.split(" ")[1];

    // this checks if the token is valid and not expired
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // find the user in the database using the id stored in the token
    const user = await User.findById(decodedData.id);

    if (!user) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    // attach the user to the request so the next function can use it
    req.user = user;

    next(); // move on to the actual route
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

// Step 2: check if the logged-in user has the right role
// Example usage: authorize("admin", "doctor")
function authorize(...allowedRoles) {
  return function (req, res, next) {
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "You do not have permission to do this." });
      return;
    }
    next();
  };
}

export { protect, authorize };
