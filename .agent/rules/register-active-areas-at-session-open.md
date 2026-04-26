# Register Active Areas At Session Open

Before any edit in this session, list the areas you intend to touch. For each
area, scan
[`.agent/state/collaboration/active-claims.json`](../state/collaboration/active-claims.json)
for overlapping entries. Then walk one of three branches and **leave an
artefact** that proves you consulted (consultation must be observable
post-hoc; an unwritten consultation is indistinguishable from no
consultation at all):

- **(a-1) Registry empty (bootstrap fast-path)** — the registry has no
  entries other than your own. Append a single
  `"no other agents present"` note to the shared communication log and
  register your claim. The shared-communication-log entry is the artefact.
- **(a-2) Registry populated but no overlap** — other agents have active
  claims, but none of their `areas` intersect yours. Register your own
  claim with a `notes` value summarising the scan, e.g.
  `"scanned registry: <N> active claims, no overlap with my areas"`.
  The `notes` value is the artefact.
- **(b) Overlap with another agent's active claim** — consult the shared
  communication log at
  [`.agent/state/collaboration/shared-comms-log.md`](../state/collaboration/shared-comms-log.md)
  and any open decision-thread files for context, then decide how to
  coordinate: proceed with caution, ping the other agent via the shared
  communication log, open or append a decision thread under
  `.agent/state/collaboration/conversations/`, request a sidebar inside
  that conversation, record a joint decision when peer commitment is
  needed, open an owner escalation under
  `.agent/state/collaboration/escalations/`, or ask the owner via
  `AskUserQuestion`.
  Record the decision in your own claim's `notes` field citing the other
  agent's `claim_id` and, when used, the `conversation_id` (and additionally
  append a shared-communication-log entry if the decision requires
  response). The `notes` field plus optional log or decision-thread entry
  are the artefacts.

Consult the registry and decide how to coordinate before proceeding to any
edit. The substance of the decision is **agent judgement**. This rule does
**not** refuse entry to claimed areas. Mechanical refusal is explicitly out
of scope (see [`agent-collaboration.md` § Knowledge and Communication, Not
Mechanical Refusals](../directives/agent-collaboration.md)).

## Commit-window claims

Before staging or committing, repeat the consultation step for the shared git
transaction surface. If no fresh `git:index/head` claim exists, register a
short-lived claim entry under `claims[]`:

```json
{
  "claim_id": "<uuid-v4>",
  "agent_id": {
    "agent_name": "<name>",
    "platform": "<platform>",
    "model": "<model>",
    "session_id_prefix": "<prefix>"
  },
  "thread": "<thread-slug>",
  "areas": [
    {
      "kind": "git",
      "patterns": ["index/head"]
    }
  ],
  "claimed_at": "<iso-8601-now>",
  "freshness_seconds": 900,
  "intent": "Stage and commit <summary>.",
  "notes": "Pathspecs: <paths>; gates: <state>; peer claims: <summary>."
}
```

Append a shared-log entry when the claim opens, then close it after the commit
attempt or abort with the resulting SHA, failure reason, or abort reason. If
another fresh `git:index/head` claim exists, coordinate rather than racing the
git lock.

## At session close

Write durable closure history, then remove your active entry:

1. Copy the active claim into `closed-claims.archive.json`.
2. Add `archived_at` plus `closure.kind: "explicit"`,
   `closure.closed_at`, `closure.closed_by`, `closure.summary`, and at
   least one `closure.evidence[]` reference.
3. Remove your entry from `active-claims.json`.

If the owner closes a claim on an agent's behalf, use
`closure.kind: "owner_forced"` and cite the owner direction. Crashed
sessions whose claims never close are handled by the consolidate-docs
stale-claim audit with `closure.kind: "stale"`. The agent is not stranded
by a peer's failure to close.

## Why this rule exists

Three observed instances of parallel-track gate clashes within 48 hours
(documented in
[`parallel-track-pre-commit-gate-coupling`](../memory/collaboration/parallel-track-pre-commit-gate-coupling.md))
demonstrated that full-repo pre-commit gates couple parallel agent sessions:
one agent's WIP breaks gates against another agent's pristine staged work.
The reactive discipline (*"surface, don't fix or bypass, route to owner"*)
is now well-recorded but does not prevent recurrence.

