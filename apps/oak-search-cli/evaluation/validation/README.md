# Ground Truth Validation

Scripts that validate ground truth data against local bulk data files.

## Scripts

### `validate-ground-truth.ts`

Validates that all lesson slugs in the ground truth data actually exist in the
bulk data files (downloaded via `pnpm bulk:download`).

**Usage**:

```bash
cd apps/oak-search-cli
pnpm ground-truth:validate
```

**Requirements**:

- Bulk data files must be downloaded: `pnpm bulk:download`
- Files are located in `bulk-downloads/` directory

**What it validates**:

1. **Query structure** — All queries have expected slugs with valid relevance scores (1, 2, 3)
2. **Slug format** — All slugs match `[a-z0-9-]+` pattern
3. **Slug existence** — All slugs exist in the corresponding bulk data file

**Output**:

- ✅ If all slugs are valid, exits with code 0
- ❌ If any slugs are invalid, prints details and exits with code 1

**Why bulk data validation (not live API)?**:

1. **Speed** — Bulk data validation is instant; API calls take 10-30 seconds
2. **Offline capability** — Can validate without network access
3. **Consistency** — Validates against same data as ES index
4. **No rate limits** — Can validate hundreds of slugs instantly

---

## When to Run

Run ground truth validation:

1. **Before committing new ground truth** — Ensure all slugs are valid
2. **After downloading fresh bulk data** — Check for curriculum drift
3. **Before major experiments** — Ensure measurements are valid
4. **Periodically** — Content may change in the curriculum

---

## Creating Ground Truths

For the complete step-by-step process of creating new ground truths, see:

**[GROUND-TRUTH-PROCESS.md](../../src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md)**

---

## Related

- [GROUND-TRUTH-PROCESS.md](../../src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md) — Step-by-step creation process
- [ADR-085: Ground Truth Validation Discipline](../../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)
- [ADR-098: Ground Truth Registry](../../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md)
- [testing-strategy.md](../../../../.agent/directives/testing-strategy.md)
