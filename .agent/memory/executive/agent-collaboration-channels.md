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
| 2 | **Shared communication log** `state/collaboration/shared-comms-log.md` | Generated markdown read model from immutable comms events | Discover what other agents have been working on; append new notes through the comms event helper |
| 2a | **Active claim** `state/collaboration/active-claims.json` | Structured JSON, live liveness signal, transaction-mutated | Register "I am touching this area now" or a short-lived `git:index/head` commit window |
| 3 | **Decision thread** `state/collaboration/conversations/<id>.json` | Structured per-topic JSON, async | Concrete overlap discussion, sidebars, joint decisions, decisions, resolutions, and evidence |
| 4 | **Sidebar entries** inside a decision thread | Short-lived focused exchange by mutual agreement | Tighter peer/owner exchange; expiry is stale-reporting only |
| 4b | **Escalation file** `state/collaboration/escalations/<id>.json` | Live owner-facing unresolved case record | Owner tiebreaker; durable resolution is written back to the conversation |
| 5 | **Reviewer dispatch** | Fork-blocking-rejoin within ONE agent's session | Specialist review of a draft (`docs-adr-expert`, `assumptions-expert`, etc.) - **not** peer collaboration |
| 5b | **Owner question** via `AskUserQuestion` | Hard-blocking sync to human | Final tiebreaker; missing information that only the owner can supply |

(Channels 5 and 5b are pre-existing and named here so agents pick the
right channel rather than mis-routing peer concerns to reviewers or to
the owner.)

**Delivery-lane overlay.** LIVE delivery lanes sit beside the
surfaces above without replacing any of them: **s2s** (`SendMessage`,
Claude-to-Claude, seconds, no durability — a tap on the shoulder that
accelerates channel 2, never substitutes for any surface here), **ARC**
(rapid-comms channel files — operationally a standalone
file-backed sidebar beside channel 4: choose a decision thread when the
exchange must be durable and structured from the start, ARC when
latency and bandwidth dominate and the substance is conserved at
close), and **Slack-via-Watcher** (the
[`talk-to-slack-watcher`](../../skills/talk-to-slack-watcher/SKILL-CANONICAL.md)
skill — the human-native bridge for traffic whose audience is the
owner or humans on the Practice Slack channel; minutes latency at the
Watcher's tick cadence, and decision-bearing content crossing the
Slack boundary mirrors to its durable estate home at occurrence in
both directions). Lane selection and the behaviours that keep them
honest
(decision-mirroring at occurrence, never-require, no permission
laundering) live in the
[`comms-channels`](../../skills/comms-channels/SKILL-CANONICAL.md)
skill.

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

## Peer or Helper — The Routing Diagnostic

Design and decision substance routes to a **peer** sidebar (channels 3/4);
parallelisable execution of pre-decided tasks routes to **helpers** —
sub-agent or platform-orchestrator dispatch (see §Platform-Orchestrator
Handoff below, and the delegation clauses in
[`agent-collaboration.md`](../../directives/agent-collaboration.md)
§Convergence and Delegation Discipline). The diagnostic: if the brief is
already detailed enough to constrain the answer, the work is execution —
helpers fit; if it is not, you need a peer, not a helper. Do not try to
coerce design out of a helper with ever-more-detailed briefs — emergent
shape comes from collision between comparable-authority minds, not
delegation (worked evidence:
[`agent-collaboration.md`](../../directives/agent-collaboration.md)
§Coordinator Role).

## Read-Only Support Assignments

For read-only scout or review support, send two notes:

- a readiness note to the implementer before implementation, naming likely
  risk surfaces, the minimum proof set, and the assignment boundary;
- a completion note to the controller afterwards, with exact commands and
  evidence.

This gives the controller a routable signal without turning the support
assignment into an implementation claim.

## Platform-Orchestrator Handoff

The comms surfaces above assume a poll-and-pickup agent: a session with a
comms-polling loop that discovers and claims work. Platform-native
orchestrators do not share that assumption. Cursor's Multitask mode
(re-verified against Cursor 3.2's `/multitask`, 2026-07-04) decomposes a
request and dispatches its own internal subagents; it does not poll a comms
directory, so narrative comms-events whose `audience` entries name a
cursor-platform agent are durable record only, never a delivery mechanism. Hand such an orchestrator **one
consolidated message**: a short shared context block, then a numbered list of
parallel-safe, self-contained task briefs (scope, deliverable, constraints,
expected output shape), and let it run its own team spin-up and spin-down.
Treat comms as the Claude-Code/Codex inter-agent channel by default; treat
platform orchestrators as spawn-with-prompt targets unless evidence shows a
polling loop. If a platform orchestrator becomes a standing consumer, the
protocol needs either a tasklist-export helper (producing the
consolidated-message shape from brief records) or a push-style integration
with the platform's task intake.

## Repeated Routing Pitfalls

| Surface | Watch for | Route |
| --- | --- | --- |
| Git index / `HEAD` | `git add -A`, bare `git commit`, or peer-staged files getting absorbed into a bundle | Use the commit skill, `commit_queue`, short-lived `git:index/head` claim, and explicit pathspec staging and commit |
| Whole-tree hooks | Hook failure on files outside the staged bundle | Fix minor style/format issues immediately; route substantial failures as the next named work item, not as a hook bypass |
| Shared `.agent` state | Treating active claims as commit blockers or leaving current-session state as residue | Land current-session `.agent` state that belongs to the bundle; re-read peer claims after helper-mediated state writes |
| PR closeout | Inferring reviewer-comment state from green checks | Harvest and classify comments, review summaries, and thread state separately from gates |
| Planning PR closeout | Collapsing technical readiness and plan decision-completeness | Report both verdicts separately in the closeout |
| PR metadata | Scope drift after a push | Refresh title/body and next-session records as one handoff operation |
| Coordinator brief | Path, workspace, or key specifics differ from the controlling plan | Treat the brief as a routing hint; re-read the plan before execution and surface divergence as a routing correction |

## Write Interface

For new shared-state writes, prefer
`pnpm agent-tools:collaboration-state -- ...`. It provides identity
preflight, immutable comms event append/render, transaction-safe claim,
conversation, escalation, and stale-archive commands. Codex writes with
`CODEX_THREAD_ID` available must derive a named identity rather than writing
as `Codex` / `unknown`.

## Cross-references

- [`agent-collaboration.md`](../../directives/agent-collaboration.md) —
  full working model and forward references.
- [`use-agent-comms-log.md`](../../rules/use-agent-comms-log.md) —
  shared-communication-log usage discipline.
- [`collaboration-state-write-safety.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/collaboration-state-write-safety.plan.md)
  — current write-safety implementation plan and CLI contract.
- [`respect-active-agent-claims.md`](../../rules/respect-active-agent-claims.md)
  — area-consultation tripwire.
- [`register-active-areas-at-session-open.md`](../../rules/register-active-areas-at-session-open.md)
  — active-claim and commit-window registration discipline.
- [`conversation.schema.json`](../../../agent-tools/src/collaboration-state/schemas/conversation.schema.json)
  — decision-thread, sidebar, and joint-decision schema.
- [`escalation.schema.json`](../../../agent-tools/src/collaboration-state/schemas/escalation.schema.json)
  — owner-escalation schema.
- [`invoke-code-experts.md`](invoke-code-experts.md) — reviewer
  dispatch routing.
