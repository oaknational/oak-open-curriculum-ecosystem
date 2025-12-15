# Oak OpenAPI - Testing, Deployment & Infrastructure

## Testing Infrastructure

### Test Framework

**Tool:** Vitest  
**Configuration:** `vite.config.mts`

```typescript
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['__tests__/helper.ts'],
  },
});
```

### Test Type Definitions (Project-Specific)

**IMPORTANT:** This project has specific test classifications that differ from common industry usage.

#### In-Process Tests (Import Code Directly)

**Unit Test** (`*.unit.test.ts`):

- Tests a single PURE function
- NO I/O, NO side effects, NO mocks
- Fast and isolated

**Integration Test** (`*.integration.test.ts`):

- Tests how code units work together when IMPORTED
- NOT a running system
- NO I/O, NO side effects
- Only SIMPLE mocks injected as arguments
- Uses supertest to test Express apps as imported code

#### Out-of-Process Tests (Validate Running Systems)

**E2E Test** (`*.e2e.test.ts`):

- Tests a running system
- CAN trigger File System and STDIO I/O
- NOT network I/O
- Located in `e2e-tests/` directory

**Smoke Test**:

- Tests running systems locally or deployed
- CAN trigger all I/O types, no mocks

**Key Distinction:** Integration tests in this project import and test code directly - they NEVER spawn processes, make network calls, or test deployed systems.

---

## Test Suite Overview

### Test Files

```
__tests__/
├── assets-redirected.test.ts   # Asset redirect functionality
├── assets.test.ts               # Asset endpoint tests
├── auth.test.ts                 # Authentication tests
├── changelog.test.ts            # Changelog endpoint
├── helper.ts                    # Test utilities & mocks
├── lesson.test.ts               # Lesson endpoints
├── load-tests.yml               # Artillery load testing config
├── make-call.ts                 # Authenticated test caller
├── openapi-schema.test.ts       # OpenAPI schema validation
├── questions.test.ts            # Question endpoints
├── rate-limit.test.ts           # Rate limiting behavior
├── sequences.test.ts            # Sequence endpoints
├── sequenceSlugParser.test.ts   # Slug parsing logic
├── subjects.test.ts             # Subject endpoints
├── transcripts.test.ts          # Transcript endpoints
└── unit.test.ts                 # Unit endpoints
```

---

## Test Helpers

### Mock Setup

**File:** `__tests__/helper.ts`

#### Rate Limiter Mock

```typescript
vi.mock('@/lib/rateLimit', async (importOriginal: () => Promise<object>) => {
  const actual = await importOriginal();
  return {
    ...actual,
    rateLimiter: () => ({
      check: vi.fn(() => {
        return {
          isSubjectToRateLimiting: false,
        };
      }),
    }),
  };
});
```

**Purpose:** Bypass rate limiting in tests (no Redis calls)

#### User Mock

```typescript
export function mockWithUser() {
  vi.mock('@/lib/context', () => {
    return {
      withUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
      Context: vi.fn().mockImplementation(() => ({
        user: { id: 1, name: 'Test User' },
        resHeaders: new Headers(),
      })),
    };
  });
}
```

**Purpose:** Provide authenticated user context without Redis

### Authenticated Caller

**File:** `__tests__/make-call.ts`

```typescript
import { createCallerFactory } from '@/lib/trpc';
import router from '@/lib/router';

export function authedCaller(user: User) {
  const createMockContext = () => ({
    req: {} as Request,
    resHeaders: new Headers(),
    user,
    rateLimit: undefined,
  });

  return {
    caller: createCallerFactory(router)(createMockContext),
    ctx: createMockContext(),
  };
}
```

**Usage:**

```typescript
const { caller } = authedCaller({ id: 1, key: 'test-key' });
const result = await caller.getSubjects.getAllSubjects();
```

**Benefits:**

- Type-safe test calls
- No HTTP overhead
- Direct tRPC invocation

---

## Test Examples

### Authentication Tests

**File:** `__tests__/auth.test.ts`

```typescript
test('unauthorized request fails', async () => {
  const { caller } = authedCaller(null); // No user

  await expect(() => caller.getSubjects.getAllSubjects()).rejects.toThrow('UNAUTHORIZED');
});

test('valid user can access endpoint', async () => {
  const user: User = { id: 1, key: 'test-key' };
  const { caller } = authedCaller(user);

  const result = await caller.getSubjects.getAllSubjects();
  expect(result).toBeDefined();
});
```

