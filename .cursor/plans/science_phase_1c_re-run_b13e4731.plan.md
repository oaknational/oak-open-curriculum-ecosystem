---
name: Science Phase 1C Re-run
overview: Full Phase 1C re-evaluation of all 24 Science queries (12 primary + 12 secondary). Run benchmarks, create three-way comparison tables, record metrics. Next steps determined AFTER seeing results.
todos:
  - id: phase0
    content: "Phase 0: Verify MCP server, bulk data, benchmark available"
    status: completed
  - id: primary-pt
    content: "PRIMARY precise-topic (3 queries): benchmark --review, three-way comparison, record metrics"
    status: completed
  - id: primary-ne
    content: "PRIMARY natural-expression (3 queries): benchmark --review, three-way comparison, record metrics"
    status: completed
  - id: primary-ii
    content: "PRIMARY imprecise-input (3 queries): benchmark --review, three-way comparison, record metrics"
    status: completed
  - id: primary-ct
    content: "PRIMARY cross-topic (3 queries): benchmark --review, three-way comparison, record metrics"
    status: completed
  - id: secondary-pt
    content: "SECONDARY precise-topic (3 queries): benchmark --review, three-way comparison, record metrics"
    status: completed
  - id: secondary-ne
    content: "SECONDARY natural-expression (3 queries): benchmark --review, three-way comparison, record metrics"
    status: completed
  - id: secondary-ii
    content: "SECONDARY imprecise-input (3 queries): benchmark --review, three-way comparison, record metrics"
    status: completed
  - id: secondary-ct
    content: "SECONDARY cross-topic (3 queries): benchmark --review, three-way comparison, record metrics"
    status: completed
  - id: phase2
    content: "Phase 2: Validation - type-check, ground-truth:validate"
    status: in_progress
  - id: phase3
    content: "Phase 3: Record aggregate metrics and key findings, discuss next steps with user"
    status: pending
---

# Science Phase 1C Fresh Re-run

## Context

Phase 1B is complete for Science — all 24 queries have COMMIT rankings. This session executes Phase 1C: comparison of YOUR committed rankings vs SEARCH results vs EXPECTED slugs.

**Key files**:

- Ground truths: `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/primary/` and `.../secondary/`
- Protocol: [ground-truth-session-template.md](.agent/plans/semantic-search/templates/ground-truth-session-template.md)

## Foundation Document Commitment

Before each major phase, re-read and re-commit to:

- [rules.md](.agent/directives-and-memory/rules.md) — First Question, TDD, quality over speed
- [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md) — Test behaviour, not implementation
- [schema-first-execution.md](.agent/directives-and-memory/schema-first-execution.md) — Generator is source of truth

## Phase 0: Prerequisites

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local
```

Verify:

- MCP server available (call `get-help`)
- Bulk data present: `jq '.sequence | length' bulk-downloads/science-primary.json`
- Benchmark working: `pnpm benchmark --help`

## Phase 1C: Comparison (24 queries)

For EACH query, execute:

1. **Run benchmark --review** — First time seeing search results for this fresh run
2. **Read existing COMMIT rankings** from checklist (already documented from Phase 1B)
3. **Create three-way comparison table**: YOUR COMMIT vs SEARCH vs EXPECTED
4. **Answer critical question**: Which source has the BEST slugs?
5. **Record ALL 4 metrics**: MRR, NDCG@10, P@3, R@10
6. **Update GT if needed** based on comparison

### PRIMARY Queries (12)

| Category | Query |

|----------|-------|

| precise-topic-1 | "evolution Darwin finches Year 6" |

| precise-topic-2 | "electrical circuits conductors insulators" |

| precise-topic-3 | "states of matter solids liquids gases" |

| natural-expression-1 | "why do birds have different shaped beaks" |

| natural-expression-2 | "why do things fall down" |

| natural-expression-3 | "what makes ice turn into water" |

| imprecise-input-1 | "evoloution and adaptashun" |

| imprecise-input-2 | "electrisity and magnits" |

| imprecise-input-3 | "evapration and condensashun" |

| cross-topic-1 | "habitats and food chains" |

| cross-topic-2 | "light and plants growing" |

| cross-topic-3 | "friction and different materials" |

### SECONDARY Queries (12)

| Category | Query |

|----------|-------|

| precise-topic-1 | "cell structure and function" |

| precise-topic-2 | "ionic and covalent bonding" |

| precise-topic-3 | "electromagnetic spectrum waves" |

| natural-expression-1 | "how do plants make their own food" |

| natural-expression-2 | "why does metal go rusty" |

| natural-expression-3 | "what makes things hot or cold" |

| imprecise-input-1 | "resperation in humans" |

| imprecise-input-2 | "photosythesis in plants" |

| imprecise-input-3 | "electromagnatic waves and spectrum" |

| cross-topic-1 | "energy and chemical reactions" |

| cross-topic-2 | "cells and genetics inheritance" |

| cross-topic-3 | "electricity and magnetism motors" |

## Commands

```bash
# PRIMARY categories
pnpm benchmark -s science -p primary -c precise-topic --review
pnpm benchmark -s science -p primary -c natural-expression --review
pnpm benchmark -s science -p primary -c imprecise-input --review
pnpm benchmark -s science -p primary -c cross-topic --review

# SECONDARY categories
pnpm benchmark -s science -p secondary -c precise-topic --review
pnpm benchmark -s science -p secondary -c natural-expression --review
pnpm benchmark -s science -p secondary -c imprecise-input --review
pnpm benchmark -s science -p secondary -c cross-topic --review

# Aggregate after all comparisons
pnpm benchmark --subject science --phase primary --verbose
pnpm benchmark --subject science --phase secondary --verbose
```

## Phase 2: Validation

After all 24 queries compared:

```bash
pnpm type-check
pnpm ground-truth:validate
```

## Phase 3: Documentation

Record aggregate metrics and key findings. DO NOT pre-determine next steps — discuss with user based on actual results.

## Quality Reminder

> **There is no time pressure. Quality is what matters.**

The COMMIT rankings from Phase 1B represent independent discovery. Phase 1C validates them against search and existing expected slugs. Take time to do meaningful three-way comparisons.
