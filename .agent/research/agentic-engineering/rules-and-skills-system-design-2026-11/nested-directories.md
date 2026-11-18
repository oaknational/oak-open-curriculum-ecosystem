# Platform directories below the repository root

The owner's question, 13 November 2026, on accepting the design's recommendations: "before
marking them final, please investigate nested/multiple .claude directories e.g. a package can
have it's own additional (?) rules and skills. I don't know if codex also supports that".

This note answers it from the vendors' documentation and says what the answer changes in
[`design.md`](design.md). Nothing here was observed in a running session. Every quotation is
from a page fetched raw: the pages listed in [`threshold-reread.md`](threshold-reread.md),
fetched on 12 November 2026, and one more fetched on 13 November 2026,
`https://code.claude.com/docs/en/large-codebases.md` (HTTP 200, 35,612 bytes).

## The answer

Both platforms read guidance from directories below the repository root. They differ in when.

- **Claude Code** reads a nested directory's instruction file, rules and skills. Its
  instruction file and skills reach a session started in that directory from the start, and a
  session started above it when the session first works on a file there. Its rules load on
  demand, at an event the documentation does not state (below).
- **Codex** reads a nested directory's `AGENTS.md` and skills only when the session is
  started in that directory or below it. A session started at the root never gets them. Codex
  has no rules directory, nested or not.

So an instruction file or skill kept in a package's own directory reaches a Claude Code
session that touches the package, a rule kept there reaches it at an event still to be
observed, and any of them reaches a Codex session only if someone starts Codex inside the
package.

## What each platform documents

| What | Claude Code | Codex |
| --- | --- | --- |
| Instruction file in a directory above the start | Loaded at launch: "from your current working directory and every directory above it" | Loaded at start: "Starting at the project root (typically the Git root), Codex walks down to your current working directory" |
| Instruction file in a directory below the start | Loaded on demand: "Claude Code loads each one once Claude reads, writes, or edits another file in that subdirectory" | Not loaded. The chain is built "once per run" and ends at the working directory |
| Rules in a nested `.claude/rules/` | Loaded on demand. The page lists "Rules files in a subdirectory's `.claude/rules/`" among the files that "load on demand", and names "rules in nested `.claude/rules/` directories" beside path-scoped rules as "rules that load on demand" | No equivalent |
| Skills in a nested directory, session started there or below | Loaded at start, with every parent's: "in the directory where you start it and in every parent directory up to the repository root" | Loaded at start: "Codex scans `.agents/skills` in every directory from your current working directory up to the repository root" |
| Skills in a nested directory, session started above | Loaded on demand: "They load the first time Claude reads or edits a file in that subdirectory and stay available for the rest of the session. Until then they don't appear in the `/` menu and you can't invoke them by name" | Not loaded. The scan runs from the working directory up, not down |
| Two skills with one name | Both stay: the nested one is listed as `apps/web:deploy`, and Claude is told "to invoke the one whose directory holds the files it's working on" | "Codex doesn't merge them; both can appear in skill selectors" |
| A skill limited by file pattern, kept at the root | A `paths` field: "Claude loads the skill automatically only when working with files matching the patterns" | No such field was found |
| Size limit on what loads on demand | T1 of the design applies to a nested instruction file and to "Rules files in a subdirectory's `.claude/rules/`" | Does not arise |
| Settings | Not inherited: "Project settings in `.claude/settings.json` aren't inherited from parent directories the way CLAUDE.md files are" | Not examined |

## What the documentation does not say

- The exact event that loads a nested `.claude/rules/` file. The page groups it with a nested
  instruction file, whose event is a read, write or edit of a file in that directory. It does
  not state the event for rules in its own sentence.
- Whether a rule in a nested directory that also sets `paths` loads on the directory or on the
  pattern.
- Whether a skill that sets `paths` is kept out of the listing until a file matches, or is
  listed from the start and only invoked automatically on a match. The listing budget depends
  on which.
- Whether a nested skill, once loaded, is counted in the listing budget with the rest. The
  monorepo page implies it: started from the root, the list holds "root skills, plus skills
  from every subdirectory Claude touches during the session, which can accumulate into the
  hundreds".
- One exclusion is stated and not explained here: project and nested skills load in "Sessions
  in this repository, but not cloud threads in a project". The sessions of this work were
  cloud sessions and listed the estate's skills, so that phrase names something narrower than
  a cloud session. What it names was not followed up.

[`open-items.md`](open-items.md) says which of these the spike observes, and which no decision
turns on.

## What the repository holds today

No platform directory below the root. A search of tracked files finds `.claude/`, `.agents/`,
`.codex/` and `.cursor/` at the root only. Four instruction files are below the root: one
`AGENTS.md` and one `CLAUDE.md` under `demos/oak-design-showcase/`, and two `CLAUDE.md` under
`packages/design/oak-design-system/`. The generators write to the root directories only, by
the audit.

## What it changes in the design

1. **Place has two forms on Claude Code, and procedures can have one.** The design gave place
   to instructions only, as a set of paths. A unit can also be placed by where it is kept: in
   the platform directory of the package it concerns. That holds for a procedure as much as
   for an instruction. The design now says so.
2. **It gives the listing a way down that shortening does not.** The listing budget does not
   hold all 87 skills at a useful description length. A procedure that concerns one package,
   kept in that package, is out of a root session's listing until the session works there.
   That reduces what the start of a session carries without cutting a word. How many of the
   78 concern one package is a question about content, which the plan puts out of scope; the
   mechanism is recorded so that the sort can use it.
3. **It does not help Codex from the root.** A Codex session started at the root sees root
   skills and the root `AGENTS.md` only. A placed unit is invisible to it. That is the
   design's existing statement for placed instructions, "the least it can be is nothing", and
   it now covers placed procedures too. For the unit to reach Codex at all, part 4 has to
   choose between a root entry that names the package's units and accepting that Codex gets
   them only when started in the package. [`open-items.md`](open-items.md), D6, gives the
   verdict part 4 starts from.
4. **One home still holds.** A unit kept both at the root and in a package would be listed
   twice on Claude Code, once under each name. The owner's condition, "as long as we don't end
   up loading things twice", means a unit is placed or it is not.
5. **It leaves the four answers as they are.** The unit model gains a form of place and loses
   nothing. The rule for "well within" and the two budgets are set against what a session
   carries at its start, and a placed unit lowers that. The per-file limit on what loads on
   demand, T1, already governs a placed instruction at 4,000 characters.

## What it costs

Stated so the mechanism is not read as free.

- A placed procedure cannot be invoked by name until the session has worked in its package.
- A session that crosses many packages accumulates their units, and nothing takes them out
  again. The start is small and the session is not bounded.
- The build would write to more than one directory per platform. That is a change to the
  generators, which this plan specifies and does not make.
