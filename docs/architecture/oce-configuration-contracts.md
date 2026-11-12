# OCE instance configuration contracts

**Edition 1, 10 October 2026 — proposed design.** The settled source and
consumption boundary is [ADR-233](architectural-decisions/233-retained-framework-and-configurable-instances.md).
The [controlling architecture](oce-architecture.md) owns the open invariant
register. This document owns the proposed configuration responsibilities,
activation contract and architectural scenarios. It records required behaviour,
not an implemented configuration API or evidence of operational generality.

An instance repository selects behaviour from already published OCE capabilities.
It contains the smallest useful instance-specific data and references. OCE retains
the interpreters, hosts, composition, policy enforcement, validation, build,
evaluation, release and operating mechanisms. Ordinary supported variation must
require zero OCE edits and zero new OCE releases in most cases.

## What counts as configuration

Configuration is a value interpreted by an identified, supported mechanism. The
same distinction applies to application logic, build files, CI and operational
procedures. A short script is still a mechanism; a large policy or content
document can still be data.

| Instance may own                                                                   | OCE owns                                                                                        |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Selected capability and resource identifiers; live/dormant declarations            | Capability implementations, selection/totality validators, registration and dispatch            |
| A permitted composition of published operations and typed connections              | The composition interpreter, connection checks, retries, scheduling and effect execution        |
| Approved policy selections and constrained values within delegated authority       | Policy interpretation, enforcement, authority verification and mandatory floors                 |
| Instance-specific explanatory content and data, with provenance                    | Rendering, content transformation, moderation/validation and asset processing mechanisms        |
| Theme, layout and component selections supported by a published experience profile | Components, renderers, accessibility behaviour, widget transport and build machinery            |
| Source/corpus/profile references, resource bindings and permitted tuning           | Source adapters, projections, indexing, retrieval, evaluation and lifecycle automation          |
| Exact dependency versions, lockfile, environment labels and credential references  | Compatibility checks, release planning, deployment adapters, recovery and diagnostic mechanisms |
| Declarative provider binding files that invoke supported published entrypoints     | Authored/generated provider adapters and reusable CI/workflow implementations                   |

Root manifests, platform-required binding files and a lockfile can live with the
instance when they contain declarations only. A generated executable adapter is
an immutable distributed OCE artefact with its source revision, generator and
digest; the instance does not edit or fork it. Source-map paths and generated
headers are not enough: the build must verify its identity against the pinned
distribution.

A configuration may not supply callbacks, handler source, arbitrary imports,
custom shell steps, unrestricted query expressions, executable templates or an
unvalidated provider client object. Nor may it reimplement a reusable mechanism
inside a nominally declarative escape field. A new capability must first be
implemented and published by OCE.

## Contract shape: a family of typed profiles

Do not impose one universal configuration language or schema on every capability.
A profile names a coherent consumer contract, such as a curriculum MCP service,
a search instance, a widget experience or an evaluation run. Each profile exposes
the variation its consumer needs and declares its supported connections.

The initial recommendation is schema-valid data with generated editor/type
support, interpreted by a published profile runner. JSON is the smallest initial
candidate; a YAML or restricted TypeScript authoring form is acceptable only if
it produces the same validated data and cannot execute application mechanisms.
Choose the authoring representation through the first profile design, using the
scenarios below. Do not block unrelated CF work on that choice.

The following **illustrative structural types** specify responsibilities. Names
and package allocation are proposals, not exported TypeScript declarations.
String formats and reference membership require runtime checks; TypeScript alone
cannot establish them.

```typescript
type Digest = Readonly<{
  algorithm: 'sha256';
  hex: string;
}>;

type PublishedArtefact = Readonly<{
  packageName: string;
  exactVersion: string;
  integrity: Digest;
}>;

type ContractReference = Readonly<{
  artefact: PublishedArtefact;
  contractId: string;
  contractVersion: string;
}>;

type CredentialReference = Readonly<{
  providerBindingId: string;
  secretHandle: string;
  purposeId: string;
}>;

type InstanceHeader = Readonly<{
  configurationFormat: string;
  instanceId: string;
  configurationRevision: string;
  profile: ContractReference;
  declaredAuthorityId: string;
}>;

type ConfiguredInstance<TProfileData> = Readonly<{
  header: InstanceHeader;
  profileData: TProfileData;
}>;
```

