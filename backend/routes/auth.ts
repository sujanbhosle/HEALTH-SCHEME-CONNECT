
import express from "express";

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Simulating authentication
  if (email && password) {
    res.json({ 
      user: { id: "u1", email, name: "Demo User" }, 
      token: "mock-jwt-token" 
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// POST /api/auth/signup
router.post("/signup", (req, res) => {
  const { email, password, name } = req.body;
  res.status(201).json({ 
    user: { id: "u2", email, name }, 
    token: "mock-jwt-token" 
  });
});

export default router;
