# ADR-218: PostHog MCP Analytics Identity, Session, and Privacy Boundary

**Status**: Accepted (revised 2026-07-26; implementation and October
public-beta enablement remain to be proven)
**Date**: 2026-07-26
**Related**:
[ADR-112](112-per-request-mcp-transport.md) — fresh server and
transport per request;
[ADR-143](143-coherent-structured-fan-out-for-observability.md) —
provider-neutral fan-out;
[ADR-160](160-non-bypassable-redaction-barrier-as-principle.md) —
non-bypassable redaction;
[ADR-162](162-observability-first.md) — product and engineering
evidence axes;
[ADR-171](171-observability-configuration-orthogonal-axes.md) —
sink selection;
[ADR-212](212-federated-visibility-authority-and-evidence-boundaries.md)
— product-usage and operational-evidence separation.
**Resolves**: ADR-160's deferred Clerk identity-envelope question for
PostHog.
**Supersedes in part**: ADR-162's 2026-04-19 History note where it
defers PostHog until after public beta and treats Sentry as sufficient
for the first product-usage question; ADR-171's expectation that
PostHog extends the homogeneous diagnostic sink registry. ADR-162's
five-axis and vendor-independence decisions and ADR-171's single
selection axis remain unchanged.

## Context

Oak already measures and reports engineering errors, traces, and
runtime behaviour. Sentry is one destination for that evidence. The
missing capability is product understanding: deterministic evidence
of which MCP tools, resources, prompts, and other protocol features
people use, how often they use them, the order of calls, whether they
complete successfully, whether authenticated actors return over time,
and how engagement unfolds.

That need is not met by sending more diagnostic telemetry. Product
interaction facts and engineering diagnostics answer different
questions, have different audiences, and require different data
envelopes.

The MCP service runs as Express on Vercel. Every request creates a
fresh MCP server and transport; there is no process-resident session
to reuse. The service nevertheless receives a verified, durable Clerk
principal, and the MCP Streamable HTTP protocol can carry an opaque
session identifier from initialisation into later requests. These
facts create several identifiers with different meanings:

- authenticated actor;
- Clerk authentication session;
- MCP protocol session;
- individual call or event;
- inferred period of activity; and
- host conversation.

Conflating them would make the resulting statistics unreliable and
would create unnecessary cross-system linkability.

The app is rendered inside third-party AI-assistant hosts. Its view is
web technology, but it is not an Oak webpage and Oak does not control
the host's cookie banner or persistence. The intended analytics are
therefore server-side product events, not browser analytics.

PostHog's official `@posthog/mcp` package supplies the chosen
first-party MCP event constructors. It is a pre-1.0 beta whose event
surface may change, so its output is an untrusted vendor input to Oak's
policy boundary, not the definition of Oak's analytics contract.

Evaluation of the package's automatic server wrappers found that
neither is protocol-transparent enough for Oak's server. The
high-level wrapper removes legitimate `context` and `conversation_id`
tool-call arguments before Oak's handlers receive them. The low-level
wrapper preserves those arguments but reconstructs `tools/list`
results without legal `nextCursor` and top-level `_meta` fields.
Instrumentation that changes the MCP wire contract is not
observational and is not accepted.

## Decision

### 1. Keep product analytics and diagnostics distinct

Oak adopts a provider-neutral product-analytics capability alongside,
not inside, the engineering error-observability capability.

- PostHog receives approved product-interaction facts.
- Sentry remains the specialist surface for errors, traces, exception
  payloads, and operational diagnosis.
- Consumer code depends on Oak contracts. The official
  `posthog-node` and `@posthog/mcp` packages remain inside adapters
  and composition boundaries.
- No cross-provider correlation identifier is emitted by default.
  Any future call-level bridge requires a separately approved purpose,
  identifier, access boundary, and delivery plan. No stable person
  identifier is shared between PostHog and Sentry.

