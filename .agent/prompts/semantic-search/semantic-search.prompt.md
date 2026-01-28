# Semantic Search — Ground Truth Query Grounding

**Status**: 🔄 Stage 1b — Query Grounding (KS4 science unblocked)  
**Current Priority**: Execute known-answer-first process for each subject/key-stage  
**Last Updated**: 2026-01-27

---

## No Blockers

All blockers have been resolved. KS4 science sub-disciplines (physics, chemistry, biology, combined-science) can now be filtered individually.

**What was fixed** (2026-01-27):
- SDK-generated subject hierarchy: `SUBJECT_TO_PARENT`, `isKs4ScienceVariant()` — [ADR-105](../../../docs/architecture/architectural-decisions/105-sdk-generated-search-constants.md)
- Smart filtering at query time — [ADR-101](../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md)
- Re-indexed with correct `subject_slug` and `subject_parent` values

---

## The User: Professional Teachers

ALL users are professional teachers. Every query should be constructed with a professional teacher persona in mind.

---

## The Methodology: Known-Answer-First

**This is mandatory. There is no alternative.**

```text
WRONG:  Invent query → hope curriculum has matches → find whatever slugs exist
        └─ Result: 25% zero-hit rate (Spanish Session 24)

CORRECT: Mine curriculum → identify target lessons → construct query to find them
         └─ Result: Every query grounded, every slug justified
```

---

## The Process (Execute This Exactly)

### Step 1: Mine Curriculum

```bash
cd apps/oak-open-curriculum-semantic-search

# List all units with lesson counts
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/{subject}-{phase}.json

# Find rich topic areas (target: 5+ lessons)
jq -r '.sequence[] | select(.unitLessons | length >= 5) | 
  "\(.unitTitle): \(.unitLessons | length) lessons"' bulk-downloads/{subject}-{phase}.json
```

### Step 2: Identify 5 Target Lessons (Expected Slugs)

```bash
# Sample lessons from topic area
jq -r '.sequence[] | select(.unitSlug == "TARGET-UNIT") | .unitLessons[] | 
  "\(.lessonSlug): \(.lessonTitle)"' bulk-downloads/{subject}-{phase}.json

# Get key learning for each candidate
# MCP: get-lessons-summary lesson="lesson-slug"
```

**Select 5 lessons** that represent the topic well. Slugs can come from different units.

### Step 3: Construct Query

Ask: **"What would a teacher type to find these 5 lessons?"**

| Rule | Requirement |
|------|-------------|
| Natural phrasing | "how bones and muscles work", not "bones muscles body" |
| Topic-focused | Topics, not advice ("fractions", not "how to teach fractions") |
| No meta-phrases | No "lessons on", "teaching about" |
| No redundant subject | Don't say "French" when filtered to French |

### Step 4: Assign Graded Relevance

For each of the 5 slugs:

| Score | Criteria | Evidence Required |
|-------|----------|-------------------|
| **3** | Key learning directly addresses query | Quote the text |
| **2** | Related but different angle/depth | Quote the text |
| **1** | Touches topic peripherally | Quote the text |

**At least one must be score=3.**

---

## Expected Slugs Requirement

| Requirement | Value |
|-------------|-------|
| **Slugs per query** | **5** |
| **Absolute minimum** | **4** (only if curriculum genuinely limited) |
| **Cross-unit allowed** | Yes — slugs do NOT have to be from same unit |
| **Score=3 required** | At least one per query |
| **Justification required** | Every score backed by key learning evidence |

### Why 5 Slugs?

With fewer slugs, metrics become noisy or trivial:

- **MRR**: Needs multiple "right answers" to average meaningfully
- **NDCG@10**: Needs graded relevance across results
- **P@3**: With 2 slugs, 1/3 match is 50% — trivial
- **R@10**: With 2 slugs, finding both is trivial 100%

---

## Session Entry

1. **Read this prompt** — the methodology is here
2. **Read the plan** — `@.agent/plans/semantic-search/active/ground-truth-redesign-plan.md`
3. **Pick a subject-phase** — start with maths (largest content surface, highest complexity)
4. **Execute the process** — mine → identify 5 slugs → construct query → score

---

## Current State

| Subject | Primary | KS3 | KS4 | Total | Status |
|---------|---------|-----|-----|-------|--------|
| maths | 8 | 6 | 10 | 24 | ❌ Query text pending |
| science (broad) | 4 | 4 | — | 8 | ❌ Query text pending |
| physics (KS4) | — | — | 3 | 3 | ❌ Query text pending |
| chemistry (KS4) | — | — | 3 | 3 | ❌ Query text pending |
| biology (KS4) | — | — | 3 | 3 | ❌ Query text pending |
| combined-science (KS4) | — | — | 2 | 2 | ❌ Query text pending |
| english | 4 | 3 | 3 | 10 | ❌ Query text pending |
| Other subjects | 16 | 14 | 10 | 40 | ❌ Query text pending |
| Global (typo/curriculum/future) | — | — | — | 9 | ❌ Query text pending |
| **Total** | **32** | **27** | **31** | **~99** | |

