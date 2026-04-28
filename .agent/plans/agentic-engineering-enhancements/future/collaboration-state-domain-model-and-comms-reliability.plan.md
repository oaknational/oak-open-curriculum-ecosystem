# Collaboration State Domain Model and Communication Reliability

**Status**: 📋 STRATEGIC / FUTURE — FIRST SLICE PROMOTED
**Domain**: Agentic Engineering Enhancements
**Parent**:
[`agent-collaboration.md`](../../../directives/agent-collaboration.md)
and
[`collaboration-state-conventions.md`](../../../memory/operational/collaboration-state-conventions.md)
**Related**:
[`agent-collaboration-channels.md`](../../../memory/executive/agent-collaboration-channels.md);
[`collaboration-state-lifecycle.md`](../../../memory/operational/collaboration-state-lifecycle.md);
[`intent-to-commit-and-session-counter.plan.md`](intent-to-commit-and-session-counter.plan.md);
[`cross-vendor-session-sidecars.plan.md`](cross-vendor-session-sidecars.plan.md);
[PDR-035](../../../practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md);
[ADR-165](../../../../docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md)

Strategic brief. The first executable slice is now promoted as
[`../current/collaboration-state-write-safety.plan.md`](../current/collaboration-state-write-safety.plan.md),
focused on deterministic identity preflight, safe shared-state writes, TTL
cleanup, immutable comms events, and hook deferral. This future brief remains
the broader domain-model reference for later attention-routing, archive, and
hook polish.

**Owner priority update (2026-04-28):** native hooks and session-exit cleanup
are refinements. The pressing problem is clashing writes to shared
collaboration state. The next session should promote this strategic brief into
a current executable plan focused first on multi-agent-safe writes for shared
state records. Do not wait for more collision evidence before promotion.

## Problem and Intent

The shared communication log is accumulating enough write pressure that agents
are now seeing collisions, stale mental models, and discoverability gaps around
which communication surface to use. The first-order symptom is flat-file write
contention, but the deeper signal is domain-model pressure: the Practice now has
multiple coordination concepts with adjacent but distinct responsibilities.

The reliability requirement is not limited to the shared communication log.
Once the state domain-model boundaries are defined, every shared inter-agent
state record must be usable by multiple agents without creating a log jam:
claims, queue entries, conversations, sidebars, escalations, closure archives,
generated read models, and any future event files. If the design only moves
write contention away from `shared-comms-log.md` into another shared state file,
it has failed.

The intent is to design a clearer collaboration-state domain model and a more
reliable write path while preserving the Practice's low-friction operating
style. The target is not "more machinery"; it is fewer ambiguous choices at the
moment an agent needs to communicate.

Priority order:

1. relieve shared-state write collisions and partial-read/write hazards across
   the full state family;
2. define only enough domain-model boundary to choose correct write mechanisms
   per state record type;
3. then refine lifecycle automation, including hooks, session-close cleanup,
   and push-style attention where platform support exists.

Metacognition note: the bridge from action to impact is responsibility
separation. A queued or event-log write path only helps if agents know whether
they are writing discovery narrative, claiming live ownership, requesting a
decision, opening a sidebar, recording a joint commitment, escalating to the
owner, or capturing learning for later distillation.

## Preserved Analysis From 2026-04-28

- File reads and writes do not automatically block each other for normal tracked
  files. A reader can observe a file while another process is writing it, and a
  flat append-only markdown log can produce partial reads or interleaved writes
  unless every writer follows a shared lock or atomic append protocol.
- The current `shared-comms-log.md` is best understood as a discovery narrative,
  not a synchronisation primitive. It should remain useful to humans and agents,
  but it should not be the only hot write surface under parallel load.
- Owner amendment on 2026-04-28: do not treat "fix the conversation log" as
  the whole problem. The owner is not currently seeing the same clash pattern
  in the claim registry, but after the domain model names the correct state
  boundaries, every shared inter-agent state file must have a safe multi-agent
  write protocol appropriate to its role. The success condition is no log jams
  across the full shared-state family, not just a quieter comms log.
- The active claims file is a structured live ownership roster plus advisory
  commit queue, not a narrative log. Its responsibilities are already heavier
  than the original WS1 shape.
- Decision threads, sidebars, joint decisions, and escalations form a structured
  coordination/event record. They are live in schema and docs but need more real
  use to harden ergonomics.
- Sidebar attention is an open interaction-design question, not just a schema
  question. Agents need to know how often to check whether a sidebar targets
  them, how to flag low-effort "attention needed" without opening a heavy
  escalation, and whether any platform can provide a real push mechanism rather
  than relying on polling.
