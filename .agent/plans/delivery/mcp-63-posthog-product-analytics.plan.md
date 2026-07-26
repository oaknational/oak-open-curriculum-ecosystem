---
id: mcp-63-posthog-product-analytics
node_type: delivery
name: "Deterministic PostHog product analytics for the MCP app"
overview: "Deliver privacy-bounded, deterministic MCP usage facts through a public MCP transport observer and PostHog's official manual MCP event API."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-26
ratified_where: "Linear MCP-173 — owner-approved design baseline, 2026-07-26"
serves: first-major-release
impact_areas:
  - analytics-and-observability
  - auth-and-access
tickets:
  - MCP-63
depends_on: []
owner_gates: []
last_updated: 2026-07-26
---

# Deterministic PostHog product analytics for the MCP app

## Goal

Oak can observe how the authenticated MCP app is used without
observing what a user asked or what the app returned. These limited
interaction facts are strictly necessary to build, operate, and
maintain a safe service: Oak needs to know which capabilities are used,
in what sequence, with what outcome, and where interaction fails.

Each authenticated, in-scope MCP operation constructs at most one
content-free event and queues it for bounded best-effort delivery.
Repeat use is measured through a narrowly scoped pseudonym. Calls are
ordered for analysis by their server-observed timestamp and PostHog
UUID, with equal-timestamp ordering treated only as a deterministic
tie-break rather than a causal claim. Analytics failure or terminal
non-ingestion never changes the MCP response. The current package token
is not reported as an MCP protocol session.

## Mechanism

The durable identity, session, event, and privacy boundary is
[ADR-218](../../../docs/architecture/architectural-decisions/218-posthog-mcp-analytics-identity-session-and-privacy.md).

The shared observability package exposes a provider-neutral product
analytics capability selected through the existing sink axis. An
adapter around PostHog's official Node client owns delivery,
lifecycle, a public MCP transport observer, and the final outbound
policy. Emission sites depend on the closed Oak contract, never the
vendor. The contract deliberately has no generic `name: string` or
arbitrary-property escape hatch. The concrete adapter lives in
`packages/libs/posthog-node`; it owns all `posthog-node`,
`@posthog/mcp`, and MCP SDK imports.

The adapter decorates the public MCP SDK `Transport` passed to
`server.connect`. It observes the original JSON-RPC request and
response without replacing either and maps only `initialize`,
`tools/list`, and `tools/call` to PostHog's official manual
`PostHogMCP.captureInitialize`, `captureToolsList`, and
`captureToolCall` methods. The application retains its concrete
Streamable HTTP transport for `handleRequest`; analytics never needs
that private or transport-specific operation. The package's automatic
high-level wrapper is rejected because it removes legitimate `context`
and `conversation_id` tool-call arguments before dispatch. Its
low-level wrapper is rejected because it removes legal `nextCursor`
and top-level `_meta` when it reconstructs `tools/list` responses.

The researched package baseline does not observe resource reads. Oak
continues to observe authenticated resource reads by wrapping the
server-owned resource callbacks. A dependency upgrade does not
automatically expand this closed event surface. The app currently
serves no MCP prompts under
[ADR-123](../../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md),
so prompt events are not part of this release.

The Oak boundary remains authoritative. The observer constructs only
closed allowlisted facts, passes no request parameters, response
bodies, errors, or free text to the vendor API, and discards the raw
verified principal after deriving the destination-scoped pseudonym.
The final client policy reconstructs every outgoing event from the
exact allowlist and drops unknown shapes. PostHog's sanitiser is
defence in depth, not the privacy boundary.

The verified authentication principal is projected into a versioned,
destination- and environment-scoped keyed pseudonym. Direct
identifiers and person properties never leave the authentication
boundary. Actor-linked events create only the minimal PostHog Person
record needed by the supported event-deletion API. `$set`, `$set_once`,
`$unset`, person properties, aliases, merges, and groups remain
prohibited. UUIDv7 identifies an event, not a person, authentication
session, protocol session, or conversation.

Each Vercel request still creates a fresh Express/MCP server and
transport. The vendor package's session mechanism is not an accepted
continuity source. The researched baseline mutates the SSE transport
after response headers have been constructed, so the new header never
reaches the client; its JSON mode emits an unsigned base64url JSON
token and accepts client-forged session IDs and client metadata on
replay. Oak removes `$session_id` regardless of dependency version. A
future Oak-owned session mechanism must prove server issuance, actor
binding, client replay, and shipped-client compatibility before
protocol-session statistics are enabled.

PostHog's agent-echo conversation feature stays disabled: a label
whose continuity depends on model memory is not a deterministic
measure. Activity windows, where useful, are derived downstream from
event timing only after a separate measurement rule is approved. This
plan preserves the facts needed for such a view but implements no
activity-window or session derivation.

Sentry remains the engineering error and trace specialist. MCP-63 adds
no cross-provider correlation field: the existing inbound HTTP
correlation value is not an approved PostHog identifier. Any future
call-level bridge requires a separately approved purpose, identifier,
access boundary, and delivery plan. No stable person identifier is
shared between the two providers.

