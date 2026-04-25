---
fitness_line_target: 200
fitness_line_limit: 260
fitness_char_limit: 16000
fitness_line_length: 100
split_strategy: "Extract per-channel protocol detail to companion docs as channels grow; keep this file as the agent-to-agent working model and channel index"
---

# Agent Collaboration Practice

This directive defines the agent-to-agent working model for this repository.
Its sibling, [`user-collaboration.md`](user-collaboration.md), governs the
agent-to-owner working model. Together they make explicit what was
previously implicit: collaboration in this repo has two distinct halves, and
both need a settled doctrine.

It complements, but does not replace,
[`principles.md`](principles.md). If a collaboration habit conflicts with a
repository principle, surface the conflict and discuss it rather than
silently choosing one.

## What This Directive Installs (WS0)

WS0 of the [`multi-agent-collaboration-protocol`][p] plan establishes:

- the **vocabulary** of agent-to-agent collaboration — the working model,
  the channel taxonomy, the identity-vs-liveness distinction;
- a **discoverability surface** for sequential agents — the embryo
  discovery log at `.agent/state/collaboration/log.md`;
- the **two foundational behavioural rules** — `dont-break-build-without-fix-plan`
  and `respect-active-agent-claims`.

WS0 establishes the vocabulary and a discovery surface. **It does not by
itself prevent parallel-agent clashes**; that is WS1's claim, building on
this foundation. WS3 adds structured conversation files and the sidebar
mechanism. WS5 harvests evidence and drives refinement.

## Knowledge and Communication, Not Mechanical Refusals

The central design commitment, settled by owner direction 2026-04-25:

> The protocol provides agents with information about each other's work and
> means to discuss overlap. **It does not mechanically refuse entry to
> claimed areas.** Mechanical refusals would be routed around at the cost
> of architectural excellence — agents would find ways to bypass the gate,
> producing a worse outcome than honest agent judgement informed by shared
> knowledge.

Every rule installed by this directive is a **tripwire**, not a refusal:

- *do not proceed until you have consulted the surface and decided how to
  coordinate* — substance of the decision is agent judgement;
- *do not break the build unless you will fix it soon* — substance of "soon"
  is agent judgement.

This is the architectural-excellence frame applied to agent-to-agent work.
Agents in this repo are **reasoning peers**, not constrained subjects.
Locks are the wrong tool for reasoning peers.

## Working Model

The collaboration model between agents is **dialogue**, not authority
hierarchy. There is no orchestrator agent and no peer with veto power. The
owner is the final tiebreaker, surfaced explicitly through named channels
when peer agreement does not converge.

Agents should:

- consult the surface before operating in another agent's area;
- constructively challenge a peer's direction that appears wrong, damaging,
  or inconsistent with settled doctrine;
- treat shared infrastructure (build, type, lint, static analysis) as a
  shared good — do not break it without a fix plan;
- match scope to the work in front of them; do not opportunistically expand
  into a peer's area without coordination;
- preserve conversation evidence so future refinements can cite real
  exchanges, not reconstructed memory.

Overrides are rare. The normal posture is shared reasoning across the
working tree: make the concern visible, explain why it matters, and let the
peer respond. If there is no response and the work blocks, escalate via the
explicit owner-escalation channel (WS3).

## Scope Discipline Across Agent Boundaries

Two foundational rules, named here as load-bearing principles:

### a. Don't Break the Build Without a Fix Plan

The active
[`gate-recovery-cadence.plan.md`](../plans/observability/active/gate-recovery-cadence.plan.md)
names the non-negotiable invariant verbatim:

> Restore the invariant that build, type-check, lint, format, markdown,
> depcruise, knip, and static checks stay green even during TDD. RED is
> allowed only as intentional failing behavioural tests, not as missing
> imports, broken types, lint warnings, or build failures.

A peer agent's pristine staged work depends on the same gates passing on
the same working tree. Breaking the build without a fix plan converts a
local quality issue into a coupling failure across parallel agent
sessions. The
[`dont-break-build-without-fix-plan`](../rules/dont-break-build-without-fix-plan.md)
rule operationalises this for cross-agent context.

### b. Don't Operate in Another Agent's Area Without Consulting the Surface

"Area" is provisionally defined as: any file path, plan, ADR, or workspace
currently named in another agent's recent embryo-log entry or (from WS1)
active claim entry.

The
[`respect-active-agent-claims`](../rules/respect-active-agent-claims.md)
rule fires as a tripwire: *do not proceed until you have consulted the
surface and decided how to coordinate*. It does **not** fire as: *refuse
if a claim exists*.

## Communication Channels

Five channels exist; they have different shapes. Pick the one that fits the
shape of what you need to communicate.

| Channel | Shape | Primary use | Forward ref |
| --- | --- | --- | --- |
| Thread record `<slug>.next-session.md` | Durable async, narrative, per-thread, multi-session | Continuity across sessions on a single thread | PDR-027 |
| **Embryo log** `state/collaboration/log.md` | Schema-less append-only markdown, eventually-consistent | Discovery surface — leave notes for whoever reads next | WS0 (this) |
| Conversation file `state/collaboration/conversations/<id>.json` | Structured per-topic JSON, async | Live exchange between agents on overlap topics needing more structure than the embryo log | WS3 |
| Sidebar | Short-lived focused exchange by mutual agreement | Tighter coordination when async is too slow | WS3 |
| Reviewer dispatch | Fork-blocking-rejoin within ONE agent's session | Specialist review of a draft (docs-adr, assumptions, etc.) | already in use |
| Owner question via `AskUserQuestion` | Hard-blocking sync to human | Final tiebreaker; missing-information that only the owner can supply | already in use |

