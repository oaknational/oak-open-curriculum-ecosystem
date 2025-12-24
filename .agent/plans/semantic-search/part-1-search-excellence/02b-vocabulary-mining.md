# Sub-Plan 02b: Comprehensive Curriculum Vocabulary Mining

**Status**: 📋 PLANNED  
**Priority**: HIGH — Sector-transformative potential  
**Parent**: [README.md](README.md)  
**Created**: 2025-12-24

---

## Executive Summary

Oak National Academy has **the most comprehensive structured vocabulary dataset for UK education**:

| Source | Count | Unique | Has Definition? |
|--------|-------|--------|-----------------|
| **Keywords** | 44,638 | 13,349 | ✅ Yes — full definitions |
| **Misconceptions** | 12,777 | TBD | ✅ Yes — with responses |
| **Key Learning Points** | 51,894 | TBD | ✅ Yes — structured |
| **Teacher Tips** | 12,774 | TBD | ✅ Yes — pedagogical guidance |
| **Prior Knowledge** | TBD | TBD | ✅ Yes — prerequisite concepts |
| **NC Statements** | TBD | TBD | ✅ Yes — official curriculum |

**This is a HUGE opportunity for the sector.** No other organisation has this breadth and depth of structured educational vocabulary.

---

## 🔄 Core Principle: Fully Repeatable Pipeline

**CRITICAL REQUIREMENT**: The entire vocabulary mining process MUST be repeatable and automated.

```bash
# Single command to regenerate ALL vocabulary artefacts
pnpm vocab-gen
```

### What This Command Does

1. **Reads** all 30 bulk download files from `reference/bulk_download_data/`
2. **Extracts** vocabulary, misconceptions, prerequisites, NC statements, etc.
3. **Generates** static graph data files in the SDK:
   - `prerequisite-graph-data.ts`
   - `misconception-graph-data.ts`
   - `nc-coverage-graph-data.ts`
   - `vocabulary-graph-data.ts`
   - `thread-progression-data.ts`
4. **Exports** Elasticsearch index definitions and ingestion scripts
5. **Updates** synonym sets with mined vocabulary
6. **Produces** analysis reports (coverage, frequency, cross-subject terms)

### Pipeline Properties

| Property | Requirement |
|----------|-------------|
| **Idempotent** | Same input → same output (deterministic) |
| **Incremental** | Can detect unchanged files and skip processing |
| **Logged** | Full audit trail of what was processed |
| **Validated** | Output validated against Zod schemas |
| **Versioned** | Generated files include source data version |

### Integration with Existing Tooling

```bash
# Full regeneration chain (like type-gen → build)
pnpm bulk-download      # Fetch latest bulk data (if needed)
pnpm vocab-gen          # Generate all vocabulary artefacts
pnpm type-gen           # Regenerate types (if vocab changes affect types)
pnpm build              # Build all packages
pnpm es:setup           # Update Elasticsearch with new synonyms/indices
```

### Source Data Versioning

All generated files MUST include source metadata:

```typescript
export const prerequisiteGraph = {
  version: '1.0.0',
  generatedAt: '2025-12-24T10:30:00Z',
  
  // Source data tracking for reproducibility
  source: {
    bulkDownloadVersion: '2025-12-07T09:37:04.693Z',
    filesProcessed: 30,
    totalLessons: 12345,
    totalUnits: 678,
  },
  
  // ... graph data
} as const;
```

---

## Vision

Build a suite of **searchable vocabulary indices** that transform how teachers, students, AI agents, and researchers interact with curriculum content:

```text
                    ┌─────────────────────────────────────────┐
                    │      OAK VOCABULARY PLATFORM            │
                    │                                         │
                    │  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
                    │  │GLOSSARY │  │SYNONYMS │  │MISCON-  │  │
                    │  │ INDEX   │  │  INDEX  │  │CEPTIONS │  │
                    │  └────┬────┘  └────┬────┘  └────┬────┘  │
                    │       │            │            │       │
                    │  ┌────┴────┐  ┌────┴────┐  ┌────┴────┐  │
                    │  │   NC    │  │PREREQ   │  │PEDAGOGY │  │
                    │  │COVERAGE │  │ GRAPH   │  │  VOCAB  │  │
                    │  └────┬────┘  └────┬────┘  └────┬────┘  │
                    │       │            │            │       │
                    │       └────────────┴────────────┘       │
                    │                    │                    │
                    │            UNIFIED SEARCH               │
                    └────────────────────┬────────────────────┘
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          │                              │                              │
    ┌─────┴─────┐                  ┌─────┴─────┐                  ┌─────┴─────┐
    │  TEACHERS │                  │ STUDENTS  │                  │ AI AGENTS │
    │           │                  │           │                  │           │
    │ "What     │                  │ "What     │                  │ "Find     │
    │  does X   │                  │  does     │                  │  lessons  │
    │  mean?"   │                  │  this     │                  │  about    │
    │           │                  │  term     │                  │  this     │
    │ "Common   │                  │  mean?"   │                  │  concept" │
    │  mistakes │                  │           │                  │           │
    │  for Y?"  │                  │ "Why is   │                  │ "What     │
    │           │                  │  this     │                  │  comes    │
    │ "What's   │                  │  wrong?"  │                  │  before   │
    │  needed   │                  │           │                  │  this?"   │
    │  before   │                  │           │                  │           │
    │  this?"   │                  │           │                  │           │
    └───────────┘                  └───────────┘                  └───────────┘
```

