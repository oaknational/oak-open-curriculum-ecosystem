# How Claude Code loads rules and skills, and what that means here

The owner asked on 12 November 2026 for a side question to be put to a sub-agent: "when it
comes to loading rules and skills into memory, what are the differences between rules and
skills, and are there important byte/context size thresholds that change loading or execution
behaviour. In this instance we only need information for Claude Code."

This file has two parts. Part 1 is this seat's reading of the answer against this repository,
with four measurements made for it. Part 2 is the sub-agent's report as it was returned, from
Anthropic's documentation fetched that day. The seat is Swift holds Aether (Claude Code cloud
session `01Duocji`).

## Part 1: what it means for this estate

**The standing of each statement.** The documentation quotations are the sub-agent's and carry
its own provenance marks: some pages it read raw, some came through a summarising fetch. This
seat did not re-fetch them. The measurements are this seat's, made in this repository on the
same day. Everything that joins the two is inference and is marked.

1. **Rules and skills differ in what the platform does for them, and this estate uses neither
   difference.** By the documentation, an unscoped rule's whole text is in context from the
   start and is put back after a compaction; a skill costs a name and a description until it
   is invoked, and its body is then re-attached after a compaction. Here, both arrive as a
   pointer. 103 of 124 rule adapters are one line, "Read and follow" and a path. The skill
   adapters are the same shape: the adapter for the consolidation skill is eight lines ending
   in "Read and follow" and the path of a 1,027-line canonical file. So in both cases the
   thing the platform protects is the pointer, and the real text reaches the model as an
   ordinary file it chose to read. *Inference:* that text then has the standing of any file
   read during the session, which the documentation says is summarised away at compaction
   except for the five most recently modified, each only if under 5,000 tokens.
2. **Thirteen canonical skills are over that 5,000-token mark, and one is over the size a
   single read returns.** Measured: the 78 canonical skill files hold 1,110,535 characters.
   Thirteen exceed 20,000 characters, which is about 5,000 tokens. The largest, the
   pull-request lifecycle skill, is 157,044 characters. The documentation gives the Read
   tool's default as at most 25,000 tokens a call, with a partial view beyond that.
   *Inference:* a session that opens that skill gets its first part and a notice, and has to
   ask for the rest.
3. **Seven rule files are over the same mark.** Three exceed 40,000 characters, which is the
   documented cut for a rule loaded on demand on a 200,000-token window. None of those three
   is path-scoped today, so the cut does not apply to them as they are delivered now; it would
   if their text were moved into a path-scoped adapter.
4. **The cheapest delivery the documentation offers is the one the rules sort pointed at.** An
   unscoped rule's text loads at launch and is re-injected after compaction. The 28
   habit-of-mind rules' own descriptions total 6,859 characters. Putting that text in the
   adapters in place of the pointer sentence would use the platform's mechanism as documented
   and cost about what the 103 pointers do, which total 6,780 characters. Whether it changes behaviour was then tested:
   [`habit-text-trial.md`](habit-text-trial.md). Measured there, the text added about 2,900
   tokens to a session that starts with about 39,300.
5. **An import is not a way round the size.** The documentation says an `@path` import loads
   the imported file with the file that imports it and saves no context. Importing the rule
   bodies would put about a million characters in front of every session.
6. **The documentation's own guidance is far below where the estate is.** It recommends under
   200 lines for a memory file and under 500 for a skill body, and says longer files "reduce
   adherence". Six canonical skills are over 500 lines.
7. **Two facts bear on the delivery trial's method.** A headless session loads rules and the
   skill listing as an interactive one does, unless run bare; and the documentation says bare
   "will become the default" for headless runs. A later repeat of the trial should state
   which it used.
8. **Claude Code documents no `.agents/skills` location; whether it reads one is not
   established.** The skills page's table of where skills live (fetched raw on 12 November
   2026) names none. `.claude/skills` holds 87 entries: 78 generated adapter directories and
   nine symbolic links to the skills installed from their vendors in `.agents/skills` and
   recorded in `skills-lock.json`. `.agents/skills` holds 87 directories: a second set of the
   78 adapters, generated with a different title, and those nine. Observed: each of the forty
   trial sessions listed the same 118 skills, all distinct
   ([`trial-evidence/README.md`](trial-evidence/README.md)). The list cannot tell whether
   Claude Code left `.agents/skills` unread or read both and listed one entry per name, as
   [`review-of-the-collection.md`](review-of-the-collection.md) says, and this note records
   nothing from the documentation on two skills of one name. Rules were not checked this way.

