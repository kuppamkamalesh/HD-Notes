import mongoose from "mongoose";

interface IOtp extends mongoose.Document {
  email: string;
  codeHash: string;
  expiresAt: Date;
  lastSentAt: Date;
  attempts: number;
}

const otpSchema = new mongoose.Schema<IOtp>({
  email: { type: String, required: true, unique: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  lastSentAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
});

export default mongoose.model<IOtp>("Otp", otpSchema);
