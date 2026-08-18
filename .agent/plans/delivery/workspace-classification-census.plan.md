---
id: workspace-classification-census
node_type: delivery
name: "Workspace classification census — re-ground the surface-isolation matrix from the live estate"
overview: "Classify every workspace and tracked non-member code surface on the Oak-specificity axis from live dependency-graph and metadata evidence, superseding the 2026-04-28 matrix, with leakage types, target states, tranche ownership, and licence mapping — evidence and classification only, no moves."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-12
ratified_where: "Owner decision card at the Director seat (b10c37), 2026-08-12 ~18:05Z, answer 'Ratify' — verbatim card text and answer recorded on the census/survey ARC channel (.agent/collaboration/rapid-comms/2026-08-12-census-survey-nautilus-calls-plankton-and-plover-lifts-troposphere.md, stamp entry 2026-08-12T18:1xZ)"
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets:
  - MCP-601
depends_on:
  - plan: survey-machinery-deconstruction
    kind: beneficial
last_updated: 2026-08-14
---

# Workspace classification census

## Why this node exists

The owner ruled (decision cards, 2026-08-12) that the survey programme's
first concrete move is this census. The authoritative workspace
classification matrix — the first todo of the oak-surface-isolation
programme brief — has not moved since 2026-04-28, while the estate has
(two of the brief's matrix rows name workspaces that are no longer pnpm
members). Three consumers wait on the boundary answer the matrix carries:

1. the estate-boundary decision the owner holds (what belongs inside this
   repository as a workspace);
2. the lesson-retrieval backlog explicitly compiling items "for when the API
   code moves into the repo" (`lesson-retrieval-boundary-differentiation`);
3. the thinnest-Oak-slice separation path with its licence mapping (code
   MIT, content OGL, brand reserved).

The census is also the survey programme's workspace-scale opener: its
classification spine — the Oak-specificity axis — is the second axis the
foundational-building-blocks frame already names, measured here at the
workspace scale.

The `depends_on` edge to `survey-machinery-deconstruction` is beneficial,
not blocking: the census ships fully without it. The edge matters only if
the falsifier below fires — the flipped sequencing then consumes that
node's extractor contract-coverage map.

## Goal

Every census subject has a current, evidence-backed classification:
**generic foundation / mixed / Oak leaf**, with the named leakage types
where Oak identity has leaked into foundational surfaces (names, defaults,
emitted surfaces, telemetry namespaces, ownership metadata, domain
assumptions — the surface-isolation brief's own taxonomy, each instance
qualified by leakage DEPTH from a closed three-value vocabulary:
`docs-level` / `source-embedded-docs` / `runtime-emitted`. The depth
distinction was surfaced by the 2026-08-12 live-tree walk — Oak example
strings shipping inside source TSDoc are one layer deeper than README
prose — and is committed at authoring time like every other column
vocabulary here), a target state, tranche ownership,
and a licence-mapping column. Column vocabularies are closed at authoring
time so no taxonomy is invented mid-census:

