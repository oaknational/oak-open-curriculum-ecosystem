---
pdr_kind: governance
---

# PDR-027: Threads, Sessions, and Agent Identity

**Status**: Accepted
**Date**: 2026-04-21
**Related**:
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(continuity surfaces — this PDR extends the continuity unit from
session to thread; see PDR-011's 2026-04-21 amendment);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing commitment — this PDR clarifies that the
commitment is per-thread-per-session; see PDR-026's 2026-04-21
amendment);
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(grounding discipline — identity registration is a session-open
grounding step);
[PDR-010](PDR-010-domain-specialist-capability-pattern.md)
(specialists dispatched within a thread are session participants
under this PDR's identity model, not thread identities themselves);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(perturbation-mechanism bundle — Family A Class A.2 installs the
tripwires that make the additive-identity rule environmental
rather than passive guidance).

## Context

Agentic engineering sessions are bounded units of work
(PDR-026). Continuity between sessions is a first-class
engineering property carried by named surfaces (PDR-011). What
neither PDR names explicitly is the unit that *persists across
sessions*. A session is the wrong unit for continuity — it is
time-bounded by construction. A workstream or lane is closer but
carries scope semantics ("what is being built") rather than
continuity semantics ("what stream of work am I picking up").

The gap matters in practice because:

1. **Multiple agents on the same stream of work.** A stream of
   work persists across sessions and may be touched by different
   agents (different platforms, different models, different
   owner-assigned names). Without a named unit, each session's
   opener must rediscover who has been working on what and whether
   the current agent is resuming an existing identity or joining
   as a new one.
2. **Multiple streams of work in the same session.** A session
   may touch one stream or more. Without a named unit, "the
   session's work" conflates all streams and the landing-commitment
   discipline loses its target (PDR-026).
3. **Identity drift across sessions.** Without a schema for
   *who* participated, a resuming agent cannot tell whether it is
   the same agent continuing or a different agent taking over. The
   distinction matters for attribution, for context-recovery
   assumptions, and for avoiding silent overwrite of prior
   identities' contributions.

The three gaps share a root: there is no named continuity unit
above the session boundary.

## Decision

**A *thread* is the continuity unit.** A thread is a named stream
of work that persists across sessions and may be touched by
multiple agents over time. A *session* is a time-bounded agent
occurrence that participates in one or more threads. Every agent
session carries an identity; every thread carries an additive
list of the identities that have participated in it.

### Thread

A **thread** is:

- A **named stream of work** (e.g. a product feature, a Practice
  initiative, an investigation).
- **Persistent across sessions** — the thread outlives any single
  session; sessions come and go, the thread continues.
- **Potentially touched by multiple agents over time** — different
  platforms, different models, different owner-assigned names.
- **The continuity unit** — the surface against which continuity
  artefacts (next-session records, workstream briefs, landing
  commitments) are scoped.

A thread is **not**:

- A workstream or lane — workstreams describe *scope* (what is
  being built); threads describe *continuity* (what stream of work
  am I picking up). One thread may span multiple workstreams; one
  workstream may span multiple threads if it is picked up in
  distinct streams of work.
- A branch — branches carry code; threads carry continuity. A
  thread may be markdown-only and never touch a branch; a thread
  that does touch code may move across branches.
- A plan — plans are authored artefacts with scope, sequencing,
  and acceptance criteria. A thread may execute against multiple
  plans; a plan may be executed across multiple threads.

### Session

A **session** is:

- **Time-bounded** — a session opens, work happens, the session
  closes.
- **Carried by one agent** — one platform, one model, one
  owner-assigned name (if assigned), one process of work.
- **A participant in one or more threads** — the session picks up
  a thread (or joins a new one) at open, does work within it, and
  closes.
- **The landing-commitment unit per PDR-026 as amended** — the
  landing commitment is per-thread-per-session; a session commits
  to landing ONE thread's target.

