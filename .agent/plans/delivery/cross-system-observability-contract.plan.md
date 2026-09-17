---
id: cross-system-observability-contract
node_type: delivery
name: 'The service correlation graph: follow actions, events, authority, and failure across every enabling system'
overview: 'Define the correlation graph — systems and artifacts as nodes, shared keys as edges, planes as subgraphs, one governed membrane edge — split into a public capability layer and a private deployment-configuration layer, with privacy held by construction.'
status: sketch
serves: first-major-release
impact_areas:
  - analytics-and-observability
tickets:
  - MCP-504
depends_on: []
owner_gates: []
last_updated: 2026-08-05
---

# The service correlation graph

## Goal

An investigator — human or agent — follows **actions, events,
authority decisions, and failures** across every system that
collectively enables the service by walking recorded graph edges
instead of doing archaeology: an edge anomaly resolves to its error
event, an error to its deployment, a deployment to its commit, review,
ticket, and intent — and each direction of that walk is mechanical.
Privacy is held by construction: exactly one edge of the graph is
governed, and it is governed structurally.

## Problem

The service is enabled by many systems — edge, deploy, runtime, auth,
upstream content, search, error tracking, analytics, change control,
work tracking. Their correlations exist today only as accidents and
conventions: some keys are carried, some are dropped at boundaries,
some systems are unreachable to agent tooling, and the identifier map
lives in scattered reports. A recent production investigation crossed
three systems and succeeded only through archaeology.

The privacy posture has the mirror problem: product analytics is
deliberately pseudonymous, but nothing states which keys may never
reach it, so the protection holds by vigilance rather than structure.

And the record conflates two layers that must stay distinct: what the
**public repository** makes possible (any operator of this app could
instantiate it) versus how **Oak's private deployment** is actually
configured (which systems are wired, under which accounts, with which
credentials and retention). Some knowledge belongs in the public repo;
some belongs only to the deployment.

## Mechanism

### 1. It is a graph

The contract's model is explicitly a graph:

- **Nodes** are systems (edge, deploy platform, runtime app, auth,
  upstream API, search, error tracking, analytics, change control,
  work tracking) and durable artifacts (ticket, plan node, PR, review,
  commit, check run, release, deployment, error event, analytics
  event).
- **Edges** are shared keys: an edge exists between two nodes exactly
  when a recorded identifier lets you walk from one to the other.
- **Planes** are subgraphs (below) within which integration is
  maximised.
- **The membrane** is the single governed edge — between the request
  plane's identities and the usage plane's pseudonyms — crossable only
  through the keyring ceremony, deliberately and with a record.

Everything this plan lands is either a missing edge, a missing map of
the nodes, or the enforcement that keeps the one governed edge
governed.

### 2. The three planes

**Change plane — why, and on whose authority.** Ticket → plan node →
PR → review → checks → commit → release → deployment. Keys already
exist by convention (ticket ids in branch and commit names, PR
numbers, commit SHAs, release versions, deployment ids), and authority
is already structural: committer = acting bot identity, commit
`--author` = the human whose authority, model trailer = the acting
model, review approvals and required checks = the change-authority
record. This plane is public-by-design: integration can be total.

**Request plane — what happened, including runtime authority.** The
edge → deploy → runtime path, joined per-request by an edge-minted
trace id (end-state: W3C trace propagation from edge through function
to error tracking), plus the edge request id and the application
`correlation_id`. Runtime authority lives here natively: auth
token-verification calls are spans inside request traces, so "which
grant, why the 401" is per-request followable. Authority failures have
three recorded layers — edge rejections, app auth rejections,
change/deploy authority (guard cancellations, required checks) — each
joined back by SHA or trace id.

**Usage plane — what people do over time.** Pseudonymous analytics,
joined to the other planes on dimensions only.

### 3. The node roster (to the safe limit)

| System | Plane | Holds | Join keys outward | Safe-limit notes |
| --- | --- | --- | --- | --- |
| Edge (CDN/WAF) | request | requests, bot/WAF/cache decisions, IPs | edge request id; host+path+time | identity-adjacent (IP); Zone A only |
| Deploy platform | change + request | builds, deployments, function logs | deployment id, commit SHA, release | build logs may echo env names, never values |
| Runtime app | request | request handling, guard decisions | trace id, `correlation_id` | mints the app-side keys |
| Auth (Clerk) | request | sign-in, token grants/verifications | user id (error tracking only); verify spans via trace id | user id never leaves Zone A; no auth calls at build |
| Upstream content API | request | curriculum reads | outbound spans via trace id; API-key identity | vendor-side logs are theirs; our side joins by trace |
| Search (Elastic) | request | queries, retrieval | outbound spans via trace id | **free-text sensitivity**: user-entered query text stays Zone A; vendor-side query logging is an open recorded question (MCP-468) |
| Error tracking (Sentry) | request | exceptions, traces, uptime | trace id, `correlation_id`, release, SHA, deployment id, user id | the identity-bearing observability node |
| Analytics (PostHog) | usage | pseudonymous product events | dimensions only: release, environment, deployment id, client software identity, tool, time bucket | **no per-request or per-person Zone-A keys, ever** |
| Change control (GitHub) | change | PRs, reviews, checks, merges | PR number, SHA, check contexts, release tag | public by design |
| Quality authority (Sonar, CodeQL, CI) | change | check verdicts | SHA, check context | public by design |
| Work tracking (Linear) | change | tickets, intent, internal detail | ticket ids (public keys in branches/commits/PRs) | ticket **ids** are public edges; ticket **content** is internal — the edge crosses, the payload does not |
| Plan estate (this repo) | change | intent and mechanism | plan ids, `serves`, ticket references | public; mechanism only |

