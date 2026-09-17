# Core records and interfaces

- **Status:** proposed conceptual interface; no storage format or schema selected
- **Owns:** the minimum stable records through which the definition's concerns refer to one
  another
- **Does not own:** product data models, provider APIs, workflow orchestration or current record
  instances

## Why records matter

The Kit needs shared identities and hand-off contracts without turning one document, manifest or
database into a universal source of truth. These records let each authority state its own facts and
let other parts link to them rather than restate them.

A record may eventually be represented as Markdown, structured data, generated artifacts or a
service object. This definition selects no format. The required property is semantic: exact
identity, authority, version, status, evidence and relationships remain inspectable.

Every record should state:

- stable identity and record type;
- lifecycle status and effective interval where applicable;
- authoring or decision authority;
- source and revision dependencies;
- links to related records rather than copied summaries;
- uncertainty, exclusions and unresolved conflicts;
- supersession, correction and retirement relationship; and
- whether the record is authoritative, derived, evidential or illustrative.

## 1. Proposition record

**Purpose:** define the real question or possibility before a mechanism is selected.

Minimum content:

- situated problem, intended audience/beneficiary and affected or excluded people;
- intended human, educational, product or public outcome;
- real Oak/public capability being made tangible;
- proposition owner and competent semantic, professional, rights and decision authorities;
- claim class and explicit claim boundary;
- difficult, denied, degraded and terminal states worth preserving;
- causal premise and no-build, service/policy/content and system-change alternatives;
- comparator, falsifier, losing condition and unresolved assumptions;
- requested disposition and legitimate disposition owner; and
- links to source evidence and later profiles, scenarios and evidence records.

A proposition that says only “build a graph demo” or “add Neon” is mechanism-shaped and
incomplete.

## 2. Capability contract

**Purpose:** state a stable product promise independently of one adapter or provider.

Minimum content:

- capability identity, intended outcomes and consumers;
- semantic authority, referents, operations and invariants;
- identity, state, time, success, absence and failure semantics;
- projection, provenance, completeness, freshness and accepted-loss rules where applicable;
- rights, policy, experience and accessibility obligations;
- configuration boundary and supported reduced/degraded modes;
- recovery, correction, reconciliation and remedy;
- assurance and conformance evidence;
- compatibility, migration, portability and provider-exit semantics;
- steward, support, deprecation, preservation and retirement duties; and
- explicit exclusions and reopening conditions.

The [capability model](capability-and-contract-model.md) owns the full contract envelope. An
individual contract instantiates it without copying unrelated fields.

## 3. Composition profile

**Purpose:** bind one proposition and real context to an honest obligation set and executable
composition.

Minimum content:

- proposition, audience, claim, exposure and control-boundary references;
- activation facts, each with its binding time and change authority, and the derived applicable
  obligations;
- the creator's authored decisions, classified proposition-shaped or machinery-shaped;
- capability contract versions and state: activated, reduced, omitted, unavailable or unknown;
- supported runtime degradation policies and terminal semantics;
- competent reason and authority for each material omission or transformation;
- adapter, binding, host and product-local mechanism references;
- source releases, configuration, environment, secrets and resource budgets;
- scenario and assurance obligations;
- operational, support, correction, migration, exit and retirement ownership; and
- unresolved incompatibilities or conditions that block the claim.

Profiles reference capability contracts; they do not restate capability meaning.

## 4. Scenario record

**Purpose:** preserve a situated normal or adverse path that can exercise several contracts
together.

Minimum content:

- proposition and profile references;
- actors, authority and preconditions;
- source/release and initial state;
- operations, state transitions, projections and visible acknowledgements;
- intended human outcome and last truthfully asserted success stage;
- relevant difficult state, failure, degradation or challenge;
- equivalent accessible route and affected non-user considerations;
- support, correction, recovery, remedy and terminal outcome;
- observations that establish the result; and
- contracts exercised, distinctions protected and evidence still unknown.

Scenarios are illustrative and test coverage. They cannot introduce a new rule that has no
contract home.

## 5. Release and projection record

**Purpose:** make an activated product or derived representation identifiable and correctable.

Minimum content:

- authoritative source identities and revisions;
- contract, schema, transformation, adapter, binding and host versions;
- build/generation identity, inputs, configuration and environment class;
- output identity, completeness, accepted loss, counts/digests and freshness;
- compatibility window, migration/coexistence state and activation time;
- observability/release correlation and consumer-visible epoch;
- last-good, rollback limit, rebuild/forward-repair and restore evidence;
- correction, withdrawal, deletion and non-resurrection status; and
- retirement and preservation state.

