---
name: elasticsearch specialist capability
overview: "Define and stage a canonical Elasticsearch specialist capability for the agent ecosystem: a skill, situational rule, and specialist reviewer that is explicitly required to fetch and consult current official Elastic documentation from the web as its primary source of truth, with repo ADRs/research and existing implementations treated as secondary context. The capability’s remit explicitly includes both Elastic platform correctness and higher-value opportunities to improve Oak by using existing or additional Elasticsearch capabilities more effectively, with Elastic Serverless treated as the repo’s explicit operating context."
todos:
  - id: define-capability-boundaries
    content: Define the Elasticsearch specialist’s doctrine, remit, boundaries, and authoritative source hierarchy.
    status: pending
  - id: design-reviewer-template
    content: Specify the canonical Elasticsearch reviewer template structure, checklist, output format, and delegation rules.
    status: pending
  - id: design-skill-and-rule
    content: Specify the companion skill and situational invocation rule, including trigger criteria and non-goals.
    status: pending
  - id: plan-adapters-and-discoverability
    content: Identify wrapper/adaptor artefacts, validation hooks, and discoverability surfaces needed for rollout.
    status: pending
isProject: false
---

# Elasticsearch Specialist Capability Plan

## Intent

Create a canonical Elasticsearch specialist capability under the `agentic-engineering-enhancements` collection that improves how agents reason about Elasticsearch work in this repo. The capability should not merely mirror current implementation; it should assess and guide work against current official Elastic documentation fetched from the web, current platform best practice, and evidence-driven search engineering. The specialist must treat Elastic Serverless as the repo’s default runtime context unless a task explicitly states otherwise.

## Recommended Home

Place the canonical plan in the `agentic-engineering-enhancements` collection, with the Elasticsearch research and semantic-search plans treated as the specialist domain corpus it depends on.

Primary implementation artefacts to create:

- Canonical reviewer template: `[.agent/sub-agents/templates/mcp-reviewer.md](.agent/sub-agents/templates/mcp-reviewer.md)` is the structural model; create an Elasticsearch equivalent beside it.
- Thin platform wrappers: `[.cursor/agents/mcp-reviewer.md](.cursor/agents/mcp-reviewer.md)` and `[.claude/agents/mcp-reviewer.md](.claude/agents/mcp-reviewer.md)` are the adapter model.
- Canonical skill: `[.agent/skills/mcp-migrate-oai/SKILL.md](.agent/skills/mcp-migrate-oai/SKILL.md)` is the closest example of a repo-specific specialist workflow grounded in upstream guidance.
- Situational rule pattern: `[.agent/rules/invoke-code-reviewers.md](.agent/rules/invoke-code-reviewers.md)` plus its thin wrapper `[.cursor/rules/invoke-code-reviewers.mdc](.cursor/rules/invoke-code-reviewers.mdc)`.

## Problem Statement

The repo has deep Elasticsearch research and semantic-search architecture, but no dedicated specialist capability that consistently:

- consults official Elastic sources first,
- distinguishes external best practice from local implementation history,
- reviews Elastic work for correctness and opportunity, and
- guides agents toward higher-value Elastic-native improvements without cargo-culting existing query, mapping, or ingestion patterns.

## Proposed Capability Scope

The new capability should cover:

- Elasticsearch platform correctness and best practice.
- Retrieval architecture choices: BM25, ELSER, RRF, reranking, query understanding, analyzers, synonyms, mappings, ingest, observability, and evaluation.
- Opportunity discovery: where Oak could extract more value from Elastic-native capabilities or use existing capabilities more effectively.
- Repo-specific boundary awareness: semantic-search doctrine, ADR constraints, and current roadmap state.
- Elastic Serverless capability awareness: feature availability, operational constraints, and places where Stack or self-managed guidance does not apply directly.

The reviewer should explicitly treat current code as evidence, not truth.

## Doctrine

Adopt the same stance used by the MCP reviewer, adapted for Elastic:

- Current official Elastic documentation fetched from the web is the authority.
- The specialist must use live web retrieval (`WebFetch`/`WebSearch` or platform-equivalent) to consult the latest official documentation before assessing behaviour, implementation, or opportunities.
- The official Elasticsearch JavaScript client package and repository are part of the primary authority surface for client behaviour and supported usage patterns.
- Elastic Search Labs guidance is best-practice input, not normative spec.
- Repo ADRs, plans, and research define local constraints, accepted trade-offs, and current architecture, but they are secondary to the official docs.
- Existing Oak code is an implementation to assess, not the standard to inherit.
- Deprecated or stale Elastic documentation must not be treated as primary authority when a current official alternative exists.
- Elastic Serverless is the default deployment context for review and guidance in this repo; when official documentation differs by deployment model, the specialist should prefer Serverless-relevant guidance and explicitly call out any Stack-only or self-managed assumptions.

