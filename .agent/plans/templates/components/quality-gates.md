# Component: Quality Gates

Quality gates are layered. Cycles use focused deterministic validation
plus the smallest repo gates that prove the slice. Milestones and final
readiness use the canonical aggregate gate from repo root.

## After Each Cycle or Task

```bash
pnpm type-check
pnpm lint
pnpm test
```

Add the cycle's own deterministic command before the shared gates above
when a narrower proof exists, for example a focused Vitest file or
workspace-specific test command. The plan must name the expected output
or exit status.

## After Each Phase or Milestone

Use the canonical aggregate gate:

```bash
pnpm check
```

The authoritative expansion lives in root `package.json`
`scripts.check` and is documented in
`docs/engineering/build-system.md`. Do not duplicate the expanded
command list into plans unless diagnosing a failed stage.

## Rationale

SDK changes propagate across workspaces. Filtered or focused runs are
useful while iterating, but they do not replace `pnpm check` for an
aggregate readiness claim.

**Every gate MUST pass. There is no such thing as an acceptable
failure. If a gate fails, the work is not done. Fix it.**