One MCP-dedicated `PostHogMCP` client owns manually constructed and
Oak-authored MCP events. The installed official package may label that
client with its own package name and version, which is accurate
provenance for this bounded event estate. The adapter installs a
closed synchronous transport projection and a universal synchronous
client-level final policy; the latter reconstructs every outbound
event. Vercel's `waitUntil` is injected into the module-scoped client
so the Node SDK performs its bounded debounced flush after the response
without depending on process lifetime. A client is not created or
shut down per request.

## Current execution state

The closed sink selection, keyed actor projection, outbound policy,
delivery primitives, provider-neutral transport-observer port, manual
PostHog MCP adapter, and package-level protocol/final-wire suites are
implemented and under draft review. The superseded high-level wrapper
implementation was rejected by protocol-fidelity review and is not
accepted evidence. Application composition, application-level on/off
wire equivalence, authenticated resource registration, and the
complete affected-estate and built-artefact proof remain incomplete.

## Relationship to adjacent plans

This delivery node serves
[the first-major-release strategic outcome](../strategic/first-major-release.plan.md).
[MCP-173](./mcp-173-posthog-privacy-governance.plan.md) depends on this
node for the controlled live events needed to prove retention and
erasure. Its policy, notice, data-map, and access work can proceed in
parallel, and it retains ownership of the October public-beta gate.

[MCP-67](./mcp-67-clerk-production-promotion.plan.md) is a sibling, not
a dependency: this plan consumes the already-verified Clerk principal,
while MCP-67 promotes the same authentication boundary to production
credentials. [MCP-121](./mcp-121-guidance-serving-architecture.plan.md)
is also a sibling: the analytics contract derives labels from the live
tool and resource registries, so either plan may land first.

The conserved
[sink-decoupling](../../plans-backlog-2026-07/observability/current/observability-sinks-decoupling.plan.md)
and
[multi-sink conformance](../../plans-backlog-2026-07/observability/current/multi-sink-vendor-independence-conformance.plan.md)
plans supply provider-neutral boundary and import-proof lineage. The
[generic event workspace](../../plans-backlog-2026-07/observability/current/observability-events-workspace.plan.md)
and
[historical high-level sequence](../../plans-backlog-2026-07/observability/high-level-observability-plan.md)
remain research context, not live dependencies: MCP-63's closed
product-analytics contract and release priority supersede their
warehouse-before-PostHog sequencing assumption.

## Decision-complete implementation contract

### In-scope operation matrix

This is the complete event surface for MCP-63:

| Observed MCP operation | Stored event | Producer | Actor rule |
| --- | --- | --- | --- |
| successful `initialize` | `$mcp_initialize` | Oak transport observer → `PostHogMCP.captureInitialize` | authenticated only |
| `tools/list` | `$mcp_tools_list` | Oak transport observer → `PostHogMCP.captureToolsList` | authenticated only |
| `tools/call` | `$mcp_tool_call` | Oak transport observer → `PostHogMCP.captureToolCall` | authenticated only |
| `resources/read` | `$mcp_resource_read` | Oak resource-callback wrapper | authenticated only |

The app's zero-prompt surface produces no prompt event. `resources/list`,
`ping`, notifications, unsupported methods, and public unauthenticated
resource reads produce no product event in this release. Merely lacking
`authInfo` never selects an anonymous fallback.

The grain is one accepted event per observed operation, not one generic
HTTP-completion event plus one protocol event. MCP-63 does not introduce
an `mcp_http_request_completed` event because it would double-count the
three package-observed operations.

### Provider-neutral port

`@oaknational/observability` owns this closed input contract:

```ts
import type { Result } from '@oaknational/result';

export type ProductAnalyticsEvent = {
  readonly kind: 'mcp_resource_read';
  readonly resourceName: string;
  readonly startedAt: Date;
  readonly durationMs: number;
  readonly isError: boolean;
};

export type ProductAnalyticsCaptureContext = {
  readonly verifiedActorId: string;
};

export interface ProductAnalyticsSink {
  capture(
    event: ProductAnalyticsEvent,
    context: ProductAnalyticsCaptureContext,
  ): void;
}

export interface McpTransportObserver<TTransport> {
  observe(transport: TTransport): TTransport;
}

export type ProductAnalyticsCloseError = {
  readonly kind: 'product_analytics_close_failed';
};

type ProductAnalyticsRuntimeCapabilities<TTransport> = {
  readonly sink: ProductAnalyticsSink;
  readonly transportObserver: McpTransportObserver<TTransport>;
  close(): Promise<Result<void, ProductAnalyticsCloseError>>;
};

export type ProductAnalyticsRuntime<TTransport> =
  | (ProductAnalyticsRuntimeCapabilities<TTransport> & {
      readonly mode: 'off';
    })
  | (ProductAnalyticsRuntimeCapabilities<TTransport> & {
      readonly mode: 'posthog';
    });
```

