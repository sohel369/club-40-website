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

  const userId = (authResult.user.id || authResult.user._id)?.toString();
  try {
    if (isUsingMockDb) {
      ensureMockMessages();
      const adminId = getAdminId(mockDb.users);
      const unread = mockDb.messages.filter(m => m.recipientId === userId && m.senderId === adminId && !m.read).length;
      return NextResponse.json({ unread });
    } else {
      const User = (await import('@/lib/server/models/User')).default;
      const admin = await User.findOne({ role: 'super_admin' });
      const adminId = admin?._id?.toString();
      const unread = adminId ? await Message.countDocuments({ recipientId: userId, senderId: adminId, read: false }) : 0;
      return NextResponse.json({ unread });
    }
  } catch (err) {
    console.error('Error fetching inbox:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}