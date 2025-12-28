export const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
export const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';
export const LLM_TIMEOUT_MS = parseInt(process.env.LLM_TIMEOUT_MS || '15000', 10);
export const LLM_MAX_TOKENS = parseInt(process.env.LLM_MAX_TOKENS || '1000', 10);

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined');
}