**What was not established.** How many characters the skill listing is allowed (the fraction is
documented, the conversion is not); the size of the combined warning limit for memory files;
whether a path-scoped skill's description is withheld from the listing. The sub-agent lists
these and the pages it read only in part.

## Part 2: the sub-agent's report, as returned

Returned by a sub-agent of the documentation-guide type on the Fable model, at the owner's
request for that model. One change was made to its text: a machine-local prefix on two
repository paths was removed. Its headings are lowered one level to sit under this one.

**Rules versus skills in Claude Code: loading behaviour and size thresholds (docs fetched 2026-11-12)**

### How to read this report

All quotes come from pages under `https://code.claude.com/docs/en/`, fetched today. Each source key below carries a provenance tag, because WebFetch passes page text through a small model:

- **[raw]**: the page text came back unmodified and I read or grepped it directly.
- **[relayed]**: the fetch model copied the passage out for me. The wording is probably exact but I did not see the raw page; re-check before quoting it onward.

| Key | Page | Provenance |
|---|---|---|
| MEM | `memory.md` | raw (whole page) |
| CTX | `context-window.md` | raw |
| SK | `skills.md` | raw from "Add supporting files" to the end; relayed for the frontmatter table and "Choose where skills load" |
| FO | `features-overview.md` | raw |
| HOW | `how-claude-code-works.md` | raw |
| HL | `headless.md` | raw |
| MC | `model-config.md` | raw (compaction sections) |
| TR | `tools-reference.md` | raw |
| ENV | `env-vars.md` | raw for the second half; relayed for the first half |
| SUB | `sub-agents.md` | relayed |
| SET | `settings-reference.md` | relayed |
| HK | `hooks.md` | relayed |

Local facts come from read-only inspection of `.claude/rules/` and `.claude/settings.json`.

### A. Rules and memory files

#### When each loads

- **Ancestor CLAUDE.md and CLAUDE.local.md load at launch; subdirectory ones load on demand.** "CLAUDE.md and CLAUDE.local.md files in the directory hierarchy above the working directory are loaded at launch. Files in subdirectories load on demand." (MEM)
- **Subdirectory trigger.** "Instead of loading them at launch, Claude Code loads each one once Claude reads, writes, or edits another file in that subdirectory. Reading includes viewing the file with a Bash command that [counts as a read] ..., such as `cat` or `head` on a single file." (MEM)
- **Order.** "All discovered files are concatenated into context rather than overriding each other. Across the directory tree, content is ordered from the filesystem root down to your working directory." and "Within each directory, `CLAUDE.local.md` is appended after `CLAUDE.md`". (MEM)
- **Scopes.** The location table is "in load order, from broadest scope to most specific": managed policy, user `~/.claude/CLAUDE.md`, project, local. (MEM)
- **Unscoped rules load at launch.** "Rules without [`paths` frontmatter] are loaded at launch with the same priority as `.claude/CLAUDE.md`." and "All `.md` files are discovered recursively". (MEM)
- **Rules in general.** "Rules load into context every session or when matching files are opened." (MEM)
- **`paths:` makes a rule on-demand.** "A path-scoped rule loads when Claude uses the Read, Write, or Edit tool on a matching file. It also loads when Claude views a matching file with a Bash command that [counts as a read]". (MEM)
- **Only `paths` is read from rule frontmatter.** "`paths` is the only field Claude Code reads from a rule; any other field is ignored without an error. Claude Code removes the frontmatter before loading the rule into context." (MEM)
- **Bad YAML makes the rule unscoped.** "If the YAML between the markers doesn't parse, Claude Code ignores the frontmatter and loads the rule as if it had no `paths`." (MEM)
- **`paths` expansion budget.** "a rule's whole `paths` list shares one budget of 1,000 expanded patterns and 4 MiB, and patterns without braces don't count against it." (MEM)
- **User rules.** "Claude Code loads user-level rules before project rules, so a project rule appears later in Claude's context than a user rule. Neither set overrides the other". (MEM)
- **Nested `.claude/rules/` directories** load on demand: the on-demand list includes "Rules files in a subdirectory's `.claude/rules/`". (MEM)
- **`--add-dir`.** "By default, CLAUDE.md files from these directories are not loaded." With `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` set, it loads "`.claude/rules/*.md` files except rules that set a [`paths` field]". (MEM)
- **Auto memory.** "The first 200 lines of `MEMORY.md`, or the first 25KB, whichever comes first, are loaded at the start of every conversation. Content beyond that threshold is not loaded at session start." (MEM)

