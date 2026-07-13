import express from 'express';
import { isUsingMockDb, mockDb } from '../config/db.js';
import VolunteerApplication from '../models/VolunteerApplication.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const ALLOWED_FIELDS = ['teaching', 'eco', 'disaster', 'blood', 'general'];

// Helper: resolve admin's user record and send them a message
const notifyAdmin = (appData) => {
  if (isUsingMockDb) {
    if (!mockDb.messages) mockDb.messages = [];
    const admin = mockDb.users?.find(u => u.email === 'sohel0130844@gmail.com');
    const adminId = admin ? (admin.id || admin._id?.toString()) : 'admin-super';
    mockDb.messages.unshift({
      _id: `msg-app-${Date.now()}`,
      senderId:      'system-applicant',
      senderName:    appData.fullName,
      recipientId:   adminId,
      recipientName: admin?.name || 'Super Admin',
      content:
        `📋 নতুন স্বেচ্ছাসেবী আবেদন!\n` +
        `নাম: ${appData.fullName}\n` +
        `ইমেইল: ${appData.email}\n` +
        `মোবাইল: ${appData.mobile}\n` +
        `ক্ষেত্র: ${appData.field}\n` +
        `কারণ: ${appData.whyJoin}`,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  // MongoDB path: Message model will be imported dynamically to avoid circular deps
};

// -------------------------------------------------
// POST /api/applications  — Public: submit a new application
// -------------------------------------------------
router.post('/', async (req, res) => {
  const { fullName, email, mobile, field, whyJoin } = req.body;

  if (!fullName || !email || !mobile || !field || !whyJoin) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (!ALLOWED_FIELDS.includes(field)) {
    return res.status(400).json({ message: 'Invalid field of work selected.' });
  }

  try {
    if (isUsingMockDb) {
      if (!mockDb.applications) mockDb.applications = [];
      const newApp = {
        _id: `app-${Date.now()}`,
        fullName, email, mobile, field, whyJoin,
        status: 'pending',
        createdAt: new Date(),
      };
      mockDb.applications.unshift(newApp);
      notifyAdmin(newApp);   // ← send message to admin inbox
      return res.status(201).json({ message: 'Application submitted successfully!', application: newApp });
    } else {
      const newApp = await VolunteerApplication.create({ fullName, email, mobile, field, whyJoin });
      // MongoDB: send message to admin
      try {
        const Message = (await import('../models/Message.js')).default;
        const User    = (await import('../models/User.js')).default;
        const admin   = await User.findOne({ email: 'sohel0130844@gmail.com' });
        if (admin) {
          await Message.create({
            senderId:      newApp._id.toString(),
            senderName:    fullName,
            recipientId:   admin._id.toString(),
            recipientName: admin.name,
            content:
              `📋 নতুন স্বেচ্ছাসেবী আবেদন!\n` +
              `নাম: ${fullName}\nইমেইল: ${email}\n` +
              `মোবাইল: ${mobile}\nক্ষেত্র: ${field}\n` +
              `কারণ: ${whyJoin}`,
          });
        }
      } catch (msgErr) {
        console.error('Non-fatal: could not send admin notification message:', msgErr);
      }
      return res.status(201).json({ message: 'Application submitted successfully!', application: newApp });
    }
  } catch (err) {
    console.error('Error saving application:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// -------------------------------------------------
// GET /api/applications  — Admin only: list all applications
// -------------------------------------------------
const SUPER_ADMIN_EMAIL = 'sohel0130844@gmail.com';

const requireSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin' && req.user.email === SUPER_ADMIN_EMAIL) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Super Admin only.' });
};

router.get('/', protect, requireSuperAdmin, async (req, res) => {
  try {
    if (isUsingMockDb) {
      if (!mockDb.applications) mockDb.applications = [];
      return res.json(mockDb.applications);
    } else {
      const apps = await VolunteerApplication.find().sort({ createdAt: -1 });
      return res.json(apps);
    }
  } catch (err) {
    console.error('Error fetching applications:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// -------------------------------------------------
// PATCH /api/applications/:id/status  — Admin only: update status
// -------------------------------------------------
router.patch('/:id/status', protect, requireSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const VALID_STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'];

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    if (isUsingMockDb) {
      if (!mockDb.applications) mockDb.applications = [];
      const app = mockDb.applications.find(a => a._id === id);
      if (!app) return res.status(404).json({ message: 'Application not found.' });
      app.status = status;
      return res.json(app);
    } else {
      const app = await VolunteerApplication.findByIdAndUpdate(id, { status }, { new: true });
      if (!app) return res.status(404).json({ message: 'Application not found.' });
      return res.json(app);
    }
  } catch (err) {
    console.error('Error updating status:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// -------------------------------------------------
// DELETE /api/applications/:id  — Admin only: delete application
// -------------------------------------------------
router.delete('/:id', protect, requireSuperAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (isUsingMockDb) {
      if (!mockDb.applications) mockDb.applications = [];
      const idx = mockDb.applications.findIndex(a => a._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Application not found.' });
      mockDb.applications.splice(idx, 1);
      return res.json({ message: 'Application deleted.' });
    } else {
      const app = await VolunteerApplication.findByIdAndDelete(id);
      if (!app) return res.status(404).json({ message: 'Application not found.' });
      return res.json({ message: 'Application deleted.' });
    }
  } catch (err) {
    console.error('Error deleting application:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
