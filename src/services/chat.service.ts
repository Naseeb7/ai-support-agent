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
    let conversation;
    let sessionId = input.sessionId;

    if (input.sessionId) {
      // Attempt to find the Conversation by ID
      conversation = await this.conversationModel.findById(input.sessionId).exec();

      if (!conversation) {
        // If not found, return error object
        return { reply: null, sessionId: input.sessionId, status: "error" };
      }
    } else {
      // Create a new Conversation with createdAt = new Date()
      conversation = new this.conversationModel({
        createdAt: new Date()
      });
      await conversation.save();
      sessionId = conversation._id.toString();
    }

    // Return temporary success response
    return { reply: null, sessionId, status: "success" };
  }
}