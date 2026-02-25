import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aurum-store';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    role: String,
    storeId: mongoose.Schema.Types.ObjectId,
  }, { timestamps: true }));

  // Check if admin exists
  const existing = await UserModel.findOne({ email: 'admin@aurumstore.com' });
  if (existing) {
    console.log('Admin user already exists');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 12);

  await UserModel.create({
    name: 'Super Admin',
    email: 'admin@aurumstore.com',
    password: hashedPassword,
    phone: '',
    role: 'admin',
  });

  console.log('Admin user created:');
  console.log('  Email: admin@aurumstore.com');
  console.log('  Password: admin123');
  console.log('  Role: admin');

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
