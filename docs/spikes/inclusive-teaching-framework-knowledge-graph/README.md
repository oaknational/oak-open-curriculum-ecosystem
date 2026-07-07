# Spike: PDF → knowledge graph — the Inclusive Teaching Framework

**Status**: draft spike — candidate data source. **Do not merge yet**: the
proper integration happens in a dedicated Claude Code CLI pass (see
[NOTES.md](./NOTES.md) §Integration checklist).
**Date**: 2026-07-07
**Source document**: [Inclusive Teaching Framework](https://www.ambition.org.uk/inclusive-teaching-framework/)
(Gilbride, N., & Jackson, J., Ambition Institute, March 2026). The PDF itself
is deliberately **not** committed to this repository.

> **TypeScript ruling (owner, 2026-07-07)**: all official repository code
> must be TypeScript, not JavaScript. The `.mjs` files here are a sanctioned
> knowledge-preservation exception for this spike only; the integration pass
> promotes them to typed, tested workspace modules.

## What this is

An experiment in extracting the subject knowledge from a published education
framework PDF and expressing it as a knowledge graph in the same design
grammar as this repository's graph corpus (the one `vocab-gen` generates from
the bulk download data): kind-qualified node ids, a discriminated union of
node kinds, a small typed directed-edge vocabulary, and an envelope with
recomputed stats.

The Inclusive Teaching Framework sets out, for teacher educators, the
essential knowledge teachers need to meet a wider range of pupils' needs in
mainstream classrooms, organised into five areas of need: speech and
language, sensory, motor, executive function, and social and emotional
development.

## Files

| File                                               | Contents                                                                                                                                                                |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`data.json`](./data.json)                         | Corpus envelope: `version`, `generatedAt`, `source`, recomputed `stats`, `nodes[]`, `edges[]` — the shape analogue of the generated graph corpus `data.json`            |
| [`data.jsonl`](./data.jsonl)                       | Line-oriented rendering: one meta line, then one record per node and per edge (`{"record": "meta" \| "node" \| "edge", …}`), payloads identical to the envelope entries |
| [`schema.json`](./schema.json)                     | JSON Schema (draft 2020-12). The root validates `data.json`; `#/$defs/jsonlRecord` validates each `data.jsonl` line                                                     |
| [`graph.svg`](./graph.svg)                         | Proof-of-concept visualisation: deterministic layered layout, accessible labels, reference pills hyperlink to their external sources                                    |
| [`build-itf-graph.mjs`](./build-itf-graph.mjs)     | Generator: extracted content as typed literals; recomputes stats; fails on integrity violations; emits the three data files                                             |
| [`render-itf-svg.mjs`](./render-itf-svg.mjs)       | SVG renderer: five-column layered layout with barycentre ordering                                                                                                       |
| [`crossref-lookup.mjs`](./crossref-lookup.mjs)     | One-off provenance tooling: resolves citations to DOIs via the Crossref API (evidence, not build input)                                                                 |
| [`crossref-results.json`](./crossref-results.json) | Raw Crossref lookup evidence behind the curated external-source table                                                                                                   |
| [`NOTES.md`](./NOTES.md)                           | Working notes: observations, insights, approaches, rejected alternatives, tooling frictions, integration checklist                                                      |

## Graph shape

184 nodes, 282 edges.

Node kinds (all ids kind-qualified, e.g. `concept:working-memory`):

- `framework` (1) — the document as the root entity
- `area` (5) — the five areas of pupil need, with condensed summaries
- `idea` (12) — the per-area "underpinning ideas"
- `insight` (23) — the per-area "key insights" with their explanations
- `concept` (35) — named constructs, practices, approaches, policy terms and
  diagnoses the text defines or invokes, each with the document's own
  description and a `category`
- `reference` (49) — verbatim bibliographic citations with year
- `organisation` (5) — author-publisher plus the four specialist partners
- `principle` (4) — the methodology principles, including the evidence filters
- `externalSource` (50) — terminal link nodes (see below)

Edge vocabulary (15 types): structural containment (`containsArea`,
`containsIdea`, `containsInsight`, `citesReference`, `guidedBy`, `authoredBy`,
`inPartnershipWith`), topical (`involvesConcept`, `overlapsWith`), semantic
concept-to-concept relations stated in the text (`reliesOn`, `partOf`,
`precedes`, `supports`, `relatedTo`), and `availableAt` for external links.

### External sources: link out, don't ingest

Every `reference` (and the framework itself) has an `availableAt` edge to a
terminal `externalSource` node carrying a `url`, a `label`, and a
`resolution` marker that encodes provenance quality:

- `doi` (46) — a `https://doi.org/…` resolver URL from a Crossref match
- `publisher` (3) — a hand-verified canonical publisher page (a gov.uk
  research report, an EEF evidence review, a Harvard working paper)
- `search` (1) — a Google Scholar search URL where no stable canonical page
  exists (a book)

