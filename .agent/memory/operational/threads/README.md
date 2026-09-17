# Threads

**Proposed 2026-04-21 during the memory-feedback-plan session.**
Lightweight convention; not yet ratified as Practice doctrine. The
formal PDR is a candidate for the next `oak-consolidate-docs` pass,
bundled with the three-plane memory taxonomy portability decision
(see [`repo-continuity.md § Deep consolidation status`](../repo-continuity.md)
and the memory-feedback execution plan's Phase 6).

## What a thread is

A **thread** is a named stream of work that persists across
sessions and may be touched by multiple agents over time. Threads
are the continuity unit. A *session* is a time-bounded agent
occurrence that participates in one or more threads.

The live inventory of currently-active threads lives in
[`../repo-continuity.md § Active Threads`](../repo-continuity.md#active-threads).
Treat the repo-continuity table as the source of truth; this README is
the convention document, not the inventory.

## Directory layout (lifecycle → location)

Records are filed by lifecycle state (owner-directed 2026-06-19):

- **Active** threads → this directory root (`threads/<slug>.next-session.md`).
- **Paused** threads → [`paused/`](paused/) (`threads/paused/<slug>.next-session.md`);
  reactivation is owner-directed. On reactivation, `git mv` the record back to the root.
- **Retired / completed** threads → [`retired/`](retired/)
  (`threads/retired/<slug>.next-session.md`); retained as continuity history, never deleted.

The repo-continuity `§ Active Threads` / `§ Paused Threads` tables and link
definitions point at the lifecycle-correct path. Retired records are absent from
both tables by design and carry a retirement banner (see below).

## What lives in this directory

One `*.next-session.md` file per thread (active at the root; paused and retired in
their subdirectories per the layout above). Each file contains:

- **Thread identity** — which thread this record belongs to.
- **Current continuation** — the branch, invocation pointer, controlling plan,
  next safe step, team expectation, and acceptance bar for the next agent.
- **Participating agent identities** — every session that has
  touched the thread, additive (per the proposed rule: joining a
  thread adds an identity; never replaces).
- **Landing target for the next session on this thread** — per
  PDR-026 (per-session landing commitment).
- **Session shape and grounding order for this thread**.
- **Standing decisions the thread carries forward**.

## Relationship to other operational surfaces

| Surface | Scope | Lifecycle |
| --- | --- | --- |
| [`../repo-continuity.md`](../repo-continuity.md) | All threads; invariants; active-threads index | Long-lived; refreshed per session-handoff |
| [`<slug>.next-session.md`](.) (this dir) | One thread's next-session landing target **and lane state** (workstream surface retired 2026-04-21 Session 5; see [`../workstreams/README.md`] (`../workstreams/README.md`)) | Short-horizon landing; long-lived lane state |
| [`conversations/`](../../../state/collaboration/conversations/) | One structured async decision topic | Operational state; open until `resolution`, then retained as evidence |

Thread records are durable cross-session continuity and lane state. Do
not copy decision-thread bodies into them; cite the decision-thread file
when a decision affects the next safe step. Use the napkin for session
learning and surprises, not for live ownership or decision requests.
At handoff, summarise only open/stale decision threads that change the
thread's next safe step; ordinary closed threads remain evidence by path.

## Retirement-banner convention

A thread record's lifecycle has three states, indexed in
[`../repo-continuity.md`](../repo-continuity.md): **active** (current
session-priority lane, `§ Active Threads`), **paused** (record and
identity history retained, reactivation owner-directed, `§ Paused
Threads`), and **retired/completed** (the work has concluded — e.g. a
single-PR closure thread whose PR merged, or a thread superseded by
another).

When a thread retires or completes, its next-session record stays on
disk as continuity history — it is not deleted (`never-use-git-to-remove-work`;
the identity trail and session context remain evidence). But a record
that simply drops out of both repo-continuity indexes reads as *live* to
the next agent who opens it, who must then cross-reference repo-continuity
to discover it is dead. The cure is a **retirement banner**: a leading
blockquote at the very top of the record (before the `# Next-Session
Record` heading) stating the retired/completed state, the conclusion
date, and where the work concluded. Shape:

```markdown
> **RETIRED — <thread completed | thread superseded> <YYYY-MM-DD>.**
> <one line on how the work concluded — merged PR, superseding thread,
> owner closure>. Retained as continuity history; not a live lane.
> Not listed in `repo-continuity.md` Active or Paused threads.
```

The banner is enforced at consolidation by
[`consolidate-docs` step 7c check 6](../../../skills/knowledge/consolidate-docs/SKILL-CANONICAL.md#thread-register-freshness)
(retired-record banner hygiene), which flags any on-disk record absent
from both indexes whose top lacks a banner and applies the missing
banner as a follow-on diff.

## Identity schema

Each thread's next-session file carries a structured identity block
at the top. Fields:

- `platform` — e.g. `claude-code`, `cursor`, `codex`, `gemini`.
- `model` — canonical model id (e.g. `claude-opus-4-7-1m`).
- `session_id_prefix` — first 6 characters of the PDR-027 seed (the
  untagged platform session id on cloud seats; the harness session id
  otherwise — PDR-027, 2026-08-24 amendment), if available; `unknown`
  otherwise.
- `agent_name` — optional persistent name for the agent-on-this-
  thread; chosen by the owner or a descriptive default. The name
  carries across sessions so a resuming agent can take the existing
  identity (same agent, new session) or add a new identity (a
  second agent joining).
- `role` — free-form short label (e.g. `drafter`, `executor`,
  `reviewer`, `initiator`).
- `first_session` / `last_session` — dates the identity first
  touched and most recently touched the thread.

## The additive-identity rule (ratified — PDR-027 owns it)

The rule is ratified doctrine in
[PDR-027 §The additive-identity rule](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
joining a thread ADDS an identity row (never overwrite, rename, or
collapse); a session matching an existing row on the canonical
`(agent_name, id)` key UPDATES that row's `last_session`. A mid-session
model switch is a continuous seat — update the row's `model` field, never
add a row (PDR-027 Amendment Log, 2026-07-08). (This section previously
carried the rule as a pre-ratification candidate; PDR-027 is the home.)

Practical multi-writer note: grep the identity table for your
`session_id_prefix` before adding a row — rotation churn has
produced duplicate rows when two writers each added the same
identity (observed 2026-06-10); a matching identity UPDATES
`last_session`, never adds.

## Starting a session on a thread

Use this checklist when picking up a thread in a new session. A
chat opener that invokes this checklist only needs to name what is
unique to the session (thread name, plan reference, any
session-specific signal); the checklist handles the rest.

The preferred opener is a pointer, not a state dump:

```text
$oak-start-right-team continue <thread-slug> from
.agent/memory/operational/threads/<thread-slug>.next-session.md.
Treat this opener as a hypothesis until live grounding confirms it.
```

Use `start-right-quick` or `start-right-thorough` instead when the session is
not a team session. The continuation record owns current facts; the skill owns
the routing behaviour. Keep volatile state, live commit ids, branch state, next
safe step, and team expectation in the record rather than copying them into a
chat opener or permanent skill text.

### Continuation record template

Thread records should start with a compact current-state block before older
session history:

```markdown
## Current Continuation

- Branch:
- Invocation pointer:
- Controlling plan:
- Next safe step:
- Completed prerequisites:
- Recent relevant commits:
- Team expectation:
- Suggested team split if a team forms:
- Acceptance bar:
```

Use `Team expectation: unknown until live grounding` when no owner-assigned team
shape exists. Do not encode fixed roles unless they have already been assigned
by owner direction or live coordination. Avoid `ready to land` wording in
continuation records unless the work is genuinely uncommitted and pending; once
landed, cite the commit instead.

### Concurrent lanes — a thread is a multi-lane container

A thread holds one or more **concurrent lanes**: independently pickup-able arcs, each
with its own state, branch, and pickup trigger, **active OR deferred**. There is no single
thread-level "next safe step" — several lanes can be "next" at once, picked up in parallel
by different checkouts, separate agents, or collaborators. When a thread carries more than
one live arc, record each as a first-class lane rather than collapsing to one pointer:

```markdown
## Lanes

### Lane: <name> — active | deferred (trigger: <what reactivates it>)
- Branch:
- Controlling plan:
- Next safe step:
- Acceptance bar:
```

A deferred lane still belongs here (marked deferred, with its trigger), not only in a
decision-debt register — a lane entry records *takeable work*. The single-`Next safe step`
`## Current Continuation` block above stays valid for a genuinely single-lane thread;
multi-lane threads use `## Lanes`. (Owner-confirmed general principle 2026-06-14; the
continuity-surface authority is PDR-011. Existing records reconcile to this shape as they
are next touched — not a mass rewrite.)

### Read, in order

1. [`../repo-continuity.md`](../repo-continuity.md) end-to-end —
   especially `§ Active Threads`, `§ Repo-Wide Invariants / Non-Goals`,
   and `§ Deep Consolidation Status`.
2. The thread's next-session record at
   `.agent/memory/operational/threads/<thread-slug>.next-session.md`.
3. The plan referenced in the next-session record's *Landing
   target* block (and any lane-state section in the same
   thread record — workstream surface retired 2026-04-21).
4. Any source surfaces the landing target names (napkin entries,
   pattern files, existing PDRs). Follow the explicit links.
5. Foundation directives: `principles.md`, `testing-strategy.md`,
   `schema-first-execution.md`, `metacognition.md`,
   `orientation.md`.
6. If the plan references
   [`../../../plans/templates/components/session-discipline.md`](../../../plans/templates/components/session-discipline.md),
   read it — it defines the session-count / checkpoint /
   context-budget / metacognition-at-open conventions.

### Before any edits

- **Update the identity row.** Add your row to the thread's
  `Participating agent identities` table per the additive-identity
  rule above. If you match an existing row's
  platform/model/agent_name, update `last_session` on that row
  instead. Do not proceed until the row is written.
- **Apply metacognition at session open** (per session-discipline
  component §4 if the plan is multi-session; always a good
  default): *"What did I inherit here? Has it been ratified from
  first principles? Does its shape still fit?"* Invoke
  `/oak-metacognition` against the plan if uncertain.

### During the session

- Respect context-budget discipline from the session-discipline
  component (wall-clock ~30 min / three-quarters context
  threshold triggers close at next natural boundary).
- Do not cross to a different thread mid-session — PDR-026 landing
  commitment is per-thread per-session.
- Honour the repo-wide invariants and the thread's own standing decisions.

### At session close

- Run `/session-handoff` per its command spec.
- Refresh the thread record (landing outcome, identity row's
  `last_session`, next-session preconditions).
- Delete the thread record's `Landing target` block only when all
  its deliverables have landed and been verified.

### What a chat opener needs to contain

Only the session-unique signal:

- Thread name.
- Pointer to the thread's next-session record.
- Session number and plan reference (path to the plan + which
  session within it, if multi-session).
- Any owner-chosen session-scoped decision (e.g. "Bundle rhythm
  chosen for this session" per a plan's optional branches).
- Optional: a short note about why team routing is expected.

The chat opener should **not** restate the checklist above. If an
opener finds itself listing grounding order, identity discipline,
context-budget rules, or close discipline, that is passive-guidance
drift — the surfaces already hold them. Shorten the opener; the
checklist fires on arrival.
