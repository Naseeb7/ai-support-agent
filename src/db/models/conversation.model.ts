import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  createdAt: { type: Date, required: true }
});

export const Conversation = mongoose.model('Conversation', conversationSchema);