# Codex loading report: what OpenAI Codex puts in context, and when

**What this file is.** A sub-agent's report, as returned on 12 November 2026 to the seat Swift
holds Aether (Claude Code cloud session `01Duocji`), passed through the repository's formatter
and otherwise unchanged. The seat's reading of it is in
[`codex-rules-and-skills-loading.md`](codex-rules-and-skills-loading.md).

Date of fetch: 2026-11-12. Every quotation below is marked **[raw]**: the page's Markdown twin was
fetched with `curl -sL` and read directly. No fetch tool summarised anything, so there are no
**[relayed]** quotations. Paraphrase is never placed inside quotation marks.

## Source table

| Id | Page | URL requested | Mode |
| --- | --- | --- | --- |
| S1 | Custom instructions with AGENTS.md | `https://developers.openai.com/codex/guides/agents-md.md` | raw |
| S2 | Build skills | `https://developers.openai.com/codex/skills.md` | raw |
| S3 | Rules | `https://developers.openai.com/codex/rules.md` | raw |
| S4 | Hooks | `https://developers.openai.com/codex/hooks.md` | raw |
| S5 | Subagents | `https://developers.openai.com/codex/subagents.md` | raw |
| S6 | Configuration reference | `https://developers.openai.com/codex/config-reference.md` | raw |
| S7 | Advanced configuration | `https://developers.openai.com/codex/config-advanced.md` | raw |
| S8 | Cloud environments | `https://developers.openai.com/codex/cloud/environments.md` | raw |
| S9 | Customization overview | `https://learn.chatgpt.com/docs/customization/overview.md` | raw |
| S10 | Agent approvals & security | `https://learn.chatgpt.com/docs/agent-approvals-security.md` | raw |
| S11 | Slash commands in Codex CLI | `https://learn.chatgpt.com/docs/developer-commands.md?surface=cli` | raw |
| S12 | Skill controls (enterprise) | `https://learn.chatgpt.com/docs/enterprise/skills.md` | raw |
| S13 | Codex Cloud | `https://learn.chatgpt.com/docs/cloud.md` | raw |
| S14 | `openai/codex` `docs/agents_md.md`, `docs/skills.md`, `docs/config.md`, `docs/execpolicy.md` | `https://raw.githubusercontent.com/openai/codex/main/docs/<file>` | raw |

Notes on the sources:

- The `developers.openai.com/codex/` pages returned HTTP 200 with Markdown whose internal links
  point at `learn.chatgpt.com/docs/...`; the pages name `https://learn.chatgpt.com/llms.txt` as
  the index. S9 to S13 were fetched from that host directly, from links in that index.
- S14 are stubs. `docs/agents_md.md` in full: "For information about AGENTS.md, see [this
  documentation](https://developers.openai.com/codex/guides/agents-md)." **[raw]** The GitHub
  `docs/` directory therefore adds nothing beyond S1 to S7 on these questions.

## 1. `AGENTS.md`

- **When it is built.** "Codex builds an instruction chain when it starts (once per run; in the
  TUI this usually means once per launched session)." **[raw, S1]**
- **Global file.** "In your Codex home directory (defaults to `~/.codex`, unless you set
  `CODEX_HOME`), Codex reads `AGENTS.override.md` if it exists. Otherwise, Codex reads
  `AGENTS.md`. Codex uses only the first non-empty file at this level." **[raw, S1]**
- **Project files, root down to the working directory.** "Starting at the project root
  (typically the Git root), Codex walks down to your current working directory. ... In each
  directory along the path, it checks for `AGENTS.override.md`, then `AGENTS.md`, then any
  fallback names in `project_doc_fallback_filenames`. Codex includes at most one file per
  directory." **[raw, S1]**
- **Directories below the working directory are not read.** "Codex stops searching once it
  reaches your current directory, so place overrides as close to specialized work as possible."
  **[raw, S1]**
- **Order.** "Codex concatenates files from the root down, joining them with blank lines. Files
  closer to your current directory override earlier guidance because they appear later in the
  combined prompt." **[raw, S1]**
- **Whole text, at the start.** "Codex reads `AGENTS.md` (and related files) and includes a
  limited amount of project guidance in the first turn of a session." **[raw, S7]**
