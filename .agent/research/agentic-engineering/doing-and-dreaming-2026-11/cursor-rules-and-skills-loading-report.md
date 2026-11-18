# Cursor: how rules, skills and instruction files reach the model

**What this file is.** A sub-agent's report, as it was returned on 12 November 2026 to the seat
Swift holds Aether (Claude Code cloud session `01Duocji`). The seat's reading of it is in
[`cursor-rules-and-skills-loading.md`](cursor-rules-and-skills-loading.md). Three changes were
made to the returned text: a machine-local prefix was removed from three repository paths, one
code block was given a language, and the file was passed through the repository's formatter.
"My wording" below is the sub-agent's.

Fetched 2026-11-12. Authority: Cursor's own pages on `cursor.com` only.

Conventions used in this report:

- Every verbatim quotation is wrapped in curly quotes “…” and is followed by its source key. Text outside curly quotes is my wording.
- Provenance: every quotation here is **[raw]**. Each page was fetched with `curl -sL <url>` and the returned text read directly; no fetch tool or summarising model sat between the page and this report. Docs pages serve markdown when `.md` is appended to the URL. S31 and S32 are HTML pages with tags stripped by a local script (marked **[raw, tags stripped]**).
- Markdown table rows are quoted with cell padding collapsed to single spaces; nothing else is altered.
- Each quotation was machine-checked against the saved raw page after this report was written (whitespace-normalised substring match).
- `https://cursor.com/docs/context/rules` answers 200 after redirecting to `https://cursor.com/docs/rules`. `https://docs.cursor.com/context/rules` redirects to the docs landing page `https://cursor.com/docs`. The HTML of the rules page was compared with its `.md` rendering for the load-bearing sentences; they match.
- Coverage for "not found" claims: all 332 `docs/`, `help/` and `learn/` pages listed in `https://cursor.com/llms.txt` were downloaded and full-text searched, plus four reference pages that the index omits (S5, S20, S22 and the ignore-file reference).

## Source table

