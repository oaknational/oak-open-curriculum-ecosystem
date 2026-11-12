# Profiles and their activation

Profiles add the detail a subject and its consequences require. They stack; they are not exclusive
levels. Start from [the common record](specification-record.md) and apply the triggers below; a
deliberate omission needs a reason when its trigger is present. Owned with `specify`. Source: the
specification framework note, §6.

| Profile | Activate when | Additional content |
| --- | --- | --- |
| Public or service purpose | Claims concern human or public value | Intended outcomes, affected and excluded groups, theory of change, alternatives, costs, distribution, public accountability and the limits of controllable commitments |
| Experience and delivery | People undertake a journey or receive support | Needs and their evidence status, entry and exit, before, during and after, channels, actors, handoffs, accommodations, failure, correction, human discretion and reachable support |
| Domain meaning | Terms or relationships carry consequential interpretation | Definitions, identity, units, relation semantics, provenance, contextual meaning, uncertainty, competing interpretations, examples and counterexamples |
| Data and stewardship | Data is captured, derived, retained, disclosed or corrected | Source and record authority, quality, minimisation, provenance, lineage, permitted use, retention and deletion, correction propagation, reference access and the applicable responsibilities |
| Behaviour and interface | Another system or person relies on a boundary | Inputs and outputs, effects, states and transitions, pre- and postconditions, errors, ordering, concurrency, idempotency, cancellation, deadlines, versioning and discoverability |
| Engineering unit | A computation or data structure is independently used | Mathematical or domain definition, admissible inputs, invariants, determinism, mutation and aliasing, termination, failure and resource complexity |
| Agent or AI behaviour | A model or agent interprets instructions or chooses actions | Role, task, tool authority, context, prohibited effects, uncertainty and refusal, escalation, configuration dependencies, evaluation distributions, failure severity and containment |
| Operations and continuity | Behaviour depends on a running service or organisation | Service levels, workloads, resource and cost bounds, observability, incident response, recovery, support capacity, external dependencies, exit and retirement |
| Governance and authority | Responsibilities cross people or organisations, or decisions affect others | Decision rights, delegation scope and revocation, obligations, challenge and redress, conflicts, assurance independence, procurement and exit responsibilities |
| Measurement and assurance | A score, test, inference or evaluation justifies reliance | Construct, claim, oracle or rubric, test or evaluation design, validity, uncertainty, coverage, dependence, evidence freshness, thresholds and decision consequences |
| Research and exploratory project | The output or route is intentionally uncertain | Inquiry and purpose, permissible variation, ethical and resource constraints, methods, stopping conditions, negative-result treatment, reproducibility where applicable and handoff; no obligation to produce a favourable finding |

## Cross-cutting concerns

Security, privacy, accessibility, safety, inclusion, sustainability and maintainability apply
wherever their mechanism is present, never as a final "non-functional" appendix. A changed authority
check changes allowed behaviour; an unusable recovery route changes whether the service exists for a
person.

## Quantitative targets

A quantitative target names its unit, population or workload, denominator, percentile or
distribution, measurement boundary, time window, exclusions, threshold authority and the action on
breach. "Fast", "accurate", "fair" and "high availability" name no assessable obligation. Values are
selected for the actual case; the framework invents none.

## Specialist domains

Physical safety, regulated decisions, financial transactions and other constrained domains add their
own profiles; the common record never replaces their substantive standards or qualified judgement.
For non-software work, the implementation may be an operating procedure, a trained team or a physical
arrangement.
