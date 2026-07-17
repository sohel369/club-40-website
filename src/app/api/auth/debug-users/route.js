import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import User from '@/lib/server/models/User';

export async function GET(req) {
  await connectDB();

  try {
    if (isUsingMockDb) {
      const usersInfo = mockDb.users.map(u => ({ email: u.email, role: u.role, name: u.name }));
      return NextResponse.json({ mode: 'mock', users: usersInfo });
    } else {
      const users = await User.find({}, 'email role name');
      return NextResponse.json({ mode: 'mongo', users });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
