import express from "express";

import { BannerModel } from "./banner.model";

export const bannersRouter = express.Router();

bannersRouter.get("/", async (_req, res) => {
  const docs = await BannerModel.find({}).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  res.json(
    docs.map((d) => ({
      id: String(d._id),
      title: d.title,
      subtitle: d.subtitle,
      imageUrl: d.imageUrl,
      isActive: d.isActive,
      sortOrder: d.sortOrder,
      updatedAt: d.updatedAt,
    }))
  );
});

bannersRouter.post("/", async (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const subtitle = typeof req.body?.subtitle === "string" ? req.body.subtitle.trim() : "";
  const imageUrl = typeof req.body?.imageUrl === "string" ? req.body.imageUrl.trim() : "";
  const isActive = typeof req.body?.isActive === "boolean" ? req.body.isActive : true;
  const sortOrder = typeof req.body?.sortOrder === "number" ? req.body.sortOrder : 0;

  if (!title || !subtitle || !imageUrl) {
    res.status(400).json({ message: "title, subtitle, imageUrl are required" });
    return;
  }

  const doc = await BannerModel.create({ title, subtitle, imageUrl, isActive, sortOrder });
  res.status(201).json({
    id: String(doc._id),
    title: doc.title,
    subtitle: doc.subtitle,
    imageUrl: doc.imageUrl,
    isActive: doc.isActive,
    sortOrder: doc.sortOrder,
    updatedAt: doc.updatedAt,
  });
});

bannersRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const patch: Record<string, unknown> = {};

  if (typeof req.body?.title === "string") patch.title = req.body.title.trim();
  if (typeof req.body?.subtitle === "string") patch.subtitle = req.body.subtitle.trim();
  if (typeof req.body?.imageUrl === "string") patch.imageUrl = req.body.imageUrl.trim();
  if (typeof req.body?.isActive === "boolean") patch.isActive = req.body.isActive;
  if (typeof req.body?.sortOrder === "number") patch.sortOrder = req.body.sortOrder;

  const doc = await BannerModel.findByIdAndUpdate(id, patch, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.json({
    id: String(doc._id),
    title: doc.title,
    subtitle: doc.subtitle,
    imageUrl: doc.imageUrl,
    isActive: doc.isActive,
    sortOrder: doc.sortOrder,
    updatedAt: doc.updatedAt,
  });
});

bannersRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const doc = await BannerModel.findByIdAndDelete(id).lean();
  if (!doc) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json({ ok: true });
});

