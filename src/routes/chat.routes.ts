import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { ChatService } from '../services/chat.service';

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

export default router;