### Rate Limit Tests

**File:** `__tests__/rate-limit.test.ts`

```typescript
test('rate limit reduces', async () => {
  const user: User = {
    id: 1,
    key: 'test-normal-rate',
  };
  const { caller } = authedCaller(user);

  const beforeRequest = await caller.getRateLimit.getRateLimit();
  await caller.getSubjects.getAllSubjects();
  const afterRequest = await caller.getRateLimit.getRateLimit();

  expect(afterRequest.remaining).toBe(beforeRequest.remaining - 1);
});

test('unlimited rate users', async () => {
  const user: User = {
    id: 1,
    key: 'test-unlimited-rate',
    rateLimit: 0,
  };
  const { caller } = authedCaller(user);

  const beforeRequest = await caller.getRateLimit.getRateLimit();
  await caller.getSubjects.getAllSubjects();
  const afterRequest = await caller.getRateLimit.getRateLimit();

  expect(afterRequest.remaining).toBe(beforeRequest.remaining); // Unchanged
});

test('custom rate limit', async () => {
  const user: User = {
    id: 1,
    key: 'test-3-rate',
    rateLimit: 3,
  };
  const { caller } = authedCaller(user);

  const beforeRequest = await caller.getRateLimit.getRateLimit();

  for (let i = 0; i < beforeRequest.remaining - 1; i++) {
    await caller.getSubjects.getAllSubjects();
  }

  // Expect to throw on next request
  await expect(() => caller.getSubjects.getAllSubjects()).rejects.toThrow();

  const afterRequest = await caller.getRateLimit.getRateLimit();
  expect(afterRequest.remaining).toBe(0);
});
```

### Endpoint Tests

**File:** `__tests__/subjects.test.ts`

```typescript
test('get all subjects', async () => {
  const { caller } = authedCaller(testUser);
  const result = await caller.getSubjects.getAllSubjects();

  expect(result.subjects).toBeInstanceOf(Array);
  expect(result.subjects.length).toBeGreaterThan(0);

  const mathsSubject = result.subjects.find((s) => s.slug === 'maths');
  expect(mathsSubject).toBeDefined();
  expect(mathsSubject.title).toBe('Maths');
});

test('filter subjects by key stage', async () => {
  const { caller } = authedCaller(testUser);
  const result = await caller.getSubjects.getSubjectsByKeyStage({
    keyStage: 'ks2',
  });

  expect(result.subjects).toBeInstanceOf(Array);
  result.subjects.forEach((subject) => {
    expect(subject.keyStages).toContain('ks2');
  });
});
```

### OpenAPI Schema Tests

**File:** `__tests__/openapi-schema.test.ts`

```typescript
test('OpenAPI schema is valid', async () => {
  const schema = await fetch('http://localhost:2727/api/v0/swagger.json').then((res) => res.json());

  expect(schema.openapi).toBe('3.0.0');
  expect(schema.info).toBeDefined();
  expect(schema.paths).toBeDefined();

  // Validate structure
  for (const [path, methods] of Object.entries(schema.paths)) {
    for (const [method, spec] of Object.entries(methods)) {
      expect(spec.responses).toBeDefined();
      expect(spec.security).toBeDefined();
    }
  }
});
```

---

## Load Testing

**Tool:** Artillery  
**Config:** `__tests__/load-tests.yml`

### Configuration

```yaml
config:
  target: '{{ $processEnvironment.LOAD_TEST_TARGET_URL }}'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 120
      arrivalRate: 50
      name: 'Sustained load'
    - duration: 60
      arrivalRate: 100
      name: 'Peak load'

scenarios:
  - name: 'Get all subjects'
    flow:
      - get:
          url: '/api/v0/subjects'
          headers:
            Authorization: 'Bearer {{ $processEnvironment.OAK_API_AUTH_TOKEN }}'
          expect:
            - statusCode: 200

  - name: 'Search lessons'
    flow:
      - get:
          url: '/api/v0/search/lessons?q=fractions'
          headers:
            Authorization: 'Bearer {{ $processEnvironment.OAK_API_AUTH_TOKEN }}'
          expect:
            - statusCode: 200
```

