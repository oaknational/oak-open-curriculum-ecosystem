---
name: "Phase 4.5: Tool Metadata Shape Correction"
overview: "Consolidate the landed tool metadata shape refactor with TSDoc, live-doc sync, targeted proof, and final review before Phase 6a."
specialist_reviewer: "architecture-reviewer-fred, type-reviewer, mcp-reviewer, test-reviewer, code-reviewer"
isProject: false
todos:
  - id: t0-deps
    content: "T0: Update all outdated dependencies (except Zod/TS)"
    status: done
  - id: t1-red-satisfies
    content: "T1 (RED): Tests with inputSchema rename (compiler errors = RED)"
    status: done
  - id: t2-red-no-input
    content: "T2 (RED): Tests asserting no-input tools have empty inputSchema"
    status: done
  - id: t3-green-fix-widening
    content: "T3 (GREEN): Replace widening structural check with satisfies"
    status: done
  - id: t4-green-rename-inputschema
    content: "T4 (GREEN): Rename the legacy schema field to inputSchema across authored universal-tool surfaces"
    status: done
  - id: t5-green-no-input
    content: "T5 (GREEN): No-input tools use empty ZodRawShape (MCP spec compliant)"
    status: done
  - id: t6-green-inline-projection
    content: "T6 (GREEN): Delete projections.ts, inline at call site, relocate type guards, require title/description"
    status: done
  - id: t7-refactor-docs
    content: "T7 (REFACTOR): TSDoc, active-doc sync, and stale-comment cleanup"
    status: done
  - id: t8-quality-gates
    content: "T8: Full quality gate chain"
    status: done
  - id: t9-adversarial-review
    content: "T9: Final consolidated reviewer pass for Phase 4.5 and Phase 6a"
    status: done
---

# Phase 4.5: Tool Metadata Shape Correction

**Last Updated**: 2026-04-09
**Status**: COMPLETE — Phase 4.5 wrap-up finished; Phase 6a pre-merge closure is next
**Scope**: Finish the landed metadata-shape refactor with documentation,
verification, and review closure. No widget build changes.
**Branch**: `feat/mcp_app_ui` (existing)

---

## Context

The core shape correction already landed in `c4d37089`:

- the projection layer is deleted
- `listUniversalTools()` now returns registration-ready metadata
- `inputSchema` is present on every tool entry, with `{}` for no-input tools
- generated tools fail fast if title or description is missing

The remaining work is now strictly pre-merge wrap-up:

1. add comprehensive example-bearing TSDoc on the authored public exports
2. sync active plans, prompts, READMEs, and ADRs to the landed contract
3. run targeted proof before the final reviewer superset and aggregate gate

### Non-Goals

- generated human-friendly tool titles (codegen follow-up)
- preview-only widget path fixes
- misconception graph MCP surface
- Phase 5 interactive user-search UI work

### What Was Dropped (and Why)

The original plan proposed removing `vite-plugin-singlefile`. Six
specialist reviewers (assumptions, MCP, architecture, type, react, docs)
unanimously determined this was wrong:

- `vite-plugin-singlefile` IS the canonical MCP Apps build pattern
  (confirmed in official quickstart, all upstream examples, both agent skills)
- The host loads HTML via `document.write()` into a sandboxed iframe
  with no backing web server — external `<script src>` references would
  resolve to nothing
- The widget IS already a live React MCP App — verified by inspecting
  the built artefact for `createRoot`, `useApp`, `PostMessageTransport`,
  and all MCP Apps lifecycle handlers
- Confirmed by temporarily disabling the plugin: Vite produces separate
  files that cannot load in the iframe delivery model

### Reviewer Findings Already Incorporated

| Source | Finding | How Addressed |
|--------|---------|---------------|
| Fred F1 | `securitySchemes` not in SDK config | T6: confirm auth checker's direct-lookup is preserved |
| Fred F2 | `as const` readonly vs mutable `_meta` | T6: inline `{ ...def._meta }` spread at call site |
| Fred F4 | `list-tools.ts` missing from file list | T4: included |
| Fred F6 | `isAppToolEntry`/`AppToolListEntry` relocation | T6: move to types.ts |
| Type T1 | `definitions.ts:134` widening assignment | T3: fix with `satisfies` |
| Type T3 | Legacy schema field typed as `z.ZodRawShape` | T4: replace with direct `inputSchema` contract |
| Type W3 | Generated tools `?? {}` fallback | T7: fail fast on generated flat-input-schema drift |
| MCP 3 | `annotations?.title` dead fallback | T7: centralise title resolution (top-level `title` first, `annotations.title` fallback in one helper until codegen catches up) |
| MCP 1 | `inputSchema` wire output identical | T2 narrative adjusted |

---

## Completed Foundation Work

All outdated dependencies updated (except Zod and TypeScript):

