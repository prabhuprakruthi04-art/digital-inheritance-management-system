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

    // 1. Biometric 128D Face Landmark Vector Array
    faceDescriptor: {
      type: [Number],
      default: [],
    },

    // 2. Heartbeat Timestamp (Updated when user verifies face/heartbeat)
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },

    // 3. Inactivity Threshold in SECONDS (Default 120s / 2 mins for demo testing)
    inactivityThresholdSeconds: {
      type: Number,
      default: 120,
    },

    // 4. Inheritance Lifecycle Status
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

    assignedNomineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nominee",
    },

    // Generated upon expiration for nominee claim access
    transferAuthId: {
      type: String,
      default: null,
    },

    // 5. Verification Audit Trail Array
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

// Hash password prior to saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to check password validity
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token for RBAC authentication
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