# Retrospective: did the two-estate consolidation of 2026-09-30 curate knowledge or chase numbers, and is another needed?

Written 2026-09-30 by the seat that ran the session (Hawthorn binds Bracken, b3f117, claude-code,
claude-fable-5-1), at the owner's word after the closeout: "Please perform a deep retro then handoff.
Analyse what you did, look for problems, issues with framing, incorrect directions. Use adversarial
subagents of different kinds." The owner's first correction at that moment: "it's not 'the lineage',
it's OCE." The owner's second word, mid-retrospective, verbatim: "The retro must encompass both
estates. All activities involving both estates MUST leave them more aligned and less divergent than
they were before those activities." The next session reads this record and decides whether another dedicated consolidation is
needed. Every count below names the command that derives it; the adversarial legs' findings are in
§What five adversarial legs found and §What the OCE-side leg found, quoted as returned, with the seat's disposition of each.

## The brief, verbatim

"This is a dedicated consolidation session. The goal is knowledge curation, never fitness numbers.
Done means empty pending graduations and empty buffers: say those counts first in every report.
This job is higher priority than the daily branch fold." And: "Where a consolidation skill differs
between the estates (consolidate-until-done, consolidate-docs, wrap, session-handoff, curator-pass,
knowledge-safety-sweep), read OCE's copy; the divergence itself is a defect to fix in both estates."

## Reconstruction from primary sources

Timeline, from `git log --format='%h %cI %s'` in each estate (times converted to UTC):

| UTC | estate | sha | what landed |
| --- | --- | --- | --- |
| 15:18 | JC.net | c48d9104 | 32 register entries graduated into their homes; the window registry corrected |
| 15:38 | JC.net | 4882e8c8 | the napkin rotated, distilled emptied, per-user memory marked graduated |
| 15:44 | JC.net | 1b2f04b5 | the six consolidation skills converged to one text |
| 15:56 | JC.net | e6b2a92f | OCE's 28 per-user memory lessons homed in both estates |
| 15:58 | OCE | fb999c70c | the OCE half of the above, 65 files |
| 16:00 | JC.net | cbef28f1 | five queued register entries written into directives (reading 15.1 %) |
| 16:03 | OCE | 11fdd39c4 | the OCE directive step (reading 18.4 %) |
| 16:06 | JC.net | 8a46b710 | a napkin lesson homed; the Edit-tool edge |
| 16:10 | JC.net | 80447e27 | the substrate contract's retired path (a push-gate refusal cured) |
| 16:15 | JC.net | 6facb6c6 | a directive's link into the patterns tier replaced (a second refusal cured) |
| 16:20 | JC.net | 576d704c | the Director handoff's finished state archived; the record's clock corrected |
| 16:29 | JC.net | 93c6bb42 | seven comms-table rulings homed; the owner-signal record whole in both estates |
| 16:30 | OCE | d41ea4d5e | comms-table section B drained; the OCE handoff state archived |
| 17:02 | JC.net | 7587f443 | 30 comms-table lessons homed; the continuity record curated |
| 17:09 | JC.net | 82e8c3ac | the close block; the Codex wording made lockstep-safe |
| 17:10 | OCE | 0670e30e8 | the comms table drained (§H); the frictions register archived |

Change totals (`git diff --shortstat`): JC.net 103 files, +2,564 / −1,636 lines; OCE 93 files,
+2,752 / −1,464 lines. Pushes refused before landing: JC.net four (a retired path in a record, a
directive linking into the patterns tier, a cited path the host does not own, a pattern index out of
sync); OCE one (a lockstep unit test on the Sif annex). Commit messages refused by the check: seven
(six headers over 100 characters, one sentence-case subject); two chains were launched before their
message check had passed.

Subagent cost, from the harness's per-agent usage lines (`scratchpad/leg-costs.json`):

| leg | tokens |
| --- | --- |
| comms section B (pilot, 42 rows) | 273,544 |
| comms section C rows 1 to 47 | 270,608 |
| comms section C rows 48 to 93 | 218,597 |
| comms section D (61 rows) | 340,140 |
| frictions part 1 (pilot, 49 entries) | 259,298 |
| frictions part 2 (50 entries) | 223,548 |
| fleet review, assumptions leg | 172,008 |
| fleet review, frame-challenger leg | 58,649 |
| total, eight legs | 1,816,392 |

The seat told this retrospective's five legs "about 2.7 million subagent tokens". The recomputed
figure is 1.82 million before those five legs. The overstatement was a number said from memory, the
failure `verify-dont-trust` names first; it is recorded here as an error signature.