- **tranche ownership**: `1`–`6` (the brief's tranches) or
  `none-assigned` — subjects newer than the brief take `none-assigned`;
  assigning them tranches is brief/owner work, out of scope here.
- **licence mapping**: `code-mit`, `content-ogl`, `brand-reserved`, or a
  composite list per subject (the ratified model applied, never
  re-opened).

For subjects classified `mixed` only, a thinnest-Oak-slice
disposition (what would move, stay, or split) — restricted to `mixed`
because generic and Oak-leaf rows need no split judgement; the full split
design remains tranche work. The 2026-04-28 matrix is explicitly superseded
with a delta section, so its consumers stop reading a stale map.

**Census subjects, defined mechanically:** the union of (i) every pnpm
workspace member (per `pnpm-workspace.yaml`); (ii) the parent directory of
every tracked `package.json` outside the member set; (ii-b) the parent
directory of every tracked `.claude-plugin/plugin.json` manifest outside
the member set (the owner-approved manifest arm, 2026-08-14 — plugin
surfaces such as `plugins/oak-open-curriculum/` carry no `package.json`
and no code-extension files); (iii) every top-level path segment of
`git ls-files` holding files in a stated code-extension set (declared in
the enumeration instrument; `.ts`/`.tsx`/`.js`/`.mjs`/`.cts`/`.mts`/`.sh`
at minimum) that are not themselves inside a directory covered by (i),
(ii), or (ii-b) — coverage judged per file, so a segment holding a nested
subject AND code outside it keeps its code root. This is what catches the
per-workspace `runtime-only-scripts/` tiers and the
deliberately-unregistered research roots without a judgement call. The
boundary decision this census serves is precisely about surfaces the
member list cannot see; each derived subject gets a matrix row or a
recorded exclusion, never silence.

**Subject identity is dual:** each row carries the directory path AND the
published package name where one exists (the live estate already diverges
— `packages/core/oak-eslint` ships `@oaknational/eslint-plugin-standards`,
`packages/sdks/oak-curriculum-sdk` ships `@oaknational/curriculum-sdk`).
The delta section keys on directory path so renames read as renames,
never as a disappearance plus an appearance.

## Mechanism

Evidence-first classification, judged readings corroborated:

- **Detector facts**: the dependency graph (the estate's depcruise
  instrument and turbo task graph), workspace metadata (package.json name,
  exports, dependencies, ownership strings), emitted surfaces (generated
  CSS variables, span names, env schemas), and direct greps for the leakage
  instances the surface-isolation brief already names — re-verified live,
  not inherited.
- **Judged readings** (the classification, target-state, and
  thinnest-slice calls): each carries at least two independent evidence
  kinds (static structure, emitted-surface content, consumer topology,
  doctrine/ADR record), with detector facts and judged readings separated
  in the matrix. At this scale the two-independent-kinds discipline is the
  corroboration mechanism; the WS9 stratified-quartet pattern (the owner's
  co-design ruling) binds at the survey's later judged scales, where
  candidate-level judgement warrants milestone-scale corroboration — it
  would be disproportionate on ~35 workspace rows. The ruling is disposed
  of here visibly, not dropped.
- **The artefact and its home**: the matrix lands at
  `.agent/reports/workspace-classification-census/matrix.md` (a new report
  home in the current estate — not inside the superseded July backlog
  directory), with a supersession pointer edited into the
  oak-surface-isolation brief's matrix section and todo.
- **Adjacent matrix, disposed**: the July backlog's
  `workspace-layer-separation-audit` phase-1 matrix classifies on a
  DIFFERENT axis (layer placement, not Oak-specificity). The census names
  it and cross-references rather than duplicating; reconciling the two
  axes into one surface is future work for the survey design, not this
  node.

**Recorded falsifier:** if honest leakage claims turn out to need
construct-level evidence underneath — claims this census cannot corroborate
from graph, metadata, and emitted surfaces — the census stops at the
affected rows, records them as `needs-construct-evidence`, and the
programme's sequencing question routes back to the Director; the code-scale
instrument decision then comes first. **The trigger, operationally:** a
judged row hits the falsifier at the moment its classification cannot
reach two independent evidence kinds from the named instrument set, or its
leakage claim can only be verified by reading construct-level code
semantics. Affected rows stop individually; the census completes its other
rows; the sequencing question routes ONCE, at the judged pass's
completion — immediately instead only if the affected class is clearly
systemic (the matrix's answer to its consumers would be voided). If it
fires, this node acquires an `owner_gates` entry
(`awaiting: owner-decision`, absolute expiry inheriting the strategic
parent's `gate_expiry_default`) so the wait is schema-visible, never an
open holding state.

## Acceptance criteria

1. Every census subject has a matrix row or a recorded exclusion. Proof:
   repo-safe — a committed TypeScript enumeration-and-validation
   instrument (agent-tools home, one-command run; TypeScript rather than
   shell because the instrument accretes exactly the set-union, diffing,
   and per-row validation logic ADR-168 §5's shell exception excludes,
   and `source-is-typescript-esm-only` + `validators-must-recompute`
   govern it) recomputes the mechanical subject definition above and
   diffs it against the matrix's rows plus recorded exclusions; a
   reviewer runs one command for pass/fail.
2. Every judged row carries at least two independent evidence pointers of
   distinct kinds, and detector facts are separated from judged readings.
   Proof: repo-safe — the matrix's row data is a committed structured
   artefact (the human-facing table rendered from or cross-checked
   against it, so validation parses data, never prose); the same
   instrument validates every judged row has ≥2 distinct kinds and both
   identity fields.
3. The 2026-04-28 matrix is superseded explicitly: a delta section names
   every subject whose classification changed, appeared, or disappeared —
   keyed on directory path, with renames recorded as renames. Proof:
   repo-safe — the instrument derives the delta from the two documents'
   row sets and diffs it against the banked delta section.
4. The owner confirms, at this matrix's own review card, that it answers
   the boundary question at the level his decision needs (the census does
   not make the decision). Proof: owner-held — the card answer recorded in
   this plan's amendment trail.

## Out of scope

- Any workspace move, rename, split, or tranche execution — evidence and
  classification only. Tranche OWNERSHIP is a matrix column; tranche
  SEQUENCING is an owner decision and stays out.
- Any licence change (the licence column maps the ratified model; it does
  not re-open it).
- Thinnest-slice dispositions for `generic` and `oak-leaf` rows (no split
  judgement exists to record).
- Reconciling this matrix with the layer-separation audit's matrix (named
  and cross-referenced only).
- The reference pattern corpus and the fresh survey design (their own
  nodes).
- Construct-level (code-scale) evidence — a genuine need for it triggers
  the recorded falsifier, never silent scope growth.

## Todos

1. Land the TypeScript enumeration-and-validation instrument; derive the
   subject list (members + non-member surfaces, mechanical predicate);
   skeleton the structured row artefact with the column contract
   (dual identity, classification, leakage types with the closed depth
   vocabulary, evidence + kind, target state, tranche ownership with
   closed vocabulary, licence mapping with closed vocabulary,
   thinnest-slice for `mixed` rows).
2. Detector-fact sweep: dependency graph, metadata, emitted surfaces,
   leakage greps — banked per subject.
3. Judged-reading pass with two-kind corroboration per row.
4. Delta section against the 2026-04-28 matrix; supersession pointers
   edited into the surface-isolation brief.
5. Report assembly; enumeration instrument green; validator and gate
   green; PR.

## Amendment trail

- **2026-08-18 — merge-round truing: reground re-grade recorded; false-edge cures; prose counts re-banked.** The workspace-basis re-grounding (2026-08-17, owner correction; record at `.agent/research/workspace-basis-regrounding-2026-08-17.md`) re-grades the round-2 target inventory (34→66) and taxonomy adoption to historical data carrying zero deference weight; the round-2 card path is cancelled at owner ruling, and the work that follows the census is governed by the owner's five-point repo-architecture brief (MCP-619). The decomposition artefacts (decomposition-analysis.json, target-inventory.json, decomposition-synthesis.md — status header re-trued) remain banked as candidate archive material stripped of deference arguments; the current-state census (facts/rows/matrix and the instrument) is unaffected as baseline evidence. Same round, review cures: sourceDependencies no longer fabricates root-subject edges from Node builtins or unresolvable specifiers (both classes verified first-hand, facts regenerated — the runtime-only-scripts `.` edge and two other false residuals cleared); facts parity is byte-exact over the whole artefact envelope via one canonical serialisation shared by `facts` and `check`, with duplicate-subject rejection; artefact orderings use a locale-independent comparator (host-ICU `localeCompare` could render byte-different artefacts across machines). Recorded limitations, deliberate: the depcruise scope is the fixed boundary-gate root list, so a subject outside those roots carries an empty-vs-not-scanned ambiguity in sourceDependencies, and the root subject's `.` catch-all attribution is the same design family (derive cruise scope from the live subject set as follow-on); prose-embedded counts in rows.json are banked snapshots that `check` does not cross-validate against facts.json — this round re-banked them against the regenerated facts, restating the word-boundary grep case-insensitive at 136 of 1296 (the prior 227/1287 pairing reproduced under no stated method). The post-cure Copilot round (2026-08-18, suppressed comments, zero threads) added four instrument follow-ons recorded with the same deferred disposition: the delta's rename fallback (a rename that also changes classification currently reports only under its new directory), a literal ROWS_SCHEMA_VERSION equality check at the rows-artefact boundary, strict rejection of malformed depcruise dependency entries (parity with parseTurboTasks), and the vocabulary membership check's literal widening.
- **2026-08-17 — review-round cures: predicate text formalised; coverage judged per file; subject 45.** The mechanism's predicate paragraph now enumerates arm (ii-b) explicitly (it had lived only in the amendment trail — a reviewer-caught split state) and records the per-file coverage refinement to arm (iii): a top-level segment holding a nested subject AND code outside it keeps its code root (previously the whole segment was skipped — the reviewer-found gap). Under the refined arm the instrument derives 45 subjects: `.agents` (vendored external skills + generated skill projections) enters with a recorded exclusion. The same round hardened the instrument (full row-shape parse, non-blank evidence pointers, dual-identity coverage, Result-contract resolver parse, legacy-label parse errors, all-rows delta presence with dangling-rename surfacing, TOCTOU-free scanning with declared skips) and extended `check` to recompute facts.json and matrix.md for parity (validators-must-recompute).
- **2026-08-14 — review card round 2 (~15:3xZ): DIRECTION CONFIRMED; criterion 4 satisfied on the decomposition spine.** The round-2 target inventory (34 workspaces -> 66, one lifecycle each; codegen split into spec-acquisition / reusable pipeline / generated artifact holders; editorial synonyms separated; generated output never co-resident with handwritten code; banked at the census report home: decomposition-analysis.json, target-inventory.json, decomposition-synthesis.md) was presented at the owner's round-2 card with three questions. Answers, verbatim: "Direction confirmed" (the census finalises on this spine — revised matrix dispositions, manifest arm, instrument green); "One programme node (Recommended)" (a single strategic reorganisation node owns the target inventory and sequencing, per-tranche delivery nodes authored at pickup); "Adopt as proposed" (directory taxonomy: packages/codegen/, packages/generated/, packages/search/, packages/mcp/, packages/graph/ join the existing roots; generated/ is the separation tier). Decision card direct to the lane seat.
- **2026-08-14 — review card round 1 (~12:2xZ): matrix NOT YET SUFFICIENT; decomposition depth directed.** The census ran end to end (PR #889: 43 subjects, check PASS, matrix rendered, 2026-04-28 superseded). The owner's criterion-4 answer, verbatim: "not yet sufficient, it's the right start, but I think we can go CONSIDERABLY thinner in the oak leaves, I was expecting much more splitting of reusable code. Additionally I want the SDK codegen and SDK both split along at least two dimensions, oak Vs reusable, and generic openapi parsing, and type/constant generation, and bulk data processing... just really tidy the lifecycle of the codegen, there are at least three or four mixed concerns blurring different life cycles. Go back to basics and ask what transformations are present, who consumes the result and when, when matters, and could it be simpler if we split it more. and I don't want the generated output mixed with non generated code, I want a much cleaner and better defined separation. In summary, I expect the number of workspaces to increase significantly, the scope of individual workspaces to narrow, and the organisation of workspaces to improve" (decision card, direct to the lane seat). Binding consequences: (a) decomposition dispositions extend beyond mixed rows — oak-leaf rows carry reusable-code extraction dispositions; the SDK/codegen chain is analysed on the named lifecycle dimensions (oak vs reusable; openapi parsing / type-and-constant generation / bulk data processing); (b) generated-vs-non-generated separation becomes a judged concern on every row where generated output exists; (c) the census re-presents at a round-2 card. The mixed-only thinnest-slice restriction in §Goal and §Out of scope is superseded by this owner word for round 2.
- **2026-08-14 — manifest arm approved at the same card.** The mechanical predicate gains arm (ii-b): the parent directory of every tracked `.claude-plugin/plugin.json` manifest — curing the predicate finding (the plan's motivating example `plugins/oak-open-curriculum` previously failed the plan's own mechanical predicate; discovered by the instrument 2026-08-14). Owner answer verbatim: "Add the manifest arm".
- **2026-08-14 — execution gate discharged at the owner's word.** The
  2026-08-12 hold ("don't start the survey until I give the word",
  narrowed 2026-08-14 to design-only) discharged at Jim's decision-card
  answer, verbatim "Go — run the survey lane", given direct to the lane
  seat (Nautilus calls Plankton, c6d48b) 2026-08-14 ~10:44Z. The
  `owner_gates` entry is removed by this amendment; execution ticket
  MCP-601 opened the same hour.
