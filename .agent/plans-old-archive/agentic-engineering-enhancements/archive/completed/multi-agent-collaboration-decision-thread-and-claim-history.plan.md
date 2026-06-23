---
name: Multi-Agent Collaboration Decision Threads and Claim History
overview: >
  First split from paused WS3. Address the WS5-harvest gaps around evidence
  provision, protocol observability, and durable claim-closure history, then
  add a lightweight conversation / decision-thread surface. Sidebar and
  owner-escalation mechanics remain deferred to the sibling sidebar plan.
todos:
  - id: ws3a-red-evidence-baseline
    content: "WS3A RED: codify the WS5 evidence harvest, current gaps, and expected failing validation for claim-history and decision-thread fixtures."
    status: completed
  - id: ws3a-green-claim-history
    content: "WS3A GREEN: make claim closure history durable for explicit closes as well as stale archival, with schema/docs/examples updated together."
    status: completed
  - id: ws3a-green-decision-thread
    content: "WS3A GREEN: add the lightweight conversation / decision-thread directory, schema, examples, and directive/rule guidance."
    status: completed
  - id: ws3a-refactor-observability
    content: "WS3A REFACTOR: wire protocol observability into consolidate-docs, state README, thread guidance, and evidence-bundle conventions."
    status: completed
  - id: ws3a-validation-and-handoff
    content: "WS3A CLOSE: run targeted JSON/Markdown/schema validation, update plan indexes, and hand unresolved sidebar demand to the sibling plan."
    status: completed
isProject: false
---

# Multi-Agent Collaboration Decision Threads and Claim History

**Last Updated**: 2026-04-26
**Status**: WS3A COMPLETE - WS3B remains evidence-gated
**Parent Plan**:
[`multi-agent-collaboration-protocol.plan.md`](../../current/multi-agent-collaboration-protocol.plan.md)
**Sibling Plan**:
[`multi-agent-collaboration-sidebar-and-escalation.plan.md`](../../current/multi-agent-collaboration-sidebar-and-escalation.plan.md)

## Context

The owner-directed WS5 evidence harvest found that the evidence threshold
for inspecting WS3 has been met, but the evidence does not justify
auto-resuming the full conversation + sidebar + escalation mechanism.
The live system already handled several real overlaps through the shared
communication log, active claims, and human-readable decisions.

The harvest surfaced a sharper next step:

- evidence provision is too distributed across the log, active claims,
  closed-claims archive, napkin, and thread records
- protocol observability is mostly free-text, so claim and coordination
  lifecycle state is hard to survey quickly
- explicit claim closures are not durably represented the same way stale
  claim archival is
- a lightweight conversation / decision-thread surface may cover the next
  coordination need without introducing full synchronous sidebar mechanics

This plan owns those gaps. The sibling sidebar plan owns the heavier
sidebar and owner-escalation functionality, and remains evidence-gated.

## Goal

Create an evidence-first WS3A slice that makes the collaboration system
observable and historically durable before adding heavier coordination
machinery.

Measurable outcomes:

1. A future agent can answer "what happened to this claim?" without
   reconstructing it from the free-text log alone.
2. A future consolidation pass can report open claims, recent claim
   closures, stale archival, open decision threads, and unresolved
   decision threads from structured artefacts.
3. Agents have a lightweight async decision-thread surface for overlap
   discussion, claim references, decisions, and resolutions.
4. No sidebar timeout, owner-escalation directory, or live synchronous
   exchange is required for this slice to be useful.

## Non-Goals

- Do not implement `sidebar_request`, `sidebar_message`,
  `sidebar_resolution`, sidebar timeouts, or the escalation directory.
  Those belong to the sibling sidebar plan.
- Do not add mechanical refusal or locking behaviour to active claims.
  Claims remain advisory signals.
- Do not depend on platform-native agent team features. The system must
  operate through repo-owned Markdown, JSON, commands, rules, skills, and
  hooks.
- Do not make thread records duplicate decision-thread bodies. Thread
  records remain durable narrative continuity; decision threads remain
  narrow operational coordination records.

## Target Shape

### Claim Closure History

