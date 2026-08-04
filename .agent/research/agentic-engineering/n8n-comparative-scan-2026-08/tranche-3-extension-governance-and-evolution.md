---
title: 'Tranche 3 — extension membranes, governance, observability, and evolution'
type: research
status: active
stage: 'Source-facing comparative analysis complete; independent Practice diagnosis follows'
date: 2026-08-04
audience: 'Practice maintainers and reviewers'
subject: 'How mature extensible systems govern entry, identity, trust, versioning, activation, observation, migration, compatibility, and retirement across several scales'
related:
  - README.md
  - method-and-source-boundary.md
  - tranche-1-structural-observations.md
  - tranche-2-lifecycles-and-coordination.md
---

# Tranche 3 — extension, governance, and evolution

> **Interpretation status:** this tranche completes the source-facing thematic scan. It records
> general arrangements and tensions, not reusable n8n implementation. The next stage assesses OCE
> independently and promotes only Practice-native findings into the main report.

## Executive synthesis

An extension point is not one interface. The source repeatedly treats extension as a **membrane**
with several independently governable stages:

1. discovery;
2. identity and provenance;
3. validation of declared shape;
4. trust or vetting status;
5. installation authority;
6. loading and activation;
7. capability publication;
8. runtime containment;
9. version selection;
10. compatibility detection;
11. observation and user communication;
12. update, withdrawal, and cleanup.

This membrane is asymmetric. Core code knows less about each extension than the extension knows about
the core contract, but the core retains authority over whether, where, and under what constraints the
extension may act.

The source also exposes several different evolutionary strategies:

- stable versioned public artefacts remain executable;
- upgrade risk is detected against actual user state;
- deprecation can precede removal;
- major-version work is isolated while ordinary work continues;
- feature flags permit trial and rollback;
- boundary baselines stop debt growing while a backlog is reduced;
- generated catalogues and checks attempt to keep several views aligned;
- old internal structures sometimes remain because public product obligations make immediate
  replacement too costly.

The Practice has radically different freedoms and obligations. It can often replace internal shapes
rather than preserve them. The value of the comparison is therefore partly negative: it makes the
cost of external compatibility visible and helps distinguish **stable contracts worth governing**
from **internal historical residue that should be removed**.

## 1. Extension is a lifecycle, not an install operation

### Observation

Community packages have separate responsibilities for:

- listing installed packages;
- determining available updates;
- detecting missing packages;
- parsing and validating package identity and version requests;
- checking whether a package is allowed;
- verifying approved package checksums where verification is requested;
- installing and loading;
- recording installed node types;
- notifying the live editor to add, remove, or reload capabilities;
- emitting success and failure events;
- updating or uninstalling;
- respecting a separate environment-managed authority mode.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.lifecycle.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.config.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/load-nodes-and-credentials.ts>

### Interpretation

The lifecycle has at least four different truths:

- the package exists in a registry;
- it is installed on disk;
- its capability definitions loaded successfully;
- it is currently published to users or other consumers.

One can be true while another is false. Missing, installed-but-unloaded, prohibited, outdated,
unverified, and active are distinct conditions.

### Practice questions

- Do skills, subagents, MCP tools, hooks, plugins, and external coordinators have similarly explicit
  lifecycles?
- Can an artefact be present but not active?
- Can a capability be active but unavailable in one harness?
- Is update/removal propagated to all projections?
- Does environment or organisation policy override conversational installation authority visibly?
- Can the Practice explain why a capability was loaded and from where?

### Candidate directions to test

- **introduce or strengthen** explicit capability lifecycle states;
- **connect** installation, activation, availability, and projection evidence;
- **stop** treating filesystem presence as capability readiness;
- **preserve** a policy authority above individual agent convenience.

## 2. Verification is one dimension of trust, not a synonym for safety

### Observation

Community extension configuration distinguishes verified and unverified packages, can disable
unverified installation, can prevent loading altogether, and can require a vetted checksum for a
requested install or update. A separate status check can ban a package. Registry location and
credentials are configurable independently.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.config.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.lifecycle.service.ts>

### Interpretation

Trust is multi-dimensional:

- known provenance;
- identity integrity;
- reviewed or vetted status;
- allowed-by-policy status;
- version integrity;
- runtime permissions;
- ongoing availability;
- observed behaviour.

A verified checksum proves identity of a reviewed artefact; it does not prove fitness for every
context or remove the need for containment and observation.

### Practice questions

