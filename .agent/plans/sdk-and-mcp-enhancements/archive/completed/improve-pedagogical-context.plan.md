# Improve Pedagogical Context

**Status**: WS1 implemented. WS2+WS3 collapsed to future review checkpoint.
**Last Updated**: 2026-03-01
**Provenance**: Extracted from Domain D items 1-2 of
[mcp-extensions-research-and-planning.md](mcp-extensions-research-and-planning.md).
Originated from a live session where the consuming agent (not the user)
introduced "GCSE" as a search term instead of preserving the user's
correct "KS4 maths" — demonstrating the need for authoritative
vocabulary guidance.

---

## Problem

Consuming AI agents lack structured guidance on Oak's pedagogical
vocabulary. This causes agents to:

- Rewrite correct curriculum terms into colloquial/assessment terms
  (e.g. converting "KS4 maths" to "GCSE maths")
- Use assessment terms as search text where they produce zero results
- Fail to distinguish between filter parameters (key stage, subject)
  and search content (topic terms)

The root cause: the MCP server provides synonyms (colloquial-to-canonical
mappings) but does not provide a definitive canonical vocabulary that
tells agents "these terms are authoritative — trust them".

## Prior Work

Significant research and planning has been done in this area. This plan
builds on rather than replaces that work.

### Directly relevant (high priority)

- **[Ontology and Graphs API Proposal](../external/ooc-api-wishlist/22-ontology-and-graphs-api-proposal.md)** —
  Proposes replacing synonyms in the ontology with a glossary structure
  (`term`, `definition`, `aliases`, `context`, `officialSource`). Also
  proposes a unified `OakOntology` interface and migration path (SDK
  consolidation → API proposal → consumer migration). Section
  "Synonyms Confusion" (§1) identifies the exact problem this plan
  addresses.

- **[Managing an Existing Large Synonym Set](../../research/elasticsearch/oak-data/handling-existing-synonymish-things.md)** —
  Reframes the synonym corpus using four relationship buckets:
  (A) alias/surface form, (B) pedagogical paraphrase, (C) sense-bound
  term, (D) related concept. Key insight: "Only Bucket A should be
  treated as true Elasticsearch synonyms." The MCP agent vocabulary
  draws from all four buckets (as guidance), while search should use
  only Bucket A. The document's framing — "synonyms are a scalpel,
  not a net" — applies here.

- **[Data and Domain Vocabulary](../../research/elasticsearch/oak-data/data-and-domain-vocabulary.md)** —
  Distinguishes structural/control vocabulary (query-shaping terms like
  "GCSE", "KS4", "AQA") from domain vocabulary (content terms like
  "trigonometry", "photosynthesis"). Directly addresses the GCSE
  issue: "GCSE" is a structural term that should drive filters, not
  search content. Also explains why definitions are a separate asset
  from synonyms — "A synonym map answers 'what else might the user
  type?'; a definition answers 'what is this term?'"

### Architecture (already referenced)

- **[ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md)** —
  SDK domain synonyms source of truth. Revision note (2026-02-24)
  identifies two concerns: agent context injection (primary) and
  search synonym expansion (interim).

- **[ADR-060](../../../docs/architecture/architectural-decisions/060-agent-support-metadata-system.md)** —
  Agent support metadata single-source pattern. Historical context for
  agent tooling, mentions `get-glossary` tool concept.

- **[ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md)** —
  Vocab-gen graph export pattern.

### Infrastructure documentation (out of scope but context)

- **[Synonyms README](../../../packages/sdks/oak-sdk-codegen/src/synonyms/README.md)** —
  Documents the two-concern distinction, four consumer domains, file
  layout, and sensitivity notes. The canonical reference for how the
  synonym system works today.

- **[Semantic search prompt](../../prompts/semantic-search/semantic-search.prompt.md)** —
  Documents the two-concern distinction in operational context.

---

## Guidance Surface Audit (2026-03-01)

A comprehensive audit of all "how to use this service" information
delivered to consuming AI agents. This inventory drives WS1 design
decisions.

