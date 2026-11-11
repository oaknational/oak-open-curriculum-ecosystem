# Why written lessons kept needing the owner

**A retrospective on the last five napkin windows, 2026-08-07 to 2026-09-16.** The
owner commissioned it on 2026-09-16, verbatim: "run a deep retrospective, on the current
branch, you can commit and push but no need to merge. Make sure to include the last five
napkins at least ultrathink all analysis but me first hand by you, subagents are for
locating information, but that information must be verified, checked, and analysed by you
before use". This record reads "but me" as "must be".

It was run under the `retrospective` skill, in `metacognition` retrospective mode, as a
core-depth `parallax` inquiry.

**Author:** Zephyr guards Leeward (`281e44`), claude-code / claude-opus-5, sole operator.
This seat's own 2026-09-14 and 2026-09-16 napkin blocks are part of the material, so the
author is also a subject of this record.

**Method.**
- **Sources:** six napkin files read first-hand in full, 14,113 lines by `wc -l`:
  archive `napkin-2026-08-07.md` (the overlap baseline), `08-14`, `09-02`, `09-07`,
  `09-10`, and the live `napkin.md`.
- **Prior syntheses:** the two longitudinal synthesis reports (2026-08-07, 2026-09-02).
- **Measurements:** read-only git measurements of the doctrine and continuity corpus at
  five commits.
- **Governing texts:** targeted reads of the texts the findings name.

Claims about the arc cite their sources by file and line. The companion
[reading ledger](why-written-lessons-kept-needing-the-owner-2026-09-16-reading-ledger.md)
carries the per-window notes, the hypothesis register and the measurement table, and
separates what a source says from what this seat reads into it. Counts are stated as
measured on 2026-09-16, and sets are open, with exemplars.

**Review contract.**
- **Purpose:** conserve what the arc taught about why lessons the estate had already
  written down kept arriving again as owner corrections, and route that to the dedicated
  consolidation session the owner named on 2026-09-16.
- **Questions a review should test:** do the quotes and anchors say what this record says
  they say; do the measurements reproduce; does each causal layer's evidence support it;
  does the counterframe get a fair hearing; does each proposal's falsifier bite?
- **Authority boundary:** this record authorises nothing. Proposals are inputs for the
  consolidation session and the owner.
- **Non-goals:**
  - re-litigating individual pull requests;
  - re-running the corpus engine;
  - re-deriving the 2026-09-02 synthesis's findings, which this record cites rather than
    repeats.

## The arc, from primary sources

**Where the window starts.** The 2026-08-06 dedicated consolidation named the window's
generator: *claims outrunning their instruments*. It observed that "every cure that worked
was structural; not one came from remembering a note" (`archive/napkin-2026-08-07.md:39-44`).
The next day's longitudinal synthesis measured the same thing as finding 1: "Prose cures do
not move recurrence; only interface changes do — now measured, not asserted"
(`research/…/historical-napkin-synthesis-2026-08-07.md:62`). The five windows after that
marker are this record's subject.

**Regime changes inside the window** (each read from its napkin entry):
- **The fork.** Pull-request numbering restarts on the Engraph fork between 2026-08-19 and
  2026-08-24. Cloud seats arrive in the same period.
- **Directors.** Successive Director tenures ran from 2026-08-13 onward. A three-seat team
  closed on 2026-09-10, leaving one seat.
- **Codex outage.** Codex was out of credit from 2026-09-10 to about 2026-09-16
  (`napkin.md:343-347`).
- **Model tier.** The seat moved to a lower-powered model on 2026-09-10/11
  (`napkin.md:823-827, 989-990`).
- **Oak surfaces.** The owner's no-Oak-surfaces ruling came on 2026-09-06
  (`archive/napkin-2026-09-07.md:1798-1802`).

**What the estate did in response to failure: it wrote.** Measured by git at five commits
(the ledger has the full table):

| Surface | 2026-08-05 | 2026-09-16 | Change |
| --- | --- | --- | --- |
| `.agent/rules` + canonical skills + directives (bytes) | 1,559,992 | 2,026,359 | +29.9 % in 42 days |
| rule files / canonical skills / patterns | 118 / 52 / 223 | 127 / 62 / 244 | +9 / +10 / +21 |
| thread records (bytes) | 788,935 | 1,431,342 | +81.4 % |
| `repo-continuity.md` (bytes) | 54,782 | 72,579 | +32.5 % |

