---
document_id: gds-iai.specification-framework
document_role: exploratory-framework-proposal
revision: 4
updated: 2026-09-26
authority: owner-ratified-skill-delivery-scope-not-adopted-standard
inquiry_id: SPEC-FRAMEWORK-2026-09-26
inquiry_revision: 2
artifact_id: SPEC-FRAMEWORK-D4
artifact_revision: 4
epistemic_status: provisional
execution_mode: emulated-reduced
independence: same-context-self-review
oce_revision: e6cf8ee4c9ac33d00884436e8d08767fc2b36c06
skill_design_source_revision: 81d61b420404bb2626850779003d372ec6944d4c
---

# A comprehensive specification framework

**A connected account of purpose, meaning, obligations, authority, evidence and change—from a small engineering operation to a public service.**

26 September 2026 · Framework proposal v0.2 · Document revision 4

**Current decision:** the owner ratified `specify`, `specify-connection` and `assess-specification` for complete implementation in PR #250 on 26 September 2026. Appendix E records the binding delivery and evaluation acceptance criteria. Ratification settles the PR's skill scope; empirical effectiveness remains provisional. Earlier inquiry records retain their historical authority limits.

The proposed framework has five parts: a small common record; profiles appropriate to the thing being specified; explicit contracts between those things; evidence appropriate to each claim; and rules for review and change. Together these form a **network of specifications**. That network can begin as linked Markdown and existing schemas. It does not require a graph database, a new language or one central model of everything.

Comprehensive means that relevant concerns and connections are addressed within a declared boundary. It does not mean every detail is specified, every uncertainty resolved, or every small unit burdened with a service-sized template. The framework must make both commitments and remaining freedom clear.

This is an exploratory design proposal informed by GDS guidance, selected OCE methods and existing Student Support Experiments work. It is not a GDS standard, a claim of ISO conformance, an adopted OCE rule or a change to the Student Support Experiments commission. The conceptual draft is complete for discussion; the framework's effectiveness in practice remains untested.

The scope is deliberately general: public and commercial services, internal platforms, developer tools, libraries, data products, research and other projects. Student Support Experiments is one demanding application, not the organising ontology. The owner's clarification during drafting explicitly reinforced that boundary. Educational constructs appear only in the educational example; other subjects acquire their own domain profiles and evidence criteria.

**Revision 4 ratifies the skill delivery scope.** The framework is to be expressed as three task-focused skills—`specify`, `specify-connection` and `assess-specification`—with shared reference material and conditional handoffs to the existing `user-value`, planning, engineering and Parallax capabilities. Section 13 defines their triggers, procedures, outputs, ownership, evaluation and required delivery sequence. These specification skills are designs in this document, not installed capabilities. The renamed `user-value` implementation is [in this repository](../skills/planning/user-value/SKILL-CANONICAL.md). Sections 14–15 preserve the earlier D2 exploration and its evidence limits; Appendix D records the new inquiry revision.

Publication note: the named Student Support Experiments research inputs are separate project documents, not bundled repository dependencies. The examples and definitions needed to assess this proposal are included here. Their citations preserve provenance without requiring a reader to have access to that collection. Private-upstream citation (documentation-hygiene, private-upstream clause): the upstream is Student Support Experiments, the owner's private project; no public upstream URL exists. The sources cited by title below (the contracts-across-design-domains report of 2026-09-25, the teacher-set-work journeys, stories and impact report of 2026-09-25, and the service-needs-and-value-model document, revision 1) are that project's own documents, held in that project's collection; the exchange vehicle is the owner's hand, carrying this proposal from the non-executing host that drafted it into this repository through pull request 250; the adaptation is that every definition and example this proposal relies on is restated here, so nothing in it requires the upstream to be read.

## 1. The problem and intended value

Teams often have user stories, schemas, diagrams, tests, operational targets and policy statements without a dependable account of how they relate. A field can remain syntactically valid while losing meaning. An API can behave correctly while its consumer misuses its result. A journey can finish successfully without producing the hoped-for human outcome. An apparent owner can lack authority to make the relevant commitment.

The framework should let a reader answer:

1. What is this thing, for whom is it useful, and where does its responsibility end?
2. What exactly is promised, permitted, prohibited, assumed or still unknown?
3. Who can define, change, use, challenge and retire it?
4. What must hold at its connections to other things?
5. What evidence supports each claim, under what conditions, and what would defeat it?
6. What happens when something fails, changes or proves wrong?

Those questions serve different readers. A learner needs an understandable task and correction route. An engineer needs precise behaviour and failure cases. An operator needs actionable recovery and resource limits. A service owner needs responsibility, cost and outcome evidence. An evaluator needs claims and observations that can be distinguished. No single view should force all those readers to understand the whole technical model.

For a research or creative project, useful value may be an improved understanding, a defensible negative result or a new possibility. The framework must allow an open outcome while specifying the purpose, constraints, resources, conduct, evidence and handoff. Requiring every project to guarantee a predefined beneficial outcome would make the framework unsuitable for discovery.

## 2. Foundations and limits of inheritance

