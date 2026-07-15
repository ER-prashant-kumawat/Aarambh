const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  const email = (process.argv[2] || 'admin@aarambhh.com').trim().toLowerCase();
  const newPassword = process.argv[3];

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set in server/.env');
  }

  if (!newPassword) {
    throw new Error('Usage: node scripts/reset-admin-password.js <email> <newPassword>');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`No user found for ${email}`);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  console.log(`Password updated for ${email}`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch (error) {
      // Ignore disconnect errors.
    }
  });