---

## Audience & Context Analysis

### Primary Audiences

| Audience | Context | Need | Priority |
|----------|---------|------|----------|
| **Teachers** | Lesson planning | "What vocabulary should I introduce?" | HIGH |
| **Teachers** | Formative assessment | "What misconceptions should I check for?" | HIGH |
| **Teachers** | Curriculum mapping | "Which NC statements does this cover?" | HIGH |
| **Students** | Self-study | "What does this term mean?" | MEDIUM |
| **Students** | Revision | "What are common mistakes to avoid?" | MEDIUM |
| **AI Agents** | Search | Synonym expansion, concept matching | HIGH |
| **AI Agents** | Tutoring | Misconception detection, prerequisite checking | HIGH |
| **Researchers** | Analysis | Vocabulary coverage, concept frequency | LOW |
| **MATs/Schools** | Planning | Curriculum vocabulary progression | MEDIUM |

### Use Case Matrix

| Use Case | Index Required | Query Pattern |
|----------|----------------|---------------|
| "Define 'photosynthesis'" | Glossary | Term → Definition |
| "Find lessons about respiration" | Synonyms | Query → Canonical → Lessons |
| "Common mistakes in fractions" | Misconceptions | Topic → Misconceptions |
| "Prerequisites for trigonometry" | Prerequisite Graph | Concept → Prior Knowledge |
| "NC coverage for Year 6 maths" | NC Coverage Map | Year+Subject → NC Statements |
| "Teacher-facing vocabulary" | Pedagogy Vocab | Filter by audience |

---

## Data Sources

### 1. Bulk Download Data (PRIMARY)

Location: `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/`

**SCOPE: ALL 30 FILES — Every subject, primary and secondary**

| Subject | Primary | Secondary | Combined Size |
|---------|---------|-----------|---------------|
| Art | ✅ 9.0MB | ✅ 9.8MB | 18.8MB |
| Citizenship | — | ✅ 21MB | 21MB |
| Computing | ✅ 7.3MB | ✅ 16MB | 23.3MB |
| Cooking & Nutrition | ✅ 3.5MB | ✅ 2.2MB | 5.7MB |
| Design & Technology | ✅ 7.4MB | ✅ 11MB | 18.4MB |
| English | ✅ 91MB | ✅ 70MB | 161MB |
| French | ✅ 251KB | ✅ 1.1MB | 1.4MB |
| Geography | ✅ 12MB | ✅ 34MB | 46MB |
| German | — | ✅ 1.1MB | 1.1MB |
| History | ✅ 9.8MB | ✅ 30MB | 39.8MB |
| Maths | ✅ 62MB | ✅ 78MB | 140MB |
| Music | ✅ 12MB | ✅ 13MB | 25MB |
| Physical Education | ✅ 1.2MB | ✅ 13MB | 14.2MB |
| Religious Education | ✅ 9.9MB | ✅ 26MB | 35.9MB |
| Science | ✅ 19MB | ✅ 59MB | 78MB |
| Spanish | ✅ 309KB | ✅ 1.0MB | 1.3MB |
| **TOTAL** | **28 files** | **30 files** | **~630MB** |

**Extracted Vocabulary (across ALL subjects)**:

| Field | Type | Total Count | Unique | Structure | Use |
|-------|------|-------------|--------|-----------|-----|
| `lessonKeywords` | Array | 44,638 | 13,349 | `{keyword, description}` | Glossary + Synonyms |
| `misconceptionsAndCommonMistakes` | Array | 12,777 | TBD | `{misconception, response}` | Misconception Index |
| `keyLearningPoints` | Array | 51,894 | TBD | `{keyLearningPoint}` | Learning outcomes |
| `teacherTips` | Array | 12,774 | TBD | `{teacherTip}` | Pedagogical vocabulary |
| `priorKnowledgeRequirements` | Array | TBD | TBD | Array of strings | Prerequisite Graph |
| `nationalCurriculumStatements` | Array | TBD | TBD | Array of strings | NC Coverage Map |
| `threads` | Array | TBD | TBD | Thread slugs | Concept progression |

### 2. Ontology Data (EXISTING)

Location: `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`

| Section | Use |
|---------|-----|
| `curriculumStructure` | Key stages, phases, subjects |
| `threads` | Concept progression definitions |
| `ks4Complexity` | Programme factors vocabulary |
| `contentGuidance` | Supervision level vocabulary |
| `synonyms` | Existing synonym mappings (163 entries) |

