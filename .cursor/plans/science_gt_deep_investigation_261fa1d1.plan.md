---
name: Science GT Deep Investigation
overview: "Deep investigation of 9 Science ground truth issues: evaluating query validity, exhaustive curriculum exploration via bulk data and MCP tools, and examining search infrastructure (synonyms, BM25 config, RRF weighting) to determine root causes and correct fixes."
todos:
  - id: phase0-synonyms
    content: "Phase 0.1: Check synonym coverage for gravity, melt, rust, respiration, carbon, ionic, energy terms"
    status: completed
  - id: phase0-bm25
    content: "Phase 0.2: Review BM25 min_match=75% impact on 2-term queries like 'electrisity and magnits'"
    status: completed
  - id: phase0-rrf
    content: "Phase 0.3: Review RRF weighting for structure-only lessons"
    status: completed
  - id: q1-investigate
    content: "Query 1 (PRIMARY natural-expression-2): 'why do things fall down' — full investigation"
    status: completed
  - id: q2-investigate
    content: "Query 2 (PRIMARY natural-expression-3): 'what makes ice turn into water' — full investigation"
    status: completed
  - id: q3-investigate
    content: "Query 3 (PRIMARY imprecise-input-2): 'electrisity and magnits' — full investigation"
    status: completed
  - id: q4-investigate
    content: "Query 4 (SECONDARY natural-expression-2): 'why does metal go rusty' — full investigation"
    status: completed
  - id: q5-investigate
    content: "Query 5 (SECONDARY natural-expression-3): 'why do some things feel hotter than others' — full investigation"
    status: completed
  - id: q6-investigate
    content: "Query 6 (SECONDARY imprecise-input-1): 'resperation in humans' — full investigation"
    status: completed
  - id: q7-investigate
    content: "Query 7 (KS4 biology-filter): 'carbon cycle in ecosystems' — full investigation"
    status: completed
  - id: q8-investigate
    content: "Query 8 (KS4 chemistry-filter): 'ionic bonding electron transfer' — CRITICAL: investigate GT including covalent slugs for ionic query"
    status: completed
  - id: q9-investigate
    content: "Query 9 (KS4 combined-science-filter): 'energy transfers and efficiency' — full investigation"
    status: completed
  - id: final-benchmark
    content: Run final benchmark after all corrections and document outcomes
    status: completed
---

# Science Ground Truth Deep Investigation (9 Queries)

## Scope

Nine queries with low metrics need deep investigation. For each one, we will NOT assume the problem is search — it may be GT design, synonym gaps, or retriever configuration.

### Queries to Investigate

**PRIMARY (3):**

1. `natural-expression-2`: "why do things fall down" (R@10=0.333)
2. `natural-expression-3`: "what makes ice turn into water" (MRR=0.250)
3. `imprecise-input-2`: "electrisity and magnits" (MRR=0.200)

**SECONDARY (6):**

1. `natural-expression-2`: "why does metal go rusty" (MRR=0.333)
2. `natural-expression-3`: "why do some things feel hotter than others" (R@10=0.250)
3. `imprecise-input-1`: "resperation in humans" (R@10=0.333)
4. `ks4/biology-filter`: "carbon cycle in ecosystems" (R@10=0.333)
5. `ks4/chemistry-filter`: "ionic bonding electron transfer" (R@10=0.333)
6. `ks4/combined-science-filter`: "energy transfers and efficiency" (MRR=0.333)

---

## Phase 0: Infrastructure Analysis (Before Individual Queries)

### 0.1 Synonym Coverage Check

Check if Science-specific synonyms exist and are complete:

```bash
# Check for science synonyms in SDK
cat packages/sdks/oak-curriculum-sdk/src/mcp/synonym-export.ts | head -100

# Search for science-related synonym definitions
rg -A5 "gravity|fall|melt|rust|respir|carbon|ionic|energy" packages/sdks/oak-curriculum-sdk/
```

**Key terms to check for synonyms:**

