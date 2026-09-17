# Validity, analysis, and interpretation

Use this reference while designing measurement, analysing results, or auditing a protocol.

## Threat model

Examine at least these validity layers:

- **Construct:** Do operations measure and manipulate the intended concepts?
- **Statistical conclusion:** Are dependence, variance, multiplicity, model assumptions, missingness, and selection represented?
- **Internal:** Could confounding, leakage, history, maturation, attrition, contamination, non-compliance, or measurement change explain the result?
- **External:** To which people, settings, implementations, times, and intervention variants can the result travel?
- **Implementation:** Was the intervention delivered, encountered, and sustained as intended?
- **Decision:** Does the estimated effect answer the decision, including costs, harms, distribution, and reversibility?

Treat each movement between these layers as a bridge claim.

## Analysis-plan minimum

Predefine:

- analysis population and its relationship to the estimand;
- primary estimator and uncertainty interval;
- covariates, contrasts, transformations, and coding;
- dependence, clustering, repeated-measure, or time-series structure;
- exclusions and outlier policy;
- missing-data assumptions and sensitivity analyses;
- multiplicity and interim policy;
- model diagnostics and failure behaviour;
- confirmatory versus exploratory heterogeneity analyses;
- robustness, falsification, negative-control, or placebo analyses;
- reproducible software, versions, seeds, and provenance.

Do not automatically choose intention-to-treat, per-protocol, as-treated, or complier analyses by slogan. Choose the analysis whose assumptions and target population align with the explicit estimand; often report more than one with clear interpretation.

## Measurement checks

- Establish validity for the actual population, language, setting, device, and mode of administration.
- Calibrate instruments and telemetry; record version changes.
- Separate primary outcomes from proxies and intermediate measures.
- Evaluate ceiling/floor effects, responsiveness, reliability, and missingness mechanisms.
- Keep outcome ascertainment comparable across conditions.
- Blind participants, operators, assessors, or analysts where feasible and relevant; otherwise model and discuss likely biases.
- Audit whether being measured changes behaviour differently between conditions.

## Interpretation contract

Report:

- effect magnitude and interval, not only a test decision;
- practical significance relative to the declared decision threshold;
- harms, burdens, distributional effects, and unexpected outcomes;
- sensitivity to plausible assumptions and alternative specifications;
- deviations and all prespecified primary outcomes;
- validity domain and unsupported extrapolations;
- evidence that challenges the preferred explanation;
- which next observation would most reduce consequential uncertainty.

Separate exploratory discovery from confirmation. A novel pattern can justify a new revision or experiment; it does not retroactively become preregistered evidence.

## Reporting sources

- [CONSORT–SPIRIT official site: 2025 randomised-trial reporting and protocol guidance](https://www.consort-spirit.org/)
- [CONSORT 2025 Statement, JAMA](https://jamanetwork.com/journals/jama/fullarticle/2832868)
- [ICH E9 statistical principles at EMA](https://www.ema.europa.eu/en/ich-e9-statistical-principles-clinical-trials-scientific-guideline)
- [HM Treasury: The Magenta Book](https://www.gov.uk/government/publications/the-magenta-book)

Use the reporting guideline appropriate to the study type. Reporting compliance does not itself establish design validity.
