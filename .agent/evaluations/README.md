# Evaluations

Historical experimentation records and experimental protocol for the Oak Curriculum ecosystem.

## Archive Notice (2026-01-23)

Much of the original content in this directory has been archived. The ground truth system was restructured in January 2026 after an audit revealed ~60% of ground truths were broken or suboptimal. Historical experiments (which were based on invalid ground truth) are now in the `archive/` folder for reference.

---

## Current Authoritative Documents

| Document | Location | Purpose |
|----------|----------|---------|
| **Ground Truth Guide** | [GROUND-TRUTH-GUIDE.md](../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | GT design, troubleshooting, lessons learned |
| **Search Acceptance Criteria** | [search-acceptance-criteria.md](../plans/semantic-search/search-acceptance-criteria.md) | Targets and thresholds |
| **Current State** | [current-state.md](../plans/semantic-search/current-state.md) | Current metrics snapshot |
| **IR Metrics** | [IR-METRICS.md](../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | Metric definitions (MRR, NDCG@10, etc.) |
| **Roadmap** | [roadmap.md](../plans/semantic-search/roadmap.md) | Strategic plan |

---

## Key ADRs

| ADR | Topic |
|-----|-------|
| [ADR-081](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Evaluation framework |
| [ADR-082](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Tier system strategy |
| [ADR-085](../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | GT validation rules |
| [ADR-098](../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) | Registry design |
| [ADR-103](../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md) | Fuzzy matching limitations |
| [ADR-104](../../docs/architecture/architectural-decisions/104-domain-term-boosting.md) | Domain term boosting strategy |

---

## Evaluation Tools

```bash
cd apps/oak-open-curriculum-semantic-search

# Validate all ground truths
pnpm ground-truth:validate

# Benchmark (measure effects of changes)
pnpm benchmark --all                    # All 30 subject/phase entries
pnpm benchmark --subject maths          # One subject
pnpm benchmark --phase primary          # One phase

# Smoke test (is it working?)
pnpm smoke:dev:stub                     # Behavior-focused tests
```

---

## Directory Structure

```text
.agent/evaluations/
├── README.md                    ← You are here
├── EXPERIMENTAL-PROTOCOL.md     ← Core protocol (historical reference)
├── audits/                      ← Historical audit records
│   └── ground-truth-audit-2026-01.md
├── guidance/                    ← Practical how-to guides
│   └── search-experiment-guidance.md
└── archive/                     ← Historical experiments and baselines
    ├── experiments/             ← Pre-restructure experiments
    ├── baselines/               ← Pre-restructure baselines
    ├── EXPERIMENT-LOG.md        ← Chronological history
    └── zero-hit-investigation.md
```

---

## What's in the Archive

The `archive/` folder contains experiments and baselines from before the January 2026 restructuring. These are preserved for historical reference but should not be used as authoritative sources:

| Content | Notes |
|---------|-------|
| **experiments/** | All experiments used invalid ground truth; decisions may be wrong |
| **baselines/** | Baselines measured against incorrect expected slugs |
| **EXPERIMENT-LOG.md** | Sparse log, superseded by current-state.md |
| **zero-hit-investigation.md** | Investigation that led to the GT audit findings |

The key finding from the audit was that **search often returned BETTER results than expected slugs**. What appeared to be "search failures" were actually ground truth failures.

---

## Curriculum Baseline Counts (Reference)

| Index | Documents |
|-------|-----------|
| `oak_lessons` | 12,833 |
| `oak_units` | 1,665 |
| `oak_threads` | 164 |
| `oak_sequences` | 30 |
| `oak_sequence_facets` | 57 |
| **Total** | **16,414** |

Full curriculum ingestion complete. See [audits/ground-truth-audit-2026-01.md](audits/ground-truth-audit-2026-01.md) for the audit that led to the restructuring.
