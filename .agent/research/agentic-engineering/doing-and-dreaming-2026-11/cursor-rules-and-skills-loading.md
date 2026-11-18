# How Cursor loads rules and skills, and what that means here

Written 12 November 2026 by the seat Swift holds Aether (Claude Code cloud session `01Duocji`).
It is the first step of the work the owner described as "Figuring out what the ideal skill and
rule system looks like", and it follows from
[`review-of-the-collection.md`](review-of-the-collection.md), which found that the collection
knew how one platform loads rules and skills and nothing of the others.

**What this is.** This seat's reading of a sub-agent's report on Cursor's documentation,
fetched that day. The report is kept as returned in
[`cursor-rules-and-skills-loading-report.md`](cursor-rules-and-skills-loading-report.md), with
every quotation and its source page. It is the counterpart of
[`claude-code-rules-and-skills-loading.md`](claude-code-rules-and-skills-loading.md).

**Its standing.** Documentation only. Nothing here was observed in a running Cursor; this
session has none. The sub-agent read each page raw and checked each quotation against the saved
page by script. This seat then found five of its load-bearing quotations in those saved pages:
the skill directories Cursor loads, the sentence on `alwaysApply`, the sentence on file
mentions, and the two on `CLAUDE.md`. Every statement below that joins the documentation to
this repository is inference and is marked.

## 1. The answer to the owner's condition

The owner will accept copied text for each platform "as long as we don't end up loading things
twice, e.g. Claude loading skills from both .claude and .agents".

On Claude Code that does not happen: each trial session listed each of the estate's skills
once (the review, section 6). On Cursor, by its documentation, it does, in three places.

| What | What the documentation says | What this repository gives it | Result, by inference |
| --- | --- | --- | --- |
| Skills | Loaded from `.agents/skills/` and `.cursor/skills/`, and "For compatibility, Cursor also loads skills from Claude and Codex directories: `.claude/skills/`, `.codex/skills/`". No rule for two skills of one name; a release note says they "show as separate rows" | The same 87 names under `.agents/skills/` and under `.claude/skills/`. Nine of the second are symlinks into the first | Each skill is discovered at least twice. Whether the model is shown both descriptions is not stated anywhere |
| The entry file | `AGENTS.md` is read, and "`CLAUDE.md` files are always applied to every conversation". They are delivered once only when one "is a symlink, hard link, or identical copy" of the other | `AGENTS.md` of 1,975 characters and `CLAUDE.md` of 57. Different files, each telling the reader to read `AGENT.md` | Both are always in context |
| Hooks | "Cursor can load and execute hooks configured for Claude Code", from `.claude/settings.json`, when a setting that "is on by default" is on. "All matching hooks from every source run." | A session-start hook in `.cursor/hooks.json` and four hook events in `.claude/settings.json`, a session-start among them | Both session-start hooks can run in one Cursor session |

Sub-agent definitions do not double: where names collide "`.cursor/` takes precedence over
`.claude/` or `.codex/`". Rules do not double either. Cursor's documentation never mentions
`.claude/rules/`, and the same 124 rules reach it through `.cursor/rules/`. Silence is weaker
evidence than a statement.

So the condition the owner set is already unmet on one platform, before any pointer is
replaced by text. It is unmet by the estate's present layout and not by the pointer system.

## 2. What a rule delivers on Cursor

Cursor's rule file has three fields, and they make four kinds of rule. The repository uses
three of them.

| Kind | Rules here | What the documentation says reaches the model | What reaches it here |
| --- | --- | --- | --- |
| Always applied (`alwaysApply: true`) | 75 | "Always included. Globs and description are ignored." | The one-line pointer. By inference the description is not sent, so the model has 75 lines that each name a file and say nothing of what it is about |
| Chosen by the agent (a description, no pattern) | 28 | "Agent reads the description and pulls the rule in when relevant." | The description, and after a fetch the pointer. Two decisions by the model before the rule's text is read |
| Attached by file pattern (`globs`) | 21 | "Auto-attached when a matching file is in context." | The pointer, when a matching file is in context |

