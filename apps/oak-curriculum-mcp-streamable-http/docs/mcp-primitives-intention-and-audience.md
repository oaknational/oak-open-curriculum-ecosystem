# MCP primitives: intention and intended audience

This guide is for Oak's internal platform team working across SDKs, MCP servers, and semantic search.

It clarifies the intent of each MCP primitive type in this server and who each primitive is primarily for, aligned with the official MCP model.

## Why this matters

During UAT and incident triage, confusion often comes from treating all surfaces as if they were interchangeable. They are not.

- Tools are for model-driven execution.
- Resources are for host/client-managed context injection.
- Prompts are for user-initiated workflow templates.

When we keep these boundaries explicit, implementation, testing, and support all become simpler.

## Primitive map

| Primitive | Primary intention                                                                                | Intended audience                                                      | Invocation control                                                        | Typical Oak examples                                                            |
| --------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Tools     | Let the model perform actions or fetch data during reasoning.                                    | Model/runtime orchestrator and developers implementing tool contracts. | Model-controlled (`tools/call`).                                          | `search`, `fetch`, `get-lessons-summary`, `get-threads`, `download-asset`       |
| Resources | Provide stable, read-only context that the host can inject into the model prompt/context window. | Host application developers and prompt/runtime designers.              | Application/host-controlled (`resources/read`, optional auto-injection).  | `curriculum://model`, `curriculum://thread-progressions`, `docs://oak/tools.md` |
| Prompts   | Offer reusable user-facing workflow templates that orchestrate model behaviour.                  | End users and product designers defining repeatable workflows.         | User-controlled (`prompts/get` after prompt discovery), not `tools/call`. | `find-lessons`, `lesson-planning`, `explore-curriculum`, `learning-progression` |

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

Prompts are reusable user entry points.

- Use when users need a clear "starting script" for common tasks.
- Keep prompt parameters task-focused and user-legible.
- Treat prompts as product UX artefacts, not data contracts.
- Validate via prompt discovery/retrieval flows (`prompts/list`, `prompts/get`) and end-to-end UX tests.

**Do not expect prompts to be callable via `tools/call`**. If prompt artefacts exist but are not invokable through prompt methods in a client, that is a client capability or integration-path question, not a tool contract defect.

## UAT expectations by surface

For internal UAT, classify outcomes by primitive type:

- **Tool UAT pass**: callable with valid args and returns structured result/error envelope.
- **Resource UAT pass**: URI fetch succeeds and payload shape is usable as context.
- **Prompt UAT pass**: discoverable/retrievable via prompt APIs and usable as a workflow template in a client that supports prompts.

This prevents false negatives such as "prompt not callable as a tool".

## Relationship to Oak architecture

- Tool definitions in this ecosystem remain schema-first and OpenAPI-derived where applicable.
- Resource content is app-owned contextual material.
- Prompt definitions are user-experience orchestration artefacts.

See also:

- `apps/oak-curriculum-mcp-streamable-http/README.md`
- `packages/sdks/oak-curriculum-sdk/docs/mcp/README.md`
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification)
