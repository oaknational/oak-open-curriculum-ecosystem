---
name: "Role-Emission Citation-Binding (substrate cure for the ticking-clock failure mode)"
overview: "Convert PDR-074 S1 from a self-discipline checklist question into a substrate-enforced citation-binding contract via a new PDR-082 (portable; Director + Heartbeat-emitter required scope v1; other roles Reserved) + paired ADR-188 (repo-bound phenotype; lands at Proposed), with a falsifiable freshness audit from comms alone."
todos:
  - id: phase-0-foundation
    content: >
      Phase 0: Re-verify the doctrine landscape (PDR-074/075/080 status, candidate amendment vs. new-PDR shape,
      existing pending-graduations entries on heartbeat-content-drift) before authoring.
    status: pending
  - id: cycle-1-1-pdr-082-draft
    content: >
      Cycle 1.1: Draft PDR-082 (emission citation-binding contract) body — portable doctrine,
      multi-role scope, falsifiability criterion, alternatives considered. Doctrine-only;
      no schema change.
    status: pending
  - id: cycle-1-2-pdr-082-reviewer-absorption
    content: >
      Cycle 1.2: Reviewer absorption on PDR-082 draft — docs-adr-expert + assumptions-expert +
      architecture-expert-betty + architecture-expert-barney (simplification challenge).
      Absorb findings into draft; record disposition ledger.
    status: pending
  - id: cycle-1-3-pdr-082-land
    content: >
      Cycle 1.3: Land PDR-082 at Candidate status (one commit: PDR body + practice-index.md
      entry + README.md entry).
    status: pending
  - id: cycle-2-1-adr-188-draft
    content: >
      Cycle 2.1: Draft ADR-188 (repo-bound substrate phenotype for emission citation-binding) —
      cited_event_id field shape on narrative/directed event kinds, watcher render token,
      multi-role coverage (Director/Marshal/Reviewer/Heartbeat-emitter substrate-snapshot identifiers).
      Schema work is named but deferred to follow-on plan; ADR is doctrine-shape only.
    status: pending
  - id: cycle-2-2-adr-188-reviewer-absorption
    content: >
      Cycle 2.2: Reviewer absorption on ADR-188 draft — docs-adr-expert + architecture-expert-fred +
      architecture-expert-wilma (adversarial failure-mode) + assumptions-expert. Absorb;
      record disposition.
    status: pending
  - id: cycle-2-3-adr-188-land
    content: >
      Cycle 2.3: Land ADR-188 at Accepted status (one commit: ADR body + practice-index.md
      entry + ADR README entry).
    status: pending
  - id: task-3-1-pattern-memory
    content: >
      Task 3.1: Author .agent/memory/active/patterns/ground-truth-dependency-of-role-emission.md
      with cross-links to PDR-082, ADR-188, validators-must-recompute-not-just-record rule,
      and substrate-pointer-read-as-current-state pattern.
    status: pending
  - id: task-3-2-pending-graduations
    content: >
      Task 3.2: Register a pending-graduations entry consolidating the heartbeat-content-drift
      candidate (Misty napkin 2026-05-25, 6+ worked instances) with the new PDR-082 cure shape,
      enabling formal graduation when the schema substrate lands.
    status: pending
  - id: phase-4-deferred-substrate-implementation
    content: >
      Phase 4 (deferred to follow-on plan): substrate implementation — comms-event.schema.json
      extension with optional cited_event_id field; agent-tools CLI flag wiring; watcher render
      of freshness token; live-team coordination on schema change.
    status: deferred
  - id: phase-5-deferred-skill-and-directive-amendments
    content: >
      Phase 5 (deferred): SKILL start-right-team §3 + agent-collaboration.md amendments to point
      at PDR-082 and the cited_event_id binding. Deferred until PDR-082 graduates from Candidate
      to Proposed via worked-instance accumulation.
    status: deferred
---

# Role-Emission Citation-Binding (substrate cure for the ticking-clock failure mode)

**Last Updated**: 2026-05-25 (post-reviewer-absorption)
**Status**: 🟡 PLANNING (consensus absorbed; ready for execution start on owner direction)
**Scope**: Convert PDR-074 S1 from self-discipline to substrate-enforced citation-binding via PDR-082 (portable contract; Director + Heartbeat-emitter required scope v1) + paired ADR-188 (repo-bound phenotype; Proposed status).
**Authoring session**: Briny Fathoming Dock (`95a27b`) / claude / claude-opus-4-7
**Source reflection**: `/Users/jim/.claude/plans/your-role-is-fundamentally-playful-russell.md` (session-local plan; the reflection that triggered this repo-plan promotion).
**Pre-execution reviewer pass**: 6 reviewers (assumptions, docs-adr, betty, barney, fred, wilma) — all PASS-WITH-CONDITIONS; consensus absorbed into plan body per §"Reviewer Absorption Log" below.

---

## Context

### The owner observation that triggered this plan

> Your role is fundamentally metacognitive. How can roles work better in
> teams? For instance, the Director role is only useful when grounded in
> continually re-verified _fact_, otherwise it becomes a useless, even
> damaging, expensive ticking clock.

The observation reads as unaddressed doctrine until you check the
doctrine landscape. PDR-074 (Candidate, 2026-05-23) already names
_comms-stream-as-canonical-truth_ as the cure for the Director's
broad-awareness load (structural property C); its periodic structural
checklist S1 already asks the Director: _"Is my mental model still
consistent with the comms stream? (If not — re-ground from the stream.)"_

Tonight's evidence is that S1 fails under load.

### Issue 1: PDR-074 S1 degrades under load

**Evidence**: Misty Drifting Sail napkin (2026-05-25, `02b325`)
captured two Director-awareness-gap failure-mode events tonight against
the Lunar Ascending Star Director seat. The seat ran S1 mentally;
stale state slipped through anyway. The doctrine-by-analogy failure
mode the metacognition directive predicts.

**Root cause**: S1 is a self-asked checklist question fired every ~5
minutes. The agent must remember to run it, recompute the consistency
between mental model and comms stream, and act on staleness. Under
high cadence (multi-agent routing pressure, owner-turn arrival, peer
heartbeats, gate-state reports, claim-state transitions), the
mental-bandwidth cost of running S1 honestly exceeds the bandwidth
available, and the discipline silently degrades. The Director keeps
emitting at cadence on a stale model. Peers cannot detect the
staleness from the emission alone — there is no cited freshness.

**Existing capabilities**: PDR-074 §C + S1 are correctly-shaped at the
doctrine layer. PDR-075 (Director substrate-writing discipline)
mandates emission of tagged events at coherence-moments but does not
require each emission to carry a substrate-snapshot citation. PDR-080
(Accepted) governs absorption on the consumer side. The producer-side
mechanical enforcement of S1 is the gap.

### Issue 2: Heartbeat-content-drift is the same shape one role down

**Evidence**: Misty napkin (2026-05-25) captured six+ instances in
one window — Misty 23:13/23:17/23:22Z, Lunar 22:24/22:28/22:32Z — of
templated Monitor-loop heartbeat bodies emitting stale content while
live state changed. Templated body, fixed cadence, no mechanical
binding to current state. Heartbeats kept ticking; the substance in
the body stopped tracking reality.

**Root cause**: Same as Issue 1, transposed to the heartbeat-emitter
role. The emission shape (a free-form body) carries no mechanical
binding to the substrate it represents (current claim, current cycle
state). Refresh depends on agent discipline; under load, discipline
degrades; the body goes stale.

**Existing capabilities**: PDR-078 (liveness-heartbeat contract) +
ADR-186 (heartbeat-lifecycle substrate) already define the heartbeat
cadence + threshold + auto-action mechanically. They do not yet bind
the heartbeat _body_ to an observable substrate snapshot. The napkin
explicitly names this as a graduation candidate (mechanical
state-binding to active-claims.json or current-cycle-state field).

### Issue 3: The pattern generalises across all role-emissions

The Director and the heartbeat-emitter are not special. Every role's
emission depends on a substrate of ground truth, and every role has a
degenerate mode where the emission continues at cadence while the
substrate has moved. Marshal commits against stale gate-state.
Reviewer rubber-stamps without citing diff. Curator trims without
recomputing fitness. Scout outputs stale exploration. The structural
property is _ground-truth dependency of role emission_; the failure
mode is _emission-without-ratification of the underlying substrate_;
the cure is _substrate-emitted freshness with citation-binding on
every role-emission_.

---

## Quality Gate Strategy

Quality gates for this plan are doctrine-layer, not product-code:

### Per-cycle (PDR/ADR drafting cycles)

```bash
# 1. Markdown lint clean
pnpm markdownlint-check:root .agent/practice-core/decision-records/PDR-082-emission-citation-binding-contract.md
# Expected: exit 0

pnpm markdownlint-check:root docs/architecture/architectural-decisions/188-emission-citation-binding-substrate.md
# Expected: exit 0

# 2. Cross-link validity (rg-based)
rg -n "PDR-082" .agent/practice-core/ docs/architecture/
# Expected: hits in PDR-082 self-reference, ADR-188 §Related, practice-index.md entry

# 3. Fitness check on touched files
pnpm agent-tools:fitness-validator --strict-hard
# Expected: no critical, no hard
```

