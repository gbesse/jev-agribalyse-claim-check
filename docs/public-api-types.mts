// Objectif : vérifier que les types publics sont importables.
import { environmentalClaim, checkEnvironmentalClaim } from "../src/index.mjs";
const dossier = environmentalClaim({
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
});
void checkEnvironmentalClaim(dossier, { decide: async () => ({}) });
