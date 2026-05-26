---
name: collaboration identity doctrine enforcement remediation
overview: >
  Remediate the technical debt where accepted collaboration identity and
  body-file doctrine exists without matching agent-tooling ability or
  enforcement.
todos:
  - id: phase-0a-pdr-027-amendment-and-grounding
    content: >
      Phase 0A: Land PDR-027 Amendment-Log entry recording the
      (agent_name, id) tuple, session_id_prefix demotion, and identity-block
      schema-table updates. Produce the implementation note committing UUID
      v5 derivation from the stable session seed. PDR-076a §Decision is
      conditional on this amendment landing first.
    status: completed
    completed_at: 2026-05-26
    completed_in: "7028b0d6 (PDR-027 amendment), 76920493 (plan v3 reviewer integration)"
  - id: phase-0b-identity-id-additive-schema
    content: >
      Phase 0B: Add optional id to CollaborationAgentId + identity-row JSON
      schemas; derive UUID v5 in deriveCollaborationIdentity; teach every
      write path (comms send/direct/append, claims open/heartbeat,
      escalation open, conversation append, commit-queue entries) to emit
      id; extend legacyStringToAgentId / parseAgentId so legacy rows
      continue to parse.
    status: pending
    depends_on: [phase-0a-pdr-027-amendment-and-grounding]
  - id: phase-0c-routing-prefers-id
    content: >
      Phase 0C: Add --to-id; teach sameAgentRoutingKey, classifyDirected,
      classifyNarrative, isSelfAuthored, assertSameAgent, and active-agent
      dedup to prefer (agent_name, id) with legacy fallback + diagnostic;
      land regression tests for the same-name same-prefix different-id case.
    status: pending
    depends_on: [phase-0b-identity-id-additive-schema]
  - id: phase-1-body-file-frontmatter
    content: >
      Phase 1: Implement body-file frontmatter read/verify helpers and wire
      them into collaboration body-file consumers (comms --body-file,
      commit message body-file reads, handoff/conversation/sidebar consumers
      where they exist in code today).
    status: pending
    depends_on: [phase-0c-routing-prefers-id]
  - id: phase-2-secondary-doctrine-and-help-alignment
    content: >
      Phase 2: Align rules, references, and CLI help text with the enforced
      identity and body-file contracts; update PDR-029 audit-target
      references. (PDR-027 amendment already landed in Phase 0A.)
    status: pending
    depends_on: [phase-1-body-file-frontmatter]
  - id: phase-3-migration-audit-sunset-and-final-gates
    content: >
      Phase 3: Add migration/audit reporting for legacy identity rows and
      Phase 0C legacy-fallback diagnostic counts; name the sunset criterion
      for promoting id from optional to required; run deterministic tests
      plus the canonical aggregate gate.
    status: pending
    depends_on: [phase-2-secondary-doctrine-and-help-alignment]
isProject: false
---

# Collaboration Identity Doctrine Enforcement Remediation

**Last Updated**: 2026-05-26  
**Status**: ACTIVE — Phase 0A complete (2026-05-26, commits 7028b0d6 + 76920493), Phase 0B queued for next session  
**Lane**: Improving collaboration / agent-tooling current  
**Parent arc**:
[`cost-of-collaboration.plan.md`](cost-of-collaboration.plan.md)
P4 identity routing + P5 unified comms substrate follow-up

## Metacognition Pass

**What did I inherit?** Accepted doctrine says agent identity is no longer
just a generated display name plus a six-character session prefix. PDR-076a
requires a human name plus UUID id; PDR-076b requires body files used in
collaboration ceremonies to carry identity frontmatter. Tooling still mostly
implements the older PDR-027 shape.

**Has the inherited shape been ratified from first principles?** Yes at the
doctrine layer: PDR-076a and PDR-076b are ratified debt signals. No at the
tooling layer: schemas, command affordances, and routing helpers have not yet
absorbed the doctrine.

**Does the shape still fit the owner impact?** Yes. The owner's current
correction was concrete: individual words in identity triples repeat often, so
tooling that routes by name token or short prefix creates avoidable
coordination risk. Doctrine without enforcement or ability is debt.

**Bridge from next action to impact:** put the highest-risk failure mode on
the critical path. Phase 0 must make the identity UUID contract executable and
make routing prefer `(agent_name, id)`. Later phases add body-file attribution,
documentation/help alignment, and audit closure.

## Problem Statement

The improving-collaboration lane currently has accepted doctrine that the
agent tooling cannot fully enact:

1. **Agent identity UUID debt.** PDR-076a says canonical routing identity is
   `(agent_name, id)` and `session_id_prefix` is demoted to a readable hint.
   Current TypeScript and JSON schemas still define identity as
   `agent_name`, `platform`, `model`, and `session_id_prefix` only.

2. **Routing ability debt.** `comms direct`, inbox/watch classification,
   active-agent routing, reply authorization, TUI summaries, and claim/queue
   reports still resolve identities by name/prefix combinations. Operators
   also have no `--to-id` affordance when addressing a teammate.

