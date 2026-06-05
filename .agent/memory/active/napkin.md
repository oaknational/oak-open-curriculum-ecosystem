---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-04 — napkin rotation (Arboreal Sprouting Branch curation pass)

Rotated the 2026-06-03 (Furnace) → 2026-06-04 (Shadowed) window — 13
session-sections — during a dedicated knowledge-curation pass. The processed
source is preserved verbatim at
[`archive/napkin-2026-06-04-arboreal-curation.md`](archive/napkin-2026-06-04-arboreal-curation.md);
the per-section disposition ledger is the
[ledger](../operational/curator-passes/2026-06-04-arboreal-sprouting-branch-curation.md).

Dispositions: most sections' primary lessons were already homed by each
session's own light handoff (distilled.md + Claude auto-memory), verified this
pass. Newly routed: six pending-graduations candidates
(dissolution-by-re-attribution; thoroughness-texture-is-not-evidence;
gate-outcome-vocabulary-third-word; mine-then-verify-against-canon;
corrections-are-high-risk-re-instantiation; independence-over-review-count),
plus a second-instance note on the design-optionality item and opener-genre
facets. Graduated to distilled: the commit-window moving-target discipline.
Homed to `docs/engineering/tooling.md`: the `pnpm outdated` exit-code semantics
(from the Codex cross-platform memory read).

Fresh capture starts below.

## 2026-06-04 — markdown wrapped-line list-marker trap (Fiery Sparking Caldera)

- **A wrapped prose line that begins with a list marker (`+`, `-`, `*` then a
  space) trips MD004/MD032** — markdownlint reads it as a nested list item. Hit
  it twice this
  session wrapping `a + b + c` enumerations across lines. Cure: never let a marker
  char start a wrapped line — reword, rewrap, or use commas. The pre-commit gate
  caught both (one re-cycle each).

## 2026-06-04 — the clean review I refused to trust (Arboreal Sprouting Branch)

- **An adversarial verification workflow returned `issues_found: 0`; my own
  independent re-check then found a real markdownlint MD004/MD032 defect in the
  curator-pass ledger.** The defect landed in a step-8 edit made AFTER the
  workflow ran, so the verifiers were not wrong — but trusting their clean verdict
  as "certified" would have shipped the defect. Three freshly-routed lessons
  collided in one moment: don't-trust-the-clean-review (Pattern 5);
  corrections/edits are the highest-risk re-instantiation moment (Pattern 4 — the
  defect was in the very ledger documenting the pass); and the wrapped-list-marker
  trap above (a line started with a plus then a rule name). The discipline earned
  its keep: a clean review is a claim to re-verify, never a certificate — most of
  all when it flatters a careful pass.

## 2026-06-04 — an IDE diagnostic flood is not automatically a repo warning (Fiery Sparking Caldera)

- **~30 cSpell diagnostics fired on legitimate domain terms (GIAS, HMAC,
  `pg_trgm`…) after a one-line edit. Before treating an IDE diagnostic flood as
  a no-warning-toleration obligation, verify the tool is a repo-influenced
  gate.** Here there was no repo cspell config and no cspell in the gate
  scripts → the editor extension's default dictionary (local noise on correct
  terms), not a repo warning. never-ignore-signals means investigate the
  signal; no-warning-toleration scopes to systems the repo influences. Real
  coverage would be a repo cspell.json with a domain dictionary (a separate
  owner call), never silencing valid terms.

## 2026-06-04 — the parallel session that committed my own work (Arboreal Sprouting Branch)

- **A parallel session committed 7× during this curation session — including my
  own napkin drain, archive, ledger, and the EEF lane (HEAD af304b7a→1b5208e8
  mid-session). The owner's reframe was the right lens: the question is not "did
  I edit from a stale base?" but "was any content LOST?"** Answered by
  set-membership, not by diffing edit-bases: every HEAD content line was present
  in working-tree ∪ my archive (0 lost); the 11 pending-graduations "deltas" were
  all my own intentional graduation-status edits, not drops. Sharpens the
  moving-window doctrine for a shared on-disk tree: verify content conservation
  (set membership across all my output surfaces), not which base I branched from.
