---
name: "Agent Coordination CLI Ergonomics and Cross-Thread Request Correlation"
overview: "Reduce first-touch friction on the collaboration-state CLI; correlate cross-thread requests with responses so coordination signals do not rot silently; emit session-open liveness as a baseline so discovery does not depend on each agent self-authoring."
isProject: false
---

# Agent Coordination CLI Ergonomics and Cross-Thread Request Correlation

**Status**: 📋 STRATEGIC / FUTURE
**Domain**: Agentic Engineering Enhancements
**Parent**:
[`agent-collaboration.md`](../../../directives/agent-collaboration.md)
and
[`collaboration-state-conventions.md`](../../../memory/operational/collaboration-state-conventions.md)
**Related**:
[`collaboration-state-domain-model-and-comms-reliability.plan.md`](collaboration-state-domain-model-and-comms-reliability.plan.md)
(this plan complements, not replaces it: the domain-model brief covers
write-safety + state-record taxonomy; this brief covers agent-facing CLI
ergonomics and the request/response correlation gap);
[`../current/collaboration-state-write-safety.plan.md`](../current/collaboration-state-write-safety.plan.md);
[`agent-tools/src/collaboration-state/cli.ts`](../../../../agent-tools/src/collaboration-state/cli.ts);
[`agent-tools/src/collaboration-state/cli-options.ts`](../../../../agent-tools/src/collaboration-state/cli-options.ts);
[`agent-tools/src/collaboration-state/cli-comms-commands.ts`](../../../../agent-tools/src/collaboration-state/cli-comms-commands.ts);
[`agent-tools/src/collaboration-state/cli-claim-commands.ts`](../../../../agent-tools/src/collaboration-state/cli-claim-commands.ts);
[`use-agent-comms-log.md`](../../../rules/use-agent-comms-log.md);
[`register-active-areas-at-session-open.md`](../../../rules/register-active-areas-at-session-open.md)

---

## Problem and Intent

The multi-agent coordination protocol (claims registry, immutable comms events,
rendered shared log, transactional CLI, commit-window claims) **works** as a
durable substrate. Live use during a parallel-agent session on PR-87 on
2026-04-28 surfaced a different class of pressure: the
**agent-facing surfaces around the substrate** carry friction that is invisible
to anyone who has read the source code, and the **comms-as-ledger model lacks a
correlation primitive** for requests that genuinely need a response. Both
classes silently degrade coordination quality without breaking write-safety.

The intent of this plan is narrow: improve the agent-facing surfaces and add
the smallest correlation primitive that closes the request/response gap,
without expanding the state-record taxonomy. The
[domain-model plan](collaboration-state-domain-model-and-comms-reliability.plan.md)
remains authoritative for state-record boundaries; this plan is about
ergonomics and one missing primitive.

### Evidence (live use, 2026-04-28, Choppy Lapping Rudder session on PR-87)

Three concrete classes of friction surfaced inside a single session:

1. **CLI discoverability friction at first touch.**
   - `pnpm agent-tools:collaboration-state -- --help` is rejected with
     `flag '--help' requires a value` because `cli-options.ts` treats any
     `--`-prefixed token as a flag-value pair without a `--help` special case.
     First-touch UX regression for any agent or human that probes the tool.
   - The dispatch usage line (`Usage: collaboration-state
     <identity|comms|claims|conversation|escalation|check> <action> [options]`)
     names topic groups but not actions or flags. The dispatch key is built
     internally as `<command>:<topic>` (e.g. `comms:append`, `claims:open`),
     and the only way to discover the action set is to read `cli.ts`.
   - `identity preflight` requires `--platform` and `--model` even when
     `PRACTICE_AGENT_SESSION_ID_CLAUDE` is set in the environment and the seed
     source already implies platform. A purely env-driven preflight would
     remove a redundant flag pair from every script that already runs after
     the SessionStart hook.
   - `claims open` accepts `--area-kind files --file <path>` per file. For
     eight-file claims (typical for a multi-file cluster) this means eight
     repeated `--file` flags. A bulk shape (newline-delimited stdin, JSON
     `--areas` payload, or `--files-from <path>`) would scale better.
   - There is no `whoami` action — derivable from `identity preflight`, but
     agents and human operators routinely want a one-line "who am I according
     to the CLI" check separate from the JSON preflight payload.

