# Sub-Plan 11: Synonym Quality Audit & Weighting Function

**Status**: 📋 PLANNED  
**Priority**: High  
**Parent**: [README.md](README.md)  
**Created**: 2025-12-27  
**Research**: [vocabulary-value-analysis.md](../../../research/semantic-search/vocabulary-value-analysis.md)

---

## 🎯 Goal

1. **Audit existing synonyms** for weak entries that add noise without significant value
2. **Implement weighting function** to prioritize synonym candidates by impact
3. **Establish LLM agent review** as the decision-making process for synonym inclusion

> **Scope**: The weighting function uses vocabulary frequency data from ALL subjects, ALL key stages (30 bulk files, ~47K lessons). Examples may reference specific subjects for illustration, but analysis covers the complete curriculum.

---

## The Problem

### Current Synonym Quality is Unknown

We have ~190 curated synonyms across 13 files. But we don't know:
- Which synonyms are actually used in searches?
- Which synonyms add value vs add noise?
- Are there synonyms that harm search precision?

### Weak Synonyms Reduce Precision

**Example of potentially weak synonyms**:

```typescript
// maths.ts — do these help or hurt?
addition: ['add', 'plus', 'sum', 'adding', 'total'],  // 'total' might be too broad
subtraction: ['take away', 'difference'],  // 'difference' is ambiguous (maths/general)
```

A synonym like `difference` might match lessons about "differences in culture" when the user searched for subtraction.

### Weighting Function as First Pass, Not Final Decision

**Key insight**: A weighting function provides **prioritization**, not **decisions**.

```
The function scores candidates.
An LLM agent (or human) makes the final inclusion decision.
```

This is critical because:
- "the" has high frequency but zero value
- "ornithology" has low frequency but high value (examinable, needs plain English synonym)
- Context matters more than metrics

---

## 🚀 Intended Impact

### Search Quality

| Before | After |
|--------|-------|
| Unknown synonym quality | Audited, high-confidence synonyms |
| Synonyms may reduce precision | Weak synonyms identified and removed |
| Ad-hoc synonym selection | Data-driven prioritization + LLM review |

### Quantified Target

- **Identify ≥5 weak synonyms** that should be removed or scoped
- **+2-3% precision improvement** by removing noisy synonyms
- **Establish review process** for future synonym additions

---

## Weighting Function Design

### Purpose

The weighting function produces a **priority score** for synonym candidates. It is explicitly a **first pass** — not a final decision.

### Formula

```
Priority = Frequency × FoundationBonus × CrossSubjectBonus × SynonymNeed × InverseStopWordPenalty

Where:
- Frequency: Count of term occurrences in curriculum
- FoundationBonus: 1 + (1/Year) — earlier years = more foundational
- CrossSubjectBonus: 1 + 0.2*(subjects-1) — multi-subject terms have broader search
- SynonymNeed: 2 if term has obvious plain-English alternative, 1 otherwise
- InverseStopWordPenalty: 0.01 for stop words, 1 otherwise
```

### Examples

| Term | Freq | Year | Subj | Need | Score | Decision |
|------|------|------|------|------|-------|----------|
| `adjective` | 212 | 1 | 4 | 2 | 1357 | ✅ High priority, add synonym |
| `the` | 50000 | all | 16 | 1 | 0.5 | ❌ Stop word, reject |
| `ornithology` | 2 | 10 | 1 | 2 | 4.4 | ⚠️ LLM review: examinable, valuable |
| `gradient` | 89 | 7 | 3 | 2 | 45 | ⚠️ LLM review: subject-ambiguous |

### The LLM Agent Makes Final Decisions

The weighting function **surfaces candidates**. The LLM agent evaluates:

1. **Is this a true synonym?** (same meaning, not just related)
2. **Does it improve recall?** (would users search with this term?)
3. **Does it harm precision?** (would it match irrelevant results?)
4. **Is it subject-scoped?** (does "gradient" mean different things in maths vs art?)

---

## Phases

### Phase 1: Audit Existing Synonyms

**Effort**: ~3 hours  
**Impact**: Quality baseline

Review all existing synonyms for:

| Check | Question | Action |
|-------|----------|--------|
| **Overly broad** | Does "total" as synonym for "addition" match too much? | Consider removal |
| **Ambiguous** | Does "difference" (subtraction) conflict with "difference" (general)? | Consider scoping |
| **Redundant** | Are any synonyms duplicated across files? | Remove duplicates |
| **Low value** | Do any synonyms add noise without measurable benefit? | Consider removal |