- **Size cap.** "Codex skips empty files and stops adding files once the combined size reaches
  the limit defined by `project_doc_max_bytes` (32 KiB by default)." **[raw, S1]** Beyond it:
  "**Instructions truncated:** Raise `project_doc_max_bytes` or split large files across nested
  directories to keep critical guidance intact." **[raw, S1]**
- **The two pages describe the cap differently.** S1 says "combined size"; S7 says
  "`project_doc_max_bytes`: how much to read from each `AGENTS.md` file" **[raw, S7]**; S6 says
  "Maximum bytes read from `AGENTS.md` when building project instructions." **[raw, S6]**
- **Fallback filenames apply only where `AGENTS.md` is absent.**
  "`project_doc_fallback_filenames`: additional filenames to try when `AGENTS.md` is missing at
  a directory level" **[raw, S7]**; "Filenames not on this list are ignored for instruction
  discovery." **[raw, S1]**
- **"Read `path/to/file.md`" in plain words, and import syntax.** Not found in the docs. No page
  describes an import or include syntax, or automatic loading of a file that `AGENTS.md` names.
  The only documented ways to add files to the chain are the per-directory names above.
- **Related config keys.** `developer_instructions`: "Additional developer instructions injected
  into the session (optional)." **[raw, S6]** `model_instructions_file`: "Replacement for
  built-in instructions instead of `AGENTS.md`." **[raw, S6]**
- **Code review.** "add a `## Code Review Rules` section to the `AGENTS.md` closest to the code
  the rules govern." **[raw, S1]**

## 2. Skills

- **Directories.** "Codex reads skills from repository, user, admin, and system locations. For
  repositories, Codex scans `.agents/skills` in every directory from your current working
  directory up to the repository root." **[raw, S2]** The table lists `$CWD/.agents/skills`,
  `$CWD/../.agents/skills`, `$REPO_ROOT/.agents/skills`, `$HOME/.agents/skills`,
  `/etc/codex/skills`, and system skills "Bundled with Codex by OpenAI." **[raw, S2]**
- **`.codex/skills` and `.claude/skills`.** Not found in the docs; neither appears in S2, S9 or
  S12. Plugins are the other documented source ("Plugins can include one or more skills."
  **[raw, S2]**).
- **Symlinks.** "Codex supports symlinked skill folders and follows the symlink target when
  scanning these locations." **[raw, S2]**
- **In context at session start.** "ChatGPT and Codex start with each skill's name and
  description, then load the full `SKILL.md` instructions when they decide to use that skill. In
  Codex, the initial list also includes each skill's file path." **[raw, S2]**
- **Budget on the listing.** "By default, this list uses at most 2% of the model's context
  window, or 8,000 characters when the context window is unknown. If many skills are installed,
  Codex shortens skill descriptions first. For large skill sets, Codex may omit some skills from
  the initial list and show a warning." **[raw, S2]** "Use `skills.max_context_tokens` to set a
  different budget, up to 10,000 tokens." **[raw, S2]** "This budget applies only to the initial
  skills list. When Codex selects a skill, it still reads the full SKILL.md instructions for
  that skill." **[raw, S2]**
- **Per-description length cap.** Not found in the docs.
- **What loads a body.** "**Explicit invocation:** ... In Codex CLI or the IDE extension, run
  `/skills` or type `$` to mention a skill." and "**Implicit invocation:** ChatGPT or Codex can
  choose a skill when your task matches the skill `description`." **[raw, S2]** "It reads
  references or runs scripts only when needed" **[raw, S9]**
- **Metadata that changes this.** Frontmatter: "The `SKILL.md` file must include `name` and
  `description`." **[raw, S2]** Invocation policy is not frontmatter; it lives in
  `agents/openai.yaml`: "`allow_implicit_invocation` (default: `true`): When `false`, Codex
  won't implicitly invoke the skill based on user prompt; explicit `$skill` invocation still
  works." **[raw, S2]**
- **Config that changes this.** `skills.include_instructions`: "Include the automatic skills
  instructions in the model context. Defaults to `true`." **[raw, S6]** A `[[skills.config]]`
  entry with `enabled = false` disables a skill by `path` or `name` **[S2, paraphrase]**.
