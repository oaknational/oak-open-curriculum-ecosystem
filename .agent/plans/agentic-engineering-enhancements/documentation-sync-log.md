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
    - Added MCP quick-triage question (#9) to `.agent/memory/executive/invoke-code-reviewers.md`
    - Added MCP worked example to `.agent/memory/executive/invoke-code-reviewers.md`
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
    `.agent/memory/active/patterns/shared-strictness-requires-workspace-adoption.md`
    and indexed it in `.agent/memory/active/patterns/README.md`
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

## Governance Concepts and Agentic Mechanism Integration (Adjacent Work)

- Status: complete (2026-04-19)
- ADR-119 update or rationale: No-change — this lane closed repo-local
  routing, evidence-shape, and future-slice boundaries. It did not settle a
  new practice boundary or canon-level governance decision.
- practice.md update or rationale: No-change — `.agent/practice-core/practice.md`
  remains the canonical operational map. This lane extracted value by changing
  adjacent planning and evidence surfaces rather than altering the core map.
- prog-frame update or rationale: No-change — the human-facing explanation in
  `docs/foundation/agentic-engineering-system.md` was reviewed and left
  untouched because the governance-plane vocabulary remains repo-local and not
  yet ready for doctrine promotion.
- Other ADR/docs/README updates:
  - Added the active execution plan and closed the source-plan lifecycle in
    `active/README.md`, `current/README.md`, the collection `README.md`, and
    `roadmap.md`
  - Updated the evidence source plan, the Phase 2 active evidence plan, and
    the shared evidence bundle template so the evidence lane now distinguishes
    `attempt`, `observed outcome`, and `proven result`
  - Updated the operational-awareness plan so it explicitly carries the
    supervised-execution framing for the bounded work-plane pilot
  - Updated the reviewer-gateway plan so it explicitly frames the gateway as
    one layer in the layered-safeguard stack and names review-signal inputs,
    including relationship-confidence signals
  - Updated the future mechanism-taxonomy plan and `future/README.md` so the
    remaining abstraction debt now has one future home:
    `action-governance boundary`, `boundary model`, `signal ecology`,
    `residual-risk surface`, and `governance-plane vocabulary`
  - Explicit defer retained in the future taxonomy lane for `graduated
    authority` and `adoption ladder`
  - No further change needed in `.agent/analysis/README.md`,
    `.agent/reference/agentic-engineering/README.md`,
    `.agent/reference/agentic-engineering/deep-dives/README.md`,
    `.agent/reports/README.md`, `.agent/reports/agentic-engineering/README.md`,
    or `.agent/reports/agentic-engineering/deep-dive-syntheses/README.md`
  - Inspected and intentionally left unchanged:
    `docs/foundation/agentic-engineering-system.md`,
    `docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md`
- Consolidation review (`jc-consolidate-docs`): complete — manual equivalent
  review performed; no additional graduation beyond the updated lane-local
  plans, execution surface, and evidence template was justified.
- Validation record:
  - `pnpm markdownlint-check:root` passed. The root markdownlint surface
    intentionally excludes `.agent/**` per repo configuration.
  - `pnpm practice:fitness:informational` exited `0` and reported the same
    pre-existing repo-wide `Result: HARD (2 hard, 12 soft) — informational
    mode` posture outside this lane's scope.
  - Reviewer/manual verification for the touched `.agent/**` lane docs is
    recorded in the active execution plan alongside the repo-defined gate
    results.
  - Reviewer history recorded in the active execution plan: prior planning
    findings were absorbed before editing, the execution rounds absorbed
    findings from `assumptions-reviewer`, `docs-adr-reviewer`, and
    `architecture-reviewer-fred`, and a final rerun of all three reviewers
    returned clean.
- Notes: Value extraction was treated as a hard constraint in this closeout.
  Concepts only counted when they changed a local contract, evidence shape,
  routing rule, future-slice boundary, or explicit defer decision. Net-new
  concepts and reflective synthesis concepts also counted when they were given
  a bounded local home rather than being dropped for lacking a prior
  equivalent. Pure wording relocation did not count as completion.

## Phase 5 — Mutation Testing

- Status: pending
- ADR-119 update or rationale: pending
- practice.md update or rationale: pending
- prog-frame update or rationale: pending
- Other ADR/docs/README updates: pending
- Consolidation review (`jc-consolidate-docs`): pending
- Notes: pending

## OAC Phase 4.3 — Continuity surface retirement & doc propagation (2026-04-20)

Plan: [operational-awareness-and-continuity-surface-separation.plan.md](active/operational-awareness-and-continuity-surface-separation.plan.md).
Driver: retire `.agent/prompts/session-continuation.prompt.md`'s `Live
continuity contract` section in favour of the three repo-local state
surfaces (`.agent/memory/operational/repo-continuity.md` +
`.agent/memory/operational/workstreams/<slug>.md` + `.agent/memory/operational/tracks/*.md`).

- Status: in progress (this session).
- ADR update: `docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md`
  §3 rewritten — "The continuity contract lives in a canonical repo-local
  surface" (was: "in the MCP App continuation prompt"). Contract field list
  updated to match the state-surface split. No supersession needed; the
  doctrine is unchanged, only the hosting location is abstracted.
- Governance update:
  `docs/governance/continuity-practice.md` §Three Continuity Surfaces §1
  and §Continuity Contract and §GO all updated to reference the three
  state surfaces as the primary operational continuity surfaces.
- Practice Core update:
  `.agent/practice-core/practice-bootstrap.md` §Continuity Contract
  abstracted: canonical host is now generic ("dedicated state file or
  section of a continuation prompt"), with explicit acknowledgement that
  split-surface hosts remain compliant when authority order is explicit,
  single-writer discipline holds, and fields are covered in aggregate.
  Minimum contract field set reduced to the portable core; epistemic-
  continuity fields (surprises, open questions) moved to optional /
  per-lane placement.
- Reference / deep-dive updates:
  `.agent/reference/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md`
  §Tactical track-card surface corrected from "gitignored" to "git-tracked"
  with the `<workstream>--<agent>--<branch>.md` filename convention for
  collaborative tracks. `continuity-and-knowledge-flow.md` no-change
  rationale: content was already abstracted above the hosting-location
  layer.
- Workflow doc updates: `.agent/skills/go/shared/go.md` and
  `.agent/commands/session-handoff.md` retired OAC-pilot framing and now
  read/write the state surfaces directly, not the prompt section.
  `.agent/memory/operational/README.md` corrected: line about track cards being
  "gitignored single-writer surfaces" replaced with git-tracked model;
  authority order re-described as a same-scope tiebreaker (refinement b).
  `.agent/memory/operational/repo-continuity.md` field renamed "Primary workstream
  brief" → "Branch-primary workstream brief" + added "Current session
  focus" (refinement a).
- Prompt retirement: `.agent/prompts/session-continuation.prompt.md`
  shrank from 1628 lines to ~140 — all state-hosting sections removed;
  remaining content is the behavioural entry surface only (Ground First,
  This Prompt's Role, Per-Session Landing Commitment, Reviewer
  Discipline, Core Invariants, Durable Guidance). Prompts README
  description updated to match.
- Portability decision: **No promotion to Practice Core. Remain portable
  candidate, repo-local.** Only one of four criteria met (markdown-first
  vs sidecar boundary explained). Other three require evidence from
  distinct workstream shapes and real parallel use that single-session
  dogfooding cannot generate. Recorded in OAC plan Task 4.2. Re-evaluate
  on concrete follow-up triggers.
- Optional helpers (c expiry-check, d napkin-promotion): marked as
  future-work; built on trigger, not pre-built.
- Consolidation review (`jc-consolidate-docs`): pending — this
  documentation propagation IS the natural deep-consolidation carrier
  flagged in the 2026-04-20 session close. Deferred to a dedicated pass
  after plan-time reviewers land; a handoff node here keeps the boundary
  clean.
- Reviewers: `docs-adr-reviewer` + `assumptions-reviewer` dispatched as
  the closeout of this phase. Both returned ACCEPT WITH NOTES. Findings
  applied in-session:
  - ADR-150 Rationale §"Why keep the continuity contract in the prompt"
    rewritten to "Why a canonical repo-local surface for the contract";
    §4 "active MCP App plan set" → "active plan set for the current
    lane"; §Positive consequence "MCP App lane gains a durable
    operational contract" → "repo gains a durable operational continuity
    contract decoupled from any single workflow prompt"; amendment log
    added to the ADR header.
  - ADR-150 §3 specific repo paths reframed as explicitly
    non-normative/illustrative.
  - OAC plan §Goal (L105) and §Task 2.2 Expected surfaces (L328-340)
    "gitignored" vestige corrected to git-tracked with
    filename-disambiguation note.
  - `memory/operational/repo-continuity.md` stale Status line, Option-A/B
    next-safe-step menu, and fitness-pressure note on the retired
    1545-line prompt all cleared.
  - `memory/operational/workstreams/operational-awareness-continuity.md` Phase 2
    bullet updated to reflect retired pilot-phase framing.
  - Track card handoff note rewritten to remove
    "Phase 4 unblocks plugin WS0" overstatement. Plugin-migration plan's
    actual dependency is OAC Phase 2 scaffolding (landed at `ffcad2aa`).
  - `PDR-011` amended: host language abstracted to "canonical repo-local
    surface" that may split across canonical contract + per-workstream
    briefs + single-writer track cards; contract field set restructured
    into a portable minimum plus optional host-local epistemic fields;
    §Host-local context updated to reflect this repo's split-surface
    implementation. Doctrine unchanged. Amendment logged at PDR header.

### No-change rationale (mandated Task 4.3 surfaces and required canonicals)

- **`.agent/practice-core/practice.md`** — no edit. §Continuity host
  (L242-248) already defers field specification and host options to
  `practice-bootstrap.md §Continuity Contract` (which WAS updated this
  pass). The deferral inherits the new doctrine automatically; editing
  `practice.md` would duplicate the bootstrap's content and create a
  second source of truth.
- **`.agent/reference/agentic-engineering/README.md`** — no edit.
  Hub-level index routes readers to ADR-150 and
  `continuity-practice.md` by topic; both anchors were updated in this
  pass and the hub's routing statements remain accurate. No content
  changes at the hub layer.
- **`.agent/reference/agentic-engineering/deep-dives/continuity-and-knowledge-flow.md`**
  — no edit (stated above). Deep-dive content is framed at the
  operational/epistemic/institutional layer; it never asserted a
  specific host for the contract, so the amendment does not touch it.
- **ADR-119 (`docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`)**
  — no edit. This required canonical describes the three-layer Practice
  model (Philosophy / Structure / Tooling). Continuity-surface
  separation does not change the Practice name, layer boundaries, or
  the three-layer model itself. ADR-150 is the ADR that carries the
  continuity doctrine; ADR-119 inherits no update responsibility from
  this phase.

### Follow-up flagged during closeout (not completed this session)

- A deliberate deep consolidation pass is still due (governance change
  guardrails `4bccba71` graduation assessment; L-7 sunk-cost + tracks-
  gitignored + menu-ification surprise graduation). Recorded in
  `memory/operational/repo-continuity.md §Deep consolidation status`. Scheduled for
  explicit session rather than smuggled into the next commit.
- Independent assumption reviewer noted that the PDR-011 amendment
  itself would benefit from a second-pass read once settled, to verify
  no unstated assumptions about multi-agent coordination or
  git-as-coordination-bus were introduced. Logged here so the next
  consolidation pass picks it up.
