---
id: first-class-copilot-cli-practice-citizenship
node_type: strategic
name: First-class Copilot CLI Practice citizenship
overview: "Make a locally running GitHub Copilot CLI session an equal first-class participant in the repository's canonical Practice and agentic tools."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-24
ratified_where: "PR #529 owner ratification record: https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/529#issuecomment-5079688100"
serves: FRAME-1
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets:
  - MCP-150
  - MCP-154
  - MCP-155
  - MCP-156
last_updated: 2026-07-25
---

# First-class Copilot CLI Practice citizenship

## Dated notes

- **2026-07-25** — Corrected platform capability facts and the distinction
  between bounded claim registration in every working session and continuous
  team participation. These amendments do not widen the ratified outcome.
- **2026-07-30** (backfilled 2026-07-31 by the comms-corpus run) —
  Official-source-verified Copilot CLI platform facts for this plan's
  executors: skill precedence is `.github/skills` > `.agents/skills` >
  `.claude/skills`, FIRST-FOUND-WINS per skill name (a repo `.github` copy
  silently shadows the canonical `.agents` adapter — placement is a
  correctness decision, not a convenience); repository-level skills resolve
  before user-level ones. Version-pin any recorded verdict on these facts —
  the CLI's resolution order is vendor surface and can move.

## Outcome

A GitHub Copilot CLI process running locally alongside Claude and Codex can
enter this repository, identify itself honestly, deliberately join the same
team Practice, use the same canonical capabilities through its supported native
surfaces, exchange team messages, and leave executable proof of that
participation.

## The bet

First-class citizenship is behavioural, not a count of matching files. The
Practice remains canonical under `.agent/`; thin, validated GitHub projections
adapt it to Copilot CLI's real asymmetries. Native startup provides repository
and identity context and creates no shared coordination state. Claims are not
that boundary: any working session, quick-start included, must register a
bounded active claim before its first edit, because the always-loaded
registration rule binds that obligation independently of which start-right
skill ran. `oak-start-right-team` remains the deliberate boundary that enrols a
session in *continuous* team participation — heartbeat emission, the
all-channels watcher, and the handoff/retirement lifecycle.

The bet is deliberately local and narrow. GitHub Copilot coding-agent or cloud
execution, remote transport, hosted bridges, and a parallel Codex programme do
not serve this node.

## Success looks like

- A local Copilot CLI session has stable, truthful Copilot identity and can
  choose whether to join the team Practice.
- A joined session receives canonical instructions, skills, specialist agents,
  policy enforcement, and repository MCP tools through supported Copilot CLI
  surfaces without creating a second authority.
- Directed and broadcast communications, watcher recovery, handoff, and
  retirement work on the existing local coordination substrate.
- Repository validators prove generated-projection freshness, closed platform
  boundaries, and exactly one policy evaluation for each successfully
  dispatched write request.
- A live Copilot CLI acceptance seat proves the complete local journey.

This node records the ratified target. It does not claim those runtime
capabilities are wired before their delivery plans land and their proofs pass.

## Delivery

Delivery plans serving this node declare
`serves: first-class-copilot-cli-practice-citizenship` — enumerate them by
search, never by a hand-kept list. Milestones and execution state live in
MCP-150, MCP-154, MCP-155, and MCP-156.
