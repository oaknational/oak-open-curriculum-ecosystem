---
classification: situational
description: "Any activity that edits both estates (a consolidation, a skill or rule sync, a Practice exchange or transplant, an edit to a path both estates hold) measures the shared-path divergence at its open and its close, and closes only with both estates more aligned than at the open: neither the differing shared files nor the differing lines more than at the open, at least one fewer (or both zero), every shared file that grew more divergent named in the close record with its reason. Owner, 2026-09-30: all activities involving both estates MUST leave them more aligned and less divergent than they were before those activities."
trigger: ceremony:cross-estate-work — any activity that edits both estates
---

# Cross-Estate Work Must Reduce Divergence

Operationalises the owner's standing word of 2026-09-30 and
[PDR-142 (The Best of Each Practice)](../practice-core/decision-records/PDR-142-the-best-of-each-practice.md);
the discipline is the two-estate form of [`replace-dont-bridge`](replace-dont-bridge.md).

## Trigger

An activity is about to edit both estates, jimcresswell.net (JC.net) and the Open Curriculum
Ecosystem (OCE): a dedicated consolidation, a skill or rule sync, a Practice exchange or
transplant, or an edit to any path that exists at the same relative location in both.

## Action

1. **Measure at the open.** Before the first edit, record the baseline: the shared paths (the
   same relative path present in both estates among the Markdown files under `.agent/rules/`,
   `.agent/skills/`, `.agent/directives/`, `.agent/memory/executive/` and
   `.agent/practice-core/`, plus `agent-tools/README.md` and `docs/engineering/build-system.md`:
   what the measuring script reads that both estates hold), how many differ, and the total
   differing lines (a unified diff with zero context, counting its `+` and `-` lines). Say the
   three numbers in the opening statement.
2. **Write shared changes once, in both.** A change to a shared path lands in both estates in
   the same words and the same wrapping. An estate-specific fact goes into an estate-only
   surface, or into the shared file in both estates worded so it reads true in each: name the
   estate ("in OCE", "in JC.net"), never "this repository", "here" or "the lineage".
   Twin pull requests for one shared change land in sequence. The first copy's review settles
   the bytes and it lands without waiting for its twin; the second estate's copy is cut from the
   settled blobs (the Director's ruling of 2026-09-26; of eleven exchange-lane events applying
   it, four had stated a mutual wait, which holds both copies).
   Before a port in either direction, each thing the destination lacks is read as a decision
   first and a loss second: run `git log --all -m -S'<distinctive string>'` in the destination,
   over every fetched ref, through merge commits and with no path (without `--all` the search
   starts at `HEAD`; without `-m` a change made in a merge resolution is not searched; a
   path-limited search stops at a rename), and read the commit that removed it; no commit means
   no fetched ref of a full clone ever held the text, and the port is treated as an addition. A
   diff shows that the estates differ; only history shows
   who decided (two instances on 2026-10-01: assertions one estate had deleted on purpose were
   restored in the other and removed again at review).
   A conflicted file's clean regions, where one estate alone moved since the base, are read by
   nobody in a three-way build and would land silently: each row's reading is applied to the
   receiver's own file by its author, who reads the file whole and names the clean-region
   readings in the landing line; nothing is taken from a clean region unread (the Director's
   ruling of 2026-10-03, from a finding on the alignment ledger).
   A port is cut from the destination's own text with edits that assert their anchors; where
   the twin's anchor reads zero because the passage wraps differently, the cured passage is
   applied to the estate's own wording and proved byte-equal to the sibling's merged text (a
   raw patch duplicated three passages and reversed one, 2026-10-02). A carried module's import
   closure is read before the copy (2026-10-03). A gate or validator that runs in both estates
   is demonstrated on the other tree before it is called done; a seam test on carried shared
   bytes is routed to the validator's own node, never added in one estate alone; and a one-body
   gate that pins a host's directory list is a host binding in disguise, so the list is computed
   from the workspace manifest (a dependency-cruiser gate pinned one estate's workspace roots,
   2026-10-05).
   A code carry runs the type check before the tests: a port's seams are type errors first (a
   reading literal without a carried field passed 905 tests and failed the type check,
   2026-10-14). A shared constant whose members are host states is derived from the host's own
   ladder, and the shared doctrine sentence is the invariant both lists satisfy (the records
   merge set, five states in one estate and seven in the other, 2026-10-14); doc comments
   copied with the code are read against the host's ladder. A carried test file that trips the
   host's file-length gate is split by cohesion, its shared builder a test helper, never
   trimmed (2026-10-14).
