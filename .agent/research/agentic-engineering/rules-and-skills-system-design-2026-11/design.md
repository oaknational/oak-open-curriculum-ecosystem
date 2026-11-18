# The rules and skills system: design

The design the delivery node
[`rules-and-skills-system-design`](../../../plans/delivery/rules-and-skills-system-design.plan.md)
asks for. It is written in parts, one todo at a time. This file holds parts 1 to 3: the unit
model, the contracts and the budgets. Parts 4 to 7 (projections, build and validation,
processes, and how it will be known to work) follow the spike and are not written yet.

It was put as a proposal. The owner decided its first four questions on 13 November 2026, as
the end records: the model, the rule for "well within" with the budgets it derives, the listing
budget and the budget for always-present instructions. The fifth, and the other open items of
these parts, went through the decision lenses at the owner's request in
[`open-items.md`](open-items.md). One is open, by the owner's word of the same day: whether
the repository needs the nine skills installed from their vendors. It designs the
system and not the content of any rule or skill. Which present rule or skill becomes what is
not settled here, and where this document uses the present estate it does so to size a
budget and says "if".

A reader that wrote none of it reviewed the first draft and found it ready with corrections.
The model in part 1 is the reviewer's alternative, adopted, and the reason is given there.

## What it stands on

Each line says how it is known.

| Ground | Standing |
| --- | --- |
| Claude Code is the main concern, Codex the second, everything else reasonable efforts | The owner's word, 2026-11-12 |
| Copied text for each platform is acceptable "as long as we don't end up loading things twice" | The owner's word, 2026-11-12 |
| Rules and skills "must describe current requirements, not the evolution that arrived at them" | The owner's ruling, 2026-11-12 |
| "each rule, skill, and the combined total of the relevant parts, should be well within the identified important thresholds" | The owner's word, 2026-11-12 |
| A rule reaches Claude Code as a one-line pointer, and no output carries a rule's body or, outside Cursor, its description | Read in the code: the [audit](pipeline-audit.md), section 2 |
| A skill's adapter carries its name and description and points to its body as another file | Read in the code: the audit, section 3 |
| Claude Code loads an unscoped rule's text at launch and puts it back after a compaction; loads a path-scoped rule's text when a matching file is read, written or edited; lists a skill's description and loads the adapter on use | Anthropic's documentation, in the [Claude Code loading note](../doing-and-dreaming-2026-11/claude-code-rules-and-skills-loading.md). The first was observed in the habit-text trial's check session. The second was observed once by that note's sub-agent and again in the session that wrote this document. Neither was measured |
| Codex loads the `AGENTS.md` chain from the root to the working directory, a skills listing and hook output, and no mechanism that loads a rule's text as guidance was found | OpenAI's documentation, in the [Codex loading note](../doing-and-dreaming-2026-11/codex-rules-and-skills-loading.md). Nothing was observed in a running Codex |
| In twenty sessions that held only pointers, most rules a session opened were on the subject of its task. Of the 28 rules the first sort calls habits of mind, one was opened in the first ten sessions and two in the second ten | Measured: the [delivery trial](../doing-and-dreaming-2026-11/delivery-trial.md) and the control runs of the [habit-text trial](../doing-and-dreaming-2026-11/habit-text-trial.md). Why a file was opened was not measured |
| Twenty-eight habit instructions delivered as text changed the form of two answers, both on one task of five, and changed no conclusion | Measured: the habit-text trial. One separating instruction against a bar of two set beforehand, so its prediction of no clear difference stands |
| The estate already has a procedure for where a capability lands: by the shape of its payload and by when it must be disclosed | The rule `capability-landing-decision-procedure`, steps 2 to 5 |
| Platform files are "thin adapters that reference the canonical substance"; where a role cannot follow a pointer, "its adapter carries the prompt", copied from its source by a generator that is its check | PDR-009, accepted. An instruction delivered as text extends that exception to the case the trials found, a pointer mostly not followed, and is written as an amendment of PDR-009 |
| A skill's "Adapter bodies contain only the canonical-read instruction" | PDR-051, accepted. The model's procedure, whose body is loaded when it is selected, reaches Claude Code as the skill it invokes, which reverses this clause; it is written as an amendment of PDR-051 quoting the owner's word ([`open-items.md`](open-items.md), D2) |
| "the session-injected tier carries a budget", and carries "identity and firing conditions only"; "Truncation of an injected surface is a defect signal" | PDR-124, accepted. B1, B2, B4 and B5 are budgets for that tier, and an instruction's requirement is its identity there; both are written as an amendment of PDR-124 |

## 1. The unit model

### Where the model comes from

The first draft of this part proposed five kinds of unit. The reviewer's objection was that
the five were Claude Code's five containers under new names, that enforcement appeared both
as a kind and as a property of other kinds, and that the estate already has the two axes that
matter. The objection holds, and the simpler model is used here.

The estate's rule on landing a capability asks two things of a payload. Is it "a standing
invariant small enough to afford in always-loaded context, or a multi-step procedure that is
not"? And when must it be disclosed: "Always in force, loaded on a trigger, or consulted at
dispatch?" It assigns
"enforcement that must hold with zero context" to a hook or validator, and pairs a procedure
that must always be in force with an invariant that points to it.

