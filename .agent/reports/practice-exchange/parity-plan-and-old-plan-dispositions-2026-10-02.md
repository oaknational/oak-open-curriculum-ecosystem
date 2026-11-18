# Plan: one node for the Practice parity work, and what the two old plan files carry that is not it

## Context

The owner's restatement (2026-10-02, 18:5xZ and 19:0xZ): the OCE product work is not part of
this; the goal is "both estates having equally capable Practices which we can then extract into
a separate entity which has yet to be designed"; PDRs carry decisions, not plans, and the
Practice should define what a PDR, an ADR and a plan carry; where directories mix concerns that
is a Practice design problem the extraction survey uncovered.

Three documents carry pieces of the plan today, none current to that restatement:

- `.agent/plans/delivery/practice-work-finish.plan.md` (both estates, coordination branches
  only): five end states written this afternoon, one of them the struck product work, and an
  out-of-scope clause that defers every capability carry to the extraction, which the owner's
  parity-first word reverses.
- `.agent/plans/delivery/practice-two-way-exchange.plan.md` (ratified 2026-09-14, amended by 45
  rulings): the carrying programme, its register closed 79 of 79 against the inventory on
  2026-10-02; most of its 659 lines are rulings, dispositions and a superseded finish order.
- `.agent/practice-core/decision-records/PDR-143-the-practice-as-a-standalone-entity.md`
  (Proposed, coordination branches only): the direction, the scopes and the membership tests
  (decisions), with mechanics and materialisation beside them (design, in the wrong place).

What the day measured: 3,555 Practice artefacts across the two default tips, 975 the same bytes,
794 different, 343 only in jimcresswell.net, 1,443 only in OCE; the exchange register's 47 rows
closed as "measured difference" (recorded, not carried); the survey's generator classes by
directory and omits the entry points, the install surface, the gates, the harness bindings and
every directory that mixes definitions with instances. Read first-hand at 19:2xZ: 298 (the
inventory) merged in jimcresswell.net at `SHA:a35b5f325`; no consolidation or port branch
remains on that remote; the exchange's Boxes are empty on both default tips and both provenance
chains carry its entries, so its formal close is done.

The ratified definition of done already exists and is reused, not rewritten: the strategic node
`best-of-each-practice` §Outcome. Two reviews shaped this draft (the assumptions expert on
proportionality and the docs expert on the records-versus-plans split); their accepted findings
are applied below, and the plan says where it declined one.

## The passes the owner asked for (what changed the shape)

- **Metacognition, retrospective.** Inherited: "finish = land the queued pull requests". The
  owner's first message said "a position where development work on OCE makes sense", which I
  inflated into a product end state. The owner's corrections today share one shape: work
  converted into meta-work (a bucket, end states, heartbeat ceremony). The cure: the node
  reuses the ratified Outcome, adds no criterion of its own beyond the one the owner directed
  (the records definition), and starts the carries at ratification rather than behind two
  instruments. The first draft had three instrument steps before the value step; the review
  named it and it is gone.
- **Reason.** The kind: a delivery lane in a complicated, measured system. The gap: the two
  Practices differ in capability in known places and in structure, so the entity cannot be
  designed from a parity state. The warrant under "equally capable": capability is measurable
  at the topic level (a rule's meaning, a command that runs, a gate that fires), not the byte
  level; the strategic node already names the instrument for text (a dry-run merge and its
  three numbers), so the ledger reads only what that instrument cannot settle. Falsifier: a
  rule present in both as different bytes that merges clean and still means two things; the
  merged-text reading of PDR-142 at each landing is the catch.
- **Concept exploration.** "Equally capable" decomposes into three: doctrine parity (every
  Practice-wide text present in both with one meaning, host names bound), tooling parity (every
  Practice capability runnable in both or declared host-local), structural parity (one directory
  contract and one set of entry points, so the install target is one shape). The strategic
  node's Outcome names the first two as observables; the third is the extraction design's first
  decision, and this node only leaves it the evidence.
- **Free play, harvested.** Kept: the rendered adapters' parity is already a check
  (`portability:check`), so it is a proof, never work. Kept: a capability's boundary is its
  import closure (the port crashed on three core exports), so each carry is sized by its
  closure. Discarded, visibly: "the heartbeat and gate sharing a file is the same class as the
  mixed directories" (forced; one is instance state against a tracked gate, the other is
  definitions beside instances).

