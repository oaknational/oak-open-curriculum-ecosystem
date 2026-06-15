---
fitness_line_target: 1100
fitness_line_limit: 1467
fitness_char_limit: 200000
fitness_line_length: 100
lifecycle_model: >-
  canonical pending-graduations register — owner-gated and pending items live
  here until graduated, duplicated, stale-withdrawn, or owner-resolved
access_pattern: >-
  consolidation-pass-only — read at consolidations and drain sessions; not
  loaded every session by every agent
drain_strategy: >-
  Graduate items to PDRs/ADRs/rules/permanent docs; keep owner-gated items here
  until owner direction resolves them; do not split, shard, or hide buffer depth
fitness_rationale: >-
  Recalibrated 2026-06-08 on owner direction: hard limit 2200 -> 1467 and target
  1500 -> 1100 (target lowered below the new hard limit for zone coherence) so
  critical (hard x 1.5, the global ADR-144 ratio) lands at ~2200. The tighter hard
  band is deliberate back-pressure for a consolidation-pass-only drainable buffer:
  it keeps the register reading `hard` until the owner-gated backlog is genuinely
  walked down with the owner present, rather than going green on tombstone-removal
  alone. A fitness limit on a drainable buffer is a drain-cadence signal, not a
  size cap. Fitness here is informational-only (not wired into any commit/push
  hook), so the standing `hard` never blocks a commit and must be reported, not
  chased: owner-gated items that legitimately wait are never trimmed to clear it.
  Prior note: recalibrated 2026-05-27 to collapse legacy pseudo-shards back into
  this one canonical register; fitness is routing evidence, not permission to
  create sidecar buffer files.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Pending Graduations

This is the canonical pending-graduations register. Do not create dated,
windowed, backlog, split, or shard-like pending-graduation files. New capture,
owner-gated items, and unresolved pending-graduation decisions belong here until
they graduate, duplicate, become stale-withdrawn, or receive owner direction.

**Owner walk 2026-06-11 (dedicated consolidation, Thermal Circling Updraft):**
every owner-gated item was walked with the owner. Items now reading
`owner-approved 2026-06-11` have authorised authoring/graduation queued; items
reading `routed 2026-06-11` belong to the agent-tools implementation lane; items
still reading `owner-gated` or `pending` below were confirmed at the walk as
genuinely waiting on their named external event or trigger.

## 2026-06-12 capture — Thyme wakes Canopy (dedicated consolidation; napkin-rotation routes)

Routed during the 2026-06-12 napkin rotation. Each verified absent from this
register before adding.

- **Client-visibility check belongs in MCP tool-shape ratification.** A
  spec-valid response shape (`content: []` + structuredContent-only) was
  ratified without evidence of how real agent clients render it; the live
  exercise falsified the implicit "clients surface structuredContent"
  assumption for Cursor (decoration-key fingerprint proof in the
  cursor-visibility write-up), and a Claude Code probe showed the OPPOSITE
  half (surfaces only structuredContent) — the two-client matrix is the
  canonical example alongside the 2026-05-28 consumption research.
  `[captured: 2026-06-12 | source: Dawnlit napkin candidate (50c2d1) +
  oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md | target: a clause in
  the output-schemas plan / ADR-195 family requiring a client-population
  rendering check before ratifying any non-default response shape | trigger:
  S1 decision on the snag register, or a second client found dropping
  structuredContent (S0 probe) | size: S | status: pending]`
- **Transient pre-push failures under concurrent worktree gate runs.** TWO
  lanes in one window (2026-06-11) hit non-reproducing pre-push failures;
  suspect shared turbo cache under concurrent gate runs across worktrees.
  Cure that worked: full-log capture + one clean re-run before treating a
  pre-push red as content-rooted.
  `[captured: 2026-06-12 | source: Cosmos + Moss napkin entries (2026-06-11)
  | target: build-system investigation lane | trigger: a third lane hits a
  non-reproducing pre-push failure under concurrent worktree gates | size: M
  | status: pending]`
- **mcp-expert sub-agent needs a deep review + update (owner-directed
  2026-06-12).** Light review evidence: 628 lines, ONE combined mention of
  elicitation/sampling, no spec-revision pins; body knowledge predates the
  2025-11-25 MCP revision (URL-mode elicitation; sampling.tools; prompt
  icons; completion context.arguments). Fetch-live-spec discipline is sound;
  the gap is worked knowledge + review checklists. Fold in the snagging
  arc's client-visibility lessons (rendering evidence before shape
  ratification, sibling entry above).
  `[captured: 2026-06-12 | source: Forge napkin work-note (owner-directed) |
  target: specialist-agent design overhaul lane (auto-memory
  project_specialist_agent_design_overhaul) — mcp-expert is its first named
  target | trigger: owner-directed; next specialist-overhaul session | size:
  M | status: routed 2026-06-12 — specialist-overhaul lane]`
- **Agent-tools collaboration-CLI optional residuals (conserved 2026-06-12 from a
  retired continuity section whose "tracked in pending-graduations" pointer was
  unbacked).** Both parent lanes landed 2026-06-06 (collaboration-state CLI F-35
  heartbeat help + F-07 `comms list`/`show`; PreToolUse guard
  fail-open-on-unbuilt-artefact). Residuals: (a) an ADR-167 exit-0-log amendment
  — assessed "recommended not needed" at landing; (b) F-36 pnpm-wrapper
  porcelain-stdout and F-07 list-filters — owner-directed-optional UX additions.
  `[captured: 2026-06-06 (registered 2026-06-12) | source: the landed
  collaboration-CLI lanes | target: agent-tools CLI UX lane (only if
  owner-directed) | trigger: owner direction | size: S | status: owner-gated]`
- **Seam-mapping taxonomy + "seams compose, never reconciled" law as a reusable
  plan template/archetype.** Owner-confirmed intent (2026-06-01 review window):
  the EEF rebuild plan's `## Sequencing` carries a seam taxonomy and the law
  that seams compose rather than reconcile; the candidate is extracting it as a
  plan template/archetype component for future multi-seam plans. The live
  instance is the EEF plan's Sequencing section (the durable home of the
  worked form). Registered 2026-06-12 after a consolidation pass found the
  prior "tracked in pending-graduations" pointer was unbacked.
  `[captured: 2026-06-01 (registered 2026-06-12) | source: EEF rebuild plan
  §Sequencing + owner-confirmed intent | target: plan template/archetype
  component | trigger: the next multi-seam plan authoring, or owner direction |
  size: M | status: pending]`

## 2026-06-11 capture — Thermal Circling Updraft (dedicated consolidation walk)

- **Team-opener generalisation exploration plan: x5 owner walk.** The
  owner-directed exploration plan
  `.agent/plans/agent-tooling/current/team-opener-generalisation-exploration.plan.md`
  (authored 2026-06-11, merging at the Director's hand) names decisions without
  making them: the generic-platform / start-right-team-overlap / thread-specific
  decomposition and the home options (skill / sibling skill / skill+template /
  rule extraction). Its todo x5 is a future owner walk; recorded here so the
  decision surfaces in the owner-decision queue rather than only inside the plan.
  `[captured: 2026-06-11 | source: Director handed delta (event e17324ff) |
  target: the plan's own x5 walk | trigger: plan merged + owner walks it |
  size: decision-only | status: owner-gated — future walk, plan not yet merged
  at capture time]`
  Evidence rider for the walk (napkin 2026-06-11, Thermal, conserved verbatim
  in substance): the seventh directorship started as pure coordination
  (routing up to 7 implementers) and ended as solo implementation with no
  implementer pool left to route to — legitimate under the degenerate-team
  exception, but load-bearing evidence that the collaboration infrastructure
  cannot yet carry a long-running team autonomously; the session's manual
  toil (hand-rolled PR monitors, manual merge serialisation, six continuity
  waypoints by hand) is exactly what the plan proposes to systematize.
  Candidate framing: "a Director doing sustained implementer work is a
  missing-autonomy-primitive signal" (sibling of
  feedback_owner_action_is_not_a_cure).

## 2026-06-08 capture — Briny Charting Lagoon (EEF go-live: flag-engine + verification doctrine)

- **"Tests pass" ≠ "the feature works" — run the assembled system, don't flag the gap.** Owner:
  "the tool has never been used" — after I shipped EEF D6 green and repeatedly *flagged* the
  value-path proof as "open" rather than invoking it. Starting the no-auth server and calling the
  four MCP surfaces proved it in seconds. A gap I can close this session is not "open", it's undone.
  - `captured-date`: 2026-06-08
  - `source-surface`: this session's owner direction; auto-memory
    `feedback_run_the_thing_dont_flag_the_gap`
  - `graduation-target`: ADR-150 / PDR-011 amendment (verification edge) or a
    `run-the-feature-before-done` rule
  - `trigger-condition`: a second "shipped green but never exercised" instance, or the next handoff
    revising ADR-150
  - `status`: pending

## 2026-06-07 capture — Glittering Weaving Comet (feedback-mechanism reappraisal generalisation)

- **Generalise "feedback mechanisms carry positive reappraisal direction" across every
  feedback surface, not only the PreToolUse content guard.** PDR-044 §Innate immunity was
  amended (2026-06-07) so a hard block's surfaced detection pairs its citation with a
  positive reappraisal direction; the first and only ENFORCED instance is the PreToolUse
  content guard (concept-grouped `preToolUseContent.scoped_blocks`, each concept carrying a
  `reappraisal`, presence enforced at commit-time by the `validate-policy-reappraisal` repo
  validator). The amendment is deliberately scoped to that surface. The same discipline
  should extend to the other feedback surfaces: the Bash command-block guard
  (`preToolUse.blocked_patterns` — mostly bare strings today; regrouping breaks bare-string
  backward-compat and risks a harder brick, so deferred this arc), ESLint custom-rule
  messages, and the prose of the always-applied `.agent/rules/*.md` corpus (each rule should
  state the positive move, not only the prohibition). Candidate enforcement surface: extend
  `validate-policy-reappraisal` (or a sibling validator) to assert positive direction across
  those surfaces. Owner directive origin: every agent feedback mechanism — hooks, rules,
  eslint — must include positive reappraisal direction, not only a negative assessment;
  doctrine without mechanism is debt (owner, 2026-06-06).
  `[captured: 2026-06-07 | source: PDR-044 §2026-06-07 amendment + owner directive 2026-06-06
  (feedback mechanisms embody doctrine) | target: extend validate-policy-reappraisal across
  Bash/ESLint/.agent-rules surfaces + the corresponding doctrine | trigger: FIRED — owner direction
  2026-06-07 | size: M | status: owner-approved 2026-06-07; execute in a fresh session (handoff:
  agentic-engineering-enhancements.next-session.md)]`

## 2026-06-07 capture — Briny Plumbing Beacon (2a landed; 2b reshaped)

Progress + new candidates on the Glittering capture above (feedback-mechanism reappraisal
generalisation):

- **Item 2a (ESLint surface) LANDED — but NOT as the "extend validate-policy-reappraisal" validator
  the
  capture proposed.** ESLint rules are TypeScript source, so enforcement moved to the **type
  system**:
  `packages/core/oak-eslint/src/reappraising-message.ts` — a zod-branded `ReappraisingMessage`
  minted
  only by `createMessage({prohibition, reappraisal})`, plus a `RuleWithReappraisingMessages` rule
  type;
  a prohibition-only string fails `tsc`. All 6 `meta.messages` rules migrated. Committed (entangled
  with
  EEF WIP) in `2cd529b5`. The validator is the right mechanism for the JSON policy guards (fail-open
  registry); the type system is the right mechanism for TS rules (PDR-038, at the cheaper layer).
