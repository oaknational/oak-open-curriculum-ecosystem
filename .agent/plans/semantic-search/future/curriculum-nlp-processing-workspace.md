# Curriculum NLP Processing Workspace

> **Status**: future (strategic brief)
> **Date**: 10 April 2026
> **Last Updated**: 10 April 2026
> **Author**: Jim Cresswell + AI analysis (Cursor, Opus 4.6)

---

## 1. Problem and Intent

The Oak curriculum bulk data (~630 MB, 30 files, ~47K lessons) contains
far more latent knowledge than the current TypeScript extraction pipeline
captures. The existing pipeline does **structural extraction** — it
reads explicitly tagged JSON fields (keywords, misconceptions, threads)
and reshapes them. It does not perform **semantic extraction** — it
cannot discover entities, relationships, or compressed meaning from
unstructured text.

Three specific capabilities are missing:

1. **Named Entity Recognition and ML-based extraction** — identifying
   concepts, skills, pedagogical patterns, and relationships in
   unstructured text (transcripts, unit descriptions, teacher tips,
   why-this-why-now rationale) that are not explicitly tagged in the
   structured data.

2. **Semantic content compression** — lesson transcripts are
   3,000–10,000 words of spoken language with repetition, filler,
   classroom management, teacher names, and tangential commentary.
   A compressed semantic representation (200–500 words) would preserve
   core concepts, their relationships, prerequisite assumptions, and
   misconceptions addressed — producing a far better input for
   ELSER/semantic search than raw transcripts.

3. **Knowledge and relationship extraction** — turning curriculum
   content into a richer graph of connections: concept X requires
   concept Y; misconception A is addressed by teaching approach B;
   lesson C builds towards unit goal D; keyword K is introduced in
   Year 3 and revisited with deepening complexity through Year 11.

**Intent**: Create a Python workspace in the monorepo that performs
ML/NLP processing of bulk curriculum data at codegen time, producing
committed artefacts (JSON datasets, TypeScript constants) consumed by
the SDK, MCP tools/resources, and the semantic search service.

### Why This Matters

The bridge from action to impact:

- **Teachers** find the right content faster because semantic search
  operates on dense, clean representations rather than noisy transcripts
- **AI agents** can reason about curriculum structure, prerequisite
  chains, and pedagogical relationships — not just search text
- **MCP tools and resources** gain richer knowledge surfaces (concept
  graphs, compressed summaries, entity indexes) that enable a new class
  of curriculum discovery
- **Search quality** improves because NER-identified entities and
  compressed content feed better signals into ELSER and BM25

## 2. What Exists Today

### TypeScript Extractors (Structural)

The existing pipeline in `packages/sdks/oak-sdk-codegen/` extracts
structured fields from bulk JSON. Wired into `processBulkData()`:

- keywords, misconceptions, learning points, teacher tips (lessons)
- prior knowledge, NC statements, threads (units)

Additional extractors exist but are **not wired** into the main
pipeline: transcripts, pupil outcomes, content guidance, supervision
levels, why-this-why-now, unit descriptions, year/phase info.

### Generated Artefacts

The pipeline produces committed TypeScript/JSON:

- thread progression graph, prerequisite graph
- misconception graph, vocabulary graph, NC coverage graph
- mined definition synonyms

### Research and Prior Plans

| Document | Key Finding |
|----------|-------------|
| `10-transcript-mining.md` (archived) | Regex extraction = 93% noise; LLM required; ~47K lessons with transcripts |
| `vocabulary-mining.md` (future, Phase 4-5) | Transcript mining + entity extraction identified but not started |
| `bulk-metadata-opportunities.research.md` | Many extractors exist but aren't wired; unit rollups from lessons feasible |
| `vocabulary-glossary-and-mining-surfaces.research.md` | Transcript-derived assets complement keyword definitions; higher risk |
| `curriculum-asset-opportunity-map.research.md` | "Treat curriculum signals as assets first, retrieval inputs second" |

### The Gap

All existing extraction is pattern-matching on structured JSON fields.
No ML, no NLP, no semantic understanding. The unstructured text
(transcripts, descriptions, rationale) is either indexed raw or ignored.
Python's ML/NLP ecosystem (spaCy, transformers, sentence-transformers,
scikit-learn) has no TypeScript equivalent of comparable quality.

## 3. Proposed Architecture

### New Workspace