- What does "trusted skill", "trusted agent", or "trusted MCP server" currently mean?
- Is provenance separate from permission?
- Can a known artefact be disallowed in one repository or role?
- Are capability grants version-specific?
- Does continued trust depend on observed behaviour and review?
- Can a capability be discovered but intentionally unavailable?

### Candidate directions to test

- **introduce** a multi-axis trust model for external and portable capabilities;
- **separate** provenance, integrity, review, permission, and runtime containment;
- **stop** using one trusted/untrusted boolean for heterogeneous risks;
- **preserve** explicit refusal where the necessary trust evidence is absent.

## 3. Extension authority can belong to a different scale than runtime use

### Observation

Community packages can be managed through instance environment configuration, in which case the API
refuses local modification. Module eligibility is governed by default, enabled, and disabled module
sets; a contradictory enable/disable declaration is rejected. Module initialisation also depends on
instance role and licence state.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.lifecycle.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/backend-common/src/modules/module-registry.ts>

### Interpretation

The actor who uses a capability need not own the decision to install or activate it. Authority may
sit at:

- organisation policy;
- repository policy;
- deployment configuration;
- runtime role;
- individual user or agent.

Contradictory authority declarations should fail explicitly rather than resolve by undocumented
precedence.

### Practice questions

- Which capability choices are Practice-wide, repository-owned, team-local, session-local, or owner
  decisions?
- Can an agent install a skill or plugin when repository policy says no?
- Are global disables and local enables resolved explicitly?
- Is there a machine-readable explanation for why one capability is inactive?
- Does runtime role constrain capability availability even when the artefact exists?

### Candidate directions to test

- **introduce or strengthen** capability authority by scale;
- **make contradictory policy fail visibly**;
- **reduce** conversational or harness-specific capability activation that bypasses repository
  intent;
- **preserve** local autonomy inside explicit authority boundaries.

## 4. Loading is a constrained interpretation step

### Observation

The node and credential loader discovers several source kinds, maintains known definitions separately
from loaded runtime objects, applies includes and exclusions, accepts custom directories and module
loaders, detects duplicate loader identity, records source paths, validates contained paths for
assets, and can release expensive type descriptions from memory while retaining the ability to
reconstruct a snapshot.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/load-nodes-and-credentials.ts>

### Interpretation

Loading translates an external declaration into runtime capability. That translation needs:

- source identity;
- one loader authority per namespace;
- inclusion/exclusion policy;
- path containment;
- separation of descriptive metadata from executable object;
- bounded resource use;
- post-processing and generated projections;
- explicit errors for unknown types.

The runtime does not merely execute whatever files happen to be present.

### Practice questions

- Are skill, hook, subagent, and tool discovery paths constrained and attributable?
- Can two sources claim the same capability name?
- Are metadata and executable authority separated?
- Can heavy descriptive context be loaded on demand rather than always retained?
- Do custom paths preserve machine-portable meaning and containment?
- Are unknown capability references failures or silently ignored?

### Candidate directions to test

- **strengthen** loader identity, collision detection, and source containment;
- **separate** capability metadata from activated implementation;
- **reduce** always-loaded descriptions through discoverable catalogues;
- **stop** implicit shadowing among canonical and host-local artefacts;
- **preserve** strict failure for unknown or ambiguous capability identity.

## 5. A module registry provides participation contracts, not unrestricted reach

### Observation

Modules contribute through a bounded lifecycle. Early loading can register data entities and node
loaders before the database is initialised. Later initialisation can register routes, timers,
settings, and context. Settings can be refreshed; modules can shut down; active state is queryable.
Eligibility, licence, and instance role gate participation.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/backend-common/src/modules/module-registry.ts>

### Interpretation

A module contract distinguishes phases because different contributions have different ordering and
side-effect requirements:

- describe persistence before storage starts;
- register executable capability before discovery completes;
- initialise runtime effects only on eligible actors;
- publish settings after initialisation;
- release effects on shutdown.

The registry is a boundary object: it lets modules participate without every consumer knowing module
internals.

### Practice questions

- Do Practice capabilities declare which lifecycle phases they participate in?
- Can a skill contribute vocabulary, checks, hooks, telemetry, and external projections without one
  unbounded installation script?
- Are activation and shutdown semantics explicit for long-lived agents or coordinators?
- Can external surfaces query active capability state?
- Does every extension receive more authority than it needs because no narrower participation
  contract exists?

### Candidate directions to test

