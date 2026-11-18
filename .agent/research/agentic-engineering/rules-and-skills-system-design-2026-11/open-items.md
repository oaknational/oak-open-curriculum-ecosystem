# The open items of parts 1 to 3, through the decision lenses

The owner's request, 13 November 2026, before pull request 412 merged: "Take all questions and
unknowns in the PR, and run them through the decision matrix, using the appropriate skills and
principles.md , ultrathink, let me know what survives".

This note is that pass over [`design.md`](design.md),
[`nested-directories.md`](nested-directories.md), [`threshold-reread.md`](threshold-reread.md),
the delivery node and the continuity record. Each item was first sorted as a decision or a
fact. A fact is read or measured, not asked, and a measurement is kept only where it names a
decision it can change. A decision went through the five lenses of
[`principles.md`](../../../directives/principles.md) in order, the first decisive lens
governing. A question reaches the owner only when all five fail to resolve it, or when the
decision is constitutively the owner's. Each verdict is this seat's, with its warrant and a
falsifier, and the owner's word overrides any of them.

Reading the records a question would be sent to, before sending it, found three accepted
decision records that govern this design and that it had not cited: PDR-009 (canonical-first
platform files), PDR-051 (skills and their adapters) and PDR-124 (the budget of what a session
is given at start). They change two verdicts below.

## What survives

- **One question is open: whether the repository needs the nine skills installed from their
  vendors.** The owner, 2026-11-13: "Do not assume that the external skills are fixed! Maybe we
  don't need them, we don't know yet, it's an open question." They are the seven Clerk skills,
  `mcp-inspector` and `skill-creator`, recorded with a content hash in `skills-lock.json`
  (PDR-051). They are in the listing B5 bounds, 3,146 of its 10,000 characters on Codex and
  2,814 on Claude Code. With them as they are, each of the 78 procedures' descriptions has
  about 25 characters on Codex and 73 on Claude Code; without them, about 66 and 109. On
  Claude Code alone, the `skillOverrides` setting lists a skill by name only or hides it
  without editing it
  ([`claude-code-rules-and-skills-loading.md`](../doing-and-dreaming-2026-11/claude-code-rules-and-skills-loading.md));
  Codex's listing is not changed by it. No trial session called any skill, so the trials show
  no use of them either way, and one cloud session here listed a plugin's
  `anthropic-skills:skill-creator` beside the repository's `skill-creator`.
- **D2 is not open.** Whether a procedure's adapter carries its body was first put to the owner
  as a ratification. It is not one: the estate's classifier lands an owner's word that changes
  a Core record as an amendment of that record, quoting the word (D1), and the model the owner
  accepted has the body "loaded when it is selected".
- **Statements, with nothing asked.** The model the owner decided on 13 November amends three
  accepted records. PDR-009 has platform files be "thin adapters that reference the canonical
  substance", except where a role cannot follow a pointer and "its adapter carries the prompt",
  copied from its source by a generator. An instruction delivered as text extends that
  exception to the case the trials found, a pointer mostly not followed. PDR-051's "Adapter
  bodies contain only the canonical-read instruction" gives way to a body delivered as the
  invoked skill (D2). PDR-124 says "the
  session-injected tier carries a budget", and that it carries "identity and firing conditions
  only"; B1, B2, B4 and B5 are budgets for that tier, and an instruction's requirement is its
  identity there. And the cost the owner accepted with the listing budget, descriptions
  shortened on smaller windows, is by PDR-124 "a defect signal" on those windows; the cure it
  names, moving substance down a tier, is what B4 and placement do.
- **The spike happens only when the owner says so**, and the documentation changes related to
  it, the amendments in D1 among them, are part of it. The owner, 2026-11-13: "The spike will
  not happen until I say so, stop treating it as imminent, and any related change of
  documentation is part of that spike, not a separate thing." S1 and S2 below can arise only
  inside it.

## Decisions the lenses resolve

