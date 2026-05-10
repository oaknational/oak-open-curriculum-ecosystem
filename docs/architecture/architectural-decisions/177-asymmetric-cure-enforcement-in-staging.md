# ADR-177: Asymmetric-Cure Enforcement for `git commit -- <pathspec>` (Staging Boundary)

**Status**: Proposed
**Date**: 2026-05-10
**Related**:
[ADR-118](118-commit-skill-as-canonical-pre-commit-flow.md) — commit
skill as canonical pre-commit flow;
[ADR-176](176-commit-skill-advisory-orchestrator-naming.md) — commit-skill
advisory orchestrator naming and surface polarity;
PDR-054 (Asymmetric-Cure Discipline) — this ADR is the host-repo
operational application of PDR-054's symmetric-cure discipline for the
specific case of foreign-stage absorption at `git commit`.

## Context

The repo's
[`stage-by-explicit-pathspec`](../../.agent/rules/stage-by-explicit-pathspec.md)
rule is a behavioural cure: agents are required to invoke `git commit -- <pathspec>` so that staged files outside their intended scope (foreign
stage from peer agents) are not absorbed into their commit. The rule is
documented; the SKILL.md cites it; experience files and napkin entries
record three observed instances.

Per PDR-054, a behavioural cure for a _shared-state_ failure mode that
fires only when _every_ operator follows it is _asymmetric_: it protects
the applier from being the cause of the failure mode but does not
prevent peers from causing the same failure mode against the applier.
Three observed instances by 2026-05-05 (Vining Spreading Seed initial;
Lacustrine→Moonlit `8fa339f4`; Ethereal→Dawnlit `36102937`) prove the
asymmetric-cure shape and trigger PDR-054's symmetric-cure graduation.

The repo carries three architecturally distinct candidate shapes for the
symmetric cure. The choice trades friction, false-positive rate, and
operational complexity:

**(a) Pre-commit hook refusal of implicit pathspec**. `.husky/pre-commit`
gains a step that reads the staged set, compares against the agent's
declared `commit_queue` intent, and refuses the commit when the staged
set extends beyond the queued bundle. The cure fires automatically on
every `git commit` regardless of which agent triggered it.

- Pros: tightest enforcement; the symmetric cure is at the failure
  mode's actual surface (the commit boundary).
- Cons: requires `commit_queue` to be authoritative state at commit
  time; false positives on legitimate commits that include sibling
  state writes (claims, comms-events) the agent did not pre-queue.

**(b) Commit-queue layer fingerprint-divergence detection at `verify-staged`**. The existing `agent-tools` `commit-queue verify-staged`
phase already records the staged-bundle fingerprint. Extend it to
_compare_ the staged-set fingerprint against the queued-intent's file
list and abort with a hard error when they diverge.

- Pros: integrates with the existing commit-queue flow; the divergence
  surface is already authored. The advisory orchestrator becomes the
  carrier (still advisory at the husky boundary, but the agent's own
  pre-commit ritual catches the divergence).
- Cons: the cure is still applier-driven (the agent must run
  `verify-staged`); peers who skip the commit-queue ritual entirely are
  not bound. This is _less_ asymmetric than (a) but not fully symmetric.

**(c) Shared pre-commit pathspec-matching gate**. `.husky/pre-commit`
reads the most-recently-claimed `commit_queue` entry and refuses any
`git commit` whose staged set extends beyond the queued bundle, regardless
of which agent issued the commit. Combines (a)'s symmetric reach with
(b)'s queue-integration.

- Pros: closes the asymmetry at the husky boundary; symmetric across all
  agents.
- Cons: highest false-positive risk (any staged set divergence aborts);
  needs careful design for the bootstrap-fast-path case where no queued
  entry exists.

## Decision

Adopt **shape (b)** — commit-queue layer fingerprint-divergence detection
at `verify-staged` — as the **default symmetric cure**, with shape (c)
held as the next-tier escalation if shape (b) leaves residual asymmetric
failures observable.

Rationale:

- Shape (b) has the lowest implementation cost (the fingerprint surface
  is already authored). Landing it requires only the comparison logic
  and the abort path.
- Shape (b) has the lowest false-positive surface (only the agent's own
  ritual fires it; legitimate state-edit divergences are caught by the
  agent's own `verify-staged` invocation, not by a husky-time abort).
- Shape (b) preserves the husky pre-commit chain's narrow blocking
  scope (format / markdownlint / lint / type-check / depcruise / knip /
  test) without adding queue-state coupling that could fail-block CI.
- Shape (c) escalation criterion: if a fourth foreign-stage absorption
  fires after shape (b) lands, the cure is still asymmetric (peers
  bypassing `verify-staged` entirely) and shape (c) is the symmetric
  closure.

Implementation handed to a follow-on plan (`agent-tools` workspace
enhancement); this ADR records the _decision shape_ and the _why_; the
plan body owns the implementation slices.

## Consequences

**Required**:

- The `agent-tools` `commit-queue verify-staged` command extends to
  compare the staged-bundle fingerprint against the queued-intent's
  file list. Divergence aborts with a clear citation of this ADR.
- The commit skill's `SKILL-CANONICAL.md` updates to name the
  fingerprint-divergence behaviour as part of the verify-staged
  contract.
- Plans that perform multi-file commits update their queued-intent file
  list before staging, not after. The discipline is documented.

**Forbidden**:

- Bypassing `verify-staged` to land a commit whose staged set extends
  beyond the queued bundle. The bypass is a structural failure-mode
  re-entry.
- Treating the `commit-queue verify-staged` divergence error as
  advisory. Once shape (b) lands, the divergence is a hard abort.

**Costs**:

- One-time implementation in the `agent-tools` workspace (estimated
  small slice; the fingerprint surface already exists).
- Plans authoring multi-file commits learn to declare their full file
  list in the commit-queue intent. This is a discipline cost, not a
  tooling cost.

**Open questions**:

- Should shape (c) be queued as a sequenced follow-on regardless, on the
  basis that asymmetric residue from shape (b) is structurally certain?
  Or wait for the empirical signal of a fourth absorption instance?
  This ADR holds the question open; the answer is owner-direction-
  shaped.

## Source

This ADR is the host-repo operational application of PDR-054
(Asymmetric-Cure Discipline). The substance of the asymmetric-cure
failure mode is portable; the choice of (a)/(b)/(c) is host-architectural
and lands here. The earlier prose-only graduation of the cure landed at
[`stage-by-explicit-pathspec.md § Cure Asymmetry`](../../.agent/rules/stage-by-explicit-pathspec.md);
this ADR closes the asymmetry the rule's body explicitly named.
