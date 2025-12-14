# Phase 5: Search UI

**Status**: 📋 PLANNED  
**Estimated Effort**: 3-4 days  
**Prerequisites**: Phase 3 (Multi-Index Search & Fields)  
**Last Updated**: 2025-12-13

---

## Foundation Documents (MUST READ)

Before starting any work on this phase:

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
3. `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

**All quality gates must pass. No exceptions.**

---

## Overview

Create a comprehensive, functional search experience that prioritises **portability over aesthetics**. The UI should be clean and functional, easily portable to future Oak applications.

### Key Principles

1. **Functional over aesthetic** - Clean, working UI; styling can be refined later
2. **Portable components** - Self-contained, minimal external dependencies
3. **URL-based state** - Shareable searches via query parameters

---

## Scope

### Core Features

| Feature                    | Description                                | Priority     |
| -------------------------- | ------------------------------------------ | ------------ |
| **Search box**             | Input with typeahead/suggestions           | **CRITICAL** |
| **Results list**           | Display with highlighting, type indicators | **CRITICAL** |
| **Faceted filtering**      | Subject, key stage, tier, exam board       | **HIGH**     |
| **Pagination**             | Navigate result pages                      | **HIGH**     |
| **Result type indicators** | Visual distinction: lesson vs unit         | **HIGH**     |
| **Responsive layout**      | Works on desktop and tablet                | **MEDIUM**   |
| **Loading states**         | Skeleton/spinner during search             | **MEDIUM**   |
| **Empty states**           | Clear messaging when no results            | **MEDIUM**   |

### Out of Scope (Phase 5)

- Oak brand styling (deferred to porting phase)
- Advanced filtering (prerequisites, NC alignment)
- Saved searches / history
- User authentication
- Analytics integration

---

## Architecture Decisions

### Component Library

**Decision needed**: React components with minimal dependencies

Options:

1. **Vanilla React** - Maximum portability, more boilerplate
2. **Headless UI** (Tailwind Labs) - Accessible primitives, no styling
3. **Radix UI** - Unstyled accessible components

**Recommendation**: Headless UI or Radix UI for accessible primitives, custom styling.

### State Management

**Decision**: URL-based state for search parameters

```typescript
// All search state in URL query params
/search?q=pythagoras&subject=maths&keystage=ks4&tier=higher&page=1

// Benefits:
// - Shareable searches
// - Browser back/forward works
// - Bookmarkable
// - Server-renderable
```

### API Integration

Use existing search endpoints from Phase 3:

```typescript
// Lesson search
GET /api/search?q={query}&subject={subject}&keystage={keystage}

// Unit search
GET /api/units/search?q={query}&subject={subject}&keystage={keystage}

// Unified search (if implemented in Phase 3)
GET /api/search?q={query}&type=lesson,unit
```

---

## Component Structure

```text
apps/oak-open-curriculum-semantic-search/src/components/
├── search/
│   ├── SearchBox.tsx              # Input with typeahead
│   ├── SearchResults.tsx          # Results container
│   ├── SearchResultItem.tsx       # Single result display
│   ├── SearchFacets.tsx           # Filter sidebar
│   ├── SearchPagination.tsx       # Page navigation
│   ├── SearchEmpty.tsx            # No results state
│   ├── SearchLoading.tsx          # Loading state
│   └── index.ts                   # Barrel exports
├── ui/
│   ├── Badge.tsx                  # Type indicators
│   ├── Checkbox.tsx               # Filter checkboxes
│   ├── Input.tsx                  # Base input
│   └── index.ts
└── hooks/
    ├── useSearch.ts               # Search state management
    ├── useSearchParams.ts         # URL state sync
    └── useFacets.ts               # Facet state
```

---

## Implementation Tasks

### Phase 5a: Core Search (2 days)

| Task                  | Description                               | Test Type   |
| --------------------- | ----------------------------------------- | ----------- |
| `SearchBox` component | Input with debounced search, clear button | Unit        |
| `useSearch` hook      | Manage search state, API calls            | Integration |
| `SearchResults` list  | Display results with type indicators      | Unit        |
| `SearchResultItem`    | Single result: title, snippet, metadata   | Unit        |
| URL state sync        | Sync search params to URL                 | Integration |
| Loading/empty states  | Skeleton loader, empty state messaging    | Unit        |

### Phase 5b: Filtering (1.5 days)

| Task                   | Description                           | Test Type   |
| ---------------------- | ------------------------------------- | ----------- |
| `SearchFacets` sidebar | Filter UI with counts                 | Unit        |
| `useFacets` hook       | Manage filter state, sync with search | Integration |
| Subject filter         | Multi-select subject filter           | Integration |
| Key stage filter       | Multi-select key stage filter         | Integration |
| Tier filter            | Foundation/Higher toggle              | Integration |
| Clear filters          | Reset all filters                     | Unit        |

### Phase 5c: Polish (0.5 days)

| Task                | Description                     | Test Type   |
| ------------------- | ------------------------------- | ----------- |
| Pagination          | Page navigation with URL update | Integration |
| Keyboard navigation | Arrow keys for results          | E2E         |
| Accessibility audit | Screen reader, focus management | E2E         |
| Documentation       | Component API docs              | -           |

---

## TDD Requirements

| Component          | Test First                                              |
| ------------------ | ------------------------------------------------------- |
| `SearchBox`        | Test: renders input, calls onSearch on submit           |
| `useSearch`        | Test: returns results, loading, error states            |
| `SearchResultItem` | Test: displays title, snippet, type badge               |
| `SearchFacets`     | Test: renders filters, calls onFilter on change         |
| Page integration   | E2E: search flow from input to results to click-through |

**Write tests FIRST, then implement components.**

---

## Acceptance Criteria

- [ ] Search box with typeahead suggestions working
- [ ] Results display with lesson/unit type indicators
- [ ] All filter combinations work correctly
- [ ] Pagination navigates results
- [ ] URL reflects current search state (shareable)
- [ ] Clean, functional UI (not Oak-branded)
- [ ] Components documented for future porting
- [ ] All quality gates pass

---

## Quality Gates

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui                                      # Playwright component tests
```

**All gates must pass. No exceptions.**

---

## Key Files

### Existing Search Implementation

```text
apps/oak-open-curriculum-semantic-search/
├── src/app/api/search/               # Search API routes
├── src/lib/hybrid-search/            # Query builders
└── src/lib/search-quality/           # Metrics, ground truth
```

### New UI Components

```text
apps/oak-open-curriculum-semantic-search/src/
├── components/search/                # New search UI components
├── components/ui/                    # Shared UI primitives
└── hooks/                            # Search hooks
```

---

## Dependencies

- **Upstream**: Phase 3 (search endpoints, doc_type field)
- **Blocks**: Phase 6 (Admin Dashboard shares UI patterns)

---

## Related Documents

- [Requirements](./requirements.md) - Demo scenarios for UI
- [Phase 3](./phase-3-multi-index-and-fields.md) - Search API foundation
