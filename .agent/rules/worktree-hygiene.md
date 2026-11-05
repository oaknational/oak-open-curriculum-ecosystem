---
classification: core
description: Every worktree carries an open (at least draft) PR; the repository's default branch is the only durable home — a surviving branch is not preservation; retire by content-check, not commit-check.
---

# Worktree Hygiene

**TRIGGER — the rule fires at CLAIM-OPEN and at the FIRST SOURCE EDIT,
never in the abstract:** before opening any implementation claim and before
the first Write/Edit outside `.agent/`-class coordination surfaces, answer
*which worktree am I in?* Source work on the primary/coordination checkout
is a straight error that blocks the whole team (owner word, 2026-07-27,
after a seat's product edits sat uncommitted on the shared tree: whole-tree
gates held hostage, pathspec commits hazarded for every seat). The primary
checkout is shared fleet surface — coordination docs and fleet state only;
a fresh worktree off `origin/<base>` (the repository's default branch,
derived at the moment of use as `downstream-checkout-never-writes-upstream-surfaces`
specifies — the remote HEAD refreshed with `git remote set-head origin
--auto`, then read and stripped of its `origin/` prefix — never a literal;
or, for a build-ahead lane, the parent branch it builds on, §1)
is where every implementation lane starts, before its first edit, not
after. Throughout this rule, `main` reads as that default branch: every
draft PR, update and merge below targets it, never a mirror branch.

In the one-developer-many-agents / many-worktree model, linked git worktrees
proliferate. A worktree is a transient workspace, not a home. Left undisciplined it
becomes an orphan: a branch carrying commits that never reach `main`, invisible from
every other worktree (tracked `.agent/` files are per-branch), with no PR, no review,
and no path to its durable home. Information rots on branches nobody remembers. This
rule keeps every worktree's work visible and on a committed path to `main` from the
moment it exists, and makes its retirement a content-verified step rather than an act
of faith.

## Core invariant

**`main` is the only durable home. A surviving branch is NOT preservation.**
Information is durably preserved only when it is in `main`, or on a live, owned lane
with an open PR actively heading to `main`. "It's on a branch" / "it's pushed to
origin" / "the branch ref survives `git worktree remove`" are NOT preservation — they
are deferred orphaning. The hygiene question for any branch is always *"is its useful
information in `main`?"*, never *"does the branch still exist?"* Never treat "branch
exists" as "information safe, job done."

## Trigger

Creating or working in a linked worktree; readying a worktree's PR; retiring, pruning,
or handing off a worktree; or auditing the worktree estate for hygiene.

## Action

### 0. Every worktree lives at `.claude/worktrees/<lane>`

