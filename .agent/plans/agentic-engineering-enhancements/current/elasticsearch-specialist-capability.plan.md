---
name: Elasticsearch Specialist Capability
overview: >
  Create a canonical Elasticsearch specialist capability for the agent ecosystem:
  a reviewer, skill, and situational rule grounded in current official Elastic
  documentation, Elastic Serverless applicability, and repo-local constraints as
  secondary context.
todos:
  - id: es-capability-doctrine
    content: "Define the Elasticsearch specialist doctrine, scope, and authority hierarchy."
    status: pending
  - id: es-capability-reviewer
    content: "Design the canonical Elasticsearch reviewer template and wrapper strategy."
    status: pending
  - id: es-capability-skill-rule
    content: "Design the companion skill and situational invocation rule."
    status: pending
  - id: es-capability-rollout
    content: "Integrate the capability into collection indexes, validation paths, and discoverability surfaces."
    status: pending
---

# Elasticsearch Specialist Capability

## Intent

Create a canonical Elasticsearch specialist capability for this repo's agent
ecosystem so agents can:

1. assess Elasticsearch work against current official Elastic documentation,
2. treat Elastic Serverless as the default deployment context,
3. distinguish external authority from local implementation precedent, and
4. surface realistic opportunities to improve Oak by using Elastic-native
   capabilities more effectively.

## Execution Role

This is a strategic source plan. It defines doctrine, scope, artefact shape,
and rollout intent.

Active execution lives in:

- [active/elasticsearch-specialist-capability.execution.plan.md](active/elasticsearch-specialist-capability.execution.plan.md)

## Problem

The repo has extensive Elasticsearch research, search architecture decisions,
and implementation experience, but it does not yet have a dedicated specialist
capability that consistently enforces this review order:

1. current official Elastic documentation,
2. official client/package sources,
3. repo ADRs and research as local context,
4. existing Oak implementation as evidence only.

Without that capability, agents risk:

- inheriting local patterns that are no longer best practice,
- applying Stack or self-managed guidance that does not fit Elastic Serverless,
- missing realistic Elastic-native opportunities,
- or overfitting to repo history instead of the current platform.

## Scope

### In Scope

- Elasticsearch platform correctness and best practice
- Elastic Serverless capability and availability awareness
- Retrieval architecture choices:
  - BM25
  - ELSER
  - RRF
  - reranking
  - query understanding
  - analyzers
  - synonyms
  - mappings
  - ingest
  - observability
  - evaluation
- Opportunity discovery for higher-value Elastic-native improvements
- Agent artefacts required to operationalise the capability:
  - reviewer template
  - platform wrappers
  - companion skill
  - situational rule
  - discoverability updates

### Out of Scope

- Creating a generic "search reviewer"
- Replacing existing specialists such as `code-reviewer`, `test-reviewer`,
  `security-reviewer`, `mcp-reviewer`, or the architecture reviewers
- Committing product roadmap changes to Elastic capabilities as part of this
  artefact rollout
- Treating the specialist as a substitute for benchmark evidence, ground truth,
  or operational validation

## Doctrine

The capability must follow these rules:

1. **Official docs first**: current official Elastic documentation fetched from
   the web is the primary source of truth.
2. **Serverless first**: Elastic Serverless is the default deployment context
   unless a task explicitly states otherwise.
3. **Official client sources are primary**: the `@elastic/elasticsearch`
   package surface and `elastic/elasticsearch-js` repository are part of the
   primary authority set for Node.js client behaviour and supported usage.
4. **Repo context is secondary**: ADRs, plans, and research describe local
   constraints, accepted trade-offs, and current architecture, but do not
   override current official guidance.
5. **Implementations are evidence, not authority**: existing Oak code is to be
   assessed, not inherited by default.
6. **Stale/deprecated docs are not normative**: if Elastic marks a surface as
   no longer updated or migrated away, it cannot be the main authority for new
   recommendations.

## Capability Split

Keep the reviewer and the skill distinct:

- **`elasticsearch-reviewer`** is a read-only specialist reviewer. It assesses
  correctness, best practice, Serverless applicability, and higher-value
  opportunity against official Elastic sources first.
- **`elasticsearch-expert`** is an active workflow skill for the working agent.
  It supports planning, research, and implementation work under the same
  doctrine, but it does not replace the reviewer.

This capability follows the domain specialist triplet pattern defined in
[ADR-129](../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).

### When NOT to Invoke

Do not invoke the Elasticsearch specialist for:

- Generic Node.js HTTP client issues that happen to use `@elastic/elasticsearch`
  (e.g., connection timeouts, proxy configuration) — use standard debugging.
- Non-Elasticsearch search questions (e.g., full-text search concepts, generic
  relevance tuning theory) — unless the question is about Elastic-specific
  implementation of those concepts.
- Oak product decisions that do not involve Elasticsearch platform capabilities
  (e.g., which curriculum fields to expose in MCP tools).
- Infrastructure or deployment questions unrelated to Elastic Serverless
  capabilities (e.g., Kubernetes configuration, CI/CD pipeline design).

## Primary Authorities