- **Same name twice.** "If two skills share the same `name`, Codex doesn't merge them; both can
  appear in skill selectors." **[raw, S2]**

## 3. Rules

- **The only "rules" mechanism documented is execution policy.** "Use rules to control which
  commands Codex can run outside the sandbox." **[raw, S3]** "The `.rules` file format uses
  `Starlark`" **[raw, S3]**
- **Where they load from.** "Codex scans `rules/` under every active config layer at startup
  ... Project-local rules under `<repo>/.codex/rules/` load only when the project `.codex/`
  layer is trusted." **[raw, S3]**
- **Rule text and the model.** `justification`: "Codex may surface it in approval prompts or
  rejection messages." **[raw, S3]** No page says `.rules` content is placed in context as
  guidance.
- **`.agents/rules/`, `.claude/rules/`, `CLAUDE.md` as guidance.** Not found in the docs. None
  of the three names appears in S1 to S13. `CLAUDE.md` would be read only if listed in
  `project_doc_fallback_filenames`, and then only in a directory with no `AGENTS.md` (S1, S7
  quotations in section 1).
- **Guidance text reaches context only through:** the `AGENTS.md` chain (S1), the skills
  listing and chosen skill bodies (S2), `developer_instructions` (S6), and hook
  `additionalContext` (S4, section 4).

## 4. Long sessions

- **What compaction does.** "Codex replaces earlier turns with a concise summary, freeing
  context while keeping critical details." **[raw, S11]**
- **Automatic compaction exists.** `model_auto_compact_token_limit`: "Token threshold that
  triggers automatic history compaction (unset uses model defaults)." **[raw, S6]**
- **`AGENTS.md` content after compaction.** Not found in the docs. No page says whether the
  instruction chain is kept, re-injected or summarised. S1 says only that the chain is built
  "once per run".
- **Loaded skill bodies after compaction.** Not found in the docs.
- **The documented way to restore context after compaction is a hook.** "After Codex compacts a
  root session, `SessionStart` hooks that match `source: "compact"` run before the next model
  request. This also applies when automatic compaction happens in the middle of a turn: Codex
  delivers the hook's additional context to the immediate continuation instead of waiting for a
  later user turn." **[raw, S4]** The hook's "`additionalContext` text is added as extra
  developer context." **[raw, S4]** Default limit: "Omit `additionalContextLimit` to use the
  default `2500`-token threshold." **[raw, S4]**
- **`PreCompact`.** "Plain text on `stdout` is ignored." **[raw, S4]**

## 5. Enforcement

- **`AGENTS.md` and skills: advisory.** "Pair `AGENTS.md` with infrastructure that enforces
  those rules: pre-commit hooks, linters, and type checkers" **[raw, S9]**
- **Sandbox: enforced by the operating system.** "**Codex CLI / IDE extension**: OS-level
  mechanisms enforce sandbox policies." **[raw, S10]** In `workspace-write`,
  "`<writable_root>/.agents` is protected as read-only when it exists as a directory." and the
  same for `.codex` and `.git` **[raw, S10]**
- **Approvals: enforced by the harness.** "**Approval policy**: When Codex must ask you before
  it executes an action (for example, leaving the sandbox, using the network, or running
  commands outside a trusted set)." **[raw, S10]**
- **Execpolicy rules: enforced, on commands leaving the sandbox.** "`forbidden`: Block the
  request without prompting." and "Codex applies the most restrictive decision when more than
  one rule matches (`forbidden` > `prompt` > `allow`)." **[raw, S3]** "Rules are experimental
  and may change." **[raw, S3]**
- **Hooks: can block, but are not a complete boundary.** "Treat tool hooks as a useful
  guardrail, not a complete enforcement boundary." **[raw, S4]** "A `PreToolUse` error, timeout,
  or malformed response can let the tool run." **[raw, S4]** "Non-managed hooks must be reviewed
  and trusted before they run." **[raw, S4]**
- **Project trust gates all project-level enforcement.** "If the project is untrusted, Codex
  ignores project `.codex/` layers, including `.codex/config.toml`, project-local hooks, and
  project-local rules." **[raw, S7]**

