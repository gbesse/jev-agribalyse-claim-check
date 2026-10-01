// Objectif : vérifier la normalisation, la règle déterministe et les décisions sémantiques.
import test from "node:test";
import assert from "node:assert/strict";
import { environmentalClaim, checkEnvironmentalClaim } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const casLimite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-27"
  },
  "referenceProduct": null
};
const casPrincipal = {
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
};
const casÀRevoir = {
  "id": "revue-1",
  "text": "Le produit est annoncé meilleur pour la planète à partir du seul indicateur climat, sans préciser la portion ni les autres impacts.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-26"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
test("exige une source", () => assert.throws(() => environmentalClaim({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => {
  const provider = createFakeProvider(() => { throw new Error("appel interdit"); });
  assert.equal((await checkEnvironmentalClaim(casLimite, provider)).decision, "incomparable");
  assert.equal(provider.calls, 0);
});
test("classe un dossier sourcé avec une confiance suffisante", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "supported", probabilities: {
  "supported": 0.82,
  "qualified": 0.06,
  "unsupported": 0.06,
  "incomparable": 0.06
}, confidence: 0.82 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await checkEnvironmentalClaim(casPrincipal, provider);
  assert.equal(résultat.decision, "supported");
  assert.equal(résultat.review, false);
  assert.equal(provider.calls, 1);
});
test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "qualified", probabilities: {
  "supported": 0.16,
  "qualified": 0.52,
  "unsupported": 0.16,
  "incomparable": 0.16
}, confidence: 0.62 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await checkEnvironmentalClaim(casÀRevoir, provider);
  assert.equal(résultat.decision, "qualified");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