`OBSERVABILITY_SINKS` remains the one selection axis. A single closed
`OBSERVABILITY_SINK_DEFINITIONS` registry classifies its literals by
capability class, with exact `diagnostic: ['sentry', 'file']` and
`product_analytics: ['posthog']` groups. Literal spreads and indexed
access derive the full selection and diagnostic-only tuples and unions;
no second kind list or widening assertion is permitted. The homogeneous
`SinkRegistry` uses only the diagnostic union. PostHog projects through
a parallel discriminated product-analytics runtime with exact on and
inert off modes; it is not represented as an exception/message sink.
Production continues to require at least one diagnostic-group member,
so selecting only PostHog does not satisfy the remote-diagnostics
locality rule. This preserves one configuration axis without inventing
`ObservabilitySink<'posthog'>`.

This is a per-sink projection of one protected source context. It does
not weaken ADR-160. The keyed PostHog identity is derived inside the
authentication and policy boundary, before the raw Clerk principal is
discarded. The shared redactor then closes the remaining candidate
context, and the destination projection is reconstructed from only
those redacted fields plus the already-derived pseudonym. No outbound
projection can read the raw principal after the barrier.

### 2. Model five measurement units without substitution

1. **Actor.** Repeat-use analysis uses a stable PostHog-scoped
   pseudonym derived from the verified Clerk principal through a
   versioned, destination- and environment-scoped keyed function. The
   raw Clerk identifier, name, email, and authentication-session
   identifier do not leave the authentication boundary for PostHog.
   The pseudonym is personal data for Oak; it is not described as
   anonymous.
2. **MCP protocol session.** A session exists only when the server
   issues an opaque `MCP-Session-Id`, the client replays it on later
   requests, and Oak can verify that the identifier was server-issued
   and remains bound to the authenticated actor. The researched
   `@posthog/mcp` baseline does not meet that bar: its token is
   unsigned client-readable JSON, forged tokens and client metadata
   are accepted, its SSE response does not emit the newly minted
   header, and JSON continuity depends on replay of that untrusted
   token. Oak therefore removes `$session_id` from the current event
   projection and reports no protocol-session statistics. A future
   Oak-owned session mechanism must be authenticated, actor-bound,
   replay-tested, and independent of process memory before this
   measurement unit becomes populated.
3. **Call or event.** Every observed interaction has a UUIDv7 event
   identifier that remains stable across delivery retry. It identifies
   one fact, not one person, authentication session, protocol session,
   or conversation.
4. **Activity window.** A downstream, versioned rule may group ordered
   calls by observed timing. The output is always labelled as an
   inferred activity window. It is not renamed as an MCP session or
   host conversation.
5. **Host conversation.** No host-conversation identifier is captured
   while continuity depends on an agent remembering and echoing a
   value. PostHog's optional conversation mechanism stays disabled.

The Clerk authentication-session identifier remains an authentication
concept and is not reused as any of these measurement units.

The relationship for the current release is:

```text
PostHog-scoped actor
  └─ zero or more calls/events

inferred activity windows = versioned analytical views over calls
proven MCP protocol sessions = empty until Oak supplies a trusted round trip
host conversations = not measured
```

### 3. Define raw data as allowlisted facts, never content

The raw analytical grain is one unaggregated fact row per observed
event. “Raw” never means raw request or response material.

The closed event envelope may contain:

- event identifiers;
- a same-action cross-provider correlation identifier only after the
  separate approval required above, never by default;
- server-observed timestamps and duration;
- MCP primitive or method and an allowlisted capability name;
- bounded outcome or error category;
- protocol, client, environment, and release categories;
- the PostHog-scoped actor pseudonym; and
- a trusted protocol-session projection, only after the future proof
  described above exists.

It excludes:

- tool arguments and responses;
- prompts, model output, resource content, search terms, query text,
  feedback text, and other free text;
- names, emails, raw Clerk identifiers, authentication-session
  identifiers, tokens, headers, cookies, IP addresses, and GeoIP;
- exception messages, stack traces, and diagnostic payloads;
- browser autocapture, session replay, device fingerprinting, and
  iframe persistence; and
- stable person identifiers shared with another processor.

Oak's transport observer constructs only the closed facts needed by
the applicable official manual capture call. It never supplies request
parameters, responses, errors, or free text. Oak then reconstructs
every outbound event from the exact allowlist and drops unknown events
and properties. Vendor sanitisation is defence in depth.

