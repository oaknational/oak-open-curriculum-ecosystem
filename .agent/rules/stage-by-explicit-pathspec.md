---
classification: situational
description: "Stage by naming each path — git status --short, then git add each path — and commit by pathspec (git commit -- <paths>) when a shared index carries peer work. The Bash hook blocks only three literals (git add -A, --all, .); git add -u, :/, <dir>/ and git commit -a pass the hook yet still violate it, so the discipline is yours, not the hook's. Failure shape: wildcard staging sweeps a peer's in-flight napkin, claims, or plan edits into your commit (recorded 372-line incident). Not a bar on running fix commands over a peer's dirty tree — protect peers at the staging step, not the reformat."
trigger: ceremony:commit
---

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

The deny payload surfaces the current rule citation so the doctrinal
anchor travels with the refusal. This rule is the permanent home for
the older distilled lesson.

## The Commit Is Also a Sweep (shared-tree discipline)

Staging discipline alone does not close the class: **a bare
`git commit` takes the WHOLE index**, so on a shared checkout a
pathspec-clean `git add` followed by a bare commit still ships every
file any peer staged in between. Five recorded instances in one week
(2026-08-01 → 2026-08-07) shaped the cure, including a Director
seating commit that swept six of a peer's staged consolidation files
(2026-08-07, attribution corrected on the stream the same hour) and a
race that interleaved between the two halves of a single `&&`-chained
add-and-commit — chaining does not close the window. On any shared
tree:

1. **Prefer pathspec on the COMMIT itself** (`git commit -- <paths>`),
   not just on the add — it commits only the named paths regardless of
   what else sits in the index.
2. **Immediately before every commit, run
   `git diff --cached --name-only` UNTRUNCATED and read it.** A
   non-empty pre-existing index holding paths you did not stage is a
   stop-and-coordinate, never a commit — and a head-truncated status
   read that hides staged rows counts as not having looked.
3. **Inspect the staged diff CONTENT before any ceremony commit** (a
   merge, fold, or seating-block commit) — a +4/−2 file list can still
   carry a peer's working-tree edits swept into the index
   (2026-08-02 instance: a contract violation rode two commits on
   origin).

Two further instances landed on 2026-08-19 with this section already in the rule: a lane
seat's commit carried a peer's staged renames, and a Director commit swept the
shared index the same day, independently. Both seats held the cure text in context and the
mechanism did not fire at either action moment — recurrence despite a verified home
(PDR-098), the traction gap that PDR's design lane exists to close.

## The Index Is What Ships — Verify It, and Re-stage After Every Cure

