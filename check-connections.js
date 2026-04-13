import dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env
dotenv.config();

console.log('\n🔍 Vérification des connexions API...\n');

const apiKeys = {
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  HP_API_KEY: process.env.HP_API_KEY
};

let allPresent = true;

Object.entries(apiKeys).forEach(([key, value]) => {
  const status = value ? '✅ présente' : '❌ manquante';
  console.log(`${key}: ${status}`);
  if (!value) allPresent = false;
});

console.log('\n' + (allPresent ? '✅ Toutes les clés API sont disponibles!' : '⚠️  Certaines clés API sont manquantes. Vérifiez votre fichier .env'));
console.log('\n');
