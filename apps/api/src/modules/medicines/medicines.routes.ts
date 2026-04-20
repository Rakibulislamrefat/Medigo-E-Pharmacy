import express from "express";

import { MedicineModel } from "./medicine.model";

export const medicinesRouter = express.Router();

medicinesRouter.get("/", async (req, res) => {
  const qRaw = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const categoryRaw = typeof req.query.category === "string" ? req.query.category.trim() : "";

  const filter: Record<string, unknown> = { isPublished: true };

  if (categoryRaw && categoryRaw.toLowerCase() !== "all") {
    filter.category = categoryRaw;
  }

  if (qRaw) {
    filter.$or = [{ name: { $regex: qRaw, $options: "i" } }, { brand: { $regex: qRaw, $options: "i" } }];
  }

  const docs = await MedicineModel.find(filter).sort({ updatedAt: -1 }).limit(60).lean();

  res.json(
    docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      brand: d.brand,
      category: d.category,
      description: d.description,
      price: d.price,
      stockQty: d.stockQty,
      isPublished: d.isPublished,
      imageUrl: d.imageUrl,
    }))
  );
});

medicinesRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const doc = await MedicineModel.findById(id).lean();

  if (!doc || !doc.isPublished) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.json({
    id: String(doc._id),
    name: doc.name,
    brand: doc.brand,
    category: doc.category,
    description: doc.description,
    price: doc.price,
    stockQty: doc.stockQty,
    isPublished: doc.isPublished,
    imageUrl: doc.imageUrl,
  });
});

