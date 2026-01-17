---
name: Revisit Art Imprecise-Input
overview: Diagnose whether art/primary and art/secondary imprecise-input ground truths actually test typo recovery, and redesign if the typo is bypassable by other query terms.
todos:
  - id: diagnose-art-primary
    content: Run ES diagnostics on art/primary imprecise-input query to determine if typo is essential
    status: completed
  - id: diagnose-art-secondary
    content: Run ES diagnostics on art/secondary imprecise-input query to determine if typo is essential
    status: completed
  - id: redesign-if-needed
    content: Redesign any flawed queries using MCP exploration and ES verification
    status: completed
  - id: validate-and-benchmark
    content: Run type-check, ground-truth:validate, and benchmarks
    status: completed
  - id: update-checklist
    content: Update checklist with diagnostic findings and any changes made
    status: completed
---

# Revisit Art Imprecise-Input Ground Truths

## Context

During citizenship/secondary review, we discovered that imprecise-input queries can be flawed: if other correctly-spelled terms in the query can find the expected results, the typo term is never actually tested.

**Current queries under review**:

- art/primary: `'brush painting techneeques'` (typo: techneeques)
- art/secondary: `'teach drawing skills beginers'` (typo: beginers)

Both have MRR 0.500, which could indicate partial typo testing or poor query design.

## Diagnostic Approach

For each query, run three ES queries to determine if the typo is essential:

1. **Typo term + fuzziness** - Should return results (proves fuzziness works)
2. **Typo term without fuzziness** - Should return 0 results (proves typo is misspelled)
3. **Other terms only** - If results found, typo is bypassable (query is flawed)

## Files to Update (if needed)

- [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/primary/imprecise-input.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/primary/imprecise-input.ts)
- [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/imprecise-input.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/imprecise-input.ts)

## Process

### Step 1: Diagnose art/primary

Query: `'brush painting techneeques'`

```bash
# Test 1: "techneeques" with fuzziness (should find "techniques" content)
# Test 2: "techneeques" without fuzziness (should return 0)
# Test 3: "brush painting" only (if finds expected slugs, typo is bypassed)
```

If Test 3 finds expected slugs, redesign query so typo is essential.

### Step 2: Diagnose art/secondary

Query: `'teach drawing skills beginers'`

```bash
# Test 1: "beginers" with fuzziness (should find "beginners" content)
# Test 2: "beginers" without fuzziness (should return 0)
# Test 3: "teach drawing skills" only (if finds expected slugs, typo is bypassed)
```

If Test 3 finds expected slugs, redesign query so typo is essential.

### Step 3: Redesign if needed

For any flawed query:

1. Design new query where typo term is essential for finding target lessons
2. Use MCP tools to explore art curriculum and find appropriate expected slugs
3. Verify via ES that new query genuinely tests typo recovery

### Step 4: Validate and benchmark

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject art --phase primary --verbose
pnpm benchmark --subject art --phase secondary --verbose
```

### Step 5: Update checklist

Update [`ground-truth-review-checklist.md`](.agent/plans/semantic-search/active/ground-truth-review-checklist.md) with findings:

- Note whether queries were valid or redesigned
- Update MRR scores
- Add diagnostic notes

## Success Criteria

- Both imprecise-input queries verified to genuinely test typo recovery
- ES diagnostics confirm typo term is essential (not bypassable)
- All validation passes
- Checklist updated with findings
