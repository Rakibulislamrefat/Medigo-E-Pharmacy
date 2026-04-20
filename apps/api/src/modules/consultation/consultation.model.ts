import mongoose from "mongoose";

export type ConsultationStatus = "requested" | "scheduled" | "completed" | "cancelled";

export type ConsultationDoc = {
  userEmail?: string;
  fullName: string;
  phone: string;
  notes: string;
  preferredTime?: string;
  status: ConsultationStatus;
  createdAt: Date;
  updatedAt: Date;
};

const consultationSchema = new mongoose.Schema<ConsultationDoc>(
  {
    userEmail: { type: String, trim: true, lowercase: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    notes: { type: String, required: true, trim: true },
    preferredTime: { type: String, trim: true },
    status: { type: String, required: true, default: "requested" },
  },
  { timestamps: true }
);

export const ConsultationModel =
  (mongoose.models.Consultation as mongoose.Model<ConsultationDoc>) ||
  mongoose.model<ConsultationDoc>("Consultation", consultationSchema);

