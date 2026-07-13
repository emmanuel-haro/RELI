import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    donorName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    category: { type: String, default: "general" },
    method: {
      type: String,
      enum: ["mpesa_paybill", "mpesa_buygoods", "bank_transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "initiated", "completed", "failed", "cancelled"],
      default: "pending",
    },
    checkoutRequestId: { type: String },
    merchantRequestId: { type: String },
    mpesaReceiptNumber: { type: String },
    resultDesc: { type: String },
    accountReference: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
