# Agent Tools

CLI tools for managing and monitoring AI agent workflows in this repository.

## claude-agent-ops

**Path**: `.agent/tools/claude-agent-ops`

A CLI for monitoring and managing Claude Code background agents. It tracks
agent progress via JSONL output files, inspects worktree-isolated agent
changes, and identifies what needs committing after parallel agent work.

This tool is **Claude-specific** — it is tightly coupled to Claude Code's
background agent model (task output files in `/private/tmp/claude-*/`,
git worktrees, sandbox restrictions). Generalisation to other agent
platforms is future work.

### Commands

| Command | Description |
|---------|-------------|
| `preflight` | Run pre-flight checks (clean tree, no stale worktrees, gates green) before launching parallel agents |
| `status` | Unified dashboard: agent ID, phase, tool count, elapsed time, worktree state, recent tools |
| `status --watch` | Auto-refresh the dashboard every 5 seconds |
| `worktrees` | List active agent worktrees with branch name and change count |
| `log <id>` | Show recent tool calls and text messages for a specific agent (partial ID match) |
| `diff [id]` | Show uncommitted changes in the main working tree or a specific agent worktree |
| `commit-ready` | List all locations (main tree + worktrees) with uncommitted agent changes |
| `cleanup` | Remove completed worktrees, prune dead references, delete orphaned worktree branches |

### Phase Detection

The `status` command infers each agent's current lifecycle phase from tool call
patterns in its JSONL output:

| Phase | Detection Signal |
|-------|-----------------|
| `researching` | Only Read/Grep/Glob tool calls observed |
| `implementing` | Write or Edit tools used |
| `testing` | Bash calls containing `pnpm test`, `pnpm build`, `pnpm lint`, etc. |
| `committing` | `git commit` command detected |
| `creating PR` | `gh pr create` or `git push` detected |
| `done` | `stop_reason: end_turn` in final JSONL entry |

### Usage

```bash
# Before launching parallel agents
.agent/tools/claude-agent-ops preflight

# During parallel work — unified view
.agent/tools/claude-agent-ops status
.agent/tools/claude-agent-ops status --watch    # auto-refresh

# Drill into a specific agent
.agent/tools/claude-agent-ops log a4fbb406
.agent/tools/claude-agent-ops diff a4fbb406

# Worktree detail
.agent/tools/claude-agent-ops worktrees
.agent/tools/claude-agent-ops commit-ready

# After parallel work
.agent/tools/claude-agent-ops cleanup
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `AGENT_TASKS_DIR` | Override auto-detected Claude tasks output directory |
| `AGENT_SUBAGENTS_DIR` | Override auto-detected subagents JSONL directory |
| `REPO_ROOT` | Override auto-detected repository root |

### How It Works

1. **Dual-source agent detection**: Discovers agents from both the tasks
   output directory (`/private/tmp/claude-*/`) and the subagents JSONL
   directory (`~/.claude/projects/*/subagents/`). Worktree agents are always
   included; non-worktree agents need ≥2 assistant messages to appear.
2. **Worktree correlation**: Maps agent short IDs (8-char prefix from worktree
   directory names) to full JSONL files in the subagents directory.
3. **Phase inference**: Analyses tool call sequences in the JSONL to detect
   the agent's current lifecycle phase (research → implement → test → commit → PR).
4. **Elapsed time**: Computes running time from the first JSONL timestamp.
5. **Worktree state**: Shows commit count and uncommitted file count per worktree.

## Future Improvements

- **Skill integration**: Expose `claude-agent-ops` as a Claude skill so agents can self-monitor
- **Structured output**: JSON output mode for programmatic consumption by coordinating agents
- **Agent orchestration**: Commands for launching, resuming, and cancelling background agents
- **Cross-platform support**: Adapt path detection for Linux (`/tmp/claude-*/`) and other platforms
- **Worktree cherry-pick**: Commands to cherry-pick changes from completed worktrees into the main tree
- **Log filtering**: Filter agent logs by tool name, error patterns, or time range
- **Generalisation**: Abstract the agent-detection layer to support non-Claude agent platforms
