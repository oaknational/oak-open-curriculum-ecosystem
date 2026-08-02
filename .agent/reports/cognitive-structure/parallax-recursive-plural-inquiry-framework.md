---
title: 'Recursive Plural Inquiry Framework'
short_title: 'RPIF'
name: 'Parallax'
subtitle: 'A multi-scale, multi-perspectival and recursively self-correcting framework for scientific and evidence-seeking inquiry'
framework_version: '0.1.0'
document_version: '0.1.0'
schema_version: '0.1'
status: 'first-complete-draft'
maturity: 'conceptual-alpha'
created: '2026-08-01'
modified: '2026-08-01'
language: 'en-GB'
document_type: 'framework-specification'
intended_audience:
  - researchers
  - practitioners
  - decision-makers
  - institutional-designers
  - agentic-system-designers
scope:
  - scientific inquiry
  - evidence-seeking inquiry
  - model-based learning
  - decision support under uncertainty
origin:
  type: 'collaborative-dialogue'
  participants:
    - 'Jim Cresswell'
    - 'ChatGPT'
attribution_status: 'to-be-agreed-before-publication'
licence: 'TBD'
canonical_uri: null
supersedes: null
epistemic_status: 'A reasoned synthesis and original proposal, not yet validated as a whole'
source_review_status: 'Foundational references checked; systematic literature review pending'
source_cutoff: '2026-08-01'
claim_status_scheme:
  - precedent-foundation
  - synthesis
  - proposal
  - definition
  - normative-commitment
  - working-assumption
  - empirical-conjecture
  - open-question
  - known-limitation
originality_note: 'Original means original to this formulation unless wider novelty is established by literature review'
change_policy: 'Semantic versioning: patch for clarification, minor for compatible extension, major for changes to core commitments or architecture'
review_status: 'Requires adversarial review, cross-domain case testing and practitioner evaluation'
review_due: null
tags:
  - scientific-method
  - philosophy-of-science
  - epistemology
  - methodological-pluralism
  - systems-thinking
  - meta-learning
  - causal-inference
  - decision-making
---

# Parallax: The Recursive Plural Inquiry Framework

> Parallax
> The Recursive Plural Inquiry Framework

## Abstract

The Recursive Plural Inquiry Framework (RPIF), more generally called Parallax, is a general architecture for disciplined inquiry where no single method, representation, scale or conceptual decomposition can be presumed sufficient. It treats scientific inquiry as a fallible, public and error-correcting process in which representations of the world are constructed, consequences are derived, evidence is gathered, alternatives are compared and confidence is revised.

Parallax extends that familiar structure in three ways. First, it applies multiple epistemic perspectives within any given scale. Second, it connects inquiry across interacting scales. Third, it treats the choice of scales, boundaries, dimensions and conceptual decompositions as itself plural and revisable. Inquiry is consequently represented as a network of epistemic ensembles and bridge models rather than as a single linear method or fixed hierarchy.

The framework also distinguishes object learning, meta-learning and meta-meta-learning. Higher-order learning is required to return to object-level investigation, alter practice and be evaluated against the original world and its consequences. This closes the recursive loop while preventing reflection from becoming detached self-commentary. Empirical contact, traceability, independent criticism, preservation of contrary evidence and protected ethical constraints prevent recursive adaptation from becoming self-validation.

Parallax is both theoretical synthesis and practical methodology, supplying terminology, an application cycle, records, governance, stopping/reopening rules, failure analysis and validation. It is not a final philosophy of science. Completeness is functional and provisional: cover every relevant epistemic function while remaining able to discover omissions.

## Reading guide

This document supports progressive disclosure:

1. **Sections 1–4** state the framework, scope and core commitments.
2. **Sections 5–9** explain its theoretical foundations and conceptual architecture.
3. **Sections 10–18** specify how to apply, govern and evaluate it.
4. **Sections 19–25** provide an example, validation programme, implementation guidance, provenance and references.

This is a first complete draft. Statements are marked where useful as:

- **Foundation:** adopted from, or strongly grounded in, established traditions.
- **Synthesis:** an integration or reinterpretation of established ideas.
- **Proposal:** a construct introduced by Parallax in its present form.
- **Open question:** unresolved and requiring conceptual or empirical investigation.

These labels do not establish historical priority; academic originality requires systematic literature and priority review.

---

## 1. Compact statement of the framework

> Scientific and evidence-seeking inquiry is a recursively governed network of plural epistemic ensembles. It constructs and compares representations within multiple scales, investigates alternative relationships between scales, and examines competing ways of defining the scales, boundaries and conceptual spaces themselves. It learns about its subject, about the effectiveness of its methods, and about how it selects and changes those methods. Higher-order learning is closed through altered object-level inquiry and evaluated against evidence, consequences and protected epistemic and ethical constraints.

In its shortest operational form, Parallax requires an inquiry to:

1. formulate the problem, purpose, affected parties and decision context;
2. expose assumptions, uncertainties, values and system boundaries;
3. construct serious alternative hypotheses, models and explanations;
4. identify relevant scales and at least one credible alternative decomposition;
5. cover the relevant epistemic functions with complementary methods;
6. derive discriminating expectations and design capable error probes;
7. gather and assess evidence with explicit measurement and causal assumptions;
8. execute complementary analyses both compositionally and in parallel;
9. preserve disagreement, frame dependence and unresolved uncertainty;
10. synthesise an epistemic profile rather than forcing a single verdict;
11. act, abstain, investigate further or reframe according to evidence, values, risk and information value;
12. evaluate outcomes and feed them into object, meta and meta-meta-learning;
13. reopen the inquiry when assumptions, contexts, evidence or consequences materially change.

### 1.1 Minimal architecture

Five interacting loops operate inside a constitutional envelope:

1. **World-facing inquiry loop:** question → alternatives → representation → consequences → evidence or intervention → error assessment → revision or action.
2. **Plural evaluation loop:** typed methods examine the same inquiry loci, partly independently and partly compositionally.
3. **Cross-scale loop:** explicit competing bridge accounts connect evidence and explanation across scales, times and units.
4. **Frame loop:** alternative decompositions, ontologies and boundaries are compared, including translation failure and information loss.
5. **Recursive learning loop:** object outcomes update methods; method histories update selection and governance; those changes return to object inquiry.

The **constitutional envelope** declares purpose, legitimate authority, values, protected constraints, risk tolerance, decision rights, transparency requirements and rules for modifying the inquiry system itself.

## 2. Purpose, scope and non-goals

### 2.1 Purpose

Parallax is designed to support inquiry when one or more of the following are true:

- several legitimate methods illuminate different aspects of the question;
- phenomena interact across spatial, temporal, causal, organisational or conceptual scales;
- system boundaries or units of analysis are contestable;
- evidence is incomplete, heterogeneous or partly theory-laden;
- explanation, prediction, intervention and practical value may diverge;
- decisions must be made under uncertainty;
- values, power or participation affect the production or interpretation of knowledge;
- the inquiry process itself must learn and improve over time;
- premature convergence would be materially costly or dangerous.

The framework is applicable to conventional scientific research and, with appropriate care, to engineering, medicine, policy, organisational learning, product development and artificial-agent systems. This extension does not make every disciplined activity scientific. Empirical claims remain answerable to empirical evidence; mathematical claims to proof; conceptual claims to coherence and usefulness; and normative claims to ethical and political reasoning that evidence can inform but cannot settle alone.

### 2.2 Scope boundaries

Parallax distinguishes four related but non-identical aims:

- **truth-oriented inquiry:** learning what is or was the case;
- **explanatory inquiry:** understanding why or through what mechanism;
- **predictive inquiry:** anticipating observations or outcomes;
- **action-oriented inquiry:** choosing interventions under values, constraints and uncertainty.

Success in one does not automatically establish success in the others. A useful predictive model may explain little. A compelling explanation may be poorly calibrated. An intervention may work without its presumed mechanism being correct. A true descriptive claim does not determine what ought to be done.

### 2.3 Non-goals

Parallax does not attempt to:

- provide a mechanical algorithm that eliminates judgement;
- declare one philosophy of science universally correct;
- reduce every form of knowledge to quantitative measurement;
- treat practical usefulness as identical to truth;
- make values derivable from empirical facts alone;
- demand every named methodology in every inquiry;
- guarantee certainty, neutrality or complete freedom from bias;
- turn all conceptual disagreement into commensurable numerical scores;
- replace domain expertise, ethical review or affected-community participation;
- create an infinitely ascending hierarchy of reflective processes;
- establish its own validity by internal coherence alone.

## 3. Foundational commitments

| Commitment                                                 | Requirement                                                                                                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fallibilism                                                | Empirical conclusions, methods and decompositions remain corrigible; warrant is not deductive certainty.                                               |
| Representational mediation                                 | Instruments, concepts, classifications, measurement and processing mediate observation; tests usually bear on assumption-packages.                     |
| Contrast                                                   | Use serious rival hypotheses, models, explanations, frames or nulls; do not grant the preferred account unique flexibility.                            |
| Capable error correction                                   | Prefer procedures likely to reveal important faults; agreement is weak when failure was hard to detect.                                                |
| Proportional updating                                      | Revise confidence according to evidence, assumptions and alternatives; operational binaries must not erase graded uncertainty.                         |
| Public criticisability                                     | Make claims, evidence and transformations appropriately inspectable for criticism, reproduction or replication, subject to privacy, safety and rights. |
| Disciplined pluralism                                      | Rigour within one method does not make it sufficient; compare contributions without treating all perspectives as equal.                                |
| Multi-scale reciprocity                                    | Permit upward generation, downward constraint, lateral interaction and feedback; neither reductionism nor holism has automatic priority.               |
| Recursive accountability                                   | Method and governance changes gain warrant by altering lower-level inquiry and encountering evidence and consequences.                                 |
| Bounded inquiry                                            | Make finite time, data, expertise, compute, burden and opportunity cost explicit in selection and stopping.                                            |
| Values and power                                           | Surface how purposes, categories, risk, authority and credibility shape inquiry without making empirical adequacy optional.                            |
| Ethical non-substitutability                               | Epistemic gain does not automatically compensate for unethical means or unjust burdens; some constraints are non-compensatory.                         |
| Consequential closure without consequentialism about truth | Outcomes test interventions and learning processes but do not redefine truth as whatever proved locally useful.                                        |

### 3.1 Empirical vulnerability

Scientific adjudication requires a claim, model or linked assumption-package to be vulnerable to conceivable evidence at least indirectly: evidence must be able to change confidence, expose inadequacy, distinguish alternatives or delimit scope. Strict falsifiability is one powerful form, not the whole. Probabilistic, historical and idealised claims may instead face calibration, likelihood, retrodiction, robustness or boundary tests. A proposition untouched by any conceivable evidence may still be clarified or classified as formal, conceptual, metaphysical or normative, but not presented as empirically adjudicated.

| Mode                    | Evidential relation                                                        |
| ----------------------- | -------------------------------------------------------------------------- |
| Direct                  | A specified observation conflicts with the claim under limited auxiliaries |
| Probabilistic           | Frequencies, calibration, likelihoods or distributions bear on it          |
| Historical/retrodictive | Surviving traces discriminate historical accounts                          |
| Intervention-based      | Manipulation distinguishes causal from associational expectations          |
| Package-dependent       | Evidence bears on linked focal and auxiliary assumptions                   |
| Model-relative          | Adequacy is tested for a purpose within boundaries                         |
| Currently inaccessible  | Possible tests exist but present access or instruments do not              |
| Non-empirical           | Formal, conceptual, metaphysical or normative adjudication is required     |

## 4. The general inquiry cycle

The foundational scientific cycle used by Parallax is:

1. **Encounter:** observe a phenomenon, anomaly, need or problematic situation.
2. **Frame:** formulate questions, purposes, boundaries, constructs and uncertainties.
3. **Generate:** construct competing hypotheses, explanations, causal accounts or models.
4. **Derive:** identify observable, retrodictive, probabilistic or intervention-relevant consequences.
5. **Discriminate:** design observations or interventions whose possible outcomes distinguish alternatives or expose relevant errors.
6. **Measure:** gather evidence with explicit construct, instrument, sampling and uncertainty models.
7. **Compare:** assess observations against expectations, alternatives and known failure modes.
8. **Update:** revise confidence, models, assumptions and boundaries proportionately.
9. **Criticise:** expose the work to independent challenge, reproduction, replication and alternative interpretation.
10. **Synthesise:** combine results without erasing disagreement, scope conditions or frame dependence.
11. **Act or continue:** intervene, abstain, collect more information, or reformulate the inquiry.
12. **Learn recursively:** evaluate outcomes and update both the subject model and the inquiry process.

