---
name: Science GT Phase 1B Remediation
overview: Redo SECONDARY imprecise-input queries II-2 ("photosythesis in plants") and II-3 ("electromagnatic waves and spectrum") with proper fresh discovery, following the ground-truth-session-template.md protocol exactly.
todos:
  - id: ii2-fresh-bulk
    content: "II-2: Search science-secondary.json for photosynthesis-related lessons (10+ candidates)"
    status: completed
  - id: ii2-fresh-mcp
    content: "II-2: Get fresh MCP summaries for 5-10 candidates (NOT reused from NE-1)"
    status: completed
  - id: ii2-unit-context
    content: "II-2: Document unit context for relevant units"
    status: completed
  - id: ii2-analysis
    content: "II-2: Analyse all candidates with STRONG/MODERATE/WEAK/NONE format"
    status: completed
  - id: ii2-commit
    content: "II-2: COMMIT fresh rankings with scores and justifications"
    status: completed
  - id: ii3-fresh-bulk
    content: "II-3: Search science-secondary.json for electromagnetic-related lessons (10+ candidates)"
    status: completed
  - id: ii3-fresh-mcp
    content: "II-3: Get fresh MCP summaries for 5-10 candidates (NOT reused from PT-3)"
    status: completed
  - id: ii3-unit-context
    content: "II-3: Document unit context for relevant units"
    status: completed
  - id: ii3-analysis
    content: "II-3: Analyse all candidates with STRONG/MODERATE/WEAK/NONE format"
    status: completed
  - id: ii3-commit
    content: "II-3: COMMIT fresh rankings with scores and justifications"
    status: completed
  - id: verification
    content: Verify both queries have template-compliant evidence, no shortcuts taken
    status: completed
---

# Science GT Phase 1B Remediation

## Problem Statement

During Phase 1B execution, two SECONDARY imprecise-input queries were completed using shortcuts:

- **II-2 ("photosythesis in plants")**: Reused MCP summaries from NE-1 ("how do plants make their own food")
- **II-3 ("electromagnatic waves and spectrum")**: Reused MCP summaries from PT-3 ("electromagnetic spectrum waves")

This violates the template requirement for **FRESH exploration per query** and undermines the purpose of imprecise-input testing (testing typo/misspelling recovery).

---

## Remediation Scope

### Queries Requiring Fresh Discovery

| Query ID | Misspelled Query | Correct Term | Issue |

|----------|------------------|--------------|-------|

| II-2 | "photosythesis in plants" | photosynthesis | Reused NE-1 work |

| II-3 | "electromagnatic waves and spectrum" | electromagnetic | Reused PT-3 work |

---

## Remediation Protocol

For EACH query, execute Steps 1B.1 through 1B.5 from scratch:

### Step 1B.1: Search Bulk Data (Multiple Terms)

**Data source**: `bulk-downloads/science-secondary.json`

For II-2 ("photosythesis in plants"):

```bash
# Search with MISSPELLED term variants
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | 
  select(.lessonTitle | test("photo|synth|plant"; "i")) | 
  "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/science-secondary.json

# List ALL units to find non-obvious matches
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' bulk-downloads/science-secondary.json
```

For II-3 ("electromagnatic waves and spectrum"):

```bash
# Search with MISSPELLED term variants
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | 
  select(.lessonTitle | test("electro|magnet|wave|spectrum"; "i")) | 
  "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/science-secondary.json
```

**Requirement**: Document 10+ candidate slugs for EACH query

---

### Step 1B.2: Get MCP Summaries (5-10 candidates)

Use MCP tools:

- `get-lessons-summary` for individual lesson details
- `get-units-summary` for unit context

**Requirement**: 5-10 MCP summaries per query with key learning quotes

---

### Step 1B.3: Document Unit Context

For relevant units, document:

- Lesson ordering (foundational to capstone)
- Which lessons are beginner vs advanced
- Curriculum progression context

---

### Step 1B.4: Analyse Candidates

For EACH candidate, document:

```
SLUG: ___
Key Learning: "___"
Query match: [STRONG / MODERATE / WEAK / NONE]
Reasoning: ___
```

---

### Step 1B.5: COMMIT Rankings

**BEFORE benchmark, BEFORE reading .expected.ts:**

| Rank | Slug | Score (1-3) | Key Learning Quote | Why This Ranking |

|------|------|-------------|-------------------|------------------|

| 1 | ***|*** | "..." | ___ |

| 2 | ***|*** | "..." | ___ |

| 3 | ***|*** | "..." | ___ |

| 4 | ***|*** | "..." | ___ |

| 5 | ***|*** | "..." | ___ |

---

## Key Differences from Original Work

| Aspect | Original (Wrong) | Remediation (Correct) |

|--------|------------------|----------------------|

| MCP summaries | Reused from other queries | Fresh retrieval per query |

| Candidate list | Not documented | 10+ candidates documented |

| Unit context | Skipped | Documented systematically |

| Analysis format | Informal | Structured STRONG/MODERATE/WEAK/NONE |

| Evidence recording | Ad-hoc | Template-compliant sections |

---

## Verification Checklist (Per Query)

- [ ] Bulk data searched with multiple terms
- [ ] 10+ candidate slugs documented
- [ ] 5-10 MCP summaries with key learning quotes
- [ ] Unit context documented
- [ ] All candidates analysed with structured format
- [ ] COMMIT table complete with scores and justifications
- [ ] NO .expected.ts files read
- [ ] NO benchmark run

---

## Success Criteria

Both II-2 and II-3 will have:

1. Independent discovery evidence (not copied from other queries)
2. Template-compliant documentation
3. COMMIT rankings based purely on curriculum content analysis
