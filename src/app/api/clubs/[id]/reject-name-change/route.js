import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Club from '@/lib/server/models/Club';
import { protect } from '@/lib/server/middleware/authMiddleware';

export async function POST(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const clubId = parseInt(params.id, 10);
  try {
    if (authResult.user.role !== 'super_admin') {
      return NextResponse.json({ message: 'Only Super Admins can reject club name changes!' }, { status: 403 });
    }

    if (isUsingMockDb) {
      const club = mockDb.clubs.find(c => c.id === clubId);
      if (!club) return NextResponse.json({ message: 'Club not found' }, { status: 404 });

      if (!club.nameChangeRequest || club.nameChangeRequest.status !== 'pending') {
        return NextResponse.json({ message: 'No pending name change request for this club!' }, { status: 400 });
      }

      club.nameChangeRequest = { requestedName: { en: '', bn: '' }, status: 'none', requestedBy: '', createdAt: null };
      return NextResponse.json(club);
    } else {
      const club = await Club.findOne({ id: clubId });
      if (!club) return NextResponse.json({ message: 'Club not found' }, { status: 404 });

      if (!club.nameChangeRequest || club.nameChangeRequest.status !== 'pending') {
        return NextResponse.json({ message: 'No pending name change request for this club!' }, { status: 400 });
      }

      club.nameChangeRequest = { requestedName: { en: '', bn: '' }, status: 'none', requestedBy: '', createdAt: null };
      await club.save();
      return NextResponse.json(club);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error rejecting name change' }, { status: 500 });
  }
}