This is a recurrent control loop, not a mandatory chronological sequence. Exploration may precede explicit hypotheses; modelling may expose measurement problems; an intervention may generate new observations; and a paradigm-level anomaly may force the question itself to be reformulated.

---

## 5. Theoretical foundations

The traditions below do not all compete at the same logical level. Some govern a local inference, some the design of tests, some the construction of models, some the historical development of research programmes, and some the social conditions under which criticism becomes effective. Parallax treats them as differentiated resources and preserves their tensions.

### 5.1 Principal traditions

| Tradition                                                | Primary object                                    | Central question                                                                            | Contribution to Parallax                                                                        | Characteristic limitation or tension                                                                                                                         |
| -------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hypothetico-deductive inquiry                            | Hypothesis or theory                              | What observable consequences follow if it is true with its auxiliaries?                     | Makes representations answerable to derived consequences                                    | Prediction failure does not by itself locate which assumption failed; confirmation may be shared by many alternatives                                        |
| Popperian falsification                                  | Conjecture                                        | What risky observation would conflict with it?                                              | Encourages empirical vulnerability, bold tests and active criticism                         | Simple rejection rules underdescribe probabilistic claims, auxiliary assumptions and legitimate persistence                                                  |
| Bayesian inference                                       | Probability over hypotheses, parameters or models | How should evidence change confidence?                                                      | Represents graded uncertainty and comparative evidential support                            | Results depend on likelihoods, priors, model space and data-generating assumptions; high posterior confidence is not identical to severe testing             |
| Peircean abduction and inference to the best explanation | Candidate explanation                             | What hypothesis could explain the surprising evidence, and which explanation is preferable? | Generates and compares explanatory alternatives                                             | Explanatory virtues can conflict; Peircean hypothesis generation should not be conflated without qualification with modern inference to the best explanation |
| Error-statistical and severe testing                     | Test procedure and inference                      | Would the method probably have exposed a relevant error?                                    | Evaluates the probing capability of evidence                                                | Does not by itself provide a complete comparative belief calculus or generate explanatory models                                                             |
| Model-based science                                      | Model and target relationship                     | What can be learned by constructing, manipulating and validating this representation?       | Handles idealisation, simulation, partial representation and purpose-relative adequacy      | Usefulness and fit can be mistaken for literal truth or unrestricted validity                                                                                |
| Lakatosian research programmes                           | Sequence of related theories                      | Is the programme predicting novel facts or merely accommodating failures?                   | Evaluates persistence and change over time rather than reacting mechanically to one anomaly | Judgements of progress can be retrospective and may tolerate degenerating work for too long                                                                  |
| Kuhnian paradigms                                        | Community, exemplars and conceptual scheme        | When do anomalies challenge the standards and categories of normal inquiry themselves?      | Makes conceptual, historical and institutional change visible                               | Primarily descriptive at this level; paradigms may be difficult to compare without overstating incommensurability                                            |
| Pragmatism and action inquiry                            | Problematic situation and practice                | What consequences follow, what resolves warranted doubt, and what enables reliable action?  | Connects inquiry to intervention, experience and continuing correction                      | Practical success must not be allowed to substitute automatically for truth, mechanism or justice                                                            |

### 5.2 Important complementary traditions

The initial philosophical list is not functionally complete. Parallax incorporates or reserves explicit places for the following:

| Capability                                      | Relevant tradition or discipline                                                            | Contribution                                                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Formal warrant                                  | Logic, mathematics, proof and formal verification                                           | Establishes consequences within declared axioms or specifications and detects inconsistency                                      |
| Statistical inference                           | Frequentist, likelihoodist, Bayesian and predictive approaches                              | Quantifies sampling behaviour, evidential relations, uncertainty and predictive performance through different formalisms         |
| Causal identification                           | Structural causal models, potential outcomes, experimental and quasi-experimental design    | Separates association, intervention and counterfactual claims; makes identification assumptions explicit                         |
| Mechanistic understanding                       | Mechanistic explanation                                                                     | Represents organised entities and activities that produce change; connects levels without assuming reduction                     |
| Measurement                                     | Metrology, measurement theory, psychometrics and construct validation                       | Distinguishes construct, measurand, instrument, result, error, uncertainty, traceability and invariance                          |
| Information acquisition                         | Experimental design, active learning and value-of-information analysis                      | Selects observations for discrimination and expected decision value rather than availability alone                               |
| Robustness                                      | Triangulation, sensitivity analysis, independent derivations, replication and meta-analysis | Tests whether results survive changes in assumptions, methods, samples and sites                                                 |
| Existing-evidence synthesis                     | Systematic review, qualitative evidence synthesis and meta-analysis                         | Discovers, appraises and combines prior studies while exposing selection, reporting, dependence, heterogeneity and applicability |
| Simulation assurance                            | Verification, validation and uncertainty quantification                                     | Distinguishes correct implementation from adequate representation of the target and propagates uncertainty                       |
| Complexity and emergence                        | Systems science, hierarchy theory, network science and multi-scale modelling                | Handles near-decomposability, emergence, feedback and reciprocal constraint                                                      |
| Reflexive and performative systems              | Cybernetics, observer-effect and performativity traditions                                  | Examines how inquiry, measurement and intervention change the system being investigated                                          |
| Collective objectivity                          | Social epistemology, open science and institutional epistemology                            | Treats criticism, diversity, incentives, access and governance as epistemic infrastructure                                       |
| Situated knowledge                              | Feminist and standpoint epistemologies; epistemic-injustice scholarship                     | Reveals systematic blind spots and credibility or interpretive deficits produced by power                                        |
| Epistemic sovereignty and place-based knowledge | Indigenous, local and decolonial research traditions                                        | Challenges extractive research, protects authority over knowledge and contributes long-duration, situated understanding          |
| Meaning and lived experience                    | Qualitative, interpretive, ethnographic and participatory methods                           | Investigates context, meaning, mechanism and experience that predetermined variables may obscure                                 |
| Decision and action                             | Decision theory, risk analysis and adaptive management                                      | Separates belief from choice and incorporates losses, thresholds, reversibility and information value                            |
| Organisational learning                         | Double-loop learning, reflective practice and learning-organisation traditions              | Connects operational correction to revision of methods, norms and governance                                                     |
| Research ethics                                 | Rights-based, professional and participatory ethics                                         | Constrains permissible inquiry and the distribution of burdens and benefits                                                      |
| Concept formation                               | Conceptual-spaces theory, ontology engineering and measurement construction                 | Makes category formation and similarity structure explicit and revisable                                                         |

The **Duhem–Quine assumption-package problem** means that success or failure usually bears on a focal claim plus auxiliaries, measurement and background theory. Parallax maps and varies these dependencies to localise error. **Realist, instrumentalist, entity-realist, structural-realist and critical-realist** interpretations disagree about what successful representations disclose; Parallax requires claims to state whether they are literal, structural, causal, instrumental or purpose-relative rather than imposing one settlement.

The table is functional rather than taxonomic: these traditions answer unlike questions and must not be blended into one evidential semantics. The World-Return Contract remains an Parallax proposal; §25 supplies the primary genealogy and methodological standards.

### 5.3 Productive tensions retained by Parallax

Parallax does not resolve the following tensions by declaration:

- confirmation versus attempted refutation;
- posterior confidence versus test severity;
- prediction versus explanation;
- difference-making causation versus mechanism;
- literal truth versus purpose-relative model adequacy;
- individual inference versus socially achieved objectivity;
- local test performance versus research-programme progress;
- cumulative development versus paradigm change;
- detached observation versus participatory intervention;
- epistemic value versus practical value;
- realism versus instrumentalism;
- standardisation versus context sensitivity;
- minimal independent representation versus productive redundancy.

Instead, it records which question each perspective answers and preserves disagreement until a justified translation, localisation or decision is possible.

### 5.4 Scientific pluralism and perspectivism

