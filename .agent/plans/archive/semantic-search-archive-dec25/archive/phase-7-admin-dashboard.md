# Phase 7: Admin Dashboard

**Status**: 📋 PLANNED  
**Estimated Effort**: 2-3 days  
**Prerequisites**: Phase 6 (Cloud Functions)  
**Last Updated**: 2025-12-13

---

## Foundation Documents (MUST READ)

Before starting any work on this phase:

1. `.agent/directives/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives/schema-first-execution.md` - All types from field definitions
3. `.agent/directives/testing-strategy.md` - Test types and TDD approach

**All quality gates must pass. No exceptions.**

---

## Overview

Create a functional admin interface for ingestion control and metrics display. This dashboard enables:

- Triggering ingestion from browser
- Monitoring ingestion progress and errors
- Viewing key metrics at a glance
- Linking to Elasticsearch console for detailed management

### Key Principles

1. **Functional over aesthetic** - Clean, working UI; styling can be refined later
2. **Portable components** - Reuse patterns from Search UI (Phase 5)
3. **External for complexity** - Link to ES Kibana for advanced operations

---

## Scope

### Core Features

| Feature               | Description                                 | Priority     |
| --------------------- | ------------------------------------------- | ------------ |
| **Ingestion trigger** | Start ingestion by subject/keystage or full | **CRITICAL** |
| **Progress display**  | Show ingestion status and progress          | **CRITICAL** |
| **Error display**     | Show recent errors with context             | **HIGH**     |
| **Index metrics**     | Document counts, last updated, health       | **HIGH**     |
| **ES console link**   | Link to Kibana for index management         | **MEDIUM**   |
| **Ingestion history** | Recent ingestion runs with outcomes         | **MEDIUM**   |

### Out of Scope (Phase 7)

- Inline index editing (use ES Kibana)
- User management (single admin key)
- Scheduled ingestion configuration (future)
- Oak brand styling

---

## Architecture Decisions

### Framework

**Decision**: NextJS pages in same app as Search UI

- Shared component library with Phase 5
- Single deployment
- Route: `/admin/*`

### Real-Time Updates

**Decision**: Polling for progress updates

```typescript
// Poll /api/admin/status every 5 seconds during ingestion
useEffect(() => {
  const interval = setInterval(async () => {
    const status = await fetch('/api/admin/status');
    setStatus(await status.json());
  }, 5000);
  return () => clearInterval(interval);
}, [isIngesting]);
```

**Alternative**: Server-Sent Events (SSE) for real streaming - consider if polling insufficient.

### Metrics Source

| Metric           | Source                                   |
| ---------------- | ---------------------------------------- |
| Index counts     | ES cluster stats via `/api/admin/status` |
| Search latency   | Application logs (future)                |
| Error rates      | `/api/admin/errors`                      |
| Ingestion status | `/api/admin/status`                      |

### External Links

**Decision**: Link to ES Kibana for detailed index management

```typescript
const kibanaUrl = `${ELASTICSEARCH_KIBANA_URL}/app/discover#/?index=oak_lessons`;
```

This avoids recreating complex ES management UI.

---

## Page Structure

```text
apps/oak-search-cli/src/app/admin/
├── page.tsx                        # Dashboard overview
├── ingest/page.tsx                 # Ingestion control
├── metrics/page.tsx                # Detailed metrics
├── errors/page.tsx                 # Error log viewer
└── layout.tsx                      # Admin layout with nav
```

### Component Structure

```text
apps/oak-search-cli/src/components/admin/
├── IngestForm.tsx                  # Subject/keystage selector + trigger
├── IngestProgress.tsx              # Progress bar and status
├── MetricsCard.tsx                 # Single metric display
├── MetricsGrid.tsx                 # Grid of metrics cards
├── ErrorList.tsx                   # List of recent errors
├── ErrorItem.tsx                   # Single error display
├── ExternalLink.tsx                # Link to ES console
└── index.ts                        # Barrel exports
```

---

## UI Wireframes

### Dashboard Overview (`/admin`)

```text
┌─────────────────────────────────────────────────────────────┐
│  Admin Dashboard                               [ES Console] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   314       │  │    36       │  │   green     │         │
│  │   Lessons   │  │   Units     │  │   Health    │         │
│  │   indexed   │  │   indexed   │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  Last Ingestion: 2025-12-11 10:00:00 (2 hours ago)         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Quick Actions                                       │   │
│  │  [Trigger Ingestion]  [View Errors]  [View Metrics] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Ingestion Control (`/admin/ingest`)

