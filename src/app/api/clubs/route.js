import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Club from '@/lib/server/models/Club';

export async function GET() {
  await connectDB();
  try {
    if (isUsingMockDb) {
      return NextResponse.json(mockDb.clubs);
    } else {
      const clubs = await Club.find().sort({ id: 1 });
      return NextResponse.json(clubs);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error fetching clubs' }, { status: 500 });
  }
}