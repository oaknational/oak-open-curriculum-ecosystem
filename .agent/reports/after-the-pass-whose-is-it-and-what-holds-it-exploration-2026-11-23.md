# After the pass: whose is it, and what holds it

Written by Petrel mends Pinnacle (ea9cea) on 2026-11-23 at the owner's word, before the day's
third compaction. The owner asked for the cognition passes and a wrap, with the work to continue
afterwards. This covers the hours after the second compaction: the fold of 1073, the three
closing pull requests of the dependency pass, the token finding, and the change to the open
limit. The earlier report of the same day is
`dependency-pass-limits-and-far-end-checks-exploration-2026-11-23.md`.

Every proposal here goes to the owner by question prompt. None waits in this file.

## What the reflection changed

- **A list of things owed to the owner, kept in a status message, has no clock.** Five proposals
  written before the second compaction stayed unasked through the fold and the three closing
  pull requests. The owner ended that, verbatim: "Let's make decisions now, otherwise we risk
  them being lost". Seven answers then took two prompts. At this boundary five more observations sat
  in the same record with no decision. The change: a matter only the owner can decide is asked
  by question prompt at the first wait after it is found, and a status message carries no list
  of things that could have been asked.
- **An approved item that reverses direction is a new matter.** The owner approved a raise of
  `@opentelemetry/api`. The seat found the raise could not be taken and merged a hold. It said so
  in two status messages, inside longer reports. The owner asked "why is the open telemetry work
  held?" only after a prompt mentioned it. The change: a reversal is reported alone, in its own
  short message, when it is found and before its pull request opens.
- **Zero is not a reading of a counter.** See the parallax section.
- **Prose about a tool written straight after building it is written from intent.** The setup
  section of 1096 carried three statements the code does not make (two authors always counted;
  every command refused by an old build; a done line on a refusal). A reviewer found all three.
  The change: each sentence that states behaviour is read against the code or a test as it is
  written.

## Free play: the harvest

Material: the day's events after the second compaction. No question was set.

Seeds, each an association and not a finding:

