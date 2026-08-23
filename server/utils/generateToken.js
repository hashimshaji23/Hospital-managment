// This small function creates a JWT (a login token) for a user.
// The token proves "I am logged in" without needing to send a password every time.

import jwt from "jsonwebtoken";

function generateToken(userId, userRole) {
  // jwt.sign(data, secretKey, options)
  const token = jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // token stays valid for 7 days
  );

  return token;
}

export default generateToken;
