# OWA and Oak Components: cross-lens synthesis

## Status and scope

This record synthesises the Concept Explorer portfolio in this directory. It is
based on static source at the following immutable revisions:

- Oak Web Application (OWA)
  [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5);
- Oak Components
  [`8ff8264fa921e4e40fdaf9a99b02fd156c699cc8`](https://github.com/oaknational/oak-components/tree/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8);
  and
- OCE's canonical
  [`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md)
  workflow at
  [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

The underlying passes are:

- [human outcome and public value](./human-outcome-and-public-value.md);
- [semantics, information and time](./semantics-information-and-time.md);
- [structure, evolution and operations](./structure-evolution-and-operations.md);
- [component language and kit boundary](./component-language-and-kit-boundary.md);
- [service, rights, channels and decisions](./service-rights-channels-and-decisions.md);
  and
- [preservation and human rights](./preservation-and-human-rights.md).

OWA declares a Components `^2.45.0` consumer line while the inspected Components
source is `v3.0.0`; they are not an executable pair. Cross-repository
correspondences in these records are structural unless separately verified
against OWA's installed 2.45.0 artefact.

This is an understanding of the starting point and the evidence still needed.
It is not a proposal to fix OWA or Oak Components, not a catalogue of parts OCE
must copy, and not a target package, process, team or deployment architecture.

## Relation between the lenses

The portfolio sought orthogonal questions, not merely different terminology. It
also retained recursive passes where formalising an existing seam produced a
new falsifier. Each pass is therefore classified by its primary contribution:

- **OE - orthogonal expansion:** changes the protected subject, unit of analysis
  or material failure signal;
- **RD - recursive deepening:** examines an already visible seam with a more
  discriminating model or evidence question; and
- **TR - triangulation:** tests a compatible finding through another failure
  signal or scale.

The classification is not a claim that a pass has only one relationship to all
others.

| #   | Lens                                                       | Primary relation | Distinguishing contribution                                                    |
| --- | ---------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------ |
| 1   | Teleology and Jobs-to-be-Done                              | OE               | realised human progress rather than delivered feature                          |
| 2   | Pedagogy, learning science and assessment validity         | OE               | validity of educational inference                                              |
| 3   | Teacher cognitive ergonomics and workflow                  | OE               | teacher attention, recovery and working memory                                 |
| 4   | Pupil agency, motivation and cognitive load                | OE               | learner control, dependence and attention                                      |
| 5   | Accessibility as human capability                          | TR               | equivalent action and understanding beyond conformance evidence                |
| 6   | Safeguarding and vulnerable-user harm                      | OE               | hazard, exposure, prevention and response                                      |
| 7   | Public value, equity and digital-public-good reach         | OE               | distribution, capture and stewardship of public benefit                        |
| 8   | Privacy, consent and data dignity                          | OE               | legitimate person-linked data use and agency                                   |
| 9   | Adoption, trust and legibility                             | OE               | correspondence between visible claim and user belief                           |
| 10  | Domain ontology and bounded semantic authority             | RD               | kind, invariant and owner of each meaning                                      |
| 11  | Curriculum graph identity and referential integrity        | RD               | concept, placement, version and address identity                               |
| 12  | Information provenance, lineage and loss                   | RD               | source-to-claim trace and discarded meaning                                    |
| 13  | Search and information-retrieval relevance                 | OE               | information need through ranking to usable outcome                             |
| 14  | Content lifecycle, publication and retirement              | RD               | lifecycle per authority, audience and projection                               |
| 15  | State machines and temporal logic                          | RD               | valid history behind a visible temporal claim                                  |
| 16  | Distributed consistency, concurrency and idempotency       | RD               | operation identity and convergence under interleaving                          |
| 17  | Control theory, feedback and stability                     | OE               | sensor, interpretation, authority, correction and stability                    |
| 18  | Data-model contracts, schema correspondence and evolution  | RD               | correspondence among serialised, generated and validated projections           |
| 19  | Failure semantics, absence and partial knowledge           | OE               | epistemically precise negative states                                          |
| 20  | Essential, accidental and compensating complexity          | RD               | enduring obligation versus removable or compensating machinery                 |
| 21  | Coupling, cohesion and change propagation                  | RD               | propagation by reason to change                                                |
| 22  | Evolutionary architecture, path dependence and migration   | RD               | coexistence and migration as current architecture                              |
| 23  | Socio-technical ownership, Conway forces and team topology | OE               | decision capability and accountability across boundaries                       |
| 24  | Product-line variability and configuration                 | OE               | variation dimension, binding time and supported combination                    |
| 25  | Reliability, resilience and fault containment              | TR               | preserved outcome and bounded degradation under fault                          |
| 26  | Performance, queueing and resource budgets                 | OE               | end-to-end deadline, contention and admission                                  |
| 27  | Security, capabilities and threat boundaries               | OE               | authority to act and misuse of trust                                           |
| 28  | Observability, operability and the control plane           | RD               | question-to-signal-to-authorised-control path                                  |
| 29  | Assurance epistemology and claims-to-evidence              | RD               | what evidence can actually invalidate a confidence claim                       |
| 30  | Supply-chain provenance, portability and vendor choice     | OE               | source-to-artefact identity and deliberate substitutability                    |
| 31  | Sustainability and resource externalities                  | OE               | whole-lifecycle resource use per valued outcome                                |
| 32  | Design language and semiotics                              | OE               | interaction meaning rather than visual consistency alone                       |
| 33  | Composition algebra and validity constraints               | OE               | invalid experiences made from locally valid pieces                             |
| 34  | Public API contracts and compatibility                     | RD               | source, runtime and behavioural consumer promise                               |
| 35  | Inversion of control and responsibility ownership          | OE               | explicit ownership where kit and consumer meet                                 |
| 36  | Web-platform alignment and progressive enhancement         | OE               | core outcome across baseline and enhanced browser capability                   |
| 37  | Responsive and adaptive state space                        | OE               | environment, content and user-state combinations                               |
| 38  | Tokens, themes and policy encoding                         | OE               | semantic design decision versus named raw value                                |
| 39  | Build, distribution and runtime boundaries                 | TR               | what an import actually makes execute or depend on                             |
| 40  | Framework-consumer cognition and diagnostics               | OE               | consumer decision, teachability and failure recovery                           |
| 41  | Governance, versioning, deprecation and memory             | RD               | intentional evolution of a public kit contract                                 |
| 42  | Boundary placement, escape hatches and diversity           | OE               | shared invariant versus legitimate consumer variation                          |
| 43  | Documentation and examples as executable contract          | TR               | taught behaviour as part of the delivered contract                             |
| 44  | Service blueprint and human support                        | OE               | frontstage outcome, backstage work and unresolved hand-off                     |
| 45  | Law, content rights, licensing and accountability          | OE               | rights-bearing work/person and enforceable obligation                          |
| 46  | Internationalisation, localisation and cultural fit        | OE               | language, locale and situated applicability                                    |
| 47  | Channel interoperability, documents, media and offline     | OE               | preserved meaning and action across projections                                |
| 48  | Measurement validity, analytics and Goodhart effects       | OE               | warranted decision inference rather than available activity count              |
| 49  | Reversibility, option value and uncertainty                | OE               | avoidable lock-in and irreversible harm under incomplete knowledge             |
| 50  | Curriculum epistemic governance and contestability         | OE               | whose claim counts and how challenge changes authority                         |
| 51  | Institutional and incentive architecture                   | OE               | incentives, maintenance obligations, capture and ecosystem behaviour           |
| 52  | Human rights and duty-bearer analysis                      | OE               | rights-holder, minimum guarantee, duty-bearer and effective remedy             |
| 53  | Long-term digital preservation and archival continuity     | RD               | fixity, authenticity, custody, representation dependencies and intelligibility |

Four relationships are deliberately explicit. Lenses 18 and 34 are recursive
specialisations of compatibility: one concerns correspondence among data
models, the other the kit's complete consumer promise. Lenses 22 and 41 examine
evolution at whole-system and consumer-contract scales. Lens 52 intersects
public value and content-law questions but changes the protected unit to an
individual claim, a competent duty-bearer and effective remedy. Lens 53 deepens
provenance and lifecycle questions into custody and future intelligibility.
Evidence reuse alone neither establishes nor defeats orthogonality; the changed
unit and falsifier do the discriminating work.

## Movement 1: combined reflection on observations

### Load-bearing observations

The individual records support the following current-state observations:

1. OWA and Oak Components encode material knowledge about curriculum identity,
   audience, lifecycle, interaction, accessibility, safety, rights, failure and
   delivery. File or package placement does not reliably identify the authority
   for that knowledge.
2. A visible lesson is not one entity. Concept, authored content, curriculum
   placement, version, public address, page projection, learner run and exported
   artefact have different identities and lifetimes.
3. A visible success state is not one event. Intent, local projection, request
   acceptance, authority commit, reconciliation, acknowledgement and realised
   outcome can disagree.
4. Components spans foundations, interaction grammar and outcome recipes. Those
   analytical levels do not establish a required package, repository or team
   decomposition.
5. Type correctness is local. Relational, temporal, semantic, accessible and
   policy correctness often exists only in a composition or an end-to-end
   outcome.
6. OWA contains multiple authorities and clocks across curriculum data, CMS,
   routes, caches, identity, search, media, Classroom, analytics and deployment.
   Freshness and publication are consequently plural.
7. Migration, deprecation, old/new route roots, compatibility bridges and
   consumer version difference actively shape present behaviour. They are not
   merely historical notes.
8. Configuration, experimentation, product-line variation, personalisation and
   provider failover are different decisions made at different times by
   different authorities.
9. Sensors, events, logs and test results exist, but telemetry is not by itself a
   feedback loop and a passing check is not by itself outcome assurance.
10. Browser-native paths, server rendering, client state, provider callbacks,
    documents, print, media and offline use are different execution channels.
    Equivalent meaning and capability across them is not established by source
    reuse.
11. Accessibility, privacy, safeguarding, legal rights, cultural applicability
    and public value are outcome constraints, not quality layers to attach after
    functional design.
12. Human support, editorial work, provider administration, incident response
    and consumer diagnosis are part of the delivered service even when they are
    absent from a page component.
13. Analytics can establish emitted activity, not automatically educational
    progress, user comprehension, causal impact or equitable benefit.
14. A public component package creates an ecosystem institution: its defaults,
    extension points, documentation, release policy and maintenance obligations
    allocate power and future work among Oak and its consumers.
15. Aggregate public value can improve while a particular rights-holder still
    experiences discrimination, infringement or no effective remedy.
16. Current availability, redirects, downloadable artefacts and Git history do
    not by themselves establish authentic custody, future renderability or
    intelligibility of an educational record.
17. Static repositories cannot establish lived impact, production frequency,
    applied controls, organisational intent, actual consumer diversity, support
    load or the legitimacy of curricular and product decisions.

### Inherited assumptions that no longer survive unchanged

| Inherited assumption                                         | Changed understanding                                                                                                       |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| OWA is an app and Components is its UI layer                 | Together they participate in educational, service, semantic, temporal, institutional and operational systems.               |
| A current mechanism names a requirement                      | It may encode an enduring obligation, a chosen policy, migration residue or compensation for another choice.                |
| A lesson is one stable entity                                | Concept, content, placement, version, address, projection and run require explicit correspondence.                          |
| Published means available                                    | Accepted, addressable, indexed, deliverable, current, licensed and supported can differ.                                    |
| Request success means user success                           | Acceptance, commit, reconciliation, acknowledgement, human progress and impact are distinct.                                |
| Shared means reusable                                        | Shared can describe reuse, semantic authority, release lifecycle, runtime coupling or institutional ownership.              |
| A type defines correctness                                   | Types cannot alone prove history, relation, interpretation, accessibility or valid composition.                             |
| More component flexibility enables more consumers            | Unbounded combinations can export invalidity and policy archaeology to every consumer.                                      |
| One shared schema removes duplication                        | Purpose-specific projections are legitimate; correspondence and evolution evidence are the obligation.                      |
| More telemetry creates control                               | A valid sensor still needs interpretation, corrective authority, response and stability evidence.                           |
| Open publication creates public value                        | Reach, equity, rights, provenance, accessibility, stewardship and contestability determine realised value.                  |
| Framework governance is engineering administration           | It allocates semantic authority, consumer agency, maintenance burden and ecosystem option value.                            |
| Aggregate benefit discharges every public obligation         | A rights-holder may still have a claim against an identifiable duty-bearer and require an effective remedy.                 |
| Backup, download, redirect or Git history preserves a record | Preservation also requires a defined object, custody, fixity, representation information and tested future intelligibility. |

## Movement 2: mechanism-neutral problem space

### Combined problem frame

Oak needs to enable multiple products and independent consumers to transform
evolving educational and service authority into truthful, findable, accessible,
safe and useful outcomes across people, time, channels and failure, while:

- preserving identity, meaning, provenance, rights, legitimate variation and
  authentic long-horizon custody;
- making state, uncertainty and responsibility legible;
- allowing correct composition without centralising every product decision;
- enabling challenge, effective remedy and change by the people entitled to
  decide;
- containing faults, misuse, incompatibility and resource externalities;
- giving consumers and operators evidence sufficient to understand and act;
  and
- retaining deliberate options as needs, providers and knowledge change.

Success is not architectural resemblance to OWA or Components. It is the
ability to produce and evidence excellent outcomes with the fewest necessary
concepts and the least accidental or compensating machinery. Simplicity is a
result of removing false premises and aligning authority, not a constraint on
ambition.

### The concurrent systems

The source is more intelligible when treated as eight concurrent systems rather
than one layer stack:

| System                         | Governing concern                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| Human and educational          | intended progress, learning validity, agency, attention, accessibility and safety                  |
| Normative and public-service   | equity, privacy, rights-holders, duties, remedy, cultural fit, support and public benefit          |
| Semantic and informational     | ontology, identity, provenance, relevance, lifecycle and knowledge state                           |
| Custodial and long-horizon     | preservation object, fixity, authenticity, custody, retention, migration and future interpretation |
| Temporal and control           | valid transition, consistency, feedback, acknowledgement and stability                             |
| Interaction and kit language   | meaning, composition, adaptation, web capability and consumer responsibility                       |
| Evolutionary and institutional | variation, ownership, migration, governance, incentives, contestability and options                |
| Operational and evidential     | reliability, security, performance, resources, provenance, observability and proof                 |

These are analytical views, not candidate services. One excellent mechanism can
satisfy several systems. Conversely, one current mechanism can conceal conflicts
between them.

### Terms which must be disambiguated before architecture

| Term       | Materially different meanings exposed by the passes                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| lesson     | concept, authored version, placement, address, page projection, learner run, resource or export              |
| success    | intent, local change, accepted request, committed authority, reconciled observation, human outcome or impact |
| published  | accepted, audience-visible, addressable, indexed, deliverable, licensed, current or supported                |
| component  | foundation, primitive, control, adapter, interaction grammar, outcome recipe or encoded policy               |
| shared     | duplicated less, semantically authoritative, jointly governed, jointly released or loaded together           |
| user       | teacher, pupil, parent, editor, framework consumer, operator, support worker or affected non-user            |
| accessible | conformant implementation, operable task, equivalent information, suitable channel or supported recovery     |
| fresh      | source age, projection age, cache age, index age, asset availability or user-observed currency               |
| evidence   | source observation, test result, runtime signal, causal inference, user account or governing decision        |
| consumer   | importing program, product team, partner organisation, browser, downstream service or person                 |

## Movement 3: reopened explanations and contradictions

### Competing whole-system explanations

The source is consistent with several explanations. None is established merely
because it sounds architecturally familiar.

1. **Accumulated knowledge explanation.** Apparent breadth and duplication may
   preserve hard-won educational, accessibility, provider and migration
   knowledge which a cleaner source tree could accidentally erase.
2. **Compensating-system explanation.** Several stores, adapters, recipes,
   guards and workflows may compensate for split identity, weak upstream
   contracts, provider semantics or a package boundary which a different system
   model could remove.
3. **Product-line explanation.** OWA and Components may already be an implicit
   product line whose variability, binding times and supported profiles are
   encoded through folders, props, flags and conventions instead of one explicit
   model.
4. **Boundary-object explanation.** Components, tokens, stories and examples may
   coordinate designers, engineers and product teams precisely because each can
   interpret them locally. Their ambiguity may be both useful and hazardous.
5. **Control-system explanation.** Pages, events, caches, tests, deployment
   workflows and operational signals may form partial feedback loops. The
   missing architecture may be semantic closure and decision authority, not
   another runtime service.
6. **Institutional explanation.** Some technical boundaries may persist because
   they allocate ownership, release authority, accountability, incentives or
   risk, even when the code could be combined.
7. **Service-design explanation.** Digital paths may optimise one visible stage
   while transferring unresolved work to teachers, pupils, support, editors,
   operators or downstream consumers.
8. **Rights-and-duties explanation.** A generally beneficial service can still
   fail because an identifiable rights-holder cannot locate the duty-bearer,
   secure a minimum guarantee or obtain an effective remedy.
9. **Custodial explanation.** Current delivery mechanisms may preserve access
   today while leaving no governed preservation object, custody chain or
   representation information from which future users can verify and interpret
   the record.

### Contradictions that must remain visible

| Productive tension                           | Why collapsing either side is unsafe                                                                                  |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| flexibility vs valid composition             | consumers need legitimate variation but should not reconstruct every invariant                                        |
| shared outcome recipes vs product authority  | recipes preserve knowledge but can centralise product policy and release coupling                                     |
| one discoverable root vs explicit contracts  | one import surface aids discovery but hides runtime, environment and compatibility classes                            |
| central governance vs outcome-owner control  | consistency needs stewardship while educational and product meaning needs competent authority                         |
| browser-native resilience vs rich execution  | enhancement can create value but must not falsify completion or strand baseline capability                            |
| strong defaults vs diverse consumers         | defaults reduce repeated decisions but can encode one product's context as universal                                  |
| measurement vs gaming                        | signals enable learning but targets can displace the outcome they proxy                                               |
| openness vs rights and safety                | public reuse creates value only when restrictions, attribution and vulnerable users survive                           |
| stability vs reversibility                   | dependable contracts need continuity while uncertain decisions need bounded exit                                      |
| preservation vs correction or lawful erasure | authentic history and future intelligibility can conflict with rectification, withdrawal, privacy and disposal duties |
| local simplicity vs ecosystem simplicity     | deleting a local abstraction can duplicate policy, while centralising it can export coupling                          |

### Candidate seams revealed by convergence

These are boundaries to investigate, not proposed APIs or services:

```text
human intent -> task proxy -> visible completion -> realised outcome -> impact
learning claim -> activity -> response -> scoring -> inference -> consequence
concept -> authored version -> placement -> public address -> channel projection
source observation -> validation -> transformation -> human-visible assertion
user intent -> operation identity -> authority commit -> reconciliation -> belief
authority lifecycle -> audience policy -> addressability -> support obligation
local validity -> composed interaction -> end-to-end capability
product meaning -> kit contract -> consumer-supplied authority -> rendered claim
browser baseline -> enhanced execution -> failure degradation -> recovery
variation -> binding time -> configuration -> supported profile -> evidence
source -> build declaration -> artefact -> consumer build -> deployment -> outcome
signal -> interpretation -> corrective authority -> action -> re-observation
public availability -> legitimate access -> equitable capability -> public value
digital completion -> backstage work -> human support -> service resolution
right or duty -> policy -> control -> evidence -> accountability
rights-holder -> claim or minimum -> duty-bearer -> decision -> effective remedy
claim -> challenge -> competent decision -> authority revision -> visible correction
incentive -> boundary behaviour -> maintenance allocation -> ecosystem outcome
decision -> commitment -> new evidence -> exit or adaptation -> retained option
object -> representation information -> fixity and custody -> migration or emulation -> future interpretation
```

## Movement 4: warranted synthesis and proposed evidence

### Current propositions and invalidators

#### P1: the deepest seams are changes of truth, authority, lifetime and audience

**Warrant:** complexity repeatedly clusters where curriculum data becomes an
application projection, an operation crosses to another authority, a cached
claim outlives its source, or product meaning becomes Component configuration.

**Invalidator:** change, incident and outcome evidence shows no association
between those transitions and complexity, defects, user misunderstanding or
innovation difficulty.

#### P2: Components contains at least three analytical contract levels

**Warrant:** foundations, interaction grammar and product-shaped outcome recipes
have different semantic reach, consumer responsibility and failure modes.

**Invalidator:** consumer and change evidence shows that all current and intended
capabilities have one lifecycle, authority, runtime profile and compatibility
contract, with no useful distinction among those levels.

This proposition does not imply three packages, repositories, teams or release
trains.

#### P3: outcome truth is more distributed than visible acknowledgement

**Warrant:** several journeys separate local state, request acceptance, remote
commit, provider observation, Component feedback and human completion.

**Invalidator:** controlled traces show every consequential acknowledgement is
derived from the relevant authority and remains correct under delay, denial,
retry, duplication, refresh and competing clients.

#### P4: current architecture contains both essential knowledge and removable compensation

**Warrant:** rich domain and interaction decisions coexist with migration
bridges, broad boundaries, provider-shaped policy and repeated projection logic.

**Invalidator:** premise and history evidence shows each apparent compensation
directly enforces a current, independent obligation which cannot be removed by
changing the system model.

#### P5: excellence for a kit is a governed consumer outcome, not maximal reuse

**Warrant:** consumers need semantic guidance, valid composition, diagnostics,
accessibility, evolution and evidence as well as reusable implementation.

**Invalidator:** representative consumers consistently achieve and verify the
intended outcomes from lower-level materials alone, without duplicated policy,
specialist archaeology or central intervention.

#### P6: observability, assurance, measurement and governance form one evidence cycle

**Warrant:** each depends on a precise claim, valid signal, interpretation,
decision authority and response. The current source shows substantial pieces but
not their complete correspondence.

**Invalidator:** applied control-plane evidence demonstrates end-to-end claim,
signal, gate, owner, correction and outcome validation for every material
capability.

#### P7: openness requires contestable authority and sustainable stewardship

**Warrant:** public access, attribution, provenance and product claims do not by
themselves show who may challenge a curricular claim, how it changes, or who
maintains ecosystem obligations.

**Invalidator:** current governance evidence shows affected communities and
qualified authorities can identify, challenge, decide, correct and audit
material claims, with durable maintenance responsibility and equitable results.

#### P8: deliberate reversibility is part of excellence under uncertainty

**Warrant:** provider semantics, public contracts, cached projections, content
identity and consumer adoption can turn implementation choices into long-lived
commitments.

**Invalidator:** exit exercises and history show material choices remain cheaply
and safely adaptable, or that irreversibility is necessary, explicit and backed
by evidence stronger than any realistic alternative.

#### P9: aggregate benefit cannot justify crossing an unremedied rights floor

**Warrant:** public-value, equity, privacy, accessibility and safeguarding
signals can describe populations or controls without identifying a particular
rights-holder's claim, the competent duty-bearer, a minimum guarantee or an
effective route to remedy.

**Invalidator:** representative adverse cases show every material rights claim
is identified without relying on aggregate benefit, assigned to a competent
duty-bearer, decided without discrimination and resolved through an accessible,
timely and effective remedy.

#### P10: current continuity mechanisms do not establish preservation

**Warrant:** routes, downloads, source revisions, caches and current lifecycle
controls support delivery or recovery for a present system, but the source does
not establish a governed preservation object, fixity, custody chain,
representation dependencies or tested future reproduction.

**Invalidator:** an authoritative preservation programme identifies the objects
and significant properties to retain, proves fixity and custody, governs
retention and disposal, and repeatedly reproduces authentic, intelligible
records after relevant software, format and dependency change.

### Highest-information evidence programmes

These programmes are ordered by the number of propositions they can materially
change, not by delivery cost or an assumed implementation sequence.

| Evidence programme                                  | Warrant                                                                                    | Falsifier or decisive no-change result                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Outcome and impact-chain study                      | source features do not establish teacher/pupil progress or educational consequence         | owned representative chains already connect mechanism, outcome and impact with valid evidence                  |
| Learning and assessment-validity audit              | scoring correctness cannot warrant construct or instructional validity                     | current independent validity cases cover claims, tasks, subgroups, uses and consequences                       |
| Service blueprint and support trace                 | digital completion can transfer work or failure backstage                                  | representative journeys already have owned end-to-end resolution evidence                                      |
| Identity, provenance and lifecycle atlas            | the same nouns use different keys, clocks and states                                       | one authoritative executable model already governs all material projections                                    |
| Task-based search relevance programme               | ranking is only one stage between need and usable result                                   | representative judgements already connect every stage to successful teacher outcomes                           |
| Temporal, concurrency and failure injection         | distributed acknowledgement and retries create untested interleavings                      | existing guarantees and tests prove invariants under delay, duplication, denial and reorder                    |
| Semantic component corpus and composition tests     | local types do not establish intended meaning or valid combinations                        | current contracts reject or correctly render every representative invalid state                                |
| Kit-consumer task and variability study             | intended consumers, profiles and diagnostic needs are not source-visible                   | consumers share one evidenced profile and succeed without hidden policy reconstruction                         |
| Co-change, incident, ownership and migration map    | directories do not establish real coupling, cause, owner or removable residue              | current boundaries accurately predict change and every stratum has governed convergence                        |
| Control-plane and assurance trace                   | repository checks do not establish applied gates, promotion or corrective authority        | external controls close each source-to-outcome evidence gap                                                    |
| Privacy, safety, security and rights cases          | controls span people, identifiers, providers, content and product claims                   | reviewed cases cover plausible harm, authority, control, residual risk and response                            |
| Localisation and cross-channel equivalence study    | shared content/code does not prove equivalent meaning or action across context and channel | representative locales, media, documents and offline paths preserve intended capability                        |
| Runtime, queue and whole-resource measurements      | static topology cannot establish latency, contention, payload or externality               | explicit outcome budgets are met across cold, hot, faulted and constrained profiles                            |
| Analytics and decision-validity audit               | emitted events can become invalid proxies or optimisation targets                          | each material decision has a valid causal model, guardrails and counter-evidence                               |
| Provider exit and reversibility exercises           | adapters do not prove semantic, identity, data or operational portability                  | critical choices have recently proven exits or explicit evidence-backed irreversible status                    |
| Contestability and participation trace              | provenance does not show who can challenge or revise authority                             | material claims have accessible, legitimate, timely and auditable correction paths                             |
| Incentive and ecosystem-maintenance map             | package and ownership boundaries allocate future work and power                            | incentives align with public outcomes and every obligation has durable accountable ownership                   |
| Rights-holder, duty-bearer and remedy cases         | aggregate value and general controls can miss an unremedied individual claim               | representative claims identify the duty, competent authority, non-discriminatory decision and effective remedy |
| Preservation-object and forensic reproduction study | current availability and source history do not prove authentic future intelligibility      | governed objects retain fixity, custody and significant properties through tested format and dependency change |

### What would justify architectural work

An OCE mechanism is warranted only after evidence establishes:

1. the outcome or obligation it protects;
2. the authority competent to define that outcome;
3. the difficult states, harms and legitimate variation it must cover;
4. why changing the wider system cannot remove the problem more cleanly;
5. the smallest idiomatic mechanism which preserves the required knowledge;
6. how consumers can use, vary, diagnose and evolve it correctly; and
7. what evidence can invalidate both its behaviour and its continued necessity.

The current records warrant investigation into explicit semantic authority,
outcome contracts, valid composition, variation models, responsibility hand-off,
evidence cycles and ecosystem governance. They do not yet warrant any particular
package graph, application framework, state library, service decomposition,
design-system taxonomy or provider.

## Adjacent frameworks considered

The search for perspectives also considered the following named frameworks.
Most were not counted as additional independent lenses because they repeat a
protected subject above, provide a method inside a pass, or presuppose a solution
shape. Human-rights and digital-preservation questions were promoted to full
passes when their units and falsifiers proved irreducible.

| Framework family                                                 | Where its useful question was retained                                                                                                 |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| C4, Zachman, TOGAF and enterprise viewpoints                     | existing recursive architecture atlas and the eight concurrent systems                                                                 |
| Clean, onion, hexagonal and ports-and-adapters                   | authority, responsibility, provider portability and boundary-placement passes                                                          |
| modular monolith, microservices and micro-frontends              | competing solution shapes only after coupling and authority evidence                                                                   |
| CQRS, event sourcing, actors and workflow engines                | temporal, consistency, operation-identity and feedback investigations                                                                  |
| FMEA, fault trees, STPA, safety cases and resilience engineering | safeguarding, reliability, control, threat and assurance programmes                                                                    |
| UDL, inclusive design and capability approaches                  | pedagogy, pupil agency, accessibility, localisation and channel equivalence                                                            |
| activity theory, cognitive dimensions and distributed cognition  | human workflow, kit-consumer cognition and service blueprint                                                                           |
| semiotics, affordance and boundary-object theory                 | design language, composition and cross-community contract interpretation                                                               |
| Wardley mapping, real options and evolutionary strategy          | reversibility, provider choice, capability maturity and unresolved external evidence                                                   |
| principal-agent, commons governance and platform economics       | public value, institutional incentives, contestability and ecosystem maintenance                                                       |
| data mesh, knowledge graphs and semantic web                     | ontology, identity, provenance and contracts without selecting an implementation                                                       |
| FinOps, GreenOps and lifecycle assessment                        | queue/resource budgets and sustainability per valued outcome                                                                           |
| critical, decolonial and care-centred approaches                 | contestability, cultural fit, equity, safeguarding and service; human rights remained separate because duty and remedy change the unit |
| records management, digital preservation and OAIS-style concepts | dedicated preservation pass because custody and future intelligibility survive ordinary lifecycle and provenance questions             |

This treatment is provisional. A named framework becomes a separate pass if it
changes the unit, authority, failure signal or falsifying evidence rather than
only renaming an existing question.

## Unresolved evidence boundary

The most material unknowns remain external to the pinned source:

- lived teacher, pupil, editor, support, operator and framework-consumer
  outcomes, including non-adopters and people excluded from current channels;
- educational validity, curriculum governance, challenge and correction paths;
- current legal, licensing, privacy, safeguarding and supplier obligations,
  applicable human-rights duties, duty-bearers and exercised remedies;
- actual consumers, version distribution, usage profiles, extension needs and
  upgrade histories;
- production traffic, failures, queues, caches, resource use, telemetry,
  incidents, alerts, controls and promotion evidence;
- upstream service contracts, identity and transaction guarantees;
- applied branch, registry, hosting, infrastructure and security controls;
- historical reasons, decisions, incentives, ownership and migration intent;
- archival mandate, preservation objects, custodians, retention and disposal
  authority, fixity evidence and tested historical reproduction;
  and
- distributional impact, public reuse, maintenance capacity and ecosystem
  participation.

Until this evidence is gathered, the warranted result is a map of questions,
seams, explanations, propositions and invalidators. It is deliberately not a
premature architecture.
