import { Router } from "express";
import Payment from "../models/Payment.js";
import { getPaymentConfig } from "../services/mpesa.js";
import { sendDonationConfirmation } from "../services/email.js";

const router = Router();

router.get("/config", (_req, res) => {
  res.json({ success: true, data: getPaymentConfig() });
});

router.post("/bank", async (req, res) => {
  try {
    const { donorName, email, amount, category, reference, method } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, error: "Valid amount is required" });
    }

    const payment = await Payment.create({
      donorName,
      phone: method && method.startsWith("mpesa") ? "mpesa" : "bank",
      amount: Number(amount),
      category: category || "general",
      method: method || "bank_transfer",
      status: "pending",
      accountReference: reference || `REC-${Date.now()}`,
    });

    const config = getPaymentConfig();

    if (email) {
      await sendDonationConfirmation({
        email,
        donorName,
        amount,
        method: payment.method === "bank_transfer" ? "Bank Transfer" : "M-Pesa (manual)",
      });
    }

    res.status(201).json({
      success: true,
      message: "Donation recorded. Thank you — we will acknowledge your gift.",
      data: {
        paymentId: payment._id,
        bank: config.bank,
        reference: payment.accountReference,
      },
    });
  } catch (err) {
    console.error("Bank donation error:", err);
    res.status(500).json({ success: false, error: "Failed to record donation" });
  }
});

// STK Push endpoint removed. M-Pesa methods should use the /payments/bank endpoint to record transfers.

router.post("/mpesa/callback", async (req, res) => {
  try {
    const body = req.body?.Body?.stkCallback;
    if (!body) {
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const checkoutId = body.CheckoutRequestID;
    const payment = await Payment.findOne({ checkoutRequestId: checkoutId });

    if (payment) {
      if (body.ResultCode === 0) {
        const items = body.CallbackMetadata?.Item || [];
        const receipt = items.find((i) => i.Name === "MpesaReceiptNumber");
        payment.status = "completed";
        payment.mpesaReceiptNumber = receipt?.Value?.toString();
        payment.resultDesc = body.ResultDesc;
      } else {
        payment.status = "failed";
        payment.resultDesc = body.ResultDesc;
      }
      await payment.save();
    }

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("Callback error:", err);
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
});

router.get("/status/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch payment status" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch payments" });
  }
});

export default router;
