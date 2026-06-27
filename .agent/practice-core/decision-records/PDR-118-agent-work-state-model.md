---
pdr_kind: governance
---

# PDR-118: Agent Work-State Model

**Status**: Proposed
**Date**: 2026-06-27
**Related**:
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, and agent identity — the binding's identity key);
[PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md)
(agent-work capabilities are Practice-owned — why this model is a PDR, and its
host projection a phenotype);
[PDR-078](PDR-078-liveness-heartbeat-contract.md)
(liveness-heartbeat contract — the observed-liveness signal and its staleness
threshold);
[PDR-079](PDR-079-pdr-vs-adr-portability-distinction.md)
(PDR-vs-ADR portability — this model is the portable contract; the host-bound
projection lives in a separate ADR, named in the practice-index bridge rather than
linked from this body);
[PDR-094](PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md)
(collaboration state is untracked-by-design local state).
ADR-165 (the repo phenotype boundary — the host's collaboration-state projection
is the phenotype ADR, not this PDR); ADR-197 (one coordination-home checkout owns
shared registry state — where the binding is read and written); ADR-203 (untracked
collaboration-state tiers are process-then-archive-moved). Host ADRs are named by
identifier and resolved through the practice-index bridge, not linked from this
body (PDR-079).

## Context

A running agent has four work-state facts: **who** it is (PDR-027 identity),
**which worktree** it occupies, **which branch** that worktree is on, and **when it
was last alive**. No single authoritative surface binds them. The four facts are
split across four surfaces, each holding a fragment, none authoritative, and the
closest thing to a registry records part of the binding as **authored free-text**
rather than **derived ground truth**:

| Surface | identity | worktree / branch | liveness |
| --- | --- | --- | --- |
| the claims registry (de-facto active-agents surface) | structured | branch only as free-text intent | a freshness window, **not** liveness |
| the comms heartbeat event stream | yes | structured branch per emit | per-emit, but an append-only stream, not current state |
| the watcher-heartbeat surface | yes | none | **true** mtime liveness, but branch-blind |
| the git worktree listing | none | worktree + branch ground truth | n/a |

Two failure modes follow directly, both observed first-hand:

1. **An agent cannot answer "which worktree am I on?" from recorded state.** The
   shell working directory resets to the primary checkout after every command, and
   nothing records the agent→worktree binding, so the answer is carried, unverified
   belief.
2. **Freshness is not liveness.** A dead agent's claim read as `fresh` while its
   watcher heartbeat had been stale for hours — the freshness window outlived the
   process.

This binding is foundational input for every coordination mechanism: the
statusline, claims and collision-avoidance, the watcher-presence gate, handoff and
adoption, and the owner's at-a-glance who-is-where. Its value is not argued here;
this PDR fixes its model.

Agent identity, coordination, state, and lifecycle are Practice-owned (PDR-035), so
the **model** is recorded here as a PDR. The host implementation — the projection
logic, the read API, and any schema change — is phenotype and is recorded in a host
ADR at build time (ADR-165, PDR-079).

## Decision

**Adopt one Agent Work-State Model: a single authoritative, derived read surface
answering, for every live agent, `(identity → worktree → branch → liveness)`,
composed from three signals that are unified at the read but kept distinct at the
source.**

### 1. The authoritative read surface and the three-signal decomposition

