import mongoose from "mongoose";

export type DeliveryStatus = "assigned" | "picked_up" | "on_the_way" | "delivered";

export type DeliveryDoc = {
  orderId: string;
  assignedToEmail?: string;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
};

const deliverySchema = new mongoose.Schema<DeliveryDoc>(
  {
    orderId: { type: String, required: true, trim: true },
    assignedToEmail: { type: String, trim: true, lowercase: true },
    status: { type: String, required: true, default: "assigned" },
  },
  { timestamps: true }
);

export const DeliveryModel =
  (mongoose.models.Delivery as mongoose.Model<DeliveryDoc>) ||
  mongoose.model<DeliveryDoc>("Delivery", deliverySchema);