`TProfileData` is the concrete generated data type for one published profile.
It is not a runtime bag of arbitrary keys. A runner rejects an unknown profile,
unsupported format/revision, unknown field, unresolved reference or invalid
combination. Its schema fixes allowed operations, field types, bounds, defaults
and extra-property treatment. Compatible profile evolution must not silently
reinterpret an existing value.

The configuration revision identifies immutable content. Whether it uses a
content address or a separately assigned identity plus digest is a bounded
contract decision; mutable names alone are insufficient. Where an owning domain
requires a particular identity scheme, its requirement governs. Do not mint a
new universal identifier convention merely to configure a service.

### Profile responsibilities

| Profile section         | Required typed content and checks                                                                                                   | Responsibility boundary                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Capability selection    | Identifiers from the pinned capability catalogue; enabled/dormant state; parameters generated from each selected contract           | Catalogue growth cannot enable a new capability silently. Required totality is checked at update time.                                   |
| Connections/composition | Declared input/output ports, contract revisions, named transformations, execution/effect class and resource bounds                  | OCE validates connectivity, meaning/authority compatibility and permitted execution; instance supplies no transformation implementation. |
| Authority/policy        | Approved policy identifiers, permitted parameter ranges, subject/resource scope and external authority references                   | Configuration requests powers. A separately verified delegation grants or refuses them. Policy cannot waive its own validation.          |
| Data/source             | Source/corpus snapshot or supported update channel, schema/projection identity, permitted source scopes and provenance requirements | Data access/transformation mechanisms stay OCE; the source owner defines authoritative semantics.                                        |
| Resource bindings       | Logical resource identity, isolation/sharing group, environment, provider binding and credential references                         | OCE derives or validates all physical names and acquires effects; instance does not embed provider-management scripts.                   |
| Experience              | Published components/layouts, theme tokens, content/resource references, locale and accessibility constraints                       | Reusable renderers and content-checking mechanisms remain published.                                                                     |
| Observability           | Approved sinks, event declarations, permitted fields, retention and sampling/budget settings                                        | Validation/redaction/minimisation are mandatory mechanisms, not configurable opt-outs.                                                   |
| Lifecycle               | Supported startup health, retry/backoff, cancellation, timeout, resource and transition policies                                    | OCE implements lifecycle and diagnostics; invalid or unsafe combinations fail validation.                                                |

A finite product-specific profile is preferable to a general composition language
when it covers the required scenarios. Where cross-capability composition is
needed, a composition references named operations with declared ports. The first
contract must decide permitted branching, cycles, state, concurrency and failure
propagation. No unbounded loop or opaque expression enters by default. A missing
composition contract blocks that composition; it does not establish a need to
freeze the entire programme.

## Validation is more than schema acceptance

A candidate passes these distinct checks before activation:

1. **Shape and identity.** Validate the selected format and concrete profile schema,
   required/unknown fields, literal formats and immutable reference integrity.
2. **Capability and dependency closure.** Every selected operation, asset, host,
   validator and runner resolves from a supported published consumed form. Validate
   peer/runtime requirements and the assessed package/profile combination.
3. **Connection meaning.** Inputs and outputs agree on schema and on the semantic
   obligations the consumer relies on: identity, units, ordering, omission rules,
   provenance, required freshness and failure semantics. Equal structural types
   alone do not prove substitutability.
4. **Authority and information.** Verify that the execution identity has the
   requested powers for the declared purpose and resource scope. Enforce
   non-overridable privacy, redaction and safety floors. Secret handles cannot be
   used as a route to arbitrary credentials or destinations.
5. **Operational coherence.** Check resource namespace collisions, deliberate
   sharing, region/provider compatibility, cost/rate limits, state-transition
   prerequisites and recovery support.
6. **Consumer outcomes.** Run the published profile's offline/fixture checks and
   its permitted integration checks against the candidate. A fixture success is
   labelled as such; it does not attest a live service or educational benefit.

The validator produces a machine-readable result and a useful human explanation:
the offending configuration path, refused value class, violated contract, safe
correction and relevant documentation. It never includes secret material or
unnecessary learner/content data. Diagnostics retain package, profile,
configuration and relevant data/model identities so a consumer can reproduce the
failure with the published diagnostic facility.

Validation does not grant rights, provide credentials, provision resources or
silently repair an invalid value. Any normalisation is explicit in the resolved
manifest, preserves meaning and is deterministic for the declared inputs.
Unsupported configuration fails closed before it reaches an effectful runner.
Admission of new evidence or source versions may require revalidation.

