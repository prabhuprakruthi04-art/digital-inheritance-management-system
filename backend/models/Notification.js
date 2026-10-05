import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipientModel: {
      type: String,
      enum: ["Owner", "Nominee", "Admin", "User"],
      default: "User",
    },
    title: {
      type: String,
      default: "Notification",
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "warning",
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save to synchronize userId and ownerId
notificationSchema.pre("save", function () {
  if (!this.userId && this.ownerId) {
    this.userId = this.ownerId;
  }
  if (!this.ownerId && this.userId) {
    this.ownerId = this.userId;
  }
  if (!this.title) {
    this.title = "System Notification";
  }
});

export default mongoose.model("Notification", notificationSchema);