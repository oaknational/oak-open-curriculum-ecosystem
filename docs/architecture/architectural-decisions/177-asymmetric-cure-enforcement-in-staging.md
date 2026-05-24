# ADR-177: Asymmetric-Cure Enforcement for `git commit -- <pathspec>` (Staging Boundary)

**Status**: Accepted (Revised)
**Date**: 2026-05-10
**Updated**: 2026-05-11 — post-hook classification gate added as the
trailing complement to the pre-hook `verify-staged` cure; cites
PDR-059 (Regenerator-Output Classification Discipline) as the
governing portable doctrine.
**Related**:
[ADR-118](118-commit-skill-as-canonical-pre-commit-flow.md) — commit
skill as canonical pre-commit flow;
[ADR-176](176-commit-skill-advisory-orchestrator-naming.md) — commit-skill
advisory orchestrator naming and surface polarity;
PDR-054 (Asymmetric-Cure Discipline) — this ADR is the host-repo
operational application of PDR-054's symmetric-cure discipline for the
specific case of foreign-stage absorption at `git commit`;
PDR-059 (Regenerator-Output Classification Discipline) — the post-
hook-pre-commit classification gate; this ADR's 2026-05-11 amendment
records the host-repo operational application of PDR-059.

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

## 2026-05-11 amendment — Post-hook classification gate (PDR-059 host application)

The pre-hook fingerprint-divergence cure described above closes the
asymmetric-cure failure mode for files staged _before_ the pre-commit
hook chain runs. A contiguous surface remains: files staged _by_ the
hook chain itself (regenerator output, formatter auto-fixes,
markdownlint auto-fixes, etc.) bypass the pre-hook check by
construction — they appear in the index only after `verify-staged`
has passed.

The 2026-05-10 Quiet Lurking Mask session observed the second
instance of post-hook absorption (the first having been latent
behind hook chains that historically had narrow auto-fix surface).
The asymmetric-cure framing's third-instance trigger is reached
contiguously (the pre-hook surface is already at three observed
instances; the post-hook surface is contiguous with it and shares
the failure mode shape), so the symmetric-cure obligation is
inherited.

PDR-059 (Regenerator-Output Classification Discipline) names the
portable doctrine: classify every hook-staged file by intent as
Class A (intentional regenerator output, declared in an
enumeratively-bounded producer manifest), Class B (intentional
auto-fix of already-queued files), or Class C (arbitrary peer-work
absorption — forbidden, aborts the commit).

This amendment adopts the **post-hook classification gate** as the
host-repo operational application of PDR-059. The implementation
surface is the `agent-tools` commit-orchestrator (the same
workspace that owns the pre-hook `verify-staged` cure), extended
with a post-hook classification step that runs after the husky
pre-commit chain completes and before `git commit` writes the
commit object.

Implementation outline (the executable plan lives in `.agent/plans/`
and owns the slice-by-slice rollout; this amendment records the
_decision shape_):

1. **Class A producer manifest** lives at a versioned host path
   (`.agent/hooks/regenerator-output-manifest.json` or equivalent;
   exact location is a plan-time choice). Each entry names the
   producer (hook id or tool name), the output path or path glob
   it owns, and a one-line rationale for landing the output.
2. **Classification logic** runs at the post-hook-pre-commit window.
   Hook-staged files are computed by diffing the staged index
   against the queued-intent file list. Each file is classified
   against the manifest plus the auto-fix tool set:
   - matched against a Class A manifest entry by (producer, target
     path) → Class A;
   - matched against the auto-fix tool set AND target file is in
     the queued bundle → Class B;
   - otherwise → Class C.
3. **Failure path** (Class C absorption detected): the
   commit-orchestrator aborts with a structured error message
   naming the absorbed files, the class they were mis-classified as
   (e.g. "would have been Class A but no manifest entry for path X"),
   and the corrective action (manifest entry, queue inclusion, or
   investigate cross-agent absorption).
4. **Manifest discipline**: new regenerator-producing hooks declare
   their manifest entry as part of their landing bundle; the entry
   is reviewed alongside the hook itself. Manifest entries for
   retired hooks are removed in the retirement bundle.

The two gates together bracket the hook chain:

| Window               | Gate                                                                               | Host implementation                                                   |
| -------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Pre-hook             | Fingerprint-divergence check at `verify-staged` (shape b, original decision above) | `agent-tools` commit-queue `verify-staged` command                    |
| Post-hook-pre-commit | Three-class classification gate (new, PDR-059 host application)                    | `agent-tools` commit-orchestrator post-hook step + versioned manifest |

The shape-(c) escalation criterion from the original decision is
unchanged: if a fourth pre-hook foreign-stage absorption fires
after shape (b) lands, the pre-hook cure is still asymmetric and
shape (c) is the symmetric closure for the pre-hook surface. The
post-hook gate is shape-(c)-independent; it closes the post-hook
asymmetry regardless of whether the pre-hook cure has moved from
(b) to (c).

**Additional consequences from this amendment**:

- _Required_: every regenerator-producing hook in the pre-commit
  chain has a manifest entry; new hooks declare their entry as part
  of their landing bundle; the classification gate is non-bypassable
  once landed.
- _Forbidden_: treating any hook-staged file as Class A by default;
  inferring intent from output volume; bypassing the classification
  gate to land a commit with Class C content.
- _Costs_: one-time implementation in the commit-orchestrator;
  ongoing manifest maintenance; authoring discipline for new hooks
  to declare their producer-output contract.

**Implementation status**: deferred to a follow-on plan in the
`agent-tools` workspace. The PDR substance + the ADR amendment land
in the 2026-05-11 graduation-candidates-drain session as doctrine;
the executable rollout (manifest schema, classification step,
producer enumeration, test surface, integration with the
commit-orchestrator) is sequenced separately with its own reviewer
dispatch and atomic-landing TDD discipline.

**Pre-conditions on the follow-on executable plan** (from
`assumptions-expert` review of the doctrine landing, 2026-05-11):

1. _Producer inventory_. The plan must include an inventory step
   that enumerates the current pre-commit hook chain's working-tree-
   writing producers and lists candidate Class A manifest entries.
   If the inventory exceeds approximately ten producers or contains
   ad-hoc tools without stable identity, the manifest-bounded-cost
   assumption needs revisiting before the gate lands as non-
   bypassable. The inventory is a falsifiable input to the
   manifest-design decision, not a rubber-stamp.
2. _Hook-staged-file definition_. The plan must adopt the PDR §
   Decision Class B definition verbatim — classification is
   computed against (post-hook staged set) minus (queued-intent
   file list), not against (post-hook staged set) minus (pre-hook
   staged set). The two definitions classify peer-mid-flight cases
   differently; only the queued-intent baseline gives the
   asymmetric-cure semantics PDR-059 requires.

## Source

This ADR is the host-repo operational application of PDR-054
(Asymmetric-Cure Discipline) for the pre-hook surface and, as
amended 2026-05-11, of PDR-059 (Regenerator-Output Classification
Discipline) for the post-hook surface. The substance of both
failure modes is portable; the host-architectural choices land
here. The earlier prose-only graduation of the pre-hook cure
landed at
[`stage-by-explicit-pathspec.md § Cure Asymmetry`](../../.agent/rules/stage-by-explicit-pathspec.md);
this ADR closes the asymmetry the rule's body explicitly named on
the pre-hook surface and extends the closure to the post-hook
surface in the 2026-05-11 amendment.
