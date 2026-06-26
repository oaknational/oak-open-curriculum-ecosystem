---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

# Napkin

Current-session observations. Append below. Rotate when over ~400 lines (`consolidate-docs`
step 6): extract every behaviour-changing entry, merge into `distilled.md` or graduate to a
permanent home, verify the home, then archive and start fresh.

## Napkin rotated (2026-06-25 dedicated consolidation, Zephyr mends Bluff)

Rotated at a goal-gated dedicated-consolidation session. The processed window (the 2026-06-23 →
2026-06-25 entries) is preserved verbatim in
`archive/napkin-2026-06-25-zephyr-consolidation.md` (tracked). Every behaviour-changing entry was
dispositioned first-hand before the archive-move; the read-before-route check found the substrate
already mature — most entries were worked instances of patterns/rules/memory live in their homes.
The few genuinely-new facets landed as pattern extensions; the worktree-pilot team-coordination
learnings are conserved in that plan's §Consolidation as named PDR candidates. The commits and the
homes are the record of where each piece went.

New session observations append below.

## 2026-06-25 — Re-derive a surface's nature before curating it (Zephyr mends Bluff)

- **Re-derive a surface's NATURE before curating it; classify on each axis and don't
  over-collapse a multi-position axis into two.** This pass mis-treated repo-continuity twice:
  as a buffer to *drain* (it is a continuity surface — `continuity-practice.md §Disposition`:
  live content stays verbatim, only finished-work residue is curated), then it over-collapsed
  "not memory" into "untracked" and proposed migrating it to git-ignored state. The owner's
  correction: the tracking axis has **three** positions — **memory** (portable knowledge,
  tracked), **repo state** (repo-specific but *checkout-portable*, tracked: thread records and
  repo-continuity apply on any clone), **local state** (per-checkout, git-ignored: claims,
  comms) — and **only local state is git-ignored**. Continuity surfaces are **repo state**,
  correctly tracked all along. Both errors are
  [[inherited-framing-without-first-principles-check]] plus premature crystallisation (a
  two-way cut where there were three). Cure: read a surface's `overflow_disposition`/role and
  classify it on each axis — memory / repo-state / local-state, buffer / continuity, doctrine /
  question — before curating; never collapse an axis to two positions. The owner corrected the
  substrate taxonomy across several turns this session.
- **read-before-route's falsifier is the highest-value consolidation check.** Most napkin
  "new lessons" this rotation were worked instances of already-homed patterns
  (pr-monitor-to-merge, prove-the-checker, wrapped-exit-codes, never-disable-checks). Checking
  the homes (the patterns dir) first prevented bloating distilled with duplicates. A mature
  substrate's pass is mostly confirm-duplicate plus a few small extensions, not new homing.
- **Registers drift without belongs/does-not-belong examples AND a homing table that names
  them.** pending-graduations / open-questions had accumulated future-work, proposals, and
  operational questions because `ephemeral-to-permanent-homing.md`'s destinations table never
  named the registers. Structural cure: name every surface in the table + sharp
  belongs/does-not-belong examples in each register header.
- **A bot finding can catch you contradicting your own freshly-authored intent.** cursor[bot]
  caught Q-011 removed from open-questions while the just-refreshed doctrine said such
  strategic forks belong there (and the plan that now held it archives). Assessed first-hand,
  agreed, restored. A worked instance of [[feedback_validate_specialist_findings_before_acting]]
  in the *agree* direction.

## 2026-06-26 — Read the full merge-gate memory + trust CLEAN before reaching for --admin (Wombat wakes Eventide)

- **Mistake: under-read a `MERGEABLE/CLEAN` mergeState and asked an unnecessary `--admin`
  question.** On PR #227 (owner-authored, sole code owner = author) I reasoned "self-approval is
  blocked → code-owner gate unmeetable → need OrganizationAdmin bypass" and surfaced it as an owner
  decision. But `project_main_merge_gate_codeowner` already records (verified 2026-06-24) that
  owner-authored PRs **auto-satisfy** the code-owner requirement and merge **CLEAN with a plain
  `gh pr merge`, no `--admin`**. The `CLEAN` I observed *was* the answer; `BLOCKED` would have meant
  blocked. I acted on the MEMORY.md index *summary* ("--admin forbidden; clean agent merge
  prohibited") without opening the full memory, whose nuance contradicted my framing. The merge
  still landed correctly (--admin was redundant, not harmful), but I cost the owner an unnecessary
  decision. **Cure:** before any merge-gate decision, open the full merge-gate memory (not the index
  line) and read the live `mergeStateStatus` — `CLEAN` ≠ blocked. Siblings: [[verify-dont-trust]],
  [[feedback_check_pushed_state_via_upstream_ref]], the metacognition "fluency is a warning" note
  (a smooth "of course self-approval is blocked" frame bypassed the situational check).

## 2026-06-26 — A CI/merge control must be verified against THIS repo's integration wiring before adoption (Wombat wakes Eventide)

- **Pattern candidate: a generically-good gate can be incompatible with the repo's specific
  integration architecture; verify event-support against your actual wiring, and prefer the
  simplest control that meets the goal.** The owner enabled a GitHub **merge queue** (a sound
  Tier-2 control from the assessment) to stop merge-skew. But a merge queue requires every required
  gate to report on the `merge_group` ref, and this repo's three gates each fail that as wired:
  CodeQL is **default setup** (can't run on `merge_group` — codeql-action#1537, open 3+ yrs, verified
  first-hand), SonarCloud is the **app automatic-analysis** (no `merge_group` status; the CI-scanner
  fix would violate ADR-161's network-free-CI boundary), and Vercel is the **Git integration**
  (doesn't deploy `merge_group` refs, so `required_deployments` can't satisfy in-queue). The cure was
  not to force the queue (advanced-CodeQL + ADR-161-violating Sonar + custom Vercel = heavy +
  self-contradicting) but to choose **require-branches-up-to-date** — same merged-state protection,
  compatible with all current integrations, ADR-161-clean, no new infra, no bypass (ADR-204). Lesson:
  before adopting a CI/merge control, ask "does this work with our *specific* integration setup
  (default-vs-advanced, app-vs-CI-scanner, Git-integration-vs-custom)?" — not "is this control good
  in general?" Empirical proof (a real PR through the gate) settles it. Sibling:
  [[feedback_check_doctrine_preconditions_before_applying]], [[verify-dont-trust]]; candidate for a
  `patterns/` entry if a second instance appears.