The napkin rotated at 1,088, 3,491, 3,093, 2,546 and 1,917 lines, and the live file stands
at 1,978, against a frontmatter limit of 300. Every rotation in the window ran between
3.6 and 11.6 times that limit. A consolidation seat's own map explains why: of 708 mapped
items, 186 were state and 367 were already homed, so "the napkin has become a journal"
(`archive/napkin-2026-09-07.md:2504-2508`).

**What kept arriving anyway.** The 2026-09-02 synthesis measured it: "Sixteen of nineteen
prior-kept mechanisms recurred within four weeks of the run that kept them", all with
verified homes (`historical-napkin-synthesis-2026-09-02.md:114-124`). The windows after
that marker add their own instances:
- **Truncated output.** The piped and truncated-output class, homed and re-homed, reached
  the owner's "I think we need to stop using tail, it causes this same issue over and over
  and over" (`archive/napkin-2026-09-07.md:669-670`).
- **The unbuilt tally.** The review tally went unbuilt at PR-open on at least seven pull
  requests between PDR-140's landing on 2026-08-31 and 2026-09-08 (§counterfactual 1).
- **Doctrine named before it was read.** One Director recorded naming a mechanism before
  reading its governing document eight times in the first day and a half of a tenure,
  2026-09-06 12:5xZ to 2026-09-07 18:4xZ (`archive/napkin-2026-09-10.md:83`).
- **This seat's own repeats.**
  - It breached the owner's 2026-09-14 gates ruling the next day (`napkin.md:1569-1576`).
  - It slipped on working directory three times in two days (`napkin.md:1560-1568`).
  - It edited through shell rather than the file tools twice on the day the owner said
    "Use the proper tools only" (`napkin.md:1577, 1760-1766`).

**What the owner said, by class** (an open set, verbatim, dated):
- **Purpose over mechanism:**
  - "always go back to first principles, *why* are there differences at all?" (2026-08-13,
    `archive/napkin-2026-08-14.md:3396-3397`);
  - "Mechanisms aren't purpose, design is not impact. What is the work trying to achieve and
    why, what is the value, to whom, when. That is all that matters." (2026-09-10/11,
    `napkin.md:894-895`).
- **Apparatus and ceremony as output:**
  - "self-congratulatory theater" (2026-08-17, `archive/napkin-2026-09-02.md:602`);
  - "less ceremony, more consolidate-docs" (2026-09-06, `archive/napkin-2026-09-07.md:2152-2153`);
  - "your dynamic workflows have been eating tokens at an incredible rate, why?"
    (2026-09-07, `:2410-2411`);
  - "Your one job was to review PR 66, have you done that?" (`:2385`);
  - "None of this is about ceremony or declarations, it is ALL about engineering." (`:2297`).
- **Cost and throughput:**
  - "enough, these long tails are costing us hours, what are they providing?" (2026-08-31,
    `archive/napkin-2026-09-02.md:2164-2165`);
  - "I brought up the PR limit at least three times … you paid that lip service, and
    ignored it" (2026-09-03, `archive/napkin-2026-09-07.md:1006-1007`);
  - "stop doing things that need approval, I am not here, you will get yourself stuck and
    do no useful work for ten hours." (2026-09-08, `archive/napkin-2026-09-10.md:1000-1001`).
- **Authority already given:**
  - "I don't think I'm needed for any of those decisions, read principles.md… apply the
    decision matrix" (2026-08-31, `archive/napkin-2026-09-02.md:2074-2075`);
  - "it's my forking fork, the decisions are mine, look at the commit history on the Engraph
    branch" (2026-09-01, `:2434-2435`);
  - "Dismiss code quality alerts, does that sound like the right answer to you? Have you been
    failing to question things handed to you?" (2026-09-06,
    `archive/napkin-2026-09-07.md:1629-1630`);
  - "we have an entire, sophisticated, in-repo planning system with multiple layers of
    discoverability!" (2026-09-08, `archive/napkin-2026-09-10.md:535-536`).
- **An invariant already stated:**
  - "TESTS DO NOT CREATE OR ALLOW IO UNDER ANY CIRCUMSTANCES! Check the principles, you do
    not need me for this … so why the hell are you asking?" (2026-09-11, `napkin.md:1030-1032`);
  - "This is not a question of degrees, it is an absolute invariant, and I don't appreciate
    it being questioned" (2026-09-15, `napkin.md:1487-1488`);
  - "there is no 'upstream' there are two forks of OCE" (2026-09-16, `napkin.md:1736`).

