import mongoose from "mongoose";

export type PrescriptionStatus = "submitted" | "reviewed" | "fulfilled" | "rejected";

export type PrescriptionDoc = {
  userEmail?: string;
  fullName: string;
  phone: string;
  fileName: string;
  fileMime: string;
  fileSize: number;
  fileDataUrl?: string;
  status: PrescriptionStatus;
  createdAt: Date;
  updatedAt: Date;
};

const prescriptionSchema = new mongoose.Schema<PrescriptionDoc>(
  {
    userEmail: { type: String, trim: true, lowercase: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    fileName: { type: String, required: true, trim: true },
    fileMime: { type: String, required: true, trim: true },
    fileSize: { type: Number, required: true, min: 0 },
    fileDataUrl: { type: String },
    status: { type: String, required: true, default: "submitted" },
  },
  { timestamps: true }
);

export const PrescriptionModel =
  (mongoose.models.Prescription as mongoose.Model<PrescriptionDoc>) ||
  mongoose.model<PrescriptionDoc>("Prescription", prescriptionSchema);