#### Plain-text pointer versus `@path` import

- **Import.** "CLAUDE.md files can import additional files using `@path/to/import` syntax. Imported files are expanded and loaded into context alongside the CLAUDE.md that references them." (MEM)
- **Depth.** "Imported files can recursively import other files, with a maximum depth of four hops." (MEM)
- **Backticks suppress imports.** "Import parsing skips Markdown code spans and fenced code blocks. To mention a path in your CLAUDE.md without importing it, wrap it in backticks". (MEM)
- **Plain words do not load the file.** The only statement is in the AGENTS.md section: "**A `CLAUDE.md` that tells Claude in words to read `AGENTS.md`**: Claude sees `AGENTS.md` only if it decides to open the file. Delete the `CLAUDE.md` so Claude reads `AGENTS.md` directly, or replace the sentence with an `@AGENTS.md` import." (MEM)
- **Inference:** the same holds for "Read and follow `.agent/rules/x.md`" in a rule file. The docs do not say this about rule files specifically.
- **Whether `@path` imports work inside `.claude/rules/*.md`:** not stated outright. It is implied by "Each CLAUDE.md, rules file, and `@path` import counts as a separate file" and by the mention of imports in "`~/.claude/CLAUDE.md` and `~/.claude/rules/`". (MEM)
- **Imports do not save context.** "[Imports] help you organize a long file but don't reduce its context cost, because imported files load together with the CLAUDE.md that imports them." (MEM)

**This repository.** 103 of the 124 rule files are a single line of the form "Read and follow `.agent/rules/<name>.md`." The other 21 carry frontmatter. In my own session the one-line adapters were in context and the `.agent/rules/` targets were not. Two of the 21 frontmatter rules were injected mid-session, after a file operation, with their frontmatter stripped; that matches the documented on-demand behaviour. So each session pays for 103 pointer sentences, and the rule bodies reach the model only if it chooses to Read them. Swapping in an `@` import would need the path outside backticks, and would then load all the bodies at launch.

#### Size guidance and limits

- **Recommended length.** "**Size**: target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence." (MEM)
- **Hard skip for launch-loaded files.** "Claude gets the whole of each CLAUDE.md file that loads at launch, as long as the file is 4 MiB or smaller. Claude Code skips a file over 4 MiB and loads none of it." (MEM)
- **Warnings.** "If one of your instruction files is over the recommended length, you see a warning at startup and when you run `/status`. You also see a warning when files that are each within that length add up past a combined limit at session start. Each CLAUDE.md, rules file, and `@path` import counts as a separate file." (MEM)
  - The numeric value of the "combined limit": not found in the docs.
- **On-demand files are truncated.** "When a subdirectory `CLAUDE.md` or a rules file that loads on demand is over a per-file size limit, Claude receives only the start of it. That part ends with a note telling Claude to read the rest with the Read tool". (MEM)
  - "**200K context window**: 40,000 characters"
  - "**1M context window**: 200,000 characters on Claude Opus 4.6 and Claude Sonnet 4.6, and 150,000 characters on later models"
  - "Before v2.1.309, Claude Code didn't apply this limit to files that load on demand."
  - It applies to subdirectory CLAUDE.md files and their imports, rules in a subdirectory's `.claude/rules/`, and path-scoped rules.
- **HTML comments are free.** "Block-level HTML comments ... in CLAUDE.md files are stripped before the content is injected into Claude's context." (MEM)

#### After compaction

From the CTX table:

| Mechanism | After compaction |
|---|---|
| "Project-root CLAUDE.md and unscoped rules" | "Re-injected from disk" |
| "Rules with `paths:` frontmatter" | "Claude Code reloads them [on demand]" |
| "Nested CLAUDE.md in subdirectories" | "Claude Code reloads them [on demand]" |
| "Auto memory" | "Re-injected from disk" |

