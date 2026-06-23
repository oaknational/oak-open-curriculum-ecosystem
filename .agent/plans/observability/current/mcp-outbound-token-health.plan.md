---
name: "MCP Outbound Token Health Metric"
overview: "Standing measurement of everything the MCP server sends to an invoking agent: wire-level body bytes per JSON-RPC response (transport seam) and a per-field size split per tool result (handler seam), emitted as span attributes and structured log records. Numbers only — never payload content. v1 is baseline observation; thresholds and alerting are a named follow-on decision gated on baselines being visible in Sentry."
todos:
  - id: m1-token-estimate-helpers
    content: "M1: pure token-estimate helpers (estimateTokensFromChars ceil/4 total function; safeJsonChars never-throwing JSON length)."
    status: completed
  - id: m2-response-byte-counter
    content: "M2: attachResponseByteCounter wraps res.write/res.end behaviour-preservingly and counts outbound body bytes; total (absent members → zero counter)."
    status: completed
  - id: m3-transport-seam
    content: "M3: oak.http.request.mcp span gains oak.mcp.response.body_bytes + tokens_est; mcp.method and (tools/call) mcp.tool_name become span attributes; 'MCP response size' structured log per request."
    status: completed
  - id: m4-tool-result-split
    content: "M4: measureCallToolResult per-field split (contentChars/structuredChars/metaChars/totalChars/tokensEst); 'MCP tool result size' log per tool call (auth errors included) in the registration callback."
    status: completed
  - id: m5-e2e-proof
    content: "M5: e2e proof through the real HTTP→SDK→SSE path — both records emitted, schema-parsed, attribution correct; tools/list measured (session-resident description cost); doubles as the write-path canary."
    status: completed
isProject: false
status: current
type: executable
thread: observability
date: 2026-06-11
---

# MCP Outbound Token Health Metric

**Owner direction (2026-06-11)**: token counts of everything we send to the invoking
agent are a key health metric — for all of what we send, not any single tool.
**Doctrine anchor**: ADR-058 addendum (2026-06-10) — tool output data is the strongest
grounding surface and per-call payloads consume the consuming agent's context window by
construction; tool descriptions delivered at `tools/list` reside in that context all
session.

## What landed (v1 — measure + observe)

All in `apps/oak-curriculum-mcp-streamable-http`:

| Seam | Mechanism | Emits |
|---|---|---|
| Transport (`mcp-handler.ts`) | `attachResponseByteCounter` wraps `res.write`/`res.end` before `transport.handleRequest`; attributes set after the awaited call via the span handle | Span attrs `oak.mcp.response.body_bytes`, `oak.mcp.response.tokens_est`, `mcp.method`, `mcp.tool_name` (tools/call) on `oak.http.request.mcp`; log `MCP response size` |
| Handler (`handlers.ts` registration callback) | `measureCallToolResult` over every returned `CallToolResult` (auth errors included) | Log `MCP tool result size` `{toolName, contentChars, structuredChars, metaChars, totalChars, tokensEst}` |

Pure helpers: `src/observability/token-estimate.ts` (chars/4 — matches the
practice-fitness baseline; the swap point if per-model precision is ever needed),
`response-byte-counter.ts`, `tool-result-measurement.ts`, `mcp-request-metadata.ts`.

## Measurement scopes — never conflate or sum across them

- **`oak.mcp.response.body_bytes`** is wire truth: the serialised JSON-RPC response
  INCLUDING SSE framing, for every method (tools/call, tools/list, initialize,
  resources/read, prompts/get, errors).
- **`MCP tool result size` fields** are serialised-JSON characters of the
  `CallToolResult` fields only — the per-field split (content vs structuredContent vs
  `_meta`) the wire level cannot see, and the diagnostic for dual-shape duplication
  cost (each field is model-visible in at least one major client; see
  `.agent/research/mcp-client-tool-result-consumption-2026-05-28.md`).
- The two magnitudes differ by construction. Dashboards must label units; never average
  or sum across the two scopes.

## Invariants

- **Numbers and names only** — no payload content ever enters telemetry or logs.
- **Total functions on the response path** — measurement can never throw or alter a
  response (wrapper forwards arguments and return values untouched, including
  backpressure).
- **No thresholds in v1** — existence/sanity assertions only; budget numbers invented
  before baselines exist would be fiction.

## Known dependency (canary-protected)

Byte counting relies on the MCP SDK streaming response bodies through
`res.write`/`res.end` (verified against `@hono/node-server@2.x` internals — the SDK's
`StreamableHTTPServerTransport` wraps Hono's request listener, which writes every body
byte and awaits the pipe). The e2e
(`e2e-tests/outbound-size-observability.e2e.test.ts`) drives the REAL pipe and asserts
positive byte counts — if a future SDK/Hono upgrade changes the write path, that test
fails rather than the metric silently reading zero. Fallback seam if that ever fires:
wrap `transport.send` and measure per-message serialisation (costlier; loses SSE
framing).

## Caveat recorded

Client aborts mid-stream yield partial-body byte counts — truthful (bytes actually
sent) but baseline reads should use successful requests.

## Named follow-on decision (not designed here)

**"Outbound token budget thresholds and alerting"** — owner decision, triggered when
baselines are visible in Sentry by `mcp.tool_name` and `mcp.method` (p50/p95, preview +
prod) AND after the EEF dual-shape alignment has landed (it materially shifts EEF
sizes; see `../../sdk-and-mcp-enhancements/current/oak-prod-mcp-snagging-2026-06-11.plan.md`
S1). No numeric budgets are ratified by this plan.

## Foundation alignment

- `.agent/directives/testing-strategy.md` — co-landed test+code pairs at unit and e2e
  levels; no conditional tests; numeric edge semantics pinned in unit tests, system
  behaviour proven through the real protocol path.
- `.agent/directives/principles.md` — measurement at the narrowest total seam; no
  payload duplication to measure (wire bytes counted where the bytes already flow).
- ADR-058 (context grounding; the addendum this metric operationalises), ADR-078 (DI:
  all proofs through injected fakes/the real path, no module mocks).

## Lifecycle

Landed in one atomic PR (knip forbids unconsumed exports, so cycles consolidated into
one landing; each cycle was developed red→green in sequence). On merge: confirm
`oak.mcp.response.*` attributes in Sentry against preview, then this plan archives per
ADR-117 with the follow-on decision carried to the snagging/observability tracker.
