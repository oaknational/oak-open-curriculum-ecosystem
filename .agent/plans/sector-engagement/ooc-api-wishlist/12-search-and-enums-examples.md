# Search and Enum Examples

These examples highlight search constraints and enum source-of-truth issues.

## Example 1: `/search/lessons` excludes `financial-education`

**Request**

```http
GET /api/v0/search/lessons?q=budgeting&subject=financial-education
```

**Current response (observed)**

- Empty results, even when lessons exist in other endpoints.

**Desired documentation**

- State that `financial-education` is excluded from search, or
- Provide an explicit flag or reason code when a subject is excluded.

## Example 2: Key stage and subject enums are static

Several request schemas use enums derived from a static JSON list of supported subjects/key stages.

**Observed effect**

- If a subject exists in upstream data but is not in the static list, the API rejects valid requests at schema validation time.

**Desired behaviour**

- Generate enums from live data, or
- Document that enums represent currently supported (non-legacy) content only.

**Related maths-specific enhancements:** `21-maths-education-enhancements.md` item 7 (transcript search filters and richer context).
