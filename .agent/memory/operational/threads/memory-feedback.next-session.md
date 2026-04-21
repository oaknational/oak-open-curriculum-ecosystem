# Next-Session Record — `memory-feedback` thread

**Authored**: 2026-04-21 (metacognition + execution-plan session close).
**Last refreshed**: 2026-04-21 (Session 1 of the staged
doctrine-consolidation plan **LANDED 6/6**; plan Session 4
scope expanded to Class A.2 agent-registration / identity
tripwires with platform parity after owner question 2026-04-21;
next landing target for this thread is Session 2).
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
| *`unassigned`* (owner to name) | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* (not exposed to the agent in its context; owner can record) | `drafter` / `initiator` | 2026-04-21 | 2026-04-21 |

**Identity discipline** (per the proposed rule at
[`README.md`](README.md)): when a session joins this thread, it
adds a row to the table; it does not overwrite, rename, or collapse
existing rows. Same platform/model/agent_name → update
`last_session` on the existing row; different → new row.

## Landing target (per PDR-026)

**Updated 2026-04-21 (Session 1 close)** — Session 1 of the
staged doctrine-consolidation plan LANDED 6/6. Next landing
target for this thread is Session 2.

### Session 1 outcome (for audit)

All six deliverables landed:

1. ✅ **Task 1.1** — `repo-continuity.md § Standing decisions`
   extended with decisions 5 (staged execution as the shape) and
   6 (session break points explicit and protected); 10
   `recorded:` lines total (≥6 required).
2. ✅ **Task 1.2** — Pattern authored at
   `.agent/memory/active/patterns/inherited-framing-without-first-principles-check.md`
   (six instances; three-clause first-principles check).
3. ✅ **Task 1.3** — Pattern authored at
   `.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`
   (three instances per the updated napkin count; Heath-brothers
   tripwire framing).
4. ✅ **Task 1.4** — First Family-A tripwire installed at
   `.agent/rules/plan-body-first-principles-check.md` with
   Claude adapter at `.claude/rules/…md` and Cursor adapter at
   `.cursor/rules/…mdc`; `pnpm portability:check` green;
   `docs-adr-reviewer` verdict: *"Agreed: the rule is
   well-formed"*.
5. ✅ **Task 1.5** — `practice.md` Artefact Map row for
   `.agent/memory/` refreshed to enumerate the three modes with
   read triggers and refresh cadences; Practice Core
   `CHANGELOG.md` entry added; owner-approved per PDR-003.
6. ✅ **Task 1.6** — Experience entry at
   `.agent/experience/2026-04-21-installing-a-tripwire-i-cannot-test.md`.

**Plan amendment this session**: owner surfaced the agent-
registration / coordination gap during Session 1 close. The
pattern Session 1 extracted (`passive-guidance-loses-to-
artefact-gravity`) applied directly to the gap. Staged plan's
Session 3 Task 3.3 was amended to frame Family A as **two
classes** (A.1 plan-body inherited-framing; A.2 agent-registration
/ identity discipline); Session 4 was restructured with new
Tasks 4.2 and 4.3 (and Family B / cross-plane / CHANGELOG tasks
renumbered to 4.4–4.6) adding measurable acceptance criteria for
three Class A.2 tripwires plus a derivable active-agent-register
view. Platform parity is load-bearing throughout (Claude +
Cursor adapters + AGENT.md citation; platform-neutral probe
inputs; cross-platform or out-of-scope).

### Next landing target (Session 2)

> **Target**: close Session 2 of the staged doctrine-consolidation
> plan at
> [`../../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md`](../../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md).
>
> Session 2 deliverables (all three must land; see plan Tasks
> 2.1–2.3):
>
> 1. **Task 2.1** — Napkin rotation per `consolidate-docs` step 6.
>    Extract Patterns / Mistakes / Insights / Lessons from current
>    napkin (now over 1400 lines after Session 1 additions); merge
>    into distilled (compare against existing; add new; update
>    refined; skip duplicate; investigate contradiction); prune
>    distilled entries already captured in permanent documentation;
>    archive outgoing to `.agent/memory/active/archive/napkin-2026-04-21.md`
>    (or appropriate date); fresh `napkin.md` under 100 lines with
>    a distillation heading.
> 2. **Task 2.2** — Formalise pending-graduations register schema.
>    `repo-continuity.md § Deep consolidation status` rewritten
>    from prose-plus-bullets to a structured list per schema
>    (captured-date; source-surface; graduation-target;
>    trigger-condition; status). Existing items recast; Session 1
>    graduations marked `status: graduated` with cross-reference to
>    the new pattern files.
> 3. **Task 2.3** — Bind register to session workflows.
>    `session-handoff.md` gains a step to review/refresh the
>    pending-graduations register; `consolidate-docs.md` step 7
>    preamble names the register as an input.

### Preconditions named for Session 2

- None beyond owner presence. Session 2 is markdown-rotation +
  schema + workflow-binding; no owner-gated Core edits, no sub-
  agent dispatch requirements, no parallel-thread work.
- **Watch**: Session 2 is one of the most at-risk sessions for
  context budget (plan §Session Discipline §3). Napkin rotation
  involves reading 1400+ lines; distilled merge involves
  comparison across many entries. Close at a natural boundary if
  three-quarters of context is reached.
- **Identity**: per the additive-identity rule, if the picking-up
  agent is same platform/model/agent_name as the existing row,
  update `last_session` on that row; if different, add a new row.

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
