# ADR-144: Two-Threshold Fitness Model

**Status**: Accepted
**Date**: 2026-04-01
**Related**: [ADR-131 (Self-Reinforcing Improvement Loop)](131-self-reinforcing-improvement-loop.md), [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md)

## Context

The original fitness function system used a single `fitness_line_count`
field per governed document. This field served two conflicting
purposes: a soft signal to refine a file ("it's getting long") and a
hard boundary to enforce ("never exceed this"). Because agents could
extend `fitness_line_count` without friction, the ceiling inflated
over time — defeating the governance purpose.

Additionally, only three files (the Practice Core trinity) had
character-count and line-width limits. The remaining eleven governed
files had no character or prose-width governance at all.

## Decision

Replace the single-field model with a four-field two-threshold model
in YAML frontmatter:

| Field                 | Threshold | Semantics                                            |
| --------------------- | --------- | ---------------------------------------------------- |
| `fitness_line_target` | Soft      | Signal to refine; agents may extend modestly         |
| `fitness_line_limit`  | Hard      | Cannot exceed without user approval                  |
| `fitness_char_limit`  | Hard      | Character ceiling; non-adjustable                    |
| `fitness_line_length` | Hard      | Prose line width ceiling; non-adjustable, always 100 |

### Key Principles

1. **All hard limits are constants, not formulas.** They are set once
   per file and do not grow with content.

2. **Target exceedance is a warning (exit 0 in strict mode).** It
   signals that a file would benefit from distillation, compression,
   or splitting — but it never blocks work.

3. **Limit exceedance is a blocking violation (exit 1 in strict
   mode).** The file must be refined, split, or — with explicit user
   approval — the limit may be raised.

4. **`fitness_char_limit` and `fitness_line_length` are
   non-adjustable.** Only the user may change them, and only in
   exceptional circumstances.

5. **Fitness management does not block graduation.** Graduation
   checks stability and natural home; fitness management runs after
   graduation as a separate concern.

6. **No backward compatibility.** Per `principles.md`: "NEVER create
   compatibility layers." The old `fitness_line_count` and
   `fitness_char_count` fields are removed in the same change.

## Consequences

### Positive

- Clear separation between a refinement signal (target) and a hard
  boundary (limit) prevents runaway inflation
- Consistent coverage: all governed files now have character and
  prose-width limits, not just the Practice Core trinity
- The validator output distinguishes warnings from violations,
  giving agents actionable guidance without blocking progress

### Negative

- Each governed file now has four frontmatter fields instead of one
  to three — modest increase in metadata

### Neutral

- Validator complexity increases modestly (one additional threshold
  comparison per file, one new output category)
- The `fitness_line_target` value inherits the old
  `fitness_line_count` value; `fitness_line_limit` is set at
  approximately 1.3x target as initial headroom
