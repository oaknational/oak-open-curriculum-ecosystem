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

Currently active threads (2026-04-21):

- `observability-sentry-otel` — product thread; Sentry/OTel public-
  alpha integration on branch `feat/otel_sentry_enhancements`.
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
| [`../workstreams/<slug>.md`](../workstreams/) | One thread's lane state ("where are we in this lane") | Long-lived; refreshed when the lane moves |
| [`<slug>.next-session.md`](.) (this dir) | One thread's next-session landing target | Short-horizon; delete on landing per PDR-026 |
| [`../tracks/`](../tracks/) | Tactical per-session coordination cards | Ephemeral; resolve/delete at session close |
| [`../next-session-opener.md`](../next-session-opener.md) | **Legacy singular opener** — transitional; currently holds the `observability-sentry-otel` thread's next-session content | Will be migrated to `observability-sentry-otel.next-session.md` at next consolidation |

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