### Identity schema

Each thread carries an **identity list** — an additive record of
every session that has participated in the thread. The schema for
an identity row:

| Field | Meaning | Example |
| --- | --- | --- |
| `platform` | Agent harness / host | `claude-code`, `cursor`, `codex`, `gemini` |
| `model` | Canonical model identifier | `claude-opus-4-7-1m`, `gpt-5-codex`, `gemini-2.5-pro` |
| `session_id_prefix` | First 6 characters of the harness session id if available; `unknown` otherwise | `f9d5b0`, `unknown` |
| `agent_name` | Optional persistent name for the agent-on-this-thread | `Samwise`, `Frodo`; or unset |
| `role` | Free-form short label describing the agent's role on this thread | `drafter`, `executor`, `reviewer`, `initiator` |
| `first_session` | Date this identity first touched the thread | `2026-04-21` |
| `last_session` | Date this identity most recently touched the thread | `2026-04-21` |

`platform + model + agent_name` forms the **identity key**. Two
rows with the same key describe the same identity and MUST be
collapsed into one row with the later `last_session`. Two rows
with different keys describe different identities and remain as
separate rows.

### The additive-identity rule

> When a session joins a thread, it **adds an identity row** to
> the thread's identity list. It does **not** overwrite, rename,
> or collapse existing rows. If the session is the same
> `platform + model + agent_name` as an existing row, it updates
> the `last_session` on that row rather than adding a new one.

Three corollaries:

1. **Joining does not replace.** A new agent picking up the
   thread adds a row; it never rewrites a prior identity row's
   fields to reflect itself.
2. **Same-identity continuation is a last-session update, not a
   new row.** An existing identity resuming writes its new close
   date into `last_session`. This prevents the list from bloating
   with one row per session for agents that stay on a thread for
   many sessions.
3. **Identity is owner-assignable but not owner-mandatory.**
   `agent_name` is optional. A thread with unnamed identities
   still satisfies the schema. Owner may assign a name at any
   time; once assigned, the name becomes part of the identity key
   for subsequent resumption matching.

### Thread scope and the landing commitment

PDR-026 commits each session to landing ONE bounded outcome. This
PDR clarifies what "one" means in the presence of threads:

- A session commits to landing one **thread's** target, not one
  outcome per thread-in-scope.
- Cross-thread spread within a single session — a session that
  both advances thread A and thread B — is an anti-pattern. If
  genuine progress is needed on both, the session opens against
  one thread and explicitly declares non-participation in the
  other for its duration.
- PDR-026's amendment (see PDR-026's 2026-04-21 amendment)
  formally absorbs this per-thread-per-session clarification.

### Relationship to the three-mode memory taxonomy

This PDR composes with the three-mode memory taxonomy (active /
operational / executive). The thread-identity list is
**operational** memory — short-horizon, per-session refreshed,
bound to the next-session record. Institutional continuity
(patterns, PDRs, ADRs extracted from thread work) still lives in
active/ → executive/ memory. Epistemic continuity (surprises,
open questions) still lives in active/ memory. Threads do not
introduce a new memory mode; they introduce a named unit
*within* operational memory.

## Rationale

### Why "thread" as the term

"Thread" inherits natural connotations: streams of conversation,
streams of discourse, streams of work that weave across time and
participants. Alternatives considered and rejected:

- **"Workstream"** — already in use for a different purpose
  (scope-bearing lane artefact). Reusing the term would force an
  awkward rename or produce silent semantic drift.
- **"Lane"** — short, but connotes parallel tracks *within* a
  workstream, not the continuity unit *above* the session.
- **"Project"** — too coarse; multiple threads typically exist
  inside a single repo-scoped project.
- **"Stream of work"** — the definition, but too long for routine
  use. "Thread" compresses the meaning into one word.

The term is widely understood, has low collision with other
vocabulary in the Practice, and generalises cleanly across repos.

