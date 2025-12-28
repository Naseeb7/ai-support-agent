import { LLMService } from './llm.service';
import { Conversation } from '../db/models/conversation.model';
import { Message } from '../db/models/message.model';

export class ChatService {
  private readonly llmService: LLMService;
  private readonly conversationModel: typeof Conversation;
  private readonly messageModel: typeof Message;

  constructor() {
    this.llmService = new LLMService();
    this.conversationModel = Conversation;
    this.messageModel = Message;
  }

  async handleIncomingMessage(input: { message: string; sessionId?: string }): Promise<{ reply: string | null; sessionId: string; status: "success" | "error" }> {
    throw new Error("Not implemented");
  }
}