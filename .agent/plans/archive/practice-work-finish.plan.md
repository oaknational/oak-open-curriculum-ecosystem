---
id: practice-work-finish
node_type: delivery
name: The Practice work's finish — five end states, one day
overview: >-
  Bring the Practice work in both repositories to a measurable end: the
  knowledge safe, nothing outside a default branch, the extraction's input
  written, the test census counted, and the product work in OCE begun.
status: superseded
superseded_by: practice-parity-for-extraction
ratified_by: null
ratified_date: null
ratified_where: null
serves: best-of-each-practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-02
---

# The Practice work's finish — five end states, one day

The owner's words of 2026-10-02, verbatim: "We need to get the Practice work complete so we can
plan the extraction, and we need to get into a position where development work on OCE makes
sense." Then: "NOTHING is blocked on me, NOTHING should be worked on without clear completion
criteria, sizing, and an unambiguous and provable statement of how it provides ratified value."
Then: "ALL of this work is bounded, ALL of it must have a known, reachable, measurable end state,
and ALL of it must be finished soon."

This node is that end state. It replaces the open-ended reading of "complete" (every exchange row
landed by hand, every measured difference driven to zero, every capability carried both ways) with
five states a reader can verify in a minute each, sized from the day's measured rate, and finished
within one day of its authoring. The repositories are JC.net (this one) and OCE, the owner's two
Practice-bearing repositories.

## Goal

In plain terms, when this node is done:

1. Every lesson found in the notebooks and records this week is written into the rules, skills
   and plans that seats read, in both repositories, as the same words; the notebooks that were
   read hold no unprocessed knowledge and are moved to the archive; the counters that track
   unhomed knowledge read zero.
2. Nothing of the Practice exists only on one machine or on a side branch: every branch of the
   consolidation is merged or deleted, both repositories' daily coordination branches are folded
   into their default branches, and the one unfinished port (three documentation validators
   carried from this repository into OCE) is either landed as one pull request or removed with a
   record saying why.
3. One report, identical in both repositories, lists every artefact of the Practice (rules,
   skills, directives, decision records, reviewer templates, the hook policy, the agent tooling by
   topic, the schemas), says which scope it belongs to under PDR-143 (Practice-wide,
   language-wide, repository-local or host), and says whether the two repositories' copies are the
   same bytes. The exchange register closes at a known count against it. This report is the input
   the extraction plan needs.
4. A census lists every test, helper or setup file in the agent tooling of both repositories that
   touches the filesystem, a process, the network or the clock. This is the size of the conversion
   the owner asked for; the conversion itself is its own node.
5. In OCE, the first product capability's plan node exists with its own criteria, size and value,
   and its first pull request is open the moment the consolidation's last OCE slice merges.

## User groups and value

- The owner: a finish line that can be read, not a programme; attention goes to the extraction
  plan and the product, never to reconciling copies. Value line: the owner's words above, and the
  standing word of 2026-10-01 ("we are here to make sure that knowledge is preserved, discoverable
  and accessible").
- Seats in both repositories: doctrine that is true where it is read, and one answer to one
  question in either repository (the ratified outcome of `best-of-each-practice`).
- The extraction's planner, the next bounded task: a complete inventory with scope classes and
  byte-sameness, so the plan slices from data rather than from a recount.

## Mechanism

- End state 1 finishes the second two-estate consolidation as its record counts it: the remaining
  slices land one at a time under the limit of one open pull request per repository, each as the
  same bytes in both, each pull request body naming the write-list items it lands (the proof that
  the value is the ratified one and not activity). The notebooks move to the archive only after
  the write list reads zero open items, with the one phrase the privacy directive keeps out of
  version control omitted from the archived copy.
- End state 2 is the ratified word that work is not safe until merged. The fold of this
  repository's coordination branch does not need its primary checkout's index: the pull request
  merges remote-side as the bot, the successor branch is cut in a linked worktree, and the dirty
  records in the primary are committed from a linked worktree copy. The port is sized by one
  bounded run (what fails here, listed), then landed as one pull request or removed; a size above
  one pull request of about ten files means removal, with its validators carried as rows in the
  report of end state 3.
- End state 3 substitutes an inventory for a programme. PDR-143 predicts that the entity's
  install makes the shared paths zero-diff structurally; paying for that by hand, one twin lane
  at a time, is the open tail the owner named. The report is generated from both trees (the
  divergence measure already exists as a script in the consolidation retrospective) and
  classified by directory default under PDR-143 §1 with hand overrides where §2's membership test
  says otherwise. The exchange register's rows that are neither landed nor declined close into it
  as difference rows, so the exchange ends at a known count rather than being recounted upward.
- End state 4 runs the census the no-IO node already defines, in both repositories, as the sizing
  act for the conversion the owner asked for on 2026-10-01.
- End state 5 is the ratified programme's own first target (`reliable-atoms-programme`:
  BinaryTreeIndices with its admission and outcome prerequisites; the composed BinaryHeap as the
  first endpoint) under the adoption profile as the contract; the implementer authors the node
  between the doors of the slices, since a plan node lands in a records commit and takes no
  pull-request slot.

## Acceptance criteria (each with a proof)

