---
pdr_kind: governance
---

# PDR-058: Three-Tier Optionality Decomposition

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[PDR-014](PDR-014-pattern-routing-discipline.md) (consolidation
flow — this PDR routes optionality-shaped findings into three
distinct surfaces rather than a single fence);
[PDR-026](PDR-026-per-session-landing-commitment.md) (deferral
honesty — outcome-optionality is the inbound shape that produces
deferral-honesty failures);
[PDR-046](PDR-046-layered-knowledge-processing.md) §Move 3
(read repo state — decision-optionality routes to the
empirical-answerability surface);
[PDR-057](PDR-057-empirical-answerability.md)
(empirical-answerability gate — subsumes the decision-optionality
surface).

**Supersedes**: the quarantined `stop-inventing-optionality`
doctrine candidate, recorded alongside `apply-don't-ask` in the
combined quarantine entry
([`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`](../../memory/operational/quarantine/apply-dont-ask-doctrine.md)),
under the 2026-05-01 owner-named reformulation.

## Amendment Log

- **2026-05-29** (Accepted; owner-reviewed): **Surface 4 — Sequencing
  Optionality named, and Surface 3's rule sibling graduated as a merged
  discipline.** The §Decision lead previously listed *sequencing
  optionality* among adjacent candidates that *"may emerge"*; it has now
  emerged with its own diagnostic and cure (sequence-or-admit) and is
  named as Surface 4. Surface 3's outcome-optionality rule sibling is
  graduated — not as a standalone rule file, but as the cure already
  stated in Surface 3 — and the *don't-shoehorn-a-value-claim* sibling is
  recorded as **merged into it** (it is the infrastructure-absent special
  case of the falsifiability cure, one discipline, not two). Both
  Surface 3 and Surface 4 acquire an **active firing layer** at the
  host's authoring-time first-principles check rather than as new
  always-applied rule files, per the host's rule-vs-clause routing
  discipline and the always-loaded directive budget: a passive PDR clause
  alone loses to artefact gravity, so the doctrine fires at the
  plan/acceptance/status authoring moment. §Scope, §Rationale, and
  §Consequences updated for consistency. The decomposition remains open
  to further surfaces (interface optionality, scope optionality).

  - **Falsifiability (Surface 4)**: this surface would be shown wrong if a
    bare optional status (`deferred` with no condition) reliably resumed
    correctly without a named gate or tripwire — i.e. if sequencing added
    no resumption value over bare deferral — or if the
    falsifiable-tripwire-vs-vague-conditional discriminator proved
    unworkable in practice (authors could not distinguish *"when the
    schema migration lands"* from *"when we get to it"*). It would be
    confirmed by deferred items that stall undetected because no condition
    names when they advance.

## Context

The doctrine candidate `stop-inventing-optionality` was proposed in
2026-04 to name a recurring failure mode: agents introducing
optional / configurable / extensible surface in places where a
closed shape sufficed. The candidate accumulated evidence across
multiple categories — fork escalations, schema looseness,
acceptance-criteria hedges — and was queued for graduation as a
single rule.

On 2026-05-01 the owner reframed at session close: the candidate
*"moves in the right direction but not necessarily at the right
layer, level of abstraction, or mechanism"*. The substance hides
**three distinct impacts** behind one label, and the rule shape
follows from the impact. Drafting a single rule before naming the
three impacts would itself instance the failure mode the rule
tried to name (manufacturing one fence where the territory needs
three).

The rethink is the work. This PDR names the three surfaces, their
impacts, and where each routes for governance.

## Decision

**The doctrine candidate `stop-inventing-optionality` decomposes
into three impact-named surfaces observed in the current evidence
trail. Each surface has its own diagnostic, its own cure, and its
own home in the Practice graph. The single-rule shape is rejected
as wrong-layer. The decomposition is open to additional surfaces
as future evidence forces them. Sequencing optionality has since
emerged and is named below as Surface 4 (2026-05-29). Further
adjacent candidates (interface optionality, scope optionality) may
emerge and warrant their own surface or merge with these; the
decomposition is not asserted as exhaustive.**

### Surface 1 — Decision Optionality

**Definition**: bouncing forks to the owner whose answers have a
determinate empirical answer (in code, data, vendor docs, generator
output, schema, or log files).

**Impact**: wastes owner judgement on questions the agent could
have resolved by reading; fragments decision authority; produces
the owner-attention drag that motivated apply-don't-ask in the
first place.

**Diagnostic**:

- A fork is drafted toward the owner.
- The fork's answer is reachable by reading a repo / vendor / data
  surface.
- The agent has not read that surface.

**Cure**: the empirical-answerability gate
([PDR-057](PDR-057-empirical-answerability.md)). The decision-
optionality surface is fully subsumed by PDR-057; this PDR records
its presence in the decomposition for completeness, not as a
standalone rule.

### Surface 2 — Design Optionality

**Definition**: adding configurable / optional / extensible
surface in code or schema where a closed shape suffices.

**Impact**: erodes types (the closed shape's type guarantees are
weakened to admit the optional surface); bakes in fragility
(downstream consumers must handle the optional case forever);
mints maintenance load (every refactor must reason about the
optional surface).

**Concrete shapes** observed in evidence:

- `Record<string, unknown>` in a schema whose key set is known and
  closed.
- `?` (optional) on a property whose actual call sites all supply
  a value, with no caller in the foreseeable future intending to
  omit.
- Generic type parameters introduced *"to support future
  extension"* where every call site instantiates the same
  concrete type.
- Configuration flags that toggle behaviour where one branch is
  the always-correct path and the other is speculative.
- Plugin / strategy / adapter slots where there is one
  implementation and no concrete second one in scope.

**Diagnostic**:

- A surface is being authored or reviewed.
- The author / reviewer cannot name a concrete second instantiation
  in scope.
- The surface is nonetheless being shaped to admit the unknown
  second instantiation.

**Cure**: the closed-shape rule. Author the closed shape that the
known instances need. The configurable / extensible surface is
deferred until a real second instance forces the decomposition
(see also: [`consolidate-at-third-consumer`](../../rules/consolidate-at-third-consumer.md);
two is not three; speculative configurability is not consolidation).

The landing of this PDR requires the rule sibling for this surface
to be recorded as a candidate at
[`.agent/memory/operational/pending-graduations.md`](../../memory/operational/pending-graduations.md)
with the routing label *"design optionality"*. Graduation requires
its own evidence trail; this PDR does not pre-graduate it.

### Surface 3 — Outcome Optionality

**Definition**: writing acceptance criteria, plan outcomes, or
test conditions that hedge between possible answers when there is
a single right answer, or that depend on infrastructure that does
not exist.

**Impact**: produces unfalsifiable plans (no observable signal
distinguishes success from failure); shoehorns value-claims into
infrastructure that cannot carry them (sibling of the
*don't-shoehorn-a-value-claim* candidate); embeds optionality at
the verification layer where the discipline is most load-bearing.

**Concrete shapes** observed in evidence:

- Acceptance criteria of the form *"if X then Y else Z"* where
  one of X, Y, Z is the determinate answer.
- LLM-graded outcome conditions in plans where the LLM-graded
  evaluation infrastructure has not been built (the EEF plan
  example, removed under owner direction).
- Plans whose success condition is *"the team agrees"* without
  naming what the team would observe.
- Tests that branch on environment state (`if process.env.X`) to
  avoid asserting on the actual behaviour.

**Diagnostic**:

- A plan, ADR, acceptance criterion, or test is being authored.
- Its outcome is conditioned on a fork that has a determinate
  answer (decision optionality at the verification layer) or on
  infrastructure not currently in the repo.

**Cure**: the falsifiability rule. The outcome must name a
single observable signal that would distinguish success from
failure. If the infrastructure to observe the signal does not
exist, the plan says so explicitly and ships the structural
enforcement that does exist (the *don't-shoehorn-a-value-claim*
substance).

**Graduation (2026-05-29).** The rule sibling for this surface has
graduated. It graduates *not* as a standalone rule file but as the cure
stated immediately above — the falsifiability discipline is the
graduated rule. The *don't-shoehorn-a-value-claim* candidate (2026-04-30)
is **merged into it**: shoehorning a value-claim into absent
infrastructure is the infrastructure-absent special case of the
falsifiability cure ("if the infrastructure to observe the signal does
not exist, the plan says so explicitly and ships the structural
enforcement that does exist"), so it is one discipline, not two. The
active firing layer is the host's authoring-time first-principles check
(see Surface 4's cure note on enforcement), which makes the discipline
fire at the plan / acceptance-criterion / outcome authoring moment rather
than relying on a passive clause.

### Surface 4 — Sequencing Optionality

**Definition**: marking work with a bare optional status — most commonly
*"deferred"* — instead of either sequencing it to a concrete position (a
named gate or a falsifiable tripwire) or admitting it will not be done.

**Impact**: produces imaginary flows (a status that reads as *planned*
but names no condition under which it advances); silently stalls work no
future agent can resume, because nothing states when it resumes; and
converts a decision the owner never made — to defer — into ambient
backlog. Sequencing optionality is the sequencing-layer analogue of
outcome optionality: outcome optionality hedges *what success is*;
sequencing optionality hedges *when, or whether, the work happens*.

**Concrete shapes** observed in evidence:

- A bare `status: deferred` (or `*: deferred`) annotation or plan status
  with no reopen condition.
- *"We'll get to it later"* / *"when we get to it"* / *"TODO eventually"*
  offered as a sequence position.
- A plan item whose only ordering signal is *"future"* or *"next phase"*
  with no gate or tripwire naming what starts it.
- A conditional that can never falsifiably become true (*"when we have
  time"*).

**Diagnostic**:

- A plan item, status, or roadmap entry carries an optional / postponed
  marker.
- The marker names no concrete advancement condition — neither a
  gate-relative position (*"after the convergence lane lands"*) nor a
  falsifiable tripwire (*"when the schema migration lands"*).
- The deferral is the author's silent default, not a decision the owner
  made.

**Cure**: sequence-or-admit. Either (a) sequence the work to a concrete
position — a named gate, or a *falsifiable tripwire* a future agent could
observe firing — or (b) admit it will not be done and remove it. The
discriminator is falsifiability: *"when the schema migration lands"* is
legitimate sequencing (a specific, observable tripwire); *"when we get to
it"* is bare-deferred optionality (a vague conditional that never
falsifiably fires). The word *"deferred"* is acceptable only as a
modifier on a stated reopen tripwire (*"deferred to public beta; reopen
when X"*), never as a bare status. The test is *falsifiable
observability*, not whether a condition is merely named: a named-but-
unobservable condition (*"when the design is approved"* with no approval
artefact a future agent could check) is still bare-deferred optionality,
because nothing a future agent can observe tells them it has fired.

**Enforcement (active layer for Surfaces 3 and 4).** Both the
outcome-optionality and sequencing-optionality cures fire at the
plan / acceptance-criterion / outcome / status authoring moment through
the host's always-applied authoring-time first-principles check — an
optionality-surface clause added to that check rather than a new
always-applied rule file. The routing decision (a clause on an existing
check over a new rule) follows the host's rule-vs-clause discipline and
the always-loaded directive budget: a passive PDR clause loses to
artefact gravity, so the doctrine needs an active trigger, and folding
the trigger into the existing authoring-time check is lower-cost than
minting dedicated rule files and keeps a cohesive check cohesive.

## Scope

**Adopter scope**: every Practice-bearing repo. The decomposition
itself is portable substance; the per-surface rules will be
authored at host-specific shapes only as evidence forces them.

**What this PDR does**:

- Names the four surfaces, their impacts, and their distinct
  cures.
- Routes Surface 1 to PDR-057 (now load-bearing).
- Graduates Surface 3's cure (outcome-optionality falsifiability,
  with the *don't-shoehorn-a-value-claim* sibling merged in) and
  Surface 4's cure (sequencing optionality: sequence-or-admit),
  with the active firing layer at the host's authoring-time check
  (2026-05-29).
- Keeps Surface 2 (design optionality) as a routing label awaiting
  its own evidence trail.

**What this PDR does NOT do**:

- Pre-graduate the design-optionality rule. That requires its own
  evidence trail and its own draft.
- Mint standalone always-applied rule files for the graduated
  Surface 3 and Surface 4 cures. Their active layer is a clause on
  the host's existing authoring-time check, not a new rule file
  (rule-vs-clause routing; always-loaded directive budget).
- Replace consolidate-at-third-consumer. The third-consumer rule
  governs *when to extract*; design-optionality governs *when to
  shape*. They compose; they do not substitute.

## Rationale

The single-rule shape `stop-inventing-optionality` was wrong
because the distinct impacts demand distinct cures:

- Decision optionality: read-the-surface (PDR-057).
- Design optionality: close-the-shape (closed-shape discipline).
- Outcome optionality: name-the-falsifier (falsifiability
  discipline).
- Sequencing optionality: sequence-or-admit (a named gate or
  falsifiable tripwire, or admit not-doing — never a bare status).

A single rule that tried to span them all would either generalise
to *"do not introduce optionality"* (too broad — defeats genuine
extensibility where it is load-bearing) or specialise to one
surface and silently fail on the others (the failure mode at
the time of quarantine).

Naming the impact first is the discipline's central correction.
The owner's 2026-05-01 reframe was explicit: *"drafting the rule
before naming the impact is itself an instance of the failure
mode the doctrine was trying to name"*. This PDR honoured that by
authoring the decomposition and routing first; the per-surface
cures then graduate as evidence forces them — Surface 1 to PDR-057
at landing, and Surfaces 3 and 4 on 2026-05-29 once their evidence
trails and cures were established. Each graduation names the impact
before the cure, exactly as the decomposition required.

## Consequences

**Enables**:

- Optionality-shaped findings on review have four distinct
  diagnostic homes; reviewers can route their finding to the
  matching cure.
- The pending-graduations register can carry optionality
  candidates with named labels rather than as a single unwieldy
  unit, and graduate them surface by surface as evidence arrives.
- PDR-057 inherits Surface 1's substance with a clean boundary;
  the apply-don't-ask quarantine cleanly closes.

**Costs**:

- Reviewers must distinguish which surface a finding sits on
  before naming the cure. The cost is small (the four diagnostics
  are non-overlapping) and pays off in cure precision.
- One future graduation pass remains queued (the design-optionality
  rule, Surface 2), requiring its own evidence trail. The
  outcome-optionality and sequencing-optionality cures graduated on
  2026-05-29; Surface 1 routed to PDR-057 at landing. Graduating
  surface by surface — rather than as a single pass — is correct.

**Forbids**:

- Authoring a single `stop-inventing-optionality` rule. The shape
  is rejected.
- Conflating findings across the four surfaces (decision, design,
  outcome, sequencing optionality). Each surface has a distinct
  diagnostic and cure; conflation re-imports the failure the
  decomposition exists to prevent.

## Source

This PDR graduates the QUAR-1 entry of
[`pending-graduations.md`](../../memory/operational/pending-graduations.md)
under the 2026-05-01 owner-named reformulation, partner-PDR with
[PDR-057](PDR-057-empirical-answerability.md). The original
candidate (`stop-inventing-optionality`) is preserved in
[`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`](../../memory/operational/quarantine/apply-dont-ask-doctrine.md)
as historical evidence; that file is updated to mark the
quarantine cleared by this PDR pair.
