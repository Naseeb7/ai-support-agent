export type ChatRequest = {
  message: string;
  sessionId?: string;
};

export type ChatResponse = {
  reply: string | null;
  sessionId: string;
  status: "success" | "error";
};