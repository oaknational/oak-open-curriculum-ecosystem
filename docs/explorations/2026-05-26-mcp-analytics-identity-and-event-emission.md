---
title: MCP Analytics — Identity Envelope, Event Emission, and Sink Routing
date: 2026-05-26
status: active
status_note: >
  Authoritative design record for the May 2026 MCP analytics session.
  Execution plan promotion is explicitly deferred until the owner
  requests it; this exploration is the single source of truth until then.
session: cursor-composer-mcp-analytics-identity-2026-05-26
linking:
  direction: outbound-only
  note: >
    This exploration links out to milestones, plans, ADRs, and sibling
    explorations. No inbound edits to plan indexes or discoverability
    surfaces until a dedicated execution plan is promoted; at promotion,
    create two-way links and update high-level observability index entries.
prospective_plan_inputs:
  - '.agent/plans/observability/current/observability-events-workspace.plan.md'
  - 'docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md'
  - 'docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md'
  - '.agent/plans/observability/future/second-backend-evaluation.plan.md'
assumptions:
  - 'DPIA in place for PostHog and Sentry (owner-confirmed for this session; not verified in-repo)'
  - 'Clerk user.deleted webhook wired to downstream person deletion'
  - "Specified 'delete my data' (DSAR) request path exists and covers observability sinks"
decisions:
  - 'Upgrade to latest MCP specification (2026-07-28) as soon as it is GA — see §11.6'
  - 'Plan owner: Jim — see §1.1'
  - 'B1: emit every tool_invoked and dependency_call; aggregation in analytics platform only — see §1.1, §10.1'
  - 'B2: expanded initial MVP = eight events (stage 1); stage 2 co-designed with data team — see §8.0'
  - 'B3: PostHog in scope; dedicated MCP PostHog project for now — see §1.1, §7.6'
  - 'B4: Clerk user ID in PostHog (certain) and Sentry (required, strongly guarded); not passed to other processors — see §7.5'
  - 'Correlation keys: correlation_id and traceparent both in schema from day 1 — see §7.2, §1.1'
  - '§11.7 privacy review gate is a plan requirement before identified production capture — see §11.7'
  - 'Warehouse owner lean: Option C — PostHog first, optional vendor-neutral adapter facade — see §7.6'
  - 'No execution plan until owner requests promotion — see §15, §18'
plan_owner: Jim
constraints:
  - 'ADR-160 (non-bypassable redaction barrier — closure principle)'
  - 'ADR-162 (observability-first; vendor independence)'
  - 'ADR-112 (stateless per-request MCP transport)'
  - 'ADR-143 (coherent structured fan-out for observability)'
---

# MCP Analytics — Identity Envelope, Event Emission, and Sink Routing

Design-space exploration synthesising a May 2026 working session on how to
count MCP tool invocations and upstream dependency calls (Oak OpenAPI,
Elasticsearch, future services such as a hypothetical Oak Knowledge Graph)
for **analytics**, without defining a host-conversation "user session" in
this repository.

This document is the **authoritative design record** for a May 2026 working
session. It records **what the codebase exposes today**, **what we propose
to emit**, **how identifiers partition across sinks**, **privacy and
compliance requirements** (§11), **milestone and plan placement** (§14),
**owner decisions** (§1.1), and **session narrative** (§20).

It is **not** an execution plan. Plan promotion is **deferred** until the
owner requests it (§15, §18). Until then, outbound links only — no inbound
edits to plan indexes.

**Quick navigation**

| Section | Contents                                                              |
| ------- | --------------------------------------------------------------------- |
| §1      | Assumptions + owner decisions (Jim, 2026-05-26)                       |
| §2–§6   | Problem, session/host findings, Clerk origin, PII, no in-repo session |
| §7–§8   | Architecture, sinks, event catalogue (Stage 1 eight events)           |
| §9–§10  | Implementation seams, operations (volume, retries, serverless)        |
| §11     | Privacy, compliance, DPIAs, production gate                           |
| §12–§13 | Deletion summary, gap vs today                                        |
| §14–§16 | Milestones/plans (outbound), linking policy, blockers status          |
| §17–§18 | Open questions, future steps (plan deferred)                          |
| §19     | References                                                            |
| §20     | Full session narrative and Q&A arc                                    |
| §21     | Session provenance (amendment log)                                    |

---

## 1. Explicit assumptions (session baseline)

The conclusions below that touch identity and downstream processing
**depend on these assumptions**. They are stated here because they are
not fully evidenced in this repository at authoring time.

| Assumption                                | Implication for this exploration                                                                                                                                                                                                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A1 — PostHog DPIA exists**              | Clerk `userId` may flow into PostHog as `distinct_id` for identified product analytics without reopening the lawful-basis question in this doc.                                                                                                                                                        |
| **A2 — Sentry DPIA exists**               | Clerk `userId` may continue to flow into Sentry per-request scope via `observability.setUser({ id: userId })` as today.                                                                                                                                                                                |
| **A3 — Clerk `user.deleted` webhook**     | Person deletion in PostHog (and other identified sinks) can be triggered when Clerk deletes a user.                                                                                                                                                                                                    |
| **A4 — DSAR / "delete my data" path**     | A user-initiated deletion request covers observability data in PostHog and Sentry, not only application databases.                                                                                                                                                                                     |
| **A5 — Analytics-only scope**             | No in-repo session store, quota enforcement, or real-time rate limiting keyed on usage counts; aggregation lives downstream.                                                                                                                                                                           |
| **A6 — Stateless MCP transport retained** | Production remains on ADR-112 per-request transport until MCP **`2026-07-28`** GA upgrade (see §11.6). Aligns with the RC direction in §3.4.                                                                                                                                                           |
| **A7 — MCP GA upgrade (decision)**        | Oak **will upgrade to the latest MCP specification as soon as it is GA** (target **`2026-07-28`**, final publication **2026-07-28** per the [release candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)). Upgrade is a tracked engineering obligation, not optional. |
| **A8 — Privacy governance in place**      | DPIAs, legal notices, processor agreements, and DSAR/deletion paths exist or will be completed **before** identified analytics events flow to PostHog/Sentry in production (see §11).                                                                                                                  |

If any assumption is false, revisit §7 (identity in PostHog), §11 (compliance), and §12 (deletion operations).

### 1.1 Owner decisions (2026-05-26 — Jim)

These decisions close the §16.3 minimum subset and are **inputs to the
execution plan** (not yet promoted). Plan owner: **Jim**.

| Topic                        | Decision                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Event volume (B1)**        | Emit **every** `tool_invoked` and **every** `dependency_call`. No in-process aggregation. Aggregation, rollups, and dashboards live in the **analytics platform** (PostHog, etc.) — outside Oak application remit.                                                                                                                                                                           |
| **MVP scope (B2)**           | **Two-stage event catalogue** (§8.0): **Stage 1 (initial MVP)** — all **eight** events, nothing deferred. **Stage 2** — final set co-designed with the **data team** in a later exploration; Stage 1 ships first.                                                                                                                                                                            |
| **PostHog (B3)**             | **In scope.** Dedicated **MCP PostHog project** for now; org-wide / cross-product project boundary **deferred to data team**.                                                                                                                                                                                                                                                                |
| **Identity projection (B4)** | **Clerk `userId` in PostHog** (`distinct_id`) — certain. **Clerk `userId` in Sentry** — required; see §7.5 (non-optional, plan-guarded). **Not passed to other services** — warehouse, Elastic, OpenAPI, and other processors do not receive Clerk ID (correlation/categorical fields only where applicable). Formal Exploration 10 ruling remains **TBD** but plan follows this projection. |
| **Correlation keys**         | **`correlation_id` and `traceparent` both in the correlation-keys contract from day 1.** `traceparent` may be empty until MCP `2026-07-28` hosts supply W3C trace context in `_meta`; field must exist in schema either way.                                                                                                                                                                 |
| **`arguments_shape` (B8)**   | **Initial defaults now** (§8.1); refinement deferred with data team / Exploration 4 alignment in Stage 2.                                                                                                                                                                                                                                                                                    |
| **Production compliance**    | **§11.7 privacy review gate** is a **hard plan requirement** before identified production capture — not optional.                                                                                                                                                                                                                                                                            |
| **Warehouse (B10)**          | **Open** — owner **lean: Option C** (§7.6): PostHog first instance, optional warehouse adapter facade for OSS reuse                                                                                                                                                                                                                                                                          |
| **Execution plan**           | **Deferred** — this exploration is the design record until Jim authorises plan promotion (§15)                                                                                                                                                                                                                                                                                               |

---

## 2. Problem statement

Product and data-science questions for the Oak Curriculum MCP server include:

- How many MCP tool calls occur over time, and by which tool?
- How many upstream dependency calls (Oak API, Elasticsearch, future
  services) does each tool drive?
- Which users (teachers) use which tools, and with what host clients
  (Cursor, ChatGPT, etc.)?

There is **no stable definition of a host "conversation session"**
exposed by consuming AI clients through MCP or MCP Apps today. This
exploration therefore **does not** propose a conversation-scoped session
ID. Instead it proposes **event-level facts** keyed by:

- **Clerk user identity** (cross-request person analytics), and
- **Ephemeral correlation ID** (within-request join of tool → N
  dependency calls).

Binning, aggregation, cohort analysis, and dashboards are **out of scope
for this repo** — consistent with
[ADR-162](../architecture/architectural-decisions/162-observability-first.md)
and the three-sink architecture in
[second-backend-evaluation.plan.md](../../.agent/plans/observability/future/second-backend-evaluation.plan.md).

---

## 3. Finding — host / AI client session IDs are not exposed

### 3.1 MCP HTTP transport (server-side)

Production creates a fresh `StreamableHTTPServerTransport` per HTTP
request with **no MCP session ID generation**:

```101:101:apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
```

