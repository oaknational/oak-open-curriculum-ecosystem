# Next-Session Record — `memory-feedback` thread

**Authored**: 2026-04-21 (metacognition + execution-plan session close).
**Last refreshed**: 2026-04-21 (Session 2 of the staged
doctrine-consolidation plan **LANDED 3/3 + extended scope** —
napkin rotation + pending-graduations register schema
formalisation + register-to-workflow binding; agent identity
`Samwise` assigned by owner this session; agent-names registry
captured as Infrastructure item in the register for Session 4
consumption; onboarding-reviewer audit at close surfaced
reliability gaps in Session 2's installs, leading to urgent
`AGENT.md § RULES` tier-citation fix [graduated], 5 new Due
register items, and Session 4 Tasks 4.2.a/b/c scope additions;
next landing target for this thread is Session 3).
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

## Landing target (per PDR-026)

**Updated 2026-04-21 (Session 2 close)** — Session 2 of the
staged doctrine-consolidation plan LANDED 3/3. Next landing
target for this thread is Session 3 (doctrine bundle drafting,
owner-gated).

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

### Next landing target (Session 3)

> **Target**: close Session 3 of the staged doctrine-consolidation
> plan at
> [`../../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md`](../../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md).
>
> Session 3 deliverables (three new PDRs + two amendments; see
> plan Tasks 3.1–3.5). Each owner-gated per PDR-003:
>
> 1. **Task 3.1** — Draft *Threads, Sessions, and Agent Identity* PDR (portable).
> 2. **Task 3.2** — Draft *Executive-Memory Feedback Loop* PDR (portable).
> 3. **Task 3.3** — Draft *Perturbation-Mechanism Bundle* PDR with
>    active-tripwire design covering Family A Classes A.1 + A.2
>    (platform parity load-bearing). Absorbs the `platform-parity-
>    as-probe-prerequisite` register item.
> 4. **Task 3.4** — Amend PDR-011 for thread-scope extension.
>    Absorbs the `workflow-scope-alignment-to-continuity-unit-
>    scope` register item.
> 5. **Task 3.5** — Amend PDR-026 for per-thread-per-session
>    clarification.
>
> On close: Practice Core `CHANGELOG.md` entries for each landed
> PDR + amendment; `docs-adr-reviewer` pass on the bundle; mid-
> arc checkpoint 1 per plan §Session Discipline §2 (review
> Sessions 4–6 against the doctrine just landed; owner decides
> proceed / adjust / pause).

### Preconditions named for Session 3

- **Owner availability for PDR-003 review.** All five drafts are
  Core edits; owner drafts or owner-approves before writing per
  PDR-003 care-and-consult posture. Owner is available for either
  a bundle rhythm (all five drafts → one review sitting → apply
  in order → sign-off) or a sequential rhythm (draft 1 → review
  → apply → draft 2 → …). **Owner chooses the rhythm at Session
  3 open** and the choice is recorded in the thread record as a
  session-scoped decision.
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