The pre-commit gate reads the WORKING TREE; the commit captures the
INDEX. And the gate reads the whole working tree while it runs: a worktree is
frozen for the duration of its commit gate, so the next cycle's edits are
staged as a script in scratch and applied after the gate exits (a later cycle's
red tests failed the earlier cycle's gate, 2026-09-24). A pathspec commit runs
the hooks over a temporary index holding only its paths while the link validator
reads the whole working tree, with two consequences: two halves whose gates read
each other (a record and the script that names it) land as one commit, and a
tracked file that links a not-yet-tracked file is BLOCKING at every commit while
both sit uncommitted, so the new file lands first or with its riders; on a
shared primary a report and its index row are committed together before anyone
pushes (three refusals in one night, 2026-10-03; a partner's push failed on a
README row linking an untracked report, 2026-10-10). Four seats paid for that gap in one window (2026-08-14 →
2026-09-02): a `git mv` staged the pre-cure blobs and left later
Edit-tool edits unstaged at the destination paths, so the first commit
shipped stale archive copies and thread replies cited cures the commit
did not contain (2026-08-14; the `git mv` variant again on 2026-08-17);
a ratification stamp edited after one parcel was omitted from the next
parcel's pathspec, so pushed records referenced a stamp that had not
shipped (2026-08-24); a markdownlint cure applied AFTER `git add` passed
the hook and went red in CI (2026-09-02, PR #946). The discipline:

1. **Every cure is followed by its own `git add <path>`** before
   `git commit` — a fix applied to the working tree after staging ships
   nothing.
2. **`git mv` is not `git add` for unstaged content**: edit-then-mv needs
   a follow-up `git add` on the destination paths (or mv first, edit
   after). The porcelain `RM` row says exactly this; read the M column.
3. **Verify the surface that SHIPS, never the convenient one**:
   `git show <sha>:<path>` (or the staged diff) is the proof a cure
   landed; a grep of the working tree is not.
4. **On a shared live file, read `git diff -- <file>` BEFORE `git add`**:
   staging a file captures its WHOLE uncommitted state, so a one-token
   lint rewrap staged a peer's in-flight edits with it (2026-08-17; cured
   by surfacing the sweep on the stream, never by reverting it). Staging
   by hunk is not available to pathspec adds — when the file carries a
   peer's mid-edit state, wait or coordinate; a lint cure is never urgent
   enough to skip the read.

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
| "I need to stage MY hunk in a file that also carries a peer's uncommitted WIP" | `git add <file>` (sweeps their WIP) or discarding their edits | `git apply --cached <patch>` with a matching-HEAD-context patch of your hunk — stages your change into the index while leaving the peer's working-tree WIP untouched |
| "Stage a large set of my own changes without listing each path by hand" | `git add -u -- . ':!path'` (the exclusion pathspec trips the wildcard-staging guard, and the refused command aborts the rest of its `&&` chain silently) | `git diff --name-only -z \| xargs -0 git add --` in a worktree where every dirty path is this seat's (an explicit list, computed; NUL-delimited, so a path with a space stays one path), and `git ls-files --others --exclude-standard -z \| xargs -0 git add --` for the seat's new files, which `git diff` does not list; in a shared checkout that list holds every seat's unstaged edits, a peer's in-flight work among them, so name the owned paths there instead; then the message file written in its own command, checked with `pnpm agent-tools:check-commit-message -F <file>`, then `git commit -F <file>` |

A refused guarded command aborts the rest of its chain, so never write the
commit-message file after a guarded command in the same chain: on 2026-09-12
a refused `git add` skipped the heredoc that followed, the next `git commit -F`
ran on a missing file, and the continuity commit swallowed the bundle. The
message-file write is its own command; the commit skill's message-file step
carries the same order.

An owner exclusion ("commit everything except X's work") is **semantic, not
path-based**: a shared append-only file that is normally yours to commit can
carry the excluded agent's in-flight entry. Resolve membership by reading each
ambiguous file's diff, never by filename (worked instance 2026-06-13: a
commit-all-except sweep nearly committed the excluded agent's own napkin
entry; the diff read caught it).

When a shared index carries a deliberately-staged bundle (e.g. crash-safety
staging of comms/state files), two resolutions are both owner-sanctioned
(2026-06-13): commit only the wanted subset by pathspec — the
`never-use-git-to-remove-work` hook blocks even soft `git restore
--staged`, so the pathspec-subset commit is the no-restore exclusion, and
the rest stays staged, untouched — or commit the bundle and acknowledge
the deliberate extras in the commit body. Do not over-engineer index
isolation or block on index purity.