### Running Load Tests

```bash
# Set environment variables
export LOAD_TEST_TARGET_URL="https://open-api.thenational.academy"
export OAK_API_AUTH_TOKEN="your-api-key"

# Run tests
pnpm load-test
```

### Metrics Tracked

- Request rate (req/sec)
- Response time (p50, p95, p99)
- Error rate
- Concurrent users

---

## Deployment Infrastructure

### Platform: Vercel

**Configuration:** `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Server-Timing",
          "value": "*"
        }
      ]
    }
  ]
}
```

**Deployment Details:**

- **Framework:** Next.js (auto-detected)
- **Build Command:** `pnpm build`
- **Install Command:** `pnpm install`
- **Output Directory:** `.next`
- **Node Version:** 20.x (from `.nvmrc`)

### Vercel Project Settings

**Managed Via:** Terraform  
**Module:** `oaknational/oak-terraform-modules//modules/vercel_project`

**File:** `infrastructure/project/main.tf`

```hcl
module "vercel" {
  source                           = "github.com/oaknational/oak-terraform-modules//modules/vercel_project?ref=v1.3.4"
  build_command                    = "pnpm build"
  build_type                       = "website"
  cloudflare_zone_domain           = var.cloudflare_zone_domain
  environment_variables            = local.environment_variables
  framework                        = "nextjs"
  project_visibility               = "public"
  git_repo                         = "oaknational/oak-openapi"
  install_command                  = "pnpm install"
  protection_bypass_for_automation = false
  domains                          = ["open-api.thenational.academy"]
}
```

### Environment Variables (Terraform-Managed)

**File:** `infrastructure/project/variables.tf`

**Shared Variables (All Environments):**

```hcl
variable "env_vars" {
  type = object({
    shared = object({
      AUTH_USERNAME                 = string
      NEXT_PUBLIC_OAK_ASSETS_HOST   = string
      NEXT_PUBLIC_OAK_ASSETS_PATH   = string
      NEXT_PUBLIC_POSTHOG_API_HOST  = string
      NEXT_PUBLIC_POSTHOG_API_KEY   = string
      NEXT_PUBLIC_SANITY_DATASET    = string
      NEXT_PUBLIC_SANITY_PROJECT_ID = string
      UPSTASH_REDIS_REST_URL        = string
    })
    prod = object({
      NEXT_PUBLIC_POSTHOG_KEY = string
      OAK_GRAPHQL_HOST        = string
      PRODUCTION_API_URL      = string
    })
    preview = object({
      OAK_GRAPHQL_HOST = string
    })
  })
}
```

**Sensitive Variables (Secrets):**

```hcl
variable "AUTH_PASSWORD" { ... }
variable "GOOGLE_APPLICATION_CREDENTIALS_JSON" { ... }
variable "OAK_API_AUTH_TOKEN" { ... }
variable "OAK_GRAPHQL_SECRET" { ... }
variable "PRISMA_ACCELERATE_DATABASE_URL_PREVIEW" { ... }
variable "PRISMA_ACCELERATE_DATABASE_URL_PROD" { ... }
variable "SANITY_AUTH_SECRET" { ... }
variable "UPSTASH_REDIS_REST_TOKEN" { ... }
```

### DNS & Domain

**Domain:** `open-api.thenational.academy`  
**DNS Provider:** Cloudflare  
**Managed Via:** Terraform  
**Zone:** `thenational.academy`

### CI/CD Pipeline

**Trigger:** Push to `main` branch or Pull Request

**Steps:**

1. GitHub Actions runs tests
2. Tests pass → Vercel deployment triggered
3. Vercel builds Next.js app
4. Deploy to preview (PR) or production (main)
5. Environment variables injected from Terraform
6. Health check on deployed URL
7. Update GitHub deployment status

**Deployment Types:**

- **Preview:** Every PR gets unique URL
- **Production:** `main` branch deploys to `open-api.thenational.academy`

---

## Infrastructure as Code

### Terraform Structure

