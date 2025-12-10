# E2E Tests

End-to-end tests for the Oak Open Curriculum Semantic Search application.

## Test Types

- **Search Quality Benchmarks** (`search-quality.e2e.test.ts`) - Measures MRR, NDCG@10, and other IR metrics against ground truth relevance judgments

## Running Tests

Ensure the development server is running before executing E2E tests:

```bash
# Terminal 1: Start the dev server
pnpm dev

# Terminal 2: Run E2E tests
pnpm test:e2e
```

## Environment

Tests expect the server at `http://localhost:3333` (or the value of `TEST_BASE_URL` environment variable).
