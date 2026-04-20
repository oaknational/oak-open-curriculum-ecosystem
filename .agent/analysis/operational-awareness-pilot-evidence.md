# Operational Awareness Pilot — Evidence

**Captured**: 2026-04-20
**Lane**: Operational Awareness and Continuity Surface Separation
**Pilot type**: Single-session dogfooding on the Phase 2 scaffolding
**Scenarios run deliberately**: 1, 6, 4, 5
**Scenarios deferred to organic trigger**: 2 (two parallel agents), 3
(handoff from one track without trampling another)

**2026-04-20 addendum — tracks are git-tracked, not gitignored.** The
initial Phase 2 scaffolding treated `tracks/*.md` as session-local
gitignored state. Owner correction (mid-Phase-3): multi-agent and
multi-location collaboration on a track happens via git. Tracks are
therefore git-tracked. Single-writer-per-card still holds; multiple
cards per collaborative track disambiguate via filename. This
inversion strengthens the model:

- Scenarios 2 and 3 are no longer "hard to simulate from a single
  session" — they are naturally exercised by any multi-session
  branch life where one session writes a card and another session
  reads or adds its own card.
- Scenario 1's recovery path includes reading any committed track
  cards alongside the workstream brief.
- Cross-location coordination now rides the same channel (git) as
  everything else in the repo — no new coordination mechanism
  introduced.

## Pilot framing

The OAC plan Phase 3 asks for a six-scenario pilot exercising the
three-surface model (`.agent/state/repo-continuity.md` +
`.agent/state/workstreams/<slug>.md` +
`.agent/runtime/tracks/<...>.md`). Scenarios 2 and 3 require actual
multi-agent parallelism and cannot be honestly simulated from a
single session. They are deferred to the first organic multi-agent
moment (next session that opens a parallel worktree or dispatches a
concurrent agent). The remaining four scenarios are runnable from a
single session and are the focus here.

---

## Scenario 1 — Ordinary single-agent resume

**Setup**: Simulate a fresh session with no conversation context.
The agent must recover state from the three surfaces in authority
order.

**Actions**:

1. Read `.agent/state/repo-continuity.md` (63 lines populated).
2. Read `.agent/state/workstreams/observability-sentry-otel.md`
   (the primary workstream brief per repo-continuity).
3. Read `.agent/runtime/tracks/operational-awareness-continuity--claude-opus-4-7--feat-otel-sentry-enhancements.md`
   (the current tactical track card).

**Result**: **PASS.** All recovery-relevant state is present across
the three files:

- Active workstreams identified (observability + OAC).
- Primary vs. current-session focus distinguishable.
- Plugin migration plan's pending plan-time review status known.
- OAC Phase 3 pilot's in-progress state known.
- Invariants in force captured (11 items including the five
  guardrails installed 2026-04-20).
- Next safe step concrete and actionable.

**Recovery size**: ~220 lines total across the three surfaces, vs.
1545+ lines in `session-continuation.prompt.md`. **~85% reduction**
in recovery-read size for equivalent state recovery.

**Friction observed**:

- Ambiguity in the field naming "Primary workstream brief" in
  `repo-continuity.md`. The observability lane is the branch's
  canonical primary, but THIS session's actual execution is on the
  OAC lane. The field currently points at observability (branch-
  primary) but a resumer may reasonably expect it to point at
  the session-primary. Possible resolution: rename to
  "Branch-primary workstream brief" and add a separate
  "Current session focus" field. Captured as promotion candidate.
- No native mechanism for a resumer to identify "is THIS session
  the primary-lane session or a side-lane session?" — must be
  inferred from the track card's claimed territory. Acceptable for
  now; worth watching.

**Verdict**: the surface set recovers state as designed; the
**~85% read-size reduction** is material. The primary-vs-session
ambiguity is a small refinement, not a model failure.

---

## Scenario 6 — Surface disagreement resolution

**Setup**: Identify a place where surfaces make differently-scoped
claims and walk through how authority order resolves.

