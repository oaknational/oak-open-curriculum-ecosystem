# API Rate Limit Resolution Plan

**Status**: IN PROGRESS  
**Date Created**: 2025-12-07  
**Related**: ADR-070, `.agent/analysis/api-rate-limit-investigation.md`

## Current Situation

### API Constraints Discovered

Through investigation using the `ooc-http-dev-local/get-rate-limit` MCP tool, we discovered:

**Oak API Rate Limit**: **1000 requests per hour** (rolling window)

**Our Requirements**:

- 340 combinations to ingest (17 subjects × 4 key stages × 5 indexes)
- ~50-200 requests per combination
- **Total**: 17,000-68,000 requests needed
- **Time at 1000 req/hour**: 17-68 hours

### Solutions Implemented ✅

1. **Rate Limit Tracking** - Real-time monitoring of API quota
2. **Singleton Client Pattern** - Ensures all requests share rate limiting state
3. **Conservative Rate Limiting** - 5 req/sec (far under theoretical limit)
4. **Exponential Backoff Retry** - 5 attempts with 1s, 2s, 4s, 8s, 16s delays
5. **Monitoring & Logging** - Warnings at 75% and 90% quota usage

### Current Status

**SDK Ready**: ✅ Rate limiting, retry, and monitoring fully implemented and tested

**Test Results**: Art KS1 sequences ingestion

- 159 requests, 2.08 req/sec
- 0 failures
- 671/1000 quota used
- Real-time monitoring working

**Blocking Issue**: API rate limit prevents rapid full ingestion

## Three-Path Strategy

### Path 1: Request API Rate Limit Increase ⭐ RECOMMENDED

**Approach**: Contact Oak API team with usage data

**Deliverables** (READY):

- Documented usage patterns (`.agent/analysis/api-rate-limit-investigation.md`)
- Test results showing successful operation
- Specific requests for higher limits

**Recommendations for API Team**:

1. **Dedicated Bulk Ingestion Key**
   - 5,000-10,000 requests/hour for data operations
   - Keeps 1,000 req/hour for normal app usage
   - Reduces ingestion time from 17 hours to 3-4 hours

2. **Batch Endpoints** (long-term)
   - `/bulk/lessons?subject=maths&keystage=ks2`
   - Single request returns all needed data
   - Reduces request count by 10-50x

3. **Ingestion-Specific Endpoint** (ideal)
   - `/ingestion/{subject}/{keystage}` returns complete dataset
   - Optimized specifically for bulk operations

**Timeline**: Depends on API team response

**Benefits**:

- ✅ Fastest path to full ingestion
- ✅ No architectural changes needed
- ✅ Simple operational model

**Risks**:

- ⏳ Depends on external team
- ⏳ May take time to implement

### Path 2: Overnight Local Ingestion

**Approach**: Run systematic ingestion overnight on local machine

**Prerequisites** (ALL MET):

- ✅ SDK rate limiting and retry implemented
- ✅ Singleton pattern ensuring shared state
- ✅ Progress tracking with `.ingest-progress.json`
- ✅ Safe interrupt and resume capability
- ✅ Real-time monitoring

**Execution**:

```bash
cd apps/oak-search-cli

# Check current state
pnpm ingest:progress

# Start ingestion (run overnight)
pnpm ingest:all

# Monitor in another terminal (optional)
watch -n 30 'pnpm ingest:progress'
```

**Timeline**: 20-24 hours (one overnight run)

**Benefits**:

- ✅ Can start immediately
- ✅ No code changes needed
- ✅ Safe to interrupt and resume
- ✅ Full monitoring and logging

**Risks**:

- ⚠️ Requires stable local machine for 20-24 hours
- ⚠️ Network interruptions require restart
- ⚠️ Not automated/repeatable

**Mitigation**:

- Run in `tmux` or `screen` session
- SSH to stable server if available
- Resume capability handles interruptions

### Path 3: Vercel Function Migration (FUTURE)

**Approach**: Move ingestion to Vercel long-running function

**Current Vercel Constraints**:

- Hobby/Pro: 60 second max execution
- Enterprise: 15 minute max execution
- Streaming responses: Can extend time but complex

**Required Architecture Changes**:

1. **Incremental Ingestion Pattern**
   - Process one combination at a time
   - Use Vercel cron to schedule hourly
   - Each run stays within 60s limit
   - 340 combinations = 340 hours (14 days) at 1/hour

2. **Queue-Based Architecture**
   - Add job queue (Redis, Vercel KV, or DynamoDB)
   - API endpoint triggers ingestion jobs
   - Worker function processes queue items
   - Handles rate limits and failures

