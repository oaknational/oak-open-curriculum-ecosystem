# ADR-141: MCP Apps Standard as Only UI Surface

## Status

Accepted

## Date

2026-03-25

## Related

- [ADR-029: No Manual API Data Structures](029-no-manual-api-data.md)
- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](031-generation-time-extraction.md)
- [ADR-046: OpenAI Connector Facades in Streamable HTTP](046-openai-connector-facades-in-streamable-http.md) (superseded by this ADR)
- [ADR-061: Widget CTA System](061-widget-cta-system.md) (superseded; CTA system deleted as part of this migration)
- [ADR-071: Widget URI Cache-Busting Simplification](071-widget-uri-cache-busting-simplification.md) (superseded by this ADR)

## Context

Oak's MCP HTTP server (`apps/oak-curriculum-mcp-streamable-http/`) serves
interactive widget UIs through tool definitions that carry ChatGPT-specific
`openai/*` metadata keys (`openai/outputTemplate`, `openai/toolInvocation/*`,
`openai/widgetAccessible`, `openai/visibility`) and a ChatGPT-only MIME type
(`text/html+skybridge`). Widget JavaScript communicates through the
`window.openai.*` API. This locks the entire UI surface to a single host.

The MCP Apps extension (SEP-1865, stable 2026-01-26) is the official,
host-neutral standard for serving interactive UIs from MCP tools. It is
supported by ChatGPT, Claude, Claude Desktop, VS Code GitHub Copilot, Goose,
Postman, and MCPJam. ChatGPT reads `_meta.ui.resourceUri` natively and
maintains `openai/outputTemplate` only as a compatibility alias.

The `@modelcontextprotocol/ext-apps` SDK (^1.5.0) is the migration target for
Oak's MCP Apps rollout. Resource registration now imports
`@modelcontextprotocol/ext-apps/server`; tool registration and the widget client
bridge complete in later work streams.

**Current framing note (2026-04-29):** this decision also carries the repo's
MCP Apps exploration goal. Oak is testing how one MCP App surface can work in
AI platforms such as Claude Cowork and ChatGPT while remaining a developer tool
surface for teams building with Oak's curriculum primitives.

## Decision

Oak builds one MCP server with MCP Apps widgets. ChatGPT is one host among
many. All OpenAI-specific coupling is deleted, not wrapped.

Specifically:

1. **Tool metadata**: All tool definitions use `_meta.ui.resourceUri` as the
   sole widget pointer. The `openai/*` metadata keys are deleted with no
   replacement:
   - `openai/outputTemplate` → `_meta.ui.resourceUri`
   - `openai/toolInvocation/invoking` and `/invoked` → deleted (no MCP Apps
     equivalent; hosts handle loading states)
   - `openai/widgetAccessible` → deleted (MCP Apps default visibility is
     `["model", "app"]`, meaning all tools are callable by both the model and
     widgets — this matches the current `widgetAccessible: true` semantics)
   - `openai/visibility: 'public'` → deleted (MCP Apps default visibility
     includes `"model"`, matching the current `'public'` semantics)

2. **Resource registration**: The HTTP app uses `registerAppResource` from
   `@modelcontextprotocol/ext-apps/server` with `RESOURCE_MIME_TYPE`
   (`text/html;profile=mcp-app`) instead of `text/html+skybridge`.

3. **Tool registration**: UI-bearing tools migrated to `registerAppTool`
   from `@modelcontextprotocol/ext-apps/server`. Generated tools continue to
   use the registry-driven path via `listUniversalTools(generatedToolRegistry)`.

4. **Widget client**: WS3 replaced the `window.openai.*` bridge with the
   MCP Apps `App` class from `@modelcontextprotocol/ext-apps/react`. The
   widget is a self-contained React MCP App using `useApp()` for host
   communication.

5. **No dual paths**: All OpenAI-specific resource metadata, MIME types,
   ChatGPT emulation wrappers, and `window.openai` widget bridges have been
   deleted. No compatibility layer exists.

## Consequences

### Positive

- One codebase serves ChatGPT, Claude, and any MCP Apps-compliant host.
- Widget resource registration uses the official MCP Apps SDK immediately.
- The custom `chatgpt-emulation-wrapper.ts` is deleted instead of being carried
  forward as a compatibility layer.
- Future hosts (Gemini, Cursor, etc.) gain widget support automatically.

### Negative

- Hard cutover means old ChatGPT-only widget previews stopped working immediately.
  WS3 introduced the MCP Apps client/basic-host development path (`pnpm dev:widget-in-host`).
