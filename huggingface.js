import { checkProvider } from './providers.js';

/**
 * Ping HuggingFace API
 * Teste la connexion a l'API HuggingFace avec un prompt minimaliste
 * @returns {Promise<{provider: string, status: string, latency: number, error?: string}>}
 */
async function checkHuggingFace() {
  return checkProvider({
    name: 'HuggingFace',
    url: 'https://router.huggingface.co/v1/chat/completions',
    key: process.env.HUGGINGFACE_TOKEN,
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    format: 'openai'
  });
}

export { checkHuggingFace };
