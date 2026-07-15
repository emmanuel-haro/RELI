import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import messageRoutes from "./routes/messages.js";
import paymentRoutes from "./routes/payments.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);


const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "RELI API is running", timestamp: new Date().toISOString() });
});

app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`RELI backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