## The new node (lands as the same bytes in both estates)

Path: `.agent/plans/delivery/practice-parity-for-extraction.plan.md`. Born sketch; the owner's
word ratifies it. In the same change `practice-work-finish` takes `status: superseded`,
`superseded_by: practice-parity-for-extraction`, and moves to the plans archive directory of
each repository (the precedent is `strategic/archive/practice.plan.md`), with its inbound
citations swept to plain text.

```markdown
---
id: practice-parity-for-extraction
node_type: delivery
name: Practice parity for extraction — two equally capable Practices, then the entity's inputs
overview: >-
  Bring the two Practice-bearing repositories to the ratified Outcome of best-of-each-practice,
  carrying every capability one holds and the other lacks, and leave the extraction's design
  its inputs: a survey of the whole Practice a reader can recompute, the parity ledger, and
  the structural findings as evidence.
status: sketch
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

# Practice parity for extraction

The owner's words, 2026-10-02, verbatim: "What we are currently working towards is both
estates having equally capable Practices which we can then extract into a separate entity
which has yet to be designed." And: "The OCE product work is not part of this, that is
something I handle later."

## Goal

Both repositories hold the same Practice capabilities, each demonstrated where it is held,
with every difference that remains declared host-local with its reason. The definition of done
is `best-of-each-practice` §Outcome, unchanged: a dry-run merge of the shared text changes no
file and conflicts nowhere; each judged standard has one observation every estate passes;
every offer has an answer and each adopted capability is demonstrated where adopted; the
removals judged are carried out.

## User groups and value

- The owner: one ledger to read instead of two trees to compare; the extraction designed once,
  from a stable input; no capability maintained twice.
- Seats in either repository: the same commands, gates, rules and skills, so a lesson learned
  in one stops recurring in the other.
- The entity's designer (the next task): the survey, the ledger and the structural evidence as
  inputs, none of them to be rebuilt.

## Mechanism

1. **The consolidation's tail lands and nothing stays outside a default branch.** The three
   OCE slices still to land (s, the first-batch skills leftover, y; q merged at 19:16Z as
   `SHA:d51669d2f`, read first-hand), the write-list table and
   the notebooks' move in jimcresswell.net (the node `write-list-residue-and-notebook-close`,
   which this node now governs), the two folds (each a merge of the default branch, never a
   rebase), the two omnibus branches deleted on the content script's zero.
2. **The carries begin at ratification.** A carry is one capability one repository holds and
   the other lacks, landed in the repository that lacks it as one pull request sized to its
   import closure, under one open Practice pull request per repository, and demonstrated where
   adopted (the command runs, the gate fires, the validator passes on that tree) before its row
   reads landed. Copied code names its debt to the package in its integrating commit (PDR-143
   §Context). The queue opens with the gaps already named, smallest closure first: the window
   registry rows (into OCE), the pr-watch content binding (into jimcresswell.net), the runbook
   index, the host-tagged amendment entries in PDR-008, PDR-082 and PDR-132 moved to a host
   record with the Core validator that refuses a host-named heading, the three documentation
   validators with their three core helpers (into OCE; the preservation commit in the port's
   worktree is its starting point, so the port is carried, not retired), and the skill-evals
   runner (into jimcresswell.net; the largest closure, last). The ledger extends this queue; it
   never gates it.
3. **The survey covers the whole Practice and recomputes from the tree.** A map edit to the
   inventory generator, no new instrument: the prefix list gains the entry points (`AGENTS.md`,
   `CLAUDE.md`, `GEMINI.md`, the Copilot instructions), `.agent/setup/`, `.agent/roles/`,
   `.agent/reference/`, `.agent/prompts/`, `.agent/evaluations/`,
   `.agent/claude-harness-integrations/`, the Practice's own index files, every subdirectory of
   the four adapter directories and the fifth adapter set `.agents/`, the husky gate scripts,
   the CI workflows, CODEOWNERS, the lint and dependency-rule configs, the root and tooling
   package scripts, and the tooling's configs and docs. Mixed directories (`memory`,
   `collaboration`, `state`, `plans`, `reports`) take a per-file rule, definitions in and
   instances out, stated in the report. The host-name regex becomes an explicit list the report
   prints. Rerun at the folded tips; the generator and the census script sit beside their
   reports in both repositories (298 already placed them there).
4. **The dry-run merge, then the ledger.** The strategic node's own instrument runs first: a
   dry-run merge of the shared text between the two default tips, reporting files a clean
   merge would change, conflict hunks, and files waiting (one-sided). The ledger then reads
   only what the merge cannot settle: each conflict hunk and each one-sided Practice-wide file
   takes one of four readings with its evidence, `same meaning` (host name or wording that
   carries the concept; PDR-142's merged-text reading), `host binding` (a parameter the entity
   will carry, named), `capability gap` (joins the carry queue as one capability row with the
   files in its closure and a size in pull requests), or `host-local` (the reason, under the
   membership tests of PDR-143 §2). Tooling is read at the capability level, one row per topic
   with its inventory file rows beneath, never one row per file. The one-sided strategic node
   `outcome-informed-practice-learning` is a row for the owner's reading. The ledger lands as
   one pull request per repository, the same bytes; carries continue while the owner reads it,
   and a later decline by row number reverts that row's carry. A ledger that derives more than
   twenty carries reopens this node with the owner, with the count and the closures.
5. **The records definition the owner directed.** One dated amendment to PDR-019 extends its
   discipline from ADRs to PDRs: a decision record carries the decision, its context and its
   consequences; a plan node carries sequence, size and proof; planning content found in a
   record moves to a plan. One sentence in the decision-records README §Shape points at it.
   Under that amendment PDR-143 is trimmed in the same change: its §Context's measured counts
   become a dated one-line claim pointing at the survey report; §3 keeps its constraints and
   its decision that the entity is installed in itself, and loses the bump-as-consolidation
   and fold-latency mechanics; §4 keeps two sentences (the render is committed and checked
   against the pin, because readers of the tree as it is exist) and loses the gate placement
   and the per-revision cost. The moved text goes to the extraction's design node when that
   node is authored, as this plan's §Inputs names.

## Acceptance criteria (each with a proof)

1. Nothing of the Practice is outside a default branch: no consolidation, port or lane branch
   on either remote; both coordination branches folded. Proof, `repo-safe`: the remote branch
   listings and the fold merge commits.
2. `best-of-each-practice` §Outcome holds between the two default tips: the dry-run merge of
   the shared text reports zero files changed and zero conflict hunks; every capability row of
   the ledger reads landed (with its demonstration named) or host-local (with its reason), and
   its count line reads N of N at the tips it names; the rendered adapters pass
   `portability:check` in both. Proof, `repo-safe`: the dry-run merge's three numbers, the
   ledger's count recomputed by its closer script from the survey, the check's run.
3. PDR-019's amendment and the PDR-143 trim are on both default branches as the same bytes.
   Proof, `repo-safe`: the files; the Core validators green.

## Inputs this node leaves the extraction's design (not criteria)

The survey at the folded tips (mechanism 3); the ledger with its `host binding` rows as the
entity's first parameter list (mechanism 4); the structural finding that five Practice
directories hold definitions beside instances (`memory`, `collaboration`, `state`, `plans`,
`reports`), recorded in the notebook on 2026-10-02 and read by the survey's per-file rule,
whose cure (a directory contract standing on PDR-105 axis 1 and PDR-007, and the moves) is the
design's first decision; the owner's word of 2026-09-28 that the review splits core skills
from extension packs per domain; and PDR-143's moved mechanics and materialisation.

## Size and order

Measured on 2026-10-02: about 19 minutes per landing in jimcresswell.net and 15 in OCE, review
rounds included. Counts below are derived at the ledger and re-derived at each fold, never
carried from this table.

| Step | Work | Size | Who, when |
| --- | --- | --- | --- |
| 1 | the OCE slices; the write-list table and the notebooks; the two folds | one day of door time across two seats; the folds at the rollover | the implementers |
| 2 | the named carries, smallest closure first | six carries named at authoring, one pull request each, about one seat-day; the rest as the ledger derives, under a ceiling of twenty before the node reopens | from ratification, in whichever repository has no open Practice pull request |
| 3 | the generator's map and the per-file rule; rerun | half a day, one seat, one pull request per repository | after the folds |
| 4 | the dry-run merge; the ledger over its hunks and one-sided files | half a day for the merge and the Practice-wide rows; the tooling rows by topic | after 3 |
| 5 | the PDR-019 amendment and the PDR-143 trim | one pull request per repository | with 4 |

Finish: steps 1, 3, 4 and 5 within three days of ratification; step 2 within the count the
ledger derives, reported at each fold as landed of total; a count that does not fall between
two folds is routed as a failure, never re-labelled.

## Out of scope

The OCE product work (the owner's, later). The entity's design, name, home, licence and
version scheme, and the directory contract with its moves (the design node's). The no-IO
conversion (`no-io-test-boundary-and-di-recovery`, sized by the census). Any new ceremony: no
heartbeat protocol change rides this node; the one tooling fix (a liveness signal and a gate
must not share a file) is a bug under the standing word.

## Todos

Sliced at pickup by the implementers; each slice a single-story pull request within its round
budget.

1. Land the tail (mechanism 1). Fold both branches at the rollover.
2. Open the carry queue with the six named carries, smallest closure first; demonstrate each.
3. Extend the generator's map and the per-file rule; rerun at the folded tips; land in both.
4. Run the dry-run merge; author the ledger; land in both; extend the queue from it.
5. Author the PDR-019 amendment and the PDR-143 trim; land in both.

## Plan-body first-principles check

- **Shape.** Every proof is a repository state a reader recomputes: a listing, a dry-run
  merge's numbers, a rerun, a validator's run. None tests activity.
- **Frame.** The counterframe set aside: parity by construction at the entity's first install
  (PDR-143's prediction). Set aside on the owner's word that parity comes first; the ledger's
  `host binding` rows keep that frame honest by naming what the entity would have made moot.
- **Proportionality.** The definition is reused; the survey fix is a map edit; the ledger reads
  only what the merge cannot settle; the carries are the first work, not the last.
- **Reversibility.** Every landing is a pull request on a default branch; every record is a
  tracked file; the generator and ledger are regenerable.
- **Landing path.** `.agent/plans/delivery/`, scanned by the plan-corpus validator in both
  repositories, the same bytes.
```

