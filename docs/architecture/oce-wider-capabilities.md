# OCE capability continuity beyond the first instances

**Proposed architecture, 10 October 2026.** This complements the
[controlling architecture](oce-architecture.md), [configuration contracts](oce-configuration-contracts.md)
and [integrity specification](oce-integrity-and-castr.md). It preserves the wider
framework responsibilities while the first CF, public curriculum and MCP slices
are built. It neither claims those wider services exist nor makes their complete
delivery a gate on the first useful capability.

The source is the owner-commissioned programme-delivery exploration r1.2 (4 October),
its coverage register r1.1 (updated 6 October), and the adopted
`education-mastery-approach.md` r2 (6 October). The exploration's B01–B16 are
construction areas, not sixteen packages, teams or a mandatory sequence. The
earlier N1–N5 gated agenda is superseded in that source. Proposed research remains
proposed; the later mastery direction is adopted owner direction.

## Educational purpose and authority

Classroom systems contribute to teaching under teachers' authority, supporting
mastery and using Bayesian modelling of uncertainty in belief, knowledge,
learning, learners and teaching as a foundation. The owner applies that direction
across the projects with no current exceptions. Exact estimators, thresholds,
state location, retention and implementations remain design choices; the direction
does not establish the effectiveness of a particular model or educational method.

Progression through taught learning follows achieved mastery, with sufficient
support and accountable judgement. Exact criteria, estimators and mechanisms
remain open within that direction; it does not imply blanket locks on exploration.

Teachers establish purposes, contribute evidence and context, organise activity
and govern delegated behaviour. Learner-held expertise and sufficient support
matter; completing an activity or receiving assistance is not automatically
evidence of independent mastery. A graph, compiler or public curriculum API is
supporting infrastructure, not itself a teaching method. Public curriculum access
does not thereby require learner identification, transcripts or stored hypotheses.
The exploratory pedagogy project and the curriculum infrastructure consumer retain their separately governed scope; full tuition is not silently
added to the first public-data profile.

## Retained responsibility map

Every row has an owning domain/engineering role. Shared framework mechanisms
support those roles; they do not acquire their authority. Existing provision is
partial unless a specific implemented contract is evidenced.

