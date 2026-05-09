---
name: elasticsearch-expert
classification: active
description: Active workflow skill for Elasticsearch planning, research, and implementation support. Grounded in current official Elastic documentation with Elastic Serverless as the default deployment context. Use when the working agent needs Elasticsearch expertise for active tasks — distinct from the elasticsearch-reviewer, which is a read-only assessment specialist.
---

# Elasticsearch Expert

Active workflow skill for Elasticsearch planning, research, and implementation work. This skill supports the working agent during tasks that involve Elasticsearch — it does not replace the `elasticsearch-reviewer`, which provides independent read-only assessment.

## When to Use

Use this skill when the working agent needs to:

- Plan Elasticsearch mapping, analyser, or query changes
- Research Elastic Serverless capabilities or constraints
- Implement or modify retriever composition (BM25, ELSER, RRF, reranking)
- Design or modify ingest pipelines
- Evaluate search quality approaches
- Assess whether an Elastic-native capability could replace a custom implementation

## When NOT to Use

- For independent review of completed work — use `elasticsearch-reviewer`
- For generic search concepts unrelated to Elastic — use domain knowledge
- For Node.js HTTP client issues — use standard debugging
- For Oak product decisions not involving Elastic capabilities — consult the team

## Doctrine Hierarchy

This skill follows the same authority hierarchy as the `elasticsearch-reviewer` (per ADR-129):

1. **Current official Elastic documentation** — fetched live from the web. Primary authority.
2. **Official packages and client sources** — `@elastic/elasticsearch` npm package and `elastic/elasticsearch-js` repository.
3. **Repository ADRs and research** — secondary context describing local constraints and trade-offs.
4. **Existing implementation** — evidence of current state, not authority for future decisions.

**Do not cargo-cult existing repo patterns.** Always verify against current official documentation before replicating or extending existing approaches.

## Deployment Context

**Elastic Serverless is the default deployment context.** All planning, research, and implementation must be validated against Serverless availability. If a feature is not available on Serverless, flag this explicitly and propose alternatives.

## Required External Reading

Before any Elasticsearch planning or implementation, consult live official documentation:

| Source | URL | Use for |
|--------|-----|---------|
| Elastic Documentation | `https://www.elastic.co/docs` | Platform overview, all product documentation |
| Elasticsearch Reference | `https://www.elastic.co/docs/reference/elasticsearch` | Mappings, queries, analysers, retrievers |
| Elastic Cloud Serverless | `https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/serverless` | Serverless deployment overview and capabilities |
| Serverless Differences | `https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/differences-from-other-elasticsearch-offerings` | Serverless vs hosted comparison, API and feature differences |
| npm: @elastic/elasticsearch | `https://www.npmjs.com/package/@elastic/elasticsearch` | Client API and usage patterns |
| GitHub: elastic/elasticsearch-js | `https://github.com/elastic/elasticsearch-js` | Client source and types |

Use WebFetch or WebSearch to consult these. The URLs are starting points — follow links for specific areas.

## Required Local Reading

### Must-Read (always loaded)

| Document | Purpose |
|----------|---------|
| `.agent/research/elasticsearch/README.md` | Elasticsearch research index and current state |
| `docs/agent-guidance/semantic-search-architecture.md` | Search architecture principles |
| `docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md` | Elastic-native-first philosophy |
| `docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md` | ELSER-only embedding strategy |
| `docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md` | SDK-generated mappings |

### Consult-If-Relevant (loaded when the task touches that area)

> **Note**: This is an intentional subset of the `elasticsearch-reviewer`'s broader consult-if-relevant list. The reviewer needs wider scope for independent assessment; the skill covers the areas most relevant during active implementation work.

| Document | Load when |
|----------|-----------|
| `.agent/research/elasticsearch/methods/README.md` | Retrieval method choices |
| `.agent/research/elasticsearch/methods/hybrid-retrieval.md` | Hybrid retrieval / RRF |
| `.agent/research/elasticsearch/methods/evaluation-quality-gates.md` | Search evaluation |
| `.agent/research/elasticsearch/methods/search-operations-governance.md` | Search operations |
| `docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md` | Evaluation framework |
| `docs/architecture/architectural-decisions/089-index-everything-principle.md` | Index-everything principle |
| `docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md` | Bulk retry strategy |
| `docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md` | RRF normalisation |
| `docs/architecture/architectural-decisions/110-thread-search-architecture.md` | Thread search |
| `docs/architecture/architectural-decisions/120-per-scope-search-tuning.md` | Per-scope tuning |

## Workflow

### 1. Understand the Task

Identify what Elasticsearch area is involved (mappings, queries, retrievers, ingest, evaluation, capabilities).

### 2. Consult Official Documentation

Fetch current official Elastic documentation for the relevant area. Do not rely on cached knowledge or repo patterns alone.

### 3. Check Serverless Applicability

Verify that all proposed approaches work on Elastic Serverless. Flag incompatibilities immediately.

### 4. Read Local Context

Load the must-read documents. Load consult-if-relevant documents only when the task area demands them.

### 5. Plan, Research, or Implement

Apply official guidance with local context. When official guidance and local patterns diverge, prefer official guidance and flag the divergence for ADR review.

### 6. Flag Opportunities

If current official Elastic capabilities could improve the implementation beyond the immediate task, note the opportunity without committing the product to it.

## Guardrails

- **Never replicate existing code patterns without checking official docs first.** Existing patterns may be outdated.
- **Never recommend features unavailable on Elastic Serverless** without explicit flagging.
- **Never make product commitments** about adopting Elastic capabilities. Flag opportunities; the team decides.
- **Never substitute for the reviewer.** After implementation, invoke `elasticsearch-reviewer` for independent assessment.
