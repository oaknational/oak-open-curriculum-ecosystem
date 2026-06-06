---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

user note to integrate: please remember to focus on useful work and tight communication, rather than on communication ceremony

## Session: 2026-06-05 — napkin rotation (Lanternlit Passing Mask curation pass)

Rotated the 2026-06-04 (Arboreal) → 2026-06-05 (Dim) window — ~13 session-sections
— during a dedicated knowledge-curation pass. The processed source is preserved
verbatim at
[`napkin-2026-06-05-lanternlit-curation.md`](archive/napkin-2026-06-05-lanternlit-curation.md);
the per-section disposition ledger is the
[ledger](../operational/curator-passes/2026-06-05-lanternlit-passing-mask-curation.md).

Dispositions: most sections were already homed by each session's own light handoff
(distilled / Claude auto-memory / experience files), verified this pass. Graduated
to `distilled.md`: the markdown wrapped-list-marker trap, the IDE-diagnostic-flood
scope clarification, the pointer-status-is-not-ground-truth meta-law, the
set-membership content-conservation sharpening (into the commit-window entry), and
the grounding-bar calibration guard (into the consolidated felt-authority cluster).
Owner-gated: the felt-authority unification (pending-graduations top entry —
recommended for graduation this pass). Surfaced as an owner finding: the
`.husky/pre-commit` hook drifted from ADR-121 (omits knip + depcruise, adds build).
Duplicates (already homed, skipped): clean-review, discrepancy-claims,
graduate-not-skip-grounding, pairing/monitors, the Dim/Silvered tooling gotchas
(build-system.md covers SDK-build-before-consume + lint≠format).

Fresh capture starts below.

## 2026-06-05 — the lesson I documented bit me three times the same session (Lanternlit)

- **The wrapped-list-marker trap (MD004/MD032) tripped me 3× in one session —
  while consolidating the very distilled entry that documents it.** A prose line
  using ` + ` or ` * ` enumerations wraps so a marker char lands at line-start;
  markdownlint reads it as a list item. A live instance of PDR-089 obs-3 (naming a
  lesson does not inoculate against it) and of passive-guidance-loses-to-artefact-gravity.
  The reliable cure was NOT the lesson — it was the **mechanical gate**: the
  pre-commit `markdownlint-staged` check caught all three before they landed.
  Behavioural takeaway: when writing ` + `/` * ` enumerations in prose, use commas;
  but rely on the gate, not vigilance.
- **Owner approved "mint a new PDR"; grounding routed it to a clause instead — a
  live instance of the doctrine being graduated.** The felt-authority family was
  going to become `pdr:felt-authority-grounding-discipline`, but PDR-089 §Decision 6
  already owned the substrate, so per `new-rule-vs-pdr-clause` it landed as PDR-089
  §Decision 7 (a new PDR would have *fragmented* the unification it was meant to
  achieve). The full-doctrine-estate non-duplication check fired correctly — and on
  a graduation the owner had explicitly greenlit, confirming "owner-directed
  graduation is still an independently-grounded act."
- **A quality-gate ADR can silently drift from its own hook.** `.husky/pre-commit`
  had dropped knip + depcruise (ADR-121-mandated) and added build; the drift was
  invisible until a curation grounding pass cross-checked the hook against the ADR.
  The matrix being *duplicated* in ADR-121 and build-system.md is the structural
  cause (two copies diverge). Fixed the hook + reconciled both docs; flagged the
  de-duplication as a follow-up.

## 2026-06-05 — a fail-closed gate with no working in-band recovery is fail-*bricked* (Skyward)

- **The PreToolUse guard shim failed closed when its dist artefact was unbuilt — bricking
  fresh/branch-switched worktrees**, because the block also stopped the `pnpm install` /
  `pnpm agent-tools:build` that builds the guard. Its `OAK_ALLOW_MISSING_PRETOOLUSE_GUARDS`
  break-glass was non-functional for the only actor that hits the catch-22 (the agent can't
  set the hook process's own env per-invocation). Cure: split **missing/not-built** (fail
  OPEN, loud + logged to `.claude/logs/hook-errors.log`) from **present-but-broken** (still
  fail closed). Bricking doesn't serve the safety goal of guarding *mistakes*; it only
  halts. Homed in `.agent/hooks/README.md` + the `decideMissingGuardArtifact` TSDoc.
- **Verify a prompt's "it's already tested" premise before treating the work as a flip.**
  The brief said the missing-artefact decision was unit-tested — flip the expectation. It
  was not: the smoke test that covered it was dropped in `2078e0f0` ("drop the smoke
  over-reach") and the surviving unit test only covers `resolveGuardExitCode` (the present-
  guard case). The honest move was extract-to-pure-fn + *create* the test, not "flip." A
  convenient premise that makes the work a one-liner is exactly the kind to ground first.

