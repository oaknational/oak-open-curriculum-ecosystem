# High-Level Plan

Scope: strategic overview. Details are in the individual plan documents.

_Note:_ Most semantic search plans (API/UI/docs) need refreshing to align with `.agent/plans/semantic-search-target-alignment-plan.md`. Items below call out the specific updates required.

1. Architectural Refinements Plan — Status: Done
   - Plan: Completed — see PR #16
   - Acceptance: DI-only wiring; docs updated; gates green

2. Remote Hosting Support Plan (Streaming HTTP) — Status: DONE
   - Plan: `.agent/plans/archive/remote-mcp-enablement-plan.md`
   - Scope: enable Streaming HTTP (not SSE) for MCP servers; guidance for Vercel/Node hosting
   - Acceptance: streaming framing defined and implemented; example Vercel deploy existent and documented and available for demos

3. Plan MCP Hardening — Status: In Progress
   - Plan: `.agent/plans/semantic-search-target-alignment-plan.md` (supersedes earlier protoplan)
   - Next Steps: delegate `/mcp` GET/POST to `StreamableHTTPServerTransport`, move health checks, add transport/tool regression tests, verify compatibility with OpenAI Connector, Gemini, ElevenLabs
   - Acceptance: MCP server fully aligned with official spec, transport verified against target clients, regression suite in place

4. Semantic Search Back-End Alignment — Status: Ready (requires plan refresh)
   - Plans:
     - `.agent/plans/semantic-search-target-alignment-plan.md` — canonical target architecture & compliance tasks
     - `.agent/plans/semantic-search-api-plan.md` — **stale**, update to reflect the definitive guide and align with the target plan
     - Legacy docs (e.g. `semantic-search-service-plan.md`, `semantic-search-documentation-plan.md`) need review/retirement once the updated plan lands
   - Acceptance: Back-end implementation matches the definitive guide (indices, RRF queries, APIs); indexes populated; services deployed and reachable; end-to-end tests pass; documentation updated and onboarding flows updated.

5. Separate the Curriculum SDK type generation from the Curriculum SDK runtime.

6. Curriculum MCP Auth Plan — Status: Deferred
   - Plan: `.agent/plans/curriculum-mcp-enhancements-plan.md` - needs updating
   - Acceptance: Use Clerk, doc in research.

7. Semantic Search Front-End & UI Plan — Status: Planned (requires update)
   - Plan: `.agent/plans/semantic-search-ui-plan.md` — **stale**, revise to align with the target back-end plan and definitive guide
   - Acceptance: search UI exists, aligns with new API surface, and passes accessibility/usability checks; documentation updated and onboarding flows updated.

8. Serverless Hosting Plan (Cloudflare Workers) — Status: Deferred
   - Plan: `.agent/plans/serverless-hosting-plan.md`
   - Acceptance: Workers provider parity via contract tests; Wrangler deploy + docs

9. Integrate Semantic Search into Oak Curriculum MCP — Status: Planned
   - Scope: integrate generated search tools; compose advanced tools with data tools
   - Notes: depends on refreshed back-end/UI plans aligning with `semantic-search-target-alignment-plan.md`
   - Acceptance: tools exposed via MCP; end-to-end tests (no network) pass; documentation updated and onboarding flows updated.

10. Enhance Oak Curriculum MCP Tools/Resources/Prompts Usage — Status: Planned

- At the moment we just provide tools, but there are other categories of MCP primitives that we could benefit from, see <https://modelcontextprotocol.io/docs/learn/server-concepts> for more details. This may require reclassifying some tools as resources. The prompts may be useful in the semantic search use case, so this work may need to be moved up.
- Acceptance: tools/resources/prompts exposed via MCP; end-to-end tests pass

## Milestones

- M1: Typed MCP tools available from SDK — ✅ DONE
- M2: Broad MCP platform compatibility — 🔜 In progress via MCP Hardening plan
- M3: Curriculum MCP integrates semantic search tools — Pending backend/frontend alignment updates
- M4: Remote Streaming HTTP live (e.g., Vercel) — ✅ DONE
- M5: Cloudflare Workers provider parity and preview deploy — ⏸ Deferred
