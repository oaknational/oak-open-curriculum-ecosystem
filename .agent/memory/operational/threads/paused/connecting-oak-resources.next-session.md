---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Next-Session Record — `connecting-oak-resources` thread

> **PAUSED thread.** Reactivation is owner-directed. The EEF D6 + D7 trigger has FIRED: the
> graph-substrate work now flows through `graph-tools-value-redesign`
> (🟢 DECISION-COMPLETE 2026-06-09). Full session narrative (the WS1–WS3 graph-core build, the
> inc-1d team session, the graph-estate consolidation) and the full ~56-session identity trail
> are retained in git.

## Current State

- **PROMOTED 2026-06-09.** EEF reached D6 + D7 green and shipped, so
  [`current/graph-tools-value-redesign.plan.md`](../../../../plans-backlog-2026-07/connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md)
  was promoted to `current/` — one plan owning the migration of all three existing graph tools onto
  `graph-corpus-sdk` (mechanism-settling + executable cycles remain; see its §Remaining promotion
  work).
  (NB: an older note here said "next: EEF D3"; that is stale — EEF is now at D6 c4/c5. Re-derive
  the EEF state from `eef.next-session.md` + `repo-continuity.md` § Current State.)
- **Graph-estate consolidated** (`c3b78eec`, pushed): eleven plans archived with banners; the
  four misconception feature plans consolidated into
  `kg/future/oak-misconceptions-graph-features.plan.md`; the unified substrate-migration plan
  authored (`9fab8669`). The `graph-tools-value-redesign` lane is the single owner of the
  node/edge model (one-bulk-graph + views with a deliberate identity model).
- **Active-claims**: none on this thread. Branch `planning/graph-tooling` (planning closeout).
- **Reusable curriculum architecture evidence (2026-07-15):** the report family at
  [`reports/oak-reusable-curriculum-architecture/`](../../../../reports/oak-reusable-curriculum-architecture/README.md)
  and the strategic future
  [planning brief](../../../../plans-backlog-2026-07/connecting-oak-resources/reusable-curriculum-architecture/future/reusable-curriculum-architecture-planning.plan.md)
  now preserve the source-accounting, projection, graph, search, provenance and
  cross-estate implications. This remains a paused evidence-and-planning lane:
  no implementation or ontology change is authorised.
- **Next safe step for this evidence:** owner-directed promotion begins at the
  planning brief's promotion trigger. Revalidate the current received bundle
  and code, disposition adjacent plans, establish known-answer agent and website
  journeys, verify a representative public materialised-view contract and live
  Elasticsearch Serverless capabilities, then ratify the ADR propagation path.
- **Source integration workspaces (2026-07-15):** the
  [`oak-integrations` report family](../../../../reports/oak-integrations/README.md) and
  [executable plan](../../../../plans-backlog-2026-07/architecture-and-infrastructure/current/oak-source-integration-workspaces.plan.md)
  define optional, source-authority-preserving wrappers for Oak OpenAPI, Castr, Oak Curriculum
  Ontology, and Oak Database-Tools. The public root remains complete with every submodule absent.
  Castr's source mode is the rapid authoring path; released core and generic fetch-companion
  packages are the ordinary post-cutover path; Oak runtime policy remains OCE-owned.
- **Next safe step for source integration:** keep this thread paused until execution is
  owner-directed and the P0 workspace layer-separation audit is complete. Then run the plan's
  blocking preflight before mutation, especially source visibility/heads, branch and permission
  policy, npm scope/package-name authority, trusted publishing/provenance, and current vendor call
  shapes. No submodule, child branch, implementation, publication, commit, or push landed in the
  planning session. The report, plan, and this handoff are present but uncommitted.
- **Closeout verification:** the three specialist reviews approved; internal Markdown links,
  Markdownlint, Prettier, scoped diff checks, all builds/tests/browser suites, and repository
  validators passed. The aggregate `pnpm check` exited zero but emitted existing `no-throw` lint
  warnings in unrelated product files, so the canonical warning-clean session-handoff gate remains
  pending even though no source-integration validation failed.

## Thread Identity

- **Thread**: `connecting-oak-resources`
- **Purpose**: connect Oak's own resources into this repo. Two streams: (1) **internal Oak
  knowledge-graph work** (the `knowledge-graph-integration` plan collection — graph-query-layer,
  graph-resource-factory, misconception/NC/open-education surfaces, ontology-integration); (2)
  **external Oak references** — research + selective adoption from Oak's public repos
  (oak-curriculum-ontology, Aila) and concepts-only learning from private repos.

## Plan Locations

- `.agent/plans/connecting-oak-resources/knowledge-graph-integration/` — internal Oak KG work.
- `.agent/plans/connecting-oak-resources/external-oak-references/` — external Oak repo research
  and selective adoption.
- `.agent/plans/architecture-and-infrastructure/current/oak-source-integration-workspaces.plan.md`
  — cross-repository implementation owner, queued after the workspace layer-separation audit.
- `.agent/reports/oak-integrations/` — permanent concept exploration and decision rationale.