- Any host that only reads `openai/outputTemplate` and not `_meta.ui.resourceUri`
  will not render widgets. Per the compatibility matrix, no known active host has
  this limitation — ChatGPT reads both.

### Neutral

- `_meta.securitySchemes` is retained alongside `_meta.ui` — it is not an
  OpenAI-specific key.
- The deprecated flat key `_meta["ui/resourceUri"]` is not emitted by Oak's
  codegen. `registerAppTool` auto-populates it at registration time for backward
  compatibility.

## Amendment — widget URI identity

Recorded 2026-07-26 (MCP-187); revised 2026-09-12 (MCP-489). The heading
carries no date, so a citation of it survives the next revision; the
pre-revision text is kept below under "Superseded amendment".

`WIDGET_URI` is the published address `ui://widget/oak-curriculum-app-v1.html`,
the same on every build.

- **One owner.** The address is generated at sdk-codegen time from
  `cross-domain-constants.ts`. Every consumer — the tool
  `_meta.ui.resourceUri` advertisement, the served-surface registration key,
  and the auth public-resource allowlist — derives from that one constant;
  hand-frozen copies are banned by an ESLint `no-restricted-syntax` rule in
  the HTTP app (MCP-187, pull request 571). No source under
  `code-generation/typegen/` reads the environment, enforced by a
  `no-restricted-syntax` rule on that directory. Tests run in one process
  without deployment variables, so none can observe an address that differs
  only on a deployed build; the post-deploy probes in the HTTP app's UAT
  guide (rows 10.4 to 10.6) are the check for a deployed build.
- **A published contract.** When a plugin's MCP endpoint is scanned for
  submission, OpenAI stores the discovered metadata with that version: "The
  published plugin uses this metadata snapshot while tool calls and UI
  resources continue to use your live MCP server." Tool `_meta` fields
  "(including UI resource references and visibility)" and the "UI resource
  URI or linked resource metadata, including content security policy (CSP)
  settings" change only through a new reviewed version; "Until then, users
  continue to use the currently published snapshot" ([OpenAI, MCP server
  review requirements](https://developers.openai.com/plugins/deploy/app-review),
  read 2026-09-12). Developer-mode connectors and other MCP clients also keep
  the tool list they were given until they list tools again. The MCP SDK
  declares the `resources.listChanged` capability for every server that
  registers a resource, but this server runs stateless, with no session over
  which to send that notification, so no client is told the list changed.
  The server therefore answers at this one address on every build, and a
  submission is scanned only from a deployment that already serves this
  address and the widget's final settings.
- **Two `_meta.ui` objects.** The tool's `_meta.ui` carries `resourceUri` and
  `visibility`. The widget resource's `_meta.ui` carries the widget's
  settings: `csp` (`connectDomains`, `resourceDomains`, `frameDomains`,
  `baseUriDomains`), `permissions`, `domain` and `prefersBorder`. The widget
  serves its settings on both its `resources/list` entry and its
  `resources/read` content item, so a host or a submission scan reading
  either surface sees the same values; the composition e2e test pins them.
- **Compatible changes ship behind the same address.** A content update
  served from the same published UI resource URI needs no new version "if the
  URI and published contract remain compatible", and "ChatGPT may continue
  serving cached resource contents for up to one hour" (review requirements).
  A change is compatible when both `_meta.ui` objects stay byte-identical and
  the set of tool-result fields the widget reads does not grow. Every other
  change is incompatible.
- **Incompatible changes take the next version.** OpenAI's guidance is to
  "Treat the resource URI as a cache key. When you make a breaking change to
  the HTML, JavaScript, or CSS, publish a new URI and update every tool that
  references it" ([OpenAI, Add UI to your MCP
  server](https://developers.openai.com/plugins/build/chatgpt-ui), read
  2026-09-14), because "serving incompatible content at or removing content
  from a published UI resource URI can break the current version as soon as
  the server change deploys" (review requirements). The next address is
  `ui://widget/oak-curriculum-app-v2.html`, then `-v3`, and a published plugin
  sees it only through a new reviewed version. The tools advertise only the
  newest address. Every earlier address that a published version can still
  reference keeps answering, each with one generated owner. By default an
  earlier address serves a small document telling the user the panel is out
  of date and to reconnect, not a frozen copy of the widget: the widget is a
  committed constant of about 650 KB, and each frozen copy would ride in every
  bundle for as long as its version can be used. The code holds one served
  address today — one constant, one served-surface row, one allowlist entry —
  so that plural shape is built before the first incompatible change.
- **The address lives as long as its versions.** Once a published version
  references an address, the server keeps answering at it for as long as
  that version can be used. Client tool lists never expire, so retiring an
  address is always a deliberate break for any client still holding it.
