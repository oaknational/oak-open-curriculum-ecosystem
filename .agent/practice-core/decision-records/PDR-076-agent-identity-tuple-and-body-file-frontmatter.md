---
pdr_kind: governance
---

# PDR-076: Agent Identity Tuple `(name, UUID id)` and Body-File Frontmatter

**Status**: Proposed
**Date**: 2026-05-23
**Related**:
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, and agent identity — this PDR extends the identity
contract from a four-field tuple with a short session-id prefix to a
two-field canonical pair plus a session-id prefix retained only as a
chat-readable short form);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(perturbation-mechanism bundle — Family A Class A.2 installs the
tripwires that make the identity contract environmental rather than
passive guidance; this PDR strengthens the contract those tripwires
audit);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(inter-agent collaboration protocol — every identity-bearing
collaboration artefact named here flows through that protocol's
substrate);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator handoff two moments — handoff body files written between
the two moments fall under the body-file frontmatter contract; PDR-064's
existing references to PDR-027's identity tuple update under this PDR's
§Cascade);
[PDR-073](PDR-073-recursion-as-method-is-practice-core-mind-shape.md)
(recursion as method — identity collisions corrupt attribution on the
recursive substrate);
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

## Decision

The §Decision items below are **conditional on the PDR-027 Amendment-Log entry landing first** (see §Cascade item 1). PDR-076 is the principle-layer ratification; the operative form of the redefinition lives in PDR-027's Amendment Log once that amendment lands. Until then, the items here are the agreed shape; the binding contract is PDR-027 as amended.

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

A second, structurally separate decision lands in the same PDR
because it shares the same trigger:

3. **Body-file frontmatter contract.** Every temporary or
   intent-scoped file that an agent writes for downstream
   consumption by collaboration ceremonies MUST carry frontmatter
   with at least four fields:

   - `agent_name` — author identity name (same field as identity
     tuple).
   - `id` — author identity UUID (same field as identity tuple).
   - `created_at` — RFC 3339 timestamp at file creation.
   - `last_updated_at` — RFC 3339 timestamp at most recent write.

   The body-file frontmatter contract is **structurally separate**
   from the identity-tuple contract. It does not extend or replace
   the identity tuple; it pairs every body-bearing file with the
   identity that authored it so that the file's contents cannot be
   silently consumed under a different session's identity.

   The body-file frontmatter contract applies regardless of where
   the body file lives — a shared temporary-file namespace, a
   host-local cache, a workspace-temporary path, or an
   intent-scoped message-file directory. The path is incidental;
   the frontmatter is load-bearing.

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

The body-file frontmatter contract is rationally separate from
the identity tuple because the failure mode it addresses is
not an identity-tuple failure. The identity tuple is correct in
the failure mode — session B's identity tuple was authentic and
unambiguous. The failure was that session B's body-file consumer
read session A's content authored to the same path. The cure is
a per-file identity bind: the file declares who authored it,
and the consumer refuses bodies authored by a different
identity than the one currently driving the consume call.

The two contracts share one trigger and one PDR because they
emerge from the same owner direction and the same worked
instance. They share substrate (identity recording) but operate
at different layers (identity-row schema vs body-file
contents). Bundling them avoids splitting an owner direction
across two PDRs; separating their decisions inside the same PDR
preserves the structural distinction.

**Rejected alternatives**:

- **Lengthen `session_id_prefix` to 12 or 16 characters and call
  it done.** A longer slice reduces collision probability but
  conflates the same two roles. Routing consumers still parse a
  chat-readable string; chat surfaces still render a long
  disambiguator. The two-role conflation is the structural
  defect, not the slice length.
- **Author the body-file frontmatter contract as a standalone
  rule without a PDR.** Rejected because the frontmatter
  schema is normative across schemas (every identity-bearing
  schema gains the same fields), tooling (every body-consumer
  reads the same frontmatter), and ceremonies (every body-
  authoring ceremony writes the same frontmatter). Substance
  that cuts across that many surfaces is PDR-shaped, not
  rule-shaped.
- **Single-field identity (UUID only, no `agent_name`).** Loses
  the human-readable identifier that PDR-027 deliberately
  preserves. Names carry weight in chat surfaces and in agent
  recognisability across sessions. Dropping the name would
  trade a real loss for a marginal disambiguator gain.
