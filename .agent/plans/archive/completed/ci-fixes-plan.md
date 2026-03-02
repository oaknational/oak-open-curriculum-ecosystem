# CI Lint Divergence – Analysis and Fix Plan

## Summary

CI lint still fails only for `@oaknational/oak-curriculum-mcp` with cascades of “Unsafe call/member access of an error typed value” and `restrict-template-expressions` on values derived from the SDK (e.g. `MCP_TOOLS`, `createOakPathBasedClient`). Locally, `pnpm lint --only` passes across all packages, even after `pnpm clean`.

Primary cause: In CI, ESLint’s type-aware analysis is running against a TypeScript program that does not include cross‑package source types for the SDK, so imported symbols degrade to the TS internal “error” type (and sometimes `any`). The same imports resolve to proper types locally.

## Why local vs CI differs

- TypeScript program selection: We configured per‑package ESLint to point both the parser and the `import-x` resolver to the root lint tsconfig (`tsconfig.lint.root.json`) so cross‑package types are available from `src/`. However, `typescript-eslint` v8 enables the TypeScript Project Service by default. The project service can select a tsconfig per file, ignoring an explicit `project` in some cases. In CI, the service likely builds a per‑package program (from that package’s tsconfig), which does not include other packages’ `src/`, and there are no `dist` declarations yet; imported SDK types then appear as “error”/`any` and trigger unsafe rule cascades.
- Local stability despite `pnpm clean`: Cleaning removes `dist/`, but our local ESLint session still analyses using the root program (or has a warmed project service cache that includes the root config), so it sees SDK `src/` and retains full types. Thus, cleaning artefacts doesn’t reproduce the CI behaviour locally.
- Not an import existence issue: CI no longer reports `import-x/no-unresolved`; resolution succeeds, but type information is missing in the CI TypeScript program used by ESLint.

## Proposed fix (monorepo‑friendly, no build dependency)

1. Force ESLint’s TypeScript parser to use the root lint project by disabling the project service for linted source files in each package config, alongside the already‑set `project` and `tsconfigRootDir`.

- Keep:
  - `languageOptions.parserOptions.project = <repo>/tsconfig.lint.root.json`
  - `languageOptions.parserOptions.tsconfigRootDir = <repo-root>`
- Add:
  - `languageOptions.parserOptions.projectService = false`

This ensures ESLint builds a single TS program from the root lint tsconfig for all workspaces, so cross‑package types are available in CI without requiring `dist/`.

2. Add safeguard (consistent with “use source in dev/runtime”): ensure each internal package’s `exports` includes a `development` condition pointing to `./src/index.ts`. We already added `compilerOptions.customConditions: ["development"]` in the root `tsconfig.base.json`. This helps any resolver that prefers package `exports` conditions to pick up source types.

Done:

- Added `development` export to `packages/oak-curriculum-sdk/package.json` and `ecosystem/psycha/oak-curriculum-mcp/package.json`.
- Other internal packages already had a `development` export.

## Validation plan

- Run quality gates in order at the repo root:
  1. `pnpm format:check`
  2. `pnpm type-check --only`
  3. `pnpm lint --only`
  4. `pnpm test --only`
  5. `pnpm build --only`
- Compare ESLint effective config for a failing file in `oak-curriculum-mcp` in both local and CI (`eslint --print-config`) to verify `projectService: false`, `project = tsconfig.lint.root.json`, and `tsconfigRootDir = <repo-root>`.

## Risks and mitigations

- Performance: A single root TS program can increase initial analysis cost per job. Mitigated by limited `include` globs in `tsconfig.lint.root.json` and Turborepo caching.
- Rule strictness: If any residual `any` arises from tests (e.g. untyped Vitest mocks), prefer tightening test typings rather than weakening rules. Current local pass suggests code is fine once the root program is used.

## TODOs (actionable, with reviews)

- REMINDER: Use british spelling

- ACTION: Set `parserOptions.projectService = false` for `files: ['**/*.ts']` blocks in all package ESLint configs (keep `project` and `tsconfigRootDir` pointing to root lint tsconfig) — COMPLETED
- REVIEW: config-auditor to confirm ESLint parser uses root project; verify effective config via `--print-config`
- QUALITY-GATE: format → type-check → lint at repo root

- ACTION: commit and push, then observe the new CI run on PR #13; confirm `oak-curriculum-mcp` lint now passes
- QUALITY-GATE: tests and build at repo root

- GROUNDING: read GO.md and follow all instructions

- ACTION: Add `"development": "./src/index.ts"` to `exports` for packages missing it — COMPLETED for SDK and Curriculum MCP

### New: SDK type generation in CI (offline)

Problem: GitHub CI has restricted network; the SDK’s typegen fetched the OpenAPI schema over network during `prebuild`, causing build failures.

Solution:

- Update `packages/oak-curriculum-sdk/scripts/typegen.ts` to support an explicit CI/offline mode that reads the committed cached schema and never touches the network.
- Mode detection: `--ci` CLI flag OR `SDK_TYPEGEN_MODE=ci` OR `CI=true` environment variable triggers offline mode.
- Behaviour:
  - Offline (CI): read `packages/oak-curriculum-sdk/src/types/generated/api-schema/api-schema.json`; if missing/invalid, fail with a clear error asking to refresh locally and commit.
  - Online (dev/prod): fetch fresh schema using `OAK_API_KEY` and proceed.

Done:

- ACTION: Implement offline mode in `typegen.ts` with strict local-only behaviour in CI — COMPLETED

Usage:

- Dev (online): `pnpm -F @oaknational/oak-curriculum-sdk type-gen`
- CI (offline): no changes required; `CI=true` is set and script uses cached schema automatically. For explicit invocation: `pnpm -F @oaknational/oak-curriculum-sdk type-gen -- --ci`.
- REVIEW: architecture-reviewer to ensure export conditions align with monorepo strategy and don’t impact publishing
- QUALITY-GATE: type-check and lint focused packages

## Notes

- The underlying issue is TypeScript program selection under ESLint in CI, not raw import resolution. Forcing the parser to a single, root lint project restores cross‑package type visibility and eliminates “error typed value” cascades without weakening rules.
