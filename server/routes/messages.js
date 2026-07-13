import express from 'express';
import { isUsingMockDb, mockDb } from '../config/db.js';
import Message from '../models/Message.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const ADMIN_ID    = 'admin-super';
const ADMIN_EMAIL = 'sohel0130844@gmail.com';

// Helper: ensure mockDb.messages exists
const ensureMockMessages = () => {
  if (!mockDb.messages) mockDb.messages = [];
};

// ─────────────────────────────────────────────
// Helpers to derive canonical "other user" ID
// in a conversation involving the admin.
// ─────────────────────────────────────────────
const getAdminId = (users) => {
  const admin = users.find(u => u.email === ADMIN_EMAIL);
  return admin ? (admin.id || admin._id?.toString()) : ADMIN_ID;
};

// ──────────────────────────────────────────────────────────
// POST /api/messages
// Send a message. Sender must be logged in.
// Body: { recipientId, content }
// ──────────────────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  const { recipientId, content } = req.body;
  const senderId   = (req.user.id || req.user._id)?.toString();
  const senderName = req.user.name;

  if (!recipientId || !content?.trim()) {
    return res.status(400).json({ message: 'recipientId and content are required.' });
  }

  try {
    if (isUsingMockDb) {
      ensureMockMessages();

      // Find recipient name
      const recipient = mockDb.users.find(u => (u.id || u._id?.toString()) === recipientId);
      if (!recipient) return res.status(404).json({ message: 'Recipient not found.' });

      const msg = {
        _id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        recipientId,
        recipientName: recipient.name,
        content: content.trim(),
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDb.messages.push(msg);
      return res.status(201).json(msg);
    } else {
      const User = (await import('../models/User.js')).default;
      const recipient = await User.findById(recipientId);
      if (!recipient) return res.status(404).json({ message: 'Recipient not found.' });

      const msg = await Message.create({
        senderId,
        senderName,
        recipientId,
        recipientName: recipient.name,
        content: content.trim(),
      });
      return res.status(201).json(msg);
    }
  } catch (err) {
    console.error('Error sending message:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/messages/conversations
// ADMIN ONLY: list all unique conversation partners with
// last message preview and unread count.
// ──────────────────────────────────────────────────────────
router.get('/conversations', protect, async (req, res) => {
  const requesterId = (req.user.id || req.user._id)?.toString();

  if (req.user.role !== 'super_admin' || req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Admin only.' });
  }

  try {
    if (isUsingMockDb) {
      ensureMockMessages();
      const adminId = getAdminId(mockDb.users);

      // Collect all unique user IDs that have chatted with admin
      const partnerMap = {};
      mockDb.messages.forEach(m => {
        const isAdminSender    = m.senderId === adminId;
        const isAdminRecipient = m.recipientId === adminId;
        if (!isAdminSender && !isAdminRecipient) return;

        const partnerId   = isAdminSender ? m.recipientId : m.senderId;
        const partnerName = isAdminSender ? m.recipientName : m.senderName;

        if (!partnerMap[partnerId]) {
          partnerMap[partnerId] = { userId: partnerId, userName: partnerName, lastMessage: null, unread: 0 };
        }
        // Update last message (messages are in insertion order; overwrite each time)
        partnerMap[partnerId].lastMessage = m;
        // Count messages FROM user that admin hasn't read
        if (!isAdminSender && !m.read) {
          partnerMap[partnerId].unread += 1;
        }
      });

      const conversations = Object.values(partnerMap).sort(
        (a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt)
      );
      return res.json(conversations);
    } else {
      const adminId = requesterId;
      const allMsgs = await Message.find({
        $or: [{ senderId: adminId }, { recipientId: adminId }]
      }).sort({ createdAt: 1 });

      const partnerMap = {};
      allMsgs.forEach(m => {
        const isAdminSender = m.senderId === adminId;
        const partnerId   = isAdminSender ? m.recipientId : m.senderId;
        const partnerName = isAdminSender ? m.recipientName : m.senderName;

        if (!partnerMap[partnerId]) {
          partnerMap[partnerId] = { userId: partnerId, userName: partnerName, lastMessage: null, unread: 0 };
        }
        partnerMap[partnerId].lastMessage = m;
        if (!isAdminSender && !m.read) {
          partnerMap[partnerId].unread += 1;
        }
      });

      const conversations = Object.values(partnerMap).sort(
        (a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt)
      );
      return res.json(conversations);
    }
  } catch (err) {
    console.error('Error fetching conversations:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/messages/conversation/:userId
// Get full message thread between current user and :userId
// Accessible by: admin (any userId) OR the user themselves
// (their own thread with admin)
// ──────────────────────────────────────────────────────────
router.get('/conversation/:userId', protect, async (req, res) => {
  const meId     = (req.user.id || req.user._id)?.toString();
  const otherId  = req.params.userId;

  // Regular users usually request 'admin' as otherId
  // They can only see messages where they are sender/recipient anyway.
  if (req.user.role !== 'super_admin' || req.user.email !== ADMIN_EMAIL) {
    // Basic guard
    if (otherId !== 'admin' && !otherId) {
      return res.status(403).json({ message: 'Users can only message the admin' });
    }
  }

  try {
    if (isUsingMockDb) {
      ensureMockMessages();
      const adminId = getAdminId(mockDb.users);

      // Resolve "admin" alias
      const realOtherId = otherId === 'admin' ? adminId : otherId;
      const realMeId    = meId === adminId ? adminId : meId;

      const thread = mockDb.messages.filter(m =>
        (m.senderId === realMeId && m.recipientId === realOtherId) ||
        (m.senderId === realOtherId && m.recipientId === realMeId)
      ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      return res.json(thread);
    } else {
      const realOtherId = otherId;
      const thread = await Message.find({
        $or: [
          { senderId: meId, recipientId: realOtherId },
          { senderId: realOtherId, recipientId: meId },
        ]
      }).sort({ createdAt: 1 });
      return res.json(thread);
    }
  } catch (err) {
    console.error('Error fetching thread:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/messages/inbox
// For regular users: get their unread count from admin
// ──────────────────────────────────────────────────────────
router.get('/inbox', protect, async (req, res) => {
  const userId = (req.user.id || req.user._id)?.toString();

  try {
    if (isUsingMockDb) {
      ensureMockMessages();
      const adminId = getAdminId(mockDb.users);
      const unread = mockDb.messages.filter(
        m => m.recipientId === userId && m.senderId === adminId && !m.read
      ).length;
      return res.json({ unread });
    } else {
      // Find admin's MongoDB _id by looking for super_admin role
      const User = (await import('../models/User.js')).default;
      const admin = await User.findOne({ role: 'super_admin' });
      const adminId = admin?._id?.toString();
      const unread = adminId
        ? await Message.countDocuments({ recipientId: userId, senderId: adminId, read: false })
        : 0;
      return res.json({ unread });
    }
  } catch (err) {
    console.error('Error fetching inbox:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ──────────────────────────────────────────────────────────
// PATCH /api/messages/read/:partnerId
// Mark all messages FROM partnerId TO current user as read
// ──────────────────────────────────────────────────────────
router.patch('/read/:partnerId', protect, async (req, res) => {
  const meId        = (req.user.id || req.user._id)?.toString();
  const partnerId   = req.params.partnerId;

  try {
    if (isUsingMockDb) {
      ensureMockMessages();
      const adminId = getAdminId(mockDb.users);
      const realPartnerId = partnerId === 'admin' ? adminId : partnerId;

      mockDb.messages.forEach(m => {
        if (m.senderId === realPartnerId && m.recipientId === meId) {
          m.read = true;
        }
      });
      return res.json({ message: 'Marked as read.' });
    } else {
      const realPartnerId = partnerId;
      await Message.updateMany(
        { senderId: realPartnerId, recipientId: meId, read: false },
        { read: true }
      );
      return res.json({ message: 'Marked as read.' });
    }
  } catch (err) {
    console.error('Error marking read:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/messages/admin-id
// Convenience: returns the admin's user ID so front-end
// can open the correct thread without hardcoding.
// ──────────────────────────────────────────────────────────
router.get('/admin-id', protect, async (req, res) => {
  try {
    if (isUsingMockDb) {
      const adminId = getAdminId(mockDb.users);
      return res.json({ adminId });
    } else {
      const User = (await import('../models/User.js')).default;
      const admin = await User.findOne({ email: ADMIN_EMAIL });
      return res.json({ adminId: admin?._id?.toString() || null });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