```text
packages/ml/curriculum-nlp/
├── pyproject.toml           # uv-managed Python package
├── uv.lock                  # Pinned dependency graph
├── .python-version          # Python version pin
├── package.json             # Turbo integration (scripts defer to uv)
├── tsconfig.json            # For Turbo task graph only (no TS source)
├── README.md
├── python/                  # Source package
│   ├── __init__.py
│   ├── devtools.py          # Quality gate runner (lint, type, test, check)
│   ├── extractors/          # NER, entity, relationship extractors
│   ├── compressors/         # Semantic compression pipelines
│   ├── miners/              # Knowledge and relationship mining
│   └── outputs/             # Artefact writers (JSON, TS constants)
├── tests/                   # pytest test suite
└── outputs/                 # Generated artefacts (committed to git)
    ├── entities/            # NER outputs per subject/key-stage
    ├── compressed/          # Semantically compressed lesson content
    ├── relationships/       # Extracted knowledge relationships
    └── manifest.json        # Processing metadata and versioning
```

### Turbo Integration via `package.json`

Following the pattern from `algo-experiments`, the `package.json`
provides scripts that delegate to `uv`:

```json
{
  "name": "@oaknational/curriculum-nlp",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "setup": "uv sync",
    "build": "uv run check && uv run extract",
    "test": "uv run test",
    "type-check": "uv run typecheck",
    "lint": "uv run lint",
    "lint:fix": "uv run format",
    "extract": "uv run extract-all",
    "extract:ner": "uv run extract-entities",
    "extract:compress": "uv run compress-transcripts",
    "extract:relationships": "uv run extract-relationships"
  }
}
```

This allows Turbo to orchestrate the Python workspace alongside
TypeScript workspaces. The `extract` task depends on
`@oaknational/oak-sdk-codegen#build` (bulk data must be downloaded
first). The outputs are committed artefacts consumed downstream.

### Lifecycle Classification

This workspace is **codegen-time** (Tier 2a in the four-tier model).
It depends on Tier 0/1 primitives only indirectly (via bulk data files).
Its outputs are committed artefacts consumed by Tier 2b runtime
workspaces. It does not run at application runtime.

### Input → Processing → Output

```text
Input:
  bulk-downloads/*.json (lessons, units, sequences)
  + manifest.json (source version, download timestamp)

Processing (Python, codegen-time):
  1. Read bulk data (reuse schema knowledge from TypeScript extractors)
  2. NER / entity extraction on transcripts, descriptions, rationale
  3. Semantic compression of lesson transcripts
  4. Knowledge and relationship extraction across lessons/units/threads
  5. Quality validation and confidence scoring

Output (committed artefacts):
  outputs/entities/*.json       → consumed by SDK/MCP as entity indexes
  outputs/compressed/*.json     → consumed by search ingestion as dense content
  outputs/relationships/*.json  → consumed by MCP graph resources
  outputs/manifest.json         → versioning and provenance metadata
```

## 4. Capability Detail

### 4a. Named Entity Recognition and ML Extraction

**Goal**: Identify curriculum entities in unstructured text that are
not explicitly tagged in the structured data.

| Entity Type | Examples | Source Text | Consumer |
|-------------|----------|-------------|----------|
| `CONCEPT` | "quadratic equation", "photosynthesis" | Transcripts, descriptions | Concept-based search, MCP tools |
| `TOPIC` | "algebra", "cell biology" | Transcripts, learning points | Topic clustering, suggestions |
| `SKILL` | "solving", "analysing", "comparing" | Learning points, outcomes | Skill-based filtering |
| `NOTATION` | "x²", "∑", "≤" | Transcripts (maths/science) | Notation-aware search |
| `TERM` | "coefficient", "mitochondria" | Transcripts, keywords | Vocabulary enrichment |
| `PEDAGOGICAL_PATTERN` | "worked example", "think-pair-share" | Teacher tips, transcripts | Evidence integration (EEF link) |

**Approach options** (to be evaluated during promotion):

- **spaCy + custom curriculum NER model** — train on Oak data, fast
  inference, deterministic, reproducible
- **LLM-based extraction** — higher quality, higher cost, requires
  caching/batching strategy
- **Hybrid** — spaCy for high-frequency patterns, LLM for nuanced
  extraction

**Key constraint**: The 2025-12-26 experiment proved regex extraction
produces 93% noise. Any approach must be ML/NLP-based.

### 4b. Semantic Content Compression

**Goal**: Transform noisy lesson transcripts into dense, clean semantic
representations that preserve pedagogical content while removing speech
artefacts.

**What a compressed representation contains**:

- Core concepts taught (ordered by introduction sequence)
- Relationships between concepts (builds-on, contrasts-with, requires)
- Prerequisite knowledge assumed by the teacher
- Misconceptions explicitly addressed
- Key vocabulary introduced or reinforced
- Learning progression within the lesson

**What is removed**:

- Teacher names and personal references
- Classroom management ("please sit down", "well done")
- Repetition (the same concept explained three ways — keep the clearest)
- Filler and hedging ("um", "so basically", "right, okay")
- Tangential anecdotes (unless pedagogically relevant)

**Why this is high-value**: ELSER and BM25 both perform better on
dense, topically focused text than on noisy transcripts. A 500-word
compressed version of a 5,000-word transcript concentrates the semantic
signal by 10x. This directly improves search recall and precision.

**Metadata integration**: The compression process should consume not
just the transcript but also the lesson's structured metadata —
keywords, learning points, misconceptions, prior knowledge — as
semantic context. This ensures the compressed output is grounded in the
curriculum's own understanding of what the lesson teaches.

### 4c. Knowledge and Relationship Extraction

**Goal**: Build richer relationship graphs from curriculum content,
going beyond what structured field extraction captures.

| Relationship | Example | Source |
|-------------|---------|--------|
| `concept-requires` | "fractions" requires "division" | Transcripts + prior knowledge |
| `misconception-addressed-by` | "area = perimeter" addressed by "comparing-area-and-perimeter" | Misconceptions + lesson content |
| `concept-deepens` | "place value" (Y2) deepens to "place value to millions" (Y5) | Thread progression + transcript analysis |
| `pedagogical-approach-used` | "worked example" used in "solving-linear-equations" | Transcript pattern detection |
| `vocabulary-introduced` | "denominator" first introduced in Y3 fractions | Cross-lesson entity tracking |
| `cross-subject-connection` | "ratio" in maths ↔ "concentration" in chemistry | Cross-subject entity co-occurrence |

These relationships enrich:

- The **prerequisite graph** (currently structural, could become semantic)
- The **misconception graph** (currently flat, could gain response links)
- A new **concept progression graph** (how concepts deepen across years)
- **MCP tool responses** (richer context for any curriculum query)

## 5. Plans Subsumed or Extended

This plan subsumes or extends the following:

| Plan | Relationship | What Moves Here |
|------|-------------|-----------------|
| `vocabulary-mining.md` Phase 4 (Transcript Mining) | **Subsumed** — transcript processing moves to the Python workspace | LLM-based synonym extraction from transcripts |
| `vocabulary-mining.md` Phase 5 (Entity Extraction) | **Subsumed** — NER moves to Python | Entity type identification (CONCEPT, TOPIC, SKILL, etc.) |
| `10-transcript-mining.md` (archived) | **Superseded** — the archived plan's intent is fully captured here with a better architecture | All phases; Python replaces the proposed TypeScript+LLM approach |
| `bulk-metadata-opportunities.research.md` | **Extended** — research findings about unwired extractors feed input requirements | Orphan extractor signals become Python inputs |
| `vocabulary-glossary-and-mining-surfaces.research.md` | **Extended** — transcript-derived and definition-derived assets are produced here | Glossary candidates, provenance-tagged vocabulary |

**Not subsumed** (remain independent):

- `vocabulary-mining.md` Phases 1–3 (synonym classification, science
  expansion, definition mining) — these are TypeScript-native,
  operating on structured data. They remain in the existing pipeline.
- `bulk-metadata-quick-wins.execution.plan.md` — wiring existing
  TypeScript extractors into `processBulkData()`. Orthogonal.
- `misconception-graph-mcp-surface.plan.md` — MCP surface wiring for
  existing data. This plan produces richer data it could consume.
- `open-education-knowledge-surfaces.plan.md` — parent coordination
  plan. This plan feeds it but doesn't replace it.

## 6. Domain Boundaries

### In Scope

- Python workspace setup and Turbo integration
- NER and entity extraction from unstructured curriculum text
- Semantic compression of lesson transcripts
- Knowledge and relationship extraction
- Output artefact format and versioning
- Quality validation and confidence scoring
- Integration contract with TypeScript consumers

### Non-Goals

- **Replacing the TypeScript extractors** — structural extraction of
  tagged fields stays in TypeScript. Python handles unstructured text.
- **Runtime ML inference** — all processing is codegen-time. No Python
  in the deployed MCP server.
