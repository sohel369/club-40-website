import mongoose from 'mongoose';

const volunteerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    mobile:   { type: String, required: true, trim: true },
    field:    {
      type: String,
      required: true,
      enum: ['teaching', 'eco', 'disaster', 'blood', 'general'],
    },
    whyJoin:  { type: String, required: true, trim: true },
    status:   { type: String, default: 'pending', enum: ['pending', 'reviewed', 'accepted', 'rejected'] },
  },
  { timestamps: true }
);

const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema);

export default VolunteerApplication;