Explicit claim closure and stale claim archival should have one durable
history model. The implementation phase should decide the least disruptive
schema shape, but it must satisfy these constraints:

- every closed claim has a durable record outside `active-claims.json`
- records preserve the original claim body, agent identity, areas, intent,
  notes, and lifecycle timestamps
- records distinguish at least explicit close, stale archival, and
  owner-forced close
- each closure can cite evidence such as log entry anchors, decision-thread
  IDs, plan commits, or napkin observations
- active-claims cleanup does not silently erase history

The existing `closed-claims.archive.json` may remain the canonical
history file if its scope and schema are widened deliberately. If the
implementation creates a separate claim-history file instead, the plan
must include a migration and discoverability rationale before landing it.

### Protocol Observability

"Observability" in this plan means repo-owned protocol visibility, not
runtime telemetry. At close, a consolidation pass should be able to
surface:

- open claims and stale claims
- recent explicit claim closures and stale archival events
- open decision threads and stale unresolved decision threads
- unresolved decisions that require owner attention
- evidence bundle links for non-trivial protocol claims

This should be visible from the normal operational surfaces rather than
requiring manual archaeology through every log entry.

### Lightweight Decision Threads

Add `.agent/state/collaboration/conversations/` as the narrow async
coordination surface originally hinted by WS3, but keep v1 intentionally
smaller than the sidebar design.

Initial entry kinds:

- `message` - ordinary async coordination note
- `claim_update` - claim scope, freshness, or closure note
- `decision_request` - a concrete question that needs a peer or owner
  decision
- `decision` - a chosen route with rationale
- `resolution` - thread closure outcome
- `evidence` - link to log, claim, napkin, plan, ADR, or command output

Excluded from this plan:

- `sidebar_request`
- `sidebar_message`
- `sidebar_resolution`
- turn-pair or elapsed-time sidebar rules
- escalation files

The sibling sidebar plan may extend the same conversations directory and
schema later, but it should not be required for WS3A to deliver value.

## Evidence Baseline

Before changing schemas or directives, the implementation must create a
short evidence table in the plan execution notes or commit body covering:

| Evidence Source | Required Reading | Why It Matters |
| --- | --- | --- |
| Shared communication log | `.agent/state/collaboration/log.md` entries from WS0 onward | Shows real coordination events and whether a richer surface was needed. |
| Active claims registry | `.agent/state/collaboration/active-claims.json` | Shows current live state and validates the advisory claim model. |
| Closed claims archive | `.agent/state/collaboration/closed-claims.archive.json` | Shows existing archival semantics and the explicit-close durability gap. |
| Napkin | `.agent/memory/active/napkin.md` WS5 observations | Captures emergent learning and proportionality judgement. |
| Thread record | `.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md` | Captures current owner direction and no-auto-resume constraints. |

The evidence table should explicitly classify the sidebar need as
`validated`, `partially validated`, or `not validated`. WS3A may proceed
without validating sidebar need because it does not implement sidebars.

### WS3A RED Evidence Baseline (2026-04-26)

Owner direction makes WS3A the next executable slice. This baseline is the
RED classification for the start of implementation; GREEN work should cite
it rather than reconstructing the harvest from memory.

| Gap | Classification | Evidence | RED Implication |
| --- | --- | --- | --- |
| Claim-history durability | validated | `closed-claims.archive.json` contains archived Fresh Prince claims with `archived_at`, but no structured `closure` metadata. Later Codex, Keen Dahl, and Sharded lifecycles are primarily in `log.md`. | Add failing claim-history fixtures with `closure.kind`, `closure.closed_at`, and `closure.evidence[]`. |
| Protocol observability | validated | `consolidate-docs` § 7e audits active and stale claims, but does not summarise explicit closures or decision-thread state. | Reserve GREEN work to report closed-claim and decision-thread lifecycle state. |
| Decision-thread surface | partially validated | The shared communication log and active claims handled real non-overlap, overlap, scope-narrowing, and gate-coupling events; citation and resolution state remain free-text. | Add failing open and closed decision-thread fixtures with evidence references. |
| Sidebar / escalation need | not validated | The WS5 harvest found no real sidebar demand; the owner directed WS3B to stay evidence-gated. | Do not create `sidebar_*` entries, timeouts, escalations, or `.agent/state/collaboration/escalations/`. |