- **introduce** capability contribution contracts by lifecycle and authority;
- **constrain** extension side effects to declared phases;
- **connect** capability activity to discovery and observability;
- **refuse** a universal plugin mechanism that collapses distinct contribution types.

## 6. Stable semantic identity coexists with version-specific behaviour

### Observation

Node types can expose several versions under one stable type identity. A current or default version
is selected explicitly, while saved workflows can request an older version. Unknown versions fail
with available-version context. Output schema lookup follows version and operation context and may
apply a defined fallback order. Working workflows also retain active version and execution snapshot
identity.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/workflow/src/versioned-node-type.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/load-nodes-and-credentials.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/AGENTS.md#versioning>

### Interpretation

Versioning protects long-lived user artefacts by separating:

- the concept identity;
- the preferred behaviour for new use;
- the behaviour required to interpret an existing artefact;
- the descriptive schema for that behaviour.

This is a heavy obligation. Every retained version expands testing, security, maintenance, and
reasoning cost.

### Practice questions

- Which Practice artefacts are true public contracts that require versioned interpretation?
- Which are internal and should be migrated or replaced instead?
- Can a plan, skill, rule, event, or external projection identify the semantic version it assumes?
- Are obsolete versions retained because of a real consumer or because removal is uncomfortable?
- When an old artefact is encountered, should the Practice execute it, migrate it, or reject it?

### Candidate directions to test

- **introduce** versioned interpretation only at warranted external or durable seams;
- **preserve** stable semantic identity where consumers genuinely persist artefacts;
- **stop** retaining internal versions without an active contract;
- **refuse** general backwards compatibility as a Practice-wide virtue;
- **strengthen** migration and explicit rejection where compatibility is unwarranted.

## 7. An extension membrane needs current-state publication

### Observation

Installing, updating, and uninstalling community capability causes live consumers to receive add,
reload, or remove notifications. Success and failure are emitted as domain events with package,
version, author, node, and failure context. The installed-package database and live loaded registry
remain distinct.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.lifecycle.service.ts>

### Interpretation

Changing capability truth is incomplete until its projections converge:

- persistent registry;
- runtime loader;
- interactive UI;
- event evidence;
- update inventory;
- agent or user discovery.

A capability can otherwise remain visible after removal or invisible after successful activation.

### Practice questions

- When a canonical skill changes, which harness catalogues, links, indexes, or active sessions become
  stale?
- When a subagent or MCP tool is removed, can discovery surfaces still advertise it?
- Is projection delivery acknowledged and checked?
- Can consumers distinguish a capability update from temporary unavailability?

### Candidate directions to test

- **strengthen** projection convergence after capability lifecycle changes;
- **introduce** explicit add/update/remove capability events;
- **reduce** periodic rediscovery used to compensate for missing change publication;
- **connect** projection drift to integrity checks.

## 8. Developer guidance encodes the extension contract at the point of work

### Observation

Node-specific agent guidance describes supported extension shapes, versioning options, credential
contracts, testing layers, security concerns, and organisation conventions. It sits below the root
repository guidance and uses domain examples to make the contract operational where contributors
work.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/AGENTS.md>
- <https://github.com/n8n-io/n8n/blob/master/AGENTS.md>

### Interpretation

The same extension contract is expressed at multiple levels of specificity:

- repository-wide architectural boundaries;
- extension-family vocabulary and expectations;
- local examples and tests;
- runtime validation.

This is progressive disclosure, but it also risks drift if the layers are independently authored.

### Practice questions

- Are portable Practice concepts translated into precise local instructions at the relevant work
  boundary?
- Can local guidance be generated or checked against canonical doctrine?
- Do examples teach current preferred structures or fossilise older ones?
- Is an agent able to discover the narrowest relevant instruction without loading the whole estate?

### Candidate directions to test

- **strengthen** generated or checked local teaching projections;
- **reduce** always-on root instructions that belong to one capability family;
- **preserve** domain-specific examples near work;
- **stop** duplicating normative rules without a drift-detection relationship.

## 9. Breaking-change prose becomes executable estate diagnosis

### Observation

The source maintains a human breaking-change history, but also includes a rule-based detection module
that scans actual workflows, instance configuration, and correlated multi-workflow state for risks
associated with a target version. Rules carry identity, version, category, severity, documentation,
issues, and recommendations. The output differentiates instance-wide and workflow-specific impact.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/BREAKING-CHANGES.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/breaking-changes/README.md>

### Interpretation

A change notice says:

> This class of behaviour changed.

An estate detector says:

> These concrete living artefacts appear to depend on the old behaviour, with this severity and
> evidence.

The latter turns compatibility from generic caution into bounded, inspectable migration work.

### Practice questions

- When doctrine, state shape, skill contract, or external-surface semantics change, can OCE identify
  every affected artefact?
- Are migrations planned from actual dependency evidence or from search and intuition?
- Can a PDR or ADR declare machine-detectable impact rules?
- Can the Practice distinguish one repo-wide issue from many occurrence-specific issues?
- Do recommendations link back to the governing conceptual change?

### Candidate directions to test

- **introduce** change-impact detectors for major Practice contract changes;
- **connect** decision records to executable estate diagnosis;
- **reduce** broad compatibility layers by identifying and repairing concrete consumers;
- **stop** assuming prose migration guidance proves the estate is ready;
- **preserve** a human explanation alongside machine detection.

## 10. Compatibility pressure is measurable and therefore governable

### Observation

The breaking-change history identifies affected conditions and required action. Node versions keep
persisted workflows executable. Queue messages retain more than one result shape. Major-version
development isolates breaking changes from the current release line. Deprecations can land before
removal. Trial builds and feature flags expose future behaviour before general activation.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/BREAKING-CHANGES.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/workflow/src/versioned-node-type.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.types.ts>
- <https://github.com/n8n-io/n8n/blob/master/.github/DEVELOPING_V3.md>

### Interpretation

Compatibility is not one yes/no property. It can apply to:

- persisted user definitions;
- network messages during mixed-version deployment;
- environment configuration;
- public extension contracts;
- data schema;
- human operational procedure;
- internal source API.

Each surface can have a different transition strategy and expiry condition. The cost becomes
unbounded when "backwards compatibility" is asserted without naming the consumer and seam.

### Practice questions

- Which OCE seams have consumers outside the current repository and release?
- Which compatibility promises are explicit and tested?
- Which old paths are retained without a named consumer?
- Can the Practice migrate the whole estate atomically where n8n cannot?
- Do external stable contracts deserve a transition even when internal architecture is replaced?

### Candidate directions to test

- **introduce** a compatibility-obligation register by seam and consumer;
- **preserve** only warranted external stability;
- **stop** unnamed internal compatibility;
- **strengthen** whole-estate migration and detector-backed removal;
- **refuse** treating public-product constraints as a default model for the Practice.

## 11. Major change can be separated by semantic kind

### Observation

The forthcoming major-version process separates ordinary feature work, deprecation notices,
non-destructive migrations, and breaking changes. A long-lived future branch is mechanically kept as
current work plus an explicit queue of breaking commits. Conflict handling produces a visible draft
PR and pauses synchronisation. The resulting tree is checked against the expected merge meaning.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/.github/DEVELOPING_V3.md>

### Interpretation

The valuable concept is not the branch strategy. It is semantic separation of change kinds:

- capability addition;
- behavioural trial;
- warning and preparation;
- additive migration;
- destructive removal;
- conflict resolution;
- release activation.

The process preserves the identity of breaking changes and proves that the future line means
"current system plus this explicit change set" rather than allowing an opaque divergent fork.

### Practice questions

- Does OCE distinguish adding a new Practice capability from changing a settled invariant?
- Can destructive changes be queued and reviewed as a coherent conceptual set?
- Are conflict and synchronisation failures visible rather than silently accumulated?
- Is a future Practice version an explicit transformation over the current memotype?
- Can a change be trialled without keeping both designs as permanent runtime options?

### Candidate directions to test

- **introduce** semantic change classes and transformation sets;
- **strengthen** visible conflict handling in propagation;
- **preserve** atomic replacement as the end state;
- **refuse** long-lived dual execution paths where the Practice controls the whole estate;
- **investigate** preview phenotypes or generated dry runs instead of compatibility flags.

## 12. Feature flags answer rollout uncertainty but create a second architecture

### Observation

New future-version behaviour can land disabled behind centrally registered flags. Backend and
frontend share flag identity, environment configuration can force-enable a flag, tests can override
it, and exposure can be observed. The old and new behaviours coexist until release or removal.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/.github/DEVELOPING_V3.md>

### Interpretation

Flags are useful when the unresolved question is operational rollout, exposure, or compatibility.
They are costly when the unresolved question is architectural truth. Every flag introduces:

- two reachable behaviours;
- interaction combinations;
- removal obligations;
- possible drift in tests and telemetry;
- ambiguity about the canonical design.

### Practice questions