The supported PostHog deletion API resolves a Person before it queues
event deletion. Purely profileless events can be located by
`distinct_id`, but cannot be deleted through that API because no
Person is resolved. Oak therefore permits one minimal PostHog Person
record for the destination-scoped actor pseudonym. It contains no
name, email, direct identifier, `$set`, `$set_once`, person property,
or group membership. This record is a deletion index and repeat-use
anchor, not a richer user profile. It remains pseudonymous personal
data and is deleted with the actor's events.

### 4. Preserve serverless transport without trusting package sessions

ADR-112's fresh MCP server and transport per request remains binding.
A protocol session is client-carried context across those fresh
instances, not a long-lived Express process, sticky Vercel instance,
or server-side session store.

Oak observes the protocol through a provider-neutral decorator around
the public MCP SDK `Transport` passed to `server.connect`. The
application retains its concrete transport for transport-owned
operations such as HTTP request handling. The decorator:

- receives the original inbound JSON-RPC message and
  `MessageExtraInfo`;
- recognises only `initialize`, `tools/list`, and `tools/call`
  requests;
- derives the PostHog-scoped actor pseudonym synchronously from
  verified `authInfo` and then discards the principal;
- stores only the closed operation facts and start time keyed by the
  exact JSON-RPC request identifier;
- observes the matching outbound success or error without retaining
  request parameters, response bodies, thrown values, or error
  content; and
- delegates the same message and send options to the underlying
  transport and returns the underlying send promise unchanged.

Unsupported methods, notifications, and unmatched messages are
forwarded without analytics. Multiple request identifiers may remain
in flight concurrently and cannot exchange actor or operation state.
When analytics is off, observation returns the original transport
reference.

The official manual `PostHogMCP.captureInitialize`,
`captureToolsList`, and `captureToolCall` methods construct the three
vendor events. Oak passes only the approved identity and categorical
facts. It does not call the package's automatic high- or low-level
instrumentation wrappers.

This clarifies the old assumption that per-request serverless
transport and protocol-session measurement are incompatible in
principle. It does not make the package's current token trustworthy.

The dated baseline probe found that `@posthog/mcp@0.10.0` mutates
`transport.sessionId` only after the MCP SDK has already constructed
SSE response headers. SSE therefore sends no `MCP-Session-Id`. JSON
response mode constructs headers later and does send the token, but
the token is an unsigned base64url JSON object and the package accepts
client-forged session IDs and client metadata. The package's generated
session-per-request fallback and replayed JSON token are both removed
from Oak events. Actor, call, order, duration, outcome, and inferred
activity-window measurements remain deterministic without them.

### 5. Limit analytics to what is strictly necessary for a safe service

Oak cannot currently present one meaningful and reliable permission
choice before capture across every third-party MCP host. Authentication,
OAuth scopes, host tool approval, server metadata, and optional MCP
elicitation do not together create such a choice and must not be
presented as though they do.

That constraint narrows the processing; it does not widen it. Oak
collects only the closed, content-free interaction facts that it needs
to build, operate, and maintain a safe MCP service. Without evidence of
how people interact with the service—which capabilities are used, in
what order, with what outcome, and where interaction fails—Oak cannot
responsibly understand the service it operates or improve its safety
and usefulness.

The event envelope in this ADR is therefore the strict ceiling for
product analytics. Every event and field must be necessary for a named
service-understanding, safety, maintenance, or improvement question.
Anything merely interesting, potentially useful later, content-bearing,
or outside the allowlist is not collected.

“Strictly necessary” in this decision names Oak's product and
architecture boundary. It does not assert that PostHog is required to
execute an individual tool call, or pre-empt the distinct terminology
and tests in data-protection law. The official-source research about
PECR, UK GDPR, notice, objections, and consent remains part of the
evidence supplied to Oak's compliance and privacy specialists.

This ADR does not prescribe how those specialists conduct their work.
It supplies the system facts, product purpose, chosen data ceiling,
retention and deletion commitments, and retained research for their
independent assessment and advice. Their conclusions and any resulting
changes are recorded in the consultation surface.