- **Item 2b (rules-prose) RESHAPED + owner-expanded.** It is an **89-file** `.agent/rules/*.md`
  change
  (not "M"); "states a positive move" is not mechanically checkable without first imposing a
  structured
  slot (keyword heuristic rejected as false-positive noise). Owner approved the full pass. Reframed
  as
  doctrine cartography: shared cures reveal rule-collapse candidates (owner insight).
- **Item 2c is PER-SURFACE** — widen the PDR-044 amendment for ESLint once 2a is confirmed
  enforcing;
  for rules-prose after 2b. Never wider than enforcement reaches.
- **NEW pattern candidate:** *compile-time enforcement that a feedback surface teaches the positive
  reappraisal direction* (the `reappraising-message` shape) — a reusable instance of "feedback
  mechanisms
  embody doctrine" for any TS-authored feedback surface. **NEW precedent:** the **first branded type
  in
  the repo**, minted via zod `.brand().parse()` (the assertion-free mint forced by
  `consistent-type-assertions: 'never'`) — candidate for a short note in the type doctrine if a
  second
  branded type appears.
  `[captured: 2026-06-07 | source: item-2a execution (Briny Plumbing Beacon) | target: (a) PDR-044
  cross-surface widening per-surface as each enforces; (b) pattern record for
  compile-time-feedback-teaching + zod-brand-mint precedent | trigger: 2a landed; 2b/WS1 next;
  pattern record at second consumer | status: 2a landed 2026-06-07; 2b owner-approved full pass; WS1
  next]`

## 2026-06-06 capture — Dusky Dimming Candle (D6 plan dual-review)

- **Re-adjudicate premise-bound reviewer verdicts when a peer reviewer overturns the
  shared premise.** In a multi-reviewer synthesis, one reviewer's verdict can be
  conditioned on a premise that another reviewer's finding overturns; mechanically
  applying the premise-bound verdict carries a stale conclusion. This is distinct from
  the existing reviewer-discipline doctrine (`review-count-is-not-coverage`,
  `different-lens-reviewer-divergence`, verifier false-negatives — PDR-089 §Decision 6):
  it is about *dependency between verdicts at the synthesis step*, not lens divergence or
  coverage. Worked instance: architecture-expert-fred's R3 homing verdict ("home the EEF
  composition in the app") was premised on the bypass architecture; mcp-expert's BLOCK
  overturned that premise to a first-class universal-tools entry, which forced the homing
  to a different split (def+schemas SDK-side via `import type`; handler app-side). The
  synthesis step had to re-derive the premise-bound verdict, not apply it. Single instance
  so far; the cure when graduated is likely a clause on reviewer synthesis.
  `[captured: 2026-06-06 | source: napkin Dusky Dimming Candle 2026-06-06 (D6 plan dual-review) |
  target: amend:validate-specialist-findings-before-acting OR PDR-089 §Decision 6
  (reviewer-synthesis discipline) OR a new reviewer-synthesis pattern | trigger: second
  premise-cascade instance OR next reviewer-dispatch/synthesis doctrine pass OR owner direction |
  size: S | status: pending]`

## 2026-06-04 captures — Arboreal Sprouting Branch curation pass

Routed during the dedicated knowledge-curation pass (napkin rotation +
experience-corpus cross-read). Each verified ABSENT from this register before
adding. Disposition ledger:
[`curator-passes/2026-06-04-arboreal-sprouting-branch-curation.md`](curator-passes/2026-06-04-arboreal-sprouting-branch-curation.md).

- **Dissolution-by-re-attribution: when both options of a binary policy question
  suppress a signal, re-attribute the root cause and the question dissolves.**
  Worked instance: strict-vs-strip schema validation — `.strip()` silently
  deletes upstream data, `.passthrough()` silently smuggles untyped data; both
  are signal-suppression shapes. The real failure was schema STALENESS, not
  validation strictness; re-attribution dissolved a 7-week-old open question into
  "keep strict; cure freshness."
  `[captured: 2026-06-04 | source: napkin Moonlit Waxing Nebula 2026-06-03 + Arboreal curation pass
  | target: pdr:dissolution-by-re-attribution | trigger: second dissolution-by-re-attribution
  instance OR owner direction | size: S | status: owner-gated]`

**Cross-experience meta-signal (owner-walk, not a new candidate):** Patterns 2–5
above are facets of one deep structure — *the failure mode hides inside the
surfaces that feel safest* (diligence, inherited authority, the corrective act,
review volume). Separately, the experience corpus has spent ~6 days (2026-05-30
onward) diagnosing its own "naming a lesson does not fire the reflex — only a
mechanical tripwire does" insufficiency (Pattern 1; home:
`patterns/passive-guidance-loses-to-artefact-gravity.md` + the owner-gated
`action-time-structural-interrupt` item). The action-time-structural-interrupt
trigger (cross-session recurrence) is now strongly met — surfaced to owner.

## 2026-06-02 captures — napkin rotation doctrine routes (Shaded Veiling Mirror)

- **Shared-window handoffs should scan for convergence, not only collision.** A
  parallel agent may have produced the dependency or answer your lane needed. At
  handoff, actively look for live peer outputs that answer open questions and wire
  them together, rather than only checking for file conflicts.
  `[captured: 2026-06-02 | source: napkin rotation from Flamebright/Abyssal Q-003 convergence |
  target: session-handoff or agent-collaboration practice amendment | trigger: owner direction or
  second shared-window convergence instance | size: S | status: owner-gated]`
- **No-commit sessions need owner-visible proof for untracked artefacts.** A
  successful file write is evidence to the writing agent but not to the owner if
  the file is untracked and uncommitted. Reports that say "created X" should carry
  path plus current `git status` evidence in no-commit sessions.
  `[captured: 2026-06-02 | source: napkin rotation from graph-tool-output-schemas plan creation |
  target: amend:session-handoff OR verify-dont-trust | trigger: owner direction or second
  owner-invisible untracked artefact incident | size: S | status: owner-gated]`
- **Projection provenance for data-as-source-of-truth work.** A hand-authored
  mirror inside codegen is still a mirror; durable data shapes should be static
  data projected through a type-strict schema boundary, with `satisfies` tying
  the projection to the structured source.
  `[captured: 2026-06-02 | source: distilled.md June 2 projection provenance | target:
  amend:schema-first-execution OR rule:projection-provenance | trigger: owner direction or second
  hand-authored-mirror/codegen drift instance | size: S | status: owner-gated]`
- **Mechanical sweep and broad revert actions need set-level disposition before
  execution.** A broad text sweep or revert can cross generated snapshots,
  immutable records, peer edits, and live prose; state the planned set and
  per-class disposition before action when the set spans more than simple live
  prose.
  `[captured: 2026-06-02 | source: napkin rotation from judgement sweep repair | target:
  rule-or-pattern:mechanical-sweep-set-discipline | trigger: owner direction or next broad
  text-sweep/revert pass | size: M | status: owner-gated]`
- **Dependency refreshes need plan-truth cleanup.** Workspace dependency updates
  can widen beyond the initially named package because shared ranges move
  together; after manifests and lockfiles are current, check current/future plans
  so old dependency-update plans stop advertising completed work.
  `[captured: 2026-06-02 | source: distilled.md June 2 dependency refresh cleanup | target:
  dependency-refresh closeout checklist OR plan-hygiene doctrine | trigger: owner direction or next
  workspace-wide dependency refresh | size: S | status: owner-gated]`

## Register Rule

Legacy recovery files under `.agent/memory/operational/pending-graduations/`
were collapsed back into this file on 2026-05-27 by owner direction. The
substance that still needed a live queue home is preserved below. Processed
source files were deleted after extraction so the repository does not carry
pseudo-shards that hide the true buffer state.

## 2026-05-31 capture — negation-contrast detection enforcement increment

- **A structural detector or output-time review pass for the negation-contrast form
  of tombstoning.** `.agent/rules/no-tombstones-for-removed-ideas.md` is the
  always-applied rule and the write-time innate-immunity hook
  (`.agent/hooks/policy.json`) is the intended hard-enforcement layer, but it can
  carry only a narrow set of high-signal banner literals. The negation-contrast form
  ("X, not Y"; "built fresh, never a bridge") is a *structural* pattern (a negation
  bound to a dead concept), not a fixed literal — a naive block on "never" /
  "rather than" / "instead of" would false-positive unacceptably. The open increment
  is a smarter structural detector or an output-time review pass. The rule's §"Why
  This Rule Is Strict" names this register as the home that tracks the increment.
  `[captured: 2026-05-31 | source: .agent/rules/no-tombstones-for-removed-ideas.md §"Why This Rule
  Is Strict" | target: negation-contrast structural detector OR output-time review pass | trigger:
  owner direction OR a viable low-false-positive detector design | size: M | status: owner-gated]`

## 2026-05-31 captures — agent-tools PreToolUse hooks + scripts→src migration

Captured by Ethereal Weaving Constellation (claude / Opus 4.8 / `1d6645`) during
the hook-fail-open fix + `agent-tools/scripts/` dissolution (commit `1851eed`).
Capture-only; graduation deferred to a future consolidation when triggers fire.

- **PreToolUse safety hooks must run prebuilt artefacts, not `pnpm exec tsx`.**
  `[captured: 2026-05-31 | source: this-session commit 1851eed | target:
  adr:hook-execution-from-prebuilt-artefacts | trigger: second per-tool-call hook
  instance, a new PreToolUse hook, or owner direction | size: S |
  status: owner-gated 2026-06-02 — keep until a second instance, new hook,
  or owner direction fires]`
  Per-call TS recompile (~1-2s) blows the 5s hook timeout under concurrent load
  and the guard then fails OPEN. Cure: invoke `node dist/...` directly; guarantee
  dist via the install lifecycle (postinstall + pre-commit build).

- **Sub-agent verification briefs must mandate the full gate set, not eslint
  alone — "lintClean ≠ gate-clean".**
  `[captured: 2026-05-31 | source: this-session split-workflow agents | target:
  rule-or-pdr:subagent-brief-mandates-full-gate-set (extends
  validate-specialist-findings-before-acting) | trigger: second instance of an
  agent passing one gate while failing another, or owner direction | size: S |
  status: owner-gated 2026-06-02 — keep until recurrence or owner direction]`
  Split agents wrote compact code that passed eslint but failed Prettier; the
  format pass then un-compacted it over `max-lines`. The cure for over-cap is
  responsibility-based splitting, never compaction.

- **Relocating tsx-invoked entry points silently breaks knip's entry config.**
  `[captured: 2026-05-31 | source: this-session knip failure | target:
  pattern:knip-entry-config-tracks-entry-point-moves | trigger: second
  entry-point relocation that breaks knip, or owner direction | size: S |
  status: owner-gated 2026-06-02 — keep until recurrence or owner direction]`
  knip `entry` globs pointed at the old `scripts/`; moving entries to `src/` made
  the whole dependency graph read as unused. Update `knip.config.ts` entry list
  on any entry-point relocation.

## 2026-05-31 captures — source-buffer gates from napkin/distilled processing

