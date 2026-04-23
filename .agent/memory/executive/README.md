# Executive Memory

Stable organisational / contract memory. The surfaces here describe
*how the repo is organised and what the contracts are* — they are
looked up when performing an action the surface governs, not
internalised before each session.

See [`.agent/memory/README.md`](../README.md) for the three-mode
memory taxonomy (active / operational / executive).

## Surfaces

| Surface | Purpose | Look up when… |
| --- | --- | --- |
| [`artefact-inventory.md`](artefact-inventory.md) | Canonical-vs-adapter taxonomy + how-to create skills / commands / rules / sub-agents | Adding a new skill, command, rule, or sub-agent |
| [`invoke-code-reviewers.md`](invoke-code-reviewers.md) | Reviewer catalogue, layered triage, worked examples | Non-trivial change is about to close and reviewers need choosing |
| [`cross-platform-agent-surface-matrix.md`](cross-platform-agent-surface-matrix.md) | Platform-adapter support matrix across Cursor / Claude / Codex / Gemini | Verifying platform-adapter parity; adding a new platform |

## Refresh Discipline

Executive memory is not refreshed per session. It changes only when
the artefact *architecture* itself evolves (e.g. a new platform
adapter is added, a new reviewer capability is created, the
canonical-vs-adapter pattern is amended). Each amendment is a
deliberate governance change, usually accompanying an ADR, PDR, or
Practice-Core doctrine update.

## Relationship to Doctrine

Executive memory carries *contracts*, not *principles*. The principle
behind the canonical-first pattern is in
[ADR-125](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
and the review doctrine behind the reviewer roster is in
[ADR-114](../../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md)

+ [ADR-129](../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).
The executive-memory surfaces operationalise those doctrines with
concrete catalogues and step-by-step creation procedures.
