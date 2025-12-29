# Knowledge Graph Integration: From Property Graph to True Knowledge Graph

**Created**: 2025-12-26  
**Context**: Reflection on bulk data mining and pre-existing resources  
**Status**: 🔬 RESEARCH — Strategic direction

---

## The Core Insight

What we currently call a "knowledge graph" (`knowledge-graph-data.ts`) is actually a **property graph** — it defines **types and relationships**, but contains **no instances**.

```typescript
// Current: Property Graph (schema-level)
{ id: 'keyword', label: 'Keyword', brief: 'Critical vocabulary for the lesson', category: 'metadata' }
{ from: 'lesson', to: 'keyword', rel: 'hasKeywords' }

// Missing: Instance data (the actual keywords)
// "photosynthesis" is a keyword, used in lesson "ks3-biology-plants-1"
```

**The bulk mining extracted the instances.** If we connect them to the property graph definitions, we create a **true knowledge graph** — with both schema AND data.

---

## Current State: Disconnected Assets

| Asset | What It Contains | Connected? |
|-------|------------------|------------|
| `knowledge-graph-data.ts` | 28 concept types, 45 edges | Schema only |
| `ontology-data.ts` | Key stages, subjects, threads, synonyms | Reference data |
| `vocabulary-graph-data.ts` | 13,349 keyword instances | ❌ Not linked to schema |
| `misconception-graph-data.ts` | 12,777 misconception instances | ❌ Not linked to schema |
| `prerequisite-graph-data.ts` | 3,408 prerequisite edges | ⚠️ Partially linked (unit→unit) |
| `nc-coverage-graph-data.ts` | NC statement instances | ❌ Not linked to schema |
| API Schema | Field definitions | Not exploited for extraction validation |

---

## The Opportunity: True Knowledge Graph

### What It Would Enable

| Capability | Current | With True KG |
|------------|---------|--------------|
| **"What keywords does this lesson teach?"** | Manual lookup | Graph query |
| **"Which lessons address this misconception?"** | Search | Direct edge traversal |
| **"What concepts lead to this one?"** | Prerequisite graph only | Multi-hop reasoning |
| **"Is 'photosynthesis' a curriculum keyword?"** | Check extracted list | Type-validated query |
| **"Show all vocabulary for Year 5 maths"** | Filter vocabulary graph | Contextual graph slice |

### Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRUE CURRICULUM KNOWLEDGE GRAPH                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SCHEMA LAYER (current knowledge-graph-data.ts)                     │
│  ────────────────────────────────────────────────                   │
│  • Concept types: Subject, Unit, Lesson, Keyword, Misconception...  │
│  • Relationship types: hasKeywords, addressesMisconceptions...      │
│                                                                      │
│                              ↓ instantiatedBy                        │
│                                                                      │
│  INSTANCE LAYER (from bulk mining)                                  │
│  ─────────────────────────────────                                  │
│  • Keywords: "photosynthesis", "adjective", "fraction"...           │
│  • Misconceptions: "Students think denominator is bigger"...        │
│  • Lessons: "ks3-biology-plants-1", "ks2-english-adjectives"...     │
│  • Edges: lesson-X → hasKeyword → "photosynthesis"                  │
│                                                                      │
│                              ↓ enables                               │
│                                                                      │
│  QUERY CAPABILITIES                                                  │
│  ──────────────────                                                 │
│  • Graph traversal: "What leads to trigonometry?"                   │
│  • Type validation: "Is this a valid keyword?"                      │
│  • Context slicing: "All KS2 maths vocabulary"                      │
│  • Relationship discovery: "Which concepts are related?"            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## How to Connect: Practical Steps

### Step 1: Validate Extracted Types Against Schema

The knowledge graph defines `keyword`, `misconception`, `priorknowledge`, etc. as concept types.

**Validation question**: Does every extracted entity type map to a known schema concept?

```typescript
// In vocab-gen, before writing output:
const VALID_ENTITY_TYPES = conceptGraph.concepts.map(c => c.id);

function validateEntityType(extracted: string): boolean {
  return VALID_ENTITY_TYPES.includes(extracted);
}
```

