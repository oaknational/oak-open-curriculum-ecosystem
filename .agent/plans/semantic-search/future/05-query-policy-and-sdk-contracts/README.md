# Query Policy and SDK Contracts

**Domain**: Query decision policy and Search SDK interface contracts  
**Intent**: Make query behaviour explainable and the API surface stable for consumers  
**Impact**: Predictable query handling, consistent retriever selection, and robust filter contracts

---

## Why Separate?

This boundary is about **policy and contracts**, not retrieval tuning mechanics. The questions here are:

- What filter combinations exist across the curriculum?
- How should the SDK expose these?
- What happens with invalid combinations?
- How are query shapes classified and routed?
- Which retriever profile is allowed under each confidence level?

This work defines policy and contract semantics that retrieval plans consume.

---

## Plans

| Plan | Description | Status |
|------|-------------|--------|
| [filter-testing.md](filter-testing.md) | Document all filter combinations, test edge cases | 📋 Pending |
| [search-decision-model.md](search-decision-model.md) | Query shape taxonomy, confidence model, retriever catalogue | 📋 Pending |
| [paraphrase-policy-and-application.md](paraphrase-policy-and-application.md) | Runtime policy for applying Bucket B paraphrases by confidence/subject | 📋 Pending |

---

## Cross-Boundary Dependencies

| Boundary Plan | Why It Matters Here |
|---------------|---------------------|
| [natural-language-paraphrases.md](../03-vocabulary-and-semantic-assets/natural-language-paraphrases.md) | Supplies Bucket B paraphrase artefacts consumed by policy |
| [modern-es-features.md](../04-retrieval-quality-engine/modern-es-features.md) | Implements policy-approved profiles/rules in retrieval |
| [ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md) | Provides measurement and evidence methodology |

---

## Key Insight

**KS4 Maths is NOT representative.** Different subjects have different metadata (tiers, exam boards, categories, unit options). We need to understand the full surface before stabilising the SDK API.

---

## Dependencies

- SDK extraction complete

---

## Success Criteria

- [ ] Filter matrix documented for all 17 subjects × 4 key stages
- [ ] All valid filter combinations have tests
- [ ] Invalid filter combinations handled gracefully
- [ ] SDK API refined based on findings
