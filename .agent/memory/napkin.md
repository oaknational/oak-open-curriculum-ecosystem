## Session 2026-04-03 — napkin rotation and consolidation

### What Was Done

- Rotated napkin after reaching 632 lines (threshold: 500). Archived to
  `napkin-2026-04-03.md`. Merged 5 new behaviour-changing entries into
  `distilled.md`: review scope separation, Turbo override completeness,
  MCP Apps single callback slot, `console` ban meaning, and the
  `rg -uu` ignored-estate rule from the prior session.
- Extracted the "UX predates visual design" pattern to
  `.agent/memory/patterns/ux-predates-visual-design.md` — the first
  session with visual UI revealed that audience-facing UX decisions had
  been accumulating unnamed across CLIs, SDKs, MCP tools, and
  documentation for months.
- Updated session-continuation.prompt.md: deferred review findings are
  now a gate (must be resolved before Phase 4), each with an honest
  assessment of whether it's genuinely pre-existing or could have been
  fixed in this session.
- Found 5 skills missing from `.claude/settings.json` permissions
  allowlist: `jc-session-handoff`, `jc-go`, `jc-metacognition`,
  `jc-gates`, `jc-review`. The portability validator checks adapter
  existence but not platform permission authorisation — a validation
  gap.
- Split `.claude/settings.json` into project (tracked) and
  `settings.local.json` (gitignored). Project config defines the
  agentic system contract: skill permissions, safety hooks, plugin
  state. User-specific paths and one-off permissions move to local.
  Arrays concatenate across scopes per Claude Code merge semantics.
- Graduated the settings portability principle to permanent docs:
  ADR-125 now has a "Platform Configuration" section, distilled.md
  has a behaviour-changing entry, and a new pattern
  "platform-config-is-infrastructure" was extracted.
- Follow-up still needed: extend portability validator to check skill
  permission entries (validator gap, not doctrine gap).

## Session 2026-04-03 — research shortlist implementation

### What Was Done

- Implemented the external-concept promotion pack in the
  `agentic-engineering-enhancements` evidence template and added a
  pilot evidence bundle with three research-derived proposals
  (promotion discipline, delegation snapshot, health probe).
- Upgraded reviewer/delegation doctrine locally: layered triage,
  explicit review depth, coverage tracking, delegation snapshot fields,
  and reintegration wording now live in the directive, rule, gateway
  template, and `parallel-agents` skill.
- Named the hook precedence model as a local `Policy Spine` in the hook
  README and cross-platform surface matrix, then tightened the
  portability helper test to require that terminology plus
  `override/prune/block` semantics.
- Added `claude-agent-ops health`, implemented as a summary-first
  agent-infrastructure probe with deterministic checks for command
  adapters, reviewer adapters/registrations, hook-policy coherence,
  practice-box state, and continuity-prompt freshness.
- Extended takeover bundles with an explicit reintegration contract and
  documented the new health surface across `AGENT.md`, `AGENTS.md`,
  `CLAUDE.md`, `.agent/README.md`, the artefact inventory, repo
  README, and `agent-tools/README.md`.
- Verification passed: `pnpm --filter @oaknational/agent-tools lint`,
  `pnpm --filter @oaknational/agent-tools build`,
  `pnpm --filter @oaknational/agent-tools test`, and
  `pnpm test:root-scripts`.
- Live health result is intentionally `WARN`, not `PASS`: the new probe
  found a real continuity drift where
  `.agent/prompts/session-continuation.prompt.md` still says the
  practice box has 18 incoming items while
  `.agent/practice-core/incoming/` currently has 0.
