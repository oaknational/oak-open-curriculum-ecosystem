# AGENT Entrypoint Content Homing Evidence

## 1. Run Context

- Run ID: `run-001`
- Plan:
  `.agent/plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md`
- Phase: Phase 0 source-to-target ledger
- Author: Codex
- Date: 2026-04-24

## 2. Baseline Evidence

- `pnpm practice:fitness:informational` reports
  `.agent/directives/AGENT.md` as hard at 312 / 275 lines.
- The same run reports two follow-on hard files:
  `.agent/directives/principles.md` and
  `.agent/directives/testing-strategy.md`.
- `nl -ba .agent/directives/AGENT.md` provided the source ranges below.

## 3. Source-to-Target Ledger

### L-001: File Role

- Source: `AGENT.md` lines 9-12.
- Concept: AGENT is the operational entrypoint and must be read first.
- Disposition: keep.
- Target: `.agent/directives/AGENT.md`.
- Discovery path: root `AGENTS.md` points to AGENT.

### L-002: Grounding

- Source: `AGENT.md` lines 14-26.
- Concept: British English, task reflection, collaboration, planning
  metacognition.
- Disposition: keep.
- Target: `.agent/directives/AGENT.md`, with detail in
  `.agent/directives/user-collaboration.md` (renamed from
  `collaboration.md` in WS0 of the multi-agent collaboration protocol)
  and `.agent/directives/metacognition.md`.
- Discovery path: AGENT grounding section links both directives.

### L-003: Practice Orientation

- Source: `AGENT.md` lines 28-60.
- Concept: Practice entrypoint, start-right workflows, layering, ADR
  navigation.
- Disposition: keep with compression.
- Target: `.agent/directives/AGENT.md`, `.agent/directives/orientation.md`,
  `.agent/practice-core/index.md`, `.agent/practice-index.md`, and the ADR
  index.
- Discovery path: AGENT keeps the high-level route and links target homes.

### L-004: First Question

- Source: `AGENT.md` lines 62-64.
- Concept: ask whether it could be simpler without compromising quality.
- Disposition: keep.
- Target: `.agent/directives/AGENT.md` and
  `.agent/directives/principles.md`.
- Discovery path: AGENT and principles both name the invariant.

### L-005: Cardinal Schema Rule

- Source: `AGENT.md` lines 66-74.
- Concept: schema-first generated types, validators, and MCP surfaces.
- Disposition: keep.
- Target: `.agent/directives/AGENT.md`,
  `.agent/directives/schema-first-execution.md`, and ADR-029/030/031.
- Discovery path: AGENT links the directive and ADR starter set.

### L-006: Project Context

- Source: `AGENT.md` lines 76-80.
- Concept: repo purpose and pnpm-only posture.
- Disposition: keep with pointer.
- Target: `.agent/directives/AGENT.md` and root `README.md`.
- Discovery path: AGENT names the project shape and links README/build docs.

### L-007: Rules Tier

- Source: `AGENT.md` lines 82-95.
- Concept: principles plus always-applied `.agent/rules/` tier.
- Disposition: keep.
- Target: `.agent/directives/AGENT.md`, `.agent/directives/principles.md`,
  and `.agent/rules/`.
- Discovery path: AGENT requires reading the rules tier on non-loader
  platforms.

### L-008: Reviewer Practice

- Source: `AGENT.md` lines 97-143.
- Concept: critical thinking, intention review, repeated reviewer use, roster,
  and platform invocation notes.
- Disposition: move/merge.
- Target: `.agent/memory/executive/invoke-code-reviewers.md`.
- Discovery path: AGENT links the reviewer catalogue instead of repeating it.

### L-009: Agent Tools

- Source: `AGENT.md` lines 145-158.
- Concept: agent workflow CLIs and canonical commands.
- Disposition: move/merge.
- Target: `agent-tools/README.md`.
- Discovery path: AGENT links the workspace README.

### L-010: Artefact Architecture

- Source: `AGENT.md` lines 160-176.
- Concept: canonical `.agent/` content, platform adapters, entrypoints,
  artefact creation, and Claude settings split.
- Disposition: move/merge.
- Target: `.agent/memory/executive/artefact-inventory.md`,
  `docs/engineering/extending.md`, and ADR-125.
- Discovery path: AGENT links the inventory and extension guide.

### L-011: Memory and Patterns

- Source: `AGENT.md` lines 178-191.
- Concept: distilled memory, napkin, patterns, and thread records.
- Disposition: keep as a compact pointer.
- Target: `.agent/directives/AGENT.md`,
  `.agent/directives/orientation.md`, and memory README files.
- Discovery path: AGENT names active and operational memory targets.

### L-012: Core Practice Links

- Source: `AGENT.md` lines 193-205.
- Concept: development, collaboration, testing, TypeScript, safety.
- Disposition: keep as trigger-based index.
- Target: target documents linked from AGENT.
- Discovery path: AGENT essential links.

### L-013: UI and Design Links

- Source: `AGENT.md` lines 206-213.
- Concept: accessibility, design token, and MCP App styling practices.
- Disposition: keep as trigger-based index.
- Target: `docs/governance/accessibility-practice.md`,
  `docs/governance/design-token-practice.md`, and
  `docs/governance/mcp-app-styling.md`.
- Discovery path: AGENT essential links.

### L-014: Architecture and Schema Links

- Source: `AGENT.md` lines 215-228.
- Concept: architecture overview, ADR index, cardinal ADRs, schema-first
  directive, semantic search architecture.
- Disposition: keep as trigger-based index.
- Target: architecture docs, schema-first directive, and ADRs.
- Discovery path: AGENT essential links.

### L-015: Vision and Domain Links

- Source: `AGENT.md` lines 230-243.
- Concept: project vision, curriculum guidance, and experience recording.
- Disposition: keep as trigger-based index.
- Target: `docs/foundation/VISION.md`,
  `docs/governance/curriculum-tools-guidance-and-playbooks.md`, and
  `.agent/experience/README.md`.
- Discovery path: AGENT essential links.

### L-016: Development Commands

- Source: `AGENT.md` lines 245-279.
- Concept: root commands and quality-gate posture.
- Disposition: move/merge.
- Target: `docs/engineering/build-system.md` and root `package.json`.
- Discovery path: AGENT links build-system and keeps only the most common
  command route.

### L-017: Commit Discipline

- Source: `AGENT.md` lines 281-294.
- Concept: commit skill, commitlint pre-check, and platform adapters.
- Disposition: move/merge.
- Target: `.agent/skills/commit/SKILL.md`.
- Discovery path: AGENT links the commit skill.

### L-018: Architectural Understanding

- Source: `AGENT.md` lines 296-310.
- Concept: monorepo package topology.
- Disposition: retire duplicate with link.
- Target: root `README.md` and `docs/architecture/README.md`.
- Discovery path: AGENT links architecture and README instead of listing
  topology.

### L-019: Remember

- Source: `AGENT.md` lines 312-318.
- Concept: periodic GO re-grounding and simplification reminder.
- Disposition: keep.
- Target: `.agent/directives/AGENT.md` and `.agent/skills/go/shared/go.md`.
- Discovery path: AGENT final reminder links GO.

## 4. Closure Checks For This Ledger

- Every AGENT heading has a ledger row.
- Every non-heading paragraph cluster is covered by a source range.
- No unique content is deleted; rows use keep, move/merge, or retire duplicate
  with a durable target.
- The ledger is stored under the plan evidence directory for review.
