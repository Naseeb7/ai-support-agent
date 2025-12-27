export class ChatService {
  async handleIncomingMessage(input: { message: string; sessionId?: string }): Promise<{ reply: string | null; sessionId: string; status: "success" | "error" }> {
    throw new Error("Not implemented");
  }
}