import mongoose from "mongoose";

export type BannerDoc = {
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const bannerSchema = new mongoose.Schema<BannerDoc>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    isActive: { type: Boolean, required: true, default: true },
    sortOrder: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const BannerModel =
  (mongoose.models.Banner as mongoose.Model<BannerDoc>) || mongoose.model<BannerDoc>("Banner", bannerSchema);

