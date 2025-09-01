// import mongoose from "mongoose";
// import { config } from "../config/env";

// mongoose.set("strictQuery", true);

// (async () => {
//   try {
//     await mongoose.connect(config.MONGO_URI);
//     console.log("✅ MongoDB Atlas connected successfully");
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err);
//     process.exit(1);
//   }
// })();
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env before anything else

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is missing. Check your .env file.");
  process.exit(1);
}

mongoose.set("strictQuery", true);

(async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Optional: fail fast if unreachable
    });
    console.log("✅ MongoDB Atlas connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
})();