### Final aggregate gate

```bash
pnpm check
```

**Rationale**: doctrine PDRs/ADRs flow through the canonical gate
chain via markdownlint + ADR/PDR README integrity checks; product-code
gates are not exercised by this plan (no product code lands until the
follow-on substrate-implementation plan).

---

## Solution Architecture

### Principle

> "The Director is the team's recursive-cognition substrate... Maximally
> effective directing produces the lowest-cost recursive descent at each
> routing moment." — PDR-074 §Structural Property A

And the metacognition directive specifies the cure-shape this plan
operationalises:

> "Documentation surface can drift from implementation; default the cure
> to make the documentation generated by the implementation rather than
> fix the current copy of the documentation. Doc patches are once-cures;
> structural cures amortise across future agents." — `.agent/directives/metacognition.md` §"Cure Shape — Structural, Not Doc-Patch"

### Key Insight

PDR-074 S1 is correctly-shaped _doctrine_ (the Director's mental model
must stay consistent with the comms stream) but the mechanism is
_self-discipline_. The metacognition directive names exactly this
class as the doc-patch failure mode: a discipline rule that depends
on the agent remembering to run it loses to load.

The structural cure is **mechanical substrate enforcement**. Every
role-emission carries a `cited_event_id` (or equivalent
substrate-snapshot identifier) field naming the comms-event the
emission was authored against. Peers can audit freshness from the
event body alone; post-hoc audit is mechanical. S1 stops being a
question the Director asks themselves and becomes a property of every
emission, observable by any peer.

**This exemplifies the First Question**: "Could it be simpler?"

Answer: YES — the simplest defensible shape is a single optional
schema field (`cited_event_id`) plus a doctrinal contract (PDR-082)
specifying when the field is required. The substrate is one field;
the doctrine is one PDR; the phenotype is one ADR. The generalisation
to multi-role works through the same field with different
substrate-snapshot identifier conventions per role.

### Strategy

Three artefacts in two layers:

1. **Doctrine layer (portable PDR-082)** — names the
   emission-citation-binding contract independent of any specific
   substrate phenotype. Specifies: every role-emission cites the
   substrate-snapshot it was authored against; peers may audit;
   threshold-aged citations are stale-by-definition.
2. **Phenotype layer (repo-bound ADR-188)** — names the
   `cited_event_id` field on `narrative` and `directed` event kinds,
   the watcher render token, and the per-role substrate-snapshot
   identifier conventions (Director cites last-read event id;
   Marshal cites tree-state-hash + queue-head; Reviewer cites
   diff-hash + focused-test-commit; Heartbeat-emitter cites
   active-claims revision id).
3. **Pattern memory + pending-graduations** — capture the
   _ground-truth dependency of role emission_ pattern in active
   memory; register the heartbeat-content-drift candidate with the
   new cure shape so graduation can fire when the substrate lands.

**Non-Goals (YAGNI)**:

- ❌ Amending PDR-074 directly. Two reasons: (a) PDR-074 is Candidate;
  amending Candidate doctrine before maturity is doctrinally
  questionable; (b) per PDR-079 (PDR-vs-ADR portability distinction),
  the portable contract belongs in a new PDR; substrate phenotype
  belongs in an ADR. PDR-074 S1 can later cite PDR-082 as the
  mechanical-enforcement substrate without losing its structural-property
  framing.
- ❌ Schema implementation in this plan. The
  `comms-event.schema.json` extension touches shared substrate the
  live team is actively writing to. Schema changes are a follow-on
  plan with explicit team coordination.
- ❌ SKILL or directive amendments in this plan. Those graduate after
  PDR-082 matures from Candidate to Proposed via worked-instance
  accumulation (per the Candidate-PDR evolution route).
- ✅ Doctrine + phenotype authoring + pattern memory + pending-graduations.
  Substrate phenotype-decision lands here; substrate
  implementation lands in the follow-on plan.

---

## Build-vs-Buy Attestation

Not vendor-touching. Internal doctrine + schema-phenotype work only.
No first-party integration evaluation applicable.

---

## Reviewer Scheduling (phase-aligned, post-absorption)

**Pre-execution pass — completed 2026-05-25**:

6 reviewers dispatched in parallel against this plan: `assumptions-expert`,
`docs-adr-expert`, `architecture-expert-betty`, `architecture-expert-barney`,
`architecture-expert-fred`, `architecture-expert-wilma`. All returned
PASS-WITH-CONDITIONS. Findings absorbed into plan body per §"Reviewer
Absorption Log". No further pre-execution reviewer pass required unless
the absorbed direction changes again before Cycle 1.1 starts.

**During execution — narrowed to 3 reviewers per cycle** (absorbs
assumptions F3 + barney F5 consensus on reviewer-count proportionality;
6 dispatches across the two execution cycles instead of the original 8):

- **Cycle 1.2 (PDR-082 absorption)**: `docs-adr-expert` (PDR quality
  and cross-link integrity), `assumptions-expert` (any residual overreach
  after the v1 narrowing absorbed), `architecture-expert-barney`
  (simplification re-check on the narrowed shape).
- **Cycle 2.2 (ADR-188 absorption)**: `docs-adr-expert` (ADR quality
  and cluster placement), `architecture-expert-fred` (cluster compliance
  and migration discipline verification), `architecture-expert-wilma`
  (failure-mode probe on the fully-drafted ADR-188 against the
  absorbed Migration discipline rules).

**Post (after both PDR-082 + ADR-188 land)**:

- `docs-adr-expert` — final propagation check (README, index, related
  PDR/ADR §Related sections, CHANGELOG, practice-core/index.md).
- `release-readiness-expert` — N/A (doctrine-only landing; no
  release-shape decisions).

Per memoried "Opus-team quota ceiling" + "Extensive reviewers", default
sub-agent model is Sonnet, not Opus.

The reviewer fan-out depth is calibrated to the doctrine-substrate
surface (multi-role producer-side citation contract) without applying
the napkin 2026-05-25 "security-class ADR" precedent (ADR-187 was
security-class; ADR-188 is not).

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md` — Core principles.
2. **Re-read** `.agent/directives/agent-collaboration.md` — Multi-agent
   coordination doctrine, the surface this plan touches.
3. **Re-read** `.agent/directives/metacognition.md` — The cure-shape
   directive (structural, not doc-patch) this plan operationalises.
4. **Ask**: "Does this deliver system-level value, not just fix the
   immediate Director-awareness-gap instance?" — see Issue 3 above.
5. **Verify**: No new doctrine is introduced where amendment-to-existing
   would suffice; no shared substrate is touched without team
   coordination; no PDR/ADR is landed with broken cross-links.

---

## Lifecycle Trigger Commitment

Before the first non-planning edit:

1. **Work shape**: bounded executable repo plan, doctrine + phenotype
   authoring, no product code.
2. **Start-right check**: active-claims.json has zero entries; live
   team operating via comms/queue; cycles 9-15 of post-M1-attestation-tidy-up
   are in parallel execution.
3. **Active areas registration**: open a claim on the PDR-082 +
   ADR-188 + plan file scope before authoring; close at session close.
4. **Apply** `lifecycle-triggers.md` for each phase boundary.

---

## Documentation Propagation Commitment

Before marking each phase complete:

1. Update `.agent/practice-index.md` (PDR-082 entry; canonical
   bridge per PDR-079).
2. Update `docs/architecture/architectural-decisions/README.md`
   (ADR-188 entry).
3. Update `.agent/practice-core/decision-records/README.md` if
   PDR-082's classification requires it.
4. Verify (sample against recently-landed PDR-076a/b/077/078/079/080/081):
   - `.agent/practice-core/CHANGELOG.md` — confirm whether PDR
     landings have historically updated this file; if yes, add
     PDR-082 entry (absorbs docs-adr propagation finding).
   - `.agent/practice-core/index.md` — confirm whether new PDRs
     require an entry; if yes, add PDR-082 entry.
5. Cross-link PDR-082 ↔ ADR-188 ↔ PDR-074/075/078/080 ↔
   ADR-183/186 (PDR-080 added per docs-adr F4). PDR↔ADR refs
   route through the practice-index bridge per PDR-079
   (PDR-082 cites ADR-188 by identifier; ADR-188 markdown-links
   to PDR-082).
6. Track deferred back-cites (PDR-074 §S1 + PDR-075 §Cadence +
   PDR-078 + PDR-080) in a single pending-graduations entry per
   docs-adr F4 absorption; the back-cites land in each PDR's next
   amendment cycle, not in this plan's commits.
7. Apply `/oak-consolidate-docs` after both artefacts land so
   settled documentation routes correctly.

If a required surface needs no update, record explicit no-change
rationale in the cycle's disposition log.

---

## Task Completion Summary

Each cycle has:

- **Acceptance Criteria**: doctrine-specific checkable conditions.
- **Deterministic Validation**: rg patterns + markdownlint commands.
- **Cycle Complete When**: all criteria met AND validation commands
  pass AND reviewer absorption ledger is recorded.

**Red Flag**: if a reviewer flags a substantive concern that
contradicts the plan's premise, STOP and surface to owner before
proceeding.

---

## TDD / Refactoring Cycle Discipline

This plan is doctrine + phenotype authoring, not product code.
TDD cycle-pairs do not apply. Each cycle is one landing unit:
draft + reviewer absorption + commit.

Each cycle names:

1. starting state and file scope;
2. the doctrine or phenotype increment;
3. the reviewer absorption pass;
4. outcome-based acceptance criteria;
5. deterministic validation commands;
6. parallel-safety (Phase 1 and Phase 2 are sequenced; cycles
   within each phase are sequential).

---

## Resolution Plan

### Phase 0: Verify Foundation Assumptions (≤30 min)

**Foundation Check-In**: Re-read PDR-074, PDR-075, PDR-079, PDR-080,
ADR-183, ADR-186, and the `agent-collaboration.md` Director section.

**Key Principle**: this plan exists _only_ if the PDR-074 S1 failure
under load is real and the structural cure is not already in flight.

#### Task 0.1: Verify the doctrine-landscape diagnosis

**Current Assumption**: PDR-074 S1 is a self-discipline checklist
question that depends on the Director remembering to run it; no
existing PDR/ADR provides mechanical enforcement.

**Validation Required**:

- Grep for `cited_event_id`, `cite_event`, `cited_substrate`, or
  equivalent terms across `.agent/practice-core/` and
  `docs/architecture/`; confirm zero hits.
- Confirm PDR-074 §S1 reads as a self-asked question, not as an
  emission-binding rule.
- Confirm PDR-075 mandates emission but does not mandate citation.
- Confirm no pending-graduation entry already proposes this cure
  shape.

**Acceptance Criteria**:

1. ✅ `rg -n "cited_event_id\|cite_event\|cited_substrate" .agent/ docs/` returns zero hits.
2. ✅ PDR-074 §"Six structural properties" S1 reads as a checklist question, not an emission binding.
3. ✅ PDR-075 §"Cadence" specifies coherence-moment emission without specifying citation-binding.
4. ✅ `.agent/memory/operational/pending-graduations/` contains no entry already proposing
   this cure (heartbeat-content-drift candidate exists but proposes state-binding to
   active-claims.json, not citation-binding generalised across roles).

**Deterministic Validation**:

```bash
rg -n "cited_event_id|cite_event|cited_substrate|citation-binding" .agent/ docs/
# Expected: zero hits

