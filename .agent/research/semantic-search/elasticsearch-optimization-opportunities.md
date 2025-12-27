# Elasticsearch Optimization Opportunities

**Created**: 2025-12-26
**Context**: Semantic search vocabulary mining analysis
**Status**: 🔬 RESEARCH — Comprehensive exploration

---

## Purpose

This document captures what we haven't yet leveraged from the bulk data for Elasticsearch, idiomatic approaches to education domain search, and what's planned in existing documents.

---

## Part 1: Untapped Bulk Data for ES

### What We Extract But Don't Index

The vocab-gen pipeline extracts rich data that currently exists only in generated TypeScript files, NOT in Elasticsearch:

| Data Type | Extracted Count | ES Status | Potential ES Use |
|-----------|-----------------|-----------|------------------|
| **Keywords with definitions** | 13,349 | ❌ Not indexed | Glossary index, "define X" queries |
| **Misconceptions with responses** | 12,777 | ❌ Not indexed | "Common mistakes" queries, teacher guidance |
| **NC statements** | 7,454 | ❌ Not indexed | Curriculum alignment queries |
| **Prior knowledge requirements** | 7,881 | ❌ Not indexed | Prerequisite search |
| **Thread progressions** | 164 | ✅ MCP tool | Could also be ES-searchable |
| **Unit prerequisites** | 1,601 units, 3,408 edges | ✅ MCP tool | Could also be ES-searchable |

### Data Available But Not Extracted

Looking at the bulk JSON structure, we have additional fields not currently mined:

| Field | Structure | Potential Use |
|-------|-----------|---------------|
| `transcript_sentences` | Array of timestamped sentences | Time-coded search, video navigation, **synonym mining** |
| `transcript_vtt` | WebVTT subtitle format | Video search integration |
| `whyThisWhyNow` | Unit rationale text | "Why teach this?" queries |
| `unitLessons[].lessonOrder` | Lesson sequence within unit | Lesson flow queries |
| `threads[].order` | Thread sequence order | Progression queries |
| `description` | Unit description | Rich text for semantic search |

**Transcript Mining Opportunity (2025-12-26 Discovery)**:

Transcripts contain spoken vocabulary patterns that keyword definitions don't:
- "Also called..." — explicit synonym introduction
- "Another word for..." — plain English alternatives  
- "Remember, X means..." — explanatory phrases teachers use
- Repeated emphasis — importance signals (term spoken 5+ times)
- "Don't confuse X with Y" — misconception patterns

**Note**: Regex insufficient for this extraction. LLM-based analysis required.
See [knowledge-graph-integration-opportunities.md](knowledge-graph-integration-opportunities.md) for details.

### Extracted But Under-Used

| Data | Current Use | Under-Used Potential |
|------|-------------|---------------------|
| **Keyword definitions** | vocabulary-graph-data.ts | Not used for synonym generation, not searchable |
| **Prior knowledge** | prerequisite-graph-data.ts | Could drive "what comes before" ES queries |
| **Teacher tips** | Indexed as array | Not analyzed for pedagogical patterns |
| **Learning points** | Indexed as array | Not used for outcome-based search |

---

## Part 2: Idiomatic ES Approaches for Education Domain

### 1. Curations (Pinned Results)

**What it is**: Manually pin specific documents to the top for certain queries.

**Education use case**:
- Query "fractions" → Always show the introductory "What is a fraction?" lesson first
- Query "times tables" → Pin the foundational multiplication lesson
- Query "climate change" → Pin age-appropriate content for each key stage

**Implementation**: ES App Search Curations or query-time boosting rules.

### 2. Relevance Tuning by User Context

**What it is**: Different relevance rules for different user types.

**Education use case**:
- **Teacher search**: Boost lessons with rich teacher tips, misconceptions
- **Student search**: Boost lessons with clear learning outcomes
- **Curriculum planner**: Boost NC statement coverage

**Implementation**: Query-time `function_score` with context-aware boosting.

### 3. Faceted Navigation with Curriculum Hierarchy

**What it is**: Drill-down navigation using curriculum structure.

**Education use case**:
```
Subject → Key Stage → Year → Thread → Unit → Lesson
   ↓          ↓         ↓       ↓        ↓       ↓
 Maths      KS2      Year 4  Fractions  Unit 1  Lesson 3
```

**Implementation**: ES aggregations with hierarchical facets.