There is no generic event name and no arbitrary property record.
`ProductAnalyticsSink` exposes no PostHog kind or PostHog type to an
emission site; provider selection remains a composition-root concern.
`capture` is observational and does not throw into the caller.
The app receives
`McpTransportObserver<Transport>` as a second closed capability. Its
PostHog adapter maps the installed official manual MCP API to the Oak
behaviour contract below, without exposing the vendor client to the
app. The observer returns the transport passed to `server.connect`;
the app retains the original concrete transport for `handleRequest`.

`ProductAnalyticsRuntime.close()` is the exact, non-throwing lifecycle
boundary. `mode: 'off'` supplies an inert sink and a transport observer
that returns the exact input reference, plus an immediate successful
close result; it reads no PostHog configuration and creates no client.
`mode: 'posthog'` maps client shutdown failure to the fixed
content-free error kind above. The process-level composition owner
passes only `sink` and `transportObserver` into request handling.

`verifiedActorId` is separate protected capture context, not an event
property. It is accepted only from the validated
`AuthInfo.extra.userId` installed after Clerk token verification and
is synchronously projected inside the PostHog adapter. The adapter
retains or queues neither the capture-context object, the raw
principal, nor the input event object; it queues only a newly
constructed provider event containing the derived pseudonym and the
allowlisted fact.

The resource wrapper receives the canonical registration name from
the server-owned resource definition, not the requested URI. It starts
the timer immediately before invoking the original callback, records
`isError: false` after an unchanged result, records `isError: true`
before rethrowing the same error, and never reads the resource result.
The adapter validates the name against the live served-surface
resource set. An unknown name drops the event.

The transport observer receives each inbound JSON-RPC message and its
original `MessageExtraInfo`. For an authenticated in-scope request it
derives the actor pseudonym synchronously from `authInfo`, retains only
the closed operation facts and start time in a map keyed by the exact
string or number request identifier, and then forwards the same
message and metadata. Notifications, unsupported methods, and requests
without valid authenticated identity are forwarded without state or
capture.

When the matching outbound response reaches `send`, the observer
removes the pending state before capture, derives only the applicable
allowlisted response facts, invokes the matching official manual
capture method, and calls the delegate with the exact message and
options objects. `send` is not declared `async`: it returns the
delegate's exact promise. For a successful tool list, only canonical
served-tool names are read from `result.tools`; pagination and
top-level metadata remain untouched. For a tool call, only JSON-RPC
error presence or `result.isError === true` determines the bounded
outcome. For successful initialisation, the negotiated protocol
version in the result is preferred over the requested version. No
request parameter, response body, error object, or free-text field is
retained or passed to PostHog.

Observation, projection, and capture failures are contained before
delegation and emit only the fixed content-free operational signal
specified below. Concurrent request lifetimes remain isolated by
request identifier. The observer delegates `start`, `close`, callback
registration, session access, and protocol-version notification
without changing their public behaviour.

### Sink-axis and registry shape

`OBSERVABILITY_SINKS` remains the single app-local selection axis and
gains the `posthog` literal. One closed
`OBSERVABILITY_SINK_DEFINITIONS` grouped constant is the only literal
source:

```ts
export const OBSERVABILITY_SINK_DEFINITIONS = {
  diagnostic: ['sentry', 'file'],
  product_analytics: ['posthog'],
} as const;

export const DIAGNOSTIC_SINK_KINDS =
  OBSERVABILITY_SINK_DEFINITIONS.diagnostic;
export type DiagnosticSinkKind =
  (typeof DIAGNOSTIC_SINK_KINDS)[number];

export const OBSERVABILITY_SINK_KINDS = [
  ...OBSERVABILITY_SINK_DEFINITIONS.diagnostic,
  ...OBSERVABILITY_SINK_DEFINITIONS.product_analytics,
] as const;
export type ObservabilitySinkKind =
  (typeof OBSERVABILITY_SINK_KINDS)[number];
```

The literal spreads preserve exact tuples without `Object.*`, `map`,
`filter`, or assertions. The environment schema consumes the full
selection tuple. `ObservabilitySink<K>` accepts only
`DiagnosticSinkKind`, and `SinkRegistry` maps only that same union, so
`ObservabilitySink<'posthog'>` and `SinkRegistry.posthog` are
unrepresentable.

Product analytics does not pretend to be an engineering-error sink:
`ProductAnalyticsSink` is not widened with `captureException` or
`captureMessage`.

The observability package exposes two typed projections from the same
parsed selection:

- the existing diagnostic `SinkRegistry`, keyed only by diagnostic sink
  kinds such as `sentry` and `file`; and
- one required `ProductAnalyticsRuntime<Transport>` slot: `mode: 'posthog'`
  when the same selection contains `posthog`, otherwise the exact inert
  `mode: 'off'` runtime described above.

This parallel slot keeps one configuration axis without forcing
unrelated capabilities into one homogeneous registry. Selection-axis,
diagnostic-registry, and product-slot tests prove the split.

Production locality remains a diagnostic guarantee, not merely a
non-empty-selection check. `refineProductionLocality` requires at
least one selected member of `DIAGNOSTIC_SINK_KINDS`; `['posthog']`
alone fails with a fixed diagnostic-sink-required issue, while
`['sentry']`, `['file']`, or either alongside `posthog` satisfies the
rule. The refinement and its truth-table tests use the derived
diagnostic tuple, never a second literal list.

