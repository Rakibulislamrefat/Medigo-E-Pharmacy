import mongoose from "mongoose";

export type OrderItemDoc = {
  medicineId: string;
  nameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
};

export type AddressSnapshotDoc = {
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  postalCode: string;
};

export type OrderStatus = "created" | "packed" | "shipped" | "delivered";
export type PaymentStatus = "unpaid" | "paid";

export type OrderDoc = {
  userEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  address: AddressSnapshotDoc;
  items: OrderItemDoc[];
  createdAt: Date;
  updatedAt: Date;
};

const orderItemSchema = new mongoose.Schema<OrderItemDoc>(
  {
    medicineId: { type: String, required: true },
    nameSnapshot: { type: String, required: true },
    unitPriceSnapshot: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema<AddressSnapshotDoc>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema<OrderDoc>(
  {
    userEmail: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, required: true, default: "created" },
    paymentStatus: { type: String, required: true, default: "unpaid" },
    totalAmount: { type: Number, required: true, min: 0 },
    address: { type: addressSnapshotSchema, required: true },
    items: { type: [orderItemSchema], required: true, default: [] },
  },
  { timestamps: true }
);

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<OrderDoc>) || mongoose.model<OrderDoc>("Order", orderSchema);

