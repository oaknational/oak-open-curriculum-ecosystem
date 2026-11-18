---
id: codex-app-server-idle-wake
node_type: delivery
name: "Codex native idle wake — one seat, host driven"
overview: "Wake a Codex team seat from canonical comms through an atomic native Codex extension while it is idle, without another model seat or a perpetual model-side polling loop."
status: archived
ratified_by: null
ratified_date: null
ratified_where: null
serves: first-major-release
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-25
---

# Codex native idle wake — one seat, host driven

## Disposition (archived 2026-09-25)

Abandoned as a sketch; it was never ratified. The owner ruled its core out on 2026-08-01
("Pinned native extension: NO"). The ratified node `codex-queue-wake-bridge` (2026-09-24) now
pursues the goal through the vendor's `codex queue` subcommand. An earlier edit (`0d31f7466`)
marked this sketch `superseded`, but the plan schema allows that status only for a ratified node,
so it is archived instead (PR 187 review, thread 4106252530).

## Owner rulings (2026-08-01, decision cards, Director session 52841f)

Both former owner gates are RULED, not expired:

1. **Trust mode: same-UID processes are inside the trusted computing
   base.** Recorded as the accepted trust mode — it matches the estate's
   actual posture (every agent seat already runs unrestricted as the
   owner's user). This ruling stands for whenever this plan resumes.
2. **Pinned native extension: NO.** Oak does not carry fork-adjacent
   native code compiled against Codex internals — the maintenance work is
   disproportionate to the benefit. This plan is therefore **deliberately
   deferred** (a ruling, never drift): implementation waits until a
   supported upstream surface exists or the wake need outgrows the
   working degraded paths (relay child + bounded foreground polling).
   The owner-commissioned successor exploration is
   [`codex-upstream-idle-wake-contribution`](../codex-upstream-idle-wake-contribution.plan.md)
   — the wake capability as a PR into the Codex codebase, including the
   Codex-native loop assessment; that plan's creation was the
   commissioned deliverable and further work from it needs fresh owner
   word.

## Goal

A sole Codex team seat can become active when a relevant canonical comms event
arrives, absorb it, and respond without a user prompt, a manual foreground
poll, another Codex seat, or an indefinitely running model turn.

## Mechanism

Create the user-visible Codex seat under one local app-server from session
start and load a pinned native extension into that exact Codex process. Extend
the seat's root-identity canonical watcher with a private local control path to
the extension. A verified binding joins the exact Unix socket/server instance,
loaded `CodexThread`, coordination home, repository, checkout, and root
identity; discovery by recent thread ID or attachment through a second
app-server is forbidden.

The extension, not public `turn/start`, owns automatic wake. It resolves the
bound thread and uses Codex's native `try_start_turn_if_idle` reservation as the
atomicity seam. In 0.146.0 that seam rejects active, Plan, and internal pending
trigger work, but does not atomically prioritise a simultaneous external
TUI/app-server submission. The extension must add a user-priority submission
generation/barrier inside the same reservation transaction: if a user request
is queued concurrently, the wake aborts and remains pending before either its
input or settings can enter the user turn. That user-priority fence remains
armed for the full lifetime of the native wake turn, not only its reservation.
Every later TUI or app-server submission advances the user generation and is
held outside the wake turn while one broker transaction marks cancellation
pending, revokes the wake correlation or receipt and turn-local capability
profile, and transfers any unresolved event to foreground custody. A committed
acknowledgement intent may continue broker-side, independently of the cancelled
model turn; an indeterminate spend is quarantined. The user turn may start only
after native cancellation and profile removal are confirmed, so input cannot
become same-turn steering and wake capabilities cannot leak into it. A status
read followed by unconditional `turn/start` is forbidden; it has no
expected-status precondition and becomes same-turn steering when a regular turn
wins the race. The existing native method alone is therefore a basis, not
sufficient proof.

The canonical collaboration-state watch engine preserves heartbeat,
validation, relevance, and gap-drain duties. Its injected sink accepts an event
only after a supervisor-owned durable outbox, which survives the native
extension, records the exact event ID and one current retrieval owner; only then
may the root seen cursor advance. Codex-specific dispatch reads that outbox. On
incompatibility, retirement, or an indeterminate dispatch, the supervisor
atomically revokes the native lease and transfers every unresolved entry,
including indeterminate entries, to the bounded manual foreground path before
native ownership ends. That path drains the same outbox before scanning unseen
canonical traffic and reconciles indeterminate entries rather than replaying
them blindly. An unproved initial durable owner prevents cursor advancement; an
unproved later handover prevents native ownership release and blocks
retirement. The first slice admits only directed-to-exact-root, non-heartbeat,
non-self traffic. During notification and capability invocation, the source
event ID, event-derived digest, authorship, and route remain broker-side audit
data; event-controlled fields are untrusted claims. Codex 0.146.0 transports
both `turn/start.input` and additional context labelled `untrusted` as user-role
model input; delimiters preserve provenance but are not an instruction-role or
authority boundary. The native wake therefore receives only a fixed
controller-authored notification containing a broker-minted opaque prompt
correlation with no event-authored bytes. The source event ID, digest, and body
never enter that notification.

Content absorption uses two turn-bound event broker capabilities. After an
isolated native wake turn is reserved, the broker mints one prompt correlation
bound in broker state to the exact source event, root identity, `CodexThread`,
native wake turn, short expiry, and unused state. `read_event` accepts only that
correlation; trusted caller context supplies the root, thread, and turn. One
atomic compare-and-spend verifies the exact binding, expiry, unused state, and
revalidated source before irreversibly spending the correlation and returning
the redacted body as untrusted, ephemeral tool output. Missing, expired,
wrong-root, wrong-thread, wrong-turn, and replayed correlations return the same
closed error and reveal no event body, metadata, or existence. A correlation
cannot be refreshed or delegated; if it persists in model-visible history it
is already spent or becomes useless when its native wake turn ends. A crash
between spend and return is indeterminate and never reissues the correlation.
Correlation expiry and native-turn completion are state-machine inputs, not
passive clocks. They race atomically with `read_event`: if an unused
correlation loses that race, the broker revokes it and transfers the still
unread outbox entry from native `notified` custody to the bounded foreground
retrieval owner in one transaction. Failed owner acceptance keeps native
custody and blocks turn retirement; an indeterminate spend is quarantined
rather than replayed. No terminal or waiting state may retain an unused expired
correlation without a live retrieval owner. If expiry or native-turn completion
instead wins after `read_event` but before a durable acknowledgement intent —
a provider failure or an early model stop ending the wake turn — the
turn-bound receipt is revoked and the unresolved entry transfers to foreground
reconciliation custody as `read` but unacknowledged, exactly as under
user-priority cancellation below; it cannot be automatically reinjected. A
committed acknowledgement intent again finishes broker-side only.

User-priority cancellation is another state-machine input and races atomically
with `read_event` and `acknowledge_event`. If it wins before read, the unread
entry transfers with the revoked correlation. If it wins after read but before
a durable acknowledgement intent, the receipt is revoked, ephemeral content is
destroyed with the cancelled wake context, and the unresolved entry transfers
to foreground reconciliation custody as `read` but unacknowledged; it cannot be
automatically reinjected. If an acknowledgement intent already committed, only
that fixed broker-side intent may finish. Cancellation or transfer uncertainty
quarantines the entry and keeps the user submission outside the wake turn.

The body and model-authored wake content are excluded from rollout persistence,
thread history, compaction summaries, and every later ordinary-turn context.
On this wake path, the source event ID, digest, authorship, and route never enter
model input, model-visible history, or a tool result, and none can select egress.
The digest, authorship, and route remain broker audit data. The broker may
disclose the source event ID only as the canonical acknowledgement envelope's
constrained `in_response_to` field—never in its title or body. That is a
threading exception, not model-visible capability data or routing authority.
Before returning content, the broker applies repository data classification and
redaction and proves that this content is authorised for the configured model
provider and retention policy. Model inference is an explicit governed egress,
not hidden beneath a claim of “no network.”

After `read_event`, the broker issues one bounded challenge profile fixed by the
trusted controller and bound into the opaque receipt; neither event-authored
data nor the model can select the profile. The routine profile asks one
discriminating, content-specific question with two to four broker-numbered
closed choices. It supports a useful bounded acknowledgement, but even a
correct routine answer is only notification/read evidence and never certifies
`ABSORB` because it remains guessable.

The separate proof profile is available only for an owner-held safe canary
whose exact event ID, digest, and expected answer commitment an external
verifier registers before dispatch. The canary body contains 64 independently
uniform four-way symbols held by canonical canary storage and the external
verifier, and exposed to the model only through the redacted `read_event` body,
never through another model-visible surface. The model must return the exact
fixed-length tuple of 64 ordinals, each closed to `0..3`, in one attempt. The
verifier, not the broker or event, mints and precommits the expected tuple; the
broker never derives or fills the model-authored tuple from the body. With no
partial credit and one attempt, a blind match has probability
`4^-64 = 2^-128`. Question and choice content remain ephemeral tool output.

`acknowledge_event` accepts only the opaque read receipt, the exact ordinal
tuple shape fixed by its profile, and one value from each small broker-owned
`disposition` and `next_action` enum. The schema has no optional keys,
variable-length lists, arbitrary strings, source excerpts, `other` value, or
extension point. The receipt is bound to the same root, thread, turn, and event;
once that receipt is identified, its first answer attempt enters one durable
broker transaction. The transaction atomically spends the receipt on success
or failure, records the bounded comparison outcome, and—on success—commits a
sanitised acknowledgement intent containing the deterministic event ID, exact
source/root/thread/turn binding, engagement tuple, and broker-rendered body. If
that commit fails, neither the spend nor intent exists. This makes mismatch a
one-attempt result without leaving a successful spend stranded before durable
dispatch state. The broker rejects a bare status, an unissued choice, a replay,
or an invalid combination. On success it renders a fixed body of at most 192
UTF-8 bytes containing only broker vocabulary; neither the tuple nor raw canary
content is emitted. The broker audit records the challenge-template version,
answer commitment, selected-tuple digest, match result, and turn binding, not
either raw tuple or a duplicate event body. Thus event text can influence the
bounded selection after it is read, but cannot add free-form egress bytes,
choose a route, or broaden the capability.

The controller dispatches only from that committed acknowledgement intent,
never from an in-memory tool result. The broker creates one bounded canonical broadcast reply whose sole
source reference is the constrained `in_response_to` field; event-declared
author and route remain provenance claims and cannot select a target. On an
existing event ID, exact source ID, digest, binding, engagement tuple, and
rendered-body equality is required or the item is quarantined. The model cannot
select the destination, event ID, envelope, or free-form reply body. The state
machine records read and reply facts but never self-certifies `ABSORB`; a
routine answer cannot certify it either. Only the external verifier's
precommitted proof canary, or separately observed deliverable movement that
responds to the coordination, can certify that class. If the pinned native extension cannot provide
ephemeral tool-result isolation, exact-event egress, and this crash-safe
idempotency without generic tools, the plan may prove `NOTIFY` only and must not
claim `ABSORB` or end-to-end completion.

A small deterministic state machine records `captured`, `pending`,
`dispatching`, `notified`, `read`, `ack_intent`, `cancel_pending`, `replied`,
`handover`, `quarantined`, `indeterminate`, and terminal failure. Correlation
expiry and turn completion, plus user submission at any point in the wake-turn
lifetime, must leave unresolved native custody through the atomic cancellation
and owner-transfer rules above; committed `ack_intent` is the sole input to
reply dispatch and survives controller restart. The first vertical slice uses native atomic start-if-idle for
a fixed notification-only turn and queues every rejected or non-idle event. A
simultaneous TUI start must win without receiving wake input or wake settings.
Brokered read and acknowledgement follow only after their capability boundary
is proven. Automatic wake never steers an ordinary active turn. Every eligible
event remains queued until the extension atomically reserves a new isolated
wake turn at an idle boundary; inability to prove that boundary records the
capability as unsupported. The prompt correlation is a fixed-format opaque,
single-use, turn-bound broker token, not a source event ID or server-side
idempotency claim.

The automatic turn uses a mechanically enforced, non-sticky capability profile
with no shell, file mutation, model-selectable network tool, generic
MCP/dynamic tools, model-accessible external-write capability,
permission/policy changes, or persistent approvals. The only later exception
is the two exact-event broker capabilities above; the acknowledgement write is
rendered and routed by the broker, not by the model. Those capabilities exist
only on the isolated wake turn and are absent from ordinary active turns. Codex
0.146.0's existing `try_start_turn_if_idle` uses the thread's default turn
context, so the native extension must also prove an atomic, turn-local
capability/output profile that cannot weaken or persist into the next user
turn. Without that confinement the viability gate fails. App-server requests
use the version-generated closed union: one connection-affine handler owns each
supported variant, while unknown or newly added variants interrupt the wake
turn and mark the extension incompatible.

On recovery, the host controller reconciles native wake correlation against
authoritative thread history before retrying and reconciles canonical reply
creation by deterministic acknowledgement event ID and exact read-back. Durable
capture and retrieval-owner handover are idempotent by source event ID; a
repeated ID with a changed digest is quarantined. An unresolved indeterminate
wake or reply transfers to fallback custody for reconciliation and is
quarantined rather than blindly replayed. The guarantee is that no acknowledged
event is lost and no event is knowingly injected twice, not abstract
exactly-once delivery across independent stores.

Durable state contains the canonical event reference, digest, routing
metadata, correlation, dispatch state, and binding—not a second comms body.
Dispatch revalidates the digest against canonical storage. Closed-metadata
logs, bounded queues and per-source/global budgets, circuit breaking, and a
retirement tombstone constrain disclosure, spend, flooding, and resurrection.

The extension and host controller observe protocol status and completion
events, own one-seat lifecycle, an exclusive controller lease, and pinned
source/protocol/version checks. They continuously drain the transport,
reconcile after disconnect, and fail visibly when binding, atomic wake,
capability confinement, request routing, or state cannot satisfy the contract.
The existing child relay and bounded manual foreground-polling procedures remain
mutually exclusive retrieval modes outside this mechanism for unsupported
harnesses; an atomic retrieval-owner handover makes accepted outbox entries
available to that foreground path before native ownership ends. Failure of the
native viability gate does not add a sleep,
automatic-continuation, or same-turn steering path; none of those procedures is
an idle-wake claim.

## Acceptance criteria (each with a proof — required)

- **A canonical event wakes an idle seat end to end.** One external directed
  event atomically starts one new turn without a user prompt or manual
  foreground poll. After the model reads that exact event through the bound
  broker, it answers the receipt-bound closed challenge and presents the opaque
  receipt to `acknowledge_event`; the broker emits one fixed-schema,
  content-dependent broadcast acknowledgement with a deterministic event ID
  and `in_response_to` link to the source event. A bare status, an incorrect
  selection, or even a correct routine-profile answer cannot certify `ABSORB`.
  Proof: `repo-safe` — native-extension, state-machine, challenge, broker, and
  egress integration tests; `owner-held` — a safe live Plover canary whose
  externally minted 64-symbol answer is precommitted and reaches the model only
  through the redacted `read_event` body, while canonical storage and the
  external verifier retain their required copies. The evidence record contains
  the challenge-template version, commitment, selected-tuple digest, match,
  exact binding, and canonical reply.
  The external verifier uses that one-attempt `2^-128` proof to demonstrate
  `ABSORB`; the ordinary path demonstrates `DELIVERY` and `NOTIFY`
  independently.
- **The wake reaches the one intended user-visible session.** The TUI,
  app-server, native extension, and host controller share one verified Codex
  process/thread binding from session creation. A second server, guessed recent
  thread, stale binding, foreign controller, or retired thread is rejected.
  Proof: `repo-safe` — binding and mismatch tests; `owner-held` — a live canary
  shows the native automatic turn and response in the intended TUI.
- **Active and non-steerable states preserve every eligible event.** The first
  slice retains every event rejected by native start-if-idle and retries only
  after a later idle transition. A user-priority generation barrier shares the
  reservation transaction; if a TUI submission races, the wake aborts before
  either input or settings enter that user turn. The barrier remains live until
  the wake turn terminates. A user submission after reservation—including
  after `read_event`—first cancels and fences the wake, revokes its correlation
  or receipt and capability profile, and transfers unresolved custody or
  quarantines indeterminate work before a clean user turn may start. Automated
  delivery never steers an ordinary active turn; active, review, compaction, and
  other non-steerable states continue to queue until a new isolated wake turn
  is atomically reserved at idle. Status races and repeated delivery neither
  lose an acknowledged event nor inject one event into the model twice.
  Proof: `repo-safe` — exhaustive transition, both orderings of the
  simultaneous-TUI-start race, post-reservation and post-`read_event` user-start
  races in both orderings, full-lifetime fence, cancellation-before-user-start,
  no-same-turn-steering, ordinary-turn capability absence, user-priority
  barrier, settings-isolation, ordering, and idempotency tests over idle,
  active, Plan, pending-trigger, review, compaction, reconnecting, and
  incompatible states.
- **A controller restart resumes the same seat without a blind gap.** The host
  persists each event in a supervisor-owned outbox with one retrieval owner
  before advancing the canonical cursor, rebinds the exact native extension and
  live thread, rejects a stale or retired thread, drains unseen comms before
  waiting, and reconciles native wake, correlation expiry/turn completion, the
  durable acknowledgement intent, and canonical reply after a crash or upgrade.
  An unused token's expiry or turn completion, plus incompatibility,
  retirement, and indeterminate dispatch, atomically fence native dispatch and
  transfer every safely unread outbox entry to the bounded foreground path;
  that path drains the shared outbox before unseen canonical traffic and
  quarantines rather than replays indeterminate work. A failed handover cannot
  release native ownership or complete retirement. A committed acknowledgement
  intent is replayed idempotently to its deterministic event ID and is never
  reconstructed from model output or a spent receipt.
  Proof: `repo-safe` — process-boundary and retrieval-handover integration tests
  covering crash points before and after cursor advance, native wake
  acceptance, unused-token expiry, native-turn completion, receipt-spend plus
  acknowledgement-intent commit, owner transfer, and canonical reply
  acknowledgement, with no-gap, no-duplicate, and indeterminate-quarantine
  assertions.
- **The control plane is local, bounded, and single-owner.** One native
  extension/controller pair owns a seat at a time and takes an atomic exclusive
  lease. Client identity strings, socket ownership, peer credentials, and a
  separate broker UID or sandbox are not authentication of the current-user
  controller. In same-UID trust mode, every process able to connect, inspect,
  or impersonate the extension/controller is explicitly inside the accepted
  trusted computing base. In isolated mode, one launcher creates a pathless
  inherited authenticated IPC channel before privilege separation and binds
  its unexported endpoints to the exact extension, controller, and broker; an
  OS-enforced anti-inspection boundary prevents other same-UID processes from
  reading their FDs or memory, attaching a debugger, or collecting a core dump.
  A filesystem socket or bearer secret readable from a current-user process
  cannot clear that mode. The boundary is owner-held. State is restrictive and
  untracked, routine logs are metadata-only, queues are bounded, and retry backs
  off.
  It stops on supervisor loss, thread closure, socket replacement, identity
  mismatch, or explicit retirement and cannot resurrect a retired seat.
  Incompatible protocol or malformed state fails visibly without claiming
  liveness.
  Proof: `repo-safe` — lock, lifecycle, compatibility, same-UID trusted-base
  enumeration, inherited-channel endpoint binding and exclusivity,
  same-UID connect/impersonate/FD-memory-inspection rejection, debug/core-dump
  denial, peer-credential-is-not-authentication, separated-principal negative
  controls, overload, malformed-payload, queue-bound, reconnect, and
  supervisor-death tests.
- **Interactive app-server requests retain a safe user-facing route.** An
  extension-created turn cannot silently approve, auto-answer, or strand
  command approval, file approval, user-input, MCP-elicitation, time, or
  attestation requests. The version-generated request union gives every
  variant exactly one connection-affine handler; an unknown variant, stale
  response, or unsupported route fails closed. Automated wake cannot grant
  session or policy amendments, and token refresh or attestation cannot
  traverse the event capability broker.
  Proof: `repo-safe` — generated-union exhaustiveness, connection/turn/request
  binding, replay, timeout, disconnect, stale-resolution, and no-auto-approval
  tests; `owner-held` — a reversible live approval canary is answered in the
  intended user-facing client.
- **Untrusted event text cannot exercise the seat's ambient capabilities.**
  Peer-authored body text never appears in `turn/start`, additional context, or
  another instruction-role item; the fixed wake notification contains only a
  broker-minted opaque prompt correlation with no event-authored bytes. Source
  event ID and digest never enter model input, model-visible history, or tool
  output; the broker alone may place the source ID in the fixed canonical
  `in_response_to` envelope field. The body reaches the model only as the result
  of the exact-event `read_event` capability. Its correlation is bound to the
  exact root, thread, native wake turn, expiry, and unused state and is
  atomically spent before content returns; wrong-context, expired, and replayed
  tokens fail identically without disclosure. Raw broker output and
  model-authored wake content are ephemeral: neither may enter rollout
  persistence, thread history, compaction, or a later ordinary-turn context.
  Existing thread permissions cannot widen the isolated automatic turn, which
  has no capability beyond bound read and fixed-schema acknowledgement; neither
  capability exists on an ordinary active turn, and the confinement cannot
  weaken or persist into the next user-authored turn. The one allowed external
  effect is the broker-rendered broadcast reply linked to the exact source
  event; no model-selected route or free-form egress exists. Model-provider
  inference is a separate allowed egress only for content whose classification,
  redaction, provider authorisation, and retention have passed.
  Proof: `repo-safe` — user-role exclusion, adversarial prompt,
  receipt-before-ack, non-persistence/compaction, later-turn exclusion,
  source-ID prompt/history/tool exclusion, turn-bound single-use and replay
  rejection, uniform closed errors, unused-expiry/turn-completion handover,
  atomic-spend-plus-ack-intent, deterministic reply ID and collision read-back,
  closed challenge/output schema, sticky-permission,
  ambient-tool-denial, active-turn capability absence, provider-policy,
  redaction, and next-turn-restoration tests;
  `owner-held` — the live canary confirms no side effect beyond the constrained
  acknowledgement.
- **Evidence remains class-honest.** Watcher delivery, creation of a reasoning
  turn, and content absorption are reported separately; process health,
  cursor movement, or socket acknowledgement cannot be presented as higher
  liveness evidence. A read receipt, bare status, routine-profile choice, or
  fixed reply proves at most notification/read evidence. `ABSORB` requires an
  external verifier's exact one-attempt match against the precommitted 64-symbol
  canary tuple, with no partial credit and blind-match probability `2^-128`, or
  separately observed deliverable movement responding to the coordination.
  Proof: `repo-safe` — evidence-projection, routine-correct-is-not-absorb,
  wrong-tuple, first-attempt-spend, correlated-symbol rejection, canary-profile
  authority, leak-surface, and bare-status tests; `owner-held` — the safe live
  canary record names the event, wake path, turn, challenge-template version,
  expected commitment, selected-tuple digest, exact match result, and threaded
  response without recording the raw tuple.
- **A new Codex seat discovers the supported path automatically.** The
  canonical team-alert rule and its bounded generated `AGENTS.md` projection
  select the native wake path when supported and name the bounded manual
  foreground-polling fallback when it is not.
  Proof: `repo-safe` — projection freshness, low-power discoverability, and
  built-CLI smoke tests.
- **Automated wake respects routing and authority boundaries.** Self-authored,
  heartbeat, merely observed, malformed, oversized, and otherwise ineligible
  traffic cannot create a turn. Eligible events retain author and route only as
  untrusted provenance; source event ID and digest never enter model-visible
  surfaces or select acknowledgement egress. Only the broker-minted opaque
  prompt correlation appears in the notification; the broker alone discloses
  the source ID as the canonical reply's constrained `in_response_to` field.
  Proof: `repo-safe` — routing-policy, provenance, non-targeting reply,
  user-role exclusion, injection, self-suppression, and bounded-payload tests.
- **State, spend, and retirement remain bounded.** Durable state minimises
  duplicated content, verifies event digests, uses restrictive permissions,
  and keeps secrets, user answers, auth refresh material, attestation, raw
  event bodies, and wake model output out of durable state, logs, telemetry,
  compaction, and later turns. Per-event, per-source, and global budgets plus a
  circuit breaker quarantine overload. A durable tombstone makes retirement
  irreversible across reconnect and supervisor restart.
  Proof: `repo-safe` — fake-secret/PII, data-classification, provider-retention,
  mutation, transaction-disk-failure, unused-correlation expiry, turn-close,
  flood, overload, ephemeral-context, tombstone, and stale-process tests.

## Todos

- **Pickup design decision (recorded 2026-08-01 from exact-head review;
  decide before any reply-path build).** Deterministic reply-ID recovery
  currently checks IDs only in the live comms dir
  (`state-io.ts` write path) while canonical archive rotation moves
  events out of it — so a reply written, then a controller crash before
  `replied` is recorded, then rotation, lets replay mint a second live
  event instead of the promised exact read-back. Choose ONE cure at
  pickup: a single atomic ID namespace across live and archived events,
  or rotation that refuses to move replies whose resolution is
  unrecorded. Either choice carries a crash/rotation race proof, and
  source revalidation becomes archive-aware. The fork is the lane
  owner's; this entry pins the obligation so the sketch merges honest.
- **A — bounded viability gate (round budget: at most two review rounds).**
  Against the pinned Codex source, load a native extension into the same process
  as the app-server and user-visible thread. Prove exact binding and native
  `try_start_turn_if_idle` reservation plus a same-transaction user-priority
  submission barrier that remains armed through wake-turn termination,
  including simultaneous, post-reservation, and post-`read_event` TUI-start
  orderings that cancel or queue the wake with no input, settings, or capability
  leakage. Extend that seam with a
  non-sticky turn-local capability and closed-output profile; prove source event
  ID, digest, and raw event text never enter user-role input or
  persistent/later-turn context, provider-authorised ephemeral broker read,
  deterministic crash-safe acknowledgement, restart reconciliation,
  stale/retired rejection, exclusive lease, crash boundary, connection-affine
  request routing, the owner-approved all-reachable-same-UID trusted base or
  pathless inherited-channel plus OS anti-inspection isolated mode,
  privacy/retention, and irreversible retirement. Failure of any
  condition—or refusal of either owner gate—stops the build and records the
  unsupported capability instead of adding a second control path. No rollout
  or canonical operating-rule promotion may begin until the pinned extension
  has its approved, dated upstream or sunset exit path.
- **B — atomic notification vertical slice (round budget: at most two review
  rounds).** Add the native extension hook, directed-event policy, pure
  transition logic, metadata-only durable capture/outbox, exact process/thread
  binding, exclusive lease, retrieval-owner handover, quotas, bounded transport
  recovery, retirement tombstone, and a fixed opaque-correlation-only
  notification turn. Prove fallback drains the shared outbox first and that
  incompatibility, retirement, and indeterminate dispatch cannot strand a
  cursor-accepted event. All rejected and non-idle events remain queued. This
  slice may prove `NOTIFY`; it cannot claim `ABSORB` before Todo D's external
  proof canary.
- **C — brokered absorption and isolated-turn confinement (round budget: at
  most two review rounds).** Add exact-event `read_event` and
  `acknowledge_event` capabilities, ephemeral non-compacting read context,
  provider-policy checks, turn-bound single-use correlations, discriminating
  routine closed-choice acknowledgements, the controller-selected owner-held
  64-symbol proof-canary profile, atomic receipt-spend plus durable
  acknowledgement-intent commit, deterministic acknowledgement IDs, exact
  collision read-back, fixed-schema non-targeted canonical reply egress, and
  the full user-facing route for every supported app-server request class.
  Prove the canary tuple is verifier-minted, independently uniform, absent from
  notification and metadata surfaces, never broker-filled, and accepted only
  as one fixed-shape first attempt. Prove unused-correlation expiry and native
  turn completion atomically transfer the unread outbox entry to foreground
  custody, while a user submission anywhere in the wake lifetime atomically
  fences and cancels the wake, revokes its capability profile, and transfers
  unresolved custody before the user turn starts; indeterminate spend
  quarantines. Prove both capabilities are
  installed only on a newly reserved isolated wake turn; active, review,
  compaction, Plan, pending-trigger, and ambiguous states continue to queue.
- **D — live canary and discoverability (round budget: at most two review
  rounds).** Run external Plover canaries covering atomic idle notification,
  brokered absorption/acknowledgement, simultaneous TUI start, interactive
  request routing with reversible non-persistent decisions, queue-while-active
  followed by isolated idle delivery, routine acknowledgement without an
  `ABSORB` claim, the precommitted one-attempt proof-canary match,
  expiry/turn-close handover, user starts after reservation and after
  `read_event`, crash after receipt spend, durable-intent replay,
  fallback handover, fake-secret containment, retirement, and restart recovery.
  Only after the pinned-extension exit-path gate is cleared, update the
  canonical operating rule and generated bootstrap; retain the explicit bounded
  manual foreground path for unsupported harnesses.

## Out of scope

- The MCP-456 capability ledger, schema, and cross-harness probe packs; this
  plan consumes capability evidence but does not own observability.
- A generic background-agent framework or multi-seat abstraction; the first
  consumer is one Codex seat and generalisation waits for a second consumer.
- Perpetual goals, token-consuming keepalive turns, or model-authored polling;
  the host owns wake scheduling.
- Experimental sleep and automatic-continuation tools; they remain excluded if
  the native viability gate fails. Failure records the capability as unsupported
  and adds no second control path.
- Remote TCP or WebSocket control, shared sockets, and cross-machine routing;
  the first control plane is local Unix-socket only.
- An indefinite private Codex fork. Any pinned native extension needs an
  owner-approved upstream or retirement path before production rollout.
- Proving model answer quality; `ABSORB` proves engagement with the routed
  event, not correctness of the resulting work.