### Exact PostHog row contract

Every accepted event has:

- top-level `distinct_id`: the active keyed actor projection below;
- top-level `event`: one of the four literals in the operation matrix;
- a server-observed timestamp;
- one SDK-generated UUIDv7, retained unchanged across every SDK
  delivery attempt; and
- only the common and event-specific properties below.

This plan makes no provider-side deduplication or exactly-once-storage
claim.

Common Oak-controlled properties are:

| Property | Exact source or value |
| --- | --- |
| `$mcp_source` | literal `posthog_mcp_analytics` |
| `$mcp_server_name` | literal `oak-curriculum-http` |
| `$mcp_server_version` | authoritative `runtimeConfig.version` |
| `oak_environment` | `ResolvedRelease.environment` |
| `oak_release` | `ResolvedRelease.value` |

The PostHog application composition resolves one `ResolvedRelease`
at bootstrap with `@oaknational/build-metadata.resolveRelease()`,
after `resolveApplicationVersion()`, only when `posthog` is selected
in `OBSERVABILITY_SINKS` and independently of Sentry mode. When
PostHog is off this adds no release-resolution requirement. Its input
is exactly:

```ts
{
  SENTRY_RELEASE_OVERRIDE: runtimeConfig.env.SENTRY_RELEASE_OVERRIDE,
  VERCEL_ENV: runtimeConfig.env.VERCEL_ENV,
  VERCEL_BRANCH_URL: runtimeConfig.env.VERCEL_BRANCH_URL,
  VERCEL_GIT_COMMIT_REF: runtimeConfig.env.VERCEL_GIT_COMMIT_REF,
  VERCEL_GIT_COMMIT_SHA: runtimeConfig.env.VERCEL_GIT_COMMIT_SHA,
  APP_VERSION: runtimeConfig.version,
}
```

`oak_environment` is therefore exactly
`production | preview | development`. `oak_release` follows the
existing ADR-163 truth table: a validated override; stable production
semver; validated preview branch-host label; development branch-host
label or `dev-<seven-character-SHA-prefix>`; or the literal
`local-dev`. The resolver's existing 1–200-character release-name
validation remains authoritative. A resolver error fails bootstrap
whenever PostHog is selected; `oak_release` is never omitted and no
PostHog-specific fallback is introduced. Sentry's existing
configuration path delegates independently to the same core resolver;
a coexistence test requires equal values when both sinks are selected.
Direct adapter tests may inject `test`, but live bootstrap cannot.
The live PostHog adapter config accepts the resolved value atomically
as `release: ResolvedRelease`; it does not accept independent
environment and release strings that could be mixed. The off config
remains `{ mode: 'off' }` and contains no release fields.
The final policy injects `.environment` and `.value` from that
bootstrap-captured object during reconstruction and drops any incoming
`oak_environment` or `oak_release`. The canonical release bypasses any
generic safe-label parser, and MCP-63 adds no second validator with
different length or character rules.

Event-specific properties are:

| Event | Required properties | Conditional properties |
| --- | --- | --- |
| `$mcp_initialize` | `$mcp_is_error: false`, `oak_client_family`, `$mcp_protocol_version` | none |
| `$mcp_tools_list` | `$mcp_duration_ms`, `$mcp_is_error` | `$mcp_listed_tool_names` on success |
| `$mcp_tool_call` | `$mcp_tool_name`, `$mcp_duration_ms`, `$mcp_is_error` | none |
| `$mcp_resource_read` | `$mcp_resource_name`, `$mcp_duration_ms`, `$mcp_is_error` | none |

`oak_client_family` is the closed union `chatgpt | claude | other`.
The transport observer maps only the current
`initialize.params.clientInfo.name` while processing that request.
After ASCII lower-casing and trimming, values
beginning with `chatgpt` followed by end, space, slash, or hyphen map
to `chatgpt`; the equivalent `claude` prefix maps to `claude`; every
other value maps to `other`. Raw client names, the package's
`$mcp_client_name`, and all client versions are dropped. No package
session token is consulted.

`$mcp_protocol_version` is retained only on `$mcp_initialize`, from
the server's negotiated initialize result, and only when it belongs to
the installed MCP SDK's authoritative negotiated protocol set. Oak
discovers and proves that evolving set through the installed SDK and
real handshakes rather than duplicating a vendor symbol or version
literal. Any token-carried value on a later event is dropped.

Tool names and listed names are intersected with the canonical live
served-tool set. An authenticated call to an unknown tool is recorded
as the literal `unknown`; no requested name is copied. A successful
tool-list event contains the canonical names in lexical order.
Resource names come only from the canonical resource registration
closure. Durations are finite, non-negative safe integers in
milliseconds. Invalid required fields drop the event rather than being
coerced from user input.

The Node SDK adds only these approved transport properties after Oak's
final policy: `$lib: posthog-node-mcp`, `$lib_version` equal to the
installed instrumentation package version, `$is_server: true`, and
`$geoip_disable: true`. Final-wire tests assert the closed shape
without fixing the package-version value.

