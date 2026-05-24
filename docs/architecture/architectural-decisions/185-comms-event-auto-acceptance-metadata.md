# ADR-185: Comms-Event Auto-Acceptance Metadata

**Status**: Proposed 2026-05-23
**Date**: 2026-05-23
**Related**:
[ADR-183](183-comms-event-tag-namespace-substrate.md) (tag namespace
substrate; tags classify event substance);
[ADR-184](184-comms-event-sync-kind-and-urgency-field.md) (interaction
shape and response-priority axes; auto-acceptance composes with both);
PDR-064 (coordinator handoff two moments);
PDR-074 (Director value is mind-coherence per owner attention).

## Context

The comms-event stream is the canonical truth for team coordination, but
some events describe changes whose acceptance can be decided without
Director judgement. The 2026-05-23 Monitor-cure window produced a tight
worked instance: an automated markdownlint fix touched two handoff records
only to normalise list markers and blank lines. Several agents still spent
coordination turns asking whether the fix needed Director ratification
because the files were PDR-064 handoff substrate.

Owner direction on 2026-05-23 named the missing substrate: event types or
metadata carrying impact, size, and risk so trivial automated changes can
be accepted deterministically. The cure is not more prose reminding
agents to "use judgement". Under team-cadence pressure, judgement calls
repeat the same overhead. The cure is schema-encoded acceptance metadata
that lets consumers decide the trivial case mechanically and preserves
the existing review protocols for every non-trivial case.

This ADR records the schema and consumer contract only. Implementation of
the schema, watcher rendering, marshal verification, and authoring CLI
support lands in later tranches.

## Decision

Add an optional `auto_acceptance` object to comms-event kinds that can
request deterministic acceptance for a described change. The field is not
a tag: tags classify the event's substance (ADR-183), while
`auto_acceptance` is structured decision metadata.

The field is agent-advisory until a marshal or repository tool recomputes
the claim against the actual staged diff and pathspec. The author may
state that the impact, size, and risk are all at the lowest tier; that
self-claim does not bind consumers. Binding auto-acceptance requires both
layers:

1. An agent-authored `auto_acceptance` claim using the exact lowest-tier
   triple.
2. Marshal/tool verification that recomputes the claim from the staged
   bundle and confirms it mechanically.

Only the second layer can turn advisory metadata into an acceptance
decision.

### Schema field

The field is optional and additive. Existing events without
`auto_acceptance` continue to validate. When present, the field has this
shape:

```json
{
  "auto_acceptance": {
    "impact": "formatting-only",
    "size": "mechanical",
    "risk": "zero",
    "rationale": "markdownlint --fix normalised list markers and blank lines only",
    "verification": {
      "mechanism": "formatter",
      "command": "npx markdownlint --fix <paths>",
      "paths": [
        ".agent/state/collaboration/handoffs/director-role-handoff-2026-05-23-abyssal-to-incandescent.md",
        ".agent/state/collaboration/handoffs/director-role-handoff-2026-05-23-seaworthy-to-next.md"
      ]
    }
  }
}
```

Schema sketch:

```json
"auto_acceptance": {
  "type": "object",
  "additionalProperties": false,
  "required": ["impact", "size", "risk", "rationale", "verification"],
  "properties": {
    "impact": {
      "type": "string",
      "enum": [
        "formatting-only",
        "metadata-only",
        "coordination-state",
        "semantic"
      ]
    },
    "size": {
      "type": "string",
      "enum": [
        "mechanical",
        "bounded",
        "multi-surface",
        "structural"
      ]
    },
    "risk": {
      "type": "string",
      "enum": ["zero", "low", "medium", "high"]
    },
    "rationale": {
      "type": "string",
      "minLength": 1
    },
    "verification": {
      "type": "object",
      "additionalProperties": false,
      "required": ["mechanism", "paths"],
      "properties": {
        "mechanism": {
          "type": "string",
          "enum": ["formatter", "schema-validator", "generated-output", "manual-assertion"]
        },
        "command": {
          "type": "string",
          "minLength": 1
        },
        "paths": {
          "type": "array",
          "minItems": 1,
          "items": { "type": "string", "minLength": 1 },
          "uniqueItems": true
        }
      }
    }
  }
}
```

