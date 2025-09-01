// import dotenv from "dotenv";
// dotenv.config(); // Load .env first

// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import { config } from "./config/env";
// import "./db/mongoose";

// import authRoutes from "./routes/auth";
// import notesRoutes from "./routes/notes";
// import meRoutes from "./routes/me";

// import { errorHandler } from "./middleware/error";

// const app = express();

// // Core middleware
// app.use(express.json());
// app.use(cookieParser());

// // Allowed origins (local + deployed frontend)
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://hd-notes-three.vercel.app",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Health check
// app.get("/health", (_, res) => res.json({ ok: true }));

// // API routes
// app.use("/auth", authRoutes);
// app.use("/notes", notesRoutes);
// app.use("/me", meRoutes);

// // Global error handler
// app.use(errorHandler);

// // Start server
// app.listen(config.PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${config.PORT}`);
// });

import dotenv from "dotenv";
dotenv.config(); // Load .env first

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "./config/env";
import "./db/mongoose";

import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";
import meRoutes from "./routes/me";

import { errorHandler } from "./middleware/error";

const app = express();

// Core middleware
app.use(express.json());
app.use(cookieParser());

// Allowed origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://hd-notes-three.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Root health check for Render
app.get("/", (_, res) => res.json({ message: "API is running" }));

// Existing health check
app.get("/health", (_, res) => res.json({ ok: true }));

// API routes
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);
app.use("/me", meRoutes);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${config.PORT}`);
});