2. **Cross-thread request → response correlation gap.**
   - The shared comms log is an immutable event ledger rendered into a
     human-and-agent-readable markdown surface. Events have `event_id`,
     `created_at`, `author`, `title`, `body`. There is **no correlation
     primitive**: an event cannot declare itself as a response to a prior
     event, no event carries an `audience` (which thread or agent should
     act), no event carries a TTL or expected-response-by horizon, and the
     consolidate-docs surface cannot enumerate "open requests that have not
     been responded to".
   - In live use, a Phase 2.0.0 cross-thread request was authored asking the
     `agentic-engineering-enhancements` thread to absorb a regression cure on
     two `S5443` hotspots. The next agent on that thread will *not
     necessarily* see the request before PR-87 wants to close. The request
     has no inbox, no @mention, no escalation timer; it is fire-and-hope.
   - The shared log thus works as discovery narrative (per the domain-model
     plan's framing) but degrades to write-only for any signal that requires
     a counterparty to act. This is invisible until the unanswered request
     causes a downstream blocker.

3. **Session-open liveness depends on each agent self-authoring.**
   - There is no auto-emitted "I have arrived on thread X" comms event. Each
     agent that follows discipline writes one; agents that skip discipline
     are invisible to discovery surfaces until they touch a state record.
   - Because liveness is self-authored, two parallel agents on different
     threads can be wholly invisible to each other for the first 5–30 minutes
     of work — long enough for accidental same-file claims or duplicated
     work. The
     [register-active-areas-at-session-open](../../../rules/register-active-areas-at-session-open.md)
     rule mandates a claim, but a *liveness-only* event (not a claim) carries
     less ceremony and could be standardised.

4. **Stance-staleness within a single conversation.**
   - The session this plan was authored from formed a "stance to owner"
     based on a fresh-state snapshot. Before the owner replied (~2 minutes
     later), three parallel Codex agents finished, archived, and committed
     `7c589a0a`, materially changing the world: the in-repo plan that was
     listed as a verification target had become the verified source of truth
     during the stance-formation interval.
   - The brief explicitly required pre-execution re-fetch — and the actual
     CLI writes did re-fetch correctly via the transaction helper. The
     stance-to-owner step was the gap. The lesson is not "re-fetch more"
     in the abstract; it is "every step that *commits to a course of
     action* needs a fresh re-fetch immediately before commit, including
     non-state-mutating commitments to the owner". This is a behavioural
     pattern worth encoding in the
     [start-right](../../../skills/start-right-quick/shared/start-right.md)
     and the agent-collaboration directive, not just a CLI fix.

5. **Claims overlap detection is a manual scan.**
   - To verify that a new claim does not overlap an existing claim, an agent
     must read `active-claims.json`, enumerate the `areas[].patterns` for
     each existing claim, and grep their intended file list against each.
     This is correct, but error-prone and verbose. A `claims overlap
     --files <list>` CLI affordance would let an opening claim self-check
     before creation, surfacing exact overlap candidates and their
     `claim_id` for coordination via comms.

### Intent

Treat the substrate (claims, events, transaction helper, commit queue) as
fixed and correct. Improve the *surfaces around the substrate* so that:

- **first-touch CLI friction** is eliminated (action discoverability,
  `--help`, `whoami`, env-driven preflight, bulk file claims);
- **cross-thread requests** can be correlated to responses and surfaced as
  open by `consolidate-docs`, so unanswered requests do not rot silently;
- **session-open liveness** is a standardised baseline emitted by the
  `start-right` skills, not a self-author-or-be-invisible burden;
- **claims overlap** is a CLI query, not a manual grep;
- **stance-to-owner staleness** is treated as a discipline, named in
  agent-collaboration doctrine, and observable in consolidation surfaces.

These are five separable threads, each promotable independently. The
expected first promotion is the **request/response correlation primitive**
because the failure mode is silent and load-bearing in cross-thread work.

---

## Domain Boundaries and Non-Goals

**In scope**:

- CLI ergonomics: `--help`, dispatch-key discoverability, `whoami`,
  env-driven preflight, bulk-files claim shape.
- Claims overlap query as a CLI affordance.
- A minimal correlation primitive on comms events (`in_response_to`,
  `audience`, optional `response_required_by`).
- Session-open liveness emission via `start-right-quick` and
  `start-right-thorough`.
- Consolidate-docs surface for "open cross-thread requests".
- Doctrinal capture of stance-staleness mitigation in the
  agent-collaboration directive.

**Explicitly out of scope (handled by other plans)**:

- State-record taxonomy and write-safety boundaries — owned by
  [`collaboration-state-domain-model-and-comms-reliability.plan.md`](collaboration-state-domain-model-and-comms-reliability.plan.md)
  and
  [`../current/collaboration-state-write-safety.plan.md`](../current/collaboration-state-write-safety.plan.md).
- Commit-queue / `intent_to_commit` ordering — owned by
  [`intent-to-commit-and-session-counter.plan.md`](intent-to-commit-and-session-counter.plan.md).
- Hooks portability — owned by
  [`hooks-portability.plan.md`](hooks-portability.plan.md).
- Cross-vendor session sidecars — owned by
  [`cross-vendor-session-sidecars.plan.md`](cross-vendor-session-sidecars.plan.md).
- Joint-decision protocol (sidebar/escalation) — already implemented; this
  plan does not add a parallel decision channel.

---

## Dependencies and Sequencing Assumptions

- The collaboration-state CLI (`agent-tools/src/collaboration-state/`) is
  the load-bearing surface; ergonomic changes land here.
- The comms event schema lives at
  [`comms.event.schema.json`](../../../state/collaboration/comms.event.schema.json)
  if present (verify at promotion); a correlation primitive is a minor-version
  bump per the schema-versioning rules in
  [`collaboration-state-conventions.md`](../../../memory/operational/collaboration-state-conventions.md).
- The
  [`shared-comms-log.md`](../../../state/collaboration/shared-comms-log.md)
  read model rendering must preserve correlation visibility (e.g. show
  `in_response_to` as a back-link in the rendered entry).
- `consolidate-docs` extension to enumerate open cross-thread requests
  depends on `audience` and `in_response_to` being present and queryable.
- Session-open liveness emission depends on the `start-right-quick` and
  `start-right-thorough` skills having a stable hook to inject a CLI
  invocation. The `commit` skill's two-step (enqueue intent → verify staged
  → commit) is the closest analogue.