The field is added to `narrative`, `directed`, and `lifecycle`. If
ADR-184 lands first, the implementation tranche also adds the same field
to `sync`; if ADR-185 lands first, the ADR-184 implementation tranche
adds it to `sync` when that kind is introduced.

### Deterministic acceptance rule

Advisory auto-acceptance can be requested only with the exact lowest-tier
triple:

- `impact: "formatting-only"`
- `size: "mechanical"`
- `risk: "zero"`

Any other value on any axis disables auto-acceptance. The event can still
carry useful metadata, but existing Director, reviewer, marshal, and
owner protocols apply unchanged.

The lowest-tier triple is necessary but not sufficient. It becomes binding
only after marshal/tool recomputation confirms that the staged diff and
pathspec really match the advisory claim. Until that verification exists,
the event is an auto-acceptance claim, not an auto-acceptance decision.

Auto-acceptance means:

- no Director ratification is required for the acceptance decision;
- no separate "keep or revert" judgement call is opened for the
  described change;
- the marshal still verifies bundle integrity and all quality gates;
- owner authorisation, claim boundaries, commit queue ordering, and
  destructive-operation rules remain unchanged.

Auto-acceptance never bypasses quality gates and never accepts risk on the
owner's behalf.

### Verification contract

The lowest-tier triple is valid only when `verification.mechanism` is
machine-checkable. Initial auto-accept consumers recognise:

- `formatter` for deterministic formatter or linter-fix output, such as
  `prettier --write` or `markdownlint --fix`.
- `schema-validator` for a schema-normalisation command whose output is
  deterministic and path-bounded.
- `generated-output` for generated files when the generator command and
  source inputs are named.

`manual-assertion` is allowed in the schema for transparency but never
qualifies for deterministic auto-acceptance. It documents that an agent is
claiming low risk; it does not create a machine decision.

Marshal-side verification for lowest-tier auto-acceptance recomputes the
decision from the repository state, not from the event payload alone:

1. The staged file set must match `verification.paths` exactly.
2. The named mechanism must be in the recognised deterministic set.
3. The staged pathspec must match the active claim or commit-queue intent.
4. The diff class must be conservatively classified as mechanical by the
   verifier.
5. The diff must be generated or validated by the named command when the
   command is present and cheap to rerun.
6. If any verification step fails, the field is ignored and normal review
   protocols apply.

This is the under-claim defence. An agent can write inaccurate metadata,
but inaccurate metadata does not bind consumers unless the marshal can
verify the lowest-tier claim mechanically.

The verifier must fall back to normal review on ambiguity. Known exclusions
from deterministic auto-acceptance include:

- formatter changes in ADRs, PDRs, Practice, or handoff substrate beyond
  whitespace and list-marker normalisation;
- markdownlint changes inside code fences or tables;
- schema-validator output that changes `required`, `additionalProperties`,
  or equivalent schema semantics while looking like a mechanical rewrite;
- generated output whose source inputs were not named or revalidated;
- any path set that matches `verification.paths` but not the active claim
  or commit-queue pathspec.

### Rendering

`[AUTO-ACCEPT]` is a derived renderer or consumer token, not an
agent-authored tag value. Authors cannot place it in ADR-183 `tags`, and
the schema must not accept it as a tag-like synonym.

The all-channels watcher must not visually promote an unverified
self-claim into a decision. Before marshal/tool verification exists, the
watcher may render an advisory token for lowest-tier claims:

- `--- NEW [DIRECTED] [AUTO-ACCEPT-CLAIMED] EVENT ---`
- `--- NEW [BROADCAST] [AUTO-ACCEPT-CLAIMED] [BEHAVIOUR-NOTE] EVENT ---`

The watcher renders `[AUTO-ACCEPT]` only when a verified state exists and
the marshal/tool verifier has confirmed the staged diff and pathspec. The
token composes after the channel token and before ADR-183 tag tokens:

- `--- NEW [DIRECTED] [AUTO-ACCEPT] EVENT ---`
- `--- NEW [BROADCAST] [AUTO-ACCEPT] [BEHAVIOUR-NOTE] EVENT ---`

Events with non-lowest-tier `auto_acceptance` do not render either
auto-acceptance token; consumers may still display the metadata in
detailed views.

### Authoring and activation tranche

This ADR lands first as a design record. Implementation follows in
separate tranches:

1. **Schema/parser tranche** - extend
   `.agent/state/collaboration/comms-event.schema.json`, TypeScript
   event types, and Zod or schema boundary parsers with optional
   `auto_acceptance`.
2. **Renderer tranche** - update watcher rendering to emit an advisory
   token for unverified lowest-tier claims, and `[AUTO-ACCEPT]` only when
   verified state exists.
3. **Authoring tranche** - add authoring CLI support for the field.
   The CLI must not default this field. Authors opt in explicitly.
4. **Marshal-consumer tranche** - add verifier-side recomputation logic to
   marshal tooling. It must recompute the staged diff class, staged
   pathspec, claim or commit-queue pathspec, verification mechanism, and
   command result before producing verified auto-acceptance state. Until
   this lands, auto-acceptance metadata is informational only and cannot
   change acceptance behaviour.
5. **Activation tranche** - only after the above land may teams rely on
   auto-acceptance as a binding coordination rule.

No implementation tranche should be bundled into the ADR commit.

## Rationale

**Sibling ADR, not ADR-183 amendment.** ADR-183 owns a tag namespace for
substance classification. Auto-acceptance metadata is not a tag and must
not inflate the tag namespace. It is structured decision metadata with
consumer behaviour. A sibling ADR keeps the axes separate.

**Four tiers on each axis.** The design uses four tiers because the
lowest tier is a special zero-friction decision state, not just "low".
Conflating zero with low would make auto-acceptance too broad. The upper
tiers are intentionally coarse; they disable auto-acceptance and defer to
existing protocols rather than trying to encode the whole review process
in the schema.

**Why not a new event kind.** Auto-acceptance composes with many
interaction shapes. A directed event can ask a marshal to accept a
formatter-only fix; a broadcast can announce one; a lifecycle event can
record one. The interaction kind and acceptance metadata are orthogonal.

**Why include `manual-assertion` if it cannot auto-accept.** It lets an
agent surface their own risk classification without creating a binding
machine decision. This preserves useful communication while making the
deterministic boundary strict.

**Why marshal verification.** Schema fields alone cannot prove that a
change is formatting-only. The consuming surface closest to the staged
diff must verify the claim. This keeps the defence structural and cheap:
the marshal either confirms the lowest-tier metadata against the staged
bundle or ignores the field.

**Why split claimed from accepted rendering.** Coordination tokens carry
behavioural weight. Rendering `[AUTO-ACCEPT]` before recomputation would
turn a self-authored claim into apparent fact and recreate the same
under-claim failure mode the metadata is meant to defend against. A
separate claimed state preserves visibility without granting authority.

## Consequences

### Required

- `comms-event.schema.json` gains optional `auto_acceptance` on existing
  event kinds, and on `sync` if ADR-184 has landed.
- TypeScript event types and runtime parsers accept the optional field
  without requiring it on historical events.
- Watcher rendering keeps unverified claims visually distinct from
  verified decisions.
- Marshal tooling recomputes the staged diff and pathspec before metadata
  has behavioural effect.
- Authoring tools make the field explicit opt-in; they do not infer or
  silently default auto-acceptance.

### Forbidden

- Treating `auto_acceptance` as a quality-gate bypass.
- Treating `[AUTO-ACCEPT]` as an agent-authored tag or event field rather
  than derived consumer output.
- Treating `manual-assertion` as deterministic acceptance.
- Auto-accepting any event whose impact, size, or risk axis is above the
  lowest tier.
- Auto-accepting a change whose staged file set differs from
  `verification.paths`.
- Auto-accepting before marshal/tool recomputation has confirmed the
  staged diff class and pathspec.
- Auto-accepting formatter, markdownlint, schema-validator, or generated
  output cases that match the exclusion list in the verification contract.
- Adding new enum values without an ADR amendment and worked-instance
  evidence.

### Accepted cost

- Additional schema and parser surface.
- Marshal tooling must inspect staged paths against event metadata.
- Some events gain longer structured metadata. This is accepted because the
  field replaces repeated Director judgement loops for trivial mechanical
  changes.

### Deferred

- Whether auto-accepted events should be sampled during consolidation for
  under-claim drift.
- Whether future event stores should link `auto_acceptance` directly to a
  commit-queue intent id. This ADR keeps the first shape event-local.
