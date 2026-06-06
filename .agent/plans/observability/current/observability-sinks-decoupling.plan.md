---
name: "Observability Sinks Decoupling — implement ADR-171 (telemetry independent of the Sentry sink)"
overview: >
  Finish the half-landed migration from the single SENTRY_MODE axis to ADR-171's
  orthogonal OBSERVABILITY_SINKS × OBSERVABILITY_FIXTURES axes, so telemetry
  generation (spans AND structured events) is sink-independent: turning the Sentry
  sink off no longer silences span telemetry — it routes to the console / log-file
  sinks instead. WS1 already landed the core types (commit a3a0222a); this plan
  migrates the consumers and decouples span generation from `mode === 'sentry'`.
  It is the clean, linear re-attempt the owner directed (2026-05-04) and subsumes
  the damaged/paused replace-sentry-mode plan. The MCP harness / EEF work surfaced
  the gap but does NOT block on this: EEF accepts a Sentry-off behaviour-validation
  run now and validates Sentry telemetry post-release from live data. This plan
  stands on its own ADR-162/171 vendor-independence merit.
status: current
supersedes:
  - .agent/plans/observability/future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md
todos:
  - id: c1-c2-forcing-function-and-standalone-provider
    content: >
      C1+C2 (ONE atomic landing — RED+GREEN, never committed-red): (RED) an
      in-process integration conformance test with a DI-injected console/fake sink,
      asserting span telemetry for a known operation persists to that sink with the
      Sentry sink OFF — fails today because `resolveTracer`
      (http-observability.ts:152-154) only tracers when `mode === 'sentry'` (else
      synthetic no-op spans, span-helpers.ts:186-203). (GREEN) decouple span
      generation by constructing a STANDALONE OTel `NodeTracerProvider` with per-sink
      exporters (console / log-file / sentry), selected from OBSERVABILITY_SINKS
      independent of the Sentry mode. A standalone provider is REQUIRED, not optional:
      `trace.getTracer()` returns a no-op unless a provider is registered (Sentry's
      `init()` registers one today), so true vendor-independence — Sentry-off must
      still emit spans — cannot be achieved any other way. Adds
      `@opentelemetry/sdk-trace-node` and AMENDS ADR-171 to sanction the standalone
      provider as the vendor-independent span path (the provider is selected by sink
      set: Sentry's when `sentry` ∈ sinks, else the standalone one). Coordinate with
      multi-sink-vendor-independence-conformance.plan.md (same test shape — reuse).
    status: pending
    depends_on: []
  - id: c2b-build-bridge-and-reconcile-enum
    content: >
      C2b (migration prerequisites — BEFORE any consumer migrates): (1) BUILD the
      `SENTRY_MODE`→axes transitional bridge in `@oaknational/env-resolution`
      (ADR-171 §Decision 3) — map legacy `SENTRY_MODE` to OBSERVABILITY_SINKS/
      FIXTURES and emit a deprecation warning via the reserved `warnings` channel
      (resolve-env.ts) so non-migrated consumers keep working. It does NOT exist
      today: `refineLegacySentryMode` (packages/core/env) hard-rejects `SENTRY_MODE`;
      the bridge maps it upstream of that schema, and the hard-reject becomes the
      permanent post-migration guard once C5 deletes the bridge. (2) RECONCILE the
      sink-enum: `OBSERVABILITY_SINK_KINDS` (sink-registry.ts:37) `'file'`→`'log-file'`
      and add `'console'`, propagating through the env schema + refinements
      (the `'console'` sink carries no conditional-requirement rule, by design).
    status: pending
    depends_on: [c1-c2-forcing-function-and-standalone-provider]
  - id: c3-migrate-consumers-via-bridge
    content: >
      C3 (incremental, per-consumer): migrate each consuming composition root from
      SENTRY_MODE consumption to OBSERVABILITY_SINKS / OBSERVABILITY_FIXTURES via
      the C2b bridge — HTTP MCP app (http-observability.ts), then Search CLI(s)
      (cli-observability.ts). One consumer per cycle, each landing green; the bridge
      keeps non-migrated consumers working, so this is incremental, NOT one atomic
      cross-package commit (the over-constraint that damaged the old plan). Re-derive
      the exact consumer-site inventory at execution.
    status: pending
    depends_on: [c2b-build-bridge-and-reconcile-enum]
  - id: c4-cosmetic-renames
    content: >
      C4 (cosmetic, separated): the mechanical renames — `mode` → `kind`
      discriminator, FixtureSentryStore → FixtureCaptureStore, FixtureSentryCapture*
      → FixtureCaptureRecord*. This also removes the Sentry-specific `fixtureStore`
      TYPE from the vendor-neutral `HttpObservability` interface (decompose-at-the-
      tension: a Sentry-named type on the sink-independent surface is the coupling
      smell). Pure rename cycles, each green, sequenced AFTER the structural
      decoupling so the cosmetic-vs-structural axis stays separated.
    status: pending
    depends_on: [c3-migrate-consumers-via-bridge]
  - id: c5-bridge-removal-adr-amendments-docs
    content: >
      C5 (closure): delete the SENTRY_MODE transitional bridge once every consumer
      has migrated (grep proves zero live SENTRY_MODE/SentryMode/SentryEnvSchema in
      SOURCE + SCHEMA files — test-helper pinned literals e.g.
      auth-error-test-helpers.ts:52 are migrated too, not exempted; historical doc
      refs excluded); VERIFY-AND-COMPLETE the existing 2026-05-10 ADR amendment notes
      on ADR-143/116/162/163 to record the post-migration state (the notes already
      exist — this is not blank-slate authoring); update .env.example (remove
      `SENTRY_MODE`, add OBSERVABILITY_SINKS/FIXTURES/FILE_PATH) + the affected READMEs.
    status: pending
    depends_on: [c4-cosmetic-renames]
---

# Observability Sinks Decoupling — implement ADR-171

**Last Updated**: 2026-06-06
**Status**: 🟢 DECISION-COMPLETE (execution gated — see Execution Preconditions)
**Collection**: `observability`
**Implements**: [ADR-171](../../../../docs/architecture/architectural-decisions/171-observability-configuration-orthogonal-axes.md) (Accepted 2026-05-10)
**Subsumes**: `future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`

## End Goal (User Impact)

Telemetry is generated independently of any one vendor sink. Turning the **Sentry
sink** off (the default for local runs, CI, and the MCP smoke harness) does **not**
disable telemetry — span and event telemetry route to the always-on stdout baseline
and to the `console` / `log-file` sinks. An operator (or a test) can capture the
real telemetry of a real run without Sentry in the loop.

This gap was *surfaced* by the MCP smoke harness / EEF D7 work, but EEF does **not**
block on it: EEF validates tool behaviour with the Sentry sink off now, and validates
Sentry telemetry post-release by inspecting live Sentry data. This plan stands on its
own ADR-162/171 vendor-independence merit — the harness benefits later, it is not an
EEF prerequisite (see Connection to the MCP Smoke Harness / EEF D7).

## Mechanism (Why the Named Means Produce the Outcome)

1. **ADR-171 is the ratified shape; this plan is its application.** The two
   orthogonal axes (`OBSERVABILITY_SINKS` typed list, `OBSERVABILITY_FIXTURES`
   boolean) already exist as schemas (WS1, commit `a3a0222a`). Migrating the
   consumers off `SENTRY_MODE` and routing span generation from the sink set is
   what realises the decision in running code.
2. **A forcing function makes the migration converge.** The damaged plan had no
   functional gate (the dev server worked with or without the rename). A
   conformance test that fails until span telemetry persists with Sentry off
   (C1) is the gate that drives C2–C5 and prevents silent half-migration.
3. **A transitional bridge makes migration incremental — and it must be built.**
   ADR-171 §Decision 3 mandates a `SENTRY_MODE`→axes bridge in
   `@oaknational/env-resolution`. It does NOT exist yet: today `refineLegacySentryMode`
   (packages/core/env) hard-rejects `SENTRY_MODE`. C2b builds the bridge (map +
   deprecation warning via the reserved `warnings` channel) so consumers migrate one
   green cycle at a time (C3); the hard-reject becomes the permanent post-migration
   guard once C5 deletes the bridge.

## Grounded Current State (2026-06-06)

- **ADR-171 (Accepted 2026-05-10)** defines the orthogonal axes; `SENTRY_MODE` is to
  be retired via a transitional bridge (BUILT in C2b, deleted in C5). Today there is
  NO bridge: `refineLegacySentryMode`
  (`packages/core/env/.../observability-refinements.ts:79-93`) hard-rejects any
  `SENTRY_MODE` — the C2b bridge maps it upstream of that schema during migration.
- **WS1 landed (commit `a3a0222a`)**: the core types exist —
  `OBSERVABILITY_SINKS`/`OBSERVABILITY_FIXTURES` schemas (`packages/core/env`),
  `ObservabilitySinkKind` + `SinkRegistry` (`packages/core/observability/src/sink-registry.ts`),
  the `EnvWarning` union (`packages/libs/env-resolution`).
- **The telemetry-coupling gap (the thing to fix)**: `http-observability.ts:152-154`
  `resolveTracer` returns an OTel tracer **only** when `mode === 'sentry'`; with
  Sentry off, `createSpanFunctions(undefined)` produces synthetic no-op spans
  (`span-helpers.ts:186-203`, `noopSpanHandle:29-36`) — a correlation id only, no
  recorded span content. The structured-log → stdout baseline is always-on
  (`sink-registry.ts:37`, ADR-162 §Vendor-Independence Clause), but **spans** are
  Sentry-coupled today.
- **Sink-enum drift to reconcile**: ADR-171 §Decision names `sentry`/`console`/
  `log-file`; live `sink-registry.ts:37` has `['sentry', 'file']` with `stdout` as
  the un-listed always-on baseline. C5 reconciles.
- **The damaged plan's substance is reusable** (field shapes, file inventories, the
  four-kind discriminated union design in its preserved §Cycles); its *framing* is
  what was damaged.

