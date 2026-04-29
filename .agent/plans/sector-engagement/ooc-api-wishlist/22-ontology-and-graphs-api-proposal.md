# Ontology and Graphs API Proposal

**Created**: 2026-02-04  
**Status**: 📋 Proposal  
**Priority**: High — Foundational for agent experience

---

## Vision

Move ontology, property graph, and derived graph data upstream to the Open Curriculum API. This:

1. **Centralises the source of truth** — Ontology maintained alongside the curriculum it describes
2. **Eliminates local bulk processing** — Consumers get pre-computed graphs from API
3. **Ensures consistency** — All API consumers see the same ontology version
4. **Enables versioning** — Clear contract for cache invalidation

---

## Proposed API Structure

### Agent Endpoints

| Endpoint | Content | Current Location |
|----------|---------|------------------|
| `GET /agent/ontology` | Combined ontology + property graph | `ontology-data.ts` + `knowledge-graph-data.ts` |
| `GET /agent/api-guidance` | Tool workflows, structural patterns, traversal guidance | `tool-guidance-data.ts` + `ontologyData.structuralPatterns` |

### Graph Endpoints (Derived from Bulk Data)

| Endpoint | Content | Size | Current Location |
|----------|---------|------|------------------|
| `GET /graphs/vocabulary` | Term definitions with cross-subject coverage | 13,349 terms | `vocabulary-graph-data.ts` |
| `GET /graphs/prerequisites` | Unit dependency edges | 3,408 edges | `prerequisite-graph-data.ts` |
| `GET /graphs/progressions` | Thread-ordered unit sequences | 164 threads | `thread-progression-data.ts` |
| `GET /graphs/misconceptions` | Common mistakes + teacher responses | 12,777 items | `misconception-graph-data.ts` |
| `GET /graphs/curriculum-coverage` | NC statement → unit mappings | 7,454 statements | `nc-coverage-graph-data.ts` |

### Query Parameters (All Graphs)

```text
?subject={subjectSlug}      — Filter by subject
?key_stage={ks1|ks2|ks3|ks4} — Filter by key stage
?version={semver}           — Request specific version
?format={json|jsonld}       — Response format
```

---

## Current State Analysis

### What Exists

#### 1. Ontology (`ontology-data.ts`)

Rich domain model including:

- Key stages, phases, subjects with definitions
- Entity hierarchy (Subject → Sequence → Unit → Lesson)
- KS4 complexity (tiers, exam boards, exam subjects, pathways)
- Structural patterns (7 patterns with detection guidance)
- UK education context
- Canonical URL patterns
- Synonyms (see note below)

#### 2. Property Graph (`knowledge-graph-data.ts`)

Schema-level concept relationships:

- ~28 concept nodes categorised (structure, content, context, taxonomy, ks4, metadata)
- ~45 edges with explicit/inferred marking
- Relationship types (hasSequences, containsUnits, belongsTo, etc.)

**Key insight**: The property graph is essentially a distilled graph view of relationships described narratively in the ontology. Consider merging into a single unified structure.

#### 3. Instance-Level Graphs (Generated from Bulk Data)

| Graph | Generator | Output |
|-------|-----------|--------|
| Vocabulary | `vocabulary-graph-generator.ts` | `vocabulary-graph-data.ts` |
| Prerequisites | `prerequisite-graph-generator.ts` | `prerequisite-graph-data.ts` |
| Thread Progressions | `thread-progression-generator.ts` | `thread-progression-data.ts` |
| Misconceptions | `misconception-graph-generator.ts` | `misconception-graph-data.ts` |
| NC Coverage | `nc-coverage-generator.ts` | `nc-coverage-graph-data.ts` |

---

## Issues with Current Approach

### 1. Synonyms Confusion

The `synonyms` section in `ontology-data.ts` conflates two different purposes:

1. **Term normalisation** — "PE" → "physical-education" (for search expansion)
2. **Domain glossary** — Definitions of curriculum terms (for understanding)

**Problem**: LLMs don't need synonym expansion — they handle linguistic variation naturally. What they need is:

- **Domain-specific definitions** — What does "tier" mean in UK education?
- **Official terminology** — What's the canonical name for this concept?
- **Aliases** — What are alternative names humans might use?

**Recommendation**:

- Remove synonyms from ontology (search app handles its own expansion)
- Replace with a **glossary** structure:

