# Operations, evolution and assurance

## Scope and conclusion

**Status:** source-grounded control model; CI logs, deployed configuration and
live fault-injection remain external evidence

**Pinned source:**
`Database-Tools@3d1eff31`

Database-Tools contains real learned controls: versioned read models, migration
checks, pgTAP scenarios, generated-model checks, consumer discovery, OIDC package
publication and materialized-view status. The central finding is not that it
lacks assurance machinery. It is that several mechanisms can report success
without establishing the outcome their names imply, while the database,
metadata, API, package and services evolve through independent release paths.

## What is being operated

**Observed:** The repository is a database platform monorepo, not only DDL. It
combines evolutionary PostgreSQL/Hasura definition, fixtures and test tooling,
published/runtime schema representations, a mutation service, authentication,
MV refresh and Vercel infrastructure
(overview).

**Inferred:** PostgreSQL is the shared execution kernel, but the operational unit
is a compatibility chain: database objects, Hasura metadata, query contracts,
generated models, mutation code and consumers. A green gate for one node cannot
establish chain compatibility unless its evidence crosses those boundaries.

## Pull-request database assurance

### Affected-test selection can fail open

**Observed:** The PostgreSQL workflow uses the default shallow PR checkout and
then invokes an affected-test selector
(workflow,
test step).
The selector runs `git diff main...HEAD`, returns no changed files when branch
detection or diff fails, and treats zero selected tests as successful
(diff selection,
runner).
Tests explicitly characterise detached/diff-failure cases as empty selection
(tests).

**Inferred:** A normal shallow, detached GitHub PR checkout may lack a local
`main` ref, allowing the workflow to build the database and succeed without an
integration test. This is high confidence from source composition, not yet a
claim about a sampled CI run.

**Observed:** Even when the diff works, impact extraction recognises only created
functions, views and MVs in `up.sql`. Altered tables, constraints, triggers,
grants, roles, metadata, drops and many data changes have no dependency edge
(extractor).
Staging and contract suites are excluded; parity scenarios are marked manual.

### SQL application can hide statement failure

**Observed:** CI applies migration, fixture and refresh SQL with raw
`psql --file` and no repository-visible `ON_ERROR_STOP`
(workflow).

**Inferred:** A statement error can leave a partially applied script while the
client exits successfully. Production uses Hasura migration application, so the
CI execution path also differs from the production mechanism.

### Hasura contract is outside the database gate

**Observed:** The PostgreSQL workflow starts PostgreSQL but not Hasura and does
not apply metadata. Migration checks inspect naming and object conventions, not
metadata consistency
(database workflow,
migration checks).

**Inferred:** Relationships, permissions, computed fields, event/cron triggers
and the GraphQL contract can regress while database CI remains green.

## Materialized-view refresh as a control system

### Request acknowledgement is not completion

**Observed:** The service authenticates an action and sends HTTP `200` before
dispatching refresh work
(entry point).
All actions are therefore asynchronous at the HTTP boundary, although the README
describes only one as fire-and-forget
(README).

**Inferred:** The caller knows only that the request was accepted. It cannot know
which source snapshot was projected, when refresh completed, or whether it later
failed. Work continuing after response completion also needs a platform-specific
durability guarantee which is not encoded here.

### Coordination is check-then-set

**Observed:** A request reads global eligibility and later writes `started`
without an atomic claim
(preflight).
Two requests can observe the same eligible state before either changes it.

**Observed:** Refresh then:

| Mechanism                                                       | Source evidence                                                                                                                                                  | Consequence to test                                   |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| selects every qualifying published MV                           | enumeration                    | no dependency DAG or dirty subset                     |
| refreshes sequentially in one constructed transaction           | execution                      | long transaction, global failure and contention scope |
| clears every public dirty flag after success                    | completion SQL | flags do not select work and lose source locality     |
| returns early for an empty MV list                              | empty-list paths               | client/global state completion may be skipped         |
| marks every selected MV errored after one failure               | failure path                   | fault locality is lost                                |
| stores a `last_error` concept but does not populate it          | implementation inspection                                                                                                                                        | status cannot explain failure                         |
| sends Slack only for preflight/stale paths, not refresh catches | refresh catch                  | operational notification differs by failure location  |
| cron has zero retries                                           | cron metadata    | automatic recovery waits for a later schedule         |

**Observed:** No service tests were found, and Sonar excludes its JavaScript from
coverage
(coverage configuration).
Hasura OpenTelemetry, metrics, API-limit and network metadata files are empty.

**Inferred:** The service is an ad hoc job coordinator whose state describes
latest global execution rather than a durable, idempotent projection operation.
Its valuable intent is measurable derived-data freshness; the current mechanism
does not produce a consumer-visible freshness proof.

