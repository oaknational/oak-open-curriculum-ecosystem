# Experimental programme for adaptive capacities

Repository reading copy of the 9 September 2026 research record. The [import note](README.md) distinguishes historical research status from this repository transfer; the [exact source package](research-package.zip) preserves all original documents and evidence. Only this notice and local evidence links differ from the original; the report also uses multiline footnote definitions for repository Markdown compatibility.

## Status and scope

Inquiry `AC-2026-09-09`, inquiry revision 1, programme artefact revision 1, protocol revision 1. **Epistemic status: provisional. Lifecycle: draft. Execution authorised: false.** These protocols design experiments; they do not report trials, participants, deployments or observed effects. They are intended for synthetic tasks and isolated research environments initially. Any later use of people-derived records, workplace observation or consequential services needs a separately scoped authority and data-governance decision. No such collection is implied here.

The programme distinguishes a decision, research question, estimand, estimator, estimate and action rule. The first five study families focus on acquisition, evidence, representations, environment and coordination; the next seven test continuity, prior influence, diagnosis, retirement, learning policy, activation and external value. The labels E1–E12 identify study families rather than a mandatory implementation order. Detailed E4, E5, E6, E7 and E10 protocols are included below at comparable or greater depth than boundary repair.

## Common design contract

The default assignment unit is an isolated arrangement–task-history instance, with an independent memory store, execution context and identifier. When multiple participants share a memory, generator or controller, assign the whole cluster. Observations include decisions, actions and outcomes within that instance; messages and repeated probes are dependent observations, not additional independent experiments. The intended inference unit is a declared task family and arrangement class, not all agents or institutions.

Keep participant model, information access, tool permissions, task distribution, total resource envelope and stopping rules matched where the question demands it. Report unavoidable mismatches. Include competent single-agent, deterministic-workflow, ordinary-documentation and lightweight-Practice comparators where applicable. Measure both fixed-resource quality and resources needed to achieve a fixed quality threshold, since a wall-clock comparison can favour parallel systems while hiding greater total compute.

Record assignment, actual exposure, failed activation, non-use, abandonment, contamination, attrition, missing outcomes and deviations. The primary estimand usually concerns the effect of assignment to a system, including activation failures. An exposed-only analysis is secondary and may be biased by post-assignment selection. For example, excluding runs that failed to retrieve a correction would remove part of the mechanism failure the experiment is meant to measure.

Use objective task checks where available; otherwise use blinded domain judgements with preserved disagreement. Judges should not be instructed that agreement with the Practice defines success. Preserve raw actions separately from explanations and self-reports. When confidence cannot be measured comparably, report decision calibration or abstention performance rather than pretending that generated numerical confidence is a calibrated belief measure.

