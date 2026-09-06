# ADR-123: MCP Server Primitives Strategy

## Status

Accepted (amended 2026-07-23)

> **Amendment (2026-06-10 — graph-tools-value-redesign, deliverable G1b).**
> The `curriculum://prior-knowledge-graph` resource was removed from the
> resource catalogue; the anchored, bounded `get-prior-knowledge-graph` tool
> is the prior-knowledge value surface. See the Resources section below for
> the post-removal table and rationale.
>
> **Amendment (2026-06-10 — graph-tools-value-redesign, deliverable G2).**
> The `curriculum://misconception-graph` resource was removed on the same
> grounds; the anchored, bounded `get-misconception-graph` tool (lesson,
> unit, and windowed thread anchors) is the misconception value surface.
>
> **Amendment (2026-06-11 — graph-tools-value-redesign, deliverable G3).**
> The `curriculum://thread-progressions` resource was removed on the same
> grounds; the anchored, bounded `get-thread-progressions` tool (threadSlug
> detail, or subject + keyStage discovery) is the thread-progression value
> surface, ordered by teaching year.
>
> **Amendment (2026-09-03 — thread sequences in curriculum order).** The
> thread-progression surface now serves one run per subject in Oak's
> authored curriculum order (years ascending; within a year, the subject
> sequence's unit order), replacing the year-only ordering above whose
> within-year tie-break was alphabetical. Basis: ADR-086 amendment of the
> same date.
>
> **Amendment (2026-09-04 — misconception surface in curriculum order,
> MCP-682).** `get-misconception-graph` now windows a thread's units and
> lists a unit's lessons in the same authored order, from the corpus's
> ordered sections rather than the id-sorted edge set it had read. No
> wire-shape change; the ordering basis is stated in the served
> description. Basis: ADR-086 follow-on of the same date.
>
> **Amendment (2026-06-11 — position-anchored-teaching-continuity, w1-c1).**
> The Prompts section below was reconciled with the shipped estate, which
> had drifted: the served set is seven prompts (the table previously listed
> five, one under a pre-ship name). `continue-progression` was added as the
> position-anchored entry point — it resolves position→next and chains into
> `lesson-planning`, never duplicating planning substance (the S3
> extend/merge reconciliation discipline, PR #162 precedent).
>
> **Amendment (2026-07-23 — mcp-101 visible-surface allowlist; owner
> decision D11, decisions register).** The prompts strategy below is
> SUPERSEDED: the app now serves **zero MCP prompts** — the primitive is
> unregistered entirely (user-invoked prompt templates are a poor user
> experience for teachers). The workflow bodies are re-homed as
> agent-readable guidance resources (`docs://oak/guidance/*`), with
> live-vs-dormant state governed by the app's declarative served-surface
> definition (`apps/oak-curriculum-mcp-streamable-http/src/served-surface/`)
> — which also supersedes the flag-gating this ADR describes for the EEF
> and user-search surfaces (registration-surface membership is a reviewed
> definition change, never a runtime flag). The Prompts sections below are
> retained as the historical record of the superseded strategy; the
> "every prompt defined in the SDK is registered at the app layer"
> consequence no longer holds — the SDK defines no prompts.

## Context

The MCP specification defines three server primitives with distinct control models:

| Primitive     | Control Model          | Who Decides When to Use It         |
| ------------- | ---------------------- | ---------------------------------- |
| **Tools**     | Model-controlled       | The AI model decides to call them  |
| **Resources** | Application-controlled | The host application surfaces them |
| **Prompts**   | User-controlled        | The user explicitly invokes them   |

Our MCP server exposes curriculum capabilities through all three primitives. [ADR-058](058-context-grounding-for-ai-agents.md) documents the dual-exposure pattern for context grounding (tool + resource), but no ADR covers the broader strategy for how we map curriculum capabilities to these three primitive types and why.

This ADR fills that gap: it documents which curriculum capabilities are exposed through which primitive, the rationale for each placement, and the selection criteria for prompts.

## Decision

### Tools (model-controlled)

37 tools: 24 generated from the OpenAPI schema plus 13 aggregated
tools. The model decides when to call them based on the user's question and
the tool visibility metadata exposed through the MCP contract.

- **Generated tools** (24) are produced at SDK compile time from the OpenAPI schema. When the upstream API changes, `pnpm sdk-codegen` updates the tool definitions automatically.
- **Aggregated tools** (13) are hand-authored compositions that orchestrate API calls, search, reference data, and MCP App entry points. The full set: `search`, `fetch`, `browse-curriculum`, `explore-topic`, `get-thread-progressions`, `get-prior-knowledge-graph`, `get-misconception-graph`, `get-keyword-graph`, `get-eef-evidence`, `get-curriculum-model` (domain ontology and tool usage guidance), `download-asset`, `user-search`, and `user-search-query`.
- One aggregated tool draws on an external evidence corpus rather than the Oak curriculum API: `get-eef-evidence` returns a typed subgraph of EEF Teaching and Learning Toolkit strands (with structural citations and caveats) for a lesson context. It composes the `GraphView` substrate per [ADR-179](179-transport-agnostic-graph-substrate.md) and carries `eef-*` namespacing + source attribution per [ADR-157](157-multi-source-open-education-integration.md).

> **Maintenance note**: the tool counts and the aggregated-tool list above are
> hand-maintained and drift from the code as tools are added (this entry is the
> first external-corpus tool). Before a second evidence corpus lands, replace
> the prose enumeration with a generated table sourced from `AGGREGATED_TOOL_DEFS`
> and `MCP_PROMPTS` so the ADR cannot fall out of sync.

**Intent**: Let AI assistants search, browse, and fetch curriculum data autonomously.

**Impact**: Agents can answer teacher questions about the curriculum without human tool orchestration.

### Resources (application-controlled)

One curriculum resource for clients that support resource injection:

| Resource URI         | Content                    | Priority | Audience        |
| -------------------- | -------------------------- | -------- | --------------- |
| `curriculum://model` | Domain ontology + guidance | 1.0      | `["assistant"]` |

The host application decides whether and how to inject it into the model's context; `curriculum://model` (priority 1.0) should be loaded at conversation start.

The graph corpora are deliberately tool-only: the whole-corpus
`curriculum://prior-knowledge-graph` (2026-06-10, G1b),
`curriculum://misconception-graph` (2026-06-10, G2), and
`curriculum://thread-progressions` (2026-06-11, G3) resources were removed
when the anchored, bounded `get-prior-knowledge-graph`,
`get-misconception-graph`, and `get-thread-progressions` tools became their
value surfaces — a whole-corpus dump has no bounded resource form.

A further resource serves the interactive MCP App widget:

| Resource URI                    | Content              | Priority | Audience  |
| ------------------------------- | -------------------- | -------- | --------- |
| `ui://widget/oak-banner-*.html` | React MCP App (HTML) | —        | `["app"]` |

This resource uses `text/html;profile=mcp-app` content type and is registered via `registerAppResource` per [ADR-141](141-mcp-apps-standard-primary.md). CSP declarations for external fonts are included via `_meta.ui.csp.resourceDomains` on the content item.

**Intent**: Clients that support resource auto-injection get orientation data without a tool call.

**Impact**: Reduced latency for first-turn responses in capable clients (e.g., Claude Desktop). For clients that do not surface resources (e.g., ChatGPT), the `get-curriculum-model` tool provides the same orientation data on-demand.

See [ADR-058](058-context-grounding-for-ai-agents.md) for the dual-exposure rationale.

### Prompts (user-controlled)

Seven parameterised workflow templates that the user explicitly invokes (slash commands, UI buttons):

| Prompt                 | Arguments                                    | Workflow                                                                                                                     |
| ---------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `find-lessons`         | topic, keyStage?                             | Search lessons, summarise top results                                                                                        |
| `lesson-planning`      | topic, yearGroup                             | Full lesson build: place the lesson, specify knowledge, misconceptions, sequence, assess, resources                          |
| `explore-curriculum`   | topic, subject?                              | Broad parallel search across lessons/units/threads                                                                           |
| `learning-progression` | concept, subject                             | Search threads, map progression, identify gaps                                                                               |
| `curriculum-mapping`   | subject, keyStage, yearGroup?                | Order units from the thread backbone and prerequisites, check national-curriculum coverage                                   |
| `adapt-lesson`         | topic, yearGroup                             | Surface pedagogical signals from Oak's graphs, retrieve EEF evidence, present calibrated options                             |
| `continue-progression` | subject, yearGroup, justCovered, classNotes? | Resolve the class's position, derive the next step from the thread, readiness + misconceptions, chain into `lesson-planning` |

Every prompt opens by calling `get-curriculum-model` for orientation in the Oak curriculum domain model before its workflow steps.

**Intent**: Structure common teacher workflows so the model follows a proven multi-step recipe instead of improvising.

**Impact**: Consistent, high-quality responses for the most common curriculum queries — including the position-anchored entry point ("my class just finished X — what next?"), which `continue-progression` owns by resolving position→next and chaining into `lesson-planning` rather than duplicating it.

### Prompt selection criteria

A prompt earns its place when it:

1. **Orchestrates multiple tools** in a specific sequence
2. **Serves a distinct user intent** not covered by another prompt
3. **Adds structure** the user would otherwise have to describe manually

### Deduplication: `progression-map` removed

`progression-map` and `learning-progression` were near-duplicates: same arguments (`concept`, `subject`), same tool sequence (search threads → get progressions → map dependencies → suggest scaffolding), same output shape. `learning-progression` additionally references `get-thread-progressions` and `get-prior-knowledge-graph` explicitly and includes gap-identification guidance. It is strictly more complete. `progression-map` was removed.

## Consequences

### Positive

- **Clear primitive mapping**: Each curriculum capability is exposed through the MCP primitive whose control model matches the intended interaction pattern
- **No dead code**: Every prompt defined in the SDK is registered at the app layer, has a Zod schema, and is E2E tested
- **No duplication**: Overlapping prompts have been consolidated
- **Documented selection criteria**: Future prompt additions can be evaluated against explicit criteria rather than ad-hoc judgement

### Negative

- **Removing a prompt is a breaking change** for any client that references it by name. Mitigated by the fact that the server is in private alpha and no external clients depend on `progression-map`.

### Neutral

- **Prompt count is intentionally small** (7). More prompts may be added post-alpha as real usage patterns emerge.

## Related Decisions

- [ADR-058: Context Grounding for AI Agents](058-context-grounding-for-ai-agents.md) — dual-exposure pattern for orientation data (tool + resource)
- [ADR-060: Agent Support Tool Metadata System](060-agent-support-metadata-system.md) — metadata annotations for tool guidance
- [ADR-107: Deterministic SDK / NL-in-MCP Boundary](107-deterministic-sdk-nl-in-mcp-boundary.md) — where deterministic data ends and natural language begins

## References

- [MCP Specification: Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [MCP Specification: Resources](https://modelcontextprotocol.io/specification/2025-06-18/server/resources)
- [MCP Specification: Prompts](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts)
- [MCP Server Concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