- **Training custom large models** — use pre-trained models (spaCy,
  sentence-transformers) and/or LLM APIs. Fine-tuning is a later
  consideration.
- **Real-time processing** — batch processing of bulk downloads, not
  streaming. Processing time budget: minutes to hours, not milliseconds.
- **Replacing the ontology** — the formal W3C-compliant ontology
  (oak-curriculum-ontology) is a different system. This plan produces
  complementary data, not a competing knowledge graph.

## 7. Dependencies and Sequencing

| Dependency | Status | Blocks |
|------------|--------|--------|
| Bulk data downloads available | Production (via `oak-search-cli`) | All processing |
| `pnpm workspace` supports non-JS packages | Needs validation | Turbo integration |
| Python 3.13+ available in CI | Needs validation | CI pipeline |
| spaCy / transformers / LLM API access | Available | NER, compression |
| Existing TypeScript extractors stable | Production | Input data shapes |

### Sequencing Assumptions

1. **Phase 0**: Workspace setup and Turbo integration spike — validate
   that a Python workspace works in the pnpm monorepo with Turbo
   orchestration
2. **Phase 1**: NER on lesson transcripts (highest existing research
   evidence, clearest value)
3. **Phase 2**: Semantic compression (highest novel value, most
   impactful for search quality)
4. **Phase 3**: Relationship extraction (builds on Phases 1–2 outputs)
5. **Phase 4**: Integration — artefacts consumed by SDK, MCP, search

Phases 1–3 are somewhat independent and could be parallelised once
the workspace infrastructure is established.

## 8. Technical Considerations

### Python Ecosystem

The `algo-experiments` repo provides the reference pattern:

- **uv** for dependency management and virtual environments
- **Hatchling** as build backend
- **pyproject.toml** as single configuration file
- **ruff** for linting and formatting
- **pyright** for type checking
- **pytest** for testing
- **import-linter** for architectural boundary enforcement
- **devtools.py** as quality gate runner

### Candidate Dependencies

| Package | Purpose | Notes |
|---------|---------|-------|
| `spacy` | NER, tokenisation, POS tagging | Core NLP; train custom curriculum model |
| `sentence-transformers` | Semantic similarity, clustering | For relationship extraction |
| `scikit-learn` | Classification, clustering | For entity type classification |
| `pydantic` | Data validation, output schemas | Strict typing for artefacts |
| `orjsonl` or `orjson` | Fast JSON I/O | Bulk data reading |

Optional/later:
| `transformers` | LLM-based extraction | If local model approach chosen |
| `openai` / `anthropic` | LLM API clients | If API-based approach chosen |

### Output Format

Outputs should be JSON datasets with typed TypeScript loader stubs,
following the established pattern from
`packages/sdks/oak-sdk-codegen/src/generated/vocab/`:

```text
outputs/
├── entities/
│   ├── data.json              # Entity index
│   └── index.ts               # Typed loader (committed)
├── compressed/
│   ├── data.json              # Compressed lesson content
│   └── index.ts               # Typed loader (committed)
├── relationships/
│   ├── data.json              # Relationship graph
│   └── index.ts               # Typed loader (committed)
└── manifest.json              # Processing metadata
```

The TypeScript loaders are thin: they import the JSON and re-export
with types. Consumers import from the package's public surface.

### Cost Considerations

If LLM-based extraction is chosen:

- ~47K lessons with transcripts
- Average transcript: ~3,000–5,000 words
- Estimated tokens per lesson: ~5K–8K input + ~500–1K output
- Total: ~250M–400M input tokens
- At current API pricing, full processing: £500–£2,000
- **Mitigation**: incremental processing, caching, sampling strategy,
  local models where quality is sufficient

## 9. Success Signals (Promotion Triggers)

This plan should be promoted to `current/` when:

1. **Workspace spike succeeds** — a Python workspace runs in Turbo with
   `pnpm test` executing `uv run test` successfully
2. **NER prototype produces useful entities** — manual review of a
   50-lesson sample shows >70% precision on entity extraction
3. **Semantic compression prototype improves search** — A/B comparison
   shows compressed content outperforms raw transcripts in ELSER
   retrieval on a ground-truth query set
4. **Cost model is viable** — processing budget for full curriculum is
   understood and acceptable

Any one of these could justify promotion of the relevant phase
independently.

