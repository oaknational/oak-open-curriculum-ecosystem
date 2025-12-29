# Sub-Plan 04: Documentation Debt

**Status**: ✅ COMPLETE  
**Priority**: Low  
**Parent**: [README.md](README.md)  
**Completed**: 2025-12-24

---

## Goal

Update all stale documentation references and remove outdated information.

---

## Completed Work (2025-12-24)

### ✅ 1. EXPERIMENT-LOG.md — Fixed

**Issue**: Stated "TIER 1 COMPLETE" multiple times

**Fix Applied**: Replaced all "COMPLETE" language with "TARGET MET, EXHAUSTION PENDING". Added link to acceptance criteria.

### ✅ 2. .agent/evaluations/README.md — Fixed

**Issue**: Outdated "🔴 BLOCKING: incomplete index" warning

**Fix Applied**: Replaced with "✅ INDEX COMPLETE" status. Added links to ADR-085 and acceptance criteria.

### ✅ 3. .cursor Plan File — Fixed

**Issue**: `stage3-gap-close` and `stage4-tier1-validation` marked "cancelled"

**Fix Applied**: Changed to "pending" with updated descriptions referencing acceptance criteria.

### ✅ 4. part-1-search-excellence.md — Fixed

**Issue**: Superseded by directory structure

**Fix Applied**: Converted to redirect file pointing to new `part-1-search-excellence/README.md`

### ✅ 5. semantic-search.prompt.md — Fixed

**Issue**: Outdated "🔴 RE-BASELINE REQUIRED" warning and ??? values

**Fix Applied**: Updated to reflect current state with verified metrics. References new directory structure.

### ✅ 6. ADR-082 — Fixed

**Issue**: Various places said "Tier 1: COMPLETE"

**Fix Applied**: Changed to "Tier 1: TARGET MET" with explanation of exhaustion pending. Added link to acceptance criteria.

### ✅ 7. current-state.md — Fixed

**Issue**: Said "Tier 1: COMPLETE" and "Ready" for Tier 2-3

**Fix Applied**: Changed to "TARGET MET (pending)" and "Blocked" for Tier 2-3. Added link to acceptance criteria.

### ✅ NEW: Created Search Acceptance Criteria

**Location**: `.agent/plans/semantic-search/search-acceptance-criteria.md`

**Content**: Defines "Target Met" vs "Exhausted", per-category thresholds, standard approaches checklist, and plateau definition.

---

## Acceptance Criteria — ALL MET

- [x] No documentation claims Tier 1 is "COMPLETE"
- [x] No outdated blocking warnings
- [x] All ??? values replaced with verified metrics
- [x] Old monolithic plan file replaced with new structure
- [x] Prompt file reflects current state
- [x] **NEW**: Acceptance criteria document created

---

## Related Documents

- [Search Acceptance Criteria](../search-acceptance-criteria.md) — **NEW: Defines "Target Met" vs "Exhausted"**
- [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)
- [current-state.md](../current-state.md)
- [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
- [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)
