# Learner experience and governed profiles

**Purpose:** make the service's learning activities and subject/context differences concrete enough to design, implement and evaluate useful OCE work. **Standing:** requirements, source-based synthesis, worked analytical cases and explicitly proposed activities. **Source snapshots:** 4–6 September 2026; reconstruction dated 6 September 2026. No activity or study described here has thereby been implemented or authorised for participants.

The service provides excellent additional tuition across subjects and throughout life. Learning may involve representations, texts, conversation, creation, tools, simulations, practice, physical activity and human support. Its form follows the capability being developed. Oak's complete high-quality curriculum arrives through its API and bulk provision; a profile links authoritative content to reviewed pedagogical possibilities, access and assessment. It can begin with a small curated objective and repertoire.

**Three separate claims:** a shared architecture may host a profile; a profile may be suitable for a subject and context; a tested configuration may improve learning. None proves the next. Mathematics and English are contrasting initial candidates. The Year 9 proportional-reasoning and four-week outcome study is a source proposal, preserved in [document 04](04-poc-requirements-and-evaluation.md); it is not a settled participant protocol or the boundary of the service's ambition.

This document owns the **subject–phase–context profile contract**, concrete learner/educator activities and contextual detail. **BP-01–BP-10 in [document 07](07-capabilities-bridges-and-proof.md) are different objects: bridge proof profiles.** That document owns their complete schemas and PS-01–PS-34 proposed tests. Access and human operations live in [document 05](05-inclusion-and-human-service.md); state/rights in [document 06](06-state-rights-and-context.md); educational foundations in [document 02](02-education-and-teaching-knowledge.md).

