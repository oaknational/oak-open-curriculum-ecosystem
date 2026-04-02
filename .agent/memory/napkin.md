## Session 2026-04-02 — Plan amendments and assumptions-reviewer creation

### Key Events

- **Part A complete**: All 5 frontend-practice plan amendments applied —
  oak-components reference-only, Phase 3 reduced to 5 reviewers, provenance
  UUID removed (Phase 5, R14, Q6, risk entries, non-goal), token delivery
  via Vite clarified in ADR-145 section, blocking gate made specific.
- **Part B complete**: assumptions-reviewer created as ADR-146 with inverted
  doctrine hierarchy. Full triplet: template + skill + rule. Platform
  adapters for Cursor, Claude Code, Codex, Gemini CLI. Invocation matrix
  updated (quick-triage Q11 + on-demand list + worked example). Practice
  Core outgoing note created.
- **Part C complete**: session-continuation.prompt.md updated.
- **Validation gates passed**: `pnpm subagents:check` (19 wrappers, 19
  adapters, 16 templates) and `pnpm portability:check` both green after
  fixing two issues (missing Codex config entry, missing Cursor agent
  wrapper, missing Cursor skill adapter, missing Claude agent adapter).

### Patterns

- Portability check requires more adapters than initially obvious: Cursor
  agents, Cursor skills, Claude Code agents, Claude Code rules, Codex
  agents, Codex config, Gemini commands. Easy to miss one.
- The inverted doctrine hierarchy is a genuine design departure from
  ADR-129. Worth noting that ADR-129 says "the doctrine hierarchy assumes
  authoritative external sources exist. For purely internal domains, the
  hierarchy collapses to repo context only." The assumptions-reviewer is
  not a "purely internal domain" — it is a meta-level capability that
  intentionally inverts the standard order.

---

## Session 2026-04-02 — Assumption audit triage and consolidation

### Key Events

- **Assumption audit triage**: reviewed all findings against user
  domain knowledge. User confirmed: two workspaces needed (future
  multi-theme, multi-app), DTCG JSON committed, oak-components is
  reference-only (no consumer will adopt it), specialist agents
  created alongside workspaces, full documentation suite.
- **Amendments plan created**: streamlined Phase 3 (10 → 5-6
  reviewers), removed provenance UUID, clarified token-to-consumer
  delivery (Vite bundles CSS into mcp-app.html), specified blocking
  gate precisely.
- **Assumptions-reviewer designed**: new meta-level reviewer with
  inverted doctrine hierarchy. ADR, triplet, and invocation matrix
  planned.
- **Session prompt updated**: URL remediation moved to completed,
  amendments plan added as workstream.
- **Duplicate Cursor plan deleted**: `.cursor/plans/` copy removed
  after repo plan created.

### Patterns to Remember

- **Domain knowledge resolves assumption audits**: the assumption
  audit methodology correctly surfaces questions, but some questions
  can only be answered by the human who has sight of future work.
  The audit's value is in making the assumptions explicit, not in
  requiring all evidence to be in-repo.
- **Proportionality, not minimalism**: the user confirmed that
  "architectural excellence over expediency" means building the
  right architecture from the start, not the minimal thing. The
  assumption audit's instinct to simplify was right to question
  but wrong to conclude "over-engineering" without user context.
- **oak-components is reference-only**: none of the consuming sites
  will use it as a dependency. Token values (colours, typefaces,
  spacing) are extracted during authoring, then the relationship
  ends. This is a settled architectural decision.

## Session 2026-04-01 — MCP review and consolidation

### Key Events

- **MCP reviewer (Round 2)** on frontend-practice-integration plan:
  3 findings applied (1 high, 2 medium). R10 testing relabelled
  from "direct HTML is the idiomatic approach" to "resource-level
  a11y tests + MCP App integration verification via basic-host."
  Token CSS delivery must use real MCP App resource path. Frontend
  reviewers given explicit MCP boundary rule (they own DOM/a11y/
  tokens/React; mcp-reviewer owns _meta.ui*, registration, CSP,
  bridge lifecycle). ADR-141 added to their reading set for MCP
  App surfaces.
- **Consolidation**: removed 36 lines of pointer-only graduation
  history from distilled.md (192 → 156 lines). Deleted duplicate
  learning-loop-refinement.plan.md at `current/` — plan already
  executed and archived. Removed stale reference from session
  continuation prompt.
- **Fitness**: 3 above-target warnings (principles.md +14,
  testing-strategy.md +1, troubleshooting.md +14). No limit
  violations. testing-strategy.md is the tightest — must refine
  before Phase 1 adds 9th gate.

### Patterns to Remember

