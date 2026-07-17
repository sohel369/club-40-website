import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Club from '@/lib/server/models/Club';
import { protect } from '@/lib/server/middleware/authMiddleware';

export async function GET(req, { params }) {
  await connectDB();
  const clubId = parseInt(params.id, 10);
  try {
    if (isUsingMockDb) {
      const club = mockDb.clubs.find(c => c.id === clubId);
      if (!club) return NextResponse.json({ message: 'Club not found' }, { status: 404 });
      return NextResponse.json(club);
    } else {
      const club = await Club.findOne({ id: clubId });
      if (!club) return NextResponse.json({ message: 'Club not found' }, { status: 404 });
      return NextResponse.json(club);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error fetching club details' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const clubId = parseInt(params.id, 10);
  try {
    if (authResult.user.role !== 'super_admin') {
      return NextResponse.json({ message: 'Only Super Admins can manage club information!' }, { status: 403 });
    }

    const { category, shortDescription, longDescription, location, email, phone } = await req.json();

    if (isUsingMockDb) {
      const club = mockDb.clubs.find(c => c.id === clubId);
      if (!club) return NextResponse.json({ message: 'Club not found' }, { status: 404 });
      
      if (category) club.category = category;
      if (shortDescription) club.shortDescription = typeof shortDescription === 'object' ? shortDescription : { bn: shortDescription, en: shortDescription };
      if (longDescription) club.longDescription = typeof longDescription === 'object' ? longDescription : { bn: longDescription, en: longDescription };
      if (location) club.location = typeof location === 'object' ? location : { bn: location, en: location };
      if (email) club.email = email;
      if (phone) club.phone = typeof phone === 'object' ? phone : { bn: phone, en: phone };

      return NextResponse.json(club);
    } else {
      const club = await Club.findOne({ id: clubId });
      if (!club) return NextResponse.json({ message: 'Club not found' }, { status: 404 });

      if (category) club.category = category;
      if (shortDescription) club.shortDescription = typeof shortDescription === 'object' ? shortDescription : { bn: shortDescription, en: shortDescription };
      if (longDescription) club.longDescription = typeof longDescription === 'object' ? longDescription : { bn: longDescription, en: longDescription };
      if (location) club.location = typeof location === 'object' ? location : { bn: location, en: location };
      if (email) club.email = email;
      if (phone) club.phone = typeof phone === 'object' ? phone : { bn: phone, en: phone };

      await club.save();
      return NextResponse.json(club);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error updating club details' }, { status: 500 });
  }
}