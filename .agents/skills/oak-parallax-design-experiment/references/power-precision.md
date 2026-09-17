# Power, precision, and information

Use this reference to size or critique an experiment. Power is conditional on a model and assumptions; it is not a property of a sample size alone.

## Begin with the decision

Specify:

- smallest effect of substantive interest or a decision-relevant effect range;
- loss from false positive, false negative, imprecise, or delayed decisions;
- required interval width, probability of correct selection, expected value of information, posterior decision probability, or frequentist power;
- feasible recruitment, exposure, duration, cost, and ethical limits.

If no effect threshold is substantively meaningful, present precision or information across feasible sample sizes rather than inventing one.

## Record every sizing assumption

- estimand, outcome distribution, baseline rate or variance;
- analysis method and covariates;
- alpha or error allocation, sidedness, and target power when applicable;
- allocation ratio;
- clustering and intraclass correlation, repeated measures, pairing, or serial correlation;
- number of arms, outcomes, looks, contrasts, segments, and multiplicity policy;
- attrition, missingness, non-compliance, crossover, contamination, and eligibility/exposure rate;
- finite-population or recruitment constraints;
- anticipated heterogeneity and minimum subgroup sizes;
- stopping, adaptation, re-estimation, and simulation rules.

Report the source and uncertainty of each assumption. Pilot estimates are noisy; historical data may come from a different regime.

## Prefer sensitivity surfaces

Show how precision or power changes across plausible effect, variance/base-rate, ICC, attrition, and duration scenarios. Include pessimistic and boundary cases. Avoid reporting only the scenario chosen to justify a desired sample size.

For cluster designs, vary both cluster count and cluster size. More units inside a few clusters cannot substitute indefinitely for independent clusters.

For rare binary outcomes, ratios, heavy-tailed outcomes, nonlinear estimators, complex missingness, sequential/adaptive designs, or interference, use simulation aligned to the planned estimator. Verify simulation code against an analytically tractable special case.

## Multiplicity and repeated looks

Define the family of claims for which error control matters. Distinguish primary, key secondary, safety/guardrail, and exploratory outcomes. Choose ordering, gatekeeping, family-wise error, false-discovery, multilevel modelling, or another justified policy before seeing effects.

Repeated fixed-horizon tests at each interim look inflate error. Use a prespecified group-sequential, alpha-spending, always-valid, Bayesian, or other coherent monitoring rule. Record what information may be seen, by whom, and which decisions it can trigger.

Adaptive modifications must be prospectively specified or clearly labelled exploratory. Simulate type-I error, power, bias, interval coverage, expected sample size, and operational failure under realistic drift and delays.

## Precision after the result

Do not perform "observed power" based on the observed effect as a substitute for the confidence or credible interval. Report the estimate, uncertainty interval, compatibility with decision-relevant effects, and design-specific sensitivity analyses.

A non-significant result is not evidence of equivalence. Use a justified equivalence or non-inferiority margin and an appropriate design when negligible difference is the claim of interest.

## Primary sources and standards

- [ICH E9 statistical principles and E9(R1) estimands addendum at EMA](https://www.ema.europa.eu/en/ich-e9-statistical-principles-clinical-trials-scientific-guideline)
- [FDA: E9(R1) Estimands and Sensitivity Analysis](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/e9r1-statistical-principles-clinical-trials-addendum-estimands-and-sensitivity-analysis-clinical)
- [FDA: Multiple Endpoints in Clinical Trials](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/multiple-endpoints-clinical-trials)
- [FDA: Adaptive Design Clinical Trials for Drugs and Biologics](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/adaptive-design-clinical-trials-drugs-and-biologics-guidance-industry)

The regulatory sources provide unusually explicit treatments of estimands, multiplicity, and adaptation. Transfer principles only where their assumptions fit; they do not replace domain-specific governance.
