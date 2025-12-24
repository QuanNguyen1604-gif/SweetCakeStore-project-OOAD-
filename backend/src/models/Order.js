const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["PENDING", "PAID", "PAYMENT_FAILED"], default: "PENDING" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
