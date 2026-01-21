---
name: Music GT Phase 0-1A
overview: Phase 0 (Prerequisites) and Phase 1A (Query Analysis) for Music primary and secondary. Execute the protocol steps — verify tools, read queries, analyse experimental design.
todos:
  - id: phase0-verify
    content: "Step 0.1: Verify MCP server, bulk data, benchmark"
    status: completed
  - id: phase0-count
    content: "Step 0.2: Count music primary and secondary units"
    status: completed
  - id: phase0-read-queries
    content: "Step 0.3: Read ALL 8 query files (primary + secondary)"
    status: completed
  - id: primary-1a
    content: "PRIMARY Phase 1A: Analyse all 4 queries as experimental designs"
    status: completed
  - id: secondary-1a
    content: "SECONDARY Phase 1A: Analyse all 4 queries as experimental designs"
    status: completed
  - id: checkpoint-1a
    content: "CHECKPOINT 1A: All 8 queries assessed"
    status: completed
---

# Music Ground Truth Evaluation — Phase 0 + 1A

**Scope**: 8 queries (4 primary, 4 secondary)

**Purpose**: Validate query experimental design through critical reflection

---

## Phase 0: Prerequisites

### Step 0.1: Verify Tools

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local
```

| Tool | Verification | Status |

|------|--------------|--------|

| MCP server | Call `get-help` | ☐ Working / ☐ STOP |

| Bulk data | `ls bulk-downloads/music-*.json` | ☐ Present / ☐ STOP |

| Benchmark | `pnpm benchmark --help` | ☐ Working / ☐ STOP |

**CHECKPOINT 0**: If ANY tool unavailable → STOP.

### Step 0.2: Count Units

```bash
jq '.sequence | length' bulk-downloads/music-primary.json
jq '.sequence | length' bulk-downloads/music-secondary.json
```

| Phase | Unit Count |

|-------|------------|

| PRIMARY | ___ |

| SECONDARY | ___ |

### Step 0.3: Read Query Files

Read ALL 8 query files. Record query metadata below.

```bash
cat src/lib/search-quality/ground-truth/music/primary/precise-topic.query.ts
cat src/lib/search-quality/ground-truth/music/primary/natural-expression.query.ts
cat src/lib/search-quality/ground-truth/music/primary/imprecise-input.query.ts
cat src/lib/search-quality/ground-truth/music/primary/cross-topic.query.ts

cat src/lib/search-quality/ground-truth/music/secondary/precise-topic.query.ts
cat src/lib/search-quality/ground-truth/music/secondary/natural-expression.query.ts
cat src/lib/search-quality/ground-truth/music/secondary/imprecise-input.query.ts
cat src/lib/search-quality/ground-truth/music/secondary/cross-topic.query.ts
```

**PRIMARY Queries**:

| Category | Query | Description |

|----------|-------|-------------|

| precise-topic | ***|*** |

| natural-expression | ***|*** |

| imprecise-input | ***|*** |

| cross-topic | ***|*** |

**SECONDARY Queries**:

| Category | Query | Description |

|----------|-------|-------------|

| precise-topic | ***|*** |

| natural-expression | ***|*** |

| imprecise-input | ***|*** |

| cross-topic | ***|*** |

---

## Phase 1A: Query Analysis (REFLECTION ONLY)

**No tools. No searches. No data exploration. Pure critical thinking.**

For EACH query, complete the analysis template below.

---

### Analysis Template (repeat for each of 8 queries)

**Query**: "___"

**Category**: ___

**Capability being tested**: ___

#### 1A.1: What does this query literally say?

___

#### 1A.2: Is this a good test of the category's capability?

| Question | Analysis |

|----------|----------|

| Is this representative of real teacher behaviour? | |

| If search succeeds, what does it prove? | |

| If search fails, what does it reveal? | |

#### 1A.3: Category-specific evaluation

**For precise-topic**: Is this actually precise curriculum terminology?

**For natural-expression**: Is this genuinely informal language? Does register match expected content level?

**For imprecise-input**: Is the error realistic? Is this testing typo recovery or something else?

**For cross-topic**: Are there genuinely TWO distinct concepts? Does the intersection make sense?

#### 1A.4: Assessment

☐ Good test of category

☐ Has design issues: ___

☐ Miscategorised — should be: ___

---

## PRIMARY Analysis

### Query 1: precise-topic

[Fill in template]

### Query 2: natural-expression

[Fill in template]

### Query 3: imprecise-input

[Fill in template]

### Query 4: cross-topic

[Fill in template]

---

## SECONDARY Analysis

### Query 5: precise-topic

[Fill in template]

### Query 6: natural-expression

[Fill in template]

### Query 7: imprecise-input

[Fill in template]

### Query 8: cross-topic

[Fill in template]

---

## CHECKPOINT 1A

| Query | Category | Assessment |

|-------|----------|------------|

| PRIMARY Q1 | precise-topic | ☐ Good / ☐ Issues |

| PRIMARY Q2 | natural-expression | ☐ Good / ☐ Issues |

| PRIMARY Q3 | imprecise-input | ☐ Good / ☐ Issues |

| PRIMARY Q4 | cross-topic | ☐ Good / ☐ Issues |

| SECONDARY Q5 | precise-topic | ☐ Good / ☐ Issues |

| SECONDARY Q6 | natural-expression | ☐ Good / ☐ Issues |

| SECONDARY Q7 | imprecise-input | ☐ Good / ☐ Issues |

| SECONDARY Q8 | cross-topic | ☐ Good / ☐ Issues |

**All 8 queries assessed**: ☐