**Legend**: ✅ Complete | ❌ Not yet created

---

## Output Format

For each query, produce the following and **update `queries-redesigned.md`** with the grounded query:

```markdown
### [subject]/[phase]: [topic]

**Query**: "[the natural-phrasing query]"

**Expected Slugs**:

| Slug | Score | Justification |
|------|-------|---------------|
| `lesson-slug-1` | 3 | Key learning: "[quote]" |
| `lesson-slug-2` | 3 | Key learning: "[quote]" |
| `lesson-slug-3` | 2 | Related: "[quote]" |
| `lesson-slug-4` | 2 | Related: "[quote]" |
| `lesson-slug-5` | 1 | Tangential: "[quote]" |

**Category**: natural-query / exact-term / typo-recovery / curriculum-connection
```

---

## Guiding Principles

### We Test OUR Value, Not Elasticsearch

| We Test | We Don't Test |
|---------|---------------|
| Does search help teachers? | ES stemming (it works) |
| Natural teacher queries | ES disambiguation (filtering handles it) |
| Typo recovery (handful) | ES phrase matching (it works) |

### We Enable Teachers, Not Police Them

Teachers can search for anything. No judgment.

### Metadata Is the Default

ALL search works on metadata. Transcripts are supplementary.

### Ground Everything in Bulk Data

If it's not in the data, it doesn't exist. Mine it. Verify it.

---

## Bulk Data Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# List all subject-phase files
ls bulk-downloads/*.json

# Count lessons in a file
jq '.lessons | length' bulk-downloads/{subject}-{phase}.json

# List all units
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle)"' bulk-downloads/{subject}-{phase}.json

# Search lesson titles
jq -r '.lessons[] | select(.lessonTitle | test("TERM"; "i")) | 
  "\(.lessonSlug): \(.lessonTitle)"' bulk-downloads/{subject}-{phase}.json

# Lessons in a specific unit
jq -r '.sequence[] | select(.unitSlug == "UNIT") | .unitLessons[] | 
  "\(.lessonSlug): \(.lessonTitle)"' bulk-downloads/{subject}-{phase}.json
```

## MCP Tools

| Tool | Purpose |
|------|---------|
| `get-lessons-summary` | Get keywords and key learning for a lesson |
| `get-units-summary` | Get unit structure and lesson ordering |
| `get-help` | Reference for all available tools |

---

## Execution Order

**All subjects are critical.** We start with maths, then science — not because they matter more than other subjects, but because:

- **Largest content surface** — more lessons, more units to stress-test
- **Highest KS4 complexity** — higher-tier, separate disciplines
- **Most stakeholder attention** — these subjects are watched closely

| Order | Subject(s) | Queries | Rationale |
|-------|-----------|---------|-----------|
| 1 | Maths | 24 | Largest surface, KS4 complexity |
| 2 | Science (broad + KS4 disciplines) | 19 | Tests both filter types |
| 3 | English | 10 | Core subject |
| 4 | All other subjects | 46 | Complete coverage |

---

## Typo Recovery

Typo-recovery tests a **mechanism** (fuzzy matching), not subject-specific behaviour. 

- 3 global proofs are sufficient
- Testing per-subject would be wasteful
- Fuzzy matching either works or it doesn't — one domain proves it for all

---

## Anti-Patterns (Do NOT Do These)

| Anti-Pattern | Why It's Wrong |
|--------------|----------------|
| Invent query first, then search for slugs | Risks zero-hit queries |
| Accept 2-3 slugs "because that's all there is" | Didn't search hard enough |
| Use slugs from one unit only | Missed cross-unit candidates |
| Skip key learning verification | Scores become arbitrary |
| Use clipped term lists for natural-query | Not how teachers search |
| Add "teaching about" or "lessons on" | Meta-phrases add no value |
| Create typo-recovery per subject | Mechanism test, not content test |

---

## Session Log

### 2026-01-27: Subject Filter Fixed — All Queries Unblocked

- Subject filter fix implemented (ADR-101, ADR-105)
- SDK-generated `SUBJECT_TO_PARENT`, `isKs4ScienceVariant()` exported
- Re-indexed with correct `subject_slug` and `subject_parent` values
- All 11 KS4 science queries now available
- **Next**: Create queries starting with maths (24 queries)

### 2026-01-27: Structure Revised

- Complexity-weighted distribution with KS3/KS4 breakdown
- Typo-recovery consolidated to 3 global mechanism tests
- Target: ~99 queries

### 2026-01-26: Ready for Query Creation

- Structure and distribution complete
- Known-answer-first methodology documented
- Expected slugs requirement: 5 per query (minimum 4)
- Cross-unit slug selection allowed
