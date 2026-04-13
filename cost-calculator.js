import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le repertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les prix depuis pricing.json
const pricingData = JSON.parse(fs.readFileSync(path.join(__dirname, 'pricing.json'), 'utf8'));

/**
 * Estime le nombre de tokens a partir d'un texte
 * Approximation : 1 token ≈ 4 caracteres
 * @param {string} text - Texte a analyser
 * @returns {number} Nombre estime de tokens
 */
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

/**
 * Estime et affiche les couts pour chaque provider
 * @param {string} text - Texte a analyser
 * @param {string} label - Label optionnel pour le texte
 */
function estimateCost(text, label = '') {
  const tokenCount = estimateTokens(text);
  const charCount = text.length;

  console.log('\nCalculateur de Couts\n');
  console.log(`Texte : ${charCount} caracteres → ${tokenCount} tokens\n`);

  // Preparer les donnees pour le tableau
  const data = pricingData.providers.map(provider => {
    const costPerToken = provider.pricePerMillion / 1_000_000;
    const costInput = costPerToken * tokenCount;
    const costFor1000 = costInput * 1000;

    return {
      'Provider': provider.name,
      'Cout estime (input)': `${costInput.toFixed(8)}€`,
      'Pour 1000 requetes': `${costFor1000.toFixed(5)}€`
    };
  });

  // Afficher le tableau
  console.table(data);
}

// Texte de test (240 caracteres exactement)
const testText = 'Quelle est la capitale de la France ? Paris est la reponse. Elle est connue pour la Tour Eiffel et le Louvre. Paris est le centre politique et economique du pays. C\'est une destination touristique majeure mondiale. Elle possede une riche histoire et une culture unique.';

estimateCost(testText);
