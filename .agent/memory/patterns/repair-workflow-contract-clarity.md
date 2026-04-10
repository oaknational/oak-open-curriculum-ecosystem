---
name: "Repair workflow contract clarity"
use_this_when: "A workflow repairs or transforms the same content across multiple artefacts or locations, and ambiguous verbs could trigger rewrite or promotion drift"
category: process
proven_in: "2026-04-03 protocol/interoperability report repair and consolidation"
proven_date: 2026-04-03
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Allowing 'normalise', 'canonical', or similar wording to blur source precedence, non-goals, and landing zone in multi-artefact workflows"
  stable: true
---

# Repair Workflow Contract Clarity

## Principle

When a workflow repairs content across multiple surviving artefacts or
locations, the instructions must declare four things up front:

- the primary source for structure and content
- the secondary recovery surfaces and what they are allowed to repair
- the forbidden modes (for example: not summary, not rewrite, not promotion)
- the output contract (overwrite in place, create a sibling clean copy, or
  promote into a different tracked home)

Without all four, verbs such as `normalise`, `canonicalise`, `clean up`, or
`consolidate` invite the wrong behaviour even when the overall intent looks
clear to the author.

## Pattern

1. Name the strongest surviving source and make it primary for prose and
   structure.
2. Name each secondary artefact and restrict its role explicitly
   (for example: DOCX for link recovery only).
3. State the non-goals in plain language near the top of the workflow:
   not editorial rewrite, not summary, not synthesis.
4. State the landing contract before any implementation guidance:
   overwrite raw, create a sibling clean copy, or defer promotion.
5. Match validation to the actual estate being edited. Repo-level defaults do
   not always apply to ignored or specialist doc lanes.
6. If the task can end in more than one valid location, require the workflow
   to say which one applies for this run instead of relying on a default.

## Anti-Pattern

- Treating `normalise` as if it automatically implies faithful repair
- Naming a source-precedence rule but not the output destination
- Saying a result is `canonical` without clarifying whether that means "best
  local reading surface" or "final tracked repo home"
- Hard-coding generic validation steps even when the target estate has a
  different policy
- Using broad verbs such as `clean up`, `fix`, or `promote` when raw and clean
  artefacts may need to coexist
