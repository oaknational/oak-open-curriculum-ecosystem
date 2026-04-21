# Next-Session Record — `memory-feedback` thread

**Authored**: 2026-04-21 (metacognition + execution-plan session close).
**Last refreshed**: 2026-04-21 (Session 3 of the staged
doctrine-consolidation plan **LANDED 6/6 under bundle rhythm** —
three new portable PDRs [PDR-027 Threads/Sessions/Agent Identity,
PDR-028 Executive-Memory Feedback Loop, PDR-029 Perturbation-
Mechanism Bundle] + one mid-bundle portable PDR [PDR-030
Plane-Tag Vocabulary, from docs-adr-reviewer OWNER-DECISION 1] +
two amendments [PDR-011 thread-scope, PDR-026 per-thread-per-
session]; all six owner-approved per PDR-003;
`docs-adr-reviewer` ran mid-cycle on bundle + supplementary pass
on PDR-030 + PDR-026 refactor, findings applied; Practice Core
CHANGELOG updated; README index updated; seven Due register
items graduated; Samwise identity row `last_session` remains
2026-04-21; next landing target for this thread is Session 4).
**Consumed at**: next session that picks up the `memory-feedback`
thread (not necessarily the next session overall — the product
thread `observability-sentry-otel` has its own next-session record
at [`../next-session-opener.md`](../next-session-opener.md) and
retains priority).
**Lifecycle**: delete on session close once its landing target has
been reported per PDR-026; rewrite if the landing target needs
re-stating for a further session.

---

## Thread identity

- **Thread**: `memory-feedback`
- **Thread purpose**: install feedback loops across the three-mode
  memory taxonomy; graduate the four overdue Practice items;
  install emergent-whole observation; land the supporting doctrine.