## Control plane, activation and execution

The control plane is a responsibility, not necessarily a continuously running
central service. A local published CLI, CI job or managed service may implement
it. An already activated instance need not contact an OCE checkout or a central
OCE service on every request.

OCE's published control-plane mechanism performs this lifecycle:

1. **Resolve candidate.** Pin the profile, packages, generated bindings and static
   assets; identify data/model/policy compatibility. Resolve logical bindings
   without embedding secrets. Produce an immutable resolved manifest.
2. **Validate and stage.** Apply the checks above; build the consumed artefact using
   the published build mechanism; prepare permitted resources using the published
   provider mechanism. Record partial preparation and cleanup ownership.
3. **Assess readiness.** Run the profile-specific software checks. Confirm the
   operator has the required delegation and that recovery/forward-only conditions
   are explicit for effects that cannot be reversed.
4. **Activate.** An authorised actor moves the instance's active reference from one
   assessed manifest to another using the provider's supported transition. A
   request/job binds to one coherent activation identity; it must not combine old
   policy with new schema/index state accidentally.
5. **Observe and recover.** Publish bounded health/contract diagnostics, retain the
   previous usable activation when permitted, and execute rollback or the declared
   forward-repair procedure. Retire obsolete artefacts/resources only after their
   consumers and retention obligations are accounted for.

This is **not** a claim of an atomic transaction across registries, providers,
databases and indexes. A transition contract names its consistency scope,
in-flight request/job policy, readiness checks, point of activation, failure
states and recovery. Blue/green execution or gradual traffic allocation can be
supported when each execution has one authority and the shared-state compatibility
contract permits coexistence. Pure clients may only need validation and artefact
selection; they need not acquire a deployment service.

The resolved manifest records the assessed relationship among:

- configuration identity and digest;
- package versions, integrity and build/distribution provenance;
- profile and policy revisions;
- source/corpus/schema/projection/model identities or explicitly supported update
  contracts;
- generated bindings and assets;
- logical instance/resource bindings, shared-resource choices and permitted
  credential purposes;
- validation/evaluation evidence, its scope, and activation/recovery conditions.

An evolving source cannot always be pinned forever. Its channel contract must
define which changes are compatible, when revalidation/rebuild is required,
how deletions/corrections propagate and how a previous activation remains usable.
See [integrity and Castr](oce-integrity-and-castr.md) for the distinct
source-to-consumer guarantees.

### Credentials are references, not configuration payloads

A credential reference names an approved binding and purpose. The effect boundary
authenticates the executing identity, checks delegation, resolves the handle and
provides the least required credential to the operation. No plaintext credential
enters the configuration repository, built public artefact, diagnostic payload or
resolved manifest.

Credential rotation may change secret material without changing the application's
behaviour configuration. Its binding contract defines permitted rotation, expiry,
revocation and revalidation, and records safe provider/version metadata where
available. A rotated secret cannot silently expand purpose or resource scope.
Binding selection, authority policy and secret value are separate concerns.

## Independently configured search instances

The inspected Search SDK already accepts an injected client and explicit
configuration, but its current `SearchSdkConfig` exposes only `primary` or
`sandbox` targets plus version and zero-hit options. Its internal resolver
hardcodes `oak_*` aliases, `oak_meta` and zero-hit storage. Those are concrete
gaps against this contract.

A search profile must describe the following without copied index-management,
ingestion or retrieval implementation:

| Concern                         | Configuration selects                                                                                    | Published mechanism enforces                                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Instance and resource namespace | Instance identity, provider/project binding, explicit resource-sharing choices                           | Collision-free naming/binding for aliases, physical indexes, metadata, synonym sets, inference resources, telemetry and checkpoints |
| Corpus and projection           | Corpus/source contract, snapshot/update channel, scopes and document projection profile                  | Authoritative mapping, source provenance, intended omission, source correction/deletion propagation and rebuild eligibility         |
| Embedding/index compatibility   | Approved inference/model contract, chunk/field profile and compatible mapping version                    | Model/dimension/analyser/field compatibility; incompatible changes require a rebuild/transition                                     |
| Retrieval                       | Published retrieval/fusion/reranking profile and supported weights, boosts, filters and cache parameters | Parameter bounds, domain constraints, typed results and preserved query/error semantics                                             |
| Update/operation                | Approved schedules, checkpoint/retry/resource limits and lifecycle policy                                | Durable work, idempotence/reconciliation, controlled promotion/rollback, recovery and diagnostic mechanisms                         |
| Evaluation                      | Versioned query set, expected relevance/evidence, evaluation profile and permitted thresholds            | Reproducible evaluation with corpus/model/config identity, regression comparison and explicit evidence limits                       |

