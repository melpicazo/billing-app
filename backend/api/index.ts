import express from "express";
import cors from "cors";
import serverless from "serverless-http";

const app = express();

app.use(cors());
app.use(express.json());

// Remove the /api prefix from routes since Netlify adds it
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/test", (req, res) => {
  res.json({
    message: "Test endpoint working!",
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

app.get("/ping", (req, res) => {
  res.json({ status: "pong" });
});

// Export the handler for Netlify Functions
export const handler = serverless(app);
