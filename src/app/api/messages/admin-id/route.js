import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import { protect } from '@/lib/server/middleware/authMiddleware';

const ADMIN_ID = 'admin-super';
const ADMIN_EMAIL = 'sohel0130844@gmail.com';
const getAdminId = (users) => { const admin = users.find(u => u.email === ADMIN_EMAIL); return admin ? (admin.id || admin._id?.toString()) : ADMIN_ID; };

export async function GET(req) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  try {
    if (isUsingMockDb) {
      const adminId = getAdminId(mockDb.users);
      return NextResponse.json({ adminId });
    } else {
      const User = (await import('@/lib/server/models/User')).default;
      const admin = await User.findOne({ email: ADMIN_EMAIL });
      return NextResponse.json({ adminId: admin?._id?.toString() || null });
    }
  } catch (err) {
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}