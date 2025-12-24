const Cart = require("../models/Cart");

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

exports.getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  return res.json(cart);
};

exports.addItem = async (req, res) => {
  const { productId, qty } = req.body || {};
  if (!productId || !qty || qty < 1) {
    return res.status(400).json({ message: "productId and qty>=1 are required" });
  }

  const cart = await getOrCreateCart(req.user._id);

  const idx = cart.items.findIndex((i) => i.productId === productId);
  if (idx >= 0) {
    cart.items[idx].qty += qty;
  } else {
    cart.items.push({ productId, qty });
  }

  await cart.save();
  return res.json(cart);
};

exports.updateQty = async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body || {};

  if (!qty || qty < 1) return res.status(400).json({ message: "qty>=1 is required" });

  const cart = await getOrCreateCart(req.user._id);
  const idx = cart.items.findIndex((i) => i.productId === productId);
  if (idx < 0) return res.status(404).json({ message: "Item not found" });

  cart.items[idx].qty = qty;
  await cart.save();
  return res.json(cart);
};

exports.removeItem = async (req, res) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user._id);

  cart.items = cart.items.filter((i) => i.productId !== productId);
  await cart.save();
  return res.json(cart);
};

exports.clearCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  return res.json(cart);
};
