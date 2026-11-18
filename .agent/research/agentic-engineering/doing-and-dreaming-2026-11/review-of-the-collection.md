# Review of the collection

Written 12 November 2026 by the seat Swift holds Aether (Claude Code cloud session `01Duocji`).

**At whose word.** The owner ratified the strategic node
[`self-starting-practice-refinement`](../../../plans/strategic/self-starting-practice-refinement.plan.md)
with the words "We should wait for the other session inputs and review all work together
before starting a design phase", and later said what was meant and who does it: "I meant
together in the sense of review the collection of work, rather than a joint review. I am happy
to delegate that review to you". This is that review.

**What it is.** One reading of the whole collection as a single body of evidence: what it
establishes, where its pieces disagree, which of its claims are weaker than they are written,
what nobody looked at, and whether it is enough to start design. It proposes no design.

**Who wrote what.** This seat wrote most of the collection, so this is an author's review.
Three readers who wrote none of it were used where an author is least to be trusted. One
sorted the 124 rules again without sight of the first sort. One recomputed the collection's
numbers and tried to refute its statements that something is absent. One read a body of
evidence the review found and the collection had missed. Their results are in section 6. All
three are the same model family as the author. No reader of another family and no person has
checked any of it.

## 1. The verdict

1. **It is enough to start defining the rules and skills system, for Claude Code.** The
   collection measures what this platform delivers, what a session opens, and what the estate
   holds. It says nothing about how the other platforms load what the estate renders for them,
   and the owner's requirement is a system that works across platforms. That research is small
   and is the first step of the definition, not a reason to wait.
2. **It is enough to write the design of the node's experiment, with four constraints the
   comparison's first proposal did not carry** (section 7). Nothing that arrived after the node
   was ratified argues against its bet. The later inputs narrow what the first experiment
   should do and how its result should be judged.
3. **The shared diagnosis is one finding, not four.** All four pieces say that learning and
   stepping back start only when a person or an agent's recall starts them. Three of the four
   draw their evidence about this estate from the same few records. What is independent of
   those records is listed in section 3.
4. **The checks found about twenty places where the collection was wrong, stale or stronger
   than its evidence.** All in this seat's documents are corrected where they stand (sections 5
   and 6). Most are small. Four change a reading:
   - The collection says the estate's with-and-without skill evaluation had been used once.
     The repository holds nineteen recorded runs from September, each with a written reading,
     and no piece of this collection had read them. They are the estate's largest body of
     first-hand evidence on whether a skill's text changes an answer, and they show what the
     November trials show: the answer without the text is usually already close, and the text
     adds form (section 6).
   - The line between a habit of mind and a rule for an activity is not sharp. A second reader
     moved six of the 28 habits, and the first sort itself gave seventeen of them a moment.
   - Carrying the 28 habit rules as text is not cheaper than the pointers, as the sort said.
     Measured, it added about 2,900 tokens.
   - A headless session here starts with about 39,000 tokens in context. Another seat's figure
     of about 169,000 is a counter that adds up every turn. That figure is in work this seat
     did not write; it now carries a dated correction beside it.
5. **The deep comparison the owner named has still not been written.** The owner's words:
   "What has not necessarily been done yet for the reports is a deep comparison with the
   current capabilities and mechanisms of the Practice". Two rows of the map that would hold it
   are now measured. The rest are still read from records (section 4).

## 2. What was read for this

Read whole, for this review, on 12 November 2026:

| Piece | Files |
| --- | --- |
| A. Hermes and the Practice | [`synthesis.md`](../hermes-agent-v0.23.0-2026-11/synthesis.md) of the Hermes study; the [comparison](../hermes-practice-comparison-2026-11/comparison.md) and its [brief](../hermes-practice-comparison-2026-11/brief.md); the strategic node |
| B. The owner's report | [`doing-and-dreaming.md`](../loop-engineering-governance-2026-11/owner-reports/doing-and-dreaming.md) |
| C. The loop-engineering baseline | [`findings.md`](../loop-engineering-governance-2026-11/findings.md), [`doing-and-dreaming-reading.md`](../loop-engineering-governance-2026-11/doing-and-dreaming-reading.md), [`paper-readings.md`](../loop-engineering-governance-2026-11/paper-readings.md) |
| D. The Attendant research | [`attendant-research-findings.md`](../attendant-research-findings.md), [`attendant-step-back-scenarios.md`](../attendant-step-back-scenarios.md), the feasibility check |
| E. This seat's work of 12 November | Every file that was in this directory and in [`rules-sort/`](rules-sort/README.md) when the review was written. The Cursor and Codex loading notes and their reports were added afterwards and are not assessed by this review |
| Found during the review, in no piece | Nineteen recorded skill-evaluation runs of September 2026 under `.agent/skills/`. Two readings opened by this seat; all nineteen coded by a reader |

Not read: the Hermes study's other files; C's evidence log beyond six rows checked against
what this collection cites from them, and its two commissioned reports; D's working notes and
ledger. Not opened, on purpose: D's held-back scenarios and its scenario review.

## 3. What the collection establishes

Each line says how it is known. "Observed" means something was run or counted here. "Read"
means it rests on records or on another system's code and documents.

| Finding | How it is known | Standing |
| --- | --- | --- |
| Nothing in this repository starts a refinement step and does its work. Capture, wrap, retrospective, consolidation, synthesis and skill evaluation each start at the owner's word or an agent's recall | Observed: the comparison's table of what starts each step, with searches, and a reviewer's re-check; the owner's own statement | Firm for this repository on the day |
| The consolidation that reads four of the estate's six records of whether a lesson worked last ran on 15 October 2026, and the buffers read `critical` | Observed: the fitness tool and `git log`, 12 November | Firm, and dated |
| On Claude Code a rule reaches a session as a one-line pointer. Its text arrives only if the session opens the file | Observed three ways: a session asked to quote its own context; the trial traces; the adapters themselves. Read: Anthropic's documentation | Firm for Claude Code |
| A session opens rules on the subject of its task, most with file names that share its words, and few others; why a file was opened was not measured. Three runs of ten sessions opened 19, 17 and 18 rule files; a commit task opened the commit rules and a request to confirm that tests pass opened none | Observed: thirty headless sessions on five tasks | A shape, for short read-only tasks. No rate |
| An instruction placed in context as text can change what a session writes. A goal-and-scope block appeared in both treatment answers to one planning task and in none of four controls | Observed: twenty sessions, marked by a reader blind to condition, against a bar set before the run | Shown once. The bar was two instructions and one met it |
| Delivering the text is not sufficient. The same sentence was acted on in one planning task and not in the other | Observed in the same trial | One instance |
| On short, self-contained tasks the answer without a rule's or a skill's text is already close to what the text asks for, and what the text visibly adds is form | Observed twice, by different seats and instruments: 59 case-runs on five skills in September (section 6), thirty sessions on rules in November | A shape. One run for each arm; one model family reading and judging |
| A session in this repository starts with about 39,000 tokens in context. Carrying the 28 habit instructions as text added about 2,900 | Observed: the first model call of each of the thirty trial sessions (section 6) | Firm for a headless session with four tools |
| The estate holds 124 rules of 1.07 million characters whose own one-line descriptions total about 41,600; 78 canonical skills of 1.11 million; 246 pattern files of 1.03 million | Observed: counted by script, tables kept | Firm |
| Hermes starts its refinement in code and measures none of what that refinement writes | Read: static reading of code at one tag. Nothing was run | `provisional`, by the study's own status |
| The one published method with reliable gains from stored lessons admits a lesson only after running it on real work; agreement among many agents was wrong in both directions in one campaign | Read: preprints, none replicated, none about guidance files in a codebase | The baseline calls every such bridge untested |
| The owner's recorded catches fall into ten classes, eight of them about the frame of the work. Every one of eleven step-back instruments depends on the working agent deciding to use it | Read: about seventy recorded instances and the instruments' texts, one seat | Ratified by the owner as that step's findings |
| What has worked, in the estate's records, had one shape: "something outside the agent's recall marked the moment, and the response was a thing that had to be produced or could not be passed" | Read, from the same records | A reading. Nobody has tested it as a design rule |