### Why the continuity unit must be above the session

A session is by construction time-bounded. Continuity *must* be a
property of something that survives session closure. The
pre-PDR machinery (PDR-011's continuity surfaces, PDR-026's
landing commitment) implicitly assumed the continuity unit was
the *workstream* — but workstreams are scope-bearing, not
continuity-bearing. A workstream can be dormant while its
continuity stream is active elsewhere; a workstream can be
completed while its continuity stream continues into follow-on
work. Conflating the two produced the gaps listed in Context.

### Why identities are additive, not overwritten

Three independent reasons converge:

1. **Attribution matters for audit.** A thread touched by three
   different agents over its lifetime has three agents'
   contributions; collapsing to a single row loses the audit
   trail.
2. **Same-identity continuation is cheap to detect.** The
   identity-key match (`platform + model + agent_name`) makes
   "is this the same agent as before?" a single comparison.
   Additive-by-default is the safe default; collapsing occurs
   only when the key matches.
3. **Overwrite is lossy and rarely reversible.** A session that
   overwrites a prior identity row destroys information that
   cannot be reconstructed from any other surface. The failure
   mode is silent — the next session sees the new row and does
   not know the prior identity existed. Additive writes cost
   nothing and preserve the record.

### Why the identity key is `platform + model + agent_name`

Each component carries distinct continuity information:

- **`platform`**: different platforms (Claude, Cursor, Codex,
  Gemini) have different capabilities, different tool surfaces,
  different session-state stores. A session on a different
  platform is a meaningfully different identity even if the same
  owner, same task, same model family.
- **`model`**: different models produce different work profiles.
  An Opus session and a Sonnet session on the same platform are
  different identities for attribution purposes.
- **`agent_name`**: owner-assignable name that persists across
  sessions. If the owner wants to treat a recurring
  platform/model combination as a single durable identity
  (e.g. "Samwise"), the name makes that explicit. Without a
  name, each session matches only on platform/model; with a
  name, the owner can deliberately switch identities without
  changing platform/model.

`session_id_prefix`, `role`, `first_session`, `last_session` are
*descriptive* — they annotate the identity but do not participate
in key matching. Merging two sessions into one identity row uses
the key fields only.

### Why thread scope belongs in Practice doctrine, not host-local

Thread-as-continuity-unit, session-as-participant, and the
additive-identity rule all describe how agentic engineering
sessions compose into persistent streams of work. That
composition property is portable: any Practice-bearing repo
running multiple agents across sessions faces the same gap and
needs the same shape to fill it. A host-local convention cannot
serve a cross-repo Practice.

The three-mode memory taxonomy (per Standing decision, this repo,
2026-04-21) is also portable and decoupled from this PDR:
threads live in operational memory, but the threads concept does
not commit any host to a particular memory layout.

### Alternatives rejected

- **Session as the continuity unit, with a "resumes-from"
  pointer.** Rejected — produces a linked-list-of-sessions
  shape that is hard to read and hard to fork. Multiple agents
  on the same thread would each be a branch of the linked list.
  Threads as a first-class unit collapse the graph to a flat
  list per thread.
- **Single identity per thread ("the agent working on it").**
  Rejected — cannot express multi-agent work without silent
  overwrite.
- **Identity only at the workstream level, not the thread
  level.** Rejected — reintroduces the conflation of scope and
  continuity this PDR is separating.
- **Owner-name-mandatory.** Rejected — many threads are
  short-lived or single-identity and do not warrant a durable
  name; a mandatory name becomes friction and a stale-name
  hazard.

## Consequences

### Required

- Every Practice-bearing repo that runs multi-session agentic
  engineering work names **threads** as the continuity unit.
- Each active thread carries a **next-session record** scoped to
  it (one record per thread, not one record per repo).
- Each thread's next-session record carries an **identity list**
  conforming to the schema above.
