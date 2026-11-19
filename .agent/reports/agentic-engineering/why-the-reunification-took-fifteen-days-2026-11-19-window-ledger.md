# Window ledger: 2026-11-16 to 2026-11-19, the reunification lane's close

The reading ledger behind the lane state of 2026-11-19 in the `open-pull-requests-to-zero` thread
record and behind
[the retrospective](./why-the-reunification-took-fifteen-days-and-repeated-two-written-lessons-2026-11-19.md).
A read-only agent rebuilt it for Sandpiper guards Wind (690653) from the session transcript and
GitHub; the seat has not re-verified every row. One colleague's first name in an owner quote is
replaced by a bracketed description.

Reconstructed 2026-11-19 from primary sources. Read-only: nothing was edited, committed or
written to GitHub or SonarCloud.

## Sources and evidence tags

- **[T]** the session transcript, raw turns (not compaction summaries). `L<n>` is the
  zero-based line index in the JSONL file.
- **[G]** read first-hand from GitHub today with `gh` (pull requests, reviews, timelines, run
  attempts, rulesets, repository activity).
- **[L]** read first-hand from the local checkout today (remotes, branches, identity).
- **[I]** inferred; the reasoning is stated.
- SonarCloud was **not** queried in this reconstruction. Every SonarCloud fact below rests on
  the transcript's tool results only.

All instants are UTC. London was on GMT, so London time equals UTC.

Owner messages typed while the seat was mid-turn are stored in the transcript as
`queue-operation` and `queued_command` records, not as ordinary user turns. Six of the owner's
rulings in this window exist only there (section 2 marks them "queued").

## 1. Timeline

### 2026-11-16 (Mon): #1023 ready, the missed review, the gitleaks fix, the CI timeout