**What is independent of what.** A, D and this seat's readings of B take most of their
evidence about the estate from three records: the two archive syntheses and the retrospective
of 16 September 2026. "Sixteen of nineteen", growth of about 30 % in 42 days and "the napkin
has become a journal" each recur across them. Independent of those records: the papers C
read; Hermes's code; the owner's own reasoning in B; and what was run. What was run, as this
collection knew it: D's one scenario with and without a rule, the skill-evaluation run of 27
October, one hook firing, and the two trials in this directory. What was run and this
collection did not know: nineteen skill-evaluation runs of 27 and 28 September (section 5).

## 4. Where the map stands

[`where-we-are.md`](where-we-are.md) drew a table of the links a system closes without a person
when it governs and improves itself. This is that table's fourth column, brought up to date.

| Link | How it is known now |
| --- | --- |
| Capture experience | Read |
| Decide what a lesson becomes | Observed once, as a date: last run 15 October |
| Deliver guidance to the acting agent | **Measured for rules on Claude Code**: rules tied to an activity were opened when the task was on their subject, why not measured; habits of mind reached the session as pointers only. Not measured for skills, for other platforms, or for sessions with a shell |
| Fire at the moment of the act | Read, and no longer wholly confounded with delivery: one trial shows delivered text used in one task and unused in another |
| Check the frame of the work | Read |
| Show a lesson changed anything | Observed, and mostly unread: 16 of 78 skills have a suite; twenty runs are on record, nineteen of them from September and not read by any piece of this collection |
| Revise or forget | Read |
| Start the next round | Observed: nothing in the repository does |

## 5. Where the pieces disagree, and what is weaker than written

### Corrected with this review

1. **Skill evaluation was used far more than once.** The comparison said the suites had "one
   recorded run", on 27 October, and built its one new finding on it: that the Practice's
   scored loop, "on its one recorded use", had a baseline that could discriminate nothing.
   `where-we-are.md` and the reading of the baseline repeated "once". The repository holds
   nineteen result directories under five skills' `evals/results`, dated 27 and 28 September
   2026, eighteen with case results and every one with a written reading; their case runs cost
   about 16 US dollars. This review opened two of the nineteen readings. In both, some cases
   passed with the skill and failed without it, some passed or failed in both arms, and the
   reader recorded where the judge was stricter than a person's reading. So the October run was
   not the suite's only use, and "could discriminate nothing" is true of that run and not of
   the instrument. The comparison carries a dated correction; its argument was not rewritten.
2. **Skills with an evaluation suite: 16 of 78, not 20.** The same three documents said 20,
   counted by a path pattern that also matched a skill about evaluation and a directory of
   evaluation notes. Sixteen canonical skills have an `evals` directory with a case file, which
   is what the runner reads. `rules-and-skills-use.md` already had 16 and named the difference.
3. **"The owner's catches are mostly about the frame" was not supported.** The rules sort's
   fifth frame said so. D counts classes, not catches: eight of ten classes concern the frame.
   D's one count of instances points the other way, with twelve of a pilot's twenty rows in the
   class for operating practice. The sentence now says what D found.
4. **"Text in context is used; a pointer is not" said more than the trial showed.** The
   delivery trial found that pointers to activity rules are opened. The heading now speaks of
   habit rules only.
5. **The label "joint review".** This seat coined it for the owner's "review all work
   together" and wrote it into a dozen places. It is replaced by "the review of the collection"
   everywhere, the ratified node included (section 9), but the records of the correction
   itself.

Two statements that a test "has not been run" also stood, in the loading note and in
`rules-and-skills-use.md`, after the habit-text trial ran. They now point to it.

### In another seat's work

The first is now also marked where it stands, by a dated correction beside D's sentence.

1. **A headless session's fixed load.** D's feasibility check reports "About 169,000 tokens of
   fixed load per session", and D's findings repeat it with 107,000 for a sub-agent. The check's
   own table gives the source: 169,145 "Input tokens read from cache" in a session of five
   turns. That counter adds up every turn's re-read of the context. In this seat's thirty
   traces the first model call carries about 39,300 tokens (42,250 with the habit text), and a
   session of three calls shows 92,155 read from cache. So the load at the start is about a
   quarter of the stated figure. D's traces were not kept, so this is a reading of its table
   against these traces and not a re-measurement. It matters for any design that prices a
   session or a sub-agent by its fixed load.
