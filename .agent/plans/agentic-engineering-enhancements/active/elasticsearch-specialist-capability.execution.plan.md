---
name: "Elasticsearch Specialist Capability Execution"
overview: >
  Create the canonical Elasticsearch reviewer, skill, and situational rule,
  grounded in current official Elastic documentation and Elastic Serverless as
  the default deployment context, then wire them into the repo's agent
  artefact ecosystem and discoverability surfaces.
todos:
  - id: es-phase-0-baseline
    content: "Phase 0: Baseline inventory, authority stack, and Serverless constraints validation."
    status: done
  - id: es-phase-1-canonical-artefacts
    content: "Phase 1: Create canonical reviewer template, skill, and situational rule."
    status: done
  - id: es-phase-2-adapters-integration
    content: "Phase 2: Add thin platform adapters and integrate roster/invocation guidance."
    status: done
  - id: es-phase-3-discoverability-validation
    content: "Phase 3: Update collection indexes/session-entry discoverability and run validation."
    status: done
  - id: es-phase-4-review-doc-sync
    content: "Phase 4: Specialist review pass and documentation propagation."
    status: done
isProject: false
---

# Elasticsearch Specialist Capability Execution

**Last Updated**: 2026-03-07
**Status**: ✅ COMPLETE
**Scope**: Canonical agent capability rollout for Elasticsearch review and guidance.

## Source Strategy

- [../elasticsearch-specialist-capability.plan.md](../elasticsearch-specialist-capability.plan.md)

> **Note**: This plan was promoted from `current/` to `active/` on 2026-03-07.

## Preflight

Before any non-planning edits:

1. Re-read:
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
   - `.agent/directives/AGENT.md`
   - `.agent/sub-agents/README.md`
2. Re-ask:
   - Could this be simpler without compromising quality?
   - Are official Elastic docs still the primary authority in the planned wording?
   - Is Elastic Serverless handled explicitly, not implicitly?

## Design Constraints

This capability follows the domain specialist triplet pattern defined in
[ADR-129](../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).

1. **Official docs first** — the reviewer and skill must require live
   consultation of official Elastic docs before local analysis.
2. **Serverless first** — Elastic Serverless is the default deployment context.
3. **Thin wrappers only** — canonical logic stays in `.agent/`; platform files
   are adapters.
4. **No scope creep** — this is not a generic search reviewer.
5. **Tiered local context** — must-read vs. consult-if-relevant per ADR-129 and
   the source strategy plan.

**Capability split**:

- `elasticsearch-reviewer` is the read-only specialist reviewer.
- `elasticsearch-expert` is the active workflow skill for planning, research,
  and implementation work by the primary agent.

**Non-Goals**:

- Do not redesign the semantic-search product architecture in this plan.
- Do not replace existing specialist reviewers.
- Do not promote speculative Elastic opportunities into product commitments.

## Phase 0 — Baseline Audit

### Task 0.1: Inventory current capability absence/presence

**Target checks**:

- no canonical Elasticsearch reviewer template yet
- no canonical Elasticsearch expert skill yet
- no situational Elasticsearch reviewer rule yet

**Deterministic validation**:

```bash
rg -n "elasticsearch-reviewer|elasticsearch-expert|invoke-elasticsearch-reviewer" \
  .agent .cursor .claude .agents
```

**Acceptance Criteria**:

1. Baseline inventory is captured before any artefact creation.
2. Any pre-existing related artefacts are identified and reconciled.
3. The execution plan keeps Elasticsearch-only scope explicit.

### Task 0.2: Freeze the authority stack and confirm ADR-129

**Action**: Confirm (not create) that the source strategy plan's authority stack
and tiered context lists are still accurate. The lists already exist in the
strategy plan — this task validates them before encoding into artefacts.

**Outputs**:

- confirmation that the primary-source list for official web authorities is
  current (check the URLs still resolve and are not deprecated)
- confirmation that the tiered local-context lists (must-read and
  consult-if-relevant) in the strategy plan are still accurate
- confirmation that Serverless-first wording is explicit in both plans
- confirmation that ADR-129 (domain specialist capability pattern) exists and
  this plan conforms to it

**Deterministic validation**:

```bash
rg -n "Elastic Documentation|elastic/elasticsearch-js|@elastic/elasticsearch|Serverless" \
  .agent/plans/agentic-engineering-enhancements/elasticsearch-specialist-capability.plan.md \
  .agent/plans/agentic-engineering-enhancements/active/elasticsearch-specialist-capability.execution.plan.md
test -f docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md
```

