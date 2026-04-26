# Agent Collaboration Routing Surfaces

Five communication channels, one live-claim surface, and owner questions
exist between agents working in this repo. Pick the one that fits the shape
of what you need to communicate. Sidebar and file-backed owner escalation
remain WS3B work until explicitly promoted. Full working model lives in
[`agent-collaboration.md`](../../directives/agent-collaboration.md);
this card is an index for at-a-glance routing.

## The Surfaces

| # | Channel | Shape | When to use |
| --- | --- | --- | --- |
| 1 | **Thread record** `<slug>.next-session.md` | Durable async, narrative, multi-session | Continuity across sessions on a single thread; identity registration; landing target |
| 2 | **Shared communication log** `state/collaboration/shared-comms-log.md` | Schema-less append-only markdown, eventually-consistent | Leave notes for whoever reads next; discover what other agents have been working on |
| 2a | **Active claim** `state/collaboration/active-claims.json` | Structured JSON, live liveness signal | Register "I am touching this area now" or a short-lived `git:index/head` commit window |
| 3 | **Decision thread** `state/collaboration/conversations/<id>.json` (WS3A) | Structured per-topic JSON, async | Concrete overlap discussion, decision requests, decisions, resolutions, and evidence |
| 4 | **Sidebar** (WS3B paused) | Short-lived focused exchange by mutual agreement | Deferred; use only if owner direction or decision-thread evidence promotes WS3B |
| 5 | **Reviewer dispatch** | Fork-blocking-rejoin within ONE agent's session | Specialist review of a draft (`docs-adr-reviewer`, `assumptions-reviewer`, etc.) — **not** peer collaboration |
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
│   └── Decision thread (3) — WS3A
│
├── Need tighter live coordination than async can provide?
│   └── Sidebar (4) only after WS3B is explicitly promoted
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
  — WS3A decision-thread schema.
- [`invoke-code-reviewers.md`](invoke-code-reviewers.md) — reviewer
  dispatch routing.