- Live evidence from 2026-04-28: an open conversation file,
  `state/collaboration/conversations/pr-87-vercel-ignore-test-failures-prismatic-sidebar.json`,
  was used as a sidebar-like attention request, but its entries used
  `message` / `decision_request` / `evidence` rather than `sidebar_request`.
  It also carried timestamps of `2026-04-28T08:05:00Z` while the observed
  current UTC was `2026-04-28T07:13:10Z`, suggesting London local time was
  accidentally marked with `Z`. This is concrete evidence for both attention
  routing ambiguity and UTC-validation need.
- Live liveness evidence from 2026-04-28: `active-claims.json` contains an
  active `Luminous Dancing Quasar` claim on the Vercel-ignore files, so
  Prismatic was addressing a named claim holder rather than inventing a
  fictional participant. However, the claim heartbeat is future-dated relative
  to current UTC, so the system cannot tell confidently whether Luminous is
  truly present or merely represented by stale/future-stamped state.
- Owner correction on 2026-04-28: the actual active agents are Codex,
  Estuarine, and Prismatic; there is no live Luminous agent unless a sub-agent
  registered that claim. This turns the Luminous claim from a weak liveness
  signal into a phantom/stale-claim or identity-mismatch signal. The design must
  distinguish "a claim exists" from "a reachable participant exists".
- All collaboration-state timestamps should be UTC ISO 8601 with trailing `Z`.
  The owner is currently in Europe/London; owner-local time is useful prose
  context but must not become the state clock.
- Owner direction on 2026-04-28: resumed terminal sessions do not currently
  reclaim old live claims. A session close means the session's claims should
  close; the preferred path is semantic pre-session-end cleanup by the agent
  that owns the claim. Post-session-end janitor behaviour is a fallback that
  marks missed claims as stale/orphaned after a short session-close grace
  window; it must not pretend the work completed successfully.
- Owner direction on 2026-04-28: a future SDK-style one-turn invocation model
  could make external shared session state useful across resumes, but that is
  not the present terminal-session operating model. The current default is
  fresh claim per live session.
- Owner direction on 2026-04-28: shared communication history should gain a
  rolling archive model so the hot narrative surface stays readable without
  abruptly losing past context.
- Codex-specific note: current Codex supports hooks, including turn-scoped
  `Stop`, but no documented `SessionEnd` equivalent has been verified. This is
  not blocking the urgent shared-state write work. Codex should rely on
  standard freshness/TTL cleanup for missed session-close handling until a true
  session-end hook is documented and wired.
- `agent-tools` is a TypeScript-specific implementation surface in this repo.
  The capabilities it implements are Practice capabilities by default
  (PDR-035) and should have a portable conceptual contract that can be
  reimplemented in non-TypeScript Practices. ADR-165 records this repo's local
  phenotype boundary.
- Agent identity is itself part of the domain model. A session reporting as
  `Codex` / `unknown` is not just cosmetic: several continuity mechanisms rely
  on stable agent identity for claims, sidebars, queue entries, closures, and
  follow-up routing. The portable Practice should make "unnamed agent" and
  unknown session-prefix states impossible or explicitly degraded at session
  start.
- Context limits have already interrupted this discussion multiple times, so
  this strategic brief is the durable preservation point for the analysis,
  intent, and open design questions.

## Domain Boundaries and Non-Goals

In scope:

- Define the domain roles for collaboration-state surfaces:
  shared discovery narrative, live ownership, commit intent, structured
  coordination, owner escalation, durable closure history, and learning capture.
- Prioritise implementation decisions that reduce real write clashes in shared
  state over hook/session-exit refinements.
- Decide whether the shared communication log should become a generated read
  model from per-entry events.
- Decide the write protocol for every shared inter-agent state family after
  boundaries are clear: high-frequency communication entries, active claims,
  commit queue entries, decision/conversation entries, sidebar entries,
  escalation records, closure archives, generated read models, and future event
  files. Candidate mechanisms include one-file-per-event, temp-and-rename,
  exclusive create, advisory locks, append queues, or another role-specific
  protocol.
- Define what `agent-tools` should provide as this repo's TypeScript
  implementation and what remains portable Practice doctrine.
- Define session-close lifecycle semantics: own claims close at session end,
  old claims are not resumed by default, post-session janitors mark missed
  claims as stale/orphaned rather than successful, and any future resume-reclaim
  feature needs an explicit new state transition.
