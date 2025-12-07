# Oak OpenAPI - Comprehensive Research Overview

**Date:** December 7, 2025  
**Repository:** oak-openapi  
**Purpose:** Public-facing RESTful API for Oak National Academy curriculum data

## Executive Summary

Oak OpenAPI is a Next.js-based API service that provides programmatic access to Oak National Academy's curriculum content. It serves educational data including lessons, units, subjects, key stages, quizzes, transcripts, and educational resources through a RESTful API with OpenAPI documentation.

## Key Architecture Decisions

### Technology Stack

- **Framework:** Next.js 15.3.2 (App Router)
- **API Layer:** tRPC with trpc-to-openapi for OpenAPI/REST conversion
- **Validation:** Zod schemas with OpenAPI metadata
- **Type Safety:** TypeScript with strict mode enabled
- **Data Transformation:** SuperJSON for serialization
- **Styling:** styled-components for React components
- **CMS:** Sanity CMS for documentation and landing pages

### Data Sources

1. **Primary:** Oak Web Application (OWA) Hasura GraphQL database
2. **Video Content:** Mux streaming service
3. **File Storage:** Google Cloud Storage
4. **Search:** PostgreSQL with Prisma + Prisma Accelerate
5. **CMS:** Sanity for documentation

### Authentication & Rate Limiting

- **Storage:** Upstash Redis (serverless Redis)
- **Instance:** `https://dominant-hippo-43403.upstash.io`
- **Authentication:** Bearer token in Authorization header
- **Default Rate Limit:** 1,000 requests/hour (sliding window)
- **Custom Limits:** Per-user configurable via Redis
- **Unlimited Access:** Setting `rateLimit: 0` or using `OAK_API_AUTH_TOKEN`

### Deployment

- **Platform:** Vercel
- **Domain:** open-api.thenational.academy
- **Infrastructure:** Terraform-managed
- **CI/CD:** GitHub Actions

## Core Features

### 1. RESTful API Endpoints

- **Key Stages:** List all educational key stages
- **Subjects:** Browse subjects by key stage, phase, or exam board
- **Units:** Access curriculum units (sequences)
- **Lessons:** Full lesson data including metadata and content
- **Questions:** Quiz questions (starter/exit quizzes)
- **Assets:** Downloadable resources (videos, worksheets, slide decks)
- **Transcripts:** Video transcripts with search
- **Threads:** Curriculum threads and their relationships
- **Changelog:** API version history

### 2. Bulk Download System

- Packaged downloads of entire curriculum sequences
- Organized tar archives by asset type (videos, worksheets, quizzes, etc.)
- Metadata files (JSON/JSONL) for offline use
- Google Cloud Storage integration
- Copyright and licensing gating

### 3. Interactive Documentation

- Swagger UI playground at `/playground`
- Auto-generated OpenAPI 3.0 schema
- Sanity CMS-powered documentation pages
- Example requests and responses
- Live API testing interface

### 4. Admin Features

- Web UI for API key generation (`/admin`)
- Command-line scripts for user management
- Rate limit modification tools
- Analytics tracking (request counts, timestamps)

## Data Flow Architecture

```
Client Request
    ↓
Next.js API Route (/api/v0/[...trpc])
    ↓
trpc-to-openapi Handler
    ↓
tRPC Router (src/lib/router.ts)
    ↓
Protected Procedure (auth + rate limit check)
    ↓
Handler Function (e.g., getLessons)
    ↓
[Data Source Layer]
    ├→ Hasura GraphQL (OWA database)
    ├→ PostgreSQL (search queries)
    ├→ Google Cloud Storage (assets)
    └→ Mux API (video URLs)
    ↓
Zod Schema Validation
    ↓
SuperJSON Transformation
    ↓
OpenAPI-formatted Response
```

## Copyright & Content Gating

The API implements sophisticated content filtering to respect third-party copyright:

### Gating Mechanisms

1. **Subject-level:** Blocked subjects list (e.g., English, Financial Education)
2. **Unit-level:** Explicit allowlist/blocklist in JSON files
3. **Lesson-level:** Per-lesson approval for asset access
4. **Default:** Math is fully supported; other subjects gated

### Gating Data Location

- `src/lib/queryGateData/assets/blockedLessons.json`
- `src/lib/queryGateData/assets/blockedUnits.json`
- `src/lib/queryGateData/supportedUnits.json`
- `src/lib/queryGateData/supportedLessons.json`

## Notable Implementation Patterns

### 1. Schema-Driven Development

- Each endpoint has paired Request/Response schemas
- Schemas are in `src/lib/handlers/*/schemas/`
- Example JSON files alongside schemas
- Automated OpenAPI metadata generation via Babel AST transformation

### 2. Type Generation Pipeline

```bash
1. Write Zod schema in *.schema.ts
2. Create example JSON in */examples/
3. Run: pnpm generate:openapi
4. Generated files in src/lib/zod-openapi/generated/
5. Import in handler files
```

