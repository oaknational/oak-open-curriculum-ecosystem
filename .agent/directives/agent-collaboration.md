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

## What This Directive Installs

This directive is grown by the [`multi-agent-collaboration-protocol`][p]
plan. WS0 + WS1 (landed) install: vocabulary, the shared communication log,
the structured claims registry, the JSON Schema authority, the staleness
archive, and three behavioural rules (`dont-break-build-without-fix-plan`,
`respect-active-agent-claims`,
[`register-active-areas-at-session-open`](../rules/register-active-areas-at-session-open.md)).
WS3 adds conversation files and the sidebar mechanism. WS5 harvests
evidence and drives refinement. Operational detail (schemas, lifecycle,
field provenance) lives in
[`collaboration-state-conventions.md`](../memory/operational/collaboration-state-conventions.md).

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

## Platform Independence

Where a collaboration behaviour can be platform agnostic, make it platform
agnostic. The protocol operates from repo-owned portable surfaces:
markdown, JSON, rules, commands, skills, hooks, and thin platform adapters.
Platform-specific agent-team features may help build, inspect, stress test,
or feed lessons back, but they are optional accelerants, not fallbacks,
replacements, or runtime dependencies.

## Working Model

The collaboration model between agents is **dialogue**, not authority
hierarchy. No orchestrator, no peer with veto power; the owner is the
final tiebreaker, surfaced through named channels when peer agreement
does not converge. Agents consult the surface before operating in
another agent's area; constructively challenge peer direction that
appears wrong; treat shared infrastructure (build, type, lint, static
analysis) as a shared good and do not break it without a fix plan;
match scope to the work in front of them; preserve conversation
evidence so future refinements cite real exchanges, not reconstructed
memory.

The normal posture is shared reasoning across the working tree: make
the concern visible, explain why it matters, let the peer respond. If
the work blocks without response, escalate via the explicit
owner-escalation channel (WS3).

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

"Area" is defined as: any file path, plan, ADR, or workspace currently
named in another agent's recent shared-communication-log entry or in an active claim
entry in
[`active-claims.json`](../state/collaboration/active-claims.json).

The
[`respect-active-agent-claims`](../rules/respect-active-agent-claims.md)
rule fires as a tripwire: *do not proceed until you have consulted the
surface and decided how to coordinate*. It does **not** fire as: *refuse
if a claim exists*. The companion
[`register-active-areas-at-session-open`](../rules/register-active-areas-at-session-open.md)
rule operationalises the consult-and-register half of the same tripwire.

## Communication Channels

Five primary channels plus owner escalation exist; they have different
shapes. Pick the one that fits what you need to communicate.

| Channel | Shape | Primary use | Forward ref |
| --- | --- | --- | --- |
| Thread record `<slug>.next-session.md` | Durable async, narrative, per-thread, multi-session | Continuity across sessions on a single thread | PDR-027 |
| **Shared communication log** `state/collaboration/log.md` | Schema-less append-only markdown, eventually-consistent | Discovery surface — leave notes for whoever reads next | WS0 (this) |
| Conversation file `state/collaboration/conversations/<id>.json` | Structured per-topic JSON, async | Live exchange between agents on overlap topics needing more structure than the shared communication log | WS3 |
| Sidebar | Short-lived focused exchange by mutual agreement | Tighter coordination when async is too slow | WS3 |
| Reviewer dispatch | Fork-blocking-rejoin within ONE agent's session | Specialist review of a draft (docs-adr, assumptions, etc.) | already in use |
| Owner question via `AskUserQuestion` | Hard-blocking sync to human | Final tiebreaker; missing-information that only the owner can supply | already in use |

Channel-selection rules: the **shared communication log is a discovery surface, not a
synchronisation surface** — eventually-consistent interleaved appends are
fine. **Reviewer dispatch is not peer collaboration** — reviewer
sub-agents are fork-blocking-rejoin within one agent's session and do
not register claims. **Owner is the final tiebreaker**, surfaced through
`AskUserQuestion` or (from WS3) the polled escalations directory; peer
agreement is the default, owner escalation is the last move when
agreement fails.

## Identity vs Liveness

These are different concerns and live in different surfaces.

- **Identity** is who-I-am-on-this-thread, additive across sessions per
  [PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).
  Identity rows live in thread records; the
  [`register-identity-on-thread-join`](../rules/register-identity-on-thread-join.md)
  rule installs the session-open tripwire.
- **Liveness** is when-was-this-agent-last-active-here, a *freshness
  signal* on a claim. Liveness lives on the structured-claims surface;
  each claim carries `claimed_at`, optional `heartbeat_at`, and a
  `freshness_seconds` budget (default 14400 = 4 hours). After expiry the
  claim is **stale** — noise to be audited at consolidation, not a blocker
  that strands other agents. Stale claims are archived (not deleted) by
  `consolidate-docs` so conversation files and napkin observations can
  cite archived claims permanently.

