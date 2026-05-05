---
name: takeover-gate-completion
overview: Take over the stalled Twilit and Opalescent bundles under explicit owner direction, clear their claims with explanatory coordination notes, fix the current Knip blockers, validate, review, and land the work without sweeping unrelated files.
todos:
  - id: claim-takeover
    content: Close or cancel the stalled Twilit and Opalescent claims/queue entries with owner-directed explanatory notes.
    status: completed
  - id: fix-knip
    content: Fix the unused exported options type and Knip CSS/Vite configuration hint.
    status: completed
  - id: validate-review
    content: Run Knip and targeted gates, then dispatch code, test, and config reviewers.
    status: completed
  - id: commit-pathspec
    content: Commit the completed bundles with explicit pathspecs and commit-skill verification.
    status: completed
isProject: false
---

# Takeover Gate Completion

## Scope
- Take over the two stalled bundles because Twilit Beaming Aurora and Opalescent Threading Nebula cannot act.
- Preserve the substance already in the worktree and avoid reverting or restaging unrelated user or peer changes.
- Fix the current `pnpm knip` failures:
  - `packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts`: make `NoRealIoInTestsOptions` internal unless it is actually exported through a public API.
  - `knip.config.ts`: register the widget Vite/CSS surface for `apps/oak-curriculum-mcp-streamable-http`, likely via the existing `widget/vite.config.ts`, so `widget/src/index.css` is covered as a real imported asset.

## Execution
- Switch to Agent mode before making changes.
- Write a coordination record explaining the owner-directed takeover and cancel/close the stalled Twilit and Opalescent git/file claims with clear notes, using the repo collaboration helper where available.
- Apply only the focused fixes needed for Knip and completion hygiene:
  - remove the unnecessary `export` from `NoRealIoInTestsOptions` if no public re-export exists;
  - update `knip.config.ts` to cover the Vite widget CSS path instead of suppressing the hint.
- Re-run `pnpm knip`; then run targeted checks for the touched code/config surfaces, including the oak-eslint tests/lint/type checks as practical.
- Invoke relevant reviewers after edits: `code-reviewer`, `test-reviewer`, and `config-reviewer`.
- Commit with the commit skill, explicit pathspecs, and staged-bundle verification. Prefer two atomic commits if the bundles remain distinct:
  - `feat(oak-eslint): add no-real-io-in-tests rule...` for the Twilit code bundle plus its plan/thread coordination.
  - `docs(practice): promote orchestrator-vs-gate distinction...` for the Opalescent practice bundle.
  If the final staged coordination state makes one commit materially safer, use one pathspec-filtered commit and explain why.