Nothing beyond the original document is processed into the graph; the link
nodes make the references explorable without expanding the corpus boundary.

## Method

1. **Text extraction.** `pdftotext -layout` over the 47-page PDF produced a
   clean text layer (~79 KB). The five area divider pages carry their
   specialist-partner attribution only as logo images, so those five pages
   were read visually to attribute `inPartnershipWith` edges correctly
   (Speech and Language UK; RCOT for both sensory and motor; NAPEP; The
   Difference).
2. **Manual structured extraction.** The document's regular structure
   (per area: summary → underpinning ideas → numbered key insights → sample
   of references) was transcribed into typed literals in a generator script.
   Concepts were collected wherever the text names and defines a construct;
   concept-to-concept edges were added only where the text states the
   relation (e.g. "cognitive flexibility … relies on working memory and
   inhibitory control").
3. **Reference resolution.** Each citation was resolved via the Crossref API
   (`query.bibliographic`), and every match was reviewed against the
   citation's author, title and year before acceptance; mismatches and
   no-matches were resolved by hand to verified publisher pages, or to a
   scholar-search URL for the one book. The resolved links were embedded in
   the generator as curated data, so builds stay offline and deterministic.
4. **Generation and validation.** A dependency-free Node ESM generator emits
   `data.json`, `data.jsonl` and `schema.json`, recomputing stats and failing
   the build on unresolved edge endpoints, duplicate ids or edges,
   self-loops, or ids that are not kind-qualified. Both outputs were
   additionally validated with ajv (`--spec=draft2020`) against
   `schema.json`. A second script renders `graph.svg` with a deterministic
   layered layout (framework → areas → ideas/insights → concepts →
   references) using barycentre ordering to reduce edge crossings.

The generator, renderer, and Crossref lookup script live alongside this
document (preservation copies — see the TypeScript ruling above), together
with the raw Crossref review evidence. From this directory,
`node build-itf-graph.mjs` then `node render-itf-svg.mjs` reproduces every
artefact deterministically (only `generatedAt` varies).

### Modelling decisions

- **Text-grounded only.** Every node and edge is grounded in a statement in
  the document; no relations were inferred beyond what the text says.
  References attach at **area** level because the document cites them per
  area ("Sample of references"), not per insight.
- **People are not modelled as nodes.** Named individuals (authors,
  acknowledgements, per-area contributors) are excluded; published
  bibliographic citations are kept verbatim as `reference` nodes.
- **Normalisations** (both flagged, both source typos): "predicable" →
  "predictable" in sensory insight 1's title; the Dockrell et al. (2012)
  citation reads "RR227" but the actual DfE report is DFE-RR247-BCRP4 (the
  citation string is kept verbatim; the external source links to the real
  report).

## Relationship to the graph corpus

The generated graph corpus
(`packages/sdks/oak-sdk-codegen/src/generated/vocab/graph-corpus/`) is the
design reference: this spike mirrors its kind-qualified ids, discriminated
node union, `{source, type, target}` edge shape, and stats envelope, and adds
two renderings the corpus does not have (JSONL lines and a JSON Schema — the
schema plays the role `graph-corpus-types.ts` plays for the corpus). If the
data source graduates, the natural consumption pattern is the anchored,
bounded view approach in `graph-corpus-sdk` (ADR-173, ADR-195).

## Licensing and acknowledgement

Owner ruling (2026-07-07): **assume academic rules for now** — the purpose of
the data is reuse — with proper acknowledgement of the authors and Ambition
Institute. Accordingly:

- The acknowledgement is carried **in the data itself**: `source.attribution`
  and `source.licenceNote` in `data.json` (and the `data.jsonl` meta line)
  credit the authors, Ambition Institute, and the four specialist partner
  organisations.
- The graph embeds condensed and verbatim text derived from the Inclusive
  Teaching Framework, © Ambition Institute 2026 (registered charity 1146924),
  which is freely distributed but not openly licensed. This spike claims no
  licence over the derived content, and the dataset is **excluded** from this
  repository's data-licence grant.

### Acknowledgements

The Inclusive Teaching Framework was authored by Dr Neil Gilbride and John
Jackson and published by Ambition Institute in March 2026, developed in
partnership with the National Association of Principal Educational
Psychologists, the Royal College of Occupational Therapists, Speech and
Language UK, and The Difference. This spike is a derived, structured
re-expression of that work for research and learning; all substantive
knowledge in the graph is theirs.

## Open questions

1. **Generator promotion.** The `.mjs` preservation copies must be promoted
   to a typed, tested TypeScript workspace module at the integration pass
   (per ADR-168 and the TypeScript-only rule); the copies here are then
   deleted in the same change.
2. **Insight-level citations.** The document cites references per area;
   attaching them to individual insights would need inference beyond the
   text, so it was deliberately not done here. If wanted later, mark it as
   inference explicitly (see [NOTES.md](./NOTES.md)).