That model is sound and is kept. What it lacks is what the audit and the trials found
missing: the invariant's text is not delivered, nothing bounds a unit's size, and a unit's
history lives in the same file as its instruction. The model below adds those three things to
what a unit is.

It replaces none of that rule's procedure. The rule also decides which audience a capability
serves, where it is sourced and who owns it, the security channel for anything adopted from
outside, its family test, and its consumer. Those are decisions made when a capability lands.
They stay in the landing procedure and are not part of a unit's contract here. One of its
steps does bear on the contract, and is carried: the loader that recognises a unit's moment,
under "Place" below.

### Two kinds of unit

| Kind | What it is | How it must reach the agent |
| --- | --- | --- |
| **Instruction** | A requirement stated in a few sentences: what to do, when, and the reason a reader needs in order to apply it | As text, in context without anyone choosing to open it |
| **Procedure** | The steps of a named activity | As a listed name and description that select it, and a body loaded when it is selected |

These are the present rule's "invariant" and "procedure". On Claude Code they are what a rule
and a skill are for. On Codex, by its documentation, a procedure is a skill and an
instruction has one home, the `AGENTS.md` chain.

### Four things a unit declares

| Attribute | Applies to | What it says |
| --- | --- | --- |
| **Record** | every unit, required | Where what stands behind the unit is kept: the ruling, the incidents, the evidence, the full argument, the history. A record is never loaded into a session |
| **Place** | any unit, optional | The part of the repository where the unit applies, given as a set of paths or as the directory the unit is kept in. A unit with a place is delivered when the place is touched, on a platform that can do that, in place of being present from the start |
| **Check** | any unit, optional | The code that enforces the requirement: a hook, a gate, a lint rule. A unit with no check is advice |
| **Pair** | an instruction and a procedure, optional | That the instruction is the always-present half of a procedure, as the present rule's companion pair is |

### What follows from it

1. **An instruction is text and not a pointer.** Its declared text is what the platform
   delivers. This is the one change to what a rule is.
2. **A unit's history leaves the unit, and its reason stays.** By the owner's ruling history
   does not belong in a rule or a skill. The record is where it goes, with the incidents, the
   evidence and the full argument. The ruling excludes history and not reasons. The
   repository's rule on documentation requires that doctrine "state enough 'why' for a future
   reader to re-derive the rule under novel conditions", so a unit keeps the reason a reader
   needs in order to apply it, stated as a present fact and inside the unit's budget. Dated
   lines appear in 110 of 124 rule files today; a dated line is this seat's proxy for
   history, and the ruling is the owner's.
3. **A requirement that must hold has a check.** The habit-text trial is the evidence that
   delivered text is not enough for that. A requirement whose only form is a check, with no
   text beyond the sentence a refusal prints, is code and not a unit of guidance. Building
   checks is outside this plan.
4. **Place narrows presence and is not a third kind.** An instruction that applies in one
   part of the repository is the same kind of thing as one that applies everywhere. Whether
   a platform can deliver it at the moment its place is touched is a fact about the platform,
   and part 4 says what each platform gets. Both platforms also read guidance from their
   directories below the repository root, so a unit can be placed by where it is kept: Claude
   Code delivers a directory's own instruction file and skills when a session first works in
   that directory, and its rules at an event the documentation does not state; Codex delivers
   the directory's `AGENTS.md` and skills only to a session started there. [`nested-directories.md`](nested-directories.md) has what each
   documents. A path is one of four loaders the present rule
   names; the others are a tool call, the shape of a session and a ceremony that is always
   run. Those three are served today by hooks and by ceremony procedures, which this plan
   does not change. For an instruction whose moment no loader can recognise, the present
   rule's answer stands and is the model's: "land it always-on or bind it to a loader that
   fires mechanically". So such an instruction has no place and is always present, or it has
   a check.
5. **One home for each instruction.** It is written once. The build copies it to each
   platform, and it reaches no platform twice.

### What the model leaves alone

- **Sub-agents.** The present rule lands "judgement consulted at dispatch" as a sub-agent.
  This design does not change that.
- **Hook output.** A session-start hook prints text into a session on both platforms. It is a
  third always-present surface. This design does not move guidance into it, and part 4 states
  what it carries today so that nothing is counted twice.

### What the sort did and did not establish about the present estate

Stated so that the budgets below are not read as a sort of the content.

- The first sort of the 124 rules, from their descriptions, by one reader, found 28 habits of
  mind, 90 rules tied to a named activity and 6 that only point elsewhere. It is marked
  provisional. A second reader, without sight of the first, found 27, 92 and 5, and the two
  agree that 22 rules are habits.
- Neither sort counted standing constraints, such as a rule against disabling checks. The
  second reader reported that the three categories have no place for one. Under this model
  such a rule is an instruction with no place, like a habit. So the number of always-present
  instructions is not known, and the 28 is a floor.
- No count exists of how much of the 2.2 million characters is record. It is not claimed
  here.

## 2. Contracts

A contract says what a unit must declare, what it promises a reader, and what it must not be
relied on to do. The lengths are in part 3.

