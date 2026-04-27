---
fitness_line_target: 200
fitness_line_limit: 260
fitness_char_limit: 16000
fitness_line_length: 100
split_strategy: "Extract per-channel protocol detail to companion docs as channels grow; keep this file as the agent-to-agent working model and channel index"
---

# Agent Collaboration Practice

This directive defines the agent-to-agent working model. Its sibling,
[`user-collaboration.md`](user-collaboration.md), governs agent-to-owner
collaboration. Together they keep those two halves explicit.

It complements, but does not replace,
[`principles.md`](principles.md). If a collaboration habit conflicts with a
repository principle, surface the conflict and discuss it rather than
silently choosing one.

## What This Directive Installs

This directive is grown by the [`multi-agent-collaboration-protocol`][p].
WS0 + WS1 landed vocabulary, the shared log, claims, schemas, staleness
archive, and tripwire rules. WS3A adds decision threads and durable closure
history. The commit-window refinement adds short-lived `git` claims for the
shared index / HEAD surface. The intent-to-commit queue adds advisory FIFO
ordering plus exact staged-bundle verification before history is written.
WS3B installs agent sidebars and owner escalations; the joint-decision layer
records bilateral commitments and role follow-through. WS5 harvests evidence.
Details live in
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
the concern visible, explain why it matters, let the peer respond. Use a
sidebar for a short focused exchange, a joint decision when agents need a
shared commitment with recorder or actor follow-through, and an owner
escalation when peer agreement cannot resolve the block.

## Scope Discipline Across Agent Boundaries

Three foundational rules, named here as load-bearing principles:

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

"Area" is defined as: any file path, plan, ADR, workspace, or git
transaction surface currently named in another agent's recent
shared-communication-log entry or in an active claim entry in
[`active-claims.json`](../state/collaboration/active-claims.json).

The
[`respect-active-agent-claims`](../rules/respect-active-agent-claims.md)
rule fires as a tripwire: *do not proceed until you have consulted the
surface and decided how to coordinate*. It does **not** fire as: *refuse
if a claim exists*. The companion
[`register-active-areas-at-session-open`](../rules/register-active-areas-at-session-open.md)
rule operationalises the consult-and-register half of the same tripwire.

### c. Treat Commit as a Short-Lived Shared Transaction Surface

The git lock prevents repository corruption, but it does not communicate
intent or queue order before agents race the shared index and `HEAD`. Before
staging or committing, use the commit skill to enqueue the intended bundle,
open and close a short-lived `git:index/head` claim, and verify the exact
staged bundle immediately before `git commit`. This is awareness, ordering,
and auditability, not a mechanical lock.

## Communication Channels

Pick the channel that fits the shape of the coordination need. The
at-a-glance routing card is
[`agent-collaboration-channels.md`](../memory/executive/agent-collaboration-channels.md);
the operational state index is
[`collaboration-state-conventions.md`](../memory/operational/collaboration-state-conventions.md).

The high-frequency rule is: use active claims for live "I am touching
this area now" signals, `commit_queue` for advisory commit turn order and
staged-bundle verification, the shared communication log for discovery notes,
decision threads for structured async coordination, sidebars for focused short
exchanges inside a conversation, escalations for owner-facing unresolved
cases, and owner questions for final tiebreakers. Reviewer dispatch is draft
review inside one agent's session, not peer collaboration.

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
  that strands other agents. Closed claims are archived, not silently
  deleted: explicit, stale, and owner-forced closes all preserve
  `closure.kind`, `closed_at`, `closed_by`, and evidence refs. Commit-window
  claims normally use 900 seconds because the index / HEAD transaction should
  last minutes, not hours.

## Bootstrap Fast-Path

The single-agent case (no other agents present) pays the protocol's
**minimum overhead — one read, one write**: read active claims and the
shared log, log *"no other agents present"*, register the session claim,
and proceed. The single write is load-bearing: it is the discovery seed for
whatever sequential agent comes next. The
[`register-active-areas-at-session-open`](../rules/register-active-areas-at-session-open.md)
rule operationalises this early-return.

The fast-path is not an exception to the protocol; it is the protocol's
minimum-overhead shape under low contention. Solo sessions do not pay
parallel-session coordination overhead beyond the single-write seed.

## Conversations as Learning-Loop Inputs

Shared-communication-log entries, active and closed claim entries,
commit-queue entries, decision-thread files, sidebar entries, joint-decision
entries, and escalation case files are durable evidence alongside the napkin.
Refinements to this directive or to the collaboration-state schemas cite
entries from those surfaces directly. Lessons graduate via the standard
learning-loop; WS5's seed harvest reads across all of them.

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
quotas) — surface the suspicion to the owner.** The protocol is deliberately
advisory; hardening would be a category error.

## Founding Pattern

Three cross-session instances of full-repo pre-commit gates coupling
parallel agent sessions inside a 48-hour window (Frodo prettier
2026-04-24, Pippin auto-staging 2026-04-24, Jazzy knip 2026-04-25)
motivated this directive. The pattern is captured at
[`parallel-track-pre-commit-gate-coupling`][founding-pattern]; new
instances surface in [`napkin.md`][napkin] and feed
[WS5's seed harvest][p]. Commit-window claims apply the same lesson to the
narrower git transaction surface: expose intent and queue order before staging
or commit.

## Foundation Alignment

This directive operationalises PDR-026 (per-session landing as claim
granularity), PDR-027 (identity reuse), PDR-029 (tripwire pattern),
PDR-011 / ADR-150 (capture → distil → graduate → enforce), and
ADR-125 (canonical `.agent/` content with thin platform adapters).

## Cross-references

Core doctrine: [`user-collaboration.md`](user-collaboration.md),
[`principles.md`](principles.md), and [`.agent/state/README.md`](../state/README.md).
Core state: [log](../state/collaboration/shared-comms-log.md), [active claims][active-claims],
[closed claims][closed-claims], [conversation schema][conversation-schema],
[conversations][conversations-dir], [escalation schema][escalation-schema],
and [escalations][escalations-dir]. Operational companions:
[`collaboration-state-conventions.md`][state-conventions],
[`agent-collaboration-channels.md`][channels-card], and
[`threads/README.md`][threads-readme].

[p]: ../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md
[channels-card]: ../memory/executive/agent-collaboration-channels.md
[threads-readme]: ../memory/operational/threads/README.md
[founding-pattern]: ../memory/collaboration/parallel-track-pre-commit-gate-coupling.md
[napkin]: ../memory/active/napkin.md
[active-claims]: ../state/collaboration/active-claims.json
[closed-claims]: ../state/collaboration/closed-claims.archive.json
[conversation-schema]: ../state/collaboration/conversation.schema.json
[conversations-dir]: ../state/collaboration/conversations/
[escalation-schema]: ../state/collaboration/escalation.schema.json
[escalations-dir]: ../state/collaboration/escalations/
[state-conventions]: ../memory/operational/collaboration-state-conventions.md
