---
name: Science Phase 1C Fresh Run
overview: Execute Phase 1C comparison for all 29 Science queries (12 Primary + 17 Secondary including KS4). Phase 1B discovery is COMPLETE - expected slugs are set. This session runs benchmarks, records all 4 metrics, analyses gaps, and updates GT if search found better matches.
todos:
  - id: phase0
    content: "PHASE 0: Verify MCP server, bulk data, benchmark tool - STOP if unavailable"
    status: completed
  - id: primary-precise
    content: "PRIMARY precise-topic (3 queries): Run benchmark --review, record ALL 4 metrics, analyse gaps"
    status: completed
  - id: primary-natural
    content: "PRIMARY natural-expression (3 queries): Run benchmark --review, record ALL 4 metrics, analyse gaps"
    status: completed
  - id: primary-imprecise
    content: "PRIMARY imprecise-input (3 queries): Run benchmark --review, record ALL 4 metrics, analyse gaps"
    status: completed
  - id: primary-cross
    content: "PRIMARY cross-topic (3 queries): Run benchmark --review, record ALL 4 metrics, analyse gaps"
    status: completed
  - id: primary-aggregate
    content: "PRIMARY aggregate: Run pnpm benchmark -s science -p primary --verbose, record aggregate metrics"
    status: completed
  - id: secondary-precise
    content: "SECONDARY precise-topic (3 queries): Run benchmark --review, record ALL 4 metrics, analyse gaps"
    status: completed
  - id: secondary-natural
    content: "SECONDARY natural-expression (4 queries incl. NEW natural-expression-4): Run benchmark --review, record ALL 4 metrics"
    status: completed
  - id: secondary-imprecise
    content: "SECONDARY imprecise-input (3 queries): Run benchmark --review, record ALL 4 metrics, analyse gaps"
    status: completed
  - id: secondary-cross
    content: "SECONDARY cross-topic (3 queries): Run benchmark --review, record ALL 4 metrics, analyse gaps"
    status: completed
  - id: secondary-ks4
    content: "SECONDARY KS4 (4 queries): Run benchmark for biology/chemistry/physics/combined-science, record ALL 4 metrics"
    status: completed
  - id: secondary-aggregate
    content: "SECONDARY aggregate: Run pnpm benchmark -s science -p secondary --verbose, record aggregate metrics"
    status: completed
  - id: phase2-validate
    content: "PHASE 2: Run pnpm type-check and pnpm ground-truth:validate"
    status: completed
  - id: phase3-checklist
    content: "PHASE 3: Update ground-truth-review-checklist.md with all metrics and findings"
    status: completed
  - id: phase3-current
    content: "PHASE 3: Update current-state.md with final metrics and GT corrections"
    status: completed
  - id: phase3-prompt
    content: "PHASE 3: Update semantic-search.prompt.md - set Next Session to Spanish Phase 1B"
    status: completed
---

# Science Phase 1C — FRESH RUN (29 Queries)

## Foundation Documents (Re-read Regularly)

Before executing any step, ensure familiarity with:

- [rules.md](.agent/directives-and-memory/rules.md)
- [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md)
- [schema-first-execution.md](.agent/directives-and-memory/schema-first-execution.md)

---

## Context

**Phase 1B is COMPLETE**: All 29 Science queries have expected slugs committed based on MCP summary analysis. The `.expected.ts` files contain the committed rankings.

**Previous Metrics (Pre-Phase 1B)**:

| Phase | MRR | NDCG@10 | P@3 | R@10 |

|-------|-----|---------|-----|------|

| PRIMARY | 0.621 | 0.619 | 0.472 | 0.736 |

| SECONDARY | 0.681 | 0.521 | 0.333 | 0.611 |

These will be re-measured with the updated 29 queries.

---

## Scope

**Science Primary (12 queries)** — [science/primary/](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/primary/):

- 3 precise-topic (evolution/Darwin, circuits/conductors, states of matter)
- 3 natural-expression (bird beaks, falling objects, ice melting)
- 3 imprecise-input (typo variants)
- 3 cross-topic (habitats+food chains, light+plants, friction+materials)

**Science Secondary (17 queries)** — [science/secondary/](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/secondary/):

- 3 precise-topic (cell structure, ionic/covalent bonding, EM spectrum)
- 4 natural-expression (photosynthesis, rusting, thermal perception ×2)
- 3 imprecise-input (typo variants)
- 3 cross-topic (energy+reactions, cells+genetics, electricity+magnetism)
- 4 KS4 subject-specific (biology, chemistry, physics, combined-science) — [ks4/](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/secondary/ks4/)

---

## Phase 1C Protocol (Per Query)

For each query:

1. **Run benchmark --review** — See search results and metrics
2. **Record ALL 4 metrics** — MRR, NDCG@10, P@3, R@10
3. **Analyse gaps** — If low metrics, determine: GT issue or search quality gap?
4. **Update GT if needed** — Only if expected slugs are demonstrably wrong

**Critical Question**: Are search results BETTER than expected slugs?

- If **High R@10 + Low MRR**: Results found but poorly ranked (search issue)
- If **Low R@10**: Expected slugs may be wrong (GT issue)

