---
name: "N-Agent Collaboration Experiments"
overview: "Decision-complete plan to validate or refute the N-agent collaboration hypothesis primitives in parallel with real work on active threads. Experiments are observed during real work, never run as standalone exercises; the work itself remains the priority. Revisions are expected as evidence accumulates."
todos:
  - id: e1-activate
    content: "E1 — observe modes / claims / audience / ceremonies / self-correction during ARC A1 + ARC B0 work on observability-sentry-otel. Prompts authored at .agent/prompts/agentic-engineering/collaboration/experiments/E1/."
    status: in_progress
  - id: e1-capture
    content: "Per-session capture: each agent appends [E1]-tagged napkin entry at session-close per the structured surprise format; classifies each observation per falsification-criteria.md; cross-references cures (i)-(x) in pending-graduations."
    status: pending
  - id: e1-analyse
    content: "Cross-session analysis: at the next /jc-consolidate-docs after the third E1 session, aggregate [E1]-tagged napkin entries; tally strengthening / weakening / falsifying observations per primitive; propose graduation, replacement, or amendment."
    status: pending
  - id: e1-reflect
    content: "Subjective reflection: optional after each session, recommended after the third pairing's session — capture in .agent/experience/<date>-<agent>-<theme>.md if texture-shifts emerge."
    status: pending
  - id: e2-author-when-runnable
    content: "E2 (adversarial timestamp drift probe) — author prompts when a session is specifically scoped to test cure (vi); do NOT run E2 instrumentation during ARC A1/B0 work."
    status: pending
  - id: e3-author-when-runnable
    content: "E3 (volume stress test) — synthetic, offline; author and run when a researcher has time outside thread work."
    status: pending
  - id: e4-author-when-runnable
    content: "E4 (mid-task session-boundary handoff) — opportunistic; observe when a real session-budget cut-off occurs naturally; do not engineer one."
    status: pending
  - id: e5-author-when-runnable
    content: "E5 (owner-unavailable + routine decision) — requires explicit owner direction to scope; author when owner signals readiness."
    status: pending
  - id: graduation-pass
    content: "When any primitive accumulates sufficient strengthening evidence (multiple sessions, multiple pairings, zero falsifying), propose graduation to permanent doctrine via /jc-consolidate-docs § graduation scan."
    status: pending
  - id: falsification-handling
    content: "When any primitive accumulates falsifying evidence (multiple instances), amend hypothesis.md and falsification-criteria.md; propose replacement primitive or removal; surface via comms event for owner review before graduation rollback (if any)."
    status: pending
  - id: revise-as-evidence-accumulates
    content: "This plan is decision-complete but expected to be revised. Revisions land as plan-body amendments after each consolidation cycle that produces graduations or falsifications. Track revision history in the plan body."
    status: pending
---

# N-Agent Collaboration Experiments

**Last Updated**: 2026-05-03
**Status**: 🟢 DECISION-COMPLETE / **E1 CLOSED 2026-05-03**; E6 next
**Scope**: validate or refute the candidate primitives of the N-agent
collaboration hypothesis in parallel with real work on active threads.
**Lifecycle**: `current/` — queued and ready. E1 closed
2026-05-03 by owner direction; closure write-up at
`.agent/prompts/agentic-engineering/collaboration/experiments/E1/closure.md`.
E6 (arc-level first-question application) is the next hypothesis;
prompts and discipline updates not yet authored. E2-E5 remain queued
opportunistic.

---

## Priority order — absolute

