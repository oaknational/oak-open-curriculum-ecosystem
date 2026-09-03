# Mutation workflow and control

## Scope and status

**Status:** evidence-backed current-state model; runtime experiments and external
control evidence remain open

**Pinned source:**
`Database-Tools@3d1eff31`

This record asks what the mutation subsystem is trying to make true, what its
present mechanisms actually guarantee, and which concepts an OCE implementation
would need to preserve without inheriting the mechanisms. It does not recommend
repairs to Database-Tools.

## What the subsystem is

**Observed:** The mutation API is an authenticated, command-shaped Hono boundary
over PostgreSQL. Its application mounts eighteen lesson commands beneath
`/api/v1`, including explicit `start`, `complete` and `error` phases for asset
creation, duplication, replacement and unlocking
(app).
It uses Zod for request and response shapes and Drizzle over a serverless
single-connection pool
(connection).

**Observed:** A connection hook marks each database session as
`mutation_api`. Database triggers use that actor to skip existing behaviour,
while TypeScript handlers reproduce selected validation, cloning, identity and
state changes. The same SQL write therefore has different semantics according
to session actor.

**Inferred:** The valuable intention is not CRUD. The API is trying to establish
one command authority for editorial operations, make asynchronous work visible,
validate complete records at the write boundary and acknowledge a meaningful
workflow result. Whether it does so is a separate question.

## Atomicity and acknowledgement

The most consequential current tension is between the documented acknowledgement
and callback control flow.

**Observed:** The endpoint standard says errors are raised inside transactions
and a non-2xx response means no mutation occurred
(standard).
Handlers commonly return `{ success: false }` from the transaction callback
after an earlier possible write. The handler later translates that resolved value
into an HTTP failure.

Representative paths are structurally complete rather than exhaustive:

| Command path                                                                                                                                                                                                               | Earlier write                           | Later returned failure                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------ |
| start create asset              | asset and entity state                  | attaching the asset to the lesson affects no row |
| complete asset                                                  | asset URL                               | entity-state update fails                        |
| complete duplicate  | duplicated asset completion             | review-state update fails                        |
| complete replace video | video, lesson pointer and entity states | review row is absent                             |
| create draft                          | draft and state                         | published review row is absent                   |

**Inferred high-impact hypothesis:** Under ordinary Drizzle transaction
semantics, the resolved failure value would commit any earlier writes, so the HTTP
acknowledgement would not be a trustworthy statement of durable outcome. The
deployed adapter and real database have not established that result; a
fault-injection test remains decisive.

**Observed:** A stale known-issues note says output parsing happens outside the
transaction
(note).
Current handlers generally parse inside it. Parse failures therefore throw and
leave through a different callback path from returned business failures.

**Inferred:** Under ordinary transaction semantics, the thrown parse failure
would roll back while a resolved business failure could commit. The likely risk
boundary is therefore the opposite of the stale note, but it remains subject to
the same real-database probe.

## Concurrency, retries and operation identity

**Observed:** No command-level idempotency key, operation identity, expected
aggregate version, compare-and-set transition, row lock, advisory lock or
explicit isolation level was found. A `complete` or `error` callback is not
cryptographically or relationally bound to the corresponding `start` attempt.

**Observed:** Several commands use check-then-write sequences without a guard:

| Race                                                    | Source evidence                                                                                                                                                                                                         | Possible durable result                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Two asset starts observe an empty slot                  | start create asset           | last attachment wins; another asset/state can remain orphaned |
| Two replacement starts observe the old video as neutral | start replace video       | two replacements and ambiguous completion ownership           |
| Parallel duplicate starts do not transition the source  | start duplicate asset | multiple independent duplicates from one apparent operation   |
| Tag edits replace a read-modify-write JSON object       | update tags                                | one concurrent edit silently loses another                    |

**Inferred:** Retrying a `start` after a lost response is unsafe because it can
allocate a new resource. Retrying a completion can affect state without proving
which attempt it completes. This is not merely missing transport idempotency; the
domain model lacks an addressable operation to make idempotency true.

## State model

**Observed:** Persistence combines several independent meanings:

| Meaning                        | Current representation                                  |
| ------------------------------ | ------------------------------------------------------- |
| record version                 | public-table `_state`                                   |
| current asynchronous condition | `internal.entity_state.current_status`                  |
| review/editorial condition     | review status fields                                    |
| workflow phase                 | separate `start`, `complete` and `error` endpoint names |

`internal.entity_state` stores only the latest status, error and ingest ID, keyed
by entity identity and type
(Zod schema,
database schema).
It has no operation ID, attempt, causation, owning principal, lease, deadline,
expected prior version, history, cancellation, supersession or recovery policy.

**Inferred:** The entity is being used as the workflow. One latest-value row
cannot truthfully represent several attempts, callback ownership, concurrent
work, retry, supersession or a reconstructable history.

**Observed:** The hand-written schema names `ingest_complete`, generated database
schema names `ingest_completed`, and error-unlock documentation and handler use
different variants
(source enum,
generated enum,
route,
handler).
The deployed database value and generation provenance are needed before calling
this a runtime defect.

## Trigger-channel split

**Observed:** Marking a session as `mutation_api` suppresses trigger behaviour
covering lesson validation and normalisation, slugging, tag-derived features,
asset/video/lesson identity and state creation, review cloning and linked-object
maintenance, and generic `_state` cloning. TypeScript commands manually reproduce
selected parts.

Examples include the
lesson before-write function,
asset after-insert function,
video after-write functions,
and
generic state cloning.

