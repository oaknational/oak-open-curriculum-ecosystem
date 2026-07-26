---
id: copilot-cli-practice-projections
node_type: delivery
name: Copilot CLI Practice projections
overview: "Expose canonical instructions, skills, specialist agents, and session-scoped MCP tools through local-CLI-only Copilot surfaces without creating another authority."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-24
ratified_where: "Owner in-session word 'Implement the plan', relayed by Director Forge rides Brimstone in collaboration event 444463f6-d93f-41c1-81c5-a39b3205338f"
serves: first-class-copilot-cli-practice-citizenship
impact_areas:
  - practice-and-estate
tickets:
  - MCP-155
depends_on:
  - plan: copilot-cli-identity-and-practice-join
    kind: blocking
owner_gates: []
last_updated: 2026-07-24
---

# Copilot CLI Practice projections

## Goal

A clean local Copilot CLI checkout discovers the repository's canonical
instructions and existing skills directly, then the deliberate launcher
materialises specialist agents, bounded path instructions, and MCP tools
through local-CLI-only paths, with deterministic proof that every projection
is current and thin.

## Mechanism

Keep canonical content in `.agent/`. Use Copilot CLI's direct discovery of the
existing root `AGENTS.md` and `.agents/skills` rather than changing shared
GitHub.com surfaces. After successful installed-capability probes, the local
launcher:

- sets `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` to generated, gitignored
  `.agent/runtime/copilot/instructions/`;
- atomically installs namespaced generated specialist agents under the
  resolved local `COPILOT_HOME/agents`, preserving user-owned entries and
  recording an owned-entry manifest plus per-session leases for reversible
  cleanup; and
- passes a generated, gitignored, secret-free MCP file through
  `--additional-mcp-config=@...` for that session only.

Tracked `.github/agents`, `.github/instructions`, `.github/hooks`, `.mcp.json`,
and `.github/mcp.json` projections are forbidden: each is shared with a hosted
or non-CLI consumer. The existing `.github/copilot-instructions.md` is also
left unchanged; this delivery relies on `AGENTS.md` to avoid widening its
already-shared effect.

Three total disposition manifests make the source sets recomputable:

1. Every live `.agent/rules/*.md` source is classified `repo-wide`,
   `local-path-projected`, or `excluded` with a reason. A local path projection
   is selected only when file-scoped activation is expressible through Copilot
   `applyTo` and adds behaviour beyond the repo-wide `AGENTS.md` entry point.
2. Every live, non-archived `.agent/sub-agents/templates/*.md` specialist is
   classified `projected` or `excluded` with a reason.
3. Every server found in tracked platform MCP configuration is reconciled into
   or explicitly excluded from the new canonical manifest. No platform
   adapter, including `.cursor/mcp.json`, becomes authority by inheritance, and
   no secret or host path enters the session-scoped output.

Platform metadata adapts invocation; it does not copy doctrine.

Each relied-upon instruction, agent, skill, and MCP surface has its own
declared tested Copilot CLI version floor and executable installed-capability
probe. Generators may render candidates for fixture comparison, but the
launcher must not activate or install a local projection until the
corresponding probe passes. An unsupported version or failed probe leaves that
surface inactive and blocks the affected vertical from claiming support.

The MCP-154 launcher is a blocking runtime primitive. MCP-155 extends that
launcher only after identity/join lands; it does not create an
identity-independent competing entry point.

User-level agent installation is leased, not persistent. Under one local lock,
startup installs or refreshes only owned namespaced entries and records a lease
for the current repository session. Normal exit releases that lease and removes
the owned entries when the last live lease ends. `sessionEnd`, launcher-exit,
and bounded stale-lease cleanup cover abnormal termination. Concurrent sessions
cannot remove entries still held by another live lease. Every installed wrapper
also verifies the current repository identity and refuses invocation elsewhere;
after the final lease or stale cleanup, no Oak-owned agent file remains globally
visible. Cleanup never removes or overwrites a user-owned entry.

The exact upstream field mappings and generated-file manifests live in MCP-155.

## Acceptance criteria (each with a proof)

- **Every relied-upon instruction, agent, skill, and MCP surface declares a
  tested supported CLI version floor and passes an executable installed-host
  capability probe before its local projection is installed or enabled.**
  Proof: `repo-safe` — per-surface supported, unsupported, and missing-capability
  fixtures plus generation/activation sequencing tests prove that one passing
  surface cannot activate another failing surface.
- **The directly discovered root `AGENTS.md` reaches canonical instructions,
  and launcher-scoped local projections cover the total dispositioned rule
  set without changing a hosted Copilot surface.** Proof:
  `repo-safe` — manifest-totality and projection tests require schema-valid
  `applyTo`, positive/negative matching, `**` and `**/*` recursion,
  comma-separated patterns, no `@` imports in modular files, conflict
  detection when generated projections apply together, environment scoping,
  and forbidden shared-output validation.
- **Skill discovery uses Copilot CLI's documented precedence
  `.github/skills` then `.agents/skills` then `.claude/skills`, first-found
  wins, while this repository keeps `.agents/skills` as its only chosen
  Copilot skill home.** Proof: `repo-safe` — precedence fixtures and
  stale-output validation; no `.github/skills` duplicate is emitted.
- **Every live non-archived canonical specialist is projected or explicitly
  excluded, and each local projection has mapped tool aliases and inherited
  model selection.** Proof: `repo-safe` — disposition-totality, generator,
  schema, forward-coverage, reverse-orphan, namespacing, atomic install,
  concurrent-lock, owned-manifest, preserve-user-entry, repository-identity
  guard, normal-exit, abnormal-exit/stale-lease, concurrent-session lease, and
  final-lease reversible-cleanup tests.
- **A clean checkout exposes the intended MCP tools only to the launched local
  session, without tracked secrets, machine-local paths, or user-config
  mutation.** Proof: `repo-safe` — canonical server-manifest totality over
  tracked candidates, deterministic ignored-output tests, secret/path
  validators, `--additional-mcp-config` argument proof, and fresh-checkout
  integration.
- **A real local Copilot CLI session discovers and invokes one representative
  skill, specialist agent, and session-scoped MCP tool.** Proof: `owner-held` —
  the owner runs or observes the local Copilot CLI seat and records acceptance
  evidence on MCP-155 and the implementation pull requests.

## Todos

- **Instructions-and-skills PR (round budget: at most two review rounds).**
  Establish the instruction and skill version/probe gates, prove direct
  `AGENTS.md` and `.agents/skills` discovery, and add launcher-scoped bounded
  instruction projections without a shared GitHub output.
- **Specialist-agents PR (round budget: at most two review rounds).** Generate,
  atomically install, validate, exercise, and reversibly clean up the
  namespaced local Copilot CLI agent family only after its version/probe gate
  passes. Prove repository guards and normal, abnormal, stale, and concurrent
  lease cleanup before live invocation.
- **Repository-MCP-tools PR (round budget: at most two review rounds).**
  Establish the canonical secret-free server manifest with total dispositions,
  prove the MCP version/probe gate, then generate and pass the ignored
  session-only `--additional-mcp-config` projection.

## Out of scope

- A Copilot plugin, empty speculative settings, or hand-maintained parity
  files.
- Shared `.github/agents`, `.github/instructions`, `.github/hooks`,
  `.github/mcp.json`, or `.mcp.json` projections.
- Claude-style `Skill(...)` permissions or settings semantics on Copilot CLI.
- GitHub Copilot coding-agent or cloud projections.
- Unrelated Codex adapter work.