- "Path-scoped rules and nested CLAUDE.md files load into message history when Claude reads, writes, or edits their trigger file, so compaction summarizes them away with everything else. If a rule must persist across compaction, drop the `paths:` frontmatter or move it to the project-root CLAUDE.md." (CTX)
- **Inference:** a `.agent/rules/x.md` body that the model read with the Read tool is ordinary conversation content. It gets summarised, apart from "Claude Code re-reads up to five, most recently modified first", and "A file over 5,000 tokens comes back as a path reference without its content". (CTX)

#### Enforced or context

- "Claude treats them as context, not enforced configuration. To block an action regardless of what Claude decides, use a [PreToolUse hook] instead. The more specific and concise your instructions, the more consistently Claude follows them." (MEM)
- "CLAUDE.md content is delivered as a user message after the system prompt, not as part of the system prompt itself. Claude reads it and tries to follow it, but there's no guarantee of strict compliance". (MEM)
- "Files over 200 lines consume more context and may reduce adherence." (MEM)
- "if two instructions contradict each other, Claude may pick one arbitrarily." (MEM)
- "Settings rules are enforced by the client regardless of what Claude decides to do. CLAUDE.md instructions shape Claude's behavior but are not a hard enforcement layer." (MEM)

### B. Skills

#### What loads when

- **Start versus invocation.** "In a regular session, skill descriptions are loaded into context so Claude knows what's available, but full skill content only loads when invoked." (SK)
- **Per-request cost.** "For model-invocable skills, Claude sees names and descriptions in every request." (FO) and "Every skill in the [skill listing] adds to your context on every turn, whether or not Claude ever uses it." (SK)
- **Body.** "When you or Claude invoke a skill, the rendered `SKILL.md` content enters the conversation as a single message and stays there across later turns. ... Claude Code does not re-read the skill file on later turns". (SK)
- **Re-invocation.** "When Claude re-invokes a skill whose rendered content is identical to the copy already in context, Claude Code adds a short note that the skill is already loaded rather than a second copy". (SK)
- **Supporting files.** "This keeps `SKILL.md` focused on the essentials while letting Claude access detailed reference material only when needed." The docs' example tree annotates them "loaded when needed" and scripts "executed, not loaded". (SK)
- **Nested skill directories.** "Skills in a `.claude/skills/` directory below where you started don't load at startup. They load the first time Claude reads or edits a file in that subdirectory and stay available for the rest of the session." (SK, relayed)
- **Commands.** "A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way." (SK, relayed)
- **Plugin skills** are namespaced as `/plugin-name:skill-name` (SK, relayed), and "Plugin skills are not affected by `skillOverrides`." (SK)

#### Listing budget

- **Size and overflow order.** "The listing always contains every skill name, but if you have many skills, Claude Code drops some descriptions to fit the listing's character budget ... The budget scales at 1% of the model's context window. When the listing overflows, Claude Code drops descriptions starting with the skills you invoke least, so the skills you use most keep their full text." (SK)
- **Setting.** `skillListingBudgetFraction`: "**Type**: number, a fraction greater than `0` and at most `1`" and "**Default**: `0.01`, which reserves 1% of the context window". Also: "Claude Code keeps every skill's name but drops the descriptions of the least-used skills, so Claude can still invoke those skills but is less likely to choose one on its own." (SET)
- **Environment variable.** `SLASH_COMMAND_TOOL_CHAR_BUDGET`: "Override the character budget for skill metadata shown to the [Skill tool]. The budget scales dynamically at 1% of the context window, with a fallback of 8,000 characters. Legacy name kept for backwards compatibility". (ENV, raw)
- **How to raise it.** "set the [`skillListingBudgetFraction`] setting (for example, `0.02` = 2%) or the `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable to a fixed character count." (SK)
- **Per-description cap.** "each entry's combined text is capped at 1,536 characters regardless of budget. The cap is configurable with [`skillListingMaxDescChars`]." (SK) The setting's "**Default**: `1536`"; "longer text is cut at the cap." (SET)
- **Diagnostics.** "When the listing exceeds its budget, Claude Code also writes a warning to the debug log" and "The Skills row in `/context` reports the size of the listing after the budget is applied". (SK)
- **`skillOverrides` states.** `"on"` lists name and description, `"name-only"` lists the name only, `"user-invocable-only"` and `"off"` are hidden from Claude. (SK)
- **Not found:** how a percentage of a token window converts to a character count, and precedence when both the setting and the variable are set.

