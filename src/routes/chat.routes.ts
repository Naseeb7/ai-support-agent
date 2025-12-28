import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { ChatService } from '../services/chat.service';
import { Conversation } from '../db/models/conversation.model';
import { Message } from '../db/models/message.model';

const router = Router();
const chatService = new ChatService();

const chatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20 // limit each IP to 20 requests per windowMs
});

router.post('/message', chatRateLimiter, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const result = await chatService.handleIncomingMessage({ message, sessionId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  // Look up Conversation by sessionId
  const conversation = await Conversation.findById(sessionId).exec();

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  // Fetch messages for the conversation
  const messages = await Message.find({ conversationId: sessionId })
    .sort({ createdAt: 1 })
    .exec();

  // Format response
  const formattedMessages = messages.map(message => ({
    id: message._id.toString(),
    sender: message.sender,
    text: message.text,
    status: message.status,
    createdAt: message.createdAt.toISOString()
  }));

  res.status(200).json({
    sessionId,
    messages: formattedMessages
  });
});

export default router;