- [Elastic Documentation](https://www.elastic.co/docs)
- [npm: `@elastic/elasticsearch`](https://www.npmjs.com/package/@elastic/elasticsearch)
- [GitHub: `elastic/elasticsearch-js`](https://github.com/elastic/elasticsearch-js)

Serverless-relevant official pages should be preferred whenever availability or
deployment differences matter.

## Local Context

Local context is tiered per
[ADR-129](../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)
to balance thoroughness against context window consumption.

### Must-Read (always loaded)

These provide essential architectural context that every Elasticsearch review
needs:

- [`../../research/elasticsearch/README.md`](../../../research/elasticsearch/README.md)
- [`docs/agent-guidance/semantic-search-architecture.md`](../../../docs/agent-guidance/semantic-search-architecture.md)
- [`docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md`](../../../docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md)
- [`docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md`](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)
- [`docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md`](../../../docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md)

### Consult-If-Relevant (loaded when the review touches that area)

These provide depth on specific sub-topics. Load when the review touches
retrieval methods, evaluation, ingest, or search tuning:

- [`../../research/elasticsearch/methods/README.md`](../../../research/elasticsearch/methods/README.md)
- [`../../research/elasticsearch/methods/hybrid-retrieval.md`](../../../research/elasticsearch/methods/hybrid-retrieval.md)
- [`../../research/elasticsearch/methods/evaluation-quality-gates.md`](../../../research/elasticsearch/methods/evaluation-quality-gates.md)
- [`../../research/elasticsearch/methods/search-operations-governance.md`](../../../research/elasticsearch/methods/search-operations-governance.md)
- [`../../research/elasticsearch/system/semantic-search-plans-review.md`](../../../research/elasticsearch/system/semantic-search-plans-review.md)
- [`../../research/elasticsearch/system/semantic-search-sdk-and-cli-extraction.md`](../../../research/elasticsearch/system/semantic-search-sdk-and-cli-extraction.md)
- [`../semantic-search/research-index.md`](../../semantic-search/research-index.md)
- [`../knowledge-graph-integration/archive/elasticsearch-and-graphs.research.md`](../../knowledge-graph-integration/archive/elasticsearch-and-graphs.research.md)
- [`docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md`](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)
- [`docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md`](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)
- [`docs/architecture/architectural-decisions/089-index-everything-principle.md`](../../../docs/architecture/architectural-decisions/089-index-everything-principle.md)
- [`docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md`](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)
- [`docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md`](../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md)
- [`docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md`](../../../docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md)
- [`docs/architecture/architectural-decisions/110-thread-search-architecture.md`](../../../docs/architecture/architectural-decisions/110-thread-search-architecture.md)
- [`docs/architecture/architectural-decisions/120-per-scope-search-tuning.md`](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md)

## Deliverables

1. Canonical reviewer template:
   `.agent/sub-agents/templates/elasticsearch-reviewer.md`
2. Reviewer adapters:
   `.cursor/agents/elasticsearch-reviewer.md`
   `.claude/agents/elasticsearch-reviewer.md`
   `.gemini/commands/review-elasticsearch.toml`
   `.agents/skills/elasticsearch-reviewer/SKILL.md`
3. Canonical active-workflow skill:
   `.agent/skills/elasticsearch-expert/SKILL.md`
4. Active-workflow skill adapters where required by platform conventions
5. Canonical situational rule:
   `.agent/rules/invoke-elasticsearch-reviewer.md`
6. Rule adapters where required by platform conventions
7. Discoverability updates in collection indexes and relevant agent guidance
8. Validation updates and deterministic checks for structural compliance

## Planned Execution Slices

1. **Baseline and constraints**
   - confirm current absence/partial presence of equivalent artefacts
   - confirm required authoritative source stack and Serverless doctrine
2. **Canonical artefacts**
   - reviewer template
   - active-workflow skill
   - situational rule
   - agent roster / invocation guidance updates
3. **Platform adapters**
   - thin reviewer adapters across supported platforms
   - active-workflow skill adapters
   - rule adapters
4. **Discoverability and validation**
   - collection indexes
   - roadmap references
   - prompt-entry discoverability surface
   - `subagents:check` and markdown validation

## Success Criteria

This capability is successful when:

- agents have a clearly named Elasticsearch specialist capability to invoke,
- the specialist is required to fetch current official Elastic docs from the web
  before assessing repo code or research,
- Elastic Serverless applicability is checked explicitly,
- findings and recommendations cite official sources first,
- local ADRs and research are used as context rather than authority,
- and the capability integrates cleanly with the repo's thin-wrapper artefact
  model.

## Risks

| Risk | Mitigation |
|------|------------|
| Capability drifts into generic search review | Keep Elasticsearch-only boundaries explicit in template, skill, and rule |
| Serverless applicability is overlooked | Make Serverless-first doctrine explicit and test for deployment-model mismatch language |
| Specialist overlaps existing reviewers | Add explicit delegation boundaries and situational triggers |
| Official docs evolve | Require live web fetch/search rather than static copied guidance |

## Dependencies

- Domain specialist capability pattern:
  [`docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md`](../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)
- Repo artefact architecture:
  [`docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md`](../../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md)
- Agent artefact portability:
  [`docs/architecture/architectural-decisions/125-agent-artefact-portability.md`](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
- Collection roadmap and indexes:
  [README.md](README.md),
  [roadmap.md](roadmap.md)
