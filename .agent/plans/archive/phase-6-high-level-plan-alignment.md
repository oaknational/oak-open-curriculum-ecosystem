# Phase 6 vs High‑Level Plan Alignment Report (Oak Curriculum API)

Date: 2025-08-09T22:12:39+01:00

Sources reviewed:

- `.agent/plans/phase-6-oak-curriculum-api.md`
- `.agent/plans/high-level-plan.md`
- `GO.md`
- `.agent/directives-and-memory/AGENT.md`

This report follows GO.md and AGENT.md: atomic, measurable, provable actions; periodic GROUNDING; explicit sub‑agent checkpoints; and quality gates.

## Executive Summary

- Partial misalignment between Phase 6 and the high‑level plan, primarily around Phase 5.5 gating, ElasticSearch scope, and sub‑phase numbering.
- Phase 6 uses placeholder endpoints and lacks concrete specs for caching, retries, observability, security conventions, and multi‑server examples.
- Reference SDK is environment‑agnostic and cleanly structured; suitable for MCP wrapping with DI, TDD, and runtime‑agnostic boundaries.
- Recommended: finalize Phase 5.5 stance, reconcile scope/numbering, replace placeholders with generated types/paths from the live schema, and add operational specs (cache/retry/obs/security).

## User Decisions (2025-08-09T22:21:57+01:00)

- __Runtime isolation (Phase 5.5)__: Hard prerequisite; must be completed before Phase 6 work proceeds. No waiver.
- __ElasticSearch__: Critical for future, but OUT of MVP for the Oak MCP server. Defer to a future enhancement.
- __Implication__: Update both plans to mark the 5.5 gate and defer ES; adjust scope and success criteria accordingly.

## Alignment Findings
- Phase 5.5 (Runtime Isolation) gating
  - High‑level plan: "must complete before Phase 6".
  - Phase 6 plan: implies Phase 5 complete with no explicit gate.
  - Status: Misaligned.
  - Recommendation: Add explicit gate or documented risk waiver with mitigation (see Actions A1–A3).

- ElasticSearch sub‑phase in Phase 6
  - High‑level plan: includes ES sub‑phase.
  - Phase 6 plan: ES not covered or ambiguous.
  - Status: Misaligned.
  - Recommendation: Clarify whether ES indexing/search is in/out for Phase 6; update scope and success criteria (Actions E1–E3).

- Sub‑phase numbering and structure
  - Inconsistent numbering across documents.
  - Status: Misaligned.
  - Recommendation: Normalize numbering and cross‑reference to avoid drift (Action N1).

- API endpoints and domain types
  - Phase 6 placeholders; missing verified endpoint list and types.
  - Status: Partial.
  - Recommendation: Generate from live schema, publish enumerated, tested list (Actions S1–S4).

- Caching, retries, rate limits, backoff
  - Not specified.
  - Status: Missing.
  - Recommendation: Add policy and retry matrix with idempotency guidance (Actions R1–R4).

- Observability and security
  - Observability (metrics/tracing/logging) and env conventions not concretized.
  - Status: Missing.
  - Recommendation: Define minimal cross‑runtime observability and env boundary conventions (Actions O1–O4, Sec1–Sec3).

- Multi‑server examples
  - Mentioned but not exemplified.
  - Status: Missing.
  - Recommendation: Provide concrete multi‑server config patterns (Action M1).

## Required Plan Updates (edits to make)
- `.agent/plans/phase-6-oak-curriculum-api.md`
  - A1. Add explicit HARD GATE on Phase 5.5 runtime isolation completion; no waiver.
  - E1. Mark ElasticSearch as DEFERRED (OUT of MVP; critical future enhancement). Ensure success criteria exclude ES and point to a future enhancement plan.
  - N1. Normalize sub‑phase numbering to match the high‑level plan.
  - S1. Replace placeholder endpoints with a generated, version‑pinned list from OpenAPI (`scripts/api-types/typegen.ts`).
  - R1. Add retry/backoff policy (e.g., 429/5xx with jittered exponential backoff; idempotency keys where applicable).
  - R2. Define cache policy (ETag/If-None-Match; TTLs; per‑resource guidance).
  - O1. Add observability spec: minimal counters/timers, structured logs with redaction, optional OTEL hooks via DI.
  - Sec1. Define security/env conventions: never read env in core; boundary reads only; redact secrets in logs; key injection via DI.
  - SC1. Update success criteria to explicitly exclude ElasticSearch and list "Phase 5.5 runtime isolation complete" as a precondition.
  - M1. Provide multi‑server configuration examples (e.g., prod vs staging; regioned hosts).
  - QG. Insert quality gates: format, type‑check, lint, test, build on each sub‑phase.
  - SA. Insert sub‑agent checkpoints (architecture, code, config, test) after key milestones.