- **Bundle the body-file frontmatter contract with the
  intent-scoped message-file ceremony only.** Rejected because
  the failure mode is path-collision across any shared
  body-file namespace, not just the intent-scoped message-file
  surface. The body-file frontmatter contract applies wherever
  agents write body substance for downstream consumption.
- **Bind the enforcing tooling now (a specific validator, a
  specific consumer wrapper).** Rejected per the owner
  direction: specify the schema cheaply now and decide
  enforcement-tool placement later. The schema is the
  load-bearing decision; the tool is the host-local
  implementation route.

## Worked Instance

The trigger event is a tempfile-collision incident in a recent
session. A session drafted a closeout body via a file write to
a path in a shared temporary-file namespace. The path
pre-existed from a different session days earlier in the same
shared namespace; the prior file had not been retired. The
file-write consumer refused to overwrite the pre-existing path
because the new session had not first read the file's current
contents. A parallel body-file consumer in the same ceremony
read the pre-existing content (authored by the earlier
session) and posted it as a collaboration artefact under the
new session's identity tuple.

The incident illustrates both pressures this PDR addresses:

- The new session's identity tuple was correct and unambiguous
  at the identity-row layer. The problem was not identity-tuple
  weakness.
- The body file carried no internal record of its authorship.
  The new session's body-file consumer could not see that the
  contents had been authored by a different identity days
  earlier. Path was the only attribution signal; path
  collisions defeated it.

A second, weaker worked-instance arc is the cumulative cluster
of name-collision near-misses across the recent multi-agent
team windows: derived names have repeated, and disambiguation
has fallen back to the six-character session-id prefix. No
single near-miss is catastrophic; the cluster motivates moving
the disambiguator role to a field designed for it.

**Predicted consequences — not yet worked instances**:

- A session whose body-file consumer encounters a frontmatter
  authored by a different `id` than the current session
  rejects the body, surfacing the path-collision as a
  consumer error rather than a silent attribution failure.
- A routing surface that previously resolved on
  `session_id_prefix` resolves on `id` and stops carrying
  routing weight in a chat-readable slice.

## Cascade

This PDR names downstream amendments without executing them:

