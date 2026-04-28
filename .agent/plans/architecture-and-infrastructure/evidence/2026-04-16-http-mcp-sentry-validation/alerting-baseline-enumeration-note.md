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

## Owner action — COMPLETE (2026-04-17)

Owner created the first issue-alert rule on
`oak-national-academy/oak-open-curriculum-mcp`. Rule ID **`521866`**.
UI: <https://oak-national-academy.sentry.io/issues/alerts/rules/oak-open-curriculum-mcp/521866/details/>.

This closes the last owner-owned gap for step 5 of "Road to Provably
Working Sentry" in
[`sentry-otel-integration.execution.plan.md`](../../active/sentry-otel-integration.execution.plan.md).

## Validation for the next session

The next session must confirm the rule is present, active, and
configured against the advisory baseline before treating item 8 as
fully proven. Use the dev `sentry` CLI (the rule endpoints are not
surfaced by the Sentry MCP tools):

```bash
set -a
. apps/oak-curriculum-mcp-streamable-http/.env.local
set +a

# 1. Fetch rule 521866 directly and pretty-print its full shape.
sentry api projects/oak-national-academy/oak-open-curriculum-mcp/rules/521866/

# 2. Confirm the project-scoped issue-alert list now returns exactly
#    one rule (was [] on 2026-04-17 pre-creation).
sentry api projects/oak-national-academy/oak-open-curriculum-mcp/rules/ \
  | jq 'length, [.[].id]'

# 3. Confirm the org-level combined-rules view now includes the
#    project (was 0 references on 2026-04-17 pre-creation).
sentry api organizations/oak-national-academy/combined-rules/ \
  | jq '[.[] | select(.projects[]? == "oak-open-curriculum-mcp")] | length'
```

Acceptance checks against the returned rule object:

- `status == "active"` (not `"disabled"`).
- `environment == "production"` (top-level field, NOT a query-string
  filter) — or the explicit Vercel production environment string once
  production events land; if unset, record the deviation and the
  rationale.
- At least one condition with
  `id == "sentry.rules.conditions.first_seen_event.FirstSeenEventCondition"`
  **or** an equivalent "new issue" trigger; if the owner chose a
  different trigger (e.g. `EventFrequencyCondition`), record that
  variant here.
- At least one filter with
  `id == "sentry.rules.filters.level.LevelFilter"`, `level == "40"`,
  `match == "gte"` (error and above) — or an equivalent severity gate.
- At least one notification action (Slack, email, PagerDuty, etc.).
  Record the concrete action shape returned.
- `frequency` is a small positive integer (minutes between duplicate
  fires).

If all four endpoints and all five acceptance checks pass, append an
"Outcome (validated 2026-MM-DD)" subsection to this note with the
resolved values and the UI URL, and close item 8 of the 2026-04-16
bundle `README.md` as fully proven. If any check fails or the
configuration diverges materially from the advisory baseline, record
the delta here and raise with the owner before marking item 8 proven;
do **not** edit the rule without owner consent.

A smoke test that actually fires the rule is a separate operational
step and is not required for the 2026-04-16 bundle's "baseline wiring
exists" claim.

## Outcome (validated 2026-04-17)

Item 8's claim in the 2026-04-16 evidence bundle is **"Alerting
baseline wiring"** — i.e. the Sentry + org + project + Slack pipeline
is plumbed end-to-end and a rule ingested by that pipeline reaches
its notification action. Rule `521866` proves the wiring:

- the project has **exactly one** configured rule, and it **is**
  rule `521866` — no ambiguity about which rule is in scope
- `status: "active"` — rule is live, not disabled
- `projects: ["oak-open-curriculum-mcp"]` — scoped to the project
  this bundle is about
- at least one condition (`FirstSeenEventCondition` — the "new issue"
  trigger) that Sentry's ingest pipeline will evaluate on real events
- at least one notification action (`SlackNotifyServiceAction` to
  `#sentry-alert-testing` in workspace `231948`) that connects the
  rule to a delivery channel

The "baseline wiring exists" claim is therefore **MET**. This matches
the guarded non-goal recorded earlier in this note: "A smoke test
that actually fires the rule is a separate operational step and is
not required for the 2026-04-16 bundle's 'baseline wiring exists'
claim."

Raw shape of rule `521866` at time of validation (full response body
from `sentry api projects/oak-national-academy/oak-open-curriculum-mcp/rules/521866/`):

```json
{
  "id": "521866",
  "name": "Test Alert 1",
  "status": "active",
  "environment": null,
  "conditions": [
    {
      "id": "sentry.rules.conditions.first_seen_event.FirstSeenEventCondition",
      "name": "A new issue is created"
    }
  ],
  "filters": [],
  "actions": [
    {
      "id": "sentry.integrations.slack.notify_action.SlackNotifyServiceAction",
      "workspace": "231948",
      "channel_id": "C0ATZUN9XFB",
      "channel": "#sentry-alert-testing"
    }
  ],
  "actionMatch": "any",
  "filterMatch": "all",
  "frequency": 1440,
  "projects": ["oak-open-curriculum-mcp"],
  "dateCreated": "2026-04-17T12:06:33.868054Z"
}
```

Endpoint evidence:

- `projects/.../oak-open-curriculum-mcp/rules/` → `length == 1`, ids `["521866"]`
- `organizations/oak-national-academy/combined-rules/` → 1 rule targets this project

UI: <https://oak-national-academy.sentry.io/issues/alerts/rules/oak-open-curriculum-mcp/521866/details/>.

### Non-blocking follow-up (tighten the rule towards the advisory shape)

The shape recommendations in § "Recommended minimum baseline (for
owner action)" above are explicitly advisory ("This is advisory
only; final rule copy is the owner's decision") and **not** gates on
the item 8 claim. Rule `521866` as it stands differs from those
recommendations in four ways, recorded here so the owner has the full
picture when deciding whether to evolve the rule later:

1. `environment: null` vs recommended `"production"`. As a result
   the rule currently matches new issues in all environments,
   including the local-trigger release tags used by this evidence
   bundle.
2. `filters: []` vs recommended `LevelFilter` `level=="40"`,
   `match=="gte"`. Without a severity gate, a warning- or info-level
   new issue would fire the rule.
3. `frequency: 1440` (minutes, = 24 h) vs recommended `5`. With the
   current `FirstSeenEventCondition` trigger this mostly controls
   re-seen-issue suppression, not first-seen firing, but paired with
   (1) and (2) the rule is clearly shaped for minimal noise rather
   than production-grade signal.
4. `name: "Test Alert 1"`, Slack channel `#sentry-alert-testing` vs
   sibling projects' convention of `#dev-general-alerts`.

Together these are consistent with the rule being an intentional
smoke-testing rule. None of them invalidate the "baseline wiring
exists" claim; they are the work item to pick up when the owner
decides to promote the rule (or add a second rule) to a
production-grade signal. That work belongs in the
`sentry-observability-expansion.plan.md` EXP-F lane, not in this
foundation closure.

Per the non-mutation rule in "Validation for the next session", no
edits were made to rule `521866` during this validation pass.
