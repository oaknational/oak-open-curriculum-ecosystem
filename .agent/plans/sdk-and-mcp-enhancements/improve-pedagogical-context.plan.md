# Improve Pedagogical Context

**Status**: Planning
**Last Updated**: 2026-02-28
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

## Solution

Three workstreams, each building on the previous:

### WS1: `get-started` tool

Combine `get-help` and `get-ontology` into a single `get-started` tool
that agents call once at conversation start.

**Current state**: Agents must call two tools (`get-help` for tool
guidance, `get-ontology` for domain model). The CTA prompt in
`widget-cta/registry.ts` already instructs models to call both.

**Design considerations**:

- **Payload size**: Combined payload is ~68KB (ontology ~60KB + help
  ~8KB). Evaluate whether selective loading via a `detail` parameter
  is needed, or whether a single complete response is acceptable.
- **Tip migration**: Current `tips` array in `tool-guidance-data.ts`
  migrates into `get-started`, giving all practical guidance a single
  home.
- **Backwards compatibility**: Keep `get-help` and `get-ontology`
  available for clients that already use them. `get-started` is
  additive.

**Affected code**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/` —
  current get-help implementation
- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` —
  current ontology data
- `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts` —
  tips array, tool categories
- `apps/oak-curriculum-mcp-streamable-http/src/widget-cta/registry.ts` —
  CTA prompt referencing both tools

### WS2: Canonical vocabulary from the Oak glossary

Embed the official Oak glossary terms as a structured canonical
vocabulary section within the `get-started` response.

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

**Design considerations**:

- Embed glossary terms as a structured list with `term`, `definition`,
  and `section` (lessons/units/programmes). Keep it concise — agents
  need to check terms against it, not read prose.
- Include the "how to use search" agent guidance as a section:
  search text should use curriculum topic terms; key stage and subject
  are filters; assessment terms like "GCSE" and "SATs" map to
  key stage filters, not search text.
- The ontology code already has a `FUTURE` comment
  (`ontology-data.ts:551`) about replacing synonyms with a glossary
  structure — this workstream realises that direction.

**Affected code**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` —
  synonyms section and FUTURE comment
- New glossary data structure (location TBD — likely
  `packages/sdks/oak-sdk-codegen/src/glossary/` or within ontology)

### WS3: MCP vocabulary overhaul

Restructure what the MCP server exposes to agents as vocabulary
guidance. This is specifically about the **agent-facing vocabulary**
in the `get-ontology` / `get-started` response — not about the search
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

**Design considerations**:

- The MCP vocabulary should be curated for agent comprehension, not
  exhaustive for search expansion. Agents do not need every synonym
  that Elasticsearch needs.
- The search synonym infrastructure (`synonyms/`, `synonym-export.ts`,
  `buildElasticsearchSynonyms()`, etc.) is unaffected. It continues
  to serve Elasticsearch, phrase detection, and term normalisation
  from the same source files.
- The ontology's `synonyms` section stops spreading `synonymsData`
  directly and instead consumes a purpose-built agent vocabulary
  structure.
- Sensitivity notes for RE, RSHE/PSHE, and citizenship apply to
  both concerns and must be preserved in both.

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

## Dependency Order

```text
WS1 (get-started tool) — can proceed independently
WS2 (canonical vocabulary) — depends on WS1 for delivery surface
WS3 (MCP vocabulary overhaul) — depends on WS2 for glossary term list
```

WS1 and WS2 can be delivered together. WS3 decouples the MCP
agent vocabulary from the search synonym infrastructure — a cleaner
separation that benefits both concerns.

## Interim Measure (Complete)

A tip has been added to `tool-guidance-data.ts` (the `tips` array in
the `get-help` response) providing immediate agent guidance:

- References the official Oak glossary URL
- States the three-part rule (glossary terms are authoritative,
  synonyms are mappings, never downgrade)
- Marked for migration to `get-started` when WS1 is implemented

## Open Questions

1. Should the glossary terms be scraped from the Oak API docs at
   sdk-codegen time, or maintained as a curated list? Scraping is
   more maintainable but adds a build dependency on the docs site.
2. What is the right payload size threshold for `get-started`? Some
   MCP clients may have context limits.
3. Should `get-started` replace `get-help` and `get-ontology`
   entirely, or remain a convenience wrapper? Current plan says
   additive (keep both).
