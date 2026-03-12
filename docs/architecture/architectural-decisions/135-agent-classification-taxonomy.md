# ADR-135: Agent Classification Taxonomy

**Status**: Accepted
**Date**: 2026-03-12
**Related**: [ADR-114 (Layered Sub-agent Prompt Composition)](114-layered-sub-agent-prompt-composition-architecture.md), [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md), [ADR-125 (Agent Artefact Portability)](125-agent-artefact-portability.md), [ADR-129 (Domain Specialist Capability Pattern)](129-domain-specialist-capability-pattern.md), [ADR-131 (Self-Reinforcing Improvement Loop)](131-self-reinforcing-improvement-loop.md)

## Context

The repository has 17 sub-agents across 4 platforms. All are named with a `-reviewer` suffix or as a `-designer`/`-architect`, implying that review is their primary — or only — function. In practice, agents are already used for exploration, advisory work, and active process execution alongside review. The naming conflates _what the agent knows_ with _one thing the agent does_.

Three concrete problems:

1. **Review is treated as an identity, not a mode.** `architecture-reviewer-fred` _is_ a reviewer by name, but AGENT.md already says "Reviewers can review intentions, not just code" — acknowledging that these agents explore and advise as well as review. The naming prevents this from being a first-class capability.

2. **No classification metadata.** Skills have `classification: active | passive` in frontmatter. Sub-agents have no equivalent. This means there is no machine-readable way to determine an agent's purpose, model policy, or invocation pattern. Every agent is treated identically in validation, documentation, and invocation guidance.

3. **Missing capability categories.** The roster has no agents for Practice expertise (broad or deep), no explicit process executors (agents that drive workflows), and no concept of narrow specialists (fast, fixed-format, agent-to-agent tasks). These roles exist informally but are not named, structured, or supported by the artefact architecture.

4. **Model selection is ad hoc.** Some agents use `model: opus`, others `model: sonnet`, with no systematic rationale. The choice is made per-agent rather than flowing from a policy about what the agent does.

## Decision

### Four Agent Classifications

Introduce a `classification` field in sub-agent frontmatter (both canonical templates and platform wrappers) with four values:

| Classification     | Knowledge Shape                | Model Policy                                          | Primary Invoker                       | Frequency |
| ------------------ | ------------------------------ | ----------------------------------------------------- | ------------------------------------- | --------- |
| `domain_expert`    | Broad or deep domain knowledge | Powerful models recommended                           | Humans or agents                      | Moderate  |
| `process_executor` | Workflow and process knowledge | Powerful models recommended (infrequent, high-impact) | Practice expert or humans             | Low       |
| `specialist`       | Narrow, well-defined task      | Fast models recommended                               | Agents only (agent-to-agent contract) | High      |

#### domain_expert

Domain experts hold knowledge about a specific area and can operate in any mode (explore, advise, review). They are the primary interface for both humans and other agents seeking domain guidance.

Domain experts exist at two depths:

- **Broad**: wide coverage of a domain, acts as gateway to deeper experts and to specialists. Examples: `practice`, `code-quality`, `architecture-{barney,fred,betty,wilma}`.
- **Deep**: concentrated expertise in a subdomain. Examples: `practice-core`, `practice-applied`, `elasticsearch`, `security`, `mcp`.

The distinction between broad and deep is captured in the agent's description and must-read tier, not as a separate classification value. Both are `domain_expert`.

#### process_executor

Process executors drive workflows that produce or maintain Practice artefacts. They know _how to do_ something, not just _how to assess_ it. They run infrequently but have outsized impact on future outcomes.

Examples: `subagent-architect` (scaffolds new agent triplets), a learning-loop executor (drives napkin → distilled → permanent graduation), an agent scaffolder (creates new capability following ADR-129).

#### specialist

Specialists execute narrow, well-defined tasks with explicit input contracts. They receive structured instructions from other agents and return structured results. They do not need deep domain understanding — they need to execute a specific task correctly and quickly.

Specialists are fundamentally **agent-to-agent interfaces**. The input format is a contract between the calling agent and the specialist. If a human can describe the task clearly enough for a specialist, they could likely make the change themselves.

### Three Operational Modes

Orthogonal to classification, domain experts and process executors support three operational modes:

| Mode      | Stance                     | When to Use                                          | Output Shape                                     |
| --------- | -------------------------- | ---------------------------------------------------- | ------------------------------------------------ |
| `explore` | Investigate, map, discover | Understanding a problem space, surveying options     | Open-ended findings, maps, questions             |
| `advise`  | Recommend before action    | Deciding between approaches, planning implementation | Options with trade-offs, recommendations         |
| `review`  | Assess completed work      | Evaluating a diff, a plan, or a decision             | Structured verdict with severity-graded findings |

