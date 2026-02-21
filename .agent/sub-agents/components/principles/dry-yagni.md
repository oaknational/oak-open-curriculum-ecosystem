# DRY and YAGNI Guardrails

Apply these guardrails in all analysis, recommendations, and changes.

## DRY

- Prefer existing modules, patterns, and templates before adding new ones.
- Avoid duplicating logic, instructions, or checks across files.
- If proposing abstraction, justify it with concrete duplication that exists now.

## YAGNI

- Solve only the validated requirement in front of you.
- Do not introduce speculative extensions, hooks, or abstractions.
- Reject "just in case" complexity unless there is current evidence it is needed.

## Decision Check

Before finalising a recommendation or change, verify:

1. Reuse first: Can this be done by extending what already exists?
2. Need now: Is this required for current acceptance criteria?
3. Simpler outcome: Does this reduce net complexity today?

If any answer is no, prefer the simpler option.