## 2026-06-05 — EEF deep-review closeout (Masked Creeping Lantern)

- **An adversarial verifier can false-NEGATIVE a true finding.** The review
  workflow's verify stage REFUTED a real "atomic landing honoured" strength; a direct
  `git show --stat 2e9021ff` proved test+code DID co-land. Two specialist readers also
  over-escalated (test-expert HIGH on a deterministic Result-narrowing guard;
  type-expert "widening" on a `ReadonlySet<string>` that is the correct predicate
  idiom). Verification cuts both ways — re-ground every load-bearing verdict,
  including the verifier's own, against source.
- **A workflow `StructuredOutput` with an uncapped `findings[]` can run away.** The
  master-plan reader made 45 emit attempts, failing schema validation because the
  findings payload exceeded the tool-call size; it only succeeded by collapsing to one
  finding. Next time: cap the array (top-N) and keep per-finding fields terse, or
  paginate.
- **A piped background command's reported exit is the PIPE's, not the command's.**
  `pnpm check 2>&1 | tail` reported "exit 0" while `pnpm check` had actually FAILED on
  an e2e flake. Read the captured output for the real gate verdict; never trust the
  wrapper exit on a piped command.
- **The shared working tree means another writer can land your changes mid-session.**
  The session-start `git status: clean` snapshot went stale: a parallel `Jim Cresswell`
  writer committed the bulk of my edits (`10c5aeac`, `0d99dc00`) with accurate
  conventional messages + explicit pathspecs (correctly NOT grabbing the untracked
  ADR-191 file). Re-run `git status` + `git log` before committing; never `git add -A`.
- **The attribution-PII policy's home was an existing rule clause, not a new rule.**
  `new-rule-vs-pdr-clause` routed it to `documentation-hygiene` §2, avoiding a 4-form
  new-rule and the fragmentation it would have caused.
- **"Ready to implement" = four grounded checks, not a `decision-complete` label.**
  Assessing D6 readiness: (1) contract ratified + the SURFACE specified; (2) the
  substrate exposes the consumed operations/types; (3) vendor shapes verified by a
  real evidence record (the D3 V1–V8: SDK version + `file:line`, not prose); (4) the
  named change-surfaces actually exist in the tree. The D3 SDK/app verification
  record is the exemplar — readiness lives in that artefact existing and checking
  out, not in the plan calling itself complete. Re-run the vendor checks at exec-plan
  authoring time (versions drift). Generalises `verify-vendor-call-shapes-at-plan-author-time`
  from authoring to readiness-assessment.

## 2026-06-06 — dual-review earns its keep at PLAN-author time, not just post-code (Dusky Dimming Candle)

- **The most consequential finding on the whole D6-plan session was a
  contract-conformance BLOCK, caught at plan-author time.** My first draft
  registered the EEF tool via a bespoke `eef-surface.ts` bypass; mcp-expert
  BLOCKed it, and reading D3:53-57/312-315 myself confirmed the contract mandates
  a *first-class* universal-tools entry ("not a bespoke bypass"). Solo, I'd have
  written the bypass into the plan and an executor would have built the wrong
  thing. `no-backfill-reviews` + `extensive-reviewers` pay off in planning, not
  only coding — review the *design* before it becomes the executable plan.
- **I re-instanced `ground-convenient-claims` (the just-graduated grounding-bar
  guard) — I asserted "the app already depends on graph-corpus-sdk" without
  checking; it does not.** The re-review caught it; `c3` now adds the dep
  explicitly. The convenient claim ("homing is easy, the dep's already there")
  is exactly where the guard should have fired pre-emptively. The guard works —
  *if applied before asserting*, not after a reviewer flags it.
- **A reviewer premise can be overturned by the BLOCK fix — re-adjudicate, don't
  carry the stale verdict.** fred's R3 "home in the app" was correct under the
  bypass premise; once the bypass became a first-class entry, the homing *split*
  (def+schemas SDK type-only; handler app-side) and was *forced* by constraints
  (`listUniversalTools` enumerates the SDK registry; the handler needs runtime
  graph-corpus-sdk). When one review overturns a premise, the others' premise-bound
  verdicts need re-checking, not mechanical application.

## 2026-06-06 — the grounding reflex skips hardest on my OWN artefacts (Tidal Plumbing Atoll)