A base name assembled from an instance ID is insufficient if another resource
still has a global name. Conversely, resources may be shared intentionally when
the authority, privacy, capacity and compatibility contracts permit it. Source
custody neither forces sharing nor forbids it.

A maths retrieval instance and an English retrieval instance should use the same
published mechanisms with different supported corpus scopes, retrieval profiles
and evaluation sets. No hardcoded instance-name union, bespoke ingest script or
copied reranker can be the means of separation. The downstream software
demonstration must exercise materially different configurations, including
diagnosis/recovery, rather than two renamed copies of one default.

Provisioning, full automated update/delete handling, operation and the live
two-instance demonstration remain the separately scoped search delivery work.
The architecture requires its interfaces; this document does not claim that work
is done or make all search operation a prerequisite for unrelated CF delivery.

## Desk scenarios and intended software acceptance

The current observations below come from Engraph
`efe69ff66182832dabe7f667ea0fa0ea021bc2ba`, inspected on 10 October 2026.
They are bounded static observations, not runtime tests, deployment observations
or measurements of people. “Target check” means a future technical acceptance
requirement. No percentage or team study is necessary to apply it.

| Scenario                                                                | Existing support and material gap                                                                                                                                                 | Configuration and target check                                                                                                                                                                            |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change the live/dormant MCP surface                                     | `apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts` has a total typed tool map, but selection data and reusable helper functions share the app module. | Instance supplies classifications over the pinned catalogue. Published validation/registration verifies totality and served behaviour; changing existing selections needs no OCE edit/release.            |
| Adopt a compatible catalogue update                                     | Generated tool identity already feeds the served-surface type; new tools intentionally require classification. External package/update workflow is not established.               | Update exact dependencies and classify added entries explicitly. Unknown or unclassified entries fail with actionable diagnostics; no automatic widening of exposed authority.                            |
| Compose an existing search capability with a supported MCP presentation | App composition, registration, transport and lifecycle are still executable app code.                                                                                             | Profile declares capabilities and compatible port bindings. Published executor runs the composition; no new app handler or callback. Unsupported connection fails before activation.                      |
| Change supported auth or telemetry policy                               | Validated env and typed config exist; secret stripping and adapter mechanisms exist, but host/auth wiring remains app implementation.                                             | Select an existing approved adapter/policy, purpose and secret handle. Denied delegation and excessive telemetry fail; no app scripts implement auth/redaction.                                           |
| Create two independently tuned search instances                         | Injected client exists; fixed target names and global resource constants prevent the full variation.                                                                              | Two valid instance/resource/tuning/evaluation configurations resolve disjoint resources unless sharing is explicit. Existing published packages suffice; each has independent activate/recover behaviour. |
| Change supported widget theme, layout or guidance                       | Widget rendering/build/embedding and asset paths live in app sources; design packages exist but public consumption is unproved.                                                   | Instance chooses supported component/layout/theme/content references. Published build/render/check facilities preserve widget transport, assets and accessibility without copied renderer code.           |
| Build, test and release an instance in isolation                        | Existing manifests use workspace dependencies; release has publication disabled; `env` reads a repository-relative package file.                                                  | Fresh external checkout consumes the complete published runtime/build/asset/validation closure. Standard declarations invoke published mechanisms; no hidden OCE checkout or bespoke script.              |
| Change a retry/resource/health policy                                   | MCP retrieval currently intentionally connects lazily; runtime lifecycle is app code.                                                                                             | Select a profile-supported bounded policy. Invalid combinations fail; failure injection demonstrates cancellation, retry exhaustion and useful diagnostics without changing OCE.                          |
| Roll back a bad instance configuration                                  | No complete independent activation contract is demonstrated.                                                                                                                      | Previous compatible resolved manifest can become active again, with one authority per execution. A state/schema incompatibility refuses unsafe rollback and names forward recovery.                       |
| Rotate a secret                                                         | Existing environment acquisition can supply new material; a full reference/delegation contract is not established.                                                                | Approved resolver rotates material under the same scoped binding; no committed secret, package release or app mechanism. Revocation/expired credentials fail safely.                                      |
| Diagnose a package/profile mismatch                                     | Typed Result errors and config diagnostics exist, but cross-package activation evidence is incomplete.                                                                            | Published diagnostic command identifies exact incompatible contracts and safe correction without requiring private source or leaking inputs.                                                              |
| Add a new upstream entity or genuinely new rendering/auth capability    | Existing OpenAPI/bulk generation and adapters are relevant but do not prove the new semantics or mechanism.                                                                       | This is OCE capability/contract work, with tests, provenance and publication. It is not disguised as app configuration and is not counted as a failure of ordinary variation.                             |

