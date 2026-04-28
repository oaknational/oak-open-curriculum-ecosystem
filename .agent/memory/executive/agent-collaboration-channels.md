# Agent Collaboration Routing Surfaces

Communication channels, one live-claim surface, and owner questions exist
between agents working in this repo. Pick the one that fits the shape of
what you need to communicate. Sidebars, escalation, and joint-agent
decisions are live coordination architecture, not permission gates. Full
working model lives in
[`agent-collaboration.md`](../../directives/agent-collaboration.md);
this card is an index for at-a-glance routing.

Use UTC ISO 8601 timestamps with trailing `Z` in collaboration state. Owner-local
time can appear in prose when helpful, but the state clock is UTC.

## The Surfaces

| # | Channel | Shape | When to use |
| --- | --- | --- | --- |
| 1 | **Thread record** `<slug>.next-session.md` | Durable async, narrative, multi-session | Continuity across sessions on a single thread; identity registration; landing target |
| 2 | **Shared communication log** `state/collaboration/shared-comms-log.md` | Schema-less append-only markdown, eventually-consistent | Leave notes for whoever reads next; discover what other agents have been working on |
| 2a | **Active claim** `state/collaboration/active-claims.json` | Structured JSON, live liveness signal | Register "I am touching this area now" or a short-lived `git:index/head` commit window |
| 3 | **Decision thread** `state/collaboration/conversations/<id>.json` | Structured per-topic JSON, async | Concrete overlap discussion, sidebars, joint decisions, decisions, resolutions, and evidence |
| 4 | **Sidebar entries** inside a decision thread | Short-lived focused exchange by mutual agreement | Tighter peer/owner exchange; expiry is stale-reporting only |
| 4b | **Escalation file** `state/collaboration/escalations/<id>.json` | Live owner-facing unresolved case record | Owner tiebreaker; durable resolution is written back to the conversation |
| 5 | **Reviewer dispatch** | Fork-blocking-rejoin within ONE agent's session | Specialist review of a draft (`docs-adr-reviewer`, `assumptions-reviewer`, etc.) - **not** peer collaboration |
| 5b | **Owner question** via `AskUserQuestion` | Hard-blocking sync to human | Final tiebreaker; missing information that only the owner can supply |

(Channels 5 and 5b are pre-existing and named here so agents pick the
right channel rather than mis-routing peer concerns to reviewers or to
the owner.)

## Decision Tree

```text
Need to communicate something to another agent?
│
├── Across a session boundary, narrative continuity?
│   └── Thread record (1)
│
├── About to touch files, plans, ADRs, workspaces, or git index/head?
│   └── Active claim (2a), with shared-log note when useful
│
├── Just leaving a discovery note ("I noticed X")?
│   └── Shared communication log (2)
│
├── Concrete async coordination decision or evidence bundle?
│   └── Decision thread (3)
│
├── Need tighter focused exchange inside a decision thread?
│   └── Sidebar entries (4)
│
├── Need shared commitment with decider / recorder / actor?
│   └── Joint-decision entries inside a decision thread (3)
│
├── Peer agreement cannot resolve the block?
│   └── Escalation file (4b), then write owner resolution back to the conversation
│
├── Need expert review of a draft?
│   └── Reviewer dispatch (5) — fork-blocking-rejoin in your own session
│
└── Disagreement that won't converge, or missing decision-class info?
    └── Owner question via AskUserQuestion (5b)
```

## Cross-references

- [`agent-collaboration.md`](../../directives/agent-collaboration.md) —
  full working model and forward references.
- [`use-agent-comms-log.md`](../../rules/use-agent-comms-log.md) —
  shared-communication-log usage discipline.
- [`respect-active-agent-claims.md`](../../rules/respect-active-agent-claims.md)
  — area-consultation tripwire.
- [`register-active-areas-at-session-open.md`](../../rules/register-active-areas-at-session-open.md)
  — active-claim and commit-window registration discipline.
- [`conversation.schema.json`](../../state/collaboration/conversation.schema.json)
  — decision-thread, sidebar, and joint-decision schema.
- [`escalation.schema.json`](../../state/collaboration/escalation.schema.json)
  — owner-escalation schema.
- [`invoke-code-reviewers.md`](invoke-code-reviewers.md) — reviewer
  dispatch routing.
