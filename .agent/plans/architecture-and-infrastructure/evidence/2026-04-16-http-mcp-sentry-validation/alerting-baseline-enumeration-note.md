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

## Deviations (observed 2026-04-17)

Next-session CLI validation ran the three `sentry api` calls above and
applied the five acceptance checks to rule `521866`. Three of six
checks pass; three diverge materially from the advisory baseline,
so item 8 of the 2026-04-16 bundle **remains NOT fully proven** and
"Road to Provably Working Sentry" step 5 stays on its pre-validation
wording pending owner input.

Raw shape of rule `521866` at time of check (full response body from
`sentry api projects/oak-national-academy/oak-open-curriculum-mcp/rules/521866/`):

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

Acceptance-matrix outcome:

| # | Check | Observed | Verdict |
| --- | --- | --- | --- |
| 1 | `status == "active"` | `"active"` | PASS |
| 2 | `environment == "production"` (top-level) | `null` | **DEVIATION** |
| 3 | `FirstSeenEventCondition` or equivalent new-issue trigger | `FirstSeenEventCondition` | PASS |
| 4 | `LevelFilter` `level == "40"`, `match == "gte"`, or equivalent severity gate | `filters: []` | **MATERIAL DEVIATION** |
| 5 | at least one notification action | Slack to `#sentry-alert-testing` | PASS (test-scoped channel) |
| 6 | `frequency` is a small positive integer | `1440` (= 24 h) | DEVIATION |

Material deltas and operational impact:

1. **No production environment gate** (`environment: null`). The rule
   fires for new issues across **all** environments, including
   `development`, `fixture`, and any session-release-tagged local
   evidence (e.g. the `evidence-2026-04-16-http-mcp-sentry-validation`
   local-trigger events recorded in the bundle README). Advisory
   baseline requires `environment == "production"`.
2. **No severity gate** (`filters: []`). The rule fires on **every**
   newly-seen issue, including `info`/`warning`/`debug` issues, not
   just errors. Advisory baseline requires at least one
   `LevelFilter` with `level == "40"`, `match == "gte"` (error and
   above).
3. **Frequency 1440 minutes (24 hours)** vs the advisory 5 minutes.
   A 24-hour duplicate-suppression window means a second occurrence
   of a known issue will not trigger a notification for up to a day;
   with `FirstSeenEventCondition` that only matters for rapid
   regressions of re-seen issues, but combined with deltas 1 and 2 it
   implies the rule is intentionally shaped for noise minimisation
   rather than as a production error signal.
4. **Rule scope signals "smoke test", not "production baseline"**.
   `name: "Test Alert 1"`, Slack channel `#sentry-alert-testing`
   (not the advisory `#dev-general-alerts` nor any production
   operational channel), and the three deltas above together read as
   an intentional smoke-testing rule rather than the production
   alerting baseline the parent plan is asking for.

Owner action required:

Rule `521866` as it stands confirms that the Sentry alerting pipeline
is wired up end-to-end (Slack integration + issue-alert primitive +
project scope), but it does not yet satisfy the advisory baseline
that item 8 of the 2026-04-16 evidence bundle was written against.
To close item 8 fully, the owner needs to decide one of:

- **Amend rule 521866** to add `environment: "production"` at the top
  level, a `LevelFilter` with `level: "40"` / `match: "gte"`, drop
  `frequency` to a small positive integer (5 is the advisory), and
  repoint the action to a production-scoped Slack channel (or
  equivalent); then the next session re-runs the three `sentry api`
  calls and appends an `Outcome (validated YYYY-MM-DD)` subsection.
- **Add a second production-baseline rule** alongside 521866 (leaving
  521866 as the smoke-testing rule), and record its id here so the
  next session can validate against it.
- **Explicitly relax the advisory baseline** for this project (with
  documented rationale here and in the parent plan), in which case
  the acceptance matrix in "Validation for the next session" should
  be updated to reflect the accepted configuration before item 8 is
  flipped to MET.

Per the non-mutation rule in "Validation for the next session", no
edits were made to rule `521866` during this validation pass.

Session status after this validation pass:

- evidence bundle `README.md` item 8 stays on `**OWNER ACTION REQUIRED**`
- parent plan "Road to Provably Working Sentry" step 5 stays on
  `**DONE (pending next-session CLI validation of alert rule 521866)**`
- parent plan frontmatter todos `deployment-and-evidence` and
  `sentry-credential-provisioning` stay on `in_progress`
- the in-scope MCP-server expansion lanes
  (`sentry-observability-expansion.plan.md`) can still proceed in
  parallel on this branch; parent-plan closure is what is blocked,
  not lane work
- no code changes made; validation-only edit