### 3. Knowledge Graph (EXISTING)

Location: `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`

| Section | Use |
|---------|-----|
| `concepts` | Entity types and categories |
| `edges` | Relationship vocabulary |

### 4. API Schema (GENERATED)

Location: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`

| Section | Use |
|---------|-----|
| Schema definitions | Field names as vocabulary |
| Enum values | Canonical term lists |
| Description fields | Definition text |

---

## Proposed Indices

### Index 1: Curriculum Glossary

**Purpose**: Searchable index of all keywords with definitions

| Field | Type | Source |
|-------|------|--------|
| `term` | keyword | `lessonKeywords[].keyword` |
| `definition` | text | `lessonKeywords[].description` |
| `subject` | keyword | Lesson subject |
| `key_stage` | keyword | Lesson key stage |
| `year` | integer | Lesson year |
| `lesson_slugs` | keyword[] | Lessons using this term |
| `frequency` | integer | Usage count |
| `first_introduced` | integer | Earliest year |

**Query Examples**:
- "Define photosynthesis" → Term search with definition
- "Year 4 maths vocabulary" → Filter by year + subject
- "When is 'denominator' introduced?" → First year of use

**Size Estimate**: ~13,349 documents (unique keywords)

### Index 2: Synonym Expansion Index

**Purpose**: Enhanced search query expansion beyond current 163 entries

| Field | Type | Source |
|-------|------|--------|
| `canonical_term` | keyword | Primary term |
| `variants` | keyword[] | Synonyms, abbreviations, colloquialisms |
| `definition` | text | For semantic matching |
| `subject` | keyword | Subject scope |
| `source` | keyword | Where synonym was mined |
| `confidence` | float | Mining confidence score |

**Synonym Sources**:
1. **Definition parsing**: Extract "also known as", "or", parenthetical alternatives
2. **Cross-lesson matching**: Same concept, different wording
3. **Existing synonyms**: Current 163 entries as seed
4. **UK/US variants**: colour/color, maths/math
5. **Colloquial terms**: "pythagoras" → "pythagorean theorem"

**Size Estimate**: ~5,000-10,000 synonym mappings

### Index 3: Misconception Index

**Purpose**: Search lessons by common mistakes they address

| Field | Type | Source |
|-------|------|--------|
| `misconception` | text | The wrong belief |
| `response` | text | How to address it |
| `subject` | keyword | Subject |
| `key_stage` | keyword | Key stage |
| `year` | integer | Year |
| `lesson_slug` | keyword | Lesson that addresses it |
| `severity` | keyword | How common/damaging |

**Query Examples**:
- "Misconceptions about fractions" → Topic search
- "Students think all fruit needs peeling" → Natural language search
- "Year 7 science common mistakes" → Filter by year + subject

**Size Estimate**: ~12,777 documents

### Index 4: NC Coverage Map

**Purpose**: Map lessons to National Curriculum statements

| Field | Type | Source |
|-------|------|--------|
| `nc_statement` | text | Official NC text |
| `units` | object[] | Units covering this statement |
| `lessons` | object[] | Lessons within those units |
| `subject` | keyword | Subject |
| `key_stage` | keyword | Key stage |
| `coverage_depth` | keyword | How deeply covered |

**Query Examples**:
- "Which lessons cover NC statement X?"
- "What percentage of Year 5 maths NC is covered?"
- "Find gaps in NC coverage"

**Size Estimate**: ~500-1000 documents (unique NC statements)

### Index 5: Prerequisite Graph Index

**Purpose**: Enable "what comes before" queries

| Field | Type | Source |
|-------|------|--------|
| `unit_slug` | keyword | Unit identifier |
| `unit_title` | text | Unit name |
| `prior_knowledge` | text[] | Required prior knowledge |
| `prior_units` | keyword[] | Units that teach prerequisites |
| `subsequent_units` | keyword[] | Units this enables |
| `thread_slugs` | keyword[] | Threads this unit belongs to |
| `thread_position` | integer | Position within thread |

**Query Examples**:
- "What should students know before trigonometry?"
- "What comes after fractions Year 4?"
- "Build a learning path for algebra"

**Size Estimate**: ~3,000 documents (units with prerequisites)

#### 🔗 Graph Export for MCP

**REQUIREMENT**: The prerequisite graph MUST also be exported as a static JSON graph structure, similar to `knowledge-graph-data.ts`, for consumption by MCP tools.

**Output Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-graph-data.ts`

**Structure** (modelled on `conceptGraph`):

