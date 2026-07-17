import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Message from '@/lib/server/models/Message';
import { protect } from '@/lib/server/middleware/authMiddleware';

export async function GET(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const clubId = parseInt(params.id, 10);
  try {
    if (isUsingMockDb) {
      if (!mockDb.messages) mockDb.messages = [];
      const msgs = mockDb.messages.filter(m => m.clubId === clubId).sort((a, b) => a.createdAt - b.createdAt);
      return NextResponse.json(msgs);
    } else {
      const msgs = await Message.find({ clubId }).sort({ createdAt: 1 });
      return NextResponse.json(msgs);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error fetching chat messages' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const clubId = parseInt(params.id, 10);
  try {
    const { content } = await req.json();
    if (!content) return NextResponse.json({ message: 'Message content is required' }, { status: 400 });

    if (authResult.user.role !== 'super_admin' && authResult.user.clubId !== clubId) {
      return NextResponse.json({ message: 'You can only message in your own club chat room!' }, { status: 403 });
    }

    if (isUsingMockDb) {
      if (!mockDb.messages) mockDb.messages = [];
      const newMsg = {
        id: (mockDb.messages.length + 1).toString(),
        content,
        clubId,
        senderId: authResult.user.id || authResult.user._id,
        senderName: authResult.user.name,
        createdAt: new Date()
      };
      mockDb.messages.push(newMsg);
      return NextResponse.json(newMsg, { status: 201 });
    } else {
      const msg = await Message.create({
        content,
        clubId,
        senderId: authResult.user.id || authResult.user._id,
        senderName: authResult.user.name
      });
      return NextResponse.json(msg, { status: 201 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error posting message' }, { status: 500 });
  }
}