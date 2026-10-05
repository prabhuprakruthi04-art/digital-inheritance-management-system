// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "nominee", "admin"],
      default: "owner",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "LOCKED"],
      default: "ACTIVE",
    },
    walletAddress: {
      type: String,
      trim: true,
      default: "",
    },
    faceDescriptor: {
      type: [Number],
      default: [],
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    inactivityThresholdSeconds: {
      type: Number,
      default: 120,
    },
    inheritanceStatus: {
      type: String,
      enum: [
        "ACTIVE",
        "PENDING_VERIFICATION",
        "EXPIRED",
        "INHERITED",
        "active",
        "triggered",
        "expired"
      ],
      default: "ACTIVE",
    },
    lastTierNotified: {
      type: Number,
      default: 0,
    },
    // Track warning notifications count (0 to 3)
    inactivityWarningCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },
    lastWarningSentAt: {
      type: Date,
      default: null,
    },
    assignedNomineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nominee",
    },
    transferAuthId: {
      type: String,
      default: null,
    },
    verificationHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          default: "Verified",
        },
        method: {
          type: String,
          default: "Biometric Face Verification",
        },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook using async function without 'next' parameter to prevent Kareem errors
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || "default_jwt_secret_dims";
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      fullName: this.fullName,
    },
    secret,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("User", userSchema);
export default User;