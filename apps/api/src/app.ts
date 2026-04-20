import cors from "cors";
import express from "express";

import { bannersRouter } from "./modules/banners/banners.routes";
import { homeRouter } from "./modules/home/home.routes";
import { medicinesRouter } from "./modules/medicines/medicines.routes";

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

  return app;
}
