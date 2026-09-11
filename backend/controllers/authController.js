import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
export async function register(req, res) {
  try {
    const { fullName, email, password, role, walletAddress } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "owner",
      walletAddress: walletAddress || "",
      isVerified: true,
      faceAuthEnabled: false,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
        faceAuthEnabled: user.faceAuthEnabled,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Login User
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
        faceAuthEnabled: user.faceAuthEnabled,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Complete / Toggle Face Verification
export async function completeVerification(req, res) {
  try {
    const { userId, enableFace } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    user.faceAuthEnabled = enableFace !== undefined ? enableFace : true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Verification status updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        faceAuthEnabled: user.faceAuthEnabled,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}