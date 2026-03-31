---
name: "WS3 Phase 0: Baseline and RED Specs"
overview: "Ground the live branch, capture contamination inventory, and establish failing RED tests before product changes."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: grounding
    content: "Re-ground against roadmap, umbrella plan, WS3 parent plan, and C8 auth closure plans."
    status: completed
  - id: contamination-inventory
    content: "Run canonical runtime contamination check and capture baseline evidence."
    status: completed
  - id: red-tests
    content: "Add RED tests for widget resource/metadata/auth policy before product code changes."
    status: completed
  - id: evidence-table
    content: "Record RED/GREEN evidence table for phases 1-6."
    status: completed
  - id: doc-rewrite
    content: "Rewrite active normative docs that direct execution toward dead widget model."
    status: completed
---

# WS3 Phase 0: Baseline and RED Specs

**Status**: COMPLETE
**Last Updated**: 2026-03-31

This companion plan narrows execution for Phase 0 only. The parent plan remains
authoritative for full WS3 scope and ordering.

## Required Inputs

1. `roadmap.md`
2. `mcp-app-extension-migration.plan.md`
3. `ws3-widget-clean-break-rebuild.plan.md`
4. `ws3-phase-3-canonical-contracts-and-runtime.plan.md` — contains binding
   `Reviewer-Validated Findings` section (B3 Hybrid retention, C8 prerequisite,
   visibility array format, task sequencing). Read before capturing the
   contamination inventory so the B3 Hybrid classification is understood.
5. `current/auth-safety-correction.plan.md`
6. `current/auth-boundary-type-safety.plan.md`

## Tasks

> **Post-WS2 calibration**: WS2 already removed runtime-path contamination
> (`window.openai`, `text/html+skybridge`, etc.). This inventory will primarily
> find dead files and the `oak-json-viewer` slug, not active runtime patterns.

1. Capture live branch state (`git status --short`, `git log --oneline --decorate -5`)
2. Run canonical runtime contamination check from the WS3 parent plan
3. Capture non-canonical inventory for:
   - legacy bridge residue (dead files awaiting deletion)
   - hard-coded resource identity (`oak-json-viewer` slug)
   - `preserve-schema-examples.ts` B3 Hybrid (JSON Schema examples preservation —
     assess for retention in Phase 3, not contamination)
   - public-resource auth policy surface
4. Add/adjust RED tests for:
   - widget resource contract
   - widget metadata contract
   - public-resource auth policy
   - `WIDGET_TOOL_NAMES` non-empty assertion: the current empty set makes
     widget metadata E2E tests pass vacuously (no assertions execute). Add a
     RED test that asserts `WIDGET_TOOL_NAMES.size > 0` — this should fail now
     and turn GREEN when Phase 3 re-populates the set.
5. Record expected RED failure reason and planned GREEN evidence for phases 1-6.
   Record this in the **Evidence** section below — each phase gets one row with:
   RED command, expected failure reason, target GREEN phase, and GREEN evidence.
6. Rewrite active normative docs that still direct execution toward the dead
   widget runtime model

## Acceptance Evidence

1. Contamination inventory is captured and linked to downstream phases — ✅
2. RED tests fail for expected reasons (and are not vacuous) — ✅ 3 E2E RED
3. No active doc still prescribes preserving legacy widget runtime behaviour — ✅
4. Widget metadata non-vacancy is tested through product behaviour: E2E RED
   spec asserts at least one tool advertises `_meta.ui.resourceUri` — ✅

## Evidence

### Contamination Inventory (captured 2026-03-31)

**Canonical check** (`rg` command from WS3 parent plan):

- `window.openai`: 0 in active code (1 in `docs/widget-rendering.md` — doc only)
- `text/html+skybridge`: 0
- `__mcpPreview`: 0
- `chatgpt-emulation`: 0
- `oak-json-viewer`: 24 hits across product code, tests, codegen, docs
- `undefined?.toolOutput|toolInput`: 2 hits in `widget-script.ts` (dead file)

**Non-canonical inventory**:

| Category | Finding | Downstream phase |
|----------|---------|-----------------|
| Legacy bridge residue | 5 dead files + `widget-renderers/` dir (6 files) | Phase 1 (delete) |
| Hard-coded resource identity | `oak-json-viewer` in codegen constants, registration, tests, docs | Phase 3 (rename) |
| B3 Hybrid (`preserve-schema-examples.ts`) | Active — JSON Schema examples preservation | Phase 3 (adapt, not delete) |
| Public-resource auth | Well-tested (8 unit + 8 E2E); uses SDK constants | Phase 3 (align to renamed slug) |
| `WIDGET_TOOL_NAMES` | Empty set — metadata tests pass vacuously | Phase 3 (re-populate) |
| `aggregated-tool-widget.ts` | Active HTML generation, depends on legacy chain | Phase 2 (replace with React build) |

### RED/GREEN Contract

| Phase | RED command | Expected failure | GREEN evidence |
|-------|-----------|------------------|----------------|
| 1 | Canonical contamination check | Legacy files still present in tree | 0 legacy widget files in active paths |
| 2 | `pnpm build` (widget target) | No `dist/mcp-app.html` output | React build produces self-contained HTML |
| 3 | `pnpm test:e2e -- ws3-red-specs` | 3 E2E RED specs fail (see below) | All RED specs pass |
| 4 | E2E: curriculum-model renders in app shell | No React app shell exists | View renders through fresh MCP App |
| 5 | E2E: user-search submits and renders results | No user-search UI exists | Search runs through MCP tool calls |
| 6 | `pnpm check` + canonical contamination check | Pre-existing doc/plan drift | Full gates pass, 0 contamination |

### RED Spec Detail (Phase 3 targets)

Each RED test proves product behaviour, not constant values. Verified RED 2026-03-31.

**E2E** (`e2e-tests/ws3-red-specs.e2e.test.ts` — 3 tests):

| Test | RED failure (actual) | GREEN target |
|------|---------------------|--------------|
| `at least one tool has _meta.ui.resourceUri` | `expected 0 to be greater than 0` | Phase 3 registers UI tools |
| `user-search-query has visibility ["app"]` | `expected undefined to be defined` | Phase 3 adds tool with `["app"]` |
| `widget slug not oak-json-viewer` | URI contains `oak-json-viewer` | Phase 3 renames resource slug |

**Unit GREEN** (`generate-widget-constants.unit.test.ts` — 2 tests):

| Test | Status | What it proves |
|------|--------|----------------|
| URI follows `ui://widget/` scheme | GREEN | Generator produces valid MCP Apps URIs |
| URI includes cache-busting hash | GREEN | Generator produces deterministic hashes |