The last row is not a blanket exception. A scenario that only changes an already
supported provider, tool selection, ranking parameter, theme or resource binding
must not be relabelled “new capability” because the first contract omitted its
control. The design owner must show which new operation, semantic obligation or
effect genuinely requires new reusable implementation.

## Consumed forms, compatibility and maintenance

A handover closure includes runtime code **and** the mechanisms required to
build, validate, evaluate, release, diagnose and recover it. It includes generated
types/validators, declarations, assets, content/licence notices, provider bindings
and reusable CI/workflow artefacts where applicable. A public export map or
monorepo test pass does not prove those forms work after installation.

For each consumed form the contract owner records:

- immutable source and distribution identity; public supported entrypoints;
- required runtime/peer/tooling contracts and allowed version combinations;
- configuration schema/profile compatibility, defaults and migration behaviour;
- included data/content and redistribution conditions;
- software acceptance fixtures, effectful checks and honest assurance/CF status;
- deprecation/update/retirement and correction route.

Initially follow the retained one-repository-release-version policy. An instance
pins the assessed set; this does not imply every future package must have one
clock. Range resolution must not silently choose an unassessed combination.
Consumer update tooling may propose a new set, validate it and produce a new
resolved manifest; it does not silently deploy it without the instance's
delegated release authority.

Compatibility adapters remain OCE mechanisms. They translate a supported old
contract under explicit guarantees and retirement conditions; they do not let an
app keep an unmaintained fork. During transition, the programme tracks every
consumer and replaces the old export only after the replacement and its recovery
route work. Publication mistakes are corrected with new releases and consumer
updates, not an assumption that already consumed versions can be unpublished.

## Open decisions and their precise owners

These are technical design homes, not invitations to re-decide the retained-OCE
direction or to invent owner ratification.

| Decision                                   | Accountable design role                                             | Required decision/output                                                                                                                                                                                       | Dependent work                                                 |
| ------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| First profile and authoring representation | Configuration contract maintainer, with MCP consumer contract owner | Select concrete schema/data representation, editor support, default/unknown-field semantics and catalogue references using the scenarios above. Compare a product profile with a general composition language. | First profile implementation and its instance authoring tools  |
| Composition expressiveness                 | Service composition maintainer                                      | Define operation/port/effect contracts, allowed branching/cycles, bounds, state and failure propagation; provide positive and adverse examples.                                                                | Compositions exceeding the first fixed product profile         |
| Authority and secret bindings              | Security/authority contract owner with host adapter maintainer      | Define trustworthy delegation input, supported reference providers, secret lifetime/revocation and enforceable policy floors.                                                                                  | Privileged effects and credential-bearing activation           |
| Activation coherence                       | Host/lifecycle contract maintainer                                  | Define exact per-provider transition and execution consistency scope, evidence, partial-failure cleanup and recoverable/forward-only states.                                                                   | External deployment/operation handover                         |
| Search resource and profile isolation      | Search capability maintainer and service operator                   | Define full resource namespace/sharing contract, corpus/model compatibility and independently configurable evaluation/recovery interfaces.                                                                     | Independent search instances and separate operational delivery |
| Published consumed closure                 | Release maintainer with each capability owner                       | Name complete runtime/build/assets/check/release closure and its supported installed forms; resolve branch/namespace/publish authority explicitly.                                                             | First public publication and independent consumption           |
| Profile/version evolution                  | Contract and release maintainers                                    | Define assessed combinations, update tooling, deprecated values/defaults, migration and retirement conditions.                                                                                                 | Consumer upgrade and compatibility claims                      |

Responsibilities name accountable roles, not staffing promises. An unassigned
effectful operation must acquire its accountable operator before it starts.
Contract design can proceed at its own bounded scope without a fabricated date,
team measurement programme or claim that all future invariant discovery is closed.