## Primary External Authorities

The capability should name and require these as the primary external sources:

- [Elastic Documentation](https://www.elastic.co/docs) — current official product and reference documentation; primary authority for platform capabilities and current guidance.
- [npm package: `@elastic/elasticsearch](https://www.npmjs.com/package/@elastic/elasticsearch)` — official package surface, release channel, and package-level compatibility signal.
- [GitHub: `elastic/elasticsearch-js](https://github.com/elastic/elasticsearch-js)` — official Node.js client repository, source, examples, and client release history.

Secondary external sources may include focused official Elastic pages linked from the docs above, such as reference sections for mappings, retrievers, rank evaluation, profiling, ingest, lifecycle, troubleshooting, and release notes.

Serverless-specific source selection rules:

- Prefer current Elastic docs pages that include Serverless availability and deployment guidance.
- Treat deployment-model differences as review input, not incidental detail.
- Flag recommendations that are valid only for self-managed, Stack, Kibana-hosted, or deprecated Enterprise Search surfaces when Oak is running on Elastic Serverless.

Explicit exclusion:

- Legacy Enterprise Search documentation should not be treated as the main authority for new design decisions when the docs themselves mark that surface as no longer updated and direct users toward current documentation.

## Domain Corpus To Anchor The Capability

External-first doctrine should be paired with a stable repo corpus.

The repo corpus is mandatory context after consulting the external authorities above. It must not replace them.

Repo-specific deployment context:

- Oak explicitly uses Elastic Serverless. The specialist should therefore interpret official guidance through the Serverless lens first, then fall back to broader Elasticsearch guidance where it still applies.

Use these repo documents as mandatory local context:

- `[.agent/research/elasticsearch/README.md](.agent/research/elasticsearch/README.md)`
- `[.agent/research/elasticsearch/methods/README.md](.agent/research/elasticsearch/methods/README.md)`
- `[.agent/research/elasticsearch/methods/hybrid-retrieval.md](.agent/research/elasticsearch/methods/hybrid-retrieval.md)`
- `[.agent/research/elasticsearch/methods/evaluation-quality-gates.md](.agent/research/elasticsearch/methods/evaluation-quality-gates.md)`
- `[.agent/research/elasticsearch/methods/search-operations-governance.md](.agent/research/elasticsearch/methods/search-operations-governance.md)`
- `[.agent/research/elasticsearch/system/semantic-search-plans-review.md](.agent/research/elasticsearch/system/semantic-search-plans-review.md)`
- `[.agent/research/elasticsearch/system/semantic-search-sdk-and-cli-extraction.md](.agent/research/elasticsearch/system/semantic-search-sdk-and-cli-extraction.md)`
- `[.agent/plans/semantic-search/research-index.md](.agent/plans/semantic-search/research-index.md)`
- `[.agent/plans/semantic-search/elasticsearch-and-graphs.research.md](.agent/plans/semantic-search/elasticsearch-and-graphs.research.md)`
- `[docs/agent-guidance/semantic-search-architecture.md](docs/agent-guidance/semantic-search-architecture.md)`
- `[docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md](docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md)`
- `[docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md](docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md)`
- `[docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md](docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)`
- `[docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md](docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)`
- `[docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md](docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)`
- `[docs/architecture/architectural-decisions/089-index-everything-principle.md](docs/architecture/architectural-decisions/089-index-everything-principle.md)`
- `[docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md](docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)`
- `[docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md](docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md)`
- `[docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md](docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md)`
- `[docs/architecture/architectural-decisions/110-thread-search-architecture.md](docs/architecture/architectural-decisions/110-thread-search-architecture.md)`
- `[docs/architecture/architectural-decisions/120-per-scope-search-tuning.md](docs/architecture/architectural-decisions/120-per-scope-search-tuning.md)`

## Deliverables

1. Canonical Elasticsearch reviewer template in `.agent/sub-agents/templates/`.
2. Thin Cursor and Claude reviewer wrappers in platform adapter directories.
3. Canonical Elasticsearch specialist skill in `.agent/skills/` for active work, planning, and research tasks.
4. Thin skill adapters where required by platform conventions.
5. Canonical situational rule in `.agent/rules/` that defines when the specialist must be invoked.
6. Thin rule adapters in `.cursor/rules/` and other supported platforms if needed.
7. Explicit external-authority guidance in the reviewer and skill requiring live retrieval of current official Elastic docs before local analysis.
8. Explicit Serverless-context guidance in the reviewer and skill so feature recommendations, constraints, and opportunities are assessed against Elastic Serverless first.
9. Discoverability updates in the agent ecosystem docs and any relevant index/readme surfaces.
10. Validation updates so the new artefacts satisfy subagent and portability checks.

## Non-Goals

- Do not expand this into a generic “search reviewer”. Keep the scope explicitly Elasticsearch-focused.
- Do not duplicate responsibilities already owned by `code-reviewer`, `security-reviewer`, `test-reviewer`, `type-reviewer`, `mcp-reviewer`, or the architecture reviewers.
- Do not treat speculative future Elastic features as committed roadmap work for the product.
- Do not let the skill or reviewer become a substitute for ground-truth or benchmark evidence.

## Phased Work

### Phase 1: Capability Design Brief

Define the specialist’s boundaries, doctrine, trigger matrix, and authoritative source stack.

Should produce:

- final capability name,
- remit statement,
- in-scope vs out-of-scope matrix,
- authoritative external source list,
- explicit primary-source doctrine for live official web documentation retrieval,
- explicit Serverless-first deployment doctrine,
- mandatory repo reading list,
- distinction between reviewer, skill, and rule responsibilities.

### Phase 2: Reviewer Template

Create the canonical Elasticsearch reviewer template modelled on the structure of `[.agent/sub-agents/templates/mcp-reviewer.md](.agent/sub-agents/templates/mcp-reviewer.md)`, but adapted for Elastic.

It should include:

- external authoritative sources section,
- explicit instruction to fetch the latest official Elastic docs from the web before relying on repo context,
- explicit instruction to check deployment-model applicability, with Elastic Serverless as the default assumption,
- mandatory repo reading section,
- workflow for live-doc consultation then repo-context comparison,
- best-practice and opportunity review checklist,
- output format with severity-ordered findings and source citations,
- delegation guidance to other specialists when concerns are not primarily about Elasticsearch.

### Phase 3: Skill

Create a companion skill that tells the working agent how to approach Elasticsearch tasks correctly.

It should guide agents to:

- consult external Elastic docs first,
- fetch current official documentation from the web instead of relying on memory or repo-local summaries alone,
- interpret Elastic guidance through the Serverless deployment context first,
- use repo ADRs/research to understand accepted local constraints,
- benchmark before recommending retrieval changes,
- distinguish correctness fixes from opportunity proposals,
- avoid inheriting weak local patterns without justification.

### Phase 4: Rule And Triggering

Add a situational rule for when the specialist should be invoked.

Expected triggers:

- mappings and index schema changes,
- analyzers, synonyms, query DSL, retrievers, RRF, ELSER, reranking,
- ingestion/index lifecycle and retry behaviour,
- search evaluation, rank quality, latency budgets, zero-hit behaviour,
- Elastic capability exploration or platform-choice questions.

### Phase 5: Platform Adapters And Discoverability

Add thin platform wrappers and update relevant indexes/docs so the capability is discoverable and consistently invoked.

Likely touchpoints:

- agent inventory and roster references,
- reviewer invocation guidance if this specialist should be listed as situational,
- any relevant practice or specialist indexes.

### Phase 6: Validation And Evidence

Run the artefact validation path and confirm the new capability is structurally compliant and practically usable.

Validation should include:

- wrapper/template path integrity,
- portability checks,
- subagent validation,
- a small set of dry-run prompts to confirm routing and output quality.

## Success Signals

Promote this capability as successful when:

- agents have a clear Elasticsearch specialist to invoke for Elastic platform questions and reviews,
- the specialist explicitly fetches and cites current official Elastic sources in findings and recommendations,
- the specialist correctly filters recommendations through Elastic Serverless applicability and flags deployment-model mismatches,
- repo-local constraints are handled as context, not authority,
- the specialist can identify both correctness issues and realistic Elastic-native opportunities,
- the capability integrates cleanly with the existing reviewer roster and platform adapter model.

## Risks And Unknowns

- Scope creep: “Elasticsearch specialist” could accidentally absorb general search, architecture, or evaluation ownership.
- Drift risk: external docs evolve, so the template must require live consultation rather than hard-coding too much guidance.
- Deployment-context drift: generic Elasticsearch advice can be subtly wrong for Serverless unless availability and deployment assumptions are checked explicitly.
- Overlap risk: the new reviewer could duplicate `code-reviewer`, architecture reviewers, or `ground-truth-designer` unless boundaries are explicit.
- Maintenance cost: adding a new specialist must justify itself with distinct value, not just another reviewer in the roster.

## Promotion Trigger

Promote this strategic brief into an executable `current/` plan when the owner wants to implement the capability now and is ready to commit to concrete artefacts, validation commands, and discoverability updates.

At promotion time, convert this into an executable workstream with atomic todos, TDD-oriented acceptance criteria where relevant, explicit wrapper/template/skill file targets, and deterministic validation commands.
