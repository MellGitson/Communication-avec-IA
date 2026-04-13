/**
 * Fonction générique pour tester la connexion à un provider d'API
 * @param {Object} config - Configuration du provider
 * @param {string} config.name - Nom du provider (Mistral, Groq, HuggingFace)
 * @param {string} config.url - URL complète de l'endpoint API
 * @param {string} config.key - Clé API
 * @param {string} config.model - Modèle à utiliser
 * @param {string} config.format - Format du body ('openai' ou 'huggingface')
 * @returns {Promise<{provider: string, status: string, latency: number, error?: string}>}
 */
async function checkProvider(config) {
  const { name, url, key, model, format } = config;
  const startTime = Date.now();
  const timeout = 10000; // 10 secondes
  const testPrompt = 'Quelle est la capitale de la France ?';

  // Verifier que la cle existe
  if (!key) {
    return {
      provider: name,
      status: 'ERROR',
      latency: Date.now() - startTime,
      error: 'API key not found'
    };
  }

  try {
    // Creer un controleur d'abort pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Preparer le body selon le format
    let body;
    let headers = {
      'Content-Type': 'application/json'
    };

    if (format === 'openai') {
      // Format OpenAI (Mistral, Groq, HuggingFace)
      body = JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: testPrompt }],
        max_tokens: 50
      });
      headers['Authorization'] = `Bearer ${key}`;
    } else if (format === 'huggingface') {
      // Format HuggingFace
      body = JSON.stringify({
        inputs: testPrompt
      });
      headers['Authorization'] = `Bearer ${key}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json();
      let responseText = '';

      // Extraire la reponse selon le format
      if (format === 'openai') {
        if (data.choices && data.choices[0] && data.choices[0].message) {
          responseText = data.choices[0].message.content.trim();
          // Extraire juste le premier mot ou phrase cle
          if (responseText.toLowerCase().includes('paris')) {
            responseText = 'Paris';
          } else {
            // Prendre juste les premiers 20 caracteres
            responseText = responseText.substring(0, 20);
          }
        }
      } else if (format === 'huggingface') {
        if (Array.isArray(data) && data[0] && data[0][0] && data[0][0].generated_text) {
          responseText = data[0][0].generated_text.trim();
          responseText = responseText.substring(0, 20);
        }
      }

      return {
        provider: name,
        status: 'OK',
        latency,
        response: responseText
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
        provider: name,
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
      provider: name,
      status: 'ERROR',
      latency,
      error: errorMessage
    };
  }
}

export { checkProvider };