rg -n "S1\b|consistent with the comms stream" .agent/practice-core/decision-records/PDR-074-*.md
# Expected: hits showing S1 framed as checklist question

ls .agent/memory/operational/pending-graduations/
# Expected: directory listing (substrate exists)
```

**If Violations Found**: STOP and surface to owner — the plan's
premise needs re-grounding.

**Task Complete When**: All 4 acceptance criteria checked and
validation produces expected results.

**Foundation Alignment**: validates the metacognition directive's
"structural, not doc-patch" requirement by confirming no existing
structural cure is in flight.

---

#### Task 0.2: Verify the doctrine-shape decision (new PDR-082 vs. PDR-074 amendment)

**Current Assumption**: a new PDR-082 is the correct shape, not a
PDR-074 amendment, because (a) PDR-074 is Candidate and amending
Candidate doctrine before maturity is questionable, and (b) PDR-079
names the portability distinction PDR vs. ADR — the portable
emission-citation-binding contract is PDR-shaped, the
repo-bound substrate phenotype is ADR-shaped.

**Validation Required**:

- Read PDR-079 confirms PDR-vs-ADR portability distinction.
- Confirm PDR-074 is Candidate (status review allows amendment but
  doesn't require it; new-PDR is also valid).
- Confirm new-PDR composes cleanly with PDR-074 §S1 without
  duplicating substance.

**Acceptance Criteria**:

1. ✅ PDR-079 §Decision names PDR-shape = portable contract, ADR-shape = repo-bound phenotype.
2. ✅ PDR-074 status reads "Candidate" as of read-time.
3. ✅ A new PDR-082 can refer to PDR-074 §S1 by citation without restating S1's checklist substance.

**Deterministic Validation**:

```bash
rg -n "Status._Candidate" .agent/practice-core/decision-records/PDR-074-_.md
# Expected: one hit

rg -n "portable\|portability\|repo-bound" .agent/practice-core/decision-records/PDR-079-*.md
# Expected: hits naming the distinction
```

**Task Complete When**: All 3 acceptance criteria checked.

---

#### Task 0.3: Verify safety to land into the current team-window

**Current Assumption**: the live team (Hushed Stalking Shade as
Marshal; Misty Drifting Sail as Director; Eclipsed/Twilit/Wooded as
implementers) is mid-cycle on post-M1-attestation-tidy-up cycles 9-15;
new PDR-082 + ADR-188 files do not collide with their cycle scope; no
shared substrate (schema, active-claims.json, pending-graduations.md)
is touched in this plan.

**Validation Required**:

- Verify active-claims.json shows zero current claims that overlap
  PDR-082 / ADR-188 / new plan-file paths.
- Verify the post-M1-attestation-tidy-up plan's cycles 9-15 do not
  touch the same PDR/ADR slots.
- Verify the comms event stream shows no in-flight coordinator
  routing that would intersect this plan.

**Acceptance Criteria**:

1. ✅ `active-claims.json` shows zero active claims overlapping with `PDR-082-_` or `ADR-188-_` paths.
2. ✅ The post-M1-attestation-tidy-up plan does not name PDR-082 or ADR-188 in its cycles.
3. ✅ No directed comms event from the team's Director addresses this plan or its scope.

**Deterministic Validation**:

```bash
jq '.active_claims | length' .agent/state/collaboration/active-claims.json
# Expected: 0 (or all non-overlapping)

