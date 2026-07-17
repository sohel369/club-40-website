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
    const { name, email, password, clubId } = body;

    if (!name || !email || !password || !clubId) {
      return NextResponse.json({ message: 'Please enter all fields' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isUsingMockDb) {
      const userExists = mockDb.users.find(u => u.email === normalizedEmail);
      if (userExists) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: (mockDb.users.length + 1).toString(),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        preferredLanguage: 'bn',
        clubId: parseInt(clubId, 10),
        role: 'member',
        createdAt: new Date()
      };

      mockDb.users.push(newUser);

      return NextResponse.json({
        token: generateToken(newUser.id),
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          preferredLanguage: newUser.preferredLanguage,
          clubId: newUser.clubId,
          role: newUser.role
        }
      }, { status: 201 });
    } else {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        clubId: parseInt(clubId, 10)
      });

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
      }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
