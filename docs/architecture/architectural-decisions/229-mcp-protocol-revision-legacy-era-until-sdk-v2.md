# ADR-229: The MCP app stays a legacy-era `2025-11-25` server until the SDK v2 package family is adopted

- **Status:** Proposed (2026-09-09). Nothing here is owner-ratified. It
  records a scoping decision MCP-644 asked for explicitly — "a scoping
  decision first, not a migration" — so that the posture stops being an
  undocumented consequence of a dependency version and becomes a reviewed
  choice with named exit conditions.
- **Date:** 2026-09-09
- **Related:** [ADR-112](112-per-request-mcp-transport.md) — the stateless
  per-request transport that makes the eventual migration cheap;
  [ADR-113](113-mcp-spec-compliant-auth-for-all-methods.md) — auth on every
  MCP method, which this record leaves untouched and explains why;
  [ADR-052](052-oauth-2.1-for-mcp-http-authentication.md) — the OAuth
  posture the v2 family's auth opt-ins would touch;
  [ADR-122](122-permissive-cors-for-oauth-protected-mcp.md) — permissive
  CORS, which **decides the transport's `Origin` MUST the other way** and
  whose compensating Host check no longer runs; §Consequences records the
  conflict and routes the re-decision to MCP-650 rather than settling it
  here;
  [ADR-223](223-perishable-claims-carry-risk-based-freshness-metadata.md) —
  why every external claim below carries its read date.

## Context

The MCP specification's current revision is `2026-07-28`. This app
implements `2025-11-25`. Until this record, no document in the estate said
so: the revision was a property of a dependency version, visible only by
reading `node_modules`, and nothing named the consequences or the exit.

`2026-07-28` is the largest revision since MCP launched. It moves the core
to **stateless, self-contained requests** carrying version, identity and
capabilities as per-request metadata — "there is no negotiation handshake",
as `basic/versioning` opens — eliminates the `initialize` handshake and
protocol-level
sessions, removes the GET stream endpoint, renumbers several errors, and
introduces a formal deprecation policy. In its vocabulary a server is
**modern** (version, identity and capabilities as per-request metadata) or
**legacy** (an `initialize` handshake); this app is legacy.

The revision also makes one RPC mandatory. Read at
`modelcontextprotocol.io/specification/2026-07-28/server/discover` on
2026-09-09, verbatim:

> `server/discover` lets a client query a server's supported protocol
> versions, capabilities, and identity before sending any other requests.
> Servers **MUST** implement it.

That RPC is implemented nowhere in this repository. Measured on
2026-09-09 over git-tracked files under `apps/` and `packages/` at
`origin/main` — that is, the tree as it stands _before_ this record:

```text
git grep -c "server/discover" origin/main -- apps packages  ->    0
git grep -c "tools/list"      origin/main -- apps packages  ->  143   <- CONTROL
```

**Read the zero with its basis, because this record falsifies it.** The
test this ADR lands (`protocol-revision-era.integration.test.ts`) names
`server/discover` seven times in order to assert its absence, so the same
grep run after this PR merges returns 7, all of them in that one file. A
future reader who greps and finds hits has not found an implementation.
Restrict the grep to `src/**` excluding `*.test.ts` to reproduce the zero.

The control number is basis-sensitive too: 143 counts git-tracked files
only; sweeping the working tree including build output gives 185. MCP-644's
own control read 197 on 2026-08-20. The three numbers are a moving tree
measured three ways, not a contradiction — what all of them establish is
that the grep works, so the zero is real. This app declares `2025-11-25`
throughout.

### What was measured, and how

Every claim in this section was measured first-hand on 2026-09-09.

**The SDK's ceiling is the binding constraint.** From the installed
package's own `dist/esm/types.js` — read from `node_modules`, not from a
changelog:

```text
@modelcontextprotocol/sdk@1.30.0
  LATEST_PROTOCOL_VERSION            = '2025-11-25'
  SUPPORTED_PROTOCOL_VERSIONS        = ['2025-11-25', '2025-06-18',
                                        '2025-03-26', '2024-11-05',
                                        '2024-10-07']
  occurrences of 'server/discover'   = 0
  occurrences of '2026-07-28'        = 0
```

