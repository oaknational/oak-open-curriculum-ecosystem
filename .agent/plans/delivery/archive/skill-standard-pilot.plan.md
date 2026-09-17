---
id: skill-standard-pilot
node_type: delivery
name: "Skill standard pilot: one skill fully to standard, the standard minted by proving it"
overview: "Define the full skill standard — graph frontmatter (concern + domain), schema validation, the agentskills.io supporting-directory set carried across every projection surface, and spec-method evals — and prove it end to end on design-system-usage (content re-trued against both of its homes and the DDRs), then mint ui-visual-design born to the proven standard. The standard definition, not the pilot skill, is the durable artifact."
status: archived
ratified_by: 'Jim Cresswell'
ratified_date: 2026-08-11
ratified_where: >-
  Owner word at the Director seat, morning resume 2026-08-11: "Good
  morning! And, ratified" — answering the stamp card carried in the
  2026-08-10 freeze map (session Plover lifts Troposphere b10c37).
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: skills-estate-organisation
    kind: beneficial
last_updated: 2026-08-12
---

# Skill standard pilot

## Goal

One skill brought fully up to standard — "graph frontmatter, a
validator, and a full set of supporting directories and files, and
evals" (owner's words, 2026-08-10) — with the standard itself defined
as a first-class, reusable artifact that every later skill meets.
Owner-adopted working cut (same sitting): pilot on
`design-system-usage`; mint `ui-visual-design` second, born to the
proven standard. Parent context: `skills-estate-organisation`
§Amendment 2026-08-10b (WS8) names the general enablement; this node
executes its pilot. Ratified 2026-08-11 (owner word at the Director
seat, recorded in the frontmatter stamp); slices route from that
stamp, S4's own content gate excepted.

## The standard (the durable artifact this pilot mints)

A skill is TO STANDARD when all five hold:

1. **Graph frontmatter** on `SKILL-CANONICAL.md`: `concern` (and
   `domain` where the tree carries one) agreeing with tree position —
   the two keys settled by the owner's 2026-08-08/2026-08-10 structure
   rulings and mechanically checkable. Keys stay canonical-side;
   vendor projections stay spec-clean. (kind/stratum/intent are
   DELIBERATELY OUT of the pilot: the owner demoted that scheme to
   candidate — 2026-08-02 exploration addendum — and its adjudication
   is WS1/WS2's, not this node's.)
2. **Schema-validated**: declared keys are checked from the day they
   exist. Pilot scope honours the parent's visibility-before-validation
   owner gate (estate-wide graph-key validation is WS4, post-WS2
   ratification): the pilot's validator checks `concern`/`domain`
   tree-agreement only for skills that DECLARE them — pre-WS2 that is
   the pilot skill alone, ratified by this plan's own stamp.
3. **Supporting directories** per spec §optional-directories as
   needed — `references/`, `scripts/`, `assets/` — canonical-side,
   carried byte-stable into EVERY projection surface: `.claude`,
   `.agents`, AND design-sync where the skill ships to the studio
   (a single-file directWrite there today — the carriage closes that
   gap, never silently strips substance). `evals/` is NOT carried:
   evals are development/QA artifacts, not runtime skill content.
   Empty directories are omitted, never scaffolded.
