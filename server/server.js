import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, isUsingMockDb, mockDb } from './config/db.js';
import { seedClubs } from './data/clubsSeeder.js';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import clubsRoutes from './routes/clubs.js';
import adminRoutes from './routes/admin.js';
import applicationsRoutes from './routes/applications.js';
import messagesRoutes from './routes/messages.js';

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/messages', messagesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

const PORT = process.env.PORT || 5000;

// Seed a default Super Admin user
const seedAdminUser = async () => {
  const adminEmail = 'sohel0130844@gmail.com';
  const adminPass = 'Sohel@2024';      // Super Admin password
  const userPass  = 'Sohel123';        // Regular User (Member) password

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPass, salt);

  if (isUsingMockDb) {
    // Remove any old admin@coop.com entry if it exists
    const oldIdx = mockDb.users.findIndex(u => u.email === 'admin@coop.com');
    if (oldIdx !== -1) mockDb.users.splice(oldIdx, 1);

    const adminExists = mockDb.users.find(u => u.email === adminEmail);
    if (!adminExists) {
      const saltA = await bcrypt.genSalt(10);
      const hashedAdmin = await bcrypt.hash(adminPass, saltA);
      const saltU = await bcrypt.genSalt(10);
      const hashedUser = await bcrypt.hash(userPass, saltU);
      mockDb.users.push({
        id: 'admin-super',
        name: 'Sohel (Super Admin)',
        email: adminEmail,
        password: hashedAdmin,        // admin password
        userPassword: hashedUser,     // user/member password
        preferredLanguage: 'bn',
        clubId: 1,
        role: 'super_admin',
        createdAt: new Date()
      });
      console.log(`👑 Seeded Super Admin in Mock DB: ${adminEmail}`);
      console.log(`   Admin pw: ${adminPass} | User pw: ${userPass}`);
    }
  } else {
    try {
      // Remove old default admin if present
      await User.deleteOne({ email: 'admin@coop.com' }).catch(() => {});

      const adminExists = await User.findOne({ email: adminEmail });
      if (!adminExists) {
        await User.create({
          name: 'Sohel (Super Admin)',
          email: adminEmail,
          password: hashedPassword,
          clubId: 1,
          role: 'super_admin'
        });
        console.log(`👑 Seeded Super Admin in MongoDB: ${adminEmail}`);
      }
    } catch (err) {
      console.error('Failed to seed admin user:', err.message);
    }
  }
};

// Start Server
const startServer = async () => {
  // Connect to DB (with fallback to mock DB)
  await connectDB();

  // Seed data if DB is empty
  await seedClubs();

  // Seed super admin user
  await seedAdminUser();

  app.listen(PORT, () => {
    console.log(`🚀 Express Server is running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Server startup failed:', err);
});
