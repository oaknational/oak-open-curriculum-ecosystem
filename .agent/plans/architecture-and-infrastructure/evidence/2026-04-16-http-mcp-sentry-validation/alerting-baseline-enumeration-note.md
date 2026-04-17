# Phase 5: CLI-driven alerting-rule enumeration for `oak-open-curriculum-mcp`

Date: 2026-04-17. Branch: `feat/otel_sentry_enhancements`
(HEAD at time of note: `0f9245f5` plus the Sentry CLI hygiene lane).

## Scope

This note is a sibling of the frozen `README.md` in this evidence bundle.
It records the outcome of Phase 5 of the Sentry CLI hygiene lane: using
the `sentry api` dev CLI to enumerate alert rules for
`oak-national-academy/oak-open-curriculum-mcp`, directly addressing the
`README.md` item 8 claim that the Sentry MCP tools could not surface
alert-rule state.

## Why CLI and not MCP

Item 8 in the frozen `README.md` notes that the Sentry MCP tools
(`find_issues`, `search_events`, `search_issues`, `get_sentry_resource`)
do not expose an alert-rule primitive. The Sentry REST API does. The dev
`sentry` CLI ships an `sentry api <path>` subcommand that authenticates
with `SENTRY_AUTH_TOKEN` and performs a direct GET against any REST
endpoint, which is sufficient to enumerate rule state without needing
raw `curl` wiring.

## Commands

```bash
set -a
. apps/oak-curriculum-mcp-streamable-http/.env.local
set +a

# Project-scoped issue alert rules
sentry api projects/oak-national-academy/oak-open-curriculum-mcp/rules/

# Project-scoped metric alert rules
sentry api projects/oak-national-academy/oak-open-curriculum-mcp/alert-rules/

# Organization-level combined rules (issue + metric + uptime)
sentry api organizations/oak-national-academy/combined-rules/ \
  | jq '[.[] | select(.projects[]? == "oak-open-curriculum-mcp")] | length'
```

## Results

| Endpoint | Response |
| --- | --- |
| `projects/.../oak-open-curriculum-mcp/rules/` (issue alerts) | `[]` |
| `projects/.../oak-open-curriculum-mcp/alert-rules/` (metric alerts) | `[]` |
| `organizations/oak-national-academy/combined-rules/` | 7 rules total in the org; **0** reference `oak-open-curriculum-mcp` |

For context, the seven rules returned by the combined-rules endpoint
cover other projects in the same org: `oak-open-curriculum-api-v0`
(issue rule id `411518` and shared rule id `510556`),
`oak-open-curriculum-search-cli` (shared rule id `510556`), and
`ai-experiments` (rule ids `2038`, `2037`, `2299`, `62`). There is also
one org-level uptime monitor (`346644`) whose `projects` field is
`null`. None of them target `oak-open-curriculum-mcp`.

## Conclusion

CLI enumeration is definitive and does not require an owner question:
as of 2026-04-17, the `oak-open-curriculum-mcp` project has **zero
configured alert rules** of any kind (issue, metric, or uptime).
Item 8's framing in the `README.md` as "OWNER ACTION REQUIRED" is
therefore upgraded from "MCP tools cannot tell us the state" to
"CLI confirms the baseline is empty; owner still needs to create the
first production alert rule".

## Recommended minimum baseline (for owner action)

This is advisory only; final rule copy is the owner's decision.
Sentry issue-alert rules express level and environment not as a
search string but as typed fields on the rule object (see the
response schema at
<https://docs.sentry.io/api/alerts/list-a-projects-issue-alert-rules>).
The Sentry UI renders these correctly; the details below are the
IaC-equivalent shape so that an engineer reading or POSTing the rule
programmatically knows exactly what to send.

- **Rule type**: issue alert (`projects/.../rules/`) is sufficient for
  a baseline; a metric alert can follow later.
- **Top-level fields**:
  - `environment: "production"` (or the Vercel production env string
    once production events arrive — this is a top-level field on the
    rule, NOT a filter).
  - `frequency: 5` (minutes between duplicate fires, matching sibling
    projects' rules).
- **Conditions** (at least one): `"A new issue is created"` — in API
  form `{"id":"sentry.rules.conditions.first_seen_event.FirstSeenEventCondition"}`.
- **Filters** (all must match):
  `{"id":"sentry.rules.filters.level.LevelFilter","level":"40","match":"gte"}`
  (level 40 = `error`; `gte` = "error and above"). Do NOT use a
  search-string filter like `event.level:error` — that is query-DSL
  grammar, not issue-alert-rule filter grammar.
- **Actions**:
  `{"id":"sentry.integrations.slack.notify_action.SlackNotifyServiceAction","workspace":"231948","channel":"#dev-general-alerts"}`,
  matching the pattern used by rule `411518` on the API project.

Owner should create this (or an equivalent) via the Sentry UI at
`/alerts/rules/new/?project=oak-open-curriculum-mcp`, then record the
resulting rule id here to close item 8. No code change is required to
wire it up.

## Outcome summary (one line)

CLI enumeration confirms `oak-national-academy/oak-open-curriculum-mcp`
has zero alert rules today; item 8 remains the only owner-action
blocker for full closure of the 2026-04-16 bundle.
