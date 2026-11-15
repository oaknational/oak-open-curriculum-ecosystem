# Why a warning with no file name took three days and a three-minute scan

**Date**: 2026-11-15. **Author**: Hydra holds Lightyear (d827c5), the seat whose investigation this
was, at the owner's word after the arc closed. **Arc**: the SonarCloud warning "Architecture
analysis executed with errors", from the owner's instruction on 2026-11-12 at 11:33Z to the cure's
landing on 2026-11-15 at 10:35Z as `b03d8ddb2` (pull request 420). **Modes**: metacognition
(retrospective) and reason throughout. **Status of the arc**: landed; the main-branch analysis of
2026-11-15 at 10:43Z reported no warning. Every instant and count below is read from the pull
requests, the scan log and the session transcript at writing time, never from memory.

The owner's word, 2026-11-15 at 16:50Z, after the closeout report offered it: "run the retro
please".

## Review contract

- **Purpose and intended impact.** To say why this investigation took 68 hours when the act that
  ended it took minutes, so that one sentence can be proposed for the Direct Trial Gate in the
  `reason` skill.
- **What a review should test.** Whether each instant and count follows from the source named
  beside it; whether each layer of the causal stack is supported by the timeline; whether each
  proposal has a warrant and a condition that would show it wrong.
- **Evidence standard and authority boundary.** The pull requests on GitHub are the only sources a
  reader can re-read. The session transcript and the scan log are not tracked; what this record
  takes from them is quoted, with its instant or line number, and is the author's reading of its
  own session. The reasons given for the seat's acts are reconstruction and are marked as such in
  "What this record cannot see".
- **Non-goals.** The record applies no proposal, edits no rule or skill, and authorises no act.
  It does not assess the owner's choices; where the owner's ordering cost time, it states the
  time and makes no finding.
- **A successful review.** One that reports a figure that does not follow from its source, a
  causal claim the timeline does not carry, or a proposal without a real falsifier. Evidence the
  record cannot supply because its source is not tracked is reported as a limit of the record.

## Timeline, from primary sources

Instants are UTC. Commit times are from pull request 406's commit list; owner and seat messages are
from the session transcript; scan times are from the scan log's file time and its own total.

| When (UTC)  | Event                                                                                                                                                                                              | Evidence                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 11-12 11:33 | The owner asks for the investigation.                                                                                                                                                              | transcript                              |
| 11-12 11:42 | The seat begins bisecting by exclusion on a draft pull request, one SonarCloud analysis per probe.                                                                                                 | `c4d9523f8`, probe 1                    |
| 11-12 11:45 | First status. The seat cites two community threads in which the **scanner log** names the graph file that failed to load. The project is on automatic analysis, which shows no scanner log.          | transcript; the two links in that reply |
| 11-12 12:40 | The owner asks for a pause after the running batch, to review.                                                                                                                                     | transcript                              |
| 11-12 12:53 | Probe 20. The warning is confined to two groups: `logger` with `sentry-node` (62 files), and one slice of `agent-tools/src` (185 files). The seat recommends about fourteen more probes, 50 minutes. | `1950851ba`; reply of 12:58             |
| 11-12 13:00 | The owner asks for a study of the two groups for runtime dependencies, then for old or deprecated usage. The seat finds config oddities in `logger` and no cause.                                  | transcript, 13:00, 13:03, 13:04         |
| 11-13 12:02 | The owner asks for the six targeted probes. They narrow to `logger` alone (34 files) and six `agent-tools` directories (128 files).                                                                | probes 21 to 26; reply of 12:22         |
| 11-13 12:25 | The owner asks for a scan of the suspect files for what is unusual, with no more probes. The seat finds nothing that separates them.                                                               | transcript, 12:25 and 12:44             |
| 11-13 12:44 | **The seat first offers a local scanner run**, as one of two options beside five more probes.                                                                                                      | transcript, 12:44 to 12:57              |
| 11-13 14:00 | The owner chooses it: "Yes, run the sonar checks locally to see the issue, but not until we have resolved the rest".                                                                               | transcript                              |
| 11-13 18:17 | The rest is resolved. The owner: "Are you ready to run the local sonar scan, if so please do so".                                                                                                  | transcript                              |
| 11-13 18:27 | The seat reports "The local scan is running now, in the background".                                                                                                                               | transcript                              |
| 11-15 08:00 | The scan writes its first log line. The seat reports at 08:01 that it "only actually started at 08:00 this morning".                                                                               | transcript; scan log                    |
| 11-15 08:03 | The scan ends: "Analysis total time: 2:52.523 min". Two "Skipping load of file" lines name the two files.                                                                                          | scan log, lines 82708, 90120, 103098    |
| 11-15 08:06 | The seat reports the cause, with a minimal reproduction.                                                                                                                                           | transcript; reproduction log of 08:04   |
| 11-15 10:35 | The cure merges, after three owner corrections to its shape.                                                                                                                                       | pull request 420                        |

