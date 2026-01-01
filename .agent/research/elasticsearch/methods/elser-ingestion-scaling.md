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

## References

- ELSER: https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-elser
- ML endpoints (deployment controls): https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-ml
- Update trained model deployment (allocations, adaptive allocations): https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-ml-update-trained-model-deployment
- Bulk API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-bulk
- Reindex API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-reindex
- Rethrottle API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-reindex-rethrottle
