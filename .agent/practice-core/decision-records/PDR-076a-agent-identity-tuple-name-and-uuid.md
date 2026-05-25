---
pdr_kind: governance
---

# PDR-076a: Agent Identity Tuple `(name, UUID id)`

**Status**: Accepted
**Date**: 2026-05-23
**Adopted**: 2026-05-24
**Related**:
[PDR-076b](PDR-076b-body-file-frontmatter-contract.md)
(body-file frontmatter contract — co-emerged from the same
owner direction on 2026-05-23; structurally separate decision
at the body-file layer rather than the identity-tuple layer);
[PDR-076](PDR-076-agent-identity-tuple-and-body-file-frontmatter.md)
(superseded stub — the original bundled PDR; retained as the
historical record of the single owner direction that ratified
both this PDR and PDR-076b);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, and agent identity — this PDR extends the
identity contract from a four-field tuple with a short
session-id prefix to a two-field canonical pair plus a
session-id prefix retained only as a chat-readable short form);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(perturbation-mechanism bundle — Family A Class A.2 installs the
tripwires that make the identity contract environmental rather
than passive guidance; this PDR strengthens the contract those
tripwires audit);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(inter-agent collaboration protocol — every identity-bearing
collaboration artefact named here flows through that protocol's
substrate);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator handoff two moments — coordinator-role events
identify the outgoing and incoming coordinator by the identity
tuple this PDR defines);
[PDR-073](PDR-073-recursion-as-method-is-practice-core-mind-shape.md)
(recursion as method — identity collisions corrupt attribution
on the recursive substrate);
[`practice-index.md`](../../practice-index.md) (host adoption and
implementation bridge).

## Context

PDR-027 established the thread/session/identity vocabulary and the
additive-identity rule. Its identity row carries four fields:
`agent_name`, `platform`, `model`, `session_id_prefix` (the first
six characters of the harness session id, or `unknown`). The
`session_id_prefix` is both the routing disambiguator (when two
sessions on the same platform/model share a derived name) and the
short form rendered in chat surfaces.

Two operational pressures expose a gap in that shape:

1. **Same-name collisions across platforms within a single team
   window.** When two agents derive the same `agent_name` from
   different platforms or models in the same window, the four-field
   tuple still resolves them, but routing surfaces (broadcasts,
   directed events, claims) rendered as `<name> / <platform> / <id>`
   carry weight in the `session_id_prefix` that a six-character slice
   does not always guarantee. A six-character collision is rare but
   not impossible; the slice was chosen for readability rather than
   uniqueness. The team has begun to see name collisions where the
   prefix is the only disambiguator and that prefix is operating
   beyond its design role.

2. **The identity contract has no canonical disambiguator that is
   guaranteed-unique by construction.** Derived names are
   deterministic from a seed but the seed space is small; session-id
   prefixes are short by design; `platform + model + agent_name` is
   the documented identity key but is not unique-by-construction at
   the chat-readable rendering layer. Every downstream substrate
   that records or consumes identity (active claims, commit-queue
   intents, comms event participants, thread identity rows) inherits
   the disambiguator weakness.

The two pressures share a root: the identity tuple as PDR-027
shapes it carries a routing role (the six-character prefix) inside
a field whose other purpose is chat readability. The two roles need
to separate.

A third, structurally separate pressure on the same owner direction
— body-file authorship over a shared temporary-file namespace — is
addressed by [PDR-076b](PDR-076b-body-file-frontmatter-contract.md)
at the body-file layer rather than the identity-tuple layer.

## Decision

The §Decision items below are **conditional on the PDR-027
Amendment-Log entry landing first** (see §Cascade item 1). This PDR
is the principle-layer ratification; the operative form of the
redefinition lives in PDR-027's Amendment Log once that amendment
lands. Until then, the items here are the agreed shape; the binding
contract is PDR-027 as amended.

The canonical agent identity becomes a **two-field tuple**:

- `agent_name` — the deterministic or owner-assigned display name.
  Remains the **primary** human-readable identifier. Renders in
  prose, chat surfaces, and identity rows as the lead field.
- `id` — a full UUID assigned at session-identity-derivation time.
  Becomes the **canonical disambiguator**: unique by construction,
  stable across the session's lifetime, and the field every
  identity-bearing collaboration artefact MUST resolve to when
  there is any routing ambiguity.

Two consequential redefinitions follow:

