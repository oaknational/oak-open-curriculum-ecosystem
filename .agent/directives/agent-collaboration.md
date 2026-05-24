---
fitness_line_target: 280
fitness_line_limit: 360
fitness_char_limit: 19500
fitness_line_length: 100
split_strategy: "Per-channel protocol detail extracts to companion docs as channels grow (the routing card in agent-collaboration-channels.md is the natural home). Cross-channel governance — meta-doctrine about when to add mechanism, which authority resolves a coordination need, how surfaces interact — stays here, parented under Working Model. Keep this file as the agent-to-agent working model and channel index."
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

This directive is grown by the [`multi-agent-collaboration-protocol`][p]. It
installs vocabulary, the shared log, claims, schemas, durable closure history,
short-lived `git` claims, advisory `commit_queue` order, sidebars, owner
escalations, joint decisions, and WS5 evidence harvest. Details live in
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

Hot shared-state docs are not read-only. An active claim is a coordination
signal, not a write-lock; read the current surface and write the lifecycle
or handoff updates the work needs. The transaction helper plus commit
queue make overlap visible and serializable. Recipe detail lives in
[`collaboration-state-conventions.md`][state-conventions] §Write-Safety
Contract.

## Platform Independence

Where a collaboration behaviour can be platform agnostic, make it platform
agnostic. The protocol operates from local portable Practice surfaces:
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

### Coordinator Role

Peer collaboration is the default. A **coordinator role** is an opt-in
affordance for small collaborations (2-3 agents), where it would
otherwise be unnecessary structure undermining the reasoning-peers stance.

The coordinator role becomes the *expected* default when a super-
linear coordination chain becomes visible — format-drift loops
bouncing the pre-commit hook across multiple agents, repeated
commit-queue collisions, or peer-pause cascades. The trigger is the
symptom, not an agent count; calibration of any numerical threshold
is held in the friction register and napkin so it can move as
evidence accumulates.

The role is a *commitment to coordinate*, not a new primitive. Any
agent observing the chain claims it by posting a shared-comms-log
entry naming the role and the chain symptom. Authority is bounded:
pause peers via canonical comms events with deadlines, queue commits via
`commit_queue`, resume once the chain clears. Conflicts between two
claimants resolve by sidebar. Termination is automatic — when the
chain clears the role dissolves; the opening shared-comms-log entry
is the durable record.

### Coordination Surface Discipline

Before adding a new always-visible coordination surface, widen the regular
state audit first. Active claims, closure history, decision threads,
unresolved decision requests, evidence bundles, and schema validation became
usable once `consolidate-docs` reported them together. Structured state plus
consolidation output is usually the first dashboard.

Split evidenced durability gaps from speculative coordination mechanisms.
Claim-history and decision-thread work were grounded in real harvest
evidence; sidebar, timeout, and file-backed owner-escalation primitives were
held promotion-gated until async decision threads proved insufficient. The
discipline: **ground each new coordination mechanism in observed need before
promoting it.** Speculative coordination shapes accumulate as dead surfaces
the moment they ship without an evidence-of-need claim.

### Inter-Agent Comms Is a First-Class Primitive

Not all coordination needs owner-mediation. When another agent's state
blocks mine and they may still be active, the correct first move is a direct
comms-event to that agent (with a deadline + a named default action if no
response), brief poll for reply, then escalate to owner only if no response
by deadline. The reverse order — surface options to the owner first —
over-uses owner mediation for coordination the agents can resolve between
themselves.

Operating shape: **bounded-deadline + default-action format** on the
comms-event; agent posts, polls briefly, acts on default if silent.
Owner-mediation remains the right channel for **owner-owned decisions**
(authorisation chain lifts on owner-directed deferrals; strategic
redirection; cross-thread scope changes). The discipline: route through the
**lowest-authority resolver** that can decide.

