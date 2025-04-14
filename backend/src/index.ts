import express, { type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./db/db";
import uploadRoutes from "./routes/upload.route";
import billingRoutes from "./routes/billing.route";

function logInitializationStep(message: string) {
  const GREEN_COLOR_FORMATTING = "\x1b[32m%s\x1b[0m";
  console.log(GREEN_COLOR_FORMATTING, "✓ init", message);
}

const app = express();

/* Check if the database is running */
pool
  .query("SELECT 1")
  .then(() => {
    logInitializationStep("Connected to PostgreSQL instance");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

// Simple test endpoints
app.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/api/test", (_req: Request, res: Response) => {
  res.json({
    message: "Test endpoint working!",
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

app.get("/api/ping", (_req: Request, res: Response) => {
  res.json({ status: "pong" });
});

app.use("/api/upload", uploadRoutes);
app.use("/api/billing", billingRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logInitializationStep(`Server running on port ${port}`);
});

export default app;
