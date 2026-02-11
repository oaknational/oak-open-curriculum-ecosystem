# New Subject Onboarding Guide

**Purpose**: Complete workflow for adding a new subject/keystage to Elasticsearch search.  
**Audience**: Developers and AI agents onboarding new curriculum content.  
**Last Updated**: 2026-01-03

---

## Overview

This guide covers the end-to-end process of:

1. Ingesting data for a new subject/keystage
2. Verifying ingestion succeeded
3. Establishing a quality baseline
4. Identifying and fixing vocabulary gaps
5. Logging the experiment

**Estimated time**: 2-4 hours per subject/keystage combination.

---

## Prerequisites

Before starting, ensure:

- [ ] ES cluster access configured (`.env.local` with `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY`)
- [ ] Oak API key configured (`OAK_API_KEY`)
- [ ] SDK is built (`pnpm build` from repo root)
- [ ] ES setup complete (`pnpm es:setup` run at least once)

```bash
# Verify environment
cd apps/oak-search-cli
cat .env.local | grep -E 'ELASTICSEARCH|OAK_API'
```

---

## Step 1: Ingest Data

Ingest the new subject/keystage from the live Oak API:

```bash
cd apps/oak-search-cli

# Single subject/keystage
pnpm es:ingest-live -- --subject science --key-stage ks3

# Multiple keystages
pnpm es:ingest-live -- --subject science --key-stage ks3 --key-stage ks4

# Dry run to preview
pnpm es:ingest-live -- --subject science --key-stage ks3 --dry-run
```

**Duration**: 5-15 minutes depending on content volume.

---

## Step 2: Verify Ingestion

Check that documents were indexed correctly:

```bash
pnpm es:status
```

Expected output shows document counts per index. Record these for later comparison:

| Index             | Count   |
| ----------------- | ------- |
| `oak_lessons`     | [value] |
| `oak_units`       | [value] |
| `oak_unit_rollup` | [value] |

### Verify ELSER Fields

Critical check — ELSER semantic fields must be populated:

```bash
# Quick verification
curl -s -X GET "$ELASTICSEARCH_URL/oak_lessons/_count" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":{"exists":{"field":"lesson_content_semantic"}}}' | jq '.count'
```

This count should equal the total lesson count. If it's 0, ELSER embeddings were not generated — see [INGESTION-GUIDE.md](./INGESTION-GUIDE.md#troubleshooting).

---

## Step 3: Establish Quality Baseline

Run the hard query baseline tests to measure current performance:

```bash
# Ensure you have ground truth queries for this subject
# If not, create them first in src/lib/search-quality/ground-truth/

pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```

Record the baseline metrics:

| Metric          | Value   |
| --------------- | ------- |
| Lesson Hard MRR | [value] |
| Unit Hard MRR   | [value] |
| Standard MRR    | [value] |

**Important**: If no ground truth queries exist for this subject, create them first. See [GROUND-TRUTH-PROCESS.md](../src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md) for the complete step-by-step process.

---

## Step 4: Analyse Failures

Review the baseline results to identify failure patterns:

| Category          | Questions to Ask                                       |
| ----------------- | ------------------------------------------------------ |
| **Synonym**       | What teacher language isn't matching curriculum terms? |
| **Colloquial**    | What informal phrases are teachers using?              |
| **Multi-concept** | What cross-topic queries are failing?                  |
| **Misspelling**   | Are there subject-specific terms being misspelled?     |

### Mining Vocabulary

Extract official curriculum vocabulary from the bulk download:

```bash
# Get bulk download data
# (Assuming you have the bulk download file)

jq '[.[] | .lessonTitle, .unitTitle, (.lessonKeywords // [])[] | .keyword] | unique' \
  science-ks3.json > science-vocabulary.txt

# Look for patterns
grep -i "photosynthesis" science-vocabulary.txt
grep -i "equation" science-vocabulary.txt
```

Cross-reference with teacher query language from failure analysis.

---

## Step 5: Add Synonyms (TDD)

