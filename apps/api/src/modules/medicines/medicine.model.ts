import mongoose from "mongoose";

export type MedicineDoc = {
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  price: number;
  stockQty: number;
  isPublished: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

const medicineSchema = new mongoose.Schema<MedicineDoc>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    stockQty: { type: Number, required: true, min: 0, default: 0 },
    isPublished: { type: Boolean, required: true, default: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const MedicineModel =
  (mongoose.models.Medicine as mongoose.Model<MedicineDoc>) ||
  mongoose.model<MedicineDoc>("Medicine", medicineSchema);