### Step 2: Generate Instance Edges

Currently, `vocabulary-graph-data.ts` has keywords with `lessonSlugs`. This IS an edge relationship:

```typescript
// Current (implicit):
{ term: "photosynthesis", lessonSlugs: ["ks3-biology-plants-1", "ks4-science-photosynthesis"] }

// Explicit graph edge:
{ from: "lesson:ks3-biology-plants-1", to: "keyword:photosynthesis", rel: "hasKeywords" }
```

### Step 3: Unified Graph Export

Create a unified export that combines schema and instances:

```typescript
export const curriculumKnowledgeGraph = {
  // Schema (from knowledge-graph-data.ts)
  schema: {
    concepts: conceptGraph.concepts,
    relationships: conceptGraph.edges.filter(e => !e.inferred),
  },
  
  // Instances (from bulk mining)
  instances: {
    keywords: vocabularyGraph.keywords,
    misconceptions: misconceptionGraph.misconceptions,
    prerequisites: prerequisiteGraph.edges,
    // ...
  },
  
  // Instance edges (derived from instance data)
  edges: [
    // Generated from vocabularyGraph.keywords[].lessonSlugs
    ...generateKeywordEdges(vocabularyGraph),
    // Generated from misconceptionGraph.misconceptions[].lessonSlug
    ...generateMisconceptionEdges(misconceptionGraph),
  ],
} as const;
```

---

## Weighting Function: Frequency vs Impact

### The Problem with Frequency Alone

| Term | Frequency | Is It Useful? |
|------|-----------|---------------|
| "the" | Very high | ❌ No (stop word) |
| "and" | Very high | ❌ No (stop word) |
| "adjective" | 212 | ✅ Yes (core vocabulary) |
| "ornithology" | 1-2 | ✅ Yes (examinable, needs synonym) |

**Frequency alone promotes noise over signal.**

### A Better Weighting Function

```
Value = (Frequency / StopWordPenalty) × FoundationBonus × ExaminabilityBonus × SynonymNeed

Where:
- StopWordPenalty: 0.01 for stop words, 1 otherwise
- FoundationBonus: 1 + (1/Year) — earlier years = more foundational
- ExaminabilityBonus: 2 for exam-board tagged content, 1 otherwise
- SynonymNeed: 2 if term has obvious plain-English alternative, 1 otherwise
```

### For Synonym Prioritization Specifically

```
SynonymValue = Frequency × (1 + 1/Year) × (1 + 0.2*(subjects-1)) × (2 if needs_plain_english else 1)

Where:
- Frequency: How often the term appears
- Foundation Bonus: Earlier terms are more foundational
- Cross-Subject Bonus: Terms in multiple subjects have broader search
- Plain English Need: Does the term have an obvious alternative teachers use?
```

**Example**:
- `adjective` (freq 212, year 1, 4 subjects, needs "describing word") = 212 × 2 × 1.6 × 2 = **1,357**
- `ornithology` (freq 2, year 10, 1 subject, needs "study of birds") = 2 × 1.1 × 1 × 2 = **4.4**

Both are valuable, but for different reasons. The function surfaces both.

---

## Transcript Mining: Untapped Opportunity

### Current State

```typescript
// In lesson-schema.ts — we capture but don't extract:
transcript_sentences: z.string().optional(),
transcript_vtt: z.string().optional(),
```

**We have transcripts but we're not mining them.**

### What Transcripts Contain

- **Spoken vocabulary**: How teachers actually say things
- **Explanations**: "This is also called..." patterns
- **Examples**: Contextual usage of terms
- **Timestamps**: When concepts are introduced in video

### Mining Opportunities

| Pattern | Example | What We'd Get |
|---------|---------|---------------|
| "Also called" | "This is photosynthesis, also called plant energy production" | Synonym |
| "Another word for" | "Another word for subtract is take away" | Synonym |
| "Remember, X means" | "Remember, denominator means the bottom number" | Plain English synonym |
| Repeated emphasis | Term spoken 5+ times in lesson | Importance signal |
| "Don't confuse X with Y" | "Don't confuse perimeter with area" | Misconception |

