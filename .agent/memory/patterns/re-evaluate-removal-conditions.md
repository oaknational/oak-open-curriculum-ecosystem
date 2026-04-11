---
name: Re-evaluate removal conditions on workarounds
category: process
barrier: proven by implementation, prevents recurring mistake, stable
source_session: 2026-04-05
---

# Re-evaluate Removal Conditions on Workarounds

When a workaround documents its own removal conditions, schedule
re-evaluation — the conditions may be met long before anyone checks.

## The Anti-Pattern

A workaround is introduced with documented removal conditions (e.g.
"remove when the SDK supports X"). Time passes. The SDK gains support
for X. Nobody re-evaluates the workaround because it still works and
its tests still pass. The workaround becomes permanent infrastructure
that blocks adoption of the off-the-shelf capability it was designed
to bridge.

## The Pattern

1. When introducing a workaround, document the removal conditions
   clearly (already good practice in this repo).
2. When upgrading a dependency that a workaround bridges, explicitly
   check the workaround's removal conditions against the new version.
3. Treat documented removal conditions as testable assertions — if
   they can be expressed as a unit test, write one that fails when the
   condition is met ("this test should start failing when the SDK
   supports examples natively — when it does, delete the workaround").

## Origin

`preserve-schema-examples.ts` documented three removal conditions.
Condition #1 (MCP SDK honours Zod `.meta()`) was met when the SDK
upgraded to use Zod 4's native `toJSONSchema()`, but the workaround
persisted through multiple sessions because no one re-checked. The
shim then compounded with other issues (blocking `registerAppTool`
metadata normalisation) to prevent MCP App rendering.
