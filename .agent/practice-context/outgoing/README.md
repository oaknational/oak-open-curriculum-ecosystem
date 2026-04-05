# Outgoing Practice Context

This directory carries sender-maintained supporting context for Practice
exchange.

It is not canonical. The canonical portable package remains the eight files
in `.agent/practice-core/`.

Use these files to explain:

- why recent Practice changes were made
- which local adaptations are specific to this repo
- which false starts or corrections are worth reusing elsewhere
- how to adopt repo-specific platform support that is too detailed for the Core

If a change is significant enough to enter the practice-core changelog,
consider whether the changelog alone is too thin and whether a supporting note
or report here would help a receiving repo.

Keep this directory small. If something is already obvious from the eight-file
Core package, its changelog, or the sender repo's canonical permanent docs, do
not duplicate it here.

This directory may be built up over time. When material is shared to another
repo, copy the relevant files into that repo's `.agent/practice-context/incoming/`.

## Structure

- Keep broadly reusable support notes as flat files at this level.
- Use repo-targeted subdirectories when the write-back is specific to one
  source repo or one exchange round.
- Give each repo-targeted subdirectory its own `README.md` so a receiver can
  copy the whole pack without reverse-engineering intent.

## Current Outgoing Set

### Repo-Targeted Packs

| Path | Purpose |
| ---- | ------- |
| `agent-collaboration/` | Focused write-back from OOCE's 2026-04-05 integration of incoming `agent-collaboration` notes; captures the strongest gate/workspace-adoption signals and outgoing-pack hygiene feedback |

### Write-Back Notes (2026-04-03 promotion round)

These notes capture the next set of portable learnings promoted after the
continuity decision and the platform-config hardening pass.

| File | Purpose |
| ---- | ------- |
| `continuity-handoff-and-surprise-pipeline.md` | Split-loop continuity model: lightweight `session-handoff`, deep convergence in `consolidate-docs`, and surprise as a capture → distil → graduate → enforce pipeline |
| `platform-config-is-infrastructure.md` | Tracked project platform settings as part of the agentic system contract; local overrides stay gitignored and additive |
| `reviewer-gateway-operations.md` | Operational reviewer doctrine for large rosters: layered triage, explicit `focused`/`deep` depth, delegation snapshots, and reintegration discipline |
| `health-probe-and-policy-spine.md` | Summary-first agent-infrastructure health probing with a four-layer Policy Spine and drift checks for command parity, hooks, continuity, and practice-box state |
| `frontend-review-cluster-pattern.md` | Gateway-routed browser/UI reviewer cluster pattern with overlap boundaries and host-boundary rules |
| `design-token-governance-for-self-contained-ui.md` | CSS-first token governance and styling independence for self-contained HTML/iframe surfaces |

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
| `pattern-schema-for-discoverability.md` | Richer frontmatter schema (`use_this_when`, `barrier` checklist) vs the simpler Core schema. Backwards-compatible convergence path |
| `production-reviewer-scaling.md` | Three-layer composition (components → templates → wrappers) for scaling to 17+ reviewers. Architecture persona pattern (4 distinct perspectives) |
| `cross-platform-surface-integration-guide.md` | How to port the surface matrix, wrapper parity checks, and explicit unsupported states into a receiving repo without forcing symmetry |
| `claude-code-hook-activation.md` | Concrete note on thin native Claude Code hook activation: tracked project `PreToolUse` wiring, canonical policy in `.agent/hooks/`, repo-local runtime in `scripts/`, advisory hooks documented-only |

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
| `starter-templates.md` | Starter templates for common Practice artefacts (reviewer-template pack in this repo; see repo-targeted hygiene feedback for the naming collision with incoming hydration seed templates) |