Every other property is prohibited, including `$session_id`,
`$mcp_conversation_id`, `$mcp_client_name`,
`$mcp_client_version`, `$mcp_parameters`, `$mcp_response`,
`$mcp_intent`, `$mcp_intent_source`, tool descriptions,
error types or messages, exception fields, arbitrary correlation
values, request IDs, headers, IP, GeoIP, `$groups`, `$set`,
`$set_once`, `$unset`, and unknown properties.

For every manual capture call, the observer passes the derived actor
through `distinctId` and supplies only the fixed Oak server, release,
environment, and applicable client-family properties needed by the
final policy. It never supplies `sessionId`, `setProperties`, `groups`,
request parameters, responses, errors, descriptions, intent, or
arbitrary caller properties. The official API contributes only its
canonical event name and the operation-specific name, duration,
outcome, listed-name, or negotiated-protocol fact. The final policy
then independently reconstructs the approved row. Package-generated
session identity cannot reach the Node client because no automatic
wrapper or package session mechanism participates.

### Keyed actor identity and rotation

PostHog actor identity is derived only from
`AuthInfo.extra.userId` after successful token verification. The
principal is opaque, must encode to 1–512 UTF-8 bytes, and is not
trimmed, case-folded, or Unicode-normalised. Missing or invalid
identity drops the event. There is no fallback to an OAuth client ID,
token, Clerk session, MCP session, raw user ID, unkeyed hash, random
person identifier, or another provider's identifier.

Version 1 is exactly:

```text
frame(s) = uint32be(byteLength(utf8(s))) || utf8(s)
message = frame("oak-mcp-analytics")
       || frame("posthog")
       || frame("actor-pseudonym")
       || frame("v1")
       || frame(environment)
       || frame(key_id)
       || frame(clerk_user_id)
digest = HMAC-SHA-256(key_bytes, message)
distinct_id = "oakph:v1:" || key_id || ":" || base64url_no_padding(digest)
```

The full 32-byte digest is retained. `environment` is the canonical
resolved release environment: `production`, `preview`, or
`development`; tests may inject `test`. `key_id` matches
`^[a-z0-9][a-z0-9_-]{0,31}$` and contains no secret or principal
material.

The golden vector is binding:

```text
key = 32 zero bytes
environment = production
key_id = 2026-07
clerk_user_id = user_example
distinct_id = oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU
```

When PostHog is selected, startup requires:

```text
POSTHOG_PSEUDONYM_ACTIVE_KEY_ID=k2026_01
POSTHOG_PSEUDONYM_KEYRING=[{"id":"k2026_01","key":"<43-character canonical base64url key>"}]
```

The key ring is a JSON array so duplicate IDs remain detectable. It is
a non-empty array of strict `{ id, key }` records. Each key is
canonical unpadded base64url, re-encodes byte-for-byte to the supplied
value, and decodes to exactly 32 bytes. IDs and decoded key material
are unique. The active ID resolves exactly one entry. Malformed JSON,
unknown record fields, duplicate IDs or key material, invalid IDs,
non-canonical or non-32-byte keys, and a missing active entry fail
bootstrap without including a value in diagnostics. When PostHog is
off, these variables are not required or parsed.

The raw key-ring string, decoded keys, project key, and PostHog host
are app-local deployment inputs owned and parsed by the
`apps/oak-curriculum-mcp-streamable-http` composition root. The
`packages/libs/posthog-node` adapter receives only a closed typed
configuration and does not read ambient environment variables.
Secrets are consumed at bootstrap into the adapter closure. They are
omitted from the handler-facing `RuntimeConfig.env` and never enter
`handlerOptions`, MCP request context, logs, errors, Sentry, or a
serialisable generic config object. Handler code receives only the
closed sink and transport-observer capabilities.

Only the active projection is emitted. Rotation adds a key-ring entry
and changes the active ID atomically. The pure deletion-derivation
helper returns every retained `(environment, key_id)` projection in
key-ID order without a principal-to-pseudonym ledger. Retired keys
remain available to the approved deletion path until the maximum
retention interval since last use has elapsed, all pending erasures
and exports for that interval are cleared, and provider queries show
no retained row under that version. MCP-173 owns the live deletion
workflow and key-destruction evidence.

An authenticated event omits `$process_person_profile`. Under the
supported PostHog ingestion contract this permits one minimal Person
keyed only by the pseudonym. Oak emits no standalone `$identify`,
person properties, aliases, merges, or group relationships. The
package logger remains unset because vendor implementations may
interpolate the pseudonym into log strings.

### Configuration and required client behaviour

Selecting `posthog` in `OBSERVABILITY_SINKS` requires valid
`POSTHOG_PROJECT_API_KEY`, the exact
`POSTHOG_HOST=https://eu.i.posthog.com`, the active key ID, and the
key ring. Selecting PostHog while authentication is disabled is an
invalid live configuration. Invalid selected configuration stops
bootstrap; it never silently degrades to a weaker identity or
different region.

