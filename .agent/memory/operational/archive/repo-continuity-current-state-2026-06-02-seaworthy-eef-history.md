# Repo-continuity Current State archive — 2026-06-01 EEF history

Archived 2026-06-02 (Seaworthy Swimming Sextant) from
`repo-continuity.md` §Current State per that file's split strategy. These
four entries are 2026-06-01 EEF execution history; each is carried in full
by its `eef` thread-record banner. Verbatim moves, no edits.

- **EEF D2 landed + corpus-contamination correction arc (2026-06-01, Lunar
  Transiting Eclipse / `9cde59`, claude / Opus 4.8)**: D2 built the typed
  raw-corpus foundation in `graph-corpus-sdk` (`EefStrand` / `EefStrandId` /
  `EefStrandById` / `isValidStrandKey`, raw domains, declared-vs-observed
  divergence, related-strand edges, corpus provenance) and removed the old
  list-shaped EEF surface across three workspaces — green + reviewed
  (code/type/test experts), commit `9019bb86`. Owner then caught a fabricated
  key-stage→phase concept carried into the canonical plan from a deleted prompt;
  the corrective arc removed it, ran an independent grounding audit, and
  completed a tombstone disposition pass (commits `fb7ad234`, `70ccbef8`,
  `75b0734a`). Lesson captured in agent memory
  (`harvest-from-deleted-is-contamination-vector`).
  The cite-or-tag corpus-grounding discipline is now a real `trigger-loaded` rule at
  [`.agent/rules/eef-corpus-grounding.md`](../../rules/eef-corpus-grounding.md)
  (all four forms + a `RULES_INDEX.md` row; loaded for EEF work, not baseline); the
  stopgap doc was retired (graduated 2026-06-01, Moonless Lurking Dusk).
- **EEF plan seam-mapping + grounded review corrections (2026-06-01, Windswept
  Floating Summit / `d8560c`, claude / Opus 4.8)**: ran the two owner-requested
  reviews (whole-plan + D2) of the live EEF plan, grounding every claim directly
  against `EEF_TOOLKIT_DATA` and the repo rather than trusting subagent output
  (two Explore agents returned a fabricated `graph-project` import fact and wrong
  `~N/30` cardinalities, caught before they reached edits). Applied grounded
  corrections + enhancements to `eef-graph-tool-completion.plan.md`: fixed a false
  "graph-view contract already removed in code" status (the
  `graph-core/src/graph-view/` contract + EEF-local adapter are live; D2 deletes
  the adapter, D5 replaces the contract; `graph-ingest`/`graph-project` in
  `packages/libs/` consume only the RDF substrate, so zero external blast radius);
  corrected V1 source paths (`behind_the_average_by_phase`/`applications` sit under
  `school_context_relevance`; `meta.caveats` is corpus-level); made field
  optionality first-class with verified cardinalities (floor
  `headline`/`definition`/`key_findings`/`tags` 30/30; `effectiveness` 7/30,
  `behind_the_average` 6/30, `implementation` 4/30, `school_context_relevance`
  17/30, `related_strands` 17/30, `related_guidance_reports` 7/30); added
  **Decision 10** (the system is deterministic data; the consuming agent is the
  only reasoner — the static interpretation resource scaffolds its reasoning); and
  rewrote `## Sequencing` with a full seam taxonomy (fan-out / confluence /
  closure-arc / orthogonal runtime axis / layering anti-seams / cross-cutting
  ledger / temporal) plus the law **seams compose, they are never reconciled**
  (friction at a junction means an input drifted from the corpus root; fix upstream
  at the source, never bridge at the seam). The two reviews are complete; whether
  and when D2 is implemented is an owner decision. The seam-mapping taxonomy is
  captured for graduation to a plan template/archetype (`pending-graduations.md`,
  owner-confirmed intent). No `pnpm check` (owner direction).
- **EEF graph-tool re-review + stub deletion + decontamination (2026-06-01,
  Shaded Swaying Sapling / `d37ba7`, claude / Opus 4.8)**: re-reviewed the live EEF
  plan for total old-shape removal and settled the D2 union-vs-binding test
  boundary (domain-generic traversal + synthetic-node tests live in graph-core; the
  EEF binding is tested over the real corpus; nothing fabricates an `EefStrand`).
  Deleted the stub tools in code — the five `NotImplementedYet` graph ops, the
  `EvidenceCorpus` rank/explain/compare substrate, and the `threads` `export {}`
  placeholder — landing GREEN across all consumers (graph-core / graph-corpus-sdk /
  curriculum-sdk tests pass; MCP app + graph libs type-check clean). Swept the
  plan's GraphView language to delete-and-build-fresh and scrubbed negation
  monuments. Corrected live old-shape contamination in ADR-173 (2026-06-01
  amendment: query layer real-ops-only, Threads placeholder removed) and a
  `graph-project` comment; ADR-157's `EvidenceCorpus` note stays as demoted,
  self-disclaimed speculation. **D0 is RE-OPENED (decontamination only** — its code
  and ADR-doctrine work stays committed at `ce9745c7`): the sweep-token list
  omitted the stub/adapter/Inc.3/EvidenceCorpus framing, so to re-close, the next
  session updates `eef-d0-decontamination-ledger.md` and runs the extended-token
  acceptance sweep over EEF plans + non-plan docs. The estate-wide graph-plan sweep
  is owned by `graph-estate-consolidation.plan.md`. No `pnpm check` and no commit
  (owner direction); uncommitted code + doc edits remain on
  `feat/graph-tooling-tidyup`.
- **EEF D2/D3-D6 replacement-plan correction applied (2026-06-01, Evergreen
  Budding Copse / `019e7f`)**: the live EEF plan now incorporates the four
  architecture-reviewer findings and the owner correction that there are no
  wrappers, no compatibility layers, no remnants of the old list/load/Zod shape,
  and no requirement to keep the tree green while the fundamental D2-D6
  replacement is in flight. D2 is a typed raw-data ingestion foundation over the
  complete in-memory `EEF_TOOLKIT_DATA` constant and deletes the old
  load/list/Zod/freshness path outright. D3 requires a source-path table and no
  Oak-signal/pedagogical-move crosswalk. D5 ingests the D2 raw foundation into the
  D4-ratified deterministic graph-native EEF projection. D6 registers only
  graph-derived MCP surfaces. Treat the live plan as the sole authority.
