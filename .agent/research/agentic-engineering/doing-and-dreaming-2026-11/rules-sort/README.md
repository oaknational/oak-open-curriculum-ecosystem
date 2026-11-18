# Sorting the rules

Working record of a sort of the estate's 124 rules, begun 12 November 2026 by the seat Swift
holds Aether (Claude Code cloud session `01Duocji`) at the owner's word: "Yes please, and please
use the parallax skills to consider additional ways the rules can be understood or grouped. As
you go please make sure that all findings are recorded so that the damage caused by surprise
loss of context is minimal".

It follows from [`../delivery-trial.md`](../delivery-trial.md), which found that a session
opened the rules on the subject of its task, most of them with names that shared the task's
words, and did not measure how it chose.

**Widened the same day, at the owner's word.** Three statements, verbatim:

- "Regarding history in rules, there should be none of that, same for skills, they must
  describe current requirements, not the evolution that arrived at them."
- "Please find the patterns directory and explore it. I suspect that we have an inconsistent
  and inconsistently applied policy on turning patterns into useful mechanisms, and some of
  them may be the source of the behavioural rules you mentioned."
- "From now on this investigation considered rules AND skills, and for that we need a clear
  understanding of the strengths and appropriate use cases for each"

The first is a ruling and binds beyond this record. It is recorded here, in the napkin and in
the comparison brief; it has not yet been written into any rule, skill or register.

**State of this record.** Written in stages and pushed at each, so that a session lost part-way
leaves what was done.

| Stage | File | State |
| --- | --- | --- |
| 1. Mechanical facts about every rule | [`data.tsv`](data.tsv) | Done |
| 2. The sort, row by row | [`classification.tsv`](classification.tsv) | Done: one reader, from each rule's name and description |
| 3. Two further measurements | [`usage.tsv`](usage.tsv) | Done: the length of each rule's description, and how often its name appears in the napkins |
| 4. Findings and the alternative groupings | [`findings.md`](findings.md) | Done, status `provisional`. **Start here.** |
| 4a. The patterns directory | [`patterns.tsv`](patterns.tsv), [`patterns-findings.md`](patterns-findings.md) | Done, `provisional`: 246 pattern files, where each is cited, and the four statements of policy that do not agree |
| 4b. Skills, measured as the rules were | [`skills.tsv`](skills.tsv), [`rule-date-lines.tsv`](rule-date-lines.tsv) | Done. The `family` column of `skills.tsv` is unreliable and should be ignored |
| 4c. What a rule and a skill are each good for | [`rules-and-skills-use.md`](rules-and-skills-use.md) | Done, `provisional`: the platform's account, the estate's doctrine, and where practice departs from both |
| 4d. The scripts behind the tables | [`instruments.md`](instruments.md) | Done: kept as text at the session's wrap |
| 5. A second reader's check of the sort | [`second-sort.tsv`](second-sort.tsv) | Done: all 124 sorted again by a reader without sight of the first sort. Agreement on kind for 112 of 124; the comparison is in the limits of [`findings.md`](findings.md) |
| 6. The test that frame 6 names (deliver the 28 habit instructions as text and re-run the delivery trial) | [`../habit-text-trial.md`](../habit-text-trial.md) | Done at the owner's word ("Carry out the test."). The delivered text was taken up in form (one instruction separated treatment from both controls; two other signs) and no conclusion changed; the tasks were at the ceiling |

`classification.tsv` columns: `kind` is A for a named activity, H for a habit of mind, M for a
pointer; `moment` is when in a session's life the rule applies; `protects` is who is harmed by
a breach; `marker` is what other than recall could mark the moment; `catch_class` reduces the
Attendant research's ten classes of owner catch to frame, claim or practice.

## Stage 1: what `data.tsv` holds

One row per rule file under `.agent/rules/`, 124 rows, produced by a script that reads the
files and the git history and judges nothing. Columns: name; lines; characters; the rule's own
`classification` field; the number of lines in its Claude adapter; whether that adapter is
path-scoped; the dates of its first and last commit and the number of commits; how many
distinct decision records it cites; whether it quotes the owner; whether its name appears in
the hook policy or the hook scripts; whether it carries a prediction or falsifier term; whether
the delivery trial opened it; and its `description` field, cut at 260 characters.

First readings from the table, before any sorting:

- The 124 rule files hold 1,073,128 characters. The median is about 6,870; the largest,
  `verify-dont-trust`, is 60,852; the smallest is 456.
- The estate already sorts them one way: 75 call themselves `core` and 49 `situational`.
- 103 adapters are one line. 21 are path-scoped and run to between 6 and 14 lines.
- 9 rule names appear in the hook policy or hook scripts.
- 104 of 124 quote the owner. 24 carry a prediction or falsifier term.
- By month of first commit: March 12, April 21, May 36, June 15, July 21, August 10,
  September 8, October 1.
