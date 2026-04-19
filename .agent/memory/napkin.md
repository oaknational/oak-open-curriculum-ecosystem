## 2026-04-19 — Docs-hygiene parallel track (3 reviewer rounds, fix-and-ship)

### What Was Done

Three rounds of reviewer-driven docs hygiene on the
onboarding/Practice surface, layered on top of the observability
work-in-progress branch (`feat/otel_sentry_enhancements`,
working tree on top of `d0cfaeea`). Round 1 dispatched the
onboarding-reviewer + docs-adr-reviewer at the root README;
Round 2 fixed everything Round 1 surfaced, then re-dispatched
onboarding-reviewer; Round 3 fixed everything Round 2 surfaced.
Substantive outputs:

- PDR-001 supersession marker present in both Status block and
  Decision section; Related field deduped; ADR-131/ADR-144 titles
  in host-local context corrected.
- AGENT.md back inside its `fitness_line_limit` (268/275 fitness
  lines) after a Round 1 condensation pass that overshot to 287
  and a Round 2 prose-line-width fix at line 143.
- `practice-index.md` surface counts refreshed against actual
  filesystem (25 rules / 12 commands / 23 skills).
- Legacy stdio mentions removed from onboarding paths
  (`README.md` directory table, `quick-start.md` architecture
  diagram, `troubleshooting.md`, `environment-variables.md`).
- E2E (mocks/DI, no creds) explicitly separated from credential-
  requiring smoke / search / OAuth workflows in
  `troubleshooting.md` and `environment-variables.md`.
- `apps/oak-curriculum-mcp-streamable-http/README.md` and
  `apps/oak-search-cli/README.md` gained "New here?" repo-
  onboarding signposts at the top (Round 3 reciprocity fix).
- Stale CLI commands repaired:
  - `pnpm qg` → `pnpm check` in `apps/oak-search-cli/README.md`
    (the `qg` script does not exist; canonical is `check`).
  - `pnpm es:setup reset` → `pnpm es:reset` in
    `troubleshooting.md` (the `reset` positional arg was never
    a real script form; the alias is `es:reset`).
- ADR-144 filename/title divergence (`-two-threshold-fitness-model.md`
  filename + "Three-Zone Fitness Model" title) annotated in the
  ADR index so path-based navigation does not surprise readers.

`pnpm practice:fitness` baseline unchanged: `HARD: 2 hard, 12
soft`. Both hards (`principles.md` characters,
`testing-strategy.md` lines + 2 prose-width lines) are
pre-existing and untouched by this work.

### Surprise

- **Expected**: a single round of reviewer-driven docs cleanup
  would clear the Practice/onboarding surface to defensible.
- **Actual**: three rounds were required, and each round caught
  something the previous round did not, including
  self-inflicted regressions from the previous round's own
  fixes (Round 2 caught a 106-char prose-line-width violation
  Round 1 introduced; Round 3 caught a stale `pnpm qg` reference
  in a workspace README that no prior round had visited).
- **Why expectation failed**: docs hygiene work has the same
  shape as code refactoring — fixes can introduce new defects
  whose discovery surface is not the same as the original
  defect's discovery surface. A reviewer scoped to "the root
  README onboarding journey" will not naturally walk into a
  workspace README, and a reviewer scoped to "the file we just
  edited" will not catch a width violation introduced by the
  edit unless explicitly asked.
- **Behaviour change**: when a docs-hygiene pass touches more
  than ~5 files, plan for ≥2 review rounds from the outset, and
  on each round dispatch the reviewer to the *path* (entry
  point → leaf), not to the *files known to have changed*.

### Surprise

- **Expected**: numbered claims in Practice surface docs (rule
  count, command count, skill count, pattern count) would
  drift one or two at a time, caught reactively when they
  failed a sanity check.
- **Actual**: four numbered claims drifted simultaneously and
  silently in a single document (`practice-index.md`): pattern
  count (claimed 56/57, actual 77 — a previous session caught
  this); rule count (claimed 34, actual 25); stable command
  count (claimed 10, actual 12); skill count (claimed 27,
  actual 23). All four lived together for an unknown but
  non-trivial number of sessions.
- **Why expectation failed**: no fitness function ties a
  written numeric claim to its source enumeration (the
  filesystem). Numbered claims are write-once and never
  re-validated against reality unless a human reads them
  carefully. The mental model of "numbers drift one at a time"
  was wrong; they drift in clusters because the same writer
  often updates several at once and then nobody re-checks.
- **Behaviour change**: when authoring or editing a numbered
  claim about a filesystem-discoverable population (rules,
  skills, commands, patterns, ADRs, PDRs), include the count
  in the same edit as a verification command (e.g.
  `ls .agent/rules/*.md | wc -l`) and either commit the
  command output as a comment or replace the literal count
  with a script-rendered placeholder. Watch-list candidate
  for pattern extraction if a second cross-session instance
  surfaces; extraction trigger = next consolidation finds a
  third or later occurrence.

### Surprise

