# Ground Truth Redesign Plan

**Created**: 2026-01-25  
**Revised**: 2026-01-27  
**Status**: ⚠️ Stage 1b Required — Query Grounding (KS4 science unblocked)  
**Objective**: Create ground truths that answer: "Does search help teachers find what they need?"

---

## The Core Question

> "In a full range of likely search scenarios for professional teachers, is our system providing the value they need?"

Every design decision flows from this question. ALL users are professional teachers.

---

## Known Blockers

### Subject Filter Implementation Gap — ✅ RESOLVED

~~KS4 science sub-disciplines (physics, chemistry, biology, combined-science) cannot be filtered individually.~~

**Fixed**: 2026-01-27. The subject filter is now correctly implemented per ADR-101:

- Physics lessons: `subject_slug: 'physics'`, `subject_parent: 'science'`
- Chemistry lessons: `subject_slug: 'chemistry'`, `subject_parent: 'science'`
- etc.

**Verification**: ES queries confirm 176 physics, 83 chemistry, 39 biology, 301 combined-science lessons correctly indexed.

**All 11 KS4 science queries are now unblocked.**

See: [subject-filter-fix-plan.md](subject-filter-fix-plan.md) (completed), [ADR-101](../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md), [ADR-105](../../../docs/architecture/architectural-decisions/105-sdk-generated-search-constants.md)

### Solution: SDK Subject Hierarchy Lookup

The fix involves adding a generated lookup table in the SDK:

```typescript
// Generated at SDK compile time
export const SUBJECT_TO_PARENT = {
  'physics': 'science',
  'chemistry': 'science',
  'biology': 'science',
  'combined-science': 'science',
  'science': 'science',
  'maths': 'maths',
  // ... all 21 subjects (17 canonical + 4 KS4 science variants)
} as const;
```

**Key Behaviour**:
- Users specify ONE subject (e.g., `physics` or `science`)
- Both are valid at any key stage
- At KS4: `physics` filters on `subject_slug: physics` (specific)
- At other key stages: `physics` filters on `subject_parent: science` (no physics content exists)
- `science` always filters on `subject_parent: science` (broad)

---

## The Methodology: Known-Answer-First

**This is the only valid approach.**

### The Process

