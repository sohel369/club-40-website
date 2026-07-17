import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import VolunteerApplication from '@/lib/server/models/VolunteerApplication';
import { protect } from '@/lib/server/middleware/authMiddleware';

const SUPER_ADMIN_EMAIL = 'sohel0130844@gmail.com';

export async function PATCH(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  if (authResult.user.role !== 'super_admin' || authResult.user.email !== SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ message: 'Access denied. Super Admin only.' }, { status: 403 });
  }
  const { id } = params;
  try {
    const { status } = await req.json();
    const VALID_STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!VALID_STATUSES.includes(status)) return NextResponse.json({ message: 'Invalid status.' }, { status: 400 });

    if (isUsingMockDb) {
      if (!mockDb.applications) mockDb.applications = [];
      const app = mockDb.applications.find(a => a._id === id);
      if (!app) return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
      app.status = status;
      return NextResponse.json(app);
    } else {
      const app = await VolunteerApplication.findByIdAndUpdate(id, { status }, { new: true });
      if (!app) return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
      return NextResponse.json(app);
    }
  } catch (err) {
    console.error('Error updating status:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}