# Why a warning with no file name took three days and a three-minute scan

**Date**: 2026-11-15. **Author**: Hydra holds Lightyear (d827c5), the seat whose investigation this
was, at the owner's word after the arc closed ("run the retro please", 2026-11-15 16:50Z).
**Arc**: the SonarCloud warning "Architecture analysis executed with errors", from the owner's
instruction on 2026-11-12 at 11:33Z to the cure's merge on 2026-11-15 at 10:35Z as `b03d8ddb2`
(pull request 420). **Modes**: metacognition (retrospective) and reason.

The short answer the record reaches: of the 68 hours 33 minutes from request to cause, 60 hours 32
minutes were two stretches with no session activity. The investigation itself ran for about two
and a quarter hours before the seat first offered the local scan that found the cause. The seat's earlier
accounts of this arc told a larger story than that, and this record corrects them.

## Review contract

- **Purpose and intended impact.** To say where the elapsed time of this investigation went, and
  what, if anything, the seat should have done differently. The record proposes no doctrine.
- **What a review should test.** Whether each instant and figure follows from the source named
  beside it, and whether each statement about cause is no stronger than that evidence.
- **Evidence standard and authority boundary.** A reader can re-read the pull requests and the
  check-runs on their commits. The session transcript, the scan log and SonarCloud's task history
  are not tracked, and a reader cannot test what this record takes from them. Those are: every
  timeline row whose source is "transcript" or "scan log", the words in quotation marks, the
  tool-call times, the boundaries of the two idle stretches, the file counts, and the statement
  that the analysis of 10:43Z carried no warning. Each is the author's reading of its own session.
  Where the record gives a reason for an act, it says whether the reason was written down at the
  time.
- **Non-goals.** The record applies nothing, edits no rule or skill, and authorises no act. It
  makes no finding about the owner's choices.
- **A successful review.** One that reports a figure that does not follow from its source, or a
  causal statement stronger than its evidence. Evidence the record cannot supply because its source
  is not tracked is reported as a limit of the record. A mismatch between this contract and the
  record is reported as a finding against the record.

## Timeline

Instants are UTC. "PR 406" rows come from `gh pr view 406 --json commits` and from the
"SonarCloud Code Analysis" check-run on each commit
(`gh api repos/EngraphCode/open-curriculum-ecosystem/commits/<sha>/check-runs`). "Transcript" rows
are message and tool-call times in the session transcript. "Scan log" is the local scanner's log.

| When (UTC)     | Event                                                                                                                                                                     | Source                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 11-12 11:33    | The owner asks for the investigation.                                                                                                                                     | transcript               |
| 11-12 11:42:33 | Probe 1 is committed: bisection by exclusion on a draft pull request, one SonarCloud analysis per probe.                                                                  | PR 406, `c4d9523f8`      |
| 11-12 11:45    | First status. It cites two community threads in which a scanner log names the graph file that failed to load, and says the project's automatic analysis shows no log.     | transcript; links below  |
| 11-12 12:40    | The owner asks for a pause after the running batch.                                                                                                                       | transcript               |
| 11-12 12:56:09 | Probe 20's analysis completes.                                                                                                                                            | PR 406, `1950851ba`      |
| 11-12 12:58    | The seat reports two groups carry the warning (62 and 185 files), says the fault is "something the files don't visibly share", and recommends about fourteen more probes. | transcript               |
| 11-12 13:00    | The owner asks for two studies of the groups. At 13:04 the seat reports no cause and repeats its recommendation of six targeted probes.                                   | transcript               |
| 11-12 13:04:40 | Last session activity of the day.                                                                                                                                         | transcript               |
| 11-13 12:02    | The owner asks for the six targeted probes. They narrow the groups to 34 and 128 files; the seat recommends six more.                                                     | transcript; PR 406       |
| 11-13 12:25    | The owner asks for a study of what is unusual in the suspect files, with no more probes. The seat finds nothing that separates them.                                      | transcript               |
| 11-13 12:44    | The seat first offers a local scanner run, as one of two options beside five more probes.                                                                                 | transcript               |
| 11-13 12:49    | The owner runs the SonarQube integration command, which signs the Sonar command-line tool in.                                                                             | transcript               |
| 11-13 14:00    | The owner: "Yes, run the sonar checks locally to see the issue, but not until we have resolved the rest".                                                                 | transcript               |
| 11-13 18:17    | The owner: "Are you ready to run the local sonar scan, if so please do so".                                                                                               | transcript               |
| 11-13 18:26:54 | The seat issues the scan command in the background. At 18:27 it reports "The local scan is running now".                                                                  | transcript               |
| 11-13 18:27:12 | Last session activity until 11-15 08:01:10.                                                                                                                               | transcript               |
| 11-15 08:00    | The scan writes its first log line.                                                                                                                                       | scan log; reply of 08:01 |
| 11-15 08:03    | The scan ends: "Analysis total time: 2:52.523 min". Two "Skipping load of file" lines name two files.                                                                     | scan log                 |
| 11-15 08:06    | The seat reports the cause, with an eight-file reproduction launched at 08:04:33.                                                                                         | transcript               |
| 11-15 10:35:48 | The cure merges.                                                                                                                                                          | pull request 420         |

