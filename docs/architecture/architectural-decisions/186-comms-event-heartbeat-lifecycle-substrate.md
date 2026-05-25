# ADR-186: Comms-Event Heartbeat Lifecycle Substrate

**Status**: Accepted 2026-05-24
**Date**: 2026-05-24
**Related**:
PDR-078 (liveness-heartbeat contract — the portable genotype this
ADR provides the repo-bound phenotype for; **Status: Candidate**
at the time of ADR-186 landing; ratifies Candidate→Accepted at
Cycle 8 of `post-m1-attestation-tidy-up.plan.md` concurrent with
the thin `start-right-team` SKILL §0.5 pointer adopting it as
authoritative contract);
[ADR-183](183-comms-event-tag-namespace-substrate.md) (comms-event
tag namespace substrate — heartbeat is a registered consumer of
the `"heartbeat"` tag in ADR-183's `["failure-mode",
"behaviour-note", "heartbeat"]` namespace; the watcher's
`[HEARTBEAT]` render token composes through that namespace
substrate);
[ADR-182](182-mid-cycle-handoff-record-substrate.md) (mid-cycle
handoff record substrate — orthogonal lifecycle dimension; the
two phenotypes share the comms-event substrate but bind to
different lifecycle moments).

## Context

PDR-078 establishes the portable liveness-heartbeat contract:
agents in multi-agent team sessions emit heartbeat events at a
bounded cadence with explicit retirement-on-silence semantics. The
contract is portable — it names the cadence, the threshold, the
redundancy rule, and the exemption set, but it deliberately leaves
the substrate (which event-shape carries the heartbeat, which
field discriminates it, which CLI surfaces emit and consume) to
each host repository's phenotype ADR.

This repository's comms-event substrate (per the schema at
`.agent/state/collaboration/comms-event.schema.json`) already
carries three event kinds — `narrative`, `lifecycle`, and
`directed` — and an open-string `event_type` sub-kind on
`lifecycle` events (per the schema description: _"Examples:
comms_event, consolidation_open, consolidation_close,
claim_lifecycle."_). ADR-183 has further extended each event kind
with an optional `tags` array whose namespace includes
`"heartbeat"`, and the CLI watcher already renders heartbeat-
tagged events with a `[HEARTBEAT]` channel token composed from
that tag namespace.

The phenotype question this ADR closes: **which event-shape
carries a heartbeat going forward, and how is it distinguished in
render?** The operational heartbeat substrate that has emerged
inside this repo during the M1 Safe Pause cycle uses
`narrative + tags: ["heartbeat"]` (observable in any session's
comms event stream — for example the team-session events captured
under `.agent/state/collaboration/comms/` during the 2026-05-24
team session that landed PDR-078 at commit `9725ae09`). That
shape works, but it conflates a _liveness-substrate_ signal with
the _narrative-authored-communication_ event kind.

The cleaner classification is to bind heartbeats to the
`lifecycle` event kind — heartbeats ARE lifecycle moments — with
`event_type='heartbeat'` as the sub-kind discriminator. The
`lifecycle` kind already carries the right metadata shape
(`occurred_at`, `agent_id`, distinct from authored content) and
the open-string `event_type` accepts new values without schema
amendment.

## Decision

### Phenotype

The comms-event substrate carries a designated lifecycle-substrate
event-type for heartbeat liveness, distinguished in watcher
render. This is the repo-bound concrete realisation of PDR-078's
portable liveness contract.

The chosen realisation for this repository:

- **Event kind**: `lifecycle` (per the schema's existing
  `LifecycleCommsEvent` definition).
- **Event sub-kind**: `event_type='heartbeat'`. The `event_type`
  field is open-string with `minLength: 1` per the existing
  schema; no schema amendment is required to admit the new value.
- **Tag composition**: an emitted heartbeat MAY also carry
  `tags: ["heartbeat"]` per ADR-183's namespace during the
  transition window; once all emitters use `lifecycle +