```text
┌─────────────────────────────────────────────────────────────────┐
│                   KNOWN-ANSWER-FIRST PROCESS                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. MINE CURRICULUM                                             │
│     └─ Explore bulk data to find rich topic areas               │
│     └─ Target areas with 5+ lessons                             │
│     └─ Get MCP summaries to understand key learning             │
│                                                                 │
│  2. IDENTIFY TARGET LESSONS (the "known answers")               │
│     └─ Select 5 lessons that represent the topic well           │
│     └─ These become expected slugs                              │
│     └─ Slugs can come from different units                      │
│                                                                 │
│  3. CONSTRUCT QUERY                                             │
│     └─ Ask: "What would a teacher type to find these lessons?"  │
│     └─ Natural phrasing, not clipped term lists                 │
│     └─ Topic-focused, not advice-seeking                        │
│                                                                 │
│  4. ASSIGN GRADED RELEVANCE                                     │
│     └─ Score each of the 5 slugs: 3, 2, or 1                    │
│     └─ At least one must be score=3                             │
│     └─ Justify each score with key learning evidence            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Expected Slugs Requirements

### The Standard: 5 Slugs Per Query

| Requirement | Value | Rationale |
|-------------|-------|-----------|
| **Target slugs per query** | **5** | Enables meaningful metric calculation |
| **Absolute minimum** | **4** | Only when curriculum coverage is genuinely limited |
| **At least one score=3** | Required | Defines clear "right answer" |
| **Graded relevance** | Required | Mix of 3, 2, 1 for ranking quality |
| **Cross-unit allowed** | Yes | Slugs do NOT have to be in the same unit |

### Why 5 Slugs?

| Metric | With 2-3 Slugs | With 5 Slugs |
|--------|----------------|--------------|
| **MRR** | Noisy — small sample | Stable — clear signal |
| **NDCG@10** | Weak grading signal | Full ranking evaluation |
| **P@3** | Trivial — 1/3 matches | Meaningful precision test |
| **R@10** | Often 100% trivially | Tests true recall depth |

### Relevance Scoring

| Score | Meaning | Criteria |
|-------|---------|----------|
| **3** | Direct match | Key learning directly addresses query intent |
| **2** | Related | Covers topic from different angle or depth |
| **1** | Tangential | Touches on topic but not primary focus |

**Every score must be justified** with evidence from key learning text.

---

## Guiding Principles

### 1. We Test OUR Value, Not Elasticsearch

| We Test | We Don't Test (ES Handles) |
|---------|---------------------------|
| Does search help teachers find content? | Stemming / morphological variation |
| Natural teacher queries | Disambiguation (filtering handles) |
| Typo recovery (handful of proofs) | Phrase matching internals |

### 2. We Enable Teachers, Not Police Them

Teachers can search for anything. We don't judge what's "appropriate".

### 3. Metadata Is the Default

ALL search works on metadata. Transcripts are supplementary. Search MUST work for all subjects including MFL and PE where transcripts are sparse.

### 4. Ground Everything in Bulk Data

Don't assume curriculum structure. The data is what matters. Mine it. Verify it. Trust it.

---

## Query Design Rules

### Natural Phrasing (MANDATORY for natural-query category)

| Bad (Clipped List) | Good (Natural Phrasing) |
|-------------------|------------------------|
| "bones muscles body movement" | "how bones and muscles move the body" |
| "fractions denominators adding" | "adding fractions with different denominators" |
| "electricity circuits bulbs" | "making simple circuits with bulbs" |

### No Meta-Phrases

| Bad | Good |
|-----|------|
| "teaching about fractions" | "equivalent fractions" |
| "lessons on photosynthesis" | "how photosynthesis works" |
| "how to teach poetry" | "analysing poetry for language" |

### No Redundant Subject Terms

When filtered to a subject, don't include the subject name in the query.

| Bad (filtered to French) | Good (filtered to French) |
|-------------------------|--------------------------|
| "French negation ne pas" | "negation ne pas" |
| "French greetings" | "greetings and introductions" |

### Topic-Focused, Not Advice-Seeking

| Bad (Advice) | Good (Topic) |
|--------------|--------------|
| "how to avoid getting hacked" | "phishing scams and social engineering" |
| "tips for teaching fractions" | "understanding fractions as parts" |

---

## Category Structure

| Category | Purpose | Count | Slug Requirement | Notes |
|----------|---------|-------|------------------|-------|
| `natural-query` | How teachers actually search | ~80 | 5 slugs | Primary value test |
| `exact-term` | Proves BM25 returns exact terms | ~6 | 5 slugs | Subject-representative |
| `typo-recovery` | Proves fuzzy matching works | ~3 | 5 slugs | **Mechanism test — NOT per-subject** |
| `curriculum-connection` | Genuine topic pairings | ~4 | 5 slugs | Cross-topic intersections |
| `future-intent` | Features not yet built | ~2 | N/A | Excluded from stats |

**Typo-recovery rationale**: This tests a mechanism (fuzzy matching), not subject-specific behaviour. 2-3 global proofs are sufficient; one per subject would be wasteful.

---

## Query Distribution by Content Complexity

**All subjects are critical.** Query counts reflect content complexity and surface area, NOT subject importance.

Maths and science have more queries because:

- Largest content surface (more lessons, more units)
- Highest KS4 complexity (higher-tier, separate disciplines)
- Most stakeholder attention (these subjects are watched closely)

We START with maths, then science — not because they matter more, but because they stress-test the system most effectively.

### Distribution by Subject

| Subject/Filter | Primary | KS3 | KS4 | Total | Notes |
|----------------|---------|-----|-----|-------|-------|
| maths | 8 | 6 | 10 | 24 | KS4: higher-tier, circle theorems, vectors |
| science (broad) | 4 | 4 | — | 8 | Uses `subject_parent` filter |
| physics (KS4) | — | — | 3 | 3 | Uses `subject_slug` filter |
| chemistry (KS4) | — | — | 3 | 3 | Uses `subject_slug` filter |
| biology (KS4) | — | — | 3 | 3 | Uses `subject_slug` filter |
| combined-science (KS4) | — | — | 2 | 2 | Uses `subject_slug` filter |
| english | 4 | 3 | 3 | 10 | |
| history | 2 | 2 | 1 | 5 | |
| geography | 2 | 2 | 1 | 5 | |
| computing | 2 | 2 | 1 | 5 | |
| PE | 2 | 1 | — | 3 | |
| RE | 2 | 1 | — | 3 | |
| french | 1 | 1 | 1 | 3 | |
| german | — | 1 | 1 | 2 | |
| spanish | 1 | — | 1 | 2 | |
| citizenship | — | 1 | 1 | 2 | |
| art | 1 | 1 | — | 2 | |
| music | 1 | 1 | — | 2 | |
| design-technology | 1 | 1 | — | 2 | |
| cooking-nutrition | 1 | — | — | 1 | |
| typo-recovery | — | — | — | 3 | Global mechanism tests |
| curriculum-connection | — | — | — | 4 | Cross-topic |
| future-intent | — | — | — | 2 | Excluded from stats |
| **Total** | **32** | **27** | **31** | **~99** | |

**Total target**: ~99 queries × 5 slugs each = ~495 expected slugs

---

## Staged Execution

### Stage 1: Structure ✅ COMPLETE

- [x] Category naming aligned
- [x] Content-weighted distribution set
- [x] Session template updated
- [x] Documentation aligned

### Stage 1b: Query Grounding ⚠️ CURRENT STAGE

For each subject-phase, execute the known-answer-first process:

```bash
cd apps/oak-open-curriculum-semantic-search