```
infrastructure/
├── project/
│   ├── main.tf           # Vercel project definition
│   ├── variables.tf      # Input variables
│   ├── locals.tf         # Computed locals
│   └── terraform.tf      # Provider config
├── bulk-upload/
│   ├── bucket.tf         # GCS bucket for bulk downloads
│   ├── jobs.tf           # Cloud Run jobs
│   ├── main.tf           # Entry point
│   ├── variables.tf      # Variables
│   └── terraform.tf      # Provider config
└── README.md
```

### Terraform Providers

**File:** `infrastructure/project/terraform.tf`

```hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "remote" {
    organization = "oaknational"

    workspaces {
      prefix = "oak-openapi-project-"
    }
  }
}
```

**State Storage:** Terraform Cloud  
**Workspaces:**

- `oak-openapi-project-production`
- `oak-openapi-project-preview`

### Bulk Upload Infrastructure

**File:** `infrastructure/bulk-upload/bucket.tf`

```hcl
resource "google_storage_bucket" "bulk_uploader" {
  name     = "oak-prod-ldn-bulk-uploader"
  location = "europe-west2"

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}
```

**Features:**

- Auto-delete files older than 90 days
- CORS enabled for direct client access
- Uniform access control

---

## Observability

### Logging

**Destination:** Datadog (via Vercel integration)  
**Format:** Structured JSON

**Example Log:**

```json
{
  "timestamp": "2024-12-07T12:34:56.789Z",
  "level": "info",
  "userId": 123,
  "url": "/api/v0/lessons/fractions-intro/summary",
  "query": "",
  "duration": 145,
  "status": 200
}
```

**Log Sources:**

- API request logs (automatic)
- Custom console.log/error calls
- tRPC error formatter
- Next.js server logs

### Server-Timing Headers

**Implementation:** `src/lib/serverTimings.ts`

```typescript
class Timing {
  private timings: Map<string, { start: number; end?: number }>;

  start(label: string) {
    this.timings.set(label, { start: performance.now() });
  }

  end(label: string) {
    const timing = this.timings.get(label);
    if (timing) {
      timing.end = performance.now();
    }
  }

  toHeader(headers: Headers): string {
    const entries = Array.from(this.timings.entries()).map(([label, { start, end }]) => {
      const duration = end ? (end - start).toFixed(1) : '0';
      return `${label};dur=${duration}`;
    });
    return entries.join(', ');
  }
}
```

**Usage in Handler:**

```typescript
const timing = new Timing();

timing.start('blockLessonForCopyrightText');
const blocked = await blockLessonForCopyrightText(client, slug);
timing.end('blockLessonForCopyrightText');

timing.start('getLesson graphql');
const res = await client.request(query, { slug });
timing.end('getLesson graphql');

resHeaders.set('Server-Timing', timing.toHeader(resHeaders));
```

**Response Header:**

```http
Server-Timing: blockLessonForCopyrightText;dur=12.3, getLesson graphql;dur=45.6
```

**Benefit:** Client-side performance monitoring without instrumentation

### Health Checks

#### Basic Health Check

**Endpoint:** `GET /api/health`  
**File:** `src/app/api/health/route.ts`

```typescript
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
```

#### Pingdom Health Check

**Endpoint:** `GET /api/pingdom`  
**File:** `src/app/api/pingdom/route.ts`

```typescript
export async function GET() {
  // More detailed checks here
  return NextResponse.json({
    status: 'ok',
    checks: {
      redis: await checkRedis(),
      database: await checkDatabase(),
    },
  });
}
```

### Monitoring

**Service:** Datadog  
**Metrics Tracked:**

- Request rate
- Error rate (by status code)
- Response time (p50, p95, p99)
- Rate limit rejections
- User activity

**Dashboards:**

- API overview
- Endpoint performance
- Error tracking
- User analytics

---

## Security

### Secrets Management

**Storage:**

- Terraform Cloud (for Terraform variables)
- Vercel Project Settings (for runtime env vars)

**Access Control:**

- Terraform Cloud: Team-based RBAC
- Vercel: Project members only

**Rotation:**

- No automated rotation
- Manual process via Terraform

### Network Security

**Vercel Protection:**

- Automatic DDoS protection
- WAF (Web Application Firewall)
- Rate limiting at edge

**API Rate Limiting:**

- Application-level (Upstash)
- Per-user limits
- Sliding window algorithm

### Data Security

**In Transit:**

