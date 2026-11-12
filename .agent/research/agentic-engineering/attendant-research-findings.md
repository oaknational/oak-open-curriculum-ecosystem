# Attendant research: findings

The findings of the research step
[`attendant-research`](../../plans/delivery/attendant-research.plan.md), one section per
question. Research seat: Limpet lifts Spray. Status: in progress; a section with no content yet
says so.

## Method and launch record for the corpus read (question 1)

**Warrant.** What is measured: the instances in which the owner caught something agents had
missed. Why: the stepping-back mechanism is to be designed and tested against what the owner
actually catches. Value expected: a classification with, for each class, the question that would
have caught it and the moment to ask it; and real instances to write as evaluation scenarios.
The owner's original ask (2026-11-10): "One of the main goals of this work is to create a
reliable, effective mechanism for automatically stepping back and questioning the bigger picture
frame, motivation, and nature of the work."

**Yield sample, read at the seat (2026-11-12).** Four units read in full:
`.agent/memory/executive/owner-signal-interpretation.md` and the rules
`scope-from-goal-before-approach`, `re-apply-first-question-at-elaboration-boundaries` and
`design-from-impact-not-the-cowpath`. Every unit carried instances, between three and twelve
each. The yield is high, so an instrument is warranted.

**Instrument.** The corpus is too large to read at one seat: the rules that match the plan's
pattern are 620,392 characters, the nine `why-…` records about 300,000. A script
(blank-line paragraphs that name the owner and carry a date) cuts the rules to 343 paragraphs of
357,555 characters across 96 rule files, the retrospectives to 109 paragraphs of 173,699
characters, and the Cricket tallies with the rulings ledger to 40 paragraphs of 56,745
characters. Reader legs on a middle tier extract instances from those excerpts in a fixed row
shape under one identical frame; the seat checks every quotation against its source file by
fixed string before use, classifies, and writes the scenarios. No verify phase: the seat
verifies at application.

**Pilot (one leg, measured).** Unit: the first 54,463 characters of rule excerpts. Result: 20
instances, 2 excerpts excluded, 1 source marked unsure; 121,367 tokens, 3 tool calls, 73
seconds. About 107,000 of those tokens are the fixed load every sub-agent in this repository
carries before it reads its unit.

**Estimate.** Because the fixed load dominates, fewer and larger legs cost less. Planned
fan-out, each leg about 100,000 to 120,000 characters of excerpts:

| Phase | Units | Legs | Tokens per leg | Total |
| --- | --- | --- | --- | --- |
| Rules excerpts (the rest: 309,000 characters) | 3 | 3 | about 140,000 | about 420,000 |
| `why-…` and other retrospectives, excerpts (174,000 characters) | 2 | 2 | about 135,000 | about 270,000 |
| Cricket tallies and rulings ledger, excerpts (57,000 characters) | 1 | 1 | about 125,000 | about 125,000 |
| Sum | 6 | 6 | | about 815,000 |

The budget is the sum plus one fifth, 980,000 tokens; the fan-out stops if it is crossed. The
twelve reports the brief lists, the experience files, thread records and napkin archives are
outside this fan-out: they come under the plan's stopping rule and are searched at the seat.

The estimate crosses the estate's line for a potentially expensive fleet (about 500,000
tokens), so the design is reviewed before the owner prices it
(`fleet-design-review-before-expensive-fleets`).

**Design review, 2026-11-12: three reviewers, three verdicts of "revise".** The returns are
saved as returned in
[`fleet-design-review.md`](attendant-research-working/fleet-design-review.md). The fan-out was
not launched. The findings the seat checked and accepts:

