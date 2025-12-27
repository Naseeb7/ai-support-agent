import { Router } from 'express';
import { ChatService } from '../services/chat.service';

const router = Router();
const chatService = new ChatService();

router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const result = await chatService.handleIncomingMessage({ message, sessionId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;