# The dependency pass at a compaction: limits, waits and far-end checks

Written on 23 November 2026 by the seat Petrel mends Pinnacle (ea9cea), at the owner's
word, before a compaction. The owner named the instruments: metacognition, free play,
concept exploration, reason and Parallax. This report holds what they produced. It changes
no behaviour. Every proposal in it is for the owner; none is started, because the owner
stopped all new work until this estate's open pull requests are at zero.

The session's state is in the thread record `open-pull-requests-to-zero`. This report holds
the thinking, which the thread record points to.

## The day in four lines

- Eleven pull requests merged in about four hours: five dependency updates, the sign-off
  rubric, two Sentry changes, a colleague seat's record taken over, a tool change, an action
  pin refresh.
- The seat reached seven open pull requests of its own. The owner asked "we now have 6 open
  PRs, is that correct?", then ruled: "We are supposed to work to a WIP limit, and for good
  reason, open the seventh PR, but then all further new work stops until we are down to zero
  open PRs or I say otherwise".
- SonarCloud, a required check, stopped reporting for about 45 minutes. Three open pull
  requests stalled together. The seat noticed only when the owner asked for a review of
  state.
- The owner corrected two more things: the primary checkout had been left 85 commits
  behind with the owner's own change uncommitted, and the fleet label was to be automatic
  for the owner's bots only.

## Free play: the harvest

Material: the day's events and corrections. No question was set. Each item is an
association, not a finding.

Kept:

1. A reviewer's sentence about the Sentry change, "this checks the SDK's resolved options,
   but it does not exercise an integration or compare captured payloads", **reminded me of**
   the number 30 passed to `--wip-limit`. In both, a declaration was satisfied and the
   effect it stands for was not looked at. The same shape **looked alike** in five more
   places that day: a plugin enabled in settings and not installed; a Sonar analysis that
   succeeded and a check that never arrived; a preview check that passed while the changed
   code never ran on the preview; a deny list that filters spans and not events; a config
   field one build of a tool knew and another refused.
2. The merge tool's quiet window and the wait for the owner's go-ahead **reminded me of**
   clearing down in a kitchen. I filled each wait by starting something. The work that was
   waiting to be closed (ledger rows, leftover branches, records) grew meanwhile.
3. Rereading the owner's first instruction slowly: "Once the dependency updates are in I
   would like to stop the maintenance work". The pass had no stated end that I had checked
   with the owner, and it kept growing: a rubric, a cookie fix, a tool change, a settings
   pull request.

Discarded, visibly:

- Two merges four seconds apart at 12:04, and SonarCloud's gap beginning then. Forced: the
  check for the last analysed pull request had already failed to arrive at 12:03:42, before
  either merge. What is true and smaller: at 11:16 two close merges did produce one failed
  Sonar report for the default branch ("a newer report has already been processed").
- "Every question the owner asks is a correction." Forced: "are the GitHub actions also up
  to date?" was a plain question with a plain answer. What stays: a question about how many
  are open was an alarm, and I answered it with a table.
- The label config living per clone while the build lives per worktree, as an analogy to
  cache expiry. The analogy adds nothing; the fact is already in the merge bot's
  documentation.

Routing: seed 1 has a shape and goes to the exploration below. Seeds 2 and 3 feed it. The
napkin carries each as a play seed.

## Concept exploration: how this seat sizes and sequences a maintenance pass

### 1. The raw observations

- The seat's private note from 18 November already said to hold one open pull request at a
  time. The first compaction's summary carried forward "use 30 for the limit" as a tooling
  fact and dropped why the flag exists.
- The tool counts every lane pull request in the repository, colleagues' included, so on
  this repository the number a seat must pass is about twenty before its own first one.
- Pull requests waiting for the owner's go-ahead were told to the owner in prose. No
  question was put until the owner had already imposed the stop.
- Four of my own claims in pull request descriptions or commit messages were wrong and were
  found by a reviewer: "all ten" defaults were empty arrays (nine were); "production-
  reachable" (true of the package, not of the two patched code paths); "either of which
  closes it" (the second layer missed spans); a category "off" (not a promise about the
  event). All four were written during the stretch with five or more open.
- What I caught myself at the far end: the combined lockfile update moving more than its
  parts, and the build tool's input explosion. In both a rule made me read the far end (the
  lockfile diff line by line; the gate's failing test).
- The Sonar stall was visible for forty minutes as a merge tool that said "checks running"
  while every reported check was green. The tool computes which required check is
  unreported and does not print it.
- The hook that blocks discarding work stopped me pulling the primary checkout. I reported
  the block to the owner three times. I had not read the diff that blocked it. It was the
  owner's deliberate change, and a pull request was the route.

### 2. The problem space

Kind: a sequencing problem in a shared, serial pipeline, with one decision-maker whose
attention is the scarcest input.

The gap: the seat measured progress by what it had started. The pipeline, the reviewers
and the owner bear the cost of what is unfinished.

What an open pull request draws on: the owner's attention (each is something to hold, and
class C ones need a decision); the checks, previews and review rounds; the default branch
(every merge moves the base, and lockfile changes queue behind each other); external
services (one outage stalled three at once); and the seat's own accuracy, on the evidence
of the four wrong claims.

The unit, on the owner's words: every open pull request of this estate's bots. The owner's
count of six included two drafts held for a go-ahead and the coordination draft.

Success: at most one lane pull request of this seat's open at any time unless the owner
says otherwise; nothing waiting on the owner without a question in front of the owner; a
pass that has an end the owner has agreed.

### 3. Reflection on solutions

