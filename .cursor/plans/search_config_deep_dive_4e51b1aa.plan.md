---
name: Search Config Deep Dive
overview: Deep investigation into search configuration, retrievers, weights, and RRF across all four indexes. Questions assumptions in the existing search-results-quality plan, validates claims with RRF score mathematics, and identifies the correct remediation sequence.
todos:
  - id: benchmark-baseline
    content: Run pnpm benchmark:lessons --all against live ES to establish actual baseline with current code changes
    status: completed
  - id: diagnostic-queries
    content: Run cross-subject diagnostic queries on units/threads/sequences via MCP to quantify actual impact on non-lesson scopes
    status: completed
  - id: synonyms-audit
    content: Query oak-syns synonyms set from live ES to complete configuration audit
    status: pending
  - id: fix-tsdoc
    content: Fix misleading TSDoc on normaliseTranscriptScores (says down-weighted, actually up-weighted per ADR-099)
    status: completed
  - id: fix-test-issues
    content: Delete type-only test, rename misclassified file, extract shared stubs
    status: cancelled
  - id: restore-tsdoc
    content: Restore removed TSDoc from rrf-query-helpers.ts and benchmark-main.ts (split files if needed)
    status: cancelled
  - id: evaluate-benchmarks
    content: Analyse benchmark results — cross-subject improvement + per-subject non-regression
    status: completed
  - id: decide-total-semantics
    content: Decide and document total semantic change (ADR or TSDoc)
    status: pending
  - id: per-scope-strategy
    content: "Document per-scope fuzziness and score filtering rationale (units: align with lessons, threads/sequences: keep AUTO with rationale)"
    status: completed
  - id: architecture-review
    content: Invoke architecture reviewers on complete search config change set
    status: completed
  - id: quality-gates
    content: Run full quality gate chain including E2E/smoke
    status: completed
isProject: false
---

# Search Config Deep Dive: Assumptions Questioned, Claims Validated

## TL;DR: What I Found

The existing plan is broadly correct on the problems but has gaps in its analysis. Several assumptions need challenging, one TSDoc comment is factually wrong (not the code), and the proposed scope-consistency treatment requires per-scope reasoning rather than blanket application. The min_score threshold interacts with the RRF scoring formula in ways the plan doesn't account for.

---

## Finding 1: Transcript Normalisation is CORRECT (TSDoc is WRONG)

**Assumption challenged**: "The normalisation function is straightforward."

The TSDoc in `[rrf-query-helpers.ts](packages/sdks/oak-search-sdk/src/retrieval/rrf-query-helpers.ts)` line 189 says:

> "Lessons without transcript are down-weighted by factor 2."

This is factually backwards. The code multiplies non-transcript scores by 2 to **compensate** for their structural disadvantage (ADR-099). Non-transcript lessons can only appear in 2 of 4 retrievers, so their max possible RRF score is half that of transcript lessons. The 2x multiplier equalises this — it is an **up-weight**, not a down-weight.

The CLI's canonical implementation in `[rrf-score-normaliser.ts](apps/oak-search-cli/src/lib/hybrid-search/rrf-score-normaliser.ts)` has correct TSDoc. The SDK port has misleading documentation.

**Fix**: Correct the TSDoc. No code change needed.

---

## Finding 2: min_score Threshold Is Defensible But Uncalibrated

**Assumption challenged**: "DEFAULT_MIN_SCORE = 0.04 is a magic number from 3 queries."

This is true, but the math shows it is in the right neighbourhood. With `rank_constant: 60` and 4 retrievers:

| Scenario                    | RRF Score           | Passes 0.04?   |
| --------------------------- | ------------------- | -------------- |
| Rank 1 in all 4 retrievers  | 4 x 1/61 = 0.066    | Yes            |
| Rank 1 in 3 retrievers      | 3 x 1/61 = 0.049    | Yes            |
| Rank 1 in 2 retrievers only | 2 x 1/61 = 0.033    | **No**         |
| Rank 40 in all 4 retrievers | 4 x 1/100 = 0.040   | Yes (boundary) |
| Rank 1 in 2, rank 20 in 1   | 2/61 + 1/80 = 0.045 | Yes            |