- Define TTLs per state type, including a short grace TTL for claims left open
  after a known session close, separate from normal active-work freshness and
  commit-window expiry.
- Define a rolling archive model for shared communication history that preserves
  searchable context while keeping the hot file small enough for frequent
  multi-agent reads and writes.
- Preserve UTC timestamp discipline and owner-local prose guidance.
- Define sidebar attention mechanics: polling cadence, attention-needed flags,
  owner/peer notification semantics, and which surfaces are pull-only versus
  push-capable.
- Define timestamp sanity checks that can flag future-dated UTC values and
  local-time-with-`Z` mistakes without mutating another agent's open state.
- Define identity preflight behaviour: every platform should either derive a
  stable display name and session prefix before opening claims, or fail into an
  explicit degraded mode that tells the owner and records why identity could
  not be resolved.
- Define active-participant verification: agents should be able to tell whether
  a named claim holder is actually present, stale, delegated to a sub-agent, or
  merely a ghost claim left in the registry.
- Add deterministic validation for the chosen state model.

Out of scope for this strategic brief:

- Replacing git as the durable transport for Practice state.
- Introducing a binary database as the tracked source of truth without a
  text-first migration story.
- Turning sidebars, claims, or logs into hard locks that mechanically strand
  agents.
- Implementing code before the responsibility model is ratified.

## Candidate Direction

The leading candidate is an event-log-backed communication surface:

- Write each communication entry as an immutable event file under a directory
  such as `state/collaboration/comms/events/`.
- Use exclusive create or temp-file-plus-rename so a writer either creates a
  complete event or creates nothing.
- Materialise `shared-comms-log.md` as a generated chronological read model for
  humans and simple agents.
- Add a rolling archive policy for rendered communication history. The hot log
  should carry enough recent context for session-open discovery; older rendered
  history should move to dated archive files or be reproducible from immutable
  events, so agents do not lose context during rotation.
- Add an `agent-tools` command for append, render, and health checks in this
  repo, while documenting the behaviour in Practice terms so other repos can
  implement it in their local stack.
- Keep structured decisions in `conversations/` and live ownership in
  `active-claims.json`; do not overload the event log with every state shape.
- Define a write-integrity contract for each shared state shape, not only the
  communication events. Some records may remain single JSON files if their
  lifecycle and write frequency make that safe; others may need event-file
  writes, temp-and-rename updates, explicit queueing, or append-only subrecords.
  The domain model should justify the mechanism per record type.
- Treat attention routing as an explicit domain concept. Candidate low-effort
  signals include `active-claims.json` liveness hints such as `sidebar_open`, a
  targeted shared-log heading, or a lightweight `attention_requested` event in a
  conversation. Candidate push mechanisms must be proven per platform; until
  then, the portable baseline should assume pull/poll plus clear session-start
  and pre-edit checks.
- Treat session-close as a first-class lifecycle event where supported. Claude
  Code, Gemini, Cursor, and GitHub Copilot can be evaluated for native
  session-end cleanup hooks during promotion, but this must not delay the
  write-safety slice. Codex currently has hooks but no documented session-end
  hook; use turn-scoped `Stop` only for best-effort reminders and standard
  TTL/janitor cleanup for missed closes.

SQLite or another database remains a later option if event files prove
insufficient. It should not be the first tracked source of truth because binary
diffs and merge behaviour are poor for local Practice state instances.

## Dependencies and Sequencing Assumptions

- Finish the current documentation refresh first so the existing Practice keeps
  working while the deeper model is designed.
- The owner has already promoted the urgency of shared-state write collisions.
  Do not wait for another collision before creating the executable plan.
- Review the existing communication-channel register before inventing new
  surfaces:
  `memory/executive/agent-collaboration-channels.md`.
- Review the operational state docs:
  `memory/operational/collaboration-state-conventions.md` and
  `memory/operational/collaboration-state-lifecycle.md`.
- Coordinate with the active `agent-tools` owner before changing implementation
  files; this plan is allowed to name the TypeScript implementation boundary,
  not to edit it while another claim owns the workspace.

## Success Signals

- Agents can answer "where should I write this?" from one discoverable register.
- Agents can answer "when should I check for sidebars that target me?" and "how
  do I request another agent's attention with minimal overhead?" from one
  discoverable register.
- Agents do not enter shared state as anonymous `Codex` / `unknown`-style
  participants unless a deliberate degraded-mode record explains the failure.
- Agents do not send targeted attention requests to absent peers just because a
  stale or future-stamped claim exists.
- Flat-file write collisions no longer corrupt or interleave communication
  entries.
