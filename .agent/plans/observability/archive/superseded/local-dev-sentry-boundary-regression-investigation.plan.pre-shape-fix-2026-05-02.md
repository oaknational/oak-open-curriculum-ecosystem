---
name: "Local Dev Sentry Boundary — Regression Investigation"
overview: >
  `pnpm dev` from apps/oak-curriculum-mcp-streamable-http fails with
  "Git SHA is required for Sentry release resolution but
  VERCEL_GIT_COMMIT_SHA is not set". Local dev should not invoke Sentry
  release configuration. The completed plan
  `mcp-local-startup-release-boundary.plan.md` (2026-04-25) was meant
  to decouple local startup from deploy-only Sentry release metadata.
  Either it has regressed, or its scope did not cover the dev-server
  invocation path. This plan investigates which, then determines the
  cure.
status: current
todos:
  - id: phase-0-reproduce-and-trace
    content: "Phase 0: Reproduce the failure cleanly; trace the invocation chain from `pnpm dev` to the throw site; identify the registration-policy gate that fired."
    status: pending
  - id: phase-1-canonical-config-options
    content: "Phase 1: Determine what canonical config options exist for disabling Sentry on local dev (SENTRY_MODE=off? SENTRY_AUTH_TOKEN absence? a dev-mode predicate?); document each option's substance and trade-offs."
    status: pending
  - id: phase-2-decision-gate
    content: "Phase 2: Owner decision — which canonical option becomes the default for local dev, and what structural enforcement closes the gap so this cannot regress."
    status: pending
  - id: phase-3-implementation
    content: "Phase 3: Implement the agreed cure with RED→GREEN tests; verify pnpm dev runs clean from a fresh checkout with no Sentry env vars."
    status: pending
isProject: false
---

# Local Dev Sentry Boundary — Regression Investigation

**Last Updated**: 2026-05-01
**Status**: 🔴 NOT STARTED — investigation queued for next session
**Scope**: Restore the property that local dev does not require any
Sentry release identity, and harden the boundary so it cannot regress.

---

## Reproduction (captured 2026-05-01, Gnarled Fruiting Root)

```bash
cd apps/oak-curriculum-mcp-streamable-http && pnpm dev
```

Output (final lines):

```text
[plugin vite:singlefile] Inlining: oak-banner-BL0R8WYM.js
[plugin vite:singlefile] Inlining: style-Bn44CQ0S.css
computing gzip size...
.widget-build/oak-banner.html  548.87 kB │ gzip: 141.14 kB

built in 150ms.
Git SHA is required for Sentry release resolution but VERCEL_GIT_COMMIT_SHA is not set
 ELIFECYCLE  Command failed with exit code 1.
```

Widget build succeeded; the failure is in the server-side build path
that runs *after* the widget build.

---

## Source location

The throw site is in `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts`,
roughly line 169:

```ts
if (!gitSha) {
  return err({
    kind: 'missing_commit_sha_in_registered_environment',
    message:
      'Cannot register a Sentry release without a git SHA. Set VERCEL_GIT_COMMIT_SHA or ' +
      'GIT_SHA_OVERRIDE; on Vercel this is auto-populated.',
  });
}
```

(The exact "Git SHA is required for Sentry release resolution but
VERCEL_GIT_COMMIT_SHA is not set" wording does not appear verbatim in
the throw text; trace the actual emitter — likely an upstream caller
in the esbuild config or `run-sentry-configured-build.ts` — at Phase 0.)

`pnpm dev` invokes `pnpm exec tsx operations/development/http-dev.ts dev`,
which builds the widget then triggers an esbuild flow that ends up in
the Sentry build plugin. The boundary the dev-server is supposed to
respect is named in the completed plan
`mcp-local-startup-release-boundary.plan.md`.

---

## Owner direction (2026-05-01)

> "we don't want sentry to be configured on local dev"

This is the load-bearing constraint. Local dev MUST NOT require any
Sentry release identity (auth token, git SHA, project, org). Any code
path that demands one is a regression of the intent the
`mcp-local-startup-release-boundary` plan was meant to enforce.

---

## Investigation questions for Phase 0

1. Is the failing path the dev-server invocation, or is the dev-server
   triggering the build path that the previous plan only partially
   guarded? Trace from `operations/development/http-dev.ts dev` to the
   throw site.
2. Is `SENTRY_MODE=off` (or the moral equivalent) supposed to be set
   automatically by the dev-server entry point? If so, where, and why
   isn't it?
3. Did the recent `sentry-release-identifier-single-source-of-truth`
   plan (CURRENT) introduce a new resolver path that bypasses the
   local-dev boundary?