- Minor/patch: vitest 4.1.3, @clerk/* 3.2.7/2.0.11, @types/node 25.5.2,
  @playwright/test 1.59.1, @sentry/node 10.47.0, eslint 10.2.0, knip 6.3.1,
  turbo 2.9.5, react 19.2.4, dotenv 17.4.1, typescript-eslint 8.58.1
- MCP SDK: @modelcontextprotocol/sdk 1.29.0, ext-apps 1.5.0
- Major: Vite 8.0, @vitejs/plugin-react 6.0, cross-env 10.1
- jsdom replaced with happy-dom (widget tests)
- Removed `.js` suffixes from 60 files of `@modelcontextprotocol/sdk/*` imports
- Migrated deprecated ext-apps `on*` callbacks to `addEventListener`
- Targeted proof chain, consolidated reviewer pass, upstream host smoke, and
  the canonical aggregate `pnpm check` all passed on 2026-04-09

---

## Design Principles

1. **Build directly to the target interface** — tool metadata is produced
   once in the shape the SDK consumes. No intermediate representations.
2. **No-input tools declare an empty object schema** — per MCP spec,
   `inputSchema` MUST be a valid JSON Schema object. No-input tools use
   an empty `ZodRawShape` (`{}`) which produces `{ "type": "object",
   "additionalProperties": false }` on the wire (Zod v4 default strict).
   This preserves the SDK's 2-arg handler signature for all tools.
3. **Inline spread, not a projection layer** — the only non-trivial
   operation in the projection is `{ ...tool._meta }` to strip readonly.
   This belongs at the call site, not in a single-consumer abstraction.
4. **Title and description are required** — `UniversalToolListEntry`
   requires both. The SDK owns one title-resolution rule for generated
   tools: top-level `title` first, then `annotations.title` until the
   codegen template catches up. Missing metadata still fails fast.

**Non-Goals** (YAGNI):

- Changing the widget build (vite-plugin-singlefile is correct)
- Adding interactivity to the banner (Phase 5)
- Changing `resources/read` serving mechanism
- Restructuring the generated tool codegen pipeline (just rename the field)

---

## WS3 — Documentation and Polish (REFACTOR)

### T7: TSDoc and Documentation

- Add example-bearing TSDoc on the authored public exports touched by
  Phase 4.5:
  - `AGGREGATED_TOOL_DEFS`
  - `GeneratedToolRegistry`
  - `UniversalToolListEntry`
  - `AppToolListEntry`
  - `generatedToolRegistry`
  - `listUniversalTools`
  - `isAppToolEntry`
  - `createUniversalToolExecutor`
  - `UniversalToolExecutorDependencies`
  - `RegisterHandlersOptions`
  - `registerHandlers`
- Remove stale active-path prose that still describes omitted `inputSchema`
  or pre-removal projection behaviour
- Sync the live planning/docs stack:
  - `.agent/prompts/session-continuation.prompt.md`
  - `.agent/plans/sdk-and-mcp-enhancements/active/README.md`
  - `.agent/plans/sdk-and-mcp-enhancements/current/README.md`
  - `.agent/plans/sdk-and-mcp-enhancements/roadmap.md`
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`
  - `apps/oak-curriculum-mcp-streamable-http/README.md`
  - `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md`
  - `docs/architecture/architectural-decisions/055-zod-version-boundaries.md`
  - `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md`

---

## WS4 — Quality Gates (T8)

Run targeted proof before the aggregate gate:

```bash
pnpm type-check
pnpm test --filter @oaknational/curriculum-sdk
pnpm test --filter @oaknational/oak-curriculum-mcp-streamable-http
pnpm doc-gen
rg -n --hidden \
  'window\.openai|openai/|text/html\+skybridge|__mcpPreview|chatgpt-emulation|oak-json-viewer|undefined\?\.tool(Output|Input)' \
  apps/oak-curriculum-mcp-streamable-http \
  packages/sdks/oak-curriculum-sdk \
  packages/sdks/oak-sdk-codegen
rg -n 'inputSchema: undefined|No-input tools set|omit inputSchema|flatZodSchema' \
  .agent/prompts/session-continuation.prompt.md \
  .agent/plans/sdk-and-mcp-enhancements/active/README.md \
  .agent/plans/sdk-and-mcp-enhancements/current/README.md \
  .agent/plans/sdk-and-mcp-enhancements/roadmap.md \
  .agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md \
  packages/sdks/oak-curriculum-sdk/src \
  apps/oak-curriculum-mcp-streamable-http/src \
  apps/oak-curriculum-mcp-streamable-http/README.md \
  apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md \
  docs/architecture/architectural-decisions/055-zod-version-boundaries.md \
  docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md
```

Then run the final aggregate readiness gate:

```bash
pnpm check
```

---

## WS5 — Adversarial Review (T9)

Run one consolidated reviewer pass that satisfies both Phase 4.5 and the
pre-merge Phase 6a reviewer requirement:

- `mcp-reviewer`
- `code-reviewer`
- `test-reviewer`
- `type-reviewer`
- `config-reviewer`
- `security-reviewer`
- `docs-adr-reviewer`
- `architecture-reviewer-barney`
- `architecture-reviewer-betty`
- `architecture-reviewer-fred`
- `architecture-reviewer-wilma`

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `as const` definitions don't satisfy mutable `_meta` index signature | Type errors | T1 satisfies tests prove compatibility before removal |
| `securitySchemes` silently dropped from registration | Auth check breaks | Verify auth checker's direct-lookup pattern is preserved |
| Generated tools still pass `{}` after aggregated tools fixed | Inconsistency | T5 explicitly covers `list-tools.ts` generated path |
| `aggregated-flat-zod-schema.integration.test.ts` has 15+ references | Compile errors | T4 includes this file in the change list |

---

## Foundation Alignment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md`
2. **Re-read** `.agent/directives/testing-strategy.md`
3. **Re-read** `.agent/directives/schema-first-execution.md`
4. **Ask**: "Could it be simpler without compromising quality?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Dependencies

**Blocking**: None — pre-merge work on `feat/mcp_app_ui`

**Related Plans**:

- `../archive/completed/ws3-phase-4-brand-banner.plan.md` — Phase 4 (COMPLETE)
- `ws3-phase-6-docs-gates-review-commit.plan.md` — immediate next pre-merge
  phase after this wrap-up lands
- `ws3-phase-5-interactive-user-search-view.plan.md` — Phase 5 remains
  post-merge and depends on the stable live React foundation from this plan
- `../archive/completed/widget-pipeline-idiomatic-alignment.plan.md` —
  Reviewer findings (COMPLETE)

---

## Consolidation

After all work is complete and quality gates pass, run `jc-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange.