```typescript
export const prerequisiteGraph = {
  version: '1.0.0',
  generatedAt: '2025-XX-XX',
  
  // Nodes: Units with prerequisite metadata
  units: [
    {
      slug: 'fractions-year-4',
      title: 'Fractions Year 4',
      subject: 'maths',
      keyStage: 'ks2',
      year: 4,
      threads: ['number-fractions'],
      threadPosition: 3,
      priorKnowledge: ['Understand equal parts', 'Count in halves and quarters'],
    },
    // ... ~3,000 units
  ],
  
  // Edges: Prerequisite relationships
  edges: [
    { from: 'fractions-year-3', to: 'fractions-year-4', rel: 'prerequisiteFor' },
    { from: 'fractions-year-4', to: 'fractions-year-5', rel: 'prerequisiteFor' },
    // ... derived from prior knowledge matching
  ],
  
  // Thread progressions for easy traversal
  threadProgressions: {
    'number-fractions': ['fractions-year-2', 'fractions-year-3', 'fractions-year-4', ...],
  },
} as const;
```

**MCP Tool**: `get-prerequisite-graph`
- Returns the full prerequisite graph for AI agent reasoning
- Enables questions like "What's the learning path to trigonometry?"
- Complements `get-knowledge-graph` (schema-level) with instance-level data

### Index 6: Pedagogical Vocabulary Index

**Purpose**: Teacher-facing terminology and guidance

| Field | Type | Source |
|-------|------|--------|
| `term` | keyword | Pedagogical term |
| `context` | text | How it's used |
| `source_type` | keyword | teacher_tip, content_guidance, etc. |
| `subject` | keyword | Subject if applicable |
| `examples` | text[] | Usage examples |

**Query Examples**:
- "What does 'scaffolding' mean in this context?"
- "Teacher guidance for sensitive topics"
- "Assessment vocabulary"

**Size Estimate**: ~2,000 documents

---

## Graph Exports for MCP Tools

**CRITICAL REQUIREMENT**: All extracted graph structures MUST be exported as static JSON data files in the SDK, with corresponding MCP tools for AI agent consumption.

### Pattern: Follow `knowledge-graph-data.ts`

The existing knowledge graph (`packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`) provides the pattern:

1. **Static data file** with `as const` for type inference
2. **Exported types** derived from the data structure
3. **TSDoc documentation** explaining structure and usage
4. **MCP tool** that returns the graph to AI agents

### Graphs to Extract and Export

| Graph | Output File | MCP Tool | Purpose |
|-------|-------------|----------|---------|
| **Prerequisite Graph** | `prerequisite-graph-data.ts` | `get-prerequisite-graph` | Unit dependencies, learning paths |
| **Misconception Graph** | `misconception-graph-data.ts` | `get-misconception-graph` | Common mistakes by topic/concept |
| **NC Coverage Graph** | `nc-coverage-graph-data.ts` | `get-nc-coverage-graph` | Which lessons cover which NC statements |
| **Vocabulary Graph** | `vocabulary-graph-data.ts` | `get-vocabulary-graph` | Term relationships, cross-subject terms |
| **Thread Progression Graph** | `thread-progression-data.ts` | `get-thread-progressions` | Ordered unit sequences within threads |

### Graph Structure Template

All graphs should follow this structure:

```typescript
/**
 * [Graph Name] - extracted from bulk download data
 *
 * @remarks
 * - Generated from ALL 30 bulk download files
 * - Nodes: [what nodes represent]
 * - Edges: [what edges represent]
 * - Use with get-knowledge-graph for schema context
 *
 * @see 02b-vocabulary-mining.md for extraction methodology
 */
export const [graphName] = {
  /** Semantic version of this graph */
  version: '1.0.0',
  
  /** When this graph was generated */
  generatedAt: 'ISO-8601 timestamp',
  
  /** Source data version */
  sourceVersion: 'bulk-download-2025-12-07',
  
  /** Node count for agent context */
  stats: {
    nodeCount: number,
    edgeCount: number,
    subjectsCovered: string[],
  },
  
  /** Graph nodes */
  nodes: [
    { id: string, ...metadata },
  ],
  
  /** Graph edges */
  edges: [
    { from: string, to: string, rel: string, ...metadata },
  ],
  
  /** Cross-reference to related tools */
  seeAlso: 'Related MCP tools and resources',
} as const;

export type [GraphType] = typeof [graphName];
```

### MCP Tool Implementation

Each graph MCP tool should:

1. **Import the static data** from the SDK
2. **Return the full graph** (small enough for context window)
3. **Support optional filtering** (by subject, key stage, etc.)
4. **Include usage hints** for AI agents

Example tool signature:

```typescript
// In MCP tool definitions
{
  name: 'get-prerequisite-graph',
  description: `Returns the curriculum prerequisite graph showing unit dependencies.
  
  Use this to answer questions like:
  - "What should students know before trigonometry?"
  - "What's the learning path from Year 2 fractions to Year 6?"
  - "Which units depend on this one?"
  
  Returns nodes (units) and edges (prerequisiteFor relationships).
  Complements get-knowledge-graph (schema-level) with instance data.`,
  parameters: {
    subject: { type: 'string', optional: true },
    keyStage: { type: 'string', optional: true },
  },
}
```

### Size Considerations

Graphs must fit in AI context windows. Estimated sizes:

