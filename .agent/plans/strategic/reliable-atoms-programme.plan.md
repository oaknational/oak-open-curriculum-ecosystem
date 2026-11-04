---
id: reliable-atoms-programme
node_type: strategic
name: "Capability Foundations — small completed capabilities and purposeful composition"
overview: "Finish small independent Primitives and compose them into complete Components and Subsystems, with strict public APIs, proof, tests, mutation, performance evidence and documentation for each supported contract."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-09-08
ratified_where: "Owner cards 2026-09-08 via the Director seat (Flounder turns Estuary, c5cc2c): 'Ratify all six' over the six strategic sketches, then the owner's word 'land the reliable atom ratification in it's own PR, now' — both quoted in the body of the pull request from docs/reliable-atoms-ratification-2026-09-08 to engraph"
serves: TOOLS-2
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on:
  - plan: survey-machinery-deconstruction
    kind: beneficial
owner_gates: []
tickets: []
last_updated: 2026-10-10
---

# Capability Foundations programme

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

### Owner direction — 8 September 2026 amendment

The owner established the implementation-origin policy for graph and
non-graph algorithms and data structures: author our own SMALL Reliable
Atoms and meaningful layers of composition, learning from the best openly
licensed examples. [ADR-230](../../../docs/architecture/architectural-decisions/230-own-built-algorithm-and-data-structure-foundations.md)
records the decision; the [governing development policy](../../../docs/architecture/foundations/algorithms-and-data-structures-governance-2026-09-08.md)
owns its scope, reference-research method and relationship to qualification.
This dated amendment refines how the ratified programme develops its
foundations. The owner requested documentation and a draft PR on the same
date; implementation and qualification remain delivery work.

### Owner direction — 14 September 2026 amendment

The owner bound the SHAPE of the workspaces that hold Reliable Atoms,
verbatim: "I want the workspaces containing the Reliable Atoms to be
subject to the max number of files per directory validator … I was
thinking max 5 typescript files per directory, max 7 files of any
kind, and probably some tweaks as we discover edge cases … I am not
expecting one 'Reliable Atoms' workspace, I am expecting that to be a
class of workspace, and to have some sensible grouping of Atoms with a
given workspace." The same day: "I want the other length and
complexity constraints _stricter_ for Reliable Atoms than for other
code, and if there are other type[s] of length or complexity or clarity
or related constraints we could add, I want them added"; and, on the
mechanism, "we decided NOT to do it with ESLint, it clearly should be a
validator, and the unused ESLint rule should be deleted … this is not a
job for a test, and therefore not a job for Vitest."

Four consequences, each recorded in its durable home:

- **A declared workspace class.** Workspaces holding Reliable Atoms are
  a class — several workspaces, each grouping atoms by cohesion (the
  architecture's §9 rule: boundaries follow cohesion, explicit
  dependencies, platform needs, release responsibility and useful
  consumption; one atom per package is not a default). Membership is
  declared on the workspace, never inferred from a name or a path
  (validation-strategy §Validation jurisdiction).
- **Directory cardinality is a blocking budget for the class.** The
  check is a repository validator in the estate's validator framework,
  recomputed from the tracked tree — never an ESLint rule (a per-file
  AST rule is the wrong instrument for repository topology) and never a
  test (a test proves product behaviour; a validator proves a
  structural invariant of the repository). The unregistered ESLint rule
  is deleted. [ADR-166](../../../docs/architecture/architectural-decisions/166-architectural-budget-system-across-scales.md)
  §2026-09-14 amendment records the scale's owner and enforcement
  state; the initial values and their edge-case calibration ledger live
  in the delivery node that builds the validator (enumerate by
  `serves:`), per ADR-166's rule that thresholds live in executable
  configuration or calibrated child plans, never in doctrine.
- **Every length, complexity and clarity budget binds stricter for the
  class than for the rest of the estate**, and constraints of that kind
  the estate does not yet carry are added for the class first. Bar
  element 10 below names the classes of constraint; the delivery node
  carries the values and the instruments.
- **This binds the container, not the atom's definition.** R01 stays a
  responsibility judgement, never a line count; the caps bound the
  workspace's directories and files so that an atom's home stays small
  enough to read whole. §The bet's location-independence holds: the
  class says nothing about WHERE atom workspaces sit in the tree, only
  what shape they have.

