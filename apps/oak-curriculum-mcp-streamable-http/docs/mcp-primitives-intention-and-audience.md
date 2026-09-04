# MCP primitives: intention and intended audience

This guide is for Oak's internal platform team working across SDKs, MCP servers, and semantic search.

It clarifies the intent of each MCP primitive type in this server and who each primitive is primarily for, aligned with the official MCP model.

## Why this matters

During UAT and incident triage, confusion often comes from treating all surfaces as if they were interchangeable. They are not.

- Tools are for model-driven execution.
- Resources are for host/client-managed context injection.
- Prompts are for user-initiated workflow templates — a primitive this app deliberately does not serve (D11).

When we keep these boundaries explicit, implementation, testing, and support all become simpler.

## Primitive map

| Primitive | Primary intention                                                                                                 | Intended audience                                                        | Invocation control                                                       | Typical Oak examples                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Tools     | Let the model perform actions or fetch data during reasoning.                                                     | Model/runtime orchestrator and developers implementing tool contracts.   | Model-controlled (`tools/call`).                                         | `search`, `fetch`, `get-lessons-summary`, `get-threads`, `download-asset`        |
| Resources | Provide stable, read-only context that the host can inject into the model prompt/context window.                  | Host application developers and prompt/runtime designers.                | Application/host-controlled (`resources/read`, optional auto-injection). | `curriculum://model`, `docs://oak/getting-started.md`, `docs://oak/guidance/*`   |
| Prompts   | NOT SERVED. The app registers zero MCP prompts (decisions register D11) — the primitive is unregistered entirely. | n/a — workflow guidance is served to the assistant as resources instead. | n/a (`prompts/list` answers -32601 Method not found).                    | none (the former workflow bodies now serve as `docs://oak/guidance/*` resources) |

## Intention by primitive (internal operating guidance)

### Tools

Tools are the operational API surface for model autonomy.

- Use when the model needs to choose actions dynamically.
- Keep contracts schema-first and stable.
- Treat tool descriptors as executable interface contracts.
- Validate via tool-level UAT (`tools/list`, `tools/call`) and contract tests.

**Do not use tools** for preloading static context that does not require model-time decision making.

### Resources

Resources are for deterministic context delivery.

- Use when context should be available before the model decides to call tools.
- Keep payloads read-only and predictable.
- Prefer resources for ontologies, static graphs, and reference docs.
- Validate via resource-level UAT (`resources/read`) and host injection tests.

**Do not use resources** to represent actions or workflows.

### Prompts

The app serves no MCP prompts (decisions register D11): user-invoked prompt
templates are a poor user experience for teachers, so the primitive is
unregistered entirely. The workflow substance formerly carried by prompts is
served as agent guidance resources (`docs://oak/guidance/*`), governed —
live-vs-dormant — by the served-surface definition. Three related concepts
are never conflated (owner vocabulary ruling, 2026-07-23): MCP prompts
(user-invoked; none served), skill-like agent guidance via tools/resources
(present, nothing generative), and native agent skills installed into the
assistant platform (not in this release).

## UAT expectations by surface

For internal UAT, classify outcomes by primitive type:

- **Tool UAT pass**: callable with valid args and returns structured result/error envelope.
- **Resource UAT pass**: URI fetch succeeds and payload shape is usable as context.
- **Prompts UAT pass**: `prompts/list` answers JSON-RPC -32601 and the initialize result advertises no prompts capability — the zero-prompts contract holds.

This prevents false negatives such as reading the deliberate prompts absence as a defect.

## Relationship to Oak architecture

- Tool definitions in this ecosystem remain schema-first and OpenAPI-derived where applicable.
- Resource content is app-owned contextual material.
- The prompt primitive is unserved; workflow guidance is app-owned resource content.

See also:

- `apps/oak-curriculum-mcp-streamable-http/README.md`
- `packages/sdks/oak-curriculum-sdk/docs/mcp/README.md`
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification)
