import mongoose from "mongoose";

/**
 * Connects to MongoDB database using Mongoose
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/digital-inheritance"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Monitor connection events after initial startup
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection lost.");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

// Graceful shutdown handling
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed on app termination.");
  process.exit(0);
});

/**
 * Returns current Mongoose connection status details
 */
export const getConnectionState = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const stateCode = mongoose.connection.readyState;

  return {
    stateCode,
    status: states[stateCode] || "unknown",
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
  };
};

export default connectDB;