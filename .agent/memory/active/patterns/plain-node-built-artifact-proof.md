---
name: "Plain-Node Built-Artefact Proof"
use_this_when: "A service runs source through tsx, Vite, or another dev loader locally but ships built JavaScript under plain Node, and dev success may mask production-startup defects"
category: testing
proven_in: "apps/oak-curriculum-mcp-streamable-http/e2e-tests/built-artifact-import.e2e.test.ts"
proven_date: 2026-04-09
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Assuming dev-loader success proves that the built artefact will start under the production runtime"
  stable: true
---

# Plain-Node Built-Artefact Proof

## Problem

Development often runs source with a permissive loader such as `tsx` or Vite,
while production executes built JavaScript under plain Node. Those paths can
share the same application code and still disagree about import resolution or
bootstrap behaviour. A workspace can therefore look healthy in dev and fail
only after build or deploy.

## Pattern

Keep ordinary unit and integration tests source-based, and add one focused
out-of-process proof that executes the built artefact under the real runtime
rules.

For Node-entry workspaces, the proof is usually:

1. run `build`
2. spawn plain Node
3. import or start the narrowest built seam that proves startup viability
4. assert success without adding unrelated network or end-to-end complexity

Prefer an importable factory or module seam such as `dist/application.js` over
`dist/index.js` when the latter boots the whole server immediately. The goal is
to prove the production resolver and bootstrap path, not to duplicate broader
runtime tests.

## Anti-Pattern

Using dev-loader success as proof that the deployed artefact is sound, or
teaching generic source-imported tests to depend on build outputs. Both blur
the test boundary:

- the first misses production-only failures
- the second makes ordinary source tests slower, flakier, and architecturally
  dishonest

## Checklist

1. Validate the build by running the real `build` command
2. Add a separate proof that executes the built artefact under the production
   runtime rules
3. Choose the narrowest seam that proves startup without unnecessary networked
   behaviour
4. Keep the proof hermetic when possible: no external network, minimal file
   assumptions beyond the built artefact itself
5. Document in the workspace README or deployment docs that dev and built
   resolvers are not interchangeable
