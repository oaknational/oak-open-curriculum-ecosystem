# Next-Session Record — `memory-feedback` thread

**Authored**: 2026-04-21 (metacognition + execution-plan session close).
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

State at next-session open on this thread:

> **Target**: Phase 0 of the memory-feedback execution plan is
> closed — owner has returned explicit answers on both owner-gated
> decisions:
>
> - **0.1**: ratification (or amendment) of the three-plane memory
>   taxonomy (`active/` / `operational/` / `executive/`) as the
>   working frame.
> - **0.2**: portability decision on the taxonomy — portable
>   Practice doctrine (PDR in `practice-core/decision-records/`)
>   or host-local doctrine (file in this repo only, recorded in
>   `repo-continuity.md § Standing decisions`).
>
> Both answers land in `repo-continuity.md § Standing decisions`
> (or the Phase 1.2 standing-decision-register artefact, whichever
> exists at that time). Phase 1 (graduate overdue content) becomes
> the immediately-following lane after Phase 0 closes.

Evidence to capture in the napkin or `repo-continuity.md` once
Phase 0 lands:

- The exact wording of the owner's answer to each question.
- The location the answers were recorded.
- Any amendments to the three-plane taxonomy (if the frame was not
  ratified as-is).

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