`1.30.0` is what this app depends on (`^1.30.0`) and is also the `latest`
dist-tag on npm. So the app is already on the newest published release of
its SDK line, and no bump is available that would move it forward. The
SDK's own `ROADMAP.md` states that the `v1.x` branch "targets the
2025-11-25 spec revision; new spec revisions are implemented on `main`
only" — the 1.x line will not gain `2026-07-28`.

**Modern-era support lives in a different package family.**
`@modelcontextprotocol/core`, `/server` and `/client` at `2.0.0` do carry
`server/discover` and `2026-07-28`. They are present in this repository's
lockfile only transitively, through `@mcpjam/cli` and `@posthog/mcp` — dev
tooling, not app dependencies. Adopting the current revision therefore
means migrating package families, not raising a version range.

**A `server/discover` handler on the 1.x line would be unreachable.** This
is the decisive measurement, taken over real HTTP through this app's own
production composition, with controls:

```text
POST /mcp  MCP-Protocol-Version: 2026-07-28  method: server/discover
  -> HTTP 400  {"error":{"code":-32000,"message":"Bad Request: Unsupported
                protocol version: 2026-07-28 (supported versions:
                2025-11-25, 2025-06-18, ...)"}}

CONTROL  same version, method: tools/list   (a method this app implements)
  -> HTTP 400, byte-identical body

CONTROL  method: server/discover at 2025-11-25 (a supported version)
  -> HTTP 200  {"error":{"code":-32601,"message":"Method not found"}}

CONTROL  initialize, no version header
  -> HTTP 200  {"result":{"protocolVersion":"2025-11-25", ...}}
```

The first control is the one that settles the design: the transport rejects
on the **declared version, before any method dispatch**, so a handler
registered for `server/discover` could never be reached. The second control
isolates the method's genuine absence; the third shows the legacy lane
healthy.

**The mandatory clause binds modern-era servers.** Three independent
supports, all read on 2026-09-09:

- **Implementing the modern era is itself a MAY.** `basic/versioning`
  §Backward Compatibility: "A server that wishes to support both legacy
  clients … and modern clients … **MAY** implement both behaviors." A MUST
  inside the modern era cannot bind a server that has not taken the MAY.
  This is the shortest proof, and it is a direct permission rather than an
  inference.
- **`2025-11-25` is a different revision document.** §Terminology defines
  **legacy** as "protocol versions that establish a session with an
  `initialize` handshake (`2025-11-25` and earlier)". `2026-07-28` does not
  retroactively amend the obligations of the revision it supersedes.
- **The compatibility matrix says so by construction.** For a dual-era
  client meeting a legacy server: "HTTP: the modern request returns a `4xx`
  without a recognized modern error body, and the client falls back to
  `initialize`" — outcome **Works**. If "Servers MUST implement
  `server/discover`" bound legacy-only servers, that row would describe
  mandated non-conformance.

**Production corroborates the fallback.** MCP-497 measured, over 14 days:
754 `server/discover` refusals against 6,757 successful `initialize` calls
and 62,963 successful `tools/call` calls — including for the user the
refusals cluster on, who is one of the heaviest successful users. Clients
declare `2026-07-28`, receive the refusal listing what this server speaks,
negotiate down, and proceed. That is negotiation working as designed, not
clients locked out.

**Two things a reader will otherwise misread.**

- A wire probe cannot answer this question against production. Auth
  precedes method dispatch, so `POST /mcp {"method":"server/discover"}`
  returns `401` whether or not the method exists. The `401` is evidence in
  neither direction; the code-level and composition-level measurements
  above are the evidence.
- `src/landing-page/components/site-chrome.tsx` contains the string
  `2026-07-28`, which MCP-644 flagged as unresolved. **Resolved: it is a
  date**, recording when the footer's two legal URLs were verified live. It
  is not evidence of protocol support. Several other `2026-07-28` strings
  in the repository are likewise dates or owner-ruling stamps.

## Decision

1. **This app is a legacy-era `2025-11-25` server, deliberately and on the
   record.** The posture is not a defect and not an oversight; it is the
   only revision its SDK line implements, and that line is already at its
   newest published release.
