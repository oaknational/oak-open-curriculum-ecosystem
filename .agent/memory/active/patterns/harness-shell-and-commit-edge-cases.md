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
- **Run state-mutating CLIs bare first; parse later.** Piping a CLI's
  stdout to `jq` with stderr suppressed (`cmd 2>/dev/null | jq …`) hides
  a failure completely — the write silently didn't happen and the parse
  of empty output looks like a clean no-op (bit live 2026-07-02: an
  emptied commit-queue enqueue whose error the pipe swallowed). Invoke
  the mutating command bare, read its output, then parse in a second
  step.
- **Strip trailing prose before parsing captured JSON.** A driver that
  prints its JSON result followed by a one-line close verdict on the
  same stream breaks `jq` on the capture file — `sed '$d'` the trailing
  line (or capture the JSON artefact separately) before parsing or
  conserving as a `.json` file.
- **`find` on this host is `bfs`**, which rejects GNU-style relative
  `-newermt "-40 seconds"` (ISO-8601 timestamps only) — a wait-loop built
  on that predicate spins to timeout without ever becoming true. Compute
  an absolute ISO timestamp, or run the CLI's own freshness assert.
- **zsh expands an unquoted `=word`**: `--proto =https` becomes an
  `=cmd` lookup ("https not found"); quote it (`'=https'`). Same family
  as the `${VAR:+…}` word-split trap.
- **Parallel Bash tool calls share ONE working directory**: two same-turn
  `cd X && …` calls interleave (bit twice during branch restarts,
  2026-08-24). Serial calls, or absolute paths for anything stateful —
  and a `cd` in one compound command leaves the persistent shell there
  for the NEXT call (a background push once ran in the wrong worktree and
  reported "Everything up-to-date", 2026-08-18). Pin the shell to the
  primary root and use `git -C <worktree>` for all worktree git.
- **`FETCH_HEAD` is a shared single slot**: any background gate, hook, or
  peer fetch overwrites it between two reads in one turn (a
  `git show FETCH_HEAD:README.md` silently switched documents,
  2026-08-18). Fetch into a named ref (`git fetch origin <branch>`, then
  read `origin/<branch>`); never read `FETCH_HEAD` when background git can
  run. Same family as cwd drift and the home registry: shared mutable
  process-level state wants pinning-by-name, never sequencing-by-hope.
- **A hook-BLOCKED compound command loses ALL its steps**, not only the
  offending one — re-run the innocent steps explicitly (2026-08-14, a lost
  footer cure).
- **A harness reset returns the shell to the primary checkout** (a
  plugin reload, a session restore): a "local server" once ran pre-fix
  code from the primary while the seat believed it was in its worktree,
  and a key attributed to the worktree was the primary's (2026-09-02).
  Re-check `pwd` after any harness reset and label evidence by its true
  source.
- **Scratch files poison validation verdicts**: a thread-map JSON written
  into a validation worktree failed that tree's `prettier --check .` and
  cost a full gate re-run (2026-08-17). A validation tree contains ONLY the
  work under test; scratch lives in the session scratchpad — the gate
  judges the tree it sees, never the tree you meant.
- **A bare `[[ ]]` that fails reaches an ERR trap with `PIPESTATUS`
  reading 0** (a keyword's status does not land there the way `test`'s
  does), so a mechanical `test` to `[[ ]]` rewrite made a failure card
  print `pipe status: 0` beside a fatal failure (2026-09-01). Route
  presence checks through the script's own `fail()`; a
  "behaviour-identical" claim must include the instrumentation's
  behaviour, not only the control flow.

## See also (homed elsewhere, not duplicated)

- Long `--body` strings / backticks → `--body-file` (frictions F-92/F-93;
  [`wrapped-exit-codes-false-green`](wrapped-exit-codes-false-green.md)).
- A new `agent-tools/src/validators/<x>.ts` must be a knip entry point in
  `knip.config.ts` or full-tree knip blocks repo-wide commits.
- Mangled grep output of source → [`read-not-grep-for-faithful-source`](read-not-grep-for-faithful-source.md).
- Concept-union merge of memory files → the `oak-semantic-merge` skill.
