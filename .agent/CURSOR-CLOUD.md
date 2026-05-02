---
fitness_line_target: 60
fitness_line_limit: 100
fitness_char_limit: 6000
fitness_line_length: 100
split_strategy: "Keep concise; platform-specific operational context only"
---

# Cursor Cloud Specific Instructions

Platform-specific operational context for Cursor Cloud agents. For general
development guidance, see [AGENT.md](directives/AGENT.md) and the
[root README](../README.md).

## Runtime Requirements

- **Node.js 24.x** via nvm (`.nvmrc` pinned to `24`)
- **pnpm 10.33.2** via corepack (`packageManager` field in root `package.json`)

## Key Commands

All commands run from the repo root. See `package.json` scripts and
[docs/engineering/build-system.md](../docs/engineering/build-system.md) for the
full reference.

| Task | Command |
| ---- | ------- |
| Install deps | `pnpm install` |
| Build all | `pnpm build` |
| Unit tests | `pnpm test` |
| Type-check | `pnpm type-check` |
| Lint (read-only) | `pnpm lint` |
| Full verify | `pnpm check` |
| MCP server (no auth) | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev observe-noauth` |
| Smoke test (stub) | `pnpm smoke:dev:stub` |

## Non-Obvious Caveats

- To run the MCP dev server without auth, use the `observe-noauth` mode:
  `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev observe-noauth`.
  The default `dev` mode enforces OAuth via Clerk regardless of environment
  variables.
- `SENTRY_MODE=off` must be set for local dev unless you provide
  `VERCEL_GIT_COMMIT_SHA`. Without it, the Sentry config resolver fails at
  startup with "Git SHA is required for Sentry release resolution".
- After `pnpm install`, run `pnpm build` before running tests or the dev
  server — internal workspace packages must be built first for cross-workspace
  imports to resolve.
- The pre-push hook requires `gitleaks`. It must be installed for pushes to
  succeed. Install from <https://github.com/gitleaks/gitleaks>.
