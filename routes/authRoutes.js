const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// User Signup

router.post("/signup", async (req, res) => {
    console.log("Inside /signup route"); // Log to check if this runs
    const { name, email, password } = req.body;
  
    try {
      console.log("Checking existing user...");
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        console.log("User already exists");
        return res.status(400).json({ message: "User already exists" });
      }
  
      console.log("Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      
      console.log("Saving new user...");
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
  
      console.log("User registered successfully");
      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error in signup:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, { 
    httpOnly: true, 
    secure: false, // Set to false for local development
    sameSite: "lax" // Ensures cross-site cookie handling
  }).json({ message: "Login successful", token });
  });

  router.post("/logout", (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  });
  

module.exports = router;
