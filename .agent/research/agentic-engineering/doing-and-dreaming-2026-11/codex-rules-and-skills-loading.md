# How Codex loads guidance and skills, and what that means here

Written 12 November 2026 by the seat Swift holds Aether (Claude Code cloud session `01Duocji`),
after the owner set the weight of each platform: "Claude Code is the main concern, Codex is the
secondary concern, every else is reasonable efforts only".

**What this is.** This seat's reading of a sub-agent's report on OpenAI's Codex documentation,
fetched that day and kept as returned in
[`codex-rules-and-skills-loading-report.md`](codex-rules-and-skills-loading-report.md). It is
the counterpart of
[`claude-code-rules-and-skills-loading.md`](claude-code-rules-and-skills-loading.md).

**Its standing.** Documentation only; nothing was observed in a running Codex. The sub-agent
read each page raw. This seat checked three facts about this repository against its files (the
fallback setting, the hook's matcher, the directories present) and did not re-fetch the pages.
Statements that join the documentation to this repository are inference and are marked.

## 1. Codex has no rules

This is the finding that matters most for a definition. Codex's only "rules" are
execution-policy files that allow or forbid commands. It has no mechanism that loads a rule's
text as guidance. What Codex puts in front of the model at the start is three things:

| What | From where | Limit |
| --- | --- | --- |
| The `AGENTS.md` chain | A global file, then one per directory from the repository root down to the working directory, joined root first | 32 KiB by default (`project_doc_max_bytes`). Unresolved: one vendor page says the limit is for all files together and files stop being added beyond it, and two describe it for each file |
| The skills listing: each skill's name, description and file path | `.agents/skills` from the working directory up to the root, the home and system equivalents, bundled skills, plugins | 2 % of the context window by default; descriptions are shortened first, then skills left out with a warning |
| What a session-start hook prints | The repository's hook configuration | None documented |

So the estate's 124 rules do not reach Codex as rules at all. No documented mechanism reads
`.agents/rules/`. Its 124 one-line pointers are files the model would have to go looking for.
*Inference:* on Codex a rule is delivered only through `AGENTS.md`, which here says to read
`AGENT.md` and to see the rules index, both in words, and a file named in words is not loaded.

## 2. Nothing is loaded twice

The owner's condition holds on Codex, by inference from the documentation. Codex reads
`.agents/skills` and no page says it reads `.claude/skills`, `.codex/skills`, `.claude/rules` or
`CLAUDE.md`. The same 87 skill names under `.claude/skills` are therefore not a second copy to
Codex. If two skills of one name were in directories Codex does read, both would be listed: it
"doesn't merge them".

## 3. What differs from Claude Code, and what is the same

| | Claude Code | Codex |
| --- | --- | --- |
| A rule's text in context at the start | Yes, if the adapter holds text; here it holds a pointer | No such mechanism. Only `AGENTS.md` |
| A rule delivered when a matching file is touched | Yes, by path scope | No |
| A skill | Name and description listed; body on use | The same, with the file path listed too |
| The listing's budget | 1 % of the window by default; this repository sets 3 % | 2 % by default, at most 10,000 tokens if set explicitly |
| A file named in words | Not loaded | Not loaded |
| Rules and skills | Advice | Advice |
| What is enforced | Hooks, permissions | The sandbox, approvals, execution policy; hooks can block and are "not a complete enforcement boundary" |

Two consequences for a system that must serve both.

1. **A skill is the one unit both platforms deliver the same way.** Name and description at the
   start, body when chosen or named. Anything that must work on both and is a procedure can be
   a skill and behave alike.
2. **Always-present text has two different homes.** On Claude Code it is a rule adapter that
   holds text. On Codex it is `AGENTS.md`, within 32 KiB. The 28 habit instructions are about
   6,900 characters as their descriptions state them, which fits. This is where copied text for
   each platform, which the owner has accepted, would go; nothing in the documentation makes
   Codex read the Claude copy as well.

## 4. Three things in this repository's Codex setup

Each is from the files, with the documentation's account of what they do.

- **`project_doc_fallback_filenames = ["RULES_INDEX.md"]` does nothing here.** *Inference:* a
  fallback name is used only in a directory that has no `AGENTS.md`, and the root has one. The
  rules index reaches Codex only through the sentence in `AGENTS.md` that says to see it.
- **The skills listing is at risk of being shortened.** The 87 descriptions come to about
  40,800 characters, which is about the size of the 10,000-token maximum and, on a smaller
  window, more than 2 % of it. Codex shortens descriptions first. A description is what selects
  a skill, so a shortened one is a weaker trigger.
- **The identity hook does not run again after a compaction.** Its matcher is
  `startup|resume`. The documentation says a session-start hook matching `compact` can put
  context back; this one does not match it.

## 5. Not found in the documentation

- What becomes of `AGENTS.md` and of loaded skill bodies after a compaction.
- Whether a sub-agent receives the `AGENTS.md` chain. It does inherit skills.
- Whether Codex in the cloud reads `.codex/` configuration, hooks, agents or `.agents/skills`.
  It does use the repository's `AGENTS.md`.
- Whether the 32 KiB limit is for all files together or for each; two pages differ.
- Any limit on one description's length.

## Cost and limits

- 134,842 tokens and 17 tool calls, on a brief of six questions. The Cursor pilot before it
  used 289,573 on eight.
- One platform's documentation on one day, read by one sub-agent of this seat's model family.
  Nothing observed in Codex. Someone with Codex open on this repository could check section 4
  in minutes, and whether the listing is in fact shortened.
- The `openai/codex` repository's own documentation files are stubs that point at the
  documentation site, so the site is the only source.