The two threads cited at 11:45:
<https://community.sonarsource.com/t/net-analysis-always-has-warning-architecture-analysis-executed-with-errors/181651>
and
<https://community.sonarsource.com/t/new-architecture-step-in-sonar-analysis-skipping-load-fail-and-raised-error-null/149252>.

## Where the time went

From the request (11-12 11:33) to the report of the cause (11-15 08:06) is 68 hours 33 minutes.

| Segment                                             | From, to                         | Length  |
| --------------------------------------------------- | -------------------------------- | ------- |
| Probes and studies, day one                         | 11-12 11:33 to 13:04:40          | 1h 32m  |
| No session activity                                 | 11-12 13:04:40 to 11-13 12:02:30 | 22h 58m |
| Probes and study, to the first offer of a local run | 11-13 12:02:30 to 12:44          | 0h 41m  |
| Offer to launch                                     | 11-13 12:44 to 18:26:54          | 5h 43m  |
| No session activity                                 | 11-13 18:27:12 to 11-15 08:01:10 | 37h 34m |
| Reading the log and reproducing                     | 11-15 08:01:10 to 08:06          | 0h 5m   |

The lengths are rounded to the minute and sum to 68 hours 33 minutes. The two idle stretches are
60 hours 32 minutes. The session was active for about 2 hours 13 minutes before the first offer of
a local run.

**The probes.** Twenty-six, each one SonarCloud analysis. Measured from a batch's first commit to
its last analysis completing: 73 minutes 36 seconds for probes 1 to 20 (11:42:33 to 12:56:09) and
18 minutes 59 seconds for probes 21 to 26 (12:02:53 to 12:21:52), 92 minutes 35 seconds together.
Each result is one yes or no. Twenty probes took the suspect set from 4,597 files to 247 (62 plus
185); six more took it to 162 (34 plus 128, the 128 being 16, 3, 10, 37, 10 and 52 across six
directories). The file counts are the seat's, from its replies of 11-12 12:58 and 11-13 12:22.

**The local run.** Three parts were measured. The sign-in: the owner's command at 12:49 and the
seat's first working call at 12:57, a span that also holds a session restart. The setup: tool calls at
18:26:21 (scanner check), 18:26:41 (fresh clone and throwaway project) and 18:26:54 (launch). The
scan: 2 minutes 52 seconds by its own total. Not measured: the time to work out how to run a scan
against a throwaway project, which happened inside the session between 12:44 and 18:26, and the
project's deletion afterwards.

**The wait after launch.** The scan command was issued at 18:26:54 and the log's first line is at
08:00 two days later. The cause is not known. The seat's guess at 08:01 was a permission prompt or
a sleeping machine; it was not tested. Two observations bear on it: the session shows no activity
from 18:27:12 to 08:01:10, and the first log line falls one minute before the owner's next
message. A second launch of the same scanner, on the reproduction, was issued at 08:04:33 and had
finished by 08:05:06.