### Technical Approach

```typescript
// New extractor: transcript-vocabulary-extractor.ts
function extractTranscriptVocabulary(transcript: string): ExtractedTranscriptTerm[] {
  // Pattern matching for "also called", "another word for", etc.
  // OR: Send to LLM for semantic extraction (preferred)
}
```

**Same lesson as definitions**: Regex will find patterns but not understand meaning. LLM extraction would be more effective.

---

## Integration with Existing Resources

### What We Should Be Using

| Resource | What It Provides | How We Should Use It |
|----------|------------------|---------------------|
| `knowledge-graph-data.ts` | Entity types, relationship types | Validate extracted entities |
| `ontology-data.ts` | Subjects, key stages, threads | Authoritative reference lists |
| API Schema | Field definitions | Validate extracted field names |
| Existing synonyms (163) | Known vocabulary gaps | Don't re-mine what's already curated |

### What We're Missing

1. **Pre-extraction validation**: Check extracted types against schema before saving
2. **Cross-reference with existing synonyms**: Skip terms already covered
3. **API schema alignment**: Ensure extracted field names match OpenAPI spec
4. **Thread/subject validation**: Use ontology as authoritative source

---

## Emergent Opportunities

### 1. Curriculum Concept Graph for Search

If we have a true knowledge graph with instances:

```
User query: "photosynthesis"
→ Find keyword node: "photosynthesis"  
→ Traverse: hasKeywords ← Lesson
→ Return: All lessons teaching this concept
→ Also traverse: relatedTo → other keywords
→ Return: Related concepts for query expansion
```

**This is semantic search at the graph level**, not just text matching.

### 2. Learning Path Generation

```
User query: "How do I learn about quadratic equations?"
→ Find concept: "quadratic-equations"
→ Traverse: prerequisiteFor ← reverse
→ Build path: linear equations → solving for x → quadratics
→ Return: Ordered lesson sequence
```

### 3. Misconception-Aware Tutoring

```
Student error: "1/4 is bigger than 1/2 because 4 is bigger than 2"
→ Match to misconception node: "denominator confusion"
→ Traverse: addressedIn → Lesson
→ Return: Lessons that address this specific error
```

### 4. Vocabulary Progression Tracking

```
Query: "When is 'fraction' introduced and how does it develop?"
→ Find keyword: "fraction"
→ Traverse: firstYear, subjects, lessonSlugs
→ Group by year, show progression
→ Return: Year-by-year vocabulary development
```

---

## Next Steps

### Immediate

1. ✅ **Curate useful synonyms from mined data** — Done (27 entries extracted)
2. ✅ **Archive regex-mined file** — Done
3. ✅ **Document lessons learned** — This document

### Short Term

4. **Define weighting function** for synonym prioritization
5. **Validate extractors against knowledge graph schema**
6. **Create unified knowledge graph export** combining schema + instances

### Medium Term

7. **Implement transcript mining** (LLM-based, not regex)
8. **Build graph query interface** for MCP tools
9. **Connect to Elasticsearch** for graph-enhanced search

---

## Related Documents

- [elasticsearch-optimization-opportunities.md](elasticsearch-optimization-opportunities.md) — ES-specific opportunities
- [vocabulary-value-analysis.md](vocabulary-value-analysis.md) — Value scoring for synonyms
- [vocabulary-mining-bulk.md](../../plans/semantic-search/planned/vocabulary-mining-bulk.md) — Extraction plan
- [knowledge-graph-data.ts](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts) — Current property graph

---

## Key Takeaways

1. **Property graph ≠ knowledge graph** — We have schema but no instances connected
2. **Regex is insufficient for language processing** — LLMs required for synonym extraction
3. **Frequency alone is misleading** — Need impact/examinability/synonym-need factors
4. **Transcripts are unmined** — Significant vocabulary opportunity
5. **Pre-existing resources underutilized** — Should validate against schema, cross-reference with ontology
6. **True knowledge graph enables graph-based search** — Beyond text matching to concept traversal




