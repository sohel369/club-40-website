import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isUsingMockDb, mockDb } from '../config/db.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, clubId } = req.body;

  try {
    if (!name || !email || !password || !clubId) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isUsingMockDb) {
      // Mock DB Register
      const userExists = mockDb.users.find(u => u.email === normalizedEmail);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: (mockDb.users.length + 1).toString(),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        preferredLanguage: 'bn',
        clubId: parseInt(clubId, 10),
        role: 'member',
        createdAt: new Date()
      };

      mockDb.users.push(newUser);

      return res.status(201).json({
        token: generateToken(newUser.id),
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          preferredLanguage: newUser.preferredLanguage,
          clubId: newUser.clubId,
          role: newUser.role
        }
      });
    } else {
      // MongoDB Register
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        clubId: parseInt(clubId, 10)
      });

      return res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          clubId: user.clubId,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isUsingMockDb) {
      // Mock DB Login
      const user = mockDb.users.find(u => u.email === normalizedEmail);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // --- Dual-password check for super admin ---
      // If the account has a userPassword field, check it first as a member login
      if (user.userPassword) {
        const isAdminMatch = await bcrypt.compare(password, user.password);
        const isUserMatch  = await bcrypt.compare(password, user.userPassword);

        if (!isAdminMatch && !isUserMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Admin password → log in as super_admin
        if (isAdminMatch) {
          return res.json({
            token: generateToken(user.id),
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              preferredLanguage: user.preferredLanguage,
              clubId: user.clubId,
              role: 'super_admin'
            }
          });
        }

        // User password → log in as a regular member (same email, different role)
        if (isUserMatch) {
          return res.json({
            token: generateToken(user.id + '-user'),
            user: {
              id: user.id + '-user',
              name: user.name,
              email: user.email,
              preferredLanguage: user.preferredLanguage,
              clubId: user.clubId,
              role: 'member'
            }
          });
        }
      }

      // Regular single-password login
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      return res.json({
        token: generateToken(user.id),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          clubId: user.clubId,
          role: user.role || 'member'
        }
      });
    } else {
      // MongoDB Login
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Dual-password for MongoDB super admin
      if (user.userPassword) {
        const isAdminMatch = await bcrypt.compare(password, user.password);
        const isUserMatch  = await bcrypt.compare(password, user.userPassword);

        if (!isAdminMatch && !isUserMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (isAdminMatch) {
          return res.json({
            token: generateToken(user._id),
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              preferredLanguage: user.preferredLanguage,
              clubId: user.clubId,
              role: 'super_admin'
            }
          });
        }

        if (isUserMatch) {
          return res.json({
            token: generateToken(user._id.toString() + '-user'),
            user: {
              id: user._id.toString() + '-user',
              name: user.name,
              email: user.email,
              preferredLanguage: user.preferredLanguage,
              clubId: user.clubId,
              role: 'member'
            }
          });
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      return res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          clubId: user.clubId,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  return res.json(req.user);
});

// @desc    Update user profile language preference or name
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  const { name, preferredLanguage } = req.body;

  try {
    if (isUsingMockDb) {
      const baseId = req.user.id.endsWith('-user') ? req.user.id.slice(0, -5) : req.user.id;
      const user = mockDb.users.find(u => u.id === baseId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (name) user.name = name;
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        clubId: user.clubId,
        role: user.role || 'member'
      });
    } else {
      const user = await User.findById(req.user.id || req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (name) user.name = name;
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;

      await user.save();

      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        clubId: user.clubId,
        role: user.role
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/debug-users', async (req, res) => {
  try {
    if (isUsingMockDb) {
      const usersInfo = mockDb.users.map(u => ({ email: u.email, role: u.role, name: u.name }));
      return res.json({ mode: 'mock', users: usersInfo });
    } else {
      const users = await User.find({}, 'email role name');
      return res.json({ mode: 'mongo', users });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
