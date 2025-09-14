## MCP tools deep‑dive

Most MCP tools in this repository are thin, schema‑driven facades over the Oak Open Curriculum API. Each tool maps directly to an API endpoint and uses the same OpenAPI‑derived request/response types as the SDK.

- Conceptually: tools provide an MCP‑friendly interface; the SDK remains the canonical TypeScript API.
- Types and validators: flow from the same generated sources used by the SDK.
- Navigation: start in the SDK docs for curated types and functions, then link back here if you want to explore the tool shapes and executor patterns.

### Start here

- SDK overview and curated types: see `docs/api/index.html` and `docs/api-md/*.md` in this package.
- OpenAPI paths/types: `docs/api` → modules derived from `api-paths-types` and `path-parameters`.

### Tool mapping

Each tool name corresponds to an OpenAPI operation id. For example:

- Tool `get-lessons-summary` → operationId `getLessons-getLesson` → endpoint `/lessons/{lesson}/summary`.

From the SDK docs, you can locate the endpoint’s types and then relate them to a tool via the authored mapping above.

### Why separate?

Keeping MCP internals out of the main API docs preserves a clear, stable public surface. This deep‑dive exists for curious readers who want to understand the executor pattern, parameter guards, and how tools are generated from the schema.

### Next steps

- If you find gaps in the curated SDK types, improve TSDoc in the SDK first.
- Cross‑link back to the specific SDK types and functions rather than duplicating content here.
