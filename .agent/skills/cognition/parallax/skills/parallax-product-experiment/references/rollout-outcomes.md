# Ramping, affected parties, and durable outcomes

Use this reference for the pre-run gate, experiment stop policy, ship decision, ramp, rollback, or World-Return Contract.

## Affected-party gate

Identify users, non-users whose outcomes may change, staff, support teams, content or service providers, communities, and downstream systems. Examine:

- accessibility and assistive-technology behaviour;
- privacy, consent/lawful basis, cookies, profiling, and data minimisation;
- safeguarding, vulnerability, manipulation, dark patterns, and meaningful choice;
- unequal error, exclusion, cost, time, cognitive burden, and service access;
- security, reliability, performance, capacity, and operational workload;
- effects on people outside the randomised unit.

Do not ship a mean improvement that violates a right, mandatory standard, safety bound, or severe group guardrail. Lack of power to detect harm is not evidence of safety.

## Ramp plan

Define stages such as internal or synthetic validation, minimal live traffic, limited ramp, planned experimental allocation, decision, progressive rollout, and full operation. For every stage state:

- allocation and eligible population;
- duration or information gate;
- reliability, data-quality, user-harm, and statistical checks;
- decision owner and incident contact;
- kill switch, rollback mechanism, recovery verification, and communication;
- whether data remain confirmatory after a stop or configuration change.

Preserve stable assignment across ramp stages unless the estimand explicitly requires reassignment. Do not use unequal emergency ramping and later analyse it as the original randomised protocol.

## Decision record

Separate what the experiment established from the chosen action. Record:

- effect and uncertainty relative to practical thresholds;
- guardrails, harms, accessibility, and segment distribution;
- theory-of-change support and alternative explanations;
- strategic fit, opportunity cost, implementation cost, reversibility, and dependencies;
- ship/no-ship/partial-rollout/redesign options;
- dissent, unresolved uncertainty, authority, and review date.

## World-Return Contract

After shipping, monitor whether the intervention survives contact with broader traffic and time. Include:

- immediate technical and user-experience signals;
- adoption, behaviour, retention, quality, satisfaction, and mission outcomes;
- excluded, low-volume, accessibility, and vulnerable populations;
- novelty decay, learning, seasonality, market/ecosystem response, and organisational adaptation;
- short, medium, and long observation windows;
- owners, thresholds, rollback and reopening conditions;
- whether a persistent holdout is proportionate and ethical;
- the method-performance and routing questions to revisit.

A statistically sound short experiment can still be a poor predictor of durable product impact. Make that bridge inspectable.

## Primary and official sources

- [Microsoft Research: During-experiment trustworthiness patterns and auto-shutdown](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/)
- [Microsoft Research: Pitfalls of long-term online controlled experiments](https://www.microsoft.com/en-us/research/publication/pitfalls-of-long-term-online-controlled-experiments/)
- [GOV.UK: A/B testing comparative studies for digital health products](https://www.gov.uk/guidance/ab-testing-comparative-studies)
- [GOV.UK Service Manual: Getting an accessibility audit](https://www.gov.uk/service-manual/helping-people-to-use-your-service/getting-an-accessibility-audit)
- [W3C: Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [UK Information Commissioner's Office: Guide to PECR](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/)

Determine current law, organisational policy, and specialist review for the actual service and population.