This matches [ADR-112](../architecture/architectural-decisions/112-per-request-mcp-transport.md).
The MCP SDK's `RequestHandlerExtra` type includes optional `sessionId`,
but tool handlers **only consume** `extra.authInfo`, not `sessionId`:

```159:170:apps/oak-curriculum-mcp-streamable-http/src/handlers.ts
    const handler = async (params: unknown, extra: Parameters<ToolCallback>[0]) => {
      options.observability.setTag('mcp.tool_name', tool.name);
      return handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger: options.logger,
        apiKey: options.runtimeConfig.env.OAK_API_KEY,
        runtimeConfig: options.runtimeConfig,
        createAssetDownloadUrl: options.createAssetDownloadUrl,
        authInfo: extra.authInfo,
      });
    };
```

No application code reads the `mcp-session-id` HTTP header. CORS
allows that header only when `REMOTE_MCP_MODE=session` (unused in
production transport configuration); see
`apps/oak-curriculum-mcp-streamable-http/src/security.ts`.

**Conclusion:** No AI host conversation ID and no MCP transport session
ID reaches Oak application logic today.

### 3.2 MCP App widget (client-side iframe)

The widget receives `McpUiHostContext` from `@modelcontextprotocol/ext-apps`
via `app.getHostContext()` and `hostcontextchanged` events
(`apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`).

Per the ext-apps specification (`McpUiHostContext` in
`@modelcontextprotocol/ext-apps` `spec.types.d.ts`), host context includes:

| Field                                  | Semantics                                            | Used by Oak widget?  |
| -------------------------------------- | ---------------------------------------------------- | -------------------- |
| `toolInfo.id`                          | JSON-RPC ID of the **tool call**, not a chat session | No                   |
| `toolInfo.tool`                        | Tool definition (name, schemas)                      | Yes — tool name only |
| `userAgent`                            | Host application identifier string                   | No                   |
| `theme`, `styles`, `safeAreaInsets`, … | UI / environment                                     | Partially            |

There is **no** `sessionId`, `conversationId`, or `threadId` in the
standard host context. The type allows passthrough keys
(`[key: string]: unknown`), but Oak does not read custom host fields.

**Conclusion:** The MCP App layer does not expose host conversation
identity to Oak code.

### 3.3 Implication

Questions of the form _"usage within this ChatGPT thread"_ cannot be
answered from protocol data today. Cross-request analytics must use
**Clerk `userId` + time** (or a future explicit host-provided ID if
hosts add one to headers or `_meta`).

### 3.4 MCP specification direction — `2026-07-28` release candidate

