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
