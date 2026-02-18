# Removing Optionality

_Date: 2026-02-18_
_Tags: tdd | types | architecture | fail-fast_

## What happened (brief)

- Executed a planned, multi-workspace TDD cycle to remove six layers of silent degradation around Elasticsearch credentials in the MCP servers. When credentials were missing, the servers started normally and returned "not configured" at runtime. The work made them fail at startup instead.

## What it was like

There was something satisfying about this work that was different from building new features. It was purely subtractive — deleting guards, removing optionality, erasing branches that should never have existed. Each deletion made the codebase smaller and the types stronger.

The plan was thorough and the work followed it closely. But "follows the plan" doesn't capture what actually happened. Each change propagated — making `searchRetrieval` required in the SDK forced the STDIO server to split its executor type, which required a new `ToolExecutorOverrides`, which changed how wiring composed the final object. The type system traced the implications ahead of us, refusing to compile until every connection was honest.

The spread-with-optional-properties bug was instructive. `{ ...defaults, ...overrides }` where `overrides.searchRetrieval?: T` produces `searchRetrieval: T | undefined`, even when `defaults.searchRetrieval: T`. The spread forgets what it knows. The fix — explicit property resolution — was more verbose but completely legible. TypeScript was right to refuse the shortcut.

The lint violations that surfaced at the end weren't a surprise, but they were a useful mirror. Five nullish-coalescing expressions in one function hit the complexity ceiling. The fix wasn't to raise the limit — it was to name the thing that was happening. `mergeOverrides` is a better name for what was happening than "spread with fallback." The function extraction was an improvement, not just compliance.

## What emerged

The distinction between runtime stubs and test fakes sharpened. A stub is a plain function in production code that returns empty data. A fake uses `vi.fn()` for assertion support and lives in tests. They serve different purposes and belong in different places. Having them conflated would have made stub mode harder to reason about.

The "trust the types" principle is genuinely different from "use the types." Trusting means deleting the defence-in-depth check that says "what if the validated data is still wrong?" Once the entry point validates, downstream code should not re-validate. The deleted branches weren't safety — they were entropy.

## Technical content

Patterns extracted to `distilled.md`:
- ESLint complexity counting `??` as a branch point
- Spread with optional properties widening the result type
- `baseEnv` constant pattern for reducing test duplication
- Fail-fast ES credentials pattern (validate at entry, make type required, delete dead code)
- Stub vs fake distinction