1. **PDR-027 amendment** absorbing the two-field tuple and the
   demotion of `session_id_prefix` to chat-readable short form.
   The amendment lands on PDR-027 as an Amendment-Log entry
   (PDR-027's existing pattern); the additive-identity rule is
   re-stated with `(agent_name, id)` as the identity key. The
   PDR-027 §Identity schema table gains an `id` column; the
   §Full identity block table likewise.
2. **Identity-bearing collaboration substrate schemas** — every
   schema that records an identity reference (active claim,
   commit-queue intent, comms event sender/recipient,
   conversation entry, sidebar participant, joint-decision
   proposer, escalation owner, handoff record, thread identity
   row) gains an `id` field alongside the existing
   `agent_name`. The migration shape is tranched: each schema
   accepts the new field additively first (`id` accepted alongside
   legacy fields, no consumer breaks); each consumer of the schema
   is then updated to resolve disambiguation on `id`; finally the
   schema may strictly require `id` once all rolling consumers are
   on the new field. The tranche order is host-local; the
   additive-first invariant is portable. The schemas themselves are
   host-local artefacts; the doctrine is portable.
3. **Identity preflight derivation** — the canonical identity
   preflight surface emits a UUID `id` alongside the existing
   `agent_name`, `platform`, `model`, and chat-readable short
   form. The constraint is that the same seed produces a stable
   `id` for the lifetime of the session; the derivation method
   (UUID variant, seeding strategy, format) is host-local.
4. **Body-file frontmatter schema** — the four-field minimum
   (`agent_name`, `id`, `created_at`, `last_updated_at`) is
   specified now as a portable schema. Additional fields may
   be added by ceremony-specific extensions (e.g. an
   intent-scoped message file may carry `intent_id`, a
   reviewer scratch note may carry `reviewer_role`). The
   minimum is normative; extensions are host- or
   ceremony-local.
5. **Body-file consumers** — every ceremony that reads a body
   file for downstream consumption verifies the frontmatter
   before use. The consumer rejects bodies whose frontmatter
   `id` does not match the consuming session's identity.
   Tooling placement is the host's choice; the contract is
   portable.
6. **PDR-029 audit-target amendment** — PDR-029 Class A.2
   tripwires audit PDR-027's identity discipline. When the
   PDR-027 Amendment-Log entry lands (item 1), PDR-029's
   audit references update to track the amended contract.
   The amendment shape is mechanical (reference update); no
   tripwire authoring is required.
7. **Identity-rendering surfaces** — host-local. Chat-readable
   surfaces choose how to render the identity (compact pair,
   full `id`, or both) based on their own surface budget and
   ambiguity needs. This PDR does not mandate a rendering
   contract; PDR-027's Amendment Log entry (item 1) is the
   correct surface if a portable rendering rule emerges.

## Notes

**Tempfile-path session-prefix discipline as secondary defence**.
The frontmatter contract (§Decision item 3) is the primary defence
against body-file collision. Naming conventions that embed the
authoring session identity in tempfile paths are a secondary
belt-and-braces convention that the host may adopt independently.
This PDR does not mandate the path discipline; it is noted here as
a host-local defence that may pair with the frontmatter for
defence-in-depth.

Each downstream amendment is a separate landing cycle. This
PDR is the principle layer; the schema amendments, tooling
work, and ceremony updates are operationalisation.

## Consequences

**Enables**:

- A canonical disambiguator that is unique by construction,
  ending the operational pressure of short-prefix collisions
  in growing team windows.
- A structural defence against body-file path collisions
  across sessions, ending the silent-attribution failure
  mode at the substrate level rather than at the ceremony
  level.
- A clean separation of the routing role from the
  chat-rendering role in the identity tuple — each field
  becomes optimal for its role.
- Future identity-bearing schemas can adopt the
  `(agent_name, id)` pair without re-litigating the
  disambiguator question.

**Costs**:

- A migration tranche across every identity-bearing schema,
  every body-authoring ceremony, and every body-consuming
  ceremony. The tranche is real engineering work; the
  decision tranche (this PDR) precedes it.
- Body-file frontmatter adds a small authoring overhead to
  every ceremony that writes a body file. The cost is paid
  per write; the value is paid per consume.
- The two-contract pairing in one PDR requires readers to
  carry both decisions; the structural separation in
  §Decision keeps the contracts distinguishable but the
  pairing remains a cognitive load.
- The `id` field is large compared to the six-character
  prefix in identity rows; storage and rendering surfaces
  that previously assumed a compact identifier need to widen.

**Forbids**:

- Routing on `session_id_prefix` when `id` is available.
  Surfaces that previously resolved disambiguation on the
  six-character slice MUST resolve on `id` after the
  schema tranches land.
- Consuming a body file whose frontmatter is absent or
  whose `id` does not match the consuming session's
  identity. The consumer must refuse or escalate; silent
  consumption is forbidden.
- Treating the body-file frontmatter as a documentation
  nicety. The frontmatter is load-bearing for attribution
  correctness; absence is a structural defect, not a style
  defect.
- Conflating identity-tuple amendment with body-file
  frontmatter amendment at later landing cycles. They share
  a PDR but they are structurally separate decisions; their
  downstream amendments must respect the separation.

## Falsifiability

This PDR is falsified if, after the schema tranches and the
body-file frontmatter contract land, the substrate continues
to exhibit either failure class at the same or higher
frequency:

- A six-character-prefix collision produces a routing error
  that the `id` disambiguator should have prevented. Each
  occurrence is direct evidence against the disambiguator
  claim.
- A body-file path collision across sessions produces a
  silent attribution failure that the frontmatter contract
  should have caught. Each occurrence is direct evidence
  against the frontmatter-contract claim.

A weaker, supporting check operates at the schema-tranche
landing: the migration tranches should reduce the per-window
incidence of short-prefix routing rendering, observable in
collaboration substrate logs across sessions. If post-tranche
sessions continue rendering disambiguation in the
six-character slice for routing-critical decisions, the
adoption is doctrine-incomplete and the disambiguator move
has not taken effect.

Both falsifiers are observable across sessions without
priming. The doctrine succeeds when post-tranche sessions
exhibit `id`-resolved routing and frontmatter-verified body
consumption as default behaviour, not as exception-handling.

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