WS0 of the
[multi-agent-collaboration-protocol](../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
plan installed the shared communication log — a schema-less append-only surface
that any agent can read for "what has been happening here recently?" WS1
(this rule) crystallises the active-area signal into a queryable structured
registry. The rule converts a discoverable convention into an active,
always-applied tripwire at session open — the same conversion
[`register-identity-on-thread-join`](register-identity-on-thread-join.md)
applies to identity rows.

This rule is the second tripwire in the agent-collaboration family. The first
is [`use-agent-comms-log`](use-agent-comms-log.md) (append on intent); this
rule structures the *area-of-work* signal so subsequent agents do not have to
read free-form prose to decide whether their plan overlaps a peer's.

## How to determine which areas you are touching

Enumerate structurally, not from memory:

1. From the chat opener and the landing target in the thread's
   next-session record, name the workstream you are committed to.
2. Read the plan body the landing target points at; list every file path,
   plan slug, ADR number, or workspace it names.
3. Add any incidental areas you anticipate touching (config files,
   adjacent rules, etc.). Add a `git:index/head` area only when you are
   ready to stage or commit.
4. Group the list into entries shaped per the schema's `area` definition:
   `{ kind, patterns }`. `kind` is `files | workspace | plan | adr | git`;
   `patterns` is an array of globs / slugs / numbers.

Over-claim slightly is better than under-claim — the cost of a slightly broad
claim is a peer pinging you to coordinate; the cost of an under-claim is a
silent overlap.

## Claim entry schema

The authoritative schema is
[`active-claims.schema.json`](../state/collaboration/active-claims.schema.json).
Every entry carries: `claim_id`, `agent_id` block (PDR-027 identity), `thread`
slug, `areas` array, `claimed_at`, `freshness_seconds` (default 14400 = 4
hours), optional `heartbeat_at`, `sidebar_open` (whether a sidebar is
open against the claim),
`intent` prose, and optional `notes`. Commit-window claims normally use
`areas.kind: "git"` with `patterns: ["index/head"]` and
`freshness_seconds: 900`.

**Single-level claim model**: there is no `exclusive` vs `advisory` field.
All claims are advisory; strength of signal is communicated via the `intent`
prose (`"atomic refactor in progress, please coordinate"` vs `"routine edits,
ping me if you also touch this"`). WS5 evidence may motivate a strength
gradient as a refinement amendment.

## Bootstrap fast-path

If `active-claims.json` contains no entries other than your own, append a
single line to the shared communication log noting *"no other agents present"* and proceed.
Solo sessions pay the protocol's minimum overhead — one read, one write —
not the full coordination cycle.

## Self-application

The session that installs this rule MUST itself register a claim covering
the WS1 implementation slice in `active-claims.json` *before* staging the WS1
commit, then close the claim in the same atomic commit. The first claim entry
is the WS1 author's own claim; the WS1 commit demonstrates the surface
end-to-end against itself.

## Related surfaces

- [`agent-collaboration.md`](../directives/agent-collaboration.md) —
  agent-to-agent working model and channel taxonomy.
- [`active-claims.schema.json`](../state/collaboration/active-claims.schema.json)
  — active-registry schema authority.
- [`closed-claims.schema.json`](../state/collaboration/closed-claims.schema.json)
  — closed-claim archive schema authority.
- [`active-claims.json`](../state/collaboration/active-claims.json) —
  active registry.
- [`closed-claims.archive.json`](../state/collaboration/closed-claims.archive.json)
  — durable closure-history surface for explicit, stale, and owner-forced
  claim closure.
- [`conversation.schema.json`](../state/collaboration/conversation.schema.json)
  and [`conversations/`](../state/collaboration/conversations/) —
  decision-thread, sidebar, and joint-decision contract and examples.
- [`escalation.schema.json`](../state/collaboration/escalation.schema.json)
  and [`escalations/`](../state/collaboration/escalations/) — owner-facing
  unresolved case records.
- [`use-agent-comms-log.md`](use-agent-comms-log.md) — shared-communication-log usage
  rule; sibling tripwire on intent declaration.
- [`respect-active-agent-claims.md`](respect-active-agent-claims.md) —
  scope-discipline rule that this registration rule operationalises.
- [`register-identity-on-thread-join.md`](register-identity-on-thread-join.md)
  — sibling tripwire on identity rows.
- [`collaboration-state-conventions.md`](../memory/operational/collaboration-state-conventions.md)
  — operational guide to state lifecycle and trusted-agents threat model.
- [PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
  — agent identity schema, reused inside claim entries.
- [PDR-029](../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  — Family-A Class-A.2 tripwire pattern.
