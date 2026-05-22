# ADR-182: Mid-Cycle Handoff Record Substrate

**Status**: Proposed 2026-05-22
**Date**: 2026-05-22
**Related**:
PDR-063 (mid-cycle retirement protocol — the genotype this ADR
implements);
[ADR-150](150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
(continuity and handoff surfaces — peer surface in the
collaboration-state substrate);
[ADR-181](181-agent-team-start-and-action-log.md)
(agent team start ritual + action-trace surface — peer team-state
surface).

## Context

PDR-063 introduces the mid-cycle retirement protocol as a portable
five-step pattern for token-bounded agents: sense approaching budget
→ freeze work-in-progress to a structured handoff record → extend
the active claim → hand off via a directed comms-event → retire. The
protocol is a portable principle.

This ADR captures the **phenotype** — the concrete substrate inside
this repository that the protocol mounts onto. The PDR cross-
references this ADR; the ADR can be revised without touching the
PDR's principle, and the PDR can be referenced by other
implementations without inheriting this repo's specifics.

## Decision

### Handoffs directory

Mid-cycle handoff records live under
`.agent/state/collaboration/handoffs/` as a first-class peer of the
existing collaboration-state subdirectories (`comms/`, `comms-seen/`,
`conversations/`, `escalations/`).

Each handoff record is one JSON file, content-addressed by the
active claim's `claim_id` (UUID). One record per claim at any time;
a claim that retires twice in succession writes a versioned filename
(`<claim_id>.<n>.json`) and the active-claims entry's pointer field
updates to the latest version.

### Handoff record schema

A new JSON schema at
`.agent/state/collaboration/handoff-record.schema.json` defines the
strict shape, with required properties for the four named sections
(current edit state, in-flight reasoning, decisions made, decisions
deferred) per PDR-063.

A reference example record lives at
`.agent/state/collaboration/handoffs/EXAMPLE.json` so future agents
have a worked instance.

### Active-claims schema extension

A new optional field `handoff_record_path` is added to the
active-claims schema (`active-claims.schema.json`). Its presence
signals "this claim is mid-cycle and carries a handoff record"; its
absence signals normal active-claim semantics. Existing readers
ignore the field without breakage (per the additive-extension
discipline in PDR-049 and PDR-050).

### Comms-event message_kind value

The directed comms-event shape carries a `message_kind` sub-
discriminator. A new value `mid-cycle-handoff` is introduced.
Strict readers already accept arbitrary `message_kind` strings; no
schema migration is required (the orthogonal `tags` extension is
governed by ADR-183 and PDR-066, not this ADR).

### Skill amendments

The `start-right-team` SKILL §Closeout Contract gains a subsection
naming mid-cycle retirement as a distinct closeout mode following
PDR-063 instead of the natural-boundary contract.

The `start-right-team` SKILL First Moves order is extended for
agents picking up claims with `handoff_record_path` set: the
handoff record is read before any source edit (peer of reading the
thread record and current plan body).

### Landing tranche

The substrate lands in two tranches:

1. **Tranche 1** — directory creation; optional claim-schema field
   addition; SKILL §Closeout amendment. Lands before the first
   rotating-cast Round 1 (PDR-063 stress test).
2. **Tranche 2** — strict handoff-record JSON schema; `EXAMPLE.json`
   reference record drawn from the first observed instance; SKILL
   First Moves extension. Lands after Round 1 with refinements
   absorbed from the worked instance.

Each tranche is one commit. PDR-063 governs the principle; this ADR
governs the substrate; the tranching governs the rollout.

## Rationale

**Why a separate ADR from PDR-063.** PDR-063 is a portable
principle: any token-bounded multi-writer system with active claims
needs the protocol shape it describes. The repo-specific substrate
(directory name, schema filenames, field name, message_kind value)
is implementation; binding it into the PDR would force every future
reader to reason about Oak-specific paths to understand the
principle. The genotype/phenotype split keeps the principle
portable and the implementation actionable.

**Why file-per-handoff under a dedicated directory.** Claims are
operational state with a compact-envelope discipline; handoff
records are content artefacts with their own lifecycle. Conflating
them at the schema layer is a category error. The dedicated
directory aligns with the existing PDR / ADR / plan convention
(file-per-decision, content-addressed by name).

**Why an optional schema field, not a new claim kind.** A new claim
kind forces every claim reader to disambiguate "ordinary" versus
"mid-cycle" at every read site. An optional `handoff_record_path`
field is additive: readers that do not understand it ignore it;
readers that do understand it branch on its presence. Matches
PDR-049 + PDR-050 additive-extension discipline.

**Why a new `message_kind` value, not a new event kind.** Adding a
value to an existing field surface is the smallest change that
satisfies the protocol. New event kinds force parser amendment +
renderer amendment + reader compatibility; new values do not.

**Why two-tranche rollout.** Tranche 1 is the minimum substrate that
makes the PDR-063 stress test possible. Tranche 2 is the
strictness layer (JSON schema, reference example) that benefits
from the first worked instance. Landing both before any empirical
evidence would over-specify; landing neither before Round 1 would
leave the stress test substrate-less.

## Consequences

### Required

- The handoffs directory exists as a substrate peer to other
  collaboration-state subdirectories.
- The handoff-record schema file lands in Tranche 2; until then the
  shape is unenforced and validated by readers per PDR-063's four
  named sections only.
- The active-claims schema is amended additively to expose the
  optional field.
- A reference example record exists by Tranche 2.

### Forbidden

- Embedding handoff-record content inline on claims entries (the
  carriage decision is structural, not stylistic).
- Using `mid-cycle-handoff` `message_kind` for natural-boundary
  closeouts.
- Mutating an already-written handoff record (records are
  append-only; corrections write a versioned successor and update
  the claim's pointer).

### Accepted Cost

- One new directory under `.agent/state/collaboration/`.
- One new JSON schema file (Tranche 2).
- Optional schema field amendment (Tranche 1).
- Tranche-1 commit + Tranche-2 commit.

## Open questions deferred to first-instance observation

These match the open questions in PDR-063; the ADR carries them so
both surfaces remain coherent.

1. Retirement-budget reserve size for the handoff-record write
   (PDR-063 estimates 2–5 k tokens).
2. Picker contention on simultaneous receipt of a `mid-cycle-
handoff` event.
3. Re-retirement carriage (versioned filename per the tranche above
   is the proposed shape; first-instance evidence will confirm).
4. Coordinator-role mid-cycle handoff intersection with PDR-064
   (active-acknowledgement boundary).
