## 2026-04-20 — L-7 bespoke orchestrator built then pivoted + guardrails installed

### What Was Done

- Landed L-7 Sentry release/commits/deploy linkage bespoke orchestrator (commits `7f3b17e9` + `6f5acd17` + `ecee9801`): resolver split (`resolveSentryEnvironment` + `resolveSentryRegistrationPolicy`), OTel tag rename `git_sha` → `git.commit.sha`, four-file TypeScript orchestrator invoked by `tsx` from Vercel Build Command, 21 integration tests with fakes-as-arguments, ADR-163 §6.0 probe amendment, Vercel wiring. ~900 lines total.
- Owner surfaced in one question that `@sentry/esbuild-plugin` (the vendor's first-party bundler plugin) would eliminate most of this bespoke code. Pivot decision: delete the orchestrator, switch to the plugin. Bespoke commits kept as signal; plugin-migration plan queued.
- Installed six metacognition lessons as process guardrails (commit `4bccba71`) across four repo surfaces: `assumptions-reviewer`, `code-reviewer`, `docs-adr-reviewer`, three plan templates.
- Committed research-thread cross-lane direction-of-travel work (commit `162f767e`, owner-authored).
- Committed sentry doc-drift snapshot (`89bf86ab`) before plugin migration — signal, not throwaway.

### Patterns to Remember

- **Build-vs-buy precedes build-shape.** Weighed `.sh` vs `.mjs` vs `.ts` at plan time. Three bespoke shapes. Never asked "should we write our own?" The vendor plugin was the cheapest option and was never on the list. ADR-163 §6's six CLI commands were inherited as the problem statement rather than questioned as one realisation of a spec.
- **ADRs that prescribe HOW not WHAT foreclose alternatives.** ADR-163 §6 listed six specific `sentry-cli` invocations with per-step abort/warn postures. Once written, "amend the ADR to match implementation" became the path of least resistance. When the ADR was amended for the §6.0 probe, the calcification deepened. ADRs should state the outcome the vendor must reach; the realisation belongs in the implementing plan.
- **Friction is aggregate signal, not per-point friction.** Five ratchets fired against the bespoke shape: lint size/complexity caps triggering file splits; type-import cycle; reviewer finding requiring MORE code (the §6.0 probe); ADR amendment; eslint-config ignores exception. Each was individually principled; cumulatively they were the repo telling me the shape was wrong. A counter at three+ would have fired.
- **Sunk-cost reasoning leaks into recommendations.** Final defence was "we'd need to verify the plugin supports our `--release + -e <env>` combination exactly" — protecting the shape of argv we chose. Argv shape was never the requirement; Sentry UI state was. When hedging on whether vendor-canonical meets a spec we invented, that's sunk-cost framing in recommendation form.
- **Review phase matters as much as review volume.** Plan had every reviewer tranche scheduled post-commitment. `assumptions-reviewer` was LAST (after docs). Owner had to request a mid-session "extra tranche" which caught the commit-attribution-overwrite issue — but even that ran inside the frame "is this orchestrator sound?" not "should this orchestrator exist?". Owner's extra-tranche request was a phase-misalignment signal, not a volume signal.
- **Vercel `vercel.json.buildCommand` overrides the Dashboard UI.** Per official docs: "This value overrides the Build Command in Project Settings." One reviewer agent earlier had muddled this and I repeated it unchecked. Verified in the actual Vercel docs page, corrected. Lesson: reviewer output is not authoritative on vendor behaviour — always check the vendor's own docs before asserting.

### Mistakes Made

- Inherited ADR-163's implementation framing without questioning whether the ADR was asking the right question. The whole orchestrator was wrong-shape; every reviewer I invoked operated inside that frame; none asked "should this exist?"
- Scheduled `assumptions-reviewer` last in the plan's reviewer matrix. That is maximally expensive to act on a shape finding. Owner had to manually request it mid-session.
- Defended argv shape as if it were the requirement, when it was an implementation detail I had chosen. Sunk-cost preservation disguised as technical rigour.

### Key Insight

**The reviewer tranche the caller dispatches inherits the caller's frame.** If the frame is "is this orchestrator well-structured?", downstream reviewers answer that question. "Should this orchestrator exist?" dies at the dispatch point or nowhere. Solution-class challenge must be framed by the caller, and must happen pre-ExitPlanMode, because that is the only phase where acting on "this should not exist" is cheap. Installing this as a rule (assumptions-reviewer new Triggering Scenarios + Key Principles + "Not This Agent When" mid-session rejection) is the structural fix.

### Lessons for Next Session

- The session-continuation prompt is now 1545 lines — its own complexity is the self-referential drift risk the owner flagged. First task next session: find + apply the decomposition plan.
- Deep consolidation is DUE. Not running it in this handoff per owner direction to move to a fresh session. The decomposition work in the next session is the natural carrier for the consolidation pass — do both together.
- Plugin-migration plan MUST use the new `feature-workstream-template.md` with Build-vs-Buy Attestation + Reviewer Scheduling filled in. This tests whether the guardrails work in practice.

---

## 2026-04-20 — practice-aligned project-directions research (broad-before-deep)

### What Was Done

- Implemented the `practice-aligned_project_directions_research_ea215686.plan.md`
  end-to-end across four slices + analysis baseline + routing.
- Slice A: trajectory analysis for 15 governance-plane projects with
  five cross-project trajectory patterns and per-project repo-local
  implications. Roadmaps/RFC/SEP records preferred; release notes as
  fallback; `trajectory weak` flagged where neither present (Prow,
  Bee/Beeai).
- Slice B: practice-methodology ecosystem reconnaissance (AGENTS.md,
  Agent Skills as the open standard, plugin marketplaces, AAIF as
  steward, cross-tool path normalisation). One note in
  `operating-model-and-platforms/`; no new lane.
- Slice D: adjacent-enabler reconnaissance (evals/scorers, context
  engineering, agent-native observability, agent-native code review,
  agent-native VCS). One cross-cutting note in
  `operating-model-and-platforms/` with explicit per-lane
  cross-references. No new lane.
- Slice C: cross-lane survey at the lane root, one section per
  existing lane, evidence linked back to A/B/D source notes rather
  than re-cited.
- Phase 2: `practice-aligned-direction-and-gap-baseline.md` analysis
  with two matrices (direction-signal × practice-intention; lane ×
  signal coverage) re-using the
  `governance-concepts-and-mechanism-gap-baseline.md` status legend
  and shape so the two baselines compose.
- Phase 3: explicit decision to produce **no new report this
  session**, with prerequisites named (no upstream
  direction-of-travel deep dive yet; baseline untested by any plan).
- Phase 4: routing surfaces updated (research lane README,
  governance-planes README, operating-model README, analysis README,
  governance integration report back-link, governance-concepts
  baseline back-link).

### Surprise

- **Expected**: Slice A's 15 governance-plane projects would show
  divergent direction signals; the research would have to pick winners.
- **Actual**: Five direction signals recur across all four slices —
  hardened persistence, schema-first declarative surfaces, identity/
  OAuth modernisation, three-primitive convergence under AAIF, and
  telemetry/evals/supervision merging. The ecosystem is converging,
  not diverging. The repo's intention surface is **directionally
  well-aligned** with the convergence; the interesting work is
  mechanism uplift, not direction change.
- **Causal mechanism**: the slices were chosen to cut the same
  ecosystem from four angles (governance-plane projects;
  practice-methodology primitives; adjacent enablers; cross-lane
  re-routing). Convergent signals across all four cuts is stronger
  evidence than convergence inside any single cut.

### Corrections / learnings

- **Assumptions-reviewer pre-pass paid off twice**: (i) it caught
  proportionality drift in the original four-way fan-out and forced
  parent-led reconnaissance with deferred subagent use, saving
  significant agent dispatch; (ii) it added the "no new lane until
  evidence proves it stable, non-overlapping, and beneficial for
  discovery" fence, which in turn justified placing Slice B and Slice
  D in `operating-model-and-platforms/` instead of inventing two new
  lanes that would have churned the lane map.
- **The Practice five-file package is conceptually a plugin**: Claude
  Code and Cursor independently arrived at: manifest at root,
  namespaced skills, bundled artefacts, marketplace with manual
  review, team-controlled subset. The bootstrap-script propagation in
  ADR-124 sits in the same conceptual category as the plugin format.
  This is a noted-but-not-acted-on alignment opportunity (Slice B
  routing recommendation only).
- **Two principles transferable without external dependency**:
  "treat persisted state as untrusted by default" (MS Agent Framework
  `1.0.1`, LangGraph `4.0.2`, Dapr April 2026) and "policy engine
  performs no normalisation; normalise once at the perimeter" (Dapr).
  Both are recorded as principles in the analysis baseline; both
  are deferred until applicability surfaces emerge.
- **`derived-memory-and-graph-navigation` lane has the thinnest
  external direction signal of any lane**: not because the lane is
  undirected, but because the four slices under-sample the
  graph-memory ecosystem. A future research pass scoped specifically
  to that ecosystem would close the gap. Recorded as a routing
  recommendation only.

### Watchlist (single-instance, not yet ready to distil)

- **`assumptions-reviewer-pre-pass-shrinks-fan-out-and-tightens-fences`** —
  running an assumptions-reviewer pass on a multi-slice research plan
  before launch produces (a) proportionality reduction and (b)
  doctrine fences that pay off during execution. Not yet a pattern
  candidate; needs a second instance.
- **`convergent-direction-across-multiple-research-cuts-is-stronger-evidence`** —
  when four parallel research slices all surface the same direction
  signals, the convergence itself is the finding. Repeat criterion:
  observe a second cross-cut research effort whose convergent
  patterns match this one, then promote.
- **`practice-five-file-package-is-conceptually-a-plugin`** —
  watchlist for whether plugin-format wrappers should ship alongside
  the bootstrap script. Trigger condition: a downstream consumer
  asks for plugin-marketplace install of the Practice package.
- **`reviewer-systems-cluster-is-the-densest-uplift-cluster`** —
  three high-signal candidates (machine-readable handoff, per-team
  learning loop, RFC 9728 audit) all point at the same plan
  (`reviewer-gateway-upgrade.plan.md`). If the plan absorbs them
  cleanly, the cluster shape itself is a routing pattern worth
  promoting.

### Pattern To Remember

- All four candidates above are **single-instance** observations from
  this session and stay on the watchlist. Not yet promotion-ready.

### Unresolved

- **Top unresolved question** (recorded in the analysis baseline):
  is the existing `agentic-engineering-enhancements/` plans surface
  sized to absorb the eight high-impact uplift candidates without
  churning into low-signal work? A scope-and-sequencing pass on the
  plans surface should precede picking up any candidate.

---

## 2026-04-20 — reflection on "repos as governance planes"

### What Was Done

- Read `.agent/research/agentic-engineering/governance-planes-and-supervision/repos-as-governance-planes.md`
  and compared its framing against the repo's lived governance surfaces:
  `AGENT.md`, the start-right workflow, `practice-core/index.md`,
  `practice-index.md`, ADR-119, ADR-124, ADR-125, the cross-platform
  agent surface matrix, and the completed observability-primitives
  consolidation plan.

### Surprise

- **Expected**: the research note would mostly describe future-state
  infrastructure that this repo only gestures toward.
- **Actual**: this repo already behaves much more like a governance
  plane than many "agent frameworks" do. The governance is versioned,
  executable, portable, and layered across canonical content,
  platform adapters, entry points, reviewer dispatch, plans, memory,
  and validation surfaces.

### Corrections / learnings

- **This repo is stronger where the note says the ecosystem is weak**:
  the note identifies a missing open standard for machine-readable
  contribution contracts; this repo approximates one locally through
  directives, rules, commands, skills, ADRs, plans, hooks, platform
  matrices, and portability contracts. The contract is repo-native
  rather than ecosystem-standard.
- **The repo's distinctive move is portability of governance itself**:
  ADR-124 and ADR-125 turn governance artefacts into a travelling
  package plus local bridge, so the repo is not only governed; it can
  propagate its governance model to other repos.
- **The strongest evidence is closure discipline, not just file count**:
  the completed observability-primitives plan shows governance as an
  execution surface with reviewer routing, invariants, proof, and
  closure evidence, not a passive documentation layer.

## 2026-04-19 — L-7 adjudication + ADR-163 authored and Accepted (post-rotation session)

### What Was Done

- Owner adjudicated 6 L-7 open questions (release identity, SHA
  provenance, release-creation location, source-map interaction,
  deploy-event scope, pipeline boundary) during the consolidation
  closeout.
- Verified the owner's intended mechanism against Sentry + Vercel
  current docs via `sentry-reviewer` agent + direct WebFetch calls.
  Owner redirected mid-research: "use the proper tools, not arbitrary
  scripts" — switched from dispatching the `vercel:deployment-expert`
  agent to direct WebFetch for Vercel docs.
- Authored initial ADR-163 draft. Owner pushback: "unacceptable
  degree of uncertainty; Sentry documentation is clear; all decisions
  and all uncertainties must be resolved and recorded in the
  appropriate plans and documents." Rewrote ADR-163 to eliminate
  every open question by naming previously-implicit decisions
  (CLI noun form, per-step error handling, pipeline attachment shape,
  idempotency posture, runtime contract changes, hotfix policy).
- L-7 lane body in maximisation plan fully rewritten as a mechanical
  transcription of ADR-163 §6 with explicit RED/GREEN/REFACTOR,
  orchestrator script shape, and acceptance criteria.
- Fixed documentation drift in 6 surfaces:
  `docs/operations/sentry-deployment-runbook.md` (SENTRY_RELEASE
  fallback said SHA; corrected to semver),
  `docs/operations/sentry-cli-usage.md` (added release-linkage
  sequence), `upload-sourcemaps.sh` (WHEN-TO-RUN now says semver only),
  `apps/.../docs/observability.md`, `apps/.../docs/vercel-environment-config.md`,
  `packages/libs/sentry-node/README.md`.
- Owner accepted ADR-163 in same session ("1 yes, 2 yes"). Status
  flipped Proposed → Accepted with History entry. L-7 implementation
  authorised. All stale "Proposed" references to ADR-163 cleaned up
  across session-continuation prompt + ADR index.

### Surprise

- **Expected**: an ADR that recorded the owner's 6 adjudicated answers
  would be sufficient to close the uncertainty.
- **Actual**: the 6 answers implicitly settled 6 more decisions
  (CLI form choice, abort-vs-continue posture per step, pipeline
  attachment shape, idempotency of `releases new`, per-env-var
  runtime contract additions, hotfix discipline). Owner pushback
  "all decisions and all uncertainties must be resolved" forced a
  second pass that enumerated every latent decision, not just the
  explicitly-asked ones.
- **Causal mechanism**: a list of questions frames the uncertainty
  the asker is *aware of*. Answering that list resolves those
  questions but leaves downstream decisions the questions did not
  name. An ADR that is genuinely decision-complete must sweep for
  decisions the questioner did not think to ask. Pattern candidate:
  **`decision-complete-adr-enumerates-implied-questions`** — when
  adjudicating a named question list, enumerate every downstream
  decision that the explicit answers *require* and record each
  explicitly, even ones the asker did not raise.

### Corrections / learnings

- **Agent-vs-WebFetch for doc research**: Owner's direction "use
  the proper tools, not arbitrary scripts" interpreted as: prefer
  direct `WebFetch` for authoritative-doc research over dispatching
  a specialist agent that will itself fetch the docs. `WebFetch` is
  the cheaper, more legible path when the need is "read doc X and
  extract facts Y, Z". Agents are right when the need is genuinely
  interpretive (reviewer judgement, cross-source synthesis). Pattern
  candidate: **`prefer-webfetch-for-doc-citation-prefer-agent-for-
  judgement`**.

- **Sentry CLI noun-form drift is real**: the legacy
  `sentry-cli releases deploys VERSION new -e ENV` form still works
  but the current CLI reference documents `sentry-cli deploys new
  --release VERSION -e ENV`. Codifying ONE form only (ADR-163 §6.6
  rejects the legacy form) eliminates drift between docs and
  scripts. Watchlist: **`prefer-one-form-over-both-work-drift-
  avoidance`**.

- **Debug IDs are THE symbolication key; `--release` on sourcemaps
  upload is optional but kept**: Sentry's Debug-ID era means the
  symbolication key is embedded in the JS itself, not the release
  string. `--release` on `sourcemaps upload` creates a weak
  association (UI navigation benefit). Oak keeps it for the UI
  benefit but ADR-163 §6.4 documents that Debug IDs alone would
  suffice. Watchlist: **`symbolication-key-vs-ui-association-are-
  separate-concerns`**.

- **The existing GitHub release workflow + Vercel ignoreCommand
  already enforce the "one version-bump commit per production
  build" invariant**: L-7 scope does NOT change `release.yml` or
  `vercel-ignore-production-non-release-build.mjs`. L-7 only adds
  the Sentry CLI sequence inside the Vercel Build Command. This
  was a discovery surprise — the plan body had previously implied
  L-7 would touch the GitHub workflow; it will not.

- **Vercel has no post-deploy hook**: everything happens inside the
  Build Command. The single-orchestrator shape (ADR-163 §7) flows
  from this constraint — pre/post-build hooks don't exist, and
  chaining CLI steps with bash `&&` cannot express per-step
  abort-vs-continue postures.

### Pattern To Remember

- **`decision-complete-adr-enumerates-implied-questions`** (new,
  single instance) — promotion-ready if a second instance occurs
  where an explicit adjudication-question list left downstream
  decisions unnamed.

- **`prefer-webfetch-for-doc-citation-prefer-agent-for-judgement`**
  (new, single instance) — calibrates when to use agent dispatch
  vs direct doc fetching.

---

## 2026-04-19 — napkin rotation (second rotation of the day)

### What Was Done

- Archived outgoing napkin to `archive/napkin-2026-04-19b.md`
  (~1679 lines — well above the 500-line rotation threshold). The
  morning's first rotation already landed as `napkin-2026-04-19.md`;
  today's evening session required a second rotation because the
  primitives-consolidation planning + execution + three-sink wiring
  surprises all accumulated on the same day.
- Previous rotation: 2026-04-19 (morning) at the end of the
  observability-planning-restructure session.
- This rotation preserves: the primitives-consolidation EXECUTION
  session (top), the PLANNING session, the three-sink wiring
  session, the L-DOC initial session, the L-EH initial session, and
  the Phase-5 honest-evaluation conclusions. Each lives in the
  archive for durable reference.

### Watchlist carried forward (single-instance, not yet ready to distil)

These live on this new napkin as the active observation set. They
move to distilled only on a second independent instance in a later
session. Ordered by how structurally load-bearing each candidate is
if it recurs.

- **`work-stream-dissolution-via-upstream-fix`** — a fix-to-root-cause
  can absorb a downstream remediation listed as a separate work
  stream. Planning should check after each upstream step lands
  whether the downstream item is still needed. (From the WS6
  dissolution in the primitives-consolidation execution.)
- **`reviewer-matrix-completeness-is-not-absolute`** — plan-level
  reviewer lists are discretionary, not prescriptive; owner
  concurrency control and the law of diminishing returns shape
  actual dispatch. (From the mid-session owner "stop all streams"
  interrupt.)
- **`turbo-cache-hides-prettier-drift-until-pre-commit`** — trust the
  pre-commit hook for the authoritative format verdict; turbo's
  cached `format:root` can say "nothing to do" while pre-commit
  prettier finds drift. (From the first commit attempt failure.)
- **`amend-not-honour-when-simplification-surfaces-post-decision`** —
  an ADR decision made without the full consumer graph visible can
  be amended when a later review with the broader view finds it
  over-decomposed. Architectural excellence trumps ADR honour.
  (From the ADR-160 fold amendment.) **Strong candidate to
  graduate to PDR on second instance.**
- **`duplicate-type-load-bearing-at-three-consumers`** — a duplicated
  type across two workspaces is tolerated until the third import
  site; at three, canonicalisation is forced. (From the JsonValue /
  TelemetryValue unification pressure.) **Strong candidate for
  `.agent/memory/patterns/` on second instance — general engineering
  observation.**
- **`core-tier-means-primitive-not-just-dependency-pure`** — workspace
  tier is about primitive-ness as well as dependency purity. A
  composition-only workspace does not meet core-tier's "atomic
  primitive" spirit even when its deps are all in core. (From the
  139-LOC composition workspace rejection.)