---

## PHASE 0: Prerequisites

### Step 0.1: Verify Tools

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local
```

| Tool | Verification | Status |

|------|--------------|--------|

| MCP server | Call `get-help` | Must be working |

| Bulk data | `ls bulk-downloads/science-*.json` | Must show 2 files |

| Benchmark | `pnpm benchmark --help` | Must work |

**CHECKPOINT 0**: If ANY tool is unavailable, STOP.

---

## PHASE 1C: Science Primary (12 Queries)

### Category: precise-topic (3 queries)

```bash
pnpm benchmark -s science -p primary -c precise-topic --review
```

**Queries**:

- precise-topic-1: "evolution Darwin finches Year 6"
- precise-topic-2: "electrical circuits conductors insulators"
- precise-topic-3: "states of matter solids liquids gases"

**Record metrics table**:

| Query | MRR | NDCG@10 | P@3 | R@10 | Verdict |

|-------|-----|---------|-----|------|---------|

| precise-topic-1 | | | | | |

| precise-topic-2 | | | | | |

| precise-topic-3 | | | | | |

**For each query with low metrics**: Analyse if GT issue or search gap.

---

### Category: natural-expression (3 queries)

```bash
pnpm benchmark -s science -p primary -c natural-expression --review
```

**Queries**:

- natural-expression-1: "why do birds have different shaped beaks"
- natural-expression-2: "why do things fall down"
- natural-expression-3: "what makes ice turn into water"

**Record metrics table**:

| Query | MRR | NDCG@10 | P@3 | R@10 | Verdict |

|-------|-----|---------|-----|------|---------|

| natural-expression-1 | | | | | |

| natural-expression-2 | | | | | |

| natural-expression-3 | | | | | |

---

### Category: imprecise-input (3 queries)

```bash
pnpm benchmark -s science -p primary -c imprecise-input --review
```

**Queries**:

- imprecise-input-1: "evoloution and adaptashun"
- imprecise-input-2: "electrisity and magnits"
- imprecise-input-3: "evapration and condensashun"

**Record metrics table**:

| Query | MRR | NDCG@10 | P@3 | R@10 | Verdict |

|-------|-----|---------|-----|------|---------|

| imprecise-input-1 | | | | | |

| imprecise-input-2 | | | | | |

| imprecise-input-3 | | | | | |

---

### Category: cross-topic (3 queries)

```bash
pnpm benchmark -s science -p primary -c cross-topic --review
```

**Queries**:

- cross-topic-1: "habitats and food chains"
- cross-topic-2: "light and plants growing"
- cross-topic-3: "friction and different materials"

**Record metrics table**:

| Query | MRR | NDCG@10 | P@3 | R@10 | Verdict |

|-------|-----|---------|-----|------|---------|

| cross-topic-1 | | | | | |

| cross-topic-2 | | | | | |

| cross-topic-3 | | | | | |

---

### PRIMARY Aggregate

```bash
pnpm benchmark -s science -p primary --verbose
```

**Record aggregate metrics**:

| Category | MRR | NDCG@10 | P@3 | R@10 |

|----------|-----|---------|-----|------|

| precise-topic | | | | |

| natural-expression | | | | |

| imprecise-input | | | | |

| cross-topic | | | | |

| **AGGREGATE** | | | | |

---

## PHASE 1C: Science Secondary (13 Standard Queries)

### Category: precise-topic (3 queries)

```bash
pnpm benchmark -s science -p secondary -c precise-topic --review
```

**Queries**:

- precise-topic-1: "cell structure and function"
- precise-topic-2: "ionic and covalent bonding"
- precise-topic-3: "electromagnetic spectrum waves"

**Record metrics table**:

| Query | MRR | NDCG@10 | P@3 | R@10 | Verdict |

|-------|-----|---------|-----|------|---------|

| precise-topic-1 | | | | | |

| precise-topic-2 | | | | | |

| precise-topic-3 | | | | | |

---

### Category: natural-expression (4 queries)

```bash
pnpm benchmark -s science -p secondary -c natural-expression --review
```

**Queries**:

- natural-expression-1: "how do plants make their own food"
- natural-expression-2: "why does metal go rusty"
- natural-expression-3: "why do some things feel hotter than others" (REVISED)
- natural-expression-4: "why does metal feel colder than wood at the same temperature" (NEW)

**Record metrics table**:

| Query | MRR | NDCG@10 | P@3 | R@10 | Verdict |

|-------|-----|---------|-----|------|---------|

| natural-expression-1 | | | | | |

| natural-expression-2 | | | | | |

| natural-expression-3 | | | | | |

| natural-expression-4 | | | | | |

---

### Category: imprecise-input (3 queries)

```bash
pnpm benchmark -s science -p secondary -c imprecise-input --review
```

**Queries**:

- imprecise-input-1: "resperation in humans"
- imprecise-input-2: "photosythesis in plants"
- imprecise-input-3: "electromagnatic waves and spectrum"

**Record metrics table**:

| Query | MRR | NDCG@10 | P@3 | R@10 | Verdict |

|-------|-----|---------|-----|------|---------|

| imprecise-input-1 | | | | | |

| imprecise-input-2 | | | | | |

| imprecise-input-3 | | | | | |

---

### Category: cross-topic (3 queries)

```bash
pnpm benchmark -s science -p secondary -c cross-topic --review
```

**Queries**:

- cross-topic-1: "energy and chemical reactions"
- cross-topic-2: "cells and genetics inheritance"
- cross-topic-3: "electricity and magnetism motors"

**Record metrics table**:

| Query | MRR | NDCG@10 | P@3 | R@10 | Verdict |

|-------|-----|---------|-----|------|---------|

| cross-topic-1 | | | | | |

| cross-topic-2 | | | | | |

| cross-topic-3 | | | | | |

---

## PHASE 1C: Science Secondary KS4 (4 Queries)

### Category: KS4 subject-specific (4 queries)

The KS4 queries are in [science/secondary/ks4/](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/secondary/ks4/).

Run benchmark for each KS4 query individually:

```bash
# Biology
pnpm benchmark -s science -p secondary --review
# Look for ks4-biology query results

