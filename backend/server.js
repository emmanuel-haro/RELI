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

app.set("trust proxy", 1);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : null;

if (!process.env.CLIENT_URL) {
  console.warn(
    "CLIENT_URL is not set. Backend CORS will allow any origin by default. For production, set CLIENT_URL to your deployed frontend origin(s).",
  );
} else {
  console.log(`Backend CORS allowed origins: ${allowedOrigins.join(", ")}`);
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (!allowedOrigins || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const error = new Error(`Origin ${origin} not allowed by CORS`);
    error.status = 403;
    callback(error);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Fallback CORS headers: ensure preflight responses include headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!allowedOrigins) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

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
  } catch (err) {
    console.warn("MongoDB connection failed at startup; continuing with limited functionality:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`RELI backend running on http://localhost:${PORT}`);
  });
}

start();
