---
boundary: B4-Engineering-Operations
doc_role: index
authority: operations-navigation
status: active
last_reviewed: 2026-08-11
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
- [MCP Server UAT Validation Runbook](../../apps/oak-curriculum-mcp-streamable-http/docs/manual-uat-guide.md) -
  Repeatable, whole-server black-box validation of the Curriculum MCP server
  (all tools, resources, prompts; response-shape contract; run-record
  template) — run before a release and after any deploy
- [MCP Server Observability Wiring](../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md) -
  Per-app authoritative guide: auto-instrumentation, per-request span, scope
  enrichment, Express error handler DI wiring, redaction barrier entry points,
  source-map upload
- [Sentry Node Library](../../packages/libs/sentry-node/README.md) -
  Package-level reference for `@oaknational/sentry-node`: modes, shared
  delegates (hook registry), fixture store, redaction barrier closure
- [Sentry Deployment Runbook](./sentry-deployment-runbook.md) - How to
  enable live Sentry error capture and tracing for Oak runtimes
- [Sentry CLI Usage](./sentry-cli-usage.md) - When to use `sentry-cli`
  (automation) vs the dev `sentry` CLI, `.sentryclirc` composition,
  per-workspace ownership

## Runbook Index

A **runbook** is a repeatable, step-by-step operational procedure (the _how_ to
execute a recurring task correctly each time), often with a verification recipe —
a recognised content kind per
[PDR-120](../../.agent/practice-core/decision-records/PDR-120-runbooks-are-a-content-kind-not-a-surface.md).
It is delivered through an existing surface, never a new one: a **skill** when it is
invocable and frequent enough to earn the skill-load budget; a **reference doc** when
read on demand; or **embedded in the rule/directive it enacts**. This index points to
runbooks wherever they live (it carries pointers, not content).

**Reference runbooks (read on demand):**

- [Elasticsearch Ingest Lifecycle](./elasticsearch-ingest-lifecycle.md) — blue/green
  serverless index update/validation/promote procedure (ADR-130).
- [Production Debugging Runbook](./production-debugging-runbook.md) — incident-response
  diagnostics for the MCP servers.
- [Environment Variables Reference](./environment-variables.md) — the variable
  reference and the procedure for changing a deployment environment safely.
- [Sentry Deployment Runbook](./sentry-deployment-runbook.md) — enable live error
  capture and tracing, with rollback.
- [Milestone Release Runbook](../engineering/milestone-release-runbook.md) — R0–R5
  release-control gates, snagging protocol, go/no-go record.
- [Upstream API Alignment Runbook](../engineering/upstream-api-alignment-runbook.md) — how
  to realign the SDK/MCP surface (and bulk export) when the upstream Oak API changes: diff
  the schema delta, regenerate, confirm registration + type-check, live-verify, surface
  discoverability, land.
- [Release & Publishing Operator Runbook](../engineering/release-and-publishing.md) —
  npm publish procedure for the SDK.
- [MCP Server UAT Validation Runbook](../../apps/oak-curriculum-mcp-streamable-http/docs/manual-uat-guide.md) —
  whole-server black-box validation before a release / after a deploy.
- [MCP Registry Publication](../../apps/oak-curriculum-mcp-streamable-http/docs/mcp-registry-publication.md) —
  compose the `server.json` entry from the deployment, prove it against the served
  metadata and the registry's validator, and publish once the namespace is chosen
  (MCP-637).
- [Search CLI Ingestion Guide](../../apps/oak-search-cli/docs/INGESTION-GUIDE.md) and
  [Ground-Truth Protocol](../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) —
  data-ingest and search-quality run procedures.

**Embedded in the rule/directive/ADR they enact:** the continuity-surface curation
runbook ([`continuity-practice.md`](../../.agent/directives/continuity-practice.md)
§Disposition); SDK-codegen build order ([build-system.md](../engineering/build-system.md));
the quality-gate coverage matrix
([ADR-121](../architecture/architectural-decisions/121-quality-gate-surfaces.md)).

**Delivered as skills (invocable runbooks):** `oak-gates`, `oak-commit`,
`oak-semantic-merge`, the `oak-start-right` family,
`oak-update-dependencies` (the dependency-update sweep: advisory cures,
outdated waves, override floors) — the skill is the runbook's
invocation packaging.

## Relationship to Engineering Docs

Engineering implementation workflows and build/lifecycle guidance live under
[docs/engineering](../engineering/README.md).