### Instruction

- **Declares:** a name; the instruction text; its record; its place, if it has one; its
  check, if it has one; its paired procedure, if it has one.
- **Promises, with no place:** on Claude Code the text is in context when a session starts
  and is put back after a compaction. By the documentation, and observed once at the start of
  a session. On Codex the text is in the root `AGENTS.md`, which Codex loads. By the
  documentation; not observed. That it arrives once on each platform is what the build must
  guarantee and the spike must show.
- **Promises, with a place:** on Claude Code, an instruction placed by paths is delivered when
  a file in its place is read, written or edited. By the documentation, and observed twice in
  passing. An instruction placed by directory and delivered in that directory's own
  `CLAUDE.md` loads once a file in the directory is read, written or edited: by the
  documentation, not observed. Delivered in that directory's own `.claude/rules/`, its loading
  event is not stated by the documentation ([`nested-directories.md`](nested-directories.md)),
  so nothing is promised for it until the spike has observed it, and parts 4 and 5 do not
  build on it before then. On Codex
  no mechanism that delivers text when a file is touched was found. Codex's documented
  mechanism bound to a place is an `AGENTS.md` in a directory, loaded when the session's
  working directory is at or below it. What Codex gets is for part 4, and the least it can
  be is nothing.
- **Must not be relied on to:** change what an agent concludes, or act at a particular
  moment. A requirement that must hold has a check, or is a step of a procedure the agent is
  in.

### Procedure

- **Declares:** a name; a description that says when to use it; a body; its record; its
  place, if it has one; its check, if it has one; its paired instruction, if it has one.
- **Promises, with a place:** on Claude Code, by the documentation and not observed, a
  procedure kept in a package's own directory is listed from the start in a session started
  in that package, and in a session started above it once the session reads or edits a file
  there; until then it is not listed and cannot be invoked by name. On Codex it is listed
  only in a session started in that package or below, and a session started at the root does
  not get it. The promises below are for a procedure with no place.
- **Promises:** on both platforms the name and description are listed when a session starts,
  and the body is available when the procedure is selected. By the documentation of both;
  the listing was observed on Claude Code, where each of forty sessions listed the estate's
  78. Both platforms document that descriptions are shortened or left out when the listing is
  over its budget, so the first promise holds only inside the platform's budget for the whole
  listing. Skills from outside the repository are in that listing as well: each trial session
  listed 31 of them. B5 bounds the repository's share and nothing else, so it lowers the
  chance that a procedure's description is shortened or dropped and does not remove it.
- **Must not be relied on to:** be selected. In forty sessions no session called a skill, on
  tasks that included a commit and a review comment. Whether that is the listing's size, the
  tasks or the read-only tool set is not known. Nor to stay in context through a compaction:
  Claude Code documents a combined limit on the bodies it puts back, and how many procedures
  a session has used is outside a build's reach. Part 3 gives the arithmetic.

### Record

A record is not a unit. It declares nothing and is named by the units it stands behind. It
promises that what stands behind a unit can be found from the unit. An instruction that exists
only in a record is delivered to no one.

## 3. Budgets

### The thresholds, and how each is known

From the vendors' documentation, except T10. The two loading notes recorded them, and each
was then re-read at its vendor page on 12 November 2026, as the plan's first-principles check
asks: [`threshold-reread.md`](threshold-reread.md), every quotation fetched raw. Eight were
confirmed as recorded. T2 counted the wrong fields and is corrected below. The character
figure the first draft gave for T4 is not the vendor's. The re-read also changed what window
the thresholds are taken at, which is the paragraph after the table. **Tokens and characters.** Several thresholds are in tokens, and a build can count characters
exactly and tokens only by estimate. The repository's own estimate is four characters to a
token. That is too generous to set a margin by, and the one measurement this work has is
lower. In the habit-text trial each of 28 pointers was replaced by a heading with the rule's
name, its description and a line naming its record: 10,223 characters in place of 1,794, a
net 8,429. The first call grew by about 2,900 tokens, which is 2.9 characters to a token;
taken between the extremes of the runs, the growth was 2,625 to 3,209 tokens, which is 2.6 to
3.2. That is one sample, of short prose. A procedure body with tables and code is denser. So
where a budget is set against a threshold in tokens, this design converts at **two characters
to a token**, which is under the lowest ratio measured with room for denser text, and the
spike measures the ratio for a sample of procedure text.

