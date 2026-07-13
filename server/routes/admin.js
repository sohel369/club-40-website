import express from 'express';
import { isUsingMockDb, mockDb } from '../config/db.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to enforce Super Admin only — locked to the one designated email
const SUPER_ADMIN_EMAIL = 'sohel0130844@gmail.com';

const requireSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin' && req.user.email === SUPER_ADMIN_EMAIL) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Super Admin privileges required.' });
};

// @desc    Get all users (Super Admin only)
// @route   GET /api/admin/users
// @access  Private (Super Admin)
router.get('/users', protect, requireSuperAdmin, async (req, res) => {
  try {
    if (isUsingMockDb) {
      // Map and return list of users without passwords
      const usersFiltered = mockDb.users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        clubId: u.clubId,
        role: u.role || 'member',
        createdAt: u.createdAt
      }));
      return res.json(usersFiltered);
    } else {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(users);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error retrieving users' });
  }
});

// @desc    Create a new user directly (Super Admin only)
// @route   POST /api/admin/users
// @access  Private (Super Admin)
router.post('/users', protect, requireSuperAdmin, async (req, res) => {
  const bcrypt = (await import('bcryptjs')).default;
  const { name, email, password, clubId, role } = req.body;

  if (!name || !email || !password || !clubId) {
    return res.status(400).json({ message: 'Name, email, password and club are required.' });
  }

  const allowedRoles = ['member', 'club_admin'];
  const assignedRole = allowedRoles.includes(role) ? role : 'member';

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    if (isUsingMockDb) {
      const exists = mockDb.users.find(u => u.email === email);
      if (exists) return res.status(400).json({ message: 'A user with this email already exists.' });

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password: hashed,
        preferredLanguage: 'bn',
        clubId: parseInt(clubId, 10),
        role: assignedRole,
        createdAt: new Date()
      };
      mockDb.users.push(newUser);
      return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        clubId: newUser.clubId,
        role: newUser.role,
        createdAt: newUser.createdAt
      });
    } else {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'A user with this email already exists.' });

      const newUser = await User.create({
        name, email, password: hashed,
        clubId: parseInt(clubId, 10),
        role: assignedRole
      });
      return res.status(201).json({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        clubId: newUser.clubId,
        role: newUser.role,
        createdAt: newUser.createdAt
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error creating user.' });
  }
});

// @desc    Update user role (Super Admin only) — can only set member or club_admin
// @route   PUT /api/admin/users/:id/role
// @access  Private (Super Admin)
router.put('/users/:id/role', protect, requireSuperAdmin, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  // Super admin can only assign 'member' or 'club_admin' — never super_admin
  if (!role || !['member', 'club_admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. You can only assign member or club_admin.' });
  }

  try {
    if (isUsingMockDb) {
      const user = mockDb.users.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found in mock DB' });
      }
      // Protect the super admin account from role changes
      if (user.email === SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Cannot change the Super Admin\'s own role.' });
      }
      user.role = role;
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        clubId: user.clubId,
        role: user.role
      });
    } else {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.email === SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Cannot change the Super Admin\'s own role.' });
      }
      user.role = role;
      await user.save();
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        clubId: user.clubId,
        role: user.role
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error updating user role' });
  }
});

// @desc    Delete user account (Super Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Super Admin)
router.delete('/users/:id', protect, requireSuperAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    if (isUsingMockDb) {
      const userIdx = mockDb.users.findIndex(u => u.id === userId);
      if (userIdx === -1) {
        return res.status(404).json({ message: 'User not found in mock DB' });
      }
      mockDb.users.splice(userIdx, 1);
      return res.json({ message: 'User account deleted successfully' });
    } else {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await User.deleteOne({ _id: userId });
      return res.json({ message: 'User account deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error deleting user account' });
  }
});

export default router;
