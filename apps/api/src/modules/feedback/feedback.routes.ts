import express from "express";

import { FeedbackModel } from "./feedback.model";

export const feedbackRouter = express.Router();

feedbackRouter.get("/", async (req, res) => {
  const userEmail = typeof req.query.userEmail === "string" ? req.query.userEmail.trim().toLowerCase() : "";
  const orderId = typeof req.query.orderId === "string" ? req.query.orderId.trim() : "";

  const filter: Record<string, unknown> = {};
  if (userEmail) filter.userEmail = userEmail;
  if (orderId) filter.orderId = orderId;

  const docs = await FeedbackModel.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json(
    docs.map((d) => ({
      id: String(d._id),
      userEmail: d.userEmail,
      orderId: d.orderId,
      rating: d.rating,
      comment: d.comment,
      createdAt: d.createdAt,
    }))
  );
});

feedbackRouter.post("/", async (req, res) => {
  const userEmail = typeof req.body?.userEmail === "string" ? req.body.userEmail.trim().toLowerCase() : "";
  const orderId = typeof req.body?.orderId === "string" ? req.body.orderId.trim() : "";
  const rating = typeof req.body?.rating === "number" ? req.body.rating : Number(req.body?.rating ?? 0);
  const comment = typeof req.body?.comment === "string" ? req.body.comment.trim() : "";

  if (!userEmail || !orderId || !comment) {
    res.status(400).json({ message: "userEmail, orderId, comment are required" });
    return;
  }

  const safeRating = Math.max(1, Math.min(5, Math.round(rating)));
  const doc = await FeedbackModel.create({ userEmail, orderId, rating: safeRating, comment });

  res.status(201).json({
    id: String(doc._id),
    userEmail: doc.userEmail,
    orderId: doc.orderId,
    rating: doc.rating,
    comment: doc.comment,
    createdAt: doc.createdAt,
  });
});

