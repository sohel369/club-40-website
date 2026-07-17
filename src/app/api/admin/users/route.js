import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import User from '@/lib/server/models/User';
import { protect } from '@/lib/server/middleware/authMiddleware';
import bcrypt from 'bcryptjs';

const SUPER_ADMIN_EMAIL = 'sohel0130844@gmail.com';

const requireSuperAdmin = (authResult) => {
  if (authResult?.user && authResult.user.role === 'super_admin' && authResult.user.email === SUPER_ADMIN_EMAIL) return true;
  return false;
};

export async function GET(req) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  if (!requireSuperAdmin(authResult)) return NextResponse.json({ message: 'Access denied. Super Admin privileges required.' }, { status: 403 });

  try {
    if (isUsingMockDb) {
      const usersFiltered = mockDb.users.map(u => ({ id: u.id, name: u.name, email: u.email, clubId: u.clubId, role: u.role || 'member', createdAt: u.createdAt }));
      return NextResponse.json(usersFiltered);
    } else {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error retrieving users' }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  if (!requireSuperAdmin(authResult)) return NextResponse.json({ message: 'Access denied. Super Admin privileges required.' }, { status: 403 });

  try {
    const { name, email, password, clubId, role } = await req.json();
    if (!name || !email || !password || !clubId) return NextResponse.json({ message: 'Name, email, password and club are required.' }, { status: 400 });

    const allowedRoles = ['member', 'club_admin'];
    const assignedRole = allowedRoles.includes(role) ? role : 'member';
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    if (isUsingMockDb) {
      const exists = mockDb.users.find(u => u.email === email);
      if (exists) return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 400 });

      const newUser = { id: `user-${Date.now()}`, name, email, password: hashed, preferredLanguage: 'bn', clubId: parseInt(clubId, 10), role: assignedRole, createdAt: new Date() };
      mockDb.users.push(newUser);
      return NextResponse.json({ id: newUser.id, name: newUser.name, email: newUser.email, clubId: newUser.clubId, role: newUser.role, createdAt: newUser.createdAt }, { status: 201 });
    } else {
      const exists = await User.findOne({ email });
      if (exists) return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 400 });

      const newUser = await User.create({ name, email, password: hashed, clubId: parseInt(clubId, 10), role: assignedRole });
      return NextResponse.json({ id: newUser._id, name: newUser.name, email: newUser.email, clubId: newUser.clubId, role: newUser.role, createdAt: newUser.createdAt }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error creating user.' }, { status: 500 });
  }
}