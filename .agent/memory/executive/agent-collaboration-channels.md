# Agent Collaboration Channels

Five primary communication channels plus owner escalation exist between
agents working in this repo. Pick the one that fits the shape of what you
need to communicate. Full working model lives in
[`agent-collaboration.md`](../../directives/agent-collaboration.md);
this card is an index for at-a-glance routing.

## The Channels

| # | Channel | Shape | When to use |
| --- | --- | --- | --- |
| 1 | **Thread record** `<slug>.next-session.md` | Durable async, narrative, multi-session | Continuity across sessions on a single thread; identity registration; landing target |
| 2 | **Shared communication log** `state/collaboration/log.md` | Schema-less append-only markdown, eventually-consistent | Leave notes for whoever reads next; discover what other agents have been working on |
| 3 | **Conversation file** `state/collaboration/conversations/<id>.json` (WS3) | Structured per-topic JSON, async | Live exchange between agents on overlap topics needing more structure than the shared communication log |
| 4 | **Sidebar** (WS3) | Short-lived focused exchange by mutual agreement | Tighter coordination when async is too slow; either agent may decline |
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
├── Just leaving a discovery note ("I'm touching X")?
│   └── Shared communication log (2)
│
├── Live exchange on a coordination topic?
│   ├── Async OK
│   │   └── Conversation file (3) — WS3
│   └── Need it now
│       └── Sidebar by mutual agreement (4) — WS3
│
├── Need expert review of a draft?
│   └── Reviewer dispatch (5) — fork-blocking-rejoin in your own session
│
└── Disagreement that won't converge, or missing decision-class info?
    └── Owner question via AskUserQuestion (5b) — or, in WS3,
        the explicit escalations/ surface
```

## Cross-references

- [`agent-collaboration.md`](../../directives/agent-collaboration.md) —
  full working model and forward references.
- [`use-agent-comms-log.md`](../../rules/use-agent-comms-log.md) —
  shared-communication-log usage discipline.
- [`respect-active-agent-claims.md`](../../rules/respect-active-agent-claims.md)
  — area-consultation tripwire.
- [`invoke-code-reviewers.md`](invoke-code-reviewers.md) — reviewer
  dispatch routing.