## 10. Risks and Unknowns

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| pnpm + Turbo + Python integration is fragile | Medium | High | Spike first; `package.json` scripts are a thin bridge |
| NER quality on curriculum text is poor with generic models | Medium | Medium | Fine-tune on Oak data; start with high-frequency subjects |
| Semantic compression loses pedagogically important nuance | Medium | High | Human review of samples; structured metadata as grounding input |
| LLM costs make full-curriculum processing prohibitive | Low | Medium | Incremental processing; local models; sampling |
| CI environment lacks Python / uv | Low | Medium | Docker-based CI step; or separate pipeline |
| Output format evolves, breaking TypeScript consumers | Low | Medium | Versioned manifest; typed loaders with schema validation |
| Transcript coverage is patchy (not all lessons have transcripts) | Known | Low | Non-transcript sources (descriptions, tips) are also valuable |

## 11. Relationship to Other Systems

```text
                    ┌──────────────────────────┐
                    │   Bulk Data Downloads     │
                    │   (~47K lessons, JSON)     │
                    └─────────┬────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │  TypeScript   │  │   Python     │  │  Ontology    │
   │  Extractors   │  │   NLP        │  │  (RDF/OWL)   │
   │  (structural) │  │  (semantic)  │  │  (formal)    │
   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
          │                 │                 │
          ▼                 ▼                 ▼
   ┌─────────────────────────────────────────────┐
   │          Committed Artefacts                 │
   │  (JSON datasets, TS constants, graphs)       │
   └─────────────────────┬───────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
   ┌───────────┐  ┌───────────┐  ┌───────────┐
   │ MCP Tools │  │  Search   │  │    SDK    │
   │ Resources │  │ Ingestion │  │  Exports  │
   └───────────┘  └───────────┘  └───────────┘
```

The three extraction systems are complementary:

- **TypeScript extractors**: fast, deterministic, structured fields
- **Python NLP**: semantic, ML-based, unstructured text
- **Ontology**: formal, W3C-compliant, expert-authored

All three produce committed artefacts consumed by the same downstream
systems.

## 12. Reference: `algo-experiments` Pattern

The `/Users/jim/code/personal/algo-experiments` repo provides the
reference implementation for the Python workspace setup:

- `pyproject.toml` with `[tool.uv] package = true`
- Hatchling build backend with `packages = ["python"]`
- `[dependency-groups] dev` for dev dependencies
- `[project.scripts]` for quality gate entry points
- `python/devtools.py` as the check/lint/test orchestrator
- `ruff` for linting + formatting, `pyright` for types, `pytest` for
  tests, `import-linter` for architectural boundaries
- `.pre-commit-config.yaml` running `uv run check`

The key adaptation for this monorepo: add a `package.json` that
delegates to `uv` so Turbo can orchestrate the workspace.

## 13. Implementation Detail Note

This is a `future/` strategic brief. The specific choices about:

- Which NLP models to use (spaCy vs transformers vs LLM API)
- Exact output schema shapes
- Processing batch sizes and caching strategy
- CI integration approach
- The precise boundary between Python and TypeScript extraction

are **not committed here**. They will be finalised during promotion to
`current/`/`active/` based on spike results and the state of the
ecosystem at that time.

## Foundation Documents (Mandatory Re-read at Promotion)

1. [principles.md](../../../directives/principles.md)
2. [testing-strategy.md](../../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../../directives/schema-first-execution.md)

First question: Could it be simpler without compromising quality?

## Related Documents

| Document | Relationship |
|----------|-------------|
| [vocabulary-mining.md](03-vocabulary-and-semantic-assets/vocabulary-mining.md) | Phases 4–5 subsumed; Phases 1–3 remain independent |
| [10-transcript-mining.md](../../archive/semantic-search-archive-dec25/part-1-search-excellence/10-transcript-mining.md) | Archived predecessor — fully superseded |
| [bulk-metadata-opportunities.research.md](03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md) | Research input — signal inventory |
| [vocabulary-glossary-and-mining-surfaces.research.md](03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md) | Research input — asset model |
| [curriculum-asset-opportunity-map.research.md](../curriculum-asset-opportunity-map.research.md) | Research input — opportunity tiers |
| [open-education-knowledge-surfaces.plan.md](../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) | Parent coordination — outputs feed MCP surfaces |
| [evidence-integration-strategy.md](../../knowledge-graph-integration/future/evidence-integration-strategy.md) | Sibling — `PEDAGOGICAL_PATTERN` entities link to EEF strands |
| [kg-alignment-audit.execution.plan.md](../current/kg-alignment-audit.execution.plan.md) | Sibling — ontology alignment informs relationship extraction |
