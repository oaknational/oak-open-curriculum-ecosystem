# PR label ledger

The meaning, applier, and lift condition of every non-default GitHub
label in this repository. Labels are working signals, not metaphors
(`labels-carry-context-not-metaphor`): a label states what it marks,
why, and when it comes off. New labels get a row here and a GitHub
description in the same change; a label whose row and live usage
diverge gets re-trued at the divergence, never left ambiguous.

Founded 2026-08-06 at the owner's word ("I added PR labels, which I
think need a ledger"), the same evening the effort labels were applied
across the open-PR estate.

## Effort labels (area routing — applied by anyone, removed only if mis-filed)

| Label                        | Meaning                                                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `agentic engineering`        | The agent practice and tooling estate: agent-tools, plan nodes, practice records, collaboration machinery.                             |
| `design system`              | The Oak Open Curriculum Design System lane: components, tokens, showcase, design records.                                              |
| `identity and observability` | The identity/auth and observability estate: Clerk, Sentry, PostHog, cross-system correlation (the MCP-143 / MCP-504 / MCP-517 family). |

Effort labels say which lane's clock a PR runs on. They carry no
state and never lift on merge — they are routing, not status.

## Provenance labels

| Label      | Meaning                                                                 | Applied by                      | Lifts                            |
| ---------- | ----------------------------------------------------------------------- | ------------------------------- | -------------------------------- |
| `jimbot`   | Agent-fleet (jimbot) authored PR.                                       | The authoring agent at PR-open. | Never — provenance is permanent. |
| `released` | Applied by semantic-release automation when a merge ships in a release. | Automation only.                | Never.                           |

## Status labels (state — each names its lift condition)

| Label                   | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Applied by         | Lifts                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------- |
| `pre-submission`        | Gates or supports the initial Anthropic directory submission; mirrors the Linear label. Vocabulary note (owner clarification 2026-08-06): this is the timing sense — "before the submission happens" — and is distinct from `paused for submission`.                                                                                                                                                                                                                                                                                                                | Matt's lane.       | At the submission's completion, by Matt's or the owner's hand.  |
| `paused for submission` | Originally: parked so as not to cause turbulence during the submission window (the fleet's conduct sense — distinct from `pre-submission` above). The window closed 2026-08-06 (owner ruling: the release has effectively happened; deferrals removed). Observed usage since: the owner continues applying it as a general "parked; resume later" marker. **Open re-true**: either the label is renamed/re-described to plain `parked`, or it lifts estate-wide now that its founding window has closed — the owner's call, queued with the MCP-519 Tuesday review. | Owner or Director. | Per PR, at its resume — or estate-wide per the pending re-true. |

## Default GitHub labels

The stock set (`bug`, `documentation`, `enhancement`, `dependencies`,
`javascript`, `github_actions`, etc.) carries its stock meanings and
needs no rows; `documentation` doubles as a routing hint on docs-only
PRs and affects no ceremony.

## Discipline

- A new label lands with its GitHub description AND its row here, in
  one change.
- Status labels MUST name a lift condition; a status label with no
  lift condition is the "parked indefinitely" anti-pattern the comms
  concept gate exists to catch.
- This ledger is the authority when a label's description and usage
  drift; re-true at the moment of noticing.
