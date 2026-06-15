---
name: "Retire the committed oak-curriculum-sdk api-md typedoc estate"
collection: sdk-and-mcp-enhancements
lane: future
status: decided
last_updated: 2026-06-15
---

# Retire the committed `oak-curriculum-sdk` `docs/api-md` typedoc estate

> **Decided, not yet executed.** The retire direction is owner-ratified
> (2026-06-15, Q-010); this plan carries the decision and the execution scope
> discovered during the consolidation drain, so a focused sdk session executes it
> with the generator understood first-hand. It is NOT consolidation work and was
> not folded into a memory-consolidation commit.

## Decision (owner, 2026-06-15)

**Retire** the committed `packages/sdks/oak-curriculum-sdk/docs/api-md/` tree
(135 files): typedoc output is derivable on demand, and committed copies drift by
construction. Remove the dangling turbo `doc-gen` output glob, and repoint the one
weak doc pointer to the generation command. Retire over repair unless a named
consumer reads the committed markdown (none found at decision time).

## Why (the orphaned + stale state that prompted it)

- `docs:api` (`typedoc --options typedoc.json`) is wired into no root script and no
  turbo task; nothing regenerates the committed tree in the normal flow.
- `typedoc.json` still lists a `docs/_typedoc_src/...` entrypoint deleted in the
  2026-02-16 cleanup, so a bare `docs:api` run **warns and exits 2** — "derivable
  on demand" does not currently hold without a generator fix.
- A bare regeneration produces a structurally different, far smaller tree (≈135
  files changed, −16k lines; `PATH_OPERATIONS.md` / `schema.md` deleted).
- The committed tree embeds pre-rewrite upstream descriptions (stale doc surface
  after the PR #200 description rewrite).
- The turbo `doc-gen` task declares `**/docs/api-md/**` as an output its script
  never writes (config review finding).

## Execution scope (discovered 2026-06-15 — analyse the generator first)

The generator is the source of truth: read it before deleting anything.

- **Committed tree**: `packages/sdks/oak-curriculum-sdk/docs/api-md/` (135 files) —
  remove from version control; gitignore the path if the on-demand output is kept.
- **turbo `doc-gen` output glob**: drop `"**/docs/api-md/**"` from `turbo.json`
  (line ~46) — the dangling output.
- **Generator + scripts** (decide keep-as-on-demand vs retire, having read them):
  `package.json` `docs:api` / `docs:api:html` / `docs:api:json` / `docs:api:json:ai`;
  `typedoc.json` (the stale entrypoint must be fixed if the script is kept, or the
  script retired if not); `packages/sdks/oak-sdk-codegen/code-generation/`
  (`generate-markdown-docs.ts`, `verify-docs.ts`, `generate-ai-doc.ts`).
- **Pointers / docs**: `packages/sdks/oak-curriculum-sdk/docs/mcp/README.md` (repoint
  to the generation command), `docs/docs-pipeline.md` (update the pipeline doc).
- **Ignore-config refs** (cleanup if the path goes): `packages/core/oak-eslint/src/shared.ts`,
  `apps/oak-search-cli/package.json`.

## Verification

A regeneration (or a clean removal) leaves `pnpm build` / `doc-gen` green with no
dangling turbo output and no stale typedoc entrypoint warning; `rg "api-md"` over
live (non-archive, non-log) surfaces returns only intended references.

## Promotion trigger

The next sdk-codegen / docs-pipeline session, or owner direction to schedule it.