rg -n "PDR-082\|ADR-188" .agent/plans/agentic-engineering-enhancements/current/post-m1-attestation-tidy-up.plan.md
# Expected: zero hits
```

**Task Complete When**: All 3 criteria checked. Coordination is safe
to proceed.

---

### Phase 1: Author PDR-082 — Emission Citation-Binding Contract (≤2 hours)

**Foundation Check-In**: Re-read PDR-074 §C + §S1, PDR-075 §"What
Must Be Emitted", PDR-079 §Decision, `agent-collaboration.md` Director
section, `metacognition.md` §"Cure Shape — Structural, Not Doc-Patch".

**Key Principle**: PDR-082 is doctrine-only; the substrate phenotype
lives in ADR-188. PDR-082 must read losslessly without reference to
any specific event-schema field name.

#### Cycle 1.1: Draft PDR-082 body

**Parallel-safety**: sequential (Cycle 1.1 → 1.2 → 1.3).

**Starting state**: branch HEAD at dispatch (verify with `git rev-parse HEAD`).

**File scope**:

- `.agent/practice-core/decision-records/PDR-082-emission-citation-binding-contract.md` (new)

**Doctrine increment**:

PDR-082 sections (canonical shape per PDR-079 §"PDR Body Shape"):

1. **Context** — the doctrine-by-analogy failure of PDR-074 S1 under
   load; the heartbeat-content-drift generalisation; the
   ground-truth-dependency-of-role-emission pattern.
2. **Decision** — every role-emission carries a substrate-snapshot
   citation in its body; the snapshot identifier is the most recent
   ratification event the emitter acted on; peers may audit freshness
   from the citation alone; emissions whose citation has aged past
   the role's freshness threshold are stale-by-definition.
3. **Per-role substrate-snapshot conventions — portable abstract
   pattern; concrete repo-bound bindings live in ADR-188 per PDR-079
   layer split**:

   **Required scope v1** (worked-instance evidence ≥ 2 in tonight's
   napkin; reviewer consensus narrowing):

   - **Director** cites the most recent ratified coordination-event
     identifier the seat acted on. Abstract type: _coordination-event
     identifier_. Concrete binding (in ADR-188).
   - **Heartbeat-emitter** cites the claim-state revision identifier
     the heartbeat body was authored against, with additive-only churn
     tolerance (claims opened after cite-time do not invalidate;
     claims that existed at cite-time must remain in the cited state).
     Abstract type: _claim-state revision identifier_. Concrete
     binding (in ADR-188).

   **Reserved** (convention TBD on worked-instance accumulation;
   PDR-082 amendment trigger = ≥ 2 worked instances of the role's
   degenerate-mode emission in a distinct session):

   - Marshal — abstract type: _queue-and-tree state composite_.
   - Reviewer — abstract type: _diff-and-test-commit composite_.
   - Curator — abstract type: _buffer-state snapshot_.
   - Scout — abstract type: _commit-and-claim-state composite_.

   The Reserved roles' abstract types are sketched as portable hints
   only; their concrete bindings and the requirement-or-not are
   deferred to PDR-082 amendments triggered by their own worked
   instances. PDR-082 v1 does NOT mandate citation for Reserved
   roles' emissions.
4. **Falsifiability criterion** — a role-emission with a citation
   older than the role's threshold, OR a role-emission without any
   citation where one is required, is the failure phenotype.
   Post-hoc audit is mechanical.
5. **Composition with existing doctrine**:
   - PDR-074 §S1 — PDR-082 makes S1 mechanically enforced; PDR-074
     §S1 can later cite PDR-082 as the structural cure.
   - PDR-075 — PDR-082's citation-binding requirement applies to
     PDR-075's mandated emissions.
   - PDR-078 — heartbeat emissions are one class under PDR-082.
   - PDR-080 — coordination-event absorption is the consumer side;
     PDR-082 is the producer side; they compose.
   - PDR-079 — the portable contract lives in this PDR; the
     repo-bound phenotype lives in ADR-188.
6. **Alternatives considered**:
   - **A. Amend PDR-074 directly** — Rejected: amending Candidate
     doctrine before maturity is questionable; PDR-079 favours new
     PDR for portable contract.
   - **B. Just the ADR phenotype, no PDR** — Rejected: leaves the
     doctrine layer's S1 self-discipline framing in place, which
     diverges from the substrate phenotype.
   - **C. Behaviour-note tagged comms event only, no PDR/ADR** —
     Rejected: the cure-shape is structural per `metacognition.md`;
     a behaviour-note is capture, not enforcement.
   - **D. Watcher-side computed staleness, no field** — Rejected:
     forces every audit to re-derive the snapshot identifier; the
     citation-in-event makes the audit mechanical.
7. **Consequences**:
   - Positive: S1 becomes mechanically auditable; doctrine-by-analogy
     failure mode shifts from invisible-to-falsifiable.
   - Negative: every emission body grows by one identifier field;
     emitter cost grows by one substrate read per emission.
   - Costs amortise: substrate read is cheap (a single
     active-claims.json read or comms-event-id from watcher); the
     emission-body growth is one ID-length string.
8. **Falsifiability** (Popper test): a future session in which
   Director emissions carry no `cited_event_id` field, AND in which
   peer agents do not surface the missing-citation as a defect, would
   falsify PDR-082's enforcement claim.

**Acceptance Criteria**:

1. ✅ PDR-082 body is ≤ 500 lines.
2. ✅ All §Related cross-links point at extant PDRs/ADRs (no `[[broken]]`).
3. ✅ §Falsifiability section names a specific, observable failure phenotype.
4. ✅ §Alternatives considered names ≥4 alternatives with rejection rationale.
5. ✅ Frontmatter `pdr_kind: governance` and `Status: Candidate`.
6. ✅ Cross-references PDR-074/075/078/079/080 and ADR-188 are present.

**Deterministic Validation**:

```bash
wc -l .agent/practice-core/decision-records/PDR-082-emission-citation-binding-contract.md
# Expected: ≤ 500

pnpm markdownlint-check:root .agent/practice-core/decision-records/PDR-082-emission-citation-binding-contract.md
# Expected: exit 0

rg -n "PDR-074\|PDR-075\|PDR-078\|PDR-079\|PDR-080\|ADR-188" \
  .agent/practice-core/decision-records/PDR-082-emission-citation-binding-contract.md
# Expected: 6 reference categories present
```

**Cycle Complete When**: all 6 acceptance criteria checked AND
validation passes.

---

#### Cycle 1.2: Reviewer absorption on PDR-082 draft

**Parallel-safety**: parallel reviewer dispatch in one message;
absorption is sequential after all reviewers return.

**Starting state**: PDR-082 draft exists (Cycle 1.1 complete).

**File scope**:

- `.agent/practice-core/decision-records/PDR-082-emission-citation-binding-contract.md` (edit per reviewer findings)
- Disposition ledger in the plan's §"Reviewer Absorption Log" (added to this plan body)

**Reviewer dispatch — 3 reviewers per consensus narrowing** (parallel, Sonnet default):

| Reviewer | Lens | Focused question |
|---|---|---|
| `docs-adr-expert` | PDR quality + cross-link integrity | Is PDR-082 v1 correctly composed against PDR-074/075/079/080/078? Are §Related cross-links bidirectional via practice-index? Is `Status: Candidate` justified? Are the abstract substrate-snapshot types (Director, Heartbeat) cleanly portable per PDR-079? |
| `assumptions-expert` | residual overreach after v1 narrowing | Now that PDR-082 v1 is narrowed to Director + Heartbeat with the other roles Reserved, is any residual overreach present? Does the falsifiability criterion remain observable? |
| `architecture-expert-barney` | simplification re-check on narrowed shape | With the multi-role overreach absorbed and the layer split sharpened, is the narrowed PDR-082 still simpler-than-not-doing-it, or has the absorption collapsed the simpler-shape margin? |

**Absorption discipline**: record verdict + evidence + disposition
per reviewer in §"Reviewer Absorption Log" (the per-cycle subsection).
Substantive findings absorb into the draft; non-substantive findings
are acknowledged in the log without edit.

**Acceptance Criteria**:

1. ✅ 3 reviewer transcripts captured.
2. ✅ Reviewer absorption log records verdict + disposition per reviewer.
3. ✅ Substantive findings are absorbed into PDR-082 body or explicitly recorded as "rejected with rationale".
4. ✅ Post-absorption draft re-passes Cycle 1.1's deterministic validation.

**Deterministic Validation**:

```bash
# Reviewer findings absorbed
rg -n "Reviewer Absorption Log" .agent/plans/agentic-engineering-enhancements/current/role-emission-citation-binding.plan.md
# Expected: hit on the log section

# Draft still valid
pnpm markdownlint-check:root .agent/practice-core/decision-records/PDR-082-emission-citation-binding-contract.md
# Expected: exit 0
```

**Cycle Complete When**: all 4 criteria met. Substantive blockers are
either absorbed or surfaced to owner for direction.

---

#### Cycle 1.3: Land PDR-082 at Candidate status

**Parallel-safety**: sequential after Cycle 1.2.

**Starting state**: post-absorption PDR-082 draft.

**File scope**:

- `.agent/practice-core/decision-records/PDR-082-emission-citation-binding-contract.md`
- `.agent/practice-index.md` (entry added)
- `.agent/practice-core/decision-records/README.md` (entry added if README enumerates PDRs)

**Doctrine increment**: one commit landing PDR-082 + index entries.

**Acceptance Criteria**:

1. ✅ Commit subject ≤ 100 chars, conventional-commits format.
2. ✅ Commit body cites PDR-082 + reviewer absorption disposition.
3. ✅ Commit lands cleanly through husky gate chain.
4. ✅ `practice-index.md` entry present.
5. ✅ `decision-records/README.md` entry present (if README enumerates).
6. ✅ Cross-links from PDR-074 / PDR-075 / PDR-078 / PDR-080 to PDR-082
   are queued for the next maturity cycle of each (NOT landed here;
   recorded as deferred to the relevant PDR's next amendment).

**Deterministic Validation**:

```bash
git log -1 --format="%s" | wc -c
# Expected: ≤ 101 (including newline)

pnpm agent-tools:check-commit-message
# Expected: exit 0

