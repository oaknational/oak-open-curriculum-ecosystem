# Documentation Polish – TODO List

Intent: Deliver a single, AI-focused markdown reference that fully covers the SDK’s public API, including endpoint and MCP tool catalogs, along with practical context (auth, errors, limits), while keeping the existing HTML/MD docs healthy and consistent.

## Current Pipeline (findings)

- Command: `pnpm -F @oaknational/oak-curriculum-sdk docs:all`
  - Generates HTML via TypeDoc (`typedoc.ai.json`), TypeDoc JSON, an AI single-file markdown (`docs/api/AI-REFERENCE.md`), and multi-file markdown (`docs/api-md/*`).
  - Verifies artifacts via `scripts/verify-docs.ts`.
- TypeDoc inputs: entry point `src/index.ts`, excludes `src/types/generated/**` (generated OpenAPI artifacts).
- AI reference generator (`scripts/generate-ai-doc.ts`) builds from TypeDoc JSON only (so exports re-exported from excluded generated files generally don’t appear).
- Manual docs present:
  - `docs/docs-pipeline.md` (accurate overall but states AI doc path as `docs/oak-open-curriculum-api-sdk-reference.md`, which is outdated).
  - `docs/oak-open-curriculum-api-sdk-reference.md` (manual guide, overlaps with generated outputs; likely stale).
- Resulting gap: The AI doc is decent for exported functions/types but lacks a comprehensive endpoint catalog and MCP tool catalog because those come from excluded generated sources.
- Minor nits in AI doc rendering: heading pluralization (e.g., “Classs”, “Type aliass”), and some verbose placeholder types like `<reflection>(…)` from TypeDoc nodes.

## Decisions

- Keep TypeDoc excludes for generated sources (HTML + human-facing docs stay clean), but extend the AI doc generator to import generated artifacts directly at build time to enumerate endpoints and MCP tools.
- Make `docs/api/AI-REFERENCE.md` the canonical AI doc and update/remove the manual `oak-open-curriculum-api-sdk-reference.md` (replace with a short pointer).
- Improve AI doc headings and add curated sections (Auth, Errors, Rate Limits, Conventions), plus verified endpoint/tool catalogs with examples.

## Tasks

1. ACTION: Add curated sections to AI doc generator (Auth, Error model, Rate limits, Base URL, conventions)
2. REVIEW: Confirm content aligns with README and SDK behavior (env-agnostic, API key passing)
3. GROUNDING: read GO.md and follow all instructions
4. ACTION: Add Endpoint Catalog to AI doc by importing `PATH_OPERATIONS` and reading summaries from `schema` where possible
5. REVIEW: Validate operation count matches schema; sample a few entries for correctness
6. QUALITY-GATE: Run `pnpm -F @oaknational/oak-curriculum-sdk docs:ai && pnpm -s -F @oaknational/oak-curriculum-sdk docs:verify`
7. ACTION: Add MCP Tool Catalog to AI doc (list `MCP_TOOLS`, map to path/method, include input schema summary and example args)
8. REVIEW: Validate tool count and spot-check tool-to-operation mapping
9. GROUNDING: read GO.md and follow all instructions
10. ACTION: Fix pluralization in AI rendering (e.g., “Class” → “Classes”, “Type alias” → “Type Aliases”)
11. REVIEW: Regenerate and confirm section headings look correct
12. QUALITY-GATE: Run full docs pipeline `docs:all` and verify
13. ACTION: Update `docs/docs-pipeline.md` to reflect canonical AI doc path (`docs/api/AI-REFERENCE.md`) and add a note deprecating the manual file
14. REVIEW: Replace contents of `docs/oak-open-curriculum-api-sdk-reference.md` with a pointer to the generated AI doc (or remove if preferred)
15. GROUNDING: read GO.md and follow all instructions
16. QUALITY-GATE: Final `docs:verify` and minimal diff review of generated files
17. ACTION: Summarize changes and recommendations in PR description
18. REVIEW: Confirm with maintainers the desired level of detail for AI doc examples (tokens vs brevity)

## Potential Enhancements (optional)

- Add a short “Playbook” section to AI doc with common flows (e.g., find lessons by subject→fetch summary→fetch assets), showing minimal code and typical params.
- Improve type formatter to reduce `<reflection>(…)` placeholders for advanced TypeDoc nodes.
- Extend `docs:verify` to check that the Endpoint/Tool Catalogs are non-empty and counts match generated artifacts.
