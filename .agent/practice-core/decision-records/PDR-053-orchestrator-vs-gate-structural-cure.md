---
pdr_kind: governance
---

# PDR-053: Orchestrator-vs-Gate Structural Cure (Advisory Polarity)

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — this PDR specialises
the discipline for the case where the *enforcement surface* itself bifurcates
into advisory and blocking polarities);
[PDR-044](PDR-044-memetic-immune-system.md) (memetic immune system — the
advisory orchestrator is the innate-immunity layer, the blocking hook chain
is the adaptive-immunity layer);
[PDR-046](PDR-046-layered-knowledge-processing.md) (layered knowledge
processing — the substance/form distinction at every layer applies to
enforcement surfaces too).

## Context

Commit-flow tooling in a Practice-bearing repo commonly carries two
distinct enforcement surfaces:

1. An **agent-invoked orchestrator** — a script or command the agent runs
   *before* invoking `git commit` to surface advisory checks: discipline
   reminders, fitness signals, vocabulary alignment, message-format
   pre-screen. The agent reads the output, acts on it, and proceeds.
2. A **git-invoked blocking hook chain** — `.husky/pre-commit` (or the
   equivalent), which runs at the moment of `git commit` invocation,
   refuses the commit on non-zero exit, and is the only enforcement
   surface that *blocks* a commit.

These two surfaces share configuration, share vocabulary, and often share
caller context, but they have **fundamentally different authority**:

- The orchestrator is *advisory*. Its non-zero exit is information for the
  agent to read and route, not a commit verdict.
- The hook chain is *blocking*. Its non-zero exit is the commit verdict.

When the orchestrator's filename, banner, or surrounding language carries
gate-coded vocabulary (`gates`, `pre-commit-validation`, `commit-skill-
checks`), the agent under failure pressure rounds the orchestrator's
identity into the blocking-hook identity (the failure mode named at
[`patterns/eager-rounding-off-on-partial-structures.md`](../../memory/active/patterns/eager-rounding-off-on-partial-structures.md)).
The compounding chain produces bypass framings (`--no-verify` proposals,
fabricated doctrinal collisions) that the substance does not require.

The 2026-05-05 evidence corpus (5 instances across 4 distinct agents in a
single 24-hour window: Ethereal, Dawnlit, Opalescent, Twilit, Fronded)
showed the conflation is *robust under context pressure regardless of
prior reading of the doctrine*. Reading the distilled-md entry on
advisory-vs-blocking polarity does NOT inoculate the next agent against
the rounding-off failure. Structural cure is required.

## Decision

The orchestrator-vs-gate distinction is encoded **structurally at three
surfaces** so the polarity is impossible to round off:

1. **Filename polarity** — the orchestrator script's filename names its
   advisory polarity directly. In this repo the rename is
   `scripts/check-commit-skill-gates.ts` →
   `scripts/check-commit-skill-advisories.ts`. The filename-borne
   "gates" token is severed.

2. **Banner polarity** — every script invocation prints
   `[ADVISORY ONLY — NOT A COMMIT GATE]` at the top of stdout/stderr
   before any other output. Under failure pressure the agent reads the
   banner BEFORE rounding the surface's identity.

3. **Skill-doctrine polarity** — the commit skill's `SKILL-CANONICAL.md`
   enumerates the actual blocking hooks (`.husky/pre-commit` chain)
   explicitly, names each by their concrete commands, and names what they
   do NOT include (e.g. `practice:fitness:strict-hard` is in the orchestrator
   but is NOT in the husky chain). The skill names the orchestrator as
   advisory in the same paragraph that names the blocking chain.

A non-zero orchestrator exit is **never** licence to propose `--no-verify`,
construct a doctrinal collision, or otherwise reframe the advisory output
as a blocking verdict.

## Scope

**Adopter scope**: every Practice-bearing repo that carries an agent-
invoked pre-commit advisory orchestrator and a separate git-invoked
blocking hook chain. The structural cure is portable; the specific
filename and skill-file paths are host-local.

**Substance**: the polarity-at-three-surfaces shape. The filename rename,
banner string, and skill-doctrine enumeration are the operational forms;
each Practice-bearing repo reproduces the shape against its own file
layout.

## Rationale

A single-surface cure (e.g. only the SKILL.md amendment) was tried in this
repo on 2026-05-05 (commit `368e5aff` landed advisory-vs-blocking
distinction in distilled.md). It did not inoculate subsequent agents:

- Threading Nebula authored the cure-shape entry AND fired the conflation
  *in the same session*.
- Fronded fired the conflation AFTER the doctrine landed in HEAD.

Reading-only cures lose to artefact gravity (per
[`patterns/passive-guidance-loses-to-artefact-gravity.md`](../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)).
The orchestrator's filename token "gates" pulls the rounded-off identity
back into place under context pressure regardless of prior reading. Three
co-firing structural surfaces (filename, banner, doctrine) close the gap
that any single surface leaves open.

The `--no-verify` proposal is *forbidden* (per
`feedback_no_verify_fresh_permission` and the
[`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md)
rule); the structural cure addresses *why* agents reach for it under
orchestrator failure even though they know the rule.

## Consequences

**Enables**:

- The orchestrator's advisory polarity is legible at every interaction
  point: filename (read at script invocation), banner (read at every
  output), skill-doctrine (read at every commit-skill consultation).
- The blocking hook chain's identity is preserved as the only authority
  on commit verdicts. Any framing that conflates the two is structurally
  marked-out.
- Future advisory enforcement surfaces inherit the polarity-at-three-
  surfaces shape by default.

**Costs**:

- One-time rename across the orchestrator codebase plus all references
  (skill files, plan documents, package scripts if any). This PDR's
  graduation lands the rename in this repo as the worked instance.
- Subsequent ports of advisory enforcement to a new context need to
  reproduce all three surfaces, not just one.

**Forbids**:

- An advisory enforcement surface whose filename, banner, or surrounding
  doctrine carries gate-coded vocabulary without the polarity-at-three-
  surfaces structural cure.
- Treating a non-zero orchestrator exit as licence to propose `--no-verify`,
  reshape the commit, or surface "doctrinal collision" as cure.
- Any framing that absorbs the advisory orchestrator's identity into the
  blocking hook chain's identity.

## Implementation

The host-repo implementation lands as ADR-176 (orchestrator-vs-advisory
script naming). The skill-doctrine surface is the commit skill's
`SKILL-CANONICAL.md`. The filename is renamed
`scripts/check-commit-skill-gates.ts` →
`scripts/check-commit-skill-advisories.ts` (and the unit-test file
correspondingly), the exported function `runCommitSkillGates` is renamed
`runCommitSkillAdvisories`, and the orchestrator output prints the
advisory banner at start of every invocation.

## Source

This PDR graduates the substance of the
`pending-graduations.md` entry *"PDR candidate — orchestrator-vs-gate
structural cure"* (captured 2026-05-05, 5 instances across 4 distinct
agents; deferred under fabricated-gate vocabulary across multiple
sessions until owner reframe in the `knowledge graduation` session
2026-05-10).
