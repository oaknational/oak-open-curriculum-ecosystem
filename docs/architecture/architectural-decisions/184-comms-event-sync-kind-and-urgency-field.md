# ADR-184: Comms-Event Sync Kind and Urgency Field

**Status**: Proposed 2026-05-23
**Date**: 2026-05-23
**Related**:
[ADR-181](181-agent-team-start-and-action-log.md) (team-start ritual
and future action-trace surface);
[ADR-182](182-mid-cycle-handoff-record-substrate.md) (mid-cycle
handoff record substrate; `message_kind` values stay subordinate to
the `directed` event kind);
[ADR-183](183-comms-event-tag-namespace-substrate.md) (tag namespace
substrate; tags classify event substance, not interaction shape or
response priority);
pending-graduations candidate `sync-kind-urgency-flag` (the source
candidate this ADR resolves).

## Context

The comms-event stream is the canonical truth for agent coordination.
The current schema at `.agent/state/collaboration/comms-event.schema.json`
has three top-level event kinds:

- `narrative` — authored communication to the team or a broad/narrow
  audience.
- `directed` — point-to-point agent message, with `message_kind` as a
  sub-discriminator.
- `lifecycle` — structured record of a session, claim, or
  consolidation lifecycle moment.

The all-channels watcher classifies those shapes into `[BROADCAST]`,
`[GROUP]`, `[DIRECTED]`, and `[LIFECYCLE]` views. The implementation
already names the missing fourth interaction view: synchronous
multi-agent coordination is currently carried by title/body convention
because the schema has no `sync` kind and no urgency field. Some of
those conventions also imply urgency, which is precisely the ambiguity
this ADR removes.

The first captured candidate treated the decision as a choice between
two representations:

1. a top-level `sync` event kind; or
2. an `urgency` flag composing with existing kinds.

That framing collapsed two distinct concerns. `sync` answers "what
interaction shape is this?" `urgency` answers "how quickly should a
receiver respond?" A synchronous multi-agent decision can be low
pressure; an async broadcast can be high urgency. One field cannot
carry both meanings cleanly without forcing readers to infer the other
axis from convention.

Owner direction on 2026-05-23 resolves the candidate: separate the
axes and represent both.

## Decision

The comms-event substrate adopts two orthogonal axes:

1. **Interaction shape** — encoded by the top-level `kind`
   discriminator. Add a new `sync` kind as a peer of `narrative`,
   `directed`, and `lifecycle`.
2. **Response priority** — encoded by a new `urgency` field that
   composes with every event kind.

### Axis 1: `sync` event kind

Add a new top-level event kind to the schema. The example uses the
current event-stream `schema_version` for readability; the schema
tranche owns the final versioning choice alongside the legacy-corpus
migration path.

```json
{
  "schema_version": "2.0.0",
  "event_id": "<uuid>",
  "created_at": "<iso-date-time>",
  "kind": "sync",
  "author": {
    "agent_name": "<name>",
    "platform": "<platform>",
    "model": "<model>",
    "session_id_prefix": "<prefix>"
  },
  "participants": [
    {
      "agent_name": "<name>",
      "platform": "<platform>",
      "model": "<model>",
      "session_id_prefix": "<prefix>"
    }
  ],
  "urgency": "normal",
  "subject": "<short subject>",
  "body": "<decision, request, or coordination payload>"
}
```

Required fields:

- `schema_version`, `event_id`, `created_at`, and `kind`, following
  the existing comms-event contract.
- `author`, using the existing agent identity shape.
- `participants`, an array of agent identities with at least two
  distinct participants. Write-side validation must reject self-only
  sync events, must ensure the author is one of the participants, and
  must enforce identity distinctness by the agent identity tuple rather
  than by object equality alone.
- `urgency`, per the response-priority axis below. Canonical events
  authored after this ADR's activation tranche must write this field
  explicitly.
- `subject` and `body`, matching the directed-event naming rather than
  `title` so sync events read as current coordination exchanges rather
  than general announcements.

Optional fields:

- `in_response_to` / `in_reply_to`, matching the existing event
  threading affordance.
- `tags`, matching ADR-183; tags classify the event's substance.

The `sync` kind is for multi-participant coordination that needs a
current shared decision or acknowledgement loop. It is not a
replacement for:

- `directed` messages, when one agent is handing work, context, or a
  question to another asynchronously;
