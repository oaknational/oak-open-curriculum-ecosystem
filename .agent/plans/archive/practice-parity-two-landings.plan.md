---
id: practice-parity-two-landings
node_type: delivery
name: Practice parity in two landings — one pull request per estate for the doctrine, one for the code
overview: >-
  Finish the alignment of the two Practice instances as two landings per estate: the doctrine
  as one pull request applied from the ledger's recorded readings, the code carries as one pull
  request of tested modules; proved by the dry-run merge conflicting only where a host-binding
  row of the ledger says it should.
status: archived
ratified_by: null
ratified_date: null
ratified_where: null
serves: best-of-each-practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-05
---

# Practice parity in two landings

**Disposition (2026-10-05): archived as a sketch**, never ratified; its shape (one pull request per estate for the doctrine, one for the code) was taken into `practice-alignment-by-class` §Mechanism and delivered there (321 and #353, then 322 and #354).

**Standing of this node, the owner's word of 2026-10-03 20:4xZ: an unratified and questionable
sketch, not to be implemented.** It is kept as a perspective once held and held no longer: it
still took "the Practice" to be the six measured directories and alignment to be bytes, when the
Practice is one system of planning, implementing, reviewing and delivering value across two
estates, with a general layer, a contextual layer, what it accumulates in a context, and the
learning loop between them, and no ratified definition of it exists. The review node
`practice-system-review` replaces this perspective and is the parity node's named successor; this
node stays a sketch, implemented by nothing, at the owner's word.

Written to supersede `practice-parity-for-extraction`, whose §Size closes with where the work
stood at 2026-10-03 20:0xZ; that node's named successor is now `practice-system-review`, and this
sketch supersedes nothing. The owner's words that bound this sketch when it was written: the
alignment of the two instances is how we learn what the Practice is; the carries, code included,
are the work; finish by doing it.

## Goal

Both repositories hold the same Practice doctrine and capabilities: every shared file under the
six Practice-wide prefixes (`.agent/directives/`, `.agent/rules/`, `.agent/skills/`,
`.agent/practice-core/`, `.agent/sub-agents/`, `.agent/hooks/`) is the same bytes, or differs
only in hunks the ledger names as host bindings (its §(f), P1 to P29); every capability one
estate held and the other lacked runs in both, or is declared host-local with its reason.

## User groups and value

- The owner: one proof to read (the dry-run's residue equals the parameter list), two pull
  requests per estate to see merged, and the extraction's first input, the parameter list, in
  hand.
- Seats in either estate: the same rules, skills, directives, reviewer templates and commands,
  so a lesson learned in one stops recurring in the other.

## Mechanism

Why two landings: the ledger already records a reading for every difference (209 hunk rows, 72
clean merges, 105 one-sided files, 28 carries, the 13 owner rows decided). What remains is
applying recorded readings, which is a build. The cost of landing is the fixed cost of a pull
request, measured today at 30 to 60 minutes of wall-clock each whatever its size, so the unit of
landing is the estate, never the file or the surface. The content risk is textual and the proof
is mechanical (`cmp`, the dry-run merge, the validators), so one review per estate is review
enough.

1. **The doctrine landing, one branch per estate cut from its default tip.** The lanes already
   authored today merge into it first (jimcresswell.net: 318, the specification family; the hooks
   surface at `SHA:c6262b00`; OCE: #349 with its last cure `SHA:fe05f463a`, the directives surface
   at `SHA:1d77e8b03`, the sub-agents surface in its lane). Then, file by file over the ledger's
   rows, each row's recorded reading is applied to the receiver's own file: same meaning takes the
   text the row names (the sibling's, this estate's, or the three-way merge); host binding keeps
   each estate's own hunk; the capability gaps are the queued carries, their one-sided files copied
   byte for byte with the adapter prefix and registration bindings; host-local files stay. A
   conflicted file's clean regions are read while the file is read whole; nothing is taken from
   them unread, and no row is written for them. `portability:fix`, `skills:generate` and the
   documentation validators run green on the branch. One push, Copilot once, one settlement push,
   merge through the bot.
2. **The code landing, one branch per receiving estate.** jimcresswell.net receives C3, C17, C23,
   C25 with C19, C26, C22 with C5 and C6, and C28; OCE receives C19 and C27 (from the J2
   worktree's staged files). Each module is copied with its tests and wired (scripts, knip, the
   README rows); the receiver's test suite and `check` pass; the generalisation trailer names each
   element received. One push, Copilot once, one settlement push, merge.
3. **The records, once.** After both landings the ledger takes one closing revision: the count
   line landed of total and the residue as the parameter list, nothing else; the strategic node's
   §Delivery takes the finish line. No other revision, no closer feature and no tool row rides
   this node.

The Director merges, with one read per branch: `cmp` of the shared set between the two estates'
branches, the dry-run merge at the two tips, the validators' runs. Implementers push; nobody twins
by hand; nobody waits on a landing line to proceed.

## Acceptance criteria (each with a proof)

1. Doctrine aligned. Proof, `repo-safe`: `dry_run_merge.py` at the two default tips after the
   doctrine landings reports zero clean-merge files and conflicts only in files whose hunks are
   host-binding rows of the ledger; `cmp` over every other shared file under the six prefixes
   reads identical.
2. Capabilities aligned. Proof, `repo-safe`: every carry row C1 to C28 reads landed with its
   demonstration named, or host-local with its reason; `pnpm check` green in both estates at the
   landed tips.
3. The records closed. Proof, `repo-safe`: the ledger's closing count line reads N of N at the
   tips it names, the same bytes in both estates; this node archived.

## Size

The doctrine landing: jimcresswell.net about two and a half hours of authoring (rules, skills and
Practice Core applied from the rows), OCE about one and a half (its three lanes merged in, the
twins of those three surfaces applied from the same rows), then one review cycle each, about an
hour. The code landing: about two hours per receiving estate, tests and the review cycle included.
About six seat-hours, about four hours of wall-clock with one implementer per estate and the
Director merging. The owner's guide is the bound: a landing that would take a second settlement
push stops and reports the reason instead of pushing; an estimate that passes twice the guide is
a stop to reshape, never a re-size.

## Out of scope

More ledger revisions before the closing one; closer features; the tool rows T1 to T5 (ordinary
backlog after the finish); per-file rows for clean regions; the extraction's design; the OCE
product work.

## Todos

1. The jimcresswell.net implementer: the doctrine branch with 318 and the hooks surface merged in;
   rules, skills and Practice Core applied from the rows; validators green; pushed. Then the code
   branch.
2. The OCE implementer: the doctrine branch with #349, the directives and the sub-agents lanes
   merged in; the twins of rules, skills and Practice Core applied from the same rows; validators
   green; pushed. Then the code branch.
3. The Director: 312 and #350 merged as they stand, their five findings decided in one comment
   each (the two rules rows read at the rerun keep their place, their numbering noted); the four
   landing branches read by `cmp` and the dry-run and merged; the closing revision; this node
   archived.

## Where the first node went wrong, and what would have prevented it

Written at the owner's ask for the next plan, not for blame.

- **The unit of work was the hunk times the pull-request lifecycle.** 209 recorded readings
  became about twenty pull requests, each with a bot push through the full gate, Copilot, a
  two-push settlement, a landing line, an absorption acknowledgement and the Director's
  first-hand read. The content work was minutes per surface; the lifecycle was 30 to 60 minutes
  per pull request; the fifteen-hour estimate was the lifecycle count. Prevention: before work
  starts, count the pull requests the plan implies and treat that count as the cost; when the
  owner's guide is a number of hours, design the pull-request count to fit it (the owner's rule of
  2026-10-02, "budgets mean fewer PRs", applied at planning time, never first at review time).
- **Twinning by a second seat doubled every landing.** One producer writing both files once, with
  `cmp` as the proof, costs nothing extra. Prevention: when two outputs must be the same bytes,
  one producer and a comparison, never two authors.
- **The Director was a serial gate and spent its day on the instrument.** Every merge waited on
  a first-hand read; the Director's own hours went to the ledger's revision, its strict closer and
  the settlement of their review findings, none of which moved a file toward parity. The memory
  naming this pattern (records carry no review risk, landing diffs does) existed before today and
  the pattern repeated; a Cricket named the drift at 14:00 and was discounted. Prevention: the
  Director's day is measured in merges; a report is sunk at authoring and takes no revision unless
  a decision depends on it; review findings on a report are rows in the next closing revision,
  never a push; a DRIFTING verdict changes the next hour or is answered in writing with the reason.
- **The finish line was unreachable as written.** "Zero conflict hunks" cannot hold for shared
  text that carries host facts; the ledger's own parameter list was the residue all along.
  Prevention: write the finish as a measurement whose residue is named before the first landing.
- **Estimates were re-sized instead of the shape being questioned.** The owner said two hours as
  a guide and that four means a problem; the plan re-sized to fifteen seat-hours and then to a
  second day, each time with reasons. Prevention: the rule now in §Size, an estimate past twice
  the guide is a stop to reshape.
- **Coordination overhead and outages compounded the shape.** Three seats exchanging long events,
  two compaction pauses with cold restarts, and a five-and-a-half-hour quota gap in which nothing
  moved. Prevention: fewer seats working continuously (the owner's word of the morning), short
  landing lines, and work that proceeds without a seat's attention (a pushed branch under review
  needs nobody awake).

## Plan-body first-principles check

- Shape: every proof is a repository state a reader recomputes (the dry-run's numbers, `cmp`, the
  validators, the test suites).
- Frame: the serious counterframe, the per-surface shape with fewer review rounds, was set aside
  because its cost is the pull-request count, which it does not reduce.
- Proportionality: no new instrument, no new rows, and no reviewer pass before this node (the
  owner ratified the shape in words and asked for simplicity; the review this node would have had
  is the section above).
- Reversibility: each landing is one pull request on a default branch; a declined row is one hunk
  reverted.
- Landing path: `.agent/plans/delivery/`, the same bytes in both estates.
- Parallax at screening depth: the charter is the alignment finished at the owner's guide; the
  counterframe is named above; the decision is two landings per estate; the world-return contract
  is the dry-run's residue at the landed tips compared with the ledger's §(f), and a residue larger
  than the parameter list is read as rows before the closing revision, never landed again.
