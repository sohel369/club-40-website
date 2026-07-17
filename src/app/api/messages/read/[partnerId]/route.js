import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Message from '@/lib/server/models/Message';
import { protect } from '@/lib/server/middleware/authMiddleware';

const ADMIN_ID = 'admin-super';
const ADMIN_EMAIL = 'sohel0130844@gmail.com';
const ensureMockMessages = () => { if (!mockDb.messages) mockDb.messages = []; };
const getAdminId = (users) => { const admin = users.find(u => u.email === ADMIN_EMAIL); return admin ? (admin.id || admin._id?.toString()) : ADMIN_ID; };

export async function PATCH(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const meId = (authResult.user.id || authResult.user._id)?.toString();
  const partnerId = params.partnerId;

  try {
    if (isUsingMockDb) {
      ensureMockMessages();
      const adminId = getAdminId(mockDb.users);
      const realPartnerId = partnerId === 'admin' ? adminId : partnerId;
      mockDb.messages.forEach(m => { if (m.senderId === realPartnerId && m.recipientId === meId) m.read = true; });
      return NextResponse.json({ message: 'Marked as read.' });
    } else {
      const realPartnerId = partnerId;
      await Message.updateMany({ senderId: realPartnerId, recipientId: meId, read: false }, { read: true });
      return NextResponse.json({ message: 'Marked as read.' });
    }
  } catch (err) {
    console.error('Error marking read:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}