Positive owner words exist in the record too: "Great, good work" (`napkin.md:387-388`,
noted there as "the first positive owner word in two days of corrections") and "That is
great news, well done and thank you" (`archive/napkin-2026-09-10.md:1142-1143`).

**What actually stopped a class** (each dated; an open set):
- a lint rule for `it.skipIf`/`runIf` and a plan-corpus YAML parse, each proven by a
  negative control (2026-09-11, `napkin.md:995-1004`);
- the merge-bot front door's typed refusals ("it held the line my own eagerness would have
  crossed", `archive/napkin-2026-09-02.md:867-871`);
- the review tally builder and the review-cost gate (both 2026-09-12, commits `dff894115`
  and `19071d597`), the gate refusing an over-budget push on 2026-09-14 ("exactly its job",
  `napkin.md:1389-1391`);
- the Director's declared deadline-and-default, which landed held seats' lanes three times
  (`archive/napkin-2026-09-10.md:149-153, 835-849, 1418-1432`);
- a reply sentence that must state the review-pricing prong before any cure: "Naming the
  generator twice did not stop it; stating the prong did, immediately … Resolve is advice;
  a sentence that must be written is a step" (`napkin.md:1094-1097`).

## The causal stack

**Technical root: values, claims and mechanisms taken from the nearest surface instead of
their source, at the moment of the act.** The nearest surface varied:
- memory;
- a record written earlier;
- a handed recipe;
- a parameter's name;
- an exit code;
- a compaction summary;
- a tool's refusal.

The seats named it many times, independently:
- "a value or claim enters the work only from a first-hand, right-frame read" (2026-08-08,
  `archive/napkin-2026-08-14.md:459-474`);
- "sentences asserted about the world without a first-hand read" (2026-09-02,
  `archive/napkin-2026-09-02.md:3083-3088`);
- "acting on a state not recomputed against its source" (2026-09-09,
  `archive/napkin-2026-09-10.md:1444-1454`);
- "a claim written into a record or a message without checking its source … Every one was
  in PROSE, never in code — because code is executed and a record is not" (2026-09-12,
  `napkin.md:1088-1093`).

This seat's own 2026-09-16 wrap is the latest instance. A verification pass run before the
commit found about eighteen such errors in its records, and "the self-run scan found none
of these" (`napkin.md:1949-1973`).

**Process root, three strands.**

*Strand 1: written lessons do not fire at the act.* This is measured, not argued (16 of
19, above). The seats' own statements agree:
- "reading a generator's diagnosis does not immunise against it" (`archive/napkin-2026-08-14.md:208-222`);
- "Writing the lesson did not install it" (`archive/napkin-2026-09-07.md:1703-1706`);
- "a rule that fires after the fact is a story, not a guard" (`napkin.md:767-768`).

The 2026-08-10 model-switch observation is the sharpest natural experiment: mechanically
enforced disciplines held across a silent model change, while prose-only disciplines
"regressed to error types months absent, despite the full rule corpus being loaded in
context" (`archive/napkin-2026-08-14.md:1435-1437`).

*Strand 2: a governing text that says what the owner does not mean re-teaches the error at
every faithful read.* This is the strand the prior syntheses did not isolate. Instances:

1. **The IO invariant.** The owner corrected seats on 2026-07-07, 09-06, 09-11, 09-14 and
   09-15 (the register entry, `pending-graduations.md:133`, verified against
   `napkin.md:1023-1033, 1417-1426, 1486-1508`). `testing-strategy.md` still admits IO in
   integration tests ("beyond the loopback harness exchange", lines 38-40 and 329-350) and
   in smoke tests ("CAN trigger all IO types", line 398). It was last edited
   2026-09-06 (`6df94bfcf`), and three of the five corrections came after that edit. This
   seat's 2026-09-15 entry names the mechanism: "I measured the invariant by the directive's
   text … the directive still says the opposite on every read".
2. **The pr-lifecycle watch prescription.** The SKILL still prescribes `pr-watch <n> --watch
   --interval 60` as "one line per state change" (lines 537-538). The frictions register
   records that form as silent (F-164). It was first seen silent on 2026-09-02
   (`archive/napkin-2026-09-02.md:2917-2923`), and "doctrine walks a seat into it"
   (`napkin.md:1829-1836`).
3. **The cross-fork routing clause.** The cross-fork-integration SKILL routed carried-code
   findings to "an upstream report" until the owner's two-forks correction; every decision
   downstream "was correct GIVEN that model and wrong in fact" (`napkin.md:1742-1759`).
