# Ground Truth Validation

Scripts that validate ground truth data against the live Oak Curriculum API.

## Scripts

### `validate-ground-truth.ts`

Validates that all lesson, unit, and sequence slugs in the ground truth data
actually exist in the Oak Curriculum API.

**Usage**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm tsx evaluation/validation/validate-ground-truth.ts
```

**Requirements**:

- `OAK_API_KEY` environment variable must be set
- Network access to `https://open-api.thenational.academy/api/v0`

**What it validates**:

1. **Query structure** — All queries have expected slugs with valid relevance scores (1, 2, 3)
2. **Slug format** — All slugs match `[a-z0-9-]+` pattern
3. **Slug existence** — All slugs exist in the live API

**Output**:

- ✅ If all slugs are valid, exits with code 0
- ❌ If any slugs are invalid, prints details and exits with code 1

**Why this is a script, not a test**:

- Tests should not have external dependencies (network, API keys)
- Tests should not silently skip when prerequisites are missing
- This validation requires network access and an API key
- Running this as a script makes the requirements explicit

---

## When to Run

Run ground truth validation:

1. **Before committing new ground truth** — Ensure all slugs are valid
2. **When evaluating search changes** — Ensure results are comparable
3. **Periodically** — Content may be removed from the API

---

## Related

- [ADR-085: Ground Truth Validation Discipline](../../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)
- [EXPERIMENT-LOG.md](../../../.agent/evaluations/EXPERIMENT-LOG.md)
- [testing-strategy.md](../../../.agent/directives-and-memory/testing-strategy.md)