rg -n "PDR-082" .agent/practice-index.md
# Expected: ≥ 1 hit
```

**Cycle Complete When**: all 6 acceptance criteria met AND commit
lands.

---

**Phase 1 Complete Validation**:

```bash
pnpm check
```

**Success Criteria**: gate chain green; PDR-082 in repo at Candidate
status; reviewer absorption log preserved in this plan body.

---

### Phase 2: Author ADR-188 — Emission Citation-Binding Substrate Phenotype (≤2 hours)

**Foundation Check-In**: Re-read ADR-183 (tag namespace), ADR-184
(sync kind + urgency), ADR-185 (auto-acceptance metadata), ADR-186
(heartbeat-lifecycle substrate), `comms-event.schema.json` (current
shape).

**Key Principle**: ADR-188 is repo-bound phenotype; it specifies
schema-field shape, watcher render token, and CLI surface, but does
NOT land the implementation (implementation is the follow-on plan,
deferred for live-team coordination).

#### Cycle 2.1: Draft ADR-188 body

**Parallel-safety**: sequential (Cycle 2.1 → 2.2 → 2.3).

**Starting state**: PDR-082 lands at Candidate (Phase 1 complete).

**File scope**:

- `docs/architecture/architectural-decisions/188-emission-citation-binding-substrate.md` (new)

**Phenotype increment**:

ADR-188 sections (post-reviewer-absorption shape):

1. **Status** — `Proposed` (lands while paired PDR-082 is Candidate;
   moves to Accepted on first worked-instance of implemented
   substrate per the consensus absorption from betty F4 + barney F4 +
   docs-adr F5; this differs from ADR-183/184/185/186 which all
   landed Accepted alongside their substrate landing).
2. **Context** — PDR-082 names the portable contract; ADR-188 lands
   the repo-bound shape.
3. **Decision** — extend `comms-event.schema.json` with an optional
   `cited_event_id` field on **all three** event kinds: `narrative`,
   `directed`, AND `lifecycle` (lifecycle inclusion absorbs fred F1:
   heartbeats live on lifecycle per ADR-186, so excluding it would
   make heartbeat citation structurally unreachable). Watcher renders
   `[CITED:<event-id-prefix>]` schema-field token. **Concrete
   per-role substrate-snapshot identifier bindings** (the
   repo-bound bindings; PDR-082 carries only the abstract types per
   the PDR-079 layer split):
   - Director: most recent comms-event id the seat read forward to.
   - Heartbeat-emitter: `active-claims.json` revision identifier
     (file-content hash or revision counter) at heartbeat-body
     authoring moment.
   - Reserved (Marshal, Reviewer, Curator, Scout): concrete bindings
     TBD on worked-instance accumulation; ADR-188 v1 does not
     mandate.
4. **Migration discipline** — multiple constraints absorbed from
   reviewers:
   - **Backwards-compatible**: field is optional from landing; both
     citation-present and citation-absent emissions remain valid.
   - **Consumer-first migration** (absorbs wilma F4 + ADR-186
     precedent): consumers handle field-present + field-absent
     paths before any emitter lands the field; emitters migrate at
     next natural cycle.
   - **Cited-event retention** (absorbs wilma F1): the PDR-080
     absorption pass MUST verify no active citation points to an
     event before rotating that event out of the active stream; a
     citation to a no-longer-extant event renders as
     `[CITED:<prefix>·UNRESOLVED]` and surfaces as a defect to
     consolidation.
   - **Citation validity** (absorbs wilma F2): a comms event MAY
     carry a `validity` field with values `valid` (default) or
     `retracted`; an emission citing a retracted event is DEFECTIVE
     and the retraction triggers an active-citation sweep.
   - **`additionalProperties: false` constraint** (absorbs betty F5):
     the comms-event schema is closed on each $def; the
     `cited_event_id` field landing requires an explicit schema
     amendment that all schema-validating consumers must accommodate
     simultaneously — not a silent additive extension.
   - **Migration-window closure signal**: once all canonical
     emitters have landed the field, a follow-on tidy cycle removes
     the graceful-missing paths on the consumer side.
   - **Exit criterion**: fourth-instance worked validation of the
     contract under rotating-cast Director operation.
5. **Watcher behaviour** — distinguish two token classes per the
   ADR-185-style derived-token discipline (absorbs fred F5):
   - **Schema-field render**: `[CITED:<prefix>]` renders the value
     of the `cited_event_id` field directly; composes with channel
     tokens (`[BROADCAST]`, `[DIRECTED]`, etc.).
   - **Consumer-derived audit token**: `[STALE]` is a
     watcher-computed token NOT present on the event; it fires when
     the cited event's age exceeds the role's freshness threshold.
     Computation surface: watcher compares cited-event timestamp
     against now() and looks up the role's freshness threshold
     (threshold values held in PDR-082 as abstract; concrete numeric
     values in ADR-188 §"Freshness thresholds").
   - **Forbidden**: agents MUST NOT author `[STALE]` in event titles
     or bodies; it is a derived token only.
6. **CLI surface** — the agent-facing CLI MUST expose a
   per-emission citation argument. The specific flag name is
   deferred to the follow-on substrate-implementation plan (absorbs
   docs-adr WHAT-vs-HOW: ADR names outcome, implementation plan
   names HOW).
7. **Falsifiability** (absorbs wilma F3 + F6):
   - A role-emission with `cited_event_id` older than the role's
     freshness threshold is the primary failure phenotype.
   - A role-emission whose `cited_event_id` equals its own
     `event_id` is DEFECTIVE (self-citation forbidden).
   - A citation chain forming a cycle (A→B→C→A) is DEFECTIVE
     (detected during audit).
   - Adversarial peer stale-citation gaming: observability is
     symmetric, not cryptographically enforceable; the
     Director-as-substrate-observer-of-record (PDR-074 §F) is the
     escalation path.
8. **Composition with adjacent ADRs**:
   - ADR-183 — `cited_event_id` is field-axis, not tag-axis;
     orthogonal.
   - ADR-184 — sync kind + urgency are also field-axis; no overlap.
   - ADR-185 — auto-acceptance metadata + citation-binding are
     complementary (citation is producer-side; auto-acceptance is
     consumer-side).
   - ADR-186 — the `lifecycle` event kind (where heartbeats live)
     now carries `cited_event_id` per §Decision item 3 above.
9. **Implementation status**: schema implementation, CLI flag
   landing, and watcher-render landing are deferred to the follow-on
   substrate-implementation plan. ADR-188 names the _decision_;
   landing the substrate is a separate plan.

**Acceptance Criteria**:

1. ✅ ADR-188 body is ≤ 800 lines (raised from 600 to accommodate the absorbed migration discipline + falsifiability sections).
2. ✅ All §Related cross-links point at extant ADRs/PDRs.
3. ✅ `Status: Proposed` (not Accepted).
4. ✅ §Migration discipline names the migration-window exit criterion AND consumer-first pattern AND cited-event retention AND citation validity AND additionalProperties:false constraint AND migration-window closure signal.
5. ✅ §Implementation status explicitly defers landing to the follow-on plan.
6. ✅ Cross-references PDR-082 + ADR-183/184/185/186 present.
7. ✅ §Decision item 3 specifies `narrative`, `directed`, AND `lifecycle` event kinds.
8. ✅ §Watcher behaviour distinguishes schema-field render from consumer-derived audit token.
9. ✅ §Decision item 6 (CLI surface) describes outcome shape, not specific flag name.

**Deterministic Validation**:

```bash
wc -l docs/architecture/architectural-decisions/188-emission-citation-binding-substrate.md
# Expected: ≤ 600

pnpm markdownlint-check:root docs/architecture/architectural-decisions/188-emission-citation-binding-substrate.md
# Expected: exit 0

rg -n "PDR-082\|ADR-183\|ADR-184\|ADR-185\|ADR-186" \
  docs/architecture/architectural-decisions/188-emission-citation-binding-substrate.md
# Expected: 5 reference categories present
```

**Cycle Complete When**: all 6 acceptance criteria met.

---

#### Cycle 2.2: Reviewer absorption on ADR-188 draft

**Parallel-safety**: parallel reviewer dispatch.

**Starting state**: ADR-188 draft exists.

**File scope**:

- `docs/architecture/architectural-decisions/188-emission-citation-binding-substrate.md` (edit per findings)
- Disposition ledger in this plan's §"Reviewer Absorption Log"

**Reviewer dispatch** (parallel, Sonnet default):

| Reviewer | Lens | Focused question |
|---|---|---|
| `docs-adr-expert` | ADR quality + cluster placement | Is ADR-188 correctly placed in the comms-event substrate cluster (ADR-183/184/185/186 + 188)? Is the lifecycle-kind inclusion clean? Is the migration-window exit criterion observable? |
| `architecture-expert-fred` | cluster compliance + migration discipline verification | Does the absorbed Migration discipline (consumer-first, cited-event retention, citation validity, additionalProperties:false constraint) match the ADR-186 precedent? Is the PDR-079 layer split correctly preserved (abstract types in PDR-082, concrete bindings in ADR-188)? |
| `architecture-expert-wilma` | failure-mode probe against the absorbed Migration rules | Do the absorbed Migration rules close the rotation-race, retraction, multi-writer, and self-citation failure modes from the pre-execution pass? Any new failure modes opened by the absorbed shape? |

**Acceptance Criteria**:

1. ✅ 3 reviewer transcripts captured.
2. ✅ Absorption log records verdict + disposition per reviewer.
3. ✅ Substantive findings absorbed or rejected with rationale.
4. ✅ Post-absorption draft re-passes Cycle 2.1 validation.

**Deterministic Validation**:

```bash
rg -n "ADR-188 Reviewer" .agent/plans/agentic-engineering-enhancements/current/role-emission-citation-binding.plan.md
# Expected: hit on log section

pnpm markdownlint-check:root docs/architecture/architectural-decisions/188-emission-citation-binding-substrate.md
# Expected: exit 0
```

**Cycle Complete When**: all 4 criteria met.

---

#### Cycle 2.3: Land ADR-188 at Proposed status

**Parallel-safety**: sequential.

**File scope**:

- `docs/architecture/architectural-decisions/188-emission-citation-binding-substrate.md`
- `docs/architecture/architectural-decisions/README.md` (entry added)
- `.agent/practice-index.md` (ADR-188 entry, if PDR-082 entry needs the back-cite updated)

**Acceptance Criteria**:

1. ✅ Commit subject ≤ 100 chars, conventional-commits.
2. ✅ ADR README entry present.
3. ✅ Commit lands through husky chain.

**Deterministic Validation**:

```bash
git log -1 --format="%s" | wc -c
# Expected: ≤ 101

