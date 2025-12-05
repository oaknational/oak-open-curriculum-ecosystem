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
- [Notion TypeScript SDK](https://www.npmjs.com/package/@notionhq/client)
- [Zod](https://www.npmjs.com/package/zod)
- [tsup](https://tsup.egoist.dev) [package at](https://www.npmjs.com/package/tsup)
- [commitlint](https://commitlint.js.org)

## Running

- [tsx](https://www.npmjs.com/package/tsx) for directly running the TypeScript
- [Node.js](https://nodejs.org) 22+ for running the compiled JavaScript

## Publishing

- [npm](https://www.npmjs.com) - Packages are published to npm with semantic versions.
- [semantic-release](https://github.com/semantic-release/semantic-release) - Semantic Release is used to AUTOMATICALLY publish packages to npm.

## Validation

- [Claude](https://www.npmjs.com/package/@anthropic-ai/claude-code) (initial MCP client, already installed globally)
