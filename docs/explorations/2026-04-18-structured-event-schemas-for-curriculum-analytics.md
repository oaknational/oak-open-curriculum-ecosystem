---
title: Structured Event Schemas for Curriculum Analytics — Data-Scientist-Facing Shape and Redaction-Safe Categorical Axes
date: 2026-04-18
status: informed-plan-observability-events-workspace
---

# Structured Event Schemas for Curriculum Analytics

This exploration defines the shape of the seven MVP observability events
that land in `packages/core/observability-events/` via
[`observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md).
It is the evidence base for WS1 RED (schema contract tests) and WS2 GREEN
(schema implementations): every open scoping question in that plan is
answered here, or carried forward as a named open research question with
a trigger.

The target audience is explicit: **Oak's data scientists and analysts**,
named in the direction-setting session [§3.5](./2026-04-18-observability-strategy-and-restructure.md#35-product--data-scientist-questions):

> I am the product owner, and we want simple questions answered: what
> is used most, least, what tools correlate with use of which other
> tools, which subjects, key stages, key words are most requested. We
> have several data scientists and analysts, so the best thing we can
> do for now is give them well defined data.

The schema shape must answer those questions on day one of public beta
without renegotiating on every tool-surface change.

---

## 1. Problem statement

Today event payloads are emitted as free-shape `logger.*` and `Sentry.*`
calls from scattered emission sites. There is no contract between
emitters and downstream consumers. A contributor can add a new emission
site with any shape and no tooling flags the drift; downstream analytics
pipelines have to cope with whatever arrives.

The MVP consequence is that **data scientists cannot answer first-order
questions without upstream schema stability**. "Which subjects are most
requested" is only a question if `subject` arrives as a stable
categorical field, not as whatever shape the emitter happened to produce
that day.

[ADR-162 (Observability-First)](../architecture/architectural-decisions/162-observability-first.md)
commits to stable documented schemas as the integration contract. The
direction-setting session [§3.8](./2026-04-18-observability-strategy-and-restructure.md#38-event-schema-as-a-new-core-workspace)
raises this from a Markdown artefact to a new core workspace
(`packages/core/observability-events/`). This exploration defines the
concrete shape the workspace implements.

Four design questions dominate:

1. **Event-shape topology** — flat denormalized event with full context
   vs. nested schemas with correlation-keyed separate emission.
2. **Lifecycle decomposition** — one event per lifecycle stage
   (`started` / `ok` / `error`) vs. single event with outcome + duration.
3. **Categorical-axis vocabulary** — which curriculum axes
   (subject, key-stage, keyword, year-group, thread, unit) carry enough
   signal at cohort level to warrant first-class fields, and which are
   noise.
4. **Session correlation** — how multi-tool sequences within a single
   user session are correlated without ingesting user identity.

Every answer is constrained by the
[ADR-160 redaction barrier](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md):
values are redacted, categorical keys are preserved. A schema that
requires a redacted field to be readable downstream is malformed by
construction.

---

## 2. Honest starting position

Three anchors constrain every design decision below. They are stated
here so the option analysis in §4 can reference them without repetition.

**Anchor 1 — ADR-160 redaction posture is absolute.** Any field
carrying a user-supplied value (query text, search term, feedback body,
tool-argument values) is redacted before a destination receives it.
Categorical keys (subject, key-stage, year-group) are preserved. A
schema proposal that places a redacted field in a position where
downstream analytics expect its value is a schema we cannot ship.

**Anchor 2 — Vendor independence is first-class (ADR-162).** The
schemas are provider-neutral. Fields follow OpenTelemetry attribute
conventions where applicable (`service.name`, `deployment.environment`,
`session.id`). No vendor-specific field types leak in (no Sentry
`captureContext`, no PostHog `$distinct_id`). The same event payload
must round-trip through the stdout sink, Sentry, or a hypothetical
future backend with no field loss.

**Anchor 3 — The data scientist is the first-class consumer.** The
direction-setting session names "simple questions answered" as the
product goal. Schema decisions that optimise for emitter ergonomics
over analyst ergonomics are wrong. When the two conflict, the
analyst wins; the emitter absorbs the cost via the workspace helpers.

---

## 3. Scope and non-scope

**In scope**. Concrete MVP schema shapes for the seven named events;
correlation-keys contract; schema-evolution strategy; redaction-posture
flag per field; categorical-axis vocabulary for curriculum filters.

**Out of scope**.

- The emission wrapper API (the workspace plan's Non-Goals exclude a
  runtime helper; emitters use `logger` + `Sentry` + the schemas
  directly).
- Downstream pipeline shape (PostHog / Vercel / GCP ingest adapters
  are vendor concerns; the schema is vendor-neutral).
- Post-MVP events (AI telemetry, curriculum-content joins, deployment
  impact — each has its own future plan with a named promotion
  trigger).
- Dashboards or queries. Schemas are the substrate; analysts build on
  top.

---

## 4. Options considered

Options are organised along the four design questions in §1. Each sub-
section reports the option space, the failure modes of the alternatives,
and the recommendation.

### 4.1 Event-shape topology — flat denormalized vs. nested correlated

**Option A — Flat denormalized events** (recommended).
Each emission is a complete event payload carrying every field a
downstream consumer needs to reason about it, without joins.
`tool_invoked` carries the tool name, outcome, duration, correlation
keys, categorical filter context, service metadata, all in one row.

**Option B — Nested correlated events.**
Each emission is a minimal payload with a correlation ID; context
events (`session_started`, `tool_context_resolved`) carry the rest.
Consumers join downstream.

**Pros of A (flat)**.

- One row per event; data scientists can answer cohort questions with
  `GROUP BY` alone, no joins required on ingest.
- Survives pipeline fragmentation. Each of Oak's downstream surfaces
  (PostHog, Vercel analytics, GCP Logging, in-house pipeline) can
  consume events independently.
- Redaction posture is per-field-per-event; no "we had the value in
  the context event but redacted it in the detail event" asymmetry.

**Cons of A**.

- Field duplication across events. `subject` arrives on every
  `tool_invoked`; if subject vocabulary changes, every emission site
  needs the updated enum.
- Wider event payloads; slightly more bytes per emission.

**Pros of B (nested)**.

- Smaller per-event payload.
- One source of truth for context fields.

**Cons of B**.

- Analysis requires joins on ingest at every consumer. Oak's downstream
  pipeline is fragmented; joining across sinks that have different
  retention windows or sampling rates is fragile.
- Session-boundary ambiguity. A context event that arrives out of
  order, is dropped by sampling, or has a different TTL than the
  detail event produces analyst-visible gaps.
- Does not survive the vendor-neutrality test: some destinations
  (stdout JSON lines; limited-schema OTel sinks) cannot represent
  the join at all without the consumer reconstructing it.

**Recommendation**. **Option A — flat denormalized events**. The
field-duplication cost is real but minor; the cross-sink join-
fragility cost is large and asymmetric. The events workspace centralises
the categorical vocabulary so "subject vocabulary changes" is a
single-workspace edit — the cost of duplication is localised.

### 4.2 Lifecycle decomposition — per-stage vs. single-event-with-outcome

**Option A — Single event per lifecycle with outcome field**
(recommended).
`tool_invoked` emits once per invocation at completion, carrying
`outcome: 'ok' | 'error' | 'timeout' | 'cancelled'` and
`duration_ms`. No separate `tool_started` / `tool_ok` / `tool_error`
events.

**Option B — Event per stage.**
`tool_started`, `tool_ok`, `tool_error`, each a separate event type.
Consumers compute duration and outcome by joining across the stages.

**Pros of A**.

- Half to a third the event volume for the same information.
- Duration and outcome co-located — cohort queries like "p95 latency
  for `search-key-stages` by outcome" are one `GROUP BY`.
- Matches OpenTelemetry's span model (one span carries start, end,
  status, attributes).
- Does not duplicate the data that Sentry's own span/error model
  already captures at the engineering axis.

**Cons of A**.

- Invocations that hang (never complete) do not emit. Loss of "started"
  events complicates "tool-invocation rate" computations when
  completion rate is low.
- For very long-running invocations, the consumer sees nothing until
  completion.

**Pros of B**.

- Long-running invocations are observable at start.
- Hanging invocations produce a `tool_started` with no pair, visible
  as a data-integrity signal.

**Cons of B**.

- Event volume multiplies.
- Consumers must join; same fragility as §4.1 Option B.
- Duplicates span-model semantics that Sentry already provides.

**Recommendation**. **Option A — single event with outcome**. The
long-running-invocation concern is addressed at the engineering axis
via Sentry spans (which do capture start-time); the product-axis
`tool_invoked` event is correctly single-shot. For hang detection,
synthetic monitoring (`synthetic-monitoring.plan.md`) is the correct
surface, not product events.

**Exception**: `widget_session_outcome` is single-event-at-unload by
construction (§4.3.6 below). `auth_failure` and `rate_limit_triggered`
are point-in-time events — no lifecycle to decompose.

### 4.3 Categorical-axis vocabulary — which curriculum axes matter

The session report §3.5 names: subject, key-stage, keyword. The SDK's
curriculum model additionally exposes year-group, thread, unit,
sequence, lesson-slug. The exploration's job is to rank these by MVP
signal value under the redaction constraint.

**Ranking (proposal)**.

| Axis          | MVP-in?        | Redaction posture                       | Rationale                                                                                                                                                                                                                                                       |
| ------------- | -------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `subject`     | Yes            | Categorical, preserved                  | Top-level answers "what subjects are most requested"                                                                                                                                                                                                            |
| `key_stage`   | Yes            | Categorical, preserved                  | Top-level answers "which key stages"                                                                                                                                                                                                                            |
| `year_group`  | Yes            | Categorical, preserved                  | Finer-grained than key-stage; named in session §3.5 ("key stages, year groups, subjects")                                                                                                                                                                       |
| `keyword`     | Yes (cautious) | **Categorical only — NOT free-text**    | The data scientist wants "most-requested keyword"; the redaction barrier forbids emitting the searched string. Resolved by keyword-as-category: only keywords that are vocabulary-controlled (predefined enum) are emitted; free-text search terms are redacted |
| `thread`      | Yes            | Categorical, preserved                  | Curriculum-level grouping; stable enum                                                                                                                                                                                                                          |
| `unit`        | No (MVP)       | Deferred                                | High-cardinality; adds value only when joined to curriculum metadata (blocked on `curriculum-content-observability.plan.md`)                                                                                                                                    |
| `sequence`    | No (MVP)       | Deferred                                | Same reasoning as unit                                                                                                                                                                                                                                          |
| `lesson_slug` | **No — ever**  | Would be user-specific; privacy concern | Not in schema; if needed later, via curriculum-metadata join post-aggregation                                                                                                                                                                                   |

**Keyword resolution**. The session-report acknowledges the tension
between "data scientists want keyword" and "keyword values are user
input." The proposal: `keyword` in the schema is a closed-enum field
(the controlled vocabulary maintained by the curriculum team). Any
search term that matches a controlled keyword is reported with that
keyword; free-text searches not matching a controlled keyword are
reported as `keyword: 'uncontrolled'`. The data scientist gets
"what controlled keywords are most searched" without exposure to raw
search text.

**Open question (§5.2)**. Whether the controlled-vocabulary enum is
large enough at MVP launch to be useful; fallback is `keyword: null` or
the field is omitted at MVP if coverage is insufficient.

### 4.4 Session correlation — how multi-tool sequences are joined

**Option A — Session ID as stable per-browser-session correlation key**
(recommended).
Emitted by the widget at session start, propagated via `meta.session_id`
on every subsequent event in that session. Derived from browser storage
(sessionStorage) so it lives for the session-tab lifetime and no
longer. No persistence across sessions; no user identity.

**Option B — No session concept; join by proximity in time + trace_id.**
Consumers guess session boundaries by grouping events within a time
window.

**Pros of A**.

- Stable join key for multi-tool sequences; directly supports "what
  tools correlate with use of which other tools" (session §3.5).
- Session boundary is explicit; no proximity-heuristic guessing.
- `sessionStorage` resets per tab; no cross-tab persistence; no
  cross-user identity leakage.

**Cons of A**.

- The session ID is a fingerprinting element if combined with
  preference tags, IP, etc. Mitigated by: (1) the ID is a random UUID,
  not derived from anything user-identifying; (2) the barrier
  prevents IP and identity from entering the event fan-out path;
  (3) the ID is scoped per-tab and expires with the tab.

**Cons of B**.

- Proximity-heuristic session grouping is fragile — multi-tab users,
  mid-session pauses, and slow tool invocations all break the
  heuristic.
- Every analyst builds their own session-boundary heuristic; no
  agreed definition of "session" across downstream surfaces.

**Recommendation**. **Option A — explicit `session_id` UUID per
browser-session-tab, emitted by widget, propagated by server**.

**Trace correlation**. The correlation-keys contract carries three
fields on every event:

- `trace_id` — OTel trace ID for engineering-axis joining (Sentry
  span tree).
- `session_id` — product/usability-axis joining.
- `release` — deployment correlation; joins outcomes to the
  currently-deployed version.

All three survive redaction. All three are stable enough across the
event fan-out that data scientists can treat them as primary join
keys.

### 4.5 Redaction posture per field

Every field in every schema carries a redaction-posture annotation
(TSDoc tag or Zod `.describe()` content). The closed set:

- **Categorical preserved**: closed-enum fields, safe to emit raw.
- **Bucketed numeric**: numeric fields reported at coarse granularity
  (duration in ms bucketed to 10ms; result counts in log-scale
  buckets). Raw values are redacted; bucketed values are emitted.
- **Correlation key**: random IDs (session/trace/release). Safe by
  construction.
- **Redacted**: fields whose raw value is user-supplied or
  user-identifying. Emitted as `[REDACTED]` or omitted entirely by
  the ADR-160 barrier.

Every schema proposal in §4.6 below flags each field with its posture.

### 4.6 MVP schema shapes (concrete proposals)

The shapes are sketches, not final Zod. WS2 (the workspace plan's
GREEN) refines them against real emission sites. The field list and
redaction posture are the load-bearing parts.

#### 4.6.1 `tool_invoked`

Emitted by the MCP server tool-handler boundary at invocation
completion.

| Field                         | Type                                          | Redaction posture | Notes                                              |
| ----------------------------- | --------------------------------------------- | ----------------- | -------------------------------------------------- |
| `meta.trace_id`               | string                                        | Correlation key   | OTel trace ID                                      |
| `meta.session_id`             | string                                        | Correlation key   | From MCP session or widget                         |
| `meta.release`                | string                                        | Correlation key   | Deploy release ID                                  |
| `meta.service_name`           | `'mcp-streamable-http' \| 'search-cli'`       | Categorical       | OTel `service.name`                                |
| `meta.deployment_environment` | `'production' \| 'preview' \| 'development'`  | Categorical       | OTel `deployment.environment`                      |
| `meta.schema_version`         | `'1'`                                         | Categorical       | Schema-evolution handle                            |
| `tool_name`                   | closed enum of tool names                     | Categorical       | Derived from `AGGREGATED_TOOL_DEFS`                |
| `outcome`                     | `'ok' \| 'error' \| 'timeout' \| 'cancelled'` | Categorical       |                                                    |
| `error_class`                 | closed enum, null if `outcome === 'ok'`       | Categorical       | No error message content                           |
| `duration_ms`                 | number, bucketed 10ms                         | Bucketed numeric  |                                                    |
| `curriculum.subject`          | closed enum or null                           | Categorical       | See §4.3                                           |
| `curriculum.key_stage`        | closed enum or null                           | Categorical       |                                                    |
| `curriculum.year_group`       | closed enum or null                           | Categorical       |                                                    |
| `curriculum.thread`           | closed enum or null                           | Categorical       |                                                    |
| `curriculum.keyword`          | `'uncontrolled' \| closed enum \| null`       | Categorical       | See §4.3                                           |
| `arguments_shape`             | hash of argument key-set                      | Categorical       | Identifies the combination of args used; no values |

Note: `arguments_shape` is a stable hash of the sorted argument key
set, not a hash of values. This lets analysts answer "which
arg-combinations are most used" without any value exposure.

#### 4.6.2 `search_query`

Emitted by search-path handlers (MCP server + search CLI). Compatible
with Oak's existing zero-hit capture (see
[`search-observability.plan.md § RQ-ZERO`](../../.agent/plans/observability/current/search-observability.plan.md)).

| Field                | Type                                              | Redaction posture | Notes                                                                 |
| -------------------- | ------------------------------------------------- | ----------------- | --------------------------------------------------------------------- |
| `meta.*`             | (as above)                                        | Correlation       |                                                                       |
| `search_scope`       | `'lessons' \| 'units' \| 'sequences'`             | Categorical       |                                                                       |
| `result_count`       | number, log-scale buckets (0, 1-10, 11-100, 100+) | Bucketed numeric  |                                                                       |
| `zero_hit`           | boolean                                           | Categorical       | True if result_count === 0                                            |
| `took_ms`            | number, bucketed 10ms                             | Bucketed numeric  | ES `took`                                                             |
| `timed_out`          | boolean                                           | Categorical       | From ES response                                                      |
| `index_version`      | string                                            | Categorical       | Blue/green version ID                                                 |
| `curriculum.*`       | (same as §4.6.1)                                  | Categorical       | Filter context                                                        |
| `keyword_controlled` | boolean                                           | Categorical       | False = uncontrolled search term                                      |
| `query_hash`         | string                                            | Correlation-like  | Stable hash of query string for dedup/correlation; NOT the query text |

#### 4.6.3 `feedback_submitted`

Emitted by the L-9 MCP tool. Per the A.3 decision, carries a closed-set
Zod enum — no free-text fields.

| Field          | Type                                                | Redaction posture | Notes                                  |
| -------------- | --------------------------------------------------- | ----------------- | -------------------------------------- |
| `meta.*`       |                                                     | Correlation       |                                        |
| `category`     | closed enum from L-9 schema                         | Categorical       | Privacy invariant                      |
| `tool_context` | closed enum of tool_name that prompted the feedback | Categorical       | Which tool's output generated feedback |

#### 4.6.4 `auth_failure`

Emitted at the trust boundary by `packages/libs/mcp-auth/`.

| Field               | Type                                                                                       | Redaction posture | Notes                                        |
| ------------------- | ------------------------------------------------------------------------------------------ | ----------------- | -------------------------------------------- |
| `meta.*`            |                                                                                            | Correlation       | `session_id` optional (may pre-date session) |
| `failure_category`  | `'missing_token' \| 'invalid_token' \| 'expired_token' \| 'insufficient_scope' \| 'other'` | Categorical       | No token content                             |
| `endpoint_category` | closed enum of endpoint groups                                                             | Categorical       | Not the raw path                             |

#### 4.6.5 `rate_limit_triggered`

Emitted by the rate-limit middleware.

| Field               | Type                                    | Redaction posture | Notes |
| ------------------- | --------------------------------------- | ----------------- | ----- |
| `meta.*`            |                                         | Correlation       |       |
| `limit_category`    | `'per_session' \| 'per_ip' \| 'global'` | Categorical       |       |
| `endpoint_category` | closed enum of endpoint groups          | Categorical       |       |

#### 4.6.6 `widget_session_outcome`

Emitted by the widget at session end or success. Stage vocabulary is a
proposal (open question §5.4); vocabulary finalises at WS2 GREEN.

| Field           | Type                                                                                                          | Redaction posture | Notes                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------- |
| `meta.*`        |                                                                                                               | Correlation       |                                                                       |
| `outcome`       | `'success' \| 'abandoned_during_stage' \| 'error_during_stage' \| 'unknown'`                                  | Categorical       | `'unknown'` when `beforeunload` did not fire (per exploration 3 §4.4) |
| `stage`         | closed enum — **proposal**: `'initial_load' \| 'tool_select' \| 'tool_invoke' \| 'result_view' \| 'feedback'` | Categorical       | Refine with product owner (§5.4)                                      |
| `keyboard_only` | boolean                                                                                                       | Categorical       | From exploration 3 §4.3                                               |
| `duration_ms`   | number, bucketed 100ms                                                                                        | Bucketed numeric  | Coarser than tool_invoked because session-level                       |

#### 4.6.7 `a11y_preference_tag`

Defined in [exploration 3 §4.1](./2026-04-18-accessibility-observability-at-runtime.md#41-preference-media-query-tags--mvp-in-recommended).

| Field                          | Type                                              | Redaction posture | Notes                               |
| ------------------------------ | ------------------------------------------------- | ----------------- | ----------------------------------- |
| `meta.*`                       |                                                   | Correlation       |                                     |
| `prefers_reduced_motion`       | `'reduce' \| 'no-preference'`                     | Categorical       |                                     |
| `prefers_color_scheme`         | `'light' \| 'dark' \| 'no-preference'`            | Categorical       |                                     |
| `prefers_contrast`             | `'more' \| 'less' \| 'no-preference' \| 'custom'` | Categorical       |                                     |
| `forced_colors`                | `'active' \| 'none'`                              | Categorical       | Windows HCM indicator               |
| `prefers_reduced_transparency` | `'reduce' \| 'no-preference' \| null`             | Categorical       | `null` when browser doesn't support |
| `prefers_reduced_data`         | `'reduce' \| 'no-preference' \| null`             | Categorical       | `null` when browser doesn't support |
| `font_scaling_derived`         | `'default' \| 'scaled' \| 'unknown'`              | Categorical       | Best-effort per exploration 3 §4.1  |

### 4.7 Schema evolution strategy

Every schema carries `meta.schema_version` as a string-typed
categorical field. The initial MVP emits `'1'`. Schema changes
propagate via the following rules:

- **Additive-only within a major version**. Fields may be added to
  `meta.schema_version: '1'` as long as they are optional (nullable)
  and absence-means-unknown is a safe semantic for downstream
  consumers.
- **Breaking changes bump the major version**. A new `schema_version`
  enum variant (`'2'`) is introduced; both `'1'` and `'2'` schemas
  are exported during a transition window; consumers migrate when
  ready.
- **No field removal within a major version**. Removed fields are
  deprecated-with-tombstone (schema keeps the field, marks it
  deprecated, emitters stop sending). Downstream pipelines that
  expect the field see `null`, not a schema-shape change.

This matches the repo's schema-first pattern and keeps ingest
pipelines stable through the MVP → post-MVP evolution.

---

## 5. Research questions still open

Each question carries a calibration trigger or decision owner.

### 5.1 `arguments_shape` hash collision rate

**Question**. The proposed `arguments_shape` field is a stable hash
over the sorted argument key set. At what rate do different invocations
produce the same hash (collisions), and does that rate degrade the
"which arg-combinations are most used" analysis?

**Trigger**. WS2 GREEN sampling over ~10,000 invocations in dev; if
collision rate exceeds 1%, move to a larger hash (SHA-256 truncated to
64 chars) or structured encoding of the key-set directly.

**Owner**. Workspace plan WS2.2 implementer.

### 5.2 Controlled-keyword vocabulary coverage at MVP launch

**Question**. Is the curriculum team's controlled-keyword vocabulary
large enough, at MVP launch, for `keyword: 'uncontrolled'` to be the
minority-case response? If the vocabulary covers <40% of live searches,
the `keyword` field is low-signal.

**Trigger**. Vocabulary-coverage audit against the last 30 days of
search-term logs from the staging environment; if coverage is below
40%, drop the `keyword` field from MVP `search_query` schema and
raise as a post-MVP plan (`curriculum-content-observability.plan.md`
absorbs).

**Owner**. Curriculum team; workspace plan WS2.2 reads the decision.

### 5.3 `session_id` lifecycle across host integrations

**Question**. How should `session_id` behave when the widget is
embedded in different MCP App hosts (Claude Code vs. browser vs. CLI
tool)? Does each host reset the session, or is there cross-host
carryover we need to handle?

**Trigger**. Host-survey during WS2.2 against the current MCP App
hosts; if any host exposes a host-provided session identity that
should override the widget-generated UUID, absorb via a clear
precedence rule in `correlation-keys.ts`.

**Owner**. Workspace plan WS2.2 + `mcp-reviewer` at adversarial review.

### 5.4 Widget session stage vocabulary

**Question**. What closed-enum stages describe the widget's user
flow meaningfully for both the product owner's questions and the
engineer's triage questions?

**Trigger**. Product-owner input during WS2.2; candidate vocabulary
(`initial_load`, `tool_select`, `tool_invoke`, `result_view`,
`feedback`) is a working proposal, not a commitment. Refine or
replace entirely based on product-owner review.

**Owner**. Product owner; workspace plan WS2.2 reads the decision.

### 5.5 `duration_ms` bucketing granularity

**Question**. 10ms buckets for tool duration, 100ms buckets for
session duration — are these granularities right for the tail
distributions Oak actually sees, or should they be log-scale?

**Trigger**. Duration-distribution audit against existing Sentry
span data for the MCP server; if the p99 tail extends beyond what
linear buckets can represent compactly, switch to log-scale.

**Owner**. Workspace plan WS2.2; `sentry-reviewer` at adversarial
review.

### 5.6 Zod 4 `.meta({ examples })` vs. `z.preprocess()` edge case

**Question**. The `distilled.md` entry notes that `z.preprocess()` loses
`.meta()` with `io='input'`. Do any MVP schemas require `z.preprocess()`
to handle incoming shape normalisation (e.g. stringified durations
from browser timers)?

**Trigger**. WS1 RED exercises `.meta({ examples })` on every schema;
if any schema requires preprocessing that loses examples, document the
field-level limitation and add a matching `.meta()` on the refined
schema.

**Owner**. `type-reviewer` at WS5 adversarial review.

### 5.7 Cross-vendor export adapter shape (post-MVP preview)

**Question**. When `multi-sink-vendor-independence-conformance.plan.md`
proves that emissions survive in `SENTRY_MODE=off` via stdout/err,
what is the expected shape of a second-vendor adapter (e.g. a PostHog
export mapper)? Does the current field set map cleanly, or are there
OTel conventions the schema should adopt now to reduce later friction?

**Trigger**. Exploration 8 (vendor-independence conformance test
shape); mapping audit at WS2 GREEN.

**Owner**. `sentry-reviewer` + exploration 8 authors.

---

## 6. Informs

- [`.agent/plans/observability/current/observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
  — the seven MVP schemas in §4.6 are this plan's WS1 RED schema
  contract and WS2 GREEN implementation target. The correlation-keys
  contract (§4.4) is the plan's `correlation-keys.unit.test.ts`
  subject. The redaction-posture annotation (§4.5) governs the
  conformance helper's test shape.
- [`.agent/plans/observability/current/accessibility-observability.plan.md`](../../.agent/plans/observability/current/accessibility-observability.plan.md)
  — the `a11y_preference_tag` and `widget_session_outcome` shapes
  here are what the a11y plan's emissions conform to.
- [`.agent/plans/observability/current/security-observability.plan.md`](../../.agent/plans/observability/current/security-observability.plan.md)
  — the `auth_failure` and `rate_limit_triggered` shapes here are
  what the security plan's emission sites conform to.
- [`.agent/plans/observability/current/search-observability.plan.md`](../../.agent/plans/observability/current/search-observability.plan.md)
  — the `search_query` shape here is what RQ-ZERO and the MCP
  server's search-tool emissions conform to.
- [`.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — L-0/L-1/L-3 emissions use the `tool_invoked` schema; L-9 uses
  `feedback_submitted`.
- [ADR-162](../architecture/architectural-decisions/162-observability-first.md)
  Enforcement Mechanism #3 — the conformance test; the shape of
  `assertEventConformance` is constrained by the schemas defined
  here.

---

## 7. References

### Architectural decisions

- [ADR-029 — No Manual API Data Structures](../architecture/architectural-decisions/029-no-manual-api-data.md).
  The schema-first pattern; this workspace is a kindred application.
- [ADR-030 — SDK as Single Source of Truth](../architecture/architectural-decisions/030-sdk-single-source-truth.md).
  Controlled-vocabulary enums derive from the SDK (subject, key-stage,
  year-group, thread).
- [ADR-031 — Generation-Time Extraction](../architecture/architectural-decisions/031-generation-time-extraction.md).
  Categorical vocabularies that derive from the SDK are generated,
  not hand-maintained.
- [ADR-078 — Dependency Injection for Testability](../architecture/architectural-decisions/078-dependency-injection-for-testability.md).
  Consuming workspaces inject the conformance helper; no test touches
  `process.env`.
- [ADR-143 — Coherent Structured Fan-Out for Observability](../architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md).
  The fan-out through which these events flow.
- [ADR-154 — Separate Framework from Consumer](../architecture/architectural-decisions/154-separate-framework-from-consumer.md).
  This workspace is the framework; emitters are consumers.
- [ADR-160 — Non-Bypassable Redaction Barrier as Principle](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md).
  Every field carries an explicit redaction posture; categorical
  preservation and value redaction are the load-bearing semantics.
- [ADR-162 — Observability-First](../architecture/architectural-decisions/162-observability-first.md).
  The principle this workspace operationalises.

### Governance and project documents

- [`docs/explorations/2026-04-18-observability-strategy-and-restructure.md § 3.5`](./2026-04-18-observability-strategy-and-restructure.md#35-product--data-scientist-questions)
  — product-owner framing for the data-scientist-facing shape.
- [`docs/explorations/2026-04-18-observability-strategy-and-restructure.md § 3.8`](./2026-04-18-observability-strategy-and-restructure.md#38-event-schema-as-a-new-core-workspace)
  — decision to make the schema a code workspace, not a Markdown
  artefact.
- [`docs/explorations/2026-04-18-accessibility-observability-at-runtime.md`](./2026-04-18-accessibility-observability-at-runtime.md)
  — exploration 3; `a11y_preference_tag` field enumeration.
- [`.agent/memory/distilled.md § Zod 4 .meta({ examples })`](../../.agent/memory/distilled.md) —
  the `z.preprocess()` / `.meta()` edge case referenced in §5.6.

### External conventions

- [OpenTelemetry semantic conventions — general resource attributes](https://opentelemetry.io/docs/specs/semconv/resource/).
  Source of `service.name`, `deployment.environment`, `service.version`
  shape.
- [OpenTelemetry semantic conventions — trace attributes](https://opentelemetry.io/docs/specs/semconv/general/trace/).
  Source of trace-id / span-id conventions.
- [Zod documentation — `z.meta`](https://zod.dev/).
  Reference for `.meta({ examples })` usage.

(External OTel semantic-convention URLs are cited here without WebFetch
verification at this exploration's authoring time; the workspace plan's
WS2 GREEN implementer verifies live URLs before embedding in
`event-catalog.md`.)
