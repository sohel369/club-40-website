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
    if (authResult.user.role !== 'club_admin' || authResult.user.clubId !== clubId) {
      return NextResponse.json({ message: 'Only the Club Admin of this club can request a name change!' }, { status: 403 });
    }

    const { requestedName } = await req.json();
    if (!requestedName || !requestedName.en || !requestedName.bn) {
      return NextResponse.json({ message: 'Requested name in English and Bangla is required' }, { status: 400 });
    }

    if (isUsingMockDb) {
      const club = mockDb.clubs.find(c => c.id === clubId);
      if (!club) return NextResponse.json({ message: 'Club not found' }, { status: 404 });

      club.nameChangeRequest = {
        requestedName: { en: requestedName.en.trim(), bn: requestedName.bn.trim() },
        status: 'pending',
        requestedBy: authResult.user.id || authResult.user._id,
        createdAt: new Date()
      };
      return NextResponse.json(club);
    } else {
      const club = await Club.findOne({ id: clubId });
      if (!club) return NextResponse.json({ message: 'Club not found' }, { status: 404 });

      club.nameChangeRequest = {
        requestedName: { en: requestedName.en.trim(), bn: requestedName.bn.trim() },
        status: 'pending',
        requestedBy: authResult.user.id || authResult.user._id,
        createdAt: new Date()
      };
      await club.save();
      return NextResponse.json(club);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error requesting name change' }, { status: 500 });
  }
}