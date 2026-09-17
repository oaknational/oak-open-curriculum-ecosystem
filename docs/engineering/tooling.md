# Tooling

All tooling MUST use the latest versions. `pnpm outdated` is the first-pass
check — but it computes its "latest" under the workspace's
`minimumReleaseAge` floor, so an age-floored release's row reads current
there (verified 2026-08-11, pnpm 11.20). The exhaustive currency check is
registry reads — `pnpm view <pkg> version` / `pnpm view <pkg> time` — per
the update-dependencies skill's age-floor census.

> `pnpm outdated` / `pnpm -r outdated` (the repo's `outdated` script) exits with a
> non-zero code when it finds outdated packages. That is the command's normal
> "updates available" signal, not a failure — scripts and CI must not treat the
> exit code as an error.

## Build System

- [pnpm](https://pnpm.io) - Package manager and workspace orchestration
- [Turborepo](https://turbo.build/repo) - Task runner with caching and dependency management (see [Build System docs](./build-system.md))

## Development

- [pnpm](https://pnpm.io)
- [husky](https://typicode.github.io/husky) - [set up with `pnpm dlx husky-init`](https://www.npmjs.com/package/husky-init)
- [lint-staged](https://github.com/okonet/lint-staged)
- [TypeScript](https://www.typescriptlang.org) - with strict settings.
- [Prettier](https://prettier.io)
- [ESLint](https://eslint.org)
- [Vitest](https://vitest.dev)
- [Supertest](https://github.com/visionmedia/supertest)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [Zod](https://www.npmjs.com/package/zod)
- [tsup](https://tsup.egoist.dev) [package at](https://www.npmjs.com/package/tsup)
- [commitlint](https://commitlint.js.org)

## Running

- [tsx](https://www.npmjs.com/package/tsx) for directly running the TypeScript
- [Node.js](https://nodejs.org) 24.x for running the compiled JavaScript

## External System Tools

These tools are not managed by pnpm but are required by specific workflows:

- [gitleaks](https://github.com/gitleaks/gitleaks) — required for secrets scanning
  in push workflows
- [bun](https://bun.sh/docs/installation) — optional, required for
  `pnpm dev:widget-in-host`
- [jq](https://jqlang.github.io/jq/download/) — optional, required for
  `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:oauth-curl`
- [lsof](https://github.com/lsof-org/lsof) — optional, used by
  `apps/oak-curriculum-mcp-streamable-http/scripts/restart-dev-server.sh`

Scripts that require these tools should emit explicit installation guidance when
the command is missing.

## Publishing

- [npm](https://www.npmjs.com) - The target registry for public packages. Nothing is published today (`npmPublish: false` in `.releaserc.mjs`); the first publish lands as one multi-package publish at the repository's release version, never a manual toggle.
- [semantic-release](https://github.com/semantic-release/semantic-release) - Versions, tags and GitHub releases are minted automatically on merge to `main`; npm publishing is disabled until that first publish.

## TSDoc Compliance

TSDoc compliance is enforced at three layers:

1. **Generation-time post-processing**: The `postProcessTypesSource`
   function in `codegen-core.ts` strips non-standard tags
   (`@description`, `@constant`, `@enum`) from `openapi-typescript`
   output at generation time, preventing them from entering the
   codebase.

2. **Lint-time enforcement**: `eslint-plugin-tsdoc` is installed in
   `@oaknational/eslint-plugin-standards` with `tsdoc/syntax: warn`.
   This catches any non-standard tags introduced in hand-written
   code.

3. **Custom tag declaration**: `tsdoc.json` configs (root and
   per-workspace) declare `@generated` as a custom modifier tag,
   allowing it to pass the TSDoc parser without triggering warnings.

This three-layer approach was established in February 2026 after a
codebase-wide fix of non-standard TSDoc tags across 462 files.
`sanitize-docs.ts` and `docs/_typedoc_src/` were deleted; TypeDoc
configs point directly at `src/`.

## Validation

- [Claude](https://www.npmjs.com/package/@anthropic-ai/claude-code) (initial MCP client, already installed globally)
