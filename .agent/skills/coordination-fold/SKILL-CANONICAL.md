---
name: coordination-fold
classification: active
description: >-
  Fold the live coordination branch to main and rotate — the full
  converge-and-rotate ceremony: ownership-aware dirty-file sweep, merge
  main in with a stale-capture probe, bot fold PR carrying the
  product-gravity line, full-condition merge, day-stamped successor cut,
  branch-labelled surface refresh, rotation broadcast, and a
  wrap-not-closeout loss scan. Invoked at the lifetime rule's DUE check
  (twice a day: 12:00Z and the UTC rollover, the owner's word of
  2026-09-26), at owner word ("fold and rotate", "converge the coordination branch"), or
  before any boundary that needs the coordination record durable on main.
---

# Coordination Fold

Executes the converge-and-rotate shape whose doctrine lives in
[`coordination-branch-24h-lifetime`](../../rules/coordination-branch-24h-lifetime.md)
— the rule owns WHAT and WHEN; this skill owns the ceremony's HOW. The
seat running it is normally the Director/principal (the primary checkout
resides on the coordination branch).

A fold past ten minutes is a finding, never read as normal. The owner,
2026-10-10, verbatim: "an HOUR is a ridiculous typical time for a fold,
ridiculous, and a clear signal of a process and engineering failure. 20
minutes would be somewhat excessive, 10 minutes would be acceptable. We have a
problem with our PR approaches and mechanisms". The retrospective of that day
measured the jimcresswell.net folds 320 to 326 at 25.9 to 57.8 minutes wall each: a
records-only push reaches CI within 2.1 to 3.8 minutes of its commit, a
vendor review round costs 3.9 to 7.8 minutes, and the door's floor was about
fourteen minutes before any finding. So no ceremony is added to a fold, and a
gate's duration is never stated from feel: it is read from the commit-to-CI
interval or the hook's own clock (where the estate's tooling carries
`coordination fold-clock --pr <n>`, it prints the intervals). A records commit on a coordination branch whose draft is ready is a
settlement push of the fold, so a spent fold budget freezes every seat's
records until the fold merges: fold early, or before the ready-mark's review
legs run. A records fold's findings land on the paragraph that states a
decision; a dated estimate line that records the hour's rulings cures count,
contradiction and wording in one push (2026-10-02 and 2026-10-03).

## Preconditions

1. Confirm the primary sits on the live coordination branch and that its
   draft PR, opened at the branch's first records push (step 10), is the
   one PR open for it (`gh pr list`).
