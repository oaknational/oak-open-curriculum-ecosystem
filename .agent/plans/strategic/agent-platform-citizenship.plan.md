---
id: agent-platform-citizenship
node_type: strategic
name: "Agent-platform Practice citizenship"
overview: "Every capable agent platform — Copilot CLI, Codex, and those to come — can be an equal first-class participant in the repository's canonical Practice and agentic tools, joining through its own supported native surfaces; GitHub Copilot CLI is the first fully-worked instance."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-01
ratified_where: "PR #529 owner ratification record (the Copilot CLI instance): https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/529#issuecomment-5079688100; WIDENED to all agent platforms by owner decision card 2026-08-01 (Director session Falcon hunts Flight 52841f) — the widening generalises the already-ruled all-platforms-are-first-class principle, with the Copilot content retained below as the first instance"
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
last_updated: 2026-10-02
---

# Agent-platform Practice citizenship

## The widened node (owner-carded 2026-08-01)

Citizenship is platform-general: the Practice remains canonical under
`.agent/`, and any capable agent platform participates as an equal
first-class citizen through its own supported native surfaces — honest
identity, deliberate join, canonical capabilities, team comms, and
executable proof of participation. This node was born Copilot-CLI-specific
(id `first-class-copilot-cli-practice-citizenship`); the owner widened it
2026-08-01 rather than minting a sibling, because the principle it encodes
— all agent platforms are first-class citizens — was already ruled and the
Copilot work is one instance of it, not its boundary. Two participation
modes serve this node:

- **Membership** — a platform session joins the Practice as a peer seat
  (identity, claims, comms, its own clock). The Copilot CLI instance
  below is the worked programme; the Codex peer seats are live practice.
- **Invocation** — a platform is called as a bounded instrument from
  within another platform's session, under the Subagent Invocation
  Framework (Sif) and its per-binding annexes. Instruments are not
  citizens; the clean line between the modes is part of the citizenship
  design, so neither erodes the other.

## Dated notes

- **2026-08-01** — `ratified_date` moved to 2026-08-01, the date the
  platform-general widening was ratified (owner decision card, Director
  session 52841f). The narrower Copilot-only instance was originally
  ratified 2026-07-24 (PR #529 record, preserved in `ratified_where`);
  the structured stamp now dates the outcome the node currently states.
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
- **2026-08-01** — Widened to all agent platforms (owner card; see
  ratified_where). The Copilot-specific bet, success criteria, and
  execution state are retained unchanged below as the first instance.
- **2026-09-28** — The owner's word to the Director, relayed by the Director
  (event decbef38), verbatim: "I am deprioritising Codex support for now, we
  have made progress, we will come back to it later." The Director's record of
  the same day reads the Codex goal as paused until the owner returns to it,
  its nodes unseated: codex-queue-wake-bridge (ratified), and
  codex-pretooluse-guard-parity and codex-live-acceptance-seat (sketches,
  not ratified; a pause authorises nothing in them). One instance.

## The first fully-worked instance: GitHub Copilot CLI

### Outcome

A GitHub Copilot CLI process running locally alongside Claude and Codex can
enter this repository, identify itself honestly, deliberately join the same
team Practice, use the same canonical capabilities through its supported native
surfaces, exchange team messages, and leave executable proof of that
participation.

### The bet

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

This instance's bet is deliberately local and narrow. GitHub Copilot
coding-agent or cloud execution, remote transport, and hosted bridges do not
serve this instance; other platforms' citizenship programmes serve the
widened node directly.

### Success looks like

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

Delivery plans serving this node declare `serves: agent-platform-citizenship`
— enumerate them by search, never by a hand-kept list. The Copilot instance's
milestones and execution state live in MCP-150, MCP-154, MCP-155, and
MCP-156.