### 16 Surfaces Across 6 Delivery Channels

#### A. At Connection Time (once per session)

| # | Surface | Source File | Size | What It Says |
|---|---------|-------------|------|--------------|
| 1 | `SERVER_INSTRUCTIONS` | `prerequisite-guidance.ts` → `agent-support-tool-metadata.ts` | ~350 chars | "Call get-ontology then get-help at start" |

#### B. Per Tool Call (every tool response)

| # | Surface | Source File | Size | What It Says |
|---|---------|-------------|------|--------------|
| 2 | `oakContextHint` in `structuredContent` | `prerequisite-guidance.ts` → `agent-support-tool-metadata.ts` | ~100 chars | "Call get-ontology for X, get-help for Y" |

#### C. Tool Descriptions (via `tools/list`)

| # | Surface | Source File | Attached To | What It Says |
|---|---------|-------------|-------------|--------------|
| 3 | `AGGREGATED_PREREQUISITE_GUIDANCE` | `prerequisite-guidance.ts` | search, browse-curriculum, explore-topic | "Call get-ontology first" |
| 4 | `FETCH_PREREQUISITE_GUIDANCE` | `prerequisite-guidance.ts` | fetch | "Call get-ontology first (ID formats)" |
| 5 | `HELP_PREREQUISITE_GUIDANCE` | `prerequisite-guidance.ts` | get-help | "Use get-ontology for domain, this for tools" |
| 6 | `ONTOLOGY_RECOMMENDED_FIRST_STEP` | `prerequisite-guidance.ts` | get-ontology, get-thread-progressions, get-prerequisite-graph | "RECOMMENDED FIRST STEP" |
| 7 | `DOMAIN_PREREQUISITE_GUIDANCE` | `tool-description.ts` (codegen) | ~20 generated auth'd tools | "Call get-ontology first" |

#### D. Agent Support Tools (on-demand, model-controlled)

| # | Surface | Source File | Size | Content |
|---|---------|-------------|------|---------|
| 8 | `get-ontology` tool | `aggregated-ontology.ts` → `ontology-data.ts` | ~60KB | Domain model: key stages, subjects, entity hierarchy, threads, KS4 complexity, patterns, unit types, lesson components, content guidance, workflows, idFormats, UK education context, canonical URLs, synonyms, propertyGraph |
| 9 | `get-help` tool | `aggregated-help/` → `tool-guidance-data.ts` | ~8KB | Server overview, tool categories, tips (12), ID formats, workflows (6) |

#### E. MCP Resources (application-controlled)

| # | Surface | Source File | Format | Content |
|---|---------|-------------|--------|---------|
| 10 | `curriculum://ontology` | `ontology-resource.ts` → `ontology-data.ts` | JSON | Same data as get-ontology |
| 11 | `docs://oak/getting-started.md` | `documentation-resources.ts` → `tool-guidance-data.ts` | Markdown | Server overview, auth, quick start, tips |
| 12 | `docs://oak/tools.md` | `documentation-resources.ts` → `tool-guidance-data.ts` | Markdown | Tool categories, when-to-use, ID formats |
| 13 | `docs://oak/workflows.md` | `documentation-resources.ts` → `tool-guidance-data.ts` | Markdown | 5 step-by-step workflow guides |

#### F. Prompts and Widget (user-initiated)

| # | Surface | Source File | Content |
|---|---------|-------------|---------|
| 14 | 5 MCP prompts | `mcp-prompts.ts` → `mcp-prompt-messages.ts` | Each embeds "you may want to call get-ontology first" |
| 15 | `WIDGET_DESCRIPTION` | `register-resources.ts` (app) | "Call get-ontology and get-help first" |
| 16 | CTA prompt | `widget-cta/registry.ts` (app) | "Call get-help, then all agent support tools" |

### What Is Already Well-Placed

These surfaces are well-designed and should not change in WS1:

1. **`AGENT_SUPPORT_TOOL_METADATA`** — excellent single source of truth
   for tool existence, relationships, and call order. Drives surfaces
   1 and 2 automatically.

