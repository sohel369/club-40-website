import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Message from '@/lib/server/models/Message';
import { protect } from '@/lib/server/middleware/authMiddleware';

const ADMIN_ID = 'admin-super';
const ADMIN_EMAIL = 'sohel0130844@gmail.com';
const ensureMockMessages = () => { if (!mockDb.messages) mockDb.messages = []; };
const getAdminId = (users) => { const admin = users.find(u => u.email === ADMIN_EMAIL); return admin ? (admin.id || admin._id?.toString()) : ADMIN_ID; };

export async function GET(req) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const requesterId = (authResult.user.id || authResult.user._id)?.toString();
  if (authResult.user.role !== 'super_admin' || authResult.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ message: 'Admin only.' }, { status: 403 });
  }

  try {
    if (isUsingMockDb) {
      ensureMockMessages();
      const adminId = getAdminId(mockDb.users);
      const partnerMap = {};
      mockDb.messages.forEach(m => {
        const isAdminSender = m.senderId === adminId;
        const isAdminRecipient = m.recipientId === adminId;
        if (!isAdminSender && !isAdminRecipient) return;

        const partnerId = isAdminSender ? m.recipientId : m.senderId;
        const partnerName = isAdminSender ? m.recipientName : m.senderName;
        if (!partnerMap[partnerId]) partnerMap[partnerId] = { userId: partnerId, userName: partnerName, lastMessage: null, unread: 0 };
        partnerMap[partnerId].lastMessage = m;
        if (!isAdminSender && !m.read) partnerMap[partnerId].unread += 1;
      });
      const conversations = Object.values(partnerMap).sort((a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt));
      return NextResponse.json(conversations);
    } else {
      const adminId = requesterId;
      const allMsgs = await Message.find({ $or: [{ senderId: adminId }, { recipientId: adminId }] }).sort({ createdAt: 1 });
      const partnerMap = {};
      allMsgs.forEach(m => {
        const isAdminSender = m.senderId === adminId;
        const partnerId = isAdminSender ? m.recipientId : m.senderId;
        const partnerName = isAdminSender ? m.recipientName : m.senderName;
        if (!partnerMap[partnerId]) partnerMap[partnerId] = { userId: partnerId, userName: partnerName, lastMessage: null, unread: 0 };
        partnerMap[partnerId].lastMessage = m;
        if (!isAdminSender && !m.read) partnerMap[partnerId].unread += 1;
      });
      const conversations = Object.values(partnerMap).sort((a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt));
      return NextResponse.json(conversations);
    }
  } catch (err) {
    console.error('Error fetching conversations:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}