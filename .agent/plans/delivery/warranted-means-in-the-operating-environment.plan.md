---
id: warranted-means-in-the-operating-environment
node_type: delivery
name: "Warranted means in the operating environment"
overview: "Find out whether the git file monitor that blocked the estate's ceremonies is one instance or a class of unwarranted ambient means, by one bounded enumeration, and put the verdict to the owner."
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-09-20
ratified_where: "Owner card answer of 2026-09-20 ~13:35Z in the session of Dynamo turns Temper (2a4c8a): the card \"Which of these do you ratify now?\" with all four options selected, among them this node's; recorded in that seat's handoff record and on the pull request that carries this stamp"
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates:
  - awaiting: owner-decision
    clears_when: >-
      The owner answers the one card that mechanism step 3 puts after the enumeration's count
      exists: nothing further, or the environment contract and the warrant clause.
    expires: 2026-10-11
last_updated: 2026-09-20
---

# Warranted means in the operating environment

## Goal

The estate knows, from a count and not from one striking incident, whether the tools, settings
and working approaches its ceremonies depend on arrive with a warrant: the end served, the
difference measured where it runs, the conditions under which that holds, and what would remove
it. The one known instance cannot recur silently, and whether anything more is built is the
owner's decision on that count.

## The instance this starts from

Git's built-in file monitor was switched on in one clone's local configuration by an unknown
hand at an unknown time. Nothing recorded why. When linked worktrees with their own dependency
installs were introduced, three ceremonies slept for up to twelve minutes, one holding the index
lock, and each first read as a hook or a peer seat. A seven-minute measurement settled it: a
git client blocks for as long as a burst of file events lasts (9.8 seconds at 100,000 ignored
files, 24.5 seconds at 400,000), the same command with the monitor off never exceeded 0.15
seconds, and with no load the monitor saves nothing (0.04 to 0.11 seconds without it). During that
measurement a peer seat's read-only command on a different worktree of the same clone slept ten
minutes: the event backlog is the host's, so churn in one watched root blocks clients of every
other, which is the shape of the first day's twelve-minute sleeps. The tool
is sound; its fit here is nil. Friction F-195 and the 1.185.0 sync's findings ledger hold the
tables.

What the instance shows about evaluation, separately from the tool:

- **Adoption was invisible and evaluation had no trigger.** One machine-local line, outside
  version control, outside every review. The only trigger that fired was the third incident.
- **The benefit was inherited, never measured.** The monitor's reputation comes from trees two
  orders of magnitude larger. The claim "this helps here" had no consuming-path evidence, the
  same defect principles §Target-architecture wording names for prose.
- **The measurement had a validity envelope and the estate left it.** One worktree and one
  daemon worked for months. The topology changed (a worktree per lane, an install in each) and
  nothing asked which ambient assumptions that change broke.
- **The decisive measurement was the cheapest one and came last.** The work waited two days on
  "find the cause". The with-and-without difference, thirty seconds of reading, already forced
  the decision by reversibility; the causal probe explained it afterwards. Fit before cause,
  with-and-without before diagnosis, a dose-response before a single observation.
- **A tool has an off switch and an approach does not.** The monitor could be compared against
  itself in seconds. "A worktree and an install per lane" cannot; it is evaluated by a bounded
  trial against its stated end, by dose, and by the retrospective. Both are the same claim
  underneath: means M serves end E at cost C within envelope V, and both want a removal
  condition written at adoption.

The estate already owns the grammar. `validation-strategy.md` grades its own capabilities
baseline-relative with a with-and-without delta and says a green check proves only its own
path; the plan skill asks build-versus-buy before build-shape; `reason` puts the direct trial
first. None of these has jurisdiction over means that arrive by a configuration line, a
default or a habit. What is evaluated is the fit, never the tool: that keeps this inside
"we validate our own systems".

## User groups and value

- **Agents running ceremonies** (commit, fold, carrier): a ceremony that starts either runs or
  is refused at entry with the reason; it does not sleep on a socket holding a lock.
- **The owner and any contributor on any machine**: a long-lived clone carrying the setting is
  told so at the first ceremony, with the cure, instead of meeting it as an unexplained hang.
- **Whoever next proposes a tool or an approach**: a short form to fill and a cheap first
  measurement to run, instead of an argument from reputation.

## Mechanism

The instance's own cure is an operation and needs no node: the monitor is unset in the clone's
shared configuration, its daemons stopped, the reading recorded on F-195, and no per-call flag
remains in any recipe. This node holds what is left, sized by a second seat's reading of the
sketch (2026-09-19): one instance warrants one guard, and a mechanism waits for a second.

1. **Guard the instance where the harm lands.** The harm is a ceremony holding the index lock,
   and the configuration is shared by every linked worktree, so a check at worktree entry reads
   the same file as a check anywhere else. One assertion in the commit queue's existing guard
   step refuses when the effective file-monitor setting is on and names the cure; the
   worktree-lane skill's verification list gains the same line.
2. **Find out whether there is a class.** One enumeration, bounded to what a ceremony touches
   on the reference host and no further (past that bound it is a census): git configuration at
   every scope, shell profile entries the hooks inherit, package-manager settings,
   editor-written state inside the clone. Each row gets the four-part warrant (end, measured
   delta on the consuming path, envelope, removal condition) or a removal. Falsifier: if no
   second unwarranted means that a ceremony depends on is found, the instance stays an
   instance, the guard is the whole cure, and nothing more is written.
3. **Put the verdict to the owner, after the count exists.** One card: either nothing further,
   or, where a second means was found, two things. First, a declared environment contract (a
   pure function from an injected configuration map to a `Result`) replacing the single
   assertion. Second, one clause carrying the four-part warrant and the evaluation order (fit
   before cause; with-and-without first; dose-response; what was not varied) into the surfaces
   where adoption is already decided: the plan skill's build-versus-buy section and
   `validation-strategy.md`. A clause in an existing home, never a new rule or a register
   (`new-rule-vs-pdr-clause`). The clause is not drafted before the enumeration runs.

## Acceptance criteria (each with a proof)

1. A commit ceremony started with the file monitor effective is refused before it takes the
   index lock, with a message naming the cure. `repo-safe`: a unit test of the guard's
   assertion over an injected configuration value, in `agent-tools`.
2. Every enumerated means carries a four-part warrant or is removed, and the falsifier's result
   is stated. `repo-safe`: the enumeration report under `.agent/reports/`, one dispositioned
   row per means.
3. The owner's verdict is recorded where it was given and, where a clause or a contract is
   warranted, it stands in its named home. `repo-safe`: the landed text; `owner-held` for the
   word itself, recorded on the thread record.

## Out of scope

Evaluating dependencies (the dependency skills own that), third-party skills (their security
review owns that), and the estate's own agentic capabilities (`validation-strategy.md`).
Changing the worktree-per-lane topology: the monitor's removal dissolves the measured harm, and
the topology's own cost (disk, install time, host load) is an approach question this node only
names for the retrospective. Replacing git's monitor with another watcher: nothing here needs
one, and one is set up natively where a future need is measured.

## Todos

1. The guard assertion, its test, and the skill's verification line (one pull request, default
   round budget).
2. The enumeration report (one pull request, prose-class, default round budget).
3. The owner card and, at the owner's word, what it warrants (one pull request).

## First-principles check

Shape: three slices, each one story. Landing path: the front door for every tracked change. Vendor literal: git's configuration key names and the daemon's
stop command are read from the installed git's own documentation at pickup, never from this
node.
