const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedAdmin() {
  const adminUsername = "admin";
  const adminEmail = "admin@sweetcake.local";
  const adminPassword = "123456";

  const exists = await User.findOne({ username: adminUsername });
  if (exists) {
    console.log("✅ Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await User.create({
    username: adminUsername,
    email: adminEmail,
    name: "Administrator",
    passwordHash,
    role: "ADMIN"
  });

  console.log("✅ Seeded admin: admin / 123456");
}

module.exports = seedAdmin;