- **`safety-layers-stack-not-nest`** — a harness-level safety hook
  (e.g. `scripts/check-blocked-patterns.mjs`) is not automatically
  subordinate to in-conversation owner authorisations. Safety
  layers stack; they do not nest under permission. (From the
  `--no-verify` attempt.)
- **`git-status-is-a-snapshot`** — session-open `git status` is a
  snapshot; parallel agents may have staged substantial work by
  mid-session. Re-read status fresh before any destructive git
  operation. (From the 47-file staged-parallel-work incident.)
- **`closure-principles-absorb-cardinality-changes`** — when an ADR
  is phrased as a closure principle (all fan-out paths apply the
  redactor) rather than an enumeration (five named hooks),
  cardinality changes (three sinks, not two) land without ADR
  amendment. (From the three-sink wiring against ADR-160 / ADR-162.)
- **`reviewer-as-option-cartographer-not-decision-maker`** — reviewer
  findings frame the option space; owner rulings settle within
  it. The reviewer's job is to surface the alternative; it is not
  to prescribe which alternative wins. (From the two BLOCKER
  overrides during three-sink wiring.)
- **`date-suffixed-frontmatter-is-a-smell`** — novel frontmatter
  fields earn their place by being reusable across documents and
  across edits; date-suffixed fields lock the document to its
  authoring moment. Renamed `companion_explorations_2026_04_19:` to
  `informed_by:`.