A timestamp alone is not freshness; a deploy identifier alone is not a semantic release.

## 6. Operation, outcome and repair record

**Purpose:** record one consequential runtime occurrence without confusing the static profile with
temporary operating state.

Minimum content:

- proposition, profile, capability, release and scenario references;
- principal intent, request/command, attempt and execution identities;
- authority, preconditions, expected version/state and idempotency scope;
- current stage: received, accepted, committed, reconciled, delivered, intelligible, realised
  outcome or explicit terminal failure;
- authoritative state/effects, derived projections and human-visible acknowledgement;
- operating condition such as nominal, degraded, recovering, unavailable or terminal;
- last truthful state, failure type, affected people and user/service consequence;
- safe retry, cancel, resume, reconcile, compensate, repair, escalate or remedy options;
- correlation, observations, response authority and next owed action; and
- re-observation, final outcome, correction and retained learning.

The record does not need to be one stored object. The requirement is an inspectable identity and
trace across the relevant systems and human hand-offs.

## 7. Evidence record

**Purpose:** connect observations to one bounded claim and later decision.

Minimum content:

- proposition, profile, scenario, release and exact run identities;
- claim class, wording, scope and denominator/population;
- comparator, method, configuration, threshold and falsifier;
- primary sources and collection limits;
- positive, negative and ambiguous observations;
- exclusions, failed observation, unknowns and information loss;
- analysis, rival explanations and competent interpretation;
- what the evidence can and cannot establish;
- decision relevance, disposition owner and return target; and
- revalidation, expiry or reopening trigger.

Multiple outputs sharing a source, model, prompt, session ancestry or derived projection must not
be counted as independent corroboration without justification.

## 8. Disposition record

**Purpose:** make evidence consequential without allowing it to authorise itself.

Minimum content:

- proposition and evidence references;
- legitimate decision owner and decision date/context;
- disposition: advance, confirm, narrow, reshape, stop, retire, defer or unresolved;
- rationale, dissent and authority boundary;
- claims accepted, rejected, narrowed or still open;
- return routes to proposition, domain, product, Kit, Practice, provider or operations;
- authorised next commitment, if any; and
- review, expiry, correction or supersession conditions.

“Shipped,” “used,” “popular” and “passed gates” are observations, not dispositions.

## 9. Elevation comparison

**Purpose:** test the claim that an experience can activate new obligations cheaply while
preserving its semantic core.

Minimum content:

- before/after proposition and profile references;
- exact asserted semantic core and authority identities;
- changed activation facts and obligation delta;
- newly activated/reduced/removed capabilities;
- adapter, binding, topology, budget and operational changes;
- semantic, interaction, data and migration compatibility evidence;
- concept-specific versus recurring work;
- verification, rework, maintenance, recovery, support and retirement cost;
- equal-quality comparator and owner-set decision threshold; and
- conclusion: elevation supported, weakened, falsified or not evaluable.

Code reuse is supporting evidence only. Human and semantic truth determine whether the core
survived.

## 10. Kit-placement and evolution record

**Purpose:** govern the transition between proposition-local work and shared Kit responsibility.

Minimum content:

- observed recurring burden, risk or invariant;
- current local mechanism and proposition context;
- candidate semantic contract and legitimate semantic owner;
- why the Kit can own composition, lifecycle, invariant or assurance without authority capture;
- unlike-use, independent-composition or counter-instance evidence;
- consumer experience, conformance and extension boundary;
- compatibility, migration, support and stewardship commitment;
- disposition: admit, retain local, split, reject, deprecate or retire;
- generality/reach claim and its falsifier; and
- revalidation and retirement conditions.

Deliberate early placement is possible. General reach remains unearned until challenged.

## Reference and derivation rules

- Strategy and competent authorities remain upstream; records point to them.
- A profile derives applicability from activation facts and references contracts.
- A scenario references a profile and contracts; it does not amend them.
- A release records exactly what was realised; it does not upgrade a claim class.
- Evidence references the exact proposition/profile/scenario/release; it does not rewrite them.
- A disposition may change future commitments but cannot change past observations.
- Corrections append or supersede while preserving traceable history.
- Current views and indexes are rebuildable projections. They never become semantic authority by
  being convenient or central.

## Interface quality test

The records succeed if humans and agents can determine what is authoritative, current, applicable,
activated, observed and decided without reconstructing context from prose or repository history.
They fail if authoring becomes duplicative ceremony, if one manifest starts owning everybody's
semantics, or if important decisions still occur outside the records while the records imply
closure.
