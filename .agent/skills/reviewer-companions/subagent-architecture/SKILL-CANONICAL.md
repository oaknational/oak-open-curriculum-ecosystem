---
name: subagent-architecture
classification: active
description: "Use when work changes the reviewer estate: roster, skills, rules, or adapter wiring."
---

# Subagent Architecture

Use this skill while changing the reviewer estate itself: canonical templates,
skills, situational rules, or the platform adapters that wire them together.
It complements `subagent-architect`; use that reviewer for the independent
estate-shape review.

## Read in order

1. `.agent/sub-agents/templates/subagent-architect.md`
2. The `subagent-architect` row of `.agent/rules/invoke-code-experts.md` (the roster)
3. The relevant changed surfaces under `.agent/`, `.cursor/`, `.claude/`,
   `.codex/`, `.gemini/`, `.github/`, and `.agents/`
4. `.codex/README.md` when Codex reviewer wiring is involved

## How to use it

1. Start from the canonical artefact: the template and its frontmatter
   declaration, the skill, or the rule. Their adapters are generated
   (`.agent/memory/executive/artefact-inventory.md` §How to Create New
   Artefacts): `pnpm portability:fix` renders the rule projections and the
   Cursor, Claude, Codex and Gemini sub-agent adapters, and
   `pnpm skills:generate` renders the skill adapters. The Copilot instructions
   file `.github/copilot-instructions.md` is kept by hand.
2. Treat reviewer, skill, and situational rule as one coordinated unit. If one
   layer changes, trace the matching change across the others.
3. Regenerate the adapters, then prove parity with `pnpm portability:check`,
   `pnpm subagents:check` and `pnpm skills:check`.
4. Hand off to `subagent-architect` once the estate change is wired.
