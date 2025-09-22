<!-- markdownlint-disable -->

# MCP OAuth 2.1 Implementation Plan (AS + RS)

PAUSED: Requires updating with [research on Clerk](../../research/clerk-unified-auth-mcp-nextjs.md)

Date: 2025-09-12
Owner: Engineering (Security/Platform)

## Purpose

Implement production‑ready OAuth 2.1 for the Streamable HTTP MCP server with audience‑bound RFC 9068 access tokens, Device Authorization for headless clients, and CI post‑deploy smoke checks.

## Core References

- `.agent/directives-and-memory/AGENT.md` (Development Practice, Testing Strategy)
- `.agent/reference-docs/mcp-typescript-sdk-readme.md` (Auth router/proxy provider, streamable HTTP notes)
- `apps/oak-curriculum-mcp-streamable-http/src` (current server)

## Goals

- Authorization Server (AS) endpoints (co‑hosted):
  - `/.well-known/openid-configuration`, `/.well-known/jwks.json`
  - `/oauth/authorize` (Authorization Code + PKCE)
  - `/oauth/callback` (mint short‑lived RFC 9068 access tokens)
  - Optional: `/oauth/token` (formal code exchange) as needed
- Resource Server (RS):
  - Validate audience‑bound access tokens (no Google ID tokens)
  - Verify `iss/aud/exp/iat` and signature via JWKS
  - Continue returning 401 with `WWW-Authenticate` referencing `/.well-known/oauth-protected-resource`
- Device Authorization Grant for headless MCP clients
- CI post‑deploy smoke checks for health and OAuth metadata
- Remove temporary static token flows from production; keep strictly for local/CI where explicitly gated

## Non‑Goals

- Changing MCP transport; SSE remains deprecated
- Altering SDK compile‑time generation flows

## Approach

### Phase 1: AS endpoints and token model

- Implement endpoints; mint short‑lived JWT (≈10 min) with `iss = BASE_URL`, `aud = MCP_CANONICAL_URI`, include `scope`, `org`, identity claims
- Domain allow‑list at login; embed `org`/scopes in token
- JWKS generation and exposure

### Phase 2: RS enforcement and metadata

- RS validates tokens and returns 401 with discovery hints
- Add `/.well-known/oauth-protected-resource` with metadata

### Phase 3: Device Authorization Grant

- Implement device flow endpoints and UI prompts/logs

### Phase 4: CI post‑deploy checks and production hardening

- Pipeline probes `GET /` and `GET /.well-known/oauth-protected-resource` and expects 200 with JSON
- Optional probe of unauthorised `POST /mcp` expecting 401 with `WWW-Authenticate`
- Ensure dev/CI tokens are not accepted on Vercel (preview/prod) except when `CI === 'true'` for probes

## Tests (no external calls)

- Unit/integration: local JWKS and minted tokens; positive/negative verification
- Device flow unit tests for interaction surfaces
- CI smoke tests as part of pipeline

## Acceptance Criteria

- AS endpoints live; tokens minted with correct claims; RS validates and rejects invalid tokens
- Device flow works for headless clients
- CI smoke checks green post‑deploy; unauthorised path returns 401 with discovery hints
- Dev/static tokens blocked in preview/prod; behaviour documented

## Rollout

- Feature branch and PRs with green gates
- Documentation: user flows, envs, curl examples; note deprecation of static tokens in production
