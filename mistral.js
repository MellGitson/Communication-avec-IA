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

/**
 * Lister les modeles Mistral disponibles
 * @returns {Promise<void>}
 */
async function listMistralModels() {
  const apiKey = process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    console.log('Mistral: API key not found');
    return;
  }

  try {
    const response = await fetch('https://api.mistral.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('\nModeles Mistral disponibles:');
      data.data.forEach(model => {
        console.log(`  - ${model.id}`);
      });
    } else {
      console.log(`Mistral: Erreur ${response.status}`);
    }
  } catch (err) {
    console.log(`Mistral: ${err.message}`);
  }
}

export { checkMistral, listMistralModels };