### 3. Dual API Modes

- **tRPC:** Type-safe internal calls (used in tests)
- **REST/OpenAPI:** Public HTTP interface
- Single codebase serves both via trpc-to-openapi

### 4. Performance Optimizations

- GraphQL query caching (`@cached(ttl: 300)`)
- Prisma Accelerate for database connection pooling
- Server-Timing headers for observability
- SuperJSON for efficient serialization

## Environment Configuration

### Required Variables

```bash
OAK_GRAPHQL_HOST=        # Hasura GraphQL endpoint
OAK_GRAPHQL_SECRET=      # Hasura auth secret
UPSTASH_REDIS_REST_URL=  # Redis instance URL
UPSTASH_REDIS_REST_TOKEN= # Redis auth token
PRISMA_ACCELERATE_DATABASE_URL= # Postgres via Prisma Accelerate
```

### Optional Variables

```bash
OAK_API_AUTH_TOKEN=      # Master API key (unlimited rate limit)
GOOGLE_APPLICATION_CREDENTIALS_JSON= # GCS access for bulk downloads
NEXT_PUBLIC_POSTHOG_API_KEY= # Analytics
MUX_TOKEN=               # Video asset access
```

## Key Files & Directories

### Core Infrastructure

- `src/lib/router.ts` - Main tRPC router, aggregates all endpoint handlers
- `src/lib/trpc.ts` - tRPC initialization with error formatting
- `src/lib/context.ts` - Request context creation (user auth)
- `src/lib/protect.ts` - Authentication and rate limiting middleware
- `src/app/api/v0/[...trpc]/route.ts` - Next.js API route entry point

### Data Layer

- `src/lib/owaClient.ts` - GraphQL client for OWA database
- `src/lib/db.ts` - Prisma client with Accelerate extension
- `src/lib/apikeys.ts` - Redis-based user management
- `src/lib/rateLimit.ts` - Upstash rate limiting configuration
- `src/lib/queryGate.ts` - Copyright gating logic

### Handlers (Endpoints)

- `src/lib/handlers/*/` - Each subdirectory is an endpoint group
  - `*.ts` - Handler implementation
  - `schemas/*.schema.ts` - Zod schemas
  - `examples/*.json` - Example request/response data

### Build & Generation

- `bin/zod-openapi-schema-gen/` - OpenAPI metadata generator
- `bin/prepare-bulk.ts` - Bulk download package creator
- `bin/find-api-user.ts` - CLI for user/key management

### Testing

- `__tests__/*.test.ts` - Vitest test suites
- `__tests__/helper.ts` - Test utilities and mocks
- `__tests__/make-call.ts` - Authenticated test caller

## Unique Characteristics

### 1. OpenAPI Schema Auto-Generation

The system uses Babel AST transformations to automatically inject OpenAPI metadata into Zod schemas. This is a sophisticated approach that:

- Parses TypeScript source files
- Finds Zod schema declarations
- Injects `.openapi()` methods with examples and descriptions
- Rewrites imports for generated files
- Maintains type safety throughout

### 2. Curriculum Data Materialized Views

Rather than querying live tables, the API consumes materialized views from OWA:

- `published_mv_lesson_openapi_1_2_3`
- `published_mv_curriculum_sequence_b_13_0_17`
- `published_mv_subject_phase_options_0_11`

These views are versioned and optimized for API consumption.

### 3. Hybrid Content Sources

The API seamlessly merges data from multiple sources:

- Lesson metadata from GraphQL
- Video URLs from Mux (with mp4 fallback generation)
- Quiz questions from denormalized JSON fields
- Transcripts from both Hasura and Postgres
- Assets from Google Cloud Storage

### 4. Progressive Copyright Management

The content gating system allows incremental rollout:

- Start with safe subjects (Math)
- Add specific units via allowlist
- Override with specific lessons
- Block specific problematic content
- All configurable without code changes (JSON files)

## Observability & Operations

### Logging

- Structured JSON logging to stdout (forwarded to Datadog)
- Request logging includes: userId, url, query params
- Error logging with trpc path context

### Analytics Tracked

- Per-user request counts (in Redis)
- Last request timestamp
- Rate limit consumption
- PostHog events (frontend only)

### Health Checks

- `/api/health` - Basic service health
- `/api/pingdom` - Uptime monitoring endpoint

### Deployment Process

1. GitHub push to main branch
2. Vercel automatic deployment
3. Terraform manages environment variables
4. Cloudflare DNS routing

## Challenges & Solutions

### Challenge 1: Type Safety Across Boundaries

**Problem:** Maintaining type safety from Zod schemas through to OpenAPI docs  
**Solution:** Custom Babel transformer to inject OpenAPI metadata into Zod chains

### Challenge 2: Multiple Data Sources

**Problem:** Lessons span GraphQL, Postgres, Mux, and GCS  
**Solution:** Handler pattern with data aggregation layer and error isolation

