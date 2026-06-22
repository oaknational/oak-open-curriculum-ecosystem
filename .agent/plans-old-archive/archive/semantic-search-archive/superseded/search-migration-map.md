# Search Schema Migration Order

_Last updated: 2025-11-11_  
_Status: REFERENCE DOCUMENT_

## Overview

This document outlines the phased migration strategy for replacing runtime-defined search schemas with SDK-generated artifacts, ensuring minimal regression. For detailed implementation sessions, see [Search Service Implementation Plan](search-service/schema-first-ontology-implementation.md).

**Migration Phases Summary:**

- **Phase 0**: SDK generator updates
- **Phase 1**: Central SDK re-exports
- **Phase 2**: Application type replacement
- **Phase 3**: Fixture builder alignment
- **Phase 4**: Search library updates
- **Phase 5**: OpenAPI registration & docs
- **Phase 6**: Cleanup & verification

## Phase 0 – SDK Generator Updates

- **Prerequisites**: Generator specification implemented; new modules emitted under `src/types/generated/search`.
- **Artifacts**: `requests.ts`, `responses.*.ts`, `suggestions.ts`, `parsed-query.ts`, `scopes.ts`, `fixtures.ts`.
- **Validation**: `pnpm type-gen`, `pnpm type-check` inside SDK package; generator unit tests covering new writers.

## Phase 1 – Central SDK Re-exports

- **Tasks**:
  - Update `packages/sdks/oak-curriculum-sdk/src/types/oak.ts` (or equivalent barrel) to re-export new search artefacts.
  - Ensure search app re-imports everything from `apps/oak-search-cli/src/types/oak.ts`, which should only proxy SDK exports.
- **Dependencies**: Phase 0 completed.
- **Validation**: `pnpm type-check` in SDK and search app to confirm re-export wiring.

## Phase 2 – Application Type Replacement

- **Targets**:
  - `app/ui/structured-search.shared.ts` → delete local Zod + type aliases; replace with SDK exports such as `SearchStructuredRequestSchema`, `SearchSuggestionResponseSchema`, and `SearchMultiScopeResponseSchema`.
  - `app/ui/client/useSearchController.ts`, `app/ui/SearchResults.shared.tsx`, `app/ui/NaturalSearch.helpers.ts` → consume generated guards (`isSearchStructuredRequest`, `isSearchSuggestionResponse`) and types (`SearchSuggestionItem`, `SearchLessonsResponse`).
  - API routes (`/api/search`, `/api/search/nl`, `/api/search/suggest`, `/api/sdk/search-*`) → rely on SDK schemas from `src/types/generated/search` instead of local validators.
- **Approach**: Swap imports, remove redundant helper types, adapt code to use generated guard functions.
- **Validation**: `pnpm -C apps/oak-search-cli type-check` plus existing unit/integration suites.

## Phase 3 – Fixture Builder Alignment

- **Targets**:
  - `app/ui/search-fixtures/builders/*` → import generated fixtures (`createSearchLessonsResponse`, etc.) and type aliases (`SearchMultiScopeBucket`).
  - Ensure `DEFAULT_SUGGESTION_CACHE` constant and dataset typing flow from SDK `suggestions.ts`/`fixtures.ts` modules.
- **Dependencies**: Phase 2 complete (shared schema module removed).
- **Validation**: Fixture unit tests (`single-scope.unit.test.ts`, etc.) updated to use generator guard helpers; run `pnpm -C apps/oak-search-cli test --filter "fixtures"`.

## Phase 4 – Search Library Updates

- **Targets**:
  - `src/lib/hybrid-search/types.ts`, `run-hybrid-search.ts`, `suggestions/types.ts`, `search-index-target.ts`, `observability/zero-hit*`.
  - Replace manual interfaces with generated exports or utility enums from SDK.
- **Approach**: Gradually migrate each module, starting with read-only type replacements to minimise behavioural change.
- **Validation**: `pnpm -C apps/oak-search-cli test` and targeted integration tests (`structured-search.actions.integration.test.ts`).

## Phase 5 – OpenAPI Registration & Docs

- **Targets**: `src/lib/openapi.schemas.ts`, `src/lib/openapi.register.ts`.
- **Approach**: Remove manual schema definitions; import generated Zod schemas, ensuring documentation metadata attaches correctly.
- **Dependencies**: Earlier phases to guarantee schemas exist in SDK.
- **Validation**: Run OpenAPI generation pipeline (`pnpm type-gen`, `pnpm build`), confirm docs still render.

## Phase 6 – Cleanup & Verification

- **Tasks**:
  - Delete obsolete files (`structured-search.shared.ts`, manual schema helpers) once replacements land.
  - Run full quality gate (`pnpm qg`).
  - Update plan/context docs with new data flow; note removal of custom schemas.

## Cross-Cutting Concerns

- **Fixture Mode Resolver**: Ensure generated guard exports integrate with forthcoming fixture toggle work.
- **Testing**: Expand tests to cover generated guard functions; maintain Playwright coverage with fixtures on/off.
- **Documentation**: Update project documentation to reflect compile-time schema flow and migration completion.

## Dependencies Summary

1. Generator outputs available in SDK.
2. Search app re-exports updated.
3. UI/API modules migrated.
4. Fixtures & libraries migrated.
5. OpenAPI + docs updated.
6. Cleanup + quality gate.

Validation should happen after each phase with explicit commands recorded in the GO todo list.

## Plan Alignment

- Matches the UX plan fixtures-first approach (Phase 2 aligns with ACTION 7–10 in `semantic-search-phase-1-ux.md`).
- Supports continuation prompt priority to introduce shared SDK-derived schema module before fixture rewiring.
- Provides dependency checkpoints needed before wiring runtime fixture resolver and status page efforts noted in the context snapshot.
