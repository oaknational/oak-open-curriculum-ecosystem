# Arc ledger: reunifying the fork into Oak through oaknational#1023

The reading ledger behind
[the retrospective](./why-the-reunification-took-fifteen-days-and-repeated-two-written-lessons-2026-11-19.md).
A read-only agent rebuilt it for Sandpiper guards Wind (690653) from the thread record, the
napkin and GitHub; the seat has not re-verified every row.

Compiled 2026-11-19, read-only. Times are UTC. "Oak" is `oaknational/oak-open-curriculum-ecosystem`;
"the fork" is `EngraphCode/open-curriculum-ecosystem` (default branch `engraph`). Fork pull requests
are written `#NNN`; Oak's are written `oaknational#NNN`.

Source keys used below:

- **[T]** the thread record `.agent/memory/operational/threads/open-pull-requests-to-zero.next-session.md`
  (1045 lines, read in full; its last entry is dated 2026-11-16 ~13:35Z).
- **[N]** napkin sections by seat 690653 in `.agent/memory/active/napkin.md` (headings at lines
  1286, 1315, 1341, 1598, 1778, 2332, plus dated bullets at 1429 to 1480).
- **[P]** the plan `.agent/plans/delivery/reunify-oce-forks.plan.md`.
- **[R]** the report `.agent/reports/reunification-production-preview-consistency-2026-11-16.md` (374 lines).
- **[GH]** GitHub, read through `gh` on 2026-11-19 (command named at each figure).
- **[G]** local git in the primary checkout.
- **[M]** two files in the per-user memory folder (`reunification-merge-owner-only.md`,
  `fork-never-named-on-oak-surfaces.md`); not tracked, so a reader of the repository cannot re-check them.

## 1. Arc at a glance