- Session open includes an **identity-registration step** that
  either updates `last_session` on the matching row or adds a
  new row before any edits begin.
- Session close includes an **identity-update confirmation**
  that `last_session` is current on every identity row the
  session touched.
- PDR-026's landing commitment is interpreted as
  **per-thread-per-session**: one thread, one landing target,
  per session.
- Workflow surfaces (session-open grounding, session-handoff)
  carry the operational rituals that enforce identity
  registration and update.

### Forbidden

- **Overwriting or collapsing existing identity rows when
  resuming or joining.** A session that is a new identity adds
  a row; it does not rewrite an existing row's platform, model,
  agent_name, or role to reflect itself.
- **Renaming `agent_name` on an existing identity row.** A
  rename is a new identity by construction (the key changed).
  The new identity adds a row; the prior row is preserved.
- **Cross-thread spread in a single session.** A session that
  advances multiple threads' targets violates the
  per-thread-per-session landing commitment.
- **Treating session as the continuity unit in new machinery.**
  Any new artefact, ritual, or convention that persists across
  sessions MUST scope itself to the thread, not the session.

### Accepted costs

- **Two continuity levels to reason about.** Sessions and
  threads are distinct units; users and agents must carry both
  in mind. The cost is outweighed by the clarity gained over the
  conflated-unit failure modes this PDR closes.
- **Identity lists grow over time.** For long-lived threads
  touched by many agents, the identity list lengthens. Same-
  identity resumption updates `last_session` rather than adding
  a row (see the additive-identity rule), which bounds growth
  to the number of distinct identities per thread, not the
  number of sessions.
- **Thread-identity discipline cannot be enforced by passive
  guidance alone.** Per the
  `passive-guidance-loses-to-artefact-gravity` pattern, the
  additive-identity rule becomes environmental only when
  installed as an always-applied session-open rule, a
  session-close gate in `/session-handoff`, and a stale-identity
  health probe. Those installs are scoped by the
  Perturbation-Mechanism Bundle PDR's Family A Class A.2 layer
  (see PDR-029).

## Notes

### Self-applying nature

This PDR is itself authored within a thread (the `memory-feedback`
thread on the repo where this PDR was authored). The authoring
session registered its identity on the thread's next-session
record before drafting, exercised same-identity resumption from
a prior session on this thread, and will update `last_session`
at session close. The PDR's mechanics are thus proven in its own
authoring.

### Graduation intent

Like PDR-011 and PDR-026, this PDR's substance is a candidate
for eventual graduation into `practice.md` (the session /
continuity section) once threads and identity discipline have
been exercised across multiple cross-repo hydrations. Graduation
marks the PDR `Superseded by <Core section>` and retains it as
provenance.

### Host-local context (this repo only, not part of the decision)

At the time of authoring:

- Thread records are hosted at `.agent/memory/operational/threads/<slug>.next-session.md`
  with a convention README at `.agent/memory/operational/threads/README.md`.
- The identity-registration rule (session-open) and
  identity-update gate (session-close) are scheduled for
  installation in Session 4 of the
  [Staged Doctrine Consolidation and Graduation](../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md)
  plan, Tasks 4.2.a and 4.2.b.
- The stale-identity health probe is scheduled for Session 4
  Task 4.2.c.
- The legacy singular next-session file at
  `.agent/memory/operational/next-session-opener.md` (currently
  carrying the `observability-sentry-otel` thread) migrates to
  `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
  as part of Session 4 close.
- The agent-names registry (owner direction 2026-04-21:
  ~1000 well-distributed public-domain names, no
  LLM-generation) is captured in
  `.agent/memory/operational/repo-continuity.md § Deep
  consolidation status` as an infrastructure graduation target
  consumed by Session 4 Task 4.2.
- Retroactive identity attribution for prior sessions is
  acknowledged as a gap; attribution starts forward from
  2026-04-22 per the Standing decisions section of
  `repo-continuity.md`.