**Interpretation**: A document must rank well in at least 3 of 4 retrievers to pass. This filters out documents that only match via BM25 but not ELSER (or vice versa), which is a reasonable quality gate — it means you need both lexical and semantic relevance.

**Risk**: If a query term is so specialised that ELSER hasn't been trained on it, a genuinely relevant document might only appear in 2 BM25 retrievers and get filtered out. The ELSER safety net assumption needs validating against the ground truth suite.

After transcript normalisation, the interaction is fair: non-transcript docs at rank 1 in both 2 applicable retrievers score 0.033 x 2 = 0.066, which passes easily.

---

## Finding 3: Score Filtering CANNOT Be Blindly Applied Across Scopes

**Assumption challenged**: "Other indexes need the same score filtering."

The plan correctly identifies that threads and sequences lack score filtering, but fails to note that the RRF parameters differ:

| Scope     | RRF Ways | rank_constant | Max Score | 0.04 as % of Max |
| --------- | -------- | ------------- | --------- | ---------------- |
| Lessons   | 4-way    | 60            | 0.066     | 61%              |
| Units     | 4-way    | 60            | 0.066     | 61%              |
| Threads   | 2-way    | 40            | 0.049     | **82%**          |
| Sequences | 2-way    | 40            | 0.049     | **82%**          |

A 0.04 threshold on threads would mean a document needs to rank in the top ~5 positions in BOTH retrievers. This is far too aggressive for a 2-way RRF — it would filter out almost everything except near-perfect matches. If score filtering is added to threads/sequences, the threshold must be calculated relative to each scope's max possible RRF score.

**Conclusion**: Score filtering is per-scope, not universal. Each scope needs its own threshold derived from its RRF parameters.

---

## Finding 4: Fuzziness Needs Per-Scope Reasoning, Not Blanket Consistency

**Assumption challenged**: "All scopes should use the same fuzziness strategy."

The same `fuzziness: 'AUTO'` setting has fundamentally different impacts depending on the index structure:

**Lessons** (12,833 docs, transcript content):

- BM25 queries `lesson_content` (transcript) — massive term frequency for common words
- "apple" fuzzy-matches "apply" across thousands of transcripts
- `AUTO:6,9` fix is correct and necessary

**Units** (1,665 docs, aggregated content):

- BM25 queries `unit_content` (aggregated from lesson transcripts)
- Smaller index limits volume, but same class of fuzzy pollution possible
- `AUTO:3,6` is already stricter than the original lesson config
- May benefit from `AUTO:6,9` alignment, but the risk/reward ratio is different

**Threads** (164 docs, titles only):

- BM25 queries ONLY `thread_title^2` — a single short structured field
- No transcript content, no massive term frequency
- 164 documents is too few for volume to be a problem
- Thread titles are typically 1-3 words ("Number", "Algebra", "Place Value")
- `fuzziness: 'AUTO'` on short titles is actually useful for typo correction
- Changing to `AUTO:6,9` would disable fuzzy matching on most thread titles (which are typically short words)

**Sequences** (30 docs, structured fields):

- BM25 queries `sequence_title^2, category_titles, subject_title, phase_title`
- 30 documents — volume is never a problem
- Structured titles, no transcript content
- `fuzziness: 'AUTO'` is harmless and potentially useful

**Conclusion**: Blanket `AUTO:6,9` across all scopes is wrong for threads and sequences. The lesson fix should be applied to units (similar structure), but threads and sequences should keep `AUTO` with a documented rationale.

---

## Finding 5: The `minimum_should_match` and Short-Word Typo Concern

**Assumption challenged**: "AUTO:6,9 might break multi-word queries with typos."

The plan raises: *"May break multi-word queries where a short word has a typo (e.g. 'teh romans')."*

This is a valid concern. With `minimum_should_match: '2<65%'`:

- For 2-term queries: BOTH terms must match
- "teh" (3 chars) with 0 edits won't fuzzy-match "the"
- The BM25 retrievers would not find the document via lexical match

However, the ELSER semantic retrievers ARE a safety net — ELSER understands "teh romans" as semantically similar to "the Romans" regardless of spelling. So the document would still appear in 2 of 4 retrievers (both ELSER). Whether that scores above 0.04 depends on ELSER rank quality, which is generally good for such cases.

**Conclusion**: The concern is theoretically valid but mitigated by ELSER. Should be validated with the benchmark suite, not blocked on.

---

## Finding 6: What We Cannot See From Code — The `oak-syns` Synonyms Set

All four indexes use `oak_syns_filter` referencing an `oak-syns` synonyms set stored in the deployed Elasticsearch cluster. We cannot inspect its contents from the codebase alone. The synonym configuration could be:

- Adding unexpected term expansions
- Missing useful curriculum-specific synonyms
- Interacting with fuzziness in ways we haven't considered

**Action needed**: Query the live ES cluster for the synonyms set contents to complete the search configuration audit.

---

## Finding 7: `lesson_content` Field Weighting Warrants Future Investigation

The `lesson_content` field is unweighted (`^1.0` implicit) in the BM25 content retriever, whilst `lesson_title` has `^3` and `lesson_keywords` has `^2`. Despite the lack of boost, BM25's TF-IDF weighting means that a word appearing 50+ times in a 5,000-word transcript receives significant relevance weight. The fuzziness fix addresses the worst symptom (fuzzy matches in transcripts), but the underlying question remains: should transcript content have a reduced boost (e.g., `lesson_content^0.5`)?

This is Option 3 in the existing plan. It should remain future work — the fuzziness fix addresses the primary cause, and reducing transcript weight risks harming queries where the answer IS in the transcript.

---

## Finding 8: The `total` Semantic Change Needs a Decision

The plan correctly identifies this as undocumented. Three options:

1. **Accept the change**: `total` means "actionable results" (filtered count). Document it, update consumers.
2. **Dual totals**: Add `esTotal` (raw) alongside `total` (filtered). More information, more API surface.
3. **Revert**: Keep `total` as ES total, let consumers handle overflow.

My recommendation: Option 1 — the ES total of 8,329 for "apple" is misleading. The filtered count is what consumers actually need. But this needs an ADR or TSDoc documenting the semantic contract.

---

## Proposed Execution Sequence

### Phase 1: Validate Before Changing (No Code Changes)

1. Run `pnpm benchmark:lessons --all` against live ES to establish the ACTUAL baseline with current code
2. Run diagnostic cross-subject queries on units/threads/sequences via MCP to quantify whether they have the same volume/ranking problem
3. Query the `oak-syns` synonyms set to complete the configuration audit

### Phase 2: Fix Documentation and Test Issues

1. Fix the misleading TSDoc on `normaliseTranscriptScores` (line 189 of `rrf-query-helpers.ts`)
2. Fix flagged test issues (delete type-only test, rename file, extract shared stubs)
3. Restore any removed TSDoc (split files if needed for line limits)

### Phase 3: Evaluate Benchmark Results and Decide

1. If benchmarks show improvement on cross-subject AND no regression on per-subject: proceed
2. If regression detected: adjust threshold or fuzziness parameters
3. Decide on `total` semantics (ADR or TSDoc)
4. Decide on per-scope fuzziness and score filtering strategy (with documented rationale)

### Phase 4: Apply Consistent Strategy

1. Apply `AUTO:6,9` to units (if benchmark validates) — same index structure as lessons
2. Keep `AUTO` on threads and sequences with documented rationale
3. Add per-scope score filtering ONLY if benchmarks show a volume problem on that scope, with scope-appropriate thresholds
4. Document all configuration decisions

### Phase 5: Architecture Review and Quality Gates

1. Invoke architecture reviewers on the full change set
2. Run complete quality gate chain
3. Run E2E/smoke tests