Durations, computed from the table:

- Request to cause: 68 hours 33 minutes. Request to merged cure: 71 hours 2 minutes.
- The direct trial's price from nothing: at most 21 minutes. That is at most 8 minutes for the
  Sonar command-line tool's sign-in, which put the token in the keychain (11-13 12:49 to 12:57,
  a span that also holds a session restart); at most 10 minutes of setup (18:17 to 18:27); and 2
  minutes 52 seconds of scan. On the day, the sign-in was already done when the trial began.
- Launched but not running: 37 hours 33 minutes (11-13 18:27 to 11-15 08:00).
- Request to the first mention of a local run: 25 hours 11 minutes, to the reply of 11-13 12:44.
  "First" is by a search of the seat's replies in the transcript for a local or scanner run; the
  11:45 status mentions scanner logs and no run.
- Probes: 26, each a SonarCloud analysis of a pull request. Twenty were committed over 71 minutes on
  the first day and six over 16 minutes on the second; these are spans between commits, and no
  analysis start or end time was recorded.

How to recompute the probe figures. The probe branch is deleted; the closed pull request keeps its
commits. `gh pr view 406 --json commits` lists 26 commits, each headed "chore(sonar): probe N for
the architecture warning [skip ci]", N from 1 to 26, with these commit times:

| Batch         | First commit              | Last commit               | Span       |
| ------------- | ------------------------- | ------------------------- | ---------- |
| Probes 1-20   | `c4d9523f8`, 11-12 11:42Z | `1950851ba`, 11-12 12:53Z | 71 minutes |
| Probes 21-26  | `4968daefb`, 11-13 12:02Z | `547d7f465`, 11-13 12:18Z | 16 minutes |

The spans run from a batch's first commit to its last, so each leaves out the last probe's own
analysis. The file counts (4,597, 247, 34 and 128) are the seat's, quoted from its replies of
11-12 12:58Z and 11-13 12:22Z in the session transcript, which is not tracked: 62 and 185 files in
the two groups after probe 20, and 34 and 16, 3, 10, 37, 10 and 52 after probe 26. The scan log
and the transcript are not tracked either; the lines this record relies on are quoted in the
timeline.

## What the cause was

SonarQube Architecture Analysis 3.8.0.13073 cannot load the graph file of a TypeScript file that
passes `'constructor'`, `'__proto__'` or `'toString'` as a call argument. Two files did so. The code
was correct. The trigger is visible in the source: three particular words in one syntactic
position. A search for it finds it at once, given the hypothesis. The studies the seat ran had no
such hypothesis: they compared the suspect groups (247 files, then 162) with the clean files on
structure, syntax features, imports and configuration, and none of those comparisons separates
files by the value of a string argument.

## The causal stack

**Technical root.** An analyser fault, and a warning that names no file. Under automatic analysis
the scanner log, which does name the file, is not shown to anyone.

