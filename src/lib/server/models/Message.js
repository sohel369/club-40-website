import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId:       { type: String, required: true },
    senderName:     { type: String, required: true },
    recipientId:    { type: String, required: true },
    recipientName:  { type: String, required: true },
    content:        { type: String, required: true, trim: true },
    read:           { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
