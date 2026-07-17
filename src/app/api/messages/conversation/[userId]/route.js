import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Message from '@/lib/server/models/Message';
import { protect } from '@/lib/server/middleware/authMiddleware';

const ADMIN_ID = 'admin-super';
const ADMIN_EMAIL = 'sohel0130844@gmail.com';
const ensureMockMessages = () => { if (!mockDb.messages) mockDb.messages = []; };
const getAdminId = (users) => { const admin = users.find(u => u.email === ADMIN_EMAIL); return admin ? (admin.id || admin._id?.toString()) : ADMIN_ID; };

export async function GET(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const meId = (authResult.user.id || authResult.user._id)?.toString();
  const otherId = params.userId;

  if (authResult.user.role !== 'super_admin' || authResult.user.email !== ADMIN_EMAIL) {
    if (otherId !== 'admin' && !otherId) return NextResponse.json({ message: 'Users can only message the admin' }, { status: 403 });
  }

  try {
    if (isUsingMockDb) {
      ensureMockMessages();
      const adminId = getAdminId(mockDb.users);
      const realOtherId = otherId === 'admin' ? adminId : otherId;
      const realMeId = meId === adminId ? adminId : meId;
      const thread = mockDb.messages.filter(m => (m.senderId === realMeId && m.recipientId === realOtherId) || (m.senderId === realOtherId && m.recipientId === realMeId)).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return NextResponse.json(thread);
    } else {
      const realOtherId = otherId;
      const thread = await Message.find({ $or: [{ senderId: meId, recipientId: realOtherId }, { senderId: realOtherId, recipientId: meId }] }).sort({ createdAt: 1 });
      return NextResponse.json(thread);
    }
  } catch (err) {
    console.error('Error fetching thread:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}