- "fall down" ↔ "gravity"
- "ice turn into water" ↔ "melting", "state change"
- "electricity" ↔ "electrisity" (typo)
- "magnets" ↔ "magnits" (typo)
- "rusty" ↔ "oxidation", "corrosion"
- "hotter" ↔ "thermal", "temperature", "conductivity"
- "resperation" ↔ "respiration"

### 0.2 BM25 Configuration Review

Current config in [bm25-config.ts](apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/bm25-config.ts):

- Fuzziness: `AUTO` for lessons (handles typos like "electrisity")
- Minimum should match: `75%` (may exclude 2-term queries if one fails)

**Investigation question**: For "electrisity and magnits" (2 terms), if one term fails fuzzy matching, does `75%` min match cause zero results?

### 0.3 RRF Configuration Review

RRF k-factor and normalisation in [rrf-query-helpers.ts](apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts).

**Check**: Are lessons without content (structure-only) penalised unfairly?

---

## Per-Query Investigation Protocol (DEEPER than template)

For each of the 9 queries, execute ALL of the following:

### Step A: Query Validity Assessment

1. **State the capability being tested** — Is this the right category?
2. **Analyse the query vocabulary** — Is it genuinely informal/imprecise?
3. **Check curriculum alignment** — Does the expected content exist?
4. **Recommendation** — Keep, revise, or recategorise

### Step B: Exhaustive Curriculum Exploration

**B.1: Bulk Data Search (multiple strategies)**

```bash
cd apps/oak-open-curriculum-semantic-search

# Strategy 1: Direct keyword search in titles
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | 
  select(.lessonTitle | test("KEYWORD"; "i")) | 
  "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/science-PHASE.json

# Strategy 2: Unit-level search (find units, then list ALL lessons)
jq -r '.sequence[] | select(.unitTitle | test("TOPIC"; "i")) | 
  "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' bulk-downloads/science-PHASE.json

# Strategy 3: Search in keywords field if available
jq -r '.sequence[] | .unitLessons[] | 
  select(.keywords | test("TERM"; "i")) | .lessonSlug' bulk-downloads/science-PHASE.json
```

**B.2: MCP Tool Exploration (FULL range)**

- `get-lessons-summary` — Keywords + key learning for 10+ candidates
- `get-units-summary` — Unit structure, lesson ordering
- `get-key-stages-subject-lessons` — All lessons in a key stage/subject
- `get-search-lessons` — Use the actual search to find candidates
- `get-search-transcripts` — Find content matches in transcripts

**B.3: Content Match Analysis (DEEP)**

For each candidate, get the full lesson summary and analyse:

- Does the **key learning** directly address the query?
- Does the **transcript content** contain relevant vocabulary?
- Is this lesson **early** (foundational) or **late** (advanced) in the unit?

### Step C: Search Infrastructure Investigation

**C.1: Run explain query** to understand why ranking failed:

```bash
# Use ES explain API if available via tests
pnpm test:explain -s science -p PHASE -c CATEGORY --slug specific-slug
```

**C.2: Check synonym expansion** — Does the query expand correctly?

**C.3: Check retriever contributions** — Which retriever (BM25/ELSER) found/missed content?

### Step D: Root Cause Determination

For each query, determine ONE of:

1. **GT Issue**: Expected slugs are wrong — curriculum analysis found better matches
2. **Query Design Issue**: Query doesn't test the claimed capability — revise query
3. **Synonym Gap**: Missing synonym prevents matching — add synonym
4. **Retriever Config Issue**: BM25/ELSER settings prevent matching — config change needed
5. **True Search Gap**: Correct content exists, search found it, but ranked poorly — search improvement needed

### Step E: Resolution

- If GT Issue → Update `.expected.ts` with correct slugs
- If Query Design Issue → Update `.query.ts` with revised query
- If Synonym Gap → Add synonym to SDK synonym definitions
- If Retriever Config Issue → Document and flag for search optimisation
- If True Search Gap → Document as known limitation

---

## Query-by-Query Investigation Plan

### Query 1: PRIMARY natural-expression-2

**Query**: "why do things fall down"