| # | Threshold | Value | Platform | Known how |
| --- | --- | --- | --- | --- |
| T1 | A rule file loaded on demand, each file | 40,000 characters on a 200,000-token window. On a 1,000,000-token window: 200,000 for Opus 4.6 and Sonnet 4.6, and 150,000 for later models | Claude Code | Documented, re-read |
| T2 | One entry of the skills listing: a skill's `description` and `when_to_use` together | 1,536 characters | Claude Code | Documented, re-read. The name is not said to count |
| T3 | A skill's description | 1,024 characters | The Agent Skills specification | Confirmed at the specification's site. Neither vendor's skills page restates it; both link the specification. The repository's code names it in a comment and checks it nowhere |
| T4 | The skills listing, all entries together | 1 % of the window by default, with "a fallback of 8,000 characters". This repository sets 3 %, which is 6,000 tokens at a 200,000-token window and 30,000 at 1,000,000 | Claude Code | The fraction and the fallback are documented, re-read. The vendor gives no conversion to characters. Whether skills from plugins and the harness draw on the same budget is not said |
| T5 | The skills listing, which on Codex also carries each skill's path | 2 % of the window by default; 8,000 characters when the window is unknown; at most 10,000 tokens if set. By arithmetic, 2 % is 4,000 tokens at a 200,000-token window and 10,000 at 500,000 | Codex | Documented, re-read. One model's window is stated, at 500,000 tokens; no figure was found for the others |
| T6 | A skill's body kept through a compaction | 5,000 tokens each, 25,000 in all | Claude Code | Documented |
| T7 | One read of a file | By default 25,000 tokens, and a partial view beyond it; a whole file over 256 KB is refused. Recent versions can read a whole file past both when the read sets `allow_large` | Claude Code | Documented, re-read |
| T8 | The project documents, the `AGENTS.md` chain | 32 KiB. One vendor page says together, one says each file, one says neither | Codex | Documented, and unresolved between pages |
| T9 | The documentation's own advice | under 200 lines for a memory file, under 500 for a skill body | Claude Code | Documented, as advice |
| T10 | The context at a session's first call | 39,300 to 39,600 tokens in twenty headless control sessions with four tools; 42,250 with the 28 habit instructions as text | Claude Code | Measured |
| T11 | A warning when instruction files together pass a combined limit at session start | no value given | Claude Code | Documented without a number |

For the total of always-present text on Claude Code the documentation gives a warning with no
number (T11) and a refusal at 4 MiB a file. So that budget is set against the Codex limit the
same text must fit (T8) and against what a session carries (T10), and the spike records
whether the warning appears.

**The window the thresholds are taken at.** Four thresholds scale with the context window.
The loading notes took them at 200,000 tokens. The re-read found that Claude Code's current
models "run with the 1M window by default", and that one Codex model is stated at 500,000
tokens. So two readings exist, and the budgets below give both: the **smallest documented
case**, a 200,000-token window on either platform, which still applies to older models and to
a model Claude Code does not recognise; and the **current defaults**, 1,000,000 on Claude
Code and 500,000 on the one Codex model stated. Which of the two the owner means by "the
identified important thresholds" is question 3.

### The rule for "well within"

The owner's word is "well within the identified important thresholds". This design reads it
as **half or less of the smallest threshold that applies**. Where a threshold is a platform
default the estate has overridden, the overridden value applies. Where a threshold scales
with the window, the budget is given at both readings and question 3 chooses. Where no
threshold is documented, the budget is marked as this seat's choice.

A budget is measured in the unit its threshold is stated in, and over the same fields the
threshold counts. A threshold in bytes gives a budget in bytes. A threshold in tokens gives a
budget in characters at two to a token. A threshold that counts a field gives a budget that
counts it: the Codex listing counts each skill's path, so the listing budget does.

### What is proposed, beside what is there now

The present measures are computed by the script in the appendix. Medians are the lower middle
value.

| Budget | Proposed | Against | Present measure |
| --- | --- | --- | --- |
| **B1** One instruction with no place | 300 characters | This seat's choice: no threshold. With B2, and the 120 bytes of name and record line the trial gave each, it allows about 28 instructions at full length, or more that are shorter | If the first sort's 28 habit rules were instructions as their descriptions state them: median 205, longest 793, and 7 over 300 |
| **B2** All instructions with no place, together, counted as the bytes delivered: each instruction's text and whatever name, record line and format its projection adds | 12,000 bytes | T8 at its stricter reading: 37 % of 32 KiB, which is in bytes; with the root `AGENTS.md` as it is, 13,975, inside B7. Against T10: the trial's 10,255 bytes replaced 1,794 characters of pointers and added about 2,900 tokens, 2.9 characters a token on the net 8,429, so 12,000 bytes is about 4,100 tokens at the ratio measured and up to 6,000 at this design's conversion, 10 to 15 % of a first call | The 28 descriptions alone total 6,859 characters, 6,891 bytes. As the trial delivered them, each with a heading and a record line, they total 10,223 characters, 10,255 bytes, and the 28 pointers they replace total 1,794 characters. The 28 is a floor: standing constraints are not counted in it |
| **B3** One instruction with a place | 4,000 characters | T1: a tenth. The figure is this seat's choice of a round number well under it | Not measurable without sorting content. For scale: the 21 rule files that carry globs today, record and all, have a median of 4,249 and a longest of 10,614 |
| **B4** One procedure's description, with its `when_to_use` if it sets one | 256 characters | T3: a quarter. T2: a sixth. This seat's choice. B5 binds before B4 does: see below | 78 descriptions: median 429, longest 1,139; 57 are over 256, 38 over 512, 3 over 1,024 |
| **B5** The listing as a platform carries it: every name and description in the repository's skill directories, each `when_to_use` where one is set, and on Codex every path | 10,000 characters at the current default windows; 4,000 at the smallest documented case | At current defaults the smallest threshold is T5 at 500,000 tokens: 10,000 tokens, about 20,000 characters at two to a token, and 10,000 is half of it. At a 200,000-token window the smallest is T5 at 4,000 tokens, about 8,000 characters, and 4,000 is half of it and half of each vendor's 8,000-character fallback | 42,370 across 87 skills, 78 the estate's and 9 vendor skills; no tracked skill sets `when_to_use` today, by a search of the three skill directories. A floor on what a session carries, and not a measure against T5: each trial session listed 118, and the 31 from outside the repository are not counted; Codex also lists each skill's path, and the 87 paths relative to the repository root add 3,700 characters, more if Codex lists them in full. What a Codex listing holds is for the spike's Codex leg to measure |
| **B6** One procedure's body | 5,000 characters | T6, where the body is the skill body the platform invokes: 5,000 tokens is about 10,000 characters at two to a token, and 5,000 is half. T7: a tenth. Today's adapters are one-line pointers, as PDR-051 decides, so T6 governs the pointer and the canonical body is opened as a file, under T7 alone. B6 is set for the model's projection, the body delivered as the invoked skill body, which amends that clause of PDR-051 ([`open-items.md`](open-items.md), D2) | 78 bodies: median 7,423, longest 156,546; 51 are over 5,000 and 12 over 20,000 |
| **B7** The `AGENTS.md` files from the root to any working directory, together | 16 KiB | T8 at its stricter reading: half | The largest chain today is 2,653 bytes, the root file and the one under `demos/`. The root file is 1,975 bytes: two pointers, a section of instructions on code review and a generated block for Codex team sessions. It holds no rule text. One other `AGENTS.md` is tracked, under `demos/` |

