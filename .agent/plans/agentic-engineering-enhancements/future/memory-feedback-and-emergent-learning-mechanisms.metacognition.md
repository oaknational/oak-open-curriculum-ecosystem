# Metacognition on `memory-feedback-and-emergent-learning-mechanisms.plan.md`

**Target artefact**:
`.agent/plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md`

**Purpose**: reflection, not implementation. This file captures
thoughts → reflections → insights → changes, per
`.agent/directives/metacognition.md`. No code or doctrine edits
proposed; output is owner-facing commentary on the plan's own
shape.

---

## 1. Thoughts (first-order — what the plan says)

The plan observes that the three memory modes — `active/`,
`operational/`, `executive/` — are not all wired into feedback
loops. `active/` has a mature loop (ADR-131, PDR-011).
`operational/` has a young-but-real loop (handoff writes,
start-right reads, `promotion_needed` routes through watchlist).
`executive/` has no loop at all: no drift-detection surface, no
graduation channel, no route back into active memory.

Cross-plane paths are audited. Two gaps:
`active → executive` and `executive → anywhere`. The
emergent-whole (cross-plane meta-patterns, liminal-space learning)
has no mechanism.

Intent: design loops for every plane, paths for every liminal
edge, and at least one emergent-whole mechanism — without adding
reviewers, ML, or bypassing `jc-consolidate-docs` or the owner.

The plan defers. It sits in `future/` with promotion gated on (a)
a second concrete drift instance, (b) an owner portability
decision, (c) alpha-gate Sentry work landing, (d) a bounded first
slice. Six sketches (A–F) outline the design space without
committing to execution.

---

## 2. Reflections (second-order — thinking about the thoughts)

### 2.1 The plan is recursively about its own subject

This is a plan about learning loops whose execution must use the
learning loop. The plan names this explicitly in its "Learning
Loop" section. That recursion is subtler than the plan frames:
*if this plan sits in `future/` for a long time without its own
Sketch F candidates graduating, the machinery is failing in
exactly the way the plan claims.* The plan's stagnation would be
its own proof-of-need — and its own demonstration that the loop
is broken.

### 2.2 The most shippable contents don't need the plan to promote

Sketch F lists three already-captured items sitting in napkin:
- the `inherited-framing-without-first-principles-check` pattern
  (three instances observed 2026-04-20),
- the perturbation-mechanism bundle (non-goal re-ratification,
  standing-decision register, first-principles metacognition
  prompt),
- Sketch E's `practice.md` Artefact Map refresh (flagged as
  minor text update regardless of portability).