```text
┌─────────────────────────────────────────────────────────────┐
│  Trigger Ingestion                            [← Dashboard] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Subject:    [maths     ▼]                                 │
│  Key Stage:  [ks4       ▼]                                 │
│                                                             │
│  [ ] Force re-index (ignore cache)                         │
│                                                             │
│  [Start Ingestion]                                         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Current Status: Ingesting...                              │
│  ████████████░░░░░░░░ 60% (188/314 lessons)               │
│                                                             │
│  Estimated time remaining: 4 minutes                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Tasks

### Phase 7a: Core Dashboard (1.5 days)

| Task                    | Description                             | Test Type   |
| ----------------------- | --------------------------------------- | ----------- |
| Admin layout            | Navigation, auth check, ES console link | Unit        |
| Dashboard overview      | Metrics grid, quick actions             | Unit        |
| `MetricsCard` component | Display single metric with label        | Unit        |
| `MetricsGrid` component | Fetch and display all metrics           | Integration |
| Auth protection         | Redirect unauthenticated users          | Integration |

### Phase 7b: Ingestion Control (1 day)

| Task                   | Description                          | Test Type   |
| ---------------------- | ------------------------------------ | ----------- |
| `IngestForm` component | Subject/keystage selectors, submit   | Unit        |
| `IngestProgress`       | Progress bar, status text            | Unit        |
| Polling logic          | Auto-refresh status during ingestion | Integration |
| Success/error states   | Clear feedback on completion         | Unit        |

### Phase 7c: Error Viewer (0.5 days)

| Task                  | Description               | Test Type   |
| --------------------- | ------------------------- | ----------- |
| `ErrorList` component | Paginated list of errors  | Unit        |
| `ErrorItem` component | Error detail with context | Unit        |
| Error filtering       | Filter by type, date      | Integration |

---

## TDD Requirements

| Component        | Test First                                             |
| ---------------- | ------------------------------------------------------ |
| `MetricsCard`    | Test: renders label, value, handles missing data       |
| `IngestForm`     | Test: validates inputs, calls onSubmit with params     |
| `IngestProgress` | Test: displays progress, handles 0% and 100%           |
| `ErrorList`      | Test: renders errors, handles empty state              |
| Dashboard page   | E2E: loads metrics, triggers ingestion, shows progress |

**Write tests FIRST, then implement components.**

---

## Acceptance Criteria

- [ ] Can trigger and monitor ingestion from browser
- [ ] Key metrics visible at a glance
- [ ] Error log viewable with context
- [ ] Links to ES console work correctly
- [ ] Portable components (reusable patterns from Search UI)
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

### Phase 6 Cloud Functions (Dependencies)

```text
apps/oak-search-cli/src/app/api/admin/
├── ingest/route.ts                 # POST /api/admin/ingest
├── status/route.ts                 # GET /api/admin/status
├── reset/route.ts                  # POST /api/admin/reset
└── errors/route.ts                 # GET /api/admin/errors
```

### New Admin Pages

```text
apps/oak-search-cli/src/app/admin/
├── page.tsx                        # Dashboard overview
├── ingest/page.tsx                 # Ingestion control
├── metrics/page.tsx                # Detailed metrics
├── errors/page.tsx                 # Error log viewer
└── layout.tsx                      # Admin layout
```

---

## Environment Variables

Reuse from Phase 6:

```bash
# Admin authentication
ADMIN_API_KEY=your-secure-admin-key-here

# ES Kibana link (optional)
ELASTICSEARCH_KIBANA_URL=https://your-kibana-url.elastic.cloud
```

---

## Dependencies

- **Upstream**: Phase 6 (Cloud Functions provide the API)
- **Shared**: Phase 5 (Search UI component patterns)
- **Blocks**: None

---

## Related Documents

- [Phase 5](./phase-5-search-ui.md) - Shared UI patterns
- [Phase 6](./phase-6-cloud-functions.md) - API endpoints this UI consumes
- [Requirements](./requirements.md) - Demo scenarios
