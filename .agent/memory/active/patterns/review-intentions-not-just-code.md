---
related_pdr: PDR-015
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

**Phase 4 brand banner** (2026-04-04): 5 pre-implementation reviewers
produced 16 concrete decisions. Wrong HTML element, wrong CSS
pattern, wrong token tier — all caught before code existed.

**P1 branding alignment** (2026-04-06): 5 reviewers × 2 rounds = 10
reviews. 28 findings total. Highest-value catches: focus ring
arithmetic (plan said ~3.1:1, actual ~2.79:1 — FAILS WCAG), SDK
capability key pluralisation (`openLinks` not `openLink` — would
throw at runtime), boundary violation in token build (design package
depending on app-layer protocol), and wrong brand colours (plan had accent
`#222222`, real Oak uses `#287C34`). Two-round structure with
sign-off gates prevented implementation on a fundamentally flawed
plan. All 28 items resolved before writing a single line of code.

## When to Apply

- Implementation touches multiple concerns (a11y, tokens, protocol, architecture)
- Multiple valid approaches exist and the correct one is non-obvious
- The cost of rework exceeds the cost of a reviewer invocation
