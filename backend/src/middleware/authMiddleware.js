// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; // Ensure JWT_SECRET is loaded from .env

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Log the error for debugging, but send a generic message to the client
      console.error("JWT verification failed:", err.message);
      return res
        .status(403)
        .json({ message: "Access Denied: Invalid or expired token." });
    }
    req.user = user; // Attach user payload to the request
    next();
  });
};

module.exports = authenticateToken;
