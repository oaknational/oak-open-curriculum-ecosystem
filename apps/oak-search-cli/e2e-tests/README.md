# E2E Tests

End-to-end tests for the `oaksearch` CLI. An E2E test here boots the built CLI
as a running system and drives it over its stdio protocol channel (argv ->
stdout/stderr/exit code), asserting on transport invariants. Per
`.agent/directives/testing-strategy.md`, these tests are **network-free**: they
must not reach Elasticsearch or any network service.

## Test Types

- **CLI contract** (`cli-contract.e2e.test.ts`) — boots the built CLI
  (`dist/bin/oaksearch.js`) and asserts its command-line contract: `--version`
  reports a semantic version, `--help` lists the top-level commands, and an
  unknown command exits non-zero with a stderr diagnostic. No Elasticsearch, no
  network.

## Running

```bash
pnpm test:e2e
```

The build is a precondition (turbo `test:e2e` dependsOn `build`); `pnpm test:e2e`
runs the suite against the compiled `dist/`.

## Where live-Elasticsearch validation lives (not here)

Search-quality measurement (MRR, NDCG@10, and other IR metrics against ground
truth) requires a live Elasticsearch index and is therefore **smoke/experiment**
territory, not E2E — see `vitest.smoke.config.ts` and the `eval benchmark`
command surface (`pnpm benchmark`, `pnpm ground-truth:validate`). Keeping that
network-bound work out of E2E is what lets the E2E suite run safely in CI/CD.
