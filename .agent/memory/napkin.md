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
