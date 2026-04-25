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
  `"no other agents present"` note to the embryo log and register your
  claim. The embryo-log entry is the artefact.
- **(a-2) Registry populated but no overlap** — other agents have active
  claims, but none of their `areas` intersect yours. Register your own
  claim with a `notes` value summarising the scan, e.g.
  `"scanned registry: <N> active claims, no overlap with my areas"`.
  The `notes` value is the artefact.
- **(b) Overlap with another agent's active claim** — consult the embryo
  log at
  [`.agent/state/collaboration/log.md`](../state/collaboration/log.md)
  and any open conversation files for context, then decide how to
  coordinate: proceed with caution, ping the other agent via the embryo
  log, open a sidebar (WS3), or ask the owner via `AskUserQuestion`.
  Record the decision in your own claim's `notes` field citing the other
  agent's `claim_id` (and additionally append an embryo-log entry if the
  decision requires response). The `notes` field plus optional embryo-log
  entry are the artefacts.

Consult the registry and decide how to coordinate before proceeding to any
edit. The substance of the decision is **agent judgement**. This rule does
**not** refuse entry to claimed areas. Mechanical refusal is explicitly out
of scope (see [`agent-collaboration.md` § Knowledge and Communication, Not
Mechanical Refusals](../directives/agent-collaboration.md)).

## At session close

Either:

- **Close your claim** — remove your entry from `active-claims.json` (or
  set `freshness_seconds` to a value that has already elapsed so
  consolidate-docs archives it), or
- **Leave it for staleness audit** — if the claim's work is finished but
  no other agent is waiting on the area, it is acceptable to leave the
  claim and let consolidate-docs archive it on its next pass. Staleness is
  not a failure mode; it is the protocol's garbage collection.

Crashed sessions whose claims never close are handled by the consolidate-docs
stale-claim audit. The agent is not stranded by a peer's failure to close.

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
plan installed the embryo discovery log — a schema-less append-only surface
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
   adjacent rules, etc.).
4. Group the list into entries shaped per the schema's `area` definition:
   `{ kind, patterns }`. `kind` is `files | workspace | plan | adr`;
   `patterns` is an array of globs / slugs / numbers.

Over-claim slightly is better than under-claim — the cost of a slightly broad
claim is a peer pinging you to coordinate; the cost of an under-claim is a
silent overlap.

## Claim entry schema

The authoritative schema is
[`active-claims.schema.json`](../state/collaboration/active-claims.schema.json).
Every entry carries: `claim_id`, `agent_id` block (PDR-027 identity), `thread`
slug, `areas` array, `claimed_at`, `freshness_seconds` (default 14400 = 4
hours), optional `heartbeat_at`, `sidebar_open` (WS3), `intent` prose, and
optional `notes`.

**Single-level claim model**: there is no `exclusive` vs `advisory` field.
All claims are advisory; strength of signal is communicated via the `intent`
prose (`"atomic refactor in progress, please coordinate"` vs `"routine edits,
ping me if you also touch this"`). WS5 evidence may motivate a strength
gradient as a refinement amendment.

## Bootstrap fast-path

If `active-claims.json` contains no entries other than your own, append a
single line to the embryo log noting *"no other agents present"* and proceed.
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
  — schema authority.
- [`active-claims.json`](../state/collaboration/active-claims.json) —
  active registry.
- [`closed-claims.archive.json`](../state/collaboration/closed-claims.archive.json)
  — archival surface populated by consolidate-docs at staleness threshold.
- [`use-agent-comms-log.md`](use-agent-comms-log.md) — embryo-log usage
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