- **`tier-scope-must-be-explicit-for-shared-vocabulary-invariants`** —
  invariants written for one tier (plans) get conscripted into
  governing adjacent tiers (explorations) unless the scope is named
  explicitly. Plan Density Invariant required a "Scope
  clarification" addition.
- **`code-embodied-policy-without-explicit-ruling-needs-tsdoc-pointer`** —
  when code embodies an unwritten policy decision, the holding
  pattern is: TSDoc at the call site points at the open exploration
  that owns the ruling. (From `observability.setUser({ id: userId })`
  in `mcp-handler.ts`.)
- **`forward-pointing-planning-references-need-planned-markers`** —
  plans that cross-reference workspaces, files, or dirs that do not
  yet exist on disk must label those references explicitly. Readers
  should not infer existence from a reference. (Moved from distilled
  2026-04-19 as still single-instance — re-watchlist on second
  occurrence.)
- **`in-place-supersession-markers at section anchors`** — when a
  doc receives a status reframe, in-place markers are needed at
  every section-level anchor that external surfaces reference, not
  only at the document head. (From the capability-matrix §7 /
  Q6 reviewer finding.) **Third instance reached — promotion-ready
  per the previous napkin's annotation.**
- **`fork-cost-surfaces-in-doc-discipline-layer`** — three-instance
  pattern where architectural forks propagate as doc-discipline
  issues before they surface as architectural ones. **Third
  instance reached — promotion-ready.**