### Challenge 3: Rate Limiting in Serverless

**Problem:** Vercel serverless functions are stateless  
**Solution:** Upstash Redis with REST API, sliding window algorithm

### Challenge 4: Copyright Compliance

**Problem:** Can't expose all content due to third-party licensing  
**Solution:** Multi-level gating (subject/unit/lesson) with JSON configuration

### Challenge 5: Large Bulk Downloads

**Problem:** Generating multi-GB archives exceeds serverless limits  
**Solution:** Separate bulk preparation script, pre-generate to GCS, stream from bucket

## Future Considerations

### Identified Technical Debt

1. Some handlers use raw SQL with string interpolation (SQL injection risk)
2. Mixed use of `any` types in legacy lesson structures
3. Copyright gating logic duplicated across handlers
4. No automated testing of OpenAPI schema validity
5. Bulk download system requires Node 22+ for socket management

### Potential Improvements

1. Move to SQL query builder (e.g., Kysely) for type-safe queries
2. Generate full TypeScript types from Hasura introspection
3. Centralize copyright gating into middleware
4. Add OpenAPI schema validation in CI
5. Implement request/response caching layer
6. Add GraphQL DataLoader for N+1 query optimization
7. **Expose curriculum ontology via `/ontology` endpoint** - A comprehensive static ontology (~600 lines) has been developed client-side in the SDK as proof of concept, demonstrating value for AI agent reasoning. This should be exposed by the upstream API to provide a single source of truth and eliminate client-side duplication.

## Testing Strategy

### Test Types

- **Unit Tests:** `*.unit.test.ts` - Pure functions, no I/O
- **Integration Tests:** `*.integration.test.ts` - Imported code with simple mocks
- **Load Tests:** Artillery-based (`load-tests.yml`)

### Test Infrastructure

- Vitest as test runner
- Custom `authedCaller` for testing protected endpoints
- Mock rate limiter to avoid Redis calls in tests
- GraphQL mocking via `vi.mock`

### Coverage

Tests exist for:

- All major endpoint handlers
- Rate limiting behavior
- Authentication flows
- Asset redirects
- Sequence slug parsing
- OpenAPI schema generation

## Security Considerations

### Authentication

- No public endpoints (all require API key)
- Keys stored as hashed values in Redis? **NO** - stored as plaintext keys
- Bearer token authentication
- Admin panel has no additional auth (relies on deployment protection)

### Rate Limiting

- Prevents abuse with sliding window algorithm
- User-specific limits
- Headers exposed: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- 429 status with `X-Retry-After` on limit exceeded

### CORS

- Wide-open CORS (`access-control-allow-origin: *`)
- Intentionally public API

### Data Exposure

- No PII in API responses
- User data (name, email, company) only in Redis
- No sensitive content exposed beyond copyright gating

## Performance Characteristics

### Response Times (estimated from Server-Timing headers)

- Simple queries (key stages, subjects): 50-200ms
- Complex queries (lessons with assets): 200-500ms
- Search queries: 100-300ms (PostgreSQL text similarity)
- Bulk downloads: 30-120 seconds (streaming)

### Rate Limit Impact

- Standard check adds ~10-20ms (Redis RTT)
- Upstash REST API used (not direct Redis protocol)
- Rate limit bypass for unlimited users (0 checks)

### Caching Strategy

- GraphQL queries cached at Hasura layer (TTL: 300s)
- No application-level caching (stateless serverless)
- CDN caching via Vercel/Cloudflare (not extensively used)

## Documentation Resources

### Internal Documentation

- `README.md` - Development setup and operations
- `README_BULK_DOWNLOAD.md` - Bulk download system details
- `CLAUDE.md` - AI agent quick reference
- `src/cms/README.md` - CMS integration guide
- `bin/zod-openapi-schema-gen/README.md` - Schema generation

### External Documentation

- Swagger UI at `/playground`
- Sanity CMS content at `/docs`
- Landing page at `/`

## Conclusion

Oak OpenAPI is a well-architected, type-safe API service that successfully bridges multiple data sources while maintaining copyright compliance. Its use of tRPC + trpc-to-openapi is particularly clever, providing both type-safe internal calls and a standard REST API from a single codebase.

The schema-driven development approach with automated OpenAPI generation is sophisticated, though it adds complexity to the build process. The copyright gating system is pragmatic and allows for incremental content rollout.

Key strengths:

- Excellent type safety throughout
- Clear separation of concerns
- Comprehensive OpenAPI documentation
- Flexible rate limiting
- Well-tested core functionality

Areas for improvement:

- Some SQL injection risks in search endpoints
- Admin panel lacks authentication
- API keys stored in plaintext (not hashed)
- Limited caching strategy
- Technical debt in legacy type definitions

Overall, this is a production-ready API service that effectively serves Oak National Academy's curriculum data to external consumers.
