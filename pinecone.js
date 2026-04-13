/**
 * Ping Pinecone API
 * Teste la connexion a Pinecone avec un appel GET sur les indexes
 * @returns {Promise<{provider: string, status: string, latency: number, error?: string}>}
 */
async function checkPinecone() {
  const apiKey = process.env.PINECONE_API_KEY;
  const startTime = Date.now();
  const timeout = 10000; // 10 secondes

  // Verifier que la cle existe
  if (!apiKey) {
    return {
      provider: 'Pinecone',
      status: 'ERROR',
      latency: Date.now() - startTime,
      error: 'API key not found'
    };
  }

  try {
    // Creer un controleur d'abort pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch('https://api.pinecone.io/indexes', {
      method: 'GET',
      headers: {
        'Api-Key': apiKey,
        'X-Pinecone-API-Version': '2024-07',
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    if (response.ok) {
      return {
        provider: 'Pinecone',
        status: 'OK',
        latency
      };
    } else {
      let errorDetail = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorDetail += ` - ${errorData.error.message || JSON.stringify(errorData.error)}`;
        }
      } catch (e) {
        // Si on ne peut pas parser le JSON, on garde juste le status
      }
      return {
        provider: 'Pinecone',
        status: 'ERROR',
        latency,
        error: errorDetail
      };
    }
  } catch (err) {
    const latency = Date.now() - startTime;
    let errorMessage = 'Unknown error';

    if (err.name === 'AbortError') {
      errorMessage = `Timeout (${timeout}ms)`;
    } else if (err instanceof TypeError) {
      errorMessage = 'Network error';
    } else {
      errorMessage = err.message || 'Unknown error';
    }

    return {
      provider: 'Pinecone',
      status: 'ERROR',
      latency,
      error: errorMessage
    };
  }
}

export { checkPinecone };
