# Phase 6: Cloud Functions

**Status**: 📋 PLANNED  
**Estimated Effort**: 2-3 days  
**Prerequisites**: Phase 3 (Multi-Index Search & Fields)  
**Last Updated**: 2025-12-13

---

## Foundation Documents (MUST READ)

Before starting any work on this phase:

1. `.agent/directives/principles.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives/schema-first-execution.md` - All types from field definitions
3. `.agent/directives/testing-strategy.md` - Test types and TDD approach

**All quality gates must pass. No exceptions.**

---

## Overview

Move ingestion and admin functionality from CLI to Vercel serverless functions, enabling:

- Browser-based ingestion triggering
- Remote status monitoring
- Scheduled re-indexing (future)

### Key Principles

1. **Portable** - Functions can be deployed to any serverless platform
2. **Secure** - API key authentication for admin operations
3. **Timeout-safe** - Handle long-running ingestion appropriately

---

## Scope

### Core Endpoints

| Endpoint            | Method | Description                             | Auth Required |
| ------------------- | ------ | --------------------------------------- | ------------- |
| `/api/admin/ingest` | POST   | Trigger re-indexing by subject/keystage | Yes           |
| `/api/admin/status` | GET    | Index counts, health status             | Yes           |
| `/api/admin/reset`  | POST   | Clear and rebuild indices               | Yes           |
| `/api/admin/errors` | GET    | View ingestion errors                   | Yes           |

### Out of Scope (Phase 6)

- Scheduled/cron ingestion (Vercel Cron Jobs - future)
- Multi-tenant ingestion (single Oak instance)
- Streaming progress updates (use polling)

---

## Architecture Decisions

### Platform

**Decision**: NextJS API routes on Vercel

- Consistent with existing app
- Edge Functions for low-latency status checks
- Serverless Functions for ingestion (longer timeout)

### Authentication

**Decision**: API key in header

