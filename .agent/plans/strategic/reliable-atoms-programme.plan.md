---
id: reliable-atoms-programme
node_type: strategic
name: "Reliable atoms — the estate's fundamental building blocks at engineering excellence"
overview: "Factor the estate's fundamental code, data structures, algorithms, and patterns into small single-responsibility core modules with strict public APIs, extensive TSDoc carrying positive and negative examples, behavioural and performance test suites — utterly reliable atoms, brought to true engineering and developer-experience excellence."
status: sketch
serves: TOOLS-2
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on:
  - plan: survey-machinery-deconstruction
    kind: beneficial
owner_gates: []
tickets: []
last_updated: 2026-08-17
---

# Reliable atoms programme

## Outcome

The owner's direction, verbatim (2026-08-17): "where we can factor out
code, data structures, algorithms, patterns, into small, single
responsibility, well tested, well encapsulated modules, with a strict
public API, and put those in the core, I want us to do that, each one
with extensive TSDoc, including multiple positive and negative
examples... all the most fundamental building blocks standardised and
brought up to a level of true engineering and developer experience
excellence... performance tested."

The world this node reaches: a committed **atom register** enumerates
the estate's fundamental building blocks; every registered atom meets
the excellence bar below, provable by a conformance instrument, and
every candidate not yet at the bar is a named register row with a
disposition — never an unrecorded aspiration.

## The bet

Reliability compounds at the atom tier: the frame's own law is that a
lower layer's fan-out multiplies a defect's blast radius, so the atom
tier is the cheapest place in the estate to buy correctness once and
inherit it everywhere. For a workforce that is primarily AI agents the
leverage doubles: agents read TSDoc at the moment of use, so a negative
example (this misuse, this failure) closes a misuse class that no
convention or review vigilance reliably closes; a perf budget makes a
regression visible at the layer where it is a one-function fix.