The PDR-027 identity schema is reused inside claim entries. No new
identity concept is introduced.

## Bootstrap Fast-Path

The single-agent case (no other agents present) pays the protocol's
**minimum overhead — one read, one write**. The agent reads
[`active-claims.json`](../state/collaboration/active-claims.json) and the
[shared communication log](../state/collaboration/log.md); finding no other claims, the
agent logs *"no other agents present"* to the shared communication log, registers its
own claim covering the session's intended areas, and proceeds. The single
write is load-bearing: it is the discovery seed for whatever sequential
agent comes next. The
[`register-active-areas-at-session-open`](../rules/register-active-areas-at-session-open.md)
rule operationalises this early-return.

The fast-path is not an exception to the protocol; it is the protocol's
minimum-overhead shape under low contention. Solo sessions do not pay
parallel-session coordination overhead beyond the single-write seed.

## Conversations as Learning-Loop Inputs

Shared-communication-log entries, claim entries, conversation files (WS3), and sidebar
transcripts (WS3) are durable evidence alongside the napkin. Refinements
to this directive or to the claim/conversation schemas cite entries from
those surfaces directly. Lessons graduate via the standard learning-loop;
WS5's seed harvest reads across all of them.

## Schema Evolution

JSON schemas in `.agent/state/collaboration/` carry `schema_version` from
their first commit. Compatibility is **additive-only within a major
version**: v1.x agents reading v1.y files (`y > x`) ignore unrecognised
fields and preserve them on write-back; major-version mismatch causes the
agent to bail out. The contract is documented in each schema's
`$comment_compatibility` block. Field provenance and lifecycle detail live
in [`collaboration-state-conventions.md`](../memory/operational/collaboration-state-conventions.md).
Field reductions land as major-version bumps.

## Threat Model

The protocol assumes **trusted agents** acting in good faith. Misbehaving
agents (excessive scope claims, never-released claims, fabricated entries)
are out of scope; the owner detects and resolves these at consolidation.
A hostile-agent threat model is a future PDR if the trust assumption
breaks down. **Future agents who suspect the trust assumption is failing
should NOT add hardening (signed entries, claim-integrity checks, scope
quotas) — surface the suspicion to the owner, who decides whether to open
a hostile-agent threat-model PDR.** The protocol is deliberately advisory;
hardening would be a category error.

## Founding Pattern

Three cross-session instances of full-repo pre-commit gates coupling
parallel agent sessions inside a 48-hour window (Frodo prettier
2026-04-24, Pippin auto-staging 2026-04-24, Jazzy knip 2026-04-25)
motivated this directive. The pattern is captured at
[`parallel-track-pre-commit-gate-coupling`][founding-pattern]; new
instances surface in [`napkin.md`][napkin] and feed
[WS5's seed harvest][p].

## Foundation Alignment

This directive operationalises PDR-026 (per-session landing as claim
granularity), PDR-027 (identity reuse), PDR-029 (tripwire pattern),
PDR-011 / ADR-150 (capture → distil → graduate → enforce), and
ADR-125 (canonical `.agent/` content with thin platform adapters).

## Cross-references

- [`user-collaboration.md`](user-collaboration.md) — sibling directive for
  the agent-to-owner working model.
- [`principles.md`](principles.md) — repository principles.
- [`.agent/state/README.md`](../state/README.md) — state-vs-memory
  distinction.
- [`.agent/state/collaboration/log.md`](../state/collaboration/log.md) —
  shared communication log (WS0).
- [`active-claims.json`][active-claims] — structured claims registry (WS1).
- [`active-claims.schema.json`][active-claims-schema] — JSON Schema
  authority (WS1).
- [`closed-claims.archive.json`][closed-claims] — staleness archive (WS1).
- [`collaboration-state-conventions.md`][state-conventions] — operational
  guide to lifecycle, schema-field provenance, and trusted-agents threat
  model.
- [`agent-collaboration-channels.md`][channels-card] — communication-channel
  reference card.
- [`threads/README.md`][threads-readme] — thread convention and
  additive-identity rule.

[p]: ../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md
[channels-card]: ../memory/executive/agent-collaboration-channels.md
[threads-readme]: ../memory/operational/threads/README.md
[founding-pattern]: ../memory/collaboration/parallel-track-pre-commit-gate-coupling.md
[napkin]: ../memory/active/napkin.md
[active-claims]: ../state/collaboration/active-claims.json
[active-claims-schema]: ../state/collaboration/active-claims.schema.json
[closed-claims]: ../state/collaboration/closed-claims.archive.json
[state-conventions]: ../memory/operational/collaboration-state-conventions.md