**Source:** [The 2026-07-28 MCP Specification Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
(MCP blog, **2026-05-21**). Final spec targeted **2026-07-28**. This
section records protocol evolution relevant to this exploration; Oak's
implementation today targets **`2025-11-25`**-era SDK behaviour until an
explicit upgrade is planned.

**Strengthens §3 and assumption A6 — stateless protocol core**

The RC makes MCP **stateless at the protocol layer**:

- The `initialize` / `initialized` handshake is **removed** (SEP-2575).
  Client info and capabilities travel in `_meta` on each request; clients
  may call `server/discover` when they need capabilities up front.
- The **`Mcp-Session-Id` header and protocol-level session are removed**
  (SEP-2567). Any request can land on any server instance without sticky
  routing or a shared session store at the transport layer.

Oak's ADR-112 per-request transport (`sessionIdGenerator: undefined`) is
therefore aligned with where the specification is heading, not a local
workaround. The dormant `REMOTE_MCP_MODE=session` CORS path in
`security.ts` becomes **less relevant** under `2026-07-28`; it should not
be revived for analytics or session identity.

**Does not introduce a host conversation session ID**

The RC explicitly separates _protocol statelessness_ from _application
state_. Servers that need continuity across calls should mint **explicit
handles** (e.g. a `basket_id` returned from a tool) and have the model
pass them back as ordinary tool arguments — state visible to the model,
not hidden in transport metadata.

That pattern does **not** give Oak a host chat-thread identifier unless:

- a host or model chooses to pass such a handle in tool args, or
- a host places trace or client metadata in `_meta` (see below).

Neither is guaranteed or standardised for "conversation ID" today.

**W3C Trace Context in `_meta` (SEP-414) — relevant to correlation**

The RC documents W3C Trace Context propagation via `_meta` with fixed
keys: `traceparent`, `tracestate`, `baggage`. A trace starting in a host
application can, in principle, continue through the MCP client, MCP
server, and downstream dependencies into an OpenTelemetry-compatible
backend as one span tree.

**Implication for this exploration:**

| Identifier                   | Role under `2026-07-28`        | Relation to Oak proposal                                                                                                         |
| ---------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `Mcp-Session-Id`             | **Removed**                    | Not an analytics join key                                                                                                        |
| W3C `traceparent` in `_meta` | Cross-system distributed trace | Complements Oak `correlation_id` and Sentry `trace_id`; prefer **propagation** over inventing a parallel ID when hosts supply it |
| Explicit tool-arg handles    | Application-scoped state       | Optional future **categorical** log field if tools adopt handles; not a substitute for Clerk `userId` in PostHog                 |
| Client info in `_meta`       | Per-request client identity    | May augment `clerk_client_id` / host detection; not audited in Oak code today                                                    |

Oak should treat **`correlation_id`** (server-generated, per HTTP
request) as the within-invocation join key, and **`trace_id` /
`traceparent`** as the cross-service engineering join key when present.
PostHog events should carry both when available.

**MCP Apps and Tasks — unchanged conclusion for identity**

- **MCP Apps** graduate to a first-class extension (SEP-1865). Oak already
  uses `@modelcontextprotocol/ext-apps`; host context shape in §3.2
  remains the authoritative widget-side finding unless the extension
  adds conversation-scoped fields in a future revision.
- **Tasks** move out of core into an extension with a redesigned
  stateless lifecycle. Task handles are **work-unit** identifiers, not
  host conversation sessions; analytics for long-running work may later
  emit task-scoped events, but that is out of scope here.

**Logging deprecation — aligns with OTel-first observability**

Core MCP **Logging** is deprecated (SEP-2577) in favour of stderr (stdio)
and **OpenTelemetry for structured observability**. That supports the
proposed architecture: structured `tool_invoked` / `dependency_call`
events via Oak's observability stack (ADR-162, ADR-160), not MCP
`logging/message` notifications, for analytics.

**Upgrade note (decision A7)**

Adopting `2026-07-28` is a **breaking** SDK/spec migration (removed
handshake, removed session header, Tasks API changes, JSON Schema
2020-12 for tools, error code changes). Oak **will** execute this
upgrade as soon as the specification is GA — see §11.6. Analytics
emitter work should not wait on the upgrade, but transport and `_meta`
trace ingestion should be scheduled in the same programme.

---

## 4. Finding — where Clerk IDs originate

**Oak does not generate user IDs.** They are Clerk-issued identifiers
extracted at the MCP OAuth ingress edge.

Flow:

1. User authenticates via Clerk OAuth (account creation assigns a stable
   ID such as `user_…` in Clerk's user store — outside this repo).
2. MCP host sends `Authorization: Bearer <token>` on `tools/call`.
3. `createMcpAuthClerk` → `mcpAuth` → `verifyClerkToken`
   (`@clerk/mcp-tools/server`) maps Clerk auth into MCP `AuthInfo`:

   ```javascript
   // @clerk/mcp-tools/dist/server.mjs (vendor; paraphrased)
   return {
     token,
     scopes: auth.scopes,
     clientId: auth.clientId,
     extra: { userId: auth.userId },
   };
   ```

4. `req.auth` is set in `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`.
5. Consumers parse `authInfo.extra.userId` via `authInfoExtraSchema`
   (`apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/auth-info-schema.ts`).

Current consumption sites:

- **Sentry scope:** `enrichObservabilityScope` in
  `apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts` sets
  `observability.setUser({ id: userId })`.
- **Auth logging:** `checkMcpClientAuth` logs `clientId` and
  `hasUserContext` — not the raw `userId` in that log line
  (`apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.ts`).

`clientId` is the Clerk OAuth client ID (typically from dynamic client
registration for the MCP host). It identifies the **OAuth client /
host connection**, not the human directly, but is linkable to a user via
Clerk.

Upstream dependency layers (OpenAPI client, Elasticsearch,
`SearchRetrievalService`) use a **shared server-side** `OAK_API_KEY` /
cluster credentials. They do **not** receive Clerk identity unless Oak
threads request context into those call sites.

---

## 5. Finding — Clerk IDs and personal data (PII)

Legal classification is out of scope for this engineering document; the
following is the **operating posture for implementation planning**.

| Identifier                | Typical classification                                                                             | Practical handling                                                       |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **`userId` (Clerk)**      | Pseudonymous **personal data** under GDPR (re-identifiable via Clerk); treat as PII in engineering | Identified analytics; redaction barrier; deletion propagation            |
| **`clientId` (Clerk)**    | Identifier; often personal data in per-user DCR contexts                                           | Property / PostHog group; lower sensitivity than `userId` but not public |
| **`correlationId` (Oak)** | Ephemeral request key (`req_{timestamp}_{hex}`); not a person identifier                           | Safe join key; include on all events                                     |
| **Email / name**          | Direct PII                                                                                         | Not in MCP auth path today; must not appear in analytics events          |

[Exploration 10 (2026-04-19)](./2026-04-19-redaction-policy-clerk-identity-downstream.md)
frames the cross-sink policy question. **Owner direction (§1.1, §7.5):**
Clerk `userId` flows to **PostHog** (product analytics) and **Sentry**
(engineering observability) only — a **per-sink projection**, not
Exploration 10's uniform "identified all sinks" position. **Warehouse,
Elastic, OpenAPI, and other processors must not receive Clerk ID** at
the API boundary (already true for upstream) or in analytics adapter
projections intended for those sinks. Formal Exploration 10 ruling remains
**TBD**; implementation follows §7.5 until promoted.

---

## 6. Decision — no in-repo "user session" for analytics

For **analytics** (not enforcement), a host conversation session is
**not required**.

| Approach                             | Verdict for analytics                                           |
| ------------------------------------ | --------------------------------------------------------------- |
| Host conversation ID                 | Not available; defer unless hosts add explicit contract         |
| MCP transport session                | Incompatible with ADR-112; not the same as chat session         |
| OAuth token / `jti` as session       | Possible but poor fit (refresh, multi-conversation token reuse) |
| **`userId` + time windows**          | Sufficient for "usage per teacher per day/week" downstream      |
| **`correlationId` per HTTP request** | Sufficient to join one tool call to N dependency calls          |

**Repo responsibility:** emit structured events. **Downstream
responsibility:** aggregate, bin, dashboard.

---

## 7. Proposed architecture — events, identifiers, sinks

### 7.1 One-sentence model

**PostHog (and product analytics) keys on Clerk user ID; correlation ID
joins tool and dependency events within one invocation; Sentry / trace ID
supports engineering drill-down.**

```text
Request → resolve identity envelope → emit tool_invoked
       → thread envelope into SDK / ES / future clients
       → each dependency boundary emits dependency_call
       → ADR-160 redaction barrier
       → fan-out adapters (PostHog, Sentry, stdout, warehouse later)
```

### 7.2 Identifier roles

| ID                         | Role                                    | PostHog                        | Sentry / logs                         | Other processors     |
| -------------------------- | --------------------------------------- | ------------------------------ | ------------------------------------- | -------------------- |
| `clerk_user_id`            | Who (person)                            | `distinct_id` + property       | **`user.id` scope — required (§7.5)** | **Must not receive** |
| `clerk_client_id`          | Which host client                       | Property / Group               | Optional scope/tag                    | **Must not receive** |
| `correlation_id`           | Oak HTTP request / invocation fan-out   | Property                       | Tag / structured field                | Allowed (join key)   |
| `trace_id`                 | Engineering trace (OTel)                | Property                       | OTel / Sentry trace                   | Allowed              |
| `traceparent`              | W3C trace (host `_meta` when available) | Property (day 1; may be empty) | OTel / Sentry                         | Allowed              |
| `mcp_tool`                 | Which MCP tool                          | Property                       | Tag `mcp.tool_name` (today)           | Dimension            |
| `dependency` + `operation` | Which upstream call                     | Property                       | Span / structured log                 | Dimension            |

**Important:** PostHog `$session_id` (browser product concept) is
**not** the same as Oak `correlation_id`. MCP **`Mcp-Session-Id`** is
**removed** under `2026-07-28` and was never consumed by Oak application
code (§3.4). Use explicit property names (`correlation_id`,
`clerk_user_id`, `traceparent`) in schemas.

### 7.3 Sink routing (three-sink architecture)

Aligned with
[ADR-162 § History 2026-04-19](../architecture/architectural-decisions/162-observability-first.md)
and
[sentry-vs-posthog-capability-matrix](./2026-04-18-sentry-vs-posthog-capability-matrix.md)
(three-sink reframe):

| Sink                                     | Purpose                        | Identity posture (owner direction §1.1)                                          |
| ---------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------- |
| **Stdout / `@oaknational/logger`**       | Vendor-independent baseline    | Full vendor-neutral envelope; redacted values                                    |
| **Sentry (Sink 1)**                      | Engineering observability      | **`user.id` = Clerk ID — mandatory (§7.5)**; spans via `wrapMcpServerWithSentry` |
| **PostHog (Sink 3)**                     | Interactive product analytics  | `distinct_id` = Clerk ID; **dedicated MCP project** (§1.1)                       |
| **Warehouse / other adapters (Sink 2+)** | Durable or alternate analytics | **No Clerk ID** — correlation + categorical fields only; posture **open** (§7.6) |

**Do not** call `posthog.capture()` directly from MCP handlers. Emit
vendor-neutral events through `@oaknational/observability-events`
(planned) and a PostHog adapter — per
[observability-events-workspace.plan.md](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
and the planned `no-vendor-observability-import` ESLint rule.

All fan-out paths must pass [ADR-160](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
redaction before leaving the process. The **PostHog and Sentry adapters
project identity per §7.5**; other adapters must not re-introduce Clerk
ID from the envelope.

### 7.4 Overlap with Sentry today

Sentry already receives:

- Per-request span `oak.http.request.mcp` (`mcp-handler.ts`)
- MCP server auto-instrumentation via `wrapMcpServerWithSentry`
  (`core-endpoints.ts`)
- Tags `mcp.method`, `mcp.tool_name`; scope `user.id` when authed

See `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`.

**Interim product question (pre-PostHog):** the
[three-sink brief](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
notes that coarse MCP usage ("how many people, roughly for what") may be
answerable from **Sentry traces** and tool-call distribution via
`wrapMcpServerWithSentry` before PostHog lands. PostHog remains the
target for interactive product analytics (funnels, retention, HogQL).

PostHog adds a **product analytics lens** on the same underlying facts.
Both should project from the **same vendor-neutral event schemas** to
avoid drift.

### 7.5 Clerk identity in Sentry — mandatory, plan-guarded

> **OWNER DECISION — DO NOT DROP ON POSTHOG WORK**
>
> Every **authenticated** MCP request **must** continue to set Sentry
> `user.id` to the Clerk user ID (today: `observability.setUser({ id: userId })`
> in `mcp-handler.ts`). Adding PostHog capture, new event emitters, or
> refactors of the observability composition root **must not** remove,
> gate behind a feature flag without explicit owner approval, or
> “temporarily skip” this behaviour.
>
> The execution plan **must** include:
>
> 1. **Acceptance criterion** — authenticated tool calls appear in Sentry
>    with `user.id` matching Clerk `userId` on preview and production.
> 2. **Regression test or smoke check** — fails CI or deploy gate if
>    `setUser` is not invoked when `authInfo.extra.userId` is present.
> 3. **Docs callout** in `observability.md` — Sentry user identity is
>    intentional PII for engineering observability; linked to DPIA.
> 4. **Adapter ordering review** — PostHog adapter work includes explicit
>    checklist item: “Sentry `user.id` unchanged.”

PostHog and Sentry both receive Clerk ID; **other processors do not**
(§1.1). Exploration 10 formal ruling remains TBD but this per-sink
projection is the plan default.

### 7.6 Warehouse sink — open architectural question

The [three-sink brief](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
assumes Sink 2 (warehouse) before PostHog. Owner direction (2026-05-26)
questions whether a full warehouse is still needed for MCP analytics
**in the first instance**. Three coherent options for the plan to
evaluate (not yet decided):

| Option                                      | Shape                                                                                                                                                                                                                        | Pros                                                              | Cons                                                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **A. PostHog-first**                        | Sink 3 adapter lands first; no warehouse adapter in initial plan                                                                                                                                                             | Fastest path to product analytics; matches dedicated MCP project  | Departs from warehouse-first sequencing in three-sink brief                                  |
| **B. Warehouse as primary**                 | Sink 2 ingest without Clerk ID; PostHog reads from warehouse or parallel fan-out                                                                                                                                             | Durable SQL substrate; data-team friendly                         | Higher build cost before first dashboard                                                     |
| **C. Optional adapter facade (owner lean)** | **PostHog is the first concrete sink**; emit vendor-neutral events; warehouse adapter is a **thin optional facade** behind the same schemas so downstream adopters can plug BigQuery/Snowflake/etc. without forking Oak code | Reuses ADR-162 vendor independence; open-source consumers benefit | Requires discipline — no PostHog types in feature code; facade must stay real, not dead code |

**Owner lean (not final):** Option **C** — use PostHog now, keep warehouse
**optional** for reuse and data-team SQL later. Plan should not hard-code
PostHog-only emission sites; schemas + adapter interface remain the
contract. Revisit with data team during **Stage 2** event catalogue work.

### 7.7 Correlation join model (analytics platform)

Downstream analytics (PostHog, optional warehouse facade) joins events
as follows — **Oak emits facts; platforms aggregate** (§1.1, §10.1):

| Question type                                 | Join keys                                              | Example                                                         |
| --------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| Usage per teacher over time                   | `clerk_user_id` (PostHog `distinct_id`) + time         | "How many tools did user X invoke this week?"                   |
| Tool → upstream fan-out within one invocation | `correlation_id`                                       | "This `search-lessons` call made N ES `dependency_call` events" |
| Cross-service engineering trace               | `trace_id`, `traceparent` when present                 | Sentry span tree; future host `_meta` propagation               |
| Host/client breakdown                         | `clerk_client_id` property (Stage 1); Groups TBD (§17) | "Cursor vs ChatGPT share for a user"                            |
| Curriculum usage patterns                     | `curriculum.*`, `mcp_tool`, categorical only           | "Which subjects appear in tool args (presence, not values)"     |

**Both `correlation_id` and `traceparent` are schema fields from day 1**
(§1.1). Roles differ:

- **`correlation_id`** — Oak-generated, always present on MCP HTTP
  requests; primary join for `tool_invoked` ↔ `dependency_call` within
  one server invocation.
- **`traceparent`** — W3C Trace Context from MCP `_meta` when hosts
  supply it (§3.4); may be **null/empty until MCP `2026-07-28` GA** and
  host adoption; primary join for cross-system traces (host → MCP →
  downstream). Ingest from request `_meta` when available; do not
  synthesise a fake W3C value.

---

## 8. Proposed event types

### 8.0 Event catalogue — two stages (owner decision §1.1)

| Stage                         | When                              | Scope                                                                                                         | Owner                   |
| ----------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------- |
| **Stage 1 — Initial MVP**     | M3 public beta observability work | **All eight events** below — nothing deferred from this list                                                  | Engineering (Jim)       |
| **Stage 2 — Final catalogue** | After Stage 1 emitters land       | Co-exploration with **data team** — refine shapes, add/remove events, align with warehouse/PostHog dashboards | Data team + engineering |

**Stage 1 — initial eight events** (extends
[observability-events-workspace.plan.md](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
seven-event MVP with `dependency_call`):

1. `tool_invoked`
2. `dependency_call` _(new in this exploration)_
3. `search_query`
4. `feedback_submitted`
5. `auth_failure`
6. `rate_limit_triggered`
7. `widget_session_outcome`
8. `a11y_preference_tag`

Stage 2 may merge, split, or retire events; Stage 1 schemas should
version via `meta.schema_version` to allow evolution without breaking
emitters.

Extend the MVP set in
[observability-events-workspace.plan.md](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
(which already names `tool_invoked`) with **`dependency_call`**.

### 8.1 `tool_invoked`

One event per MCP tool execution (protected tools: when auth passes;
public tools: with null `clerk_user_id`).

Suggested shape (vendor-neutral; Zod schema TBD in events workspace):

```typescript
interface ToolInvokedEvent {
  event: 'tool_invoked';
  timestamp: string; // ISO-8601
  mcp_tool: string;
  outcome: 'success' | 'error';
  duration_ms?: number;
  // Identity envelope
  clerk_user_id?: string | null;
  clerk_client_id?: string | null;
  // Correlation envelope — both required in schema from day 1 (§1.1)
  correlation_id: string;
  trace_id?: string;
  traceparent?: string | null; // W3C; null/omit until MCP 2026-07-28 _meta available
  // Categorical context only — no raw argument values (ADR-160)
  arguments_shape?: Record<string, 'present' | 'absent'>;
  // Initial curriculum-axis defaults (refine in Stage 2 / Exploration 4)
  curriculum?: {
    subject?: string | null;
    key_stage?: string | null;
    year_group?: string | null;
    thread?: string | null;
    keyword?: 'present' | 'absent' | null;
  };
  environment: string;
  release?: string;
}
```

**Initial defaults (Stage 1):** emit `curriculum.*` and `arguments_shape`
when inferrable from tool args at the handler boundary — categorical /
presence only, never values. Align enums with Exploration 4 when Stage 2
runs; until then use nullable strings / presence flags as sketched above.
See also
[structured-event-schemas-for-curriculum-analytics](./2026-04-18-structured-event-schemas-for-curriculum-analytics.md).

### 8.2 `dependency_call` (new — not yet in events workspace plan)

One event per upstream IO operation:

```typescript
type DependencyKind = 'oak-api' | 'elasticsearch' | 'oak-knowledge-graph'; // hypothetical future service

interface DependencyCallEvent {
  event: 'dependency_call';
  timestamp: string;
  dependency: DependencyKind;
  operation: string; // e.g. 'getLesson', 'search.lessons', 'graph.traverse'
  mcp_tool: string; // triggering MCP tool
  outcome: 'success' | 'error';
  duration_ms?: number;
  http_status?: number; // when applicable
  // Same envelopes as tool_invoked
  clerk_user_id?: string | null;
  clerk_client_id?: string | null;
  correlation_id: string;
  trace_id?: string;
  traceparent?: string | null;
  environment: string;
  release?: string;
}
```

**Elasticsearch** must be first-class. Search tools fan out to ES
without going through the OpenAPI client; omitting ES would undercount
search-heavy tools.

**Suggested `operation` values** at `SearchRetrievalService` method
boundary (`packages/sdks/oak-curriculum-sdk/src/mcp/search-retrieval-types.ts`):

| Method                | `operation` value  |
| --------------------- | ------------------ |
| `searchLessons`       | `search.lessons`   |
| `searchUnits`         | `search.units`     |
| `searchSequences`     | `search.sequences` |
| `searchThreads`       | `search.threads`   |
| `suggest`             | `search.suggest`   |
| `fetchSequenceFacets` | `search.facets`    |

Oak API path: `operation` = upstream tool/route identifier from SDK
execution (e.g. `getLesson`, `getUnitsSummary`).

**Retry deduplication fields** (§10.1–§10.2):

```typescript
  attempt?: number;      // 1-based; default 1
  is_final?: boolean;    // true when no further retry for this operation
```

### 8.3 Event type relationships (Stage 1)

| Event                        | Emits when                                    | Overlap / distinction                                                                                                                                                                                          |
| ---------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`tool_invoked`**           | MCP tool handler completes                    | One per tool call; parent of N `dependency_call` rows sharing `correlation_id`                                                                                                                                 |
| **`dependency_call`**        | Each upstream IO completes                    | Counts Oak API / ES / future KG calls; **does not** carry search query text                                                                                                                                    |
| **`search_query`**           | Search path chooses to record query semantics | Zero-hit telemetry, query categorisation — see [`search-observability.plan.md`](../../.agent/plans/observability/current/search-observability.plan.md); **complements** `dependency_call`, does not replace it |
| **`auth_failure`**           | Clerk trust boundary rejects auth             | Security axis                                                                                                                                                                                                  |
| **`rate_limit_triggered`**   | Rate limit enforced                           | Security axis                                                                                                                                                                                                  |
| **`feedback_submitted`**     | User feedback captured                        | Usability axis; deferred widget/L-9 dependencies                                                                                                                                                               |
| **`widget_session_outcome`** | MCP App widget session ends                   | Usability/a11y; server-side proposal does not cover iframe today (§10.5)                                                                                                                                       |
| **`a11y_preference_tag`**    | Accessibility preference observed             | Accessibility axis                                                                                                                                                                                             |

Stage 1 ships **schemas + conformance** for all eight; not every emitter
may land in the same PR — but none are deferred from the catalogue.

### 8.4 PostHog projection (adapter layer)

Under assumptions A1 and A4:

```typescript
posthog.capture({
  distinctId: event.clerk_user_id ?? '$anonymous_mcp_public_tool',
  event: event.event, // 'tool_invoked' | 'dependency_call'
  properties: {
    correlation_id: event.correlation_id,
    trace_id: event.trace_id,
    traceparent: event.traceparent ?? null,
    clerk_client_id: event.clerk_client_id,
    mcp_tool: event.mcp_tool,
    dependency: event.dependency, // dependency_call only
    operation: event.operation, // dependency_call only
    outcome: event.outcome,
    duration_ms: event.duration_ms,
    environment: event.environment,
    release: event.release,
  },
});
```

Public-tool invocations (`get-rate-limit`, `get-changelog`, etc. per
[mcp-security-policy.ts](../../packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts))
must not attach real Clerk IDs to anonymous traffic. Use a dedicated
anonymous distinct-id strategy documented in the PostHog project.

---

## 9. Implementation seams (where to emit)

### 9.1 Resolve identity envelope once per HTTP request

**Primary site:** `createMcpHandler` / tool handler entry in
`handlers.ts`, where `extra.authInfo` and `tool.name` are both available.

Envelope:

```typescript
interface AnalyticsEnvelope {
  clerk_user_id: string | undefined;
  clerk_client_id: string | undefined;
  correlation_id: string; // from res.locals — see correlation/index.ts
  trace_id: string | undefined;
  traceparent: string | null | undefined; // from MCP _meta when present
  mcp_tool: string;
  environment: string;
  release: string | undefined;
}
```

`correlation_id` is generated per request in
`apps/oak-curriculum-mcp-streamable-http/src/correlation/index.ts`
(format `req_{timestamp}_{randomHex}`).

### 9.2 Emit `tool_invoked`

At completion of `handleToolWithAuthInterception`
(`tool-handler-with-auth.ts`) or immediately after in the handler
wrapper — after outcome is known.

### 9.3 Emit `dependency_call` — thread envelope downstream

Today upstream calls do not receive user context:

- OpenAPI: `createDefaultRequestExecutor` → `executeToolCall`
  (`tool-executor-factory.ts`) uses shared `OAK_API_KEY`.
- Elasticsearch: `SearchRetrievalService` created at bootstrap
  (`core-endpoints.ts`).

**Required change:** pass `AnalyticsEnvelope` (or a narrow callback
`onDependencyCall`) into:

1. `createDefaultRequestExecutor` / SDK `executeToolCall` path (Oak API)
2. `SearchRetrievalService` query methods (Elasticsearch)
3. Any future client (e.g. Knowledge Graph)

SDK debug logs such as `mcp-tool.search.execute` exist in
`packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-*/execution.ts`
but do **not** carry Clerk identity today.

### 9.4 Redaction and schema conformance

Emit through:

1. Zod-validated vendor-neutral schema (`@oaknational/observability-events`)
2. Shared redaction barrier (`packages/libs/sentry-node/`, ADR-160)
3. Sink adapters (PostHog, Sentry structured event, stdout)

Values in tool arguments must not appear in events — categorical
presence only (`arguments_shape`), per events workspace design
principles.

---

## 10. Operational considerations

### 10.1 Event volume

**Owner decision (§1.1):** emit **every** `tool_invoked` and **every**
`dependency_call`. Do **not** aggregate in Oak (no rollups on
`tool_invoked`, no sampling at the emitter). Aggregation lives in
PostHog / the analytics platform.

One MCP tool call may produce **many** `dependency_call` events.
That is expected; product analytics owns downsampling, materialized
views, and cost control downstream.

**Observed fan-out (current tools, 2026-05-26 codebase review):**

| MCP tool pattern                             | Typical `dependency_call` count per `tool_invoked` | Notes                                                                                              |
| -------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Single-scope search (`search-lessons`, etc.) | **1** ES call                                      | One `SearchRetrievalService` method                                                                |
| `explore-topic`                              | **3** ES calls                                     | Parallel `searchLessons` + `searchUnits` + `searchThreads` — see `aggregated-explore/execution.ts` |
| Oak API fetch tools                          | **1+** per upstream HTTP call                      | Via `executeToolCall` / OpenAPI client                                                             |
| Future multi-step tools                      | **N**                                              | Emit all; aggregate downstream                                                                     |

**Still required in Oak:**

| Concern                           | Mitigation                                                                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Retries double-counting (ADR-070) | `attempt` / `is_final` on `dependency_call` (and optionally `tool_invoked`) so analytics can dedupe                              |
| PostHog cost visibility           | Monitor event volume in dedicated MCP project; Stage 2 with data team revisits if needed — not a reason to drop events at source |

Search tools remain the highest fan-out source; this is accepted under B1.

### 10.2 Retries and duplicate counting

SDK retry on 429/503 (`ADR-070`) may double-count unless events include
`attempt` / `is_final` or analytics dedupes on
`(correlation_id, dependency, operation, attempt)`.

### 10.3 Serverless flush (Vercel)

PostHog Node SDK capture is asynchronous. Ensure flush on MCP request
cleanup (`registerCleanupHandler` in `mcp-handler.ts`) or use batch
mode with short intervals — otherwise events may be lost on cold
invocation teardown.

### 10.4 Environment separation

Tag `environment` on every event; filter preview/dev/stub traffic in
PostHog dashboards. Stub mode (`useStubTools`) should be visually and
analytically separable.

### 10.5 Widget gap

Server-side PostHog capture covers MCP tool / dependency analytics only.
MCP App widget interactions (iframe) are not covered unless a separate
browser PostHog integration shares the same Clerk `distinct_id`. Out of
scope for this exploration's server-side proposal.

---

## 11. Privacy, compliance, and data minimisation

This section records **requirements and best practice** for the analytics
architecture in this exploration. It is an engineering-facing compliance
checklist; **legal sign-off** (DPO, privacy counsel) remains authoritative.

**Organisational commitment (session direction):** Oak respects privacy
and will **only measure what is necessary** to improve the product for
end users. Analytics events must be **proportionate**, **documented**,
and **deletable**.

### 11.1 Alignment with Oak's public privacy commitments

Oak's [Privacy policy](https://www.thenational.academy/legal/privacy-policy)
(updated **2 April 2026** in the copy reviewed for this exploration)
states commitments that directly constrain MCP analytics design:

| Oak commitment                                                               | Engineering implication for MCP analytics                                                                                      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **We only use your data to provide services and to improve your experience** | `tool_invoked` / `dependency_call` events serve product improvement only — not marketing, profiling, or resale                 |
| **We will never sell your personal data**                                    | No third-party data brokers; PostHog/Sentry remain processors under contract                                                   |
| **We minimise data collected**                                               | No tool argument **values**, no search query **text**, no lesson content in events — categorical metadata only (§8.1, ADR-160) |
| **We only keep data as long as needed**                                      | Retention limits per sink documented in DPIAs and §11.5                                                                        |
| **Transparency and control**                                                 | Privacy notice and (where applicable) cookie notice must describe MCP analytics processing before production launch            |

The [Cookie policy](https://www.thenational.academy/legal/cookie-policy)
(updated **3 December 2024**) lists **PostHog** under optional
**Statistics cookies** (bug fixing, usage improvement, IP/device/browser
metadata). **Clerk** cookies are **strictly necessary** for
authentication. **Cloudflare** is listed for security.

**Gap to close (legal, not engineering):** the privacy policy scope
includes `open-api.thenational.academy` but **does not yet explicitly
name** the Curriculum MCP HTTP service endpoint or third-party MCP host
clients (Cursor, ChatGPT, etc.) as a distinct processing context.
Before production analytics launch, legal notices should be updated to
cover:

- what the MCP server collects (Clerk ID, tool usage metadata, technical
  diagnostics);
- which processors receive it (see §11.2);
- lawful basis and retention;
- how teachers exercise deletion/access rights.

### 11.2 DPIA and processor register — third parties in the MCP analytics path

**Requirement:** A **Data Protection Impact Assessment (DPIA)** must
exist (or be updated) for **each third-party service that receives
personal data** from MCP analytics or auth flows. Processor agreements
(GDPR Art. 28) must be in place before production processing.

The table below lists services **in the MCP server estate** relevant to
this exploration. PII relevance indicates whether Clerk-linked
identifiers or other personal data may flow to the service when analytics
is enabled. Status is **engineering assessment** — confirm against your
DPIA register.

| Service                                            | Role in MCP estate                                | Personal data that may flow                                                                                                                    | PII-relevant?                                                   | DPIA required before identified analytics?                                                                                                                                                                 |
| -------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Clerk](https://clerk.com/)**                    | OAuth authentication; issues `userId`, `clientId` | Account identifiers, auth tokens (ingress only; tokens must not appear in analytics events)                                                    | **Yes**                                                         | **Yes** — auth processor; already named in [privacy policy §6](https://www.thenational.academy/legal/privacy-policy)                                                                                       |
| **[PostHog](https://posthog.com/)**                | Product analytics (Sink 3, planned)               | Clerk `userId` as `distinct_id`; usage metadata                                                                                                | **Yes**                                                         | **Yes** — session assumption A1; listed in [privacy policy §6](https://www.thenational.academy/legal/privacy-policy) and [cookie policy](https://www.thenational.academy/legal/cookie-policy) (statistics) |
| **[Sentry](https://sentry.io/)**                   | Engineering observability (Sink 1, active)        | Clerk `userId` on scope (`de.sentry.io` EU — see [observability.md](../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md))      | **Yes**                                                         | **Yes** — session assumption A2; privacy policy lists Sentry for Labs; **confirm MCP project scope in DPIA**                                                                                               |
| **[Elastic Cloud](https://www.elastic.co/cloud/)** | Semantic search backing MCP search tools          | Query text **must not** be logged to analytics; ES cluster receives **no Clerk ID** from MCP; `dependency_call` metadata only in Oak telemetry | **Indirect** — search processor; not an analytics identity sink | **Yes** for search processing; analytics stay metadata-only                                                                                                                                                |
| **[Vercel](https://vercel.com/)**                  | Hosts MCP HTTP server                             | Infrastructure logs, IP addresses at edge                                                                                                      | **Yes** (infrastructure)                                        | **Yes** — hosting processor; listed in privacy policy §6                                                                                                                                                   |
| **[Cloudflare](https://www.cloudflare.com/)**      | CDN / security (per deployment architecture)      | IP, request metadata at edge                                                                                                                   | **Yes** (infrastructure)                                        | **Yes** — listed in privacy policy §6 and cookie policy                                                                                                                                                    |
| **Oak OpenAPI** (`open-api.thenational.academy`)   | Upstream curriculum API                           | Server-side API key; no Clerk ID sent upstream today                                                                                           | **No** at API boundary                                          | API usage DPIA may exist separately; MCP analytics counts are Oak-internal                                                                                                                                 |
| **Google Fonts** (widget CSP)                      | MCP App widget typography                         | Browser fetch to Google; no Clerk ID in font request                                                                                           | **Low**                                                         | Confirm against widget privacy assessment                                                                                                                                                                  |
| **Hypothetical Oak Knowledge Graph**               | Future dependency                                 | TBD                                                                                                                                            | **TBD**                                                         | **New DPIA before connection**                                                                                                                                                                             |

**Processors in Oak's wider programme** (Hex, dbt, GCP warehouse, HubSpot,
etc.) may receive analytics **without Clerk ID** if the optional warehouse
facade (§7.6 Option C) is used — correlation and categorical fields only.
If a future pipeline joins Clerk ID from PostHog export, that is a
**downstream data-team choice**, not an Oak emitter default.

**Action:** Maintain DPIA rows for **PostHog and Sentry** (identified)
and infrastructure processors before identified production capture.
Warehouse facade, if built, uses **stripped identity projection** per §7.5.

### 11.3 Lawful basis and purpose limitation

**Purpose:** Improve the Curriculum MCP product for teachers —
understanding which tools are used, which upstream dependencies are
stressed, and where reliability or curriculum coverage gaps exist.

**Lawful basis (to be confirmed in DPIA, typical framing):**

- **Legitimate interest** — product improvement for authenticated
  teachers using a professional tool; balanced against privacy with
  minimisation and deletion rights.
- **Contract** — where analytics is necessary to deliver the authenticated
  MCP service the user signed up for (narrower scope).

**Not in scope:**

- Pupil-facing analytics (MCP and AI tools are for **teachers and
  education professionals**, not pupils — per [privacy policy §3 AI
  tool](https://www.thenational.academy/legal/privacy-policy)).
- Advertising, sale of data, or cross-context behavioural advertising.
- Host conversation content, tool inputs, or search query text.

### 11.4 Technical privacy controls (mandatory before production)

These are **engineering obligations** supporting compliance:

1. **Data minimisation in event schemas** — only fields in §8.1 / §8.2;
   `arguments_shape` records presence of categories, never values.
2. **ADR-160 redaction barrier** — every sink fan-out path applies shared
   redaction before transmission ([ADR-160](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)).
3. **No secrets in telemetry** — OAuth tokens, API keys, ES credentials
   never in events or logs (existing header redaction in
   `header-redaction.ts`).
4. **Identified vs anonymous** — public MCP tools (`get-rate-limit`, etc.)
   emit events **without** Clerk ID (§8.3).
5. **Environment separation** — preview/dev/stub traffic excluded from
   production analytics dashboards (§10.4).
6. **Vendor-neutral emission** — schemas in `@oaknational/observability-events`;
   PostHog/Sentry are projections, not ad-hoc capture (§7.3).
7. **Retention configuration** — PostHog and Sentry project retention
   aligned with privacy policy retention principles (account-related
   analytics should not outlive account deletion without justification).

### 11.5 Legal notices, transparency, and data-subject rights

**Before production analytics launch:**

| Requirement                           | Owner             | Notes                                                                                                                                                                              |
| ------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Privacy policy update**             | Legal / DPO       | Name MCP service, data categories, processors, lawful basis, retention, rights                                                                                                     |
| **Cookie policy**                     | Legal / DPO       | Server-side PostHog may not set browser cookies; confirm whether any MCP-facing web UI needs cookie-banner alignment                                                               |
| **Terms / AI experiments disclosure** | Legal / Product   | If MCP is offered under AI experiments or labs, align with existing AI tool disclosures                                                                                            |
| **DPIA sign-off**                     | DPO               | Per §11.2 register                                                                                                                                                                 |
| **Processor agreements**              | Legal             | Art. 28 GDPR for PostHog, Sentry, Clerk, Vercel, Elastic, Cloudflare as applicable                                                                                                 |
| **International transfers**           | Legal             | Confirm PostHog and Sentry data regions (Sentry EU documented; PostHog project region must match DPIA) — [privacy policy §7](https://www.thenational.academy/legal/privacy-policy) |
| **DSAR / deletion runbook**           | Engineering + DPO | Assumptions A3–A4                                                                                                                                                                  |

**Operational deletion (under A3–A4):**

| Trigger                      | Action                                                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clerk `user.deleted` webhook | Delete or anonymise PostHog person for `distinct_id = clerk_user_id`; Sentry user data deletion per vendor process                                          |
| DSAR / "delete my data"      | PostHog person delete + Sentry user purge for **identified sinks**; warehouse rows without Clerk ID use correlation-only deletion policy TBD with data team |
| Public-tool anonymous events | No Clerk ID stored; deletion N/A                                                                                                                            |

Document PostHog project(s) and Sentry org/project for MCP (`oak-open-curriculum-mcp` per [observability.md](../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md)).

Oak's privacy policy references a **User Guide for DPIA** on the platform
— MCP analytics should be added to that guide when emitters land.

### 11.6 MCP specification upgrade (decision A7)

Oak **will adopt MCP `2026-07-28` as soon as it is generally available**
(final target **2026-07-28** per [MCP blog RC](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)).

Upgrade programme should include:

- SDK and transport migration (stateless request shape, removed session header)
- Ingest W3C Trace Context from `_meta` when hosts supply it (SEP-414)
- Retire dead `REMOTE_MCP_MODE=session` assumptions in CORS and docs
- Conformance tests against GA spec
- Privacy review unchanged — upgrade does not expand personal data collected

Analytics emitter work (**`tool_invoked`**, **`dependency_call`**) may
proceed in parallel; trace-context enrichment follows GA upgrade.

### 11.7 Privacy review gate (required)

**Owner decision (§1.1):** this gate is a **hard requirement** before
identified **production** PostHog capture (engineering may build and test
adapters in preview before the gate clears).

Do **not** enable identified PostHog production capture until:

- [ ] DPIAs current for all §11.2 PII-relevant services used
- [ ] Privacy policy (and cookie policy if needed) updated for MCP analytics
- [ ] DSAR/deletion runbook tested for PostHog + Sentry MCP projects
- [ ] Event schemas reviewed for minimisation (no query text, no tool args)
- [ ] DPO sign-off recorded

---

## 12. Deletion and data-subject rights (summary)

See §11.5 for the operational deletion table. Exploration 10 remains the
canonical cross-sink **policy** document for Clerk identity downstream;
assumptions A1–A4 and §11 subsume the session-specific deletion posture
for PostHog and Sentry under DPIA governance.

---

## 13. What exists today vs gap

| Capability                         | Status at authoring (2026-05-26)          |
| ---------------------------------- | ----------------------------------------- |
| Clerk `userId` on Sentry scope     | **Exists** — `mcp-handler.ts`             |
| `mcp.tool_name` Sentry tag         | **Exists** — `handlers.ts`                |
| Per-request `correlationId`        | **Exists** — correlation middleware       |
| Structured `tool_invoked` event    | **Planned** — events workspace not landed |
| Structured `dependency_call` event | **Not planned yet** — propose adding      |
| PostHog server capture             | **Not wired** — Sink 3 adapter planned    |
| Identity on upstream/ES calls      | **Missing** — requires envelope threading |
| Host conversation session ID       | **Not available** — see §3                |

See also
[what-the-system-emits-today.md](../../.agent/plans/observability/what-the-system-emits-today.md)
(Product axis: `tool_invoked` marked ✗).

---

## 14. Milestone and plan landscape (outbound links)

This section maps this exploration onto the repo's **milestone ladder**
and **observability plan stack**. Links are **outbound from this report
only** — see §15 for discoverability policy.

Strategic milestone index:
[`.agent/milestones/README.md`](../../.agent/milestones/README.md).
Observability execution index:
[`.agent/plans/observability/high-level-observability-plan.md`](../../.agent/plans/observability/high-level-observability-plan.md).

### 14.1 Milestone placement

Milestones are strategic gates; plans are execution. Most of this
exploration's **implementation** lands at **M3 (public beta)**, with a
thin **M2 (open public alpha)** overlap on engineering observability only.

| Milestone                 | Status (2026-05-26) | What this exploration touches                                                                                                                                                                                                                                                                                                                                        | What it does not block                                                                                                                                 |
| ------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **M0** Open private alpha | ✅ Complete         | —                                                                                                                                                                                                                                                                                                                                                                    | —                                                                                                                                                      |
| **M1** Invite-only alpha  | ✅ Complete         | Clerk `userId` on Sentry scope already exists (§13)                                                                                                                                                                                                                                                                                                                  | —                                                                                                                                                      |
| **M2** Open public alpha  | **Next**            | **Engineering axis**: Sentry + OTel foundation via [`sentry-observability-maximisation-mcp.plan.md`](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md) (L-1, L-3, release linkage). M2 gate includes deny-by-default MCP telemetry capture — see [`m2-extension-surfaces.md`](../../.agent/milestones/m2-extension-surfaces.md) | Does **not** require `observability-events` workspace, PostHog, or `dependency_call`                                                                   |
| **M3** Public beta        | Planned             | **Product axis**: structured `tool_invoked`, proposed `dependency_call`, events workspace, multi-sink conformance, §11 compliance gate, legal notices                                                                                                                                                                                                                | Prod Clerk, alerting, exemplar UI are separate M3 gates — see [`m3-tech-debt-and-hardening.md`](../../.agent/milestones/m3-tech-debt-and-hardening.md) |

The events workspace plan records that the schema contract **blocks
public beta, not public alpha**:

> _"we absolutely must create the events workspace, but it does not
> necessarily need to block public alpha, it absolutely does block public
> beta."_
> — [`observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md) § Release-gate posture

**Sequencing summary:** M2 ships **diagnostic Sentry**; M3 ships
**schema-governed product analytics** — which is where this exploration's
emitter work belongs.

### 14.2 Plan stack — relationships and outbound links

| Surface                                       | Relationship to this exploration                                                                                                                   | Outbound link                                                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Primary execution home (prospective)**      | Would extend MVP schema set with `dependency_call`; land `tool_invoked` emission and `AnalyticsEnvelope` threading                                 | [`observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md)                         |
| **Schema shape parent**                       | Defines `tool_invoked` and `search_query` for data scientists; this exploration adds `dependency_call` and the identity join model                 | [`2026-04-18-structured-event-schemas-for-curriculum-analytics.md`](./2026-04-18-structured-event-schemas-for-curriculum-analytics.md)              |
| **Identity / redaction policy parent**        | Stub for formal per-sink Clerk identity ruling; §11 operationalises compliance; exploration 10 remains canonical **policy** until promoted         | [`2026-04-19-redaction-policy-clerk-identity-downstream.md`](./2026-04-19-redaction-policy-clerk-identity-downstream.md)                            |
| **Three-sink architecture**                   | Sentry → warehouse → PostHog order in brief                                                                                                        | **Tension:** owner lean PostHog-first + optional facade (§7.6); PostHog in scope; §11.7 gates production                                            | [`second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md) |
| **Engineering observability (parallel axis)** | L-3 `mcp_request` scope feeds attribution; does not emit schema-governed product events. Alpha-gate (M2) vs beta-gate (M3) split                   | [`sentry-observability-maximisation-mcp.plan.md`](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md)            |
| **Search path instrumentation**               | ES request instrumentation overlaps `dependency_call` for `elasticsearch`; zero-hit integration is separate (`search_query`)                       | [`search-observability.plan.md`](../../.agent/plans/observability/current/search-observability.plan.md)                                             |
| **Vendor-independence proof**                 | Vendor-neutral schemas + sink adapters (§7.3) is ADR-162 mechanisms #3–#5; Wave 5 pre-launch (M3)                                                  | [`multi-sink-vendor-independence-conformance.plan.md`](../../.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md) |
| **Observability index**                       | Product-axis launch criterion ("what is used most/least…") is **what** this exploration specifies **how** to achieve for MCP; not yet indexed here | [`high-level-observability-plan.md`](../../.agent/plans/observability/high-level-observability-plan.md)                                             |
| **Security axis events**                      | Orthogonal MVP events (`auth_failure`, `rate_limit_triggered`); same events workspace, different emitters                                          | [`security-observability.plan.md`](../../.agent/plans/observability/current/security-observability.plan.md)                                         |
| **Cross-system tracing (future)**             | W3C `traceparent` from MCP `2026-07-28` RC; complements `correlation_id`                                                                           | [`cross-system-correlated-tracing.plan.md`](../../.agent/plans/observability/future/cross-system-correlated-tracing.plan.md)                        |
| **MCP runtime canonicalisation (future)**     | Deploy/runtime shape — **separate** from MCP spec GA upgrade (decision A7, §11.6)                                                                  | [`mcp-http-runtime-canonicalisation.plan.md`](../../.agent/plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)                    |
| **Security and privacy programme**            | §11 DPIAs, legal notices, Cloudflare rate limiting align with M3 gates                                                                             | [`security-and-privacy/README.md`](../../.agent/plans/security-and-privacy/README.md)                                                               |
| **Emission inventory**                        | Product axis `tool_invoked` marked ✗ at authoring                                                                                                  | [`what-the-system-emits-today.md`](../../.agent/plans/observability/what-the-system-emits-today.md)                                                 |

### 14.3 Execution waves (observability MVP)

Cross-plan wave order from the
[high-level observability plan § Execution Waves](../../.agent/plans/observability/high-level-observability-plan.md#execution-waves--cross-plan-mvp-order):

| Wave                                       | Milestone gate    | This exploration's relevance                                                      |
| ------------------------------------------ | ----------------- | --------------------------------------------------------------------------------- |
| **1** Gates & foundation                   | M2 prep           | No change — compile-time gates, release linkage                                   |
| **2** Schema foundation                    | M3 beta blocker   | **Amend** for `dependency_call` + correlation-keys envelope when plan is promoted |
| **3a** Alpha emitters (schema-independent) | **M2**            | Sentry L-1/L-3 — engineering axis only                                            |
| **3b** Beta emitters (schema-dependent)    | **M3**            | `tool_invoked` emission + metrics adapter (L-4b)                                  |
| **4** Cross-axis                           | **M3**            | Security/a11y sibling plans; widget gap (§10.5)                                   |
| **5** Conformance + close-out              | **M3 pre-launch** | Multi-sink conformance; §11.7 privacy gate before identified PostHog              |

### 14.4 Decisions this exploration adds vs existing plan posture

| Topic                        | Existing plan posture                        | This exploration                                                           |
| ---------------------------- | -------------------------------------------- | -------------------------------------------------------------------------- |
| Host conversation session ID | Not discussed elsewhere                      | **Explicit: not available; do not invent in-repo** (§3)                    |
| Upstream call counting       | `search_query` in events workspace only      | Proposes **`dependency_call`** for oak-api, ES, future KG (§8.2)           |
| PostHog timing               | Post-beta; named-question promotion trigger  | **In scope** for plan; dedicated MCP project; §11.7 gates production       |
| Clerk ID in analytics        | Exploration 10 open                          | PostHog + Sentry only; not other processors (§7.5); Exploration 10 TBD     |
| MCP protocol upgrade         | Runtime canonicalisation plan (deploy shape) | **Decision A7:** adopt MCP `2026-07-28` at GA (§11.6) — protocol/SDK track |
| Legal / compliance           | Implicit in exploration 10                   | **§11** full checklist (DPIAs, notices, minimisation)                      |

### 14.5 When an execution plan is promoted (deferred)

**Status (2026-05-26):** owner decisions in §1.1 are sufficient inputs
for a decision-complete plan **when requested**. Jim has **not** asked
for a plan file yet — this exploration remains the sole design record.

When promotion happens, the plan should (for reference only):

1. Expand events workspace to **Stage 1 eight events** (§8.0).
2. Define `AnalyticsEnvelope` threading and emitter workstreams.
3. **PostHog-first with optional warehouse facade** (owner lean §7.6 Option C).
4. Encode **§7.5 Sentry identity guards** (acceptance tests, checklist).
5. Gate **identified production capture** on §11.7.
6. Schedule **Stage 2** data-team exploration for final event catalogue.
7. Schedule MCP **`2026-07-28` GA upgrade** as sibling track (decision A7).

Until then: **outbound links only** (§15).

---

## 15. Linking and discoverability policy

**Current state (2026-05-26):** no dedicated execution plan exists for
MCP product analytics emission. This exploration is the design record.

| Link direction                              | Policy                                                                                                                                                                                                                                 |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Outbound (this report → other surfaces)** | **Active.** §14, §16, and §19 link to milestones, plans, ADRs, sibling explorations, and code anchors.                                                                                                                                 |
| **Inbound (other surfaces → this report)**  | **Deferred.** Do not edit `high-level-observability-plan.md` Product-axis exploration list, `observability-events-workspace.plan.md` `blocked_on` / schema catalogue, or plan frontmatter `informs` fields until a plan is promoted.   |
| **Two-way links at plan promotion**         | When an execution plan lands: add reciprocal `informs` / `derived_from` / exploration index entries; update high-level observability plan Product-axis row; amend events workspace todos; add row to `what-the-system-emits-today.md`. |

Frontmatter field `prospective_plan_inputs` names surfaces this exploration
**will inform** at promotion — not surfaces that already reference back.

---

## 16. Blockers to a decision-complete plan

### 16.1 Status summary (2026-05-26)

**Plan owner:** Jim. **Execution plan:** explicitly **deferred** — this
exploration is the complete design record until Jim requests promotion
(§15). Core forks closed in §1.1. Remaining items are **production gates**
(compliance), **open explorations** (warehouse Option C confirmation,
Stage 2 catalogue), or **implementation** (future).

### 16.2 Resolved blockers

| ID      | Resolution                                                                                                            |
| ------- | --------------------------------------------------------------------------------------------------------------------- |
| **B1**  | Emit **all** events; aggregation in analytics platform only (§10.1)                                                   |
| **B2**  | **Stage 1:** all eight events; nothing deferred (§8.0)                                                                |
| **B3**  | PostHog **in scope**; dedicated MCP project for now (§1.1)                                                            |
| **B4**  | **Direction set:** Clerk ID → PostHog + Sentry; **not** other processors (§7.5). Exploration 10 formal ruling **TBD** |
| **B8**  | **Initial defaults** in §8.1; Stage 2 / data team refines                                                             |
| **B9**  | **`correlation_id` + `traceparent` both day 1**; `traceparent` may be empty pre–MCP GA (§1.1)                         |
| **B12** | **Dedicated MCP PostHog project** for now; org-wide boundary → data team                                              |
| **B15** | **Jim**                                                                                                               |

### 16.3 Open items (plan gates and follow-ups — do not block plan draft)

| ID                 | Item                                               | Plan treatment                                                                                                     |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **B5–B7**          | Legal notices, DPIA verification, DSAR runbook     | **§11.7 hard gate** before identified **production** capture; engineering may build adapters earlier in M3 preview |
| **B10**            | Warehouse vs PostHog-first vs optional facade      | **Open** — owner lean Option C (§7.6); plan documents choice and adapter interface                                 |
| **B11**            | PostHog Groups for `clientId`                      | Defer; property-only `clerk_client_id` at Stage 1                                                                  |
| **B13**            | MCP `2026-07-28` GA upgrade execution plan         | Sibling workstream in plan; decision A7 committed                                                                  |
| **B14**            | Search-observability vs `dependency_call` boundary | Plan workstream: single ES boundary shape                                                                          |
| **Exploration 10** | Formal redaction-policy ruling                     | Plan uses §7.5 projection; backfill Exploration 10 in parallel                                                     |
| **Stage 2**        | Final event catalogue with data team               | Scheduled exploration after Stage 1 emitters land                                                                  |

### 16.4 Metacognition — plan promotion bridge

**Impact:** product analytics for MCP without host session fiction; privacy
by minimisation; reusable vendor-neutral emission for open-source consumers.

**What changed with owner decisions:** aggregation moved **out** of Oak;
MVP scope **expanded** to eight events; identity **split by sink**
(PostHog + Sentry only); warehouse demoted from load-bearing to **optional
facade** (lean). The three-sink brief's warehouse-first ordering is now
a **tension to resolve in the plan**, not an inherited constraint.

**Bridge to future plan (when requested):** encode §1.1, §7.5 guards,
§8.0 Stage 1, and §11.7 as load-bearing sections; default §7.6 Option C
unless Jim chooses A or B at author time. **No plan file until then.**

---

## 17. Open questions (remaining)

1. **Warehouse posture (B10)** — confirm Option A, B, or C (§7.6) at plan author time; lean is **C** (PostHog now, optional warehouse facade).
2. **PostHog Groups for `clientId` (B11)** — host/client breakdown via Groups vs property-only at Stage 1.
3. **Exploration 10 formal ruling** — backfill policy doc to match §7.5 per-sink projection.
4. **Privacy notice wording (B5)** — MCP service URL and host-client disclosure (legal owner).
5. **Sentry DPIA scope (B6)** — confirm MCP `oak-open-curriculum-mcp` project covered.
6. **Stage 2 event catalogue** — data-team co-exploration after Stage 1 emitters land.
7. **PostHog project boundary (B12 follow-up)** — dedicated MCP project vs org-wide (data team).
8. **`2026-07-28` SDK upgrade (B13)** — sequencing relative to analytics emitters.
9. **Search-observability coordination (B14)** — single ES `dependency_call` boundary with search plan.

**Closed in §1.1:** event volume, eight-event Stage 1 MVP, PostHog in scope,
Sentry identity guards, correlation_id + traceparent day 1, initial
`arguments_shape` / curriculum defaults, §11.7 production gate.

---

## 18. Future steps (plan deferred)

**Owner direction (2026-05-26):** do **not** write an execution plan yet.
This exploration is the consolidated session record.

When Jim later authorises plan promotion:

1. Author execution plan using §1.1, §7–§8, §11, §14.5 as inputs.
2. Create two-way links per §15.
3. Implement per §9 — no plan required to begin reading this doc.

**No implementation commits** were made during exploration authoring.

---

## 19. References

### Milestones and plans (outbound)

- [Milestones index](../../.agent/milestones/README.md)
- [M2 — Open public alpha](../../.agent/milestones/m2-extension-surfaces.md)
- [M3 — Public beta](../../.agent/milestones/m3-tech-debt-and-hardening.md)
- [High-level observability plan](../../.agent/plans/observability/high-level-observability-plan.md)
- [Observability events workspace (prospective primary plan)](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
- [Sentry observability maximisation — MCP](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
- [Three-sink architecture (warehouse + PostHog)](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
- [Multi-sink vendor-independence conformance](../../.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md)
- [Search observability](../../.agent/plans/observability/current/search-observability.plan.md)
- [Security observability](../../.agent/plans/observability/current/security-observability.plan.md)
- [Cross-system correlated tracing (future)](../../.agent/plans/observability/future/cross-system-correlated-tracing.plan.md)
- [MCP HTTP runtime canonicalisation (future)](../../.agent/plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
- [Security and privacy programme](../../.agent/plans/security-and-privacy/README.md)

### In-repo — ADRs and explorations

- [ADR-112 — Per-request MCP transport](../architecture/architectural-decisions/112-per-request-mcp-transport.md)
- [ADR-160 — Non-bypassable redaction barrier](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
- [ADR-162 — Observability-first](../architecture/architectural-decisions/162-observability-first.md)
- [ADR-143 — Coherent structured fan-out](../architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
- [Exploration — Sentry vs PostHog capability matrix (2026-04-18)](./2026-04-18-sentry-vs-posthog-capability-matrix.md)
- [Exploration — Structured event schemas (2026-04-18)](./2026-04-18-structured-event-schemas-for-curriculum-analytics.md)
- [Exploration — Clerk identity downstream (2026-04-19)](./2026-04-19-redaction-policy-clerk-identity-downstream.md)
- [Plan — Observability events workspace](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
- [Plan — What the system emits today](../../.agent/plans/observability/what-the-system-emits-today.md)
- [MCP server observability doc](../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md)

### Code anchors

- Transport: `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`
- Auth ingress: `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-clerk.ts`
- Tool registration: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
- Sentry user scope: `apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts`
- Correlation ID: `apps/oak-curriculum-mcp-streamable-http/src/correlation/index.ts`
- Tool execution: `apps/oak-curriculum-mcp-streamable-http/src/tool-executor-factory.ts`
- MCP App widget: `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`
- Public tools policy: `packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts`

### External — legal and policy

- [Oak Privacy policy](https://www.thenational.academy/legal/privacy-policy) (reviewed copy dated **2 April 2026**)
- [Oak Cookie policy](https://www.thenational.academy/legal/cookie-policy) (updated **3 December 2024** — PostHog statistics, Clerk necessary, Cloudflare security)

### External — technical

- [MCP blog — The 2026-07-28 MCP Specification Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) (2026-05-21): stateless core, removed `Mcp-Session-Id`, W3C Trace Context in `_meta`, MCP Apps extension, Tasks extension, logging → OpenTelemetry
- MCP Apps host context: `@modelcontextprotocol/ext-apps` `McpUiHostContext`
  (`spec.types.d.ts` in package)
- Clerk MCP tools: `@clerk/mcp-tools` `verifyClerkToken`
- PostHog distinct ID and capture API: PostHog product documentation

---

## 20. Session narrative — full arc

This section consolidates **all questions, findings, and decisions** from
the May 2026 Cursor Composer session so nothing lives only in chat history.

### 20.1 Chronology

| Phase | Topic                                                                                                        | Outcome                                                                                                   | Section     |
| ----- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ----------- |
| 1     | Host / AI **session ID** exposure in MCP app + server                                                        | **None** — transport stateless (ADR-112); widget host context has tool-call ID only, not chat session     | §3          |
| 2     | How to **count** tool and API usage without a session                                                        | Emit **`tool_invoked`** + **`dependency_call`**; aggregate in PostHog/warehouse; no in-repo session store | §6–§8       |
| 3     | **Architecture validation** — PostHog + Clerk ID + `correlation_id` joins; same pattern for ES and future KG | **`AnalyticsEnvelope`** threaded from handler; join model in §7.7                                         | §7, §9      |
| 4     | **Clerk ID origin**                                                                                          | Clerk assigns; Oak extracts via `@clerk/mcp-tools`; not generated in-repo                                 | §4          |
| 5     | **PII classification**                                                                                       | `userId` = pseudonymous personal data; handle under DPIA                                                  | §5          |
| 6     | **Write-up in repo**                                                                                         | This exploration document                                                                                 | —           |
| 7     | **MCP `2026-07-28` RC**                                                                                      | Stateless spec aligns with ADR-112; W3C trace in `_meta`; upgrade at GA (A7)                              | §3.4, §11.6 |
| 8     | **Compliance** — DPIAs, legal notices, measure only what's necessary                                         | §11 + Oak privacy/cookie policy alignment                                                                 | §11         |
| 9     | **Milestones and plans** mapping                                                                             | Outbound links only until plan exists                                                                     | §14–§15     |
| 10    | **Blockers** for decision-complete plan                                                                      | B1–B4, B15 resolved by Jim; B5–B7 production gates                                                        | §16         |
| 11    | **Owner decisions** — volume, MVP scope, PostHog, Sentry guards, identity projection, correlation keys       | §1.1                                                                                                      | §1.1        |
| 12    | **Consolidation** — all session knowledge in this report; **no plan yet**                                    | §18, `status_note`                                                                                        | —           |

### 20.2 Questions asked and answers recorded

**Q: Is any session ID from the consuming AI client exposed to Oak code?**  
**A:** No. MCP HTTP uses per-request transport without session generation;
handlers ignore `extra.sessionId`. MCP App widget host context has
`toolInfo.id` (JSON-RPC tool-call id), not conversation id. §3.

**Q: How do we count MCP tool calls and upstream API calls without defining a session?**  
**A:** Emit structured events; let analytics platform bin/aggregate. Person
= Clerk `userId`; within-invocation fan-out = `correlation_id`. §6–§8.

**Q: PostHog events with Clerk ID and correlation ID for joins?**  
**A:** Yes — `distinct_id = clerk_user_id`; `correlation_id` property on
every event; `dependency_call` for ES/API/KG. §7, §8.3 PostHog adapter.

**Q: Where are Clerk IDs generated?**  
**A:** Clerk, at account creation; Oak only extracts from OAuth token. §4.

**Q: Are Clerk IDs PII?**  
**A:** Treat as pseudonymous personal data under GDPR for planning. §5.

**Q: Upgrade to latest MCP standards when GA?**  
**A:** Yes — decision A7, target `2026-07-28`. §3.4, §11.6.

**Q: Compliance — DPIAs, legal notices, minimisation?**  
**A:** §11 checklist; only measure what's necessary; no query text/tool
values in events. Privacy policy MCP endpoint gap flagged. §11.1.

**Q: How does this relate to milestones and plans?**  
**A:** M2 = Sentry engineering only; M3 = product analytics emitters;
outbound links in §14; no inbound plan edits until plan promoted. §14–§15.

**Q: Blockers before decision-complete plan?**  
**A:** Register in §16; core forks closed §1.1.

**Q: Jim = plan owner; PostHog in scope; walk through B1, B2, B4?**  
**A:** B1 all events; B2 eight-event Stage 1 MVP; B4 PostHog + Sentry only.
§1.1, §10.1, §7.5.

**Q: Sentry user ID, warehouse concept, two-stage events, defaults, trace keys, PostHog project?**  
**A:** §1.1, §7.5–§7.6, §8.0, §8.1, §7.7, dedicated MCP PostHog project.

**Q: Include all session knowledge in report; no plan yet?**  
**A:** This section + `status_note`; §18 plan deferred.

### 20.3 Explicit non-goals (session)

- Inventing a host **conversation session** ID in Oak code.
- In-process **aggregation** or sampling of `dependency_call` events.
- Passing Clerk ID to **Elastic, OpenAPI, warehouse**, or other non-PostHog/non-Sentry processors.
- **Pupil** analytics (teachers/professionals only).
- Marketing, profiling, or selling usage data.
- Writing an **execution plan** in this session (deferred).

### 20.4 Artifacts and references produced

| Artifact                                                                                           | Role                                                  |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| This exploration                                                                                   | Single design record                                  |
| [Privacy policy review (2026-04-02)](https://www.thenational.academy/legal/privacy-policy)         | Legal alignment §11                                   |
| [Cookie policy (2024-12-03)](https://www.thenational.academy/legal/cookie-policy)                  | PostHog statistics cookies                            |
| [MCP 2026-07-28 RC blog](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) | Protocol direction §3.4                               |
| Prior explorations 4, 10, 18                                                                       | Schema shape, identity policy, observability strategy |

---

## 21. Session provenance

Authored from a Cursor Composer working session (2026-05-26) covering:

1. Whether AI client session IDs reach MCP app / server code (they do not).
2. Options for defining "user session" for usage counting (deferred;
   event + downstream aggregation chosen).
3. Clerk ID origin and PII posture.
4. PostHog + Sentry event architecture with Clerk ID for persons and
   correlation ID for within-invocation joins.
5. Extension to Elasticsearch and future upstream services via
   `dependency_call`.

**Amendments (same session):**

- **§3.4** — [MCP `2026-07-28` release candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/): stateless direction, removed transport session ID, W3C trace propagation, explicit-handle application state.
- **§11** — Privacy, compliance, and data minimisation: DPIA register, legal notices ([privacy policy](https://www.thenational.academy/legal/privacy-policy), [cookie policy](https://www.thenational.academy/legal/cookie-policy)), technical controls, privacy review gate.
- **Decision A7** — Upgrade to MCP GA as soon as available (§11.6).
- **§14–§16** — Milestone/plan landscape (outbound links), discoverability policy, blockers register → resolved/open split after owner decisions §1.1.
- **§1.1, §7.5–§7.7, §8.0–§8.3** — Jim owner decisions: all events emitted, Stage 1 eight events, PostHog in scope, Sentry identity guards, per-sink Clerk ID projection, warehouse Option C lean, correlation keys day 1, event relationships.
- **§20** — Full session narrative and Q&A arc.
- **Plan deferred** — owner requested consolidation in exploration only (§18).

No implementation commits were made as part of this exploration authoring.
No execution plan file; exploration is the **complete design record** until
Jim authorises plan promotion.