4. **Evals** per the spec's evaluating-skills method — the convention
   the estate ALREADY carries authored-but-unexecuted (the parallax
   corpus's `evals/evals.json` files use the spec shape verbatim;
   `cognition/parallax/evaluations/README.md` documents the method,
   status authored-not-yet-executed). This pilot is the first
   EXECUTION, not the first authoring. Home ruling
   (replace-don't-bridge): `evals/` is the standard directory;
   parallax's `evaluations/` content folds into the standard's eval
   clause and the directory reconciles at WS2/WS8-general.
5. **Lean entry**: `SKILL.md` projection under the spec's 500-line
   recommendation, with reference substance re-homed to
   `references/` (progressive disclosure).

## Grounding (first-hand, 2026-08-10; assumptions-reviewed same day)

- Spec pages read at time of use: evals model + optional-directories
  (`evals/evals.json` case shape; clean-context runs as subagents;
  workspace `iteration-N/` layout; grading with quoted evidence;
  benchmark deltas; blind comparison).
- Projection machinery: the generator emits pointer-only `SKILL.md`
  files today; the shared three-tier topology walker landed 2026-08-10.
  Carriage is new, test-first machinery — and it is estate-live on day
  one: ten cognition skills already carry supporting directories
  (~109 files under the parallax tree), so the first carriage commit
  sweeps them into drift gating. That corpus is S1a's acceptance
  fixture, not a surprise.
- Graders that exist today: `validate-authored-css` (wired into
  repo-validators). Contrast has library machinery but NO runnable
  CLI grader — contrast assertions grade via the blind judge/human
  until one exists (building one is optional S3 scope, not assumed).
- The W0.7 design-review instrument judges RENDERED PAGES (its
  "blind" = legs blind to each other); it fits eval case (a)'s page
  output only, and pilot verdicts NEVER enter
  `wow-verdict-register.json` (that register is the instrument's own
  calibration series) — eval verdicts live in the eval workspace.
- Content ground truth: the skill serves TWO homes (repo + studio via
  design-sync). The What's-where rows flagged stale are
  studio-correct and repo-stale (`studio-source/` holds them
  in-repo); the re-truing makes each row correct for BOTH homes or
  explicitly path-qualified. DDR corpus DDR-001–008 is the decision
  authority; DDR-004 read in body: FIVE selectable themes, FOUR
  token-bearing (`system` resolves to light/dark and carries no token
  tree — DDR-003). The skill's "four themes via data-theme" is
  conformant; the re-truing is a wording gain ("five selectable, four
  token-bearing"), not a defect cure.

## Decisions made (decision-complete ledger)

- **Carriage is copy, not symlink**: byte-stable copies per surface;
  the checker extends bytewise drift comparison to every carried file
  AND detects orphans (a carried file whose canonical source is gone
  is found and pruned — the current checker has no orphan detection;
  S1a adds it).
- **`evals/` is not carried into projections**; `scripts/`,
  `references/`, `assets/` are. Design-sync is a first-class carriage
  surface for studio-shipped skills.
- **Graph keys never ride into projections**; the spec's `metadata:`
  field is the reserved future carrier. The pilot annotates ONE skill
  (concern/domain only) as the exemplar; WS2 owns the estate-wide
  pass and any wider vocabulary.
- **Eval home is `evals/`** (spec-aligned); the parallax
  `evaluations/` convention folds forward rather than coexisting.
- **Eval runner**: iteration 1 is manually orchestrated per the spec's
  workflow (subagent runs, script graders where graders exist, blind
  judge for holistic); a general runner is WS8-general work with this
  pilot as evidence. `skill-creator` adoption is a recorded follow-on
  pointer (pass-through-where-value-provided-elsewhere).
- **Slice 2 subsumes PR-B**: the queued design-lane re-truing grows
  into "bring the flagship fully to standard"; design-system-expert
  review plus the design pen's pass gate it.
- **Executor**: lane is executor-agnostic; the Director routes at
  slice boundaries (an owner-named executor binds if named).

## Slices (each a small PR; round budgets bind at authoring)

Half-dependencies, explicit: S2's frontmatter half needs S1b; S2's
`references/` half needs S1a's design-sync leg (the `.claude`/`.agents`
adapters point at the in-repo canonical, so repo agents resolve
`references/` regardless); S3 needs S2; S4 needs the standard proven
(S1–S3) plus its owner content gate.

1. **S1a — carriage machinery** (`agent-tools` + design-sync,
   test-first). The generator carries `scripts/`/`references/`/
   `assets/` into `.claude` and `.agents` as byte-stable copies; the
   checker drift-checks every carried file and detects+prunes orphans;
   design-sync's directWrite for studio-shipped skills gains the same
   carriage (estate.json globs + a sync run). Acceptance: unit suites
   cover carriage (present/absent/nested), drift on a mutated carried
   file, orphan pruning; **the live parallax corpus (~109 files) is
   the acceptance fixture** — checker green over it, no silent
   subsets; `skills:check` + portability + full gates green. Also
   rides: the discovery API docstring true-up (two-tier wording).
2. **S1b — pilot-scoped schema** (may fold into S1a's PR if trivially
   small). `concern`/`domain` keys schema-checked with tree-position
   agreement for skills that declare them. A real spec-conformance
   check for projections is wired as part of acceptance (the
   agentskills.io reference validator has NO repo home today — land a
   working wrapper or an equivalent in-repo check; naming a
   non-runnable tool is not acceptance).
3. **S2 — design-system-usage to standard** (docs + frontmatter).
   Re-true the body against BOTH homes and the DDRs (each What's-where
   row correct for both homes or path-qualified; declared
   repo/studio differences updated from one to the measured set;
   "five selectable, four token-bearing" wording; DDR citations as
   the decision authority); add `concern`/`domain` frontmatter;
   re-home deep reference substance to `references/` keeping the
   entry lean; regenerate all projection surfaces including the
   studio sync. Review gate: design-system-expert (opus) + the design
   pen's pass. Acceptance: two-home row correctness, DDR
   consistency, schema green, projections conformant on the S1b
   check, studio copy verified to carry the re-homed substance.

   **Amendment 2026-08-12 — S2's studio clauses are DISCHARGED-VOID.**
   Owner ruling, same day: "there is no studio sync, the design system
   lives in this repo and this repo only" (the studio project is gone —
   404s). Every studio-facing obligation above falls with it: the sync
   leg, the studio copy verification, and two-home row correctness,
   which no longer has a second home to be correct for. S2 landed the
   repo-only truing instead, and the skill's two-home framing was
   removed as false rather than left to rot. The `studio-source/`
   directory name survives the ruling — it is a quality-gate boundary
   inside this repo (owner ruling 2026-07-19), not a pointer at an
   external home.
