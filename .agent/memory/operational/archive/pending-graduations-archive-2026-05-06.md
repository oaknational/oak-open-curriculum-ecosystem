# Pending-Graduations Archive — 2026-05-06

Archive of `graduated` and `withdrawn` entries removed from
[`pending-graduations.md`](../pending-graduations.md) during the
2026-05-06 napkin + pending-graduations processing pass executed by
Clouded Lifting Aerie (claude-code, opus-4-7-1m, `1e2244`) per the
[opener][opener].

[opener]: ../../../plans/agentic-engineering-enhancements/current/2026-05-06-napkin-and-pending-graduations-processing-opener.md

Each entry is preserved in full at the form it carried at archive
time. Destination cross-references named in each entry's `Status`
line have been verified to resolve at the time of this archive.

## Entries archived

### 1. Archive-scale historical napkin synthesis (graduated 2026-05-05)

+ 2026-05-05; **archive-scale historical napkin synthesis is a distinct
  learning-loop cadence, not just current-rotation cross-session
  consolidation** (Owner-stated aside during Riverine Navigating Sextant's
  start-right / metacognition pass). Current doctrine already requires
  cross-session reading across recent sessions and the current rotation
  window, but the owner named the missing historical move: reread current and
  archived napkins holistically after prior per-napkin processing has already
  happened, asking what the archive now knows as a corpus that no individual
  pass could have known at the time. Benefits: long-wave failure modes become
  visible; learning-loop throughput problems become inspectable; PDR
  candidates can cite historical arcs rather than only recent recurrence; and
  archived napkins remain an evidence corpus rather than cold storage. Source
  surface: owner message 2026-05-05. Graduation-target: amendment to
  PDR-014 (distinguish recent-thread cross-session consolidation from
  archive-scale historical synthesis) plus `consolidate-docs` command
  refinement (trigger, bounded corpus selection, synthesis report / processed
  window marker, and routing outputs). Trigger: owner direction to implement
  the plan now. Status: `graduated 2026-05-05` — PDR-014 amendment plus
  `consolidate-docs` command refinement landed in the same documentation
  bundle.

### 2. Commit-skill orchestrator vs git-hook-chain conflation (graduated 2026-05-05)