**This repository.** `.claude/settings.json` sets `"skillListingBudgetFraction": 0.03`, three times the default. Inference: the listing budget is then about three times larger on a 1M-context model than the same setting gives on a 200K one.

#### Body size and compaction

- **Recommended length.** "Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files." (SK) A hard limit on SKILL.md size: not found.
- **Re-attachment.** "When the conversation is summarized to free context, Claude Code re-attaches the most recent invocation of each skill after the summary, keeping the first 5,000 tokens of each. Re-attached skills share a combined budget of 25,000 tokens. Claude Code fills this budget starting from the most recently invoked skill, so older skills can be dropped entirely". (SK)
- **Same caps in the compaction table.** "Invoked skill bodies | Re-injected, capped at 5,000 tokens per skill and 25,000 tokens total; oldest dropped first". (CTX)
- **Truncation direction.** "Truncation keeps the start of the file, so put the most important instructions near the top of `SKILL.md`." (CTX)
- **Listing after compaction.** "Skill descriptions | Rebuilt from your current [skills] and re-injected. Requires Claude Code v2.1.304 or later". (CTX)
- **Scaling.** The docs do not say the 5,000 and 25,000 caps scale with window size.

#### Frontmatter that changes loading or execution

All rows are from SK. The frontmatter table rows are relayed; the invocation table is raw.

- **`disable-model-invocation`.** Table row: "`disable-model-invocation: true` | Yes | Not on its own | Description not in context, full skill loads when invoked". Also "Also prevents the skill from being [preloaded into subagents]". "If Claude tries anyway, Claude Code blocks the call".
- **`user-invocable: false`.** "| No | Yes | Description always in context, full skill loads when invoked".
- **`paths`.** "When set, Claude loads the skill automatically only when working with files matching the patterns. Patterns are relative to Claude's current working directory, and files outside that directory don't match." Whether a `paths` skill's description stays out of the listing until a match: not found.
- **`context: fork`.** "Claude Code starts a new subagent of the type set in the `agent` field and gives it the skill content as its prompt. The subagent doesn't see your conversation history". It runs in the background by default; Claude Code waits for the result "In non-interactive mode, with the `-p` flag or the Agent SDK".
- **`allowed-tools`.** "grants permission for the listed tools during the turn that invokes the skill ... The grant clears when you send your next message ... It does not restrict which tools are available".
- **`model`.** "The override applies for the rest of the current turn and isn't saved to settings." With `context: fork` it sets the forked subagent's model.
- **`hooks`.** "Hooks that Claude Code registers when the skill is invoked and keeps running for the rest of the session."
  - Limit: "The skills from one source can register at most 1,024 hooks. Those hooks' matchers can total at most 16,384 characters." (HK, v2.1.304 or later)

#### User slash invocation versus the model's Skill tool

- **Same content either way.** "When you or Claude invoke a skill, the rendered `SKILL.md` content enters the conversation as a single message". (SK)
- **Position matters for the user.** "`/deploy staging` | Claude Code runs the skill directly", whereas after plain text "Nothing runs directly. The name counts as your permission for that message". (SK)
- **Permission rules apply to Claude's calls.** "`Skill(name)` for exact match, `Skill(name *)` for prefix match with any arguments"; "Disable all skills by denying the Skill tool". (SK)
- **Built-ins.** "A few built-in commands are also available through the Skill tool, including `/init` and `/security-review`. Other built-in commands such as `/compact` are not." (SK)
- **Stacking.** "Claude Code expands the first skill plus up to five more stacked after it." and "Through the Agent SDK or `claude -p`, Claude Code loads only the first skill". (SK)
- **Not found:** any size or truncation difference between the two paths.

### C. Thresholds tied to context-window size or usage

| Threshold | 200K window | 1M window | Source |
|---|---|---|---|
| On-demand rule or nested CLAUDE.md, per file | 40,000 characters | 200,000 (Opus 4.6, Sonnet 4.6); 150,000 (later models) | MEM |
| Skill listing budget | 1% of window by default | same fraction, larger absolute | SK, SET |
| Auto-compaction | "Sonnet 4.6 and Opus 4.6 without [extended context] compact at the 200K boundary" | "Models running with a native 1M window compact before the window fills, at about 967K tokens by default." | MC |

