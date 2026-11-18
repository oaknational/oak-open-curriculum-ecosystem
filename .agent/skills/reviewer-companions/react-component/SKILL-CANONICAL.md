---
name: react-component
classification: active
description: Use when work changes React components, hooks, or client and server boundaries.
---

# React Component

Use this skill while planning or implementing changes in `apps/**`, `demos/**`
or `packages/design/**` that affect composition, hooks, props flow, or server
and client boundaries. It complements `react-component-expert`; use the reviewer for the
independent runtime and composition pass.

## Read in order

1. `.agent/sub-agents/templates/react-component-expert.md`
2. The `react-component-expert` row of `.agent/rules/invoke-code-experts.md` (the roster)
3. Relevant changed files in `apps/**`, `demos/**`, `packages/design/**` and
   their supporting helpers
4. `docs/architecture/README.md` when server or client responsibility is part
   of the decision

## How to use it

1. Decide the boundary first: server component, client component, shared helper,
   or test support. Avoid moving work to the client unless the browser really
   needs it.
2. Keep props explicit, state local, and effects purposeful. Reach for
   `useDeferredValue`, `startTransition`, or `useEffectEvent` only when the
   runtime actually benefits.
3. Pair the slice with behaviour proof at the right level: component or
   integration tests for composition, `pnpm test:e2e` when route behaviour
   changes.
4. Hand off to `react-component-expert` once the slice is implemented, and
   pull in the `design-system-usage` or `security` skill when the component crosses
   those boundaries.
