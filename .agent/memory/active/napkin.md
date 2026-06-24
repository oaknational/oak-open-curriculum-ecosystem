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

## Napkin rotated (2026-06-23 dedicated consolidation, Narwhal tracks Lagoon)

Rotated at a goal-gated drain-all-buffers session. The processed window (the 2026-06-22 Pelican /
Skipper entries and the 2026-06-23 Blazar / Foehn / Zenith / Magnolia / Perseus / Foundry / Galleon
entries) is preserved verbatim at
[`archive/napkin-2026-06-23-narwhal-consolidation.md`](archive/napkin-2026-06-23-narwhal-consolidation.md)
(tracked). Every behaviour-changing entry was dispositioned first-hand before the archive-move.

Where the substance went:

- **Graduated to permanent homes**: the decision-locus doctrine (product strategy is the owner's;
  engineering/architecture is collaborative; the over-claim↔over-suppress oscillation; the read-gate)
  → `user-collaboration.md` §Risk and Decisions. The F-84 gate-testing principle (prove a gate fails
  on a known-bad input before trusting its green; hardest for your own completion gates) → folded into
  `verify-dont-trust.md` with the F-84 worked instance — this principle had been *claimed* homed in
  distilled by the prior pass but was in fact absent (a real loss-scan catch this pass).
- **New cross-session lessons → `distilled.md`**: prefer a generated/grep gate over an enumerated
  list a specialist hands you (the list is a sample, the gate is the invariant — also the ripening
  near-second-instance for the staged falsifiable-judgment-gate candidate); a whole-tree gate failing
  on files you didn't touch while your own recent commits passed ≠ your bug (read claims+comms for a
  concurrent agent first); state the positive understanding the reader needs, not your own correction
  path (process-leaks-into-artefact); Bash/grep output of source can be substring-filtered, Read is not.
- **Surfaced to the owner as trigger-gated decisions** (owner said "I will decide"): the
  knowledge-surfaces-curated PDR candidate (N-3); the TPC curriculum-content-sourcing safety rule home
  (N-4, graduation to `safety-and-security.md` pending owner home-confirmation); the
  readiness-review-vs-rules-tier check (N-1); the assurance-regime PDR (N-2); open-questions Q-001/004/
  005/006/007/009; pending-graduations PG-1/PG-2. Full inventory in this session's owner-facing message.
- **Duplicates confirmed** (substance already homed; conserved verbatim in the archive): the
  shared-checkout commit-window entries (required-field ripple, bursty window, co-committed surface) →
  worked instances of F-83 / Q-005 / [[project_multi_developer_transition]]; the MCPJam host-header
  settle → distilled "trace EVERY layer" + ADR-122/158; the scanner-finding-disposition / CodeQL-rekey
  entries → distilled scanner-disposition + `sonar-disposition-policy.md`; the knowledge-as-graph
  research → its report + ADR-200 + per-user memory; the verify-to-stakes-AND-obey-directive
  oscillation → [[feedback_calibrate_verification_to_stakes]].
- **Owner-facing flags carried forward** (not trigger-gated decisions): Dependabot reports 15
  vulnerabilities on the default branch (4 high / 8 moderate / 3 low) — needs owner triage; 7c
  thread-register shows `agentic-mechanisms-discovery` stale (>14d) and two COMPLETE-pending-push
  threads (`orientation-skills-family`, `reasoning-grammar`) to retire once pushed.

New session observations append below.

## 2026-06-23 — open-PR triage + #128 disposition (Magnetar calls Gloom, 9e276e; n=2 with Narwhal)