- **Compaction default.** "If you don't set an auto-compact window, Claude Code compacts when the conversation reaches the model's context limit, except in these sessions". (MC)
- **Compaction overrides.** `autoCompactWindow` takes "number of tokens, from `100000` to `1000000`" (SET). `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` "can't raise the threshold" (ENV, relayed). `DISABLE_AUTO_COMPACT` and `DISABLE_COMPACT` also exist (ENV, raw).
- **Idle compaction.** On by default once "the conversation's context has reached the token threshold, which you can [change] from its default of 200,000" and "about an hour has passed since the last request". (SET)
- **Unrecognised model ID.** Claude Code "assumes 200K tokens". (MC)
- **Fixed limits that do not vary with window:**
  - Launch-loaded memory file: 4 MiB. (MEM)
  - MEMORY.md: 200 lines or 25KB. (MEM)
  - Description cap: 1,536 characters. (SK)
  - Post-compaction skill caps: 5,000 and 25,000 tokens. (SK, CTX)
  - Post-compaction file restore: five files, 5,000 tokens each. (CTX)
- **Read tool.** "By default one call returns at most 25,000 tokens, or the value you set in [`CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS`], and refuses a whole file over 256 KB, so Claude reads a larger file in pages with `offset` and `limit`. On Claude Code v2.1.296 or later it can instead read the whole file ... by setting `allow_large: true` ... That read is sized against the room left in the session's [context window]". (TR)
  - Over the limit: "**Whole file over the token limit**: the first page of the file, with a `PARTIAL view` notice"; "**Whole file over 256 KB ...**: an error". (TR)
  - Inference: a pointer-target rule file over 25,000 tokens arrives partially on the first Read.
- **Bash output.** "Inline up to roughly 30,000 characters by default; past that, the path of a file saved to the session directory ..., plus a preview of up to the first 2,000 characters". (TR)
- **Usage or plan level.** The only plan-dependent item found is access to the 1M window (MC, "Extended context"). No loading behaviour keyed to usage level was found.

### D. Sub-agents and headless sessions

#### Sub-agents (all SUB, relayed, unless marked)

- **Fresh context.** "Each subagent starts with a fresh, isolated context window. It doesn't see your conversation history, the skills you've already invoked, or the files Claude has already read."
- **CLAUDE.md and rules.** "**CLAUDE.md files**: every level of the [CLAUDE.md hierarchy] the main conversation loads, including `~/.claude/CLAUDE.md`, project rules, `CLAUDE.local.md`, managed policy files ... The built-in Explore and Plan agents skip this."
- **`omitClaudeMd`.** "For Explore, Plan, and subagents with `omitClaudeMd`, a subdirectory's `CLAUDE.md` and matching [path-scoped rules] still [load] when the subagent works with files there."
- **System prompt.** "the agent's own prompt plus environment details that Claude Code appends, not the Claude Code system prompt."
- **Skills.** "The full content of each listed skill is injected into the subagent's context at startup, up to the first 32 distinct names in the list. ... without it, the subagent can still discover and invoke project, user, and plugin skills through the Skill tool during execution."
- **Not preloadable.** "You can't preload skills that set [`disable-model-invocation: true`]".
- **Not inherited.** "the main conversation's [auto memory] isn't loaded"; "a subagent's context window is sized by its own model, not the parent's."
- **Fork exception.** "For a [fork], Claude Code loads the parent's conversation so far, system prompt, and tools instead." (FO, raw)
- **Not found:** whether a non-fork subagent gets the same budgeted skill listing as the main session.

#### Headless

- **Default `-p`.** "Without it, `claude -p` discovers and loads them as an interactive session would, including anything configured in the working directory or `~/.claude`." (HL)
- **`--bare`.** "skipping auto-discovery of hooks, skills, custom commands, [subagents], installed plugins, MCP servers, auto memory, and CLAUDE.md." (HL)
- **Bare mode drops the listing.** "it doesn't get the list of available skills, including skills from an `--add-dir` folder." (HL)
- **Future default.** "`--bare` is the recommended mode for scripted and SDK calls, and will become the default for `-p` in a future release." (HL)
- **Skills in `-p`.** "User-invoked [skills] and custom commands work. Include `/skill-name` in the prompt string and Claude Code expands it before running." (HL)
- **Trust.** "Claude Code applies a project skill's `allowed-tools` even in a `-p` run in a folder you've never trusted." (SK)
- **`--setting-sources`.** "Project rules are skipped if you exclude `project` from [`--setting-sources`]." (MEM)
- **Not found:** an explicit statement on whether path-scoped rules behave identically in `-p`.