2. **Do not implement `server/discover` on the 1.x SDK line.** It is
   unreachable behind the transport's version check (measured above), and
   the only answer it could conformantly give a `2026-07-28` request is a
   version refusal — which the transport already gives. A handler would be
   dead code that also misrepresents the server's era.
3. **Keep the version refusal inside the legacy error sub-range.**
   `2026-07-28` §Error Codes partitions the JSON-RPC implementation range.
   `-32000`–`-32019` is the **legacy** sub-range, where "apart from
   `-32002`, receivers **MUST NOT** assume any specific meaning for these
   codes". `-32020`–`-32099` is **reserved for the MCP specification**,
   where "implementations **MUST NOT** emit any code from this sub-range
   that is not defined by this specification". This app's `-32000` sits in
   the legacy sub-range, so no conformant client may read it as a modern
   error, and a dual-era client falls back to `initialize`.

   **This is Oak's own constraint, not a server-side MUST — do not cite it
   as one.** The specification imposes no obligation on a server's choice
   of refusal code here. What it states is _client_ behaviour, and only
   permissively: per Streamable HTTP §Backward Compatibility a dual-era
   client "**MAY** detect which era the server implements by attempting a
   modern request first" and, on a `400`, "**SHOULD** inspect the response
   body before falling back". The constraint binds us because MCP-497
   measured that real clients do exactly that, at production scale — it
   rests on evidence, not on conformance.

   **Who would actually be steered off the fallback, stated narrowly.** A
   client that implements that SHOULD literally — treating any recognised
   modern JSON-RPC error as "this server is modern, retry rather than fall
   back" — is steered wrong by a refusal renumbered to `-32020`, `-32021`
   or `-32022` (`UnsupportedProtocolVersion`). **The reference client is
   not such a client, and the difference was measured, not assumed.** In
   `@modelcontextprotocol/client@2.0.0`, `probeClassifier.ts` names
   `-32020` (`HeaderMismatch`) and `-32021`
   (`MissingRequiredClientCapability`) in a `NOT_PROBE_RECOGNIZED` set,
   commented "not era evidence — all fall into the conservative legacy
   default", and `classifyRpcError` diverts from the legacy default on
   `-32022` only when `parseSupportedList(data)` yields a non-empty array
   of strings at `data.supported`; a `-32022` carrying only a message falls
   back like any other code, as does every unlisted code including
   `-32602`. So the risk this decision guards is **spec-literal clients and
   the production population MCP-497 measured** — not the reference
   implementation, which falls back regardless.

   `src/protocol-revision-era.integration.test.ts` is the tripwire, and it
   is deliberately stricter than the harm it names. It pins the emitted
   code positively and asserts sub-range membership, rather than checking
   absence from a list of known modern codes: a later revision defining a
   fourth reserved code, or an SDK renumbering to a standard code such as
   `-32602`, would each slip past a denylist. Pinning exactly means the
   suite also reds for renumberings that break nothing — which is the
   intended trade, because the cost of a spurious red is one re-reading of
   this section and the cost of a missed one is silent breakage. The
   failure messages distinguish the two cases so that re-reading is quick.