1. **`session_id_prefix` is retained but demoted.** The six-character
   prefix derived from the harness session id remains in the
   identity block as a chat-readable short form and as a debugging
   convenience. It is **no longer** the canonical disambiguator.
   Surfaces that previously routed on `session_id_prefix` MUST
   resolve to `id` when the disambiguation is non-trivial; chat
   rendering may continue to display `session_id_prefix` as a
   compact courtesy alongside the canonical pair.
2. **The identity key becomes `(agent_name, id)`.** The routing
   disambiguator at every collaboration substrate consumer is the
   two-field `(agent_name, id)` pair. `platform` and `model` remain
   on the identity row per PDR-027's existing role for them and are
   not the routing weight. Whether PDR-027's existing
   `platform + model + agent_name` triple needs renaming (e.g. as a
   classification tuple distinct from the routing key) is a
   separate question for the PDR-027 Amendment Log; this PDR does
   not pre-empt that choice.

This PDR is the principle layer. The downstream tranches
(schema amendments, tooling enforcement, host-local
implementation routes) are recorded in §Cascade for separate
landing cycles.

## Rationale

The load-bearing move is **separating the routing role from the
chat-rendering role** in the identity tuple. Today's
`session_id_prefix` carries both roles: it is the
six-character disambiguator AND the field humans read alongside
the agent name. Conflating those roles makes the field optimal
for neither.

- As a disambiguator, six characters provides ~2.8×10⁹ collision
  space, which is large in absolute terms but small for an
  agent ecology where derived names also have small collision
  spaces. The combinatorial weakness compounds.
- As a chat-readable rendering, six characters is correct — long
  enough to disambiguate two agents in a short broadcast, short
  enough not to bloat prose.

A UUID solves the disambiguator role unconditionally (the
collision space is large enough for practical purposes to ignore
as an operational concern) and retains the readable short form
for the chat-rendering role. Routing consumers (write-side
validation, claim resolution, comms-event recipient matching,
peer self-exclusion in watch streams) settle on `id`; chat
surfaces continue rendering the short form for human readers.

**Rejected alternatives**:

- **Lengthen `session_id_prefix` to 12 or 16 characters and call
  it done.** A longer slice reduces collision probability but
  conflates the same two roles. Routing consumers still parse a
  chat-readable string; chat surfaces still render a long
  disambiguator. The two-role conflation is the structural
  defect, not the slice length.
- **Single-field identity (UUID only, no `agent_name`).** Loses
  the human-readable identifier that PDR-027 deliberately
  preserves. Names carry weight in chat surfaces and in agent
  recognisability across sessions. Dropping the name would
  trade a real loss for a marginal disambiguator gain.

## Worked Instance

The trigger evidence is the cumulative cluster of name-collision
near-misses across the recent multi-agent team windows: derived
names have repeated, and disambiguation has fallen back to the
six-character session-id prefix. No single near-miss is
catastrophic; the cluster motivates moving the disambiguator role
to a field designed for it.

**Predicted consequences — not yet worked instances**:

- A routing surface that previously resolved on
  `session_id_prefix` resolves on `id` and stops carrying
  routing weight in a chat-readable slice.
- A team window with two same-name agents on different platforms
  resolves the disambiguation through `id` without falling back
  to the six-character prefix.

## Cascade

This PDR names downstream amendments without executing them:

1. **PDR-027 amendment** absorbing the two-field tuple and the
   demotion of `session_id_prefix` to chat-readable short form.
   The amendment lands on PDR-027 as an Amendment-Log entry
   (PDR-027's existing pattern); the additive-identity rule is
   re-stated with `(agent_name, id)` as the identity key. The
   PDR-027 §Identity schema table gains an `id` column; the
   §Full identity block table likewise.
2. **Identity-row-class collaboration substrate schemas** — every
   structured-state schema that records an identity reference as a
   row field (active claim, commit-queue intent, comms event
   sender/recipient identity blocks, thread identity row,
   joint-decision proposer, escalation owner) gains an `id`
   field alongside the existing `agent_name`. The migration shape
   is tranched: each schema accepts the new field additively first
   (`id` accepted alongside legacy fields, no consumer breaks);
   each consumer of the schema is then updated to resolve
   disambiguation on `id`; finally the schema may strictly require
   `id` once all rolling consumers are on the new field. The
   tranche order is host-local; the additive-first invariant is
   portable.

   Body-file substrate that records identity in frontmatter
   (handoff records, conversation entries written as body files,
   sidebar participant rows when body-shaped) is covered by
   [PDR-076b](PDR-076b-body-file-frontmatter-contract.md) §Decision
   directly — the body-file frontmatter contract applies regardless
   of where the body file lives, and the `id` field there is the
   same `id` defined in this PDR. This PDR does not duplicate that
   coverage at the identity-row level.
3. **Identity preflight derivation** — the canonical identity
   preflight surface emits a UUID `id` alongside the existing
   `agent_name`, `platform`, `model`, and chat-readable short
   form. The constraint is that the same seed produces a stable
   `id` for the lifetime of the session; the derivation method
   (UUID variant, seeding strategy, format) is host-local.
4. **PDR-029 audit-target amendment** — PDR-029 Class A.2
   tripwires audit PDR-027's identity discipline. When the
   PDR-027 Amendment-Log entry lands (item 1), PDR-029's
   audit references update to track the amended contract.
   The amendment shape is mechanical (reference update); no
   tripwire authoring is required.
5. **Identity-rendering surfaces** — host-local. Chat-readable
   surfaces choose how to render the identity (compact pair,
   full `id`, or both) based on their own surface budget and
   ambiguity needs. This PDR does not mandate a rendering
   contract; PDR-027's Amendment Log entry (item 1) is the
   correct surface if a portable rendering rule emerges.

## Notes

**Split history**. This PDR originated as part of
[PDR-076](PDR-076-agent-identity-tuple-and-body-file-frontmatter.md)
(2026-05-23), which bundled the identity-tuple contract with the
body-file frontmatter contract under a single owner direction.
Pre-authoring review SPLIT the bundle into PDR-076a (this PDR) and
[PDR-076b](PDR-076b-body-file-frontmatter-contract.md) on
structural-separation grounds; see the superseded PDR-076 stub for
the original framing. v2 carried a §Forbids item explicitly
forbidding conflation of the two amendment cycles at later landings;
under the SPLIT, the file boundary between PDR-076a and PDR-076b is
the enforcement and the explicit forbid is no longer needed.

Each downstream amendment is a separate landing cycle. This
PDR is the principle layer; the schema amendments, tooling
work, and ceremony updates are operationalisation.

## Consequences

**Enables**:

- A canonical disambiguator that is unique by construction,
  ending the operational pressure of short-prefix collisions
  in growing team windows.
- A clean separation of the routing role from the
  chat-rendering role in the identity tuple — each field
  becomes optimal for its role.
- Future identity-bearing schemas can adopt the
  `(agent_name, id)` pair without re-litigating the
  disambiguator question.

**Costs**:

- A migration tranche across every identity-row-class schema
  in the collaboration substrate. The tranche is real engineering
  work; the decision tranche (this PDR) precedes it.
- The `id` field is large compared to the six-character
  prefix in identity rows; storage and rendering surfaces
  that previously assumed a compact identifier need to widen.

**Forbids**:

- Routing on `session_id_prefix` when `id` is available.
  Surfaces that previously resolved disambiguation on the
  six-character slice MUST resolve on `id` after the
  schema tranches land.

## Falsifiability

This PDR is falsified if, after the schema tranches land, the
substrate continues to exhibit the failure class at the same or
higher frequency:

- A six-character-prefix collision produces a routing error
  that the `id` disambiguator should have prevented. Each
  occurrence is direct evidence against the disambiguator
  claim.

A weaker, supporting check operates at the schema-tranche
landing: the migration tranches should reduce the per-window
incidence of short-prefix routing rendering, observable in
collaboration substrate logs across sessions. If post-tranche
sessions continue rendering disambiguation in the
six-character slice for routing-critical decisions, the
adoption is doctrine-incomplete and the disambiguator move
has not taken effect.

The falsifier is observable across sessions without priming.
The doctrine succeeds when post-tranche sessions exhibit
`id`-resolved routing as default behaviour, not as
exception-handling.

## Owner direction (source-of-record)

Both PDR-076a and PDR-076b co-emerged from a single owner
direction captured 2026-05-23. The full direction is reproduced
in both PDRs to preserve provenance honesty; the two contracts
it ratified are structurally separate and now land as separate
PDRs.

> "agent identities will require two fields, a name and a uuid
> id, and that all comms events must use both, the name remains
> the primary means of identification, the uuid is for
> disambiguation. All temporary agent coordination and
> collaboration files must contain frontmatter with agent name,
> id, created at, last updated at"

This direction is the trigger for the PDR. The PDR converts
the direction into a portable Practice Core decision that the
host's schema and tooling tranches operationalise downstream.
