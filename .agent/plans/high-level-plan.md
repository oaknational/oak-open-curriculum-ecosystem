# High-Level Plan

Scope: strategic overview. Details are in the individual plan documents.

1. Architectural Refinements Plan — Status: Done
   - Plan: Completed — see PR #16
   - Acceptance: DI-only wiring; docs updated; gates green

2. Remote Hosting Support Plan (Streaming HTTP) — Status: Done
   - Plan: `.agent/plans/archive/remote-mcp-enablement-plan.md`
   - Scope: enable Streaming HTTP (not SSE) for MCP servers; guidance for Vercel/Node hosting
   - Acceptance: streaming framing defined and implemented; example Vercel deploy existent and documented and available for demos

3. Curriculum MCP Enhancements Plan — Status: In Progress
   - Plan: `.agent/plans/curriculum-mcp-enhancements-plan.md`
   - Acceptance: OAuth 2.1 (AS+RS) production flows implemented and tested (no external calls); CI post‑deploy smoke checks; SDK‑centred typed argument handling; shared server core adopted; docs updated

4. Semantic Search Application Plan — Status: Planned
   - Scope: lexical+semantic search app; design a Search SDK that also generates search MCP tools

5. SDK Enhancements Plan — Status: In Progress
   - Plan: `.agent/plans/sdk-enhancements-plan.md`
   - Acceptance: additive typed outputs/helpers; deterministic generation; reduced app boilerplate

6. Serverless Hosting Plan (Cloudflare Workers) — Status: Planned (Deferred)
   - Plan: `.agent/plans/serverless-hosting-plan.md`
   - Acceptance: Workers provider parity via contract tests; Wrangler deploy + docs

7. Enhance Oak Curriculum MCP for semantic search — Status: Planned
   - Scope: integrate generated search tools; compose advanced tools with data tools
   - Acceptance: tools exposed via MCP; end-to-end tests (no network) pass

8. Enhance Oak Curriculum MCP Tools/Resources/Prompts Usage
   - At the moment we just provide tools, but there are other categories of MCP primitives that we could benefit from, see <https://modelcontextprotocol.io/docs/learn/server-concepts> for more details. This may require reclassifying some tools as resources. The prompts may be useful in the semantic search use case, so this work may need to be moved up.
   - Acceptance: tools/resources/prompts exposed via MCP; end-to-end tests pass

## Dependencies / Order

- Architectural → SDK Enhancements → Search SDK/tools → MCP integration → Hosting (Remote then Serverless)

## Milestones

- M1: Typed MCP tools available from SDK
- M2: Curriculum MCP integrates search tools
- M3: Remote Streaming HTTP live (e.g., Vercel)
- M4: Cloudflare Workers provider parity and preview deploy

## Success Metrics (indicative)

- Time to add a new tool (schema change → app usage)
- p95 tool execution latency (local vs remote)
- Quality gates stable (format/type-check/lint/test/build/identity)

## Review Cadence

- Weekly checkpoint to update statuses, risks, and cross-links
