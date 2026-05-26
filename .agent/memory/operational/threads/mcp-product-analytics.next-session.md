# Next-Session Record — `mcp-product-analytics` thread

## Landing target (per PDR-026) — refreshed 2026-05-26 (Stellar Glowing Satellite, claude, claude-opus-4-7, `9a2967`)

**Path-to-GA Programme + substance amendments LANDED** at commit
[`09eda6f4`](.) (`feat(plans): add MCP analytics exploration and Path-to-GA
Programme`). 10 files, +1804/−8, all pre-commit gates green (turbo 90/90,
prettier, markdownlint, boundary validators, prevent-accidental-major-version,
commitlint).

**Session outcome**:

1. New programme file at
   [`.agent/plans/curriculum-mcp-path-to-ga/roadmap.md`](../../../plans/curriculum-mcp-path-to-ga/roadmap.md)
   — thin strategic-index sequencing M1 → M2 → M3 → GA across observability,
   security-and-privacy, sdk-and-mcp-enhancements, compliance, and
   architecture-and-infrastructure collections. Owns no execution; sub-plans
   run independently. §6 backlog enumerates five owner-direction-gated
   paperwork items (A1 MCP analytics emission plan; A2 privacy gate plan;
   A3 MCP 2026-07-28 upgrade plan; A4 M4/GA milestone definition; A5
   Exploration 10 formal ruling backfill).
2. Inbound links added at
   [`high-level-plan.md`](../../../plans/high-level-plan.md)
   §"MCP Path-to-GA coordination" and
   [`milestones/README.md`](../../../milestones/README.md) near the milestone
   sequence.
3. Exploration file
   [`docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md`](../../../../docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md)
   committed (previously untracked at Glassy's handoff).
4. Five substance amendments landed under exploration §15's narrow
   deferral scope (§15 defers only the events-workspace schema catalogue,
   the high-level-observability Product-axis row, and `informs:`
   frontmatter pointing at the exploration):
   - `what-the-system-emits-today.md` — Product/MCP-Server cell names the
     `dependency_call` gap; Sinks identity-envelope subsection records the
     per-sink projection operating posture; new correlation-envelope
     paragraph; Update Log entry.
   - `apps/oak-curriculum-mcp-streamable-http/docs/observability.md` —
     new "Correlation envelope fields" subsection between per-request
     span enrichment and Express error handler.
   - `observability/future/second-backend-evaluation.plan.md` — Decision
     record gains a "Correlation-join contract" row; Architectural Shape
     gains an envelope legend; References gain the exploration link.
   - `observability/future/cross-system-correlated-tracing.plan.md` —
     Implementation Sketch gains a "Carrier-to-envelope mapping" note;
     References gain the exploration + thread record.
   - `observability/active/sentry-observability-maximisation-mcp.plan.md`
     L-3 Cross-references gain two entries pointing at exploration §7.5
     and §7.2/§7.7.

**Plan deviation recorded**: an L-7 amendment was originally scoped but
dropped on inspection — L-7 is about release/commit/deploy registration,
not trace-context propagation, so `traceparent` documentation belongs at
L-3 only.

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

**Git state at closeout (Stellar 2026-05-26)**: exploration + Programme +
amendments committed at `09eda6f4` on `docs/agent-collaboration-enhancements`.
Working tree carries pre-existing peer WIP (napkin, repo-continuity, agent-tooling
plans, comms events) that was not Stellar's; scoped pathspec on `git commit`
kept it cleanly out of this commit.

**Next safe step**: programme is the index, not the gate. Sub-plans still
run independently. The gated paperwork items in Programme §6 advance only
on owner authorisation:

- **A1** MCP analytics emission plan — owner request (Jim)
- **A2** privacy gate plan at `security-and-privacy/future/` — owner + DPO
- **A3** MCP `2026-07-28` upgrade plan (collection TBD, likely
  `sdk-and-mcp-enhancements/`) — spec GA + owner
- **A4** `.agent/milestones/m4-general-availability.md` definition — owner
- **A5** Exploration 10 (`docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md`)
  formal per-sink ruling backfill — owner + legal

Before production PostHog capture: resolve §11.7 privacy review gate and
legal notices (B5–B7). At plan author time: confirm warehouse Option A/B/C
(owner lean: **C**), PostHog Groups for `clientId` (B11), Exploration 10
per-sink projection doc sync, and search observability coordination (B14).

**Acceptance bar for resumption**: read exploration §1.1, §7–§8, §11, §14,
§16–§17; do not edit plan indexes until promotion; do not pass Clerk ID to
processors other than PostHog and guarded Sentry.

---

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Glassy Flowing Stern | cursor | composer-2.5 | de55d6 | design author | 2026-05-26 | 2026-05-26 |
| Stellar Glowing Satellite | claude | claude-opus-4-7 | 9a2967 | programme + amendments author | 2026-05-26 | 2026-05-26 |

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