- **Branch**: currently `feat/otel_sentry_enhancements` (because
  that is the session's active branch); thread work is markdown-
  only and does not require a dedicated branch until Phase 1
  execution begins. Owner may assign a dedicated branch at Phase
  0 close.

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Samwise` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* (not exposed to the agent in its context; owner can record) | `drafter` / `initiator` | 2026-04-21 | 2026-04-21 |

**Identity discipline** (per the proposed rule at
[`README.md`](README.md)): when a session joins this thread, it
adds a row to the table; it does not overwrite, rename, or collapse
existing rows. Same platform/model/agent_name → update
`last_session` on the existing row; different → new row.

## Landing target (per PDR-026, as amended 2026-04-21)

**Updated 2026-04-21 (Session 3 close)** — Session 3 of the
staged doctrine-consolidation plan LANDED 6/6 under bundle
rhythm. Next landing target for this thread is Session 4
(Family A + Family B tripwire installation, now doctrinally
grounded).

### Session 3 outcome (for audit)

Six artefacts landed, all owner-approved:

1. ✅ **Task 3.1** — PDR-027 *Threads, Sessions, and Agent
   Identity* (new portable PDR). Establishes threads as
   the continuity unit, sessions as time-bounded agent
   occurrences, identity schema, and the additive-identity
   rule.
2. ✅ **Task 3.2** — PDR-028 *Executive-Memory Feedback
   Loop* (new portable PDR). Drift-detection surface
   convention + plane-origin tag graduation channel +
   cross-plane scan step; defines pending-graduations
   register portably.
3. ✅ **Task 3.3** — PDR-029 *Perturbation-Mechanism Bundle*
   (new portable PDR). Family A (Classes A.1 + A.2) and
   Family B tripwire design; platform-parity load-bearing;
   self-application two-phase framing (ratify then
   install).
4. ✅ **Task 3.4** — PDR-011 thread-scope amendment
   (Accepted). Continuity pipeline framed as thread-scoped
   at upper lifecycle, session-scoped at lower; per-thread
   next-session records permitted.
5. ✅ **Task 3.5** — PDR-026 per-thread-per-session
   amendment (Accepted). Landing commitment clarified;
   cross-thread spread named anti-pattern; session-open
   structure updated to name thread alongside target.
   Opportunistic Notes/Graduation-intent structural
   refactor applied.
6. ✅ **PDR-030** *Plane-Tag Vocabulary* (new portable PDR;
   authored mid-bundle). Unifies origin (`Source plane:`)
   and span (`cross_plane:`) tag forms; extension discipline
   requires PDR amendment; conditional on multi-plane
   memory organisation.

**Session-scoped decisions recorded**: bundle rhythm (owner
choice at open); drafting order 3.1 → 3.5; mid-bundle PDR-030
authored after `docs-adr-reviewer` OWNER-DECISION 1; OD-3 and
OD-4 from supplementary review pass accepted as-drafted
(frontmatter canonical; migration boundary soft).

**Reviewer discipline**: `docs-adr-reviewer` mid-cycle pass on
the five-artefact bundle (P0 index-hygiene + eight P1 + P2 nits
applied); supplementary pass on PDR-030 and PDR-026 refactor
(P2 applied; OD-3 and OD-4 surfaced to owner and accepted
as-drafted).

### Mid-arc checkpoint 1 (per plan §Session Discipline §2)

**Question**: Do Sessions 4, 5, 6 still make sense against
the doctrine just landed?

**Review**:

- **Session 4** (tripwire installs) — *more* concretely
  grounded than before. PDR-029 names Family A and Family B
  layers, platform-parity constraints, and the two-phase
  install requirement; PDR-027 defines identity schema that
  Class A.2 protects; PDR-028 defines drift-detection
  convention that four executive-memory surfaces must adopt;
  PDR-030 fixes the tag vocabulary that Family B Layer 2
  consumes. Session 4 acceptance criteria already align with
  PDR-029 requirements; the bundle closes the exposure window
  on the passive-guidance pattern that Session 4 installs are
  countering. **Verdict**: proceed as planned; no amendments
  needed.
- **Session 5** (outgoing triage per PDR-007) — unchanged;
  the bundle did not alter PDR-007 or the outgoing triage
  scope. **Verdict**: proceed as planned.
- **Session 6** (holistic fitness exploration) — unchanged;
  the bundle did not alter the fitness-as-exploration scope.
  Worth noting: Family B meta-tripwires from PDR-029 may
  surface taxonomy-seam questions that intersect with Session
  6's fitness scope; this is anticipated and useful.
  **Verdict**: proceed as planned.

**Checkpoint outcome**: **Proceed**. No plan amendments.
Owner confirmation absorbed via acceptance of the bundle
(PDR-029's Consequences §Required names Session 4 installs as
doctrine-mandated; accepting PDR-029 is implicit ratification
of Session 4's scope).

### Session 2 outcome (for audit)

All three deliverables landed:

1. ✅ **Task 2.1** — Napkin rotated (1611 lines → `archive/napkin-2026-04-21.md`);
   distilled merged with 5 new entries (`durable-doctrine-states-
   the-why`, `workflow-scope-≡-continuity-unit-scope`,
   `dry-run-before-recipe`, `platform-neutral-probe-inputs`,
   `self-applying-acceptance-for-tripwire-installs`); fresh
   `napkin.md` at 60 lines with a 2026-04-21 distillation heading
   and a Session 2 close stub.
2. ✅ **Task 2.2** — `repo-continuity.md § Deep consolidation
   status` formalised as a structured pending-graduations register
   with four status bands (graduated / due / pending /
   infrastructure) and ~30 items recast per the schema
   (`captured-date`, `source-surface`, `graduation-target`,
   `trigger-condition`, `status`). Session 1 graduations marked
   `status: graduated` with cross-references. Agent-names registry
   added as `graduation-target: infrastructure` per owner direction
   this session.
3. ✅ **Task 2.3** — `session-handoff.md` gained step 7
   (register refresh — 7a; thread-record identity update — 7b)
   with consolidation-gate and escalation steps renumbered to 8,
   9, 10; `consolidate-docs.md` step 7 preamble extended with an
   explicit "Inputs to the graduation scan" block naming
   distilled + napkin + register.

**Session 2 decision this session**: owner assigned the agent
name `Samwise` to the continuing identity on this thread (same
platform/model as Session 1; `last_session` updated on the
existing row per the additive-identity rule). Owner also
specified the durable mechanism for future agent-name assignment:
a ~1000-name registry, well-distributed by geography, culture,
and time period; sources to be researched from multiple durable
public-domain / open-data lists; no LLM-generation. Captured as
`graduation-target: infrastructure` register item with
`trigger-condition: consumed by Session 4 Task 4.2 identity-rule
install`.

### Next landing target (Session 4)

> **Target**: close Session 4 of the staged doctrine-consolidation
> plan at
> [`../../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md`](../../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md).
>
> Session 4 deliverables (per plan §Session 4 — now doctrinally
> grounded by PDR-029, PDR-027, PDR-028, PDR-030, and the
> PDR-011/PDR-026 amendments landed in Session 3):
>
> 0. **Task 4.0 (tooling prerequisite)** — Author platform-
>    agnostic commit skill at `.agent/skills/jc-commit/` with
>    Claude + Cursor + Codex adapters per PDR-009. Skill reads
>    the repo's commitlint config at invocation time, enumerates
>    header-length and subject-case constraints inline before
>    the agent drafts, and offers a format-check pass before
>    `git commit` runs. Installs under PDR-029's design
>    principles (firing cadence first; two complementary layers
>    target). Formal PDR-029 Class A.3 amendment deferred —
>    install first, observe, amend if a second similar class
>    emerges. Owner-directed fold-in 2026-04-21 (option **b**
>    from session-3-close scheduling question). Consumes the
>    `platform-agnostic-commit-skill` register item.
> 1. **Task 4.1** — Install Family A Class A.1 second layer
>    (standing-decision register surface), update the plan-body
>    rule's forward reference to cite PDR-029 directly, extend
>    `start-right-quick` and `start-right-thorough` to name the
>    standing-decision surface in their grounding order, add
>    AGENT.md citation.
> 2. **Task 4.2.a** — Install Family A Class A.2 session-open
>    identity-registration rule (canonical + Claude adapter +
>    Cursor adapter + AGENT.md citation). Consumes
>    `start-right-quick-missing-threads-step` and
>    `observability-thread-legacy-singular-path` register items.
> 3. **Task 4.2.b** — Install Family A Class A.2 session-close
>    identity-update gate in `/session-handoff`; `pnpm
>    session-handoff:check` with structural thread enumeration
>    from authoritative files (not agent self-reporting); unit
>    tests. Consumes
>    `session-handoff-check-must-enumerate-threads` register
>    item.
> 4. **Task 4.2.c** — Install Family A Class A.2 platform-
>    neutral stale-identity health probe at
>    `agent-tools/src/core/health-probe-agent-identities.ts`
>    with six checks including active-thread ↔ next-session-file
>    correspondence. Consumes `stale-identity-probe-sixth-check`
>    register item.
> 5. **Task 4.3** — Install Family B meta-tripwires
>    (per-consolidation meta-check, accumulation-triggered seam
>    review, orphan-item signal). Install cross-plane path
>    rules; extend `consolidate-docs` step 5 with cross-plane
>    scope; add `cross_plane: true` frontmatter field to
>    `.agent/memory/active/patterns/`; apply PDR-028 drift-
>    detection sections to three executive-memory surfaces;
>    add `Source plane: executive` convention to napkin header;
>    bind napkin tag to `consolidate-docs` step 7a.
> 6. **Task 4.4** — Migrate `observability-sentry-otel` thread's
>    next-session record from legacy singular path to `threads/`.
>    Add distilled citation of `passive-guidance-loses-to-
>    artefact-gravity` pattern. Roadmap sync.
> 7. **Close** — Practice Core `CHANGELOG.md` entry for Family
>    A + Family B installs; `portability:check` parity verified;
>    `architecture-reviewer-barney` + `architecture-reviewer-
>    betty` dispatched (tripwires change boundary/authority
>    shapes per plan Reviewer Scheduling); `onboarding-reviewer`
>    optional spot-check on the newly-installed tripwires' cold-
>    start reliability.

### Preconditions named for Session 4

- **Session 3 bundle landed**: PDR-027, PDR-028, PDR-029, PDR-030,
  PDR-011 amendment, PDR-026 amendment all Accepted. ✅
- **Agent-names registry research.** Session 4 Task 4.2.a
  consumes the Infrastructure register item for a ~1000-name
  well-distributed public-domain names registry. Source
  research (Unicode CLDR, SSA corpora, international
  registries, historical-figure lists; no LLM-generation) is
  pre-session prep. The registry itself does not need to land
  in Session 4 — Session 4 Task 4.2.a installs the rule;
  name-assignment remains owner-directed per-thread as it is
  today.
- **Plan forward-reference resolution.** The plan-body rule at
  `.agent/rules/plan-body-first-principles-check.md` currently
  carries a forward reference to "the Perturbation-Mechanism
  Bundle PDR (pending, Session 3)". Task 4.1 resolves this to
  "PDR-029" as a first step.
- **Identity discipline self-application.** Per PDR-029
  Acceptance 5, the session installing the Class A.2 rule
  MUST itself register on the `memory-feedback` thread
  before writing the rule file. Session 4's first edit is
  therefore the identity row update (using the very rule it is
  about to install).
- **Context budget**: Session 4 is *not* currently flagged as
  at-risk for the three-quarter threshold (PDR drafting was
  the densest work in the arc; installs are denser per-unit
  but fewer artefacts). Natural split points exist at Task 4.2
  boundaries and between Families A and B if pressure emerges.
- **Context budget watch.** Session 3 is flagged alongside
  Session 2 as at-risk for the three-quarter context threshold
  (plan §Session Discipline §3). Five PDR drafts + two amendments
  is substantial. Natural split point is at a PDR boundary if the
  authoring sitting approaches the threshold; do not compress
  drafting quality to fit budget. If a split occurs, the remaining
  drafts become Session 3b's landing target.
- **Register items consumed by Session 3**: seven items in the
  register's *Due* band currently name Session 3 Tasks 3.1–3.5
  as their `trigger-condition`. On Session 3 close, those seven
  items should move to `status: graduated` with cross-references
  to the landed PDR files.
- **Identity**: per the additive-identity rule, if the Session 3
  agent is same platform/model/`agent_name` (Samwise) as the
  existing row, update `last_session`. If different (new
  platform, new model, or new name), add a new row. Session
  handoff step 7b enforces this at session close.

Phase 0 resolution recorded (for historical reference):

- **Three-plane frame**: RATIFIED; meta-tripwires required
  (Family B installs in staged plan's Session 4).
- **Portability**: PORTABLE. All downstream doctrine lands as
  Practice-Core PDRs.
- **Fitness**: NOT blocking Sessions 1–5 of the staged plan;
  Session 6 is a holistic fitness exploration.
- **Experience scan**: separate session with its own plan, after
  staged plan closes.
- **Shape**: staged six sessions with explicit break points.
- **`f9d5b0d2` identity attribution**: accept gap; attribute
  forward from 2026-04-22.

### Session 1 outcome (retained for audit)

1. ✅ **Task 1.1** — `repo-continuity.md § Standing decisions` extended with decisions 5 and 6; 10 `recorded:` lines.
2. ✅ **Task 1.2** — Pattern `.agent/memory/active/patterns/inherited-framing-without-first-principles-check.md`.
3. ✅ **Task 1.3** — Pattern `.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`.
4. ✅ **Task 1.4** — First Family-A tripwire rule `.agent/rules/plan-body-first-principles-check.md` with Claude + Cursor adapters; `portability:check` green; `docs-adr-reviewer` well-formed verdict.
5. ✅ **Task 1.5** — `practice.md` Artefact Map three-mode refresh; Practice Core `CHANGELOG.md` entry; owner-approved per PDR-003.
6. ✅ **Task 1.6** — Experience entry `.agent/experience/2026-04-21-installing-a-tripwire-i-cannot-test.md`.

## Session shape (when this thread is next picked up)

1. **Ground First** per `start-right-quick`: read
   [`../repo-continuity.md`](../repo-continuity.md) end-to-end,
   especially the Active threads section and Deep consolidation
   status.
2. Read this file (`memory-feedback.next-session.md`).
3. Read the execution plan:
   [`../../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](../../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md).
