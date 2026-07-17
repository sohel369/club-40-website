import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'bn'],
    default: 'bn'
  },
  clubId: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'club_admin', 'super_admin'],
    default: 'member'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid OverwriteModelError if compile occurs multiple times
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
