// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  console.log("🔑 Decoded JWT payload:", decoded);  // 👀 log contents
  req.user = {
  id: decoded.id,
  role: decoded.role,
  farm_id: decoded.farm_id || decoded.farmId, // normalize
};

  next();
});

};

export default authMiddleware;
