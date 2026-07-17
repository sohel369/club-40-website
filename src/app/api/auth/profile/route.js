import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import User from '@/lib/server/models/User';
import { protect } from '@/lib/server/middleware/authMiddleware';

export async function GET(req) {
  await connectDB();

  const authResult = await protect(req);
  if (authResult?.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  return NextResponse.json(authResult.user);
}

export async function PUT(req) {
  await connectDB();

  const authResult = await protect(req);
  if (authResult?.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  const { name, preferredLanguage } = await req.json();

  try {
    if (isUsingMockDb) {
      const baseId = authResult.user.id.endsWith('-user') ? authResult.user.id.slice(0, -5) : authResult.user.id;
      const user = mockDb.users.find(u => u.id === baseId);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      if (name) user.name = name;
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;

      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        clubId: user.clubId,
        role: user.role || 'member'
      });
    } else {
      const user = await User.findById(authResult.user.id || authResult.user._id);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      if (name) user.name = name;
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;

      await user.save();

      return NextResponse.json({
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
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
