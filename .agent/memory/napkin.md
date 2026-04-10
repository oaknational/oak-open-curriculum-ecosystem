## Napkin rotation — 2026-04-10

Rotated at 508 lines after the PR #76 merge-handoff sync,
Vercel/bootstrap remediation, and HTTP dev-contract closeout.
Archived to `archive/napkin-2026-04-10.md`. Merged 0 new
entries into `distilled.md`. Graduated/pruned 9 entries now
covered by permanent docs or source TSDoc: barrel-export
reminder, `pnpm vocab-gen` reminder, MCP tool-count pointer,
canonical logger rule, `Awaited<TResult>` wrapper note,
singlefile MCP Apps build note, content-item CSP placement,
tool `name` vs `title`, and contrast usage context.
Extracted 0 new patterns (the new dev-orchestration learning
is documented in permanent docs and plans for now). Previous
rotation: 2026-04-07 at 562 lines.

---

### Session 2026-04-10a — post-rotation continuity seed

#### Current state

- Phase 6 merge-handoff and the Vercel/bootstrap plan are locally green after
  `pnpm check`, the built-artifact proof, and the dev-orchestration acceptance
  check.
- Remaining external step: commit/push `feat/mcp_app_ui`, then recheck the
  deployed preview/build logs before PR #76 merges.

### Session 2026-04-10b — Cursor plugins strategic plan

- Added `developer-experience/future/cursor-plugins-practice-and-oak-developer.plan.md`:
  marketplace-track Practice plugin vs local-first Oak developer plugin (MCP HTTP,
  codegen, SDK, search). Promotion gated on marketplace spike + A↔B layering decision.
  No scaffold yet — exploration only.

### Session 2026-04-10c — Vercel widget crash re-investigation

- Re-validated preview deployment `dpl_LuHvjnukFy7RjQuetxmNk7tmBsDP` via Vercel MCP:
  deployment reports `READY`, but runtime logs show repeated `500` responses with
  `initializeCoreEndpoints` failure signature across `/`, `/mcp`, and well-known auth paths.
- Added explicit debug instrumentation (session `ae9818`) in:
  `src/application.ts`, `src/validate-widget-html.ts`, and
  `src/register-widget-resource.ts` with hypothesis IDs H1/H2/H4/H5.
- Created investigation notes in
  `.agent/plans/sdk-and-mcp-enhancements/active/vercel-widget-crash-deep-investigation.notes.md`
  to keep detailed reasoning in plan artefacts (not only napkin).