## What the cause was

In the local run, Architecture Analysis 3.8.0.13073 logged "Skipping load of file" for the graph
files of two source files, with `IllegalStateException: Value Attribute not found for key function
Object() { [native code] }`. One file passed `'__proto__'` as a call argument; the other passed
`'constructor'` and `'toString'`. In the eight-file reproduction, each of those three literals as
a call argument produced the same line; the same string in a `return`, and an ordinary string as
an argument, did not. Other names were not tried. After pull request 420 removed the literals from
call arguments, the analysis of the main branch at 2026-11-15 10:43Z carried no warning, by
SonarCloud's task history as the seat read it in the session.

The trigger is visible in the source. A text search for those literals as call arguments would
find both files. No such search was run, because nothing suggested the hypothesis before the log
did.

## What the record shows, and what it does not

**The technical root.** An analyser fault, and a warning that names no file. Under automatic
analysis the scanner log is not shown to the project's users.

**The local run was not put forward in the first two and a quarter hours of work.** At 11:45 on the first day
the seat knew that a scanner log names the failing file. It first offered a local run at 11-13
12:44, after 26 probes. Nothing written before then shows the seat weighing a local run or
estimating what one would cost. Three readings fit that: the seat did not think of it; it thought
the arrangement costly; it set it aside because it needed the owner's organisation and token. The
formation letter the seat wrote on 2026-11-15 gives the second and third as its reasons, but that
is recollection after the fact. This record cannot tell the three apart.

**Read against the Direct Trial Gate.** The gate in the `reason` skill prefers "the smallest real
end-to-end execution", then "a proxy probe", then "static analysis". It also says: "A proxy earns
precedence only when it is materially cheaper than the real trial **and** can change the decision,
or when the real trial cannot yet be safely contained." The local run needed a new project in the
owner's SonarCloud organisation and a token in the owner's keychain, and it wrote to SonarCloud;
on a plain reading it was outside the seat's authority and not yet contained, so the gate allowed
the probes to go first. (The probes also ran in SonarCloud, through the automatic analysis the
owner had already set up.) What the gate asks and the seat did not do is the estimate: "If
cumulative inquiry reaches the estimated cost or elapsed time of the direct trial, it has already
lost its warrant: RUN, STOP, or ESCALATE immediately." With no estimate of the trial, that
sentence had nothing to compare the probes with.

**The bisection was narrowing, and the seat said so each time.** It recommended more probes at
11-12 12:58, at 13:04 and at 11-13 12:22. The owner asked for studies of the suspect files at
11-12 13:00 and 11-13 12:25, and the seat ran them. The seat's estimate at 12:58 of fourteen more
probes to reach single files was not tested as designed; the six that ran took 247 files to 162.
This record makes no finding here.

**A launch was reported as a run.** At 18:27, seconds after issuing the command, the seat wrote
that the scan "is running now". It had read no output. Whether reading the first output would have
shown the wait depends on the wait's cause, which is not known. The session then had no activity
for 37 hours 34 minutes, so nobody was present to act on a report either way.

**From the offer to the launch.** After the offer at 12:44 the owner signed the tool in at 12:49,
chose the local run at 14:00 to follow other work, and released it at 18:17. The seat launched at
18:26:54. This record states the times and makes no finding.

## The seat's earlier accounts, corrected

The first draft of this report is commit `200a7bede` on the pull request's branch (pull request
426), which the merge keeps in history; this section says what it claimed and what replaces it. That
draft, with the seat's closeout record and formation letter of 2026-11-15, said that days of analysis found nothing, that the seat knew within twelve minutes what would end
the search, and that it avoided the local run because the run needed asking. The evidence supports
less:

- The search ran for about two and a quarter hours of session time before the local run was
  offered. Most of
  the elapsed time was two idle stretches.
