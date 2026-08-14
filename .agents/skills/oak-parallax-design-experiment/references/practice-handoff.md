# Practice learning handoff

Skills provide reflexivity; the embedding Practice provides durable memory and governed improvement.

## Emit a handoff when

- an assumption fails unexpectedly;
- a recurring design, measurement, analysis, or invocation failure appears;
- a method performs materially better or worse than predicted;
- a cross-scale bridge succeeds or fails outside its expected validity domain;
- a safety, accessibility, or equity issue changes future practice;
- a real-world outcome contradicts the experimental endpoint or decision model;
- the skill description triggered unnecessarily, failed to trigger, or routed to the wrong sibling.

## Handoff record

Include:

```yaml
observed_at: ISO-8601 timestamp
inquiry_id: stable identifier
skill: parallax-design-experiment
skill_version: known version or unknown
signal_type: surprise | correction | pattern-candidate | routing | method-performance | continuity
observation: what happened
evidence: inspectable artifacts or outcome references
expected: what the plan predicted
scope: where the lesson may and may not transfer
scale_context: relevant assignment, measurement, inference, and outcome scales
confidence: low | medium | high
urgency: immediate | next-consolidation | portfolio-review
proposed_destination: active-napkin | operational | distilled-candidate | pattern-candidate | skill-eval
proposed_change: optional, never applied automatically
revisit_when: evidence or date that should reopen the lesson
```

## Host responsibility

If the embedding Practice follows the Oak layout, propose rather than assume routing to:

- `.agent/memory/active/napkin.md` for fresh learning;
- `.agent/memory/operational/` for live continuity and monitored outcomes;
- `.agent/memory/active/distilled.md` after cross-case consolidation;
- `.agent/memory/active/patterns/` for grounded recurring instances;
- skill or collection evals for invocation and behaviour regressions.

Do not write memory unless authorised by the host workflow. Do not edit a canonical skill from a single signal. Improvement requires consolidation, a versioned proposal, baseline comparison, regression evaluation, review, and later world-return evidence.