**Surprise — stale-artefact supersession blind spot (the session's main lesson).**

- Observation: my *first* #128 verdict ("merge-but-trim") was reached on the proposal's internal
  merits without checking what the repo decided AFTER the PR was written. #128 `last_reviewed`
  2026-05-29; ADR-200 (which supersedes its scope) ratified 2026-06-22. A sub-agent reviewer
  caught it; I'd have missed it solo.
- Diagnosis: doctrine-by-analogy — I treated a ~4-week-old open PR like a fresh proposal to
  evaluate, when its age made supersession the first-order question.
- Cure: for ANY artefact open weeks+, "what has been decided since this was written?" is the
  first-order question, before internal merits. Conserved to distilled + per-user memory.
- Pointer: `.agent/reports/pr-128-formal-substrate-analysis-2026-06-23.md`; ADR-200.

**Reconciliation — the "15 Dependabot vulns" flag does NOT verify.**

- The committed napkin (Narwhal's 854553511 consolidation) carries "Dependabot reports 15
  vulnerabilities on default branch (4H/8M/3L)" as an owner-facing flag. First-hand check
  2026-06-23 ~19:15Z: `gh api repos/.../dependabot/alerts --paginate` returns **0 open** (130
  total, all state `fixed`). Reconciled with Narwhal: the "15" is the LOCAL `pnpm audit`
  surface (Narwhal's separate owner directive: `pnpm -r outdated` + `pnpm audit` → workspace
  overrides), NOT GitHub Dependabot alerts. Different surfaces, both valid — not a
  discrepancy. Worked instance of [[feedback_peer_status_claims_are_input_to_verify]]: I
  relayed the count as a default-branch GitHub figure before checking; the lesson holds (name
  the surface a relayed metric came from), even though both numbers turned out correct for
  their own surface.

**Finding — `main` CI is red, but NOT from this session's merges.**

- `run-quality-gates` fails on the schema-drift check: cached OpenAPI spec `0.7.0-f7c18ea…` vs
  live `0.7.0-804d3af…`. Upstream spec moved; the post-merge push surfaced it. My 5 merges
  (#215/#216/#149/#171 + owner's #214) don't touch the schema cache. Remediation: `pnpm
  sdk-codegen` with `OAK_API_KEY` (maintainer action). Surfaced to owner; not bundled over.

**Behaviour note — forward-pointer before landing.** My #128 close comment (public on GitHub)
says the analysis is "conserved at `.agent/reports/…`" while the file is still uncommitted/
unpushed. The "commits pushed"-before-push pattern. Lesson: don't publish a pointer to an
artefact that isn't durably landed.

## 2026-06-23/24 — trigger-gated decision enactment + closeout (Narwhal tracks Lagoon)

Surfaced the trigger-gated decisions as structured questions; the owner decided all and I enacted
them (PDR-114/115/116, ADR-203, the TPC safety rule + governance section, the plan-body rules-tier
clause, register drains). Unique learnings (Magnetar already captured the schema-drift and the
vuln reconciliation above):

- **A peer's gate run can wipe shared `dist` from under you on a shared checkout.** Mid-session,
  agent-tools `dist` vanished (Magnetar's singleton `pnpm check`), breaking the comms CLI and
  killing my all-channels watcher (drain-step timeout, fail-loud). Build output is shared mutable
  state on a shared checkout. Cure: `pnpm --filter @oaknational/agent-tools build` to recover the
  CLI; the watcher needs a manual restart. F-83 family ([[project_multi_developer_transition]]).
- **Self-critique: PDR-116 may be over-generalised.** The owner directed synthesising it now from
  two instances I had myself argued were *different shapes* (effectiveness-arm decomposition vs
  completeness-enumeration). The general form ("anchor a judgment to its source, not to taste") is
  broad enough to cover both, but that breadth risks a vague principle rather than a sharp pattern —
  ironically the exact failure PDR-116 polices. A future third instance tests sharp-vs-vague;
  flagged, not hidden.
- **Doctrine authored-then-reviewed is the no-backfill failure in miniature.** I committed 5
  doctrine artefacts before any specialist review, then ran docs-adr-expert at closeout. Significant
  ADR/PDR/rule changes warrant the doc reviewer at *authoring* time, not after committing. Carry
  forward: invoke the doc reviewer in the same breath as authoring doctrine.

## Session 2026-06-24 (Aspen tracks Root) — main Sonar AI-profile-to-zero planning

- **Surprise (correction): a deliberately-adopted analyser profile's findings are a
  worklist, not noise.** I framed main's 398-issue Sonar backlog as an
  activation-wave to "wait out" (push + re-analyse — borrowing the zombie-findings
  lesson from the retired remediation thread). Owner corrected: the Sonar AI quality
  profile was activated **on purpose**; target is **zero**; every finding is
  fix-or-genuine-FP, never noise. The "static-analyser-against-a-moving-target →
  push+reanalyse" lesson applies to STALE/zombie analysis, NOT a fresh deliberate
  profile. Behaviour change: never frame deliberately-adopted-profile findings as
  noise; triage all to zero. Distilled-worthy. Sibling: the distilled
  scanner-disposition entry, [[feedback_existence_is_not_correctness_default_replace]].
- **A subagent's "X cannot be done" disposition conclusion is the convenient claim to
  verify first-hand.** An Explore agent concluded the generated `paths`/`operations`
  interfaces (S101) "cannot be renamed." I verified first-hand (`codegen-core.ts:201` —
  `openapiTS(new URL(...))` called with no options) before recording the FALSE_POSITIVE.
  The conclusion held — but the *act* of verifying, not the agreement, made it usable.
  Sibling: [[feedback_validate_specialist_findings_before_acting]], distilled
  "a subagent agreeing with your prior is not verification."
- **A subagent's autofix-coverage estimate is a hypothesis, not a fact** (different
  engines). "~159 of ~250 autofixable via `lint:fix`" assumes `eslint-plugin-unicorn`
  fires at the exact Sonar-flagged sites; unicorn ≠ Sonar. The plan records it as a
  hypothesis to prove by a dry-run at execution, never an inherited number.
- **Consolidate at the third WORKSPACE, not the third call-site.** For a shared
  utility (path-containment validator) needed at 3 sites across 2 workspaces that
  cannot import each other, the `consolidate-at-third-consumer` trigger fires at the
  3rd *workspace*, not the 3rd call. Resisted a subagent's "create a new shared package
  now" (heaviest option) for 2-workspace/3-site scope; verdict = local helpers, extract
  on the 3rd workspace. Candidate refinement of [[consolidate-at-third-consumer]].
- **A scanner rule-class splits by disposition-route, not uniformly.** The regex
  backlog (S8786 etc.) splits five ways — generated-output (fix at generator),
  generator-source (fix in place + regen), hand-written (consolidate to regex home),
  vendored/standard (refactor-to-import or FP), runtime-only `.mjs` (fix in place). An
  owner's "pull all regexes into one file" applies cleanly only to the hand-written
  class; the fluency-check caught me before rubber-stamping it whole.
- **Foreign dirty files appeared mid-session** (`oak-sdk-codegen` generated +
  schema-cache, 4 files) between turn 1 (clean) and a later turn — parallel process /
  multi-dev on the shared checkout. Did not stage; flagged; commit by explicit pathspec.
  Worked instance of F-83 / [[project_multi_developer_transition]].
- **The MEMORY.md load-cap is a system-shape problem, not a deletion target.** Draining repo-homed
  redundancy + tightening hooks moved it 30.3→28.8KB, still over the 24.4KB load-cap. Reaching under
  needs deleting ~30 genuine calibrations — the conservation→numbers inversion. A flat truncated
  index does not scale to 160+ legitimate entries; the LTAE fix is relevance-based recall. Homed as
  open-question Q-010 so it does not evaporate (the flagging-in-closeout-is-not-recording lesson
  applied to my own closeout).

## 2026-06-24 — CORRECTION to the "main red = schema-drift" finding above (Magnetar calls Gloom)

**Correction (supersedes the lines 85–90 finding):** `main`'s CI red is **format-check**, NOT
schema-drift, and it **WAS caused by my #149 merge.** First-hand: the failed *step* on the main
run (28050337654) is `Check formatting`; `ci-schema-drift-check` is an `if: always()` **advisory**
step that warns but does not fail the run. My #149 squash landed a 118-char destructure in
`apps/oak-search-cli/src/lib/indexing/index-bulk-helpers.ts` (absent at fc02f28a2) that prettier
wraps → reds `format-check` on main and every downstream PR (surfaced via #141). No `OAK_API_KEY`
/ `sdk-codegen` action is needed; that earlier remediation claim was wrong. Fix: PR #218 (prettier
`--write` of that one file, authored via the GitHub API to avoid disturbing the shared checkout).

- **Lesson:** `gh run view --log-failed | tail` can show a LATER `if: always()` step's output
  (here the advisory drift warning), not the actual failing step. Read the failed **step name**
  (per-step `conclusion`), never the log tail, to attribute a CI failure. This is the diagnostic
  that flipped a wrong root-cause (upstream drift, not mine) to the right one (format, mine).
- Also noted (Narwhal's entry above): my singleton `pnpm check` wiped shared `dist` and killed
  their watcher — full-gate runs mutate shared build state on a shared checkout; coordinate before
  running them when a peer is live.
