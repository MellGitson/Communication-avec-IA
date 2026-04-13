import { checkProvider } from './providers.js';

/**
 * Ping Mistral API
 * Teste la connexion a l'API Mistral avec un prompt minimaliste
 * @returns {Promise<{provider: string, status: string, latency: number, error?: string}>}
 */
async function checkMistral() {
  return checkProvider({
    name: 'Mistral',
    url: 'https://api.mistral.ai/v1/chat/completions',
    key: process.env.MISTRAL_API_KEY,
    model: 'mistral-tiny',
    format: 'openai'
  });
}

export { checkMistral };
