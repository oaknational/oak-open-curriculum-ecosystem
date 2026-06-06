# repo-continuity § Current State — history trim (2026-06-06, Starlit Scattering Twilight)

Discharged `§ Current State` session-close summaries moved verbatim out of
[`repo-continuity.md`](../repo-continuity.md) during the 2026-06-06 dedicated
knowledge-curation pass, per that file's `split_strategy` ("Archive historical
session-close summaries to a companion archive file; keep only live operational
state and most recent session summary"). Each entry was verified discharged and
homed first-hand; the per-entry disposition ledger is the
[curation pass ledger](../curator-passes/2026-06-06-starlit-scattering-twilight-curation.md).

Live pickup truth is `repo-continuity.md` § Current State (Pearly + the live
decision-complete plans), § Next Safe Steps, and the per-thread banners. These
entries are evidence, not a live queue.

---

- **EEF D6 EXECUTION PLAN AUTHORED + DUAL-REVIEWED — UNCOMMITTED, commit deferred
  behind Tidal (2026-06-06, Dusky Dimming Candle / `ef59e2`, claude / Opus 4.8,
  owner-directed).** Authored
  [`eef-d6-execution.plan.md`](../../plans/sector-engagement/eef/current/eef-d6-execution.plan.md)
  (cycle-level, the D5 pattern): a **first-class** `get-eef-evidence`
  universal-tools entry + two single-Zod-call schemas + the `eef-interpretation`
  resource + the `adapt-lesson` prompt, co-gated behind
  `OAK_CURRICULUM_MCP_EEF_ENABLED`. The dual-review caught a contract-violation
  BLOCK (the first draft used a bespoke bypass; D3:53-57/312-315 mandate a
  first-class entry) — corrected + re-confirmed before any code. **No D6 code
  written.** Working tree (UNCOMMITTED): the plan + `eef.next-session.md` +
  `napkin.md` + this continuity update + an experience file. Owner-directed:
  commit once Tidal's commit lands (a background HEAD-advance waiter is armed; the
  commit will run the pre-commit gate). **Next safe step: EXECUTE D6** per the
  plan — run gate G0 (re-run V1–V8) first; land as two green commits.

- **EEF DEEP REVIEW + RESOLUTIONS + ADR-191 RATIFIED (2026-06-05, Masked Creeping
  Lantern / `86584c`).** Deep citation-grounded review of all EEF plans/code found
  the engineering sound; resolved post-D5 status drift, reconciled the strategy
  brief to the agent-reasons model (crosswalk), removed unused
  `NodeProjection`/`DeepKeyPath`, **ratified ADR-191** (deterministic data surface;
  the agent is the only reasoner), and codified a contributor-attribution/PII policy
  (emails only in `package.json`). Substantive set committed by the parallel
  `Jim Cresswell` writer (`10c5aeac` + `0d99dc00`); ADR-191 file + PII-sweep
  remainder + this handoff committed this session. EEF next step is **D6**.
  Pre-existing unrelated e2e flake flagged (MCP-app web-security; green on re-run).

- **AGENT-TOOLS PreToolUse GUARD — fails OPEN on an unbuilt artefact; working tree,
  scoped gates green, reviewed; UNCOMMITTED (2026-06-05, Skyward Lofting Breeze /
  `221aaa`, claude / Opus 4.8, owner-directed)** — continues the standalone agent-tools
  infra lane on `feat/graph-tooling-tidyup`. **Supersedes the missing-case posture in the
  Silvered entry below** (`cb6f7a37`/`2078e0f0`): `.claude/hooks/run-pretooluse-guard.mjs`
  now **fails OPEN (exit 0) + loud warning to stderr AND `.claude/logs/hook-errors.log`**
  when the guard artefact is *not built*, so a fresh / branch-switched worktree no longer
  bricks (the block also blocked the `pnpm install` / `pnpm agent-tools:build` that builds
  it; the env break-glass was non-functional from inside the agent). A *built-but-broken*
  guard still fails CLOSED (exit 2 via `resolveGuardExitCode`, unchanged). Decision
  extracted to the pure, unit-tested `decideMissingGuardArtifact` (+ shared
  `GUARD_REBUILD_HINT`); dead `OAK_ALLOW_MISSING_PRETOOLUSE_GUARDS` removed;
  `FAIL_CLOSED_SHIM`→`GUARD_ROUTING_SHIM`. Docs lockstep (README freshness, surface-matrix,
  validator TSDoc). 898 agent-tools tests pass, with build / eslint / routing-validator /
  markdownlint green; 4 reviewers SHIP / SHIP-WITH-FIXES (two layers of over-escalation
  rejected and grounded; in-scope fixes applied). Whole-tree `pnpm check` NOT run (no commit;
  active multi-writer window — Lanternlit's consolidation status flags this very guard as
  in-flight). **Owner-decision flagged:** ADR-167 amendment for the exit-0 fail-open log
  write (recommended NOT to amend; the shim comment clarifies it complements the wrapper's
  non-zero-only contract). Next safe step: commit when the owner greenlights.