4. **The migration target is `@modelcontextprotocol/server@2.x`, and it
   MUST be dual-era — never modern-only.** This answers MCP-644's third
   question, the backward-compatibility obligation to clients pinned to
   `2025-11-25`, and it constrains future work rather than describing
   today.

   Today the obligation is discharged by serving the revision. The
   compatibility matrix's `Legacy client / Dual-era server` row reads
   "**Works.** The server answers `initialize` and serves the client
   according to the negotiated legacy revision", and this app serves
   `2025-11-25` plus the four earlier versions in the SDK's
   `SUPPORTED_PROTOCOL_VERSIONS`, over Streamable HTTP — not over the
   deprecated `2024-11-05` HTTP+SSE transport, which this app does not
   host.

   At migration it becomes hard. The `Legacy client / Modern server` row
   reads "**Fails.** … **Legacy clients have no fall-forward mechanism**",
   and the specification offers only a SHOULD-grade consolation: a
   modern-only server "**SHOULD** name the protocol versions it supports in
   any error it returns to an `initialize` request … this message may be
   the only diagnostic they can surface to users". A modern-only cutover
   would therefore break every already-installed client permanently, with
   no recovery path available to the client.

   The target satisfies this by default rather than by configuration.
   Verified first-hand in the installed `@modelcontextprotocol/server@2.0.0`
   typings: `createMcpHandler` takes `legacy?: 'stateless' | 'reject'`, and
   `'stateless'` is the default — including when the option is omitted —
   under which each legacy request is answered by a fresh instance from the
   same factory over a transport constructed with only
   `sessionIdGenerator: undefined`. That is ADR-112's existing pattern
   exactly, and the same mode answers `GET`/`DELETE` with `405`, which is
   also this app's current behaviour. So one factory and one endpoint serve
   both eras side by side — which is additionally what makes
   `server/discover` reachable, and the only route to it.
   **`legacy: 'reject'` is out of bounds for this migration.**

5. **Self-description in a `DiscoverResult` will derive from served
   values, never from literals.** When the migration lands, `capabilities`
   and identity come from `SERVED_SURFACE` and `OAK_SERVER_BRANDING` — the
   existing single points of control — on the MCP-351 discipline that a
   served surface describes itself from what it serves.

   `supportedVersions` follows the same **intent**, but the mechanism is
   not settled and this record does not settle it. The target family keeps
   its version list internal: in `@modelcontextprotocol/core@2.0.0`,
   `LATEST_PROTOCOL_VERSION` and `SUPPORTED_PROTOCOL_VERSIONS` are
   declared in `dist/internal.d.mts` and exported only through the
   `./internal` subpath, not from the package root (measured 2026-09-10).
   Whether the migration reads them from there, derives the list from the
   handler's own configuration, or accepts a literal with a test pinning
   it to the served behaviour is a decision for MCP-506. What this record
   fixes is the direction — derived from what is served, not hand-copied
   — not the import path.

6. **Auth stays ahead of dispatch; ADR-113 is unchanged.** The
   `2026-07-28` authorization page carves out no exemption for
   `server/discover` and repeats that authorization "MUST be included in
   every HTTP request from client to server". A `401` on the probe is
   conformant. Discovery "before initialising" is protocol ordering, not
   permission to cross the resource-server boundary unauthenticated.

### The exit condition

Migrate when the work is scheduled on its own terms. The SDK's support
statement is a **floor, not a lapse date**, and it is easy to misread as
one. `ROADMAP.md` — not `VERSIONING.md`, which carries the SemVer and
release-process rules and says nothing about support duration — states
that the `v1.x` branch "continues to receive bug fixes and security
updates for **at least** six months after the v2 release (2026-07-27)"
(read 2026-09-10). So 2027-01-27 is the earliest date after which support
is no longer promised; it is not a date on which anything expires, and no
announcement has set one. Treat it as the point from which the absence of
a renewed commitment starts to matter, and re-read `ROADMAP.md` then
rather than trusting this line.

**The condition is armed, not just written down — twice, on purpose.** The
era-contract suite carries two sentinels, and they fire on different days:

- **The SDK constant.** It asserts the installed
  `@modelcontextprotocol/sdk` `LATEST_PROTOCOL_VERSION` is still
  `2025-11-25`. This is the one that catches the migration itself: the v2
  family removes that package, so the suite's import stops resolving and
  the file reds outright.
- **The served ceiling.** An `initialize` asking for `2026-07-28` in the
  body — no version header, so the transport does not refuse pre-dispatch
  — must still negotiate down to `2025-11-25`. This one reds with a
  message a reader can act on without opening `node_modules`, if the
  current line's ceiling ever moves under it.

**Neither substitutes for the other, and the behavioural one alone would be
a trap.** `@modelcontextprotocol/core@2.0.0` still declares
`LATEST_PROTOCOL_VERSION = '2025-11-25'` (measured 2026-09-10 in
`dist/internal.d.mts`), so a dual-era v2 server goes on answering a legacy
handshake with the legacy revision. A purely behavioural probe would sit
green on the very day this record's exit condition fires. Whichever fires,
that is also the day the reserved-sub-range bounds in Decision 3 must be
re-derived from the then-current specification.