4. Is the registration-policy gate
   (`resolveSentryRegistrationPolicy` in `sentry-build-plugin.ts`)
   firing in `production` mode locally because of a
   `VERCEL_ENV`/`NODE_ENV` defaulting bug?

---

## Canonical config options to evaluate (Phase 1)

These are hypotheses to evaluate, not pre-decided cures. Each must be
checked against ADR-162 (Observability-First) and ADR-163 (Sentry
release-identifier).

1. **`SENTRY_MODE=off`** at the dev-server entry: an explicit dev-mode
   predicate that short-circuits the registration policy.
2. **Absence of `SENTRY_AUTH_TOKEN`** as the canonical "skip" signal:
   the registration policy already has a `skipped` branch when the
   auth token is missing. Investigate why the git-SHA check fires
   before that branch is taken.
3. **Dev-server registers a stub plugin**: dev path uses a no-op Sentry
   plugin that doesn't run the release-identity resolver at all.
4. **NODE_ENV=development gates the Sentry plugin invocation**: the
   plugin is not loaded into the esbuild pipeline for dev.
5. **A new env predicate `VERCEL_ENV` not set OR set to `development`**
   short-circuits release-resolution earlier than auth-token check.

---

## Structural enforcement question (Phase 2)

Whichever canonical option wins, the boundary needs structural
enforcement to prevent regression. Candidate shapes:

- A failing test that asserts: "with no Sentry env vars set, `pnpm dev`
  starts the server within N seconds without throwing on Sentry
  release resolution".
- A test that runs the dev-mode invocation chain through the
  registration-policy resolver and asserts the `skipped` branch fires
  before any git-SHA check.
- An ADR-163 amendment that names the dev-mode contract explicitly
  (currently the ADR talks about production attribution; the local-dev
  side may be under-specified).

---

## Related plans and ADRs

- **Completed**:
  `.agent/plans/observability/archive/completed/mcp-local-startup-release-boundary.plan.md`
  — the previous attempt to decouple local startup from deploy-only
  Sentry release metadata. Read this first; the current bug is either
  a regression of that work or a gap its scope did not cover.
- **Current**:
  `.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`
  — proposes collapsing the two release resolvers into one
  (`@oaknational/build-metadata`'s `resolveRelease`). Investigate
  whether this plan's WS3 has landed in a way that broke the local-dev
  path.
- **Active**:
  `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
  — the L-8 lane that "landed the diverging build-time resolver"
  (referenced by the single-source plan).
- **ADR-162** (Observability-First): names the cardinal observability
  invariants.
- **ADR-163** (Sentry Release Identifier and Vercel Production
  Attribution): names the production-side correctness; check whether
  it specifies the dev-side contract.

---

## Tooling note (this session)

This session encountered tooling friction (LSP MCP disconnections,
foreign system-reminders firing on unrelated reads, cumulative file-
modification staleness on edits). The investigation paused at the
trace-the-throw-site step before deeper code reading. Next session
should re-ground on a fresh checkout of these surfaces and use proper
read/grep tools rather than bash heredocs to avoid the same friction.

---

## Phase 0 entry checklist (next session)

1. Reproduce the failure on a fresh shell with no `SENTRY_*` env vars.
2. Read `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev.ts`
   end-to-end.
3. Read `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts`
   end-to-end (the throw site).
4. Read `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-environment.ts`
   end-to-end (the env resolver).
5. Read `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`.
6. Read the completed `mcp-local-startup-release-boundary.plan.md` —
   confirm what it claimed to land vs. what is in HEAD.
7. Identify the *exact* throw site for the verbatim error message
   "Git SHA is required for Sentry release resolution but
   VERCEL_GIT_COMMIT_SHA is not set" (the wording in
   `sentry-build-plugin.ts:169` is similar but not identical, so the
   actual emitter is elsewhere — probably a plain `Error` thrown by
   the plugin's caller from the err-result message).

Do not begin Phase 1 until Phase 0 produces a single named root cause
and the owner has confirmed it.

---

## Foundation alignment

- `principles.md`: do not bypass; investigate root cause.
- `testing-strategy.md`: RED first; the cure ships with a test that
  proves the dev-server starts clean.
- `schema-first-execution.md`: env validation flows from the schema
  in `sentry-build-environment.ts`; check whether that schema is
  the right place for the dev-mode predicate.

---

## Out of scope

- Production Sentry attribution behaviour (covered by ADR-163 and
  the in-flight single-source plan).
- Widget build path (works correctly per the reproduction).
- Sentry plugin internals beyond the registration-policy gate.
- Re-evaluating ADR-162's observability cardinality — the local-dev
  cure should compose with the ADR, not modify it.