- HTTPS only (enforced by Vercel)
- TLS 1.2+ required

**At Rest:**

- Redis: Encrypted by Upstash
- PostgreSQL: Encrypted by Prisma
- GCS: Server-side encryption

**PII Handling:**

- User data (name, email) in Redis only
- Not logged or exposed in API
- No PII in Datadog logs

---

## Disaster Recovery

### Backup Strategy

**Redis (Upstash):**

- Automatic backups
- Point-in-time recovery
- 7-day retention

**PostgreSQL:**

- Managed by Prisma/database provider
- Automated backups
- 30-day retention

**GCS:**

- Object versioning disabled
- No backup (regenerable content)
- 90-day lifecycle policy

### Recovery Procedures

**Redis Data Loss:**

1. Users must re-generate API keys
2. Rate limit counters reset
3. Minimal impact (temporary inconvenience)

**Database Data Loss:**

1. Restore from backup
2. Rebuild search indexes
3. Downtime: <1 hour

**GCS Data Loss:**

1. Re-run bulk preparation script
2. Regenerate all packages
3. Time: 12-24 hours

### High Availability

**Vercel:**

- Multi-region deployment
- Automatic failover
- 99.99% SLA

**Upstash Redis:**

- Global replication
- Multi-AZ deployment
- Automatic failover

**Hasura/GraphQL:**

- Managed by OWA team
- Not in oak-openapi control

---

## Cost Optimization

### Vercel Costs

**Factors:**

- Build minutes
- Serverless function invocations
- Bandwidth (egress)
- Edge requests

**Optimization:**

- Cache static assets
- Optimize images
- Minimize bundle size
- Use ISR where appropriate

### GCS Costs

**Factors:**

- Storage (per GB/month)
- Egress (per GB)
- API operations

**Optimization:**

- 90-day lifecycle policy
- Direct client downloads (avoid API proxy)
- Regional storage (europe-west2)

### Upstash Redis Costs

**Factors:**

- Storage
- Request count
- Bandwidth

**Optimization:**

- Minimal data per user
- TTL on rate limit keys
- REST API (no persistent connections)

### Overall Spend

**Estimated Monthly Costs:**

- Vercel: $200-500 (depending on traffic)
- Upstash Redis: $50-100
- GCS: $100-300 (with bulk downloads)
- **Total:** ~$350-900/month

---

## Performance Optimization

### Build Performance

**Caching:**

- `node_modules` cached between builds
- Next.js build cache
- Prisma client generation

**Parallelization:**

- TypeScript compilation
- Linting
- Tests

### Runtime Performance

**Serverless Function Optimization:**

- Minimal cold start imports
- Tree-shaking enabled
- Code splitting

**Database Queries:**

- Use materialized views
- GraphQL query caching
- Prisma connection pooling

### CDN & Edge

**Static Assets:**

- Automatic CDN via Vercel
- Edge caching globally

**API Responses:**

- Currently no caching
- Could add for key stages, subjects

---

## Compliance & Governance

### GDPR

**User Data:**

- Name, email, company stored
- Consent: Implicit (business use)
- Right to deletion: Manual via CLI

**Data Processing:**

- UK/EU data centers (Upstash EU, GCS europe-west2)
- No cross-border transfers

### Licensing

**Code License:** MIT (assumed, not in repo)

**Content License:**

- Educational content owned by Oak
- Third-party content gated appropriately

### Accessibility

**API Compliance:**

- N/A (API, not user-facing)

**Documentation:**

- Web UI should be WCAG 2.1 AA compliant
- Swagger UI provides accessibility features

---

## Future Infrastructure Improvements

1. **Multi-Region Deployment**
   - Reduce latency for global users
   - Deploy to US, EU, APAC regions

2. **GraphQL Federation**
   - Consolidate multiple data sources
   - Single GraphQL endpoint

3. **API Gateway**
   - Kong or AWS API Gateway
   - Advanced rate limiting
   - Request transformation

4. **Caching Layer**
   - Redis cache for frequent queries
   - Cache invalidation strategy

5. **Event-Driven Architecture**
   - Webhooks for content updates
   - Real-time notifications
   - Pub/sub for async processing

6. **Container Orchestration**
   - Move from serverless to Kubernetes
   - Better control over resources
   - Custom runtime optimization



