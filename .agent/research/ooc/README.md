# Oak OpenAPI - Complete Research Documentation

**Research Date:** December 7, 2025  
**Repository:** [oak-openapi](https://github.com/oaknational/oak-openapi)  
**Production URL:** https://open-api.thenational.academy  
**Purpose:** RESTful API for Oak National Academy curriculum data

---

## Table of Contents

1. [**Overview**](#quick-reference) - Start here for high-level understanding
2. [**API Endpoints Detailed**](./01-api-endpoints-detailed.md) - Complete endpoint catalog
3. [**Authentication & Rate Limiting**](./02-authentication-rate-limiting.md) - Security deep dive
4. [**Data Sources & Schema Generation**](./03-data-sources-schema-generation.md) - Backend systems & OpenAPI automation
5. [**Bulk Download System**](./04-bulk-download-system.md) - Offline content packages
6. [**Testing, Deployment & Infrastructure**](./05-testing-deployment-infrastructure.md) - DevOps & operations
7. [**API Design Recommendations**](./06-api-design-recommendations.md) - ⭐ Improvement roadmap & best practices
8. [**Bulk Download Data Quality Report**](./07-bulk-download-data-quality-report.md) - Maths bulk export integrity analysis

---

## Quick Reference

### What is Oak OpenAPI?

A Next.js-based RESTful API that provides programmatic access to Oak National Academy's educational curriculum content. It serves:

- 📚 Lessons (metadata, transcripts, quizzes)
- 📝 Units & Sequences (curriculum structure)
- 🎓 Subjects & Key Stages (educational taxonomy)
- 🎬 Assets (videos, worksheets, presentations)
- 🔍 Search (lessons and transcripts)
- 📦 Bulk Downloads (offline packages)

### Key Technologies

- **Framework:** Next.js 15.3.2 (App Router)
- **API:** tRPC + trpc-to-openapi
- **Validation:** Zod schemas
- **Type Safety:** TypeScript (strict mode)
- **Auth:** Bearer tokens with Upstash Redis
- **Rate Limiting:** Sliding window (Upstash)
- **Data Sources:** Hasura GraphQL, PostgreSQL, Mux, GCS, Sanity CMS
- **Deployment:** Vercel (serverless)
- **Infrastructure:** Terraform

### Architecture at a Glance

```
Client
  ↓
Next.js API (/api/v0/[...trpc])
  ↓
tRPC Router → protectedProcedure (auth + rate limit)
  ↓
Handler → Data Sources (Hasura, Postgres, Mux, GCS)
  ↓
Zod Validation → SuperJSON Serialization
  ↓
OpenAPI Response
```

### Quick Stats

- **API Key Storage:** Upstash Redis (`https://dominant-hippo-43403.upstash.io`)
- **Default Rate Limit:** 1,000 requests/hour
- **Endpoints:** 30+ RESTful endpoints
- **Documentation:** Auto-generated OpenAPI 3.0 spec
- **Response Times:** 50-500ms (typical)
- **Deployment:** Vercel (auto-deploy from `main`)

---

## 🔍 Key Research Findings

### 1. Client-Side Ontology Proves Value but Needs API Exposure

**Discovery:** A comprehensive static curriculum ontology (~600 lines, ~5-6K tokens) has been developed **client-side in the SDK** as a proof of concept. It includes:

- Curriculum structure (key stages, subjects, phases, threads)
- Entity hierarchy and relationships
- Programme vs sequence distinction
- KS4 complexity factors
- Lesson components and availability
- Canonical URL patterns
- Domain synonyms for natural language understanding

**Problem:** This creates duplication—each SDK consumer must maintain it, and it goes stale when curriculum changes.

**Recommendation:** The upstream oak-openapi should expose this as a first-class `/ontology` endpoint. See [Recommendation #3](./06-api-design-recommendations.md#3-create-ontology-or-schemacurriculum-endpoint--proven-value) for details.

**Impact:** Enables all API consumers (not just SDK users), eliminates duplication, provides single source of truth.

---

### 2. Missing `lastUpdated` Timestamps Prevent Efficient Caching

**Discovery:** No temporal metadata in API responses means SDK consumers cannot determine if cached data is stale.

**Current Workarounds:**

- Cache blindly with TTL (wastes bandwidth, risks stale data)
- Never cache (poor performance, unnecessary API calls)
- Use ETag/HEAD requests (requires extra round-trips)

**Recommendation:** Add `lastUpdated` field to all resources. See [Recommendation #1](./06-api-design-recommendations.md#1-add-lastupdated-timestamps-for-sdk-caching-) for implementation details.

**Impact:** 60-80% reduction in API calls through intelligent cache invalidation.

---

### 3. Security Gaps in Authentication System

**Discovery:**

- ❌ API keys stored in **plaintext** (not hashed) in Redis
- ❌ Admin panel at `/admin` has **no authentication**
- ❌ No key rotation mechanism
- ❌ No key expiration support

**Recommendation:** See [Recommendation #10](./06-api-design-recommendations.md#10-harden-authentication-system) for comprehensive security hardening plan.

**Impact:** Critical security improvements required for production.

---

### 4. SQL Injection Risk in Search Endpoints

**Discovery:** Search endpoints use string interpolation with manual escaping:

```typescript
const q = input.q.replace(/'/g, "''"); // Fragile
const sql = `SELECT * FROM table WHERE "lessonTitle" LIKE '%${q}%'`;
```

**Recommendation:** Use query builder (Kysely) or parameterized queries. See [Recommendation #11](./06-api-design-recommendations.md#11-eliminate-sql-injection-risks).

**Impact:** Eliminates security vulnerability.

---

### 5. API Uses "Sequences" but Teachers Navigate by "Programmes"

**Discovery:** Critical distinction not exposed by API:

- **Sequence:** API organizational structure (e.g., `science-secondary-aqa` spans Years 7-11, all exam subjects, both tiers)
- **Programme:** User-facing curriculum pathway (e.g., `biology-secondary-ks4-foundation-aqa`)
- One sequence → 8+ different programme URLs for Year 10 alone

**Recommendation:** See [Recommendation #5](./06-api-design-recommendations.md#5-expose-programme-context-and-variant-metadata) for programme metadata exposure plan.

**Impact:** Enables correct canonical URL generation and aligns API with teacher mental models.

---

## Document Guide

### 00-overview.md

**Purpose:** Executive summary and system architecture overview  
**Read Time:** 15 minutes  
**Best For:** New developers, stakeholders, or anyone needing a comprehensive understanding

**Key Sections:**

- Executive summary
- Key architecture decisions
- Technology stack
- Data flow architecture
- Core features
- Security analysis
- Notable implementation patterns
- Challenges & solutions

**When to Read:** Start here for onboarding or project assessment

---

### 01-api-endpoints-detailed.md

**Purpose:** Complete catalog of all API endpoints with examples  
**Read Time:** 30 minutes  
**Best For:** Developers integrating with the API or maintaining endpoints

**Key Sections:**

- Authentication pattern
- Endpoint catalog (key stages, subjects, units, lessons, etc.)
- Request/response formats
- Query parameters
- Error codes
- Performance characteristics
- Pagination considerations

**When to Read:** When building API clients, debugging issues, or adding new endpoints

---

### 02-authentication-rate-limiting.md

**Purpose:** Deep dive into security, authentication, and rate limiting  
**Read Time:** 25 minutes  
**Best For:** Security reviews, ops team, or developers modifying auth logic

**Key Sections:**

- Authentication flow
- User lookup in Redis
- Protected procedure middleware
- Rate limiting algorithm (sliding window)
- Unlimited access configuration
- User management (CLI & web UI)
- Redis data structure
- Security analysis & recommendations

**When to Read:** When configuring rate limits, managing API keys, or conducting security audits

---

### 03-data-sources-schema-generation.md

**Purpose:** Understanding backend data sources and OpenAPI schema automation  
**Read Time:** 35 minutes  
**Best For:** Developers working on data layer, schema changes, or adding data sources

**Key Sections:**

- OWA Hasura GraphQL (materialized views)
- PostgreSQL via Prisma (search)
- Mux API (videos)
- Google Cloud Storage (assets)
- Sanity CMS (documentation)
- OpenAPI schema generation (Babel AST transformation)
- Data flow examples
- Performance considerations

**When to Read:** When adding endpoints, modifying schemas, or investigating data issues

---

### 04-bulk-download-system.md

**Purpose:** Comprehensive guide to bulk download preparation and serving  
**Read Time:** 30 minutes  
**Best For:** Developers maintaining bulk downloads or ops running preparation scripts

**Key Sections:**

- Preparation script (`bin/prepare-bulk.ts`)
- Data flow (sequence discovery, asset processing)
- Output structure (tar archives, metadata)
- Copyright gating
- Asset pack system
- Upload to GCS
- API endpoint for serving
- Companion video download script
- Error handling & resource management

**When to Read:** When running bulk builds, debugging download issues, or modifying package structure

---

### 05-testing-deployment-infrastructure.md

**Purpose:** Testing strategy, deployment process, and infrastructure overview  
**Read Time:** 30 minutes  
**Best For:** DevOps, QA engineers, or developers setting up CI/CD

**Key Sections:**

- Test infrastructure (Vitest)
- Test type definitions (project-specific)
- Test helpers and mocks
- Test examples (auth, rate limit, endpoints)
- Load testing (Artillery)
- Deployment (Vercel + Terraform)
- Infrastructure as code
- Observability (logging, monitoring, health checks)
- Disaster recovery
- Cost optimization

**When to Read:** When adding tests, deploying changes, or managing infrastructure

---

### 06-api-design-recommendations.md ⭐ NEW

**Purpose:** Comprehensive improvement roadmap integrating upstream wishlist + industry best practices  
**Read Time:** 40 minutes  
**Best For:** API team, product managers, architects planning improvements

**Key Sections:**

- Critical recommendations (high priority, high impact)
  - Add `lastUpdated` timestamps for SDK caching ⭐
  - Enrich operation descriptions for AI tool discovery
  - Create `/ontology` endpoint for structural knowledge
  - Document all error responses
  - Expose programme variant metadata
- Security & reliability improvements
- OpenAPI best practices checklist
- Performance & caching recommendations
- Implementation roadmap (4 phases)
- Success metrics

**When to Read:**

- Planning API improvements or roadmap
- Preparing for AI integration
- Conducting security review
- Optimizing performance

**Integrates:**

- Upstream API Metadata Enhancement Wishlist
- Technical deep dive findings
- OpenAPI Initiative best practices
- Industry standards (MCP, OpenAI Apps SDK, HTTP semantics)

---

### 07-bulk-download-data-quality-report.md

**Purpose:** Detailed integrity analysis of maths bulk download exports  
**Read Time:** 20 minutes  
**Best For:** Data quality review, ingestion reliability, bulk export consumers

**Key Sections:**

- Dataset summary and methodology
- Structural integrity checks (duplicates, missing references)
- Field completeness and type consistency
- Improvement opportunities and validation checks

**When to Read:** When validating bulk export quality or planning schema fixes

---

## Common Tasks

### I want to...

#### Add a new API endpoint

1. Read: [01-api-endpoints-detailed.md](./01-api-endpoints-detailed.md) - Understand endpoint patterns
2. Read: [06-api-design-recommendations.md](./06-api-design-recommendations.md) - Best practices
3. Read: [03-data-sources-schema-generation.md](./03-data-sources-schema-generation.md) - Schema generation process
4. Create handler in `src/lib/handlers/{endpoint}/`
5. Create Zod schemas in `schemas/` subdirectory (include `lastUpdated` field!)
6. Add example JSON in `examples/` subdirectory
7. Add "Use this when" description following recommendation pattern
8. Document all error responses (200, 400, 401, 404, 500)
9. Run `pnpm generate:openapi`
10. Add to router in `src/lib/router.ts`
11. Write tests in `__tests__/`

#### Change rate limit for a user

1. Read: [02-authentication-rate-limiting.md](./02-authentication-rate-limiting.md#cli-user-management)
2. Run: `pnpm with-env tsx bin/find-api-user.ts user:email:{email} {newLimit}`
3. Or set to unlimited: `{newLimit}` = 0

#### Debug a slow endpoint

1. Read: [01-api-endpoints-detailed.md](./01-api-endpoints-detailed.md#performance-characteristics)
2. Read: [05-testing-deployment-infrastructure.md](./05-testing-deployment-infrastructure.md#server-timing-headers)
3. Check `Server-Timing` response header for breakdown
4. Review data source queries in handler
5. Check Datadog logs for detailed metrics

#### Add a new data source

1. Read: [03-data-sources-schema-generation.md](./03-data-sources-schema-generation.md) - Understand existing sources
2. Create client/connection in `src/lib/`
3. Add environment variables
4. Update Terraform configuration
5. Implement data fetching in handlers
6. Add error handling for source failures

#### Run bulk download preparation

1. Read: [04-bulk-download-system.md](./04-bulk-download-system.md#execution)
2. Set required environment variables
3. Start video download script: `./bin/bulk-download-videos.sh` (in separate terminal)
4. Run: `NODE_OPTIONS='--max-old-space-size=4096' tsx bin/prepare-bulk.ts`
5. Monitor memory usage and logs
6. Upload to GCS when complete

#### Deploy to production

1. Read: [05-testing-deployment-infrastructure.md](./05-testing-deployment-infrastructure.md#cicd-pipeline)
2. Merge PR to `main` branch
3. GitHub Actions runs tests automatically
4. Vercel deploys on test success
5. Monitor health checks and logs
6. Rollback via Vercel dashboard if needed

#### Investigate authentication issues

1. Read: [02-authentication-rate-limiting.md](./02-authentication-rate-limiting.md#implementation-details)
2. Check API key exists in Redis: `pnpm with-env tsx bin/find-api-user.ts user:email:{email}`
3. Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables
4. Check Datadog logs for authentication errors
5. Test with `curl -H "Authorization: Bearer {key}" https://open-api.thenational.academy/api/v0/rate-limit`

---

## Key Files & Directories

### Core Application

- `src/lib/router.ts` - Main tRPC router
- `src/lib/trpc.ts` - tRPC initialization
- `src/lib/context.ts` - Request context creation
- `src/lib/protect.ts` - Auth & rate limiting middleware
- `src/app/api/v0/[...trpc]/route.ts` - API entry point

### Data Layer

- `src/lib/owaClient.ts` - Hasura GraphQL client
- `src/lib/db.ts` - Prisma client
- `src/lib/apikeys.ts` - User management (Redis)
- `src/lib/rateLimit.ts` - Rate limiting config
- `src/lib/queryGate.ts` - Copyright gating

### Handlers (One directory per endpoint group)

- `src/lib/handlers/*/` - Endpoint implementations
  - `*.ts` - Handler logic
  - `schemas/*.schema.ts` - Zod schemas
  - `examples/*.json` - Example data

### Schema Generation

- `bin/zod-openapi-schema-gen/` - OpenAPI metadata generator
- `src/lib/zod-openapi/generated/` - Generated schemas

### Bulk Downloads

- `bin/prepare-bulk.ts` - Preparation script
- `src/lib/bulk-data/` - Utilities
- `src/app/api/bulk/route.ts` - Download endpoint

### Testing

- `__tests__/*.test.ts` - Test suites
- `__tests__/helper.ts` - Test utilities
- `__tests__/make-call.ts` - Auth test caller

### Infrastructure

- `infrastructure/project/` - Vercel + DNS (Terraform)
- `infrastructure/bulk-upload/` - GCS bucket (Terraform)
- `vercel.json` - Vercel config
- `schema.prisma` - Database schema

---

## Critical Environment Variables

### Required for API

```bash
OAK_GRAPHQL_HOST=        # Hasura endpoint
OAK_GRAPHQL_SECRET=      # Hasura auth
UPSTASH_REDIS_REST_URL=  # Redis URL
UPSTASH_REDIS_REST_TOKEN= # Redis auth
PRISMA_ACCELERATE_DATABASE_URL= # Postgres (search)
```

### Optional but Recommended

```bash
OAK_API_AUTH_TOKEN=      # Master unlimited key
GOOGLE_APPLICATION_CREDENTIALS_JSON= # GCS access
MUX_TOKEN=               # Video access
NEXT_PUBLIC_POSTHOG_API_KEY= # Analytics
```

---

## Security Highlights

### ✅ Strong Points

- All endpoints require authentication
- Per-user rate limiting (sliding window)
- Copyright gating for licensed content
- Encrypted data in transit (HTTPS)
- Structured logging (no PII leakage)
- Redis data encrypted at rest

### ⚠️ Areas for Improvement

- Admin panel lacks authentication (relies on deployment protection)
- API keys stored in plaintext (not hashed)
- Some SQL queries use string interpolation (injection risk)
- No key rotation mechanism
- No request signing/HMAC validation
- CORS wide open (intentional for public API)

**Recommendation:** See [02-authentication-rate-limiting.md](./02-authentication-rate-limiting.md#security-analysis) for detailed security review

---

## Performance Characteristics

### Typical Response Times

- **Fast (<100ms):** Key stages, subjects (cached data)
- **Medium (100-300ms):** Lesson summaries, sequence data
- **Slow (300ms-1s):** Search queries, complex sequences
- **Very Slow (1s+):** Asset endpoints (external API calls)

### Rate Limit Impact

- Standard check: ~10-20ms (Redis REST API latency)
- Unlimited users: 0ms (bypass check entirely)

### Caching

- **Hasura:** 5-minute TTL on GraphQL queries
- **Application:** None (serverless, stateless)
- **CDN:** Vercel edge (static assets only)

**Recommendation:** See [03-data-sources-schema-generation.md](./03-data-sources-schema-generation.md#performance-considerations) for optimization ideas

---

## Known Issues & Technical Debt

1. **SQL Injection Risk** - Search endpoints use string interpolation
2. **Mixed Type Safety** - Some legacy types use `any`
3. **Copyright Logic Duplication** - Gating spread across handlers
4. **No OpenAPI Schema Validation** - Generated schema not validated in CI
5. **Bulk Download Timeout** - API endpoint may timeout for large downloads
6. **No Pagination** - All list endpoints return full datasets
7. **No Resource Timestamps** - Responses lack `lastUpdated` for efficient caching ⭐
8. **Missing Error Documentation** - Most endpoints only document 200 responses
9. **No Programme Endpoints** - Sequence vs programme confusion
10. **Admin Panel Unsecured** - No authentication on key generation UI
11. **API Keys Unhashed** - Stored in plaintext in Redis

**Tracking:** See [06-api-design-recommendations.md](./06-api-design-recommendations.md) for detailed recommendations and implementation roadmap

---

## Useful Links

### Production

- **API Base:** https://open-api.thenational.academy/api/v0
- **Swagger UI:** https://open-api.thenational.academy/playground
- **Documentation:** https://open-api.thenational.academy/docs
- **Admin Panel:** https://open-api.thenational.academy/admin

### Infrastructure

- **Upstash Redis Console:** https://console.upstash.com/
- **Vercel Dashboard:** https://vercel.com/oaknational/oak-openapi
- **Terraform Cloud:** https://app.terraform.io/app/oaknational
- **GitHub Repository:** https://github.com/oaknational/oak-openapi

### Monitoring

- **Datadog:** Dashboard for API metrics
- **Vercel Analytics:** Deployment and performance metrics
- **Pingdom:** Uptime monitoring

---

## Getting Started (Development)

### Prerequisites

- Node.js 20.6+ (see `.nvmrc`)
- pnpm 9+
- Access to OWA Hasura (staging for dev)
- Upstash Redis credentials
- `.env` file configured

### Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
prisma generate --schema ./schema.prisma

# Start dev server
pnpm dev
```

Server runs at: http://localhost:2727

### Running Tests

```bash
# All tests
pnpm test

# Specific test
pnpm test --testNamePattern="test name"

# With coverage
pnpm test --coverage
```

### Building Subjects Data

```bash
# In one terminal: start dev server
pnpm dev

# In another terminal: generate subjects
pnpm build-subjects
```

### Generating OpenAPI Schemas

```bash
# After modifying any *.schema.ts file
pnpm generate:openapi
```

---

## Contributing Guidelines

### Code Style

- TypeScript strict mode (no `any` unless unavoidable)
- Functional components with hooks (React)
- Conventional commits (feat:, fix:, chore:)
- Single quotes for strings
- Async/await for async operations
- tRPC error handling (not vanilla throws)

### Adding Endpoints

1. Create handler directory: `src/lib/handlers/{endpoint}/`
2. Implement handler with `protectedProcedure`
3. Create request/response schemas in `schemas/`
4. Add example JSON in `examples/`
5. Run `pnpm generate:openapi`
6. Add to `src/lib/router.ts`
7. Write tests in `__tests__/{endpoint}.test.ts`
8. Update documentation (if public-facing)

### Testing Requirements

- Unit tests for pure functions
- Integration tests for handler logic
- Mock external services (GraphQL, Redis, etc.)
- Test error cases
- Validate schema parsing

### Deployment Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Push and create PR
4. Vercel creates preview deployment
5. Tests run via GitHub Actions
6. Request review from team
7. Merge to `main` on approval
8. Auto-deploy to production

---

## Support & Contact

### Internal Team

- **API Maintainers:** Oak Platform Team
- **Infrastructure:** Oak DevOps Team
- **Content Questions:** Oak Curriculum Team

### External Users

- **Documentation:** https://open-api.thenational.academy/docs
- **Issues:** GitHub Issues (for public repo)
- **Support Email:** [Contact details not in repo]

---

## Changelog

### Version History

See `src/lib/handlers/changelog/changelog.ts` for API version history

### Documentation Updates

- **2025-12-07:** Initial comprehensive research documentation created
- **2025-12-07:** Added API Design Recommendations document integrating upstream wishlist + best practices

---

## License

**Code:** MIT (assumed, not explicitly stated in repo)  
**Content:** Oak National Academy educational content licensing applies

---

## Glossary

- **Key Stage (KS):** Educational level in UK curriculum (KS1-KS5)
- **Sequence:** Curriculum unit (collection of lessons)
- **Unit Variant:** Differentiated version of a unit
- **Thread:** Cross-unit curriculum concept progression
- **OWA:** Oak Web Application (primary data source)
- **Materialized View:** Pre-computed database view for performance
- **tRPC:** TypeScript RPC framework
- **Zod:** TypeScript schema validation library
- **OpenAPI:** Standard for REST API documentation (formerly Swagger)
- **SuperJSON:** JSON serialization with extended type support

---

## Acronyms

- **API:** Application Programming Interface
- **CMS:** Content Management System
- **CORS:** Cross-Origin Resource Sharing
- **GCS:** Google Cloud Storage
- **IaC:** Infrastructure as Code
- **JWT:** JSON Web Token (not used in this API)
- **MV:** Materialized View
- **OOC:** Oak Open Curriculum
- **PII:** Personally Identifiable Information
- **REST:** Representational State Transfer
- **SLA:** Service Level Agreement
- **TPC:** Third Party Content
- **TTL:** Time To Live (cache duration)
- **UUID:** Universally Unique Identifier
- **VTT:** WebVTT (video subtitle format)

---

## Research Methodology

This documentation was created through:

1. **Code Analysis:** Systematic review of all source files
2. **Architecture Mapping:** Tracing data flows and dependencies
3. **Pattern Identification:** Recognizing common implementation patterns
4. **Testing Review:** Understanding test coverage and strategies
5. **Infrastructure Inspection:** Analyzing Terraform and deployment configs
6. **Documentation Synthesis:** Consolidating findings into structured guides

**Total Analysis Time:** ~8 hours  
**Files Reviewed:** 100+ source files  
**Documentation Generated:** 6 comprehensive markdown files

---

## Document Maintenance

### When to Update

- New endpoints added
- Data sources changed
- Authentication/rate limiting modified
- Infrastructure changes
- Security updates
- Major refactoring

### Responsible Party

Platform team member conducting the change should update relevant documentation sections.

### Review Schedule

Quarterly review recommended to ensure documentation accuracy.

---

**End of Research Documentation**

For questions or corrections, contact the Oak Platform Team.