Oak does not set `POSTHOG_CAPTURE_MODE`; any deployment-supplied value
fails bootstrap so ambient configuration cannot silently change the
reviewed transport. The installed Node SDK's default transport is
accepted only when the network-isolated delivery probes prove the
bounded retry and stable-event-UUID contract. Dependency upgrades rerun
those probes against their resolved default transport.

The adapter maps the installed official Node SDK API to these required
behaviours. Vendor option names are implementation detail, not a
versioned Oak contract:

| Concern | Required behaviour |
| --- | --- |
| Destination | Send only to `https://eu.i.posthog.com` |
| Processing state | Opt in to the selected strictly necessary server-side processing path |
| Location and Persons | Disable GeoIP enrichment; create Persons only for identified pseudonyms |
| Unused products | Disable exception autocapture, feature-flag preloading, surveys, replay, and remote evaluation |
| Batch bounds | Flush at 20 events or 5 seconds; cap a batch at 100 and the queue at 10,000 |
| Network bounds | Use a 10-second request timeout and at most three retries separated by 3 seconds |
| Vercel lifetime | Inject `waitUntil`; debounce for 50 ms; force a flush after at most 500 ms of debounce, without treating that value as a cap on the registered promise |
| Runtime | Operate as a server client |
| Final privacy boundary | Apply `finalOakEventPolicy` to every outbound event |

No secret or personal API key is configured and no feature-flag,
survey, replay, autocapture, or remote-evaluation product is used.
The client error channel is subscribed once and emits only a fixed,
content-free `posthog_client_delivery_failed` Sentry operational code.
Identity-projection and unexpected policy failures emit only
`posthog_identity_projection_failed` and
`posthog_event_policy_failed`, respectively. Routine out-of-scope
drops emit no operational signal. No signal forwards the SDK error
message, event, pseudonym, principal, key ID, or credential.

The adapter maps the public MCP `Transport` contract and installed
official manual MCP API to these required behaviours for every fresh
request:

| Concern | Required behaviour |
| --- | --- |
| Protocol seam | Decorate only the public `Transport`; do not read or replace private server handlers |
| Operation set | Map only `initialize`, `tools/list`, and `tools/call` requests to their official manual capture methods |
| Missing operations | Forward them unchanged and do not report them |
| Content | Never pass parameters, responses, errors, descriptions, intent, free text, headers, or tokens |
| Identity | Derive one pseudonym from the request's verified `authInfo`; do not use a package identify hook |
| Continuity | Keep pending closed facts only by exact JSON-RPC request ID; do not use package sessions or conversations |
| Delegation | Preserve callback order and exact message, metadata, options, result/error identity, and send-promise identity |
| Failure | Emit only `posthog_event_policy_failed` and continue the unchanged protocol path |

The observer calls only `captureInitialize`, `captureToolsList`, or
`captureToolCall`. `sessionId`, `setProperties`, groups, parameters,
responses, errors, descriptions, intent, package preparation helpers,
custom capture, and a package logger are not configured or supplied.
Exception autocapture remains disabled.

The observer projection and final client policy are synchronous, pure
reconstruction functions. The projection handles only the three
transport-observed operations; the client policy independently
revalidates every manual and Oak-authored event. Unknown events and
properties are dropped at the final boundary. The observer stores no
actor, client metadata, or operation state on the shared client, so
overlapping request lifetimes cannot exchange them.

### Composition and lifecycle order

Application bootstrap, once per function isolate:

1. validate the complete selected configuration;
2. construct the dedicated client and its final policy;
3. attach the one bounded client-error observer; and
4. close the product-analytics sink and MCP transport-observer
   capabilities over that client; and
5. discard the raw selected PostHog configuration before constructing
   handler-facing runtime options.

For each MCP HTTP request:

1. create a fresh `McpServer`;
2. call `wrapMcpServerWithSentry(server, { recordInputs: false,
   recordOutputs: false })`;
3. register tools and resources, passing resources through the
   analytics-aware `ResourceRegistrar` facade;
4. construct a fresh Streamable HTTP transport with server-issued
   protocol sessions disabled, mapping that behaviour through the
   installed SDK API;
5. pass that transport through
   `McpTransportObserver<Transport>.observe(transport)` and connect the
   fresh server to the returned public transport;
6. handle the HTTP request through the retained concrete transport;
   and
7. close only the MCP server and concrete transport on response close.

The shared PostHog client is never shut down or flushed per request.
Vercel `waitUntil` owns queued post-response delivery. Local and test
process teardown routes through `startConfiguredHttpServer`'s
process-level close owner. One shared close-once promise attempts both
HTTP observability close and product-runtime close on bootstrap failure,
server listen error, `SIGINT`, `SIGTERM`, and explicit test teardown.
Overlapping terminal paths reuse that promise, so each runtime is
closed at most once and one close failure never prevents the other
attempt. Product-runtime failure returns the fixed error kind, produces
only the approved content-free operational signal, and does not block
the process's existing exit decision.

The currently shipped SSE response path remains authoritative.
Analytics-enabled and disabled responses must have identical status,
headers, and body, including no `MCP-Session-Id`. JSON response mode
must not be enabled while this package integration is active unless
its session-token path has separately proved server issuance, actor
binding, replay integrity, and identical privacy reconstruction.

