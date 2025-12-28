import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  conversationId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Conversation' },
  sender: { type: String, enum: ['user', 'ai', 'system'], required: true },
  text: { type: String, required: false, default: null },
  status: { type: String, enum: ['success', 'error'], required: true },
  errorCode: String,
  createdAt: { type: Date, required: true }
});

export const Message = mongoose.model('Message', messageSchema);