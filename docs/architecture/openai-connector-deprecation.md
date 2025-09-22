# `/openai_connector` Deprecation Plan

The streamable HTTP server now publishes the complete MCP toolset—including the OpenAI-compatible
`search` and `fetch` facades—through the canonical `/mcp` endpoint. The `/openai_connector` route is
kept only as a temporary alias to avoid breaking existing integrations.

## Why the alias is going away

- The SDK now generates a universal MCP translation layer that normalises inputs/outputs for every
  tool. Running a parallel transport adds no value and risks drift.
- `/mcp` is the long-term interface for all MCP consumers (OpenAI, ElevenLabs, Gemini, custom
  agents). Keeping a second endpoint encourages fragmentation.

## Migration timeline

| Phase     | Window                  | Detail                                                                                                                   |
| --------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Awareness | current → 2025-10-15    | Publish this note; update docs and SDK examples to prefer `/mcp`.                                                        |
| Dual-run  | 2025-10-16 → 2025-11-30 | `/openai_connector` remains as an alias backed by the universal executor. Monitor usage and contact remaining consumers. |
| Removal   | 2025-12-01              | Remove the alias and expose `/mcp` only.                                                                                 |

Dates may move if downstream partners need more time, but the goal is to remove the alias before the
2025 year-end change freeze.

## Action items

1. Notify internal teams and external partners of the plan; update onboarding docs and samples.
2. Maintain a weekly automated probe (see `apps/oak-curriculum-mcp-streamable-http/scripts/smoke-dev.ts`)
   that exercises `/mcp` end to end: Accept-header enforcement, `initialize` failure/success paths,
   merged `tools/list` parity with the `/openai_connector` alias, and synonym-aware `tools/call`
   validation. This keeps the canonical surface healthy while the alias still exists.
3. Shortly before removal, emit a warning notification when `/openai_connector` is accessed to
   remind integrators to migrate.

## Related documents

- [ADR-046](./architectural-decisions/046-openai-connector-facades-in-streamable-http.md) – now
  describes the universal tool executor and short-lived alias.
- [Oak MCP Hardening Plan](../../.agent/plans/oak-mcp-compatibility-hardening-plan.md) – tracks
  probe and regression work leading up to the deprecation.

Following this plan keeps `/mcp` as the single, standards-compliant entry point while giving everyone
ample notice to migrate.
