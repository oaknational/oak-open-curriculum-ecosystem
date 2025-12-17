# Oak OpenAPI - Quick Reference Cheat Sheet

> One-page reference for common operations and key information

## 🔑 API Key Management

### Check Rate Limit

```bash
curl -H "Authorization: Bearer {key}" \
  https://open-api.thenational.academy/api/v0/rate-limit
```

### Find User by Email

```bash
pnpm with-env tsx bin/find-api-user.ts user:email:user@example.com
```

### Update Rate Limit

```bash
# Set to 5000 requests/hour
pnpm with-env tsx bin/find-api-user.ts user:email:user@example.com 5000

# Set to unlimited
pnpm with-env tsx bin/find-api-user.ts user:email:user@example.com 0
```

### Create API Key (Web UI)

Navigate to: https://open-api.thenational.academy/admin

---

## 🌐 API Endpoints

### Base URL

```
https://open-api.thenational.academy/api/v0
```

### Authentication Header

```http
Authorization: Bearer {api-key}
```

### Common Endpoints

```bash
# Get all key stages
GET /keystages

# Get all subjects
GET /subjects

# Get subjects by key stage
GET /subjects?keyStage=ks2

# Search lessons
GET /search/lessons?q=fractions

# Get lesson summary
GET /lessons/{lessonSlug}/summary

# Get lesson transcript
GET /lessons/{lessonSlug}/transcript

# Get lesson video asset
GET /lessons/{lessonSlug}/assets/video

# Get sequence units
GET /sequences/{sequenceSlug}/units

# Check rate limit (no-cost)
GET /rate-limit
```

---

## 🗄️ Redis (Upstash)

### Instance

```
URL: https://dominant-hippo-43403.upstash.io
```

### Environment Variables

```bash
UPSTASH_REDIS_REST_URL=https://dominant-hippo-43403.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### Redis Keys

**User Record:**

```
Key: user:{api-key}
Type: Hash
Fields: id, key, email, name, company, rateLimit, requests, lastRequest
```

**Email Index:**

```
Key: user:email:{email}
Type: String
Value: {api-key}
```

**Rate Limit Counters:**

```
Key: rateLimit:standard:{api-key}:current
Key: rateLimit:standard:{api-key}:previous
```

---

## 🔧 Development

### Start Dev Server

```bash
pnpm dev
# Runs on http://localhost:2727
```

### Run Tests

```bash
# All tests
pnpm test

# Specific test
pnpm test --testNamePattern="rate limit"

# Watch mode
pnpm test --watch
```

### Generate OpenAPI Schemas

```bash
pnpm generate:openapi
```

### Build Subjects Data

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Generate subjects
pnpm build-subjects
```

### Format Code

```bash
pnpm format
```

### Lint

```bash
pnpm lint
```

---

## 📦 Bulk Downloads

### Prepare Bulk Data

```bash
# Full build (requires Node 22+)
NODE_OPTIONS='--max-old-space-size=4096' tsx bin/prepare-bulk.ts

# Single subject/phase
tsx bin/prepare-bulk.ts maths-primary

# Metadata only (no assets)
INCLUDE_ASSETS=false tsx bin/prepare-bulk.ts
```

### Start Video Download Helper

```bash
./bin/bulk-download-videos.sh
```

### Request Bulk Download

```bash
POST /api/bulk
Content-Type: application/json

{
  "subjects": ["maths-primary", "science-secondary"]
}
```

---

## 🛠️ Infrastructure

### Deploy to Production

```bash
# Merge PR to main branch
git checkout main
git pull origin main
git merge feature-branch
git push origin main

# Vercel auto-deploys
```

### Terraform Apply

```bash
cd infrastructure/project
terraform init
terraform plan
terraform apply
```

### Check Deployment Status

- Vercel Dashboard: https://vercel.com/oaknational/oak-openapi
- GitHub Actions: Check PR status

---

## 📊 Monitoring

### Health Checks

```bash
# Basic health
curl https://open-api.thenational.academy/api/health

# Detailed health (Pingdom)
curl https://open-api.thenational.academy/api/pingdom
```

### View Logs

- Datadog: Search for service `open-api.thenational.academy`
- Vercel Dashboard: Deployments → Logs

### Server-Timing Header

```bash
curl -H "Authorization: Bearer {key}" \
  -i https://open-api.thenational.academy/api/v0/lessons/some-lesson/summary \
  | grep Server-Timing
```

---

## 🐛 Troubleshooting

### Issue: Rate Limited

**Symptom:** 429 Too Many Requests  
**Solution:**

1. Check current usage: `GET /rate-limit`
2. Wait for reset timestamp
3. Or increase limit: `pnpm with-env tsx bin/find-api-user.ts user:email:{email} {newLimit}`

### Issue: Unauthorized

**Symptom:** 401 Unauthorized  
**Solution:**

1. Verify API key exists: `pnpm with-env tsx bin/find-api-user.ts user:email:{email}`
2. Check Authorization header format: `Bearer {key}`
3. Ensure Redis is accessible

### Issue: Lesson Not Found

**Symptom:** 404 Not Found  
**Solution:**

1. Check lesson slug is correct
2. Verify lesson isn't blocked by copyright gating
3. Check if lesson is marked as `isLegacy: true`

### Issue: Slow Response