| Finding | Seat's check | Cure |
| --- | --- | --- |
| The filter drops the causal account from the `why-…` records: 65 of 392 paragraphs kept, and "review happens inside the frame it is handed" is absent from every unit (assumptions F1, methodology F2). | Confirmed at the seat: the sentence is in the record read whole and was not in the excerpts. | The nine `why-…` records are read whole at the seat, as the plan already requires. No leg reads them. |
| The date condition drops owner catches in the rules: 230 paragraphs name the owner with no date, 50 of them with a quotation (assumptions F2, methodology F1). | Not yet re-measured at the seat. | The filter becomes owner and (a date, or a quotation, or a correction word), and each hit carries its neighbouring paragraphs. Recall is measured on the four hand-read units before any leg runs. |
| The `ABOUT` field hands the legs the plan's seed classes; `QUESTION` and `MOMENT` are hindsight written by several readers (assumptions F3 and F6, methodology F3). | Confirmed by reading the frame against the plan. | Legs return only the source, the date, the owner's words, what the agent was doing, what was wrong, and what the owner needed. The seat classifies once, across all rows. |
| The include rule screens out a catch stated as a rule, and a catch of work that should not exist (methodology F4). | Confirmed: the pilot excluded two excerpts and nothing shows what they held. | A flag for a catch stated as a rule with its instance implicit; owner questions that exposed a premise are included. |
| No field asks which existing step-back instrument was in force and did not fire, so question 3 cannot be answered from the rows (Cricket). | Confirmed. | A field for the instrument the source itself names as in force. |
| The instrument was sized on volume, not on class saturation; about fifty instances are in hand unclassified (assumptions F4, Cricket). | Confirmed. | The seat classifies the instances in hand first, and records how many classes the pilot's twenty added. |
| The estimate priced six units that were never built or piloted at size (assumptions F5). | Confirmed: twelve units of at most 59,000 characters exist. | Re-priced below, at the piloted size. |
| Rows repeat across units (assumptions F7, methodology F6). | Confirmed in the pilot: one instance cites two rule files. | A script keys each row on its date and the first forty characters of the owner's words, and merges before counting or assigning a scenario to a file. |
| The result is a classification of catches that were recorded, not of all catches (methodology F5). | Accepted as a limit. | Stated in question 1's answer. |

**Revised design.** Stage 1, at the seat, no fan-out: the nine `why-…` records whole; the
classification of the instances in hand. Stage 2, legs on the rule excerpts only, in pairs at
the piloted unit size, the seat classifying each pair's rows before the next pair runs. A pair
that adds no class and no instance that changes a class's question or its moment ends the
fan-out.

**Revised estimate.** One leg costs about 121,000 tokens at the piloted size. Six rule units
remain under the old filter, and the wider filter adds perhaps a third: at most eight legs,
about 970,000 tokens if every pair runs, about 240,000 if the first pair shows saturation.
Spent so far on this instrument: the pilot, 121,367; the review, 209,250.

**Two things for the owner.** The price of stage 2, which crosses the estate's line if more
than four legs run. And one departure from the plan: its stopping rule "is not applied before
the rules, the owner-signal file and the nine `why-…` records have all been read", while all
three reviewers and the seat now judge that the rule files should be harvested only until the
classes stop changing. The seat's recommendation is that departure, because the deliverable is
classes with at most three scenarios each, and the instances in hand already number about
fifty.

## Question 1: what the owner has caught that agents missed

**Status: a first classification, from the instances in hand.** Sources so far: the
owner-signal file, three rules and eight `why-…` records read whole at the seat (the reading
ledger has each), and the pilot leg's twenty rows from the first seventh of the rule excerpts.
About seventy instances. The limit that stands whatever else is read: this is a classification
of catches that someone wrote down, and the estate's own records say that record over-states
owner corrections and under-states what was absorbed in a turn.

**Did the pilot's twenty rows add a class?** No. All twenty fall in classes the hand-read
sources had already produced, and twelve of the twenty fall in one class, the last in the table,
which is outside what a stepping-back mechanism is for.

The classes, by what was wrong. The quotations are the owner's unless marked, each checked
against its file.

