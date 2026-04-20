import dotenv from "dotenv";
import mongoose from "mongoose";

import { BannerModel } from "../modules/banners/banner.model";
import { MedicineModel } from "../modules/medicines/medicine.model";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");

  await mongoose.connect(MONGODB_URI);

  const banners = [
    {
      title: "Medigo‑EPharmacy",
      subtitle: "Search medicines fast",
      imageUrl: "https://picsum.photos/seed/medigo-banner-1/1600/700",
      isActive: true,
      sortOrder: 1,
    },
    {
      title: "Home delivery",
      subtitle: "Refill & prescription upload",
      imageUrl: "https://picsum.photos/seed/medigo-banner-2/1600/700",
      isActive: true,
      sortOrder: 2,
    },
    {
      title: "Vitamins & personal care",
      subtitle: "Browse categories and deals",
      imageUrl: "https://picsum.photos/seed/medigo-banner-3/1600/700",
      isActive: true,
      sortOrder: 3,
    },
  ];

  for (const b of banners) {
    await BannerModel.updateOne({ title: b.title }, { $set: b }, { upsert: true });
  }

  const medicines = [
    {
      name: "Napa 500mg",
      brand: "Beximco",
      category: "Medicines",
      description: "Paracetamol 500mg",
      price: 20,
      stockQty: 120,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/medigo-napa/520/520",
    },
    {
      name: "Seclo 20mg",
      brand: "Square",
      category: "Medicines",
      description: "Omeprazole 20mg",
      price: 80,
      stockQty: 60,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/medigo-seclo/520/520",
    },
    {
      name: "Vitamin C 1000mg",
      brand: "VitaPlus",
      category: "Vitamins & Supplements",
      description: "Daily immune support supplement",
      price: 220,
      stockQty: 40,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/medigo-vitc/520/520",
    },
    {
      name: "Glucometer Kit",
      brand: "AccuCheck",
      category: "Diabetic Care",
      description: "Monitor blood glucose at home",
      price: 1250,
      stockQty: 10,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/medigo-glucometer/520/520",
    },
    {
      name: "Gentle Face Wash",
      brand: "SkinLoving",
      category: "Personal Care",
      description: "Mild cleanser for sensitive skin",
      price: 350,
      stockQty: 18,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/medigo-facewash/520/520",
    },
  ];

  for (const m of medicines) {
    await MedicineModel.updateOne({ name: m.name, brand: m.brand }, { $set: m }, { upsert: true });
  }

  console.log("Seeded banners and medicines");
}

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });

