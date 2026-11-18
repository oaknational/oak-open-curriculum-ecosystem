---
classification: core
description: Apply the first question and existing architecture before non-trivial work
---

# Apply Architectural Principles

Read and follow `.agent/directives/principles.md`. It is the authoritative
source for all architectural principles — the cardinal rule, the decision
lenses, decompose at the tension, TDD, fail-fast error handling, no
compatibility layers, no shims, no symlinks, no absolute paths, quality gates,
and naming conventions — and it operationalises the ADR corpus collectively
(see the repository's ADR index, the README of its decision-record directory).

Before planning or implementing non-trivial work, apply the first question,
trace the change to value, and prefer the simplest architecture that still
preserves quality. Respect existing decision records (ADRs, PDRs and the
host's other record kinds) and Practice decisions instead of creating
parallel approaches or backwards-compatibility layers.