A few channel-selection rules:

- The **embryo log is a discovery surface, not a synchronisation surface**.
  Two agents writing simultaneously produce eventually-consistent
  interleaved entries. That is by design and is fine for discovery — later
  readers benefit from earlier writers' notes.
- **Reviewer dispatch is not peer collaboration**. Reviewer sub-agents
  (`docs-adr-reviewer`, `assumptions-reviewer`, etc.) are
  fork-blocking-rejoin invocations *inside one agent's session*. They are
  not peers; they do not have parallel sessions; they do not register
  claims. Peer collaboration is asynchronous between independent sessions.
- **Owner is the final tiebreaker**, surfaced through a named channel
  (`AskUserQuestion`, or — from WS3 — the
  `.agent/state/collaboration/escalations/` directory polled at
  `consolidate-docs`). Peer agreement is the default; owner escalation is
  the last move when agreement fails.

## Identity vs Liveness

These are different concerns and live in different surfaces.

- **Identity** is who-I-am-on-this-thread, additive across sessions per
  [PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).
  Identity rows live in thread records; the
  [`register-identity-on-thread-join`](../rules/register-identity-on-thread-join.md)
  rule installs the session-open tripwire.
- **Liveness** is when-was-this-agent-last-active-here, a *freshness
  signal* on a claim. Liveness lives in `.agent/state/` and is introduced
  by WS1's structured claims. Stale claims become **noise to be audited
  at consolidation**, not blockers that strand other agents.

The PDR-027 identity schema is reused inside claim entries. No new
identity concept is introduced.

## Bootstrap Fast-Path

The single-agent case (no other agents present) pays the protocol's
**minimum overhead — one read, one write**. The agent reads the embryo
log (and from WS1, `active-claims.json`); finding no other claims, the
agent logs *"no other agents present"* to the embryo log and proceeds.
The single write is load-bearing: it is the discovery seed for whatever
sequential agent comes next. WS1's
`register-active-areas-at-session-open` rule (forward reference)
implements the structured form of the same early-return.

The fast-path is not an exception to the protocol; it is the protocol's
minimum-overhead shape under low contention. Solo sessions do not pay
parallel-session coordination overhead beyond the single-write seed.

## Conversations as First-Class Learning-Loop Inputs

The embryo log, structured claims (WS1), conversation files (WS3), and
sidebar transcripts (WS3) are durable evidence alongside the napkin. When
a refinement to this directive or to the claim/conversation schemas is
drafted, it cites entries from those surfaces directly — the same way a
refinement cites a napkin observation.

Lessons captured from agent-to-agent conversations land as napkin
observations through the standard learning-loop. WS5's seed harvest reads
across all of them. This wiring is named here so future agents do not
have to discover it: **the surfaces this directive installs are
learning-loop inputs, not just operational coordination.**

## Schema Evolution

JSON schemas in `.agent/state/collaboration/` carry an explicit
`schema_version` field from the first commit. Compatibility is
**additive-only within a major version**: a v1.x agent reading a v1.y
file (`y > x`) ignores unrecognised fields and preserves them on
write-back. Major-version mismatch causes the agent to bail out with an
error pointing at the protocol upgrade.

The model is documented in each schema's `$comment_compatibility` block.
The embryo log at WS0 is intentionally schema-less and exempt from this
rule; structure crystallises at WS1/WS3 informed by observed embryo-log
usage.

## Threat Model

The protocol assumes **trusted agents**. Agents follow the doctrine in
good faith: claims describe real intent, embryo-log entries are honest,
build-breakage is reported. Misbehaving agents (claiming excessive scope,
never releasing claims, fabricating entries) are out of scope; the owner
is responsible for detecting and resolving these cases at consolidation.
A hostile-agent threat model — claim integrity, signed entries, tamper
detection — is a future PDR if the trust assumption breaks down.

## Foundation Alignment

This directive operationalises:

- [PDR-026](../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
  — claims become the per-session granularity for area-of-work commitment
  (WS1).
- [PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
  — identity rows in claims reuse the schema already in thread records.
- [PDR-029](../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  — Family-A Class-A.2 tripwire pattern: WS1's
  `register-active-areas-at-session-open` rule is the parallel of the
  existing `register-identity-on-thread-join` rule.
- [PDR-011](../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
  — capture → distil → graduate → enforce pipeline; files first, code
  only when files prove the design.
- ADR-150 (continuity surfaces, session handoff, surprise pipeline) —
  host-side continuity-surfaces decision (paired with PDR-011); under
  `docs/architecture/architectural-decisions/`.
- [ADR-125](../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
  — canonical content in `.agent/`; thin platform adapters; platform
  entrypoints.

## Cross-references

- [`user-collaboration.md`](user-collaboration.md) — sibling directive for
  the agent-to-owner working model.
- [`principles.md`](principles.md) — repository principles.
- [`.agent/state/README.md`](../state/README.md) — state-vs-memory
  distinction.
- [`.agent/state/collaboration/log.md`](../state/collaboration/log.md) —
  embryo discovery log (WS0).
- [`agent-collaboration-channels.md`][channels-card] — five-channel
  reference card.
- [`threads/README.md`][threads-readme] — thread convention and
  additive-identity rule.

[p]: ../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md
[channels-card]: ../memory/executive/agent-collaboration-channels.md
[threads-readme]: ../memory/operational/threads/README.md