3. **Body-file frontmatter debt.** PDR-076b requires body files to declare
   `agent_name`, `id`, `created_at`, and `last_updated_at`, and requires
   consumers to reject mismatched ids. Current body-file consumers read literal
   contents without attribution verification.

4. **Documentation/help drift.** Some rule and reference surfaces still teach
   the old `(agent_name, platform, session_id_prefix)` routing tuple, and
   generic comms help advertises `--body | --body-file` for heartbeat-capable
   commands without making the heartbeat typed-state exception prominent.

## Evidence Snapshot

- PDR-076a requires `id` as the canonical disambiguator and says
  `session_id_prefix` is no longer the canonical disambiguator:
  `.agent/practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md`.
- PDR-076b requires body-file frontmatter and consumer verification:
  `.agent/practice-core/decision-records/PDR-076b-body-file-frontmatter-contract.md`.
- Current identity type lacks `id`:
  `agent-tools/src/collaboration-state/types.ts`.
- Current comms and active-claims JSON schemas lack `id`:
  `.agent/state/collaboration/comms-event.schema.json` and
  `.agent/state/collaboration/active-claims.schema.json`.
- Current routing helpers use `session_id_prefix`:
  `agent-tools/src/collaboration-state/comms-relevant-events.ts`,
  `agent-tools/src/collaboration-state/active-agent-routing.ts`, and
  `agent-tools/src/collaboration-state/comms-use-cases.ts`.
- Current body-file reads do not verify frontmatter:
  `agent-tools/src/collaboration-state/cli-comms-commands.ts` and
  `agent-tools/src/commit-queue/commit-workflow-runtime.ts`.

## End Goal

New collaboration-state writes carry an agent identity UUID; routing and
authorization prefer `(agent_name, id)` whenever `id` is available; legacy
state remains readable through explicit compatibility paths; body-file
consumers verify identity frontmatter before using the body; and the docs/help
surfaces teach the same contract the tooling enforces.

## Mechanism

Make doctrine executable in phases that match risk, dependency order, and
doctrinal sequencing:

1. **Phase 0A doctrinal landing:** amend PDR-027 with the
   `(agent_name, id)` identity key per PDR-076a §Cascade item 1 — required
   first because PDR-076a §Decision is conditional on this amendment.
2. **Phase 0B additive schema:** add the identity field to schemas, types,
   parsers, and derivation; teach every write path to emit it.
3. **Phase 0C routing prefer-id:** add `--to-id` and make routing consumers
   prefer `(agent_name, id)` with explicit legacy fallback + diagnostic.
   Phase 0B+0C land atomically (same session, or 0C is next session's first
   work).
4. **Phase 1 attribution:** add body-file frontmatter verification for
   body-file consumers enumerated per PDR-076b §Cascade item 2.
5. **Phase 2 secondary alignment:** align rules, reference docs, and CLI
   help with what the tooling enforces; update PDR-029 audit-target refs.
6. **Phase 3 closure and sunset:** add migration/audit reporting, name the
   sunset criterion for promoting `id` from optional to required, and run
   final gates.

This avoids a flag-day rewrite of historical collaboration state while
stopping new debt from accumulating, and respects the PDR-076a §Decision
sequencing constraint.

## Non-Goals

- Do not rewrite historical comms, claims, or thread records blindly.
- Do not remove `session_id_prefix`; it remains useful for prose and quick
  debugging.
- Do not replace the comms event model or introduce a new coordination
  primitive.
- Do not make body-file frontmatter a mere documentation convention; it must
  be enforced at consumers.
- Do not route by display-name word tokens.

## Prerequisite Classification

| Prerequisite | Classification | Minimum shippable shape without it |
| --- | --- | --- |
| PDR-076a / PDR-076b remain accepted doctrine | Blocking | None; this plan exists to enforce those PDRs |
| PDR-027 Amendment-Log entry | Blocking for Phase 0 | None — PDR-076a §Decision is conditional on this amendment landing first; the amendment lands as the first deliverable of Phase 0A |
| Historical state migration | Beneficial | Keep legacy fallback and report legacy rows instead of rewriting them |
| Comms-watch storage redesign | Beneficial | Identity matching can be fixed before seen-file storage changes |
| Human-composer TUI write-side work | Beneficial | TUI read-side may consume the new identity shape via the additive parser; TUI write-side body-file frontmatter emission deferred to the plan that lands TUI write-side work (see Phase 1 deferred list) |

## Phases

### Phase 0: Critical Path — Identity Id And Routing

**Goal:** remove the highest-risk collaboration failure mode first: new
agent identity writes carry an opaque UUID id, and all routing consumers prefer
`(agent_name, id)` when `id` is present.

**Why this is Phase 0:** without an id on new writes and id-aware routing,
the system still routes through repeated words, repeated display names, and
six-character prefixes. That is the live failure mode that triggered this
plan.

