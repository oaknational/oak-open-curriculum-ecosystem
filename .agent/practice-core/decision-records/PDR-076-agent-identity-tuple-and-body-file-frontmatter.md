---
pdr_kind: governance
---

# PDR-076: Agent Identity Tuple and Body-File Frontmatter (SUPERSEDED — SPLIT)

**Status**: Superseded by
[PDR-076a](PDR-076a-agent-identity-tuple-name-and-uuid.md)
(agent identity tuple `(name, UUID id)`) and
[PDR-076b](PDR-076b-body-file-frontmatter-contract.md)
(body-file frontmatter contract)
**Date**: 2026-05-23
**Superseded**: 2026-05-23

> This PDR is retained as the historical record of a single owner
> direction that ratified two structurally-separate decisions.
> Pre-authoring review converged on SPLIT-compelled: the
> identity-tuple contract and the body-file frontmatter contract
> operate at different layers, cascade to disjoint downstream
> substrates, and would each be cited independently. The substance
> now lives in
> [PDR-076a](PDR-076a-agent-identity-tuple-name-and-uuid.md)
> (identity tuple) and
> [PDR-076b](PDR-076b-body-file-frontmatter-contract.md)
> (body-file frontmatter). The §Context and §Owner direction blocks
> below are preserved verbatim as provenance for both successor
> PDRs.

## Context

PDR-027 established the thread/session/identity vocabulary and the
additive-identity rule. Its identity row carries four fields:
`agent_name`, `platform`, `model`, `session_id_prefix` (the first
six characters of the harness session id, or `unknown`). The
`session_id_prefix` is both the routing disambiguator (when two
sessions on the same platform/model share a derived name) and the
short form rendered in chat surfaces.

Three operational pressures expose a gap in that shape:

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

2. **Body-file authorship over a shared temporary-file namespace.**
   Agent collaboration ceremonies (closeout drafts, commit-message
   drafts, broadcast bodies, handoff records, intent-scoped message
   files, reviewer scratch notes) routinely materialise body
   substance into files outside the canonical state surfaces — a
   shared temporary-file namespace, a host-local cache, or a
   workspace-temporary path. Those files have no identity contract:
   the file path alone does not guarantee that the contents were
   authored by the session currently invoking the consumer. A
   path-collision across sessions on the same path can produce a
   silent attribution failure where session B's identity carries
   session A's substance into a posted artefact.

3. **The identity contract has no canonical disambiguator that is
   guaranteed-unique by construction.** Derived names are
   deterministic from a seed but the seed space is small; session-id
   prefixes are short by design; `platform + model + agent_name` is
   the documented identity key but is not unique-by-construction at
   the chat-readable rendering layer. Every downstream substrate
   that records or consumes identity (active claims, commit-queue
   intents, comms event participants, conversation entries, sidebar
   participants, joint-decision proposers, escalation owners,
   thread identity rows, handoff records) inherits the disambiguator
   weakness.

The three pressures share a root: the identity tuple as PDR-027
shapes it carries a routing role (the six-character prefix) inside
a field whose other purpose is chat readability. The two roles need
to separate.

## Owner direction (source-of-record)

Owner direction captured 2026-05-23:

> "agent identities will require two fields, a name and a uuid
> id, and that all comms events must use both, the name remains
> the primary means of identification, the uuid is for
> disambiguation. All temporary agent coordination and
> collaboration files must contain frontmatter with agent name,
> id, created at, last updated at"

This direction is the trigger for the PDR. The PDR converts
the direction into a portable Practice Core decision that the
host's schema and tooling tranches operationalise downstream.
