---
name: Ontology / Knowledge Graph Widget Tidy-Up
overview: >
  COMPLETE: Widget crash fixed, KG SVGs migrated to ontology renderer,
  preview cleaned, and stale active documentation references resolved.
  All 26 UI tests pass. Remaining mentions of `get-knowledge-graph`
  are in archival/historical documents only.
todos:
  - id: fix-widget-crash
    content: >
      DONE: Removed dead `knowledgeGraph: renderKnowledgeGraph` from the
      RENDERERS dispatcher in `widget-script.ts`. Removed `'knowledgeGraph'`
      from `RENDERER_IDS` in `widget-renderer-registry.ts`. All 26 UI
      tests pass.
    status: completed
  - id: migrate-svgs-to-ontology
    content: >
      DONE: Knowledge graph SVGs extracted to
      `widget-renderers/ontology-graph-svgs.ts` and integrated into the
      ontology renderer as collapsible details sections.
    status: completed
  - id: clean-preview-file
    content: >
      DONE: widget-preview.html cleaned up — stale KG tool mapping,
      SVG constants, renderer function, and RENDERERS dispatcher entry
      removed.
    status: completed
  - id: update-docs
    content: >
      DONE: Active docs verified. No stale `get-knowledge-graph` references
      remain in `README.md` or active prompts. The previously referenced
      `.agent/prompts/learn-about-oak-cta.prompt.md` file does not exist;
      related references are in archive/historical materials only.
    status: completed
  - id: quality-gates
    content: >
      DONE: Full quality gate chain passes — type-gen, build,
      type-check, lint:fix, format:root, markdownlint:root, test,
      test:e2e, test:ui (26 pass), smoke:dev:stub. All gates green.
    status: completed
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
