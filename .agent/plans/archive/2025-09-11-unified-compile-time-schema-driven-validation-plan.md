<!-- markdownlint-disable -->

# Unified Plan: Steps 1–3 (Transport parity and error UX)

Date: 2025-09-11
Owner: Engineering (MCP/Oak SDK)

## Scope

This document exists solely to guide implementation of Steps 1–3:

- Step 1: HTTP server shows tool argument fields (schema parity with STDIO)
- Step 2: Improved error messages in both servers
- Step 3: Merge, publish, and validate the live deployment

All other work is tracked in `shared-mcp-core-and-mcp-server-migration-plan.md` and `mcp-oauth-implementation-plan.md`.

## References

- `.agent/reference-docs/mcp-typescript-sdk-readme.md` (Tool schema, Streamable HTTP, stdio)
- GO.md; docs/agent-guidance/testing-strategy.md; typescript-practice.md; development-practice.md

## Next steps (only remaining tasks)

1. HTTP tool arguments: Streamable HTTP app returns full generated schemas

- Change `apps/oak-curriculum-mcp-streamable-http/src/mcp-tools.ts` to emit `tool.inputSchema` (mirror STDIO).
- Extend e2e tests: `tools/list` properties/required present; `tools/call` negative/positive paths.

2. Error messages: concise, multi‑block in both servers

- Keep validation in generated executors; format at server boundary with blocks:
  - 1: `Error: Invalid arguments for <tool>`
  - 2: `Required: <keys>`
  - 3: Tiny valid example JSON
- Add tests asserting ordering and contents.

3. Merge and publish; validate live

- Merge PR → automatic deploy for HTTP app.
- Live validation: schemas in `tools/list`, Inspector renders fields; `tools/call` behaves; errors show summary + follow‑ups.

## Implementation notes

- Do not build schemas at runtime. Pass through generated `tool.inputSchema`.
- Keep servers thin; adjust only listing and formatting.
- Use British spelling; fail‑fast, clear errors.

## Tests (TDD)

- HTTP e2e: `tools/list` properties/required; `tools/call` negative/positive.
- STDIO/HTTP error UX: summary, `Required:`, tiny example blocks.

## Quality gates (run from repo root)

1. pnpm i
2. pnpm type-gen
3. pnpm build
4. pnpm type-check
5. pnpm lint -- --fix
6. pnpm -F @oaknational/oak-curriculum-sdk doc-gen
7. pnpm format
8. pnpm markdownlint
9. pnpm test
10. pnpm test:e2e

## Acceptance criteria

- Streamable HTTP: `tools/list` includes full schemas; Inspector renders fields.
- Both servers: error responses are multi‑block (summary, required, example).
- Live deployment validated post‑merge; smoke checks pass.