| Class | What was wrong | Instances (examples) | The question that would have caught it | The moment to ask it |
| --- | --- | --- | --- | --- |
| 1. The owner's words were read wrongly | The work began from a reading of the owner that the owner had not given: a question read as a licence, a hedge as a grant, a rule widened by reflection, a guide for the whole applied to each part, a constraint from one day carried into another. | "I asked what you thought, I didn't say edit"; "wow, that's a lot of assumptions that are not what I said"; "that quota was for a specific situation and no longer applies, please do not silently limit yourself, always ask" | What exactly did the owner say, about what, and which part of what I am about to do is my own inference? | On receiving the owner's turn, before the first act; and at the pickup of any recorded direction. |
| 2. Asked, or waited, when the answer was already given | A question went to the owner, or a seat held, when a standing word, a principle or the purpose itself settled it. | "This shouldn't be a question, we are bringing both estates to the same level of capability"; "you have permission to commit — all agents ALL ALWAYS have permission to commit"; "so why the hell are you asking?" | Does a standing word, a principle or the purpose already answer this, leaving only how? | Before sending a question to the owner; before a hold. |
| 3. The work grew past the ask | Each step was defensible and the whole was not what was asked. | "I asked for an update of deps, not an overhaul of settled architecture"; the owner's "are we doing the right thing?" after twenty-five review-cure commits "for configurations the estate does not have" (the record's words) | What was the literal ask, and is this step inside it? | Before each new investigative step; when a loop runs at a steady beat past the point the ask was met. |
| 4. The job's own measure did not move | True, well-formed activity displaced the one thing asked for, and the reports read as progress. | "how is it, when the only job I gave you was to drain the buffers, they are still critical 2 days later?"; "Your one job was to review PR 66, have you done that?"; nine of twenty-one stories whole after 235 merged pull requests | What is the one measure of the job I was given, and did this turn move it? | At every report and every pickup. |
| 5. The thing should not exist, or already does | A mechanism was built, hardened or kept running when the right move was to remove it, not build it, or use what the estate had. | "Mechanisms aren't purpose, design is not impact. What is the work trying to achieve and why, what is the value, to whom, when. That is all that matters."; four reviewers who each made a workflow step safer and "None asked whether the workflow should supersede at all" (the record's words); a shell splitter written beside one the estate had | What is this for, who needs it, what breaks if it is never done, and can something be removed instead? | When a step has grown past its one-line proposal; at the second cure of one thing; at the first cycle of a build. |
| 6. The frame was inherited and never examined | The unit of work, the definition or the design came from a predecessor, a precedent or the existing shape, and sized everything after it. | "And I am telling you, that means we are doing it wrong."; "Precedent is NOT correctness"; "it might just be the opinion of a prior agent, redigested repeatedly until it gained authority." | What am I assuming this work is, where did that come from, and did the owner ever say it? | At plan start; when an estimate passes twice the owner's guide; at the pickup of a handed frame. |
| 7. The instrument was the wrong size | The apparatus outweighed the question: a fleet, a ceremony, an investigation where a look would do. | "please remember: step back and be sensible."; "your dynamic workflows have been eating tokens at an incredible rate"; a card that offered "investigate first" when "the thirty-second baseline was available" (the record's words) | What is the cheapest thing that would settle this, and why am I not doing that? | Before any fleet, card, or formal record. |
| 8. Something standing was silently dropped | A proposal or a scope carried forward less than was there, with nothing said. | "I shouldn't have to say things like 'Sentry needs to keep working'" | What that works or is owed today does this stop carrying? | Before proposing or changing a configuration or a scope. |
| 9. A claim outran what was looked at | A statement of fact, completeness or closure with no first-hand read behind it. | "did you even check?"; "I believe there was also a Decide workflow?"; "do NOT make up identities." | What did I actually look at? | At the moment of writing "all", "none", "complete", or any value recalled and not read. |
| 10. An operating practice was not followed | The rule existed and the act broke it: which identity, which branch, how often to commit, who runs the gates. | "the commit triggers the gates, there is no point and a fair amount of cost running the gates separately as well, never, ever do that"; "the coordination branch shouldn't be a worktree" | (A question about the practice concerned, different for each.) | At the act. |

**What the classes say about the mechanism.**

- Classes 1 to 8 are errors about the work's frame, purpose, size or relation to the owner's
  words. They are what the owner's sentence names: "the bigger picture frame, motivation, and
  nature of the work". Classes 9 and 10 are not. Class 9 is the estate's claim-verification
  practice's ground, and class 10 is rule-following. A stepping-back mechanism that tried to
  cover them would be a second copy of the rule corpus.
- Class 1 is not in the plan's seed list, and it comes first in time. A check that asks "is this
  the right work?" inside the seat's own reading of the owner cannot see it. The check has to
  put the reading beside the owner's words.
- Class 2 runs the other way from the rest: the error is stopping, not continuing. A mechanism
  whose only output is "pause and reconsider" makes class 2 worse. The return has to be able to
  say that the matter is already answered and the seat should proceed.
- The moments fall into two kinds. Some an environment can see without the agent's judgement: an
  owner turn arriving, a question about to be sent, a report about to be written, an estimate
  revised upward, a second cure of one thing, a loop at a steady beat. Others only the agent can
  see: that a step has grown, or that a frame was handed over. Question 4 takes this up.
- In several of the strongest instances the owner's catch was one sentence and it worked at
  once: "are we doing the right thing?"; "that means we are doing it wrong"; the one-line
  instruction that emptied a register in forty minutes. The owner's question was not cleverer
  than the estate's written ones. It came from outside the seat's frame, and it came whether or
  not the seat thought it needed it.

**Still owed for question 1:** the rule files beyond the pilot's seventh; the other
retrospectives, the Cricket tallies and the rulings ledger, under the stopping rule; one
`why-…` record read only in part; the scenarios.

## Question 2: what the owner must see at approval and at the sense check

Not yet written.

## Question 3: why the step-back instruments only partly succeed

Not yet written.

## Question 4: what each lever can do, and whether the evaluation can be run

Not yet written.

## Question 5: which of the reference point's mechanics the Practice already holds

Not yet written.
