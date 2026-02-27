# Milestone 2: Post-Alpha Enhancements

## Why this milestone matters

The public alpha proved the model works — teachers and developers can
connect AI tools to Oak's curriculum. Now it is time to make the tools
richer and more reliable. M2 extends the MCP servers with new tools,
strengthens the architectural enforcement that keeps quality high as the
codebase grows, and expands what curriculum data is accessible.

## Who it is for

- **Teachers** who want more from their AI tools (deeper curriculum
  browsing, better search, more specific answers)
- **Edtech developers** building richer integrations
- **Oak's engineering team** ensuring the codebase scales well as more
  contributors join
- **AI agents** that need richer tooling to serve teachers effectively

## What value it delivers

- New MCP tools expand what teachers and developers can access through
  AI assistants.
- Architectural enforcement (stricter type checks, boundary discipline)
  keeps the codebase reliable as scope grows.
- The SDK pipeline matures, making it easier to add new data sources
  from the Open Curriculum API.

## Progression gates

All must be true before M2 exit:

- [ ] MCP server extensions delivered (scope TBD based on alpha feedback)
- [ ] Architectural enforcement strengthened (type-flow discipline,
  boundary checks)
- [ ] SDK pipeline handles new entity types from upstream API
- [ ] Quality gates green (`pnpm qg`)
- [ ] No severity-1 snagging items open

## Current status

**Planned.** High-level scope identified in
[sdk-and-mcp-enhancements/](../plans/sdk-and-mcp-enhancements/) and
[agentic-engineering-enhancements/](../plans/agentic-engineering-enhancements/).
Detailed planning will begin after M1 ships.

Dependencies: M1 complete.