**Issue**: R@10=0.333, expected slugs `air-resistance-do-and-review` and `pushes-and-pulls` not found

**Investigation focus**:

- Is "fall down" = gravity (physics) or just general forces?
- Are expected slugs about gravity, or about other forces?
- Search found `introduction-to-gravity` at #1 — is this BETTER than expected?

### Query 2: PRIMARY natural-expression-3

**Query**: "what makes ice turn into water"

**Issue**: MRR=0.250, search ranked water-cycle (#1) above melting (#4)

**Investigation focus**:

- Is the query ambiguous? (ice→water could be in water cycle context)
- Should expected slugs include water cycle content?
- Or is water-cycle genuinely wrong and search is failing?

### Query 3: PRIMARY imprecise-input-2

**Query**: "electrisity and magnits"

**Issue**: MRR=0.200, expected `electrical-appliances` and `magnetic-and-non-magnetic-materials` not found

**Investigation focus**:

- Does fuzzy matching handle "electrisity"→"electricity"?
- With 2 terms and 75% min_match, does failure on one = no results?
- Are expected slugs actually about electricity AND magnets together?

### Query 4: SECONDARY natural-expression-2

**Query**: "why does metal go rusty"

**Issue**: MRR=0.333, all expected found but ranked #3, #4, #10

**Investigation focus**:

- What ranked #1, #2 above expected? Are they actually relevant?
- Is "rusty" vocabulary bridging to "oxidation"/"corrosion" failing?
- Synonym check: "rust" → "oxidation"?

### Query 5: SECONDARY natural-expression-3

**Query**: "why do some things feel hotter than others"

**Issue**: R@10=0.250, only 1 of 4 expected slugs found

**Investigation focus**:

- Query spans physics AND biology — are expected slugs right?
- Are expected slugs about "thermal conductivity" (physics) or "thermoreceptors" (biology)?
- Does the curriculum have content matching this everyday question?

### Query 6: SECONDARY imprecise-input-1

**Query**: "resperation in humans"

**Issue**: R@10=0.333, expected `aerobic-cellular-respiration` and `cellular-respiration` not found

**Investigation focus**:

- Does fuzzy matching handle "resperation"→"respiration"?
- Are expected slugs the BEST matches? (search found other respiration lessons)
- Are more specific lessons (anaerobic, human respiration) better matches?

### Query 7: KS4 biology-filter

**Query**: "carbon cycle in ecosystems"

**Issue**: R@10=0.333, missing `the-carbon-cycle` and `deforestation-affects-the-carbon-and-water-cycles`

**Investigation focus**:

- Do these slugs exist in secondary science bulk data?
- Is `material-cycles-the-carbon-cycle` (found at #1) actually the best match?
- Are expected slugs from different key stages?

### Query 8: KS4 chemistry-filter

**Query**: "ionic bonding electron transfer"

**Issue**: R@10=0.333, expected includes `forming-covalent-bonds` and `bonding-models`

**Investigation focus**:

- **Critical**: Why are COVALENT lessons expected for IONIC query? This looks like GT error.
- What are the actual ionic bonding lessons?
- Search found `forming-ions-for-ionic-bonding` at #2 — is GT wrong?

### Query 9: KS4 combined-science-filter

**Query**: "energy transfers and efficiency"

**Issue**: MRR=0.333, expected at #3, missing `transferring-energy` and `heating-different-substances`

**Investigation focus**:

- Search found multiple efficiency lessons at #1, #2 — are these BETTER?
- Do expected slugs exist in the bulk data?
- Is "energy transfers" too broad for specific efficiency lessons?

---

## Documentation Requirements

For each query, document:

1. **Query validity assessment** — Is query design correct?
2. **Best curriculum matches** — From bulk + MCP exploration
3. **Root cause classification** — One of 5 categories above
4. **Action taken** — What was updated and why

---

## Success Criteria

- All 9 queries investigated with documented root cause
- GT corrections made where warranted (with justification)
- Synonym gaps identified and logged (if any)
- Search infrastructure issues flagged for future work (if any)
- Final benchmark showing improved or explained metrics