A record has no budget. It is not loaded. The 124 rule files hold 1,073,128 characters and
the 78 skill bodies 1,065,154; how much of that is record is not counted.

No total is proposed for B3 or B6, and the owner's "combined total of the relevant parts" is
not met for either. No threshold for a total of path-scoped text was found. T6 does give a
total, 25,000 tokens for the skill bodies kept through a compaction, and it counts the
procedures one session has used, which no build can bound. So no budget is set against it,
and the contract is narrowed in its place: a procedure is not promised to be kept through a
compaction. By the arithmetic of this design, half of that total is 12,500 tokens, which is
five bodies at B6; a session that has used more than five is past half of it, and one that
has used more than ten is past the vendor's total. That arithmetic holds where a procedure's
body is the skill body the platform invokes. With today's pointer adapters, what is put back
after a compaction is the pointer. A body read from its file comes back only if it is among
the five files, at most, that Claude Code re-reads after a compaction, chosen as the most
recently modified of those the session read or edited, and only with its content if it is
under 5,000 tokens.

No budget is set in lines. T9 is the documentation's advice and not a limit a platform
applies, and the budgets in bytes and characters bind first for ordinary text: a procedure
body inside B6 passes 500 lines only at under ten characters a line, and always-present text
inside B2 passes 200 lines only at under sixty bytes a line. Six of the 78 bodies are over
500 lines today, and each of the six is also over B6.

Three things follow and are stated plainly.

1. **B2 is close to what the 28 habit instructions already come to, and its cost is known.**
   As the trial delivered them they are 10,255 bytes, which an 8,000-byte budget would not
   hold; with a heading and no record line they are about 7,800. What a projection adds to
   each instruction is its name and the record's path ([`open-items.md`](open-items.md), D4),
   and B2 counts it. Delivering them as text was measured at about 2,900 tokens on a first
   call of about 39,400. It is not free, and it does not shrink unless other pointers are
   removed, which the model does by construction ([`open-items.md`](open-items.md), D5). The
   budget cannot be confirmed as enough until the standing constraints are counted, which the
   spike does ([`open-items.md`](open-items.md), O7).
2. **B5 is the hard one, and B4 does not decide it.** Today's 42,370 characters are, by this
   arithmetic, over the Codex listing's limit at that platform's one stated window, before
   the paths Codex adds. Names take 1,612 of them and the paths, relative to the root, add
   3,700, so an entry costs about 61 characters before its description. At 10,000 the
   listing holds about 31 procedures at B4's full length, or 50 at about 139 characters
   each, or all 87 at about 54, which is too short to say when to use one. At 4,000 it holds
   about 12, and the names and paths of all 87 alone come to 5,312. So under this budget the
   estate lists fewer procedures than it has today, at either reading. Nine of the 87 are not
   the estate's procedures: they are installed from their vendors and recorded with a content
   hash in `skills-lock.json` (PDR-051), so they are not shortened with the rest. With them
   as they are, their 3,146 characters with paths leave each of the 78 about 25 at 10,000;
   without them, each has about 66. Whether the repository needs them is open
   ([`open-items.md`](open-items.md)). The 31 skills a session lists from outside the
   repository are not the estate's to shorten, and whether they share the budget is not
   documented. The owner expects that "some existing materials will be redundant or
   inappropriate or be better expressed more succinctly"; this is where that is tested
   hardest. Shortening is not the only way down: a procedure that concerns one package and is
   kept in that package's directory is out of a root session's listing on Claude Code until
   the session works there. How many of the 78 that fits is for the spike to count
   ([`open-items.md`](open-items.md), O6).
