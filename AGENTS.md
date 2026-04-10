<!-- Rapidly become a standard file for AI Agent config-ish instructions. -->
<!-- Also the default file for Codex agent instructions -->

# AGENTS.md

Read [AGENT.md](.agent/directives/AGENT.md)

## Agent Tool Discovery

Primary agent workflow CLIs live in `agent-tools/` and are invoked from repo root:

- `pnpm agent-tools:claude-agent-ops status`
- `pnpm agent-tools:claude-agent-ops health`
- `pnpm agent-tools:cursor-session-from-claude-session find --last-hours 2`
- `pnpm agent-tools:codex-reviewer-resolve code-reviewer`

## Learned User Preferences

- Record durable learnings primarily in `.agent/memory/napkin.md`, distilled documentation, or ADRs by how fixed they are; keep `AGENTS.md` as a lightweight agent-facing surface.
- Treat ADRs as historical decision records: they inform later work but do not permanently bind future architecture or block innovation.

## Learned Workspace Facts

- Both codegen-time pipelines and runtime deployments involve build steps; avoid using "build time" as an unqualified umbrella when the distinction between codegen-time and runtime matters.
- Use Knip and dependency-cruiser (alongside other tools) when analysing workspace boundaries and dependencies.
