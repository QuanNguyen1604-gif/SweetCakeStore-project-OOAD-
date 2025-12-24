const PaymentTransaction = require("../models/PaymentTransaction");
const Order = require("../models/Order");

function mockSuccess80() {
  return Math.random() < 0.8;
}

exports.pay = async (req, res) => {
  const { orderId, method, forceStatus } = req.body || {};
  if (!orderId || !method) return res.status(400).json({ message: "orderId and method are required" });

  if (!["COD", "ZaloPay", "VNPay"].includes(method)) {
    return res.status(400).json({ message: "method must be COD|ZaloPay|VNPay" });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // (optional) chặn người khác pay order của bạn
  if (order.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  let status = "FAILED";

  if (method === "COD") {
    status = "SUCCESS";
  } else {
    if (forceStatus && ["SUCCESS", "FAILED"].includes(forceStatus)) {
      status = forceStatus;
    } else {
      status = mockSuccess80() ? "SUCCESS" : "FAILED";
    }
  }

  await PaymentTransaction.create({ orderId: order._id, method, status });

  order.status = status === "SUCCESS" ? "PAID" : "PAYMENT_FAILED";
  await order.save();

  return res.json({ status });
};
