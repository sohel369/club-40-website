import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  clubId: {
    type: Number,
    required: true
  },
  authorId: {
    type: String, // String type to support both MongoDB ObjectIds and MockDB simple string IDs
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;