3. **B6 would move text out of procedure bodies.** Fifty-one of 78 are over it. The
   longest is 31 times it.

### What a budget would be in the build

For part 5 to settle, and stated here only so the budgets can be judged: each budget would be
a number the build holds and compares, as the one existing size check does, changed in one
place by the owner's decision.

## Questions for the owner

**The owner's answer, 13 November 2026**, to the four questions put as they stand below: "I
accept your recommendations, but before marking them final, please investigate
nested/multiple .claude directories e.g. a package can have it's own additional (?) rules and
skills. I don't know if codex also supports that". The investigation is
[`nested-directories.md`](nested-directories.md). It adds a form of place to the model and
leaves the four recommendations as they are. Asked, having read it, whether the four are
final, the owner answered on the same day: "Yes, I agree". So the first four recommendations
below are decided: the two-kind model, with place in both its forms; half or less of the smallest
threshold that applies, with this seat's three choices; a listing budget of 10,000
characters; and 12,000 bytes of always-present instructions, counted as delivered.

Each is the owner's by the plan, and each has a recommendation. The first four were put to the
owner in prose, after the decision-card tool was closed by a worker restart three times, and
are answered above. The fifth was not put to the owner, and the decision lenses resolve it
([`open-items.md`](open-items.md), D1).

1. **The model.** Recommended: two kinds of unit, instruction and procedure, each declaring a
   record and optionally a place, a check and a pair. Alternatives: the five kinds of the
   first draft, which name the same things as kinds; or rules and skills as they are, with
   Codex treated as a reduced platform.
2. **The rule for "well within".** Recommended: half or less of the smallest threshold that
   applies. Accepting it accepts B6 and B7 as derived from it. B1, B3 and B4 have no
   threshold that decides them and are this seat's choices, offered for acceptance with it.
3. **Which windows the thresholds are taken at, and so the listing budget, B5.**
   Recommended: the current defaults, which gives 10,000 characters, names and paths
   included. That is about 31 listed procedures at 256 characters, or 50 at about 139. It
   does not hold all 87 at a length that can say when to use a procedure, so accepting it
   accepts that fewer procedures are listed than today. The cost of this choice: on a 200,000-token window, or
   where Codex does not know its window, the listing is over the limit and the platform
   shortens or drops descriptions itself. The alternative is the smallest documented case,
   4,000 characters, which is inside every documented listing limit on both platforms and
   means about 12 listed procedures. Still not known: the window of any Codex model but one, and
   whether the 31 skills from outside the repository draw on the same budget.
4. **The budget for always-present instructions, B2.** Recommended: 12,000 bytes,
   counted as delivered, with the cost stated: about 4,100 tokens at the ratio measured and
   up to 6,000 at this design's conversion, on a first call of about 39,400. The 28 habit
   instructions as the trial delivered them are 10,255 bytes, and added about 2,900 tokens
   over the pointers they replaced. Corrected after the owner's answer: the question as put
   gave about 3,500 tokens at the ratio measured, which scaled that net figure by the gross
   size; the upper figure of 6,000 was right. It is
   37 % of the Codex limit. The alternative is 8,000 bytes, which holds the 28 only with
   shorter text or a projection that adds less than the trial's did. Either may prove too
   small once standing constraints are counted, and the design would then come back with the
   count.
5. **Where the decisions are recorded once made.** Recommended: a Practice decision record
   for the model and the contracts. Where the budget numbers live is part 5's to propose.
   Not put to the owner. Resolved through the decision lenses on 13 November 2026
   ([`open-items.md`](open-items.md), D1): the records that already own this substrate are
   amended, PDR-009, PDR-051 and PDR-124, and the rule
   `capability-landing-decision-procedure` with them, each quoting the owner's word; no new
   decision record is made. The amendments are written as part of the spike's work.

## Appendix: the script behind the present measures

A throwaway Node script, kept here as text and not as a tracked script, because the
repository's source is TypeScript and its checks hold every tracked script to the estate's
standard. The plan's first acceptance criterion asks for a script kept with the document
that reproduces the table; this is that script. It reproduces every figure in the "Present
measure" column, including the 6,891 bytes of the 28 habit descriptions, the 10,255 bytes of the same 28 in the form the trial delivered, the 2,653 bytes of the largest `AGENTS.md` chain among tracked files, the 1,794 characters of their pointers, the 6,780 of the
103 unscoped ones, the 1,612 of the names and the 3,700 of the relative paths. It does not
compute the fractions in the "Against" column, which are arithmetic on those figures and on
the thresholds, and it does not reproduce T10 or the measured cost of 2,900 tokens, which
come from the trials' session records. It reads whatever
is on disk under the directories it walks and does not ask which files are tracked, so it
reproduces these figures only in a clean checkout. It was run in one, from the repository root at commit `5584f3337`, as a copy placed
in `agent-tools/` so that its import of the `yaml` package resolves. The reviewer of the
first draft ran an earlier form of it at the same commit and got the same figures; eight
outputs were added since, at reviews' findings. Its median is the
lower middle value. The habit rules are those marked `H` in the first sort
of the rules,
[`classification.tsv`](../doing-and-dreaming-2026-11/rules-sort/classification.tsv).
Lengths are of parsed values, counted in characters.