Counts at close, each from its instrument: JC.net pending graduations 3 by the file (2 by the parser,
`pnpm practice:fitness:informational`, Live decision-debt), all gated on the owner's session-2 cards;
JC.net buffers 0 (distilled.md holds a header and a pointer paragraph; the per-user memory index holds
one new feedback memory and no other live line; the napkin holds the day's blocks, each homed). OCE
pending graduations 1 (the seven owner cards); OCE buffers 0 by decision (per-user memory keeps five
owner-private or operator-environment files). The comms decision table's section H: HOMED 62, MOVE 38,
SESSION-SCOPED 34, SUPERSEDED 8, OWNER-CARD 7, OWED 47 over 196 rows at the consolidation's close
(`python3 verify-report.py counts` over the four reports plus the overrides); at the retrospective's
close HOMED 59, MOVE 36, SESSION-SCOPED 34, SUPERSEDED 9, OWNER-CARD 7, OWED 51, after five re-verdicts. The OCE frictions register's §Friction Entries: 99 entries to 44
(`grep -c '^### F-'` under that heading), 55 archived byte-identical with index rows; its §Routing Notes
holds 86 further entries no pass has read, so the register holds 130. OCE pending graduations read 0
at the retrospective's close, the seven cards moved to `repo-continuity.md` §Open Owner-Decision Items.

## What the session did, in the owner's frame

Knowledge moved from buffers and registers into the surfaces that fire: about 130 lessons across
both estates (32 JC.net register entries, 7 distilled entries, the two per-user memory sets, the five
directive entries, 38 comms-table rulings, 9 friction lessons, the six skills' divergence). Every
shared surface touched reads the same bytes in both estates (`diff` between the checkouts, run per
file). The owner's 2026-09-29 and 2026-09-30 words are in testing-strategy and user-collaboration
verbatim.

## Problems, framing errors and wrong directions the seat can see

Ordered by depth; each names its technical, process and meta root.

1. **Naming OCE "the lineage".** Technical root: the transplant records and PDR-005 use "lineage" as
   the role word for a source Practice, and the session's own continuity summary carried "the
   lineage" as OCE's alias, so the seat inherited it. Process root: the seat never read how the owner
   names the estate ("OCE and JC.net Practice alignment", the owner's own words of 2026-09-24, held in
   memory). Meta root: an insider euphemism read as vocabulary, and the portability guard that blocks
   the repository slug on JC.net surfaces pushed the seat toward a euphemism instead of the plain
   acronym the owner uses and the estate already carries. Cured in the seat's own records this turn
   (`grep -n lineage` over the session's added lines; the archives moved byte-identical keep prior
   seats' wording); PDR-005 and `replace-dont-bridge` keep "lineage" as the generic role word, which
   the owner may also want renamed.
2. **Fitness readings drove some priorities.** The brief said never fitness numbers. The seat read
   `practice:fitness:informational` five times and chose the Director handoff and repo-continuity
   archiving off the critical and hard lines. The moves themselves are the consolidate-docs skill's
   graduate-then-archive step and left both records legible; the selection was number-led. Meta root:
   a readout is legible and knowledge value is not, so a seat under "done means empty" drifts to what
   it can count. Counterfactual: the same two moves justified by "finished state with pointers" would
   have cost the same and read as curation.
3. **Volume of single-instance paragraphs written into rules.** About 38 comms-table paragraphs, 9
   friction lessons and around 60 register and memory graduations landed as dated paragraphs at the
   end of rule and skill sections in one day, most of them one event each with a decider named.
   `one-instance-is-an-observation` allows an observation written as what happened; `promote on the
   first instance` (owner, 2026-06-27) asks for it; `permanent-doc-is-the-consolidation-record`
   forbids a ledger. Together they make rules accrete: `verify-dont-trust`, `worktree-residency`,
   `liveness-heartbeat-cron` and `comms-all-channels-watcher` each gained two or more paragraphs
   today. The question this raises is accuracy and findability, never volume: does a reader find the
   lesson, and does each paragraph claim no more than its one instance? It is re-read under §The
   owner's frame below.
4. **HOMED verdicts accepted on a phrase match.** 104 rows across the four comms reports were
   HOMED; the seat checked each home file exists and the analyst's quoted phrase is in it, then read
   a handful. A wrong HOMED drops a lesson silently. The frame-challenger named this; the seat added
   the phrase check and did not read the homes whole. The legs' samples below are the first
   independent read.
5. **Records written from memory of the estate.** Four push refusals and the lockstep test each came
   from writing a path, a link, an index state or a version literal without reading the live
   surface: the exact anti-pattern the seat wrote into `verify-dont-trust` that morning. The cure
   landed late (the `pnpm check:docs` pre-flight in the chains from commit 9 on, now in
   `lint-after-edit`).
6. **Seven message refusals and two premature chain launches.** Headers composed by feel against an
   exact limit; launches gated on a file existing rather than on the check's exit. A per-user
   feedback memory now carries the cure (a length assert before the file is written; launch only on
   the check's exit code).
7. **A time written in local time as UTC** in the first state block, corrected in place with a note.
8. **A wrong figure handed to reviewers** (2.7 million against 1.82 million recomputed), see above.
9. **Codex-facing corrections while the owner has parked Codex.** Two factual corrections (the Sif
   annex's binding gone; the idle wake) were right to make, but the first wording restated a version
   literal a lockstep test forbids, costing an OCE gate run. The test itself reads `.agent/` files,
   which `testing-strategy` §Rules forbids; that is a defect for the next OCE session, recorded in
   §What the next session inherits.
10. **OCE's owner-signal sections ported whole into JC.net**, including "colleagues run on trust"
    written about Oak's culture (neutralised to "the working culture") and the owner referred to as
    "he" in copied text. The same-bytes goal was applied to an executive memory whose worked
    instances are OCE's; whether that record should be shared or estate-specific is the owner's
    call and is listed under the decisions.
11. **JC.net's comms events were never walked.** The staircase names comms events as the second
    capture surface (`directive-file-context-budget` §Sequencing, item 2). The seat drained OCE's
    comms table because it was a register entry, and left JC.net's stream to an owner decision. The
    stream holds 4,304 events from 2026-08-09 to 2026-09-30, 3,464 of them heartbeat-tagged
    (`ls .agent/state/collaboration/comms | wc -l`; a read of every file's tags), so about 840
    substantive events await the same treatment OCE's 1,266 received on 2026-09-25. This is the
    asymmetry the first adversarial leg named first.
12. **The method lives only in the scratchpad.** The analyst frame with its decider field, the
    OWNER-CARD and OWED verdicts, the quote-substring verification and the overrides file are the
    reusable part of the day and exist only as session files described in the thread record.

13. **A paragraph appended twice.** The apply step's "text absent from the home" check compared the
    unwrapped insert with the home's wrapped text, so two paragraphs JC.net's pull-request lifecycle
    skill already carried (C-62's waypoint rule, C-66's `merge-bot retire` delete) were appended a
    second time to OCE's copy. The divergence measure found them; a sentence-level duplicate scan
    over every file changed today in both estates found no other. Cured; the check itself is the
    lesson: compare whitespace-collapsed text, never raw.

14. **A verdict in a vocabulary the owner forbade.** OWED, 51 rows. The owner's 2026-09-28 word in
    OCE's continuity record calls "owed" the parked shape the Practice forbids and asks for the
    cognitive skills instead; the seat never read it. Root: the fleet review named the decider gap and
    the seat cured it with a deferral verdict rather than a decision per row.
15. **A record rewrapped as if it were prose.** The archiving script's rewrap step joined OCE's
    Director handoff frontmatter into one line and its "section end" landed two README paragraphs
    inside a code fence in both estates. Root: a block-level rewrap with no notion of frontmatter or
    fences, written for one file and run on four. Both cured; found by the OCE-side leg.
16. **No claim, no comms event, all day, either estate.** The seat worked both estates without the
    presence the collaboration rules require; a peer reading either estate's state could not have
    seen it. Weighed under §The owner's frame below: no peer was live in either estate, so the claim would
    have served no one; the cheaper form that stays true is one line a peer who arrives can read.

## Counterfactual

The cured segment exists inside the session: from commit 9 (16:20Z) every JC.net chain ran the docs
pre-flight before committing and no push was refused; before it, four of eight pushes were. The
frame revised after the fleet review (decider field, OWED, OWNER-CARD) produced 47 owed rows and 7
cards that the pilot frame would have mis-filed as SESSION-SCOPED or MOVE; the pilot's own 13 MOVE
rows became 7 writes, 4 cards, 1 HOMED and 1 SESSION-SCOPED once the seat re-read them under the
revised frame. Had the review run before the pilot, the pilot's 274k tokens would have bought the
same verdicts with no re-read.

## Honest credit

The cost bought: the six consolidation skills and the per-user-memory rule identical in both estates;
the owner's testing and validation words of 2026-09-29 in the testing-strategy directive verbatim in
both estates; the comms decision table, unread since 2026-09-25, dispositioned row by row with a
decider and the owner's seven cards batched; OCE's frictions register's §Friction Entries readable again with 44
live entries and every settled id still resolvable; the two Director handoffs and the JC.net continuity
record legible, their finished state archived byte-identical; both per-user memory buffers emptied
into homes with an audit trail per file; and two fleet-review findings that changed the fan-out
before it launched.

## Proposals, each with warrant, falsifier and lane

1. **Withdrawn (2026-10-01).** A count-triggered compaction step was proposed here; the owner's frame
   below retires it. A merge of dated paragraphs is made only where it makes a lesson easier to find
   and keeps every instance's specifics; length is never the reason.
2. **Home the fan-out method.** The analyst frame (decider field; HOMED, SESSION-SCOPED, SUPERSEDED,
   MOVE, OWNER-CARD, OWED), the seat's verification (quoted phrases as substrings of the source, the
   home present, the text absent, the SUPERSEDED evidence read), the overrides file and the pilot-then-
   review order go into consolidate-docs §Approach or a reference page. Warrant: two review cures
   that a fresh seat would otherwise re-learn. Falsifier: the next fan-out reinvents the frame from
   scratch. Lane: fast.
3. **Fitness read twice, never as a queue.** A consolidation reads the fitness readout at open and at
   close and never selects work from it; the readout is a noticer. Warrant: the brief and problem 2.
   Falsifier: a consolidation that ignored a critical reading left a record unreadable. Lane: fast
   (one sentence in consolidate-until-done).
4. **OCE is the name.** On JC.net surfaces the sibling estate is "OCE"; "lineage" remains PDR-005's
   role word for any source Practice in a transplant, never a name. Warrant: the owner's word today.
   Falsifier: the owner also wants the role word renamed. Lane: the owner's decision, one line in
   `practice-core-portability`.
5. **A test that reads `.agent/` is a defect to cure, not a gate to satisfy.** The OCE lockstep test
   should pin the probe record through an injected reader or a generated fixture. Warrant:
   testing-strategy §Rules and the owner's 2026-09-29 words. Falsifier: the owner rules the lockstep
   pin a validator. Lane: OCE's next code session, as an OWED row.

## What the next session inherits

The next session is a capability-parity session, both ways, by the owner's word of 2026-10-01:
inventory what each estate holds that the other lacks (the exchange register's L7 review-cost gate
and L8 pr-tally into JC.net; OCE's commit queue; JC.net's docs pre-flight, its divergence measure as
an `agent-tools` command, the visual-regression harness where it applies), then transplant lane by
lane in small pull requests. Inside it, as they are met: the 51 deferred rows of §H decided (do,
drop, or the owner's call), the 44 live and 86 unread frictions in OCE's register read for lessons
without homes, a sample of JC.net's comms stream before any pass is sized, the three shared files
still more divergent than at the open, the Codex lockstep test's read of `.agent/` files, and the
event-cited paragraphs re-trued to their evidence in place.

## What five adversarial legs found

Five legs of different kinds ran with one frame (cricket-procedure-xhigh, assumptions-expert,
architecture-expert-wilma, docs-adr-expert, and a general-purpose verifier that re-derived samples
from primary sources), 779,690 tokens together. Their reports are quoted in the seat's words below
with the seat's disposition of each; the verifier's sample results are stated as it returned them.

**Converging, severity 4 to 5, accepted.** Single-event rulings by Director and working seats from
OCE's comms stream were written into shared rules and skills as normative sentences in both
estates: 30 distinct event ids now cite OCE's transport from JC.net doctrine, where none of the
events can be read; 15 OCE seat names, OCE pull request numbers and one OCE friction id entered
JC.net rules; the rules tier grew by 404 net lines in JC.net and 384 in OCE (`git diff c48d9104~1
82e8c3ac --numstat -- .agent/rules`; verify-dont-trust 867 to 915 lines). The seat's OWNER-CARD
verdict stopped at decision records, directives and role contracts and let rules and skills
through, so the decider gap the fleet review named was cured for the smaller surface and left open
for the larger. `one-instance-is-an-observation` and `new-rule-vs-pdr-clause` both name this shape.
Disposition: the direction question for the owner and the next session, stated under §Decided 2026-10-01;
the seat did not bulk-rewrite 38 paragraphs at a session's end.

**Accepted and cured this turn.** The two Codex inserts (the Sif annex and the use-monitor relay
section) contradicted the rule's own stated position and wrote a moving-target clause into a
lockstep-pinned surface while the owner has parked Codex; both were withdrawn in both estates and
their rows re-verdicted OWED to the Codex lane. Three HOMED verdicts failed on substance in the
verifier's sample (D-33 superseded by the owner's 2026-09-17 word; C-77 a hazard no rule names; B-22
an admitted contradiction) and are re-verdicted in §H. Section H was a 196-row ledger with 134 cells
cut at an ellipsis and every B row's decider blank; it is now one paragraph per section plus the
owner cards and the owed list in full, the analysts' reports conserved whole beside it, and every
owed row re-addressed from the closed Director lane to the n=1 seat or the owner. Five shared files
had diverged again through estate-specific citations; they now carry one citation form. A relay
attribution named the wrong seat (event 01808b32; the author routed the defect, the Director ruled).
Two paragraphs sat below a rule's link list and are moved into the body. The thread record's blocks
were out of time order and its continuation described the session's opening; both rewritten. The
"Drive, never coordinate" paragraph is marked a seat's reading, not the owner's words. OCE is named
OCE in every tracked line the seat wrote; archives moved byte-identical and commit messages keep the
old word.

**Accepted and cured at the retrospective (the meter read 10.3 %, under the directive gate).** In
`user-collaboration` the sentence "a plan's execution waits for a fresh seat unless the owner says
otherwise" now opens "A seat's reading of that word, never the owner's" in both estates; in
`testing-strategy` the 2026-09-29 quotation is labelled "as two seats relayed it" in both estates
(the words reached the record through Siren and the Director); `privacy` rule 7 (JC.net only; OCE
has no privacy directive) now says its four categories are a seat's list from a napkin awaiting the
owner's review.

**Accepted, owed.** Five settled frictions carry lessons with no permanent home (F-60, F-62, F-66,
F-111, F-182), deferred although `consolidate-until-done` calls a graduation non-deferrable; the
owner's session-end word bounded the scope. Section B's 42 rows carry no decider field (the pilot
frame predates it). The verifier found two of ten sampled inserts unfair in degree (a live sweep
labelled a closeout with a qualifier cut; a confirmed instance stated as a precedence rule).

**Refuted with evidence.** The per-user memory marker ("Graduated to <path>; this file is the audit
trail") is the form `per-user-memory-is-a-buffer` prescribes (its lifecycle steps 2 and 3), not the
rejected provenance pointer of `permanent-doc-is-the-consolidation-record`, which governs tracked
permanent docs. The JC.net napkin was not "archived instead of consolidated": its lessons were
homed in commit 4882e8c8 and the window archived after, the rotation the napkin skill prescribes.
The cost figure the seat gave the legs (2.7 million) was wrong, not the legs; the recomputed fleet
cost is 1.82 million before the retrospective's own 0.78 million.

**Contested, left to the owner.** Whether "done" was honestly reported: the seat reported index
lines (JC.net 1 live, OCE 5 live) where the directories hold 78 and 30 files; the buffer rule keeps
the files by design, and the plan asked the seat to "settle with the owner which surfaces empty
covers", which the seat did not do. Whether the session-2 cards behind JC.net's three register
entries were answered on 2026-09-14 (the completion plan says so, "closure record, item 100") or
remain owed as the register says. Whether the bulk archives (55 frictions, two handoff states, 576
lines of continuity record) stand, made without the owner's word against the record's own Risks
clause; each is revertible, the archives byte-identical.

## What the OCE-side leg found

A sixth leg, a general-purpose verifier resident in OCE (179,952 tokens; 43 tool uses), read OCE's five
commits and working tree against OCE's own rules, from the OCE side. Its findings, with the seat's
disposition of each:

**Accepted and cured at the retrospective, both estates where the file is shared.** The script that
archived the Director handoff's state rewrapped every block wider than 100 characters, and in OCE that
included the record's YAML frontmatter, which commit d41ea4d5e left as one line (JC.net's copy escaped
because none of its frontmatter lines was that wide); restored from the base commit, and the lesson is
the script's: never rewrap a block that is not prose. Both handoffs kept a sentence saying the state
blocks were "kept" two lines above the sentence saying they were archived; removed. The friction
lessons F-19 and F-36 had been appended inside an open ```` ```bash ```` fence in `agent-tools/README.md`
in both estates (the apply step's "section end" was the fence's inside); moved below the fence. The
register entry for the seven owner cards was mis-homed: the register's own §What belongs here sends an
owner decision to `repo-continuity.md` §Open Owner-Decision Items; it is item 11 there now, and OCE's
pending graduations read 0. `consolidate-docs` step 6b requires a whole-file snapshot when an archive
move is non-contiguous; none existed, and `archive/frictions-register-pre-curation-2026-09-30.md` now
holds the base file byte-identical (a duplicate of what the pre-move commit already preserves; see §The
owner's frame). §H's preface claimed every owed row was re-addressed while fifteen
carried no addressee and others named lanes with no heartbeat; the preface now states one rule for
every row and names the five re-verdicts.

**Accepted, a framing error of the seat.** The OWED verdict. The owner ruled on 2026-09-28 (OCE's
`repo-continuity.md`, the Director's pickup block): "What does owed mean? That sounds like parked,
which is forbidden for very good reason. Use the cognitive skills." The seat minted 51 rows in that
vocabulary without reading the ruling. Each row is a decision still to make (do it, drop it, or the
owner's call), and the next session takes them through the decide step rather than carrying a queue;
§H now says so at its head.

**Accepted, a reporting error.** "99 entries to 44" counted only the register's §Friction Entries; 86
entries under §Routing Notes (F-119 to F-217, statuses open in four spellings) were outside the
analysts' coverage and every count the seat reported. The register holds 130 entries, 86 of them
unread by any consolidation; the archive's 55 index rows cut their disposition cell at an ellipsis,
with the whole entry beside each in the archive.

**Weighed, not a defect as stated.** The seat held no claim and posted no comms event in either estate
all day (`register-active-areas-at-session-open`, `use-agent-comms-log`); its identity appears nowhere in
either estate's collaboration state. No peer was live to read either, so the ceremony had no purpose that
day; see §The owner's frame.

**Accepted, for the owner (decision 1).** Five sampled rule paragraphs (`never-disable-checks`,
`plan-body-first-principles-check`, `verify-dont-trust`, `liveness-heartbeat-cron`, `lint-after-edit`)
and five homed friction sentences are single-event, normative, name a seat or an event id, and state no
count or falsifier; one was the seat's own day written into a rule the same day. The leg recommends
reverting the rule paragraphs (about twenty in OCE, text conserved in §H and the reports) rather than
compacting them. The owner's frame of 2026-10-01 settles it as neither: every paragraph stays where a
seat reads, re-trued to its evidence in place.

**Confirmed, already a decision.** `consolidate-until-done` step 1 asks the owner before a bulk act
such as an archive lifecycle; the day's four bulk archives were made without the word. That is decision
2. The lockstep test passes (5 of 5).

**The leg's verdict.** OCE is not better curated than at its base by its own rules (378 net rule lines of
single-event doctrine in a direction §H itself leaves undecided; the destroyed frontmatter; the
unread 86; the forbidden vocabulary), against 55 frictions archived byte-identical with ids resolvable,
196 comms rows dispositioned with counts that recompute exactly and five of five sampled MOVE quotes
verbatim, and seven distilled entries homed. A bounded repair, not another dedicated consolidation:
every defect is enumerable, and the one curation mass left is the 86 §Routing Notes frictions, the
same shape the seat ran over 99, gated on the owner's word before any archive move.

## The divergence measure, both estates

The owner's second word made alignment the test of every two-estate activity. The seat had not
measured it; the measure below was taken at the retrospective from the shared paths (the same
relative path present in both estates under `.agent/`, `agent-tools/README.md` and
`docs/engineering/build-system.md`), counting the files that differ and the `+`/`-` lines of a
zero-context unified diff:

| moment | shared paths | differing files | differing lines |
| --- | --- | --- | --- |
| the consolidation's open (JC.net `c48d9104~1`, OCE `fb999c70c~1`) | 388 | 156 | 7,444 |
| the consolidation's close (17:10Z, both working trees) | 388 | 147 | 7,204 |
| the retrospective's close (both working trees, this report included) | 389 | 147 | 7,139 |
| the two main branches the same day (the inherited backlog) | 369 | 210 | 11,899 |

The session left the estates more aligned in total, and eight shared files less aligned. The seat
unified five of them at the retrospective where the text was its own: `lint-after-edit` (a JC.net
paragraph ported), `testing-strategy` (an OCE sentence ported), the Claude Design pipeline skill (an
owner rule of 2026-07-01 ported to JC.net), the pull-request lifecycle skill (the duplicate of problem
13 removed), and the fourth worked instance of `verify-data-supports-shape-before-building` (one text
naming both estates). Three remain more divergent than at the open, each for a reason the next
session can weigh: the commit skill carries the message-check lesson inside each estate's own
ceremony paragraph (OCE's queue and `--author` flag, JC.net's plain commit); `build-system.md` gained
two OCE friction lessons about OCE's CI (F-20, F-208) in a document that is estate-specific from its
first line; `validation-strategy` gained the negative-control naming in JC.net where OCE's copy lacks
the whole §Prove the guard bites (OCE's directive lags, a backlog item, not today's). The rest of
`verify-data-supports-shape-before-building` differs by its estate-specific worked instances
(Oak's bulk export against JC.net's entity model), which the owner may want split out of the shared
rule.
The measure run again on 2026-10-01, from the default-branch tips of 2026-09-29 to the trees after
the pass, confirms those three (44, 12 and 6 lines) and shows two smaller ones this paragraph did
not name: `testing-strategy` (5 lines) and the cross-platform surface matrix (1 line). The
data-shape rule did not grow.

The owner's word is now the rule `cross-estate-work-must-reduce-divergence` in both estates (identical
bytes; the rules index and adapters regenerated in each): measure at the open, write shared changes
once in both, measure at the close, name every file that grew more divergent with its reason. The
measure is this script, run as `python3 divergence.py <jc-root> <ref-or-dash> <oce-root>
<ref-or-dash>` with `-` for a working tree; an `agent-tools` command is owed so a seat runs one
command instead:

```python
"""Shared-path divergence between two estates at a git ref each (or the working tree with ref '-').
argv: <jc-root> <jc-ref> <oce-root> <oce-ref> [prefixes...]; prints files-shared, files-differing, diff-lines."""
import sys,subprocess,difflib,os
jc,jcref,oce,oceref=sys.argv[1:5]; prefixes=sys.argv[5:] or ['.agent/rules/','.agent/skills/','.agent/directives/','.agent/memory/executive/','.agent/practice-core/','.agent/reviewers/','agent-tools/README.md','docs/engineering/build-system.md']
def listing(root,ref):
    if ref=='-':
        out=subprocess.run(['git','ls-files'],cwd=root,capture_output=True,text=True).stdout.split('\n')
        out+=subprocess.run(['git','ls-files','--others','--exclude-standard'],cwd=root,capture_output=True,text=True).stdout.split('\n')
    else:
        out=subprocess.run(['git','ls-tree','-r','--name-only',ref],cwd=root,capture_output=True,text=True).stdout.split('\n')
    return {p for p in out if p and any(p.startswith(x) for x in prefixes) and p.endswith('.md')}
def content(root,ref,p):
    if ref=='-':
        try: return open(os.path.join(root,p),errors='replace').read()
        except FileNotFoundError: return None
    r=subprocess.run(['git','show',f'{ref}:{p}'],cwd=root,capture_output=True,text=True); return r.stdout if r.returncode==0 else None
a=listing(jc,jcref); b=listing(oce,oceref); shared=sorted(a&b)
nd=0; total=0; per=[]
for p in shared:
    x=content(jc,jcref,p); y=content(oce,oceref,p)
    if x is None or y is None: continue
    if x!=y:
        d=sum(1 for l in difflib.unified_diff(x.splitlines(),y.splitlines(),lineterm='',n=0) if l[:1] in '+-' and not l.startswith(('+++','---')))
        nd+=1; total+=d; per.append((d,p))
print(f"shared={len(shared)} differing={nd} difflines={total}")
for d,p in sorted(per,reverse=True)[:int(os.environ.get('TOP','0'))]: print(f"  {d:5d} {p}")
sys.stdout.flush()
open(os.environ.get('OUT','/dev/null'),'w').write('\n'.join(f"{d}\t{p}" for d,p in sorted(per,reverse=True)))
```

## The legs' verdicts on the next session

Of the first five legs, three said no further dedicated consolidation is needed and named a bounded cure under the
owner's word instead; two said yes, one for JC.net's unread comms stream and one for a reductive
pass over the rules that accreted, run by a seat alone without a fleet. The seat's synthesis: the
owner's brief is met at its own test (empty pending graduations bar the owner's cards, empty
buffers by the buffer rule's reading), and the residue is of a different kind than the brief named:
accuracy in place for the single-event paragraphs (no decision needed) and one evidence question
(OCE-local event ids or role-and-date attribution in JC.net), three directive sentences under the context gate, five
friction lessons, and the JC.net comms stream's roughly 840 substantive events, which is a separate
question with a separate cost. None of that is a buffer drain; all of it fits the owner's word on
what to do next. The OCE-side leg's verdict is in its own section above.

## The owner's frame, after the handoff (2026-10-01)

The handoff's first decision read "compact or revert the accreted paragraphs", with a line count beside
it. The owner, verbatim: "just an illustrative example … we are not here to tidy things away or hit
numerical goals, we are here to make sure that knowledge is preserved, discoverable and accessible. Where
there is ceremony it is only permitted to exist where it serves practical purpose, the ceremony is there
as a sometime required enabler, it has no value in its own right, but it does have cost." Read under
that frame, this report's own findings re-sort:

- The 400 net rule lines are not the problem and shrinking them is not the cure. A seat's single-event
  ruling written as a universal norm misleads a reader about its weight; the cure is accuracy in place
  (what happened, who decided, when, one instance), which `one-instance-is-an-observation` already
  prescribes, and nothing leaves the surface a seat reads for length's sake. Reverting to §H would move
  knowledge from where a seat looks to where none does. The compaction step (proposal 1) is withdrawn.
- The per-user directories' file counts (78, 30) answer no knowledge question. Empty means no un-homed
  knowledge, which holds; the files are the audit trail, and deleting them has a cost and no value. The
  former decision 4 dissolves and the counts leave the reports.
- The conserved analysts' reports stay whole; summarising them later is ceremony with no reader. The
  former decision 10 dissolves.
- The bulk archives: every moved entry is byte-identical and pointer-linked, and the settled frictions'
  lessons stand at their cited homes, so the knowledge is preserved and more discoverable than in a
  99-entry register. The skill's "ask before a bulk act" exists for knowledge safety; the form of the
  move met that purpose, and the word not asked cost the owner's attention, not knowledge. The former
  decision 2 becomes a notification.
- The whole-file snapshot written at the retrospective (322 KB) duplicates what the commit before the
  move preserves immutably: ceremony with cost. The seat recommends removing it and re-truing
  `consolidate-docs` step 6b to name the pre-move commit instead, on the owner's word.
- "No claim, no comms event all day" (problem 16) is weighed, not asserted: no peer seat was live in
  either estate, so a claim would have served no one, and the next session's discoverability is served
  by the thread record and this report directly. What stays true is the cheaper form: a seat that will
  be alone still leaves one line a peer who arrives can read.
- The divergence measure's numbers are evidence of alignment, never its goal: a shared file is unified
  only where the two estates hold one lesson in two wordings, and a lower count bought by stripping an
  estate's specifics would be a loss. The rule's enforcement paragraph now says so.
- The 51 deferred rows and the 86 unread frictions stay as knowledge questions: each row is knowledge
  or a decision not yet acted on, and each open friction may carry a lesson without a home.

## Decided 2026-10-01 — the lenses and the owner's cards

The owner asked for the eight decisions to run through the decision lenses (`principles.md`
§Decision Lenses) and for what survived to be asked at once. Three survived to the owner and were
answered the same morning; the rest were settled by a lens or by a word the owner had already given,
and the settled moves were made in this session in both estates.

| former decision | result | what decided it |
| --- | --- | --- |
| 1 evidence form in JC.net copies | dissolved | lens 3, do both: role, date and n=1 stated, event id kept, nothing removed |
| 2 the seven cards | dissolved | the owner's reading (owner-ratified text only): five Director or relayed rulings recorded in their decision records with the decider named (PDR-117, PDR-064, PDR-125); D-44 settled by strictness in PDR-027 (the harness-observed model is the fact); D-47 applies the owner's 2026-09-14 rounds word to PDR-140 clause 4 |
| 2 the session-2 batch | survived, answered | the owner's item-8 word; all seven items graduate, two entries and five slow-lane concepts (testing-strategy; precedence-is-not-approval; user-collaboration; consolidate-docs); the register's card rows and entries drained |
| 3 the practice box | survived in part, answered | the two tooling rows were already L7 and L8 ("bring") in the exchange register; the owner: "we are bringing both estates to the same level of capability, anything useful that one has must make it to the other"; the box archived as processed material |
| 3 the napkin privacy review | already answered | the owner's card of 2026-09-14 (closure record item 100): no privacy review; archive after full processing |
| 3 the JC.net comms pass | dissolved | delegated to the next session; sample before sizing |
| 4 shared executive memory | dissolved | lens 1 and the alignment rule: identical bytes, each instance names its estate |
| 5 "lineage" | dissolved | a defined role word (`practice-lineage.md`) is never a name: where OCE is meant, live doctrine now says OCE (about 90 replacements in JC.net, the shared twins in OCE; archives and the git-lineage senses untouched) |
| 6 estate-specific shared files | dissolved | the specificity gradient: general lesson in the shared file, instances named by estate; `build-system.md` is a consumer doc, not a shared surface |
| 7 the 51 rows | work | the owner's 2026-09-28 word; decided as they are met in the parity session |
| 8 the 86 frictions | work | the skill's standing duty to read every buffer item |

The owner's further words of the morning. On the bulk-act clause: proof replaces the word (a bulk
archive needs no owner word when every moved entry is byte-identical, pointer-linked and its lessons
stand at their homes; the word is asked only for a move that loses or relocates knowledge), now in
`consolidate-until-done`. On "ratified text is the owner's": owner-ratified text only, now in
`precedence-is-not-approval`. On the next session: capability parity, both ways, PDR-142's amendment
log and the cross-estate rule's §Capability parity carry the verbatim.

Moves made in this session, both estates unless noted: the whole-file snapshot removed and step 6b
of `consolidate-docs` re-trued to name the pre-move commit; the six rulings recorded (PDR-117,
PDR-064, PDR-125, PDR-027, PDR-140) and OCE's owner-decision item 11 withdrawn; the seven session-2
items homed and JC.net's register drained to one slow-lane row with a 2026-12-15 review; "the
lineage" written as OCE across live doctrine; the practice box archived byte-identical (JC.net);
this report and the thread record re-trued.