rg -n "ADR-188" docs/architecture/architectural-decisions/README.md
# Expected: ≥ 1 hit
```

---

**Phase 2 Complete Validation**:

```bash
pnpm check
```

**Success Criteria**: gate chain green; both PDR-082 + ADR-188 in
repo; all cross-links resolved.

---

### Phase 3: Pattern Memory + Pending-Graduations Registration (≤45 min)

**Foundation Check-In**: Re-read PDR-014 (capture → distil → graduate → enforce),
PDR-067 (surface classification), the existing pending-graduations entries.

#### Task 3.1: Author pattern memory entry

**Starting state**: PDR-082 + ADR-188 lands.

**File scope**:

- `.agent/memory/active/patterns/ground-truth-dependency-of-role-emission.md` (new)

**Substance increment**:

Pattern body sections:

1. **Pattern name**: Ground-Truth Dependency of Role Emission
2. **Phenotype**: every role-emission depends on a substrate of
   ground truth; degenerate-mode emission continues at cadence while
   substrate has moved; "ticking clock" failure mode.
3. **Worked instances** (with comms event ids when available):
   - Director awareness-gap FM × 2 (Misty napkin 2026-05-25 against
     Lunar seat).
   - Heartbeat-content-drift × 6+ (Misty 23:13/23:17/23:22Z; Lunar
     22:24/22:28/22:32Z).
   - Platform Monitor-cron-drift (Misty 23:26→23:47Z silent; Lunar
     23:28→23:45Z silent).
4. **Cross-links**:
   - PDR-082 (the structural cure).
   - ADR-188 (the substrate phenotype).
   - `.agent/rules/validators-must-recompute-not-just-record.md`
     (the same structural shape one layer deeper).
   - `.agent/memory/active/patterns/substrate-pointer-read-as-current-state.md`
     (sibling pattern).
   - PDR-074 §S1 (the doctrine layer this pattern's cure operationalises).

**Acceptance Criteria**:

1. ✅ Pattern file follows the `.agent/memory/active/patterns/` template shape.
2. ✅ ≥3 worked instances recorded with timestamps + author identity.
3. ✅ Cross-links to PDR-082, ADR-188, validators-must-recompute-not-just-record rule, substrate-pointer-read-as-current-state pattern, PDR-074 §S1 present.

**Deterministic Validation**:

```bash
ls .agent/memory/active/patterns/ground-truth-dependency-of-role-emission.md
# Expected: file exists

rg -n "PDR-082\|ADR-188\|validators-must-recompute\|substrate-pointer-read" \
  .agent/memory/active/patterns/ground-truth-dependency-of-role-emission.md
# Expected: 4 reference categories present
```

---

#### Task 3.2: Pending-graduations registration

**Starting state**: pattern memory entry exists.

**File scope**:

- `.agent/memory/operational/pending-graduations/` (NEW dated entry,
  NOT editing existing buffer files that the live team may be touching)

**Substance increment**: dated entry naming the cure shape, the
landed substrate (PDR-082, ADR-188, pattern memory), the graduation
triggers (dual paths per assumptions F4 absorption), and the
back-pressure / blocking classification.

**Acceptance Criteria**:

1. ✅ Entry file follows pending-graduations dated-entry shape.
2. ✅ Cure shape names PDR-082 + ADR-188 + Phase 4 substrate-implementation as the staged cure.
3. ✅ Graduation trigger names **two paths** (per assumptions F4):
   - **Path A (post-substrate)**: third-instance worked validation
     of `cited_event_id` field emissions in a distinct session
     after Phase 4 lands.
   - **Path B (pre-substrate, prose-only)**: third-instance of a
     Director or Heartbeat-emitter agent emitting a citation in
     prose narrative event body (without the schema field) that
     subsequently catches a stale-direction or stale-heartbeat
     failure — also counts toward graduation evidence.
4. ✅ PDR-074 §S1 back-cite is named as a deferred graduation trigger
   (absorbs docs-adr F2): once PDR-082 graduates to Proposed,
   PDR-074's next amendment cycle adds the §S1 → PDR-082 back-cite.
5. ✅ Back-pressure classification: `blocking-on-substrate-tranche`
   (absorbs assumptions F2; reclassified from `informational`).

**Deterministic Validation**:

```bash
ls .agent/memory/operational/pending-graduations/ | grep emission-citation-binding
# Expected: at least one dated entry

