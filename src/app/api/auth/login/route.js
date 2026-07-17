import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import User from '@/lib/server/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Please enter all fields' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isUsingMockDb) {
      const user = mockDb.users.find(u => u.email === normalizedEmail);
      if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
      }

      if (user.userPassword) {
        const isAdminMatch = await bcrypt.compare(password, user.password);
        const isUserMatch  = await bcrypt.compare(password, user.userPassword);

        if (!isAdminMatch && !isUserMatch) {
          return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
        }

        if (isAdminMatch) {
          return NextResponse.json({
            token: generateToken(user.id),
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              preferredLanguage: user.preferredLanguage,
              clubId: user.clubId,
              role: 'super_admin'
            }
          });
        }

        if (isUserMatch) {
          return NextResponse.json({
            token: generateToken(user.id + '-user'),
            user: {
              id: user.id + '-user',
              name: user.name,
              email: user.email,
              preferredLanguage: user.preferredLanguage,
              clubId: user.clubId,
              role: 'member'
            }
          });
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
      }

      return NextResponse.json({
        token: generateToken(user.id),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          clubId: user.clubId,
          role: user.role || 'member'
        }
      });
    } else {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
      }

      if (user.userPassword) {
        const isAdminMatch = await bcrypt.compare(password, user.password);
        const isUserMatch  = await bcrypt.compare(password, user.userPassword);

        if (!isAdminMatch && !isUserMatch) {
          return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
        }

        if (isAdminMatch) {
          return NextResponse.json({
            token: generateToken(user._id),
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              preferredLanguage: user.preferredLanguage,
              clubId: user.clubId,
              role: 'super_admin'
            }
          });
        }

        if (isUserMatch) {
          return NextResponse.json({
            token: generateToken(user._id.toString() + '-user'),
            user: {
              id: user._id.toString() + '-user',
              name: user.name,
              email: user.email,
              preferredLanguage: user.preferredLanguage,
              clubId: user.clubId,
              role: 'member'
            }
          });
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
      }

      return NextResponse.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          clubId: user.clubId,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
