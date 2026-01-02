# Feature Goals and Roadmap Alignment

**Scope**: Features that deliver end-user value via SDK/CLI and search services. UI is out of scope. The `app/api` layer is no longer in scope; delivery will be via a separate UI and MCP tool (potentially in a separate repository).
**Roadmap**: `.agent/plans/semantic-search/roadmap.md`

## Parity goals (impact ordered)

1. **Ship a stable, supported search contract (SDK-first)**

- End-user value: a reliable, documented search surface matching the legacy system's availability.
- Required because parity cannot be achieved without a real contract for UI/MCP consumers.
- Dependencies: schema-first SDK contract, versioning, fixtures/test harness, and integration guidance.
- A full, detailed OpenAPI 3.1.x contract with rich metadata is required.

2. **Multi-select filters for core dimensions**

- End-user value: same filtering freedom as legacy search (subjects, key stages, year groups, exam boards, content types).
- Requires breaking schema change to allow arrays (no compatibility layers).
- Dependencies: SDK schema update, generated mappings, filter builders, evaluation tests.

3. **Cohort filtering (legacy vs new content)**

- End-user value: ability to filter to the new cohort equivalent of "Show new only".
- Requires cohort fields in index documents and ingestion.
- Dependencies: SDK schema update, ingestion changes, terms filters.

4. **Interleaved mixed-content ranking**

- End-user value: single ranked list across lessons + units (legacy behaviour).
- Current multi-scope buckets are not sufficient for parity.
- Dependencies: combined ranking strategy and consistent pagination.

5. **Deterministic intent-based suggested filters**

- End-user value: intent hints similar to legacy AI suggestions, without LLM dependency.
- Can be rule-based first, LLM later.

## Exceed goals (impact ordered)

1. **Pedagogical intent understanding + metadata enrichment**

- End-user value: handles queries like "extension", "visual", "beginner" that are not consistently served today.
- Aligns with Tier 4 gaps in search acceptance criteria.

2. **Relationship-aware ranking (threads and sequences)**

- End-user value: progression-aware results and more coherent learning pathways.
- Uses data you already index (threads, sequences, facets).

3. **Search quality tuning with measurable gains**

- End-user value: demonstrably improved results compared with today's baseline.
- Requires experiment cadence (RRF tuning, retriever ablations, phrase and synonym tuning).

4. **Typeahead with curriculum vocabulary and contexts**

- End-user value: faster discovery and fewer zero-result searches.
- You already have ES data for completion contexts; needs integration and evaluation.

5. **Observability-driven improvements**

- End-user value: rapid fixes for real search failures.
- Requires zero-hit logging and feedback loops in the delivery surface (UI/MCP), plus ingestion telemetry here.

## Other high-impact enablers

- **Milestone 3: Synonym quality audit**
  - Improves search quality for both parity and exceed work.
- **Milestone 4: DRY/SRP refactor of document builders**
  - Reduces ingestion complexity and speeds up future feature delivery.
- **Evaluation discipline**
  - Enforce acceptance criteria gates for any search changes.

## Roadmap alignment

Roadmap: `.agent/plans/semantic-search/roadmap.md`

| Goal                          | Roadmap alignment             | Notes                                                                                       |
| ----------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| Stable search contract        | **Milestone 13**              | SDK-first contract for UI/MCP consumers.                                                    |
| Multi-select filters          | **Milestone 13**              | Requires SDK schema + ingestion changes.                                                    |
| Cohort filtering              | **Milestone 13**              | Requires new index fields and ingestion logic.                                              |
| Mixed-content ranking         | **Milestone 13**              | Needs explicit design and evaluation.                                                       |
| Deterministic intent filters  | **Milestone 13**              | Can start rule-based, then LLM.                                                             |
| Pedagogical intent enrichment | **Milestone 14**              | Collaboration-led improvement beyond the current system.                                    |
| Relationship-aware ranking    | **Milestone 14**              | Uses sequences/threads for progression-aware ranking.                                       |
| Search quality tuning         | **Ongoing across milestones** | Tie to acceptance criteria in `.agent/plans/semantic-search/search-acceptance-criteria.md`. |
| Typeahead integration         | **Milestone 14**              | ES data exists; surface via SDK for UI/MCP.                                                 |
| Synonym quality audit         | **Milestone 3**               | Already defined as pending.                                                                 |
| DRY/SRP refactor              | **Milestone 4**               | Already defined as high priority.                                                           |

## Proposed sequencing (high-level)

1. Execute Milestone 3 and 4 (synonyms + builder refactor) to stabilise ingestion and quality.
2. Deliver Milestone 13 (parity) via SDK contract and ingestion changes for UI/MCP consumers.
3. Deliver Milestone 14 (collaboration-led improvements beyond the current system), including typeahead and relationship-aware ranking.
