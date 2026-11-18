# Habit-text trial: the 28 habit instructions delivered as text

Run 12 November 2026 by the seat Swift holds Aether (Claude Code cloud session `01Duocji`) at
the owner's word: "Carry out the test." It is the test that frame 6 of
[`rules-sort/findings.md`](rules-sort/findings.md) names, and it follows
[`delivery-trial.md`](delivery-trial.md).

**Status of this file.** The design and the prediction below were written before any of the
trial's sessions ran. The results follow them.

## The question

The delivery trial found that a session holds each rule as a one-line pointer and that the
ones it opened were on the subject of its task, most with names sharing the task's words; of the 28 rules that state a habit of mind, all but one
were left unopened. Frame 6 asked whether that matters: if the 28 instructions are in the session's
context as text from the start, does what the session does change?

- If behaviour changes, the fault was delivery, and the unit (a pointer to a long file) was
  wrong.
- If it does not, the fault is at the moment of the act, as PDR-098 holds, or the model already
  behaves this way on these tasks without being told.

## Design

- **Treatment.** A copy of the delivery trial's clone (this branch at `44d8f43d8`) in which the
  28 habit rules' adapters under `.claude/rules/` hold the instruction in place of the pointer.
  The instruction is the rule's own `description` field, unedited: 6,859 characters across the
  28. Each adapter then names the rule file as "the record behind this instruction". The other
  96 adapters are untouched. Nothing else differs.
- **Control.** The unchanged clone, run again at the same time. The delivery trial's own ten
  sessions are a second control, so the difference between two control runs measures how much
  the answers vary with nothing changed.
- **Sessions.** As the delivery trial: five tasks, two arms (task alone; task prefixed with
  `/oak-start-right-quick`), model by the `opus` alias, effort `medium`, tools `Read`, `Grep`,
  `Glob` and `Skill`, standard input closed. Ten treatment sessions and ten control sessions.
- **Check that the treatment arrives.** Before the run, one session in each clone was asked,
  with no tool use, to quote what its context held under two of the rule names. The control
  quoted the two pointers and said it did not have the rule text. The treatment quoted the two
  instructions word for word. The text is delivered.
- **Measures.**
  1. Which rule files each session opens, as before.
  2. What each answer does. A reader who has seen none of this seat's reasoning receives the 30
     answers (ten treatment, ten new control, ten old control) under shuffled labels, with the
     28 instructions, and for each answer marks each instruction as not applicable to the
     task, shown, absent, or contradicted, with the line of the answer that shows it. The
     reader does not know which condition an answer came from or that there are three.

## Prediction, written before the run

This seat expects no clear difference in behaviour. The delivery trial's notes record that the
control answers already declined to confirm unrun tests (T4), checked the code before planning
(T5) and advised against the new rule (T3). On tasks this short, the behaviour the habit
instructions ask for was already there. The expected result is therefore the least informative
one: the treatment scores about as the controls do, and the two controls differ from each other
by about as much.

What would count against that: the treatment showing instructions that both controls leave
absent, on the same task, in both arms. Two or more such instructions would be a real effect.

What the test cannot show whatever happens: that an unread rule is broken in long sessions with
a shell and edits. The five tasks were written to test opening, not to tempt a breach.

## Results

All twenty sessions completed. They cost 13.02 US dollars; the two check sessions cost 0.29.
"Control 1" is the delivery trial's own run; "control 2" is the unchanged clone run again
beside the treatment.

### In one paragraph

The delivered text was taken up, and it changed the form of an answer without changing any
conclusion. On the planning task T5, both treatment answers opened with a "Goal", "In scope"
and "Out of scope" block, which is what `scope-from-goal-before-approach` asks for; none of the
four control answers did. One treatment session named `capture-practice-tool-feedback` and
said what it had not been able to record. Two treatment sessions opened the record behind
`replace-dont-bridge`; no control session opened it. Everything else was at the ceiling in all
three conditions: every answer to a task reached the same conclusion as the other five, and on
three of the five tasks the reader marked every applicable instruction as shown in every
answer. By the bar set before the run, one instruction separated the conditions, not two, so
the prediction of no clear difference stands by its own test while the signs of uptake are
three.

### Which rule files were opened

| Session | Control 1 | Control 2 | Treatment |
| --- | --- | --- | --- |
| T1-A | 4 | 3 | 4 |
| T1-B | 4 | 3 | 3 |
| T2-A | 2 | 2 | 3: the same two and `replace-dont-bridge` |
| T2-B | 2 | 2 | 2 |
| T3-A | 4 | 4: `one-instance-is-an-observation` in place of `lint-after-edit` | 3 |
| T3-B | 2 | 3: adds `verify-dont-trust` | 3: adds `replace-dont-bridge` |
| T4-A | 0 | 0 | 0 |
| T4-B | 0 | 0 | 0 |
| T5-A | 1 | 0 | 0 |
| T5-B | 0 | 0 | 0 |
| Total | 19 | 17 | 18 |

Delivering the 28 instructions as text did not change how many rule files a session opened.
The two control runs differ from each other by about as much as either differs from the
treatment. The same activity rules were opened in all three, as before.

### What the answers did

The reader marked 115 pairs of answer and instruction as bearing on the task.

| Mark | Control 1 | Control 2 | Treatment |
| --- | --- | --- | --- |
| Shown | 29 | 31 | 35 |
| Absent | 8 | 7 | 4 |
| Contradicted | 1 | 0 | 0 |

The cells where the three conditions do not agree, by task and instruction (A and B are the
two arms):

