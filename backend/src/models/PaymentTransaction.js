const mongoose = require("mongoose");

const paymentTransactionSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    method: { type: String, enum: ["COD", "ZaloPay", "VNPay"], required: true },
    status: { type: String, enum: ["SUCCESS", "FAILED"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentTransaction", paymentTransactionSchema);
