# Component: Quality Gates

Run the full chain after every piece of work, from repo root.
Not some of them. All of them. In this order. Every time.

## After Each Task

```bash
pnpm type-check
pnpm lint
pnpm test
```

## After Each Phase

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

## Rationale

SDK changes propagate across workspaces. Filtered runs (`--filter`)
miss cross-workspace regressions. The full chain catches them.

**Every gate MUST pass. There is no such thing as an acceptable
failure. If a gate fails, the work is not done. Fix it.**