```js
// Present measures of the estate's guidance against proposed budgets. Read-only.
// Run from the repository root of a clean checkout, as a copy placed in agent-tools/ so that the `yaml` import resolves.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { parse } from 'yaml';

const chars = (s) => [...s].length;
const fm = (text) => { const m = /^---\n([\s\S]*?)\n---\n?/.exec(text); return m ? { data: parse(m[1]) ?? {}, body: text.slice(m[0].length) } : { data: {}, body: text }; };
const stats = (xs) => { const a = [...xs].sort((x, y) => x - y); const n = a.length; return n ? { n, min: a[0], median: a[Math.floor((n - 1) / 2)], max: a[n - 1], total: a.reduce((p, c) => p + c, 0) } : { n: 0 }; };
const over = (xs, t) => xs.filter((x) => x > t).length;
const walk = (d, out = []) => { for (const e of readdirSync(d)) { const p = join(d, e); statSync(p).isDirectory() ? walk(p, out) : out.push(p); } return out; };

// Rules
const rules = readdirSync('.agent/rules').filter((f) => f.endsWith('.md')).map((f) => { const t = readFileSync(join('.agent/rules', f), 'utf8'); const { data, body } = fm(t); return { name: f.slice(0, -3), classification: data.classification, globs: (data.globs ?? []).length, descText: String(data.description ?? ''), desc: chars(String(data.description ?? '')), descBytes: Buffer.byteLength(String(data.description ?? ''), 'utf8'), file: chars(t), body: chars(body) }; });
const sortFile = '.agent/research/agentic-engineering/doing-and-dreaming-2026-11/rules-sort/classification.tsv';
const kinds = new Map(); if (existsSync(sortFile)) { const [h, ...rows] = readFileSync(sortFile, 'utf8').trim().split('\n').map((l) => l.split('\t')); const ni = h.indexOf('name'), ki = h.indexOf('kind'); for (const r of rows) kinds.set(r[ni], r[ki]); }
const habit = rules.filter((r) => kinds.get(r.name) === 'H');

// Skills (canonical)
const canon = walk('.agent/skills').filter((p) => p.endsWith('SKILL-CANONICAL.md')).map((p) => { const t = readFileSync(p, 'utf8'); const { data, body } = fm(t); return { path: p, desc: chars(String(data.description ?? '')), body: chars(body), file: chars(t), lines: t.split('\n').length }; });
// Listed skills per platform root (adapters as written)
const listed = (root) => readdirSync(root).map((d) => join(root, d, 'SKILL.md')).filter((p) => existsSync(p)).map((p) => { const { data } = fm(readFileSync(p, 'utf8')); return { name: String(data.name ?? ''), desc: chars(String(data.description ?? '')) }; });
const cl = listed('.claude/skills'), ag = listed('.agents/skills');
const listingCost = (xs) => xs.reduce((p, x) => p + chars(x.name) + x.desc, 0);
const nameChars = (xs) => xs.reduce((p, x) => p + chars(x.name), 0);
const pathChars = (root) => readdirSync(root).filter((d) => existsSync(join(root, d, 'SKILL.md'))).reduce((p, d) => p + chars(join(root, d, 'SKILL.md')), 0);
const adapterChars = (names) => names.reduce((p, n) => p + chars(readFileSync(join('.claude/rules', n + '.md'), 'utf8')), 0);
const dirBytes = (d) => walk(d).reduce((p, f) => p + statSync(f).size, 0);
const size = (f) => (existsSync(f) ? statSync(f).size : null);
// The 28 habit instructions as the habit-text trial delivered them: a heading with the name, the description, and a line naming the record.
const asDelivered = (r) => `# ${r.name}\n\n${r.descText}\n\nThe record behind this instruction is \`.agent/rules/${r.name}.md\`.\n`;
// Every tracked AGENTS.md, and the largest total from the root to any directory that holds one.
const agentsFiles = execSync('git ls-files', { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n').filter((f) => f === 'AGENTS.md' || f.endsWith('/AGENTS.md'));
const chain = (f) => agentsFiles.filter((g) => dirname(g) === '.' || dirname(f) === dirname(g) || dirname(f).startsWith(dirname(g) + '/')).reduce((p, g) => p + statSync(g).size, 0);

const out = {
  rules: { count: rules.length, core: rules.filter((r) => r.classification === 'core').length, situational: rules.filter((r) => r.classification === 'situational').length, withGlobs: rules.filter((r) => r.globs > 0).length,
    description: stats(rules.map((r) => r.desc)), descriptionOver: { 300: over(rules.map((r) => r.desc), 300), 400: over(rules.map((r) => r.desc), 400), 600: over(rules.map((r) => r.desc), 600) },
    file: stats(rules.map((r) => r.file)), fileOver: { 4000: over(rules.map((r) => r.file), 4000), 20000: over(rules.map((r) => r.file), 20000), 40000: over(rules.map((r) => r.file), 40000) } },
  habitRules: { count: habit.length, descriptionBytes: habit.reduce((p, r) => p + r.descBytes, 0), claudeAdapterChars: adapterChars(habit.map((r) => r.name)), asDeliveredInTrialChars: habit.reduce((p, r) => p + chars(asDelivered(r)), 0), asDeliveredInTrialBytes: habit.reduce((p, r) => p + Buffer.byteLength(asDelivered(r), 'utf8'), 0), description: stats(habit.map((r) => r.desc)), over300: over(habit.map((r) => r.desc), 300), over400: over(habit.map((r) => r.desc), 400) },
  pathScopedRules: { count: rules.filter((r) => r.globs > 0).length, file: stats(rules.filter((r) => r.globs > 0).map((r) => r.file)), description: stats(rules.filter((r) => r.globs > 0).map((r) => r.desc)) },
  skills: { count: canon.length, description: stats(canon.map((s) => s.desc)), descriptionOver: { 256: over(canon.map((s) => s.desc), 256), 512: over(canon.map((s) => s.desc), 512), 1024: over(canon.map((s) => s.desc), 1024) },
    body: stats(canon.map((s) => s.body)), bodyOver: { 5000: over(canon.map((s) => s.body), 5000), 7500: over(canon.map((s) => s.body), 7500), 10000: over(canon.map((s) => s.body), 10000), 20000: over(canon.map((s) => s.body), 20000), 100000: over(canon.map((s) => s.body), 100000) }, linesOver500: over(canon.map((s) => s.lines), 500) },
  listing: { claude: { skills: cl.length, descriptionChars: cl.reduce((p, x) => p + x.desc, 0), nameChars: nameChars(cl), nameAndDescriptionChars: listingCost(cl) }, agents: { skills: ag.length, descriptionChars: ag.reduce((p, x) => p + x.desc, 0), nameChars: nameChars(ag), nameAndDescriptionChars: listingCost(ag), relativePathChars: pathChars('.agents/skills') } },
  adapters: { claudeUnscopedRuleAdapterChars: adapterChars(rules.filter((r) => r.classification === 'core' || r.globs === 0).map((r) => r.name)), claudeRulesBytes: dirBytes('.claude/rules'), agentsRulesBytes: dirBytes('.agents/rules') },
  entry: { 'AGENTS.md': size('AGENTS.md'), 'CLAUDE.md': size('CLAUDE.md'), 'RULES_INDEX.md': size('RULES_INDEX.md'), '.agent/directives/AGENT.md': size('.agent/directives/AGENT.md') },
  agentsChain: { files: Object.fromEntries(agentsFiles.map((f) => [f, statSync(f).size])), largestChainBytes: Math.max(...agentsFiles.map(chain)) },
};
console.log(JSON.stringify(out, null, 1));
```

Its output at that commit, abridged to the figures the table uses:

```json
{"rules": {"count": 124, "core": 75, "situational": 49, "withGlobs": 21, "description": {"n": 124, "min": 42, "median": 265, "max": 1303, "total": 41630}, "descriptionOver": {"300": 52, "400": 42, "600": 13}, "file": {"n": 124, "min": 456, "median": 6818, "max": 60852, "total": 1073128}, "fileOver": {"4000": 93, "20000": 7, "40000": 3}}}
{"habitRules": {"count": 28, "descriptionBytes": 6891, "claudeAdapterChars": 1794, "asDeliveredInTrialChars": 10223, "asDeliveredInTrialBytes": 10255, "description": {"n": 28, "min": 58, "median": 205, "max": 793, "total": 6859}, "over300": 7, "over400": 4}}
{"pathScopedRules": {"count": 21, "file": {"n": 21, "min": 1305, "median": 4249, "max": 10614, "total": 105886}, "description": {"n": 21, "min": 46, "median": 345, "max": 899, "total": 8432}}}
{"skills": {"count": 78, "description": {"n": 78, "min": 37, "median": 429, "max": 1139, "total": 38060}, "descriptionOver": {"256": 57, "512": 38, "1024": 3}, "body": {"n": 78, "min": 646, "median": 7423, "max": 156546, "total": 1065154}, "bodyOver": {"5000": 51, "7500": 38, "10000": 30, "20000": 12, "100000": 1}, "linesOver500": 6}}
{"listing": {"claude": {"skills": 87, "descriptionChars": 40758, "nameChars": 1612, "nameAndDescriptionChars": 42370}, "agents": {"skills": 87, "descriptionChars": 40758, "nameChars": 1612, "nameAndDescriptionChars": 42370, "relativePathChars": 3700}}}
{"adapters": {"claudeUnscopedRuleAdapterChars": 6780, "claudeRulesBytes": 9931, "agentsRulesBytes": 8143}}
{"entry": {"AGENTS.md": 1975, "CLAUDE.md": 57, "RULES_INDEX.md": 11876, ".agent/directives/AGENT.md": 14274}}
{"agentsChain": {"files": {"AGENTS.md": 1975, "demos/oak-design-showcase/AGENTS.md": 678}, "largestChainBytes": 2653}}
```