2. **Working-tree survey with ownership.** Classify every dirty and
   untracked path: (a) own work or settled fleet docs — fold them, with
   authorship named in the commit message for peer-authored files;
   (b) a peer's possible mid-edit — check completeness first (a settled
   edit reads whole: closing signature, complete table row, clean diff
   boundaries) and coordinate on their channel when in doubt. Never
   capture a half-state; never delete or revert anything found
   (`never-use-git-to-remove-work`). A directory no fleet seat wrote or
   claims can be wanted work: of an agent's content workspace found in JC.net's
   primary on 2026-09-28 the owner said, relayed by the Director,
   "legitimate and should be treated as material to commit" and "keep it off
   the fold, and the Practice agents decide if any changes are needed before
   merging". It is copied, not moved, to its own branch from the default
   branch in a worktree, with its own pull request counted toward the WIP
   limit (the Director's correction the same day; one instance).
   Immediately before each push from the primary (steps 5, 9 and 10),
   check by name each tracked file dirty at that moment
   (`git diff --name-only --diff-filter=d HEAD`), with
   `pnpm exec prettier --check --ignore-unknown -- <files>` and
   `pnpm exec markdownlint-cli2 --no-globs -- <the Markdown files>`: the
   pre-push gate's tracked-files checks read the working tree, so an
   uncommitted edit to a tracked file fails the push, whoever made it.
   This checks named files, as the pre-commit hook
   does; it is not a gate run (`coordination-branch-24h-lifetime` clause 5
   at the fold). Link and machine-local-path validation has no by-name
   form: a push that fails on one names the file, which routes as below. A
   failing file that is a live peer's in-flight edit, class (b), routes to
   its owner for the cure, never edited or reverted by the folding seat,
   since a fixer's rewrite races the peer's next write; a class (a) file is
   cured and folded with its authorship named.
3. **A records pass before the ready-mark.** Once the fold PR is under
   review, a seat's records commit waits for the successor branch cut after
   the merge: "a push now would move the verdicted tip and restart the round"
   (a Director's ruling, 2026-09-25; one instance). Every finding of the 2026-09-28
   rollover fold's review was a records slip; before the fold PR is marked
   ready, a read-only reviewer checks every carried record against the day's
   landings (shas, PR numbers, states), and on a repository whose Copilot
   request is the operator's the timeline is read after the mark. The pass
   runs BESIDE the opening push's gate, never after it (the gate was two to
   four minutes on a records push where the retrospective of 2026-10-10
   measured it, the pass about the same, and run in series the two spend
   half the owner's ten-minute bound before the ready-mark); it is bounded
   to the fold's own diff
   (`git diff origin/<default>...HEAD --stat`), briefed with the finding
   classes of the last three folds from their review-cost ledger rows (the
   retrospective of 2026-10-10 §Reconstruction names six: stale state a
   successor would act on, confidential material, a record's contract
   against practice, scope, arithmetic, doctrine contradiction; a seventh
   from 2026-10-03: a sentence about what a tool, hook or validator does
   written without its source and its configuration opened, "already" and
   "names none" its tells), and its
   slips are cured in one push before the ready-mark (the owner's decision
   of 2026-10-10 on that retrospective's proposal 3). The fold is
   the Director's ceremony in a team session and the seat's own at n=1; it
   takes the slot at its time unless a synced holder waits for a leg, and a
   worktree seat that must write a record into the primary's coordination
   branch does so by an append-mode scripted write into the primary tree,
   runs no git there, and names the paths to the folding seat.
**The branch carries shared coordination-home state only** — fleet state, doctrine and
memory surfaces, the class
[`coordination-branch-24h-lifetime`](../../rules/coordination-branch-24h-lifetime.md)
clause 4 names. At the DUE check, read the commits since the cut: a work product with its
own review contract (a report, a source change, a plan under active edit) belongs on its
own lane, and the Director routes a seat there at claim time. One found already on the
branch is never re-cut out of history; the fold PR names it in §Scope and declares the class
PDR-140 §Decision gives it: a served document or a plan under active edit is prose-class
and carries the intake (a served document: records-class, verification point merge); a
source change is code-class and stays on the review-round state machine, no intake. It
expects the rounds it brings. Worked instance, 2026-09-12: a 470-line exploration report
committed to the coordination branch drew thirty of the fold's thirty-eight findings, and the fold
took a day. Second instance, 2026-09-16 to 2026-09-19: a dedicated consolidation's doctrine
rode the coordination branch through four folds (#150, #152, #153, #155). Each fold was
large, the lifetime rule forced the next before the consolidation's own work could start,
and the last fold's whole content was records about the fold before it (twenty-three
findings, all true). A consolidation's doctrine edits are a work product with their own
review contract.

A disposition that deletes a span of a continuity record the coordination branch still appends to
waits for the fold and lands as its own small pull request cut from the folded default branch,
"never as the fold's own records commit (the fold prepends the seated block and nothing else on that
file)": a deletion made first on the default branch conflicts across the whole deleted span when the
fold merges (a Director's ruling with the lane's agreement, 2026-09-07, events dd5ac28e and
20f3c220).

## Ceremony

3. Commit by explicit pathspec (`stage-by-explicit-pathspec`);
   lowercase-start subjects (commitlint).
4. `git fetch origin <default>`, then merge `origin/<default>` INTO the
   branch, where `<default>` is the repository's default branch
   (read from the remote and fetched first, then `git remote set-head
   origin --auto`, as `cut-coordination-branch` does; `git symbolic-ref
   --short refs/remotes/origin/HEAD` then prints `origin/<default>`; a clone
   made before the default branch changed still names the old one until the
   refresh).
   Resolve the ref to a full sha in the same shell call as the merge, merge
   that sha, and write the merge message AFTER resolving, from
   `git log <head>..<sha>`: a remote-tracking ref moves whenever any hook or
   seat fetches, so a message written from an earlier reading names the wrong
   tip and the wrong content (two seats made this slip on one day, 2026-09-20;
   one merge message named #157 while the merge also carried #158).
   Probe the merge for silent stale-capture reverts (a clean merge can
   still revert an approved newer version — marker-probe suspicious
   files against the default branch) before pushing. When the default branch
   is merged into a recreated or already-folded branch, the merge is proved
   content-free only when `git merge-tree --write-tree origin/<default> <tip>`
   exits 0 and its printed tree id EQUALS `git rev-parse <tip>^{tree}` (the
   command prints a tree for every clean merge, content-changing ones
   included, so the equality is the proof, never the print): then say so in
   the pull request body and make no merge commit; otherwise merge
   (2026-10-02).
   The napkin resolves as a union of both sides' blocks in time order — unless
   the target branch's napkin was ROTATED since the snapshot, in which case keep
   the rotated file and run the semantic-merge skill's archive-coverage check
   (its step 10): diff every incoming block heading against the rotated napkin
   AND the rotation archive, content-grep before declaring a gap, and carry every
   genuinely absent block under a dated union note. Never filter by timestamp
   alone: the rotation's watermark commit is where to start looking, not the
   test, since a block authored on a third branch before the watermark and
   merged after it would be lost (2026-09-07). Two instrument defects caught at the
   2026-09-07 fold: a time key that failed on a heading written "16:xxZ" and
   sorted that block last (a tolerant key cures it), and a dropped blank line at
   one block joint that the markdownlint hook refused (MD032/MD022) — read the
   printed order before committing. Continuity records are edited on the primary
   by every seat while the fold snapshots them: each later edit re-dirties the
   primary, and the post-merge fast-forward of the primary succeeds only when its
   record files are byte-identical to the branch's blobs (`git cat-file` plus
   `cmp`; a DIFFERS line before the fast-forward is the tell), so the closing seat
   commits the continuity records LAST and mirrors any later edit by hand — two
   folds converged that way on 2026-09-06. A settings file the harness rewrites is
   held out of the sweep until its contract is verified or the owner rules on it;
   each hold is its own — a later harness rewrite is a new hold, never a
   continuation of an earlier one — and the hold's outcome (verified, or ruled and
   landed) is recorded on the live snapshot in the Director's handoff, never here.
5. Push with a 600s timeout; exit codes in-band and unpiped — a piped
   `$?` reads the pipe's tail, not the push.
6. Mark the branch's draft PR ready as the fold PR, under BOT identity
   (mint per merge-bot discipline).
   The body carries the **product-gravity line** (rule Action 3):
   `moved for teachers: … / moved for the Practice: …` — honest, no
   quota, drift made glanceable. The description uses the template's §Scope
   with the records-class intake declared
   ([`pr-lifecycle`](../change-custody/pr-lifecycle/SKILL-CANONICAL.md) §Phase 2);
   cures batch into the declared settlement pushes, never one push per finding.
   A change never narrates its own state in the files it carries: the fold's
   records state what landed, and the branch's own state lives in the PR body,
   so a reviewer meets no sentence the merge itself made false (four of six
   findings on one fold, 2026-09-24; a pickup that said "first act: fold this
   branch" inside the branch whose merge made it false).
7. Arm a settle watch (Monitor) whose filter is loud on EVERY terminal
   state (`silence-is-never-liveness`). Full condition = exactly the status
   contexts the default branch's rules require, read from the rules at run
   time and each SUCCESS, and no other name: a deployment or vendor status
   the rules do not require is information on the pull request, never a gate
   (a door computed from a list of names carried from the other estate
   refused a green fold, 2026-10-02); never a gate is not never read: the
   lifecycle skill's Phase 3 harvest reads and triages every non-required
   verdict (a code-quality vendor's gate among them) before the merge + zero
   unresolved review threads +
   MERGEABLE. No vendor review is requested at the ready-mark by default
   (the owner, 2026-10-27: a review is requested only for a stated reason,
   never automatically; reviews are expensive); where the host's
   configuration reviews a ready pull request by itself the review arrives
   unasked, and a records-class fold never waits for it either way: `merge-bot merge` computes the class from the
   pull request's changed files (every path documentation or Practice
   prose, decided per path, `change-class.ts`; a seat never declares it) and
   merges a records-class fold at checks green by name (the required
   contexts above, read from the rules at run time; a pending check the
   rules do not require — the vendor's own review run among them — does not
   hold a records-class fold, a failed check of any name does) with zero
   unresolved threads on the verdicts that differ from SETTLE-READY only by
   the vendor leg, naming the ground in its evidence (the owner's ruling of 2026-09-03,
   "Change the merge policy instead", as the door's behaviour; the owner's
   decision of 2026-10-10 on the retrospective's proposal 1). The review is
   harvested after the merge under PDR-140 clause 9(e): each finding is read
   under clause 9(a), an over-bar finding cures in the successor's first
   records commit, a below-bar one is rejected with rationale or routed. A
   fold carrying a code path keeps the SETTLE-READY door. The history this
   replaces, with its price: a fold merged with no review took six true
   findings after its merge (2026-09-21), and on 2026-10-01 one estate's
   vendor reviews found two false entries in records the other estate had
   merged unreviewed; the clause those two instances graduated on 2026-10-02
   ("a fold is reviewed before it merges") then cost four jimcresswell.net
   folds 26 to 58 minutes of wall time against the owner's ten-minute bound,
   nine vendor rounds of 4 to 8 minutes each for 39 findings, none of them
   authority
   (the retrospective of 2026-10-10).
8. Bot REST merge at the FETCHED full head sha — fetched at merge time,
   never typed from memory, never expanded from an abbreviation — with
   `merge_method=merge`, never squash.
9. Cut the successor coordination branch per
   [`cut-coordination-branch`](../cut-coordination-branch/SKILL-CANONICAL.md):
   resolve post-fold `origin/<default>` ONCE and pass the same full sha to
   both the mint and the cut — two separate resolutions race a
   concurrent fetch, so the name records one tip while the branch
   starts at another and the lineage the name carries is false from
   birth:

   ```bash
   FOLDED="$(git branch --show-current)"
   NAME="$(git ls-remote --symref origin HEAD | sed -n 's#^ref: refs/heads/\(.*\)\tHEAD$#\1#p')"
   git fetch origin "${NAME}:refs/remotes/origin/${NAME}"
   git remote set-head origin --auto
   DEFAULT="$(git symbolic-ref --short refs/remotes/origin/HEAD)"
   BASE="$(git rev-parse "$DEFAULT")"
   git switch -c "$(pnpm --silent agent-tools coordination successor-name --base "$BASE")" "$BASE"
   git push -u origin HEAD
   ```

   Never mint by transcription (the sha6 suffix is deliberate
   collision policy and the tool is its single source; F-161 records
   the break a hand-carried form caused). The cut is tree-preserving —
   dirty files carry across — and the primary now resides there.
   The folded branch (`$FOLDED`, read before the switch) is deleted at the
   cut once its local tip and its remote tip each read merged. The fetch
   above reads only the default branch, so probe the folded branch on the
   remote first, and fetch its tip into its tracking ref immediately before
   the proof and the delete:

   ```bash
   if git ls-remote --exit-code origin "refs/heads/$FOLDED" > /dev/null; then
     PROBE=0
   else
     PROBE=$?
   fi
   if [ "$PROBE" -eq 0 ]; then
     git fetch origin "+refs/heads/${FOLDED}:refs/remotes/origin/${FOLDED}" &&
       git merge-base --is-ancestor "$FOLDED" "$BASE" &&
       git merge-base --is-ancestor "origin/$FOLDED" "$BASE"
   elif [ "$PROBE" -eq 2 ]; then
     git fetch --prune origin && git merge-base --is-ancestor "$FOLDED" "$BASE"
   else
     echo "STOP: the remote read failed ($PROBE)" >&2
     false
   fi
   ```

   The probe exits 0 when the branch is on the remote, 2 when it is gone,
   and anything else on a failed read; the `if` captures that status, so a
   shell with errexit set still reaches the absent path. The block exits 0
   only when the proof holds, and any other status stops the cut. A branch gone
   from the remote counts as deleted: its stale tracking ref is pruned, and
   only the local proof runs. Then delete it locally by plain branch
   deletion, and, when the probe found it, remotely by the bot's API delete
   (`DELETE repos/{owner}/{repo}/git/refs/heads/<branch>`; a
   `git push --delete` runs the full pre-push gate), each read back
   absent. A tip that reads unmerged holds commits made after the merge:
   surface it, never delete it. Carry them into the successor by a merge
   commit, so they land at its fold, and only then delete the folded branch
   (four record commits reached a folded branch after the owner merged its
   fold PR by hand, 2026-09-26; one instance). After the merge, nothing is
   pushed to the folded NAME, whatever became of the ref: where the host
   deleted it at the merge, a push recreates it one commit beyond the fold,
   where it reads folded on the pull request and live on the remote and costs
   a second fold pull request (299 for one records commit, 2026-10-02); where
   the ref survived, it is retired through the proof above, and a push would
   only add to what the proof must carry. The successor is cut first and
   records go there. A foreign index lock on the primary holds only the local commits
   and this rotation; the pull request's landing (records pass, ready-mark,
   review, settlement, the bot's merge) touches no local index and proceeds.
   GitHub's auto-delete of a merged head is
   not relied on: both folded heads of 2026-09-27 survived their merges
   (`worktree-hygiene` §3). If the default branch moves again during or just after the ceremony (a
   lane PR merging mid-rotation), merge `origin/<default>` in and rebuild promptly: until
   that merge, the primary's dist and its generated read models run the
   pre-merge contract. Two things reach the primary at different moments: a
   rule, plan or hook command is read from source and arrives with the merge of
   the default branch (step 4, or a quiet window between folds, which the
   lifetime rule allows), while compiled tooling arrives only with the rebuild
   after it (a `PreCompact` hook registered on the default branch was absent from
   the primary at that day's compaction, 2026-09-25, because the default branch
   had not been merged in there); until the rebuild every seat's primary-dist
   tooling (renders, watchers, sends) is one contract behind — cosmetic for
   render-time formats, load-bearing the day a change alters event files (worked
   instance 2026-08-01: cross-branch format skew read as read-model drift).
10. **Refresh every branch-labelled surface**: stop and re-arm the
    heartbeat loop with the new `--branch` label; append the fold entry
    (with the same product-gravity line) to the Director seated block AND
    as a dated tenure entry on the tracked estate-coordination thread
    record — the pickup path for any checkout, since the machine-local
    record is finer grain a successor elsewhere cannot read (a reviewer
    found the pickup map unreachable when the journal had stopped two days
    earlier, 2026-09-08); commit the fold entry by pathspec as the
    successor's first records commit, push it, then open the successor's
    draft PR under BOT identity (GitHub refuses a pull request with no
    commits ahead of its base, so the draft cannot open at the cut,
    2026-09-27); broadcast the rotation on the canonical comms
    stream so every seat re-homes. Then read the fold's clock from the API,
    never from the seat's sense of time:
    `pnpm --silent agent-tools coordination fold-clock --pr <fold PR> --successor <the successor's pushed sha>`
    prints one line (the ready-mark, checks green on the same required
    contexts the door reads, each vendor round, the merge, the successor's
    arrival on CI, every interval in minutes from the ready-mark); paste it into the fold's
    review-cost ledger row's Notes (a seat's reading of the push gate was
    wrong by three times, the retrospective of 2026-10-10; the owner's bound
    on a fold is ten minutes of wall time, his word of that day). A fold entry is a few lines of state (the
    merge sha, the successor's name, the gravity line), never a narrative of
    the fold: every sentence written here is a claim the next fold's reviewers
    price. A broadcast filled from a template by substitution is re-read whole
    before posting, not only at its placeholders; a template keeps every
    sentence that was true when it was written ("one review round" survived
    into a fold that took three, caught before posting, 2026-09-17).

## Wrap-not-closeout

11. The ceremony doubles as the durability wrap at a NON-terminal
    boundary: finish with a loss scan — `git status` clean, no unpushed
    refs, the successor's draft PR open, napkin and seated block current —
    with monitors up and the
    seat live. A terminal boundary (seat or session ending) is
    [`wrap`](../wrap/SKILL-CANONICAL.md)'s moment instead, which this
    skill never substitutes for.

## Related surfaces

- [`coordination-branch-24h-lifetime`](../../rules/coordination-branch-24h-lifetime.md)
  — the doctrine: lifetime, DUE check, what rides the branch.
- [`silence-is-never-liveness`](../../rules/silence-is-never-liveness.md)
  — the settle watch and heartbeat re-arm discipline.
- [`stage-by-explicit-pathspec`](../../rules/stage-by-explicit-pathspec.md),
  [`never-use-git-to-remove-work`](../../rules/never-use-git-to-remove-work.md)
  — the sweep's git discipline.
