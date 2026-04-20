import dotenv from "dotenv";
import mongoose from "mongoose";

import { createApp } from "./app";

dotenv.config();

const PORT = Number(process.env.PORT ?? 5000);
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  if (MONGODB_URI) {
    await mongoose.connect(MONGODB_URI);
  } else {
    console.warn("MONGODB_URI is not set. API will start without database connection.");
  }

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