The class is designed to fit its parameters from its first workspace.
No workspace outside the class is a reference population for it: an
existing `packages/core/*` member that does not fit the starting
parameters is, by that fact, not a Reliable Atoms workspace — a special
case recorded as that workspace's own register row, never as an edge
case of the class and never as a reason to loosen a value. Edge cases
are discovered while building atom workspaces and recorded in the
delivery node's ledger at that moment (owner correction 2026-09-14,
after a seat measured a non-atom core workspace against the caps and
began to declare its root an exception). The exploration that produced
this framing is
`.agent/research/reliable-atoms-workspace-shape-exploration-2026-09-14.md`.

### Owner direction — 25 September 2026 receiving amendment

The outcome and investment commitment remain the ratified programme's purpose.
The owner's later Capability Foundations decisions refine its taxonomy and
completion model: independent Primitives, composed Components and Subsystems,
and named Mechanism/Facility roles. The [common architecture](../../../docs/architecture/foundations/reliable-atoms-and-composition-architecture-2026-09-08.md)
owns the grades and assurance bar; the [adoption profile](../../../docs/architecture/foundations/capability-foundations-adoption.md)
owns completion, first-build contracts and data/API criteria. This amendment
receives those decisions without supplying a new ratification stamp for delivery
sketches. The stable plan identity remains unchanged.

### Owner direction — 10 October 2026 programme connection

[ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md)
retains OCE as the full capability innovation framework, with every mechanism and
potentially reusable responsibility in OCE and external app configuration over
published packages. CF construction and extraction are distinct programme
dimensions. Prefer affected CF foundations first without making the full heap,
graph or target-unit catalogue a prerequisite for unrelated work.

The [CF reconstruction account](../../../docs/architecture/foundations/oce-cf-reconstruction.md)
owns this programme's ten existing-core dispositions, bounded first tranche,
qualification/consumption and retirement contracts. The whole-estate CF direction
covers generic, domain, tooling and platform capabilities with named owners;
products remain assembled outputs above CF. Existing grade, origin and assurance
obligations remain in force. The 5 October definite-architecture N proposals are
explicitly unratified, with itemised decision homes; this amendment adds no new
ratification stamp to them or to delivery sketches.

Contract design, release design and thinning in place may proceed in parallel
where their actual prerequisites permit. Applicable automatic enforcement blocks
qualification; supported published package closure blocks independent external
consumption/handover. No handover deadline or quality exception is supplied.
No team timing, workload, throughput measurements or team studies are part of
the programme design or acceptance. Software correctness, performance and
consumed-form evidence retain their proper scopes.

## User groups and value

Engineers and agents consuming the foundations gain small, explicit public
contracts, executable examples and evidence they can use without recovering
private implementation assumptions. Maintainers gain identifiable invariant
owners and focused change boundaries. Capability authors gain reusable
graph and non-graph mechanisms that can compose into new offerings. These
are the programme's offered benefits; their realised value and whole-life
effort savings are assessed through delivered capabilities and subsequent
changes.

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
basis ruling: atoms are authored and qualified wherever their contract
lives. Package placement follows cohesion, explicit dependencies, platform needs,
release responsibility and the repository's workspace rules. The architectural
grade is independent of the physical path; core is not a composition layer.

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
7. **Primitive independence; explicit composed dependencies.** Primitives have
   no peer estate dependency, including type-only or semantic dependencies.
   Components and Subsystems declare their complete dependency closure. Reuse
   canonical Result and classify its consumers as composed; do not duplicate it
   to obtain a Primitive label. Automatic checks cover imports and exposure.
8. **Structural fences on capability boundaries.** Check the complete public
   surface, responsibility, ownership and permitted audiences, including the
   recomputed export-count and responsibility fence. Consumer count is
   not an admission, qualification, publication or retention gate. Removal follows
   a declared contract/lifecycle decision with preserved consumer semantics;
   the executable deprecation ladder makes that decision effective through
   documentation flags, lint flags and removal across declared releases.
9. **One retrieval surface per fact.** TSDoc is the single source for
   API and examples; the README hand-authors only what TSDoc cannot
   carry (purpose, placement, troubleshooting, removal condition);
   generated or surface-diffed elsewhere. Cross-platform proof runs
   as a conditional CI matrix leg for register-flagged
   platform-sensitive atoms only.