1. The write list reads 0 open items, pending graduations read 0 in both repositories, the
   unconsolidated directory is empty and the archive commit names the processed files. Proof,
   `repo-safe`: the consolidation thread record's counts line and the archive commit; the
   directory listing.
2. No `docs/consolidation-2*` branch exists in either repository's lanes; both coordination
   branches are merged into their default branches; the port's pull request is merged or its
   removal line is on the stream with the record. Proof, `repo-safe`: `git branch --list` in both
   lanes; the fold merge commits on the default branches; the pull request state.
3. The report exists in both repositories as the same bytes, with one row per artefact carrying a
   scope class and a sameness flag, and the exchange register's count line reads N of N against
   it. Proof, `repo-safe`: the report's row count equals the artefact count from `git ls-files`
   over the Practice directories; `cmp` of the two copies; the register's line.
4. The census tables exist in both repositories with a row per offender and the four category
   counts. Proof, `repo-safe`: the tables, recomputed by the census script at their commit.
5. The product node exists under OCE's delivery plans with its acceptance criteria and todos, and
   its first pull request is open. Proof, `repo-safe`: the node file validated by the plan-corpus
   validator; the pull request number.

## Size and sequence (the Director's computation at authoring)

Measured on the authoring afternoon under one open pull request per repository: about 19 minutes
per landing in JC.net and 15 in OCE, review rounds included.

| End state | Remaining work | Size | Position |
| --- | --- | --- | --- |
| 1 | one JC.net slice; four OCE slices; the archive move; the notebook rotation | about two hours of door time, two records commits | first, both repositories, now |
| 2 | the port's sizing run; the two folds; one pull request or a removal | half an hour, two ceremonies, at most one pull request | after 1's slices; the folds at the rollover |
| 3 | the generator run, the classification pass, the register close | about four hours, one seat, one pull request per repository | JC.net's seat after 1 |
| 4 | the census in both repositories | about one hour per repository, one records commit each | with 3 |
| 5 | the product node; its first pull request | about one hour; then per the node | OCE's seat between doors, then the slot |
| 1 and 2 | the first-batch skills residue found by the omnibus branch's content proof: six skill and tooling files in OCE, two in JC.net (the other four already carry their lessons on main in later words), two records passages, one directive passage | one pull request per repository (six files in OCE, two in JC.net), one records commit, one directive edit per repository under the context floor | after 1's slices, before the inventory |

Finish: every row done within one day of authoring; the Director reports the counts at each
cadence and stops the seat when all five hold.

## Out of scope

Removed from the queue, each with its verb under the owner's triage taxonomy: new twin lanes for
individual capabilities (the second estate's copies of the retire port and of pull request 309,
the GitHub-port seam, the test-shape items) are carried as difference rows in the report of end
state 3 and sequenced into the extraction plan, never opened here; a defect that breaks a gate
today is fixed as a bug under the standing word, not as a lane. The security lane named in OCE's
continuity record is not worked: it has no criteria, size or value line on record, and is deleted
from the queue until all three exist. The ten stale owner-decision items in OCE's continuity
record are retired by the triage taxonomy in the next records commit, each with its reason. The
conversion of the smoke suites to no-IO tests is its own node, sized by end state 4. The
extraction plan is the next bounded task, taking end state 3 as its input; PDR-143's ratification
is asked for then and gates nothing here.

## Todos

Sliced at pickup by the implementers; each slice a single-story pull request within its round
budget.

1. JC.net seat: land the last slice; recount the exchange register at the current heads and
   compute the port delta; close the open rows into the report; run the generator and classify;
   run the census here; move the notebooks after the write list closes; rotate the notebook.
2. OCE seat: land the four slices with their cure scripts applied first; author the product node
   between doors; run the port's sizing; fold the coordination branch at the rollover; open the
   product lane's first pull request; run the census there.
3. Director: route, read each landing first-hand, report the counts at each cadence, fold this
   repository's coordination branch by the worktree route, retire the ten items with the OCE
   seat's records commit, write the handoff and stop at the fifth end state.

## Plan-body first-principles check

- **Shape.** Every proof tests a repository state a reader can recompute: a listing, a count, a
  commit, a validated file. None tests activity.
- **Frame.** The counterframe considered and set aside: "complete" as every measured difference
  at zero and every capability carried both ways by hand. Set aside because it has no stopping
  condition (the register was recounted upward three times in four days) and because PDR-143's
  prediction makes the same convergence structural at the install. Bridge claim: the report of
  end state 3 substitutes for the twin-lane programme on the assumption that the extraction is
  the next task; if the extraction is delayed past the next coordination-branch lifetime, the
  report's difference rows are the parity backlog with their sizes already known, so nothing is
  lost by the substitution.
- **Proportionality.** Scope narrowed from a programme to five end states; instrument re-tiered
  from twin lanes to a generated inventory; level corrected: the first product target and the
  stale owner items are decided by standing word and the triage taxonomy at the seats, never
  carded.
- **Reversibility.** Every landing is a pull request on a default branch; the report and the
  census are data in tracked files; the removal of the port keeps its branch's content in its
  record.
- **Landing path.** `.agent/plans/delivery/`, scanned by the plan-corpus validator as a
  `repo-validators:check` leg, the same bytes in both repositories.
