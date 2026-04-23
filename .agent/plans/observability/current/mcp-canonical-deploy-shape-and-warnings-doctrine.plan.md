---
name: "MCP Canonical Deploy Shape + Warnings Doctrine"
overview: >
  Quality-fix plan executing the architectural-reviewer convergence (Fred +
  Betty, 2026-04-23) for the WI-7 lambda boot crash on
  `apps/oak-curriculum-mcp-streamable-http`. Lands the canonical Vercel
  Express deploy shape (server.ts + main.ts + sentry-init.ts), deletes the
  home-spun runtime wrapper layer (bootstrap-app + server-runtime + the
  combined index.ts), self-asserts the build (esbuild metafile + warnings
  as errors), repoints the smoke harness, registers a Sentry Uptime monitor
  for /healthz, completes the L-8 Correction WI-8 ADR-163 §6/§7 amendment,
  and lands the "no warning toleration" doctrine (principles bullet + rule
  body, both already in this commit). Closes every reviewer finding from
  napkin 2026-04-23 §Architecture-reviewer convergence.
parent_plan: "../active/sentry-observability-maximisation-mcp.plan.md"
branch: "feat/otel_sentry_enhancements"
depends_on:
  - "../active/sentry-observability-maximisation-mcp.plan.md"
todos:
  - id: phase-0-doctrine
    content: "Phase 0: Land warnings-not-deferrable doctrine — principles.md bullet + .agent/rules/no-warning-toleration.md + .cursor/rules/no-warning-toleration.mdc."
    status: in_progress
  - id: phase-1-build-self-asserts
    content: "Phase 1: Make the build self-asserting — esbuild.config.ts metafile assertion (default export contract) + warnings-as-errors gate."
    status: pending
  - id: phase-2-canonical-entry-points
    content: "Phase 2: Refactor to canonical Vercel Express layout — src/server.ts (default export), src/main.ts (local listener), src/sentry-init.ts (--import preload). Delete src/bootstrap-app.ts + src/server-runtime.ts + the combined src/index.ts shape."
    status: pending
  - id: phase-3-type-assertion
    content: "Phase 3: Type-level RequestHandler / Express app contract assertion at src/server.ts default export."
    status: pending
  - id: phase-4-smoke-harness
    content: "Phase 4: Repoint scripts/server-harness.js at dist/server.js (canonical artefact); retain as manual pre-deploy smoke gate (not CI)."
    status: pending
  - id: phase-5-sentry-uptime
    content: "Phase 5: Unblock the Sentry Uptime Monitoring lane (file: synthetic-monitoring.plan.md, generic name predates the Sentry taxonomy) by recording the tool-selection decision — Sentry Uptime Monitoring for the uptime layer, Sentry Cron Monitors as candidate for the working-probe layer — with rejected alternatives, and removing its blocked_on entry. Build-out remains in that plan."
    status: pending
  - id: phase-6-vercel-probe
    content: "Phase 6: Vercel preview probe (re-do WI-6 + WI-7) — push branch, observe build logs for plugin enabled arm, observe runtime logs for default-export contract honoured, verify Sentry UI release/commits/deploy."
    status: pending
  - id: phase-7-adr-amendment
    content: "Phase 7: Amend ADR-163 §6/§7 (WI-8) to fold in entry-point boundary discipline + non-deferrable-warnings doctrine + vendor-config passthrough lesson alongside the existing version-resolution boundary."
    status: pending
  - id: phase-8-reviewer-cadence
    content: "Phase 8: Phase-aligned reviewer cadence — assumptions-reviewer pre-execution, code-reviewer + sentry-reviewer + type-reviewer during, architecture-reviewer-wilma + architecture-reviewer-betty + docs-adr-reviewer + release-readiness-reviewer post."
    status: pending
  - id: phase-9-consolidation
    content: "Phase 9: /jc-consolidate-docs walk — graduate the warnings-doctrine pattern instance, update the napkin, archive the plan."
    status: pending
---

# MCP Canonical Deploy Shape + Warnings Doctrine

**Last Updated**: 2026-04-23
**Status**: 🟢 EXECUTION-READY (Phase 0 doctrine landed; Phase 1+ pending next session)
**Scope**: Close every architectural-reviewer finding from the
2026-04-23 WI-7 lambda boot crash diagnosis, land the canonical
Vercel Express deploy shape, complete L-8 Correction WI-8, and
elevate "no warning toleration" to repo doctrine.

---

## Next Session Entry Point

This plan is the **branch-primary entry point** for the next
session on `feat/otel_sentry_enhancements`. Read in this order
before doing anything substantive:

1. This plan top-to-bottom. It supersedes prior next-session
   notes on the L-8 Correction subsection of
   `sentry-observability-maximisation-mcp.plan.md` for WI-7 +
   WI-8.
2. `.agent/memory/active/napkin.md` §"2026-04-23 — warnings-are-
   not-deferrable codified + first hard instance" — pattern
   instance #1 + architecture-reviewer convergence + the
   resolution turn that produced this plan.
3. `.agent/rules/no-warning-toleration.md` — the doctrine
   landed in Phase 0 (this commit). Every subsequent commit on
   this branch is bound by it.
4. `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
   — thread-record, retains the high-level lane state (L-8
   Correction WI-7 + WI-8 closure handed to this plan).

**Resume action**: open Phase 1 (build self-assertion). Do
not re-do diagnosis — the WI-7 root cause is settled; the
architectural-reviewer convergence is captured; the canonical
layout is decided. Phase 0 is the only completed phase.

**Reviewer cadence on resume** (per owner directive 2026-04-23):
invoke specialist reviewers **(a) during planning** of each
phase (assumptions challenge before code), **(b) after each
significant change** (code-reviewer + the relevant specialist
per the per-phase table below), and **(c) before session close**
(release-readiness-reviewer if a phase landed; assumptions-
reviewer if planning advanced without code). The per-phase
table at §Reviewer Scheduling enumerates which specialists
apply where. No batching at the end of the plan; phase-aligned
review is the policy.

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

### After Phase 1 specifically (build self-assertion)

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

## Solution Architecture

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

## Reviewer Scheduling (phase-aligned, three anchors)

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

## Documentation Propagation Commitment

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

## Resolution Plan

### Phase 0: Doctrine landing (THIS COMMIT, in progress)

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

**Phase 0 complete when**: all four files committed.

---

### Phase 1: Build self-assertion (esbuild metafile + warnings-as-errors)

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

### Phase 2: Canonical Vercel Express layout

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

### Phase 3: Type-level RequestHandler / Express app contract

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

### Phase 4: Smoke harness repointed

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

### Phase 5: Unblock the Sentry Uptime Monitoring lane

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

### Phase 6: Vercel preview probe (re-do WI-6 + WI-7)

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

### Phase 7: ADR-163 §6/§7 amendment (L-8 WI-8)

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

### Phase 8: Reviewer cadence (final close)

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

### Phase 9: Consolidation

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

## Testing Strategy

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

## Success Criteria

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
