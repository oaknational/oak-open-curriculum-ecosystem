# Practice learning handoff

The skill identifies and structures learning; the embedding Practice owns durable memory and governed skill improvement.

## Emit a handoff when

- SRM, bucketing, identity, exposure, join, or telemetry defects are found;
- a metric moves contrary to its construct or long-term outcome;
- novelty, seasonality, interference, or heterogeneous effects overturn a decision;
- a guardrail, accessibility, privacy, safeguarding, or distributional issue changes future practice;
- a sizing, sequential, variance-reduction, or decision rule performs materially differently from expectation;
- rollout outcomes contradict the experiment;
- this skill or its sibling triggered incorrectly, failed to trigger, or composed poorly.

## Handoff record

```yaml
observed_at: ISO-8601 timestamp
inquiry_id: stable identifier
experiment_id: stable identifier
skill: parallax-product-experiment
skill_version: known version or unknown
signal_type: surprise | correction | platform-defect | metric-validity | routing | method-performance | continuity
observation: what happened
evidence: inspectable artifact, query, incident, or outcome references
expected: what the protocol or theory predicted
scope: products, surfaces, populations, periods, and platforms to which it may transfer
scale_context: assignment, exposure, measurement, inference, rollout, and outcome scales
confidence: low | medium | high
urgency: immediate | next-consolidation | portfolio-review
proposed_destination: active-napkin | operational | distilled-candidate | pattern-candidate | skill-eval
proposed_change: optional and never automatic
revisit_when: evidence or date that should reopen the lesson
```

## Host responsibility

In an Oak-style Practice, propose routing to:

- `.agent/memory/active/napkin.md` for fresh learning;
- `.agent/memory/operational/` for an active rollout, incident, or monitoring obligation;
- `.agent/memory/active/distilled.md` only after consolidation;
- `.agent/memory/active/patterns/` for grounded recurring cases;
- per-skill or collection evals for invocation, composition, and behaviour regressions.

Do not write memory without host authorisation. Do not patch a canonical skill from one experiment. Consolidate across evidence, propose a versioned change, compare with a baseline, run regressions, obtain review, and test whether later product outcomes improve.
