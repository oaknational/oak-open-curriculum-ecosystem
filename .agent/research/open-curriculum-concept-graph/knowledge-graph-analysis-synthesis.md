# Knowledge Graph Analysis Synthesis

> **STATUS: PRIMARY REFERENCE DOCUMENT**
>
> This is the comprehensive synthesis of all research, schema analysis, and
> design decisions for the `get-knowledge-graph` tool implementation.
> Start here when implementing.

**Created**: December 2025  
**Purpose**: Comprehensive synthesis of all research, schema analysis, and design decisions for the Oak Curriculum Knowledge Graph implementation.

---

## 1. Executive Summary

This document synthesises findings from:

- OpenAPI schema analysis (`api-schema-sdk.json`)
- Official Oak glossary and ontology diagrams
- Existing ontology implementation (`ontology-data.ts`)
- Research documents on knowledge graph support and subject design tools

### Key Conclusions

1. **Two complementary tools** — `get-ontology` (meaning/guidance) and `get-knowledge-graph` (structure/edges)
2. **Schema-level graph** — Captures concept TYPE relationships, not instances
3. **Focus on implicit relationships** — The graph's primary value is making implicit domain knowledge explicit
4. **Static data structure** — Not searchable; provides complete graph in one request
5. **Combined token budget** — ~5K tokens total for ontology + graph

---

## 2. Sources Cross-Referenced

### Primary Sources