**Process root 1: the evidence was gathered in the reverse of the estate's preferred order.** The
`reason` skill's Direct Trial Gate ranks evidence: the smallest real end-to-end execution, then a
proxy probe, then static analysis. This arc ran proxy probes first (bisection by exclusion), then
static analysis (three studies of the suspect files), and the real execution last. The seat knew at
11:45 on the first day that a scanner log names the failing file: its first status cites the
threads that show it. It did not name a local run as an option until 25 hours later.

**Why was that possible?** The local run failed one of the gate's preconditions: it was not within
the seat's current authority. It needed a new project in the owner's SonarCloud organisation and the
token in the owner's keychain. The gate says a missing approval never becomes permission, and it
says to run, stop or escalate once inquiry has cost as much as the trial would. The seat did
neither of the two things that follow. It never estimated the trial's cost, so the threshold could
not fire. It did not ask for the authority. It began the proxy that needed no asking.

**Process root 2: a converging proxy was traded for studies that were not converging, and the seat
did not say so.** The bisection was working. Twenty probes took 4,597 files to 247, and both true
files lay inside the two groups; the seat estimated fourteen more probes and 50 minutes to reach
single files, an estimate that was never tested. The owner twice paused the probes and asked for a study of the files (11-12 13:00 and
11-13 12:25). Those were reasonable questions from someone who could not see what the seat knew.
The seat answered them and reported that reading the code named no cause. It did not give the
verdict it held: that comparing the groups without a hypothesis had found nothing three times,
that the fault was "something the files don't visibly share" (its own words at 12:58), and that
an instrument which narrows with each run should go first. This record does not claim that static
study could never have found the cause; reading two isolated files might have.

**Process root 3: a launch was reported as a run.** At 18:27 the seat wrote that the scan "is
running now". The scan wrote nothing until 08:00 two days later. The seat did not read a first log
line before reporting. Why the process waited is not known; the seat's guess at 08:01 was a
permission prompt or a sleeping machine, and that guess was never tested.

**Process root 4: the chosen trial queued behind unrelated work.** From the owner's choice at 14:00
to the launch at 18:27 the session settled plugin and editor configuration. That order was the
owner's, stated in the choice. It cost 4 hours 27 minutes of the arc and is recorded here as a
price, with no finding against it.

