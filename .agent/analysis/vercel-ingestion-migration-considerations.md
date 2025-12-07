# Vercel Function Ingestion Migration - High-Level Considerations

**Date**: 2025-12-07  
**Status**: EXPLORATORY  
**Context**: Planning future migration from local ingestion to automated Vercel function

## Executive Summary

Moving curriculum ingestion from local execution to Vercel functions enables automated, reliable, scheduled re-ingestion. However, it requires architectural changes to work within Vercel's execution time limits and respect the Oak API's 1000 requests/hour rate limit.

**Key Constraint**: Even with Vercel Enterprise (15-minute max), we cannot complete all 340 combinations in one execution (requires 17-24 hours).

**Solution**: Incremental ingestion architecture with queue-based processing.

## Vercel Execution Limits

| Plan       | Max Execution Time | Notes                                       |
| ---------- | ------------------ | ------------------------------------------- |
| Hobby      | 10 seconds         | Serverless functions                        |
| Pro        | 60 seconds         | Serverless functions                        |
| Enterprise | 15 minutes         | Configurable per function                   |
| Edge       | 30 seconds         | Edge runtime (limited Node.js capabilities) |

**Current Ingestion Needs**:

- 340 combinations × 30-120 seconds each = 17-24 hours
- Far exceeds any Vercel limit

## Architecture Options

### Option 1: Incremental Processing with Cron ⭐ RECOMMENDED

**Pattern**: Process small batches on schedule, respect API limits

**Architecture**:

```typescript
// Vercel Cron: Runs every hour
export const config = { schedule: '0 * * * *' }; // Every hour

export default async function handler(req, res) {
  // 1. Get next pending combination from queue/state
  const next = await getNextPendingCombination();
  if (!next) return res.json({ status: 'complete' });

  // 2. Ingest single combination (30-120 seconds)
  await ingestCombination(next.subject, next.keyStage, next.index);

  // 3. Update progress
  await markComplete(next);

  return res.json({ status: 'processing', remaining: await countPending() });
}
```

**Timeline**: 340 combinations / 1 per hour = **14 days for full ingestion**

**Benefits**:

- ✅ Works within 60-second Vercel Pro limit
- ✅ Respects API rate limit (1 combination per hour = ~50-200 requests)
- ✅ Automatic via cron
- ✅ No manual intervention
- ✅ Progress persisted between executions

**Challenges**:

- ⏳ Slow (14 days for full re-ingestion)
- 🔧 Need persistent state store (Vercel KV, Redis, DynamoDB)
- 🔧 Need queue or progress tracking system

**State Storage Options**:

- **Vercel KV** (Redis): Built-in, easy integration
- **DynamoDB**: AWS-hosted, more complex but robust
- **Postgres**: Existing if we have it
- **File-based**: `.ingest-progress.json` → Vercel Blob Storage

### Option 2: Queue-Based Background Processing

**Pattern**: API triggers jobs, background worker processes queue

**Architecture**:

```typescript
// API Route: Trigger ingestion
export default async function POST handler(req, res) {
  // Add all 340 combinations to queue
  await queue.addBulk(generateCombinations());
  return res.json({ status: 'queued', count: 340 });
}

// Worker Function (runs continuously or on queue events)
export default async function worker(req, res) {
  while (await queue.hasWork()) {
    const job = await queue.next();
    await ingestCombination(job.data);
    await queue.complete(job.id);

    // Respect rate limits
    if (await checkRateLimitApproaching()) {
      await queue.pause(60_000); // Pause 1 minute
    }
  }
}
```

**Timeline**: Depends on rate limiting and parallel workers

**Benefits**:

- ✅ More flexible than cron
- ✅ Can pause/resume based on quota
- ✅ Parallel processing possible (if API limit allows)
- ✅ Better error handling and retries

**Challenges**:

- 🔧 Requires queue infrastructure (BullMQ, AWS SQS, etc.)
- 🔧 More complex setup
- 🔧 Still constrained by API rate limit
- 🔧 Need worker management

**Queue Options**:

- **Vercel + Redis + BullMQ**: Good integration
- **AWS SQS + Lambda**: More enterprise-grade
- **Upstash QStash**: Serverless-first queue

### Option 3: Streaming Response with Client Polling

**Pattern**: Start long process, return immediately, client polls for progress

**Architecture**:

```typescript
// Start ingestion (returns immediately)
export default async function POST handler(req, res) {
  const jobId = await startBackgroundIngestion();
  return res.json({ jobId, statusUrl: `/api/ingestion/status/${jobId}` });
}

// Poll for status
export default async function GET handler(req, res) {
  const { jobId } = req.query;
  const status = await getIngestionStatus(jobId);
  return res.json(status);
}

// Background worker (separate function or service)
async function startBackgroundIngestion() {
  // Runs outside request/response cycle
  // Updates status in database
  // Returns job ID immediately
}
```

**Timeline**: Full 17-24 hours, but outside request/response

**Benefits**:

- ✅ Can run for full duration
- ✅ Client notified when complete
- ✅ Real-time progress updates

**Challenges**:

- 🔧 Need background execution environment (not Vercel serverless)
- 🔧 Requires separate worker service
- 🔧 Complex state management
- 🔧 Client polling overhead

## Recommended Approach

### Phase 1: Incremental Cron-Based (Short-term) ⭐

**When**: After API rate limit investigation complete

**Implementation**:

1. Create Vercel cron endpoint: `/api/cron/ingest-next`
2. Store progress in Vercel KV or DynamoDB
3. Process one combination per hour
4. Full re-ingestion every 14 days automatically

**Code Structure**:

```
app/api/cron/
├── ingest-next/
│   └── route.ts          # Cron endpoint (processes next combination)
└── ingest-status/
    └── route.ts          # Status endpoint (check progress)

app/lib/ingestion-queue/
├── state-manager.ts      # Read/write progress to Vercel KV
├── combination-queue.ts  # Generate and track combinations
└── ingestion-executor.ts # Execute single combination ingestion
```

**Timeline**: 1-2 days development + testing

### Phase 2: Enhanced with Manual Trigger (Medium-term)

**Add API endpoints** for manual control:

```typescript
// Trigger full re-ingestion
POST / api / ingestion / trigger;

// Pause ongoing ingestion
POST / api / ingestion / pause;

// Resume paused ingestion
POST / api / ingestion / resume;

// Get current status
GET / api / ingestion / status;
```

**Timeline**: +1 day development

### Phase 3: Queue-Based (Long-term)

**When**: If we need faster re-ingestion or parallel processing

**Requirements**:

1. Higher API rate limit from Oak team
2. Queue infrastructure (Redis + BullMQ or SQS)
3. Worker scaling strategy

**Timeline**: 3-5 days development + infrastructure

## Key Design Considerations

### 1. State Management

**Options**:

- **Vercel KV** (Redis): Fast, built-in, $10/mo for 500MB
- **Vercel Postgres**: Relational, queryable, $24/mo
- **Vercel Blob**: Large objects, good for progress files
- **DynamoDB**: AWS-hosted, pay-per-use
- **Upstash Redis**: Serverless Redis, pay-per-request

**Recommendation**: Start with Vercel KV (simplest integration)

### 2. Progress Tracking

**Must Track**:

```typescript
interface IngestionState {
  startedAt: Date;
  lastUpdated: Date;
  totalCombinations: number;
  completed: number;
  failed: number;
  pending: CombinationId[];
  current?: CombinationId;
  results: CombinationResult[];
}
```

**Storage**: Vercel KV with key `ingestion:state`

### 3. Error Handling

**Strategies**:

- Automatic retry with exponential backoff (SDK already does this)
- Track failures separately from crashes
- Alert on repeated failures (same combination fails 3x)
- Continue processing other combinations on failure

### 4. Rate Limit Awareness

**Monitor**:

```typescript
// Check before starting each combination
const quota = await oakClient.rateLimitTracker.getStatus();
if (quota.remaining < 100) {
  // Wait until reset or skip this run
  return { status: 'rate_limited', retryAt: quota.resetDate };
}
```

**Adaptive Scheduling**:

- If quota low, pause until reset
- Log quota status to monitoring
- Adjust cron frequency if needed

### 5. Observability

**Logging**:

- Each ingestion run logs: combination, duration, requests used
- Progress updates to monitoring service
- Errors to error tracking (Sentry, etc.)

**Metrics**:

- Combinations processed per day
- Success rate
- Average duration per combination
- API quota usage patterns

## Migration Path

### Step 1: Prototype (1 day)

Create minimal Vercel function:

```bash
# Test single combination ingestion via Vercel function
pnpm ingest-via-vercel --subject art --keystage ks1 --index sequences
```

Verify:

- ✅ Works within 60-second limit
- ✅ Progress saved to Vercel KV
- ✅ Rate limiting respected
- ✅ Monitoring integrated

### Step 2: Cron Implementation (1 day)

Add `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/ingest-next",
      "schedule": "0 * * * *"
    }
  ]
}
```

Test:

- Manually trigger cron endpoint
- Verify state persistence
- Check automatic execution

### Step 3: Status Dashboard (1 day)

Create UI page showing:

- Current progress (X/340)
- Last run time
- Success/failure count
- Estimated completion
- Manual trigger button

### Step 4: Production Deploy

Deploy to Vercel with:

- Environment variables configured
- Cron enabled
- Monitoring active
- Alert routing set up

## Cost Estimate

**Vercel Pro Plan**: $20/month base

- 1,000 GB-hours compute
- 1 concurrent build
- Unlimited cron jobs

**Vercel KV** (if used): $10/month

- 500 MB storage
- 50K daily requests
- More than enough for progress tracking

**Total**: ~$30/month for automated ingestion

**ROI**: Eliminates manual 20-hour ingestion runs

## Risks & Mitigation

| Risk                             | Mitigation                                 |
| -------------------------------- | ------------------------------------------ |
| Cron fails silently              | Monitoring alerts, dead man's switch       |
| State corruption                 | Versioned state, backup/restore capability |
| API rate limit still hit         | Adaptive scheduling, pause on low quota    |
| Long re-ingestion time (14 days) | Phase 2: Request higher API limit          |
| Vercel function cold starts      | Acceptable for hourly cron                 |
| Cost exceeds budget              | Monitor usage, adjust frequency if needed  |

## Next Steps (When Ready)

1. ✅ Complete local ingestion first
2. ✅ Resolve API rate limit with Oak team
3. ⏳ Create prototype Vercel function
4. ⏳ Set up Vercel KV for state
5. ⏳ Implement cron endpoint
6. ⏳ Add status dashboard
7. ⏳ Deploy to production
8. ⏳ Monitor first full cycle

## References

- **Rate Limit Analysis**: `.agent/analysis/api-rate-limit-investigation.md`
- **Current Ingestion**: `apps/oak-open-curriculum-semantic-search/scripts/ingest-all-combinations.ts`
- **Progress Tracking**: `apps/oak-open-curriculum-semantic-search/scripts/check-progress.ts`
- **Vercel Docs**: https://vercel.com/docs/functions/runtimes#max-duration
- **Vercel Cron**: https://vercel.com/docs/cron-jobs
- **Vercel KV**: https://vercel.com/docs/storage/vercel-kv