- **Expected**: workspace READMEs and root-level onboarding
  docs would already form a closed loop, since the root README
  routes into them.
- **Actual**: routing was one-way. Root README →
  `apps/*/README.md` worked, but the workspace READMEs had no
  back-link to `CONTRIBUTING.md`, `quick-start.md`, or
  `AGENT.md`. A contributor who lands in a workspace README
  via an external link or a `cd` from the terminal loses the
  global onboarding context.
- **Why expectation failed**: I assumed reciprocity because
  the first hop was present. Reciprocity is a property of the
  *pair*, not of either side; verifying the outgoing link does
  not verify the return link.
- **Behaviour change**: when adding a cross-link from A to B,
  also check whether B should reciprocate to A (or to A's
  parent index). If the link is part of an onboarding mesh,
  the answer is almost always yes. Other apps in this repo
  (e.g. `apps/oak-curriculum-mcp-stdio`-style workspaces if
  any future ones are added) should default-include a
  back-link block.

---

## 2026-04-19 — Surprises from the consolidation pass itself

Two corrective observations surfaced while running the 2026-04-19 deep
consolidation (commits 2dc4d40b + d0cfaeea):

1. **The "known-deferred hard zone" was under-counted.** Prior handoffs
   tracked three foundational directives (AGENT.md, principles.md,
   testing-strategy.md) as the deferred hard-zone population. Step 9
   fitness surfaced three more: the Core trinity (practice-bootstrap,
   practice-lineage, practice.md) was also hard, and had been for
   multiple sessions without explicit acknowledgement in the handoff
   chain. Owner-directed resolution: raise limits modestly; defer
   full Core refinement to a dedicated future session. Rule extracted:
   fitness-state claims in handoffs must enumerate EVERY hard-zone
   file by name, not summarise as "the three deferred directives".
   Incomplete enumeration lets new hard-zone members accumulate
   silently. Watchlist for pattern extraction if a second instance
   surfaces.

2. **Outgoing PDR reservations create a soft coupling that can be
   missed under consolidation.** My PDR-025 draft (Quality-Gate
   Dismissal Discipline) conflicted with a slot reserved in
   `.agent/practice-context/outgoing/README.md` for
   Three-Zone Fitness Model. The reservation was authored 2026-04-18
   and not surfaced to me before I drafted. Resolved by shifting
   reservations to 026-029. Candidate rule: any consolidation that
   may produce a new PDR should grep outgoing/ for reserved PDR
   numbers before choosing the next-in-sequence. Single instance;
   watchlist.

Both surprises are consolidation-meta — observations ABOUT running the
pass — rather than direction-correcting for the technical tracks.
They're recorded here so the capture→distil→graduate→enforce pipeline
can process them next consolidation if a second instance surfaces.

---

## 2026-04-19 — Napkin rotation after deep consolidation pass

Rotated at 533 lines after a structural-change-heavy window covering
four commits on the observability strategy restructure (2e0be715 Phase
4, f1f2c259 status markers, 7f5b18e7 5-wave reshape, 2e8a140d physical
reorder) plus parallel ChatGPT research normalisation work. Archived
to [`archive/napkin-2026-04-19.md`](archive/napkin-2026-04-19.md).

High-signal entries absorbed this rotation:

- **Patterns extracted** (three new files in
  [`.agent/memory/patterns/`](patterns/)):
  - `stage-what-you-commit.md` — 2 cross-session instances (2026-03-24
    + 2026-04-19). Git index is durable state between edits; inspect
    `git diff --cached` before committing.
  - `foundations-before-consumers.md` — owner-approved. Multi-emitter
    plans must land foundations (schemas, ESLint rules, extracted
    cores) in earlier waves than their consumers, or every consumer
    retrofits. Related: `warning-severity-is-off-severity`.
  - `collapse-authoritative-frames-when-settled.md` — owner-approved.
    Document-structure-layer instance of the no-smuggled-drops
    principle: multiple authoritative frames for the same concept are
    a drift trap; "transitional dual-frame with sunset note" is
    unstable.
- **Distilled additions**:
  - Forward-pointing planning references need "planned, not yet code"
    markers (watchlist; single instance pending cross-session
    validation).
- **Step 7 graduations applied**:
  - `@ts-expect-error` distilled entry **refined** (owner chose
    refine-and-keep) to emphasise the test-design-specific scope
    distinct from PDR-020's RED-phase framing.
  - `All gates blocking, no "pre-existing" exceptions` distilled
    entry **graduated to PDR-025 Quality-Gate Dismissal Discipline**
    (owner-approved). Distilled entry pruned; PDR-025 pointer added
    to the distilled pointer block.
- **Step 8 Core amendment applied**:
  - `practice-lineage.md` Active Learned Principle
    `Compressed neutral labels smuggle scope and uncertainty`
    **extended** (owner-approved) to cover the document-structure
    layer as a third sibling alongside review and planning layers.
    Paired with the new `collapse-authoritative-frames-when-settled`
    pattern as the concrete application.

**Plans and prompts touched this rotation**:

- `.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`
  — Status line + Phase 3 todo note corrected to reflect completion;
  Phase 4 todo note extended with the three post-Phase-4 hardening
  commits (status markers; 5-wave reshape; physical reorder).
- `.agent/practice-core/decision-records/README.md` — PDR-025 entry.
- `.agent/practice-core/CHANGELOG.md` — 2026-04-19 entry recording
  PDR-025, principle extension, pattern authorship, fitness limit
  raises.
- `.agent/practice-context/outgoing/README.md` — future-PDR
  reservations shifted +1 (PDR-025 claimed by Quality-Gate Dismissal;
  fitness-functions / transfer-operations / merge-methodology /
  practice-maturity reservations now 026–029).

**Fitness state at rotation closure (post step 9)**:

- **Core trinity limits raised modestly** per owner direction
  ("raise somewhat, not totally; defer full refinement and
  reflection of the Core to another session"):
  - `practice-bootstrap.md`: target 590 → 680, limit 750 → 830,
    chars 31000 → 40500.
  - `practice-lineage.md`: target 590 → 680, limit 725 → 830,
    chars 36000 → 48500.
  - `practice.md`: chars 23000 → 29000 (lines unchanged at 375/500);
    prose-line-width violation at line 201 fixed by wrapping.
- **Post-raise strict-hard state**: 3 hard items (AGENT.md,
  principles.md, testing-strategy.md) — matching the known-deferred
  directives; no new hard violations introduced. Trinity files now
  soft-zone, not hard.
- **Deferred to future session**: full refinement and reflection of
  the Core trinity (compression, graduation, split decisions);
  remediation of the three deferred directives.
- `distilled.md` final at ~253 lines (soft zone, target 200, limit
  275) after prune + refine + watchlist-add.
- `napkin.md` starts fresh at this rotation record.

**Previous rotation**: 2026-04-18 at 557 lines →
[`archive/napkin-2026-04-18.md`](archive/napkin-2026-04-18.md).

---

## 2026-04-19 — Agentic corpus discoverability review

### Patterns to Remember

- `AGENT.md` already points to ADRs generally (starter block, ADR index, and a
  few specific ADR anchors), but that is not the same as surfacing the
  practice-specific ADR cluster explicitly. If the intent is "agentic doctrine
  should be impossible to miss", add a dedicated practice-ADR cluster rather
  than assuming the general ADR entry path is enough.
- `.agent/reference/README.md` currently omits
  `agentic-engineering/workbench-agent-operating-topology.md`, and there is no
  `agentic-engineering/README.md`. A source corpus can exist without becoming
  discoverable; directory-local indexes matter.
- `docs/README.md`, `docs/foundation/README.md`, `docs/governance/README.md`,
  `docs/engineering/README.md`, `docs/architecture/README.md`, and
  `docs/explorations/README.md` already form a useful human-facing discovery
  mesh. A future agentic hub should index these as source/discovery surfaces
  rather than trying to replace them.

## 2026-04-19 — Agentic corpus implementation notes

- The first implementation batch created the local `.agent` mesh:
  source/current plan, active execution plan, hub README, seed deep dives,
  research lanes, reports lanes, and reciprocal links from the key `.agent`
  indexes.
- Multiple agents are editing the repo concurrently. Before touching any
  overlapping docs surface, re-read the live file and inspect the diff rather
  than assuming the earlier snapshot is still current. Materialised here on
  `docs/foundation/README.md`, `docs/governance/README.md`, and
  `docs/architecture/architectural-decisions/README.md`.
- Treat concurrent edits as a merge problem, not a justification to pause the
  whole lane. Only escalate if the overlapping change directly changes the same
  concept contract this lane needs to edit.
- Closure state for this lane:
  - `pnpm markdownlint:root` passed.
  - `pnpm practice:fitness:informational` still reports the known pre-existing
    directive/core-document issues rather than anything introduced here.
  - `pnpm check` reached `knip` and then failed on an unrelated concurrent code
    change in `packages/core/oak-eslint/src/rules/require-observability-emission.ts`
    (`estree` unlisted dependency). Treat that as out of scope for the
    documentation lane unless the owning implementation asks for help.
  - Final `docs-adr-reviewer` pass was requested after the validation run so the
    review reflects the true end state plus the validation caveat.
  - Follow-up `docs-adr-reviewer` confirmation after the last fixes reported no
    remaining documentation findings in the touched lane files.

## 2026-04-19 — Operational awareness planning notes

### Patterns to Remember

- The continuation prompt's size and mixed content are at least partly the
  result of utility. Treat the current surface as evidence of a missing
  operational-awareness layer, not as a hygiene failure to be "cleaned up"
  blindly.
- Multi-agent continuity hygiene must be thread-aware. A single shared mutable
  prompt is the wrong default home for tactical coordination once parallel
  tracks are normal.
- The missing layer is short-horizon operational awareness, not a replacement
  memory doctrine. Tactical state that changes understanding should promote
  into the existing learning loop rather than evolving into a second memory
  system.