3. **Streaming Ingestion API**
   - Start ingestion, return immediately
   - Client polls for progress
   - Server-sent events for real-time updates
   - Complex to implement correctly

**Timeline**: 2-3 days development + testing

**Benefits**:

- ✅ Automated, repeatable process
- ✅ No local machine dependency
- ✅ Production-grade solution
- ✅ Can trigger via API or cron

**Risks**:

- ⚠️ Complex architectural changes
- ⚠️ Still constrained by API rate limit
- ⚠️ Requires testing in Vercel environment
- ⚠️ May need paid Vercel plan

**Dependencies**:

- Vercel Pro or Enterprise plan for longer functions
- OR incremental ingestion design
- OR queue infrastructure

## Recommended Action Plan

### Phase 1: Immediate (This Week)

**1. Contact Oak API Team** ⭐ PRIORITY 1

- Share `.agent/analysis/api-rate-limit-investigation.md`
- Request higher rate limit for bulk operations
- Propose batch endpoints as alternative

**2. Run Overnight Ingestion** ⭐ PRIORITY 2

- Execute `pnpm ingest:all` overnight
- Monitor with `pnpm ingest:progress`
- Document any issues encountered

**3. Document Results**

- Actual time taken for full ingestion
- Any failures and patterns
- Quota usage patterns throughout

### Phase 2: Short-term (Next Week)

**If API rate limit increased**:

- Re-run full ingestion at higher rate
- Verify no issues with faster ingestion
- Document optimal configuration

**If no rate limit increase**:

- Complete overnight ingestion
- Set up weekly re-ingestion schedule
- Plan Vercel function migration

### Phase 3: Long-term (Next Month)

**Vercel Function Design** (regardless of rate limit)

- Design incremental ingestion architecture
- Create queue-based system
- Implement cron-triggered updates
- Test in production environment

**Benefits of Vercel Migration**:

- Automated re-ingestion (weekly/daily)
- No manual intervention required
- Production-grade reliability
- API rate limiting still respected

## Success Criteria

### Must Have ✅

- [x] SDK rate limiting and retry implemented
- [x] Real-time monitoring of API quota
- [x] Safe interrupt and resume capability
- [ ] Full ingestion completed (340 combinations)
- [ ] All indexes populated with current data

### Should Have

- [ ] API rate limit increased (or clear timeline)
- [ ] Automated ingestion process designed
- [ ] Weekly re-ingestion schedule established
- [ ] Documentation for future ingestions

### Nice to Have

- [ ] Vercel function implementation
- [ ] Batch API endpoints available
- [ ] Sub-4-hour full ingestion time

## Monitoring & Metrics

### During Ingestion

Track via `.ingest-progress.json` and logs:

- Combinations completed/failed
- Requests per second
- API quota remaining
- Time per combination
- Estimated completion time

### Key Metrics to Report

For API team discussion:

- Total requests needed: 17,000-68,000
- Current rate: 2-5 req/sec actual
- Burst rate: 5 req/sec maximum
- Time with current limit: 17-68 hours
- Time with proposed limit: 3-10 hours

## Risk Mitigation

### If Ingestion Fails

- Progress saved in `.ingest-progress.json`
- Resume with `pnpm ingest:all --resume`
- Individual failures don't stop entire process
- Detailed logs for debugging

### If Rate Limit Hit

- Automatic retry with exponential backoff
- Warning logs before hitting limit
- Monitoring shows quota status
- Safe to pause and resume later

### If API Changes

- Rate limit tracker captures headers
- Adapts to different limit values
- Logs show actual API responses
- Can adjust configuration quickly

## Next Actions

**Immediate** (today):

1. ✅ Document findings (DONE)
2. ✅ Update ADR-070 (DONE)
3. ✅ Update semantic search prompt (PENDING)
4. ⏳ Draft email to Oak API team
5. ⏳ Schedule overnight ingestion run

**This Week**:

1. Execute overnight ingestion
2. Send request to API team
3. Monitor and document results

**Next Week**:

1. Review API team response
2. Plan Vercel function design (separate analysis)
3. Establish re-ingestion schedule

## References

- **Analysis**: `.agent/analysis/api-rate-limit-investigation.md`
- **ADR**: `docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md`
- **Ingestion Guide**: `apps/oak-search-cli/scripts/README-INGEST-ALL.md`
- **Rate Limit Tracker**: `packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit-tracker.ts`
- **Test Results**: Art KS1 sequences (159 requests, 0 failures)