## Cross-Plan Links

- The **EEF subthread** (`sector-engagement/eef/`) consumes the graph layer but is *not* part of
  this thread (it is open-education evidence, not Oak-internal). See `eef.next-session.md`.
- **Third-party** (non-Oak) knowledge sources live in the sibling thread
  [`exploring-open-education-resources.next-session.md`](exploring-open-education-resources.next-session.md).
- **Castr is a scoped exception to the generic third-party-source route:** it is an OCE compiler
  dependency under direct co-development, so its source wrapper and convergence work remain in
  the same implementation plan as the Oak authorities. Castr changes still land upstream in
  `EngraphCode/castr`; this repo does not become source authority.

## Adoption-Rule Summary (owner direction 2026-05-01 — live standing decision)

For external Oak repos:

- **Public repo + permissive license + attribution** → adoption-eligible. Acknowledgement
  mechanism approved (per-file header + repo-level NOTICE + README acknowledgement of Oak
  National Academy).
- **Private repo** → concepts-only. Learn patterns and apply them in our own implementation;
  do not copy code, prompts, schemas, or distinctive content into this public repo (that would
  bypass the upstream privacy choice).

## Light-Scan Findings (2026-05-01 — grounding for the external-references stream)

- `oaknational/oak-curriculum-ontology` — public, dual MIT/OGL-3. OWL ontology
  (`Misconception`, `Thread`, `Programme`, `Unit`, `Lesson`). Vocabulary overlap with the
  adapter names; no structural collision (no misconception edges either side). Adoption-eligible;
  alignment is informational, not blocking.
- `oaknational/oak-ai-lesson-assistant` (Aila) — public, MIT. Likely contains prompts relevant
  to cross-source-journeys; highest plan-altering potential. Adoption-eligible.
- `oaknational/oak-ai-moderation-service` — **private**, concepts-only.
- `oaknational/aila-atomic-concepts` — **private**, concepts-only: "prerequisite derivation,
  curriculum graph construction; Science KS3 pilot." Directly relevant to the PrerequisiteGraph.

## Participating Agent Identities

Additive per
[PDR-027](../../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).
Recent active stretch below; the full ~56-session trail (the 2026-05 graph-core WS1–WS3 build,
the inc-1d multi-agent team session, the PR-102/PR-108 arcs) is retained in git history.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Velvet Stalking Moth` | `cursor` | `Composer` | `bde2f8` | `pr-108-preview-mcp-black-box-validation (25 tool calls pass)` | 2026-05-24 | 2026-05-24 |
| `Salty Mooring Dock` | `cursor` | `Composer` | `dc4dd7` | `pr-114-preview-agent-test-checklist` | 2026-05-25 | 2026-05-25 |
| `Riverine Navigating Rudder` | `cursor` | `Composer` | `27d9af` | `oak-preview-1 full manual UAT + suggest-URL WS5` | 2026-05-25 | 2026-05-25 |
| `Hearthlit Stoking Cinder` | `claude` | `claude-opus-4-8` | `4c1eeb` | `graph-spine quarantine` | 2026-06-01 | 2026-06-01 |
| `Flamebright Charring Ember` | `claude` | `Opus 4.8` | `30dd5d` | `graph-estate cross-thread relationship + one-migration ownership` | 2026-06-02 | 2026-06-02 |
| `Silvered Lurking Mask` | `claude` | `Opus 4.8` | `bbb696` | `one-thread resequencing ratified + estate corrections (e8fe16e0)` | 2026-06-02 | 2026-06-02 |
| `Stellar Waning Planet` | `claude` | `Opus 4.8` | `64c383` | `mandate-1 scan: graph-estate plan fixes (37020386)` | 2026-06-02 | 2026-06-02 |
| `Opalescent Cascading Planet` | `claude` | `Opus 4.8` | `0340f9` | `graph-estate consolidation executed (c3b78eec)` | 2026-06-02 | 2026-06-02 |
| `Galactic Glowing Prism` | `claude` | `Opus 4.8` | `cd7389` | `JC4 unified substrate-migration plan authored (9fab8669)` | 2026-06-02 | 2026-06-02 |
| `Fragrant Spreading Sapling` | `claude` | `Fable 5` | `47f78a` | `stale-fired-trigger-fact-fix-only` | 2026-06-10 | 2026-06-10 |
| `Codex` | `codex` | `GPT-5` | `unknown` | `reusable-curriculum-architecture synthesis and closeout` | 2026-07-15 | 2026-07-15 |
| `Leopard tracks Dewdrop` | `codex` | `GPT-5` | `019f64` | `source-integration concept exploration, plan, readiness review, and closeout` | 2026-07-15 | 2026-07-15 |

## References

- **Repo state**: [`repo-continuity.md`](../../repo-continuity.md) § Current State (authoritative).
- **ADR-173** (graph stack) governs the graph-estate; `graph-tools-value-redesign` is
  🟢 DECISION-COMPLETE (2026-06-09; the EEF D6+D7 gate fired) — execution PRs follow per its
  deliverables map.
