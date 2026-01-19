# Geography Ground Truth Re-evaluation

**This is a RE-EVALUATION using corrected methodology.**

The previous session (Session 15) validated search results instead of doing independent discovery. Changes made were based on what search returned, not on independent curriculum analysis.

## Quality Over Speed

> **There is no time pressure. Going slowly and doing an excellent job provides lasting, significant value to this project. Going fast and compromising causes *damage*.**

Take your time. Read each step carefully. Complete each step fully before moving on.

---

## Why This Re-evaluation is Needed

The previous methodology failed in a specific way:

1. Ran benchmark early
2. Saw what search returned
3. Got MCP summaries for those results
4. Justified the search results as "correct"
5. Filled in the "discovery" steps retroactively

This is **not independent discovery**. This is **search validation**.

**Example of the failure**: For "global warming effects", the ground truth kept `actions-to-tackle-climate-change` (a lesson about mitigation/adaptation) even though the query asks for "effects", not "actions". This happened because the analysis validated what search returned instead of independently asking "what lessons are actually about effects?"

---

## The COMMIT Step (1B.5)

The key safeguard is the **COMMIT step**. Before running benchmark, you must:

1. Analyse candidates based on curriculum content
2. Form YOUR OWN rankings with scores and justifications
3. COMMIT to those rankings in writing
4. ONLY THEN run benchmark

If your committed rankings are identical to search results, ask yourself: "Did I form this judgment independently, or did I validate what search returned?"

---

## Foundation Documents

Read these BEFORE starting:

- [Updated Template](../.agent/plans/semantic-search/templates/ground-truth-session-template.md) — The COMMIT step and three-way comparison
- [Updated Prompt](../.agent/prompts/semantic-search/semantic-search.prompt.md) — Cardinal rules and anti-patterns
- [Updated Checklist](../.agent/plans/semantic-search/active/ground-truth-review-checklist.md) — Why re-evaluation is needed

---

## Phase 0: Prerequisites

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local
```

| Tool | Verification | Status |

|------|--------------|--------|

| MCP server | Call `get-help` | ☐ Working / ☐ STOP |

| Bulk data | `jq '.sequence \| length' bulk-downloads/geography-primary.json` | ☐ Present / ☐ STOP |

| Bulk data | `jq '.sequence \| length' bulk-downloads/geography-secondary.json` | ☐ Present / ☐ STOP |

| Benchmark | `pnpm benchmark --help` | ☐ Working / ☐ STOP |

**CHECKPOINT 0**: If ANY tool is unavailable, STOP.

---

## Current Ground Truth Files

### geography/primary (4 queries)

| Category | Query | File |

|----------|-------|------|

| precise-topic | "UK countries capitals" | `geography/primary/precise-topic.ts` |

| natural-expression | "where is our school ks1" | `geography/primary/natural-expression.ts` |

| imprecise-input | "british ilands map" | `geography/primary/imprecise-input.ts` |

| cross-topic | "maps and forests together" | `geography/primary/cross-topic.ts` |

### geography/secondary (4 queries)

| Category | Query | File |

|----------|-------|------|

| precise-topic | "earthquakes tectonic plates" | `geography/secondary/precise-topic.ts` |

| natural-expression | "global warming effects" | `geography/secondary/natural-expression.ts` |

| imprecise-input | "tectonic plaits and earthqakes" | `geography/secondary/imprecise-input.ts` |

| cross-topic | "river erosion and deposition landforms" | `geography/secondary/cross-topic.ts` |

---

## For EACH Category: Execute Phase 1A, 1B (with COMMIT), 1C

### Phase 1A: Query Analysis (REFLECT ONLY)

**No jq. No MCP. No benchmark. No data exploration. Just THINKING.**

**IGNORE EXPECTED SLUGS. They are irrelevant in Phase 1A.**

| Category | Capability Being Tested |

|----------|------------------------|

| `precise-topic` | Basic retrieval works with curriculum terminology |

| `natural-expression` | Search bridges from everyday language to curriculum terms |

| `imprecise-input` | Search is resilient to typos and messy input |

| `cross-topic` | Search finds lessons combining multiple concepts |

**QUERY GATE**: Cannot search until query is validated as a good test.

### Phase 1B: Discovery + COMMIT (BEFORE Benchmark)

1. Search bulk data with 3+ different terms → 10+ candidate slugs
2. Get 5-10 MCP summaries with key learning quotes
3. Get unit context
4. Analyse each candidate's relevance to the query
5. **COMMIT your top 5 rankings with scores and justifications**

**DISCOVERY GATE**: Cannot run benchmark until rankings are COMMITTED.

### Phase 1C: Comparison (AFTER Commitment)

1. Verify pre-comparison: rankings committed before benchmark? ☐
2. Run `pnpm benchmark -s geography -p [phase] -c [category] --review`
3. Create **THREE-WAY comparison table**: YOUR rankings vs SEARCH vs EXPECTED
4. Ask: Are your rankings identical to search results? If yes, why?
5. Answer: "What are the BEST slugs — YOUR rankings, SEARCH, or EXPECTED?"
6. Record ALL 4 metrics: MRR, NDCG@10, P@3, R@10

---

## Special Attention: geography/secondary natural-expression

**Query**: "global warming effects"

The previous analysis kept `actions-to-tackle-climate-change` in the ground truth. But:

- The query asks for "effects" (what happens as a result of warming)
- `actions-to-tackle-climate-change` is about mitigation and adaptation (what we can DO about it)
- These are different things

In Phase 1B, search bulk data for ALL lessons about climate change and categorise them:

- Lessons about **effects/impacts** (what happens)
- Lessons about **causes** (why it happens)
- Lessons about **actions/responses** (what to do about it)

Then COMMIT your rankings based on which lessons are actually about EFFECTS.

---

## Phase 2: Validation

After all 8 categories:

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject geography --verbose
```

---

## Phase 3: Documentation and Commit

1. Update checklist with results
2. Update prompt with next session target
3. Run full quality gates from repo root
4. Commit with descriptive message

---

## Remember

> **There is no time pressure. Quality is what matters.**

Take your time. Form independent judgments. COMMIT before benchmark. Do it right.