- **Retired per-build addresses.** Before this revision every release
  advertised its own address, and a client may still hold one. None is
  served. `RETIRED_WIDGET_URIS` puts two on the public-resource allowlist:
  release 1.181.1's `ui://widget/oak-curriculum-app-899803c6.html`, the last
  per-build address production served, and release 1.178.6's
  `ui://widget/oak-curriculum-app-5ce56c4b.html`, held by a ChatGPT desktop
  connector on 2026-09-10. An unauthenticated read of either reaches
  not-found rather than an authentication challenge. That is the whole of
  what the allowlist entry buys: the client is told the address does not
  exist instead of being told to sign in and retry the same address. Nothing
  in the protocol makes a missing-resource error an instruction to list tools
  again, and this server sends no such instruction, so what a client does
  next is the host's behaviour, not a contract Oak can rely on. A signed-in
  read of any earlier per-build address gets the same not-found error.
  Recovery needs a fresh `tools/list`; reconnecting recovers only when the
  host lists tools as it reconnects.
- **Not found is `-32602`.** The MCP specification says servers SHOULD return
  `-32002` for a missing resource. The MCP SDK throws
  `ErrorCode.InvalidParams`, which serialises as `-32602`, for a resource it
  does not hold. The code is hardcoded upstream and this server does not
  override it, so the deviation from the specification's SHOULD is an
  upstream constraint, and Oak's tests and UAT rows expect `-32602`.
- **Staleness is the accepted cost.** The [MCP Apps
  specification](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)
  (2026-01-26) lets hosts "prefetch and cache UI resource content" and gives
  an app no way to invalidate that cache. Core MCP defines
  `resources/subscribe` and `notifications/resources/updated`, but a
  stateless server has no session to send them on. A host that caches may
  therefore show earlier widget content after a compatible change until its
  cache expires.
- **History.** Before this revision the address carried a per-build suffix —
  a timestamp hash (ADR-071), then from 2026-07-26 a hash of the commit SHA
  (the superseded amendment below) — so every release retired the address the
  previous release advertised, even though the widget bytes did not change
  between 2026-07-30 and this revision. Production showed the failure twice:
  a client holding a `resources/list` across the 1.148.0 deploy read
  "Resource not found" (UAT 2026-08-04, finding F2), and on 2026-09-10 a
  ChatGPT desktop connector holding release 1.178.6's address showed a
  resource-not-found error in place of the `get-curriculum-model` widget
  while production served release 1.181.1 (MCP-489).

Source of truth:
`packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts`;
`BASE_WIDGET_URI` and `RETIRED_WIDGET_URIS` are pinned by designed sentinels in
`cross-domain-constants.unit.test.ts`, whose failure messages name the
decision a change must re-adjudicate.

## Superseded amendment — widget URI identity and cache-busting (2026-07-26, MCP-187)

> Superseded on 2026-09-12 by the MCP-489 amendment above. The pre-amendment
> text below is preserved as historical record of the per-build widget
> address.

The MCP Apps standard permits hosts to prefetch and cache `ui://` resource
content and defines no invalidation, freshness, or versioning mechanism, so
URI identity is the only cache-invalidation lever a server holds. ADR-071's
filename-hash scheme (superseded with the ChatGPT-specific surface) is
replaced under this ADR by a deterministic build-identity suffix, landed via
MCP-187 (pull request 571):

- `WIDGET_URI` is generated at sdk-codegen time as
  `ui://widget/oak-curriculum-app-<suffix>.html`, where `<suffix>` is the
  literal `local` off Vercel, else the first 8 hex characters of sha256 of
  the build identifier — the git commit SHA on commit-identified deploys,
  with the per-deployment ID as the fallback on non-git deploys.
- Same-code redeploys keep the same URI on the commit-SHA path; any code
  change busts host caches via a new URI.
- Every consumer — the tool `_meta.ui.resourceUri` advertisement, the
  served-surface registration key, and the auth public-resource allowlist —
  derives from the one generated constant; hand-frozen copies of the URI are
  banned by an ESLint `no-restricted-syntax` rule in the HTTP app.
- All generator-input environment variables (`SDK_CODEGEN_MODE`, `VERCEL`,
  `VERCEL_GIT_COMMIT_SHA`, `VERCEL_DEPLOYMENT_ID`) participate in the
  `sdk-codegen` turbo cache key, so no two deployments can share a cached
  artefact produced from different inputs.

Source of truth:
`packages/sdks/oak-sdk-codegen/code-generation/typegen/widget-uri-suffix.ts`
(the pure resolver) and `cross-domain-constants.ts` (the `process.env`
composition point).