Reserved GREEN schema contracts:

- `.agent/state/collaboration/closed-claims.schema.json`
- `.agent/state/collaboration/conversation.schema.json`

These schema files are intentionally absent in RED. Their missing-file
checks fail until GREEN adds the actual contracts.

RED fixtures added:

- `.agent/state/collaboration/fixtures/claim-history/explicit-close.red.json`
- `.agent/state/collaboration/fixtures/claim-history/stale-archive.red.json`
- `.agent/state/collaboration/fixtures/claim-history/owner-forced-close.red.json`
- `.agent/state/collaboration/fixtures/conversations/open-decision-thread.red.json`
- `.agent/state/collaboration/fixtures/conversations/closed-decision-thread-with-evidence.red.json`

RED validation evidence:

| Check | Exit | RED Meaning |
| --- | --- | --- |
| `jq empty .agent/state/collaboration/active-claims.json` | 0 | Active-claims state remains parseable. |
| `jq empty .agent/state/collaboration/closed-claims.archive.json` | 0 | Existing archive remains parseable. |
| `jq -e 'all(.claims[]; has("closure"))' .agent/state/collaboration/closed-claims.archive.json` | 1 | Expected failure: live archive lacks closure metadata. |
| `test -f .agent/state/collaboration/closed-claims.schema.json` | 1 | Expected failure: claim-history schema is not implemented yet. |
| `test -f .agent/state/collaboration/conversation.schema.json` | 1 | Expected failure: decision-thread schema is not implemented yet. |
| `test -d .agent/state/collaboration/conversations` | 1 | Expected failure: runtime decision-thread directory is not implemented yet. |
| `jq empty .agent/state/collaboration/fixtures/claim-history/*.json` | 0 | Claim-history RED fixtures parse. |
| `jq empty .agent/state/collaboration/fixtures/conversations/*.json` | 0 | Decision-thread RED fixtures parse. |
| `git diff --check` | 0 | RED changes do not introduce whitespace errors. |

### WS3A Claim-History GREEN Evidence (2026-04-26)

This GREEN slice implements claim-history only. Decision-thread schema and
runtime directory checks remain intentionally red for the next WS3A slice;
WS3B sidebar, timeout, and escalation semantics remain paused.

| Check | Exit | GREEN Meaning |
| --- | --- | --- |
| `jq empty .agent/state/collaboration/active-claims.json` | 0 | Active claims still parse after claim lifecycle edits. |
| `jq empty .agent/state/collaboration/closed-claims.archive.json` | 0 | Closed archive parses after v1.1.0 migration. |
| `jq -e 'all(.claims[]; has("closure"))' .agent/state/collaboration/closed-claims.archive.json` | 0 | Existing archive entries now carry structured closure metadata. |
| `test -f .agent/state/collaboration/closed-claims.schema.json` | 0 | Closed-claim schema contract now exists. |
| `test -f .agent/state/collaboration/conversation.schema.json` | 1 | Expected remaining RED: decision-thread schema belongs to next slice. |
| `test -d .agent/state/collaboration/conversations` | 1 | Expected remaining RED: runtime decision-thread directory belongs to next slice. |
| Inline Ajv 2020 schema validation | 0 | Closed archive and claim-history fixtures conform to `closed-claims.schema.json`. |
| `git diff --check` | 0 | Claim-history GREEN introduces no whitespace errors. |

### WS3A Decision-Thread GREEN Evidence (2026-04-26)

This GREEN slice implements only the lightweight async decision-thread
surface. WS3A protocol-observability refactor and final validation /
handoff remain pending; WS3B sidebar, timeout, and owner-escalation
semantics remain paused.