2. **"Sixteen of nineteen" means less than D and `where-we-are.md` use it to mean.** The
   comparison narrowed it after a reviewer's challenge: the nineteen are keeps that reappeared
   as candidates, out of 35, so the denominator is selected on recurrence, and "recurred" is one
   instance or more with no count of opportunities. D writes it as "sixteen of nineteen lessons
   with verified homes recurred within four weeks". Design should use the narrowed form.
3. **The comparison's recommended trial against what arrived after it.** Section 6.2 of the
   comparison stages a self-started seat's result as a draft pull request for the owner to
   accept, correct or close. C finds that reading a proposed change is the weak gate and that
   the method with reliable gains gates on execution. This seat's reflection adds that review
   is where the estate's cost has gone. D adds that a pass ending in better guidance inherits
   the unsolved problem of that guidance acting at the moment. None of these contradicts the
   node. Together they change the first experiment (section 7).
4. **Clock, signal or event.** B asks for a clock with a threshold. C finds clocks the rare
   trigger in public repositories, 21 of 217 loops against 180 on events. D finds a clock the
   wrong signal for stepping back and a sound one for reviewing accumulated experience. These
   are answers to different questions and they agree for the node's case: a start that is
   granted by a clock or an event and taken only when a computed threshold is met.
5. **Two rules of entry that pull against each other.** The staging file says to promote a
   lesson on its first instance. The rule `one-instance-is-an-observation` says one instance
   names no pattern. Both are in force. C supplies outside evidence for the second: a fallback
   that worked once was reinforced. The collection notes this three times and settles it
   nowhere.
6. **The owner's ruling on history against how the estate keeps evidence.** "Regarding history
   in rules, there should be none of that, same for skills, they must describe current
   requirements, not the evolution that arrived at them." Dated lines appear in 110 of 124 rule
   files and 41 of 78 skills, and the estate also holds that knowledge is not to be lost. The
   collection suggests where the evidence could live. The ruling itself is still in no rule,
   skill or register.

### Weaker than written, and left standing with this note

- **The sort of the rules into 90, 28 and 6** was one reader's, from names and descriptions.
  Section 6 gives a second reader's sort: the outline holds and six of the 28 do not.
- **The frames beyond the first** in the rules sort (what could mark a rule's moment, when it
  applies, whom it protects) are one reader's categories from one sitting, unchecked.
- **"170 patterns connected to nothing"** counts file names. A rule that restates a pattern
  without naming it is not counted, and the pattern bodies were not read.
- **The habit-text treatment changed two things at once**: the adapter carried the text, and it
  called the rule file a record in place of something to read and follow.
- **Everything about a skill's body surviving compaction as its adapter** is inference from
  documentation and has not been tried.
- **The first trial's support for the comparison's proposal** is, in its own words, "one hook
  firing in one session".

## 6. The two checks by readers who wrote none of it

### The rules, sorted again

A reader was given the 124 rules' names and descriptions and the three definitions in one line
each, and nothing else: not the first sort, not the rule bodies, not this directory. Its table
is [`rules-sort/second-sort.tsv`](rules-sort/second-sort.tsv).

| | First sort | Second sort | Agreement |
| --- | --- | --- | --- |
| Tied to a named activity | 90 | 92 | |
| A habit of mind | 28 | 27 | 22 by both, 33 by either |
| A pointer | 6 | 5 | |
| Kind, all rules | | | 112 of 124; Cohen's kappa 0.76 |
| What could mark the rule's moment, five values | | | 92 of 124; kappa 0.65 |
| Whether anything could mark it | 45 no | 40 no | 103 of 124; 32 "no" by both |

- **The sort holds in its outline and not at its edge.** About 28 habits of mind among about
  90 activity rules reproduces. Which rules are the habits reproduces for 22. Each of the six
  that only the first sort called a habit was the second reader's alternative, and with
  alternatives counted the two differ on one rule.
