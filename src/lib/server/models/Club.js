import mongoose from 'mongoose';

const MultilingualStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
}, { _id: false });

const ClubSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: MultilingualStringSchema,
  category: {
    type: String,
    required: true
  },
  categoryName: MultilingualStringSchema,
  shortDescription: MultilingualStringSchema,
  longDescription: MultilingualStringSchema,
  image: {
    type: String,
    required: true
  },
  fallbackImage: {
    type: String,
    required: true
  },
  established: MultilingualStringSchema,
  members: MultilingualStringSchema,
  impact: MultilingualStringSchema,
  location: MultilingualStringSchema,
  email: {
    type: String,
    required: true
  },
  phone: MultilingualStringSchema,
  nameChangeRequest: {
    requestedName: {
      en: { type: String },
      bn: { type: String }
    },
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    requestedBy: { type: String },
    createdAt: { type: Date }
  }
});

const Club = mongoose.models.Club || mongoose.model('Club', ClubSchema);
export default Club;