**Inferred:** Correctness depends on two implementations evolving together, but
the split is more fundamental than duplication: a hidden session channel changes
database semantics. A failed or missing session marker could execute both the
trigger and TypeScript interpretations. The pool `connect` callback does not
await or surface its setup query in application control flow, so this needs
fault-injection rather than source confidence alone.

## Contracts and information loss

**Observed:** Successful command responses expose persistence-shaped objects but
parse them through narrower Zod schemas. Fields present in introspected Drizzle
tables are omitted from public lesson, review and asset schemas. Zod object
parsing strips unknown keys by default, making output parsing a projection rather
than only validation.

**Inferred:** Draft cloning may lose feature keys. The handler parses a published
row through `lessonSchema` before inserting it
(create draft);
the feature schema declares only selected keys
(features);
and the lesson trigger deliberately skips tag-derived feature computation for
mutation API sessions
(trigger).
This remains a testable proposition, not an established production loss.

## Identity, authority and audit

**Observed:** JWT authentication uses one HS256 secret and a four-application
allow-list. It does not require expiry, issuer, audience, subject or token ID.
Handlers do not use the stored claims for route-level capability or resource
ownership, so every accepted application appears to receive the complete command
surface
(auth schema).
External ingress controls remain unknown.

**Observed:** Public table audit triggers record table, key, operation, changes,
application/role/type and time
(migration).
JWT identity is not propagated to PostgreSQL; API writes share the fixed
`mutation_api` actor. Internal workflow/review changes are outside that trigger,
and multi-row command writes have no common command identity.

**Inferred:** The audit can show selected row changes but cannot locally answer
which human authorised a command, which writes formed one outcome, which attempt
failed or whether a repair completed it. That is an accountability distinction,
not a request for more log volume.

## Assurance boundary

**Observed:** The repository has 59 mutation TypeScript test files and 15 shell
database E2E scripts. Handler tests mock a transaction by invoking its callback
(mock),
so they cannot establish commit/rollback, triggers, constraints, locking or
isolation. The shell tests are not referenced by package scripts or the deploy
workflow. No concurrency, idempotency, retry, rollback, per-route authorisation
or generated-OpenAPI conformance suite was found.

**Unknown:** Deployed ingress controls, database isolation overrides, external
workflow repair, production audit correlation, live enum shape, workload
concurrency and whether another release system runs the shell suite.

## Concepts worth preserving

The evidence supports preserving these intentions, not their current encoding:

- explicit domain commands rather than generic public CRUD;
- named asynchronous workflow phases and visible preconditions;
- one competent mutation authority;
- complete runtime input and output validation;
- version-scoped content and durable audit;
- machine-readable command contracts; and
- separation between transport declaration, domain decision and persistence.

A stronger conceptual basis separates authenticated principal and capability,
stable command identity and idempotency key, aggregate identity and expected
version, workflow operation and attempt, legal transition, atomic commit outcome,
durable event/audit evidence, external-effect handoff, and repair/reconciliation
policy. These are independent obligations; none requires Hono, Drizzle, triggers
or this endpoint partition.

## Propositions and decisive tests

| Proposition                                                  | Present warrant                                                    | Would be weakened or invalidated by                                                                         | Decisive experiment                                                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Returned business failures can commit partial commands       | resolved callback after earlier writes                             | an unobserved wrapper converting unsuccessful values to throws, or different deployed transaction semantics | force a later zero-row update after an earlier insert and inspect durable state after the non-2xx response |
| Parallel starts can create duplicate or orphan resources     | unguarded check-then-write and no operation identity               | hidden serializable defaults, advisory locking or ingress single-flight                                     | coordinate two connections with barriers around each check and write                                       |
| Draft creation can silently discard feature keys             | narrow Zod parse plus trigger bypass                               | passthrough parsing, absence of extra keys or another active recomputation                                  | seed known derived and unknown keys, create a draft, compare JSON exactly                                  |
| Session-actor setup failure can reactivate trigger semantics | unawaited pool event query plus actor-dependent triggers           | demonstrated fail-closed pool behaviour                                                                     | revoke session-function permission and observe whether connection use continues                            |
| Unlock failure has no local recovery transition              | error path ends in failed state and no resetting command was found | an external repair authority with a defined contract                                                        | run start/error and enumerate all accepted commands from the resulting state                               |
| Audit cannot attribute and correlate a human command         | fixed database actor, partial trigger scope, no command ID         | external immutable command-level audit joined by durable identity                                           | issue commands under two principals and reconstruct every resulting write                                  |
| The enum mismatch can cause a runtime failure                | source/generated/route values disagree                             | deliberate translation or a live enum matching every executed value                                         | introspect the deployed enum and execute error-unlock against disposable data                              |

## OCE implications

OCE should model the outcome contract before choosing a mutation mechanism:

1. A command acknowledgement must be a provable statement about one atomic or
   explicitly partial durable outcome.
2. Asynchronous work needs an addressable operation/attempt separate from the
   content entity.
3. Idempotency and optimistic concurrency are domain protocols, not middleware
   decoration.
4. One invariant should have one authoritative enforcement path, with database
   constraints retained for integrity that must survive every writer.
5. Audit evidence must join principal, authority, command, writes, effects and
   repair without relying on mutable latest-state rows.
6. Contract tests must cross the real database and transaction boundary for the
   properties which mocks cannot establish.

These are candidate kit obligations because additional consumers will otherwise
reinvent them inconsistently. Their exact API, storage and workflow architecture
remains open until the wider authority-chain and user-work evidence is complete.
