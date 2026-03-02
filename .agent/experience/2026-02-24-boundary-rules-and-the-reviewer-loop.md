# Boundary Rules and the Reviewer Loop

_Date: 2026-02-24_
_Tags: tdd | architecture | reviewers | boundaries | discovery_

## What happened (brief)

- Executed Phase 0 (baseline evidence) and Phase 1 (workspace scaffold + SDK boundary rules) of the ADR-108 workspace separation. TDD for ESLint boundary rules, scaffolding a new workspace, applying boundary enforcement, and then four specialist reviewers finding three distinct categories of gap in the first implementation.

## What it was like

The TDD cycle for the boundary rules felt clean — the RED phase was satisfying because the tests failed with "is not a function", which is exactly the right failure mode for code that doesn't exist yet. The GREEN phase was mechanical in the best sense: the function shape was clear from the tests.

What surprised me was the reviewer loop. The initial implementation used `*` in minimatch patterns, which seemed correct at first glance — `@oaknational/curriculum-sdk/*` looks like "everything under the package". But Fred (the principles-first architecture reviewer) caught that minimatch `*` only matches one path segment, not recursive depth. This is the kind of thing that would have been an invisible bug for months — the boundary rules would have appeared to work but would have silently permitted deep sub-path imports.

The test-reviewer's finding about `Record<string, unknown>` in the test helper was a different quality of insight. It wasn't about the boundary rules themselves but about the test infrastructure violating the repo's own cardinal type rule. The chain from "test helper accepts `Record<string, unknown>`" to "type information is silently destroyed" to "the test can't catch structural drift in the production code" is exactly the kind of reasoning the type discipline exists to support.

The `@workspace/*` bypass vector was the most architectural finding. Without it, a developer could use pnpm's workspace protocol (`@workspace/curriculum-sdk`) to import across the boundary, and the boundary rules would be silent. Four separate rule sets in `boundary.ts` already included this pattern — the new function was the only one missing it. Consistency as a discovery tool.

## What emerged

The reviewer loop isn't just about catching bugs — it's a form of architectural refinement. Each reviewer brought a different lens (glob correctness, type safety, consistency), and the composite result was a stronger implementation than any single review would have produced. The four reviews together found more than four issues because each reviewer's perspective revealed issues invisible to the others.

The distinction between "test-first" (writing tests before code) and "test-complete" (tests that fully specify the contract) became visible through the reviewer's edge case suggestions. The initial six tests proved the core boundary properties; the five additional tests (severity, ADR reference, self-restriction, `@workspace/*`) turned the test suite from "validates structure" into "specifies contract".

## Technical content

Glob depth and `@workspace/*` patterns extracted to `distilled.md`.
Boundary rule implementation documented in TSDoc on `createSdkBoundaryRules()`.