+ 2026-05-05; **commit-skill orchestrator vs git-hook-chain are
  separate enforcers; agents conflate them under failure pressure**
  (Ethereal Transiting Comet, this date — diagnostic instance during
  graduation pass commit attempt). The commit-skill orchestrator
  (`scripts/check-commit-skill-gates.ts`) is a script the agent runs
  voluntarily before `git commit`; it includes
  `practice:fitness:strict-hard`. The git-hook-chain (`.husky/pre-commit`)
  is what `git commit` actually fires; it runs format, markdownlint,
  knip, depcruise, type-check, lint, test — but NOT
  `practice:fitness:strict-hard`. When the orchestrator fails, the
  failure-mode framing reaches for `--no-verify` as escape valve
  even though the actual blocking surface (the hook chain) may not
  be running the failing gate. Cure: inspect which enforcer is
  blocking BEFORE reaching for bypass. Substance distinct from
  Lacustrine's §Surprise 1 (orchestrator's lack of staged-set
  awareness; same orchestrator, different lacuna). Source surface:
  napkin §Surprise 2 (this date), experience file
  `2026-05-05-ethereal-the-pattern-fired-on-its-own-commit.md`.
  Graduation-target: pattern entry at
  `.agent/memory/active/patterns/identify-which-enforcer-before-bypass.md`
  (process or agent tier — TBD at second instance) OR amendment to
  `.agent/skills/commit/SKILL.md` naming the orchestrator-vs-hook
  distinction explicitly so agents do not conflate them. Trigger:
  second instance of agent-confused-orchestrator-with-hook-chain in
  any commit/release/closure surface. Status: `due` (status flipped
  2026-05-05) — second instance observed: Dawnlit Transiting Galaxy
  (`0ddc89`) on observability-sentry-otel thread reached for
  `--no-verify` after orchestrator-pre-screen failure on pre-existing
  peer fitness violations, despite `.husky/pre-commit` not including
  the failing fitness gate. Owner caught the framing ("Why do you
  need --no-verify?"); the conflation surfaced when articulated. CR1
  commit subsequently landed with standard `git commit` (no
  --no-verify) through the live hook chain cleanly. Same shape as
  Ethereal's first instance: the orchestrator's name and shared
  configurations let agents round it off to the live hook under
  failure pressure. Cure now sharpest as a permanent-doc clarification
  in `commit/SKILL.md` distinguishing the pre-screen orchestrator
  (advisory; agent-invoked; includes fitness/vocabulary gates) from
  the live hook (blocking; git-invoked; format/markdown/knip/depcruise/type/lint/test).
  Owner direction at promotion supersedes; substance-trigger
  fired (sharp + instance-count = 2). **Status: graduated 2026-05-05**
  (Opalescent Threading Nebula). Third instance observed live during
  Opalescent's Layer 0 → 1 napkin rotation commit attempt — same
  rounding-off chain, different surface manifestation (constructed a
  doctrinal collision between SKILL §Pre-Commit Validation and
  PDR-046 §Move 2 instead of proposing `--no-verify`). Owner
  correction: *"all quality gates are blocking always, the
  orchestrator is not a quality gate, it surfaces very important but
  advisory signals, there is no conflict here"*. Graduation
  destinations: (a) `.agent/skills/commit/SKILL.md § Quality Gates
  Are Always Blocking; the Orchestrator Is Advisory` — new section
  distinguishing the two authorities with the 3-instance evidence
  trail and the diagnostic discipline; (b)
  `.agent/memory/active/patterns/eager-rounding-off-on-partial-structures.md`
  — new host pattern naming the deeper disposition under failure
  pressure (rounding-off-partial-structures-into-whole-structures,
  with three worked instances). Both landed in same atomic commit.
  Practice-Core promotion (PDR with `pdr_kind: pattern`, since the
  former Core patterns directory was retired 2026-04-29) deferred
  until second-context manifestation outside commit flow (release
  pipeline, deploy pipeline, schema migration gate, etc.) — current
  evidence is single-context.

### 3. Host-local consolidate-docs cross-reference to PDR-046 (graduated 2026-05-05)

+ 2026-05-04; **host-local consolidate-docs extension to point at
  PDR-046 as the orchestration rule** (Ferny Spreading Petal,
  Layer-2 second pass): the host's per-write rule
  (`.agent/commands/consolidate-docs.md § Learning Preservation
  Overrides Fitness Pressure`) is unchanged by PDR-046's
  graduation, but should now carry an explicit cross-reference up
  to PDR-046 as the layer-orchestration discipline the per-write
  rule composes with. Adopter agents reading the per-write rule
  should encounter the orchestration rule at the same surface.
  Source surface: napkin entry under archive
  `napkin-2026-05-04-evening.md` (Ferny § Open follow-up
  (sequenced)). Graduation-target: amendment to
  `.agent/commands/consolidate-docs.md § Learning Preservation
  Overrides Fitness Pressure` adding the upward pointer.
  Host-local; does not propagate to other Practice adopters
  (each host carries its own per-write rule surface). Trigger-
  condition: PDR-046 lands. Status: graduated 2026-05-05 (Ethereal
  Transiting Comet — the section now opens with a paragraph naming
  PDR-046 as the layer-orchestration rule and closes with a
  PDR-046 §Move 3 reference describing graduation-upward as the
  default response to residual fitness pressure at rest; landed in
  same atomic commit as the structural-enforcer recursive-exclusion
  pattern entry).

### 4. Structural-enforcer recursive-exclusion pattern (graduated 2026-05-05)

+ 2026-05-04; **structural enforcers must exclude the documents
  that catalogue their own pathogens (recursive-exclusion
  pattern)** (Vining Spreading Seed, captured during WS3 trip-list
  authoring; second instance Ferny Spreading Petal during PDR-047
  authoring). Adding the hedging-vocabulary trip-list to
  `policy.json` `preToolUseContent.scoped_blocks` required
  excluding `principles.md`, `distilled.md`, PDR-043, and PDR-044
  — the documents that *catalogue* the trip-list — so they could
  reference its members without self-tripping. The same shape
  recurred verbatim during PDR-047 (rule-applies-always
  doctrine-authoring) drafting: the file's first write attempt
  was correctly blocked by the hedging-vocabulary hook (the file
  catalogues that exact vocabulary by definition); the cure was
  identical — extend the `exclude_paths` list to include PDR-047.
  Two independent first-instances, same shape, same cure, two
  consecutive sessions. Source surfaces: napkin
  "trip-list-defines-itself paradox" entry (Vining, archived);
  PDR-047 Notes section + experience file
  `2026-05-04-ferny-the-gate-was-the-curation-prompt.md` (Ferny).
  Graduation-target: pattern file at
  `.agent/memory/active/patterns/structural-enforcer-recursive-
  exclusion.md` (Process category). Trigger-condition: second
  instance observed (Ferny's PDR-047 fire). Status: graduated
  2026-05-05 (Ethereal Transiting Comet — pattern landed at
  `.agent/memory/active/patterns/structural-enforcer-recursive-exclusion.md`
  with PDR-044 as `related_pdr`, **agent-tier** category (paired
  with `governance-claim-needs-a-scanner` after assumptions-reviewer
  challenge to the initial process-tier framing), two worked
  instances captured in detail with substance-distinctness
  argument for the ≥2-instance bar, three concrete mechanism
  shapes named (explicit `exclude_paths`; per-line context
  exclusion; self-exclusion by placement), structural composition
  with PDR-047 §Test 3 named explicitly to distinguish
  exclusion-list-as-mechanism from hedge-as-substance,
  generalisation table covering ESLint / CI scanners / markdown
  linters / trip-list documentation; patterns/README.md index
  updated to Agent (8); `.agent/rules/no-hedging-vocabulary.md`
  §Excluded Surfaces extended with forward link to the pattern;
  PDR-047 §Notes intentionally NOT back-amended — Practice-Core
  portability rule prevents Core → host-pattern references; landed
  in same atomic commit as the consolidate-docs §Learning-Preservation
  upward-pointer extension).

### 5. Layered processing of knowledge → PDR-046 (graduated 2026-05-04)

+ 2026-05-04; **layered processing of knowledge: preserve first,
  restructure second** (Fronded Flowering Thicket, owner-stated
  mid-pass): *pick a layer, fully process it without worry about
  the fitness functions in the targets, then move up a layer and
  process the next layer without worry about the fitness in the
  targets, and so on, until all knowledge is preserved first and
  the fitness constraints are met second.* Generalises the existing
  per-write rule at `consolidate-docs.md § Learning Preservation
  Overrides Fitness Pressure` into a layer-orchestration discipline:
  fitness has no jurisdiction during processing of any layer; it
  becomes a measurement of the resting system after all processing
  completes, not a constraint on in-process work. The rule
  self-applied during this session's pass — Layer 1 (napkin →
  distilled), then Layer 2 (distilled → permanent doctrine, with
  PDR-045 as the first deliverable). Source surface: napkin §
  "Layered processing: knowledge preservation first, fitness
  second". Graduation-target options: (a) new PDR (highest-leverage
  candidate; would self-apply); (b) amendment to PDR-026 §Deferral-
  honesty discipline; (c) amendment to PDR-038 (doctrine-without-
  enforcement-at-maturity is closely related); (d) `consolidate-
  docs.md § Learning Preservation Overrides Fitness Pressure`
  extension (host-local). My read: distinct-enough-to-warrant-new-
  PDR, with the consolidate-docs amendment as the host-side
  operational hook. Trigger-condition: owner direction (this is
  the highest-leverage Layer-2 candidate from the 2026-05-04 pass;
  fresh session is set up to draft this PDR first per the
  agentic-engineering-enhancements thread record). Status:
  `graduated 2026-05-04 to PDR-046 layered-knowledge-processing`
  (Ferny Spreading Petal, Layer-2 second pass). Three moves
  authored: bottom-up traversal (Move 1); in-process form-keeping
  suspended on the active layer (Move 2); residual fitness pressure
  addressed by graduating substance upward, not by compression
  (Move 3). Host-side per-write rule unchanged; consolidate-docs.md
  extension to the per-write section is a separate host-local
  follow-up.