Oak provides clear information about this processing. The absence of a
sensible permission surface is not treated as permission, and OAuth
authorisation is not described as agreement to analytics.

Choice remains documented as a possible future product capability, not
as the initial approach. The research shows that a later choice could
use an Oak-controlled preference or suppression state inside the
authenticated boundary, checked before every PostHog emit. The Clerk
connection journey, an Oak-hosted account/privacy page, an app-only MCP
App action, and optional MCP form or URL elicitation are possible
surfaces. None is misrepresented as a universal current mechanism.

Before public capture is enabled, Oak must also have:

- an MCP-specific privacy notice and an approved lawful basis;
- an approved data-minimising event and identifier allowlist;
- least-privilege access to unaggregated rows;
- a maximum 12-month retention period across PostHog and every
  authorised copy;
- a tested request-for-deletion route across PostHog and every
  authorised copy; and
- a documented separation between PostHog, Sentry, and any
  Oak-controlled join.

The release sequence, approvals, and evidence links live in Linear and
the internal compliance consultation. This ADR records the durable
boundary, not delivery status.

### 6. Use one MCP-dedicated client and a serverless delivery boundary

Oak uses one warm-instance PostHog client for the current all-MCP event
estate. The official manual MCP API may apply its installed package
name and version as client provenance; that label is accurate for the
three manually constructed MCP events and Oak-authored MCP resource
events. The app currently serves no MCP prompts. A second client is
warranted only if Oak later sends genuinely non-MCP product events
that need different provenance or policy.

The provider-neutral transport observer supplies initialisation, tool
listing, and tool-call facts to the official manual MCP API. Oak emits
resource reads explicitly through a closed adapter; it does not expose
the Node client's general capture method to application code.

The transport projection and final client policy are synchronous,
closed reconstruction boundaries. The observer reads only the
allowlisted categorical facts from protocol messages and passes no
content fields to the vendor API. The client-level policy is the
universal, non-bypassable final reconstruction barrier for manual MCP
and Oak-authored resource events.

Observation and capture faults fail open: they emit only the fixed,
content-free `posthog_event_policy_failed` operational signal and
never change, replace, delay, or annotate an MCP message or transport
promise. Identity-projection failure remains a distinct
`posthog_identity_projection_failed` signal with the same content-free
and fail-open constraint.

The module-scoped client receives Vercel's `waitUntil` function. The
installed compatible Node SDK then schedules a bounded debounced flush
and extends the invocation lifetime until that work settles. Oak does
not construct or shut down a client per request, and it does not
depend on an unawaited background task after the response. Delivery
failures are reported through a content-free operational signal and
never change the MCP response.

The integration manifests use compatible, non-exact dependency ranges.
The lockfile records the exact tested resolution, not the supported
version contract. An upgrade is routine maintenance when the complete
operation, privacy, identity, protocol, lifecycle, retry, and
final-wire contract suite passes. If a vendor API changes, the adapter
is repaired while those behaviours remain fixed; the architecture is
reopened only if Oak changes the boundary deliberately or a vendor
change makes it impossible to preserve.

## Rationale

### Why a destination-scoped pseudonym

Anonymous-per-request events cannot answer repeat-use questions and
cannot reliably locate a person's events for deletion. Sending the raw
Clerk identifier exposes an authentication principal to a processor.
A universal UUIDv7 person key would add a mapping store and create an
unnecessary cross-system join key, while also revealing issuance time.

A destination-scoped keyed projection provides stable PostHog
attribution and deterministic deletion lookup without disclosing the
source identifier or enabling identifier-only joins with other
processors. The minimal Person row is necessary because PostHog's
supported event-deletion route is person-scoped. A profileless
materialise-then-delete workaround exists in current implementation
details, but it is not a documented deletion contract and is not the
baseline.

### Why protocol sessions but not conversations

The MCP specification defines a conditional, client-carried session
round-trip for Streamable HTTP. In principle, continuity can survive
fresh serverless request instances because a conforming client carries
it. The current package token is not server-authenticated or
actor-bound, so Oak does not populate that measurement unit yet.