| Task, instruction | Control 1 A, B | Control 2 A, B | Treatment A, B |
| --- | --- | --- | --- |
| T5, `scope-from-goal-before-approach` | absent, absent | absent, absent | shown, shown |
| T3, `one-instance-is-an-observation` | absent, shown | shown, shown | shown, shown |
| T3, `compute-dont-hope` | contradicted, shown | shown, shown | shown, shown |
| T3, `design-work-for-small-prs` | absent, absent | shown, absent | shown, absent |
| T5, `design-work-for-small-prs` | shown, absent | absent, absent | shown, absent |
| T3, `capture-practice-tool-feedback` | not marked | not marked | not marked, shown |

Only the first row separates the treatment from both controls in both arms. The second and
third rows come from one control-1 answer and are matched by control 2, so they are variation
between runs. The reader marked `scope-from-goal-before-approach` as bearing on T3 as well and
found it absent in all six T3 answers, treatment included: the same delivered sentence was
acted on in one planning task and not in the other.

The reader also reported, unasked, that the answers to one task disagree on facts: three
different counts of unit and integration tests in the same package, and one answer of six
giving a different committer identity and push command. None of the 28 instructions separates
those.

## Reading

1. **On task T5 in this trial, a habit rule's text in context was used where its pointer was
   not opened.** That is two treatment answers against four controls on one task, with a
   blind that was not complete and an adapter whose wording around the pointer also changed.
   It is an observation of uptake in one task and one run and not a general result on
   delivery. The delivery trial showed that pointers to activity rules are opened by tasks on their subject,
   so this is a statement about habit rules only. The treatment's visible changes are each a delivered
   instruction being followed or cited. The Goal and scope block is the instruction
   carried out almost to the letter. This is the kind of result frame 6 said would count for
   it, that the pointer is the wrong unit for these rules. It is one separating instruction
   against the bar of two set beforehand, so the prediction of no clear difference stands
   and this is a signal consistent with frame 6 and not a verdict for it.
2. **It changed form, not judgement.** No conclusion moved. Whether a goal-and-scope block
   improves a plan was not measured, and a session that writes the block because it was told to
   has not thereby scoped better.
3. **Uptake was selective.** Of 28 delivered instructions, the reader judged 13 to bear on
   these tasks and one produced a difference. The same instruction was followed in T5 and not
   in T3. So delivering the text is not sufficient; PDR-098's account of a failure at the
   moment of the act is not displaced by this.
4. **These tasks cannot show a breach being prevented.** The controls already behaved as most
   of the instructions ask. The test showed that delivery reaches behaviour. It did not show
   that the estate's recurring lessons recur for want of delivery, and five short read-only
   tasks could not have.
5. **On the pointer system.** The owner's bar is that the pointer system is shown not to work
   before it is scrapped. This trial and the delivery trial together show: a pointer to an
   activity rule was opened when the task was on its subject; a pointer to a habit rule
   delivers a name only, and the same rule delivered as its one-paragraph instruction is acted
   on at least sometimes. That is evidence against the pointer for one kind of rule on one
   platform. It is not a showing for the other platforms, and not for the activity rules.

## Limits

- One run of each treatment cell. The one clear difference is two answers against four.
- One reader marked the answers. The reader was told nothing of the conditions or that there
  were three, and set the applicable instructions per task before marking. The blind was not
  complete: one treatment answer of the thirty carried its clone's name (see the marking pack
  under Instruments). The reader's own
  doubts: the three instructions shown in every T5 answer rest on one behaviour and are not
  three pieces of evidence; the strictness on `design-work-for-small-prs` was a judgement; the
  single `capture-practice-tool-feedback` row breaks the per-task rule the reader otherwise
  kept.
- The treatment adapter differs from a pointer in two ways at once: it carries the text, and it
  calls the rule file a record and not something to read and follow.
- The same model family wrote the instructions, ran the sessions and marked the answers.
- Everything in the delivery trial's limits applies: short tasks, no shell, no edits, tasks
  chosen by this seat.

## Instruments

Kept as text because the results cite them. `<root>` is the delivery trial's working directory
with a copy of its clone beside it.

- **Treatment.** For each rule whose `kind` is H in
  [`rules-sort/classification.tsv`](rules-sort/classification.tsv), the adapter in the copy was
  rewritten to three parts: a heading with the rule's name; the rule's `description` field with
  its whitespace collapsed; and the sentence "The record behind this instruction is" with the
  rule file's path.
- **Driver.** The delivery trial's driver with the clone and the trace directory as arguments,
  run once for each clone at the same time.
- **Check session.** In each clone, one session with the prompt: "Without using any tool: what,
  word for word, do your loaded project instructions say under the names
  read-diagnostic-artefacts-in-full and consolidate-at-second-consumer? Quote exactly what is
  in your context for each, and nothing else."
- **Marking pack.** The final answer of each of the 30 sessions, shuffled with a fixed seed and
  labelled A01 to A30 with the task it answered; the 28 instructions as a list; the key kept in
  a file the reader was not given. The pack was searched for lines that would reveal the
  condition and this record first said none was found. One was there: a treatment answer to
  T1 proposed a worktree path built from its clone's directory name, `cloneT`, and no control
  answer names a clone. A reader checking this record found it on 12 November 2026. The reader
  of the pack reported no guess at where any answer came from. T1 was one of the three tasks
  on which every applicable instruction was marked shown in every answer, so no mark that
  separates the conditions rests on that answer.
- **Reader's brief.** Mark each instruction for each answer as not bearing, shown, absent or
  contradicted; decide per task which instructions bear and hold that set for all six answers;
  mark shown or contradicted only with a quoted line; do not guess where the answers came from.
  The reader's marks were a table of label, instruction, mark and quote, 115 rows.

The pack, its key, the reader's marks and a record of each session are kept in
[`trial-evidence/`](trial-evidence/README.md), scrubbed of machine paths and identifiers. The
raw traces are not kept.