| UTC | Who | What | Evidence |
| --- | --- | --- | --- |
| 13:28:40 | seat | Commit `03d850490`, production snagging list, in a fork worktree | [T] L33958, [G] |
| 13:30:44 | owner | Rejected the seat's push-and-open call, then pasted the upgrade note with three corrections | [T] L33963-L33965 |
| 13:33:39 | seat | Upgrade-note comment on #1023 edited to the owner's wording | [T] L33993, [G] comment updated 13:33:39 |
| 13:33:55, 13:34:01 | seat (Oak's bot) | #1023 retitled; marked ready for review; four reviews requested | [G] timeline |
| 13:37:22 | seat (fork's bot) | Fork PR #430 opened (snagging list) | [G] |
| 13:44:17 | seat | `a9325236b` on #430: one Codex P2 finding accepted (two-issuer layout is ADR-115's decided design); thread resolved | [T] L34087 |
| **13:47:08** | `claude[bot]` | **Comment-only review on #1023 at `75f5ea1a3`**, 2,293 characters: `go install` and Linuxbrew gitleaks installs can no longer push | [G] review 5921021379 |
| 13:54:58 | seat | Told the owner #1023 had "no open review threads". The review above was 7 min 50 s old and not read | [T] L34127 |
| 13:59:58 | seat (merge tool) | #430 merged on the fork, `6a99eb399` | [G] |
| 14:02:58 | seat (Oak's bot) | **Push 1 of 2 in window**: `reunify-oce-forks` `75f5ea1a3` to `6a99eb399` | [T] L34159 |
| 14:03-14:15 | CI | Run 43881750020 on `6a99eb399`: success, 24 checks pass | [G], [T] L34215 |
| 14:23:00 | seat | First 30-minute Monitor on #1023, reading only items newer than its own start | [T] L34237 |
| 14:24:25 | seat | Session cron `2,32 9-16 * * *` to re-arm the watch in London working hours | [T] L34256 |
| 17:02 | seat | Watch off for the night; "no reviews or comments from people" | [T] L34425 |
| 17:57:25 | harness | Context compaction | [T] L34440 |
| 21:42:47 | owner | "please fetch all comments on PR 1023" | [T] L34469 |
| 21:43:58 | seat | Reported the `claude[bot]` review for the first time, 7 h 57 min after it was posted; finding checked against the code and upheld | [T] L34546 |
| 21:57:45 | owner | "please fix the gitleaks finding" | [T] L34549 |
| 21:59:07 | seat | `e5b4630f5`, advice-only change to four files (two pre-push hooks, `CONTRIBUTING.md`, `docs/engineering/setup.md`) | [T] L34577, [G] |
| 22:01:47 | seat (fork's bot) | Fork PR #431 opened | [G] |
| 22:09:16 | seat | `16a53cd01` on #431: Codex P2 accepted (the pinned-release route needs `dpkg`, so it is Debian-family only) | [T] L34651 |
| 22:17-22:24:40 | seat (merge tool) | #431 merged on the fork, `fc45609c8`. The merge call outran a 300 s timeout and finished in the background | [T] L34685, L34710, [G] |
| 22:27:35 | seat (Oak's bot) | **Push 2 of 2 in window**: `reunify-oce-forks` `6a99eb399` to `fc45609c8` | [T] L34737 |
| 22:27:59 | seat (Oak's bot) | Comment on #1023: the review's finding is fixed; description repointed to `fc45609c8` | [G] |
| 22:27:43-22:49:44 | CI | Run 43970274437 attempt 1 cancelled: `static-checks` and `schema-drift` hit the 10-minute job limit; `run-quality-gates` failed as a consequence | [G] attempt 1 |
| 22:51:11 | seat | `rerun-failed-jobs` as Oak's bot: HTTP 403 "Resource not accessible by integration" | [T] L34810 |
| 22:51:31 | seat | Question prompt: who re-runs? | [T] L34830 |

### 2026-11-17 (Tue): re-run and waiting

| UTC | Who | What | Evidence |
| --- | --- | --- | --- |
| 08:18:36 | owner | Answered "Leave it until tomorrow" (9 h 27 min after the question) | [T] L34831 |
| 08:19:49 | owner's GitHub account | Attempt 2 of run 43970274437, cancelled after 8 s | [G] attempts |
| 08:20:11-08:24:08 | owner's GitHub account | Attempt 3: success. #1023 back to 24 passing | [G] attempts |
| 08:25:09 | owner | "the checks should have passed now. We are still waiting on a decision from [a named Oak colleague]" | [T] L34849 |
| 09:12-17:02 | seat | Watch ticks, nothing new. Cron ticks due at 11:12 and 13:12 did not fire; the seat reported a session restart at 11:42 and 13:42 | [T] L35025, L35133 |
| 17:57:47 | harness | Context compaction | [T] L35360 |

### 2026-11-18 (Wed): merge, mirror, Oak checkout, Sonar, four pull requests

| UTC | Who | What | Evidence |
| --- | --- | --- | --- |
| 13:06:51 | mantagen | Approved #1023 at `fc45609c8` | [G] |
| **13:07:12** | **mantagen** | **Merged #1023.** Merge commit `dae303661`, parents `0d8543021` and `fc45609c8`; head branch deleted 13:07:14 | [G] timeline, commit, repository activity |
| 13:07:24 | seat | Saw the merge 12 s later; deleted the cron; stopped the Monitor | [T] L35698-L35720 |
| 13:07:54 | seat | Proved `engraph` (`fc45609c8`) an ancestor of Oak's `main` with an empty tree diff | [T] L35745 |
| 13:08:05 | seat | Question prompt on returning the fork to a mirror | [T] L35750 |
| 13:23:17 | Oak's release bot | v1.187.0 (`43d2d2fee`) | [G] |
| 14:19:51 | owner | Answered "Stop the carrier only" | [T] L35762 |
| 14:20:03 | seat (owner's `gh` sign-in) | Fork variable `UPSTREAM_CARRIER_ENABLED` set to `false` | [T] L35770, [G] variable timestamp |
| 14:20:29 | seat | Read SonarCloud's gate on Oak's `main` through the public API: `new_code_smells_severity` ERROR, threshold 14, actual 20 | [T] L35793 |
| 14:21:20 | seat | Question prompt carrying the wrong reading "12 new code smells score 20 against a limit of 14" | [T] L35832 |
| 14:22:08 | owner | Answered "Nothing on Oak yet" | [T] L35833 |
| 14:23:10 | owner | Five-step instruction for the fork and the local remotes | [T] L35839 |
| 14:23:42-14:23:53 | seat | Dispatched the fork's mirror workflow (run 44323769271); it fast-forwarded the fork's `main` `0d8543021` to `43d2d2fee` | [G] run, repository activity |
| 14:25:07 | seat | Fork ruleset 21202096 "integration branches" retargeted to `refs/heads/engraph` only | [T] L35886, [G] `updated_at` 14:25:07 |
| 14:25:15 | seat | Fork default branch set to `main` | [T] L35889, [G] |
| 14:25:23 | seat | Local remotes: `origin` renamed `engraph`, `read-only-upstream` removed, `upstream` renamed `origin` | [T] L35889 |
| 14:27:44 | owner | "Oak is now the default origin, and this checkout is once more an Oak OCE checkout" | [T] L35910 |
| 14:28:24 | seat | Repo-local git identity set to Oak's bot; `.github/merge-bot.json` rewritten for Oak; `gh` default repository set to Oak; checkout on `main` | [T] L35945-L35957, [L] |
| 14:28:57, 14:29:21 | seat | Per-user memory `checkout-is-an-oak-checkout.md` written; operator profile given a "Bindings since 2026-11-18" section | [T] L35968, L36009 |
| 14:32:36 | owner | Three points: rename to `engraph-fork`; find unmerged worktree work; "the Oak hold is lifted" | [T] L36024 |
| 14:32:43 | seat | Remote `engraph` renamed `engraph-fork` | [T] L36030, [L] |
| 14:32:53 | seat | Only unmerged local work: `5293394c4` on `docs/oak-agent-skills-review`, on no remote | [T] L36038 |
| 14:34-14:35 | seat | `371f1881a`: default case in `preview-serves.yml` (S131) and a direct re-export in `static-asset-paths.ts` (S7763) | [T] L36098-L36125 |
| 14:37:00 | owner (queued) | The small, bounded pull-request rule | [T] L36128 |
| 14:39:52 | merge tool | Refused to open the pull request: "19 lane pull requests are open, at or above the --wip-limit of 3" | [T] L36131 |
| 14:43:00 | owner | "Count only my own"; and a typed answer on the ten remaining findings (section 2) | [T] L36196 |
| 14:43:14 | seat (Oak's bot) | #1026 opened with `--wip-limit 20` | [T] L36201, [G] |
| 14:43-14:44 | seat | Compared the two SonarCloud projects through the public API | [T] L36210-L36255 |
| 14:44:39 | seat | Per-user memory `oak-prs-small-bounded-one-at-a-time.md` written | [T] L36259 |
| 14:46:21 | owner | Approved "Re-point it to Oak" for the Sonar tool server | [T] L36312 |
| 14:46:53 | seat | Ran `sonar auth org oaknational` (CLI sign-in state, not the configuration file the question named) | [T] L36359 |
| 14:49:29 | owner | Asked for best-of-both Sonar config, read from the docs | [T] L36387 |
| 14:50:54 | owner (queued) | Note on GitHub coverage and automatic analysis | [T] L36460 |
| 14:52:37 | seat | Question prompt recommending "Add both": a hotspot-review gate condition and 59 TypeScript rules | [T] L36530 |
| 14:55:23 | owner | Rejected the prompt to clarify | [T] L36531 |
| 14:55:36 | seat | **Corrected its gate-metric explanation unprompted** | [T] L36533 |
| 14:55:44 | owner | Screenshot; "hotspots are deprecated aren't they?" | [T] L36536 |
| 14:56:50 | seat | **Withdrew the hotspot recommendation**; new recommendation: change nothing | [T] L36567 |
| 14:59:10 | seat | Said #1026 "needs a reviewer before the merge tool will take it" | [T] L36580 |
| 15:01:10 | owner | "leave it on sonar way for ai code" | [T] L36584 |
| 15:02:46 | owner's GitHub account | Approved #1026 | [G] |
| 15:03:32 | owner | Chose "Accept them in SonarCloud" for the eight CSS findings | [T] L36631 |
| 15:04:09 | seat (owner's Sonar sign-in) | Eight `css:S9423` issues on `globals.css` lines 178-181 and 187-190 set to ACCEPTED, each with an agent-disclosure comment | [T] L36657 |
| 15:09:19 | owner | "fine, merge 1026 and mark the other issues as accepted or false positives as appropriate" | [T] L36688 |
| 15:09:45 | seat | `typescript:S7764` at `oak-theme.ts:242` ACCEPTED; `typescript:S1135` at `strict.ts:17` FALSE_POSITIVE | [T] L36709 |
| 15:10:15 | seat (merge tool, Oak's bot) | **#1026 merged**, `c18317eac` | [G] |
| 15:11:18 | SonarCloud | Re-analysis of `main`: gate OK, all four conditions OK | [T] L36994 |
| 15:12:28 | owner | Figma removal is deliberate; bundle it with the next pull request | [T] L36771 |
| 15:13:06, 15:13:44 | owner (queued) | Analyse the three minors; open draft pull requests for unmerged local work | [T] L36805, L36812 |
| 15:15:46 | owner's GitHub account | Pushed the fork's `main` `43d2d2fee` to `c18317eac` from outside this session. It started CI, CodeQL and a Release run on the fork; the Release run failed at "Generate release token" | [G] repository activity, runs 44333586359 and 44334903054 |
| 15:18:17 | seat (Oak's bot) | #1027 opened: `fa55485f1` (snagging entry 2 removed) and `50de4ace0` (Figma plugin line removed) | [T] L36842, [G] |
| 15:21:17 | seat (Oak's bot) | #1028 opened with `--wip-limit 30`: the skills-review commit `5293394c4` | [T] L36872, [G] |
| 15:29:33 | owner | "merge 1027 and 1028 once they are green and clean" | [T] L36926 |
| 15:30:10 | Oak's release bot | v1.187.1 | [G] |
| 15:31:47 | owner (queued) | Explore typing the descriptor as JSON Schema; no changes | [T] L36931 |
| ~15:32 | seat | Merged `origin/main` into the #1028 branch: `1cdac863c` | [T] L36935, [G] |
| 15:47:40 | seat (merge tool) | **#1027 merged**, `98084eb9a` | [G] |
| 15:47:53 | merge tool | First merge attempt on #1028 exited 1; message not captured | [T] L37027 |
| 15:48:22 | seat (merge tool) | **#1028 merged** on the second attempt, `81917a322` | [T] L37031, [G] |
| 15:49:03-15:49:27 | seat | `git pull` refused over `.claude/settings.json`; `git restore` blocked by a hook; a restoring Edit denied by the permission classifier; the seat stopped | [T] L37052-L37077 |
| 16:05:54 | Oak's release bot | v1.187.2 (`cdefe6fa0`) | [G] |
| 16:45:21 | harness | Context compaction | [T] L37096 |
| 17:26:22 | owner | Ran `git restore .claude/settings.json && git pull` in the session; local `main` to `cdefe6fa0` | [T] L37126-L37127 |
| 17:26:46 | owner (queued) | "what is the public pages lane?" | [T] L37182 |
| 17:30:42 | owner | Ruling on loose types; asked for a plan | [T] L37220 |
| 17:34:44 | owner | "Go ahead" with build, then the gates one at a time | [T] L37247 |
| 17:35-17:43 | seat | Three edits, generator run, build, then 22 gates each exiting 0 | [T] L37306-L37385 |
| 17:46:22 | seat (Oak's bot) | #1029 opened, `25268ff53`, 5 files, +15/-9 | [G] |
| 18:02:35 | seat (merge tool) | **#1029 merged**, `8ca6e1881` | [G] |
| 18:14 | SonarCloud | Analysis of `8ca6e1881`: gate OK, zero open findings on `main` | [T] L37476 |
| 18:17:14 | Oak's release bot | v1.187.3 (`01af87f32`) | [G] |
| 23:46:31 | fork's mirror workflow | Fork `main` fast-forwarded `c18317eac` to `01af87f32` | [G] repository activity |

### 2026-11-19 (Thu)

| UTC | Who | What | Evidence |
| --- | --- | --- | --- |
| 10:34:46 | owner | "is there any local work that is not yet merged?" Answer: none | [T] L37497-L37526 |
| 10:41:33 | owner | Coordination branch, thread record, wrap, retrospective, consolidation | [T] L37530 |
| 10:43-10:48 | seat (Oak's bot) | `coordination/2026-11-19-01af87` cut at `01af87f32` and pushed | [T] L37651-L37658, [L] |
| 10:52:29 | owner | "Both drainable buffers"; "Option 1, but a maximum of three PRs" | [T] L37674 |

### Pull requests in the window

| Pull request | Opened | Merged | By | Merge commit | Size | Human approval |
| --- | --- | --- | --- | --- | --- | --- |
| Fork #430 | 11-16 13:37:22 | 11-16 13:59:58 | fork's bot | `6a99eb399` | docs | none |
| Fork #431 | 11-16 22:01:47 | 11-16 22:24:40 | fork's bot | `fc45609c8` | 4 files | none |
| Oak #1023 | 11-09 12:16:15 | 11-18 13:07:12 | mantagen | `dae303661` | 4,829 files | mantagen 13:06:51 |
| Oak #1026 | 11-18 14:43:14 | 11-18 15:10:15 | Oak's bot | `c18317eac` | 2 files, +4/-2 | owner's account 15:02:46 |
| Oak #1027 | 11-18 15:18:17 | 11-18 15:47:40 | Oak's bot | `98084eb9a` | 2 files, +5/-14 | none |
| Oak #1028 | 11-18 15:21:17 | 11-18 15:48:22 | Oak's bot | `81917a322` | 9 files, +517/-7 | none |
| Oak #1029 | 11-18 17:46:22 | 11-18 18:02:35 | Oak's bot | `8ca6e1881` | 5 files, +15/-9 | none |

All rows [G]. Each of #1026 to #1029 carries one `claude[bot]` comment-only review of 179
characters ("Code review found no issues") bound to the final head.

## 2. Owner instructions and rulings, verbatim

Typed messages, queued messages and typed question-prompt answers. Option picks from question
prompts are listed after. Slash-command bodies, cron prompts and task notifications are
excluded. The owner's messages before 13:24Z on 2026-11-16 are covered by the existing thread
record and are not repeated.

1. **2026-11-16T13:24:38Z** (L33892)

   > \> so I infer that production's edge rewrites them
   >
   > if the prod server is under *.thenational.academy then the Oak Cloudflare will be rewriting the response headers, yes
   >
   > \>  The preview signs in through a development Clerk instance
   >
   > That is fine, the prod Clerk instance is in use all the time, so that is assumed working, and the mechanism are the same, I am happy to assume that is working.
   >
   > Review budget: fine
   >
   > raw outputs: fine
   >
   > production notes: are these issue found on production? If so, we just need a a note of them, create a snagging file in an appropriate location and wire it into the discovery surfaces
   >
   > 1023: please update the title and status, then I will ask people to start the review

2. **2026-11-16T13:33:04Z** (L33965), after pasting the three-point upgrade note

   > 1. the merge bot identity is optional, use of the default git identity is the default. A bot identity is strongly preferred, but not required.
   > 2. CI in github consistently uses the Vercel turbo cache, so there is no problem here, local checks will not if the token is not defined, that is up to the individual dev
   > 3. this config is in the sonar UI config, it's not 'outside the repo' it's config in a different system, it does not need to be mentioned here

3. **2026-11-16T13:54:38Z** (L34117): "the PR looks ready to merge?"
4. **2026-11-16T13:55:13Z** (L34130): "we will wait for 430"
5. **2026-11-16T14:22:33Z** (L34220): "We are now waiting for feedback. Please subscribe to the PR"
6. **2026-11-16T14:24:00Z** (L34244): "it may take several days. Do not bother to re-arm between 5pm and 9am London time, nothing will happen in those hours"
7. **2026-11-16T21:42:47Z** (L34469): "please fetch all comments on PR 1023"
8. **2026-11-16T21:57:45Z** (L34549, an accepted prompt suggestion): "please fix the gitleaks finding"
9. **2026-11-17T08:25:09Z** (L34849): "the checks should have passed now. We are still waiting on a decision from [a named Oak colleague]"
10. **2026-11-18T14:23:10Z** (L35839): "stop the carrier, make sure Engraph main is up to date, merge, make sure the engraph branch is an ancester of the main branch, make the main branch the default branch, change the local remotes to be origin oak engraph engraph and no upstream. Does that all make sense?"
11. **2026-11-18T14:27:44Z** (L35910): "Oak is now the default origin, and this checkout is once more an Oak OCE checkout"
12. **2026-11-18T14:32:36Z** (L36024)

    > 1. rename the engraph remote to engraph-fork
    > 2. identify which worktrees have unmerged useful work, tell me, and update them to track Oak OCE
    > 3. the Oak hold is lifted

13. **2026-11-18T14:37:00Z** (queued, L36128): "From now on, we keep the PRs well defined, bounded and tight /oak-pr-lifecycle /oak-proportionality , we want other agents and humans to be able to review them accurately with the least amount of effort. Small, focussed, _bounded_"
14. **2026-11-18T14:43:00Z** (typed answer to a question prompt, L36196): "we investigate each one and fix where appropriate. the demos are low risk, and the vitest thing just seems dumb. It sounds like we have a separate issue that we are not currently properly connected to the Oak OCED Sonar project. Please check the settings on the Engraph Sonar project so we can make sure the Oak ones are at least as strict"
15. **2026-11-18T14:49:29Z** (L36387): "please use the Sonar plugin to determine what the best of both configs is, read the sonar docs, make sure we are using the latest config and approaches"
16. **2026-11-18T14:50:54Z** (queued, L36460): "note that Github itself also supports reporting on code coverage, and that automatic Sonar analysis removes both maintenance cost and an error surface"
17. **2026-11-18T14:55:44Z** (L36536): "[screenshot path elided] hotspots are deprecated aren't they?"
18. **2026-11-18T15:01:10Z** (L36584): "leave it on sonar way for ai code"
19. **2026-11-18T15:07:24Z** (L36664): "why is 'window' a problem?"
20. **2026-11-18T15:09:19Z** (L36688): "fine, merge 1026 and mark the other issues as accepted or false positives as appropriate"
21. **2026-11-18T15:12:28Z** (L36771): "the removal of figma is deliberate. Bundle that change with the next PR"
22. **2026-11-18T15:13:06Z** (queued, L36805): "analyse the three remaining minor issues please /oak-metacognition /oak-reason"
23. **2026-11-18T15:13:44Z** (queued, L36812): "and please open draft PRs for any local work that has not been merged yet"
24. **2026-11-18T15:29:33Z** (L36926): "merge 1027 and 1028 once they are green and clean"
25. **2026-11-18T15:31:47Z** (queued, L36931): "for the other issues, `record<string, unknown>` is an antipattern, if it json schema can we type it as json schema? Just explore a bit, don't make changes, I don't want to go messing in the internals at the moment"
26. **2026-11-18T17:26:46Z** (queued, L37182): "what is the public pages lane?"
27. **2026-11-18T17:30:42Z** (L37220)

    > okay, change unknown or undefined to just unknown, and add a comment that this is debt and needs investigating, we should not be using loose types anywhere except incoming IO boundaries, and at those we should immediately validate to a strict type. And for the rest we follow your suggestions.
    >
    > Plan that work, roughly, and show me the plan as a summary list

28. **2026-11-18T17:34:44Z** (L37247): "Go ahead. after the generator changes run the build and then run the full quality gates, one gate at a time"
29. **2026-11-19T10:34:46Z** (L37497): "is there any local work that is not yet merged?"
30. **2026-11-19T10:41:33Z** (L37530): "okay, please create a coordination branch, and write the thread record and create and merge a PR, include both a session wrap and a retrospective, and a dedicated consolidation session. Review what the dedicated consolidation session would be need to cover before starting, and we will discuss approaches. Please use all appropriate skills"
31. **2026-11-19T10:52:29Z** (typed answer to a question prompt, L37674): "Option 1, but a maximum of three PRs"

Owner actions typed as shell commands in the session: `git pull` (15:11:20) and `git status`
(15:11:37) on 2026-11-18; `git restore .claude/settings.json && git pull` (17:26:22).

### Option picks from question prompts

| Answered (UTC) | Question | Pick |
| --- | --- | --- |
| 11-17 08:18:36 | Who re-runs the two timed-out CI jobs? | "Leave it until tomorrow" |
| 11-18 14:19:51 | Return the fork to a mirror now? | "Stop the carrier only" |
| 11-18 14:22:08 | Open an Oak pull request for the Sonar findings and snagging entry 2? | "Nothing on Oak yet" (lifted at 14:32:36) |
| 11-18 14:43:00 | How is the work-in-progress limit counted on Oak? | "Count only my own" |
| 11-18 14:46:21 | Re-point the Sonar tool server to Oak? | "Re-point it to Oak" |
| 11-18 14:55:23 | Add a hotspot gate condition and 59 TypeScript rules? | Prompt rejected to clarify; no answer |
| 11-18 15:03:32 | How are the eight `!important` findings settled? | "Accept them in SonarCloud" |
| 11-19 10:52:29 | How far does the consolidation go? | "Both drainable buffers" |

## 3. Mistakes by this seat, and how each was caught

| # | Mistake | Caught by | Correction | Evidence |
| --- | --- | --- | --- | --- |
| 1 | **Missed the `claude[bot]` review on #1023** for 7 h 57 min. It arrived at 13:47:08 as a comment-only review whose finding sits in the review body ("outside the current diff"), so it made no review thread. The seat's readiness checks at 13:54 and 14:16 read threads, checks and `reviewDecision` only. The Monitor started at 14:23 read only items newer than its own start. Five "nothing new" reports followed | The owner's request at 21:42:47 to fetch all comments | Full read of comments, reviews and threads; the seat stated the miss; fix in fork #431 | [G] review time; [T] L34127, L34237, L34546 |
| 2 | **Wrong reading of the gate metric.** "12 new code smells score 20 against a limit of 14" treated `new_code_smells_severity` as a sum. It is the highest severity among new findings; the gate fails on any new maintainability finding of major severity or above. Nine findings failed the gate, not twelve. The wrong reading went into a question prompt | The seat itself, after reading the gate's definition through the signed-in CLI | Stated at 14:55:36 under "A correction to what I told you earlier" | [T] L35832, L35835, L36533 |
| 3 | **Recommended a hotspot-review gate condition** ("Add both (Recommended)") on a concept SonarCloud has deprecated | The owner, with a screenshot of the project's own deprecation notice | Withdrawn at 14:56:50 after a docs query; recommendation became "change nothing" | [T] L36530, L36536, L36567 |
| 4 | **Wrong claim that #1026 needed a human reviewer** "before the merge tool will take it". Oak's bot is a bypass actor on the code-owner review ruleset, and #1027, #1028 and #1029 merged with no human approval while GitHub showed `BLOCKED` seconds before | Nobody in the session. The owner approved #1026 at 15:02:46 and the seat's merge report did not mention the approval | Not corrected in the transcript | [T] L36580, L37027, L37031; [G] reviews, ruleset 19395183 bypass list. The reading of cause is [I] |
| 5 | **Wrong mechanism in a question prompt.** The prompt said the Sonar tool server was bound by a `SONARQUBE_ORG` header in user-level Claude configuration. The entry is `sonar run mcp`; the organisation comes from the CLI's sign-in. The seat then ran `sonar auth org oaknational`, a different change from the one the owner approved | The seat itself, on reading the entry | Reported in the next summary. The session's Sonar tools still listed only the fork's project afterwards, so all Oak work went through `sonar api` | [T] L36311, L36340, L36359, L36366, L36409 |
| 6 | **Said "I would probably mark the generated ones"** for the three minor findings before reading them. All three were true findings | The seat itself, on the owner's request to analyse them | Stated at 15:22:03; fixed in #1029 | [T] L36912 |
| 7 | **Two attempts to discard the owner's uncommitted settings change** (`git restore`, then an Edit restoring the line) after the owner had called the change deliberate | A repository hook, then the permission classifier | The seat stopped and handed the command to the owner, who ran it at 17:26:22 | [T] L37059, L37065, L37081 |
| 8 | Unquoted heredoc (`<<EOF`) holding backticks: zsh ran `engraph` and the short SHAs as commands | The shell's own errors | Re-run with a quoted heredoc; the description's stale SHA fixed in the next call | [T] L34176-L34183 |
| 9 | Polled for the dispatched mirror run with a filter time seven minutes in the future, so no run id was found and `gh run watch` failed | The command's output | Checked the run by its id in the next call; it had succeeded | [T] L35866, L35886 |
| 10 | Wrote an operator-profile edit holding an absolute home path | The machine-local-path hook | Reworded to "the owner's primary checkout" | [T] L36000, L36009 |
| 11 | Edited a file not yet read; wrote a scratch file under `/tmp` outside the scratchpad | The harness; the seat itself | Read first; file removed | [T] L35967, L36362 |
| 12 | Did not capture the first #1028 merge failure's message | The seat itself | Retried; reported the gap | [T] L37027, L37081 |
| 13 | First citation in the debt comment named a principle heading that does not exist ("Preserve type information") | The seat itself, by grep before generating | Changed to "Compiler Time Types and Runtime Validation" | [T] L37279-L37304 |

## 4. Surprises and non-obvious tool and platform facts

### GitHub

- **A review whose findings are all outside the diff has no thread.** `claude[bot]` put the
  finding in the review body. A thread query and `reviewDecision` both read clean.
  [G] review 5921021379; [T] L34527.
- **An app installation token cannot re-run workflow jobs here.** `rerun-failed-jobs` returned
  403 "Resource not accessible by integration". The owner's account re-ran them. [T] L34810;
  [G] attempts 2 and 3.
- **`run-quality-gates` goes red when a sibling job is cancelled**, so a slow checkout shows as
  three failures. The checkout step took over seven minutes against a ten-minute job limit.
  [G] attempt 1 jobs; [T] L34825.
- **`gh pr checks --watch` returns when checks finish; it does not say they passed.** The
  22:28 watch ended with 3 failing. [T] L34773.
- **`mergeStateStatus: BLOCKED` did not stop Oak's bot.** #1028 read `OPEN BLOCKED` at 15:47:53
  and merged at 15:48:22 with no approval. Ruleset 19395183 is named "Code-owner review gate
  (bot-exempt by owner ruling 2026-07-21)" and lists the bot's app as an always-bypass actor.
  [T] L37027, L37031; [G].
- **Fork ruleset following the default branch.** The seat retargeted "integration branches" to
  `refs/heads/engraph` before switching the default, because the ruleset requires a pull
  request and would have blocked the mirror's fast-forward of `main`. [T] L35906; [G] the
  ruleset's current target and `updated_at`. The earlier target is the seat's statement only.
- **The carrier is gated by a repository variable, not by disabling the workflow.** Both
  workflows are still `active`; the carrier's scheduled runs now conclude `skipped`. [G].
- **A person's push to the fork's `main` starts CI, CodeQL and Release there; the mirror
  workflow's own push starts only the code-quality run.** The Release run failed at
  "Generate release token". [G] runs of 2026-11-18 15:15:49 and 23:46.
- **Oak's `main` now carries the `Upstream mirror` and `Upstream carrier` workflows**; both run
  on schedule and conclude `skipped`. [G] run list.

### Merge tool (`agent-tools merge-bot`)

- **The work-in-progress limit counts every open non-Dependabot pull request in the
  repository**, not the caller's own. On Oak that was 19. The owner ruled "Count only my own";
  the seat passed `--wip-limit 20`, then 30. [T] L36131, L36196, L36201, L36872.
- **`merge` holds a quiet window** and polls every 30 s ("SETTLING-QUIET-WINDOW"). #431's merge
  outran a 300 s tool timeout and finished in the background. [T] L34685, L34710.
- **`--expect claude` is satisfied by a comment-only review bound to the tip.** A records-class
  change merges on green checks with zero unresolved threads inside the quiet window.
  [T] L36713, L37031.
- **The tool mints for whichever app `.github/merge-bot.json` names.** That file is ignored by
  git and was rewritten by hand when the checkout became an Oak checkout. [T] L35945-L35962.
- **A push through the tool runs the full pre-push gate**: 2 to 5.5 minutes per push.
  [T] L34737, L36131, L37658.

### Hooks and the harness

- **The hook policy matches substrings of the whole command.** `git worktree add $PWD/.claude/…`
  followed by `cd .claude/…` was blocked as `git add .`. The same command with an absolute path
  and `git -C` passed. [T] L36778, L36779, L36782. That the trigger was `add` followed by a path
  starting with `.` is [I].
- **`git restore` is blocked by hook** as worktree destruction, even on a file proven identical
  to the merged version. [T] L37059.
- **The permission classifier then denied an Edit that restored the same line**
  ("Destructive or Unwanted Actions"). [T] L37065.
- **The machine-local-path hook also guards Edits outside the repository** (the operator
  profile). [T] L36000.
- **Session crons do not survive a session restart cleanly**: ticks due at 11:12 and 13:12 on
  2026-11-17 did not fire. A Monitor lives 30 minutes. [T] L35025, L35133; the cause is [I].
- **Owner messages typed mid-turn are not ordinary user turns in the transcript.** [T] L36128.

### SonarCloud

- **`new_code_smells_severity` is a highest-severity value, not a count or sum.** [T] L36533.
- **Security hotspots are deprecated**; findings now appear as security issues. The agentic gate
  has no hotspot condition. [T] L36553, L36567.
- **Oak's project**: gate "Sonar way for Agentic AI" (id 153519); "Sonar agentic AI" for
  TypeScript and JavaScript; "Sonar way comprehensive" for CSS, web, YAML and shell. **The
  fork's**: gate "Sonar way"; "Sonar way extended" for CSS, web and YAML. Oak's stricter CSS
  profile is why the eight `!important` findings appeared only on Oak. [T] L36240, L36466.
- **Neither TypeScript profile contains the other**: 432 rules against 472; 19 only in the
  agentic profile, 59 only in comprehensive, 413 shared. [T] L36497.
- **Built-in gates and profiles cannot be edited or stacked.** [T] L36533.
- **Automatic analysis does not import coverage**, so the 80% coverage condition is never
  evaluated. [T] L36533.
- **The pull request's gate and `main`'s gate disagreed**: #1023's passed; `main` failed after
  the merge. [T] L35793, L35835.
- **Reading a gate's definition needs organisation membership**; the public API gives only the
  evaluated conditions. `qualitygates/get_by_project` needs the `organization` parameter.
  [T] L36210, L36369.
- **`sonar run mcp` takes its organisation from the CLI's sign-in** (`sonar auth org <key>`),
  and the running tool server kept the old one. `sonar api post /api/issues/do_transition`
  works under that sign-in. [T] L36340-L36366, L36409, L36657.
- **The word TODO inside a rule name** (`vitest/warn-todo`) raises S1135. The debt comment in
  #1029 avoided `TODO` and `FIXME` for that reason. [T] L36196, L37232.

### zsh

- `GID` is a read-only special parameter: assigning it failed with "failed to change group ID".
  [T] L36230.
- Unquoted `--include=*.md` fails with "no matches found". [T] L36064.
- Word-splitting a variable needs `${=var}`; pipeline exit codes are in `pipestatus`, not
  `PIPESTATUS`. [T] L36232, L36106.
- Backticks inside an unquoted heredoc are command substitutions. [T] L34176.

### Code

- The two generated files flagged by Sonar come from string templates
  (`generate-query-parser.ts`, `emit-response-validators.ts`); the fix is in the template plus
  a regeneration. No test asserts the emitted text. [T] L36912, L37272, L37426.
- `window.oakTheme` is a test seam: the integration test injects a fake `window`. [T] L36684.

## 5. Costs

| Measure | Value | Evidence |
| --- | --- | --- |
| #1023, marked ready to merged | 1 day 23 h 33 min (11-16 13:34:01 to 11-18 13:07:12) | [G] |
| #1023, opened to merged | 9 days 0 h 51 min | [G] |
| #1023, final head pushed to merged | 1 day 14 h 40 min | [T], [G] |
| #1023, last green to merged | 1 day 4 h 43 min | [G] |
| #1023, approval to merge | 21 s | [G] |
| Pushes to #1023's branch after it was marked ready | 2 (`6a99eb399`, `fc45609c8`) | [T], [G] |
| Fork pull requests feeding those pushes | 2 (#430, #431), 2 commits each, one Codex P2 finding each | [G], [T] |
| Review rounds on #1023 in window | 1 bot review (missed for 7 h 57 min); 1 human approval | [G] |
| CI on #1023 red | 9 h 34 min; 3 attempts on one run | [G] |
| Watch cost | 27 Monitor arms, 27 cron firings, 24 expiries with no event | [T] |
| Oak pull requests #1026 to #1029, opened to merged | 27 min, 29 min, 27 min, 16 min | [G] |
| Tool calls from 11-16 13:35Z | 276, of which 186 Bash | [T] |
| Tool results flagged as errors | 12: 5 non-zero exits, 3 hook blocks, 1 classifier denial, 1 owner rejection, 1 harness precondition, 1 docs-query timeout | [T] |
| Other refusals and retries not flagged as errors | merge tool WIP refusal (1); bot re-run 403 (1); #1028 merge retried (1); #431 merge timed out to background (1); owner rejection at 11-16 13:30:44 (1, just before the window) | [T] |
| Question prompts | 8 asked, 7 answered, 1 rejected | [T] |
| Context compactions | 3 (11-16 17:57, 11-17 17:57, 11-18 16:45) | [T] |
| Releases cut by this window's merges | 4 (v1.187.0 to v1.187.3) | [G] |

## 6. Still open at the end of the window

- **The fork is not yet a plain mirror.** The `engraph` branch (`fc45609c8`, protected) and
  ruleset 21202096 still exist; the carrier workflow is active and variable-gated. Oak's
  workflow triggers still name `engraph` (the seat's statement). The seat said deletion needs
  the owner's word. [G]; [T] L37493.
- **Fork Release run failed** on 2026-11-18 15:22:33 at "Generate release token". Not seen in
  the session. [G].
- **Local leftovers**: branch `engraph` and branch `chore/sonar-findings-to-zero` still track
  `engraph-fork/engraph`; both are contained in Oak's `main`. [L]; [T] L37526.
- **Type debt marked in #1029**: the response descriptor is `Record<string, unknown>`. Typing it
  as `SchemaObject`, or deleting two readers that look unused, was explored and parked at the
  owner's word. [T] L36972.
- **The 59 TypeScript rules** only the comprehensive profile has are not enforced on Oak; the
  owner left the configuration as it is. [T] L36567, L36584.
- **Public pages lane**, steps 5 to 7. Its plan is held outside the repository. Step 5 needs
  splitting to fit the bounded rule. Steps 1 to 4 "done" is by the seat's notes, not re-checked.
  [T] L37217.
- **Operator profile**: the "Bindings since 2026-11-18" section awaits the owner's
  ratification; the rest of the file still describes the fork line. [T] L36011.
- **Skill and tool gaps this window exposed**: the pull-request readiness check reads threads
  and not review bodies; the merge tool's limit counts the whole repository.
- **Records**: the thread record, retrospective and wrap for this window; the consolidation
  (51 napkin entries, 6 pending graduations) in at most three pull requests. [T] L37662, L37674.
- **Earlier observations still unacted on** (from the previous lane state): named individuals
  in `LICENCE-DATA.md`, the demos' READMEs and `CHANGELOG.md`; the pinned `@mcpjam/cli`.
- **Session cron** deleted at 11-18 13:07:33; no watch is running. [T] L35718.

## 7. Could not verify, and conflicts

### Outline items corrected

- **"Carrier workflow disabled."** The workflow is not disabled. Its variable is `false` and
  its runs skip. [G].
- **"Rulesets changed."** One ruleset was retargeted. Nothing was deleted. [G].
- **"Local remotes renamed (origin = Oak, engraph-fork = fork)."** True, in two steps: the fork
  remote was first `engraph` (14:25), then `engraph-fork` (14:32) at the owner's word. [T], [L].
- **"A CI timeout."** Confirmed, with one addition: the owner's account re-ran it at 08:19 and
  08:20 on 2026-11-17, straight after answering "Leave it until tomorrow". [G].
- **"PRs #1026 to #1029 merged."** Confirmed, with one addition: the owner's account approved
  #1026; the other three had no human approval. [G].
- **"Two attempts to clear it were denied."** Confirmed: one by a repository hook, one by the
  permission classifier. The owner cleared it. [T].

### Not verified first-hand

- **Every SonarCloud fact**: gate and profile settings, the ten dispositions (eight ACCEPTED on
  `css:S9423`, one ACCEPTED on `typescript:S7764`, one FALSE_POSITIVE on `typescript:S1135`),
  the 15:11 and 18:14 analyses, zero open findings. Transcript tool results only.
- **Production health and the JSON 404** on an unknown address. Transcript only.
- **Whether the colleague the owner named is the account that merged.** Not established. [I].
- **Why mantagen merged** when the standing ruling said only the owner merges #1023. The
  transcript holds no owner comment on it.
- **The fork ruleset's target before 14:25:07.** The seat said it followed the default branch.
- **The cause of the missed cron ticks** on 2026-11-17.
- **The cause of the first #1028 merge failure.** The output was cut to two lines.
- **Whether the Sonar tool server ever reached Oak's project.** The last call in the transcript
  (14:49:37, after a plugin reload) still listed only the fork's.
- **The cause of the `git add .` hook block.**

### Conflicts between sources

- **Merge instant of #1023**: the merge commit's committer date is 13:07:10; the repository
  activity log says 13:07:11; the pull request's `mergedAt` is 13:07:12.
- **Approval time**: the seat's report said mantagen approved "at 13:06 UTC"; GitHub says
  13:06:51. Consistent.
- **Mistake 4**: the transcript says #1026 needed a human reviewer; GitHub's record of #1027 to
  #1029 says the bot merges without one.
- **The owner's "leave it on sonar way for ai code"** names the legacy gate; the project is on
  "Sonar way for Agentic AI". The seat read it as "leave the configuration as it is" and said
  so. The owner did not reply to that note. [T] L36601.
- **Compaction summaries** were not used as evidence. Where a summary and raw turns overlap, the
  raw turns above are the source.
