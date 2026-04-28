# Capture Practice Tool Feedback

Operationalises
[PDR-011](../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md),
[PDR-014](../practice-core/decision-records/PDR-014-graduation-and-archive-protocol.md),
[PDR-024](../practice-core/decision-records/PDR-024-vital-integration-surfaces.md),
and
[ADR-131](../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md).

When you use the Practice itself, or a host-local tool that implements a
Practice capability, capture fresh feedback in the napkin.

This is not limited to failures. Record frustrations, friction, surprises,
insights, ideas, wishlist items, and general impressions while they are
still close to the work. These subjective and ergonomic signals are
first-class evidence for the capture -> distil -> graduate loop.

For this repo, `agent-tools` is a TypeScript-specific implementation surface
for capabilities that should exist in every hydrated Practice. In another
repo, the equivalent host-local surface may be a shell script, Python tool,
editor extension, CI job, or something else. Capture the feedback at the
behaviour level so consolidation can separate portable Practice substance
from local implementation details.

## Suggested Napkin Shape

```markdown
### Practice/tooling feedback

- **Surface**: `Practice` | `agent-tools:<command>` | `<host-equivalent>`
- **Signal**: friction | insight | idea | wishlist | impression | surprise
- **Observation**: what happened or how it felt in use
- **Behaviour change / candidate follow-up**: what should change if this
  signal repeats or is strong enough now
- **Source plane**: `active` | `operational` | `executive` (optional)
```

Use the standard surprise format instead when the feedback is primarily an
expectation failure. Add `Source plane: executive` when the observation is
about an executive-memory catalogue or register.

## Related Surfaces

- [napkin skill](../skills/napkin/SKILL.md) — active capture surface.
- [executive-memory drift rule](executive-memory-drift-capture.md) —
  required executive-plane tag guidance.
- [agent-tools workspace](../../agent-tools/) — current host-local
  TypeScript implementation surface for several Practice capabilities.