## 6. Subagents and cloud

- **Where custom agents live.** "add standalone TOML files under `~/.codex/agents/` for personal
  agents or `.codex/agents/` for project-scoped agents." **[raw, S5]**
- **Skills.** "Skills inherit from the parent, and a custom agent can disable individual skills
  with `skills.config`." **[raw, S5]**
- **Permissions.** "They inherit the parent's permissions, provider, and MCP servers; a custom
  agent file can't override those settings." **[raw, S5]** "Subagents inherit your current
  sandbox policy." **[raw, S5]**
- **Instructions.** Each file must define `developer_instructions` **[S5, paraphrase]**.
  Whether a subagent receives the parent's `AGENTS.md` chain: not found in the docs.
- **Subagent context hook.** `SubagentStart`: "Plain text on `stdout` is added as extra
  developer context for the subagent." **[raw, S4]**
- **Cloud and `AGENTS.md`.** "If your repo includes `AGENTS.md`, the agent uses it to find
  project-specific lint and test commands." **[raw, S8]** Discovery order, override files and
  the byte cap for cloud: not found in the docs.
- **Cloud and skills.** "Standalone skills are available in the ChatGPT desktop app, Codex CLI,
  and IDE extension. Skills bundled in plugins are also available in Chat and Work across
  ChatGPT on the web, desktop, and mobile." **[raw, S2]** Codex Cloud is not in the first list.
- **Cloud and rules.** "These rules apply to local executors; Work cloud containers use existing
  Work Cloud policies." **[raw, S3]**
- **Cloud and custom agents.** "In local Codex clients, you can also define custom agents"
  **[raw, S5]**. Whether cloud reads `.codex/config.toml`, `.codex/agents/` or `.codex/hooks`:
  not found in the docs.

## Local facts (read-only)

- **`.codex/` entries:** `README.md` (14,905 bytes), `config.toml` (7,819 bytes), `agents/`
  (30 `.toml` files), `hooks/` (1 file), `rules/` (1 file). `.codex/skills` does not exist.
- **`.codex/config.toml` keys relevant here:**

  ```toml
  sandbox_mode = "workspace-write"
  approval_policy = "on-request"
  project_doc_fallback_filenames = ["RULES_INDEX.md"]

  [features]
  hooks = true
  multi_agent = true

  [[hooks.SessionStart]]
  matcher = "startup|resume"
  ```

  Also `[sandbox_workspace_write] network_access = true`, two MCP servers, and 30
  `[agents."<name>"]` blocks, each a `description` plus `config_file = "agents/<name>.toml"`.
  No `project_doc_max_bytes`, no `skills.*`, no `developer_instructions`, no secrets.
- **`.codex/rules/seat-landing.rules`** (5,104 bytes): a Starlark execution-policy file, not
  guidance. Two `host_executable` declarations and 10 `prefix_rule` entries (7 `allow`, 3
  `forbidden`) covering the commit, sync and merge-bot push path.
- **`.codex/hooks/practice-session-identity.mjs`** (926 bytes): a `SessionStart` shim that
  imports a built adapter under `agent-tools/dist/` to print a `hookSpecificOutput` identity
  block, and prints `{}` when the build artefact is missing.
- **`.codex/agents/code-expert.toml`** (sample): `name`, `description`,
  `model_reasoning_effort`, `sandbox_mode`, `approval_policy`, and `developer_instructions`
  that say to read and follow `.agent/sub-agents/templates/code-expert.md`.
- **`AGENTS.md`** (1,975 bytes) tells the reader to: read `.agent/directives/AGENT.md` (14,274
  bytes); see `RULES_INDEX.md` (11,876 bytes) for the canonical rules list; follow a
  `## Code review` section; and, in a generated block, load `$oak-start-right-team` for
  coordinated Codex work and follow a relay procedure in
  `.agent/rules/use-monitor-for-event-driven-wake.md`.
- **Other `AGENTS.md`:** `demos/oak-design-showcase/AGENTS.md` (678 bytes, a Next.js notice). No
  `AGENTS.override.md` anywhere. `RULES_INDEX.md` exists only at the root.
