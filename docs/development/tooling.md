# Tooling

All tooling MUST use the latest versions, use `pnpm outdated` to check for updates.

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

## Publishing

- [npm](https://www.npmjs.com) - Packages are published to npm with semantic versions.
- [semantic-release](https://github.com/semantic-release/semantic-release) - Semantic Release is used to AUTOMATICALLY publish packages to npm.

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