## The Foundational Tension (named — resumption precondition 1)

The damaged plan listed four causes; their root is one: **the rename had no forcing
function and bundled two change-kinds into one over-constrained landing.** Named so
this plan does not inherit it:

1. **No functional gate** — the dev server worked with or without the rename, so
   nothing drove it to completion. → **Cure: C1 forcing-function conformance test.**
2. **Cosmetic and structural changes mixed** — `mode`→`kind` / store renames
   (cosmetic) tangled with the 3→4-kind union and tracer decoupling (structural),
   which have different sequencing characteristics. → **Cure: C2/C4 separate them.**
3. **"Atomic" conflated with "single commit"** — over-constraining the
   decomposition. → **Cure: incremental per-consumer cycles via the bridge (C3),
   each landing green; atomic-landing is per-cycle, not one mega-commit.**
4. **Multi-commit landings raced parallel writers** on a shared branch. → **Cure:
   execution-precondition that the relevant feature branch(es) are merged first.**

If the tension warrants a durable home beyond this plan body, a PDR or an ADR-171
amendment is the vehicle (docs-adr-expert decides at execution).

## Workstreams (linear cycles; each lands green)

Per ADR-117 + `tdd-as-design.md`. The decomposition is deliberately linear and
small (owner constraint: simple, straightforward). Each cycle is one green commit
(C1+C2 co-land atomically — never committed-red).

