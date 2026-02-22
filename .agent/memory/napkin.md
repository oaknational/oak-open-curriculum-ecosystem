# Napkin

## Session: 2026-02-22 (d) — Consolidation and Architecture Reviews

### What Was Done

- Ran `/consolidate-docs` after completing widget Phase 5 resilience hardening
- Invoked all four architecture reviewers (Barney, Betty, Fred, Wilma)
- Fixed Wilma's medium finding: added try/catch around delegated click
  handler in `widget-script.ts` (error containment for `openOnOakWebsite`)
- Added Barney's suggestion: regression test in `renderer-contracts.integration.test.ts`
  asserting no renderer produces `onclick` attributes and all use `data-oak-url`
- Updated permanent docs:
  - README "Known Resilience Gaps" → "Resilience Hardening (Phase 5)" with
    current state (all gaps fixed)
  - README `esc()` description: removed `onclick` reference
  - README four-way sync description: expanded to describe full chain
  - README edge case table: "Unknown scope" → "Fail-fast: explicit error message"
- Updated roadmap: 3h Widget stabilisation → COMPLETE
- Updated session prompt: removed widget from pre-merge blockers, updated
  status to COMPLETE, reduced to one merge blocker (SDK workspace separation)
- Distilled new patterns from napkin sessions 2026-02-17 to 2026-02-22:
  - Widget: `onclick` HTML-decode exploit, `JSON.stringify` for generated JS,
    `expect.any(String)` → `toHaveProperty`
  - Architecture: TSDoc `@see` → ADRs not plans, "noauth" semantic distinction
  - Testing: refactoring TDD RED = compiler errors, compile-time assertion
    consumption requirement
- Pruned distilled.md: removed fail-fast ES credentials pattern (now in
  ADR-116) and per-request transport pattern (now in ADR-112)
- Archived napkin (1220 lines) to `archive/napkin-2026-02-22.md`, started fresh

### Architecture Reviewer Findings

**Barney** (simplification): Compliant. Suggests:
- Explore fixture lacks Zod runtime validation (only TypeScript shaping)
- Co-locate `openOnOakWebsite` with delegated handler to remove ordering coupling
- Consider single-source generation for renderer dispatch (vs 4-way sync tests)

**Betty** (systems-thinking): Compliant. Positive trajectory across all
dimensions. No issues found.

**Fred** (principles/ADR): Compliant. No violations. Minor observations:
- CTA HTML `id` unescaped (trusted boundary, near-zero risk)
- Zod validation style inconsistency (`safeParse` vs `parse` in contract tests)

**Wilma** (resilience): Issues found:
- [FIXED] Delegated click handler lacked try/catch
- [LOW] Null guards in `forEach` callbacks for browse/suggest
- [DELEGATE] URL sanitisation for `data-oak-url`/`href` → security-reviewer

### Quality Gates

All pass: type-check, lint:fix, test (39 passed), test:ui (20 Playwright).