- `narrative` broadcasts, when the team needs a visible announcement
  but not a synchronised decision loop;
- decision-thread or sidebar records, when the coordination state
  needs a longer structured lifecycle than a single comms event.

### Axis 2: `urgency` field

Add a closed-vocabulary `urgency` field to every comms-event kind,
including the new `sync` kind:

```json
"urgency": {
  "type": "string",
  "enum": ["low", "normal", "high"]
}
```

Canonical events authored after the activation tranche must include
`urgency` explicitly. The authoring CLI defaults omitted `--urgency`
input to `"normal"` at write time, so the JSON on disk carries the
response-priority state.

Historical events do not contain this field. The schema/parser tranche
must choose a migration path before activation:

- backfill existing comms-event JSON with `"urgency": "normal"` and
  make the field required at the schema boundary; or
- support a temporary legacy-read compatibility path that normalises
  missing urgency to `"normal"` internally while all newly-authored
  events write the field explicitly.

The final emitted shape is not "optional urgency"; missing urgency is a
legacy corpus condition only.

The vocabulary is intentionally small:

- `low` — visible coordination signal with low interrupt pressure.
- `normal` — ordinary coordination priority.
- `high` — requires prompt attention from relevant agents, but still
  does not bypass claim, queue, reviewer, or owner-authorisation
  discipline.

Urgency is not importance, severity, or substance classification.
Those remain separate concerns:

- severity/importance live in the body or governing plan/rule;
- tags from ADR-183 classify event substance;
- the top-level kind classifies interaction shape;
- urgency classifies response priority.

### Watcher and CLI rendering

The all-channels watcher adds `sync` to its event view vocabulary and
renders sync events with a `[SYNC]` channel token.

The watcher composes first-line tokens in this order:

1. channel / interaction shape (`[BROADCAST]`, `[GROUP]`,
   `[DIRECTED]`, `[LIFECYCLE]`, `[SYNC]`);
2. non-normal urgency (`[LOW]` or `[HIGH]`; omit `[NORMAL]`);
3. ADR-183 tag tokens, sorted by the existing tag-rendering rule.

Examples:

- `--- NEW [SYNC] [HIGH] EVENT ---`
- `--- NEW [BROADCAST] [HIGH] [FAILURE-MODE] EVENT ---`
- `--- NEW [DIRECTED] [LOW] EVENT ---`

This preserves ADR-183's rule that tags compose with, rather than
replace, the structural channel discriminator.

### Authoring CLI implications

The implementation tranche must update the comms authoring and reading
surfaces together:

- `comms append` / `comms send` must be able to author sync events
  with participant identities and must expose an urgency option for all
  event kinds.
- `comms direct` must expose urgency for directed events but must not
  overload `directed` to mean sync. A two-agent sync decision is still a
  `sync` event with two participants, not a `directed` event with a
  special `message_kind`.
- `comms watch` / `comms inbox` must parse and render the new kind and
  urgency field before any sync or newly urgency-bearing events are
  written.
- Write-side validation must reject sync events with fewer than two
  participants and must reject unknown urgency values.

### Activation tranche order

This ADR lands first and records the decision only. Implementation
must follow this order:

1. **Schema and parser tranche** — extend
   `comms-event.schema.json`, TypeScript event types, and Zod boundary
   parsers with the new `sync` kind and canonical `urgency` field.
   This tranche must include the chosen legacy-corpus migration path.
   TypeScript changes include a `CommsUrgency` literal union,
   `SyncCommsEvent`, `urgency` on the normalised event base shape, and
   an extended `CommsEvent` union. Zod parsing must add `sync` as an
   explicit fourth discriminated-union member and must not let the
   current "else directed" branch become a fallback for unknown future
   kinds.
2. **CLI rendering tranche** — update watcher/inbox classification and
   rendering so sync and urgency are visible.
3. **Authoring/enforcement tranche** — update comms authoring commands
   to create sync events, accept urgency, default omitted urgency input
   to `"normal"` at write time, and enforce the two-participant plus
   closed-vocabulary invariants before writing JSON.
4. **Activation tranche** — only after the above land may agents begin
   writing sync events or relying on urgency as a machine-readable
   routing signal.

No implementation tranche should be bundled into the ADR commit.

## Rationale

