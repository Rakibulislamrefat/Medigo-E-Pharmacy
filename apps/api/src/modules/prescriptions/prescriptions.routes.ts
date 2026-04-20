import express from "express";

import { PrescriptionModel, type PrescriptionStatus } from "./prescription.model";

export const prescriptionsRouter = express.Router();

function isValidBangladeshiPhone(phone: string) {
  return /^01[3-9]\d{8}$/.test(phone.trim());
}

prescriptionsRouter.get("/", async (req, res) => {
  const userEmail = typeof req.query.userEmail === "string" ? req.query.userEmail.trim().toLowerCase() : "";
  const filter: Record<string, unknown> = {};
  if (userEmail) filter.userEmail = userEmail;

  const docs = await PrescriptionModel.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json(
    docs.map((d) => ({
      id: String(d._id),
      userEmail: d.userEmail ?? null,
      fullName: d.fullName,
      phone: d.phone,
      fileName: d.fileName,
      fileMime: d.fileMime,
      fileSize: d.fileSize,
      status: d.status,
      createdAt: d.createdAt,
    }))
  );
});

prescriptionsRouter.post("/", async (req, res) => {
  const userEmail = typeof req.body?.userEmail === "string" ? req.body.userEmail.trim().toLowerCase() : "";
  const fullName = typeof req.body?.fullName === "string" ? req.body.fullName.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const fileName = typeof req.body?.fileName === "string" ? req.body.fileName.trim() : "";
  const fileMime = typeof req.body?.fileMime === "string" ? req.body.fileMime.trim() : "";
  const fileSize = typeof req.body?.fileSize === "number" ? req.body.fileSize : Number(req.body?.fileSize ?? 0);
  const fileDataUrl = typeof req.body?.fileDataUrl === "string" ? req.body.fileDataUrl : "";

  if (!fullName || !phone || !fileName || !fileMime || !Number.isFinite(fileSize) || fileSize <= 0) {
    res.status(400).json({ message: "fullName, phone, fileName, fileMime, fileSize are required" });
    return;
  }

  if (!isValidBangladeshiPhone(phone)) {
    res.status(400).json({ message: "Invalid phone number" });
    return;
  }

  if (fileSize > 1024 * 1024) {
    res.status(400).json({ message: "File too large. Max 1MB" });
    return;
  }

  if (fileDataUrl && !fileDataUrl.startsWith("data:")) {
    res.status(400).json({ message: "fileDataUrl must be a data URL" });
    return;
  }

  const doc = await PrescriptionModel.create({
    userEmail: userEmail || undefined,
    fullName,
    phone,
    fileName,
    fileMime,
    fileSize,
    fileDataUrl: fileDataUrl || undefined,
    status: "submitted",
  });

  res.status(201).json({
    id: String(doc._id),
    userEmail: doc.userEmail ?? null,
    fullName: doc.fullName,
    phone: doc.phone,
    fileName: doc.fileName,
    fileMime: doc.fileMime,
    fileSize: doc.fileSize,
    status: doc.status,
    createdAt: doc.createdAt,
  });
});

prescriptionsRouter.patch("/:id", async (req, res) => {
  const patch: Record<string, unknown> = {};
  if (typeof req.body?.status === "string") {
    const s = req.body.status as PrescriptionStatus;
    if (["submitted", "reviewed", "fulfilled", "rejected"].includes(s)) patch.status = s;
  }

  const doc = await PrescriptionModel.findByIdAndUpdate(req.params.id, patch, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.json({
    id: String(doc._id),
    userEmail: doc.userEmail ?? null,
    fullName: doc.fullName,
    phone: doc.phone,
    fileName: doc.fileName,
    fileMime: doc.fileMime,
    fileSize: doc.fileSize,
    status: doc.status,
    createdAt: doc.createdAt,
  });
});

