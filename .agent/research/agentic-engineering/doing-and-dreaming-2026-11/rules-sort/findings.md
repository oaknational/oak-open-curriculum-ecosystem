# Sorting the rules: findings

Written 12 November 2026 by the seat Swift holds Aether (Claude Code cloud session `01Duocji`).
The owner's instruction is quoted in [`README.md`](README.md). This is stage 2 of that record.

**Status: `provisional`.** One reader sorted 124 rules from each rule's name and its own
`description` field, not from the rule bodies, which run to 1,073,128 characters. The counts
below are computed from three tables kept beside this file: [`data.tsv`](data.tsv) (facts),
[`classification.tsv`](classification.tsv) (this seat's sort) and [`usage.tsv`](usage.tsv)
(two further measurements). A reader who disagrees with a row can change it and recount.

## The answer to the question asked

The owner asked for the rules to be sorted into those tied to a named activity and those about
how to think.

| Kind | Rules | Characters of rule text | Call themselves `core` | Opened in the delivery trial |
| --- | --- | --- | --- | --- |
| Tied to a named activity | 90 | 812,703 | 41 | 10 |
| A habit of mind, applying to almost any task | 28 | 253,955 | 28 | 1 |
| A pointer to something else ("read `AGENT.md`", "follow the Practice") | 6 | 6,470 | 6 | 0 |

The 28 are few, and the delivery trial opened one of them. That one was `verify-dont-trust`,
opened in a task about writing a rule, not in the task that asked for something to be
verified.

The 28 habit-of-mind rules, so the list is on record:

`agent-state-observable`, `agents-default-no-gender`, `capture-practice-tool-feedback`,
`closed-shape-design-optionality`, `collaboration-is-value-contingent`, `compute-dont-hope`,
`confident-seats-proceed-and-report`, `consolidate-at-second-consumer`,
`design-from-impact-not-the-cowpath`, `design-work-for-small-prs`,
`important-state-not-in-temp-files`, `no-speed-pressure`, `no-warning-toleration`,
`one-instance-is-an-observation`, `owner-attention-at-action-moments`,
`precedence-is-not-approval`, `present-verdicts-not-menus`,
`re-apply-first-question-at-elaboration-boundaries`, `read-before-asking`,
`read-diagnostic-artefacts-in-full`, `records-are-technical-not-emotional`,
`replace-dont-bridge`, `rules-have-no-exceptions`, `scope-from-goal-before-approach`,
`silence-is-never-liveness`, `validate-full-target-estate`,
`verify-data-supports-shape-before-building`, `verify-dont-trust`.

## Three measurements that came out of the sort

1. **The whole rule set, stated in one line each, is smaller than its largest rule.** Every
   rule carries a `description` field that states it. Those 124 descriptions total 41,631
   characters. The largest single rule file is 60,852. The 28 habit-of-mind descriptions total
   6,859 characters. The 103 one-line pointers a session receives today total 6,780; the
   Attendant research's 9,931 is all 124 adapters, and an earlier wording here gave it to the
   103. So the text of all 28 habit rules, as their own authors summarised them, would cost
   about what the 103 pointers cost now, not less.
2. **The rules the estate talks about most are the ones the trial opened least.** Across the
   live napkin and its 121 archives (7.4 million characters), `verify-dont-trust` is named 142
   times, more than any other rule; the 28 habit rules are named 329 times between them and
   only 3 are never named. 27 of the 124 rules are never named at all, 20 of them activity
   rules. A mention is not a use: it may be a citation or a record of a breach.
3. **The estate's own sort hides the habit rules among activity rules.** Every one of the 49
   rules that call themselves `situational` is an activity rule. The 75 that call themselves
   `core` are 41 activity rules, the 28 habit rules and the 6 pointers. So "core" does not
   mean "applies everywhere": more than half of the core set is tied to an activity.

## Other ways to see the rules

Set out as the `parallax-frame` skill asks: each frame stated on its own terms first, with what
it shows, what it hides and what observation would tell it apart from the others. Frame 1 is
the sort above. The inquiry is `rules-sort-2026-11`, revision 1; the frames were built by one
seat in one context, which the skill calls emulated and not protected.

### Frame 2: what could mark the rule's moment

- **Unit and question.** For each rule: is there something other than the agent's recall that
  could tell the moment the rule applies?
- **Sort.** A command or tool call with a recognisable form, 34. A file of a known kind being
  opened or edited, 24. The shape of the session at its open (a team session, a cloud session,
  a second repository), 13. A document of a known kind being written (a plan, a pull request,
  a handoff), 8. Nothing, 45.
- **What it shows.** 79 of 124 rules have a moment that something could mark. Today 21 are
  path-scoped and 9 appear in the hook policy. Of the 28 habit rules, 24 have no marker. This
  frame explains the delivery trial better than frame 1 does: the trial's opened rules all had
  a marker except one.
- **What it hides.** Whether marking the moment helps. The Attendant research found that a
  path-scoped rule still arrives as a pointer.
- **What would tell it apart.** If rules with a marker are opened when delivered at their
  moment and habit rules are not opened whatever is done, this frame is the right one. If habit
  rules are followed once their text is in context, frame 6 is.
- **A connection.** PDR-098's design-space plan has a pending todo to list the rules that have
  no surface a scanner could match. The 45 here are a first cut of that list, made from
  descriptions.

### Frame 3: when in a session's life the rule applies

- **Sort.** Writing documents, doctrine or memory, 22. Editing code, 18. Working in a team
  session, 17. Any time, 14. Writing to someone else's system, 10. Committing, 10. Planning or
  shaping, 9. Pushing, reviewing or merging, 8. Running loops, fleets or monitors, 7. Session
  open, 6. Making a claim or a report, 3.
- **What it shows.** Most rules belong to a moment that already has a skill: commit, pull
  request, plan, start-right, the team-start ceremony. The 17 team-session rules hold 221,087
  characters and reach a solo session as 17 of its 103 pointers.
- **What it hides.** Eleven of frame 1's 28 habit rules sit in the "any time" group, and this
  frame has nowhere else to put them. The other 17 were given a moment here (planning 6, team
  sessions 3, documents 3, editing 2, claims 2, loops 1). So this seat's own sort did not hold
  "applies to almost any task" for most of the rules it called habits.
- **What it enables.** Moving a rule's instruction into the skill that runs at its moment. The
  estate's own landing rule says where substance lives when there is a choice: "favour skills
  as the SSOT, with evals".

### Frame 4: who is harmed when the rule is broken

- **Sort.** The code and its users, 37. The estate's own knowledge, 30. Other agents, 22. The
  owner's attention or authority, 22. Third parties and outside systems, 10. The machine, 3.
- **What it shows.** A severity order the other frames lack. The ten rules about outside
  systems (Oak's, Linear, Notion, GitHub under a shared identity) guard things that cannot be
  taken back. Five of those ten are never named in the napkins, which fits either "never
  broken" or "never met".
- **What it hides.** How often each is at risk.
- **What it enables.** Choosing which rules must be held by code and which may stay as text.

### Frame 5: which of the owner's recorded catches the rule addresses

- **Unit.** The Attendant research's ten classes of owner catch, reduced to three: an error
  about the frame of the work (its classes 1 to 8), a claim that outran what was looked at
  (class 9), an operating practice not followed (class 10).
- **Sort.** Operating practice, 89. Frame, 22. Claim, 13.
- **What it shows.** Eight of the ten classes of owner catch concern the frame, and the rule
  set is mostly about operating practice: 22 rules for those eight classes. Of those 22, 16
  are habit rules, and 13 of the 16 have no marker. This counts classes and not catches. The
  Attendant research gives no count of catches by class; its one sample, a pilot's twenty rows,
  had twelve in the class for operating practice. An earlier wording here said the owner's
  catches are mostly about the frame, which that research does not support.
- **What it hides.** Catches nobody recorded, and operating failures the owner never needed to
  catch because a gate did.

### Frame 6, the counter-frame: the rule file is the wrong unit

- **Claim.** A rule file is three things in one place: an instruction of a sentence or two; a
  record of what the owner ruled and when; and a history of the incidents behind it. 104 of
  124 files quote the owner. The median file is about 6,870 characters and its instruction, by
  its own description, about 267.
- **What it shows.** "Far too many rules" may be two different complaints. There are 124
  instructions, which fit in 41,631 characters. And there is a million characters of ruling
  record and incident history filed under the instructions' names, which a session pays for
  only when it opens a file, and then pays in full: opening `verify-dont-trust` costs more
  than every instruction in the estate.
- **What it hides.** Why the history is there. The estate holds that knowledge is not to be
  lost, and the rule file is where a ruling's evidence has been kept.
- **What would tell it apart.** Deliver the 28 habit instructions as text at session start and
  run the delivery trial's ten sessions again. If behaviour on the frame-level tasks changes,
  the fault was delivery and the unit was wrong. If it does not, the fault is at the moment of
  the act, as PDR-098 holds, and no arrangement of rule text will cure it.

## Where the frames agree and where they do not

- **Frames 1, 2 and 5 pick out nearly the same rules from different sides.** Of the 28 habit
  rules, 24 have no marker and 22 address a frame error or an unsupported claim. These are not
  three confirmations. One reader sorted all three from the same descriptions in one sitting.
- **Frames 3 and 4 cut across the others** and are closer to independent: a rule's moment and
  the party it protects do not follow from whether it is a habit.
- **Frame 6 disagrees with the premise of the other five.** They sort rules. It says the thing
  to sort is instructions, and that most of the bulk is something else.
- **What no frame here covers.** Whether a rule is followed. Which rules contradict each other.
  Which are already held by code other than the nine found by name in the hook policy: a lint
  rule or a commit guard enforces some without naming them. And the sibling estate's rules.

## What this suggests, for the review of the collection

Not designs. Each could be tested cheaply and each has a result that would count against it.

1. **Run frame 6's test.** Put the 28 habit instructions, as their descriptions state them, in
   front of the same ten sessions and compare. It costs about what the delivery trial cost. It
   is the one test that separates "not delivered" from "delivered and not applied".
2. **Treat the 41 activity rules that call themselves `core` as candidates for delivery at
   their moment** and not at every session's open, by frame 2's markers or frame 3's skills.
   Counting against it: an activity rule that the trial shows is needed before its marker can
   fire.
3. **Read the 27 rules the napkins never name.** A rule nobody has cited or broken in the whole
   capture record is a candidate for folding or retiring, or it guards something rare and
   severe (frame 4) and should be held by code. Reading them decides which.
4. **Separate the instruction from its history** for the largest files first: twelve files hold
   31 % of all rule text. Counting against it: a case where the history, read at the moment,
   changed what a session did.

## Limits

- Sorted from descriptions by one reader. A rule whose description undersells its body is
  mis-sorted.
- A second reader has since sorted all 124 without sight of this sort, from the same names and
  descriptions and the three definitions alone: [`second-sort.tsv`](second-sort.tsv). The two
  agree on the kind of 112 of 124 rules (Cohen's kappa 0.76). The second reader found 92
  activity rules, 27 habits and 5 pointers. Twenty-two rules are habits by both, 33 by either,
  and each of the six that only this sort calls a habit was the second reader's alternative.
  On what could mark a rule's moment the two agree on 92 of 124 (kappa 0.65), and on whether
  anything could on 103. Of the 22 habits by both, 19 have no marker by both. The second
  reader's difficulty is a finding in itself: a standing constraint such as
  `never-disable-checks` or `no-warning-toleration` is neither a habit of mind nor tied to one
  activity, and the three kinds have no place for it. The same model family made both sorts.
- The three-way kind and the five markers are this seat's categories; a rule can fairly sit in
  two. Each was given one.
- A reader who wrote none of this recomputed every count here from the tables and the files
  on 12 November 2026. The kinds, the character totals, the napkin mentions and the frame
  counts reproduce. One row of `usage.tsv` is two characters short of its file
  (`no-verify-requires-fresh-authorisation`, 123 for 125), so the descriptions total 41,633
  from the files and 41,631 from the table. The corrections that check led to are marked
  where they stand above.
- The mention count matches a rule's name as a whole word in napkin files only. Thread records,
  the comms stream and pull requests were not searched.
- The delivery trial behind the "opened" column was ten sessions on five tasks.
- The same model family wrote the rules' descriptions, ran the trial and made this sort.