- **The finding that leaned on the sort survives both.** Of the eleven rules the delivery trial
  opened, both readers sort ten as activity rules and one, `verify-dont-trust`, as a habit. Of
  the 22 habits by both, 19 have nothing that could mark their moment by both.
- **The second reader found a kind the three do not hold.** A standing constraint or
  convention, such as `never-disable-checks`, `no-warning-toleration` or `use-result-pattern`,
  is not a habit of mind and is not tied to one activity. The first sort spread such rules
  across two kinds. A definition of what a rule is for will need a place for them.
- **It also found the markers too few.** A rule's moment can be marked by content (a forbidden
  string, a hash), by a clock, by a tool's output, or by computed state such as an overlap of
  claims. The first sort's five values had none of these.

The habit-text trial delivered the first sort's 28. Six of them are activity rules to the
second reader. The one instruction that separated treatment from control,
`scope-from-goal-before-approach`, is a habit by both.

### The numbers and the statements of absence

A reader who wrote none of the collection recomputed its counts from the tables, the
repository and the trial traces, and ran the search that would refute each statement that
something is absent. It was given the documents and no conclusion. This seat then checked each
difference it reported against the source before changing anything.

| Verdict | Claims |
| --- | --- |
| Reproduces | 62 |
| Differs | 14 |
| A statement of absence, not refuted by the search run | 14 |
| A statement of absence, refuted | 2 |
| Two documents contradict each other | 7 |
| Could not be checked | 1 |

**What reproduces.** Every table in the two trials, the rules sort and the patterns note was
recomputed. The trial's rule opens session by session, the marks by condition, the six cells
where the conditions differ, the split into 90, 28 and 6 with its character totals, the
adapter counts, the hook-policy names, the napkin mentions and the patterns tables are as
written.

**What was refuted.** That skill evaluation had one recorded run (section 5, item 1). And
that the habit-text trial's marking pack held nothing that revealed a condition: one treatment
answer of the thirty proposed a worktree path built from its clone's directory name,
`cloneT`. That answer was to a task on which every answer was marked alike, so no mark that
separates the conditions rests on it, and the trial's record now says the blind was not
complete.

**What differs and changes a reading.**

- **Seven of the delivery trial's ten sessions opened a rule, not six.** The trial's own table
  showed seven; its summary sentence and `where-we-are.md` said six.
- **The habit text is not smaller than the pointers.** The 103 always-loaded pointers total
  6,780 characters. The rules sort gave them 9,931, which is all 124 adapters, and concluded
  that 6,859 characters of habit text "would cost less" than the pointers. It is 79 characters
  more than all 103, and it would replace only the 28 habit rules' own pointers. The trial
  measured the net cost: about 2,900 tokens on a start of about 39,300.
- **Most of the 28 habit rules were given a moment by the same sort that called them habits.**
  Eleven sit in the sort's "any time" group; seventeen were placed at planning, team sessions,
  documents, editing, claims or loops. With the second reader's result, this says the line
  between a habit and a rule for an activity is not sharp, and a definition should not assume
  it is.
- **All ten sessions of the delivery trial's faulty first run received the task list**, not
  five. Five answered every task. Only the second run was ever reported, so no result moves.

**What differs and changes nothing.** The habit-text trial cost 13.02 US dollars, not 13.04.
Two medians were upper-middle values (6,927 for 6,872.5; 268 for 266.5). One row of a table is
two characters short. The patterns note's 175 behavioural patterns need two one-off category
values to reach 175, and its character total is the 246 files without their README. The
comparison counted four skill files carrying a prediction sentence where there are two. The
driver script printed in the delivery trial differed from the file by a comment and a last
line. Each is corrected where it stands.

**Statements of absence that survived the search**, and what the search was: nothing in the
repository starts a refinement step (scheduled workflows are code scanning and the two
upstream ones; the hooks cover four events, none a session's end; the Codex and Cursor hook
configurations were not parsed). The three consolidation nodes have no implementation by name.
The design-space plan's six todos are all `pending`. No session in thirty called the `Skill`
tool. No commit after 15 October 2026 names a consolidation or a rotation in its subject. The
owner's ruling on history is in no rule, skill, directive or decision record.