**Symptom:** Response time > 1s  
**Solution:**

1. Check `Server-Timing` header for bottlenecks
2. Review Datadog logs for slow queries
3. Check if external services (Mux, GCS) are slow
4. Consider adding caching

### Issue: OpenAPI Schema Out of Sync

**Symptom:** Generated schema doesn't match code  
**Solution:**

```bash
pnpm generate:openapi
git add src/lib/zod-openapi/generated/
git commit -m "chore: regenerate OpenAPI schemas"
```

---

## 📁 Key Files

### Core

- `src/lib/router.ts` - Main API router
- `src/lib/protect.ts` - Auth & rate limiting
- `src/lib/context.ts` - Request context

### Data

- `src/lib/owaClient.ts` - GraphQL client
- `src/lib/apikeys.ts` - User management
- `src/lib/rateLimit.ts` - Rate limit config

### Handlers

- `src/lib/handlers/*/` - Endpoint implementations

### Config

- `.env` - Environment variables (local)
- `vercel.json` - Vercel configuration
- `schema.prisma` - Database schema
- `tsconfig.json` - TypeScript config

---

## 🔐 Security

### Default Rate Limit

```
1,000 requests/hour (sliding window)
```

### Unlimited Access

```bash
# Set rate limit to 0
pnpm with-env tsx bin/find-api-user.ts user:email:{email} 0

# Or use OAK_API_AUTH_TOKEN env var (master key)
```

### Response Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1702123456
```

### On Rate Limit Exceeded

```http
HTTP/1.1 429 Too Many Requests
X-Retry-After: 1702123456
```

---

## 📈 Performance

### Typical Response Times

- Fast (<100ms): Key stages, subjects
- Medium (100-300ms): Lessons, sequences
- Slow (300ms-1s): Search queries
- Very Slow (1s+): Asset endpoints

### Caching

- Hasura: 5 minutes (GraphQL `@cached(ttl: 300)`)
- Application: None (serverless)
- CDN: Vercel edge (static assets)

---

## 🌍 Data Sources

### OWA Hasura GraphQL

```
Endpoint: ${OAK_GRAPHQL_HOST}/v1/graphql
Auth: x-oak-auth-key, x-oak-auth-type
```

**Views:**

- `published_mv_lesson_openapi_1_2_3` - Lessons
- `published_mv_curriculum_sequence_b_13_0_17` - Sequences
- `published_mv_subject_phase_options_0_11` - Subjects
- `published_mv_openapi_downloads_1_0_0` - Assets

### PostgreSQL (Prisma)

```
Connection: PRISMA_ACCELERATE_DATABASE_URL
```

**Tables:**

- `lessons` - Lesson metadata
- `snippets` - Transcript chunks (for search)

### External APIs

- **Mux:** Video streaming/downloads
- **GCS:** File assets (worksheets, presentations)
- **Sanity:** Documentation content

---

## 🎯 Common Tasks

### Add New Endpoint

1. Create handler: `src/lib/handlers/{name}/{name}.ts`
2. Create schemas: `schemas/*.schema.ts`
3. Add examples: `examples/*.json`
4. Run: `pnpm generate:openapi`
5. Add to router: `src/lib/router.ts`
6. Write tests: `__tests__/{name}.test.ts`

### Update Rate Limit

```bash
pnpm with-env tsx bin/find-api-user.ts user:email:{email} {limit}
```

### Deploy Change

```bash
git push origin main
# Vercel auto-deploys
```

### View Production Logs

1. Visit Vercel Dashboard
2. Select deployment
3. Click "Logs" tab

### Test Endpoint Locally

```bash
# Start server
pnpm dev

# Test with curl
curl -H "Authorization: Bearer test-key" \
  http://localhost:2727/api/v0/subjects
```

---

## 📞 Support

### Documentation

- **Full Docs:** `.agent/research/ooc/README.md`
- **Swagger UI:** https://open-api.thenational.academy/playground
- **Web Docs:** https://open-api.thenational.academy/docs

### Dashboards

- **Vercel:** https://vercel.com/oaknational/oak-openapi
- **Upstash:** https://console.upstash.com/
- **Datadog:** Dashboard for `open-api.thenational.academy`

### Emergency Contacts

- Platform Team (internal)
- DevOps Team (infrastructure issues)

---

## 💡 Pro Tips

1. **Use `noCost: true` for read-only metadata endpoints** (e.g., rate-limit check)
2. **Set `rateLimit: 0` for internal/unlimited access** (not for external users)
3. **Use Server-Timing headers to debug slow responses**
4. **Run `pnpm generate:openapi` after schema changes** (or it won't work!)
5. **Check copyright gating before exposing new content**
6. **Use materialized views for performance** (not raw tables)
7. **Mock external services in tests** (avoid hitting real APIs)
8. **Set NODE_OPTIONS for bulk downloads** (needs 4GB+ heap)

---

## 🚀 Getting Help

### First Steps

1. Check this quick reference
2. Search full documentation (`.agent/research/ooc/`)
3. Check Datadog logs for errors
4. Review GitHub Issues

### Still Stuck?

- Ask Platform Team (internal)
- Check Swagger docs for endpoint details
- Review test files for usage examples

---

**Last Updated:** December 7, 2025  
**Documentation Location:** `.agent/research/ooc/`