2. **Prerequisite guidance constants (3–7)** — consistent messaging
   across all tool descriptions. When `get-curriculum-model` exists, these
   update to reference `get-curriculum-model` instead of `get-ontology`.

3. **MCP resources (10–13)** — good alternative delivery for clients
   that support pre-injection. The `curriculum://ontology` resource
   complements the tool.

4. **MCP prompts (14)** — appropriate workflow templates. Reference
   to `get-ontology` updates to `get-curriculum-model` when available.

### What Needs To Change

1. **Agents must call TWO tools** (get-ontology + get-help) for full
   context. CTA (surface 16) works around this with a multi-step
   prompt. This is the problem `get-curriculum-model` solves.

2. **Workflow duplication** — workflows appear in `tool-guidance-workflows.ts`,
   `tool-guidance-data.workflows`, `ontology-data.workflows` (imported
   from tool-guidance-data), get-help output, `docs://oak/workflows.md`.
   Five copies, one canonical source.

3. **ID format duplication** — `tool-guidance-data.idFormats` and
   `ontology-data.idFormats` (same object via import).

4. **Synonyms section** is the full `synonymsData` spread into
   ontology (~500+ entries). Agents don't need this; they need a
   curated glossary (WS2/WS3).

5. **"Call get-ontology first" appears 13 times** across 6 channels.
   Acceptable redundancy (belt-and-braces) but should reference
   `get-curriculum-model` once it exists.

---

## Solution

Three workstreams, each building on the previous:

### WS1: `get-curriculum-model` tool

Combine `get-help` and `get-ontology` into a single `get-curriculum-model` tool
that agents call once at conversation start.

**Delivery surface**: Both tool (model-controlled, universal client
support) and resource (application-driven, with spec annotations for
auto-injection). See "Dual exposure" design decision below.

**Current state**: Agents must call two tools. The CTA prompt in
`widget-cta/registry.ts` works around this with a multi-step instruction.

**Target state**: One call — `get-curriculum-model` — returns everything an
agent needs. All 16 guidance surfaces are updated to reference
`get-curriculum-model` as the recommended first step. Agents that already call
`get-ontology` and `get-help` continue to work unchanged.

**Design decisions (resolved)**:

- **Payload size**: Combined ~68KB ≈ ~17K tokens ≈ 13% of a 128K
  context window. Acceptable. No `detail` parameter needed for WS1.
  If future workstreams add significant content (glossary, expanded
  vocabulary), revisit then.

- **`tool_name` parameter**: Migrate from `get-help`. The `get-curriculum-model`
  tool accepts an optional `tool_name` parameter; when provided, it
  returns the full context plus tool-specific help. When omitted, it
  returns the full context without tool-specific help.

- **Backwards compatibility**: `get-help` and `get-ontology` remain
  available. `get-curriculum-model` is additive. Deprecation is a separate
  future decision.

- **Response shape**: Single JSON object merging ontology data and
  tool guidance, structured for agent comprehension:
  ```text
  {
    domainModel: { ...ontologyData (minus synonyms) },
    toolGuidance: { ...toolGuidanceData },
    toolSpecificHelp: { ... } // only when tool_name provided
  }
  ```

- **Dual exposure (tool + resource)**: Per the MCP spec's control
  model design, `get-curriculum-model` is exposed as both:
  1. A **tool** — model-controlled, universal client compatibility
  2. A **resource** (`curriculum://model`) — application-
     driven, with `priority: 1.0, audience: ["assistant"]` annotations
     signalling auto-injection to conforming clients

  The existing `curriculum://ontology` resource also gains these
  annotations to align with the spec.

**Affected code**:

| File | Change |
|------|--------|
| `oak-curriculum-sdk/src/mcp/aggregated-help/` | Source for tool guidance section |
| `oak-curriculum-sdk/src/mcp/ontology-data.ts` | Source for domain model section |
| `oak-curriculum-sdk/src/mcp/tool-guidance-data.ts` | Source for tips, categories |
| `oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts` | Add `get-curriculum-model` entry |
| `oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts` | Update constants to reference `get-curriculum-model` |
| `oak-curriculum-sdk/src/mcp/ontology-resource.ts` | Add `priority` and `audience` annotations |
| `oak-curriculum-sdk/src/mcp/documentation-resources.ts` | Add `get-curriculum-model` resource definition |
| `oak-curriculum-mcp-streamable-http/src/widget-cta/registry.ts` | Simplify CTA to call `get-curriculum-model` |
| `oak-curriculum-mcp-streamable-http/src/register-resources.ts` | Register new resource, update `WIDGET_DESCRIPTION` |
| `oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts` | Update "call get-ontology" references |

**Tests affected**:

| Test File | Change |
|-----------|--------|
| `server.e2e.test.ts` | Add `get-curriculum-model` to aggregated tool list |
| `universal-tools.integration.test.ts` | Add `get-curriculum-model` integration tests |
| `agent-support-tool-metadata.unit.test.ts` | Verify new tool in metadata |
| `register-resources.integration.test.ts` | Verify new resource with annotations |

**WS1 non-goals** (explicitly out of scope):

- No glossary data (WS2)
- No vocabulary restructuring (WS3)
- No deprecation of `get-help` or `get-ontology`
- No changes to the search synonym infrastructure
- No changes to the `synonyms` section of ontology data
- No `detail` parameter for selective loading

**WS1 surface alignment pass**:

When `get-curriculum-model` is added, ALL 16 guidance surfaces must be updated
to reference it as the recommended first step. The changes propagate
through the existing single-source architecture:

| Surface | How It Updates |
|---------|---------------|
| 1. `SERVER_INSTRUCTIONS` | Auto-updates: add `get-curriculum-model` to `AGENT_SUPPORT_TOOL_METADATA` with `callOrder: 0` and `callAtStart: true`. Message changes from "call these two tools" to "call get-curriculum-model for complete orientation, or get-ontology/get-help individually" |
| 2. `oakContextHint` | Auto-updates from metadata. Simplifies to "call get-curriculum-model for domain model and tool guidance" |
| 3–6. Prerequisite constants | Update `AGGREGATED_PREREQUISITE_GUIDANCE`, `FETCH_PREREQUISITE_GUIDANCE`, `DOMAIN_PREREQUISITE_GUIDANCE` to reference `get-curriculum-model` instead of `get-ontology` |
| 7. Codegen `DOMAIN_PREREQUISITE_GUIDANCE` | Update in `tool-description.ts` to reference `get-curriculum-model` |
| 8–9. get-ontology, get-help | Remain unchanged (backwards compatibility) |
| 10. `curriculum://ontology` | Add `priority` and `audience` annotations |
| 11–13. `docs://oak/*.md` | Update `docs://oak/getting-started.md` to reference `get-curriculum-model` tool; update `docs://oak/tools.md` to list `get-curriculum-model` in agent support category |
| 14. MCP prompts | Update all 5 prompt messages from "call get-ontology" to "call get-curriculum-model" |
| 15. `WIDGET_DESCRIPTION` | Update to reference `get-curriculum-model` |
| 16. CTA prompt | Simplify from multi-step ("call get-help, then all agent support tools") to single-step ("call get-curriculum-model") |

**Reference documentation**:

- **[Agent Support Tools Specification](../../reference-docs/internal/agent-support-tools-specification.md)** —
  Step-by-step checklist for adding new agent support tools, including
  all discoverability channels that must be updated. Follow this
  checklist during WS1 implementation.

**Implementation pattern** (aggregated tools):

All aggregated tools follow the same pattern. Study these as templates:
- `aggregated-ontology.ts` — simplest (no params, static data)
- `aggregated-help/` — has optional `tool_name` param (closest to
  `get-curriculum-model` which also takes optional `tool_name`)
- `aggregated-browse/` — multi-file structure with separate
  `definition.ts`, `execution.ts`, and helpers

The pattern: tool definition (description, inputSchema, annotations,
`_meta`) → execution function → registered in `application.ts`
(streamable-http app) with the other aggregated tools.