### Delivery and failure semantics

Each authenticated in-scope operation constructs and enqueues at most
one accepted event. The manual API path emits no standalone
`$identify`; exception siblings are disabled and dropped, and MCP-63
introduces no generic HTTP-completion event.

The event UUID is assigned once before the Node SDK's outbound
transport retries. The resolved transport must reuse the same queued
event UUID across retries. This guarantee covers SDK delivery retries
only. Replaying the MCP/JSON-RPC request is a new observed operation
with a new event UUID.

`waitUntil` is bounded best effort, not a durable outbox or proof of
ingestion. Terminal delivery failure may result in no stored row. A
configuration error stops bootstrap. Identity, policy, observation,
capture, or delivery failure drops only the analytical event, emits at
most the fixed non-recursive signal defined above, and never changes,
delays, or annotates the MCP response. Transport delegation returns the
delegate's exact promise even after capture fails. Oak leaves the
package logger unset; package-contract tests and the required live
acceptance event detect manual API setup failure without making log
content part of the contract.

### Dependency currency and compatibility gate

The 2026-07-26 research and contract baseline used
`@posthog/mcp@0.10.0`, `posthog-node@5.46.1`, and
`@modelcontextprotocol/sdk@1.29.0`. Those versions record the evidence
base; they are not an allowed-version set or an architectural pin.
Implementation and later maintenance use the current mutually
compatible releases. Direct manifests declare non-exact compatible
SemVer ranges for all three dependencies; dependency sweeps advance
those ranges, while the lockfile records the exact resolution tested
for a commit rather than the supported-version contract.

The shipped application resolves one interoperable runtime copy of
each package across this integration boundary. Every dependency
upgrade reruns the operation, payload, identity, person-processing,
session-header, retry, lifecycle, transport-delegation,
protocol-equivalence, manual-capture-call, and final-wire contract
suites against a lockfile rebuilt from the manifest declarations. A
failing upgrade is repaired inside the adapter while preserving these
contracts; tests may be maintained or strengthened, never weakened to
accept vendor drift. A version change that satisfies those contracts
is routine maintenance and does not return this plan to planning. Only
an intended outcome or privacy change, or a vendor change that makes
this contract impossible to preserve, reopens design.

## First-principles checks

- **Shape:** repository proofs assert Oak-authored event projection,
  protocol behaviour, failure isolation, and package boundaries. They
  do not treat a vendor SDK call or configuration value as proof that
  the product outcome occurred; the live-project criterion remains an
  owner-held proof.
- **Landing path:** implementation tests land inside the owning
  package and app suites already exercised by repository CI. No
  standalone fixture or script may count as acceptance evidence
  unless the shipped build also exercises it.
- **Vendor literals:** call shapes and observed behaviours are verified
  against current official sources at implementation and dependency
  upgrade time. Event names, privacy reconstruction, and observable
  behaviour remain fixed by Oak contract tests; package numbers and
  the SDK-owned supported-protocol set remain deliberately flexible.

## Acceptance criteria (each with a proof)

The plan owner verifies every `owner-held` proof below and records the
evidence on MCP-63.

1. **The shared capability is closed and provider-neutral.** The app
   composition root receives one discriminated
   `ProductAnalyticsRuntime<Transport>` and passes only its closed sink
   and transport-observer capabilities into request handling;
   resource-emission sites receive only `ProductAnalyticsSink`. Off
   mode is inert, returns the exact transport reference, and requires
   no PostHog configuration. Application and domain packages contain
   no PostHog import or arbitrary capture escape hatch. Proof
   (`repo-safe`): type tests, package-boundary lint, selection-axis,
   diagnostic-registry, production-locality truth-table, on/off
   product-runtime tests, and an app composition integration test.
2. **The four-operation matrix is exact.** Authenticated successful
   initialise, tool-list, tool-call, and resource-read paths each
   enqueue at most one approved event. Prompt, resource-list,
   unsupported-method, notification, unauthenticated, package-identify,
   exception-sibling, and generic HTTP-completion paths enqueue none.
   Proof (`repo-safe`): manual-API collaborator tests, public-transport
   integration tests, and real `McpServer` resource-callback
   integration tests.
3. **The final row is content-free and closed.** Hostile arguments,
   responses, prompts, resource contents, direct identifiers, client
   free text, errors, headers, session/conversation values, groups,
   person properties, and unknown fields cannot survive transport
   projection or the final policy boundary. Tool/resource labels come
   only from canonical registries. Both providers receive the same
   canonical release and environment projection when enabled
   together. Proof (`repo-safe`): hostile protocol-message tests,
   release truth-table and coexistence tests, event-policy unit tests,
   plus a loopback capture test asserting the actual HTTP payload
   after SDK metadata is added.
4. **Repeat-use identity is narrow, rotatable, and
   deletion-addressable.** The golden vector passes; same input is
   stable; destination, environment, version, key ID, key, or
   principal changes the output. Only the active projection is
   emitted, while deletion derivation returns every retained
   projection deterministically. No raw principal or key material
   enters events or diagnostics. Proof (`repo-safe`): golden,
   falsifier, key-ring, concurrency, and final-wire tests;
   (`owner-held`): the controlled event resolves one minimal Person
   with no Oak-supplied person properties.
