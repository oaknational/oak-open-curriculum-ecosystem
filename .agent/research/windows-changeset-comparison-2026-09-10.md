# The native-Windows changeset — #123 compared with upstream's, and which should merge (2026-09-10)

**Trigger.** Owner word, 2026-09-10 15:2xZ, verbatim: "I want 123 compared with the upstream
windows work, and an exploration of which should be merged. I slightly favour the upstream as
it was done by a person actually working on windows, but if there are enhancements from our
work then I would like those preserved." Run by the Director under the concept-exploration
skill; every Oak-repository read below was made under that comparison request and is named.

## Movement 1 — the raw observations (first-hand, 15:3xZ–15:5xZ)

1. **#123 is a snapshot of upstream's branch, not a fork of it.** The fork's `#123` head
   SHA:5dd76c612 is the branch `claude/objective-nightingale-b4ba25` at its 2026-08-18 state
   (SHA:6f073346f: thirteen commits by Luke Arnold 2026-08-12→17 and two bot cures 2026-08-18)
   plus one sweep commit conserving an untracked macOS validation runner. `git merge-base
   --is-ancestor 6f073346f <upstream head>` is true: everything the fork holds, upstream's
   branch holds.
2. **Upstream's branch went nine commits further.** Upstream PR #891 ("MCP-602: fix(estate):
   make the repo work on native Windows") has head SHA:a57b89418: the fork's state plus nine
   Luke commits of 2026-08-19→30 — the windows review round-2 closes, a separator-trim
   predicate, fail-loud test shapes replacing if-guarded assertions, and four root-spelling
   fixes (drive-relative env roots refused, UNC share roots, extended-length spellings,
   volume-GUID spellings) with a complexity split. Delta over #123: 15 files, +520/−117
   (agent-tools spawn, core, typescript-estate, three test files, refounding, the MCP content
   source).
3. **The fork has no enhancement upstream lacks.** The two 2026-08-18 bot cures the sweep
   record credited to "our work" (the trusted shell path joined with the platform delimiter;
   the smoke env overlaid on the resolved pnpm invocation) are commits ON upstream's branch. The
   only fork-side addition is the untracked runner script `.run-macos-validation.sh`, a
   session helper, not a product change.
4. **Upstream set the work down today.** #891 was closed unmerged at 2026-09-10 13:53Z by an
   agent at Luke's instruction: "open since 15 August, it now conflicts with main, and Matt's
   changes-requested from 20 August was never resolved, so it is being set down rather than
   finished … The branch stays, so reopening costs nothing if native Windows comes back on the
   list." What it carried, in the closer's words: native Windows support across agent-tools —
   path separator and drive-letter handling, trusted `git` and `gh` resolution, LF text
   normalisation, pnpm path resolution for spawned processes, worktree matching under
   drive-letter casing.
5. **What blocked it upstream.** Matt's CHANGES_REQUESTED (2026-08-20, agent-authored under his
   credential): the corepack environment scrub in `agent-tools/src/spawn/pnpm-env.ts` was
   case-sensitive while Windows environment keys are not, so `CorePack_Home` survived the
   scrub — cure by normalised-key comparison plus a mixed-case regression. Fifteen review
   threads, two still unresolved (Copilot, on `mcp-conformance/owner-only-write.ts`): opening
   the destination with `'w'` follows a planted symlink and truncates its target before the
   descriptor is tightened (cure: write a fresh owner-only temp file and rename over the
   destination); and `fchmod(0600)` cannot set an NTFS ACL, so retained authenticated output can
   inherit a world-readable ACL on a shared Windows checkout (cure: verify a user-only ACL or
   refuse retained authenticated output on Windows).
6. **The mirror does not carry it.** `git cherry -v origin/main 5dd76c612` at the mirror
   SHA:216e64c15 (release 1.181.1) finds no patch-equivalent for any of the sixteen (#123's thirteen, its two cures and the
   sweep commit); the
   mirror's own "windows" commits are the cross-platform plans and ledgers, the LF-only
   `.gitattributes` (756cead2e) and the gitleaks module-path fix (f0b2e2987).
