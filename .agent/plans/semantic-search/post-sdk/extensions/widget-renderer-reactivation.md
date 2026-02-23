# Widget Renderer Reactivation

**Stream**: extensions
**Status**: ⏸️ Blocked — awaiting prerequisites
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)
**Created**: 2026-02-23
**Last Updated**: 2026-02-23

---

## Overview

Reactivate the widget renderers (search, browse, explore) that are
parked for the current release. The renderer functions already exist
and are tested; they need to be wired back into the
`TOOL_RENDERER_MAP` in `widget-renderer-registry.ts` once the
prerequisites below are satisfied.

The widget currently ships as a header-only shell (Oak logo +
heading) for all tools. After reactivation, search-family tools
will render rich results (lesson cards, browse facets, explore
multi-scope views) inside the ChatGPT iframe.

---

## What Already Exists

| Component | Location | Status |
|-----------|----------|--------|
| Search renderer | `src/widget-renderers/search-renderer.ts` | Complete, tested |
| Browse renderer | `src/widget-renderers/browse-renderer.ts` | Complete, tested |
| Explore renderer | `src/widget-renderers/explore-renderer.ts` | Complete, tested |
| Renderer registry | `src/widget-renderer-registry.ts` | Parked — entries commented out |
| Four-way sync tests | `src/widget-renderer-registry.unit.test.ts` | Verifying parked state |
| Renderer contract tests | `src/widget-renderers/renderer-contracts.integration.test.ts` | Active |
| CSS (content-sized layout) | `src/widget-styles.ts` | Complete — `#root` sizes to content with rounded corners |

All paths are relative to `apps/oak-curriculum-mcp-streamable-http/`.

---

## Prerequisites (All Must Be Satisfied)

1. **MCP extensions research complete**
   [mcp-extensions-research-and-planning.md](../../../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
   Domains A-C (research, specialist spec, refactoring backlog).
   Needed to confirm the widget metadata contract is host-neutral
   and the renderer stack aligns with the MCP Apps standard.

2. **OpenAI Apps SDK alignment complete**
   The subsequent OpenAI Apps SDK / MCP Apps integration work that
   follows the research plan. Needed to ensure the widget rendering
   approach is compatible with the finalised Apps SDK primitives
   (resource hosting, safe area handling, theme API).

3. **Current branch merged**
   `feat/semantic_search_deployment` merged to main. The parked
   renderers are a deliberate release-scoping decision for this
   merge.

---

## Reactivation Steps

1. Uncomment the three entries in `TOOL_RENDERER_MAP`:

   ```typescript
   export const TOOL_RENDERER_MAP = {
     search: 'search',
     'browse-curriculum': 'browse',
     'explore-topic': 'explore',
   } as const satisfies Readonly<Record<string, RendererId>>;
   ```

2. Update the unit test assertions in
   `widget-renderer-registry.unit.test.ts` from "parked" to
   "active" state (positive mapping assertions).

3. Update JSDoc in both the registry and test file to remove
   "parked for current release" language.

4. Verify all four-way sync tests pass (they already enforce
   that every map entry has a matching renderer function).

5. Run full quality gates: `pnpm type-check && pnpm lint:fix && pnpm test`.

---

## Relationship to MCP Extensions Plan

Domain D item 3 of the MCP extensions plan references:

> Search UX reintroduction aligned with new search backend and
> hard safety controls.

This plan is the concrete execution of that item for the widget
layer. Any changes to the renderer stack identified during
Domain C (refactoring backlog) should be applied before
reactivation.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [MCP extensions plan](../../../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) | Prerequisite research and refactoring |
| [Widget search rendering (archived)](../../archive/completed/widget-search-rendering.md) | Historical context — Phases 0-5 |
| [advanced-features.md](advanced-features.md) | Other extension capabilities |
| [../../active/search-results-quality.md](../../active/search-results-quality.md) | Search quality — feeds into result rendering |
