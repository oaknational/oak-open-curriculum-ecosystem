# The patterns directory: what it holds and what becomes of it

Written 12 November 2026 by the seat Swift holds Aether (Claude Code cloud session `01Duocji`)
at the owner's word: "Please find the patterns directory and explore it. I suspect that we have
an inconsistent and inconsistently applied policy on turning patterns into useful mechanisms,
and some of them may be the source of the behavioural rules you mentioned."

**Status: `provisional`.** The counts are computed from [`patterns.tsv`](patterns.tsv), one row
per pattern file, produced by a script that reads files and judges nothing. "Cited" means the
pattern's file name appears as a whole word in the named place. The directory's README was
read in its policy sections; the 246 pattern bodies were not read.

**The suspicion holds, on both counts.** The policy is stated four ways that do not agree, and
the directory is mostly unconnected to any mechanism. Some patterns are the source of the
behavioural rules, but few.

## What the directory holds

`.agent/memory/active/patterns/` holds a README and 246 pattern files. The 246 hold 1,034,859
characters, about the size of the rules and of the skills.

| By category | Files |
| --- | --- |
| `process` | 120 |
| `agent` | 47 |
| `code` | 34 |
| `architecture` | 17 |
| `testing` | 16 |
| Six values the schema does not list (`planning`, `build-system`, `coordination`, and three used once) | 12 |

- 165 are marked `pattern`, a shape to repeat. 79 are `anti-pattern`, a failure to avoid. Two
  carry a polarity the schema does not list.
- 216 call themselves `general`, 28 `family`, 2 `contextual`.
- 44 have no `proven_date`. Of the rest, by month: February 5, March 22, April 34, May 19, June
  57, July 41, August 18, September 6.
- 175 are in the behavioural categories: process, agent, planning and coordination hold 173,
  and two one-off values, `coordination-architecture` and `agent-operations`, hold the other
  two. That is six times the 28 habit-of-mind rules the rules sort found.

## What becomes of a pattern

| A pattern's file name appears in | Patterns | Of 246 |
| --- | --- | --- |
| A rule | 14 | 6 % |
| A canonical skill | 9 | 4 % |
| A directive | 10 | 4 % |
| A Practice decision record | 25 | 10 % |
| An architectural decision record | 5 | 2 % |
| Hook policy, hook scripts, the agent tooling or lint rules | 2 | 1 % |
| Its own `related_pdr` field is set | 47 | 19 % |
| **None of the above** | **170** | **69 %** |

- No `code` pattern and no `testing` pattern is named by any rule or skill: 0 of 34 and 0 of
  16.
- Of the 175 behavioural patterns, 19 are named by a rule or a skill.
- 97 of the 246 are never named in the napkin or its archives. Three are named often:
  `passive-guidance-loses-to-artefact-gravity` 87 times, `fluency-is-a-failure-vector` 47,
  `inherited-framing-without-first-principles-check` 27.

## Are the patterns the source of the behavioural rules?

In part, and thinly.

- 16 of the 124 rules name any pattern. Six of the 28 habit-of-mind rules do:
  `verify-dont-trust` names five patterns, `scope-from-goal-before-approach`,
  `replace-dont-bridge` and `no-warning-toleration` two each,
  `collaboration-is-value-contingent` and `precedence-is-not-approval` one each.
- The same three patterns do most of the work. `passive-guidance-loses-to-artefact-gravity` is
  named by four of those six rules and `fluency-is-a-failure-vector` by three.
- No rule shares a name with a pattern. Where a rule came from a pattern, nothing in either
  file's name says so.
- The other 22 habit rules name no pattern. By their own text most open on an owner ruling
  (the rules table records that 104 of 124 rules quote the owner).

So the behavioural rules and the behavioural patterns are two stores of the same kind of
knowledge, filled by different routes, with a few threads between them. A lesson about how to
think has ended up as a rule when the owner ruled on it, and as a pattern when a seat noticed
it.

## The policy, as stated in four places

1. **The directory's lifecycle** has three stages: candidate, admitted, retired. None of them
   is "became a mechanism". Admission is the end of the line it draws.
2. **The same README, further down**, says a mature pattern "can feed recipe books, rules,
   principles, scanners, quality gates, ADRs, PDRs, or PDR amendments", and that "The pattern
   file is not necessarily the final home; it is often the empirical proof surface". It names
   no trigger for that move and no owner of it.
3. **The consolidation skill and the staging file treat a pattern file as a permanent home.**
   A lesson "graduates to a `patterns/` file" beside rules and decision records, and the
   pending-graduations register counts a pattern file as a doctrine surface. On that reading a
   lesson filed as a pattern is finished.
4. **The rule for landing a capability does not mention patterns at all.** It describes the
   estate's levers as one gradient, "always-loaded directives and rules → trigger-loaded rules
   → summoned skills → dispatched subagents → zero-context hooks and validators"
   (`.agent/rules/capability-landing-decision-procedure.md:23-26`). A pattern is not on it.

Read together: a pattern file is a place a lesson is said to have graduated to, which is not
one of the estate's levers, with a stated possibility of moving on that nothing schedules.

There is also a tension on entry. The README's bar says "occurred more than once" is a
default "**not a gate**", and the staging file says to promote on the first instance. The rule
`one-instance-is-an-observation` says a record does not name a pattern from one instance. Both
are in force.

## How a pattern reaches a session

- `AGENT.md` links the directory's README and says to check the patterns "Before inventing a
  new approach".
- The start-right workflow lists the README as "the pattern index", and adds in the same line
  that "passive guidance needs an active layer to fire under context pressure".
- Nothing loads a pattern file. The index is inside a 488-line README that lists 246 one-line
  entries.
- In the delivery trial's ten sessions no pattern file and no patterns README was opened. In
  the twenty sessions of the later habit-text trial one pattern file was opened once, by a
  control session on the rule-writing task.

So a pattern acts on a session only if the agent goes looking, in an index of 246, at a moment
it has already recognised as one for looking. For an anti-pattern that is the wrong way
round: the 79 anti-patterns describe failures a seat does not know it is in.

## What this suggests, for the review of the collection

Not designs. The owner's ruling of the same day gives the first one its shape: rules and
skills "must describe current requirements, not the evolution that arrived at them".

1. **Give the pattern file one job.** The README already has the phrase: "the empirical proof
   surface". If a rule or skill holds the present requirement and nothing else, the evidence
   and the history need a home, and the pattern file is a candidate for it. Then "graduated to
   a pattern" would mean "the evidence is filed", and the instruction would still owe a
   landing through the landing procedure.
2. **Decide, for the 175 behavioural patterns, which carry an instruction that is not yet a
   rule or part of a skill.** That is a reading task over their `use_this_when` lines, which
   the table holds. The 67 behavioural anti-patterns (one of them spelt `antipattern`) come first, since no session will look
   them up.
3. **Reconcile the entry bar** between promote-on-first-instance and
   one-instance-is-an-observation. They can both stand if a first instance may be filed as
   evidence and may not yet be stated as a requirement.
4. **Bring the frontmatter back inside its schema**: eleven category values against five
   listed, two polarity values not listed, 44 files with no date. These are small and they are
   why a count by category needs a footnote.

## Limits

- Citation is by file name. A rule that restates a pattern without naming it is not counted,
  and that is likely common, since no rule shares a pattern's name.
- The pattern bodies were not read, so "carries an instruction" is not yet known for any of
  them.
- The sibling memory class for collaboration patterns
  (`.agent/memory/collaboration/`) and the sibling estate were not examined.
- One reader, the same model family as wrote the patterns.