- **`.agents/skills/`:** 87 skill directories, each with a `SKILL.md`; no duplicate `name`
  values; no `agents/openai.yaml` files; `description:` lines total about 40,800 characters. 78
  are thin pointers, 9 carry their own body. Shape of one (`.agents/skills/oak-commit/SKILL.md`,
  425 bytes): frontmatter `name` and `description`, then one line, "Read and follow
  `.agent/skills/change-custody/commit/SKILL-CANONICAL.md`."
- **`.agents/rules/`:** 124 `.md` files. Shape of one
  (`.agents/rules/agent-state-observable.md`, 58 bytes), in full: "Read and follow
  `.agent/rules/agent-state-observable.md`." No frontmatter.
- **`.agents/`** also holds `agents/` (a `README.md`). The only `.agents/skills` directory in
  the repository is the root one.

## Not found or not verified

- Any import or include syntax in `AGENTS.md`, or automatic loading of files it names.
- Whether Codex reads `.codex/skills`, `.claude/skills`, `.agents/rules/`, `.claude/rules/` or
  `CLAUDE.md`. No page names any of them.
- What happens to `AGENTS.md` content and to loaded skill bodies after compaction.
- Whether a subagent receives the parent's `AGENTS.md` chain.
- A cap on the length of one skill description.
- Whether Codex Cloud reads `.codex/config.toml`, hooks, custom agents or `.agents/skills`, and
  its `AGENTS.md` discovery order and cap.
- Whether `project_doc_max_bytes` is a combined or a per-file limit (S1 and S7 differ).
- An explicit statement that `project_doc_fallback_filenames` is honoured from a project-level
  config file. S7 lists the keys Codex ignores in a project `.codex/config.toml`
  ("`openai_base_url`, `chatgpt_base_url`, `apps_mcp_product_sku`, `model_provider`,
  `model_providers`, `notify`, `profile`, `profiles`, `experimental_realtime_ws_base_url`, and
  `otel`" **[raw, S7]**); this key is not on that list.
- Nothing here was verified by running Codex. All claims are from documentation.

## Inference rather than doc statement

- **`RULES_INDEX.md` is not auto-loaded.** The root has `AGENTS.md`, and S1 says "at most one
  file per directory" with fallbacks tried only where `AGENTS.md` is missing. The
  `project_doc_fallback_filenames = ["RULES_INDEX.md"]` setting therefore does nothing at the
  root, and no other directory holds a `RULES_INDEX.md`. The model reaches it only by following
  the "See `RULES_INDEX.md`" line in `AGENTS.md`.
- **Nothing in this repository is loaded twice by Codex.** At session start Codex has the 1,975
  bytes of `AGENTS.md`, the skills listing from `.agents/skills`, and the `SessionStart` hook
  output. `.agent/directives/AGENT.md`, the rules and the canonical skill bodies enter context
  only when the model opens them. `.claude/skills` and `.claude/rules` are not documented Codex
  inputs, so they do not duplicate `.agents/skills`.
- **`.agents/rules/` is not read by Codex.** No documented mechanism discovers it. Its 124
  pointer files reach a Codex session only if the model opens them, and each then requires a
  second read of the `.agent/rules/` target.
- **The skills listing is at risk of being shortened.** 87 skills carry about 40,800 characters
  of descriptions before names and paths are added. That is five times the 8,000-character
  fallback, and roughly the size of the 10,000-token maximum explicit budget. The default is 2%
  of the model's context window, which was not measured here. S2 says descriptions are shortened
  first and skills can be omitted with a warning, so trigger words belong at the front of each
  description.
- **Each thin skill costs two reads.** Choosing a skill loads a `SKILL.md` whose body is one
  pointer line, so the canonical body needs a further file read by the model.
- **The identity hook does not re-run after compaction.** Its matcher is `startup|resume`; S4
  lists `compact` as a separate `source` value.
- **From a subdirectory, a nested `AGENTS.md` adds to the chain.** A session started in
  `demos/oak-design-showcase/` gets the root file and then that directory's file.
- **Subagent adapters are pointers too.** Each `.codex/agents/*.toml` gives the subagent a "read
  and follow" line, so the template enters the subagent's context only when it opens the file.
