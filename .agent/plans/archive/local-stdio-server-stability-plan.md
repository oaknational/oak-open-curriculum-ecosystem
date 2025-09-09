# Local STDIO MCP Server Stability Plan

## Goal

Restore and harden the local STDIO server (`apps/oak-curriculum-mcp`) so that:

- Secrets are not required in `.cursor/mcp.json`; dotenv loads from repo root automatically.
- A single, shared `findRepoRoot()` is the source of truth for resolving the monorepo root.
- Logs are consistently written under `/.logs/...` (not `apps/.logs/...`).
- Parity between exposed MCP tools and SDK `MCP_TOOLS` is enforced by tests.
- Regressions in env loading or tool listing are caught by CI.
- The local curriculum mcp server works as expected in a client such as Cursor, and displays the tools in the tool list or a count of the tools.

## Non-goals

- Remote/HTTP transport or Vercel integration (covered by `remote-mcp-enablement-plan.md`).
- Replacing runtime logging implementation beyond fixing root resolution and placement.

## Current State

- Logs are not being written to the correct directory.
- The tool list in Cursor still read 0 tools

## Acceptance criteria

- `packages/libs/env` exports:
  - `findRepoRoot(startDir?: string): string` – walks up to the first dir containing `pnpm-workspace.yaml` or `.git` (file or dir).
  - `loadRootEnv(options?): { repoRoot: string; loaded: boolean; path?: string }` – loads `.env.local` then `.env` (or test override) if required keys are missing; never overrides existing `process.env`.
- `apps/oak-curriculum-mcp` uses the shared functions in:
  - CLI bin (`bin/oak-curriculum-mcp.ts`) – to load `.env` and compute `rootDir` for startup logs.
  - `src/app/startup.ts` – default `rootDir` uses `findRepoRoot()`.
  - `src/app/file-reporter.ts` – log file path under `${repoRoot}/.logs/oak-curriculum-mcp/…`.
- Tests:
  - Env package: unit/integration tests for `findRepoRoot` and `loadRootEnv` (temp dir + fixture env).
  - MCP app: tool-list parity test comparing `listTools()` with `Object.keys(MCP_TOOLS)`.
- Quality gates run green: format, lint, type-check, unit + e2e tests, build.

## Design

- Centralize repo-root detection in `packages/libs/env`.
  - Walk upwards from a start directory (default `process.cwd()`), checking for `pnpm-workspace.yaml` or `.git` (file or directory), returning the first match; if none, return filesystem root.
- Centralize env loading in `packages/libs/env`.
  - `loadRootEnv` resolves repo root via `findRepoRoot`, then applies dotenv to `.env.local` and `.env` if specific keys (e.g., `OAK_API_KEY`) are not present. Do not override any already-set env variables.
- Apply in server:
  - Update bin to call `loadRootEnv` first; pass computed `repoRoot` to startup logger.
  - Update startup/file-reporter to use `findRepoRoot` (remove hard-coded "four levels up").
- Testing approach:
  - For `findRepoRoot` and `loadRootEnv`, use a temporary fixture directory structure; avoid touching real repo files.
  - Tool parity uses current e2e harness and sets `OAK_API_KEY` to a dummy value, ensuring no network calls.

## Tasks

1. Add shared utilities to `packages/libs/env`:
   - `repo-root.ts`: `findRepoRoot`, `loadRootEnv` (using dotenv), exports from `index.ts`.
   - Tests: `repo-root.unit.test.ts`, `load-root-env.integration.test.ts`.
2. Update server to use shared utilities:
   - `bin/oak-curriculum-mcp.ts`: replace local dotenv/root logic with `loadRootEnv`/`findRepoRoot`.
   - `src/app/startup.ts`: use `findRepoRoot` for default `rootDir`.
   - `src/app/file-reporter.ts`: use `findRepoRoot` for log path.
3. Add tool-list parity test under `apps/oak-curriculum-mcp/e2e-tests/`.
4. Run quality gates; iterate until green.

## Rollback/mitigations

- Changes are additive and localized. If issues arise, keep the old code behind commented references in commit history; reverting the three files restores prior behavior.