# Or read expected files directly
cat src/lib/search-quality/ground-truth/science/secondary/ks4/biology-filter.expected.ts
cat src/lib/search-quality/ground-truth/science/secondary/ks4/chemistry-filter.expected.ts
cat src/lib/search-quality/ground-truth/science/secondary/ks4/physics-filter.expected.ts
cat src/lib/search-quality/ground-truth/science/secondary/ks4/combined-science-filter.expected.ts
```

**Queries and Expected Slugs (from Phase 1B)**:

| Query | Subject | Expected Slug (STRONG match) |

|-------|---------|------------------------------|

| "carbon cycle in ecosystems" | biology | `material-cycles-the-carbon-cycle` |

| "ionic bonding electron transfer" | chemistry | `forming-ions-for-ionic-bonding` |

| "radioactive decay half-life" | physics | `radioactive-half-life` |

| "energy transfers and efficiency" | combined-science | `calculating-efficiency-in-terms-of-energy-and-power` |

**Record metrics table**:

| Query | MRR | NDCG@10 | P@3 | R@10 | Verdict |

|-------|-----|---------|-----|------|---------|

| ks4-biology | | | | | |

| ks4-chemistry | | | | | |

| ks4-physics | | | | | |

| ks4-combined | | | | | |

---

### SECONDARY Aggregate

```bash
pnpm benchmark -s science -p secondary --verbose
```

**Record aggregate metrics**:

| Category | MRR | NDCG@10 | P@3 | R@10 |

|----------|-----|---------|-----|------|

| precise-topic | | | | |

| natural-expression | | | | |

| imprecise-input | | | | |

| cross-topic | | | | |

| KS4 | | | | |

| **AGGREGATE** | | | | |

---

## PHASE 2: Validation

### Step 2.1: Run Validation Suite

```bash
pnpm type-check
pnpm ground-truth:validate
```

### Step 2.2: Final Benchmark

```bash
pnpm benchmark -s science -p primary --verbose
pnpm benchmark -s science -p secondary --verbose
```

**CHECKPOINT 2**:

- type-check passed
- ground-truth:validate passed
- All 29 queries have 4 metrics recorded

---

## PHASE 3: Documentation

### Step 3.1: Update Checklist

Update [ground-truth-review-checklist.md](.agent/plans/semantic-search/active/ground-truth-review-checklist.md):

- Mark science/primary complete with aggregate metrics
- Mark science/secondary complete with aggregate metrics
- Record key findings and any GT corrections

### Step 3.2: Update Current State

Update [current-state.md](.agent/plans/semantic-search/current-state.md):

- Update Science section with final metrics
- Document any search quality gaps identified
- Note any GT corrections made

### Step 3.3: Update Prompt

Update [semantic-search.prompt.md](.agent/prompts/semantic-search/semantic-search.prompt.md):

- Update "Next Session" target to Spanish Phase 1B
- Add any key learnings from Science

---

## GT Correction Protocol

If benchmark reveals search found BETTER matches than expected slugs:

1. **Read the `.expected.ts` file** to see current expected slugs
2. **Compare with search results** — which are genuinely better?
3. **Get MCP summary** for the search result to verify key learning
4. **Update `.expected.ts`** if search result is demonstrably better
5. **Document the change** with justification

**Remember**: The search might be RIGHT. Expected slugs might be WRONG.

---

## Metric Targets

| Metric | Target | Interpretation |

|--------|--------|----------------|

| **MRR** | > 0.70 | 1.0=pos 1, 0.5=pos 2, 0.33=pos 3 |

| **NDCG@10** | > 0.75 | Overall ranking quality |

| **P@3** | > 0.50 | Are top 3 useful? |

| **R@10** | > 0.70 | Are expected slugs found at all? |

---

## Quality Over Speed

> **There is no time pressure. Going slowly and doing an excellent job provides lasting, significant value to this project. Going fast and compromising causes damage.**

Take time. Record every metric. Analyse every gap. The goal is correct ground truth, not fast completion.
