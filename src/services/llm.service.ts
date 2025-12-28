import { LLM_MODEL, LLM_TIMEOUT_MS, LLM_MAX_TOKENS, OPENAI_API_KEY } from '../config';

export class LLMService {
  async generateReply(input: {
    systemPrompt: string;
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
    userMessage: string;
  }): Promise<{ text: string | null; success: boolean; errorCode?: string }> {
    try {
      // Build messages array in the required order
      const messages = [
        { role: 'system', content: input.systemPrompt },
        ...input.history,
        { role: 'user', content: input.userMessage }
      ];

      // Create the request body
      const requestBody = {
        model: LLM_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: LLM_MAX_TOKENS
      };

      // Create the request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return { text: null, success: false, errorCode: 'LLM_ERROR' };
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || null;

      if (!text) {
        return { text: null, success: false, errorCode: 'LLM_EMPTY_RESPONSE' };
      }

      return { text, success: true };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { text: null, success: false, errorCode: 'LLM_TIMEOUT' };
      }
      return { text: null, success: false, errorCode: 'LLM_ERROR' };
    }
  }
}