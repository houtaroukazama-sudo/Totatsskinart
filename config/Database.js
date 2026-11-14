import "dotenv/config";
import mongoose from "mongoose";

let connecting = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connecting) return connecting;

  // Remove quotes, spaces, newlines and invisible characters
  const uri = (process.env.MONGO_URI || "")
    .replace(/^['"]|['"]$/g, "")
    .replace(/[\s\u0000-\u001F\u007F\u200B\uFEFF]/g, "");

  if (!uri) {
    console.error("MONGO_URI is not set");
    process.exit(1);
  }

  // Log with password hidden, to help debugging
  console.log("Connecting to:", uri.replace(/\/\/([^:]+):[^@]+@/, "//$1:****@"));

  connecting = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
      console.log("MongoDB connected");
      return mongoose.connection;
    })
    .catch((err) => {
      connecting = null;
      console.error("MongoDB Connection Failed:", err.message);
      process.exit(1);
    });

  return connecting;
}

export default connectDB;