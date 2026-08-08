import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/digital-inheritance";
  
  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  await mongoose.connect(uri);
  console.log("MongoDB Connected Successfully");
}

export function getConnectionState() {
  const stateNames = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const readyState = mongoose.connection.readyState;

  return {
    readyState: readyState,
    status: stateNames[readyState] || "unknown",
    host: mongoose.connection.host || "N/A",
    name: mongoose.connection.name || "N/A",
  };
}