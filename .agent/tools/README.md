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
| `status` | Dashboard showing all background agents with turn count, status, last tool used, and latest activity |
| `worktrees` | List active agent worktrees with branch name and change count |
| `log <id>` | Show recent activity log for a specific agent (supports partial ID match) |
| `diff [id]` | Show uncommitted changes in the main working tree or a specific agent worktree |
| `commit-ready` | List all locations (main tree + worktrees) with uncommitted agent changes |
| `cleanup` | Remove completed worktrees, prune dead references, delete orphaned worktree branches |

### Usage

```bash
# Before launching parallel agents
.agent/tools/claude-agent-ops preflight

# During parallel work
.agent/tools/claude-agent-ops status
.agent/tools/claude-agent-ops worktrees
.agent/tools/claude-agent-ops log ae5ee7b
.agent/tools/claude-agent-ops commit-ready

# After parallel work
.agent/tools/claude-agent-ops cleanup
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `AGENT_TASKS_DIR` | Override auto-detected Claude tasks output directory |
| `REPO_ROOT` | Override auto-detected repository root |

### How It Works

1. **Task detection**: Scans `/private/tmp/claude-{uid}/{escaped-repo-path}/tasks/` for `.output` JSONL files
2. **Agent identification**: Filters by agent ID length (≥15 chars) and minimum turn count (≥2) to exclude non-agent output files
3. **Status inference**: Parses `stop_reason` from JSONL — `end_turn` = completed, `tool_use` = running
4. **Worktree tracking**: Scans `.claude/worktrees/agent-*` directories for git status

## Future Improvements

- **Skill integration**: Expose `claude-agent-ops` as a Claude skill so agents can self-monitor
- **Structured output**: JSON output mode for programmatic consumption by coordinating agents
- **Agent orchestration**: Commands for launching, resuming, and cancelling background agents
- **Cross-platform support**: Adapt path detection for Linux (`/tmp/claude-*/`) and other platforms
- **Worktree cherry-pick**: Commands to cherry-pick changes from completed worktrees into the main tree
- **Log filtering**: Filter agent logs by tool name, error patterns, or time range
- **Generalisation**: Abstract the agent-detection layer to support non-Claude agent platforms