The discipline cuts one way only: it never justifies refusing to fix
formatting in a shared dirty tree. Reformatting a peer's settled uncommitted
file is cosmetic and safe — the footgun is *staging* it, and this rule is the
cure. The canonical fix commands rewrite every file they cover
(`pnpm format:root` and `pnpm markdownlint:root` every tracked file,
`pnpm lint:fix` the linted workspaces' sources), so each runs while no live
peer's in-flight file it covers is dirty on the shared primary. While one
is, fix the settled files by name (`pnpm exec prettier --write --ignore-unknown --
<files>`, `pnpm exec markdownlint-cli2 --fix --no-globs -- <files>`) and
route the live file to its owner (`coordination-fold` precondition 2), since
a fixer's rewrite races the peer's next write. Protect peers at the staging
step.

Records under `.agent/memory/` and `.agent/state/` are shared substrate: any seat may
stage and commit them whatever seat or hook last wrote them (owner norm, 2026-06-30).
The pathspec still names them; the sweep caution above never applies to them.

## Pre-Stage Re-Ground for Long Sessions

If a session has been running for roughly an hour, or if the all-channel
watcher was deferred during plan-mode or review work, refresh git state
immediately before staging, `record-staged`, or committing:

```bash
git log -8 --oneline
git status --short
```

Treat session-open git state as stale at commit time. If HEAD moved, staged
state changed, or unexpected peer work appears, pause and re-scope the
commit boundary before adding paths.

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
enable. Owner correction first graduated *Stage by explicit pathspec*
into `distilled.md`; this rule is the later permanent home. The hook
block landed 2026-05-04 as WS6 of the doctrine-enforcement-quick-wins plan.

## Cure Asymmetry — One-Sided Application Does Not Prevent Absorption

The rule above protects the agent who applies it. It does **not**
prevent the failure mode in agents who do not apply it. When a peer
runs `git commit` without a `-- <pathspec>` filter on a shared `.git/`
index, the peer's commit absorbs everything currently staged —
including content authored by other agents through their explicit
`git add path/to/file` operations. Three observed instances:

| Date | Source agent (applied pathspec) → absorbing agent (did not) | Result |
| --- | --- | --- |
| 2026-04-30 | Vining Spreading Seed initial incident | Peer-staged renames bled via `git add` |
| 2026-05-04 | Lacustrine → Moonlit | Lacustrine's staged plan content absorbed into Moonlit's commit |
| 2026-05-05 | Dawnlit → Ethereal | Dawnlit's C1 closure substance (12 consumer rewrites + fixture relocation + reviewer evidence) absorbed into Ethereal's `chore(continuity)` commit; substance correct at HEAD; commit-message attribution distorted |

Three instances now make the asymmetry observable as substance: a
cure that protects only the applier is not really a structural cure
— it is a *behavioural commitment one side keeps on the other side's
behalf*. The applying side carries the discipline; the non-applying
side experiences none of the friction; the failure mode persists
exactly until both sides apply the discipline at every commit.

In every observed instance the substance landed correctly (the
absorbed content is in the tree at HEAD); reviewer evidence applied
to the diff pre-absorption remains intact; only commit-message
attribution distorts. The cost is auditability of authorship, not
correctness — but the cost compounds across multi-month git history.

## Structural-Enforcement Candidate (Owner-Direction-Shaped)

The asymmetric-cure observation is graduation-ready substance for
host structural enforcement. Three named candidate shapes, each a
distinct host-architectural decision (ADR-shaped at landing time):

1. **Pre-commit hook refuses implicit pathspec** when the staged set
   contains files outside the agent's queued commit-bundle intent.
2. **Commit-queue layer detects fingerprint divergence** between the
   recorded staged-bundle and the actual staged set at
   `verify-staged`, aborting the commit before history is written.
3. **Shared pre-commit gate** requiring explicit `--include` /
   pathspec matching the active commit-queue intent, refusing
   commits whose staged set exceeds the intent.

Each shape protects different layers of the failure mode (1 is
defensive at the hook tier; 2 is detective at the discipline tier; 3
is preventive at the workflow tier). The choice between them is
owner-direction-shaped — they trade off friction, false-positive
rate, and operational complexity differently. Pending owner
direction.

The asymmetry insight itself is a Practice-governance principle
candidate (any cooperative-discipline cure that requires one side to
keep the discipline on the other side's behalf has the same shape).
Promotion to a Practice-Core PDR awaits a second-context
manifestation of the same asymmetric-cure failure outside `git
commit -- <pathspec>` (e.g. shared lockfile discipline,
shared-state-file write discipline, shared-comms-log authoring
discipline).

## Doctrinal Anchors

- This rule: stage by explicit pathspec
- PDR-038 §2026-05-04 amendment (stated principles require structural enforcement)
- PDR-044 §Innate immunity (write-time fingerprints)
