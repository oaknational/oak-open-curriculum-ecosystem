# TSDoc Generated Documentation Overhaul

**Created**: 2026-02-23
**Status**: NOT STARTED
**Priority**: Medium — improves DX for SDK consumers and
contributors

---

## Intent

Analyse and overhaul the TypeDoc-generated documentation across
the monorepo. The current generated docs exist but have not been
reviewed for quality, completeness, or usability. This plan
covers auditing what we generate, how we generate it, and
whether the output is actually useful to developers consuming
the SDK or contributing to the codebase.

## Current State

Two workspaces generate docs via `pnpm doc-gen`:

- **oak-curriculum-sdk** — HTML, JSON, Markdown, and AI-summary
  outputs via TypeDoc + typedoc-plugin-markdown
- **oak-search-cli** — HTML and JSON outputs via TypeDoc

Root-level `pnpm doc-gen` triggers both via Turbo.

### Known Concerns

- Generated docs have not been audited for accuracy or
  completeness
- TSDoc annotations across the codebase vary in quality — some
  modules are well-documented, others have minimal or stale
  annotations
- TypeDoc configuration (`typedoc.json`, `typedoc.ai.json`,
  `typedoc.mcp.json`) may have diverged from actual source
  structure
- The relationship between generated docs, authored markdown in
  `docs/`, and READMEs is unclear to newcomers
- `--skipErrorChecking` is used everywhere, masking potential
  issues

## Phases

### Phase 1: Audit

- [ ] Run `pnpm doc-gen` and review all outputs
- [ ] Catalogue which modules/exports have good TSDoc vs sparse
      or missing annotations
- [ ] Review TypeDoc configs for accuracy (entry points, excludes,
      plugin settings)
- [ ] Assess whether `--skipErrorChecking` is hiding real problems
- [ ] Check the generated-document-pipeline-extraction-plan for
      overlap — determine if extraction should happen before or
      after this overhaul
- [ ] Document findings

### Phase 2: TSDoc Annotation Quality

- [ ] Identify high-value public API surfaces that need better
      annotations (SDK exports, MCP tool types, search types)
- [ ] Add/improve TSDoc for priority surfaces — descriptions,
      `@param`, `@returns`, `@example`, `@see` links
- [ ] Remove stale or misleading annotations
- [ ] Ensure `@public`/`@internal` markers are used correctly to
      control what appears in generated docs

### Phase 3: TypeDoc Configuration

- [ ] Remove `--skipErrorChecking` and fix any surfaced issues
- [ ] Review and update entry points to match current source
      structure
- [ ] Evaluate whether multiple TypeDoc configs (json, ai, mcp)
      are justified or should be consolidated
- [ ] Ensure generated output structure is navigable and useful

### Phase 4: Integration and Discovery

- [ ] Ensure generated docs are linked from workspace READMEs
- [ ] Add a "Generated API Reference" section to the SDK README
- [ ] Confirm `pnpm doc-gen` is part of the standard quality gate
      chain
- [ ] Consider whether generated docs should be published
      (GitHub Pages, npm package, or just local reference)

## Success Criteria

- All public API surfaces have meaningful TSDoc annotations
- `pnpm doc-gen` runs without `--skipErrorChecking` and produces
  zero warnings
- Generated docs are navigable and useful to a developer who has
  never seen the codebase
- Clear relationship between generated docs and authored
  documentation

## Related

- [generated-document-pipeline-extraction-plan.md](./generated-document-pipeline-extraction-plan.md)
  — shared docs pipeline (may execute before or after this)
- [sdk-publishing-and-versioning-plan.md](./sdk-publishing-and-versioning-plan.md)
  — published packages need good generated docs