**Reading routes:** [profile contract](#the-subjectphasecontext-profile-contract); [learner activities](#learning-activities-and-responsive-tuition); [subject families](#subject-families-tools-and-authentic-outcomes); [lifelong contexts](#lifelong-contexts-and-learner-controlled-continuity); [expansion](#profile-expansion-and-commissioning); [resits overview](#resits-as-learning-assessment-and-credential-pathways); [rules and jurisdictions](#resits-authority-rules-and-jurisdictions); [measurement and outcomes](#resits-measurement-outcomes-and-causal-evidence); [teaching and experience](#resits-teaching-implementation-and-lived-experience); [four cases](#four-resit-cases-and-their-conditional-branches); [reform and research](#resits-alternatives-and-unfinished-research); [practical questions](#resits-practical-decision-questions); [sources and limits](#source-identities-and-preservation-limits).

The resits dossier is deliberately substantial. It supplies a different account of learner needs and institutional constraints: continued study, changed teaching, a fair assessment, a credential and an admission decision may each need a different intervention. Its detailed cases, denominators and alternatives are useful beyond the immediate POC. The dated fees and deadlines are historical evidence; they must be rechecked before an actual action.


## The subject–phase–context profile contract

The common kernel should carry only capabilities whose meaning survives subject change:

- identity, session and consent/authority handling;
- content and claim provenance;
- accessible interaction, learner-controlled presentation and assistive-technology compatibility;
- profile-appropriate elicitation, uncertainty, progressive disclosure, learner action, independent checks and fading;
- typed observations, declarations and optional learner-state hypotheses;
- versioned tutoring-policy execution and exposure logging;
- safeguarding, escalation and human hand-off;
- independent outcome isolation, audit and controlled service change;
- export, deletion, substitution, conformance and exit.

Each **subject–phase–context profile** is a mapping contract rather than a content pack. It must link, without merging:

1. **domain intent:** valued knowledge, capabilities, progression, prerequisites and boundaries;
2. **disciplinary practice:** what counts as a question, method, representation, explanation, evidence, judgement or performance;
3. **subject-specific PCK:** candidate misconceptions or strategies, diagnostic questions, examples, representations and graduated moves;
4. **tool and setting contract:** texts, notation, code execution, simulations, audio, images, instruments, materials, fieldwork, peers and specialists;
5. **tutoring-policy constraints:** permitted moves, uncertainty and abstention, answer-disclosure rules, hand-off and safety limits;
6. **access contract:** alternative modes and construct-preserving adjustments, plus effective routes where the digital journey is unsuitable;
7. **assessment crosswalk:** mappings to a separately governed construct, instrument, accommodation and inference contract;
8. **evidence status:** what is merely plausible, expert-validated, usability-tested, causally tested or transport-tested;
9. **versions and authority:** sources, owners, review dates, known conflicts, change rules and withdrawal conditions.

This architecture is a **design inference** from curriculum, PCK, situated learning and standards evidence. It must itself be compared with credible alternatives, including a simpler stateless resource layer, a human-copilot mode and, where appropriate, a non-tutoring public service.

### What the receiver must be able to use

| Contract component | Usable content that travels with the profile | Owning judgement and test |
|---|---|---|
| Domain intent | Versioned goal, subject/phase/context, concept or capability, progression, prerequisites, coverage and exclusions; Oak/content references and rights | Curriculum/domain authority confirms intention and mapping; a source tag alone is not validation |
| Disciplinary practice | Valid methods, representations, kinds of explanation/evidence/performance, permissible plurality and boundaries | Subject community/educators determine whether the task preserves the discipline |
| Pedagogical content knowledge | Candidate strategies/misconceptions, contrasting explanations, examples, diagnostic questions, reviewed support moves, conditions and alternatives | Educators review warrants and disagreements; the learner's response tests a hypothesis rather than confirming a label |
| Tools and setting | Inputs, notation, texts, code/simulation/equipment, environment, other people, safety constraints and fallback | Tool, subject and setting owners validate the composed activity and actual delivered opportunity |
| Policy constraints | Permitted repertoire, support and answer-disclosure boundaries, uncertainty, abstention, hand-off, budgets and transition limits | Service/profile owners establish what may be selected; observed actions remain separate from policy |
| Access | Required functional modes, AT combinations, adjustment rationale, unsupported combinations and effective human/situated route | Access and assessment owners preserve both authentic use and the intended construct; see document 05 |
| Assessment crosswalk | Intended outcome and use, separately governed instrument/rubric, conditions, allowed assistance, accommodations and inference limits | Assessment authority controls secure outcome instruments and validates the mapping; independent evaluation owns effect claims |
| Evidence standing | Source rationale, expert coverage, usable journeys, failed cases, causal/transport evidence, missingness and claim ceiling | Each evidence owner reports the actual method, population and version; one rung cannot stand for another |
| Authority and lifecycle | Responsible roles, source/version identifiers, conflicts, permissions, review/withdrawal triggers, correction and receiving-context acceptance | Relevant owners accept decisions; a delivered or signed file alone confers neither recognition nor continued permission |

This table operationalises the nine-part source contract; it does not prescribe one data format or package layout. A material pedagogical claim retains its meaning, type, goal/domain, learner and setting conditions, mechanism, observation, alternatives, harms, evidence, uncertainty, dissent, provenance, licence, implementation needs and decision rights. [Document 09](09-public-value-standards-and-commons.md) owns the exact proposed pedagogical-claim schema.


## Learning activities and responsive tuition

A practical initial repertoire comprises three proposed skills, drawn from the 5 September 2026 *OCE enablement assessment* (F17), its inspected EEF and Emma McCrea sources, and the integrating service requirements R-SVC-05–08:

| Repertoire | Learner/service activity | Warrant and limit |
|---|---|---|
| Elicit and interpret understanding | Clarify the learner's question, invite relevant reasoning, retain possible interpretations and locate pertinent Oak material | Subject PCK plus individual-tuition/formative-evidence guidance; a bare answer or verbal fluency is insufficient diagnosis |
| Explain and respond | Select an explanation, model, question or feedback response; refer to the existing resource; attend to whether the learner uses the help | Explanation and questioning can alternate according to need; feedback requires subsequent learner action |
| Support self-regulation | Help the learner plan, monitor, explain and evaluate an approach; vary and fade support within the subject | Subject-embedded metacognition, not a universal reflection script or engagement reward |

**Worked conversation candidate.** A learner says, “I can follow the worked example, but I don’t understand why that step works.” The service establishes the specific step, locates Oak's explanation or representation, elicits the learner's account and responds to it. A question may discriminate between explanations of the difficulty; an explanation may supply missing knowledge. The next learner contribution determines whether to clarify, explore, practise, connect or move on. The learner can redirect the conversation. A complete-conversation check asks whether the service follows meaning, uses sources correctly, recovers from misunderstanding and preserves agency. Comparison with the same model and Oak tools without explicit pedagogical resources could isolate a bounded contribution; learner benefit and durable capability need later evidence.

The application/host needs a visible catalogue and orientation, plus loading of the relevant skill and source context before response. A hidden document collection is not an exercised tuition capability. The engineering boundary and delivery proposals are in [document 08](08-oce-audit-and-engineering-findings.md), while [document 13](13-oce-work-programme-and-integration.md) connects this to useful first work.

The knowledge basis is [EEF one-to-one tuition](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/one-to-one-tuition), [feedback](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/feedback), [metacognition](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/metacognition), [oral-language interventions](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/oral-language-interventions), [Dialogic Teaching](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/dialogic-teaching) and [McCrea's subject knowledge for teaching](https://emmamccrea.com/2021/10/05/subject-knowledge-for-teaching/). These support pedagogical reasoning; their effects do not transfer automatically to AI enactment.

### Activity families

| Activity | Work preserved for the learner | Possible service contribution and human/tool role | Evidence question |
|---|---|---|---|
| Manipulate and compare representations | Change a diagram, graph, expression or model; explain an invariant | Link representations, supply a discriminating contrast; educators validate semantic equivalence and access | Does later unfamiliar unaided work show the concept survived the representation change? |
| Investigate and test ideas | Propose an account, predict, inspect/gather data and revise | Bounded simulation, source access or feedback; practical equipment and supervision where required | Is evidential reasoning the learner's and does it survive changed context? |
| Read, discuss, create and revise | Develop interpretation or composition with evidence, purpose and voice | Targeted critique, comparison and questions; peers and humans contribute authentic dialogue/moderation | Is revision substantive and is later independent reading/writing stronger? |
| Rehearse and practise | Conduct language interaction, debug code, rehearse procedure or perform technique | Suitable tools, feedback, examples and relevant people/settings | Does authentic independent performance extend beyond the practised script/test cases? |
| Reflect and plan | Compare predictions with work, select strategy and decide when help is useful | Calibrated prompts, evidence access and links to people/resources | Does self-direction improve without treating help avoidance as independence? |

These are design candidates, not evaluated interventions. Productive offloading removes demands irrelevant to the construct, such as reformatting equivalent accessible content. The intended inference, retrieval, composition or embodied practice remains the learner's work. The same feature can aid one goal and displace another.

### Coherent episode functions

| Function | Required meaningful behaviour | What must remain visible |
|---|---|---|
| Orient | Establish accountable learning purpose/source and relevant prior knowledge | Context, objective, scope and learner/teacher authority |
| Elicit | Obtain a genuine attempt, account or representation | Response and assistance conditions; no understanding inference from speed/confidence alone |
| Interpret cautiously | Ask a discriminating question and retain competing task-grounded hypotheses | Observation, uncertainty, evidence and any correction; no sensitive trait inference |
| Support | Choose the least sufficient valid question, contrast, cue, representation or worked step | Approved move, answer-disclosure decision and disciplinary destination |
| Require learner action | Revise, explain, compare or solve using the feedback | Delivered opportunity and what the learner subsequently did |
| Check unaided | Use an appropriate no-help activity, later revisited after delay and change of context | Performance conditions and assessment boundary; supported success remains distinct |
| Fade and return | Reduce support, plan revisiting and return concise evidence to the accountable person | Dependency or unresolved difficulty triggers a reviewed change of route or hand-off |

The source service report §6.3 supplies these functions; the later integrating requirements explicitly treat their form and sequence as profile-dependent, not a universally proven linear script. Explanation may provide necessary knowledge before a useful attempt becomes possible. Selected action, transmitted output, rendered/accessed output, acknowledgement, learner action and outcome are different observations. Runtime transition, tools, validation, cancellation and budget responsibilities must be exercised in the composed activity. A curated sequence can test progression, revisiting and fading with minimal state.

The mathematics-to-English contrast illustrates the boundary: resource loading, provenance and cancellation may transfer, while a fixed-correctness rubric or hint sequence may fail textual interpretation and authorship. A changed host can also alter disclosure, navigation or human help even with identical activity bytes. Proposed proof scenarios PS-05, PS-18–22 and PS-26–28/31 in [document 07](07-capabilities-bridges-and-proof.md) retain the complete test obligations; they are designed, not executed.


## Subject families, tools and authentic outcomes

The [National Curriculum in England](https://www.gov.uk/government/publications/national-curriculum-in-england-framework-for-key-stages-1-to-4/the-national-curriculum-in-england-framework-for-key-stages-1-to-4) specifies materially different forms of knowledge and accomplishment: mathematical reasoning; spoken and written language; scientific enquiry; historical evidence; geographical fieldwork; language interaction; programming; artistic creation; musical performance; designing and making; and physical competence. A curriculum states valued ends and content; it does not by itself determine pedagogy or prove that a service achieves them.

Pedagogical content knowledge explains the missing layer. Shulman described the representations, examples, misconceptions and learning difficulties that make particular content teachable; later work in mathematics and disciplinary literacy shows that expert instructional knowledge and ways of reading, arguing and evidencing differ by discipline ([Shulman, 1986](https://journals.sagepub.com/doi/10.3102/0013189X015002004); [Ball, Thames & Phelps, 2008](https://journals.sagepub.com/doi/10.1177/0022487108324554); [Shanahan & Shanahan, 2008](https://www.harvardeducationalreview.org/content/78/1/40)). These sources support subject specificity, not an AI implementation.

Some outcomes are also constituted through activity beyond dialogue. Situated-learning research treats knowledge as partly embedded in authentic practices and communities; physical and virtual laboratories make different contributions and can be complementary; active interaction is material to second-language development ([Brown, Collins & Duguid, 1989](https://journals.sagepub.com/doi/10.3102/0013189X018001032); [de Jong, Linn & Zacharia, 2013](https://doi.org/10.1126/science.1230579); [Mackey, 1999](https://doi.org/10.1017/S0272263199004027)). Modern multimodal AI changes the available tools but does not erase the need to validate whether those practices and outcomes survive.

Historic intelligent-tutoring evidence is encouraging but bounded. Meta-analyses found positive average effects for specialised ITS, with variation by comparator and implementation; those systems usually encoded domains, learner states and pedagogical policies rather than relying on a universal chat layer ([Ma et al., 2014](https://doi.org/10.1037/a0037123); [Kulik & Fletcher, 2016](https://journals.sagepub.com/doi/10.3102/0034654315581420)). A 2025 Harvard physics trial found strong immediate results for two instructor-built lessons, but used detailed solutions and manually sequenced multipart problems and warned against generalising to all learning contexts ([Kestin et al., 2025](https://www.nature.com/articles/s41598-025-97652-6)). In high-school mathematics, unrestricted GPT improved supported practice yet reduced later unaided performance; a constrained tutor mitigated the detected harm but did not establish a later learning advantage over control ([Bastani et al., 2025](https://www.pnas.org/doi/10.1073/pnas.2422633122)). Together these findings favour disciplined profiles and delayed unaided outcomes over generic conversational fluency.

### Subject-family commissioning map

The table is a commissioning map, not a claim that every profile is ready.

| Family | Irreducible profile content | Necessary tools, people or settings | Minimum credible evidence |
|---|---|---|---|
| **Mathematics** | Concepts, fluency, multiple representations, reasoning, proof, strategy and candidate misconception families | Structured notation, diagrams, manipulatives or dynamic representations | Delayed unaided near transfer, bounded farther transfer, explanation and independence—not assisted accuracy alone |
| **English and literacy** | Spoken language, decoding and comprehension, literature, composition, genre, rhetoric, vocabulary, voice and revision | Extended texts, speech, discussion, drafting history and human moderation where necessary | Authentic unseen reading, extended writing and oral outcomes; preservation of learner voice and source use |
| **Science** | Disciplinary concepts plus hypotheses, observation, measurement, evidence, models and uncertainty | Data tools, simulations, physical laboratories, equipment and safety-supervised practical work | Conceptual transfer plus practical, evidential and experimental competence |
| **Humanities and social enquiry** | Source criticism, chronology, causation, interpretation, argument, spatial reasoning, perspective and field enquiry | Primary sources, maps, archives, data and fieldwork | Unseen-source analysis, defensible argument and judgement, map/data/fieldwork tasks; legitimate plurality preserved |
| **Languages** | Listening, speaking, reading, writing, interaction, pronunciation, pragmatics and cultural knowledge | Speech technologies and authentic interaction with people, communities and culture | Spontaneous communication across modalities, not vocabulary or grammar quizzes alone |
| **Computing and digital disciplines** | Computational thinking, algorithms, programming, systems, debugging, security and digital literacy | Sandboxed execution, tests, debuggers, data and hardware where relevant | Unaided construction, testing and debugging on unfamiliar tasks, including explanation and security |
| **Arts and performance** | Technique, perception, interpretation, experimentation, aesthetic judgement, composition and individual or collective voice | Images, sound, instruments, materials, rehearsal, ensemble and live performance | Portfolio, process and performance evidence judged with suitable expert and learner participation |
| **Design, PE, practical and vocational learning** | Designing, making, embodied/tacit skill, safe tool use, movement, teamwork and workplace judgement | Materials, equipment, instructors, supervisors, peers and authentic settings | Direct observation of safe performance and transfer; conversational recall is insufficient |

No profile should lower its intellectual or disciplinary destination to make it easier for the model to score. Where the service can support only part of an outcome—for example, planning an experiment but not safely conducting it—that boundary must be explicit to the learner and educator.


## Lifelong contexts and learner-controlled continuity

UNESCO defines lifelong learning as activity for people of all ages across family, school, community and workplace and through formal, non-formal and informal modalities ([UNESCO Institute for Lifelong Learning](https://www.uil.unesco.org/en/unesco-institute/mandate/lifelong-learning)). This establishes the breadth of the public problem, not an effect claim for this service.

The service should distinguish at least these context profiles:

| Context | Primary purpose and authority | Design implications | Outcomes and risks |
|---|---|---|---|
| **School** | Curriculum entitlement under school/teacher and safeguarding authority | Teacher preview, sequencing, correction, override and family/learner information | Curriculum-valid learning, independence, equity, workload; avoid displacement and automation bias |
| **Post-16 continuation and resits** | Subject- and route-specific progression after varied prior learning | Diagnose cautiously, preserve dignity, fit timetables and provider duties; separate GCSE subjects and other qualifications | Delayed unaided capability, qualification/progression and wellbeing; avoid deficit labelling and grade-threshold tunnel vision |
| **FE/HE** | Programme, disciplinary and learner goals under institutional assessment rules | Advanced subject profiles, academic integrity, accessible study and clear boundary between tutoring and assessed authorship | Disciplinary capability and independent work; avoid outsourcing assessed thinking |
| **Adult foundations/return to learning** | Learner-directed goals with possible provider/community support | Plain but non-patronising language, flexible pacing, prior-learning recognition, human and offline routes | Functional independence, progression, confidence calibrated to competence; avoid stigma and digital exclusion |
| **Vocational/workplace** | Occupational competence and safety; authority shared among learner, provider, employer and regulator | Authentic tasks, supervisors, equipment, occupational standards and strict limits on employer access to learner state | Safe workplace performance and transfer; avoid surveillance, coercion and credential overclaim |
| **Professional learning** | Maintained or extended expertise under professional standards | Case reasoning, deliberate practice, evidence updates, peer/expert routes | Changed professional capability and practice; avoid fluent but unsafe advice |
| **Language, civic, community and personal learning** | Learner-defined purposes and community relationships | Cultural/context profiles, interaction, local knowledge and optional credentials | Sustained participation, authentic capability and agency; avoid synthetic relationship replacing people/community |

Adult learning is not simply self-service schooling. UNESCO's [Recommendation on Adult Learning and Education](https://www.unesco.org/en/legal-affairs/recommendation-adult-learning-and-education) spans basic skills, second chances, citizenship, community and professional development. Workplace learning is often tacit, relational and embedded in work rather than a sequence of decontextualised lessons ([Eraut, 2004](https://doi.org/10.1080/158037042000225245)). QAA [Subject Benchmark Statements](https://www.qaa.ac.uk/the-quality-code/subject-benchmark-statements) and [Skills England occupational maps](https://occupational-maps.skillsengland.education.gov.uk/) illustrate that disciplinary and occupational authorities differ.

Learning processes also change across the lifespan and context. The National Academies notes that executive-function components develop and change across adulthood, that older adults may recruit different processes, and that self-regulation supports learning throughout life ([*How People Learn II*, 2018](https://www.nationalacademies.org/read/24783/chapter/6)). This warrants adaptable pacing and support, not age stereotyping. Adult-learning participation is unequal by education, skills and socioeconomic position, so digital reach among existing users cannot establish equitable public value ([OECD, *Trends in Adult Learning*, 2025](https://www.oecd.org/en/publications/trends-in-adult-learning_ec0624a6-en/full-report/who-is-missing-out_06d9e34f.html)). Mobile, low-bandwidth, downloadable, printable and human-supported routes need to be commissioned and evaluated.

### Continuity with learner control

Continuity is useful when it helps the learner resume goals, recognise prior learning, revisit evidence and control progression. It becomes harmful when provisional inferences accumulate into an identity, outlive their context or become available for employment, eligibility or discipline.

Prefer portability of:

- learner-declared goals and access preferences, selectively chosen;
- observable work and assessment evidence with provenance and context;
- issuer-signed achievements, criteria, status and validity;
- the learner's own notes, plans and reflections.

Any permitted concept/strategy or candidate-misconception hypothesis remains local, uncertain, time-stamped, expiring, correctable and normally subject/context-bound; persistence requires the separate E7 necessity, calibration and incremental-value case. Motivation, diagnosis or other sensitive attributes are not inferred service state. Receiving contexts should revalidate rather than inherit. Open Badges and Comprehensive Learner Record can transport verifiable records, but technical verification does not establish educational quality or recognition ([1EdTech Open Badges](https://www.1edtech.org/standards/open-badges); [1EdTech CLR](https://www.1edtech.org/standards/clr)). A qualification level likewise describes difficulty, not equivalent content or volume ([UK qualification levels](https://www.gov.uk/what-different-qualification-levels-mean)).

Rights/custody/correction/expiry and receiving-context action authority are defined in [document 06](06-state-rights-and-context.md). The learning context determines what information remains relevant, not the mere availability of an export. Subject matter, accredited recognition and a learner's goals each need their own valid mapping.


## Profile expansion and commissioning

“All subjects” should shape architecture and commissioning from the outset, while validation proceeds by uncertainty and risk.

| Profile-development stage | Work | Evidence needed to advance |
|---|---|---|
| **0. Need and suitability** | Define the public problem, users, alternatives, contributions of learners, educators, service functions and tools and reasons this service is appropriate | Affected-party and educator evidence; plausible additionality; no better lower-risk alternative overlooked |
| **1. Profile specification** | Author the nine-part profile contract with subject experts, educators, learners, SEND/access specialists and assessment expertise | Coverage and conflict map, authentic outcomes, hazard/access analysis, versioned fixtures and accountable owners |
| **2. Component feasibility** | Test diagnosis, moves, representations, tools, speech, simulations, access modes and hand-off separately | Accuracy, reliability, usability, accessibility, failure recovery and no critical gate failure in declared coverage |
| **3. Bounded pilot** | Exercise the assembled profile in realistic workflows before claiming effect | Feasibility, fidelity, burden, learner/educator experience and early unaided evidence; no authority leakage |
| **4. Independent efficacy** | Preregistered comparison with the best credible alternative for that profile and context | Delayed unaided capability, authentic transfer, distributional effects, implementation and full-lifecycle cost |
| **5. Transport/effectiveness** | Replicate across institutions, learner groups and delivery conditions | Stable or explainably varying effects, reach, equity, educator workload, safety and external validity |
| **6. Bounded scale** | Scale only validated cells; retain explicit experimental status elsewhere | Continuous outcome and drift monitoring, independent audit, rollback, revalidation and sunset rules |

The unit of validation should be explicit:

> **subject/profile × learning goal × learner group × context × modality/tools × human-supervision mode × service version**

The next profiles after mathematics and English should be selected for contrast rather than convenience. A useful sequence includes one enquiry/practical science profile, one humanities source-reasoning profile, one language interaction profile, one computing/debugging profile, one creative/performance profile and one vocational/embodied profile. This is a research portfolio, not simultaneous rollout.

Human-led AI support should be a first-class mode. A preregistered mathematics trial of Tutor CoPilot reported a modest improvement in session exit-ticket passing, particularly for lower-rated tutors, while preserving human choice over the intervention; it does not establish autonomous or cross-subject effects ([Wang et al., 2025](https://edworkingpapers.com/sites/default/files/ai24_1054_v2.pdf)). Copilot modes may be especially appropriate where teaching is relational, practical, high-stakes or safeguarding-sensitive.

### Commitments, experiments and commissioned expertise

| Category | Required disposition |
|---|---|
| **Commit now** | One accessible public kernel; explicit subject/phase/context profiles; preservation of disciplinary work; attempt/action/fading invariants; learner and educator authority; separately governed assessment; provenance; human/situated routes; no cross-profile effect transfer. |
| **Test in the POC** | Mathematics profile validity and bounded added value; English as a contrasting profile/portability test; whether the kernel preserves distinctions without rewriting; non-author implementation and substitution. |
| **Research next** | Optimal profile granularity; which core mechanisms genuinely transfer; subject-specific learner-state value; multimodal and tool reliability; when copilot, autonomous, resource-only or human-only modes are best. |
| **Commission deliberately** | Subject panels and learner councils; authentic task/assessment banks; science/practical safety; language/speech and cultural expertise; creative/performance evaluation; vocational/workplace observation; adult/community needs-and-options study; low-bandwidth and supported routes. |

Self-regulated learning can supply reusable planning, monitoring, reflection and help-seeking patterns, but its enactment remains domain- and context-sensitive. Meta-analyses report heterogeneous effects by domain and instrument; generic “think about your thinking” prompts are not a universal profile ([Panadero, 2017](https://doi.org/10.3389/fpsyg.2017.00422); [Donker et al., 2014](https://doi.org/10.1016/j.edurev.2013.11.002); [Hemmler & Ifenthaler, 2024](https://doi.org/10.1016/j.edurev.2024.100629)).

### Evidence gaps that matter to expansion

- extended English composition, literature, discussion and preservation of learner voice;
- scientific practical competence, fieldwork and safety rather than conceptual recall alone;
- history source reasoning, geographical enquiry and legitimate interpretive plurality;
- authentic second-language interaction, pronunciation, pragmatics and culture;
- unaided programming, debugging, systems reasoning and security;
- creative process, aesthetic judgement, portfolios, ensemble and live performance;
- embodied, equipment-based and workplace competence under real safety constraints;
- FE, adult foundations, resits, higher education, reskilling and informal learning effects;
- SEND access and outcomes within each representation and subject family;
- motivation, dependency and effects on teacher, peer, mentor and community relationships;
- validity and harm of cross-context learner-model transfer;
- recognition of service-supported evidence by awarding bodies, institutions and employers;
- full-lifecycle economics and equity of digital, blended and human alternatives.

Reconsider the shared-kernel strategy if non-author profile work repeatedly requires kernel rewrites, if invariants obstruct legitimate subject pedagogy, if human or simpler non-AI alternatives dominate, or if lifecycle cost and assurance burden exceed public value. Reopen any validated cell after material curriculum, model, tool, population, assessment or delivery change, or after new evidence of dependency, inequity or harm.

The source's numbered stages describe a development sequence, not an automatic permission ladder. The service's complete gates and specific proposed POC studies live in [document 04](04-poc-requirements-and-evaluation.md). Expansion selection remains a research/design decision, and the configured service may appropriately support only preparation, reflection, a copilot or a human/situated route for some purposes.


## Resits as learning, assessment and credential pathways

**Evidence clock for the following dossier:** research as of 4 September 2026; England policy year 2026–27; latest exam results summer 2026. All “current” mechanisms, prices, deadlines and future-status descriptions in this dossier refer to that snapshot. The four cases are theoretical decision records, not individual advice or instructions to carry out a live administrative action. Recheck exact rules, dates, specifications and receiver decisions before implementation or action.

A GCSE combines curriculum selection, teaching opportunity, sampled assessment, regulated marking/standard setting, certification and institutional use. Resitting may provide a new assessment sample, further education or credential recovery. A tuition service can help with learning and preparation while the learner may separately need an assessment remedy, a different route or a receiving institution's decision. None of those needs is adequately represented by a generic “resitter” label.

### Terminology table

| Term | Precise use in this report | Common error avoided |
| --- | --- | --- |
| GCSE | A regulated subject qualification with DfE content (in England), an awarding-body specification, defined assessments and a certificated result. | Treating it as only an exam or only a curriculum. |
| Specification | One awarding organisation's regulated design: content, assessment structure, entry codes and administrative rules. | Generalising an AQA mechanism to every board. |
| Assessment objective | A regulator-prescribed category of knowledge/skill that the assessment must cover in stated proportions. | Treating a total grade as a diagnosis of every subskill. |
| Component | A paper or non-exam element contributing to the qualification. | Assuming one paper is independently certifiable. |
| Raw/scaled mark | Credit awarded on a component; scaling aligns a component to its intended weight. | Calling a raw percentage a grade across years. |
| Grade boundary | The minimum total mark for a grade in a particular specification, tier and series. | Treating grade 4 as a fixed percentage. |
| Grade | An ordinal category summarising aggregate assessed performance under that series's rules. | Treating adjacent grades as natural ability classes. |
| Level 1 / Level 2 | RQF demand categories. In England GCSE 1–3 is Level 1; 4–9 is Level 2. | Inferring identical content or currency from a shared level. |
| “Standard pass” | DfE shorthand for grade 4+ in England. | Treating this policy label as the only meaning of pass. |
| “Strong pass” | DfE shorthand for grade 5+ in specified English/maths performance measures. | Treating grade 5 as the universal pass line. |
| U | Unclassified: performance did not reach the lowest reportable grade available on that entry/tier. A Higher-tier U does not establish inability to obtain a lower Foundation-tier grade. | Calling every below-4 result unclassified. |
| Candidate / entry / result | Person / registration for a qualification or component / awarded outcome. One person can create multiple entries and results. | Converting result counts directly into learner counts. |
| First resit / repeated resit | First post-initial attempt / later additional attempt. | Treating all 17-year-old or post-16 results as first resits. |
| Resit or retake | A fresh assessment attempt; for linear GCSEs usually fresh entry for the whole qualification. | Equating it with review of the original marking. |
| Continued study | Further teaching without necessarily entering the next available series. | Assuming the funding condition mandates November entry. |
| Review / appeal / special consideration | A review addresses specified marking error; appeal addresses the AO's decision/process; special consideration addresses qualifying adverse circumstances at assessment. | Treating all as a generic “re-mark.” |
| Access arrangement / reasonable adjustment | A JCQ operational provision for an evidenced need / the Equality Act duty to take reasonable steps where disability creates substantial disadvantage. Some access arrangements are centre-delegated, others need online or awarding-organisation approval, and some cover needs that are not statutory disabilities. An arrangement may implement a reasonable adjustment, but the categories are not coextensive. | Assuming the administrative label determines legal liability, or that every access arrangement proves disability. |

The preferred description of an England grade 3 is: **“an awarded GCSE outcome at Level 1, below the grade-4 Level-2/standard-pass threshold.”** Whether ordinary speech calls that a pass or fail should never replace the purpose-specific facts. [Qualification levels](https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels); [DfE factsheet for employers and providers](https://assets.publishing.service.gov.uk/media/5cd2e9efed915d7892a83e71/GCSE_factsheet_for_employers_FE_and_HE_providers__final_.pdf).

### Qualification layers and resit functions

### Layered model

| Layer | What it does | What a result can support | What it cannot support alone |
| --- | --- | --- | --- |
| Curriculum/content | Selects valued subject knowledge and skills. | Claims about the intended domain. | Claims about what was actually taught or learned. |
| Teaching/opportunity | Provides time, explanations, practice, feedback and support. | Evidence of opportunity when delivery/attendance is verified. | Inference from enrolment or planned hours alone. |
| Assessment sample | Elicits performance on selected tasks under controlled conditions. | Evidence about attainment on the sampled construct. | Complete inventory of capability or potential. |
| Marking/standard setting | Converts responses to marks and maintained grade categories. | Regulated ordinal outcomes intended to be comparable within a subject across boards and years, within stated limits. | Perfect classification, a fixed raw standard, or psychometric equivalence of the same grade across subjects. |
| Certification | Records an awarded qualification outcome. | Portable evidence that can be verified. | A requirement that every receiver treat it identically. |
| External use | Admissions, employment, accountability and funding systems apply thresholds. | Real gate-opening/signalling consequences. | Proof that the threshold is a natural competence discontinuity. |
| Resit pathway | Adds teaching, a new performance sample and/or another credential opportunity. | Potential learning and changed external treatment. | Causal benefit merely because a later pass occurs. |

Current Ofqual conditions explicitly give GCSEs three purposes: evidence of achievement against demanding content; a foundation for further academic/vocational study and employment; and a basis for public accountability where government requires it. These purposes can reinforce one another, but a design optimised for system comparability may not be ideal as an individual diagnostic, and a threshold useful for manageable selection may create discontinuous consequences from a continuous and uncertain score. [Ofqual GCSE conditions, updated 14 July 2026](https://www.gov.uk/government/publications/gcse-9-to-1-qualification-level-conditions/gcse-9-to-1-qualification-level-conditions-and-requirements).

### Three functions hidden inside “resit”

| Function | Intervention | Relevant counterfactual | Success measures |
| --- | --- | --- | --- |
| Reassessment | A new, comparable assessment sample intended to assess the same construct. | No new attempt; review/special consideration of the original result. | Classification stability; fair access; evidence that anomalous performance no longer dominates. |
| Remedial education | Additional or different teaching before assessment. | No further teaching; same teaching repeated; alternative/contextualised teaching. | Knowledge/skill gain, retention, transfer, engagement—not merely grade. |
| Credential recovery/improvement | Cross a receiver's threshold or obtain a higher signal. | Keep existing result; take another credential; destination changes its rule. | Access to course/work, retention and longer-run outcomes net of costs. |

Calling all three “resit policy” obscures the unit of intervention. For example, a learner might receive 100 planned hours but attend few, attend and learn but not be entered, be entered without adequate new teaching, or improve one grade while remaining below 4. Each is a different policy state and should appear differently in evaluation.

### Causal route and source method

Funding/local requirement → enrolment and planned provision → attendance and teaching received → learning/readiness → examination entry → grade/credential → education, work and wellbeing. Selection, attrition, institutional discretion and measurement limitations can occur at every transition. An earlier administrative event supplies no proof of the later educational outcome.

The source report used operative authority first, followed by original experimental/quasi-experimental, longitudinal and qualitative evidence and disconfirming findings. It separated legislation, funding guidance, regulator conditions, JCQ procedure, awarding specifications and local receiver rules. Statistics name nation, period, unit, cohort and point-in-time versus cumulative scope. England receives deep coverage; Wales, Northern Ireland and Scotland provide bounded structural contrasts. An international comparison was deliberately omitted because UK contrasts already isolated useful design choices and a short foreign analogy would not support like-for-like inference. Adults returning later, non-entry, repeated-resitter trajectories, delivered teaching dose, route effects, wellbeing and national costs remain specifically bounded evidence gaps, not silently completed research.


## Resits: authority, rules and jurisdictions

#### Concise policy timeline

| Date | Change | Why it matters now |
| --- | --- | --- |
| 1951 / 1965 | O-level began, aimed principally at the highest-attaining minority; CSE later served a wider group, with CSE grade 1 treated as equivalent to O-level grade C. | GCSE inherited the problem of certifying a broad attainment range. The population shares describe historical design, not ability classes. [Chitty, 2013](https://journals.lwbooks.co.uk/forum/vol-55-issue-3/article-5613/). |
| 20 June 1984 / 1986 / 1988 | Government announced one GCSE with national criteria and A–G grades; first teaching 1986, first awards 1988. | One certificate replaced the dual system, while differentiated/tiered assessment remained. [Hansard, 20 June 1984](https://hansard.parliament.uk/lords/1984-06-20/debates/b66b27ce-426b-4ed2-8fd5-39afa4d42bb8/DepartmentOfEducationAndScience). |
| 2014–15 | England introduced the post-16 English/maths condition of funding. | It made continued study an institutional funding requirement; it did not convert all below-threshold learners into holders of a personal GCSE duty. [Education Committee, 2025, paras 103–104](https://publications.parliament.uk/pa/cm5901/cmselect/cmeduc/666/report.html). |
| 2015 teaching / 2017 awards | Reformed English and maths moved to 9–1, more linear examination and more demanding content; other subjects phased later. | Grade 4 is anchored to the bottom of legacy C, not a grade-by-grade conversion. [DfE reform facts](https://www.gov.uk/government/publications/get-the-facts-gcse-and-a-level-reform/get-the-facts-gcse-reform). |
| 2020–21 / 2022–23 | Pandemic examination cancellation and teacher-assessed arrangements were followed by adaptations and a return to pre-pandemic grading standards. | Cohorts observed at age 19 in current data experienced disrupted assessment/learning; time comparisons need care. [Ofqual grading explainer](https://www.gov.uk/government/publications/gcse-and-a-level-grading-what-you-need-to-know/gcse-and-a-level-grading-what-you-need-to-know). |
| 2025–26 | White Paper committed to a Level 1 preparation route; consultation closed June 2026; current funding rule remained in force. | Proposed modular/foundation design is not yet operative and has no confirmed first-teach date at the cutoff. [White Paper](https://www.gov.uk/government/publications/post-16-education-and-skills-white-paper/post-16-education-and-skills-white-paper); [consultation](https://www.gov.uk/government/consultations/16-to-19-level-1-english-and-maths-qualifications). |

#### Who controls what

| Body/actor | Instrument and jurisdiction | Function | Affected party / force |
| --- | --- | --- | --- |
| UK Parliament | Education and Skills Act 2008; Equality Act 2010 | Participation framework; equality duties. | Legal duties within territorial scope. |
| Department for Education | Subject content, performance measures, 16–19 funding condition; England | Defines content and public-policy uses; attaches conditions to funding. | Providers directly; learners indirectly through provision. |
| Ofqual | General and GCSE qualification/subject conditions; England | Regulates awarding organisations, standards and qualification fitness for purpose. | Binding on recognised awarding organisations; Ofqual does not run centres. |
| Awarding organisations (AQA, OCR, Pearson, WJEC Eduqas) | Specifications, papers, marking, awards and post-results services | Operational qualification delivery within regulatory conditions. | Centres and candidates through entry/service rules. |
| JCQ | Common administrative guides and timetables | Coordinates member-board procedures, access arrangements, special consideration and post-results processes. | Contractual/operational through member awarding organisations; not legislation or a regulator. |
| School/college/exam centre | Entry, tier, timetable, invigilation, access implementation and enrolment policy | Delivers teaching and assessment administration; initiates most post-results services. | Local duties/terms; may have statutory equality obligations. |
| Destination institution/employer | Admissions, progression or recruitment criteria | Decides how a credential is used, subject to applicable law/policy. | Local threshold; not automatically a national definition of pass. |

The role split is confirmed in the [Ofqual guide for schools and colleges 2026](https://www.gov.uk/government/publications/ofqual-guide-for-schools-and-colleges-2026/ofqual-guide-for-schools-and-colleges-2026). It is the foundation for interpreting every case: an awarding-board rule cannot itself establish a statutory learner duty; a funding condition cannot settle a local admission; and an Equality Act issue is not resolved merely by changing an exam mark.

### Assessment, grading, validity, reliability and tiering

#### From responses to a grade

England's GCSEs are generally linear: exam components are normally completed in May/June of one year, though English Language and maths also have an age-restricted November series. “Linear” does not mean one paper; a qualification can aggregate several papers and essential non-exam assessment. [Ofqual GCSE conditions](https://www.gov.uk/government/publications/gcse-9-to-1-qualification-level-conditions/gcse-9-to-1-qualification-level-conditions-and-requirements).

Markers apply mark schemes; monitoring can include unseen seed items and, for some material, blind double marking. Awarders then consider the paper's demand, prior-attainment/statistical evidence, previous standards and scripts around proposed key boundaries. Key boundaries—1/U, 4/3, 7/6 and 9/8—are set directly. Most remaining boundaries are arithmetically derived, subject to tier-specific grade-5 alignment and safety-net adjustments. This is neither a simple fixed-criterion system nor rank-order grading to a quota. [Ofqual, “What happens after...”](https://www.gov.uk/government/publications/ofqual-student-guide-to-exams-and-assessments-in-2026/what-happens-after-you-have-taken-your-exams-or-assessments); [grading explainer](https://www.gov.uk/government/publications/gcse-and-a-level-grading-what-you-need-to-know/gcse-and-a-level-grading-what-you-need-to-know); [Rhead, Black and Pinot de Moira, 2018](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/759207/Marking_consistency_metrics_-_an_update_-_FINAL64492.pdf).

The National Reference Test adds an annual English/maths anchor. More than 13,000 Year 11 pupils in over 330 schools took the stable short test in 2026; sustained maths evidence affected upper boundaries, while English evidence at grade 4 was insufficiently consistent for adjustment. That illustrates maintained standards without a grade quota. [Ofqual NRT 2026 design](https://www.gov.uk/government/publications/the-national-reference-test-in-2026); [2026 findings](https://ofqual.blog.gov.uk/2026/08/20/the-2026-national-reference-test-rising-attainment-in-maths-and-what-this-means-for-grades/).

#### Validity and the grade-4 boundary

Validity concerns support for intended interpretations and uses. Consequences also matter to overall fitness for purpose, although whether wider societal consequences belong within validity itself is contested. Ofqual's 2026 framework treats fitness for purpose as a balance among validity, reliability, comparability, manageability and minimising bias. An exam can support a broad attainment inference yet be too coarse to diagnose an individual's algebra gaps, functional writing or readiness for one particular course. A highly reliable narrow test could also underrepresent the subject. [Ofqual, *Designing qualifications that will be fit for their purposes*, 2026](https://www.gov.uk/government/publications/designing-qualifications-that-will-be-fit-for-their-purposes--2/designing-qualifications-that-will-be-fit-for-their-purposes-accessible).

Official grade descriptors describe likely midpoint performance only at grades 2, 5 and 8; they are not mark schemes and do not award grades. There is no official universal checklist at grade 4 that creates a natural competence discontinuity. [Ofqual grade descriptors](https://www.gov.uk/government/publications/grade-descriptors-for-gcses-graded-9-to-1). Nevertheless, grade 4 anchors a maintained Level-2 standard and receivers act on it. Measurement imperfection and real gatekeeping can therefore both be true.

#### Reliability and one-mark differences

Reliability is repeatability under an equivalent assessment. Variation can arise from which content is sampled, candidate state on the day, item form, marker judgment and cross-year standard setting. The unobservable “true score” is conceptual—average performance over equivalent repeated assessments—not a hidden exact mark that a review can always recover. Boundary-near candidates face the greatest classification sensitivity. [Ofqual reliability compendium](https://www.gov.uk/government/publications/reliability-of-assessment-compendium/introduction-to-the-concept-of-reliability).

Ofqual's 2017 operational study modelled 16.4 million marking events across 453 components and 86 complete GCSE/AS/A-level qualifications. Its modelled probability of receiving the definitive qualification grade—derived by aggregating item-level mark-difference distributions anchored to senior-examiner seed marks—ranged from 0.96 in one maths qualification to 0.52 in one English language-and-literature qualification; exact-or-adjacent exceeded 0.95. These are **not “wrong-grade rates”**: the model relies on seed representativeness and independence assumptions, omits non-marking sources of error, and covers selected 2017 qualifications. [Rhead, Black and Pinot de Moira, 2018](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/759207/Marking_consistency_metrics_-_an_update_-_FINAL64492.pdf).

Accordingly, “one mark below” establishes closeness to the published boundary and potential decision sensitivity. It does not establish a marking error, quantify the chance of a different result on another day, or entitle the learner to an uplift. A review changes a mark only for an administrative error, failure to apply a non-judgmental rule, or unreasonable academic judgment—not merely because another reasonable marker might differ. [Ofqual qualification-level guidance](https://www.gov.uk/government/publications/gcse-9-to-1-qualification-level-guidance/gcse-9-to-1-qualification-level-guidance).

#### Tiering

Current tiered subjects include maths, combined/separate sciences, statistics and modern foreign languages. Foundation normally offers 1–5; Higher 4–9 with a narrow grade-3 safety outcome and then U. Grade 4 and 5 must represent the same standard across tiers, and the certificate does not report tier. Ofqual advises Foundation for a learner expected at 4 or 5. [Ofqual 2026 guide](https://www.gov.uk/government/publications/ofqual-guide-for-schools-and-colleges-2026/ofqual-guide-for-schools-and-colleges-2026).

Tiering can target question demand and reduce inaccessible items, but Foundation caps the outcome and Higher raises U risk. Evidence does not support a simple causal claim about aspirations. In Barrance's 2014–17 Wales/NI mixed-methods samples, most pupils supported tiering but Foundation pupils were less satisfied and reported cap/labelling concerns; the studies estimate perceptions, not attainment effects. In Benton's pre-reform England linked-data analysis, raw aspiration gaps largely disappeared after prior attainment/background adjustment, though residual confounding remains. [Barrance, 2020](https://bera-journals.onlinelibrary.wiley.com/doi/10.1002/berj.3629); [Benton, Research Matters 17](https://www.cambridgeassessment.org.uk/our-research/all-published-resources/research-matters/rm-17/). The compatible conclusion is that appropriate targeting can benefit many while information, cap and identity harms affect some; no strong causal estimate exists for current 9–1 tiering.

### Current UK jurisdiction matrix

The word “GCSE” does not imply one UK policy. Education, qualification regulation and funding are devolved; Scotland's mainstream school qualification is not a GCSE.

| Feature at 4 September 2026 | England | Wales | Northern Ireland | Scotland |
| --- | --- | --- | --- | --- |
| Regulator / principal national awarder | Ofqual regulates AQA, OCR, Pearson and WJEC Eduqas qualifications. | Qualifications Wales regulates; WJEC awards the new Made-for-Wales GCSEs. | CCEA Regulation regulates; CCEA is also an awarding organisation, with some other-board GCSE use. | Qualifications Scotland became the national body on 2 February 2026 and awards National Qualifications. |
| Main grading | 9–1; U below the available scale. | A*–G for single awards and paired A*A*–GG for double awards; subject designs can be single or double award. | CCEA uses a nine-grade A*–G scale including C*; other boards may use 9–1. | National 5 uses A–D and “No Award”; D (40–49%) is a valid award. |
| Current assessment/resit structure | Mainly linear. Ordinary GCSEs certify in summer; English Language and maths also in November for candidates aged 16+ at the preceding 31 August. Linear re-entry means all exam components; permitted NEA/endorsements may carry. | Reform is actively unitised in key subjects. New Maths and Numeracy double award has three units and summer/November opportunities; post-16 candidates have no terminal or unit-resit limit, with the better UMS from the latest two attempts used. New integrated English is unitised/untiered, with exams in summer/November and NEA in summer; first award summer 2027. | Current structures are specification-specific and may be modular or end-of-course; nidirect's government guidance permits a unit resit once with the better mark, subject to the specification. A March 2026 framework retains A*–G and plans mainly linear future qualifications, with named modular exceptions for English Language, Mathematics, Single Award Science and Double Award Science. | National 5 is a course award, not a GCSE. A repeat is normally a later whole-course attempt through a willing provider, with all current assessments/new coursework; no automatic National 4 fallback. |
| English/maths post-16 national condition | Distinctive 16–19 provider funding condition with grade- and programme-dependent routes and hours. | No nationwide analogue was identified in the regulator/government sources searched; a more flexible post-16 qualification menu announced for September 2027 is future policy. | No nationwide analogue was identified; particular training programmes may impose their own literacy/numeracy terms. | No nationwide analogue was identified; providers decide access/repeat opportunities within Scotland's system. |
| Reform status | Existing 2026–27 condition operative; proposed Level 1 preparation qualification remains under development after consultation. | Wave 1 first teaching began September 2025; Wave 2 began September 2026. Legacy resit windows overlap the transition. | Final policy framework published March 2026; detailed future specifications/timetable remain later work. A stale proposal for 9–1 is superseded by the final decision to retain A*–G. | Qualifications reform design 2026–28, development 2028–31 and phased launches from 2031 are future, not current National 5 rules. |

**Primary jurisdiction sources:** England's [Ofqual GCSE conditions](https://www.gov.uk/government/publications/gcse-9-to-1-qualification-level-conditions/gcse-9-to-1-qualification-level-conditions-and-requirements) and [DfE condition](https://www.gov.uk/government/publications/16-to-19-funding-maths-and-english-condition-of-funding/2026-to-2027-academic-year-16-to-19-funding-maths-and-english-condition-of-funding); WJEC's new [Mathematics and Numeracy](https://www.wjec.co.uk/media/ojhfscmj/wjec-gcse-mathematics-and-numeracy-specification.pdf) and [English Language and Literature](https://www.wjec.co.uk/media/w2mlpil0/wjec-gcse-english-language-and-literature-specification.pdf) specifications; Northern Ireland's [GCSE overview](https://www.nidirect.gov.uk/articles/gcses) and [March 2026 policy framework](https://www.education-ni.gov.uk/publications/policy-framework-general-qualifications-northern-ireland); Qualifications Scotland's [launch announcement](https://www.qualifications.gov.scot/news/qualifications-scotland-launched/), [National 5 description](https://www.sqa.org.uk/sqa/97077.html) and [reform timetable](https://www.qualifications.gov.scot/about/qualifications-reform).

#### Wales: live transition matters

Wales's current reforms are not simply a renaming of England's qualification. The new WJEC Maths and Numeracy double award is unitised and tiered (Higher A*–D; Foundation C–G), with three examinations weighted 30%, 30% and 40%; its first award was **scheduled** for November 2026, after this report's cutoff. The new integrated English Language and Literature qualification is unitised and untiered, with first award in summer 2027. Post-16 resit rules use unit marks and the best uniform mark from the latest two attempts rather than a complete “fresh start.” The exact rule must be read from the named specification, not inferred from “GCSE.” [WJEC maths specification](https://www.wjec.co.uk/media/ojhfscmj/wjec-gcse-mathematics-and-numeracy-specification.pdf); [WJEC English specification](https://www.wjec.co.uk/media/w2mlpil0/wjec-gcse-english-language-and-literature-specification.pdf).

Transition also creates overlapping legacy opportunities, subject to demand: WJEC lists legacy English Language resits in November 2026 and June 2027, legacy Mathematics in November 2026 and June 2027, and legacy Mathematics–Numeracy in January and June 2027. These are qualification-specific transition windows, not a permanent Welsh rule. [WJEC English Language qualification page](https://www.wjec.co.uk/qualifications/english-language-gcse/); [WJEC Mathematics page](https://www.wjec.co.uk/qualifications/mathematics-gcse/); [WJEC Mathematics–Numeracy page](https://www.wjec.co.uk/qualifications/mathematics-numeracy-gcse/).

#### Northern Ireland: current rules versus future framework

Northern Ireland permits both CCEA's letter scale (including C*) and, in some settings, 9–1 qualifications from other boards. Current component/resit mechanics therefore depend on the exact specification. The final March 2026 policy framework retained A*–G and set a future direction of mainly linear assessment, with modular exceptions specifically for English Language, Mathematics, Single Award Science and Double Award Science; it supersedes earlier consultative material suggesting 9–1. It would be an error to describe that future framework as every current subject's live assessment structure. [Department of Education NI policy framework](https://www.education-ni.gov.uk/publications/policy-framework-general-qualifications-northern-ireland).

#### Scotland: analogy, not equivalence

National 5 is an SCQF Level 5, 24-credit course award graded A–D/No Award; it is not a Scottish GCSE. A D is valid in Scotland but may not satisfy an English receiver's threshold. Repeat access depends on a provider offering the course, and the current course assessment must be completed; there is no general automatic lower-level award. [SQA National 5](https://www.sqa.org.uk/sqa/97077.html); [SQA course-level information](https://www.sqa.org.uk/sqa/72074.html). The organisational launch of Qualifications Scotland in February 2026 changed governance, not the substance of every award overnight. [Qualifications Scotland launch](https://www.qualifications.gov.scot/news/qualifications-scotland-launched/).

#### Bounded cross-border recognition into an English provider

For the England funding condition, DfE expressly accepts Welsh/NI GCSE grades A*–C, other-board NI 9–1 GCSE grades 4–9, and named Scottish awards: Intermediate 2 A–C, National 5 A–C, Higher A–C, Advanced Higher A–C and a pass in the SCQF Level-6 Communication unit, subject to verification. That is a **funding equivalence**, not a command that a sixth form, university or employer use the same conversion for admission. A Scottish National 5 D can be a valid Scottish award yet not satisfy this English condition. Equivalent UK qualifications are recorded as ECF/MCF 3 in ILR returns or U in school-census returns; UK ENIC is the route specified for overseas qualifications, not ordinary UK-award mapping. No authoritative public crosswalk was identified that assigns sub-threshold Welsh/NI/Scottish grades to the English condition's **grade-3 versus grade-2-or-below route branches**. Nor does the 2026–27 text expressly map the new Welsh paired double-award notation or integrated-English product. The provider should seek DfE clarification rather than invent a numerical or product crosswalk. [DfE condition, §§4, 7 and 9.3](https://www.gov.uk/government/publications/16-to-19-funding-maths-and-english-condition-of-funding/2026-to-2027-academic-year-16-to-19-funding-maths-and-english-condition-of-funding).

### Resit and post-results pathways: different mechanisms for different defects

The first question after a disappointing result is not “review or resit?” It is “what is alleged to be wrong?” The answer determines the authority, evidence, deadline and remedy.

| Mechanism | Problem addressed | Initiator / timing | Possible outcome and principal risk |
| --- | --- | --- | --- |
| Access to script | Need to inspect responses and marking before deciding. | Centre for an internal candidate; validated private candidates may use direct routes. Time-sensitive after results. | Information only; does not change the mark. Deadlines can precede review deadlines. |
| Clerical re-check (Service 1) | Unmarked material, addition, transfer or recording error. | Centre with written candidate consent by the published series deadline. | Mark/grade may rise, stay or fall; not a judgmental re-mark. |
| Review of marking (Service 2) | Administrative error, objectively wrong application, or unreasonable academic judgment. | Centre, component by component, with consent; ordinary GCSE deadline applies. | Reviewer corrects a defined marking error, not every reasonable difference. Mark/grade can fall and a downgrade cannot be revoked. |
| Review of moderation | Possible moderation error in centre-assessed work. | Centre for the relevant cohort/sample. | Can change cohort marks; under Ofqual's 2026 student guidance, grades cannot be lowered through this service. |
| Awarding-body appeal | Allegation that a review, access, reasonable-adjustment or special-consideration decision/process was inconsistent, improper or unfair. | Normally head of centre after the underlying decision; series/category deadlines differ. | Process/decision remedy; hearing is not an unrestricted new mark and cannot simply order a chosen grade. |
| Ofqual Exam Procedures Review Service | Whether the awarding organisation followed required procedure after its appeal route. | Candidate/centre after exhaustion of the awarding-body process. | Procedural review; Ofqual does not re-mark the script or itself award a grade. |
| Special consideration | Temporary illness, injury, bereavement or qualifying adverse event at assessment, including failure to deliver a previously approved arrangement. | Centre ordinarily applies at the time; exceptional late route needs compelling evidence before the relevant review deadline. | Tariff/alternative procedure determined by the AO; not a substitute for teaching, a late access application or a guaranteed target grade. |
| Access arrangement / reasonable adjustment | Removes or reduces access disadvantage before/during assessment without changing the competence tested. | Centre/SENCo and AO before assessment, based on evidence and normal way of working. | Enables valid access. Failure to deliver can trigger special consideration, complaint/malpractice and potentially separate equality issues. |
| Centre complaint / malpractice referral | Centre administration, conduct, communication or systemic failure. | Centre complaints process and, where appropriate, AO/regulator route. | Explanation, process correction, disciplinary/system remedy; does not itself instruct an AO to award grade 4. |
| Equality-law route | Possible disability discrimination or failure to make a reasonable adjustment. | Fact- and forum-specific legal/complaint process. | A legal or institutional remedy may exist, but administrative guidance alone does not establish liability or the appropriate individual action. |
| Fresh re-entry / resit | New evidence after further learning, changed readiness or an anomalous first sitting. | Candidate through a willing centre in an available series. | New result; costs, time and outcome risk. For linear exams, all exam components normally retaken. |
| Alternative qualification | A different construct or staged route may fit the learner/destination better. | Provider and learner within funding and destination rules. | May improve functional relevance or attainability, but recognition may differ even at the same RQF level. |

The governing cross-board sources are the [JCQ June/November 2026 post-results guide](https://www.jcq.org.uk/exam-results-data/post-results/), [JCQ appeals guide effective June 2026](https://www.jcq.org.uk/knowledge-hub/a-guide-to-the-awarding-bodies-appeals-processes-effective-from-june-2026/), [JCQ special-consideration guide](https://www.jcq.org.uk/knowledge-hub/a-guide-to-the-special-consideration-process-2/) and [Ofqual 2026 student guide](https://www.gov.uk/government/publications/ofqual-student-guide-to-exams-and-assessments-in-2026/what-to-do-if-you-think-there-is-a-mistake-in-your-results).

#### Whole qualification, NEA and endorsements

For an England linear GCSE, a fresh certificating entry normally requires all examination components in the same series. Only eligible non-exam evidence may be carried forward under the qualification/specification rules. AQA English Language 8700 therefore requires both written papers together, while its separately reported Spoken Language endorsement can normally carry forward. AQA Geography 8035 requires all three summer papers. AQA Combined Science 8464 requires all six summer papers; no “Chemistry paper” can independently upgrade the aggregate award. [AQA English Language scheme](https://www.aqa.org.uk/subjects/english/gcse/english-8700/specification/scheme-of-assessment); [AQA Geography scheme](https://www.aqa.org.uk/subjects/geography/gcse/geography-8035/specification/scheme-of-assessment); [AQA Combined Science scheme](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/scheme-of-assessment).

A later certification supplies another result; it should not be assumed to erase the earlier assessment history or to force every destination to consider only the higher grade. The practical rule is to obtain the new certificate/record and follow the receiving institution's disclosure instructions, declaring attempts/results where asked. No universal “best grade automatically replaces all earlier records” rule was identified.

### England's 2026–27 post-16 English and maths regime

#### The authority and covered population

The operative instrument is DfE's [2026–27 maths and English condition of funding](https://www.gov.uk/government/publications/16-to-19-funding-maths-and-english-condition-of-funding/2026-to-2027-academic-year-16-to-19-funding-maths-and-english-condition-of-funding), updated 24 July 2026. It applies chiefly to funded 16–18 learners (and up to 25 with an EHC plan) who lacked GCSE grade 4/equivalent at the end of Year 11 and join a programme of at least 150 planned hours. It also covers specified 19+ learners continuing a 16–19 programme and T Levels. Apprentices are outside this condition and follow separate apprenticeship rules. An adult returning later is not brought into this condition merely by wanting a GCSE; adult-skills funding, provider eligibility and willing-centre entry are separate questions and are bounded out of the four cases.

#### England route table

| Prior attainment and programme | Required/permitted route | Evidence/decision condition |
| --- | --- | --- |
| English Language or Literature grade 4+ / accepted equivalent | English condition already met. | Provider verifies/records prior attainment. A destination can still demand Language specifically. |
| Full-time; English Language grade 3 and Literature below 4/absent | GCSE English Language. | Full-time status must come from funded planned hours; November entry remains readiness-based. |
| Full-time; maths grade 3 | GCSE Mathematics. | Foundation can award grade 4/5; Higher is not required for the policy threshold. |
| Part-time; grade 3 | Any approved English/maths qualification in the relevant subject. | Learning aim must be approved and hours match programme band. |
| Grade 2, 1 or U / no relevant grade | GCSE or Functional Skills Level 2. | Neither GCSE nor Functional Skills Level 2 is uniquely mandated: the provider must select an approved route. Level 1/entry is permitted only where the learner is assessed as not ready for Level 2 and the provider evidences a progression rationale, subject to the narrow exemption/tolerance rules. |
| Same group not ready for Level 2 | Approved Level 1 or entry-level qualification as a stepping-stone. | Individual evidence must explain why it is best and how it progresses to Level 2. Starting from GCSE grade 2 (already Level 1) makes that rationale especially important. |
| SEND with EHC plan, capable of some approved route | Route rules still apply, with permitted small-group/embedded flexibilities. | SEND/EHC alone is not exemption. |
| Narrow exemption | No condition study. | EHC plan **and** individual structured assessment, authorised by an appropriate professional, showing inability to study GCSE, FS Level 2 or any approved Level 1/entry qualification; or accepted overseas-equivalence route. |

#### Programme size and minimum planned hours

| Annual planned programme hours | Typical band / status | Minimum per required English or maths subject |
| --- | --- | --- |
| 580+ | Band 5; full-time for age 16–17 | 100 hours |
| 485+ for the eligible age-18+ full-time band | Band 4a | 84 hours |
| 485–579 for part-time age-16–17 programmes | Band 4b | 84 hours |
| 385–484 | Band 3 | 66 hours |
| 150–384 | Bands 2/1 | 52 hours |

For age 16–17, DfE defines full-time as at least 580 planned hours; for age 18+, at least 485. Thus a college's ordinary-language label is insufficient. For a learner taking both subjects in Band 5, the condition occupies at least 200 planned hours—34.5% of a 580-hour minimum programme—before the encouraged extra 35 maths hours. That arithmetic demonstrates timetable exposure, not proven displacement or a monetary cost.

The minimum is ordinarily stand-alone, whole-class, face-to-face teaching. Small group, online and vocationally embedded activity can add valuable support but normally does not replace the minimum; specified EHC-plan flexibilities differ. Compliance data use **planned**, not attended, hours. Auditors may nevertheless examine timetables and attendance evidence to establish that provision was realistic and delivered. [DfE condition, §§2.3, 4.2 and 9–11](https://www.gov.uk/government/publications/16-to-19-funding-maths-and-english-condition-of-funding/2026-to-2027-academic-year-16-to-19-funding-maths-and-english-condition-of-funding).

#### Entry, withdrawal, tolerance and sanctions

- **Readiness:** providers decide whether to enter in November using prior results, attendance, engagement and progress. DfE warns that a lower grade 3 or below will normally require further teaching; it does not define a single test or compel the next series.
- **Qualifying period:** for qualifications lasting 24 weeks or more, six weeks; for shorter qualifications, two. After the qualifying period, a later withdrawal from that qualification can still count for condition treatment, though whole-programme withdrawal can affect retention funding. This is a funding rule, not evidence that the intended learning happened.
- **Tolerance:** provider compliance allows a 2.5% tolerance by student value. Funding reductions are stated at half the national rate above tolerance, and 2026–27 delivery feeds 2028–29 allocation. DfE's drafting lists several non-compliance modes in §9 but phrases the §10 deduction trigger conjunctively around enrolment and hours; it is prudent not to assert that every delivery-mode-only breach automatically yields the stated deduction without DfE clarification.

#### Four layers of “requirement”

| Layer | What it requires | What it does not establish |
| --- | --- | --- |
| Participation law | An eligible England-resident young person arranges and participates in qualifying education/training until 18. | A subject-specific duty to obtain grade 4 or sit each series. |
| DfE funding condition | In-scope provider plans/delivers approved English/maths study and records compliance. | Direct criminal/civil liability on the learner for not passing. |
| College enrolment/attendance agreement | May make attendance or course continuation a local condition, subject to its terms and applicable law. | A national rule; the exact consequence without reading the agreement/policy. |
| Awarding-body entry | Once entered, candidate/centre follow examination and administration rules. | A requirement to enter before the provider judges readiness. |

This layered answer resolves the common but misleading claim that a learner is simply “legally required to resit until they pass.” The funding condition creates strong institutional incentives and the learner can face real local consequences for refusing agreed provision, but those consequences must be attributed to the correct instrument.

#### Policy purpose and current reform status

Since 2014–15, government has justified continued study by the value of Level-2 English/maths for life, further learning and work, and by widespread receiver use of grade 4. The present regime also operates as an equality-of-expectation rule: the system should not abandon lower-attaining learners at 16. Whether one uniform credential route is the best means is a separate empirical and normative question.

The 2025 Post-16 Education and Skills White Paper committed to a one-year Level 1 “preparation for GCSE” route for grade-2-or-below learners, normally followed by GCSE, and to revised progress/accountability measures. A consultation from 10 March to 2 June 2026 proposed GCSE-aligned foundational content and possible modular/banked assessment. At the cutoff, no response had fixed content, grading, modularity, entry rules or first-teach date; the July implementation plan still used consultative language and the current funding guidance said the qualification was in development. It is **announced/under development, not operative**. [White Paper](https://www.gov.uk/government/publications/post-16-education-and-skills-white-paper/post-16-education-and-skills-white-paper); [Level 1 consultation](https://www.gov.uk/government/consultations/16-to-19-level-1-english-and-maths-qualifications); [implementation plan](https://www.gov.uk/government/publications/post-16-pathways-implementation-plan/post-16-pathways-implementation-plan).


## Resits: measurement, outcomes and causal evidence

There is no single valid “resit pass rate.” The most defensible picture triangulates series results, linked end-of-study records and cumulative unique-person attainment.

#### Outcomes table

| Measure | Population, unit and time | Result | Valid interpretation | Invalid inference |
| --- | --- | --- | --- | --- |
| All GCSE results | England centres; summer 2026 results-day snapshot | About 5,720,045 results for about 1,047,750 unique students; 67.0% of results grade 4+; age-16 results 70.7%. Ofqual labels these provisional and rounds counts to the nearest five while calculating percentages from unrounded values. Combined Science is double-counted as results but students once. | Scale/context for the whole summer series. [Ofqual release, scope and Tables 3, 15, 19](https://www.gov.uk/government/publications/qualification-results-in-england-summer-2026/qualification-results-in-england-summer-2026). | A resit outcome or learner pass probability. |
| Centre-type result profile | Same release; all subjects/ages | FE establishments: 351,225 results, 17.6% grade 4+; sixth-form colleges: 30,135, 32.2%; all state-funded: 5,404,835, 66.1%. | Describes the different result mix at self-reported centre types. [Ofqual Table 20](https://www.gov.uk/government/publications/qualification-results-in-england-summer-2026/qualification-results-in-england-summer-2026). | Provider effectiveness: cohort age, subject, prior grade and selection differ profoundly. |
| Age-17 subject results | England, summer 2026, results issued to learners aged 17 | English Language 21.0% and maths 16.4% at grade 4+. | Current, age-specific summer outcome per result. [Ofqual 2026 GCSE trends](https://ofqual.blog.gov.uk/2026/08/20/gcse-level-1-and-2-results-2026-at-a-glance-key-trends-and-context-for-teachers/). | First-resit success, annual cumulative success or a policy effect. |
| Post-16 summer entries | JCQ England, age 17+, summer 2026 entries | English Language 187,558, 19.8% grade 4+; maths 219,135, 15.3%. | Series-specific entry/result profile using a broader age band. [JCQ 2026 results tables](https://www.jcq.org.uk/exam-results/). | Direct comparison with age-17-only Ofqual figures or November without matching entrants. |
| November entries | JCQ England post-16, November 2025 | English 76,601 entries, 37.5% grade 4+; maths 72,321, 23.2%. | Selected early-series entrants' outcomes. [JCQ 2025 tables](https://www.jcq.org.uk/exam-results/?exam_filter_document_type=results-tables&exam_filter_qualification=gcse&exam_filter_result_year=2025). | November “works better”: entrants are often selected for proximity/readiness and can reappear in summer. |
| Approved-qualification entry during 16–18 study | DfE linked end-of-study cohort, 2024/25; learners below grade 4 at KS4 | 81.2% entered approved English and 82.3% maths. Of the whole eligible cohort, English: 38.8% improved points, 27.2% stayed, 15.1% fell; maths: 33.3%, 33.4%, 15.6%; remainders were non-entry. | Learner-linked participation/progress across 16–18 study. [DfE revised 2024/25 release](https://explore-education-statistics.service.gov.uk/find-statistics/a-level-and-other-16-to-18-results/2024-25). | Grade-4 attainment: “points improved” includes different approved qualifications and does not prove skill gain. |
| Both subjects by 19 | DfE YPMAD linked administrative cohort turning 19 in 2024/25 | 73.2% had Level 2 in both; 157,800 (26.8%) did not. Of those lacking one/both at 16, 79.8% still lacked at least one at 19—so 20.2% acquired both. | Unique-person cumulative attainment through GCSE/equivalents. [DfE age-19 release, 23 April 2026](https://explore-education-statistics.service.gov.uk/find-statistics/level-2-and-3-attainment-by-young-people-aged-19/2024-25). | Effect of the funding condition; the cohort and its exposure are not random and pandemic grading affects comparability. |

#### Cumulative subject attainment by prior grade

The table below uses the denominator most relevant to route design: state-funded mainstream Year 11 pupils who **lacked Level 2 in that subject at 16**, grouped by their prior GCSE grade, and then asks who had acquired subject Level 2 through GCSE or Functional Skills by 19 in 2024/25.

| Prior outcome at 16 | English: number / denominator (%) | Maths: number / denominator (%) |
| --- | --- | --- |
| Grade 3 | 29,154 / 79,796 (**36.54%**) | 20,706 / 58,564 (**35.36%**) |
| Grade 2 | 4,540 / 29,293 (**15.50%**) | 3,304 / 43,193 (**7.65%**) |
| Grade 1 | 842 / 11,827 (**7.12%**) | 541 / 28,237 (**1.92%**) |
| U | 748 / 9,341 (**8.01%**) | 524 / 13,241 (**3.96%**) |
| No/unknown GCSE grade | 2,400 / 18,252 (**13.15%**) | 2,179 / 17,741 (**12.28%**) |
| All below Level 2 | 37,684 / 148,509 (**25.37%**) | 27,254 / 160,976 (**16.93%**) |

Source: DfE [underlying age-19 data set](https://explore-education-statistics.service.gov.uk/data-catalogue/data-set/e522a057-8f4a-49f1-b249-3e58aafd64f6), 2024/25. These striking gradients make prior grade useful for planning but not sufficient as a diagnostic. They may reflect knowledge, prior opportunity, selection into routes, attendance, SEND/disadvantage composition and institutional action; they do not prove that sending a grade-3 learner directly to GCSE or a grade-2 learner to Functional Skills caused the observed result.

#### Route-of-attainment figures are not route effects

Among all English grade-3 starters below Level 2, 31.51% acquired Level 2 through GCSE and 5.03% through Functional Skills; from grade 2 the shares were 7.55% and 7.95%. In maths, grade-3 shares were 30.46% GCSE and 4.90% Functional Skills; grade-2 shares 3.74% and 3.91%. These are shares of the original prior-grade group eventually succeeding through each recorded route—not pass rates among route entrants and not treatment effects. Route assignment, on-demand assessment, repeated attempts and candidate profiles differ. [DfE underlying data set](https://explore-education-statistics.service.gov.uk/data-catalogue/data-set/e522a057-8f4a-49f1-b249-3e58aafd64f6).

The same warning applies to DfE's qualification-record outcomes: in the 2024/25 16–18 data, 41.8% of English GCSE records (41,028/98,077) and 28.6% of maths GCSE records (31,282/109,358) achieved the target, compared with 92.4% of English Functional Skills Level 2 records (5,433/5,880) and 83.1% of maths records (3,254/3,915). These are discounted qualification records from differently selected cohorts with different assessment availability—not a randomized comparison and not unique learners to be added across rows. [DfE data definitions and footnotes](https://explore-education-statistics.service.gov.uk/data-catalogue/data-set/c54b4243-cf99-4576-94d8-9f4f3ae860a8).

#### Repeated attempts and non-entry

Historical linked data show why “resitter” is heterogeneous. In a 2014–16 legacy-specification cohort of 538,707 age-17 learners, English had 72,995 unique entrants: 68.2% entered once, 24.82% twice, 5.65% three times and 1.33% four times; maths had 67,759 entrants: 62.84%, 24.51%, 8.60% and 4.05%. About 53% of English and 60% of maths resitters never improved a grade. Repeat count is selected—learners repeat partly because earlier attempts did not succeed—so a negative repeat gradient is not the causal harm of another attempt. The evidence is also legacy and predates current rules. [Vidal Rodeiro, 2018](https://www.cambridgeassessment.org.uk/Images/476535-which-students-benefit-from-retaking-mathematics-and-english-gcses-post-16-.pdf).

An FFT follow-up of the 2022 KS4 cohort found that among unique learners lacking grade 4, only 54% entered any English qualification at Level 2 or below in the next two years (44% GCSE); maths figures were 59% and 50%. By end-2024, 13% had gained English grade 4+ and 11% maths; 15,000 had entered maths at least three times. Non-entry can mean exemption, leaving tracked education, study without entry or other circumstances—it is not automatically provider non-compliance. [FFT Education Datalab, 2025](https://ffteducationdatalab.org.uk/2025/09/how-many-pupils-resit-english-and-maths/).

### Causal interpretation and counterfactuals

#### Evidence ladder

| Claim | Best evidence | Supported conclusion | Confidence boundary |
| --- | --- | --- | --- |
| Receiving/crossing the threshold grade affects progression | Fuzzy regression discontinuity around legacy AQA English C/D. | For marginal 2013 candidates, receiving grade C changed education/NEET trajectories through a bundled response that can include signalling, gatekeeping, resit rules and learner/family behaviour. | Strong local causality; the study does not isolate one mechanism and covers one board, subject, old specification and threshold population. |
| Higher GCSE grades predict later study/work | Linked longitudinal observational models with rich controls. | Robust association and plausible signalling/human-capital pathways. | Residual selection; similar gradients at other boundaries weaken a unique “natural” C/4 claim. |
| England's condition improves attainment/learning | No identified causal policy evaluation. | Descriptive cumulative gains occur, and the policy requires an in-scope provider to plan and fund applicable study. | Delivery, attendance and entry are not guaranteed; the net policy effect versus voluntary study, staged routes or no condition is unknown. |
| Another attempt improves attainment | Historical descriptive/matched studies. | Many improve and many do not; starting grade strongly stratifies outcomes. | Regression to mean, repeat-selection, route and attendance confounding prevent causal inference. |
| Additional teaching improves learning | Strong general educational theory; sparse post-16 resit trials. | Teaching quality/dosage plausibly matter; one high-security text-message nudge found no statistically detectable effect. | Few current English studies and no route-scale causal comparison; the nudge confidence intervals permit modest benefit or harm. |
| Compulsion harms wellbeing | 2026 longitudinal observational working paper plus qualitative mechanisms. | A credible adverse-risk signal requiring monitoring and replication. | Not randomized/RD or peer-reviewed; subject/sex estimates imprecise. |

#### Credential effect is not learning effect

Machin, McNally and Ruiz-Valenzuela studied 2013 AQA Higher-tier English Language candidates around legacy C/D, linking pre-/post-review marks to education records. The AQA C/D population was 49,231; the ±10-mark analytic window 14,597 and ±1 window 1,409. Preferred local specifications estimated that obtaining C reduced absence from observed education at 18 by about 5.2–5.9 percentage points and NEET by about 2.8 points, while raising Level-3 enrolment/completion by about 8.7–8.9 points and Level-4 enrolment by about 3–4 points. Covariates and placebo thresholds were smooth. [Machin, McNally and Ruiz-Valenzuela, 2020](https://openresearch.surrey.ac.uk/view/pdfCoverPage?download=true&filePid=13140378110002346&instCode=44SUR_INST).

The identifying variation is the probability of receiving the credential around a threshold, not randomized extra teaching. The study therefore shows that **receiving the threshold grade changes trajectories** through a bundle that can include institutional treatment, signalling, resit rules and learner/family responses. It does not show that the candidate just above possessed a discontinuously larger stock of literacy, isolate institutional gatekeeping as the sole mechanism, or establish that compulsory repeated GCSE study is the best way to cross the gate. The reported Level-4 estimates are smaller and less statistically secure; the school-fixed-effects estimate is not conventionally significant.

Jerrim's Next Steps/NPD analysis offers national but non-causal corroboration. From a cohort of 15,770 at baseline and 7,707 observed at 26, models with prior tests, demographics, attitudes and other GCSEs associated C rather than D with A-level participation of +7.3 percentage points in maths and +10.1 in English, and degree holding of +6.2 and +5.4; maths C was associated with about £7 higher gross weekly earnings against a mean near £300. Similar gradients at B/C and untestable selection-on-observables led the author to treat estimates as possible upper bounds; wellbeing findings were mostly null. [Jerrim, 2022](https://discovery.ucl.ac.uk/10145867/1/THE%20BENEFITS%20OF%20MEETING%20KEY%20GRADE%20THRESHOLDS%20IN%20HIGH%20STAKES%20EXAMINATIONS%20NEW%20EVIDENCE%20FROM%20ENGLAND.pdf).

#### The missing policy counterfactual

No located study credibly estimates the causal effect of England's funding condition itself on attainment, capability, progression, work or wellbeing. The policy cannot be evaluated by comparing post-16 entrants with 16-year-old first sitters, November with summer, grade-3 with grade-2 starters, or participating with non-participating providers: each comparison changes selection and exposure.

A useful future evaluation must specify alternatives:

| Policy component | Credible comparison needed |
| --- | --- |
| Continued-study entitlement | Offer versus no further provision, while protecting ethical access. |
| Mandatory provider condition | Same high-quality voluntary entitlement with otherwise comparable learners/providers. |
| GCSE route | Functional Skills or staged Level 1 among learners with comparable diagnostics and destinations. |
| 100 planned hours | Different delivered/attended dosage with timetable and teacher quality measured. |
| November entry | Readiness-gated early entry versus later entry among equally ready learners. |
| Credential crossing | Learning-equivalent candidates whose grade classification differs locally, with modern data. |

#### Regression to the mean and selection

Learners are selected for another attempt partly because an earlier score was low. If that score contained adverse day-specific variation, some rise will occur even without added learning (regression to the mean); if the first result was unusually favourable, some fall. Conversely, repeated resitters are increasingly selected for persistent barriers, so later-attempt raw rates can decline even if the attempt helps. Provider decisions about who is ready for November create additional positive selection. These mechanisms make raw before/after and series comparisons descriptively useful but causally ambiguous.


## Resits: teaching, implementation and lived experience

The core implementation problem is a chain, not a course label. A provider can plan a compliant programme that is poorly timed, understaffed or weakly attended; a learner can attend but receive repetition that does not diagnose gaps; a capable learner can be entered too early; useful learning can occur without a boundary crossing.

#### What the evidence base actually contains

The EEF's 2023 post-16 practice review screened 340 records and retained 59: only five were randomized trials, 40 were maths-focused and five English-focused. It rated three studies high security, 14 medium, 40 low, with two ongoing. The review combined a rapid evidence review with interviews involving 20 practitioners/leaders and learner focus groups at four deliberately high-outcome sites. It therefore supports mechanisms and implementation hypotheses more strongly than attainment effect estimates. Recruitment/retention of staff, attendance and timetable placement were dominant constraints. [EEF practice-review page](https://educationendowmentfoundation.org.uk/education-evidence/evidence-reviews/post-16-practice-review) and [full report](https://d2tic4wvo1iusb.cloudfront.net/production/documents/Post-16-GCSE-Resit-Practice-Review.pdf).

#### Mechanisms worth designing for—but not treating as proven packages

| Mechanism | Why it is plausible | Necessary implementation evidence | Current evidential status |
| --- | --- | --- | --- |
| Diagnostic starting point | Same grade can conceal different misconceptions, missed content, language needs and exam-access problems. | Item/domain profile, prior papers, learner explanation, SEND/EAL/access evidence, destination. | Strong logic and practice consensus; weak causal post-16 evidence. |
| Changed rather than repeated teaching | A prior unsuccessful course is evidence to inspect pedagogy/opportunity, not simply replay it. | Curriculum map showing what changes, teacher expertise and feedback/fidelity. | Plausible; few causal tests. |
| Formative assessment and visible progress | Makes sub-boundary learning observable and can guide readiness. | Reliable low-stakes measures tied to intended construct, without excessive testing. | Widely supported beyond resits; transfer uncertain. |
| Spacing, retrieval and mastery | Supports retention and prerequisite closure. | Attendance, sequencing, responsive regrouping and sufficient duration. | Promising maths evidence; contemporary independent resit evidence incomplete. |
| Supportive adult relationships and agency | Prior failure, shame and loss of subject identity can suppress engagement. | Stable staffing, respectful communication, meaningful route choice and belonging. | Recurrent qualitative finding; no population effect estimate. |
| Contextual/vocational examples | May improve relevance and transfer into a destination. | Authentic alignment plus explicit bridging back to the GCSE's decontextualised tasks. | Feasible in parts; trial readiness/impact unestablished. |
| Small-group tutoring | Increases responsive practice and feedback. | Recruitment, attendance dosage, timetable protection and safeguarding/access. | Severe delivery attrition in pilot; large RCT outcome due 2027. |
| Readiness-gated entry | Avoids premature failure while preserving an eventual credential opportunity. | Transparent diagnostics, learner input and guardrails against strategic non-entry. | Operative policy principle; causal impact unknown. |

#### Intervention evidence table

| Study/intervention | Design and population | Finding | What can be concluded |
| --- | --- | --- | --- |
| Project Success text messages | Individual four-arm RCT, 31 FE colleges, 3,779 opted-in learners. | Control grade-4+ 21.7%; learner texts 22.4% (RR 1.03, 95% CI 0.86–1.26); supporter 22.5% (1.04, 0.84–1.27); both 20.0% (0.92, 0.73–1.14). Attendance also had no statistically detectable effect; about 31% outcome missingness. | High-security evidence of **no statistically detectable effect** from this low-cost nudge as delivered. The intervals still permit modest benefit or harm; this is not equivalence and not evidence that communication/relationships never matter. [EEF report](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/texting-students-and-study-supporters). |
| Basic Maths Premium | Randomized payment models but no randomized no-funding control; 824 settings invited, 469 joined, 434 remained; linked analysis about 47,310 learners. | Matched-comparator Level-2 estimate RR 1.008 (0.834–1.214), p=.94; 43% setting withdrawal, delayed/low spending and Covid disruption. | Very-low-security evidence that the weakly implemented payment mechanism showed no detectable gain—not that resources cannot help. [EEF, 2024](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/basic-maths-premium-pilot). |
| 5Rs maths | Planned cluster RCT in 61 settings; practice package around recall, routines, revision, repeated questions and readiness. | Poor recruitment cancelled cohort 2 and the impact evaluation; webinar participation fell from 29/47 teachers to 14/47; attitude gains resembled control. | Feasibility/implementation lessons only; **not a null impact finding**. [EEF, June 2026](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/the-5rs-approach-to-gcse-maths-resits-accelerator-fund). |
| Mastering Mathematics | Earlier developer-led three-arm RCT, 147 colleges/7,453 learners; independent scale-up ongoing. | Earlier programme estimated roughly one month of GCSE progress overall and about two months for FSM learners. Independent 160-setting/8,000-learner report due autumn 2026 was unavailable. | Promising result awaiting independent replication; implementation and developer involvement limit certainty. [EEF trial page](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/mastering-mathematics-23-24-trial). |
| Tutor Trust pilot | Intended 240 learners/20 northern settings; 12–15 hours 1:1 tutoring/coaching; no comparator. | The report says 31% withdrew before tuition and 39 learners completed 12 hours. Its reported 24% completion rate uses the post-withdrawal/tuition-start denominator, not the intended N=240 (for which 39/240 is 16.25%). Of 117 with grades, 26% reached 4+; that rounded percentage is reported without a cell numerator. | Delivery bottleneck, not impact evidence; starters, completers and entrants are selected. [EEF, June 2026](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/targeted-tutoring-programme-for-post-16-gcse-resit-learners). |
| Assess for Success | Six-college pilot, 4,229 learners; diagnostics/progress assessments and CPD. | Teachers preferred diagnostics, but mismatch with GCSE demand created false expectations; online engagement was low; not ready for trial. | Diagnostic design must be valid for its decisions; no attainment effect. [EEF, 2019](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/assess-for-success). |
| Contextualised teaching | Six-setting pilot with four training days. | Practice changed only slightly; impact unassessable; teachers worried about transfer and learners often preferred general-life to narrow vocational contexts. | Context is not automatically relevant or transferable; no causal effect. [EEF, 2019](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/embedding-contextualisation-in-english-and-mathematics-gcse-teaching). |
| Get Further tutoring | Individual RCT, planned 8,100 learners in 41 FE/sixth-form colleges; small groups, weekly, first-year first resitters excluding November 2025 entrants. | Outcome report due autumn 2027. | Well-designed ongoing study; no impact claim by cutoff. [EEF protocol](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/get-furthers-gcse-resit-tuition-programme-trial). |

EPI's 2025 linked-data study (49,451 English and 72,661 maths learners) found prior subject attainment, wider KS4 attainment, attendance and institution effects associated with resit grades. Institution effects were only about 3% of English and 2% of maths variation; provider value-added correlated across two earlier cohorts. Individual November entry was positively associated with results while a provider tendency to enter everyone early was negatively associated—exactly the pattern expected when individual readiness selection and institutional practice are endogenous. The report explicitly is not a policy evaluation. Pearson funding/input is disclosed. [EPI, *English and maths resits: drivers of success*, 2025](https://epi.org.uk/wp-content/uploads/2025/06/English-and-Maths-Resits.pdf).

#### Staffing, capacity and opportunity cost

Official 2024/25 FE workforce statistics estimated 209,500 staff, including 81,800 teachers; 3.5 unfilled vacancies per 100 teaching positions, with maths the main subject for 4.7% of teachers. Vacancy returns covered only 67.7% of providers and were not scaled, and retention is an official statistic in development. These data support a capacity constraint, not an English/maths-specific causal shortage. [DfE FE workforce statistics](https://explore-education-statistics.service.gov.uk/find-statistics/further-education-workforce/2024-25).

One provider illustrates logistical scale, not national cost: City College Norwich reported 1,685 English entries, 598 (36%) needing access arrangements and 162 rooms in summer 2025; maths had 1,480 entries, 451 (30%) and 133 rooms, with most teaching cancelled on five mornings. [Education Committee, paras 108–113 and Table 1](https://publications.parliament.uk/pa/cm5901/cmselect/cmeduc/666/report.html). No credible national marginal-cost or cost-effectiveness estimate for the current system was located. The 100/200 planned-hour arithmetic shows potential opportunity cost; it does not tell us which learning is actually displaced or its value.

### Learner experience, wellbeing and distribution

#### Distribution, not an average learner

The potentially affected population is not a random slice of the cohort. In DfE's linked state-mainstream Year-11 cohort, the following fractions of learners who lacked subject Level 2 at 16 had acquired it through GCSE English Language/mathematics or Functional Skills by 19 in 2024/25:

| Starting group | English numerator / denominator | Mathematics numerator / denominator |
| --- | ---: | ---: |
| Disadvantaged | 12,442 / 67,129 (**18.53%**) | 8,625 / 72,850 (**11.84%**) |
| Not disadvantaged | 25,242 / 81,380 (**31.02%**) | 18,629 / 88,126 (**21.14%**) |
| Identified SEN | 9,585 / 55,885 (**17.15%**) | 6,076 / 57,855 (**10.50%**) |
| No identified SEN | 28,099 / 92,624 (**30.34%**) | 21,178 / 103,121 (**20.54%**) |
| Grade-3 starters: disadvantaged | 9,177 / 30,631 (**29.96%**) | 6,316 / 21,294 (**29.66%**) |
| Grade-3 starters: not disadvantaged | 19,977 / 49,165 (**40.63%**) | 14,390 / 37,270 (**38.61%**) |

These are raw distributions, not adjusted treatment effects or evidence that learner characteristics cause the gaps. “Identified SEN” aggregates statuses and needs. The cohort and outcome are also not identical to funding-condition eligibility: the English measure uses Language/Functional Skills rather than Literature equivalence, and the table does not identify programme hours, EHC exemptions, actual required study, attendance or repeated attempts. [DfE underlying age-19 data](https://explore-education-statistics.service.gov.uk/data-catalogue/data-set/e522a057-8f4a-49f1-b249-3e58aafd64f6).

EPI's multilevel model retained disadvantage associations of about −0.203 grades in English and −0.127 in maths after observed adjustment, but residual confounding, measurement and route selection remain. Its 2021/22 intake had teacher-assessed prior results and excluded movers, apprentices, formal exemptions (usually EHC), missing cases and providers with fewer than ten learners. In the bounded analytic samples (English N=49,451; mathematics N=72,661), adjusted conditional-grade associations differed by sex, broad ethnicity and provider type: male −0.058 English/+0.227 maths; broad Asian +0.248/+0.235 and broad Black +0.218/+0.094 relative to White British; sixth-form-college +0.292/+0.281 relative to FE. Provider-level value-added averaged +0.11/+0.10 in the North West, −0.10 for English in the South West and −0.06 for maths in Yorkshire and the Humber. These are neither causal learner/provider effects nor a warrant to rank groups or regions; broad ethnic categories hide subgroup variation, EAL was not modelled, and ethnicity is not an EAL proxy. They also disconfirm a simple claim that every minoritised group has worse conditional grades. [EPI 2025 report](https://epi.org.uk/wp-content/uploads/2025/06/English-and-Maths-Resits.pdf).

Policy therefore concentrates eligibility, planned-study burden and potential exposure to repeat assessment among groups already facing unequal opportunity, while actual hours, attendance and attempt histories are not measured in these tables. Neither distribution alone answers whether the condition should exist.

#### Wellbeing evidence

Maris, Anders, Campbell and Wyness used the Millennium Cohort Study for young people in Year 12 in 2017/18 (up to 4,776 England respondents; complete-case N=4,358 in the fully controlled model). The paper classified status from self-reported English Language and mathematics grades, not observed provider eligibility or delivery. Weighted regressions controlled demographics, cognition and an age-14 six-item life/school-satisfaction baseline, which is not the same instrument as the age-17 outcome. Classification as subject to any requirement was associated with −0.114 standard deviations on the seven-item Short Warwick–Edinburgh positive-wellbeing scale. Against the restricted comparator of learners with an exact C/4 in at least one subject, the association was −0.176 SD; this is not a local threshold design. English-only was −0.134 (SE 0.076; p<0.10), and all mutually exclusive subject-specific estimates were imprecise at the 5% level. A separate Wales/NI model estimated +0.028; the pooled equality test compared England −0.109 with Wales/NI +0.034 and did not reject equality (p=.17). [CEPEO WP26-08, 18 August 2026](https://econpapers.repec.org/RePEc%3Aucl%3Acepeow%3A26-08).

This is the strongest located quantitative wellbeing study, but it is a non-peer-reviewed working paper with grade-inferred exposure. It does not apply English Literature equivalence, programme-hour or EHC/formal-exemption rules, observe in-scope provider enrolment, continued study, attendance or exam entry, or report the exposed count within the fully controlled complete-case sample. Successful early resitters can also be misclassified. Parent-reported SEND was only about 5.4% of the full sample (3.2% support; 2.2% EHC plan/being assessed), its interactions were imprecise, and grade-only classification makes an EHC “policy effect” especially unsafe. Age-17 numeracy is contemporaneous/post-assignment, while earlier-cognition substitution appears only as robustness analysis. The Short WEMWBS outcome is positive wellbeing, not a clinical mental-health diagnosis; numerous exploratory subgroup/timing analyses have no reported multiplicity correction. The right conclusion is **moderate-confidence adverse association and plausible policy risk**, not proven average causal harm or a 2026-delivery estimate.

#### Learner voice and mechanism evidence

Small qualitative studies repeatedly describe prior failure, anxiety, low confidence, damaged subject identity and perceived irrelevance; they also describe positive change where college treatment feels more adult, teachers are stable and supportive, learners have agency, and progress is visible. Samples rarely support prevalence claims. The EEF fieldwork covered four deliberately high-outcome sites and 23 learners. Anderson and Peart interviewed eight purposively selected 16-year-olds in one unusually successful FE “GCSE Academy”; participants credited adult relationships, autonomy, consistency and smaller classes, but one researcher taught in the programme and the study could not attribute outcomes. [Anderson and Peart, 2016](https://irep.ntu.ac.uk/id/eprint/27955/).

One-college Functional Skills/GCSE research likewise found learners often valued GCSE for “opening doors” and Functional Skills for daily-life relevance, while some experienced the staged route as a longer race back to GCSE. Questionnaire N=187 and linked outcomes N=133, assignment by prior/diagnostic attainment and underrepresentation of absentees mean it cannot estimate comparative effectiveness. [Norris, *Research in Mathematics Education*](https://doi.org/10.1080/14794802.2021.2010239).

#### Benefits, harms and uncertainty

| Domain | Plausible / evidenced benefit | Plausible / evidenced harm | What remains uncertain |
| --- | --- | --- | --- |
| Learning | Protected additional opportunity; well-designed diagnosis/teaching may help close gaps. | Repetition, narrow exam preparation and low attendance can consume time without durable transfer. | Causal learning gain versus alternatives and by starting profile. |
| Credential/progression | Strong local evidence that crossing the threshold opens routes and reduces dropout/NEET for marginal English candidates. | A single gate can misclassify marginal candidates and amplify measurement noise; alternatives may have lower currency. | Modern subject/destination heterogeneity and whether receivers could use richer evidence. |
| Motivation/identity | Success, adult relationships and visible progress can restore efficacy. | Repeated “failure,” compulsion, tier labels and irrelevant content may reinforce stigma/anxiety. | Population prevalence, mediators and which designs prevent harm. |
| Equity | Common expectation can resist abandonment and extend access to teaching. | Eligibility/required study and the risk of unsuccessful attempts concentrate among disadvantaged and SEND learners; money/knowledge/centre cooperation may affect challenges and private entry. | Net distributional effect of mandate versus high-quality voluntary/differentiated opportunity. |
| Vocational study | Literacy/numeracy may improve destination capability and safety. | One or two 100-hour subjects may displace vocational/Level-3 learning and practical experience. | Actual displaced hours/value; no national opportunity-cost estimate. |
| Providers | Common rules create a floor and auditable entitlement. | Staffing, rooms, access arrangements and incentives around entry create operational strain/Goodhart risks. | National marginal cost and the behavioural effect of accountability reform. |

#### SEND, disability, EAL and disrupted education

The response must be individual rather than deficit-based. SEND/dyslexia/anxiety can require changed instruction, reasonable adjustments or route/timing changes, but does not itself prove lower expectations or qualify for the funding exemption. EAL can affect access to language-heavy tasks without implying weak underlying reasoning; English Language GCSE and Functional Skills assess partly different constructs. Disrupted schooling may indicate missing opportunity rather than fixed capacity. The appropriate record combines diagnostic performance, normal way of working, access needs, learner/destination goals and delivery conditions—not a category label alone.

Practical ability to enforce assessment rights also presents an inequality risk. Knowledge of procedures, centre cooperation and money for optional services, advice or private entry may change access to scripts, expert review and another sitting; the national data reviewed do not quantify that mechanism. Where a centre failed to deliver an approved arrangement, shifting immediately to “resit” transfers time, risk and cost of the centre's error to the learner; special consideration and complaint routes should be considered first, without assuming either guarantees the desired grade.

#### Stronger learner-voice triangulation

The broadest located lived-experience study was the Mathematics in Further Education Colleges (MiFEC) project: 62 focus groups involving 388 learners in 29 of 32 general-FE-college case studies, with the 32 cases drawn from 29 providers across all nine English regions. Course was reported for 368 learners—296 GCSE, 56 Functional Skills and 16 Core Maths—and 356 of 384 with known age (**92.71%**) were 16–19. Negative emotions, exam fear and lack of visible progress recurred; learners on second or later unsuccessful attempts were generally less optimistic. Yet most described college maths more positively than school, and small visible gains could rebuild confidence. Most opposed a blanket rule, while some supported it or said they would still opt in for the credential's exchange value. Colleges selected likely engagers and the design claims analytic, not statistical, generalisability; attempt groups were not quantified longitudinally. [MiFEC Interim Report 3](https://www.nottingham.ac.uk/research/groups/crme/documents/mifec/interim-report-3.pdf).

This disconfirms two caricatures at once within the evidence's domain: post-16 maths learners are not uniformly hostile to the subject, and compulsory allocation is not uniformly experienced as a benevolent “second chance.” Norris's one-college survey (N=187) reports that, if offered a choice, 58% selected GCSE, 21% Functional Skills and 9% no maths; category cell counts are not supplied in the cited report, so exact numerators cannot be recovered from the rounded percentages. Its local, cross-sectional and absence-prone sample cannot estimate national preferences. Direct English learner voice is much thinner. These studies largely omit non-attenders, withdrawals/non-entry, school/sixth-form settings, families and identifiable EHC/EAL subgroups; Anderson and Peart's eight-person sample (six eligible for free school meals, one ESOL) cannot support subgroup claims. The evidence identifies experiences and mechanisms, not prevalence. [Norris, 2023](https://doi.org/10.1080/14794802.2021.2010239); [Anderson and Peart, 2016](https://irep.ntu.ac.uk/id/eprint/27955/).

At transition, access arrangements can also fail operationally. JCQ requires a receiving centre to verify current need and normal way of working, but current guidance permits existing Form 8/Form 9 evidence to be reused for a same-qualification GCSE resit. “Everyone must start again” is therefore too broad, while “an old approval transfers automatically without centre action” is also unsafe. [JCQ guidance when a candidate changes centre](https://www.jcq.org.uk/knowledge-hub/access-arrangements-when-a-candidate-changes-centre/). Ofqual's national access-arrangement counts combine GCSE/AS/A level, ages and approvals rather than actual use and are not linked to outcomes, so they cannot estimate resitter access loss or benefit. [Ofqual 2024/25 access-arrangements statistics](https://www.gov.uk/government/statistics/access-arrangements-for-gcse-as-and-a-level-2024-to-2025-academic-year/access-arrangements-for-gcse-as-and-a-level-2024-to-2025-academic-year).

These accounts of experience and educational context do not authorise automated inference of emotion, personality, SEND or potential. The tuition service should make declared access needs, actual task evidence and human interpretation distinct, using the operational limits in [document 06](06-state-rights-and-context.md). The generic functional-access and support contract is in [document 05](05-inclusion-and-human-service.md); this dossier owns the resit-specific transition, procedural and delivery evidence.


## Resits: credential recognition and destination value

#### Three meanings of “equivalent”

| Question | What equivalence means | Why it matters |
| --- | --- | --- |
| Regulated level | Qualifications are placed at the same RQF level of demand. | Functional Skills Level 2 and GCSE 4–9 are both Level 2. This does not make their content identical. |
| Substantive construct | They assess comparable knowledge, breadth, application and performance conditions. | GCSE and Functional Skills overlap but weight academic breadth, contextual application and components differently. |
| Receiver recognition | A named course, employer, apprenticeship or profession accepts the award for a purpose. | A formally Level-2 alternative can satisfy one route and be rejected by another. |

Functional Skills are not a diluted copy of GCSE. Ofqual's rules define demanding, workplace-relevant qualifications supporting employment and further study. English has reading, writing, and speaking/listening/communicating components that must all be passed. Mathematics places about 75% of marks on problem solving and 25% on underpinning skills, with 25% non-calculator. Both are pass/fail and designed around 55 guided-learning hours; the England funding condition can nevertheless require more planned provision. [Ofqual Functional Skills English conditions](https://www.gov.uk/government/publications/functional-skills-english-conditions-and-requirements/functional-skills-english-conditions-and-requirements); [mathematics conditions](https://www.gov.uk/government/publications/functional-skills-mathematics-conditions-and-requirements/functional-skills-mathematics-conditions-and-requirements).

Ofqual's 2024 validity review found reformed maths demand broadly appropriate through comparative judgment/expert review, while providers perceived greater difficulty and Ofqual identified unnecessary contextual reading load in some items. Eight of nine awarding organisations offered on-demand paper, onscreen and remote modes. Only 13% of Level-2 English and 11% of maths certificates issued July 2022–June 2023 went to 16–18-year-olds; all-age Functional Skills results are therefore a poor proxy for the GCSE-resit cohort. [Ofqual Functional Skills review, 2024](https://www.gov.uk/government/publications/a-review-of-the-assessment-of-reformed-functional-skills-qualifications-in-english-and-maths/a-review-of-the-assessment-of-reformed-functional-skills-qualifications-in-english-and-maths).

#### Recognition is purpose-specific

| Receiver/use | Current example | What it establishes—and does not |
| --- | --- | --- |
| England condition of funding | Functional Skills Level 2 is permitted for grade-2-or-below learners; full-time grade-3 learners must study GCSE. | National funding recognition varies by prior grade/programme; it is not universal receiver equivalence. |
| Apprenticeships | For Level-2 apprenticeships, listed GCSE grade 1+ or Functional Skills Level 1 can meet the relevant standard; Level 3–7 routes require GCSE grade 4+ or Functional Skills Level 2/listed equivalents. For an apprentice aged 16–18 at the start who lacks the listed equivalent, the applicable English/maths completion requirement is mandatory. A 19+ starter may instead receive funded English/maths only where the employer agrees it belongs in the training plan; they are not subject to that same completion requirement. [DfE apprenticeship English table](https://www.gov.uk/government/publications/english-and-maths-requirements-in-apprenticeship-standards-at-level-2-and-above/english-qualifications-for-apprenticeships); [maths table](https://www.gov.uk/government/publications/english-and-maths-requirements-in-apprenticeship-standards-at-level-2-and-above/maths-qualifications-for-apprenticeships). | A national regulated route accepts alternatives at specified levels, but age at start changes the requirement; an employer can still have additional recruitment criteria subject to law. |
| Initial teacher training | DfE's 2026–27 criteria require grade-4-equivalent English/maths. Providers may use equivalence tests/other evidence, but DfE says Functional Skills Level 2 is not GCSE-equivalent in breadth and needs additional evidence. [ITT criteria, updated 1 September 2026](https://www.gov.uk/government/publications/initial-teacher-training-criteria/initial-teacher-training-criteria-and-supporting-advice-2026-to-2027). | Shared level alone is insufficient for this regulated destination. |
| Higher education: bounded examples | King's accepts Level-2 Functional Skills for certain Nursing/Midwifery grade-4 requirements but not where grade 5/6/7 is specified; Medicine requires grade 6/B and rejects Functional Skills. Middlesex normally accepts Level 2 except for teaching. [King's general requirements](https://www.kcl.ac.uk/study/undergraduate/how-to-apply/entry-requirements); [King's Medicine](https://www.kcl.ac.uk/study/undergraduate/courses/medicine-mbbs/entry-requirements); [Middlesex requirements](https://www.mdx.ac.uk/study/undergraduate/entry-requirements-for-undergraduates/). | Practices vary by institution/course. These examples demonstrate non-universality, not sector prevalence. |
| Local post-16 course | A sixth form may require six grade-4 GCSEs or Combined Science 6–6 for a science combination. | A local selection/progression rule, not a national definition of “pass.” Its predictive validity must be tested locally. |

A destination-aware decision should obtain written current confirmation rather than rely on “equivalent to GCSE” shorthand. That is especially important when aspirations are uncertain: an immediately attainable alternative may deliver useful capability yet narrow future options. Conversely, insisting on GCSE solely for hypothetical future portability can impose substantial opportunity cost where a learner's destination accepts and values Functional Skills.

#### Human capital, signalling and credentialism

Three mechanisms may operate together:

- **Human capital:** further study genuinely develops literacy, numeracy, reasoning and transferable habits.
- **Signalling/screening:** the grade provides a low-cost, standardized signal to receivers who cannot inspect each learner's full capability.
- **Credential gatekeeping:** institutional rules mechanically condition access on the certificate/grade, creating a return even if adjacent candidates have similar capability.

The English threshold regression-discontinuity result strongly supports the third mechanism for marginal candidates and is compatible with the second; it cannot isolate learning because the grade variation occurs at assessment. The pedagogical literature supports plausible human-capital routes but has far weaker causal effect evidence. “The credential matters” therefore does not prove either “the exam measures nothing” or “more compulsory exam attempts are the optimal intervention.”

Local thresholds can combine readiness prediction and manageable screening. A 6–6 science rule may reflect course-specific prerequisite evidence, scarce places, inherited convention or administrative convenience. Distinguishing these requires the provider's validation: subsequent performance by prior grade and subject/component profile, incremental predictive value beyond other GCSEs, differential effects, and whether conditional support performs as well as exclusion. No national evidence validates every local threshold.


## Four resit cases and their conditional branches

The cases are analytical, not individual advice. Every conclusion is current to the cutoff and changes if the named missing facts change.

#### Comparative case table

| Case | Primary problem | Governing layer | Immediate decision | Success beyond a headline grade |
| --- | --- | --- | --- | --- |
| 1. English Language 3 | In-scope continued study plus credential recovery. | DfE funding condition; AQA 8700 as representative mechanics; college terms. | Plan GCSE and sufficient teaching; enter when ready, not automatically in November. | Domain/mark gain, functional literacy, attendance/engagement, eventual Level 2 and destination access. |
| 2. Maths 2 | Choose a route that builds capability without becoming a dead end. | DfE route discretion; GCSE/Functional Skills constructs; destination rules. | GCSE or FS Level 2; Level 1 first only with documented diagnosis/progression. | Ratio/algebra/problem-solving transfer, confidence, Level 2, portability and vocational progress. |
| 3. Geography 3 after omitted time | Possible invalid administration, not simply low attainment. | JCQ special consideration/post-results; AQA 8035; centre/equality processes. | Establish whether special consideration was submitted; keep marking and conduct routes separate. | Fair remedy, valid current attainment evidence, protected admission pending process. |
| 4. Combined Science 5–4 | Voluntary improvement to meet a local higher gate. | AQA 8464 aggregation/tiering; private-centre practical/fees; local admission. | Six Higher papers for 8464, or explore a new separate Chemistry award only if destination accepts it. | Scientific knowledge/readiness, feasible access, proportional cost/risk and actual admission value. |

#### Case 1 — English Language grade 3 and conditional full-time college entry

**Known facts:** England; age 16; college describes the programme as full-time; English Language grade 3; no English Literature grade 4 or accepted Level-2 English assumed; agreement anticipates further teaching and a “resit.”

**Missing facts that must be obtained:** date of birth; actual annual funded planned hours and programme duration; awarding board; full prior English record/equivalents; diagnostic reading/writing profile and raw/component marks; Spoken Language endorsement; EHC/SEND/access needs; college enrolment/attendance terms; readiness for November.

##### Applicable decision record

1. **Achievement:** grade 3 is a certificated Level-1 GCSE outcome. It is below DfE's grade-4 Level-2/standard-pass and funding threshold, but does not prove functional illiteracy or no English achievement. [Qualification levels](https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels).
2. **Coverage:** if the learner's funded programme really has at least 580 planned hours, they are full-time for this age. Under the principal assumptions, the provider must plan GCSE English Language and ordinarily at least 100 hours. Functional Skills cannot replace GCSE for this full-time grade-3 branch. [DfE condition, §§2–4 and Tables 1–3](https://www.gov.uk/government/publications/16-to-19-funding-maths-and-english-condition-of-funding/2026-to-2027-academic-year-16-to-19-funding-maths-and-english-condition-of-funding).
3. **Who owes what:** the college carries the funding duty to plan/deliver/record the provision. Participation law requires qualifying education/training, not this result or every exam. The learner may additionally agree to attend under enrolment terms; consequences require the actual agreement/policy and lawful process.
4. **Teaching:** a timetable entry is not remediation. The plan should use original scripts/diagnostics, distinguish comprehension, evaluation, comparison, writing organization/accuracy and access barriers, specify what pedagogy changes, and monitor low-stakes domain progress. Whole-class face-to-face provision is the compliance core; extra small-group, online or embedded support can add value.
5. **Exam timing:** DfE does not require November. The provider decides readiness from progress, attendance and engagement. A high grade 3 narrowly below 4 may justify early entry after focused teaching; a low grade 3 with broad gaps may justify summer. The grade label alone cannot make that decision.
6. **Representative mechanics:** on AQA 8700, both untiered 50% written papers must be taken in one series. November is available only if the learner was at least 16 on the preceding 31 August. The separately reported Spoken Language endorsement contributes 0% to the written grade and can normally carry forward, including from another awarding organisation. [AQA 8700 scheme](https://www.aqa.org.uk/subjects/english/gcse/english-8700/specification/scheme-of-assessment); [administration](https://www.aqa.org.uk/subjects/english/gcse/english-8700/specification/general-administration); [AQA non-exam-assessment carry-forward guidance](https://www.aqa.org.uk/student-and-parent-support/private-candidates/non-exam-assessment).

##### If events differ

| Event/variant | Consequence |
| --- | --- |
| Learner is occasionally absent after a genuine start | Returns use planned rather than attended hours, but attendance evidence helps show that provision was real. Participation and college attendance/disciplinary consequences are separate and fact-specific. Absence does not create an automatic GCSE penalty or grade. |
| Learner refuses from inception or withdraws early | A timetable entry alone is not compliance. The provider must evidence that the learner was undertaking the aim, and the qualification counts only after its qualifying period: six weeks where planned length is at least 24 weeks, otherwise two. Earlier withdrawal requires the record/hours to be corrected under the funding rules. [DfE condition, §5](https://www.gov.uk/government/publications/16-to-19-funding-maths-and-english-condition-of-funding/2026-to-2027-academic-year-16-to-19-funding-maths-and-english-condition-of-funding). |
| Provider does not enter November | Permitted if not ready, provided appropriate study continues. Non-entry should have a recorded educational rationale, not be strategic exclusion from results. |
| Another grade 3 or lower | If still in scope next year, the condition continues. The result does not erase real mark/domain learning, which should be reported. |
| Grade 4+ | English condition met for future in-scope study; a receiver may still impose a higher/specific threshold. |
| Existing English Literature 4+ / accepted equivalent | English condition already met despite Language 3. The college can offer voluntary Language improvement but cannot describe it as nationally required by this condition. |
| Programme is part-time | A grade-3 learner may study any approved relevant qualification rather than necessarily GCSE; band hours change. |
| EHC plan | No automatic exemption. Individual inability to study any approved level plus authorised evidence is required; otherwise route/delivery flexibilities apply. |
| Apprenticeship / provider outside England | England's 16–19 condition does not apply as described; use the separate apprenticeship or jurisdictional rules. |

**Best interpretation:** initially all three resit functions align—remedial teaching, later reassessment and credential recovery—while the provider's compliance motive is a fourth institutional function. If the course becomes mere repetition or premature entry, those functions diverge. A defensible success dashboard includes attended teaching, domain gain, writing/reading transfer, wellbeing, grade/mark change and access to the intended destination.

#### Case 2 — Mathematics grade 2 on a vocational programme

**Known facts:** England; Foundation-tier maths grade 2; described full-time FE engineering/construction programme, not apprenticeship; practical calculation strengths but ratio, algebra and multi-step problem gaps; proposed Functional Skills Level 1 then Level 2; no EHC exemption initially.

**Missing facts:** actual funded hours; full item/domain diagnostic; prior opportunity/attendance; learner goals; precise future course/apprenticeship/employer requirements; dyscalculia/SEND/EAL/anxiety/access needs; proposed course approval, duration and progression checkpoints; whether direct FS Level 2 or GCSE is realistically accessible.

##### Applicable decision record

1. **Meaning of grade 2:** a Level-1 GCSE maths outcome, derived from aggregate performance across the Foundation curriculum. It does not show which content is secure, whether workshop application transfers to written problems, or readiness for a different Level-1/2 construct.
2. **National route:** grade 2 or below permits either GCSE or Functional Skills Level 2. Approved Level 1/entry provision is allowed when an individual assessment shows the learner is not ready for Level 2 and the provider records why this is best and how it progresses them. The staged route is therefore **permitted, not required**. [DfE condition, §§2.2, 2.9 and 4](https://www.gov.uk/government/publications/16-to-19-funding-maths-and-english-condition-of-funding/2026-to-2027-academic-year-16-to-19-funding-maths-and-english-condition-of-funding).
3. **Level-1 rationale:** because grade 2 already records Level-1 attainment, “start at Level 1” is not self-justifying. A defensible record would map missing prerequisites to FS Level-2 demand, explain why direct Level 2/GCSE would be premature, define an accelerated review point and prevent the route becoming an indefinite holding pattern.
4. **Construct fit:** Functional Skills emphasizes work, study, daily-life application and multi-step contextual problem solving. GCSE samples a broader school-mathematics curriculum and has different signalling currency. Practical workshop fluency may predict relevance but not automatic FS success; word/reading load can itself become a barrier. [DfE Functional Skills maths content](https://www.gov.uk/government/publications/functional-skills-subject-content-mathematics/subject-content-functional-skills-maths).
5. **Delivery:** for Band 5 the ordinary 100-hour stand-alone, whole-class, face-to-face minimum still applies. Contextualised workshop mathematics can reinforce transfer but cannot simply replace the funded learning aim. Pilot evidence found limited implementation and concern about bridging back to decontextualised GCSE tasks; it does not show contextualisation is ineffective. [EEF contextualisation pilot](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/embedding-contextualisation-in-english-and-mathematics-gcse-teaching).
6. **GCSE tier:** AQA 8300 requires three papers at one tier in a series. Foundation awards 1–5, so Higher is unnecessary for the grade-4 policy objective. Higher offers 4–9 with a narrow grade-3 safety outcome and then U; it should be chosen only if the learner needs/has evidence for higher content, not as a status signal. [AQA 8300 specification](https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/specification/specification-at-a-glance).
7. **Timing:** an early exam can create feedback/motivation for a ready learner or repeat public failure for an unready one. No located causal study settles this for grade-2 starters; transparent diagnostics and learner input should govern.
8. **Destination:** for a Level-2 apprenticeship, specified Level-1 GCSE/Functional Skills evidence can meet the national minimum; Level 3–7 generally requires Functional Skills Level 2 or GCSE 4+/listed alternative. The national completion requirement applies to a 16–18 starter lacking the equivalent; for a 19+ starter, English/maths may be funded where the employer agrees it belongs in the training plan rather than being subject to that same completion rule. Other employers/courses can differ. Written receiver confirmation is essential. [DfE apprenticeship maths qualifications](https://www.gov.uk/government/publications/english-and-maths-requirements-in-apprenticeship-standards-at-level-2-and-above/maths-qualifications-for-apprenticeships).

##### Comparing realistic routes

| Route | When it may fit | Main risk | Evidence needed to choose |
| --- | --- | --- | --- |
| Direct GCSE Foundation | Diagnostics show prerequisites and destination values GCSE; sufficient changed teaching available. | Repeat of unsuccessful pedagogy, delayed gate crossing, exam anxiety. | Item/domain profile, teaching plan, readiness milestones, destination. |
| Direct Functional Skills Level 2 | Applied construct fits and learner is Level-2 ready; destination accepts it. | Hidden reading/context demand; later receiver rejects it. | FS diagnostic and written recognition. |
| FS Level 1 → Level 2 | Specific prerequisite gaps make direct Level 2 unrealistic and staged success is time-bounded. | Duplicates existing Level-1 status or becomes a low-expectation track. | Documented not-ready finding, acceleration/review point, Level-2 timetable. |
| GCSE teaching with delayed entry | Learner needs the portable GCSE but not immediate examination. | Provider/learner loses momentum; non-entry can be gamed. | Attended teaching, progress measures and explicit entry criterion. |
| Vocationally contextualised support plus approved route | Context improves relevance while stand-alone qualification preserves compliance/portability. | Weak transfer between contexts; timetable load. | Tasks measuring workshop and formal transfer. |

SEND, dyscalculia, anxiety, EAL or disrupted schooling should trigger appropriate diagnostic/access/teaching changes, not an inference of low potential. An EHC plan changes delivery possibilities and creates only a narrow evidence-based exemption. Success should separately report exam execution, durable capability (including transfer into the workshop), a recognized credential, vocational progress, attendance and wellbeing. No credible randomized comparison of these routes for grade-2 learners was found.

#### Case 3 — Geography grade 3 after approved extra time was omitted

**Known facts:** England; summer 2026; dyslexia; 25% extra time formally approved for that series and established as the learner's normal way of working; an invigilation error stopped one Geography examination at ordinary time; the learner reported it that day and the centre recorded an incident; grade 3 was issued, one mark below grade 4; a six-at-grade-4 sixth-form condition is affected. AQA Geography 8035 is used as the representative disclosed specification.

**Missing facts:** which paper and how much time was lost; copies of the approval and centre incident record; whether the centre applied for special consideration and when; AQA's decision; component/raw marks, boundary table and script; any independent marking concern; fuller disability/reasonable-adjustment facts; the sixth form's exact discretion; whether a live deadline has been protected.

An **access arrangement** is the JCQ operational mechanism for an evidenced access need. Some arrangements are centre-delegated; others require online or awarding-organisation approval, and a need can exist without meeting the Equality Act disability definition. A **reasonable adjustment** is the statutory duty to take reasonable steps where a disabled person would otherwise face substantial disadvantage. An access arrangement may implement that duty, but approval of an arrangement does not by itself decide disability, disadvantage, reasonableness or legal liability. [JCQ access-arrangements framework](https://www.jcq.org.uk/exams-office/access-arrangements-and-reasonable-adjustments/); [Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents).

##### Diagnose the defect before choosing the remedy

| Possible defect | Correct first mechanism | Why another mechanism is insufficient |
| --- | --- | --- |
| Approved extra time was not provided | Centre application for **special consideration**, supported by the approval and incident evidence. | A review of marking checks whether the script was marked correctly; it cannot restore lost working time. |
| Marking or totaling appears wrong | Script review, then clerical check or review of marking with written candidate consent. | Special consideration does not re-mark responses already written. |
| Awarding-body procedure was applied wrongly | Appeal after the relevant post-results decision, normally through the centre. | An appeal is not a fresh marking service or an automatic second assessment. |
| Centre failed to arrange an adjustment or handle the incident | Centre complaint and, where warranted, separate malpractice/equality processes. | These may address responsibility and future practice, but do not themselves prescribe a grade. |
| Performance is now genuinely stronger or no timely remedy changes the result | Further teaching and re-entry for the whole qualification. | A resit gathers a later performance sample; it does not correct whether the 2026 administration was valid. |

JCQ's summer-2026 special-consideration guide makes failure to provide a previously approved access arrangement eligible in principle. Its published tariff is normally **3% of the maximum raw marks available on the affected component**, not three percentage points on the qualification or an automatic grade uplift. The centre, not the candidate acting alone, applies; the awarding organisation decides. An application after results is reserved for the most exceptional circumstances, requires compelling senior-leader evidence and must precede the review-of-results deadline. Eligibility does not guarantee that the tariff changes the overall grade. [JCQ special-consideration guide](https://www.jcq.org.uk/knowledge-hub/a-guide-to-the-special-consideration-process-2/).

For AQA 8035, Geography is linear: Paper 1 and Paper 2 are each 88 marks/35%, Paper 3 is 76 marks/30%, and all three summer papers contribute to a single 252-mark result. The exact paper therefore changes the numerical ceiling on special consideration. A future resit requires all three papers in one series; marks from the unaffected 2026 papers do not carry forward. [AQA 8035 scheme of assessment](https://www.aqa.org.uk/subjects/geography/gcse/geography-8035/specification/scheme-of-assessment); [general administration](https://www.aqa.org.uk/subjects/geography/gcse/geography-8035/specification/general-administration).

##### Decision at the cutoff

1. **Ask the original centre for a written audit trail now:** access-arrangement approval, seating/invigilation record, affected component, special-consideration application and outcome, raw/component marks, grade boundary and relevant script. Preserve the date on which the learner/centre became aware.
2. **Do not call the issue a “re-mark.”** If special consideration was not submitted, the centre should determine immediately whether an exceptional late application remains possible. If it was submitted, obtain the awarding-body decision and check the stated basis.
3. **Run independent tracks where evidence supports them.** A script review may reveal a marking error even though it cannot remedy missing time. A complaint may examine the centre's failure even if AQA correctly applies JCQ's tariff. Written consent is required for a review because the mark and grade may rise, remain or fall; a lower outcome is not reversible merely because it is unwelcome. [Ofqual 2026 student guide](https://www.gov.uk/government/publications/ofqual-student-guide-to-exams-and-assessments-in-2026/what-to-do-if-you-think-there-is-a-mistake-in-your-results); [AQA review of marking](https://www.aqa.org.uk/exams-administration/after-results/post-results/review-and-priority-review-of-mark).
4. **Treat admission as a separate decision.** Give the sixth form documentary evidence and request a protected or conditional place while the formal process runs. It may exercise local discretion, consider other attainment or set another condition; neither JCQ nor AQA can compel a particular admission outcome.
5. **Use the live timetable accurately.** At 4 September 2026, AQA's ordinary Service 1 clerical-check and Service 2 review deadline for summer GCSEs is 24 September; its GCSE service does not offer the priority review available for some qualifications. A free priority script copy had a 3 September deadline and had therefore closed. A standard script copy remains free until 30 October but can take up to six weeks, so it is not a safe prerequisite for protecting the 24 September review deadline. Published targets are 10 calendar days for a clerical check and 20 for a review of marking. [AQA clerical check](https://www.aqa.org.uk/exams-administration/after-results/post-results/clerical-check); [AQA review service](https://www.aqa.org.uk/exams-administration/after-results/post-results/review-and-priority-review-of-mark); [AQA post-results deadlines](https://www.aqa.org.uk/exams-administration/after-results/post-results). Dates and service availability must be rechecked at the moment of action.

AQA's listed 2026 fees are £9.70 per component for Service 1 and £44.85 for Service 2. For a linear qualification, linked-component Service-2 fees are all waived when the overall grade changes only where those components were requested together or linked reviews remain in progress; an earlier completed component can remain chargeable. Fees can influence access in practice, but the centre's own charging and centre-initiated-review policy must be obtained. Review of moderation is inapplicable to AQA 8035 because the qualification has no centre-assessed component. No separate candidate-facing AQA/JCQ fee for a special-consideration application was identified; that bounded negative finding does not rule out a centre's local administration policy.

An awarding-body appeal follows the relevant decision rather than substituting for it. AQA lists £133.20 for a Stage-1 preliminary appeal and £228.20 for a Stage-2 hearing, waived if the appeal is upheld; a private candidate must prepay. The June-2026 JCQ guide requires an appeal from a clerical/marking/moderation outcome within 30 calendar days of the review outcome; appeals concerning access arrangements, reasonable adjustments or special consideration normally start within 14 calendar days of the original decision. The 42 days is the awarding organisation's target to complete a preliminary appeal, not the submission window. After the final awarding-body appeal, Ofqual's Exam Procedures Review Service ordinarily requires an application within 15 working days and examines procedure rather than re-marking the work. [AQA post-results services](https://www.aqa.org.uk/exams-administration/after-results); [JCQ appeals guide effective June 2026](https://www.jcq.org.uk/knowledge-hub/a-guide-to-the-awarding-bodies-appeals-processes-effective-from-june-2026/); [Ofqual EPRS](https://www.gov.uk/guidance/exam-procedures-review-service).

The operational routes for this representative case are therefore:

| Route | Who initiates / evidence | Live timing at 4 September 2026 | Payment | Possible result |
| --- | --- | --- | --- | --- |
| Priority / standard script copy | Original centre for a centre candidate; identify component/candidate. | Free priority copy closed 3 September; free standard copy to 30 October, but up to six weeks. | AQA lists the copy as free. | Information only; no mark or grade change. |
| Service 1 clerical re-check | Centre with written candidate consent; point to possible totaling/transfer/recording issue. | 24 September. | £9.70 per component; obtain centre charging policy. | Mark/grade can rise, stay or fall. |
| Service 2 review of marking | Centre with written consent; script/reasoned concern is useful but the service applies the defined error test. | 24 September; no AQA priority GCSE review. | £44.85 per component, subject to the linked-component waiver rule above. | Mark/grade can rise, stay or fall; a downgrade is not revocable merely because it is unwelcome. |
| Review of moderation | Centre, for an alleged cohort moderation error. | Not applicable here. | Not applicable. | AQA 8035 has no centre-assessed component to moderate. |
| Special consideration | Centre supplies approval, incident and affected-component evidence; the AO decides. | Normally contemporaneous; only an exceptional evidenced late application before the review deadline may be considered. | No separate candidate-facing AQA/JCQ application fee was identified; confirm centre policy. | A percentage allowance may leave the overall grade unchanged or raise it; it cannot reconstruct the lost performance. |
| Awarding-body appeal | Normally head of centre after the underlying decision; private-candidate route where applicable. | 30 calendar days after a review outcome; normally 14 calendar days after an access/reasonable-adjustment/special-consideration decision. | AQA £133.20 Stage 1 / £228.20 Stage 2; waived if upheld; private candidate prepays. | Decision may be upheld or reconsidered, with consequential result change possible; it is not a free-standing re-mark. |
| Ofqual EPRS | Centre candidate normally asks the centre; a private candidate may apply directly, after final AO appeal. | Ordinarily within 15 working days of the final appeal decision. | No Ofqual application fee was identified. | Procedural finding/recommendation; Ofqual does not re-mark or itself choose the grade. |
| Centre complaint / malpractice or maladministration referral | Learner/family uses the centre policy; centre/AO/referrer supplies incident and governance evidence as the applicable route requires. | Centre/AO rules control; start immediately and do not let this displace live AO deadlines. | Internal complaint ordinarily has no fee; advice/representation may cost. | Explanation, accountability and process/system remedy; no automatic grade instruction. |
| Equality / reasonable-adjustment route | Learner/family under the applicable complaint or legal forum, based on disability, substantial disadvantage, reasonableness and causation facts. | Forum-specific limitation and pre-action rules require specialist checking. | Internal complaint may be free; advice or litigation may cost. | Potential equality remedy, not a guaranteed qualification grade; this report does not determine liability. |
| Summer 2027 re-entry | Learner through a willing centre, with all three papers and a fresh access plan. | AQA normal entry timetable controls; summer only. | School/college or candidate according to centre status and contract; private centres may add administration/invigilation fees. | New aggregate grade can rise, stay or fall; it establishes later attainment rather than repairing the first sitting. |

##### Variants and limits

| Variant | What changes |
| --- | --- |
| The arrangement was not actually approved | Missing ordinary exam time is not established. Consider whether temporary illness, bereavement or another eligible event existed; ordinary anxiety, a late diagnosis or a never-approved arrangement does not automatically qualify. |
| It affected only one paper | Any tariff applies to that component's available raw marks; the other papers remain as marked. |
| The centre applied and AQA applied the published procedure | An adverse result alone is not grounds for appeal. Identify a procedural or marking error; otherwise the realistic routes are local admissions discretion and later resit. |
| There is evidence the script was mis-marked as well | Seek the appropriate review independently; consent to downgrade risk remains necessary. |
| The omission may be disability discrimination | Obtain specialist advice if needed; Equality Act duties and a centre complaint are distinct from the awarding body's grade procedure. This report does not determine legal liability. [Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents). |
| A later resit is chosen | It is a summer-only, all-three-paper AQA 8035 entry. The plan should address actual learning and access delivery, not merely repeat the assessment. |

A later certificate is new evidence of attainment at that later sitting; it does not retrospectively make the administration of the 2026 sitting fair. The original and later results must be described as distinct attempts under the destination's disclosure requirements rather than assuming that one automatically erases the other.

**Best interpretation:** this is initially an assessment-administration-validity case, not evidence that the learner needs a year of remedial Geography. Special consideration offers a standardized, limited adjustment rather than reconstruction of the counterfactual score. A fair outcome includes a prompt, reasoned remedy and protected progression decision, not only whether grade 4 eventually appears.

#### Case 4 — AQA Combined Science 5–4 and a local 6–6 science threshold

**Known facts:** England; AQA GCSE Combined Science: Trilogy 8464; Foundation tier; awarded 5–4; a sixth form reportedly asks for 6–6 for the intended science combination; the learner has begun another programme; the former school will not enter former pupils; a private centre has quoted separate entry, administration, invigilation and access-arrangement charges; the learner wants to retake only “Chemistry.”

**Missing facts:** the sixth form's exact published and discretionary threshold; whether it accepts a standalone Chemistry GCSE and at what grade; all six paper marks/subject-domain profile; Higher-tier readiness across biology, chemistry and physics; practical-activity records; availability of a willing AQA centre; access arrangements; itemised centre charges; destination value if admission is unavailable for another reason.

##### What the current award and proposed routes mean

AQA 8464 is **one regulated double-award qualification**, with one entry and one aggregate paired grade on a 17-point scale from 9–9 to 1–1. It is designed and counted at double-GCSE size where the receiving system counts it that way, but it is not two independently attributable science qualifications: a 5–4 is not “grade 5 in one science and grade 4 in another,” and it is not three separate GCSEs. Six papers—two each in biology, chemistry and physics—are each 70 marks and roughly one sixth of the aggregate result. The award is already at the Level-2/grade-4 threshold; the issue is improvement against a local, higher entry gate. [AQA 8464 scheme of assessment](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/scheme-of-assessment).

Foundation tier can award 1–1 to 5–5. To target 6–6, the learner must enter **Higher tier for the whole Combined Science qualification** and sit all six papers in the same summer series. Higher normally awards 4–4 to 9–9, with an allowed 4–3 outcome just below the 4–4 boundary and then U; this creates real downside risk for a learner not secure across the full Higher construct. No individual 2026 paper mark carries forward. [AQA 8464 scheme](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/scheme-of-assessment); [general administration](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/general-administration).

Taking AQA Chemistry 8462 would instead create a **new, separate GCSE**, available only in the summer series and assessed by two papers plus a centre requirement covering eight required practical activities. Higher tier is needed for grade 6. It cannot selectively replace the chemistry contribution inside the earlier 8464 result, change the 5–4 certificate or be assumed to satisfy a sixth form that stated “Combined Science 6–6.” Written confirmation from the receiving sixth form is therefore a precondition to spending money or redesigning study. [AQA Chemistry 8462 specification](https://www.aqa.org.uk/subjects/chemistry/gcse/chemistry-8462/specification); [practical assessment](https://www.aqa.org.uk/subjects/chemistry/gcse/chemistry-8462/specification/practical-assessment).

##### Proportionate decision sequence

1. **Verify the gate and discretion in writing.** Ask whether 6–6 is an absolute prerequisite, a normal offer profile, or one factor; whether 5–4 plus other evidence/bridging work permits conditional admission; and whether standalone Chemistry 6 would satisfy the actual course combination. A local threshold is not a national definition of science competence.
2. **Diagnose across all six papers.** A Combined Science Higher retake is proportionate only if the learner is realistically near the required aggregate and can handle Higher content across all three sciences. Strong chemistry alone may favour a new Chemistry GCSE—but only if the receiver accepts it.
3. **Compare full alternatives:** current 5–4 plus conditional support; another provider/course; all-six-paper Higher 8464; or new 8462 Chemistry. Include admission probability, study time displaced, grade downside, access needs, practical feasibility and total price.
4. **Confirm centre and practical arrangements before entry.** A private candidate needs a willing AQA-approved centre. Trilogy requires the centre to make provision for 21 required practical activities; the public AQA pages reviewed do not resolve whether a different private centre may rely on documented practical work completed for the original attempt. Obtain written AQA and centre confirmation rather than assume either reuse or full repetition. [AQA practical assessment](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/practical-assessment); [AQA private candidates](https://www.aqa.org.uk/student-and-parent-support/private-candidates).
5. **Cost the actual package.** For summer 2027 AQA lists a UK-centre entry fee of £96.25 for 8464 and £48.15 for 8462. These are awarding-body charges to centres, not a cap on what a private centre can charge for administration, invigilation, premises or practical provision. The normal entry deadline is 21 February 2027; AQA lists a 100% late fee from 22 February and 150% after 21 April. [AQA entry fees](https://www.aqa.org.uk/exams-administration/entries/entry-fees). Recheck all dates and prices before commitment.
6. **Transfer access evidence early.** JCQ permits reuse of relevant Form 8/Form 9 evidence in some same-qualification resit transitions, but the accepting centre must establish current need and normal way of working. It is unsafe to assume automatic transfer. Where a centre is under the reasonable-adjustment duty, it must not charge a disabled candidate an additional fee for the adjustment or aid. That enduring principle is distinct from lawful general private-entry, administration, invigilation and practical fees; whether a quoted line item is truly an adjustment charge is fact-specific, so require an itemised explanation. [JCQ candidate-change guidance](https://www.jcq.org.uk/knowledge-hub/access-arrangements-when-a-candidate-changes-centre/); [JCQ access arrangements](https://www.jcq.org.uk/exams-office/access-arrangements-and-reasonable-adjustments/); [Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents).
7. **Manage multiple results accurately.** A later certificate does not make the earlier 5–4 unreal, and this report found no general rule that every receiver must take the highest attempt while ignoring all others. Follow the destination's disclosure rules and describe both qualifications precisely.

| Option | Potential value | Principal risk | Decision-critical evidence |
| --- | --- | --- | --- |
| Seek conditional admission with 5–4 | Avoids repeating a broad double award; may pair prior attainment with support. | Sixth form refuses or learner struggles with prerequisite content. | Receiver discretion and readiness evidence. |
| Retake 8464 at Higher | Directly targets 6–6 in the named qualification. | Six-paper workload, all-science Higher demand, private-centre/practical cost, 4–3/U downside. | Paper-level diagnostic, centre commitment, practical plan and total cost. |
| Take new Chemistry 8462 | Focuses effort where subject strength/goal lies and creates a separate credential. | May not meet a Combined Science gate; summer-only, still two papers and eight required practical activities. | Written receiver acceptance, Chemistry-Higher readiness and a centre practical plan. |
| Change course/provider or bridge first | May produce better curriculum fit at lower assessment burden. | Changes destination or delays progression. | Comparable course outcomes, learner preference and support offer. |

**Best interpretation:** no national resit policy requires this learner to improve science. The rational target is the intended educational destination, not grade maximization for its own sake. A 6–6 rule may be a useful readiness screen, an administrative shortcut or both; the provider should be able to show how it predicts success and whether conditional support is a less exclusionary alternative. Success includes genuine science readiness, feasible and accessible assessment, proportionate cost and actual admission—not merely a higher paired grade.

Functionally, the proposed attempt is principally credential improvement and strategic signalling to one receiver. It becomes remedial education only to the extent that further study changes science capability, and reassessment only in the sense that six new papers collect a fresh aggregate sample. Those functions should not be assumed to align.


## Resits: alternatives and unfinished research

The evidence does not support a single universal replacement. The affected population ranges from a boundary-near learner needing a portable credential to a repeated resitter with substantial prerequisite gaps, an invalid first sitting, or a destination that values a different construct. Reform should therefore be judged against at least six outcomes: durable learning, valid certification, portability/recognition, progression, wellbeing/equity and total opportunity cost.

#### Option appraisal

| Option and intended population | Theory of change | Current status / evidence | Potential benefit | Principal risk | Minimum credible evaluation |
| --- | --- | --- | --- | --- | --- |
| **1. Improve current GCSE resit teaching**: learners for whom GCSE is the right endpoint | Diagnose domain gaps; change pedagogy; provide sufficient, well-timetabled teaching and stable specialist staff. | Operative route. Practice guidance is richer than causal impact evidence; EEF judges the post-16 attainment-impact base very weak. | Preserves the widely recognised credential while developing capability. | More hours of unchanged teaching; timetable displacement; staffing constraints. | Cluster trial or phased rollout measuring attended dose, domain learning, grade, destination, wellbeing and cost. |
| **2. Readiness-gated examination entry**: learners studying GCSE but not yet ready | Separate study from immediate public entry; use transparent milestones to reduce avoidable repeat failure. | DfE already directs providers to consider attendance, engagement and progress; causal timing evidence is absent. | Protects teaching time and avoids premature November attempts. | Strategic non-entry, low expectations or delayed feedback. | Pre-specified entry criteria; audit non-entry by subgroup; randomised encouragement where ethical. |
| **3. Diagnostically differentiated routes**: especially grade 2/below | Match GCSE, direct Functional Skills Level 2, or a time-bounded foundation stage to construct, readiness and destination. | Some discretion is operative; no robust causal route comparison. | Better fit and learner agency; may reduce repeated mismatch. | Tracking by prior grade, teacher expectation or class; dead-end Level 1 routes. | Pragmatic trial stratified by diagnostic profile and destination; monitor reversibility and receiver acceptance. |
| **4. Destination-aware Functional Skills with protected reversibility** | Build applied literacy/numeracy through an on-demand Level-2 route where accepted, while preserving a later GCSE bridge. | Functional Skills is operative for eligible learners; recognition is purpose-specific. | Faster or more relevant route for some; flexible assessment. | A same-level award is rejected by a later course/profession; apparent high success reflects selection. | Publish receiver audit; compare matched/assigned routes; record aspiration changes and later bridge use. |
| **5. New GCSE-aligned Level 1 preparation qualification**, normally for grade 2/below | Teach/bank foundations aligned to later GCSE, making progress visible before a full Level-2 attempt. | Government commitment and closed 2026 consultation; at cutoff content, grading, modularity and first-teach date were not fixed. **Not operative.** [DfE consultation](https://www.gov.uk/government/consultations/16-to-19-level-1-english-and-maths-qualifications). | Coherent progression and recognition of sub-threshold learning. | Duplicates an existing Level-1 GCSE outcome; creates another holding track; premature claims for modularity. | Pre-registered pilot with banked-content validity, progression, portability, differential outcomes and multi-year cost. |
| **6. Embedded vocational English/maths plus an approved route** | Make purpose visible and practise transfer in authentic tasks while retaining stand-alone curriculum/credential provision. | Additive embedded support is allowed; it cannot replace DfE's ordinary stand-alone minimum. Contextualisation pilot did not establish an impact. | Relevance, transfer and engagement. | Context-specific learning fails to transfer; vocational time is still displaced. | Compare embedded-plus-core against core alone using common and vocational transfer tasks. |
| **7. Capability profile and progress record**: all below-threshold learners | Report domain growth and functional performance alongside the categorical grade. | Providers are encouraged to track engagement/confidence/progress; no common high-stakes profile exists. | Makes learning visible without pretending a near miss is no progress; improves diagnosis. | Weak standardisation, reporting burden or a second-class certificate. | Reliability/validity study; receiver comprehension experiment; prevent profile from replacing a portable entitlement. |
| **8. Provider-incentive and accountability redesign** | Reward delivered learning, appropriate entry and progression rather than compliance counts or threshold gaming. | A White Paper commitment was followed by a [16–19 performance-measures consultation](https://www.gov.uk/government/consultations/16-to-19-performance-measures), which closed 21 July 2026. No outcome had been published by the cutoff; results were promised for autumn 2026. Proposed/unsettled, not operative. | Aligns incentives with attended teaching and multiple outcomes. | Complex metrics can be gamed; risk adjustment can encode low expectations. | Shadow measures first; publish subgroup, non-entry and provider-behaviour effects; audit Goodhart responses. |
| **9. Voluntary entitlement rather than a provider mandate**: normative alternative | Offer funded study and counselling but give the learner final route/participation choice. | Not current England policy. Learner-voice evidence is mixed; no causal comparison of mandate versus entitlement was found. | Greater agency and possibly engagement/wellbeing. | Lower take-up can entrench disadvantage and withhold a valuable credential from those least supported. | Staged policy experiment or defensible natural experiment measuring participation, learning, progression and distribution. |
| **10. Protected opportunity to pursue a portable Level-2 endpoint, with varied pace and pathway** | Preserve equal expectation/portability while allowing staged, applied or GCSE routes and delayed entry. | Best interpreted as a design synthesis, not an evaluated package or current personal legal entitlement. | Balances a common opportunity with equity of support and route. | Incompatible constructs are relabelled “equivalent”; complexity burdens learners/providers. | System pilot with explicit construct map, portability guarantees, learner choice and long-term follow-up. |

The Education Committee proposed three routes—realistic GCSE prospects, contextual/embedded provision with possible exemption, and Functional Skills for learners unlikely to reach grade 4 after multiple attempts. This is a parliamentary committee recommendation, not law or the operative funding condition, and its embedded-exemption limb would require regulatory/funding change and evidence of construct/recognition. [Education Committee, paras 103–114](https://publications.parliament.uk/pa/cm5901/cmselect/cmeduc/666/report.html). The [Government response](https://publications.parliament.uk/pa/cm5901/cmselect/cmeduc/1555/report.html) labelled the study-programme recommendation “plans already in place,” but substantiated that with Level-2 pathways, the proposed Level-1 stepping stone and accountability changes; it did **not** enact the embedded-content exemption. The parallel apprenticeship three-route recommendation was explicitly “not taken forward.” This is a status tension, not evidence of adoption.

Government's proposed Level 1 qualification is likewise not evidence that the design works: the 2026 consultation asks questions about the design precisely because key choices remain open. The July implementation plan still described government as consulting on it. [Post-16 pathways implementation plan](https://www.gov.uk/government/publications/post-16-pathways-implementation-plan/post-16-pathways-implementation-plan).

#### Best-supported design direction

Subject to evaluation, the strongest synthesis is a **diagnosed, destination-aware differentiated pathway with a protected opportunity to pursue a portable Level-2 endpoint**:

1. establish the learner's construct profile, access needs, prior opportunity and plausible destination rather than allocate by grade alone;
2. preserve a portable Level-2 endpoint, but allow GCSE, Functional Skills or a strictly time-bounded foundation stage where evidence supports fit;
3. audit published requirements and seek written clarification for plausible destinations before routing away from GCSE, without making a learner with uncertain aspirations obtain individual guarantees; preserve a viable bridge if aspirations change;
4. provide sufficient specialist teaching, relational support and authentic transfer tasks; do not confuse planned hours with delivered learning;
5. make public examination entry readiness-based under transparent, subgroup-audited rules;
6. report domain/capability progress, grade, destination, attendance and wellbeing separately; and
7. test each change against a realistic counterfactual before scaling it.

This is an evidence-constrained direction, not a proven programme or statement of current legal entitlement. A protected Level-2 opportunity can guard against abandonment and fragmented recognition; differentiated pace and route protect against treating identical inputs as equitable. The remaining distributional question—how much learner choice should override an institutional guarantee—is normative and cannot be answered by pass rates alone.

### Prioritised research programme

The central missing object is not another uncontrolled “pass-rate study.” It is a linked account of who was eligible, what they were offered, what they attended and learned, whether/when they entered, what they achieved, how they experienced it and what happened next—compared with a credible alternative.

| Priority | Study and estimand | Design | Essential outcomes / safeguards |
| --- | --- | --- | --- |
| **1** | Which GCSE, Functional Skills, staged or delayed-entry route causes the best bundle of outcomes for defined learners? | Multi-site pragmatic randomised trial where routes are genuinely equipoised and legally eligible, stratified by prior grade, diagnostic profile, SEND/access need and intended destination. Under the operative condition, a full-time grade-3 learner cannot be assigned to Functional Skills; GCSE-versus-FS/staged comparison must therefore use eligible groups (principally grade 2 or below) or an authorised policy variation. If randomisation is infeasible, use pre-specified matched/IV designs with strong sensitivity analysis. | Domain learning, functional transfer, attended hours, credential/mark, destination, wellbeing, cost; intention-to-treat and treatment-on-treated; non-entry visible. |
| **2** | What is the causal effect of England's provider condition relative to realistic alternatives? | Exploit defensible policy/eligibility discontinuities, phased changes or cross-jurisdiction differences only after testing continuity/parallel-trend and spillover assumptions. Do not label England–Wales differences causal by default. | Participation, route, learning, qualification, post-18 education/work, wellbeing, distribution and public/provider/learner cost. |
| **3** | What teaching was actually received, and what dose/fidelity matters? | National linked implementation cohort; timetable/ILR plans joined to session attendance, staffing, pedagogy observation and low-stakes common assessments. Randomise feasible scheduling, attendance or instructional supports. | Planned versus offered versus attended hours; teacher expertise/turnover; domain gain; subgroup attrition; privacy-preserving linkage. |
| **4** | What happens to repeated resitters, including those never entered or withdrawn? | Prospective longitudinal panel from first below-threshold result to at least age 21, oversampling repeat/non-entry, FE, SEND, disadvantage and EAL; link survey/interview and administrative records. | Attempt histories, identity/self-efficacy, distress, agency, reasons for absence/non-entry, capability, destinations; trauma-aware participation and withdrawal rights. |
| **5** | Does grade 4 itself still cause downstream change in current English and maths cohorts? | Modern regression-discontinuity analysis around awarding boundaries, with manipulation/continuity checks and separate subject/series/provider analyses. | Receiver decisions, enrolment, completion, earnings where feasible; distinguish credential effect from subsequent mandated teaching. |
| **6** | Which learners obtain and actually use access arrangements after changing centre? | Linked access-approval, implementation, incident, entry and outcome study, with qualitative process tracing. | Approval versus use, transition failures, special consideration, disability/SEND/EAL intersections, grade and wellbeing; avoid treating approval count as access quality. |
| **7** | What does the policy cost, and who bears it? | Societal cost-consequence study alongside route/policy evaluations. | Teaching, recruitment, rooms, exams, private-centre fees, learner travel/time, displaced vocational learning; report outcomes separately rather than force a single monetary value. |
| **8** | Are receiver thresholds valid and are “equivalents” consistently recognised? | Audit a stratified national sample of course/employer/professional requirements; model subsequent performance by grade/domain while testing differential prediction. | Published versus applied rule, local discretion, incremental validity, equality effects, Functional Skills/UK qualification recognition. |
| **9** | If modular/banked assessment is adopted, does a GCSE-aligned Level-1 route build progress without trapping learners? | Pre-register before rollout; randomised or stepped-wedge pilot with clear counterfactual and independent assessment of construct coverage. | Banked-unit reliability, later GCSE/FS Level 2, portability, learner agency, wellbeing, cost, route-switching and dead-end rate. |
| **10** | How do accountability rules alter entry and teaching decisions? | Difference-in-differences/event study around measure changes plus provider interviews and anomaly detection. | Strategic withdrawal/non-entry, grade concentration, teaching allocation and subgroup effects; publish gaming risks and model uncertainty. |

The first four priorities should precede broad system redesign. Priorities 1 and 2 identify causal route/policy effects; 3 establishes the intervention actually delivered; 4 corrects the systematic invisibility of non-entry, repeated attempts and learner experience. Cost, recognition and qualification-pilot evidence then determine whether a promising effect is scalable and portable.

#### Reporting standards for every future study

- Pre-specify the estimand: offer, assignment, attendance, exam entry, credential or downstream effect.
- Publish a participant flow from eligibility through allocation, teaching, entry and follow-up.
- Report absolute numerators/denominators, uncertainty intervals, missingness and repeat attempts.
- Separate unique learners, qualification entries, components and results; do not call each a “student.”
- Measure domain learning and transfer independently of the target high-stakes examination where possible.
- Report SEND, disability/access, disadvantage, sex, ethnicity, EAL, region, prior grade and provider setting without underpowered causal storytelling.
- Register harms, opportunity cost and learner voice alongside attainment; retain neutral opt-out/withdrawal processes.
- Archive instruments, analysis code and a versioned rule/implementation record so later readers know which policy was tested.


## Resits: practical decision questions

This checklist does not replace the current rule, specification, centre policy or professional/legal advice. Its purpose is to stop distinct problems being collapsed into “just resit.”

#### For a learner or family

1. **Name the exact object:** jurisdiction, awarding organisation, qualification/specification code, series, tier, component marks, grade boundary and current certificate.
2. **Define the intended outcome:** more capability, a corrected first result, a grade/credential gate, admission to a named course, or some combination.
3. **Diagnose the problem:** lack of learning/opportunity, exam execution, possible marking error, absent approved arrangement, temporary adverse event, or a receiver threshold.
4. **Check the authority:** is the statement from legislation, the England funding condition, regulator/JCQ/AO rule, or only a college/employer condition? Ask for the current text in writing.
5. **Protect time-critical routes:** obtain scripts, incident records, consent information and live post-results deadlines before assuming a later resit is the only option.
6. **Verify coverage:** age, programme planned hours, full-/part-time status, prior English Language/Literature or maths equivalents, EHC/exemption evidence and jurisdiction.
7. **Compare realistic routes:** current course/support, GCSE, Functional Skills, a staged approved qualification, delayed entry or another destination. Record what each receiver accepts.
8. **Ask the provider to explain the teaching plan accessibly:** diagnostic domains, what will change from the first attempt, attended-hour target, staffing, progress checkpoints, transfer tasks and exam-readiness criterion. The provider—not the family—should own an intelligible plan and offer translation/advocacy support where needed.
9. **Plan access early:** current need/normal way of working, provider-led evidence transfer, centre verification/application/implementation, practical/NEA/endorsement treatment and exam-day verification. Centre process does not create discretion to waive equality duties.
10. **Cost the whole decision:** entry, centre/admin, teaching, travel, time, practical provision, grade downside and displaced study; get itemised written terms.
11. **Agree multidimensional success:** domain gain, functional transfer, attendance, confidence/wellbeing, mark/grade/credential and actual destination progression.
12. **Set a review/exit point:** when to enter, switch route, seek a different provider or stop further public exam attempts because expected benefit no longer exceeds burden. Separately check any continuing approved-study, participation or local enrolment obligation.

#### For a provider or exam centre

- Record the learner's eligibility, prior attainment/equivalence, route rationale, funded planned hours and any tolerance/exemption authority separately.
- Build the timetable and staffing needed to make provision deliverable; track offered and attended teaching rather than using planned hours as an impact measure.
- Use a domain/access/destination diagnosis, not prior grade alone; involve the learner and record why a same-level or alternative route progresses toward Level 2.
- Publish exam-entry criteria; audit non-entry, withdrawal and early entry by subgroup to detect low expectations or strategic exclusion.
- Verify access evidence and normal way of working at transition; run an exam-day control that confirms approved arrangements were delivered.
- Give proactive, accessible explanations of route, deadlines, cost and risk; arrange translation or independent advocacy where needed, and do not transfer the administrative/literacy burden of evidence movement to families.
- Keep special consideration, marking review, complaint/malpractice and admissions decisions on the correct independent tracks.
- Report capability, mark/grade, destination and wellbeing; do not call “qualification on timetable” or “entered” a successful intervention.
- Obtain current written receiver feedback and validate local thresholds against subsequent performance and differential impact.

#### For an analyst or policymaker

- State rule version, effective date, jurisdiction, affected provider/learner and authority type.
- Define unit, denominator, repeat handling, age/cohort, series and whether outcome is point-in-time or cumulative.
- Draw the causal chain and identify selection at each link; name the realistic counterfactual.
- Separate credential effects from learning effects and policy assignment from treatment received.
- Publish non-entry/attrition, subgroup distributions, absolute effects, uncertainty, cost and harms.
- Mark operative policy, proposal, consultation, pilot and evaluation as different statuses.


## Resits: reusable research contract and remaining scope

The original *GCSEs, resits and the systems around them: comprehensive research brief*, version 1.0, 4 September 2026 (EXT-SRC-0178), was a research specification, not evidence. Its completed answers have been integrated above. The following methodological and uncompleted scope remains useful for future research rather than being treated as already established.

### Nine question families and their residual work

| Question family | Substance conserved above | Remaining decision-relevant work |
|---|---|---|
| Origins, purposes and governance | Institutional history, authority and multiple GCSE functions | Test conflicts among certification, accountability, selection and educational design where a concrete reform changes them |
| Grade meaning and trustworthiness | Validity, reliability, one-mark sensitivity, threshold effects, tiering | Determine suitability of an assessment designed for14–16 learning for particular post-16 purposes; validate local prediction and consequential use |
| Resit mechanics | Jurisdiction/specification, components, endorsements, private entry, remedies and result histories | Verify live changed specifications, exact new-centre practical acceptance, local cost and disclosure rules before action |
| England post-16 regime | Scope, prior grades, Literature equivalence, route/hours/readiness, exemptions, tolerance and enforcement ambiguity | Resolve unprovided cross-border low-grade/product mappings and any operative successor reform from its authority |
| Implementation and pedagogy | Planned versus delivered/attended provision, diagnostics, relationships, changed teaching and interventions | Observe actual staffing, class size, expertise, dose and timetable conditions, including English and technology enactment |
| Outcomes and causality | Entry/learner/cumulative denominators, learning versus credential, realistic route/policy counterfactuals | Identify assignment, offer, attendance, entry and credential effects separately; link durable capability and downstream outcomes |
| Experience/equity | Learner voice and subgroup distributions with sampling limits | Include non-attenders, withdrawals, non-entry, repeated attempts, families, care experience, EAL, SEND and school/sixth-form perspectives |
| Receiver use | Regulated level, substantive construct and practical recognition | Sample actual course, employer, apprenticeship, professional and public-sector requirements; separate published and applied criteria |
| Alternatives and system design | Differentiated routes, timing, staged qualifications, contextualisation, incentives and voluntary entitlement | Compare real alternatives on learning, recognition, equity, cost and feasible implementation; international cases only when structurally matched |

Future work must preserve the hypothesis that each function can be legitimate while their combination fails a learner. Neither “resits help” nor “resits harm” is an adequate starting assumption. Common standards may protect expectations and portability while imposing unequal burdens; further learning may matter without grade crossing; and a higher observed pass rate may arise from selection. Agency versus compulsion, equal expectation versus differentiated support, and portable credentials versus opportunity cost include explicit value choices that evidence cannot settle alone.

### Statistical record required for every material number

| Field | Required information |
| --- | --- |
| Geography | Nation and, where relevant, region |
| Time | Academic year, examination year and series |
| Population | Age, programme and provider coverage |
| Subject | English Language, Literature, Mathematics or another subject |
| Starting point | Prior grade, tier and age-16 status where available |
| Unit of analysis | Person, candidate, entry, qualification or institution |
| Attempt status | First entry, first resit, repeated attempt or unknown |
| Numerator | Exact event counted |
| Denominator | Exact eligible or observed population |
| Multiplicity | Whether one person may occur more than once |
| Missingness | Absence, non-entry, withdrawal, suppression and attrition |
| Threshold | Grade and qualification-level definition |
| Source | Exact table, worksheet, release and metadata |
| Comparability | Reform, grading, pandemic or series discontinuities |

Never convert a percentage of entries into "the percentage of learners who pass" without evidence that entries and unique learners are equivalent. Separate November from summer, subject-specific attainment from attainment in both subjects, and per-sitting results from cumulative attainment by age 19. Where possible, reproduce simple calculations and state the inputs.

### Study appraisal record

For a consequential study retain research question/design; population/period/jurisdiction; exposure/intervention; comparator/counterfactual; outcome definition; sample size, attrition and missingness; confounding and selection; effect and uncertainty; peer-review status; author/publisher/funder and plausible interests; generalisability; and what the study cannot establish. Evidence is routed by the question: operative authority for rules, original administrative data for outcomes, suitable counterfactual designs for causality, transparent mixed methods for implementation, qualitative or representative survey evidence for experience, direct receiver evidence for recognition, and transparent cost studies for economics. Journalism can locate or illustrate a claim but does not substitute for the governing authority.

### Twelve-field case record

Every new case records: (1) known facts; (2) missing/ambiguous facts; (3) national and qualification rules; (4) local terms/discretion; (5) choices, rights and obligations; (6) pathways/timing; (7) educational and assessment mechanisms; (8) realistic counterfactuals; (9) benefit, harm and opportunity cost; (10) evidence strength; (11) conditional conclusion; and (12) questions the institution must answer. Select and identify a representative specification when mechanics depend on one; do not silently generalise an AQA example to another board.

### Scope and stopping discipline

A future refresh establishes its own research-as-of date, policy year, exam series and latest statistical releases; it does not reuse the brief date as a permanent cutoff. Prioritise live England rules and supported case answers, then conceptual/measurement/outcome/pedagogy analysis, then devolved comparisons. A foreign comparison earns inclusion only when its matched mechanism and failure of analogy can be explained. Generic revision advice, a commercial product survey, exhaustive timetables and personalised legal/admissions advice remain outside this research task unless separately commissioned.

Stop a refresh when consequential rule claims have primary support, cases have supported conditional answers or explicit gaps, material disagreements are resolved or bounded, and another targeted search is unlikely to change the conclusion or confidence. Failed access remains a stated limitation. Preserve material claim-to-source provenance, source revision/effective/access dates, exact table/worksheet locators, null findings and contrary evidence; do not confuse repeated citations with independent corroboration. Report high, moderate, low or unresolved confidence with its reason, without invented numerical probabilities.


## Source identities and preservation limits

The source families reconstructed here are:

- *All-subject and lifelong AI tutoring: profile architecture, evidence boundaries and commissioning programme*, 5 September 2026, specialist design companion (F16/SRC-0040), including its nine-part contract, family and context tables, stages, continuity, commissions and defeaters.
- *GCSEs, resits and the systems around them: a critical, source-led account of learning, assessment, certification, selection and public policy*, 4 September 2026 (F05/SRC-0042), including definitions, rules, raw denominators, study limitations, four cases, alternatives, research designs and practical questions.
- *GCSEs, resits and the systems around them: comprehensive research brief for a ChatGPT Deep Research session*, version1.0, 4 September 2026 (EXT-SRC-0178). This is a commissioned question set, not empirical evidence; its reusable methodological detail and residual scope are preserved above.
- *OCE tuition enablement assessment*, 5 September 2026 (F17/SRC-0047), inspected pedagogical-source and repertoire passages; the integrating *Public AI-enabled tuition service: concept and POC requirements*, 6 September 2026, R-SVC-05–08; and *A public-service AI tutor for durable, independent learning across subjects*, 5 September 2026, §6.3. Their proposal status and source dependencies remain explicit. Engineering evidence belongs in [document 08](08-oce-audit-and-engineering-findings.md).

The four resit cases have supported conditional answers, but the source's broad statement that no material contradiction remained does not erase its residual gaps: the exact private-centre reuse of practical records; sub-threshold cross-border route mappings and new Welsh products; ambiguous funding deduction wording; final form/start date of proposed qualifications; and missing causal policy/route, national cost and access-use evidence. Apparent conflicts between summer and cumulative rates, November and summer, or GCSE and Functional Skills are often denominator/selection differences; threshold consequences and measurement uncertainty can coexist. No agent consensus has converted an unresolved question into a finding.

A contemporary source report's strong recommendation is not automatically a current user decision. This reconstruction preserves the all-subject/lifelong ambition and settled POC direction, while retaining specific initial studies, expansion portfolios, reforms, provider choices and detailed architecture as proposals. The resit source is broader than the tuition POC, and its institutional research remains valuable without becoming a mandatory service feature.

### Consequential resits bibliography

#### Rules, regulation and assessment administration

- **Department for Education. [*2026 to 2027 academic year: 16 to 19 funding—maths and English condition of funding*](https://www.gov.uk/government/publications/16-to-19-funding-maths-and-english-condition-of-funding/2026-to-2027-academic-year-16-to-19-funding-maths-and-english-condition-of-funding).** Controlling England source for population, route, hours, readiness, progression, tolerance, exemptions, audit and sanctions; updated 24 July 2026.
- **UK Parliament. [Education and Skills Act 2008, section 1](https://www.legislation.gov.uk/ukpga/2008/25/section/1).** Establishes England participation duty; essential for avoiding the false inference that the statute itself requires a named GCSE result.
- **Ofqual. [*GCSE (9 to 1) qualification-level conditions and requirements*](https://www.gov.uk/government/publications/gcse-9-to-1-qualification-level-conditions/gcse-9-to-1-qualification-level-conditions-and-requirements).** Regulatory framework for recognised awarding organisations and GCSE design/assessment.
- **Ofqual. [*Guide for schools and colleges 2026*](https://www.gov.uk/government/publications/ofqual-guide-for-schools-and-colleges-2026/ofqual-guide-for-schools-and-colleges-2026).** Current accessible account of regulator, awarding-body and centre roles, tiering and result processes.
- **JCQ. [*Post-results services: June and November 2026*](https://www.jcq.org.uk/exam-results-data/post-results/).** Cross-board operational framework for script access, clerical checks and marking/moderation reviews; exact AO service pages still control operational action.
- **JCQ. [*A guide to the awarding bodies' appeals processes, effective June 2026*](https://www.jcq.org.uk/knowledge-hub/a-guide-to-the-awarding-bodies-appeals-processes-effective-from-june-2026/).** Distinguishes appeals from marking reviews and sets process/category time limits.
- **JCQ. [*A guide to the special consideration process*](https://www.jcq.org.uk/knowledge-hub/a-guide-to-the-special-consideration-process-2/).** Controlling source for Case 3 eligibility, percentage categories, centre initiation and exceptional late applications.
- **JCQ. [*Access arrangements when a candidate changes centre*](https://www.jcq.org.uk/knowledge-hub/access-arrangements-when-a-candidate-changes-centre/).** Important corrective to both “evidence automatically transfers” and “every assessment must start again.”
- **AQA. [English Language 8700](https://www.aqa.org.uk/subjects/english/gcse/english-8700/specification/scheme-of-assessment), [Mathematics 8300](https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/specification/specification-at-a-glance), [Geography 8035](https://www.aqa.org.uk/subjects/geography/gcse/geography-8035/specification/scheme-of-assessment), [Combined Science 8464](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/scheme-of-assessment).** Representative/current specification mechanics used explicitly, not generalized silently across awarding organisations.

#### Grading, measurement and qualification meaning

- **Ofqual. [*GCSE and A level grading: what you need to know*](https://www.gov.uk/government/publications/gcse-and-a-level-grading-what-you-need-to-know/gcse-and-a-level-grading-what-you-need-to-know).** Explains standard maintenance, examiner/statistical evidence and post-pandemic return; rejects quota mythology.
- **Ofqual. [*Reliability of assessment compendium*](https://www.gov.uk/government/publications/reliability-of-assessment-compendium/introduction-to-the-concept-of-reliability).** Conceptual foundation for sampling, measurement error and boundary sensitivity.
- **Rhead, S., Black, B. and Pinot de Moira, A. (2018). [*Marking consistency metrics—an update*](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/759207/Marking_consistency_metrics_-_an_update_-_FINAL64492.pdf).** Large operational model of marker consistency; informative but often misreported as a “wrong grade” study.
- **Ofqual. [*Designing qualifications that will be fit for their purposes*](https://www.gov.uk/government/publications/designing-qualifications-that-will-be-fit-for-their-purposes--2/designing-qualifications-that-will-be-fit-for-their-purposes-accessible) (2026).** Current regulatory account of validity, reliability, comparability, manageability and bias trade-offs.
- **Ofqual. [*Grade descriptors for GCSEs graded 9 to 1*](https://www.gov.uk/government/publications/grade-descriptors-for-gcses-graded-9-to-1).** Demonstrates that descriptors are broad midpoint illustrations, not an individual grade-4 competence checklist.

#### Outcomes and causal evidence

- **Ofqual. [*Qualification results in England: summer 2026*](https://www.gov.uk/government/publications/qualification-results-in-england-summer-2026/qualification-results-in-england-summer-2026).** Latest whole-series results and unique-student context; not a resit cohort study.
- **JCQ. [*Examination results data*](https://www.jcq.org.uk/exam-results/).** England post-16 summer and November subject tables; useful only with unit/age/series discipline.
- **Department for Education. [*Level 2 and 3 attainment age 16 to 25: 2024/25*](https://explore-education-statistics.service.gov.uk/find-statistics/level-2-and-3-attainment-by-young-people-aged-19/2024-25) and [underlying dataset](https://explore-education-statistics.service.gov.uk/data-catalogue/data-set/e522a057-8f4a-49f1-b249-3e58aafd64f6).** Strongest current cumulative unique-person picture, including prior-grade numerators/denominators and GCSE/Functional Skills route of attainment; descriptive, not causal.
- **Department for Education. [*A level and other 16 to 18 results: 2024/25*](https://explore-education-statistics.service.gov.uk/find-statistics/a-level-and-other-16-to-18-results/2024-25).** Learner-linked entry/progress source; points improvement is not identical to grade 4 or capability.
- **Machin, S., McNally, S. and Ruiz-Valenzuela, J. (2020). [“Entry through the narrow door”](https://doi.org/10.1016/j.jpubeco.2020.104224), *Journal of Public Economics*.** Regression-discontinuity evidence that a legacy English C changed education trajectories for boundary-near candidates; identifies credential treatment, not compulsory-resit pedagogy.
- **Vidal Rodeiro, C. (2018). [*Which students benefit from retaking mathematics and English GCSEs post-16?*](https://www.cambridgeassessment.org.uk/Images/476535-which-students-benefit-from-retaking-mathematics-and-english-gcses-post-16-.pdf).** Valuable linked historical attempt sequences and heterogeneity; legacy specifications and endogenous repeated attempts limit current causal use.

#### Teaching, learner experience and equity

- **Education Endowment Foundation. [*Post-16 GCSE resit practice review*](https://educationendowmentfoundation.org.uk/education-evidence/evidence-reviews/post-16-practice-review).** Maps promising practices and exposes how little post-16 resit teaching has credible attainment-impact evaluation.
- **EEF. [*Mastering Mathematics*](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/mastering-mathematics-23-24-trial) and [*5Rs*](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/the-5rs-approach-to-gcse-maths-resits-accelerator-fund).** One promising small developer-led result awaiting independent scale-up, and one recruitment failure that usefully demonstrates implementation/evaluation difficulty.
- **Noyes, A. and Dalby, D. [*MiFEC Interim Report 3*](https://www.nottingham.ac.uk/research/groups/crme/documents/mifec/interim-report-3.pdf).** Multi-region learner focus groups showing negative prior identity, exam fear, mixed views of compulsion and more positive college experiences; analytic rather than statistical generalisation.
- **Maris, R., Anders, J., Campbell, T. and Wyness, G. (2026). [*Exhausting exams: the wellbeing effects of compulsory retakes*](https://ideas.repec.org/p/ucl/cepeow/26-08.html).** Timely longitudinal, adjusted cross-country working paper reporting an adjusted 0.11-SD association; not peer-reviewed and unable to eliminate all confounding, so causal whole-policy attribution remains low-confidence.
- **Barrance, R. (2020). [Tiering and learner views](https://bera-journals.onlinelibrary.wiley.com/doi/10.1002/berj.3629).** Mixed-methods evidence from Wales/NI on perceived fairness, caps and labels; does not estimate attainment causally.

#### Alternatives, reform and devolved systems

- **Ofqual. [*Review of reformed Functional Skills qualifications*](https://www.gov.uk/government/publications/a-review-of-the-assessment-of-reformed-functional-skills-qualifications-in-english-and-maths/a-review-of-the-assessment-of-reformed-functional-skills-qualifications-in-english-and-maths) (2024).** Best current validity/demand and assessment-mode account; its all-age certificate mix cautions against treating it as resitter evidence.
- **Department for Education. [Apprenticeship English](https://www.gov.uk/government/publications/english-and-maths-requirements-in-apprenticeship-standards-at-level-2-and-above/english-qualifications-for-apprenticeships) and [mathematics](https://www.gov.uk/government/publications/english-and-maths-requirements-in-apprenticeship-standards-at-level-2-and-above/maths-qualifications-for-apprenticeships) qualification tables.** Operative source for age-at-start, training-plan and destination-level requirements; it demonstrates national recognition for this purpose, not universal employer acceptance.
- **Department for Education. [*Initial teacher training criteria and supporting advice 2026–27*](https://www.gov.uk/government/publications/initial-teacher-training-criteria/initial-teacher-training-criteria-and-supporting-advice-2026-to-2027); King's College London [general](https://www.kcl.ac.uk/study/undergraduate/how-to-apply/entry-requirements) and [Medicine](https://www.kcl.ac.uk/study/undergraduate/courses/medicine-mbbs/entry-requirements) requirements; Middlesex University [undergraduate requirements](https://www.mdx.ac.uk/study/undergraduate/entry-requirements-for-undergraduates/).** First-party examples showing that shared RQF level does not force common receiver recognition; examples establish variation, not prevalence.
- **House of Commons Education Committee. [*Further Education and Skills*](https://publications.parliament.uk/pa/cm5901/cmselect/cmeduc/666/report.html) (2025).** Synthesises sector concerns and proposes differentiated routes. It is scrutiny/recommendation, not operative policy or causal evaluation.
- **UK Government. [Response to *Further Education and Skills*](https://publications.parliament.uk/pa/cm5901/cmselect/cmeduc/1555/report.html) (2026).** Primary status evidence: “plans already in place” did not enact the Committee's study-programme embedded exemption, while the apprenticeship three-route proposal was not taken forward.
- **Department for Education. [*Post-16 Education and Skills White Paper*](https://www.gov.uk/government/publications/post-16-education-and-skills-white-paper/post-16-education-and-skills-white-paper); [Level-1 English/maths consultation](https://www.gov.uk/government/consultations/16-to-19-level-1-english-and-maths-qualifications); [16–19 performance-measures consultation](https://www.gov.uk/government/consultations/16-to-19-performance-measures); and [post-16 implementation plan](https://www.gov.uk/government/publications/post-16-pathways-implementation-plan/post-16-pathways-implementation-plan) (2025–26).** Primary evidence of commitment and proposal status; closed consultations and plans cannot establish operative detail or future design effectiveness.
- **Department for Education. [*Further education workforce, 2024/25*](https://explore-education-statistics.service.gov.uk/find-statistics/further-education-workforce/2024-25).** Current provider-return evidence on staffing and vacancies; incomplete return coverage and developing retention statistics constrain English/maths-specific inference.
- **WJEC. [Made-for-Wales Mathematics and Numeracy](https://www.wjec.co.uk/media/ojhfscmj/wjec-gcse-mathematics-and-numeracy-specification.pdf) and [English Language and Literature](https://www.wjec.co.uk/media/w2mlpil0/wjec-gcse-english-language-and-literature-specification.pdf).** Direct specifications showing why “all GCSE resits are linear” is false outside the named system.
- **Department of Education Northern Ireland. [*Policy Framework for General Qualifications*](https://www.education-ni.gov.uk/publications/policy-framework-general-qualifications-northern-ireland) (3 March 2026).** Final future direction retaining A*–G; must not be confused with every current specification.
- **Qualifications Scotland. [Launch announcement](https://www.qualifications.gov.scot/news/qualifications-scotland-launched/) and [reform programme](https://www.qualifications.gov.scot/about/qualifications-reform).** Establishes the 2026 governance change and future timetable while current National 5 rules remain in force.

**Status:** provisional source-based synthesis. Architectural extensibility, profile suitability, practical access, technical operation and educational effect each require their own observations. Reopen an affected profile after material changes in subject/curriculum, tools, model/policy, population, context, supervision, assessment or receiver authority, or after evidence of dependency, inequity, harm or disproportionate burden. Reconsider the shared-kernel approach if legitimate new profiles repeatedly require rewrites or if simpler/human alternatives better serve the same purpose.