Mode is **explicit** (preferred) or **inferred from context** (fallback for domain experts and process executors). Specialists do not use modes — they have fixed input/output contracts that supersede the mode concept.

Mode-specific scaffolding lives in `.agent/sub-agents/components/modes/`:

- `explore.md` — output expectations, depth guidance, when to stop
- `advise.md` — options format, trade-off structure, recommendation framing
- `review.md` — verdict format, severity levels, finding structure

Any template can compose with any mode component.

### Specialist Input Contract

Specialists receive instructions in a fixed format:

```text
Task: [one sentence — what to do]
Input: [specific files, diff, or data to operate on]
Acceptance criteria: [numbered list — what "done" looks like]
Exit criteria: [when to stop — max scope, stop conditions]
Report format: [exact output structure expected]
```

This format serves as both the invocation interface and a **decomposition discipline**: if the calling agent cannot fill in these five fields clearly, the task is not specialist-shaped and should be handled by a domain expert or process executor.

The specialist input contract is defined in `.agent/sub-agents/components/contracts/specialist-input.md` and referenced by every specialist-classified template.

### Gateway as a Role Attribute

Gateway is not a classification — it is a **role attribute** that any domain expert can hold. A gateway agent knows what other agents in its area offer and routes requests appropriately.

| Gateway Agent  | Routes To                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------- |
| `code-quality` | Standard quality roster: `test`, `type`, `config`, `security`, `docs-adr`                 |
| `practice`     | Process executors, and the two deep practice agents (`practice-core`, `practice-applied`) |

Gateway responsibility is declared in the agent's template, not in a separate artefact.

### Practice Domain: Three Agents

The Practice domain splits into three agents matching the existing conceptual boundary between Practice Core (portable blueprint) and Practice (applied operationalisation):

| Agent              | Domain                         | Depth           | Must-Read Tier                                                                        |
| ------------------ | ------------------------------ | --------------- | ------------------------------------------------------------------------------------- |
| `practice`         | The whole practice             | Broad (gateway) | `index.md`, `AGENT.md`, artefact inventory overview                                   |
| `practice-core`    | Practice Core lifecycle        | Deep            | The 6 practice-core files, ADR-124, ADR-131                                           |
| `practice-applied` | This repo's operationalisation | Deep            | ADR index, `invoke-code-reviewers.md`, artefact inventory, quality gate configuration |

- `practice` is the entry point for practice-related questions and the gateway for process executors.
- `practice-core` handles propagation, hydration, consolidation, fitness functions, and the learning loop mechanism.
- `practice-applied` handles ADR compliance, agent roster, quality gates, and artefact structure for this specific repo.

### Full Rename

All agents are renamed to remove the `-reviewer` suffix and align with the classification model. This is executed on a feature branch with complete documentation updates across all four platforms as a success criterion.

#### Proposed Naming

| Current Name                   | New Name              | Classification                   |
| ------------------------------ | --------------------- | -------------------------------- |
| `code-reviewer`                | `code-quality`        | `domain_expert` (broad, gateway) |
| `architecture-reviewer-barney` | `architecture-barney` | `domain_expert` (deep)           |
| `architecture-reviewer-fred`   | `architecture-fred`   | `domain_expert` (deep)           |
| `architecture-reviewer-betty`  | `architecture-betty`  | `domain_expert` (deep)           |
| `architecture-reviewer-wilma`  | `architecture-wilma`  | `domain_expert` (deep)           |
| `test-reviewer`                | `test`                | `domain_expert` (deep)           |
| `type-reviewer`                | `type`                | `domain_expert` (deep)           |
| `config-reviewer`              | `config`              | `domain_expert` (deep)           |
| `security-reviewer`            | `security`            | `domain_expert` (deep)           |
| `docs-adr-reviewer`            | `docs-adr`            | `domain_expert` (deep)           |
| `onboarding-reviewer`          | `onboarding`          | `domain_expert` (deep)           |
| `elasticsearch-reviewer`       | `elasticsearch`       | `domain_expert` (deep)           |
| `mcp-reviewer`                 | `mcp`                 | `domain_expert` (deep)           |
| `ground-truth-designer`        | `ground-truth`        | `domain_expert` (deep)           |
| `release-readiness-reviewer`   | `release-readiness`   | `domain_expert` (deep)           |
| `subagent-architect`           | `subagent-architect`  | `process_executor`               |
| — (new)                        | `practice`            | `domain_expert` (broad, gateway) |
| — (new)                        | `practice-core`       | `domain_expert` (deep)           |
| — (new)                        | `practice-applied`    | `domain_expert` (deep)           |

Architecture personas remain separate agents to preserve model diversity across providers.

### Model Selection Policy

