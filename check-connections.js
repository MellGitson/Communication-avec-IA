import dotenv from 'dotenv';
import { checkMistral, listMistralModels } from './mistral.js';
import { checkGroq } from './groq.js';
import { checkHuggingFace } from './huggingface.js';
import { checkPinecone } from './pinecone.js';
import { displayResult, displaySummary } from './display.js';

// Charger les variables d'environnement depuis .env
dotenv.config();

// Verifier le flag --verbose
const verbose = process.argv.includes('--verbose');

console.log('\nVerification des connexions API...\n');

const apiKeys = {
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY
};

let allPresent = true;

Object.entries(apiKeys).forEach(([key, value]) => {
  const status = value ? 'presente' : 'manquante';
  console.log(`${key}: ${status}`);
  if (!value) allPresent = false;
});

console.log('\n' + (allPresent ? 'Toutes les cles API sont disponibles!' : 'Certaines cles API sont manquantes. Verifiez votre fichier .env'));
console.log('\n---\n');

// Tester les connexions API en parallele
console.log('Verification des connexions API...\n');

const results = await Promise.all([
  checkMistral(),
  checkGroq(),
  checkHuggingFace(),
  checkPinecone()
]);

results.forEach(result => {
  displayResult(result);
});

displaySummary(results);

// Mode verbose: afficher les modeles et tester les reponses
if (verbose) {
  await listMistralModels();
}


