---
boundary: B4-Engineering-Operations
doc_role: index
authority: operations-navigation
status: active
last_reviewed: 2026-03-12
---

# Operations Documentation

This boundary contains runtime and support documentation for operating and
debugging the system.

## Contents

- [Environment Variables](./environment-variables.md) - Runtime configuration
  and environment setup details
- [Production Debugging Runbook](./production-debugging-runbook.md) -
  Production diagnostics and incident response workflow
- [Troubleshooting](./troubleshooting.md) - Common failure modes and practical
  fixes
- [Elasticsearch Ingest Lifecycle](./elasticsearch-ingest-lifecycle.md) -
  Blue/green index lifecycle validation and ingest procedure
- [Sentry Deployment Runbook](./sentry-deployment-runbook.md) - How to
  enable live Sentry error capture and tracing for Oak runtimes
- [Sentry CLI Usage](./sentry-cli-usage.md) - When to use `sentry-cli`
  (automation) vs the dev `sentry` CLI, `.sentryclirc` composition,
  per-workspace ownership

## Relationship to Engineering Docs

Engineering implementation workflows and build/lifecycle guidance live under
[docs/engineering](../engineering/README.md).
