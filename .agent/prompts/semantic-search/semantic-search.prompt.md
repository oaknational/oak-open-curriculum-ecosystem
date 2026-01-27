# Semantic Search — Ground Truth Query Grounding

**Status**: ⚠️ Stage 1b — Query Grounding Required (subject filter fix blocking KS4 science)  
**Current Priority**: Execute known-answer-first process for each subject/key-stage  
**Last Updated**: 2026-01-27

---

## Known Blockers

### Subject Filter Implementation Gap

KS4 science sub-disciplines (physics, chemistry, biology, combined-science) cannot be filtered individually. See [subject-filter-fix-plan.md](../../plans/semantic-search/active/subject-filter-fix-plan.md).

**Impact**: 11 ground truth queries for KS4 science are blocked until this is fixed.

**Solution**: Add SDK-generated subject hierarchy lookup (`SUBJECT_TO_PARENT`). Users specify one subject (e.g., `physics`), system uses smart filtering:
- At KS4: filter on `subject_slug: physics` (specific)
- At other key stages: filter on `subject_parent: science` (parent, since no physics exists)

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
3. **Pick a subject-phase** — start with maths (highest priority)
4. **Execute the process** — mine → identify 5 slugs → construct query → score

---

## Current State

| Subject | Primary | KS3 | KS4 | Total | Status |
|---------|---------|-----|-----|-------|--------|
| maths | 8 | 6 | 10 | 24 | ❌ Query text pending |
| science (broad) | 4 | 4 | — | 8 | ❌ Query text pending |
| physics (KS4) | — | — | 3 | 3 | ⚠️ BLOCKED (filter fix) |
| chemistry (KS4) | — | — | 3 | 3 | ⚠️ BLOCKED (filter fix) |
| biology (KS4) | — | — | 3 | 3 | ⚠️ BLOCKED (filter fix) |
| combined-science (KS4) | — | — | 2 | 2 | ⚠️ BLOCKED (filter fix) |
| english | 4 | 3 | 3 | 10 | ❌ Query text pending |
| Other subjects | 16 | 14 | 10 | 40 | ❌ Query text pending |
| Global (typo/curriculum/future) | — | — | — | 9 | ❌ Query text pending |
| **Total** | **32** | **27** | **31** | **~99** | |

**Legend**: ✅ Complete | ❌ Not yet created | ⚠️ BLOCKED (requires code fix)

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

## Priority Order

1. **Fix subject filter** — Unblock KS4 science queries
2. **Maths** (24 queries) — highest priority, largest content, KS4 complexity
3. **Science (broad)** (8 queries) — high priority, tests subject_parent filter
4. **English** (10 queries) — high priority
5. **KS4 science disciplines** (11 queries) — high priority AFTER filter fix
6. **Medium subjects** — moderate priority
7. **Low subjects** — minimal priority

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

### 2026-01-27: Structure Revised

- Complexity-weighted distribution with KS3/KS4 breakdown
- Science sub-disciplines blocked pending subject filter fix
- Typo-recovery consolidated to 3 global mechanism tests
- Target: ~99 queries
- **Next**: Fix subject filter, then create queries

### 2026-01-26: Ready for Query Creation

- Structure and distribution complete
- Known-answer-first methodology documented
- Expected slugs requirement: 5 per query (minimum 4)
- Cross-unit slug selection allowed