**Quality gates**: After WS1, all of the following must pass:

```bash
pnpm format:root && pnpm check && pnpm test && pnpm test:e2e
```

This is equivalent to `pnpm qg` (the full quality gate suite).

### WS2: Canonical vocabulary from the Oak glossary

Embed the official Oak glossary terms as a structured canonical
vocabulary section within the `get-curriculum-model` response.

**Source**: The Oak official glossary at
<https://open-api.thenational.academy/docs/about-oaks-data/glossary>
defines ~50 authoritative terms across three sections (Lessons, Units,
Programmes).

**The rule for consuming agents**:

1. If the user's term is in the glossary, it is correct — do not
   rewrite it.
2. If the user's term is NOT in the glossary, check synonyms for a
   mapping to the canonical term.
3. Never rewrite a glossary term into a non-glossary term.

**Design decisions (resolved)**:

- **Glossary source**: Curated list maintained in the SDK, not scraped
  from the Oak docs site. Rationale: the glossary is ~50 terms and
  changes rarely. Scraping adds a build dependency on an external site,
  fragility (HTML structure changes), and complexity for minimal gain.
  The curated list is version-controlled and reviewed.

- **Location**: New file
  `packages/sdks/oak-curriculum-sdk/src/mcp/glossary-data.ts`,
  co-located with `ontology-data.ts` and `tool-guidance-data.ts`.

- **Structure**: Array of `{ term, definition, section, aliases? }`.
  Compact, machine-readable, designed for term lookup not prose reading.

- **Include "how to use search" guidance**: A dedicated section in
  the glossary response explaining: search text = curriculum topic
  terms; key stage and subject = filters; assessment terms (GCSE, SATs)
  map to key stage filters, not search text.

**Affected code**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` —
  synonyms section (future comment at line 551)
- New `glossary-data.ts` with curated terms

### WS3: MCP vocabulary overhaul

Restructure what the MCP server exposes to agents as vocabulary
guidance. This is specifically about the **agent-facing vocabulary**
in the `get-ontology` / `get-curriculum-model` response — not about the search
synonym infrastructure.

**Important distinction**: The `synonymsData` structure in
`packages/sdks/oak-sdk-codegen/src/synonyms/` serves two fundamentally
different concerns (documented in its README):

1. **MCP vocabulary hints** — helpful context injected into the
   `get-ontology` response so agents understand how teachers and
   students talk about curriculum concepts. These are guidance, not
   precision data. Example: telling agents that "sohcahtoa" relates
   to trigonometry.
2. **Search synonyms** — a genuine, carefully curated and mined
   collection of aliases, terms, and phrases used for Elasticsearch
   query expansion. These are operational and directly affect search
   quality. They are served by `buildElasticsearchSynonyms()`,
   `buildPhraseVocabulary()`, and `buildSynonymLookup()`.

**This workstream is about concern 1 only.** The search synonym
infrastructure (concern 2) is a separate, mature system with its own
architecture, sensitivity controls, and quality pipeline. It is out
of scope for this plan.

**Current state**: The MCP vocabulary is delivered as a flat spread of
the full `synonymsData` into the ontology response. This means agents
receive the entire 500+ entry search synonym corpus as "vocabulary
hints" — far more than they need, in a structure optimised for search
expansion rather than agent comprehension.

**Target state**: The MCP vocabulary section becomes a structured
glossary that agents can reason about:

```text
term:           "key stage"
definition:     "A formal stage of education within a phase"
colloquialTerms: ["ks", "keystage"]
context:        "KS1-KS4. Use as keyStage filter parameter."
officialSource: "Oak glossary"
isGlossaryTerm: true
```

**Affected code**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` —
  synonyms consumption (changes from `...synonymsData` spread to
  curated agent vocabulary)
- New agent vocabulary data structure (location TBD)

**Not affected** (search synonym infrastructure, out of scope):

- `packages/sdks/oak-sdk-codegen/src/synonyms/` — 25 source files
- `packages/sdks/oak-sdk-codegen/src/synonym-export.ts` — transform
  utilities for ES, phrase detection, term normalisation

