# Serverless Hosting Plan (Deferred)

Status: Deferred (execute after import hygiene and docs polish). This plan mirrors the structure and clarity of the other plans.

## Goals

- Host apps (e.g., Notion MCP) on serverless platforms (Cloudflare first).
- Keep inter-workspace deps via `@oaknational/*` package imports only.

## Scope

- Minimal deployment config (Wrangler), environment handling (KV/secrets), and CI integration.
- Validation via provider contract tests and an example deployment of one MCP app.

## Progress

- Architecture and import policies established; DI in apps (Notion) complete.
- Provider system documented in `docs/architecture/provider-system.md`.
- This plan is prepared; execution is deferred pending prioritization.

## Non-Goals

- Changes to core contracts beyond portability requirements.

## Acceptance

- Cloudflare provider passes contract tests identically to Node.
- Example deployment documented with env/setup steps.
- Lint/type-check/test/build all green.

## Open Questions

- Provider folder naming: retain `providers/` or adopt `platforms/`/`adapters/`?
- Storage abstraction: KV vs Durable Objects vs R2 for example app?
- Logging: map log levels to console methods vs custom sinks; ensure minimal noise on stdout (MCP protocol constraints).

## Implementation Steps (Cloudflare Workers)

1. Runtime adapter implementation
   - Create `@oaknational/mcp-runtime-adapter-workers` under `packages/runtime-adapters/`.
   - Implement `CoreProviders` for Workers (logger using console, clock via Date.now, storage via KV or in-memory for example).
   - Add provider/adapter contract tests mirroring Node suite.

2. Example app adaptation
   - Choose one MCP app (Notion first) and add Workers-specific wiring using the new provider set.
   - Ensure no Node-only APIs are referenced; rely solely on injected providers.

3. Deployment & config
   - Add `wrangler.toml`, bindings (KV/secrets), and CI job to publish preview.
   - Document environment variables and local dev using `wrangler dev`.

4. Validation
   - Run provider contract tests in CI (Workers runtime where possible).
   - Smoke test the deployed MCP endpoint with a minimal client.

## Risks / Mitigations

- Web API gaps vs Node: keep provider boundaries thin; fall back to polyfills only if standards-compliant.
- Resource limits on Workers: use streaming/log throttling where applicable.
- Secret handling: rely on Workers Secrets; avoid embedding secrets in code or logs.

## Next Steps (time‑boxed)

1. Skeleton provider + contract tests (2–4h)
2. Wire Notion app with Workers provider (2–4h)
3. Add Wrangler config, bindings, and deploy preview (1–2h)
4. Document deployment and update architecture docs (1–2h)
