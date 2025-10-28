# Tier Concept Analysis

**Date**: 2025-10-28

**Question**: Is "tier" a concept in the API at all?

**Answer**: **YES**, tier IS exposed in the API, but it's nested deep in the response structure.

---

## Where Tiers Appear in the API

### 1. In the Zod Schema

From `reference/oak-openapi/src/lib/handlers/sequences/types.ts`:

```typescript
const tierSchema = z.object({
  tierTitle: z.string().openapi({ description: 'The title of the tier' }),
  tierSlug: z.string().openapi({ description: 'The tier identifier' }),
  units: z.array(unitSchema),
});

const examSubjectsSchemaWithTiers = z.object({
  examSubjectTitle: z.string(),
  examSubjectSlug: z.string().optional(),
  tiers: z.array(tierSchema),
});
```

### 2. In Sequence Responses (Year 10/11 Only)

When calling `GET /sequences/{sequence}/units` for **KS4 science sequences** (Years 10-11), the response includes:

```json
{
  "year": 10,
  "examSubjects": [
    {
      "examSubjectTitle": "Biology",
      "examSubjectSlug": "biology",
      "tiers": [
        {
          "tierTitle": "Foundation",
          "tierSlug": "foundation",
          "units": [...]
        },
        {
          "tierTitle": "Higher",
          "tierSlug": "higher",
          "units": [...]
        }
      ]
    }
  ]
}
```

### 3. Tier Values

The API exposes two tier slugs:

- `foundation`
- `higher`

---

## Example: `science-secondary-aqa` Sequence

For the sequence `science-secondary-aqa`, Year 10 returns:

**4 exam subjects**:

- Biology (with Foundation + Higher tiers)
- Chemistry (with Foundation + Higher tiers)
- Combined science (with Foundation + Higher tiers)
- Physics (with Foundation + Higher tiers)

**Total: 8 tier-subject combinations** from a single sequence.

---

## Where Tiers Do NOT Appear

### 1. In `get-subjects` Response

The `get-subjects` endpoint shows:

```json
{
  "sequenceSlug": "science-secondary-aqa",
  "years": [7, 8, 9, 10, 11],
  "keyStages": [...],
  "phaseSlug": "secondary",
  "phaseTitle": "Secondary",
  "ks4Options": {
    "title": "AQA",
    "slug": "aqa"
  }
}
```

**Note**: `ks4Options` only shows the exam board, NOT tiers.

### 2. In Non-Science KS4 Sequences

For sequences like `english-secondary-aqa`, Years 10-11 do NOT include tiers - they're flat unit lists.

---

## Summary

| **Question**                         | **Answer**                                                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Does the API expose tiers?           | **YES** - nested in `examSubjects[].tiers[]` for KS4 science sequences                          |
| Are tiers in the top-level metadata? | **NO** - not in `get-subjects`, only in `get-sequences-units` Year 10/11 responses              |
| Which subjects have tiers?           | **Sciences only** - Biology, Chemistry, Combined Science, Physics                               |
| What are the tier values?            | `foundation` and `higher`                                                                       |
| Can you query by tier?               | **NO** - the API returns all tiers; filtering would need to be done client-side or via MCP tool |
| Do programme slugs include tier?     | **YES** - OWA uses `biology-secondary-ks4-foundation-aqa`                                       |
| Does the sequence slug include tier? | **NO** - API uses `science-secondary-aqa` (covers all tiers)                                    |

---

## Implication for Sequence vs Programme

**Tier is a "programme factor"** - it's one of the dimensions that turns a sequence into a specific programme:

```plaintext
Sequence: science-secondary-aqa
  + Year: 10
  + Exam Subject: biology
  + Tier: foundation
  → Programme: biology-secondary-ks4-foundation-aqa

Sequence: science-secondary-aqa
  + Year: 10
  + Exam Subject: biology
  + Tier: higher
  → Programme: biology-secondary-ks4-higher-aqa
```

This confirms: **Programme = Sequence + Context Filters (key stage, tier, exam subject)**
