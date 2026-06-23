# Upstream Spec-Change Automation — Strategic Plan

**Status**: NOT STARTED (strategic brief)
**Domain**: SDK and MCP Enhancements
**Source session**: 2026-06-18, Bluebell guards Acorn — examination of the
`/sequences/{slug}` → `/sequences/{sequence}` upstream rename and its
spec → types/constants → SDK → MCP-app pipeline impact.

## Problem and Intent

When the upstream Oak Open Curriculum OpenAPI spec changes, the repo realigns
through a **manual runbook**
([`oak-sdk-codegen/README.md` §"Responding to Upstream Spec Changes"](../../../../packages/sdks/oak-sdk-codegen/README.md)):
a human notices the change, characterises the drift first-hand, runs
`pnpm sdk-codegen`, runs the gate chain, and opens a PR. The 2026-06-12
alignment (this repo's PR #200, responding to upstream oak-openapi PR 269) and
the 2026-06-18 `slug`→`sequence` sync both ran this path by hand.

The runbook is sound, but every step is human-triggered. The intent is to move
the pipeline toward **automatic and correct**: upstream changes are detected,
regenerated, validated, classified, and surfaced as a review-ready PR without a
human having to notice the change first — while never weakening the correctness
guarantees that make the regeneration trustworthy.

## What Already Works (do not rebuild)

The 2026-06-18 examination established, first-hand, that the *correctness* half
of the pipeline is already strong:

- **Single-source codegen.** Every API tool's input schema comes only from the
  generated descriptor; generated files are `DO NOT EDIT` and reproduced by the
  generator. There is no seam for a hand-authored API-tool parameter.
- **Compile-time enforcement of the spec→parameter flow.** `api-paths-types.ts`
  is spec-typed; each tool's nested `ToolPathParams` is `satisfies
  ToolDescriptor<…>` against it; `transformFlatToNestedArgs(flat): ToolArgs` is
  typed so the flat→nested round-trip (including the deliberate
  `normaliseParamName` `Slug`-stripping, e.g. `threadSlug`→`thread`) will not
  compile if it drifts. Proven: a deliberate `sequence`→`slug` drift fails
  `tsc` with `error TS2322`. **This invariant is the type checker's job, not a
  vitest test's** — a vitest assertion over parameter names would prove
  configuration and duplicate `tsc`.
- **Codegen idempotency.** Re-running `sdk-codegen` reproduces byte-identical
  output, so the committed generated files *are* the current spec.
- **Correction-layer tripwires.** `param-description-overrides` removal-condition
  tests fail by design when upstream fixes a corrected claim.

The automation work below **consumes** these guarantees; it does not replace
them.

## Gaps Toward Automatic-and-Correct

1. **Detection is manual.** Nothing watches `info.version` (the `0.7.0-<sha>`
   build hash) for movement. A change is noticed only when someone runs codegen
   in online mode.
2. **Regeneration is manual and non-deterministic locally.** The local default
   fetches the live spec; turbo caching can mask a live-spec change (runbook
   §"Run the designed alignment path"). There is no scheduled, deterministic
   regenerate-and-diff.
3. **Breaking-change classification is absent.** The runbook separates
   *structural* from *documentation* drift, but does not classify a structural
   change as **consumer-breaking vs additive**. A path/param rename flows
   cleanly through codegen yet *is* a consumer-facing contract change.
4. **PR creation is manual.** The regenerated diff is opened by hand.

## End Goal, Mechanism, and Means

**End goal:** an upstream spec change becomes a review-ready PR — regenerated,
validated, and classified — without a human needing to notice the change first;
correctness is guaranteed by the existing compile-time + idempotency layers, not
by new tests.

**Mechanism:** a scheduled CI job closes the detection→regenerate→validate→
classify→PR loop, with each step using the right tool for its job, so the only
remaining human act is review-and-merge.

**Means (phased; each phase is independently valuable and shippable):**

- **Phase 1 — Detection signal.** A scheduled job fetches the live spec
  (`https://open-api.thenational.academy/api/v0/swagger.json`) and emits a signal
  (issue/notification) only when `info.version` has moved **and** the
  prose-stripped normalised diff is non-empty — i.e. a structural change, not a
  documentation-only deploy (which moves the build hash without a contract
  change). The prose-only filter is intrinsic to detection, not deferred: a bare
  `info.version` comparison would fire on every doc deploy. Right tool: a small
  fetch-normalise-compare script; no regeneration yet. *Minimum shippable shape:*
  structural-change detection + notification only.
- **Phase 2 — Auto-regenerate and PR.** On a detected change, CI regenerates
  (online mode, bypassing the turbo cache for this task), runs the gate chain,
  and on green opens a PR carrying the diff. Right tools: `sdk-codegen` +
  `tsc` + codegen-idempotency re-run + the existing behaviour/e2e suites.
- **Phase 3 — Breaking-change classification.** Classify the normalised spec
  diff as additive vs consumer-breaking (path removed/renamed, parameter
  removed/renamed, required-ness tightened, response type narrowed) and label the
  PR + draft a changelog/migration note for consumer-breaking changes. Right
  tool: a diff-classifier over the two normalised specs; not a test.
- **Phase 4 — Correctness gate as required checks on the auto-PR.** Distinct
  from Phase 2 (which runs the gates *before* opening the PR), Phase 4 wires
  `tsc` (spec→param flow), codegen idempotency, the served-surface check (runbook
  §"Verify the served surface"), and the correction-layer tripwires as
  **branch-protection required checks** on the bot-authored PR, so it cannot
  merge if any fail regardless of how it was opened. Human approval remains the
  merge gate.

## Domain Boundaries and Non-Goals

- **Non-goal: auto-merge.** A human approves every spec-sync PR while the API is
  pre-GA. Automation produces the PR; it does not merge it.
- **Non-goal: new vitest tests for the spec→parameter invariant.** That property
  is compile-time-enforced; adding a runtime test would prove configuration and
  duplicate `tsc` (owner directive, 2026-06-18).
- **Non-goal: changing upstream.** Upstream contract decisions (e.g. whether a
  param rename bumps semver) are out of scope; classification reports them.
- **Non-goal: classifying documentation-only drift as breaking.** Prose-only
  deploys move the build hash without a contract change.

## Dependencies and Sequencing Assumptions

- **Phase 1 → 2 → 3 → 4** is the natural order, but Phases 1 and 3 are
  independently useful (detection alone; classification can run on a
  hand-opened PR). Classification: `beneficial`, not `blocking`, for Phase 2 —
  Phase 2 can ship opening an unclassified PR, with Phase 3 enriching it later.
- **Blocking prerequisite for Phase 2:** a CI environment permitted to fetch the
  live spec and open PRs (token scope, network policy).
- **Beneficial prerequisite:** an `oak-openapi` checkout available to CI for
  `git log <cached-sha>..<live-sha>` source-level change reading; minimum
  shippable shape without it is `GET /changelog/latest` plus the normalised diff.

## Strategic Acceptance Criteria and Success Signals

- An upstream spec change is surfaced as a notification (Phase 1) or a
  review-ready PR (Phase 2) with **no human having noticed the change first**.
- The auto-PR carries an accurate additive/consumer-breaking label and, when
  consumer-breaking, a drafted changelog/migration note (Phase 3).
- The correctness gate (Phase 4) is the existing compile-time + idempotency
  layers — **no new vitest test is introduced** to prove the spec→parameter flow.
- Success signal: the next upstream rename after this plan lands is handled by
  the pipeline opening a labelled PR, and a human's only act is review.

## Risks and Unknowns

- **Online-fetch non-determinism / turbo cache masking** — mitigated by running
  the package script directly and verifying `info.version` moved in both the
  cache and the generated `api-schema-original.json` (runbook already documents
  this).
- **Auto-PR noise** — documentation-only deploys move the build hash; Phase 1
  must distinguish prose-only drift (normalised diff empty apart from
  `info.version`) from structural drift before opening a PR.
- **Breaking-change misclassification** — classification is advisory; the human
  reviewer is the backstop, and Phase 4's compile-time gate catches any change
  that breaks the typed flow regardless of label.
- **Upstream auth/availability for scheduled fetch** — unknown CI network
  policy; resolved at promotion.

## Promotion Trigger Into `current/`

Promote when the owner prioritises the automation lane, **or** when a spec
change is missed because detection was manual. The upstream-change-frequency-vs-
CI-cost evidence informs the owner's prioritisation rather than gating it (owner
priority alone suffices). Until then the manual runbook is the supported path.
Execution decisions (CI surface, classifier shape, PR-bot identity) finalise
only at promotion to `current/`.

At promotion, prefer a **GitHub-native** scheduled workflow (`schedule:` trigger
plus `gh pr create` / a maintained create-pull-request action) over a bespoke
orchestrator; evaluate build-vs-buy before writing any custom wiring.

## Implementation-Detail Note

The commands and mechanisms above are reference context from the 2026-06-18
examination, not an in-progress execution commitment. Execution decisions are
finalised only during promotion to `current/`/`active/`.
