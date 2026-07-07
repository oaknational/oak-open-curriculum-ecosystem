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
permanent home, verify the home, then archive and start fresh. Rotation is the preservation
step AFTER processing — never a fitness-relief move or a queue (owner correction, 2026-07-06).

## Napkin rotated (2026-07-06 dedicated consolidation, Zenith wakes Perigee)

Rotated at the dedicated pass after full processing. The processed window (2026-06-29 →
2026-07-06: the curriculum-hub program's rotating cast, the cross-repo Practice exchange arc,
the corpus Phase-0 sessions, PR-304/305/306/308/310/312/295 shepherding, the Sonar 5B and
doctrine-PR sessions, and the Nettle + Hyena closeouts) is preserved verbatim in
`archive/napkin-2026-07-06-zenith-dedicated-consolidation.md` (byte-identical, proven by cmp).
Every behaviour-changing entry was dispositioned before the archive-move: the
pending-graduations register drained to zero (nine homes verified first-hand, three tail items
graduated — sequence-first into PDR-018 owner-ratified live, doctrine-lookup tripwires into the
sonarqube rule + invoke-code-experts, the merge-commit path into the commit skill); the
distilled buffer's window drained to verified homes (verify-dont-trust, PDR-063/082/117,
build-system, typescript-practice, quality-tooling, testing-patterns, the watcher rule,
collaboration-state-conventions, semantic-merge + reason skills, metacognition, oak-eslint and
demo READMEs, the demo-maintenance and action-time plans); four new patterns authored
(generator-first-for-vendored-static-data, hydration-state-pinning,
lint-rule-pincer-is-a-design-signal, server-component-reads-data-layer-directly); six frictions
registered (F-122–F-127). Both graduation batches ran the PDR-101 quorum.

New session observations append below.

## 2026-07-06 — Zenith wakes Perigee (dedicated consolidation): session observations