event_type='heartbeat'`, the tag becomes redundant on heartbeat
  events specifically (but the tag remains valid for other event
  kinds that want to carry heartbeat semantics for compositional
  reasons).
- **Identity discipline**: per PDR-027 + PDR-076a, every
  heartbeat carries the emitting agent's identity tuple `(agent_name,
platform, model, session_id_prefix)` in the standard
  `agent_id` field.

### Render rule

The watcher renderer at
`agent-tools/src/collaboration-state/comms.ts` (see
`renderLifecycleEvent` at the function around line 119–127, which
currently emits `[lifecycle:${event.event_type}] ${event.title}`)
SHALL tolerate any `event_type` string and emit a stable channel
token. Specifically:

- Existing format `[lifecycle:<event_type>]` is the default
  rendering for unrecognised event-types — this is the
  tolerate-unknown-event-type rule. Future lifecycle event-types
  do not break existing watchers; they render with their literal
  sub-kind name and continue to surface in the all-channels feed.
- `event_type='heartbeat'` MAY additionally render with a
  conventional `[HEARTBEAT]` channel token (composed through
  ADR-183's tag-namespace renderer if the event also carries
  `tags: ["heartbeat"]`, OR introduced as a special-case render
  for the lifecycle:heartbeat sub-kind specifically). Either
  realisation satisfies the OUTCOME of "heartbeats are
  distinguished in render".

The render rule is an OUTCOME assertion: every watcher
implementation MUST distinguish heartbeat events from
non-heartbeat lifecycle events at a glance. The exact token form
is implementation detail; the substrate guarantee is the
distinguishability.

**At-most-once render guarantee**: a single heartbeat event MUST render the `[HEARTBEAT]` channel token at most once, regardless of which mechanism produced it. An event carrying both the lifecycle-substrate discriminator (`event_type='heartbeat'`) and the legacy tag (`tags: ["heartbeat"]`) — legitimate during the migration window — MUST NOT double-render the token. The renderer implementation SHALL deduplicate across the tag-namespace path and the lifecycle-special-case path.

### Schema posture

No schema amendment is needed. The existing schema at
`.agent/state/collaboration/comms-event.schema.json` (version
`2.0.0`) accepts `lifecycle` events with `event_type='heartbeat'`
without modification. This is load-bearing: it lets agents adopt
the lifecycle-heartbeat shape incrementally, without a coordinated
all-emitters cutover or a schema migration.

### Migration discipline

Existing operational heartbeats emitted as `narrative + tags:
["heartbeat"]` (observable in the comms stream during this
session and prior team sessions) remain valid during the
transition window. The migration to `lifecycle +
event_type='heartbeat'` happens at each emission site's next
natural cycle (a CLI flag update, a SKILL §0.5 refresh, a
heartbeat-loop refactor) — not as a coordinated cutover. The
shared rendering convention (the `[HEARTBEAT]` token) absorbs
both shapes through ADR-183's tag composition until all emitters
migrate.

**Consumer dual-filter contract**: any consumer that
discriminates on heartbeat events (most importantly the
retirement-detection logic that drives the 10-minute auto-
rebalance per PDR-078) MUST accept both shapes during the
migration window. The canonical predicate is:

```text
(kind = 'lifecycle' AND event_type = 'heartbeat')
  OR