**Foundation and synthesis.** Parallax belongs broadly with scientific pluralism and perspectivism: multiple models, methods or representations may be necessary without implying that every account is equally warranted or that reality is determined by perspective. Its distinctive design requirement is that multiplicity be accompanied by explicit compatibility, dependency, translation, conflict and adjudication rules. Relevant foundations include Kellert, Longino and Waters's [_Scientific Pluralism_](https://www.upress.umn.edu/9780816647637/scientific-pluralism/), Ronald Giere's [_Scientific Perspectivism_](https://doi.org/10.7208/chicago/9780226292144.001.0001), and Hasok Chang's [_Is Water H₂O? Evidence, Realism and Pluralism_](https://link.springer.com/book/10.1007/978-94-007-3932-1).

## 6. Core terminology

| Term                    | Definition in Parallax                                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain                  | The target subject or system of inquiry                                                                                                                                          |
| Inquiry context         | Domain, purpose, questions, decisions, stakeholders, values, risks, horizons and resources                                                                                       |
| Inquiry                 | A bounded but revisable process for resolving uncertainty, explaining phenomena or supporting action                                                                             |
| Inquiry object          | The phenomenon, system, claim, decision or problematic situation under investigation                                                                                             |
| Claim                   | A proposition with a stated type, scope and epistemic status                                                                                                                     |
| Hypothesis              | A candidate proposition exposed to empirical or logical evaluation                                                                                                               |
| Theory                  | A structured explanatory or representational system, not a mathematical theorem                                                                                                  |
| Model                   | A selective representation used to describe, explain, predict, simulate or intervene                                                                                             |
| Evidence                | Information bearing on a claim relative to assumptions and alternatives                                                                                                          |
| Test                    | A procedure connecting possible observations to differential implications for claims or models                                                                                   |
| Error probe             | A test or analysis designed to reveal a specified class of error                                                                                                                 |
| Lens                    | A bounded perspective or set of questions applied to an inquiry object                                                                                                           |
| Epistemic function      | A necessary kind of work in inquiry, such as measurement, causal identification or uncertainty management                                                                        |
| Scale                   | A position along one or more dimensions of resolution, extent, organisation, time, causation or abstraction                                                                      |
| Stratum                 | A defined level or region within one frame; it need not be globally comparable with strata in another frame                                                                      |
| Inquiry locus           | A scoped question at a particular frame, stratum, time and unit of analysis                                                                                                      |
| Frame                   | A coordinated set of concepts, dimensions, boundaries, representations and admissible operations                                                                                 |
| Frame ecology           | The currently declared portfolio of considered frames, including partially or non-translatable frames and their interactions; it remains open to excluded or undiscovered frames |
| Frame atlas             | The subset of frames connected by meaningful partial transformations over sufficiently shared structure                                                                          |
| Epistemic ensemble      | Multiple complementary or competing lenses, models or methods retained at a given locus of inquiry                                                                               |
| Bridge model            | An explicit account of how representations or phenomena at different scales relate                                                                                               |
| Decomposition           | A choice of entities, dimensions, boundaries, parts, levels or coordinates through which the object is represented                                                               |
| Topology                | The pattern of scales, frames and relationships used to organise an inquiry                                                                                                      |
| Transformation          | A mapping from one representation or frame to another, with its reversibility and information loss stated                                                                        |
| Invariant               | A result or relationship that survives specified changes of frame, method, scale or representation                                                                               |
| Defeater                | Evidence or argument that blocks a conclusion unless specifically answered, scoped or shown irrelevant                                                                           |
| Dependency map          | A record of shared data, instruments, assumptions, methods or incentives that can create correlated support or failure                                                           |
| Frame-robust finding    | A finding retained across specified, materially different and adequately tested frames                                                                                           |
| Frame-dependent finding | A finding whose dependence on a representation or decomposition is itself part of the result                                                                                     |
| Epistemic profile       | A structured, multi-dimensional assessment that preserves support, error exposure, uncertainty, disagreement and scope                                                           |
| Learning trace          | A provenance record linking inputs, assumptions, operations, changes and outcomes                                                                                                |
| Recursive closure       | The return of higher-order learning to altered object-level inquiry and evaluation against the world                                                                             |

“Theorem” is reserved for a proposition established deductively from axioms or prior results. Empirical science ordinarily evaluates hypotheses, theories, models and claims rather than falsifying mathematical theorems.

---

## 7. The three forms of pluralism

| Form                | Scope                                                                                                                                                                                       | Required questions                                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Intra-scale**     | Multiple methods, models and explanations operate at any selected locus—including measurement, model, programme, community or governance.                                                   | What distinct contribution and error class does each expose? Is agreement independent or assumption-correlated? Is conflict empirical, inferential, conceptual or normative? |
| **Inter-scale**     | Ensembles at different scales operate concurrently: lower processes may generate higher patterns; higher structures may constrain lower behaviour; lateral coupling and feedback may occur. | Which competing **bridge hypotheses** explain the relation, direction and timing? What evidence, auxiliaries, information loss and cross-level fallacy risks apply?          |
| **Decompositional** | Alternative entities, dimensions, boundaries, scale concepts and topologies are compared rather than naturalised.                                                                           | What does each decomposition reveal or hide? Are mappings reversible, lossy or ontologically incompatible? Would a network, field or process replace an assumed hierarchy?   |

The intra-scale principle applies at every scale, but not through the same named methods: metrology and Kuhnian analysis answer different-level questions. “Scale” may mean spatial extent, duration, causal granularity, organisation, abstraction, aggregation, evidential resolution or historical maturity; these cross-cut rather than forming one ladder.

Structurally, plurality therefore occurs at:

- **nodes**—accounts in an epistemic ensemble \(P_s\);
- **edges**—candidate bridges \(B_{s,t}\) between loci;
- **topologies**—alternative graphs \(G_k\) of the domain.

The notation is organisational, not a claim that conceptual inquiry is literally a linear or probabilistic graph. **Horizontal pluralism** compares accounts at a locus; **vertical pluralism** connects and mutually constrains loci. Decompositional pluralism makes both recursive by allowing the scales and their arrangement to change.

## 8. Conceptual spaces, frames and decomposition

### 8.1 Basis-set analogy

**Proposal with antecedents.** A conceptual decomposition can be assessed by analogy with a mathematical basis or frame, without claiming that conceptual spaces are naturally linear. Gärdenfors supplies an important geometric antecedent; Parallax's bases, frames and atlases are a methodological synthesis.

| Mathematical property      | Conceptual analogue                                                |
| -------------------------- | ------------------------------------------------------------------ |
| Span                       | Relevant cases and distinctions are representable                  |
| Independence               | A dimension contributes something not recoverable from others      |
| Orthogonality              | Contributions overlap minimally under a declared functional metric |
| Basis change               | Redescription preserves material information                       |
| Invariant                  | A result survives a specified transformation                       |
| Projection/coarse-graining | Detail or degrees of freedom are deliberately omitted              |
| Conditioning               | Small framing changes do not cause uncontrolled conclusions        |
| Overcomplete frame         | Redundancy improves reconstruction and error detection             |
| Local chart/atlas          | Bounded representations overlap to cover a wider domain            |

### 8.2 Approximate functional orthogonality

Conceptual spaces usually lack a natural origin, linear combination and inner product; meaning is contextual and historically mutable. Parallax therefore treats

\[
\langle d_i,d_j\rangle_C
\]

only as a context-relative model of overlap between the distinctions, predictions, error classes and decisions enabled by dimensions \(d_i,d_j\). Low overlap suggests **functional**, not exact, orthogonality. This is not statistical independence: distinct dimensions may be causally correlated, while uncorrelated latent factors may be meaningless. PCA, factor analysis or representation learning can suggest axes but cannot establish conceptual adequacy.

A minimal basis favours compression; reliable inquiry may favour an **overcomplete epistemic frame** whose partly independent components improve interpretation and error detection. Redundancy helps only when dependencies are mapped: repeated analyses of one dataset and ontology are not independent confirmations.

### 8.3 Atlas, federation and ecology

| Structure      | Relationship among frames                                                                    |
| -------------- | -------------------------------------------------------------------------------------------- |
| **Atlas**      | Local frames share enough structure for meaningful partial transition mappings               |
| **Federation** | Frames exchange selected claims or observations without a global reversible map              |
| **Ecology**    | Partly incompatible frames coexist, compete, specialise and alter the conceptual environment |

Parallax must not invent a shared underlying space to rescue the analogy.

### 8.4 Transformation classes

| Class                          | Requirement                                                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Re-expression/basis change** | Substantially preserves information and is reversible for the purpose                                             |
| **Projection/coarse-graining** | Deliberately loses, aggregates or integrates detail; omitted information and aggregation risks are stated         |
| **Ontology change**            | Reconstitutes entities, relations, questions or evidential standards; translation may be asymmetric or impossible |

Classification can be disputed or continuous; record the dispute rather than settling it by vocabulary.

### 8.5 Candidate coordinate families

Possible dimensions include spatial resolution; temporal horizon and path dependence; causal granularity and direction; component/network/system organisation; individual/group/population/institution; operational/strategic/paradigmatic abstraction; observer/participant/affected standpoint; evidence source; modelling language; intervention locus; value, risk and distribution; developmental phase; and certainty, maturity and reversibility. These are candidates, not asserted independent axes: scale is normally a vector or relation, not one scalar.

### 8.6 Frame-quality criteria

| Criterion                | Test                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| Coverage                 | Which cases, people or phenomena are unrepresentable?             |
| Distinct contribution    | Which prediction, interpretation or error appears only here?      |
| Separability/redundancy  | Can a dimension vary independently, or is it renamed duplication? |
| Conditioning             | Are conclusions unstable under small framing changes?             |
| Translation/loss         | What maps elsewhere, with what distortion?                        |
| Invariance               | What survives materially different representations?               |
| Generativity/error yield | What new questions or otherwise hidden failures appear?           |
| Legibility/cost          | Can relevant critics use it, at proportionate burden?             |

Frame robustness strengthens the specified invariance claim only when frames are materially different, adequate and dependency-aware. Frame dependence is itself a result; failed translation may reveal loss, incompatible ontologies or conceptual transition.

## 9. Epistemic-function coverage

Parallax seeks functional completeness rather than the equal execution of every named philosophy. Every inquiry conducts a standing scan of the following functions and either addresses each material function or records why it is not applicable or remains uncovered.

| ID  | Epistemic function                        | Core question                                                                                                                             |
| --- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| F01 | Problem formation                         | What problem, uncertainty or decision is actually being addressed?                                                                        |
| F02 | Concept and ontology formation            | What entities, constructs, categories and relations are assumed?                                                                          |
| F03 | Boundary and scale selection              | What is included, excluded and resolved at which scales?                                                                                  |
| F04 | Alternative generation                    | What credible rival hypotheses, explanations, models or frames exist?                                                                     |
| F05 | Representation and modelling              | How is the target selectively represented, and for what purpose?                                                                          |
| F06 | Observation and measurement               | What is observed or measured, how, and with what validity and uncertainty?                                                                |
| F07 | Existing-evidence discovery and synthesis | Which prior evidence exists, how was the corpus selected, how trustworthy and dependent are its members, and what synthesis is warranted? |
| F08 | Consequence derivation                    | What observations should be expected under each alternative?                                                                              |
| F09 | Empirical discrimination                  | Which observation or intervention can distinguish the alternatives?                                                                       |
| F10 | Error detection and severity              | Which important faults could this procedure reveal or miss?                                                                               |
| F11 | Uncertainty and updating                  | How should confidence change, and how sensitive is it to assumptions?                                                                     |
| F12 | Causal identification                     | What supports intervention or counterfactual claims?                                                                                      |
| F13 | Mechanistic explanation                   | What entities and activities produce the phenomenon?                                                                                      |
| F14 | Robustness and generalisation             | What survives changes of method, model, sample, site or context?                                                                          |
| F15 | Cross-scale integration                   | Which bridges connect scales, and where is information lost?                                                                              |
| F16 | Interpretation and meaning                | How do participants understand and experience the phenomenon?                                                                             |
| F17 | Social criticism and standpoint           | Whose knowledge, interests and blind spots shape the inquiry?                                                                             |
| F18 | Ethics and distribution                   | Are means, burdens, benefits and exclusions legitimate?                                                                                   |
| F19 | Decision and intervention                 | What action follows under explicit values, risks and constraints?                                                                         |
| F20 | Programme and paradigm development        | Is the wider inquiry progressing, degenerating or conceptually shifting?                                                                  |
| F21 | Recursive method learning                 | Which methods, frames and selection rules should change?                                                                                  |

For each function, a coverage matrix records:

- applicability and materiality;
- selected methods or traditions;
- frames and scales addressed;
- evidence required;
- responsible contributors;
- status: `unconsidered`, `not-applicable`, `considered`, `executed`, `triangulated` or `unresolved`;
- gaps, dissent and accepted limitations.

Coverage is not a percentage. Failure on a critical function cannot be compensated by excellent performance on several immaterial ones.

---

## 10. Recursive learning architecture

### 10.1 Three pragmatic levels

| Level                  | Object of learning                                                           | Principal question                                                | Required output                                                 |
| ---------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| L0: object learning    | Target phenomenon, claim or intervention                                     | What have we learned about the subject?                           | Updated claims, models, predictions, explanations or actions    |
| L1: meta-learning      | Methods, frames, bridges and combinations used in L0                         | Which approaches worked, failed or complemented one another here? | Method- and frame-performance record; proposed practice changes |
| L2: meta-meta-learning | Rules and governance used to generate, select, combine and revise L1 methods | How well does the inquiry system learn how to learn?              | Versioned changes to selection, evaluation and governance rules |

These levels are analytically distinct but concurrent. An L0 anomaly may immediately expose an L1 measurement failure. Repeated L1 failures may reveal an L2 selection bias. An L2 governance change can alter which L0 questions become visible.

### 10.2 Reflective closure rather than infinite regress

Parallax does not require an endless tower of meta-meta-meta-levels. Beyond L2, the same general inquiry operator is applied reflexively to its own historical operation. The three-level distinction remains for legibility, provenance and governance; recursive self-application provides closure.

Formally, if \(\mathcal{L}(X;M,G)\) denotes learning about object \(X\) using methods \(M\) under governance \(G\), then:

- L0 updates representations of \(X\);
- L1 updates \(M\) from traces of \(\mathcal{L}\);
- L2 updates selection and governance \(G\) from histories of those method updates;
- revised \(G\) and \(M\) are returned to a subsequent \(\mathcal{L}(X;M,G)\).

This notation does not imply that learning is fully computable or that one scalar objective exists.

### 10.3 The world-return requirement

**Proposal.** A higher-order learning claim remains incomplete until it produces a specified change in object-level inquiry and that change encounters evidence or consequences.

Every material L1 or L2 revision should carry a **World-Return Contract** stating:

- the proposed change;
- the evidence and failures motivating it;
- where it applies and does not apply;
- the expected change in object-level behaviour;
- the expected beneficial signal;
- possible adverse or distributional effects;
- the comparison or baseline;
- the observation period;
- review and rollback conditions.

For example, if L2 concludes that adversarial alternative generation should occur earlier, the contract might predict fewer unanticipated failure modes and less premature convergence. Subsequent inquiries test that prediction. Their outcomes become evidence about the L2 change.

### 10.4 The target, inquiry and intervention systems

Recursive inquiry should distinguish:

- the **target system** being studied;
- the **inquiry system** producing representations and evidence;
- the **intervention system** acting on the target;
- the wider **consequence environment** in which effects propagate.

These systems may overlap. Participation, measurement and intervention can change the target; publication can change incentives; an adaptive target may respond strategically to observation. Closure therefore includes checking whether the act of inquiry has invalidated the original frame.

### 10.5 Protected evaluative anchors

Recursive systems can become self-validating by changing their methods and success criteria together. Parallax therefore protects, subject to explicit constitutional-level review:

- continued empirical contact;
- logical consistency and visible inferential steps;
- preservation of raw, negative and contrary evidence where lawful, ethical, safe and feasible, with governed reasons recorded for any restriction or disposal;
- explicit uncertainty and scope conditions;
- versioned assumptions and transformations;
- independent criticism proportional to stakes;
- separation of factual assessment from action authority;
- meaningful affected-party feedback;
- rights, safety and ethical constraints;
- prohibition on silently changing both a method and the criterion used to evaluate it.

No single internal metric is an ultimate anchor. External evidence, independent perspectives and worldly consequences provide anti-circular constraint.

## 11. Application modes and mandatory core

### 11.1 Selecting depth

Depth increases with:

- stakes and possible harm;
- irreversibility;
- uncertainty and ambiguity;
- novelty;
- system complexity and cross-scale coupling;
- substantive disagreement;
- vulnerability to hidden bias or power imbalance;
- distributional consequences;
- delayed or difficult-to-detect failure.

These factors should not be averaged into a single score by default. One critical dimension can justify deeper assurance. Urgency may shorten investigation, but should usually increase reversibility, monitoring, provenance and reopening readiness rather than erase safeguards.

| Mode         | Appropriate use                                                                   | Characteristic depth                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Screening    | Classification, routing and deciding whether Parallax applies                         | Question typing, empirical-vulnerability check, ethics and scope triage                                                                     |
| Core         | Low-to-moderate stakes or a reversible probe                                      | Mandatory records, credible alternatives and at least one materially different challenge                                                    |
| Standard     | Material scientific, engineering or organisational inquiry                        | Multiple frames and scales, parallel analysis, bridge testing and robustness work                                                           |
| Deep         | High-stakes, irreversible, contested, rights-sensitive or safety-relevant inquiry | Independent review, meaningful affected-party participation, preregistration where suitable, extensive sensitivity analysis and replication |
| Programmatic | A long-lived research, policy or organisational learning system                   | Portfolio evidence, Lakatosian and Kuhnian monitoring, and governed meta-meta-learning                                                      |

### 11.2 Meaning of exhaustive execution

Literal execution of every named tradition at every scale is neither provably exhaustive nor normally tractable. Parallax distinguishes:

- **function-complete consideration:** every standing epistemic function is scanned;
- **coverage-complete execution:** every material function is executed or an accountable gap is recorded;
- **bounded exhaustive execution:** all members of an explicitly bounded method or frame set are run;
- **adaptive depth:** effort is concentrated where stakes, disagreement, error risk and information value justify it.

The most demanding mode combines coverage-complete execution with deliberately broad parallel analysis. It must still state what lay outside its declared universe.

### 11.3 Mandatory core

Every completed Parallax inquiry includes:

1. a versioned Inquiry Charter and question classification;
2. explicit purpose, intended use and affected parties;
3. credible alternatives, including a null or rival account where meaningful;
4. evidence, measurement and transformation provenance;
5. empirical-vulnerability and relevant-error analysis;
6. a scan of all standing epistemic functions;
7. at least one materially different frame, inference route or adversarial perspective—or a recorded reason it is unavailable;
8. preservation of unresolved conflict and contrary evidence;
9. a multi-dimensional Epistemic Profile;
10. a conclusion or action record with uncertainty and boundary conditions;
11. stopping grounds and reopening triggers;
12. an L0 update and an L1 retrospective;
13. submission of method-performance traces to the L2 process.

L2 revision need not occur in every inquiry. It usually requires evidence across a portfolio, but every inquiry should contribute to it.

## 12. Practical methodology

These phases are coordination points in a recursive network, not a waterfall. Any result may reopen an earlier phase. Each phase names its central work, required records and a gate for proceeding.

### Phase 0: establish legitimacy, governance and safety

Identify sponsors, investigators, decision owners and affected parties; conflicts, rights, consent, privacy, safeguarding and safety requirements; protected constraints; review requirements; evidence custody and publication rules; and whether work is exploratory, confirmatory or decision-authorising.

**Records/gate:** governance, ethics, risk, roles and initial assurance mode. Proceed only with legitimate authority, proportionate safeguards and a viable route to criticism.

### Phase 1: create the Inquiry Charter

Classify questions as descriptive, predictive or retrodictive, causal, explanatory, interpretive, engineering, decision-theoretic, normative, formal, conceptual or metaphysical. Decompose mixed questions while preserving dependencies. State purpose, systems, claims, uncertainty, empirical vulnerability, boundaries, candidate scales, decisions, affected parties, values, resources, stopping conditions and reopening triggers.

**Record/gate:** versioned Charter. Empirical, formal, conceptual and normative components must be distinguished without severing legitimate relationships.

### Phase 2: map concepts, measurements and assumptions

Define constructs, entities, classifications, measurands and operationalisations. Map instruments, sampling, transformations, calibration, uncertainty, construct validity and invariance; identify central and auxiliary assumptions, excluded experiences, known unknowns and suspected unknowns.

**Records/gate:** concept/ontology map, measurement model, assumption register and evidence-lineage plan. Every material observation must have a defensible relationship to the concept it supports.

### Phase 3: construct frames, scales and topologies

Create a primary frame and a deliberately different counter-frame. Examine spatial, temporal, causal, organisational, evidential and abstraction scales; what each frame reveals or obscures; alternative topologies and bridge hypotheses; and whether transformations are re-expression, projection/coarse-graining or ontology change. Assess coverage, distinct contribution, conditioning, translation, loss and error yield.

**Records/gate:** frame atlas/federation/ecology, scale graph, bridge register and transformation-loss record. No boundary or layer structure may remain silently naturalised.

### Phase 4: generate alternatives and compose the ensemble

Generate hypotheses from theory, abduction, exploration and affected knowledge. Include serious null, rival, mechanistic and boundary-failure accounts; strengthen rather than caricature them; scan epistemic-function coverage; choose methods; decide what should remain initially independent; and map dependencies that could create false triangulation.

**Records/gate:** Alternative Register, coverage matrix, method rationale and dependency map. The preferred account must not monopolise specificity, flexibility or evidence.

### Phase 5: derive consequences and design the evidence programme

For each alternative derive predictions, retrodictions, qualitative expectations and intervention consequences. Identify non-discriminating observations and relevant discrepancies; assess severity, power and sensitivity; design experiments, quasi-experiments, observations, simulations, qualitative inquiry or archival work; state causal-identification assumptions; and compare information value with cost, delay and burden. Preregister confirmatory elements where suitable while retaining an explicit exploratory route.

For prior evidence, predeclare sources, searches, dates, eligibility, screening, deduplication and updates; seek protocols, registries, preprints, grey literature and negative results; appraise design, measurement, analysis, conflicts, reporting, relevance and shared dependencies; and choose statistical, qualitative, mixed-method or narrative synthesis according to heterogeneity and the question.

**Records/gate:** expectation matrix, evidence-corpus and synthesis protocol, error-probe and causal plans, analysis plan and information-value assessment. Planned evidence must be able to discriminate or expose a material error.

### Phase 6: execute parallel and composite inquiry

In a protected parallel pass, approaches receive a versioned common evidential core plus method-appropriate evidence and access; all differences and exclusions are recorded. Before reconciliation each records claims, alternatives, assumptions, expectations, evidence for and against, errors, boundaries, uncertainty, proposed tests and action implications. Separate analysts or agents are not independent when training, prompts, data, tools, ontology or incentives are shared.

The comparative pass distinguishes independent convergence, correlated agreement, complementary answers, semantic disputes and empirical, method, frame, bridge, ontology or value conflict. The composite pass then lets methods interact deliberately: for example, abduction generates candidates, modelling sharpens them, deduction derives consequences, severe testing probes errors, Bayesian analysis updates uncertainty, qualitative inquiry revises constructs, and causal, mechanistic and decision work connect explanation to action.

**Records:** method reports, dependency-aware comparison, revised tests/frames and Conflict Ledger. Iterate while expected epistemic or practical value remains material.

### Phase 7: assess evidence and update representations

Verify quality, lineage and measurement assumptions. Report prior-evidence discovery and departures; appraise bias, selective reporting, missing or dependent results, heterogeneity and applicability; synthesise only where constructs, estimands, contexts and dependencies permit. Compare outcomes with alternative-specific expectations; assess uncertainty, severity, sensitivity, robustness, generalisation and transport; update claims, bridges, frames or topology; preserve negative results, anomalies and residuals.

**Records:** updated claims/models, evidence-corpus and synthesis record, robustness results, Anomaly Register and preliminary Epistemic Profile.

### Phase 8: diagnose disagreement and synthesise without collapse

Classify each disagreement as semantic, measurement, inferential, causal/mechanistic, model/auxiliary, scale/bridge, boundary/topology, ontology, value/risk or decision-threshold. Check that accounts address the same proposition; localise divergent assumptions; attempt translation and record loss; identify discriminating evidence; and branch conclusions when resolution is unavailable. Do not confuse epistemic resolution with decision management.

**Records:** Conflict Ledger, Epistemic Profile and synthesis with minority reports.

### Phase 9: decide, intervene or abstain

Separate findings from objectives, utilities and protected constraints. Compare options and distributions under reversibility, precaution, robustness, regret and further-information considerations. State decision-relevant uncertainty; prefer safe-to-learn interventions when urgency limits inquiry; define monitoring, rollback and compensation. Acting, abstaining, probing, gathering evidence and reframing are all valid outcomes.

**Records:** Decision and Action Record, implementation/monitoring plan, accepted residual risk and reopening triggers.

### Phase 10: observe consequences and close the object loop

Monitor intended and unintended outcomes across scales and horizons; compare them with predictions and decision assumptions; examine distributional and delayed effects; determine whether inquiry or intervention changed the target; update L0 and reopen as required.

**Records:** consequence record, updated Epistemic Profile and object-level closure/reopening decision.

### Phase 11: conduct meta-learning

For each method, frame and bridge, record unique errors and assumptions exposed, discriminating evidence, influence on confidence/action, calibration or out-of-sample performance, costs and delays, failures, dependencies and applicable contexts.

**Records:** Method and Frame/Bridge Performance Ledgers; justified L1 changes receive World-Return Contracts.

### Phase 12: conduct portfolio-level meta-meta-learning

Across inquiries assess the function inventory, depth allocation, repeated omission or overuse, frame quality, conflict handling, stopping, incentives, metric gaming and whether L1 changes improve L0 outcomes under their contracts.

**Records:** versioned framework-change proposal with evidence, alternatives and dissent; migration, review and rollback plan; approved framework version.

---

## 13. Synthesis, conflict and the Epistemic Profile

### 13.1 Parallel and composite operation are complementary

**Synthesis.** Composite execution allows methods to cooperate; protected parallel execution prevents their differences from disappearing too early.

- **Composite execution:** one method's output legitimately becomes another's input.
- **Protected parallel execution:** materially different approaches retain independent initial formulations long enough to reveal assumptions, disagreements and common-mode failures.

Logical independence does not require literal simultaneity. An “independent first pass, reconciliation second” protocol is often sufficient. Conversely, literal parallelism does not guarantee independence.

### 13.2 The ensemble is not a voting body

The following conflict rules apply:

1. Agreement gains force only to the extent that routes, assumptions and error channels are materially independent.
2. Correlated evidence must not be double-counted.
3. Several weak favourable results do not automatically defeat one decisive counter-result.
4. A high posterior probability does not prove that a severe test occurred.
5. Explanatory elegance does not replace discriminating evidence.
6. Practical success does not by itself establish a proposed cause or mechanism.
7. Failure to detect an effect is informative only relative to measurement validity and test capability.
8. A value disagreement must not be relabelled as an empirical disagreement.
9. Higher-scale success does not validate every lower-scale account, or vice versa.
10. Minority accounts are preserved while materially live, not made immortal after their empirical content has been defeated.

A **defeater** is a result or argument that blocks a conclusion unless specifically answered. Defeaters are recorded explicitly and cannot be removed by an aggregate score. They may later be answered, scoped, superseded or shown irrelevant, with the history retained.

### 13.3 Conflict Ledger

Every material conflict receives one of these types:

- semantic or definitional;
- empirical or measurement;
- inferential or statistical;
- causal or mechanistic;
- model or auxiliary assumption;
- scale, stratum or bridge;
- boundary or topology;
- ontology or incommensurability;
- value, risk or ethical constraint;
- decision threshold or loss function.

Possible states are:

- `unresolved`;
- `awaiting-evidence`;
- `conditional-on-assumption`;
- `dissolved-by-clarification`;
- `translated-not-resolved`;
- `adjudicated-by-evidence`;
- `decision-managed-epistemically-open`;
- `deferred`;
- `defeated`;
- `retired-with-reopening-trigger`;
- `superseded`.

### 13.4 Epistemic Profile

The primary synthesis output is multi-dimensional. Fields are populated only where relevant, but omission is visible.

| Dimension                              | Assessment question                                                                |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| Claim type and scope                   | Exactly what is asserted, for which population, context and time?                  |
| Measurement validity                   | Do observations validly represent the relevant constructs or measurands?           |
| Empirical agreement                    | How well do observations match expectations?                                       |
| Disconfirmation                        | Which expectations or assumption-packages have failed?                             |
| Predictive or retrodictive performance | How accurate and calibrated is the account on appropriate data?                    |
| Probabilistic support                  | How do likelihoods, priors and model alternatives affect confidence?               |
| Severity and sensitivity               | Which discrepancies and errors could the inquiry detect?                           |
| Causal identification                  | Which intervention or counterfactual claims are warranted, under what assumptions? |
| Mechanistic adequacy                   | Is there a supported account of productive organisation and process?               |
| Explanatory scope                      | What does the account explain and unify, and what remains unexplained?             |
| Model adequacy                         | For which purposes and boundary conditions is the model fit?                       |
| Robustness                             | What survives changes in assumptions, method, sample, site or analyst?             |
| Generalisation and transport           | Where should findings transfer, and why?                                           |
| Cross-scale coherence                  | Which bridges are supported and where is information lost?                         |
| Frame dependence                       | Which findings vary with decomposition or ontology?                                |
| Frame robustness                       | Which findings survive specified, materially different frames?                     |
| Evidence dependence                    | Where do apparently separate findings share data, instruments or assumptions?      |
| Programme trajectory                   | Is the wider research programme progressive, stagnant or degenerating?             |
| Practical performance                  | What outcomes follow from action, over which horizons?                             |
| Ethical and legitimacy status          | Are means, authority and distributions acceptable?                                 |
| Dissent and defeaters                  | What remains contested or blocks stronger conclusions?                             |
| Known unknowns                         | What is explicitly unresolved?                                                     |
| Suspected blind spots                  | Which missing frames, evidence or stakeholders may matter?                         |

Suggested conclusion labels include:

- `supported-within-scope`;
- `provisionally-supported`;
- `challenged`;
- `unresolved`;
- `frame-dependent`;
- `bridge-dependent`;
- `incommensurable-across-specified-frames`;
- `decision-sufficient-under-declared-values`;
- `not-empirically-adjudicable`;
- `not-yet-tested`.

No label replaces the profile. A separately governed decision policy may map the profile to action using declared values, losses, constraints, reversibility and risk tolerance.

## 14. Required records and minimal templates

### 14.1 Record set

An Parallax implementation should support, proportionately:

- Inquiry Charter;
- claim and empirical-vulnerability register;
- stakeholder, value and authority map;
- concept, ontology and assumption registers;
- Frame Ecology and transformation register;
- inquiry graph and typed bridge register;
- epistemic-function coverage matrix;
- alternative, model and mechanism ledger;
- evidence, measurement and provenance ledger;
- prior-evidence corpus, search, selection, appraisal and synthesis record;
- dependency and common-mode-failure map;
- test or intervention protocol;
- uncertainty and error register;
- parallel method reports;
- Conflict, Defeater and Minority Report Ledger;
- Epistemic Profile;
- Decision, Action and Residual Risk Record;
- outcome-monitoring plan;
- L1 Method Performance Ledger;
- L2 Framework Change Log and World-Return Contracts;
- version history and migration guide.

A lightweight inquiry may combine several records in one Markdown file. High-volume programmes may use a relational or graph store. Tool complexity must be earned by retrieval, traceability or coordination needs.

### 14.2 Inquiry Charter

```yaml
inquiry:
  id: ''
  title: ''
  framework_version: '0.1.0'
  status: 'open'
  purpose: ''
  target_system: ''
  inquiry_system: ''
  intervention_system: ''
  questions:
    - id: 'Q1'
      proposition: ''
      type: []
      empirical_vulnerability: ''
  decision:
    options: []
    deadline: null
    reversibility: ''
    cost_of_delay: ''
  scope:
    boundaries: []
    exclusions: []
    time_horizons: []
    candidate_scales: []
  stakeholders: []
  values:
    objectives: []
    protected_constraints: []
  assurance:
    mode: 'core'
    depth_drivers: []
    resources: {}
  governance:
    roles: {}
    conflicts_of_interest: []
  stopping_conditions: []
  reopening_triggers: []
```

### 14.3 Frame Card

```yaml
frame:
  id: 'F1'
  name: ''
  status: 'candidate'
  purpose: ''
  ontology:
    entities: []
    relationships: []
  dimensions: []
  units: []
  boundaries: []
  strata_or_scales: []
  evidence_privileged: []
  evidence_obscured: []
  assumptions: []
  enables: []
  obscures: []
  distinctive_predictions: []
  distinctive_error_probes: []
  relevant_standpoints: []
  related_frames:
    - frame_id: 'F2'
      transformation: 're_expression | projection | coarse_graining | ontology_change'
      direction: ''
      reversibility: ''
      information_loss: []
      translation_uncertainty: ''
```

### 14.4 Claim and evidence record

```yaml
claim:
  id: 'C1'
  proposition: ''
  kind: 'descriptive | predictive | retrodictive | causal | explanatory | interpretive | design | engineering | decision | normative | ethical | formal | mathematical | conceptual | metaphysical'
  frame_ids: []
  scale_ids: []
  alternatives: []
  assumptions: []
  predictions_or_expectations: []
  evidence_for: []
  evidence_against: []
  shared_evidence_dependencies: []
  error_threats: []
  boundary_conditions: []
  assessment: 'not-yet-tested'
  uncertainty: ''
  defeaters: []
  update_triggers: []
```

### 14.5 Prior-evidence corpus and synthesis record

```yaml
evidence_corpus:
  id: 'E1'
  question_ids: []
  protocol_version: ''
  protocol_registration: null
  sources_searched: []
  search_strategies: []
  search_dates: []
  eligibility_criteria:
    include: []
    exclude: []
  screening_flow: {}
  excluded_records_with_reasons: []
  source_appraisals: []
  missing_evidence_searches: []
  selective_reporting_assessment: ''
  dependency_clusters: []
  heterogeneity: ''
  applicability: ''
  synthesis_method: 'statistical | qualitative | mixed | narrative | none'
  synthesis_outputs: []
  certainty_or_limitations: ''
  deviations_from_protocol: []
  update_triggers: []
```

### 14.6 Typed bridge record

```yaml
bridge:
  id: 'B1'
  source_locus: ''
  target_locus: ''
  type: 'causal | constitutive | aggregative | coarse_graining | measurement | inferential | semantic | temporal | normative'
  relationship_pattern: 'aggregation | emergence | downward_constraint | lateral_coupling | feedback | translation | other'
  direction: ''
  account: ''
  alternatives: []
  assumptions: []
  expected_observations: []
  evidence: []
  information_loss: []
  fallacy_risks: []
  status: 'candidate'
```

### 14.7 Conflict record

```yaml
conflict:
  id: 'D1'
  accounts: []
  type: 'semantic | empirical | inferential | causal | model | bridge | boundary | ontology | value | decision'
  propositions: []
  shared_assumptions: []
  divergent_assumptions: []
  discriminating_evidence_needed: []
  defeater_for: []
  status: 'unresolved'
  decision_consequence: ''
  preserved_dissent: ''
  reopening_trigger: ''
```

### 14.8 Epistemic Profile skeleton

```yaml
epistemic_profile:
  inquiry_id: ''
  version: ''
  conclusion_label: ''
  claim_scope: ''
  dimensions:
    measurement_validity: ''
    empirical_agreement: ''
    disconfirmation: ''
    predictive_performance: ''
    probabilistic_support: ''
    test_severity: ''
    causal_support: ''
    mechanistic_support: ''
    explanatory_scope: ''
    model_adequacy: ''
    robustness: ''
    generalisation: ''
    cross_scale_coherence: ''
    frame_dependence: ''
    frame_robustness: ''
    evidence_dependence: ''
    programme_trajectory: ''
    practical_performance: ''
    ethics_and_legitimacy: ''
  defeaters: []
  unresolved_conflicts: []
  known_unknowns: []
  suspected_blind_spots: []
  decision_relevance: ''
  reopening_triggers: []
```

### 14.9 Decision and residual-risk record

```yaml
decision:
  id: 'A1'
  inquiry_id: ''
  epistemic_profile_version: ''
  decision_owner: ''
  options_considered: []
  objectives: []
  protected_constraints: []
  loss_asymmetries: []
  selected_option: ''
  rationale: ''
  unresolved_epistemic_issues: []
  residual_risks: []
  distributional_effects: []
  reversibility: ''
  monitoring: []
  rollback_conditions: []
  reopening_triggers: []
```

### 14.10 World-Return Contract

```yaml
learning_change:
  id: 'L1-change-001'
  level: 'method | governance'
  proposed_change: ''
  evidence_and_failures: []
  expected_object_level_effect: ''
  expected_beneficial_signal: ''
  possible_adverse_effects: []
  applicable_contexts: []
  exclusions: []
  baseline_or_comparator: ''
  observation_period: ''
  review_owner: ''
  review_date: null
  rollback_conditions: []
  observed_consequences: []
  final_assessment: 'pending'
```

### 14.11 Interoperability contract for any epistemic module

Every method, model, human team or artificial-agent module should expose:

- intended function;
- inputs and evidence used;
- assumptions and dependencies;
- frame, scale and scope;
- operations or protocol;
- outputs and uncertainty;
- applicability limits;
- known failure modes;
- possible defeaters;
- provenance, authorship and version;
- what another module may and may not infer from its output.

Private chain-of-thought is neither required nor an adequate provenance mechanism. For AI-supported work, preserve task specifications, supplied evidence, model and tool versions, observable outputs and testable rationales.

## 15. Stopping, closure and reopening

### 15.1 Three operational closure states

- **Decision closure:** an action has been selected.
- **Inquiry closure:** current investigation is sufficient for its declared purpose.
- **Programme closure:** active resource allocation to the wider research programme ends.

None implies final truth. These operational states are distinct from **recursive closure**, which is the return of L1 or L2 learning to changed object-level practice and evaluation. An inquiry can be decision-closed while epistemically unresolved, or inquiry-closed for a narrow purpose while its wider programme remains active.

### 15.2 Decision-closure conditions

A decision may provisionally close when:

- the action authority and affected-party process are legitimate;
- options, objectives, protected constraints and residual risks are explicit;
- material epistemic gaps and conflicts are carried transparently into the decision rather than reclassified as knowledge;
- delay or further investigation is less justified than acting, abstaining or running a reversible probe;
- no unmitigated safety, rights or ethical constraint prohibits the selected course;
- reversibility, monitoring, expiry, rollback and reopening triggers are proportionate to uncertainty.

Legitimate governance may accept an epistemic gap for a bounded decision under uncertainty. It cannot thereby convert the gap into evidence, epistemic warrant or inquiry sufficiency.

### 15.3 Inquiry-closure conditions

An inquiry may provisionally close for its declared purpose when:

- every material epistemic function is adequately covered, or the conclusion is narrowed so that a remaining gap is no longer hidden or critical to that purpose;
- credible alternatives have received proportionate examination;
- relevant errors had a capable opportunity to be detected;
- material conflicts are resolved, localised or explicitly preserved in the conclusion;
- evidence, assumptions, transformations, dependencies and scope are traceable;
- the remaining uncertainty is characterised and additional inquiry has low expected epistemic or practical value for the declared purpose;
- expiry and reopening triggers are defined.

### 15.4 Programme-closure conditions

A wider programme may close, become dormant or be superseded when:

- its declared aims are met, displaced or no longer legitimate;
- its remaining questions are transferred, retired with reasons or preserved as open;
- continued work is degenerating into accommodation without supported novelty, or has low value relative to alternative programmes;
- evidence, dissent, negative results and reusable artefacts are archived under appropriate governance;
- responsibility for monitoring and reopening is assigned.

Consensus, fatigue, deadline pressure and depletion of the initial budget are not themselves epistemic stopping criteria. They may create a practical stop whose limitations must be recorded.

### 15.5 Reopening triggers

Reopen when one or more of the following becomes material:

- new evidence or a credible new alternative;
- failed or miscalibrated prediction;
- changed boundary conditions, population or environment;
- unexpected consequence, harm or distributional effect;
- invalidated measurement or causal assumption;
- model, concept or data drift;
- a previously immaterial conflict becoming decision-relevant;
- affected-party or independent challenge;
- a new frame or method capable of exposing a significant blind spot;
- scheduled expiry or review.

Closed, defeated and retired accounts retain enough provenance to be reopened without reconstructing their history from memory.

## 16. Governance and institutional design

### 16.1 Governance levels

1. **Inquiry governance:** scope, evidence custody, dissent, ethics and action for one inquiry.
2. **Portfolio governance:** comparison across inquiries and accumulation of L1 evidence.
3. **Framework governance:** controlled revision of functions, records, depth rules, metrics and protected commitments.

### 16.2 Roles

Possible roles include:

- inquiry steward;
- decision owner;
- evidence and provenance custodian;
- domain and methods stewards;
- adversarial reviewer;
- affected-party or community representatives;
- ethics, safety or rights reviewer;
- framework governor;
- independent evaluation owner.

One person may occupy several roles in a small inquiry by using explicit sequential “hats”. High-stakes inquiries require meaningful independence, conflict-of-interest disclosure and protected dissent.

### 16.3 Constitutional envelope

Every implementation operates within an explicit envelope containing:

- purpose and legitimate authority;
- values and protected constraints;
- decision rights;
- risk tolerance and precaution rules;
- transparency, privacy and security requirements;
- rules for evidence custody and dissent;
- who may change ordinary methods, constitutional epistemic rules and ethical constraints;
- appeal, review and rollback mechanisms.

“Public criticisability” means appropriate inspectability to legitimate critics. It does not require unsafe disclosure of personal, confidential or security-sensitive information.

### 16.4 Change control

Framework changes should be append-only in history and include:

- proposed status: precedent, synthesis, proposal or conjecture;
- evidence and failure motivating the change;
- alternatives considered;
- expected object-level improvement;
- risks and distributional effects;
- compatibility and migration impact;
- dissent;
- World-Return Contract;
- review and rollback conditions.

Where feasible, use prospective comparison, champion–challenger operation, holdouts, retrospective counterfactual review or staggered adoption. Avoid modifying operational methods, evaluation metrics and governance authority simultaneously.

## 17. Evaluation and empirical vulnerability of Parallax

Parallax is itself a fallible research programme, but not every part of it is an empirical hypothesis. Its definitions, conceptual proposals, empirical design conjectures and normative commitments require different forms of evaluation. It should make risky, testable performance claims where it does make empirical claims, rather than merely provide vocabulary capable of redescribing every outcome retrospectively.

### 17.1 Evaluation by claim type

- **Empirical performance conjectures** are evaluated through comparative cases, prospective pilots, calibration, error yield, outcomes and counterevidence.
- **Conceptual architecture** is evaluated for clarity, internal coherence, coverage, non-redundancy, generativity, discriminating value and successful use across contrasting cases.
- **Formal components** are evaluated for validity relative to their stated axioms and semantics.
- **Normative commitments** are evaluated through ethical and political justification, rights, legitimacy, distribution and affected-party criticism; observed consequences can inform but not settle them alone.
- **Operational specifications** are evaluated for feasibility, usability, traceability, proportionality and resistance to gaming or capture.

No success in one mode validates the whole framework. A coherent concept can lack practical value; an effective procedure can remain unjust; a normatively attractive system can fail operationally.

### 17.2 Object-level performance

- predictive and retrodictive accuracy;
- calibration and uncertainty coverage;
- important error detection;
- replication and out-of-sample performance;
- causal identification and transportability;
- model adequacy within declared boundaries;
- sensitivity to assumptions;
- practical outcomes, harms and distributional effects.

### 17.3 Pluralism and synthesis quality

- relevant function coverage;
- genuinely distinct rather than nominal frames;
- unique errors, assumptions or distinctions exposed;
- frame-robust findings and visible frame dependence;
- tested bridge accounts;
- preserved conflicts and defeaters;
- absence of correlated-evidence double counting;
- explicit transformation loss;
- representation of synergy as well as pairwise redundancy.

### 17.4 Learning and governance quality

- update and error-detection latency;
- information gained relative to cost and burden;
- accuracy of method-performance forecasts;
- object-level results of L1 and L2 changes;
- provenance completeness and recoverability;
- retention of dissent and negative results;
- stakeholder and standpoint coverage;
- protected-constraint violations;
- appropriateness of stopping and reopening;
- usability and resistance to compliance theatre.

### 17.5 Empirical conjectures made by the framework

Subject to context and cost, Parallax conjectures that compared with an otherwise competent single-frame or single-method baseline it can:

- detect more materially important hidden assumptions and common-mode failures;
- reduce premature convergence;
- improve calibration about scope and transfer;
- make frame dependence and cross-scale information loss more visible;
- improve the quality of decisions under deep or heterogeneous uncertainty;
- preserve useful dissent without preventing timely action;
- improve method selection across repeated inquiries through recursive closure.

Evidence against Parallax would include no material improvement in error detection or decision quality relative to overhead; persistent domination by shared assumptions despite nominal pluralism; arbitrary frame sensitivity; inability to reach timely decisions; ritual completion without changed reasoning; or a meta-loop that changes metrics until it appears successful.

Metrics are themselves L2 objects. More frames do not necessarily imply more pluralism, more conflicts do not necessarily imply better criticism, and information gain can be irrelevant to the decision.

## 18. Failure modes and mitigations

| Failure mode                    | Control                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| Combinatorial explosion         | Breadth-first function scan, budget, adaptive depth and information value               |
| Checklist pluralism             | Require distinctive contribution, dependency and error probe                            |
| Method/frame shopping           | Predeclare rationale where suitable; retain counter-frames and audit exclusions         |
| Majority-vote synthesis         | Dependency-aware profile and explicit defeaters                                         |
| False independence              | Map shared data, ontology, assumptions and incentives                                   |
| Orthogonality fetish            | Track redundancy, synergy and conditional dependence                                    |
| False completeness              | Version registries and seek unknown frames and stakeholders                             |
| Scale conflation                | Separate domain scale from L0/L1/L2; type bridges                                       |
| Cross-scale causal inflation    | Distinguish causal, constitutive, aggregative, semantic and normative bridges           |
| Hidden information loss         | Record transformation loss and reversibility                                            |
| Common-space fiction            | Use federation/ecology and permit failed translation                                    |
| Endless reframing               | Require material contribution and stopping rules                                        |
| Preserving dead alternatives    | Defeat or retire with explicit reopening conditions                                     |
| Popperian theatre               | Assess severity, power and measurement validity                                         |
| Bayesian numerology             | Check models, priors, alternative classes and calibration                               |
| “Useful therefore true”         | Separate predictive, causal, explanatory, practical and ethical status                  |
| Practical paralysis             | Separate decision closure; use reversibility and robust options                         |
| Meta-level drift                | Require World-Return Contracts                                                          |
| Infinite-regress rhetoric       | Use three pragmatic levels plus reflective self-application                             |
| Recursive self-validation       | Protect commitments, baselines, external criticism and rollback                         |
| Reflexive target change         | Separate target/inquiry/intervention systems; monitor performativity                    |
| Institutional capture           | Protect dissent and participation; disclose conflicts; review independently             |
| Tokenistic participation        | Share question-setting, interpretation and governance                                   |
| False precision                 | Retain qualitative uncertainty; refuse unjustified scalarisation                        |
| Bureaucratisation               | Keep the core small; require every artefact to earn its cost                            |
| AI ensemble illusion            | Test dependencies, diversify evidence and retain human/domain criticism                 |
| Selective evidence availability | Search registries and grey literature; compare protocols and reports; model missingness |
| Inappropriate synthesis         | Respect heterogeneity, estimands, constructs, contexts and dependencies                 |

## 19. Illustrative worked example

### 19.1 Mixed question and charter

Consider:

> Does an AI-assisted lesson-planning system improve pupil learning without increasing teacher workload, inequity, safeguarding risk or loss of professional agency?

This contains descriptive, predictive, causal, mechanistic, interpretive, technical, normative and decision questions. The Charter would delimit specified schools and time horizons; distinguish target (planning, teaching and learning), inquiry (researchers and participants) and intervention (software, training, support and policy) systems; and protect safeguarding, privacy, accessibility, non-discrimination, professional control and opt-out. The decision rule permits only a reversible monitored trial after safety and ethics gates.

### 19.2 Frames, scales and bridges

| Frame                 | Makes visible                                                  | May obscure                                        |
| --------------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| Cognitive learning    | Knowledge, misconceptions and learning mechanisms              | Agency, organisation and distribution              |
| Classroom practice    | Planning, adaptation, interaction and workload                 | Procurement, technical internals and long horizons |
| Technical system      | Reliability, data flow and failure modes                       | Pedagogy, meaning and power                        |
| Organisation          | Training, support, incentives and implementation               | Individual and pupil variation                     |
| Equity and standpoint | Differential access, disability, language and design authority | Fine technical causes without bridging             |
| Public value          | Legitimacy, opportunity cost and institutional effects         | Immediate classroom mechanisms                     |

Relevant loci include pupil, group, lesson, teacher, department, school, provider and system across several time horizons. Candidate bridges include: retrieval reduces planning time (**causal**); prompts alter task selection and pupil practice (**mechanistic**); experiences jointly constitute but do not simply average into culture (**constitutive**); teacher workload is combined into school estimates (**aggregative**); logs imperfectly proxy use (**measurement**); and unequal benefit changes the acceptability of an average gain (**normative**). Each bridge remains a hypothesis.

### 19.3 Alternatives, evidence and parallel work

Alternatives include genuine learning and workload benefit; checking work displaced elsewhere; effects caused mainly by training; different novice/expert effects; novelty that decays; subgroup harm despite average gain; behavioural change without learning; heterogeneous local effects; and no material effect.

Evidence might combine technical verification and red-teaming, validated workload and agency measures, randomised or phased introduction, component-sensitive causal design, classroom observation, teacher and pupil inquiry, subgroup/accessibility analysis, mechanism studies of changed plans, missingness and implementation sensitivity, cross-school replication, participatory interpretation, opportunity-cost analysis and safeguarding review.

Learning-outcome, practice, technical and equity teams can make protected first passes. Composition then allows qualitative work to revise constructs, logs to inform implementation, and causal analysis to separate software from training and support.

### 19.4 Profile, decision and recursive closure

Suppose a pilot finds modest average learning improvement, wide teacher heterogeneity, uncertain workload reduction, strong training dependence, one serious accessibility gap and no safeguarding event under limited exposure. “It works” would be unwarranted. The Epistemic Profile should record provisional causal support within scope; weak severity for rare harm; training as part of the intervention; frame dependence between mean outcomes and professional agency; an accessibility defeater against unrestricted adoption; and inadequate transport evidence. It may support only a remediated, reversible next stage with monitoring.

At L1, poor log-derived workload estimates and faster error discovery through teacher interviews could motivate triangulating logs, time sampling and qualitative accounts. At L2, repeated late discovery of equity problems could move affected-party counterframing before metric selection. A World-Return Contract would predict earlier detection of exclusionary constructs and measure both that benefit and added delay in later trials.

The point is not to maximise analyses, but to stop one successful-looking coordinate—such as an average outcome—from standing in for the whole inquiry.

## 20. Validation programme

### 20.1 Cross-domain cases

Parallax should be tested against deliberately unlike domains:

1. **Controlled experimental science:** a probabilistic treatment effect with measurement, severity, ethics and generalisation issues.
2. **Observational or historical science:** a cosmological, geological or evolutionary inference using retrodiction, model comparison and inaccessible interventions.
3. **Complex dynamic system:** an ecological or economic system with feedback, non-stationarity and cross-scale coupling.
4. **Engineering and incident diagnosis:** a software or infrastructure intervention with rapid world-return loops and operational consequences.
5. **Interpretive human inquiry:** a meaning-rich question where construct formation and situated experience are central.
6. **Participatory or public-policy inquiry:** contested values, heterogeneous effects and distributed authority.
7. **Historical programme analysis:** a case involving progressive development, degeneration or paradigm change.

### 20.2 Validation designs

- synthetic cases with partially known ground truth;
- blinded reconstruction of historical inquiries;
- prospective pilots on reversible moderate-stakes decisions;
- comparison with competent simpler baselines;
- ablation of frames, function groups and recursive levels;
- champion–challenger comparisons of framework versions;
- longitudinal portfolio analysis;
- practitioner-usability and affected-party evaluation.

### 20.3 Acceptance tests for this specification

Before advancing beyond conceptual alpha, ask:

- Can an independent team instantiate Parallax without guessing its core semantics?
- Can it represent incompatible frames without forcing false translation?
- Does it distinguish domain scale from L0/L1/L2 inquiry level?
- Can it distinguish factual assessment from value-governed decisions?
- Can it detect correlated evidence and common-mode failure?
- Can it preserve a decisive defeater against majority averaging?
- Can it terminate, support action under uncertainty and later reopen?
- Can a higher-order change be traced to an object-level test?
- Can previous configurations, excluded alternatives and dissent be recovered?
- Can the framework generate credible evidence that it is not worth using in a context?
- Is its overhead proportionate to the stakes and information gained?

## 21. Implementation patterns

### 21.1 Individual use

An individual can use Parallax through sequential roles:

1. formulate a primary account;
2. create a counter-frame and strongest rival;
3. inspect function coverage and evidence dependencies;
4. derive a discriminating test;
5. produce an Epistemic Profile and decision record;
6. conduct an L1 retrospective later.

The risk is simulated rather than genuine independence. External criticism becomes increasingly important with stakes.

### 21.2 Team use

Teams can assign methods or frames to partially independent groups, appoint a conflict steward, and reconcile only after initial reports are committed. Shared evidence infrastructure should record common dependencies.

### 21.3 Institutional use

Institutions need portfolio governance, protected dissent, method-performance histories, recurring review and authority boundaries between evidence production and decisions. Incentives must reward detected error and responsible reopening, not only confident closure.

### 21.4 Artificial-agent use

Agentic implementations can automate function scans, provenance, alternative generation, independent passes and contradiction detection. They also magnify risks of correlated training, prompt inheritance, fabricated certainty and metric gaming.

An artificial ensemble should record:

- model, tool and knowledge versions;
- shared prompts, evidence and upstream artefacts;
- task and role separation;
- observable rationales and tests;
- human or independent-domain review;
- persistence of dissent and negative results;
- which agent has authority to propose, execute and adjudicate framework changes.

Long-lived agent organisations should preserve mappings among object inquiries, method histories and governance changes so that apparent learning can be traced across sessions and generations.

### 21.5 Minimum viable adoption

For an initial practical pilot:

1. use the Inquiry Charter;
2. create one primary frame and one counter-frame;
3. run the F01–F21 coverage scan;
4. retain at least two strong alternatives;
5. design one discriminating error probe;
6. record dependencies and conflict;
7. produce the Epistemic Profile;
8. separate the decision record;
9. define reopening triggers;
10. perform one L1 review and, if it proposes a material change, one World-Return Contract.

Do not build a complex knowledge graph before these practices demonstrate value.

## 22. Open research questions

### 22.1 Conceptual and formal

- Is the epistemic-function registry sufficiently complete and well typed?
- Should “functional orthogonality” be replaced in operation by “conditional epistemic distinctness”?
- How should unique contribution, redundancy, multiway synergy and contradiction be represented?
- When is translation between frames warranted?
- How should frame federations govern genuinely incommensurable ontologies?
- Can information loss across coarse-graining be characterised consistently outside quantitative domains?
- How should deep, non-probabilistic and unknown uncertainty be represented?
- What logic best preserves defeaters and paraconsistent or unresolved conclusions?

### 22.2 Methodological

- How are decisive defeaters distinguished from merely discordant results?
- Which minimum counter-frame requirements prevent ritual compliance?
- How should evidence dependence be discounted without one arbitrary score?
- When does parallel independence outweigh the benefits of early composition?
- How should qualitative, quantitative, mechanistic and situated evidence interoperate?
- How can missing frames and excluded stakeholders be actively sought?
- How should causal, constitutive, aggregative and semantic bridges be jointly represented?
- What stopping rule best balances information value, harm and cost of delay?

### 22.3 Recursive and institutional

- How can method performance be compared without confounding by domain selection and difficulty?
- What volume of cases supports credible L2 change?
- Which protected commitments are legitimate, and who may revise them?
- What change cadence avoids oscillation, overfitting and institutional forgetting?
- How should the framework respond when practical outcomes are positive but the explanation remains false or unknown?
- What governance prevents nominal pluralism from being captured by authority or resources?
- How should individual, team, institutional and artificial-agent implementations differ?
- When does Parallax overhead exceed its epistemic benefit?

### 22.4 Originality and scholarship

- Which proposed combinations have close precedents in scientific pluralism, perspectivism, cybernetics, robustness analysis, metascience or organisational learning?
- Can the threefold pluralism and world-return architecture be stated with enough precision to support comparative empirical research?
- What historical or priority claims, if any, survive a systematic literature review?

## 23. Original synthesis and claim-status ledger

“Original” here means original to this formulation and its originating dialogue. It is not a claim of historical priority.

### 23.1 Status vocabulary

| Status               | Meaning                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| Precedent/Foundation | Closely inherited from an identifiable tradition, though potentially contested |
| Synthesis            | A combination, reinterpretation or architectural integration of precedents     |
| Proposal             | A design commitment introduced in this formulation                             |
| Definition           | An operational meaning adopted for clarity                                     |
| Normative commitment | A value or governance choice rather than an empirical conclusion               |
| Working assumption   | Relied upon provisionally                                                      |
| Empirical conjecture | A claim intended to be tested                                                  |
| Open question        | Deliberately unresolved                                                        |
| Known limitation     | A recognised boundary or failure risk                                          |
| Deprecated           | Retained for provenance but no longer active                                   |

### 23.2 Candidate synthesis ledger

| Concept                                               | Status             | Principal antecedents                                                  | What this formulation adds                                                                                  |
| ----------------------------------------------------- | ------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Empirical vulnerability                               | Synthesis/proposal | Falsification, Bayesian confirmation, severe testing, model assessment | One umbrella for direct, probabilistic, historical, intervention and package-dependent exposure to evidence |
| Three forms of pluralism                              | Proposal           | Scientific pluralism, perspectivism, multi-scale inquiry               | Explicit separation of intra-scale, inter-scale and decompositional pluralism                               |
| Pluralism at nodes, edges and topologies              | Proposal           | Graphical systems thinking and pluralism                               | Applies plurality to accounts, bridges, boundaries and the decomposition itself                             |
| Plural ensembles connected by plural bridges          | Proposal           | Model ensembles and multi-level science                                | Cross-scale inquiry occurs between ensembles rather than single authoritative accounts                      |
| Frame ecology, federation and atlas                   | Synthesis/proposal | Conceptual spaces, perspectivism and local modelling                   | Distinguishes translatable charts from partially or non-translatable ontologies                             |
| Approximate functional orthogonality                  | Proposal/analogy   | Basis sets, robustness and method complementarity                      | Defines distinctness through non-redundant epistemic contribution rather than covariance                    |
| Purposeful epistemic overcompleteness                 | Synthesis/proposal | Mathematical frames, triangulation and robustness                      | Retains redundancy specifically for error detection and reconstruction under failure                        |
| Basis change versus projection versus ontology change | Proposal/synthesis | Representation, coarse-graining and paradigm change                    | Makes reversibility and information loss mandatory parts of cross-frame records                             |
| Frame robustness and frame dependence                 | Synthesis/proposal | Robustness analysis and perspectivism                                  | Treats invariance and dependence across decompositions as first-class outputs                               |
| Composite plus protected-parallel execution           | Synthesis/proposal | Multi-method research and independent review                           | Combines deliberate cooperation with independent-first-pass protection                                      |
| Functionally complete, adaptively deep inquiry        | Proposal           | Methodological pluralism, bounded rationality and value of information | Replaces impossible school-by-school exhaustiveness with versioned function coverage                        |
| Dependency-aware Epistemic Profile                    | Proposal           | Evidence synthesis, model criticism and decision analysis              | Preserves multiple epistemic achievements, dependencies, defeaters and tensions without one scalar verdict  |
| Decision closure distinct from epistemic closure      | Synthesis          | Decision theory and fallibilism                                        | Makes action under unresolved truth a governed, traceable state                                             |
| L0/L1/L2 reflective closure                           | Synthesis/proposal | Meta-learning, double-loop learning and reflective practice            | Requires method and governance changes to return to object inquiry for worldly evaluation                   |
| World-Return Contract                                 | Proposal           | Prospective evaluation, change control and pragmatism                  | Makes every material higher-order change a testable object-level change hypothesis                          |
| Protected evaluative anchors                          | Synthesis/proposal | Research ethics, constitutional governance and anti-Goodhart design    | Prevents simultaneous rewriting of evidence, method, objective and success criterion                        |

### 23.3 Novelty restraint

The integration may be distinctive, but every component has neighbouring literatures. Before publication as research, conduct a dedicated search across philosophy of science, scientific pluralism, robustness, causal and multi-scale modelling, cybernetics, organisational learning, metascience, participatory inquiry and AI-agent governance. Source citation establishes influence, not proof or novelty.

## 24. Maintenance, versioning and insight preservation

### 24.1 Lifecycle

Recommended lifecycle states are:

`working-draft → candidate → piloted → validated-within-declared-scope → superseded`

Avoid an unqualified `validated`. A framework version can be supported for specified domains, assurance modes and outcomes without being universally validated.

### 24.2 Version semantics

- **Major version:** incompatible change to core commitments, conceptual architecture or record semantics.
- **Minor version:** compatible addition of functions, modules, fields or application guidance.
- **Patch version:** correction or clarification intended not to change meaning.

Each release should include:

- change summary and rationale;
- claim-status changes;
- evidence and cases motivating changes;
- compatibility and migration notes;
- dissent and unresolved issues;
- applicable World-Return Contracts;
- deprecated concepts retained in history.

### 24.3 Proposed development path

| Version | Intended state                                                             |
| ------- | -------------------------------------------------------------------------- |
| 0.1.x   | First complete conceptual specification; terminology and source correction |
| 0.2.x   | Systematic literature and priority review; revised function registry       |
| 0.3.x   | Retrospective case applications and adversarial review                     |
| 0.4.x   | Prospective pilots, templates and machine-readable schemas                 |
| 0.5.x   | Comparative and ablation evaluation; governance trials                     |
| 1.0.0   | Stable candidate validated within explicitly declared application scopes   |

### 24.4 Insight ledger

This maps the originating dialogue's principal insights so synthesis cannot silently discard them.

| Insight retained                                                                                                                  | Location        |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Scientific method as a family of public, fallible, error-correcting methods                                                       | §§1, 3–5        |
| Experiments and future prediction are not mandatory; empirical vulnerability exceeds binary falsifiability                        | §§2–5           |
| Traditions share evidence and revision but answer unlike questions at different logical and historical scales                     | §§5, 9          |
| Same-scale pluralism applies at every scale; ensembles also interact concurrently across scales                                   | §7              |
| Composite cooperation and protected parallel execution are complementary; ensembles are not votes                                 | §§12–13         |
| Exhaustiveness means declared functional coverage with bounded adaptive depth                                                     | §§9, 11         |
| Pluralism applies to nodes, bridges and alternative topologies                                                                    | §§7, 14.6       |
| The third pluralism concerns how dimensions, layers and boundaries are constructed                                                | §§7–8           |
| Missing traditions enter by epistemic contribution, not equal-weight enumeration                                                  | §§5.2, 9        |
| L0 object, L1 method and L2 governance learning return to the world without infinite regress                                      | §10             |
| World-return and protected anchors constrain meta-level drift and self-validation                                                 | §§10, 14.10, 16 |
| Conceptual decomposition is analogous to viewing an N-dimensional space in different bases                                        | §8              |
| Orthogonality is approximate, functional and metric-relative—not mere statistical independence                                    | §8.2            |
| Overcomplete frames can outperform minimal bases for error detection                                                              | §8.2            |
| Atlases cover translatable local frames; federations/ecologies admit deeper incompatibility                                       | §8.3            |
| Re-expression, coarse-graining and ontology change differ in reversibility and loss                                               | §8.4            |
| Invariance and frame dependence are both informative outputs                                                                      | §§8.6, 13.4     |
| Truth, explanation, prediction, usefulness, ethics and decision sufficiency remain distinct                                       | §§2, 5.3, 13    |
| A practical framework also needs records, governance, closure/reopening, validation, failure analysis, maintenance and references | §§12–25         |

### 24.5 Current change log

#### 0.1.0 — 2026-08-01

- First complete formulation.
- Introduces the three forms of pluralism and node–edge–topology architecture.
- Introduces the frame ecology/atlas distinction and three transformation classes.
- Defines L0/L1/L2 recursive learning and the World-Return Contract.
- Defines functional coverage, assurance modes, application phases and working records.
- Includes prior-evidence discovery, appraisal and synthesis as an explicit epistemic function.
- Adds conflict, defeater, stopping, governance, evaluation and validation rules.
- Distinguishes decision, inquiry, programme and recursive closure.
- Records theoretical antecedents and originality limitations.

---

## 25. References and theoretical genealogy

Links point directly to original works, official editions, publishers, standards bodies or authoritative institutional records where practicable. Publisher metadata does not imply that every source is open access. This is a foundational bibliography, not yet a systematic review.

### 25.1 Scientific inference and change

- Bayes, T. (1763), communicated and introduced by R. Price. [“An Essay towards solving a Problem in the Doctrine of Chances”](https://doi.org/10.1098/rstl.1763.0053). _Philosophical Transactions of the Royal Society_.
- Duhem, P. (1906/1954). [_The Aim and Structure of Physical Theory_](https://press.princeton.edu/books/paperback/9780691128261/the-aim-and-structure-of-physical-theory). Princeton University Press.
- Hempel, C. G. (1945). [“Studies in the Logic of Confirmation (I)”](https://doi.org/10.1093/mind/LIV.213.1) and [“Studies in the Logic of Confirmation (II)”](https://doi.org/10.1093/mind/LIV.214.97). _Mind_.
- Howson, C. and Urbach, P. (2005 edition). [_Scientific Reasoning: The Bayesian Approach_](https://researchonline.lse.ac.uk/12474/). Open Court.
- Kuhn, T. S. (1962/2012). [_The Structure of Scientific Revolutions_](https://press.uchicago.edu/ucp/books/book/chicago/S/bo13179781.html). University of Chicago Press.
- Lakatos, I. (1970). [“Falsification and the Methodology of Scientific Research Programmes”](https://doi.org/10.1017/CBO9781139171434.009), in _Criticism and the Growth of Knowledge_.
- Mayo, D. G. (2018). [_Statistical Inference as Severe Testing_](https://doi.org/10.1017/9781107286184). Cambridge University Press.
- Neyman, J. and Pearson, E. S. (1933). [“On the Problem of the Most Efficient Tests of Statistical Hypotheses”](https://doi.org/10.1098/rsta.1933.0009). _Philosophical Transactions of the Royal Society A_.
- Peirce, C. S. (1877). [“The Fixation of Belief”](https://www.peirce.org/writings/p107.html).
- Peirce, C. S. (1878). [“How to Make Our Ideas Clear”](https://www.peirce.org/writings/p119.html).
- Peirce, C. S. (1878). [“Deduction, Induction, and Hypothesis”](https://en.wikisource.org/wiki/Popular_Science_Monthly/Volume_13/August_1878/Illustrations_of_the_Logic_of_Science_VI). _Popular Science Monthly_, 13, 470–482.
- Popper, K. (1934/1959/2002). [_The Logic of Scientific Discovery_](https://www.routledge.com/The-Logic-of-Scientific-Discovery-2nd-Edition/Popper/p/book/9780415278447). Routledge.
- Quine, W. V. O. (1951). [“Two Dogmas of Empiricism”](https://doi.org/10.2307/2181906). _The Philosophical Review_.

### 25.2 Explanation, modelling, causation and measurement

- Hacking, I. (1983). [_Representing and Intervening_](https://doi.org/10.1017/CBO9780511814563). Cambridge University Press.
- Harman, G. H. (1965). [“The Inference to the Best Explanation”](https://doi.org/10.2307/2183532). _The Philosophical Review_.
- Lipton, P. (2004). [_Inference to the Best Explanation_](https://www.routledge.com/Inference-to-the-Best-Explanation/Lipton/p/book/9780415242035). Routledge.
- Machamer, P., Darden, L. and Craver, C. F. (2000). [“Thinking about Mechanisms”](https://doi.org/10.1086/392759). _Philosophy of Science_.
- Morgan, M. S. and Morrison, M., eds. (1999). [_Models as Mediators_](https://doi.org/10.1017/CBO9780511660108). Cambridge University Press.
- Pearl, J. (2009). [“Causal Inference in Statistics: An Overview”](https://doi.org/10.1214/09-SS057). _Statistics Surveys_.
- Rubin, D. B. (1972). [“Estimating Causal Effects of Treatments in Experimental and Observational Studies”](https://doi.org/10.1002/j.2333-8504.1972.tb00631.x). ETS Research Bulletin.
- Hernán, M. A. and Robins, J. M. (2020). [_Causal Inference: What If_](https://miguelhernan.org/whatifbook). Chapman & Hall/CRC.
- Joint Committee for Guides in Metrology (JCGM). [_International Vocabulary of Metrology_](https://www.bipm.org/en/doi/10.59161/jcgm200-2012).
- Joint Committee for Guides in Metrology (JCGM). [_Guide to the Expression of Uncertainty in Measurement_](https://doi.org/10.59161/JCGM100-2008E).
- Cronbach, L. J. and Meehl, P. E. (1955). [“Construct Validity in Psychological Tests”](https://doi.org/10.1037/h0040957). _Psychological Bulletin_.
- Higgins, J. P. T. et al., eds. (current version). [_Cochrane Handbook for Systematic Reviews of Interventions_](https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current). Cochrane.
- Page, M. J. et al. (2021). [“The PRISMA 2020 Statement”](https://doi.org/10.1136/bmj.n71). _BMJ_, 372:n71.
- National Research Council (2012). [_Assessing the Reliability of Complex Models: Mathematical and Statistical Foundations of Verification, Validation, and Uncertainty Quantification_](https://doi.org/10.17226/13395). National Academies Press.

### 25.3 Pluralism, robustness, conceptual spaces and complexity

- Anderson, P. W. (1972). [“More Is Different”](https://doi.org/10.1126/science.177.4047.393). _Science_.
- Chang, H. (2012). [_Is Water H₂O? Evidence, Realism and Pluralism_](https://link.springer.com/book/10.1007/978-94-007-3932-1). Springer.
- Gärdenfors, P. (2000). [_Conceptual Spaces: The Geometry of Thought_](https://doi.org/10.7551/mitpress/2076.001.0001). MIT Press.
- Giere, R. N. (2006). [_Scientific Perspectivism_](https://doi.org/10.7208/chicago/9780226292144.001.0001). University of Chicago Press.
- Kellert, S. H., Longino, H. E. and Waters, C. K., eds. (2006). [_Scientific Pluralism_](https://www.upress.umn.edu/9780816647637/scientific-pluralism/). University of Minnesota Press.
- Kuorikoski, J., Lehtinen, A. and Marchionni, C. (2010). [“Economic Modelling as Robustness Analysis”](https://doi.org/10.1093/bjps/axp049). _The British Journal for the Philosophy of Science_.
- Orzack, S. H. and Sober, E. (1993). [“A Critical Assessment of Levins's ‘The Strategy of Model Building in Population Biology’”](https://doi.org/10.1086/418301). _The Quarterly Review of Biology_.
- Simon, H. A. (1962). [“The Architecture of Complexity”](https://www.jstor.org/stable/985254). _Proceedings of the American Philosophical Society_, 106(6), 467–482.

### 25.4 Social, situated, qualitative and participatory knowledge

- Braun, V. and Clarke, V. (2006). [“Using Thematic Analysis in Psychology”](https://doi.org/10.1191/1478088706qp063oa). _Qualitative Research in Psychology_.
- Fricker, M. (2007). [_Epistemic Injustice: Power and the Ethics of Knowing_](https://doi.org/10.1093/acprof:oso/9780198237907.001.0001). Oxford University Press.
- Glaser, B. G. and Strauss, A. L. (1967). [_The Discovery of Grounded Theory_](https://www.routledge.com/Discovery-of-Grounded-Theory-Strategies-forQualitative-Research/Glaser-Strauss/p/book/9780202302607). Aldine/Routledge.
- Haraway, D. (1988). [“Situated Knowledges”](https://doi.org/10.2307/3178066). _Feminist Studies_.
- Harding, S. (1991). [_Whose Science? Whose Knowledge?_](https://www.cornellpress.cornell.edu/book/9780801425134/whose-science-whose-knowledge/). Cornell University Press.
- Global Indigenous Data Alliance. [_CARE Principles for Indigenous Data Governance_](https://www.gida-global.org/careprinciples).
- First Nations Information Governance Centre. [_The First Nations Principles of OCAP®_](https://fnigc.ca/ocap-training/). OCAP® is a registered trademark of FNIGC.
- Israel, B. A. et al. (1998). [“Review of Community-Based Research”](https://doi.org/10.1146/annurev.publhealth.19.1.173). _Annual Review of Public Health_.
- Lewin, K. (1946). [“Action Research and Minority Problems”](https://doi.org/10.1111/j.1540-4560.1946.tb02295.x). _Journal of Social Issues_.
- Longino, H. E. (1990). [_Science as Social Knowledge_](https://philosophy.stanford.edu/publications/science-social-knowledge). Princeton University Press.
- Smith, L. T. (1999/2022). [_Decolonizing Methodologies: Research and Indigenous Peoples_](https://www.bloomsbury.com/uk/decolonizing-methodologies-9781350346086/). Zed Books/Bloomsbury.
- UNESCO (2021). [_Recommendation on Open Science_](https://unesdoc.unesco.org/ark:/48223/pf0000379949).

### 25.5 Decision, ethics, recursive and organisational learning

- Argyris, C. (1977). [“Double Loop Learning in Organizations”](https://hbr.org/1977/09/double-loop-learning-in-organizations). _Harvard Business Review_.
- Bateson, G. (1972). [_Steps to an Ecology of Mind_](https://press.uchicago.edu/ucp/books/book/chicago/S/bo3620295.html). University of Chicago Press.
- Berger, J. O. (1985). [_Statistical Decision Theory and Bayesian Analysis_](https://link.springer.com/book/10.1007/978-1-4757-4286-2). Springer.
- Heath, A., Manolopoulou, I. and Baio, G. (2017). [“A Review of Methods for Analysis of the Expected Value of Information”](https://doi.org/10.1177/0272989X17697692). _Medical Decision Making_.
- National Commission for the Protection of Human Subjects of Biomedical and Behavioral Research (1979). [_The Belmont Report_](https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/index.html).
- Rudner, R. (1953). [“The Scientist Qua Scientist Makes Value Judgments”](https://doi.org/10.1086/287231). _Philosophy of Science_.
- Schön, D. A. (1983). [_The Reflective Practitioner_](https://www.routledge.com/The-Reflective-Practitioner-How-Professionals-Think-in-Action/Schon/p/book/9781857423198). Basic Books/Routledge.
- World Medical Association (current official revision). [_Declaration of Helsinki_](https://www.wma.net/what-we-do/medical-ethics/declaration-of-helsinki/).
- National Academies of Sciences, Engineering, and Medicine (2019). [_Reproducibility and Replicability in Science_](https://doi.org/10.17226/25303). National Academies Press.

---

## Conclusion

Parallax treats disciplined inquiry not as one recipe but as an adaptive epistemic system. Its core demand is that representations, methods, scales and their governing decompositions remain exposed to alternatives, evidence, criticism and revision. Its pluralism is neither relativism nor voting: methods are typed by what they contribute, dependencies are recorded, defeaters remain visible and conclusions retain their scope.

The framework closes its recursive loop by requiring learning about methods and governance to alter object-level inquiry and meet the world again. It remains bounded by resources, values, rights and the possibility that it is itself the wrong frame. Its success will therefore be established, if at all, not by the completeness of this document but by whether applications detect important errors, improve understanding and action, preserve legitimate dissent, remain proportionate, and expose where Parallax should itself be revised or declined.