**Test case**: `repo-continuity.md` next-safe-step says "Continue
OAC Phase 3 pilot scenarios". `workstreams/observability-sentry-otel.md`
next-safe-step says "dispatch assumptions-reviewer + sentry-reviewer
against the migration plan". These look like two different "next
safe steps" — which wins?

**Analysis**: this is **not an authority conflict**. The two claims
are for different scopes:

- `repo-continuity.md` next-safe-step is **session-scoped** — what
  the current agent should execute next in this session.
- `workstreams/*.md` next-safe-step is **workstream-scoped** — the
  next action for the workstream as a whole, regardless of which
  session picks it up.

Authority order (from `.agent/state/README.md`) applies when
surfaces make **mutually incompatible claims about the same scope**.
When claims are same-named fields but different-scope, there is no
conflict to resolve — both are correct for their level.

**Constructed conflict** to exercise the authority order properly:
suppose the OAC plan (active) says "Phase 3 runs all six scenarios"
while `repo-continuity.md` says "Phase 3 runs scenarios 1, 4, 5, 6
only". The plan wins per authority rank #1 over `repo-continuity.md`
rank #2. `repo-continuity.md` is corrected to reflect the plan.

In this session the deferral to four scenarios is **not** a
disagreement with the plan — the plan's Phase 3 Task 3.1 lists six
scenarios WITHOUT mandating they all run in one session; `repo-
continuity.md`'s four-scenario scope is an in-session tactical
choice explicitly recorded as a non-goal.

**Result**: **PASS.** The authority order correctly resolves
same-scope disagreements (plan > contract > brief > track >
prompt). Different-scope claims are not conflicts; they coexist.

**Friction observed**: the plan's "authority order" language in the
Design Contract could be clearer that it is a **tiebreaker for
conflict**, not a **gating rule for different-scope claims**. A
resumer might incorrectly assume that since the contract says "X",
the brief saying "Y" is automatically wrong. Captured as promotion
candidate — `authority-order-resolves-conflict-not-scope`.

**Verdict**: authority order works as designed; the distinction
between conflict-resolution and scope-separation is a documentation
refinement for Phase 4.

---

## Scenario 4 — Stale tactical-card expiry and cleanup

**Setup**: Create a track card with `expires_at` in the past,
exercise the resolve / promote / delete discipline.

**Action**: Create
`.agent/runtime/tracks/expired-test--pilot-fixture--feat-otel-sentry-enhancements.md`
with `expires_at: 2026-04-19T00:00:00Z` (yesterday). The card is a
pilot fixture — no real work behind it.

**Discipline options**:

1. **Resolve** — card's tracked work is complete; remove.
   _Applies when the task or blocker recorded in the card is closed._
2. **Promote** — something on the card should graduate into the
   workstream brief's promotion watchlist or the napkin.
   _Applies when the card recorded a durable observation or insight._
3. **Delete** — card is no longer relevant.
   _Applies when the track is abandoned or the card was speculative._

**For this fixture**: nothing to resolve (no real task), nothing to
promote (fixture only). **Delete** is the correct action.

**Execution**:

```bash
rm .agent/runtime/tracks/expired-test--pilot-fixture--feat-otel-sentry-enhancements.md
```

**Result**: **PASS.** Discipline is mechanical; the three options
cover real cases. Delete leaves no residue since `tracks/*.md` is
gitignored.

**Friction observed**: no native expiry enforcement — a stale card
will sit forever unless an agent actively runs the discipline. A
future refinement could add a cheap check (e.g. a script or a `GO`
skill step) that lists tracks whose `expires_at` has passed. For
markdown-first pilot this is acceptable; worth revisiting in Phase
4 rollout decision.

**Verdict**: the discipline is sound. Automated expiry check is a
candidate Phase 4 refinement, not a Phase 3 blocker.

---

## Scenario 5 — Promotable tactical insight routed into learning loop

**Setup**: Take an observation from the current track card's
`promotion_needed` list and route it through the learning loop.

**Candidate observation** (from the track card, already noted in
watchlist): "whether the two-workstream-brief structure held up
during this session — a signal of whether the compact contract
composes with multi-lane briefs or needs adjustment".

**Routing**:

1. **Track card** → observation captured in `promotion_needed`.
2. **Workstream brief** → moved to `.agent/state/workstreams/operational-awareness-continuity.md`
   `## Promotion watchlist` (already present as
   `workstream-brief-is-compact-state-of-resumption`).
3. **Napkin** → route to `.agent/memory/napkin.md` as an entry
   titled "2026-04-20 — OAC Phase 3 pilot evidence". The napkin
   entry captures the pilot-scenario observations alongside the
   usual surprise/correction narrative.
4. **Distilled** → defer. A single-instance observation is not yet
   a distilled-memory candidate per existing `napkin` → `distilled`
   promotion rules.
5. **Permanent docs** → defer. Not an ADR or rule candidate after
   one instance.

**Result**: **PASS.** Routing works end-to-end. Tactical observation
graduated two steps (track → brief watchlist → napkin) with no
loss of context. Distilled and permanent steps are not triggered by
this single instance, which is correct per existing promotion rules.

**Friction observed**: the promotion-loop edges are well-defined,
but the napkin entry has to be written manually — there is no
native "graduate observation X from track card Y to napkin" helper.
Acceptable for markdown-first; a helper could be a Phase 4 tooling
refinement.

**Verdict**: the promotion edge works. No model failure.

---

## Calibration decision

**Promote.** The three-surface model composes as designed. All four
exercised scenarios passed. Observed friction items are all
refinements (field naming, authority-order documentation nuance,
expiry-check automation, promotion helper), not model failures. No
scenario uncovered a reason to reject or substantially adjust the
markdown-first shape.

**Deferred scenarios** (2 and 3) will be exercised on the next
organic multi-agent moment. If they surface a concurrency failure
that requires adjustment, the plan's Phase 3 Task 3.2 calibration
rule applies: "if markdown-first tactical cards prove insufficient
under bounded concurrency, capture the failure mode and promote
the adjacent sidecars plan rather than stretching this lane into
a database-backed design". That commitment stands.

**Refinements to fold into Phase 4**:

1. Rename `repo-continuity.md`'s "Primary workstream brief" field
   to "Branch-primary workstream brief" and add "Current session
   focus" as a separate field.
2. Amend the Design Contract's authority order language to clarify
   it is a tiebreaker for **same-scope conflict**, not a gating
   rule for different-scope claims.
3. Optional: add an expiry-check helper (script or `GO` skill step)
   that lists stale tracks. Mark as candidate; decide in Phase 4.
4. Optional: add a napkin-promotion helper. Mark as candidate;
   decide in Phase 4.

**Portability posture** (per plan Phase 4 Task 4.2 criteria):

- Works across multiple workstream shapes: **evidenced** — the
  session simultaneously hosted two workstreams (observability and
  OAC) with distinct briefs and one tactical track card; no
  collisions.
- Authority order stable under real parallel use: **partially
  evidenced** — single-agent; scenarios 2 + 3 deferred.
- Tactical surface does not drift into a second memory doctrine:
  **evidenced** — track cards are single-session; promotion routes
  observations to the existing learning loop, not to a parallel
  memory.
- Repo can explain where markdown-first is sufficient vs where a
  sidecar-store design would become necessary: **evidenced** —
  scenarios 2 + 3 deferral note explicitly names concurrency as
  the condition under which sidecars promote.

**Portability criteria partially met.** Full portability evaluation
awaits scenarios 2 + 3 evidence from organic triggers.

---

## Deferred scenarios — organic trigger conditions

### Scenario 2 — two parallel agents, different track cards, same workstream

**Trigger**: Next session that opens a second worktree OR
dispatches a background agent that mutates a track card.

**Watch for**: whether two track cards co-exist without stepping on
each other's claimed-territory fields; whether `session-handoff`
from either track correctly refreshes only that track's card.

### Scenario 3 — session-handoff from one track without trampling another

**Trigger**: First real use of `session-handoff` during scenario 2
conditions.

**Watch for**: whether the workflow doc's "refresh repo-continuity
+ relevant workstream brief + current track card" instruction holds
when multiple track cards exist; whether any cross-writer pattern
emerges that single-writer discipline fails to catch.

Both deferred scenarios will be recorded as addenda to this file
when they trigger.