**Not reached by the reader:** the comparison's rows P-4, P-8 and P-9 and half of P-7; its
quotations from the napkin; the slow-lane and recurrence-ledger dates; and this review, which
was written while the check ran.

### The September evaluation runs

Once this review had found the nineteen runs, a reader was given their readings and result
files, and nothing from this collection, and asked what they show about whether a skill's
text changed the answers. The runs are another seat's work of 27 and 28 September 2026 on five
skills: `plan`, `user-value`, `specify`, `assess-specification` and `specify-connection`. Each
case was answered once with the skill available and once without, in an empty workspace, with
a smaller model as judge on the final message, and then read by the agent that ran it.
This seat opened two of the nineteen readings; the figures below are the reader's coding of
all of them.

| | By the judge | By the run's own reader |
| --- | --- | --- |
| Case-runs, over 30 cases | 59 | 59 |
| Held with the skill and not without | 17 | 4 |
| Held in both arms | 27 | 46, in 11 of them the arm without the skill only "in substance" |
| Held in neither | 14 | 6 |
| Held without the skill and not with | 1 | 0 |
| Not stated | | 3 |

- **The judge and the reader disagree often, and in one direction.** They differ on 28 of 114
  verdicts on an arm, and in 27 the reader holds an answer the judge failed. Of the judge's 17
  separations, the reader calls 13 a hold in both arms.
- **The answer without the skill usually did what the skill asks.** One reading says so
  outright: "The assertions did not discriminate the arms". The readings say what the skill
  added: "structure the assertions do not require".
- **Where the reader saw a difference of substance it was specific and it repeated.** In one
  planning case the arm with the skill traced a revision through every artefact and the arm
  without did not, in two runs. Of one skill, `specify`, its reading says "The arms differ on
  this fixture".
- **A run changed a skill's text once.** The control case of one suite failed with the skill
  and without it, the reading called it "the one substantive finding about the skill in this
  suite", and the skill gained a clause. Eight other changes after a run were to a case's
  wording or its expected outcome, and one was to the grader.
- **In the harness a skill is chosen from its description.** 43 of 43 prompts that should have
  chosen the skill did. Three that should not have were counted as misses in one run, and the
  reading puts that on the grader, which was then changed.
- **The limits are the ones the November trials have, and one more.** One run for each arm; a
  judge reading only the final message; self-contained prompts in an empty workspace. The
  judge's verdict on an answer without the skill changed between runs in four cases whose
  wording had not. And every reading is by the agent that wrote the cases and ran them.

**What this adds to the collection.** Two bodies of first-hand evidence, made by different
seats two months apart with different instruments, one on skills and one on rules, have the
same shape. On short, self-contained tasks the answer without the text is already close to what
the text asks for. What the text visibly adds is form and structure. A difference of substance
is rare, specific to a case, and needs a person's kind of reading to find. Neither body says
what happens in long work, and both were read and judged by one model family. Unlike the
shared diagnosis of section 1, this agreement does not rest on the three shared records.

**One contrast it exposes.** In the harness, with only the carried skills present, the skill
was chosen every time it should have been. In this collection's thirty sessions in the whole
repository, with 118 skills listed, no session called the `Skill` tool, on tasks that included
writing a commit and writing a plan. In the delivery trial both sessions on the commit task
opened the commit skill's file by path. So a description that selects its skill in isolation was not what
selected it among the estate's full listing.

Two checks this seat made directly, from the trial traces. A record of each session drawn
from them is now kept in [`trial-evidence/`](trial-evidence/README.md):

- **Nothing was listed twice.** The owner's condition for replacing pointers with copied text
  is that nothing ends up loaded twice, "e.g. Claude loading skills from both .claude and
  .agents". `.claude/skills` and `.agents/skills` hold the same 87 names. Each trial session's
  start-up event listed 118 skills, all distinct: the 78 `oak-` skills once each, nine others
  from the repository, and 31 that the platform or its plugins supply. So Claude Code 2.1.322
  listed each of the estate's skills once. Whether it ignored the second directory or removed
  duplicates by name cannot be told from the list. For rules, this session's own context holds
  adapters from `.claude/rules` and none from `.agents/rules`.
