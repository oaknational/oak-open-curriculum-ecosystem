# Metrics, sizing, and inference

Use this reference when defining metrics, estimating traffic/duration, selecting inference, or interpreting results.

## Metric contract

For every metric record:

- construct and role: primary, guardrail, diagnostic, data quality, exploratory, or long-term;
- numerator, denominator, event source, eligibility, unit, aggregation, window, and direction;
- version, owner, latency, missingness, bot/internal filtering, and validity evidence;
- smallest practically consequential change and harmful bound;
- expected mechanism and alternative reasons it could move.

Prefer metrics connected to user or public value. A sensitive proxy is useful only with an explicit and monitored proxy-to-outcome bridge.

## Sizing and duration

Choose a practically relevant effect range before a sample size. Record baseline/variance, allocation, interval-width or power criterion, alpha/error policy, eligibility and exposure rate, clustering/repeated observations, attrition, outliers, covariance adjustment, number of variants and outcomes, interim policy, and analysis method.

Present sensitivity across plausible assumptions. Include at least one full weekly/service cycle and relevant operational periods; account for novelty, learning, carryover, delayed conversions, retention, school terms, billing cycles, or other domain rhythms.

Do not use post-hoc observed power to interpret a completed test. Use the effect estimate, interval, decision-relevant region, and sensitivity analyses.

## Variance and metric form

Inspect skew, zero inflation, heavy tails, repeated events, ratios, and denominator instability. Estimate uncertainty at the randomisation/dependence unit, not the event row.

Covariate adjustment, CUPED, stratification, and regression can improve precision when based on pre-assignment information and prespecified or mechanically governed. Validate missing pre-period data, new users, changing covariance, and implementation. Variance reduction does not repair biased assignment, post-treatment selection, or invalid constructs.

## Peeking and sequential decisions

Choose one coherent policy:

- fixed horizon with no effect-based early decision;
- group-sequential or alpha-spending monitoring;
- always-valid/e-process or sequential probability method;
- Bayesian decision thresholds with calibrated operating characteristics;
- a platform method whose estimand, assumptions, and implementation have been verified.

Safety and severe guardrail monitoring may operate continuously under separate rules. Document who sees which results and what actions each view permits. Extending a fixed-horizon test because it almost reached significance is an unplanned adaptive rule.

## Multiplicity and heterogeneity

Define the decision family across variants, primary metrics, key secondaries, segments, and repeated looks. Use a justified error-control, hierarchical, shrinkage, or decision framework. Guardrails may use asymmetric risk thresholds rather than the same rule as benefit metrics.

Predefine segments tied to mechanisms, equity, accessibility, or rollout decisions. Report uncertainty and interaction evidence; a significant result in one slice and non-significant result in another does not by itself establish a difference. Treat exploratory slicing as hypothesis generation.

## Practical interpretation

Report:

- absolute and relative changes where each aids interpretation;
- uncertainty intervals and compatibility with practical thresholds;
- primary, guardrail, harm, quality, and diagnostic results together;
- novelty, seasonality, interference, missingness, and deviations;
- distribution across affected groups;
- implementation costs and opportunity costs;
- what remains unknown at longer outcome scales.

## Primary and official practitioner sources

- [Microsoft Research: Beyond power analysis—metric sensitivity in A/B tests](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/beyond-power-analysis-metric-sensitivity-in-a-b-tests/)
- [Microsoft Research: Deep dive into variance reduction](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/deep-dive-into-variance-reduction/)
- [Microsoft Research: Pitfalls of long-term online controlled experiments](https://www.microsoft.com/en-us/research/publication/pitfalls-of-long-term-online-controlled-experiments/)
- [Statsig official documentation: Frequentist sequential testing](https://docs.statsig.com/experiments/advanced-setup/sequential-testing)
- [Statsig official documentation: CUPED](https://docs.statsig.com/experiments/statistical-methods/methodologies/cuped)
- [FDA: Multiple Endpoints in Clinical Trials](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/multiple-endpoints-clinical-trials)

Vendor implementations differ. Verify the precise method, defaults, version, and decision semantics of the platform actually used.