3. **Measure at the close.** The activity closes only when neither number is above the baseline
   and at least one is below it (or both are zero), and every shared file that grew more
   divergent is named in the close record with its reason: phenotype by nature (an
   estate-specific worked instance), or a defect owed to a named seat with its cure. The
   measure is read at the close of a pair of landings, never mid-pair: each estate's review
   changes the bytes until both merge (147 files at an open, 150 while twin pull requests
   landed an hour apart, 2026-10-02). A script that runs in both estates resolves the default
   branch the way the fold skill does, never by the name `main` (a containment check assumed
   that name on the sibling, 2026-10-05).
   A divergence is never left standing because one estate's tooling lacks what the shared
   doctrine names: the tooling is brought up as a code lane opened the day the gap is found,
   and the doctrine lands as the same bytes once it has (the owner, 2026-10-14, on a fold
   passage held back from the sibling for want of its merge tool's class detection: "There is
   ONE Practice with local instances, if OCE needs an update, it needs an update").
4. **Say the two measurements** beside the buffer counts in every close report of a two-estate
   activity.

"The same bytes" is a goal for the outcome, not a licence for the port. Before a port changes a
shared module, search each estate for every importer of that module: an importer one estate
alone has is where identical bytes break (2026-10-01). And before a port takes a form, read the
destination's own structure and the owner's rulings on it: a strategic plan node ratified in
one estate was routed as a question, not copied, into an estate whose owner had ruled one node
for that stream (2026-10-02).

Small differences between the estates are of three kinds. A host anchor (a decision record's
number, a skill prefix, a package scope) is a standing difference. Wording one estate already
holds host-neutral is where both converge. Content one estate has and the other lacks is
knowledge at risk: once it is classed as portable knowledge, not an estate-specific fact
(the guard above) or a recorded deliberate difference, it ports, after a search of the whole
history for a deliberate removal.
Measure divergence at the close of a pair of pull requests, never between its halves: twin
pull requests land an hour or more apart, and each estate's review changes the bytes
(2026-10-02).

## The owner's word

2026-09-30, verbatim: "All activities involving both estates MUST leave them more aligned and
less divergent than they were before those activities." Earlier the same day, of the six
consolidation skills that differed between the estates: "the divergence itself is a defect to
fix in both estates."

## Worked instance

The two-estate consolidation of 2026-09-30 (Hawthorn binds Bracken, b3f117) measured only at
its retrospective, after the owner's word: 388 shared paths, of which 156 differed by 7,444
lines at the open and 147 by 7,204 lines at the close of the consolidation itself. Eight shared
files had grown more divergent during the day, most through a paragraph written into one
estate only or wrapped differently in the two; the seat unified the text that was its own at
the retrospective and named the residue, with each file's reason, in the retrospective report
[`2026-09-30-two-estate-consolidation-retrospective.md`](../reports/agentic-engineering/2026-09-30-two-estate-consolidation-retrospective.md),
which also carries the measure as a script. The two main branches differed by 210 files and
11,899 lines the same day: the inherited backlog, not the session's.

## Capability parity

Alignment is of capability as well as text. The owner, 2026-10-01, asked whether JC.net adopts two
OCE tooling families, verbatim: "This shouldn't be a question, we are bringing both estates to the
same level of capability, anything useful that one has must make it to the other." When one estate
holds a useful capability the other lacks, the question is how and in what order it travels, never
whether: the exchange register (PDR-125, PDR-142) opens the row and the lane, and the measure above
reports the shared paths while the register reports the capabilities.

## Enforcement

Behavioural at the open and the close; the close report names the two measurements, and a
two-estate activity whose close record lacks them is not closed. Owed: an `agent-tools`
command that computes the measure from two roots, unit-tested on injected file maps and never
on the live trees, so a seat runs one command instead of a script.

The numbers are evidence of alignment, never its goal. A shared file is unified only where the two
estates hold one lesson in two wordings; a lower count bought by stripping an estate's specifics is a
loss, not a gain (owner, 2026-10-01: knowledge preserved, discoverable and accessible is the test, and
ceremony or a count serves it or goes).

## Related surfaces

- [`replace-dont-bridge`](replace-dont-bridge.md): the single-estate form.
- [`consolidate-until-done`](../skills/knowledge/consolidate-until-done/SKILL-CANONICAL.md):
  the completion contract the two measurements join for a two-estate consolidation.
- [`verify-dont-trust`](verify-dont-trust.md): the measurement is computed, never recalled.
