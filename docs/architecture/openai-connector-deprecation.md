# OpenAI Connector Alias Removal

2025-10-23 – The Streamable HTTP server now exposes a single `/mcp` surface. The legacy alias was removed after confirming parity between `/mcp` and the OpenAI-compatible toolset (`search`, `fetch`). This note records the rationale and the completed migration steps.

## Rationale

- The SDK already generates a universal MCP translation layer that normalises inputs/outputs for every tool. Maintaining a parallel transport introduced unnecessary drift.
- `/mcp` is the canonical interface for all MCP consumers (OpenAI, ElevenLabs, Gemini, custom agents). Removing the alias eliminates fragmentation and simplifies documentation, smoke tests, and monitoring.

## Migration Summary

1. Inventoried all code, tests, smoke assertions, and documentation references to the alias.
2. Removed the alias server wiring (`src/index.ts`, `src/auth.ts`, `src/openai/connector.ts`) so only `/mcp` is mounted.
3. Updated Vitest and smoke suites to exercise `/mcp` exclusively, preserving aggregated tool coverage.
4. Refreshed README, architecture notes, and smoke guidance to highlight the single endpoint and outline remote verification steps.

All clients must call `/mcp`. If you previously targeted the alias, update your integration scripts and smoke harness configuration accordingly.

## Related documents

- [ADR-046](./architectural-decisions/046-openai-connector-facades-in-streamable-http.md) – describes the universal tool executor and now notes the completed alias removal.
- [Oak MCP Hardening Plan](../../.agent/plans/oak-mcp-compatibility-hardening-plan.md) – earlier tracking for smoke refactors that preceded the removal.

The Streamable HTTP deployment now presents a single, standards-compliant entry point with the complete tool catalogue.
