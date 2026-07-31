# Source Is TypeScript, ESM Only

All source code in this repository MUST be TypeScript unless absolutely
impractical. If an action requires a JavaScript file, that file MUST be
compiled from a TypeScript source — never hand-authored (sole
carve-out: ADR-168 §4's `runtime-only-scripts/` tier, where a build
step is impossible by construction). All JavaScript MUST be ESM; CJS
modules are absolutely not allowed
([ADR-001](../../docs/architecture/architectural-decisions/001-esm-only-package.md)).
Shell is permitted only where it significantly reduces effort
([ADR-168 §Shell-scope exception](../../docs/architecture/architectural-decisions/168-typescript-6-baseline-and-workspace-script-architectural-rules.md),
amended 2026-07-06; Husky's hook entry points are the canonical
instance). Owner directive 2026-07-06.

## Trigger

Creating any source or executable file; scaffolding tooling, hooks, or
scripts; reviewing a diff that adds `.js`, `.mjs`, `.cjs`, or `.sh`
files.

## Action

- New logic → a `.ts` module in a workspace `src/`, typed, linted, and
  unit-tested (ADR-168 §5).
- A runtime that demands a JS file (a hook target) → compile it from
  TypeScript (the bootstrap-built `agent-tools/dist` pattern); never
  hand-author the compiled artefact.
- A no-compile pre-install constraint (a script that must run before
  `pnpm install` can) → the explicitly-authorised per-workspace
  `runtime-only-scripts/` tier (ADR-168 §4): the named
  absolutely-impractical carve-out where hand-authored `.mjs` is
  required, its extension the deliberate signal of the constrained
  environment.
- Never author a `.cjs` file or CJS-shaped module code (`require`,
  `module.exports`) anywhere — ESM only (ADR-001).
- Shell only where it significantly reduces effort. A shell script that
  accretes parsing or branching logic carries ADR-168 §5's
  promotion-overdue signals; port it to TypeScript.

Owner sharpening (2026-07-30): the bar for JavaScript exceptions is "high,
high", and an exception never justifies keeping EXISTING hand-authored JS —
surviving `.js` files are rewrite candidates, not grandfathered
(`oak-theme.js` was rewritten as TypeScript source under this ruling). Shell
and occasional Python remain the only non-TypeScript carve-outs.