| Source                                                                                           | Purpose                    | Key Findings                            |
| ------------------------------------------------------------------------------------------------ | -------------------------- | --------------------------------------- |
| `api-schema-sdk.json`                                                                            | Technical truth of API     | Explicit relationships, data structures |
| [Oak Glossary](https://open-api.thenational.academy/docs/about-oaks-data/glossary)               | Human-readable definitions | Entity definitions, hierarchies         |
| [Ontology Diagrams](https://open-api.thenational.academy/docs/about-oaks-data/ontology-diagrams) | Visual structure           | Official concept relationships          |
| `ontology-data.ts`                                                                               | Existing implementation    | Current authored content                |

### Research Documents

| Document                           | Purpose                                           |
| ---------------------------------- | ------------------------------------------------- |
| `knowledge-graph-tool-research.md` | Analysis of tool patterns and integration points  |
| `complementary-by-construction.md` | Separation of concerns between ontology and graph |
| `optimised-graph-proposal.md`      | Target structure and size constraints             |
| `kg-overview.md`                   | Terminology and scope definition                  |
| `oak-knowledge-graph-support.md`   | Future vision for concept-layer graph             |
| `oak-subject-design-tool.md`       | Use case for graph in subject design              |

---

## 3. Terminology: Schema-Level Knowledge Graph

### What We're Building

The **Oak Curriculum Knowledge Graph (schema-level)** captures:

- **Structure and form**: How concept TYPES relate to each other
- **NOT substance**: Not specific instances (individual lessons, units)

In formal knowledge representation terms:

- **TBox (Terminological)**: Schema, types, class relationships → **Our Graph**
- **ABox (Assertional)**: Instances, actual entities → Partially in **Ontology** (enumerated values)
- **Guidance**: Workflows, definitions, tips → **Ontology**

### Industry Usage

This is correctly called a "knowledge graph" because:

1. It captures domain **knowledge** about curriculum structure in graph form
2. Industry usage includes schema-level representations
3. The term communicates intent effectively to agents and developers

---

## 4. Explicit Relationships (Directly Stated in Schema/Glossary)

These relationships are clear from the API schema and official documentation:

### Core Hierarchy

| Relationship             | Evidence Source                                  |
| ------------------------ | ------------------------------------------------ |
| Subject → Sequence       | `AllSubjectsResponseSchema.sequenceSlugs[]`      |
| Sequence → Year → Unit   | `SequenceUnitsResponseSchema[].year`, `.units[]` |
| Unit → Lesson            | `UnitSummaryResponseSchema.unitLessons[]`        |
| Lesson → Quiz            | `QuestionForLessonsResponseSchema`               |
| Quiz → Question → Answer | Quiz schema structure                            |

### Context Relationships

| Relationship                      | Evidence Source                                     |
| --------------------------------- | --------------------------------------------------- |
| Phase → KeyStage                  | Glossary: "Primary phase is made up of KS1 and KS2" |
| KeyStage → YearGroup              | Glossary: "KS1 is made up of years 1 and 2"         |
| Subject → KeyStage (availability) | `AllSubjectsResponseSchema.keyStages[]`             |

### Taxonomy Relationships

| Relationship               | Evidence Source                                  |
| -------------------------- | ------------------------------------------------ |
| Unit → Thread              | `units[].threads[]`, `ThreadUnitsResponseSchema` |
| Unit → Category            | `units[].categories[]`                           |
| Thread → Unit (with order) | `ThreadUnitsResponseSchema` with `unitOrder`     |

### Educational Metadata

| Relationship                       | Evidence Source                                                 |
| ---------------------------------- | --------------------------------------------------------------- |
| Lesson → Keywords                  | `LessonSummaryResponseSchema.lessonKeywords[]`                  |
| Lesson → Misconceptions            | `LessonSummaryResponseSchema.misconceptionsAndCommonMistakes[]` |
| Lesson → ContentGuidance           | `LessonSummaryResponseSchema.contentGuidance[]`                 |
| ContentGuidance → SupervisionLevel | `contentGuidance[].supervisionlevel_id`                         |
| Unit → NationalCurriculumContent   | `UnitSummaryResponseSchema.nationalCurriculumContent[]`         |
| Unit → PriorKnowledgeRequirements  | `UnitSummaryResponseSchema.priorKnowledgeRequirements[]`        |
| Lesson → KeyLearningPoints         | `LessonSummaryResponseSchema.keyLearningPoints[]`               |
| Lesson → TeacherTips               | `LessonSummaryResponseSchema.teacherTips[]`                     |

---

## 5. Implicit Relationships (Discovered Through Analysis)

These are **not explicitly stated** but are implied by schema structure, cross-reference, or domain knowledge:

### 5.1 Programme is a Derived View (Critical Insight)

**Glossary states**: "A programme is a sequence of units for a particular subject and year group."

**But**: The API is **sequence-centric**. Programme exists in glossary and user-facing URLs but NOT as a distinct API entity.

**Implication**: Programme is a **derived view** composed from:

- Subject + KeyStage + Year + [Tier] + [ExamBoard] + [Pathway]

**Inferred edges**:

- `Programme → Sequence` (derivedFrom)
- `Programme → Subject` (about)
- `Programme → KeyStage` (scopedTo)
- `Programme → Tier/Pathway/ExamBoard` (usesFactorWhen, conditional)

### 5.2 KS4 Branching Structure

The `SequenceUnitsResponseSchema` has **three variants** revealed through `anyOf`:

1. **Simple units** (KS1-3): `{ year, units[] }`
2. **Tiered units** (KS4 maths): `{ year, tiers[].units[] }`
3. **Exam subject branching** (KS4 science): `{ year, examSubjects[].tiers[].units[] }`

**Inferred edges**:

- `Sequence → Tier` (for KS4 maths)
- `Sequence → ExamSubject → Tier → Unit` (for KS4 science)

These are **conditional** based on subject and key stage — a complexity not obvious from documentation alone.

### 5.3 Thread → Unit is Cross-Year Progression

**Glossary says**: Threads "group together units across the curriculum that build a common body of knowledge."

**Schema reveals**: `ThreadUnitsResponseSchema` returns units with `unitOrder` — units are **ordered within a thread**.

**Inferred meaning**: Thread edges represent **vertical progression** across years/key stages.

**Inferred edges**:

- `Thread → Unit` with ordering (progression)
- `Thread` implicitly spans multiple `Year` and `KeyStage`

### 5.4 Unit Context Relationships

`UnitSummaryResponseSchema` returns: `subjectSlug`, `keyStageSlug`, `yearSlug`, `phaseSlug`

These are ALWAYS present but not explicitly modelled as edges.

**Inferred edges**:

- `Unit → Subject` (belongsTo)
- `Unit → KeyStage` (scopedTo)
- `Unit → YearGroup` (targets)
- `Unit → Phase` (belongsTo)

Similarly for Lesson (via `LessonSummaryResponseSchema`):

- `Lesson → Subject` (belongsTo)
- `Lesson → KeyStage` (scopedTo)

### 5.5 Lesson → Unit is Many-to-Many

**Schema reveals**: `LessonSearchResponseSchema` returns `units[]` (plural) for each lesson.

**Implication**: The same lesson can appear in **multiple unit contexts** (variant units, optionality).

### 5.6 Unit Sequencing (Prior/Following)

`UnitSummaryResponseSchema.whyThisWhyNow` field: "An explanation of where the unit sits within the sequence and why it has been placed there."

**Inferred edges** (implicit in `unitOrder` but valuable to make explicit):

- `Unit → Unit` (precedes, based on unitOrder within sequence)

### 5.7 Asset Type Structure

The `type` enum reveals lesson content structure:

```
slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers,
supplementaryResource, video, worksheet, worksheetAnswers
```

**Inferred structure**:

- Quiz has two roles: `starter` (prior knowledge) and `exit` (assessment)
- Assets have distinct types with different pedagogical purposes

---

## 6. Future Vision: Concept-Layer Graph

The research documents (`oak-knowledge-graph-support.md`) describe a future extension:

### Explicit vs Implicit Concepts

**Explicit concepts** (already in Oak data):

- Threads (e.g., `sustainability-and-climate-change`)
- Unit titles, lesson titles
- Keywords, misconceptions
- NC statements

**Implicit concepts** (derivable from content):

- Extracted from transcripts, quizzes, co-occurrence patterns
- Example: "climate feedback loops" (mentioned in transcripts but not a keyword)
- Would have `sourceConfidence` scores

### Future Edge Types

```
CONCEPT_REFINES_CONCEPT
CONCEPT_PREREQUISITE_FOR_CONCEPT
CONCEPT_EXEMPLIFIED_BY_LESSON
CONCEPT_INTRODUCED_IN_UNIT
CONCEPT_ASSOCIATED_WITH_THREAD
CONCEPT_ALIGNS_WITH_NC_STATEMENT
```

### Value for Subject Design Tool

The knowledge graph enables:

- Better discovery (beyond keyword search)
- Prerequisite checking ("particle model of matter" → "atmospheric pressure" → "greenhouse effect")
- Cross-subject connectivity
- Gap analysis and coverage maps

**Note**: The current implementation focuses on the **structural schema-level graph** for agent support. The concept-layer extensions are future work.

---

## 7. Complementary Design: Ontology vs Knowledge Graph

### Clear Role Separation

| Aspect          | Ontology Owns                | Graph Owns                        |
| --------------- | ---------------------------- | --------------------------------- |
| **Purpose**     | What things MEAN             | How things CONNECT                |
| **Content**     | Rich prose definitions       | Terse relationships (edges)       |
| **Enumeration** | Actual values (ks1, maths)   | Concept identifiers               |
| **Guidance**    | Workflows, tips, patterns    | Navigable structure               |
| **UK Context**  | Education system explanation | —                                 |
| **Synonyms**    | Alternative term mapping     | —                                 |
| **Inferences**  | —                            | Relationships not explicit in API |

### What Each Artifact Contains

**Ontology** (`ontology-data.ts`):

- `curriculumStructure.keyStages[]` — enumerated key stages with ages, years
- `curriculumStructure.subjects[]` — subject list with availability
- `threads` — definition, importance, examples
- `programmesVsSequences` — critical distinction explanation
- `ks4Complexity` — tier/pathway/examboard explanation
- `entityHierarchy` — prose explanation of hierarchy
- `lessonComponents` — the 8 components with tool references
- `workflows` — how to use tools for common tasks
- `idFormats` — prefixed ID patterns for fetch tool
- `canonicalUrls` — URL patterns for Oak website
- `synonyms` — alternative term mapping

**Knowledge Graph** (`knowledge-graph-data.ts` - to be created):

- `concepts[]` — concept identifiers with brief labels
- `edges[]` — relationships between concepts
- `edges[].inferred` — flag for relationships not explicit in API
- `seeOntology` — cross-reference to companion tool

### Shared Identifiers

Both use consistent concept IDs:

- `subject`, `sequence`, `unit`, `lesson` (structure)
- `keystage`, `yeargroup`, `phase` (context)
- `thread`, `category` (taxonomy)
- `programme`, `tier`, `pathway`, `examboard`, `examsubject` (KS4)

---

## 8. Proposed Knowledge Graph Structure

### Concept Nodes (~25)

**Structure** (core hierarchy):

```typescript
{ id: 'subject', label: 'Subject', brief: 'Curriculum subject area', category: 'structure' }
{ id: 'sequence', label: 'Sequence', brief: 'Internal API grouping of units', category: 'structure' }
{ id: 'unit', label: 'Unit', brief: 'Topic of study with ordered lessons', category: 'structure' }
{ id: 'lesson', label: 'Lesson', brief: 'Teaching session with 8 components', category: 'structure' }
```

**Context** (scoping):

```typescript
{ id: 'phase', label: 'Phase', brief: 'Primary or secondary', category: 'context' }
{ id: 'keystage', label: 'KeyStage', brief: 'KS1-KS4 formal stage', category: 'context' }
{ id: 'yeargroup', label: 'YearGroup', brief: 'Year 1-11', category: 'context' }
```

**Content** (within lesson):

```typescript
{ id: 'quiz', label: 'Quiz', brief: 'Starter or exit assessment', category: 'content' }
{ id: 'question', label: 'Question', brief: 'Quiz question', category: 'content' }
{ id: 'answer', label: 'Answer', brief: 'Correct or distractor', category: 'content' }
{ id: 'asset', label: 'Asset', brief: 'Downloadable resource', category: 'content' }
{ id: 'transcript', label: 'Transcript', brief: 'Video transcript text', category: 'content' }
```

**Taxonomy** (cross-cutting):

```typescript
{ id: 'thread', label: 'Thread', brief: 'Conceptual strand across years', category: 'taxonomy' }
{ id: 'category', label: 'Category', brief: 'Subject-specific grouping', category: 'taxonomy' }
```

**KS4 Complexity** (conditional):

```typescript
{ id: 'programme', label: 'Programme', brief: 'User-facing curriculum pathway', category: 'ks4' }
{ id: 'tier', label: 'Tier', brief: 'Foundation or higher', category: 'ks4' }
{ id: 'pathway', label: 'Pathway', brief: 'Core or GCSE route', category: 'ks4' }
{ id: 'examboard', label: 'ExamBoard', brief: 'AQA, OCR, Edexcel, etc.', category: 'ks4' }
{ id: 'examsubject', label: 'ExamSubject', brief: 'Biology, Chemistry, etc.', category: 'ks4' }
```

**Educational Metadata**:

```typescript
{ id: 'keyword', label: 'Keyword', brief: 'Critical vocabulary', category: 'metadata' }
{ id: 'misconception', label: 'Misconception', brief: 'Common misunderstanding', category: 'metadata' }
{ id: 'contentguidance', label: 'ContentGuidance', brief: 'Sensitive content advisory', category: 'metadata' }
{ id: 'supervisionlevel', label: 'SupervisionLevel', brief: 'Adult supervision required', category: 'metadata' }
{ id: 'priorknowledge', label: 'PriorKnowledge', brief: 'Prerequisite understanding', category: 'metadata' }
{ id: 'nationalcurriculum', label: 'NationalCurriculumStatement', brief: 'NC coverage', category: 'metadata' }
{ id: 'keylearningpoint', label: 'KeyLearningPoint', brief: 'Main knowledge outcomes', category: 'metadata' }
```

### Edge Types (~45)

**Core Hierarchy** (explicit):

```typescript
{ from: 'subject', to: 'sequence', rel: 'hasSequences' }
{ from: 'sequence', to: 'unit', rel: 'containsUnits' }
{ from: 'unit', to: 'lesson', rel: 'containsLessons' }
```

**Content** (explicit):

```typescript
{ from: 'lesson', to: 'quiz', rel: 'hasQuizzes' }
{ from: 'quiz', to: 'question', rel: 'containsQuestions' }
{ from: 'question', to: 'answer', rel: 'hasAnswers' }
{ from: 'lesson', to: 'asset', rel: 'hasAssets' }
{ from: 'lesson', to: 'transcript', rel: 'hasTranscript' }
```

**Context** (explicit):

```typescript
{ from: 'phase', to: 'keystage', rel: 'includesKeyStages' }
{ from: 'keystage', to: 'yeargroup', rel: 'includesYears' }
{ from: 'subject', to: 'keystage', rel: 'availableAt' }
```

**Taxonomy** (explicit):

```typescript
{ from: 'thread', to: 'unit', rel: 'linksAcrossYears' }
{ from: 'unit', to: 'thread', rel: 'taggedWith' }
{ from: 'unit', to: 'category', rel: 'taggedWith' }
```

**Educational Metadata** (explicit):

```typescript
{ from: 'lesson', to: 'keyword', rel: 'hasKeywords' }
{ from: 'lesson', to: 'misconception', rel: 'addressesMisconceptions' }
{ from: 'lesson', to: 'contentguidance', rel: 'hasGuidance' }
{ from: 'contentguidance', to: 'supervisionlevel', rel: 'requiresSupervision' }
{ from: 'unit', to: 'priorknowledge', rel: 'requiresPriorKnowledge' }
{ from: 'unit', to: 'nationalcurriculum', rel: 'covers' }
{ from: 'lesson', to: 'keylearningpoint', rel: 'delivers' }
```

**INFERRED Relationships** (the valuable implicit knowledge):

```typescript
// Unit context (always present but not explicit edges)
{ from: 'unit', to: 'subject', rel: 'belongsTo', inferred: true }
{ from: 'unit', to: 'keystage', rel: 'scopedTo', inferred: true }
{ from: 'unit', to: 'yeargroup', rel: 'targets', inferred: true }
{ from: 'lesson', to: 'subject', rel: 'belongsTo', inferred: true }
{ from: 'lesson', to: 'keystage', rel: 'scopedTo', inferred: true }

// Programme (derived concept, not API entity)
{ from: 'programme', to: 'sequence', rel: 'derivedFrom', inferred: true }
{ from: 'programme', to: 'subject', rel: 'about', inferred: true }
{ from: 'programme', to: 'keystage', rel: 'scopedTo', inferred: true }
{ from: 'programme', to: 'yeargroup', rel: 'targets', inferred: true }
{ from: 'programme', to: 'tier', rel: 'usesFactorWhen', inferred: true }
{ from: 'programme', to: 'pathway', rel: 'usesFactorWhen', inferred: true }
{ from: 'programme', to: 'examboard', rel: 'usesFactorWhen', inferred: true }

// KS4 branching (conditional, subject-specific)
{ from: 'sequence', to: 'examsubject', rel: 'branchesInto', inferred: true }
{ from: 'sequence', to: 'tier', rel: 'hasTiers', inferred: true }
{ from: 'examsubject', to: 'tier', rel: 'hasTiers', inferred: true }
{ from: 'examsubject', to: 'unit', rel: 'containsUnits', inferred: true }
```

---

## 9. Size Analysis

### Target Budget

| Artifact           | Size     | Tokens    |
| ------------------ | -------- | --------- |
| Ontology (current) | ~15KB    | ~4K       |
| Graph (proposed)   | ~6-8KB   | ~1.5-2K   |
| **Combined**       | ~20-23KB | **~5-6K** |

### Graph Size Breakdown

```
~25 concepts × ~100 bytes = 2,500 bytes
~45 edges × ~80 bytes = 3,600 bytes
Metadata/cross-references = ~500 bytes
─────────────────────────────────────────
Total ≈ 6,600 bytes (~1,650 tokens)
```

### Comparison with Current Wrong-Focus Graph

The existing `kg-graph.ts` (research artifact) is ~40KB with:

- 28 Concept nodes
- 27 Endpoint nodes ← **REMOVE** (agents see tools/list)
- 24 Schema nodes ← **REMOVE** (API detail)
- 5 SourceDoc nodes ← **REMOVE** (research provenance)
- 118 edges (mostly API mappings) ← **REMOVE**

The proposed concept-only graph is **80% smaller**.

---

## 10. What NOT to Include

### Removed from Current kg-graph.ts

| Node/Edge Type           | Count | Reason                  |
| ------------------------ | ----- | ----------------------- |
| Endpoint nodes           | 27    | Agents see `tools/list` |
| Schema nodes             | 24    | Internal API detail     |
| SourceDoc nodes          | 4     | Research provenance     |
| Concept → Endpoint edges | ~40   | Redundant               |
| Endpoint → Schema edges  | ~27   | Redundant               |
| Schema → Concept edges   | ~21   | Redundant               |

### Why API Mappings Don't Belong

Agents learn about endpoints from `tools/list`. Duplicating that information:

- Wastes tokens
- Creates maintenance burden
- Provides no additional reasoning capability

The graph should capture **domain knowledge that ISN'T in the OpenAPI schema**.

---

## 11. Agent Usage Patterns

### What Agents Can Learn from the Graph

1. **Structure Navigation**: "What concepts are related to Unit?"
   - Traverse edges to find: Lesson, Thread, Category, Subject, KeyStage

2. **Content Hierarchy**: "What does a Lesson contain?"
   - Find edges from Lesson: Quiz, Asset, Transcript, Keywords, etc.

3. **Full Paths**: "What's the path from Subject to Question?"
   - Subject → Sequence → Unit → Lesson → Quiz → Question → Answer

4. **Inferred Relationships**: "What relationships are implicit?"
   - Filter edges where `inferred: true`

5. **KS4 Complexity**: "How does Programme relate to other concepts?"
   - See derived relationships to Sequence, Tier, ExamBoard, etc.

### What Agents Should Use Ontology For

1. **Definitions**: "What is a Thread?"
2. **Enumerated values**: "What key stages exist?"
3. **Workflows**: "How do I find lessons?"
4. **UK Context**: "What age range is Year 7?"
5. **Synonyms**: "What's the canonical name for 'PE'?"

---

## 12. Implementation Approach

### Phase 1: Create Graph Data (TDD)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`

1. Write unit tests FIRST for:
   - Graph structure validation (all edge references valid)
   - Concept count and categories
   - Edge properties (inferred flags)

2. Author the data fresh (NOT refactoring kg-graph.ts):
   - Start from ontology concept identifiers
   - Add explicit relationships from schema analysis
   - Add inferred relationships from this document

3. Use `as const` for type safety:
   ```typescript
   export const conceptGraph = { ... } as const;
   export type ConceptGraph = typeof conceptGraph;
   export type ConceptId = ConceptGraph['concepts'][number]['id'];
   ```

### Phase 2: Create Tool Definition (TDD)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.ts`

Follow the pattern from `aggregated-ontology.ts`:

- Input schema (no parameters)
- Tool definition with description, annotations, \_meta
- Run function returning `CallToolResult`

**Critical**: Graph goes in `structuredContent` (model needs it), NOT `_meta`.

### Phase 3: Register Tool

Update:

- `tool-guidance-types.ts` — Add to `AggregatedToolName`
- `tool-guidance-data.ts` — Add to `agentSupport` category
- `universal-tools/definitions.ts` — Add to `AGGREGATED_TOOL_DEFS`
- `universal-tools/executor.ts` — Add dispatch

### Phase 4: Cross-References

- Ontology response includes: `seeAlso: 'Call get-knowledge-graph for concept relationships'`
- Graph response includes: `seeOntology: 'Call get-ontology for rich definitions and guidance'`

---

## 13. Validation Criteria

The implementation is complete when:

1. **All quality gates pass** (no exceptions)
2. **TDD was followed** at unit, integration, and E2E levels
3. **Graph is in `structuredContent`** (model can reason about it)
4. **Ontology and graph cross-reference each other**
5. **Token budget is met** (~6KB graph + ~15KB ontology = ~21KB total)
6. **No type shortcuts** (types derived from `as const` data)
7. **TSDoc comments** on all public APIs

---

## 14. Future Extensions

### Near-Term (V1.1)

- **Query parameter**: `focus` to return subgraph centred on a concept
- **Validation tests**: Ensure concept IDs match between ontology and graph

### Medium-Term (V2)

- **Concept-layer graph** (per `oak-knowledge-graph-support.md`):
  - Explicit vs implicit concepts
  - `CONCEPT_PREREQUISITE_FOR_CONCEPT` edges
  - Confidence scores for inferred concepts

### Long-Term

- **Subject Design Tool integration**
- **Concept extraction from transcripts** (NLP/LLM pipeline)
- **Cross-subject concept mapping**

---

## 15. References

### Internal Documents

- `.agent/research/open-curriculum-knowledge-graph/knowledge-graph-tool-research.md`
- `.agent/research/open-curriculum-knowledge-graph/complementary-by-construction.md`
- `.agent/research/open-curriculum-knowledge-graph/optimised-graph-proposal.md`
- `.agent/research/open-curriculum-knowledge-graph/kg-overview.md`
- `.agent/research/open-curriculum-knowledge-graph/oak-knowledge-graph-support.md`
- `.agent/research/open-curriculum-knowledge-graph/oak-subject-design-tool.md`

### Implementation References

- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` — Existing ontology
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts` — Tool pattern
- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` — OpenAPI schema

### External Documentation

- [Oak Glossary](https://open-api.thenational.academy/docs/about-oaks-data/glossary)
- [Ontology Diagrams](https://open-api.thenational.academy/docs/about-oaks-data/ontology-diagrams)
- [API Overview](https://open-api.thenational.academy/docs/about-oaks-api/api-overview)

---

## Appendix A: Full Proposed Edge List

```typescript
// ===== EXPLICIT EDGES (from schema/glossary) =====

// Core hierarchy
{ from: 'subject', to: 'sequence', rel: 'hasSequences' },
{ from: 'sequence', to: 'unit', rel: 'containsUnits' },
{ from: 'unit', to: 'lesson', rel: 'containsLessons' },

// Content hierarchy
{ from: 'lesson', to: 'quiz', rel: 'hasQuizzes' },
{ from: 'quiz', to: 'question', rel: 'containsQuestions' },
{ from: 'question', to: 'answer', rel: 'hasAnswers' },
{ from: 'lesson', to: 'asset', rel: 'hasAssets' },
{ from: 'lesson', to: 'transcript', rel: 'hasTranscript' },

// Context
{ from: 'phase', to: 'keystage', rel: 'includesKeyStages' },
{ from: 'keystage', to: 'yeargroup', rel: 'includesYears' },
{ from: 'subject', to: 'keystage', rel: 'availableAt' },

// Taxonomy
{ from: 'thread', to: 'unit', rel: 'linksAcrossYears' },
{ from: 'unit', to: 'thread', rel: 'taggedWith' },
{ from: 'unit', to: 'category', rel: 'taggedWith' },

// Educational metadata
{ from: 'lesson', to: 'keyword', rel: 'hasKeywords' },
{ from: 'lesson', to: 'misconception', rel: 'addressesMisconceptions' },
{ from: 'lesson', to: 'contentguidance', rel: 'hasGuidance' },
{ from: 'contentguidance', to: 'supervisionlevel', rel: 'requiresSupervision' },
{ from: 'unit', to: 'priorknowledge', rel: 'requiresPriorKnowledge' },
{ from: 'unit', to: 'nationalcurriculum', rel: 'covers' },
{ from: 'lesson', to: 'keylearningpoint', rel: 'delivers' },

// ===== INFERRED EDGES (implicit but valuable) =====

// Unit context
{ from: 'unit', to: 'subject', rel: 'belongsTo', inferred: true },
{ from: 'unit', to: 'keystage', rel: 'scopedTo', inferred: true },
{ from: 'unit', to: 'yeargroup', rel: 'targets', inferred: true },
{ from: 'unit', to: 'phase', rel: 'belongsTo', inferred: true },

// Lesson context
{ from: 'lesson', to: 'subject', rel: 'belongsTo', inferred: true },
{ from: 'lesson', to: 'keystage', rel: 'scopedTo', inferred: true },
{ from: 'lesson', to: 'unit', rel: 'belongsTo', inferred: true },

// Programme (derived concept)
{ from: 'programme', to: 'sequence', rel: 'derivedFrom', inferred: true },
{ from: 'programme', to: 'subject', rel: 'about', inferred: true },
{ from: 'programme', to: 'keystage', rel: 'scopedTo', inferred: true },
{ from: 'programme', to: 'yeargroup', rel: 'targets', inferred: true },
{ from: 'programme', to: 'unit', rel: 'containsUnits', inferred: true },
{ from: 'programme', to: 'tier', rel: 'usesFactorWhen', inferred: true },
{ from: 'programme', to: 'pathway', rel: 'usesFactorWhen', inferred: true },
{ from: 'programme', to: 'examboard', rel: 'usesFactorWhen', inferred: true },

// KS4 branching
{ from: 'sequence', to: 'examsubject', rel: 'branchesInto', inferred: true },
{ from: 'sequence', to: 'tier', rel: 'hasTiers', inferred: true },
{ from: 'examsubject', to: 'tier', rel: 'hasTiers', inferred: true },
{ from: 'examsubject', to: 'unit', rel: 'containsUnits', inferred: true },
{ from: 'tier', to: 'unit', rel: 'containsUnits', inferred: true },
```

---

## Appendix B: TypeScript Type Definitions

```typescript
/**
 * Concept category for grouping related concepts
 */
type ConceptCategory =
  | 'structure' // Subject, Sequence, Unit, Lesson
  | 'content' // Quiz, Question, Answer, Asset, Transcript
  | 'context' // Phase, KeyStage, YearGroup
  | 'taxonomy' // Thread, Category
  | 'ks4' // Programme, Tier, Pathway, ExamBoard, ExamSubject
  | 'metadata'; // Keyword, Misconception, ContentGuidance, etc.

/**
 * A concept node in the knowledge graph
 */
interface ConceptNode {
  readonly id: string;
  readonly label: string;
  readonly brief: string;
  readonly category: ConceptCategory;
}

/**
 * An edge connecting two concepts
 */
interface ConceptEdge {
  readonly from: string;
  readonly to: string;
  readonly rel: string;
  readonly inferred?: true;
}

/**
 * The complete concept graph structure
 */
interface ConceptGraph {
  readonly version: string;
  readonly concepts: readonly ConceptNode[];
  readonly edges: readonly ConceptEdge[];
  readonly seeOntology: string;
}
```
