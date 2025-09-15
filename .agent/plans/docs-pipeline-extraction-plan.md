# Shared Docs Pipeline Extraction Plan (draft)

Role: Define the steps to factor out common documentation generation logic into a reusable workspace `packages/libs/docs-pipeline` to serve both the SDK and the Search app.

## Goals

- Provide a small CLI/library to:
  - prepare sources (sanitise JSDoc, copy curated entry points),
  - run TypeDoc to produce HTML/JSON,
  - render AI and Markdown outputs (optional),
  - verify outputs (presence and zero-warning policy).
- Remove duplication across workspaces and enforce a zero‑warning baseline in CI.

## Scope (initial)

- Create `packages/libs/docs-pipeline` with pure TypeScript helpers and a thin CLI.
- Migrate SDK scripts (`scripts/sanitize-docs.ts`, `scripts/generate-ai-doc.ts`, `scripts/generate-markdown-docs.ts`, `scripts/verify-docs.ts`) into library modules and a CLI entry.
- Add equivalent usage to Search app (`doc-gen`), retaining minimal workspace-specific config (typedoc.json entry points).

## Non-goals (initial)

- Changing TypeDoc themes or switching to different doc frameworks.
- Cross-repo publishing; keep internal to the monorepo for now.

## Tasks

1. Create workspace scaffold under `packages/libs/docs-pipeline`.
2. Extract and generalise sanitiser (input/output paths as params).
3. Extract TypeDoc runners (HTML/JSON) with version pinning.
4. Extract AI/Markdown renderers with stable input/output contracts.
5. Implement `verify` step and zero-warning assertion (configurable allowlist).
6. Wire SDK to use the shared CLI; remove duplicated scripts.
7. Wire Search app to use the shared CLI; simplify package.json scripts.
8. Update CI to run shared pipeline; enforce zero warnings.

## Acceptance

- SDK and Search app produce identical docs via the shared CLI.
- Local and CI runs succeed; warnings at or below configured allowlist.
- Workspace README/docs updated to reflect new commands.
