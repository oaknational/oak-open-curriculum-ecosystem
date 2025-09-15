# Generated Documentation Enhancements Plan

Role: Address long-term documentation quality for generated types and public API clarity across the SDK and Search workspaces.

## Objectives

- Eliminate noisy TypeDoc warnings without exposing unnecessary generated internals.
- Curate a stable, well-annotated public API surface with thoughtful TSDoc.
- Keep long/generated data structures accessible via separate, linked documents for deep dives.
- Make sure the generated docs are easily read online, e.g. linking from other markdown files so they can be readily discovered on GitHub. Apps with a web UI should additionally have a `/docs` page that displays the generated docs for that workspace.

## Approach

- Public API design
  - Introduce curated aliases (e.g., `OakKeyStage`, `OakSubject`, `OakAssetType`) in `src/types/public-types.ts` and re-export them as the canonical types.
  - Replace leaks of raw generated internals in public signatures with curated aliases or documented interfaces.
  - For SDK adapters (Search workspace), define documented interfaces (e.g., `OakSdkClient`) instead of returning inlined structural types.
- TSDoc first
  - Add concise, example-rich TSDoc to all public exports. Include links back to this plan for context.
  - Use `@remarks`, `@example`, and `@see` to connect to authored docs and deep-dive files.
- Large structures
  - Maintain "deep-dive" authored docs under `docs/` (e.g., generated enum/constant catalogues, endpoint maps). Link from API pages to these documents rather than expanding internals inline.
- TypeDoc configuration
  - Keep TypeDoc entry points minimal (curated wrappers only). Avoid including entire generated trees.
  - Extend verification to allowlist known referenced internals temporarily while curation is in progress.

## Milestones

1. Curated aliases and client interfaces
   - SDK: Public aliases for KeyStage, Subject, AssetType (done in short-term pass; iterate as needed).
   - Search: `OakSdkClient` interface exported and documented (done in short-term pass).
2. TSDoc pass
   - Annotate public modules in SDK (`src/index.ts`, `src/types/public-types.ts`) and Search (`src/adapters`, `src/lib/*`).
3. Deep-dive docs
   - Add authored documents indexing allowed values and endpoint maps; link from API docs.
4. Verification and CI
   - Implement allowlist in `docs:verify` for a limited period; target remove when curated API is complete.

## Acceptance

- `pnpm doc-gen` runs clean or with a bounded allowlist; no confusing missing-symbol warnings.
- API docs emphasise curated types and interfaces with useful TSDoc and links to deep dives.
- No accidental exposure of unstable generated internals in the public API.

## Progress (2025‑09‑14)

- Search workspace docs upgraded: authored pages refined; `doc-gen` added; authored vs generated
  docs clarified. Root `doc-gen` convenience script available.
- SDK TypeDoc configs hardened with `treatValidationWarningsAsErrors: true`.
- Removed TypeDoc suppression wrappers in both workspaces; focusing on structural fixes.
- SDK warnings reduced by exporting generated helper types in typegen and curating entry points.
- Remaining SDK warnings addressed by explicitly exporting `PathParameters`, `ValidPathGroupings`,
  and bridging `SchemaBase` via `docs/_typedoc_src/types/schema-bridge.ts`.
- Separate MCP docs tree added with authored overview and dedicated `typedoc.mcp.json`.

## Recent related fixes

- Logger packaging: bundle single ESM runtime entry while keeping extensionless source imports for
  app builds; guidance added to logger README. Prevented ESM resolution issues in tests.
- Notion e2e: repo‑root env loading via `@oaknational/mcp-env` (`loadRootEnv`) to ensure
  `NOTION_API_KEY` is found; e2e now green.

## What remains

- SDK docs: verify zero warnings consistently across clean runs and CI.
- Complete TSDoc pass on curated public surfaces in SDK and Search (examples, @remarks, @see).
- Author deep‑dive catalogues for large generated structures and link them from API pages.
- Re‑evaluate extracting `packages/libs/docs-pipeline` once current pipelines are fully stable.

## Deferred items

- SDK zero‑warnings verification across clean local and CI runs, with fixes driven by:
  - Ensuring `PathParameters`, `ValidPathGroupings`, `PathGroupingKeys`, and `SchemaBase` are
    exported only via curated entry points consumed by TypeDoc.
  - Removing any remaining accidental references to non‑exported internals from public types.
- Full TSDoc coverage on curated SDK/Search public surfaces with examples and cross‑links to
  authored deep‑dives.
- Authored deep‑dive documents (enum/value catalogues, endpoint maps) linked from API pages.
- Post‑stabilisation: consider extracting shared docs pipeline (`packages/libs/docs-pipeline`).