4. Read the metacognition companion (first + second pass):
   [`../../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md`](../../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md).
5. Read the latest napkin entries dated 2026-04-21 (the
   "memory-feedback-plan session" and "fourth-half" entries) for
   cross-plane and passive-guidance context.
6. Re-read the three foundation directives: `principles.md`,
   `testing-strategy.md`, `schema-first-execution.md`.
7. Re-read `metacognition.md` and `orientation.md`.
8. **Apply the first-principles check** (candidate countermeasure
   to the inherited-framing pattern, now at six instances): *"What
   did I inherit here, and has anyone ratified it from first
   principles?"* The execution plan's Phase 0.1 is exactly this
   check applied to the three-plane taxonomy; honour it.
9. **Decide identity before acting.** If you are the same agent
   as the 2026-04-21 drafter (same platform/model, and the owner
   has assigned you the thread's agent name), update
   `last_session` on the existing row. If you are a new agent on
   the thread, add a new row. Do not proceed until the identity
   row is written.
10. Ask the owner for the Phase 0.1 and 0.2 answers. Record them.
    Update this file's Landing target block with whatever Phase
    of the plan becomes next-in-line.

## Standing decisions carried by this thread

- **Three-mode memory taxonomy** is the working frame *pending
  Phase 0.1 ratification*. Do not build on it assuming ratification
  has happened; ratification is itself a Phase 0.1 decision.
- **Graduation of overdue content** (four items in
  `repo-continuity.md § Deep consolidation status`) is the first
  move after Phase 0 closes. These items can *also* graduate via
  ordinary `jc-consolidate-docs` independently of this thread —
  if the next consolidation pass lands before this thread
  resumes, they may already be closed. Re-read the Deep
  consolidation status at resume time.
- **Self-application of the inherited-framing pattern** to this
  plan's own inherited three-plane frame. Phase 0.1 is the acid
  test; do not skip it.
- **Mechanisms without cadence don't teach.** Every phase's
  Acceptance Criteria in the execution plan names a firing cadence;
  preserve that when amending.
- **Owner-gated Core edits.** Per PDR-003, every Practice Core
  edit (including any PDR that lands as part of this thread) is
  owner-drafted or owner-approved before being written. No ad-hoc
  sub-agent dispatch for Core edits.

## Non-goals (carried forward)

- Do NOT spread execution across both the `observability-sentry-otel`
  thread and this thread in the same session. PDR-026 landing
  commitments are per-thread; choose one per session.
- Do NOT extend the three-plane memory taxonomy as part of this
  thread. Taxonomy extension is a separate decision.
- Do NOT start execution plan Phase 1 or later without Phase 0
  owner-gated answers on hand.
- Do NOT bypass `jc-consolidate-docs` as the graduation pathway;
  this thread composes it.
- Do NOT overwrite existing identity rows in the Participating
  agent identities table.

## What lands after this thread completes

- All four overdue items in `repo-continuity.md § Deep
  consolidation status` are marked `graduated`.
- Executive-memory feedback loop doctrine lives in the branch-
  appropriate location (portable PDR or host-local doctrine).
- Cross-plane paths exist as rules, tags, or conventions.
- `jc-consolidate-docs` step 5 asks the cross-plane question at
  every invocation.
- The thread itself is archived; this file is deleted per PDR-026.

## What NOT in this thread

Work that lives in other threads and should be noticed but not
pursued from inside this thread:

- `observability-sentry-otel` — Sentry/OTel public-alpha integration.
  Authoritative next-session record at
  [`../next-session-opener.md`](../next-session-opener.md).
- Other queued plans in the `agentic-engineering-enhancements`
  collection (reviewer gateway upgrade, mutation testing
  implementation, Sentry specialist capability) — none of them
  belong to this thread.
