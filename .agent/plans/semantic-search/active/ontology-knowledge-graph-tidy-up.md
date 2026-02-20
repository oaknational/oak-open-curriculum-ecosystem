---
name: Ontology / Knowledge Graph Widget Tidy-Up
overview: >
  The `get-knowledge-graph` tool was removed and its data merged into the
  `get-ontology` tool. The knowledge graph widget renderer
  (`renderKnowledgeGraph`) was also removed — but a dangling reference in
  `widget-script.ts` causes a `ReferenceError` that crashes ALL widget
  rendering, failing all 19 Playwright UI tests. This plan removes the
  dead reference, migrates the knowledge graph SVGs into the ontology
  renderer, and cleans up all stale documentation references.
todos:
  - id: fix-widget-crash
    content: >
      Remove the dead `knowledgeGraph: renderKnowledgeGraph` line from the
      RENDERERS dispatcher in `widget-script.ts` (line 72). This is the
      root cause of ALL 19 UI test failures — the undefined function
      reference crashes the widget script at load time. Also remove
      `'knowledgeGraph'` from `RENDERER_IDS` in
      `widget-renderer-registry.ts` (line 29). Run `pnpm test:ui` to
      confirm all 19 tests now pass.
    status: pending
  - id: migrate-svgs-to-ontology
    content: >
      The knowledge graph SVGs (overview: 18 key concepts; full: 28
      concepts, 45 edges) are currently only in `widget-preview.html`.
      These SVGs visualise curriculum concept relationships and belong
      in the ontology renderer now that the data has been merged. Add
      them to the ontology renderer (`widget-renderers/ontology-renderer.ts`)
      as collapsible details sections. The SVG source strings are in
      `widget-renderers/svg-full-sections.ts` and `svg-full-edges.ts` —
      check whether these already contain the production SVGs or if the
      preview file is the only source.
    status: pending
  - id: clean-preview-file
    content: >
      In `widget-preview.html`: (1) remove `'get-knowledge-graph':
      'knowledgeGraph'` from the TOOL_RENDERER_MAP, (2) remove the
      `KNOWLEDGE_GRAPH_OVERVIEW_SVG` and `KNOWLEDGE_GRAPH_FULL_SVG`
      constants (after migrating to ontology renderer), (3) remove the
      `renderKnowledgeGraph` function, (4) remove `knowledgeGraph:
      renderKnowledgeGraph` from the RENDERERS dispatcher, (5) update
      the CTA prompt to remove `get-knowledge-graph` references.
    status: pending
  - id: update-docs
    content: >
      (1) `README.md` line 1071: update CTA description from
      "`get-ontology`, `get-knowledge-graph`, and `get-help`" to
      "`get-ontology` and `get-help`". (2) `.agent/prompts/
      learn-about-oak-cta.prompt.md`: this entire prompt is stale —
      it describes the old 3-tool CTA (`get-ontology`,
      `get-knowledge-graph`, `get-help`) and contains implementation
      details that have since been superseded by the CTA registry
      refactor (`src/widget-cta/registry.ts`). Either delete or
      rewrite to reflect current architecture. (3) Check for any
      other references to `get-knowledge-graph` or `knowledgeGraph`
      across the codebase.
    status: pending
  - id: quality-gates
    content: >
      Run full quality gate chain: `pnpm build && pnpm type-check &&
      pnpm lint:fix && pnpm format:root && pnpm markdownlint:root &&
      pnpm test && pnpm test:ui && pnpm test:e2e`
    status: pending
isProject: false
---

## Problem Statement

The `get-knowledge-graph` MCP tool was deliberately removed. Its
curriculum concept relationship data was merged into the `get-ontology`
tool response. However, the widget rendering code was not fully cleaned
up:

1. `widget-script.ts` line 72 references `renderKnowledgeGraph` in the
   `RENDERERS` dispatcher — this function no longer exists, causing a
   `ReferenceError` that crashes the entire widget script at load time
2. `widget-renderer-registry.ts` still lists `'knowledgeGraph'` in
   `RENDERER_IDS` even though no tool maps to it
3. `widget-preview.html` still contains the full knowledge graph
   renderer, SVG constants, and tool mapping
4. Documentation (`README.md`, agent prompts) still references the
   removed tool

The crash in (1) is the root cause of all 19 Playwright UI test
failures — because the widget script fails to load, NO rendering works.

## SVG Migration

The knowledge graph SVGs are valuable curriculum visualisations:

- **Overview SVG**: 18 key concepts across 5 groups (Context, Core
  Structure, Taxonomy, Content, KS4) with explicit and inferred edges
- **Full SVG**: 28 concepts, 45 edges across 6 groups (adds Metadata
  group with Keywords, Misconceptions, Content Guidance, etc.)

These SVGs should be preserved and moved into the ontology renderer,
since the ontology tool now owns the curriculum structure data. They
can be added as collapsible `<details>` sections.

Check `widget-renderers/svg-full-sections.ts` and `svg-full-edges.ts`
— these files may already contain the production SVG data. If so, the
preview file's inline SVGs are duplicates.

## Affected Files

### Must Change

| File | Change |
|------|--------|
| `widget-script.ts` | Remove `knowledgeGraph: renderKnowledgeGraph` from RENDERERS |
| `widget-renderer-registry.ts` | Remove `'knowledgeGraph'` from RENDERER_IDS |
| `widget-renderers/ontology-renderer.ts` | Add knowledge graph SVGs as collapsible sections |
| `widget-preview.html` | Remove KG mapping, SVGs, renderer, CTA prompt reference |
| `README.md` | Update CTA description |
| `.agent/prompts/learn-about-oak-cta.prompt.md` | Rewrite or delete (stale) |

### Must NOT Change

| File | Reason |
|------|--------|
| `widget-renderer-registry.unit.test.ts` | Does not reference `knowledgeGraph` |
| `widget-cta/registry.ts` | Already updated (references `get-ontology` and `get-help` only) |
| `widget-renderers/index.ts` | Does not import a knowledge graph renderer |