1. The token finding and the open-limit defect looked shaped alike. Each check asked about the
   container (any token of the Clerk instance; any pull request in the repository) where the
   party was meant (a token for this server; a pull request by this clone's authors). The
   morning's label ruling and the Sonar link pointing at the fork looked the same shape. Kept,
   and carried into the exploration below.
2. A bound that the bounded party can step over reminded me of advice: the package manager
   installing API 1.10 past a peer range, and a seat passing 30 past a limit. Kept as the
   exploration's second thread.
3. The owner answered every prompt within minutes and asked about a matter that two paragraphs
   had already reported. This reminded me of the earlier ruling that questions go through
   prompts. Kept as a napkin line.
4. Asked which bot to list, the owner answered first: "I am expecting this config to be outside
   of version control. It should be." The question had not said where the logins would be kept.
   Kept as a napkin line.

Discarded at the second look:

- The `latest` tag of `@opentelemetry/sdk-trace-base` is 2.12.0 while `core` is at 3.1.1. Read
  against the live question (when the hold lifts), it changes nothing. Documented and no more.
- The watcher's thirty-minute expiry as a kind of limit. Forced.
- A reviewer marking a draft "needs a closer look" for results not yet posted. A reader of a
  moving target, and no more.

## Concept exploration

### 1. The raw observations

- The owner, on labels: "ONLY for items opened by my bots, not on any checkout that happens to
  use the merge bot, other people use this repo and its tools".
- The owner, on the limit: "we can pass an array of identities to count as "our" PR authors",
  then "the default should be the default git identity that git commands would use".
- The tool, asked to open one pull request at a limit of one: "19 lane pull requests are open".
- The security review: any valid OAuth token of the Clerk instance passes, whatever it was
  issued for. The owner: "The user has to be a real user on our Clerk project".
- The checkout's Sonar link named the fork's organisation. Its preview server entry named a
  branch of the reunification.
- The seat's own record of the limit ruling counted the coordination draft. Asked, the owner
  excluded it.
- A range of `^1.9.1` held the API at 1.9.1 only because the lockfile said so. A code comment
  held the token's resource binding only because it said so.

### 2. The problem space

Two problems, not one.

**Whose.** This checkout's tools and records were built while its repository had one tenant.
"Ours" was written as "everything in the container". On 2026-11-18 the checkout became a
checkout of a shared repository. Nothing failed: each check widened without a sign. It harms
colleagues (their pull requests labelled, counted, or put in scope of a zero target), the owner
(a limit that limits nothing), and users (a token accepted for a server it was not issued for).
Success: every operation that selects "ours" names the party, per clone, and prints what it
selected.

**What holds it.** A property was kept by something that cannot refuse: a derived lockfile, a
comment, a number the caller chooses, a list in a chat message. Each read as held until someone
looked. Success: the property lives where its absence is refused or shown.

### 3. Reflection on solutions

The fluent first answer was a sweep of the tools for whole-repository queries. Reading one
candidate first-hand changed it: the `pr-lifecycle` skill's operating step still tells a seat to
count with `gh pr list --state open` over the whole repository, two sentences below the
paragraph 1095 corrected. So the residue is in prose that instructs agents as well as in code.
A sweep of code alone would have missed the one instance already found.

The second fluent answer was a new rule for "a property held by something that cannot refuse".
The estate already has it in parts: `lockfile-rebuild-survivability` says it for dependency
bounds, and `verify-dont-trust` says a gate never seen failing is not verified. Four instances
in one day from one seat are one seat's day. No rule is proposed.

### 4. Synthesis and proposals

| Proposal | Warrant | What would show it wrong |
| --- | --- | --- |
| Correct the `pr-lifecycle` count step to count the clone's own authors | Read first-hand: the step lists every open pull request | The owner wants the step to stay a whole-repository count |
| One bounded sweep (an hour) of `agent-tools` and the skills for operations and instructions that select "ours" by container | Four instances since 18 November: label, limit, Sonar link, the count step | The sweep finds none beyond those four |
| A question to the owner that concerns a personal identifier says where it will be stored | One instance: the owner answered that before the question asked | The owner says the context was plain |
| No new rule for properties held by something that cannot refuse | Existing rules cover each instance seen | A fifth instance in a domain no rule covers |

Unresolved evidence: which accounts the owner meant by "the two bots" (one is listed; the seat
did not infer the second). Whether any colleague's checkout now counts nothing because its git
name is a display name; the description of 1095 says how that shows.

## Reason: what was decided

- **The open observations are asked, not listed.** Five from before the second compaction, plus
  the production check owed on 1094, go to the owner by prompt during the first merge wait after
  these records are pushed. The alternative was to finish the queued tool changes first; a
  compaction could arrive before the queue empties, and the owner has said what waiting risks.
- **The waiting-line change is built, not planned.** It is a two-way door on agent tooling, and
  the tool already computes the names.
- **The count step is its own small pull request**, ahead of the waiting line, because it
  corrects what 1095 left inconsistent.

## Parallax: core depth, one context

Execution mode: emulated in one context. The challenge below is a same-context self-review and
is not independent assurance.

**Question.** Is the open limit, as merged and configured, limiting this clone's work?

**Counterframe.** The count of every pull request was the intended reading: a team's limit.
Closed by the owner's earlier word, recorded in `pr-lifecycle`: "Count only my own".

**Challenge: dependent evidence read as corroboration.** Two pull requests were opened at a
limit of one and each printed "lanes already open: 0". Both were opened with no lane open. A
counter that matches nobody prints the same. The two readings agree with each other and
distinguish nothing. A probe was then run while 1096 was open: `open --branch main` at a limit
of one. It reached GitHub's refusal of an empty pull request, which means it counted zero; 1096
merged at 20:04:25Z, at about the moment the probe ran, so the probe does not say which came
first.

**What was read directly.** GitHub reports the author of 1096 and of 1091 as the bot's login
with its `[bot]` suffix, and the configured list holds that string. The counting rule is proved
by tests that include a refusal.

**Bridge claim.** From "the unit and front-door tests refuse at the limit" to "the configured
clone refuses at the limit". It rests on the login string matching, which was read, and on the
build in each worktree being the merged one, which was read. It has not been observed end to
end.

**A second question, on the token finding.** The owner's rating of low risk rests on the tools
being read-only over public content. The tool list registered in this session agrees. Not
checked: effects on the user a replayed token belongs to, such as usage recorded against them or
any limit counted per user.

**Status: provisional.** It permits opening at a limit of one. It forbids a statement that the
configured limit is verified.

**World-return contract.** While the next pull request of this estate is open and not about to
merge, run `merge-bot pull-request open --branch main --title probe --body-file <any non-empty
file> --wip-limit 1`. Expected: exit 3 and "lane pull requests open: 1". A 422 from GitHub
instead means the count was zero and the list matches nobody: stop opening at a limit of one and
read the logins again. Owner of the check: this seat.

**The return, the same evening.** With pull request 1097 open as a draft, the probe answered
"refused: lane pull requests open: 1" and named both listed authors. The bridge claim is now
observed end to end. Status of the first question: validated, for the list as configured on that
day. A change to the list reopens it.

**Learning signal.** Observation: two pass-case readings were taken as verification of a
counter. Expected against observed: the seat wrote the guard into the tool (the printed count)
and still read zero as confirmation. Recurrence hypothesis: any counter introduced while its
count is zero. Destination: the napkin; the existing rule already covers it.