- **All 28 habit rules' adapters are unscoped**, so the habit-text treatment was in context
  from the first turn in every treatment session, as the check session had shown for two.

## 7. Is it enough to start design

Two designs wait on this review. They are different pieces of work.

### The rules and skills system

The owner's specification: "not the specific instances, but the qualities of each, their
relationships, and the mechanisms that allow them to bring about impact, their contracts and
constraints", across platforms, with copied text for each platform acceptable "as long as we
don't end up loading things twice".

**Enough for Claude Code.** The collection gives the platform's contract for each
(`claude-code-rules-and-skills-loading.md`), the estate's own doctrine and where practice has
left it (`rules-sort/rules-and-skills-use.md`), what a session does with each
(`delivery-trial.md`, `habit-text-trial.md`), and what the estate holds (`rules-sort/`).

**Not enough across platforms.** The estate renders for at least four others, and they are not
alike today:

| Platform surface | What the estate renders | What the collection knows of how it loads |
| --- | --- | --- |
| `.claude/rules`, `.claude/skills`, `CLAUDE.md` | 124 pointer adapters, 21 path-scoped; 87 skill adapters; an entry file that says to read `AGENT.md` | Documented and measured |
| `.cursor/rules` | 124 files that carry each rule's description in frontmatter, 75 marked always-apply and 49 not, then the pointer | Nothing |
| `.agents/rules`, `.agents/skills`, `AGENTS.md` | 124 pointers; 87 skill adapters with the same names and descriptions as Claude's; an entry file | Nothing, beyond the one check in section 6 |
| `.codex` | One rules file of another kind, agents, hooks, a configuration file | Nothing |
| `GEMINI.md`, `.gemini/commands` | An entry file and 19 commands; no rules | Nothing |
| `.github/copilot-instructions.md` | An entry file | Nothing |

**Added the same day, after the review.** The Cursor row has since been answered from
Cursor's documentation: [`cursor-rules-and-skills-loading.md`](cursor-rules-and-skills-loading.md).
By that documentation Cursor loads skills from both `.agents/skills` and `.claude/skills`, so
the estate's skills are discovered twice there. The `.agents` and `.codex` rows have been
answered from OpenAI's documentation:
[`codex-rules-and-skills-loading.md`](codex-rules-and-skills-loading.md). By that
documentation Codex loads no rule file at all, and nothing twice. Neither note was checked by
a reader as sections 5 and 6 checked the rest, and nothing was observed in a running Cursor
or Codex. The Gemini and Copilot rows are unanswered and, by the owner's word on which
platforms matter, will stay so.

So the platforms already receive different things. Twenty-eight rules that the estate calls
`situational` are always-loaded pointers on Claude Code, because their adapters carry no path
scope, and are not marked always-apply on Cursor. The first step of the definition is therefore to find out, from each vendor's
documentation and the adapters, what each platform puts in front of the model and when. The
method that answered it for Claude Code in an afternoon will serve.