- At minute 12 the seat knew that a scanner log names the file. That a local run against a
  throwaway project would produce that log, and how to run one, was worked out on the second day.
- Why the local run was not raised sooner is not established.
- An earlier draft said the seat never told the owner that the bisection should continue. It did,
  three times.

## The counterfactual

The one segment of the arc that ran differently is the local run itself: once launched and
running, it named both files in 2 minutes 52 seconds, against 92 minutes 35 seconds of probes that
had narrowed 4,597 files to 162. Had the seat put a local run forward in its first status, the
cause might have been reached on the first day. That needs four things this record cannot show:
that the owner would have agreed then, that the sign-in would have followed, that the seat could
have worked out the recipe as quickly on day one, and that the launch would not have waited as the
first one did.

## Honest credit

- The bisection's two groups contained both files. That, with the log showing two skipped files
  and no others, is why the seat could say at 08:06 that the two were the whole set.
- The studies found unrelated defects: stale `bin` includes in `logger` and four other workspaces,
  and redundant bundler externals in `logger`. Pull requests 421 and 422 removed them.
- Reading the fallback chain that held one of the literals exposed a design fault the owner then
  named: a value that is not an `Error` can reach the logger as an error. It is ticketed as MCP-880.
- The session worked out how to run a local SonarCloud scan against a throwaway project.

## Observations

One arc is one instance, and the mechanism behind the main delay is not established, so this
record proposes nothing. It records two observations. Their lane is the fast one: the napkin, by
way of the seat's closeout record, which the continuity commit that carries that record lifts.

1. **Observation: estimate the direct trial in the first status** (the napkin). When a tool's own
   log would name the fault and the tool can be run where the log is visible, the first status
   names that run and a rough price for it, even when it needs the owner's word. **Warrant**:
   n = 1; in this arc the estimate was absent and the run was first offered after 26 probes.
   **What would show it wrong**: a seat names the run and its price in a first status, and the
   investigation is no shorter for it; or a second arc shows the delay had another cause.
   **Expected effect**: the direct trial is put forward before a second batch of proxy probes.
2. **Observation: a background launch is reported as launched until its first output is read**
   (the napkin). An instance of `verify-dont-trust`. **Warrant**: n = 1; "running now" was written
   with no output read. **What would show it wrong**: a later launch is reported only after its
   first output is read and still stalls unseen; the lesson is then about watching a run.
   **Expected effect**: a stalled launch is seen within the turn that launched it.

## The local scan, as the session ran it

Kept here so that it is tracked. These are the session's commands on macOS, copied from the
transcript and not re-run for this record.

```bash
# In a fresh clone with no node_modules. The token is the Sonar command-line tool's keychain entry.
SONAR_TOKEN=$(security find-generic-password -s sonarqube-cli -a sonarcloud.io -w) \
  npx --yes @sonar/scan@5.1.0 \
  -Dsonar.host.url=https://sonarcloud.io -Dsonar.organization=<organisation> \
  -Dsonar.projectKey=<throwaway project key> -Dsonar.sources=. -Dsonar.scm.disabled=true \
  -Dsonar.verbose=true -Dsonar.working.directory=<directory>
```

The throwaway project was created beforehand through `/api/projects/create` and deleted afterwards
through `/api/projects/delete`, both with `sonar api post`. The log line to search for is
`Skipping load of file`.

## What this record cannot see

The transcript before 2026-11-13 reached the author through two summaries before the author
re-read the file for this record. The instants and quoted words above come from the file. Reasons
are a different matter: the record has only what was written at the time, and for the main delay
nothing was. No free-play pass was run.

## Success test

The retrospective skill asks that a record change a decision or name a mechanism. This one names
no mechanism. It changes a decision: the lesson the seat had written for the napkin ("ask for the
trial's authority first", stated as the cause of a three-day delay) is withdrawn and replaced by
the two observations above, and a proposal the first draft made for the Direct Trial Gate is
dropped as resting on one instance and an unestablished cause.
