---
name: cross-fork-integration
classification: active
description: >-
  Integrate the upstream's default branch into this fork's as a semantic
  event, never a text merge: verify the mirror and carrier, merge-tree against
  the live tip, one two-parent merge with an ordinary message, regenerate the
  generated surfaces, reconcile memory files by concept, sweep the fork's
  documents and plans for premises the change refutes, resolve numbering
  collisions, land by merge commit under the required checks.
  Use when a sync carrier exists or is due, when GitHub calls a sync dirty that
  git merges cleanly, or when fork docs read stale after an upstream change.
  Not for two branches of one lineage (complex-merge), memory files alone
  (semantic-merge), or a finding on carried code that does not block the merge
  (its own lane, after the sync lands).
  Right: one carrier, two merge commits (the carrier's, then the landing's),
  docs re-trued in the same landing, the tree diff against upstream equal to
  the enumerated fork diff. Wrong: squash or
  rebase; a release-commit head that runs no check; hand-edited generated
  pages; plans asserting what upstream refuted.
---

# Cross-fork integration

## Why this exists

This line is a fork that syncs from its upstream by merge until it merges back.
Each sync leaves a merge commit the Oak fork does not carry until the merge-back
fast-forwards it, so the fork's tree is upstream's tree plus a deliberate,
enumerated diff (the regenerable fork diffs and the local cures of carried
code) — and the check that it
still is so is a tree diff, never an ancestry test. Git proves that the text of
two histories combines. It has no conception of meaning, and an integration
changes meaning in four places git cannot see:

| Layer | What changes | What proves it | Who does it |
| --- | --- | --- | --- |
| Code | signatures, contracts, imports | type-check, tests, the required checks on a combined candidate | the gates |
| Generated surfaces | anchored excerpts, adapters, corpora, codegen | each generator's own check (byte equality, `--check`) | the generators |
| Memory and state files | narratives, registers, thread records with a `merge_class` | concept-level reconciliation | semantic-merge |
| Documents and plans | premises stated as fact | a premise sweep by reading | this skill, §6 |

The fourth row is the one this skill adds. On 2026-09-09 an upstream change
that touched no plan file left three delivery plans and one research record on
this fork asserting that Oak's within-thread unit order was published on no
surface, the day after upstream began serving it. Every one of those files
merged cleanly. The owner's word that day: "plans and all documentation always
need to be kept up to date, and that always requires semantic analysis, git has
no conception of meaning."

## Authority frame