Follow the TDD workflow from [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md#synonym-mining-process).

### RED: Write Failing Test

```typescript
// smoke-tests/synonym-coverage.smoke.test.ts
describe('Science Synonym Coverage', () => {
  it('finds photosynthesis for "how plants make food"', async () => {
    const results = await searchLessons('how plants make food');
    expect(results.slice(0, 3).map((r) => r.lesson_slug)).toContain('photosynthesis-lesson');
  });
});
```

Run test — it MUST fail.

### GREEN: Add Synonyms

Create or update the subject synonym file:

```typescript
// packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/science.ts
export const scienceSynonyms = {
  photosynthesis: ['how plants make food', 'plant energy', 'chlorophyll process'],
  // ... more synonyms
} as const;
```

Export from index:

```typescript
// packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/index.ts
export { scienceSynonyms } from './science.js';
```

### Deploy and Verify

```bash
# From repo root
pnpm type-gen && pnpm build

# Deploy to ES
cd apps/oak-search-cli
pnpm es:setup

# Verify test passes
pnpm vitest run -c vitest.smoke.config.ts synonym-coverage
```

---

## Step 6: Measure Improvement

Re-run the baseline to measure improvement:

```bash
pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```

Calculate the delta:

| Metric          | Before  | After   | Delta    |
| --------------- | ------- | ------- | -------- |
| Lesson Hard MRR | [value] | [value] | [change] |
| Unit Hard MRR   | [value] | [value] | [change] |

---

## Step 7: Log the Experiment

Add an entry to [EXPERIMENT-LOG.md](../../../.agent/evaluations/EXPERIMENT-LOG.md):

```markdown
### YYYY-MM-DD: [Subject] [KeyStage] Synonym Coverage

**Hypothesis**: Adding [N] synonyms will improve hard query MRR

| Metric          | Before  | After   | Delta    |
| --------------- | ------- | ------- | -------- |
| Lesson Hard MRR | [value] | [value] | [change] |
| Unit Hard MRR   | [value] | [value] | [change] |

**Decision**: ACCEPTED / REJECTED

**Key insight**: [What you learned]

**Experiment file**: [link if detailed experiment doc created]
```

Update [current-state.md](../../../.agent/plans/semantic-search/current-state.md) if this is now the primary dataset.

---

## Step 8: Codify Learnings

Extract lasting value by updating documentation.

### What Goes Where

| Content Type                | Location                       | Purpose                           |
| --------------------------- | ------------------------------ | --------------------------------- |
| **What we DO**              | This guide, INGESTION-GUIDE.md | Best practices for future work    |
| **What we DON'T DO**        | EXPERIMENT-LOG.md              | Record of decisions and reasoning |
| **Architectural decisions** | ADRs                           | Formal decisions with context     |

### Update This Guide

If your experiment revealed a better process:

1. Update the relevant step in this guide
2. Add a note about why (e.g., "Added after Science KS3 onboarding revealed...")
3. Keep the guide focused on **what to do**, not **what we tried**

### Create or Update ADRs

If your experiment led to an architectural decision:

1. Check if an existing ADR covers this topic
2. Either update the existing ADR or create a new one
3. Reference the experiment that led to the decision

**Example**: The synonym coverage experiment led to [ADR-063 Synonym Mining Process](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md#synonym-mining-process).

---

## Completion Checklist

Before considering a subject "fully onboarded":

- [ ] Data ingested successfully
- [ ] ELSER fields populated (count matches total)
- [ ] Baseline MRR documented
- [ ] Vocabulary gaps identified
- [ ] Synonyms added (following TDD)
- [ ] Improvement measured
- [ ] Experiment logged in EXPERIMENT-LOG.md
- [ ] Learnings codified (this guide updated if process changed)
- [ ] ADRs updated if architectural decisions made
- [ ] Quality gates pass (`pnpm check` from repo root)

---

## Troubleshooting

### No Results for Known-Good Queries

Check if the lesson exists in the index:

```bash
curl -s -X GET "$ELASTICSEARCH_URL/oak_lessons/_search" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":{"match":{"lesson_title":"[expected lesson title]"}}}' | jq '.hits.hits[0]'
```

If not found, the lesson may not have been ingested — check ingestion logs.

### ELSER Count is 0

Re-run ingestion with latest code:

```bash
git pull && pnpm build
pnpm es:ingest-live -- --subject [subject] --key-stage [keystage]
```

### Synonyms Not Working

1. Verify synonyms deployed: `pnpm es:setup`
2. Check synonym set exists in ES
3. Clear query caches (restart dev server)

See [SYNONYMS.md](./SYNONYMS.md) for detailed troubleshooting.

---

## Related Documents

| Document                                                                                                 | Purpose                       |
| -------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [GROUND-TRUTH-PROCESS.md](../src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md)                | Ground truth creation process |
| [INGESTION-GUIDE.md](./INGESTION-GUIDE.md)                                                               | Ingestion commands reference  |
| [SYNONYMS.md](./SYNONYMS.md)                                                                             | Synonym system details        |
| [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) | Synonym architecture          |
| [ADR-098](../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md)               | Ground truth registry         |
| [EXPERIMENT-LOG.md](../../../.agent/evaluations/EXPERIMENT-LOG.md)                                       | Experiment history            |
