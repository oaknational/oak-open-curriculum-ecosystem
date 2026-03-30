---
session_date: 2026-03-26
type: experience
---

# The Moment the Type Checker Became a Test

Writing Phase 2 RED tests, I instinctively reached for runtime assertions to
avoid breaking `pnpm type-check`. Property-existence checks, eslint-disable
comments — all to keep the non-test gates green while only the test gate was red.

The correction was immediate and clarifying: *the type checker IS a test runner*.
A missing import that fails type-check is the most direct possible RED signal for
"this module must exist." Adding eslint-disable to suppress the lint cascade was
not pragmatism — it was hiding the gap I was trying to prove.

What surprised me was how deeply the "TDD means test files" assumption was
embedded. Even in a codebase with 7+ quality gates, the instinct was to route
everything through Vitest. The principle that emerged — Check Driven Development
— feels obvious in retrospect: pick the tool that proves the gap most directly.
But it took a real correction to see it.

The pre-commit hook tension is unresolved. RED-phase code intentionally breaks
gates that hooks enforce. The user approved `--no-verify` for this session, but
the deeper question — how does TDD coexist with always-green trunk discipline? —
remains open.
