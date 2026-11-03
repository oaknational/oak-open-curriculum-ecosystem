# Five foundations of statistical rigour

Statistical rigour means making the strength and scope of a claim match the evidence that supports it. Its foundations concern the meaning of observations, the process that produced them, the alternatives they distinguish, the uncertainty that remains, and the ways an inference can be checked and corrected.

These foundations apply to a survey, a laboratory measurement, an ecological study, a forecast, a product experiment, or an ordinary claim about a pattern. Their application changes with the situation. The underlying questions remain remarkably stable.

The five principles below are a synthesis of statistical and methodological literature. They offer a strong general baseline when answered with evidence and implemented competently. They are not a validated scoring system: a serious weakness in one cannot be compensated for by accumulating strengths in the others.

| Foundation | Simple truth | Essential question |
|---|---|---|
| **1. Meaning** | A number is only as useful as its connection to the question. | What exactly does this quantity mean, and what claim can it support? |
| **2. Data generation** | What can be inferred depends on how observations came to exist. | Why are these observations here, and what is missing or dependent? |
| **3. Comparison and conditioning** | Evidence gains force by distinguishing relevant alternatives, under stated conditions. | Compared with what, and assuming what? |
| **4. Uncertainty** | An estimate and its uncertainty belong together. | How large is the effect or quantity, and how much remains unresolved? |
| **5. Error control and correction** | A trustworthy method must give error a fair chance to reveal itself. | Could this process expose a mistaken conclusion, and would we act on that evidence? |

## Why statistics needs foundations

The central problem is the gap between what has been observed and what is claimed beyond those observations. A collection of responses is used to describe a population. Past events are used to predict future ones. Differences between groups are used to explain what caused an outcome.