- Does the Practice need exposure control, or can it update the controlled estate atomically?
- Could a preview, simulation, or generated report answer the question without dual runtime paths?
- If a temporary flag exists, what evidence and date remove it?
- Does experimentation concern user outcomes or architectural indecision?

### Candidate directions to test

- **refuse** flags as escape hatches or permanent internal alternatives;
- **allow only where** the uncertainty is genuinely rollout- or outcome-based and the transition is
  explicit;
- **introduce** expiry and removal invariants for any temporary dual path;
- **prefer** dry-run analysis, isolated experiments, or phenotype previews for controlled Practice
  changes.

## 13. Ratchets contain historical debt without declaring it acceptable

### Observation

The boundary check acknowledges a non-zero backlog but fails when the measured total grows. Manual
baseline updates lock in reductions. The source comments explicitly identify a weakness: a single
count cannot distinguish one fixed issue replaced by one new issue. A named sanctioned exception is
removed from the count because the generic boundary checker cannot yet model it.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/scripts/check-boundaries.mjs>
- <https://github.com/n8n-io/n8n/blob/master/turbo.json>

### Interpretation

A ratchet is a transitional governance instrument:

- it prevents deterioration;
- makes improvement monotonic;
- permits work before all historical debt is cleared;
- risks granting fungible amnesty if it measures only totals;
- requires explicit sanctioned exceptions;
- must not become the permanent definition of correctness.

### Practice questions

The Practice states strict, complete, everywhere. That may justify refusing debt baselines in new
Practice-owned systems. But comparative scans of inherited estates may still need transitional
ratchets.

- Are any current baselines quietly permanent?
- Do exceptions have semantic identity or merely subtract from totals?
- Can a fixed violation be exchanged for a new one without detection?
- Is the correct response full repair, a fingerprinted transitional ratchet, or a redesigned
  checker?

### Candidate directions to test

- **preserve** zero-tolerance for new Practice architecture;
- **allow** fingerprinted transitional ratchets only for inherited, bounded debt with a removal
  trajectory;
- **refuse** count-only baselines as proof of no regression;
- **stop** unnamed exemptions;
- **connect** ratchet reductions to consolidation so the baseline cannot outlive the debt.

## 14. Architectural checks are one species in a validation ecology

### Observation

The repository combines dependency-boundary checks, workspace dependency checks, schema generation
and drift checks, lint rules, tests at several scales, mutation testing, affected-test selection,
container topology tests, and manual architectural guidance. Some checks validate static shape;
others validate runtime topology, user behaviour, migration impact, or test quality.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/package.json>
- <https://github.com/n8n-io/n8n/blob/master/turbo.json>
- <https://github.com/n8n-io/n8n/blob/master/scripts/check-boundaries.mjs>
- <https://github.com/n8n-io/n8n/blob/master/packages/testing/containers/README.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/testing/playwright/docs/ORCHESTRATION.md>

### Interpretation

No one validator sees the whole system. Reliability comes from partially independent detectors with
different failure modes:

- type and schema checks;
- dependency topology;
- example-based behaviour;
- adversarial mutation;
- integrated environment behaviour;
- historical migration detection;
- live operational evidence.

The ecology is healthy only if overlaps are understood and gaps remain visible. Accumulating checks
without a model creates ceremony rather than resilience.

### Practice questions

- Which Practice risks are covered by several independent detectors?
- Which are assumed covered because many gates exist, although all depend on the same representation?
- Which checks teach, prevent, observe, or learn?
- Can the Practice show the gap that each new gate closes?
- Which checks should disappear after a lower-level invariant makes the failure impossible?

### Candidate directions to test

- **map** Practice checks by risk, scale, evidence source, and independence;
- **reduce** redundant fences around one symptom;
- **introduce** missing simulation, mutation, or operational detectors;
- **connect** observed effectiveness to gate evolution;
- **stop** counting gate quantity as assurance.

## 15. Observability vocabulary is part of the domain model

### Observation

The scheduler centralises stable trace attribute names and outcome values for rule changes,
occurrence claims, retries, dead letters, skips, recovery, retention, and provisioning. Queue metrics
subscribe to domain events and expose a smaller operational projection. Product telemetry consumes
typed internal events and maps them to user/product analytics. The event log supports delivery and
recovery rather than product insight.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/src/observability/attributes.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/metrics/prometheus/queue-metrics.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/events/event.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/events/relays/telemetry.event-relay.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/eventbus/message-event-bus/message-event-bus.ts>

### Interpretation

