# Semantic Search — Synonym Quality Audit

**Status**: Part 1 ACTIVE — Focus: Synonym Quality Audit  
**Plan**: [11-synonym-quality-audit.md](../../plans/semantic-search/part-1-search-excellence/11-synonym-quality-audit.md)  
**Last Updated**: 2025-12-27

---

## 🎯 CURRENT TASK: Synonym Quality Audit

**Goal**: Audit existing synonyms for weak entries, add high-value foundational synonyms, and measure impact on search.

### Why This First?

1. **Top 100 curriculum terms have 0% synonym coverage** — the highest-frequency vocabulary is not covered
2. **Existing synonyms are unaudited** — we don't know if any are harming precision
3. **Quick win** — 2-3 hours of work with measurable impact
4. **Validates approach** — before investing in ES indexing or evaluation corpus

---

## 📋 Acceptance Criteria

### Phase 1: Audit Existing Synonyms (~2 hours)

| Criterion | How to Verify |
|-----------|---------------|
| All 13 synonym files reviewed for weak entries | Checklist completed |
| Potentially ambiguous synonyms identified | List created with reasoning |
| Overly broad synonyms identified | List created with reasoning |
| Category errors identified (e.g., "gravity" as synonym for "forces") | List created |
| Recommendations documented | Markdown report with keep/remove/scope decisions |

**Weak Synonym Indicators**:
- **Ambiguous**: "difference" could mean subtraction OR general difference
- **Overly broad**: "total" could match anything with a total
- **Category error**: "gravity" IS a force, not a synonym for forces
- **Cross-subject collision**: "gradient" means different things in maths vs art

### Phase 2: Add Foundational Synonyms (~1 hour)

| Criterion | How to Verify |
|-----------|---------------|
| ≥15 high-value synonyms added | Count in commit |
| Synonyms target KS1/KS2 foundational terms | Terms from value-scored list |
| Each synonym verified against bulk vocabulary data | Definition confirms usage |
| Quality gates pass | All 11 gates green |

**Target Synonyms** (from value analysis):

| Term | Value | Add to File | Suggested Synonyms |
|------|-------|-------------|-------------------|
| `adjective` | 678 | english.ts | describing word, descriptive word |
| `noun` | 579 | english.ts | naming word |
| `verb` | 304 | english.ts | action word, doing word |
| `adverb` | 240 | english.ts | describing verb word |
| `suffix` | 378 | english.ts | word ending, end of word |
| `prefix` | 94 | english.ts | word beginning, start of word |
| `partition` | 207 | maths.ts | break apart, split up |
| `multiple` | 154 | maths.ts | times table number |
| `equation` | 118 | maths.ts | number sentence |
| `denominator` | 55 | maths.ts | bottom number |
| `numerator` | 44 | maths.ts | top number |
| `estimate` | 109 | maths.ts | guess, rough answer |

### Phase 3: Measure Impact (~1 hour)

| Criterion | How to Verify |
|-----------|---------------|
| Baseline MRR recorded before changes | `pnpm test:smoke` results saved |
| Synonyms deployed to ES | `pnpm es:setup` successful |
| Post-deployment MRR measured | `pnpm test:smoke` results saved |
| Before/after comparison documented | Markdown report |
| Any precision regressions identified | Compare per-category MRR |

---

## 🎯 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Weak synonyms identified | ≥5 entries | Audit report count |
| High-value synonyms added | ≥15 entries | Commit diff count |
| Colloquial query MRR | No regression | Before/after comparison |
| Synonym-dependent query MRR | +5% improvement | Before/after comparison |
| Precision | No regression | Monitor for false positives |

---

## Current State

### Synonym Files (~300 entries total)

| File | Entries | Focus |
|------|---------|-------|
| `maths.ts` | ~119 | GCSE compounds, algebra, geometry |
| `key-stages.ts` | ~106 | KS abbreviations |
| `subjects.ts` | ~51 | Subject name variants |
| `numbers.ts` | ~17 | one↔1, two↔2, etc. |
| `history.ts` | ~13 | Historical periods |
| `education.ts` | ~10 | SEN, CPD, etc. |
| `science.ts` | ~11 | Concepts |
| `computing.ts` | ~6 | NEW — raster/bitmap, etc. |
| `music.ts` | ~8 | NEW — semibreve/whole note |
| `english.ts` | ~8 | Literary terms |
| `geography.ts` | ~8 | Themes |
| `exam-boards.ts` | ~5 | AQA, Edexcel, etc. |

### Key Discovery: Synonym Strategy is Inverted

**See [vocabulary-value-analysis.md](../../research/semantic-search/vocabulary-value-analysis.md)**

- Current synonyms target GCSE compounds (low frequency, high complexity)
- Top 100 curriculum terms (high frequency, foundational) have **0% coverage**
- Value Score = Frequency × (1 + 1/Year) × (1 + 0.2*(subjects-1))
- Highest-value uncovered: `adjective` (678), `noun` (579), `suffix` (378)

### Previous Session Outcomes (2025-12-26/27)

