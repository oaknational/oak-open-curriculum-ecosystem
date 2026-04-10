---
name: mcp-specialist-upgrade
overview: Complete the MCP specialist ADR-129 triplet by adding the missing canonical skill, aligning surfaces, and resolving discoverability/status drift.
todos:
  - id: ws1-lane-status-reconciliation
    content: Reconcile `current/` lane semantics with plan status (`IN PROGRESS` vs `QUEUED`) across collection entrypoints.
    status: completed
  - id: ws1-adr129-rollout-mapping
    content: Map all remaining tasks to ADR-129 rollout steps and remove stale or already-complete deliverable wording.
    status: completed
  - id: ws2-canonical-skill
    content: Create `.agent/skills/mcp-expert/SKILL.md` with doctrine hierarchy, tiered context, and capability-routing boundaries.
    status: completed
  - id: ws2-skill-surface-adapters
    content: Add missing skill wrappers and audit reviewer/rule wrappers for parity across supported surfaces.
    status: completed
  - id: ws3-discoverability-and-guidance
    content: Update collection docs and invocation guidance, including MCP quick-triage/worked-example coverage and sync-log evidence.
    status: completed
  - id: ws4-validation-and-review-closure
    content: Run deterministic validation checks and close specialist findings (including low-priority) with implemented change or explicit rationale.
    status: completed
isProject: false
---

# MCP Specialist Upgrade — Executable Source Plan

**Status**: COMPLETE
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)

## Context

`mcp-reviewer` and `invoke-mcp-reviewer` already exist and include live-spec-first and ext-apps coverage. The missing canonical artefact is the active skill (`mcp-expert`). Reviewer feedback also identified status/discoverability drift and incomplete rollout validation criteria.

## Reviewer Synthesis Applied

### Must-fix incorporated

- Resolve status drift (`IN PROGRESS` in this file vs `QUEUED` in collection entrypoints).
- Make remaining rollout explicitly map to ADR-129 steps.
- Add missing canonical skill and required skill-surface wrappers.
- Add tiered context structure (must-read vs consult-if-relevant) for MCP specialist guidance.
- Replace vague “final sweep” wording with deterministic acceptance checks.
- Record propagation evidence in `documentation-sync-log.md`.

### Should-fix incorporated

- Add explicit routing from `mcp-expert` to narrower existing MCP skills.
- Remove speculative ext-apps branching from this execution pass.
- Update `invoke-code-reviewers.md` to include MCP quick triage + worked example.
- Align roadmap/README phrasing to reduce onboarding ambiguity.

### Low-priority incorporated

- Ensure doctrine text uses canonical MCP spec entrypoint (`modelcontextprotocol.io/specification`).
- Clarify transitional specialist wording in roadmap sections where needed.
- Improve collection handoff wording only if status confusion persists after core propagation updates.

## Scope

### In scope

- Complete ADR-129 triplet for MCP by adding `.agent/skills/mcp-expert/SKILL.md`.
- Keep `mcp-reviewer` and `invoke-mcp-reviewer` aligned with the skill boundary model.
- Add missing skill wrappers and audit existing reviewer/rule wrappers for parity.
- Reconcile discoverability/status across collection indexes and roadmap.
- Add MCP coverage to reviewer invocation quick triage and worked examples.
- Add deterministic validation and specialist-review closure criteria.

### Out of scope

- Creating a new MCP reviewer from scratch.
- Creating a separate ext-apps sub-specialist in this pass.
- Clerk-specific OAuth implementation details.
- Broad security exploitability reviews outside MCP specialist scope.

## Doctrine Hierarchy

1. Current MCP spec and extensions documentation (live fetch first).
2. Official MCP SDK and extension package sources.
3. Repository ADRs and MCP research artefacts.
4. Existing implementation as evidence, not authority.

## Minimal Artefact Inventory

- Existing:
  - `.agent/sub-agents/templates/mcp-reviewer.md`
  - `.agent/rules/invoke-mcp-reviewer.md`
