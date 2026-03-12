# Agent Classification Taxonomy — Strategic Plan

**Status**: NOT STARTED
**ADR**: [ADR-135](../../../../docs/architecture/architectural-decisions/135-agent-classification-taxonomy.md)
**Domain**: Agentic Engineering Enhancements
**Branch**: Feature branch (to be created)

## Problem and Intent

The agent roster lacks classification metadata, uses `-reviewer` naming that constrains agents to a single operational mode, and has no support for specialists (fast, narrow, agent-to-agent tasks) or process executors (workflow-driving agents). ADR-135 defines the taxonomy; this plan executes it.

## Domain Boundaries

### In scope

1. Add `classification` frontmatter to all agent templates and platform wrappers
2. Full rename of all agents (drop `-reviewer` suffix, align with classification model)
3. Create mode components (`explore.md`, `advise.md`, `review.md`)
4. Create specialist input contract component
5. Create the Practice domain trio (`practice`, `practice-core`, `practice-applied`)
6. Update validation script (`subagents:check`) for new fields and naming
7. Update all documentation references (ADRs, directives, rules, README files, invoke guidance)
8. Platform adapter updates across all four platforms (Cursor, Claude Code, Gemini CLI, Codex)
9. Update portability check for new naming

### Non-goals

- Creating specialist agents (the contract is defined; actual specialists are future work)
- Creating additional process executor agents beyond `subagent-architect` reclassification
- Implementing agent-to-agent invocation mechanisms (the contract is defined; runtime orchestration is future work)
- Changing template content beyond what is needed for classification and rename alignment

## Workstreams

### WS1: Foundation — Components and Contracts

Create the new artefacts that the classification model requires.

- [ ] Create `.agent/sub-agents/components/modes/explore.md`
- [ ] Create `.agent/sub-agents/components/modes/advise.md`
- [ ] Create `.agent/sub-agents/components/modes/review.md`
- [ ] Create `.agent/sub-agents/components/contracts/specialist-input.md`
- [ ] Update `.agent/sub-agents/README.md` to document modes and contracts

### WS2: Classification and Rename — Canonical Layer

Add classification metadata and rename all canonical templates.

- [ ] Add `classification` field to all 13 existing templates in `.agent/sub-agents/templates/`
- [ ] Rename template files (e.g. `code-reviewer.md` → `code-quality.md`, `architecture-reviewer.md` → `architecture.md`)
- [ ] Update template cross-references (delegation triggers, boundary sections, "when to recommend other reviews" tables)
- [ ] Update persona components to reference new template names
- [ ] Create `practice.md` template (broad, gateway)
- [ ] Create `practice-core.md` template (deep, Practice Core lifecycle)
- [ ] Create `practice-applied.md` template (deep, this repo's operationalisation)

### WS3: Platform Adapters — All Four Platforms

Rename and reclassify wrappers across Cursor, Claude Code, Gemini CLI, and Codex.

- [ ] Cursor: rename `.cursor/agents/*.md` wrappers, add `classification` to frontmatter
- [ ] Claude Code: rename `.claude/agents/*.md` wrappers, add `classification` to frontmatter, update `model` per policy
- [ ] Gemini CLI: rename `.gemini/commands/review-*.toml` wrappers
- [ ] Codex: rename `.agents/skills/*/SKILL.md` wrappers
- [ ] Create platform adapters for three new Practice agents on all platforms
- [ ] Design platform-specific mode invocation patterns per adapter layer

### WS4: Validation and Quality Gates

Update automated checks to enforce the new model.

- [ ] Update `scripts/validate-subagents.mjs` to require `classification` field
- [ ] Add validation: specialist agents must reference specialist input contract
- [ ] Add validation: no `-reviewer` suffix in agent names
- [ ] Update `scripts/validate-portability.mjs` for new names
- [ ] Run `pnpm subagents:check` and `pnpm portability:check` — all green

### WS5: Documentation Propagation

Update all references to old agent names across the entire repo.

- [ ] Update `.agent/directives/AGENT.md` — agent roster, sub-agent section
- [ ] Update `.agent/directives/invoke-code-reviewers.md` — rename to `invoke-agents.md` or equivalent, update all agent references
- [ ] Update all `.agent/rules/*.md` that reference agent names (e.g. `invoke-code-reviewers.md`, `invoke-elasticsearch-reviewer.md`)
- [ ] Update all `.claude/rules/*.md` and `.cursor/rules/*.mdc` that reference agent names
- [ ] Update ADRs that reference agent names by old names (ADR-114, ADR-119, ADR-125, ADR-129, ADR-131)
- [ ] Update `.agent/sub-agents/components/architecture/reviewer-team.md`
- [ ] Update `.agent/practice-core/` files if they reference agent names
- [ ] Update `docs/governance/development-practice.md` if it references agent names
- [ ] Update any plan files that reference agent names
- [ ] Grep for all remaining `-reviewer` references and update

## Dependencies and Sequencing

- WS1 (components) must complete before WS2 (templates reference new components)
- WS2 (canonical) must complete before WS3 (adapters reference canonical templates)
- WS4 (validation) can run in parallel with WS3 but must validate after WS3 completes
- WS5 (documentation) runs last — it sweeps all remaining references

## Success Signals

1. `pnpm subagents:check` passes with classification validation enabled
2. `pnpm portability:check` passes with new names
3. Zero grep hits for `-reviewer` in agent-related files (templates, wrappers, components, rules, directives)
4. All four platform adapter directories have complete coverage for all agents including the three new Practice agents
5. All documentation references use new names — no stale references to old names anywhere in the repo
6. ADR-135 is referenced from the ADR index

## Risks and Unknowns

| Risk | Mitigation |
|---|---|
| Large coordinated rename may introduce broken references | WS5 includes systematic grep sweep; validation scripts catch structural issues |
| Mode components are new and untested | Start minimal (output expectations only), iterate based on real usage |
| Practice trio agents need substantial template content | Design templates during promotion to `current/`; use existing practice-core files as must-read tier |
| Platform-specific mode invocation may vary significantly | Design patterns per platform during WS3; accept platform-specific differences per ADR-125 |
| Rename may conflict with in-progress work on other branches | Execute on a dedicated feature branch; coordinate merge timing |

## Promotion Trigger

This plan promotes to `current/` when:

1. ADR-135 is accepted (done)
2. No conflicting work is in progress on the agent artefact layer
3. The feature branch for the current work (`feat/es_index_update`) is merged or the work can be coordinated