**Sub-phase sizing — TDD-cycle decomposed, not file-counted.** A first-pass
estimate framed 0A, 0B, and 0C as three separate sessions. That count was
derived from owned-surface file counts (13+4+2 for 0B, 7+ for 0C) and was
overcautious — the substantive work is fewer cycles than touch points
because the design verdicts below are locked at plan time and most touch
points are mechanical translations of a small number of structural moves.

**Phase 0A** — doctrinal arc. One session-sized deliverable: PDR-027
amendment (Amendment-Log entry + identity-block schema tables + additive-
identity rule body + Rationale supersession) plus the implementation note
with the write-path enumeration. (Landed 2026-05-26 in commits 7028b0d6 +
76920493.)

**Phase 0B + 0C** — implementation arc paired by the atomicity invariant
below. Approximately **10 TDD cycles total**, achievable in one focused
implementer session with the design verdicts pre-locked. Cycles:

Phase 0B (~5 cycles):

1. `UuidV5` branded type + `uuidV5Schema` in `types.ts`.
2. Schema split — `collaborationAgentIdSchema` (optional `id`) +
   `collaborationAgentIdWriteSchema` (required `id`).
3. `deriveCollaborationIdentity` derives UUID v5 from the stable session
   seed and returns `CollaborationAgentIdWrite`.
4. `parseAgentId` replaces the hand-built object construction with
   `collaborationAgentIdSchema.parse()` (Commandment 12 fix).
5. `comms-event.schema.json` + `active-claims.schema.json` accept
   optional `id` in their `agent_id` `$def` (additive).

Phase 0C (~5 cycles):

1. `AgentRoutingKey` becomes a discriminated union + `routingKeyFor`
   switches on `id` presence + `sameAgentRoutingKey` exhaustively matches
   on `kind`.
2. `isSelfAuthored`, `classifyDirected`, `classifyNarrative` consume the
   new routing key.
3. `assertSameAgent` consumes the new routing key.
4. `--to-id` flag wired through `cli-spec-options` →
   `cli-comms-messages.recipientAgent`.
5. Legacy-fallback diagnostic emission in `routingKeyFor`'s
   `kind: 'legacy'` branch.

**Cycle-count caveat.** A cycle may surface ripple beyond its primary
target (the schema split in particular will surface every identity-
construction site as a compile error). The structural map in commit
76920493 enumerates those sites; ripple is bounded by enumeration, not
emergent. Real-world cycle count may drift by ±2 but stays in one
focused session.

**Atomicity invariant.** Phase 0B+0C MUST land in the same session, or 0C
MUST be the next session's first work. Phase 0B alone (new writes carry
`id` but no consumer reads it) is a regression. Closing Phase 0 requires
ID-0/1/2/3 in the proof contract all proven.

#### Phase 0A: Grounding, PDR-027 Amendment, And Contract Freeze

**Why PDR-027 amendment lands here, not Phase 2:** PDR-076a §Decision is
*conditional on the PDR-027 Amendment-Log entry landing first* (§Decision
opening, §Cascade item 1). The §Decision items are "the agreed shape"; the
*binding* contract is PDR-027 as amended. Implementing PDR-076a's schema and
routing contracts before the PDR-027 amendment lands puts the operational
substrate ahead of its binding doctrine — a sequencing inversion that the
PDR itself forbids. Phase 0A therefore lands the PDR-027 Amendment-Log
entry as its first deliverable; secondary alignment (rules, references, CLI
help) remains in Phase 2 where it belongs.

**Tasks:**

- Read PDR-076a, PDR-076b, PDR-027, comms/claims schemas, current identity
  derivation, comms direct/reply/watch/inbox, active-agent routing, TUI
  snapshot formatting, and commit message body-file consumption.
- Author and land the PDR-027 Amendment-Log entry that records:
  (a) the `(agent_name, id)` identity key,
  (b) `session_id_prefix` demoted to chat-readable short form,
  (c) `id` row added to §Identity schema (lines 212–232) and §Full identity
      block (lines 276–301) tables.
- Add an explicit supersession note at the head of PDR-027 §Rationale
  subsection "Why the identity key is `platform + model + agent_name`"
  (lines 383+), pointing to the Amendment-Log entry by date. The section
  remains as historical rationale; the supersession note prevents readers
  from receiving superseded guidance from the body before they reach the
  Amendment Log. (Prefer head-of-section note over Amendment-Log-only
  prose: traceable per docs-adr review.)
- Update the PDR-027 §The additive-identity rule body (lines 234–256) so
  the continuation-matching condition reflects `(agent_name, id)`. The
  current line 237 says "If the session is the same
  `platform + model + agent_name` as an existing row" — this MUST change
  to reflect the new key, or the rule body contradicts the Amendment-Log
  entry.
- Produce a short implementation note in the first commit body or plan update
  naming the chosen UUID derivation strategy and enumerating every write
  path that Phase 0B will touch (checked back into the plan or this
  Amendment-Log entry as a read-artefact, not just a retrospective claim).

**UUID derivation verdict (committed, not deferred):**

