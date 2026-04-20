import mongoose from "mongoose";

export type RefillStatus = "submitted" | "processed" | "rejected";

export type RefillDoc = {
  userEmail?: string;
  phone: string;
  text: string;
  status: RefillStatus;
  createdAt: Date;
  updatedAt: Date;
};

const refillSchema = new mongoose.Schema<RefillDoc>(
  {
    userEmail: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    status: { type: String, required: true, default: "submitted" },
  },
  { timestamps: true }
);

export const RefillModel =
  (mongoose.models.RefillRequest as mongoose.Model<RefillDoc>) ||
  mongoose.model<RefillDoc>("RefillRequest", refillSchema);

