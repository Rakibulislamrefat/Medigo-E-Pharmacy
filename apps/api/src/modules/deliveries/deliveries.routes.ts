import express from "express";

import { DeliveryModel, type DeliveryStatus } from "./delivery.model";

export const deliveriesRouter = express.Router();

deliveriesRouter.get("/", async (req, res) => {
  const assignedToEmail = typeof req.query.assignedToEmail === "string" ? req.query.assignedToEmail.trim().toLowerCase() : "";
  const filter: Record<string, unknown> = {};
  if (assignedToEmail) filter.assignedToEmail = assignedToEmail;

  const docs = await DeliveryModel.find(filter).sort({ updatedAt: -1 }).limit(200).lean();
  res.json(
    docs.map((d) => ({
      id: String(d._id),
      orderId: d.orderId,
      assignedToEmail: d.assignedToEmail ?? null,
      status: d.status,
      updatedAt: d.updatedAt,
    }))
  );
});

deliveriesRouter.get("/:id", async (req, res) => {
  const doc = await DeliveryModel.findById(req.params.id).lean();
  if (!doc) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json({
    id: String(doc._id),
    orderId: doc.orderId,
    assignedToEmail: doc.assignedToEmail ?? null,
    status: doc.status,
    updatedAt: doc.updatedAt,
  });
});

deliveriesRouter.post("/", async (req, res) => {
  const orderId = typeof req.body?.orderId === "string" ? req.body.orderId.trim() : "";
  const assignedToEmail = typeof req.body?.assignedToEmail === "string" ? req.body.assignedToEmail.trim().toLowerCase() : "";

  if (!orderId) {
    res.status(400).json({ message: "orderId is required" });
    return;
  }

  const doc = await DeliveryModel.create({ orderId, assignedToEmail: assignedToEmail || undefined, status: "assigned" });
  res.status(201).json({
    id: String(doc._id),
    orderId: doc.orderId,
    assignedToEmail: doc.assignedToEmail ?? null,
    status: doc.status,
    updatedAt: doc.updatedAt,
  });
});

deliveriesRouter.patch("/:id", async (req, res) => {
  const patch: Record<string, unknown> = {};
  if (typeof req.body?.assignedToEmail === "string") patch.assignedToEmail = req.body.assignedToEmail.trim().toLowerCase();
  if (typeof req.body?.status === "string") {
    const s = req.body.status as DeliveryStatus;
    if (["assigned", "picked_up", "on_the_way", "delivered"].includes(s)) patch.status = s;
  }

  const doc = await DeliveryModel.findByIdAndUpdate(req.params.id, patch, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json({
    id: String(doc._id),
    orderId: doc.orderId,
    assignedToEmail: doc.assignedToEmail ?? null,
    status: doc.status,
    updatedAt: doc.updatedAt,
  });
});

