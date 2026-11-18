---
name: accessibility
classification: active
description: Use when work changes rendered, semantic, motion, or PDF surfaces with a11y risk.
---

# Accessibility

Use this skill while planning, implementing, or checking changes that affect
rendered output, semantics, focus order, motion, or assistive-technology
behaviour. It complements `accessibility-expert`; use the reviewer for the
independent read-only pass.

## Read in order

1. `.agent/sub-agents/templates/accessibility-expert.md`
2. The `accessibility-expert` row of `.agent/rules/invoke-code-experts.md` (the roster)
3. Relevant changed files in `apps/**`, `demos/**`, `packages/design/**` and
   `docs/design/**`
4. `.agent/rules/visual-verdicts-require-rendered-proof.md` and the
   `visual-verification` skill when the slice changes rendered states or layout

## How to use it

1. Trace the user flow first: keyboard path, headings, landmarks, status
   messaging, and any PDF fallback or unavailable state.
2. Prefer semantic HTML, explicit text, and predictable focus order over
   aria-only patches or post-hoc fixes.
3. Pair the change with proof at the right layer: component or integration
   tests for local behaviour, the `visual-verification` skill's rendered proof for
   rendering risk, and `pnpm test:e2e` for end-to-end behaviour.
4. Hand off to `accessibility-expert` once the slice is implemented, or
   sooner if the trade-offs are unclear.
