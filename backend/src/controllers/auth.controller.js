const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function setAuthCookie(res, token) {
  const cookieName = process.env.COOKIE_NAME || "token";
  const secure = String(process.env.COOKIE_SECURE).toLowerCase() === "true";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

exports.register = async (req, res) => {
  const { name, username, email, password } = req.body || {};
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "name, username, email, password are required" });
  }

  const u = username.toLowerCase().trim();
  const e = email.toLowerCase().trim();

  // chặn user đăng ký trùng admin username
  if (u === "admin") return res.status(403).json({ message: "Username not allowed" });

  const existsU = await User.findOne({ username: u });
  if (existsU) return res.status(409).json({ message: "Username already exists" });

  const existsE = await User.findOne({ email: e });
  if (existsE) return res.status(409).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username: u,
    email: e,
    passwordHash,
    role: "USER"
  });

  return res.status(201).json({
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  const u = username.toLowerCase().trim();
  const user = await User.findOne({ username: u });
  if (!user) return res.status(401).json({ message: "Invalid username or password" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid username or password" });

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  setAuthCookie(res, token);

  return res.json({
    message: "Login success",
    user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role }
  });
};

exports.logout = async (req, res) => {
  const cookieName = process.env.COOKIE_NAME || "token";
  res.clearCookie(cookieName, { httpOnly: true, sameSite: "lax" });
  return res.json({ message: "Logout success" });
};

exports.me = async (req, res) => {
  return res.json({ user: req.user });
};