| Graph | Est. Nodes | Est. Edges | Est. JSON Size | Fits Context? |
|-------|------------|------------|----------------|---------------|
| Prerequisite | ~3,000 | ~5,000 | ~500KB | ⚠️ May need filtering |
| Misconception | ~12,000 | ~15,000 | ~2MB | ❌ Must filter/summarise |
| NC Coverage | ~1,000 | ~5,000 | ~300KB | ✅ Yes |
| Vocabulary | ~13,000 | ~20,000 | ~3MB | ❌ Must filter/summarise |
| Thread Progression | ~200 | ~3,000 | ~100KB | ✅ Yes |

**Strategy for large graphs**:
1. Return summary/stats by default
2. Support filtering by subject/keyStage/year
3. Offer "subgraph" queries (e.g., "fractions learning path only")

---

## Categorization Strategy

### Option A: By Subject (Recommended)

Mirrors bulk download structure. Natural for teachers.

```text
indices/
├── glossary-maths/
├── glossary-english/
├── glossary-science/
├── glossary-history/
├── glossary-geography/
└── glossary-shared/       # Cross-subject terms
```

**Pros**: Natural navigation, subject-specialist use
**Cons**: Some terms cross subjects

### Option B: By Vocabulary Type

```text
indices/
├── glossary/              # All definitions
├── misconceptions/        # All misconceptions  
├── prerequisites/         # All prereqs
└── nc-coverage/           # All NC statements
```

**Pros**: Cleaner separation, easier to query type
**Cons**: Cross-cutting queries harder

### Option C: Unified with Facets

```text
indices/
└── curriculum-vocabulary/
    ├── doc_type: glossary | misconception | prerequisite | nc
    ├── subject: maths | english | science | ...
    ├── key_stage: ks1 | ks2 | ks3 | ks4
    └── ...
```

**Pros**: Single index, powerful faceting
**Cons**: Larger index, mixed schemas

### Recommendation: Hybrid

1. **Separate indices** for different schemas (glossary vs misconceptions vs prerequisites)
2. **Unified faceting** within each index (subject, key_stage, year, phase)
3. **Cross-index search** for "find everything about X"

### Per-Subject Analysis (from 30 bulk download files)

Each subject has different vocabulary characteristics:

| Subject | Primary Focus | Vocabulary Style | Cross-Subject Potential |
|---------|--------------|------------------|------------------------|
| **Maths** | Procedural | Technical, precise | Number, geometry terms → Science |
| **English** | Literacy | Literary, analytical | Grammar terms → MFL |
| **Science** | Conceptual | Technical, hierarchical | Maths crossover, geography crossover |
| **History** | Contextual | Temporal, causal | Geography crossover |
| **Geography** | Spatial | Physical + human terms | Science crossover |
| **MFL** (French, Spanish, German) | Linguistic | Grammar, vocabulary | English crossover |
| **Art/Music/DT** | Creative | Technical + aesthetic | Cross-creative terms |
| **Computing** | Technical | Precise, modern | Maths logic terms |
| **RE/RSHE/Citizenship** | Values | Abstract, ethical | Cross-curricular themes |
| **PE** | Physical | Activity-based | Science (biology) terms |
| **Cooking** | Practical | Procedural, sensory | Science (chemistry) terms |

**Cross-Subject Term Mining**: Particularly valuable for identifying:
- **STEM vocabulary** shared across Maths/Science/Computing/DT
- **Literacy vocabulary** shared across English/MFL
- **Abstract concepts** shared across RE/Citizenship/RSHE
- **Procedural vocabulary** shared across PE/Cooking/DT

---

## Weighting & Prioritization

Not all vocabulary is equal. Weight by:

### Importance Factors

| Factor | Weight | Rationale |
|--------|--------|-----------|
| **Frequency** | 0.3 | More common = more useful |
| **Cross-Subject** | 0.2 | Terms used in multiple subjects |
| **Foundation** | 0.2 | Key stages 1-2 vocabulary |
| **Definition Quality** | 0.15 | Clearer definitions = more useful |
| **Search Failure** | 0.15 | Terms causing search failures |

### Priority Tiers

**Tier 1 (Must Have)**: Top 1,000 keywords by weighted score
**Tier 2 (Should Have)**: Next 4,000 keywords
**Tier 3 (Nice to Have)**: Remaining ~8,000 keywords

### Example Weighting Calculation

```
Term: "photosynthesis"
  Frequency: 127 occurrences → 0.3 * (127/max_freq) = 0.18
  Cross-Subject: science + geography → 0.2 * 0.5 = 0.10
  Foundation: KS2 first use → 0.2 * 1.0 = 0.20
  Definition: Good quality → 0.15 * 0.9 = 0.135
  Search Failure: None → 0.15 * 0 = 0
  TOTAL: 0.615 → Tier 1
```

---

## Word vs Phrase Indices

### Word-Level Indices

- Individual vocabulary terms
- Good for: Definitions, spelling, etymology
- Example: "denominator", "photosynthesis", "algorithm"

