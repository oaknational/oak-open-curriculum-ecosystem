---
classification: situational
description: Run check and required follow-up proofs after edits
trigger: surface:source-authoring
---

# Lint After Edit

Operationalises [`principles.md` §Code Quality](../directives/principles.md#code-quality).

After editing TypeScript files, check lint for file/function length violations. Run lint on the changed files (on Cursor, `ReadLints` on the changed files) or run `pnpm lint:fix`. Catch violations early — don't accumulate them. A file you edit is yours to leave clean:
fix its lint findings whatever their provenance, never only the lines you changed
(owner norm, 2026-06).

After each edit pass, run the gates the touched surface requires (`pnpm check`; for a served
surface, the host's end-to-end checks or its rendering-proof instrument when rendering is at
risk, as the `gates` skill lists them). Never disable checks or hand-wave failures; if a fix
mutates files, restart the gate sequence from the top.

A records-only change still runs the whole estate check at the push. Four validators refuse
records and nothing else catches them earlier (a retired path named in a record, a directive
linking into the patterns tier, a cited path the host does not own, a pattern index out of
sync): run `pnpm check:docs` before a records push. Three pushes in one hour were refused, one
validator each (2026-09-30).

Lint the fragment before it joins the whole, and lint every write at once. A commit
header is checkable with `wc -c` and a block about to be appended with markdownlint on
the block file, before either joins the record; a check that runs only on the whole runs
late, and each late refusal cost a commit or a gate run (six in one window, 2026-09-26).
A scripted record edit is read back rendered, in full, once before its commit: a doubled
heading marker is valid Markdown and no linter flags it. After any word-level substitution,
search the files for the pattern across the line break (a line ending in the article, the
next opening with the new word, and the reverse), which a line-local substitution misses
(2026-10-02).
On this repository the pre-push gate reads the WORKING TREE, not the commit: an
uncommitted edit to a tracked file, a stale comms-log projection or an unconsolidated
link fails the next push whoever made the edit, so each write to the shared primary is
linted at once with the gate's own command (`pnpm exec prettier --check --ignore-unknown
-- <files>`, `pnpm exec markdownlint-cli2 --no-globs -- <files>`) and the render is
refreshed before a push. No edit touches a working tree while its push gate runs: the gate
reads the tree as it goes, so an edit mid-gate corrupts its read (2026-10-04). The rendered
comms read model is gitignored and the substrate check reads it, so a comms event posted
during a push gate is an edit to the tree under that gate: the push order is render the read
model, push, and no event between (two consultation events posted while a successor's pushes
ran cost ten minutes each at the final gate, 2026-10-05). A text both estates carry passes the
sibling's `check:docs` before either estate pushes, because a validator only one estate runs
refuses the shared text there alone (the doctrine landing of 2026-10-04).

Key ESLint thresholds that bite during refactoring:

- `max-lines`: 250 lines per file
- `max-lines-per-function`: 50 lines per function
- `complexity`: ESLint counts `??` and `?.` as branches

When a violation appears, follow the refactoring rules in `.agent/directives/principles.md`:

- **File too long**: split by groupings of responsibility; for very long files, turn into a directory with an index.ts integration point.
- **Function too long**: extract named helpers as pure functions with unit tests.
- **Too complex**: extract branch-heavy expressions into pure-function helpers with unit tests.