rg -n "PDR-082\|ADR-188" .agent/memory/operational/pending-graduations/_emission-citation-binding_.md
# Expected: ≥ 2 references
```

---

**Phase 3 Complete Validation**:

```bash
pnpm check
pnpm agent-tools:fitness-validator --strict-hard
# Expected: no critical, no hard
```

---

### Phase 4 (deferred to follow-on plan; BLOCKING-ON-SUBSTRATE-TRANCHE)

**Reclassified** (absorbs assumptions F2): formerly `informational
deferral`; corrected to `blocking-on-substrate-tranche`. Without
Phase 4, PDR-082 lands as inert doctrine that no agent can act on
(emissions cannot carry `cited_event_id` without the schema). The
falsifiability criterion ("citation older than threshold OR absent
when required") is mechanically auditable only after Phase 4.

**Concrete schedule trigger**: the follow-on plan is authored when
ALL of the following land:

1. PDR-082 + ADR-188 land (Phase 1 + Phase 2 complete on this plan).
2. Owner-ratified team-coordination on schema landing (the live team's
   gate-runner agrees on a tree-green window for the schema migration).
3. The consumer-first migration shape (per ADR-186 precedent absorbed
   into ADR-188 §Migration discipline) is implementable in
   `agent-tools` consumer code.

The Phase 4 follow-on plan is NOT optional; it is sequenced after
this plan. Absent Phase 4, this plan's value claim is not realisable.

**Out-of-scope items for THIS plan** (each becomes a cycle in the
follow-on substrate-implementation plan):

- Schema extension: optional `cited_event_id` field on `narrative`,
  `directed`, AND `lifecycle` event kinds (extended from original
  two-kind scope per fred F1 absorption).
- CLI surface wiring: per-emission citation argument on `comms send` /
  `comms direct` (specific flag name decided during implementation
  per docs-adr WHAT-vs-HOW absorption).
- Watcher rendering: schema-field token `[CITED:<prefix>]` and
  consumer-derived audit token `[STALE]` (distinct token classes
  per fred F5 absorption).
- Per-role substrate-snapshot identifier emission helpers (Director
  comms-event-id helper; Heartbeat active-claims-revision helper).
- Migration discipline implementation (consumer-first deployment;
  cited-event retention enforcement during PDR-080 absorption;
  validity field; additionalProperties:false schema amendment).

---

### Phase 5 (deferred): SKILL + Directive Amendments

**Why deferred**: PDR-082 lands at Candidate. PDR-075's evolution
path (Candidate → Proposed → Accepted via worked-instance accumulation)
applies. SKILL + directive amendments graduate from PDR-082 once it
matures to Proposed (third-instance worked validation post-substrate).
Premature SKILL amendment would couple SKILL stability to a still-Candidate
PDR.

**Out-of-scope items**:

- `start-right-team` SKILL §3 amendment pointing at PDR-082 +
  ADR-188.
- `agent-collaboration.md` Director section amendment pointing at
  PDR-082 as the mechanical-enforcement substrate for §S1.

---

## Reviewer Absorption Log

### Pre-execution reviewer pass (2026-05-25, Briny Fathoming Dock)

Six reviewers dispatched in parallel against this plan: `assumptions-expert`,
`docs-adr-expert`, `architecture-expert-betty`, `architecture-expert-barney`,
`architecture-expert-fred`, `architecture-expert-wilma`. All returned
**PASS-WITH-CONDITIONS**. Owner ratified absorption path B (Narrowed v1)
on 2026-05-25. Absorbed findings recorded below; plan body edited to reflect.

#### Consensus findings absorbed

| Finding | Source | Disposition | Plan edit |
|---|---|---|---|
| Multi-role generalisation overreaches evidence (only Director ≥2 FMs + Heartbeat-emitter ≥6 drift instances have worked instances; Marshal/Reviewer/Curator/Scout are extrapolated) | assumptions F1, betty F2, fred F2, barney F1 | **Absorb** — narrow PDR-082 v1 required scope to Director + Heartbeat-emitter; mark other four roles as "Reserved: convention TBD on worked-instance accumulation" | Phase 1 Cycle 1.1 §"Per-role substrate-snapshot conventions" narrowed; Risk Assessment updated |
| Path defect: `.agent/practice-core/practice-index.md` → `.agent/practice-index.md` | docs-adr F1 (CRITICAL) | **Absorbed mechanically** (perl sweep complete) | All references throughout plan body |
| ADR-188 must extend to `lifecycle` event kind (heartbeat-emitter is named worked instance; ADR-186 binds heartbeats to lifecycle; cluster precedent ADR-183/184/185 cover all three kinds) | fred F1 (BLOCKING), docs-adr F3 | **Absorb** — Cycle 2.1 §Decision extends optional field to `narrative`, `directed`, AND `lifecycle` kinds | Phase 2 Cycle 2.1 §Decision updated |
| PDR-079 layer split leakage: repo-bound substrate names (`active-claims.json`, `tree-state-hash`, `queue-head`) appear in PDR-082's portable contract | fred F2 (BLOCKING), betty F2 | **Absorb** — PDR-082 carries only abstract substrate-snapshot type names (e.g. "claim-state revision identifier"); ADR-188 carries the concrete repo-bound bindings | Phase 1 Cycle 1.1 §3 and Phase 2 Cycle 2.1 §3 split sharpened |
| ADR-188 Accepted while PDR-082 Candidate is a maturity inversion | betty F4 (CONDITION), barney F4, docs-adr F5 | **Absorb** — ADR-188 lands at `Status: Proposed`, not Accepted; moves to Accepted on first worked-instance of implemented substrate | Phase 2 Cycle 2.1 §"Status" amended; Cycle 2.3 acceptance criteria amended |
| Citation-of-rotated-event race (PDR-080 absorption rotation may delete cited event) | wilma F1 (HIGH) | **Absorb** — ADR-188 §Migration discipline gains "cited-event retention" rule: absorption pass verifies no active citation points to an event before rotating it; broken citations render `[UNRESOLVED]` token | Phase 2 Cycle 2.1 §Migration discipline expanded |
| Citation validity semantics undefined (retracted events) | wilma F2 (HIGH) | **Absorb** — ADR-188 names a `validity` field convention; citing a retracted event is DEFECTIVE; retraction triggers active-citation sweep | Phase 2 Cycle 2.1 §Migration discipline expanded |
| Multi-writer schema migration coordination missing | wilma F4 (HIGH), betty F5 | **Absorb** — ADR-188 adopts ADR-186's consumer-first migration pattern: consumers handle field-present + field-absent before any emitter lands; emitter follow-on at next natural cycle; named migration-window closure signal | Phase 2 Cycle 2.1 §Migration discipline expanded |
| Self-citation + tautological chains undefined | wilma F3 (MEDIUM) | **Absorb** — ADR-188 §Falsifiability: citation MUST NOT equal own event_id; cycle detection in audit | Phase 2 Cycle 2.1 §Falsifiability expanded |
| Heartbeat cron-loop revision-drift under high churn | wilma F5 (MEDIUM) | **Absorb** — ADR-188 §"Per-role conventions" heartbeat binding: audit checks cited-revision recency AND additive-only churn since cite | Phase 2 Cycle 2.1 §3 (Heartbeat row) expanded |
| Schema `additionalProperties: false` blocks silent additive extension | betty F5 (informational), fred F3 | **Absorb** — ADR-188 §Migration discipline names this hard constraint explicitly | Phase 2 Cycle 2.1 §Migration discipline expanded |
| PDR-074 §S1 will read as superseded substance once PDR-082 lands; back-cite deferred | docs-adr F2 | **Absorb** — pending-graduations entry (Task 3.2) explicitly tracks PDR-074 §S1 back-cite as a graduation trigger | Task 3.2 acceptance criteria amended |
| PDR-080 missing from bidirectional cross-link list | docs-adr F4 | **Absorb** — §Documentation Propagation Commitment includes PDR-080 back-cite (deferred to PDR-080 next amendment) | §"Documentation Propagation Commitment" updated |
| ADR-188 CLI surface names specific flag `--cited-event-id` (HOW, not WHAT) | docs-adr (WHAT-vs-HOW) | **Absorb** — Cycle 2.1 §"CLI surface" narrowed to outcome shape ("agent-facing CLI MUST expose per-emission citation argument"); flag name deferred to follow-on implementation plan | Phase 2 Cycle 2.1 §"CLI surface" amended |
| `[STALE]` watcher token needs ADR-185-style derived-token discipline | fred F5 | **Absorb** — Cycle 2.1 §"Watcher behaviour" distinguishes schema-field render `[CITED:<prefix>]` from consumer-derived audit token `[STALE]`; computation surface named | Phase 2 Cycle 2.1 §"Watcher behaviour" amended |
| Phase 4 deferral classified `informational` but is a soft blocker (PDR-082 lands as inert doctrine without substrate) | assumptions F2 | **Absorb** — Phase 4 reclassified `blocking-on-substrate-tranche`; concrete trigger named: "next tree-green window after PDR-082 lands AND owner-ratified team-coordination on schema landing" | Phase 4 reclassified; pending-graduations entry updated |
| Phase 3 graduation trigger circular on Phase 4 evidence | assumptions F4 | **Absorb** — pending-graduations entry names two graduation-trigger paths: (a) third-instance worked validation post-substrate; (b) prose-body citation evidence in narrative events pre-substrate (also counts) | Task 3.2 acceptance criteria amended |
| Reviewer fan-out disproportionate (4 per cycle × 2 = 8 dispatches) | assumptions F3, barney F5 | **Absorb** — Cycle 1.2 narrowed to 3 reviewers (docs-adr + assumptions + barney); Cycle 2.2 narrowed to 3 reviewers (docs-adr + fred + wilma); 6 total instead of 8 | §"Reviewer Scheduling" updated; Cycles 1.2 + 2.2 acceptance criteria amended |
| Phase 0 Task 0.1 grep pattern uses literal pipes (shell-parsing risk) | assumptions F5 | **Absorb** — single-quote all rg patterns containing pipe chars; standardise across deterministic-validation commands | Phase 0 + later cycles' validation blocks |

#### Findings not absorbed (with rationale)

| Finding | Source | Rationale for non-absorption |
|---|---|---|
| Defer entire PDR + ADR pair until second-session evidence (Phase 3 only this session) | barney F3 (strongest single recommendation) | **Owner-ratified rejection 2026-05-25**: path B (Narrowed v1) chosen; barney's path A explicitly considered and not selected. The narrowed v1 absorbs F1 + F4 + F5 (overreach, premature-Accepted, reviewer over-dispatch) without requiring full deferral. |
| Amend PDR-074 directly rather than authoring new PDR-082 | barney F2 (clarify) | **Considered and rejected**: PDR-079 §"Worked-instance pair" pattern favours new PDR for portable contract paired with new ADR for repo-bound phenotype. Amending Candidate PDR-074 in-place couples PDR-082's scope (which spans heartbeat-emitter, a separate role) artificially to PDR-074's Director-only framing. |
| Adversarial peer integrity (signatures / crypto verification) | wilma F6 (LOW) | **Acknowledged, no absorption**: per wilma's own disposition — observability is symmetric not enforceable; the Director-as-substrate-observer-of-record per PDR-074 §F is the cure path; cryptographic integrity is out-of-scope for this plan and not raised by tonight's evidence. |
| Add CHANGELOG.md + `.agent/practice-core/index.md` to propagation surfaces | docs-adr (suggestion) | **Partially absorbed**: §"Documentation Propagation Commitment" now names both surfaces explicitly with verification rather than assumption; the deterministic-validation cycle confirms whether the existing PDR landings have updated these surfaces (sampling PDR-076a/b/077/078/079/080/081 lands). |

### Phase 1 (PDR-082) reviewer absorption — per-cycle log

_(populated during Cycle 1.2 — the 3-reviewer pass per consensus narrowing)_

### Phase 2 (ADR-188) reviewer absorption — per-cycle log

_(populated during Cycle 2.2 — the 3-reviewer pass per consensus narrowing)_

---

## Risk Assessment (post-absorption)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Doctrine-by-analogy: PDR-082 adds shape PDR-074/075 already partially cover | Low | Medium | Pre-execution barney probe surfaced this; absorbed by sharpening PDR-079 layer split (PDR-082 abstract, ADR-188 concrete) and narrowing scope to evidenced roles |
| Phase 4 substrate-deferral leaves PDR-082 inert | High | High | **Reclassified to BLOCKING-ON-SUBSTRATE-TRANCHE** per assumptions F2; concrete schedule trigger named in §Phase 4; pending-graduations entry's Path B (prose-body citation evidence) lets graduation begin pre-substrate |
| Multi-role generalisation overreaches evidence | (was Medium) | (was Medium) | **ABSORBED** — PDR-082 v1 narrowed to Director + Heartbeat-emitter; other four roles marked Reserved |
| Plan collides with live team's mid-cycle work | Low | Medium | Cycle 0.3 verifies zero claim/comms overlap; new PDR-082/ADR-188/plan files have unique paths; no shared substrate edited |
| Reviewer fan-out exceeds quota envelope | Low | Low | Sonnet default per reviewer (memoried "Opus-team quota ceiling"); 4 reviewers per cycle, sequential phases |
| `cited_event_id` field design proves unsuitable post-landing | Low | High | ADR-188 names migration discipline; field is optional from landing; ADR can amend before implementation lands |

---

## Plan-Body First-Principles Check

Per `.agent/rules/plan-body-first-principles-check.md`:

1. **Shape clause**: each cycle's deliverable is doctrine substrate
   (PDR/ADR/pattern/registration), not a vendor or framework
   assertion. The acceptance criteria check observable doctrine
   properties (cross-link integrity, falsifiability section presence,
   migration discipline), not vendor behaviour.
2. **Landing-path clause**: PDR-082 and ADR-188 file paths are
   constrained by `.agent/practice-core/decision-records/README.md`
   and `docs/architecture/architectural-decisions/README.md`. The
   numbered-PDR / numbered-ADR convention is in effect; PDR-082 +
   ADR-188 are the next available slots. The pattern memory file
   and pending-graduations file paths follow established conventions
   verified in Phase 0.
3. **Vendor-literal clause**: no vendor API values; the only schema
   field name (`cited_event_id`) is internal to `comms-event.schema.json`
   and is named by ADR-188's authoring decision, not lifted from a
   vendor surface.

---

## Foundation Document Compliance Checklist

- [ ] **principles.md - First Question**: Verified the simpler shape (single field + single PDR + single ADR) cannot be further simplified without losing the structural cure.
- [ ] **principles.md - No Type Shortcuts**: N/A (doctrine plan; no product types added).
- [ ] **principles.md - Quality Gates**: All gates pass per Phase 1/2/3 validation commands.
- [ ] **agent-collaboration.md - Director section**: Verified PDR-082 composes with §S1 without doctrinal duplication.
- [ ] **metacognition.md - Cure Shape**: Verified the cure is structural (substrate citation-binding), not doc-patch (a new prose instruction to Directors).
- [ ] **PDR-079 - PDR-vs-ADR portability**: Verified PDR-082 is portable contract; ADR-188 is repo-bound phenotype.

---

## Dependencies

**Blocking prerequisites**:

- None. Phase 0 verifies live-team safety; if Phase 0 fails, the
  plan halts before any substrate edit.

**Related plans**:

- `post-m1-attestation-tidy-up.plan.md` — in-flight by the live
  team; non-colliding scope.
- Follow-on (yet to be authored): substrate implementation plan
  (Phase 4 items).

**Beneficial prerequisites**:

- Live team's PDR-077/078/079 land cleanly (already landed per
  recent commits 7c2f85f4 / 9725ae09 / e8bc6781).
- The `cited_event_id` field's exact name reviewed by
  architecture-expert-fred at Cycle 2.2 before ADR-188 lands.

**Minimum shippable shape without beneficial prerequisites**:

- PDR-082 + pattern memory entry + pending-graduations registration.
  ADR-188 can defer to next session if reviewer fan-out surfaces a
  blocker.

---

## Success Criteria

### Phase 0 (Foundation verification)

- ✅ Doctrine landscape verified (no existing cure in flight).
- ✅ New-PDR shape verified against PDR-074-amendment alternative.
- ✅ Live-team coordination safety verified.

### Phase 1 (PDR-082)

- ✅ PDR-082 lands at Candidate status.
- ✅ Reviewer absorption log preserved.
- ✅ Cross-links bidirectional with PDR-074/075/078/079/080.

### Phase 2 (ADR-188)

- ✅ ADR-188 lands at Accepted status.
- ✅ Reviewer absorption log preserved.
- ✅ Migration discipline explicit; implementation deferred.

### Phase 3 (Pattern + pending-graduations)

- ✅ Pattern memory entry routes durable knowledge to its home.
- ✅ Pending-graduations registration enables formal graduation post-substrate.

### Overall

- ✅ The ticking-clock failure mode (PDR-074 §S1 under load) has a
  named structural cure with falsifiable enforcement criterion.
- ✅ The multi-role generalisation is captured at the portable
  contract layer (PDR-082) without overreaching evidence for
  individual roles at the substrate layer (ADR-188 acknowledges
  per-role evidence variance).
- ✅ Live team's mid-cycle work was not perturbed.

---

## Consolidation

After Phase 3 completes, run `/oak-consolidate-docs` to graduate
settled content, rotate the napkin, and update the practice-index.
The follow-on substrate-implementation plan is authored separately
in `current/` once owner ratifies the doctrine direction.

---

## Notes

### Why this matters (system-level)

**Immediate value**:

- **Director role**: degeneration to ticking-clock becomes
  falsifiable from comms alone; peers can detect and surface stale
  direction without Director self-discipline.
- **Heartbeat role**: content-drift becomes mechanically prevented;
  templated bodies emit current state by substrate binding.
- **Marshal, Reviewer, Curator, Scout**: same structural cure
  applied per role's substrate.

**System-level impact**:

- **Autonomy primitive**: the "Owner action is not a valid cure"
  memoried rule is satisfied — the cure is substrate, not owner
  intervention.
- **Doctrine-by-analogy failure mode**: a recurring failure shape
  named by the metacognition directive gets a structural cure shape
  validated against real evidence.
- **Multi-agent coordination resilience**: under load, the team's
  emission accuracy degrades gracefully (peers detect staleness)
  rather than silently (peers act on stale direction).

**Risk of not doing**:

- PDR-074 / PDR-075 mature to Proposed/Accepted with the
  self-discipline framing intact; tonight's worked instances become
  audit trail rather than cure-shape evidence; the failure mode
  recurs in future multi-agent sessions.

### Alignment with foundation documents

**From principles.md** (paraphrase):

> Could it be simpler? — Yes: one PDR + one ADR + one optional schema
> field is the minimum-viable structural cure.

**From metacognition.md**:

> "Default the cure to make the documentation generated by the
> implementation rather than fix the current copy of the documentation.
> Doc patches are once-cures; structural cures amortise across future
> agents."

**From agent-collaboration.md Director section** (composed via
PDR-074 §S1):

> "Is my mental model still consistent with the comms stream?" —
> becomes a property of every emission, mechanically observable,
> rather than a question the Director asks themselves under load.

---

## References

- Source reflection: `/Users/jim/.claude/plans/your-role-is-fundamentally-playful-russell.md`
- Doctrine landscape:
  - PDR-074 (Director value): `.agent/practice-core/decision-records/PDR-074-director-value-is-mind-coherence-per-owner-attention.md`
  - PDR-075 (Director substrate-writing): `.agent/practice-core/decision-records/PDR-075-director-substrate-writing-discipline.md`
  - PDR-078 (Liveness-heartbeat): `.agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md`
  - PDR-079 (PDR-vs-ADR portability): `.agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md`
  - PDR-080 (Coordination-event absorption): `.agent/practice-core/decision-records/PDR-080-coordination-event-absorption-is-signal-driven.md`
  - ADR-183/184/185/186 (comms-event substrate cluster)
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/agent-collaboration.md`
  - `.agent/directives/metacognition.md`