**Acceptance Criteria**:

1. The capability doctrine is stable enough to encode into artefacts.
2. Official web docs are unambiguously primary.
3. Elastic Serverless is explicitly called out as default deployment context.
4. ADR-129 exists and the strategy plan references it.

## Phase 1 — Canonical Artefacts

### Task 1.1: Create reviewer template

**Structural exemplar**: Read `.agent/sub-agents/templates/mcp-reviewer.md` first
— it follows the same external-authority-first doctrine and is the closest
existing analogue. Also read `.agent/sub-agents/README.md` for the component
and template dependency rules.

**Target file**:

- `.agent/sub-agents/templates/elasticsearch-reviewer.md`

**Required content**:

- delegation triggers
- explicit web-source-first doctrine
- primary authorities table
- tiered local context tables (must-read and consult-if-relevant, per ADR-129
  and the source strategy plan's split lists)
- Serverless-first guidance
- workflow for live-doc consultation before repo comparison
- checklist for correctness, best practice, and opportunity review
- output format with severity-ordered findings and source citations
- delegation table to other specialists

**Deterministic validation**:

```bash
test -f .agent/sub-agents/templates/elasticsearch-reviewer.md
rg -n "WebFetch|WebSearch|Serverless|Elastic Documentation|elasticsearch-js" \
  .agent/sub-agents/templates/elasticsearch-reviewer.md
```

### Task 1.2: Create canonical active-workflow skill

**Structural exemplar**: Read `.agent/skills/ground-truth-design/SKILL.md` for
passive skill structure, and `.agent/skills/start-right-quick/SKILL.md` for
active skill structure with `classification` frontmatter.

**Target file**:

- `.agent/skills/elasticsearch-expert/SKILL.md`

**Required content**:

- when to use the skill
- explicit distinction from the reviewer
- required external and local reading
- Serverless-first interpretation guidance
- workflow for planning/research/implementation support
- guardrails against cargo-culting repo implementation

**Deterministic validation**:

```bash
test -f .agent/skills/elasticsearch-expert/SKILL.md
rg -n "^name:|^classification:|Elastic Documentation|Serverless|official|secondary context|reviewer" \
  .agent/skills/elasticsearch-expert/SKILL.md
```

### Task 1.3: Create situational rule

**Structural exemplar**: Read `.agent/rules/invoke-code-reviewers.md` for the
canonical invocation rule pattern. The ES rule is narrower in scope (single
specialist, not the full roster) but should follow the same posture: trigger
conditions, non-goals, and a pointer to the canonical reviewer.

**Target file**:

- `.agent/rules/invoke-elasticsearch-reviewer.md`

**Required content**:

- trigger conditions for mappings, analyzers, synonyms, query DSL, retrievers,
  ELSER, RRF, reranking, ingest, observability, evaluation, and Elastic
  capability questions
- clear non-goals and overlap boundaries
- invocation posture aligned with the existing reviewer model

**Deterministic validation**:

```bash
test -f .agent/rules/invoke-elasticsearch-reviewer.md
rg -n "mappings|synonyms|ELSER|RRF|Serverless|capability" \
  .agent/rules/invoke-elasticsearch-reviewer.md
```

### Task 1.4: Update canonical coordination docs

**Target files**:

- `.agent/directives/AGENT.md`
- `.agent/directives/invoke-code-reviewers.md`

**Required updates**:

1. **AGENT.md**: Add `elasticsearch-reviewer` to the "Specialist On-Demand"
   roster alongside `mcp-reviewer`, `ground-truth-designer`, etc.
2. **invoke-code-reviewers.md — Quick Triage**: Add a new triage question:
   "Does this touch Elasticsearch mappings, queries, analyzers, synonyms,
   ELSER, RRF, reranking, ingest, or Elastic Serverless capabilities?
   -> `elasticsearch-reviewer`"
3. **invoke-code-reviewers.md — Specialist on-demand**: Add
   `elasticsearch-reviewer` entry with trigger description.
4. **invoke-code-reviewers.md — Worked Examples**: Add a worked example:
   "Elasticsearch/search change: Invoke `code-reviewer` +
   `elasticsearch-reviewer` immediately. Add `type-reviewer` if schema or
   mapping types are affected."

**Deterministic validation**:

```bash
rg -n "elasticsearch-reviewer" .agent/directives/AGENT.md .agent/directives/invoke-code-reviewers.md
rg -n "Elasticsearch" .agent/directives/invoke-code-reviewers.md
```

### Phase 1 quality gate

Run after all Phase 1 tasks before proceeding to Phase 2:

```bash
pnpm markdownlint:root
pnpm subagents:check
```

**Acceptance Criteria for Phase 1**:

1. Canonical reviewer, skill, and rule exist in `.agent/`.
2. AGENT roster and invocation guidance know about the specialist.
3. Wording consistently treats live official docs as primary authority.
4. Wording consistently treats Elastic Serverless as default deployment context.
5. Intermediate quality gates pass.

## Phase 2 — Platform Adapters and Integration

### Task 2.1: Add reviewer adapters

**Structural exemplars**: Read the MCP reviewer's adapters as the closest
analogue:

- `.cursor/agents/mcp-reviewer.md` (Cursor wrapper format)
- `.claude/agents/mcp-reviewer.md` (Claude wrapper format with YAML frontmatter)
- `.gemini/commands/review-mcp.toml` (Gemini TOML format)
- `.agents/skills/mcp-reviewer/SKILL.md` (Codex skill wrapper)

**Target files**:

- `.cursor/agents/elasticsearch-reviewer.md`
- `.claude/agents/elasticsearch-reviewer.md`
- `.gemini/commands/review-elasticsearch.toml`
- `.agents/skills/elasticsearch-reviewer/SKILL.md`

**Deterministic validation**:

```bash
test -f .cursor/agents/elasticsearch-reviewer.md
test -f .claude/agents/elasticsearch-reviewer.md
test -f .gemini/commands/review-elasticsearch.toml
test -f .agents/skills/elasticsearch-reviewer/SKILL.md
rg -n "read and internalise `.agent/sub-agents/templates/elasticsearch-reviewer.md`|read and internalise \\.agent/sub-agents/templates/elasticsearch-reviewer\\.md" \
  .cursor/agents/elasticsearch-reviewer.md .claude/agents/elasticsearch-reviewer.md
rg -n "^name:|^model:|^description:|^readonly:" .cursor/agents/elasticsearch-reviewer.md
rg -n "^name:|^description:|^tools:|^disallowedTools:|^model:|^permissionMode:|^color:" .claude/agents/elasticsearch-reviewer.md
rg -n "^description =|^prompt =" .gemini/commands/review-elasticsearch.toml
rg -n "^name:|^description:" .agents/skills/elasticsearch-reviewer/SKILL.md
```

### Task 2.2: Add skill adapters

**Target files**:

- `.cursor/skills/elasticsearch-expert/SKILL.md`
- `.agents/skills/elasticsearch-expert/SKILL.md`

**Deterministic validation**:

```bash
test -f .cursor/skills/elasticsearch-expert/SKILL.md
test -f .agents/skills/elasticsearch-expert/SKILL.md
rg -n "^name:|^description:" .cursor/skills/elasticsearch-expert/SKILL.md .agents/skills/elasticsearch-expert/SKILL.md
```

### Task 2.3: Add rule adapters

**Structural exemplars**: Read the existing invocation rule adapters:

- `.cursor/rules/invoke-code-reviewers.mdc` (Cursor `.mdc` with frontmatter)
- `.claude/rules/invoke-code-reviewers.md` (Claude rule with `paths` frontmatter)

**Target files**:

- `.cursor/rules/invoke-elasticsearch-reviewer.mdc`
- `.claude/rules/invoke-elasticsearch-reviewer.md`

**Deterministic validation**:

```bash
test -f .cursor/rules/invoke-elasticsearch-reviewer.mdc
test -f .claude/rules/invoke-elasticsearch-reviewer.md
rg -n "invoke-elasticsearch-reviewer" .cursor/rules/invoke-elasticsearch-reviewer.mdc .claude/rules/invoke-elasticsearch-reviewer.md
```

### Phase 2 quality gate

Run after all Phase 2 tasks before proceeding to Phase 3:

```bash
pnpm markdownlint:root
pnpm subagents:check
pnpm portability:check
```

**Acceptance Criteria for Phase 2**:

1. Reviewer coverage exists across supported platform mechanisms.
2. Platform wrappers are thin and canonical-first.
3. The reviewer and the active-workflow skill have distinct responsibilities.
4. Rule/skill adapters resolve to the canonical `.agent/` artefacts.
5. Wrapper validation checks the expected platform metadata contract, not just file presence.
6. Intermediate quality gates pass (including portability check for adapter coverage).

## Phase 3 — Discoverability and Validation

### Task 3.1: Update collection indexes and roadmap surfaces

Read each target file first. Add the Elasticsearch specialist capability to each
file's existing structure:

**Target files and expected additions**:

- `.agent/plans/agentic-engineering-enhancements/README.md` — add a row to the
  plans table linking to the strategy plan and execution plan, with scope summary
  ("Elasticsearch reviewer + skill + rule triplet following ADR-129").
- `.agent/plans/agentic-engineering-enhancements/roadmap.md` — add an entry in
  the appropriate milestone/phase, noting this plan is in `current/` (queued).
- `.agent/plans/agentic-engineering-enhancements/current/README.md` — add a row
  to the current plans table with plan name, link, status, and scope.

**Deterministic validation**:

```bash
rg -n "elasticsearch-specialist-capability" \
  .agent/plans/agentic-engineering-enhancements/README.md \
  .agent/plans/agentic-engineering-enhancements/roadmap.md \
  .agent/plans/agentic-engineering-enhancements/current/README.md
```

### Task 3.2: Update session-entry discoverability

**Target file**:

- `.agent/prompts/GO.md`

**Goal**:

Read `GO.md` first. Ensure collection plans remain discoverable from the
session-entry prompt. If `GO.md` does not already direct agents to collection
README/roadmap navigation, add guidance that tells agents to:

- read the collection `README.md` and `roadmap.md` for strategic context
- read `current/README.md` when selecting queued work
- read `active/README.md` when executing in-progress work

This is a general discoverability improvement, not Elasticsearch-specific. If
this guidance already exists, no change is needed — just verify it.

**Deterministic validation**:

```bash
rg -n "current/README.md|active/README.md|roadmap" .agent/prompts/GO.md
```

### Task 3.3: Run structural validation

**Deterministic validation**:

```bash
pnpm subagents:check
pnpm markdownlint:root
```

### Task 3.4: Smoke test the reviewer

Invoke `elasticsearch-reviewer` against a known Elasticsearch-related file in
the repo (e.g., a mapping definition or query builder in `apps/oak-search-cli/`)
and verify that:

1. The reviewer fetches official Elastic documentation before analysing repo code.
2. Findings cite official sources, not just local patterns.
3. Serverless applicability is explicitly checked.
4. The tiered context model is respected (must-read docs loaded, consult-if-relevant
   docs loaded only when the review area demands them).

This is a manual verification step, not an automated gate.

**Acceptance Criteria for Phase 3**:

1. The capability is discoverable from collection navigation surfaces.
2. Session-entry guidance does not leave the plan orphaned.
3. Structural validation passes.
4. Smoke test confirms the reviewer follows the doctrine hierarchy in practice.

## Phase 4 — Review and Documentation Propagation

### Task 4.1: Specialist review pass

**Required reviewers**:

- `code-reviewer`
- `docs-adr-reviewer`
- `subagent-architect`

**Situational reviewers**:

- `onboarding-reviewer` if prompt/entry discoverability changes materially

### Task 4.2: Documentation propagation

Update or explicitly record no-change rationale for:

- `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
- `.agent/practice-core/practice.md`
- any additionally impacted docs/READMEs
- `.agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`

Apply:

- `.cursor/commands/jc-consolidate-docs.md`

**Deterministic validation**:

```bash
rg -n "Elasticsearch specialist|elasticsearch-reviewer|elasticsearch-expert|no-change rationale" \
  .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md \
  docs/architecture/architectural-decisions/119-agentic-engineering-practice.md \
  .agent/practice-core/practice.md
```

## Risks

| Risk | Mitigation |
|------|------------|
| Scope expands into generic search governance | Keep Elasticsearch-only boundaries in canonical artefacts and invocation guidance |
| Serverless applicability is missed | Encode Serverless-first wording in reviewer, skill, and rule |
| Discoverability drift leaves the plan orphaned | Update collection README, roadmap, current index, and session-entry guidance together |
| Wrapper drift duplicates canonical logic | Keep wrappers thin and validate with `pnpm subagents:check` |

## Done When

1. Canonical `.agent/` artefacts exist for reviewer, skill, and rule.
2. Platform adapters exist and remain thin.
3. AGENT roster and invocation guidance mention the specialist appropriately.
4. Collection indexes and session-entry guidance make the work discoverable.
5. Structural validation passes.
6. Reviewer findings are addressed.
7. Documentation propagation is complete or explicitly marked no-change.