4. **Four smaller cases.**
   - pr-lifecycle stated "the bot cannot request Copilot", which was false (`napkin.md:124-126`).
   - Two disagreeing merge clauses in one skill file: "somewhere the wrong behaviour is
     recorded" (`archive/napkin-2026-09-07.md:1148-1156`).
   - The merge wrapper encoded a stronger rule than the owner's policy
     (`archive/napkin-2026-08-14.md:1651-1660`).
   - A worktree rule's "no friction" note was "blind from the start"
     (`archive/napkin-2026-09-10.md:343`).

In each case the seat read faithfully and was corrected in person, and the correction
landed in a napkin, a memory or a register row while the text stood. **The named
mechanism: a faithful reader of a wrong governing text is corrected forever.**
"Passive guidance loses to artefact gravity" already names the weak half. This strand adds
that the artefact itself can be the pathogen.

*Strand 3: verification sits after publication, so the estate buys it at the reviewer's
price.* Three seats reached this independently in one week:
- "the loop was displaced verification, paid at the reviewer's price instead of at write
  time" (Juno, 2026-09-06, `archive/napkin-2026-09-07.md:2145-2148`);
- "the review tail is the estate's own authoring-time check arriving late" (Flounder,
  2026-09-09, `archive/napkin-2026-09-10.md:1160-1170`);
- "the estate paying in rounds for whole-file reads it did not do in tokens" (Altair,
  2026-09-09, `:1213-1229`).

The unit costs are the owner's: a commit cycle "takes nearly 15 minutes"
(`archive/napkin-2026-09-02.md:1842-1845`), and "several hours of GitHub runner … produced
no value" (`:2015-2016`).

**Meta root: the estate's balancing loop for purpose is mostly the owner, and its response
to failure is additive.**
- **Internal instruments check mechanics.**
  - "internal instruments audit MECHANICS; only external reads audit WARRANTS"
    (`archive/napkin-2026-09-02.md:779-781`).
  - "Cricket is a lens on priority and proportion, not on method or evidence provenance"
    (`:2830-2831`).
  - "A consultation inherits the asker's frame … the opposite of parallax, while feeling
    like diligence" (`napkin.md:1698-1704`).
- **Frame checks work only when commissioned against the question.** The anchor-free legs
  on 2026-08-17 "were the only parts of the day's work that survived" and agreed with the
  owner (`archive/napkin-2026-09-02.md:610-612`). They are the exception, not the default.
- **Addition has no internal brake.**
  - "a rule-dense corpus always offers a licensing rule for more activity"
    (`archive/napkin-2026-08-14.md:1433`).
  - "the owner SUBTRACTED at every touch while agent rounds had ADDED" (`:2672-2674`).
  - "Every owner correction today was cheaper than the ceremony that preceded it"
    (`archive/napkin-2026-09-07.md:2395`).
  - The 2026-09-07 mapping fleet spent about 8.1M tokens, and "after eight million tokens and
    four hours the napkin had zero items homed" (`:2424-2432, 2517-2518`).
- **The result.** The doctrine corpus grew by about 30 %, widening both the licensing surface
  and the reading load. The purpose-level corrections kept coming from one person.

The next "why" (why fluent models prefer adding to subtracting, and take a classification
for a purpose) leaves the estate's control. The owner's 2026-09-11 word is the estate-level
response: "We are using lower powered models now, so we need to rely more on the structure
of the Practice than we have been doing" (`napkin.md:989-990`). The stack stops there.

## The counterframe (Parallax, core depth)

**The strongest rival reading.** Recurrence is the price of rotation, not of the
text-structure balance. Fresh seats, compactions and model changes each strip what a seat
knew, so lessons are re-learned by construction. The evidence for it is real:
- a fresh seat's "lesson … belongs in a new seat's FIRST-ACTS posture, not learned by
  instance" (`archive/napkin-2026-08-14.md:2920-2922`);
- "a summary keeps the what and drops the where" (`napkin.md:1443-1445`);
- the model-switch regression above.

**The evidence against it as the whole story is same-seat, within-hours recurrence.** A
fabricated identifier repeated fourteen hours after the same seat authored its cure: "at
call time the fabrication does not FEEL like fabrication — it feels like recall"
(`archive/napkin-2026-08-14.md:385-390`). This seat broke its own written residency cure
"within four hours" (`napkin.md:1560-1568`). A Director recorded "fires when I run it and
fails when I remember instead" (`archive/napkin-2026-09-10.md:226-235`).