### Phrase-Level Indices

**Learning Phrase Patterns**:
| Pattern | Example | Source |
|---------|---------|--------|
| "How to X" | "How to add fractions" | Key learning points |
| "Why X matters" | "Why place value matters" | Unit descriptions |
| "Common mistake: X" | "Common mistake: confusing area and perimeter" | Misconceptions |
| "Before learning X, students need Y" | Prerequisite statements | Prior knowledge |

**Phrase Index Fields**:
| Field | Type | Use |
|-------|------|-----|
| `phrase` | text | The complete phrase |
| `phrase_type` | keyword | how_to, why, common_mistake, prerequisite |
| `key_concepts` | keyword[] | Main concepts in phrase |
| `lesson_slugs` | keyword[] | Source lessons |

---

## Implementation Phases

### Phase 0: Pipeline Infrastructure (Week 1)

**Goal**: Establish the repeatable pipeline before any extraction work.

1. **Create pipeline orchestrator** `scripts/vocab-gen/index.ts`
2. **Implement bulk file discovery** — auto-find all JSON files in bulk download dir
3. **Create validation schemas** for input and output
4. **Set up logging and progress reporting**
5. **Add `pnpm vocab-gen` command** to workspace root

**Deliverables**:
- `scripts/vocab-gen/` — Pipeline orchestrator directory
- `scripts/vocab-gen/index.ts` — Main entry point
- `scripts/vocab-gen/lib/bulk-reader.ts` — Read all bulk files
- `scripts/vocab-gen/lib/logger.ts` — Structured logging
- `package.json` update with `vocab-gen` script
- README documenting the pipeline

**Acceptance Criteria**:
- `pnpm vocab-gen` runs and logs "Processing 30 files..."
- Pipeline is idempotent and deterministic

### Phase 1: Extraction Foundation (Week 1-2)

1. **Extract and deduplicate** all vocabulary from **ALL 30 bulk download files**
2. **Create extraction modules** in `scripts/vocab-gen/extractors/`
3. **Generate frequency analysis** for weighting
4. **Identify cross-subject terms** (terms appearing in multiple subjects)

**Deliverables**:
- `scripts/vocab-gen/extractors/keywords.ts` — Keyword extraction
- `scripts/vocab-gen/extractors/misconceptions.ts` — Misconception extraction
- `scripts/vocab-gen/extractors/prerequisites.ts` — Prerequisite extraction
- `scripts/vocab-gen/extractors/nc-statements.ts` — NC statement extraction
- `scripts/vocab-gen/outputs/` — Generated analysis reports
- Zod schemas for all extracted data types

**Implementation Note**: All extractors are called by the pipeline orchestrator, NOT run manually.

### Phase 2: Glossary Index (Week 2-3)

1. **Design ES mapping** for glossary index
2. **Create ingestion pipeline** from extraction scripts
3. **Build search interface** (API endpoint)
4. **Add to MCP server** as new tool

**Deliverables**:
- `oak-glossary` Elasticsearch index
- `glossary-ingestion.ts` — Ingestion script
- `GET /api/glossary/search` — Search endpoint
- `mcp: get-glossary-definition` — MCP tool

### Phase 3: Synonym Enhancement (Week 3-4)

1. **Parse definitions** for "also known as", parentheticals
2. **Cross-reference lessons** for same-concept variants
3. **Merge with existing** 163 synonyms
4. **Generate ES synonyms file**

**Deliverables**:
- Enhanced `synonymsData` (target: 1,000+ entries)
- `extract-synonyms-from-definitions.ts`
- Updated `oak-syns` synonym set

### Phase 4: Misconception Index (Week 4-5)

1. **Design ES mapping** for misconception index
2. **Create ingestion pipeline**
3. **Build search interface**
4. **Add to MCP server**

**Deliverables**:
- `oak-misconceptions` Elasticsearch index
- `misconception-ingestion.ts`
- `GET /api/misconceptions/search`
- `mcp: search-misconceptions`

### Phase 5: Prerequisite Graph (Week 5-6)

1. **Extract prior knowledge** requirements from ALL subjects
2. **Build unit dependency graph** with edges inferred from:
   - Explicit `priorKnowledgeRequirements`
   - Thread ordering (`unitOrder` within threads)
   - Year progression within subjects
3. **Export as static graph** following `knowledge-graph-data.ts` pattern
4. **Create MCP tool** for AI agent consumption
5. **Index in Elasticsearch** for search queries

**Deliverables**:
- `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-graph-data.ts` — **Static graph export**
- `oak-prerequisites` Elasticsearch index
- `mcp: get-prerequisite-graph` — **MCP tool for AI agents**
- `GET /api/prerequisites/{unit-slug}` — REST endpoint
- TSDoc and README documentation

### Phase 6: NC Coverage Map (Week 6-7)

1. **Extract NC statements** from ALL subject units
2. **Map to lessons** with coverage depth
3. **Calculate coverage metrics** per year/subject
4. **Export as static graph** for AI agents
5. **Create MCP tool** for curriculum planning queries

