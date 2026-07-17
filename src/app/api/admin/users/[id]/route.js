import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import User from '@/lib/server/models/User';
import { protect } from '@/lib/server/middleware/authMiddleware';

const SUPER_ADMIN_EMAIL = 'sohel0130844@gmail.com';
const requireSuperAdmin = (authResult) => {
  return authResult?.user && authResult.user.role === 'super_admin' && authResult.user.email === SUPER_ADMIN_EMAIL;
};

export async function DELETE(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  if (!requireSuperAdmin(authResult)) return NextResponse.json({ message: 'Access denied. Super Admin privileges required.' }, { status: 403 });

  const userId = params.id;
  try {
    if (isUsingMockDb) {
      const userIdx = mockDb.users.findIndex(u => u.id === userId);
      if (userIdx === -1) return NextResponse.json({ message: 'User not found in mock DB' }, { status: 404 });
      mockDb.users.splice(userIdx, 1);
      return NextResponse.json({ message: 'User account deleted successfully' });
    } else {
      const user = await User.findById(userId);
      if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
      await User.deleteOne({ _id: userId });
      return NextResponse.json({ message: 'User account deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error deleting user account' }, { status: 500 });
  }
}