**Meta root.** An act that needs the owner's permission was treated as more expensive than an act
that does not, without either being priced. The probe lane cost 26 analyses, committed across at
least 87 minutes, and was free to start. The local run cost at most 21 minutes, sign-in included, and
one question. The seat compared "start now" with "ask first" where it should have compared one run with
26 analyses. The two times are measured differently (commit spans against a scan's own total), so
the comparison is of order only. The estate already has the words for the
trial (the Direct Trial Gate). It does not have a line for the case where the trial is cheap and
only authority is missing, and that is the layer where the next "why" leaves the estate's control.

## The counterfactual test

The strongest counterfactual is inside the arc. The cured segment is the local run: at most 21 minutes
from nothing, of which 2 minutes 52 seconds were the scan, and both files named on the first pass, with a reproduction
logged one minute later. Had the seat asked for it in the 11:45 status on the first day, and had
the owner agreed at once, the cause was reachable within the hour, the trial's 21 minutes included:
against 68 hours 33 minutes.

A second counterfactual needs no local run. Had the bisection continued at 12:58 on the first day,
the seat's own estimate put single files 50 minutes away. The method would then have needed a
reading of two short files to see what they share; whether the seat would have seen three string
literals as the common factor is not known.

The uncured cost per unit: the probes were committed one every three to four minutes (19 intervals
in 71 minutes, 5 in 16), each for one bit of information. The cured cost:
one run for the whole answer.

## Honest credit

- The bisection was correct. Its two groups contained both files, and that agreement is why the
  seat could say at 08:06 that the log's two files were the whole set.
- The static studies found real, unrelated defects: stale `bin` includes in `logger` and four other
  workspaces, and redundant bundler externals in `logger`. Pull requests 421 and 422 removed them.
- Reading the fallback chain that held one of the literals exposed a design fault the owner then
  named: a value that is not an `Error` can reach the logger as an error. It is ticketed as MCP-880.
- The session now holds a tested recipe for a local SonarCloud scan with a throwaway project, and
  knows that the Sonar command-line tool reads the architecture graph.

None of this needed three days. The first two items were by-products of looking in the wrong place.

## Proposals, each with warrant, falsifier and lane

1. **Ask for the trial's authority first** (fast lane, operational). The Direct Trial Gate in
   `.agent/skills/cognition/reason/SKILL-CANONICAL.md` gains one sentence: where the direct trial
   meets every precondition except authority, the first act is to ask for that authority, stating
   the trial's price and what it will observe; a proxy may run while the answer is awaited, and its
   running cost is compared with the trial's price at each report. **Warrant**: this arc; the trial
   was known at minute 12, priced at no more than 21 minutes once somebody priced it, and asked for at hour 25.
   **Falsifier**: the next three investigations that meet this case ask first and the owner
   declines each time (the sentence only adds a question); or a seat asks, runs the trial, and the
   trial does not answer (the lesson was particular to this tool). **Prediction**: the next
   unlocated tool warning in this estate reaches its cause in the session it is raised.
   **Carrier**: the next doctrine pull request; the owner has the proposal in this session's report.
2. **A launch is reported as launched until its first output is read** (fast lane, the napkin; no
   new doctrine proposed). The claim is that reading one line of output before reporting would
   have caught the stall. It is an instance of `verify-dont-trust` and `silence-is-never-liveness`,
   and one instance is an observation. **Warrant**: 37 hours 33 minutes behind the words "running
   now". **Falsifier**: the cause of the stall, once known, is one that a first-output read at
   launch would not have caught (for example the process wrote its first lines and then
   waited); the lesson would then be about watching a run, not about reporting a launch.
   **Lane**: the napkin, through the seat's closeout record.
3. **Say when a requested study is not narrowing the search** (fast lane, the napkin; no new doctrine
   proposed). The claim is that had the seat said the comparisons it was running were not narrowing the
   search,
   the bisection or the local run would have started sooner. It is an instance of
   `present-verdicts-not-menus`: the seat answered two requests for static study without that
   statement, and at 12:44 on the second day offered two options where it held a preference.
   **Warrant**: the two pauses at 11-12 13:00 and 11-13 12:25 and the replies to them.
   **Falsifier**: the owner, reading this record, says the studies were wanted for their own sake
   and would have been asked for whatever the seat said; the pauses would then be the owner's
   informed choice and no lesson for the seat. **Lane**: the napkin, through the seat's closeout
   record.
4. **Keep the local scan recipe where the next seat finds it** (fast lane, operational). The
   recipe lives in the seat's closeout record, which is not tracked. Its home is
   `.agent/rules/sonarqube-mcp-instructions.md` or the engineering documentation beside the
   SonarQube setup: the scanner command with `sonar.verbose=true`, the throwaway project's creation
   and deletion, and the two log strings to search for. **Warrant**: the recipe took up to 10 minutes to
   assemble the first time and would take the same again from nothing. **Falsifier**: the next
   seat to meet an unlocated Sonar warning has the recipe and still does not reach the scanner log
   in its first session (the recipe was not what was missing). **Carrier**: unassigned; the owner
   has it in this session's report.

## What this record cannot see

The transcript before 2026-11-13 reached the author through two summaries; the instants and quoted
words above were read from the transcript file itself, but the author's reasons at each point are
reconstructed from what was written, and a reason that was never written is absent. The formation
letter of the same date tells this arc as a story and says the seat stayed away from the local run
because of the arrangement it needed. This record sharpens that: the arrangement was at most 10
minutes of setup after a sign-in, 21 minutes in all, and what was missing was a question to the owner.

No free-play pass was run.

## Success test

The record names a mechanism the estate had no line for: a cheap direct trial that fails only the
authority precondition is silently ranked last. Proposal 1 is routed to a named surface with a
prediction. If no doctrine pull request takes it, this record is a eulogy.
