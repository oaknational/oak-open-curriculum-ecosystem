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
- Follow-up needed: extend portability validator to check skill
  permission entries; document the project/local split in AGENT.md
  and ADR-125.