The same underlying activity supports several evidence products:

- trace: causal path of one operation;
- metric: aggregated operational condition;
- event log: durable fact and delivery/recovery substrate;
- audit: attributable consequential action;
- product telemetry: behavioural or outcome learning;
- user notification: actionable current information.

They should share semantic identity without sharing every field or retention policy.

### Practice questions

- Does TAU begin with domain facts or with PostHog/Sentry/OTel field choices?
- Are coordination, execution, learning, and audit vocabularies aligned?
- Can one occurrence be followed across logs, traces, GitHub, Linear, and memory?
- Are metrics interpreted through the same causal state model as operational decisions?
- Is high-cardinality identity present where diagnosis needs it but excluded from aggregate metrics?

### Candidate directions to test

- **introduce or strengthen** one Practice-owned semantic evidence vocabulary;
- **derive** sink-specific projections for traces, metrics, audit, product learning, and notifications;
- **connect** evidence identity across surfaces;
- **stop** allowing a sink to define the ontology;
- **preserve** different retention and cardinality rules for different evidence products.

## 16. Observability must include control actions and absence states

### Observation

Scheduler observability covers not only successful execution but redefinition, removal, skipped
occurrences, no-handler conditions, stale ownership, retries, dead letters, recovery, and retention.
Queue metrics include waiting and active state, not just completion and failure. Community package
telemetry records failed installation as well as success.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/src/observability/attributes.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/metrics/prometheus/queue-metrics.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.lifecycle.service.ts>

### Interpretation

A system is not understandable if it records only work that completed. Important signals include:

- work never started;
- work skipped because no capability existed;
- work withdrawn after intent changed;
- work waiting for capacity;
- work reclaimed from a stale actor;
- definitions changed but produced no occurrence;
- evidence deleted by retention.

Absence can be causal and must be represented deliberately.

### Practice questions

- Can OCE observe unclaimed work, unavailable capabilities, abandoned sessions, skipped reviews,
  undelivered projections, and consolidated-away state?
- Does TAU measure only agent actions and PR outcomes?
- Can the Practice distinguish no demand from failed routing or missing capability?
- Are removals and forgetting observable enough to evaluate their value?

### Candidate directions to test

- **expand** evidence to control and absence states;
- **connect** unavailable/skipped work to capability planning;
- **stop** treating absence of events as evidence that nothing was wrong;
- **preserve** deletion and forgetting as observable system behaviours.

## 17. Security pressure travels through extension, compatibility, and experience

### Observation

Community packages can be prohibited or restricted to verified variants. Extension asset loading
checks path containment. Node guidance treats user-controlled values as untrusted. Task runners have
security controls and an explicitly discouraged compatibility mode that disables them. Breaking
change history records security-driven behaviour changes and user migration impact. Repository
security guidance also constrains public artefact language during embargoed fixes.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.lifecycle.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/load-nodes-and-credentials.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/AGENTS.md#security>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/config/src/configs/runners.config.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/BREAKING-CHANGES.md>
- <https://github.com/n8n-io/n8n/blob/master/AGENTS.md#security-fix-hygiene>

### Interpretation

Extension security is not one sandbox. It includes:

- supply-chain admission;
- identity integrity;
- file and path containment;
- untrusted data handling;
- runtime process isolation;
- permission boundaries;
- migration of unsafe historical behaviour;
- disclosure policy;
- user-facing experience.

Compatibility can directly oppose security. When it does, the trade-off must be explicit and
bounded rather than hidden in a fallback.

### Practice questions

- Which Practice artefacts can execute code, call external tools, mutate repositories, or access
  secrets?
- Are their admission and runtime permissions independently governed?
- Can an old skill or adapter keep an unsafe behaviour alive?
- Do public memory and PR surfaces risk disclosing sensitive operational details?
- Does graceful degradation preserve security and quality, or relax them silently?

### Candidate directions to test

- **introduce** an extension threat model across admission, activation, execution, and evidence;
- **strengthen** least authority by capability and role;
- **stop** compatibility fallbacks that disable security or correctness;
- **preserve** normal agent/developer experience by moving safety into structural substrates;
- **make deliberate cognitive gates visible** where risk cannot be removed invisibly.

## 18. Generated projections reduce drift but do not remove interpretive work

### Observation