- **Owner correction (standing, homed in this file's header + the rotation note): rotation is
  NOT a way to deal with long documents within the fitness protocol — processing is.** Rotation
  happens AFTER processing only; it is not a quick out or a queue, it is how processed napkins
  are preserved. My first framing offered rotation as the response to the 1385-line napkin; the
  correction re-ordered the pass (process every entry to a disposition first, archive last).
- **A registry claim to have authored a cross-reference is a claim like any other**: the Nettle
  pass's homes-authored note said the view-binder graduation included "a testing-strategy.md
  cross-ref" — first-hand verification found the pattern file real but the cross-ref ABSENT.
  Verify each element of a compound claim, not the claim's headline.
- **The PDR-101 quorum earned its cost on batch 1**: four seats converged on an SSOT-duplication
  defect (the same discipline authored into two homes plus a third existing one) that I had
  written fluently; the fix (one canonical home + pointers) landed before the commit. Reviewer
  convergence on the same defect from four genuinely distinct lenses is the strong signal form.

## 2026-07-06 — Zenith wakes Perigee: handoff loss-scan captures

- **7c thread-register audit findings (owner attention, from the dedicated pass):**
  (1) `agentic-mechanisms-discovery` last_session 2026-06-08 — 28 days stale on the Active
  table; (2) `eslint-no-throw-result-migration` 2026-06-19 — 17 days stale; (3) two COMPLETE
  threads still listed Active (`reasoning-grammar`, `user-search-not-exposed-until-built` —
  both landed, push pending) — retirement/paused-move candidates at the next continuity touch.
  Coverage bound, honestly: checks 1/5/6 ran in full; checks 2–4 (orphan tables, missing
  identity fields, duplicate rows) were spot-sampled, not exhaustive — a future audit should
  not read this pass as full 7c coverage.
- **7d residue:** the abandoned+expired Zodiac commit-queue intent (b19b15f7) was deliberately
  LEFT in `active-claims.json` — a direct jq wipe was classifier-denied as shared-state
  destruction (correct call: no owner direction named it). Phase=abandoned + expired = harmless;
  clear it at the next owner-authorised collaboration-state write. Evidence for its
  completedness: Zodiac's closeout 16:38/16:57Z + merged PRs #310/#312.
- **Cross-estate host-load serialization worked (novel coordination shape, single instance):**
  three heavy gate chains (two oak sessions + a resonance-estate merge, invisible to each
  other's streams) converged on one host at 1-min load ~19; the exchange seat (Kiln) relayed a
  one-heavy-chain-at-a-time sequencing between the estates' streams ("announce chain-start on
  your home stream; hold while 1-min load >12 at start"). candidate: pattern/PDR if a second
  instance recurs — the relay-seat-as-load-coordinator is the interesting part.
- **Quorum operating economics (sizing knowledge for future dedicated passes):** a PDR-101
  four-seat quorum over a ~20-file doctrine batch ran ~70–120K tokens/seat, ~5–7 min
  wall-clock in parallel, and each batch produced 1–4 genuinely batch-altering findings —
  worth the cost at doctrine-batch scale, oversized for a one-file graduation.
- **My own F-125 bit me ~10 minutes after I registered it** (cwd drifted to threads/ from an
  earlier `cd`, breaking a repo-root grep) — live recurrence evidence that vigilance does not
  cure this class; the structural cure (location-independent gate scripts) is the point.
- **Transient `.git/index.lock` collision under a peer's worktree ops**: cleared itself under
  the no-contact posture (third recorded instance; diagnose-without-touching then retry holds).

## 2026-07-06 — Zenith wakes Perigee: the wall-clock perf-test ruling (owner-surfaced)

- **Owner diagnosis on a full-gate red**: "nothing that takes 700ms to run 12 tests is a real
  unit test, there are some SLOW tests in there" — my first disposition (load flake, re-run) was
  insufficient; the flake was a SYMPTOM. test-expert ruling (rulings-as-artefacts shape):
  defect class = **wall-clock ceiling in a gated in-process test** (`toBeLessThan(500)` ms is
  nondeterministic pass/fail across environments — the same defect class as a conditional test,
  expressed through the assertion's value; any finite ceiling fails under sufficient
  contention). Cure = DELETE (no deterministic assertion is recoverable from wall-clock; a
  benchmark instrument is the conformant home for a genuinely-owned cost budget). Must-not:
  raise the ceiling, retry-wrap, tolerance-band, relative bounds, or slice the corpus out of
  behavioural tests. Landed: three deletions in graph-corpus-sdk (misconception/keyword/
  prior-knowledge view suites), 100/100 green. The real-corpus import design itself was ruled
  CONFORMANT and stays (Real-Content Backstops; discriminating fixtures done well).
- **Two ruled follow-ups routed, NOT landed (owning lane's call):** (1) an on-demand cold-import
  benchmark instrument (fresh-process measurement, script surface, reporting-not-gating) — only
  if a real consumer-facing startup budget exists; (2) the dominant suite import cost is
  ADR-086 per-node load-time validation of the ~27MB corpus at every consumer import — whether
  that validation belongs fully at generation time (ADR-031 heavy-lifting-at-codegen) with a
  minimal load-time assertion is a product/pipeline design question for the graph-corpus/
  sdk-codegen estate. candidate: route to the owning lane at its next touch.

## 2026-07-06 — Stoat rides Gloaming (432a41, plan-corpus refounding R0 successor): session observations

- **The primary checkout's working tree mutated under me at session open**: ~56k generated SDK
  lines (`packages/sdks/oak-sdk-codegen/src/types/generated/**`) showed deleted then restored
  within ~2 min — an in-flight codegen/gate cycle from a concurrent seat (host 1-min load 66→90
  on 8 cores, 0% CPU idle, memory pressure green). Behaviour note: a git-status snapshot taken
  during a peer's codegen window is not tree truth; re-check before classifying dirt. Held all
  heavy chains per the one-heavy-chain agreement. (Same window: a napkin append collided with a
  live peer write — re-read-then-append held.)
- **P2's sanctioned-writer/re-derivation clause earned its place before the protocol even ran**:
  the surface census drifted design→now (618→619 plans md; ~20→29 plans non-md; 65→66 prompts —
  the +1 prompt IS the R0 session opener authored for this seat). Every G1-packet number is
  labelled indicative; the freeze script's recomputation is the only binding denominator.
- **The standby / successor-in-waiting seat contract ran clean end-to-end**: watcher +
  team-start registration, no heartbeat, no claim → the predecessor's SUCCESSOR RUNWAY
  broadcast carried the full pickup contract (grounding pointer, GATED-until-runway-clear list,
  boundaries, commit craft) → adoption = ACK broadcast + claim open in one move, n=2
  owner-visible declared. The explicit gated-stage list let the successor ground fully and
  draft the G1 packet + R0c ledger during the predecessor's heavy-chain window with zero
  collision risk. candidate: pattern if a second runway handoff recurs.

## 2026-07-07 — Fern spins Taproot (ITF knowledge-graph spike, worktree nifty-ramanujan-7b1623)

- **Tool friction → F-132 (registered this session): commit-queue is blind to worktree
  indices.** `record-staged`/`verify-staged` read the primary checkout's index, so a
  worktree-staged bundle fingerprints as empty and verify fails with "missing: <every intended
  file>" even though `git diff --staged` in the worktree shows the exact bundle. The skill
  already contemplates worktree windows (`git:index/head@<worktree>` claims) — the queue's git
  surface doesn't. Disposition: intent 86c5c642 → abandoned with stage-named notes; landed
  6edcb025a via the documented explicit-pathspec path under claim 0307be08, full hook chain
  green. Details + candidate cure: frictions-register F-132.
- **Identity-seed discipline**: two hand-typed `PRACTICE_AGENT_SESSION_ID_CLAUDE` values
  drifted between CLI calls, so a comms title said "Zenith tracks Vacuum" while registry rows
  say "Fern spins Taproot" (corrected in closeout event 95a479c9). Export the seed once per
  session, never retype it.
- **Owner rulings (both homed):** (1) n=1 session ⇒ no team ceremony — watcher/claims/comms/
  commit-queue exist for concurrent agents, not as a rite; keep commits, gates, memory capture
  (also in Claude per-user memory `n1-sessions-skip-team-ceremony`). (2) UK spelling only,
  everywhere (per-user memory `uk-spelling-always`; licence/license noun/verb is the classic
  trap). (3) All official repo code must be TypeScript; spike-only `.mjs` preservation copies
  sanctioned 2026-07-07 pending the integration pass (homed: spike README + NOTES + PR #319).
  (4) Licensing for the ITF-derived data: academic reuse with full acknowledgement, baked into
  the data envelope (`source.attribution`/`source.licenceNote`).
- **F-125 recurrence (cwd drift):** my own sweep broke on a relative path because an earlier
  `cd` into the spike dir persisted — third-party evidence the cure is structural
  (location-independent invocations), not vigilance.
- **PDF→graph craft (homed in the spike's NOTES.md, pointers only):** regular per-area document
  structure transcribes almost 1:1 to the corpus containment grammar; relational prose is the
  highest-value graph content; some knowledge lives only in images (partner logos) — audit page
  *types* after text extraction; grey literature defeats Crossref bibliographic matching
  (books/working papers/DfE/EEF reports) — hand-verified publisher URLs with a `resolution`
  provenance marker; deterministic layered SVG + barycentre beats force-direction for
  near-multipartite graphs and stays git-diffable.
