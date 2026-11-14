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

  // Throw instead of process.exit(1) so Vercel functions don't get killed
  if (!uri) throw new Error("MONGO_URI is not set");

  // Log with password hidden, to help debugging
  console.log("Connecting to:", uri.replace(/\/\/([^:]+):[^@]+@/, "//$1:****@"));

  connecting = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
      console.log("MongoDB connected");
      return mongoose.connection;
    })
    .catch((err) => {
      connecting = null; // allow retry on next request
      console.error("MongoDB Connection Failed:", err.message);
      throw err;
    });

  return connecting;
}

export default connectDB;