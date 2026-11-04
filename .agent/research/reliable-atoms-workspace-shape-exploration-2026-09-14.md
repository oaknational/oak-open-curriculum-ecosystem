# Reliable Atoms workspace shape: concept exploration (2026-09-14)

**Kind**: concept-exploration record (the `concept-exploration` skill's four
movements, with `reason` and `metacognition` applied), owner-directed, one
seat, documentation only. **Warrant home for** the Reliable Atoms programme
node's 2026-09-14 amendment and its bar element 10, and for the delivery node
`reliable-atoms-workspace-shape`. Nothing here is implemented; every value
below is the owner's stated starting parameter or a proposal marked as such.

## 1. The raw observations

- The owner's three notes of 2026-09-14, verbatim in the programme node's
  amendment: workspaces holding Reliable Atoms are subject to a maximum
  number of files per directory (initial parameters: five TypeScript files,
  seven files of any kind, "probably some tweaks as we discover edge cases");
  the class is several workspaces, each grouping atoms sensibly; every other
  length and complexity constraint is stricter for the class than for other
  code, and further constraints of that kind are to be added; the check is a
  validator, not an ESLint rule and not a test; the unused ESLint rule is
  deleted.
- The estate already holds a full prior lane on directory cardinality:
  ADR-166 (the budget system across scales, directory row "future enforcement
  candidate"), the 2026-07-15 concept exploration
  (`.agent/reports/architectural-fitness-functions-concept-exploration-2026-07-15.md`),
  its re-founded child plan in the July backlog, and an implemented,
  unregistered ESLint rule that needs a caller-supplied inventory and emits
  nothing without one. The July record's finding four already placed
  repository concentration in the validator framework and syntax-local
  invariants in ESLint; what it left open was the owner's ratification of
  signal-versus-invariant semantics, and it framed count-as-diagnosis as
  refuted by a MIXED population (behaviour code beside registries and data
  shapes).
- The programme's own records disclaim workspace-architecture outcomes
  (location-independence, "cedes the space" on repository shape) and its
  architecture record says atom smallness is "a justified boundary rather
  than a line-count target" (R01) and that isolation "does not require one
  file per atom or one package per helper" (§2).
- A seat-side observation, corrected by the owner the same hour: the seat
  measured an existing non-atom core workspace against the caps, found its
  root over the any-kind cap, and began to pre-declare "the workspace root"
  an edge case of the class.

## 2. The problem space

**Kind**: a design decision at the mechanism altitude inside an already
ratified strategy — what shape the container of an atom has, and which
instrument holds that shape. Not a basis question (where atom workspaces sit)
and not a definition question (what an atom is).

**Gap and who it harms.** An atom's excellence is bounded by whether a reader
— an agent at the moment of use — can hold its home whole. A workspace that
lets directories grow without bound lets a small atom hide in a large
neighbourhood; the reader pays the neighbourhood's cost. The programme's bar
bounded the atom (surface, dependencies, examples) but not its container.

**Mechanism.** Complexity migrates upward when only the lower scale is
constrained (ADR-166's founding observation). Function and file limits exist
estate-wide; nothing bounds the directory or the workspace, so the pressure a
small-atom discipline creates lands exactly there.

**Constraints.** ADR-166: thresholds live in executable configuration or a
calibrated child plan, never in doctrine; a check has two stable states,
informational with a named consumer or blocking with deterministic non-zero
failure. Validation strategy: class membership derives from declared
membership, never from name patterns; a check uses the property's real
machinery. Principles: no escape hatches, no exemption menus; strict
everywhere. The programme: R01 stays a responsibility judgement.

**Success.** Every workspace declaring the class fits its caps and lints,
compiles and mutates at a stricter tier, provably by recomputation; the
estate's other workspaces are untouched by the class; a fresh session can
build the instruments from the delivery node alone.

## 3. The solution space, re-opened

Inherited shapes examined and what changed:

- **"Count is a noticer, not a limit" (July 2026).** That finding's
  precondition was a mixed population. The class is homogeneous by
  construction — atoms, their tests, their documentation — so the
  precondition does not hold inside it, and count is a legitimate invariant
  there. Outside the class the July finding stands unchanged; the repo-wide
  report-only signal remains an unratified proposal, not decided by today's
  ruling. Both are true at once; they are scoped by the class declaration.
- **Visibility before enforcement (ADR-166 rollout order).** Its precondition
  is an existing population that needs a baseline. A new class has an empty
  baseline by construction: its first workspace is built to fit. Enforcement
  from the first workspace does not skip the rollout doctrine; the baseline
  step is vacuous. Recorded as an ADR-166 dated amendment for new classes.
- **The existing core packages as the reference population.** Rejected, at
  owner correction. A workspace that does not fit the starting parameters is
  not an atom workspace; its non-fit is a fact about that workspace (its
  register row names what it lacks) and never a fact about the class. The
  seat's fluent move — measure what exists, then bend the new rule around it
  — is exactly the generator ADR-166's anti-gaming rules name from the other
  side (threshold inflation), arriving before the rule was even built.
- **ESLint as the home of "structural" checks.** Principles §Code Quality
  maps structural findings to "an ESLint/boundary rule"; that mapping is for
  syntax-local structure (imports, boundaries, sizes within a file). A
  directory count is a property of the repository tree, invisible to a
  per-file AST rule except through an injected inventory — the July record's
  finding one. The right machinery is the validator framework, which already
  walks the tree for twenty-one other invariants.
- **A test as the home.** A test proves product behaviour through a public
  interface; the directory shape is not behaviour of any product, and a test
  asserting file counts would be an audit of an implementation choice
  (validation strategy: "describe the outcome you want; never audit the
  implementation choice"). Owner ruling: not a job for a test.
- **One atoms workspace.** Rejected by the owner: a class of workspaces,
  atoms grouped by cohesion (architecture §9; the graph architecture's "one
  atom per package is an unjustified default"). The class declaration is
  what makes "several" checkable.
- **How membership is declared.** Location (a directory tier) would tie the
  class to placement, which the programme deliberately leaves to the basis
  drive and ADR-041; the atom register would make membership a side effect of
  a row. A declaration on the workspace manifest is the closed shape: one
  field, read by every class instrument, a reviewed diff to change. Proposed;
  the delivery node carries it.

## 4. Synthesis and proposals

**Understanding.** The programme bounds the atom; the owner has now bounded
its container, as a declared workspace class with its own budgets. The class
is a design target, not a description of what exists: its parameters come
first and its workspaces are shaped to them, so calibration evidence can only
come from inside the class.

Proposals, each with warrant and falsifier (the delivery node carries the
values):

1. **A blocking directory-cardinality validator scoped by the class
   declaration**, recomputed from the tracked tree, with no ignore list and
   no allowlist — the only scoping is the declaration and the git index.
   Warrant: homogeneous population; ADR-166's two-state rule; validation
   strategy's declared membership. Falsifier: an atom workspace built in good
   faith that cannot express one atom's source, tests and documentation
   within the caps without an artificial split — recorded as an edge-case row
   and routed to the owner as a value change, never absorbed as an exemption.
2. **A stricter lint tier, compiler profile and assurance thresholds for the
   class**, composed over the estate's strict tier so the class can only be
   stricter, never different. Warrant: the owner's direction; every value
   derives from the atom's nature (one responsibility, read whole), not from
   any existing code. Falsifier: a class value that the first atom breaches
   for a reason the atom's contract requires (a generic parameter name, a
   readonly-hostile callback contract) — a ledger row, decided at the slice.
3. **Delete the unregistered ESLint rule and its test in their own slice.**
   Warrant: owner ruling; the rule is dead code (unregistered, inventory-
   dependent, silent without one); the replacement is a different instrument,
   so the July condition of replacement-equivalence proof does not apply.
   Falsifier: a live consumer of the rule's exports — a grep at the slice
   proves none.
4. **Record the class in the durable homes and leave the repo-wide signal
   question where it was.** Warrant: ADR-166 owns scale ownership; ADR-230
   owns the programme's repository interpretation; the July child plan must
   not read as if it still governs the class. Falsifier: a reader of the
   July plan arriving at "pending ratification" for the class — cured by the
   dated note that plan now carries.

**Unresolved evidence that could change this.** Whether the first atom
workspace's own tooling manifests fit the any-kind cap at its root is
unknown until one is built; the answer shapes the class's root design (the
shared workspace-config package exists to make a root thin), not the cap. The
depth constraint and the export-count value are proposals without an
instance yet; the first atom is their first test.

## 5. Movement record

Movement one changed the frame from "calibrate a limit" to "bound the
container of a new class". Movement two separated the basis question from
the shape question. Movement three retired four inherited shapes (the mixed-
population finding's reach, the baseline step for a new class, the existing
core as reference, ESLint or a test as the instrument). Movement four
produced four proposals with falsifiers. The pass changed the framing and
altered two proposals the seat held at open (a pre-declared root exemption;
values calibrated against existing code), so it paid its way.