The binding is read from one authoritative surface that projects three signals of
different kinds. The sources stay distinct; only the read is unified (decompose at
the tension — a flattening that conflates them is what produced "freshness is not
liveness"):

- **Claimed** — agent-asserted, mutable: the agent's work intent and the one fact a
  reset-working-directory shell cannot derive (the agent→worktree link, clause 3).
- **Observed liveness** — mechanical: the watcher-heartbeat mtime (PDR-078). "A
  process is alive." This is the liveness signal, **not** the claim freshness window.
- **Ground truth** — git: the git worktree listing gives the worktree→branch
  mapping. Authoritative; never authored.

### 2. Derive, do not author

Branch and worktree-path are git ground truth; liveness is the watcher mtime. The
read surface **projects** these. Agents do not retype branch into free-text intent,
and liveness is never inferred from a time window.

### 3. The self-assertion primitive: assert one validated anchor

Under the current session-launch topology — verified first-hand: the watcher
process and the command shell both inherit the primary-checkout working directory,
so no live process is rooted in a distinct agent worktree — the agent→worktree link
is **not mechanically derivable**. This is a verified, falsifiable property of how
sessions launch today, not a permanent law (see open question 2).

Given that, an agent asserts **exactly one** binding — `identity → worktree-path` —
once, and that assertion is **validated against the git worktree listing** (the
path MUST be a current worktree, or the assertion is rejected, fail-fast). The
anchor is **stable across the session**; only the projected branch changes if the
worktree's branch moves. From the validated anchor, worktree→branch and liveness
are projected; nothing else about the binding is authored.

This clause resolves the **model** (what to assert, how to validate, what to
derive). It is consistent with the explicit exclusion of "add a branch field to the
claim schema": branch is a *derivable* fact and must not be authored; the worktree
anchor is the *irreducible* asserted fact from which branch is derived. The
*reliable acquisition* of the path the agent asserts is a separate, still-open
model question (open question 2).

### 4. Replace, do not bridge — the disposition of each surface

Exactly one read surface is authoritative for the binding. Each of the four current
surfaces is reconciled or retired, not bridged:

- **the claims registry** — remains the home of the *claimed* signal (intent, and
  the validated worktree anchor); its free-text branch is **retired** (branch is
  projected from git); its freshness window is **retired as a liveness signal** and
  survives only as claim-TTL housekeeping, **never read as alive**;
- **the comms heartbeat event stream** — remains a heartbeat signal but is **not**
  the authoritative source of branch or liveness (git and the watcher mtime are);
- **the watcher-heartbeat surface** — is the authoritative *observed-liveness*
  source (mtime, PDR-078);
- **the git worktree listing** — is the authoritative *ground-truth* source
  (worktree→branch);
- **no fifth surface is added.**

### 5. Strict and complete

A dead agent reads as **dead** — liveness reflects the watcher mtime past the
PDR-078 threshold, not a window that outlives the process.

### 6. Practice-owned, host-implemented

This PDR owns the portable model: the binding, the three-signal decomposition,
derive-not-author, the assert-one-validated-anchor primitive, and the
reconcile/retire set. The host phenotype — where the anchor is stored, the
projection implementation, the read API, the schema change, and the coordination
home that owns the read/write surface (ADR-197) — is a host ADR authored at build
time.

## Rationale

- Deriving the binding once dissolves the per-mechanism re-litigation (statusline
  working-directory guessing, freshness-versus-liveness, the cross-worktree map's
  durable form) rather than solving each in place.
- **Decompose-at-the-tension** is load-bearing: the three signals look like one
  ("where is this agent") but have three update mechanisms and trust levels.
  Conflating them produced "freshness is not liveness".
- **Derive-not-author** removes the drift between authored branch and real branch.
- The **assert-one-validated-anchor** primitive is the minimal honest answer to the
  reset-working-directory constraint *as it stands today*: it authors only the
  single irreducible non-derivable fact and validates it strictly against ground
  truth. It does not claim the worktree is intrinsically un-derivable (open
  question 2).

## Consequences

- An agent answers "which worktree and branch am I on?" from the model, not from
  carried belief.
- A dead agent reads as dead.
- Exactly one surface is authoritative; the free-text intent branch and the
  freshness-as-liveness read are retired.
- **Binding constraint on the host ADR**: "freshness is never read as liveness"
  must be enforced *structurally* (no code path reads the freshness field to answer
  a liveness question), not by convention, or the retired-but-rescoped field
  reopens as a quiet fallback reader.
- The **statusline is the first consumer**: it reads the binding by identity and
  shows an agent's true worktree even when its session launched from the primary
  checkout. Its data source (this model's read surface versus the host editor's own
  workspace fields on stdin) is a phenotype choice for the build ADR (open question
  3).
- The interim, hand-maintained cross-worktree work-state surface is superseded in
  its durable form by this model; the host build plan is its vehicle.

## Open questions (for owner / Director ratification)

1. **Where the validated worktree anchor lives** — a validated field on the claim
   versus a dedicated binding record. Phenotype, for the build ADR.
2. **Reliable acquisition of the worktree path the agent asserts (model-level,
   open).** Clause 3 resolves *what* to assert and *how* to validate it, but not
   *how the agent reliably obtains* the path. "Carried from session launch, then
   validated" is a candidate, but carried context is the very unverified-belief
   defect this model exists to remove, and validation rejects a *wrong* worktree,
   not a *plausible-but-stale* one. The un-derivability in clause 3 is contingent
   on current launch topology; **if a fully-derived acquisition mechanism is found
   (or sessions are launched rooted in their worktree), it supersedes clause 3 via a
   PDR amendment** — not an in-place reinterpretation. This is a model-level
   question, not a phenotype detail.
3. **Statusline data source** — this model's read surface versus the host editor's
   workspace fields on stdin. Both honour derive-not-author; the build ADR picks the
   cleaner seam. Phenotype.
4. **Stale-anchor reconciliation (mid-session).** Clause 3 validates the anchor at
   assertion time only; a worktree removed mid-session leaves a stale anchor.
   Clause 5's completeness covers liveness, not anchor staleness. The
   re-validation cadence (and its relation to the stale-state sweep) is for the
   build ADR, but the model names it as open.

## Notes

This PDR records the model only; it authorises no build. The build is gated by the
owner GO on the host build plan and proceeds via a host phenotype ADR. The model
holds the four ratified invariants of the collaboration substrate as inputs
(advisory-not-mechanical, text-first, portable, owner-final) and does not
re-litigate them.