| Item | Value | Source |
| --- | --- | --- |
| Arc start (first sync of the window) | 2026-11-03T11:43:23Z, #374 opened by the owner; the first workflow carrier, #376, opened 13:24:48Z | [GH] `gh pr list --repo EngraphCode/... --state all --search "created:>=2026-11-01"` |
| oaknational#1023 created | 2026-11-09T12:16:15Z, as a draft, by Oak's bot app, branch `reunify-oce-forks` in Oak's repository | [GH] `gh pr view 1023 --json createdAt,author,headRefName` |
| oaknational#1023 merged | 2026-11-18T13:07:12Z, merge commit `dae303661` | [GH] same call, `mergedAt`, `mergeCommit` |
| Elapsed, first sync to merge | 15 days 1 h 24 min (15.06 days) | computed from the two instants |
| Elapsed, #1023 open to merge | 9 days 0 h 51 min (9.04 days) | computed |
| Files changed | 4,829 | [GH] `changedFiles`; [G] `git diff --shortstat 0d8543021 fc45609c8` gives the same |
| Lines | +367,675 / -308,824 | [GH] `additions`, `deletions`; [G] same shortstat |
| Commits | 2,935 (376 on the first-parent line; 819 are merge commits) | [GH] `gh api repos/oaknational/.../pulls/1023 --jq .commits`; [G] `git rev-list --count 0d8543021..fc45609c8`, with `--first-parent`, with `--merges`. `gh pr view --json commits` truncates at 100 |
| Merge shape | two-parent merge; parent 1 `0d8543021` (Oak release 1.186.10), parent 2 `fc45609c8`; parent 1 is an ancestor of parent 2; the merge's tree equals parent 2's tree | [G] `git log -1 --format=%P`, `git merge-base --is-ancestor`, tree comparison |
| Carrier pull requests in the window | 6 opened by the carrier workflow (#376, #379, #380, #381, #388, #393): 5 merged, 1 (#379) closed and replaced by #380. Plus #374, the owner's hand-opened sync, which read merged when #376 landed (same merge commit `71e727ec5`) | [GH] the `gh pr list` call above, heads matching `automation/upstream-carrier-*` |
| Oak releases carried | 1.186.4 (#376), 1.186.5 (#380), 1.186.8 (#381, extended from 1.186.7), 1.186.9 (#388), 1.186.10 (#393) | [T] lines 405, 440, 496 to 527, 602, 676 |
| All fork pull requests in the window (#374 to #431) | 58: 55 merged, 3 closed unmerged (#379, #389, #406); of the merged, 41 authored by the fork's bot app, 14 by the owner | [GH] `gh pr list ... --json number,state,author` counted with `jq` |
| Pushes to #1023's branch | 1 branch creation plus 10 pushes, so 11 distinct heads, all by Oak's bot | [GH] `gh api "repos/oaknational/.../activity?ref=reunify-oce-forks"` |
| Review objects on #1023 | 4: `github-code-quality[bot]` (6 inline comments, 2026-11-09), `github-advanced-security[bot]` (1 CodeQL comment, 2026-11-09), `claude[bot]` (1 finding, 2026-11-16T13:47:08Z), `<code-owner>` APPROVED (2026-11-18T13:06:51Z) | [GH] `gh api .../pulls/1023/reviews`, `.../pulls/1023/comments` |
| Review rounds that needed a cure | 2: the first-check findings of 2026-11-09 (cured by #391) and the `claude[bot]` gitleaks finding of 2026-11-16 (cured by #431) | [GH] reviews; #391 body; bot comment 6931282999 |
| Review threads | 7, all resolved (each marked resolved by the bot that opened it) | [GH] GraphQL `reviewThreads` |
| Reviewers requested | the owner's account, `<code-owner>` and two other Oak accounts (requested by the bot at 2026-11-16T13:34:02Z); only `<code-owner>` left a review | [GH] issue timeline, `review_requested` events |
| Merged by | `<code-owner>` (display name "MG"), 21 seconds after that account's approval; the same account deleted the head branch at 13:07:14Z | [GH] `mergedBy`, timeline `merged` and `head_ref_deleted` |

Note on the last row: the record's rule is that only the owner executes this merge ([T] line 733,
[P] line 18). The owner's GitHub account in this record is `<owner>` (it renamed #1023 on
2026-11-11 and re-ran CI on 2026-11-17). See section 7.

## 2. Dated timeline (UTC)

Carrier phase (the fork kept containing Oak's `main`):

| When | Event | Source |
| --- | --- | --- |
| 11-03 11:43 | Owner opens #374, a sync from the mirror branch | [GH] |
| 11-03 (before 13:24) | Mirror workflow found failing with HTTP 403 since 11-02 (range carried four workflow-file changes); mirror fast-forwarded by hand as the bot | [T] 405 to 410; [N] 1288 |
| 11-03 13:24 to 14:02 | Carrier #376 (Oak 1.186.4): four conflicts resolved, one premise re-true; merged `71e727ec5`; #374 reads merged at the same moment. One Codex P1 (ancestry) rejected | [T] 411 to 416; [GH] |
| 11-03 14:46 | #375 (the lint series) merged `4adcfc069` (not part of the sync, landed between) | [T] 417; [GH] |
| 11-03 17:17 to 17:37 | #378: the mirror falls back to the bot's App token when refused; merged `8fc338d84` | [GH]; [T] 113 |
| 11-03 19:41 | Carrier #379 opens at `0c841ed7f` | [GH] |
| 11-04 14:27 | Owner marks #379 ready; Codex reviews 14:30:51, Copilot 14:32:13 | [GH] timeline and reviews of #379 |
| 11-04 14:34:21 | Seat closes #379 as "unworked"; #380 opens 14:34:39 at `0bb2ae4f0` (1.186.5) | [GH]; [T] 440 to 448 |
| 11-04 15:00:37 | #380 merged `c2bcfe7e9`; no conflicts, 11 incoming paths | [GH]; [T] 449 to 466 |
| 11-05 07:09 | Carrier #381 opens at `f1070c2` (1.186.7) | [GH] |
| 11-05 | Dry-run merge: 27 conflicted paths; two opposed policies on rule S4036 | [T] 501 to 519 |
| 11-05 ~13:45 | Owner ruling: adopt by-name on `engraph` | [T] 520 |
| 11-05 14:28 | #381 marked ready at merge `85621052c` (now 1.186.8); Sonar raises 7 S4036 issues; 5 marked, 2 marks denied by the permission classifier | [GH]; [T] 527 to 538 |
| 11-06 15:05:58 | #381 merged `e3574df72`, after the owner allowed the two marks, `engraph` was merged in again (#382, #383 moved it) and one Codex P1 thread was resolved | [GH]; [T] 545 to 555 |
| 11-06 15:08 to 18:06 | Follow-ups #385 (`622324e67`), #386 Windows `.cmd` launch (`469c7bd58`), #387 commit-message check in-process (`3f65a2923`) | [GH]; [T] 571 to 584, 600 |
| 11-06 18:07 | Carrier #388 opens (1.186.9); dry run conflicts in 34 files; ready at 18:54; Sonar raises 44 S4036 issues | [GH]; [T] 602 to 631 |
| 11-08 | 42 of 44 marked false positive at the owner's word; 2 denied by the classifier. Owner: no pull requests back to Oak yet | [T] 634 to 644 |
| 11-09 08:45:28 | #388 merged `36362c356` after the last two marks and four leftover bot threads | [GH]; [T] 645 to 656 |
| 11-09 09:00:29 | #377 (coordination fold) merged `13bdba2a7` | [GH] |

Preparation of oaknational#1023:

| When | Event | Source |
| --- | --- | --- |
| 11-09 (before 12:15) | Owner lifts the fork-naming prohibition after the seat's 229-file classification | [N] 1600 to 1606; [M] |
| 11-09 12:15:22 | Branch `reunify-oce-forks` created on Oak at `13bdba2a7` | [GH] activity |
| 11-09 12:16:15 | Draft #1023 opened, title "Reunifying OCE forks" | [GH] timeline `renamed.from` |
| 11-09 12:17 to 12:20 | First checks: SonarCloud failure, CodeQL failure; 6 code-quality comments, 1 CodeQL comment | [GH] check-runs on `13bdba2a7`; reviews |
| 11-09 12:58 to 13:16 | #391 clears what the checks named (CodeQL alert, two shell findings, Turbo team, three scripts, doctrine) and adds the plan; merged `86bc8b1ab` | [GH] #391 body |
| 11-09 13:25 to 14:02 | #392 pages the review-cost harvest's commits; merged `0509940e6` | [GH] |
| 11-09 14:05:15 | Push 1: head `0509940e6`. CodeQL passes; SonarCloud fails | [GH] activity; check-runs |
| 11-09 17:39 | Oak releases 1.186.10 (`0d8543021`) | [G] commit date |
| 11-10 07:36 | Carrier #393 opens (1.186.10) | [GH] |
| 11-11 13:57:08 | Owner renames #1023 to "Reunifying OCE forks: Exploratory, DO NOT MERGE" | [GH] timeline |
| 11-11 | Owner ruling: only the owner executes the merge. Team of two seats set. Owner saves the S4036 criterion on both SonarCloud projects | [T] 662 to 700, 733 |
| 11-11 13:57 to ~17:15 | Every `browser-tests` job fails at an apt step (runner DNS) | [T] 766 to 769; [N] 2343 |
| 11-11 14:16 to 17:21:39 | #393 ready, then merged `4e33dd98d`; three modify/delete conflicts, one lint cure (a file at 257 lines against a 250 limit) | [GH]; [T] 676 to 692 |
| 11-11 17:25:46 | Push 2: head `4e33dd98d`. SonarCloud fails | [GH] |
| 11-11 17:50 to 18:03 | #401 cures five code smells; merged `495c82f45` | [GH] |
| 11-11 18:04:39 | Upgrade note posted on #1023 (comment 6803479244; edited 11-16 13:33:39) | [GH] |
| 11-11 18:07:34 | Push 3: head `495c82f45`. SonarCloud fails (one MAJOR issue, S6822); `windows-basic` fails once, passes on the owner's re-run at 18:19 | [GH] check-runs; run 43074766686 attempts; [T] 748 to 753, 775 |
| 11-11 18:26 | Draft #402 opens (S6822 cured at source); held for an owner VoiceOver check | [GH]; [T] 754 to 762 |
| 11-12 09:15 to 10:48 | Second seat's #400, #404, #399, #405 merge (binary exclusions, the shell-form lint rule, the S4036 policy text, todo 6 order) | [GH] |
| 11-12 11:59:04 | #402 merged `2e577c299` after the owner said VoiceOver checks were stopped | [GH]; [T] 761 |
| 11-12 12:03:50 | Push 4: head `2e577c299`. SonarCloud succeeds at 12:08:08; every check green | [GH] check-runs |
| 11-12 12:10 to 12:24 | #407: docs-only pull requests skip `browser-tests`; merged `9301a148e` | [GH] |
| 11-12 12:28:22 | Push 5: head `9301a148e`; its CI run is cancelled by the next push | [GH] run 43218207406 |
| 11-12 12:40:24 | Push 6: head `0c197db22` (#408); every check green | [GH] |
| 11-12 21:40 to 11-13 13:45 | Owner's #397, #410 to #413 land; owner: "wait for 413" | [GH]; [T] 855 to 871 |
| 11-13 14:17 | #414: the fork-only values list in the plan | [GH] |
| 11-13 18:48 | #417: the fork's programme notice and fork wording removed from entry pages | [GH] |
| 11-15 10:35 to 15:56 | Second seat's #420 (architecture warning cure), #421, #422, #424, #425; this seat's #423 (no ADR names the fork) | [GH]; [T] 889 to 933 |
| 11-16 10:04 | #428 (README as a repository README) merged `e9abb2a83` | [GH] |
| 11-16 10:08:31 | Push 7: head `e9abb2a83`; all green | [GH] |
| 11-16 12:42 | #429 (the consistency report) merged `75f5ea1a3` | [GH] |
| 11-16 12:45:31 | Push 8: head `75f5ea1a3`; all green | [GH] |
| 11-16 13:33:55 to 13:34:02 | #1023 retitled, marked ready, four reviewers requested | [GH] timeline |
| 11-16 13:47:08 | `claude[bot]` review: gitleaks install advice and the trusted-path allowlist disagree | [GH] |
| 11-16 13:59 | #430 (production snagging list) merged `6a99eb399` | [GH] |
| 11-16 14:02:58 | Push 9: head `6a99eb399`; all green | [GH] |
| 11-16 22:01 to 22:24 | #431 cures the gitleaks advice; merged `fc45609c8` | [GH] |
| 11-16 22:27:35 | Push 10: head `fc45609c8`. `static-checks` exceeds its 10-minute limit; CI attempt 1 ends cancelled at 22:49 | [GH] run 43970274437 attempt 1, job annotation |
| 11-16 22:32 | SonarCloud: quality gate passed on the final head | [GH] comment 6931379170 |
| 11-17 08:19 to 08:24 | Owner re-runs CI twice; attempt 3 succeeds at 08:24:08 | [GH] attempts 2 and 3, `triggering_actor` |
| 11-18 13:06:51 | `<code-owner>` approves at `fc45609c8` | [GH] |
| 11-18 13:07:12 | `<code-owner>` merges; `dae303661` | [GH] |

## 3. Obstacles

Each row: first seen, recurrences, cost, cure, and whether the cure was one-off or structural.

### 3.1 The SonarCloud quality gate (rule S4036, then S6822)

- **First seen:** 2026-11-05 ~14:30Z on #381, 7 S4036 issues at by-name process launches ([T] 531).
- **Recurred:** 3 pull requests. #381 (7 issues), #388 (44 issues, [T] 630), #1023 (30 issues, [T] 695).
  81 issues in total by the record's counts. On #1023 a second cause followed: one MAJOR S6822 issue.
- **Cost:**
  - #381: ready 11-05 14:28, merged 11-06 15:05 (24 h 38 min). The gate was the stated hold; a Codex
    thread and a re-merge of `engraph` were also settled in that window.
  - #388: ready 11-06 18:54, merged 11-09 08:45 (61 h 51 min); the record says the door refused "on
    SonarCloud alone" ([T] 630, 642).
  - #1023: SonarCloud failed on the first 4 heads; first success 11-12 12:08:08 (2 d 23 h 52 min after
    opening) ([GH] check-runs per head).
  - Wall-clock from first appearance to the gate passing on #1023: 11-05 14:30 to 11-12 12:08, 6 d 21 h 38 min,
    with a gate held red on one of the three pull requests for most of it (inference from the three windows above).
  - Four marks denied by the permission classifier (2 on #381, 2 on #388), each waiting on the owner ([T] 534, 638).
  - Two three-hour watches that could not succeed without the owner ([N] 1429).
  - #401 cured five code smells on a misreading of the gate metric (worst severity, not a sum); the gate value did not move ([N] 2339).
  - #402 held about 17.5 h (opened 11-11 18:26, merged 11-12 11:59) on an owner VoiceOver check that was no longer a requirement ([N] 2334).
- **Cure:** per-issue false-positive marks on #381 and #388 (one-off, repeated). Then the owner's project
  criterion on both SonarCloud projects (Ignore Issues on Multiple Criteria, rule `typescript:S4036`, path
  `agent-tools/**/*`), with a substitute lint rule `@oaknational/no-shell-form-process-launch` (#404) and
  the policy text (#399). S6822 cured at source by #402.
- **One-off or structural:** the marks were one-off; the criterion plus lint rule is structural (configuration
  held in SonarCloud, a rule in the tree).

### 3.2 The fork and upstream diverging on the same code (the by-name policy collision)

- **First seen:** 2026-11-05, #381's dry run: 27 conflicted paths; Oak invoked binaries by name, the fork carried trusted absolute paths ([T] 501 to 519).
- **Recurred:** #388's dry run, 34 files (24 content, 8 modify/delete, 2 add/add); about 30 fork-only files still used `trusted-git.ts` ([T] 602 to 606). Smaller instances: #376 (4 conflicts), #393 (3 modify/delete; one file past a shared line limit only at the merge, [N] 1784).
- **Cost:** #381 was open 31 h 57 min and #388 62 h 38 min, against 38 min (#376) and 26 min (#380) for carriers without the collision ([GH] created and merged instants). Three follow-up pull requests the same day (#385, #386, #387). One 16-minute hung smoke run from a mechanical swap ([N] 1452). A Windows launch gap the record had said would be checked and was not ([T] 562 to 570).
- **Cure:** the owner's ruling of 2026-11-05, "adopt the by-name ruling on engraph"; the trusted-path machinery removed in the carriers; Windows launches through `cross-spawn` (#386).
- **One-off or structural:** structural for this class (one policy on both lines). The record states the wider class "ends when the forks reunite" ([N] 1790).

### 3.3 Owner-held gates and sequencing before the merge

- **First seen:** 2026-11-08, "no pull requests back to Oak yet" ([T] 644); then the exploratory title (11-11) and the owner-only merge ruling (11-11).
- **Recurred:** "PR 397 will merge before we merge back to Oak" (11-12); "wait for 413" (11-13); "I will tell you when the other PRs are finished and the reunification PR can be updated" (11-13) ([T] 855, 870, 876).
- **Cost:** #1023 was green on every check from 11-12 12:08 and merged 11-18 13:07: 6 d 0 h 59 min. Of that, 4 d 1 h 26 min to the ready mark (11-16 13:34) and 47 h 33 min from ready to merge. The window was not idle: 21 fork pull requests by the bot app landed in it (#407 to #409 and #414 to #431), including the fork-wording removal, the README, the consistency report and the gitleaks cure ([GH] list). Reading the whole 6 days as waiting cost would be an inference the record does not support.
- **Cure:** the owner's words ending each hold; not a change to tooling.
- **One-off or structural:** one-off by the owner's own statement ("a separate and special case", [M]).

### 3.4 A carrier closed on a stale reading (#379)

- **First seen / recurred:** once, 2026-11-04 14:34:21Z.
- **Cost:** a pull request the owner had readied 7 minutes earlier, with a Codex and a Copilot review on it, was closed; one Codex P2 finding did not recur on the replacement ([GH] #379 timeline; [N] 1343 to 1354). The record says the replacement "bought nothing" ([N] 1362).
- **Cure:** the cross-fork skill's step 1 re-trued (`d41a12fd1` on #377, [T] 493); a correction posted on #379; a guard on `merge-bot pull-request close` routed for sizing, not built ([T] 132 to 141).
- **One-off or structural:** the skill text is structural; the tool guard is a proposal only.

### 3.5 The mirror workflow refused on workflow-file changes

- **First seen:** every scheduled run from 2026-11-02 failed with HTTP 403 ([T] 406).
- **Recurred:** not after the cure, by the record.
- **Cost:** one manual fast-forward; a proposed narrowing and a request that an Oak lane wait, both withdrawn the same hour ([N] 1325 to 1339).
- **Cure:** #378 (the bot's App token on refusal), opened 17:17, merged 17:37 on 11-03.
- **One-off or structural:** structural (workflow change). The App-token path was "proven by a stub trial only" at the record's writing ([T] 120).

### 3.6 Review-bot findings

- **Codex P1 "mirror commit is not an ancestor":** twice (#376, #380), rejected each time with `git merge-base --is-ancestor` ([T] 415, 459). Cost: one reply each.
- **Codex P1 on #381, Windows `.cmd` shims:** real; the door refused on its open thread after the Sonar check went green ([T] 553; [N] 1436). Cured by #386 and #387. Structural (a smoke test on `windows-basic`).
- **Codex usage limit:** declared unavailable on #387, #388 (twice) and #393 ([T] 600, 641, 650, 690). Cost: one declaration comment per head.
- **Oak's first checks on #1023 (11-09):** 6 code-quality comments on two Python scripts, 1 CodeQL finding, two Critical shell findings ([GH]; #391 body). Cured in one pull request, #391, 18 minutes from open to merge.
- **`claude[bot]` on #1023 (11-16 13:47):** the pre-push hook advised an install route the secret scan's allowlist refuses. Cured by #431, merged 22:24 (8 h 37 min after the review). One-off (advice text; the allowlist unchanged).

### 3.7 CI and runner failures

- **Runner DNS outage, 2026-11-11 13:57 to ~17:15:** every `browser-tests` job failed; five re-runs; recovered without a change ([T] 766; [N] 2343). It overlaps #393's ready-to-merge window (14:16 to 17:21). Then #407 made docs-only pull requests skip `browser-tests` (structural, at the owner's word).
- **`windows-basic` flake on #1023, 11-11 18:11:** `EPERM` from a `mkdir` racing a removal; passed on re-run 5 minutes later ([T] 775; [GH] run 43074766686). Not cured; on the work list.
- **`static-checks` 10-minute limit on the final head, 11-16 22:38:** "The job has exceeded the maximum execution time of 10m0s" ([GH] annotation). CI stayed red until the owner's re-run succeeded at 11-17 08:24 (9 h 35 min). No cure recorded. The thread record does not mention it.
- **CI cancelled on `9301a148e`:** superseded by the next push 12 minutes later ([GH]). No cost recorded.

### 3.8 The fork-naming rule

- **First seen:** planning the merge back, 2026-11-09 ([N] 1600).
- **Cost:** "a long run classifying 229 fork-naming files" and a three-option question, by the seat's own entry; duration not recorded.
- **Cure:** the owner lifted the 2026-09-02 prohibition in one sentence (11-09). Later: #417 removed the fork's programme notice; #423 removed the fork as a named party from decision records; #414 listed fork-only values with two ready checks.
- **One-off or structural:** the lifting is a ruling; the two `git grep` ready checks in the plan are a repeatable check ([P] 111 to 123).

### 3.9 Settings that live outside the tree

- **Turbo remote cache:** Vercel refused the OIDC exchange on #1023 (runs 42631264008, 43068100283); the seat asked for a Vercel policy before the merge; the owner withdrew that request on 11-16 ([T] 708 to 718, 763, 1037).
- **Upgrade note:** posted 11-11, corrected by the owner on 11-16 to one point ([T] 1033 to 1041; [GH] comment `updated_at` 13:33:39).
- **Cost:** two lane-state sections carried a pre-merge requirement that was later withdrawn. No elapsed hold is recorded against it.

### 3.10 Secret scanning

No push refused by secret scanning appears in [T], [N] or the GitHub record of #1023. The only
secret-scan item is the gitleaks advice finding in 3.6.

## 4. Owner rulings during the arc

Verbatim where the record quotes them; the source follows each.

- 2026-11-03: "13 approved, 14 approved, plans agreed, merge agreed, I do want you to also merge 374, and then to check if Engraph main is up to date with Oak main and sync from Oak main to Engraph main, and then merge from Engraph main to Engraph engraph" ([T] 402).
- 2026-11-03: "do fix the mirror" ([T] 114); "coordinate please" ([T] 428).
- 2026-11-03: "why would we want our mirror to run CI? It's a _mirror_, it is the responsibility of Oak to make sure that there code is in a proper state, our job is to mirror it, when we merge Engraph main into Engraph engraph via a PR all normal checks will run. Do we have any real problems, or was this just ceremony?" ([N] 1330); "it doesn't matter what dependabot does" ([N] 1339).
- 2026-11-04: "okay, please make merging 379 the priority, use all appropriate skills to plan the work" ([T] 438).
- 2026-11-04: "When it's a straight merge it makes sense, when work needs to be done, and has been done, throwing that work away is just throwing work away." ([N] 1343).
- 2026-11-05: "please continue" ([T] 491).
- 2026-11-05 ~13:45Z: "adopt the by-name ruling on engraph" ([T] 520).
- 2026-11-06: "You say that as if anyone but you is responsible for it." ([N] 1432). The same day the owner allowed the two Sonar marks on #381 (paraphrase, [T] 551).
- 2026-11-06: the frame, paraphrased in the record: `engraph` gets its remaining fixes and everything on Oak's default branch; then the merge back is prepared; then the fork is a plain mirror ([T] 596).
- 2026-11-08: "no pull requests back to Oak yet" (the record's wording, not marked verbatim; [T] 644).
- 2026-11-09: "the prohibition against naming the Engraph fork is lifted" ([M]; [N] 1602 paraphrases it).
- 2026-11-11: "the reunification merge MUST NOT happen automatically, only I am permitted to execute it" ([T] 733; [M] has the same with "To be clear," before it).
- 2026-11-11: "this is not a change to the general rule, this is a separate and special case, do not change the rule to accomodate this one off action" ([M], spelling as recorded).
- 2026-11-11: "there is no problem, this is a legitimate change that the merge will bring in" (on the merge removing Oak's content-audit review ledger; [M]).
- 2026-11-11: team of two, both implementers, no Director (paraphrase; [T] 662). The owner kept Automatic Analysis and chose the one project criterion (paraphrase; [T] 693).
- 2026-11-12: "docs only PRs do not need browser tests" ([T] 783).
- 2026-11-12: "docs only can be if the PR only changes markdown files and those files are only in the .agent, or root docs folder" ([T] 819).
- 2026-11-12: "PR 397 will merge before we merge back to Oak" ([T] 855).
- 2026-11-12: "VoiceOver checks for web apps are an ambition, not a requirement, and currently that work is not scheduled." ([T] 858).
- 2026-11-12, relayed by the second seat: "Hand all responsibilities other than the architecture investigation to Sandpiper" ([T] 805).
- 2026-11-13: "wait for 413" ([T] 870); "I will tell you when the other PRs are finished and the reunification PR can be updated" ([T] 876).
- 2026-11-15: "I will take care of the bug report"; "MCP-880 is fine for now" ([T] 918, 920). Also, paraphrased: no decision record names the fork as a party; Oak's seven-plugin block is restored ([T] 885).
- 2026-11-16: "Our interest is consistency rather than correctness, however any issues on the prod server must be noted." ([T] 1013).
- 2026-11-16, paraphrased: the upgrade note's three corrections; the owner accepts that the branch's sign-in code has not run against the production identity provider ([T] 1033 to 1043).

## 5. Segments that went well and badly

Cost figures are elapsed time on GitHub between named events; they are not working time.

| Segment | Elapsed | Units | Evidence |
| --- | --- | --- | --- |
| Carrier #376 (1.186.4) | 38 min open to merge | 4 conflicts, 53 files | [GH]; [T] 411 |
| Carrier #380 (1.186.5) | 26 min | 0 conflicts, 11 files | [GH]; [T] 449 |
| #391, clearing Oak's first checks | 18 min | 7 review comments and 2 shell findings answered in 21 files | [GH] |
| #378, the mirror cure | 20 min | 5 files | [GH] |
| #431, the gitleaks advice cure | 23 min open to merge; 8 h 37 min from the review | 1 finding, 4 files | [GH] |
| 11-16, report to ready | #429 merged 12:42, ready 13:34 | 62 tool calls compared on two live servers; 38 tools, 6 resources ([R], #1023 body) | [GH]; [R] |
| Pushes to #1023 | 10 pushes, 11 heads | 5 heads green on the first attempt (`2e577c299`, `0c197db22`, `e9abb2a83`, `75f5ea1a3`, `6a99eb399`); 4 red on SonarCloud (`13bdba2a7`, `0509940e6`, `4e33dd98d`, `495c82f45`); 1 cancelled by the next push (`9301a148e`); 1 green on the third attempt (`fc45609c8`) | [GH] check-runs and runs |
| Carrier #381 (1.186.8) | 31 h 57 min | 27 conflicted paths, 82 files, 7 Sonar issues, 1 open Codex thread | [GH]; [T] 501 to 555 |
| Carrier #388 (1.186.9) | 62 h 38 min | 34 conflicted files, 96 files, 44 Sonar issues, 14 issue comments, 23 review comments | [GH]; [T] 602 to 656 |
| Carrier #379 | 18 h 53 min open, then closed | 0 landed; replaced | [GH] |
| #1023, open to first all-green head | 2 d 23 h 52 min | 4 pushes; cures #391, #392, #401, #402 and the criterion | [GH] |
| #402 | 17 h 32 min | 6 files; held on a check that no longer applied | [GH]; [N] 2334 |
| #1023, all-green to merge | 6 d 0 h 59 min | 6 further pushes; see 3.3 | [GH] |

Comparisons the figures support:

- Carriers without a policy collision: 26 and 38 minutes. Carriers with it: 32 and 63 hours. Ratio of
  elapsed time roughly 50 to 150 times; conflict counts 0 to 4 against 27 to 34.
- Per conflicted path, #381 cost about 71 minutes of elapsed time and #388 about 110 minutes; #376 about
  9 minutes per conflict. Most of #388's elapsed time was the Sonar marks waiting, by the record ([T] 630 to 646), so
  this ratio measures the gate hold more than the merge work (inference).
- Small cure pull requests against a named finding (#378, #391, #431, #401, #407) each took 13 to 23
  minutes from open to merge.

## 6. What the arc produced beyond the merge

Reports and records:

- The consistency report, 374 lines ([R]; #429).
- The production snagging list, `docs/operations/mcp-server-production-snagging.md`, 66 lines (#430).
- The plan `reunify-oce-forks.plan.md`, with the fork-only values list and two ready checks (#391, #405, #414).
- The second seat's retrospective, `.agent/reports/agentic-engineering/why-a-warning-with-no-file-name-took-three-days-and-a-three-minute-scan-2026-11-15.md` (#426), and a Sonar bug-report draft for the owner to file ([T] 935 to 1000).
- The security review `.agent/reports/agentic-engineering/sonarqube-plugin-security-review-2026-11-13.md` (added in the window; [G] `git log --diff-filter=A`).
- Integration records on #380, #381 and #388 ([T] 461, 529, 628).

Tools and checks (files added in the window, [G] `git log --since=2026-11-03 --diff-filter=A` on the merged head):

- `packages/core/oak-eslint/src/rules/no-shell-form-process-launch.ts` (#404).
- `agent-tools/src/ci/ci-docs-only.ts` and `ci-docs-only-check.ts` (#407).
- `agent-tools/src/commit-advisories/commit-message-intake.ts` (#387).
- The `pnpm-by-name-launch` smoke on `windows-basic` and `cross-spawn` launchers (#386; [T] 576 to 581).
- The mirror workflow's App-token fallback (#378).
- The review-cost harvest paging its commits (#392).
- `sonar.exclusions` for binary files (#400).

Rules, policy and doctrine changed in the window ([G] `git log --name-status -- .agent/rules`):

- `sonarqube-mcp-instructions.md` and `no-warning-toleration.md`: the by-name ruling (11-04, 11-05) and the S4036 project criterion (11-11).
- `downstream-checkout-never-writes-upstream-surfaces.md` and `foreign-board-write-discipline.md` (11-09).
- `third-party-skills-require-security-review.md` (11-13); `documentation-hygiene.md` (11-16).
- The cross-fork integration skill's step 1, re-trued after #379 ([T] 493).
- ADR-213's screen-reader ruling reconciled (#409); decision records no longer name the fork (#423).

Lessons recorded in the napkin by this seat ([N]): dated entries across 2026-11-03 to 2026-11-12 (not counted here),
among them: read an irreversible step's precondition from the live object at the step; never re-arm a
watch that cannot succeed by itself; the door names one ground at a time; trace every caller before
stating a property of a shared launcher; trace friction to the decision it blocks before measuring it;
read a gate metric's definition before sizing a cure to it.

Routed and not built: the guard on `merge-bot pull-request close`; the carrier workflow's body text;
the `transaction-lock.ts` `EPERM` case; C078's `behavioural_intent`; the Elasticsearch client spies;
nineteen `list-style: none` rules ([T] 132 to 141, 770 to 779).

## 7. Could not verify

Claims the GitHub record does not support, or contradicts:

1. **Who merged.** The record's rule is that the owner alone executes the merge ([T] 733, 1005, 1032; [P] 18; the
   upgrade note; the #1023 description: "The repository owner merges this pull request; nobody else does").
   GitHub records the merge by `<code-owner>`, which also gave the only approval, 21 seconds earlier. The
   owner's account in this record, `<owner>`, left no review and is not the merging actor. No
   source read here says whether the owner authorised or asked for that merge. This is a gap, not a finding about intent.
2. **The record stops before the end.** [T]'s last entry is 2026-11-16 ~13:35Z and [N] has no entry by this seat
   after 2026-11-12. Not in the narrative: the `claude[bot]` review (13:47Z), #430, #431, the `static-checks`
   timeout, the owner's two CI re-runs on 11-17, and the approval and merge. Those rows above rest on GitHub alone.
3. **Plan state.** [P] reads `status: sketch`, `ratified_by: null`, `last_updated: 2026-11-12`, with the owner gate
   still listed, on the checkout read on 2026-11-19. Whether it was ratified elsewhere is not established.
4. **"About 4,690 files"** ([T] 464, 702) against 4,829 at the merge. The earlier figure is dated 11-04 and 11-11;
   the difference is consistent with later landings but was not reconstructed.
5. **The thread's identity table** lists this seat's last session as 2026-11-03 ([T] 26); the lane states run to 11-16.

Claims not checked against a primary source in this pass:

- Every SonarCloud figure (7, 44 and 30 S4036 issues; 30 to 0 after the criterion; the gate metric values;
  "15 open issues" against "161" in the #1023 description). SonarCloud was not queried; only the check
  conclusions per head were read.
- The permission classifier's four denials and the owner's allow rule ([T] 534, 638, 646): session-side, no GitHub trace.
- The conflict counts of each dry-run merge (4, 27, 34, 3): from [T]; not re-run.
- The runner DNS outage and its five re-runs: from [T] and [N]; the fork's run history was not read.
- Vercel's OIDC refusal and the owner's statement about Cloudflare header rewrites.
- The mirror's 403 history and run 41686089225.
- That the owner merged `engraph` into #388 on 11-07 ([T] 635).
- `d41a12fd1` (the skill re-true) and the fold timing "26.3 minutes against the owner's ten" ([N] 1319); #373 predates the window queried.
- The duration of the 229-file classification on 11-09 (not recorded anywhere read).
- Working time for any segment. Every duration in this ledger is elapsed time between GitHub events.
- [M] is outside version control; its two quotations cannot be re-checked from the repository.

Checked and consistent with GitHub: #374 and #376 merging at one commit; #379's ready, review and
close instants; the merge instants and short SHAs of #380, #381, #388, #393, #401, #402, #407, #408;
SonarCloud failing on `495c82f45` and passing on `2e577c299`; the `windows-basic` failure and re-run on
run 43074766686; the two renames of #1023 and the ready mark; the upgrade note's comment id.
