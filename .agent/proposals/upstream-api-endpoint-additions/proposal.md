# Proposal: Ontology and Foundation Graphs API Endpoints

**Date**: 2026-02-04  
**Status**: Draft for discussion  
**Audience**: Open Curriculum API team

---

## Executive Summary

We propose adding new API endpoints to serve:

1. **Curriculum Ontology** — A unified domain model describing Oak's curriculum structure
2. **Foundation Graphs** — Pre-computed basic property graph data derived from bulk curriculum content
3. **Enum List** — All valid enum values in a single response for filtering and validation

These endpoints benefit AI agents, search applications, and any consumer needing to understand or navigate curriculum structure.

---

## Problem Statement

| Issue | Impact |
|-------|--------|
| Domain knowledge scattered across prose docs | Not machine-readable |
| KS4 complexity poorly documented | Agents fail to retrieve science content |
| No authoritative enum lists | Consumers hard-code values that drift |
| Graph derivation requires bulk processing | Each consumer duplicates expensive work |

---

## Proposed Endpoints

### 1. Agent Ontology

```text
GET /agent/ontology
```

Returns unified JSON containing domain structure, entity schema, KS4 complexity, navigation patterns, and glossary. See `ontology.json` for complete format.

| Parameter | Type | Description |
|-----------|------|-------------|
| `version` | string | Specific ontology version (default: latest) |
| `section` | string | Return only one section (domain, schema, navigation, etc.) |
| `format` | string | `json` (default) or `jsonld` |

### 2. Foundation Graphs

Pre-computed graph data derived from bulk curriculum content.

| Endpoint | Content | Scale |
|----------|---------|-------|
| `GET /graphs/vocabulary` | Curriculum terms with definitions | 13K+ terms |
| `GET /graphs/prerequisites` | Unit dependencies | 3.4K edges |
| `GET /graphs/progressions` | Thread unit sequences | 164 threads |
| `GET /graphs/misconceptions` | Common errors with responses | 12K+ items |
| `GET /graphs/curriculum-coverage` | NC statement mappings | 7.4K+ statements |

All graphs support `?subject=` and `?key_stage=` filters. See `examples/graph-response-example.json` for response format.

### 3. Enum List

```text
GET /enums
```

A single endpoint returning all enum values in one response. See `enums.json` for the complete format.

Includes: subjects, key stages, years, phases, tiers, exam boards, exam subjects, asset types.

---

## Relationship to Existing Endpoints

These **complement** existing endpoints:

| Existing | New | Relationship |
|----------|-----|--------------|
| `/subjects` | `/enums` | Simpler list (just slugs), no sequence detail |
| `/threads` | `/graphs/progressions` | Adds ordered unit sequences |
| Bulk download | `/graphs/*` | Pre-computed derivations |

Foundation graphs are derived from bulk data at build/deploy time.

---

## Technical Considerations

### Caching

- Semantic versioning (major.minor.patch)
- ETag headers for cache validation
- Long TTL with stale-while-revalidate

### Sizes (Estimated, Gzipped)

| Endpoint | Size |
|----------|------|
| `/agent/ontology` | ~8KB |
| `/graphs/vocabulary` | ~300KB |
| `/graphs/misconceptions` | ~400KB |
| `/enums` | ~2KB |

### Authentication

Recommend **public** (no auth) — data already public via bulk download, agents need low-friction access, caching more effective.

---

## OpenAPI Schema vs Ontology

When enriching curriculum metadata, information should go where it belongs.

| Concern | OpenAPI Schema | Ontology |
|---------|----------------|----------|
| **Purpose** | API contract, validation | Domain understanding, navigation |
| **Audience** | SDK generators, validators | AI agents, search systems |
| **Question answered** | "What values are valid?" | "What does this mean?" |

### Current OpenAPI Gaps

| Field | Status |
|-------|--------|
| `info.description` | Missing |
| `info.summary` | Missing |
| `tags[].description` | Missing |
| `x-*` extensions | None used |

### Proposed OpenAPI Improvements

1. **Add API-level context** — See `examples/openapi-info-example.yaml`
2. **Add tag descriptions** — See `examples/openapi-tags-example.yaml`
3. **Add `x-oak-*` extensions** — See `examples/openapi-extensions-example.yaml`
4. **Define missing enums** — See `examples/openapi-enums-example.yaml`

OpenAPI 3.1 supports [Specification Extensions](https://spec.openapis.org/oas/v3.1.2#specification-extensions) (`x-*` fields). Similar to [Zod's `.meta()` method](https://zod.dev/metadata#meta), these attach guidance to schema elements.

> **Note**: In Zod 4, [`.describe()` is deprecated](https://zod.dev/metadata#describe) in favour of `.meta({ description: "..." })`.

### Missing Enums to Add

| Field | Proposed Values |
|-------|-----------------|
| `tierSlug` | `["foundation", "higher"]` |
| `examBoardSlug` | `["aqa", "edexcel", "edexcelb", "eduqas", "ocr"]` |
| `examSubjectSlug` | `["biology", "chemistry", "physics", "combined-science"]` |
| `phaseSlug` | `["primary", "secondary"]` |
| `ks4Options.slug` | `["core", "gcse"]` (if formally defined) |

### What Belongs Where

| Metadata | OpenAPI | Ontology |
|----------|---------|----------|
| Enum values, titles, descriptions | ✅ | - |
| Type warnings | ✅ | - |
| Age ranges, UK context | - | ✅ |
| Year → Key Stage mapping | - | ✅ |
| Subject → Exam Board coverage | - | ✅ |
| Gap notes ("No KS1") | - | ✅ |
| Navigation/traversal guidance | - | ✅ |

See `examples/ontology-domain-example.json` and `examples/ontology-navigation-example.json`.

---

## Open Questions

1. **Endpoint naming**: Is `/agent/*` the right prefix? Alternatives: `/meta/*`, `/curriculum/*`
2. **Graph filtering**: Support complex filters (e.g., "prerequisites within maths KS3-4")?
3. **Streaming**: For large graphs, support streaming/pagination?
4. **ks4Options**: Should "core"/"gcse" be formally defined as an enum?

---

## Appendices

### A. Current SDK Implementation

The SDK maintains local versions of this data that would be **replaced by API calls**:

- `ontology-data.ts` — 580 lines
- `knowledge-graph-data.ts` — 320 lines
- Generated graphs — vocabulary (13K), prerequisites (3K), progressions (164), misconceptions (12K), NC coverage (7K)

### B. Related Documents

- [Data Variances](../../../../docs/data/DATA-VARIANCES.md)
- [Official Glossary](https://open-api.thenational.academy/docs/about-oaks-data/glossary)
- [Ontology Diagrams](https://open-api.thenational.academy/docs/about-oaks-data/ontology-diagrams)

### C. Files in This Proposal

| File | Purpose |
|------|---------|
| `ontology.json` | Complete ontology response format |
| `enums.json` | Simple enum value lists |
| `proposal.md` | This document |
| `examples/` | YAML/JSON examples referenced above |
