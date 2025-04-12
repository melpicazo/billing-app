import express from "express";
import cors from "cors";
import "dotenv/config";
// import pool from "./db/db";
// import uploadRoutes from "./routes/upload.route";
// import billingRoutes from "./routes/billing.route";

function logInitializationStep(message: string) {
  const GREEN_COLOR_FORMATTING = "\x1b[32m%s\x1b[0m";
  console.log(GREEN_COLOR_FORMATTING, "✓ init", message);
}

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Check if the database is running
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

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// app.use("/api/upload", uploadRoutes);
// app.use("/api/billing", billingRoutes);

app.listen({ port }, () => {
  logInitializationStep(`Server running at ${process.env.SERVER_URL}`);
});

export default app;
