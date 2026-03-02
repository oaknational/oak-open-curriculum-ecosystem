# Paraphrase Policy and Application

**Boundary**: query-policy-and-sdk-contracts  
**Status**: 📋 Pending  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-02-25

---

## Overview

This plan defines the runtime policy and contract for applying Bucket B
paraphrase artefacts at query time.

The paraphrase corpus itself is owned by
[natural-language-paraphrases.md](../03-vocabulary-and-semantic-assets/natural-language-paraphrases.md).
This plan owns when and how that corpus is applied in the search decision flow.

---

## Boundary Contract

This plan is authoritative for:

- Paraphrase detection policy at runtime
- Confidence-gated eligibility rules
- Allowed actions (boost, suggest, skip)
- Boost ceilings and safety constraints
- Explain/telemetry contract for paraphrase actions

This plan is not authoritative for:

- Paraphrase corpus mining and curation (vocabulary boundary)
- ES scoring mechanics and retriever tuning (retrieval boundary)

---

## Inputs and Outputs

| Type | Owner | Contract |
|------|-------|----------|
| Input corpus | [natural-language-paraphrases.md](../03-vocabulary-and-semantic-assets/natural-language-paraphrases.md) | Subject-scoped phrase → curriculum-term mappings |
| Decision context | [search-decision-model.md](search-decision-model.md) | Query shape + confidence tier |
| Retrieval execution | [modern-es-features.md](../04-retrieval-quality-engine/modern-es-features.md) | Applies approved boosts in retriever/query |

---

## Policy Rules

### Eligibility

1. Subject must be explicit or inferred at `CERTAIN`/`HIGH` confidence.
2. Paraphrases are additive only; original query terms are never removed.
3. Boosts are weak by default and must not exceed policy cap.

### Confidence-Gated Actions

| Confidence | Paraphrase Action |
|------------|-------------------|
| CERTAIN | Apply subject-scoped paraphrase boosts |
| HIGH | Apply subject-scoped paraphrase boosts |
| MEDIUM | Suggest or apply reduced boosts only |
| LOW | Do not apply paraphrase boosts |

### Guardrails

- Never treat paraphrases as strict synonyms.
- Never apply cross-subject paraphrases.
- Never apply paraphrase boosts above the agreed cap.

---

## Runtime Contract Sketch

```typescript
interface ParaphrasePolicyDecision {
  readonly applied: boolean;
  readonly terms: readonly string[];
  readonly boost: number;
  readonly reason: string;
}

function decideParaphraseApplication(
  query: string,
  subject: string | undefined,
  confidenceTier: 'CERTAIN' | 'HIGH' | 'MEDIUM' | 'LOW',
): ParaphrasePolicyDecision;
```

The retrieval boundary consumes this decision and applies the approved terms and
boost in query construction.

---

## Evidence Requirements

- Add paraphrase-specific query slices to benchmarks.
- Record before/after metrics and confidence-tier behaviour.
- Keep methodology and ground-truth governance aligned to
  [ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md).

---

## Checklist

- [ ] Finalise confidence-gated paraphrase policy
- [ ] Define boost cap and medium-confidence behaviour
- [ ] Define explain/telemetry fields for paraphrase actions
- [ ] Integrate with retrieval boundary implementation plan
- [ ] Benchmark policy impact and regression risk

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [search-decision-model.md](search-decision-model.md) | Core decision flow and confidence model |
| [natural-language-paraphrases.md](../03-vocabulary-and-semantic-assets/natural-language-paraphrases.md) | Paraphrase corpus and mining context |
| [modern-es-features.md](../04-retrieval-quality-engine/modern-es-features.md) | Retrieval-side implementation/tuning |
| [ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md) | Ground-truth/evidence authority |