- **Two peer forks, never an upstream** (owner, 2026-09-16, verbatim: "there
  is no 'upstream' there are two forks of OCE. Eventually this fork will be
  merged back to the Oak fork. All of those issues should be fixed locally,
  they go to Oak when the fork syncs back, not before."). In this skill,
  "upstream" names the Oak fork as the source of a sync, never an authority.
  A reviewer finding on code that arrived with a sync is cure-worthy on this
  fork: cure it in its own lane (on the carrier only where it blocks the
  merge; step 8's carrier rule), and the merge-back delivers it. Nothing is
  ever sent to the other fork's maintainers. Ask, of any finding: whose code is
  this, and where does a fix travel?
- **History is never rewritten across the forks** (owner, 2026-09-10,
  verbatim: "never, ever rewrite history from the upstream fork, when we merge
  back it must be purely fast forward"). A sync is a merge; no squash, rebase or
  amend touches commits that came from the other fork.
- **The fork holds its own product authority.** An upstream product decision
  arriving through a sync is a fact about upstream, not a constraint here,
  unless the owner adopts it.
- **Fork diffs are deliberate, enumerated and regenerable.** Organisational
  identity lives below the tree (ADR-231); a hand-carried prose divergence that
  upstream also edits conflicts at every sync and is a defect to remove.
- **Numbering across lineages.** ADRs, PDRs and plan ids are minted
  sequentially from the highest existing record on the lineage being edited.
  When a sync reveals that upstream has taken a number the fork also used, the
  fork's record is renumbered to the next free number in the sync's own commit,
  with every citation updated; the fork never reserves a block, because a block
  is estate identity carried in the tree.

## What each step proves

The procedure below is a sequence of proofs, and a case the steps did not
name is judged by the proof it belongs to, never by adding a case:

1. Both lineages' identities and tips are known first-hand, and the carrier
   is single.
2. The merge algorithm's own verdict on the live tips, not a cached one.
3. A head whose checks run, carrying the default branch's tip as it stands at
   the slot word.
4. Every generated surface is true by its own generator's check.
5. Every memory file is true by concept.
6. Every fork-side document that differs from upstream has been read for
   the change's claims, with a disposition per hit.
7. No record number or name collides across the lineages.
8. The required checks are green on the candidate that lands, and every
   thread is dispositioned.
9. The landed tree, read from refreshed refs, is upstream's plus the
   enumerated fork diff.

Two names run through the whole procedure and are derived once, never
assumed equal: `<fork-default>` (this repository's default branch, read from
the repository service — `engraph` on this line) and `<upstream-default>`
(the parent's default branch, read the same way — `main` for this line's
upstream). Every fetch of upstream names the second; every merge target,
carrier merge and landing proof names the first.

## The procedure

### 1. Verify the mirror and the carrier before touching anything

- Live identities: the fork's repository id, its parent's id, `<fork-default>`
  and `<upstream-default>` — read from the repository service, never assumed.
- The upstream tip: fetched read-only (`git fetch upstream <upstream-default>`,
  under the standing read-only grant; the fork never pushes to upstream, and a
  disabled push URL on one machine is a convenience, never the check). A
  receipt on the carrier ("no newer upstream snapshot queued") is evidence at
  its own time only and never substitutes for the fetch: on 2026-09-09 a
  receipt three hours old preceded a fetch that found eleven newer commits.
  Compare with the carrier's head: a newer upstream tip queues as the NEXT
  carrier; a reviewed head is not moved.
- The fork's tip: `git fetch origin <fork-default>:refs/remotes/origin/<fork-default>`
  with the explicit destination refspec — a single-branch clone's fetch updates
  only `FETCH_HEAD` for a branch outside its refspec — so every recompute below
  reads the refreshed remote-tracking ref, never a local branch.
- The carrier's head: `git fetch origin <carrier>:refs/remotes/origin/<carrier>`,
  the same refspec form, fetched HERE so that `origin/<carrier>` exists for
  step 2's recompute and step 3's worktree; neither step fetches it again.
- The carrier: exactly one open sync pull request, filtered server-side by
  head branch (`gh pr list --repo <fork> --state open --head <carrier>
  --json number`); a `--search` head-name query returns nothing, silently,
  and any listing read as "the full open list" carries an explicit
  `--limit`, because the default page is thirty. A second carrier for the same
  lineage is a defect; close it on the record. A carrier the mirror has moved past is
  replaced by the seat taking it up, never by automation (the carrier workflow
  closes and deletes nothing, so it can never act on a carrier a seat is taking
  up). Where the open carrier is unworked (a draft the carrier workflow's bot app
  opened, read from the pull request's author, whose head is still the sha in its
  branch name, with no review round), the seat, holding the claim on the
  carrier branch pattern so that exactly one seat acts, replaces it in an order
  that the carrier workflow's own schedule cannot break, because that workflow
  opens nothing while any carrier is open. First, with the stale carrier still
  open, the mirror: where it is behind the upstream tip, dispatch the mirror
  workflow under the merge-bot's `upstream-mirror-dispatch` scope (a scope
  `merge-bot pull-request dispatch-workflow` does not mint, so the mirror's
  dispatch stays a separate route for now), wait for that run to conclude
  `success` (a dispatch returns at once and orders nothing), and re-read the
  mirror's tip as equal to the upstream tip. Second, as the bot, close the
  stale carrier with
  `pnpm agent-tools merge-bot pull-request close --pr <n> --reason-file <path>`
  (the command posts the reason as its comment, then closes), then delete its
  branch. Third, dispatch the carrier workflow with
  `pnpm agent-tools merge-bot pull-request dispatch-workflow --workflow upstream-carrier.yml`,
  minted at `workflow-dispatch`, and wait for it; a scheduled run may have
  opened the carrier first, and either is accepted. Take
  up the one open carrier, confirming its head is the mirror's tip
  (worked instance: the carrier at
  release 1.181.4, replaced by hand on 2026-09-17 after sitting 76 commits
  stale). A carrier holding a seat's commits or a review round is never
  replaced: a newer tip queues as the next carrier. A pull request on the carrier
  branch pattern by any other author is never closed or deleted by a seat,
  whatever its state: it is raised to the owner.
- Exclusive counts both ways, from fetched history, and the merge base.

### 2. Recompute the merge against the live tip, not the PR's cached base

`git merge-tree --write-tree --name-only <default-tip> <carrier-head>` is the
truth. GitHub's `mergeable` reads the pull request's cached base, and its
verdict can disagree with git's: on the founding sync it reported the pair
dirty at a file the fork had moved into a `paused/` folder and upstream had
appended to, while git with rename detection merged cleanly, and turning
rename detection off reproduced the conflict locally — a diagnostic that
explains the disagreement without establishing what GitHub's merge does.
Record both readings — the command, its exit code and the tree it wrote —
on the PR; act on the local one; say why they differ. The recompute is a
one-second read and is the right step even when it changes nothing (on the
second sync it returned the tree the receipt had predicted, and the seat then
held that fact rather than the receipt's claim). In the minute after any
landing the repository service reads every open pull request's merge state as
UNKNOWN while `git ls-remote` already shows the moved tip: act on git's tip;
the service catches up at the next push.
When `merge-tree` exits 1 it names the conflicted paths: stop here, resolve
them by the complex-merge skill (the divergence guide's cascade classes, the
semantic-merge skill for any `merge_class` file) on the carrier, and rerun
`merge-tree` until it exits 0 — `git merge` on a genuine conflict stops with
unresolved files and every later step is inapplicable. On that route the
complex-merge handler's own merge commit IS this skill's step-3 merge: the
procedure resumes at step 4 with step 3's attributes (author, committer,
`--no-ff`, the message rule) on that commit.

### 3. Carry the snapshot on one two-parent merge with an ordinary message

Work in a dedicated worktree checked out at the EXISTING carrier head —
`git worktree add <path> -b <carrier> origin/<carrier>` on the remote-tracking
ref step 1 fetched; the lane-cut skill's step 1 cuts a new branch from a base,
which is not this — with the inherited commit identity verified (its step 2),
dependencies installed BEFORE any commit, and the local env file carried.
Install first is a hook-integrity requirement, not a convenience: a fresh
worktree has no `.husky/_` until install runs, so a merge commit made before
it is created with no commit-msg or pre-commit hook and reads as if the gate
passed. Merge the default branch INTO the carrier, `--no-ff`, with a message
that names the situation without spelling the CI-skip token anywhere in the
message: `git merge --no-ff -F <message-file> <fork-default-tip>`. Author and
committer are both the owner, from the clone's shared identity, on the merge
and on the command that completes a conflicted one. In every case the pair
is read back off the commit (`git log -1 --format='%an <%ae> / %cn <%ce>'`)
before the push. The CI-skip token matters because the host scans the whole
head message, and a head that is upstream's release commit runs no workflow
at all. The head that lands must be a commit whose checks ran; when
the carrier is to carry upstream's release commit unchanged, the carrier head
becomes one empty commit on top of that release commit (the release commit
stays its parent), the checks run on the empty head, and the landing is still
a merge commit.

Make this merge AT THE SLOT WORD, never at readiness (pr-lifecycle §Phase 7,
the landing slot): under a require-up-to-date ruleset every landing ahead of
the carrier moves its base, so a merge made at readiness is superseded by
each of them and redone at the slot — on 2026-09-09 a carrier merge made at
readiness was superseded four times before its slot. Before the word, prepare
everything that does not depend on the tip: the generators' checks, the sweep
terms, the thread dispositions, the merge message. AT the word, before the
merge, repeat step 1's fetch of the fork's tip and step 2's recompute against
it — every landing since the preview moved the tip, and a merge of the
previewed tip would leave the carrier BEHIND with a tree hash that proves
nothing about the slot-time merge. A merge already made at
readiness is not removed when the word comes (`never-use-git-to-remove-work`):
the slot-word merge lands on top of it and the carrier carries two merge
commits of the default branch (2026-09-09: 36bb08928, then 007b0d32e); the
history is valid and the cost is one redundant merge commit per early merge.

The tree step 2's `merge-tree --write-tree` printed at the slot word against
the live tip is the tree the merge will have. Write it into the merge message; after the merge,
compare the commit's tree (`git log -1 --format=%T`) with it. Equality is the
proof that what was previewed is what landed (2026-09-09: 529d87443 on both
sides), and it goes into the tally with the head.

### 4. Make every generated surface true again

Run the generators, never edit their output: the MCP content workspace
(`build-mcp-content-workspace`, checked by byte equality), the skills adapters,
SDK codegen when the spec moved, corpus data when the bulk moved. Then the
repository validators. A generated page that drifted is regenerated whole; a
generator that refuses is a defect to cure in the generator. Count the
regenerated output from the run (`git status --short` after the generators),
never from the carrier's receipt: on 2026-09-09 the receipt predicted six
regenerated pages and the generator changed seven.

### 5. Reconcile memory and state files by concept

Any file carrying a `merge_class` follows the semantic-merge skill: the union is
read as concepts (a thread's identity table, its newest-section witness, its
link targets), and a clean auto-merge is not evidence of a correct one.

### 6. Sweep the fork's documents and plans for refuted premises

Derive the sweep terms from the incoming change's claims, never from its file
list and never from the reviews:

- upstream's own retraction list, read from FETCHED HISTORY only — its thread
  record, ADR amendments, changelog and commit messages name the wording it
  withdrew; an upstream pull request's body or review is a repository-service
  read that the downstream-checkout rule gates behind fresh owner permission
  for each read, so it is consulted only with that permission and never
  required by this step;
- the new facts the diff introduces (a version, a shape, a served field, a
  count);
- the old facts those replace (the negations: "unordered", "published on no
  surface", "not yet", the previous version string).

Search every fork-side document upstream's sweep could not reach: enumerate
them as the files that differ from upstream's tip
(`git diff --name-only <upstream-tip> <fork-default> -- '*.md' '*.json'`), which
includes the fork-only surfaces (delivery and strategic plans, runbooks,
research and report records, executive memory, fork-only governance pages)
AND every shared file carrying a fork-added paragraph. The keyword search
over the sweep terms is discovery, never the completeness boundary: a
paraphrase of a refuted premise is found by reading the enumerated files'
claims, not by matching their words. For every hit choose one disposition
and write it down in the PR:

- **re-true** — a permanent document (a plan body, an authority index) gets the
  true statement, dated where the schema dates it;
- **narrow** — a plan whose request or scope is partly overtaken keeps the
  residue that is still true and says what overtook the rest;
- **archive as overtaken** — a plan whose whole premise upstream delivered
  moves to the archive with the overtaking change named;
- **addendum** — a dated record (a report with reopening triggers, a review
  record) is never rewritten; it gains a dated section stating which trigger
  fired and what stands.

A re-truing narrows to the claim the change refuted, never wider: write the one
sentence the change falsified and leave the rest standing (2026-09-09, the
over-reach shape — a reconciliation replaced a whole acquisition criterion
when the incoming decision had altered one class of it).

The sweep's completeness boundary is the enumerated file set, read for the
change's CLAIMS — a paraphrase names no component, surface or version, so no
word search and no subject filter can stand in for that read. Depth is
proportioned inside the boundary, never the boundary narrowed: every keyword
hit and every enumerated file whose subject the change touches is read whole;
every other enumerated file is read at the claim level — its headings and the
passages that assert facts about the changed area — and a file with no such
passage is recorded as read-and-clear. A second keyword pass "finding nothing
new" is neither the boundary nor a proof. Search one term at a time in the
plain form (`git grep <term> origin/<fork-default> -- '*.md'`); a pathspec
assembled by substitution gave different counts on two runs (2026-09-09). Its
cost is a read; its absence is a fork estate that lies about upstream.

When the default tip has moved since the sweep, the paths changed between the
swept tip and the landed tip (`git diff --name-only <swept-tip> <landed-tip>`)
are a candidate set, not the enumeration's growth: intersect it with the
fork-side enumeration (paths outside the document boundary drop out), then
read every file in the intersection at the landed tip under the same boundary
rule — keyword hits and subject files whole, the rest at the claim level —
INCLUDING files swept before, because a changed file may carry a new
assertion; the only files not re-opened are those whose content is unchanged
since the first read (2026-09-09: forty changed paths, all inside the
enumeration, read again). Every hit is classified before it is dismissed (a
system list, an unchanged index title, a homonym of the term), and the
classification is written into the merge message and the tally, so "nothing
to re-true" is a read a reviewer can check, not a count.

### 7. Resolve numbering and naming collisions

ADRs, PDRs, plan ids, generated file names: renumber the fork's own record per
the authority frame, in this commit, with citations. Confirm the index rows.

### 8. Open the round, settle, land

Push as the bot with `pnpm --silent agent-tools merge-bot push --json`, the
worktree as the working directory (the entry point exactly as it runs;
`--branch <name>` only when HEAD's branch is not the name to push): HEAD's
branch by name, the bot identity over a file-backed token that is never in
argv, hooks running, no force flag; a rejected non-fast-forward is answered by
merging, never by overwriting. It never touches branch tracking (its git argv
is `push <remote> <commit>^{commit}:refs/heads/<branch>`): a lane branch cut with `-b <name>
origin/<fork-default>` keeps tracking the default, so `git status -sb` reads
ahead/behind against the DEFAULT, never the pushed branch, and a branch cut
without tracking shows none — either way the closeout's `git branch
--set-upstream-to=origin/<fork-default>` precedes `git branch -d`.
A fresh worktree needs its workspaces built before the pre-push gates pass
(the standards ESLint plugin's `dist/` for lint; the agent-tools `dist/` for
the CLI itself). Undraft; declare the review tally at open (pr-lifecycle
§review-round state machine); harvest every thread. What a carrier fixes is
the owner's rule (2026-09-19, verbatim): "If the merge to the engraph branch is
blocked by errors, fix them, if it is not blocked but we can see issues then
merge and we fix in a separate PR." So an error that blocks the merge (a
conflict, a failing required check, a broken gate), whether the sync or the
carried code causes it, is fixed on the carrier. An issue that does not block
the merge is recorded, with its file and line, on a local work list and fixed in
a separate pull request; its thread's disposition names that list, and it
neither holds the carrier's landing nor counts against its review rounds. A row
on that list records terminal facts (a landed SHA, a pull request number) and
its routing, never a pull request's transient state (2026-09-20). Three
carriers routed every carried-code finding away under the
withdrawn upstream model and counted none of them cure-worthy — #99 (1.179.0), #127
(1.181.1, whose round one cured five findings on the sync itself) and #147
(1.181.3); the 1.181.3 set is OCE's local work list (its upstream-sync report
draft for that sync, dated 2026-09-15), and the 1.179.0 and 1.181.1 sets have
not been re-read under the peer-fork model. Settle at green by name
(`run-quality-gates`, `CodeQL`) and clean (zero unresolved, `CLEAN`, the quiet
window) — the front door's own wait-class polling is the settle instrument: a
background settle watch is a process the host may kill (several times across
two seats on 2026-09-10, under its memory heuristic), and the typed verdict is
the record either way.
Merge by MERGE COMMIT as the bot through the one sanctioned front
door, `pnpm agent-tools merge-bot merge --pr <n> --expect <reviewer>
[--expect <reviewer> ...]` — `--expect` is repeated once per AVAILABLE
reviewer in the repository's automatic-review configuration (or is
`--expect none` when the seat has answered the owner's one question of
2026-10-27, "do we need a review in order for this work to be safe and
effective?", with no: upstream's own release, read first-hand in the sweep,
its conflict resolutions under the full gate), the set
pr-lifecycle's Phase 1 declares as the state machine's input for every round,
never narrowed to the reviewers that happen to have bound the tip and never
widened to a vendor declared unavailable: a reviewer left undeclared is
invisible to the tool's recomputation, and a declared leg that never reviews
the tip (Copilot reviews the first push and any tip the bot requests it on)
settles through the timeout to SETTLED-NO-REVIEW, which the front door
refuses by name — the docs-only bot-authored class then lands through the
sanctioned REST endpoint under the owner's exception below; any other pull
request lands with each configured leg as the tool reads it on the tip,
SATISFIED or UNOWED (the configuration reviews no later push and nothing was
requested: a review is requested on a tip only for a stated reason, never to
fill a leg — the owner, 2026-10-27; where a review is wanted of a
vendor that is unavailable, a subagent review of any kind posted on the pull
request and reported back stands as the leg — owner ruling 2026-09-10,
pr-lifecycle §review-round state machine item 3 — bound to the sha it
reviewed: the premises record that sha and every push since, and those
pushes carry only cures of its findings, the tip sync and landing-defect
cures, else a fresh leg on the new head; a leg the MERGING SEAT verifies
and records on the landing premises, because the tool checks only the
vendors declared to it) and runs the front door
again (pr-lifecycle §merge boundary;
`.agent/reference/merge-bot.md`): it recomputes
the settlement verdict itself, merges only on SETTLE-READY, and pins the
verdicted tip's sha in its own call, so the landing merge's second parent IS
the head the verdict was read on and a head moved between verdict and merge
answers 409 rather than landing unverdicted. A client-side merge with a
head-match flag checks the sha and nothing else — the 1.179.0 carrier landed
that way on 2026-09-09 (ead92d875's second parent is 007b0d32e) with no
tool-side recomputation of the reviewer leg, which is the gap the front door
closes. One class the front door refuses by name: a round settled only by
timeout (`SETTLED-NO-REVIEW`) on a bot-authored pull request that touches
only documentation and Practice surfaces is merge-eligible under
pr-lifecycle's owner-ruled 2026-09-03 exception, and until the tool learns
that class the merging seat recomputes the gate by name and lands it through
the sanctioned REST endpoint as the bot; a carrier that carries code is never
in that class. Squash or rebase would diverge the history from upstream and
make the next sync a conflict.

### 8a. The other open lanes at a landing

Every landing flips every other open pull request BEHIND; the landing
broadcast declares the slot order — the Director's call, and by pr-lifecycle
§Phase 7 the slot goes to whichever pull request is green and clean first
rather than being held empty. That passing happens BEFORE a word is acted
on: a queued candidate whose review round is open is not green and clean, so
the word can pass to the carrier ahead of its turn (2026-09-09: a candidate
with ten open threads passed the word to the 1.179.0 carrier). Once a holder
has taken the word and pushed its sync it RETAINS the slot through the review
round that push opens, its settlement and its merge — that round never
re-assigns the slot, and no other lane syncs meanwhile (pr-lifecycle's slot
contract), or two lanes would knock each other BEHIND in turn. This skill's
part is step 3's preparation, so the carrier is ready when the word comes
early. A lane in flight at a sync parks as a
draft, keeps its own head, and merges the default branch as its final planned
synchronisation push, at the slot word — the merge opens a review round like
any push, and an over-bar finding from that round still cures in a push
carrying nothing else (PDR-140 clause 9b); at that merge it re-reads its own
touched files against the sync (`git diff --stat <its base>
origin/<fork-default> -- <its files>` — an empty diff is the proof, recorded
on the lane's PR). A lane's landing never depends
on its seat being awake: the Director's declared deadline-and-default lands it
from a temporary branch cut on the lane's remote ref, without touching the
seat's worktree, branch or claim (2026-09-09, the #88 follow-up).

### 9. Prove the landing and close the carrier

- First `git fetch origin <fork-default>:refs/remotes/origin/<fork-default>`
  (the destination refspec, as in step 1): the server-side merge moves no
  local ref, so every proof below reads the refreshed remote-tracking ref (or
  the merge sha the API returned), never the pre-merge local branch.
- The landing merge commit's second parent is the carrier head (its first
  parent the previous default tip); this is the second of the two merge
  commits the sync creates — the carrier's own merge of the default branch
  in step 3 is the first — and both are verified, never conflated. The
  default branch's tree differs from upstream's tip only by the enumerated
  fork diff (`git diff --stat origin/<fork-default> <upstream-tip>` read against
  the list). Until a tracked manifest of fork-only paths exists with a
  validator that diffs it against `git diff --name-only`, this proof is a
  READ of the stat against what the seat knows the fork diverges, not a
  check — say so on the PR (2026-09-09: a count of 586 files stood in for
  the list).
- The landing merge commit is authored by the merging identity — the bot as
  author, the platform as committer; the owner-as-author convention governs
  the commits a seat makes, never the platform's merge commit, so a reader
  does not read the landing commit as a breach.
- Post-merge reviews harvested; the carrier branch deleted after the ancestry
  proof; the worktree removed.
- The landing recorded where the fork's continuity lives; the next upstream tip,
  if any, becomes a new carrier named for its own sha.

## Failure shapes this skill exists to prevent

- A head that is upstream's release commit, so the required checks never run
  and the pull request reads pending forever.
- Trusting GitHub's dirty verdict over a clean local merge-tree, or the reverse
  without saying which was read.
- Routing a finding on carried code to the other fork instead of curing it
  here in its own lane, or curing inside the carrier's rounds a finding that
  does not block the merge.
- Regenerating one page by hand because "only the excerpt changed".
- Merging a memory file on the conflict count.
- Plans and reports left asserting the state before the sync — the class this
  skill was written for.
- A reserved fork block of ADR numbers.
- Squash or rebase on a sync.
- Moving a reviewed carrier head to a newer upstream tip mid-review.
- A carrier merge made at readiness rather than at the slot word, redone once
  per landing ahead of it.
- A merge commit made in a worktree before install, so no hook ran on it.
- A slot-word merge attempted with an author flag `git merge` does not have, or
  landed with the bot as author because the environment was not set.
- A receipt's count or "nothing newer" read as the fact the fetch or the run
  would have given.

A fork-only file family is not a home for a new tier: "a landing exclusion step deletes the family
back out of the fork at the next sync (reproduced in a throwaway repository)"; and for a nested
checkout, "a per-checkout exclude hides a nested repository from git but not from the tools that
read the tracked ignore file; one tracked line covers all three; git-native coordination-home
resolution from inside a nested repository names the nested repository, so the home must be
declared" (Finch binds Sundog's panel-refuted frame of 2026-09-06, events 4382dfa5 and 4cfe14c0).

## Related surfaces

- `.agent/rules/pre-merge-divergence-analysis.md` and
  `.agent/reference/pre-merge-analysis.md` — the cascade classes; §4i is the
  premise cascade this skill runs.
- `.agent/skills/change-custody/semantic-merge/SKILL-CANONICAL.md` — layer 3.
- `.agent/skills/change-custody/complex-merge/SKILL-CANONICAL.md` — two
  branches of one lineage.
- `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md` — §Phase 7's
  landing slot (the slot word) and §Phase 5's empty-commit re-trigger; the
  empty-commit shape for a CI-skipped carrier head is stated in step 3 above,
  and the plans estate carries its runbook (named there, never linked from
  here — the reference direction runs plan → doctrine).
- `.agent/skills/set-up-worktree-lane/SKILL-CANONICAL.md` — the identity
  check and the build; step 3 above says why its branch cut does not apply.
- the host's decision record on organisational identity below the tree, where
  it has one (OCE: ADR-231, `231-organisational-identity-below-the-tree.md` in
  its decision-record directory; jimcresswell.net states the rule in this
  skill's step 3 and holds no record)
  — why the fork diff is enumerated and identity-free.
