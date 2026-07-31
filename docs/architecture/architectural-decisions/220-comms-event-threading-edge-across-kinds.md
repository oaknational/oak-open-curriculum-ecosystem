# ADR-220: The Comms-Event Threading Edge Spans Every Respondable Kind

**Status**: Accepted 2026-07-30
**Date**: 2026-07-30
**Related**:
[ADR-183](183-comms-event-tag-namespace-substrate.md) (per-kind optional
field addition — the precedent shape);
[ADR-184](184-comms-event-sync-kind-and-urgency-field.md) (lists the
threading affordance among `sync`'s optional fields; this ADR settles the
`directed` kind that 184 does not reach);
[ADR-199](199-comms-event-rotation-phenotype.md) (rotation moves cited
events out of the live stream — the archived-antecedent consequence below);
PDR-056 §Cure (vii) and PDR-064 Moment 2 (the portable affordance this
ADR gives a phenotype).

## Context

`in_response_to` is the machine-readable edge from a response to its
antecedent. It has lived on the `narrative` shape (at
`agent-tools/src/collaboration-state/schemas/comms-event.schema.json`)
since the substrate's early schema and is reachable from
`comms append` / `comms send`. The `directed` shape carried no such
field, so a point-to-point acknowledgement could only name its
antecedent in prose — invisible to every mechanical reader. MCP-393
recorded three live instances in one hour on 2026-07-30 where that
invisibility cost coordination.

## Decision

The threading edge is a substrate-wide affordance, not a per-kind
privilege: every comms-event kind that can be a response carries an
optional `in_response_to`. That is `narrative` and `directed` today, and
`sync` when ADR-184's kind lands.

`in_response_to` is the **canonical** field name. The `narrative` kind's
sibling `in_reply_to` is a legacy alias (live corpus at this decision:
114 `in_response_to` events, 0 `in_reply_to`) that is NOT extended to
any further kind; where ADR-184's sync block lists both, this ADR
narrows it to `in_response_to` alone.

The edge is a **single-primary-antecedent, non-authoritative hint**. On
its own it proves no ordering, absorption, acceptance, custody, or
completion; a consumer drawing any such conclusion must verify the
responder's identity against the antecedent's recipient or participants
and engage the governing content.

The field is optional and additive; `additionalProperties: false` is
preserved on each definition; events without it continue to validate;
readers that do not understand it ignore it (PDR-049 + PDR-050
additive-extension discipline, as ADR-182 applies it).

The edge is **advisory and unvalidated at write time**: no authoring
surface resolves the antecedent id except the reply verb, which resolves
its source by construction. Making the edge resolvable-or-refused is a
named open decision, not a silent gap, and it must answer the
archived-antecedent question below before it can land.

The edge is not rendered. The watcher prints titles and subjects, never
`in_response_to`, so a human-readable back-reference in the title or
subject remains an authoring obligation of the rule that governs acks.

## Consequences

### Required

- Schema, TypeScript types, Zod boundary parsers, and the authoring
  surfaces for each carrying kind stay in lockstep; they must not drift
  independently.
- Any consumer treating a threading edge as absorption evidence must
  also check the responder's identity; a third-party edge is not
  absorption evidence.

### Deferred (named, not silent)

- **Write-time antecedent validation** (frictions F-121). Any guard must
  first settle the archived-antecedent stance: ADR-199 rotation moves
  events out of the live stream, so a valid antecedent can be
  unresolvable at write time. Refuse, warn, or resolve-through-archive
  is an open decision.
- **A resolver contract for traversal.** The hazards are named now so no
  consumer discovers them in production: dangling, self-referencing,
  forward (not-yet-written), and cyclic references; duplicate ids across
  live-plus-archive after rotation or replay; cross-kind reference
  ambiguity; multi-parent shapes a single field cannot express. Until a
  resolver contract lands, a consumer treats unresolvable references as
  UNKNOWN (never as evidence of absence), bounds and cycle-guards any
  graph walk, and never silently picks the first match on duplicates.
- **Rendering the edge** at the notification surface.

### Accepted cost

- One more optional field per carrying kind in schema, parser, and test
  surface.
- Dangling edges remain possible until the validation decision lands.