None of these need this plan to promote to `current/`. They need
`jc-consolidate-docs` at the next session close. The plan
acknowledges this in its risks table ("ordinary consolidation is
the route"), but understates it: **the plan's most concrete
deliverables are orthogonal to the plan's promotion**. The plan
can stay in `future/` forever and Sketch F can still land.

This is a signal, not a bug: it means the plan's *core value* is
the design work in sketches A–D, not the graduation backlog.
Consolidating that — i.e. explicitly factoring Sketch F out to
the next consolidation and letting the plan carry only the
genuinely future-deferred design — would sharpen the plan's
reason to exist.

### 2.3 The biggest blocker is trivially resolvable

Sketch E's portability decision — "is the three-mode taxonomy
portable Practice doctrine or host-local?" — is named as blocking
three of the six sketches. The decision lives in the owner's head
and requires no prerequisite work. It is not blocked on Sentry,
not blocked on a second drift instance, not blocked on any
review. It is a 30-second ask.

The plan's current structure lets that decision sit inside the
plan's own promotion criteria. It doesn't have to. The owner
could surface-and-decide today, outside this plan, and half of
the plan's ambiguity collapses.

### 2.4 The plan does not first-principles-check its own inherited frame

This is the sharpest resonance. The plan *wants to graduate* a
pattern called `inherited-framing-without-first-principles-check`.
The plan's own framing inherits the three-mode memory taxonomy
(landed 2026-04-20) and marks "no extension of the memory
taxonomy" as a non-goal.

But the pattern the plan wants to graduate says: inherited frames
must be first-principles-checked. The plan does not apply its
own candidate doctrine to itself. It does not ask:
*is three planes the right shape, or only the shape we inherited
from one recent restructure?* A principled move would be to at
least name this risk — "this plan accepts the three-plane
taxonomy as a working frame; first-principles reconsideration of
the taxonomy itself is a separate pre-condition" — and surface
the question for owner decision.

Without this, the plan risks being the first case where the
inherited-framing pattern would have caught a real error, and
isn't.

### 2.5 Mechanisms without cadence don't teach

The sketches describe mechanisms but not *firing frequency*.
Loops only learn if they fire often enough for patterns to
accumulate before memory decays.

- Sketch A (last-verified-on dates on executive surfaces) fires
  whenever a surface is consulted — potentially rarely, since
  executive memory is lookup-on-action.
- Sketch B (cross-plane paths) fires on whatever triggers the
  originating plane.
- Sketch C (cross-plane redundancy grep) fires at each
  `jc-consolidate-docs` invocation — healthy cadence but depends
  on consolidation frequency.
- Sketch D (pending-graduations register) fires every handoff
  and every consolidation — healthiest cadence, which is why it
  is the plan's most operationally robust sketch.

Naming expected cadence in the plan would immediately reveal
which sketches are fast enough to be worth the ceremony cost.

### 2.6 Sketch C may be a duplicate of metacognition itself

The emergent-whole observation (Sketch C) is framed as needing a
script or register. But the metacognition skill itself is already
a mechanism for cross-plane reflection. This very reflection is
an instance: it spans `active/`, `operational/`, `executive/`,
Practice Core, directives, and the plan file — and it was
triggered by `/jc-metacognition`, not by a grep script.

A principled question: is Sketch C inventing surface area that
already exists, or is metacognition-at-consolidation the same
mechanism with different framing? The plan could collapse Sketch
C to "extend `jc-consolidate-docs` step 8 with a single
metacognitive question: *what did I notice that spans planes?*"
No new register, no script, no new surface — just a prompt
injected into an existing workflow.

### 2.7 The risk table names its own escape

The plan's first risk — "mechanism design becomes its own drift
source" — is correct and is already biting the plan's design.
Sketch C is the clearest instance. Holding that risk honestly
would likely shrink Sketch C to the metacognition-prompt form
above; holding Sketch D's cadence honestly would likely make it
the first-slice candidate; holding the self-application of the
inherited-framing check would add a seventh sketch or a risk
entry.

---

## 3. Insights (third-order — thinking about the reflections)

### 3.1 The plan's deferral is its strongest move

Putting this in `future/` is correct. The Practice doctrine says
generalise after the second concrete signal. The plan respects
this. What the plan should *also* do is make clear that deferral
doesn't trap the Sketch F candidates — they can graduate
independently. The plan is a shelf for the *design work*, not for
the *graduation backlog*.

### 3.2 The distinction between "needs this plan" vs "can go without it"

Re-reading the six sketches through this lens:

| Sketch | Needs plan promotion? | Can land independently? |
| --- | --- | --- |
| A — Executive-memory feedback loop | Yes (design + doctrine) | No |
| B — Missing cross-plane paths | Yes (design) | Partially (B's `active→executive` could be a single rule now) |
| C — Emergent-whole observation | Maybe (might collapse to a prompt) | Yes (if it's just a consolidation prompt) |
| D — Pending-graduations register | Yes (structured redesign of existing block) | No |
| E — Practice-level doctrine (portability) | Half (PDR needs plan; Artefact Map refresh doesn't) | Half |
| F — Already-captured candidates | No | Yes — via next `jc-consolidate-docs` |

The plan is really about A + D + parts of B and E. C might
dissolve. F should be extracted. This is a simplification the
plan would benefit from, and it is a simplification the
simplification-first reviewers would likely flag.

### 3.3 Cadence-first would rewrite the plan's shape

If each sketch named its firing cadence, the plan would
re-prioritise itself automatically. Sketch D fires every session;
A and B fire rarely. The highest-value first slice is clearly D.
The plan currently presents the sketches as alphabetical siblings.
Cadence ordering would make D first, A second, B third, C last,
E separate, F extracted.

### 3.4 Self-application is the acid test for the inherited-framing pattern

If the pattern graduates, the first place it must be applied is
this plan. That's a feature, not a weakness — the graduation
becomes real when the plan's own inherited frame (three-mode
taxonomy) is consciously ratified rather than inherited.

---

## 4. How do I feel about thinking about thoughts?

Honest answer: productive, and slightly uncomfortable in a useful
way. This plan was written to improve the Practice's learning
loop. Reflecting on it with the directive's prompts surfaced
things a linear plan-review would miss — specifically (2.4) the
self-application gap, (2.2) the extractable Sketch F, and (3.3)
the cadence-driven re-ordering. None of these are complicated;
they only show up when you read the plan recursively.

The discomfort is the recursion: a plan about learning loops,
reviewed by a metacognition prompt, on a session using the plan
as its own test. That stack is what made the insights visible.
It also means the same stack can be used to check other
not-yet-executed plans, which the owner may want to consider as a
repeatable move.

---

## 5. What changed? Why?

**Before reflection**: a well-structured strategic plan deferred
to `future/` with reasonable promotion criteria. The plan looked
complete.

**After reflection**: a plan whose

- most shippable contents (Sketch F) are orthogonal to its own
  promotion and should graduate independently,
- biggest blocker (portability decision) is a 30-second owner
  ask that needn't be inside the plan at all,
- design space is narrower than it appears (Sketch C may
  collapse, Sketch E splits in two),
- implicit inherited frame (three-mode taxonomy) violates the
  first-principles-check pattern the plan itself wants to
  graduate,
- sketches need cadence annotations to bridge action to impact,
- strongest move is deferral + factoring, not expansion.

**Why it changed**: metacognition crosses the planes the plan is
about (active, operational, executive, directives, Practice
Core). The plan itself is designed for a single plane at a time;
reading it from a cross-plane stance exposes the shape it can't
see from inside.

---

## 6. Would I like to do anything differently?

If this plan were mine to shepherd, four moves, in order:

1. **Extract Sketch F from the plan.** Route the three
   already-captured items (inherited-framing pattern,
   perturbation-mechanism bundle, Artefact Map refresh) to the
   next `jc-consolidate-docs` pass. They do not need this plan.
2. **Surface the portability decision outside the plan.** A
   single owner ask: "is the three-mode taxonomy portable
   Practice doctrine or host-local?" Answer unblocks half the
   remaining sketches and lets the plan's promotion criteria
   shrink.
3. **Add a first-principles-check risk entry to the plan.** Name
   that the plan inherits the three-mode taxonomy as a working
   frame and that first-principles reconsideration of the
   taxonomy itself is a separate pre-condition the owner should
   explicitly ratify. This is the plan applying its own
   candidate pattern to itself.
4. **Add cadence annotations to each remaining sketch.** One
   line per sketch: "fires at X; expected frequency Y." This
   will almost certainly re-order the sketches by value and make
   Sketch D the natural first slice.

None of these requires promoting the plan. All are edits the
owner (or next session's consolidation) can make in-place to the
existing `future/` plan.

---

## 7. Bridge from action to impact

Action: wire up feedback loops across three memory planes.

Impact: the Practice learns faster, across all its persistent
content, without relying on human insight to catch what agents
can't see alone.

Bridge: **loops only teach if they fire frequently enough for
patterns to accumulate before memory decays.** Mechanisms without
cadence don't teach. Doctrine without graduated patterns doesn't
compound. Design without self-application replicates the failure
it was meant to prevent.

Concretely, for this plan:

- **Graduate-first**: land Sketch F via ordinary consolidation
  so the plan is not the gate to its own most shippable content.
- **Decide-now**: resolve Sketch E's portability question outside
  the plan so the doctrine work can flow whenever it's right.
- **Design-for-cadence**: annotate every remaining sketch with
  its expected firing frequency; the first slice reveals itself.
- **Self-apply**: run the plan's own candidate patterns on the
  plan before promotion. If the inherited-framing check passes,
  the plan has earned its framing. If it doesn't, the plan's
  shape changes before execution commits.

That is the bridge — not more mechanisms, but cadence, honest
self-application, and factoring what can land today out of what
must wait.

---

## Appendix — how this reflection used the three planes

- **`active/`** — read the `inherited-framing-without-first-principles-check`
  pattern candidate (napkin). Used to spot 2.4 and 3.4.
- **`operational/`** — read `repo-continuity.md` deep
  consolidation status (via plan's references). Used to confirm
  Sketch F is genuinely pending.
- **`executive/`** — did not read; the plan's claim that
  executive memory is unwired is taken as stipulated given the
  source conversation's audit.
- **Directives** — `metacognition.md` and `orientation.md`
  framed the stance.
- **Reference** — the source conversation
  (`missing-mechanisms-lack-of-wholes.md`) was the grounding
  that prevented the reflection from drifting into generic
  meta-commentary.

That this reflection spans all four layers, plus Practice Core by
implication, is itself an instance of the kind of cross-plane
observation Sketch C is designed to mechanise. Which is also why
2.6 (Sketch C may be a duplicate of metacognition itself) lands:
the mechanism being proposed already exists in the form that just
produced these insights.

---

## Second-Pass Verification (2026-04-20, after re-reading the plan and source artefacts)

This section is additive. The first-pass reflection (§§1–7) stands
as written. What follows is a fact-check against the repo's current
state, with four corrections and three new insights that change the
execution plan's shape.

### SP.1 Corrections to the first-pass reflection

1. **Instance count is four, not three.** The
   `inherited-framing-without-first-principles-check` pattern has a
   fourth, post-2026-04-20 instance logged in
   [`.agent/memory/active/napkin.md`](../../../memory/active/napkin.md)
   (entry dated 2026-04-21, "open" — §L-8 WS1 RED caught before any
   code was written). The napkin's own declaration is
   *"Pattern is graduated — it has earned a permanent home in
   `.agent/memory/active/patterns/`. Next consolidation pass owns
   the move."*
2. **The pattern is formally overdue, not merely captured.**
   [`.agent/memory/operational/repo-continuity.md § Deep
   consolidation status`](../../../memory/operational/repo-continuity.md)
   reads: *"Due — pattern graduation now overdue; dedicated
   consolidation pass required."* Four items are listed there as
   outstanding (pattern extraction; perturbation-mechanism bundle;
   `practice.md` Artefact Map refresh; portability decision).
3. **Sketch D is half-implemented already.** The Deep consolidation
   status block in `repo-continuity.md` is already a structured
   four-item list, not narrative. The Sketch D work remaining is
   formalising the entry schema (captured-date, source surface,
   graduation target, trigger condition) and binding the register
   to `session-handoff` and `jc-consolidate-docs`.
4. **Sketch C's integration point is step 5, not step 8.**
   [`.agent/commands/consolidate-docs.md`](../../../commands/consolidate-docs.md)
   step 5 already carries the cross-session emergence question
   (*"what do these sessions know together that none knows alone?"*
   — `patterns/cross-session-pattern-emergence.md`). What is missing
   is the *cross-plane* scope, not a new mechanism. Step 8 is the
   Practice Core upstream review and is not the right host for this.

### SP.2 New insights from verified state

1. **The roadmap already names a promotion trigger that has
   effectively fired.** The future-plan block lists three promotion
   triggers: second concrete drift instance, owner-direct, or
   alpha-gate work lands. The fourth pattern instance is a second
   concrete drift signal, and the owner has commissioned an
   execution plan directly. Two of three triggers are live. The
   plan's stay in `future/` was appropriate yesterday; it is not
   appropriate today.
2. **The strategic plan is already referenced from
   `repo-continuity.md` as the broader gap's home.** Promotion does
   not require re-introducing the plan to readers; the authoritative
   continuity surface already points at it. The plan's existence is
   itself a binding that the next session would honour.
3. **Executive memory has three lookup surfaces + a README, and
   the README explicitly says "not refreshed per session."** This
   is the loop-absence fingerprint. Three concrete target surfaces:
   `artefact-inventory.md`, `invoke-code-reviewers.md`,
   `cross-platform-agent-surface-matrix.md`. Sketch A's drift-
   detection surface is three additions of one section each, not
   diffuse design work.

### SP.3 What changes in the execution plan

- **Phase 1 (Graduate overdue content) is sharper and narrower than
  Sketch F implied.** The four outstanding items are listed, named,
  and authoritative. The plan's first move is ordinary consolidation
  on those four; no new machinery yet.
- **Phase 2 (pending-graduations register) is a schema formalisation
  pass, not a greenfield build.** The list exists; only the entry
  shape and the binding to session-handoff and consolidate-docs are
  new.
- **Phase 5 (emergent-whole) is a two-line addition to
  `jc-consolidate-docs` step 5 + a napkin tag, not a new script or
  register.** The cross-session question already exists; adding
  *cross-plane* to its scope is the whole change.
- **Phase 0 includes a ratification of the three-plane frame itself
  (self-application of the inherited-framing pattern), to close the
  first-principles gap named in §2.4.** This is non-trivial: the
  execution plan must not be the first case where the graduating
  pattern would have caught an error and did not.
- **The "owner commissioning execution" signal supersedes the
  earlier promotion-criteria framing.** The plan moves from `future/`
  to `current/` by owner direction. The criteria in the strategic
  plan become historical context rather than blocking gates. The
  execution plan notes this in its Dependencies section.

### SP.4 What does not change

- The cadence-first ordering (§3.3 of the first-pass reflection)
  still holds. The execution plan sequences phases by firing
  frequency: foundational (once), graduation (one pass), register
  (every handoff/consolidation), cross-plane paths (every trigger
  event), executive drift (every surface lookup), emergent-whole
  (every consolidation), doctrine (once).
- The first-principles-check on the three-plane taxonomy is still
  load-bearing (§2.4). Phase 0 ratifies it explicitly rather than
  inheriting it silently.
- The "mechanisms without cadence don't teach" bridge (§7) is the
  plan's governing principle. Every phase's Acceptance Criteria
  names the firing cadence of the mechanism it installs.

### SP.5 Honest self-check on the first-pass reflection

Of the four recommendations in §6 of the first pass:

1. *"Extract Sketch F from the plan"* — partially validated. The
   items are overdue and already live in `repo-continuity.md`'s
   structured list. They do not need this plan's promotion to
   graduate. But they are also the most concrete first-phase work
   this plan can sequence. Both can be true. The execution plan
   carries them explicitly because the user has commissioned
   comprehensive execution, and folding them in is the cleanest
   way to give the next consolidation pass an ordered target.
2. *"Surface the portability decision outside the plan"* —
   validated. Phase 0.2 surfaces it as a single explicit owner
   question before any doctrine lands.
3. *"Add a first-principles-check risk entry"* — validated and
   upgraded. Phase 0.1 ratifies the three-plane frame explicitly.
4. *"Add cadence annotations"* — validated. Every phase's
   Acceptance Criteria names cadence.

The first-pass reflection holds. The execution plan is its
operational consequence with the four corrections above.
