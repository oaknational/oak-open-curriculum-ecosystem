# Next-Session Record — `mcp-product-analytics` thread

## Landing target (per PDR-026) — refreshed 2026-05-26 (Glassy Flowing Stern, cursor, composer-2.5, `de55d6`)

**Authoritative design record**:
[`docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md`](../../../../docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md)
— design complete; **execution plan explicitly deferred** until Jim requests
promotion (`linking.direction: outbound-only`).

**Session outcome**: Investigated whether Oak MCP code receives a host
conversation session ID (no — ADR-112 stateless transport; MCP `2026-07-28`
RC removes `Mcp-Session-Id`). Mapped Clerk `userId` ingress, per-sink identity
projection (PostHog + Sentry only), correlation join model
(`correlation_id`, `traceparent`, `trace_id`), Stage 1 eight-event catalogue
(`tool_invoked`, `dependency_call`, plus six siblings), ES fan-out boundaries,
compliance gates (§11.7 before production PostHog), and milestone placement
(M2 engineering-only; M3 product analytics). Owner decisions captured in
exploration §1.1. **No implementation commits.**

**Git state at closeout**: exploration file is **untracked** in the working
tree; other agents were explicitly instructed to exclude it from unrelated
bundles (PR #118 lane). Owner to commit when ready.

**Next safe step**: none until Jim authorises either (a) execution plan
promotion using §14.5 checklist in the exploration, or (b) direct
implementation against §9 seams. Before production PostHog capture: resolve
§11.7 privacy review gate and legal notices (B5–B7). At plan author time:
confirm warehouse Option A/B/C (owner lean: **C**), PostHog Groups for
`clientId` (B11), Exploration 10 per-sink projection doc sync, and search
observability coordination (B14).

**Acceptance bar for resumption**: read exploration §1.1, §7–§8, §11, §14,
§16–§17; do not edit plan indexes until promotion; do not pass Clerk ID to
processors other than PostHog and guarded Sentry.

---

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Glassy Flowing Stern | cursor | composer-2.5 | de55d6 | design author | 2026-05-26 | 2026-05-26 |

## Standing decisions (thread carries forward)

- No in-repo host-conversation session; emit events; aggregate in analytics
  platform (§7).
- B1: emit every `tool_invoked` and `dependency_call`; no in-process
  aggregation.
- B4: Clerk ID in PostHog and Sentry (§7.5 guards); not to warehouse, Elastic,
  or OpenAPI upstream.
- Dedicated MCP PostHog project for Stage 1; upgrade MCP spec to `2026-07-28`
  at GA (A7).
- Plan owner: Jim; plan promotion is owner-gated.

## Session shape and grounding order

1. Exploration doc (authoritative until plan exists).
2. [`observability-sentry-otel`](observability-sentry-otel.next-session.md)
   thread for Sentry/OTel engineering context (paused).
3. Prospective execution home:
   [`observability-events-workspace.plan.md`](../../../plans/observability/current/observability-events-workspace.plan.md)
   — amend for `dependency_call` at promotion only.