Captured by Eclipsed Stealing Raven (codex / GPT-5 / `019e7d`) during the
dedicated source-buffer consolidation pass and repaired by Open Lofting Cliff
after owner correction. These items remain owner-gated pending real promotion;
active napkin / distilled content was restored, so this section is not evidence
that the source buffers were validly drained.

- **Verification sweeps must not exclude the class under test.**
  `[captured: 2026-05-31 | source: napkin 2026-05-30 readiness review |
  target: rule-or-pattern:complete-sweep-without-negative-target-filter |
  trigger: second sweep false-negative caused by an exclusion filter or owner
  direction — SECOND INSTANCE 2026-06-09 (the -v .test.ts grep that hid a real
  seventh importer, napkin Fragrant entry) | size: S | status: owner-gated —
  the verify-your-own-verification clause is RATIFIED and landed in
  verify-dont-trust (owner ~07:43Z 2026-06-11, events 57d32eb1/c13f2e2b); this
  item stays per Director direction for its residual facet, the dedicated
  complete-sweep rule-or-pattern]`
  The candidate is the concrete failure mode where a search/audit appears clean
  because the command filtered away the very class it meant to inspect.
- **Find the falsifying fact before product surgery.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Twilit entry |
  target: pattern:falsifying-fact-before-remediation-surgery |
  trigger: second strict-refactor or product-remediation instance or owner
  direction | size: S | status: owner-gated]`
  This is the diagnostic counterpart to "recorded verdict is a claim to test":
  locate the fact that would break the proposed repair before editing around the
  inherited story.
- **Plan narrative sections drift from working artefacts.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Twilit entry |
  target: plan-hygiene-or-rule:working-artefacts-outrank-plan-narrative |
  trigger: second plan-body drift instance after a working artefact proves a
  different state or owner direction | size: S | status: owner-gated]`
  The current evidence is strong but overlaps with propagation doctrine; keep it
  gated until another instance proves it needs a separate home.
- **Anti-abuse validators are tripwires, not adversarial guarantees.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Tempestuous entry |
  target: sonar-disposition-or-validator-doctrine |
  trigger: second validator false-confidence instance or owner direction |
  size: S | status: owner-gated]`
  Preserve for a future quality-signal doctrine pass; do not graduate from one
  worked instance.
- **Verify-the-auditor needs asymmetric bias for irreversible withdrawal.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Tempestuous entry |
  target: amend:consolidate-docs-or-verify-auditor-doctrine |
  trigger: second high-cost withdrawal where false negatives and false
  positives have asymmetric harm, or owner direction | size: S |
  status: owner-gated]`
  This extends the existing verification-audit lesson; it is gated because the
  current home may only need an amendment rather than a new rule.
- **Watcher verification and filter-loss failures.**
  `[captured: 2026-05-31 | source: napkin 2026-05-29 Shaded + Highland entries |
  target: dedicated-comms-research-plan |
  trigger: comms research plan opens or owner direction | size: M |
  status: owner-gated]`
  Comms-event rotation is paused, but the evidence belongs in the eventual
  comms research plan rather than active napkin prose.
- **Feature flags must gate every naming surface through the real env path.**
  `[captured: 2026-05-31 | source: distilled 2026-05-29 Quiet entry |
  target: product-engineering-pattern:dark-launch-surface-enumeration |
  trigger: second flag-gated feature or owner direction | size: S |
  status: owner-gated]`
  The evidence is high-signal but product-pattern shaped; keep it gated until
  another feature or owner decision asks for a durable pattern.
- **Fixed canonical data is authority; derive, do not validate.**
  `[captured: 2026-05-31 | source: distilled 2026-05-29 Radiant entry |
  target: eef-graph-tooling-doctrine-or-typescript-practice |
  trigger: EEF D3/D4 contract ratification, second fixed-corpus instance, or
  owner direction | size: M | status: owner-gated]`
  This overlaps with EEF graph-tooling and TypeScript practice; avoid a new
  doctrine until the live contract proves the reusable shape.
- **Read the primary artefact before machinery or reviewers.**
  `[captured: 2026-05-31 | source: distilled 2026-05-29 Radiant entry |
  target: grounding-or-reviewer-doctrine-amendment |
  trigger: second reviewer/frame miss cured by reading the primary artefact or
  owner direction | size: S | status: owner-gated]`
  Preserve the behavioural lesson without expanding the always-read layer before
  a second instance or owner ratification.

## 2026-05-31 distilled continuation gates

Processed by Foamy Charting Harbour (codex / GPT-5 / `019e7d`) while continuing
the repaired dedicated docs consolidation pass. These items were removed from
`distilled.md` only after a durable route was verified here or in an existing
home.

- **Substrate alignment is Practice design, not prose reinforcement.**
  `[captured: 2026-05-31 | source: distilled 2026-05-25..26 / historical synthesis A2 |
  target: pdr:substrate-alignment-as-practice-design |
  trigger: owner direction or next Practice-Core substrate-design pass |
  size: M | status: owner-gated]`
  The candidate says Done-When fields, heartbeat templates, skill success
  criteria, and rules must encode the intended outcome. It is gated because the
  existing PDR-038 / PDR-046 / PDR-089 family may be the right amendment home.
- **Multi-agent auto-fix requires peer-file awareness.**
  `[captured: 2026-05-31 | source: distilled 2026-05-25 / historical synthesis B3 |
  target: rule-or-pattern:multi-agent-auto-fix-requires-peer-file-check |
  trigger: second repo-wide autofix sweep incident after the 2026-05-25 Hushed
  instance or owner direction | size: S | status: owner-gated]`
  Single-agent repo-wide autofix is normal; the pending decision is whether
  multi-agent windows need an always-loaded pre-autofix peer-file check.
- **Long gate runs require a fresh post-gate git status.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 Codex / historical synthesis B5 |
  target: session-handoff-or-rule:post-long-gate-status-refresh |
  trigger: second false-clean closeout after a long gate run or owner direction |
  size: S | status: owner-gated]`
  The candidate is a narrow closeout hygiene rule: after any long aggregate gate,
  rerun `git status --short` before claiming tree-clean or writing handoff state.
- **ADR status must match implementation maturity.**
  `[captured: 2026-05-31 | source: distilled 2026-05-25 / historical synthesis D3 |
  target: adr-template-or-docs-adr-rule:status-matches-maturity |
  trigger: next ADR/PDR paired-status review or owner direction |
  size: S | status: owner-gated]`
  The reusable rule is that `Accepted` means decided and validated; when the
  paired PDR is still Candidate or implementation is explicitly deferred, the ADR
  should remain Proposed unless the owner ratifies the maturity mismatch.

## 2026-05-31 distilled final gates

Processed by Foamy Charting Harbour (codex / GPT-5 / `019e7d`) as the second
continuation batch on the restored active `distilled.md` buffer. These items are
removed from `distilled.md` only because they now have explicit owner-gated
routes here or duplicate homes named in the curator ledger.

- **Recorded verdicts are claims to test, not frames to inherit.**
  `[captured: 2026-05-31 | source: distilled 2026-05-29 Pelagic entry |
  target: evaluator-grounding-or-continuity-doctrine |
  trigger: second evaluation task that inherits a stale diagnosis as its frame,
  or owner direction | size: S | status: owner-gated — partially covered by
  verify-dont-trust §Status-surfaces-are-pointers plus the landed
  verify-your-own-verification clause; the frames/meaning facet keeps its own
  second-instance gate (Director adjudication 08d5c8b7)]`
  The candidate extends verify-dont-trust from artefacts to evaluation frames:
  verify existence against code/git, but verify meaning, role, and verdict
  before letting continuity prose define the question.
- **Merge and divergence risk must be content-derived.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 Sylvan entry |
  target: git-collaboration-rule:content-derived-merge-risk |
  trigger: second raw-name-status false-conflict prediction or owner direction |
  size: S | status: owner-gated (verified 2026-06-04 NOT covered: pre-merge-divergence-analysis.md
  governs complex-merge handling, not the content-derived risk-assessment doctrine; stays gated — do
  not withdraw)]`
  The reusable move is to prove risk from the merge algorithm or an empty content
  diff, not from raw `HEAD..origin` name-status output.
- **Collaboration state is source material, not durable memory.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 Solar entry |
  target: collaboration-state-lifecycle-or-comms-research-plan |
  trigger: comms/state lifecycle research plan execution or owner direction |
  size: S | status: owner-gated]`
  State files may be preserved inside an explicit research window, but otherwise
  useful knowledge should be routed into memory/docs/plans and the state surface
  should not become long-term storage.
- **Production reachability is deployed registration, not SDK definition.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 EEF registration entry |
  target: mcp-registration-or-product-reachability-pattern |
  trigger: second SDK-defined-but-app-unregistered surface or owner direction |
  size: S | status: owner-gated]`
  The reusable rule is to test the deployed registration path before calling a
  prompt/tool/resource live in production.