Worked instance (graduated to this directive 2026-05-09): doc-cleanup
`verify-staged` blocked on three pre-staged-but-deferred files from a peer's
session. Initial options surfaced to the owner were all owner-mediated
(authorise unstage; commit peer's first; wait). Owner direction redirected
to a comms-event with bounded deadline + default action; coordination
resolved between the two agents within the deadline. Owner-stated principle
on close: communicating with other agents is always an option; not all
communication needs to be mediated through the owner.

## Scope Discipline Across Agent Boundaries

Four foundational rules, named here as load-bearing principles:

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
intent or queue order before agents race the shared index and `HEAD`. Use the
commit skill: enqueue the intended bundle, open a short-lived
`git:index/head` claim, verify the exact staged bundle, then close the claim
after success, failure, or abort. This is awareness, ordering, and
auditability, not a mechanical lock.

Peer-pair review is not commit authorship: implementers own staging/commit;
reviewers gate by verdict.

The load-bearing coordination rules are explicit pathspec staging and commit,
whole-tree hook respect, durable `.agent` state when it belongs to the current
bundle, and a peer-claim re-read after helper-mediated state writes. Operational
recipes live in [`stage-by-explicit-pathspec`][stage-by-explicit-pathspec],
[lifecycle][lifecycle] §Commit Queue, and the [channel card][channels-card].

### d. Cleanup Ethics for Apparently Orphaned Claims

Resist unilateral cleanup; archive only via deliberate governance passes
(`consolidate-docs § 7e`) or owner-forced close — manual orphan cleanup
between scheduled audits is the exception, not the routine. Visibility
before deletion is the discipline: post a shared-log note naming the
claim and closure kind before writing the close. Recipe in
[lifecycle][lifecycle] §Apparently Orphaned Claims.

## PR Closeout Discipline

A PR closeout has two **independent** evidence loops: gate state and
reviewer-comment state. A green check suite does not prove comments,
threads, or review summaries are settled. Fetch and classify reviewer
comments before the next edit, and report planning PRs with two verdicts:
technical readiness and plan decision-completeness.

PR metadata is part of the review surface. When scope changes or the
closeout moves from local/pending to pushed, refresh title/body and
next-session records together so reviewers and future sessions inherit the
current state. Routing notes live in the [channel card][channels-card].

## Communication Channels

Pick the channel that fits the shape of the coordination need. The
at-a-glance routing card is
[`agent-collaboration-channels.md`](../memory/executive/agent-collaboration-channels.md);
the operational state index is
[`collaboration-state-conventions.md`](../memory/operational/collaboration-state-conventions.md).

## Identity vs Liveness

Identity is who-I-am-on-this-thread; liveness is when this claim was last
fresh. Identity rows live in thread records per
[PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
and the
[`register-identity-on-thread-join`](../rules/register-identity-on-thread-join.md)
tripwire. Liveness lives on structured claims through `claimed_at`, optional
`heartbeat_at`, and `freshness_seconds`; stale claims are consolidation noise,
not blockers. Recipes live in [state conventions][state-conventions] and
[lifecycle][lifecycle].

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
`$comment_compatibility` block; field reductions land as major-version
bumps. Field provenance is co-located with each field via
`$comment_provenance`; lifecycle and evolution detail live in
[`collaboration-state-conventions.md`](../memory/operational/collaboration-state-conventions.md).

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
narrower git transaction surface: expose intent and queue order before
staging or commit.

## Foundation Alignment

This directive operationalises PDR-026 (per-session landing as claim
granularity), PDR-027 (identity reuse), PDR-029 (tripwire pattern),
PDR-035 (agent-work capabilities belong to the Practice),
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
[`threads/README.md`][threads-readme]. Reviewer-comment-state harvesting
(§PR Closeout Discipline §Gate State And Reviewer-Comment State Are
Distinct) composes with
[PDR-015 reviewer authority and dispatch][pdr-015]:
PR closeout names *when* reviewer-comment state must be harvested;
PDR-015 names *whose* review authority applies on which abstraction
layer.

[p]: ../plans/agent-tooling/current/multi-agent-collaboration-protocol.plan.md
[channels-card]: ../memory/executive/agent-collaboration-channels.md
[threads-readme]: ../memory/operational/threads/README.md
[pdr-015]: ../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md
[stage-by-explicit-pathspec]: ../rules/stage-by-explicit-pathspec.md
[founding-pattern]: ../memory/collaboration/parallel-track-pre-commit-gate-coupling.md
[lifecycle]: ../memory/operational/collaboration-state-lifecycle.md
[napkin]: ../memory/active/napkin.md
[active-claims]: ../state/collaboration/active-claims.json
[closed-claims]: ../state/collaboration/closed-claims.archive.json
[conversation-schema]: ../state/collaboration/conversation.schema.json
[conversations-dir]: ../state/collaboration/conversations/
[escalation-schema]: ../state/collaboration/escalation.schema.json
[escalations-dir]: ../state/collaboration/escalations/
[state-conventions]: ../memory/operational/collaboration-state-conventions.md
