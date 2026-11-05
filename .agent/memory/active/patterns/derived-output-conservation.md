---
name: Derived-Output Conservation
polarity: pattern
use_this_when: Deciding what to commit from a pipeline run that produced bulk generated outputs alongside unique source material
category: process
layer: general
proven_in: .agent/memory/active/archive/napkin-2026-07-20.md (2026-07-15, plan-corpus refounding S0/S1 publication decision)
proven_date: 2026-07-15
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Committing tens of megabytes of regenerable derived output by analogy with a source freeze — or, inversely, losing the ability to verify a derived claim because neither the attestation nor the regeneration contract was recorded"
  stable: true
---

> **POLARITY: PATTERN.** A positive shape to repeat when a run produces both
> unique source and deterministic derived output.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Principle

**Unique source freezes commit verbatim; deterministic derived outputs commit
only a compact attestation.** The attestation carries: content hashes, counts,
calibration disclosures, and the EXACT regeneration + verification contract
(base commit, command phases, expected digests). Bulk artefacts stay
local/gitignored. **Twice-run byte-identity is the reproducibility bar** — a
derived output is "deterministic" only after two runs from the same base
produce identical bytes.

## Why

The two failure directions are both real:

- Committing bulk derived output (the worked instance weighed ~49MB /
  ~996k lines) bloats history with regenerable bytes and invites treating a
  snapshot as truth — precedent-is-not-correctness: the S0 source freeze was
  right to commit verbatim BECAUSE it was unique and unregenerable; applying
  that precedent to S1's derived outputs was the analogy failure the owner's
  retention question exposed.
- Discarding derived output with no attestation destroys the ability to
  verify any claim made from it. The compact contract preserves
  verification at ~zero storage cost: anyone can regenerate from the pinned
  base and check the digests.

Verification must be fail-loud: execute the digest check (`shasum -c`) from
the committed manifest — printing digests without comparing exits green on a
mismatch.

A second instance of the retention question arriving late: on the 2026-09-02 Actions export "store
it in-repo" became "local, untracked, ephemeral" at the first sighting of the size cost, so "the
retention question belongs at the ask", settled before the first byte is fetched (Kiln holds Slag's
closeout of 2026-09-02, event 3632de12).

## Consequences

A local-only conservation copy (a gitignored commit on an unpushed branch)
is CONTAINMENT, not backup — clone loss loses it. Name its custodian and its
disposal condition (deletable only after a regeneration re-verify against
the committed hashes) explicitly, or it becomes untracked residue nobody may
safely delete.
