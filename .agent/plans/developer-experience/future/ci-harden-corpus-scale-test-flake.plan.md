---
lineage:
  serves_thread: ci-and-test-efficiency
  serves_stream: developer-experience
  derives_from: "2026-06-24 CI-efficiency scan; #219 (per-edge expect antipattern fix)"
---

# CI: harden corpus-scale tests against the 5s timeout flake

**Status**: FUTURE (strategic brief — not executable until promoted)
**Priority**: Low (the acute instance was fixed in #219; this prevents the class)
**Created**: 2026-06-24
**Owner**: Engineering

## Problem and intent

The sdk-codegen graph-corpus integration tests (count-guards and stat recounts) each
re-derive over the **full committed corpus** (13k+ nodes, 43k+ edges) per `it()`. PR #219
fixed the worst instance (a per-edge `expect()` loop that ran ~5–12s and tripped vitest's
5s default under load). The remaining tests are correct and well under 5s today, but they
re-scan the corpus independently and share the same flake exposure as the corpus grows.

Intent: keep the corpus-scale class durably clear of the 5s default by sharing the
per-corpus computation, and codify the pattern that caused the flake.

## End goal · mechanism · means

- **Goal**: corpus-scale integration tests stay fast with comfortable headroom under 5s; no
  recurrence of the timeout flake; no re-runs wasted.
- **Mechanism**: compute corpus-derived values once at `describe`/module scope and assert
  against them — fewer full scans, lower wall-clock, more margin.
- **Means**: refactor the count-guard/recount tests to share a single computed pass;
  record the pattern (filter/`every` + assert-once, never per-element `expect` over a
  corpus array) as the local convention these tests follow.

## Acceptance criteria (outcome, not activity)

- The sdk-codegen graph-corpus integration suite runs well under 5s with headroom (record
  the duration).
- Same guards and assertions preserved (drift detection unchanged).
- No per-element `expect()` over a corpus array remains in the file.

## Dependencies and sequencing

- Independent (sole scope: sdk-codegen graph-corpus tests). Complements but does not depend
  on the vitest-pool change. No `ci.yml` overlap.

## Non-goals

- **Not** raising the test timeout — the 5s default is correct for integration tests per
  house convention (only e2e/smoke raise it); the fix is efficiency, not a looser gate.
- Not removing the count-guard tests — they are legitimate corpus-drift guards
  ("validators recompute, never just record").

## Risks and unknowns

- Minimal: a pure test refactor with the existing assertions as the safety net.

## Promotion trigger

Owner greenlights. Low urgency — #219 removed the acute flake; this is class-prevention.

## Foundation alignment

testing-strategy.md ("each proof once… repeated proofs waste resources"; integration timeout
convention), principles.md (no waste). Same coverage, less recomputation.