Telemetry definitions can produce human and structured catalogues. Workspace configuration
centralises dependency versions. Database schema documentation has generation/check commands.
Agent-skill links have sync and integrity checks. Shared API types mediate frontend/backend
contracts. Test service registries derive helper types.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/telemetry/README.md>
- <https://github.com/n8n-io/n8n/blob/master/pnpm-workspace.yaml>
- <https://github.com/n8n-io/n8n/blob/master/package.json>
- <https://github.com/n8n-io/n8n/blob/master/.agents/skills/AGENTS.md>
- <https://github.com/n8n-io/n8n/blob/master/AGENTS.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/testing/containers/README.md>

### Interpretation

Generation is valuable when one semantic fact has several mechanical
representations. It is less suitable when the projection requires judgement, explanation, or a
purpose-specific selection of meaning.

A generated catalogue can answer "what is declared". It cannot by itself answer:

- why the concept exists;
- whether it remains useful;
- what interactions matter;
- whether the generating ontology is correct;
- how the Practice should change.

### Practice questions

- Which OCE indexes and matrices are mechanical projections?
- Which are genuine research or governance arguments and should remain authored?
- Can generated views link back to human explanation?
- Do generated surfaces become large context burdens because they are treated as doctrine?

### Candidate directions to test

- **generate** inventories, relationship graphs, schemas, adapter projections, and integrity reports;
- **preserve authored synthesis** for purpose, interpretation, and judgement;
- **stop** manually maintaining machine-derivable concordances;
- **stop** presenting generated completeness as conceptual adequacy.

## 19. Change history is evidence of pressure, not proof of current intent

### Observation

The repository contains deprecated packages, old message versions, compatibility fields, migration
notes, transitional feature flags, TODOs, and current architectural guidance. Some structures remain
because persisted workflows and public deployments require them; others are explicitly marked for
removal or replacement.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/node-dev/README.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.types.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/BREAKING-CHANGES.md>
- <https://github.com/n8n-io/n8n/blob/master/.github/DEVELOPING_V3.md>

### Interpretation

A mature repository is a fossil record. Presence can mean:

- current preferred design;
- externally required compatibility;
- incomplete migration;
- deliberate transitional bridge;
- abandoned but not removed surface;
- historical documentation.

Comparative research must triangulate current instructions, active usage, checks, migration plans,
and history before calling a structure a pattern worth learning from.

### Practice questions

- Does OCE mistake retained artefacts for current doctrine?
- Do plans or archived memory remain discoverable without clear historical status?
- Can agents distinguish canonical, transitional, deprecated, and evidential surfaces?
- Are removal conditions recorded where a bridge is genuinely unavoidable?

### Candidate directions to test

- **strengthen** lifecycle status and removal conditions for non-canonical artefacts;
- **reduce** search ambiguity between current and historical material;
- **preserve** history as evidence without allowing it to govern current action;
- **stop** inferring endorsement from source presence.

## 20. Different forms of forgetting serve different purposes

### Observation

The source prunes terminal task occurrences, soft-deletes and later hard-deletes execution evidence,
can prune workflow version references while keeping publication events, releases old in-memory type
metadata, removes obsolete queued occurrences when a rule changes, deprecates packages, and plans
major-release removals. At the same time, public compatibility obligations preserve some historical
behaviour for long periods.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/config/src/configs/executions.config.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/db/src/entities/workflow-publish-history.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/load-nodes-and-credentials.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/node-dev/README.md>
- <https://github.com/n8n-io/n8n/blob/master/.github/DEVELOPING_V3.md>

### Interpretation

Forgetting can remove:

- operational occurrences after their value expires;
- bulky detail while retaining event identity;
- invalid future work after the governing rule changes;
- memory-resident projections that can be regenerated;
- deprecated developer surfaces;
- old executable behaviour after consumers migrate.

The correct retention unit is not always the whole artefact. An event may outlive the detailed
version it referenced; a compact fact may outlive the stream that produced it.

### Practice questions

- Can the Practice retain that something was activated without keeping every detailed intermediate
  representation forever?
- Are derived projections regenerated rather than preserved as history?
- Does changed intent withdraw future occurrences automatically?
- Are deprecated skills and adapters removed after consumer migration?
- Which external contracts genuinely prevent forgetting?

### Candidate directions to test

- **connect** forgetting to semantic identity and future value;
- **introduce** selective compaction rather than whole-artefact keep/delete choices;
- **stop** retaining derived projections as durable truth;
- **preserve** event and decision evidence after operational detail expires;
- **strengthen** consumer migration so old executable shapes can be removed.

## 21. Candidate Practice-native extension membrane

The following abstraction is original to this comparative analysis. It is a diagnostic lens, not a
proposal to reproduce source architecture.

