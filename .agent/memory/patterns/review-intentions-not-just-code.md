---
name: "Review Intentions, Not Just Code"
category: process
status: proven
discovered: 2026-04-04
proven_in: "WS3 Phase 4 brand banner — 5 specialist reviewers before implementation"
---

# Review Intentions, Not Just Code

Specialist reviewers can review design intent before implementation, not
just finished code. Describe what you intend to build, why, and what
alternatives you considered. The reviewer identifies architectural
issues, missing considerations, or simpler approaches before any code
is written.

## Pattern

Before implementing a complex change, invoke the relevant specialist
reviewers with a design brief: the proposed approach, key decisions,
and specific questions. Collect decisions from all reviewers before
writing the first line of product code.

## Anti-Pattern

Write the full implementation first, then invoke reviewers to check the
result. Wrong approaches (wrong HTML element, wrong CSS pattern, wrong
token tier, wrong SDK method) are expensive to fix after the fact.

## Evidence

Phase 4 brand banner: 5 pre-implementation reviewers (design-system,
accessibility, MCP, assumptions, architecture-barney) produced 16
concrete decisions. Without them, the implementation would have used
`<button role="link">` (wrong), PNG `filter: invert()` (breaks
forced-colours), generic link tokens (YAGNI), a `ToolRouter.tsx` file
(single-consumer), and `useHostStyleVariables` (handler overwrite).
Every wrong choice was caught before code existed.

## When to Apply

- Implementation touches multiple concerns (a11y, tokens, protocol, architecture)
- Multiple valid approaches exist and the correct one is non-obvious
- The cost of rework exceeds the cost of a reviewer invocation
