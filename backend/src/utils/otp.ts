import crypto from "crypto";
import { addMinutes, isBefore } from "date-fns";
import Otp from "../models/Otp";
import { config } from "../config/env";

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOtp(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function expiryDate(): Date {
  return addMinutes(new Date(), config.OTP_EXP_MINUTES);
}

export function notExpired(expiresAt: Date): boolean {
  return isBefore(new Date(), expiresAt);
}

export async function canResend(email: string): Promise<boolean> {
  const entry = await Otp.findOne({ email });
  if (!entry) return true;
  const diff = (Date.now() - entry.lastSentAt.getTime()) / 1000;
  return diff >= config.OTP_RESEND_COOLDOWN_SECONDS;
}