| Check | Exit | GREEN Meaning |
| --- | --- | --- |
| `jq empty` on active claims, closed claims, conversation fixtures, and examples | 0 | Collaboration JSON surfaces still parse. |
| `test -f .agent/state/collaboration/conversation.schema.json` | 0 | Decision-thread schema contract now exists. |
| `test -d .agent/state/collaboration/conversations` | 0 | Runtime decision-thread directory now exists. |
| Inline Ajv 2020 schema validation | 0 | Conversation fixtures and examples conform to `conversation.schema.json` while reusing active-claims refs. |
| Targeted markdownlint on touched Markdown files | 0 | Guidance, state docs, and plan updates are markdown-clean. |
| `git diff --check` | 0 | Decision-thread GREEN introduces no whitespace errors. |
| `pnpm practice:fitness:informational` | 0 | Informational practice scan still reports the separate hard `repo-continuity.md` pressure; deep consolidation remains a separate move. |

### WS3A Observability Refactor Evidence (2026-04-26)

This refactor wires protocol visibility into the normal consolidation
ritual, without adding WS3B sidebar, timeout, or owner-escalation
surfaces.

| Surface | Outcome |
| --- | --- |
| `consolidate-docs § 7e` | Now reports active/stale claims, recent closures, open/stale decision threads, unresolved decision requests, evidence-bundle gaps, and schema validation for conversation files. |
| `.agent/state/README.md` | Names the collaboration-state audit outputs and keeps WS3B escalations gated. |
| `collaboration-state-conventions.md` | Records evidence-bundle expectations: claim statement, class, evidence refs, verification status, and next action / owner. |
| `threads/README.md` | Clarifies that handoff cites only open/stale decision threads that change the next safe step. |

### WS3A Close Evidence (2026-04-26)

WS3A closes with claim-history, decision-thread, observability, and
handoff surfaces complete. The sibling WS3B plan remains paused unless
the owner explicitly promotes it or real decision-thread evidence proves
async coordination insufficient.

| Check | Exit | Close Meaning |
| --- | --- | --- |
| `jq empty` on active claims, closed claims, schemas, fixtures, and examples | 0 | Collaboration JSON surfaces parse. |
| `test -f conversation.schema.json && test -d conversations` | 0 | Decision-thread contract and directory are present. |
| Inline Ajv 2020 validation | 0 | Closed-claims archive, claim-history fixtures, and conversation fixtures/examples conform to schemas. |
| Targeted markdownlint on touched Markdown files | 0 | Plan, rule, directive, state, thread, and command docs are markdown-clean. |
| `git diff --check` | 0 | WS3A close introduces no whitespace errors. |
| `pnpm practice:fitness:informational` | 0 | Informational scan still reports `repo-continuity.md` as the only hard practice-fitness debt; deep consolidation remains separate. |

## Workstreams

### WS3A RED - Baseline Evidence and Failing Fixtures

Create the smallest failing proof before implementation.

Tasks:

1. Write or update JSON fixtures for:
   - an explicit claim close
   - a stale claim archive
   - an owner-forced claim close
   - an open decision thread
   - a closed decision thread with evidence references
2. Add validation wiring for the new/changed schemas.
3. Run the targeted validation and confirm it fails because the schema or
   required fixtures do not yet exist.
4. Record the WS5 evidence baseline described above.

Acceptance:

- The failing state is deterministic and documented.
- The failure points at missing or outdated claim-history /
  decision-thread schema support, not unrelated repo breakage.
- The evidence baseline is recorded before design details are locked.

### WS3A GREEN - Durable Claim Closure History

Make claim lifecycle history durable for normal claim closure, not just
stale archival.

Tasks:

1. Evolve `active-claims.schema.json` and the archive/history example
   surface using additive schema evolution where possible.
2. Update claim-close guidance in
   `.agent/rules/register-active-areas-at-session-open.md`,
   `.agent/rules/respect-active-agent-claims.md`, and
   `.agent/directives/agent-collaboration.md`.
3. Update `consolidate-docs` step 7e so stale archival and explicit
   closure history are described consistently.
4. Preserve existing archive entries or migrate them losslessly.

Acceptance:

- A normal close leaves a durable closure record.
- Stale archival still works and remains advisory, not blocking.
- Existing archive entries remain valid or have a documented migration.
- `jq empty` passes for all collaboration JSON files.

### WS3A GREEN - Lightweight Decision Threads

Add the async decision-thread surface.

Tasks:

1. Create `.agent/state/collaboration/conversations/` and a versioned
   decision-thread schema.