The identity `id` is a **deterministic UUID v5** namespaced on the stable
session seed. The session seed is resolved by PDR-027's
§Derived identity default precedence (`PRACTICE_AGENT_SESSION_ID_CLAUDE`,
then `_CURSOR`, then `_CODEX`, then `CODEX_THREAD_ID`). Every process in
the same session derives the same `id` without a sidecar or persistent
allocation. The UUID variant, namespace UUID, and format are host-local per
PDR-076a §Cascade item 3; the host-local constraint is the
"same seed → stable id" invariant, which v5 satisfies by construction.

This commits the verdict the original plan deferred to implementation time.
Discoverable doctrine (PDR-076a §Cascade item 3, PDR-027 §Derived identity
default) leaves no alternative path on the architectural-excellence axis:
non-deterministic id forces a sidecar; persistent allocation forces a store
the substrate does not have; deterministic-from-seed already matches every
existing identity-derivation site.

**Acceptance:**

- PDR-027 Amendment-Log entry landed, §Identity schema and §Full identity
  block tables updated, key updated to `(agent_name, id)`.
- PDR-027 §Rationale "Why the identity key is `platform + model + agent_name`"
  carries a head-of-section supersession note referencing the Amendment-Log
  entry by date.
- PDR-027 §The additive-identity rule body continuation-matching sentence
  (line 237) reflects `(agent_name, id)`.
- Phase 0B write-path enumeration is recorded in the plan or Amendment-Log
  entry as a read-artefact (not a retrospective claim).
- Phase 0B/0C type-design verdicts (read-side vs write-side schema split,
  `AgentRoutingKey` discriminated union shape) are recorded in this plan's
  Phase 0B/0C implementation shape sections, locked-in before Phase 0B
  implementation begins.
- The implementation session can name every write path and read path affected.
- The implementation starts from a compatibility contract: new writes include
  `id`; readers accept legacy rows; routing prefers `id` when present.

#### Phase 0B: Identity Id Additive Schema

**Owned surfaces:**

Identity derivation and schema (write-side core):

- `agent-tools/src/core/agent-identity/` (DerivedIdentityResult contract)
- `agent-tools/src/collaboration-state/types.ts` (collaborationAgentIdSchema)
- `agent-tools/src/collaboration-state/state-schemas.ts` (agentIdSchema)
- `agent-tools/src/collaboration-state/state-parsers.ts` (parseAgentId)
- `agent-tools/src/collaboration-state/identity.ts` (deriveCollaborationIdentity — primary write factory)
- `agent-tools/src/collaboration-state/cli-self-identity.ts` (CLI override path)
- `agent-tools/src/collaboration-state/identity-audit-markdown.ts` (markdown identity-row parsing for threads and shared-log)
- `agent-tools/src/collaboration-state/comms-migration-records.ts` (existing legacyStringToAgentId — the legacy compatibility pathway this phase extends)

Identity preflight (CLI surface):

- `agent-tools/src/collaboration-state/cli-comms-messages.ts` (currentAgent + recipientAgent construction — feeds Phase 0C)
- identity preflight command shape in collaboration-state CLI

Session-identity hook implementations and tests:

- `agent-tools/src/claude/session-identity-hook.ts`
- `agent-tools/src/cursor/oak-session-identity-hook.ts`
- `agent-tools/src/codex/session-identity-hook.ts`
- `agent-tools/tests/collaboration-state/identity.unit.test.ts`
- `agent-tools/tests/claude/session-identity-hook.unit.test.ts`
- `agent-tools/tests/cursor/oak-session-identity-hook.unit.test.ts`
- `agent-tools/tests/codex/session-identity-hook.unit.test.ts`

JSON schemas (additive):

- `.agent/state/collaboration/comms-event.schema.json` (agent_id $def at lines 13–24)
- `.agent/state/collaboration/active-claims.schema.json` (agent_id $def at lines 231–257)

**Implementation shape (locked in this plan, not deferred to implementation):**

- **Split the schema from the start.** Define two schemas in `types.ts`:

  ```typescript
  // Read-side (boundary parser — accepts legacy rows without id)
  export const collaborationAgentIdSchema = z.object({
    agent_name: z.string().min(1),
    platform: z.string().min(1),
    model: z.string().min(1),
    session_id_prefix: z.string().min(1),
    id: uuidV5Schema.optional(),
  }).strict();
  export type CollaborationAgentId = Readonly<z.infer<typeof collaborationAgentIdSchema>>;

  // Write-side (enforced at every write factory)
  export const collaborationAgentIdWriteSchema =
    collaborationAgentIdSchema.required({ id: true });
  export type CollaborationAgentIdWrite =
    Readonly<z.infer<typeof collaborationAgentIdWriteSchema>>;
  ```

  Write factories (`deriveCollaborationIdentity`, etc.) accept and return
  `CollaborationAgentIdWrite`; read parsers (`parseAgentId`,
  `legacyStringToAgentId`, `agentId()` helpers) return `CollaborationAgentId`.
  This catches missing-`id` writes at compile time, not at runtime.