**Why `sync` is a kind, not a `message_kind`.** `message_kind` is a
sub-discriminator inside the `directed` event shape. ADR-182 uses that
surface for `mid-cycle-handoff` because the interaction remains
point-to-point. Sync coordination is a different top-level interaction
shape: it is multi-participant by definition, and the watcher should
classify it without first pretending it is directed.

**Why `urgency` is a field, not another kind.** Urgency composes with
every interaction shape. A high-urgency lifecycle event, a low-urgency
directed handoff, and a high-urgency broadcast are all coherent. Making
urgency a kind would multiply event kinds and recreate the collapsed-axis
problem this ADR corrects.

**Why `low` / `normal` / `high`.** The vocabulary is enough to separate
"please do not interrupt for this" from ordinary flow and from prompt
attention. It deliberately avoids severity-like names such as
`critical`, because severity is not urgency and must not become a
backdoor around coordination discipline.

**Why new events write normal explicitly.** Urgency is a boundary fact,
not a hidden parser inference. The existing corpus has no urgency field,
so the migration may temporarily normalise absence for old events, but
new events write `"normal"` explicitly when no higher or lower priority
is intended.

**Why sync needs participants rather than audience.** `audience` on
narrative events is an advisory visibility filter. Sync events require a
named coordination loop with at least two participants. The participant
set is the write-side invariant that prevents self-only sync events from
creating false pressure.

**Why no acknowledgements or read receipts in this ADR.** Sync events
make the interaction shape visible. They do not create a full state
machine for request/ack/resolve. Longer-lived coordination belongs in
decision threads, sidebars, claims, or future action-trace surfaces as
appropriate.

## Consequences

### Required

- A new `sync` `$defs` entry is added to
  `comms-event.schema.json`, and the top-level union includes it.
- The `urgency` enum field is added to `narrative`, `directed`,
  `lifecycle`, and `sync`.
- TypeScript event unions and Zod parsers gain the new kind and urgency
  field.
- Parser tests cover the fourth discriminated-union member explicitly,
  including the guarantee that unknown future kinds fail clearly rather
  than falling through to `directed`.
- Watcher classification includes a `sync` view and renders urgency
  tokens for non-normal urgency values.
- Authoring commands enforce sync participant count and closed-vocabulary
  urgency values before writing JSON event files.
- Schema, Zod, TypeScript fixtures, CLI authoring, and watcher rendering
  tests land in lockstep; these surfaces must not drift independently.

### Forbidden

- Using `message_kind: "sync"` inside a `directed` event to represent
  sync coordination.
- Treating `urgency: "high"` as permission to skip claims, queueing,
  reviewer gates, owner-authorisation requirements, or commit-marshal
  protocol.
- Encoding severity/importance values in `urgency`.
- Writing sync events or urgency-bearing events before schema, parser,
  renderer, and authoring enforcement tranches have landed.

### Accepted Cost

- One new event kind increases parser, renderer, and test surface.
- The authoring CLI needs participant-aware sync creation rather than
  reusing `direct` unchanged.
- The existing comms corpus either receives a mechanical `"urgency":
"normal"` backfill or requires a transitional legacy-read path. That
  migration cost is accepted so the future emitted shape can stay
  explicit.

## Superseded or refined framings

This ADR partially graduates and refines the pending-graduations
candidate `sync-kind-urgency-flag`.

The earlier candidate framed the schema choice as `sync` kind **versus**
urgency flag. That either/or framing is superseded. The settled decision
is `sync` kind **and** urgency field, because they answer different
architectural questions.

ADR-183 remains active and unchanged. Its tag namespace continues to
classify substance; this ADR adds interaction-shape and response-priority
axes that compose with tags.

## Open questions deferred to implementation tranches

1. Whether the schema/parser tranche keeps the current event-stream
   `schema_version` with corpus backfill, or introduces a major version
   bump with a compatibility reader.
2. Whether the schema/parser tranche uses a corpus backfill or a
   temporary legacy-read normalisation path for historical events that
   lack `urgency`.
3. Exact CLI command spelling for sync creation (`comms sync` versus
   `comms send --kind sync` or equivalent).
4. Whether participant identity input is copied from active claims,
   explicit command flags, or a body-file/frontmatter convention.
5. Whether non-normal urgency should also alter inbox sorting or only
   render as a token. This ADR requires rendering; reordering is a
   separate behaviour decision.