- Worked-instance evidence:
  - Misty Drifting Sail napkin entries 2026-05-25 (Director awareness-gap FM × 2; heartbeat-content-drift × 6+)

---

## Implementation Notes

### Key insight

PDR-074's S1 is _correctly-shaped doctrine_ — the Director's mental
model must stay consistent with the comms stream. The structural
defect is not in the doctrine but in the _mechanism_ (self-discipline
fires the check; load degrades the check; staleness escapes). The
cure shape mirrors PDR-078's move for liveness: convert the implicit
property into substrate-emitted observable.

### Migration path

1. **Phase 0**: verify the doctrine landscape (the cure is not
   already in flight) and team coordination safety.
2. **Phase 1**: land PDR-082 doctrine (portable contract).
3. **Phase 2**: land ADR-188 phenotype (repo-bound substrate
   shape).
4. **Phase 3**: land pattern memory + pending-graduations route.
5. **Phase 4** (follow-on plan): substrate implementation (schema
   extension, CLI wiring, watcher render).
6. **Phase 5** (follow-on, post-Proposed): SKILL + directive
   amendments.

### Minimal risk

- No product code lands.
- No shared substrate (schema, active-claims.json, pending-graduations buffer files
  the live team is touching) is edited.
- All new files (PDR-082, ADR-188, pattern memory, pending-graduations
  dated entry) are unique paths; no collision with live team's
  cycle scope.
- Reviewer fan-out at Sonnet default keeps Opus quota envelope safe.
- Multi-phase staging lets the plan halt cleanly between phases if
  owner direction changes.

---

## Future Enhancements (Out of Scope)

- Substrate implementation (Phase 4) — separate plan.
- SKILL / directive amendments (Phase 5) — graduate from PDR-082
  Proposed.
- Per-role substrate-snapshot identifier helpers in `agent-tools`
  (e.g. `pnpm agent-tools:collaboration-state -- cite-event-id`).
- Audit tooling: post-hoc freshness audit command that scans
  `.agent/state/collaboration/comms/` and reports stale-citation
  defects.
- ADR-186 amendment: heartbeat-body binding to active-claims
  revision (the heartbeat-content-drift cure shape, deferred until
  PDR-082 substrate lands).