| Build area                                 | Retained and missing responsibility                                                                                                                                         | Architectural receiver and dependency                                                                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B01 Curriculum definitions                 | Current API/bulk definitions and assertions are inputs. Owned domain contracts add complete entity/revision/occurrence/assertion/material/rights meanings                   | Curriculum contract owner; first semantic fixture and explicit projection mapping precede representations that promise them                               |
| B02 Authoring, curation and publication    | Authoritative editing, accepted changes, review/approval, assets/accessibility/rights and coherent edition publication remain necessary; ingestion alone cannot supply them | Editorial/publishing owner; authoring-to-edition contract below. This does not block public read extraction                                               |
| B03 Source/material/data pipelines         | Preserve acquisition, staging, transforms, assets, correspondence, quality, eligibility and reproducible generation                                                         | Integrity/admission owner; separate search owner receives changes/deletions, freshness and recovery seams                                                 |
| B04 Layered semantics                      | Curriculum, specialised domain, research, authority, operation and app models can differ; declared transformations preserve required distinctions                           | Definition/domain owners plus compiler owner; complete mapping and target enforcement, no mandatory universal schema/IR                                   |
| B05 Inquiry/retrieval/relationships        | Search/typed access and contextual graph operations preserve honest coverage, provenance, loss and query limits                                                             | Retrieval/graph owners; selected RDF/Dataset/GraphView contracts and independently expected query results, not the whole graph catalogue                  |
| B06 CF and composed systems                | Complete Primitives, Components and Subsystems, with all reconstruction/evidence obligations                                                                                | Foundation owner; first geometry→heap plus selected core units. Only actually consumed guarantees block a composition                                     |
| B07 Innovation/application construction    | Design, workbench, composition, host, lifecycle and reference experiences remain a full framework                                                                           | Innovation owner; one complete composition/elevation profile with domain authorities retained                                                             |
| B08 Full tuition                           | Teacher/learner experience, sufficient help, qualified return, continuity, recovery and mastery under teacher authority                                                     | Educational/service owner; bounded activity/return contract below. Later full-service construction is separately commissioned                             |
| B09 Interoperability workbench             | Profile/extension negotiation, semantic compatibility, meaningful receipt/import and declared disagreement supplement schema conformance                                    | Standards and domain owners; evidence/receipt profile below, supported by compiler/protocol mechanisms                                                    |
| B10 Governed research/data science         | Dataset/purpose/access, transformations, methods/configuration, uncertainty, negative findings and reproducibility                                                          | Research/data steward; public/synthetic evidence package below. Telemetry access is not research permission                                               |
| B11 Evaluation and safety engineering      | Claim-specific cases, calibrated interpretation, adverse results, hazards, remedy and reassessment supplement technical checks                                              | Claim/safety/domain owner; scoped evaluation contract. Search quality, protocol conformance and educational safety are distinct                           |
| B12 Evidence, learning and decisions       | Questions, inputs/runs, contrary findings, interpretations and accountable decisions/corrections remain joined                                                              | Evidence/decision owner; versioned package below. Possibility value is legitimate without being labelled learning gain                                    |
| B13 Identity, authority, privacy and state | Purpose/role/delegation, protected custody, minimum information, continuation, revocation and current authority                                                             | Legitimate institution/domain owner; protected-operation contract below. Public capabilities need only the information their purpose justifies            |
| B14 Challenge, support and remedy          | Correction reaches affected reliance, reachable human reception, accepted remedy and supported re-entry                                                                     | Remedy/receiving owner; technical rollback is one mechanism, not completed human remedy                                                                   |
| B15 Practice and engineering               | Canonical Practice, reusable technology bindings, organisation policy and generated skill/plugin/guidance distribution remain distinct                                      | Existing Practice/distribution owners; promotion/evidence/version/update/retirement contracts, no wholesale Practice rebuild                              |
| B16 Lifecycle and operation                | Distribution/resources, diagnosis, compatibility, provider substitution, recovery, custody and retirement                                                                   | Capability/release/receiving owners; supported installed facilities plus separate real operational acceptance. Code does not supply staffing or authority |

## Four concrete contract records

These are proposed records and failure traces to bind at implementation pickup,
not an instruction to build an unbounded universal record engine. Each uses public
or synthetic fixtures until the relevant authority permits anything else. All
execution, validation, interpretation support and custody mechanisms stay in OCE.
An instance selects a supported profile and permitted data/configuration.

### Public retrieval and meaningful receipt

A request names a capability/view, observation or freshness requirement, scope,
query, limit and declared consumer profile. The result carries selected complete
entities or explicit references, source/generation/definition identities,
coverage and permitted loss. Ranking is distinct from exhaustive enumeration.
The recipient validates the actual transport branch and the profile's required
interpretation closure. A receipt acknowledges the identified result and whether
it was fully admitted, partially received or rejected; network delivery alone
cannot establish useful import or human understanding.

Counterexample: two pages from different generations appear individually valid.
The coherent observation contract rejects their combination or explicitly restarts.
A missing definition cannot be repaired by a later optional lookup while claiming
continuous integrity. Current authority and correction obligations survive caching.
The existing first curriculum fixture supplies this record; graph-specific meaning
is checked by its graph owner and stronger context claims require host evidence.

### Authoring change, review and edition

An authoring candidate references its immutable base revision, proposed edits,
affected entity/relationship/asset identities, rationale and source provenance.
Author, reviewer and publisher grants are separate and purpose-limited. Validation
checks structural/domain constraints, contextual relationships, rights, accessibility
and asset completeness. Approval identifies the exact candidate and approved scope;
it cannot drift to a subsequent edit. The publisher constructs a coherent edition
from approved revisions and definitions, records current eligibility and exposes
the edition's consumer contract.

