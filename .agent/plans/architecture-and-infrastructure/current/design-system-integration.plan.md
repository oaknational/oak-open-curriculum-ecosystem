---
name: "Design-System Integration"
overview: "Integrate the Oak design system as a first-class workspace (packages/design/oak-design-system) with the Claude Design studio as a first-class team surface, extend the contrast gate to four themes, then converge the hub and the token pipeline onto it (ADR-213)."
todos:
  - id: pr1-doctrine
    content: "PR1: land the composition doctrine note (docs/governance), ADR-213, the ADR-041/148 amendments, the design-token-practice correction, and this plan. Docs-only; tree green."
    status: completed
  - id: pr2-scaffold
    content: "PR2 step 1: scaffold packages/design/oak-design-system as a first-class workspace (package.json with exports map fencing React components off the surface, README carrying the integration contract + the Claude Design sync runbook, .gitignore for held-out asset classes)."
    status: completed
    depends_on: [pr1-doctrine]
  - id: pr2-manifest
    content: "PR2 step 2: author the per-file-class licensing manifest (every design-system file class: provenance, licence, disposition track/hold-out/owner-call) BEFORE the initial import; include the hub tracked-logos ratification question. Owner reviews this in the PR."
    status: completed
    depends_on: [pr2-scaffold]
  - id: pr2-initial-import
    content: "PR2 step 3: initial import of the tracked file classes from the Claude Design studio (owner-downloaded export bundle route), verify referential self-consistency (clean on the public surface; studio-runtime wiring documented in the workspace README). Landed SHA:922f2e806 on PR #411; merged to main SHA:dc16295bf."
    status: completed
    depends_on: [pr2-manifest]
  - id: pr2-consistency-check
    content: "PR2 step 4 (re-homed to the PR3 lane by ARC agreement 2026-07-19 — it composes with the boundary-validation cycles in design-tokens-core, Harrier rides Updraft's boundary): the dtcg↔CSS consistency check as a workspace-owned repo validator chained into repo-validators:check — semantic regeneration comparison (parse both surfaces, compare token values; never a byte checksum — hashing pins bytes and proves no behaviour). Test + check land together; tree green. Build contract (verified 2026-07-19, three adversarial verifiers): two naming transforms (oak.color.x → --oak-x, font.family.x → --font-x); dark = 60 light-dark second arms + 3 filter.* overrides; real CSS parser, never brace-scanning; :root-scoped comparand; primitives tier included; the two deliberate non-token props (--canvas-rows, --icon-src) excluded. Full evidence: .agent/reports/design/aip-137-stage-a-import-verification-2026-07-19.md Part 2 §1, landed with PR #411. Still open as of 2026-07-20: PR #412 did not include this check."
    status: pending
    depends_on: [pr2-initial-import]
  - id: pr3-cycle-completeness
    content: "PR3 cycle 1: theme overlay-coverage validation in design-tokens-core (declared light base; every overlay key must exist in the base — orphan detection plus coverage reporting; reshaped 2026-07-19 when the falsifier fired — see ADR-213 §2 amendment) — failing test + implementation, Result-typed. Landed on PR #412 (merged SHA:6631bb5ac): validateThemeOverlayCoverage plus unit tests in design-tokens-core."
    status: completed
    depends_on: [pr2-initial-import]
  - id: pr3-cycle-boundary
    content: "PR3 cycle 2: boundary validation for the design system's DTCG import — schema-validate contrast-pairings.json (no cast); reject non-literal colour $values (color-mix/calc) with a structured Err. Landed on PR #412 (merged SHA:6631bb5ac): contrast-manifest-parse (schema-validated, no cast) and validateColourLiterals (closed colour grammar, structured Err) plus unit tests."
    status: completed
    depends_on: [pr3-cycle-completeness]
  - id: pr3-cycle-four-theme-gate
    content: "PR3 cycle 3 (reshaped 2026-07-20 by the pre-execution review against the real export): add a second gate instance in oak-design-tokens beside the retained hand-authored gate (dual-gate window, ADR-213 §2 amendment 2026-07-20) consuming the design system's dtcg trees + contrast manifest — compose light base ⊕ overlay per theme BEFORE resolution, resolve references to fixpoint (the bare dialect carries forward references), filter the comparand to six-digit hex with toHexComparand (alpha/expression exclusion by one closed rule), run the manifest per theme at the ratified levels (high-contrast at AAA thresholds, light/dark/colour-safe at the AA floor — owner 2026-07-20), assert the pinned expected comparand count per composed theme, write a separate source-labelled report artefact, pin allowed roots per tree (validateTreeRoots), add the oak-design-system workspace devDependency + the oak-eslint boundary-roster edit (ADR-041 owes the regeneration), adjudicate the build.ts gate vs build-css integration re-proof duplication, and re-baseline design-token-practice.md's two-theme wording in the same PR. PR #412 landed the composition semantics (ADR-213 §2 amendment) and the core validators this cycle composes; the gate itself rides PR #423."
    status: completed
    depends_on: [pr3-cycle-boundary]
  - id: ws-hub-migration
    content: "Follow-on lane (pointer, not spec): migrate demos/oak-curriculum-hub onto the design system per its integration doc sequence — @theme-inline mapping first (kills the raw-hex mirror), then theme/motion/focus wiring (inline head script per ADR-213 §3, per-theme axe run), then components incrementally, then audit-in-CI. Flip the hub token-audit authority pointer from the untracked export to the in-repo design system."
    status: pending
    depends_on: [pr3-cycle-four-theme-gate]
  - id: ws-stage-b-convergence
    content: "Follow-on lane (pointer, not spec): ADR-213 Stage B atomic token-source switch — ONE change deletes oak-design-tokens' hand-authored trees (+ their contrast manifest + gate instance, closing the dual-gate window), re-points generation at the design system's export, regenerates index.css + terminal theme, proves the 11-path terminal contract and MCP views, regenerates depcruise boundary rules, and retires design-token-practice.md's transition note in the same change. No interim dual-source landing. PICKUP SURFACE: the Stage-B interchange-contract exploration report (.agent/reports/design/aip-137-stage-b-interchange-contract-concept-exploration-2026-07-20.md) + the ADR-213 §2 amendment of 2026-07-20 (slot c) — the naming artefact is a TOTAL DISPOSITION map (emit/omit + reverse coverage + emit-target uniqueness + reference-closure) checked by a NEW migration-parity check landing inside the Stage-B change (distinct from the kit-internal dtcg↔CSS export check); runtime-computed values are barred from the terminal map by a NEW value-shape leg on its build check (requiredColour is presence-only today); the mapped index.css is the declared transitional delivery surface with its retirement condition in §2."
    status: pending
    depends_on: [pr3-cycle-four-theme-gate, pr2-consistency-check]
  - id: ws-views-direct-kit-css
    content: "Follow-on lane (pointer, not spec): retire the transitional mapped index.css — bind the MCP App views to the design system's kit CSS directly, delete the disposition map + the migration-parity check in the same change (the ADR-213 §2 amendment 2026-07-20 records this as the map's retirement condition), and prove the views against the kit CSS in the same change. This closes the declared transitional delivery-surface window."
    status: pending
    depends_on: [ws-stage-b-convergence]
  - id: ws-hub-behaviour-consolidation
    content: "Follow-on (pointer; exploration step 1): consolidate the hub's duplicated roving/synthetic-key behaviour into a hub-local components/widgets/behaviour/ module preserving BOTH key-set contracts (radio incl. the any-key fall-through guard; tabs), replace-dont-bridge, SR spot-check on the migrated widgets."
    status: pending
  - id: ws-fixtures-parity
    content: "Follow-on (pointer; exploration step 2): fixtures-as-parity inside oak-design-system against the four compiled components — converts the no-drift claim from constructional to checked."
    status: pending
  - id: ws-gate-extension
    content: "Follow-on (pointer; exploration step 3; HARD precondition for any first Base UI widget): ADR-147 gate extension per the RESOLVED owner ruling — per-tree axe runs across all four colour trees, forced-colors render check, motion-axis coverage, a system-selects mechanism test (never a duplicate tree validation), CI promotion of test:a11y; fix the checklist's theme-count inconsistency; high-contrast targets AAA thresholds (ratified, owner 2026-07-20)."
    status: pending
  - id: ws-checklist-upgrades
    content: "Follow-on (pointer; exploration step 4; gated on the SR-operator owner fork): symmetric platform/hand-rolled checklist; rotating two-pair SR matrix; named SR operator + cadence."
    status: pending
  - id: ws-design-sync-corrections
    content: "Follow-on (pointer; exploration step 5): the studio sync-back batch — Base UI pin-note misattribution + v1.0 date, popover row behaviour-only annotation, anchor-positioning progressive-enhancement-only, customizable-select ban, GDS date row, zag-js vanilla + light-DOM-only sentence, plus this session's accumulated fixes (styles.css comment bug, print.css, OakButton/OakSubjectChip, beforeInteractive corrections, formatting pass)."
    status: pending
  - id: ws-parity-diff
    content: "Follow-on (pointer; exploration step 7): one-shot throwaway diff script of estate palette vs @oaknational/oak-components 3.0.0 — owner-decision input for the brand-parity fork; no workspace, no gate, no ADR change."
    status: pending
