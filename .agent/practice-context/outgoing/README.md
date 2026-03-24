# Outgoing Practice Context

This directory carries sender-maintained supporting context for Practice
exchange.

It is not canonical. The canonical portable package remains the seven files
in `.agent/practice-core/`.

Use these files to explain:

- why recent Practice changes were made
- which local adaptations are specific to this repo
- which false starts or corrections are worth reusing elsewhere
- how to adopt repo-specific platform support that is too detailed for the Core

If a change is significant enough to enter the practice-core changelog,
consider whether the changelog alone is too thin and whether a supporting note
or report here would help a receiving repo.

Keep this directory small. If something is already obvious from the seven-file
Core package, its changelog, or the sender repo's canonical permanent docs, do
not duplicate it here.

This directory may be built up over time. When material is shared to another
repo, copy the relevant files into that repo's `.agent/practice-context/incoming/`.

## Current Outgoing Set

### Write-Back Notes (2026-03-23 integration round)

These notes carry innovations from oak-mcp-ecosystem that the incoming
Practice from algo-experiments did not have. They are designed to improve
the Practice in the originating repo and any downstream receivers.

| File | Purpose |
| ---- | ------- |
| `practice-maturity-framework.md` | 4-level diagnostic framework for Practice depth (Structural → Operational → Self-Correcting → Evolving). Prevents "not even wrong" installations |
| `handover-prompts-vs-session-skills.md` | Architectural distinction between state-free session-entry skills and stateful domain-specific handover prompts. Refinement to the prompts-to-skills migration |
| `two-way-merge-methodology.md` | Operational method for Practice integration when both sides evolved independently. Start from incoming, merge local back. Character ceiling and fitness rename blast radius learnings |
| `architectural-excellence-and-layer-topology.md` | Two universal principles proven by CLI-SDK retriever drift incident. Active tier (1 repo validation). Applicable to any multi-package architecture |
| `code-pattern-schema-for-discoverability.md` | Richer frontmatter schema (`use_this_when`, `barrier` checklist) vs the simpler Core schema. Backwards-compatible convergence path |
| `production-reviewer-scaling.md` | Three-layer composition (components → templates → wrappers) for scaling to 17+ reviewers. Architecture persona pattern (4 distinct perspectives) |
| `cross-platform-surface-integration-guide.md` | How to port the surface matrix, wrapper parity checks, and explicit unsupported states into a receiving repo without forcing symmetry |
| `claude-code-hook-activation.md` | Concrete note on thin native Claude Code hook activation: `PreToolUse` only, canonical policy in `.agent/hooks/`, repo-local runtime in `scripts/`, advisory hooks documented-only |

### Earlier Notes (pre-integration)

| File | Purpose |
| ---- | ------- |
| `three-dimension-fitness-functions.md` | Three-dimension fitness constraint and the split adoption model: trinity files carry all three dimensions while other docs may declare only `fitness_line_count` |
| `validate-practice-fitness.ts` | TypeScript mirror of the live zero-dependency validator (`scripts/validate-practice-fitness.mjs`) |
| `validation-scripts.md` | Reference check, self-containment check, agent dependency check scripts |
| `reviewer-system-guide.md` | Full three-layer reviewer architecture with roster, composition, and portability validation |
| `platform-adapter-reference.md` | How platform adapters reference canonical content |
| `cross-repo-transfer-operations.md` | Operational guide for Practice Core transfers |
| `plan-lifecycle-four-stage.md` | Plan lifecycle: active → current → paused → archive |
| `seeding-protocol-guidance.md` | First-time Practice hydration protocol |
| `starter-templates.md` | Starter templates for common Practice artefacts |
