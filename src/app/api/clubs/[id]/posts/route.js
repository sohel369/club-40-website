import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Post from '@/lib/server/models/Post';
import { protect } from '@/lib/server/middleware/authMiddleware';

export async function GET(req, { params }) {
  await connectDB();
  const clubId = parseInt(params.id, 10);
  try {
    if (isUsingMockDb) {
      const posts = mockDb.posts.filter(p => p.clubId === clubId).sort((a, b) => b.createdAt - a.createdAt);
      return NextResponse.json(posts);
    } else {
      const posts = await Post.find({ clubId }).sort({ createdAt: -1 });
      return NextResponse.json(posts);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error fetching club posts' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const clubId = parseInt(params.id, 10);
  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ message: 'Please provide a title and content for the post' }, { status: 400 });
    }

    if (authResult.user.clubId !== clubId) {
      return NextResponse.json({ message: 'You can only post updates to your registered club!' }, { status: 403 });
    }

    if (isUsingMockDb) {
      const newPost = {
        id: (mockDb.posts.length + 1).toString(),
        title,
        content,
        clubId,
        authorId: authResult.user.id || authResult.user._id,
        authorName: authResult.user.name,
        createdAt: new Date()
      };
      mockDb.posts.push(newPost);
      return NextResponse.json(newPost, { status: 201 });
    } else {
      const post = await Post.create({
        title,
        content,
        clubId,
        authorId: authResult.user.id || authResult.user._id,
        authorName: authResult.user.name
      });
      return NextResponse.json(post, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error creating post' }, { status: 500 });
  }
}