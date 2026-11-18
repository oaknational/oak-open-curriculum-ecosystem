# Codex Platform Layer

This directory is the thin, project-specific activation layer for Codex CLI.
Canonical Practice instructions, policies, skills, and subagent definitions
remain under `.agent/`; `.codex/` translates only the parts Codex needs to
activate them.

For the version-pinned external capability baseline, see the
[Codex CLI agentic capability catalogue][catalogue]. That report uses the
installed CLI and official OpenAI sources; this README describes only the
tracked Oak activation.

[catalogue]: ../.agent/reports/agentic-engineering/codex-cli-agentic-capability-catalogue-2026-07-25.md

## Current activation

| Capability        | Tracked activation                                | Current local posture                                                                                     |
| ----------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Instructions      | `AGENTS.md` → `.agent/directives/AGENT.md`        | Thin entry point; canonical policy stays in `.agent/`                                                     |
| Skills            | `.agents/skills/oak-*/SKILL.md`                   | Native Codex skills selected with `/skills` or `$skill-name`                                              |
| Subagents         | `[agents]` in `config.toml` → `agents/*.toml`     | Project roles may pin model and effort, then add policy and canonical instructions                        |
| Hooks             | `[features].hooks` plus `[[hooks.SessionStart]]`  | Trusted-project identity context plus a team-alert pointer; canonical `PreToolUse` guard is not yet wired |
| MCP               | `[mcp_servers.*]` in `config.toml`                | Two project-scoped remote servers with OAuth and write approval                                           |
| Sandbox           | `sandbox_mode = "workspace-write"`                | Tracked project policy; effective policy still follows Codex precedence                                   |
| Command network   | `[sandbox_workspace_write].network_access = true` | Enabled for commands inside the active sandbox policy                                                     |
| Exec-policy rules | `rules/seat-landing.rules`                        | Seats commit and push through the merge bot with no prompt, in a trusted project                          |

This is not the complete Codex CLI capability set. The
[capability catalogue][catalogue] records the broader runtime and user-level
surface, its evidence grades, and explicit CLI exclusions.

## Authority and trust

Codex loads project `.codex/config.toml`, project hooks, project agents, and
project rules only after the project is trusted. The project layer cannot
override host-owned provider authentication, profiles, notification commands,
or OpenTelemetry commands.

Practice-content authority in this repo is:

1. canonical Practice policy and content under `.agent/`;
2. tracked project activation under `.codex/` and `.agents/`;
3. explanatory mirrors such as this README.

Codex configuration precedence is a separate boundary. Admin-enforced
`requirements.toml` and cloud-managed requirements constrain
security-sensitive settings that lower layers cannot override. Within those
constraints, the effective configuration composes CLI overrides, trusted
project configuration, named profiles, user configuration, and system
configuration in OpenAI's documented order. Project trust determines whether
the project layer participates at all. See the official
[advanced configuration][advanced-config] and
[configuration reference][config-reference].

[advanced-config]: https://developers.openai.com/codex/config-advanced
[config-reference]: https://developers.openai.com/codex/config-reference

Project adapters may activate canonical behaviour. They must not become a
second copy of its substance.

## Seat landing without an owner prompt

The owner's requirement (2026-09-25): "I absolutely need all seats to be able
to push without me". Workspace-write keeps `.git` read-only inside every
writable root, and in a linked worktree the git dir sits outside every
writable root, so no git write succeeds inside the sandbox. A writable `.git`
would let any sandboxed command rewrite refs, history and git config for every
later git command, so the config adds no writable root for it.

Instead, `rules/seat-landing.rules` allows the landing commands outright, each
as its narrowest prefix:

- `pnpm agent-tools merge-bot push`;
- `git add`, `git commit`, `git fetch origin` and `git worktree add`;
- `git merge --no-edit refs/remotes/origin/HEAD`, the sync with origin's
  default branch, and `git merge --abort` to back a conflicted sync out.

Opening a pull request is not among them. `gh` acts as the signed-in user
whenever `GH_TOKEN` is unset, so an allowed `gh pr create` could write under
that user's own login to any repository it reaches. It takes the default flow
until the merge bot opens pull requests under its own repository-scoped token.

It forbids raw `git push`, `git commit --amend`, `--no-verify` or `-n`, and
`git add -A`, `--all` or `.`. The rules match bare program names only
(`host_executable` with no paths), so `./git` or any other path to a binary of
that name matches nothing, forbidden rules included: `/usr/bin/git push` gets
the default flow, as `git -C … push` does. An allowed command skips approval
and runs outside the sandbox; everything else keeps the sandbox and the
approval flow.