**Crosswalk.** Rotation raises how often a seat meets an unlearned lesson. It does not
explain a seat failing to apply a lesson it wrote that morning. The two readings agree on
the remedy class, which is checks that travel with the estate rather than with the seat.
That is exactly the owner's 2026-09-11 frame. The counterframe changes the weight on
seat-portable structure. It does not overturn the stack.

## The counterfactual test (cured segments of the same arc)

1. **The review tally: doctrine against instrument.** The 2026-08-24 retrospective proposed
   the tally "built at PR-open, structurally". The only pr-lifecycle commit between
   2026-08-24 and 2026-09-01 12:00Z is `629349901` (PDR-140, 2026-08-31 22:07Z), which put
   the intake contract into doctrine that evening, after #32's unbuilt tally the same day. Unbuilt tallies at PR-open
   then recurred:
   - #915 (2026-09-02, "one day after that clause landed", `archive/napkin-2026-09-07.md:532-539`);
   - #961 (`:781-783`);
   - #50, eleven rounds and 28 findings with every finding cured (`:1217-1232`);
   - #54, eight rounds with no budget-exceeded recorded (`:1484-1495`);
   - #58 and #59 (`:1898-1901, 1975-1977`);
   - #82, eight rounds, "a loop with no counter", recurring "one day after the machine
     recorded it" (`archive/napkin-2026-09-10.md:442-461, 480-482`).

   The tally builder landed on 2026-09-12. On its first reading the seat recorded "#136
   closed by two rejections and #138 by four" (`napkin.md:1243-1244`). The review-cost gate
   refused an over-budget push two days later (`napkin.md:1389-1391`), and #149 settled in
   two rounds within its budget (`review-cost-ledger.md:42`, "2 | 7.81 / 40 | within"). **Observational, and weaker after 2026-09-12:** the estate was a single seat by
   then, so it raised fewer pull requests. The shape still matches finding 1 of the
   2026-08-07 synthesis: the doctrine did not change the rate, and the instrument did.
2. **Verification before publication against review rounds.**
   - **Before a public push:** the PDR-140 panel took "four agents for ~4 min wall each,
     versus eleven post-push review waves this morning" (2026-08-31,
     `archive/napkin-2026-09-02.md:2211-2215`). This seat's 2026-09-16 verification pass
     caught about eighteen claim errors before commit (`napkin.md:1949-1973`), with no CI
     cycle and no review round.
   - **After a public push:** #50 took eleven rounds on one census report. The 2026-09-06
     consolidation spent "about 3 h in the landing loop", fixing "about twenty-five
     reviewer-caught errors of one generator" (`archive/napkin-2026-09-07.md:2145-2148`).

   **Observational.** The artefacts differ, and the pre-publication passes' token cost is
   not recorded here, so this establishes where findings were caught and at what kind of
   price, not a controlled cost ratio.
3. **A hand drain against a mapping fleet** (same consolidation, same object). The fleet
   spent about 8.1M tokens and had homed zero items when the owner asked
   (`archive/napkin-2026-09-07.md:2424-2432`). The hand pass then verified all 708 mapped
   items at the seat: 367 already homed, 129 proposals read, 26 rejected with reason, and
   186 state tracked elsewhere. It landed the accepted proposals in three passes
   (`archive/napkin-2026-09-10.md:41-46`). The seat then wrote
   down "the cheaper shape for the next one: a hand yield sample, a hand drain, one PR per
   home class, declared one-push budgets" (`:96`).

## Honest credit (what the cost bought)