isProject: false
---

# Design-System Integration

**Last Updated**: 2026-07-20
**Status**: 🟢 EXECUTING (PR1 #410, PR2 #411 `SHA:dc16295bf`, and PR3 cycles 1–2 #412
`SHA:6631bb5ac` merged; ADR-213 Accepted 2026-07-20; cycle 3, the dtcg↔CSS consistency
check, and the follow-on lanes remain open)
**Scope**: Integrate the Oak design system as a first-class workspace — the estate's design
source of truth — with the Claude Design studio as a first-class team surface, and sequence
every consumer onto it, per ADR-213.
**Ticket**: AIP-137. **Branch model**: new branches on the primary checkout (explicit owner
instruction, 2026-07-19 session Caracal wakes Tunnel 265648 — supersedes the worktree default
for this lane).

---

## Goal · In · Out

**Goal**: repo UI surfaces consume one canonical, licence-clean design system — fully part of
this repo, with its accessibility guarantees enforced by build-time gates — while design
iteration continues first-class in the Claude Design studio, and component authorship has an
unambiguous decision path.

**In scope**: the composition-doctrine note; ADR-213 and its companion amendments; the
`packages/design/oak-design-system` workspace, its initial import, and the bidirectional
design-sync discipline + runbook; the licensing manifest; the contrast-gate extension (2→4
trees, completeness, boundary validation); the hub migration lane; the Stage B token-source
convergence lane.