Owner ruling 2026-09-30: lanes are cut nested in the checkout,
`git worktree add .claude/worktrees/<lane> -b <branch> origin/<base>`, in both estates.
`.gitignore` ignores the directory's contents (its placeholder `.gitignore` is the one
tracked file), the platform's own `.git/info/exclude` ignores it, and every root check
tool either reads the git index or carries the exclusion; `worktree-residency` lists
them and records the one leak nested placement keeps (a false-clean dependency run,
fenced by CI's fresh install on every pull request). Entering such a worktree never
prompts. The sweep clause below still never touches a peer's lane, wherever it lives.

### 1. Every worktree has an open PR — at least a draft

The moment a worktree's work has its first commit, push it and open at least a **draft**
PR against `main`: the first push that carries a commit is the firing point, since GitHub
refuses a pull request with no commits ahead of its base. The PR is the worktree's lifeline
to its durable home: it makes the work **visible** (it appears on the PR list, not "on
a branch somewhere"), **reviewable**, and **on a committed, trackable path to `main`**.
A worktree carrying commits with no PR is an orphan by construction. A draft PR is
low-cost — it requests no review until marked ready. **There is no acceptable state in
which a worktree holds PUSHED work and has no PR.** One state is sanctioned before the
push (owner, 2026-10-02, the work-in-progress limit in `pr-lifecycle`): while the
estate's count of open pull requests is full, the next slice waits as local commits on an
unpublished branch, git-durable, and its first push opens the draft the moment a slot is
free.

This absoluteness is deliberate. A read-only investigation checkout holds no committed
work and is outside this clause — but a genuinely throwaway spike is **not** an
exception: it too gets a draft PR, then is closed and removed the same session. The PR is
cheap, and requiring it even for throwaways is the point — "committed work on a branch
with no PR" is the single state this rule exists to forbid, so nothing is ever silently
dropped.

**The clause generalises beyond worktree lanes to EVERY pushed branch** (owner word,
2026-08-03: "generally, I want branches to have at least draft PRs"), and a remote
branch carrying work is in a pull request or deleted (owner, 2026-09-24, two messages, verbatim:
"Standing rule, with aim for zero open PRs on balance , no work in remote branches that is not in a PR, and  work is not delivered until it is merged" and
"do not assume that a branch existing on the remote means that it should be merged, assess each one first. I suspect most have been assessed before. Any that should not be merged get deleted. A branch on the remote is NOT a compromise, they are not safe, they are not a backup option, they should be in PRs, or they should be deleted. That is a rule, remember it").
§6 carries the assessment and the deletion. The default branch is not a work branch, and
neither is a mirror of an upstream's default branch that a fork sync lands on. The firing
moment is the FIRST PUSH THAT CARRIES A COMMIT, as for a worktree above (GitHub refuses a pull request with no commits ahead of its base, so a push that carries
none has no pull request to open). The coordination branch opens its fold PR as a draft
at that push and rides it to the fold; a build-ahead
lane is cut from the parent branch it builds on — a WORKTREE shape only — and opens its
draft against the DEFAULT branch at first push, its diff carrying the parent's commits
until the parent lands (then one merge of the default branch when the parent landed by
merge commit, or a re-cut with the child's own commits cherry-picked across when it landed
by squash, shrinks it to the child's own story), or the dependency is deserialised by cherry-picking the parent's
fix across; a PR is never based on, or retargeted onto, a parent branch (Director ruling
2026-09-08 on the owner's standing rulings: stacks block the bot merge; dependent PRs
deserialise by cherry-pick; no parallel long-lived branches); a probe branch gets its
draft at push and closes with the probe.
History-only preservation still uses `preserve/` tags (§6), never a parked PR. Worked
instance, 2026-08-03: two branches (a build-ahead lane and the fresh coordination
branch) sat pushed and PR-less for an hour with this rule loaded — the owner noticed
from the branches page before any seat did; the creation/first-commit triggers had not
fired because neither branch read as a worktree lane at push time.

### 2. One bounded lane per worktree

A worktree owns one bounded lane — one coherent change set heading to one PR — not a
grab-bag. Keep the live worktree count to the lanes actually in flight; a worktree with
no active lane is a candidate for retirement, not a parking space. (For the role shape
that owns a lane in its own worktree, see PDR-117.)

### 3. A worktree is a temporary means, not a home — the lifecycle

create → build (`pnpm --dir <path> install && pnpm --dir <path> build`, scoped to the
worktree because this runs from the principal, before any gate, work or entry) → reside
(session-level residency per [`worktree-residency`](worktree-residency.md): launched
inside the worktree, or entered mid-session only with the owner at the platform's
approval prompt and the entry announced first; otherwise operated non-resident from the
principal) → first commit, pushed with its draft PR
→ do the bounded work → update onto `main` → mark the PR ready → merge → **remove the
worktree AND delete the branch.** A worktree that outlives its PR's merge, or never
opens a PR, is a hygiene violation to resolve.

### 4. Update onto `main` before ready; semantic-merge memory by hand

Before a PR goes ready, bring its branch up to date with `main` (it must not merge
stale — branch protection requires up-to-date). When the update touches agent memory/state files
(`napkin.md`, `repo-continuity.md`, thread records, registers), do NOT let git
line-merge them: a git auto-merge silently corrupts concept-bearing files
(drops/duplicates/stacks entries, often with no conflict marker). Author the union by
hand per the `semantic-merge` skill. The visible git conflict is the easy case; the
silent auto-merge of a both-sides-edited memory file is the dangerous one.
A merge cannot start over an uncommitted tracked file it touches — git
refuses, and the index-reset family is banned — so those edits land in their
own commit ahead of the merge (2026-09-02; 2026-09-06).

### 5. Do not commit on another agent's worktree branch

A worktree's branch belongs to the agent driving its lane. Do not commit, stage, or
rebase another agent's worktree branch, nor mutate the working tree of a shared checkout
you do not own; coordinate through comms and let the lane owner act. Reading is fine.

**Branch operations in a shared checkout are owner-gated.** Never switch or create a
branch (`git checkout`, `git switch`, `checkout -b`) in a checkout you do not exclusively
own without explicit approval — announcing the intent is not approval. Switching moves
HEAD under everyone sharing the checkout, so their next commits land on the wrong branch
(worked failure 2026-06-29: an unauthorised `checkout -b` put the owner's next two
commits on an agent's feature branch). The mirror discipline: in a shared checkout,
verify `git branch --show-current` before **each** commit — a peer can move the branch
under you mid-session. When commits do land on the wrong branch, recover without loss
and without destructive ops: `git branch -f <intended> <tip>` (fast-forward the intended
branch to the commits), `git switch <intended>` (content-identical, so uncommitted work
carries over), then `git branch -f <other> <its-clean-base>` to re-point the polluted
branch. No reset, no rebase, no force-push.

**A peer's untracked file is not evidence of abandonment.** Before committing another
session's untracked file "to conserve in-flight work", check it is not being actively
written (mtime vs now; peer liveness) — a file being edited *now* is live WIP to leave
alone, not orphaned work to snapshot (worked instance 2026-06-29: a peer's report was
conservation-committed mid-write; the peer's later edits stayed uncommitted for them —
additive, but the snapshot was premature).

### 6. Retirement requires a CONTENT check, not a commit check

Squash-merges make commit counts (`origin/<base>..HEAD`) meaningless — a branch's content
can be fully in `main` while showing many "unmerged" commits. Compare **files**, not
commit graphs (`git diff origin/<base> <branch> -- <file>`). Then, for each branch being
retired:

- useful information already in `main` (or a live lane heading there) → the branch is
  redundant → delete it;
- unique information NOT in `main` and worth keeping → **land it to `main`** (a PR)
  before deleting;
- unique information NOT in `main` and not worth keeping → consciously drop it ("if
  there is no information worth preserving, that is fine").

A follow-up pointer named at lane close is a record-binding question of the same kind:
it is mirrored into a TRACKED home — the owning plan node's dispositions table, or the
thread record the pickup seat reads — before the lane closes, and the lane-closed comms
event points at that home. Comms events are untracked by design and rotate, so a pointer
that lives only on one is orphaned work in prose (fourteen pointers from three lanes,
2026-09-04/05, recovered by the consolidation of 2026-09-06).

**Standing prune policy for the proven class** (owner grant 2026-07-21:
"Pruning worktrees that are provably safe to remove should absolutely be
standing policy"; widened 2026-08-05: "anything proven on main can be
deleted, and in fact should be deleted as a standing protocol, to keep the
local environment tidy, no redundant branches, no redundant worktrees").
Provably safe = BOTH, proven per item: (a) `git status --porcelain` empty
in the worktree, and (b) its HEAD an ancestor of a freshly-fetched
`origin/<base>` (`git merge-base --is-ancestor`) — or, where the branch
landed by squash or is content-superseded, the content proof recorded
instead: every file proven present newer on the base by content
comparison, the comparison written down before the removal. A content proof
reads decisions, not lines alone: before a branch is retired as
content-superseded, each line absent from the base is read against the
decision that superseded it, and a line absent by a later decision is not
lost work (a six-file residue script read zero while a 22-file line proof
found absent lines in ten files, every one superseded by a later decision,
2026-10-02). Items passing both prune
without a per-item ask: `git worktree remove` (never `--force` — its
dirty-refusal is a safety net) plus `git worktree prune` for gone
registrations, and plain branch deletion for proven local branches, with the bot's API
delete for a proven remote branch (its freshly fetched tip an ancestor of the base). A
content-superseded branch (every file proven present newer on main by
content comparison, not SHA ancestry) also deletes, with the comparison
recorded first. Anything failing either proof, the active lanes, and
a peer's worktree under `.claude/worktrees/*` are NEVER touched. The grant covers
the worktrees and branches the seat owns: a peer's dormant worktree is
theirs even when its content is superseded on the base (owner refusal,
2026-09-03). Worked instance: 2026-07-21, 50 → 9 registrations (37 proven
removals + 5 stale prunes), zero losses.

**Every remote work branch is assessed before it is merged or deleted** (the owner's
2026-09-24 rule, §1, under which the default branch and an upstream mirror are not work
branches). The assessment is first-hand: the branch's tip, fetched into its
tracking ref (`git fetch origin "+refs/heads/<branch>:refs/remotes/origin/<branch>"`),
against a freshly fetched default branch, and the records for an earlier assessment. A
branch existing on the remote is never a reason to merge it. Merged: it joins the proven
class above. Wanted: its pull request opens, ahead of any new opening (`pr-lifecycle`
§Phase 7). Not wanted: it is deleted by the bot's API delete and read back absent, with
the reason in the records; a branch that never had a pull request loses its commits from
the remote with it, so its content is proven held elsewhere, or the loss is accepted in
the record, first. A peer's branch is theirs: its assessment goes to its owner.

**A dirty worktree joins the proven class once each dirty file is proven**
(owner word 2026-09-08: "proven safe deletions are fine"). A failing
precondition is a question, not a verdict: "dirty" is established or
cleared per file, never read as the end of the analysis. For each path
`git status --porcelain` lists, prove its content on the freshly-fetched
`origin/<base>` — identical there, landed there and since revised, or
conserved in a tracked home (an archive page, a landed record) — and record
the proof per path in a surfaced table, and inventory the IGNORED paths
too, in the same command as the removal, every time (a prune ran without it,
2026-09-25) (`git status --porcelain --ignored`, which collapses an ignored
directory to one `!! <dir>/` entry): an ignored path is data the porcelain
proof cannot see and `git worktree remove` deletes it with exit 0, so each
entry is named with its disposition — a copied `.env.local` confirmed as a
copy of the primary's; fetched data re-fetchable per its owning workflow;
build output by directory name (`node_modules/`, `dist/`, `.turbo/`) — and
any ignored directory that is not build output by name is listed
recursively, links included (`find <dir> -type f -o -type l`), and
dispositioned entry by entry before the removal. Then clear each proven path as the
standing grant for proven paths specifies (`never-use-git-to-remove-work`,
owner-ruled 2026-09-08): the working tree and index for the path brought to
what HEAD records — content, type and mode — by forward writes only, the
clearing proven by `git status --porcelain -- <path>` reading empty, and any
path the writes do not bring to empty surfaced with its proof, never
improvised; the recipe lives in the grant and is not restated here. The
blocked command forms stay blocked; the grant is a write of proven content.
Confirm (a) and (b) afresh, then
`git worktree remove` without `--force`. One path failing its proof keeps
the whole worktree outside the class, and a path shape the table did not
name is surfaced, never improvised. Worked instance 2026-09-08: a
consolidation worktree with three dirty files (an experience page
identical on the base; a napkin block conserved in the tracked archive; a
register comment landed and since revised on the base) proven per path,
cleared by forward write, proven clean and ancestor, removed without
force, zero losses — the instance whose per-instance word became the
standing grant.

Destructive removal OUTSIDE the proven class (`git worktree remove` of
anything unmerged or carrying an unproven dirty file, deletion of any branch
not ancestor- or content-proven) remains owner-authorisation-gated and never removes
information not first confirmed in `main` or consciously released
(`never-use-git-to-remove-work`).

A third disposition exists for a branch worth preserving as HISTORY but not landing:
an **annotated tag** (`git tag -a preserve/<name> <tip> -m "<why kept>"`, pushed)
pins the whole lineage at zero loss, and the
branch then deletes cleanly (worked instance 2026-07-20: a held spike branch preserved
under a `preserve/` tag on owner ruling; branch removed same day).

**An OWNED preservation PR must carry a LIVE DISCHARGE PATH** (owner rulings,
2026-07-26, #556/#567): a named condition, checkable by anyone, whose
satisfaction retires it — or it is not owned, merely parked, and
parked-indefinitely is a third state the owner rejects alongside unmerged and
unclosed. PR #556 was the negative instance (a preservation draft whose
single file targeted a path no longer on main, its substance already
conserved elsewhere — a wrapper around nothing that no event could ever
discharge); PR #567 the positive (same form, but every part of its body
names what retires it). The test for any preservation surface: **can a
stranger read the artefact alone and say what event deletes it?** If not,
it is parked, whatever its label says.

**"Orphaned" is a RECORD-BINDING question, never a git-state question**
(sweep generator lesson, 2026-07-25): dirty/unpushed does not mean orphaned —
everything named by a live record (ticket, thread record, handoff, PR) is
already dispositioned; the genuine orphans are exactly the items no record
names. Closeouts declare worktree dispositions, so a closeout leaving an
unnamed worktree is what reopens the class.

### 7. Surface idle, PR-less, or stale worktrees

A worktree that is idle with no open PR, or whose PR has merged but the worktree
lingers, is surfaced for retirement rather than left to accumulate. Keep the
cross-worktree work-state map current at the F-41 coordination home (the interim map;
its durable form is the F-98 registry) — tracked `.agent/` files are per-branch and
invisible across worktrees, so
the map is the only surface on which a forgotten worktree becomes visible.

### 8. Operate correctly from a worktree

Working-directory residency — the lane agent's session cwd IS the worktree,
established by a session-level mechanism and stable until the agent changes it —
is governed by [`worktree-residency`](worktree-residency.md) (owner directive
2026-07-31). Build before work (`pnpm --dir <path> install && pnpm --dir <path> build`,
scoped to the worktree — the eslint plugin dist and the statusline both come from the
build). A fresh linked worktree installs itself on its first script run and holds no
workspace package `dist`, so knip's config loader fails there until the package is built;
knip and the dependency cruiser run inside the pre-push gate's `pnpm check`, never by hand
beside it, so a worktree's packages are built before the push; the commit hooks run the
formatter, markdownlint and the changed-files lint only, plus the staged profanity check
where the estate carries it (2026-10-14). From a worktree,
collaboration-state commands need
the primary path passed explicitly (`comms list/watch/inbox --comms-dir`, `claims
--active`); only `comms send` auto-anchors to the primary, and a relative path silently
lands worktree-local. Switching branches with dirty doctrine files carries a broken
validator state into the next branch's hook run (two failed ceremonies of about eight
minutes each, 2026-09-06): commit or leave a dirty file before switching, never carry it;
an untracked file parks in the session scratchpad and the index is regenerated. Per-seat
stderr sinks and scratch output live in the session scratchpad, never under
`.agent/state/collaboration/` (the coordination home holds durable cross-agent
artefacts only; 2026-09-06).

Repurposing an idle provisioned worktree beats re-provisioning: a merged-PR
worktree switches to a new branch in seconds at zero install cost. Two
mandatory follow-ups: rebuild agent-tools after the switch (the
stale-dist-after-switch class; see the frictions register), and expect
`git switch` to fire harness "file modified" notices for every
checkout-updated file — checkout noise, never peer edits.

Worktree isolation is weaker than it looks — three proven leak paths: a **nested**
worktree gives false-clean dependency runs (Node resolution walks up into the parent
checkout's `node_modules`, so a missing dependency passes locally and fails everywhere
else); parallel `isolation: worktree` subagents can inherit the **wrong base commit**
and write to main-repo **absolute paths**, so verify a spawned worktree's HEAD and keep
paths worktree-relative; and a whole-repo sweep rebuilds its tree's build output, deleting
it first where the `check` script runs a `clean` step, from under every session that reads
that output, a session in another worktree whose hooks resolve the primary checkout's
build among them (the
[`check-singleton-per-window`](check-singleton-per-window.md) hazard). Isolation is a
property to verify per-seam, never an assumption.

**A linked worktree's merge markers live in its own git directory.** `MERGE_HEAD`,
`MERGE_MODE` and `MERGE_MSG` for a linked worktree sit under
`.git/worktrees/<name>/`, never at the main `.git`; a marker read at the main
`.git` looks "gone" while the merge is intact. In a linked worktree every
marker path is `$(git rev-parse --git-dir)/<marker>`, resolved from the
worktree. A seat once recorded a "vanished marker" trap and carried a recovery
recipe across a compaction boundary when the marker had never moved and the
actual refusal was one lint error in the gate log it had not read (2026-09-10):
read the gate log in full before naming a refusal's cause, and never carry an
unread diagnosis across a boundary as a fact.

**Every git act precedes the removal of the session's own worktree.** A
worktree-resident session may not run `git -C <other-checkout>` nor
`cd <dir> && git …`; once its own worktree is removed, every git invocation
is refused by the residency hook and the shell's cwd recovers to the home
directory (measured 2026-09-08). Ancestor proofs, branch deletes and
`git worktree list` all run BEFORE the removal; afterwards the evidence
comes from `ls` on `.git/worktrees/`, `grep`, and the GitHub API. The
removal of the session's own worktree works from a script that changes
directory out first and targets the path with `git -C <that-worktree>`.
And never let the persistent shell's cwd land in the primary: a
`cd <primary> && <command>` runs once, then the Bash tool's cwd persists
there and the residency hook refuses every later command, a bare `cd` out
included, and subagents inherit the pinned cwd. Run the one-off in a
subshell, `( cd <primary> && … )`, so the cwd never moves; the escape that
worked was `EnterWorktree` with `path` set to an existing worktree under
`.claude/worktrees/`.

**A foreign dirty primary is pushed through a proxy worktree.** When another
agent's uncommitted edits in the shared primary fail the push gate (the gate
reads the working tree: a link into an untracked directory, an unformatted
file), the committed shas are pushed from a clean detached worktree cut at
the branch's tip, and the primary's tree is never touched; the successor
branch is then cut by hand from the pushed tip (2026-09-28).

**Every remote work branch is in a pull request or deleted** (owner, 2026-09-24;
the default branch and an upstream mirror are not work branches, §1). Assess
each remote work branch first-hand: wanted work goes to a pull request and
is driven to merged, since delivered means merged; everything else is
deleted as the bot with read-back, the conserved copy verified first for
anything unmerged. The standing target is zero open pull requests. It
is reached by landing, never by capping intake: offered a per-seat intake
bound as a route to it, the owner selected "No bound" (card answer,
2026-09-26, relayed by the Director; one instance), and the Director's
programme then read pull requests opened beside those merged.

**The rule in the owner's words of 2026-10-19** (in-chat to the reviewer seat at
n=1, after the seat reported that the relayed form "all work must be deleted or
pushed and in a PR, no exceptions" was on no record; verbatim): "All work is only
considered safely recorded once it is pushed and in a PR, work is only considered
complete once it is merged. Work in all worktrees and branches must be either made
safe or, if it is of no use, deleted." And of the session that heard it: "That is
the rule. This session remains a named exception because I don't want to spend
time on a merge right now." The two states are distinct and both his: pushed and
in a pull request is safely recorded; merged is complete. A branch or worktree that
is neither is in neither state, whatever its ref says. An exception to the
completion half is his to name, per session, with its reason, as he named this
one; none was named for the recording half. The 2026-09-24 words above are the
same rule in his earlier form.

System residue (`.DS_Store` and its kind) is gitignored, and is deleted where it is found
(owner, 2026-08-02). It is not work, and no seat's claim covers it.

## Failure mode this prevents

Orphaned worktrees: branches with commits that never reach `main`, no PR, invisible
across worktrees, accumulating until nobody remembers what they hold — and the false
confidence that a surviving branch has preserved the work.

## Worked instance

2026-06-27: the dissolved worktree-pilot team left seven stale worktrees, several with
commits not in `main` and two never pushed. Because none carried a live PR and tracked
`.agent/` state is per-branch, the estate had to be reconstructed from `git worktree
list` and a per-worktree **content** audit (squash-merges had made commit-existence
meaningless) before any could be safely removed. The audit found exactly one piece of
information not in `main` worth preserving — an experience reflection on a pushed pilot
branch — which was landed to `main` before the branch was retired; everything else was
already in `main` or superseded. Had each worktree carried a draft PR from creation, the
estate would have been self-describing (the PR list) and self-cleaning (merge → remove),
and no archaeological audit would have been needed. The owner correction that
crystallised the core invariant: *"branches existing is secondary; preserving
information in `main` is all that matters — do not treat 'branch exists' as 'information
safe, job done.'"*

## Why a rule, not a PDR clause

Worktree hygiene is a per-session, agent-general discipline that fires at structural
moments (worktree creation, PR-ready, retirement, estate audit), so it belongs in the
always-applied rule tier (`new-rule-vs-pdr-clause` classifier #1). No existing PDR owns
it: PDR-117 owns the Director/Implementer roles (an Implementer works one lane in its
own worktree) but not the worktree lifecycle discipline, which applies to any agent
holding a worktree.

## Related surfaces

- [PDR-117 (Director and Implementer roles)](../practice-core/decision-records/PDR-117-director-and-implementer-roles.md)
  — the Implementer owns one bounded lane in its own worktree.
- [`never-use-git-to-remove-work`](never-use-git-to-remove-work.md) — destructive
  removal is gated and content-verified; deletion never removes unpreserved work.
- [`semantic-merge` skill](../skills/change-custody/semantic-merge/SKILL-CANONICAL.md) — the
  concept-union discipline for memory/state files at branch→main.
- The coordination-home checkout owns `.agent/state/collaboration/` and feature
  branches do not carry it ([`.agent/state/README.md`](../state/README.md)); the basis for the
  cross-worktree-visibility and memory-merge clauses.
- The cross-worktree work-state map at the F-41 coordination home
  (`.agent/state/collaboration/`) — the visibility substrate; its planned durable form is
  the agent-work-state registry (F-98).
- The comms-and-worktree-operability work — the operating mechanics (path anchoring,
  statusline) that clause 8 states inline; doctrine carries no dependency on it.

## Enforcement

Behavioural at worktree creation, first push, and retirement. The draft-PR discipline is
observable (every pushed branch with work has a PR on the list); the content-check-before-removal
is the named retirement step; the cross-worktree map makes a forgotten worktree visible.
Future hardening could add a check that flags any pushed branch with no open PR — the
2026-08-03 worked instance above is the evidence that the behavioural clause alone does
not hold, so this check is a live candidate, not speculative hardening.