**What the definition can already rest on.** A rule's one strength on this platform is that
its text is present without anyone choosing, and the estate does not use it. A skill's
strengths are that it costs a description until used, can be started by name, and can be
tested. Neither enforces anything. Habits of mind are few (27 and 28 by two sorts, 22 by
both), short when stated (about 6,900 characters together, or about 2,900 tokens added to a
session's start as the trial delivered them), mostly without a moment that anything but
recall can mark, and are the rules a session does not open. Rules tied to an activity were opened when the task was on their subject and mostly belong to a moment
that already has a skill. Evidence and history have no assigned home.

**What the definition must not assume.** That every rule is one of those two kinds. Both
sorts strained on standing constraints and conventions, which hold at all times and are not
habits of mind, and the two readers disagreed about six of the 28. The kinds are a first cut
made from descriptions, and the definition should derive its own from what each kind needs
from a platform. Nor that a description which selects its skill in a test harness will select
it among the estate's full listing, or that text alone changes a judgement the model already
makes: section 6 has the evidence on both.

### The node's experiment

The node's order is: inputs arrive, the work is reviewed, the design is written, the
experiment runs with the owner's permission for its sessions. The first two are now done.

**Enough to write the design**, taking from the collection four constraints that the
comparison's proposal of a scheduled seat and a draft pull request did not have:

1. **A standing brief, not only a start.** B: "A tick with no brief has nothing to act on."
   The estate's one automatic start shows it: an alert to a seat with no brief to act on it.
   Much of the brief exists in three ratified nodes and the consolidation skill.
2. **The first job subtracts.** Decide what is already owed and drain what is already
   captured. A pass that writes new guidance hands its output to the delivery and firing
   problem that this collection measured and did not solve.
3. **The result is judged by something it must pass, and not only by being read.** The
   estate's fitness tool already computes candidates: the register's count of undecided
   entries, the age of the oldest, the state of each buffer. A model judging a final message
   is not such a thing by itself: in the September runs it disagreed with the reader on a
   quarter of its verdicts.
4. **The start is taken on a threshold.** A clock or an event grants the opportunity. A
   computed signal decides whether to take it.

**What the design still lacks, and none of it is research.** The owner's answers to the
node's seven questions. A trial of the platform route, since no scheduled trigger has been
created. And the order of the two designs. This seat's recommendation is the rules and skills
definition first. The owner named it as the preference for next steps, and it decides what a
refinement pass is allowed to write. An experiment whose first job only decides and drains
does not depend on it and could be designed alongside.

## 8. What nobody has looked at

- The nineteen readings of the September skill-evaluation runs, by this seat beyond two of
  them. A reader coded all nineteen for section 6. Nobody has yet read them for what they say
  a skill's text should and should not be asked to do.
- How any platform other than Claude Code loads rules and skills, when this review was
  written. Since then Cursor and Codex have been read from their vendors' documentation (the
  addition in section 7). What a running Codex or Cursor session loads has still been
  observed by nobody.
- A long session with a shell and edits: whether path-scoped rules arrive as files are touched,
  and what survives a compaction. Every trial here was one turn, read-only.
- Whether a rule that was not read was then broken. No trial tempted a breach. D's scenarios
  are built to do that for errors of frame and have not been run.
- Why no session of thirty called the `Skill` tool when the harness shows descriptions
  selecting their skills (section 6). The listing's size, the read-only tool set and the
  single turn are each a candidate, and none was varied.
- The six lanes that stand on this one diagnosis, set side by side: the Attendant;
  self-starting refinement; outcome-informed Practice learning; the three consolidation nodes
  of September; the action-time interrupt design space; PDR-130's predictions.
- Any of it by a reader that is not this model family. The estate has a skill for handing a
  bounded task to another vendor's agent. It was not used here, because it sends repository
  content to a service this session was not asked to use.
- The owner's own sense of where the estate is, which no record states.

## 9. For the owner

All four are closed, the same day.

1. **The ratified node carried this seat's label "joint review" and an order the owner had
   since changed.** The node now says "the review of the collection" and records the
   delegation. This seat held that correction back as a question when the text was known
   wrong and its replacement known; the owner said so, and the correction was made.
2. **Which design is first.** The rules and skills system, by the owner's ratification of
   its plan.
3. **Whether a reader of another model family checks this review.** Codex reviewed pull
   request 397, at the owner's word, and its findings are applied.
4. **Whether pull request 397 leaves draft.** It has.

## 10. Limits of this review

- Written by the author of most of what it reviews.
- All three checking readers are the author's model family.
- The figures on the September evaluation runs are one reader's coding of another seat's
  readings. This seat opened two of the nineteen.
- C and D were read in their findings and not in their evidence. Six of C's evidence rows were
  checked against what this collection cites from them and agree.
- The correction to D's fixed-load figure rests on this seat's traces and on D's table, not on
  D's traces.
- The three readers used about 705,000 tokens between them: 127,000 for the second sort,
  314,000 for the check of counts and absences, 264,000 for the September runs. This seat's
  estimate before launching the first two was 150,000 to 250,000.
- A day's work, on a repository as it stood on 12 November 2026.
