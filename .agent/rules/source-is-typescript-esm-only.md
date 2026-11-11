---
classification: situational
description: 'All source is TypeScript and all JavaScript is ESM — apply when creating any source or executable file, scaffolding tooling, hooks, or scripts, or reviewing a diff that adds .js, .mjs, .cjs, or .sh. New logic goes in a .ts module; a runtime that demands JS gets it compiled from TypeScript, never hand-authored (sole carve-out: the runtime-only-scripts tier, OCE''s ADR-168 §4). CJS is banned outright; shell only where it significantly reduces effort. No lint enforces this; the bar is judgement, "high, high" — an exception never grandfathers surviving hand-authored JS, which stays a rewrite candidate.'
trigger: surface:source-authoring
globs:
  - "**/*.{js,mjs,cjs,sh}"
---

# Source Is TypeScript, ESM Only

All source code in this repository MUST be TypeScript unless absolutely
impractical. If an action requires a JavaScript file, that file MUST be
compiled from a TypeScript source — never hand-authored (sole
carve-out: the `runtime-only-scripts/` tier, where a build
step is impossible by construction). All JavaScript MUST be ESM; CJS
modules are absolutely not allowed
([`principles.md` §Tooling](../directives/principles.md#tooling)).
Shell is permitted only where it significantly reduces effort
(shell-scope exception, owner-amended 2026-07-06; Husky's hook entry
points are the canonical instance). Owner directive 2026-07-06.

## Trigger

Creating any source or executable file; scaffolding tooling, hooks, or
scripts; reviewing a diff that adds `.js`, `.mjs`, `.cjs`, or `.sh`
files.

## Action

- New logic → a `.ts` module in a workspace `src/`, typed, linted, and
  unit-tested (OCE's record: ADR-168 §5).
- A hook or command entry point → run it from TypeScript source
  (`node <source>.ts`): Node 24.18 executes a TypeScript entry directly
  under `erasableSyntaxOnly` (set repo-wide), resolving workspace
  dependencies and relative TypeScript specifiers, at about ten
  milliseconds over the compiled file against a ten-second hook timeout
  (measured 2026-09-16). A shim is a last resort (owner, 2026-09-16), and
  a compiled artefact is never hand-authored. The entry being source does
  not make the closure build-free: an import that reaches a workspace
  package exporting only `dist/` still needs that package built, so the
  build dependency is stated once in the entry's TSDoc.
- A no-compile pre-install constraint (a script that must run before
  `pnpm install` can) → the explicitly-authorised per-workspace
  `runtime-only-scripts/` tier: the named
  absolutely-impractical carve-out where hand-authored `.mjs` is
  required, its extension the deliberate signal of the constrained
  environment.
- Never author a `.cjs` file or CJS-shaped module code (`require`,
  `module.exports`) anywhere — ESM only (OCE's record: ADR-001).
- A dynamic `import(...)` is an error (owner, 2026-08-09: "dynamic imports
  error-with-recorded-exemptions"). The estate's ESLint plugin reports it
  (`no-dynamic-import`, at error in its recommended configuration) in every
  file the lint configuration covers; a file outside that scope, and one that
  must stay, carries a recorded exemption in place.
- Shell only where it significantly reduces effort. A shell script that
  accretes parsing or branching logic carries the
  promotion-overdue signals; port it to TypeScript.

Owner sharpening (2026-07-30): the bar for JavaScript exceptions is "high,
high", and an exception never justifies keeping EXISTING hand-authored JS —
surviving `.js` files are rewrite candidates, not grandfathered
(an upstream theme script was rewritten as TypeScript source under this ruling). Shell
and occasional Python remain the only non-TypeScript carve-outs.