| Key | Page | URL | Provenance |
| :-- | :--- | :-- | :--------- |
| S1 | Rules | https://cursor.com/docs/rules.md | raw |
| S2 | Agent Skills | https://cursor.com/docs/skills.md | raw |
| S3 | Subagents | https://cursor.com/docs/subagents.md | raw |
| S4 | Hooks | https://cursor.com/docs/hooks.md | raw |
| S5 | Third Party Hooks | https://cursor.com/docs/reference/third-party-hooks.md | raw |
| S6 | Prompting agents | https://cursor.com/docs/agent/prompting.md | raw |
| S7 | Cursor Agent (overview) | https://cursor.com/docs/agent/overview.md | raw |
| S8 | Using Agent in CLI | https://cursor.com/docs/cli/using.md | raw |
| S9 | CLI changelog | https://cursor.com/docs/cli/changelog.md | raw |
| S10 | Release notes | https://cursor.com/docs/release-notes.md | raw |
| S11 | CLI Permissions | https://cursor.com/docs/cli/reference/permissions.md | raw |
| S12 | CLI Configuration | https://cursor.com/docs/cli/reference/configuration.md | raw |
| S13 | CLI Slash commands | https://cursor.com/docs/cli/reference/slash-commands.md | raw |
| S14 | Cloud Agents | https://cursor.com/docs/cloud-agent.md | raw |
| S15 | Cloud agent setup | https://cursor.com/docs/cloud-agent/setup.md | raw |
| S16 | Cloud agent best practices | https://cursor.com/docs/cloud-agent/best-practices.md | raw |
| S17 | Self-hosted pool | https://cursor.com/docs/cloud-agent/self-hosted/pool.md | raw |
| S18 | Run Modes | https://cursor.com/docs/agent/security/run-modes.md | raw |
| S19 | Agent Security | https://cursor.com/docs/agent/security.md | raw |
| S20 | permissions.json reference | https://cursor.com/docs/reference/permissions.md | raw |
| S21 | LLM safety and controls (Enterprise) | https://cursor.com/docs/enterprise/llm-safety-and-controls.md | raw |
| S22 | Plugins reference | https://cursor.com/docs/reference/plugins.md | raw |
| S23 | Plugins | https://cursor.com/docs/plugins.md | raw |
| S24 | Customize Cursor | https://cursor.com/docs/customize-cursor.md | raw |
| S25 | TypeScript SDK | https://cursor.com/docs/sdk/typescript.md | raw |
| S26 | Help centre: Rules | https://cursor.com/help/customization/rules.md | raw |
| S27 | Help centre: Skills | https://cursor.com/help/customization/skills.md | raw |
| S28 | Learn: Customizing agents | https://cursor.com/learn/customizing-agents.md | raw |
| S29 | Bugbot | https://cursor.com/docs/bugbot.md | raw |
| S30 | Deeplinks | https://cursor.com/docs/reference/deeplinks.md | raw |
| S31 | Changelog 1.6 | https://cursor.com/changelog/1-6 | raw, tags stripped |
| S32 | Changelog 2.4 (linked from S2's "in 2.4") | https://cursor.com/changelog/2-4 | raw, tags stripped |
| S33 | Docs index for agents | https://cursor.com/llms.txt | raw |
| S34 | Help centre: Cloud Agents | https://cursor.com/help/ai-features/cloud-agents.md | raw |
| S35 | Using Headless CLI | https://cursor.com/docs/cli/headless.md | raw |

S26, S27, S34 are help-centre pages (`cursor.com/help`), S28 is a course page (`cursor.com/learn`); all are Cursor's own and all are listed in Cursor's docs index (S33). Several facts below exist only there and not in the reference docs; each such case is flagged.

Read in full but not quoted below, because they add nothing beyond the quoted pages: S12 (CLI config file locations, same as S11), S24 (component overview), S32 (skills launch note). S29 is relevant in one respect only: “Cursor [project rules](https://cursor.com/docs/rules.md) (`*.mdc` files in `.cursor/rules/`) do not apply to Bugbot runs.” (S29)

---

## 1. Rule files

### Locations and format

- Project rules are `.mdc` files under `.cursor/rules`. “Project rules live in `.cursor/rules` as `.mdc` files and are version-controlled. They are scoped using path patterns, invoked manually, or included based on relevance.” (S1)
- A `.md` file there is ignored. “Project rules must use the `.mdc` extension. A plain `.md` file in `.cursor/rules` is ignored by the rules system because it has no frontmatter to specify `description`, `globs`, and `alwaysApply`.” (S1)
- Subfolders inside `.cursor/rules` are supported (S1 shows `frontend/components.mdc` with the comment “# Organize rules in folders”). The help centre adds: “Cursor discovers rules by scanning this folder, so nested subfolders work but a flat structure is simpler and easier to manage.” (S26)
- `.cursor/rules` directories in project subdirectories are also discovered. The rules page does not describe this; the CLI changelog does: “**Nested rules and skills.** `.cursor/rules` and `.cursor/skills` in subdirectories are discovered everywhere, matching the IDE.” (S9, entry "May 14, 2026")
- Four rule kinds are named: “Cursor supports four types of rules:” followed by Project Rules, User Rules, Team Rules, AGENTS.md (S1).
- User rules: “User Rules are global preferences defined in **Customize → Rules** that apply across all projects. They are used by Agent (Chat)” (S1). Help centre only: “**User rule files** in `~/.cursor/rules` (Windows: `%USERPROFILE%\.cursor\rules`) stay on the machine and do not sync.” (S26)
- Team rules: “**Content**: Team Rules are free‑form text. They do not use the folder structure of Project Rules.” (S1). “**Glob patterns**: Team Rules support glob patterns for file-scoped application. When a glob pattern is set (e.g., `**/*.py`), the rule only applies when matching files are in context. Rules without a glob pattern apply to every conversation.” (S1)
- Precedence: “**Precedence**: Rules are applied in this order: **Team Rules → Project Rules → User Rules**. All applicable rules are merged; earlier sources take precedence when guidance conflicts.” (S1)
- Plugin rules use the same three fields but a wider extension set: “| Rules | `rules/` | All `.md`, `.mdc`, or `.markdown` files |” (S22).

### Frontmatter fields

- Only three fields are documented: `description`, `globs`, `alwaysApply`. “Control how rules are applied from the type dropdown which changes properties `description`, `globs`, `alwaysApply`.” (S1). No other rule frontmatter field appears on any page searched.
- `globs` is a comma-separated string: “Use `globs` to scope a rule to specific files or directories. Separate multiple patterns with commas.” (S1). The plugin reference types it as “string or array” (S22).
- Role of frontmatter versus body: “The frontmatter metadata is used to control how the rule is applied. The content is the rule itself.” (S1)

### The four types (the documented decision table)

“Under the hood, the three frontmatter fields interact to determine when a rule is included:” (S1)

| `alwaysApply` | `description` | `globs` | Behaviour, verbatim (S1) |
| :-- | :-- | :-- | :-- |
| `true` | — | — | “Always included. Globs and description are ignored.” |
| `false` | — | provided | “Auto-attached when a matching file is in context.” |
| `false` | provided | omitted | “Agent reads the description and pulls the rule in when relevant.” |
| `false` | omitted | omitted | “Included only when you `@`-mention the rule in chat.” |

UI names for the same four (S1): “| `Always Apply` | Apply to every chat session |”, “| `Apply Intelligently` | When Agent decides it's relevant based on description |”, “| `Apply to Specific Files` | When file matches a specified pattern |”, “| `Apply Manually` | When @-mentioned in chat (e.g., `@my-rule`) |”.

### What is placed in context, per type

- **General.** “When applied, rule contents are included at the start of the model context.” (S1). “Rule content reaches Agent as written.” (S1)
- **Always Apply (`alwaysApply: true`).** Included in every chat session; the description is not what selects it. “If alwaysApply is true, the rule will be applied to every chat session. Otherwise, the description of the rule will be presented to the Cursor Agent to decide if it should be applied.” (S1). “Always included. Globs and description are ignored.” (S1). Elsewhere: “[`alwaysApply: true`](https://cursor.com/docs/rules.md#rule-anatomy) includes the rule in every request.” (S17)
  - **Sub-question, description text for always-applied rules.** The docs present the description to the Agent only in the non-always case (first quotation above), call the description “ignored” when `alwaysApply` is `true`, and define “The content is the rule itself.” (S1). Cursor's own always-apply examples carry no `description` at all (S1 "Always applied" example; S17 worker example). No page states in so many words whether the description string is or is not emitted next to the body for an always-applied rule. See "Inference".
- **Apply to Specific Files (`alwaysApply: false` + `globs`).** The body is attached when a matching file is “in context”. The only trigger wording for project rules is “Auto-attached when a matching file is in context.” (S1) and, in the FAQ, “For `Apply to Specific Files`, ensure the file pattern matches referenced files.” (S1). For team rules with a pattern, the release notes are more specific: “They now apply when the agent reads a matching file or you add one to context, so unrelated chats no longer spend tokens on them.” (S10, 3.21) and “A team rule scoped to a pattern such as `*.py` now applies only when the agent reads a matching file.” (S10, v2026.09.15). For project glob rules the docs do not enumerate read versus edit versus attach versus open-in-editor; the one related entry says glob-scoped rules were unchanged when an edit trigger was added for nested files: “Each rule is shown once per conversation, and glob-scoped and root rules behave as before.” (S10, v2026.10.22)
- **Apply Intelligently (`alwaysApply: false` + `description`, no `globs`).** The model sees the description and fetches the rule. “Agent reads the description and pulls the rule in when relevant.” (S1). The Agent has a tool for it: “### Fetch Rules” … “Retrieve specific [rules](https://cursor.com/docs/rules.md) based on type and description.” (S7). In the Customize UI these sit under “Agent Decides” (S23: “Toggle individual rules between **Always**, **Agent Decides**, and **Manual** modes.”).
- **Apply Manually (no description, no globs, `alwaysApply: false`).** Nothing reaches the model until the user mentions it: “Included only when you `@`-mention the rule in chat.” (S1)
- **Nested always-apply rules and nested `AGENTS.md`.** Loaded when the agent works in that directory, and since v2026.10.22 also on edit: “When the agent edits or creates a file in a subdirectory, it now sees that directory's [`AGENTS.md`](https://cursor.com/docs/rules.md#agentsmd) and nested always-apply rules, even if it never read a file there first. Each rule is shown once per conversation, and glob-scoped and root rules behave as before.” (S10, v2026.10.22; same entry in S9)
- Rules affect the Agent only: “No. Rules do not impact Cursor Tab or other AI features.” (S1); “They do not apply to Tab completion or [Bugbot](https://cursor.com/docs/bugbot.md#rules) PR reviews.” (S26)

### Thin or inconsistent documentation on this question

- The combination this repository uses 21 times (`alwaysApply: false` + `description` + `globs`) has no dedicated row. The table's second row marks `description` as “—” (irrelevant) when `globs` is provided, so the documented behaviour is glob auto-attach; whether the description is also offered to the Agent for fetching is not stated.
- The course page flattens all rules into always-on: “[Rules](https://cursor.com/docs/rules.md) are markdown files stored in `.cursor/rules/` that the agent sees at the start of every conversation.” (S28). That contradicts the four-type table in S1; S1 is the reference page.
- The plugin reference describes `alwaysApply: false` differently again: “If `true`, rule applies to all files. If `false`, rule is available on request.” (S22)

---

## 2. Other instruction files, and every location Cursor loads from

### `AGENTS.md`

- “`AGENTS.md` is a simple markdown file for defining agent instructions. Place it in your project root as an alternative to `.cursor/rules` for straightforward use cases.” (S1)
- “Cursor supports AGENTS.md in the project root and subdirectories.” (S1)
- Nested: “You can place `AGENTS.md` files in any subdirectory of your project, and they will be automatically applied when working with files in that directory or its children.” (S1). “Instructions from nested `AGENTS.md` files are combined with parent directories, with more specific instructions taking precedence.” (S1)
- No frontmatter: “Unlike Project Rules, `AGENTS.md` is a plain markdown file without metadata or complex configurations.” (S1)

### `CLAUDE.md`

- Not mentioned on the Rules reference page (S1). Stated in the help centre and the CLI page.
- “Cursor reads `CLAUDE.md` files the same way it reads `AGENTS.md`. Place a `CLAUDE.md` file in your project root and Cursor picks it up automatically.” (S26)
- “`CLAUDE.md` files are always applied to every conversation, regardless of any `alwaysApply` frontmatter setting. This ensures compatibility with projects that also use Claude Code.” (S26)
- CLI: “The CLI also reads `AGENTS.md` and `CLAUDE.md` at the project root (if present) and applies them as rules alongside `.cursor/rules`.” (S8, line break in source collapsed)
- De-duplication between the two files is by identity or identical content only: “**Agent no longer gets duplicate project instructions.** When `CLAUDE.md` is a symlink, hard link, or identical copy of `AGENTS.md`, the agent now receives those instructions once instead of twice.” (S10, 3.26). An earlier entry: “agents no longer get duplicate AGENTS.md or CLAUDE.md instructions” (S10). Two different files are therefore both loaded.

### `.cursorrules`

- Only the help centre mentions it: “The `.cursorrules` file in your project root is legacy and will be deprecated.” (S26). The migration step implies its behaviour: “Set the rule type to **Always Apply** (this matches the old behavior)” (S26). No reference-docs page mentions `.cursorrules`.

### Other vendors' directories

| Location | Does Cursor load it? | Evidence |
| :-- | :-- | :-- |
| `.claude/skills/`, `~/.claude/skills/` | Yes | “For compatibility, Cursor also loads skills from Claude and Codex directories: `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, and `~/.codex/skills/`.” (S2) |
| `.codex/skills/`, `~/.codex/skills/` | Yes | same sentence (S2) |
| `.agents/skills/`, `~/.agents/skills/` | Yes, as a first-class location | “| `.agents/skills/` | Project-level |” (S2) |
| `.claude/agents/`, `.codex/agents/` and `~/` equivalents | Yes, as subagents | “| | `.claude/agents/` | Current project only (Claude compatibility) |” (S3) |
| `.claude/settings.json`, `.claude/settings.local.json`, `~/.claude/settings.json` | Yes, the `hooks` in them | “Cursor can load and execute hooks configured for Claude Code, allowing you to use the same hook scripts across both tools.” (S5) |
| Claude Code plugins | Yes in the CLI | “Plugins imported from Claude Code appear alongside native ones.” (S9, "May 7, 2026") |
| `.claude/rules/` | Not found in the docs | zero matches across all pages searched |
| `.claude/commands/` | Not found in the docs | zero matches across all pages searched |
| Any Codex or `.agents` rules file other than `AGENTS.md` | Not found in the docs | zero matches |

- The Claude Code hook import is gated by a setting that is on by default: “Claude Code hooks load when **Include Third-Party Plugins, Skills, and Other Configs** is enabled in Cursor Settings → Agents → Third-Party Imports. The setting is on by default.” (S5). The setting's name covers skills and plugins, but only the hooks page documents it; the skills page does not say `.claude/skills` loading depends on it.

### Full list of locations from which Cursor loads rules, instructions or skills

Rules and always-on instructions:

1. `.cursor/rules/**/*.mdc` at the project root, including subfolders (S1, S26).
2. `.cursor/rules` inside project subdirectories (S9; "nested always-apply rules" in S10).
3. User Rules in Customize → Rules, stored on the account (S1, S26).
4. `~/.cursor/rules` user rule files (S26 only).
5. Team Rules from the dashboard (S1).
6. `AGENTS.md` at the root and in subdirectories (S1).
7. `CLAUDE.md` (S26, S8).
8. `.cursorrules` at the root, legacy (S26 only).
9. `rules/` inside installed plugins (S22).
10. `additional_context` returned by a `sessionStart` hook: “Additional context to add to the conversation's initial system context” (S4).

Skills (all from S2 unless marked):

11. `.agents/skills/` and `.cursor/skills/` at the project root.
12. `.agents/skills/` or `.cursor/skills/` in any project subdirectory: “A `.cursor/skills/` (or `.agents/skills/`) folder anywhere inside your repository is picked up” (S2).
13. `~/.agents/skills/` and `~/.cursor/skills/`.
14. `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, `~/.codex/skills/`.
15. Skills from installed plugins and the team marketplace (S23), and Cursor's built-in skills: “Cursor includes a small set of built in skills to improve your general workflows.” (S2)

Related, not asked but on the same double-loading surface:

16. Subagents: `.cursor/agents/`, `.claude/agents/`, `.codex/agents/` and the three `~/` equivalents (S3).
17. Commands: `.cursor/commands/` (“custom commands defined in your `.cursor/commands` directory”, S30; “Commands are stored in .cursor/commands/[command].md .”, S31), plus user-level, team and plugin commands (S2, S21, S22). There is no dedicated commands page; the old commands URLs redirect to the help page section on migrating commands to skills.
18. Hooks: enterprise path, team dashboard, `.cursor/hooks.json`, `~/.cursor/hooks.json`, plugins, then the three Claude settings files (S4, S5).

### Same name in two places

- **Skills: no precedence or de-duplication rule is documented.** The only statement found shows that same-named skills are kept as separate entries: “Skills that share a name show as separate rows in the / menu instead of collapsing into one” (S10, 3.25). Which copy the model is offered, or whether both descriptions are listed to the model, is not stated anywhere.
- **Subagents: documented.** “Project subagents take precedence when names conflict. When multiple locations contain subagents with the same name, `.cursor/` takes precedence over `.claude/` or `.codex/`.” (S3)
- **Rules: both apply.** “Cursor identifies rules by their full file path, not their name alone. Two rules with the same filename in different folders both apply if their conditions match. There are no conflicts or overrides based on filename.” (S26)
- **`AGENTS.md` and `CLAUDE.md`:** delivered once only when one is a symlink, hard link or identical copy of the other (S10, 3.26, quoted above).
- **Hooks:** “All matching hooks from every source run.” (S5)

---

## 3. Skills

- **Discovery.** “When Cursor starts, it automatically discovers skills from skill directories and makes them available to Agent. The agent is presented with available skills and decides when they are relevant based on context.” (S2). Discovery is recursive: “Cursor walks the skills root recursively and picks up any `SKILL.md` it finds” (S2). Hidden directories below a skills root are skipped: “Skill and subagent scans no longer descend into hidden dot-directories” (S9, v2026.08.11). Symlinked directories are followed: “The skills menu follows symlinked directories when discovering skills.” (S9)
- **What is in context at session start.** Descriptions. The context breakdown defines the Skills category as “**Skills**: skill descriptions injected into the system context” (S6). The `description` field is “Used by the agent to determine relevance.” (S2). No page says in so many words that the name is listed beside the description; `name` is documented as the “Skill identifier” (S2).
- **What loads the body.** Either the model deciding the skill is relevant, or the user invoking it. “By default, skills are automatically applied when the agent determines they are relevant.” (S2). “Type `/` followed by the skill name in chat to run it (e.g., `/write-tests`), or type `@` and select it to attach as context. Agent reads the skill file and follows the instructions.” (S27). Supporting files load later still: “| `references/` | Additional documentation loaded on demand |” (S2); “agents load resources progressively—only when needed” (S2).
- **A `/`-invoked skill is attached to one message.** “A skill invoked this way attaches to one message. To keep a skill on for the whole session, use it as a Custom Mode” (S2).
- **Frontmatter that changes loading.**
  - `disable-model-invocation`: “When `true`, the skill is only included when explicitly invoked via `/skill-name`. The agent will not automatically apply it based on context.” (S2)
  - `paths` (legacy `globs` accepted): “When set, the skill is only surfaced when the agent works with files that match.” (S2); “The skill is then only surfaced to the agent when it is reading or editing matching files.” (S2)
  - Directory scoping without frontmatter: “Skills in nested project directories are automatically scoped to files inside that directory.” (S2)
  - `user-invocable: false`, documented only in the CLI changelog: “Set `user-invocable: false` in a skill's `SKILL.md` frontmatter to hide it from `/` autocomplete and typed `/skill-name` resolution while keeping it available to the model.” (S9, v2026.07.06)
  - `name` “Must match the parent folder name.” (S2); `description` is required. A missing description does not hide the skill but makes selection unlikely: “Without a description, the agent is unlikely to pick the skill on its own, but you can still invoke it by name.” (S2)
- **Limits.** Stated only in the changelog, as warnings on skills that still load: “Skills that load but exceed the spec's limits now show a yellow warning count in `/skills`, and selecting one lists what to fix under it. Warnings cover a name over 64 characters or not in lowercase-hyphen form, a frontmatter `name` that doesn't match the folder, a description over 1,024 characters, and a body over about 5,000 tokens.” (S9, v2026.10.08; same in S10). The editor shows the same warnings: “Customize > Skills now shows a warning icon on skills whose name, description, or body go past the Agent Skills limits” (S10, 3.25).
- **Listing budget.** Not found in the docs: no page states a cap on the number of skills listed, a total budget for the description listing, or truncation behaviour.
- **Inconsistency.** The help-centre comparison table describes skills as “Invoked on demand with `/skill-name` or `@skill-name`” (S27), which omits the default model invocation that S2 documents.

---

## 4. Pointers and imports

- **A plain-words pointer does not load the file.** The docs address the `@file` form and say the content is not inlined; nothing gives plain prose stronger treatment. “Rule content reaches Agent as written. A file mention like `@migration-template.sql` tells Agent where to look, and Agent reads the file with its tools when it needs the content. The file's contents are not inlined into the prompt, and this is the same in the editor, the CLI, and Cloud Agents. Put anything that must always be in context directly in the rule body.” (S1)
- **There is no import syntax.** The FAQ answer to "Can rules reference other rules or files?" is: “Yes. Mention a file by path, for example `@service-template.ts`, and Agent reads it with its tools when the rule applies and it needs the content. The file is not inlined into the prompt, so if something must always be in context, paste it into the rule body.” (S1)
- **When the model reads it is the model's decision.** “Agent reads a referenced file when it needs it, so tell it what to look for there” (S1). The help centre repeats: “Agent reads the file when it needs it; the contents aren't inlined, so put anything that must always be in context in the rule body.” (S26)
- `@`-mentions typed by the user in chat are a different mechanism and do attach content: “Type `@` in the chat input to attach specific context to your prompt.” (S6)
- For `AGENTS.md` the docs recommend pointers without claiming auto-loading: “If this section gets large, we recommend including references to other files that can contain detailed instructions for specific tasks.” (S15)

---

## 5. Size

- **Rule file, recommended:** “Keep rules under 500 lines” (S1). Help centre: “Keep rules under 500 lines. Split large rules into smaller, focused files.” (S26)
- **Rule file, hard limit:** not found in the docs.
- **Total of always-applied rules:** no numeric limit, recommended or hard, found in the docs. Qualitative guidance only: “Rules are included in every conversation, so they add up.” (S28); “Too many rules consume unnecessary context and may confuse the agent.” (S28)
- **Skill description:** warning above 1,024 characters (S9, quoted in section 3). **Skill body:** warning above “about 5,000 tokens” (S9). **Skill name:** warning above 64 characters (S9). These are warnings on skills that still load, not documented rejections.
- **Skill body guidance:** “Keep your main `SKILL.md` focused and move detailed reference material to separate files.” (S2)
- A measured view exists in the product: the context ring breakdown reports token use per category, including “**Rules**: project and user rules included in the prompt” (S6).

---

## 6. Long sessions

- **Summarisation exists and is automatic near the limit.** “When the window gets close to full, Cursor compresses older parts of the conversation into a summary to leave more room for new conversation.” (S6). Manual trigger in the CLI: “| `/summarize` | Summarize the conversation to reduce context. `/compress` is an alias. |” (S13)
- **Rules and skill descriptions are accounted separately from the conversation that gets summarised.** The breakdown lists “**Rules**: project and user rules included in the prompt”, “**Skills**: skill descriptions injected into the system context”, “**Summarized conversation**: compressed summaries of earlier turns” and “**Conversation**: your messages, the agent's replies, and tool results” as distinct categories (S6).
- **Always-applied rules are described as per-request.** “Rules add instructions to the LLM's context window before every request.” (S21); “[`alwaysApply: true`](https://cursor.com/docs/rules.md#rule-anatomy) includes the rule in every request.” (S17). No page uses the words re-inject or describes rules after summarisation explicitly.
- **Nested rules and nested `AGENTS.md` are shown once.** “Each rule is shown once per conversation” (S10, v2026.10.22). Whether they are shown again after a summary is not stated.
- **A `/`-attached skill does not persist; a Custom Mode does.** “Pressing Enter attaches the skill to one message, and it fades as the conversation moves on.” (S6). “Inside a mode, the skill stays in context on every turn, even as the agent works for hours, until you exit the mode.” (S6)
- **Hooks cannot repair context at compaction.** `preCompact` is “an observational hook that cannot block or modify the compaction behavior” (S4); its only output field is a message to the user.
- **What survives a summary, per release notes:** “The agent also keeps your latest request word for word after summarization” (S10, 3.24). Nothing equivalent is stated for glob-attached rules, agent-fetched rules or skill bodies loaded earlier in the session.

---

## 7. Enforcement

- **Rules are advisory.** “The LLM sees all applicable rules when generating responses. It will attempt to follow them, but rules are suggestions, not guarantees. Combine rules with enforcement hooks for requirements that must be followed.” (S21). “These are non-deterministic. They improve outcomes but don't guarantee prevention.” (S21). “While this is supported, AI guidance should not be your only security control.” (S1)
- **"Enforce this rule" on team rules concerns the user's toggle, not the model.** “When enabled, the rule is required for all team members and cannot be disabled in Customize.” (S1)
- **Hooks are the enforcement mechanism.** “Hooks are spawned processes that communicate over stdio using JSON in both directions. They run before or after defined stages of the agent loop and can observe, block, or modify behavior.” (S4). Blocking: “Exit code `2` - Block the action (equivalent to returning `permission: "deny"`)” (S4). Failure mode by default is open: “Other exit codes - Hook failed, action proceeds (fail-open by default)” (S4), with `failClosed` available per script.
- **Where hooks are configured** (S4): “`<project-root>/.cursor/hooks.json`”, “`~/.cursor/hooks.json`”, enterprise “Linux/WSL: `/etc/cursor/hooks.json`” (macOS and Windows equivalents listed), team hooks in the web dashboard (Enterprise), and plugin hooks. “Priority order (highest to lowest): Enterprise → Team → Project → User” (S4). Claude Code settings files follow after those (S5).
- **Permissions in the editor:** `permissions.json`. “Cursor reads `permissions.json` from two locations:” `~/.cursor/permissions.json` and `<workspace>/.cursor/permissions.json` (S20). It configures allowlists and the Auto-review classifier: “`permissions.json` steers which calls Auto-review runs automatically and which it reviews. `sandbox.json` controls what a sandboxed command can reach” (S18). Run modes are “best-effort guardrails rather than a hard security boundary” (S19).
- **Permissions in the CLI:** “Permissions are set in `~/.cursor/cli-config.json` (global) or `<project>/.cursor/cli.json` (project-specific).” (S11), with `Shell(...)`, `Read(...)`, `Write(...)`, `WebFetch(...)`, `Mcp(...)` tokens and “Deny rules take precedence over allow rules” (S11).
- **Sandbox:** `~/.cursor/sandbox.json` and `<project-dir>/.cursor/sandbox.json` (S18). **Team admin controls** override local files: “Team settings take precedence over individual and project configuration.” (S18). **File access:** “Use [.cursorignore](https://cursor.com/docs/reference/ignore-file.md) to block agent access to specific files.” (S19)

---

## 8. Surfaces

### Editor agent

- The baseline for everything above. Rules apply to “Agent (Chat)” (S1). Claude Code hook import and the Third-Party Imports setting are documented for the desktop app (S5).

### CLI

- Same rule system: “The CLI agent supports the same [rules system](https://cursor.com/docs/rules.md) as the editor.” (S8), plus root `AGENTS.md` and `CLAUDE.md` (S8, quoted in section 2).
- Skills load in every CLI mode: “Skills load in interactive, headless, and editor-integration modes; `/skill-name` invocations work in `-p` print mode.” (S9, "May 7, 2026"). Other vendors' skill directories: “Skills are also discovered in `.claude/skills`, `.agents/skills`, and `.codex/skills`.” (S9, "March 2026")
- Newly added skills need a restart to be offered to the model: “`/add-dir` refreshes slash skills and custom commands immediately; restart only when you want the agent to discover new skills automatically.” (S9, v2026.06.29)
- Hooks run in the CLI, including Claude Code ones: “Claude Code `settings.json` hooks are read and merged; admins can push team-managed hooks with enterprise > team > project > user precedence.” (S9, "January 2026")
- Permissions live in CLI config, not `permissions.json` (S11). Print mode: “Print mode follows the same approval rules as an interactive session, but it can't stop to ask you.” (S35)
- File pointers behave identically: “this is the same in the editor, the CLI, and Cloud Agents” (S1).

### Cloud agents (formerly background agents; `docs/background-agent` redirects to `docs/cloud-agent`)

- `AGENTS.md`: “Cloud agents read `AGENTS.md` files.” (S15)
- Rules: “Cloud Agents can read and follow [Rules](https://cursor.com/docs/rules.md) at three levels:” user rules, team rules, and “**Repo rules**: `.cursor/rules/*.mdc` files committed to the repository, these apply to all agents using that repository.” (S16)
- Skills: “Project skills in the repo are always available.” (S34). Personal skills only when synced, and only from one directory: “Only `~/.cursor/skills/` syncs. Project skills, `~/.agents/skills/`, and other files on your machine stay local.” (S2). “Cursor does not copy `~/.agents/skills/` or unsynced local skills to Cloud Agents, Agents Window remote SSH sessions, or [self-hosted workers](https://cursor.com/docs/cloud-agent/self-hosted/pool.md).” (S2, line breaks collapsed). Automations do not get synced personal skills (S2).
- Hooks: project hooks only, command type only, no session start. “Cloud agents run command-based hooks from `.cursor/hooks.json` in your repository.” (S14). “User-level hooks (`~/.cursor/hooks.json`) are not available in cloud agents.” (S4). `sessionStart` is listed under “Hooks not available in cloud agents” (S4), so the `additional_context` injection route does not exist there. The cloud "Configuration sources" list names project, team and enterprise hooks; Claude settings files are not in it (S4).
- Approvals: “Run Modes apply to local agents. Cloud Agents run inside their own dedicated machine, so the agent never asks you to approve an action.” (S18)
- `CLAUDE.md` in cloud agents: not stated on any cloud page. `.claude/skills` in cloud agents: not stated separately from the general sentence in S2.

### Subagents (`.cursor/agents`)

- Available everywhere: “You can use subagents in the editor, CLI, and [Cloud Agents](https://cursor.com/docs/cloud-agent.md).” (S3)
- Context: “Subagents start with a clean context. The parent agent includes relevant information in the prompt since subagents don't have access to prior conversation history.” (S3)
- Tools: “Subagents inherit all tools from the parent, including MCP tools from configured servers.” (S3)
- Rules: the Subagents page says nothing. The CLI changelog says subagents inherit rules: “Parallel agents execute locally with live status in interactive, headless, and editor sessions, inheriting your credentials, rules, and approval policy.” (S9, "March 2026"). The SDK page, on replacing the system prompt: “Tool schemas, rules, and skills still load, and subagents keep their own prompts.” (S25)
- Skills for subagents: not stated on any page.
- What the parent sees of subagents: “**Subagents**: documentation for subagent types the agent can launch” (S6) and “| `description` | string | No | — | Short description shown in Task tool hints. Agent reads this to decide delegation. |” (S3). The subagent file body is the subagent's own prompt.

---

## Local facts: this repository

Read-only inspection; nothing edited, no repository script run.

### `.cursor/`

| Entry | What it is |
| :-- | :-- |
| `.cursor/rules/` | 124 files, all `.mdc`, flat (no subdirectories), 765 lines and 56,512 bytes in total |
| `.cursor/agents/` | 31 `.md` subagent files |
| `.cursor/plans/` | 26 `*.plan.md` files (not a location any docs page says is loaded as rules) |
| `.cursor/hooks.json` | one hook: `sessionStart` running `node .cursor/hooks/oak-session-identity.mjs` |
| `.cursor/hooks/` | `oak-session-identity.mjs` (imports a built hook from `agent-tools/dist/...` when present; otherwise prints `{ env: {}, additional_context: '' }`) and `state/` with two JSON files |
| `.cursor/settings.json` | a `plugins` map enabling seven plugins (vercel, sentry, elastic-docs, clerk, create-plugin, posthog, linear) |
| `.cursor/mcp.json` | nine MCP server entries |
| `.cursor/scripts/` | two status-line scripts |
| `.cursor/statusline.cli.fragment.json` | a `statusLine` command fragment for the CLI config |
| `.cursor/skills/` | does not exist |
| `.cursor/commands/`, `.cursor/permissions.json`, `.cursor/cli.json`, `.cursor/sandbox.json`, `.cursor/environment.json`, `.cursor/BUGBOT.md` | none exist |

### Rule files

- 124 rule files. Every one has frontmatter with `description` and `alwaysApply`; the only frontmatter keys in use are `description` (124), `alwaysApply` (124), `globs` (21).
- `alwaysApply: true`: **75**. `alwaysApply: false`: 49.
- `globs` set: **21** (all with `alwaysApply: false` and a description; none combine `globs` with `alwaysApply: true`).
- Neither `alwaysApply: true` nor `globs`: **28** (all have a description, so they are "Apply Intelligently" rules; there are no "Apply Manually" rules).
- Shape of a typical file (6 lines; 7 when `globs` is present):

  ```text
  ---
  description: Apply the first question and existing architecture before non-trivial work
  alwaysApply: true
  ---

  Read and follow `.agent/rules/apply-architectural-principles.md`.
  ```

- **All 124 bodies are a single pointer line** of the form ``Read and follow `.agent/rules/<name>.md`.`` No rule body carries the guidance itself.
- Character totals: always-applied rules have 4,821 characters of body in total and 17,682 characters of description (median 204, longest 1,305). The 28 description-only rules carry 15,564 characters of description (median 593.5). The 21 glob rules carry 8,450 characters of description.

### `AGENTS.md` and neighbours

- `AGENTS.md` exists: 35 lines, 1,975 bytes, three headings (`# AGENTS.md`, `## Code review`, `## Codex team-session alert bootstrap`).
- `CLAUDE.md` exists: 3 lines, 57 bytes, a pointer to `.agent/directives/AGENT.md`. It is not a copy of `AGENTS.md`.
- No `.cursorrules`.
- Nested instruction files outside `node_modules`: `demos/oak-design-showcase/AGENTS.md`, `demos/oak-design-showcase/CLAUDE.md`, `packages/design/oak-design-system/CLAUDE.md`, and one `CLAUDE.md` under `packages/design/oak-design-system/studio-source/original-capture-2026-07-23/`.

### Sibling directories that the docs say Cursor also reads (existence and counts only; contents not opened)

- `.agents/skills/`: 87 skill directories, 87 `SKILL.md`.
- `.claude/skills/`: 87 entries with the same 87 names; 78 are real directories with their own `SKILL.md`, 9 are symlinks into `.agents/skills/`.
- `.codex/skills/`: does not exist.
- `.claude/agents/`: 31 files with the same 31 names as `.cursor/agents/`. `.codex/agents/`: 30 `.toml` files.
- `.claude/rules/`: 124 `.md` files, same 124 names as `.cursor/rules/`.
- `.claude/settings.json`: exists, with a `hooks` object for `SessionStart`, `PreToolUse`, `UserPromptSubmit`, `PreCompact`. No `.claude/settings.local.json`.
- No nested `.cursor/` directory anywhere else in the tree.

---

## Not found or not verified

1. Whether the `description` string of an `alwaysApply: true` rule is emitted to the model next to the body. The docs say the description is “ignored” for that type and never say it is sent; they also never say outright that it is withheld.
2. The exact trigger set for project glob rules (file read, file edit, file attached by the user, file merely open in the editor). Only “a matching file is in context” is documented for project rules; "reads a matching file or you add one to context" is documented for team rules.
3. Behaviour of a rule with `alwaysApply: false`, a `description` and `globs` together: whether the description is also offered to the Agent for fetching.
4. Any loading of `.claude/rules/` or `.claude/commands/`. Zero mentions.
5. Precedence or de-duplication between skills of the same name in two skill directories, and whether a skill reached through a symlink and through its real path is listed once or twice.
6. Any listing budget, count cap or truncation rule for the skill description listing; whether skill names appear in that listing.
7. Any hard size limit for a rule file, and any limit at all, recommended or hard, for the total of always-applied rules.
8. What happens to glob-attached rules, agent-fetched rules, nested `AGENTS.md` content and loaded skill bodies when the conversation is summarised; whether "shown once per conversation" content is shown again afterwards. No page describes re-injection.
9. The format in which rules are placed in the prompt (wrapper text, ordering between rule files, whether file names or paths are shown).
10. Whether cloud agents read `CLAUDE.md`, load `.claude/skills/` or run Claude Code `settings.json` hooks. The cloud hook source list omits Claude files; the rest is silent.
11. Whether subagents receive the skill listing; whether subagents receive `AGENTS.md`/`CLAUDE.md`. Rule inheritance by subagents is stated only in a CLI changelog line, not on the Subagents page.
12. Whether nested `CLAUDE.md` files are loaded like nested `AGENTS.md`. S26 says “the same way it reads `AGENTS.md`”; S8 says “at the project root”.
13. Whether the "Include Third-Party Plugins, Skills, and Other Configs" setting gates `.claude/skills/` and `.claude/agents/` loading. Documented only for hooks.
14. What `.cursorrules` loads today beyond the implication that it behaved as Always Apply; no reference page mentions the file.
15. A dedicated documentation page for commands (`.cursor/commands`). None exists in the index; old URLs redirect to the help page on migrating commands to skills.
16. Not verified: nothing here was tested against a running Cursor. Every statement is what the pages say on 2026-11-12.

---

## Inference rather than doc statement

1. **Always-applied rules deliver the body only.** Reasoning: the description is presented to the Agent “Otherwise”, meaning when `alwaysApply` is not true (S1); for `true` the table says description is “ignored” (S1); “The content is the rule itself.” (S1); Cursor's own always-apply examples have no description. No sentence states the non-emission directly.
2. **In this repository, an always-applied rule puts one line in context**, the pointer ``Read and follow `.agent/rules/<name>.md`.``, and the guidance itself reaches the model only if the model chooses to open that file. This follows from S1's “The file's contents are not inlined into the prompt” applied to the 124 pointer-only bodies. If inference 1 holds, the 75 always-applied rules contribute 75 pointer lines (4,821 characters) with no indication of what each file is about, since the descriptions that say so would not be sent.
3. **The 28 description-only rules cost two model decisions each:** fetch the rule on the strength of its description, then open the pointed file. Derived from S1 and S7 plus the pointer-only bodies.
4. **Always-applied rules persist across summarisation.** Derived from “before every request” (S21), “in every request” (S17), and Rules being a context category separate from “Summarized conversation” (S6). No page says so directly, and nothing covers rules attached mid-conversation.
5. **Cursor discovers each of this repository's 87 skills at least twice**, once under `.agents/skills/` and once under `.claude/skills/`, because S2 names both directories as loaded and no page documents de-duplication by name; the 3.25 note says same-named skills appear as separate rows. Whether the 9 symlinked entries collapse with their targets is unknown (item 5 above).
6. **Root `AGENTS.md` and root `CLAUDE.md` are both always loaded here**, because they are different files and the only documented de-duplication is for a symlink, hard link or identical copy (S10).
7. **`.claude/rules/*.md` is not loaded by Cursor**, as an inference from total silence in the docs; the same guidance arrives through `.cursor/rules/*.mdc`. Silence is weaker evidence than a statement.
8. **Cursor's desktop app and CLI run this repository's Claude Code hooks** (`SessionStart`, `PreToolUse`, `UserPromptSubmit`, `PreCompact` from `.claude/settings.json`) in addition to `.cursor/hooks.json`, by default, per S5's setting being on by default and S5's event mapping. A `SessionStart` hook there and the `sessionStart` hook in `.cursor/hooks.json` would then both be able to add `additional_context`.
9. **Subagent definitions do not double-load here:** the 31 same-named files in `.cursor/agents/` win over `.claude/agents/` under S3's stated precedence. The `.codex/agents/*.toml` files are outside the documented format (“Each subagent is a markdown file with YAML frontmatter”, S3), so they are presumably ignored.
10. **Cloud agents get no session-start context injection from this repository**, since its only Cursor hook is `sessionStart`, which S4 lists as unavailable in cloud agents.
