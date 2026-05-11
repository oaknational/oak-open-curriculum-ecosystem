---
pdr_kind: governance
---

# PDR-059: Regenerator-Output Classification Discipline

**Status**: Accepted
**Date**: 2026-05-11
**Related**:
[PDR-054](PDR-054-asymmetric-cure-discipline.md) (Asymmetric-Cure
Discipline — this PDR extends the asymmetric-cure framing to the
post-hook-pre-commit window, naming the classification gate that
brackets the hook chain on the trailing side);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — classification is
the structural form of the otherwise-behavioural "don't absorb peer
work via hooks" cure);
[PDR-044](PDR-044-memetic-immune-system.md) (memetic immune system —
the classification taxonomy is the innate-immunity layer for the
post-hook surface).

## Context

PDR-054 named the asymmetric-cure failure mode at the `git commit`
staging boundary and authorised the symmetric structural cure for the
*pre-hook* surface (a fingerprint check at `verify-staged` against the
queued-intent file list). That cure protects the queued bundle from
being expanded by foreign-stage absorption *before* the hook chain
runs.

A second surface exists. The pre-commit hook chain itself stages
files: regenerator output (schema codegen, doc generation), formatter
auto-fixes (prettier --write, eslint --fix, markdownlint --fix), and
any other hook whose contract is to write into the working tree.
These hook-introduced files are absorbed into the commit *after* the
pre-hook `verify-staged` check has passed. The pre-hook cure cannot
see them; they fall outside its window.

Observed shape: a commit's queued bundle declares files A, B. The
pre-hook check passes. The hook chain runs — its formatter touches
file C (a peer's in-progress work that happened to be in the working
tree); its codegen writes file D (legitimate regenerator output). The
commit lands with A, B, C, D. Files C and D were never queued; the
operator had no opportunity to refuse them at the queued-intent
authoring step. The asymmetric-cure failure mode re-enters through
the trailing surface.

The symmetry diagnosis: the pre-hook gate is symmetric for files that
were already in the working tree at queue-authoring time, but
asymmetric for files the hook chain itself introduces or mutates. The
hook chain is the new asymmetry surface and needs its own structural
gate.

The cure cannot be "no hook may write to the working tree" — that
forecloses legitimate regenerator and auto-fix patterns the Practice
relies on. The cure is *classification*: distinguish hook-staged
files that are *intentional* (regenerator output the operator
explicitly wants to land; auto-fixes against already-queued files)
from hook-staged files that are *absorption* (arbitrary peer work
swept in by a hook that happened to run over the working tree).

## Decision

When authoring or auditing a pre-commit hook chain in a shared-state
context, classify every hook-staged file by intent. Three classes:

1. **Class A — Intentional regenerator output**. Files produced by
   hooks whose declared contract is to write into the working tree
   (schema codegen, doc generation, format/lint *creating* new
   output). The set of Class A producers is *enumerated*, not
   inferred from hook behaviour. Each producer declares which output
   paths or path globs it owns. Files outside the declared paths are
   not Class A even when the producer emitted them.

2. **Class B — Intentional auto-fix of already-queued files**. Files
   mutated in place by hooks whose contract is to fix already-staged
   content (prettier --write, eslint --fix, markdownlint --fix on
   files in the queued bundle). Mutation is permitted *only* on
   files already in the queued bundle; the same auto-fix tool running
   on a non-queued file produces Class C, not Class B.

   *Definition*: a file is *hook-staged* when it appears in the
   post-hook staged set but is not in the queued-intent file list
   (i.e. classification compares the post-hook index against the
   queued bundle, not against the pre-hook index). A file mutated
   by an auto-fix tool that the operator did not queue is therefore
   hook-staged and Class C, regardless of whether the file existed
   in the working tree before the hook ran. This matters for cases
   such as a formatter running over a peer's mid-flight working-tree
   change: the file pre-existed but was never queued, so it is
   Class C absorption, not Class B mutation.

   *Precedence at the Class A / Class B seam*: a hook-staged file
   that matches *both* a Class A manifest entry (producer + target
   path) *and* the already-queued-bundle predicate (Class B) is
   classified as **Class A**. Manifest match takes precedence
   because the manifest is the positive declaration of intent;
   Class B's permission is a default for unmanifested auto-fix
   tools over queued content. The classification outcome is the
   same in either case (the commit is permitted) so the precedence
   rule exists for diagnostic clarity rather than for permission
   semantics — failure messages and audit trails name the matched
   class unambiguously.

3. **Class C — Arbitrary peer-work absorption**. Any hook-staged
   file that is neither Class A (no matching producer + path) nor
   Class B (no matching tool + file not in queued bundle). Class C
   is the asymmetric-cure failure-mode re-entry and is forbidden.

The discipline:

- **Hook-staged files are classified at the post-hook-pre-commit
  window.** The classification gate fires after the hook chain
  completes and before `git commit` writes the commit object. It is
  the trailing complement to the pre-hook `verify-staged` check.
- **Class A producers are enumeratively bounded.** A versioned
  manifest declares every producer and the output paths or globs it
  owns. New regenerator-producing hooks require manifest entry as
  part of their landing; absence of a manifest entry classifies the
  output as Class C.
- **Class B applies only to mutations of already-queued files.** A
  formatter or linter that mutates a non-queued file is producing
  Class C output, regardless of the tool's declared contract.
- **Class C aborts the commit with a structured failure message.**
  The message names the absorbed file paths, the class they were
  mis-classified as, and the corrective action (manifest entry for
  Class A; explicit queue inclusion for Class B; investigate
  cross-agent absorption for Class C proper).

The classification doctrine *extends*, does not replace, the
asymmetric-cure framing established by PDR-054:

| Window | Gate | Failure mode it blocks |
| --- | --- | --- |
| Pre-hook | `verify-staged` fingerprint check | Foreign-stage absorption from peer agents *before* the hook chain runs |
| Post-hook-pre-commit | Classification (Class A/B/C) | Foreign-stage absorption *introduced or mutated by the hook chain itself* |

Together the two gates bracket the hook chain.

## Scope

**Adopter scope**: every Practice-bearing repo with a pre-commit hook
chain that performs working-tree writes (regenerator hooks; auto-fix
hooks; any hook whose post-condition includes staged-file changes).
The classification taxonomy is portable; the host-specific manifest
location, producer enumeration, and classification implementation
live in host ADRs.

**Excluded**: repos whose pre-commit chain is purely *read-only*
verification (lint, test, type-check without auto-fix). The
classification gate is unnecessary when the hook chain has no
working-tree write surface.

## Rationale

The asymmetric-cure failure mode at the post-hook surface is
*invisible until it fires* in the same way the pre-hook variant is —
the operator authoring the commit does not see the hook chain's
intermediate staging; they see only the final committed set. The
gap between queued intent and committed reality is filled by hook
behaviour the operator did not author.

Classification by *intent* rather than by file type or producer
identity is the right framing because:

- *File type* is not the discriminator. A `.ts` file may be Class A
  (codegen output) or Class C (peer work mid-flight). The class is
  about *who put it there and why*, not what it is.
- *Producer identity alone* is not the discriminator. A formatter
  running on a queued file is Class B; the same formatter running on
  a non-queued file is Class C. The classification is the *pair*
  (producer, target).
- *Enumeration* is the structural gate, in a precise sense: the
  manifest is a **negative-knowledge gate**, not a positive
  enumeration of all legitimate output. Unlisted hook output is
  Class C by default; the manifest does not anticipate every
  legitimate emission, it only declares the emissions an operator
  is willing to accept. Inferring intent from hook behaviour would
  leave the open-set problem unsolved (any new hook could produce
  absorption; classification by inference cannot anticipate
  unknown unknowns). Enumeration closes the set by *blocking the
  unknown*: a hook that wants to land output declares its manifest
  entry; absence of an entry is the abort signal. This matters for
  reasoning about manifest coverage — operators should treat the
  manifest as a permission list with default-deny semantics, not a
  catalogue of all possible legitimate output.

The third-instance-trigger principle from PDR-054 applies: at one
post-hook absorption the cause may be a misconfigured hook; at two
it may be coincidence; at three the post-hook surface is the cause
and classification is the symmetric closure. The 2026-05-10 Quiet
Lurking Mask observation captured the second instance with a
diagnosis pointing at structural absence rather than behavioural
slip; the pre-emptive landing of this PDR (before the third
instance) is justified by the structural reading and by the fact
that the post-hook surface is *contiguous* with the pre-hook surface
the PDR-054 cure already closes — leaving the contiguous surface
half-closed is itself the asymmetry shape PDR-054 forbids.

A symmetric cure at the post-hook surface has its own costs:
manifest maintenance discipline (new regenerator hooks declare their
output paths), false-positive surface (legitimate hooks that haven't
declared yet trip the gate), operational complexity (the
classification implementation lives somewhere host-specific). These
trades are real and they belong in the host ADR; the *requirement*
to install a post-hook classification gate once a hook chain has
working-tree write surface is portable Practice governance.

## Consequences

**Required**:

- Hook-chain documentation in shared-state contexts records the
  presence or absence of a classification gate. Absence is permitted
  only when the chain has no working-tree write surface; the absence
  is justified explicitly.
- Class A producers are declared in a versioned manifest that names
  the producer, the output path or path glob it owns, and the
  rationale for landing the output.
- Class C absorption events surface in the failure path with
  structured diagnostics, not silent rolling-up into the commit.
- New hooks that write to the working tree declare their Class A
  manifest entry as part of their landing; the entry is part of the
  hook's atomic-landing bundle.

**Forbidden**:

- Treating any hook-staged file as Class A by default. Default
  classification is Class C; A and B are positive declarations.
- Inferring intent from hook *output volume* (e.g. "this hook touched
  many files so they must all be Class A"). The classification is
  per-file, per-producer, per-target.
- Bypassing the classification gate to land a commit whose
  hook-staged set contains Class C absorption. The bypass re-enters
  the failure mode the gate exists to close.
- Treating the classification gate as advisory once it has landed.
  Advisory enforcement of a structural cure is the asymmetric shape
  PDR-054 forbids; the gate is hard.

**Costs**:

- One-time implementation in the host's hook-execution surface or
  commit-orchestrator (the host ADR owns the choice).
- Ongoing manifest maintenance: new regenerator hooks require an
  entry; retired hooks require entry removal; producer-output-path
  changes require manifest updates.
- Authoring discipline for hooks: the producer-output contract must
  be explicit and enumerable, not "whatever the hook decides to
  write".

## Implementation

This PDR's host-repo operational application is an amendment to
ADR-177 (Asymmetric-Cure Enforcement at the Staging Boundary). The
amendment names the post-hook classification gate as the trailing
complement to the pre-hook `verify-staged` fingerprint check and
records the host-specific implementation surface (commit-skill
extension, manifest location, producer enumeration).

The PDR-054 §Implementation reference to ADR-177 is extended in a
companion §Related cross-reference noting that the post-hook
absorption case is governed by this PDR's classification doctrine
and the ADR-177 amendment, not by the PDR-054 verify-staged framing.

## Source

This PDR graduates the substance of the `pending-graduations.md`
entry *"Hook-chain re-staging absorbs files post-verify-staged"*
(captured 2026-05-10 by Quiet Lurking Mask after the second observed
instance of post-hook absorption; target named in the entry as
"amendment to PDR-054 + ADR-177 OR new PDR for post-hook-verify-
staged"; trigger named as "second-instance OR owner-direction"). The
owner-direction trigger fired 2026-05-11 in the
graduation-candidates-drain session; the cure-shape decision (option
iii — classification by intent) was owner-selected at session open
with the explicit framing that classification introduces a
structurally distinct concept (the taxonomy over hook-staged files)
not present in PDR-054's asymmetric-cure framing, and therefore
warrants its own PDR rather than an amendment in place.
