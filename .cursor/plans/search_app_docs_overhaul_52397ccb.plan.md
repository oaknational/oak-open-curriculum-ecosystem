---
name: Search App Docs Overhaul
overview: Comprehensive update of all documentation in `apps/oak-open-curriculum-semantic-search/docs/` to fix broken references, remove ephemeral plan links, update outdated information, and align with the CLI/SDK strategic direction.
todos:
  - id: readme-fix
    content: Fix README.md - remove deleted file reference, update guide list, add ADR section
    status: completed
  - id: architecture-update
    content: Update ARCHITECTURE.md - fix index count (7 not 4), update commands, add CLI/SDK note
    status: completed
  - id: setup-update
    content: Update SETUP.md - fix quality gate commands, review env vars
    status: completed
  - id: indexing-enhance
    content: Enhance INDEXING.md - add ADR references section
    status: completed
  - id: querying-fix
    content: Fix QUERYING.md - verify queries, remove plan reference, add ADRs
    status: completed
  - id: synonyms-verify
    content: Verify SYNONYMS.md - check SDK location accuracy
    status: completed
  - id: rollup-update
    content: Update ROLLUP.md - reflect current implementation, add ADR-077
    status: completed
  - id: sdk-endpoints-review
    content: Review SDK-ENDPOINTS.md - add deprecation notice if needed
    status: completed
  - id: sdk-caching-fix
    content: Fix SDK-CACHING.md - remove prompt file reference
    status: completed
  - id: es-setup-fix
    content: Fix ES_SERVERLESS_SETUP.md - remove deleted file reference
    status: completed
  - id: harness-update
    content: Update ingestion-harness.md - reflect current CLI and fixtures
    status: completed
  - id: ingestion-guide-enhance
    content: Enhance INGESTION-GUIDE.md - add ADR references section
    status: completed
  - id: diagnostic-fix
    content: Fix DIAGNOSTIC-QUERIES.md - remove plan references, add ADRs
    status: completed
  - id: new-subject-verify
    content: Verify NEW-SUBJECT-GUIDE.md - check workflow accuracy
    status: completed
  - id: theming-deprecate
    content: Add deprecation header to oak-components-theming.md
    status: completed
  - id: final-validation
    content: Run markdownlint and verify all cross-references
    status: completed
---

# Search App Documentation Overhaul

Update all 14 markdown files in `apps/oak-open-curriculum-semantic-search/docs/` to be accurate, self-contained, and reference ADRs instead of ephemeral plans.---

## Guiding Principles

1. **Permanent docs must not reference plans** - Plans are ephemeral; use ADRs for architectural context
2. **Reference ADRs for decisions** - Rich ADR library exists at `docs/architecture/architectural-decisions/`
3. **Align with CLI/SDK direction** - De-emphasize UI-focused content
4. **Fix all broken references** - Several files reference deleted documents

---

## File-by-File Changes

### 1. [README.md](apps/oak-open-curriculum-semantic-search/docs/README.md)

**Issues**: References deleted file `oak-curriculum-hybrid-search-definitive-guide.md`**Changes**:

- Remove reference to deleted `oak-curriculum-hybrid-search-definitive-guide.md`
- Update guide list to reflect actual files
- Add section linking to relevant ADRs for architectural decisions

---

### 2. [ARCHITECTURE.md](apps/oak-open-curriculum-semantic-search/docs/ARCHITECTURE.md)

**Issues**: Says "four indices" but there are 7; heavy UI focus; references `pnpm make`/`pnpm qg`**Changes**:

- Update index table to show all 7 indices: `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_threads`, `oak_sequences`, `oak_sequence_facets`, `oak_meta`
- Update quality gate commands to current set (`pnpm type-gen`, `pnpm build`, etc.)
- Add note that UI is deprecated in favor of CLI/SDK
- Add ADR references:
- [ADR-067](docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md) - SDK-generated mappings
- [ADR-076](docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) - ELSER strategy
- [ADR-093](docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) - Bulk-first ingestion

---

### 3. [SETUP.md](apps/oak-open-curriculum-semantic-search/docs/SETUP.md)

**Issues**: References `pnpm make`/`pnpm qg`; some env vars may be outdated**Changes**:

- Update quality gate commands section to current:
  ```bash
      pnpm type-gen && pnpm build && pnpm type-check
      pnpm lint:fix && pnpm format:root && pnpm markdownlint:root
      pnpm test && pnpm test:e2e
  ```




- Review and update environment variable list against current `.env.example`
- Remove references to any ephemeral plan files

---

### 4. [INDEXING.md](apps/oak-open-curriculum-semantic-search/docs/INDEXING.md)

**Issues**: Generally current but should reference ADRs**Changes**:

- Add ADR references section:
- [ADR-064](docs/architecture/architectural-decisions/064-elasticsearch-mapping-organization.md) - Mapping organization
- [ADR-067](docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md) - SDK-generated mappings
- [ADR-087](docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) - Batch-atomic ingestion
- [ADR-096](docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) - Bulk retry strategy
- Verify field expectations match current SDK field definitions

---

### 5. [QUERYING.md](apps/oak-open-curriculum-semantic-search/docs/QUERYING.md)

**Issues**: Sample queries may not match current RRF; plan references in "See Also"**Changes**:

- Verify sample JSON queries match current implementation in `src/lib/hybrid-search/`
- Remove reference to `semantic-search-api-plan.md` in final paragraph
- Add ADR references:
- [ADR-076](docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) - ELSER strategy
- [ADR-084](docs/architecture/architectural-decisions/084-phrase-query-boosting.md) - Phrase boosting

---

### 6. [SYNONYMS.md](apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md)

**Issues**: Generally current but verify accuracy**Changes**:

- Verify synonym location matches current SDK structure
- Ensure ADR references are present (already has ADR-084, ADR-063)
- No major changes expected - this file is well-maintained

---

### 7. [ROLLUP.md](apps/oak-open-curriculum-semantic-search/docs/ROLLUP.md)

**Issues**: Generic process description; may not reflect current implementation**Changes**:

- Update to reflect current rollup implementation
- Add reference to [ADR-077](docs/architecture/architectural-decisions/077-semantic-summary-generation.md) - Semantic summary generation
- Verify against actual code in `src/lib/elasticsearch/rollup/`
- Consider consolidating into INDEXING.md if content is minimal

---

### 8. [SDK-ENDPOINTS.md](apps/oak-open-curriculum-semantic-search/docs/SDK-ENDPOINTS.md)

**Issues**: Parity endpoints may no longer be actively used**Changes**:

- Add deprecation notice if endpoints are not actively maintained
- Verify endpoints still exist and work
- If deprecated, move to an "Archive" section or delete

---

### 9. [SDK-CACHING.md](apps/oak-open-curriculum-semantic-search/docs/SDK-CACHING.md)

**Issues**: Contains reference to `.agent/prompts/` (plan file)**Changes**:

- Remove reference to `.agent/prompts/semantic-search/semantic-search.prompt.md` at line 235
- Add ADR references:
- [ADR-066](docs/architecture/architectural-decisions/066-sdk-response-caching.md) - SDK response caching
- [ADR-079](docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md) - TTL jitter

---

### 10. [ES_SERVERLESS_SETUP.md](apps/oak-open-curriculum-semantic-search/docs/ES_SERVERLESS_SETUP.md)

**Issues**: References deleted `semantic-search-overview.md`**Changes**:

- Remove reference to `semantic-search-overview.md` (line 125)
- Add ADR reference:
- [ADR-076](docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) - ELSER strategy

---

### 11. [ingestion-harness.md](apps/oak-open-curriculum-semantic-search/docs/ingestion-harness.md)

**Issues**: Old fixture structure; actual CLI has evolved**Changes**:

- Update to reflect current CLI commands and fixture structure
- Verify against `src/lib/elasticsearch/setup/ingest-live.ts`
- Add ADR references:
- [ADR-087](docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) - Batch-atomic ingestion
- [ADR-093](docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) - Bulk-first strategy

---

### 12. [INGESTION-GUIDE.md](apps/oak-open-curriculum-semantic-search/docs/INGESTION-GUIDE.md)

**Issues**: Generally current (2025-12-20)**Changes**:

- Verify CLI commands still accurate
- Add ADR references section:
- [ADR-083](docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) - Lesson enumeration
- [ADR-093](docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) - Bulk-first strategy
- [ADR-096](docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) - Retry strategy

---

### 13. [DIAGNOSTIC-QUERIES.md](apps/oak-open-curriculum-semantic-search/docs/DIAGNOSTIC-QUERIES.md)

**Issues**: References deleted `part-1-search-excellence.md`**Changes**:

- Remove reference to `part-1-search-excellence.md` (lines 8, 183, 184)
- Replace with ADR references:
- [ADR-082](docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) - Fundamentals-first strategy
- [ADR-084](docs/architecture/architectural-decisions/084-phrase-query-boosting.md) - Phrase boosting
- [ADR-081](docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) - Evaluation framework

---

### 14. [NEW-SUBJECT-GUIDE.md](apps/oak-open-curriculum-semantic-search/docs/NEW-SUBJECT-GUIDE.md)

**Issues**: Generally current (2025-12-20)**Changes**:

- Verify workflow steps still accurate
- Ensure all ADR references are current (already has ADR-063)
- No major changes expected

---

### 15. [oak-components-theming.md](apps/oak-open-curriculum-semantic-search/docs/oak-components-theming.md)

**Issues**: Detailed UI theming guide when app is becoming CLI/SDK only**Changes**:

- Add deprecation header noting UI layer is being retired
- Reference [ADR-045](docs/architecture/architectural-decisions/045-hybrid-theming-bridge-for-oak-components.md) - Theming bridge
- Consider moving to archive folder in future

---

## Additional Tasks

### Update "Last Updated" dates

- All modified files should have accurate "Last Updated" date

### Verify cross-references

- After all updates, verify internal links between docs work

### Run markdownlint

- `pnpm markdownlint:root` to ensure formatting compliance

---

## ADR Reference Summary

Key ADRs for search documentation:| ADR | Topic ||-----|-------|| 063 | SDK Domain Synonyms Source of Truth || 064 | Elasticsearch Index Mapping Organization || 067 | SDK Generated Elasticsearch Mappings || 076 | ELSER-Only Embedding Strategy || 077 | Semantic Summary Generation || 081 | Search Approach Evaluation Framework || 082 | Fundamentals-First Search Strategy || 083 | Complete Lesson Enumeration Strategy || 084 | Phrase Query Boosting || 087 | Batch-Atomic Ingestion |