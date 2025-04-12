import express from "express";
import cors from "cors";
import "dotenv/config";
// import pool from "./db/db";
import uploadRoutes from "./routes/upload.route";
import healthRoutes from "./routes/health.route";

function logInitializationStep(message: string) {
  const GREEN_COLOR_FORMATTING = "\x1b[32m%s\x1b[0m";
  console.log(GREEN_COLOR_FORMATTING, "✓ init", message);
}

const app = express();

/**
 * Check if the database is connected by running a simple query
 */
// pool
//   .query("SELECT 1")
//   .then(() => {
//     logInitializationStep(
//       `Connected to PostgreSQL instance running on port ${
//         process.env.DB_PORT || "5432"
//       }`
//     );
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//     process.exit(1);
//   });

app.use(cors());
app.use(express.json());

// Simple health check directly in index.ts
app.get("/api/ping", (_req, res) => {
  res.json({ status: "pong" });
});

// Then use routers
app.use("/api/health", healthRoutes);
app.use("/api/upload", uploadRoutes);

// Add error handling
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
