import { Router } from "express";
import Payment from "../models/Payment.js";
import { initiateStkPush, getPaymentConfig } from "../services/mpesa.js";
import { sendDonationConfirmation } from "../services/email.js";

const router = Router();

router.get("/config", (_req, res) => {
  res.json({ success: true, data: getPaymentConfig() });
});

router.post("/bank", async (req, res) => {
  try {
    const { donorName, email, amount, category, reference } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, error: "Valid amount is required" });
    }

    const payment = await Payment.create({
      donorName,
      phone: "bank",
      amount: Number(amount),
      category: category || "general",
      method: "bank_transfer",
      status: "pending",
      accountReference: reference || `BANK-${Date.now()}`,
    });

    const config = getPaymentConfig();

    if (email) {
      await sendDonationConfirmation({
        email,
        donorName,
        amount,
        method: "Bank Transfer",
      });
    }

    res.status(201).json({
      success: true,
      message: "Bank transfer donation recorded. Please use the bank details provided.",
      data: {
        paymentId: payment._id,
        bank: config.bank,
        reference: payment.accountReference,
      },
    });
  } catch (err) {
    console.error("Bank donation error:", err);
    res.status(500).json({ success: false, error: "Failed to record bank donation" });
  }
});

router.post("/mpesa/stk", async (req, res) => {
  try {
    const { phone, amount, method, category, donorName, accountReference } = req.body;

    if (!phone || !amount || amount < 1) {
      return res.status(400).json({ success: false, error: "Phone and valid amount are required" });
    }

    const validMethods = ["mpesa_paybill", "mpesa_buygoods"];
    if (!validMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        error: "Method must be mpesa_paybill or mpesa_buygoods",
      });
    }

    const payment = await Payment.create({
      donorName,
      phone,
      amount: Number(amount),
      category: category || "general",
      method,
      status: "pending",
      accountReference: accountReference || `RELI-${Date.now()}`,
    });

    try {
      const stk = await initiateStkPush({
        phone,
        amount,
        method,
        accountReference: payment.accountReference,
        donorName,
      });

      payment.status = "initiated";
      payment.checkoutRequestId = stk.CheckoutRequestID;
      payment.merchantRequestId = stk.MerchantRequestID;
      payment.resultDesc = stk.ResponseDescription;
      await payment.save();

      res.json({
        success: true,
        message: stk.CustomerMessage || "STK push sent. Check your phone to complete payment.",
        data: {
          paymentId: payment._id,
          checkoutRequestId: stk.CheckoutRequestID,
          responseCode: stk.ResponseCode,
        },
      });
    } catch (mpesaErr) {
      payment.status = "failed";
      payment.resultDesc = mpesaErr.message;
      await payment.save();

      const isConfigError = mpesaErr.message?.includes("not configured");
      res.status(isConfigError ? 503 : 502).json({
        success: false,
        error: isConfigError
          ? "M-Pesa is not fully configured. Use bank transfer or configure Daraja API credentials."
          : "M-Pesa STK push failed. Please try again.",
        details: process.env.NODE_ENV === "development" ? mpesaErr.message : undefined,
      });
    }
  } catch (err) {
    console.error("STK error:", err);
    res.status(500).json({ success: false, error: "Payment initiation failed" });
  }
});

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