### E. Comparison

| | Rules (`.claude/rules/*.md`, CLAUDE.md) | Skills (`SKILL.md`) |
|---|---|---|
| Trigger | Unscoped: launch. `paths:`: a Read, Write, Edit or read-like Bash on a matching file. Nested: a file touched in that subdirectory. (MEM) | Listing at session start; body when the user types `/name` or Claude matches the description; `paths` narrows automatic loading. (SK) |
| In context at session start | Full text of every unscoped rule, ancestor CLAUDE.md and their `@` imports. (MEM) | Names and descriptions only, within the budget; nothing for `disable-model-invocation: true`. (SK, FO) |
| Cost when unused | "Every request" (FO). Path-scoped rules cost nothing until matched. | "Low (descriptions every request)"; "User-only skills have zero cost until invoked." (FO) |
| Who decides the moment | The harness, by file-path events. No model judgment for imports or scoped rules; a plain-text pointer leaves it to the model. (MEM) | The user (`/name`) or the model (description match), gated by frontmatter and `Skill(...)` permission rules. (SK) |
| Size limits | 200 lines recommended; warnings past the recommended and combined lengths; 4 MiB skip at launch; on-demand files cut at 40,000, 150,000 or 200,000 characters by window; import depth four hops. (MEM) | 500 lines recommended for the body; 1,536 characters per description; listing 1% of window by default; after compaction 5,000 tokens per skill and 25,000 total. (SK, CTX) |
| After compaction | Unscoped rules and root CLAUDE.md re-injected from disk; scoped and nested ones summarised away until re-triggered. (CTX) | Listing rebuilt (v2.1.304 or later); invoked bodies re-attached, truncated from the start, oldest dropped. (CTX) |
| Enforcement | "context, not enforced configuration" (MEM) | "a request, not a guarantee" (FO); skill `hooks` are the enforced part. (SK, HK) |

### Not found or not verified

- **Not found in the docs:**
  - The numeric "combined limit" behind the startup memory-size warning, and an explicit number for the "recommended length" that warning uses.
  - A hard cap on SKILL.md size.
  - How 1% of a token window converts to the listing's character budget, and precedence between `skillListingBudgetFraction` and `SLASH_COMMAND_TOOL_CHAR_BUDGET`.
  - Whether a `paths` skill's description is withheld from the listing.
  - Whether non-fork subagents get the budgeted skill listing.
  - Whether `@` imports are formally supported inside rule files (only implied).
  - Any loading behaviour keyed to usage level.
- **Inference rather than doc statement:** that a plain-text "Read and follow" line in a rule file behaves like the AGENTS.md case. My own session's context agrees with it.
- **Prior researcher's notes** (`.agent/research/agentic-engineering/attendant-research-working/external-sources.md`): the six `memory.md` and five `skills.md` sentences match the raw pages verbatim. The two `sub-agents.md` sentences match the relayed text. I did not re-check the `workflows.md`, `scheduled-tasks.md` or `cloud-environments.md` sentences.
- **Fetch gaps:**
  - `sub-agents.md`: the last ~17K characters, including "Subagent auto-compact window" and the body of "Fork the current conversation", were not read.
  - `hooks.md`: only the first 100K characters were read; the `InstructionsLoaded` section was not reached.
  - `env-vars.md`: the `MAX_MCP_OUTPUT_TOKENS` row was not retrieved.
  - `skills.md`: one fetch of the first portion returned a summary instead of quotes, so the frontmatter rows rest on a single relayed pass.
- No page failed to fetch outright.

Sources: https://code.claude.com/docs/en/memory.md, https://code.claude.com/docs/en/skills.md, https://code.claude.com/docs/en/context-window.md, https://code.claude.com/docs/en/features-overview.md, https://code.claude.com/docs/en/how-claude-code-works.md, https://code.claude.com/docs/en/headless.md, https://code.claude.com/docs/en/model-config.md, https://code.claude.com/docs/en/tools-reference.md, https://code.claude.com/docs/en/env-vars.md, https://code.claude.com/docs/en/sub-agents.md, https://code.claude.com/docs/en/settings-reference.md, https://code.claude.com/docs/en/hooks.md