Model selection is a **recommendation per classification**, not an enforced constraint. Platform adapters may override when practical (e.g. Cursor's `Auto` for specialists).

| Classification     | Recommended Model                 | Rationale                       |
| ------------------ | --------------------------------- | ------------------------------- |
| `domain_expert`    | Powerful (e.g. `opus`, `Premium`) | Depth and judgement required    |
| `process_executor` | Powerful (e.g. `opus`, `Premium`) | Infrequent but high-impact      |
| `specialist`       | Fast (e.g. `sonnet`, `Auto`)      | Frequent, narrow, speed matters |

Within a domain, **model diversity is valued** — different providers bring different reasoning processes. Architecture personas should deliberately use different models where the platform supports it. This is an epistemological decision, not just a cost decision.

### Platform Adapter Considerations

Each platform has different mechanisms for communicating mode and classification:

| Platform    | Mode Communication                            | Classification Use                          |
| ----------- | --------------------------------------------- | ------------------------------------------- |
| Cursor      | `@` file injection loads mode component       | Agent selection via `description` matching  |
| Claude Code | `$ARGUMENTS` in commands, agent `description` | `model` and `permissionMode` in frontmatter |
| Gemini CLI  | `{{args}}` in TOML commands                   | `description` in TOML                       |
| Codex       | Skill mention syntax                          | `description` in `SKILL.md` frontmatter     |

Platform-specific mode invocation patterns are designed as part of the adapter layer work, following ADR-125's thin wrapper contract.

### Validation Updates

`pnpm subagents:check` (`scripts/validate-subagents.mjs`) is extended to:

1. Verify every agent has a `classification` field in frontmatter with a valid value (`domain_expert`, `process_executor`, `specialist`).
2. Verify specialist-classified agents reference the specialist input contract component.
3. Verify the `name` field matches the new naming convention (no `-reviewer` suffix).

## Rationale

### Why four classifications, not more

Three would conflate domain expertise with process execution. Five or more would create classification debates for every new agent. Four captures the actual operating modes observed in practice: knowing a domain, driving a process, and executing a narrow task — with domain expertise split by depth as a descriptive attribute rather than a separate classification.

### Why modes are orthogonal to classification

Modes describe _how_ an agent is invoked on a given occasion. Classification describes _what_ the agent is. An architecture expert reviewing a diff and the same expert exploring a design space are the same agent in different modes. Conflating mode with identity (as the current `-reviewer` naming does) artificially constrains what agents can do.

### Why full rename rather than metadata only

Metadata-only classification creates naming dissonance: `code-reviewer` with `classification: domain_expert` is confusing. A clean rename aligns names with the conceptual model. The cost is a coordinated change across 4 platforms; the benefit is permanent conceptual clarity for humans and agents.

### Why specialists are agent-to-agent only

A task narrow enough for a specialist is narrow enough for a human to do directly. The value of specialists is in **scaling**: a domain expert can decompose a complex review into 5 specialist checks and synthesise the results. This division of cognitive labour keeps judgement with the expert and moves mechanical work to fast, cheap specialists.

### Why Practice splits into three

The Practice Core (portable blueprint) and the applied Practice (this repo's operationalisation) are already distinct conceptual entities with distinct artefacts. A broad gateway expert provides the entry point and routing. This mirrors how other domains work: `code-quality` is broad, `test` and `type` are deep.

## Consequences

### Positive

- Every agent has a machine-readable classification that informs model selection, invocation guidance, and validation.
- The `-reviewer` naming constraint is removed, enabling agents to explore and advise as first-class capabilities.
- Specialists become a first-class category with an explicit input contract, enabling agent-to-agent task decomposition.
- Process executors are named and structured, enabling the Practice's self-reinforcing loop to be driven by agents.
- Practice expertise is available as a domain, enabling agents and humans to get structured guidance on applying the Practice.
- Model diversity is an explicit architectural value, not an accident of ad hoc choices.

### Trade-offs

- The full rename is a substantial coordinated change across 4 platforms, 17+ agents, validation scripts, all documentation references, and the invoke-code-reviewers directive.
- Three new agents (practice trio) add to the roster size and platform adapter file count.
- The specialist input contract is new and will need iteration as real specialist agents are built.
- Mode components add a new axis of composition to the template layer, increasing the number of components.

### Neutral

- The ADR-129 domain specialist triplet pattern (reviewer + skill + situational rule) evolves into a domain expert triplet (expert + skill + situational rule). The pattern is the same; the naming changes.
- Existing ADRs that reference `-reviewer` agents by name will need updating as part of the rename work.

## References

- `.agent/sub-agents/README.md` — three-layer prompt composition
- `.agent/sub-agents/templates/` — canonical agent templates
- `.agent/sub-agents/components/` — reusable prompt components
- `.agent/directives/invoke-code-reviewers.md` — invocation guidance (to be renamed)
- `.agent/practice-core/` — Practice Core files
- `scripts/validate-subagents.mjs` — sub-agent validation script