PostHog's conversation feature has different semantics: it alters tool
schemas and responses and relies on an agent to echo an agent-controlled
value. That is useful as a cooperative grouping hint, but it cannot
support deterministic Oak statistics. Activity windows meet the
remaining engagement-analysis need without pretending Oak can see a
host conversation.

### Why official manual MCP events plus an Oak transport boundary

The official package already constructs canonical MCP initialisation,
tool-listing, and tool-call events. Its automatic wrappers do more than
observe: the high-level wrapper removes legitimate request fields and
the low-level wrapper removes legitimate response fields. Oak
therefore owns the observation seam at the public transport boundary
and calls the official manual event API with closed categorical facts.
Oak adds resource-read observations through its own closed MCP adapter,
and Oak's allowlist defines what may leave the process. A future prompt
event requires a separately approved event surface and deterministic
observation seam.

## Alternatives considered

1. **Use the raw Clerk identifier in PostHog.** Rejected because it
   discloses the authentication principal and makes cross-processor
   linkage too easy.
2. **Mint one universal UUIDv7 user identifier.** Rejected because it
   creates a new mapping obligation and a general-purpose join key.
3. **Stay anonymous per request.** Rejected because it cannot answer
   approved repeat-use questions or support deterministic
   person-scoped deletion.
4. **Use the Clerk authentication session as the MCP session.**
   Rejected because sign-in lifecycle and MCP protocol lifecycle are
   different.
5. **Enable PostHog conversation IDs.** Rejected while continuity
   depends on model cooperation and untrusted agent input.
6. **Collect arguments and responses for later analysis.** Rejected
   because the stated product questions do not require content and
   the privacy cost is disproportionate.
7. **Add browser PostHog to the embedded view.** Rejected because the
   server observes the required MCP interactions directly and Oak
   does not control the host's cookie or storage surface.
8. **Use an OAuth analytics scope as consent.** Rejected because
   authorisation scopes grant client access to protected resources;
   they do not prove a valid, purpose-specific data-processing choice.
9. **Rely only on MCP elicitation for the analytics choice.** Rejected
   because elicitation is optional, client-negotiated, and occurs
   inside another MCP interaction. It cannot guarantee a decision
   before the first event that might otherwise be captured.
10. **Require a universal cross-host permission gate in the initial
    baseline.** Not selected because MCP provides no reliable,
    mandatory pre-capture permission surface across hosts. Oak instead
    limits collection to the interaction facts strictly necessary to
    build, operate, and maintain a safe service. The research into a
    possible future choice mechanism is retained for a later product
    decision.
11. **Keep all events profileless.** Rejected because PostHog's
    supported bulk-deletion API resolves Person records before it
    queues event deletion. A minimal pseudonymous Person with no
    person properties provides a documented, testable deletion route.
12. **Treat the package session token as an MCP session.** Rejected
    because SSE does not return it and JSON mode accepts unsigned,
    client-forged session and client-metadata claims.
13. **Use two PostHog clients for the current event set.** Rejected
    because all current events describe MCP interaction and share one
    policy and lifecycle. The package's client relabelling is accurate
    for that bounded estate.
14. **Use the package's high-level automatic wrapper.** Rejected
    because it removes legitimate `context` and `conversation_id`
    tool-call arguments before dispatch and therefore changes
    application behaviour.
15. **Use the package's low-level automatic wrapper.** Rejected
    because it reconstructs tool-list results without legal
    `nextCursor` and top-level `_meta` fields and therefore changes the
    wire response.

## Consequences

### Positive

- Product and data teams can analyse capability adoption, call order,
  engagement intensity, and approved repeat use from deterministic
  fact rows without presenting an untrusted package token as a
  protocol session.
- Sentry and PostHog remain useful specialist surfaces rather than
  becoming two copies of the same telemetry.
- Actor and call measurement works across fresh Vercel request
  instances without a shared session store.
- The stable actor projection is useful within PostHog but resists
  identifier-only linkage elsewhere.
- Content collection is excluded by architecture rather than analyst
  convention.

### Costs and constraints

- The actor pseudonym remains personal data and brings transparency,
  access, retention, and erasure duties.
- A minimal Person row exists in PostHog for each actor pseudonym so
  the supported event-deletion route can resolve it.