5. **Session and conversation claims are absent without changing the
   protocol.** Tool schemas and every legal result field are unchanged;
   events contain no `$session_id` or conversation value; a forged
   package token cannot supply client or protocol facts. Every
   protocol version in the installed SDK's authoritative supported set
   is negotiated through a real initialise handshake and passes the
   closed event, final-wire, session, and protocol-equivalence
   assertions. Shipped SSE responses have identical status, headers,
   and body with analytics on or off and no `MCP-Session-Id`. Proof
   (`repo-safe`): exhaustive supported-version handshake tests,
   fresh-instance HTTP E2E tests for missing, replayed, and forged
   tokens, tool-list pagination and top-level `_meta` preservation,
   and schema/result/error identity tests.
6. **Analytics remains observational and coexists with Sentry.**
   Capture success, policy drop, identity failure, observation failure,
   capture throw, queue failure, and terminal delivery failure leave
   MCP traffic byte-equivalent. The observer preserves the exact
   inbound message and metadata, outbound message and options, result
   or error identity, and delegate send promise. Overlapping request
   identifiers and callback-registration order cannot exchange or lose
   state. Oak constructs and enqueues at most one operation fact; SDK
   retries carry the same UUID. Existing Sentry error and trace
   behaviour remains intact; Sentry inputs/outputs remain explicitly
   disabled; operational signals contain only the three fixed error
   kinds. Proof (`repo-safe`): composition, exact-delegation,
   failure-isolation, concurrent-request, registration-order, and
   coexistence integration tests.
7. **Serverless delivery matches the bounded contract.** One
   module-scoped client receives `waitUntil`; each enqueue schedules
   the bounded debounced flush; SDK retries preserve the UUID; no
   client is constructed, flushed, or shut down per request; local
   teardown's shared process close owner attempts both runtimes exactly
   once across bootstrap failure, listen error, signals, and explicit
   test teardown, with fixed `Result` failures and independent attempts.
   Proof (`repo-safe`): fake-clock lifecycle and terminal-path race
   tests, real-client network-isolated retry tests, and a built-artefact
   smoke test.
8. **Dependency upgrades preserve the contract.** The source
   manifests, lockfile, runtime graph, and built app identify the
   resolved compatible versions and contain one interoperable runtime
   copy across the integration boundary. A clean lockfile rebuild from
   the manifest ranges and every upgrade must pass the complete
   package-contract probe matrix, including the official manual method
   signatures and public MCP transport contract; no test asserts a
   permanent package-version literal. Proof (`repo-safe`):
   dependency-graph, clean-install, upgrade-contract, and
   built-artefact tests.
9. **A live invocation proves the useful path.** One authenticated
   controlled tool call produces the expected event and minimal
   Person in the approved EU project, with no excluded property.
   Proof (`owner-held`): the reviewed row, Person shape, and query
   evidence are recorded on MCP-63.

## Todos

- Wire the provider-neutral public-transport observer into application
  composition while retaining the concrete Streamable HTTP transport
  for `handleRequest`.
- Complete application-level analytics-on/off wire equivalence and
  request-context/lifecycle proof around the package-level
  exact-delegation, pagination, metadata, identity, concurrency,
  callback-order, unsupported-operation, and capture-failure suites.
- Complete the authenticated resource registrar, application lifecycle,
  Sentry coexistence, final-wire, retry, protocol-equivalence, and
  built-artefact proofs.
- Run the full affected estate against the final integrated change and
  resolve the required code, MCP, architecture, documentation, and
  onboarding reviews.
- Record the controlled live-project acceptance evidence on MCP-63.

## Out of scope

- Lawful-basis approval, public notice, analyst permissions,
  retention configuration, and the deletion drill: MCP-173 owns the
  October public-beta contract.
- Raw tool arguments, responses, prompts, resource contents,
  searches, feedback, or other free text: none is needed for the
  usage questions this plan answers.
- Unauthenticated public-resource analytics and any anonymous-person
  or per-event-public identity model.
- MCP prompt, `resources/list`, ping, notification, unsupported-method,
  or generic HTTP-request product events.
- Implementing an activity-window rule or presenting activity windows
  as sessions. The ordered raw facts are the input to a separately
  approved analytical view.
- Host-conversation counting or any conversation identifier whose
  continuity depends on an agent or model.
- MCP protocol-session reporting until an Oak-owned, authenticated,
  actor-bound token has been proven across shipped clients and both
  required response modes.
- Enabling JSON response mode without first proving that its
  session-token path meets the actor-binding and replay contract.
- Browser analytics, cookies, local-storage identity, autocapture,
  session replay, or direct widget-to-PostHog traffic.
- Stable person-level joins or new event-level correlation between
  PostHog, Sentry, or another processor.
- Exactly-once storage, a durable outbox, delivery reconciliation, or
  treating MCP request replay as a delivery retry.
- Reconsidering the selected analytics provider or enabling
  unrelated PostHog products.