## What the two plan files carry that is not finishing this work

### `practice-work-finish.plan.md`

| Where | Content | Reading | Disposition |
| --- | --- | --- | --- |
| Goal 5; AC 5; size row 5; todo 2's product clauses | the OCE product node and its first pull request | struck by the owner | superseded with the node; the product node stays OCE's, untouched |
| §Out of scope, first sentence | every capability carry deferred to the extraction | reversed by the parity-first word | superseded; the carries are mechanism 2 of the new node |
| §Plan-body check, Frame | the bridge claim that the inventory substitutes for the carries | superseded | removed with the node |
| end state 3 and 4 | the inventory (298, merged) and the IO census (on both coordination branches, folds with step 1) | done | nothing to do |
| §Out of scope's retirements (the ten owner items, the security lane, the no-IO node) | routings already carried out | done, historical | the records hold them |
| the size row "1 and 2" | the first-batch skills residue | done in jimcresswell.net (297); OCE's copy in step 1 | rides step 1 |

Verdict: `superseded` by the new node, moved to the archive directory, inbound citations swept
to plain text in the same commit (`write-list-residue-and-notebook-close.plan.md:24` names it
as governing node and `:202` cites "PDR-143 §4 materialisation" by name; both re-point).

### `practice-two-way-exchange.plan.md`