- **UUID v5 branded type.** Add `UuidV5` branded type and `uuidV5Schema`
  alongside the schema split:

  ```typescript
  declare const _uuidV5Brand: unique symbol;
  export type UuidV5 = string & { readonly [_uuidV5Brand]: typeof _uuidV5Brand };
  export const uuidV5Schema = z.string().uuid().transform((s) => s as UuidV5);
  ```

- **Derive UUID v5 once in `deriveCollaborationIdentity`** (single source of
  derivation) from the stable session seed. Hook implementations consume the
  derived identity rather than re-derive.

- **Replace `parseAgentId` hand-built object with schema parse.** Current
  `state-parsers.ts:152–163` hand-builds the object — that is a
  Commandment-12 violation (the schema IS the type). Phase 0B replaces it
  with `collaborationAgentIdSchema.parse(value)`, which inherits the
  optional `id` automatically.

- **`legacyStringToAgentId` in `comms-migration-records.ts:65–75` does not
  set `id`.** Its return type is `CollaborationAgentId` (read-side), not
  `CollaborationAgentIdWrite`. Setting `id` would invent a UUID rather than
  derive one; legacy V1 string-form rows are correctly classified as legacy
  by the absence of `id`.

- **Emit `id` from `identity preflight` and from every write factory.**

- **New write paths must carry `id`**: comms send/direct/append, claims
  open/heartbeat, commit-queue entries, conversation appends, escalation
  open. Test coverage proves each path's write site emits `id`.

**Acceptance:**

- Unit tests prove a stable seed derives a stable UUID and different seeds
  derive different ids.
- `identity preflight` output includes `agent_id.id`.
- New `comms send`, `comms direct`, `comms append`, `claims open`,
  `claims heartbeat`, `escalation open`, `conversation append`, and
  commit-queue entries include `id` in identity blocks.
- Existing fixture/history rows without `id` still parse through the
  extended `legacyStringToAgentId` / `parseAgentId` legacy compatibility path.
- New test fixtures authored in this phase include `id`. Pre-existing
  fixtures without `id` remain as legacy-path test cases exercising the
  additive parser fallback — do not bulk-rewrite legacy fixtures.

#### Phase 0C: Routing Prefers Id

**Owned surfaces:**

Routing comparators and classifiers:

- `agent-tools/src/collaboration-state/active-agent-routing.ts`
  (AgentRoutingKey, routingKeyFor, sameAgentRoutingKey, sameIdentity,
  formatRoutingKey, formatAgent)
- `agent-tools/src/collaboration-state/comms-relevant-events.ts`
  (classifyEventForAgent, isSelfAuthored, classifyDirected, classifyNarrative,
  formatIdentity)
- `agent-tools/src/collaboration-state/comms-use-cases.ts` (assertSameAgent)
- `agent-tools/src/collaboration-state/active-agents.ts`
  (active-agent record dedup + collision reporting)
- `agent-tools/src/collaboration-state/cli-comms-messages.ts`
  (recipientAgent construction, --to-name/--to-prefix flags, new --to-id)
- `agent-tools/src/collaboration-state/cli-comms-commands.ts`
  (appendComms, send, direct, reply flag wiring)
- TUI snapshot/rendering code that formats identity or directed pressure

Regression test surfaces (extend existing collision infrastructure):

- `agent-tools/tests/collaboration-state/comms-relevant-events-collision.unit.test.ts`
  (existing same-prefix collision file — extend with id-disambiguator cases)
- new test file for same-name same-prefix different-id case

**Implementation shape (locked in this plan):**