- Shared inter-agent state files do not create log jams elsewhere after the
  communication log is improved. Claims, queue entries, conversations,
  sidebars, escalations, closures, and generated read models all have an
  explicit multi-agent write-safety story.
- The shared communication log remains readable as a chronological narrative.
- Claims, queue entries, conversations, sidebars, escalations, and napkin
  feedback keep distinct responsibilities.
- UTC timestamp discipline is enforced by docs and validation.
- Session-close semantics are explicit: old claims do not silently revive on
  resume, missed closures become stale/orphaned after their type-specific TTL,
  and a resumed agent opens a fresh claim unless a future explicit reclaim
  transition is implemented.
- Shared communication history rotates predictably, with archived history still
  discoverable during consolidation and incident reconstruction.
- The TypeScript implementation in `agent-tools` is clearly described as a
  host-local phenotype implementation of portable Practice behaviour.

## Risks and Unknowns

- A one-file-per-event model may create filesystem noise unless the render and
  archive lifecycle is designed carefully.
- Locking can create false blocking or stale-lock recovery problems if treated
  as authority rather than a write-integrity mechanism.
- A generated read model introduces rebuild discipline: agents must know whether
  to edit events, not the generated log.
- A richer domain model can become too abstract if it is not grounded in the
  existing state surfaces and real collision evidence.
- Fixing only the hottest file can produce migration-of-contention: agents stop
  clashing on `shared-comms-log.md` but start clashing on `active-claims.json`,
  conversation files, or closure archives. The plan must evaluate the full
  shared-state family once the domain boundaries are named.
- Different agent platforms may have different filesystem atomicity guarantees;
  the portable contract needs to name required behaviour, not a single
  language-specific implementation trick.
- Push-style attention may not exist uniformly across Codex, Claude Code,
  Cursor, and future platforms. If the design assumes push without proving it,
  targeted sidebars become invisible to the very agents they are meant to reach.
- Session-end hooks are not uniform. If cleanup relies on native exit hooks
  without TTL fallback, Codex and any other platform without verified
  `SessionEnd` support can leave live claims stranded.
- Too-frequent polling creates noise and wasted attention; too-infrequent
  polling makes sidebars ineffective for live coordination. The polling cadence
  must be tied to workflow moments, not a vague "check regularly" instruction.
- Identity bootstrap may differ sharply by platform. Claude can receive
  `session_id` through hooks; Codex may need a Practice wrapper or host-provided
  thread/session metadata. The portable requirement is stable identity before
  state mutation; the implementation is platform-specific.

## Promotion Trigger Into `current/`

**Satisfied 2026-04-28 by owner direction:** resolving clashing writes to shared
state is pressing, while hooks are a refinement the Practice can live without
for now.

Promote this to a current executable plan now. The following remain additional
triggers/evidence, not prerequisites:

- another shared-log collision, claim/queue collision, conversation write
  collision, closure/archive conflict, or partial-read incident occurs;
- the owner explicitly asks to implement the queued/event-log write path;
- sidebars or joint decisions receive enough live use to expose a missing
  domain role;
- an agent misses a relevant sidebar or attention request because there was no
  clear polling cadence or attention flag;
- an agent attempts to open a claim, queue entry, closure, or sidebar with
  `agent_name` or `session_id_prefix` still unknown;
- `agent-tools` work resumes on communication primitives and needs a portable
  Practice contract.

## Executable-Plan Notes For Promotion

When promoted, use an executable quality-fix or adoption-rollout plan. The first
implementation slice should be TDD-shaped and scoped to shared-state
write-safety before hook/session-exit automation:

1. RED: validation tests prove the chosen shared-state write protocols reject
   malformed timestamps, missing identity, duplicate event ids, stale/future
   state, and out-of-order generated-log rendering.
2. GREEN: minimal append/render/check commands for the chosen event directory
   and any other shared-state record type changed by the first slice.
3. REFACTOR: update the communication-channel register, state docs, rules,
   start-right surfaces, and ADR/PDR records.
4. Quality gates: JSON/schema validation, markdownlint, portability check,
   agent-tools unit tests if implementation code changes, and a concurrency
   simulation for multiple writers across every changed shared-state record
   type, not only the communication log.
5. Interaction proof: simulate or manually rehearse a targeted sidebar where
   one agent requests another agent's attention, the target discovers it at the
   documented check point, and the resolution is recorded without owner
   escalation.
6. Learning loop: capture Practice/tooling friction in the napkin and run the
   consolidation workflow after evidence exists.