**Files to audit**:
- `maths.ts` (~140 entries)
- `science.ts` (~20 entries)
- `english.ts` (~10 entries)
- `history.ts` (~15 entries)
- `geography.ts` (~10 entries)
- `computing.ts` (6 entries) — NEW, likely clean
- `music.ts` (8 entries) — NEW, likely clean
- `education.ts` (~25 entries)
- `key-stages.ts` (~10 entries)
- `subjects.ts` (~15 entries)
- `exam-boards.ts` (~10 entries)
- `numbers.ts` (~10 entries)

### Phase 2: Implement Weighting Function

**Effort**: ~2 hours  
**Impact**: Enables data-driven prioritization

Add to vocab-gen:

```bash
pnpm vocab-gen --synonym-candidates --limit 100
```

Output format:
```markdown
## Top 100 Synonym Candidates by Priority Score

| Rank | Term | Score | Freq | Year | Subjects | Current Synonyms | Suggested |
|------|------|-------|------|------|----------|------------------|-----------|
| 1 | adjective | 1357 | 212 | 1 | 4 | NONE | describing word |
| 2 | noun | 1158 | 181 | 1 | 4 | NONE | naming word |
...
```

### Phase 3: LLM Agent Review Process

**Effort**: ~1 hour setup, ongoing  
**Impact**: Quality gates for synonym inclusion

Establish review checklist:

```markdown
## Synonym Review Checklist (for LLM Agent)

For each candidate synonym:

1. [ ] **True synonym?** Same meaning in context, not just related term
2. [ ] **Search improvement?** Would real users search with this term?
3. [ ] **Precision risk?** Could this match irrelevant results?
4. [ ] **Subject scope?** Does this term mean different things in different subjects?
5. [ ] **Already covered?** Is this already a synonym for another term?
6. [ ] **Plain English?** Is this the everyday language version of a curriculum term?

Include if:
- Answers 1, 2, 6 = YES
- Answers 3, 4, 5 = NO or "scoped correctly"
```

### Phase 4: Remove/Scope Weak Synonyms

**Effort**: ~2 hours  
**Impact**: Improved precision

Based on audit findings:
1. Remove synonyms that clearly harm precision
2. Add subject-scoping comments where ambiguity exists
3. Document decisions in commit messages

**Example scoping**:
```typescript
// Before (ambiguous)
gradient: ['slope', 'steepness'],

// After (scoped)
/** Maths only - art/design "gradient" means colour transition */
gradient: ['slope', 'steepness', 'rate of change'],
```

### Phase 5: Measure Impact

**Effort**: ~2 hours  
**Impact**: Validates approach

1. Run evaluation corpus before changes
2. Apply synonym removals/scoping
3. Rebuild and redeploy
4. Run evaluation corpus after changes
5. Compare precision metrics

---

## Audit Checklist for Existing Files

### Likely Issues to Check

| File | Potential Issues |
|------|------------------|
| `maths.ts` | "difference" (ambiguous), "total" (broad), "product" (ambiguous) |
| `science.ts` | "forces" including "gravity" (category error — gravity IS a force) |
| `english.ts` | Potentially well-scoped (domain-specific terms) |
| `education.ts` | Acronyms are safe; generic terms might be broad |
| `numbers.ts` | Likely safe (one↔1 is unambiguous) |

### Questions for Each Entry

1. If I search for [synonym], would I expect [canonical term] results?
2. If I search for [synonym], would I get irrelevant results?
3. Is [synonym] specific enough to be useful?

---

## Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Weak synonyms identified | ≥5 entries | Audit findings |
| Precision improvement | +2% on affected queries | Before/after |
| Review process documented | Checklist created | Documentation |
| Weighting function implemented | `--synonym-candidates` command | Code complete |

---

## Related Documents

- [vocabulary-value-analysis.md](../../../research/semantic-search/vocabulary-value-analysis.md) — Value scoring framework
- [synonyms/README.md](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/README.md) — Synonym management
- [02b-vocabulary-mining.md](02b-vocabulary-mining.md) — Overall vocabulary strategy
- [ADR-063](../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) — Synonym architecture

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-27 | Initial plan created for synonym quality audit |