| Where | Content | Reading | Disposition |
| --- | --- | --- | --- |
| §Rulings of 2026-09-21, -23, -24, -28 (45 rulings, about 280 lines) | the owner's decisions, verbatim | decisions captured in a plan; most already have record homes (18, 20, 22, 29, 31, 32 in PDR-142's amendment log; 18's pair in PDR-125; 33, 38, 39 in the Director rule, the Cricket skill and the testing-strategy directive; 19 and 27 in the stream page); the sequencing and seat rulings (4, 6, 17, 21 to 28, 40 to 44) are plan content | the plan archives with its rulings intact as the historical record; five rulings that still govern and have no record home (9, 11, 12, 36, 45) take dated amendment entries on PDR-142, with 45's extension-pack reading also named as a design input; a rulings register is a rejected form and is not made |
| three live citations of the plan for rulings: `plans/strategy/stream-practice.md:46` (ruling 27), `plans/strategic/best-of-each-practice.plan.md:16` (`ratified_where` at §Rulings 9 to 17), `plans/delivery/commit-as-the-full-local-gate.plan.md:32` (ruling 12) | permanent or long-lived surfaces citing a short-lived node | the citation-direction defect the no-moving-targets rule names | re-point each to the record entry that carries the words, in the same commit as the amendment entries |
| rulings 2, 5, 13; AC 6 (castr); mechanism 5's castr column; the nine surfaces list | the third estate, castr, and its re-transplant | castr moved into OCE by ruling 13; the criterion is dead as written | retired with the plan's archival; a one-line note in the archived node's header says why |
| §Finish (2026-09-29) and its status block | the seventeen-pull-request order and the 13:4xZ handoff | superseded by the 2026-10-02 closure line | archives with the plan |
| §Review dispositions (24 rows) | review routings, most cured or on named lanes | a ledger that did its job | archives with the plan; two rows carry live inputs, named next |
| disposition row 2026-09-28, PR 257 (ui-design family) | the owner's word that the review splits core skills from extension packs per domain | an input to the entity's design | named in the new node's §Inputs |
| disposition rows 2026-09-28 (operator-profile guard, ownership check, retire-command follow-ups) | tooling follow-ups on named lanes | unrelated to parity | stay on their lanes |
| todo 4's 2026-10-01 paragraph (skill-evals runner, runbook index, pr-watch content binding, window registry rows) | capability gaps | parity work | the new node's opening carry queue |
| the 2026-10-01 routed items (pr-watch twin; host-tagged amendment entries to a host record; the Core validator) | parity and Core-as-one-blob work | parity work | the new node's opening carry queue |
| the 2026-10-02 routed item (`outcome-informed-practice-learning`, OCE only) | a one-sided strategic node | parity at the strategic layer | a ledger row for the owner's reading |
| todo 8 and its status lines | the ADR-citation measure and validator, done in both | done | archives with the plan |
| §Close (mechanism 6) | provenance entries, empty Boxes, doctrine amendments as candidates | verified 19:1xZ: both Boxes hold only `.gitkeep`; both chains carry exchange entries (16 here, 13 in OCE) | done; the candidates clause is the ledger's `same meaning` reading |
| §How the seats keep in touch | an operating habit | belongs in a rule, not a plan | leave until the collaboration rule is next touched |

