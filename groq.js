import { checkProvider } from './providers.js';

/**
 * Ping Groq API
 * Teste la connexion a l'API Groq avec un prompt minimaliste
 * @returns {Promise<{provider: string, status: string, latency: number, error?: string}>}
 */
async function checkGroq() {
  return checkProvider({
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    key: process.env.GROQ_API_KEY,
    model: 'llama-3.1-8b-instant',
    format: 'openai'
  });
}

export { checkGroq };
