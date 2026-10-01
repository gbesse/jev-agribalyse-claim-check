// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { checkEnvironmentalClaim } from "../src/index.mjs";
const client = createJevClient();
const résultat = await checkEnvironmentalClaim({
  "id": "exemple-1",
  "text": "L’allégation compare deux yaourts nature sur le même indicateur, la même portion et la même version AGRIBALYSE.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-09-25"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
