# Rules and skills: what each is good for

Written 12 November 2026 by the seat Swift holds Aether (Claude Code cloud session `01Duocji`)
at the owner's word: "From now on this investigation considered rules AND skills, and for that
we need a clear understanding of the strengths and appropriate use cases for each".

Claude Code only, as the owner scoped the side question this draws on. Three sources, kept
apart:

- **The platform**: Anthropic's documentation, as a sub-agent quoted it on 2026-11-12
  ([`../claude-code-rules-and-skills-loading.md`](../claude-code-rules-and-skills-loading.md),
  part 2). This seat did not re-fetch the pages.
- **The estate's doctrine**: the rule `capability-landing-decision-procedure`, read whole.
- **What was observed here**: the delivery trial, the rules sort and the tables beside this
  file.

**Status: `provisional`.** The comparison in section 1 is the platform's as documented. Section
3 is this seat's reading and has not been tested.

## 1. What the platform gives each

|  | A rule | A skill |
| --- | --- | --- |
| What reaches the model at session start | The rule's whole text, if it has no path scope | A name and a description, within a shared budget |
| What it costs when it is not needed | Its full length, on every request | Its description, on every request; nothing if it is set to user-only |
| What brings the rest | For a path-scoped rule, the harness, when a matching file is read or edited | The user typing its name, or the model matching its description |
| Who decides the moment | Nobody (always present), or the harness (path scope) | The user or the model |
| After a compaction | Unscoped text is put back from disk. Path-scoped text is lost until its file is touched again | The listing is rebuilt. An invoked body is re-attached, its first 5,000 tokens, within 25,000 across all skills |
| What it can carry | Text | Text, supporting files read when needed, scripts, hooks that run for the rest of the session, a tool grant, a model choice, a fork into a fresh context |
| Whether it can be tested | No mechanism | In this estate, yes: the skill-evaluation runner, with and without the skill |
| Whether it is enforced | No: "context, not enforced configuration" | No; a skill's hooks are the enforced part |
| Size guidance | Under 200 lines a file; longer files "reduce adherence" | Body under 500 lines; description capped at 1,536 characters |

Neither is enforcement. The documentation's instruction for anything that must hold whatever
the model decides is a hook.

## 2. What the estate's doctrine already says

The landing rule sets the levers on one gradient: "always-loaded directives and rules →
trigger-loaded rules → summoned skills → dispatched subagents → zero-context hooks and
validators" (`.agent/rules/capability-landing-decision-procedure.md:23-26`). Its tests, in its
own order:

- **Payload shape.** "a standing invariant small enough to afford in always-loaded context, or
  a multi-step procedure that is not" (lines 91 to 93). An invariant is a rule; a procedure is
  a skill.
- **Who recognises the trigger.** A trigger-bound landing is sound only when a loader, "a path
  match, a tool-call match, a session-shape flag, or an always-invoked ceremony skill", can
  recognise the moment. Where it depends on the agent noticing, "the agent must already
  remember the capability to know to load it, which is the failure it exists to prevent" (lines
  113 to 120).
- **Overlap.** The owner's ruling: "if a question of disambiguation or de-duplication arises,
  favour skills as the SSOT, with evals" (lines 68 to 69), because only skills can be tested.
- **A procedure that must always be in force** lands as a skill with a paired rule, each
  pointing at the other (lines 122 to 129).

This doctrine agrees with the platform. What follows is where practice has drifted from both.

## 3. Strengths and proper uses, read from all three

**A rule is for a short statement that has to be in front of the agent before the agent knows
it needs it.** Its one strength is presence without anyone choosing: it is there on the first
turn and it comes back after a compaction. Its cost is that every session pays for every word,
and the platform says adherence falls as length rises. So a rule earns its place when it is
short and when no moment can be named for it.

- *Proper use:* a habit of mind (the rules sort found 28); a prohibition whose breach cannot be
  undone, as the text beside the hook that enforces it.
- *Proper use, path-scoped:* a convention for one kind of file, delivered when that kind of
  file is touched. The estate has 21.
- *Not for:* a procedure; anything long; anything that only applies in a session of a
  particular shape, which a solo session then carries for nothing.

