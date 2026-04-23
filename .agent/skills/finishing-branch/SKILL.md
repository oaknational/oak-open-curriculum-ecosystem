---
name: finishing-branch
classification: passive
description: >-
  Branch completion checklist. Use before merging or creating a PR.
  Covers quality gates, commit hygiene, documentation updates,
  and PR description.
---

# Finishing a Branch

Checklist for completing development work on a branch before merge or PR creation.

## Pre-merge Checklist

### 1. Quality gates pass

- Run `pnpm check`
- All tests pass, no skipped tests
- Linting clean, type-checking clean
- No new warnings introduced

### 2. Commit history is clean

- Each commit has a clear, descriptive message
- No WIP, fixup, or "temp" commits remain (squash or rebase if needed)
- Commits are logically grouped (one concern per commit)

### 3. No debris

- Remove TODO/FIXME comments added during development (or convert to tracked issues)
- Remove console.log/debug statements
- Remove commented-out code
- No temporary test helpers left in production code

### 4. Documentation updated

- If behaviour changed, update relevant docs
- If a new artefact was created, check ADR-125 counts
- Run `/jc-consolidate-docs` if the branch involved plan or documentation work

### 5. PR description

- Title: concise summary under 70 characters
- Body: what changed, why, how to test
- Link to related issues or plans

## References

- `.agent/commands/gates.md` — quality gate workflow
- `.agent/skills/commit/SKILL.md` — commit message conventions
