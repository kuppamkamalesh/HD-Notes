import mongoose from "mongoose";

export type AuthProvider = "email" | "google";

interface IUser extends mongoose.Document {
  name: string;
  dob?: string;
  email: string;
  provider: AuthProvider;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    dob: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    provider: { type: String, enum: ["email", "google"], required: true },
    googleId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