- `.agent/plans/high-level-plan.md`
  - A2. Restate Phase 5.5 runtime isolation as a HARD prerequisite for Phase 6; link to the gate in Phase 6 plan.
  - E2. Mark ElasticSearch OUT for MVP (critical future enhancement) with rationale and pointer to future phase.
  - N2. Sync sub‑phase numbering exactly with Phase 6 plan.

## Reference SDK Deep Dive Snapshot
- Client construction
  - `src/client/oak-base-client.ts`: wraps `openapi-fetch`; `createClient<paths>({ baseUrl: apiUrl })`; injects `createAuthMiddleware(apiKey)`; exposes `client` and `pathBasedClient` (proxy with convenience, slight perf cost).
  - `src/client/index.ts`: factories `createOakClient(apiKey)` and `createOakPathBasedClient(apiKey)`.
  - `src/client/middleware/auth.ts`: `Authorization: Bearer <apiKey>` injection.
- Paths and validation
  - `src/paths/{types.ts,validators.ts}`: type guards and validators using generated tuples/guards from `src/types/generated/api-schema/path-parameters.ts`.
- Type generation
  - `scripts/api-types/typegen.ts`: fetches `apiSchemaUrl`, generates `api-schema.*`, `api-paths-types.ts`, `path-parameters.ts` into `src/types/generated/api-schema/`.
- Utilities
  - `src/utils/logging.ts`: Winston logger for Node tooling only; core remains environment‑agnostic.
- Tests
  - `tests/unit`: validators, path parameters, typegen fixture tests using Vitest.

Assessment: SDK is clean, DI‑friendly, and runtime‑agnostic—well‑suited for MCP wrapping.

## Migration Plan to MCP (Atomic TODOs)
All tasks follow TDD (Vitest), no `any`, prefer type guards, pure modules, and DI. Quality gates run continuously. GROUNDING every third task.

1. GROUNDING: read `GO.md` and follow all instructions.
2. Scaffold MCP server package (no env reads in core)
   - Create `servers/oak-curriculum/` with TS strict config, Vitest, ESLint, tsup/tsx as per repo conventions.
   - SA: config-auditor sub‑agent review.
3. Import/reference SDK
   - Add workspace dependency or internal module import of `reference/oak-curriculum-api-client`.
   - Provide DI factory for `OakApiClient` and `OakApiPathBasedClient` via boundary.
   - Tests: instantiate with fake `baseUrl` and dummy key; assert auth header via fetch mock.
4. GROUNDING: read `GO.md` and follow all instructions.
5. Enumerate supported endpoints
   - Run typegen (scripts already present) to refresh `paths` types.
   - Generate manifest of allowed operations from `paths` (read‑only subset first).
   - Tests: fail if manifest contains unknown/missing paths.
6. Define MCP tool surface (initial)
   - Map manifest to MCP tools/resources. Avoid inventing domain ops; derive from `paths`.
   - SA: architecture-reviewer sub‑agent review.
7. Error, retry, and rate‑limit policy
   - Implement wrapper around client: retry matrix (429/5xx), backoff with jitter, idempotency where needed.
   - Tests: simulate 429/500 and ensure bounded retries and propagation.
8. GROUNDING: read `GO.md` and follow all instructions.
9. Caching policy (read‑only GETs)
   - ETag/If-None-Match support; pluggable cache interface (in‑mem default; DI for others).
   - Tests: hit/miss behavior; 304 handling.
10. Observability hooks
    - Minimal counters/timers; structured logs with PII redaction; optional OTEL interfaces via DI.
    - Tests: metrics emitted; logs redact Authorization.
11. Security and configuration boundary
    - Zod schema for boundary config (e.g., API URL, token) in server adapter, not in core.
    - Ensure tokens never logged; redact in errors.
    - SA: code-reviewer sub‑agent review.
12. Multi‑server support examples
    - Provide examples for staging/prod and regioned hosts; DI selects baseUrl.
    - Tests: per‑env configuration selection.
13. Documentation and examples
    - Add examples for both clients (method vs path‑based) and MCP usage.
    - SA: test-auditor sub‑agent review.
14. Quality gates
    - Ensure format, type‑check, lint, test, build run green in CI for this server.

Acceptance criteria:
- Green quality gates on server package.
- Endpoint manifest generated from schema; MCP tools align with manifest.
- Retry/backoff and caching demonstrated by tests.
- No env reads in core; DI for config and observability.
- Security (token redaction) verified by tests.

## Open Questions (need USER decision)
1. Multi‑server requirements: which environments/regions must be supported initially?
2. Rate limits and SLAs: any known constraints to inform retry/backoff defaults?
3. Observability stack preference: basic structured logs only, or OTEL hooks as a must‑have?

## Next Actions
- If approved, I will:
  - Apply plan updates to `phase-6-oak-curriculum-api.md` and `high-level-plan.md` per “Required Plan Updates”.
  - Begin MCP server scaffold (Tasks 1–3) and generate endpoint manifest (Task 5).
  - Schedule sub‑agent reviews after Tasks 2, 6, 11, and 13.

— End of report —