Verdict: `superseded` by the new node and archived with its rulings intact; the five amendment
entries and the three re-points land in the same records pull request as the PDR-019 amendment
(step 5).

### PDR-143 (the owner's point about planning in a PDR)

The docs review's section reading, adopted as mechanism 5 above: the direction, the scopes, the
membership tests, §3's constraints and its installed-in-itself decision, §4's adopted frame
(two sentences), §5 and the prediction stay; the bump and fold-latency mechanics, the gate
placement and the per-revision cost move to the design node; the measured counts in §Context
become a dated one-line claim pointing at the survey report, because load-bearing numbers in a
record are a moving target.

## Review findings declined, with the reason

- The assumptions review proposed dropping the survey extension to the design node. Declined:
  the owner's question of 19:0xZ ("are the surveys up to date, does it include everything under
  .agent/") makes the survey this node's, and it is a map edit, sized at half a day.
- The docs review proposed a new directory-contract record now, stripped of its moves.
  Declined in favour of the assumptions review's reading: the contract is the entity's first
  design decision, and the owner said the entity "has yet to be designed"; this node records the
  finding as evidence and leaves the decision to the design node.

## Verification

- The node validates in both repositories with each repository's plan-corpus validator (the
  `validate-plan-corpus` script of its agent-tools package); `cmp` of the two copies.
- `practice-work-finish` reads `status: superseded` with `superseded_by` present, in the
  archive directory of each repository; the validator accepts the status (it requires the field,
  it does not resolve the target); the two swept citations read as plain text.
- Each acceptance criterion's proof is a command a reader runs; the node names them.

## Execution steps once ratified (not before)

1. Land the node, the finish node's supersession and the two citation sweeps as one records
   commit per repository (the worktree route in jimcresswell.net while the lock stands).
2. Open the carry queue at once in the repository with no open Practice pull request; start
   step 1 with the implementer seats when the owner restarts them.
3. Step 5's records pull request carries the PDR-019 amendment, the PDR-143 trim, the five
   PDR-142 amendment entries, the three re-points and the exchange plan's archival.

## Parallax pass (the owner's word: simple, straightforward, achievable)