## Evolution ledger and validation

### Compacted baseline

**Observed:** The 37 migrations contain 37 `up.sql` and 36 `down.sql` files. The
missing down is the initial `1767888208177_init` baseline, whose 18,557-line up
file starts `--skip-validation`
(baseline).
Documentation says every migration contains both directions
(Hasura README).

**Inferred:** The ledger is a compacted snapshot plus subsequent evolution, not
complete executable provenance from system origin. That can be an excellent
choice when explicit; it changes what rollback and historical reconstruction can
truthfully mean.

### Syntactic conventions with broad escape hatches

**Observed:** Validators encode learned invariants: published-schema placement,
version naming, no MV-on-MV dependency, no top-level `DISTINCT ON`, and unique
indexes
(MV validator).
Their model uses regex/string parsing; view parsing stops at a semicolon
(parser).
Migration directives can skip documentation or validation, and GitHub validation
checks newly added `up.sql` rather than modifications to old migration files.

**Inferred:** These checks are useful design memory but cannot be treated as a
SQL semantic model or immutable-history policy. OCE should preserve the
invariants in executable, structurally parsed forms and make any exception
specific, owned, time-bounded and observable.

## Schema authority and generation

**Observed contradiction:** Database documentation calls SQL schema docs
generated and another instruction forbids editing them, while `CLAUDE.md`
describes migration-first and schema-first workflows. The reconciler implements
dual authority: a higher-version schema document wins; on equal-version conflict,
the migration wins
(reconciliation).

**Observed:** Drizzle is introspected from a live local database, while Zod is
hand-maintained and future derivation is aspirational
(schema README,
future direction).
Drizzle freshness is enforced by a local pre-push hook, not GitHub CI. The check
returns success on Git errors and uses `git diff --name-only`, which omits
untracked generated files
(check).

**Observed:** The schema package advertises a `./drizzle` export, but distribution
preparation writes only the root Zod export and omits the Drizzle peer dependency
(manifest,
distribution preparation).

**Inferred:** Drizzle is effectively a workspace-internal raw projection despite
being presented as a consumer surface. More broadly, the system reconciles
several representations instead of making projection direction and semantic
loss explicit.

## Local environment and staging authority

**Observed:** `db:init` exports a fixed staging instance into a fixed `latest`
object, downloads it, rewrites SQL text, destroys the local volume, restores the
dump, applies metadata and marks source migrations as applied without executing
them
(orchestration,
export,
restore).

No checksum, immutable object version, schema manifest, redaction policy or
migration-ledger compatibility assertion was found. The documented clean-main
precondition is not enforced. Text replacement occurs per stream chunk, so a
target token split across chunks may be missed
(processing).

**Inferred:** Staging becomes an implicit local schema/data authority. A superior
environment would build hermetically from the declared evolution model and
deterministic scenarios; a sanitised staging snapshot could remain optional
diagnostic evidence with identity and provenance.

**Unknown:** Snapshot privacy classification, redaction, retention, bucket
versioning and external governance.

## Consumer retirement evidence

**Observed:** Consumers are manually listed in `CLIENTS.md` and duplicated in
code. MV usage discovery makes one GitHub code-search query, requests at most 100
results without pagination, swallows repository/search failures, excludes
generated SDK files and recognises literal versioned `published_mv_*` references
(search,
result parsing).
An older version not found by that search is labelled safe to remove
(classification).

**Inferred:** Dynamic queries, generated code, private/omitted repositories,
search truncation/failure and non-GitHub consumers can become false negatives.
The rollback generator can also emit a manual-restoration TODO while metadata
edit failure is only a warning.

The valuable concept is a governed retirement protocol. Its evidence should join
a declared owner/version/deprecation registry, build-time compatibility,
observed runtime use and an explicit owner decision; absence from a heuristic
text search is not sufficient.

## Release and supply-chain composition

**Observed:** Database Cloud Build applies migrations then metadata without a
repository-visible post-deploy smoke, compatibility or rollback action
(Cloud Build).
Mutation API deployment is an independent release-triggered workflow whose own
header warns that Cloud Build failure may leave incompatibility
(deployment).
The npm workflow is path-triggered by schema-package changes but rewrites every
workspace version.

**Inferred:** One release number identifies unrelated packages/services while
their promotions remain independent. There is no visible compatibility
transaction spanning database, metadata, mutation service, schema package,
oak-openapi and OCE consumers.

