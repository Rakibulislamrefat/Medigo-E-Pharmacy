import express from "express";

import { RefillModel, type RefillStatus } from "./refill.model";

export const refillRouter = express.Router();

function isValidBangladeshiPhone(phone: string) {
  return /^01[3-9]\d{8}$/.test(phone.trim());
}

refillRouter.get("/", async (req, res) => {
  const userEmail = typeof req.query.userEmail === "string" ? req.query.userEmail.trim().toLowerCase() : "";
  const filter: Record<string, unknown> = {};
  if (userEmail) filter.userEmail = userEmail;

  const docs = await RefillModel.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json(
    docs.map((d) => ({
      id: String(d._id),
      userEmail: d.userEmail ?? null,
      phone: d.phone,
      text: d.text,
      status: d.status,
      createdAt: d.createdAt,
    }))
  );
});

refillRouter.post("/", async (req, res) => {
  const userEmail = typeof req.body?.userEmail === "string" ? req.body.userEmail.trim().toLowerCase() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

  if (!phone || !text) {
    res.status(400).json({ message: "phone and text are required" });
    return;
  }

  if (!isValidBangladeshiPhone(phone)) {
    res.status(400).json({ message: "Invalid phone number" });
    return;
  }

  const doc = await RefillModel.create({ userEmail: userEmail || undefined, phone, text, status: "submitted" });
  res.status(201).json({
    id: String(doc._id),
    userEmail: doc.userEmail ?? null,
    phone: doc.phone,
    text: doc.text,
    status: doc.status,
    createdAt: doc.createdAt,
  });
});

refillRouter.patch("/:id", async (req, res) => {
  const patch: Record<string, unknown> = {};
  if (typeof req.body?.status === "string") {
    const s = req.body.status as RefillStatus;
    if (["submitted", "processed", "rejected"].includes(s)) patch.status = s;
  }

  const doc = await RefillModel.findByIdAndUpdate(req.params.id, patch, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.json({
    id: String(doc._id),
    userEmail: doc.userEmail ?? null,
    phone: doc.phone,
    text: doc.text,
    status: doc.status,
    createdAt: doc.createdAt,
  });
});

