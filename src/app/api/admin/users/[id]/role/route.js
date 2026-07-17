import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import User from '@/lib/server/models/User';
import { protect } from '@/lib/server/middleware/authMiddleware';

const SUPER_ADMIN_EMAIL = 'sohel0130844@gmail.com';
const requireSuperAdmin = (authResult) => {
  return authResult?.user && authResult.user.role === 'super_admin' && authResult.user.email === SUPER_ADMIN_EMAIL;
};

export async function PUT(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  if (!requireSuperAdmin(authResult)) return NextResponse.json({ message: 'Access denied. Super Admin privileges required.' }, { status: 403 });

  const userId = params.id;
  try {
    const { role } = await req.json();
    if (!role || !['member', 'club_admin'].includes(role)) return NextResponse.json({ message: 'Invalid role. You can only assign member or club_admin.' }, { status: 400 });

    if (isUsingMockDb) {
      const user = mockDb.users.find(u => u.id === userId);
      if (!user) return NextResponse.json({ message: 'User not found in mock DB' }, { status: 404 });
      if (user.email === SUPER_ADMIN_EMAIL) return NextResponse.json({ message: 'Cannot change the Super Admin\'s own role.' }, { status: 403 });
      user.role = role;
      return NextResponse.json({ id: user.id, name: user.name, email: user.email, clubId: user.clubId, role: user.role });
    } else {
      const user = await User.findById(userId);
      if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
      if (user.email === SUPER_ADMIN_EMAIL) return NextResponse.json({ message: 'Cannot change the Super Admin\'s own role.' }, { status: 403 });
      user.role = role;
      await user.save();
      return NextResponse.json({ id: user._id, name: user.name, email: user.email, clubId: user.clubId, role: user.role });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error updating user role' }, { status: 500 });
  }
}