- **Delegate by judgement load, not by available parallelism.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 delegation entry |
  target: agent-collaboration-or-reviewer-delegation-doctrine |
  trigger: second boundary-sensitive delegated edit that plants a false claim,
  or owner direction | size: S | status: owner-gated]`
  Mechanical edits can parallelise; subtle correctness boundaries stay with the
  agent that understands the boundary unless the delegation brief names it
  precisely.
- **Closeout verdicts require live plan-acceptance evidence.**
  `[captured: 2026-05-31 | source: distilled 2026-05-27 Codex / historical synthesis D2 |
  target: session-handoff-or-definition-of-delivery:truthful-closeout-language |
  trigger: next closeout-doctrine pass or owner direction | size: S |
  status: owner-gated]`
  Documentation closeout, handoff wording, and useful slices are not completion
  proof. The durable rule should force verdict words to match live acceptance
  evidence.

## 2026-05-28 captures — EEF graph-tooling rebuild

Surfaced by Deep Fathoming Harbour (claude / claude-opus-4-7) during the EEF
wrong-shape diagnosis. (The originating design docs were quarantined to `archive/`
2026-05-30 as superseded broken-concept work; the substance to graduate is captured
below, independent of them.)

- **Proportionate exploration — raising a question is fine; the expenditure is the failure.**
  - captured-date: 2026-05-28
  - source-surface: owner correction 2026-05-28 — "it's always fine to raise a
    question, the problem was the amount of time, effort, tokens and distraction
    spent on it" (per-user memory `proportionate-exploration`; napkin 2026-05-28)
  - graduation-target: amend `principles.md` §"Keep it strict" or a rule sibling
    to `present-verdicts-not-menus` — the existing "don't invent optionality"
    principle was VIOLATED this session under the "holding-open / robustness"
    costume; the refinement is proportionality of exploratory questioning (flag in
    a sentence with a default, then move on) + costume-awareness
  - trigger-condition: second instance or owner-direction (one-session lesson;
    needs stability before graduating)
  - status: owner-gated 2026-06-02. Reviewed 2026-05-31 by Open Lofting Cliff:
    carried forward; no second instance or direct owner promotion found in the
    selected docs surfaces.

## Extracted Recovery-File Disposition Ledger

- `pending-graduations/owner-gated.md`: moved back into this canonical
  register below as the owner-gated section.
- `pending-graduations/2026-05-06-to-2026-05-21-legacy-backlog.md`: retained
  legacy backlog drain window had item-level dispositions through batch 27:
  `67` total dispositions, `33 duplicate`, `34 owner-gated`. The remaining
  unresolved items are now in the owner-gated section below.
- `pending-graduations/2026-05-23-team-session-autonomy.md`: processed file;
  graduated liveness heartbeat, heartbeat-content state-binding, and
  ping-before-escalate substance already live in their durable homes. No live
  queue items remained.
- `pending-graduations/2026-05-24-napkin-tail-candidates.md`: processed file;
  disposition evidence lives in
  `curator-passes/2026-05-27-airy-napkin-tail-owner-gates.md`; unresolved
  decisions are in the owner-gated section below.
- `pending-graduations/2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md`:
  processed file; ship-independent-coordinate-dependent graduated to rule and
  adapters, and the n=2 coordination-efficiency decision is in the owner-gated
  section below.
- `pending-graduations/2026-05-25-mistbound-inherited-frame-and-hook-signal-candidates.md`,
  `2026-05-25-misty-director-session-candidates.md`,
  `2026-05-25-planning-and-autofix-candidates.md`,
  `2026-05-26-feathered-torrid-n2-cycle-1-candidates.md`,
  `2026-05-26-starless-open-closeout-candidates.md`, and
  `2026-05-27-distilled-hard-drain-candidates.md`: ready-empty files with no
  content after frontmatter at collapse time; no knowledge remained to extract.
- `pending-graduations/README.md`: instruction content superseded by this
  register rule.

## Owner-Gated Pending Graduations

Processed items in this file already received a curation disposition. The
remaining action is a user decision: graduate now, keep the watch live,
withdraw, or route to an explicitly named implementation lane.

**Re-verification status (2026-05-29, Tempestuous Vaulting Falcon).** The Sunlit
ledger's Group C "recommend withdraw" verdicts were re-verified adversarially
against the live repo. 15 of 18 were wrong (the named coverage home did not
contain the substance) and are **kept**; 3 were confirmed genuinely covered /
thin-no-signal-lost and **withdrawn** (recurrence-rank weighting; napkin +
`.remember/` PDR-011 amendment; owner-authorised redundant-config marker).
Per-item verdicts and evidence:
[`curator-passes/2026-05-29-tempestuous-vaulting-falcon.md`](curator-passes/2026-05-29-tempestuous-vaulting-falcon.md).
The Group C dispositions in the Sunlit ledger are superseded by that pass.

Total live owner-gated items: 56.

## Legacy Backlog Gates

- 2026-05-22; **Intent notes as abandonment coordination**.
  `[captured: 2026-05-22 | source: Stormbound intent abandonment | target:
  pattern:intent-notes-for-abandonment-rationale | trigger: second peer-abandonment instance or
  owner-direction | size: S | status: owner-gated]`
  The commit workflow now preserves automated abandon-notes for failure
  surfaces, but the reusable peer-coordination pattern is narrower: an agent
  voluntarily abandons a queued intent and writes a substantive explanation in
  the queue record so later committers see the reason at the surface they must
  already read. Owner gate: keep watching for a second peer-abandonment instance,
  promote the pattern now, or withdraw because automated abandon-notes and
  intent-scoped commit workflow are sufficient.
- 2026-05-22; **More-restrictive Practice rule wins on reviewer conflict**.
  `[captured: 2026-05-22 | source: t12 reviewer conflict | target:
  pattern:more-restrictive-practice-rule-wins | trigger: second mandatory-reviewer conflict or
  owner-direction | size: S | status: owner-gated]`
  `different-lens-reviewer-divergence.md` covers why divergent findings are
  useful, and reciprocal-reviewer dispatch now names principle-based conflict
  resolution as the expected move. No standalone rule/pattern currently settles
  the narrower resolution doctrine. Owner gate: promote this as its own pattern,
  fold it into the existing divergence pattern, keep watching, or withdraw.
- 2026-05-12; **Deferral with retrospective-review tripwire**.
  `[captured: 2026-05-12 | source: graph-stack Inc.1a V3 deferral | target:
  rule-or-pdr:defer-with-binding-retrospective-review | trigger:
  owner-direction-or-second-cross-increment-deferral | size: S | status: owner-gated]`
  The Inc.2 GraphDocument deferral is preserved in the active graph-stack plan
  and connecting-oak-resources thread record, including the named surfaces and
  binding review criteria. The remaining decision is whether to codify this as
  general deferral doctrine, keep it scoped to the graph-stack plan, or withdraw
  the reusable candidate.
- 2026-05-19; **Portable reference arrives without plan slot**.
  `[captured: 2026-05-19 | source: comms-watch-mechanism reference arrival | target:
  pattern:portable-reference-integration-grounding | trigger: second instance or owner-direction |
  size: S | status: owner-gated]`
  The `comms-watch-mechanism` reference has since acquired multiple concrete
  homes and workstream routes, but the reusable three-question grounding pattern
  is still a one-instance watch. Owner gate: keep watching for a second portable
  reference without an owning plan, promote the grounding pattern now, or
  withdraw it as a local recovery tactic.
- 2026-05-12; **E-1/E-2 advisory hooks and agent-tools git passthrough**.
  `[captured: 2026-05-12 | source: cost-of-collaboration-exploration | target:
  scoping-pass-or-cost-of-collaboration-workstream | trigger:
  owner-direction-or-decision-complete-scoping | size: L | status: owner-gated]`
  Advisory agent hooks and an `agent-tools git` passthrough may compose into a
  single post-P-Foundation workstream, but the exploration is not yet
  decision-complete. The remaining decision is whether to run the scoping pass,
  keep the exploration parked under cost-of-collaboration, or withdraw.
- 2026-05-12; **Agent-tools CLI architectural decision extraction**.
  `[captured: 2026-05-12 | source: cost-of-collaboration-p-foundation | target:
  adr:agent-tools-cli-unified-entrypoint+rule:no-new-bins | trigger:
  owner-direction-or-retrospective-confirms-doctrine | size: XL | status: owner-gated]`
  P-Foundation landed the unified entrypoint / build-once CLI architecture,
  but no separate ADR or no-new-bins rule extraction was found in this pass.
  The remaining decision is whether to author that ADR/rule now, keep a
  retrospective watch, or withdraw because the plan and implementation are
  enough.
- 2026-05-10; **Generated insight artefact decay/honesty discipline**.
  `[captured: 2026-05-10 | source: insight-report-2026-05-10 | target:
  pattern:generated-insight-artefact-discipline-or-rule:no-moving-targets-amendment | trigger:
  owner-direction-or-second-generated-insight-artefact | size: S | status: owner-gated]`
  A generated insight artefact proposed a cadence-vs-friction decay split and
  evidence-vs-interpretation honesty discipline. The remaining decision is
  whether to graduate that method now, keep watching for a second generated
  artefact, or withdraw because existing no-moving-targets and honest
  documentation doctrine is enough.
- 2026-05-10; **Owner reply preferences and default reply shape**.
  `[captured: 2026-05-10 | source: insight-report-2026-05-10 | target:
  user-collaboration-or-pattern:owner-reply-shape | trigger: owner-direction-or-second-regeneration
  | size: S | status: owner-gated]`
  The insight report proposed compact reply preferences plus a default shape
  ("lead with answer" and concise evidence/next-step structure). The remaining
  decision is whether to amend `user-collaboration.md`, keep watching, or
  withdraw because the existing Working Model is enough.
- 2026-05-10; **Owner affirmation phrase corpus**.
  `[captured: 2026-05-10 | source: insight-report-2026-05-10+owner-course-correct-vocabulary |
  target: pattern:owner-affirmation-vocabulary | trigger: owner-direction-or-second-regeneration |
  size: S | status: owner-gated]`
  Affirmation phrases such as "exactly", "great", and "perfect" may calibrate
  agent confidence without acting as re-grounding triggers. The remaining
  decision is whether to graduate a companion pattern now, keep watching for a
  second corroborating regeneration, or withdraw because the existing
  course-correct pattern note is enough.
- 2026-05-05-06; **Cross-thread git-history as observable coordination
  signal**.
  `[captured: 2026-05-05-06 | source: legacy-backlog+riverine-comms-surprise | target:
  pdr-027-thread-scope-or-distilled-agent-coordination | trigger:
  owner-direction-or-second-cross-thread-git-history-adaptation | size: S | status: owner-gated]`
  A peer on another thread correctly adapted after observing the local branch
  head advance, then re-ran verification against the new SHA without a direct
  comms exchange. The remaining decision is whether to amend PDR-027 or
  distilled coordination guidance now, keep watching for another git-history
  substrate adaptation, or withdraw because existing shared-substrate doctrine
  is sufficient.
- 2026-05-05-06; **In-flight consolidation workflow-gap patching**.
  `[captured: 2026-05-05-06 | source: legacy-backlog+riverine-comms-surprise | target:
  pdr-014-amendment-or-distilled-process | trigger:
  owner-direction-or-second-in-session-workflow-gap-patch | size: S | status: owner-gated]`
  A consolidation session patched a directly relevant `session-handoff` workflow
  gap in the same session that exposed it, rather than deferring by default.
  The remaining decision is whether to promote the consolidation-boundary
  refinement now, keep watching for a second reviewed in-session workflow patch,
  or withdraw as already covered by PDR-014/PDR-046.
- 2026-05-05-06; **Fat-baton handoff inline diagnostics**.
  `[captured: 2026-05-05-06 | source: legacy-backlog+riverine-comms-surprise | target:
  pattern:fat-baton-handoff-inline-diagnostic | trigger:
  owner-direction-or-second-named-receiver-diagnostic-handoff | size: S | status: owner-gated]`
  A named-receiver handoff inlined ephemeral `practice:fitness:strict-hard`
  diagnostic output so the receiver did not need to rerun it before intake.
  The remaining decision is whether to graduate the pattern now, keep watching
  for a second named-receiver diagnostic handoff, or withdraw because PDR-048
  and PDR-046 already carry enough capture-at-the-moment guidance.
- 2026-04-29; **Trinity Active Principles and bootstrap structural
  extensions**.
  `[captured: 2026-04-29 | source: legacy-backlog+trinity-drift-report | target:
  core:practice+practice-lineage+practice-bootstrap+practice-verification | trigger:
  owner-approval-for-core-amendments | size: M | status: owner-gated]`
  Several 2026-04-29 doctrine sharpenings have durable homes in PDRs, rules,
  and practice-lineage, but the proposed amendments still touch dense Practice
  Core trinity and verification surfaces. Per consolidate-docs step 8, the
  remaining decision is owner-approved Core amendment shape: land the trinity
  updates now, keep the healthy-lag watch live, or withdraw because the
  existing PDR/rule homes are sufficient.
- 2026-04-29; **Open up the value early PDR decision**.
  `[captured: 2026-04-29 | source: legacy-backlog | target: pdr:open-up-the-value-early | trigger:
  owner-direction-or-fourth-cross-session-instance | size: S | status: owner-gated]`
  The experience-text pattern says extra work is justified inside the current
  arc when it closes a coordination gap the surrounding decisions would
  otherwise ship with. The remaining decision is whether to graduate this
  strategic test into a PDR now, keep watching for another cross-session
  instance, or withdraw because the named experience files are sufficient.
- 2026-04-29; **Agent-infrastructure failure visibility Practice Core
  promotion**.
  `[captured: 2026-04-29 | source: legacy-backlog | target:
  pdr:hook-failures-must-be-observable-or-practice-core-contract | trigger:
  owner-direction-or-second-platform-thin-wrapper | size: S | status: owner-gated]`
  ADR-167 already carries the concrete host-local rule: non-blocking
  agentic-platform hook failures must be observable in a developer-readable
  failure channel. The unresolved decision is whether to extract that into a
  portable Practice Core PDR now, keep watching for a second platform
  implementation that needs the same thin-wrapper contract, or withdraw because
  ADR-167 plus `hook-as-question-not-obstacle` covers the current operational
  risk.
- 2026-05-21; **Sync-kind / urgency flag in comms schema (ADR candidate)**.
  `[captured: 2026-05-21 | source: owner-direction+agent-tools-cli-landing | target:
  adr:184+implementation-tranches | trigger: implementation-lands | size: S | status: owner-gated]`
  **ADR-184 slice processed 2026-05-24**:
  [ADR-184](../../../../docs/architecture/architectural-decisions/184-comms-event-sync-kind-and-urgency-field.md)
  is Proposed and resolves the representation decision: `sync` is the
  interaction-shape axis and `urgency` is the response-priority axis.
  The live residual is the implementation tranche set ADR-184 names:
  schema/parser migration, CLI rendering, authoring/enforcement, and
  activation.

  Route-state rechecked 2026-05-24 by Pelagic Snorkelling Sextant under claim
  `b92377f8-d305-465c-8303-a961924d1c6d`: the implementation trigger has
  not fired. The current comms schema still enumerates narrative, lifecycle,
  and directed event kinds without `sync`; the current collaboration-state
  parser/rendering surfaces still treat `sync` / `urgency` as ADR-planned
  work rather than supported event protocol. Keep this residual live until
  the schema, parser, renderer, authoring commands, and activation notes land.
- 2026-05-13; **Coordinator role-label ontology residual**
  `[captured: 2026-05-13 | source: napkin+napkin-archive+historical-synthesis | target:
  pdr:pressure-to-role-mapping-protocol-or-persistent-role-labels | trigger:
  p1-falsification-evidence+owner-direction | size: S | status: owner-gated]`
  **PDR-071 slice processed 2026-05-24**:
  [PDR-071](../../../practice-core/decision-records/PDR-071-coordinator-allocates-without-gating.md)
  is Proposed and now carries the durable coordinator allocation vs
  gating principle. The live residual is narrower: do not graduate a
  fixed role-label ontology until the start-right-team experiment has
  accumulated **N≥3 multi-agent sessions** across at least two
  thread/work-shape contexts, and
  [P1 criteria](../../../prompts/agentic-engineering/collaboration/falsification-criteria.md#p1--modes-not-roles)
  show either that role labels remain bounded to live pressure or that
  specific labels consistently re-emerge across changing pressure shapes.
  Owner direction remains a co-trigger. Observations land in `napkin.md`
  tagged with the experiment ID and affected primitive; the next
  consolidation pass then graduates a pressure-to-role mapping protocol,
  graduates empirically persistent labels, reframes the candidate, or
  removes it.
- 2026-05-12; **Commit-boundary peer-pair governance refinements**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target:
  multi:pdr:commit-window-coordination+rule:stage-by-explicit-pathspec+skill:commit | trigger:
  n>=3-validation+owner-direction | size: L | status: owner-gated]`
  The 2026-05-12 peer-triple/dispatcher window produced a coherent
  commit-boundary governance bundle. Landed during this distilled-stage pass:
  peer-pair review is not peer-pair commit authorship (`agent-collaboration.md`);
  current-session memory/state should land or be named as residue while
  peer-session state is
  not default-includable (`agent-collaboration.md` with a cross-reference to
  `respect-active-agent-claims.md`); queue intents are exact file-list
  contracts (`commit/SKILL-CANONICAL.md`); new durable files require claim
  expansion before further edits (`respect-active-agent-claims.md`).
  Still pending: gatekeeper GO needs the named gate's evidence; unify that with
  the landed clauses, PDR-054/PDR-059/ADR-177, and the live commit-skill
  protocol after the collaboration hardening tail has another validation pass,
  so the PDR/ADR layer carries the complete three-direction commit-boundary
  model without hiding the in-session promotions already made.
