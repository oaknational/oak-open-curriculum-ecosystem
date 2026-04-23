---
name: "MCP HTTP Runtime Canonicalisation"
status: strategic-brief
overview: >
  Separate plan for the broader runtime simplification that the
  deploy-boundary repair deliberately does not attempt. Once the repaired
  repo-owned follow-through is complete and the later owner-directed
  preview is stable, this plan revisits the wider canonical
  Vercel/Express shape for the HTTP MCP workspace: deploy boundary,
  local runner, Sentry init ownership, listener/error handling, and
  artefact-set rationalisation.
depends_on:
  - "../current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md"
promotion_trigger: >
  The bounded repo-owned follow-through lands, the owner-directed
  preview boots cleanly with Sentry evidence, and the owner wants
  runtime simplification rather than further operational repair.
---

# MCP HTTP Runtime Canonicalisation

**Status**: 🔵 Strategic (separate from the operational repair plan)
**Last Updated**: 2026-04-23

## Why this plan exists

The deploy-boundary repair intentionally keeps more runtime structure than is
likely ideal. That is the right trade while the priority is to stop a crashing
function, restore hard-failure build gates, and prove Sentry on a real preview.

The broader canonicalisation work still looks valuable. It just is not the same
piece of work.

This plan is the separate home for that value.

## Intent

Revisit the HTTP MCP workspace once the operational repair is stable and decide
whether the runtime should converge on a cleaner canonical shape, rather than
carrying the current split because it happened to be the smallest safe repair.

## Questions This Plan Owns

1. What is the canonical runtime shape for this workspace once we are no longer
   optimising for emergency repair?
2. Should the workspace converge on a clear `server.ts` deploy boundary and a
   separate `main.ts` local runner, or does the post-repair evidence support a
   smaller variant?
3. Are `bootstrap-app.ts` and `server-runtime.ts` load-bearing after the repair,
   or are they accidental complexity that can be removed with proof?
4. Should Sentry initialisation continue to happen through
   `createHttpObservability`, or move to a single explicit owned seam?
5. Is `http.createServer(app)` still justified on current Express 5, or can the
   workspace prove that `app.listen().on('error')` is sufficient?
6. Should the `application` entry survive, or should it be retired once every
   consumer is reconciled?
7. How many composition seams should remain once deploy, local runtime, and
   importable app construction are made deliberate?

## Success Shape

This plan earns execution only if it can land all of the following:

- one chosen runtime architecture justified from first principles and current
  runtime evidence;
- clear ownership of deploy boundary, local runner, and Sentry init;
- deliberate build artefacts rather than historical leftovers;
- proven listener, startup-failure, and shutdown behaviour;
- consumer inventory for every deleted or collapsed artefact;
- a net simplification that earns the disruption.

## Inputs

When this plan is promoted, it should start from:

- the contract note and repo-owned follow-through outcomes recorded in
  [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md);
- the real preview and Sentry evidence gathered after the owner-
  directed preview check on the repaired branch;
- the reviewer findings already surfaced during the abandoned canonical-layout
  attempt;
- any fresh Express 5 or `@sentry/node` primary-source evidence gathered after
  the repair.

## Non-Goals

- Fixing the crashing preview. The operational repair plan owns that.
- Monitor creation or alert wiring. That is owner-external.
- Re-opening release-linkage or source-map work that the operational repair has
  already proved.

## Promotion Trigger

Promote this plan only when the bounded repo-owned follow-through is
closed and there is owner appetite to simplify the runtime
deliberately, rather than while the branch is still proving that the
repaired service boots and emits correctly.