- **EEF D5 EXECUTED — graph-core generic query layer + graph-native EEF view,
  ONE GREEN COMMIT (2026-06-05, Dim Dimming Threshold / `192ae9`, claude / Opus
  4.8, owner-directed)** — D5 built fresh as five TDD cycles, landed in `2e9021ff`
  (+ continuity `ac22efbb`); branch ahead 2 of origin, pushing is the owner's
  call. graph-core `graph-view` generified to `GraphView<TNode, TNodeId,
  TEdgeType>` (subgraph-only; `GraphManifest`/`manifest` deleted) + a bounded-BFS
  `createGraphView` factory (construction throws on dup-id/dangling/negative-max;
  per-call errors stay the two ratified `SubgraphError` variants); graph-corpus-sdk
  `eefStrandGraph` + `inspectStrand` / `evidenceForMove` + evidence envelope
  (members + member-induced edges + binding-derived frontier + provenance, no
  `data_version`/`last_updated`) + `strandAxisIndex`. **Owner decision: the runtime
  `projection?` param was DROPPED** — a field-narrowing projection can't be
  type-honest under `no-type-shortcuts` and EEF consumes none; D4 carries a
  "Projection deferred" amendment, D5-plan C1 is superseded, `NodeProjection`/
  `DeepKeyPath` retained for a future type-honest projection. Extensive real-time
  reviewer cadence (~18 dispatches; two grounded reviewer over-escalations rejected
  and confirmed on re-review). Gates green on both commits (graph-core 90,
  graph-corpus-sdk 31, curriculum-sdk 729 tests; turbo build/type-check/lint/test;
  knip/depcruise/markdownlint/prettier). `d5-graph-construction-methods` master-plan
  todo flipped; D6 unblocked. See the `eef` thread banner.
- **AGENT-TOOLS INFRASTRUCTURE HARDENING — 4 commits, my gates green, pushed
  (2026-06-05, Silvered Listening Secret / `110bae`, claude / Opus 4.8,
  owner-directed)** — a standalone agent-tools / build-infra session on the
  `feat/graph-tooling-tidyup` branch (NOT an eef deliverable; interleaved with the
  eef peer's `b34da870`). (1) Root `postinstall` moved off `turbo run build` onto a
  checked `tsx`-run bootstrap (`7a869c99`) — narrower install lifecycle, no
  orchestrator. The report's "recursive-install loop" was REFUTED by grounding (no
  package-manager call anywhere in the postinstall build graph), so it landed as
  hardening + a `validate-lifecycle-scripts` regression guard, not a loop fix.
  (2) PreToolUse guards now FAIL CLOSED when the dist artefact is missing/broken
  (`cb6f7a37`, `2078e0f0`) via a build-free shim
  (`.claude/hooks/run-pretooluse-guard.mjs`) that exits 2 on any non-{0,2} child
  exit; the security-critical decision (`resolveGuardExitCode`) is unit-tested and
  imported by the shim via Node type-stripping; the false `.agent/hooks/README`
  "fails loudly" invariant that masked the bug was corrected; a gated
  `validate-pretooluse-guard-routing` validator blocks a silent revert. (3)
  `knip.config.ts` registers both new validators as entries (`2ae88e6a`) — they are
  tsx-spawned so knip could not trace them; latent because the pre-commit hook does
  not run knip, only `pnpm check` does. My work's gates are green (turbo
  build/type-check/lint/test, knip, depcruise, skills, portability, repo-validators,
  markdownlint, prettier). No open next step for this infra lane.