The residual: an allowed command can run code written inside the sandbox. The
hooks run from `.husky/` in the working tree, `pnpm agent-tools` runs the root
`package.json` script and the built `agent-tools/dist`, and a merge brings in
whatever `.husky/` changes the merged branch carries. That code runs as the
signed-in user, with that user's own git and gh credentials. The same residual
exists on Claude seats and is unowned in both. GitHub's ruleset on the
default branch binds every push through the merge bot, which does not bypass it
(see [the merge bot](../docs/engineering/merge-bot.md)), and the bot's own
refusals are the first line; the ruleset does not bind a push made under a
credential that can bypass it.

Run each landing command as one plain command, or Codex does not match it:

- use the tool's working directory, never `cd … &&` or `git -C …`;
- pass a commit message with `-F <file>`;
- write no `$`, redirection, heredoc or subshell into the command.

The forbidden rules are guardrails, as a Claude seat's deny list is: a flag
matches only in the position right after the subcommand and only as spelled,
so `git commit -F m --no-verify`, an abbreviation such as `--no-verif` or a
bundled `-nF m` is still allowed by prefix. The doctrine stands beside the
rules:
[`no-verify-requires-fresh-authorisation`](../.agent/rules/no-verify-requires-fresh-authorisation.md),
the [commit](../.agent/skills/change-custody/commit/SKILL-CANONICAL.md) and
[pull request](../.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md)
workflows.

`approvals_reviewer` is each seat's own choice in its user config, and the
repository sets none. The landing commands bypass the reviewer because they are
allowed outright, which is why a seat using `auto_review` is not refused a
push. The exception is a turn in which a granted permission request switched
on strict auto-review. The reviewer still sees every other escalation.

Codex reads rules from the checkout the seat launched in, at session start. A
seat launched from a checkout without this file gets no rules: sync that
checkout, then restart the seat. The same checkout is writable through the
allowed commands, so a seat that rewrote this file and restarted would run its
own policy. The rules guard a cooperative seat, as a Claude seat's settings in
its checkout do; they are not a boundary against a seat that rewrites them. With the `shell_zsh_fork` feature on (it is
off by default), Codex matches each command by its absolute path, so no landing
command matches and every one takes the default flow.

## Machine-local seat setup

These are machine-local and never in the repository:

- the trust entry, `[projects."<main checkout path>"] trust_level = "trusted"`
  in `$CODEX_HOME/config.toml`; one entry covers every linked worktree, and
  without it no project config, hook or rule loads;
- the SessionStart hook's trusted hash, set through `/hooks`;
- `approvals_reviewer` in `$CODEX_HOME/config.toml`;
- the launch mode: attended seats take the default; an unattended seat
  launches with `-a never`, and the sandbox bounds every command except the
  landing commands;
- tokens, such as the merge bot's app key and `GH_TOKEN`, from the environment;
- a `PATH` with no relative or sandbox-writable entry (`.`, `node_modules/.bin`,
  `/tmp`, `$TMPDIR`) ahead of git and pnpm, since the rules trust the bare
  names that `PATH` resolves.

Codex appends each "always allow" approval to `$CODEX_HOME/rules/default.rules`.
Check that file holds no `git push` allow. Never run `/import` in this
repository: it rewrites the project config whole.

## Skills and custom workflows

Codex custom workflows do not appear as project-defined slash commands.
Codex's `/` popup is the built-in command surface; repo workflows in
`.agents/skills/` are invoked through `/skills` or by typing a `$skill-name`
mention such as `$oak-gates`.

Reviewer subagents are not skills. Skills add reusable task procedures to the
current agent; project agents create separately configured agent roles.

`$oak-cricket` is the one-command conscience-check entry point. On Codex it
dispatches the registered Sol/low judgement, Terra/medium judgement, and
Luna/xhigh compiled-procedure roles in normal and adversarial waves. Select the
roles by `agent_type` without spawn-time model or effort overrides; their TOML
files own those bindings. Start a fresh trusted-project session after changing
role definitions so the spawn schema reloads them.

