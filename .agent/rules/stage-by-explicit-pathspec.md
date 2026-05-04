# Stage By Explicit Pathspec

We stage files for commit by naming them explicitly. Wildcard staging
(`git add -A`, `git add --all`, `git add .`) is forbidden — every
addition must be an act of intent, not a sweep.

## The Rule

When staging changes, name each path:

```bash
git add path/to/file.ts path/to/other.ts
```

Or, when the staged set is already correct from prior `git add` calls,
use `git commit -- <pathspec>` to commit only the listed paths
regardless of what else sits in the index.

The following commands are blocked at the Bash hook
(`.agent/hooks/policy.json` `preToolUse.blocked_patterns`):

```text
git add -A
git add --all
git add .
```

The deny payload surfaces the citation
*"distilled.md §Stage by explicit pathspec"* so the doctrinal anchor
travels with the refusal.

## Why

Wildcard staging silently bundles unrelated work into a single commit.
Three concrete consequences:

1. **Peer-agent work bleeds into your commit.** When parallel sessions
   touch shared files (thread records, napkins, plan bodies, comms
   logs, collaboration state), `git add -A` captures their in-flight
   edits alongside yours. Their work then ships under your commit
   message, with no audit trail of what got swept along.
2. **Unrelated changes hide behind related ones.** A continuity-
   deferral commit that incidentally bundled 372 lines of parallel
   Practice-thread plan work plus an unrelated plugin enable is the
   recorded incident (2026-04-30, post-mortem captured in the napkin
   archive).
3. **The act of staging stops being deliberate.** Once wildcard
   staging is normalised, the question *"which of these belongs in
   this commit?"* never gets asked, and the commit boundary becomes
   accidental.

## What to Do Instead

| Impulse | Wrong move | Right move |
|---|---|---|
| "Stage everything I changed" | `git add -A` | `git status --short`, then `git add <each path>` |
| "Stage every file in this directory" | `git add packages/foo/.` | `git add packages/foo/file-a.ts packages/foo/file-b.ts` |
| "I already added too much; I want only these paths in this commit" | `git reset` then re-stage | `git commit -F <msg> -- path/to/file` (commit-by-pathspec is the cleanest cure when peer-staged work sits in the index) |

## Peer-Index Note

If `git status --short` shows another agent's work staged in your
index (e.g. a `R` rename you did not originate), that staged state
came from the peer's mid-flight commit prep. Do not run `git reset
HEAD <peer-files>` lightly — it briefly disturbs the peer's view of
their own staging area. Prefer `git commit -- <pathspec>`, which
captures only your listed paths and leaves the peer's index
entries intact.

## Source Incident

2026-04-30: a continuity-deferral commit accidentally bundled 372
lines of parallel Practice-thread plan work plus an unrelated plugin
enable. Owner correction graduated *Stage by explicit pathspec* to
distilled.md. The hook block landed 2026-05-04 as WS6 of the
doctrine-enforcement-quick-wins plan.

## Doctrinal Anchors

- distilled.md §Stage by explicit pathspec
- PDR-038 §2026-05-04 amendment (stated principles require structural enforcement)
- PDR-044 §Innate immunity (write-time fingerprints)