- 2026-05-12; **Skill and documentation surface audit follow-ups**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target:
  multi:plan:skills-audit+doc-amend:AGENT-practice-index | trigger: plan-execution-gated | size: M |
  status: owner-gated]`
  The skill-audit lessons are mostly workflow-maintenance backlog rather than
  PDR-shaped doctrine. Candidate checks: canonical skill bodies are the review
  target and wrappers remain pointers; command-topology drift should be audited
  for retired command paths, retired adapter paths, mutating proof commands,
  and stale workspace CLI invocations; redundant workflow skills should retire
  into always-fired homes; parallel-agent decomposition is plan hygiene rather
  than a narrow skill; guidance methodologies are not automatically skills;
  portability validation failures found during docs work are real
  infrastructure findings and should be fixed.
- 2026-05-07; **fitness limits encode an implicit access-rhythm
  theory; recalibration must name the lifecycle, not just bump
  numbers** (Pelagic Rolling Harbour, owner-direction reframe of
  the pending-graduations HARD-persists framing).
  `[captured: 2026-05-07 | source: owner-direction | target:
  multi:doc-amend:fitness-validator-doc+pdr:fitness-lifecycle-axis | trigger: second-instance |
  size: M | status: owner-gated]`
  I had
  treated the persisting HARD on this register as a load-bearing
  signal and surfaced three response options (enlarge / split /
  cadence) as "owner direction". Owner reframed: the limit was
  arbitrarily calibrated against a frame that doesn't fit this
  file's lifecycle. `principles.md` is loaded every session by
  every agent — small *is* the quality signal. This register is
  accessed at consolidation passes only and grows with cross-
  session-wait substance — its limits should reflect a queue
  lifecycle, not a permanent-doc shape. The deeper insight:
  every fitness-tracked file implicitly encodes an access-rhythm
  theory in its limit shape; the schema should make that explicit
  so recalibration is principled rather than ad-hoc. Source-
  surface: this session's owner-direction turn after the
  2026-05-07 dedicated drain.
  Graduation-target: (a) extend the fitness validator and/or its
  documentation in `scripts/validate-practice-fitness.ts` and the
  ADR-144 narrative to name `lifecycle_model` and `access_pattern`
  as recommended (or required) frontmatter fields with a closed
  vocabulary (`loaded-every-session` / `read-on-demand` /
  `consolidation-pass-only` / `archive-only`); (b) sweep existing
  fitness-tracked files to declare their access pattern; (c) PDR
  capturing the doctrine ("limits encode access-rhythm theory")
  if it generalises across Practice-bearing repos. Trigger:
  second instance OR owner direction at promotion. The first
  instance is this session's recalibration. Status: owner-gated —
  capture to honour the moment per PDR-048 (insight capture at
  moment of occurrence); promotion when accumulation or owner
  direction warrants. **Cross-reference (2026-05-09)**:
  historical-napkin-synthesis confirms the recurrence of fitness-as-trim
  impulse across three corpus-window instances and identifies this
  lifecycle-aware-fitness recalibration as one of two structural cures
  (sibling cure: active inline discipline-reminder text in fitness output
  at non-healthy zones — separate entry below). Source:
  [`historical-napkin-synthesis-2026-05-09.md`](../../../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F1.

  **Curation note (2026-05-23)**: retained pending as a partial
  graduation rather than archived. This register's own frontmatter now
  declares `lifecycle_model`, `access_pattern`, and `fitness_rationale`,
  proving the local cure for this file. ADR-144 currently records the
  non-reactive output reminder but does not yet generalise access rhythm
  as a named fitness-axis doctrine or recommend the lifecycle fields for
  other governed files; PDR-067/PDR-068 cover adjacent surface-kind and
  back-pressure doctrine, not the actual access-rhythm schema. Owner
  decision received 2026-05-23: this is both a governed model concept
  and portable Practice doctrine. Next action: ADR-144 / fitness-validator
  docs and tool schema first, plus a sweep of governed files, then a
  portable PDR. Disposition 2026-05-27: owner-gated; this remains an
  owner-routed implementation lane, not a narrow recovery-file drain.
- 2026-05-03; **session-close housekeeping ownership** (Woodland
  Sprouting Glade + Prismatic Illuminating Eclipse parallel-lane
  session, owner-stated experiment observation): at session-close some
  housekeeping is **agent-specific** (own observations in napkin,
  identity-row last_session, claim close, subjective experience file)
  and can ONLY be done by the originating agent — no other agent has
  the in-memory context. Other housekeeping is **NOT agent-specific**
  (refresh repo-continuity.md, refresh pending-graduations register,
  sweep platform entry points, commit prior-session leftover continuity
  files, run consolidation gate) — any agent could do it, which means
  without explicit ownership none of them does and work is lost or
  stale. **Cure shape**: when an Orchestrator role is assigned for a
  session, the Orchestrator owns shared / not-agent-specific
  housekeeping. When no Orchestrator is assigned, the
  **last-to-leave** rule applies (final committing agent picks up the
  shared housekeeping). Agent-specific housekeeping remains the
  originating agent's responsibility regardless. **First instance
  (live)**: this 2026-05-03 handoff — the prior Pelagic session ended
  with five continuity files modified-but-uncommitted; without the
  rule, every subsequent agent assumed someone else owned them. Owner
  direction at session-handoff fixed it. Source-surface: napkin §"E1
  Parallel two-agent execution" 2026-05-03 + experiment-plan §P11
  candidate; graduation-target: P11 in N-agent collaboration
  hypothesis (`hypothesis.md`) plus a Practice-Core PDR amendment to
  PDR-018 (Planning discipline) or a new dedicated PDR if the cure
  shape stabilises across N≥3; trigger-condition: validation across
  N≥3 sessions with no falsifying observation. Status: owner-gated —
  owner decision needed to promote, keep the N>=3 watch live, or withdraw.
- 2026-05-02; observability multi-sink + fixtures plan WS0 —
  near-miss surprise: almost spawned a duplicate
  `cross-app-distributed-tracing-mcp-and-search-cli.plan.md` stub
  before checking the existing `future/` directory; caught when
  listing during WS0 promotion. Trigger: second instance of new-plan-
  stub-spawn-without-future-survey; graduation target: distilled.md
  § Process entry naming "directory survey before plan-stub spawning"
  OR amendment to `consolidate-at-third-consumer.md`; status: owner-gated
  2026-06-02 (single instance; capture-only until second instance accumulates).
  **Curation disposition (2026-05-27)**: owner-gated. No second
  plan-stub-survey instance was found in durable surfaces. Owner decision
  needed: promote a directory-survey-before-plan-stub rule now, keep the
  watch live, or withdraw it until recurrence.
- 2026-05-03; **atomic, independent cycles for optional
  parallel-agent dispatch** — new planning discipline landed this
  session in `.agent/commands/plan.md` requirement 3,
  `.agent/plans/templates/components/tdd-phases.md`
  §"Atomic, independent cycles for parallel dispatch", and
  `.agent/plans/templates/feature-workstream-template.md` §"Cycle
  Dependencies and Parallelisation". Substance: where the work
  shape allows, cycles should be made independent of each other
  (separate file scopes, executable acceptance, self-contained
  briefs) so each can be handed to a parallel agent without
  mid-work coordination. Declared via optional `depends_on: []`
  field on the YAML todo plus prose markers in the cycle body
  (Parallel-safety, Starting state, File scope, File scope NOT
  to touch). Plan-author discipline: do not invent serial
  dependencies the work shape does not require. Trigger: second
  Practice-bearing repo adopts the same discipline OR owner
  direction. Status: owner-gated (single-instance — graduates as a
  PDR candidate when N≥2 host repos pick it up, or when owner
  directs). Captured: 2026-05-03 (Lush Spreading Seed). Source
  surface: this session's plan-template restructure following
  the TDD-as-pairs landing. Graduation target: a new PDR in
  `.agent/practice-core/decision-records/` covering atomic
  cycles + dependency declaration + parallel dispatch as a
  portable Practice-governance principle, with this repo's
  adoption already evidenced in the planning-template surfaces.
  **Curation disposition (2026-05-27)**: owner-gated. Host-local
  adoption is already live in the plan-template surfaces; portable
  Practice-Core promotion still needs owner direction or a second
  Practice-bearing repo adoption instance.
- 2026-04-25; multi-agent protocol WS architecture; pattern candidate
  `operational-seed-per-workstream`; trigger: second protocol-plan
  instance or owner direction; status: owner-gated. No second
  protocol-plan instance was found, and the workstream-brief surface has
  since been retired into thread/lane state. Owner decision needed to
  promote a refreshed thread/lane vocabulary version into plan practice,
  keep watching, or withdraw.
- 2026-04-25; collaboration protocol self-application evidence;
  `infrastructure-alive-at-install`; trigger: one instance from a
  different lane or owner direction; status: owner-gated. Existing
  PDR-029 self-application doctrine overlaps, but the narrower sibling
  pattern still lacks different-lane evidence. Owner decision needed to
  graduate it now or keep the archived evidence as sufficient until a
  different-lane instance appears.
- 2026-04-26; observability validation correction; alignment check
  before per-system claim validation; trigger: second skipped-alignment
  instance or owner direction; status: owner-gated. The archived napkin
  evidence preserves the checklist and failure mode; no second
  skipped-alignment instance was found. Owner decision needed to promote,
  keep watching, or withdraw.

## Team Autonomy Gates

### Autonomy substrate gap: first-out-closeout-owner self-election protocol

`[CANDIDATE: first-out-closeout-owner-self-election-protocol | captured: 2026-05-23 | source:
napkin+comms-log+owner-direction | target:
doc-amend:.agent/skills/start-right-team/SKILL-CANONICAL.md | trigger: candidate | size: M | status:
owner-gated]`

Owner correction at 06:54Z + 06:57Z (codified to per-user memory as
`feedback_owner_action_is_not_a_cure`): *"owner action is not a valid
cure for anything, we are working towards agent autonomy here, and
for now user resolution is sometimes required, but it is not the end
goal."* Every observation of the form *"X failed → owner directed Y →
Y worked → therefore Y is the cure"* points instead at *"X failed →
autonomy substrate did not provide the primitive that would have
produced Y → owner bridged the gap → the bridge itself indicates the
missing autonomy primitive."*

**Worked instance from this session**: the 2026-05-22 → 2026-05-23
team session ran with NO closeout owner declared at team-start. As
the team wound down (Foamy paused; Sparking session-complete; Velvet
idle; Stormbounds silent then briefly active), there was no agent-
readable mechanism for the team to self-elect a first-out closeout
owner. Owner intervention named me (SVW) as the first-out closeout
owner. That naming was the bridge over a missing autonomy primitive.

**The missing primitive** (graduation-target): an amendment to
`start-right-team` §Closeout Contract giving agents a clear protocol
for self-electing the first-out closeout owner when none was named
at team-start. Candidate shapes for the SKILL amendment (do not pick
prematurely; the right shape needs design work):

1. **Broadcast-arrival precedence**: the first agent to announce
   intent-to-close in comms holds the first-out role (with tie-breaking).
2. **Pre-handoff-synthesis precedence**: the agent whose
   pre-handoff-synthesis broadcast has the earliest `created_at`
   timestamp self-elects once N team members have also posted
   pre-handoff syntheses. Builds on the empirical pre-handoff-
   syntheses pattern observed this session.
3. **Coordinator-poll**: if a coordinator was named at team-start,
   they retain closeout-owner naming authority on stand-down; if
   none, fall back to a precedence rule.
4. **Explicit at-team-start declaration**: amend `start-right-team`
   to require a tentative closeout owner be named in the team-start
   broadcasts (revisable at any time), removing the implicit-
   no-owner case entirely.

**Additional autonomy primitives** Stormbound Spiralling Breeze
surfaced in their amended closeout (also worth pending-graduations
entries; cross-link rather than duplicate if there are existing
register entries):

- **Coordinator-discovery for arriving agents** — query comms stream
  for active coordinator without owner naming names.
- **Standby-role defaults as first-class boundaries** —
  reviewer-dispatch / consolidation-observer / plan-file-only-follow-on
  as named roles arriving agents can self-select into without
  coordinator pairing.
- **Coordinator polling responsibility for unbriefed arriving
  agents** — active coordinator (if one exists) reads the comms
  stream for arriving-agent team-start broadcasts and routes them
  within bounded time.

These are all autonomy-substrate work-items. Stormbound's per-user
memory `feedback_owner_action_is_not_a_cure` is the standing
doctrine they discharge against.

### 2026-05-23 — SKILL amendment: Director ratification checklist + standby modes

`[captured: 2026-05-23 | source: pattern-emergence | target: skill-amend:start-right-team | trigger:
second-instance | size: M | status: owner-gated]`

Substance summary: PDR-074 (Candidate, 2026-05-23) names a routing-moment
ratification checklist (6-7 per-moment + 4 periodic structural questions per
assumptions-expert finding 4 + 5) and a three-mode standby model
(silent / substrate-work / routed-slice) as the operational core of effective
directing. These belong on the active grounding layer for any agent holding the
Director role. The SKILL surface `start-right-team` §3 ("Choose Temporary
Responsibilities") is the natural home; it is already read at every
team-bootstrapping moment and at every Director handoff (PDR-064 Moment 2).

Cure shape: amend `start-right-team` §3 to embed (a) the routing-moment ratification questions
verbatim from PDR-074 §"Routing-moment ratification checklist", (b) the four periodic structural
questions (S1–S4), and (c) the three-mode standby model with holding-reason articulation as a
Director obligation for any standby period >5 minutes. Cross-link to PDR-074 as substrate authority.

Why pending: PDR-074 is currently `Candidate`; second-instance evidence (a second multi-Director
session ratifying the model in practice) is the natural promotion gate. The 2026-05-23 Seaworthy +
Velvet + Seaworthy-acting windows are the first instance; a second window applying the checklist in
real time strengthens the case from candidate → graduation-ready.

Falsifiability: a future Director session that ratifies decisions against the checklist and produces
measurably tighter signal-to-noise / lower owner-attention split / lower busy-work output is the
success shape. A session that finds the checklist unwieldy or its questions miscalibrated against
real routing moments is the failure mode that revises the substance before graduation.

---

### 2026-05-23 — Rule pointer: director-ratification-checklist (active grounding layer)

`[captured: 2026-05-23 | source: pattern-emergence | target: rule:director-ratification-checklist |
trigger: second-instance | size: S | status: owner-gated]`

Substance summary: thin pointer rule at
`.agent/rules/director-ratification-checklist.md` that fires whenever an agent
holds the Director role, referencing the `start-right-team` SKILL §3 amendment
(sibling entry above) for the actual checklist + standby model body. Two-layer
pattern matches the existing estate: SKILL holds the substance, rule provides
the always-loaded trigger pointer.

Cure shape: single-paragraph rule file naming the trigger condition ("when this agent is acting
Director — newly assigned, on handoff receipt, or for the duration of a held Director window") and
pointing to the SKILL amendment for substance. No content duplication; pure routing surface.

Why pending: gated on (a) PDR-074 promotion from Candidate → Accepted and (b) the sibling SKILL
amendment landing. The rule is meaningless without the SKILL substance to point at, so it must land
second.

Falsifiability: a Director session that lands the rule first, finds the SKILL substance has drifted
from the checklist text, and the rule pointer dangles is the failure mode. Coordinated landing
(SKILL first, rule pointer second, both in the same consolidation pass) is the success shape.

---

### 2026-05-23 — Autonomy primitive P1: pre-positioned routing logic (rule + SKILL amendment)

`[captured: 2026-05-23 | source: pattern-emergence | target:
multi:rule:pre-positioned-routing,skill-amend:start-right-team | trigger: second-instance | size: M
| status: owner-gated]`

Substance summary: PDR-074 §"Autonomy-tend obligation" P1 names pre-positioned routing as a Director
obligation: every owner-decision-gated slice carries pre-positioned routing in the comms stream,
contingent on verdict shape. Post-verdict moves become light-up of pre-existing intent, not
re-think. This shrinks the owner-attention window from "decide + wait for routing + ratify routing"
to "decide; routing already in place."

Worked instance: Velvet Dimming Shadow's Tranche C/B/A pre-positioning broadcast (2026-05-23
Director window) named the routing for each tranche before the owner verdict on tranche ordering
arrived. When the verdict landed, agents lit up against the pre-positioned slots rather than
re-evaluating.

Cure shape: (a) rule at `.agent/rules/pre-positioned-routing.md` naming the obligation and the
failure mode (reactive post-verdict routing); (b) SKILL amendment to `start-right-team` §3 listing
pre-positioning as one of the routing-moment ratification questions (already Q1 in PDR-074
§"Routing-moment ratification checklist"). The rule is the always-loaded trigger; the SKILL is the
substance.

Why pending: one strong worked instance so far (Velvet's Tranche C/B/A). Second instance in a
different Director window, with a different verdict-gated slice, confirms the primitive before
formal graduation.

Falsifiability: a Director session where the owner decision arrives and the team scrambles to
re-evaluate routing (rather than lighting up pre-positioned slots) is the failure mode. A session
where the routing was pre-positioned and the verdict produced immediate light-up is the success
shape.

---

### 2026-05-23 — Autonomy primitive P2: owner-decision-elision via substrate

`[captured: 2026-05-23 | source: pattern-emergence | target:
rule:owner-decision-elision-via-substrate | trigger: second-instance | size: M | status:
owner-gated]`

Substance summary: PDR-074 §"Autonomy-tend obligation" P2 names a
first-ratification-question discipline: when a decision arrives at the Director
surface, the first question is *can the team resolve this via
reviewer-dispatch, sidebar, or vote?* If yes, route to substrate; only escalate
to owner with substrate-resolution-attempted-and-failed evidence. The primitive
shrinks the owner-action surface one decision at a time by tagging every
owner-decision arrival with a substrate-resolution check.

Complements per-user memory `feedback_no_question_when_answer_is_forced` (don't surface
multiple-choice when analysis already determines the answer) and
`feedback_owner_action_is_not_a_cure` (owner intervention is a stopgap, never the architectural
goal). P2 names the active discipline that operationalises both: every owner-decision arrival is a
candidate for substrate-resolution elision.

**Load-bearing constraint** (per architecture-expert-fred + assumptions-expert review):
substrate-resolution is *attempted-and-evidenced*, not silent elision. When the team escalates,
evidence-of-substrate-attempt-and-failure accompanies the escalation. This protects against silently
skipping owner-decisions that genuinely require owner attention.

Cure shape: rule at `.agent/rules/owner-decision-elision-via-substrate.md` naming (a) the
first-ratification-question wording, (b) the three substrate-resolution paths (reviewer-dispatch,
sidebar, vote), (c) the substrate-attempted-and-failed evidence requirement when escalation is
necessary. Sits adjacent to `feedback_no_question_when_answer_is_forced` and the no-cheap-cure /
no-passback rule estate.

Why pending: PDR-074 is the first explicit naming; second-instance evidence (a Director session that
visibly elides an owner-decision via substrate-resolution and the elision holds) is the promotion
gate.

Falsifiability: a session where the Director escalates a decision to the owner that the team could
have resolved via sidebar or reviewer-dispatch (and the owner says so) is the failure mode. A
session that runs the substrate-resolution check and either elides successfully or escalates with
substrate-attempted-and-failed evidence is the success shape.

---

### 2026-05-23 — Autonomy primitives P3 + P4: direction graduation + slice self-selection

`[captured: 2026-05-23 | source: pattern-emergence | target:
multi:rule:standing-direction-graduation,rule:slice-routing-self-selection | trigger:
second-instance | size: M | status: owner-gated]`

Substance summary: PDR-074 §"Autonomy-tend obligation" names two paired primitives that together
shrink the owner-action surface at session boundaries and slice-opening moments:

- **P3 (standing-direction graduation)**: the Director actively identifies owner-direction substance
  worth graduating to standing rules at session close and routes the graduation work to an
  implementer — rather than waiting for the owner to manually trigger consolidation. Closes the loop
  between session-scoped direction (`feedback_owner_direction_scope` — direction is session-scoped
  unless explicitly standing) and the standing-rule estate.

- **P4 (slice-routing self-selection)**: when a slice opens, the Director broadcasts *slice +
  substrate authority + criteria for fit* and lets agents self-elect via comms with their own
  fit-assessment. The Director ratifies if multiple elect (first-broadcast convention) or if no one
  elects (escalate). Shrinks the Director-as-allocator bottleneck named in PDR-074 structural
  property D.

Partial worked-instance evidence: Clouded's transparent self-organisation broadcast (Velvet handoff
§6.2) — agents self-electing into substrate work against Director-broadcast criteria.

Cure shape: two co-landing rules — `.agent/rules/standing-direction-graduation.md` (Director
obligation at session-close) and `.agent/rules/slice-routing-self-selection.md`
(broadcast-and-self-elect protocol for slice opening). Cross-link each other and PDR-074.

Why pending: P3 has no clear worked instance yet (no session has visibly run the graduation routing
as a Director closeout move); P4 has partial evidence (Clouded broadcast) but no second instance.
Both promote together because they pair structurally (P3 names the substrate, P4 names the routing
protocol that lights it up).

Falsifiability: a session that closes with owner-direction substance left un-graduated and the next
session re-discovering the same substance is the P3 failure mode. A slice-opening moment where the
Director allocates manually rather than broadcasting criteria-and-self-elect is the P4 failure mode.
Co-application of both, with the substance landing as standing rules and slices lighting up via
self-election, is the success shape.

---

### 2026-05-23 — Autonomy primitive P5: Director self-selection (no worked instance yet)

`[captured: 2026-05-23 | source: pattern-emergence | target: pdr:P5-director-self-selection |
trigger: candidate | size: L | status: owner-gated]`

Substance summary: PDR-074 §"Autonomy-tend obligation" P5 (now deferred from
PDR-074 main body per assumptions-expert review) names a Director
self-selection protocol: when a Director retires, propose a named candidate for
next Director in the Moment 1 broadcast with explicit criteria; the candidate
self-ratifies or declines; other agents can challenge; owner intervenes only if
the team cannot resolve. Shrinks the owner-action surface for one of the
highest-friction handoffs (PDR-064 Moment 1 is currently owner-driven).

**Explicit status: CURRENTLY UNPROVEN.** Both 2026-05-23 Director transfers (Seaworthy → Velvet →
next) were owner-directed; no session has yet demonstrated the team self-selecting a Director on
retirement with owner ratification post-hoc. Deferred per assumptions-expert review during PDR-074
authoring.

Cure shape: own PDR (not a rule) because the protocol is large enough to
warrant separate substrate authority: Moment 1 broadcast format,
criteria-naming convention, challenge window, escalation path, and the
team-can't-resolve owner-fallback. Specifically, per architecture-expert-fred
finding 2, the cure needs a bounded challenge window with explicit timeout
interlocking with PDR-064 Moment 2 cadence; if no Moment 2 active-ack lands
within the bounded window, escalate to owner. PDR drafting itself is gated on
first worked instance.

Why pending (with `candidate` trigger): no second-instance gate applies because there is no
first-instance evidence yet. The trigger condition is *first worked instance* — a session where the
team self-selects a Director on retirement (Director proposes candidate; candidate ratifies; no
challenge or resolved challenge; owner ratifies post-hoc). Capture-only until that instance lands.

Falsifiability: a session that attempts P5 and the team-can't-resolve fallback fires (owner must
intervene anyway) is the failure mode that revises the protocol. A session where the protocol runs
end-to-end without owner intervention until post-hoc ratification is the first-instance success and
unblocks PDR drafting.

---

### 2026-05-23 — Three-mode standby with Director holding-reason articulation

`[captured: 2026-05-23 | source: pattern-emergence | target: skill-amend:start-right-team | trigger:
second-instance | size: M | status: owner-gated]`

Substance summary: PDR-074 §"Idle-cost balance" names a three-mode
standby model that converts the Director's standby-handling from invisible
failure-mode to observable state. Three modes:

- **Silent standby** — Director has articulated an explicit holding-reason;
  agents read comms, hold context; minimal idle cost, zero busy-work risk.
- **Substrate work** — Director has named a substrate-work boundary, OR agent
  self-elects from an authorised standing list (pattern-completion-only:
  failure-mode capture, reviewer brief preparation, pre-grounding on slices
  already named in the comms stream, napkin updates, comms-read-forward).
  Pattern-creation (inventing PDRs, proposing tranches, drafting plans,
  refactoring unprompted) is NOT authorised substrate work.
- **Routed slice** — Director has routed an opened slice; normal focused implementer cost profile.

**Director obligation**: every standby period >5 minutes carries an explicit
Director-articulated holding-reason in the comms stream. Three legitimate
shapes per PDR-074: (a) holding for owner-attention coherence (silent default),
(b) holding for gate-clear / cascade-clear (silent default), (c) holding open
for substrate work with an authorised standing list (agents self-elect).

Cure shape: amend `start-right-team` SKILL §3 to embed the three-mode model and the
holding-reason-articulation obligation alongside the ratification checklist (sibling Entry 1). The
pattern-completion-only constraint on substrate work is load-bearing — without it, idle agents drift
into pattern-creation busy-work, which PDR-074 names as worse than idle.

Why pending: PDR-074 is `Candidate`; second-instance evidence (a Director session that runs the
three-mode model with visible holding-reason broadcasts and clean substrate-work / pattern-creation
boundary) is the promotion gate. The 2026-05-23 sessions are first-instance.

Falsifiability: a session where standby periods >5 minutes carry no articulated holding-reason, OR
where "substrate work" drifts into pattern-creation (unsolicited PDRs, unprompted tranche
proposals), is the failure mode. A session where every standby period carries an explicit
holding-reason and substrate-work stays inside the pattern-completion list is the success shape.

---

### 2026-05-23 — Autonomy primitive P6: routing-blockage detection and cure

`[captured: 2026-05-23 | source: pattern-emergence | target:
pdr:P6-director-routing-blockage-detection | trigger: second-instance | size: L | status:
owner-gated]`

Substance summary: a structural protocol that fires *without* requiring owner intervention when a
Director session exhibits one or more of the failure modes Seaworthy→next handoff §6.7 names —
hoarding implementer work, mis-classifying idle agents, over-ceremonious bundling. The protocol
detects each via observable signals and cures each via routing actions the Director or peer agents
can take inside the existing comms substrate.

**Three sub-primitives** under P6, each cured per the corresponding §6.8 owner-intervention:

- **P6a — Hoarding-detection trigger**: when the Director-class agent has
  authored ≥N implementer-class artefacts (sub-agent dispatches, source edits
  beyond routing, drafts that should be routed) within a routing-window of
  duration D, and ≥M implementer-class agents are idle, surface as observable
  signal. Cure: peer-agent or self-ratification against PDR-074 ratification
  question Q6 (*Did I take this on, or did I route it? If took on — why?*).
- **P6b — Ceremony-over-pragmatism detection**: when total bundle-ceremony
  overhead (claim-opens + queue-enqueues + marshal-requests +
  reviewer-dispatches + verdict-windows) across team-window W exceeds the
  substantive routing-unblock benefit by ratio R, surface as observable signal.
  Cure: Director-authorised ceremony-bypass for one routing-unblock action.
- **P6c — Idle-misclassification cure**: covered upstream by the comms-watch
  self-exclusion-only cure (Bundle 3 / `1ea4e2e1` wide-sweep). Director
  broad-awareness sees cross-agent cross-traffic correctly post-cure; idle
  classification can ratify against observed traffic. May be redundant with P6
  main body after comms-watch cure stabilises; defer second-instance evidence
  to confirm.

Worked instance: Seaworthy's acting-Director window 11:30Z–12:06Z produced all
three sub-failures within ~36 minutes; owner cured each with a single directed
action. Each cure names a missing structural primitive per
`feedback_owner_action_is_not_a_cure`. Counter-evidence (Director sessions
without P6 failures) exists in Velvet's window 10:48Z–11:04Z, suggesting P6 is
not load-bearing for every Director session — it fires under specific
context-pressure shapes.

**Second worked instance (2026-05-23T12:36Z, SHA:`db275c09`)** — refined in
by Secret Creeping Moth / `61d726` under Abyssal routing `14b56fc7` at
12:44:35Z. About 41 minutes after the first wide-sweep (SHA:`1ea4e2e1`), a
second emergency-unblock landed: owner-authorised one-time `--no-verify`
mega-commit absorbing 58 outstanding changes plus owner-authorised one-time
`HUSKY=0` push. Escalation pattern from first instance: ceremony-bypass →
hook-bypass + push-bypass. The second cure was more aggressive because the
structural failure mode had deepened: Incandescent's Monitor-harness cure
mid-refactor blocked all commits team-wide via pre-existing type-check + lint
failures per Seaworthy `c19177c6` at 12:33:48Z. This strengthens the
motivating evidence: the failure mode is not anomalous to one session, and
successive cures require more owner-attention each time. Promotion gate (one
autonomous P6 cure) remains UNMET — second instance is owner-cured again, not
team-autonomously-cured. The very session that authored P6 demonstrated its
motivating failure mode twice without P6 firing once. See napkin entry
"Extension: second mega-commit emergency-unblock" 2026-05-23 for full
worked-instance substance.

**Adjacent substrate gap, NOT folded into P6** (flagged separately): the
HUSKY=0 portion of the second wide-sweep names a distinct substrate gap —
pre-push gitleaks scans historic commits not covered by per-commit allowlists;
the SHA-prefix rule (`.agent/rules/sha-prefix-in-collaboration-content.md`)
cures forward only. Possible cure shapes (auto-extend commit-allowlist at
marshal-emergency-bypass time / history-rewrite tool for SHA-prefix gap-fill /
push-time gitleaks scope narrowing) are distinct from P6's
Director-routing-blockage scope and would dilute P6 if folded in. Capture this
as a separate pending-grad entry if a second-instance of the
gitleaks-historical-scan blockage lands.

**Load-bearing constraint** (anticipating reviewer pushback): P6 must not
promote to over-eager detection that flags every Director session. The triggers
are bounded by observable thresholds (N, D, M, W, R) calibrated against the
Velvet counter-example. PDR-Proposed authoring should derive the threshold
values from the Seaworthy + Velvet sessions as initial empirical anchors.

Cure shape: PDR-Proposed authoring (not a rule — protocol substance is too
large for rule format). Substrate spans observable-signal definitions,
ratification-question wording, cure-routing protocols, and the ceremony-bypass
authorisation shape. Cross-references PDR-074 (Director value), PDR-072
(autonomic learning), and `feedback_owner_action_is_not_a_cure`.

Why pending: one explicit worked instance (Seaworthy 2026-05-23).
Second-instance evidence (a Director session that detects-and-cures one or more
of P6a/P6b/P6c without owner intervention) is the promotion gate. Until then,
capture-only.

Falsifiability: a session where Director-class failure modes from §6.7 occur
and P6 sub-primitives are observable + applicable but do not fire is the
failure mode that revises threshold calibration. A session where one or more
sub-primitives fire correctly and cure without owner intervention is the
first-instance success that promotes from candidate → PDR-Proposed authoring
trigger.

Cross-references:

- Builds on PDR-074 (Director value as mind-coherence-per-owner-attention); §observable-property-6
  (Director-surface protection enforced inversely) is the substrate P6 operationalises.
- Builds on PDR-072 (autonomic learning); P6c's idle-misclassification cure is upstream of PDR-072's
  autonomic-learning shape applied to broad-awareness.
- Standing memory: `feedback_owner_action_is_not_a_cure` is the durable doctrine P6 discharges. Each
  owner intervention cured a missing primitive; P6 codifies the substrate so the primitives are held
  structurally.
- Substrate dependency: P6c requires the comms-watch self-exclusion-only cure to be stable
  (Bundle 3 plus Bundle 5 doc-completion); without correct broad-awareness,
  idle-misclassification cannot be
  reliably detected.

---

## Napkin Tail Gates

### Heterogeneous working-tree owner direction splits by attribution

`[captured: 2026-05-24 | source: active-napkin Mistbound Capture E | target:
pattern:heterogeneous-working-tree-split-by-attribution | trigger: second commit-all
split-by-attribution instance | size: M | status: owner-gated]`

Mistbound captured an owner direction to "commit all files" against a
heterogeneous dirty tree: an in-flight Twilit CLI bootstrap refactor, an
unattributed source-class `mcp-handler.ts` fix, and a large substrate /
shared-state bundle. The chosen cure was not a literal bulk commit; it was a
three-commit split by attribution and atomicity so owner intent (durable
progress) and Practice constraints (reviewer convergence, atomic landing, and
source/substrate separation) all remained true.

Natural home: repo-local coordination pattern if a second owner "commit all"
window encounters mixed peer/source/substrate ownership and is resolved by an
attribution-preserving split.

Falsifiability: a second worked instance names the mixed file classes, the
owner-intent vs literal-form tension, the split chosen, and the evidence that
atomic peer work and unattributed source work were not hidden in a hygiene
commit.

Processing disposition: verified 2026-05-24 under Shaded claim
`a6098196-5f85-4d60-8c93-0168c251fcf8`. Current repo search found no existing
repo-local pattern carrying this exact split-by-attribution shape outside the
active napkin, main-register pointer, and this file. Keep pending until a
second mixed owner-"commit all" window is resolved by attribution-preserving
split. Do not generalise one emergency split into doctrine.

Owner gate: decide whether this one-instance mixed-tree / attribution-preserving
commit watch should remain live until a second worked instance appears, or be
withdrawn as insufficiently proven for the current buffer-drain goal.

### Substrate-write commit window under high team cadence

`[captured: 2026-05-24 | source: active-napkin Mistbound Capture F | target:
pattern:substrate-write-window-coordination | trigger: second multi-writer shared-state staging race
| size: M | status: owner-gated]`

Mistbound captured a staging-window race while landing substrate hygiene:
shared-state writers modified `.agent/memory/` and
`.agent/state/collaboration/` during the staging window, producing staged-count
drift and an `MM` active-claims state. The immediate repair was to rebuild the
pathspec list and audit the staged set. The durable question is the
coordination shape for short substrate-write windows under high team cadence.

Natural home: repo-local coordination pattern after a second shared-state
staging race. The candidate must preserve the existing rule that shared-state
files remain writable and commit-includable; the question is whether a brief
"substrate-write window open" broadcast or an explicit residue policy is the
cleaner coordination move.

Falsifiability: a second substrate hygiene commit observes concurrent
shared-state mutations during staging, records the coordination decision, and
shows whether a short broadcast window or residue policy reduced re-stage churn
without blocking knowledge capture.

Processing disposition: verified 2026-05-24 under Shaded claim
`a6098196-5f85-4d60-8c93-0168c251fcf8`. Existing claim and commit-window rules
cover `git:index/head`, commit-queue ordering, and active file ownership; they
do not yet settle the narrower shared-state substrate-write window question.
Keep pending until a second shared-state staging race shows whether the durable
cure is a short broadcast window, an explicit residue policy, or no new pattern.
Any future cure must preserve the rule that shared-state knowledge writes remain
writable and commit-includable.

Owner gate: decide whether this one-instance substrate-write staging-race watch
should remain live until a second race clarifies the durable cure, or be
withdrawn because current commit-window and claim rules already cover the known
portion.

## Reviewer-brief scope protection cites numbered ratified decisions only

- **captured-date**: 2026-06-03
- **source-surface**: `napkin.md` 2026-06-03 Lacustrine Swimming Beacon entry +
  `distilled.md` 2026-06-03 entry (EEF D3 review-then-ratify session).
- **graduation-target**: a clause in the reviewer-brief discipline surface
  (`memory/executive/invoke-code-experts.md` or the brief-authoring guidance):
  when a brief protects decided scope, the protection list enumerates the
  owner's NUMBERED ratified decisions (and explicitly owner-settled artefact
  sections); plan-authored elaborations remain refutable. Worked instance
  2026-06-03: protecting the whole §Do sweep suppressed a legitimate PDR-058
  no-consumer finding (metric-filter inputs) that the owner's settlement
  question then surfaced and resolved by deferral.
- **trigger-condition**: a second observed instance of scope-protection
  suppressing a legitimate finding, OR the next authoring pass over the
  reviewer-brief discipline surface — whichever first.
- **status**: pending

## Precedent-hunting / source-framing as an optionality-invention engine

- **captured-date**: 2026-06-04
- **source-surface**: `napkin.md` 2026-06-04 Mossy gate-session closeout entry
  (four owner corrections, one root); cross-experience corpus signal (Furnace
  "suspicion of unanimous answers"; Moonlit "verdict before the plan").
- **graduation-target**: rule- or pattern-shaped behavioural discipline —
  decide from requirements + primary sources, not precedent/source-framing as
  cover; a unanimous recommendation + owner intent makes a gate a
  *confirmation*, not a fork; generalise the root on the FIRST correction and
  re-audit in-flight work for siblings rather than patching instances.
- **trigger-condition**: a second cross-session instance, OR owner direction
  (four in-session instances is strong but single-session).
- **status**: pending

## Licensing guardrail — crystal-clear-open licences only (school-data-search)

- **captured-date**: 2026-06-04
- **source-surface**: school-data-search plan §Non-goals (owner directive
  2026-06-04); the V-06 verification (Scotland geospatial OS/LGIH licence).
- **graduation-target**: ADR-shaped if the project proceeds — a data-licensing
  posture (only crystal-clear, open, respected licences enter the canonical
  dataset; a licence allowlist parallel to the privacy allowlist; OS-derived /
  Crown-Copyright / unclear-licence data excluded). Plan-local for the POC.
- **trigger-condition**: the school-data-search POC go/no-go (project
  proceeds), OR a second Oak data-ingestion surface facing the same question.
- **status**: pending (project-gated)

## Two graph data sources are separate concerns sharing one substrate (graph KG)

- **captured-date**: 2026-06-04
- **source-surface**: graph-tools-value-redesign plan + the KG estate survey
  report (Twilit Cascading Supernova), owner-directed 2026-06-04.
- **graduation-target**: ADR-shaped — the bulk-derived curriculum graphs
  (instances, slug-keyed, our codegen) and the Oak Ontology graphs (formal
  RDF/OWL/SKOS, stable w3id IRIs, separate GitHub repo) are **distinct concerns**
  that share the `graph-core`/`graph-corpus-sdk` substrate but are NOT one graph:
  different identity, coverage, stability, and kind. Cross-source composition
  (e.g. concept-anchored queries) is gated on a bulk↔ontology alignment audit.
  Candidate to formalise alongside / amend ADR-173 (graph-stack topology) +
  ADR-157 (multi-source integration) when the KG work resumes.
- **trigger-condition**: the owner-directed full `oak-kg` / ontology estate
  review, OR the graph-tools-value-redesign promotion (EEF D6 + D7), whichever
  first reopens the substrate boundary as settled architecture.
- **status**: pending (KG-work-gated)

## 2026-06-14 capture — Clipper wakes Atoll (PDR-051 reduced-implementation reconciliation review)

Verified absent from this register before adding.

- **PDR-051 reduced-implementation reconciliation review.**
  `captured-date`: 2026-06-14. `source-surface`: 2026-06-14 skills audit (this session); owner direction to
  record gaps and defer the disposition decision to a later session. `graduation-target`: a decision on
  PDR-051 — either amend it to record the deferred/YAGNI scope (owned/ingested machinery, supporting-file
  copy, `claude-*` hoisting are unexercised; `skills-lock.json` empty) OR a remediation plan that closes the
  §Required gaps as defects. `trigger-condition`: the owner-deferred review/analysis session, OR the first
  ingested external skill (which activates the owned/ingested apparatus), OR promotion of
  `future/skills-oversized-core-decomposition.plan.md` (which needs the supporting-file-copy gap closed).
  `status`: owner-gated (review deferred 2026-06-14).
  Inputs ready: the gap ledger in `current/skills-standardisation-and-adapter-generator.plan.md`
  §Reality Reconciliation; friction F-37. Two enhancement briefs already authored (oversized-core
  decomposition; skills eval harness) sit in `agent-tooling/future/`.

## 2026-06-14 capture — Whirlwind rides Ridge (WS7 closeout + Brazier's loss-scan §6)

- **Step-6e.2 adversarial loss-scan is role-INDEPENDENT (Brazier stirs Residue, §3.3/§6).**
  - **source-surface**: Brazier's WS7 archive-move closeout handoff (folded by Whirlwind).
  - **substance**: the closeout context-loss sweep fires for EVERY closeout, not closeout-owners
    only; closeout lightness (the team-member path) is not a licence to skip it. Run it whenever a
    session held substantial first-hand reconstruction or cross-surface synthesis. (Brazier's first,
    minimal team-member closeout skipped it while holding a heavy reconstruction; the owner had to
    direct the fuller pass.)
  - **graduation-target**: `distilled.md` first; PDR-011 / ADR-150 (closeout contract) if it recurs.
  - **trigger-condition**: a second instance of a context-rich closeout skipping the loss-scan.
  - **status**: pending.
