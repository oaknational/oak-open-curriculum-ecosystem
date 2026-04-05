---
name: Substance Before Fitness
use_this_when: Writing concepts to files that have size/fitness limits
category: process
proven_in: .agent/practice-core/practice.md
proven_date: 2026-04-05
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Artificially compressed concepts that fail to teach because they were shaped by a character budget rather than by their own substance"
  stable: true
---

## Principle

When writing concepts to their correct permanent homes, always write at
the weight the concept deserves first. Deal with fitness limits
holistically afterward — through compression of redundant content
elsewhere, splitting, or raising limits. Fitness is a post-writing
editorial concern, never a writing constraint.

## Pattern

1. **Write the concept fully** at the weight it deserves, in every
   location where it belongs.
2. **Run fitness checks** after writing is complete.
3. **Compress holistically** — find redundancy, verbosity, and
   duplication _elsewhere_ in the file, not in the concept you just
   wrote.
4. If compression is insufficient, **split** the file by
   responsibility or **raise limits** with rationale.

## Anti-pattern

Checking the character count after each sentence and trimming the
concept to fit. This produces content shaped by a budget rather than by
the concept's own substance. The result looks complete but fails to
teach — key connections, examples, and implications are silently
dropped. The agent is often unaware they are doing this until the user
notices the concept is underweight.

## When to Apply

Any time you are writing to a file with `fitness_line_target`,
`fitness_char_limit`, or similar size constraints in its frontmatter.
Also applies to any documentation with informal size expectations.
