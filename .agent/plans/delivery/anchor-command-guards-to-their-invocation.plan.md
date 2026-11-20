---
id: anchor-command-guards-to-their-invocation
node_type: delivery
name: 'Anchor the staging and force-push guards to their own invocation'
overview: >-
  Make the wildcard-staging and force-push entries of the command guard match the one git
  invocation they name, so an unrelated word later on the same command line is never refused.
status: superseded
superseded_by: command-guards-and-merge-review-reading
ratified_by: owner
ratified_date: 2026-11-20
ratified_where: "The owner's word in the session of Sandpiper guards Wind (690653), 2026-11-20, on the staging guard's false positive: 'plan and route a fix'"
serves: maintenance
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
last_updated: 2026-11-20
---

# Anchor the staging and force-push guards to their own invocation

## Goal

The command guard refuses wildcard staging and forced pushes, and refuses nothing else on their
account.

## User groups and value

- **Seats running shell commands** stop losing a command to a guard that matched words from two
  different commands on one line, and stop splitting lines to get past it.
- **The owner** keeps both protections exactly as they are for the commands they name.

## Why

The guard's default match is a token subsequence over the whole command line
(`matchesTokenSubsequence` in `agent-tools/src/hook-policy/blocked-patterns.ts`): the pattern's
words need only appear in order, anywhere, across `&&`, `;` and pipes. Two families of entries in
`.agent/hooks/policy.json` use it and misfire:

- **Wildcard staging** (`git add .`, `git add -A`, `git add --all`). The words `git`, `add` and
  a lone `.` in order are enough. Refused in error: `git worktree add` with a later lone dot; an
  explicit-path `git add` followed by a dot-sourced script; a later `cp ... .`. Seven instances
  are recorded, 2026-11-04 to 2026-11-18, in `.agent/reference/shell-and-tooling-gotchas.md`.
- **Forced push** (`git push -f`). A `-f` belonging to a later command on a line that also pushes
  is enough: `gh api graphql -f` was refused (2026-11-12, same reference).

The guard already has a match mode that reads one invocation's own subcommand and options
(`match: 'argv'`, `argument-matcher.ts`), written for the removal commands after the same class
of misfire.

## Acceptance criteria

1. Each misfiring shape named above is allowed. Proof: `repo-safe`, new unit tests in
   `agent-tools/src/hook-policy/`, written first and seen to fail.
2. Every staging and forced-push shape the guard refuses today is still refused, including
   `git -C <dir> add .`, the option after the operand, and the invocation after `&&` or `;`.
   Proof: `repo-safe`, the existing unit and integration tests unchanged and passing, plus tests
   for any shape they do not cover.
3. The canonical policy still loads and validates. Proof: `repo-safe`, the canonical-policy
   integration test and `validate-policy-reappraisal`.
4. The two workaround entries in `shell-and-tooling-gotchas.md` are removed in the same pull
   request. Proof: `repo-safe`, the diff.

## Todos

1. Read `argument-matcher.ts` and its option tables; establish whether `git add` and `git push`
   can be expressed in argv mode as they stand, or need table entries.
2. Write the failing tests for criterion 1 and the missing cases of criterion 2.
3. Move the staging and forced-push entries to the anchored mode; add table entries if needed.
4. Run the guard against the seven recorded commands as written in the reference.
5. Remove the two workaround entries from the reference.

## Out of scope

- The guard matching a blocked command's words inside quoted text or a heredoc. That is a
  different cause (the guard reads the raw command text) and stays as recorded in the reference.
- Any change to which operations are refused.
- The Codex and Copilot guard projections; they read the same policy file and follow it.