Counterexample: an asset loses permission after review but before publication.
Current eligibility blocks publication; a prior approval is not a durable right.
A concurrent edit fails expected-base revision checking instead of overwriting
newer work. Rejection preserves a reason and legitimate correction path, without
exposing protected reviewer material. A corrected/withdrawn edition produces
traceable downstream changes; rollback cannot revive withdrawn assets. Editorial
judgement and approval remain with the legitimate publisher, not a generated type.

### Teacher-led activity, help and qualified return

A teacher-authorised activity specifies purpose, curriculum/skill context,
permitted support, delegated effects and a bounded return profile. Work evidence
records its context and assistance separately from observation, interpretation,
learner hypothesis, mastery judgement and enacted teaching decision. A Bayesian
model has identified priors/evidence/assumptions and an uncertainty-bearing update;
it does not convert one successful assisted response into an unquestionable fact.
Exact estimators and criteria/mechanisms for mastery-based progression are reviewed educational design bindings.

The return identifies the activity, evidence and help basis, scope/completeness,
uncertainty, proposed next action and legitimate receiving authority. Teacher
review/correction can alter the authoritative decision without rewriting history
as though the earlier inference never existed. A protected learner record is
admitted only for justified purpose and delegated authority, with minimum
information, retention and current-use checks. Session-only or institution-held
state remains possible; no national learner store is assumed.

Counterexample: a grant expires between producing the return and receiving it.
Delivery does not become an unauthorised write; the declared safe outcome and
reception/re-entry path applies. Abandonment, host truncation and partial return
have honest states. A refusal alone does not complete the promised positive
teaching or remedy task. Educational effectiveness requires separately appropriate
evidence; this design neither conducts nor commissions participant/team studies.

### Research/evaluation evidence, decision and remedy

An evidence package links a question/claim, dataset source/eligibility and purpose,
method/configuration/runtime identities, candidate/baseline, cases and adverse
cases, observations, uncertainty, negative/contrary findings, interpretation and
scope. Dataset, method, domain and decision authority are separately named.
The output preserves reproducible provenance and legitimate disagreement; no
universal scoring model equates protocol, retrieval, teaching and safety claims.

The receiving decision identifies what evidence was actually received, permitted
reliance, an accountable accept/reject/narrow/stop decision, rationale and reopening
trigger. A correction links superseded findings and affected decisions. A support
or harm report has a reachable authorised receiver, acknowledgement, accepted
remedy or explicit supported ending, and reassessment/re-entry where promised.
Sending a report, logging an incident or rolling back code is not automatically
accepted human remedy. Already delivered copies have explicit recall limits.

Counterexample: the same model produces output and judges it favourably. This
is correlated evidence, not independent validation. Preserve the dependence and
require the claim's appropriate comparator/independent evidence before stronger
reliance. Public/synthetic fixtures can verify evidence and receipt contracts now;
protected datasets, operational claims and educational decisions need their own
legitimate permissions and evidence.

## Precise unresolved bindings and change control

The bounded choices are: selected editorial/domain operation and approval model;
activity/return scope and educational decision owner; estimator/uncertainty and
mastery-based progression criteria/mechanisms; supported interoperability profile and receipt semantics;
evidence disclosure/retention and claim-specific evaluation; protected purpose,
delegation and state custody; remedy receiver and supported ending. They block
only the corresponding service or stronger claim. General contracts, public-data
fixtures and the first CF construction can proceed without fabricating them.

The domain-service architecture owner binds these four records with their
editorial, educational, research and standards authorities. The permanent records
are then inputs to finite construction slices, with exact public/consumed forms,
compatibility, authority, correction, failure and evidence. The framework lifecycle
owner supplies reusable facilities; it does not silently assume all domain duties.

The completed Typescript Graphs design and pending demonstration programme retain
their specialist source standing: no demonstration becomes complete by incorporation.
The proposed Effective AI agent-capability construction/migration programme remains
proposed; its useful definition/admission/effect/host-evidence/retirement distinctions
inform relevant profile contracts without adopting a universal agent framework.
Source changes reopen the affected derived record rather than erasing provenance.