# 1. Explore curriculum structure
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/{subject}-{phase}.json

# 2. Find rich topic areas
jq -r '.sequence[] | select(.unitLessons | length >= 5) | 
  "\(.unitTitle): \(.unitLessons | length) lessons"' bulk-downloads/{subject}-{phase}.json

# 3. Sample lessons from rich units
jq -r '.sequence[] | select(.unitSlug == "TARGET-UNIT") | .unitLessons[] | 
  "\(.lessonSlug): \(.lessonTitle)"' bulk-downloads/{subject}-{phase}.json

# 4. Get MCP summaries
# Call: get-lessons-summary lesson="lesson-slug"
# Call: get-units-summary unit="unit-slug"
```

**Output per query**:

1. Query text (natural phrasing)
2. 5 expected slugs with scores (3/2/1)
3. Justification for each score (key learning evidence)

### Stage 2: Implementation

Create code files per split architecture:

- `*.query.ts` — Query definition
- `*.expected.ts` — Expected slugs with relevance scores

### Stage 3: Validation

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --all --verbose
```

---

## Current State

### queries-redesigned.md

| Aspect | Status |
|--------|--------|
| Structure | ✅ Ready (subject filter fixed 2026-01-27) |
| Distribution | ✅ Complexity-weighted with KS3/KS4 breakdown |
| Categories | ✅ Aligned |
| Query slots | ✅ Defined with search challenges |
| Query text | ❌ Not yet created |
| Expected slugs | ❌ Not started |

### Blockers

| Blocker | Queries Affected | Status |
|---------|------------------|--------|
| ~~Subject filter normalisation~~ | 11 KS4 science queries | ✅ Fixed 2026-01-27 |

### What Needs Doing

1. ~~**Fix subject filter**~~ — ✅ Complete (see ADR-101, ADR-105)
2. **Mine bulk data** — For each of the ~99 query slots:
   - Find rich topic area
   - Identify 5 target lessons (expected slugs)
   - Construct query that would find those lessons
   - Assign graded relevance with justifications
3. **Implement in code** — Create `*.query.ts` and `*.expected.ts` files

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| **Subject filter fixed** | Physics/chemistry/biology/combined-science can be filtered individually |
| **All queries grounded** | Every query derived from bulk data mining |
| **5 expected slugs each** | 5 per query (minimum 4 if curriculum limited) |
| **Graded relevance** | At least one score=3, mix of 3/2/1 |
| **Justified scores** | Every score backed by key learning evidence |
| **Natural phrasing** | No clipped term lists in natural-query |
| **Total ~99 queries** | Quality over quantity |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [GROUND-TRUTH-GUIDE.md](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles, COMMIT protocol |
| [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | Metric definitions |
| [Session Template](templates/ground-truth-session-template.md) | Query design workflow |
| [queries-redesigned.md](../../../apps/oak-open-curriculum-semantic-search/docs/ground-truths/queries-redesigned.md) | Current query list |