(kind = 'narrative' AND tags includes 'heartbeat')
```

A consumer that filters on only one shape will silently
undercount heartbeats and falsely fire retirement on agents
that have migrated to the other shape. **Consumers MUST migrate
to the dual-filter predicate before any emitter switches to
the lifecycle shape**; consumer migration precedes emitter
migration in the canonical sequence. The agent-tools CLI
watcher consumes via render and naturally accepts both shapes
via the `[HEARTBEAT]` token; the retirement-detection logic
named in PDR-078 acquires the dual-filter discipline as part
of its own next-cycle update.

**Migration window closure signal**: the dual-shape window
closes when (a) all named heartbeat emitters in this repository
(SKILL §0.5 reference implementation, agent-tools CLI heartbeat
surface, any other documented emitters) have landed the
lifecycle shape, and (b) a sweep of the operational
comms-event stream confirms zero recent `narrative + tags:
["heartbeat"]` events across one full team-session cycle. At
that point a follow-on tidy cycle removes the dual-filter
predicate's `narrative` clause and the tag becomes redundant on
heartbeat events specifically. Until that closure cycle lands,
consumers carry the dual filter.

## Rationale

### Why lifecycle, not narrative

A heartbeat is not authored communication; it is a liveness
signal. The `narrative` event kind exists for "an authored,
titled, bodied communication addressed to the team" (per the
schema description). Heartbeats fit none of those qualifiers
substantively — they are templated, identity-bound, and consumed
by tooling rather than read by peers. Binding heartbeats to
`lifecycle` matches the substrate to the semantic.

### Why open-string `event_type`, not enum

The existing schema chose an open-string `event_type` field
precisely to allow new lifecycle moments to land without schema
churn. The cost of an enum amendment is a coordinated schema
migration; the cost of accepting a new open-string value is zero.
Heartbeat adoption inherits the open-string design's flexibility.

### Why tolerate-unknown-event-type, not strict enum render

The watcher renderer is consumed by every team agent on every
event. A strict enum at render time would mean any new lifecycle
event-type (heartbeat today, claim-lifecycle tomorrow, some-
future-substrate next quarter) silently fails to render or fails
loudly until the renderer's enum is amended. Tolerate-unknown is
forward-compatible: render falls back to the literal sub-kind
name, the agent still sees the event, and the substrate can
evolve without renderer-version coordination.

### Why no all-emitters cutover

A coordinated cutover from narrative+tag to lifecycle+event_type
would require every emitter (every running team session's
heartbeat cron, every CLI wrapper, every documentation surface
that prescribes the emission shape) to land the new shape in the
same change. ADR-183's tag-namespace rendering already provides
backward-compatible `[HEARTBEAT]` rendering for narrative+tag
heartbeats; the lifecycle-heartbeat shape can land alongside
without breaking the operational substrate. This matches the
PDR-049 + PDR-050 additive-extension discipline.

## Consequences

### What this enables

- New heartbeat emitters use the cleaner `lifecycle +
event_type='heartbeat'` shape; the substrate names the
  classification explicitly.
- Future lifecycle event-types (a hypothetical
  `event_type='cycle-boundary'` for marshal-cycle ticks, or
  `event_type='claim-rebalance'` for retirement-rebalance
  moments) land without schema or renderer amendments.
- Consolidation surfaces (PDR-014 capture → distil pipeline) can
  filter the comms stream cleanly by `kind='lifecycle' AND