**Deliverables**:
- `packages/sdks/oak-curriculum-sdk/src/mcp/nc-coverage-graph-data.ts` — **Static graph export**
- `oak-nc-coverage` Elasticsearch index
- `mcp: get-nc-coverage-graph` — **MCP tool for AI agents**
- `GET /api/nc-coverage/search` — REST endpoint
- Coverage report per subject/year

### Phase 7: Thread Progression Graph (Week 7-8)

1. **Extract thread progressions** from ALL subjects
2. **Build ordered unit sequences** within each thread
3. **Calculate year span and concept growth**
4. **Export as static graph** (small, fits in context)

**Deliverables**:
- `packages/sdks/oak-curriculum-sdk/src/mcp/thread-progression-data.ts` — **Static graph export**
- `mcp: get-thread-progressions` — **MCP tool for AI agents**
- TSDoc and README documentation

### Phase 8: Misconception Graph (Week 8-9)

1. **Extract misconceptions** from ALL subjects
2. **Build topic → misconception graph**
3. **Identify common patterns** across subjects
4. **Export summary graph** (full data too large)

**Deliverables**:
- `packages/sdks/oak-curriculum-sdk/src/mcp/misconception-graph-data.ts` — **Summary graph export**
- `oak-misconceptions` Elasticsearch index (full data)
- `mcp: get-misconception-graph` — **MCP tool (summary + filtering)**
- Analysis report on cross-subject misconception patterns

### Phase 9: Vocabulary Relationship Graph (Week 9-10)

1. **Build term relationship graph** from definitions
2. **Identify cross-subject terms** and their relationships
3. **Map term introduction progression** across years
4. **Export summary graph** with filtering support

**Deliverables**:
- `packages/sdks/oak-curriculum-sdk/src/mcp/vocabulary-graph-data.ts` — **Summary graph export**
- `mcp: get-vocabulary-graph` — **MCP tool (summary + filtering)**
- Cross-subject term analysis report

---

## Documentation Requirements

### TSDoc

All extraction scripts and indices MUST have comprehensive TSDoc:

```typescript
/**
 * Extracts unique keywords from bulk download data with frequency analysis.
 *
 * @remarks
 * Keywords are structured objects with `keyword` and `description` fields.
 * This function deduplicates by lowercase keyword and tracks:
 * - Frequency across all lessons
 * - First year of introduction
 * - Subject distribution
 *
 * @param bulkDownloadPath - Path to bulk download directory
 * @returns Deduplicated keywords with metadata
 *
 * @example
 * ```ts
 * const keywords = await extractKeywords('reference/bulk_download_data/...');
 * // Returns: Array<{ term, definition, frequency, subjects, firstYear }>
 * ```
 *
 * @see {@link WeightedKeyword} for the output type
 * @see ADR-XXX for vocabulary mining strategy
 */
export async function extractKeywords(bulkDownloadPath: string): Promise<WeightedKeyword[]>
```

### Authored Markdown

Each index MUST have a README:

```markdown
# Oak Glossary Index

## Overview

Searchable index of 13,349 curriculum keywords with definitions.

## Schema

| Field | Type | Description |
|-------|------|-------------|
| term | keyword | The vocabulary term |
| definition | text | Full definition |
| ... | ... | ... |

## Query Examples

### Basic term lookup
\`\`\`
GET oak-glossary/_search
{
  "query": { "match": { "term": "photosynthesis" } }
}
\`\`\`

## Data Sources

- `lessonKeywords` from bulk download
- Cross-referenced with existing synonyms

## Maintenance

- Re-run ingestion after curriculum updates
- Frequency weights recalculated quarterly
```

### ADRs Required

| ADR | Title | Status |
|-----|-------|--------|
| ADR-XXX | Vocabulary Mining Strategy | 📋 Planned |
| ADR-XXX | Glossary Index Design | 📋 Planned |
| ADR-XXX | Misconception Index Design | 📋 Planned |
| ADR-XXX | Prerequisite Graph Design | 📋 Planned |
| ADR-XXX | NC Coverage Map Design | 📋 Planned |
| ADR-XXX | **Graph Export Pattern for MCP** | 📋 Planned |
| ADR-XXX | **Large Graph Filtering Strategy** | 📋 Planned |

---

## Sector Impact

### Why This Matters

1. **No other organisation has this data** — Oak's structured vocabulary is unique
2. **Teachers need this** — "What vocabulary should I teach in Year 5 maths?"
3. **AI tutors need this** — Misconception detection requires misconception data
4. **Curriculum planning needs this** — NC coverage, prerequisites, progression
5. **Accessibility** — Clear definitions help all learners

### Potential Partnerships

- **DfE** — Official curriculum vocabulary resource
- **MATs** — Curriculum planning tool
- **EdTech** — API access for vocabulary features
- **Publishers** — Align textbooks with Oak vocabulary