- Missing:
  - `.agent/skills/mcp-expert/SKILL.md`
  - `.cursor/skills/mcp-expert/SKILL.md`
  - `.agents/skills/mcp-expert/SKILL.md`
- Wrapper parity audit set:
  - `.cursor/agents/mcp-reviewer.md`
  - `.claude/agents/mcp-reviewer.md`
  - `.codex/agents/mcp-reviewer.toml`
  - `.cursor/rules/invoke-mcp-reviewer.mdc`
  - `.claude/rules/invoke-mcp-reviewer.md`

## ADR-129 Rollout Mapping

- Step 1 (baseline audit): done in this plan refresh; remaining delta is skill + propagation.
- Step 2 (canonical artefacts): add `mcp-expert` skill.
- Step 3 (coordination updates): align AGENT/invoke guidance and specialist framing.
- Step 4 (platform adapters): add skill wrappers, audit reviewer/rule wrappers.
- Step 5 (discoverability): update README/current/README/roadmap and sync log.
- Step 6 (review and propagation): run specialist closure with explicit evidence.

## Phase Structure

### WS1 — Scope freeze and lane/status reconciliation

- Reconcile lane semantics (`current/` queued source vs `IN PROGRESS` status).
- Ensure collection entrypoints and this file agree on status tokens.
- Remove stale deliverable phrasing that implies incomplete work already marked done.

### WS2 — Skill completion and surface parity

- Create `.agent/skills/mcp-expert/SKILL.md` with:
  - doctrine hierarchy
  - tiered local context
  - capability routing to:
    - `.agent/skills/mcp-migrate-oai/SKILL.md`
    - `.agent/skills/mcp-create-app/SKILL.md`
    - `.agent/skills/mcp-add-ui/SKILL.md`
    - `.agent/skills/mcp-convert-web/SKILL.md`
  - overlap boundaries with `security-reviewer`, `clerk-reviewer`, architecture reviewers.
- Add missing skill wrappers and complete wrapper parity audit.

### WS3 — Discoverability and invocation guidance propagation

- Update:
  - `.agent/plans/agentic-engineering-enhancements/README.md`
  - `.agent/plans/agentic-engineering-enhancements/current/README.md`
  - `.agent/plans/agentic-engineering-enhancements/roadmap.md`
  - `.agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
- Update `.agent/directives/invoke-code-reviewers.md` with:
  - MCP quick-triage question
  - MCP worked example
- Update `.agent/directives/AGENT.md` specialist positioning if required by final specialist shape.

### WS4 — Deterministic validation and review closure

- Run:
  - `pnpm subagents:check`
  - `pnpm portability:check`
  - `pnpm markdownlint:root`
- Run scenario checks:
  - MCP protocol review scenario
  - MCP Apps extension scenario
  - transport/session scenario
- Close all specialist findings (must/should/low) with implemented change or explicit rationale.

## Acceptance Criteria

- Lane/status semantics are consistent across this plan, indexes, and roadmap.
- ADR-129 mapping is explicit and complete for remaining MCP specialist work.
- `.agent/skills/mcp-expert/SKILL.md` exists with tiered context and capability routing.
- Required skill wrappers exist and wrapper parity audit is complete.
- `invoke-code-reviewers.md` includes MCP quick triage and worked example.
- `documentation-sync-log.md` contains MCP specialist propagation entries.
- Deterministic validation checks pass.
- Reviewer findings (including low-priority) are reflected in plan outcomes or rationale notes.

## Risks and Mitigations

- **Status drift recurrence** -> single pass updates across all entrypoints before closeout.
- **Context bloat** -> enforce ADR-129 tiered context in the new skill.
- **Capability overlap** -> hard routing boundaries in `mcp-expert`.
- **Wrapper ambiguity** -> explicit artefact inventory + parity audit checklist.
- **Spec drift** -> live-spec-first doctrine and canonical spec URL usage.