### 4. "Did You Mean?" with Curriculum Vocabulary

**What it is**: Suggest corrections using domain-specific vocabulary.

**Education use case**:
- "photosynthisis" → "Did you mean: photosynthesis?"
- "quadradic" → "Did you mean: quadratic?"
- "fronted adverbials" → (correct, no suggestion needed)

**Implementation**: ES `suggest` API with custom analysers trained on curriculum vocabulary.

### 5. Completion/Typeahead with Curriculum Context

**What it is**: Auto-complete suggestions as user types.

**Current status**: ✅ Already implemented (`title_suggest` field with contexts)

**Enhancement opportunities**:
- Add vocabulary terms to suggestions (not just lesson/unit titles)
- Add NC statement phrases
- Add thread names

### 6. Synonym Expansion at Query Time

**What it is**: Expand queries with domain synonyms.

**Current status**: ✅ 163 curated synonyms deployed

**Enhancement opportunities**:
- Add 20 foundational synonyms (adjective→describing word)
- Subject-scoped synonyms (gradient means different things in maths vs art)
- Year-appropriate synonym expansion

### 7. More-Like-This Recommendations

**What it is**: "If you liked this lesson, you might also like..."

**Education use case**:
- Show related lessons on the same topic
- Show prerequisite lessons
- Show follow-up lessons

**Implementation**: ES `more_like_this` query on lesson content.

### 8. Learning Path Queries (Graph Traversal)

**What it is**: "What's the path from X to Y?"

**Education use case**:
- "How do I get from counting to algebra?"
- "What should I teach before trigonometry?"

**Current status**: Prerequisite graph exists as TypeScript data

**Enhancement**: Index prerequisite edges in ES for graph queries.

### 9. Misconception-Based Search

**What it is**: Find lessons that address specific misconceptions.

**Education use case**:
- Teacher searches: "students think denominator is the bigger number"
- AI tutoring: detect misconception, recommend corrective lesson

**Implementation**: Index misconceptions as searchable documents with lesson links.

### 10. NC Coverage Queries

**What it is**: "Which lessons cover this NC statement?"

**Education use case**:
- Curriculum planners: "Show me all content covering 'solve quadratic equations'"
- School leaders: "Does our scheme cover all Year 5 maths NC?"

**Implementation**: Index NC statements with unit/lesson links.

---

## Part 3: What's Already Planned

### From Phase Plans

| Document | What's Planned | ES Impact |
|----------|----------------|-----------|
| **05-complete-data-indexing.md** | Index ALL fields from API schema | More filterable/searchable fields |
| **06-reference-indices.md** | Subject/key stage metadata indices | Fast lookups, autocomplete contexts |
| **07-resource-types.md** | Worksheets, quizzes, sequences | Broader resource search |
| **phase-10-reference-indices.md** | Glossary, NC standards indices | Definition lookup, curriculum alignment |
| **phase-11-plus-future.md** | RAG, knowledge graph, LTR | AI-enhanced search |

### From ADRs

| ADR | What's Decided | ES Impact |
|-----|----------------|-----------|
| **ADR-080** | KS4 metadata denormalisation | Tier/exam board filtering ✅ |
| **ADR-082** | Fundamentals-first strategy | Prioritize traditional ES before AI |
| **ADR-083** | Complete lesson enumeration | All lessons indexed ✅ |
| **ADR-084** | Phrase query boosting | Better phrase matching ✅ |
| **ADR-086** | Graph export pattern | Static graphs for MCP tools |

---

## Part 4: Proposed New ES Indices

### 1. `oak_curriculum_glossary` (HIGH PRIORITY)

**Source**: vocabulary-graph-data.ts (13,349 terms)

**Schema**:
```typescript
interface GlossaryDocument {
  term: string;           // "adjective"
  definition: string;     // "a word that describes a noun"
  subjects: string[];     // ["english", "french", "german", "spanish"]
  key_stages: string[];   // ["ks1", "ks2", "ks3", "ks4"]
  first_year: number;     // 1
  frequency: number;      // 212
  value_score: number;    // 678 (calculated)
  is_cross_subject: boolean; // true
  lesson_slugs: string[]; // [...]
  // Semantic field for definition search
  definition_semantic: string;
}
```

