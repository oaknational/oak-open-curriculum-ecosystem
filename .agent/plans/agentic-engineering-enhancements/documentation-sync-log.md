# Documentation Synchronisation Log

Use this log to prove each phase has handled required documentation updates.

## Required Canonical Documents

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/practice-core/practice.md`

Also update any additionally impacted ADRs, `/docs/` pages, and README files.

## Recording Rule

For each phase:

- list what changed in each required canonical document, or
- record a no-change rationale explaining why no update was needed
- confirm consolidation review using `.cursor/commands/jc-consolidate-docs.md`

Do not mark a phase complete without an entry.

---

## Phase 0 — Planning System and Template Hardening

- Status: completed (2026-02-24)
- ADR-119 update or rationale: Added "Documentation Propagation Contract" section.
- practice.md update or rationale: Added workflow requirement for documentation propagation before phase closure.
- prog-frame update or rationale: Added canonical-source note extension requiring propagation + consolidation.
- Other ADR/docs/README updates: Updated ADR-117 template/component inventory and guardrails; updated collection `README.md`, `roadmap.md`, `active/README.md`, and templates/components to encode the same rule.
- Consolidation review (`jc-consolidate-docs`): Completed by aligning phase closure expectations to `.cursor/commands/jc-consolidate-docs.md`.
- Notes: Phase 0 closed; Phase 1 is the next executable phase.

## Phase 1 — Hallucination Guarding

- Status: pending
- ADR-119 update or rationale: pending
- practice.md update or rationale: pending
- prog-frame update or rationale: pending
- Other ADR/docs/README updates: pending
- Consolidation review (`jc-consolidate-docs`): pending
- Notes: Phase 1 kickoff package prepared in `active/phase-1-hallucination-guarding-execution.md` (baseline capture, edit order, pilot protocol). Implementation not started yet.

## Phase 2 — Evidence-Based Claims

- Status: pending
- ADR-119 update or rationale: pending
- practice.md update or rationale: pending
- prog-frame update or rationale: pending
- Other ADR/docs/README updates: pending
- Consolidation review (`jc-consolidate-docs`): pending
- Notes: pending

## Phase 3 — Architectural Enforcement

- Status: pending
- ADR-119 update or rationale: pending
- practice.md update or rationale: pending
- prog-frame update or rationale: pending
- Other ADR/docs/README updates: pending
- Consolidation review (`jc-consolidate-docs`): pending
- Notes: pending

## Phase 4 — Cross-Agent Standardisation

- Status: pending
- ADR-119 update or rationale: pending
- practice.md update or rationale: pending
- prog-frame update or rationale: pending
- Other ADR/docs/README updates: pending
- Consolidation review (`jc-consolidate-docs`): pending
- Notes: pending

## Elasticsearch Specialist Capability (Adjacent Work)

- Status: in-progress (2026-03-07)
- ADR-119 update or rationale: No-change — ADR-119 covers specialist reviewers generically ("Agents — specialist reviewers, their three-layer prompt architecture (ADR-114)") and does not enumerate individual specialists. Adding the Elasticsearch reviewer does not change the practice's conceptual boundary.
- practice.md update or rationale: Updated provenance metadata — specialist reviewer count incremented from 13 to 14.
- Other ADR/docs/README updates: ADR-129 References section updated (template count 12 → 13). Artefact inventory updated (skills 16 → 18, rules 16 → 21). AGENT.md specialist roster updated. invoke-code-reviewers.md triage/examples updated. Collection indexes (README, roadmap, current, active) updated to reflect plan promotion.
- Consolidation review (`jc-consolidate-docs`): pending
- Notes: Phases 0–3 of the execution plan are complete. Phase 4 (review + doc sync) is in progress.

## MCP Specialist Upgrade (Adjacent Work)

- Status: complete (2026-03-30)
- ADR-119 update or rationale: No-change — ADR-119 remains generic to specialist reviewer architecture and does not require MCP-specific wording for this upgrade.
- practice.md update or rationale: No-change — `practice.md` does not contain hardcoded artefact counts; validation scripts (`portability:check`, `subagents:check`) dynamically enumerate. The MCP upgrade adds a skill to an existing reviewer, not a new specialist, so no provenance metadata change is needed.
- Other ADR/docs/README updates:
  - Completed:
    - Canonical situational rule exists at `.agent/rules/invoke-mcp-reviewer.md`
    - Live-spec-first doctrine is present in `.agent/sub-agents/templates/mcp-reviewer.md`
    - ext-apps coverage is present in `.agent/sub-agents/templates/mcp-reviewer.md`
    - Collection entrypoints aligned to `IN PROGRESS` status for MCP specialist work (`README.md`, `current/README.md`, `roadmap.md`)
    - Created `.agent/skills/mcp-expert/SKILL.md` with doctrine hierarchy, tiered context, capability routing, and boundary definitions
    - Created `.cursor/skills/mcp-expert/SKILL.md` (Cursor wrapper)
    - Created `.agents/skills/mcp-expert/SKILL.md` (Codex wrapper)
    - Wrapper parity audit complete — all reviewer, rule, and skill wrappers exist across Cursor/Claude/Codex
    - Added MCP quick-triage question (#9) to `.agent/directives/invoke-code-reviewers.md`
    - Added MCP worked example to `.agent/directives/invoke-code-reviewers.md`
  - Validation evidence:
    - `pnpm subagents:check` passed (17 wrappers, 14 templates)
    - `pnpm portability:check` passed (21 skills, 28 rules, 30 Cursor triggers)
    - `pnpm markdownlint:root` passed (no errors)
- Consolidation review (`jc-consolidate-docs`): pending
- Notes: Upgrade (not greenfield). ADR-129 triplet is now complete (reviewer, skill, rule). All must-fix, should-fix, and low-priority findings from specialist review are resolved.

## Incoming Practice Context Integration and Write-Back (Adjacent Work)

- Status: complete (2026-04-05)
- ADR-119 update or rationale: No-change — this rollout integrates incoming
  Practice Context below Practice Core and does not change the architecture of
  the agentic engineering practice itself.
- practice.md update or rationale: No-change — the hydration/self-sufficiency
  cluster was already promoted locally, and this round intentionally keeps
  Practice Core unchanged.
- Other ADR/docs/README updates:
  - Added the rollout plan, linked it from the collection README, current-plan
    index, roadmap, and session continuation prompt during execution, then
    archived it after the closeout pass
  - Added the local process pattern
    `.agent/memory/patterns/shared-strictness-requires-workspace-adoption.md`
    and indexed it in `.agent/memory/patterns/README.md`
  - Updated `docs/engineering/build-system.md` with the aggregate-gate
    doctrine (`pnpm check` as executable truth, one package-graph run as the
    design target, and workspace-task-export bounded claims)
  - Updated `.agent/practice-context/README.md` and
    `.agent/practice-context/outgoing/README.md` to support repo-targeted
    outgoing subdirectories
  - Added `.agent/practice-context/outgoing/agent-collaboration/` as the
    focused write-back pack
  - Added `clean` to `@oaknational/agent-tools` so the workspace matches the
    repo-wide clean contract
- Consolidation review (`jc-consolidate-docs`): complete
- Notes: Incoming batch cleared after adoption and write-back capture.
  Verification complete: `markdownlint-check:root`, the workspace-task scan,
  `@oaknational/agent-tools` clean/build/test, and `pnpm check` all passed.
  `pnpm practice:fitness` still reports pre-existing repo-wide prose/target
  violations outside this change set. Relevant platform-side plans
  (`~/.claude/plans/flickering-pondering-simon.md` and
  `~/.claude/plans/rippling-meandering-canyon.md`) were reviewed during
  consolidation and did not contain additional uncaptured doctrine for this
round. The plan now lives in `archive/completed/`.

## Agentic Corpus Discoverability Hub (Adjacent Work)

- Status: complete (2026-04-19)
- ADR-119 update or rationale: No-change — the new hub, deep dives, and lane
  READMEs are discoverability/index surfaces only. They route back to existing
  canon and do not change the practice's name, boundary, or three-layer model.
- practice.md update or rationale: No-change — `.agent/practice-core/practice.md`
  remains the canonical operational map. This lane indexes it more clearly but
  does not change its mechanics or doctrine.
- prog-frame update or rationale: No-change — progression framing and the
  internal progression document set were not changed by this discoverability
  restructure.
- Other ADR/docs/README updates:
  - Added `.agent/reference/agentic-engineering/README.md`, the deep-dives
    index, and five seed deep-dive extracts
  - Added `.agent/research/agentic-engineering/README.md` plus five named lane
    READMEs
  - Added `.agent/reports/README.md` and the formal
    `.agent/reports/agentic-engineering/` report lane READMEs
  - Updated `.agent/reference/README.md`, `.agent/research/README.md`,
    `.agent/analysis/README.md`, `.agent/practice-index.md`, and the
    `agentic-engineering-enhancements` collection indexes/roadmap for
    reciprocal routing
  - Updated `docs/README.md`, `docs/foundation/README.md`, and
    `docs/foundation/agentic-engineering-system.md` so human-facing entry
    points can reach the hub without going through `AGENT.md`
  - No lane-owned change required in `docs/governance/README.md` or
    `docs/architecture/architectural-decisions/README.md`; the docs-facing
    route is sufficient without additional hub links there, and unrelated
    concurrent edits were already in progress on both files
- Consolidation review (`jc-consolidate-docs`): complete — no additional
  graduation required because the settled outcomes of this lane are already
  captured directly in the new hub, deep dives, lane READMEs, plan files, and
  docs entry points.
- Notes: `.agent/analysis/` remains the authoritative investigation/evidence
  lane. `.agent/reports/` now exists as the promotion-only lane for formal
  audits and syntheses. Experience files were left untouched and are only
  referenced as source material for concept extraction. Final docs review
  findings were absorbed. `pnpm check` reached `knip` and then failed on an
  unrelated concurrent code change in
  `packages/core/oak-eslint/src/rules/require-observability-emission.ts`
  (unlisted `estree` dependency), so the documentation lane closes with a
  recorded workspace-gate caveat rather than a local content defect.

## Phase 5 — Mutation Testing

- Status: pending
- ADR-119 update or rationale: pending
- practice.md update or rationale: pending
- prog-frame update or rationale: pending
- Other ADR/docs/README updates: pending
- Consolidation review (`jc-consolidate-docs`): pending
- Notes: pending
