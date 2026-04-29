import express from "express";
import type { HealthResponse } from "@shared/index.js";

const app = express();
const port = 3000;

app.get("/api/health", (_req, res) => {
  const response: HealthResponse = { status: "ok" };
  res.json(response);
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
