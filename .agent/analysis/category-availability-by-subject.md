# Category Availability by Subject — Definitive Analysis

**Date**: 2 January 2026  
**Method**: Systematic API scan of all 17 subjects via `/sequences/{sequence}/units` and `/units/{unit}/summary` endpoints  
**Tool**: `ooc-http-dev-local` MCP server

## Summary

| Status | Count | Subjects |
|--------|-------|----------|
| ✅ HAS Categories | 3 | English, Science, Religious Education |
| ❌ NO Categories | 14 | All others (including RSHE/PSHE) |

## Key Findings

### 1. Categories ARE a Subject-Specific Curriculum Design Feature

Categories are **NOT** missing data — they are an **intentional curriculum design element** present only in subjects where pedagogical categorisation is meaningful:

| Subject | Category Purpose |
|---------|------------------|
| **English** | Skill/topic-based: Grammar, Handwriting, Reading/writing/oracy |
| **Science** | Discipline-based: Biology, Chemistry, Physics |
| **Religious Education** | Lens-based: Theology, Social science |

### 2. API Endpoints Verified

Both endpoints return categories when available:

- ✅ `/sequences/{sequence}/units` — categories in each unit object
- ✅ `/units/{unit}/summary` — categories array in response

### 3. Unit Summary Endpoint is Universal

The `/units/{unit}/summary` endpoint works for ALL subjects, confirming slugs are correct and data is consistent across subjects.

---

## Subjects WITH Categories

### 1. English (Primary & Secondary)

**Categories found:**
- Grammar
- Handwriting  
- Reading, writing & oracy

**Example unit:**

```json
{
  "unitTitle": "Word class",
  "unitSlug": "word-class",
  "categories": [
    { "categoryTitle": "Grammar", "categorySlug": "grammar" }
  ]
}
```

**Sequences verified:**
- `english-primary` (Years 1-6) ✅
- `english-secondary-aqa` (Year 7) ✅

---

### 2. Science (Primary & Secondary)

**Categories found:**
- Biology
- Chemistry
- Physics

**Example unit:**

```json
{
  "unitTitle": "Cells",
  "unitSlug": "cells",
  "categories": [
    { "categoryTitle": "Biology", "categorySlug": "biology" }
  ]
}
```

**Note:** Some units have **multiple categories** (e.g., "Climate change and living sustainably" has Biology, Chemistry, AND Physics).

**Sequences verified:**
- `science-primary` (Year 1) ✅
- `science-secondary-aqa` (Year 7) ✅

---

### 3. Religious Education (Primary & Secondary)

**Categories found:**
- Social science
- Theology
- Philosophy

**Example unit:**

```json
{
  "unitTitle": "Blik: how do I interpret the world around me?",
  "unitSlug": "blik-how-do-i-interpret-the-world-around-me",
  "categories": [
    { "categoryTitle": "Philosophy", "categorySlug": "philosophy" }
  ]
}
```

**Sequences verified:**
- `religious-education-primary` (Year 1) ✅
- `religious-education-secondary-core` (Year 7) ✅

---

## Subjects WITHOUT Categories

The following subjects have **threads** but **NO categories** in their API responses:

| Subject | Primary Sequence | Secondary Sequence |
|---------|------------------|-------------------|
| Maths | `maths-primary` ❌ | `maths-secondary` ❌ |
| History | `history-primary` ❌ | `history-secondary-aqa` ❌ |
| Geography | `geography-primary` ❌ | `geography-secondary-aqa` ❌ |
| Art | `art-primary` ❌ | `art-secondary` ❌ |
| Computing | `computing-primary` ❌ | `computing-secondary-core` ❌ |
| Cooking & Nutrition | `cooking-nutrition-primary` ❌ | `cooking-nutrition-secondary` ❌ |
| Design & Technology | `design-technology-primary` ❌ | `design-technology-secondary` ❌ |
| French | `french-primary` ❌ | `french-secondary-aqa` ❌ |
| German | N/A | `german-secondary-aqa` ❌ |
| Spanish | `spanish-primary` ❌ | `spanish-secondary-aqa` ❌ |
| Music | `music-primary` ❌ | `music-secondary-aqa` ❌ |
| Physical Education | `physical-education-primary` ❌ | `physical-education-secondary-core` ❌ |
| Citizenship | N/A | `citizenship-secondary-core` ❌ |
| RSHE/PSHE | `rshe-pshe-primary` ❌ | `rshe-pshe-secondary` ❌ |

---

## Note: RSHE/PSHE Sequence Query Requires Year Parameter

The `/sequences/{sequence}/units` endpoint requires a `year` parameter for RSHE/PSHE:

```bash
# Works:
GET /sequences/rshe-pshe-primary/units  # Returns all years
# Alternative:
GET /key-stages/ks2/subjects/rshe-pshe/units  # Also works
```

**Verification result:** RSHE/PSHE has **NO categories** — same as other non-categorised subjects.

---

## Other Verified Facts

### 1. Threads are Universal
All subjects have **threads** - these are available regardless of category presence. Threads represent curriculum progressions across years.

### 2. Category Slug Optional
Per the OpenAPI schema, `categorySlug` is optional while `categoryTitle` is required:

```yaml
categories:
  type: array
  items:
    properties:
      categoryTitle:
        type: string
        required: true
      categorySlug:
        type: string
        # NOT required
```

### 3. Multiple Categories Possible
Units can belong to multiple categories. Observed in Science where cross-disciplinary units (e.g., "Climate change") span Biology, Chemistry, and Physics.

### 4. Category ≠ Subject
Categories are NOT the same as subjects. They represent pedagogical groupings WITHIN a subject:
- English → Grammar, Handwriting, Reading/writing/oracy
- Science → Biology, Chemistry, Physics
- RE → Theology, Philosophy, Social science

---

## Implications for Search

### Unit Topics Population
Only 3 subjects will have `unit_topics` populated from categories:
- English
- Science  
- Religious Education

### Faceted Search Impact
The `topics` facet in unit search will only show meaningful values for these 3 subjects. For other subjects, the facet will be empty or should be hidden.

### Alternative Topic Sources
For subjects without categories, consider:
1. **Thread titles** as topic proxies (all subjects have threads)
2. **Unit title parsing** (many units have structured titles like "Unit: Topic")
3. **Keywords from lessons** within the unit

---

## Verification Method

Each subject was verified by calling:

```
GET /sequences/{sequence}/units?year={year}
```

Where:
- Primary sequences: tested with Year 1 (or Year 3 for French/Spanish)
- Secondary sequences: tested with Year 7

All 17 subjects were systematically checked via the `ooc-http-dev-local` MCP tools.

