import { Router } from "express";
import Message from "../models/Message.js";
import { sendContactNotification } from "../services/email.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email address" });
    }

    const saved = await Message.create({ name, email, subject, message });
    const notification = await sendContactNotification({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: "Your message has been received. We will get back to you soon.",
      data: { id: saved._id, emailSent: notification.sent },
    });
  } catch (err) {
    console.error("Message error:", err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
});

router.get("/stats", async (_req, res) => {
  try {
    const total = await Message.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Message.countDocuments({ createdAt: { $gte: today } });
    res.json({ success: true, data: { total, today: todayCount } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
});

export default router;
