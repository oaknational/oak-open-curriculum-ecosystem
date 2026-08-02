# Assignment, exposure, and integrity

Use this reference when implementing or auditing bucketing, exposure, identity, data joins, SRM, interference, or concurrent experiments.

## Assignment contract

Define:

- randomisation unit and why it matches the intervention mechanism;
- stable unit identifier, namespace, salt/version, allocation ratio, and ramp behaviour;
- eligibility before assignment;
- mutual-exclusion layers and concurrent experiment policy;
- variant configuration and cache/client/server consistency;
- exposure event, counterfactual exposure logging, and outcome attribution window;
- analysis unit and dependence-aware variance estimation;
- reassignment, account merging, login changes, cross-device identity, cookie deletion, and bot/internal traffic policies.

Persist assignment independently of whether an outcome event arrives. Avoid conditioning inclusion on treatment-affected behaviour.

## Exposure and triggered analysis

An exposure event should mean the unit could plausibly experience the intervention, not merely that code was evaluated. Log the same pre-treatment or counterfactual trigger in every condition.

Report the assignment effect for the rollout population unless a different estimand is explicit. A triggered analysis can improve sensitivity, but a post-treatment trigger can select different populations across variants. Check untriggered counts and effects, treatment-by-trigger logic, and whether the trigger existed identically in control.

## Sample-ratio mismatch

Compare observed assignment-unit counts with the configured allocation before inspecting effects. Use a prespecified conservative alert threshold appropriate to traffic and the number of tests; do not rely on visual 50/50 balance.

Treat SRM as a symptom, not a nuisance covariate. Diagnose:

- bucketing, salt, allocation, or identity errors;
- unequal ramps or self-selection;
- redirects, caching, client failure, crashes, or performance differences;
- treatment-dependent telemetry or bot filtering;
- event loss, delayed data, joins, deduplication, or analysis filters;
- triggered populations and eligibility implemented differently by variant;
- carryover from earlier assignments.

Stop or quarantine confirmatory inference until the cause and affected population are understood. Do not delete a segment merely to remove SRM. If a defensible unaffected population remains, define it without inspecting outcome advantages and label the revision.

## A/A tests and pre-experiment checks

Use A/A tests selectively to validate assignment, metric false-positive behaviour, joins, latency, variance, and alerting. They cannot prove future intervention logging is symmetric. Also perform deterministic tests, simulations, event replays, and invariant checks.

Check pre-experiment balance for important covariates and metrics. Chance imbalance is compatible with correct randomisation; systematic or repeated imbalance indicates platform defects. Do not use balance significance tests as a substitute for randomisation and SRM audits.

## Interference and concurrency

Ask whether one unit's treatment affects another unit's outcome through collaboration, markets, ranking, inventory, queues, classrooms, households, organisations, social networks, or shared infrastructure. If material, consider cluster assignment, saturation designs, switchbacks, geo designs, or explicit interference estimands.

Concurrent experiments are not automatically invalid. Record shared surfaces, mechanisms, metrics, units, and suspected interactions. Use mutual exclusion or factorial designs when interaction is plausible and consequential; otherwise monitor and test rather than serialising every experiment.

## Primary practitioner sources

- [Microsoft Research: Diagnosing Sample Ratio Mismatch in A/B Testing](https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/)
- [Microsoft Research: Diagnosing SRM—taxonomy and practitioner rules](https://www.microsoft.com/en-us/research/publication/diagnosing-sample-ratio-mismatch-in-online-controlled-experiments-a-taxonomy-and-rules-of-thumb-for-practitioners/)
- [Microsoft Research: Alerting in the Experimentation Platform](https://www.microsoft.com/en-us/research/articles/alerting-in-microsofts-experimentation-platform-exp/)
- [Microsoft Research: A/B interactions and concurrent experiments](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/a-b-interactions-a-call-to-relax/)
- [GOV.UK developer documentation: How A/B testing works](https://docs.publishing.service.gov.uk/manual/ab-testing.html)

These show production patterns, not universal defaults. Calibrate thresholds and implementation to the platform and decision.