The function of every session running these experiments is to move
toward a provable mergeable condition so that the upstream API change
work can land in main. **Long-term architectural excellence
([`principles.md § Architectural Excellence Over Expediency`](../../../directives/principles.md#architectural-excellence-over-expediency))
is the priority** — never compromised for any other goal. Experiments
are observed *during* real work, never run as standalone exercises.
If experiment instrumentation would compromise the work, drop the
instrumentation and ship the work; capture observations only insofar
as they fall out naturally.

This priority order is enforced by experiment selection: pick the
experiment whose observation windows fall naturally within planned
work; never reshape the work to fit an experiment.

## Context

The 2026-05-03 Pelagic Washing Anchor ↔ Misty Ebbing Pier session
ran a two-agent collaboration experiment on Task M1 (smoke-tests
harness reconnaissance). The session produced 15 tactical
coordination-improvement points (10 from Pelagic, 5 from Misty)
plus a structural framing pivot: the cures these points name should
be treated as **candidate amendments to a hypothesis under test**,
not as a design to ship. Hypotheses get falsification criteria and
experiments; designs get specifications and defenders. Validated
primitives graduate; falsified primitives are replaced or removed.

The hypothesis is recorded at
[`.agent/prompts/agentic-engineering/collaboration/hypothesis.md`](../../../prompts/agentic-engineering/collaboration/hypothesis.md)
with 10 candidate primitives. Per-primitive falsification criteria
are at
[`falsification-criteria.md`](../../../prompts/agentic-engineering/collaboration/falsification-criteria.md).
Per-experiment briefs and prompts are under
[`experiments/`](../../../prompts/agentic-engineering/collaboration/experiments/).

## Domain boundaries

This plan governs the **observation framework and analysis cycle**
for the hypothesis. It does not govern:

- The work being done on active threads (that is governed by the
  active plans, e.g. `there-is-no-time-hashed-starfish.plan.md`).
- The CLI ergonomics work on `comms reply` / `comms watch` /
  `comms pending` / `comms heartbeat` — that remains routed via
  [`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md)
  in `future/`.
- Graduation of validated primitives to permanent doctrine —
  that runs through the standard `/jc-consolidate-docs` graduation
  scan, not through this plan.

## Non-goals (YAGNI)

- **No standalone experiment runs.** Experiments are observed during
  real work. Engineering an experimental setup that exists for the
  experiment's own sake violates the priority order above.
- **No premature graduation.** Single-session evidence is one data
  point. Graduation requires multiple sessions across multiple
  pairings with no falsifying observations.
- **No pre-authoring of E2-E5 prompts.** Prompts are authored when
  the next session that will run the experiment is imminent. Pre-
  authored prompts go stale.
- **No instrumentation that compromises the work.** This is a
  hard rule. If observation would slow shipping, drop observation.

## Decisions resolved (decision-complete state)

| Decision | Resolution |
|---|---|
| Activation order | E1 ran across multiple agent-pairings 2026-05-03 and closed by owner direction; closure write-up at `.agent/prompts/agentic-engineering/collaboration/experiments/E1/closure.md`. E6 (arc-level first-question application) is the next hypothesis. E2-E5 remain queued; activated only when work produces their target conditions. |
| E1 scope | Observe P1 modes, P3 claims, P5 audience, P6 ceremonies, P10 self-correction during ARC A1 + ARC B0 work. |
| Capture mechanism | `[E1]`-tagged napkin entries per session, structured surprise format, classified per falsification-criteria. |
| Per-session analysis | At session-close, the agent classifies each observation as falsifying / weakening / strengthening which primitive. |
| Cross-session analysis | At `/jc-consolidate-docs` after the third E1 session, aggregate and tally per primitive. |
| Reflection cadence | Light per-session (the napkin entry). Deep at consolidation. Subjective (`.agent/experience/`) optional per session, recommended after the third pairing. |
| Graduation criteria | Multiple strengthening observations across distinct sessions and pairings; zero falsifying. Owner approval required before graduating to ADR/PDR/rule. |
| Falsification criteria | Multiple instances across distinct sessions falsify (per `falsification-criteria.md`). Amendment to hypothesis is amendment-only; owner approval required before rollback of any already-graduated doctrine. |
| Plan revision cadence | As evidence accumulates. Revisions land as plan-body amendments after each consolidation cycle that produces graduations or falsifications. No fixed schedule. |
| Owner gates | Graduation events; falsification of a graduated primitive; activation of E5 (owner-unavailability test). |

The plan is decision-complete. Revisions update specific sections;
the structure stands.

## Experiments (capsule summary; full briefs in `experiments/`)

| ID | Targets | Status | When to run |
|---|---|---|---|
| **E1** | P1 modes, P3 claims, P5 audience, P6 ceremonies, P10 self-correction, **P11 housekeeping ownership** (added 2026-05-03) | **CLOSED 2026-05-03** | ran across Pelagic+Misty / Woodland+Prismatic / Salty+Tidal pairings; primitives confirmed; closure at `experiments/E1/closure.md` |
| **E6** | arc-level first-question application; principle-vs-plan-following at multi-session arc scope | **next** | activates when prompts and discipline updates land; carries the lesson E1 surfaced as the separate concern (coordination is sound; arc-level principle re-application is the bottleneck) |
| E2 | P5 directional context, cure (vi) wall-clock authority | queued | activates when **(a)** cure (vi) wall-clock authority accumulates at least one further weakening observation in an E1 session (current state: twice-witnessed-as-failure-mode 2026-05-03 morning, both as polling-discipline failures, neither as deliberate timestamp drift), OR **(b)** a session is explicitly scoped to validate it under simulated clock-drift conditions across agents. Authoring trigger: when (a) or (b) is imminent — author `experiments/E2/{brief.md, agent-1-*.md, agent-2-*.md}` per the per-experiment subfolder convention. Do NOT author speculatively. |
| E3 | P5, P6, P9 at scale | queued | activates when researcher-time is allocated AND a synthetic event corpus is in scope. Authoring trigger: when a session is imminent. |
| E4 | P10 self-correction, P7 bootstrap fast-path | queued | activates opportunistically when a real session-budget cut-off occurs naturally (do NOT engineer one). Authoring trigger: when a candidate cut-off session is imminent. |
| E5 | open question — owner-proxy mode | queued | activates only when owner explicitly signals readiness to scope. Authoring trigger: explicit owner direction. |

Per-experiment briefs:

- [`experiments/E1/brief.md`](../../../prompts/agentic-engineering/collaboration/experiments/E1/brief.md)
- E2-E5 briefs authored when they activate.

## Capture — per-session

At session-close, every agent participating in the active experiment:

1. Appends an `[E1]` (or other ID) -tagged entry to
   [`.agent/memory/active/napkin.md`](../../../memory/active/napkin.md)
   per the structured surprise format:
   - **Expected** — what you thought would happen.
   - **Observed** — what actually happened.
   - **Why surprising** — the gap between the two.
   - **Generator** — what produced the surprise.
   - **Cure shape** — what would prevent recurrence.
2. Classifies each observation per
   [`falsification-criteria.md`](../../../prompts/agentic-engineering/collaboration/falsification-criteria.md):
   does it falsify, weaken, or strengthen which primitive?
3. Cross-references cures (i)-(x) in
   [`pending-graduations.md`](../../../memory/operational/pending-graduations.md):
   if any cure fired this session, cite it.

## Analysis — per consolidation

At `/jc-consolidate-docs`, after the third session that has produced
`[E1]`-tagged entries (and at every consolidation thereafter):

1. **Aggregate** — collect all `[E1]`-tagged napkin entries since
   the prior consolidation pass.
2. **Tally** — for each primitive in `hypothesis.md`, count
   strengthening / weakening / falsifying observations across the
   aggregated entries.
3. **Decide per primitive**:
   - If strengthening across multiple sessions and pairings, zero
     falsifying → propose graduation. Route via
     `/jc-consolidate-docs § graduation scan`. Owner approval
     required.
   - If multiple falsifying observations → propose replacement or
     removal. Amend `hypothesis.md` and `falsification-criteria.md`.
     Owner approval required if rolling back an already-graduated
     primitive.
   - If weakening or mixed → propose amendment to the primitive's
     wording in `hypothesis.md`; capture the amendment cycle.
4. **Plan revision** — update this plan body's *Decisions resolved*
   table with any new resolutions; add a revision-history line at
   the bottom of the plan citing the consolidation date and the
   changes made.

## Reflection — per session and cumulative

**Per-session reflection** is the napkin entry above. It is
required.

**Subjective-experience reflection** (per
[`.agent/experience/README.md`](../../../experience/README.md)) is
optional per session and **recommended after the third pairing's
session** — texture changes that emerge over the experiment arc are
best captured as they accrue. The experience file is for *what the
work was like*, not *what was done*; technical insight goes to the
napkin and to permanent docs.

**Cumulative reflection** at consolidation: write a short paragraph
in the consolidation pass summarising what the experiment has
revealed about the hypothesis at this point. Include in the
consolidation commit.

## Falsification handling

If a primitive falsifies (per
[`falsification-criteria.md § Falsification process`](../../../prompts/agentic-engineering/collaboration/falsification-criteria.md#falsification-process)):

1. Stop relying on the primitive for the current session if doing
   so is unsafe.
2. Capture in napkin tagged with experiment ID + `[FALSIFY]` flag.
3. Amend `falsification-criteria.md` with the falsifying
   observation cited.
4. Surface to the owner via comms event titled
   `<experiment>-falsification-<primitive>`.
5. Propose the replacement (if any) or argue for removal in the
   next `/jc-consolidate-docs` pass.
6. If the falsified primitive had already graduated to ADR/PDR/rule:
   pause graduation rollback until the owner has reviewed. Do not
   unilaterally rollback graduated doctrine.

## Quality gates

This plan does not produce code. Quality gates apply only to the
work the experiments are observing (the active plans on the threads).

The plan-internal quality gate is:

- Each `[E1]`-tagged napkin entry must include all five fields
  (expected / observed / why surprising / generator / cure shape).
- Each entry must classify observations per `falsification-criteria.md`.
- The consolidation pass that aggregates these entries must produce
  a per-primitive tally before any graduation or falsification
  proposal.

## Risk assessment

| Risk | Mitigation |
|---|---|
| Experiment instrumentation slows shipping | Priority order is absolute; drop instrumentation if it conflicts. Rule named in this plan, the briefs, the prompts, and the README. |
| Single-session evidence treated as graduation-worthy | Decision: graduation requires multiple sessions, multiple pairings. Encoded in *Decisions resolved* and in `falsification-criteria.md`. |
| `[E1]`-tag drops out of napkin entries | Mitigation: prompts explicitly require tagging. Verified at consolidation; missing tags surface as gaps. |
| Falsification cycle never fires (cures pile up without graduating) | Mitigation: P9 (`pending-graduations` register as evolution mechanism) has its own falsification criterion — if cures pile up without throughput, P9 itself falsifies. Self-correcting. |
| Plan goes stale as evidence accumulates | Mitigation: explicit *Plan revision cadence* decision above. Revisions land at consolidation. Revision history at file bottom. |
| Pre-authoring E2-E5 prompts speculatively | Mitigation: explicit non-goal. Prompts authored only when activation is imminent. |
| New primitive emerges that is not in `hypothesis.md` | Mitigation: append-and-test; the hypothesis evolves. Add the primitive to `hypothesis.md` with falsification criteria and route through the same process. |

## Foundation alignment

- **`principles.md § Architectural Excellence Over Expediency`** —
  the priority order section above is a direct application of the
  graduated 2026-05-02 doctrine. Cheap-cure framings are
  categorically excluded from experiment design, capture, analysis,
  and graduation.
- **`testing-strategy.md`** — the experiments are themselves a
  test apparatus, but the apparatus does not run tests; it observes
  real work. Tests of the work itself remain governed by the
  testing strategy.
- **`schema-first-execution.md`** — not directly applicable; this
  plan does not produce code or schemas.

## Lifecycle triggers

This plan is `current/` (queued and ready, E1 active). It moves to
`active/` only if a session begins explicit work on the
plan-internal todos (e.g., authoring an E2 brief, running an
analysis pass). For sessions doing real work on active threads with
E1 observations as a by-product, this plan stays in `current/`.

The plan is **not archived** until at least one primitive has
graduated AND at least one full revision cycle has been recorded.
Archival is a separate decision.

## Learning loop

Per ADR-117, all plans MUST end with running the consolidation
workflow. For this plan, consolidation cadence is:

- **After every consolidation pass** that produces `[E1]`-tagged
  graduations or falsifications, update the plan body's *Decisions
  resolved* table and the *Revision history* below.
- **After E1 closes** (per the acceptance criteria in
  `experiments/E1/brief.md`), run a dedicated consolidation pass
  for E1 specifically: graduate or falsify all primitives E1
  exercised, archive the `[E1]`-tagged napkin entries, and decide
  whether E1's prompts continue to be canonical for future
  observability-sentry-otel sessions or whether a refined E1' is
  needed.

## Revision history

- 2026-05-03 — Plan authored decision-complete by Misty Ebbing
  Pier (claude-code, ba3961). E1 active; E2-E5 queued. No
  observations yet captured; the next session running the E1
  prompts is the first observation opportunity.
- 2026-05-03 (later) — First E1 observation captured by Woodland
  Sprouting Glade + Prismatic Illuminating Eclipse parallel session
  on observability-sentry-otel thread (ARC B0 + ARC A1 landed
  concurrently — `c0d17634` / `23abeabe` / `e86af3e0` / `792c2cad`).
  Eight primitives observed: P1 modes (validated), P2 identity
  (validated), P3 active-claims (strengthened), P5 comms log
  directionality (two-sided falsification candidate — twice-witnessed
  mid-task polling cure), P6 failure-shaped ceremonies (validated
  via three concrete instances), P8 verification ceremony (validated),
  P10 cheap self-correction (validated), shared-state always-includable
  load-bearing at parallel boundaries. **NEW candidate primitive
  P11 — Housekeeping ownership at session-close** added to
  `hypothesis.md` and `falsification-criteria.md` from owner-stated
  observation during this session's handoff. P11 is candidate-not-
  graduation-ripe; first instance witnessed live. Next observation
  windows: ARC A2 (mode-by-mode harness migration) and ARC B1/WS2
  (sentry-node SinkRegistry consumption) — parallelisable; each is
  an additional E1 observation point if executed by ≥2 agents.

## Next-session continuation (2026-05-03 close)

**Active observation context for the next session(s)**:

The E1 experiment continues on the observability-sentry-otel thread
through ARC A2 + ARC B1/WS2 work. Both arcs are parallelisable; the
natural parallel-lane shape repeats the pattern that worked this
session (Orchestrator on plan-body / coordination + Executor on
implementation). The same E1 prompts at
[`experiments/E1/`](../../../prompts/agentic-engineering/collaboration/experiments/E1/)
remain canonical with two minor refinements applied via
`hypothesis.md` and `falsification-criteria.md` updates:

1. **P11 observation requirement** added — every E1 session must
   record an explicit P11 observation at session-close (who owned
   shared housekeeping, whether any leftover-modified-files state
   crossed the session boundary, any friction the rule produced).
2. **Mid-task polling cure twice-witnessed** — Misty 2026-05-03
   morning + Prismatic 2026-05-03 morning both surfaced the same
   discipline failure. Next E1 sessions should treat mid-task polling
   on every significant work boundary as **load-bearing**, not as a
   should-do; record explicitly whether polling fired at every
   waypoint or whether any waypoint was skipped.

**Next-session landing target candidates** (per
`there-is-no-time-hashed-starfish.plan.md` and
`observability-multi-sink-and-fixtures-shape.plan.md`):

- **ARC A2 — Existing-modes migration**: convert `local-stub`,
  `local-stub-auth`, `local-live`, `local-live-auth`, `remote` modes
  to the new canonical harness; convert smoke-assertions/*to
  *.smoke.test.ts; retire `helpers/environment.ts` process.env mutation;
  every existing `pnpm smoke:dev:*` still passes. Atomic-landing-commit
  must flip `describe.skip` → `describe` on the SKIP-UNTIL-A2 blocks
  in `harness/run-smoke.unit.test.ts` and
  `harness/run-smoke.integration.test.ts`. For `remote` mode use
  `createRemoteBootServer` factory.
- **ARC B1 (= WS2) — sentry-node SinkRegistry consumption**: atomic
  rename — `SentryMode` deleted; `FixtureSentryStore` →
  `FixtureCaptureStore`; `ParsedSentryConfig` cross-product
  discriminated union; WS1 RED-arc skip register entries 1+2
  unskip. Independent of ARC A2; parallelisable.

Either order works; both can run in parallel as Orchestrator + Executor
lanes (mirroring this session's shape). If only one agent is available,
ARC A2 first is preferred because it unblocks ARC A3 (no-observability
mode + smoke regression-guard reclassification) which is the
WS4 GREEN dependency.

**Prompt authoring**: the E1 prompts at `experiments/E1/` remain
canonical with the two refinements above absorbed as inline notes —
do not pre-author E2-E5 prompts speculatively. If the next session is
single-agent, drop the bootstrap fast-path note and proceed; the E1
prompts work at N=1 (degenerate boundary condition).
