## MCP tools deep‑dive

Most MCP tools in this repository are thin, schema‑driven facades over the Oak Open Curriculum API. Each tool maps directly to an API endpoint and uses the same OpenAPI‑derived request/response types as the SDK.

- Conceptually: tools provide an MCP‑friendly interface; the SDK remains the canonical TypeScript API.
- Types and validators: flow from the same generated sources used by the SDK.
- Navigation: start in the SDK docs for curated types and functions, then link back here if you want to explore the tool shapes and executor patterns.
- Primitive boundaries (tools vs resources vs prompts): see `apps/oak-curriculum-mcp-streamable-http/docs/mcp-primitives-intention-and-audience.md`.

### Start here

- SDK overview and curated types: see `docs/api/index.html` and `docs/api-md/*.md` in this package.
- OpenAPI paths/types: `docs/api` → modules derived from `api-paths-types` and `path-parameters`.

### Tool mapping

Each tool name corresponds to an OpenAPI operation id. For example:

- Tool `get-lessons-summary` → operationId `getLessons-getLesson` → endpoint `/lessons/{lesson}/summary`.

From the SDK docs, you can locate the endpoint’s types and then relate them to a tool via the authored mapping above.

### Response handling

- Response descriptors are generated for **every documented status code**. At sdk-codegen time we emit a frozen map keyed by operation id → status → `{ zod, json }` descriptor.
- The generated executor imports that map, determines the actual HTTP status returned by `openapi-fetch`, and then:
  - selects the matching descriptor (`2xx` maps to `.data`, everything else uses `.error`),
  - fails fast if the status wasn’t documented, pointing to the operation id and the known statuses,
  - validates the payload against each documented schema and returns the discriminant `{ status, data }` when a match succeeds.
- Authored runtime code does **not** guess or branch on status codes; it simply forwards to the generated executor and surfaces the resulting success or failure envelope.

### Why separate?

Keeping MCP internals out of the main API docs preserves a clear, stable public surface. This deep‑dive exists for curious readers who want to understand the executor pattern, parameter guards, and how tools are generated from the schema.

### Next steps

- If you find gaps in the curated SDK types, improve TSDoc in the SDK first.
- Cross‑link back to the specific SDK types and functions rather than duplicating content here.

## Security and Authentication

MCP tools in this SDK include OAuth 2.1 security metadata to enable ChatGPT compatibility. Security policy is centrally defined and applied at sdk-codegen time.

### Security Policy Configuration

Security policy is defined in:

- `code-generation/mcp-security-policy.ts`

The policy specifies:

- **PUBLIC_TOOLS**: Tools that do not require authentication (e.g., `get-changelog`, `get-rate-limit`)
- **DEFAULT_AUTH_SCHEME**: Required OAuth 2.1 scopes for protected tools
- **SUPPORTED_OAUTH_SCOPES**: Broader optional scopes advertised in RFC 9728 protected resource metadata for dynamic client registration

Current configuration:

- Public tools: `get-changelog`, `get-changelog-latest`, `get-rate-limit`
- Protected tools: All others
- Required tool scopes: `email`
- Advertised supported scopes: `openid`, `profile`, `email`, `offline_access`, `public_metadata`, `private_metadata`

### Making a Tool Public

To make a tool publicly accessible without authentication:

1. Edit `code-generation/mcp-security-policy.ts`
2. Add the tool name to the `PUBLIC_TOOLS` array:

```typescript
export const PUBLIC_TOOLS = [
  'get-changelog',
  'get-changelog-latest',
  'get-rate-limit',
  'your-tool-name', // Add here
] as const;
```

3. Run `pnpm sdk-codegen` to regenerate tool descriptors
4. Verify the tool now has `securitySchemes: [{ type: 'noauth' }]`

### Security Metadata in Tool Descriptors

Each generated tool includes a `securitySchemes` field:

**Public tools**:

```typescript
securitySchemes: [{ type: 'noauth' }];
```

**Protected tools**:

```typescript
securitySchemes: [{ type: 'oauth2', scopes: ['email'] }];
```

Runtime uses this metadata to enforce per-tool authorization.

### Protected Resource Metadata

The generator also emits OAuth scopes metadata for RFC 9728 protected resource discovery:

- Generated file: `src/types/generated/api-schema/mcp-tools/generated/data/scopes-supported.ts`
- Exported constant: `SCOPES_SUPPORTED`
- Runtime imports this to advertise supported scopes to authorization servers
