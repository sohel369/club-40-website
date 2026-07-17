import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Message from '@/lib/server/models/Message';
import { protect } from '@/lib/server/middleware/authMiddleware';

const ensureMockMessages = () => { if (!mockDb.messages) mockDb.messages = []; };

export async function POST(req) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  try {
    const { recipientId, content } = await req.json();
    const senderId = (authResult.user.id || authResult.user._id)?.toString();
    const senderName = authResult.user.name;

    if (!recipientId || !content?.trim()) return NextResponse.json({ message: 'recipientId and content are required.' }, { status: 400 });

    if (isUsingMockDb) {
      ensureMockMessages();
      const recipient = mockDb.users.find(u => (u.id || u._id?.toString()) === recipientId);
      if (!recipient) return NextResponse.json({ message: 'Recipient not found.' }, { status: 404 });

      const msg = {
        _id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        senderId, senderName, recipientId, recipientName: recipient.name,
        content: content.trim(), read: false, createdAt: new Date(), updatedAt: new Date(),
      };
      mockDb.messages.push(msg);
      return NextResponse.json(msg, { status: 201 });
    } else {
      const User = (await import('@/lib/server/models/User')).default;
      const recipient = await User.findById(recipientId);
      if (!recipient) return NextResponse.json({ message: 'Recipient not found.' }, { status: 404 });

      const msg = await Message.create({ senderId, senderName, recipientId, recipientName: recipient.name, content: content.trim() });
      return NextResponse.json(msg, { status: 201 });
    }
  } catch (err) {
    console.error('Error sending message:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}