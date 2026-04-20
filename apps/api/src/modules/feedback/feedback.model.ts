import mongoose from "mongoose";

export type FeedbackDoc = {
  userEmail: string;
  orderId: string;
  medicineId?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

const feedbackSchema = new mongoose.Schema<FeedbackDoc>(
  {
    userEmail: { type: String, required: true, trim: true, lowercase: true },
    orderId: { type: String, required: true, trim: true },
    medicineId: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const FeedbackModel =
  (mongoose.models.Feedback as mongoose.Model<FeedbackDoc>) ||
  mongoose.model<FeedbackDoc>("Feedback", feedbackSchema);