- ✅ Bulk mining complete — all 5 generators working
- ✅ Vocabulary value analysis — scoring framework created
- ✅ 27 LLM-extracted synonyms added (music.ts, computing.ts created)
- ✅ Regex synonym mining archived — 93% noise rate documented
- ✅ Plans 09, 10, 11 created for future work

---

## Before You Start

### 1. Read Foundation Documents

1. **[rules.md](../../directives-and-memory/rules.md)** — TDD, quality gates
2. **[11-synonym-quality-audit.md](../../plans/semantic-search/part-1-search-excellence/11-synonym-quality-audit.md)** — Full plan
3. **[vocabulary-value-analysis.md](../../research/semantic-search/vocabulary-value-analysis.md)** — Value scoring

### 2. Verify Quality Gates

```bash
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix
```

### 3. Record Baseline MRR

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm test:smoke 2>&1 | tee /tmp/baseline-mrr.txt
```

---

## Session Flow

### Step 1: Audit Existing Synonyms

For each file in `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`:

```markdown
## Audit: {filename}

### Entries Reviewed: N

### Potentially Weak Entries:

| Entry | Issue | Recommendation |
|-------|-------|----------------|
| `difference: ['subtraction']` | Ambiguous — "difference" used in many contexts | SCOPE: Add comment or remove |

### Category Errors:
- None found / List...

### Decision: KEEP / REMOVE / SCOPE (with specifics)
```

### Step 2: Add Foundational Synonyms

For each term in the target list:

1. **Verify in bulk data**: Check `vocabulary-graph-data.ts` for definition
2. **Confirm synonym is genuine**: Definition should support the alternative
3. **Add to appropriate file**
4. **Run quality gates**

### Step 3: Deploy and Measure

```bash
# Rebuild SDK
pnpm type-gen && pnpm build

# Deploy to ES
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup

# Measure impact
pnpm test:smoke 2>&1 | tee /tmp/post-synonym-mrr.txt

# Compare
diff /tmp/baseline-mrr.txt /tmp/post-synonym-mrr.txt
```

---

## Synonym Validation Against Bulk Data

To verify a synonym is genuine, check the definition in the extracted vocabulary:

```bash
# Search for term in vocabulary graph
grep -A5 "term: 'adjective'" packages/sdks/oak-curriculum-sdk/src/mcp/vocabulary-graph-data.ts
```

**A valid synonym should appear in the definition**:
- `adjective`: "a word that **describes** a noun" → "describing word" ✅
- `denominator`: "the **bottom number** in a fraction" → "bottom number" ✅

**A poor synonym is not supported by the definition**:
- `forces`: "a push or pull on an object" → "gravity" ❌ (gravity is a TYPE of force)

---

## Key File Locations

### Synonym Files

```
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── index.ts           ← Barrel export
├── maths.ts           ← Largest file (~119 entries)
├── english.ts         ← Target for foundational additions
├── science.ts         ← Check for category errors
├── education.ts       ← Acronyms (likely clean)
└── README.md          ← Documentation
```

### Bulk Vocabulary (for validation)

```
packages/sdks/oak-curriculum-sdk/src/mcp/vocabulary-graph-data.ts  ← 13K terms with definitions
```

### Search App

```
apps/oak-open-curriculum-semantic-search/
├── src/lib/indexing/synonym-config.ts  ← ES synonym configuration
└── scripts/es-setup.ts                  ← Deploys synonyms to ES
```

---

## Quality Gate Checkpoints

After any synonym changes:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
```

After ES deployment:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm test:smoke
```

---

## Audit Checklist Template

Use this for each synonym file:

```markdown
## Audit: maths.ts

**Entries Reviewed**: 119
**Issues Found**: N

### Potentially Ambiguous

| Entry | Issue | Recommendation |
|-------|-------|----------------|
| ... | ... | ... |

### Overly Broad

| Entry | Issue | Recommendation |
|-------|-------|----------------|
| ... | ... | ... |

### Category Errors

| Entry | Issue | Recommendation |
|-------|-------|----------------|
| ... | ... | ... |

### Summary
- KEEP: N entries
- REMOVE: N entries
- SCOPE (add comment): N entries
```

---

## Related Documents

- [11-synonym-quality-audit.md](../../plans/semantic-search/part-1-search-excellence/11-synonym-quality-audit.md) — Full plan
- [vocabulary-value-analysis.md](../../research/semantic-search/vocabulary-value-analysis.md) — Value scoring
- [elasticsearch-optimization-opportunities.md](../../research/semantic-search/elasticsearch-optimization-opportunities.md) — ES research
- [synonyms/README.md](../../../packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/README.md) — Lessons learned

---

## Constraints

1. **No new MCP tools** — Search optimisation focus
2. **LLM agent makes final decisions** — Weighting function is first pass only
3. **Scope is ALL subjects** — Not just maths; bulk data covers full curriculum
4. **Measure before and after** — No unmeasured changes

---

**Ready?**

1. Record baseline MRR
2. Audit existing synonyms (start with maths.ts — largest file)
3. Add foundational synonyms from value-scored list
4. Deploy to ES and measure impact
