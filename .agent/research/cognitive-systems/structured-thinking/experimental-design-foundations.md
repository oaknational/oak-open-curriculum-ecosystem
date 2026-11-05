# The foundations of experimental design

**A rigorous experiment makes an important difference distinguishable from alternative explanations.** It deliberately changes something, creates a credible comparison, and measures the result in a way that makes both error and uncertainty visible.

Six principles provide a strong practical foundation. They are a synthesis of established experimental methods, measurement theory, and research on statistical inference—not a formally validated checklist or a guarantee of correctness. Their value lies in the questions they force us to answer before we commit resources or believe a result.

| Principle | The question it answers |
| --- | --- |
| **1. Make the question answerable.** | Exactly what difference are we trying to learn about? |
| **2. Make the comparison fair.** | What else could explain the difference we observe? |
| **3. Make the measurement meaningful.** | Are we measuring the thing we actually care about? |
| **4. Make the evidence informative.** | Do we have enough independent information to distinguish the possibilities that matter? |
| **5. Keep the test honest.** | Could our choices change because we like a particular result? |
| **6. Keep the claim within the evidence.** | What does this experiment establish, and where does that conclusion stop? |

These principles apply to experiments in laboratories, software, education, services, and everyday organisational improvement. The details vary; the underlying problems recur. NIST defines experimentation in terms of deliberately changing inputs and observing responses, with design determining how much useful information the effort produces. [NIST: experimental design](https://www.itl.nist.gov/div898/handbook/pri/section1/pri11.htm).

## 1. Make the question answerable

**Define the difference before designing the test.**

“Does this work?” leaves too much unspecified. A usable question names the people or things involved, the intervention, the alternative, the outcome, and the time over which the outcome matters.

For example:

> For people using this service for the first time, does instruction sheet B, compared with the current sheet A, increase the proportion who complete the application correctly without assistance within 20 minutes?

This makes clear what is being changed and what would count as improvement. It also exposes decisions that a vague question conceals: immediate completion may matter more than satisfaction, and first-time users may behave differently from experienced users. NIST distinguishes experimental objectives such as comparing alternatives, identifying influential factors, and finding favourable operating conditions; those objectives require different designs. [NIST: experimental objectives](https://www.itl.nist.gov/div898/handbook/pri/section3/pri31.htm).

The causal idea is a **counterfactual**: what would happen to the same unit under the alternative condition? We ordinarily observe only one possibility. An experiment constructs a comparison that can inform the average difference despite that missing alternative. [Hernán and Robins, *Causal Inference: What If*, chapters 1–2](https://miguelhernan.org/whatifbook).

For an applied decision, also state **how much difference would matter**. A tiny improvement may not justify cost, disruption, or a deterioration elsewhere. The smallest worthwhile improvement is a judgement about the situation; it is distinct from both the improvement we expect and the smallest effect our study could reliably detect. [Lakens, 2022](https://online.ucpress.edu/collabra/article/8/1/33267/120491/Sample-Size-Justification).

A useful design sentence is:

> In **this population and setting**, compare **this defined change** with **this alternative**, using **this outcome at this time**, to inform **this decision**.

Where the purpose is understanding rather than adoption, replace the decision with the competing explanations the experiment should distinguish. An exploratory experiment can ask an open question; it need not invent a confident directional prediction.

**Practical test:** could another person tell, before seeing the results, which question this experiment will answer?

## 2. Make the comparison fair

**Arrange the experiment so that rival explanations have as little room as possible.**

A difference between groups can arise because of the intervention, because the groups began differently, because something else happened to them, or because of chance. Good design addresses those possibilities at their source.

### Use a relevant comparator

The comparison should represent the alternative that actually matters. For replacing an existing process, that usually means comparing with the current process. A comparison with doing nothing answers a different question. The choice of control depends on the experimental objective. [ARRIVE: study design and control groups](https://arriveguidelines.org/arrive-guidelines/study-design/1a/explanation).

Whenever feasible, run the alternatives over the same period. A before-and-after comparison leaves changes in workload, experience, season, equipment, and other conditions entangled with the intervention. In the instruction-sheet example, comparing this month's sheet B with last month's sheet A would leave an obvious time-related explanation open.

### Randomise assignment

Use a genuine chance mechanism to assign eligible experimental units to conditions. For a simple two-group experiment, a randomly shuffled allocation list is often enough. Do not substitute alternation, volunteers choosing their condition, or an investigator's attempt to construct apparently similar groups. NIST's completely randomised design assigns the treatment levels to experimental units randomly. [NIST: completely randomised designs](https://www.itl.nist.gov/div898/handbook/pri/section3/pri331.htm).

Randomisation protects against systematic selection into treatment. Chance imbalance remains possible, particularly in small studies; biased measurement and selective loss after assignment remain problems. [Hernán and Robins, chapters 2 and 10](https://miguelhernan.org/whatifbook).

When someone recruits or assigns participants, keep the next allocation concealed until eligibility and entry are settled. This prevents knowledge of the upcoming condition from influencing who enters it. Allocation concealment protects entry into groups; blinding protects later conduct and assessment. [ARRIVE: allocation concealment and blinding](https://arriveguidelines.org/arrive-guidelines/blindingmasking/5/explanation).

### Account for obvious sources of variation

If an important difference is known in advance—such as production batch, task difficulty, or site—form comparable groups around it and randomise **within** those groups. This is **blocking**. Both conditions should occur within each block, and the analysis should respect that structure. It can make comparisons more precise by preventing predictable variation from obscuring the treatment difference. [NIST: randomised block designs](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm).

For example, if tasks come in easy and hard versions, give each instruction sheet a random share of both. Assigning all easy tasks to B and all hard tasks to A cannot distinguish an instruction effect from a task effect.

“Change one thing” is useful shorthand for avoiding accidental differences. It is not a universal rule that only one factor may be varied: experiments can deliberately vary several factors. If B combines new wording, illustrations, and extra assistance, an A-versus-B comparison estimates the effect of that **package**; it cannot identify which component caused the result. [NIST: experimental design](https://www.itl.nist.gov/div898/handbook/pri/section1/pri11.htm).

**Practical test:** if someone disputed the result, which other explanation would be hardest to rule out—and can the design address it now?

## 3. Make the measurement meaningful

**A precise answer to the wrong question is still the wrong answer.**

Two properties matter:

- **Validity:** the evidence supports interpreting the measurement as the outcome we care about.
- **Reliability:** the measurement is sufficiently consistent under comparable conditions.

A count of completed forms may be recorded perfectly yet fail to capture whether the forms are correct. A learning experiment may raise scores on practised questions without establishing durable understanding. Naming a convenient measure “quality” does not establish that it measures quality. Cronbach and Meehl's foundational account of construct validity treats interpretation as something requiring evidence and consideration of alternative explanations. [Cronbach and Meehl, 1955](https://meehl.umn.edu/sites/meehl.umn.edu/files/files/036constructvalidityidx.pdf).

Choose a primary outcome that directly addresses the main question. Define its recording procedure, scoring rule, denominator, and observation time. Additional outcomes can capture costs, harms, or other important consequences; specify their roles so that a convenient secondary result cannot silently replace the main one. [ARRIVE: outcome measures](https://arriveguidelines.org/arrive-guidelines/outcome-measures/6a/explanation).

In the instruction-sheet example, “correct completion without assistance within 20 minutes” needs a fixed definition of correctness, a consistent start time, and a rule for what counts as assistance. Counting only people who finish would omit precisely the failures the experiment needs to detect.

Use the same measurement procedure in both conditions. Where judgement is involved, conceal condition labels from the assessor when feasible. A fixed rubric and coded outputs make this practical in many settings. When blinding is impossible, document that limitation and reduce discretionary judgement. Blinding addresses the possibility that expectations influence conduct, scoring, or interpretation. [ARRIVE: blinding](https://arriveguidelines.org/arrive-guidelines/blindingmasking/5/explanation).

Finally, record what actually happened: whether the intervention was delivered, who used it, which outcomes are missing, and why. Losing more difficult cases from one group can undermine a fair initial comparison. Contemporary trial reporting explicitly includes intervention delivery and missing-data handling because these affect interpretation. [CONSORT 2025: explanation and elaboration](https://www.bmj.com/content/389/bmj-2024-081124).

**Practical test:** could the recorded metric improve while the real outcome stayed the same or became worse?

## 4. Make the evidence informative

**Count independent opportunities to learn, and plan for the uncertainty that will remain.**

The **experimental unit** is the smallest unit independently assigned to a condition. It might be a person, classroom, team, production batch, or separate run. It need not be the unit producing each row of data.

Suppose one classroom receives a teaching method and another receives the alternative. Testing 30 pupils in each classroom does not create 60 independently assigned units: the treatment was assigned to two classrooms. The observed difference remains entangled with classroom differences. Taking more measurements inside each classroom cannot create replication of the classroom-level treatment.

Treating subsamples or dependent observations as independent treatment replications is **pseudoreplication**. Hurlbert's classic paper explains why this produces an inappropriate basis for estimating experimental error. Repeated observations can be valuable, but the analysis must account for their dependence. [Hurlbert, 1984](https://esajournals.onlinelibrary.wiley.com/doi/10.2307/1942661).

There are two complementary ways to plan the amount of evidence:

- **Precision:** how narrow should the uncertainty interval be for the result to be useful?
- **Power:** if a specified meaningful effect exists, how likely should the planned test be to detect it?

There is no universal adequate sample size. It depends on the effect of interest, variability, allocation and dependence structure, and the intended inference. If resources fix the sample size, assess what that sample can tell us and narrow the claim accordingly. [Lakens, 2022](https://online.ucpress.edu/collabra/article/8/1/33267/120491/Sample-Size-Justification).

Distinguish **noise** from **bias**. More independent observations usually improve precision without fixing systematic error. Conventional uncertainty intervals generally exclude such biases. [Hernán and Robins, chapter 10, Fine Point 10.2](https://miguelhernan.org/whatifbook).

A small pilot can answer useful questions about feasibility, measurement, or delivery. If it cannot distinguish worthwhile benefit from no useful effect, that limitation should be part of its purpose and interpretation from the start.

**Practical test:** what is the actual independent unit, and would the planned amount of evidence separate the outcomes that would lead us to different decisions?

## 5. Keep the test honest

**Set the important rules before learning which choices favour the desired result.**

An experiment offers many choices: when to stop, which observations to exclude, which outcome to highlight, which groups to compare, and which analysis to use. Choosing among them after examining results can make an ordinary fluctuation look persuasive. Simmons, Nelson, and Simonsohn demonstrated this problem using simulations and deliberately misleading experimental findings. [Simmons and colleagues, 2011](https://journals.sagepub.com/doi/10.1177/0956797611417632).

Before examining the outcome differences, preserve a dated plan specifying:

- the primary question, outcome, comparison, and analysis;
- the sample size or stopping rule;
- eligibility, exclusions, and treatment of missing outcomes;
- any planned subgroup comparisons;
- the practical criteria for interpreting the result.

For a modest internal experiment, a preserved plan with a clear timestamp can provide useful discipline. An independent preregistration provides stronger evidence of what was specified when. Its central purpose is to distinguish decisions made before observing outcomes from decisions prompted by them. [Nosek and colleagues, 2018](https://www.pnas.org/doi/10.1073/pnas.1708274114).

A simple default is to collect the planned sample and complete the planned observation period before judging effectiveness. Repeatedly checking an ordinary fixed-sample significance test and stopping when it looks favourable changes its error properties. Sequential designs can allow valid interim decisions, but their stopping and analysis rules must be designed together. [Simmons and colleagues, 2011](https://journals.sagepub.com/doi/10.1177/0956797611417632).

Exploration remains valuable. Investigate surprises, fix errors, and develop better explanations. Preserve the original plan, explain deviations and when they occurred, and label analyses suggested by the results. A newly discovered pattern is a reason for a further test; it should not be reported as though that test had already been planned and passed. [Nosek and colleagues, 2018](https://www.pnas.org/doi/10.1073/pnas.1708274114).

**Practical test:** would we use the same exclusions, stopping rule, and interpretation if the result favoured the alternative?

## 6. Keep the claim within the evidence

**Report the size of the difference, its uncertainty, and the conditions under which it was observed.**

A p-value does not measure how large or useful an effect is, or the probability that a hypothesis is true. A threshold cannot by itself establish the scientific or practical conclusion. These distinctions are central to the American Statistical Association's 2016 statement. [ASA statement summary, 2016](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf).

An uncertainty interval helps show which effect sizes remain compatible with the data under the analysis assumptions. A conventional 95% confidence interval is produced by a method that would cover the target quantity in about 95% of repeated studies under its assumptions. It is not a 95% probability statement about this particular fixed effect, nor a summary of every possible source of error. [NIST: confidence intervals](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm).

For practical interpretation, distinguish:

| Result pattern | Appropriate reading |
| --- | --- |
| The interval is sufficiently narrow and entirely above the worthwhile-benefit threshold. | Evidence supports a worthwhile benefit under the tested conditions and stated assumptions. |
| The interval includes both no benefit and worthwhile benefit. | The experiment is inconclusive about that distinction. |
| The interval lies within a predefined range of practically negligible effects. | Evidence can support practical equivalence under an appropriate planned analysis. |

Failure to obtain statistical significance does not, by itself, establish that an intervention has no effect. Conversely, statistical significance does not establish that an effect is worthwhile. Practical equivalence requires testing against a justified range of negligible effects. [ASA, 2016](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf); [Lakens, Scheel, and Isager, 2018](https://journals.sagepub.com/doi/10.1177/2515245918770963).

State the boundary of the result: who or what was studied, where, for how long, and under which implementation. A short experiment with first-time users does not establish long-term effects for all users. Random assignment makes a comparison more credible; it does not make the recruited sample representative of every population.

Preserve the methods and evidence so others can inspect them. Recomputing the same data checks computational reproducibility; collecting new data to test the same question checks replicability. Testing different populations or conditions examines generalisability. These are different forms of support, and consistent results should be judged with their uncertainty rather than by exact numerical identity. [National Academies, 2019](https://www.nationalacademies.org/read/25303/chapter/3).

**Practical test:** what stronger claim would a reader be tempted to make that this experiment has not actually earned?

## A worked example

The following example is hypothetical. Its purpose is to show how the principles change an ordinary improvement exercise.

An organisation wants to replace its application instructions. An initial proposal is: “Give the new instructions to some users, ask whether they liked them, and keep them if feedback is good.”

A more rigorous design would make these choices explicit:

| Design choice | Application |
| --- | --- |
| Question | Does sheet B improve correct, unassisted completion within 20 minutes compared with current sheet A? |
| Population and scope | First-time users attempting one specified application task in the current service. |
| Worthwhile difference | An increase of five percentage points in successful completion, chosen in advance to reflect implementation cost and expected benefit. This is an illustrative judgement, not a universal threshold. |
| Comparison | Randomly assign eligible users to A or B during the same period, with the same access to the service and assistance. |
| Independent unit | Each user attempts the task once. Users work separately so that instructions are not shared between conditions. |
| Measurement | Score every assigned user's outcome against a fixed correctness rubric. Where feasible, the assessor sees the submitted application without its instruction-sheet label. |
| Information | Choose the sample size using plausible completion rates and the precision or power needed for the five-point question. If resources cannot support that aim, define a narrower pilot objective. |
| Delivery and missingness | Record whether the assigned sheet was delivered, whether assistance occurred, and whether the outcome could be observed. An observed non-completion is a failure on this outcome; an unobserved outcome is missing data. |
| Analysis | Compare success rates by assigned condition. This asks about assigning the instructions, including any non-use, rather than selecting only users who followed them. Specify how missing outcomes will be handled and how sensitive the result is to that choice. |
| Stopping and reporting | Use the planned stopping rule and report the difference, uncertainty interval, missing outcomes, deviations, and important adverse consequences. |

Two details deserve particular attention. First, analysing only people who complied can undo the protection of random assignment: compliance may itself depend on user characteristics. Second, keeping people in their assigned groups does not solve missing-outcome bias. Assignment, actual delivery, and observed outcomes all need to remain visible. [CONSORT 2025: explanation and elaboration](https://www.bmj.com/content/389/bmj-2024-081124).

### Why an encouraging result may still be inconclusive

Suppose a resource-limited first run assigns 100 users to each sheet, and every outcome is observed:

| | Current sheet A | New sheet B |
| --- | --- | --- |
| Correct, unassisted completion within 20 minutes | 64 of 100 | 76 of 100 |
| Success rate | 64% | 76% |

The observed improvement is **12 percentage points**. A simple, approximate 95% interval for the difference between these independent proportions is **−0.6 to +24.6 percentage points**. Using a normal approximation, the calculation on the proportion scale is `0.12 ± 1.96 × sqrt((0.64 × 0.36 / 100) + (0.76 × 0.24 / 100))`. Multiply by 100 for percentage points. These are illustrative calculations, not findings about a real service.

This result permits both a slight disadvantage and a large benefit. It does not establish the predefined five-point improvement. It also does not show that the new sheet has no effect.

The design problem was foreseeable: 100 users per group would provide a fairly imprecise estimate for success rates around these levels. A truthful conclusion is that the estimate is encouraging but insufficiently precise for the intended decision. Whether further measurement is worth its cost is a separate decision.

The lesson is that **fairness and informativeness are separate requirements**. A carefully randomised, honestly reported experiment can still be too small to answer its intended question.

## A short experiment-planning record

Complete this before starting. The length of the answers matters less than whether another person can understand and challenge them.

1. **Question:** What difference are we trying to estimate, or which explanations are we trying to distinguish?
2. **Scope:** Which people, things, settings, and time period are covered?
3. **Conditions:** What exactly changes, and what is the relevant alternative?
4. **Meaningful result:** What size of improvement or deterioration would matter, and why?
5. **Fairness:** How will assignment work? Which rival explanations need controlling, blocking, or explicit acknowledgement?
6. **Measurement:** What is the primary outcome, how will it be recorded, and what supports its interpretation? Which other consequences matter?
7. **Information:** What is independently assigned? How much independent information is needed, and why?
8. **Rules:** What are the stopping, exclusion, missing-data, and analysis rules? What will be decided before results are inspected?
9. **Record:** How will assignment, delivery, observations, deviations, and results be preserved for inspection?
10. **Claim and next step:** What conclusions can this design support? What would require a further experiment?

As a practical design review, imagine three outcomes in advance: a clear benefit, an apparent lack of benefit, and an ambiguous result. If the plan cannot explain how each would be interpreted, it needs more work.

## Foundations and limits

The classical core is **randomisation, replication, and blocking**. Randomisation protects assignment; replication supplies information about variation; blocking makes comparisons more efficient in the presence of known differences. These ideas emerged from concrete problems such as variation across agricultural plots, addressed in Fisher's early work. The six principles above place that core within the broader tasks of asking a meaningful question, measuring well, preserving honest inference, and limiting conclusions. [Fisher, 1926](https://digital.library.adelaide.edu.au/handle/2440/15191); [NIST: randomised designs](https://www.itl.nist.gov/div898/handbook/pri/section3/pri331.htm); [NIST: blocking](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm).

There are useful limits to simple rules:

- **Randomisation is a powerful default.** Other causal designs require an explicit justification for their comparison and additional assumptions. [Hernán and Robins, chapter 3](https://miguelhernan.org/whatifbook).
- **Preregistration is a protection against some forms of bias, not a substitute for scientific reasoning.** Critics emphasise that procedural commitments do not make weak explanations stronger. The practical synthesis is to preserve advance commitments while still correcting mistakes and improving theories transparently. [Szollosi and Donkin, 2021](https://journals.sagepub.com/doi/10.1177/1745691620966796).
- **Statistical methods remain useful.** Criticism of threshold-driven conclusions is not a reason to abandon sound tests or uncertainty estimates. An ASA president's task force made that distinction explicitly in 2021. [Task force statement](https://magazine.amstat.org/blog/2021/08/01/task-force-statement-p-value/).

Some situations need additional design expertise: interventions that spill between participants, treatment assigned to groups, and repeated exposure that changes later responses. These complications alter the comparison or the dependence between observations. The fundamental questions still apply, but a simple independent two-group analysis may not.

No universal numerical “rigour score” follows from these principles. A severe weakness in one part cannot reliably be compensated for by excellence elsewhere. The practical standard is a defensible chain from question, through comparison and measurement, to a proportionate conclusion.

## Sources

The sources below are original methodological publications, author-hosted texts, or guidance from the organisations that issue it. Links go directly to those publications or their institutional records. Publication years refer to the original work; undated NIST and ARRIVE web sections were consulted in September 2026. Examples and the six-principle organisation are practical synthesis.

1. **NIST/SEMATECH.** [*e-Handbook of Statistical Methods*, §5.1.1: What is experimental design?](https://www.itl.nist.gov/div898/handbook/pri/section1/pri11.htm). Definition, deliberate variation, and informative design.
2. **NIST/SEMATECH.** [*e-Handbook*, §5.3.1: What are the objectives?](https://www.itl.nist.gov/div898/handbook/pri/section3/pri31.htm). Choosing a design to match the purpose.
3. **Hernán, M. A., and Robins, J. M. (2020; online revisions).** [*Causal Inference: What If*](https://miguelhernan.org/whatifbook). Author's book page; chapters 1–3 and chapter 10, especially Fine Point 10.2. Section references follow the January 2025 text.
4. **NIST/SEMATECH.** [*e-Handbook*, §5.3.3.1: Completely randomized designs](https://www.itl.nist.gov/div898/handbook/pri/section3/pri331.htm). Treatment assignment and experimental units.
5. **NIST/SEMATECH.** [*e-Handbook*, §5.3.3.2: Randomized block designs](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm). Controlling known sources of variation and comparing within blocks.
6. **Cronbach, L. J., and Meehl, P. E. (1955).** [Construct validity in psychological tests](https://meehl.umn.edu/sites/meehl.umn.edu/files/files/036constructvalidityidx.pdf). *Psychological Bulletin*, 52, 281–302. Full text in Meehl's University of Minnesota archive. Evidence for interpreting a measure.
7. **Percie du Sert, N., and colleagues / ARRIVE Guidelines (2020).** ARRIVE 2.0 explanatory guidance: [study design and control groups](https://arriveguidelines.org/arrive-guidelines/study-design/1a/explanation), [blinding and allocation concealment](https://arriveguidelines.org/arrive-guidelines/blindingmasking/5/explanation), and [outcome measures](https://arriveguidelines.org/arrive-guidelines/outcome-measures/6a/explanation). These are animal-research reporting guidelines; the methodological principles used here extend beyond that domain, while its specific requirements do not automatically do so.
8. **Hurlbert, S. H. (1984).** [Pseudoreplication and the design of ecological field experiments](https://esajournals.onlinelibrary.wiley.com/doi/10.2307/1942661). *Ecological Monographs*, 54(2), 187–211. Distinguishing treatment replication from subsampling and dependence.
9. **Lakens, D. (2022).** [Sample size justification](https://online.ucpress.edu/collabra/article/8/1/33267/120491/Sample-Size-Justification). *Collabra: Psychology*, 8(1), 33267. Matching information, precision, power, and effect sizes to inferential goals.
10. **Simmons, J. P., Nelson, L. D., and Simonsohn, U. (2011).** [False-positive psychology: Undisclosed flexibility in data collection and analysis allows presenting anything as significant](https://journals.sagepub.com/doi/10.1177/0956797611417632). *Psychological Science*, 22(11), 1359–1366. Original experiments and simulations on analytic flexibility. [Full-text copy of the original article at the University of British Columbia](https://www2.psych.ubc.ca/~schaller/528Readings/SimmonsNelsonSimonsohn2011.pdf).
11. **Nosek, B. A., Ebersole, C. R., DeHaven, A. C., and Mellor, D. T. (2018).** [The preregistration revolution](https://www.pnas.org/doi/10.1073/pnas.1708274114). *PNAS*, 115(11), 2600–2606. Separating planned tests from analyses prompted by results; handling deviations. [Original article in the PubMed Central archive](https://pmc.ncbi.nlm.nih.gov/articles/PMC5856500/).
12. **American Statistical Association (2016).** [American Statistical Association releases statement on statistical significance and p-values](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf). Official release containing the statement's six principles. The accompanying journal article is Wasserstein and Lazar, [The ASA statement on p-values: Context, process, and purpose](https://www.tandfonline.com/doi/full/10.1080/00031305.2016.1154108), *The American Statistician*, 70(2), 129–133.
13. **NIST/SEMATECH.** [*e-Handbook*, §1.3.5.2: Confidence limits for the mean](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm). Confidence-interval interpretation and the relationship between noise, sample size, and precision.
14. **National Academies of Sciences, Engineering, and Medicine (2019).** [*Reproducibility and Replicability in Science*: Summary](https://www.nationalacademies.org/read/25303/chapter/3). The National Academies Press. Definitions, uncertainty, transparent reporting, and limits of replication.
15. **Hopewell, S., and colleagues (2025).** [CONSORT 2025 explanation and elaboration: Updated guideline for reporting randomised trials](https://www.bmj.com/content/389/bmj-2024-081124). *BMJ*, 389, e081124. Intervention delivery, analysis populations, missing data, and reporting. The corresponding [CONSORT 2025 statement](https://www.bmj.com/content/389/bmj-2024-081123) is *BMJ*, 389, e081123. These are clinical-trial reporting standards, used here for the relevant underlying principles rather than as a universal compliance checklist.
16. **Fisher, R. A. (1926).** [The arrangement of field experiments](https://digital.library.adelaide.edu.au/handle/2440/15191). *Journal of the Ministry of Agriculture of Great Britain*, 33, 503–513. Original article preserved in the University of Adelaide Fisher archive; historical foundation for designing around variation in experimental material.
17. **Szollosi, A., and Donkin, C. (2021).** [Arrested theory development: The misguided distinction between exploratory and confirmatory research](https://journals.sagepub.com/doi/10.1177/1745691620966796). *Perspectives on Psychological Science*, 16(4), 717–724. A counterargument to treating preregistration and procedural distinctions as substitutes for explanatory quality.
18. **ASA President's Task Force (2021).** [Statement on statistical significance and replicability](https://magazine.amstat.org/blog/2021/08/01/task-force-statement-p-value/). *Amstat News*, 1 August 2021. A defence of properly used statistical tests alongside explicit uncertainty and scientific judgement; distinct from the ASA Board's 2016 statement.
19. **Lakens, D., Scheel, A. M., and Isager, P. M. (2018).** [Equivalence testing for psychological research: A tutorial](https://journals.sagepub.com/doi/10.1177/2515245918770963). *Advances in Methods and Practices in Psychological Science*, 1(2), 259–269. The distinction between an inconclusive test and evidence of practical equivalence. The guide uses this distinction without requiring the tutorial's technical methods.