- **MIGRATION PLAN OVERHAULED → VALUE-DRIVEN REDESIGN, renamed + reframed
  (2026-06-04, Twilit Cascading Supernova / `bb53a9`, claude / Opus 4.8,
  owner-directed)** — accepted Burnished's handoff (comms `0e2f7e7b`) and ran the
  overhaul deeper than the metaplan first framed. `graph-tools-substrate-migration.plan.md`
  → **[`graph-tools-value-redesign.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/future/graph-tools-value-redesign.plan.md)**
  (renamed via `git mv`, history preserved), re-derived from two constraints +
  design agency; behaviour-preservation AND the "migration" framing removed as
  bad-assumption residue. Per-corpus value-shapes decided: prior-knowledge =
  bounded subgraph (owner-ratified), thread-progressions = sequence projection
  (owner-ratified), misconception = **owner-directed graph** (curriculum-anchored
  bounded subgraph; thread→unit→lesson→misconception verified present in the bulk
  source). Owner-directed architecture (this session): **one bulk graph + bounded
  query views** (not fragmented graphs); **identity is deliberate — slugs are NOT
  guaranteed-unique ids, placement is an edge** (a lesson can be in >1 unit);
  **bulk-derived graphs and the Oak Ontology repo are SEPARATE concerns** sharing
  the substrate (concepts live in the ontology; cross-source join gated on the
  alignment audit). Metaplan `graph-migration-plan-overhaul.plan.md` driven to
  COMPLETED; features-plan §1 boundary reconciled; referrers repointed; 3 readiness
  reviewers (assumptions + architecture fred/betty) READY-WITH-CONDITIONS, all
  validated + applied. KG estate survey report written:
  [`graph-kg-estate-and-two-source-survey-2026-06-04.md`](../../reports/graph-kg-estate-and-two-source-survey-2026-06-04.md).
  **Owner-directed open item: review the entire `oak-kg` / ontology estate** as a
  distinct future activity (timing owner's; not yet planned). Plan stays PARKED on
  EEF D6 + D7 (EEF v1 consumes today's prerequisite + misconception tools as-is —
  must not be touched until EEF v1 ships). Two Claude auto-memory reflexes added
  (check the bulk source not the lossy projection; a present key is not a graph
  identity).
- **`.remember` PLUGIN DISABLED + de-referenced repo-wide (2026-06-04,
  Moonlit Waxing Nebula / `e756f7`, claude / Opus 4.8, owner-directed)** —
  the vendored `remember@claude-plugins-official` plugin is disabled in
  `settings.json` (repo-wide; takes effect at next session start) and
  `settings.local.json`. Rationale: its single-session one-shot `remember.md`
  baton collides with parallel-session practice (write-clobber + the deeper
  consume-collision that empties a peer's unconsumed opener) and is redundant
  against the versioned, claim-safe canonical continuity surfaces. The local
  corpus was mined (3 agents, ~1,400 lines) before deletion and returned
  ZERO orphans not already in a durable home — confirming redundancy. All
  permanent instructional surfaces de-referenced (6 skill docs, 2 rules, 1
  directive, ADR-144, distilled exemplar); historical records and ephemeral
  plan-body examples left intact. Commits `b188aa29` + `681e5d0f`, both
  full-hook-gate green. Canonical handoff is unaffected — it never depended
  on `.remember` (thread records + this file are the real baton).
- **2026-06-02 / 2026-06-03 session-close summaries archived** — discharged
  history (repo-professionalism report + planability routing; capability
  taxonomy / ADR-189; school-search synthesis + POC plan; upstream-sequences
  realignment; EEF D3 ratification; 2026-06-03 agentic curation; JC4 plan
  authoring; graph-estate consolidation; Mandate-1 contamination scan). The
  live pickup state is in § Next Safe Steps, § Active Threads, and the thread
  banners. Verbatim:
  [`archive/repo-continuity-current-state-2026-06-04-arboreal-history-trim.md`](archive/repo-continuity-current-state-2026-06-04-arboreal-history-trim.md).
- **2026-06-02 Flamebright plan-review and Abyssal output-schema entries
  archived**: both are discharged history (mandates executed; output-schema
  state carried by open-questions Q-003 and the owning plans). Verbatim text:
  [`archive/repo-continuity-current-state-2026-06-03-blustery-history-trim.md`](archive/repo-continuity-current-state-2026-06-03-blustery-history-trim.md).
- **2026-06-01/02 Silvered resequencing, Coppery post-D2, Tempestuous
  comms-integrity, and Moonless curation entries archived**: all four are
  discharged history (the resequencing fully executed via mandate-1 +
  graph-estate t2–t5+t7 + EEF D3; comms-integrity landed with its plan as
  authority; curation outcomes live as the graduated rules, `distilled.md`,
  and the napkin archive). Verbatim text:
  [`archive/repo-continuity-current-state-2026-06-03-moonlit-history-trim.md`](archive/repo-continuity-current-state-2026-06-03-moonlit-history-trim.md).
- **2026-06-01 agent-readiness discovery promotion archived** — discharged
  history; the live next step (`ar1-refresh-standards-and-live-estate`) is in
  § Next Safe Steps › Agentic Mechanisms Discovery + the thread record. Verbatim
  in the 2026-06-04 arboreal history-trim archive linked above.
- **Older May 31 / June 1 EEF and longitudinal-review history archived from
  the active pickup index**: detailed D1/value-reframe/no-escape-hatches/
  owner-question, pre-decision, and D0 history lives in
  `archive/repo-continuity-deep-consolidation-status-2026-06-02-shaded-veiling.md`;
  the 2026-06-01 EEF execution entries (D2 landing, seam-mapping, stub
  deletion, replacement-plan correction) live in
  `archive/repo-continuity-current-state-2026-06-02-seaworthy-eef-history.md`;
  live EEF execution truth is the `eef` thread banner plus the next-safe-step
  section below.