**Use cases**:
- "What does coefficient mean?" → Term lookup
- "Year 3 maths vocabulary" → Filtered glossary
- "Cross-subject terms" → Filter by is_cross_subject

### 2. `oak_misconceptions` (HIGH PRIORITY)

**Source**: misconception-graph-data.ts (12,777 entries)

**Schema**:
```typescript
interface MisconceptionDocument {
  misconception: string;  // "Pupils may think the denominator is the larger number"
  response: string;       // "Explain that denominator means..."
  lesson_slug: string;    // "fractions-lesson-1"
  lesson_title: string;   // "Introduction to fractions"
  unit_slug: string;
  subject: string;        // "maths"
  key_stage: string;      // "ks2"
  year: number;           // 3
  // Semantic field for natural language search
  misconception_semantic: string;
}
```

**Use cases**:
- "Common mistakes with fractions" → Topic search
- "Misconceptions in KS3 science" → Filtered search
- AI tutoring: match student error to misconception

### 3. `oak_nc_coverage` (MEDIUM PRIORITY)

**Source**: nc-coverage-graph-data.ts

**Schema**:
```typescript
interface NCCoverageDocument {
  statement: string;      // "solve quadratic equations algebraically"
  statement_id: string;   // Derived ID for deduplication
  subject: string;        // "maths"
  key_stage: string;      // "ks4"
  unit_slugs: string[];   // Units covering this statement
  lesson_slugs: string[]; // Lessons within those units
  coverage_depth: number; // How many lessons address this
  // Semantic field for flexible matching
  statement_semantic: string;
}
```

**Use cases**:
- "Which units cover quadratic equations NC?" → Direct match
- "NC coverage for Year 6 maths" → Aggregated coverage report
- "Find gaps in NC coverage" → Low coverage_depth

### 4. `oak_prerequisites` (MEDIUM PRIORITY)

**Source**: prerequisite-graph-data.ts (3,408 edges)

**Schema**:
```typescript
interface PrerequisiteEdgeDocument {
  from_unit: string;      // "fractions-year-3"
  to_unit: string;        // "fractions-year-4"
  from_title: string;
  to_title: string;
  subject: string;
  thread_slug?: string;
  edge_type: 'explicit' | 'thread_sequence' | 'prior_knowledge';
}
```

**Use cases**:
- "What comes before fractions year 5?" → Graph query
- "Learning path for algebra" → Multi-hop traversal

---

## Part 5: What We Haven't Thought Of

### 1. Temporal Learning Patterns

**Idea**: Track when concepts should be introduced based on curriculum progression.

**Data source**: `firstYear` from vocabulary graph + unit year data

**Use case**: "Is my student ready for this concept based on their year group?"

### 2. Difficulty Progression

**Idea**: Score lessons by cognitive load / difficulty level.

**Data source**: Could be derived from:
- Year level (Year 1 easier than Year 11)
- Vocabulary complexity (word length, frequency)
- Prerequisite depth (more prerequisites = harder)

**Use case**: Adaptive learning paths based on student ability.

### 3. Content Warning Index

**Idea**: Make `supervisionLevel` and `contentGuidance` first-class searchable.

**Data source**: Already extracted from bulk data

**Use case**: "Find all lessons requiring adult supervision" for safeguarding.

### 4. Vocabulary Progression Tracking

**Idea**: Track how vocabulary builds across years.

**Data source**: firstYear + frequency data

**Use case**: "Show me how 'fraction' vocabulary develops from Year 2 to Year 6"

### 5. Cross-Subject Vocabulary Disambiguation

**Idea**: Same term, different meanings by subject context.

**Examples**:
- "power" in maths (exponent) vs physics (energy/time) vs politics (authority)
- "gradient" in maths (slope) vs art (colour blend)
- "volume" in maths (3D space) vs music (loudness)

**Implementation**: Subject-scoped synonym sets, or query-time context boosting.

### 6. Teacher Language vs Curriculum Language

**Idea**: Bridge between how teachers search and how curriculum is written.

**Pattern**:
- Curriculum: "adjective"
- Teacher search: "describing words lesson"

**Implementation**: Foundational synonyms + phrase expansion.

### 7. Student Error Pattern Index

**Idea**: Index common errors (from misconceptions) to match against student work.

**Use case**: AI marking tool detects "student wrote 1/4 is bigger than 1/2" → Match to misconception → Recommend lesson.

### 8. Learning Outcome Search