Depth: core. Mode: in-context, `emulated-reduced`; independence: same-context self-review after
two protected-but-correlated agent reviews (both read this file), so no independent audit is
claimed. Inquiry: `parity-plan-2026-10-02`, revision 2 (revision 1 is the plan as approved).

- **Charter.** Decide whether the node and its todos are the simplest achievable route to two
  equally capable Practices. Decision owner: the owner. Affected: the two implementer seats
  (stopped), the Director, the entity's designer. Non-goals: the entity's design; product work.
  Constraint that matters for achievability: at this hour one seat is working.
- **The serious counterframe.** Parity by the package: start the entity with the shared tooling
  as one installed package (PDR-142's ratified route for code) and let tooling parity come by
  construction. The owner's order (parity first; the entity undesigned) sets it aside for the
  node, but it changes one thing: the two large tooling carries (the validators with their core
  helpers; the skill-evals runner) are exactly where copy and package differ, so they are not
  pre-committed. They become ledger rows decided where the owner reads them.
- **Bridge claim.** Today's measured rate (15 to 19 minutes per landing) was for wording slices;
  a carry is code with tests and a demonstration. The port's sizing (23 files, crashes on three
  missing core exports) supports one to three hours per carry. The node now says so.
- **Crosswalk.** The owner's "capability" (what a seat can do) against the inventory's files is a
  lossy mapping; the ledger's capability rows are the crosswalk, partial by design.
- **Challenge, and what it changed.** Five steps with four instruments before one value step
  became three kinds of work (land, carry, measure) and one records pull request: the survey,
  the dry-run merge and the ledger are one slice; the four small carries open the queue; the
  ledger's carries start when it merges, so no revert path exists; the text trimmed from
  PDR-143 is held verbatim in the node's §Inputs so nothing waits on an unwritten design node;
  the one-seat order is stated.
- **Options considered.** The node as approved; the simplified node (chosen: fewer steps, no
  revert path, the big calls visible, honest sizes, every change reversible as a pull request);
  no node, the chat list as the plan (rejected: a fresh session cannot implement from chat);
  defer until the seats restart (rejected: the Director alone can land the node, the measure and
  the records).
- **World-return contract.** Indicators at each fold: the ledger's count (landed of total), the
  dry-run merge's three numbers, the open Practice pull requests per repository (at most one).
  Thresholds: a count that does not fall between two folds is routed as a failure; more than
  twenty carries reopens the node. Defeater: a carry that fails its demonstration on the
  receiving tree is re-sized, never forced. Owner of the monitoring: the Director. Horizon:
  three days for everything but the ledger's carries.
- **Status.** `provisional`: it permits landing the node as a sketch and starting the small
  carries; it forbids claiming the sizes as measured until the first carry lands, and becomes
  `validated` at the owner's ratification stamp and the first fold's numbers.
- **Learning signal.** The plan's first draft put three instruments before the value step, the
  same shape the owner corrected three times today; recurrence hypothesis: a plan written under
  a "finish" word defaults to measurement first. Destination: the Director brief's standing
  lessons, via the notebook.

## Trued after the owner's bound (19:4xZ)

The owner's bound: "no more than two hours, one agent per estate plus a cross-estate Director",
done efficiently. The node's size table is trued to it in the records commit that follows the
node's landing: the day's measured landing rate was the rate of ceremony, not of this work.
Two of the "four small carries" were sized first-hand and are ledger rows instead: the pr-watch
content binding (202 lines imported by 22 files in OCE, whose pr-watch was restructured around
it, so the carry is an adaptation, not a copy) and the runbook index (product operations under
PDR-120 in OCE; jimcresswell.net has one runbook and no operations docs, so its likely reading
is host-local). The two that remain are the window registry rows (a twelve-line diff into OCE)
and the host-tagged amendment entries with their Core validator.

## The measure's first numbers (19:5xZ, first-hand)

The dry-run merge of the Practice-wide text (directives, rules, skills less evals and fixtures,
practice-core, sub-agents, hooks) between jimcresswell.net main and OCE's default tip, a
three-way merge per file with the transplant pin as the base: shared 445; identical 279;
differing 166; one-sided 46 jimcresswell.net-only and 59 OCE-only. Of the 166 differing, 72 merge
clean (the merged text is the landing for both, one pull request per repository), 89 conflict in
221 hunks (the ledger's doctrine rows), 5 have no base at the pin (both added the file after the
transplant). The script sits in the session scratchpad and lands with the measure slice.