| # | Item, and where it stands | Verdict | Lens and warrant | Falsifier |
| --- | --- | --- | --- | --- |
| D1 | Where the decisions are recorded: the design's fifth question | Amend the records that own this substrate: PDR-009, PDR-051 and PDR-124, and the rule `capability-landing-decision-procedure`. No new decision record. Each amendment is dated and quotes the owner's word, and is written as part of the spike's work | The estate's classifier, `new-rule-vs-pdr-clause`: substance that refines an existing record goes to a "new clause in the PDR", and "A reading of an owner's word that changes what a Core record decides lands here, as an amendment of that record, dated and quoting the word". A new record is for a contract "no existing PDR owns". This replaces the design's recommendation of a new record, made before these records were read | An amendment cannot be written without contradicting a part of its record that still stands |
| D2 | Whether a procedure's body reaches Claude Code as the skill it invokes, or through a pointer: B6's row | The adapter carries the body, copied by the generator and compared with the canonical file, and B6 stays at 5,000 characters. PDR-051's "Adapter bodies contain only the canonical-read instruction" is amended, quoting the owner's word on the model (D1) | Second lens: part 1's model has the body "loaded when it is selected", which a pointer does not do. First lens: Claude Code puts an invoked skill's body back after a compaction, up to 5,000 tokens, while a file read through a pointer comes back only if it is among the five files, at most, that it re-reads, chosen as the most recently modified. PDR-009's own exception is the shape: one canonical home, a generated copy, a check | The spike shows an inline body not loaded when the procedure is selected, or cut below B6 |
| D3 | How an instruction placed by directory reaches Claude Code: the instruction contract | A `.claude/rules/` file at the root whose `paths` cover the directory, carrying the instruction's text; not a nested `.claude/rules/` or a generated nested `CLAUDE.md` | Third lens: one directory the generator already writes, and a documented trigger. The two undocumented points about nested rules then need no answer | In the spike a path-scoped rule does not load when a file in its place is read or edited |
| D4 | What a projection adds to each instruction: the first of the three things that follow part 3's budgets | The name, the text and the record's path, and nothing else; B2 counts all three | Second lens: the record's contract has what stands behind a unit found from the unit. Third lens: nothing more | The 28 habit instructions cannot fit B2 with this wrapper |
| D5 | Whether pointers remain beside the always-present instructions: the same passage | None remains. Each unit is an instruction or a procedure, and an instruction is text and not a pointer, so the pointers go by construction | Fourth lens: the change to the system dissolves the question | A unit is found that the model cannot express except as a pointer |
| D6 | What Codex gets for a placed unit: the instruction contract and `nested-directories.md` | An instruction placed by directory: a generated `AGENTS.md` in that directory, which Codex loads in sessions started there. Placed by paths alone: nothing on Codex beyond its check, where it must hold. A placed procedure: kept in its package on Codex as on Claude Code, so it is listed only in a Codex session started there, as the procedure contract says | The owner's platform order of 2026-11-12, with the third lens: each platform gets what its own mechanism carries, once. Second lens: one projection for place on both platforms, not one that turns on a measurement. One nested `AGENTS.md` cannot serve Claude Code here as well, since Claude Code reads an `AGENTS.md` "only when you have no `CLAUDE.md` in your working directory or above it" and this repository has a root `CLAUDE.md` | The Codex leg shows sessions started at the root working in a package without the units placed there |
| D7 | Where the budget numbers live: part 5's to propose | One place in the build, beside the existing size check in the portability validator | Third lens, and one home | Two checks need one number in tools that cannot share a source |
| D8 | Whether T8's 32 KiB is combined or each file | No investigation: B7 already takes the combined reading, the stricter one | Second lens | A vendor page states a stricter limit than 32 KiB combined |
| D9 | The windows of Codex models but one, and whether the default 2 % is capped | No investigation: the owner set B5 at the current defaults with the cost on smaller windows stated | The owner's decision of 13 November already holds the uncertainty | Codex's default model moves to a window under 500,000 tokens |

## What the spike observes, and the decision each can change

| # | Observation | The decision it can change |
| --- | --- | --- |
| O1 | Each unit present once on each platform | The plan's stop condition |
| O2 | Session-start tokens with the projection, and whether Claude Code's warning on combined length (T11) appears | B2, and the stop condition |
| O3 | The listing as rendered: which descriptions are cut or dropped; whether skills from outside the repository draw on the same budget; whether a root skill with `paths` is listed before a file matches; whether a nested skill, once loaded, counts | B5's real headroom, and whether placement or `paths` lowers the listing (D6) |
| O4 | Tokens for a sample of procedure text | The margin of the two-characters-a-token conversion under B6 |
| O5 | The Codex leg, which the owner runs: each unit once, and the form of the paths in the listing | The Codex projection (D6) |
| O6 | How many of the 78 procedures concern one package or workspace, by description | Whether placement is a material lever on B5. A count, not a change to content |
| O7 | How many standing constraints the 124 rules hold, by description, as the two sorts counted habits | The stop condition, which turns on the standing instructions fitting, and S2 |
| O8 | What the session-start hook prints | B2's account of always-present text, counted once |

## Stopped: no decision they could change

- The event that loads a nested `.claude/rules/` file, and whether a nested rule with `paths`
  loads on the directory or the pattern: moot under D3.
- What "not cloud threads in a project" names: it applies to every project skill alike, and
  this estate's sessions list their skills.
- Which wins when the listing's setting and its environment variable are both set: the estate
  sets only the setting.
- How much of the rules' and skills' text is record: it changes no design decision, and the
  content is out of scope.

## Routed elsewhere

- Why no session in the trials called a skill: to part 7's measure of success, since the
  procedure contract does not rely on selection.

## Questions that arise only on a spike result

- **S1.** If O3 shows that skills from outside the repository draw on the listing budget and
  crowd it: which outside skills this repository's sessions carry. Constitutively the owner's,
  since the account and the environment hold that set.
- **S2.** If O7 shows that the standing instructions cannot be made to fit 12,000 bytes after
  placing, checking and shortening: B2 returns to the owner with the count, as the fourth
  question already says. The owner's word that materials can be "expressed more succinctly"
  makes shortening the first move.

## Changed from what the owner was told

On 13 November this seat told the owner that part 4 would put the choice behind B6, an inline
body or a pointer, to them, and then put it to them as a ratification. Neither holds: the
classifier lands it as an amendment quoting the owner's word (D2), so it is not put.

The same day this seat told the owner that no question was open. The owner's word on the
installed skills opened one (above). The arithmetic behind the third question, which the owner
decided, spread B5 over all 87 skills, "all 87 at about 54", as if the nine installed ones were
shortened with the estate's own. They are not, and with them kept as they are each of the 78
has about 25 characters on Codex, not 54. The owner's decision of B5 itself is unchanged.