## Consequences

### Positive

1. **The revision is now a reviewed position with a named exit**, not an
   invisible property of a dependency range.
2. **The behaviour Oak's compatibility depends on is pinned by a test.** A
   future SDK release that renumbered the refusal into the reserved
   sub-range would break fallback for spec-literal clients silently — it
   passes every other gate. It now fails one, with a failure message that
   distinguishes a harmless renumbering from a fallback-breaking one. The
   same suite carries the two exit-condition sentinels described above, so
   the day the SDK line or the served ceiling moves past `2025-11-25` this
   record is re-opened by a failing test rather than by someone
   remembering.
3. **MCP-644's flagged ambiguity is resolved** rather than left for the
   next reader to re-derive.
4. **The migration is smaller than "stateless migration" suggests.** The
   hardest part of `2026-07-28` — eliminating session state — this app has
   already done: ADR-112's per-request pattern runs
   `sessionIdGenerator: undefined` with a fresh server and transport per
   request, which the SDK's migration guide names as the case that maps
   directly onto the v2 default. The remaining work is wire shape and error
   semantics, not architecture.

### Negative

1. **A modern-only client cannot use this app at all.** The compatibility
   matrix's `Modern client / Legacy server` row reads "**Fails.** The
   server may reject the request with an implementation-defined error, stay
   silent, or even process an era-ambiguous method under legacy
   semantics." MCP-497's production evidence establishes that today's
   clients are dual-era and negotiate down; it does not establish that
   tomorrow's are. This is the consequence that worsens on its own as hosts
   ship modern-only clients, and it is the sharpest reason the exit
   condition below is a date and not a preference.
2. **Discovery stays degraded until the migration.** A client wanting
   versions, capabilities and identity in one call cannot have it, and must
   probe `tools/list`, `prompts/list` and `resources/list` instead. This is
   the gap MCP-422 refers to when it records that `server/discover` is
   "post-connection capability discovery, which no static card replaces" —
   no server card closes it.
3. **A conformance scanner will mark Oak behind**, correctly as to the
   revision and incorrectly as to fault. Any conformance evidence must name
   the revision it tested against or it will be read as current when it is
   not — the obligation MCP-184 carries.
4. **The error-surface noise persists.** The refusal reaches Sentry through
   the transport's `onerror`, which is MCP-497's subject. This record does
   not change it, and deliberately does not fix it: the cure is to stop
   classifying a spec-correct refusal as an exception, which is that
   ticket's own small change.

### Out of scope, flagged not resolved

`2026-07-28` Streamable HTTP states that servers "**MUST** validate the
`Origin` header on all incoming connections to prevent DNS rebinding
attacks", answering an invalid one with `403`. The MUST also appears under
`2025-11-25`, so it binds this app today.

**ADR-122 already decides this, and it decides the other way — read it
before treating this as an open gap.** ADR-122 is **Accepted**, and it
addresses DNS rebinding on `/mcp` by name rather than only authorization
under Bearer tokens: its Status block records "Host validation is enforced
in the auth layer, Origin is deliberately permissive, and the OAuth Bearer
token is the security boundary", and its §"Origin/Host validation is scoped
to where it adds security" reasons explicitly from the DNS-rebinding threat
to the conclusion that "Explicit Origin validation on `/mcp` would add
configuration surface and risk breaking legitimate browser and iframe MCP
clients for no security gain". An earlier draft of this record described
that rationale as being about Bearer-token authorization and DNS rebinding
as a threat ADR-122 had not considered. That was a misreading, and it is
withdrawn: the two positions genuinely conflict, and the conflict is the
finding.

**The conflict resolves because ADR-122's premise no longer holds.** Its
compensating control for a permissive `Origin` on `/mcp` is the auth
layer's Host allow-list check. That check does not run on the deployed app.
Measured on 2026-09-10:

- `host-validation-error.ts`'s `deriveSelfOrigin` opens with
  `if (canonicalOrigin) { return ok(canonicalOrigin); }` — it returns
  before reading the `Host` header at all. `getPRMUrl` and
  `getMcpResourceUrl`, the two functions ADR-122 names as the check, are
  thin wrappers over it and inherit the early return.
- `CANONICAL_HOST` is set in production. Reached directly at the Vercel
  origin hostname `poc-oak-open-curriculum-mcp.vercel.thenational.academy`
  — a different `Host` from the canonical one — the protected-resource
  metadata still answers
  `{"resource":"https://mcp.thenational.academy/mcp"}`. Per-request
  derivation would have echoed the arriving host; the configured origin is
  what is being served.

So on `/mcp` today there is neither `Origin` validation nor the `Host`
validation ADR-122 substituted for it. **This makes MCP-650 an amendment to
a standing Accepted decision, not the filling of a fresh gap** — the
decision is not wrong so much as resting on a control that has since been
short-circuited, and re-deciding it is ADR-122's own business rather than
this record's. This record therefore states the conflict and stops; it does
not amend ADR-122, and nothing here should be read as having done so.

**This is the one `2026-07-28` MUST that binds this app today, and it needs
no migration to satisfy.** It is already owned by **MCP-650**, in progress
— do not mint a second ticket for it. Two facts make it independent of
everything else here, both measured on 2026-09-09:

- `StreamableHTTPServerTransportOptions` is a re-exported alias of
  `WebStandardStreamableHTTPServerTransportOptions`, which declares
  `allowedHosts`, `allowedOrigins` and `enableDnsRebindingProtection`. The
  guard exists on the 1.x line this app already runs.
- `core-endpoints.ts:142` constructs the transport as
  `new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })`,
  passing none of them. The guard is available and simply not switched on.

**Do not read the existing guard as discharging this.** `security.ts`'s
`dnsRebindingProtection` validates the **`Host`** header, not `Origin`, and
it is mounted only on the static routes and the HTML leg of
`GET`/`HEAD /mcp` — it never runs on `POST /mcp`, so protocol traffic has
no `Origin` validation at all. Someone grepping `dnsRebinding`, finding a
`403`, and marking this covered would be wrong. MCP-650 is framed on the
`allowedHosts` leg; `allowedOrigins` is the leg this MUST names, and
belongs in that ticket's allow-list audit rather than in a ticket of its
own. The exploitability question routes to a security reviewer there, not
here.

For the same reason, the audit surface for "what still binds us" is the
`2025-11-25` MUST list, not `2026-07-28`'s. Walked on 2026-09-09, the only
unmet item is this one: the `405`-on-`GET` obligation is satisfied by
`createRefuseGetMcp` (which answers with a legacy-sub-range `-32000` body,
so it also reads correctly to a falling-back dual-era client), the
version-header `400` is the refusal measured above, and session `DELETE`
handling is MAY/SHOULD only.

## References

- **MCP `2026-07-28`** (read 2026-09-09):
  [Discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover),
  [Versioning and Compatibility](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning),
  [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http),
  [Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization),
  [Versioning index](https://modelcontextprotocol.io/specification/versioning)
- **SDK**: `modelcontextprotocol/typescript-sdk` — `ROADMAP.md`,
  `VERSIONING.md`, `docs/protocol-versions.md`,
  `docs/migration/support-2026-07-28.md` (read 2026-09-09)
- **Implementation**:
  - `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`
    (the per-request factory and its stateless transport)
  - `apps/oak-curriculum-mcp-streamable-http/src/protocol-revision-era.integration.test.ts`
    (the era contract and its tripwire)
  - `apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts`
    (the capability source a `DiscoverResult` would derive from)
  - `apps/oak-curriculum-mcp-streamable-http/src/server-branding.ts`
    (the identity source)
- **Tickets**: MCP-644 (this scoping), MCP-506 (the migration this record
  defers to, owner-authorised 2026-08-05), MCP-650 (the `Origin`/DNS-rebinding
  MUST, in progress), MCP-497 (the error-surface noise), MCP-422 (server
  cards), MCP-184 (conformance evidence naming its revision), MCP-345
  (advertised scopes)
