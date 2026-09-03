# PR Target Is engraph

On the EngraphCode fork, `main` mirrors the upstream `oaknational` line and
receives no fork work. All fork work lands on `engraph`: every pull request's
base branch is `engraph`, never `main`.

## Trigger

A pull request is about to be created in
`EngraphCode/oak-open-curriculum-ecosystem`, or any tool is about to choose a
base branch by default.

## Action

Set the base branch to `engraph` explicitly. Never rely on the default:
`main` is this fork's GitHub default branch, so every surface that infers a
base — the GitHub UI, `gh pr create`, MCP `create_pull_request`, compare
links — infers the wrong one unless told otherwise.

## Failure Mode Prevented

Worked instance (2026-08-23): PR #7 was opened with `base: main` and merged
there, putting fork-only work on the mirror branch. The change was
retargeted to `engraph` as PR #8; the owner ruled the stray `main` merge is
left as-is rather than force-pushed away. This rule exists so the default
branch stops being a trap.

## Related Surfaces

- [`never-commit-to-main`](never-commit-to-main.md) — local commits to
  `main` are separately prohibited; this rule covers the PR base choice.
