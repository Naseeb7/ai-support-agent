import { LLMService } from './llm.service';
import { Conversation } from '../db/models/conversation.model';
import { Message } from '../db/models/message.model';
import { STORE_INFO } from '../domain/storeInfo';
import { MAX_HISTORY_MESSAGES } from '../config';

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

    // Persist the user message
    await this.messageModel.create({
      conversationId: conversation._id,
      sender: "user",
      text: input.message,
      status: "success",
      createdAt: new Date()
    });

    // Fetch recent messages for the conversation
    const recentMessages = await this.messageModel
      .find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(MAX_HISTORY_MESSAGES)
      .exec();

    // Map messages to LLM history format
    const history = recentMessages
      .filter(message => message.sender === 'user' || message.sender === 'ai')
      .map(message => ({
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.text
      }));

    // Build systemPrompt string using domain data
    const systemPrompt = `You are a helpful support agent for ${STORE_INFO.name}.

Support Hours: ${STORE_INFO.supportHours}
Shipping Policy: ${STORE_INFO.shippingPolicy}
Return Policy: ${STORE_INFO.returnPolicy}

Please provide helpful and accurate responses to customer inquiries based on this information.`;

    // Call llmService.generateReply with systemPrompt, history, and userMessage
    const llmResult = await this.llmService.generateReply({
      systemPrompt,
      history,
      userMessage: input.message
    });

    // Persist the AI message
    let aiText = "";
    let aiStatus = "error";
    let errorCode;

    if (llmResult.success) {
      aiText = llmResult.text || "";
      aiStatus = "success";
    } else {
      errorCode = llmResult.errorCode;
    }

    await this.messageModel.create({
      conversationId: conversation._id,
      sender: "ai",
      text: aiText,
      status: aiStatus,
      errorCode,
      createdAt: new Date()
    });

    // Return the AI text or null, sessionId, and success status
    return { reply: llmResult.text, sessionId, status: "success" };
  }
}