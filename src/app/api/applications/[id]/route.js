import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import VolunteerApplication from '@/lib/server/models/VolunteerApplication';
import { protect } from '@/lib/server/middleware/authMiddleware';

const SUPER_ADMIN_EMAIL = 'sohel0130844@gmail.com';

export async function DELETE(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  if (authResult.user.role !== 'super_admin' || authResult.user.email !== SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ message: 'Access denied. Super Admin only.' }, { status: 403 });
  }
  const { id } = params;
  try {
    if (isUsingMockDb) {
      if (!mockDb.applications) mockDb.applications = [];
      const idx = mockDb.applications.findIndex(a => a._id === id);
      if (idx === -1) return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
      mockDb.applications.splice(idx, 1);
      return NextResponse.json({ message: 'Application deleted.' });
    } else {
      const app = await VolunteerApplication.findByIdAndDelete(id);
      if (!app) return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
      return NextResponse.json({ message: 'Application deleted.' });
    }
  } catch (err) {
    console.error('Error deleting application:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}