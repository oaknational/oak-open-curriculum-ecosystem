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

This directive is grown by the `multi-agent-collaboration-protocol`. It
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

**Liveness needs injected asymmetry.** Two peers both defaulting to
"HOLD if no reply" is a mutual-politeness deadlock — no designated
mover, so the shared resource never clears (worked instance
2026-06-28, a commit window). Break symmetry with a deterministic
tiebreaker: first-to-commit commits the whole file and the other
re-edits (the owner's standing cure), lowest `session_id_prefix`,
oldest claim, or a gatekeeper seat. Where none fits, randomised
backoff (wait a random interval, re-sense the shared state, retry)
breaks symmetry probabilistically — an owner-directed design
direction for claim adoption, buffer-drain ownership, and any
"after you / no, after you" peer default.

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

**For design and decision work, peer-pair sidebars beat
coordinator-mediated hub-and-spoke.** The worked evidence: a four-plus-agent
coordinator+helpers window ground to a halt — mutual waiting, thirty-one
directed broadcasts, almost no decisions — while peer-pair sidebars resolved
the same class of design decisions in minutes. Route logistics (commit order,
claim scarcity, gate scheduling) through a coordinator when the chain symptom
appears; route design and decision substance through a focused sidebar between
the two agents closest to it.

The role is a *commitment to coordinate*, not a new primitive. Any
agent observing the chain claims it by posting a shared-comms-log
entry naming the role and the chain symptom. Authority is bounded:
pause peers via canonical comms events with deadlines, queue commits via
`commit_queue`, resume once the chain clears. Conflicts between two
claimants resolve by sidebar. Termination is automatic — when the
chain clears the role dissolves; the opening shared-comms-log entry
is the durable record.

### Coordination Surface Discipline

**Shared memory/state files are writable and committable by any agent, at any
time, unconditionally.** The napkin, `distilled.md`, continuity surfaces,
thread records, claims, comms events, and every other shared record of
knowledge or coordination state accept writes from anyone — a
memory-preservation or closeout write is never blocked by a claim, a
coordination collision, or a fitness signal. These surfaces are append- and
merge-tolerant by design, so committing a dirty shared file conserves every
agent's appends; the deliberate trade-off accepts git-blame attribution
ambiguity to prevent write logjams and mutual-politeness deadlocks. When two
agents hold appends to the same file, the first to commit commits the whole
file and the other re-edits (the injected-asymmetry tiebreaker). The
respect-staged-bundle caveat applies to code and product artefacts only,
never to these surfaces. (Canonical home of the repo-continuity
"always writable and commit-includable" invariant line.)

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
Inter-agent communication is agent-owned and never owner-gated — never ask
the owner for permission to message or poll another agent. Asking for help is
a first-class use of the channel: a substantive "please do this thing I
cannot or should not do myself" request to a capable peer, not only
coordination or state notification.
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
`gate-recovery-cadence.plan.md`
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
`active-claims.json` (see the tracked [state contract](../state/README.md)).

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
When gatekeeper, marshal, and implementer are different agents, each verifies
the named gate evidence and exact pathspec immediately before the commit window.
Once the hook runs, that hook output is the authority for the attempt; older
independent probes are diagnostic context, not an override.

Lockfile custody (standing, recorded 2026-07-2x): `pnpm-lock.yaml` has NO
exclusive custodian — it is derived. Each lane declares its dependencies in
its own workspace manifest and commits the resulting lockfile delta with its
bundle; a lane blocking on "who owns the lockfile" has invented a custodian
the derivation model does not have. Conflicts resolve by re-running the
install on the merged manifests, never by hand-merging the lockfile.

### d. Cleanup Ethics for Apparently Orphaned Claims

Resist unilateral cleanup; archive only via deliberate governance passes
(`consolidate-docs § 7e`) or owner-forced close — manual orphan cleanup
between scheduled audits is the exception, not the routine. Visibility
before deletion is the discipline: post a shared-log note naming the
claim and closure kind before writing the close. Recipe in
[lifecycle][lifecycle] §Apparently Orphaned Claims.

## Convergence and Delegation Discipline

Two positive complements to the scope-discipline tripwires above (PDR-026/027/029):

- **Scan for convergence, not only collision.** In a shared window or at handoff,
  actively scan live peer outputs for the dependency, answer, or evidence your
  lane needs and wire them in — checking only for file conflicts misses the value
  a peer already created.
- **Delegate by judgement load, not parallelism.** Mechanical edits parallelise
  safely; a subtle correctness boundary stays with the agent who understands it
  unless the brief names that boundary precisely — delegating a judgement-heavy
  edit on parallelism alone plants a false claim the reviewer must then catch.
- **Route work as offers with a costless decline.** An honest capacity decline
  ("deep window; this deserves a fresh seat") is a load-bearing structural
  member of the routing culture, never a confession — the fleet is built to
  catch work, not seats. Two obligations keep it honest: the decliner names
  what the no covers AND what it does not, in the same breath (a decline
  scoped to one work-shape is not seat-wide unavailability — an idle agent is
  a defect, and a sloppy no propagates faster than a careful one because it
  is easier to quote); and the router treats a decline as scoped to the
  work-shape asked about, re-offering different-shaped work freely. Three
  worked instances 2026-07-29/30 (two precision-telemetry declines converging
  on fresh-seat; an offer/decline/route arc cited as the culture working).
- **Second opinions from a cross-platform seat at judgement-sized moments**
  (owner standing directive, 2026-07-30). Contested dispositions, design
  forks, and blind-spot-prone verdicts may route to a designated
  second-opinion seat on a DIFFERENT model family (founding instance: a
  Codex/GPT-5 seat) — proportional, never routine ceremony. One
  self-contained directed event per ask; the second-opinion seat holds no
  claim and returns opinion only; the asking seat owns the disposition. The
  value is the different failure surface, so the seat's platform diversity
  is the point, not its identity — the designated seat is re-derived from
  the live roster at time of use.

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

**Relayed owner words are not orderable by event timestamp.** When two
transmitted owner directions cross (a card answer relayed by one seat vs an
ask relayed by another), the relay's `created_at` is the RELAY time, not the
utterance time — no recency-vs-first-handedness precedence rule is sound.
Only the source resolves: verify the facts first-hand, then put the
collision to the owner as one question (two worked instances in one day,
2026-07-25; in the first the owner ruled BOTH directions applied).

## Identity vs Liveness

Identity is who-I-am-on-this-thread; liveness is **event-recency** — when the
role last emitted any event (heartbeat or substantive) within the staleness
threshold. Identity rows live in thread records per
[PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
and the
[`register-identity-on-thread-join`](../rules/register-identity-on-thread-join.md)
tripwire. **Liveness is read from the heartbeat / event-recency stream (PDR-078),
NOT computed from a claim's `claimed_at` + `freshness_seconds` window** — that
window is claim-currency housekeeping that outlives the process, and reading it as
agent liveness is the F-44 "freshness ≠ liveness" SAFETY bug. A claim itself is an
**advisory, area-scoped coordination** signal over a mutable area — not the liveness
(nor presence, nor work-state) surface; those are distinct facets. Stale claims are
consolidation noise, not blockers.

The claimed **area is a durable, repo-relative, topology-independent identity** —
which is why claims key on `areas` while file-level mechanical coordination (the
shared single-checkout index) belongs to the **commit queue**, which keys on
files. One area-claim therefore serves both permanent topologies — multiple
agents in one checkout, and multiple agents in separate worktrees — because the
shared durable artefact is the same in both. Never regress the identity to
copies: claiming files by absolute worktree path makes the claim
topology-dependent and hides the shared artefact and merge-overlap it exists to
surface; the cure for "which copy?" is raising identity to the area, not naming
the copies. And the claim is **not the seat**: succession and seat-binding
derive from work-state and role, never from holding a claim. Recipes live in
[state conventions][state-conventions] and [lifecycle][lifecycle].

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
instances surface in `napkin.md` and feed
WS5's seed harvest. Commit-window claims apply the same lesson to the
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
Core state: the tracked [state contract](../state/README.md), which defines the
checkout-local `shared-comms-log.md`, `active-claims.json`, and
`closed-claims.archive.json` surfaces; [conversation schema][conversation-schema],
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

[channels-card]: ../memory/executive/agent-collaboration-channels.md
[threads-readme]: ../memory/operational/threads/README.md
[pdr-015]: ../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md
[stage-by-explicit-pathspec]: ../rules/stage-by-explicit-pathspec.md
[founding-pattern]: ../memory/collaboration/parallel-track-pre-commit-gate-coupling.md
[lifecycle]: ../memory/operational/collaboration-state-lifecycle.md
[conversation-schema]: ../../agent-tools/src/collaboration-state/schemas/conversation.schema.json
[conversations-dir]: ../state/collaboration/conversations/
[escalation-schema]: ../../agent-tools/src/collaboration-state/schemas/escalation.schema.json
[escalations-dir]: ../state/collaboration/escalations/
[state-conventions]: ../memory/operational/collaboration-state-conventions.md
