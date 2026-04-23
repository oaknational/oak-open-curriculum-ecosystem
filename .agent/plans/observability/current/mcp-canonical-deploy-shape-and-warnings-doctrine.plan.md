---
name: "MCP Deploy-Boundary Repair + Warnings Doctrine"
status: execution-ready
status_reason: >
  Owner directive 2026-04-23 (Pippin / cursor / claude-opus-4-7 session
  open): the original "canonical deploy shape" framing was rejected as
  over-scoped by architecture-reviewer-barney (verdict ABANDON-REFACTOR);
  the assumption-reviewer's verdict on Barney was AMEND (five blocking
  findings); the rewrite reduced scope to "narrow deploy-boundary
  repair + warnings doctrine" per Barney's frame, with the assumption-
  reviewer's amendments folded in (Frame Finding A1 resolved by owner
  ratification of Barney's framing). Final Barney sign-off pass
  returned GO 2026-04-23 confirming all three AMEND blockers
  (operative-metadata coherence, Phase-1-contract-neutral wording,
  Phase-4-decision-record-only) resolved; status promoted from draft
  to execution-ready. §Reduced-Scope Rewrite Phases 1–7 are the
  binding contract; legacy §Solution Architecture / §Reviewer
  Scheduling / §Documentation Propagation Commitment / §Testing
  Strategy / §Success Criteria / §Resolution Plan retained behind
  SUPERSEDED banners for diff-against-rewrite legibility only.
overview: >
  Quality-fix plan addressing the WI-7 Vercel lambda boot crash on
  `apps/oak-curriculum-mcp-streamable-http`. Reduced-scope frame
  (per architecture-reviewer-barney 2026-04-23): empirically prove
  the `@vercel/node` adapter's package-`main` contract (Phase 1);
  land a correct Vercel deploy boundary at `src/server.ts` whose
  default export matches **whatever shape Phase 1 proves Vercel
  requires** (Phase 2); repoint `package.json` `main`; hard-fail
  the build when that artefact contract is broken; record the
  Sentry Uptime Monitoring tool-selection decision and unblock
  `synthetic-monitoring.plan.md` (build-out remains in that plan);
  complete the L-8 Correction WI-8 ADR-163 §6/§7 amendment for the
  reduced shape; update the docs that currently assert the old
  `dist/index.js` architecture. **Out of scope** (deferred to named
  follow-up lanes): canonical Vercel Express layout (Fred+Betty
  vision), single canonical Sentry init seam, deletion of
  `bootstrap-app.ts` / `server-runtime.ts` / `application` esbuild
  entry, `app.listen()` vs `http.createServer(app)` reconciliation.
  Phase 0 (warnings-not-deferrable doctrine) is LANDED and binding
  (commits c577cf16 + d8ae99e1). The §Reduced-Scope Rewrite section
  IS the binding contract; the historical reviewer reports (§Open
  Concerns, §Barney's report, §Assumptions-review of Barney's
  verdict) are retained as the reasoning trail.
parent_plan: "../active/sentry-observability-maximisation-mcp.plan.md"
branch: "feat/otel_sentry_enhancements"
depends_on:
  - "../active/sentry-observability-maximisation-mcp.plan.md"
todos:
  - id: phase-0-doctrine
    content: "Phase 0: Land warnings-not-deferrable doctrine — principles.md bullet + .agent/rules/no-warning-toleration.md + .cursor/rules/no-warning-toleration.mdc."
    status: completed
  - id: phase-1-vercel-probe
    content: "Phase 1: Vercel adapter contract verification probe — empirical answer to 'what runtime shape does @vercel/node import from package.main?' before any boundary code is written. Resolves assumption-review Finding A2."
    status: pending
  - id: phase-2-deploy-boundary
    content: "Phase 2: Deploy boundary hardening + build self-assertion + doc update. Add src/server.ts (Phase 1's verified contract), workspace-local composition helper, repoint package.json main, esbuild metafile + warnings-as-errors gate, update docs/deployment-architecture.md + workspace README.md as Phase-2 acceptance criteria (resolves Finding A5)."
    status: pending
  - id: phase-3-local-continuity
    content: "Phase 3: Local continuity + tooling migration. Update http-dev-contract.ts entry path; keep --import @sentry/node/preload; repair scripts/server-harness.js drift (Finding A8). Local runner stack (server-runtime.ts, bootstrap-app.ts, http.createServer wrapper) explicitly retained."
    status: pending
  - id: phase-4-uptime-unblock
    content: "Phase 4: Sentry Uptime Monitoring lane unblock — record tool-selection decision (Sentry Uptime Monitoring for uptime layer; Sentry Cron Monitors candidate for working-probe layer) with rejected alternatives, and remove blocked_on entry from synthetic-monitoring.plan.md. Monitor build-out itself remains in that plan; THIS branch ends at the decision record (was original Phase 5)."
    status: pending
  - id: phase-5-vercel-probe
    content: "Phase 5: Vercel preview probe — re-do WI-6 + WI-7 against deployed reduced-scope shape; confirm WI-7 fixed in actual Vercel preview (was original Phase 6)."
    status: pending
  - id: phase-6-adr-amendment
    content: "Phase 6: ADR-163 §6/§7 amendment for the reduced-scope deploy-boundary architecture (was original Phase 7, scope-narrowed)."
    status: pending
  - id: phase-7-branch-close
    content: "Phase 7: Branch close + thread/napkin/repo-continuity update + file §Deferred Lanes (DL-1..DL-7) as follow-up plan stubs under .agent/plans/observability/future/ (was original Phase 9)."
    status: pending
---

# MCP Deploy-Boundary Repair + Warnings Doctrine

**Last Updated**: 2026-04-23 (rewrite landed; Barney sign-off GO; status promoted to execution-ready)
**Status**: 🟢 EXECUTION-READY — Phase 0 doctrine LANDED and
binding (commits c577cf16 + d8ae99e1); new Phases 1–7
(§Reduced-Scope Rewrite) are the binding contract for the next
session, signed off by architecture-reviewer-barney's final pass
2026-04-23. Original Phases 1–9 (§Resolution Plan, appended below)
are SUPERSEDED — retained only for diff-against-rewrite legibility.
**Scope**: (Reduced) Empirically prove the `@vercel/node` adapter's
package-`main` contract (Phase 1); land a correct Vercel deploy
boundary at `src/server.ts` whose default export matches whatever
shape Phase 1 proves Vercel requires (Phase 2); repoint
`package.json` `main`; hard-fail the build when that artefact
contract is broken; keep the local runner stack (`bootstrap-app.ts`,
`server-runtime.ts`, `http.createServer` wrapper) intact in this
branch; complete L-8 Correction WI-8 ADR-163 amendment for the
reduced shape; record the Sentry Uptime Monitoring tool-selection
decision (build-out remains in `synthetic-monitoring.plan.md`);
update the docs that currently assert the old `dist/index.js`
architecture as Phase-2 acceptance criteria. **Out of scope**:
canonical Vercel Express layout (Fred+Betty vision), single
canonical Sentry init seam, deletion of any current local-runner
file, `application` esbuild entry retirement, `app.listen()` vs
`http.createServer(app)` reconciliation. See §Deferred Lanes.

---

## Why this plan looks the way it does (read this FIRST)

> Status was DRAFT until 2026-04-23 (rewrite + final Barney sign-off).
> It is now EXECUTION-READY. The reasoning trail is preserved
> verbatim below because the rewrite was non-trivial — three
> reviewer rounds — and the next-session agent benefits from
> seeing both rejected designs.

This document records two superseded design generations and one
binding rewrite. Read in this order to follow the reasoning trail:

1. **Phase 0 (doctrine landing) is real and binding.**
   `.agent/rules/no-warning-toleration.md`, the `principles.md`
   §Code Quality bullet, and the `.cursor/rules/no-warning-
   toleration.mdc` pointer all shipped in commit `c577cf16`
   (extended by `d8ae99e1`'s scope-discipline clause). Phase 0 is
   not under rewrite and binds every commit on this branch.
2. **Original Phases 1–9 are SUPERSEDED.** They were authored from a
   `architecture-reviewer-fred` + `architecture-reviewer-betty`
   convergence on the canonical-Vercel-Express thesis. Pre-execution
   `assumptions-reviewer` returned No-Go with twelve findings (see
   §Open Concerns). The original phase texts are retained at the
   bottom of this document under §Resolution Plan only as a
   diff-against-rewrite reference; they are NOT the design.
3. **`architecture-reviewer-barney` was then invited as a
   simplification-first counterweight.** Verdict: ABANDON-REFACTOR
   (see §Architecture-reviewer-barney report). Owner ratified the
   reframing 2026-04-23: *"I really like Barney's report, it's
   bold, I think it's right"* — Frame Finding A1 closed in Barney's
   favour.
4. **`assumptions-reviewer` then audited Barney's verdict.** Verdict:
   AMEND with five blocking findings (see §Assumptions-review of
   Barney's verdict). Barney's scoping wins were retained; his
   positive claims required four amendments (Vercel adapter contract
   probe, `bootstrap-app.ts` keep-vs-collapse, three-phase
   decision-completeness, documentation blast radius).
5. **The §Reduced-Scope Rewrite section IS the binding contract.**
   It folds Barney's scoping wins together with the assumption-
   reviewer's amendments into seven new phases (1–7) with explicit
   acceptance criteria. The §Deferred Lanes section captures every
   genuine improvement surfaced during this reasoning trail that is
   NOT being implemented in this branch, with named follow-up
   ownership.

**Sign-off**: architecture-reviewer-barney returned **GO** on
2026-04-23 confirming the rewrite resolves all three of his prior
AMEND blockers (operative-metadata coherence, Phase-1-contract-
neutral wording, Phase-4-decision-record-only). Status promoted to
`execution-ready`. Phase 1 (Vercel adapter contract probe) is now
the next-session entry point.

---

## Next Session Entry Point

(Updated 2026-04-23 end-of-session.) This plan is the **branch-
primary entry point** for the next session on
`feat/otel_sentry_enhancements`. Read in this order before doing
anything substantive:

1. This plan §Why this plan is DRAFT (5-step reasoning trail) +
   §Reduced-Scope Rewrite (the binding contract) + §Deferred Lanes
   (genuine improvements deferred to future work).
2. `.agent/rules/no-warning-toleration.md` — the doctrine landed in
   Phase 0 (commits c577cf16 + d8ae99e1). Every subsequent commit on
   this branch is bound by it.
3. The final architecture-reviewer-barney sign-off pass appended at
   session close to this plan (status promotion from `draft` to
   `execution-ready` is gated on Barney's GO).
4. `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
   — thread-record, retains the high-level lane state.

**Resume action**: open §Reduced-Scope Rewrite Phase 1 (Vercel
adapter contract verification probe). Barney's final pass returned
GO 2026-04-23; status is now execution-ready. The probe must
complete and its answer must be recorded in this plan before
Phase 2 (deploy boundary hardening) can begin — Phase 2 depends
on Phase 1's verified contract.

**Reviewer cadence on resume**: per-phase anchors as defined in
§Reviewer Scheduling. The reviewer cadence table still applies; the
phase contents are now Phase 1–7 from §Reduced-Scope Rewrite.

---

## Open Concerns (assumptions-review 2026-04-23, DRAFT-blocking)

The findings below are reproduced verbatim from the
`assumptions-reviewer` report run pre-execution on the original
Phase 1 + Phase 2 atomic design. Each finding is annotated with:

- **Verdict** — blocking / non-blocking / informational (per
  reviewer).
- **Evidence** — file:line citations from the actual codebase
  (not the plan-prose).
- **Open question for the rewrite** — what architecture-reviewer-
  barney's re-shape must answer.

The cadence rule (§Sub-agent review cadence + `invoke-code-
reviewers` rule §Reviewer-findings disposition discipline) makes
every blocking finding a stop-point until resolved. Acknowledging
them in this section IS the disposition; the resolution is the
plan rewrite under architecture-reviewer-barney.

### Finding #1 — Metafile output-key naming (non-blocking)

Plan §Phase 1 Task 1.1 hard-codes
`result.metafile?.outputs['dist/server.js']`. Esbuild output keys
are derived from `outdir` + entry-name; for the proposed
`server: 'src/server.ts'` entry with `outdir: 'dist'`, the key
shape would be `dist/server.js`. **But hard-coding the literal is
fragile**: any future entry-name change, `outbase` change, or
`absWorkingDir` change silently breaks the gate.

Evidence:

```text
apps/oak-curriculum-mcp-streamable-http/build-scripts/esbuild-config.ts:42-55
  return {
    entryPoints: { index: 'src/index.ts', application: 'src/application.ts' },
    bundle: true, platform: 'node', format: 'esm', target: 'es2022',
    sourcemap: 'external', packages: 'external', outdir: 'dist',
  };
```

**Open question for rewrite**: derive the assertion's target output
key from `entryPoints` (look up by `entryPoint === 'src/server.ts'`
in the metafile, or compute `outdir + name + .js`) rather than
hard-coding the literal path. Add a unit test for the derivation
helper.

### Finding #2 — `metafile: true` placement (non-blocking)

Plan implies adding `metafile: true` to the build call without
specifying which boundary owns it. The factory
`createMcpEsbuildOptions()` is documented as **the pure Oak-owned
build contract**, separate from env/policy logic in
`esbuild.config.ts`. Adding `metafile: true` in the factory couples
the contract to one enforcement gate; spreading it in the
composition root keeps the factory pure.

**Open question for rewrite**: the rewrite should explicitly state
that `metafile: true` lives in the composition root spread
(`build({ ...baseOptions, metafile: true, plugins: ... })`), NOT in
the factory. One sentence in the relevant phase will settle this.

### Finding #3 — `server.ts` skeleton ignores Result + DI surface (BLOCKING)

Plan §Phase 2 Task 2.1 example:

```typescript
const app: Express = await createApp({
  runtimeConfig,
  observability,
  // ... per the existing createApp factory signature
});
```

This is not implementable. The actual surface in `src/index.ts`:

```text
apps/oak-curriculum-mcp-streamable-http/src/index.ts:14-42
  const result = loadRuntimeConfig({ processEnv: process.env, startDir: process.cwd() });
  if (!result.ok) { process.stderr.write(result.error.message + '\n'); process.exit(1); }
  const config = result.value;
  const observabilityResult = createHttpObservability(config);
  if (!observabilityResult.ok) {
    process.stderr.write(describeHttpObservabilityError(observabilityResult.error) + '\n');
    process.exit(1);
  }
  const observability = observabilityResult.value;
  await startConfiguredHttpServer({
    runtimeConfig: config, observability,
    createApp: (opts) => createApp({
      ...opts,
      getWidgetHtml: () => WIDGET_HTML_CONTENT,
      setupSentryErrorHandler:
        config.env.SENTRY_MODE !== 'off' ? setupExpressErrorHandler : undefined,
    }),
    bootstrapApp,
    createServer: (app) => http.createServer(app),
    onSignal: (signal, handler) => process.once(signal, handler),
    exit: (code) => process.exit(code),
  });
```

`loadRuntimeConfig` and `createHttpObservability` are Result-bearing.
`createApp` requires `getWidgetHtml`, optionally
`setupSentryErrorHandler`, and accepts `clerkMiddlewareFactory`,
`rateLimiterFactory`, `upstreamMetadata` for tests. The plan's
template ignores all of this.

**Open question for rewrite**: where does Result→throw translation
live for the canonical entry-point boundary? Options: (a) inline at
top-level `server.ts` (per the principle "throw at boundary"); (b) a
new `unwrap-or-throw` helper in `@oaknational/result`; (c) a thin
`composeServer()` factory in the workspace. Per principles.md "no
Result silently swallowed", a throw at the entry boundary is
canonical — but the location matters for testability and for keeping
`server.ts` minimal. Barney should pick the boundary.

### Finding #4 — Sentry init ownership is misplaced in the plan (BLOCKING)

Plan §Phase 2 Task 2.3 proposes a new `src/sentry-init.ts` containing
`Sentry.init(...)` loaded via `--import`. **This contradicts the
actual init path on Vercel**: `Sentry.init(...)` already happens
inside `createHttpObservability` → `initialiseSentry` → `sdk.init(...)`:

```text
packages/libs/sentry-node/src/runtime.ts:169-190
export function initialiseSentry(
  config: ParsedSentryConfig, options: InitialiseSentryOptions,
): Result<SentryNodeRuntime, InitialiseSentryError> {
  if (config.mode === 'off') return ok(createNoopRuntime(config));
  ...
  try {
    sdk.init(createSentryInitOptions(config, {...}));
    return ok(createLiveRuntime(config, sdk, options.serviceName));
```

```text
apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts:167-231
function initialiseHttpSentryRuntime(...): Result<...> {
  ...
  const sentryRuntimeResult = initialiseSentry(sentryConfigResult.value, {
    serviceName, sdk: options?.sentrySdk, fixtureStore: options?.fixtureStore,
    postRedactionHooks: createHttpPostRedactionHooks(),
  });
```

And the local `start-server.sh` is explicit that the `--import
@sentry/node/preload` hook is required for ESM auto-instrumentation,
with **no pure-code alternative**:

```text
apps/oak-curriculum-mcp-streamable-http/scripts/start-server.sh:8-25
# The Sentry SDK requires the `--import @sentry/node/preload` Node.js CLI
# flag to enable auto-instrumentation of ESM modules.
# This is a Node.js ESM requirement, not a Sentry quirk. There is no
# pure-code alternative that preserves full auto-instrumentation for ESM.
```

Vercel does NOT execute `start-server.sh` — it imports the package's
`main` directly via the Node runtime adapter. So today on Vercel,
Sentry init happens because `createHttpObservability` is called
inside the request-bootstrap chain, and OTel/Sentry auto-
instrumentation that requires preload is **not in effect on Vercel**
(only on local Node when `start-server.sh` runs).

**Open questions for rewrite**:

- Is `src/sentry-init.ts` needed at all? If init lives in
  `createHttpObservability` and that runs at module top-level on
  Vercel via `server.ts`'s import graph, the init path is already
  closed. The "preload" pattern only adds value where ESM auto-
  instrumentation is meaningful — i.e. local Node.
- If we keep `src/sentry-init.ts` for local Node (replacing
  `@sentry/node/preload`), are we consciously taking ownership of
  the preload module's behaviour? That's a non-trivial scope grow
  — `@sentry/node/preload` is vendor-maintained.
- Recommended default: **drop `src/sentry-init.ts` from the plan
  entirely**; keep `--import @sentry/node/preload` for local Node;
  rely on `createHttpObservability` for runtime init on Vercel
  (status quo). Barney should weigh in.

### Finding #5 — `observability.close()` shutdown deletion (BLOCKING)

Plan §Phase 2 Task 2.2 says local listener has "no signal handlers
(Sentry SDK manages its own shutdown flush)". This is partially
true — Sentry handles Sentry's flush — but `server-runtime.ts`
currently coordinates `observability.close()` which flushes the
**OTel exporters** that the observability layer also owns:

```text
apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts:41-54
function createShutdownObservability(observability, bootstrapLog) {
  return async (exitReason) => {
    const closeResult = await observability.close();
    if (!closeResult.ok) {
      bootstrapLog.warn('observability.close.failed', { exitReason, error: closeResult.error.kind });
    }
  };
}
```

```text
apps/oak-curriculum-mcp-streamable-http/src/server-runtime.unit.test.ts:252-302
it('ignores duplicate shutdown signals and only flushes once', ...)
it('flushes observability on shutdown signals before exiting cleanly', ...)
```

On Vercel serverless the platform owns lifecycle so this is moot for
production. On local dev (`pnpm start` / `pnpm dev`) the flush-on-
SIGINT may matter for OTel batched exports.

**Open questions for rewrite**:

- Does the OTel BatchSpanProcessor flush on `process.exit()` or on
  Node's natural exit-when-idle, without our explicit handler? If
  yes, deletion is safe. If no, we need a tiny local-only handler in
  `main.ts`.
- Either keep a minimal `process.once('SIGINT', () => observability.
  close().then(() => process.exit(0)))` in `main.ts` (canonical local
  Node pattern; doesn't race Sentry on Vercel because it doesn't
  execute on Vercel), OR document the evidence that natural exit
  flush is sufficient.

### Finding #6 — Express 5 EADDRINUSE handling (BLOCKING)

Current code wraps in `http.createServer(app)` with a documented
justification:

```text
apps/oak-curriculum-mcp-streamable-http/src/index.ts:45-52
/* Express 5's app.listen() wraps the callback with once() and
 * registers it for both 'listening' and 'error' events. This means
 * EADDRINUSE fires the callback without the error argument, the
 * server never binds, and the process exits silently. Using
 * http.createServer directly lets us handle startup errors
 * explicitly. */
return http.createServer(app);
```

But `smoke-tests/local-server.ts` uses `app.listen(...).on('error',
...)` directly with no wrapping:

```text
apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-server.ts:57-78
const instance = app.listen(port, LOOPBACK_HOST, () => { ... });
instance.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') { reject(...); return; }
  reject(error);
});
```

These two surfaces in the same codebase contradict each other on
Express 5.2.x's actual behaviour.

**Open question for rewrite**: write a 30-line probe (or read
Express 5.2.x source + changelog) to definitively answer whether
`app.listen().on('error')` correctly catches EADDRINUSE without the
`http.createServer` wrap. Until proven, Phase 2 cannot delete the
wrapper without risking a regression.

### Finding #7 — Atomic-commit falsifiability gap (non-blocking)

Plan §Phase 1 acceptance criterion 5 requires the gate to be
"verified by deliberately running the gate against the pre-refactor
source on a throwaway commit". If Phase 1+2 land atomically, the
gate is never observed firing on the broken shape in committed
history; the proof becomes an ephemeral local artefact.

**Open question for rewrite**: prefer a unit test on the assertion
helper itself (gate fires when `outputs[X]?.exports` lacks
`'default'`) — committed proof — over an ephemeral build-log
screenshot. Add to Phase 1's acceptance criteria.

### Finding #8 — `application` esbuild entry has live consumers (BLOCKING)

The plan implicitly assumes `application` is redundant once
`server.ts` exists. It isn't:

```text
apps/oak-curriculum-mcp-streamable-http/build-scripts/esbuild-config.unit.test.ts:33-40
it('declares both entry points: index and application', () => {
  const options = createMcpEsbuildOptions();
  expect(options.entryPoints).toEqual({
    index: 'src/index.ts',
    application: 'src/application.ts',
  });
});
```

```text
apps/oak-curriculum-mcp-streamable-http/e2e-tests/built-artifact-import.e2e.test.ts:100-129
const moduleUrl = new URL('../dist/application.js', import.meta.url).href;
const module: unknown = await import(moduleUrl);
if (!isRelocatedBuiltApplicationModule(module)) {
  throw new TypeError(`Relocated module at ${moduleUrl} does not export createApp`);
}
```

**Open question for rewrite**: either keep the `application` entry
in Phase 2 and remove it in a separate later phase, or migrate every
consumer atomically (the unit test, the e2e test, the harness, plus
any tooling that reads `dist/application.js`). The atomic option
expands Phase 2's blast radius significantly.

### Finding #9 — Doctrine compliance for gate-as-warning (informational)

The metafile assertion is structural (binary fail/pass), not a
warning gradient. The new `no-warning-toleration.md` rule binds
warnings; the metafile assertion is a separate hard contract. Two
gates, one rule. The plan's wording should make this explicit so a
future agent doesn't misread the metafile gate as "the warnings
gate".

**Open question for rewrite**: tighten Phase 1 wording — "warnings-
as-errors enforces the warnings doctrine; the default-export
metafile assertion enforces the Vercel artefact contract; both gate
the same `build()` boundary". One sentence in the relevant phase.

### Finding #10 — `http-dev-contract.ts` consumes `src/index.ts` (BLOCKING)

The local dev harness invokes `tsx --import @sentry/node/preload
src/index.ts`, asserted by its own unit test:

```text
apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts:115-126
server: {
  label: 'http-dev-server',
  command: resolveWorkspaceBinary(workspaceRoot, 'tsx'),
  args: ['--import', '@sentry/node/preload', 'src/index.ts'],
  ...
},
```

Plan §Phase 2 Task 2.4 says delete `src/index.ts`. Both the dev
contract and its unit test would break.

**Open question for rewrite**: enumerate every consumer of
`src/index.ts`, `dist/index.js`, `bootstrapApp`, and
`startConfiguredHttpServer` in a Phase 2 §Consumer migration
inventory subsection. Migration must be atomic with deletion. Likely
new pointer: dev harness invokes `tsx --import @sentry/node/preload
src/main.ts` (or `src/server.ts` with the Result→throw boundary).

### Finding #11 — `package.json` Task 2.5 is wrong as written (BLOCKING)

Plan §Phase 2 Task 2.5: *"`"main": "dist/server.js"` (was
`dist/index.js`); `"types": "dist/server.d.ts"` (was
`dist/index.d.ts`); Remove `"exports"` mapping entries that pointed
at the deleted shape."*

But the actual `package.json`:

```text
apps/oak-curriculum-mcp-streamable-http/package.json:1-8
{ "name": "@oaknational/oak-curriculum-mcp-streamable-http",
  "version": "0.0.0-development", "private": true, "type": "module",
  "main": "dist/index.js", "scripts": { ...
```

There is **no `types` field, no `exports` map**, and the esbuild
pipeline emits no `.d.ts` files. The "remove exports / update types"
parts of Task 2.5 instruct edits to fields that don't exist.

**Open question for rewrite**: Task 2.5 reduces to a single change:
`"main": "dist/main.js"` (or `"dist/server.js"` per the chosen
canonical entry — see Finding #4 + Barney's recommendation). Drop
the `types`/`exports` fiction.

### Finding #12 — `start-server.sh` preload-replacement regression (BLOCKING)

Plan §Phase 2 Task 2.6 proposes:

```bash
node --import ./dist/sentry-init.js ./dist/main.js
```

Replacing `--import @sentry/node/preload` with our own
`./dist/sentry-init.js`. But per Finding #4, `@sentry/node/preload`
is the vendor-canonical mechanism for ESM auto-instrumentation;
replacing it without preserving its behaviour silently regresses
local-dev observability.

**Open question for rewrite**: most likely the right shape is to
**keep the vendor preload** AND not author `sentry-init.ts` at all
(see Finding #4 recommendation). The script becomes just:

```bash
node --import @sentry/node/preload ./dist/main.js
```

(only the entry-point name changes from `index.js` to `main.js`).
Barney should confirm.

---

## What architecture-reviewer-barney must answer in the rewrite

Per the simplification-first boundary mapping doctrine
(architecture-reviewer-barney's named focus):

1. **Entry-point boundary shape**: how many files are actually
   needed? The original convergence said three (`server.ts`,
   `main.ts`, `sentry-init.ts`). Findings #4 + #12 suggest
   `sentry-init.ts` is unnecessary; can it collapse to two
   (`server.ts` for Vercel default-export, `main.ts` for local
   Node)?
2. **Result→throw translation boundary**: where does Result
   unwrapping live so that `server.ts` stays minimal AND the
   translation is testable? See Finding #3.
3. **Shutdown coordination**: keep the `observability.close()`
   handler in `main.ts` only, or document evidence that natural
   exit flushes safely? See Finding #5.
4. **`http.createServer(app)` wrapper**: keep, delete, or replace
   with `app.listen().on('error')` after EADDRINUSE probe? See
   Finding #6.
5. **`application` esbuild entry**: keep + remove in a later phase,
   or migrate all consumers atomically with Phase 2? See Finding #8.
6. **Net delta target**: original plan claimed ≈−272 LoC removed +
   ≈+60 LoC added. With Findings #3 + #5 + #6 likely keeping more
   code than the original plan deleted, what is the realistic net
   delta? Simplification-first asks: are we still simplifying, or
   has the delta shrunk to the point where the refactor is no
   longer earning its disruption?
7. **Phase shape**: should the rewrite collapse Phase 1 + Phase 2
   into one phase (the gate is meaningless without the shape it
   gates), or keep them separate with the gate's first phase
   asserting the existing entry shape (`dist/index.js`'s default
   export contract) as a structural pre-condition for Phase 2?

---

## Architecture-reviewer-barney report (2026-04-23) — verdict: ABANDON-REFACTOR

> Sub-agent: `architecture-reviewer-barney` (simplification-first
> boundary mapping). Read-only. Run 2026-04-23 immediately after
> the assumptions-reviewer No-Go and the plan demotion to DRAFT.
> Verbatim report below.
>
> **2026-04-23 STATUS UPDATE** (post assumption-review of Barney):
> this section is **no longer a binding rewrite contract**. It is
> a **proposed rewrite frame** pending the four amendments
> enumerated in §"Assumptions-review of Barney's verdict". The
> assumption-review issued **AMEND** (five blocking findings) and
> recommended that this section's authority be narrowed before
> any phase is rewritten. Barney's big scoping corrections (kill
> the fictional `types`/`exports` edits, kill `sentry-init.ts`,
> kill the preload replacement, kill the `application`
> retirement in this branch) are RETAINED. Barney's positive
> claims (which files to keep verbatim, the three-phase shape,
> "ABANDON-REFACTOR" framing) are PENDING reconciliation.

### Verdict

**ABANDON-REFACTOR.** Abandon the original structural refactor
that deletes `src/index.ts`, `src/bootstrap-app.ts`,
`src/server-runtime.ts`, and the associated local lifecycle
behaviour. The simplification-first boundary fix that still
earns its keep is much smaller:

- add a Vercel-facing `server` entry,
- point `package.json` `main` at that artefact,
- keep Sentry init ownership where it already lives,
- keep vendor preload for local Node,
- keep the tested local listener/shutdown boundary,
- keep `application` until a separate consumer-retirement lane
  is ready.

### Boundary map — current

```text
Vercel runtime
  -> package main = dist/index.js
  -> bundled src/index.ts executes at module load
  -> loadRuntimeConfig(Result) -> stderr + exit(1)
  -> createHttpObservability(Result) -> stderr + exit(1)
  -> startConfiguredHttpServer(...)
       -> bootstrapApp(...)
            -> createApp(...)
       -> http.createServer(app)
       -> server.on('error', ...)
       -> process.once(SIGINT/SIGTERM, ...)
       -> observability.close() on bootstrap failure, listen error,
          and shutdown
```

Key load-bearing facts in the current boundary (cited directly
from code):

- `package.json` `main` points at `dist/index.js`
  (`apps/oak-curriculum-mcp-streamable-http/package.json:1-8`).
  Vercel imports that module and rejects it because it has no
  default export (root cause of WI-7 lambda boot crash).
- Sentry runtime init lives in `createHttpObservability(...)` →
  `initialiseHttpSentryRuntime(...)` → `initialiseSentry(...)` →
  `sdk.init(...)`
  (`apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts:167-231`,
  `packages/libs/sentry-node/src/runtime.ts:169-197`). NOT in
  `start-server.sh` and NOT in any preload module Oak owns.
- Result→boundary translation is split: config/observability
  Results convert to `stderr + exit(1)` in `src/index.ts`
  (`src/index.ts:14-30`); async start failures convert via
  `bootstrapApp` to logged-error + cleanup + exit + rethrow
  (`src/bootstrap-app.ts:45-53`).
- Shutdown ownership is in `server-runtime.ts` (NOT in Sentry
  alone). Local runtime calls `observability.close()` for
  bootstrap failure, listen error, and signal shutdown. Unit
  tests lock in "flush once" + "flush before exit" semantics
  (`src/server-runtime.ts:41-103`,
  `src/server-runtime.unit.test.ts:206-302`).
- Local Node + dev adapters target `src/index.ts` and KEEP the
  vendor preload hook
  (`scripts/start-server.sh:8-25,42-44`,
  `operations/development/http-dev-contract.ts:115-126`).

### Boundary map — target

```text
Vercel runtime
  -> package main = dist/server.js
  -> src/server.ts
  -> workspace-local app composition helper
       -> loadRuntimeConfig(Result -> throw)
       -> createHttpObservability(Result -> throw)
       -> createApp(...)
  -> default export = configured Express app

Local Node/dev
  -> vendor preload stays (--import @sentry/node/preload)
  -> local runner entry (KEEP src/index.ts in this branch;
     rename later only if needed)
  -> same workspace-local app composition helper
  -> existing local listener/shutdown boundary survives
       -> keep http.createServer(app)
       -> keep server.on('error', ...)
       -> keep observability.close() on shutdown

Importable factory consumers
  -> dist/application.js remains
  -> createApp + loadRuntimeConfig contract stays live for tests
     and tooling
```

The smallest target that fixes WI-7 is **not** "delete the
local runtime stack"; it is **separate the Vercel deploy
boundary from the local runner boundary**.

### Direct answers to the seven open questions

**Q1 — Entry-point boundary shape** (Findings #4 + #12).
`src/sentry-init.ts` should not exist in this rewrite. Sentry
init already happens through `createHttpObservability(...)`
and the local shell script documents `--import
@sentry/node/preload` as the vendor-canonical mechanism for ESM
auto-instrumentation, with no pure-code alternative
(`src/observability/http-observability.ts:167-231`,
`packages/libs/sentry-node/src/runtime.ts:169-197`,
`scripts/start-server.sh:8-25`). Adding `sentry-init.ts` would
create a second ownership point for Sentry semantics rather
than simplifying them. Two runtime entry points, zero custom
preload file. Do **not** force the local runner rename in this
branch; current consumers anchor `src/index.ts` /
`dist/index.js` in the dev contract, unit tests, `start`
script, and package metadata
(`operations/development/http-dev-contract.ts:115-126`,
`operations/development/http-dev-contract.unit.test.ts:56-71`,
`scripts/start-server.sh:42-44`,
`package.json:6-20`). Rename to `main.ts` is a later cleanup,
not part of the contract fix. The build legitimately keeps
three artefacts for now (Vercel server entry, local runner
entry, importable application entry) — that is a consequence of
live consumers proving `dist/application.js` is still part of
the contract
(`build-scripts/esbuild-config.unit.test.ts:33-40`,
`e2e-tests/built-artifact-import.e2e.test.ts:100-155`).

**Q2 — Result→throw translation boundary** (Finding #3).
Translation lives in a **workspace-local app-composition
helper**, not inline in `server.ts`, and not in a new generic
helper in `@oaknational/result`. `loadRuntimeConfig` and
`createHttpObservability` are app-specific boundaries returning
`Result<...>`; the workspace already has the precedent
`createHttpObservabilityOrThrow(...)` in
`src/observability/http-observability.ts:203-245`. Translate at
the app boundary, not in shared core. The composition helper
gives the local runner access to the same configured
{app, observability, runtime} tuple — important because the
local runner currently owns shutdown and listen-error handling
that need the observability handle
(`src/server-runtime.ts:57-103,117-159`).

**Q3 — Shutdown coordination** (Finding #5). Keep
`observability.close()` in the local runner boundary only. The
observability contract explicitly says `close()` "drains
pending events AND disables the SDK" and names shutdown paths
as the intended call sites
(`src/observability/http-observability.ts:79-88`). The tests
encode the contract — de-duplicated shutdown, flush before exit
(`src/server-runtime.unit.test.ts:252-302`). Deleting that in
this branch turns a Vercel deploy-shape fix into a local
lifecycle rewrite — the opposite of minimising blast radius.
The target is asymmetric **by design**: Vercel gets the minimal
default-export app boundary; local Node keeps explicit shutdown
coordination. Different lifecycle owners, different boundaries.

**Q4 — `http.createServer(app)` wrapper** (Finding #6). The
wrapper survives this branch. The production/local-runner path
contains explicit Express-5 rationale for avoiding
`app.listen()`, and that behaviour is covered by the local
runtime's tested error-handling boundary
(`src/index.ts:44-53`,
`src/server-runtime.ts:57-83`,
`src/server-runtime.unit.test.ts:221-250`). The contradictory
evidence in `smoke-tests/local-server.ts:57-78` shows another
path uses `app.listen(...).on('error', ...)` successfully, but
that is **not enough** evidence to delete the production/local-
runner wrapper in the same branch. Treat the smoke helper as a
separate harness, not as authoritative proof. If anyone wants
the wrapper deleted later, that is a tiny dedicated probe or a
Wilma review, not a piggy-back on WI-7. Mark
`http.createServer(app)` explicitly as **retained** in the
rewrite, not as debt slated for deletion.

**Q5 — `application` esbuild entry** (Finding #8). Do not
retire it in this branch. The build contract still declares
both `index` and `application` and the unit test enforces that
shape
(`build-scripts/esbuild-config.ts:42-55`,
`build-scripts/esbuild-config.unit.test.ts:33-40`). The E2E
test imports `dist/application.js` under plain Node ESM
(`e2e-tests/built-artifact-import.e2e.test.ts:100-155`).
Additional concern: the consumer surface is already drifted, not
cleanly inventoried — `scripts/server-harness.js:120-153`
imports `createApp` from `dist/application.js` and calls it
with only `runtimeConfig`, but `CreateAppOptions` requires both
`runtimeConfig` and `observability` and also requires
`getWidgetHtml` (`src/application.ts:33-85,180-235`). The
`application` consumer story needs cleanup **before**
retirement, not deletion during the deploy-boundary fix. Retain
it; retirement is a separate follow-up lane.

**Q6 — Net delta** (the hard honesty question). The original
"−272 LoC removed / +60 LoC added" is no longer credible. If
the rewrite keeps `server-runtime.ts`, `bootstrap-app.ts`,
`http.createServer(app)`, local shutdown, vendor preload, and
`application.ts`, then the branch mostly **adds**: one Vercel-
facing entry module, one small composition helper, light
surgery in `index.ts`, package/build updates, maybe one unit
test for the metafile-output derivation helper. The only
meaningful deletion candidate is duplicated startup glue in
`index.ts` if you factor it into the composition helper. The
net delta is roughly flat to mildly positive. The refactor no
longer earns disruption on line-count grounds — it is only
worth doing as a **narrow deploy-boundary repair**. Reframe the
work or stop calling it a "simplification".

**Q7 — Phase shape** (the structural recommendation). Do
**not** keep the old "Phase 1 build gate, Phase 2 large
canonical refactor" split. The default-export assertion is only
meaningful once a deploy-target artefact exists, so the gate
and the new Vercel entry boundary belong together. Separate
**hard deploy boundary** from **consumer/documentation
cleanup**. Remove any phase that promises to delete the local
runtime stack in this branch.

### Recommended phase shape (binding for the rewrite)

#### Phase 1 — Deploy Boundary Hardening

**Scope**:
`apps/oak-curriculum-mcp-streamable-http/src/server.ts` (new),
one workspace-local composition helper, `src/index.ts` only
insofar as it reuses that helper, `esbuild.config.ts`,
`build-scripts/esbuild-config.ts`,
`build-scripts/esbuild-config.unit.test.ts`, `package.json`.

**Acceptance criteria**:

- Build emits a Vercel-target artefact with a default export;
  `package.json` `main` points at that artefact.
- Warnings are fatal at the build boundary (per
  `.agent/rules/no-warning-toleration.md:21-37,54-79`);
  default-export assertion derives its target from the
  entry-point contract rather than a brittle hard-coded literal
  (resolves Open Concerns #1 + #2).
- `application` remains an emitted entry; its tests stay green.
- No `sentry-init.ts` is introduced; local preload stays
  vendor-owned.

**Deterministic validation**:

- Unit test proves the metafile-target derivation helper and
  the "missing default export" failure case (resolves Open
  Concerns #7 — committed proof, not ephemeral logs).
- Three-arm workspace build (`disabled`, `skipped`,
  `configured`) exits cleanly with zero warnings and passes
  the contract assertion.
- Full workspace gates remain mandatory after the phase.

#### Phase 2 — Local Continuity and Consumer Correction

**Scope**: only the directly impacted local/dev/tooling
surfaces — `scripts/start-server.sh`,
`operations/development/http-dev-contract.ts`,
`operations/development/http-dev-contract.unit.test.ts`,
`scripts/server-harness.js`, and any app-local docs that
currently claim `dist/index.js` is the deploy artefact.

**Acceptance criteria**:

- Local start/dev continues to use `--import
  @sentry/node/preload`; no custom preload replacement
  introduced (resolves Open Concerns #4 + #12).
- Local runner boundary retains explicit listen-error and
  shutdown ownership; no deletion of `server-runtime.ts` or
  `bootstrap-app.ts` is attempted in this branch (resolves
  Open Concerns #5 + #10).
- `application` consumer inventory is corrected or explicitly
  deferred; no retirement attempt lands here (resolves Open
  Concerns #8).

**Deterministic validation**:

- Dev-contract unit tests stay green.
- Built-artifact import E2E remains green.
- Any harness/script touched is validated against the actual
  `CreateAppOptions` contract.

#### Phase 3 — ADR / Monitoring / Documentation Handoff

**Scope**: the plan, ADR-163 §6/§7 amendment, monitoring-plan
unblock, and only the docs that would become misleading after
Phase 1.

**Acceptance criteria**:

- The rewritten plan explicitly records that the large local-
  runtime deletion refactor was abandoned.
- The monitoring/ADR lanes consume the deploy-boundary lesson,
  not an invented `server.ts/main.ts/sentry-init.ts` canon.
- No documentation claims that `dist/index.js` is still the
  Vercel deploy artefact after Phase 1.

**Deterministic validation**:

- Markdown lint clean.
- Reviewer rerun on the rewritten plan before implementation
  (assumptions-reviewer fires AGAIN), because the old Phase 2
  assumptions are no longer the unit of work.

### Net-delta sanity check (Barney verbatim)

> The honest net delta is "small contract fix, not sweeping
> simplification". If the rewrite keeps the tested local
> runtime boundary and preserves the `application` contract,
> then the code churn is mainly additive… The deck-chairs risk
> is real. Keep the work only if it is reframed as: (1)
> introduce a correct Vercel server artefact, (2) hard-fail the
> build when that artefact contract is broken, (3) leave the
> local runner stack alone.

### What is now removed from scope (vs. original Phases 1–9)

The following original Phase 2+ tasks are **dropped** by this
verdict:

- Delete `src/index.ts` — DROPPED (Open Concerns #10).
- Delete `src/bootstrap-app.ts` — DROPPED (Open Concerns #5).
- Delete `src/server-runtime.ts` and its unit tests — DROPPED
  (Open Concerns #5 + #6).
- Author `src/sentry-init.ts` — DROPPED (Open Concerns #4 +
  #12).
- Replace `node --import @sentry/node/preload` with `node
  --import ./dist/sentry-init.js` — DROPPED (Open Concerns
  #12).
- Update `package.json` `types` and `exports` fields — DROPPED
  as fictional (Open Concerns #11; only `main` is changed).
- Retire the `application` esbuild entry — DEFERRED to a
  separate lane (Open Concerns #8).
- Phase 3 type-level RequestHandler / Express app contract
  changes that depended on the deletion of `server-runtime.ts`
  — DEPENDENT, REVISIT after Phase 1+2 land.

The following original phases **survive** in materially
unchanged form:

- Phase 5 (Sentry Uptime Monitoring lane unblock) — unchanged;
  consumes Phase 1's working artefact.
- Phase 6 (Vercel preview probe re-do) — unchanged.
- Phase 7 (ADR-163 §6/§7 amendment) — folds into the new Phase
  3 above.

---

## Assumptions-review of Barney's verdict (2026-04-23) — verdict: AMEND

> Sub-agent: `assumptions-reviewer` (meta-level plan reviewer for
> proportionality, assumption validity, and blocking
> legitimacy). Read-only. Run 2026-04-23 immediately after Barney's
> ABANDON-REFACTOR report was folded into this plan, on owner
> directive: *"please run Barney's perspective past the assumption
> reviewer"*. The reviewer's own framing — *"this is a useful but
> slightly late audit. Barney was asked only after the original
> plan had already been written, demoted, and partially landed at
> Phase 0; that sequencing is itself a planning smell, because
> assumption-challenge is cheapest before a reviewer section is
> promoted to 'binding contract'"* — IS itself a process finding
> and lands in the napkin separately.

### Verdict

**AMEND.** Barney's report is directionally stronger than the
original Phase 2 design and correctly invalidates the most
speculative parts (fictional `types`/`exports` edits; bespoke
`src/sentry-init.ts`; preload replacement; unscoped `application`
retirement). In that sense the prior No-Go is **partially
resolved**. But Barney's verdict is **not safe to bind as-is** —
it replaces plan-vs-code drift with a smaller set of
verdict-vs-doctrine and verdict-vs-contract assumptions that need
naming, ownership, or proof before this becomes the rewrite
contract.

### Findings

#### Finding A1 — Frame legitimacy: simplification-first treated as decisive (BLOCKING)

Barney's section says it "IS the rewrite contract" and frames the
answer as `ABANDON-REFACTOR` under simplification-first reasoning,
but does not explicitly reconcile that with the branch's prior
Fred + Betty convergence or the owner's canon/architectural-
excellence directives in the same plan.

Evidence: this plan records that the original design came from a
`architecture-reviewer-fred` + `architecture-reviewer-betty`
convergence and was then sent to Barney **as a simplification-
first counterweight, not as a higher court** (this plan's §Why
this plan is DRAFT and §What architecture-reviewer-barney must
answer in the rewrite). The same plan also records the owner
directive *"we ALWAYS optimise for long-term architectural
excellence over short-term expediency"* and *"we take the
canonical and idiomatic approach, always"* (this plan's §Standing
decisions / §Pattern reminders). `AGENT.md` lists Barney/Fred/
Betty/Wilma as parallel specialist reviewers
(`.agent/directives/AGENT.md:117-139`); it does not grant Barney
override authority.

**Question before binding**: Is the branch disposition now
*"narrow deploy-boundary repair in this branch, with any broader
canonicalisation explicitly deferred"*, or is Fred/Betty's
canonical-shape thesis being **rejected**? The contract needs
that decision **stated explicitly** by the owner.

#### Finding A2 — The new `server.ts` deploy boundary is itself an assumed contract (BLOCKING)

Barney's Phase 1 assumes `dist/server.js` can become the package
`main`, export a configured Express app as default, and satisfy
Vercel's runtime contract.

Evidence: the current evidence proves only that Vercel rejected
`dist/index.js` because the deployed module **lacked** a default
export; it does **not** prove the stronger claim that "async-
composed Express app exported from `server.ts`" is the right
replacement. The current package main is `dist/index.js`
(`apps/oak-curriculum-mcp-streamable-http/package.json:1-7`).
`createApp` is async and currently needs both `runtimeConfig` and
`observability`, plus `getWidgetHtml` and optional Sentry wiring
(`apps/oak-curriculum-mcp-streamable-http/src/application.ts:33-85,176-235`).
The current entry point handles sync Result boundaries and then
awaits the local runner
(`apps/oak-curriculum-mcp-streamable-http/src/index.ts:14-58`).
Barney's target map simply asserts `default export = configured
Express app` without proving the async/module-load side of that
contract.

**Question before binding**: What exact runtime shape must
`dist/server.js` expose to Vercel, and can that shape be produced
in a way Vercel will actually accept? This needs either a
**pre-Phase-1 verification probe** or a concrete acceptance
criterion, not an inference from "the previous shape failed". The
failure mode of the previous shape and the required success shape
of the next shape are **not the same evidence**.

#### Finding A3 — `bootstrap-app.ts` retention is unjustified by Barney's own evidence (BLOCKING)

Barney's verdict keeps `src/bootstrap-app.ts`, but his evidence
mostly supports preserving `server-runtime.ts` shutdown/error
behaviour, not this wrapper specifically.

Evidence: `bootstrap-app.ts` only does four things on startup
failure: log, optionally run `onStartupFailure`, call `exit(1)`,
and rethrow
(`apps/oak-curriculum-mcp-streamable-http/src/bootstrap-app.ts:45-53`).
The load-bearing local lifecycle semantics Barney cites live in
`server-runtime.ts` and its tests
(`apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts:117-159`,
`apps/oak-curriculum-mcp-streamable-http/src/server-runtime.unit.test.ts:206-302`).
**Nothing he cites proves that this wrapper must remain a
separate file** rather than being collapsed into the local runner
or composition helper.

**Question before binding**: What observable behaviour is lost if
startup-failure cleanup/logging is moved into the retained local
runner boundary and `bootstrap-app.ts` is deleted? If the answer
is "none material", the contract should not freeze that file in
place.

#### Finding A4 — Three-phase shape is not decision-complete (BLOCKING)

Barney calls his three-phase rewrite "binding", but it still
references old phase numbers and defers work without owned lanes.

Evidence: Barney defines new Phases 1-3 (this plan's
§Recommended phase shape), then says original Phases 5/6/7
"survive" (this plan's §What is now removed from scope). He also
says `application` retirement is deferred to a separate lane and
the original type-level work should be revisited later, but the
report **does not create or name the lane** that now owns either
concern.

**Question before binding**: Which items are in this contract,
which are explicitly rejected, and which already have executable
follow-up lanes with owners? Until that is spelled out, this is a
persuasive reviewer note, not a binding rewrite contract.

#### Finding A5 — Documentation blast radius understated; doctrine blocker (BLOCKING)

Barney's Phase 3 says only that no documentation should still
claim `dist/index.js` is the Vercel deploy artefact after Phase 1,
but the current docs do **much more than that**: they explicitly
assert the opposite architecture, and the documentation-hygiene
principle is a hard repo doctrine.

Evidence: `docs/deployment-architecture.md` says the runtime
model is `dist/index.js` plus `dist/application.js`, and
explicitly says `src/index.ts` does **not** export a separate
Vercel-only default export
(`apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md:10-17,23-33,55-67,440-450,486-494`).
The workspace `README.md` tells operators that Vercel should use
`dist/index.js` and that the repo does not rely on a separate
Vercel-only default export path
(`apps/oak-curriculum-mcp-streamable-http/README.md:143-145,200-201,310-312,346-348`).
Repo doctrine makes misleading docs blocking
(`.agent/directives/principles.md:321-325`).

**Question before binding**: Which docs are updated in Phase 1
versus Phase 3, and what is the acceptance criterion for
eliminating stale `dist/index.js` / "no separate Vercel path"
claims? This is not a Phase 3 cleanup — it is a Phase 1
acceptance criterion under the documentation-hygiene rule.

#### Finding A6 — `sentry-init.ts` rejection is sound but presented as final (NON-BLOCKING)

Barney is right to drop `src/sentry-init.ts` from this branch,
but that is a pragmatic defer, not a full architectural answer to
the Fred/Betty seam-ownership concern.

Evidence: Sentry init really does happen today inside HTTP
observability
(`apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts:167-245`)
via `initialiseSentry()`
(`packages/libs/sentry-node/src/runtime.ts:169-197`), and local
Node really does rely on vendor preload for ESM auto-
instrumentation
(`apps/oak-curriculum-mcp-streamable-http/scripts/start-server.sh:8-44`).
That supports "do not change this during the WI-7 repair". It
does **not**, by itself, settle whether "init-via-observability
side effect" is the long-term canonical seam.

**Question before binding**: Is the plan **explicitly** deferring
the "single canonical Sentry init seam" question, or implicitly
treating it as closed?

#### Finding A7 — Wrapper/shutdown keeps overstate the architectural argument (NON-BLOCKING)

Barney sometimes writes as though the current local shape
(`http.createServer(app)` + explicit signal handlers) is **thereby
vindicated**. The evidence supports retention as scope control,
not as proof of correctness.

Evidence: the current local runner does encode explicit
shutdown/error semantics
(`apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts:41-159`)
and tests prove those semantics
(`apps/oak-curriculum-mcp-streamable-http/src/server-runtime.unit.test.ts:221-302`).
The observability contract documents `close()` as the preferred
shutdown path
(`apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts:79-88`).
But the same workspace's smoke server uses `app.listen(...).on('error', ...)`
successfully
(`apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-server.ts:57-78`),
so the contradiction remains unresolved.

**Question before binding**: Is the contract saying "retain until
separately disproven" or "retain because proven correct"? The
former is supported; the latter is not.

#### Finding A8 — `application` keep-case has a drifted consumer (NON-BLOCKING)

Barney's keep-case for `application` cites consumers including
`scripts/server-harness.js`. That harness is **already invalid**
against the current `CreateAppOptions` contract.

Evidence: `scripts/server-harness.js` imports `createApp` from
`dist/application.js` and calls it with only `runtimeConfig`
(`apps/oak-curriculum-mcp-streamable-http/scripts/server-harness.js:120-153`),
even though `CreateAppOptions` requires `runtimeConfig`,
`observability`, and `getWidgetHtml`
(`apps/oak-curriculum-mcp-streamable-http/src/application.ts:33-85`).

**Question before binding**: Which `application` consumers are
authoritative enough to force retention in this branch, and which
should be repaired or removed first?

#### Finding A9 — Net-delta honesty shifts value axis without naming the trade-off (INFORMATIONAL)

Barney's "roughly flat net delta" correction is a real
improvement over the original `−272/+60` narrative. But it shifts
the value axis from "canonical/doctrinal alignment" to
"LoC/disruption" without naming that trade-off explicitly.

Evidence: Barney says the work is only worth doing as a narrow
deploy-boundary repair and not as a simplification story (this
plan's §Net-delta sanity check). The original plan's value claim
was doctrinal (Vercel canon), not line-count.

**Question before binding**: Is this branch still called
"canonical deploy shape", or is it now explicitly "deploy-
boundary repair + warning-contract enforcement"? The plan title
itself encodes the framing.

### Recommended next move

The prior No-Go is **partially resolved** but **not fully
resolved**. Barney has correctly invalidated the most speculative
parts of the old plan. The remaining problem is no longer "the
plan contradicts the code everywhere"; it is "the replacement
verdict is still too implicit about authority, deploy-boundary
proof, documentation ownership, and deferred-lane ownership".

Before any rewrite is committed:

1. **Amend Barney's section** so it is no longer treated as
   binding "as-is". It becomes a **proposed rewrite frame**
   pending four explicit amendments:
   - State the governing disposition between Barney vs Fred/Betty
     (resolves Finding A1) — this is an **owner decision**, not a
     reviewer decision.
   - Add a Phase 1 proof item for the actual Vercel `server.ts`
     artefact contract (resolves Finding A2) — pre-Phase-1
     verification probe, not inference.
   - Separate "keep local runner behaviour for now" from "keep
     every current wrapper file forever" (resolves Finding A3)
     — `bootstrap-app.ts` may collapse into the composition
     helper without compromising the shutdown coordination
     Barney correctly wants to preserve.
   - Enumerate the concrete docs and follow-up lanes that
     become mandatory if `main` moves to `dist/server.js`
     (resolves Findings A4 + A5) — `docs/deployment-architecture.md`,
     workspace `README.md`, ADR-163 §6/§7, and the
     `application`-retirement lane all need owners and
     acceptance criteria.

2. **Keep Barney's big scoping corrections**:
   - no `src/sentry-init.ts` in this branch;
   - no preload replacement;
   - no fictional `types`/`exports` edits;
   - no `application` retirement in the deploy-fix branch.

3. **Re-run assumptions review on the rewritten plan text**, not
   on Barney's raw report. At that point the question should be
   much smaller: "is this now a clean narrow deploy-boundary
   repair plan with owned deferrals?", not "should we throw away
   the whole plan again?"

So the correct disposition is: **Barney replaces the original
No-Go with a narrower amendment set, not with a clean GO.**

---

## Architecture-reviewer-barney final sign-off (2026-04-23) — verdict: GO

> Sub-agent: `architecture-reviewer-barney` (simplification-first
> boundary mapping). Read-only. Resumed final pass on the rewritten
> plan after the §Reduced-Scope Rewrite + §Deferred Lanes sections
> landed and after his three AMEND blockers were actioned in this
> session. Verbatim verdict below; this report **is** the sign-off
> that promoted the plan from `draft` to `execution-ready`.

### Verdict

**GO.** Sign-off granted. Status can promote from `draft` to
`execution-ready`.

### Resolution of prior AMEND blockers

1. **Operative metadata is now coherent.** The frontmatter `todos`
   block contains only the binding `phase-0` through `phase-7`
   items, with the stale duplicate legacy-phase entries removed.
   The formerly conflicting phase-keyed sections (§Solution
   Architecture, §Reviewer Scheduling, §Documentation Propagation
   Commitment, §Testing Strategy, §Success Criteria) are now
   explicitly demoted behind clear supersession banners. The
   binding source of truth is consistently §Reduced-Scope Rewrite.
2. **Phase 1 is now genuinely a probe.** The frontmatter overview,
   top-level scope, and §Reduced-Scope Rewrite Phase 2 prose all
   keep the runtime shape contract-neutral ("whatever shape Phase
   1 proves Vercel requires"). The probe is discovery-first, not
   inference dressed up as proof. Resolves Finding A2.
3. **Phase 4 no longer claims monitor build-out.** Disposition
   table, Phase 4 heading + scope + acceptance criteria, and
   `phase-4-uptime-unblock` todo all consistently scope this branch
   to the tool-selection decision and `blocked_on` removal in
   `synthetic-monitoring.plan.md`. Build-out stays in that plan.
   Phase 4/5 sequencing contradiction eliminated.

### Asymmetric design coherence

Local continuity remains on `dist/index.js` and vendor preload
(§Reduced-Scope Rewrite → Phase 3); Vercel is the separate
`dist/server.js` deploy boundary (§Reduced-Scope Rewrite → Phase
6). Asymmetry holds together cleanly across the binding contract.

### Note (non-blocker)

Legacy bodies still contain obsolete canonical-refactor prose
under their SUPERSEDED banners. Banners are strong and explicit
enough that they no longer mis-bind the next session. Acceptable
for diff-legibility.

### Closing posture

No remaining amendments. Phase 1 (Vercel adapter contract
verification probe) opens for the next session.

---

## Reduced-Scope Rewrite (BINDING CONTRACT)

> **This section IS the binding contract for the rewrite.** It folds
> Barney's scoping wins together with the assumption-reviewer's five
> blocking findings. Owner ratified Frame Finding A1 (2026-04-23):
> *"I really like Barney's report, it's bold, I think it's right"*
> — this branch is now scoped as a **narrow deploy-boundary repair**;
> the broader canonicalisation thesis from Fred + Betty is preserved
> as a follow-up lane (see §Deferred Lanes).
>
> Frame: **MCP Deploy-Boundary Repair**, NOT "Canonical Deploy Shape".
> The plan title has been amended accordingly. Per Finding A9, that
> framing change is explicit: this branch is a contract repair, not
> a canonicalisation.

### Disposition summary (for next-session resumption)

| Item | Disposition | Source |
| --- | --- | --- |
| Phase 0 doctrine landing | LANDED + binding | commits c577cf16 + d8ae99e1 |
| Vercel deploy boundary repair | IN SCOPE — new Phase 2 | Barney verdict + Finding A2 |
| Build self-assertion (metafile + warnings-as-errors) | IN SCOPE — new Phase 2 | original Phase 1 (survives Barney) |
| Doc updates (`deployment-architecture.md`, `README.md`) | IN SCOPE — Phase 2 acceptance criterion | Finding A5 (elevated from cleanup) |
| ADR-163 §6/§7 amendment | IN SCOPE — new Phase 6 | original Phase 7 (scope-narrowed) |
| Sentry Uptime Monitoring tool-selection decision | IN SCOPE — new Phase 4 | original Phase 5 (decision record only; build-out stays in `synthetic-monitoring.plan.md`) |
| `src/sentry-init.ts` | OUT OF SCOPE | Barney verdict, Finding A6 |
| `--import @sentry/node/preload` replacement | OUT OF SCOPE — preload retained | Barney verdict |
| `package.json` `types` / `exports` edits | OUT OF SCOPE — fictional | Barney verdict (Open Concern #11) |
| Delete `src/index.ts` / `bootstrap-app.ts` / `server-runtime.ts` | OUT OF SCOPE — local runner stack retained | Barney verdict, Finding A7 |
| `application` esbuild entry retirement | OUT OF SCOPE — deferred lane | Barney verdict, Finding A8 |
| `app.listen()` vs `http.createServer(app)` reconciliation | OUT OF SCOPE — deferred lane | Open Concern #6, Finding A7 |
| Single canonical Sentry init seam | OUT OF SCOPE — deferred lane | Finding A6 |
| `bootstrap-app.ts` collapse evaluation | OUT OF SCOPE — deferred lane | Finding A3 |
| Canonical Vercel Express layout (Fred+Betty thesis) | OUT OF SCOPE — deferred lane | owner ratification of Barney frame |

### Phase 1 — Vercel adapter contract verification probe

**Why this is a phase, not an assumption**: assumption-review Finding
A2 established that the previous "no default export" failure proves
only what the OLD shape was, not what the NEW shape must be.
Phase 2 designs depend on Phase 1's empirical answer.

**Scope** (read-only / research):

- Read `@vercel/node` source or current docs to determine the exact
  contract Vercel's Node serverless adapter expects from a package's
  `main`. Specific questions:
  - Does the adapter `import(packageMain)` and call `.default(req,
    res)`, or does it call `.default()` once and treat the result as
    a request handler, or does it execute the module and listen for
    `app.listen()`?
  - Is `default export = configuredExpressApp` correct, or is the
    canonical form `default export = serverless(app)` from
    `serverless-http` / `@vercel/node`'s wrap?
  - Does the adapter tolerate `default export = Promise<Express>`
    (i.e. top-level await in `server.ts`), or must the default
    export be synchronously available at module-load time?
- If documentation is inconclusive, ship a 30-line minimal probe:
  one `dist/probe-default.js` exporting `default = (req, res) =>
  res.end('ok')` deployed to a throwaway Vercel preview, alongside
  one `dist/probe-app.js` exporting `default = expressInstance`.
  Compare deployment results.
- Record the answer in this section as **Phase 1 outcome**, with
  citation (file:line for `@vercel/node` source, or commit hash +
  preview URL for the empirical probe).

**Acceptance criteria**:

- Documented answer to "what runtime shape must `dist/server.js`
  expose?" lives in this plan, in this Phase 1 section, before any
  Phase 2 code is written.
- Answer cites primary evidence (Vercel docs / `@vercel/node`
  source / preview deployment), not inference from WI-7's failure.

**Deterministic validation**:

- This phase is a research phase. Validation is "the answer is
  recorded in this plan and Phase 2's `src/server.ts` skeleton can
  be derived from it without further inference".

**Reviewers** (per cadence):

- Anchor 1 (during): none — this is a research probe, not a design.
- Anchor 2 (after): `sentry-reviewer` (sanity-check that the
  documented contract supports the existing Sentry init path
  through `createHttpObservability`).
- Anchor 3 (close): captured in the §Reviewer Scheduling table.

---

### Phase 2 — Deploy Boundary Hardening + Build Self-Assertion + Doc Update

**Depends on**: Phase 1 outcome (the documented Vercel adapter
contract).

**Scope**:

- Add `apps/oak-curriculum-mcp-streamable-http/src/server.ts` whose
  default export matches **whatever shape Phase 1 proves Vercel
  requires** (do not pre-assume "configured Express app" or any
  specific wrapper; Phase 1's primary evidence is the contract).
  If Phase 1's verified contract requires the default export to
  resolve synchronously at module-load time, then the
  `loadRuntimeConfig` and `createHttpObservability` Result-bearing
  primitives must either:
  - run synchronously and throw at the boundary (current
    `loadRuntimeConfig` is already synchronous; current
    `createHttpObservability` is synchronous returning Result), or
  - the workspace-local composition helper introduced here adapts
    them to synchronous-throw semantics (per Open Concern #3 + Q2
    answer in Barney's report).
- Add a workspace-local `composeServer` (or equivalent name) helper
  that performs Result→throw translation **once** so `server.ts`
  stays minimal. This helper is the single seam for deploy-boundary
  Result unwrapping (per Barney Q2). It is NOT moved into
  `@oaknational/result` — the precedent is
  `createHttpObservabilityOrThrow` already living in this workspace
  (`apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts:203-245`).
- Update `apps/oak-curriculum-mcp-streamable-http/build-scripts/esbuild-config.ts`
  to add the `server` entry alongside existing `index` and
  `application` entries (three entries — `application` is retained
  per Barney Q5).
- Update `apps/oak-curriculum-mcp-streamable-http/build-scripts/esbuild-config.unit.test.ts`
  to assert all three entries.
- In `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`
  composition root: spread `metafile: true` (per Open Concern #2 —
  not in the factory), warnings-as-errors gate (`if
  (result.warnings.length > 0) throw`), default-export contract
  assertion that derives the target output key from
  `entryPoints['src/server.ts']` lookup in the metafile (per Open
  Concern #1 — not a hard-coded literal).
- Add a unit test next to the assertion helper proving (a) it fires
  on a metafile lacking `'default'` in `outputs[X].exports`, (b)
  derivation works under `outdir`/`outbase` variation (per Open
  Concern #7 — committed proof, not ephemeral build logs).
- Update `apps/oak-curriculum-mcp-streamable-http/package.json`:
  `"main": "dist/server.js"`. **No** `types` field added. **No**
  `exports` map added. Per Open Concern #11.
- **Doc updates as Phase-2 acceptance criteria** (per Finding A5,
  elevated from Phase 3 cleanup):
  - `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md`
    — eliminate every claim that `dist/index.js` is the Vercel
    deploy artefact (lines `10-17`, `23-33`, `55-67`, `440-450`,
    `486-494`); replace with the Phase 1 verified contract +
    `src/server.ts` description.
  - `apps/oak-curriculum-mcp-streamable-http/README.md` — eliminate
    every claim that the repo "does not rely on a separate
    Vercel-only default export path" (lines `143-145`, `200-201`,
    `310-312`, `346-348`); replace with the new shape.
  - Both doc updates land in the same commit as the code change.

**Acceptance criteria**:

- Build emits `dist/server.js` whose default export matches Phase
  1's verified contract (whatever that contract turns out to be —
  do not assume).
- `package.json` `main` points at `dist/server.js`.
- Build fails (non-zero exit) if any of: (a) any esbuild warning is
  produced; (b) `dist/server.js` lacks a `default` export per the
  metafile; (c) the metafile-target derivation helper cannot
  resolve `src/server.ts`'s output key. (The metafile-default-export
  assertion is a structural minimum; Phase 1 may surface additional
  shape requirements that Phase 2 must also assert.)
- All three entries (`server`, `index`, `application`) emit
  successfully — `index` and `application` retained unchanged per
  Barney Q5.
- `docs/deployment-architecture.md` and `README.md` carry no claims
  contradicting the new architecture (resolves Finding A5,
  documentation-hygiene principle compliance).
- `pnpm test` and `pnpm check` pass clean in the workspace.

**Deterministic validation**:

- Three-arm workspace build (`disabled`, `skipped`, `configured`
  Sentry plugin states) all exit 0 and all pass the contract
  assertion.
- New unit test for the assertion helper passes (committed proof).
- `rg -F "dist/index.js" apps/oak-curriculum-mcp-streamable-http/{docs,README.md}`
  returns zero matches in the production-architecture context
  (changelog-style historical mentions OK if clearly marked
  historical).
- Full workspace gates (`pnpm check`) exit 0.

**Reviewers** (per cadence):

- Anchor 1 (during): `assumptions-reviewer` if any non-trivial
  design choice emerges from Phase 1's answer that wasn't already
  resolved here.
- Anchor 2 (after): `code-reviewer` + `architecture-reviewer-fred`
  (boundary discipline) + `architecture-reviewer-wilma` (failure
  modes — does the new boundary handle `loadRuntimeConfig`
  failure cleanly on Vercel cold-start?).
- Anchor 3 (close): captured in §Reviewer Scheduling.

---

### Phase 3 — Local Continuity + Tooling Migration

**Scope**:

- `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts`
  — decision required: does local dev continue to invoke
  `src/index.ts` (preserving the local runner stack as Barney
  recommends Q1), or does it switch to `src/server.ts` (which then
  needs a local listener wrapper)? **Recommended**: keep local dev
  on `src/index.ts` to minimise Phase 3 blast radius; deploy
  boundary on `src/server.ts` only. This is the asymmetric design
  Barney explicitly endorsed.
- `apps/oak-curriculum-mcp-streamable-http/scripts/start-server.sh`
  — entry path stays `dist/index.js` (per the recommendation
  above), `--import @sentry/node/preload` retained verbatim.
- `apps/oak-curriculum-mcp-streamable-http/scripts/server-harness.js`
  — repair the `createApp(...)` call signature drift (per Finding
  A8). The harness currently passes only `runtimeConfig`; it must
  pass `runtimeConfig`, `observability`, and `getWidgetHtml` per
  the actual `CreateAppOptions` contract
  (`apps/oak-curriculum-mcp-streamable-http/src/application.ts:33-85`).
- All e2e and smoke tests remain green.

**Acceptance criteria**:

- `pnpm dev` / `pnpm start` work locally with no behavioural
  regression.
- Local dev still gets ESM auto-instrumentation via the vendor
  preload.
- `scripts/server-harness.js` invokes `createApp` with the full
  `CreateAppOptions` contract.
- `e2e-tests/built-artifact-import.e2e.test.ts` remains green
  (proves `application` entry still has working consumers — Barney
  Q5).
- No deletion of `src/index.ts`, `src/bootstrap-app.ts`,
  `src/server-runtime.ts`, the `http.createServer(app)` wrapper,
  or any associated unit test (per Barney verdict + Finding A7
  scope discipline).

**Deterministic validation**:

- All workspace gates pass.
- Smoke server starts and responds to `/healthz`.

**Reviewers** (per cadence):

- Anchor 2 (after): `code-reviewer`.

---

### Phase 4 — Sentry Uptime Monitoring lane unblock (decision record only)

**Scope**: this branch records the **tool-selection decision** and
unblocks the dependent plan; it does **not** build out the monitor
itself.

- In `.agent/plans/observability/active/synthetic-monitoring.plan.md`
  (generic name predates the Sentry taxonomy): record the tool-
  selection decision with rejected alternatives — Sentry Uptime
  Monitoring for the uptime layer; Sentry Cron Monitors as the
  candidate for the working-probe layer; explicit rejection notes
  for any alternatives considered.
- Remove that plan's `blocked_on` entry pointing at this plan; it
  is now unblocked.
- Cross-link: this plan's §Reduced-Scope Rewrite Phase 1 + Phase 2
  outcomes are referenced as the verified `/healthz` artefact the
  monitor will eventually target.
- Monitor implementation itself (registration call, alert wiring,
  on-call routing) lives in `synthetic-monitoring.plan.md` — NOT
  in this branch.

This was original Phase 5; the original wording correctly said
"Build-out remains in that plan", which the first rewrite garbled.
Restored here per Barney sign-off Amendment #3.

**Acceptance criteria**:

- `synthetic-monitoring.plan.md` carries a tool-selection decision
  block referencing this plan.
- `synthetic-monitoring.plan.md` no longer lists this plan in
  `blocked_on`.
- This branch has NOT registered any Sentry Uptime monitor
  (intentional non-goal).

**Reviewers**: `sentry-reviewer` (sanity-check of the tool-selection
decision wording, not of monitor implementation).

---

### Phase 5 — Vercel preview probe (re-do WI-6 + WI-7)

**Scope**: deploy a Vercel preview from the head of
`feat/otel_sentry_enhancements` after Phase 2 lands; confirm WI-7
is fixed (lambda boots, `/healthz` responds, no "no default export"
boot crash); confirm WI-6 (Sentry release attribution end-to-end)
remains correct against the new artefact. Was original Phase 6;
survives intact.

**Acceptance criteria**: documented preview URL + screenshot of
Sentry release attribution + screenshot of `/healthz` 200 response
in this plan.

**Reviewers**: `sentry-reviewer`.

---

### Phase 6 — ADR-163 §6/§7 amendment for the reduced shape

**Scope**: amend ADR-163 §6 (deploy artefact contract) and §7
(local-vs-Vercel asymmetry) to record:

- The verified Vercel adapter contract from Phase 1.
- The `src/server.ts` default-export shape from Phase 2.
- The asymmetric design: Vercel imports `dist/server.js`
  (composition helper produces synchronous Express); local Node
  invokes `dist/index.js` via `start-server.sh` with vendor
  preload (full local lifecycle ownership retained).
- The explicit non-goal: this branch does NOT canonicalise the
  local runner stack. The Fred+Betty canonical-Vercel-Express
  thesis is recorded in §Deferred Lanes as ADR-163 §8 (future
  amendment lane).

Was original Phase 7; scope-narrowed.

**Acceptance criteria**: ADR-163 amendment commit references this
plan's §Reduced-Scope Rewrite as the source of truth for the
deploy-boundary contract.

**Reviewers**: `architecture-reviewer-fred` (ADR compliance) +
`architecture-reviewer-betty` (long-term cohesion — confirm the
asymmetric design is acceptable as a stable end-state, not a
stepping stone that creates future pressure).

---

### Phase 7 — Branch close + thread/napkin/repo-continuity update

**Scope**:

- Update
  `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
  with the resolved deploy-boundary contract + the populated
  §Deferred Lanes follow-up issues.
- Append a napkin entry summarising: the rewrite (original 9
  phases → 7 reduced-scope phases), the three reviewer rounds
  (assumptions-reviewer No-Go → Barney ABANDON-REFACTOR →
  assumptions-reviewer AMEND of Barney → final Barney sign-off),
  and the meta-lesson the assumption-reviewer flagged (*"Barney
  was asked only after the original plan had already been written,
  demoted, and partially landed at Phase 0; that sequencing is
  itself a planning smell"*).
- Update `.agent/memory/operational/repo-continuity.md` with the
  branch closure entry.
- File the §Deferred Lanes items as named follow-up plan stubs
  under `.agent/plans/observability/future/` so they are
  discoverable from the plan index.

Was original Phase 9; survives mostly intact, with explicit owner
of the §Deferred Lanes follow-up filing.

**Acceptance criteria**: branch ready for PR; thread/napkin/repo-
continuity updated; §Deferred Lanes have named follow-up plan
stubs in `future/`.

**Reviewers**: `release-readiness-reviewer` (final sign-off).

---

## Deferred Lanes (genuine improvements not landed in this branch)

> Per owner directive 2026-04-23: *"when we reduce the scope for
> the next session we need to make sure that any genuine
> improvements surfaced here that are not implemented are
> documented for future investigation"*. This section enumerates
> every genuine improvement surfaced during the three reviewer
> rounds that is being deferred, with named follow-up ownership.
> Phase 7 of §Reduced-Scope Rewrite includes filing each of these
> as a plan stub under `.agent/plans/observability/future/`.

### DL-1 — Canonical Vercel Express layout (Fred + Betty thesis)

**Source**: original Phases 2 + 3 + 4 of this plan, authored from
the `architecture-reviewer-fred` + `architecture-reviewer-betty`
2026-04-23 convergence. Owner ratified Barney's reframing for
*this branch*; the canonical-layout thesis is preserved as
follow-up.

**Improvement**: refactor the workspace to a canonical Vercel
Express layout (`server.ts` for Vercel + `main.ts` for local
listener + clear separation), retire `bootstrap-app.ts` /
`server-runtime.ts` as accidental complexity, align with broader
Oak monorepo Express conventions.

**Why deferred**: Barney's net-delta sanity check (§Architecture-
reviewer-barney report → §Net-delta sanity check) demonstrated
that doing this in the same branch as WI-7 repair turns a Vercel
contract fix into a local-lifecycle rewrite, expanding blast
radius without earning the disruption on line-count grounds.
Owner accepted the reframing.

**Follow-up plan stub**: `.agent/plans/observability/future/mcp-canonical-vercel-express-layout.plan.md`
(to be created in Phase 7). Should reference this plan's §Open
Concerns + Barney's report as the constraint set.

**Re-evaluation trigger**: when Sentry Uptime Monitoring is stable
on the reduced-scope shape AND there is owner appetite for a
larger-scope refactor of the workspace runtime.

### DL-2 — Single canonical Sentry init seam

**Source**: original Phase 2 Task 2.3 (`src/sentry-init.ts`);
preserved as Open Concern #4 + Finding A6.

**Improvement**: migrate Sentry init out of `createHttpObservability`'s
side effect into a single owned canonical seam. The current path
(init-via-import-of-observability) works but is non-canonical for
the Sentry SDK's recommended ESM init pattern, and conflates
"observability is configured" with "Sentry is initialised".

**Why deferred**: Barney verdict + assumption-reviewer Finding A6.
Adding an Oak-owned `sentry-init.ts` while `--import
@sentry/node/preload` remains the local-Node mechanism creates two
ownership points for Sentry semantics; cleanly resolving that
requires either replacing the vendor preload (large scope, vendor
behaviour to absorb) or a hybrid that's worse than the current
side-effect path.

**Follow-up plan stub**: `.agent/plans/observability/future/canonical-sentry-init-seam.plan.md`
(to be created in Phase 7).

**Re-evaluation trigger**: when `@sentry/node` SDK guidance changes
(e.g., a vendor-supported pure-code alternative to preload), or
when DL-1 lands and presents a natural composition seam.

### DL-3 — `bootstrap-app.ts` collapse evaluation

**Source**: assumption-reviewer Finding A3.

**Improvement**: evaluate whether `apps/oak-curriculum-mcp-
streamable-http/src/bootstrap-app.ts` is genuinely load-bearing or
whether its four behaviours (log on failure, optional
`onStartupFailure`, `exit(1)`, rethrow) collapse cleanly into the
workspace-local composition helper introduced in Phase 2 of this
branch.

**Why deferred**: Barney's verdict was "keep the local runner
stack" but Finding A3 demonstrated his evidence supported keeping
`server-runtime.ts` specifically, not `bootstrap-app.ts`
specifically. Resolving this requires a focused boundary review
that is out of scope for the deploy-boundary repair.

**Follow-up plan stub**: `.agent/plans/observability/future/bootstrap-app-collapse-evaluation.plan.md`
(to be created in Phase 7).

**Re-evaluation trigger**: natural pairing with DL-1 (canonical
layout would absorb this question).

### DL-4 — `app.listen()` vs `http.createServer(app)` reconciliation

**Source**: Open Concern #6, Finding A7.

**Improvement**: resolve the contradictory evidence in this
workspace — `src/index.ts:44-53` justifies `http.createServer(app)`
on Express 5 grounds; `smoke-tests/local-server.ts:57-78` uses the
un-wrapped `app.listen().on('error')` pattern successfully. One of
the two is wrong (or one is unnecessary). A focused 30-line probe
against Express 5.2.x can settle this empirically.

**Why deferred**: Barney verdict — too small a question to
piggy-back on WI-7; large enough to deserve its own probe. Local
runner behaviour is preserved as-is in this branch.

**Follow-up plan stub**: `.agent/plans/observability/future/express5-listen-vs-createserver-probe.plan.md`
(to be created in Phase 7).

**Re-evaluation trigger**: any time, low-risk standalone probe.

### DL-5 — `application` esbuild entry retirement

**Source**: original Phase 2 Task 2.5 (entry retirement); Open
Concern #8, Finding A8.

**Improvement**: enumerate every consumer of `dist/application.js`
(the unit test asserting both entries; the e2e test importing
`dist/application.js`; `scripts/server-harness.js`); migrate or
delete each consumer; retire the `application` esbuild entry to
collapse to a single deployment artefact.

**Why deferred**: Barney verdict + Finding A8. One consumer
(`scripts/server-harness.js`) is already drifted against the
current `CreateAppOptions` contract; that drift needs repair before
retirement; retirement during the deploy-boundary repair would
expand blast radius without proportional benefit.

**Follow-up plan stub**: `.agent/plans/observability/future/application-entry-retirement.plan.md`
(to be created in Phase 7). Phase 3 of *this* branch ships the
harness drift repair, so the retirement lane starts from a clean
consumer inventory.

**Re-evaluation trigger**: natural pairing with DL-1 (canonical
layout would either keep or retire `application` based on the
chosen runtime composition).

### DL-6 — Single composition seam vs `bootstrap-app.ts` + `server-runtime.ts` + composition helper

**Source**: derived from DL-1 + DL-3 + Phase 2 of this branch.

**Improvement**: this branch will have *three* composition seams
co-existing — the workspace-local `composeServer` helper introduced
in Phase 2 (for the Vercel boundary), the existing `bootstrap-app.ts`
(for local startup-failure handling), and the existing
`server-runtime.ts` (for local listener + shutdown coordination).
That's two more than canonical. A future lane should consolidate.

**Why deferred**: explicit consequence of Barney's "keep local
runner stack as-is" recommendation. Documented here so the
inevitable consolidation pressure is named, not surprising.

**Follow-up plan stub**: covered by DL-1 (canonical layout); no
separate stub needed.

### DL-7 — Process meta-lesson: assumption-challenge sequencing

**Source**: assumption-reviewer's opening observation
(2026-04-23): *"this is a useful but slightly late audit. Barney
was asked only after the original plan had already been written,
demoted, and partially landed at Phase 0; that sequencing is itself
a planning smell, because assumption-challenge is cheapest before a
reviewer section is promoted to 'binding contract'"*.

**Improvement**: amend `.agent/rules/invoke-code-reviewers.md` (or
the reviewer-cadence subsection of `principles.md`) to make
assumption-challenge a per-reviewer-output gate, not a per-plan
gate. Concretely: when any specialist reviewer's output is folded
into a plan as "binding", `assumptions-reviewer` runs against it
**before** the binding is recorded.

**Why deferred**: doctrine change, not a code change; deserves its
own consideration in a separate pass.

**Follow-up**: napkin entry to be added in Phase 7 with this
doctrine-amendment proposal; no separate plan stub (doctrine
changes go through napkin → directive review).

**Re-evaluation trigger**: next time a specialist reviewer's output
is being promoted to "binding". This very plan is the case study.

---

## Context

This plan executes the architectural-reviewer convergence captured
in `.agent/memory/active/napkin.md` §"2026-04-23 — warnings-are-not-
deferrable codified + first hard instance". `architecture-reviewer-
fred` (boundary discipline) and `architecture-reviewer-betty` (long-
term cohesion) ran in parallel and converged on every material
point. The owner's directive at the close of that diagnosis cycle:

> *"DO NOT IGNORE WARNINGS this is now repo doctrine"* +
> *"we ALWAYS optimise for long-term architectural excellence over
> short-term expediency"* +
> *"unless we are talking about something highly original and
> innovative within our own domains we take the canonical and
> idiomatic approach, always"*.

### Issue 1: Vercel Express adapter contract violation (load-bearing)

`apps/oak-curriculum-mcp-streamable-http/src/index.ts` does not
honour Vercel's documented Express adapter contract. Vercel
imports the package's `main` entry (`dist/index.js`) and expects
either `export default app` (the canonical pattern) or
`app.listen(port)` invoked directly. The current entry-point
calls `await startConfiguredHttpServer(...)` at module top-level,
which wraps `http.createServer(app).listen(port)` and exits the
module without any default export. Vercel's runtime adapter
rejects this with:

> *"Invalid export found in module '/var/task/apps/oak-curriculum-
> mcp-streamable-http/dist/index.js'. The default export must be a
> function or server. Node.js process exited with exit status: 1."*

**Evidence**:

- Deployment `dpl_71SfAcKiezKiXzmKMtpaUgVFxhWA` (commit
  `216a7fd2`) — every request returns 500
  `FUNCTION_INVOCATION_FAILED`.
- Previous deployment `c20477e8` (Sentry plugin in `skipped`
  arm) returned 200 from the same `dist/index.js` source — the
  `enabled`-arm bundle structure changed by the plugin made the
  contract violation surface; the violation pre-existed in the
  source.
- Two esbuild build-time warnings (`Import "default" will always
  be undefined because there is no matching export in
  "src/application.ts" / "src/index.ts" [import-is-undefined]`)
  named the exact contract violation. Acknowledged in WI-6
  evidence record as *"flagged for verification in WI-7"*; the
  next deploy crashed.

**Root cause**: structural — two separate violations compounded:

1. **Entry-point contract**: `src/index.ts` is both the runner
   and the application — mixing two concerns that Vercel's
   adapter contract requires kept separate. `src/application.ts`
   exports `createApp` (factory) but does not provide the
   default-exported configured app the Vercel adapter looks for.
2. **Runtime wrapper layer**: `src/server-runtime.ts` (160 LoC)
   together with `src/bootstrap-app.ts` (54 LoC) implement
   custom signal handling, structured shutdown, EADDRINUSE
   workaround, and `process.exit(1)` wrappers that are
   redundant on Vercel serverless (the platform owns lifecycle)
   and home-spun relative to Express 5's canonical patterns for
   local Node.

**Reviewer convergence** (verbatim from napkin):

- Two-entry-point split is **accidental cohabitation, not
  principled cohesion**.
- `bootstrap-app.ts` deletes entirely; top-level await throws
  produce a more informative crash than the wrapper's structured
  log + `process.exit(1)`.
- `server-runtime.ts` collapses to ~20 LoC of local-dev-only
  listener glue (`src/main.ts`); SIGTERM/SIGINT handlers race
  Sentry SDK's own shutdown flush rather than augmenting it.
- `http.createServer(app).listen(port)` for an Express 5
  EADDRINUSE quirk has a **canonical-pattern-compatible
  replacement already available**: `server.on('error', …)` on
  the value `app.listen(port)` returns.
- Canonical Vercel layout: `src/server.ts` exports
  `default = await createApp(…)` (Vercel-imported artefact),
  `src/main.ts` does the local-Node listener,
  `src/sentry-init.ts` is loaded via `--import` for ESM
  auto-instrumentation per Sentry's documented contract:
  <https://docs.sentry.io/platforms/javascript/guides/express/install/esm/>.

### Issue 2: Build-time warnings deferred to runtime stage

The two esbuild warnings named the contract violation at the
cheapest possible point (build completion) and were time-shifted
to a later work-item. The "verify in WI-N+1" framing is the
named pattern `acknowledged-warnings-deferred-to-the-stage-they-
explode-in` (napkin 2026-04-23, first hard instance).

**Root cause**: missing enforcement — `esbuild.config.ts` does
not assert `result.warnings.length === 0` after the build call
returns; the warnings stream to stdout and are read by humans
who can choose to defer them.

### Issue 3: CI quality-gate hole — built bundle never imported

CI runs `pnpm check` (lint + type-check + unit + integration
tests + build) but does not import the built bundle and assert
its shape. The warnings + the contract violation passed CI
because no in-process gate imports `dist/server.js` and asserts
`typeof exports.default === 'function'`.

**Constraint** (owner-stated): the gate must avoid network and
disk I/O beyond the build artefact itself — gates that read
disk + spawn processes are slow, coupled, flaky, and a security
surface. The minimal correct gate is an **in-process metafile
assertion within the build script itself** (zero additional disk
I/O — esbuild already produces the metafile in memory).

### Issue 4: ADR-163 §6/§7 amendment outstanding (L-8 WI-8)

The L-8 Correction lane left WI-8 (ADR amendment) pending,
originally scoped only to record the version-resolution boundary
discipline. Scope has now grown to include three lessons:

1. Version source-of-truth boundary discipline (original).
2. Vendor-config passthrough discipline (`turbo.json`
   `globalPassThroughEnv` for `SENTRY_*`).
3. Entry-point boundary discipline + non-deferrable-warnings
   doctrine.

All three are surfaces of the same boundary-respect principle
(build output → runtime contract); the amendment folds them
together rather than authoring three separate ADRs.

### Issue 5: Sentry Uptime Monitoring lane is blocked on tool-selection

> **Terminology note**: Sentry's product taxonomy does not have a
> "Synthetics" product. The functional equivalent is **Uptime
> Monitoring** (HTTP probes) plus **Cron Monitors** (scheduled-
> job heartbeats). The existing plan file is named
> `synthetic-monitoring.plan.md` because the term predates the
> owner's correction on 2026-04-23 *"synthetics is the wrong
> term in the Sentry world, we want uptime monitoring"*. The
> file name is preserved in this commit to keep cross-references
> intact; renaming it is a separate housekeeping pass that this
> plan does not own.

A separate plan already exists for this lane:
[`synthetic-monitoring.plan.md`](./synthetic-monitoring.plan.md)
in `observability/current/` — owned by the same observability
thread, blocked on a tool-selection decision (*"Sentry cron-
monitor vs third-party uptime probe vs custom Vercel cron"*)
since 2026-04-18. That plan additionally scopes a **working
probe** (executes one MCP tool call end-to-end), not just an
uptime probe, per
[ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md)
§5.6.

The WI-7 lambda crash is the falsifying evidence the
uptime-monitoring lane was waiting for: the MCP server returned
100% 500s on preview but Sentry showed no reported issues
because the lambda crashed before SDK init could complete. An
uptime probe — basic *or* working — would have alerted within
one minute of deploy.

**Sentry product surface** (researched 2026-04-23 in response
to owner question *"does sentry support synthetics?"*; canonical
docs at
<https://docs.sentry.io/product/monitors-and-alerts/monitors/uptime-monitoring/>):

- **Sentry Uptime Monitoring** — HTTP probes at configurable
  intervals (1 min / 5 min / 10 min / 20 min / 30 min / 1 hour)
  from multiple geographic locations in round-robin. Default
  pass: HTTP 2xx after up-to-30s timeout. Automatically follows
  3xx redirects to verify the final destination. DNS resolution
  failures count as failures. **Verification** — additional
  assertions on status codes, header keys/values, and JSON
  response bodies — is **Early Adopter** at the time of writing
  (2026-04-23): we can opt the org into Early Adopter to use it,
  or land the basic 2xx-status probe first and upgrade once the
  feature ships GA. Failure tolerance defaults to 3 consecutive
  failures (configurable); recovery tolerance defaults to 1.
  Emits `uptime.request` root spans for distributed-trace
  correlation; uptime spans do not count against the standard
  span quota (free quota). Alert routing is the standard Sentry
  alert pipeline (Slack / email / PagerDuty / on-call).
- **Sentry Cron Monitors** — scheduled-job heartbeats; the
  natural home for the *working-probe* layer (a job that runs
  on cadence and reports `in_progress` / `ok` / `error` to
  Sentry) per `synthetic-monitoring.plan.md` WS2. Selection
  is candidate; final pick belongs to that plan's WS2.

Phase 5 of this plan **unblocks** the uptime-monitoring lane by
recording the tool-selection decision (Sentry Uptime Monitoring
for the uptime layer; Sentry Cron Monitors as the candidate for
the working-probe layer pending its own evaluation) and hands
the build-out work back to that plan rather than duplicating
its scope.

---

## Quality Gate Strategy

**Critical**: Every phase ends with `pnpm check` exit 0 across
the full monorepo. No `--filter` shortcuts — the warnings
doctrine + the canonical layout change touch the build pipeline
that every workspace depends on.

### After each task

```bash
pnpm type-check
pnpm lint
pnpm test
```

### After each phase

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e   # if applicable to the phase
```

### After Phase 2 specifically (deploy boundary + build self-assertion)

> Phase number updated 2026-04-23 (Barney sign-off): in the
> §Reduced-Scope Rewrite numbering this is **Phase 2**, not the
> legacy Phase 1. Phase 1 in the new numbering is the Vercel
> adapter contract probe, which has no triple-arm build
> implications.

```bash
# Triple-arm probe of the esbuild plugin:
# 1. Disabled (no SENTRY_AUTH_TOKEN, no SENTRY_DSN, no INTENT)
SENTRY_AUTH_TOKEN= SENTRY_DSN= pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build
# Expected: log line "[esbuild.config] Sentry plugin disabled: ..."
#           exit 0; metafile assertion confirms default export

# 2. Skipped arm (preview, no token)
SENTRY_RELEASE_INTENT=skipped pnpm --filter ... build
# Expected: "Sentry plugin skipped: ..."; exit 0; metafile assertion holds

# 3. Configured arm (with fake token)
SENTRY_AUTH_TOKEN=test SENTRY_DSN=https://test@sentry.io/0 pnpm --filter ... build
# Expected: "Sentry plugin enabled: ..."; exit 0; metafile assertion holds
```

All three arms MUST satisfy the metafile assertion — the
contract is structural, not plugin-state-dependent.

---

## Solution Architecture (LEGACY — SUPERSEDED by §Reduced-Scope Rewrite)

> **SUPERSEDED 2026-04-23**: this section describes the original
> 9-phase canonical-Vercel-Express thesis (`server.ts` / `main.ts` /
> `sentry-init.ts` split, full local-runner deletion, ~272 LoC net
> negative). That thesis was rejected for *this branch* by
> architecture-reviewer-barney's verdict (ABANDON-REFACTOR) and
> deferred to §Deferred Lanes DL-1. The binding solution
> architecture for this branch is the asymmetric design recorded in
> §Reduced-Scope Rewrite (Vercel imports `dist/server.js` produced
> by a workspace-local composition helper; local Node retains
> `dist/index.js` + `start-server.sh` + vendor preload). Retained
> only for diff-against-rewrite legibility.

### Principle (from `principles.md`)

> *"NEVER create compatibility layers, no backwards
> compatibility — replace old approaches with new approaches"*
> *"Architectural Excellence Over Expediency"*
> *"unless we are talking about something highly original and
> innovative within our own domains we take the canonical and
> idiomatic approach, always"* (owner directive 2026-04-23)

### Key insight

The lambda crash and the build warnings are the same diagnostic
expressed at two different stages. The fix is structural at one
boundary (the entry-point), and the gate that prevents
recurrence is enforcement at the other (the build script
self-assertion + warnings-as-errors). Neither side requires
new product code — only deletion of home-spun layers and
addition of one assertion.

This exemplifies the first question: **"Could it be simpler
without compromising quality?"** — Answer: yes, dramatically.
Net delta is **≈−272 LoC removed** (`src/index.ts` runner
shape + `src/server-runtime.ts` + `src/bootstrap-app.ts` +
their tests) **+ ~60 LoC added** (`src/server.ts` +
`src/main.ts` + `src/sentry-init.ts` + the metafile assertion).
Plus one deferred warning class eliminated permanently.

### Strategy

1. **Land doctrine first** (Phase 0, this commit) — warnings
   rule + principles bullet + cursor pointer. Every subsequent
   commit in this plan is bound by the doctrine it lands.
2. **Make the build refuse to ship the broken shape** (Phase 1)
   — esbuild metafile assertion + warnings-as-errors. This
   gate would have caught the WI-7 contract violation on the
   commit that introduced it.
3. **Land the canonical layout** (Phase 2 + 3 + 4) — the
   refactor itself, with type-level enforcement and smoke
   harness repointed.
4. **Add the missing monitoring layer** (Phase 5) — Sentry
   Uptime monitor on `/healthz` so the next regression of this
   class is detected from outside the deploy, not from owner
   reports.
5. **Probe + verify on Vercel** (Phase 6) — re-do WI-6 + WI-7
   with the canonical layout in place; observe build logs
   show plugin enabled arm, runtime logs show default export
   honoured, Sentry UI shows release/commits/deploy.
6. **Close the L-8 Correction lane** (Phase 7) — ADR-163
   §6/§7 amendment.
7. **Phase-aligned review** (Phase 8) — every reviewer fires
   at the phase its expertise applies.
8. **Consolidate** (Phase 9) — graduate the pattern, archive
   the plan.

**Non-Goals** (YAGNI):

- ❌ Migrating other workspaces to the canonical layout in this
  branch (e.g. `oak-search-cli` — that's the L-8 Correction
  deferred follow-on, separate lane).
- ❌ Authoring a new ADR for the warnings doctrine — it folds
  into ADR-163 §6/§7 amendment + the rule file.
- ❌ Adding a Vitest test that reads `dist/server.js` from disk
  — owner constraint: avoid disk I/O in CI tests; the in-bundle
  metafile assertion is the correct boundary.
- ❌ Building any probe code, cron wiring, alert configuration,
  or runbook section for synthetic monitoring in this plan —
  that scope is owned by `synthetic-monitoring.plan.md`. This
  plan contributes only the tool-selection decision input.
- ❌ Adding signal handlers in `src/main.ts` to "match" the
  deleted `server-runtime.ts` behaviour — Sentry SDK manages
  its own shutdown flush; competing handlers race it.
- ✅ Deleting more than we add. Net negative LoC is the goal.

---

## Build-vs-Buy Attestation

This plan's vendor decisions split across two boundaries:

### Build artefact gate (Phase 1)

**`@sentry/esbuild-plugin` metafile output** is a vendor-native
in-memory contract surface produced by every esbuild build. The
attestation:

| Surface | Vendor option | Bespoke alternative considered | Decision |
|---|---|---|---|
| Built bundle contract assertion | esbuild `metafile: true` + post-build assertion | Vitest test that imports `dist/server.js` from disk; tsx script in CI; bash + jq pipeline | **Adopt in-bundle metafile assertion** |

Rationale:

- **Zero additional disk I/O**: metafile is produced in memory
  by every build; reading it adds no syscalls.
- **Same-process gate**: the assertion fires as part of the
  build, so the build cannot ship a broken artefact.
- **Owner constraint honoured**: avoids network and disk I/O
  in test runners (`pnpm check` policy).

### Uptime + working-probe monitoring (Phase 5)

**Sentry Uptime Monitoring** (uptime layer) and **Sentry Cron
Monitors** (candidate working-probe layer) are the vendor
decisions recorded into `synthetic-monitoring.plan.md` to
unblock that plan; the build-out lives in that plan, not this
one. Attestation:

| Surface | Vendor option | Bespoke alternative considered | Decision |
|---|---|---|---|
| Uptime probe of `/healthz` | **Sentry Uptime Monitoring** (first-party; basic 2xx assertion GA, response-body Verification Early Adopter) | UptimeRobot; Pingdom; GitHub Actions cron; Vercel cron route | **Adopt Sentry Uptime Monitoring** (basic probe GA-only; opt into Early Adopter for Verification only if `/healthz` body assertions are needed) |
| Working probe (end-to-end MCP tool call) | Sentry Cron Monitors invoked from cron runner | Custom Vercel cron + alert webhook | **Sentry Cron Monitors candidate** (final selection deferred to `synthetic-monitoring.plan.md` WS2) |

Rationale:

- **Native integration**: `uptime.request` spans root distributed
  traces — a probe failure is one click from the runtime trace
  it caused. No separate dashboard, no separate alert pipeline,
  no separate auth surface.
- **Free quota**: uptime request spans do not count against the
  standard span quota; zero marginal cost.
- **Zero new infrastructure**: no third-party service, no new
  secrets to rotate, no new on-call surface.
- **Canonical and idiomatic**: matches the owner directive on
  vendor first-party plugins (same discipline that drove L-8's
  `@sentry/esbuild-plugin` adoption).

`assumptions-reviewer` runs against this attestation pre-Phase 5.

Rejected alternatives:

- **GitHub Actions cron**: no geographic distribution; custom
  alert plumbing; no trace correlation.
- **UptimeRobot / Pingdom**: third-party vendor surface; no
  Sentry trace correlation; new secrets.
- **Bespoke Vercel cron route**: would probe itself if hosted
  in the same lambda; non-trivial to make external.

---

## Reviewer Scheduling (phase-aligned, three anchors) (LEGACY — SUPERSEDED)

> **SUPERSEDED 2026-04-23**: the cadence table below is keyed to
> the legacy 9-phase shape (Phase 1 build self-assertion / Phase 2
> canonical refactor / Phase 3 type assertion / Phase 4 smoke
> harness / Phase 5 monitoring lane / Phase 6 Vercel probe / Phase
> 7 ADR / Phase 8 close / Phase 9 consolidation). The binding
> reviewer cadence for the next session is per-phase as recorded
> inline in each `### Phase N — ...` heading of §Reduced-Scope
> Rewrite (Phase 1 = sentry-reviewer Anchor 2; Phase 2 = code-
> reviewer + architecture-reviewer-fred + architecture-reviewer-
> wilma Anchor 2; Phase 3 = code-reviewer Anchor 2; Phase 4 =
> sentry-reviewer Anchor 2; Phase 5 = sentry-reviewer Anchor 2;
> Phase 6 = architecture-reviewer-fred + architecture-reviewer-
> betty Anchor 2; Phase 7 = release-readiness-reviewer Anchor 3).
> The three-anchor framework (during planning / after each
> significant change / before session close) still applies. Retained
> below for diff-against-rewrite legibility.

Per `.agent/rules/invoke-code-reviewers.md` and the inverted
doctrine hierarchy (project principles first, vendor specialists
when their domain is touched). Owner directive 2026-04-23:
specialist reviewers fire at **three anchors per phase** — during
planning (assumptions challenge before code), after each
significant change (specialist verifies the artefact), and
before session close (release-readiness when something landed,
assumptions if planning advanced without code).

| Phase | Anchor 1 — During planning | Anchor 2 — After each significant change | Anchor 3 — Before session close on this phase |
|---|---|---|---|
| **Phase 0** (doctrine, complete) | `assumptions-reviewer` (already run pre-doctrine via reviewer convergence) | `architecture-reviewer-fred` + `architecture-reviewer-betty` (already run; convergence in napkin) | `release-readiness-reviewer` deferred — this commit's outcome is plan + doctrine, no product code |
| **Phase 1** (build self-assertion) | `assumptions-reviewer` (challenge: is metafile assertion the right gate boundary? does the falsifiability probe hold?) | `code-reviewer` + `sentry-reviewer` (plugin behaviour + metafile contract) | `release-readiness-reviewer` |
| **Phase 2** (canonical refactor) | `assumptions-reviewer` (challenge: is server.ts/main.ts/sentry-init.ts split the canonical Vercel pattern? are we deleting the right things?) | `code-reviewer` + `architecture-reviewer-fred` (boundary discipline post-cut) + `architecture-reviewer-wilma` (resilience: signal handler deletion impact) | `release-readiness-reviewer` |
| **Phase 3** (type assertion) | `assumptions-reviewer` (challenge: does `satisfies` clause correctly encode the Vercel adapter contract?) | `type-reviewer` (compile-time enforcement precision) | `release-readiness-reviewer` |
| **Phase 4** (smoke harness repoint) | `assumptions-reviewer` (challenge: does the harness add value over the metafile assertion?) | `code-reviewer` (harness logic) | `release-readiness-reviewer` |
| **Phase 5** (Sentry Uptime Monitoring lane unblock) | `assumptions-reviewer` (challenge: is unblocking in this branch right scope, or separate PR?) | `sentry-reviewer` (Uptime Monitoring tool selection vs Cron Monitors candidate; Verification Early-Adopter implications) | `release-readiness-reviewer` |
| **Phase 6** (Vercel probe) | `assumptions-reviewer` (challenge: does the planned probe sequence avoid speculative diagnosis when artefact is paginated?) | `code-reviewer` + `sentry-reviewer` (verify build/runtime/UI alignment matches design intent) | `release-readiness-reviewer` |
| **Phase 7** (ADR-163 §6/§7 amendment) | `assumptions-reviewer` (challenge: does folding three lessons into one §6/§7 amendment compose coherently?) | `docs-adr-reviewer` + `architecture-reviewer-betty` (long-term cohesion: does the amendment compose with the rest of ADR-163?) | `release-readiness-reviewer` |
| **Phase 8** (close) | `assumptions-reviewer` (challenge: is the PR description complete + accurate?) | `code-reviewer` (final pass on the diff) | `release-readiness-reviewer` (final go/no-go) |
| **Phase 9** (consolidation) | `assumptions-reviewer` (challenge: does the pattern-graduation evidence meet the 3rd-instance bar?) | `docs-adr-reviewer` (any ADR text drift) | `release-readiness-reviewer` not applicable; consolidation is doc-only |

Schedules respect phase-alignment per the
`feature-workstream-template.md §Reviewer Scheduling` rationale —
no batching all reviewers at close. Every phase has all three
anchors named explicitly so a future agent does not skip one.

---

## Foundation Document Commitment

Re-read at the start of each phase:

1. `.agent/directives/principles.md` (especially §Code Quality
   bullet just landed: "No warning toleration, anywhere").
2. `.agent/directives/testing-strategy.md` (in-process gate
   constraints; no disk I/O in tests).
3. `.agent/directives/schema-first-execution.md` (ensure the
   server.ts default export composes from generated SDK
   surfaces unchanged).
4. **Re-read** `.agent/rules/no-warning-toleration.md` — this
   plan is the first plan bound by it.

**Ask each phase**: does this deliver system-level value, not
just close the immediate ticket? (Doctrine + build self-
assertion + Sentry Uptime monitor are all system-level; the
refactor is local but recurrence-preventing.)

**Verify**: no compatibility layers, no `as`/`any`/`unknown`
shortcuts, no disabled checks, no warnings tolerated.

---

## Documentation Propagation Commitment (LEGACY — SUPERSEDED)

> **SUPERSEDED 2026-04-23**: the propagation list below references
> the rejected `server.ts` / `main.ts` / `sentry-init.ts` canonical
> layout. The binding documentation work for this branch is:
>
> - `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md`
>   — eliminate every claim that `dist/index.js` is the Vercel
>   deploy artefact (Phase 2 acceptance criterion, per Finding A5).
> - `apps/oak-curriculum-mcp-streamable-http/README.md` — eliminate
>   every claim that the repo "does not rely on a separate
>   Vercel-only default export path" and document the asymmetric
>   design (Phase 2 acceptance criterion, per Finding A5).
> - ADR-163 §6/§7 amendment (Phase 6 deliverable, scope-narrowed).
> - `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
>   — Phase 7 deliverable.
> - `.agent/memory/active/napkin.md` — Phase 7 deliverable.
> - File §Deferred Lanes (DL-1..DL-7) follow-up plan stubs in
>   `.agent/plans/observability/future/` — Phase 7 deliverable.
>
> After Phase 7: `/jc-consolidate-docs` walk.
>
> Original list retained below for diff-against-rewrite legibility.

Before marking each phase complete:

1. ADR-163 §6/§7 amendment (Phase 7 deliverable).
2. `apps/oak-curriculum-mcp-streamable-http/README.md` — update
   to document the canonical `server.ts`/`main.ts`/`sentry-init.ts`
   layout, the build self-assertion gate, and the Sentry Uptime
   monitor URL.
3. `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
   — record completion of WI-7 + WI-8, retire the L-8 Correction
   subsection.
4. `.agent/memory/active/napkin.md` — update the 2026-04-23
   warnings entry with the closed-out evidence; record the
   recurrence-prevention loop closing.
5. Any other impacted ADRs (none expected; if any surface,
   record explicit no-change rationale per the documentation-
   hygiene rule).

After Phase 9: `/jc-consolidate-docs` walk.

---

## Resolution Plan (LEGACY — SUPERSEDED by §Reduced-Scope Rewrite)

> **SUPERSEDED 2026-04-23**: Phases 1–9 below are SUPERSEDED by
> §Reduced-Scope Rewrite (the binding contract for this branch).
> They are retained for diff-against-rewrite legibility AND because
> their original content is the source material for several
> §Deferred Lanes entries (DL-1 / DL-2 / DL-5). Phase 0 (immediately
> below) IS real and landed; Phases 1–9 are historical record only.
> When in doubt, follow §Reduced-Scope Rewrite.

### Phase 0: Doctrine landing (LANDED — commits c577cf16 + d8ae99e1)

**Foundation check-in**: principles.md §Code Quality already
governs disabled-checks discipline; this phase extends it to
warnings.

**Tasks completed in this commit**:

- ✅ `.agent/rules/no-warning-toleration.md` (rule body, full
  operational discipline).
- ✅ `.cursor/rules/no-warning-toleration.mdc` (Cursor pointer
  with `alwaysApply: true`).
- ✅ `.agent/directives/principles.md` — new bullet under §Code
  Quality referencing the rule.
- ✅ This plan file.

**Acceptance criteria**:

1. ✅ Rule file exists, references principles.md + ADR-163 + the
   napkin pattern entry.
2. ✅ Cursor pointer file exists with `alwaysApply: true`.
3. ✅ Principles bullet added (one bullet, references rule for
   elaboration — does not bloat principles.md given char-debt).
4. ✅ This plan file references all three artefacts and the
   parent plan.

**Deterministic validation**:

```bash
# Rule body present + non-trivial:
test "$(wc -l < .agent/rules/no-warning-toleration.md)" -gt 80
# Cursor pointer alwaysApply:
grep -q "alwaysApply: true" .cursor/rules/no-warning-toleration.mdc
# Principles bullet:
grep -q "No warning toleration, anywhere" .agent/directives/principles.md
# Plan file references doctrine artefacts:
grep -q "no-warning-toleration" \
  .agent/plans/observability/current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md
```

**Phase 0 complete when**: all four files committed. **STATUS:
COMPLETE** as of `c577cf16` (extended by `d8ae99e1`'s scope-
discipline clause).

---

> **DRAFT — Phases 1–9 below are under rewrite per §Open Concerns.
> Do NOT implement.**

### Phase 1: Build self-assertion (esbuild metafile + warnings-as-errors) [DRAFT]

**Foundation check-in**: Re-read the new `no-warning-toleration.md`.
This phase is the rule's first installation in product code.

**Key principle**: the build script enforces what humans cannot
be trusted to enforce after the fact — warnings and contract
violations must fail the gate that produced them.

#### Task 1.1: esbuild metafile assertion

**Current state**: `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`
calls `build(...)` and prints a status log line; warnings stream
to stdout but are not asserted on; the result.metafile is not
inspected.

**Target state**: after the `build()` call returns, two assertions
fire before the process exits:

```typescript
// Gate 1: zero warnings tolerated (per .agent/rules/no-warning-toleration.md).
if (result.warnings.length > 0) {
  for (const w of result.warnings) console.error(formatWarning(w));
  throw new Error(
    `[esbuild.config] ${result.warnings.length} warning(s) — repo doctrine: ` +
    `warnings are not deferrable. See .agent/rules/no-warning-toleration.md.`,
  );
}

// Gate 2: Vercel Express adapter contract on the deployed artefact.
const serverOutput = result.metafile?.outputs['dist/server.js'];
if (!serverOutput?.exports.includes('default')) {
  throw new Error(
    `[esbuild.config] dist/server.js missing 'default' export — ` +
    `violates Vercel Express adapter contract ` +
    `(https://vercel.com/docs/frameworks/backend/express). ` +
    `Exports found: ${JSON.stringify(serverOutput?.exports ?? [])}`,
  );
}
```

The `metafile: true` option must be set on the `build()` call.

**Acceptance criteria**:

1. ✅ `esbuild.config.ts` calls `build({ ..., metafile: true, ... })`.
2. ✅ Post-build assertion 1 (warnings count) emits each warning
   with full context, then throws.
3. ✅ Post-build assertion 2 (default export contract) reads
   `result.metafile.outputs['dist/server.js'].exports` and throws
   if `'default'` absent.
4. ✅ Triple-arm probe (disabled / skipped / configured) all pass
   the assertion (the gate is structural, plugin-state-
   independent).
5. ✅ The current `dist/index.js` shape would FAIL this gate —
   verified by deliberately running the gate against the pre-
   refactor source on a throwaway commit.

**Deterministic validation**:

```bash
cd apps/oak-curriculum-mcp-streamable-http
# Disabled arm:
SENTRY_AUTH_TOKEN= SENTRY_DSN= pnpm build
# Expected: exit 0; "Sentry plugin disabled" log; metafile assertion silent (passed)
# Skipped arm:
SENTRY_RELEASE_INTENT=skipped pnpm build
# Expected: exit 0; "Sentry plugin skipped" log; assertion passes
# Configured arm (fake token):
SENTRY_AUTH_TOKEN=test SENTRY_DSN=https://test@sentry.io/0 pnpm build
# Expected: exit 0; "Sentry plugin enabled" log; assertion passes
# Falsifiability probe:
git stash  # stash the new server.ts
pnpm build
# Expected: exit 1 with "[esbuild.config] dist/server.js missing 'default' export"
git stash pop
```

**Reviewer**: `code-reviewer` + `sentry-reviewer`.

**Task complete when**: all 5 acceptance criteria checked AND the
falsifiability probe demonstrates the gate fires on the broken
shape.

---

### Phase 2: Canonical Vercel Express layout [DRAFT — see Open Concerns #3,4,5,6,8,10,11,12]

**Foundation check-in**: Re-read principles.md §Architectural
Excellence Over Expediency + §NEVER create compatibility layers.

**Key principle**: replace the home-spun shape with the canonical
shape; do not bridge them.

#### Task 2.1: Create `src/server.ts` (Vercel-imported artefact)

**Target**: minimal module that constructs the configured Express
app and exports it as default.

```typescript
import http from 'node:http';
import type { Express } from 'express';
import { createApp } from './application.ts';
import { runtimeConfig } from './runtime-config.ts';
import { observability } from './observability.ts';

const app: Express = await createApp({
  runtimeConfig,
  observability,
  // ... per the existing createApp factory signature
});

export default app;
```

This is the file Vercel imports. Top-level await is permitted in
ESM modules and is the documented pattern for "configured app
ready for first request".

#### Task 2.2: Create `src/main.ts` (local Node listener)

**Target**: minimal local-dev runner that imports the default
export from `server.ts` and binds it to a port. EADDRINUSE is
handled via `server.on('error', …)` on the value `app.listen()`
returns — the canonical Express 5 pattern.

```typescript
import app from './server.ts';

const port = Number(process.env.PORT ?? 3333);
const server = app.listen(port, () => {
  console.log(`[main] listening on :${port}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[main] port ${port} in use`);
    process.exit(1);
  }
  throw err;
});
```

No signal handlers (Sentry SDK manages its own shutdown flush per
`docs.sentry.io/platforms/javascript/guides/node/configuration/draining/`).

#### Task 2.3: Create `src/sentry-init.ts` (--import preload)

**Target**: file loaded via `node --import ./dist/sentry-init.js`
for ESM auto-instrumentation per Sentry's documented contract:
<https://docs.sentry.io/platforms/javascript/guides/express/install/esm/>.

Contains `Sentry.init(...)` call + initial scope tags + nothing
else. Idempotent.

#### Task 2.4: Delete the home-spun runtime layer

Delete:

- `src/index.ts` (current combined runner+app shape).
- `src/bootstrap-app.ts` (54 LoC try/catch wrapper).
- `src/server-runtime.ts` (160 LoC custom orchestration).
- All tests for the deleted modules.

Net delta: ≈−272 LoC removed; +~60 LoC added across the three
new files.

#### Task 2.5: Update `package.json` and scripts

- `"main": "dist/server.js"` (was `dist/index.js`).
- `"types": "dist/server.d.ts"` (was `dist/index.d.ts`).
- Remove `"exports"` mapping entries that pointed at the deleted
  shape.

#### Task 2.6: Update `scripts/start-server.sh`

```bash
node --import ./dist/sentry-init.js ./dist/main.js
```

(Was: `node --import @sentry/node/preload ./dist/index.js`.)

**Acceptance criteria** (Phase 2 overall):

1. ✅ Three new files exist with the canonical shapes above.
2. ✅ Three deleted files no longer exist; their tests deleted too.
3. ✅ `package.json` `main` + `types` updated.
4. ✅ `start-server.sh` updated.
5. ✅ `pnpm build` exit 0 on the new shape; metafile assertion
   from Phase 1 passes.
6. ✅ Net LoC delta is negative (verify via `git diff --stat`).
7. ✅ No signal handlers added in `main.ts`.
8. ✅ No `process.exit(1)` calls outside the EADDRINUSE branch.

**Deterministic validation**:

```bash
# Files exist:
test -f apps/oak-curriculum-mcp-streamable-http/src/server.ts
test -f apps/oak-curriculum-mcp-streamable-http/src/main.ts
test -f apps/oak-curriculum-mcp-streamable-http/src/sentry-init.ts
# Files deleted:
! test -f apps/oak-curriculum-mcp-streamable-http/src/index.ts
! test -f apps/oak-curriculum-mcp-streamable-http/src/bootstrap-app.ts
! test -f apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts
# package.json main:
grep -q '"main": "dist/server.js"' apps/oak-curriculum-mcp-streamable-http/package.json
# Build passes:
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build
# All gates:
pnpm check
```

**Reviewers**: `code-reviewer`, `architecture-reviewer-fred`
(boundary discipline confirms the cut), `architecture-reviewer-
wilma` (resilience: confirms signal handler deletion does not
regress production behaviour given Sentry SDK shutdown flush
ownership).

**Task complete when**: all 8 acceptance criteria checked AND
all three reviewers signed off AND `pnpm check` exit 0.

---

### Phase 3: Type-level RequestHandler / Express app contract [DRAFT]

**Foundation check-in**: principles.md §No Type Shortcuts +
§Preserve type information.

**Key principle**: the type system enforces what the metafile
assertion enforces structurally — both layers fire on the same
contract.

#### Task 3.1: Type assertion at default export

In `src/server.ts`:

```typescript
import type { Express } from 'express';

const app: Express = await createApp({...});

// Compile-time assertion: app satisfies the Vercel Express adapter contract.
// Express's Express type is callable as a RequestHandler — the contract.
app satisfies (req: Parameters<Express>[0], res: Parameters<Express>[1]) => void;

export default app;
```

The `satisfies` clause is the only permitted type-narrowing
construct (per principles.md §Compiler Time Types). It enforces
the contract at compile time without widening.

**Acceptance criteria**:

1. ✅ `src/server.ts` includes `satisfies` clause matching
   Vercel's Express adapter contract.
2. ✅ Removing the `default app` line at the bottom would produce
   a `tsc` error (compile-time enforcement).
3. ✅ No `as`, `any`, `unknown`, or non-null assertion used.
4. ✅ Express type imported from `express` (library-native type,
   per principles).

**Deterministic validation**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
# Expected: exit 0
# Falsifiability:
sed -i.bak 's/^export default app;/\/\/ export default app;/' \
  apps/oak-curriculum-mcp-streamable-http/src/server.ts
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
# Expected: exit 1 with type error referencing missing default export
mv apps/oak-curriculum-mcp-streamable-http/src/server.ts.bak \
   apps/oak-curriculum-mcp-streamable-http/src/server.ts
```

**Reviewer**: `type-reviewer`.

**Task complete when**: all 4 acceptance criteria checked AND
the falsifiability probe shows the type error fires on the
broken shape.

---

### Phase 4: Smoke harness repointed [DRAFT]

**Foundation check-in**: principles.md §Decompose at the tension.
The harness exists because the production entry-point was not
trustable; with `server.ts` as the canonical artefact, the
harness becomes a confidence-boosting smoke gate against the
same artefact Vercel imports.

#### Task 4.1: Repoint `scripts/server-harness.js`

- Change the import path from `../dist/application.js` to
  `../dist/server.js`.
- Change the harness logic from "create app + listen" to "import
  default + assert callable + listen + curl /healthz + 200 +
  shutdown".
- Document the harness as a manual pre-deploy smoke gate (NOT
  CI) per owner constraint (avoids disk I/O in CI tests).

**Acceptance criteria**:

1. ✅ Harness imports `dist/server.js` default export.
2. ✅ Harness asserts `typeof app === 'function'`.
3. ✅ Harness binds to a free port, curls `/healthz`, expects 200.
4. ✅ Harness exits 0 on success, 1 on any failure.
5. ✅ Documentation in the harness file header marks it as
   manual / pre-deploy, NOT CI.

**Deterministic validation**:

```bash
cd apps/oak-curriculum-mcp-streamable-http
pnpm build
node scripts/server-harness.js
# Expected: exit 0 with "[harness] /healthz 200 OK"
```

**Task complete when**: all 5 acceptance criteria checked.

---

### Phase 5: Unblock the Sentry Uptime Monitoring lane [DRAFT — likely survives rewrite mostly intact]

**Foundation check-in**: Re-read `no-warning-toleration.md`
§Required → "Every monitoring surface MUST treat repeated
warnings as a signal".

**Key principle**: do not duplicate scope owned by another
plan. The
[`synthetic-monitoring.plan.md`](./synthetic-monitoring.plan.md)
lane already owns the probe build-out; this phase supplies the
research input that unblocks it and confirms the canonical
tool selection.

> **Terminology**: the on-disk file is named
> `synthetic-monitoring.plan.md` for historical reasons; in
> Sentry's taxonomy the products are **Uptime Monitoring** +
> **Cron Monitors**. Renaming the file is out of scope here.

#### Task 5.1: Record tool-selection decision in synthetic-monitoring.plan.md

Amend `synthetic-monitoring.plan.md` §Dependencies and §WS2.1
to record the tool-selection decision with evidence:

- **Uptime layer**: **Sentry Uptime Monitoring** (first-party,
  free quota, native trace correlation, integrates with existing
  alert routing). Basic 2xx-status probes are GA; response-body
  Verification (status / headers / JSON body assertions) is
  Early Adopter at the time of writing — opt the org into
  Early Adopter to use it, or land the basic probe first and
  upgrade later. Alternatives explicitly rejected: third-party
  uptime services (UptimeRobot, Pingdom — new vendor surface,
  no trace correlation); custom GitHub Actions cron (no
  geographic distribution, custom alert pipeline).
- **Working-probe layer**: candidate is **Sentry Cron Monitors**
  invoked from a separate cron runner that performs the
  end-to-end MCP tool call; final selection deferred to that
  plan's WS2 once probe-shape prototyping is complete (the
  cron-monitor product covers "did the scheduled job run +
  succeed", which is the right shape for working-probe
  evaluation).
- Remove the `blocked_on:` frontmatter entry once the decision
  is recorded.
- Optional follow-up housekeeping (NOT part of Task 5.1):
  consider renaming `synthetic-monitoring.plan.md` →
  `uptime-and-working-probe-monitoring.plan.md` to match Sentry
  taxonomy. Deferred to a separate documentation-housekeeping
  pass — file name churn during an in-flight unblock would
  break cross-references.

#### Task 5.2: Confirm scope boundary

This plan's Phase 5 ends at the **decision record**; the
build-out (probe code, cron wiring, alert configuration,
documentation, runbook) lives in
`synthetic-monitoring.plan.md`. The handoff is explicit so
neither plan duplicates the other's acceptance criteria.

**Acceptance criteria**:

1. ✅ `synthetic-monitoring.plan.md` updated to record the
   Sentry Uptime tool-selection decision with rationale +
   rejected alternatives.
2. ✅ `blocked_on:` frontmatter entry removed; status updated.
3. ✅ The cross-reference in this plan's §References is
   bidirectional (this plan ↔ synthetic-monitoring.plan.md).
4. ✅ No probe-code or alert-config work is performed in this
   plan — confirmed by `git diff` showing only documentation
   changes inside `apps/oak-curriculum-mcp-streamable-http/`.

**Reviewer**: `sentry-reviewer` (confirm the tool-selection
decision against current Sentry product capabilities and pricing
quota); `assumptions-reviewer` (challenge: is unblocking the
synthetic-monitoring lane in this branch the right scope, or
should it be a separate PR?).

**Task complete when**: all 4 acceptance criteria checked AND
both reviewers signed off.

---

### Phase 6: Vercel preview probe (re-do WI-6 + WI-7) [DRAFT]

**Foundation check-in**: Re-read the napkin §"speculative
diagnosis when the artefact is paginated" entry — the WI-6
acceptance probe MUST fetch full build logs (high `limit`,
filter on structured `level` fields) before forming any
diagnosis.

#### Task 6.1: Push branch + observe build

- Push `feat/otel_sentry_enhancements` to Vercel.
- Wait for build completion.
- Fetch full build logs (`get_deployment_build_logs` with
  `limit: 5000`).
- Filter on `"level":\s*"(warning|error)"` and on `[esbuild.config]`
  prefix lines.
- Verify:
  - Sentry plugin in `enabled` arm: `[esbuild.config] Sentry plugin enabled: ...`
  - Metafile assertion silent (passed).
  - Zero warnings (the rule's first enforcement).
  - `dist/server.js` produced, default export present.

#### Task 6.2: Observe runtime logs

- Open the preview URL (or curl `/healthz`).
- Fetch runtime logs.
- Verify NO `Invalid export found` line.
- Verify NO `FUNCTION_INVOCATION_FAILED` line.
- Verify Sentry SDK init log lines appear with the correct
  release name + environment.

#### Task 6.3: Verify Sentry UI

- Releases page shows the new release with attached commits.
- Deploy event recorded for the preview environment.
- Source maps uploaded (verify by triggering a synthetic error
  and checking the trace surfaces minified-source frames as
  resolved source frames).

**Acceptance criteria**:

1. ✅ Build exits 0 with Sentry plugin in `enabled` arm.
2. ✅ Zero warnings in the build log.
3. ✅ Metafile assertion passed silently.
4. ✅ Runtime logs show no contract violation.
5. ✅ Sentry UI shows release + commits + deploy event.
6. ✅ Source maps resolve a synthetic error correctly.

**Reviewers**: `code-reviewer` + `sentry-reviewer`.

**Task complete when**: all 6 acceptance criteria checked AND
the L-8 Correction WI-6 + WI-7 records can be marked complete.

---

### Phase 7: ADR-163 §6/§7 amendment (L-8 WI-8) [DRAFT]

**Foundation check-in**: ADR-117 (plan templates) + the
documentation-hygiene rule (misleading docs are blocking).

#### Task 7.1: Amend ADR-163 §6

Add subsections to §6 covering the three lessons surfaced by
the L-8 Correction lane:

1. **Version source-of-truth boundary discipline** (original
   L-8 lesson): canonical resolver, single boundary read per
   environment, BuildInfo persistence.
2. **Vendor-config passthrough discipline** (turbo.json
   `globalPassThroughEnv` for `SENTRY_*`): if vendor plugins
   need env vars, those must be passed through every
   monorepo-tool layer that hashes or filters env vars.
3. **Entry-point boundary discipline + non-deferrable warnings**
   (this plan's lesson): the canonical Vercel Express layout +
   the warnings doctrine + the metafile-assertion gate.

#### Task 7.2: Amend ADR-163 §7

Update the §7 outcome statement to name the gate that closes
each lesson:

| Lesson | Gate |
|---|---|
| Version source-of-truth | Canonical resolver in `@oaknational/build-metadata` + BuildInfo file |
| Vendor-config passthrough | `turbo.json` `globalPassThroughEnv` includes `SENTRY_*` |
| Entry-point contract | esbuild metafile assertion + warnings-as-errors in `esbuild.config.ts` |
| Non-deferrable warnings | `.agent/rules/no-warning-toleration.md` + `principles.md` bullet |

**Acceptance criteria**:

1. ✅ ADR-163 §6 has three sub-sections naming each lesson.
2. ✅ ADR-163 §7 has the gate-mapping table.
3. ✅ Status frontmatter remains Accepted; amendment date noted.
4. ✅ ADR cross-references this plan + the napkin entry.

**Reviewers**: `docs-adr-reviewer` (ADR text quality) +
`architecture-reviewer-betty` (long-term cohesion: does the
amendment compose with the rest of ADR-163 coherently or has
the ADR grown beyond its useful scope?).

**Task complete when**: all 4 acceptance criteria checked AND
both reviewers signed off.

---

### Phase 8: Reviewer cadence (final close) [DRAFT]

#### Task 8.1: Release readiness review

Invoke `release-readiness-reviewer` with the full plan + diff +
Phase 6 evidence. Final go/no-go for PR open.

**Acceptance criteria**:

1. ✅ Reviewer report acknowledges all phases complete.
2. ✅ Zero blockers raised; any non-blocking findings have
   accepted dispositions per `.agent/rules/invoke-code-reviewers.md`
   §Reviewer-findings disposition discipline (PDR-012 amendment).
3. ✅ Owner approves PR open.

**Task complete when**: all 3 acceptance criteria checked.

---

### Phase 9: Consolidation [DRAFT]

#### Task 9.1: Pattern graduation check

Per `patterns/SKILL.md` 3rd-instance bar:
`acknowledged-warnings-deferred-to-the-stage-they-explode-in`
is currently 1/3 (this WI-7 instance). The plan's Phase 1 build
self-assertion + Phase 5 monitoring layer install
**recurrence-prevention infrastructure** for instance #2 — they
do not themselves count as instances. Document this in the
napkin as evidence the loop is closing per the `passive-
guidance-loses-to-artefact-gravity` graduation note from the
`napkin.md` 2026-04-23 Pippin-third-session entry.

#### Task 9.2: Run /jc-consolidate-docs

Per `.agent/skills/jc-consolidate-docs/SKILL.md`. Likely outcomes:

- The warnings doctrine landing graduates to documentation
  references (already split into rule + principles bullet —
  no further graduation needed).
- The pattern instance entry on napkin compresses to distilled
  if substance is settled.
- This plan archives to `archive/completed/`.

#### Task 9.3: Archive plan + update parent

Move this plan to `.agent/plans/observability/archive/completed/`.
Update parent plan `sentry-observability-maximisation-mcp.plan.md`
L-7/L-8 todos to reflect the close.

**Acceptance criteria**:

1. ✅ Pattern instance recorded with explicit recurrence-prevention
   evidence in napkin.
2. ✅ /jc-consolidate-docs walked end-to-end.
3. ✅ This plan archived; parent plan updated.

**Task complete when**: all 3 acceptance criteria checked.

---

## Testing Strategy (LEGACY — SUPERSEDED for phase-coupling)

> **SUPERSEDED 2026-04-23**: the testing strategy below is keyed to
> the legacy 9-phase shape. Test invariants for the binding contract
> are inline per phase in §Reduced-Scope Rewrite under each Phase's
> "Acceptance criteria" + "Deterministic validation" subsections.
> Specifically: Phase 2 (esbuild-config.unit.test.ts asserting all
> three entries; new unit test for the metafile-default-export
> assertion helper), Phase 3 (existing unit/integration/e2e/smoke
> tests remain green; no deletion of any test for `src/index.ts` /
> `src/bootstrap-app.ts` / `src/server-runtime.ts`), Phase 5 (Vercel
> preview probe). The general philosophy below ("no disk I/O in
> tests"; "metafile-in-memory assertion") still applies; the
> phase-keyed specifics do not.

### Unit / integration tests

**Existing coverage**:

- `apps/oak-curriculum-mcp-streamable-http/src/application.ts`
  has integration tests for `createApp` factory — these survive
  the refactor unchanged (no behaviour change to the factory).
- `packages/libs/build-metadata` tests for `resolveBuildTimeRelease`
  — survive unchanged.

**New tests required**: none in product code. The build-script
self-assertion is the right boundary for the contract check;
adding a Vitest test that imports `dist/server.js` from disk
would violate the owner's "no disk I/O in tests" constraint
and would duplicate what the metafile assertion already enforces.

**Tests to delete**:

- Tests for `src/bootstrap-app.ts` (deleted module).
- Tests for `src/server-runtime.ts` (deleted module).

### E2E tests

**Existing coverage**: existing MCP smoke tests against a
running server. These continue to work — they import the running
HTTP server via its URL, not via the bundled artefact.

**New tests required**: none. Phase 5's Sentry Uptime monitor
provides the synthetic-probe layer; running it locally via
the smoke harness (Phase 4) provides pre-deploy confidence.

### Validation

- Phase 1 metafile assertion = build-time gate.
- Phase 3 type assertion = compile-time gate.
- Phase 4 smoke harness = manual pre-deploy gate.
- Phase 5 Sentry Uptime = continuous post-deploy gate.
- Phase 6 Vercel probe = one-shot landing verification.

Four layers, each catching a different failure class.

---

## Success Criteria (LEGACY — SUPERSEDED by per-phase Acceptance criteria in §Reduced-Scope Rewrite)

> **SUPERSEDED 2026-04-23**: the per-phase success criteria below
> are keyed to the legacy 9-phase shape. Binding success criteria
> for the next session are recorded inline per phase in
> §Reduced-Scope Rewrite under each Phase's "Acceptance criteria"
> bullet list. Branch-level success: (a) §Reduced-Scope Rewrite
> Phase 1 outcome documented in this plan with primary evidence;
> (b) Vercel preview deploys cleanly with `dist/server.js` honouring
> Phase 1's verified contract; (c) `pnpm check` exits 0; (d) doc
> blast-radius (Finding A5) eliminated; (e) ADR-163 §6/§7 amended
> for the asymmetric design; (f) §Deferred Lanes (DL-1..DL-7)
> filed as plan stubs in `.agent/plans/observability/future/`.
> Original phase-keyed list retained below for diff legibility.

### Phase 0 (Doctrine)

- ✅ Three doctrine artefacts landed (rule + cursor pointer +
  principles bullet) + this plan file.

### Phase 1 (Build self-assertion)

- ✅ Metafile assertion + warnings-as-errors gate in
  `esbuild.config.ts`.
- ✅ Falsifiability probe fires the gate on the pre-refactor shape.

### Phase 2 (Canonical refactor)

- ✅ Three new files created; three deleted files removed.
- ✅ Net negative LoC delta.
- ✅ All gates green.

### Phase 3 (Type assertion)

- ✅ `satisfies` clause enforces Express adapter contract.

### Phase 4 (Smoke harness)

- ✅ Harness repointed at canonical artefact; manual smoke gate
  documented.

### Phase 5 (Sentry Uptime Monitoring lane unblock)

- ✅ Sentry Uptime Monitoring tool-selection decision recorded
  in `synthetic-monitoring.plan.md` (with the Verification
  Early-Adopter note).
- ✅ Sentry Cron Monitors recorded as the candidate for the
  working-probe layer (final selection deferred to that plan).
- ✅ `blocked_on:` frontmatter entry removed; that plan
  proceeds independently.
- ✅ No probe-build-out work performed in this plan.

### Phase 6 (Vercel probe)

- ✅ Build green with plugin enabled, zero warnings.
- ✅ Runtime green with default export honoured.
- ✅ Sentry UI release/commits/deploy populated.

### Phase 7 (ADR amendment)

- ✅ ADR-163 §6/§7 folds in three lessons + gate-mapping table.

### Phase 8 (Close)

- ✅ Release-readiness-reviewer go-decision.

### Phase 9 (Consolidation)

- ✅ Pattern instance recorded; plan archived.

### Overall

- ✅ Lambda boot crash on `oak-curriculum-mcp-streamable-http`
  resolved.
- ✅ Recurrence-prevention installed at four layers (build,
  compile, smoke, monitor).
- ✅ Doctrine elevated to repo principle + rule.
- ✅ ADR-163 lane closed (WI-8).
- ✅ `synthetic-monitoring.plan.md` unblocked with canonical
  vendor selection (Sentry Uptime Monitoring + candidate
  Sentry Cron Monitors; Verification Early-Adopter note recorded).
- ✅ Net negative LoC delta + every reviewer finding addressed.

---

## Dependencies

**Blocking**: nothing. Phase 0 lands in this commit; all
subsequent phases are sequential within this branch.

**Related plans**:

- Parent: `../active/sentry-observability-maximisation-mcp.plan.md`
  (this plan closes WI-7 + WI-8 of the L-8 Correction lane).
- Sibling: `../active/sentry-otel-integration.execution.plan.md`
  (Sentry-OTel base integration; unaffected).
- Future: an analogous canonical-deploy-shape pass for
  `oak-search-cli` once it migrates from tsup to esbuild
  (deferred follow-on per L-8 Correction owner-confirmed note).

**Prerequisites**:

- ✅ L-8 Correction WI-1..5 landed (commit `fb047f86`).
- ✅ `feat/otel_sentry_enhancements` branch open.
- ✅ Architecture-reviewer convergence captured (napkin
  2026-04-23 entry).

---

## Notes

### Why this matters (system-level thinking)

**Question**: "Why are we doing this, and why does that matter?"

**Immediate value**:

- Restores `oak-curriculum-mcp-streamable-http` to a working
  state on Vercel (currently 100% 500s on preview).
- Closes the L-8 Correction lane (WI-7 + WI-8) so the
  observability-sentry-otel thread can proceed to the next
  workstream.
- Eliminates the build warning class that produced the WI-7
  crash.

**System-level impact**:

- **Doctrine**: "no warning toleration" is now binding across
  the repo at principle + rule level, with the first hard
  instance documented as the originating evidence. Future
  agents who consider deferring a warning encounter the rule
  before the choice.
- **Recurrence prevention**: the build self-assertion catches
  this entire class of failure (any future entry-point shape
  change that breaks the Vercel adapter contract) at the
  cheapest possible stage.
- **Monitoring layer**: Sentry Uptime fills a gap the project
  did not previously have — synthetic probes against
  user-visible endpoints with native trace correlation.
- **Canonical layout**: every other workspace that needs a
  Vercel Express deploy can now copy the
  `server.ts`/`main.ts`/`sentry-init.ts` shape rather than
  re-invent the home-spun runtime layer. This is the framework-
  vs-consumer separation principle applied at the deployment-
  shape boundary.

**Risk of not doing**:

- **Rebuild-then-explode-again loop**: without the build
  self-assertion, the next bundle-shape change (next vendor
  plugin update, next esbuild major, next Sentry SDK update)
  re-introduces the same crash class. Manual diligence is the
  only current defence.
- **Doctrine-by-prose**: without the principles bullet + rule,
  "no warning toleration" stays as ad-hoc owner intervention.
  The next agent makes the same WI-N+1 deferral decision under
  the same plan-momentum pressure.
- **Health-check blindspot**: without Sentry Uptime, the next
  outage of this class is detected by user reports, not by
  automated probe.
- **Home-spun runtime drift**: every additional week the
  bootstrap-app + server-runtime layer lives, the temptation
  to add "just one more wrapper" grows. Canonical layout
  closes that drift surface permanently.

### Alignment with foundation documents

**From `principles.md` §Architectural Excellence Over Expediency**:

> *"Always choose long-term architectural clarity over short-
> term convenience. If a shortcut creates duplication across
> architectural layers, it is not a shortcut — it is a debt
> that compounds silently."*

This plan is the cleanup of exactly that compounded debt: the
home-spun runtime layer was a shortcut (faster than learning
Vercel's Express adapter contract); the WI-7 crash is the
silent debt manifesting.

**From `principles.md` §Code Quality (just-landed bullet)**:

> *"No warning toleration, anywhere — Warnings are not deferrable
> in any system the repo influences (build, quality gates,
> runtime, monitoring)."*

This plan installs the enforcement boundaries the rule demands:
build (Phase 1), compile (Phase 3), runtime monitoring
(Phase 5).

**From `principles.md` §Strict and Complete**:

> *"Prefer explicit, strict, total, fully checked systems over
> permissive, partial, or hand-wavy ones."*

The metafile assertion + the type-level `satisfies` clause + the
Sentry Uptime assertions are all explicit, strict, total,
fully-checked.

**This plan**:

- ✅ Replaces home-spun layer with canonical layout (no
  compatibility shim).
- ✅ Net negative LoC + delete more than add.
- ✅ Single source of truth for the deploy-shape contract
  (esbuild.config.ts + the `satisfies` clause).
- ✅ Sentry Uptime is first-party, not bespoke.
- ✅ Doctrine elevated to repo level, not stored in a session
  artefact.

---

## References

**Primary evidence**:

- `.agent/memory/active/napkin.md` §"2026-04-23 — warnings-are-
  not-deferrable codified + first hard instance" (architecture-
  reviewer convergence + pattern instance).
- `.agent/memory/active/napkin.md` §"2026-04-23 — speculative
  diagnosis when the artefact is paginated" (WI-6 root cause).

**Doctrine artefacts**:

- `.agent/directives/principles.md` §Code Quality bullet (added
  this commit).
- `.agent/rules/no-warning-toleration.md` (added this commit).
- `.cursor/rules/no-warning-toleration.mdc` (added this commit).

**Parent / sibling plans**:

- `../active/sentry-observability-maximisation-mcp.plan.md`.
- `../active/sentry-otel-integration.execution.plan.md`.
- `../active/sentry-observability-translation-crosswalk.plan.md`.

**ADRs to amend**:

- ADR-163 §6/§7 (this plan's Phase 7 deliverable).

**External docs cited**:

- Vercel Express adapter:
  <https://vercel.com/docs/frameworks/backend/express>
- Sentry Express ESM init:
  <https://docs.sentry.io/platforms/javascript/guides/express/install/esm/>
- Sentry Uptime Monitoring:
  <https://docs.sentry.io/product/uptime-monitoring/>
- Sentry Node shutdown / draining:
  <https://docs.sentry.io/platforms/javascript/guides/node/configuration/draining/>

---

## Consolidation

After Phase 9, run `/jc-consolidate-docs` per
`.agent/skills/jc-consolidate-docs/SKILL.md`. Expected outputs:

- Pattern instance compressed to distilled if appropriate.
- Plan archived to `archive/completed/`.
- Cross-references updated.
- L-8 Correction subsection of the parent plan retired.

---

## Future Enhancements (Out of Scope)

- **Apply the canonical deploy shape to `oak-search-cli`**: the
  L-8 Correction owner-confirmed deferred follow-on. Separate
  lane after this plan archives.
- **Apply the canonical deploy shape to other Vercel-deployed
  apps**: audit + sweep. Separate lane.
- **Propose escalating warnings to errors at the workspace
  config level for ESLint / depcruise / knip** in workspaces
  where this is not yet the case: separate lane, scoped per
  workspace.
- **Add a Sentry Uptime monitor for the `/mcp` POST endpoint**
  (with synthetic MCP handshake): once the `/healthz` monitor
  proves the model, expand to deeper semantic probes.
- **Pattern graduation for `acknowledged-warnings-deferred-to-
  the-stage-they-explode-in`**: requires instance #2 + #3 across
  cross-session evidence. This plan installs the recurrence-
  prevention infrastructure; the pattern itself only graduates
  if the infrastructure fails.
