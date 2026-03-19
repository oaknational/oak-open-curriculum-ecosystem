## Session 2026-03-14 — Distillation rotation

### What Was Done

- Archived outgoing napkin to `archive/napkin-2026-03-14.md` (549 lines,
  covering sessions 2026-03-11 to 2026-03-14).
- Added commitlint body-max-line-length entry to distilled.md Troubleshooting.
- distilled.md now at 187/200 lines — within ceiling.
- No other entries required graduation this pass — existing entries are
  still operational (not yet superseded by permanent docs or specialist
  implementations).

## Session 2026-03-15 — Archive cutover hygiene

### What Was Done

- Archived completed recovery authorities from `semantic-search/active/` to
  `semantic-search/archive/completed/` and rewired indexes/prompt/roadmap to
  the new locations.
- Ran reviewer sweep (`docs-adr-reviewer`, `code-reviewer`,
  `elasticsearch-reviewer`) and fixed all reported actionable findings.
- Re-ran markdown lint after fixes.

### Lessons

- When moving plan docs deeper in the tree, re-check all relative links in the
  moved files; `../archive/completed/...` paths inside `archive/completed/`
  become broken immediately.
- Evergreen ops docs must not rely on archived runbooks for live decision
  criteria; carry critical deterministic selection rules directly in the ops
  document.

## Session 2026-03-15 — Consolidate-docs sweep

### What Was Done

- Ran stale-link sweep for archive cutover and fixed two live references that
  still pointed to deleted `active/` recovery plan paths.
- Checked platform-specific plan/memory locations for extractable settled
  documentation; no new settled technical guidance required extraction this pass.
- Re-ran markdown lint and docs review after updates.

### Lessons

- After archive moves, stale references may remain in "current" plans and
  code-pattern "further reading" links, not just in prompts and active indexes.

## Session 2026-03-15 — Start-right quick re-ground

### What Was Done

- Re-ran `start-right-quick` grounding against the active semantic-search
  prompt and findings register.
- Confirmed `practice-core/incoming` is empty (no cross-repo incoming material
  to integrate this session).
- Reviewed operator terminal evidence showing the in-flight versioned ingest
  completed successfully at `v2026-03-15-134856`.

### Lessons

- Session prompt and findings register can drift behind live terminal state;
  when ingest completion evidence exists, update both documents together before
  progressing remediation status for active findings.

## Session 2026-03-15 — Post-ingest readback and retest

### What Was Done

- Completed post-ingest readbacks after `v2026-03-15-134856`:
  `admin validate-aliases`, `admin meta get`, `admin count`, `admin verify`.
- Ran live `oak_meta` mapping contract validation using
  `ensureIndexMetaMappingContract` against production (`OK`).
- Re-ran production search-tool retests through the `search` MCP tool for
  `F1`/`F2`.
- Updated semantic-search prompt + active findings register with fresh
  evidence and status updates.

### Lessons

- In this workspace, `CallMcpTool` supports an `arguments` payload even though
  the simplified local type stub does not list it; for tool-driven validation,
  rely on descriptor + runtime behaviour.
- `search` CLI subcommands do not expose all MCP filter parameters
  (`threadSlug`, `category`), so production filter-semantics retests must run
  against the MCP tool itself.
- In findings docs, separate "codebase remediation landed" from "remediation
  deployed to production"; otherwise retest interpretations become ambiguous.

## Session 2026-03-15 — Comprehensive field-integrity test planning

### What Was Done

- Created an executable active plan for comprehensive all-field integration
  testing across all pipeline stages and index families:
  `comprehensive-field-integrity-integration-tests.execution.plan.md`.
- Updated active index, session prompt, and roadmap to make the new plan
  discoverable in all required surfaces.

### Lessons

- For this lane, plan quality depends on expressing "all fields" as generated
  inventory + stage-contract matrix, not ad hoc lists, to keep coverage
  deterministic and drift-resistant.

## Session 2026-03-15 — Plan/prompt hardening review cycle

### What Was Done

- Ran deep read across active semantic-search prompt, active field-integrity
  execution plan, retrieval/indexing code paths, and live ES state via EsCurric
  MCP.
- Updated plan/prompt to enforce pre-ingest no-blindness gates:
  field-level readbacks, mapping-aligned filter semantics, CI-vs-operator split,
  and explicit TDD/testing constraints.
- Completed iterative reviewer closure with `docs-adr-reviewer`,
  `test-reviewer`, and `elasticsearch-reviewer` until no actionable findings
  remained.

### Lessons

- Reviewer cycles on planning docs can surface concrete execution hazards
  (broken relative links, non-existent script references, CI determinism gaps)
  before implementation starts.
- For ES-heavy plans, include refresh-visibility handling in readback evidence
  criteria; otherwise post-ingest population checks can produce false negatives.

## Session 2026-03-18 — Pine-Scripts Process Readback

### What Was Done

- Added incoming analysis note
  `practice-context/incoming/pine-scripts-mcp-relevant-conclusions.md`
  to preserve the oak-relevant conclusions from the `pine-scripts`
  integration process
- Captured the cross-repo pattern that oak is still the richer source
  substrate, but `pine-scripts` is now an active adaptation lab rather than a
  passive receiver

### Lessons

- The most dangerous Practice integration failure is inert installation:
  structurally correct files with insufficient activation depth, especially in
  metacognition
- `metacognitive-primacy.md` is supported by field evidence from
  `pine-scripts`, not just by intuition
- Incoming context can hold real analytical value before canonicalisation;
  transient does not mean disposable
