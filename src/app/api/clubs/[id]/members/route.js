import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import User from '@/lib/server/models/User';
import { protect } from '@/lib/server/middleware/authMiddleware';

export async function GET(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const clubId = parseInt(params.id, 10);
  try {
    if (isUsingMockDb) {
      const clubUsers = mockDb.users.filter(u => u.clubId === clubId);
      const admins = clubUsers.filter(u => u.role === 'club_admin').map(u => ({ id: u.id, name: u.name, email: u.email }));
      const members = clubUsers.filter(u => u.role === 'member').map(u => ({ id: u.id, name: u.name, email: u.email }));
      return NextResponse.json({ admins, members });
    } else {
      const clubUsers = await User.find({ clubId }).select('name email role');
      const admins = clubUsers.filter(u => u.role === 'club_admin').map(u => ({ id: u._id, name: u.name, email: u.email }));
      const members = clubUsers.filter(u => u.role === 'member').map(u => ({ id: u._id, name: u.name, email: u.email }));
      return NextResponse.json({ admins, members });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error fetching members' }, { status: 500 });
  }
}