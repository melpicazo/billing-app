import express, { type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config";
import { getConnection } from "./db/db";
// import uploadRoutes from "./routes/upload.route";

function logInitializationStep(message: string) {
  const GREEN_COLOR_FORMATTING = "\x1b[32m%s\x1b[0m";
  console.log(GREEN_COLOR_FORMATTING, "✓ init", message);
}

const app = express();

/* Check if the database is running */
// const pool = getConnection();
// pool
//   .query("SELECT 1")
//   .then(() => {
//     logInitializationStep("Connected to PostgreSQL instance");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//     process.exit(1);
//   })
//   .finally(() => pool.end());

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

// app.use("/api/upload", uploadRoutes);
// app.use("/api/billing", billingRoutes);

// Only start server in non-serverless environments
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logInitializationStep(`Server running at http://localhost:${port}`);
  });
}

export default app;