- **PDR-089 §D7 (felt-authority-grounding-discipline) re-instanced again — third
  session running after Lanternlit (06-05) and Dusky (06-06).** Planning an MCP
  test-harness I relayed second-hand three times before grounding: framing the current
  state as "3 fragments", calling old-plan cycle 7 "unvetted inherited scope", and
  reducing cycle 7 to "just appId". Each was wrong or imprecise; each was caught by the
  OWNER asking ("is that the only thing in cycle 7?"), not by my own reflex. The novel
  wrinkle: the high-felt-authority surface was not a vendor doc but **my own plan's
  paraphrase** and a **structured sweep/reviewer summary** — both felt pre-grounded
  ("my artefact" / "the subagent already read it") so the reflex skipped. Addition to
  the homed doctrine: self-authored and structured-subagent outputs are
  high-felt-authority relay surfaces too; the cure was external prompting, echoing
  Lanternlit's "the gate, not the lesson."
- **The pre-write hook caught me hedging a forced decision into a deferral framing.**
  I'd concluded the ADR-161 E2E-boundary extension was architecturally forced
  (spirit-preserving; ADR-128 already orphaned the stdio definition), then wrote it
  into a permanent-doc deliverable as needing owner sign-off before action — the
  cheap-deferral pattern the doctrine forbids. The hook (re-apply-first-question /
  principles §Architectural Excellence Over Expediency) blocked the write. Same
  meta-pattern as above: the mechanical gate corrected what the reflex didn't. When
  excellence forces the answer, state the verdict; the owner overrides in conversation,
  not via a deferral checkpoint baked into the doc.

## 2026-06-06 — plan-complete ≠ value-delivered (Floating Darting Cloud)

- **The gap analysis that mattered: completing D6+D7 closes the EEF plan but does
  NOT deliver user value.** D7 (as written) proved structural fidelity behind a flag
  that was a NON-GOAL to flip; the real value proof (LLM-mediated faithfulness) plus
  ACTIVE promotion were deferred to `eef-outcome-evaluation-infrastructure.plan.md`.
  Lesson: when asked "does finishing X deliver the value", trace the runtime bridge
  to the actual user, not just X's acceptance tests — the non-goals and the future/
  plans are where the undelivered spans hide.
- **The owner then overturned the frame (moved the flag-flip INTO D7).** A
  frame-overturn is not a single-spot patch: D7 + Non-Goals + Plan-DoD + End-State +
  Risk + Lifecycle + owner_scope ALL asserted the old "flag stays off" boundary and
  ALL had to move together, or the plan self-contradicts. Editing only the named
  section (D7) would have left six live contradictions. Reshape every surface the old
  boundary lived on (replace-don't-bridge; never-carry-known-bad). Transparently
  report the blast radius since the ask named only D7.
- candidate: **The three-stage feature-flag lifecycle is undocumented.** Owner stated
  it: pre-release (default false, explicit true enables) → release-pre-proof (default
  true, explicit false = kill-switch) → release-post-proof (flag removed). Not in any
  ADR/rule/directive (grep clean). Worth a rule or ADR so future go-live edits cite a
  convention instead of re-deriving it. Trigger: owner confirms it is a standing convention.
- **Multi-agent continuity collision is real here, not theoretical.** napkin,
  repo-continuity, pending-graduations, and eef.next-session all went M *during* my
  session (Dusky + Tidal live on the shared tree). Kept handoff edits strictly
  ADDITIVE (new banner, appended section), skipped repo-continuity (no field
  contradicted; peer-active), and gated the commit on the peers — the owner is the
  live coordinator, so no comms ceremony was added.

## 2026-06-06 — commit-warden phase: commit-on-signal beats chase-the-churn; ceremony correction (Dusky Dimming Candle)

- **"Get to safe state" on a live multi-writer tree is whack-a-mole; the warden cure
  is commit-on-signal, not chase-the-churn.** I committed the test-harness +
  observability plans to safe state, peers re-edited them within seconds, I
  re-committed — three rounds, all additive + my work intact (verified each time).
  Right model: the author finishes and signals (commit-queue intent / directed event),
  then the warden gates + commits once. Peer claims also appeared on files I had
  ALREADY committed — in a fast window, claims lag commits; surface "your claim covers
  committed files" rather than assume claims precede commits.
- **Owner correction (twice): useful work + tight comms, NOT ceremony — I over-built
  the warden apparatus** (CLI archaeology for append/claims, heartbeat-cron planning,
  a long role broadcast) before being corrected. Reflex-update: a named team role is
  delivered by its useful core (here: gate + commit on signal) with minimal comms; the
  watcher is functional eyes, but heartbeat crons + long broadcasts are ceremony for a
  winding-down committer. Floating Darting Cloud's entry above had the right reflex in
  the same window ("owner is the live coordinator, no comms ceremony added").
- candidate: **start-right-team's "non-negotiable" First Moves (comms watcher +
  heartbeat cron + team-start broadcast) sit in tension with the owner's minimal-ceremony
  preference (`feedback_comms_ceremony_minimal`).** When is the full apparatus warranted
  (coordinated implementation push) vs a lean role (wind-down committing, owner present
  as live coordinator)? Trigger: owner direction or a second over-ceremony correction.