Three things follow, each an inference from the documentation and the adapters.

1. **A pointer is a pointer on Cursor too.** "A file mention like `@migration-template.sql`
   tells Agent where to look, and Agent reads the file with its tools when it needs the
   content. The file's contents are not inlined into the prompt". There is no import that
   loads a file's text. So all 124 rule bodies reach Cursor's model only if it opens them, as
   on Claude Code.
2. **The two platforms deliver the opposite halves.** On Claude Code a session starts with 103
   pointers and no descriptions. On Cursor the 75 always-applied rules arrive as pointers
   without descriptions, and the 28 the estate calls `situational` and does not path-scope
   arrive as descriptions. Those 28 descriptions are 15,564 characters. On Cursor, then, the
   rules the estate thinks least general are the only ones whose stated instruction is in front
   of the model from the start.
3. **The habit-text trial's treatment is already half-built for Cursor.** That trial put the
   28 habit rules' descriptions into Claude Code's context in place of their pointers. On
   Cursor every rule's description is already in its adapter's frontmatter, and for an
   always-applied rule the documentation says it is ignored. Moving a description from the
   frontmatter into the body is the same change the trial made.

## 3. What a skill delivers on Cursor

- At the start the model is given skill descriptions: "skill descriptions injected into the
  system context". The body loads when the model judges the skill relevant or the user types
  its name.
- A skill invoked by name "attaches to one message"; the documentation offers a custom mode to
  keep one on for a session.
- Warnings, not limits, at a description over 1,024 characters and a body over about 5,000
  tokens. No budget for the listing is documented. Claude Code documents one and this
  repository has raised it.
- Every skill adapter here is a pointer to a canonical file, on this platform as on the other.

## 4. What both platforms agree on

- Rules and skills are advice. Cursor: "suggestions, not guarantees". Claude Code: "context,
  not enforced configuration". On both, what must hold is a hook or a permission.
- A rule should be short. Cursor: "Keep rules under 500 lines". Claude Code: under 200.
- A file named in words is not loaded.
- A skill costs a description until it is used.

## 5. Not found in Cursor's documentation

The report lists sixteen. Those that bear on a definition:

- Whether an always-applied rule's description is sent with its body.
- What triggers a pattern-scoped rule: a read, an edit, an attachment, or a file open in the
  editor.
- Whether two skills of one name are both listed to the model.
- Any budget for the skill listing, or any limit on the total of always-applied rules.
- What happens to attached rules and loaded skill bodies when a conversation is summarised.
- Whether cloud agents read `CLAUDE.md`, load `.claude/skills/` or run Claude Code's hooks.

Each could be settled in a few minutes by someone with Cursor open on this repository. That is
the cheapest check of this file and this seat cannot make it.

## 6. What this cost, and the price of the rest

The sub-agent used 289,573 tokens, 52 tool calls and about eleven minutes for one platform. It
downloaded all 332 pages in Cursor's index to support its statements that something is not
documented.

Three platforms remain: Codex, Gemini and Copilot. At the same depth they would cost about
870,000 tokens, which is past the estate's line of about 500,000 for a fleet whose design is
reviewed before the owner prices it. They have not been launched. A narrower brief, holding to
the two questions that decided this file (what is in context at the start for each kind of
adapter, and which directories are read), would cost less; how much less is not known until
one is run.

## Limits

- One platform's documentation on one day, read by one sub-agent of this seat's model family.
- Nothing observed in Cursor. Section 1's three results are each a documented behaviour applied
  to this repository's files.
- The documentation is thin where it matters most. The report notes that `CLAUDE.md`,
  `.cursorrules` and user rule files appear only in a help centre, several facts only in
  release notes, and three pages describe rule types in ways that do not agree.