- **`AgentRoutingKey` becomes a discriminated union, not an optional-id
  interface.** Current shape (`active-agent-routing.ts:3–7`):

  ```typescript
  export interface AgentRoutingKey {
    agent_name: string;
    platform: string;
    session_id_prefix: string;
  }
  ```

  Replace with:

  ```typescript
  export type AgentRoutingKey =
    | { readonly kind: 'id-keyed'; readonly agent_name: string; readonly id: UuidV5 }
    | { readonly kind: 'legacy'; readonly agent_name: string; readonly session_id_prefix: string };
  ```

  `platform` drops from the routing key per PDR-076a §Decision item 2
  ("`platform` and `model` ... are not the routing weight"). `routingKeyFor`
  (line 9–15) switches on whether its `CollaborationAgentId` input has `id`
  defined — single construction site implements the two-phase narrowing
  pattern automatically. `sameAgentRoutingKey` exhaustively matches on
  `left.kind`/`right.kind`; TypeScript enforces all four branches.

  Why discriminated union not optional field: optional `id?: string` leaves
  `sameAgentRoutingKey` needing a runtime branch ("if both have id, compare
  by id; otherwise by prefix") that is invisible to the compiler. Bugs in
  the fallback path compile cleanly. The union makes the legacy-fallback
  path statically distinguishable.

- **The diagnostic emission maps to the `kind: 'legacy'` branch.** When
  `routingKeyFor` constructs a `legacy`-kind key from a `CollaborationAgentId`
  that lacks `id`, it emits a structured log line (`stderr`, machine-readable
  prefix `[routing-legacy-fallback]` plus JSON payload so Phase 3 audit can
  aggregate). The diagnostic location is provable, not assumed.

- Add `--to-id` to `comms direct` (and `comms reply` where reply recipients
  are addressable). The flag accepts the UUID string; combined with
  `--to-name`, the pair is the canonical recipient.

- Include `id` in reply authorisation (`assertSameAgent` in
  `comms-use-cases.ts:101–111`) and direct-message recipient matching
  (`classifyDirected` in `comms-relevant-events.ts:126–131`,
  `recipientAgent` in `cli-comms-messages.ts:138–145`).

- Classify self-authored (`isSelfAuthored` at
  `comms-relevant-events.ts:115–120`), directed (`classifyDirected`),
  group/narrative (`classifyNarrative` at lines 133–142), observed, and
  active-agent reports by the id-preferring rule above. Every classifier
  takes an `AgentRoutingKey` (the discriminated union), not a
  `CollaborationAgentId` — narrowing happens at the routing boundary, not
  inside each comparator.

- Keep rendering human-readable: `agent_name` plus short prefix remain in
  headings (`formatAgent`, `formatRoutingKey`); `id` available in details and
  JSON output.

**Acceptance:**

- Regression tests cover the three collision shapes:
  (a) same name, different session_id_prefix (existing case — extend with id),
  (b) same name, same session_id_prefix, different id (the failure mode
      PDR-076a §Falsifiability names),
  (c) legacy fallback when one side carries id and the other does not.
- A directed event addressed to one of two same-name agents reaches only the
  matching id.
- A watcher self-excludes only the matching id and does not suppress a peer
  with a repeated name token.
- Reply authorisation rejects mismatched id even when name/prefix match.

**Phase 0B → Phase 0C atomicity invariant.** Phase 0B and Phase 0C MUST land
in the same session, or Phase 0C MUST be the next session's first work after
0B lands. Phase 0B alone (new writes carry `id` but no consumer reads it) is
a regression, not progress — it introduces a field that nothing enforces and
defers the failure-mode cure that motivated this plan.

**Phase 0 completion claim:** Phase 0 is complete only when ID-0 (PDR-027
Amendment-Log entry landed), ID-1, ID-2, and ID-3 in the proof contract are
all proven. A documentation-only update or an identity-write update without
routing changes is not Phase 0 completion.

### Phase 1: Body-File Frontmatter

**Body-file consumer enumeration (per PDR-076b §Cascade item 2).** The
body-file substrate includes — non-exhaustively — handoff records,
conversation entries, sidebar entries when body-shaped, intent-scoped
message files, reviewer scratch notes, closeout drafts, commit-message
drafts, and broadcast body drafts. The principle is the body-file *nature*
of the substrate, not the directory it sits in.

**In-scope this phase (existing consumers in the repo today):**

- `agent-tools/src/collaboration-state/cli-comms-commands.ts`
  (`resolveCommsBody` at line 48–73 — `--body-file` for comms send/direct/
  append; `--body-file` is wired through `cli-spec-options.ts` and
  `cli-specs.ts`)
- `agent-tools/src/collaboration-state/cli-comms-messages.ts`
  (message-shape construction sites for body content)
- `agent-tools/src/commit-queue/commit-workflow-runtime.ts`
  (commit message body-file reads)
- handoff body-file reads under `.agent/state/collaboration/handoffs/` —
  enumerate consumers in Phase 1 grounding
- conversation entry body-file reads under
  `.agent/state/collaboration/conversations/` — enumerate consumers in
  Phase 1 grounding
- sidebar body-file reads under `.agent/state/collaboration/sidebars/` —
  enumerate consumers in Phase 1 grounding
- shared helper module for body-file frontmatter parse/validation
- tests for body-file success and rejection paths

**Write-side obligation vs consumer-side enforcement (clarification).**
PDR-076b §Decision and §Forbids bind the **write side** of any body file
authored for downstream collaboration consumption, independently of whether
a consumer surface exists today. Files authored without frontmatter are
already out of contract by PDR-076b §Decision. The defer below scopes only
the consumer-side enforcement tranche — the mechanical refusal of bodies
with missing or mismatched frontmatter. The write-side authoring obligation
is not deferred; ceremonies in the defer list that write body files today
without frontmatter remain a tracked gap until their write-side authoring
moves to the new shape (host-local follow-up plans).

**Consumer-side enforcement deferred to named follow-up (no existing
consumer code in this repo):**

- Reviewer scratch notes (no consumer surface today; consumer-side
  enforcement waits until a consumer is authored; write-side authoring
  obligation already applies).
- Closeout draft / broadcast body draft surfaces that are owner-mediated
  (read by humans, not by the agent-tools substrate) — consumer-side
  enforcement is the human reader; write-side authoring obligation already
  applies.
- TUI write-side body authoring — listed as `Beneficial, not blocking` in
  the Prerequisite Classification; TUI gains frontmatter emission in the
  follow-up plan that lands TUI write-side work.

**Implementation shape:**

- Add a shared parser for the four-field minimum:
  `agent_name`, `id`, `created_at`, `last_updated_at`.
- For body files used by collaboration ceremonies, strip frontmatter before
  using the body content and validate frontmatter against the current
  session identity.
- Reject missing frontmatter for body-file consumers once the plan's migration
  window begins. If a particular legacy consumer needs a grace path, it must
  name that path and produce an audit warning.
- Ensure inline `--body` behaviour remains unchanged. Heartbeat events are
  outside body-file scope by construction:
  `comms-heartbeat-cli.ts` already rejects `--body-file` on heartbeat events
  (line 44–46); Phase 1 must not regress that rejection.

**Acceptance:**

- `comms send/direct/append --body-file` rejects a file without frontmatter.
- It rejects frontmatter whose `id` does not match the current agent.
- It accepts matching frontmatter and writes the body content without the
  frontmatter fence.
- Commit message body-file reads follow the same attribution rule.
- Handoff, conversation, and sidebar body-file consumers (where they exist
  in code) follow the same attribution rule.
- Heartbeat `--body-file` rejection at `comms-heartbeat-cli.ts:44–46`
  remains green.

### Phase 2: Secondary Doctrine And Help Alignment

**PDR-027 Amendment-Log entry already landed in Phase 0A.** This phase
covers the remaining doctrine and help-text alignment that is downstream of
the binding contract — not the binding contract itself.

**Owned surfaces:**

- `.agent/rules/comms-all-channels-watcher.md`
- `.agent/reference/comms-watch-mechanism.md`
- `.agent/rules/register-identity-on-thread-join.md`
- CLI help text for `identity preflight`, `comms direct`, `comms send`,
  `comms append`, `comms reply`
- PDR-029 audit-target reference update (PDR-076a §Cascade item 4 —
  mechanical reference update, no tripwire authoring)
- any affected thread/session-handoff guidance that names the old tuple

**Implementation shape:**

- Update watcher docs/rules so they teach self-exclusion by id, not prefix.
- Update CLI help so `--to-id` and body-file frontmatter requirements are
  visible at the command boundary.
- Make heartbeat help name the typed-state body-file rejection directly
  instead of only surfacing it after rejection.
- Update PDR-029 audit-target references to track the amended PDR-027.

**Acceptance:**

- `rg` for old routing formulations has only intentional legacy/migration
  references.
- CLI help and rule text describe the same contract implemented by tests.
- PDR-029 audit-target references point at the amended PDR-027.

### Phase 3: Migration Audit, Sunset, And Final Gates

**Owned surfaces:**

- identity audit/report command or existing collaboration-state check
- tests and fixtures for legacy and new identity rows
- plan and continuity closeout notes

**Implementation shape:**

- Add an audit/report mode that counts legacy identity blocks without `id`
  across active claims, closed claims, comms events, and thread records.
- Classify historical rows as legacy evidence, not broken state.
- Report any live active row without id as actionable debt after the new
  writer path lands.
- Count Phase 0C legacy-fallback diagnostic emissions per session (the
  non-fatal log line added in Phase 0C). Diagnostic counts trending to zero
  is the observable success signal per PDR-076a §Falsifiability.
- Run targeted and aggregate gates.

**Legacy-path sunset criterion.** The optional-`id` legacy parse path
(installed in Phase 0B) remains until both invariants hold across one
calendar week of agent activity: (a) no active claim, open thread record, or
new comms event **written within the previous 7 days** carries a legacy
identity block; (b) Phase 0C's legacy-fallback diagnostic emission count is
zero across that window. When both invariants hold, the canonical
`collaborationAgentIdSchema` is promoted to make `id` required (i.e. the
read-side schema collapses into the write-side schema, the
PDR-076a §Cascade item 2 "finally the schema may strictly require `id`"
step). The promotion lands as a separate cycle, not as part of this plan's
Phase 3.

**Sunset audit data model requirement.** Condition (a) requires the audit
command to filter on **write-timestamp**, not presence of a legacy row.
Historical rows written before Phase 0B lands are legacy evidence and must
not block the sunset; only legacy rows written *after* the Phase 0B
landing date count against condition (a). Phase 3's audit command must
therefore expose write-timestamp-filtered counts (from the identity block's
containing event timestamp or claim `claimed_at` field), not total
legacy-row counts. Without this filter, the sunset criterion is not
checkable.

**Acceptance:**

- Audit distinguishes historical legacy rows from new-write violations.
- No new collaboration-state write path omits `id`.
- Sunset criterion is named, observable, and checkable by the audit command.
- Full relevant tests and `pnpm check` pass.

## Proof Contract

| Acceptance id | Proof level | Proof |
| --- | --- | --- |
| ID-0 Phase 0A PDR-027 Amendment-Log entry landed | non-code | Amendment Log entry present in PDR-027; §Identity schema and §Full identity block tables carry `id`; identity key restated as `(agent_name, id)` |
| ID-1 Phase 0 new writes carry UUID | unit + integration | identity and collaboration-state tests for every write path enumerated in Phase 0B owned surfaces |
| ID-2 Phase 0 routing uses UUID when present | unit + integration | collision regression tests for direct, reply, watch, active-agent reports — covering same-name + same-prefix + different-id case (the PDR-076a §Falsifiability case) |
| ID-3 Phase 0 legacy state remains readable | unit | parser fixtures without `id` still parse through explicit legacy path; `legacyStringToAgentId` extension test |
| ID-4 Phase 1 body-file frontmatter enforced | unit + integration | body-file success, missing-frontmatter rejection, mismatched-id rejection across every consumer enumerated in Phase 1 in-scope list |
| ID-5 Phase 2 doctrine/help aligned | non-code + command | `rg` audit plus CLI help snapshot/substring tests |
| ID-6 Phase 3 whole repo remains green | gate | `pnpm check` |

**Success signals — PDR-076a §Falsifiability operationalisation:**

- **Primary falsifier** (PDR-076a §Falsifiability lines 295–299, "a
  six-character-prefix collision produces a routing error that the `id`
  disambiguator should have prevented"): operationalised by **ID-2
  collision regression tests** (same-name + same-prefix + different-id case
  in particular). The proof contract carries the primary falsifier; it is
  not a separate signal.
- **Weaker supporting check** (PDR-076a §Falsifiability lines 300–308,
  "per-window incidence of short-prefix routing rendering ... post-tranche
  sessions exhibit `id`-resolved routing as default behaviour"):
  operationalised by the Phase 0C legacy-fallback diagnostic emission count
  trending to zero, surfaced through Phase 3 audit.

Both signals are required for completion claim. The diagnostic count alone
is not sufficient — it operationalises only the weaker check.

## Quality Gate Strategy

Each phase lands as test+code/doc pairs and ends with focused tests.
Likely focused commands:

```bash
pnpm --filter @oaknational/agent-tools test
pnpm --filter @oaknational/agent-tools exec vitest run agent-tools/tests/collaboration-state
pnpm --filter @oaknational/agent-tools exec vitest run agent-tools/tests/commit-queue
pnpm markdownlint:root
pnpm check
```

Final readiness requires the canonical aggregate gate:

```bash
pnpm check
```

## Reviewer Scheduling

- **Pre-execution:** `assumptions-expert` for migration shape and
  proportionality; `docs-adr-expert` for PDR-027/PDR-076 alignment.
- **During Phase 0:** `type-expert` and `code-expert` for identity schema and
  routing consumer safety.
- **During Phase 1:** `security-expert` or `assumptions-expert` to check
  attribution-boundary failure modes; `test-expert` for body-file rejection
  coverage.
- **Post:** `docs-adr-expert` and `code-expert` before final completion claim.

## Foundation Alignment

- `principles.md`: doctrine must be executable, and "strict and complete,
  everywhere, all the time" applies to collaboration-state boundaries.
- `testing-strategy.md`: each behavioural change is proven by targeted tests;
  migration compatibility is tested, not assumed.
- `schema-first-execution.md`: identity fields flow through canonical schemas
  and parsers rather than ad hoc object spreading.

## Plan-Body First-Principles Check

Before executing any cycle, ask:

1. Could this be simpler without compromising quality?
2. Is the cycle closing a real doctrine/ability/enforcement gap, or just
   renaming surfaces?
3. Is the migration additive until every live consumer can read the new shape?
4. Does the validation prove the exact routing or body-file failure mode?

## Risks

| Risk | Mitigation |
| --- | --- |
| PDR-027 amendment skipped, Phase 0 doctrinally incomplete | PDR-027 Amendment-Log entry is the first deliverable of Phase 0A and is acceptance ID-0; the implementation work cannot land green without it because tests reference the amended schema |
| Phase 0B lands without Phase 0C (silent debt accrual) | Phase 0B+0C atomicity invariant — they land in the same session, or 0C is the next session's first work |
| Flag-day breakage of historical comms/claims | Add `id` additively; extend existing `legacyStringToAgentId` legacy parse path; audit instead of rewrite |
| UUID generation differs across processes in same session | Verdict committed in Phase 0A: deterministic UUID v5 from the stable session seed (`PRACTICE_AGENT_SESSION_ID_<HOST>`); same seed → stable id by construction, no sidecar |
| Docs updated but tooling still routes by prefix | Make routing tests the acceptance signal, not docs-only completion; Phase 0C legacy-fallback diagnostic emission counts surface residual prefix-based routing |
| Body-file frontmatter becomes ceremony theatre | Enforce at consumers and test rejection paths; reject missing frontmatter once migration window begins |
| Huge state migration distracts from debt closure | Treat historical rows as legacy evidence; stop new debt first |

## Lifecycle Triggers

- Session open: run start-right, identity preflight, active claims, recent
  comms, and current branch status before editing.
- Before edits: open a file-scoped claim for the active phase.
- Commit discipline: stage explicit pathspecs; use the commit skill; keep each
  TDD cycle green.
- Handoff: update this plan with completed acceptance ids and remaining
  migration debt.
- Completion: run consolidation so settled doctrine/tooling alignment is not
  trapped in this plan.