**A skill is for a procedure with a recognisable start.** Its strengths are that it costs
almost nothing until used, that the owner can start it by name with certainty, that its body
survives a compaction in part, that it can bring files, scripts and hooks with it, and that it
can be tested. Its weakness is its trigger: unless the owner types its name, the model has to
pick it from a description that competes with every other description for a fixed budget.

- *Proper use:* committing, opening and shepherding a pull request, planning, consolidating,
  closing a session. Work with steps, done at a moment someone can name.
- *Proper use:* anything the estate wants to measure, by the owner's ruling.
- *Not for:* something that must apply when nobody thinks to invoke it.

**Neither is for what must hold regardless.** That is a hook, a lint rule, a gate or a
validator. Neither is for a judgement that needs a fresh context; that is a sub-agent.

**Neither is for the history of how the requirement was reached.** The owner's ruling of
2026-11-12: "Regarding history in rules, there should be none of that, same for skills, they
must describe current requirements, not the evolution that arrived at them." The platform gives
the same answer from the other side: length costs adherence in a rule, and only the first 5,000
tokens of a skill survive a compaction.

## 4. Where the estate stands against that

Measured on 2026-11-12; the tables are beside this file.

| | Rules | Canonical skills |
| --- | --- | --- |
| Files | 124 | 78 |
| Characters | 1,073,128 | 1,110,535 |
| Characters of their own one-line descriptions | 41,631 | 38,060 |
| Delivered to a session as | A one-line pointer, for 103 of 124 | A short adapter ending in a pointer to the canonical file |
| Lines that carry a date | 945 of 18,560, in 110 of the 124 files | 664 of 18,904, in 41 of the 78 files |
| Over the platform's length guidance | 7 over about 5,000 tokens | 6 over 500 lines; 13 over about 5,000 tokens; 1 over what a single read returns |
| Can be tested | — | 16 have an evaluation directory beside the canonical file |

Four departures follow from the table.

1. **Both arrive as pointers, so neither has its strength.** A rule's strength is that its
   text is present; here the pointer is present and the text is not. A skill's strength at
   compaction is that its body is re-attached; here the re-attached body is the adapter. This
   last point is an inference from the documentation and the adapters and has not been tested.
2. **Rules are carrying procedures and session-shape material.** The rules sort found 90 of
   124 tied to a named activity, 41 of them marked always-on, and 17 that apply only in team
   sessions.
3. **Both carry history.** A dated line is a floor for it, not a measure: a line can tell a
   story with no date in it. By that floor, nine rules in ten and half the skills carry some.
4. **The descriptions are doing the work the bodies were meant to do.** A session has a
   rule's file name and a skill's description to choose by, and the rules it opened were on
   the subject of its task; how it chose was not measured. The descriptions of everything, rules and
   skills together, come to 79,691 characters. The bodies come to 2.18 million.

## 5. What this suggests, for the review of the collection

Not a design. One sorting question, asked of each rule and each skill, with where each answer
leads.

| If the content is | It belongs in | Delivered as |
| --- | --- | --- |
| A short requirement with no nameable moment | A rule | Its text, at session start |
| A convention for a kind of file | A path-scoped rule | Its text, when the file is touched |
| A procedure with a nameable start | A skill | Its body, top-loaded and within the platform's lengths |
| A requirement that belongs to one procedure | That skill, not a separate rule | With the skill |
| Something that must hold regardless | A hook, gate, lint rule or validator | Not as text |
| The evidence and the history behind any of these | A decision record, a pattern file, a retrospective, the commit | Read when someone asks why |

The last row is the owner's ruling. The patterns findings beside this file suggest the pattern
file as one home for that evidence.

## Limits

- The platform column rests on a sub-agent's quotations, some read raw and some through a
  summarising fetch.
- "Carries a date" is a proxy for history. No rule or skill was read line by line for it.
- The count of 16 skills with evaluations is by directory beside the canonical file; an
  earlier count in this strand, made by path pattern, gave 20.
- Section 3 is one seat's reading. The test of its first claim, delivering the habit rules as
  text, was run after this was written: [`../habit-text-trial.md`](../habit-text-trial.md). The
  delivered text was taken up in one planning task and not in another, and no conclusion
  changed.
