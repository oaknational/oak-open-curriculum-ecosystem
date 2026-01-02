# ELSER Ingestion Scaling and Backpressure

This note describes method guidance for ingesting data into `semantic_text` fields backed by ELSER, with attention to throughput and reliability.

## 1. Expect Inference to Be the Bottleneck

ELSER inference is compute-heavy. Bulk indexing can outpace inference, which means:

- Inference queues can fill.
- Requests can be rejected (429).
- Bulk responses must be inspected and retried.

## 2. Use Backpressure and Retries

Recommended practices:

- Throttle bulk ingestion (small batches, controlled rate).
- Inspect bulk responses and retry failed items with exponential backoff.
- Avoid fire-and-forget bulk requests.

## 3. Separate Ingest and Search Workloads

Where possible, isolate heavy ingestion from search traffic:

- Use a dedicated inference endpoint for ingest.
- Keep query-time inference separate to protect search latency.

## 4. Monitor and Tune

Track:

- Bulk failure rates.
- Inference queue saturation.
- End-to-end ingestion throughput.

If you control model allocations (non-serverless deployments), increase allocations for ingestion and keep threads at 1 per allocation for throughput.

## 5. Oak CLI/SDK Integration Notes (Current)

These notes are system-specific and may drift; treat them as integration examples and check `../system/` for current status.

- Bulk uploads are chunked to 10MB with a default 2500ms delay between chunks to reduce ELSER queue pressure (`src/lib/indexing/bulk-chunk-utils.ts`).
- Two-tier retry is in place: HTTP-level chunk retry plus document-level retry for retryable status codes (429, 502, 503, 504) with exponential backoff and jitter (`src/lib/indexing/bulk-chunk-uploader.ts`, `src/lib/indexing/retry/*`).
- Bulk ingestion CLI flags (`--max-retries`, `--retry-delay`, `--no-retry`) tune document-level retry for bulk-first ingestion (`src/lib/elasticsearch/setup/ingest-live.ts`, `src/lib/elasticsearch/setup/ingest-bulk.ts`).
- Ingestion is batch-atomic by default (subject + key stage granularity) via `src/lib/index-batch-generator.ts` and `src/lib/indexing/ingest-harness.ts`.

## References

- ELSER: https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-elser
- ML endpoints (deployment controls): https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-ml
- Update trained model deployment (allocations, adaptive allocations): https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-ml-update-trained-model-deployment
- Bulk API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-bulk
- Reindex API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-reindex
- Rethrottle API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-reindex-rethrottle
