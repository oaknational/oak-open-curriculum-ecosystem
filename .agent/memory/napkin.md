# Napkin

## Session: 2026-02-27 — M0 Documentation Remediation (17 items)

Executed the full M0 docs remediation plan in 6 phases. All 17 R-items complete.

### Key decisions

- README restructured from ~267 to ~145 lines by consolidating 3 overlapping "what's in the repo" sections, 2 architecture sections, and 2 quick start sections into single unified versions.
- "Agentic Engineering Practice" section reframed as "Engineering Practice" for external audience. Removed references to "single engineer" and internal practice mechanics.
- `LICENSE` renamed to `LICENCE` (British spelling). Required updating package.json `files` array and `prepublishOnly` script as well as all markdown references.
- ADR exact counts (114/116) replaced with "over 100" everywhere including the VISION baselines table.
- MCP README splits delegated to subagents successfully — content moved to `docs/` directories.
- SDK README reordered: install/usage now leads; architecture moved to `docs/architecture.md`.

### Reviewer findings addressed

- VISION.md baselines table had a stale "114" count — caught by docs-adr-reviewer and code-reviewer, fixed.
- SDK README logging example had `as Error` type assertion — caught by code-reviewer, fixed with `instanceof` guard.
- sdk-publishing-and-versioning-plan.md still referenced `LICENSE` — caught by docs-adr-reviewer, fixed.
- `.agent/experience/HUMAN.md` had oddly formatted self-reference link — caught by onboarding-reviewer and code-reviewer, fixed.

### What worked

- Batching related items into phases prevented drift between edits.
- Running markdownlint + format gates after each phase caught issues early.
- Delegating the MCP README splits to subagents was efficient and freed up time for the SDK README.

## Session: 2026-02-27 — HTTP MCP server README split

Split `apps/oak-curriculum-mcp-streamable-http/README.md` (was 1,330 lines) into:
- Product-facing README (~218 lines): title, quick start, Vercel deployment, Cursor config, auth, troubleshooting, search tools, how it works, testing, deployment preconditions
- `docs/operational-debugging.md`: request tracing, timing, runtime bootstrap diagnostics, error debugging, production logging, production diagnostics, historical context (OAuth metadata workarounds)
- `docs/widget-rendering.md`: widget cache-busting, branding, rendering architecture (dispatch pattern, four-way sync, helpers, data shapes, sandbox deps, edge cases, contract tests, resilience hardening)

Added "Detailed Documentation" section with links to both new docs. Updated distilled.md Widget Rendering pointer to new location. British spelling throughout; emoji removed from moved content.

## Session: 2026-02-27 — STDIO README split

Split `apps/oak-curriculum-mcp-stdio/README.md` into product-facing README (~122 lines) and `docs/operational-debugging.md` for operational content (request tracing, timing, error debugging, log management, workflows). British spelling throughout; emoji removed from moved content.

## Session: 2026-02-26 — Consolidation and Distillation

### What happened

Ran `/jc-consolidate-docs` across three plans: release-plan-m1,
onboarding-simulations, and Cursor snagging execution plan.

Created GDS-style milestone files (m0–m3) in `.agent/milestones/`.
Linked from root README, VISION.md, high-level-plan.md, and
plans/README.md.

Distilled napkin (871 lines, 20 sessions from 2026-02-24 to 2026-02-26).
Archived to `archive/napkin-2026-02-26.md`. Added 7 new entries to
distilled.md. Graduated 1 entry (search-sdk boundary) from full
description to ADR pointer. Deleted superseded Cursor plan.

### Consolidation findings

- No documentation trapped in any of the three plans. All are properly
  structured as execution documents.
- Experience files are reflective, not technical. No extraction needed.
- Practice box empty (only .gitkeep).
- The release plan (993 lines) and onboarding plan (886 lines) are both
  large but their size is justified — they track many items with full
  evidence chains. They will naturally shrink when archived after
  milestone completion.
