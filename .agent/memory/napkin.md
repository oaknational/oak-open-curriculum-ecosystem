## Session 2026-03-19 — Semantic search investigation

### Lessons

- F1/F2 root causes and findings are in the authority docs (prompt, plan,
  findings register) — not here. Check those for details.
- Tracing a bug through real bulk data files (not just test fixtures) is
  essential: the F2 root cause (`categoryMap` never wired) was invisible
  from tests alone because test fixtures accepted empty `categoryTitles`.
- When infrastructure is 100% built but never connected, tests can pass
  at every individual stage while the end-to-end pipeline is broken. The
  cross-stage test caught F1 but not F2 because the fixture didn't model
  the `categoryMap` dependency.

---

## Session 2026-03-19 — Practice context integration and fitness upgrade

### What Was Done — Phase 1: Incoming integration

- Reviewed all 8 incoming practice-context files from pine-scripts cross-repo
  propagation
- Adopted material from 4 files into Practice Core:
  - `metacognitive-primacy.md` → restructured Philosophy layer, metacognition
    framing in lineage, learned principle
  - `practice-maturity-model.md` → new §Practice Maturity section in lineage
  - `pine-scripts-integration-field-report.md` → 2 learned principles
    (infrastructure, "not even wrong")
  - `practice-seeding-protocol-suggestions.md` → hydration/preservation
    distinction, activation checks in bootstrap
- Informed by 3 files (no artefact changes needed):
  - `pine-scripts-mcp-relevant-conclusions.md` — summary of other files
  - `cross-repo-preservation-lessons.md` — operational migration lessons
  - `plan-lifecycle-refinement.md` — oak already has richer lifecycle
- Adopted 1 learned principle from `sub-agent-component-model-proposal.md`
  (empty stubs are harmful)
- Updated CHANGELOG.md with integration record
- Cleared incoming files after integration

### What Was Done — Phase 2: Outgoing context and fitness upgrade

- Created 3 new outgoing practice-context files:
  - `cross-repo-transfer-operations.md` — operational migration lessons
  - `plan-lifecycle-four-stage.md` — simpler lifecycle for less mature repos
  - `seeding-protocol-guidance.md` — source-side transfer protocol
- Created then deleted `sub-agent-component-architecture.md` — redundant
  with existing `reviewer-system-guide.md`
- Refined 2 pre-existing outgoing files:
  - `reviewer-system-guide.md` — added clerk-reviewer, empty stubs pitfall,
    activation depth pitfall, removed speculative Antigravity references
  - `platform-adapter-reference.md` — removed Antigravity row
- Added named promotion states (received/promoted/rejected) to Integration
  Flow in `practice-lineage.md`
- Tightened `practice-lineage.md` under ceiling: moved validation scripts
  to outgoing context, compressed verbose sections via §-references
- Upgraded fitness functions to three-dimension metric:
  - Line count + character count + max prose line width (100 chars)
  - Reflowed all three trinity files to 100-char prose lines
  - New `scripts/validate-practice-fitness.mjs` script
  - `pnpm practice:fitness` command added
  - Updated frontmatter, §Fitness Functions, §Other fields, learned principle

### Lessons

- The prior session's dismissal was a metacognitive failure — applying a
  mechanical "already covered" filter instead of asking "would this make what
  we have better?" The distinction between "present" and "primary" matters.
- Incoming context files have different value profiles: some carry unique
  frameworks (maturity model), some carry unique framing (hydration vs
  preservation), some are summaries of richer material. Engage with each on
  its own terms.
- Line-count-only fitness ceilings create a perverse incentive: "tightening"
  can mean making lines longer. Character count is the honest constraint;
  prose line width prevents the gaming mechanism; line count remains the
  intuitive "feel" check. All three are needed.
- Outgoing practice-context files should be refined distillations, not copies
  of incoming material. The existing reviewer-system-guide was already a good
  document — creating a redundant new file was waste. Check for overlap first.

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