- **Two-level MCP App testing**: resource-level tests (Playwright
  + axe-core, injected CSS) prove DOM accessibility in isolation.
  MCP App integration tests (basic-host or real host) prove
  correct packaging, sandbox, CSP, and bridge lifecycle. Both
  required; neither sufficient alone.
- **MCP boundary for frontend reviewers**: accessibility-reviewer,
  design-system-reviewer, react-component-reviewer operate
  *inside* the view. mcp-reviewer operates *around* the view
  (_meta.ui*, resource registration, host lifecycle). Overlapping
  scope without this boundary leads to drift.

## Session 2026-04-01 — Napkin rotation (distillation)

Archived `napkin-2026-04-01.md` covering sessions 2026-03-31
to 2026-04-01.

Distilled 9 new entries to `distilled.md`:
- Fitness Management section (3 entries): char limit as honest
  metric, graduation vs fitness separation, user feedback as
  correction signal
- Architecture (Agent Infrastructure) section (3 entries):
  ADR-125 thin wrapper scope, ADR-135 naming deviation,
  provenance storytelling
- Repo-Specific Rules: Zod 4 `.meta()` opportunity
- Build System: empty directories after file deletion
- Plus entries queued for graduation to permanent docs in step 7

Entries from the URL remediation session (napkin lines 271–309)
were confirmed as fully documented in ADR-145 and ADR-047.
No additional distillation needed for that work.

## Session 2026-04-01 — Consolidation metacognition

### Patterns to Remember

- **Synthesis over extraction**: the consolidation workflow
  is well-built for moving sentences between files. It's
  less good at asking "what do these learnings mean
  together?" The bridge from documentation to understanding
  is where the gap lives. Consider adding a synthesis step
  that asks for the connective insight across a batch of
  graduated entries.
- **Marginal value attenuates**: early napkin rotations
  produce high-signal graduates (architectural insights,
  fundamental debugging patterns). As the system matures,
  graduates become narrower and more situational. This is
  the natural trajectory of a maturing knowledge system,
  not a flaw to fix.
- **Structural improvements > textual improvements**: plan
  archival (prevents re-execution), pattern indexing (makes
  invisible patterns discoverable) delivered more impact
  than graduating individual sentences to permanent docs.

## Session 2026-04-01 — URL remediation snagging execution

Executed all 12 tasks of the URL remediation snagging plan.

### Decisions made during execution

- `generateLessonOakUrl` now delegates to `generateOakUrlWithContext`
  with a defensive TypeError guard on the null return. The null path
  is currently unreachable for lessons (codegen always returns string),
  but the guard matches the pattern used by other convenience functions.
- `@remarks` on `generateSubjectProgrammesUrl` refined after code review:
  changed from a misleading `{@link ... | urlForSubject}` (wrong link
  target) to prose referencing the internal helper by name in backticks.
- `OAK_BASE_URL` example updated to show `generateLessonOakUrl` usage
  instead of manual template literal, aligning with SSOT principle.

### Quality gate notes

- Pre-existing lint failures in `oak-search-cli`: `vitest.config.ts` and
  `vitest.e2e.config.ts` have `allowDefaultProject` parsing errors. Not
  caused by this work, but worth fixing separately.
- All 3,797 tests green across all workspaces.

## Session 2026-04-01 — URL generation cleanup (plan complete)

Executed the url-generation-cleanup plan across three phases.

### Key changes

- **`generateOakUrl` retired**: Removed from generator, barrel exports,
  and the sole consumer (`index-oak-helpers.ts`) migrated to
  `generateSubjectProgrammesUrl`. No compatibility layer — deleted outright.
- **`sequenceSlug` made required**: In `transformBulkUnitToSummary`, the
  parameter was tightened from optional to required. All callers already
  provided it; this makes the contract compile-time enforced.
- **`unitUrl: string` added to document params**: Both
  `CreateRollupDocumentParams` and `CreateUnitDocumentParams` now require
  an explicit `unitUrl: string`. Callers narrow `summary.oakUrl` (which is
  `string | undefined` per schema) before passing it. The runtime throw
  inside `extractUnitParamsFromAPI` was replaced by compile-time typing.
- **`requireOakUrl` / `requireUnitOakUrl` helpers**: Created small helper
  functions for type narrowing (avoiding non-null assertions banned by lint).
  Test files use `requireOakUrl(summary)` instead of `summary.oakUrl!`.

### Patterns observed

- Schema types should stay faithful to the schema (`oakUrl?: string`), but
  boundaries where the value is *known* to exist should express that via
  a required typed parameter. This moves validation from runtime throws to
  compile-time requirements.
- Extracting a narrowing helper avoids non-null assertion lint violations
  and provides a descriptive error message if the invariant ever breaks.