7. **Merging it into `engraph` is cheap in conflicts.** `git merge-tree --write-tree
   origin/engraph <upstream head>`: FOUR conflicts — two test files the fork also evolved
   (`merge-bot/repo-config.unit.test.ts`, `collaboration-state/state-integrity.integration.test.ts`)
   and two research-package files deleted on `engraph` and modified on the branch (resolve as
   deleted). Against upstream `main`: two conflicts. The changeset's footprint is 146 files, 12
   of them also in the fork's own delta over upstream.
8. **The owner's standing ruling on tiers** (2026-08-18, the ratified strategic node "Host
   portability — support tiers, seams, and the ratchet"): POSIX and Windows-via-WSL are
   first-class; native Windows "is a goal but non-vital as it currently blocks nothing"; a basic
   Windows CI leg (install/build/unit on `windows-latest`) is REQUIRED. On the tip every CI job
   still runs on `ubuntu-latest`; the required Windows leg never landed.

**Inherited assumptions exposed (metacognition).** (a) "The fork's work has enhancements to
preserve" — the fork's branch is a checkout of upstream's PR branch at an earlier commit, so
every enhancement credited to the fork is upstream's too; the sweep's provenance line
("fifteen commits absent from the tip by patch") was true and misleading at once, because the
tip it compared against was the fork's, not the branch's own line. (b) "Upstream's work landed"
— it never did; it was set down today, an hour before this comparison. (c) "Matt's
changes-requested is unresolved" — the finding was cured on the branch on 2026-08-19; the review
state is stale, not the code. (d) "Merging 146 files into a tip that moved 610 commits is a
re-implementation" — the merge-tree says four conflicts, two of them deletions; the estate's
seams held. The fluent "close it, upstream owns Windows" would have discarded a working
changeset nobody now owns.

## Movement 2 — the problem, not a solution

**Kind.** An ownership gap: a near-complete capability (native Windows support across
agent-tools, 146 files, review rounds absorbed) has no line that will land it — upstream set it
down, the fork holds a stale subset, and the owner's standing ruling calls native Windows a
non-vital goal while REQUIRING a Windows CI leg that does not exist.

**Gap.** No one can run this estate natively on Windows, the proof leg the ruling requires is
absent, and the changeset that would supply both is decaying (two conflicts against upstream
today, more each week).

**Who it harms.** A native-Windows contributor (today: none known, which is why upstream set it
down); the October merge-back, which either carries a rotted branch or loses the work; the
owner's own ruling, which stands unmet on the CI leg.

**Mechanism.** The work lived on one person's branch under a review that was cured but never
re-run; the estate's other seats worked on other things; the closer's "reopening costs nothing"
is true of the branch and false of the review debt, which grows with every landing.