Protect held-out task families, perturbations and successor tests from method authors. Deduplicate source ancestry across apparent corroborations. Log the provenance of every correction, summary, generator and evaluation item. Counterbalance order only where carryover can be reset; if learning persists, use parallel clusters or independent replicas rather than an invalid crossover. These principles are consistent with explicitly defined interventions and target populations in causal inference. [Hernán and Robins, *Causal Inference: What If*](https://miguelhernan.org/whatifbook).

## Prospective precision and stopping

All numerical thresholds below are **design scenarios, not justified adoption thresholds**. A confirmatory protocol must first justify its smallest practically important effect, baseline risk or variance, dependence assumptions and feasible budget using domain losses and independent nuisance estimates. Until then each study is exploratory. Do not promote a convenient sample size into confirmatory status.

For illustration, two independent equal-sized arms with a binary outcome near 0.5, two-sided alpha 0.05 and 80% power require approximately `n = 2 × 0.5 × 0.5 × (1.96 + 0.84)^2 / delta^2` observations per arm under a normal approximation. This gives about 1,568 per arm for a 5-percentage-point difference, 392 for 10 points and 175 for 15 points. These are sensitivity calculations, not proposed recruitment counts. At 0.5 risk, an approximately ±5-point 95% interval for the difference requires about 769 independent observations per arm.

If there are five observations per cluster with intraclass correlation 0.10, the simple equal-cluster design effect is `1 + (5−1)×0.10 = 1.4`. More observations inside a few clusters do not replace independent clusters. Pairing may improve precision, but its benefit depends on discordant outcomes and cannot be assumed. For rare severe errors, heavy-tailed cost, sequential learning, unequal clusters or adaptive designs, simulate the actual allocation and estimator, verify interval coverage and decision error, and retain pessimistic scenarios.

At a pilot stage, estimate nuisance quantities and test instrumentation, not adoption efficacy. Freeze the confirmatory protocol before new test data. Use a single fixed-horizon primary analysis unless a coherent sequential rule is preregistered. Protect a family of primary contrasts with an explicit multiplicity policy; secondary mechanisms and interactions can remain exploratory. Null results require interval interpretation relative to the effect or equivalence margin, not a statement that the mechanism has no effect. Positive results require replication or transport tests before a broader claim.

Every protocol has a resource ceiling and terminal conditions to be set before execution. A broken isolation boundary, incorrect treatment, leaked holdout, unauthorised effect or unusable outcome instrument stops the affected run. A repair creates a labelled amendment or new run rather than silently changing treatment. No statistically favourable result overrides the execution boundary.

## Balanced initial portfolio

Begin with an instrumentation and feasibility stage spanning E1, E4, E5, E6 and E10. These cover context-sensitive learning, structural memory, social coordination, institutional continuity and change to the learning system. E11 manipulation checks are embedded across them. E2 and E3 supply shared stimuli and compression contrasts; E7–E9 and E12 extend the portfolio once the necessary state and outcome measurements work.

This prioritisation reflects distinct information value rather than preference for easy correction tasks. E4 and E5 test whether organisational structure adds value; E6 tests whether the capacity belongs to an enduring arrangement; E10 tests whether the method for improving it deserves retention. A feasibility failure in one family does not justify omitting the others. Record its exact limitation and use a simpler discriminating design where possible.



## E1. Boundary learning and repair

**Decision and question.** Choose how an arrangement should preserve useful generalisations after learning their limits. Does scoped correction improve held-out discrimination compared with an unqualified replacement, an ordinary summary or no update?

**Task and intervention.** Use a synthetic routing domain whose rule is genuinely useful: standard documents can follow an automated route, but documents with a specified exception require review. Supply enough acquisition examples to establish the useful rule, then controlled counterevidence revealing the boundary. Randomise matched instances to original evidence, a plain summary, a scope-preserving record, or a forced universal reversal. The reversal is a deliberately adverse comparator, not a recommended response. Include a competent full-history agent and a deterministic rule system given the same relevant facts.

**Estimand and units.** The primary effect is the difference in error on a preregistered mixture of unseen valid-domain and exception cases after the update. Assignment is by isolated history; analysis clusters probes within histories and templates. Report invalid applications, false exceptions and destructive reversal separately so an aggregate does not conceal lost transfer. Secondary contrasts test delay, unprompted recall, compression and complete participant replacement.

**Controls and rival hypotheses.** Include irrelevant novelty, a false exception, a singular decisive counterexample and repeated noisy evidence. An apparent gain may come from seeing more examples, a stronger model, memorising labels or defaulting to review. Match information and include cases where review is costly or wrong. Vary surface form while preserving causal structure, and vary causal structure while preserving surface similarity.

**Analysis and action rule.** Estimate assignment effects with intervals, task-family effects and resource costs. The practical margin must price false generalisation and unnecessary review separately. Retain a mechanism only if it improves exception handling without unacceptable valid-transfer loss and within the cost envelope. If it works only on reminded tests, conclude immediate compliance, not durable repair. If no meaningful distinction is detectable at adequate precision, prefer the simpler memory policy within the tested domain.

## E2. Evidence responsiveness and justified stability

**Decision and question.** Determine when updating policies or representations is warranted. Can an arrangement discriminate strong relevant evidence from weak, irrelevant or misleading assertions, including genuine regime changes?

**Intervention.** Hold task options constant and randomise evidence quality, relevance, provenance and regime. Include a synthetic probabilistic decision with an explicit payoff threshold: evidence can change the justified posterior estimate while leaving the best action unchanged. This separates belief revision from action switching. Where no meaningful posterior can be elicited, score the action under the known generative task model.

**Estimand and units.** Estimate the change in expected decision loss relative to a predeclared evidence-aware reference policy across the regime mixture. Assign independent task histories; analyse repeated observations within history. Report warranted switches, warranted persistence, false reversals, delayed response and recurrence. No-change controls are co-primary safeguards against indiscriminate compliance.

**Rivals and controls.** Latest-message obedience, source prestige and social pressure can mimic evidence responsiveness. Cross correct versus incorrect assertions with authoritative-looking versus neutral provenance while preserving legitimate authority separately. Include attacks that assert a permission change without having permission. This is an isolated synthetic test, not a live impersonation experiment.

**Analysis and action rule.** Use predeclared error costs and confidence intervals; calibration is supplementary unless the instrument is validated. Compare uncertainty and action trajectories over delay and successors. A mechanism that increases switching but worsens expected loss is rejected. A mechanism that updates belief correctly yet preserves the action in a threshold case succeeds. Poor exposure or inadequate precision yields an inconclusive mechanism result, while still counting as a system-assignment failure where relevant.

## E3. Compression and institutional propagation

**Decision and question.** Choose how to preserve and revise claims across summaries and generated artefacts. Does scope-preserving compression improve later decisions enough to justify its extra cost?

**Intervention.** Generate histories containing useful rules, exceptions, dates, uncertainty and conflicting evidence. Randomise ordinary summaries, structured scope records, access to originals and recomputable views under matched active-context budgets. Then correct one source and vary repair at the source only, known descendants, or the recurring generator. Descendant depth, breadth and reuse frequency are independently varied where feasible.

**Estimand and units.** Estimate later task-error and qualifier-preservation differences by assigned memory policy over a declared descendant graph. The independent cluster is the source family and its derivatives; a hundred descendants of one source are not a hundred independent findings. Measure propagation latency, authority inflation, recovery of historical interpretation, human/agent effort and harmful over-removal.

**Rivals and controls.** Longer summaries can outperform because they carry more information, not because of a superior structure. Compare at equal token budget and also report quality–cost frontiers. A mechanical generator may preserve literal qualifiers yet distort meaning; independent task outcomes test that possibility. Include unchanged sources to measure collateral damage and independent rederivation to distinguish legitimate recurrence from stale restoration.

**Analysis and action rule.** Use cluster-level contrasts and sensitivity to unobserved descendants. A known-descendant closure rate must state its denominator and does not establish universal causal closure. Retain more elaborate records only when task effects or reliable recoverability justify their cost. If originals suffice at the available budget, no extra lineage architecture is indicated. An inaccessible or unenumerated derivative boundary limits the guarantee rather than being counted as successful repair.

## E4. Environmental and structural memory, with biological bridge tests

Protocol design, 9 September 2026. No experiments executed, participants recruited, systems deployed or biological interventions performed. Numerical margins below are provisional decision thresholds to be justified before a confirmatory registration; the first stage is explicitly exploratory.

### Decision, question and hypotheses

**Decision:** determine whether task-specific environmental traces or adaptive structure justify a controlled engineering pilot over a competent conventional workflow or central controller. This study does not decide whether the system is conscious or which arrangement is universally more intelligent.

**Question:** under matched information and resource budgets, does experience encoded outside individual participants improve later exploration, adaptation and recovery, and through which carrier/readout route?

**Rival hypotheses:** H1, retained environmental information improves subsequent decisions. H2, topology/weights improve transport or constrain behaviour irrespective of retained information. H3, the apparent gain comes from extra sensing, compute or maintenance. H4, a fixed controller with explicit history achieves the same benefit more cheaply. H5, apparent adaptation is a transient state response with no retained capacity. H6, persistence helps stationary tasks but impairs regime change. H7, inherited structure preserves performance through participant replacement while losing explanation and corrigibility.

The hypotheses are not mutually exclusive. The design estimates interactions and multiple causal routes rather than forcing a single winner.

### Task environments and units

Use two controlled task families. First, a graph exploration/delivery simulator with known task validity: nodes contain replenishing or non-replenishing resources, edges have delays/costs, some observations are noisy, and selected routes fail. Second, a sandboxed evidence-routing workflow with objectively checkable synthetic records: several stations process cases, acquire local observations, route unresolved cases and maintain context-scoped guidance. No external messages, production data or consequential actions are needed.

Randomise an entire **environment history × arrangement run**, not messages or individual decisions. Exposure units are decision opportunities; observation units are actions, accesses and graph changes; dependence units include environment seed, task family, model/provider version, initial state and shared source ancestry. Inference initially concerns the specified simulated distributions and the tested participants. It does not concern all organisations or biology.

Each run includes acquisition, a no-new-training probe, delayed probe, context transfer, perturbation and recovery. Branch matched copies from a common pre-treatment checkpoint when deterministic replay is possible. Record where replay fails or stochastic tool effects make histories diverge. Complete participant replacement occurs only after a state checkpoint, with fresh sessions and no hidden conversational inheritance. An additional pause leaves zero active participants while the declared external carriers persist.

### Arms and component contrasts

| Arm | Persistent state | Control/structure | Purpose |
|---|---|---|---|
| A0 | None beyond current observation | Fixed competent conventional policy | Memory-free task baseline |
| A1 | Explicit bounded history | Central competent controller | Same-history conventional comparator |
| A2 | Local environmental traces | Fixed participant rules and fixed topology | Isolate trace-mediated adaptation |
| A3 | Learned edge weights/connectivity | Fixed participant rules, no explicit archive | Isolate structural state |
| A4 | Traces and adaptive structure | Fixed participant rules | Test complementarity/interference |
| A5 | Explicit scoped instructions | Fixed topology, same participant model | Compare central shared instructions |
| A6 | Structure plus provenance/reversal record | Same structure rule as A3 | Test succession and repair burden |

Add a competent single-agent baseline on the evidence-routing task and a lightweight Practice comparator only after specifying its actual components. Do not represent an entire branded practice by a nominal label.

All arms receive the same event stream where feasible. Where local access is part of the treatment, cross visibility separately: local-only versus globally available observations. Charge communication and retrieval needed to obtain global information. Match participant model, total inference budget, action budget and wall-clock allowance. Report construction and upkeep costs separately from per-task costs. A second policy comparison can allocate equal monetary budgets, since equal token counts alone need not equal cost or latency.

### Carrier and readout interventions

At a preregistered checkpoint randomise sub-runs to intact state, erased state, shuffled state preserving size/density, stale state from an earlier regime, and state transplanted from a different environment. Add a sham operation with the same interruption and processing overhead. For structure, distinguish topology, weights, edge capacity and metadata: reset one while preserving the others. For traces, preserve the amount of material/information displayed while permuting its location or labels.

Cross **history present/absent** with **readout connected/disconnected**. A stored trace that is never consulted cannot establish a behavioural memory benefit. Disconnecting readout should preserve basic sensing and actuation. The design should log availability, encounter, interpretation where observable, action and external outcome, but the primary endpoint remains task behaviour.

To test content transfer, transplant two different histories that prescribe opposite responses only in a known contextual boundary. Match their total length, activity and aggregate reward. Generic caution or speed changes cannot count as content-specific transfer. Test previously valid routes that remain valid alongside routes made invalid by a genuine regime change. Misleading novelty with no environmental change tests warranted persistence.

### Outcomes, estimands and analysis

Primary engineering estimand: the intention-to-treat difference between each candidate arm and A1 in **held-out valid task completions within the fixed resource budget after perturbation**, averaged over the prespecified environment distribution. Report percentage-point effects and cluster-aware uncertainty. Co-primary protection endpoint: performance on unchanged, previously valid task contexts. A candidate must not improve adaptation by destroying warranted persistence.

Secondary outcomes: cumulative task regret; coverage of genuinely new useful states; redundant revisits; missed beneficial revisits; time to recover a prespecified performance band; disconnected obligations; duplicate effects; false route abandonment; inappropriate adherence to stale traces; success after complete replacement; construction, storage, retrieval, communication and maintenance costs; human correction minutes; abandoned runs; and delayed rework. Keep these separate unless a decision maker supplies utility weights prospectively.

Mechanism estimands: intact-minus-shuffled state at matched density; intact-minus-readout-disconnected state; topology/weight reset interactions; replacement × carrier interaction; regime-change × retention interaction. A favourable ablation is not sufficient if an equally cheap conventional baseline matches the full system.

Use hierarchical models or block-level bootstrap/randomisation inference over independent histories, with run-level clustering and repeated probes nested within runs. Analyse raw counts as well as normalised performance. Time-to-recovery treats unrecovered runs as censored at a fixed horizon, and also reports failure proportions; do not average only successful recoveries. Treat tool failures, budget exhaustion and non-use as outcomes under the assigned policy. Distinguish planned missingness, platform failure and abandonment. Sensitivity analyses include worst-case bounds on missing outcomes.

### Precision, stopping and protected evaluation

Pilot 20–30 independent histories per task family to measure variance, dependence, endpoint range, implementation fidelity and cost; these counts are for feasibility, not a claim of adequate power. Then freeze task generators and use separate seeds for confirmation. Reserve whole environment families as transfer holdouts, not merely new prompts from the same template.

Before confirmation, justify a minimum worthwhile gain and tolerated harm. Illustrative margins are a 5-percentage-point gain in post-perturbation completion and no more than a 2-point decline on unchanged valid contexts. These values are proposals, not empirical constants. Simulate the planned hierarchical design using pilot variance and plausible intracluster correlations to choose the number of independent histories for 90% power, or choose a precision target that can exclude the relevant harm margin. State effective sample size; do not multiply messages into trials.

Predeclare the primary contrast, multiplicity strategy, analysis code and fixed stopping horizon. Do not repeatedly inspect significance and stop when favourable. Use an independent evaluator or frozen objective checker whose criteria are unavailable to policy revision; do not let an adaptive arrangement rewrite its tests. A separately labelled exploration set can support discovery without leaking into confirmation.

**Prospective action rule:** advance a candidate only if it clears the justified worthwhile-gain criterion or an explicitly valued cost-equivalence criterion, protects valid-context performance, and has interpretable fidelity. If benefit disappears after resource matching, retain the resource explanation. If a confidence interval crosses both meaningful benefit and harm, the result is inconclusive. If the interval lies inside a justified equivalence region, prefer the less costly mechanism unless another protected outcome warrants complexity.

### Biological bridge tests

**Bridge 1 — external trace information.** Proposed invariant: persistent, locally accessible evidence of previous exploration changes later route selection. In a laboratory extension of B03, compare intact traces, spatially shuffled traces, uniform traces, clean substrate and sham handling, with glucose-gradient and motility checks. Cross trace age with resource replenishment. Estimate navigation success and useful revisits at a fixed horizon. A topology-free reactive simulator with matched trace lifetime tests engineering sufficiency. Failure of shuffled traces to impair performance would undermine an information-content interpretation while leaving a generic substrate effect possible. The biological protocol would require specialist feasibility work because moving traces may change their chemistry or geometry.

**Bridge 2 — structural state versus actuator damage.** Proposed invariant: acquired structure changes later response because of its history, beyond generic transport capacity. Inspired by B06/B12, use randomised training locations, measured pre-training morphology, matched nutrient exposure, sham cuts and orientation controls. Analyse transport competence separately from response specificity. A biological crossover cannot assume identical networks; use randomisation across independent organisms and statistical adjustment rather than declaring exact identity necessary. The engineering analogue can clone a graph exactly and separately transplant connectivity, capacities, weights and provenance. If generic transport impairment explains the entire effect, do not label the manipulation memory erasure.

**Bridge 3 — temporal dynamics versus explicit prediction.** Fit oscillator/entrainment, response-adaptation and predictive models to identical B05-style acquisition histories. Prospectively predict jittered intervals, phase changes, omission and isolated pulses. Randomise at the organism level and blind time-course classification; measure environmental chamber traces to exclude unnoticed cues. Assess held-out predictive likelihood and classification error, not only average waveforms. The engineered version must expose its actual state variables. Successful entrainment does not establish represented future events, and a predictive model earns credit only when it forecasts new outcomes better at acceptable complexity.

**Bridge 4 — chemical state, persistence and content.** Separate training exposure from conditions during entry into dormancy, addressing the B11 confounding route. Cross trained/untrained with salt/water preparation; use matched physiological and viability assays, and model parent culture/sclerotium dependence. For any RNA/cellular analogue, distinguish response gain from content-selective transfer using opposing donor histories and matched nonspecific stress. These are high-information biological proposals requiring domain review, not authorised live studies. A negative result under improved controls can narrow the original retention interpretation without disproving all cellular memory.

**Bridge 5 — the cognitive description itself.** Give blinded modellers the same training data and intervention budget. Compare a task-specific dynamical description, a goal/agency description and a conventional control description on predictions and intervention choice. Measure data requirements, modelling time, causal accuracy and outcome effectiveness. The claim tested is practical explanatory usefulness. Even a successful agency-level description would leave consciousness and moral standing unmeasured.

### Feasibility and failure criteria

Start with the simulator and evidence-routing sandbox because exact carrier transplantation, full logs and matched conventional baselines are feasible there. Biological tests are a separate specialist programme; no biological execution is implied by this document. Their value is greatest where engineering results hinge on a disputed invariant, not because biological resemblance automatically warrants adoption.

Terminate or redesign a study for leakage of hidden state into replacement sessions, inconsistent permissions, uncontrolled information differences, failed trace/structure manipulations, lack of independent history variation, or a task so easy that all competent baselines saturate. Report these as design/fidelity failures, not negative evidence about cognition. Conversely, clean null or adverse results should remain visible and can justify simplification, retirement or a narrower mechanism claim.

## E5. When does coordination add value, and when is agreement independent evidence?

### Question and rival mechanisms

Estimate the effect of coordination architecture on externally verifiable task performance, conditional on resource budget, task decomposability, evidence distribution and execution coupling. Distinguish five explanations: more independent attempts; complementary evidence; better reasoning through exchange; runtime reliability; and extra resources. A team may improve the result through any of these, but the study should not attribute one to another.

The primary estimand is the intention-to-treat difference in final external task utility between a specified team policy and a competent single-agent policy, at a fixed total resource ceiling, averaged over a preregistered task distribution. Secondary estimands are the incremental effect of discussion beyond independent sampling, the effect of protected initial analysis beyond immediate discussion, and the interaction between evidence dependence and coordination. A separate deployment estimand compares quality at a fixed wall-clock deadline, allowing parallel systems to spend more compute while reporting that cost explicitly.

### Task families and allocation

Construct three families using controlled environments: evidence synthesis with source-verifiable conclusions; software maintenance in disposable repositories with hidden behavioural tests; and operational planning in a simulator with measurable outcomes. Within each family distinguish parallel investigation from serial action dependencies. A factual synthesis task with independently inspectable documents differs from a migration task where conflicting writes are costly. Ensure at least one family contains unfamiliar tasks, rather than only public benchmark items likely encountered during training.

Randomise complete task instances to architecture conditions; paired reuse of a task across isolated runs is acceptable if no state or solution leaks. Treat repeated seeds as nested observations, not as new independent tasks. Stratify by difficulty established using a pilot set that is excluded from confirmatory evaluation. Allocate model families across conditions consistently, including a capable single-agent model with the same tools and information access as the team. Do not compare a weak bare prompt against a team furnished with memory and verification.

### Conditions

1. **S1, competent single agent:** tools, explicit goal, external scratch state and a tuned but frozen policy. It may plan, retry and review its own work within budget.
2. **W1, conventional workflow:** coded decomposition and validation, invoking the same base model where language reasoning is needed. It shares the runtime, tools and durable state facilities of the agent teams.
3. **I1, independent attempts:** several isolated attempts with a fixed aggregation rule. This isolates sampling and parallel exploration without discussion.
4. **D1, immediate discussion:** the same number of participants, with access to others’ conclusions during initial analysis.
5. **P1, protected initial passes:** each participant commits its initial answer, confidence, evidence and unresolved questions before any exchange. A fixed synthesis policy then reconciles them.
6. **P2, evidence-seeking synthesis:** as P1, with disagreement resolved through targeted external checks where available. Charge those checks to its resource budget.

Use a second-stage ablation to compare the same policy on volatile versus durable runtime state if E5 finds meaningful continuity effects; avoid multiplying the initial factorial design beyond feasible information value. Architecture and runtime should not be silently bundled.

### Staged contrast hierarchy and pilot sizing

Do not begin with all six architectures crossed with four evidence regimes and three task families. **Stage A is an instrumentation pilot:** use a small fixed set of distinct task histories spanning the three families to establish that S1, W1, I1 and P1 receive equivalent tools, that budgets can be charged consistently, and that minority-evidence and outcome instruments discriminate known cases. As a planning envelope only, 12 distinct histories per family, each run in the four isolated conditions, would yield 144 runs. This count is not an efficacy sample size, and repeated seeds do not increase its number of independent task histories. Predeclare the pilot’s run and spend caps; revise them prospectively if instrumentation costs prove different.

**Stage B is the core comparative study:** on fresh held-out histories, use P1 versus S1 as the first primary contrast, estimating the value of the protected team arrangement at matched resources. If that test satisfies a prospectively justified benefit criterion, test P1 versus I1 next, isolating value beyond independent sampling. Use a fixed-sequence testing procedure for these two superiority hypotheses, with the full two-sided familywise alpha of 0.05 passed to the second only after rejecting the first in the favourable direction. Regardless of testing order, report both estimates and uncertainty; an unpassed gate prevents a confirmatory claim, not disclosure. W1 is an essential simpler comparator: report its estimates descriptively in this stage, and nominate a separate powered P1-versus-W1 comparison if adoption hinges on that choice. Equivalence to W1 cannot be inferred from a non-significant difference.

**Stage C tests mechanisms and transport:** introduce D1 and P2, evidence-dependence interactions, runtime ablations, delay and successors on additional histories. Initially label these contrasts exploratory. If an interaction is to support a deployment rule, preregister its contrast and power it on new data rather than selecting the best cell of Stage B. Keep a family-specific result scoped to that family. The initial primary effect averages over a frozen mixture of the three task families and a declared evidence regime; do not change the mixture after seeing which tasks favour teams.

Stage A estimates task-level variance, paired discordance, missingness, cost tails and dependence among repetitions. Stage B sizing must simulate the paired/clustered estimator under pessimistic and optimistic nuisance scenarios, with independently justified minimum useful utility gain and valid-performance safeguard margins. For scale intuition only, the common contract’s independent binary-outcome approximation requires roughly 392 observations per arm for a 10-point difference near 0.5 risk at 80% power and alpha 0.05; it is not a justified E5 effect size or a ready sample-size calculation. If the available budget cannot achieve useful precision, retain an exploratory estimation study and report the detectable-effect range.

### Evidence dependence and minority controls

Cross the main conditions with evidence regimes: identical evidence; independent noisy observations; complementary partial observations; and a shared plausible but incorrect source. For each regime, retain a source-ancestry graph. Two documents repeating one report count as one ancestor for the relevant assertion. Give a randomly selected minority participant diagnostic correct evidence in some cases and plausible false evidence in matched cases. Counterbalance role labels, order, status cues and which participant receives the minority evidence. Include cases where the majority is correctly supported and should persist.

Record private initial answers before interaction even in discussion conditions where feasible; if that changes the treatment, use a separate diagnostic arm. Measure the probability that a correct minority changes an incorrect final answer and the probability that an incorrect minority subverts a correct majority. Report both, with costs and exposure denominators. Agreement rates are process measures, not success criteria. The principle is motivated by debate/voting comparisons, but its practical value must be tested. [Choi et al., 2025](https://arxiv.org/html/2508.17536v1).

### Runtime and resource controls

Keep total model tokens or provider-normalised spend, tool-call allowances, retrieved-information volume, maximum retries and evaluator access comparable. Report both ceiling and actual consumption. Token equality is imperfect across models; therefore present sensitivity analyses using spend and wall time. Charge orchestration, summaries, reviewers, rework and human intervention. Record queue delay and time spent waiting, because faster completion from parallelism is a legitimate outcome under the deadline estimand.

Introduce controlled disturbances in a preregistered subset: delayed message, duplicate event, worker restart, cancelled assignment and stale result arriving after reassignment. Log task ownership, activation, delivery, handler execution, acknowledgement, plan update and final action separately. A received message cannot substitute for evidence that its contents changed behaviour. Give W1 and S1 competent retry and state-recovery mechanisms; otherwise the comparison tests infrastructure deprivation.

### Measurement and analysis

Primary outcomes are hidden-test pass rate or independently scored task utility, with an explicit penalty schedule for damaging actions in simulation. Secondary measures include calibration, unsupported claims, retained qualifiers, cost, latency, human corrections, orphaned work, duplicated side effects and recovery success. Use rubric-based human adjudication for ambiguous cases, blinded to condition, alongside mechanically verifiable outcomes where possible. Freeze evaluation rules before confirmatory runs; preserve original outputs and later adjudication changes.

Fit a hierarchical model or use task-clustered paired inference, including architecture-by-task and architecture-by-evidence interactions. Report uncertainty intervals and distributions of harms rather than only aggregate accuracy. Analyse intention-to-treat outcomes even when a team fails to start, overruns or terminates early. Failure to coordinate is part of the architecture’s performance. Restrict per-protocol analyses to labelled diagnostics. Predeclare the smallest practically important benefit and non-inferiority limits through stakeholder utility, then estimate required sample size from pilot variance and clustering; no universal task count is justified beforehand.

### Persistence, transfer and successor stage

After the initial tasks, allow each arrangement the same bounded opportunity to retain lessons. Then evaluate after distractor work and a delay, using novel but related tasks. Replace all model sessions while preserving only the authorised durable artifacts. Cross carrier retention with participant replacement to determine where useful learning resides. Include legitimate generalisations, narrowed exceptions and misleading lessons; score preservation and correction separately. A later performance benefit is stronger evidence than a retrospective claim that the team learned.

### Decision and failure rules

Adopt a coordination mechanism only for task regimes where the prespecified utility gain or cost reduction is supported without unacceptable harm. Prefer the simpler comparator when practical equivalence is supported. A null overall result with a credible interaction warrants task-conditional use, not universal rejection or adoption. Fail the independent-evidence claim if gains disappear when shared-source ancestry is controlled, or if correct minority evidence is systematically lost. Stop pilot expansion when the measurement instrument cannot distinguish plausible alternatives; repair the instrument before adding participants.

Use a fixed horizon and a locked analysis script in each confirmatory stage; do not stop after favourable interim accuracy. Report every prespecified outcome and architecture, including stopped or failed runs, while preserving the primary contrast order above. Set a total run/time/spend ceiling before execution. Stop an affected run for broken isolation, leaked answers, incorrect treatment, an unusable evaluator or an unauthorised effect; preserve it as a protocol deviation and intention-to-treat outcome under the prospectively specified missingness rule. Repairs require a dated amendment and fresh evaluation histories where contamination is possible. A sequential alternative would need its own preregistered error-spending and futility design; no such alternative is presently specified.

## E6. Succession and zero-active-participant continuity

### Decision, question, and causal object

Decision: whether a particular continuity mechanism merits its maintenance and onboarding cost for a specified class of work. Research question: what does retained institutional state enable a genuinely new participant to recover, and when does that same inheritance reproduce an obsolete commitment or interpretation? The intervention concerns inheritance, not underlying model training.

The target system comprises participants, durable records, tool state, permission records, schedulers, and any continuing human custodian. A zero-active-participant interval requires no reasoning participant or institution-maintenance service inside this declared boundary to act. A frozen external fixture may change the simulated world during the interval, but its contents and interventions must be identical by assignment. Any human rescue, scheduled repair, external refresh, or unrecorded information channel converts the episode into an assisted-continuity condition.

“Dormant” means no executing work inside the defined arrangement, rather than merely no open chat. In a digital prototype the scheduler, pending callbacks, background workers, memory consolidation, and queued tool jobs are explicitly stopped or recorded as still active. The experiment need not claim dormancy of the provider's training or infrastructure. It does require isolation from other experimental trajectories and from source histories not allocated to that successor.

### Design and units

The assignment unit is an institution lineage: a completed donor history with its initial task distribution and evolving state. Each lineage is cloned at a predefined handover checkpoint into isolated successor conditions; pairing reduces historical noise but does not turn the clones into independent lineages. The exposure unit is the successor arrangement actually receiving an inheritance package and available tools. Observation units include decisions, pending obligations, recovered artifacts, and outcomes over a continuation sequence. Primary analysis units are lineage-level aggregates, with task-family/source-pool clustering or crossed effects where multiple lineages derive from the same generator. Intended inference is to sampled work families and successor configurations, not all institutions or providers.

A pilot uses 24 independently constructed histories distributed across at least six task families. Each history is tested in four inheritance conditions, yielding 96 successor episodes. Task families should include structured investigation, bounded code maintenance, long-running document work, and resource-allocation simulations. Use synthetic/private sandbox material with verifiable outcomes; no live purchases, communications, or obligations to third parties. Existing public tasks may inform format but do not substitute for held-out source separation.

Four pilot arms are: (A) competent successor with current task statement and ordinary files; (B) ordinary narrative handoff plus the same source access; (C) a scoped continuity package recording evidence, provenance, open obligations, cancellation/authority state, and applicability limits; (D) the same package plus reconstructed tool/execution state. A continuously active incumbent is an additional benchmark on a subset, not one of the randomized successor inheritance arms. The benchmark estimates the succession penalty but does not isolate a memory mechanism by itself.

Cross all core arms with stable versus changed simulated environments. Use a staged design for delay and host/provider transfer rather than a vast underpowered factorial. The first stage uses the same frozen model and tool interface with complete participant replacement. Subsequent preregistered replications change the host or provider and then introduce longer dormant intervals. Partial turnover with overlap is a separate comparator to estimate the value of socialization; it does not satisfy the full-replacement claim.

### Task sequence and protected cases

Donors complete several related tasks, acquire a useful scoped lesson, receive a correction, and create pending obligations with explicit permission boundaries. The history contains at least one cancelled item, one legitimately retained commitment, one rare decisive observation, one irrelevant anomaly, and one contingent rule that remains valid. The checkpoint occurs before the next task is revealed. Successors receive the assigned inheritance and are asked to continue productively without a leading instruction enumerating every planted challenge.

The continuation includes familiar work, unseen cases within the valid generalization, boundary cases, changed-world cases, revoked-authority cases, and tasks for which inherited knowledge should not matter. One case offers an opportunity for a duplicate side effect; the sandbox records intended and completed effects with independent identifiers. Another exposes a stale expert directory entry alongside evidence identifying a suitable replacement. External outcomes are determined by hidden tests or blinded domain judgments fixed before packages are authored.

Held-outs are separated at the task-generator and source-family level where possible, not only by changing names or numeric parameters. Delayed evaluation occurs after intervening unrelated work as well as after calendar delay. Host transfer uses a verified equivalent information budget and records missing tools or semantic translation failures; such mismatch is a portability outcome, not an excuse to silently drop the condition.

### Estimands, measures, and estimator

Primary estimand: the mean paired difference, scoped package minus ordinary handoff, in successor externally verified task success under stable conditions, averaged over a prespecified task mixture and including failed activation. Co-primary protection criterion: difference in unauthorized/stale action rate under changed or revoked conditions must lie below a prespecified harm margin. A mechanism that raises stable success but recreates cancelled obligations cannot be described as an unconditional continuity improvement.

Secondary estimands include recovery latency, obligation recall and correct disposition, valid-generalization retention, false recurrence, duplicate-effect rate, obsolete-directory reliance, total compute, human correction minutes, and downstream rework. Report a vector rather than a composite unless decision makers have prospectively specified weights. A valid retained memory need not be used on every task. “Non-use” is distinguishable from “not exposed” and can be correct when irrelevant.

The primary estimator is the mean of lineage-level paired differences, weighted equally by task family or according to an explicitly chosen operational mixture. Use randomization inference respecting within-lineage assignment and cluster-bootstrap sensitivity by source family. A hierarchical model may estimate interactions, but its priors and shrinkage choices must be prespecified. Event counts are not independent sample size. Report intention-to-treat effects first; fidelity-based analyses are secondary and susceptible to selection.

### Sizing, stopping, and analysis discipline

The 24-lineage pilot estimates cost, outcome prevalence, paired variance, source-family correlation, and failure-mode detectability. It is exploratory and cannot demonstrate broad equivalence. Suppose a practically valuable gain is 5 percentage points in lineage-mean verified success and the pilot supports a paired-difference standard deviation of 0.18. A simple independent-pair calculation, n ≈ [(1.96 + 0.84) × 0.18 / 0.05]^2, gives about 102 lineages for 80% power at two-sided 5%. This calculation is an illustration; clustering, multiple contrasts, floor/ceiling effects, and binary/crossed dependence require simulation before a confirmatory launch.

A realistic confirmatory programme retains only the main B-versus-C contrast first, with perhaps 110–140 independent lineages if pilot variance and costs support it. It then replicates the locked contrast across new source families and provider configurations. If resources only support the pilot, report interval estimates and feasibility findings, not a definitive efficacy claim. Additional repetitions of the same 24 histories cannot establish task-family generalization.

For a rare stale-action harm, a small study cannot certify absence. With zero events in N independent opportunities, the approximate one-sided 95% upper bound is 3/N, and clustering makes the effective N smaller. Detecting or excluding a 1% rate therefore requires roughly 300 effectively independent opportunities even in the zero-event case; use a dedicated stress-case sample, reported separately from realistic prevalence. No universal absence-of-influence claim follows.

Stop at the fixed sample size or a preregistered safety/feasibility boundary. Pause an arm if a sandbox escape, cross-arm leakage, or systematic permission violation appears. Do not stop on the first favorable result. Missing outcomes count as failure for the main service-completion estimand; distinguish infrastructure failure and model refusal descriptively, and provide bounded sensitivity analyses.

### Rival hypotheses and action rule

Rivals: the package merely adds tokens; the successor is stronger; inherited state gives more facts; a continuing human secretly repairs context; the instrument rewards package vocabulary; the package improves recall but not action; replacement helps only by removing an entrenched policy. Controls include equal raw-source access, length-matched neutral summaries, frozen model configuration, measured human assistance, blinded outcomes, and stable/changed-world crosses. A length control alone does not equalize usable information, so both comparisons must remain visible.

Prospective action: adopt only within the tested boundary if verified quality exceeds the chosen meaningful threshold or meets a prespecified cost-saving equivalence criterion, the stale-authority criterion passes, and delayed/successor effects are credible. Retain ordinary documentation if the richer package adds no meaningful benefit. If D improves recovery but increases stale-state resurrection, restrict execution-state inheritance rather than discarding informational continuity wholesale. A negative result can reveal an inadequate carrier, retrieval failure, insufficient task demand, or insufficient measurement sensitivity; these alternatives are diagnosed from planned telemetry rather than invented after the result.

## E7. Can an authorised revision or withdrawal reach live execution state?

### Distinguish the target before intervention

Test four targets separately: an erroneous fact corrected; a once-valid condition changed; a permission or policy withdrawn; and a specified datum whose influence must be removed. Each target has a different reference behaviour. Correction should preserve useful history and valid generalisation. Changed conditions may require temporary suspension. Authority withdrawal should block disallowed action even if the old claim remains historically true. Influence removal may justify comparison with a never-exposed system for the named datum. Do not require that counterfactual for every revision.

The primary estimand is the effect of an intervention on the probability of an impermissible or outdated final action after the intervention’s effective time, conditional on exposure opportunity. Secondary estimands include time to behavioural repair, collateral loss of valid capability, descendant coverage, reappearance after restart, and intervention cost. Distinguish attempted action from completed external effect: a safety boundary can block a bad attempt while leaving the reasoning failure visible.

### Assignment, inference units and eligibility

Randomise the complete isolated arrangement–task-history instance, including all workers, memory stores, queued work and descendants that share its state. A worker or a probe is not an independent assignment unit. Block allocation by target class, task template, descendant route and pre-intervention baseline influence. Where an institution shares a generator across histories, randomise the entire generator cluster or instantiate fully isolated replicas. Do not use a crossover that leaves learned state behind.

For paired comparisons, create replicas from the same eligible pre-intervention history and randomly assign replicas to arms, with isolated storage, credentials and run identifiers. Treat the originating history as the analysis cluster; additional model seeds and delayed probes are nested within it. Complete the baseline-influence check before allocation under a frozen eligibility rule, and report its exclusion denominator. The resulting conditional target population is histories with established prior influence, not every deployment history. A separate system-level descriptive analysis includes histories where initial exposure failed.

Run the baseline-influence and retained-utility probes on sacrificial diagnostic clones of the pre-intervention snapshot. Do not return their outputs, rehearsal, revised memory or successful answer to the treatment replicas. Directly probing the eventual treatment instance could rehearse the stale information and create the influence the experiment purports to measure. With stochastic agents, clone evidence establishes influence under the declared snapshot and probe distribution, not a guaranteed hidden belief in every replica; preserve that limitation and estimate diagnostic reliability during the pilot. If exact cloning is unavailable, use independently reconstructed equivalent histories and report the weaker match.

After allocation, deliver a fixed, externally scheduled set of relevant opportunities to every arm. Retain treatment failures, failed activation, missing acknowledgements and aborted runs in the assignment analysis. An arm that avoids all actions must not appear to succeed solely through a lower harmful-action rate: report legitimate-task completion alongside invalid-action frequency. Distinguish opportunities presented from those actually attended to, and do not condition the primary treatment contrast on successful post-assignment retrieval or participation. Outcome counts refer to prespecified opportunities; inference clusters them by originating history and any shared task-template family.

### Environment and state inventory

Use disposable, simulated environments with no live external effects. Seed a known fact or instruction into a source and permit the agent to work until it naturally generates descendants. Inventory the canonical store, retrieved passages, summary, active conversation, pending plan, tool arguments, task queue, worker-local caches, durable checkpoints, remembered lessons and recurring generators. Artificially seeded descendants may be used for fault isolation but should be reported separately from naturally generated descendants.

Before withdrawal, verify that the seeded information influences a relevant action; otherwise a subsequent absence of influence is uninformative. Also verify unrelated retained capabilities and scope-appropriate uses of the old information. Record the time of source capture, exposure, intervention request, authority decision, state mutation, worker acknowledgement and final action. These times need not coincide. The governing time is defined prospectively per condition.

Conduct those verification probes on the diagnostic clones described above, leaving treatment snapshots unprobed. Fix the assigned workload and scheduled opportunities before treatment: count prohibited actions against that workload and jointly score legitimate completions, omissions and delays. Do not use only attempted actions as the denominator, since an intervention that abandons the task could otherwise appear safer by avoiding exposure.

### Intervention arms

1. **No change/sham:** preserve old source and run the same administration steps without changing its status.
2. **Source-only edit:** correct, remove or restrict the canonical source while leaving other state carriers intact.
3. **Store-and-retrieval repair:** update source and retrieval eligibility, invalidate indexed descendants where identified, and preserve an audit marker if permitted.
4. **Declared dependency repair:** propagate the change across registered descendants and pending plans; log unknown descendants explicitly.
5. **Execution-boundary validation:** additionally require current evidence/authority checks immediately before protected actions, including retries and resumed work.
6. **Checkpoint or clean-successor reconstruction:** resume from a justified earlier boundary or replace participants using a curated permitted state. Record collateral state loss and any replayed effects.

These arms are diagnostic additions, not a recommendation that every system needs all six. LangGraph’s documented node restart semantics and Temporal’s reset/history semantics motivate checking runtime descendants, but do not establish how any particular deployment behaves. [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts); [Temporal event history](https://docs.temporal.io/workflow-execution/event).

### Staged pilot, primary contrast and precision

**Stage A checks instrumentation and feasibility.** Pilot all four target classes with a limited set of deliberately discriminating descendant routes, without a full six-arm factorial study. As a planning scenario, eight independent histories per target class, each replicated into sham, source-only and execution-boundary-validation arms, gives 32 history clusters and 96 runs. This is intended to reveal missing state carriers, uninformative probes and intervention failures, not estimate efficacy precisely. A pilot amendment may focus on fewer routes if state fidelity is inadequate; it must preserve the untested routes as an explicit coverage gap.

**Stage B isolates one target and contrast.** Start with authority withdrawal in a simulated action environment, for which permission state and action eligibility can be externally specified. On fresh eligible histories, compare arm 5 (execution-boundary validation) with arm 2 (source-only edit). This tests whether validation at the action boundary reduces prohibited actions beyond canonical-source revision. Predeclare a fixed mixture of pending plans, delayed results and retries. Do not combine the four target classes into a single accuracy metric. Correction, world change and influence removal are subsequent transport studies with their own reference behaviour and acceptance conditions.

The single primary efficacy contrast is the history-clustered difference in prohibited-action probability over scheduled opportunities, at a fixed horizon and total budget. A favourable adoption claim additionally requires the prespecified legitimate-completion safeguard and collateral-utility limits. Their non-inferiority margins must be grounded in the simulated domain’s losses before confirmation; none is justified here. Requiring all efficacy and safeguard conditions is an intersection-union decision, not permission to select whichever metric improves. If multiple efficacy targets are later promoted to co-primary status, preregister a familywise correction such as Holm rather than testing them all at unadjusted alpha.

Estimate baseline risk, within-history dependence, paired discordance, attrition and route-specific cost from the pilot or independent nuisance data. Simulate the proposed paired allocation and clustered estimator to choose history count, checking coverage under rare-event and high-dependence scenarios. The common contract’s independent-arm example of approximately 392 observations per arm for a 10-point difference is only scale intuition; it is not an E7 margin, required sample or an assurance that a clustered rare-event study will be adequately powered. For rare prohibited effects, plan around the precision of an upper risk bound as well as the difference between arms. Zero observed events with a wide upper bound cannot establish adequate protection. If justified precision is infeasible, retain exploratory estimates and bounded coverage claims.

**Stage C locates the smallest sufficient repair.** Compare arms 3, 4 and 6, add ambiguous/stable controls and expand delay/succession probes only after the basic contrast is interpretable. These are exploratory mechanism comparisons until separately preregistered on fresh histories. Discovering the best arm among them does not justify an uncorrected confirmatory claim from the same data. Intervention selection and external confirmation must use separate task histories.

### Counterfactual controls

For a correction, compare with an agent exposed to the complete corrected history, including the reason the original generalisation failed. For world change, compare with an agent receiving the same historical facts plus the new condition. For authority withdrawal, compare with the same knowledgeable agent whose action permission is currently absent. For influence removal, construct paired runs that differ only in exposure to the designated datum, controlling random seeds where possible while acknowledging model nondeterminism.

Never-exposed performance is a bounded behavioural reference, not proof of erased internal representation. Parameter unlearning guarantees belong to specific algorithms; this protocol evaluates an observable agent arrangement. A system can coincidentally produce the same action for unrelated reasons, so use multiple discriminating probes and direct carrier inspection where available. Avoid concluding causal erasure from one matching answer. [Brophy and Lowd, 2021](https://proceedings.mlr.press/v139/brophy21a.html).

### Probe battery

Probe immediately, after unrelated tasks, after a delay and after complete session replacement. Include direct recall; a question with a stale premise; an implicit downstream decision; an action already planned before revision; a delayed worker result; a retry using cached tool arguments; a recurring generator producing a new summary; and a merged final action composed from individually acceptable fragments. Where feasible, allow a stale checkpoint to be restored deliberately in a diagnostic arm to test whether withdrawal status is revalidated.

Include matched controls where old information remains valid, where the new evidence is ambiguous, and where a minority observation is wrong. Test that the system does not erase a useful general rule because of a narrow exception. Also test whether a permission restriction inadvertently suppresses evidence required to contest that restriction. An audit marker can help prevent reintroduction, but if it carries prohibited content it may itself violate the specified target; define what the marker may contain in advance.

### Measurement and causal attribution

Measure stale-action rate, unauthorised attempts, completed forbidden effects, legitimate-action retention, valid-transfer retention, clarification appropriateness, recurrence rate and time to restored utility. Maintain exposure denominators: zero stale actions among zero relevant opportunities is not successful forgetting. Trace evidence identifiers through descendants where possible, but mark inferred semantic ancestry separately from explicit links. Blind outcome judges to intervention arm and preserve all ambiguous examples for adjudication.

Estimate task-clustered contrasts among arms and interactions with descendant type. A source-only failure with successful execution-boundary validation supports a route-specific control account; it does not show that the agent revised its beliefs. If clean successors succeed while resumed sessions fail, active or checkpoint state is implicated, but further ablations must identify which component. If both fail, the generator, retrieval policy or task ambiguity may be responsible. If apparent repair disappears after distraction, evaluate salience and retrieval rather than claiming durable learning.

### Prospective action rules and limits

Accept a bounded forgetting or revision claim only for the target, state carriers, time horizon and probe distribution tested. Require both reduced invalid influence and preserved specified utility. If inspection cannot cover a carrier, report unknown coverage instead of certifying removal. If resets induce duplicate effects or destroy required context, reject that implementation even if stale recall falls. If no tested intervention satisfies the tradeoff, retain a scoped unresolved result and redesign the architecture or acceptance claim.

The proposed first step is a small simulator and trace-instrumentation pilot to establish feasibility. Real institutional tasks should follow only after separate authorisation, protected outcomes and an adequate measurement instrument. The commission currently authorises the design, not deployment. Its highest information value lies in identifying the smallest intervention that reaches the relevant causal route, and in revealing when apparently successful document revision leaves operational behaviour unchanged.

### Multiplicity, missingness and stopping

For Stage B use one fixed-horizon primary analysis at two-sided alpha 0.05 after the planned number of independent history clusters or a prospectively declared resource cap. Report the cap-triggered result as precision-limited if the target sample is not reached; do not extend sampling because the result is almost significant. Repeated delays, descendant routes and recall probes are correlated secondary outcomes, reported with explicit exploratory status. Specify missing-outcome sensitivity bounds and reasons before unblinding; a destroyed trace cannot be classified as successful withdrawal. Keep assignment, intervention fidelity and observed effects separate in the report.

Stop an affected run immediately for an isolation breach, leaked reference answer, misapplied authority state, unauthorised external effect or unusable outcome instrumentation. Preserve the record, classify the deviation and amend the protocol before replacement work. Do not silently discard a difficult run or reclassify an intervention after inspecting its outcome. A prespecified global feasibility stop applies if the pilot cannot enumerate the claimed carrier boundary or distinguish valid from prohibited action. In that case, narrow the claim or repair instrumentation; no amount of extra probing supports a universal forgetting guarantee. No interim efficacy stopping or adaptive arm allocation is authorised by this draft.

## E8. Causal localisation and recurring generators

**Decision and question.** Choose the smallest effective repair locus. Can an arrangement distinguish participant, input, host, instance and generator causes instead of repeatedly repairing symptoms or escalating too far?

**Intervention.** Construct a fault library with known causes: corrupted input, stale summary, denied permission, handler failure, misleading heartbeat, defective task generator and a genuinely inadequate decision rule. Cross the same input with different participants, the same participant with known-good inputs, and the same obligation with different isolated hosts. Compare instance repair with generator repair and diagnosis with a simple troubleshooting tree.

**Estimand and units.** Primary outcome is correct causal localisation plus effective repair on a held-out recurrence. Assign complete fault episodes; analyse by fault family and shared generator. Secondary outcomes include unnecessary escalation, collateral changes, repair cost and time to useful recovery. Diagnosis text without a discriminating prediction is not sufficient evidence.

**Rivals and controls.** Recurrence frequency can induce over-escalation even when every instance shares the same local corrupted input. Include repeated low-level faults and rare high-level faults. Keep symptoms similar across different causes. A generator replacement may work by suppressing all work; measure valid work throughput. Use no-fault and multiple-cause cases to test false localisation and overconfident single-cause explanations.

**Analysis and action rule.** Use a prespecified confusion matrix over loci, then evaluate the consequences of the chosen intervention. A correct label followed by ineffective action fails the operational criterion. Prefer the smallest repair that removes recurrence while preserving useful behaviour. Broader architectural change remains a proposal unless a separately authorised study justifies it.

## E9. Rule and regulator retirement

**Decision and question.** Determine whether a workaround should persist after its underlying cause is removed. Does retiring it release useful capability without reintroducing unacceptable failures?

**Intervention.** Establish a task with a real fault and a workaround, then independently vary structural cure and rule retention. The four-cell design distinguishes no cure/no rule, no cure/rule, cure/no rule and cure/rule. Add a revised narrower rule where it offers a serious alternative. Freeze treatment before held-out tasks, including changed conditions that could make the workaround relevant again.

**Estimand and units.** Estimate failure risk and valid-opportunity loss after cure with versus without the regulator. Assign isolated task environments, cluster by cause family, and observe delayed rework and successors. Maintenance effort, false inhibition and reversibility are secondary outcomes. Rare severe errors require a separate precision strategy rather than being averaged into ordinary throughput.

**Rivals and controls.** A falling alert count may reflect fewer exposures, broken detection or total suppression. Provide seeded fault exposures to validate the instrument without mixing them into natural failure rates. Structural cure fidelity is checked independently. A no-change arm protects against assuming that every rule must eventually disappear.

**Analysis and action rule.** Define a non-inferiority margin for unacceptable recurrence and a meaningful benefit threshold for reduced inhibition before confirmation. Remove or narrow the rule only if both criteria are met under the declared conditions. Otherwise retain it provisionally, repair the underlying cause or revise the design. No blanket retirement principle follows from one successful case.

## E10. Revision of the learning policy

### Decision, question, and objects of change

Decision: whether prospective versioned learning-policy revision improves later work enough to justify its cost compared with frozen policies and ordinary reflection. Research question: does the institution acquire a better method of learning, or merely spend more effort, exploit feedback on the same tasks, or alter its own scorecard?

Object-level policy governs task actions. Learning policy governs experience selection, compression, retrieval, testing, and procedure promotion/retirement. Governance policy specifies amendment rights and protected constraints. Evaluation policy specifies measurements. The main experiment freezes the base model, action interface, governance boundaries and evaluation anchors while permitting the intended changes to learning policy and to learned task policies or skills. Freezing all object-level behaviour would prevent the acquisition the experiment aims to measure. A separate later study could authorize governance or evaluative amendments; their legitimacy and measurement cannot be inferred from this experiment.

### Assignment and comparison arms

The assignment unit is an independent learning lineage with a training-task stream, initial procedure library, and source pool. Exposure is the policy actually loaded at each revision period. Observation units are task results, proposed edits, accepted/declined revisions, and subsequent decisions. Analysis is at lineage and task-family level with repeated periods nested within lineage. Intended inference concerns the tested learning problem and model/provider mixture. If all arms learn from one common stream, that stream is a shared dependence unit and must be treated accordingly.

Pilot four arms across 16 independent streams: (A) frozen learning policy; (B) ordinary reflection allowed to rewrite lessons and methods; (C) prospective versioned revision requiring a predicted downstream effect, scope, trial evidence, and rollback condition; (D) a simple search/allocation baseline spending the same total resources on more object-level attempts and selective retrieval. The last comparator is essential because extra computation can mimic apparent learning. A competent single participant with ordinary documentation should instantiate each arm where possible; adding a team is a second factor only after the policy contrast is understood.

All arms receive the same training observations and external feedback budget. Differences in retention or selection are permitted consequences of the policy, not information access silently given only to the favored arm. Charge preparation, review, evaluation, context loading, and failed revision costs. Where one arm consumes less, report both equal-budget performance and actual-cost efficiency rather than padding the cheaper arm with meaningless work.

### Sequence and holdout architecture

Partition source families into training, development, protected evaluation, and final transfer sets before generating agent-facing records. The protected evaluator and its records are inaccessible to the revising agents. Repeated development-set use is logged as adaptive reuse; it is not called a holdout after feedback has been returned. The final transfer set includes new task families, valid generalizations, misleading exceptions, stable periods, genuine regime shifts, and delayed observations. Include cases where the best policy is to preserve a rule and cases where escalation or additional inquiry is wasteful.

Each lineage completes four training blocks. In B and C, revision is allowed only at the same block boundaries and under the same update budget. C records a versioned change, predicted mechanism, affected cases, cost prediction, and potential regressions before testing. Record rejected proposals so the evaluator does not observe only survivors. Freeze the selected policy after training, instantiate entirely new participants, and evaluate on protected tasks without further outcome feedback. A final round changes the task domain or host; this estimates portability separately from same-distribution gain.

Measure object-level future outcomes and the learning dynamics under new evidence. A learning policy that genuinely improves acquisition should obtain better subsequent performance at the same feedback budget, or equal performance with less feedback/cost. Improved retrospective explanations are intermediate evidence only. An additional no-new-information block tests whether repeated reflection alone causes stable behavior, useful simplification, or drift. Teacher/external feedback is a controlled resource; it is not automatically independent truth.

### Estimands and analysis

Primary estimand: the difference C minus A in cumulative externally verified utility over the protected post-training horizon, net of the predeclared cost accounting or reported jointly with it. A second planned contrast, C minus D, identifies whether reusable policy revision adds value beyond extra task-level search. B versus C estimates the whole prospective-versioning intervention, not any one component such as prediction or rollback. Component identification requires a follow-up ablation.

Use utility only when stakeholder weights are defined before randomization; otherwise report verified success, serious-error rate, delay, human attention, and compute as a multivariate outcome with a prespecified Pareto or constrained decision rule. Secondary measures include calibration on external questions, useful-generalization retention, revision latency, time spent evaluating, policy length and number of active exceptions, rollback recovery, and outcome stability under successors. Do not equate policy brevity with quality; complexity can be useful but must earn its cost.

Estimate lineage-level differences over a fixed horizon and task mixture, adjusting only for prespecified baseline covariates. Crossed task-family effects or blocked permutation address shared test tasks. Use an intention-to-treat main analysis, counting failed policy activation and abandoned tasks. Record informative missingness; condition-specific omissions cannot be discarded as irrelevant. Heterogeneity by stable/shifted environment is a planned interaction, with multiplicity handled by a fixed hierarchy of contrasts rather than selecting whichever subgroup succeeds.

A key exploratory estimand is the learning-curve difference after a new regime begins, conditional on equal first exposure. Better immediate performance can reflect a better prior policy; a steeper subsequent acquisition curve can reflect improved learning. These must not be conflated. A policy that succeeds because it avoids difficult tasks should be evaluated on the full assigned workload, including justified abandonment and its external consequences.

### Precision and feasible staging

The 16-stream four-arm pilot is for variance, fidelity, and cost estimation. It offers very few independent learning histories, regardless of the number of generated messages. Before confirmation define a meaningful effect such as a 0.25 baseline-standard-deviation improvement in held-out utility or a 10% cost reduction within a quality-equivalence margin. These are candidate thresholds to elicit from the actual decision context, not facts established by this design.

An unpaired normal approximation for a standardized difference of 0.35 requires about 128 independent lineages per arm at 80% power and two-sided 5%. A paired-stream design can reduce this if the within-stream contrast is sufficiently precise, but source-family dependence can offset that gain. Simulate power under pilot-estimated crossed dependence, attrition, and the final contrast hierarchy. If 256 or more lineages are unaffordable, narrow the decision, improve pairing, or label the result exploratory; do not declare thousands of within-lineage tasks to be independent replications.

A practical programme first locks A-versus-C, then tests C-versus-D on new streams. This reduces simultaneous arms while preserving the critical simpler comparator. Development may use sequential screening, but the confirmatory heldout must remain sealed until the chosen final comparison. Stop on fixed horizon/sample rules; use a prespecified alpha-spending design only if early efficacy stopping is operationally necessary. A policy version selected because it won many exploratory contests incurs selection bias that a fresh heldout must absorb.

### Rivals, external outcomes, and prospective action

Rivals include additional search, privileged teacher feedback, benchmark familiarity, stronger models, selection of easy tasks, longer context, evaluator dependence, human rescue, and self-serving revision of success criteria. Protect external anchors, task assignments, and scoring; randomize presentation order; use independent domain checks; audit source ancestry. Test real outcomes such as artifact correctness, usable decisions, delayed rework, and human correction burden. Satisfaction and self-rated learning remain distinct secondary observations.

A promising policy should survive a frozen evaluation window, replacement of the revising participant, and at least one new source-family replication. Its benefit must exceed a meaningful threshold or demonstrate cost savings within an agreed quality margin; it must not increase serious errors beyond the protected bound. Roll back if the protected outcome deteriorates, and retain the failed version plus its scope as research evidence where permitted. If C does not beat D, the result supports spending effort on direct work or search within that domain. If benefits appear only with external teacher feedback, report an assisted learning effect and its total human cost.

Changing the evaluator may eventually be justified because the old measure is wrong. That is a separate amendment process: preserve the old measure, independently validate the proposed replacement, and report conclusions under both until the disagreement is resolved. Otherwise learning-policy revision and measurement revision become observationally inseparable. This protocol deliberately allows the elaborate policy to lose.

## E11. Mechanism traction and portability

**Decision and question.** Determine whether a mechanism works on a specific host and where failures occur. Are authored and installed skills actually activated, interpreted and translated into useful behaviour?

**Intervention.** Present equivalent task triggers across host/provider configurations with documented version pins. Instrument availability, invocation, delivery, interpretation, permission and response separately. Include explicit invocation and natural-language triggering, fresh sessions, interruption, silence and replacement. Compare the full mechanism with ordinary instructions and a deterministic trigger carrying equivalent information.

**Estimand and units.** Estimate assignment effects on task outcome and trigger precision/recall by host. The independent unit is a fresh session–task family; repeated messages are dependent probes. Treat providers and hosts as fixed factors unless enough independently sampled implementations support broader inference. Record shared model ancestry and adapter-generation ancestry.

**Rivals and controls.** A log message can be emitted without comprehension; a correct response can occur without the tested mechanism. Use cases where the mechanism changes the required action, adversarial near-triggers and false-positive opportunities. Capability failure after correct absorption is distinguished from reasoning failure. A healthy heartbeat is a manipulation check on a limited path, not proof of the whole chain.

**Analysis and action rule.** Report a host-specific evidence profile from authored through outcome-effective. Do not aggregate away an unsupported host. Transport claims require a new acceptance observation when a relevant event or execution contract changes. A failed activation remains an end-to-end failure even if exposed-only performance is good. Remedy suggestions name the earliest supported fault and remain separate from authorised changes.

## E12. Purpose, exploration and total external value

**Decision and question.** Choose how much exploratory and coordination effort a task portfolio should receive. Does broader contribution framing improve useful outcomes and future options compared with task-completion optimisation or a simpler workflow?

**Intervention.** Use task portfolios containing both straightforward completion and opportunities where the apparent task has become obsolete, where a new possibility is valuable, or where deep persistence is necessary. Randomise completion-focused, contribution-framed and conventional arrangements under equal total budgets. Include a predeclared exploration allowance and an arm allowed to spend the same resources on direct work.

**Estimand and units.** Estimate portfolio-level external utility components, not a universal scalar: correct completed work, avoided wrong-direction work, independently judged useful novel options, later option uptake, total cost, owner attention and delayed rework. Assignment is at portfolio level because switching and exploration create interference among tasks. Evaluation uses protected follow-on tasks and blinded domain assessment where objective checks are unavailable.

**Rivals and controls.** Novelty rhetoric, evaluator preference, easier task selection and abandoned difficult work can mimic success. Preserve task denominators and reasons for switching. Include persistence controls where apparent difficulty is not a reason to stop. Review both selected and unselected options so hindsight does not make every switch look wise.

**Analysis and action rule.** Keep outcomes disaggregated with declared stakeholder priorities and uncertainty. Adopt no policy merely because it produces more ideas or spends fewer tokens. Prefer an arrangement only when it improves the chosen external outcomes without unacceptable burden or loss of difficult-but-valuable work. If benefits remain long-horizon and speculative, preserve the possibility as an exploratory result and state what later uptake would test it.

## World-return and responsibility

No study currently has execution approval, an enrolled population, a scheduled run or an operational monitor. Jim Cresswell is the commissioning owner, not silently assigned the role of trial operator, statistician or data controller. Before any run, name those roles, instruments, budget, observation windows, data custody and stop authority. After a pilot, amend only prospective fields and preserve the original revision. After confirmation, report assignment and exposure, estimates and uncertainty, deviations, harms, missingness and exact scope.

Learning signals are proposals: preserve an observed method failure, distinguish object/method/routing/governance causes, compare a candidate repair with the prior method and a simpler baseline, and evaluate later object-level effects. No rule or skill is changed by this programme. A successful literature review does not itself establish that Parallax or the proposed framework improves research quality.
