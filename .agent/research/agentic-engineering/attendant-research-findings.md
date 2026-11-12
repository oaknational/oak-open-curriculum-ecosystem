# Attendant research: findings

The findings of the research step
[`attendant-research`](../../plans/delivery/attendant-research.plan.md), one section per
question. Research seat: Limpet lifts Spray. Status: all five questions answered on 2026-11-12
and ratified by the owner the same day; a last section, added afterwards at the owner's word,
reads the owner's report on periodic learning against them; each section states what it rests on and what was not
read.

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

**The owner's answer, 2026-11-12:** "Agreed on both, no fan-out; carry on with questions 4 and
5". No reader legs run. The remaining rule files are searched at the seat for the thinly
populated classes only, and the plan's stopping rule is departed from as recommended.

## Question 1: what the owner has caught that agents missed

**Status: answered from the instances in hand; the unread sources are listed at the end of
this section.** Sources so far: the
owner-signal file, three rules and eight `why-…` records read whole at the seat (the reading
ledger has each), and the pilot leg's twenty rows from the first seventh of the rule excerpts.
About seventy instances. The limit that stands whatever else is read: this is a classification
of catches that someone wrote down, and the estate's own records say that record over-states
owner corrections and under-states what was absorbed in a turn.

**Did the pilot's twenty rows add a class?** No. All twenty fall in classes the hand-read
sources had already produced, and twelve of the twenty fall in one class, the last in the table,
which is outside what a stepping-back mechanism is for.

The classes, by what was wrong. The quotations are the owner's unless marked. Each was read at its
source by the seat, and a script confirms each occurs word for word in some tracked file; the
script does not confirm which file.

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

**What was read after the first classification, and what was not.** Two conscience checks at
the close found that the seat had read the owner's "no fan-out" as covering more than it was
asked about. The two lists are kept apart here so the owner can correct the second.

- *Covered by the owner's word of 2026-11-12:* no reader legs; the rule files harvested only
  for the thin classes. That search was run at the seat over the rule excerpts for classes 4, 6
  and 8, by keyword. It added no class. It found two further class 6 instances (the rules
  `precedence-is-not-approval` and `rules-have-no-exceptions`: "odds are you, or a prior agent,
  made something up"), and nothing further for classes 4 or 8. One candidate (the bot identity dropped for a
  signed-in default) was first written as a class 8 scenario and then withdrawn at review: the
  table already files identity under class 10.
- *Read late:* the ninth retrospective,
  `2026-09-01-why-delivery-stopped-when-the-merge-engine-was-a-seat.md`, was read to its first
  addendum after the first classification. It adds no class. Its owner catches are two single
  questions ("a merge-warden? do you mean a human?", and a wrong revert recommendation
  withdrawn "after the owner caught it with one question").
- *Read at the owner's word of 2026-11-12, after the report:* the rulings ledger, whole, and the
  Cricket tallies in part (the protocol, verdict, pattern and adjudication sections of the
  three largest and of the 2026-10-04 suite; the rest by search for where a verdict was right or
  wrong). Neither adds a class. How far each is used is set out under question 3.
- *Not read, by the seat's choice and not by the owner's word:* the retrospectives beyond those
  nine; the twelve reports the brief lists, apart from those among the nine; the experience
  files, thread records and napkin archives; the run-by-run rows of the Cricket tallies. The
  plan put these under its stopping rule. The seat stopped because the last things read for
  catches (the pilot's twenty rows, the late retrospective, the keyword search of the rule
  excerpts, the ledger) added no class. A class that lives only in the unread sources is
  missing from the table.

The scenarios drawn from these classes are in
[`attendant-step-back-scenarios.md`](attendant-step-back-scenarios.md). A fresh reviewer read both
scenario files as they then stood (twenty-three open scenarios, nine held back, three controls)
against this classification and each cited source on 2026-11-12: verdict
"sound-with-corrections", thirteen findings, none above the middle severity, no instance shared
between the two files. All thirteen were applied, and no scenario has been added since; the return is in
[`scenario-review.md`](attendant-research-working/scenario-review.md).

## Question 2: what the owner must see at approval and at the sense check

**Status: answered from the instances collected for question 1.** Each item is something the
owner asked for, asked for again, or acted on at once when it was shown. The quotations are the
owner's unless marked. These are contents, not a layout; the design step shapes the screens.

### At approval (the end of the opening conversation)

