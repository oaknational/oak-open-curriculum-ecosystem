---
name: "Harness Shell and Commitlint Edge Cases"
polarity: pattern
use_this_when: "Driving the Bash/harness shell or composing a merge/commit message and hitting a surprising failure."
category: process
proven_in: "2026-06-21/22 (Oyster, Cosmos, Cutter) — collected operational edge-cases"
proven_date: 2026-06-22
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Re-deriving the same harness/commit edge-case failures: a glob held in a variable not expanding, and a non-conventional Merge header failing commitlint."
  stable: true
---

> **POLARITY: PATTERN.** A handful of harness/commit edge-cases recur
> with surprising failures; name them so the next agent doesn't re-derive.

## The edge-cases

- **zsh does not expand a glob held in a variable** — inline the glob
  literally rather than storing the pattern in a variable and expecting
  expansion.
- **zsh backtick command-substitution inside quoted search/comms strings
  mangles** — prefer `$(...)`, and pass bodies containing backticks or `$`
  via `--body-file`, never inline.
- **zsh does not word-split an unquoted `$var`** (`cat $files` passes one
  joined string → "No such file") and lacks `local -n` namerefs — use zsh
  arrays and `${(P)name}`.
- **`rg -r` is replace, not line numbers** — `-n` is line numbers; the two
  are one typo apart and `-r` silently rewrites the match in the output.
- **A custom `Merge origin/...` header fails commitlint** — only
  `Merge branch …` / `… into …` are auto-ignored. Resolve a merge with a
  conventional `chore:` header instead, or the default `Merge branch` form.
- **Resolve a take-ours conflict by a FORWARD write**
  (`git show HEAD:<path> > <path>` or the Write tool), never
  `git checkout --ours` (blocked by the worktree-destruction guard,
  correctly). Verify the conflict's content subsumption first — "take
  ours" may lose nothing if local already migrated the other side.

## See also (homed elsewhere, not duplicated)

- Long `--body` strings / backticks → `--body-file` (frictions F-92/F-93;
  [`wrapped-exit-codes-false-green`](wrapped-exit-codes-false-green.md)).
- A new `agent-tools/src/validators/<x>.ts` must be a knip entry point in
  `knip.config.ts` or full-tree knip blocks repo-wide commits.
- Mangled grep output of source → [`read-not-grep-for-faithful-source`](read-not-grep-for-faithful-source.md).
- Concept-union merge of memory files → the `oak-semantic-merge` skill.
