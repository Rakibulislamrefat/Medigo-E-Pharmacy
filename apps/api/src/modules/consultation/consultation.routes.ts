import express from "express";

import { ConsultationModel, type ConsultationStatus } from "./consultation.model";

export const consultationRouter = express.Router();

function isValidBangladeshiPhone(phone: string) {
  return /^01[3-9]\d{8}$/.test(phone.trim());
}

consultationRouter.get("/", async (req, res) => {
  const userEmail = typeof req.query.userEmail === "string" ? req.query.userEmail.trim().toLowerCase() : "";
  const filter: Record<string, unknown> = {};
  if (userEmail) filter.userEmail = userEmail;

  const docs = await ConsultationModel.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json(
    docs.map((d) => ({
      id: String(d._id),
      userEmail: d.userEmail ?? null,
      fullName: d.fullName,
      phone: d.phone,
      notes: d.notes,
      preferredTime: d.preferredTime ?? null,
      status: d.status,
      createdAt: d.createdAt,
    }))
  );
});

consultationRouter.post("/", async (req, res) => {
  const userEmail = typeof req.body?.userEmail === "string" ? req.body.userEmail.trim().toLowerCase() : "";
  const fullName = typeof req.body?.fullName === "string" ? req.body.fullName.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";
  const preferredTime = typeof req.body?.preferredTime === "string" ? req.body.preferredTime.trim() : "";

  if (!fullName || !phone || !notes) {
    res.status(400).json({ message: "fullName, phone, notes are required" });
    return;
  }

  if (!isValidBangladeshiPhone(phone)) {
    res.status(400).json({ message: "Invalid phone number" });
    return;
  }

  const doc = await ConsultationModel.create({
    userEmail: userEmail || undefined,
    fullName,
    phone,
    notes,
    preferredTime: preferredTime || undefined,
    status: "requested",
  });

  res.status(201).json({
    id: String(doc._id),
    userEmail: doc.userEmail ?? null,
    fullName: doc.fullName,
    phone: doc.phone,
    notes: doc.notes,
    preferredTime: doc.preferredTime ?? null,
    status: doc.status,
    createdAt: doc.createdAt,
  });
});

consultationRouter.patch("/:id", async (req, res) => {
  const patch: Record<string, unknown> = {};
  if (typeof req.body?.status === "string") {
    const s = req.body.status as ConsultationStatus;
    if (["requested", "scheduled", "completed", "cancelled"].includes(s)) patch.status = s;
  }

  const doc = await ConsultationModel.findByIdAndUpdate(req.params.id, patch, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.json({
    id: String(doc._id),
    userEmail: doc.userEmail ?? null,
    fullName: doc.fullName,
    phone: doc.phone,
    notes: doc.notes,
    preferredTime: doc.preferredTime ?? null,
    status: doc.status,
    createdAt: doc.createdAt,
  });
});