---

## Success Signals (justify promotion to `current/`)

- A second instance of a cross-thread request rotting silently without a
  response (one was observed 2026-04-28; one more is the threshold).
- An agent or owner reports CLI first-touch friction in a session-handoff
  or napkin entry (one observed; one more confirms this is recurring).
- A claims-overlap collision that would have been caught by a CLI query
  (one occurrence is the threshold; the cost of overlap is high enough to
  promote on the first incident).
- An owner-direct promotion request based on parallel-agent friction in
  another session.

---

## Risks and Unknowns

| Risk | Mitigation |
|---|---|
| Adding `audience` and `in_response_to` to the comms event schema risks scope creep into a "decision thread" parallel channel that already exists. | Keep the primitive minimal: `audience` is a free-text string (thread name or agent name); `in_response_to` is an `event_id` reference; no message-status enum, no read-receipts. Decision threads remain the home for structured async coordination. |
| `consolidate-docs` extension to enumerate open requests requires walking the comms event log, which is append-only and growing. | Index by `audience` and `in_response_to` at render time; cache the rendered open-requests view. A 1000-event log is still tractable for a markdown render. |
| Session-open liveness emission could clutter the comms log if every agent emits one event per session. | The shared-comms-log.md render can group consecutive same-author liveness events into a single "active in this window" entry; or the consolidate-docs view can suppress liveness-only events older than 24h. |
| `claims overlap` query as a CLI affordance could be misused as a soft no-write lock. | Document explicitly: overlap is a *coordination signal*, never a refusal. Output uses prose like "potentially overlaps with claim X (Y) — consider coordinating via comms" not "overlap detected; aborting". |
| Stance-staleness mitigation as doctrine could become heavyweight if every owner-facing stance triggers a re-fetch. | Frame it as: "any stance that proposes side-effecting work re-fetches immediately before reporting; informational stances do not". The discipline is *commitment-shaped*, not action-shaped. |
| CLI bulk-files shape could conflict with the existing pattern of one-`--file`-per-flag in tests. | Add the bulk shape additively; keep the per-flag form; tests opt into the form they use. |

---

## Promotion Trigger into `current/`

Promote when **any one** of the following is true:

1. A second cross-thread request rots silently (the request/response
   correlation primitive becomes load-bearing).
2. A claims-overlap collision in a parallel session causes rework
   (the `claims overlap` query becomes load-bearing).
3. A second session reports CLI first-touch friction in a napkin or
   session-handoff entry (the `--help` / dispatch-key / `whoami` slice
   becomes load-bearing).
4. Owner-direct promotion request.

On promotion, choose the *narrowest* slice that closes the load-bearing
problem first; do not bundle the five threads into one execution plan.

Recommended first slice (if multiple triggers fire): the
**request/response correlation primitive + `consolidate-docs` open-requests
view**. Reason: this closes a *silent* failure mode. The CLI ergonomics
threads are visible-by-friction; the correlation gap is invisible-by-design
until it causes a downstream blocker.

---

## Notes for the Promotion Session

When this plan is promoted, the executing session must:

- Re-verify which CLI flags / dispatch keys are still surfaced as friction
  (the CLI may have been refactored since this plan was written).
- Re-verify the comms event schema's current shape before proposing a
  minor-version bump.
- Read the
  [`collaboration-state-domain-model-and-comms-reliability.plan.md`](collaboration-state-domain-model-and-comms-reliability.plan.md)
  current state — that plan may have already absorbed some of these threads
  by the time promotion occurs.
- Confirm with the owner that the primitive fits the agent-collaboration
  doctrine: "knowledge and communication, not mechanical refusals". Any
  field that could be read as a lock or a hard escalation is out of
  character with the protocol's stance.

---

## Lifecycle

This is a strategic brief. New evidence, owner direction, or fresh
friction observations land here as additions to the §Evidence section
with the date and observing-session identity. Promotion (per the trigger
above) opens an executable plan in
[`../current/`](../current/) and this brief becomes a back-reference,
not a parallel source of truth.