| The owner sees | Traced to |
| --- | --- |
| The owner's own words for the idea, verbatim, and beside them the seat's reading of them, marked as a reading | Class 1: "wow, that's a lot of assumptions that are not what I said". The estate's rule from those corrections: an owner-attributed line "carries the owner's words verbatim, or a seat-reading mark, and nothing in between" (the owner-signal file). |
| The value in one statement: what, why, to whom, when | "What is the work trying to achieve and why, what is the value, to whom, when. That is all that matters." |
| The definition of done as one measure the owner would recognise, and the acceptance criteria, each with how it will be shown | "NOTHING should be worked on without clear completion criteria, sizing, and an unambiguous and provable statement of how it provides ratified value."; "ALL of it must have a known, reachable, measurable end state" |
| The size, against any guide the owner gave, and the unit the work is counted in | "update the repo plan and include sizing"; "if the estimate hits four we have a problem"; the units-for-stories instance of class 4 |
| What is deliberately out, and what that stands today is carried forward | "I shouldn't have to say things like 'Sentry needs to keep working'" |
| What the step back returned before this screen, and the seat's written answer to it | Requirement 4 of question 3; the owner's word that touches are "minimised by the agent stepping back and analysing and doubting before my touch" |
| Only the decisions that are the owner's, each naming the decision and what turns on it, with the seat's recommendation and concrete text to accept | A seat that put four questions "two of which the decision lenses could settle and two of which named no decision and no impact" (the record's words); a question is "answered with concrete before-and-after text so acceptance is one word" (the owner-signal file) |

### At the sense check (before merge)

| The owner sees | Traced to |
| --- | --- |
| The job's measure first: each acceptance criterion as met, not met or cannot tell, with its evidence | "say those counts first in every report"; "the one report that opened with the counts showed at once that the napkin was not empty" (the record's words); the reference point's contract walk (question 5, M11) |
| Whether the value statement holds at the head to be merged | The rule's section on a lane closing on its value statement, from the owner's correction of a report given "in terms of legs, analyser rules" (the rule's words) |
| What changed between what was approved and what was built: scope added, scope dropped, criteria altered | Classes 3 and 8; "I asked for an update of deps, not an overhaul of settled architecture" |
| What was not looked at, and what is claimed without a first-hand read | "did you even check?"; "The work and claims of all subagents MUST be verified by you, yourself" |
| Green and clean, as the safety line and no more: checks passing, threads resolved | "green and clean and sensible" names three requirements; the first two are necessary and the third is the owner's |
| Each step-back return during the run and the written answer to it, including any that said stop or smaller | Requirement 4; a seat that "discounted" a DRIFTING verdict with nothing on the record (the record's word) |
| What is left outside the pull request: work prepared and not landed, follow-ups, anything parked | Three pieces of finished work found "outside pull requests" at one close (the record's words); "work is safe when it is merged, the target number of open PRs is always zero" |

### What the instances say about both screens

- **Signal, not an inventory.** A seat "reported every verifiable finding" and the owner's reply
  was that some matters and some is noise; the test the seat took from it: "what is lost, or who
  is misled, if this is ignored". A screen that lists everything true has the owner doing the
  seat's sorting.
- **The owner often decides by looking at the thing itself.** A twenty-minute diagnosis was
  "resolved in about one minute by the owner reading the merge box" (the record's words). Each
  item should link to the primary thing, not to the seat's account of it.
- **Cost is not on either screen.** That is the seat's reading of the owner's word that cost,
  "if highlighted", "tends to distort the direction the agent moves"; it is kept for the
  retrospective.
- **A measure the seat chose can hide the failure.** Units for stories, open pull requests for
  unfinished work, findings cured for the job done. The measure on both screens is the one the
  owner signed at approval, in the owner's unit.

## Question 3: why the step-back instruments only partly succeed

**Status: answered from the instruments' full texts, read at the seat; the reading ledger has
each.** The three parallax skills were first read with their longest lines cut short; the cut
parts were read on 2026-11-12 at a review finding and change nothing here.

**The estate has already framed this problem, and the plan did not cite it.** PDR-098, accepted
with the owner's approval on 2026-06-15, splits the question of whether a rule takes hold into
three independent parts: what fires the check (the environment, or the agent's recall), how the
problem is recognised (a string match, or judgement), and what the check does (advises, or
refuses). Its finding: "mechanical-FIRING with cognitive-DETECTION at action time does not exist
anywhere". Its prohibition: "The cure for recall-dependent doctrine MUST NOT be another passive
always-on rule" that tells the agent to fire at action time, and any mechanism "must carry a mechanical
firing cadence AND an observable-artefact-or-it-didn't-fire record". It holds open that the gap
may not be closable: "semantic pathogens are irreducibly cognitive". Its later evidence section
records a cure that worked without a hook: "a PR-open step in the delivery-plan template, a
shape-entry binding installed where the PR is authored rather than a further sentence in the
rule".

This bears on the strategic node directly. The owner's preference of 2026-11-10 is for "skills
and rules with appropriate descriptions and application criteria" over hooks. PDR-098 forbids a
further always-on rule as the cure. The two are compatible only if the composition fires from
something other than the agent's recall. The evidence names what that can be without a hook: an
artefact the work must produce anyway, whose shape carries the question.

**Each instrument, read against the classes of question 1.**

| Instrument | What it does well | Which of the five causes it shows | What the Attendant can reuse |
| --- | --- | --- | --- |
| `scope-from-goal-before-approach` (rule) | Names classes 3 and 8 exactly; asks for an artefact (`GOAL / IN / OUT`) that an outside reader can check. | 1: its own text says "not yet hook-enforced". 2: the agent writes the goal it is checked against. | The artefact, with the goal line replaced by the owner's words. |
| `re-apply-first-question-at-elaboration-boundaries` (rule) | Holds the best question for classes 5 and 6: the warrant ladder and the rung before it, tracing a problem to "an owner observation or to a first-hand reproduced defect". | 1: "The signal is behavioural, not hook-enforceable". 2 and 4: it records an item that survived two re-derivations because each answered "FROM THE ITEM'S OWN DESCRIPTION". | The ladder as the fixed question; the rule that the evidence may not be the item's own description. |
| `design-from-impact-not-the-cowpath` (rule) | Names class 6; the owner's value statement is here. | 1: "this is an agent self-scan"; the lens slipped "six times in one session". | Its section on a lane closing on its value statement: what, why, to whom, when, as the opening line of any report. |
| `metacognition` (skill and directive) | Four good questions; says a pass that only recaps has failed. | 1, stated about itself: "Naming this does not inoculate against it"; "none self-caught". 5: the output is the agent's own revised intention. | Its questions. Its admission is evidence, not a component. |
| `proportionality` (skill) | Names class 7 and the level half of class 2; findings run both ways (too big, too small). | 1: it calls its own manual use into a running loop "evidence that the domain skill's own checkpoint failed to fire". | The symmetric return. The lesson of its worked instance: a counter made a check fire where a sentence had not. |
| `reason` (skill) | The only instrument whose return set includes stopping by construction: "There is no `CONTINUE`: an expired budget never self-extends". | 1: invoked by the agent. | The three exits and the pre-declared budget. |
| `concept-exploration` (skill) | Loop dynamics: judge a loop by whether its rounds shrink. | 1. | The shrink test as a signal an environment can compute. |
| `cricket` (skill and four sub-agents) | The one instrument that separates the owner's words from the seat's reading (`SOURCES:` and `READING:`) and returns a verdict on the reading; independent context. | 1: the working seat decides when. 4: the working seat chooses what to quote. 5: "treat every verdict as evidence rather than authority", and a seat "discounted" a DRIFTING verdict in the alignment arc. | The frame's two blocks and the two verdicts, nearly as they are. This is the closest existing thing to requirement 2. |
| `parallax` and its frame and audit siblings (skills) | The audit declares its independence honestly and can return `block` or `reopen`. | 1. Also weight: a charter, frame cards and claims are heavy for a check that must run often. | The honesty rule: "An audit emulated by an orchestrator is always same-context self-review". |
| `plan` skill, design gate | Fires at a real artefact moment: a plan is being written. | 2: "the frame is the owner's to set", and nothing makes the plan carry the owner's words. | The moment. It is the estate's working example of binding a question to an artefact. |
| `retrospective` (skill) | Finds causes well, afterwards. | Not a step back during work. Its proposals often do not land: of one day's three, "None is present in its target file". | Its records are the scenarios' source. |

**The five causes, against the evidence.**

1. *The working agent decides when to step back.* Confirmed, and it is the dominant cause.
   Eleven of eleven instruments depend on it, several say so in their own text, and the
   retrospectives show authors breaking a lesson within the hour of writing it: "a lesson held
   as a sentence is retrieved only on cue, and a find-cure loop supplies no cue".
2. *The one being checked writes the frame.* Confirmed. Cricket is the partial exception since
   2026-09-24, and only where the invoker quotes the owner faithfully.
3. *The question asked cannot return "stop" or "delete it".* Confirmed for review (a brief that asks whether a design is safe and correct "has no answer of
   the form" delete it, in the record's words), and revised: several
   step-back instruments can return stop (`reason`, `proportionality`, the parallax audit). The
   cause holds for reviewers, less for the step-back skills.
4. *The evidence handed over is the working agent's own record.* Confirmed.
5. *The return is advice to the agent it doubts.* Confirmed, with a counter-case that matters:
   a declared last push "was a promise; the gate was a fuse." Where a return changed what
   could happen next, it bound.

**Two causes the first pass did not have.**

6. *The moment has no owner.* The retrospectives name moments at which the estate "holds the
   doctrine" and "has no firing gate": the first cycle of a build, the second finding of one
   class, a step grown past its one-line proposal, an estimate revised upward. A good question
   with no moment is cause 1 seen from the other side, but it is separately curable: a moment
   can be attached to an artefact.
7. *A step back competes with clocked work and loses.* "clocked obligations starve unclocked
   jobs". A check with no deadline, no artefact and no visible end is displaced by anything that
   has them. The mechanism needs a place in the run where it is the due thing.

**The five requirements, against the evidence.**

1. *It fires without the working agent judging it is needed.* Stands, and PDR-098 already
   requires it. Sharpened: it fires on a moment something other than the agent's judgement
   marks. Question 1 lists moments an environment or an artefact can mark.
2. *Its frame is the owner's words and primary evidence.* Stands. Class 1 of question 1 makes it
   the first requirement in time. Cricket's two-block frame is the existing form.
3. *Its question is fixed, climbs from the work to the bigger picture, and admits "stop",
   "smaller" and "not worth doing".* Stands, and gains one exit, for a matter already answered: proceed
   (class 2). A mechanism that can only slow work down will be the next thing the owner has to
   stop.
4. *Its return is answered in writing in the run's record before the run continues.* Stands:
   "a sentence that must be written is a step".
5. *It can subtract.* Stands, and applies to the mechanism itself. The estate's response to
   failure has been additive ("Every correction produced an instrument"; rules and skills grew
   about 30% in forty-two days). The mechanism must name what it retires, and its own load on
   every session must be visible. A lesson or a check that changed nothing is revised or dropped, which needs something that looks later for whether it took (the owner's report of 2026-11-12; the last section of this file).

**What worked, across the corpus.** Each case had the same shape: something outside the agent's
recall marked the moment, and the response was a thing that had to be produced or could not be
passed. A counter that refused a push. A count stated first in every report. A sentence that had
to be written before a cure. A declared deadline with a default. A reviewer handed the owner's
words and the question, not the author's summary. None was a better-worded rule.

### The rulings ledger and the Cricket tallies: whether to use them, and how far

Read on 2026-11-12 at the owner's word, with the owner's caution that Cricket is not always
correct. The decision on each:

**The rulings ledger: used, lightly, for two things.** It is not a source of catches. By its own
header "This file proves homing; it never stores ruling substance", and most rows are rulings
with no agent miss recorded beside them. It is used:

- *As a check on the classification.* Its rows add no class. They add instances to two: class 6
  ("the original target architecture was WRONG", after which a ratified target was re-graded to
  historical data) and class 1 (a survey cancelled because "the programme guessed at owner-class
  questions"; a ruling that three corrections shrank to nothing because it had been a seat's
  inference).
- *As a working component for requirement 2.* Every row carries an authority class:
  `owner-verbatim`, `owner-paraphrase`, `owner-relayed`, `seat-inference` or `plan-prose`. That
  is the estate already marking, line by line, whether a sentence is the owner's or a seat's
  reading. The ledger also shows the marking is needed: three owner-verbatim rulings are recorded
  as critic finds, one of them in the words "critic find, missed by the inventory".

**The Cricket tallies: used as evidence about one instrument, and not as ground truth about
anything else.** They record Cricket's verdicts, not the owner's catches, so they do not feed
question 1. They do show when a frame check of this kind is right and when it is wrong.

Where it was right:

- With the owner's words quoted as sources, eight legs of a full suite found a plan node
  contradicting them before the owner read it: six pull requests against the owner's "two large
  PRs", a guide for the whole read per landing, and directions attributed to the owner that
  were a review's. "No two legs disagreed". Those are classes 1 and 6 of question 1, caught by
  the reading set beside the words.
- "The adversarial stance earns its cost": it caught a needless gate and rejected a refutation
  its own normal leg accepted. In one suite two adversarial legs found three ordering defects in
  a plan's content that the other six had passed.
- In this research, two legs caught the seat stretching the owner's "no fan-out"; the seat
  confirmed it against the words.

Where it was wrong, or could not be right:

- A false alarm: "ground truth was ON-TRACK: sonnet false-alarmed on an input gap".
- It inherits the frame's facts. Legs took "the mis-dated freeze-6 block" in a record "as ground
  truth" and built two findings on intervals that did not exist. A seat's own adjudication:
  "eight convergent verdicts over one seeded frame carry no more evidence than the frame does".
- It cannot see what the frame leaves out: "a verdict cannot fault compliance with a standing
  rule its own frame omitted". Before the frame verdict existed, a seat's suites returned
  nineteen ON-TRACK of twenty-four while it worked one direction of a two-way goal.
- Its labels are unstable where its substance is not: the same finding came back as NARROWED
  from one seat and CONTRADICTED from seven; one model's verdict changed on an identical re-ask;
  in this research one frame drew DRIFTING and ON-TRACK from the same role in two stances.
- Six legs can agree and miss: a plan "had reproduced its author's own diagnosed failure mode
  one level up, and six legs missed it".

**What that licenses.** Three statements, and no more:

1. The part of a Cricket-style check that the tallies show working is narrow and specific: the
   seat's reading compared against the owner's quoted words, by a reader who did not write the
   reading. That supports requirement 2 and it is the only part this research leans on.
2. The work verdict (is this the right work?) is the unreliable part: it false-alarms on a thin
   frame, passes on a wrong one, and varies by stance. Requirement 4 already treats a return as
   something to answer in writing and not as authority; the tallies are the evidence for
   keeping it that way, and for the control scenarios.
3. Agreement among legs given one frame is one piece of evidence, not eight.

The earlier remark under cause 2, that the Cricket panel is a partial exception, stands on this
evidence with its limit stated: an exception where the owner's words are quoted in the frame,
and only for what those words cover.

## Question 4: what each lever can do, and whether the evaluation can be run

**Status: answered.** Estate facts were read and measured at the seat on 2026-11-12. Facts
about Claude Code are from Anthropic's documentation fetched that day; a reader sub-agent
located them and the seat checked each sentence quoted here against the raw page
([`external-sources.md`](attendant-research-working/external-sources.md)). Three sentences the
reader returned were not on the page as written and are not used.

### What decides whether an instruction is in front of the model at the right moment

The documentation describes five ways an instruction reaches the model. One depends on the
model deciding it needs the instruction. One is there from the start and marks no later
moment. The last three arrive at a moment something other than the model marks.

| How it loads | What uses it | Who decides the moment |
| --- | --- | --- |
| Always, at session start | `CLAUDE.md`; a rule with no path scope | Nobody: it is there from the start, as context ("Claude treats them as context, not enforced configuration."). |
| On the model's judgement | A skill's body; a sub-agent | The model, from a name and a description ("full skill content only loads when invoked"). |
| On a file being worked with | A path-scoped rule ("Rules load into context every session or when matching files are opened."); a skill with `paths` | The environment, when a matching file is opened. |
| On a clock | A scheduled prompt ("Tasks only fire while Claude Code is running and idle.") | The scheduler, between turns. |
| In code order | A workflow script ("A workflow moves the plan into code."; the documentation's table gives "Who decides what runs next" as "The script") | The script. |

Two of these are not hooks and mark a moment without the model's recall: a path-scoped rule and
a workflow script. Marking the moment is not supplying the content. In this repository a
path-scoped rule's adapter is also a one-line pointer, so the rule's text still arrives only if
the model opens the file; a workflow step carries its own prompt. Nothing in the documentation ties a skill or a sub-agent to an event except hooks.

### What the estate's own surfaces do today, measured

- **An always-on rule here is a pointer, not a text.** The Claude adapter for each rule is one
  line: "Read and follow" and the canonical file's path. 124 rule adapters; 103 load at session
  start; together they are 9,931 characters. A plain-text pointer is not an import: the
  documentation describes only `@path` imports as loading content ("Imported files are expanded
  and loaded into context alongside the CLAUDE.md that references them."). So at session start
  the model holds 103 file names, and each rule's body arrives only if the model opens the file.
  The feasibility check below saw this: a session with the rule's pointer in context did not
  open the rule.
- **21 rules are path-scoped**, and they do load when a matching file is opened. This seat saw
  it in this session: the Markdown code-block rule's pointer arrived after the first Markdown
  edit, and the capability-landing rule's after the first read under `.agent/rules/`. That is
  an instruction arriving at a moment the environment marked. It still arrives as a pointer.
- **Skills: 78 adapters tracked in the repository, 38,142 characters of description.** This
  session's checkout held nine more that the installer manages and the repository does not
  track, 87 and 40,845 in all. The listing budget "scales at 1% of
  the model's context window"; the estate has raised it to 3%
  (`.claude/settings.json`). At about four characters a token, that is room for roughly 24,000
  characters on a 200,000-token model and 120,000 on a million-token one. On the smaller
  window "Claude Code drops some descriptions to fit the listing's character budget, which
  removes the keywords Claude needs to match your request". A skill that relies on its
  description to fire is competing with the rest for that room, and the tracked set alone is
  past the smaller window's budget.
- **Sub-agents: 31.** Each "starts with a fresh, isolated context window" and, unless
  configured otherwise, loads `CLAUDE.md`. In this repository that fixed load is large: a
  sub-agent measured at about 107,000 tokens before its task, a headless session at about
  169,000.
- **The estate's own rule for landing a capability already says where a trigger can live.**
  `capability-landing-decision-procedure`, step 4: "A trigger-bound landing is sound only when
  the *loader* — a path match, a tool-call match, a session-shape flag, or an always-invoked
  ceremony skill — can recognise the moment." And: "When recognition depends on the agent
  noticing" that it is in the situation, "the agent must already remember the capability to know
  to load it, which is the failure it exists to prevent". The same rule records the owner's
  word on where substance lives: "if a question of disambiguation or de-duplication arises,
  favour skills as the SSOT, with evals".

### What start-right and `AGENT.md` can carry, and what a change costs

- `AGENT.md` is 14,274 characters and the shared start-right workflow 33,107, with 9,952 more
  for the thorough form. They are read when a session is opened with a start-right skill, which
  is the owner's own opening word. So start-right owns one moment that does not depend on the
  agent's recall: the open of a session.
- What start-right already carries: five guiding questions, among them "Are we solving the right
  problem, at the right layer?" and the scope question. They are asked once, at the open, and
  nothing brings them back.
- What that moment is good for: class 1 of question 1. The open of a session is when the owner's
  words arrive, so it is the one place a seat can be made to set the owner's words beside its own
  reading before any work exists to defend.
- What it cannot carry: the later moments. A sentence in start-right about what to do at the
  second cure of one thing is an always-on sentence, with the record that has.
- Cost: every character added is read by every session of every kind, including the many that
  will never run an Attendant. The documentation's guidance is "target under 200 lines per
  CLAUDE.md file" and that "The more specific and concise your instructions, the more
  consistently Claude follows them." A retrospective in the corpus found a launch prompt that
  loaded six skills had spent the headroom its own job needed, and the cure was four lines. Edits
  to directive files are also held to a fresh context by the estate's own rule.

### Dynamic workflows and agent teams, surveyed for fit

- **Workflows fit the middle of a run, in principle.** A script decides what runs next, so a
  review step placed between two stages runs because the script reaches it, not because an agent
  thought of it. That is firing without recall, with judgement doing the detecting, and it needs
  no hook. Limits: "No mid-run user input", so the owner's two touches sit outside any workflow;
  a workflow starts on the owner's word, not on a schedule; this estate's rule prices every
  fan-out before launch.
- **Agent teams do not fit as the mechanism.** The lead is a model choosing turn by turn, so a
  team moves the recall problem to the lead. The documentation calls them experimental and off by
  default.
- **Scheduled prompts** fire between turns while a session is idle. A clock is the wrong signal
  for a step back (question 1's moments are events), and the corpus has the owner cancelling
  checks that fired on a clock alone.

### Can the mechanism step's evaluation be run?

- **For a skill alone: yes, with the estate's runner.** `pnpm agent-tools:skill-evals` runs a
  skill's cases with and without the skill, and its trigger examples, and keeps the traces. Its
  agent "runs in an empty temporary workspace", so it tests the skill's text and description and
  nothing of the repository around it. It can answer whether a skill's description fires on given
  prompts and whether its body changes the answer. It cannot test a rule, `AGENT.md`,
  start-right, or how a skill fares among the others.
- **For the full repository: yes, by hand, cheaply.** The feasibility check
  ([`feasibility-check.md`](attendant-research-working/feasibility-check.md)) ran one scenario
  headless in two clones, one with a rule removed: under twenty seconds and a quarter of a
  dollar an arm, with a trace that shows mechanically whether the rule's file was ever opened.
- **What the one trial showed about scoring.** Whether a text entered the session is readable
  from the trace. Whether the answer stepped back needs a reader. And a scenario lifted from a
  recorded instance can be dead on arrival: the trial's scenario (a proposal that once dropped
  Sentry) could not fail, because the code now refuses the configuration, citing the owner's
  ruling. Scenarios have to be set where the cure is absent.
- **The estate's caution stands.** `validation-strategy.md`: "Diffuse, long-horizon, cultural
  capability (doctrine, planning discipline, collaboration) does not decompose into
  `prompt → graded output`." A seeded scenario can show whether a mechanism fires and what it
  returns on a short task. It cannot show what a long run does, which the strategic node already
  declines to claim.

### What this means for the composition the owner prefers

The owner's preferred composition is start-right, `AGENT.md`, skills and rules. Read against the
facts above, each has one thing it can do without depending on recall, and the list is short:

- **start-right**: the open of a session. Fit for class 1.
- **A path-scoped rule**: the moment a file of a known kind is opened. Fit for marking any
  moment that has a file: a plan node, a run's record, a report, a pull-request description. As
  the adapters stand it delivers a pointer at that moment, not the rule's text.
- **A skill**: a procedure and a fresh context, once something else has decided to run it. Its
  description cannot be relied on as the trigger.
- **`AGENT.md` and always-on rules**: a name in context. Fit for the vocabulary, not for firing.

As input to the seat that designs the mechanism, which decides: the facts above sort question
1's moments into those that have a file or a place in a script, which something other than
recall can mark, and those that do not (a step that has grown; a loop at a steady beat), which
the script-free surfaces have no way to mark. How the mechanism is composed is that seat's work
and is not proposed here.

## Question 5: which of the reference point's mechanics the Practice already holds

**Status: answered.** The source,
`.agent/research/team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md`, numbers the
reference point's mechanics M1 to M14 and already maps each to the Practice (its §3.3). The
"Practice holds" column below is that document's verdict, read at the seat. The last two
columns are this research's reading for the Attendant, as input to the design step, which
decides.

| Mechanic | Practice holds | For the Attendant | Reason |
| --- | --- | --- | --- |
| M1. The ticket is the contract | Same principle, different home (plan nodes carry acceptance criteria with proofs) | Kept | The run's contract is what the owner signs in the opening conversation: the outcomes, the definition of done and the criteria. Class 1 of question 1 says the owner's words must be in it verbatim. |
| M2. A pre-flight that refuses to plan | Partial: "Nothing refuses to start a lane" | Kept | It is a check the entry to a stage fires, not the agent's recall: the kind of moment question 3 found to work. |
| M3. Delegation by signed webhook; the machine only dials out | Different | Left | The host is read at run time and a cloud run has its own transport. |
| M4. Bounded parallel runs, each capped at an hour | Partial | Adapted | A declared bound with a default exit is what bound seats in the corpus. The Attendant's bound is rounds or time, with the cost recorded and kept off the agent's screen, as the owner settled. |
| M5. A one-line landing; ask instead of guessing | Partial: the Practice asks without blocking | Adapted | The landing line is kept. "Ask" needs the class 2 guard: a question the purpose already answers is an error, and the run proceeds while a real one is with the owner. |
| M6. Plan review by the reviewer that holds the history | Same need, different home | Adapted | The estate's reviewers are fresh contexts and "goal-blind" (the source's quotation of a rule). The cure the corpus supports is a reviewer handed the owner's words and the question, not a warm history. |
| M7. Verdicts bound to identity and plan revision | Same at the merge | Kept | A step-back return names the revision of the record it judged, so a late return on a stale state does nothing. |
| M8. Round caps that hand back to the human | Same concept, tighter and enforced | Kept | The estate's review-cost gate is the working instance: "the gate was a fuse". |
| M9. Gates before the push | Same | Left | The repository's general mechanism; out of this lane's scope by the owner's word. |
| M10. Agents never merge | Different: the estate's bot merges green work | Adapted | Settled on 2026-11-10: in an Attendant run the merge follows the owner's word at the sense check. |
| M11. Review walks the contract item by item and fails closed | Partial: "No reviewer walks a plan node's acceptance criteria one by one" | Kept | It is the natural content of the sense-check screen (question 2): each criterion met, not met, or cannot tell, with evidence. |
| M12. Route on authenticated identity; content read is data | Different, with a gap | Kept as a principle | Bears on class 1: only the owner's own turn is owner direction, and a recorded frame is evidence with a date. The identity mechanics are left; a cloud run writes under the owner's credential. |
| M13. Mint, use and revoke credentials | Same posture | Left | A hosted cloud session has no credential of its own to mint. |
| M14. The human at both ends | Different placement | Kept | It is the Attendant's shape: the owner's judgement at the opening conversation and at the sense check. |

Seven kept, four adapted, three left. The two the Practice holds only in part and the Attendant
most needs are M2 and M11: a check that refuses to start, and a walk of the contract item by
item. Both are bound to a moment the process owns.


## The owner's report on periodic learning, read against these findings

The owner wrote "Doing and Dreaming: Periodic Learning for Agents in a Repo" on 12 November 2026
and asked in session for these findings to be updated from it. The report is not held in this
repository; the sentences quoted here were checked against the attached file
([`external-sources.md`](attendant-research-working/external-sources.md)). It proposes a second
mode of agent activity, dreaming, that runs on a clock beside ordinary work and turns raw
experience into better guidance. Quotations in this section are the owner's, from the report.

### The report's proposal, restated

The report is not in the repository, so its proposal is restated here in this seat's words for
the seats that come later; the owner's own text is the authority and the owner holds it. The
entity that learns is a repository joined with the agents that act in it: the repository is the
body and the memory, the agents animate it. Doing faces the task in hand and is prompted by an
occasion. Dreaming faces accumulated experience and is prompted by a clock, then a judgement
that there is enough to review. A learning pass is separate from the stream it reviews,
selective, forgetful and recombining. The loop has eight parts, in the order a lesson travels:

1. A standing brief in the repository: what to review, by what standard, where results go.
2. Capture during work: working agents append raw experience (corrections, failures, dead ends,
   friction) to a log, cheaply and unedited.
3. A clock: any scheduler that starts a dreaming session at intervals.
4. A threshold check: the dreaming agent first judges whether enough has accumulated, and stops
   if not.
5. Consolidation in isolation: in a worktree or cloud session, on a fixed view of the log, it
   selects, prunes and recombines, then rewrites distilled memory and guidance.
6. Review and integration: the result arrives as one reviewable, reversible change that a person
   or a reviewing agent accepts or rejects.
7. Waking: working sessions read the guidance when they start; a session under way keeps a
   stable view until it ends.
8. Checking that it took: a later pass looks for whether the friction behind a lesson has
   recurred, and revises or drops a lesson that changed nothing.

The report's risks are churn, compounding error, unattended authority and drift. Its open
questions include where raw experience lives, what marks an experience as worth revisiting, who
reviews what dreaming proposes, what evidence shows a lesson changed how work is done, whether
dreaming may change the body or only the memory, what cadence suits the pass, and whether
lessons pass between repositories.

### One diagnosis, two halves

The report and this research start from the same observation. The report: "Agents act when
something prompts them, so learning from accumulated experience happens only when a person
remembers to start it." This research: every step-back instrument depends on the working agent
deciding to use it. Both conclude that a trigger alone is not the cure. The report: "Periodicity
is still only the trigger", and "A tick with no brief has nothing to act on." This research:
what worked had a moment marked from outside the agent's recall and a response that had to be
produced.

They cover different ground. Stepping back acts inside a task, at a moment. Dreaming acts
between tasks, on accumulated experience. The Attendant lane as planned has the first and not
the second: a run ends with a retrospective, and nothing carries its lessons into the next run.

### Where the estate's evidence bears on the report

- **Waking is the weak step.** The report's step 7: "Working sessions read the guidance when
  they start, so the next session begins with the new lessons." In the estate's record, guidance
  read at the open did not reliably change behaviour at the act: sixteen of nineteen lessons
  with verified homes recurred within four weeks, and in this research's one trial an always-on
  rule's file was never opened. A dreaming pass that ends in better guidance inherits question
  3's whole problem at the point where the guidance has to act.
- **The report's question about the body has evidence behind one answer.** It asks: "May
  dreaming change the body, such as tests and conventions, or only the memory?" Everything the
  corpus shows binding behaviour was a change to the body in the report's sense: a lint rule, a
  gate that refused a push, a template step, a count that a report must open with. The report
  itself says "Some of what the entity knows is in its shape." A pass that may only rewrite
  memory can only produce the kind of cure the estate has measured as weak.
- **The estate already dreams by hand, and its failures are on record.** The napkin is the raw
  log, distillation and consolidation are the pass, and the pending-graduations register is the
  queue. The recorded failures are the report's own risks: the napkin "has become a journal";
  a consolidation ran three days while its count did not move, displaced by a daily ceremony; a
  mapping fleet spent about eight million tokens and homed nothing; rules, skills and directives
  grew about 30% in forty-two days. The report's "Pruning is half the work. A system that only
  accumulates has a bigger pile and has learned nothing." describes the measured state.
- **A dreamer inherits the frame of the log.** The report asks for a pass that "works on a fixed
  view of past experience" and for experience "captured cheaply and rawly in the moment, or
  there is nothing honest to dream about later." Causes 2 and 4 of question 3 apply to the log:
  it is written by the agent that had the experience, the estate's records say napkins
  over-record owner corrections, and Cricket legs built findings on a mis-dated record. Raw
  capture helps; it does not make the log independent of its author.
- **The clock, with the threshold, agrees with the owner's rulings.** Question 4 found a clock
  the wrong signal for a step back, and the corpus has the owner cancelling work that fired on
  the clock alone. The report does not fire on the clock alone: "The clock grants the
  opportunity and the agent decides whether to take it." That is the same shape as the owner's
  2026-10-19 word that a fold's need "varies with how much work is happening". The threshold is
  an agent's judgement again, made in a fresh session and not under the drive to finish.

### What the report adds that these findings lacked

- **The half between runs.** A stepping-back mechanism, however reliable, changes one task.
  Whether the Attendant gets better from run to run is the report's subject and was nobody's in
  this lane.
- **Checking that a lesson took.** The report's step 8: a later pass looks for whether the
  friction has recurred, and "A lesson that changed nothing is revised or dropped." The estate
  has no instrument for this; its own records say a napkin measures recurrence and never
  extinction. The report's open question, "What evidence shows that a lesson has changed how
  work is done?", is the same question the mechanism step faces for a seeded scenario, at a
  longer range.
- **A single-writer rule for distilled memory.** "any agent may append raw experience, but only
  the dreaming agent rewrites distilled memory". The estate has no such rule.
- **"A merge is not learning."** The lane's success measures should not read a merged mechanism
  as a working one. The strategic node already declines that claim; the report states why.

### What this research offers the report

- **What to select.** The report asks what marks an experience as worth revisiting. The ten
  classes of question 1 are a candidate key, and the estate's own observation that a second
  owner correction on one class is itself a detector is a candidate trigger for selection.
- **A test set.** The scenarios written for the stepping-back mechanism can serve the report's
  step 8: a lesson has taken when the scenario for its class no longer fails.
- **A caution on the reader.** Question 3's evidence on Cricket applies to a dreaming pass: the
  reliable part is a reading compared against quoted source words by another reader, and
  agreement among readers of one log is one piece of evidence.

### What changes in these findings

1. **Requirement 5 is restated in the report's terms.** The mechanism can subtract, itself
   included, and a lesson or a check that changed nothing is revised or dropped. That needs
   something that looks later for whether it took.
2. **Question 4's reading of the clock is narrowed.** A clock is the wrong signal for a step
   back inside a task. A clock with a threshold is a sound trigger for a different job, the
   review of accumulated experience, and a clock independent of any session exists.
3. **A gap is named for the lane, and it is the owner's to place.** The lane has no loop between
   runs. Whether dreaming is part of the Attendant, beside it, or a lane of its own is not a
   research finding. The seats that take steps 2 to 4 should read the eight parts restated above
   as a candidate design for that loop.
4. **The answer to "body or memory" is carried into step 2 as evidence.** Where the mechanism
   step has a choice between changing guidance and changing a template, a check or a script, the
   corpus favours the second, and the report gives the reason.
