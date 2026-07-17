import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import VolunteerApplication from '@/lib/server/models/VolunteerApplication';
import { protect } from '@/lib/server/middleware/authMiddleware';

const ALLOWED_FIELDS = ['teaching', 'eco', 'disaster', 'blood', 'general'];
const SUPER_ADMIN_EMAIL = 'sohel0130844@gmail.com';

const notifyAdmin = async (appData) => {
  if (isUsingMockDb) {
    if (!mockDb.messages) mockDb.messages = [];
    const admin = mockDb.users?.find(u => u.email === 'sohel0130844@gmail.com');
    const adminId = admin ? (admin.id || admin._id?.toString()) : 'admin-super';
    mockDb.messages.unshift({
      _id: `msg-app-${Date.now()}`, senderId: 'system-applicant', senderName: appData.fullName,
      recipientId: adminId, recipientName: admin?.name || 'Super Admin',
      content: `📋 নতুন স্বেচ্ছাসেবী আবেদন!\nনাম: ${appData.fullName}\nইমেইল: ${appData.email}\nমোবাইল: ${appData.mobile}\nক্ষেত্র: ${appData.field}\nকারণ: ${appData.whyJoin}`,
      read: false, createdAt: new Date(), updatedAt: new Date(),
    });
  } else {
    try {
      const Message = (await import('@/lib/server/models/Message')).default;
      const User = (await import('@/lib/server/models/User')).default;
      const admin = await User.findOne({ email: 'sohel0130844@gmail.com' });
      if (admin) {
        await Message.create({
          senderId: appData._id.toString(), senderName: appData.fullName,
          recipientId: admin._id.toString(), recipientName: admin.name,
          content: `📋 নতুন স্বেচ্ছাসেবী আবেদন!\nনাম: ${appData.fullName}\nইমেইল: ${appData.email}\nমোবাইল: ${appData.mobile}\nক্ষেত্র: ${appData.field}\nকারণ: ${appData.whyJoin}`
        });
      }
    } catch (msgErr) { console.error('Non-fatal: could not send admin notification message:', msgErr); }
  }
};

export async function POST(req) {
  await connectDB();
  try {
    const { fullName, email, mobile, field, whyJoin } = await req.json();
    if (!fullName || !email || !mobile || !field || !whyJoin) return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    if (!ALLOWED_FIELDS.includes(field)) return NextResponse.json({ message: 'Invalid field of work selected.' }, { status: 400 });

    if (isUsingMockDb) {
      if (!mockDb.applications) mockDb.applications = [];
      const newApp = { _id: `app-${Date.now()}`, fullName, email, mobile, field, whyJoin, status: 'pending', createdAt: new Date() };
      mockDb.applications.unshift(newApp);
      await notifyAdmin(newApp);
      return NextResponse.json({ message: 'Application submitted successfully!', application: newApp }, { status: 201 });
    } else {
      const newApp = await VolunteerApplication.create({ fullName, email, mobile, field, whyJoin });
      await notifyAdmin(newApp);
      return NextResponse.json({ message: 'Application submitted successfully!', application: newApp }, { status: 201 });
    }
  } catch (err) {
    console.error('Error saving application:', err);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  if (authResult.user.role !== 'super_admin' || authResult.user.email !== SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ message: 'Access denied. Super Admin only.' }, { status: 403 });
  }
  try {
    if (isUsingMockDb) {
      if (!mockDb.applications) mockDb.applications = [];
      return NextResponse.json(mockDb.applications);
    } else {
      const apps = await VolunteerApplication.find().sort({ createdAt: -1 });
      return NextResponse.json(apps);
    }
  } catch (err) {
    console.error('Error fetching applications:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}