10. **Structural budgets on the workspace class** (owner direction,
    2026-09-14 amendment above). Every workspace declaring the class is
    bounded on four axes, each with its instrument: directory
    cardinality — TypeScript files and files of any kind per directory,
    and directory depth — recomputed from the tracked tree by a
    repository validator, blocking; every length, complexity and clarity
    budget the estate lints, at stricter values for the class, plus the
    clarity constraints the estate does not yet lint (naming, explicit
    types on every function, exhaustiveness, readonly by default, no
    magic numbers), at the class's lint tier; a stricter compiler profile
    (indexed-access, optional-property and declaration strictness); and
    mutation-score and coverage thresholds that break. The values and
    the instruments live in the delivery node that builds them, per
    ADR-166's rule that thresholds live in executable configuration or
    calibrated child plans; the doctrine here is the axes and the
    direction of strictness.

## Mechanism

- **Capability record from the first unit**: candidates are drawn from the existing
  `packages/core/*` members (brought up to the bar, not grandfathered),
  owner-directed new capabilities, the census's generic-foundation rows,
  measured independent clusters
  (e.g. the pure image-mathematics slice), and — when the
  machinery-deconstruction ledger (MCP-603) lands — its
  construct-scale `generalises-to` rows. The register is a committed
  artefact storing only non-recomputable human facts (identity, the
  one-line contract sentence, exact import specifier, misuse-register
  pointer, gate blockers, owner rulings, dependency budget, platform
  and performance-contract flags); at-bar status is derived from applicable revision-bound obligations and evidence,
  never an enduring authored status. The record is also the discovery index. Start
  with the selected finite unit and extend it as responsibilities are admitted;
  an exhaustive estate catalogue is not a blocker to the first useful delivery.
- **Scope, qualification and publication have distinct decisions.** Owner-directed
  value establishes scope, including completed definitions and provable contracts
  before application adoption. The full assurance bar establishes qualification.
  Cohesion, public consumption, dependency closure, platform and release obligations
  govern package publication. None depends on a second consumer or a fan-out quota.
- **Finish complete supported contracts.** The initial investment closes definition,
  implementation and evidence. New functionality is a new scope; defects reopen the
  affected claim. Reuse completed lower guarantees and valid evidence as composition
  advances, rather than repeatedly reopening their private mechanisms.
- **Required evidence connection in the first tranche**: bind the smallest
  shared instrument needed by the selected geometry contract, including production
  correspondence, complete boundary enforcement and real consumed-form evidence.
  Recompute applicable obligations from exact subjects and receipts; file/bench
  presence and a packed smoke check alone cannot qualify a capability. Preserve
  mathematical, test, mutation, type, performance and documentation warrants
  separately. Verify concrete tooling interfaces at slice pickup, rather than
  building an unbounded general assurance platform before the first unit.
- **Per-tranche delivery nodes at pickup**, each a small-PR series
  (one atom or one coherent family per PR), declaring
  `serves: reliable-atoms-programme` — enumerate them by search,
  never a hand-kept list.

## Success looks like

- The atom register exists, is committed, and every row carries a
  disposition (Qualified for its exact scope, or candidate with required obligations open).
- The conformance instrument is green over every at-bar row, and its
  checks are recomputed, not recorded.
- Every existing `packages/core/*` member either meets the bar or
  holds a register row naming exactly what it lacks — including, since
  2026-09-14, whether it fits the workspace class's shape; one that
  does not is outside the class until reshaped, and is never evidence
  about the class.
- Every workspace declaring the class passes the class validator and
  lints, compiles and mutates at the class tier; the delivery node's
  edge-case ledger holds only cases met inside the class.
- Not claimed: performance optimisation beyond budget fences; any
  workspace-architecture outcome (the basis drive owns that space);
  extraction completeness — the register grows as the ledger and the
  landscape survey land, and rows are cheap.

## Delivery

Delivery plans serving this node declare
`serves: reliable-atoms-programme` and are authored by their
implementers at pickup. BinaryTreeIndices is the first target capability, with
required admission/outcome prerequisites closed before qualification; the
composed BinaryHeap is the first useful endpoint. Admission, storage and order
close their own contracts before repairs rely on them. Data/API deliveries select
their actual dependency closure rather than treating the entire catalogue as a
prerequisite. Milestones live in Linear; this node points, never mirrors.