### Promotion-ready (already ≥2 cross-session instances — surfaced to owner at this consolidation)

These sit above the napkin and should be graduated this pass per
step 7 of `jc-consolidate-docs`. See the consolidation report in
this session's response to the owner for the graduation list and
proposed destinations.

- **`reviewer-findings-applied-in-close` (three instances: L-EH
  initial, L-DOC initial, primitives consolidation execution)** —
  reviewer findings land in the closing atomic commit as the
  default, not as follow-up queue items. Deferral requires written
  rationale.
- **`E2E-flakiness-under-parallel-pnpm-check-load` (three cross-
  session instances)** — first aggregate `pnpm check` run fails on
  an E2E test; isolation rerun passes 161/161; second aggregate
  run passes. Third instance 2026-04-19. **Name a test-stability
  lane.**
- **`reviewer-catches-plan-blind-spot` (≥2 instances, now
  promotion-ready)** — reviewer real-code audit catches a plan's
  own blind spot that the plan's decomposition did not anticipate.
- **`externally-verifiable-output-beats-plan-compliance` (already in
  distilled from single-instance observation; now multiple
  confirmations)** — forward-motion assurance is an external
  artefact (cell populated, test passes, command exits 0), not
  plan-compliance narrative.

---

Previous rotation: 2026-04-19 (morning) at ~500 lines.
Today's second rotation: 2026-04-19 (evening) at ~1679 lines.