```typescript
// Request
POST /api/admin/ingest
Authorization: Bearer ${ADMIN_API_KEY}

// Validation in route handler
if (request.headers.get('Authorization') !== `Bearer ${env.ADMIN_API_KEY}`) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Timeout Handling

**Challenge**: Full curriculum ingestion takes 10-30 minutes. Vercel has 60s (Hobby) / 300s (Pro) function timeout.

**Options**:

1. **Chunked execution** - Ingest subset per request, client orchestrates
2. **Background jobs** - Vercel Cron or external queue (Inngest, QStash)
3. **Edge streaming** - Stream progress (limited by ES client)

**Recommendation**: Start with chunked execution (Option 1):

```typescript
// Client-side orchestration
POST /api/admin/ingest { subject: 'maths', keystage: 'ks4' }  // ~50 lessons, < 60s
POST /api/admin/ingest { subject: 'science', keystage: 'ks3' } // Next chunk
```

### Logging

**Decision**: Structured JSON logs viewable in Vercel dashboard

```typescript
console.log(
  JSON.stringify({
    event: 'ingestion_started',
    subject: 'maths',
    keystage: 'ks4',
    timestamp: new Date().toISOString(),
  }),
);
```

---

## API Specifications

### POST /api/admin/ingest

Trigger re-indexing for specified subject/keystage.

**Request**:

```json
{
  "subject": "maths",
  "keystage": "ks4",
  "force": false
}
```

**Response** (200):

```json
{
  "status": "started",
  "jobId": "ingest-maths-ks4-1702300800",
  "estimatedDuration": "5-10 minutes",
  "lessonsToIndex": 314
}
```

**Response** (400):

```json
{
  "error": "Invalid subject: 'math'. Did you mean 'maths'?"
}
```

### GET /api/admin/status

Get current index status and health.

**Response** (200):

```json
{
  "indices": {
    "oak_lessons": { "count": 314, "lastUpdated": "2025-12-11T10:00:00Z" },
    "oak_units": { "count": 36, "lastUpdated": "2025-12-11T10:00:00Z" },
    "oak_unit_rollup": { "count": 244, "lastUpdated": "2025-12-11T10:00:00Z" }
  },
  "health": {
    "elasticsearch": "green",
    "lastIngestion": "2025-12-11T10:00:00Z",
    "errorCount": 0
  }
}
```

### POST /api/admin/reset

Clear and rebuild indices. **Destructive operation.**

**Request**:

```json
{
  "indices": ["oak_lessons"],
  "confirm": "DELETE_ALL_DATA"
}
```

**Response** (200):

```json
{
  "status": "reset_complete",
  "indicesDeleted": ["oak_lessons"],
  "message": "Indices cleared. Run /api/admin/ingest to repopulate."
}
```

### GET /api/admin/errors

Get recent ingestion errors.

**Response** (200):

```json
{
  "errors": [
    {
      "timestamp": "2025-12-11T09:45:00Z",
      "type": "api_error",
      "message": "Oak API returned 500 for lesson maths-ks4-123",
      "retryable": true
    }
  ],
  "summary": {
    "total": 3,
    "retryable": 2,
    "permanent": 1
  }
}
```

---

## Implementation Tasks

### Phase 6a: Core Functions (1.5 days)

| Task                | Description                                 | Test Type   |
| ------------------- | ------------------------------------------- | ----------- |
| Auth middleware     | API key validation for admin routes         | Unit        |
| `/api/admin/status` | Index counts from ES                        | Integration |
| `/api/admin/ingest` | Trigger ingestion (single subject/keystage) | Integration |
| Error handling      | Standardised error responses                | Unit        |
| Logging setup       | Structured JSON logs                        | Unit        |

### Phase 6b: Advanced Operations (1 day)

| Task                | Description                                 | Test Type   |
| ------------------- | ------------------------------------------- | ----------- |
| `/api/admin/reset`  | Clear indices with confirmation             | Integration |
| `/api/admin/errors` | Error log retrieval                         | Integration |
| Rate limiting       | Prevent abuse (1 request/minute for ingest) | Integration |
| Timeout handling    | Graceful handling of long-running ingestion | E2E         |

### Phase 6c: Documentation (0.5 days)

| Task              | Description                       |
| ----------------- | --------------------------------- |
| API documentation | OpenAPI spec for admin endpoints  |
| Deployment guide  | Vercel configuration and env vars |
| Security guide    | API key rotation, access control  |

---

## TDD Requirements

| Endpoint            | Test First                                              |
| ------------------- | ------------------------------------------------------- |
| Auth middleware     | Test: rejects missing/invalid key, accepts valid key    |
| `/api/admin/status` | Test: returns index counts, handles ES unavailable      |
| `/api/admin/ingest` | Test: validates params, triggers ingestion, returns job |
| `/api/admin/reset`  | Test: requires confirmation, deletes specified indices  |

**Write tests FIRST, then implement handlers.**

---

## Acceptance Criteria

- [ ] All CLI ingestion commands available via HTTP
- [ ] Proper error handling and status reporting
- [ ] Secure (API key protected)
- [ ] Timeout-safe for subject/keystage level ingestion
- [ ] Structured logging viewable in Vercel
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
```

**All gates must pass. No exceptions.**

---

## Key Files

### Existing CLI Ingestion

```text
apps/oak-search-cli/
├── scripts/ingest-live.ts          # CLI ingestion script
├── src/lib/indexing/               # Indexing logic
│   ├── document-transforms.ts      # Document creation
│   └── index-operations.ts         # ES index operations
└── src/lib/oak-api/                # Oak API client
```

### New Admin API Routes

```text
apps/oak-search-cli/src/app/api/admin/
├── ingest/route.ts                 # POST /api/admin/ingest
├── status/route.ts                 # GET /api/admin/status
├── reset/route.ts                  # POST /api/admin/reset
├── errors/route.ts                 # GET /api/admin/errors
└── middleware.ts                   # Auth middleware
```

---

## Environment Variables

Add to `.env.local`:

```bash
# Admin API authentication
ADMIN_API_KEY=your-secure-admin-key-here
```

Add to Vercel:

```bash
vercel env add ADMIN_API_KEY
```

---

## Dependencies

- **Upstream**: Phase 3 (index schemas with doc_type)
- **Blocks**: Phase 7 (Admin Dashboard uses these endpoints)

---

## Related Documents

- [Requirements](./requirements.md) - Rate limits and ingestion context
- [Phase 7](./phase-7-admin-dashboard.md) - UI for these endpoints
