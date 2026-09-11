import { Router } from "express";
import User from "../models/User.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, username, name, password } = req.body;

    // Support email, username, or name input
    const loginIdentifier = email || username || name;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Username and password are required.",
      });
    }

    // Query user by email or name/fullName
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { name: loginIdentifier },
        { fullName: loginIdentifier },
      ],
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your username/email and password.",
      });
    }

    // Return dummy JWT token and normalized user profile
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: "dummy-jwt-token",
      user: {
        _id: user._id,
        fullName: user.fullName || user.name,
        name: user.fullName || user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress || "",
      },
    });
  } catch (error) {
    console.error("Login Route Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { fullName, name, email, password, role, walletAddress } = req.body;

    const resolvedName = fullName || name || (email ? email.split("@")[0] : "User");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account already exists with this email.",
      });
    }

    const newUser = new User({
      fullName: resolvedName,
      name: resolvedName,
      email: email.toLowerCase(),
      password,
      role: role ? role.toLowerCase() : "owner",
      walletAddress: walletAddress || "",
      lastActiveDate: new Date(),
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token: "dummy-jwt-token",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        walletAddress: newUser.walletAddress,
      },
    });
  } catch (error) {
    console.error("Register Route Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;