### 4. The inter-plane joins

- **Change ↔ Request** — the money join: `release + commit SHA +
  deployment id` answers "which change caused this failure" in one
  hop. Mostly present; the missing key is the **deployment id** as an
  event tag in error tracking and analytics — it distinguishes two
  deployments of the same commit, a real recurring case now that
  same-commit redeploys are a supported recovery path.
- **Request ↔ Usage** — dimensions plus the membrane. The only capped
  join, and the only one that needs capping.
- **Change ↔ Usage** — usage-by-release; safe and already possible.

### 5. The zone rule and the membrane

**Zone rule**: the usage plane never carries a request-plane
per-request or per-person key — no request ids, no trace ids, no raw
user agents, no precise geolocation, no authenticated ids, no
free-text input. Cross-plane joins to usage happen on the dimension
rows only.

**Membrane**: mapping between authenticated identity and pseudonym
happens only through the keyring ceremony, as a deliberate, recorded
act under the privacy-governance lane. No system holds both key kinds
at rest.

**Recorded residual**: at low traffic, timestamp-and-shape correlation
across planes is possible with no shared keys at all. The contract
prevents systematic, queryable correlation; the residual is governed
by access control — who holds read access to two planes at once — and
the contract says so rather than pretending data shape alone closes it.

### 6. Structural enforcement

A unit test on the analytics capture layer asserts, red-first, that
emitted properties never include the forbidden key names or value
shapes (request-id patterns, trace-id patterns, raw user-agent
strings, free-text fields). The zone rule fails a build instead of
relying on review vigilance.

### 7. Capability versus configuration — the two layers

- **The public repository defines the capability**: the graph model,
  the key-propagation code, the zone rule and its enforcement test,
  the map page's shape, and (later) the follow tool. Any operator of
  this app could instantiate the graph for their own deployment.
- **The Oak deployment owns the configuration**: which systems are
  actually wired, under which organisations and accounts, with which
  credentials, retention settings, and console locations. That
  knowledge lives on the operator surfaces — the ops map page up to
  the established ops-docs sensitivity limit, and the linked ticket
  for the remainder — never baked into the public capability layer.

### 8. The concrete edges and surfaces this plan lands

1. **Edge join**: read the edge request id in the app and attach it as
   an error-event tag alongside `correlation_id`; end-state is full
   edge-minted trace propagation.
2. **Deployment-id key**: tag error-tracking and analytics events with
   the deployment id (an A+B dimension).
3. **The map**: one "observability surfaces" operations page listing
   every roster node, its plane, what it holds, its access route for
   humans and agents, and where each layer's **authority decisions**
   are recorded (edge allow/deny, app auth allow/deny, change/deploy
   allow/deny) — instantiated to the deployment layer's sensitivity
   rules.
4. **Access**: a read-only analytics credential scoped to the
   organisation's edge account so agent tooling can read edge data at
   all (owner-held provisioning act).
5. **Analytics instrumentation trio**: client software identity on the
   initialize event; a service-identity transport-rejection event
   (pre-auth, anonymous by construction); re-type the protocol-version
   property to String.

### 9. What the client sends — captured to the safe limit

The MCP client side offers more visibility than the server currently
keeps, all of it privacy-safe under the zone rule when handled as
follows:

- **`clientInfo` (name + version) from `initialize`** — software
  identity; captured (the trio above). Ends the client-family
  guesswork.
- **The client `capabilities` set from `initialize`** — captured as
  booleans (sampling, roots, elicitation, …), never payloads: which
  advanced MCP features the client population could use, before we
  build on them.
- **Offered protocol version as a success dimension** — the
  transport-rejection event covers failures; recording the version
  dimension on successful sessions too makes protocol drift visible
  before it rejects anyone.
- **Transport session id** — operational continuity only; never enters
  the usage plane verbatim (usage-plane session grouping uses its own
  derived id).
- **Raw user agent** — request plane only, short retention; the usage
  plane sees the coarse client family alone.
- **An optional `context`/intent parameter on tools** — the
  highest-value addition and the one that must be designed, not
  drifted into: the calling agent states why it is calling. Intent is
  free text and agents paraphrase their users, so the zone rule
  applies exactly as written: it reaches the usage plane only as a
  **closed-taxonomy classification computed server-side**, and the raw
  text is at most request-plane, short-retention — or dropped
  entirely. The ledger carries this as an ordinary row, because the
  rule is uniform.
- **Inbound `traceparent`, honoured when present** — some clients and
  gateways send W3C trace context; honouring it stitches client-side
  retries into one request-plane trace. We advertise support; we never
  require it.