```text
Source and provenance
    → declaration and identity
    → validation and trust assessment
    → policy admission
    → activation for a role/context
    → bounded capability publication
    → runtime execution under explicit authority
    → evidence and behaviour observation
    → update / suspension / withdrawal
    → consumer migration
    → retirement and forgetting
```

### Membrane invariants to test

- one stable capability identity, with explicit source and version;
- no activation from presence alone;
- trust evidence separate from permission;
- authority attached to scale and role;
- runtime permissions narrower than installation authority;
- all projections able to converge after change;
- compatibility obligation names its consumer and expiry condition;
- observation includes absence, refusal, and removal;
- withdrawal prevents new use while preserving warranted evidence;
- retirement removes executable old shapes after consumer migration.

## 22. Candidate improvements, reductions, preservations, and refusals

### Potential additions or strengthenings

1. A common lifecycle for skills, subagents, MCP tools, hooks, plugins, and external coordinators.
2. A multi-axis trust and permission model.
3. Capability authority by Practice, repository, team, role, and session scale.
4. Loader collision, provenance, and projection-integrity checks.
5. Change-impact detectors attached to major Practice contract changes.
6. A compatibility-obligation register naming consumers and removal conditions.
7. A Practice-owned semantic evidence vocabulary projected to TAU sinks.
8. Extension threat modelling across admission, runtime, and evidence.
9. Selective compaction and retirement of obsolete capability versions.
10. An explicit map of validation ecology coverage and independence.

### Potential reductions or stops

1. Stop treating all external capability surfaces as equivalent integrations.
2. Stop interpreting presence as activation, verification as permission, or permission as safety.
3. Stop allowing host-local overrides to shadow canonical capability silently.
4. Stop manually maintaining machine-derivable inventories and adapter copies.
5. Stop using migration prose without estate detection.
6. Stop preserving old internal shapes without a named external consumer.
7. Stop adding feature flags for architectural indecision.
8. Stop count-only debt baselines from granting fungible amnesty.
9. Stop making telemetry vendors the source of event meaning.
10. Stop retaining derived projections and full streams after their future value expires.

### Preserve

- the Practice Core/local phenotype boundary;
- repository authority over local capability activation;
- strong internal replacement doctrine;
- explicit provenance and attribution;
- human-authored interpretation and reasoning;
- graceful capability routing only where quality and invariants remain intact;
- decentralised collaboration not dependent on one extension host.

### Refuse

- n8n package or module topology as a Practice template;
- public-product compatibility burden without equivalent consumers;
- insecure compatibility modes;
- permanent dual paths under rollout flags;
- a universal plugin mechanism with unrestricted authority;
- generated catalogues as substitutes for conceptual governance;
- a central n8n instance as owner of Practice truth.

## 23. Synthesis across all three tranches

The comparative source scan now suggests five interlocking Practice lenses:

### 1. Semantic core

What concepts, identities, contracts, and causal meanings are authoritative?

### 2. Projection membrane

How are those semantics translated for humans, agents, runtimes, hosts, and external surfaces without
creating rival truth?

### 3. Operational ecology

How are obligations executed, scheduled, tested, observed, recovered, and damped by several
partially independent mechanisms?

### 4. Extension membrane

How do new capabilities enter, gain authority, act, evolve, and leave under asymmetric trust?

### 5. Evolutionary metabolism

How does the system turn evidence into change, migrate consumers, remove obsolete structures,
compact memory, and preserve only what remains valuable?

These lenses will organise the independent OCE diagnosis. They are not claims that the Practice lacks
five new components. The diagnosis may show that each is already present in fragments and that the
primary opportunity is to connect, simplify, or stop rather than add.

## 24. Questions for independent Practice diagnosis

1. Where are semantic concepts already canonical, and where are they fragmented across prose and
   tools?
2. Which projections are generated, checked, or silently divergent?
3. Which operational obligations lack occurrence, attempt, lease, waiting, cancellation, recovery,
   or retention semantics?
4. Which capability families lack a complete extension membrane?
5. Which gates compensate for absent substrates?
6. Which external surfaces own vocabulary or state that should belong to the Practice?
7. Which old structures have named consumers, and which survive only through inertia?
8. Which evidence reaches consolidation and strategic learning, rather than ending in a sink?
9. Which additions would make current documents, gates, or procedures unnecessary?
10. Which distinctive Practice strengths should be reinforced precisely because n8n cannot exercise
    the same freedom?
