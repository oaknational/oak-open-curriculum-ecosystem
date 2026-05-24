# ADR-183: Comms-Event Tag Namespace Substrate

**Status**: Accepted 2026-05-22
**Date**: 2026-05-22
**Related**:
PDR-066 (comms-events as real-time failure-mode capture channel —
the genotype this ADR implements);
[ADR-181](181-agent-team-start-and-action-log.md) (team-start ritual
and action-trace surface — peer team-state substrate);
ADR-182 (mid-cycle handoff record substrate — orthogonal schema
layer; tags here vs message_kind values there).

## Context

PDR-066 establishes the principle that the comms-event stream is the
durable real-time channel for failure-mode capture under team
operation, with tag-based discrimination on existing event kinds.
The principle is portable; any multi-writer system with a shared
event stream can adopt the same shape.

This ADR captures the **phenotype** — the concrete substrate inside
this repository that the principle mounts onto: the JSON schema
field, the field's values, the CLI rendering convention, the
landing-tranche plan, and the file paths involved.

The PDR cross-references this ADR. The ADR can be revised without
touching the PDR's principle; the PDR can be referenced by other
implementations without inheriting this repo's specifics.

## Decision

### Schema field

The comms-event schema at
`.agent/state/collaboration/comms-event.schema.json` is extended
with one new optional top-level field on each of the `narrative`,
`lifecycle`, and `directed` event definitions:

```json
"tags": {
  "type": "array",
  "items": { "type": "string" },
  "uniqueItems": true
}
```

The field is **optional**. The `additionalProperties: false`
constraint on each existing definition is preserved; only the
explicit new field is added. Existing events without `tags`
continue to validate against the migrated schema.

### Tag namespace

The initial tag set:

- `"failure-mode"` — substantive failure mode worth surfacing per
  PDR-066's discrimination rules.
- `"behaviour-note"` — softer category; behavioural pattern worth
  surfacing without yet rising to failure-mode shape.

The namespace stays small. New tags require an ADR amendment with
explicit second-instance evidence; ad-hoc tag inflation is
forbidden.

### CLI rendering

The watch CLI invoked through `pnpm agent-tools:collaboration-state
-- comms watch` renders the existing `[BROADCAST]` / `[GROUP]` /
`[DIRECTED]` / `[LIFECYCLE]` channel discriminator on the first line
of each event, derived from the event's structural shape.

When `tags` is present and non-empty, the CLI composes the channel
discriminator with the tag-derived discriminator on the same first
line:

- `failure-mode` tag → `[FAILURE-MODE]` token after the channel
  discriminator.
- `behaviour-note` tag → `[BEHAVIOUR-NOTE]` token after the channel
  discriminator.

Example renderings:

- `[BROADCAST] [FAILURE-MODE] <title> ...`
- `[DIRECTED] [BEHAVIOUR-NOTE] <title> ...`

Events without `tags` render unchanged.

### Body convention enforcement

PDR-066 prescribes the four-section body shape (Observation /
Diagnosis / Cure / Pointer) for failure-mode events. The substrate
does NOT enforce this at the schema layer (the body field is
free-form prose by design). Enforcement is conventional, captured
in the SKILL referenced from PDR-066's §Consequences.

### Landing tranche

The substrate lands in two commits, in order:

1. **Schema-amendment commit** — the `comms-event.schema.json` edit
   adding the optional `tags` field on each of the three event
   kinds. Strict readers loading the new schema now accept events
   with or without `tags`. **This commit lands first.**
2. **CLI rendering update commit** — the `pnpm
agent-tools:collaboration-state -- comms watch` rendering is
   updated to compose tag tokens with channel tokens. Lands in the
   same commit as step 1 or the immediately following commit.

Only after both land do agents begin writing events with `tags`.
Writing tagged events before step 1 produces events that fail
validation against the still-old schema for any reader on the old
schema; writing before step 2 produces events the watcher does not
render with the new prefix.

### Skill amendments

The `start-right-team` SKILL adds a subsection naming PDR-066 as
the governing protocol for real-time failure-mode capture (or
extends an existing closeout-related subsection). The SKILL §0
all-channels watcher requirement is unchanged; this ADR's CLI
rendering update preserves the watcher's existing channel-tag
contract and adds tag tokens additively.

The closeout napkin discipline (active napkin file
`.agent/memory/active/napkin.md`) is updated: agents at session
close read their own session's failure-mode events from the comms
substrate and consolidate them into napkin / `distilled.md`
entries, rather than capturing fresh.

## Rationale

**Why a separate ADR from PDR-066.** PDR-066 is a portable
principle: any multi-writer system with a shared real-time event
stream can adopt tag-based discrimination for failure-mode capture.
The repo-specific phenotype (the exact schema field shape, the CLI
command path, the rendering tokens, the migration tranche, the
specific file paths) is implementation; binding it into the PDR
would force every future reader to reason about Oak-specific
substrate to understand the principle.

**Why optional + additive, not strict.** Existing events lack
`tags` and must continue to validate. The optional + additive
extension matches PDR-049 + PDR-050 substrate-extension discipline.

**Why two-commit landing tranche, not one.** The schema must land
before any tagged event is written, otherwise strict readers
reject the new field on existing-shape readers. The CLI rendering
update may land in the same commit as the schema, or one commit
later — but never before the schema. The tranche enforces the
correctness ordering.

**Why no backfill of existing napkin entries to comms-events.** The
existing napkin failure-mode entries are already in their
consolidation home. Re-creating them as historical comms-events
would inflate the comms substrate without operational benefit (no
agent is going to "watch" historical failure modes; they are
doctrine inputs, not real-time signals). The migration is forward-
only.

## Consequences

### Required

- `comms-event.schema.json` is extended additively per the schema
  field above (Tranche 1).
- The watch CLI renders tag tokens per the rendering convention
  above (Tranche 1 or Tranche 2).
- The `start-right-team` SKILL points at PDR-066 for the real-time
  failure-mode capture protocol.
- The closeout napkin discipline reads failure-mode events from the
  comms substrate rather than capturing fresh.

### Forbidden

- Writing events with `tags` before Tranche 1 lands. Old-schema
  strict readers reject the unknown field.
- Adding tags to the namespace without an ADR amendment + explicit
  second-instance evidence. The namespace stays small by design.
- Renaming `failure-mode` or `behaviour-note` after first use. The
  CLI rendering and the consolidation flow depend on stable tag
  identifiers.
- Enforcing the four-section body shape at the schema layer. The
  body field remains free-form prose; the convention is a SKILL-
  level discipline.

### Accepted Cost

- One schema-amendment commit + one CLI-update commit (may be the
  same commit).
- A modest increase in event volume on team sessions; the
  watcher's self-exclusion discipline handles peer-of-self
  filtering, so a single agent's notification load is bounded by
  the agents-not-self count, unchanged by the field addition.

## Open questions deferred to second-instance observation

These match the open questions in PDR-066; the ADR carries them so
both surfaces stay coherent.

1. Tag namespace boundary stability (additions require ADR
   amendment + evidence).
2. Cross-session failure-mode threading via `in_response_to`.
3. Consolidation cadence under rotating-cast operation.
4. Tag fitness pressure (deletion / archival / decay).
