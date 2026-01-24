---
name: Science Phase 1B Discovery
overview: Fix KS4 terminology (replace GCSE references), then execute fresh Phase 1B discovery for all Science ground truth queries using bulk data and MCP tools to identify best possible expected slugs.
todos:
  - id: fix-gcse
    content: Replace 10 GCSE references with KS4 in ks4/ files
    status: completed
  - id: primary-precise
    content: Phase 1B discovery for 3 primary precise-topic queries
    status: completed
  - id: primary-natural
    content: Phase 1B discovery for 3 primary natural-expression queries
    status: completed
  - id: primary-imprecise
    content: Phase 1B discovery for 3 primary imprecise-input queries
    status: completed
  - id: primary-cross
    content: Phase 1B discovery for 3 primary cross-topic queries
    status: completed
  - id: secondary-precise
    content: Phase 1B discovery for 3 secondary precise-topic queries
    status: completed
  - id: secondary-natural
    content: Phase 1B discovery for 4 secondary natural-expression queries
    status: completed
  - id: secondary-imprecise
    content: Phase 1B discovery for 3 secondary imprecise-input queries
    status: completed
  - id: secondary-cross
    content: Phase 1B discovery for 3 secondary cross-topic queries
    status: completed
  - id: secondary-ks4
    content: Phase 1B discovery for 4 KS4 subject-specific queries
    status: completed
---

# Science Phase 1B Fresh Discovery

## Pre-requisites Fix: GCSE to KS4 Terminology

Replace 10 occurrences of "GCSE" with "KS4" in the ks4/ query files:

- [biology-filter.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/secondary/ks4/biology-filter.query.ts) - 2 occurrences
- [chemistry-filter.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/secondary/ks4/chemistry-filter.query.ts) - 2 occurrences
- [physics-filter.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/secondary/ks4/physics-filter.query.ts) - 2 occurrences
- [combined-science-filter.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/secondary/ks4/combined-science-filter.query.ts) - 2 occurrences
- [index.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/secondary/ks4/index.ts) - 2 occurrences

---

## Phase 1B Scope

### Queries Requiring Discovery

**Science Primary (12 queries)** - `bulk-downloads/science-primary.json`:

- 3 precise-topic queries
- 3 natural-expression queries  
- 3 imprecise-input queries
- 3 cross-topic queries

**Science Secondary (17 queries)** - `bulk-downloads/science-secondary.json`:

- 3 precise-topic queries
- 4 natural-expression queries (including new thermal query)
- 3 imprecise-input queries
- 3 cross-topic queries
- 4 KS4 subject-specific queries (biology, chemistry, physics, combined-science)

**Total: 29 queries**

---

## Phase 1B Execution Process

For each query, follow the protocol from [ground-truth-session-template.md](/.agent/plans/semantic-search/templates/ground-truth-session-template.md):

### Step 1B.1: Search Bulk Data

```bash
# Search lesson titles
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | 
  select(.lessonTitle | test("TERM1|TERM2"; "i")) | 
  "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/science-PHASE.json

# Search unit titles  
jq -r '.sequence[] | select(.unitTitle | test("TERM"; "i")) | 
  "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' bulk-downloads/science-PHASE.json

# List all units for non-obvious matches
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' bulk-downloads/science-PHASE.json
```

Cast wide net with 3+ search terms per query. Collect 10+ candidate slugs.

### Step 1B.2: Get MCP Summaries

Call `get-lessons-summary` for 5-10 candidates per query. Record:

- Keywords
- Key Learning quotes
- Misconceptions (if present)

### Step 1B.3: Get Unit Context

Call `get-units-summary` to understand lesson ordering within units. Note foundational vs. capstone lessons.

### Step 1B.4: Analyse and Rank

For each candidate, assess key learning against query intent:

- STRONG match = directly answers query
- MODERATE match = related and useful
- WEAK match = tangentially related

### Step 1B.5: COMMIT Rankings

Commit top 3-5 slugs with relevance scores (1-3) before seeing any search results or existing expected slugs.

---

## Execution Order

Process queries in batches by phase/category:

1. **Primary precise-topic** (3 queries)
2. **Primary natural-expression** (3 queries)
3. **Primary imprecise-input** (3 queries)
4. **Primary cross-topic** (3 queries)
5. **Secondary precise-topic** (3 queries)
6. **Secondary natural-expression** (4 queries)
7. **Secondary imprecise-input** (3 queries)
8. **Secondary cross-topic** (3 queries)
9. **Secondary KS4 subject-specific** (4 queries)

---

## Output

For each query, update the corresponding `.expected.ts` file with discovered slugs and relevance scores based on COMMIT rankings.