**Idea**: Make the 51K learning points directly searchable.

**Data source**: Already extracted but only used as lesson enrichment.

**Use case**: Teacher searches "I want students to be able to identify prime numbers" → Find lessons with that outcome.

---

## Part 5b: Process & Methodology Ideas

These are process improvements for how we develop and maintain search quality.

### 9. LLM-Based Synonym Extraction

**Idea**: Instead of regex patterns like "also known as", use an LLM to parse definitions and extract teacher-friendly search phrases.

**Example prompt**:
```
Given this curriculum term and definition:
Term: adjective
Definition: "a word that describes a noun"

What alternative phrases might a KS1 teacher search for when looking for lessons about this concept? Return only search phrases, not the term itself.
```

**Why**: Definitions contain the right information; regex can't extract it reliably; LLMs understand pragmatic language patterns.

### 10. Search Log Analysis

**Idea**: If we have access to actual search queries, mine them for synonym opportunities.

**Process**:
- Identify queries with zero results
- Identify queries with low click-through on first result
- Map these to curriculum terms that should have matched
- Generate synonyms that bridge the gap

**Why**: This is the gold standard — synonyms based on actual user behaviour, not theoretical analysis.

### 11. Automated Synonym Candidate Pipeline

**Idea**: Add a vocab-gen command that generates a synonym candidate report.

```bash
pnpm vocab-gen --synonym-candidates --top 100
```

**Output**:
```markdown
## Top 100 Synonym Candidates by Value Score

| Rank | Term | Value | Current Synonyms | Suggested (from definition) |
|------|------|-------|------------------|---------------------------|
| 1 | adjective | 678 | NONE | describing word |
| 2 | noun | 579 | NONE | naming word |
...
```

**Why**: Makes synonym curation a data-driven review process, not ad-hoc.

### 12. Stratified Evaluation Corpus

**Idea**: Create a systematic query set for proper search evaluation.

**Stratification axes**:
1. Subject (16 subjects)
2. Key stage (KS1, KS2, KS3, KS4)
3. Query type:
   - Definition lookup ("what is a noun")
   - Topic search ("fractions year 4")
   - Synonym-dependent ("describing words lesson")
   - Multi-concept ("adding fractions with different denominators")
4. Persona (teacher, student, curriculum planner)

**Target**: 200-500 queries that systematically cover the phase space.

**Why**: Current 10 diagnostic queries are "effectively random" — optimizing for them means overfitting.

---

## Part 6: Implementation Priority Matrix

| Opportunity | User Impact | Implementation Effort | Priority |
|-------------|-------------|----------------------|----------|
| **Foundational synonyms** | HIGH (KS1/KS2 teachers) | LOW (20 curated entries) | 🔴 IMMEDIATE |
| **Glossary index** | HIGH (definition queries) | MEDIUM (new index) | 🟠 HIGH |
| **Misconception index** | HIGH (teacher guidance) | MEDIUM (new index) | 🟠 HIGH |
| **NC coverage index** | MEDIUM (curriculum planners) | MEDIUM (new index) | 🟡 MEDIUM |
| **Prerequisite graph in ES** | MEDIUM (learning paths) | MEDIUM (edge index) | 🟡 MEDIUM |
| **Did you mean** | MEDIUM (typo correction) | LOW (built-in ES) | 🟡 MEDIUM |
| **Learning outcome search** | MEDIUM (outcome queries) | LOW (reuse existing) | 🟡 MEDIUM |
| **Difficulty scoring** | LOW (future feature) | HIGH (model needed) | 🟢 LOW |
| **Error pattern matching** | LOW (AI tutoring) | HIGH (complex matching) | 🟢 LOW |

---

## Related Documents

- [vocabulary-value-analysis.md](vocabulary-value-analysis.md) — Synonym value scoring
- [02b-vocabulary-mining.md](../../plans/semantic-search/part-1-search-excellence/02b-vocabulary-mining.md) — Vocabulary mining plan
- [05-complete-data-indexing.md](../../plans/semantic-search/part-1-search-excellence/05-complete-data-indexing.md) — Field indexing plan
- [06-reference-indices.md](../../plans/semantic-search/part-1-search-excellence/06-reference-indices.md) — Reference data plan
- [phase-11-plus-future.md](../../plans/semantic-search/phase-11-plus-future.md) — RAG and knowledge graph