That gap cannot be crossed by arithmetic alone. The same recorded numbers may arise from different processes and support different conclusions. A change in an average could reflect a change in individuals, a change in who was measured, or a change in the measuring instrument. A pattern that predicts an outcome need not identify a way to change it. Causal inference makes this last distinction explicit: causal conclusions require assumptions about how the world works in addition to observed associations. [Pearl, 2009](https://ftp.cs.ucla.edu/pub/stat_ser/r350.pdf).

It helps to distinguish three layers:

- **Observation:** what was recorded, with what definitions and limitations.
- **Inference:** what those observations suggest about something unknown, under particular assumptions.
- **Decision:** what to do, given that inference and the consequences of being wrong.

Rigour preserves the connections between these layers. It also preserves their differences. A perfectly calculated average can support a poor inference; a sound inference can still leave a difficult decision; and a carefully made decision can have an unlucky outcome.

The aim is an accountable relationship between evidence and confidence. That requires both useful information and a disciplined account of its limits.

## 1. Meaning: establish what the numbers stand for

**Before asking whether a result is precise, establish whether it answers the intended question.**

A measurement is a claim about the relationship between an observation and something of interest. Sometimes that relationship is direct: counting items in a box. Sometimes it is substantially interpretive: using a questionnaire score as a measure of wellbeing, or time spent with a service as a measure of its usefulness.

The distinction between a recorded score and the attribute it is intended to represent is central to construct validity. Cronbach and Meehl argued that interpreting a test requires an account of the construct and evidence about the relationships that interpretation implies. A convenient measure does not validate its own meaning. [Cronbach and Meehl, 1955](https://meehl.umn.edu/sites/meehl.umn.edu/files/files/036constructvalidityidx.pdf).

Consider a hypothetical service that aims to help people complete a task. Longer visits could indicate deeper engagement, greater confusion, or a slower interface. The direction of the number does not determine the direction of the benefit. The missing ingredient is knowledge of the activity being measured.

A measure can also be consistent without being accurate. A clock that is always fifteen minutes fast is highly repeatable. Repeating its reading more often will not fix its offset. Likewise, a questionnaire can produce stable answers while supporting an inappropriate interpretation.

### Define the quantity before interpreting it

“Success increased by 10%” is incomplete. It leaves open the definition of success, the population, the time window, the denominator, and whether the change is relative or absolute. An increase from 20% to 30% is ten percentage points and a 50% relative increase. Both descriptions are arithmetically correct; they communicate different aspects of the same change.

The denominator is part of the meaning. Successes per attempt, successes per person, and the proportion of people who ever succeed answer different questions. If an intervention changes how many attempts people make, these quantities may move in different directions. Research on online experiments documents precisely this problem: a ratio can move because its denominator changes, making the customary interpretation misleading. [Dmitriev and colleagues, 2017, section 5.2](https://www.microsoft.com/en-us/research/uploads/prod/2020/08/2017-08-KDDMetricInterpretationPitfalls.pdf).

The same discipline applies to the target of an inference. A statement about these respondents is narrower than one about all eligible people. An average effect is different from an effect on each person. Performance on a particular test is different from performance across the range of situations the test is supposed to represent.

**A practical application:** write a sentence identifying the quantity, the unit being measured, the relevant population or setting, and the period. Then explain why that quantity bears on the substantive question. If that explanation is weak, improve the measurement or narrow the claim before refining the calculation.

## 2. Data generation: understand how observations came to exist

**A dataset contains the consequences of a selection and measurement process.**

An observation appears because something was eligible, encountered, measured, recorded, retained, and made available. Every step can affect what the dataset represents. The process may be deliberate, as in a designed sample, or incidental, as in records collected while operating a service.

Imagine asking people who attend a public meeting whether the meeting is accessible. Their answers are evidence about attendees. People unable to attend are precisely among those whose experience may differ. Increasing the number of attendee responses does not, by itself, solve the problem.

This illustrates the distinction between **random error**, which varies across repetitions, and **bias**, which systematically displaces an estimate from its target. More observations can reduce random error while leaving selection bias. Meng’s analysis of large datasets shows how small relationships between being recorded and the quantity of interest can severely undermine population estimates, despite enormous sample sizes. [Meng, 2018](https://cces.gov.harvard.edu/publications/statistical-paradises-and-paradoxes-big-data-i-law-large-populations-big-data).

The familiar reassurance that averages settle down with more data depends on conditions. A growing dataset can settle around the wrong target if the mechanism producing it remains biased. A narrow uncertainty interval does not repair that mismatch.

### Count information, not just rows

Repeated observations are not necessarily independent pieces of evidence. Measurements from the same person, household, machine, school, or period can share influences.

Suppose one lake receives a treatment and another does not. Taking a hundred water samples from each helps characterise those lakes. It does not create a hundred independently treated lakes. Treating the samples as independent treatment replications would obscure the possibility that the two lakes differed for unrelated reasons. This is the problem of pseudoreplication examined by Hurlbert. [Hurlbert, 1984](https://esajournals.onlinelibrary.wiley.com/doi/10.2307/1942661).

Dependence does not make data useless. It changes what they tell us and how uncertainty must be calculated. Repeated measurements can be extremely informative when the analysis preserves their structure. The mistake is to count shared information as if it were fresh, independent information.

Missing observations deserve the same attention. If the hardest cases are less likely to be recorded, an apparently improving average may conceal worsening performance. Missingness is a question about the process, not merely a count of empty cells.

Even a complete census resolves only some uncertainties. With correct measurements of an entire finite population, there is no sampling uncertainty about that population’s recorded total. Measurement error can remain, as can uncertainty about another population or a future period.

**A practical application:** describe the path from the target population or phenomenon to the recorded data. Identify who or what could be absent, what observations share a common source, and what justifies extending the conclusion beyond what was directly observed.

## 3. Comparison and conditioning: make the alternatives explicit

**An observation supports a claim to the extent that it helps distinguish that claim from relevant alternatives.**

A useful first question is: *What else could produce this pattern?* A rise in performance might reflect a better method, easier cases, additional practice, seasonal variation, or altered recording. A persuasive explanation addresses the plausible alternatives instead of merely fitting the observations.

This also explains why statistical reasoning is conditional. A probability statement or estimate is made within a specified account of what is known, what is allowed to vary, and how the observations relate to the claim. Changing those conditions can change the conclusion.

### The direction of a conditional probability matters

The probability of seeing evidence **if a claim is true** is different from the probability that the claim is true **after seeing the evidence**. Reversing them silently changes the question.

Consider an entirely hypothetical defect detector:

| Among 10,000 items | Number of items | Number flagged |
|---|---:|---:|
| Defective items | 100 | 90 |
| Sound items | 9,900 | 495 |
| Total | 10,000 | 585 |

The detector finds 90% of defective items and incorrectly flags 5% of sound items. Yet only 90 of its 585 flags identify actual defects: about 15%. The large number of sound items creates many false alarms even at a comparatively low false-alarm rate.

This is a counting demonstration, not an empirical claim about detectors. It shows why the **base rate** matters. “It usually detects defects” is insufficient to answer “Does this flagged item probably have a defect?” The answer also depends on how common defects are and how often sound items are flagged.

Bayesian updating formalises this relationship between prior information and the relative predictions of competing possibilities. Its validity remains conditional on the chosen model and prior assumptions. Model criticism remains necessary alongside updating. [Gelman and Shalizi, 2013](https://sites.stat.columbia.edu/gelman/research/published/philosophy.pdf).

### For causal claims, the missing comparison is what would have happened otherwise

A before-and-after difference does not automatically reveal the effect of an intervention. The relevant comparison is between the outcome under the intervention and the outcome under the alternative, for the same target population and circumstances. The latter outcome is not directly observable for the same unit at the same occasion.

Random assignment helps construct a fair comparison by breaking systematic links between treatment allocation and pre-existing characteristics. It does not guarantee identical groups in a particular experiment. Chance imbalance and uncertainty remain. Blocking—randomising within relevant groups—can improve comparisons by accounting for known sources of variation. [NIST/SEMATECH, section 5.3.3.2](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm).

Random assignment and random sampling solve different problems. Assignment helps establish a causal comparison within a study; sampling supports inference to a population. A well-randomised experiment on volunteers does not automatically establish the effect for everyone.

Causal conclusions from observational data can also be justified, but the assumptions making the comparison credible must be stated and defended. Statistical adjustment does not automatically remove confounding; selecting appropriate adjustments requires causal knowledge. Some questions remain unidentified: different causal explanations fit the available observations, and additional observations of the same kind will not settle the issue. [Pearl, 2009, sections 2 and 3.3](https://ftp.cs.ucla.edu/pub/stat_ser/r350.pdf).

**A practical application:** identify the relevant baseline or alternative explanation, explain why the comparison is fair, and state the assumptions that carry the conclusion. For every probability, make clear what is being conditioned on.

## 4. Uncertainty: keep the unresolved part inside the answer

**An estimate without an account of uncertainty invites more confidence than the evidence may warrant.**

There are several distinct things to keep visible. Individuals or events vary. An estimate based on limited observations is uncertain. The measurement or model may be imperfect. A result may not transfer to another setting. These uncertainties require different responses; they are not all captured by one error bar.

The distinction between variation and uncertainty is especially useful. An average can be estimated very precisely while individual outcomes vary widely. The two invented collections `10, 10, 10` and `0, 0, 30` have the same mean. They describe very different experiences. A rigorous summary preserves the features of the distribution that matter to the question, including spread and unusual outcomes where relevant.

### Ask about size and precision together

Suppose an estimated improvement is three percentage points. An interval ranging from substantial deterioration to substantial improvement is very different evidence from a narrow interval around three points. Reporting only the estimated improvement conceals this distinction.

A **95% confidence interval** is produced by a procedure intended to cover the true target in 95% of repeated applications under its assumptions. It is not automatically a 95% probability statement about the particular realised interval. A **Bayesian credible interval** has a posterior probability interpretation conditional on its model and prior. Neither automatically includes unmodelled selection or measurement bias. An interval for an average is also different from a prediction interval for an individual outcome. [Greenland and colleagues, 2016](https://link.springer.com/article/10.1007/s10654-016-0149-3).

These distinctions need not dominate an ordinary report. Usually the useful presentation is the estimate, an appropriately calculated range, its interpretation, and the important uncertainties that the range does not cover.

### Statistical significance answers a limited question

A p-value describes how unusual a test statistic at least as extreme as the observed one would be under a specified statistical model, including the tested hypothesis. It does not give the probability that the hypothesis is true, measure the size of an effect, or establish practical importance. These are central distinctions in the American Statistical Association’s statement. [ASA, 2016](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf).

An effect can be detectable and too small to matter. A worthwhile effect can remain poorly resolved. A failure to detect a difference does not establish equivalence. To support “no difference large enough to matter,” define what “large enough” means and use evidence capable of excluding effects outside that range under the chosen inferential procedure. [Lakens, 2017](https://pure.tue.nl/ws/portalfiles/portal/80918653/lakeequi2017.pdf).

This gives sample size a purpose. The question is how much information is needed to resolve the uncertainty relevant to the claim. There is no universal minimum number of observations that makes a study rigorous. Planning can target a desired precision or the ability to detect a specified effect; constraints should be reflected in the conclusions the study can support. [Lakens, 2022](https://online.ucpress.edu/collabra/article/8/1/33267/120491/Sample-Size-Justification).

### A decision includes consequences as well as probabilities

The same evidence can justify different actions when the costs of error differ. Acting on a reversible change and making an irreversible commitment need not require the same threshold. A decision rule should identify the outcomes that matter and the consequences of mistaken action or inaction. Statistical conventions alone cannot supply those values. The ASA president’s task force explicitly connects decision thresholds to study goals and the consequences of incorrect decisions. [Benjamini and colleagues, 2021](https://magazine.amstat.org/blog/2021/08/01/task-force-statement-p-value/).

**A practical application:** state the estimated quantity or effect, the range supported by the analysis, the unresolved sources of error, and which remaining possibilities would change the interpretation or decision.

## 5. Error control and correction: make confidence answerable to failure

**A process deserves confidence when it can detect relevant errors and does not systematically hide them.**

Good intentions are insufficient. People can make individually plausible choices that collectively favour a desired result. The relevant object of scrutiny is the whole procedure: collection, stopping, exclusion, analysis, interpretation, and reporting.

### Confidence should be calibrated

When a forecasting method repeatedly assigns an event an 80% probability, the event should occur about 80% of the time among comparable predictions receiving that probability. This does not make every prediction correct. It makes the expressed uncertainty consistent with observed outcomes.

Calibration alone is insufficient: a forecast should also be informative. Predicting the background frequency on every occasion may be calibrated in aggregate while failing to distinguish easier from harder cases. Gneiting, Balabdaoui, and Raftery develop the complementary roles of calibration and sharpness in evaluating probabilistic forecasts. [Gneiting and colleagues, 2007](https://doi.org/10.1111/j.1467-9868.2007.00587.x).

The broader lesson is to examine what a method’s confidence statements promise and whether the actual procedure supports that promise. Frequentist error guarantees and Bayesian probabilities have different interpretations; neither should be treated as an unconditional warranty.

### Selection is part of the method

If many outcomes, subsets, time windows, or analyses are available, a striking result may emerge through selection. This can happen without deliberate deception. Gelman and Loken explain how analysis choices that depend on the observed data create a multiplicity problem even when only one final analysis is performed. [Gelman and Loken, 2013](https://sites.stat.columbia.edu/gelman/research/unpublished/forking.pdf).

Repeatedly inspecting ordinary fixed-sample tests and stopping when a favourable result appears can likewise invalidate their advertised error properties. Monitoring and adapting are legitimate when the inferential method accommodates them. Sequential methods provide one such route; a pre-specified fixed-sample analysis provides another. [Johari and colleagues, published online 2021](https://pubsonline.informs.org/doi/10.1287/opre.2021.2135).

The foundational requirement is that the uncertainty calculation correspond to the procedure actually used, including how results became eligible to be reported.

### Separate discovery from a fresh test

Exploring data is valuable. Unexpected patterns often generate worthwhile questions. Their status changes when the same observations both suggest a claim and are presented as an independent test of it.

Recording an analysis plan before examining outcomes makes that distinction inspectable. Pre-registration supports this separation; it does not repair a weak measure or an unsuitable design. Necessary changes can be documented and their implications assessed. New observations, or a genuinely untouched holdout, can test what the exploratory analysis suggested. [Nosek and colleagues, 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC5856500/).

### Check the assumptions and preserve the evidence

Ask whether the conclusion changes under plausible alternative assumptions about missing observations, measurement error, dependence, or model form. A sensitivity analysis is useful when the alternatives are substantively credible and address important weaknesses. Trying many alternatives and highlighting only the favourable ones recreates the selection problem.

Model checking asks whether the model can reproduce important features of the observations and where it fails. Gelman and Shalizi treat this criticism and revision as central to statistical practice, including Bayesian practice. [Gelman and Shalizi, 2013](https://sites.stat.columbia.edu/gelman/research/published/philosophy.pdf).

Preserving data provenance, definitions, exclusions, and analytical steps makes correction possible. Reproducing a calculation using the same data is different from obtaining consistent results with newly collected data. The National Academies distinguish these as computational reproducibility and replicability. Each provides information the other does not. [National Academies, 2019, chapter 3](https://www.nationalacademies.org/read/25303/chapter/6).

**A practical application:** specify what would count against the conclusion, ensure the analysis could reveal it, report inconvenient results, and leave enough of a record for another person to inspect the reasoning.

## The same foundations across different situations

The principles are universal because they address recurring gaps in inference. The safeguards depend on how those gaps arise.

| Situation | What the foundations require attention to |
|---|---|
| A survey estimates public opinion | Meaning of the question; who could respond; non-response; dependence within households or groups; uncertainty and the population represented. |
| A laboratory measures a physical quantity | Instrument calibration and offset; conditions of measurement; repeated readings versus independent specimens; uncertainty about the quantity being measured. |
| A forecast predicts future events | Target and horizon; similarity of past and future conditions; a relevant baseline; performance on fresh outcomes; calibration and informativeness. |
| An experiment estimates an intervention’s effect | Valid outcomes; credible assignment and comparison; independent experimental units or an analysis of their dependence; effect size; pre-specified or appropriately adaptive inference. |
| An observational study proposes a cause | Alternative causal explanations; assumptions justifying adjustment; missingness and selection; sensitivity to plausible violations; limits on identification. |
| A synthesis combines several studies | Whether the studies address comparable quantities; shared data or biases; differences in settings and effects; missing studies; uncertainty in the combined conclusion. |

This table is an application of the framework, not a claim that every situation needs the same design. Randomisation, for example, is powerful for many causal comparisons. It is not a universal prerequisite for rigorous description, prediction, or measurement.

## An illustration: improvement, importance, and action

Consider a hypothetical product experiment comparing two ways of completing a task. Its figures are invented to illustrate inference, not drawn from a product study.

Before collecting data, the team defines success, keeps a record of all eligible assigned accounts, and specifies its decision criteria. Assume 4,000 independent accounts are randomly assigned to each version, the recording is complete, there is no interference between accounts, and the analysis occurs at a pre-specified endpoint.

| Outcome | Existing version | New version | Estimated change | Approximate 95% confidence interval for change |
|---|---:|---:|---:|---:|
| Successful completion | 2,000/4,000 = 50% | 2,120/4,000 = 53% | +3 percentage points | +0.81 to +5.19 percentage points |
| Critical error | 40/4,000 = 1% | 52/4,000 = 1.3% | +0.30 percentage points | −0.17 to +0.77 percentage points |

The intervals use the usual large-sample approximation for differences between independent proportions. They are separate intervals, not a statement of simultaneous 95% coverage. The sample size is illustrative, not a general recommendation.

Suppose the decision rule requires the completion interval to lie above a worthwhile improvement of two percentage points and the error interval to lie below an unacceptable increase of half a percentage point.

The observed completion benefit is distinguishable from zero at the stated level, under the assumptions. Its size is still insufficiently resolved to meet the two-point criterion. The error result also leaves the unacceptable increase unresolved. The experiment therefore does not meet the stated release rule. Calling the error change “not statistically significant” would not establish safety.

All five foundations contribute. The definitions establish meaning; the assignment and recording establish the origin of the data; the control provides a comparison; the intervals preserve uncertainty; and the advance rule prevents redefining success around the outcome. A different defensible decision rule could lead to a different action, but it would not change what these observations establish.

## What is shared, and what remains disputed

Statistics contains genuine disagreements about the interpretation of probability, the measurement of evidence, and the role of decision thresholds. Frequentist procedures emphasise performance across repetitions. Bayesian inference represents uncertainty through probabilities conditional on models and prior information. These approaches can give different answers, particularly with limited information or different assumptions.

There is also disagreement about how statistical significance should be used. A 2019 editorial advocated abandoning the language of statistical significance; the ASA president’s task force subsequently defended properly used p-values and significance tests. Its 2021 statement should be distinguished from the ASA’s formal 2016 statement. The disagreement does not remove the need to explain uncertainty, assumptions, and practical consequences. [Benjamini and colleagues, 2021](https://magazine.amstat.org/blog/2021/08/01/task-force-statement-p-value/).

The five foundations are useful across these disagreements because they ask questions that a choice of statistical school cannot settle on its own. A model needs defensible measurements and data. A probability needs an interpretation. A causal claim needs a justified comparison. A decision needs an account of consequences. Every approach benefits from scrutiny capable of exposing consequential error.

## A compact way to apply the foundations

For an important quantitative claim, complete these five sentences. Treat each answer as something to substantiate, rather than a box to tick.

1. **Meaning:** “The claim concerns \_\_\_, measured as \_\_\_, for \_\_\_, over \_\_\_.”
2. **Data generation:** “These observations arose through \_\_\_; the main omissions, dependencies, and limits to generalisation are \_\_\_.”
3. **Comparison:** “The relevant alternative or baseline is \_\_\_; the comparison is justified because \_\_\_; the crucial assumptions are \_\_\_.”
4. **Uncertainty:** “The estimated quantity or effect is \_\_\_; the analysis supports this range \_\_\_; the important unresolved uncertainties are \_\_\_.”
5. **Correction:** “We would revise this conclusion if \_\_\_; our procedure could reveal that because \_\_\_; the evidence and analytical choices can be inspected at \_\_\_.”

A strong answer can be concise. It may justify a simple comparison, a carefully qualified estimate, or a decision to collect different evidence. Sometimes the rigorous conclusion is that the available data cannot distinguish the alternatives that matter.

The useful stopping point is neither maximal complexity nor perfect certainty. It is a claim whose meaning is clear, whose connection to the observations is defensible, whose remaining uncertainty is visible, and whose important vulnerabilities have been seriously examined.

## Sources

The references below link directly to original articles, official publications, or authors’ institutional copies. The framework, cross-context applications, and numerical illustrations are analytical synthesis. Methodological arguments should be distinguished from empirical evidence that a particular procedure works in a particular setting.

1. **Cronbach, L. J., and Meehl, P. E. (1955).** [Construct Validity in Psychological Tests](https://meehl.umn.edu/sites/meehl.umn.edu/files/files/036constructvalidityidx.pdf). *Psychological Bulletin*, 52(4), 281–302. Foundational argument about the evidence required to interpret measurements; author’s institutional archive.

2. **Meng, X.-L. (2018).** [Statistical Paradises and Paradoxes in Big Data (I): Law of Large Populations, Big Data Paradox, and the 2016 US Presidential Election](https://cces.gov.harvard.edu/publications/statistical-paradises-and-paradoxes-big-data-i-law-large-populations-big-data). *Annals of Applied Statistics*, 12(2), 685–726. Mathematical analysis and empirical illustration of selection error; Harvard publication page with the original abstract.

3. **Hurlbert, S. H. (1984).** [Pseudoreplication and the Design of Ecological Field Experiments](https://esajournals.onlinelibrary.wiley.com/doi/10.2307/1942661). *Ecological Monographs*, 54(2), 187–211. Foundational account of experimental replication and dependence; publisher’s article page.

4. **Pearl, J. (2009).** [Causal Inference in Statistics: An Overview](https://ftp.cs.ucla.edu/pub/stat_ser/r350.pdf). *Statistics Surveys*, 3, 96–146. Formal foundations of causal assumptions, comparisons, and identification; author’s institutional copy. Sections 2 and 3.3 are especially relevant.

5. **NIST/SEMATECH (undated).** [Randomized Block Designs](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm). *e-Handbook of Statistical Methods*, section 5.3.3.2. Official technical guidance on organising comparisons around sources of variation.

6. **Dmitriev, P., Gupta, S., Kim, D. W., and Vaz, G. (2017).** [A Dirty Dozen: Twelve Common Metric Interpretation Pitfalls in Online Controlled Experiments](https://www.microsoft.com/en-us/research/uploads/prod/2020/08/2017-08-KDDMetricInterpretationPitfalls.pdf). *Proceedings of KDD 2017*, 1427–1436. Industry case evidence about measurement interpretation; authors’ organisation hosts the paper. Section 5.2 addresses denominators.

7. **American Statistical Association (2016).** [Statement on Statistical Significance and P-Values: Official Release](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf). 7 March 2016. The association’s release reproduces its six principles and identifies the accompanying article by Wasserstein and Lazar.

8. **Greenland, S., Senn, S. J., Rothman, K. J., Carlin, J. B., Poole, C., Goodman, S. N., and Altman, D. G. (2016).** [Statistical Tests, P Values, Confidence Intervals, and Power: A Guide to Misinterpretations](https://link.springer.com/article/10.1007/s10654-016-0149-3). *European Journal of Epidemiology*, 31, 337–350. Detailed methodological clarification; open-access publisher version.

9. **Lakens, D. (2017).** [Equivalence Tests: A Practical Primer for t Tests, Correlations, and Meta-Analyses](https://pure.tue.nl/ws/portalfiles/portal/80918653/lakeequi2017.pdf). *Social Psychological and Personality Science*, 8(4), 355–362. Explains evidence for sufficiently small effects; author’s institutional copy.

10. **Lakens, D. (2022).** [Sample Size Justification](https://online.ucpress.edu/collabra/article/8/1/33267/120491/Sample-Size-Justification). *Collabra: Psychology*, 8(1), 33267. Connects information requirements to inferential aims; open-access publisher version.

11. **Gneiting, T., Balabdaoui, F., and Raftery, A. E. (2007).** [Probabilistic Forecasts, Calibration and Sharpness](https://doi.org/10.1111/j.1467-9868.2007.00587.x). *Journal of the Royal Statistical Society: Series B*, 69(2), 243–268. Formal framework and forecasting application; permanent DOI link to the original article.

12. **Gelman, A., and Loken, E. (2013).** [The Garden of Forking Paths](https://sites.stat.columbia.edu/gelman/research/unpublished/forking.pdf). Author manuscript, 14 November 2013. Explains data-dependent analytical choices and multiplicity; hosted by the author’s institution.

13. **Johari, R., Koomen, P., Pekelis, L., and Walsh, D. (2021 online; 2022 issue).** [Always Valid Inference: Continuous Monitoring of A/B Tests](https://pubsonline.informs.org/doi/10.1287/opre.2021.2135). *Operations Research*, 70(3), 1806–1821. Formal treatment of inference with ongoing monitoring; original publisher version.

14. **Nosek, B. A., Ebersole, C. R., DeHaven, A. C., and Mellor, D. T. (2018).** [The Preregistration Revolution](https://pmc.ncbi.nlm.nih.gov/articles/PMC5856500/). *Proceedings of the National Academy of Sciences*, 115(11), 2600–2606. Methodological case for distinguishing discovery from testing; original article archived in PubMed Central. Its argument is not a guarantee that registration makes a study valid.

15. **Gelman, A., and Shalizi, C. R. (2013).** [Philosophy and the Practice of Bayesian Statistics](https://sites.stat.columbia.edu/gelman/research/published/philosophy.pdf). *British Journal of Mathematical and Statistical Psychology*, 66, 8–38. A methodological and philosophical position emphasising model checking and revision; author’s institutional copy.

16. **National Academies of Sciences, Engineering, and Medicine (2019).** [Reproducibility and Replicability in Science, Chapter 3: Understanding Reproducibility and Replicability](https://www.nationalacademies.org/read/25303/chapter/6). National Academies Press. Consensus report defining the distinction between recomputation and studies with new data.

17. **Benjamini, Y., and colleagues (2021).** [The ASA President’s Task Force Statement on Statistical Significance and Replicability](https://magazine.amstat.org/blog/2021/08/01/task-force-statement-p-value/). *Annals of Applied Statistics*, 15(3), 1084–1085; reproduced by the ASA in *Amstat News*, 1 August 2021. Task-force position on uncertainty, thresholds, and proper use of significance tests.
