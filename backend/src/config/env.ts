import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "default_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  GMAIL_USER: process.env.GMAIL_USER || "",
  GMAIL_PASS: process.env.GMAIL_PASS || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  OTP_EXP_MINUTES: Number(process.env.OTP_EXP_MINUTES) || 10,
  OTP_RESEND_COOLDOWN_SECONDS:
    Number(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60,
};