- **Nearly authored a duplicate PDR-090.** The synthesis-tier-claims graduation
  was about to become a new PDR; grounding against the EXISTING PDR-089
  ("frame-capture; cure is the external check") revealed it already owned the
  substrate, so it routed as a clause (PDR-089 §Decision 6). The non-duplication
  verifier had only checked the register, not Practice-Core PDRs. Lesson: verify
  a graduation candidate against the FULL doctrine estate (PDRs/rules included),
  not just the register — and it is itself a worked instance of PDR-089 (the
  inherited authority I had not grounded against was the highest-risk surface).
- **CLI friction**: `pnpm agent-tools:check-commit-message -F <file>` fails —
  `-F` is pnpm's own `--filter` flag; stdin (`< file`) works. Adds to the
  comms/CLI-flag-friction family (`project_comms_cli_grounding_gap`).

## 2026-06-04 — felt-authority inversely correlates with grounding effort (Windward Gliding Squall)

- **The surfaces that FEEL most authoritative are where the skip-verification
  reflex is strongest — and they certify nothing about content truth.** This
  session ran an 8-reader workflow over the EEF thread state; the owner's
  mid-turn directive ("ALL subagent responses MUST be critically assessed
  before being accepted") was a pre-emptive correction landing on the
  highest-felt-authority surface of all: schema-VALIDATED structured subagent
  output. Schema-validation proves JSON shape, never claim truth — exactly as a
  green gate or a clean review proves no-error-in-the-checked-set, not
  correctness. Grounding the crux myself (live `GraphView<TNode>` is still
  single-param string-typed; branch 106 ahead) caught two real reader errors I'd
  otherwise have relayed: the redesign plan filed under `archive/superseded/`
  (it is in `future/`), and the `~90 ahead` figure mis-attributed to
  `feat/eef_exploration` (it is `feat/graph-tooling-tidyup`). This unifies three
  existing costumes of one principle — validate-specialist-findings (prose),
  don't-trust-the-clean-review (verdicts), report-compiles-not-certifies
  (synthesis) — under one frame: **no derived-authority surface self-certifies;
  authority comes only from grounding against the primary source, and the
  stronger the felt-authority, the more the grounding reflex must resist being
  skipped.** Owner-gated PDR-unification candidate; do not graduate uninstructed.
- **Fan-out scales reading but accrues a verification debt.** Delegating N reads
  creates N derived-authority surfaces I then owe ground-truth on; "I ran a
  thorough 569k-token workflow" is thoroughness of orchestration, not of
  verification, and masquerades as it. Process delta for next time: in a
  multi-reader workflow, add an in-workflow cross-check/critic stage that grounds
  inter-reader contradictions BEFORE returning, rather than relying on post-hoc
  synthesis to catch them (I caught this turn's two by hand; a subtler
  contradiction would have slipped through).
- **Checked assumption:** I shaped the EEF report as a "D5 launch brief" because
  the session was named "EEF D5". Reading the deeper need is what generative
  metacognition endorses, but it leaned the report's centre of gravity toward
  builder-readiness when the ask was only "report, then stop". Held as a named
  inference, not a given: "session titled D5" is not "build D5 now".

## 2026-06-04 — subagent DISCREPANCY-claims are the highest-risk relay class (Windward Gliding Squall)

- **Sharpened corollary to the felt-authority entry above, found one turn later
  by reading the primary sources I had only relayed.** When I finally read the D4
  contract + D5 plan first-hand (not via readers), the *facts* the 8-reader
  workflow gave me all held (generic `GraphView<TNode,TNodeId,TEdgeType>`,
  Decision B 9→8 names, 3 edit sites, the `impact_months` null+`-2` hazard — all
  true). But **two of the "discrepancies/open-items" my prior report surfaced
  were subagent FALSE POSITIVES that dissolve under grounding**: (1) reader 6's
  "fourth edit site / the contract-test isn't counted" — the D4 contract DOES
  count `graph-view/index.unit.test.ts` as site #2; "no fourth site" refers to a
  *different*, non-existent EefStrand-TNode instantiation test; (2) reader 3's
  "plan body says two sites, contract says three (stale)" — the plan body says
  **three** and merely documents that its "Done when" used to say two. Both were
  inherited interpretations I relayed as findings. Lesson: a subagent's
  factual claims and its **discrepancy/contradiction claims are different risk
  classes** — a discrepancy claim asserts a defect, so it is the class most
  worth grounding against the primary source BEFORE it ships, not after. I was
  laxest exactly where the stakes of relaying were highest. Cure: never relay a
  subagent-asserted contradiction without reading both sides of it in the
  primary source first.
- **What grounding also deepened (not error, genuine comprehension gain):** D4→D5
  is contract→construction bound by the plan's "seams compose, never reconcile"
  law — D5 fits D2's raw data to D4's view because both are projections of the
  one `as const` corpus root, so friction at the D2→D5 confluence means an input
  drifted upstream, never a bridge to build. And the test-split (generic
  structural tests over synthetic `TNodeId=string` via `makeNode`; EEF-binding
  tests over REAL corpus members only) is forced by the closed corpus type —
  `EefStrand = (typeof EEF_TOOLKIT_DATA.strands)[number]` means a synthetic
  strand is a category error. Relayed summaries flatten exactly these
  load-bearing design principles.

## 2026-06-04 — the grounding bar scales with the artefact's downstream use (Windward Gliding Squall)

- **A calibration corollary that GUARDS against over-applying the felt-authority
  lesson.** Owner directed me to read the D5 surfaces first-hand. Doing so
  CONFIRMED almost everything the readers had relayed — all 14 corpus
  cardinalities checked out against the actual `as const` data, and the one
  apparent mismatch (`number_of_studies` grep=4 vs the contract's "2/30")
  dissolved as 2 in `headline` + 2 in `school_context_relevance`, exactly as the
  contract states. So was the re-read necessary, or paranoid belt-and-braces?
  **Necessary** — and the reason is the calibration: relayed-with-disclosed-tier
  facts suffice for a REPORT, but an executable PLAN turns those same facts into
  test assertions and schema required/optional decisions, so every load-bearing
  shape and cardinality must be first-hand. A wrong cardinality silently flips a
  schema field optional↔required and breaks D6. The guard against the
  over-correction (re-verifying everything always, paranoidly): scale grounding
  effort to **what the output drives**, not to a blanket reflex. The impact sets
  the bar, not the surface task — which is the action-to-impact bridge made
  operational.

## 2026-06-04 — "graduate" is the gate firing, not a licence to skip grounding (Hidden Hiding Dusk)

- **Owner-directed graduations are still independently-grounded acts.** Owner said
  "graduate A/B/G"; that fires the gate, it does NOT remove the full-estate
  non-duplication + correct-shape obligation. Routed A1/A2 to CLAUSES on existing
  rules that already owned the substrate (knowledge-preservation owns the
  live-unique-substance screen; handoff-messages owns the opener-to-future-self
  case), and only A3 to a genuinely-new PDR-090 — never a new artefact where a
  home existed.
- **The PDR-090-near-duplicate trap, avoided this time (inverse of last session).**
  Before authoring the action-time-structural-interrupt lane I surveyed the full
  PLAN estate, not just the register — and found the design space already lived in
  `closure-pressure-remediation-design-space` (q2/q3/q5/q9/q10). So I opened a
  general reconciliation frame that DEFERS mechanism exploration there, instead of
  minting a duplicate. Full-estate grounding before authoring is the cure that held.
- **A fired trigger ≠ "graduate standalone now."** B1's trigger fired (EEF D4
  ratified) but its ADR home is owned by the active graph-tools-value-redesign
  thread (which plans the ADR-086 amendment at D5/D6/D7). Authoring a competing ADR
  here would collide. New check: before authoring a graduation's artefact, ask
  whether its permanent home is owned by an active thread; if so, defer to that
  thread, don't compete.
- **"A rule exists by name" is not coverage (Tempestuous held).** The C2
  withdraw-candidate looked covered by `pre-merge-divergence-analysis`, but that
  rule governs complex-merge HANDLING, not the content-derived-risk-assessment
  doctrine — opened the home, checked the substance, confirmed NOT covered, kept it
  gated. Verify substance, never the name.
- **Hook autoimmunity is real at write-time.** Cataloguing forbidden vocabulary
  (the owner-marker, "carve-out") inside a plan/doctrine file trips the content
  hook (PDR-044 §2026-05-21 approval-vs-refusal; this impl hard-blocks). Use neutral
  names ("hedging-vocabulary trip-list", "owner-only marker") when writing about the
  patterns the hook guards.

## 2026-06-04 — pairing-buddy feedback on collaboration tooling (Feathered Spiralling Wing)

- **`--body` length guard is useful, but team-start prose easily crosses it.** My
  first comms team-start event hit the 1500-char `--body` limit (1822 chars) and
  the CLI correctly named `--body-file` as the cure. For short team-starts, rewrite
  compactly; for dense feedback, use `comms send` with a deliberately short verdict
  plus a pointer to the durable artefact rather than turning comms into storage.
- **A supposedly focused vitest invocation widened to the whole agent-tools suite.**
  `pnpm --filter @oaknational/agent-tools test -- collaboration-state.unit.test.ts`
  returned green but ran 95 test files / 857 tests, not just the named file. Treat
  that as useful evidence, but do not report it as a narrow targeted test. Prefer
  `pnpm --filter @oaknational/agent-tools exec vitest run <path>` when the intent is
  a true focused file run.
- **User correction: external agent feedback is never self-certifying.** During the
  Fiery pairing pass, owner restated that all external feedback from agents must be
  critically assessed before acceptance. Apply this immediately to peer feedback,
  reviewer output, subagent reports, and comms suggestions: verify facts against the
  live source, assess the evidence-to-recommendation step, and label outcomes as
  accepted / partially accepted / rejected / unverified instead of relaying them as
  authority.

## 2026-06-04 — monitors are not a substitute for reaction (Iridescent Drifting Star)

- **My watcher worked, but my pairing behavior lagged.** Owner caught that
  Windward was posting D5 plan work while I was not reacting. The technical monitor
  was receiving comms, but I treated that as passive awareness instead of an active
  obligation to read, assess, and respond. In team pairing, a live watcher creates a
  response duty: when the planner posts a draft, request, heartbeat with material
  cycle progress, or reviewer synthesis, either respond with assessed feedback or
  explicitly say there is nothing new to act on. "Monitor green" is not "pairing
  done."

## 2026-06-04 — frictions register is a pointer, not ground truth (Fiery Forging Ash)

- **The agent-tooling frictions register carries ~20 entries stamped
  `addressed-in-working-tree-2026-05-10` with a never-completed "replace with
  commit SHA after landing" trigger.** Trusting those statuses would read
  "already fixed" for things that may never have committed. Same shape as the
  thread-record-is-pointer-not-truth law, on a new surface: before acting on a
  register status, recompute against the *current code* (here: `comms append
  --help`, the spec table, the option sets). The register framed the candidates;
  the live source decided what was real. Fixed F-35 (heartbeat `--help` gap) +
  F-07 (`comms list`/`show`) grounded against source, not against the register's
  own claims.
- **Monitors are scaffolding for an active collaboration loop — stop them when
  the loop closes, or they become noise-tax.** Complements Iridescent's
  "monitor green ≠ pairing done" above from the other end: the watcher earned
  its keep instantly (surfaced a *directed* consolidated-frictions message from
  Windward I hadn't read), but once that was read and the pair-review delivered,
  it emitted only EEF cross-traffic + heartbeats — waking me with zero my-lane
  signal. The owner's "focus on useful work, not just communications ceremony"
  named exactly that. Heartbeat = pure outgoing ceremony (stop first; low value
  with owner present + no claim). Watcher = useful *while* a feedback loop is
  live. Start on demand, stop when the loop closes; don't leave them as ambient
  tax.
- **Critically assessing peer feedback can VINDICATE the peer by grounding — and
  hand you the source you were missing.** Owner directive: critically assess all
  external agent feedback (Feathered + owner captured the discipline above). My
  distinct instance: Feathered's "Windward items 2/3 still open" looked like an
  unverified attribution (Windward's *broadcast* named only item 1). Grounding it
  surfaced a separate *directed* message from Windward — the consolidated 3-item
  list I hadn't read. The doubt was right to raise; the grounding confirmed
  Feathered AND found the unread primary source. Validate-findings is "resolve
  the claim against the primary source before relaying," not "assume the peer is
  wrong."

## 2026-06-04 — fan-out review earns its keep on un-pre-grounded dimensions (Prismatic Twinkling Planet)

- **When the lead has already established solid ground truth, a fan-out review
  workflow pays off on the dimensions the lead did NOT pre-ground — not the ones
  they did.** EEF D5 fresh dual-review: I verified package filters, contract
  line-citations, corpus cardinalities, and the zero-blast-radius gate solo,
  first-hand. The six-lens workflow then did two distinct things. On those four
  pre-grounded claims it correctly REJECTED every adversarial attack as a
  false-positive — pure confirmation, adding nothing I didn't already hold. The
  value was the four real NEW findings it surfaced (the `projection?` omission,
  the undefined depth `MAX`, the under-characterised depth-1 member-edge example,
  the missing module-import coverage) — every one in an architecture / type /
  test-completeness dimension I had not independently checked.
- **Cure / next time:** brief review lenses to spend effort AWAY from what the
  lead has already verified (hand them the verified ground truth, say "challenge
  it, but your real value is elsewhere") and TOWARD the un-grounded judgment
  dimensions. Adversarial-verify on a pre-grounded claim is cheap confirmation;
  on an un-grounded dimension it is discovery. Budget the fan-out accordingly.
- Covered by existing auto-memory
  (`feedback_validate_specialist_findings_before_acting` +
  `feedback_ground_state_before_planning`), so no new auto-memory entry — and
  `MEMORY.md` is over its size limit anyway.

## 2026-06-05 — push proofs to the lowest level; knip lives only in `pnpm check` (Silvered Listening Secret)

- **A smoke/integration test that proves pure logic is an over-reach — decompose
  what the test proves and push each proof to the lowest level that can hold it.**
  The PreToolUse fail-closed shim's smoke test proved the exit-code mapping
  (signal / broken-build / closed-set {0,2}) — pure logic that belongs in a unit
  test — plus Node's own `stdio:inherit`, which is external functionality the
  testing strategy says never to test. Owner-corrected, citing
  `testing-strategy.md`. Cure: extract the decision (`resolveGuardExitCode`) to
  committed source + unit-test it; the shim shrinks to thin IO and imports the
  tested function. The unit signature `(code, signal)` structurally proves the
  bypass env can't leak into the crash path.
- **Node 24 imports committed `.ts` directly (type-stripping), so a build-free
  `.mjs` shim can import unit-tested TS logic.** The relative specifier resolves
  against the importer (NOT `CLAUDE_PROJECT_DIR` — I tripped on that first), wrapped
  in try/catch so a load failure fails CLOSED (a static import would fail OPEN on
  exit 1). This is the mechanism that lets build-free harness glue stay thin AND
  have its logic unit-tested. First real instance. `candidate:` reusable pattern —
  build-free shim + node type-stripped import of committed source + fail-closed
  guard.
- **knip is NOT in the pre-commit hook — only `pnpm check` runs it.** Two commits
  added tsx-spawned validator entry files (`validate-lifecycle-scripts`,
  `validate-pretooluse-guard-routing`) without registering them in
  `knip.config.ts`. The turbo gate I ran as the pre-commit equivalent
  (`build type-check lint test`) passed, but knip flagged them as unused files and
  `pnpm check` was red; the owner caught it. Cure: after adding any tsx-spawned or
  dynamically-referenced entry file, register it in `knip.config.ts` AND run the
  full `pnpm check` (session-handoff step 11) — not only the turbo gate — before
  declaring done.
- **External input is a hypothesis to falsify — reinforced all session.** The
  report's "recursive postinstall loop" mechanism was refuted by grounding (no
  package-manager call anywhere in the postinstall build graph); the
  `.agent/hooks/README` invariant claiming a missing artefact "fails loudly rather
  than silently allowing" was the exact false belief that masked the real
  fail-open. Verify-don't-trust applied to a report, to sub-agents, and to my own
  first answers (skip→fail-loud, scripts/.mjs→checked-src, smoke→unit).