The [GDS API guidance](https://www.gov.uk/guidance/gds-api-technical-and-data-standards) recommends specification during design, including OpenAPI for REST and suitable specifications for other API styles. The [Service Standard's whole-problem requirement](https://www.gov.uk/service-manual/service-standard/point-2-solve-a-whole-problem) places those interfaces inside a wider human journey. [User-needs guidance](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs), [user stories](https://www.gov.uk/service-manual/agile-delivery/writing-user-stories) and [experience mapping](https://www.gov.uk/service-manual/user-research/creating-an-experience-map) supply related practices. These sources do not prescribe the combined framework proposed here.

The earlier GDS investigation found no universal GDS software-specification language in its bounded search. That is a search result, not proof that no specialist government framework exists. [GDS Way ADR guidance](https://gds-way.digital.cabinet-office.gov.uk/standards/architecture-decisions.html) concerns preserving architectural rationale; GDS Way's stated scope is its Digital Product teams, not all government by default. [NCSC guidance](https://www.ncsc.gov.uk/collection/developers-collection/principles/continually-test-your-security) recognises formal methods; mathematical specification is one possible instrument, not the definition of every specification.

Two external orientation checks help bound the proposal. [ISO/IEC/IEEE 42010:2022's public abstract](https://www.iso.org/standard/74393.html) distinguishes architecture descriptions, viewpoints and model kinds, and does not mandate a recording medium. Only the public abstract was inspected, so no clause-level compliance is claimed. [NASA's verification/validation distinction](https://www.nasa.gov/reference/2-4-distinctions-between-product-verification-and-product-validation/) separates conformance to requirements from suitability for intended use. This proposal adopts the distinction without importing NASA's organisational process.

The project's contracts report (separate project source: the Student Support Experiments contracts-across-design-domains report of 2026-09-25) already establishes different kinds of capability, connection contracts, distinct data authorities and limits on inference. The journey collection (separate project source: the Student Support Experiments teacher-set-work journeys, stories and impact report of 2026-09-25) supplies proposed situations to exercise the framework. These are inherited design premises and examples, not independent evidence that this framework works. Open Standards retains ownership of the Service Manual research; Student Support Experiments retains its domain decisions.

## 3. Vocabulary: the things that must remain distinct

| Term | Meaning in this proposal | Important boundary |
| --- | --- | --- |
| Specification | An attributable, versioned account of an intended subject's relevant properties, constraints and permissible variation | Can contain unresolved questions and hypotheses; not every statement is a promise |
| Contract | Obligations and permitted reliance at a boundary, under stated conditions | Not necessarily a legal contract; identify the parties and authority explicitly |
| Requirement | A normative condition imposed by an identified authority for a stated scope | Priority, strength and authority are different properties |
| Model | A selective representation used to explain, predict, design or analyse something | Its abstractions and omissions are part of its meaning |
| Schema | Rules for admitted representations and some structural constraints | Schema validity alone does not establish truth, permission or complete behaviour |
| View | A representation selected for a reader or concern | Declare what it omits and which sources own its claims |
| Evidence | An observation, result or argument bearing on a specified claim | Availability, quality, relevance and independence are separate |
| Assurance claim | A bounded assertion that an obligation or outcome is sufficiently supported for a particular reliance | A passing test is narrower than proof; evidence can become stale |
| Decision | An attributable exercise of authority selecting a course or resolving a dispute | Evidence informs decisions but does not confer authority |
| Hypothesis | A proposition requiring investigation | Precise expression does not turn it into a guarantee |

Use separate labels for descriptive observations, hypotheses, design proposals, adopted requirements, implemented behaviour and assessed conformance. A statement can be adopted but unimplemented, implemented but unverified, or verified under conditions that no longer hold.

“Capability” requires a qualifier. A service capability lets people accomplish something; an engineering capability performs a bounded computation or representation. They are connected, but neither is merely a larger or smaller instance of the other. People are affected participants with agency, not components to be specified for compliance.

## 4. A coordinate system, not a universal hierarchy

Locate a specification using only the coordinates that change its interpretation.

| Coordinate | Examples | What it prevents |
| --- | --- | --- |
| Subject kind | Institution, service, journey, interaction, domain model, interface, software component, algorithm | Treating unlike objects as interchangeable building blocks |
| Decomposition | Actors/responsibilities; experiences; states/events; data/relations; components; resources; incentives | Assuming one architectural breakdown explains every concern |
| System extent | One operation, bounded service, organisation, multi-organisation ecosystem | Claiming local evidence covers a larger system |
| Time | Call duration, session, repeated use, learning horizon, years of maintenance | Confusing immediate completion with lasting effect |
| Population/distribution | One case, a subgroup, intended population, excluded people | Inferring population benefit from selected successes |
| Authority | Definition, authorship, operation, access, amendment, dispute resolution, risk acceptance | Treating an “owner” field as universal authority |
| Knowledge status | Proposed, observed, inferred, normatively required, contradicted, unresolved | Turning uncertainty into commitment silently |
| Representation/formality | Narrative, structured record, schema, executable predicate, mathematical model | Equating machine-readable with complete or correct |

“Altitude” remains a useful navigation metaphor: public purpose, whole service, journey, interaction, domain/interface and engineering detail. It is not an authority order or a guarantee that refinement is possible. A single interaction can simultaneously involve institutional power, pedagogical meaning, microsecond computation and years of retained consequences.

For consequential claims distinguish five scales: where evidence was **observed**, where the proposed **mechanism** operates, where an **intervention** acts, where its **consequences** occur, and where **monitoring** looks. A host-level test may observe valid output while the consequential failure occurs in a later educator decision.

## 5. The common record

Every specification needs a recoverable answer to the following questions. The answers may be supplied by a short comment, an existing source or a linked record; eight separate documents are not required.

| Field group | Minimum content |
| --- | --- |
| Identity and status | Stable identifier, revision, subject kind, proposal/adoption status, canonical location |
| Purpose and consumers | Useful local purpose; consumers and materially affected parties; reason for this boundary |
| Scope and context | Included/excluded behaviour, environment, applicability, relevant time and population bounds |
| Claims and obligations | Meaning, required/permitted/prohibited behaviour, observables and allowed variation |
| Conditions and unknowns | Assumptions, preconditions, dependencies, limits, questions and consequences of being wrong |
| Authority | Who defines, implements, operates, changes and resolves disputes; additional powers only where relevant |
| Evidence and acceptance | What supports each consequential claim; method, scope, result and missing evidence; acceptance decision |
| Change and failure | Failure response, correction, compatibility, revision triggers and retirement responsibility |

A tiny pure function can satisfy this in a dozen lines. Shared context can be inherited by a named reference, but inheritance must be visible and conflicts must be resolvable. Do not mechanically copy a large service context into every dependency.

For each normative statement use this grammar:

> Under **conditions**, **responsible actor or system** must/must not **perform observable behaviour or preserve a property**, within **stated bounds**, with **defined failure/recovery behaviour**. Evidence is supplied by **method** for **this scope**.

Not every concern fits a deterministic predicate. For accessibility or experience, specify the intended activity, relevant users and conditions, method of investigation, judgement criteria and treatment of disagreement. “The user is satisfied” is not an executable requirement merely because it appears in a checklist.

Unknowns have one of three explicit treatments: block the affected reliance; permit a bounded investigation with a safe boundary; or accept a named residual uncertainty within someone's actual authority. A blank field is not an implicit permission. Nor is every unknown a reason to block unrelated work.

## 6. Profiles and activation rules

Profiles add the detail required by a subject and its consequences. They stack; they are not exclusive levels. Start with the common record and apply these triggers. A deliberate omission needs a reason when the trigger is present.

| Profile | Activate when | Additional specification content |
| --- | --- | --- |
| Public/service purpose | Claims concern human or public value | Intended outcomes, affected and excluded groups, theory of change, alternatives, costs, distribution, public accountability and limits of controllable commitments |
| Experience and delivery | People undertake a journey or receive support | Needs and their evidence status, entry/exit, before/during/after, channels, actors, handoffs, accommodations, failure, correction, human discretion and reachable support |
| Domain meaning | Terms or relationships carry consequential interpretation | Definitions, identity, units, relation semantics, provenance, contextual meaning, uncertainty, competing interpretations and examples/counterexamples |
| Data and stewardship | Data is captured, derived, retained, disclosed or corrected | Source/record authority, quality, minimisation, provenance, lineage, permitted use, retention/deletion, correction propagation, reference access and applicable responsibilities |
| Behaviour and interface | Another system or person relies on a boundary | Inputs/outputs, effects, states/transitions, pre/postconditions, errors, ordering, concurrency, idempotency, cancellation, deadlines, versioning and discoverability |
| Engineering unit | A computation or data structure is independently used | Mathematical/domain definition, admissible inputs, invariants, determinism, mutation/aliasing, termination, failure and resource complexity |
| Agent/AI behaviour | A model or agent interprets instructions or chooses actions | Role, task, tool authority, context, prohibited effects, uncertainty/refusal, escalation, configuration dependencies, evaluation distributions, failure severity and containment |
| Operations and continuity | Behaviour depends on a running service or organisation | Service levels, workloads, resource/cost bounds, observability, incident response, recovery, support capacity, external dependencies, exit and retirement |
| Governance and authority | Responsibilities cross people or organisations, or decisions affect others | Decision rights, delegation scope and revocation, obligations, challenge/redress, conflicts, assurance independence, procurement/exit responsibilities |
| Measurement and assurance | A score, test, inference or evaluation justifies reliance | Construct, claim, oracle/rubric, test/evaluation design, validity, uncertainty, coverage, dependence, evidence freshness, thresholds and decision consequences |
| Research and exploratory project | The output or route is intentionally uncertain | Inquiry/purpose, permissible variation, ethical and resource constraints, methods, stopping conditions, negative-result treatment, reproducibility where applicable and handoff; no obligation to produce a favourable finding |

Cross-cutting concerns—security, privacy, accessibility, safety, inclusion, sustainability and maintainability—are applied wherever their mechanism is present. They are not a final “non-functional” appendix. For example, changing an authority check changes allowed behaviour; an unusable recovery route changes whether the service exists for a person.

For quantitative targets specify the unit, population/workload, denominator, percentile or distribution, measurement boundary, time window, exclusions, threshold authority and action on breach. “Fast”, “accurate”, “fair” or “high availability” does not identify an assessable obligation. Numerical values are selected for the actual case; this framework invents none.

Specialist domains can add profiles for physical safety, regulated decisions, financial transactions or other constraints. The common record does not replace their substantive standards or qualified judgement. For non-software work, implementation may be an operating procedure, trained team or physical arrangement rather than executable code.

## 7. Relationships carry contracts

A collection of complete local specifications is not a complete account of their composition. Relations must say what can legitimately travel across the connection: data, meaning, effects, authority or warrant.

| Relation | Necessary contract | Forbidden inference |
| --- | --- | --- |
| Motivates | Which need/value justifies which obligation, with rationale | Popularity proves benefit |
| Refines | Which higher claim is made more precise, preserved assumptions and added constraints | Any detail is a valid refinement |
| Allocates | Which party/component takes responsibility for which obligation, and what remains shared | Allocation proves delivery or removes service-owner responsibility |
| Depends on / composes with | Required/supplied guarantees, compatible environments and interaction obligations | Locally correct parts imply globally correct behaviour |
| Transforms / represents | Preserved meaning, identity and units; permitted loss; rejection conditions; source/target versions | Schema-valid output is semantically equivalent |
| Authorises / delegates | Grantor's authority, subject, action, purpose, scope, expiry/revocation and enforcement point | A reference, recommendation or access right confers other powers |
| Supports / challenges | Exact claim, evidence, inference rule, independence and validity limits | An evidence link proves the claim |
| Contributes to outcome | Causal mechanism, alternatives, exposure, conditions and evaluation | Completed interaction establishes causal impact |
| Supersedes / corrects | Effective scope/time, history, affected consumers and migration/correction duties | New publication means every consumer has changed |

Use stable identity for consequential relationship assertions, distinct from relation type and endpoint identity. Preserve who asserted what, when and on what basis. Repeated source occurrences are not independent evidence. Small, uncontested structural links need not acquire separate records unless attribution, correction or lifecycle requires it.

A consequential seam record contains:

> Relation type; source and target identities/revisions; purpose; producer and consumer obligations; semantic preservation or permitted effects; authority; failure and recovery; evidence; change triggers.

Some claims depend jointly on several premises. Represent the combination explicitly as a claim with multiple required premises; do not turn several individually insufficient links into apparently independent support. This can be a small table, not necessarily a hypergraph implementation.

### Composition test

For a technical consumer, a provider's guarantees must satisfy the consumer's assumptions **in the shared operating context**. Check satisfiability and reachability as well as implication: a guarantee that only holds under impossible assumptions is vacuous. Cyclic assumptions need a justified initial condition or a joint argument; “A trusts B and B trusts A” is not a basis.

Then examine new behaviour introduced by composition: retries and duplicate effects; shared capacity and contention; latency budgets; concurrency and ordering; partial failure; cancellation; inconsistent versions; permission propagation; correlated failures; and recovery. Pairwise compatibility alone may miss a three-party cycle or shared resource bottleneck.

For human services, the analogous check is a concrete responsibility and delivery argument. It is not a mathematical proof that people will behave as intended. A support route requires a receiving organisation, capacity and usable contact mechanism, not just a button.

## 8. Needs, journeys, stories and specifications

These are related representations with different jobs.

| Representation | Job | Connection to the framework |
| --- | --- | --- |
| Vision / intended impact | State the desired change and whose welfare matters | Motivates service commitments; impact remains an outcome hypothesis until supported |
| User need | Explain what someone needs to accomplish and why | Evidence-bearing or explicitly hypothetical; can motivate several journeys and requirements |
| Journey / experience map | Explain activity and experience across time, actors and channels | Exposes handoffs and gaps; distinguish observed current experience from proposed future journeys |
| Service blueprint | Connect visible experience with supporting work and responsibilities | Optional useful view over the delivery/operations contracts |
| Story | Make a bounded user goal discussable and deliverable | Links to needs and relevant journey situations; not necessarily one endpoint or one component |
| Scenario / example | Make conditions, actions and outcomes concrete | Helps expose ambiguity, exceptions and evidence requirements |
| Behaviour/domain/interface contract | Define what must actually hold | Supplies the obligations that stories alone leave implicit |
| Theory of change | Explain how delivered activities might produce outcomes | A causal argument with assumptions, rivals and an evaluation need |

These connections are many-to-many. A shared correction mechanism can support many journeys; one story can require several interfaces; an algorithm can serve several services. Trace relevant relationships rather than forcing a single parent chain.

A journey is not automatically a state machine. Translate only the behaviour that requires discrete state and precise transitions; retain human meaning, discretionary choices and unknown paths in an appropriate representation. A story's acceptance criteria can establish delivery while leaving a longer-term learning or public-value claim open.

## 9. Assurance: four questions and several kinds of evidence

Ask separately:

1. **Is the specification adequate?** It addresses the right need, scope, constraints and affected parties; no material contradiction is hidden.
2. **Does the implementation conform?** Its observed or proven behaviour meets specified obligations within the stated domain.
3. **Is the result useful in context?** People can achieve the intended purpose in the actual environment.
4. **Does it produce the claimed wider effect?** A defensible evaluation supports the outcome and any causal or distributional claim.

The framework proposes these questions; it does not imply that every engineering unit must answer all four independently. A tiny operation can close its local conformance claim while a service-level effect remains unresolved.

| Claim | Appropriate warrant | Essential limit |
| --- | --- | --- |
| Shape or representation validity | Schema validation, static checks, serialization tests | Does not establish meaning or authority |
| Deterministic behaviour | Examples, properties, exhaustive checks over a declared finite domain, analysis or formal proof | Tests sample behaviour; proofs are conditional on models and premises |
| Semantic preservation | Mapping rules, discriminating fixtures, domain review, justified equivalence argument | Loss must be declared; a round trip can preserve a shared mistake |
| Operational reliability | Representative workload/failure evidence and production observations | Environment, correlated failures and observation windows matter |
| Agent behaviour | Held-out cases, repeated trials where relevant, controlled configuration, calibrated scoring and adversarial cases | A finite sample cannot guarantee no future failure |
| Human usability/access | Research with relevant people and settings, including difficult and excluded cases | A designed persona or author walkthrough is not user research |
| Learning/public impact | Valid measurement and an appropriate comparative or causal design | Satisfaction, completion and aggregate averages are not substitutes |

Evidence records identify the exact claim and subject revision, instrument/oracle version, conditions, input provenance, result, uncertainty, known exclusions, date and reviewer. Where an upstream dependency changes, mark affected reliance for review rather than pretending every result is either eternally valid or wholly useless.

Do not generate the only oracle from the same implementation it is meant to check. Schema-derived code and documentation reduce drift, but independently justified examples or properties are still needed to catch a wrong source definition. The OCE ground-truth skills supply a relevant local warning: expected results need their own substantive basis. Their search-specific metrics and persona constraints are not universal evaluation rules.

Acceptance is a profile, not one green flag: structural validity; behavioural conformance; semantic fidelity; operational readiness; context suitability; and outcome support can have different statuses. Evidence strength does not substitute for authority to accept residual risk. Non-waivable obligations cannot be traded away by an internal score.

For AI, distinguish hard surrounding controls from empirically assessed model behaviour. A specification can prohibit unauthorised effects, with enforcement at a trusted boundary, while separately measuring whether the model follows instructional preferences. “Never discloses private data” cannot be discharged solely by a set of successful prompts.

## 10. Change, drift and conflict

Maintain separate state for the specification, implementation and evidence. Suggested specification states are proposed, adopted, deprecated and retired; evidence can be absent, supporting, challenged or stale. These are conceptual distinctions, not a prescribed enum implementation.

Every change asks what it alters: syntax, meaning, behaviour, authority, evidence assumptions, operations or human expectations. Backward-compatible shape can conceal incompatible meaning. Timestamps or semantic-version labels help identify change but do not establish compatibility on their own.

A useful change procedure is:

1. Identify the changed claim and its authority; retain the previous revision.
2. Traverse its relevant dependency and reliance links to find affected consumers, tests, views, operational procedures and evidence.
3. Classify compatibility in each relevant dimension and identify any required migration or re-evaluation.
4. Record transition behaviour, coexistence, rollback, correction propagation and retirement conditions.
5. Verify the served/used result at the actual boundary and record which consumers have adopted it.

Where time matters distinguish source event time, observation time, effective time and revision time. An amendment can become effective after an observation without retroactively changing what happened. Revocation, correction and deletion have different meanings; retained lineage must respect the applicable data policy rather than becoming an excuse to preserve personal data indefinitely.

Resolve conflicts in this order: check whether scope/versions/terms differ; correct factual error; identify the actual governing authority and obligation; preserve unresolved value conflicts for that authority. Do not invent a universal rule that “the higher-level document wins”. An organisational aspiration cannot override an applicable prohibition, and an implementation cannot redefine a requirement merely by existing.

Schema, code, prose and generated views each have named homes. When their content is mechanically derivable, generate and check it. Where interpretations differ legitimately, preserve a crosswalk rather than claim one representation is the universal source of truth. One authoritative definition per concern is compatible with distributed authority across domains.

## 11. Six contrasting applications

These are documentary design walkthroughs. They show what the proposal makes explicit. No implementation, learner study, load test or formal proof was executed.

### A. A small engineering operation

**Subject:** a pure parent-index operation for an array-backed binary heap. **Purpose:** give another engineering unit the parent's position. **Scope:** zero-based non-negative safe-integer indices; actual membership of an array is a caller concern.

**Proposed contract:** index zero returns an explicit `none` result. For an integer index greater than zero, return `floor((i - 1) / 2)`. Reject negative, fractional, non-finite and unsafe-integer inputs at the declared public validation boundary. The operation has no I/O, mutates nothing and uses constant time and space under the chosen fixed-width numeric model. Its validated input type and root result are defined in the public API.

**Candidate properties:** for every admitted positive index, `0 ≤ parent(i) < i`; the children of a parent have indices `2p + 1` and `2p + 2` where those computations remain in the admitted range. Tests need explicit boundary examples plus appropriate property coverage; a universal mathematical argument and correctness of a particular implementation are distinct evidence tasks.

**Connection obligation:** a heap repair routine must additionally establish that the supplied index refers to an actual element and that its comparator/order invariants hold. The parent calculation establishes neither heap membership nor stable queue ordering. No user journey or national impact statement is needed to finish this local specification. Capability Foundations' own qualification rules continue to govern acceptance there.

### B. A curriculum API exposed through MCP

**Subject:** a read-only curriculum retrieval operation and its MCP projection. **Purpose:** supply an authorised consumer with a bounded, interpretable curriculum result. **Source authority:** the curriculum definition and revision. **Serving responsibility:** faithful mapping and declared freshness/completeness.

**Proposed contract:** the result distinguishes found, absent, unavailable and invalid-request conditions; preserves identity, source revision, relevant relation semantics and scope; and does not fabricate missing material. Absence from a bounded view must not be described as absence from the whole curriculum. Transport errors and domain result states have a documented mapping.

**Seam:** an upstream response may be filtered, enveloped or otherwise transformed before it is served. Therefore the MCP output definition describes the actual served result after transformations. Test discovery and calls at the wire boundary as well as internal types. This applies the inspected OCE schema-first directive within its own MCP scope; it does not claim that an OpenAPI document owns every pedagogical or institutional rule.

**Authority and effect:** public curriculum content does not make a private plan or learner observation public. A read-only operation does not authorise a downstream mutation. A host's ability to discover a tool does not establish permission to invoke every operation or disclose all related records.

**Evidence:** mapping fixtures include qualifiers preserved, an omitted relation, an unavailable source and a changed revision; boundary checks cover actual schemas and results. Host evaluations examine whether the result is used appropriately. Correct retrieval cannot establish good tuition or learner progress.

### C. Teacher-set work with help, interruption and return

**Need/vision connection:** a learner should understand assigned work, make their own attempt, obtain permitted help and return an accurate account. This is drawn from the current proposed Student Support Experiments journeys; detailed need formulations still require user research.

**Service commitment:** present the applicable assignment and assistance conditions; support permitted work and recovery; preserve truthful status and attribution. An educator amendment changes the obligation through the appropriate authority. Pausing or following a curiosity branch does not itself complete or cancel assigned work.

**Meaning contract:** distinguish curriculum sequence, intended educator sequence and enacted activity. Distinguish learner work, instructional assistance, accessibility accommodations, observations and interpretations. A correct assisted answer is not equivalent to an independent demonstration, and necessary accommodation is not automatically an instructional hint.

**Behavioural seam:** before confirming submission, the receiving boundary must provide evidence of receipt for the particular assignment/attempt revision. If acknowledgment is lost, the state is uncertain, not silently successful or failed. A retry strategy must prevent duplicate logical submission within its declared scope. If the receiving workflow cannot provide that behaviour, the UI must preserve uncertainty and offer a workable resolution route.

**Responsibility seam:** in a Base-host setting, Student Support Experiments can specify what context it supplies and which host behaviour is required. It cannot claim to enforce an institution's host or complete an educator's follow-up without evidence. The whole-service contract allocates those obligations and distinguishes demonstrated, simulated, unsupported and externally dependent steps.

**Outcome seam:** immediate useful results include an attributable attempt, preserved question or actionable unresolved difficulty. Learning, retention and equitable benefit remain separate claims with their own observation horizons and evidence. A learner who cannot complete the task is not an implementation defect to be forced into a success state.

**Correction seam:** a disputed interpretation is identifiable, attributable and prevented from silently remaining authoritative after correction. Propagation has its own recipient, timeframe and acknowledgment contract where required. A corrected source does not prove every cache, summary or teacher view has changed.

### D. A public repair-reporting service

**Purpose:** enable a resident to report a problem with a public asset, understand who is responsible and obtain a truthful account of what happens next. This is a hypothetical design case, not a claim about an existing council or a legal duty.

**Whole journey:** discover an appropriate reporting route; describe the issue through an accessible channel; establish location and urgency; receive acknowledgment; learn whether the asset is in the service's remit; obtain referral or action; receive an intelligible update; challenge mistaken closure. A report, a validated issue, an accepted work order, attendance and a completed repair are distinct states.

**Domain seam:** multiple reports can describe the same physical defect without being the same submission. Deduplicating work must not erase distinct reporters' contact preferences or turn several reports into independent confirmation of cause. The matching rule is a domain claim, not a generic string-equality decision.

**Organisational seam:** one organisation may own the asset, another triage reports and another carry out repairs. A ticket forwarded to a contractor is not evidence that responsibility was accepted. The handoff needs its own acknowledgment, timeout, escalation and fallback. Accessibility includes the route beyond the form: a successful online submission followed by an unusable phone-only follow-up may fail the journey.

**Commitment versus consequence:** the service can commit to accurate acknowledgment, status and its chosen response process. A guaranteed repair time requires authority, capacity, scope and exception rules. Public safety improvement requires evidence beyond ticket closure. More closed tickets could coexist with worse outcomes if easy cases are selected or repeat reports are suppressed.

**Framework result:** experience, operations, domain identity, authority and evidence are necessary profiles; a learner model, pedagogical theory or AI profile is unnecessary. This case challenges any attempt to treat the digital interface as the whole service.

### E. A reusable data transformation pipeline

**Purpose:** produce a reproducible daily analytical dataset from several upstream sources. This is a general case; no particular storage product or actual dataset is selected.

**Input contract:** identify source schema and semantic revisions, event and ingestion time, units, record keys, correction semantics, expected availability and permitted use. Define whether missing data means unknown, not applicable or zero. A zero-fill convenience can silently change the analytical claim.

**Transformation contract:** state which meanings, identities and totals should be preserved; aggregation and rounding rules; duplicate/late/corrected-record treatment; acceptable exclusions and their reporting. An invalid batch must not be silently published as a complete successful run. Choose atomic publication, partial publication with explicit completeness, or another named policy according to the consumer's actual need.

**Operational seam:** a downstream dashboard must know which data and transformation revisions it uses, what period is complete and how late corrections reach it. A reproducible transformation is not proof that upstream observations were accurate or representative. An aggregate can be correct while concealing subgroup differences.

**Evidence:** schema checks cover admitted representation; reconciliation and independently specified fixtures cover transformation; source-quality investigation covers observation credibility; consumer validation covers fitness for the analytical use. The pipeline can close a transformation-conformance claim without owning the truth of every source observation.

**Framework result:** domain, data, interface, operations and assurance profiles are central. A human journey is added only where people interact with or rely on the product; it is not compulsory ceremony inside each transformation.

### F. An exploratory research or design project

**Purpose:** investigate whether a proposed approach can meet a need whose solution is uncertain. Success may be a well-supported rejection of the approach. The project specification states the question or opportunity, intended audience, prior assumptions, resource boundary, permitted activities, deliverables and what makes a conclusion warranted.

**Open space:** permit changing methods when findings justify it, while recording the change and its consequences for comparability. Distinguish exploratory from confirmatory work. Do not reinterpret a negative result as project failure merely because a sponsor preferred a positive result.

**Evidence and closure:** acceptance can require a traceable account of methods, results, alternatives and limitations rather than a particular substantive answer. A discovery artifact is complete when its declared learning scope is addressed and its remaining uncertainty is honestly handed off. This does not authorise indefinite exploration: time/resource limits and a stop or reframing decision remain explicit.

**Framework result:** inquiry and handoff contracts are valuable, but a fixed product behaviour contract may be premature. This case tests whether specification enables discovery or wrongly freezes it. Its project delivery plan schedules work; its specification defines the sought learning, constraints and acceptable warrant. Neither guarantees a breakthrough.

## 12. A practical authoring and review method

Use this as a repeatable activity set, not a compulsory waterfall. Findings can reopen any earlier question. A single execution should still name its scope and stopping condition.

1. **Frame the purpose and boundary.** Name the subject, consumer/affected parties, intended local value and decision or learning need. Distinguish a new hypothesis from an adopted obligation.
2. **Choose sufficient views and profiles.** Select only the coordinates and profiles whose absence would conceal a material distinction. Record justified omissions.
3. **Write one concrete successful case and meaningful adverse cases.** Use examples to expose terms, state, responsibility and conditions before inventing a universal model.
4. **Specify obligations and permissible freedom.** Include errors, uncertainty, recovery and human discretion. Identify what remains deliberately unspecified and what no consumer may rely on.
5. **Specify the material seams.** Examine composition, translation, authority and causal inference separately. State both sides' obligations and the new obligations of their combination.
6. **Design the warrant with the claim.** Choose proof, testing, research or evaluation appropriate to the claim. Establish meaningful expectations before inspecting results where possible.
7. **Challenge and decide readiness for a named use.** Review contradictions, excluded people, weak assumptions, stale evidence and cost of the specification itself. Record who may accept what.
8. **Publish the relevant view and maintain it.** Give consumers a usable version, change path and correction route. Reopen affected claims when conditions change.

Completion is always **for a named use and boundary**. Ready for discussion is different from ready for implementation, integration, deployment or an outcome claim. A detailed proposal can be complete while its suitability remains provisional.

### Minimum readiness questions

- Can another reader identify every consequential obligation and its conditions without the author present?
- Can they distinguish a guarantee, a hypothesis, a value choice and an observation?
- Are the material terms, failure paths, authorities and connection obligations explicit?
- Is each claim paired with a suitable method and honest evidence status?
- Are unresolved issues given a disposition that matches the proposed reliance?
- Can a consumer tell what changed and how to remain compatible?
- Does the smallest representative example remain small, while the largest exposes cross-boundary responsibilities?

The answer need not be “yes” for every future use. A proposal awaiting evidence can still be useful and clearly bounded.

## 13. Relationship to existing OCE skills

The inspected OCE sources support much of the method already. The framework should connect them rather than duplicate their content. The original-method table below preserves links pinned to `e6cf8ee4c9ac33d00884436e8d08767fc2b36c06`; the added skill design uses the PR revision identified in §13.1.

| Existing capability | Useful contribution | Limit or proposed connection |
| --- | --- | --- |
| [Metacognition](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/cognition/metacognition/SKILL-CANONICAL.md) and its directive | Reconsider inherited categories and the action-to-impact connection | Exposes whether “comprehensive” has become paperwork or formalism |
| [Free play](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/cognition/free-play/SKILL-CANONICAL.md) | Opens associations before convergence | Seeds are design prompts, never evidence |
| [Concept exploration](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/cognition/concept-exploration/SKILL-CANONICAL.md) | Turns uncertain categories into warranted proposals | Stop when the frame is formed; do not endlessly reopen settled detail |
| [Reason](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/cognition/reason/SKILL-CANONICAL.md) and [proportionality](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/cognition/proportionality/SKILL-CANONICAL.md) | Warrants, alternatives, falsifiers, scope and instrument sizing | Small scope still requires correct specification; larger ceremony is not stronger evidence |
| [Planning](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/planning/plan/SKILL-CANONICAL.md) | Purpose, value, mechanism, acceptance and proof boundaries | Delivery plans consume specifications; specifications are not task schedules. Repository ratification machinery applies to its plan estate, not automatically to this report |
| [Parallax](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/cognition/parallax/SKILL-CANONICAL.md) and framing/synthesis/audit siblings | Distinct bases, scale vectors, bridge/crosswalk claims, source dependence and defeaters | Use for consequential seams and contested designs; not every function comment |
| [Schema-first MCP directive](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/directives/schema-first-execution.md) | Authoritative derivation and actual served-boundary conformance | Applies to its defined MCP execution scope; human outcomes cannot be generated from an API schema |
| [Working with graphs](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/working-with-graphs/SKILL-CANONICAL.md) | Explicit bounds, typed relations and truthful completeness | Its graph-serving doctrine is not a universal prohibition on other graph models or sampled research |
| [Ground-truth design](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/ground-truth-design/SKILL-CANONICAL.md) and [evaluation](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/ground-truth-evaluation/SKILL-CANONICAL.md) | Domain-relevant oracles and resistance to post-hoc justification | Search-specific guidance; not a general assurance framework |
| [TSDoc](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/tsdoc/SKILL-CANONICAL.md) | Intent, invariants and examples near a public API; canonical documentation homes | A code-level view, not the owner of a whole service specification |

### 13.1 Reuse the renamed value work

The earlier inventory finding was bounded to the then-inspected `engraph` tree. It is superseded for value modelling by the directly inspected [`user-value` source](../skills/planning/user-value/SKILL-CANONICAL.md). Its scope is use value expressed, implemented and assessed across levels, despite its deliberately reader-friendly name. It covers human and technical consumers, optional journeys, conditional guarantees, implementation correspondence and bounded evidence. It does not require an invented human persona for a primitive.

Its three references own value/entity semantics, journeys/stories, and levels/implementation respectively. Seven evaluation cases and ten trigger examples are authored. The method review reports two exercises on the earlier service-focused draft; they are not validation of the renamed, broadened revision. The eight generated user-value adapters were subsequently committed at `52a377a25463019d848ffa3e910ffd94b74b5957`, whose required CI passed. Revised-skill evaluation remains completion work. This framework must integrate that capability rather than create a competing service-value method.

The revision-2 note in Appendix B remains historical provenance. It is not the current name or delivery status. The proposal below uses `user-value` throughout.

### 13.2 Decision: skills express operations; references express the framework

**Ratified delivery decision (26 September 2026):** retain one common conceptual framework and expose all three distinct operations as skills in PR #250. Reuse `user-value` for questions of usefulness and `plan` for implementation sequencing. Make lifecycle maintenance a mode of authoring, with connection analysis and readiness reassessment invoked when material. Do not create one skill per profile, altitude, entity or document heading.

The gap is a repeatable way for authors and reviewers to turn mixed intentions, contracts and evidence into dependable, appropriately sized accounts of reliance. A long reference alone does not tell an agent when to act, how far to go or what a completed result must preserve. Conversely, a skill for every noun would multiply routing ambiguities and duplicate definitions.

| Shape considered | Strength | Material weakness | Disposition |
| --- | --- | --- | --- |
| Reference only, using existing skills | Lowest new routing and maintenance burden | General cognition does not supply a repeatable specification output contract | Keep as baseline comparator and valid small-task route |
| One large specification skill | One entry point and consistent vocabulary | Authoring, composition and assessment have different inputs, failure modes and edit authority | Retain a light entry route in `specify`; separate the two materially different operations |
| A skill per profile or altitude | Easy topical discoverability | Confuses subjects with procedures; overlapping triggers, repeated semantics and compulsory-looking stages | Reject as the initial architecture |
| Three operations plus shared references and existing capabilities | Direct invocation, bounded contracts, reuse and distinct evaluation | Adds handoff and version-management obligations | Owner-ratified implementation scope; evaluate each skill before PR acceptance |

The ratified shape is a design judgement, not a measured optimum. Comparisons with simpler approaches must still be retained. Evidence favouring fewer skills is a reason to propose a later owner-approved scope change, not permission to omit a ratified skill from this PR. A separate assessor is justified by a different task and output; a different skill name does not create independent assurance.

### 13.3 Skill contracts

These are the ratified canonical names. Repository adapters acquire the repository's normal prefix through generation. The document itself does not install them or make absent invocations live.

| Ratified skill | Trigger and required input | Procedure and output | Boundary and stop |
| --- | --- | --- | --- |
| `specify` | Define, repair or revise the properties, obligations or permitted variation of a named subject; input is scope/purpose, intended use and available authoritative material | Inspect existing representations; choose profiles; write concrete normal/adverse cases; distinguish claim kinds and authorities; specify observable obligations and freedom; attach evidence plans/status; reconcile affected records. Return a bounded specification, changes/correspondence, unresolved issues and eligible handoffs | Does not manufacture value evidence, implement software, approve deployment or require all profiles. Stop when another reader can interpret the named obligations and remaining uncertainty for the requested use |
| `specify-connection` | Determine whether parties, components, representations or claims can be relied on together; input is identified endpoints, proposed relation, relevant contracts/versions and intended reliance | State both parties' obligations; compare supplied guarantees with required assumptions; inspect meaning, effects, authority, failure and change; expose additional composition obligations. Return a seam contract, compatibility argument, counterexamples, missing evidence and affected endpoints | No silent rewrite of endpoint authority; no inference from local correctness to system success. If an endpoint is unavailable, produce a provisional requirement on it and mark compatibility unassessed |
| `assess-specification` | Judge an existing specification for discussion, implementation, integration, operation or a stated claim; input is exact revision, reliance scope and available evidence | Establish assessment criteria from the intended use; inspect obligations and selected profiles; challenge examples, seams, evidence and uncertainty; classify findings and issue a scoped disposition with conditions and next action | No automatic adoption, risk acceptance or self-awarded independence. Do not silently repair the target during assessment; authorised repairs create a new revision and a distinct reassessment |

**Authoring modes.** Create starts from the smallest sufficient record. Repair preserves identifiers and accounts for retained, split, merged or retired material. Revise starts from a changed claim or condition, traces affected reliance and records semantic, behavioural, authority and evidence compatibility. The same core vocabulary serves all modes. Updating a date alone is not lifecycle maintenance.

**Assessment output.** Use a disposition such as ready for the named use, ready with explicit conditions, not ready, or unassessable from the supplied material. Map to existing project terms where possible. Specify which obligations were assessed, which evidence was inspected, which gaps block which reliance, who has acceptance authority, and when reassessment is required. These are proposed specification-assessment labels, distinct from Parallax's epistemic status and audit disposition. A proposal can be ready for discussion while its effectiveness remains provisional.

**Conformance is not usefulness.** `user-value` identifies what a consumer could use a provision to accomplish; `specify` makes a provision's commitments precise; `specify-connection` examines whether reliance survives interaction; specialist methods supply observations; `assess-specification` judges adequacy for a named reliance. No stage is a certificate for the next.

### 13.4 A routing policy with direct entry and bounded return

| Actual question | Primary route | Conditional next step |
| --- | --- | --- |
| Who could use this, for what purpose, and is the value claim justified? | Existing `user-value` | `specify` when a selected commitment needs precision |
| What must this thing do, preserve or permit? | Proposed `specify` | A selected reference profile, seam analysis or specialist engineering method |
| Can these individually defined things work together? | Proposed `specify-connection` | Return a concrete missing obligation to its authoritative endpoint |
| Does this evidence justify this use of this specification? | Proposed `assess-specification` | Specialist verification or Parallax inquiry/synthesis if the evidence question is unresolved |
| How do we deliver an already selected change? | Existing `plan` and engineering methods | Reopen a definition only when a consequential gap is discovered |
| Are the question, boundary or competing perspectives wrong? | Existing concept exploration or Parallax framing | Return a changed boundary or discriminating question |
| Is this settled, small implementation work? | Existing engineering workflow | No compulsory value or specification-family pass |
| What can an exploratory project legitimately promise? | `specify`, research profile | Inquiry methods for the substantive question; no obligation to find a positive result |

Admission examines the user's requested operation and the artifact's condition, not merely words such as “service”, “specification” or “value”. Several skills can contribute without each running its complete workflow.

A return edge must name a new fact or unresolved obligation. It must not bounce “needs more detail” between two skills indefinitely. For each bounded run record the entry question, material outputs, outstanding gaps and stop condition. If one authoring pass plus one challenge pass cannot resolve a design choice, preserve the competing alternatives and their discriminating evidence; do not expand the document merely to make it appear complete.

The reusable relationships are cyclic because evidence and change reopen work. A particular run preserves an ordered revision history. A finding on revision 3 cannot be presented as evidence that revision 4 was assessed.

### 13.5 Shared semantics and handoff contract

Use stable records and pointers to their owning artifacts. Do not generate a new value model, need register or contract copy at each invocation. The framework is a logical account that can be carried by existing prose, schemas, examples and tests.

Each material handoff preserves:

- Subject and claim identifiers, exact revisions and authoritative source locations.
- The requested operation and intended reliance, with scope and relevant scale coordinates.
- Claim kind and status: hypothesis, proposal, adopted obligation, observation or bounded assurance.
- Applicable assumptions, unknowns, permissions and acceptance authority.
- Evidence actually inspected, method, result, limits and source dependence.
- Output correspondence: what was added, retained, changed or rejected, and why.
- Unresolved findings, next eligible action and stopping/reopening condition.

These fields are recoverable information, not a mandatory new transport schema. A small local change can carry them in a few sentences and links. Machine validation may later check identity, references and admitted shapes; it cannot decide semantic truth, legitimate authority or usefulness merely by validating a record.

| Concern | Proposed authoritative home | Consumers and non-duplication rule |
| --- | --- | --- |
| Use value, needs, offered value, experience and contribution semantics | Existing `user-value` and its references | Specification procedures reference the value model and preserve its evidence limits |
| Specification record, profile selection, obligation and lifecycle vocabulary | Shared references owned with proposed `specify` | Seam and assessment skills read the same definitions; no independent copies |
| Producer/consumer, transformation and composition method | Proposed `specify-connection` | Authoring calls it only for material connections; no requirement to model every trivial edge |
| Assessment procedure and scoped readiness | Proposed `assess-specification` | It consumes evidence; it does not own every specialised evaluation instrument |
| Frames, scale bridges, crosswalks and epistemic synthesis | Existing Parallax capabilities | Reuse their contracts for material inferential questions; do not clone them into specification skills |
| Work sequencing and repository plan ratification | Existing `plan` and plan estate | Specifications are inputs, not alternative delivery plans |
| Actual interface definitions, code contracts and generated representations | Their existing domain source and generation mechanism | A narrative specification links to that source; it does not become a second schema authority |

An operational seam is not identical to a Parallax Bridge Claim. A seam may concern preserving units across a transformation at the same scale. A Bridge Claim justifies an inference between scales, such as component evidence to workflow reliability. A Crosswalk Claim concerns translation between conceptual bases. One consequential connection may need all three records, but their questions remain distinct and shared facts should be referenced.

### 13.6 Proposed packaging and integration

The canonical family lives under `.agent/skills/specification/`, grouped by concern (delivered on this PR on 27 September 2026; the paragraph below records the layout as proposed on 26 September):

- `specify/SKILL-CANONICAL.md`: admission, create/repair/revise procedure, completion and handoff, with `references/specification-record.md`, `profiles.md`, `lifecycle-and-change.md` and `assurance.md`.
- `specify-connection/SKILL-CANONICAL.md` with `references/connection-method.md`.
- `assess-specification/SKILL-CANONICAL.md` with `references/assessment-criteria.md`.
- `evals/evals.json` and `evals/trigger-validation.json` beside each skill (normal, adverse or boundary and negative-routing cases; queries that fire and queries that stay silent), and beside `planning/plan/` (its routing, and the cross-skill exercise of Appendix E condition 3 as case 4). Retained evidence of each run under the skill's `evals/results/<started-at>/`, produced by `agent-tools skill-evals` (`agent-tools/README.md` §`skill-evals`).

As proposed on 26 September, the layout was: `specify` with its references, `specify-connection` and its connection-method reference, `assess-specification` and its assessment criteria reference, and evaluation fixtures beside the responsible skill. The whole research report should not be copied into every skill body. Keep essential procedure short and load a profile only when its trigger applies. Shared-reference paths and compatible versions need checking by the repository's existing mechanisms before installation.

The initial audience is the OCE Practice corpus: agents and people building systems. Pedagogical skills facing Student Support Experiments belong to their own product/curriculum audience and would not be created by this landing. General applicability concerns the method's subjects; it does not erase the repository's audience and distribution boundaries.

Use the existing capability-landing and adapter-generation routes to deliver the ratified scope. Generate platform projections from canonicals; do not hand-write them to make a listing look complete. Update discovery and narrowly applicable routes from `user-value` and `plan` only after the target capability exists. Merely discussing the proposal in a report must not produce broken live skill links, permission entries or new mandatory rules.

No graph database, universal machine schema, new validator, background monitor or custom orchestration engine is required initially. Add a script only for a repeated deterministic operation with a real consumer. Preserve the host's execution restrictions and repository gates.

### 13.7 Walkthroughs that discriminate the shape

These are author walkthroughs, not executions of installed specification skills.

| Case | Route and minimum useful artifact | Error the architecture must prevent |
| --- | --- | --- |
| Heap parent-index contract, §11A | Direct `specify` or an existing API comment plus engineering checks; caller-membership seam can be a sentence | A mandatory human journey or fabricated impact chain |
| Stable priority queue with unresolved consumer purpose | `user-value` identifies scheduler usefulness; `specify` defines ordering; seam analysis distinguishes scheduler starvation | Stable tie ordering promoted to fairness |
| Schema-valid API whose subject mapping fails | `specify-connection` first; revise the mapping owner's contract; assess actual consumer boundary | Reopening every upstream value definition or blaming the API by default |
| Student Support Experiments submission with lost acknowledgement | State the receiver, revision, retry and uncertain-result obligations; retain educator authority and learning-evidence limits | “Sent” becomes “received”, or supported correctness becomes learning |
| Public repair report | Value/experience view plus provider handoff and operational commitments | Forwarded ticket treated as accepted responsibility or completed repair |
| Data pipeline with late corrections | Revise mode traces semantic change to downstream views and evidence; reassess affected use only | Same schema mistaken for unchanged meaning, or all unrelated claims reopened |
| Open-ended research | Specify resources, conduct, observations and warranted closure; permit a defensible negative conclusion | Success requires a positive finding, or uncertainty licenses endless work |
| Conflicting obligations from two organisations | Identify scopes and authority; preserve conflict and the affected blocked reliance | Inventing a universal altitude or document-precedence rule |

The small cases can bypass the family when existing artifacts suffice. The larger cases select several operations because their reliance actually crosses boundaries. That variation is a design requirement, not an exception to completeness.

### 13.8 Evaluation and required implementation sequence

The deciding claim is that the skill procedures improve useful precision and defect discovery without disproportionate authoring or maintenance cost. The document does not establish that claim.

Compare the smallest candidate with existing OCE skills and the framework reference as a baseline. Fix task prompts, material acceptance criteria and time/effort recording before inspecting outputs. Preserve all results, including cases where the baseline wins. Evaluators should receive raw tasks and artifacts rather than the author's diagnosis; separate contexts reduce anchoring but do not create independent real-world evidence.

The evaluation set should include: a valid tiny specification; deliberately incomplete obligations; hidden semantic loss; infeasible caller assumptions; circular guarantees; unauthorised delegation; stale evidence after change; an honestly unresolved research outcome; and negative triggers for settled implementation. Add domain-specific expectations independently of the template. A rubric that rewards presence of the template's headings only tests mimicry.

Assess material omissions and false assurances, consumer interpretation, appropriate routing, unnecessary duplication, time/effort, and whether revision reaches affected consumers. Treat invented evidence or authority as substantive failures even if the prose is persuasive. Compare results by case and error type before aggregating. No universal pass percentage or sample size is asserted.

The implementation sequence for completing the ratified PR scope is:

1. Implement the smallest `specify` procedure and shared references; reuse `user-value` inputs. Evaluate a tiny unit, a cross-boundary service and an exploratory project against the baseline.
2. Implement `specify-connection` as its own skill, reusing shared semantics. Test standalone seam tasks and composition failures, including individually valid endpoints.
3. Implement `assess-specification` with independently prepared counterexamples and a valid-small-case control. Test its refusal to overclaim readiness or audit independence.
4. Exercise a material revision across at least two connected artifacts; check identity, evidence freshness and compatibility propagation.
5. Generate adapters, verify discovery and routing, execute relevant repository checks, and record exact evaluated skill versions before adoption.

All three specification skills must be implemented properly and evaluated within PR #250; their implementation is an acceptance prerequisite. Complete the existing `user-value` work and evaluate the changed `plan` routing as well. This ratification update records the delivery requirement; it does not claim implementation or evaluation has already occurred. Appendix E defines the required completion evidence.

Reopen the design if users cannot select the right entry, handoffs lose claim status, assessment becomes ceremonial, semantic changes escape propagation, or a simpler baseline performs as well with lower effort. Report that evidence to the owner; do not silently reduce the ratified delivery scope. Utility remains a question for actual usage.

## 14. Parallax exploration and revisions to D2

### Charter and method

Inquiry `SPEC-FRAMEWORK-2026-09-26`, revision 1, concerns a general specification framework for experienced service and engineering practitioners. The authority is to explore, define and document a proposal. The intended reliance is discussion and bounded application design, not deployment or certification. Inputs are the prior GDS findings, selected current OCE source files and the two current Student Support Experiments reports listed above.

The initial candidate D0 was captured before the Parallax synthesis. It proposed a common record, profiles, typed connections and a simple authoring workflow. Its weaknesses were deliberately left open: an overloaded owner field, evidence-link ambiguity, graph overhead, incomplete composition and unclear treatment of changing obligations. The retained D0 summary in Appendix A preserves that earlier shape.

Selected depth: **standard, emulated-reduced**, with sequential frame passes, synthesis and same-context self-review. This is sufficient for a reversible framework proposal. The passes share an author, context and sources; they were not independent investigations or stakeholder testimony. A deep independent-assurance claim would be unjustified.

Applied domain profiles: investigation (source/authority boundaries), software engineering (behaviour and composition), digital product/service (experience and public value), and science (measurement, causal claims and uncertainty). The evidence plan was bounded: reuse the prior official-source investigation, check selected primary material and current OCE files, examine the existing Student Support Experiments application, challenge D0 with contrasting frames, and apply the revised framework to six contrasting subjects. No field evidence was manufactured to fill gaps.

A first synthesis D1 was captured, then expanded to D2 after the owner's scope clarification. D2 adds contrasting non-education cases and an explicit discovery counterframe. The completed scope is six author walkthroughs across engineering, integration, education, public service, data and research. They test conceptual fit, not operational effectiveness.

### Frame cards

Each row is a deliberately distinct basis. All belong to the inquiry above and have `artifact_revision: 1`. `method_pass_id` is the P identifier; all have `execution_mode: emulated-reduced` and shared-source dependence. Scale regions are identified by the concrete extents in the table.

| Basis / pass / profiles | Question, constructs and boundary | Foregrounded value and admitted evidence | Blind spot / discriminating observation |
| --- | --- | --- | --- |
| B1 obligation / P1 / engineering | What may a consumer rely on? Units are claims and boundary obligations, from an operation to a composition | Precision; counterexamples, conformance checks and conditional arguments | Can miss whether the obligation is useful. A perfectly conforming but unusable service would defeat sufficiency |
| B2 experience / P2 / service | Can a person accomplish what matters? Units are journeys, barriers and recovery across encounters | Dignity, access, meaningful choice; participant accounts and observed activity | Can underspecify machine behaviour. A clear journey with ambiguous duplicate handling exposes its limit |
| B3 meaning / P3 / engineering, investigation | What survives translation? Units are definitions, assertions and projections across representations | Interpretability and fidelity; fixtures, provenance and domain judgements | Can assume stable contested meanings. Valid output that changes an assisted attempt into mastery defeats adequacy |
| B4 authority / P4 / service, investigation | Who can impose, alter or challenge a commitment? Units are powers, duties and affected parties across organisations | Legitimacy and redress; governing decisions and actual operating responsibilities | Can become abstract governance. An accepted complaint with no receiving person exposes a missing operational bridge |
| B5 adaptation / P5 / engineering, service | Can commitments remain useful through change? Units are versions, incidents, migrations and retirement over years | Continuity, affordability, exit; change exercises and operational evidence | Can rationalise drift. Shape-compatible semantic breakage defeats version-only compatibility |
| B6 epistemic / P6 / science, investigation | What justifies reliance? Units are claims, instruments, observations and inferences across horizons/populations | Honest uncertainty; proofs, tests and empirical designs appropriate to claims | Can over-document uncertainty. A recorded caveat that changes no decision or behaviour is weak protection |
| B7 minimum-artifact counterframe / P7 / engineering, service | Can existing prose, schemas and tests do this more cheaply? Unit is a change or consumer question at team scale | Usability and maintenance cost; timed application and defect discovery | Can conceal recurring seams. If a small linked account finds no additional material omissions, a richer representation is unwarranted |
| B8 discovery counterframe / P10 / science, service | Does specification prematurely freeze what must be discovered? Units are questions, experiments and evolving interpretations over a bounded project | Honest negative results, generative freedom and learning; discriminating observations and useful handoffs | Can excuse vagueness or endless exploration. A project unable to reach a legitimate negative conclusion exposes over-prescription; one unable to stop exposes under-specification |

### Material scale bridges

All bridge records are revision 1, produced by synthesis pass P8 from B1–B7 and extended by the breadth pass P10/B8. Their evidence is documentary or hypothetical unless stated; none is a completed empirical validation.

| Bridge | Source → target and mechanism | Assumptions, loss and evidence boundary | Failure / reopen condition |
| --- | --- | --- | --- |
| BR1 | Algorithm invariant → composed system guarantee through compatible contracts and interaction rules | Satisfiable assumptions; shared operating model; integration behaviour accounted for. Local detail may be abstracted, obligations may not. Conditional engineering argument only | Shared resource, concurrency or circular assumptions defeat the conclusion |
| BR2 | API result → useful human interaction through a consumer/host | Host interprets meaning and honours conditions; API evidence loses human context. Requires consumer and experience evidence beyond boundary tests | Host drops qualifiers, cannot enforce required behaviour or users cannot recover |
| BR3 | Successful supported activity → lasting learning through an educational mechanism | Transfer/retention constructs, assistance and later conditions valid; immediate observations omit later change. No new educational evidence supplied | Later unaided/context-varied performance fails to support the claimed learning |
| BR4 | Individual benefit → population/public benefit through reach and distribution | Inclusion, uptake, burden, subgroup effects and costs; aggregation loses heterogeneity. Population evidence absent | Excluded groups, displacement or inequitable effects reverse apparent benefit |
| BR5 | Adopted specification → operational practice through implementation, resources and governance | Responsible parties can and do fulfil allocated duties; a document omits much enacted work. Requires observation of actual use | No support capacity, unadopted migration or conflicting incentives |
| BR6 | Documentary framework coherence → useful specification practice through clearer authoring/review | Users can apply it at tolerable cost and find material defects; author walkthroughs have narrow transferability | Trials add bookkeeping without better interpretation or defect detection |

### Crosswalks between decompositions

| Crosswalk / bases | Mapping and what survives | What does not survive automatically | Status |
| --- | --- | --- | --- |
| CW1 / B2→B1 | Journey situations yield candidate behavioural obligations and examples | Feelings, dignity, tacit work and variation do not reduce to a state graph | Partial, many-to-many |
| CW2 / B3→B1 | Domain definitions constrain schema fields, relation types and result variants | Full contextual meaning and all semantic rules are not expressed by syntax | Partial, requires companion semantics |
| CW3 / B4→B1 | Legitimate powers can be represented in permission/enforcement rules | A technical token does not establish the legitimacy or full scope of its grant | Asymmetric; implementation evidence is insufficient for authority |
| CW4 / B1→B6 | An executable result bears on a specified conformance claim | It supplies neither specification adequacy nor causal impact on its own | Partial and explicitly bounded |
| CW5 / B5↔B3 | Versioned mappings make changed representation and meaning traceable | Successful migration of records does not guarantee equivalent consumer decisions | Conditional, potentially lossy |
| CW6 / B7↔all | A small set of linked artifacts can express the common questions | A checklist count does not measure preserved meaning or useful coverage | Proposed equivalence to test in actual use |
| CW7 / B8→B1 | An inquiry's constraints and closure criteria yield obligations on conduct, evidence and handoff | An unknown answer cannot become a guaranteed beneficial product outcome | Partial; a favourable conclusion is deliberately not preserved as an obligation |

These translations cannot be composed into a universal proof of public value. A path through the graph is not a valid inference merely because all its nodes exist.

### Conflict ledger and concrete revisions

| Conflict | Kind / shared dependence | D2 disposition | Residual uncertainty |
| --- | --- | --- | --- |
| One owner versus several legitimate authorities | Construct; D0 and Student Support Experiments share contract language | Split authority by action and subject; add challenge and revocation | Real institutional assignments need case-specific evidence |
| One canonical model versus plural domain meanings | Construct/value; common schema-first anchor | One canonical home per concern, with explicit lossy crosswalks | Which definitions warrant shared control remains contextual |
| Precise contract versus exploration/discretion | Value/method | Specify boundaries and obligations while preserving declared freedom and unknowns | Whether users experience freedom requires research |
| Local conformance versus whole-service success | Scale; shared examples | Separate four assurance questions; add explicit bridges and new composition obligations | End-to-end empirical evidence absent |
| Comprehensive graph versus useful small specification | Method/cost | Logical network; existing artifacts and sparse material links; no mandated platform | Framework overhead not measured |
| Stable commitment versus adaptive learning | Temporal/value | Preserve revisions and distinguish change in meaning, authority and evidence | Migration and operating costs unmeasured |
| Required tests versus possible circular oracles | Method/source dependence | Independent substantive expectations alongside generated conformance checks | Evaluator validity still needs its own evidence |
| Examples informed by Student Support Experiments versus general applicability | Scope/source dependence | D2 adds library, public-service, data and discovery cases; isolates educational constructs | All cases are author-selected; real adoption may reveal different omissions |
| Specified outcome versus legitimate discovery | Construct/value | D2 permits open substantive outcomes with defined conduct, learning and handoff contracts | Enabling creativity without losing discipline requires evaluation in use |

The outcome is a changed framework, not agreement by majority of frames. B7 and B8 remain live counterframes: if the common questions can be handled more simply without losing material distinctions, the framework should shrink; if it prevents legitimate discovery, the imposed commitments should be reconsidered.

## 15. D2 review, limitations and return to practice

Review target: D2, for use as a proposal and as a source for bounded specification exercises. Pass P9 applied the Parallax audit contract as same-context self-review. It inspected source attribution, proposal/adoption boundaries, distinction of kinds and scales, material bridges/crosswalks, representative cases and the cost counterframe. No independent auditor, user or domain expert participated.

| Finding | Consequence / severity / confidence | Disposition and cheapest remaining check |
| --- | --- | --- |
| “Comprehensive” could imply exhaustive modelling | Excessive burden / high / high | Resolved in design: bounded coverage and profile triggers. Measure authoring/review effort in use |
| A shared owner could hide contested authority | Invalid commitments / high / high | Resolved in design: separate authority roles. Check a real cross-organisation seam |
| Passing examples might be mistaken for demonstrated framework utility | False assurance / high / high | Resolved in reporting: walkthroughs labelled; empirical benefit remains open |
| API/code generation can share a mistaken source with tests | Undetected conceptual defect / high / high | Independent domain expectations required; evaluate the evaluator on seeded faults |
| Lifecycle needs both correction and data-policy limits | Harmful propagation or excessive retention / high / medium | Explicit distinction added; case-specific governance remains open |
| OCE skill coverage inspected selectively | Overstated gap / medium / high | Gap claim bounded to canonical skill inventory and inspected files; further repository design may reveal reusable detail |

Audit disposition: **qualified**. Overall epistemic status: **provisional**. Documentary coherence is sufficient for discussion; usable precision, maintenance cost, inter-author agreement and defect detection have not been measured. Do not present the proposal as an independently validated method.

The proposed next validation is finite and does not require building a specification platform. An adopting team would apply the framework to four cases across at least two domains: a small engineering unit, a real interface/semantic seam, a service journey and an exploratory project, comparing against existing artifacts. At least one service must be outside education, and the project must permit a legitimate negative outcome. This is a recommendation, not an activated task or approval to involve learners.

| Observation contract | Proposed arrangement |
| --- | --- |
| Owner | Framework adopter nominates an accountable maintainer and reviewers; none assigned by this report |
| Baseline | Existing specifications and known misunderstandings/defects for the selected cases |
| Intervention | Common record, triggered profiles and only material connection contracts |
| Horizon/cadence | Assess once at initial authoring and again at the first substantive change to each selected case |
| Observations | Material ambiguities found, distinct-author interpretation, time to author/review, correction propagation and unnecessary duplication |
| Hard failure | Any critical authority/meaning loss goes unrepresented, or a proposed claim is presented as demonstrated |
| Revision trigger | Two readers derive materially conflicting obligations; tiny-unit paperwork overwhelms its content; or a change leaves conflicting canonical definitions |
| Value test | Compared with baseline, readers can answer consequential questions and find defects with acceptable effort; adopter must set its effort budget before the trial |
| Consequence/monitoring scales | Individual records and seams observed; team maintenance benefit assessed. No inference of organisation-wide or public benefit from these cases |
| Exit | Retain, simplify, split or reject elements based on observed usefulness; do not expand to a universal tool by default |

Practice learning signal `SPEC-LEARN-01`: the expected reusable structure was a common contract template; the exploration instead required a small common record with distinct claim kinds, authority roles, profiles and connection contracts. Confidence is high in the identified category risks, provisional in this particular remedy. Suggested destination is a future OCE specification/value-skill design and evaluation record. Recurrence across cases and cost reduction remain untested. No skill or repository memory was edited.

## Appendix A. Initial draft and exploration provenance

The initial D0 candidate, captured before Parallax synthesis, proposed: a common record of identity/purpose/boundary/owner/claims/assumptions/evidence/change; profiles for service experience, domain data, behaviour/interfaces, software units, operations and assurance; typed relations for motivation, refinement, composition, transformation, authority, evidence and supersession; and an authoring-to-maintenance workflow. It left overloaded ownership, graph cost, evidence ambiguity, composition and changing obligations unresolved. D2 above replaces that candidate; the initial summary remains historical.

Metacognition first challenged the inherited assumption that a more formal specification means a larger document or a more mathematical language. Concept exploration distinguished kinds of subject from degrees of detail and identified the cross-boundary problem. A short bounded free-play pass used the available GDS, OCE and Student Support Experiments material without a target within that pass: a musical score suggested legitimate varied realisations; a map legend suggested declared omissions; a promise suggested recipient, conditions and remedy; an experimental protocol suggested specifying how uncertainty can be reduced. These are associations, not findings. The digital-twin analogy was discarded because it suggested a complete replica and false completeness. Reasoning retained only concepts with a concrete role and a possible failure test.

The four concept-exploration movements changed the proposal as follows: raw observations showed disconnected artifacts; framing identified the interpretation/reliance gap; reconsidering solutions rejected one master template or universal ontology; synthesis proposed the common record and profiles that Parallax then challenged. The work stopped after incorporation and bounded review, leaving field validation explicit.

## Appendix B. Input identities and source boundaries

All inputs belong to inquiry revision 1. P0 denotes grounding, P1–P7 the initial frame passes, P8 synthesis, P10 the added breadth/discovery pass and P9 the final review. Input IDs below make dependence visible (SSE abbreviates Student Support Experiments); they do not confer independent authority. The OCE file links in §13 and the skill paths below resolve against the pinned revision.

| Input ID / revision | Basis, scale and profiles | Use and limitation |
| --- | --- | --- |
| IN-GDS / pages checked 25–26 September 2026 | Service design and API practice; service/interface scales; investigation, service, engineering | Original-source guidance supports specific practices, not the proposed combined framework. Related official pages are institutionally dependent |
| IN-OCE / `e6cf8ee4c9ac33d00884436e8d08767fc2b36c06` | Epistemic methods and local engineering doctrine; inquiry/component/interface scales; all selected profiles | Methods and inspected mechanisms, not evidence of framework efficacy |
| IN-SSE-CONTRACT / document revision 2, Library content version 1 | Bounded value, semantics and authority; service through engineering; service, engineering, investigation | Read in full. Existing conceptual design supplies inherited distinctions, not an independent validation |
| IN-SSE-JOURNEY / document revision 1, Library version not supplied | Hypothetical journeys and stories; interaction/session/later learning scales; service, science | Read in full at the start-of-inquiry snapshot. Concurrent revision now points to the new needs model; this report does not re-audit the revised story collection |
| IN-PROJECT / summary revision 4, index revision 5, knowledge brief revision 3 | Project authority and reader needs; project/institutional context; investigation | Navigation/authority constraints only; index is not substantive evidence |
| IN-ISO / public abstract, accessed 26 September 2026 | Architecture description and viewpoints; system scale; engineering | Orientation only; full standard not read |
| IN-NASA / handbook §2.4, accessed 26 September 2026 | Requirements conformance and intended-use suitability; system/use context; engineering | Distinction only; NASA process not imported |
| D0 / initial candidate, revision 1 | Proposed common contract model; three subject scales; all selected profiles | Design input challenged by P1–P7; not empirical evidence |

OCE branch `engraph` was resolved for this inquiry. Planning, metacognition, its directive, reasoning and proportionality had already been read in the preceding conversation; their blob hashes at the new pin matched the previously read versions. Free play, concept exploration, Parallax orchestration/domain profiles, framing and its framing-method reference, synthesis and its synthesis-method reference, audit and its audit-protocol/minimal-contract references were read for this turn. The schema-first MCP directive, graph skill, ground-truth design/evaluation and TSDoc skill were inspected for substantive reuse. Reading a skill for reuse is not a claim that its implementation workflow or tests were executed.

Additional pinned Parallax method routes: [framing](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/cognition/parallax-frame/SKILL-CANONICAL.md), [synthesis](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/cognition/parallax-synthesise/SKILL-CANONICAL.md), [audit](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/skills/cognition/parallax-audit/SKILL-CANONICAL.md), [metacognition directive](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/e6cf8ee4c9ac33d00884436e8d08767fc2b36c06/.agent/directives/metacognition.md).

The load-bearing support relationships are: IN-GDS → specified source practices; IN-OCE → method and local engineering mechanisms; IN-SSE-CONTRACT/JOURNEY → application premises and counterexamples; IN-ISO/NASA → bounded conceptual distinctions; all plus D0 and P1–P10 → D2 as an authorial synthesis. The non-education cases are author-designed counterexamples, not field observations. No source directly establishes that D2 improves delivery. Source counts and repeated interpretations must not be treated as corroboration for that untested claim.

### Concurrent-source reconciliation — document revision 2

The index changed while this report was being saved. Its new service-design reference was preserved, and the needs/value model was read to reconcile the integration proposal. The new source is the project's service-needs-and-value-model document, revision 1, inspected through its substantive sections (lines 1–130); it is one further dependent Student Support Experiments design input, not independent evidence. The original journey snapshot remains the source of the examples. This reconciliation changes the skill-gap disposition, not the general framework or the authority of Student Support Experiments. It neither resumes the other session's repository work nor adopts an unpublished skill.

## Appendix C. A compact specification starter

Use this as a prompt, not a compulsory file format. Replace inherited context with links to its authoritative home.

```text
ID / revision / subject / status:
Purpose, consumers and affected parties:
Boundary and relevant operating context:

Claims:
  - Kind: obligation | hypothesis | observation | design choice
    Statement, conditions and allowed variation:
    Authority and responsible party:
    Failure / uncertainty / recovery:
    Evidence method, current result and scope:

Applicable profiles and material additional detail:
Connections and obligations at their seams:
Unknowns and their consequence for this intended use:
Compatibility, correction and revision triggers:
Readiness for the named use, reviewer and limitations:
```

A completed instance should be understandable without this conversation. If a field adds no useful distinction for the case, merge or omit it with the relevant context; if a missing distinction could change permitted reliance, add it even when it falls outside this starter.

## Appendix D. Skill-expression exploration — inquiry revision 2

**Identity and authority.** Inquiry `SPEC-FRAMEWORK-2026-09-26`, revision 2; artifact `SPEC-FRAMEWORK-D3`, revision 3; method passes S0–S5. The owner commissioned exploration, document revision, addition to the same PR as the renamed value work, and a subsequent report about the PR's relationships. That authorises these documents and PR updates, not adoption of the framework or installation of the proposed specification skills.

**Inputs.** S0 used D2 document revision 2 and all ten changed paths in PR #250 at `81d61b420404bb2626850779003d372ec6944d4c`: the canonical `user-value` method, its three references, two evaluation files, planning and discovery changes, permission-pair change, and method/handoff review. The earlier source investigation remains dated; no fresh GDS standards search was required for this skill-design revision. The planning/cognitive skill sources were inspected at that PR revision. Their use here is manual application of canonical instructions, not native installed-skill execution.

### Exploration record

S1 applied generative metacognition: the inherited four candidate responsibilities were hypotheses, not an approved package structure. The critical correction was to distinguish the framework's subject matter from reusable agent operations. Proportionality bounded the work to an implementation-ready design proposal and its PR relationships, leaving code generation and field evaluation outside this commission.

A bounded free-play pass over the existing records and skill materials produced two retained associations: a workshop's shared measuring instruments suggested shared definitions used by different operations; a relay handoff suggested that identity and uncertainty must travel with the artifact. Both are associations, not support for the design. A “compiler for every intention” association was discarded because it would imply that human purposes translate deterministically into complete executable contracts.

S2 used concept exploration's four movements: inspect overlapping value/specification material; frame the gap as reliable interpretation and handoff for authors/reviewers; reopen the initial one-skill-per-responsibility assumption; propose a sparse procedural family with common references. Reasoning then compared reference-only, monolithic, profile-based and operation-based options against precision, routing and maintenance. The resulting design changed: value modelling is reused, lifecycle becomes an authoring mode, and independent assessment is not inferred from a separate skill.

S3 applied Parallax framing at **standard depth, emulated-reduced**. S4 synthesised the frames below; S5 applied same-context challenge. These are sequential perspectives from one author with shared context and sources, not protected independent evidence or participant research. A separate document review, if performed, has its own scope and cannot retroactively make these passes independent.

### Frames, scales and discriminators

| Basis / profiles | Unit, boundary and foregrounded concern | Evidence and action implied | Blind spot / discriminator |
| --- | --- | --- | --- |
| SB1 procedural / engineering | One task invocation and artifact transition; reliable completion | Raw task/output comparison; define triggers, inputs and stop conditions | Can overfit a workflow; a direct seam task requiring full authoring disproves good routing |
| SB2 semantic / investigation, engineering | Claim identity across tools and revisions; preserved meaning and uncertainty | Compare input/output assertions and versions; establish shared semantics | Can become a universal ontology; a tiny task needing many invented entities defeats proportionality |
| SB3 consumer / service, engineering | Person or system relying on the result; usefulness and burden | Observe independent interpretation and use; keep user-value as the value-definition owner | Fluent usefulness stories may hide untestable obligations; a clear rationale with incompatible guarantees exposes the gap |
| SB4 institutional / service, investigation | Authority to define, approve, execute and challenge across parties | Governing decisions and permissions; keep review distinct from acceptance | Can over-bureaucratise routine work; an invented approval for a reversible edit is a failure |
| SB5 lifecycle / engineering | Changed dependency, evidence and consumer over time | Revision exercises and drift observations; make change propagation explicit | Can demand universal synchrony; require only affected reliance to reopen |
| SB6 minimal-method counterframe / engineering | Existing artifacts and skills at one task/team scale; lower total burden | Compare against current workflow; shrink or merge skills if no useful gain | Can hide repeated mistakes; improved detection of seeded semantic failures favours the proposed family |

Technical granularity, organisational reach, time horizon, population, knowledge status and invocation depth remain separate coordinates. Observations here concern document content and author walkthroughs. The proposed mechanism is better routing and preservation of commitments. Intervention would be installing and using procedures. Consequences include downstream interpretation and maintenance; monitoring must examine actual outputs and consumer use, not just whether a skill triggered.

### Bridges and crosswalks

| ID | Relation, source and target | Warrant, limits and defeater |
| --- | --- | --- |
| SBR1 | Shared definitions at record scale → consistent interpretation across skill outputs | Requires exact reference/version use and preservation of claim status. Documentary alignment supports feasibility, not behavioural compliance. Information lost includes tacit context. Conflicting interpretations of the same claim defeat the bridge |
| SBR2 | Plausible procedure in a walkthrough → useful execution on unfamiliar tasks | Requires successful routing and lower material error at acceptable effort. No executed candidate specification skills supply evidence. Author-selected examples omit real variation. Baseline equivalence at lower cost defeats the proposed split |
| SBR3 | Complete adapter/discovery plumbing → capability available to a host | Requires generation, permissions where applicable and host discovery. Authored canonical files alone are insufficient. A missing adapter or false trigger defeats availability; availability still does not establish effectiveness |
| SCW1 | Framework profiles → procedural skill resources | Partial many-to-many mapping preserves relevant concerns; it does not map each profile to a separate skill |
| SCW2 | User-value commitments → specification obligations | Partial/asymmetric mapping preserves selected usefulness, conditions and evidence state; it adds precision without converting hypotheses into guarantees or uniquely choosing implementation |
| SCW3 | Readiness assessment → implementation plan | Conditional mapping identifies actionable work and proof obligations. It does not carry adoption, permissions, resources or release authority automatically |
| SCW4 | Changed-file inventory → conceptual relationships | A file may carry several concepts and a concept span several files. Paths support complete scope accounting, not proof of conceptual completeness |

All records above belong to inquiry revision 2 and method passes S3/S4, with design-proposal status. Their source and target regions are stated in the table; empirical support for procedural effectiveness is absent. Scope is specification work across the examples in §13.7, not a universal theory of all knowledge work.

### Challenge, status and return

The main conflicts were duplication versus reuse, small skills versus handoff cost, assessment versus authority, and broad applicability versus over-generalisation. Section 13 resolves the first three structurally while preserving their evaluation risks. The fourth remains a claim for use trials. A coherent vocabulary cannot establish transferability.

S5 disposition: **qualified**; epistemic status: **provisional**. The design is sufficiently explicit to implement and evaluate in a later authorised pass. It is not evidence that three installed skills are optimal or effective. Specialist runtime checks, adapter generation and field use were not performed here.

For a future adopter, the bounded return is: choose a named evaluator and effort budget; compare the initial authoring candidate with the existing-workflow baseline on the three contrasting cases in §13.8; retain outputs and material-error dispositions; then retain, simplify or reject the shape. The proposed evaluator role is unassigned, not a new commitment imposed on another person. Any invented authority/evidence, unrepresented critical semantic loss, or incompatible interpretation of a core obligation requires revision before consequential reliance. Repeated rerouting or baseline-equivalent quality with higher effort requires simplifying the family.

Practice signal `SPEC-LEARN-02`: the expected gap was several new specification responsibilities; direct inspection showed that renamed `user-value` already owns much of the purpose/experience relationship method. The revision therefore reuses it and concentrates new procedures on obligations, connections and assessment. This is one observed overlap and a provisional design response, not a measured recurrent failure. Its durable carrier is this proposal and the companion PR relationship report; no standing skill or doctrine is silently rewritten.

## Appendix E. Owner ratification and PR acceptance — 26 September 2026

The owner's subsequent instruction was to ratify the skills, require their proper creation as part of this PR's acceptance, and require evals for all skills in the PR. This supersedes the earlier document-only commission and optional/future implementation wording in inquiry revision 2. It authorises the delivery scope below, not merge, deployment, universal adoption of the framework, or a claim that evaluation has passed.

**Acceptance scope:** complete `user-value`, `specify`, `specify-connection` and `assess-specification`; evaluate the materially changed `plan` routing too. Every other skill added or materially changed before merge inherits the same evaluation requirement. Generated host copies are projections of these canonical skills, not separate conceptual skills.

| Skill | Required capability and discriminating evaluation coverage |
| --- | --- |
| `user-value` | Human and technical consumers; conditional guarantees; composition; optional journeys; settled-work negative routing. Execute the broadened revision's seven cases and ten trigger examples, extending them where gaps emerge |
| `specify` | Create, repair and revise bounded obligations; tiny engineering unit, cross-boundary service and exploratory project; preserve unknowns, identifiers, evidence and authority |
| `specify-connection` | Endpoint assumptions/guarantees, semantic loss, incompatible composition, circular reliance, failure/recovery and change propagation; include locally valid but jointly failing endpoints |
| `assess-specification` | Assess an exact revision for named reliance; valid-small-case control, seeded defects, stale/missing evidence and unauthorised readiness; distinguish assessment from acceptance and independence |
| `plan` | Evaluate both conditional handoff for unresolved value/specification and direct implementation planning for settled work; preserve context and avoid mandatory ceremony |

**Proper creation requires all of the following before acceptance:**

1. Complete canonical skill files following the repository's skill conventions: actionable triggers, inputs, procedure, output contract, boundaries and stop conditions. Implement all three operations, with shared references for common semantics and working relative links. Preserve the broad subject range and the division of responsibility in §13.
2. Integrate discovery, conditional handoffs and permissions where required. Generate host adapters using the repository's normal generator; commit and check the complete output. Do not hand-write projections or add broken live routes to absent capabilities.
3. Give every in-scope canonical skill a discoverable `evals/evals.json` and any necessary input fixtures. Include normal, adverse/boundary and negative-routing cases, with expected outcomes and substantive assertions. Include a cross-skill exercise through value, specification, connection, assessment and planning that checks preserved claim status and a material revision.
4. Execute and retain evaluation evidence for the actual skill versions delivered. Record the skill/reference versions, model/runtime configuration, prompts, fixtures, output artifacts, assertion-level results with evidence, and a per-skill result/limitation summary. Keep inputs suitable for repository publication. An authored fixture, author's walkthrough, old-version exercise or CI green result alone cannot close this criterion.
5. Apply the evaluation method below, review observed failures, improve general instructions and rerun affected cases after material edits. Require all declared critical semantic/authority assertions to pass; unresolved substantive failures block acceptance. Record case coverage and quality/cost trade-offs rather than substituting an arbitrary aggregate threshold. Name the evaluator and human output reviewer when execution begins; unperformed review remains pending.
6. Reconcile the framework, relationship report and PR description with the implemented estate; retain current evidence links. Required repository checks must pass on the final PR head. Keep the PR draft until implementation, evaluation, review and final-head validation are complete.

**Evaluation method.** Follow [Agent Skills: evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills) (accessed 26 September 2026): use realistic varied cases, clean contexts, a with-skill comparison against no skill or an earlier version, retained outputs, evidence-backed assertions, timing/token data where available, and human inspection of outputs alongside scores. Review case-level differences and cost, refine general instructions, and rerun. Document unavailable measurements rather than inventing them; report variability only when repeated runs support it. Early exploratory assertions may be refined transparently before the acceptance run, without silently weakening critical expectations to fit outputs.

The skill-specific coverage, critical-failure rule, integration exercise and final-head requirement above are this PR's acceptance decisions. They are not represented as universal requirements imposed by the external guide. Evaluation can expose reasons to revisit the architecture, but changing this ratified scope requires an explicit owner decision.

**Observed state at ratification.** Head `52a377a25463019d848ffa3e910ffd94b74b5957` contains 20 changed paths: the prior 12 plus eight generated user-value files. All reported checks, including `run-quality-gates`, succeeded on that head. The three specification canonical skills and plan evals are absent; the broadened user-value fixtures have no executed evidence in the inspected PR. CI success establishes that head's repository checks, not fulfilment of these new acceptance criteria. Later commits require their own verdict.


### Appendix E.1 Delivery and evidence, 27 to 28 September 2026

Delivered on this PR after ratification, by the exchange seat under the owner's routing. The skills
were evaluated with `agent-tools skill-evals` (`agent-tools/README.md` §`skill-evals`), which runs a
skill's declared evals through `claude plugin eval` with a with-without ablation and retains, under
the skill's `evals/results/<started-at>/`, the runner's result per suite, every trace and final
answer (machine-local paths scrubbed), a manifest of the evaluated files by blob id, and
`reading.md`, the human read of every answer against the assertions beside the judge's votes.
Runner `claude` 2.1.283, agent model the runner's default, judge `sonnet`, one run per arm. The
evaluator is the instrument; the human output reviewer is the exchange seat (Myrtle turns Canopy,
an agent); the second read is the Director's or a Cricket's, recorded on the PR when given.

| Skill | Evidence | Result | Limitation |
| --- | --- | --- | --- |
| `user-value` | `planning/user-value/evals/results/2026-09-27T11-14-39Z` | Seven cases: every assertion held in both arms on the judge's read and the human read; the skill fired on five (case 3 correctly silent; case 4 not fired); ten of ten triggers as declared | The arms did not differ on the fixture's assertions: the baseline met them at one to two turns against five to seven with the skill, the skill's contribution being structure the assertions do not require. This is §13.8's reopen condition as observed on this fixture, reported to the owner here; the assertions were not tuned to it |
| `specify` | `specification/specify/evals/results/2026-09-27T11-16-44Z` (six cases and triggers) and `2026-09-27T11-31-29Z` (case 1 rerun after its assertion was restated) | Seven of seven with the skill on the human read (case 4 three of four: the seam not handed to `specify-connection`); on the judge's read seven of seven with, four of seven without; ten of ten triggers | Two earlier starts were stopped for fixture defects of the seat's (prompts naming material the empty workspace cannot hold; a rubric clause naming another skill's elements); case 6's record leaked the method's vocabulary into a funder-facing document |
| `specify-connection` | `specification/specify-connection/evals/results/2026-09-27T11-27-50Z` (six cases and triggers), `2026-09-27T11-41-26Z` (case 1 rerun on a prompt carrying the facts) and `2026-09-27T11-42-34Z` (case 4 rerun with `specify` carried), and `2026-09-28T12-11-44Z` (the full suite rerun with `specify` carried after the projector began carrying the shared references the canonical links under `references/specify/`, the manifest naming them by blob id) | Every assertion held with the skill on the human read across the three directories; judge four of six then six of six with, three of six without; ten of ten triggers; case 4's routing to `specify` observed; on the 28 September rerun the with-arm held every assertion on both reads, six of six on the judge, the without-arm three of six on the judge; ten of ten triggers; case 4 routed to `specify` again | The baseline reasons about seams as sharply on the idempotency, failover and latency cases; the skill's contribution is the seam-contract table, the conditions under which the reliance holds, the missing-evidence table and the obligations returned to each owner |
| `assess-specification` | `specification/assess-specification/evals/results/2026-09-27T11-29-08Z` (six cases and triggers), `2026-09-27T11-39-20Z` and `2026-09-27T11-44-17Z` (case 1, the valid-small-case control, rerun twice), `2026-09-27T11-40-05Z` (case 4 rerun with `specify` carried), and `2026-09-28T12-20-48Z` (the full suite rerun with `specify` carried after the projector began carrying the three shared references the canonical and its criteria reference link, the manifest naming them by blob id) | The authority assertions held wherever they applied (no readiness awarded, no independence claimed, no acceptance taken, no evidence invented); case 4's routing to `specify` observed; ten of ten triggers; on the 28 September rerun the with-arm held every assertion on both reads, six of six on the judge, the control passing in both arms; case 4 routed to `specify`; ten of ten triggers | The control failed in both arms on the first run: "ready with conditions" and a repair loop for a one-line function. The one substantive skill finding of the evaluation. The canonical's criteria step gained a proportionality clause and the prompt was restated; on the first rerun the with-arm passed the control on the human read ("Ready, no conditions", two notes) while the judge failed it on the fixture's "at most one minor note"; relaxed, the second rerun passed on both reads. The baseline also passed the control on the human read in both reruns |
| `plan` | `planning/plan/evals/results/2026-09-27T11-36-08Z` (four cases with the four other skills carried, and triggers) and `2026-09-27T11-45-06Z` (case 2 rerun on a self-contained prompt: pass in both arms), `2026-09-27T11-45-57Z` (case 3 rerun: fail in both arms; the with-arm described the route to the specification skills but did not take it, an inconsistent routing against the earlier attempt, reported and not cured that day) and `2026-09-27T11-47-11Z` (the trigger suite rerun with the silent grader anchored to the host skill: 6 of 6, the three silent cases routing to the carried sibling each prompt names), and, after the routing cure of 28 September (the canonical hands an unresolved contract, composition or readiness question to the skill that owns it, invoked before the dependent steps are scheduled), `2026-09-28T12-11-44Z` (the full suite with the four other skills carried), `2026-09-28T12-23-08Z` (case 3 alone, a second sample) and `2026-09-28T12-28-12Z` (the full suite again on the canonical as it stands at the head, after the documentation review's two wording edits) | The cross-skill exercise (condition 3) passed: all five skills invoked in order, claim status preserved through value, specification, connection, assessment and planning, and the material revision traced to every affected artefact (twelve turns, USD 0.41); the conditional handoff held; on the 28 September runs: 7 of 7 triggers in both full runs, the new silent case routing to `specify-connection`; case 3 routed the unresolved mapping to `specify-connection` and preserved the ownership dispute for its authority in all three samples, with the settled steps proceeding and the dependent steps waiting, one sample invoking the skill and two naming and scheduling it, the judge passing the last; cases 1, 2 and 4 held on the human read in both full runs, the judge failing case 2 (12:11Z) and case 1 (12:28Z) on form and case 4 in both on a final message that cites the earlier stages | Cases 2 and 3's prompts named settled material the workspace did not hold (the seat's defect), rerun; the three silent triggers were first counted as failures because a carried sibling took the request, which is the routing they exist to show; the plan estate is absent from the workspace, so every plan is a sketch in the reply |

Method notes, for the reader of the evidence. The judge and the human read disagree in several
places, recorded in each `reading.md` rather than reconciled: the judge is stricter than the human
read on the baseline (it failed without-arm answers that meet the assertions in substance on specify
cases 3 and 4, connection cases 1, 4 and 5, assess case 4) and reads expected outcomes literally
(the control's notes). Across the four skills the without-arm is the runner's default model with no
plugin and an empty workspace; on every suite it met most assertions in substance at a third to a
half of the cost. What the skills visibly add is the method's structure: claim status on every
element, unknowns each with a treatment and a holder, may-rely and must-not-rely lists, findings by
class with the reliance each blocks, dispositions with the acceptance authority and the reassessment
trigger, handoffs to the sibling skills, and revision correspondence. Whether that structure is
worth its cost in use is the question §13.8 leaves to actual usage; this evaluation supplies the
per-case evidence and does not decide it.

Concurrent intake reconciliation: the subsequent `f41ad8e789babdb0d772b4af88b7803ebe0dfd67` source edits and private-upstream citation are preserved in this revision. User-value changed again, so evals must cover that revised source and any later material changes. The reported lack of a fixture runner does not waive acceptance: execute through an appropriate harness or clean sessions and retain evidence.