**The price** was real:
- owner attention, repeatedly spent in anger ("why the hell are you asking?", "you paid that
  lip service");
- tokens: about 8.1M on one fleet, 4.77M on one validation run, 1.7M on a decision matrix
  whose framing one owner card dissolved;
- review tails of seven to eleven rounds on small records and report pull requests;
- seats held at prompts nobody could see: about nine hours once, three to four hours three
  times, and an hour once;
- a doctrine corpus larger to read.

**It bought** these instruments, landed and working:
- the review tally builder and review-cost gate;
- the merge-bot front door with typed refusals and, in #149, a reviewer-leg predicate that no
  longer reads the seat's own empty replies as a review;
- the argument-aware Bash guard;
- the `no-conditional-tests` lint rule and plan-corpus YAML parse;
- the two upstream sync workflows (#131);
- the first native-Windows CI proof;
- the operator profile with its schema and check.

**Doctrine that visibly changed outcomes:**
- PDR-140 and its records-class clause;
- the docs-only bot-merge class;
- the three landing requirements, "green and clean and sensible";
- the owner's review-legs ruling. Its subagent legs found real defects the vendor rounds had
  not, and the vendor rounds after them found what the legs had not: "More perspectives, more
  findings — the owner's value, proved six times in one afternoon" (`napkin.md:710-717`).

**Named mechanisms, all dated in the ledger:**
- surface that misinforms without failing;
- a baseline transmits its stance;
- the certainty boundary;
- absence-modelling;
- declared scope against causal scope.

**The Director structure** (deadline-and-default, the landing slot, a demonstrated handoff
in nine minutes) landed more than twenty pull requests in single tenures. None of that
excuses the price. It is what the price bought.

## Proposals (warrant and falsifier each; PDR-130 lanes)

No register rows are added by this record. Its consumer is the dedicated consolidation
session, whose first surface is that register. Adding rows the same day would be the
producer outrunning the consumer that a 2026-09-06 consolidation measured
(`archive/napkin-2026-09-07.md:2155-2159`). Each proposal is written to be registered, or
killed, there.

1. **[FAST: text cures before any new doctrine; items 1 and 2 of the consolidation session,
   plus one line.] Cure the three governing texts the owner has corrected in person.**
   - `testing-strategy.md`'s IO admissions go to the owner's invariant (register entry,
     line 133).
   - The cross-fork SKILL's routing clause goes to the two-forks model (line 143).
   - pr-lifecycle lines 537-538 stop prescribing the `--watch` form F-164 records as
     silent: the working form replaces it (a background `gh pr checks <n> --watch`, which
     ends with the checks), or the line goes until `pr-watch` is fixed.

   *Warrant:* strand 2. The IO invariant was corrected five times while its text stood,
   and the prescribed watch form has four recorded silent instances. *Prediction (the fast-lane
   sentence):* after the cures land, no owner correction repeats on these three classes.
   *Falsifier:* an owner correction on any of the three after its text is cured, which
   would show the text was not the generator, or not the only one.
2. **[SLOW: it changes how the estate changes its own texts; for the slow-lane register at
   the consolidation session.] An owner correction that contradicts a governing text is
   cured at that text in the same session, in the owner's words.** The napkin still
   records the instance, but the text is the first home, not the last.
   *Warrant:* strand 2's eight instances against the measured 16-of-19 recurrence of
   capture-only homes. *Prediction:* over the review window, owner-corrected classes whose
   text was cured at the first correction do not recur as owner corrections. It is
   measurable from napkins, which over-record owner corrections (the 2026-09-02 synthesis,
   candidate C33), the same bias this record carries (§Epistemic profile). *Review date:*
   2026-12-16. *Falsifier:* text-cured classes recur at a rate no lower than capture-only
   classes in the next since-marker synthesis.
3. **[FAST: pr-lifecycle, applying the owner's 2026-09-10 review-legs ruling before the
   push rather than after.] Claim-bearing changesets get their verification leg before
   publication.** Records, doctrine and descriptions with stated invariants get one pass of
   context-free readers checking claims against sources and code. Review rounds then price
   only what that pass could not see.
   *Warrant:* strand 3's three independent statements and counterfactual 2. *Falsifier:* a
   changeset verified this way still draws three or more rounds of claim-class findings,
   or the pass costs more than the rounds it replaced (to be measured, not asserted).
   *Guard against H5:* it replaces post-push rounds and never adds to them. A pass on a
   changeset with no stated claims is ceremony.
4. **[FAST: the consolidation session's own shape.] Run the next consolidation in the shape
   the last two measured cheapest, and count subtraction as output.**
   - Take a hand yield sample before any instrument.
   - Drain by hand.
   - Open one PR per home class, each with a declared one-push budget.
   - Cure texts (proposal 1) before authoring new clauses.
   - Report the rules, skills and directives byte total before and after, as a signal and
     never a target (owner: "fitness functions are signals for attention, not instructions
     to act", `archive/napkin-2026-08-14.md:3176-3177`).

   *Warrant:* counterfactual 3; "less ceremony, more consolidate-docs". *Falsifier:* a
   session run this way ends with the napkin larger than at its open, or draws the owner's
   ceremony correction again.

## Play harvest (one bounded pass over the arc; guard applied)

**Kept, as associations:**
- **A court for mechanisms, a person for purpose.** The corpus engine's adversary quorum
  kills institution-level claims by construction: its regime, absence and distributional
  candidates all died (`historical-napkin-synthesis-2026-09-02.md:203-229`). The validators
  gate syntax. The only standing court for purpose is a person. This record's causal stack
  is the kind of claim that court cannot try, which is why it is stated as provisional
  (below).
- **This record re-entered the shape the owner corrected on 2026-09-02.** It read a whole
  napkin corpus into one context ("you used up the entire context window reading huge, old
  napkins", `archive/napkin-2026-09-07.md:130-132`), this time at the owner's explicit word.
  It was safe here for two structural reasons: a larger window, and the owner's 2026-09-06
  method word "write intermediate findings to disk" (`:1963-1969`), applied as a ledger
  written as each window was read. The structure, not the resolve, made first-hand reading
  survivable.

**Discarded, visibly:**
- "Owner corrections as the estate's adaptive immune response": the estate's own immune
  vocabulary (PDR-044) supplied it, which is fluency, not insight.
- A numerology of five corrections, six passages and five windows.

## Epistemic profile and limits

**Parallax envelope:**

| Field | Value |
| --- | --- |
| Inquiry | `retro-2026-09-16-written-lessons`, revision 1 |
| Depth | core: one charter, one serious counterframe, measured checks, a conclusion, world-return conditions |
| Execution | `emulated-reduced`: all frames in one context, no protected branches |
| Independence | same-context self-review; no independent audit ran |
| Status | **provisional** |

The status permits routing the proposals to the consolidation session. It forbids treating
the meta root or strand 2 as validated causation, or graduating anything from this record
alone.

**Defeaters, stated.**
- **Selection.** Napkins over-record owner corrections, and "The napkin measures recurrence,
  never extinction" (`historical-napkin-synthesis-2026-09-02.md:210-214, 280-282`). What stopped
  a class is therefore weakly evidenced from napkins alone.
- **The author is a subject.** Two of the live napkin's blocks are this seat's.
- **Byte counts are not reading load.** No seat loads the whole corpus.
- **The throughput regime changed.** Single-seat operation after 2026-09-10 lowers PR
  volume, so the tally counterfactual weakens after that date.
- **The review contract is unexercised.** No external reviewer has yet run it on this
  record.
- **Proposal 3, applied to this record before publication.** Two read-only subagents
  checked citation fidelity only, not the analysis: 114 citation checks in total, 42 and 72
  across the two scopes. They raised seven failures, and the seat confirmed all seven at
  source before curing them:
  - a quotation with its verb changed;
  - a count ("six times") attributed to the wrong half of a sentence;
  - "processed all 708 items into their homes", where the source verifies 708 and homes
    only the accepted proposals;
  - a count of three supported by only two cited ranges;
  - two quotes whose anchors sat a few lines outside their cited ranges;
  - one claim with no citation.

  These are this record's own instance of its technical root, caught before commit.

**Reopen when:**
- the next since-marker synthesis runs;
- a text-cured class recurs as an owner correction;
- the consolidation session's outcomes contradict proposal 4.

**World-return:** watch owner corrections on the three proposal-1 classes for thirty days
after their texts are cured, and read the next synthesis's recurrence census for
owner-corrected classes.

## Success test

Proposal 1 carries the sharpest lesson: three texts that re-teach errors the owner
corrected in person, with the IO invariant's five corrections as the measure. Strand 2's
named mechanism, *a faithful reader of a wrong governing text is corrected forever*, is the
mechanism the estate did not previously state across windows.

The retrospective lineage has one measured success to its name. The 2026-08-24 record's
proposal 2 became doctrine in seven days and an instrument in nineteen, and, observationally,
the instrument rather than the doctrine changed the rate. If none of proposals 1–4 is registered, killed or acted
on at the consolidation session, this record was a eulogy and should be named so there.

*Addenda land additively below this line; the record is never rewritten.*

## Addendum 2026-09-16 (compaction wrap): where the contradicting instruction lives

A concept-exploration pass at this seat's compaction wrap, run over the record's strand 2,
grew from a free-play inversion of its named mechanism. If a faithful reader of a wrong
text is corrected forever, then **a repeated owner correction on one class is itself a
detector**. The second correction is the moment to ask *which instruction told the seat to
do this*, before asking what the seat got wrong.

Asked of the record's instances, the question sorts them into three places, and each place
needs a different cure:

- **A wrong estate text**, cured at the text: the IO admissions in `testing-strategy.md`,
  pr-lifecycle's watch prescription, the cross-fork routing clause, and the two disagreeing
  merge clauses (strand 2).
- **A platform text the estate cannot edit.** This seat observed it first-hand in its own
  context this session. The harness's auto-mode note tells a seat it may "make small,
  mechanical file changes with sed, heredocs, or short scripts instead of the dedicated Read,
  Edit, or Write tools". The owner has corrected shell-based editing at least three times:
  - "why are you writing python to edit files?" (2026-09-02,
    `archive/napkin-2026-09-02.md:2739`);
  - "stick to using standard tools rather than complex bash scripts which confuse the
    permissions agent" (2026-09-06, `archive/napkin-2026-09-07.md:2088-2089`);
  - "Use the proper tools only" (2026-09-16, `napkin.md:1577`), after which this seat
    breached it again the same day (`napkin.md:1760-1766`).

  A 2026-09-08 seat had already named the pull: cures applied through heredoc scripts
  "under a harness note preferring Bash, which the owner's word overrides"
  (`archive/napkin-2026-09-10.md:997-1000`). The note arrives fresh in context at every
  mode change, and the owner's word is a record read earlier. The text cannot be cured at
  source, so the only cure that beats it is a check at the act.
- **A missing text**, cured by a firing point at the moment the text was missing. The
  BATCH-CADENCE ruling recurred three times while it lived only in a napkin, and the commit
  skill gained its cadence gate at the 2026-09-02 consolidation
  (`archive/napkin-2026-09-07.md:40`).

**Proposals** (inputs for the consolidation session, extending proposal 2):

- **A (with proposal 2's slow-lane row):** at a second owner correction on one class,
  record where the contradicting or missing instruction lives (estate text, platform text,
  or no text) and cure at that place. *Falsifier:* a repeat-correction class with no
  contradicting or missing instruction to be found, which would show the three places are
  not exhaustive.
- **B (FAST, a Bash-guard policy entry):** refuse in-place edits of tracked repository files
  from the shell, meaning `sed -i`, `perl -pi` and a redirect or heredoc into a tracked
  path, with the owner's 2026-09-16 words as the refusal text. *Warrant:* the platform-text
  class above. *Falsifier:* a seat still edits a tracked file through the shell after the
  entry lands (a matcher gap), or the entry refuses a legitimate generator run.
  *Unresolved:*
  - whether the argument-aware matcher (#116) sees shell redirection targets at all, since
    redirections are not argv;
  - whether scratchpad scripts that call CLIs stay outside it, as they should.

## Addendum 2026-09-16 (the dedicated consolidation): where the citations now resolve, and what became of the proposals

**Citations.** The live napkin this record cites as `napkin.md:<line>` was rotated at the
consolidation to `.agent/memory/active/archive/napkin-2026-09-16.md`, byte-identical to the
coordination branch's napkin at `29648a216`. Its first 1,978 lines are the napkin as it stood at
this record's commit (`940c019a6`), unchanged by the later union that appended the Oak-line
blocks after them, so every `napkin.md:<line>` citation above resolves at the same line in that
archive file.

**Proposals, as the consolidation dispositioned them.**

- Proposal 1: two of the three texts were cured in `63b544464` (pr-lifecycle's watch
  prescription, with its false Codex-push claim — replaced by a compound GraphQL watch loop
  that ends only on MERGED or CLOSED, not by the `gh pr checks --watch` form proposed above,
  which the skill records as sharing the exit-at-completion hole; the cross-fork routing clause, with the sync
  runbook, the MCP-487 plan line and the 1.181.1 draft's header). The IO admissions in
  `testing-strategy.md` are the first entry of the directive pass, which the
  directive-file context budget holds for a fresh context.
- Proposal 2 with addendum A: registered as a slow-lane row in `pending-graduations.md`, review
  2026-12-16.
- Proposal 3: enacted in pr-lifecycle §Phase 2 (a claim table and a pre-publication verification
  pass, with a prediction and a falsifier).
- Proposal 4: the consolidation ran by hand with read-only locators whose every citation was
  checked; its before-and-after byte report is not produced, because
  `permanent-doc-is-the-consolidation-record` forbids before/after accounting in a closeout.
- Proposal B: routed as the candidate interrupt beside the recurrence evidence in
  `action-time-structural-interrupt-design-space.plan.md`, with its unresolved matcher question.