event_type='heartbeat'` rather than by tag-string match against
  narrative events.
- PDR-078's portable contract is honoured by this repo's
  phenotype without forcing other host repos to adopt the same
  realisation. A host repo with a different substrate (e.g. no
  lifecycle kind) can choose a different phenotype ADR; PDR-078
  remains unchanged.

### What this costs

- Two heartbeat-emission shapes coexist during the migration
  window: narrative+tag (legacy) and lifecycle+event_type
  (canonical). Tools that consume heartbeats must accept both.
- The tolerate-unknown-event-type render rule means an
  accidentally-typoed `event_type` (e.g. `'heatbeat'`) will
  render literally without an error signal, and the
  retirement-detection consumer will not recognise the typo'd
  event — the 10-minute threshold then fires false-positive
  retirement-rebalance on an agent that is in fact alive. This
  is a resilience-critical exposure of the open-string render
  rule and the cure shape MUST hold across every emitter:
  - Every heartbeat emitter MUST use a single typed-constant
    source for the `event_type='heartbeat'` literal (e.g. the
    agent-tools CLI heartbeat surface's exported constant
    `HEARTBEAT_EVENT_TYPE`). String-literal duplication of the
    `'heartbeat'` token across emitter sites is a violation of
    this ADR and is grounds for a follow-on fix cycle.
  - The agent-tools CLI heartbeat surface is the canonical
    emission point and enforces the literal by construction
    (TypeScript type-narrowing on the constant).
  - SKILL §0.5 reference implementations and any host-local
    heartbeat-loop scripts MUST cite the typed constant by name
    rather than copying the string. Hand-rolled emitters
    bypassing the typed constant carry the typo risk explicitly
    and the next consolidation pass should route them to the
    canonical surface.
- The migration is opportunistic, not deterministic — emission
  sites convert at their next natural cycle. Until that
  completes, the operational substrate carries mixed shapes and
  the consolidation pipeline must handle both.

### What this forbids

- A future amendment cannot retroactively introduce a strict
  enum on `event_type` without breaking the tolerate-unknown
  guarantee. Any move toward stricter validation must be a
  separate ADR with its own justification and a coordinated
  schema migration plan.
- Heartbeat emitters MUST NOT use a different `event_type` string
  for liveness signalling (e.g. `'liveness'`, `'tick'`,
  `'pulse'`). The substrate name is `'heartbeat'`; alternative
  names would fragment the consolidation surface and break the
  `[HEARTBEAT]` rendering convention.

## Validation

The ADR's deterministic validation per the parent plan's Cycle 7
acceptance criteria:

1. This file exists at the path
   `docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md`
   and references both PDR-078 and ADR-183 in §Related.
2. `event_type='heartbeat'` is admitted by the schema without
   amendment: the field declaration at
   `.agent/state/collaboration/comms-event.schema.json` (the
   `lifecycle` event definition's `event_type` property) is
   `{ "type": "string", "minLength": 1 }`, accepting any non-
   empty string including `"heartbeat"`.
3. The watcher renders heartbeat events with a `[HEARTBEAT]`
   channel token via ADR-183's tag-namespace composition — this is
   observable in any team session's comms stream where heartbeat
   events with `tags: ["heartbeat"]` are emitted (the current
   operational shape). When lifecycle-shaped heartbeats land, the
   renderer's tolerate-unknown rule guarantees they continue to
   surface, with the conventional `[HEARTBEAT]` token introduced
   per the render rule above.
4. The ADR index at
   `docs/architecture/architectural-decisions/README.md` includes
   the ADR-186 entry.
5. `pnpm check` passes; `pnpm --filter @oaknational/agent-tools
test` passes.

The lifecycle-shape first-instance emission (an actual `lifecycle

- event_type='heartbeat'` event in the comms stream) is a Cycle 8
  verification step concurrent with PDR-078 ratification, not an
  ADR-186 prerequisite. ADR-186's substrate guarantees are
  validated against the schema and renderer surfaces that already
  exist; the lifecycle emission lands when the canonical agent-tools
  CLI heartbeat surface migrates to the typed constant per §What
  this costs.

## Notes

### Why ADR-186 lands while PDR-078 is Candidate

PDR-078 was authored at Status: Candidate per Charcoal Brazing
Kiln's resume contract at commit `9725ae09`. ADR-186 lands while
PDR-078 is still Candidate because the phenotype is a precondition
for ratifying the contract: PDR-078 ratifies Candidate→Accepted at
Cycle 8 of `post-m1-attestation-tidy-up.plan.md` (concurrent with
the thin `start-right-team` SKILL §0.5 pointer landing), at which
point the contract is validated against this phenotype's
substrate. The ordering matches the plan's stated phenotype-
precedes-ratification pattern: the phenotype provides the
deterministic-validation surface that ratification depends on.

### Build-vs-Buy attestation

No third-party vendor is touched by this ADR. The substrate is
this repository's own schema and watcher; the standard cited
(open-string `event_type`) is the schema's own existing design.
Per the parent plan's §Preflight, ADR-186 carries the explicit
Build-vs-Buy attestation: **no third-party vendor touched by this
ADR**.

### Forward consumers

The cleaner consolidation-surface filter named in §Consequences
(`kind='lifecycle' AND event_type='heartbeat'`) is a natural
follow-on. Consolidation tooling that adopts the filter (e.g. the
`oak-consolidate-docs` skill's evidence-extraction pass, the
agent-tools CLI's heartbeat-counting subcommand) does so at its
own cycle; ADR-186 names the available substrate, not the
deadline.
