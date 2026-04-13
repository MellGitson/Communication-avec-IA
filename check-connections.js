import dotenv from 'dotenv';
import { checkMistral } from './mistral.js';
import { checkGroq } from './groq.js';
import { checkHuggingFace } from './huggingface.js';

// Charger les variables d'environnement depuis .env
dotenv.config();

console.log('\nVerification des connexions API...\n');

const apiKeys = {
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN
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
console.log('Test des connexions API...\n');

const results = await Promise.all([
  checkMistral(),
  checkGroq(),
  checkHuggingFace()
]);

results.forEach(result => {
  console.log(`${result.provider}: ${result.status} (latency: ${result.latency}ms${result.error ? `, error: ${result.error}` : ''})`);
});

console.log('\n');