```typescript
glossary: {
  tier: {
    definition: 'Difficulty level for GCSE courses (foundation or higher)',
    aliases: ['GCSE tier', 'exam tier'],
    context: 'KS4 sciences and maths only',
    officialSource: 'https://open-api.thenational.academy/docs/about-oaks-data/glossary',
  },
  // ...
}
```

### 2. Property Graph Redundancy

The property graph duplicates information that's already in the ontology, just in a different format:

| Ontology | Property Graph |
|----------|----------------|
| `entityHierarchy.levels` | `concepts` array |
| `ks4Complexity.programmeFactors` | KS4 category nodes |
| Prose describing relationships | `edges` array |

**Recommendation**: Either:

a) **Merge** — One unified structure with both narrative and graph representations
b) **Generate** — Property graph auto-generated from ontology at build time

### 3. KS4 Gaps

DATA-VARIANCES.md documents KS4 complexities not captured in ontology/property graph:

| Variance | DATA-VARIANCES.md | Ontology/Graph |
|----------|-------------------|----------------|
| Many-to-many (Lesson → Tiers) | Section 10 | ❌ Missing |
| Null handling (`"NULL"` vs `null`) | Section 12 | ❌ Missing |
| Year type variations | Section 12 | ❌ Missing |
| Pattern combinations | Section 3 | ✅ Covered |
| Bulk duplicate causes | Section 7 | ❌ Missing |

**Recommendation**: Add `dataQuirks` section to ontology documenting these edge cases.

### 4. Manual Generation

Instance-level graphs are generated by running scripts locally:

```bash
cd packages/sdks/oak-curriculum-sdk
pnpm generate:graphs  # Reads from reference/bulk_download_data/
```

**Recommendation**: Pre-compute at API build time and serve via `/graphs/*` endpoints.

---

## Proposed Unified Ontology Structure

```typescript
interface OakOntology {
  version: string;
  generatedAt: string;
  
  // What the curriculum contains
  domain: {
    keyStages: KeyStageDefinition[];
    phases: PhaseDefinition[];
    subjects: SubjectDefinition[];
  };
  
  // How entities relate (the property graph, embedded)
  schema: {
    entities: EntityDefinition[];
    relationships: RelationshipDefinition[];
  };
  
  // How to navigate the API
  navigation: {
    structuralPatterns: StructuralPattern[];
    traversalGuidance: TraversalGuide[];
    canonicalUrls: UrlPatterns;
  };
  
  // Domain vocabulary (replaces synonyms)
  glossary: {
    [term: string]: GlossaryEntry;
  };
  
  // Known data quirks (from DATA-VARIANCES)
  dataQuirks: {
    nullHandling: NullHandlingQuirk[];
    typeVariations: TypeVariation[];
    duplicateCauses: DuplicateCause[];
  };
  
  // Cross-references
  relatedResources: {
    officialDocs: string;
    apiReference: string;
    graphEndpoints: string[];
  };
}
```

---

## Migration Path

### Phase 1: SDK Consolidation

1. Merge property graph into ontology-data.ts
2. Replace synonyms with glossary structure
3. Add dataQuirks section from DATA-VARIANCES.md
4. Update comments to clarify purpose of each section

### Phase 2: API Proposal to Upstream

1. Document proposed `/agent/*` and `/graphs/*` endpoints
2. Specify response schemas
3. Propose versioning strategy
4. Submit to Oak API team

### Phase 3: Consumer Migration

1. SDK fetches ontology from API (with local fallback)
2. MCP tools use API-sourced ontology
3. Search app uses API-sourced graphs
4. Remove local generation (keep for development/testing)

---

## Open Questions

1. **Versioning**: Semantic versioning? Timestamp-based? Content hash?
2. **Caching**: CDN caching with ETags? Client-side TTL?
3. **Size limits**: Vocabulary graph is ~13K nodes. Pagination? Streaming?
4. **Authentication**: Public or authenticated endpoints?
5. **Rate limits**: Separate limits for ontology vs data endpoints?
6. **Relationship to bulk download**: Does this replace bulk download for some use cases?

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [DATA-VARIANCES.md](../../../../docs/domain/DATA-VARIANCES.md) | Documents data quirks to capture |
| [curriculum-ontology.md](../../../research/curriculum-ontology.md) | Research on ontology structure |
| [ontology-data.ts](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) | Current ontology implementation |
| [property-graph-data.ts](../../../../packages/sdks/oak-sdk-codegen/src/mcp/property-graph-data.ts) | Current property graph |
| [00-overview-and-known-issues.md](00-overview-and-known-issues.md) | API issues to consider |