**Constraints.** The fork never writes upstream (the branch stays upstream's; the fork merges
a fetched head, preserving Luke's authorship in the merge); two live security findings on the
new owner-only write must be cured, not carried; the tier ruling (WSL first-class, native
Windows non-vital, a basic Windows CI leg required); the fork's own delta touches twelve of the
files; the cross-fork divergence discipline (no findings on upstream-authored lines cured in a
sync carrier — this is NOT a sync carrier but a feature lane, so cures are in order).

**Success.** `engraph` carries upstream's head SHA:a57b89418 by one merge commit (the nine
later commits included, the fork's snapshot #123 closed as superseded); the two owner-only-write
findings cured with tests; a basic Windows CI leg (install, build, unit) on the PR reporting
first-hand what native Windows does today; the PR reviewed by the estate's own legs; landed
or held on its own evidence, never on the belief that upstream did the work.

## Movement 3 — the solution space reopened

- **Close #123 and do nothing** (the fluent answer under "non-vital"): discards a working
  changeset with 96 test-file changes and four review rounds absorbed, for a saving of four
  conflicts. The merge-back would then re-encounter the branch as upstream's dead limb. Rejected.
- **Land #123 as it is**: strictly dominated — upstream's head has nine more commits including
  the round-2 review closes and the root-spelling fixes. Rejected; #123 closes as superseded.
- **Land upstream's head into `engraph` as a feature lane** (the verdict): one `--no-ff` merge of
  the fetched head (authorship preserved), the four conflicts resolved (two test files by
  hand, two research files that the fork deleted stay deleted), the two owner-only-write
  findings cured with regression tests, the required Windows CI leg added as a basic job so the
  PR reports the truth about native Windows on `windows-latest`, and the estate's legs review
  the whole. If the Windows leg is red, the lane's next cures are named by the run, not guessed.
- **Land only the POSIX-safe parts**: there are none to separate — the changeset's value IS the
  Windows partitioning; the POSIX behaviour is unchanged by construction (the tests prove parity).
- **Wait for upstream to reopen**: upstream said native Windows is off its list; waiting is the
  first option in slow motion.

## Movement 4 — synthesis and proposals

**The frame.** The changeset is upstream's, complete to its last review round, and ownerless;
the fork is the only line with a reason to land it (the owner's CI-leg ruling and the
merge-back). "Which should be merged" answers itself: upstream's head, because it is the
fork's snapshot plus everything learned after it; "preserve our enhancements" is already true
by inclusion. The real decision is whether the fork lands native Windows at all — the owner's
ruling says goal-not-vital, so the lane lands on its own evidence (green legs, the Windows CI
leg's first-hand verdict) and never on urgency.

**Proposals, each with a warrant and a falsifier.**

1. Land upstream #891's head into `engraph` by one merge in a feature lane
   (`feat/native-windows-support-2026-09-10`), curing the two owner-only-write findings and
   adding the basic Windows CI leg; close #123 as superseded. Warrant: observations 1, 2, 4, 7,
   8. Falsifier: the merge yields more than the four previewed conflicts, or the estate's own
   gates go red on POSIX after the merge.
2. The Windows CI leg is a job, not yet a required check: the owner makes it required in the
   ruleset once it is green (an owner-held repository setting). Warrant: observation 8 ("so it
   honestly stays green"). Falsifier: the leg is red on the first run for reasons outside the
   changeset (runner tooling), which routes to the cross-platform plan node, not this lane.
3. The two security findings are cured before any review leg: the write goes to a fresh
   owner-only file created exclusively in the destination's directory and renamed over it (a
   planted symlink is replaced, never followed); on Windows the module states what `fchmod`
   cannot do and refuses to retain authenticated output unless the caller proves a private
   destination. Warrant: observation 5. Falsifier: a test that plants a symlink at the
   destination and sees its target truncated.
4. Matt's review is answered on the fork's PR by pointing at the cure commit and the mixed-case
   regression, so the fork's landing premises record that the upstream block was cured, not
   ignored. Falsifier: `CorePack_Home` surviving the scrub on win32 in the test.
5. At the October merge-back the fork's delta carries the changeset to upstream, where the
   branch already lives; the merge-back's semantic sweep names it. Falsifier: upstream reopens
   #891 independently before then (then the fork's copy is the one with the cures).

**Sizing.** One lane, one merge commit plus two or three cure commits, one CI job, three review
legs; a day of a capable seat, of which the merge and cures are done in this context.

**Addendum (2026-09-10 16:5xZ) — the actual sequence.** When the sizing above was written the
merge was STAGED and the cure module written, neither committed: the first merge commit was
refused by the gate (one line-cap lint error in a merged test helper), which the napkin of the
time recorded. The lane's commits now exist on `feat/native-windows-support-2026-09-10`: the
merge SHA:6d89538bf (second parent SHA:a57b89418), the two cures with their tests
SHA:8eefe7045, the advisory `windows-basic` leg SHA:f3c0b3778, and the sync of `engraph`
SHA:fbb0c51cc. "Done in this context" above described intent ahead of the landed state.
Proposal 3's Windows clause ("refuses … unless the caller proves a private destination") is
NOT the implemented contract: the lane's cure refuses on win32 unconditionally, before any
file is touched, with no caller waiver (the carrier node's criterion 4); the clause stands
here as the earlier alternative only.
