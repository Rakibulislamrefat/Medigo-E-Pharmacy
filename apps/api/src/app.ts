import cors from "cors";
import express from "express";

import { bannersRouter } from "./modules/banners/banners.routes";
import { consultationRouter } from "./modules/consultation/consultation.routes";
import { deliveriesRouter } from "./modules/deliveries/deliveries.routes";
import { feedbackRouter } from "./modules/feedback/feedback.routes";
import { homeRouter } from "./modules/home/home.routes";
import { medicinesRouter } from "./modules/medicines/medicines.routes";
import { ordersRouter } from "./modules/orders/orders.routes";
import { prescriptionsRouter } from "./modules/prescriptions/prescriptions.routes";
import { refillRouter } from "./modules/refill/refill.routes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: "health is good" });
  });

  app.use("/home", homeRouter);
  app.use("/medicines", medicinesRouter);
  app.use("/banners", bannersRouter);
  app.use("/orders", ordersRouter);
  app.use("/feedback", feedbackRouter);
  app.use("/deliveries", deliveriesRouter);
  app.use("/prescriptions", prescriptionsRouter);
  app.use("/refill-requests", refillRouter);
  app.use("/consultations", consultationRouter);

  return app;
}