See the official
[Codex skills](https://developers.openai.com/codex/skills),
[Codex subagents](https://developers.openai.com/codex/multi-agent), and
[Codex CLI slash commands](https://developers.openai.com/codex/cli/slash-commands)
documentation.

## Structure

```text
.codex/
├── config.toml           # Trusted-project policy, hooks, agents, and MCP
├── README.md             # This file
├── rules/
│   └── seat-landing.rules  # Exec-policy rules for the landing commands
├── hooks/
│   └── practice-session-identity.mjs  # Thin SessionStart adapter
└── agents/               # Generated per-role adapter TOMLs (pnpm portability:fix)
    ├── code-expert.toml
    ├── test-expert.toml
    ├── ...
    └── architecture-expert-wilma.toml
```

The hook adapter delegates to the shared `agent-tools` implementation. It is a
soft identity/context surface: it emits deterministic identity plus a short
pointer to the generated team-alert bootstrap in `AGENTS.md`. It does not
implement the canonical watcher procedure, destructive-command guard, or
content guard.

## Reviewer Roster

All reviewer adapters are registered in `config.toml`, alongside the
non-expert helper agents `ground-truth-designer` and `subagent-architect`.
Each `agents/*.toml` and each `[agents."<name>"]` block after `config.toml`'s hand-kept
head is rendered by `pnpm portability:fix` from the template's frontmatter declaration
(`.agent/sub-agents/README.md` §Declarations) and recomputed by `pnpm portability:check`;
none is edited by hand. Each adapter is a self-describing project-scoped custom
agent: it carries `name`, `description`, Codex execution settings, and
`developer_instructions` that point to the canonical template in
`.agent/sub-agents/templates/`. The architecture-expert variants additionally
reference an individual persona component in
`.agent/sub-agents/components/personas/`.

In `.codex/config.toml`, each `agents.<name>.config_file` value is relative to
`.codex/config.toml` itself, so entries point to `agents/<name>.toml`, not
`.codex/agents/<name>.toml`.

For the full reviewer invocation matrix and timing guidance, see
`.agent/memory/executive/invoke-code-experts.md`.

## Resolver Workflow

When reviewing from Codex, do not assume the runtime has automatically loaded
the repo-local reviewer adapter. Resolve the reviewer first:

```bash
pnpm agent-tools:codex-reviewer-resolve code-expert
```

That command prints the exact `.codex/agents/*.toml` adapter and canonical
`.agent` files that should ground the review. `--json` is available for audit
or automation.

## Hook workflow

Codex hooks are stable in CLI `0.145.0`. The tracked project config currently
enables only:

```text
SessionStart(startup|resume)
  -> .codex/hooks/practice-session-identity.mjs
  -> agent-tools Codex identity hook
  -> identity and team-alert pointer in hookSpecificOutput.additionalContext
```

Root `AGENTS.md` is the guaranteed Codex-native instruction surface. Its
bounded team-alert block is generated from the canonical watcher rule; run
`pnpm codex-team-alert-bootstrap:generate` after changing that source block.
`repo-validators:check` recomputes the projection and rejects drift. The hook
pointer is a trusted-project reminder, not a replacement for `AGENTS.md` and
not evidence that watcher output wakes the reasoning loop.

Use `/hooks` to inspect and trust project hooks. Project trust and hook trust
are security boundaries, not onboarding noise. Do not use
`--dangerously-bypass-hook-trust` interactively; it exists for automation
which already vets the hook source.

The full lifecycle includes `SessionEnd`, subagent, tool, approval, compaction,
prompt, and stop events. Availability upstream does not mean this repository
has activated each event. See [Codex hooks][hooks] and the canonical
[hook policy](../.agent/hooks/README.md).

[hooks]: https://developers.openai.com/codex/hooks

## MCP workflow

The two `[mcp_servers]` entries in `config.toml` are project-scoped remote MCP
connections. Codex can also load user or plugin MCP servers and supports STDIO
and streamable HTTP transports. Server authentication and external-service
authorisation remain separate from the local sandbox.

Use `codex mcp list` or `/mcp` to inspect effective servers. Do not infer the
effective tool inventory from this file alone because higher-authority managed
requirements and user configuration can enable, disable, or constrain servers.

## Entry Points

- [AGENTS.md](../AGENTS.md) — Codex entry point, links to AGENT.md
- [AGENT.md](../.agent/directives/AGENT.md) — Operational directives and rules
- [Practice Core](../.agent/practice-core/index.md) — The full Practice system
- [Capability catalogue][catalogue] — official-source Codex CLI baseline
