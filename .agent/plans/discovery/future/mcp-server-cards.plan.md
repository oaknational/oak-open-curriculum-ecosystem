---
name: "MCP Server Cards — discovery tracking and implementation brief"
collection: discovery
lane: future
status: strategic-tracking
last_updated: 2026-05-31
---

# MCP Server Cards discovery and implementation plan

> **Strategic brief (`future/`).** This is a spec-tracking brief, not executable
> work. It carries accurate implementation detail (paths, headers, example JSON)
> from completed research as *reference context*. All execution decisions are
> finalised only when this brief is promoted to `current/` against a confirmed,
> stable specification. See the [plan architecture](../../README.md) and
> [ADR-117](../../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md).

## Purpose

Track the emerging MCP Server Cards specification and prepare Oak to publish a discoverable server card for any public HTTP-based MCP server we operate once the specification is released.

The goal is to keep implementation low-risk until the spec stabilises: document the current best estimate, monitor official sources, and define clear triggers for revisiting this plan or implementing it.

## Problem, end goal, mechanism, and means

- **Problem.** When Oak operates a public remote MCP server, external clients,
  IDEs, registries, and crawlers have no standard, pre-connection way to discover
  that the server exists, where to connect, and which protocol versions it
  supports. The only current path is an authenticated `initialize` handshake,
  which web-native discovery tooling cannot perform.
- **End goal.** Any public remote Oak MCP server is discoverable by standards-
  compliant external clients without prior connection, via a correct,
  non-sensitive, spec-conformant Server Card.
- **Mechanism.** The MCP Server Cards spec (SEP-2127) standardises a static
  JSON document at a `.well-known` URI carrying identity, connection, and
  protocol-version metadata. Publishing that document makes Oak's server
  discoverable through the same pre-connection mechanism every conformant client
  will use, while runtime capability discovery stays with `initialize`.
- **Means.** Track the draft to stability (Phase 0), prepare an internal draft
  card from public metadata only (Phase 1), publish the static endpoint at the
  canonical path (Phase 2), validate against the official schema in CI (Phase 3),
  and document the surface (Phase 4). Each phase is gated by the triggers below.

## Non-goals

- Building production behaviour against the current *draft* — paths, schema, and
  required fields are not final and MUST NOT be hard-coded until accepted.
- Publishing Server Cards for local/stdio MCP servers. The spec scopes these to
  `server.json` + the MCP Registry, not `.well-known` cards.
- Publishing any runtime, per-user, tenant-specific, or authenticated state, or a
  static list of MCP primitives (tools/resources/prompts) — explicitly removed
  from the draft's scope.
- Replacing or duplicating the `initialize` handshake or the MCP Registry
  `server.json` surface.
- Treating the card as an authorisation, safety, or capability source of truth.

## Strategic acceptance criteria and success signals

This brief is **successful as a tracking artefact** when:

- The monitored triggers below are current and the status section reflects the
  live SEP state on each review.
- At promotion time, a public Oak remote MCP server can be discovered by a
  conformant external client purely from the published `.well-known` card, with
  zero sensitive fields and a schema-valid document (verified in CI).

These are outcome signals, not activity logs; the implementation checklist near
the end of this brief is the execution-time proof contract drafted at promotion.

## Current status as of 2026-05-31

MCP Server Cards are still in draft. The active work is happening through the official Model Context Protocol standards process and Server Card Working Group.

Current understanding:

- Server Cards are intended to expose structured MCP server metadata from a predictable `.well-known` URL.
- They are for discovery and pre-connection metadata, not for replacing the MCP `initialize` handshake.
- The likely target is HTTP / remote MCP servers rather than local stdio-only servers.
- The shape is being aligned with the MCP Registry `server.json` format, with Server Cards acting as the remote-server discovery subset.
- The draft has deliberately narrowed in scope: current direction is to avoid static publication of tools, resources, prompts, user-specific capabilities, auth state, or runtime state.
- The endpoint path and exact schema are not final, so we should avoid building production behaviour that assumes the current draft is stable.

## Official sources to monitor

Primary official sources:

- Server Card Working Group Charter: <https://modelcontextprotocol.io/community/server-card/charter>
- MCP Roadmap: <https://modelcontextprotocol.io/development/roadmap>
- MCP Specification and documentation repository: <https://github.com/modelcontextprotocol/modelcontextprotocol>
- SEP / PR 2127, MCP Server Cards: <https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127>
- Current SEP-2127 draft branch file: <https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/sep/mcp-server-cards/seps/2127-mcp-server-cards.md>
- MCP events calendar and Server Card WG meetings: <https://meet.modelcontextprotocol.io/>

Related official / historical sources:

- Earlier Server Card proposal, SEP-1649 issue: <https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649>
- MCP 2026 roadmap blog post: <https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/>
- MCP static schema host, used by draft examples: <https://static.modelcontextprotocol.io/>

## Research summary

### What MCP Server Cards are for

