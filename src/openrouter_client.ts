import { TypeSafeClient } from '@typesafe-ai/sdk';

export const client = new TypeSafeClient({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api',
});