---
name: Semantic Search Plan Restructure
overview: 'Restructure semantic search planning documents: archive completed phases 1 and 2, break phase 3+ into separate detailed phase files, add new phases for Search UI, Cloud Functions, and Admin Dashboard, and update requirements with new rate limit and scope.'
todos:
  - id: backup-phase3
    content: Create backup of phase-3-plus-roadmap.md before restructuring
    status: completed
  - id: archive-phase1
    content: Move phase-1-foundation.md to archive/ with COMPLETE suffix
    status: completed
  - id: archive-phase2
    content: Move phase-2-dense-vectors.md to archive/ with COMPLETE suffix
    status: completed
  - id: create-phase3
    content: Create phase-3-multi-index-and-fields.md from 3.0 + 3a content
    status: in_progress
  - id: create-phase4
    content: Create phase-4-search-ui.md (new Search UI phase)
    status: pending
  - id: create-phase5
    content: Create phase-5-cloud-functions.md (new Cloud Functions phase)
    status: pending
  - id: create-phase6
    content: Create phase-6-admin-dashboard.md (new Admin Dashboard phase)
    status: pending
  - id: create-phase7
    content: Create phase-7-query-enhancement.md from 3b + 3c content
    status: pending
  - id: create-phase8
    content: Create phase-8-entity-extraction.md from phase 4 content
    status: pending
  - id: create-phase9
    content: Create phase-9-reference-indices.md from phase 5 content
    status: pending
  - id: create-phase10
    content: Create phase-10-plus-future.md (RAG, KG, LTR, resource types)
    status: pending
  - id: update-requirements
    content: Update requirements.md with rate limit (10k/hr), new deliverables, updated criteria
    status: pending
  - id: update-readme
    content: Update README.md with new navigation structure
    status: pending
  - id: update-prompt
    content: Update semantic-search.prompt.md to reflect new phase structure
    status: pending
  - id: delete-old-phase3
    content: Delete phase-3-plus-roadmap.md after content distributed
    status: pending
  - id: verify-completeness
    content: Compare backup against new files to verify no information lost
    status: pending
---

# Semantic Search Plan Restructuring

## Objective

Reorganise semantic search planning documents to reflect completed work, break monolithic phase 3+ into actionable phases, and incorporate three major new deliverables (Search UI, Cloud Functions, Admin Dashboard).

## Key Changes

1. **Archive completed phases** (1 and 2) to `archive/` with preserved content
2. **Split phase-3-plus-roadmap.md** into separate phase files (3-9+)
3. **Add new phases** for UI (4), Cloud Functions (5), Admin Dashboard (6)
4. **Update requirements.md** with rate limit change and expanded scope
5. **Update README.md** as navigation hub

## New Phase Structure

| Phase | Name | Focus | Estimated Effort |

|-------|------|-------|------------------|

| 3 | Multi-Index Search & Fields | Unit search, additional fields, doc_type | 2-3 days |

| 4 | Search UI | Functional, portable search UX | 3-4 days |

| 5 | Cloud Functions | Ingestion/admin on Vercel | 2-3 days |

| 6 | Admin Dashboard | Ingestion control, metrics display | 2-3 days |

| 7 | Query Enhancement | Production patterns, OWA compatibility | 1-2 days |

| 8 | Entity Extraction | NER, Graph API foundations | 3-4 days |

| 9 | Reference Indices | Subject/keystage metadata, threads | 2-3 days |

| 10+ | Future | RAG, Knowledge Graph, LTR | TBD |

## File Changes

### Archive (move with rename)

```
archive/
├── phase-1-foundation-COMPLETE.md    (from phase-1-foundation.md)
└── phase-2-dense-vectors-COMPLETE.md (from phase-2-dense-vectors.md)
```

### New Phase Files

```
.agent/plans/semantic-search/
├── phase-3-multi-index-and-fields.md    # Current 3.0 + 3a expanded
├── phase-4-search-ui.md                 # NEW - functional, portable UI
├── phase-5-cloud-functions.md           # NEW - Vercel functions
├── phase-6-admin-dashboard.md           # NEW - ingestion + metrics
├── phase-7-query-enhancement.md         # Current 3b + 3c
├── phase-8-entity-extraction.md         # Current phase 4
├── phase-9-reference-indices.md         # Current phase 5
└── phase-10-plus-future.md              # RAG, KG, LTR, resource types
```

### Updated Files

- `requirements.md` - Rate limit 10,000/hr, new deliverables, updated success criteria
- `README.md` - New navigation structure
- `semantic-search.prompt.md` - Point to new phase structure

## requirements.md Updates

Key changes to incorporate:

1. **Rate limit**: 1,000 → 10,000 requests/hour (changes ingestion time estimates)
2. **New deliverables**: Search UI, Cloud Functions, Admin Dashboard
3. **Success criteria**: Add demo-readiness criteria for each deliverable
4. **Updated timeline**: Reflect new phase structure

## Phase 4: Search UI (New)

### Scope

Comprehensive functional search experience, prioritising portability over aesthetics:

- Search box with typeahead/suggestions
- Results list with highlighting
- Faceted filtering (subject, keystage, tier, examboard)
- Pagination
- Responsive layout
- Result type indicators (lesson/unit)

### Architecture Decisions

- Component library: [TBD - React components, easily portable]
- State management: URL-based (shareable searches)
- API integration: Existing search endpoints
- Portability: Self-contained components, minimal external dependencies

### Acceptance Criteria

- All filter combinations work correctly
- Results display with type indicators
- Clean, functional UI (not necessarily styled for Oak brand)
- Components documented for future porting

## Phase 5: Cloud Functions (New)

### Scope

Move ingestion and admin functionality to Vercel serverless functions:

- Ingest endpoint (trigger re-indexing by subject/keystage)
- Status endpoint (index counts, health)
- Reset endpoint (clear and rebuild indices)
- Error reporting endpoint

### Architecture Decisions

- Platform: NextJS API routes on Vercel
- Authentication: API key for admin functions
- Timeout handling: Long-running ingestion via background jobs or chunked execution
- Logging: Structured logs viewable in Vercel dashboard

### Acceptance Criteria

- All CLI ingestion commands available via HTTP
- Proper error handling and status reporting
- Secure (API key protected)
- Timeout-safe for full curriculum ingestion

## Phase 6: Admin Dashboard (New)

### Scope

Functional admin interface for ingestion control and metrics:

- Trigger ingestion (by subject/keystage or full)
- View ingestion progress and errors
- Display key metrics (index counts, search latency, error rates)
- Link to Elasticsearch console for index management (no inline editing)

### Architecture Decisions

- Framework: NextJS pages (same app as search UI)
- Real-time updates: Polling or SSE for progress
- Metrics source: ES cluster stats + application logs
- External links: ES Kibana for detailed index management

### Acceptance Criteria

- Can trigger and monitor ingestion from browser
- Key metrics visible at a glance
- Links to ES console work correctly
- Portable components (like Search UI)

## Backup and Verification

Before making changes, create backup of phase-3-plus-roadmap.md content. After restructuring, verify:

1. All information from original preserved across new files
2. Cross-references updated
3. No orphaned content or broken links

## Foundation Document Commitment

Per start-right-thorough.prompt.md, all phase documents will include:

- Link to foundation documents (rules.md, testing-strategy.md, schema-first-execution.md)
- Explicit acceptance criteria
- Quality gate requirements
- TDD mandate reminder