### 6. Workspace-first investigation discipline → PDR-045 (graduated 2026-05-04)

+ 2026-04-26; workspace-first failure cluster; rule or
  recurrence-prevention amendment for workspace inventory before external
  tooling/new infra; trigger: second cross-session instance or owner
  direction; status: **graduated 2026-05-04** to
  [PDR-045 Workspace-First Investigation Discipline](../../../practice-core/decision-records/PDR-045-workspace-first-investigation-discipline.md)
  (Fronded Flowering Thicket). Three structurally-similar failure modes
  consolidated into three moves (artefact search before remote retry;
  shared-package survey before parallel infrastructure; live-state check
  before brief enumeration). Composes with PDR-033 (vendor-platform
  variant of Move 2). Three host-rules updated to cite PDR-045:
  `validate-full-target-estate` Move 1, `read-diagnostic-artefacts-in-full`
  Move 1, `consolidate-at-third-consumer` Move 2.

### 7. Bootstrap fast-path candidate (withdrawn 2026-05-01)

+ 2026-05-01; ~~bootstrap fast-path should not pay full coordination
  cost~~ **WITHDRAWN 2026-05-01 by Deep Navigating Stern** under
  owner direction *"we never take the fast path we ONLY take the
  path that maximises long-term architectural excellence."* The
  candidate framed real evidence (six compound CLI frictions in one
  commit-skill run) under a *conditional-discipline* shape (skip
  queue when registry empty), which introduces microstate
  proliferation: every future agent must evaluate whether their
  situation is "fast-path", the condition's accuracy degrades
  silently as the system evolves, and the audit-trail surface that
  is most needed when coordination fails is the one being skipped.
  The genuine substance — *the queue ergonomics are bad and that
  produces route-around behaviour* — survives intact and routes to
  the CLI ergonomics plan
  ([`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../../plans/agent-tooling/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md))
  as *fix the surfaces*, not *make the discipline contingent*.
  Withdrawal is itself the doctrine: rush-impulse re-frames real
  concerns under conditional-discipline shapes; the corrective is
  to re-frame under long-term excellence. Captured in napkin
  2026-05-01 metacognition entry. Status: withdrawn 2026-05-01.

### 8. Commit-queue fingerprint recursion (graduated 2026-05-06)

Archived 2026-05-07 by Pelagic Rolling Harbour during the
[dedicated pending-graduations drain][drain-opener]. The entry
landed `graduated 2026-05-06` last session via F-15; archive is
the audit-trail close per the opener.

[drain-opener]: ../../../plans/agentic-engineering-enhancements/current/2026-05-07-pending-graduations-dedicated-drain-opener.md

+ 2026-05-05; **Commit-queue `record-staged` + `verify-staged`
  fingerprint protocol is non-trivially recursive when state files
  self-modify** (Lacustrine Navigating Rudder, second instance).
  Source-surface: napkin §Surprise 6 (this date); same observation
  recorded in earlier session summary as the "fingerprint mismatch
  incident" (first instance — see commit `2b78aa93`'s session arc).
  Graduation-target: CLI hint inside `agent-tools:commit-queue --
  record-staged` printing *"do not re-stage active-claims.json
  after this command — the fingerprint write is metadata-only and
  the index does not need it"*; OR doc note in
  [`.agent/skills/commit/SKILL.md`](../../../skills/commit/SKILL.md)
  step 7's record-staged paragraph; OR redesign the
  `staged_bundle_fingerprint` to exclude the fingerprint-field
  itself when computing (currently it includes the whole patch).
  Trigger-condition: second instance now confirms (the earlier
  Lacustrine session and this session both hit it). Promote to
  CLI / doc / impl change at next commit-queue tooling pass.
  Status: `graduated 2026-05-06` (Clouded Lifting Aerie) — third
  instance observed during Hidden Slipping Moth's `4be7b5` session
  (napkin Surprise 2). Doc-note option landed via friction register
  entry F-15 in
  [`.agent/plans/agent-tooling/frictions-register.md`](../../../plans/agent-tooling/frictions-register.md)
  documenting the workflow-that-works ("stage all files including
  active-claims.json with queue entry but no fingerprint, run
  record-staged once, do NOT re-stage active-claims.json
  afterwards") plus candidate cures (sibling-file fingerprint
  storage; CLI warning on `MM` after record-staged). The CLI-hint
  and impl-redesign options remain available for the next
  commit-queue tooling pass; F-15 stands as the working-discipline
  bridge until then.