### Open Data Opportunity

Consider releasing as open data:
- Glossary with definitions
- Misconception database
- NC coverage mappings

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Glossary coverage | 95%+ of keywords indexed | Document count |
| Synonym expansion | 10x current (1,630 entries) | Synonym count |
| Search improvement | +10% MRR for vocabulary queries | A/B test |
| NC coverage | 100% of statements mapped | Coverage report |
| Misconception coverage | 95%+ indexed | Document count |
| API usage | 1,000+ queries/month | Analytics |
| **Graph exports** | 5 graphs exported | File count |
| **MCP tools** | 5 new graph tools | Tool count |
| **Subject coverage** | ALL 30 bulk files processed | Subject count |
| **AI agent utility** | Graphs usable in context | Size < 500KB or filterable |

---

## Related Documents

- [02a-synonym-architecture.md](02a-synonym-architecture.md) — Fix circular dependency (prerequisite)
- [05-complete-data-indexing.md](05-complete-data-indexing.md) — Index all fields
- [ADR-063](../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) — Synonym source of truth
- [ontology-data.ts](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) — Existing ontology
- [knowledge-graph-data.ts](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts) — **Pattern for graph exports**

### Pipeline Directory Structure

```text
scripts/vocab-gen/
├── index.ts                    ← Main entry point (pnpm vocab-gen)
├── lib/
│   ├── bulk-reader.ts          ← Reads all 30 bulk files
│   ├── logger.ts               ← Structured logging
│   ├── validator.ts            ← Zod validation for all inputs/outputs
│   └── writer.ts               ← Writes generated files
├── extractors/
│   ├── keywords.ts             ← Extract keywords with definitions
│   ├── misconceptions.ts       ← Extract misconceptions with responses
│   ├── prerequisites.ts        ← Extract prior knowledge requirements
│   ├── nc-statements.ts        ← Extract NC statement mappings
│   ├── threads.ts              ← Extract thread progressions
│   └── index.ts                ← Barrel export
├── generators/
│   ├── prerequisite-graph.ts   ← Generate prerequisite-graph-data.ts
│   ├── misconception-graph.ts  ← Generate misconception-graph-data.ts
│   ├── nc-coverage-graph.ts    ← Generate nc-coverage-graph-data.ts
│   ├── vocabulary-graph.ts     ← Generate vocabulary-graph-data.ts
│   ├── thread-progression.ts   ← Generate thread-progression-data.ts
│   ├── synonyms.ts             ← Generate enhanced synonym sets
│   └── index.ts                ← Barrel export
├── reports/
│   ├── frequency-analysis.ts   ← Generate frequency reports
│   ├── cross-subject.ts        ← Generate cross-subject term report
│   └── coverage.ts             ← Generate coverage reports
└── README.md                   ← Pipeline documentation

packages/sdks/oak-curriculum-sdk/src/mcp/
├── knowledge-graph-data.ts     ← Existing (pattern reference)
├── ontology-data.ts            ← Existing
├── prerequisite-graph-data.ts  ← GENERATED by vocab-gen
├── misconception-graph-data.ts ← GENERATED by vocab-gen
├── nc-coverage-graph-data.ts   ← GENERATED by vocab-gen
├── vocabulary-graph-data.ts    ← GENERATED by vocab-gen
└── thread-progression-data.ts  ← GENERATED by vocab-gen
```

### Verification Command

```bash
# Verify the pipeline is working correctly
pnpm vocab-gen --dry-run     # Show what would be generated
pnpm vocab-gen --verify      # Check generated files match source
pnpm vocab-gen --diff        # Show changes since last run
```

### Pattern Reference: knowledge-graph-data.ts

The existing knowledge graph provides the canonical pattern for graph exports:

```typescript
// Key structural elements to follow:
export const conceptGraph = {
  version: '1.0.0',              // Semantic versioning
  concepts: [...],               // Nodes with id, label, brief, category
  edges: [...],                  // Edges with from, to, rel, optional inferred
  seeOntology: '...',            // Cross-reference to related tools
} as const;

// Derived types for type safety
export type ConceptGraph = typeof conceptGraph;
export type ConceptId = ConceptGraph['concepts'][number]['id'];
```

All new graph exports MUST follow this pattern for consistency.

---

## Open Questions

1. **Should glossary terms link back to lessons or units?** Both? Configurable?
2. **How to handle term evolution?** Same word, different meanings at different key stages?
3. **Versioning?** When curriculum updates, how to track vocabulary changes?
4. **Multi-language?** Welsh curriculum vocabulary?
5. **Access control?** Public API or authenticated only?

---

## Next Steps

1. ✅ Create this plan document
2. 📋 Fix circular dependency in 02a first (blocks synonym work)
3. 📋 Create extraction scripts in `evaluation/vocabulary/`
4. 📋 Run initial vocabulary analysis
5. 📋 Design glossary index schema
6. 📋 Draft ADR for vocabulary mining strategy

