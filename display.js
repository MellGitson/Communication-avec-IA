/**
 * Formate et affiche le resultat d'un test de connexion API
 * @param {Object} result - Result du test
 * @param {string} result.provider - Nom du provider
 * @param {string} result.status - 'OK' ou 'ERROR'
 * @param {number} result.latency - Latence en ms
 * @param {string} result.response - Reponse du modele (optionnel)
 * @param {string} result.error - Message d'erreur (optionnel)
 */
function displayResult(result) {
  const status = result.status === 'OK' ? '[OK]  ' : '[ERR] ';
  const padding = ' '.repeat(Math.max(0, 20 - result.provider.length));
  
  if (result.status === 'OK') {
    if (result.response) {
      console.log(`${status} ${result.provider}${padding}${result.latency}ms -> "${result.response}"`);
    } else {
      console.log(`${status} ${result.provider}${padding}${result.latency}ms`);
    }
  } else {
    console.log(`${status} ${result.provider}${padding}${result.error}`);
  }
}

/**
 * Affiche un resume des resultats
 * @param {Array} results - Array de resultats
 */
function displaySummary(results) {
  const successCount = results.filter(r => r.status === 'OK').length;
  const totalCount = results.length;
  
  console.log(`\n${successCount}/${totalCount} connexions actives\n`);
  
  if (successCount === totalCount) {
    console.log('Tout est vert. Vous etes prets pour la suite !');
  } else {
    console.log(`${totalCount - successCount} erreur(s) detectee(s). Verifiez vos cles API.`);
  }
}

export { displayResult, displaySummary };