The fluent first answer is "be more careful", which is the passive guidance that had
already failed: the note existed and was not consulted at the moment of opening.

The second fluent answer is "change the tool", and it needs its warrant checked: a tool
change is itself maintenance, in a pass the owner wants to end. It is still the structural
cure, because the flag cannot mean what its name says while the count includes other
people's work.

The inherited shape that changed: I had treated "small, bounded pull requests" and "many
at once" as the same virtue. They are separate. Small is about what a reviewer reads.
One at a time is about what is unfinished. A pass can keep both by grouping changes whose
proof is the same suite, and by landing each before the next opens.

A second inherited shape that changed: a wait is not free time. It is when the closing
work is done.

### 4. Synthesis and proposals

A declared setting is a claim. The defects of this day were found where someone read the
far end: the payload, the check on the commit, the label on the pull request, the request
that reaches the changed code. Where a rule made me read the far end I found the defect
myself; where none did, someone else found it.

Proposals, each for the owner to accept, change or refuse:

| Proposal | Warrant | What would show it wrong |
| --- | --- | --- |
| The merge tool's open verb counts the lane pull requests its own clone's bot authored, and the seat passes 1 | The flag was passed as 30 for a day and limited nothing; the tool already knows its app's name | The owner wants colleagues' work counted, or a number other than one |
| The merge tool's poll line names the required checks the tip has not reported | Forty minutes passed before the stalled check was identified; the tool already computes the list | A second stall that is noticed at once without it |
| When a class C pull request is ready, the go-ahead is asked by a question prompt, and nothing new starts until it is answered | Two drafts waited while four more were opened | The owner prefers to be told and to answer when convenient |
| A pass states its end before it starts, agreed with the owner | This pass grew by four pieces of work that were not dependency updates | The owner wants the list worked to exhaustion |
| The Sonar tooling of this checkout is linked to the Oak project | The local command and the Sonar connector both resolve to the fork's project | The link is found to be per-user and correct for the owner |

Unresolved evidence: no measurement of what the breach cost beyond the four wrong claims
and the shared stall. Throughput was high. Whether the owner would accept fewer, larger
pull requests grouped by risk tier in place of strictly serial small ones is not known.

## Reason: what was decided

- **The Sonar investigation is stopped.** The live decision was push again, wait, or ask
  for the check to be waived. The observation that decides it arrived: a push at 12:45 was
  analysed and reported at 12:48. So the two stalled pull requests are pushed again and no
  more is investigated.
- **Nothing the repository changed caused the gap.** The analysis is SonarCloud's automatic
  one: it runs no build and installs no dependency. Its one config file did not change
  today. The gap covered the default branch too (no analysis of three merges after 11:26)
  and ended with no change from this side. One pull request's analysis succeeded at 12:03
  and its check was never delivered.
- **A local analysis cannot stand in.** The local command scans for secrets only; code
  analysis is not available on this connection, and the checkout's files are linked to a
  project in another organisation.
- **After zero, one question to the owner**, with a recommendation: take the Clerk clients
  (class C), the OpenTelemetry API and `@vercel/functions` (class B) as three pull
  requests in turn, then end the pass and put the rest on the dependency ticket. The
  alternatives are to end the pass at zero, or to work the whole list.

## Parallax: core depth, one context

`execution_context.mode: emulated-reduced`. No sibling skill was invoked and no second
context looked; the challenge below is a same-context self-review and is not independent
assurance. Identifiers are provisional: inquiry `oce-maintenance-pass-2026-11-23`,
revision 1.

Core depth was chosen because the question is consequential for how the seat works and
cheap to reverse; deeper operation would cost more than the first observation after the
compaction will.

- **Purpose and authority.** How this seat sizes and sequences maintenance on a shared
  repository. The decision owner is the repository owner. Non-goal: redesigning the merge
  tool.
- **Frames.** Owner attention: unfinished work is a load on one person. Pipeline: checks,
  reviews and one external service serve all open work at once. Continuity: seven states
  across a compaction is seven things to lose.
- **Counterframe.** The breach was a discipline failure and a tool change is more
  maintenance; the note already existed. This is serious and partly right. Both hold: the
  note failed because nothing fired at the moment of opening, and the tool's count is where
  such a check lives.
- **Scales.** Observed: one seat, one day. Mechanism: the seat's loop and the tool's count.
  Consequence: the owner, the pipeline, colleagues who share it.
- **Bridge claim.** From "this seat breached the limit while passing 30" to "the tool's
  count makes the limit unusable for any seat here". Mechanism: the count includes about
  twenty pull requests by others. Evidence: one seat, one day, plus the owner's ruling
  of 18 November that only the seat's own count. Uncertainty: no second seat observed.
  Fails if other seats hold the limit without difficulty.
- **Challenge.** A cheaper action dominates further analysis: hold one open and observe.
  The four wrong claims are the same author judging its own errors; a reviewer found each,
  so the count is a floor.
- **Status: provisional.** It permits the seat to hold one lane pull request open and to
  put the proposals to the owner. It forbids treating any proposal as accepted.
- **Return to the world.** After the compaction, at each open: the count of this estate's
  open pull requests, read from GitHub, is zero lane pull requests before a new one opens.
  A second open while one stands is a breach and reopens this inquiry. The owner's answer
  on the unit or the number supersedes this revision.
- **Learning signal for the Practice.** Observation: a limit passed to a tool as a number
  large enough to pass. Expected: the flag limits the seat's work. Observed: it counts the
  repository. Affected: the merge tool's open verb and the lifecycle skill's wording.
  Recurrence: likely for any seat on a repository shared with others. Destination: the
  napkin, then the owner's decision on the first proposal.
