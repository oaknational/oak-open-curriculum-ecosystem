---
name: "Foundations Before Consumers in Multi-Emitter Plans"
use_this_when: "sequencing a plan with N parallel consumer lanes that share a foundation (a schema contract, an ESLint rule, an extracted core). The foundation must land in an earlier wave than any consumer that depends on it, or every consumer retrofits."
category: process
proven_in: ".agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md \u00a7Phase Structure; .agent/plans/observability/high-level-observability-plan.md \u00a7Execution Waves; .agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md \u00a7Post-Phase-5 Execution Plan. Reshape landed 2026-04-19 in commits 7f5b18e7 + 2e8a140d."
proven_date: 2026-04-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "emitters / consumers / callers landing before the shared contract that governs them, guaranteeing retrofit when the contract lands"
  stable: true
related_pattern: warning-severity-is-off-severity.md
---

# Foundations Before Consumers in Multi-Emitter Plans

When a plan has multiple lanes that all depend on a shared foundation
— a schema contract, a compile-time gate, an extracted core package,
a validation helper — the foundation lands in an earlier wave than any
lane that depends on it. Landing the foundation alongside or after its
consumers guarantees retrofit: every consumer's tests and call sites
get written against ad-hoc shapes and then rewritten when the
foundation appears.

## Pattern

A multi-lane plan with shared dependencies composes into waves:

| Wave | Contains |
|------|---------|
| Wave N | The foundations — schemas, ESLint rules, extracted cores, shared helpers, release linkage. |
| Wave N+1 | The first set of consumers that import Wave N's surfaces. |
| Wave N+2 | Consumers that depend on Wave N+1 (e.g. widgets that depend on both shared schemas and adapter libraries). |

Three concrete sub-principles that compose into the pattern:

1. **Schemas before emitters.** If K emitters each call `log(event)`
   where `event` is a shape defined by a schema workspace, authoring
   the schema workspace is the gate. Emitters that land before the
   schema exists emit through placeholder shapes and retrofit when the
   schema lands.
2. **Rules before code.** If an ESLint rule polices the shape of new
   code (emission coverage, import boundaries, error cause chaining),
   the rule lands before the code it polices. Code written under
   "rule coming soon" accumulates violations that become a migration
   backlog on rule landing.
3. **Extracted cores early.** If two or more workspaces will share an
   extracted core (redaction barrier, telemetry helper, validation
   utility), the extraction runs before any consumer imports from it.
   A core extracted mid-flight forces every consumer to refactor its
   imports and tests.

## Anti-Pattern

Ordering lanes purely by historical sequence ("we planned X first,
so X lands first") when X depends on Y and Y was added later. The
original ordering ages; the dependency direction does not.

Concrete anti-pattern in this repo pre-reshape: the observability
maximisation plan had lanes L-1 (free-signal integrations with
envelope-observability prereq), L-3 (request context enrichment),
L-4b (metrics.* adapter), L-9 (feedback MCP tool) all emitting events
that the events-workspace schema would govern. The events workspace
sibling plan landed in a separate `current/` plan, conceptually a
peer. Running all four emitters before the events workspace would
have produced four sets of fixtures emitting through ad-hoc shapes,
then four sets of fixture-rewrites when the schema landed.

Symptoms:

- A plan whose acceptance criteria for later lanes include
  "refactor tests to use the schema from plan Q" — that acceptance
  is the retrofit.
- Multiple lanes with the same fixture drift surfaced in reviewer
  findings at phase close.
- The same ESLint rule being added at `warn` severity in Wave N and
  then flipped to `error` in Wave N+2 after a backlog migration —
  the migration backlog exists because the rule did not land in
  Wave 1 ahead of the code.

## The Correction

Before sequencing a multi-lane plan, enumerate:

1. The **foundations** each lane depends on (schemas, rules, cores,
   helpers).
2. The **dependency direction** between foundations and lanes.
3. The **wave number** each foundation should occupy.

Then assign lanes to waves such that every lane's foundations sit in
a strictly earlier wave. If two lanes need the same foundation,
co-locate them in the same downstream wave. If a lane spans two
surfaces at different abstraction layers (e.g. an "initial" slice
that extracts a core and a "final" slice that uses it), split the
lane across waves.

Test the ordering: for each lane, ask "can this lane's RED tests
compile against the foundations present at wave-open?" If the answer
is "no, I'd have to stub or mock the foundation", the lane is in the
wrong wave.

## Evidence

**2026-04-19 observability reshape**. Pre-reshape, the observability
maximisation plan ordered lanes by their L-N number (historical
draft order). Post-reshape (commits 7f5b18e7 + 2e8a140d), lanes
regrouped into five execution waves:

- **Wave 1** — Gates & Foundation Extractions (ESLint rules +
  extracted telemetry-redaction-core + L-7 release linkage + ADR-162
  Accepted flip with `require-observability-emission` rule at warn).
- **Wave 2** — Schema Foundation (events workspace + vendor-
  independence structural lint).
- **Wave 3** — Primary Emitters (L-1, L-2, L-3, L-4b, L-9 — all
  importing Wave 2 schemas at write-time).
- **Wave 4** — Cross-axis & Widget (L-12 + security-observability
  + accessibility-observability).
- **Wave 5** — Operations + Conformance + Close-out.

Owner-approved architectural rationale recorded in
`.agent/plans/observability/high-level-observability-plan.md`
§Execution Waves. The reshape is the settled form; pre-reshape
orderings are archived only.

## When to Apply

- Designing a plan where multiple lanes share a foundation surface.
- Reviewing a plan with N emitters of the same event shape and asking
  whether the shape definition lands first.
- Before authoring TDD-RED tests in any lane: confirm the
  foundations the lane imports exist at wave-open.
- When a reviewer recommends "add an ESLint rule for this" on a lane
  that would retrofit existing code: the rule should land in an
  earlier wave, not in the current one.

## Related Patterns

- `warning-severity-is-off-severity.md` — companion principle on the
  temporal dimension: rules that land at `warn` are effectively off
  until flipped to `error`. Foundations-before-consumers + warn→error
  flip is the natural sequence: rule at warn in Wave N, enforcement
  at error in the wave that closes the backlog.
- `verify-before-propagating.md` — same discipline at the claim
  layer: foundations (primary sources) before citations
  (propagating claims).
