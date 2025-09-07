# Serverless Hosting Plan (Deferred)

Status: Deferred from Part 2; execute after import hygiene and docs polish.

## Goals

- Host apps (e.g., Notion MCP) on serverless platforms (Cloudflare first).
- Keep inter-workspace deps via `@oaknational/*` package imports only.

## Scope

- Cloudflare provider implementation for `@oaknational/mcp-core` contracts.
- Minimal deployment config, env handling, and CI integration.

## Non-Goals

- Changes to core contracts beyond portability requirements.

## Acceptance

- Cloudflare provider passes contract tests identically to Node.
- Example deployment documented with env/setup steps.
- Lint/type-check/test/build all green.