- **C1+C2 — forcing function + standalone-provider decoupling (ONE atomic landing).**
  In-process integration conformance test (DI console/fake sink) that fails with the
  Sentry sink off; greened by a standalone OTel `NodeTracerProvider` with per-sink
  exporters selected from `OBSERVABILITY_SINKS` (the provider is selected by sink set —
  Sentry's when `sentry` ∈ sinks, else the standalone one). Adds
  `@opentelemetry/sdk-trace-node`; amends ADR-171 to sanction the standalone provider.
  Coordinate with `multi-sink-vendor-independence-conformance.plan.md` (same shape).
- **C2b — build the bridge + reconcile the enum (before C3).** Build the
  `SENTRY_MODE`→axes bridge in env-resolution (it does not exist today); reconcile the
  sink-enum (`file`→`log-file`, add `console`).
- **C3 — migrate consumers via the bridge.** HTTP MCP app, then Search CLI(s); one
  per cycle; bridge keeps the rest working.
- **C4 — cosmetic renames.** `mode`→`kind`, FixtureSentryStore→FixtureCaptureStore;
  also removes the Sentry-specific `fixtureStore` type from the vendor-neutral
  `HttpObservability` interface. Mechanical, separated, green.
- **C5 — closure.** Delete the bridge (grep-proven zero live `SENTRY_MODE` in
  source+schema); verify-and-complete the ADR amendment notes (143/116/162/163);
  `.env.example` (remove `SENTRY_MODE`, add the new axes) + READMEs.

## Supersession of the Damaged Plan

This plan subsumes
[`replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`](../future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md),
per the standing 2026-05-04 owner direction ("create a new plan to finish the
remaining actual work… mark the old plan as damaged and superseded"). Mapping:

- Old cycle-1 (one atomic cross-package rename) → split across C1+C2 (forcing
  function + standalone-provider decouple) + C2b (bridge + enum) + C3 (incremental
  per-consumer migration) + C4 (cosmetic renames) — the forcing function it lacked.
- Old cycle-2 (author ADR-171) → **already done** (ADR-171 Accepted 2026-05-10);
  C5 instead amends the ADRs ADR-171 §Consequences names (143/116/162/163).
- Old cycle-3 (READMEs + `.env.example`) → C5.
- The old plan's preserved §Cycles substance (field shapes, file inventories, the
  four-kind union design) is reference context, re-grounded at execution.

**Action on activation**: archive the damaged plan to `archive/superseded/` with a
reference back to this plan. (The damaged plan's branch-arc supersession by
`eef-branch-merge-readiness.plan.md` covered only the ship-the-branch needs, not
this architectural work.)

## Prerequisite Classification

- **ADR-171 (blocking)** — Accepted; satisfied.
- **WS1 core types (blocking)** — landed `a3a0222a`; satisfied.
- **C1+C2 atomic landing (blocking)** for C2b–C5 — the forcing function +
  standalone-provider decoupling are the gate.
- **C2b bridge + enum reconciliation (blocking)** for C3 — consumers cannot migrate
  before the bridge exists and the enum is reconciled.
- **Relevant feature branch(es) merged (blocking for execution)** — so the
  migration does not race branch closure (tension cause #4). Re-verify at execution.
- **`multi-sink-vendor-independence-conformance.plan.md` (beneficial)** — its
  emission-persistence test is the C1 shape. Minimum shippable without it: author
  C1's conformance test directly in this plan's scope.

## Non-Goals (YAGNI)

- ❌ Re-opening ADR-171 (the axes shape is settled).
- ❌ New sinks (`posthog`, `warehouse`) — they extend the enum later, not here.
- ❌ Build-time release-identifier scope (ADR-163) — orthogonal, untouched.
- ❌ The deeper observability axis-coverage commitment (ADR-162) beyond the
  configuration shape.
- ❌ The MCP smoke harness itself (separate plan). This plan is **not** an EEF
  prerequisite — EEF validates telemetry post-release from live Sentry data; this
  plan independently improves vendor-neutral telemetry capture the harness may use
  later.

## Quality Gate Strategy

Per [`components/quality-gates.md`](../../templates/components/quality-gates.md).
After each cycle: the focused workspace `type-check` + `lint` + `test` for the
touched package(s). Final aggregate: `pnpm check`.

## Proof Contract for Completion Claims

| Cycle | Acceptance id | Proof level | Proof |
|-------|---------------|-------------|-------|
| C1 | telemetry-off-sentry-red | integration | the conformance test FAILS on current main (proves the gap is real) |
| C2 | span-routes-without-sentry | integration | C1 conformance test GREEN with Sentry sink off |
| C3 | consumers-on-axes | integration | each consumer reads OBSERVABILITY_SINKS/FIXTURES; bridge still serves non-migrated; suite green per cycle |
| C4 | renames-complete | unit | `kind`/FixtureCapture* renames green; no behaviour change |
| C5 | bridge-removed-adrs-amended | non-code + integration | `rg` zero live SENTRY_MODE; ADR diffs; `pnpm check` green |

No `complete` verdict until every id is proven. Test-first per cycle; retrospective
coverage is not TDD evidence.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Repeats the damaged plan's friction | Medium | High | The four tension-causes are named + each has a cure (forcing function, cosmetic/structural split, incremental cycles, branch-merged precondition) |
| Tracer-decoupling (C2) is more involved than a config flip | Medium | Medium | C2 is reviewer-gated (sentry-expert + architecture); exact exporter wiring is execution-time design, not pre-committed |
| Sink-enum drift (ADR vs code) causes confusion | Low | Low | C5 explicitly reconciles ADR-171's enum with the live sink-registry |
| Parallel writers race the migration | Medium | Medium | Execution-precondition: relevant branch merged; incremental per-consumer cycles minimise the window |

## Foundation Alignment

- **principles.md** — replace-don't-bridge applies to the END state (the
  transitional bridge is ADR-171-sanctioned and is deleted in C5, not kept).
- **testing-strategy.md** — TDD cycles each green; C1 is a genuine RED gate;
  conformance/integration level.
- **schema-first-execution.md** — the axes are Zod-validated typed lists driving
  the sink registry.
- **ADR-171 / ADR-162 / ADR-143** — the orthogonal-axes config, the
  observability-first commitment, the structured fan-out.

## Plan-Body First-Principles Check

Per [`plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md):

- **C1 (shape)**: confirm the conformance test asserts a *system state* (telemetry
  persists to a non-Sentry sink), not an implementation detail of the exporter.
- **C2 (vendor-literal)**: verify the OTel tracer/exporter construction shapes
  against the installed `@opentelemetry/*` versions before writing C2.
- **C3 (landing-path)**: confirm the bridge genuinely keeps non-migrated consumers
  green between cycles (no half-migrated red across commits).

## Readiness Reviewers (before DECISION-COMPLETE)

- **assumptions-expert** — proportionality of the re-decomposition + legitimacy of
  the subsumption.
- **sentry-expert** — the span/tracer decoupling (C2) and the bridge.
- **config-expert** — the env-package axes wiring + `.env.example`.
- **architecture-expert** — the sink-routed tracer boundary.
- **test-expert** — C1 as a genuine RED gate; the cosmetic-vs-structural cycle split.
- **docs-adr-expert** — the ADR-143/116/162/163 amendments + whether the foundational
  tension warrants a PDR.

**Review (2026-06-06) — APPROVE-WITH-CONDITIONS** (assumptions-expert + test-expert,
grounded against the directives). Apply before DECISION-COMPLETE:

1. **Merge C1 + C2 into one atomic landing.** The forcing-function conformance test
   and the tracer-decoupling land in ONE commit. The test is locally red against
   current main (proving the gap) but the tree is never left red — a committed-red
   C1 awaiting a C2 green violates the atomic-landing invariant (`tdd-as-design.md`).
2. **Specify C1's level**: in-process integration with a DI-injected console/fake
   sink asserting it receives the span record (network-free, CI-safe) — NOT a
   process-spawn (that would be e2e/smoke, and spawning from an in-process test is
   forbidden).
3. **Reconcile the sink-enum drift BEFORE C3** (consumer migration), not in C5:
   ADR-171 names `console`/`log-file`; live `sink-registry.ts:37` has `file` + the
   un-listed stdout baseline. A mid-migration mismatch would block C3 in CI.

**Review (2026-06-06, round 2 — sentry / architecture / config / docs-adr; Soaring
Darting Cliff). All four READY-WITH-CONDITIONS; RESOLVED + folded by the reshape
below — the plan is DECISION-COMPLETE.** Two load-bearing gaps, now closed in the
re-cut cycles above:

1. **The `SENTRY_MODE` bridge does not exist (decision-complete blocker, grounded).**
   The plan's §Mechanism #3 + C3 assert a transitional bridge "keeps non-migrated
   consumers working." The live code does the opposite: `refineLegacySentryMode`
   (`packages/core/env/.../observability-refinements.ts:79-93` — NOT
   `env-resolution` as the plan and ADR-171 §Decision 3 both say) **hard-rejects**
   any `SENTRY_MODE`. ADR-171 §Decision 3 mandates the bridge, so the cure is to add
   an explicit **bridge-construction step** (map `SENTRY_MODE`→axes in env-resolution,
   upstream of the hard-fail) sequenced BEFORE C3. → **Resolved**: C2b builds the
   bridge before C3 (§Mechanism #3, §Workstreams, `todos`).
2. **C2 span-decoupling needs an exporter strategy (named checkpoint, possible ADR
   touch).** `trace.getTracer()` returns a no-op unless a `TracerProvider` is
   registered (Sentry's `init()` does this today). `@opentelemetry/sdk-trace-node`
   is NOT a dependency. Architectural-excellence forces the answer (principles.md
   §Architectural Excellence): a Sentry-hosted provider only works while Sentry is
   on, so it cannot deliver "Sentry-off still emits spans" — only a standalone
   `NodeTracerProvider` with per-sink exporters achieves true vendor-independence.
   → **Resolved**: C1+C2 settles the standalone-provider design, adds
   `@opentelemetry/sdk-trace-node`, and amends ADR-171 to sanction it.

Foldable conditions (apply during the reshape):

- **Plan-body contradiction**: `todos[4]`/§Workstreams still place enum
  reconciliation at C5; condition 3 above says before C3. Move it in the body.
- **`.env.example` hazard (live now)**: both `.env.example` files set
  `SENTRY_MODE=off`, which hard-fails against the new schema. Enumerate the new
  `OBSERVABILITY_SINKS`/`FIXTURES`/`FILE_PATH` entries for C5 and flag the hazard.
- **C5 ADRs already amended**: 143/116/162/163 carry 2026-05-10 notes; reword C5
  from "amend" to "verify-and-complete the post-migration state."
- **`HttpObservability.fixtureStore: FixtureSentryStore`** is a Sentry-specific type
  on the vendor-neutral interface — decide at C3/C4 whether it moves to a narrower
  capabilities surface.
- **C5 grep scope**: exclude (or explicitly treat) test-helper pinned `SENTRY_MODE`
  literals, e.g. `auth-error-test-helpers.ts:52`.
- **Foundational tension**: docs-adr verdict — plan-body capture is sufficient; no
  PDR/ADR amendment warranted.

All resolved + folded into the re-cut cycles (C1+C2 atomic + standalone provider;
C2b bridge + enum; C3 premise now met; C4 fixtureStore; C5 reword/grep-scope/.env).
**Plan is DECISION-COMPLETE 2026-06-06.** Execution stays owner-scheduled and gated on
the relevant feature branch(es) being merged (no parallel-writer race).

## Execution Preconditions

Execution starts when the owner schedules it, and when: (1) the relevant feature
branch(es) are merged (no parallel-writer race); (2) the C1 forcing function exists
(here or via the conformance plan). Authoring this plan satisfies the damaged
plan's "name the tension + re-decompose" preconditions; the remaining preconditions
gate execution, not authoring.

## Lifecycle Triggers

Per [`components/lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):
register active areas before edits (the env package, `core/observability`, the app
composition roots); run lifecycle touch points at each cycle land.

## Learning Loop

On completion/milestone/archival run `oak-consolidate-docs`: archive this plan and
the subsumed damaged plan per ADR-117; update the completed-plans index; mine the
"forcing-function-for-a-no-functional-gate migration" lesson into a pattern if it
recurs.

## Connection to the MCP Smoke Harness / EEF D7

**This plan does NOT block the EEF work.** The EEF validation accepts an initial
harness run with the Sentry sink **disabled**, asserting EEF *behaviour* (real tool
results, structuredContent, verbatim corpus values, non-claim language, graceful
collapse). Sentry/telemetry for the EEF path is validated **post-release by
inspecting live Sentry data in production**, not in the harness run.

What this plan changes is later and independent: with the span/tracer decoupled from
`mode === 'sentry'` (C2), a future harness run *could* assert span telemetry on the
stdout/console baseline with Sentry off. That is a benefit, not a prerequisite — the
EEF path ships and is validated without it. **Ship-independent, coordinate-dependent**
applies in the un-coupled direction: EEF ships on its own path; this decoupling lands
on its own path; neither gates the other.

## First Question

**Could it be simpler without compromising quality?**

Yes, and that is the design: a linear five-cycle sequence with one forcing function,
incremental per-consumer migration via the ADR-sanctioned bridge, and the cosmetic
renames quarantined from the structural decoupling. The damaged plan's complexity
came from one over-constrained atomic landing with no gate; the simpler shape that
is also correct is small green cycles driven by a failing conformance test.