This drive is deliberately tangential to the workspace-basis and
reorganisation questions (the owner's words: "creating utterly reliable
atoms, rather than designing the conceptual space") — an atom's
excellence is location-independent, and this node is robust to any
basis ruling: atoms land in today's `packages/core/` strata and move
wholesale if the conceptual space later renames their home.

## The bar

The per-atom checklist is the ratified excellence contract
(`.agent/reports/typescript-estate-consolidation-review/foundational-building-blocks-frame.md`
§"Excellence contract for a future core package": one responsibility,
small total API, provider-neutral, Result-based failure, TDD with
mutation testing, packed-form smoke proof, README, removal condition),
extended and refined by the owner's directive plus the four-lens
adversarial exploration of 2026-08-17
(`.agent/research/atoms-excellence-exploration-2026-08-17.json` — the
record; every element below carries its innovation-speed warrant
there). The extensions, each with its enforcing instrument:

1. **Executed examples, proportional to hazard.** Every example in
   TSDoc is machine-verified: positives extracted, compiled, and run;
   negatives asserted (`@ts-expect-error` fixtures for the
   compile-error class, executed assertions on the named Result error
   for the runtime class). Coverage is keyed to symbol kind and
   misuse class — behavioural symbols carry positive and negative
   examples for their real misuse classes; vocabulary constants and
   trivial type arms are exempt (a fixed per-symbol quota generates
   filler that taxes agent context windows — the exploration's
   measured case: a 74-symbol atom would owe ~296 examples).
2. **A misuse register per atom, graduating to types.** Every named
   misuse class is classified: closed-by-types (proven by a
   `@ts-expect-error` fixture), closed-by-lint (a named rule — e.g.
   the estate-wide must-use-Result rule this programme adds), or
   documented-only with the reason structural closure is impossible.
   The register's ambition: documented-only shrinks over time.
3. **Type-level proof.** Atoms whose contract is partly or wholly
   type-level carry type tests (`expectTypeOf`/`assertType` positives,
   `@ts-expect-error` negatives) — the one proof class no other bar
   element can observe; mutation tooling cannot mutate types, so the
   mutation mandate is keyed to runtime mutant population and
   type-only atoms are exempt from it, never from type tests.
4. **Committed, diffed API report.** Each atom's public surface rolls
   up into one committed report file, drift-gated in CI — every
   surface change is a visible, reviewed diff, and the report is the
   one-file token-cheap contract an agent reads. Packed-form proof
   runs as ONE shared instrument (exports-map and types-resolution
   checks, publint/arethetypeswrong-class) with a Windows leg for
   path-sensitive atoms — never per-atom bespoke scripts.
5. **Typed error discriminants as contract.** The `E` in every public
   `Result<T, E>` is a discriminated union with a stable code;
   negative-path tests assert the discriminant and cause chain;
   message text is presentation, explicitly non-contractual.
6. **Performance proof where a performance contract exists.** Atoms
   declaring a complexity/throughput contract carry benches proving
   the growth curve within-run (never wall-clock across CI runs —
   shared-runner noise makes cross-run fences fire falsely and die
   under no-warning-toleration); O(1) wrapper atoms carry none.
   Bench code lives outside the source read path.
7. **Zero runtime dependencies by default.** Each register row
   declares its runtime-dependency budget (default: none); the
   conformance instrument fails on any undeclared runtime dependency
   — a new dependency at the atom tier is a visible register diff,
   never a silent manifest edit.
8. **Structural fences on the core itself**: a grab-bag fence (export
   count and responsibility-phrase checks against the lodash failure
   mode), a recomputed consumer count per atom with automatic
   demotion-to-review at zero fan-out (orphaned-utility fence), and
   an executable deprecation ladder so removal conditions actually
   fire (doc-flag → lint-flag → removal across releases).
9. **One retrieval surface per fact.** TSDoc is the single source for
   API and examples; the README hand-authors only what TSDoc cannot
   carry (purpose, placement, troubleshooting, removal condition);
   generated or surface-diffed elsewhere. Cross-platform proof runs
   as a conditional CI matrix leg for register-flagged
   platform-sensitive atoms only.

## Mechanism

- **Atom register first**: candidates enumerated from the existing
  `packages/core/*` members (brought up to the bar, not grandfathered),
  the census's generic-foundation rows, measured independent clusters
  (e.g. the pure image-mathematics slice), and — when the
  machinery-deconstruction ledger (MCP-603) lands — its
  construct-scale `generalises-to` rows. The register is a committed
  artefact storing only non-recomputable human facts (identity, the
  one-line contract sentence, exact import specifier, misuse-register
  pointer, gate blockers, owner rulings, dependency budget, platform
  and performance-contract flags); at-bar status is COMPUTED by the
  conformance instrument at check time, never a stored column — and
  the register doubles as the agent discovery index, so "does an atom
  for this exist" is one read.
- **Gates hold; the directive sets ambition**: the frame's ten-gate
  promotion test still filters what becomes core. Where a would-be
  atom fails a gate today (typically the multiple-real-consumers
  gate), it is registered as a candidate-in-waiting and the batch's
  gate conflicts route to the owner at a card — the standing direction
  is read as raising priority and the excellence bar, never as
  deleting the gates. The owner may override per batch.
- **Conformance instrument at tranche one**: a validator that
  RECOMPUTES the bar — per-symbol TSDoc example-pair coverage, bench
  presence, export-surface strictness, packed smoke — so atom status
  is falsifiable structure, never a claim. Benchmark harness selection
  is verified against current vendor documentation at the first
  tranche's authoring, not prescribed here.
- **Per-tranche delivery nodes at pickup**, each a small-PR series
  (one atom or one coherent family per PR), declaring
  `serves: reliable-atoms-programme` — enumerate them by search,
  never a hand-kept list.

## Success looks like

- The atom register exists, is committed, and every row carries a
  disposition (at-bar / candidate / in-waiting with its gate blocker).
- The conformance instrument is green over every at-bar row, and its
  checks are recomputed, not recorded.
- Every existing `packages/core/*` member either meets the bar or
  holds a register row naming exactly what it lacks.
- Not claimed: performance optimisation beyond budget fences; any
  workspace-architecture outcome (the basis drive owns that space);
  extraction completeness — the register grows as the ledger and the
  landscape survey land, and rows are cheap.

## Delivery

Delivery plans serving this node declare
`serves: reliable-atoms-programme` and are authored by their
implementers at pickup. The first tranche's natural shape: the
register + the conformance instrument + one exemplar atom brought to
the full bar (proving the bar is reachable and the instrument honest)
— the exemplar chosen for high fan-out and small surface. Milestones
live in Linear; this node points, never mirrors.