Positive supply-chain controls include SHA-pinned GitHub Actions, frozen CI
installs and OIDC npm publication. Open gaps include Cloud Build fetching Hasura
CLI from mutable `raw/stable`, mutable container bases/global latest pnpm,
non-frozen container installs, no npm/container Dependabot, ignored Terraform
provider lock and no live SBOM/signing/attestation policy
(Cloud Build,
Dependabot).

## Operational negative space

No repository evidence was found for:

- query-plan or `EXPLAIN` regression tests;
- endpoint/query latency or freshness objectives;
- MV wall-time, row, lock, temp-I/O or per-projection error metrics;
- database capacity, connection or queue headroom;
- a tested database/metadata/API rollback and recovery objective;
- live contract-version inventory across consumers;
- post-deploy end-to-end probes; or
- incident evidence connecting a violated claim to an authorised repair.

These may exist in external platforms. Their absence here means the repository
cannot establish them.

## Concepts worth preserving

- executable, reviewable database evolution;
- stable versioned consumer read contracts;
- learned SQL/MV invariants as machine-enforced policy;
- deterministic scenario fixtures and transactional pgTAP structure;
- generated runtime and compile-time representations;
- explicit derived-projection status and consumer retirement work;
- coordinated review of database, model, API and contract changes;
- strict TypeScript, pinned actions and identity-based publication; and
- short architectural decisions with explicit context and consequences.

## OCE architectural direction

The evidence warrants investigating this stronger basis, not adopting it without
further user/runtime evidence:

1. One explicit authority graph: one competent semantic authority per
   consequential claim, with one-way, loss-aware projections into SQL, query
   types, runtime schemas, docs and SDK contracts.
2. Expand/contract compatibility manifests which prove database, API and
   supported-consumer coexistence before promotion.
3. Hermetic database construction from migrations plus deterministic scenarios;
   snapshots are identified diagnostic inputs, never silent authority.
4. Fail-closed impact analysis with a complete-suite fallback whenever dependency
   extraction or Git context is uncertain.
5. Contract suites over the real database, Hasura metadata, permissions, runtime
   API and generated consumer, targeted to the property each boundary claims.
6. Durable projection operations with atomic claim, explicit DAG, idempotency,
   retry, per-projection status/error, source/output watermarks and freshness
   objectives.
7. A consumer registry joining ownership, supported contract, deprecation state,
   build evidence and runtime-use evidence.
8. Reproducible, immutable build inputs with provenance, attestations and a
   coordinated promotion record.

## Propositions and decisive probes

| Proposition                                                | Would weaken or invalidate it                                                                                                | Decisive probe                                                                                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Affected integration tests frequently select zero in PR CI | representative logs show a valid `main...HEAD` ref and non-zero selection                                                    | inspect recent PR logs; reproduce checkout depth and print branch/refs/diff/selector output                                        |
| SQL CI can pass after a statement error                    | a disposable invalid statement causes the existing step to fail                                                              | run the exact `psql --file` invocation against a failing multi-statement script                                                    |
| Hasura contract regression can pass database gates         | an external mandatory metadata/GraphQL conformance gate is found                                                             | introduce a disposable relationship/permission mismatch and run every required check                                               |
| MV refresh requests can overlap                            | a hidden database lock or platform single-flight serialises the claim                                                        | submit two simultaneous eligible requests and inspect state plus `pg_stat_activity`                                                |
| refresh work can be lost after early HTTP response         | deployed runtime explicitly guarantees completion after response                                                             | run a slow refresh while recycling the function instance and trace durable operation state                                         |
| dirty flags have no operational selectivity                | an external selector consumes them                                                                                           | mutate one source, compare flags, selected MVs and completion clearing                                                             |
| generated Drizzle can drift while CI remains green         | a mandatory remote generation diff gate is found                                                                             | add a migration producing only an untracked generated file, bypass hooks and run required checks                                   |
| One explicit authority graph can replace competing claims  | the same scoped assertion irreducibly requires peer competent authorities, or cannot be expressed as a loss-aware projection | map one curriculum assertion through migration, docs, Hasura, Drizzle, Zod, OpenAPI and OCE; regenerate or reject every projection |
| consumer discovery has false negatives                     | code search is reconciled with complete runtime/owner evidence                                                               | compare heuristic results with gateway query telemetry and signed owner inventory                                                  |
| staging dump and migration ledger can silently disagree    | pre-restore schema/migration identity is checked externally                                                                  | record both identities before `migrate:mark-applied` and deliberately use an incompatible snapshot                                 |

## Required external evidence

The next confidence step is not more source interpretation. It is representative
PR logs, Cloud Build/deployment ordering, live catalogues and metadata, controlled
refresh concurrency/failure, query/freshness/connection telemetry, staging-data
governance, and named consumer-owner evidence.