4. **S3 — evals: first execution of the estate's convention.** Three
   cases: (a) compose a branded lesson-content page (script
   assertions: authored-CSS validator clean, referenced `.oak-*`
   classes exist in the trunk, semantic tokens never raw hexes;
   holistic: the W0.7 instrument judges the rendered page —
   verdicts stay in the eval workspace, never the wow register);
   (b) theme correctness — five selections offered, the four
   `data-theme` values carry token trees, `system` resolves without
   round-tripping into state (per DDR-003/004; an implementation
   minting a `data-theme="system"` tree FAILS); (c) edge — a prompt
   tempting ad-hoc CSS (assertion: zero ad-hoc rules; the skill
   routes to DS classes). With-skill vs without-skill in clean
   subagent contexts; workspace under the session scratch directory;
   `benchmark.json` + graded evidence banked into the repo evidence
   home for the PR, scrubbed (the machine-local-paths and encoding
   gates bind as they did for the 2026-08-10 Stryker evidence).
   Acceptance: an honest benchmark delta (whatever it shows);
   assertions reviewed against the spec's too-easy/too-hard/
   unverifiable tests; findings routed (skill cures in-slice;
   machinery gaps to WS8-general).

   **Amendment 2026-08-12 — S3's finding routing is fold-aware.** The
   clause "skill cures in-slice" was authored before the owner's
   2026-08-12 ruling that eval iteration 2 folds into the WS9
   stratified-quartet design: skill-content findings recorded at
   iteration 1 (benchmark F1, the case-3 adverse verdict) route to
   that fold rather than curing in this node's slices; machinery gaps
   route to WS8-general as written, with the #869 review round's
   grader-robustness residuals accreted at MCP-589 as WS9 harness
   input. The banked benchmark's route fields are the honest record.
5. **S4 — ui-visual-design minted born-to-standard.** New skill in
   `domain-craft/ui-design/`: UX-craft judgment (visual hierarchy,
   layout, interaction design) — content authored by the design pen,
   OWNER GATE on the doctrine before activation; standard applied
   from birth; rendered-output evals graded via the W0.7 instrument
   (same register exclusion), non-render outputs by assertion +
   blind transcript judge. Acceptance: all five standard clauses
   hold on day one; eval iteration 1 run.

   **Amendment 2026-08-12 — S4's content gate is DISCHARGED.** Owner
   word at the Director seat (decision card raised at S4 minting,
   answered 2026-08-12: "Ratify v1"); the ui-visual-design v1 doctrine
   is ratified and the skill activates; adverse iteration-1 verdicts
   route per their recorded dispositions.

   **Execution stamp 2026-08-12 — S2/S3/S4 delivered to main.** S2
   merged at `3981a53a5` (#868); S3 at `55815e8d1` (#869, v1.166.0);
   S4 at `7b2977dc2` (#870, owner-merged with his own APPROVED at the
   merge). Review convergence held the standard: every round read in
   full (body, suppressed section, inline comments, tallied
   separately); the #869 and #870 suppressed batches opus-verified
   finding-by-finding and cured in one batch per PR; the corrected
   two-sided benchmark (class invention 81%→0%, an elimination) stands
   as the honest record. WS9 harvest banked (run transcripts where
   preserved, frictions, blind verdicts, MCP-589 grader residuals);
   iteration-2 material rides the owner's WS9 fold ruling; the
   pilot-s234 worktree swept at the merges.

## Loop exit criteria

The S3/S4 eval loops cap at **three iterations** each within this
node; continuing past three is a new owner word. A loop also exits
early on the spec's own conditions: human feedback consistently
empty, or no meaningful delta between iterations.

## Follow-ons (pointers, not specs)

- WS8-general: the eval runner as estate machinery; `skill-creator`
  adoption assessment; the `evals/`-vs-`evaluations/` directory
  reconciliation across the parallax corpus; standard applied at
  every WS7 group move.
- WS1/WS2: the kind/stratum/intent vocabulary adjudication and the
  estate-wide annotation pass (re-judges the pilot's exemplar keys).
- WS9 candidate (parent §Amendment 2026-08-10c): the skill-craft
  skills (skill-design, skill-writing, eval-design, eval-running,
  cross-platform eval-testing with mcpjam assists) and the eval-runner
  tooling — authored FROM this pilot's S3 transcripts and frictions;
  S3's acceptance therefore includes preserving its run transcripts
  and a frictions list as harvest material.
