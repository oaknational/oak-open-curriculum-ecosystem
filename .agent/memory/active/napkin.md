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

## 2026-06-04 - shell quoting and git index lessons (Breezy Navigating Rudder)

- **Mistake:** I parallelized two `git mv` commands during the
  school-data-search plan promotion and one bounced on `index.lock`. Git index
  mutations in a single worktree must be serial, even when each command is
  individually safe. Behaviour change: parallelize reads, but run `git mv`,
  staging, and commit-window operations one at a time; retry only after
  confirming the lock cleared naturally with `git status`.
- **Mistake:** My first napkin append used shell double quotes around a
  `node -e` string containing markdown backticks, so zsh executed the
  backticked text. Behaviour change: when an escalated shell edit must include
  markdown literals, use single-quoted shell source or a script file; do not
  place markdown backticks inside double-quoted shell strings.
- **Mistake:** I launched several `pnpm --filter ...` validation commands in
  parallel while the isolation worktree had fresh workspace/lockfile changes.
  They produced noisy install/postinstall behaviour and made recovery harder
  after the host crash. Behaviour change: after topology or lockfile edits,
  run one validation command at a time, starting with the smallest package
  check, and record incomplete validation as incomplete rather than pressing on
  with broader gates.
