# Threads

**Proposed 2026-04-21 during the memory-feedback-plan session.**
Lightweight convention; not yet ratified as Practice doctrine. The
formal PDR is a candidate for the next `jc-consolidate-docs` pass,
bundled with the three-plane memory taxonomy portability decision
(see [`repo-continuity.md § Deep consolidation status`](../repo-continuity.md)
and the memory-feedback execution plan's Phase 6).

## What a thread is

A **thread** is a named stream of work that persists across
sessions and may be touched by multiple agents over time. Threads
are the continuity unit. A *session* is a time-bounded agent
occurrence that participates in one or more threads.

Currently active threads (2026-04-24):

- `observability-sentry-otel` — product thread; Sentry/OTel public-
  alpha integration on branch `feat/otel_sentry_enhancements`.
- `agentic-engineering-enhancements` — Practice thread; documentation
  roles, continuity surfaces, and fitness-pressure remediation.
- `cloudflare-mcp-security-and-token-economy-plans` — product/security
  planning thread; Cloudflare MCP public-beta gate and token-efficient MCP
  tool-use strategy.

Archived threads:

- `memory-feedback` — Practice thread; feedback loops across the
  three-mode memory taxonomy, emergent-whole observation, pending-
  graduations register, executive-memory drift detection.

## What lives in this directory

One `*.next-session.md` file per active thread. Each file contains:

- **Thread identity** — which thread this record belongs to.
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
| [`<slug>.next-session.md`](.) (this dir) | One thread's next-session landing target **and lane state** (workstream surface retired 2026-04-21 Session 5; see [`../workstreams/README.md`](../workstreams/README.md)) | Short-horizon landing; long-lived lane state |
| [`../../state/collaboration/conversations/`](../../state/collaboration/conversations/) | One structured async decision topic | Operational state; open until `resolution`, then retained as evidence |
| [`../tracks/`](../tracks/) | Tactical per-session coordination cards | Ephemeral; resolve/delete at session close |

Thread records are durable cross-session continuity and lane state. Do
not copy decision-thread bodies into them; cite the decision-thread file
when a decision affects the next safe step. Use the napkin for session
learning and surprises, not for live ownership or decision requests.
At handoff, summarise only open/stale decision threads that change the
thread's next safe step; ordinary closed threads remain evidence by path.

## Identity schema

Each thread's next-session file carries a structured identity block
at the top. Fields:

- `platform` — e.g. `claude-code`, `cursor`, `codex`, `gemini`.
- `model` — canonical model id (e.g. `claude-opus-4-7-1m`).
- `session_id_prefix` — first 6 characters of the harness session
  ID, if available; `unknown` otherwise.
- `agent_name` — optional persistent name for the agent-on-this-
  thread; chosen by the owner or a descriptive default. The name
  carries across sessions so a resuming agent can take the existing
  identity (same agent, new session) or add a new identity (a
  second agent joining).
- `role` — free-form short label (e.g. `drafter`, `executor`,
  `reviewer`, `initiator`).
- `first_session` / `last_session` — dates the identity first
  touched and most recently touched the thread.

## Proposed rule (candidate; not yet ratified)

> When a session joins an active thread, it **adds an identity** to
> the thread's identity list. It does **not** overwrite, rename, or
> collapse existing identities. If the session is the same
> platform/model/agent_name as an existing identity, it updates
> `last_session` on that identity rather than adding a new one.

This rule becomes a `.agent/rules/*.md` entry once ratified as a
PDR at the next consolidation pass.

## Starting a session on a thread

Use this checklist when picking up a thread in a new session. A
chat opener that invokes this checklist only needs to name what is
unique to the session (thread name, plan reference, any
session-specific signal); the checklist handles the rest.

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
  `/jc-metacognition` against the plan if uncertain.

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
- Session number and plan reference (path to the plan + which
  session within it, if multi-session).
- Any owner-chosen session-scoped decision (e.g. "Bundle rhythm
  chosen for this session" per a plan's optional branches).
- Optional: pointer to the next-session record's landing target
  block for convenience.

The chat opener should **not** restate the checklist above. If an
opener finds itself listing grounding order, identity discipline,
context-budget rules, or close discipline, that is passive-guidance
drift — the surfaces already hold them. Shorten the opener; the
checklist fires on arrival.