**Out of scope**: new product UI features; the production `@oaknational/oak-components`
package; white-label brand authoring beyond the integrated proofs; autonomous background sync
(sync runs are deliberate session actions per the design-sync discipline); bulk rewrite of the
hub's component-level arbitrary values (direction named in ADR-213, executed opportunistically).

## Context

The design system was built in the Claude Design project "Oak Open Curriculum Design System"
(v1.7.0, project id `314dd517-493d-4be2-bd08-56ae0e80e780`). Owner ruling (2026-07-19): it is
being **integrated, not vendored** — the design system is a first-class part of this repo and
the estate's design source of truth; Claude Design is a first-class team seat whose studio
project remains a live working surface of the same system; neither side is accessed like a
record. The architecture — integration contract, source-of-truth inversion, component-system
decision table, dependency direction, staged convergence, licensing boundary — is decided in
[ADR-213](../../../../docs/architecture/architectural-decisions/213-design-system-integration-and-component-architecture.md);
this plan sequences the execution and holds the boundary conditions ADR-213 records.

Four specialist reviews shaped ADR-213 and this plan (design-system-expert,
react-component-expert, architecture-expert-fred, assumptions-expert; all
sound-with-revisions, 2026-07-19, absorbed — their vendoring-frame recommendations were
superseded by the owner's integration ruling the same day). Load-bearing corrections, so
executors do not re-derive them:

- **The Stage B boundary conditions are owned by ADR-213 §2** (naming via the per-consumer
  projection maps, dialect-alias resolution, per-consumer expression dispositions (§2
  amendment 2026-07-20), manifest schema-validation, overlay completeness, triads, the
  11-path terminal contract) — read them there. This plan
  adds only the mechanism specifics behind them: the design system's `dtcg/README.md` claim
  that its `oak.color.*` paths "land on the repo convention" is **false** against
  `design-tokens-core`'s flattener (`toCssVariable` prefixes `--oak-` itself →
  `--oak-oak-color-*`; tier detection keys off the root segment; `validateTierReferences`
  rejects semantic→semantic; non-hex strings crash `hexToSrgb` with a bare throw). The re-root-or-normalise
  binary this fact once posed is DISSOLVED by the ADR-213 §2 amendment of 2026-07-20
  (slot c): naming is resolved per consumer — the web-CSS projection's total disposition
  map owns it; the flattener facts above stand as the mechanism evidence. Do not widen
  `PALETTE_VARIABLE_PATTERN`; do not rename the system's CSS variables.