- **`server/discover` adoption** (once the SDK supports the current
  protocol revision) — which clients probe versus which use the legacy
  handshake is itself an adoption dimension, free at that point.

### 10. Named later slice — the follow tool

`agent-tools follow <error-url | release | sha | ticket>`: mechanically
walk the graph in either direction and print the trail. The largest
ease multiplier, deliberately a follow-on: it consumes the edges this
plan lands and the map it writes; building it first would be building
on unrecorded keys.

### 11. The knowledge estate for the area

**Maximum-privacy observability is an architecture area, not one
plan**, and its knowledge gets an estate shape (owner-set 2026-08-05):

- **A filesystem home**: `docs/architecture/observability/` carries the
  area index, the contract narrative, and the **field ledger**.
- **The field ledger is the contract's machine-readable form** — a
  closed, additive registry with one row per field: name, kind
  (`identifier | dimension | classification | free-text`), zone,
  systems that may carry it, allowed values or value shape, and
  sensitivity class. The capture-layer enforcement test **consumes the
  ledger**, so the contract and its enforcement cannot drift apart —
  the same recompute-not-record discipline the estate's validators
  already follow.
- **ADR frontmatter, piloted on this area**: the area's decision
  records gain machine-readable frontmatter (id, title, status, date,
  area, supersedes/amended-by), so filesystem-level organisation comes
  from metadata plus the area index rather than from forking the
  numbered ADR corpus — the numbering convention stays whole, and the
  area page enumerates its ADRs by frontmatter, never by hand-kept
  list. Retrofit of the area's existing ADRs is sequenced, not bulk;
  estate-wide adoption of the frontmatter pattern is a second-consumer
  decision for the owner once this pilot proves it.

### Build-vs-buy

Vendors ship first-party cross-links: the error-tracker ↔ deploy
integration (in use, keep); edge log-push pipelines (not adopted — no
named consumer yet; the keys land first); and an error-tracker ↔
analytics person-linking integration, which is **deliberately
rejected**: it would create the exact membrane-bypassing edge the
contract forbids. The rejection is recorded so the next reviewer meets
a position, not a gap.

## Acceptance criteria

1. **The area home exists** carrying the graph model, the three
   planes, the node roster with safe-limit notes, the zone rule, the
   membrane, the recorded residual, and the client-side contributions
   — as narrative plus the machine-readable field ledger. Proof:
   repo-safe — the documents in the PR diff; docs lint green.
2. **The capture-layer enforcement test exists, is red-first provable,
   and reads its forbidden/allowed sets from the field ledger.** Proof:
   repo-safe — the test fails when a forbidden key is injected or when
   a captured field is absent from the ledger, passes on the real
   capture surface.
3. **An error event carries the edge request id tag, and error and
   analytics events carry the deployment id.** Proof: owner-held —
   observed events recorded on MCP-504.
4. **The map page exists** with every roster node, zones, access
   routes, and the authority-decisions section, at the deployment
   layer's sensitivity limit. Proof: repo-safe — page in diff;
   owner-held — access routes verified usable once, recorded on
   MCP-504.
5. **Agent tooling can read edge analytics.** Proof: owner-held — a
   scoped read succeeds; recorded on MCP-504.
6. **The instrumentation trio is live.** Proof: owner-held — analytics
   console evidence recorded on MCP-504.

## Out of scope

- Any request-plane per-request or per-person key entering the usage
  plane — the contract's whole point.
- Any new identity linkage without a recorded privacy-governance
  decision (the membrane is the only door).
- The follow tool's implementation (named later slice above).
- Edge log-push, warehouse pipelines, dashboards — deferred until a
  named consumer exists; this plan lands their prerequisite keys.
- The Elastic vendor-side query-logging question (owned by its own
  recorded lane) and any change to retention or IP-handling settings.

## Todos

- [ ] T1: author the area home (`docs/architecture/observability/`):
      the contract narrative, the machine-readable field ledger, and
      the capture-layer enforcement test that consumes the ledger (one
      PR — the contract and its teeth land together and cannot drift).
- [ ] T1b: pilot ADR frontmatter on this area's decision records (the
      area's new ADR born with frontmatter; retrofit of existing area
      ADRs sequenced behind it).
- [ ] T2: edge-request-id forwarding + error-event tag, and the
      deployment-id tag on error and analytics events (one small app
      PR).
- [ ] T3: the observability-surfaces map page with the
      authority-decisions section (one docs PR; deployment identifiers
      per the two-layer rule).
- [ ] T4: analytics instrumentation trio (one PR on the analytics SDK
      surface).
- [ ] T5 (owner-held): provision the scoped edge-analytics credential;
      re-type the version property; record both on MCP-504.

## Relationship to siblings

Composes with, and does not duplicate: the deployment-reliability
corpus (PR #746 — boot observability and production liveness are
error-tracker-side arms), the guard operating-knowledge node
(PR #769), the free-text privacy question (MCP-468, which owns the
Elastic vendor-side answer), and the privacy-governance lane
(MCP-173), which owns the membrane's ceremony and any future linkage
decision.