2. Add sample open and closed decision-thread files.
3. Document when to use the shared communication log, an active claim,
   a decision thread, the napkin, and the thread record.
4. Update the active-claims rule so overlap decisions can cite a
   decision-thread ID instead of relying only on free-text log prose.

Acceptance:

- The schema validates populated sample entries.
- Decision threads can reference claims, log entries, napkin entries,
  plans, ADRs, and thread records.
- The thread-record-vs-decision-thread distinction is documented.
- No sidebar or escalation semantics are introduced.

### WS3A REFACTOR - Protocol Observability

Make the new state inspectable by normal operational workflows.

Tasks:

1. Extend `consolidate-docs` to report claim-history and decision-thread
   lifecycle summaries.
2. Update `.agent/state/README.md` and collaboration memory guidance so
   agents can discover the new surfaces.
3. Add evidence-bundle expectations for non-trivial collaboration claims:
   claim statement, claim class, evidence references, and verification
   status.
4. Update the agentic-engineering thread record only for current next-step
   continuity; do not turn it into a duplicate protocol manual.

Acceptance:

- A consolidation reader can see open/stale/recently-closed claim state
  and open/stale decision-thread state.
- Evidence requirements are clear enough that future WS5 harvests do not
  require manual reconstruction from every artefact.
- Permanent doctrine changes are in directives/rules/READMEs, not trapped
  in this plan.

### WS3A CLOSE - Validation and Handoff

Run focused validation and leave the sibling sidebar plan accurately
gated.

Minimum validation:

```bash
jq empty .agent/state/collaboration/active-claims.json
jq empty .agent/state/collaboration/closed-claims.archive.json
jq empty .agent/state/collaboration/conversation.schema.json
jq empty .agent/state/collaboration/conversations/*.json
jq empty .agent/state/collaboration/fixtures/**/*.json
pnpm exec markdownlint --dot \
  .agent/plans/agentic-engineering-enhancements/archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md \
  .agent/plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md \
  .agent/commands/consolidate-docs.md \
  .agent/directives/agent-collaboration.md \
  .agent/rules/register-active-areas-at-session-open.md \
  .agent/rules/respect-active-agent-claims.md
git diff --check
```

If schema validation tooling is added, include it in the minimum gate
before closing the plan. If the work touches platform adapters, also run
`pnpm portability:check`.

## Reviewer Routing

- `assumptions-reviewer` - proportionality of adding decision threads
  before sidebar mechanics, and whether the claim-history widening is
  simpler than adding a new file.
- `docs-adr-reviewer` - state-vs-memory boundary, thread-record
  distinction, and whether permanent doctrine has escaped the plan.
- `test-reviewer` - schema fixture and validation quality if automated
  validators are added.

## Risks

| Risk | Mitigation |
| --- | --- |
| Decision threads duplicate thread records | Keep decision threads narrow, cite thread records by slug, and document the distinction in rules and the thread README. |
| Claim history becomes a second free-text log | Require structured closure reason, timestamps, original claim body, and evidence references. |
| Sidebar work sneaks back into WS3A | Keep all `sidebar_*`, timeout, and escalation semantics in the sibling plan. |
| Observability becomes another manual checklist | Wire summaries into `consolidate-docs` so the normal operational ritual surfaces the state. |
| Schema evolution breaks existing entries | Use additive schema changes where possible and migrate existing archive entries losslessly if needed. |

## Foundation Alignment

- **Principles**: advisory protocol, simple before clever, durable
  evidence for non-trivial claims, and platform independence.
- **Testing Strategy**: write failing schema/fixture proof before
  implementation; run targeted deterministic validation before closure.
- **Schema-First Execution**: schema changes and examples land before
  workflow prose relies on them.
- **PDR-027**: preserve the distinction between durable thread identity /
  session continuity and narrow operational coordination.
- **ADR-125**: keep operation platform independent; adapters may mirror,
  but repo-owned artefacts remain canonical.

## Completion Rule

This plan is complete when durable claim closure history, decision-thread
schema/examples, protocol observability wiring, and documentation
propagation have landed with validation evidence. Completion should leave
the sidebar plan either still evidence-gated or explicitly promoted by
owner direction, never implicitly resumed.
