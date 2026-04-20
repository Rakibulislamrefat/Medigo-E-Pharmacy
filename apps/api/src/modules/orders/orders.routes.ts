import express from "express";

import { MedicineModel } from "../medicines/medicine.model";
import { OrderModel, type OrderStatus, type PaymentStatus } from "./order.model";

export const ordersRouter = express.Router();

function toDto(d: any) {
  return {
    id: String(d._id),
    userEmail: d.userEmail,
    status: d.status,
    paymentStatus: d.paymentStatus,
    totalAmount: d.totalAmount,
    address: d.address,
    items: (d.items ?? []).map((i: any) => ({
      medicineId: String(i.medicineId),
      name: i.nameSnapshot,
      unitPrice: i.unitPriceSnapshot,
      qty: i.quantity,
    })),
    createdAt: d.createdAt,
  };
}

ordersRouter.get("/", async (req, res) => {
  const userEmail = typeof req.query.userEmail === "string" ? req.query.userEmail.trim().toLowerCase() : "";
  const filter: Record<string, unknown> = {};
  if (userEmail) filter.userEmail = userEmail;

  const docs = await OrderModel.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json(docs.map(toDto));
});

ordersRouter.get("/:id", async (req, res) => {
  const doc = await OrderModel.findById(req.params.id).lean();
  if (!doc) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(toDto(doc));
});

ordersRouter.post("/", async (req, res) => {
  const userEmail = typeof req.body?.userEmail === "string" ? req.body.userEmail.trim().toLowerCase() : "";
  const address = req.body?.address;
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (!userEmail) {
    res.status(400).json({ message: "userEmail is required" });
    return;
  }

  if (
    !address ||
    typeof address.fullName !== "string" ||
    typeof address.phone !== "string" ||
    typeof address.line1 !== "string" ||
    typeof address.city !== "string" ||
    typeof address.postalCode !== "string"
  ) {
    res.status(400).json({ message: "address is invalid" });
    return;
  }

  if (!items.length) {
    res.status(400).json({ message: "items are required" });
    return;
  }

  const normalizedItems: { medicineId: string; quantity: number }[] = [];
  for (const it of items) {
    const medicineId = typeof it?.medicineId === "string" ? it.medicineId : "";
    const quantity = typeof it?.qty === "number" ? it.qty : typeof it?.quantity === "number" ? it.quantity : Number(it?.qty ?? 0);
    if (!medicineId || !Number.isFinite(quantity) || quantity <= 0) continue;
    normalizedItems.push({ medicineId, quantity: Math.min(99, Math.max(1, Math.round(quantity))) });
  }

  if (!normalizedItems.length) {
    res.status(400).json({ message: "items are invalid" });
    return;
  }

  const medicineDocs = await MedicineModel.find({
    _id: { $in: normalizedItems.map((i) => i.medicineId) },
    isPublished: true,
  }).lean();

  const medById = new Map<string, any>(medicineDocs.map((m: any) => [String(m._id), m]));

  const orderItems = normalizedItems
    .map((i) => {
      const med = medById.get(i.medicineId);
      if (!med) return null;
      return {
        medicineId: i.medicineId,
        nameSnapshot: med.name,
        unitPriceSnapshot: med.price,
        quantity: i.quantity,
      };
    })
    .filter(Boolean) as any[];

  if (!orderItems.length) {
    res.status(400).json({ message: "No valid medicines found for items" });
    return;
  }

  const totalAmount = orderItems.reduce((sum, i) => sum + i.unitPriceSnapshot * i.quantity, 0);

  const doc = await OrderModel.create({
    userEmail,
    status: "created",
    paymentStatus: "unpaid",
    totalAmount,
    address: {
      fullName: String(address.fullName).trim(),
      phone: String(address.phone).trim(),
      line1: String(address.line1).trim(),
      city: String(address.city).trim(),
      postalCode: String(address.postalCode).trim(),
    },
    items: orderItems,
  });

  res.status(201).json(toDto(doc.toObject()));
});

ordersRouter.patch("/:id", async (req, res) => {
  const patch: Record<string, unknown> = {};

  if (typeof req.body?.status === "string") {
    const s = req.body.status as OrderStatus;
    if (["created", "packed", "shipped", "delivered"].includes(s)) patch.status = s;
  }

  if (typeof req.body?.paymentStatus === "string") {
    const p = req.body.paymentStatus as PaymentStatus;
    if (["unpaid", "paid"].includes(p)) patch.paymentStatus = p;
  }

  const doc = await OrderModel.findByIdAndUpdate(req.params.id, patch, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(toDto(doc));
});