- The theme-bootstrap pattern in the system's own Next.js guide (`beforeInteractive`) is wrong
  for FOUC-free theming on Next 16; ADR-213 §3 records the correction (raw inline head
  script). Feed it back into `docs/consuming-nextjs.md` through the design-sync flow.
- The hub's licensing baseline is: logos tracked (`public/oak-logo*.svg`), vendor export
  bundle gitignored, fonts untracked repo-wide. The manifest ask includes ratifying or
  correcting that baseline.

## The design-sync discipline (PR2 deliverable)

One system, two first-class surfaces. The workspace README carries the runbook:

- **Studio → repo**: after design sessions, changed files come back via DesignSync reads and
  land as a normal reviewed PR into the workspace (incremental, per-component — never a
  wholesale replace). The studio's `HANDOFF.md`/`CHANGELOG.md` name what changed.
  **Standing item (2026-07-19, revised same day)**: `dtcg/README.md` landed with PR #411.
  The remaining obligation is the recorded per-consumer divergence: the export contract
  passes the 15 expression values through verbatim, while ADR-213 §2 rejects them on the
  contrast-resolution path (three are `currentColor`-dependent — never statically
  pre-computable). Stage B's emission-lane expression handling is DECIDED by the ADR-213
  §2 amendment of 2026-07-20: pass-through for CSS emission (the browser evaluates),
  `runtime-computed` values barred from the terminal map by its value-shape leg, and the
  contrast path dropping by post-resolution value shape — per-consumer dispositions,
  never silent adoption of either side.
- **Repo → studio**: before design sessions, the studio is brought current from the repo copy
  via the design-sync flow (structural diff from `list_files`, then targeted writes).
- **Conflict rule**: git review is the merge authority. A sync never overwrites unreviewed
  repo changes; disagreements resolve in the PR, and the studio re-syncs from the merged
  result.
- Sync runs are deliberate session actions (no background automation). The dtcg↔CSS
  consistency check guards internal canonicality on both surfaces' behalf.

## PR sequence

One lane, sequenced PRs, each linked to AIP-137:

1. **PR1 — doctrine** (PR #410, merged): the note at `docs/governance/one-html-many-css-compositions.md`,
   ADR-213, ADR-041/148 amendments, `design-token-practice.md` correction, this plan.
2. **PR2 — Stage A integration** (PR #411, merged `SHA:dc16295bf`; the consistency check
   re-homed to the PR3 lane and still open): scaffold + licensing manifest + initial import
   and sync runbook. The workspace lands **inert as a token source** (zero
   consumers switch yet) — per replace-dont-bridge this is not a bridge. The licensing
   manifest in the PR body is the owner's review surface; held-out classes are explicitly
   gitignored with a documented re-obtain path. Consumer evidence: PR3's validation gate is
   the first consumer; the hub (ws-hub-migration) is the named second.
3. **PR3 — validation layer** (PR #412, merged `SHA:6631bb5ac` — cycles 1–2; cycle 3 still
   open): TDD cycles extending `design-tokens-core` (completeness check,
   boundary validation, four-theme contrast gate). Triads: author component-tier triads for
   the design system or record their absence in the manifest run.
4. **Follow-on lanes** (pointers by design; specs live at pickup): hub migration;
   Stage B atomic convergence. Both gate on PR3. Between PR2 and Stage B the repo carries two
   token systems: the convergence owner is this lane (AIP-137 successors), the retirement
   condition is Stage B's single atomic change, and **no new consumer may adopt the
   hand-authored `oak-design-tokens` trees during the window**.

## Owner gates (named; none block PR1–PR3 execution)

| Gate | Surfaces at | Decision |
| --- | --- | --- |
| Licensing manifest disposition | RESOLVED (owner, 2026-07-19) | Oak material tracked (brand-asset separation + the licence file's BRANDING.md reference hold); the hub's tracked logos ratified; third-party social marks their own manifest class — recorded in ADR-213 §Owner gates, landed with PR #411 |
| Theme cardinality + high-contrast level | RESOLVED (owner, 2026-07-19) | Verbatim: "Maximal, all of it, but 'system' isn't a theme, it's a mechanism, we only need to prove it chooses a theme, the validity of that theme is proven separately, otherwise we are simply validating one theme twice." Implementation reading: gate ALL FOUR colour trees + forced-colors + the motion axis; `system` gets a mechanism test (proves it selects), never a duplicate tree validation; high-contrast gates at AAA per "maximal, all of it". RATIFIED (owner, 2026-07-20, via Director card, verbatim option "AAA for HC, AA floor elsewhere"): high-contrast gates at AAA thresholds, light/dark/colour-safe at the AA floor — the flagged implementer's reading is discharged; PR3 wires this shape directly |
| ADR-213 ratification | RESOLVED (owner, 2026-07-20) | Proposed → Accepted by in-session ratification — verbatim: "if it is wrong the system will tell us through natural use" — recorded in the ADR status line with the PR #410/#411/#412 landings |
| SR audit operator + cadence | RESOLVED (owner, 2026-07-19) | Owner-run VoiceOver/Safari at each widget ship; NVDA/Firefox alternating per widget class; batched with pin-bump re-audits; the operator named in every checklist record |
| Native date-input chrome | first date widget | Accept un-themeable browser calendar chrome or close the row (exploration recommends: close; GDS multi-field + React Aria) |
| Brand parity with production | after ws-parity-diff | Parity as documented vocabulary vs standing goal (recommendation: vocabulary only; a11y outranks parity) |
| Region-contract first binding | hub convergence lane | Bind at the hub shell, or record future-surfaces-only |

## Validation

- PR1: `pnpm markdownlint-check:root`, link integrity, ADR index updated.
- PR2: referential self-consistency check (no tracked→held-out references); workspace
  builds; `pnpm check` green. The dtcg↔CSS consistency check is not a PR2 criterion — it
  was re-homed to the PR3 lane and remains outstanding (see `pr2-consistency-check`).
- PR3: new validators red→green in TDD cycles (met for cycles 1–2 on PR #412); the
  four-theme contrast-gate run against the design system's manifest is cycle 3's criterion
  and remains outstanding; full gate chain green.
- Follow-on lanes: per ADR-213 (Stage B proves both live consumers in the same change;
  hub migration lands with per-theme axe runs per ADR-147).

## Falsifiers

- If the design system's four semantic trees do **not** define the same key set, the
  completeness check is doing real work (expected: high-contrast/colour-safe trees are
  sparser — the check may need a declared-subset model rather than strict equality; resolve
  against the actual trees at PR3, and record the resolution in ADR-213 if it deviates).
  **FIRED AND RESOLVED 2026-07-19**: the imported trees are strict-subset overlays over
  light (139/63/67/12 leaves, zero orphans); the declared-base overlay model is recorded in
  the ADR-213 §2 dated amendment, and `pr3-cycle-completeness` was reshaped to match.
- If the tracked subset cannot be made referentially self-consistent without the held-out
  assets, the hub's gitignored-local-assets pattern applies (tracked code, gitignored assets,
  a documented re-obtain runbook) and the manifest records it.
- If Stage B's 11-path terminal mapping cannot be satisfied from the design system's component
  tree, firing this falsifier HALTS Stage B pending a dated ADR-213 amendment through the
  doctrine slot ("the terminal keeps its own tree" is never self-authorising — §2 requires the
  hand-authored trees deleted and the 11-path contract proved; §2 amendment 2026-07-20); only
  that ratification can record the exception.
- If the bidirectional sync discipline produces repeated conflicts or drift between the two
  surfaces, that is evidence the membrane needs tooling (a structural-diff helper or a
  drift detector) — raise it as a structural cure, do not fall back to record-access.