MCP Server Cards are proposed as a web-native discovery mechanism for MCP servers. A client, IDE, crawler, registry, browser extension, or agent runtime should be able to check a known URL on a domain and learn enough to decide whether and how to connect to an MCP server.

The current draft positions Server Cards as complementary to MCP initialisation. The card should answer questions such as:

- Does this domain expose one or more MCP servers?
- What is the human-readable title and description?
- What remote transport endpoint should a client connect to?
- Which protocol versions does the remote endpoint support?
- Where is the website or repository for the server?

The card should not be treated as an authoritative runtime capability manifest.

### Current endpoint estimate

The current SEP-2127 draft uses:

```text
/.well-known/mcp-server-card
```

For domains serving multiple MCP servers, the draft describes a suffixed form:

```text
/.well-known/mcp-server-card/{server-name}
```

Earlier discussion included other candidate paths, such as `.well-known/mcp/server-card.json` or `.well-known/mcp.json`. Because the path has changed during discussion, avoid hard-coding only one path until the spec is final.

### Current card shape estimate

The current best estimate is that a card will be JSON, served over HTTPS with `application/json`, and contain a subset of registry-style server metadata plus one or more remote connection entries.

Likely fields:

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  "name": "org.thenational.academy/example-mcp-server",
  "version": "0.1.0",
  "description": "Short description of the MCP server.",
  "title": "Example MCP Server",
  "websiteUrl": "https://www.thenational.academy/",
  "repository": {
    "url": "https://github.com/oaknational/oak-open-curriculum-ecosystem",
    "source": "github"
  },
  "icons": [
    {
      "src": "https://www.thenational.academy/icon.png",
      "sizes": "48x48",
      "type": "image/png"
    }
  ],
  "remotes": [
    {
      "type": "streamable-http",
      "url": "https://example.thenational.academy/mcp",
      "supportedProtocolVersions": ["2025-03-12", "2025-06-15"]
    }
  ],
  "_meta": {}
}
```

Fields most likely to matter for an Oak implementation:

- `$schema`: schema URL once published and stable.
- `name`: stable package-style identifier for the server.
- `title`: human-readable name for display in clients and registries.
- `description`: concise, public, non-sensitive summary.
- `version`: card/server metadata version, not necessarily the MCP protocol version.
- `websiteUrl`: public documentation or product page.
- `repository`: public repository if the server implementation is open source.
- `icons`: public icons suitable for clients or catalogues. The draft requires clients to support `image/png` and `image/jpeg` (and SHOULD support `image/svg+xml` and `image/webp`), so prefer a PNG/JPEG icon over `.ico`/`image/x-icon`.
- `remotes`: connection definitions.
- `remotes[].type`: likely `streamable-http` for modern remote MCP.
- `remotes[].url`: HTTPS URL clients should connect to.
- `remotes[].supportedProtocolVersions`: MCP protocol versions supported by the remote endpoint.
- `_meta`: extension point for non-standard metadata.

Fields currently not expected to belong in the static card:

- Tool lists.
- Resource lists.
- Prompt lists.
- Per-user capabilities.
- Authenticated-user state.
- Feature-flagged or tenant-specific behaviour.
- Secrets, credentials, internal service URLs, private infrastructure details, or proprietary implementation details.
- Claims that clients should use for authorisation or safety decisions.

### Security and privacy posture

Treat the Server Card as public internet metadata. It may be crawled, cached, indexed, displayed by third-party clients, and consumed without authentication.

Before publishing a card, check:

- No secrets or private URLs are included.
- No user-specific or tenant-specific data is included.
- The card does not expose unpublished product plans or internal infrastructure details.
- The description is safe to publish and matches external documentation.
- The remote URL is intentionally public.
- CORS and cache headers are intentional.
- The card does not create a misleading promise about tools or capabilities that may change after authentication.

## Proposed Oak implementation approach

### Phase 0: Track the spec

Do not implement production behaviour yet. Keep this plan updated as the official SEP evolves.

Actions:

- Watch PR 2127 for changes to endpoint path, schema, field names, and release status.
- Monitor Server Card WG notes and MCP roadmap updates.
- Check whether a stable `server-card.schema.json` appears on `static.modelcontextprotocol.io` or in the official repo.
- Check whether the MCP docs add a canonical Server Cards page.
- Check whether the MCP Registry documentation changes `server.json` in a way that affects Server Cards.

### Phase 1: Prepare a draft card internally

Once the draft is close to final or accepted, create an internal draft JSON file for each Oak MCP server we expect to expose remotely.

Suggested location:

```text
.agent/plans/discovery/examples/mcp-server-card.example.json
```

or, if tied to a deployed app:

```text
apps/<app-name>/public/.well-known/mcp-server-card
```

The draft should include only public, stable, non-sensitive information.

### Phase 2: Add a static endpoint

When the spec is released or accepted for implementation, publish the JSON from the exact canonical `.well-known` path specified by the final spec.

Implementation requirements:

- Serve over HTTPS.
- Return `Content-Type: application/json`.
- Add CORS headers if the final spec recommends browser-based discovery.
- Add conservative cache headers, for example `Cache-Control: public, max-age=3600`, unless the final spec says otherwise.
- Ensure the endpoint is available without authentication if the final spec expects public discovery.
- Add integration tests for status code, content type, schema validity, and absence of disallowed fields.

### Phase 3: Validate against official schema

When an official JSON Schema is published:

- Add schema validation in CI.
- Fail CI if the card is invalid.
- Pin the schema version used for validation.
- Add a scheduled dependency/spec review task to check for schema changes.

Potential test cases:

- `GET /.well-known/mcp-server-card` returns `200`.
- Response parses as JSON.
- Response validates against the official schema.
- `remotes` contains at least one HTTPS URL.
- No local, private, or internal-only hostnames are present.
- No tool/resource/prompt arrays are present unless the final spec explicitly requires them.
- Cache and CORS headers match final spec guidance.

### Phase 4: Documentation and rollout

After publishing:

- Add a short note to the relevant README or deployment docs explaining the card.
- Document the source of truth for the card data.
- Include a link to the official MCP Server Cards docs.
- Include a warning that runtime capability discovery still happens through MCP initialisation and subsequent list requests.
- Add the card endpoint to any external developer docs if relevant.

## Triggers to update this plan

Update this plan when any of the following happens:

- PR 2127 changes status from draft to ready for review, accepted, merged, or closed.
- The Server Card Working Group publishes meeting notes that change endpoint path, schema shape, security guidance, or relationship to AI Cards / MCP Registry.
- The MCP Roadmap changes the stated scope or ownership of Server Cards.
- A stable official Server Cards documentation page appears on `modelcontextprotocol.io`.
- A stable JSON Schema for Server Cards is published under `static.modelcontextprotocol.io` or committed to the official repo.
- The draft endpoint path changes again.
- The draft adds or removes required fields.
- The draft changes whether cards may include capabilities, auth metadata, tools, resources, or prompts.
- The draft changes guidance on CORS, caching, content type, or HTTPS requirements.
- The MCP Registry `server.json` shape changes in a way that affects Server Cards.
- Oak decides to expose a public remote MCP server.
- Oak changes MCP server deployment URLs, supported protocol versions, repository visibility, or public documentation.

## Promotion trigger (→ `current/`) and dependency classification

Promote this brief to `current/` and write executable tasks when **all
`blocking` prerequisites are met**. Each prerequisite is classified below.

Blocking prerequisites (must all be true before any implementation):

- **`blocking`** — MCP Server Cards have an accepted or merged SEP, or the MCP maintainers explicitly mark the draft as implementation-ready.
- **`blocking`** — The canonical endpoint path is confirmed.
- **`blocking`** — The JSON shape and required fields are confirmed.
- **`blocking`** — Oak operates at least one public remote MCP server where discovery is useful.
- **`blocking`** — The server metadata can be published without leaking private or internal information.

Beneficial prerequisites (improve the result but do not block; state the minimum shippable shape without each):

- **`beneficial`** — An official JSON Schema is hosted. *Without it:* validate locally against the SEP's normative field list and pin the draft `$schema` URL, flipping to the hosted schema when it lands (the draft `$schema` URL currently 404s pending merge).
- **`beneficial`** — Product / engineering sign-off that the server should be externally discoverable. *Without explicit sign-off:* keep the card prepared but unpublished (the recommended default below).

## Implementation checklist once released

- [ ] Re-read official docs and PR/SEP final text.
- [ ] Update this plan with final endpoint, schema URL, and required fields.
- [ ] Create the Server Card JSON using only public metadata.
- [ ] Publish the card at the canonical `.well-known` route.
- [ ] Add content type, CORS, cache, and HTTPS checks.
- [ ] Add schema validation in CI.
- [ ] Add tests preventing secrets, private URLs, or runtime-only fields from being published.
- [ ] Document the card endpoint in the relevant README or service docs.
- [ ] Add a follow-up review task for future MCP spec releases.

## Open questions

- What exact endpoint path will the final spec require?
- Will the final spec allow or require multiple cards per host?
- Will the final spec use the current `remotes` shape unchanged?
- Will `supportedProtocolVersions` remain per-remote?
- Will the final schema live at the draft `static.modelcontextprotocol.io` URL or somewhere else?
- Will AI Cards define a broader discovery document that should link to MCP Server Cards?
- Should Oak publish Server Cards only for public production MCP servers, or also for preview/test environments?
- Should this repository contain only example cards, or should deployed app code own the published JSON?

## Recommended default until the spec is final

Prepare but do not publish. Keep the expected card minimal and public:

```text
identity + display metadata + HTTPS remote endpoint + supported protocol versions + optional links/icons
```

Avoid publishing anything that looks like runtime state, user-specific metadata, internal infrastructure, authentication policy, or a static list of MCP primitives unless the final specification explicitly requires it.
