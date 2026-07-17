import { NextResponse } from 'next/server';
import { connectDB, isUsingMockDb, mockDb } from '@/lib/server/db';
import Post from '@/lib/server/models/Post';
import { protect } from '@/lib/server/middleware/authMiddleware';

export async function PUT(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const { postId } = params;
  try {
    const { title, content } = await req.json();
    if (!title || !content) return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });

    if (isUsingMockDb) {
      const post = mockDb.posts.find(p => (p.id || p._id) === postId);
      if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

      const authorId = post.authorId?.toString().replace('-user', '');
      const userId = authResult.user.id?.toString().replace('-user', '');
      if (authResult.user.role !== 'super_admin' && authorId !== userId) {
        return NextResponse.json({ message: 'Not authorized to edit this post' }, { status: 403 });
      }

      post.title = title.trim();
      post.content = content.trim();
      post.updatedAt = new Date();
      return NextResponse.json(post);
    } else {
      const post = await Post.findById(postId);
      if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

      if (authResult.user.role !== 'super_admin' && post.authorId.toString() !== authResult.user.id?.toString()) {
        return NextResponse.json({ message: 'Not authorized to edit this post' }, { status: 403 });
      }

      post.title = title.trim();
      post.content = content.trim();
      post.updatedAt = new Date();
      await post.save();
      return NextResponse.json(post);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error updating post' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const authResult = await protect(req);
  if (authResult?.error) return NextResponse.json({ message: authResult.error }, { status: authResult.status });

  const { postId } = params;
  try {
    if (isUsingMockDb) {
      const idx = mockDb.posts.findIndex(p => (p.id || p._id) === postId);
      if (idx === -1) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

      const post = mockDb.posts[idx];
      const authorId = post.authorId?.toString().replace('-user', '');
      const userId = authResult.user.id?.toString().replace('-user', '');
      if (authResult.user.role !== 'super_admin' && authorId !== userId) {
        return NextResponse.json({ message: 'Not authorized to delete this post' }, { status: 403 });
      }

      mockDb.posts.splice(idx, 1);
      return NextResponse.json({ message: 'Post deleted successfully' });
    } else {
      const post = await Post.findById(postId);
      if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

      if (authResult.user.role !== 'super_admin' && post.authorId.toString() !== authResult.user.id?.toString()) {
        return NextResponse.json({ message: 'Not authorized to delete this post' }, { status: 403 });
      }

      await Post.deleteOne({ _id: postId });
      return NextResponse.json({ message: 'Post deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error deleting post' }, { status: 500 });
  }
}