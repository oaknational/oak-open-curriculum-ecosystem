---
status: future-strategic
domain: agent-tooling
lineage:
  serves_thread: agentic-engineering-enhancements
  derives_from:
    - .agent/reports/agent-tools-encoding-guard-and-architecture-2026-06-29.md
    - .agent/reports/agentic-engineering/agent-tools-architecture-state-and-check-encoding-handoff-2026-06-29.md
---

# Agent-tools architecture standard (and the encoding capability as its reference implementation)

**Status:** FUTURE — strategic brief. Owner-deferred to a dedicated session (2026-06-29):
*working now, architectural excellence later.* Not executable until the WS0 decision is made.

**Evidence:** the two reports named in `lineage.derives_from` (architecture analysis + Callisto lifts
Perigee's state-and-assumptions handoff). Do not restate their findings here — cite them.

## Problem and intent

`agent-tools/` has **no explicit architectural standard**. Invocation (built-`node`-`dist` topics vs
`tsx`-on-source checks vs build-then-`dist` gates), error handling (exit codes vs `throw` vs
`@oaknational/result`), which workspace packages a tool may depend on, and how repo-wide gates are
wired and ordered are all **inconsistent and undesigned** — the owner's diagnosis: *"a real problem,
a lack of architectural direction on agent-tools, and a horrible lack of consistency, design
decisions that were simply never made."*

**Who it harms and how.** Agents are the workspace's users (PDR-111). Absent a standard, an agent
under friction reasons by analogy from a *flawed* sibling and propagates the flaw — the worked
instance is the `check-encoding` build wiring, where copying the `skills:check` precedent re-tripped
ADR-178's `pnpm.*build && .*node.*agent-tools.*dist` verification grep and added a redundant rebuild.
There is no answer to basic questions: *should a tool run from source or `dist`? is the Result
pattern required at CLI entry points or are exit codes the convention? may a gate depend on a built
package, and if so how is the build guaranteed?*

**Intent.** Make the conventions explicit and **enforced** (the owner's "absolute adherence"), and
make the encoding capability the first tool that fully embodies them — its pure detection engine at
the lowest general layer, consumed by two permanent thin surfaces.

## End goal, mechanism, means

- **End goal.** `agent-tools/` is coherent: one documented answer to invocation / error-handling /
  dependency / gate-wiring, enforced structurally so it cannot silently drift; the encoding
  capability prevents byte corruption at both the all-platform gate and the where-supported hook.
- **Mechanism.** A standard is a *decision* (WS0) recorded as an **ADR** (WS1, the SSOT); structural
  enforcement (WS2) makes adherence absolute rather than aspirational; the encoding engine→core
  refactor (WS3) is the reference implementation that proves the standard; convergence (WS5) brings
  the rest of the workspace into line incrementally.
- **Means.** The workstreams below.

## Workstreams (sequencing; `blocking` unless noted)

- **WS0 — Decide the execution/dependency model (BLOCKING; the keystone fork).** This is the decision
  the owner deferred; everything depends on it. Principal candidates, with the trade-off each carries:
  - **A — source-condition exports + uniform `tsx`.** Internal packages expose a `development`/`source`
    export condition (as `@oaknational/result` already does) so in-repo tooling resolves to *source*;
    every command runs uniformly via `tsx`, no build needed. Dissolves the whole "ran before build"
    class (including the "no statusline in an unbuilt worktree" issue). Cost: a cross-cutting change to
    every internal package's export conventions.
  - **B — uniform built `dist`.** Every command runs from `dist` (ADR-178's direction extended to all
    tools, gates included); build is a separate explicit step; a missing `dist` errors clearly. Cost:
    couples every invocation to a build.
  - **C — principled hybrid.** Frequently-invoked session CLIs from `dist` (ADR-178 as-is); gates run
    source-via-`tsx` after the chain build (retiring the build-prefix and the grep tension); the rule
    names which-when. Cost: two modes to learn, but each justified.

  Resolve via the architecture reviewers (`architecture-expert-fred/-betty/-barney/-wilma`) and
  `assumptions-expert`. Frame the decision against ADR-178's *rationale* (drift in frequently-invoked
  session CLIs) versus a once-per-check gate, which behaves differently.

- **WS1 — Author the standard as an ADR (depends on WS0).** Consolidate and extend the existing
  partial decisions — [ADR-178][adr178] (build isolation), [ADR-168][adr168] (workspace script rules),
  [ADR-041][adr041] (workspace structure), [ADR-159][adr159] (per-workspace vendor CLI ownership) —
  into one explicit standard covering: the invocation model (from WS0); one error-handling convention
  (Result everywhere vs exit-codes-at-the-boundary-with-Result-internally); permitted workspace
  dependencies; test-artefact placement (no `*.test.js` in `dist`); gate wiring and ordering; and
  **where a pure, consumer-general mechanism lives (a `packages/core` package) versus an Oak-repo
  policy (agent-tools)** — the framework/consumer split from `principles.md`.

- **WS2 — Structural enforcement (depends on WS1; "absolute adherence").** Encode the standard in
  ESLint architectural rules / dependency-cruiser / repo-validators / the `config-expert` gate so a
  violation fails a gate, not a review. New ESLint rules start at `warn`, escalate to `error` as a
  separate later step (`feedback_new_eslint_rules_start_warn`). Crosswalk
  [`../../agentic-engineering-enhancements/current/architectural-enforcement-adoption.plan.md`][enf].

- **WS3 — Encoding engine → `packages/core` (the reference implementation; depends on WS1).** Extract
  the pure detection engine (`check-encoding-helpers`, `-tables`, `-types`, and the pure severity
  roll-up predicates) to a new `packages/core/<name>` built like `@oaknational/result` (`tsup` →
  `dist`, `development` export condition). `agent-tools` `check-encoding` becomes a thin CLI consumer
  (tracked-file scan + `--fail-on` gate + presentation). Resolve the build-prefix / ADR-178-grep
  tension per WS0 — the fix must cover `skills:check` too (it carries the same prefix).

- **WS4 — The Write/Edit hook (depends on WS3; where the platform supports hooks).** Add the encoding
  guard to the hook-policy family (sibling to `check-blocked-content`, run via `run-pretooluse-guard.mjs`
  from `dist`), consuming the core engine. The **gate remains the permanent all-platform floor** —
  hooks are not universal across agent platforms (owner-confirmed); the hook is an additional
  authorship-time prevention layer where available. Crosswalk [`hooks-portability.plan.md`][hp] and
  [`hook-policy-typescript-and-schema-unification.plan.md`][hptsu]. **Sub-item:** how the
  engine/guard treats files that *legitimately* contain critical bytes (incident docs, test
  fixtures) — an allow-by-construction mechanism, never edit-to-green.

- **WS5 — Converge the existing tools (depends on WS1+WS2; incremental, TDD, per-tool).** Bring the
  rest of `agent-tools` to the standard: the `tsx`-vs-`dist` sibling inconsistency (including
  `skills:check`), test-artefacts-in-`dist`, and naming/placement (`check-encoding` in `src/encoding/`
  vs the `validate-*` / `src/validators/` sibling convention). Include the **tracked parser-migration
  debt** (2026-06-29, the #282 CPD extraction): `branch-touched-files/cli.ts`, `pr-watch/cli.ts`, and
  `spawn/cli-args.ts` still carry the generic arg-parser pattern that `session-metadata` +
  `context-cost` already migrated onto `core/cli-arg-parser` — migrate them in a later PR. Include
  `src/corpus-analysis/` — built deliberately library-only (no CLI / gate / husky wiring,
  convention-stable: schema-first zod, Result, vitest) precisely to stay clear of the undesigned CLI
  surface; it must conform once the standard lands (its CLI/driver shape is the cross-lane dependency
  the corpus-analysis-conservation plan's WS-C defers to this plan's WS0). Crosswalk
  [`agent-infrastructure-coherence-audit.plan.md`][cca] (artefact coherence — a complementary axis,
  not this one), [`../current/agent-tools-cli-ergonomics.plan.md`][clierg], and
  [`../current/agent-tools-test-io-compliance.plan.md`][tio].

## Domain boundaries and non-goals

- **Not** the artefact-coherence audit (command/skill/adapter single-consumer + three-layer model) —
  that is [`agent-infrastructure-coherence-audit.plan.md`][cca]'s axis; this plan is the **code**
  architecture of the TS workspace. They are complementary; do not merge them.
- **Not** a big-bang rewrite — convergence (WS5) is incremental, per-tool, TDD.
- **Not** building the hook before the standard and the engine extraction exist.
- **Not** this session. The encoding tool already works and is gated green; this is the deferred
  excellence pass.

## Strategic acceptance criteria and success signals

- ADR-178's verification grep is **empty** (no build-prefix gates remain) — and `skills:check` is
  resolved, not just `encoding:check`.
- A single ADR answers invocation / error-handling / dependency / gate-wiring, and a gate fails on a
  violation of it.
- The encoding detection engine lives in `packages/core` with two thin consumers (the all-platform
  gate and the where-supported hook); neither reimplements detection.
- Existing agent-tools are either converged to the standard or carry a recorded disposition (the
  "apply all of X" ledger discipline — every tool gets a decision, work is sized to unique substance).

## Risks and unknowns

- **WS0-A (source conditions) is cross-cutting** — it touches every internal package's exports and
  interacts with build-order assumptions (the worktree statusline issue is one). Mis-scoped, it could
  destabilise more than it fixes.
- **WS0-B (uniform dist)** keeps the invocation-couples-to-build cost the owner already flagged.
- The error-handling unification (Result vs exit-codes) touches ~26 Result-using files plus the
  exit-code/`throw` tools; the migration must be staged, not big-bang.

## Promotion trigger (`future/` → `current/`)

The owner-scheduled agent-tools architecture session opens, OR the next agent hitting the same
build-order / invocation-inconsistency friction. Promotion begins by running WS0 (the decision pass)
with the architecture reviewers; record the verdict, then author the `current/` executable plan from
WS1 onward. Execution decisions finalise only at promotion — the workstream detail above is reference
context from completed analysis, not an in-progress commitment.

[adr178]: ../../../../docs/architecture/architectural-decisions/178-agent-tools-build-isolation.md
[adr168]: ../../../../docs/architecture/architectural-decisions/168-typescript-6-baseline-and-workspace-script-architectural-rules.md
[adr041]: ../../../../docs/architecture/architectural-decisions/041-workspace-structure-option-a.md
[adr159]: ../../../../docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md
[enf]: ../../agentic-engineering-enhancements/current/architectural-enforcement-adoption.plan.md
[hp]: hooks-portability.plan.md
[hptsu]: hook-policy-typescript-and-schema-unification.plan.md
[cca]: agent-infrastructure-coherence-audit.plan.md
[clierg]: ../current/agent-tools-cli-ergonomics.plan.md
[tio]: ../current/agent-tools-test-io-compliance.plan.md