**Related ADRs**:

- [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) —
  SDK domain synonyms source of truth (covers both concerns)
- [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) —
  Vocab-gen graph export pattern

---

## Dependency Order

```text
WS1 (get-curriculum-model)  — IMPLEMENTED (2026-03-01)
WS2+WS3 (review checkpoint) — DEFERRED to future, pending production usage data
```

WS1 is complete. The original WS2 (canonical vocabulary) and WS3
(pedagogical term review) have been collapsed into a single future
review checkpoint. Rationale: WS1 already provides substantial
pedagogical context (entity hierarchy, UK education context, threads,
canonical URLs, search guidance). The need for additional structured
glossary data should be evaluated empirically after production usage.

See [WS2+WS3 Review Checkpoint](future/ws2-ws3-pedagogical-review-checkpoint.plan.md)
and [WS1 execution plan](ws1-get-curriculum-model.plan.md).

---

## Plan Type and Current State

This document is the **strategic brief** — it captures the problem,
research, design decisions, and implementation guidance. The executable
plan is at [ws1-get-curriculum-model.plan.md](ws1-get-curriculum-model.plan.md).

**WS1 implementation status** (2026-03-01): RED, GREEN, and REFACTOR
phases complete. Outstanding: test quality fixes (string-checking tests),
quality gates, adversarial review, documentation propagation. See the
active plan for full details and remaining todos.

---

## Interim Measure (Complete)

A tip has been added to `tool-guidance-data.ts` (the `tips` array in
the `get-help` response) providing immediate agent guidance:

- References the official Oak glossary URL
- States the three-part rule (glossary terms are authoritative,
  synonyms are mappings, never downgrade)
- Marked for migration to `get-curriculum-model` when WS1 is implemented

---

## Open Questions

1. ~~Should the glossary terms be scraped from the Oak API docs at
   sdk-codegen time, or maintained as a curated list?~~ **Resolved**:
   Curated list. ~50 terms, changes rarely, scraping adds fragility.

2. ~~What is the right payload size threshold for `get-curriculum-model`?~~
   **Resolved**: ~68KB (WS1) is ~17K tokens ≈ 13% of 128K context.
   Acceptable. Revisit if WS2/WS3 significantly increase payload.

3. ~~Should `get-curriculum-model` replace `get-help` and `get-ontology`
   entirely?~~ **Resolved**: Additive. Keep both for backwards
   compatibility. Deprecation is a separate future decision.

4. ~~Should the `get-curriculum-model` response also be exposed as an MCP
   resource?~~ **Resolved**: Yes — both tool AND resource, per the
   MCP spec's control model design. The spec defines three distinct
   controllers:

   | Primitive | Controller | Who decides |
   |-----------|-----------|-------------|
   | Tool | Model-controlled | LLM decides when to call |
   | Resource | Application-driven | Host app decides when to inject |
   | Prompt | User-controlled | User explicitly triggers |

   The `get-curriculum-model` content is essential model context. The spec's
   2025-06-18 resource annotations support exactly this use case:

   - `priority: 1.0` — "most important (effectively required)"
   - `audience: ["assistant"]` — "intended for the AI model"

   A resource with these annotations tells conforming clients:
   "auto-inject this into model context." This is the spec-intended
   mechanism for essential orientation data.

   **Implementation**: Expose `get-curriculum-model` as:
   1. A **tool** — universal compatibility (all clients support tools)
   2. A **resource** (`curriculum://model`) with
      `priority: 1.0, audience: ["assistant"]` — for clients that
      support annotation-driven auto-injection

   The tool is the pragmatic universal path. The resource is the
   spec-aligned ideal. As client implementations mature and adopt
   resource annotations, the resource becomes the primary delivery
   mechanism. This is the same dual-exposure pattern already used
   for `get-ontology` / `curriculum://ontology`, now with annotations
   that signal auto-injection intent.

   **Existing resources to update**: The current `curriculum://ontology`
   resource should also gain `priority` and `audience` annotations
   as part of WS1, aligning all orientation resources with the spec.
