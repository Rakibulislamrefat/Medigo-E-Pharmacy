import express from "express";

import { BannerModel } from "../banners/banner.model";
import { MedicineModel } from "../medicines/medicine.model";

export const homeRouter = express.Router();

homeRouter.get("/", async (_req, res) => {
  const featuredDocs = await MedicineModel.find({ isPublished: true })
    .sort({ updatedAt: -1 })
    .limit(9)
    .lean();

  const categoriesRaw = await MedicineModel.distinct("category", { isPublished: true });
  const categories = categoriesRaw
    .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    .slice(0, 20)
    .sort((a, b) => a.localeCompare(b));

  const bannerDocs = await BannerModel.find({ isActive: true }).sort({ sortOrder: 1, updatedAt: -1 }).limit(10).lean();

  res.json({
    banners: bannerDocs.map((b) => ({
      key: String(b._id),
      title: b.title,
      subtitle: b.subtitle,
      imageUrl: b.imageUrl,
    })),
    categories,
    featuredMedicines: featuredDocs.map((d) => ({
      id: String(d._id),
      name: d.name,
      brand: d.brand,
      category: d.category,
      description: d.description,
      price: d.price,
      stockQty: d.stockQty,
      isPublished: d.isPublished,
      imageUrl: d.imageUrl,
    })),
  });
});