- Key versioning must preserve deletion across every retained
  pseudonym version without creating a shadow identity ledger.
- The current release reports no MCP protocol-session statistics. A
  future mechanism must prove server issuance, actor binding, client
  replay, and transport compatibility before that changes.
- A pre-1.0 vendor package requires manual-API and final-wire contract
  tests and re-verification whenever its compatible dependency range
  advances.
- Event-level access and exports require explicit governance because
  minimised rows can still reveal behavioural patterns.

Package-level transport contract tests prove that the observed
transport preserves successful and error responses, including legal
`nextCursor` and top-level `_meta`; that the exact message object,
options object, error identity, result identity, and underlying send
promise are preserved; that overlapping request identifiers remain
isolated; that pre-existing callbacks run in the SDK-defined order;
and that unsupported operations, projection failures, and capture
failures cannot affect protocol behaviour. Application-level
analytics-on/off wire equivalence remains required delivery evidence;
this ADR does not claim that proof is complete.

### Maturity

The decision is accepted. Repository and live-system proof is still
required by the delivery plans serving MCP-63 and MCP-173. Acceptance
of this ADR does not assert that the integration, notice, retention,
access controls, or deletion route are already live.

## Relationships and supersession

- ADR-112 remains authoritative for fresh per-request server and
  transport construction. This ADR clarifies that a client-carried
  protocol-session identifier does not make the Vercel runtime
  stateful.
- ADR-160's closure principle remains unchanged. This ADR resolves its
  identity question with explicit per-sink projections and a
  PostHog-only pseudonym.
- ADR-162's observability axes and vendor-independence principle remain
  unchanged. Its earlier PostHog deferral and “Sentry is sufficient”
  sequencing note are superseded.
- ADR-171 remains the configuration-axis authority: PostHog is
  selected through the existing sink axis rather than a new mode.
  This ADR supersedes only its earlier expectation that every selected
  kind extends the homogeneous diagnostic sink registry.
- ADR-201 continues to own any future evidence-edge connector or
  write-back mechanism.
- ADR-212 continues to classify PostHog as product-usage evidence,
  Sentry as operational evidence, and neither as proof of value or
  impact.
- The April and May 2026 identity explorations remain historical
  evidence but are superseded where they prescribe anonymous
  per-request identity, raw Clerk IDs in PostHog, no MCP protocol
  session, or deferred PostHog delivery.

## Official evidence

- [MCP Streamable HTTP session semantics](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- [PostHog MCP analytics](https://posthog.com/docs/mcp-analytics)
- [PostHog MCP conversation-ID caveats](https://posthog.com/docs/mcp-analytics/conversation-id)
- [PostHog MCP user identification](https://posthog.com/docs/mcp-analytics/identifying-users)
- [PostHog MCP privacy and redaction](https://posthog.com/docs/mcp-analytics/privacy)
- [PostHog manual MCP event API (`PostHogMCP` source)](https://github.com/PostHog/posthog-js/blob/a027bf5c0d48a39388f9db3da7565e2d283e0b65/packages/mcp/src/extensions/posthog-mcp.ts)
- [PostHog anonymous and identified events](https://posthog.com/docs/data/anonymous-vs-identified-events)
- [PostHog person deletion](https://posthog.com/docs/data/persons#deleting-person-data)
- [PostHog bulk-deletion implementation](https://github.com/PostHog/posthog/blob/1b7381290f60da044f05358ae09f46a4b3e7c827/posthog/api/person.py#L653-L722)
- [PostHog MCP stateless and multi-instance support (`@posthog/mcp` 0.10.0 source)](https://github.com/PostHog/posthog-js/tree/a027bf5c0d48a39388f9db3da7565e2d283e0b65/packages/mcp#stateless--multi-pod-servers)
- [Vercel `waitUntil`](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package)
- [Clerk session-token claims](https://clerk.com/docs/guides/sessions/session-tokens)
- [ICO pseudonymisation guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/pseudonymisation/)
- [ICO storage-and-access technology guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/)
- [ICO right-to-object guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-object/)
- [MCP elicitation](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation)
