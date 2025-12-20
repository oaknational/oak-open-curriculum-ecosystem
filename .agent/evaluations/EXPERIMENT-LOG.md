# Experiment Log

Chronological record of search experiments and their impact on system metrics.

**Purpose**: Enable revisiting past decisions, identifying patterns, demonstrating rigorous evaluation, and generating new ideas.

---

## How to Read This Log

- Entries are in **reverse chronological order** (newest first)
- Each entry shows before/after metrics and the decision
- The "Cumulative Progress" table at the bottom shows system evolution

---

## Current System State

For the full current state, see [current-state.md](plans/semantic-search/current-state.md).

| Metric | Value | Last Updated |
|--------|-------|--------------|
| Lesson Hard MRR | 0.380 | 2025-12-19 |
| Unit Hard MRR | 0.844 | 2025-12-19 |
| Standard MRR | 0.931 | 2025-12-19 |

---

## Log Entries

### 2025-12-19: Comprehensive Synonym Coverage

**Hypothesis**: Adding 40+ Maths KS4 synonyms will improve hard query MRR by ≥5%

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Lesson Hard MRR | 0.367 | 0.380 | +3.5% |
| Unit Hard MRR | 0.811 | 0.844 | +4.1% |
| Vocabulary gap tests | 3/11 | 11/11 | +8 |

**Decision**: ✅ ACCEPTED

**Key insight**: "sohcahtoa" was returning histograms before synonyms; now returns trigonometry rank 1. The synonym approach successfully bridges vocabulary gaps between teacher language and curriculum terminology.

**What was changed**:

- Expanded `maths.ts` from 8 to 40+ synonym entries
- Added mappings for: sohcahtoa→trigonometry, solving for x→linear equations, straight line→linear, etc.

**Experiment file**: [comprehensive-synonym-coverage.experiment.md](experiments/comprehensive-synonym-coverage.experiment.md)

---

### 2025-12-19: Semantic Reranking

**Hypothesis**: Cross-encoder reranking will improve hard query MRR by ≥15%

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Lesson Hard MRR | 0.367 | 0.305 | -16.8% |

**Decision**: ❌ REJECTED

**Key insight**: Generic cross-encoder lacks curriculum domain knowledge. This experiment led to the creation of [ADR-082: Fundamentals-First Strategy](../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — AI on weak fundamentals = amplified weakness.

**What was learned**:

- Generic AI models don't understand curriculum vocabulary
- Need to master fundamentals (synonyms, phrases, noise filtering) before AI enhancement
- Rich data assets (relationships, threads) are underutilised

**Experiment file**: [semantic-reranking.experiment.md](experiments/semantic-reranking.experiment.md)

---

### 2025-12-18: Hard Query Baseline

**Purpose**: Document current system behaviour before experiments

| Metric | Value |
|--------|-------|
| Lesson Hard MRR | 0.367 |
| Unit Hard MRR | 0.811 |
| Colloquial MRR | 0.000 |
| Synonym MRR | 0.167 |
| Misspelling MRR | 0.833 |

**Key findings**:

- 5 of 8 lesson failures are vocabulary gaps fixable with synonyms
- Units outperform lessons (0.811 vs 0.367) — unit summaries are more information-dense
- Misspelling handling is excellent (fuzzy matching working)
- Colloquial queries fail completely (noise phrases + vocabulary gaps)

**Baseline file**: [hard-query-baseline.md](baselines/hard-query-baseline.md)

---

## Cumulative Progress

| Date | Event | Lesson MRR | Unit MRR | Notes |
|------|-------|------------|----------|-------|
| 2025-12-18 | Hard Query Baseline | 0.367 | 0.811 | Starting point for Maths KS4 |
| 2025-12-19 | Semantic Reranking Rejected | — | — | -16.8% regression, reverted, led to ADR-082 |
| 2025-12-19 | Synonym Coverage Accepted | 0.380 | 0.844 | +3.5% / +4.1% improvement via synonyms |

---

## How to Add an Entry

After running an experiment:

1. Add a new entry at the top of "Log Entries" (below the most recent)
2. Include: date, descriptive name, hypothesis, before/after metrics table, decision, key insight
3. Link to the detailed experiment file
4. Update the "Cumulative Progress" table
5. Update [current-state.md](plans/semantic-search/current-state.md) with new metric values
6. **Codify learnings** (see below)

### Codify Learnings — Extract Lasting Value

| If the experiment... | Then update... |
|---------------------|----------------|
| Led to an architectural decision | Create or update an **ADR** |
| Revealed operational best practices | Update **INGESTION-GUIDE.md**, **SYNONYMS.md**, etc. |
| Changed the recommended process | Update **NEW-SUBJECT-GUIDE.md** |

**Key principle**:
- **What we DO** → Goes in operational guides (e.g., NEW-SUBJECT-GUIDE.md)
- **What we DON'T DO** → Stays here in the experiment log
- **Why we decided** → Full reasoning in the experiment file

**Template**:

```markdown
### YYYY-MM-DD: [Descriptive Name]

**Hypothesis**: [What you expected to happen]

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| [Metric] | [Value] | [Value] | [Change] |

**Decision**: ✅ ACCEPTED / ❌ REJECTED / ⏸️ INCONCLUSIVE

**Key insight**: [One paragraph explaining the most important learning]

**Experiment file**: [filename.experiment.md](experiments/filename.experiment.md)
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [current-state.md](plans/semantic-search/current-state.md) | Current metrics snapshot |
| [EXPERIMENT-PRIORITIES.md](experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap (what to try next) |
| [ADR-081](../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Evaluation framework and decision criteria |
| [ADR-082](../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first strategy |

