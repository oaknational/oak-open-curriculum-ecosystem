# Next-Session Record — `observability-sentry-otel` thread

**Last refreshed**: 2026-04-24 (Frodo / claude-code / claude-opus-4-7-1m
— 1M-context session continuing Frodo identity per PDR-027 additive
rule). Landed two commits against the release-identifier plan:
`9a0f9ebc` (docs(plans) landing of Pippin's plan-revision substance
plus observability thread carry-forward) and `a4e8facb` (WS2 §2.0
BLOCKING fix: `resolveGitSha` split from `runtime-metadata.ts` into
a new `git-sha.ts` module decoupled from `@oaknational/env` +
structural fitness test). WS2 §2.1-§2.7 deferred to a fresh session
at owner direction (see §Landing Target for the trade-off
rationale). Session opened with `/jc-start-right-thorough` wrapping
`/jc-metacognition` and a long directive payload; the metacognition
artefact at `/Users/jim/.claude/plans/jc-metacognition-analyse-the-
following-adaptive-flame.md` was approved before execution and
captured the payload's behavioural-containment shape (derived from
Pippin's spiral-session experience file).

**Prior refresh**: 2026-04-24 (Pippin / cursor / claude-opus-4-7)
after a planning + reviewer-cycle session that did not land code.
The session opened on WS1 RED but pivoted into a structural
collapse decision (two resolvers → one, accepted by owner), then
Tier 1 review (Fred + Betty + Barney + assumptions-reviewer),
plan revision, Tier 2 review (Wilma + 2 docs-adr-reviewer
rounds), full plan revision addressing all findings, and a
3-layer pre-flight WS1 audit (string-pattern `rg`, import-site
`rg` including dynamic imports, `pnpm knip` + `pnpm depcruise`).
The plan body grew from ~700 → ~1700 lines of substantive,
review-driven, code-shaping revisions. Plan changes remain
**uncommitted** in the working tree (12 staged files, see
§Current state for the full set inherited from prior sessions
plus this session's revisions). Next session opens with the plan
in a substantially more robust state and proceeds directly to
WS2 GREEN execution; WS1 RED has been folded into WS2's TDD
discipline (see §Current state). Owner intervention mid-session
broke a review-cascade spiral and surfaced a meta-pattern
captured in [`napkin.md`](../../active/napkin.md) and
[`experience/2026-04-24-pippin-the-spiral-i-could-not-see.md`](../../../experience/2026-04-24-pippin-the-spiral-i-could-not-see.md).

**Prior refresh** (2026-04-24, same day): captured the small
intra-session test-relocation micro-lane that landed in
`6764457d`; before that, captured the cross-cutting meta-session
sweep at `ffec98b0` which folded this thread's previously-
uncommitted plan-body refinement into a larger commit alongside
practice/process restructuring, vendor-skills expansion, and
three new parallel plans.

**Repo-wide changes the next session must know about** (landed in
`ffec98b0`, may affect grounding reads at session start):

1. **Practice surface relocation** — `continuity-practice.md` moved
   from `docs/governance/` to
   [`.agent/directives/continuity-practice.md`](../../../directives/continuity-practice.md).
   Any directive-grounding read should hit the new location. The
   `docs/governance/` README and `.agent/directives/principles.md`
   were updated alongside.
2. **Napkin rotated** — the prior session's pattern-instance entry
   (WS3-as-verify framing surprise; second instance of
   `inherited-framing-without-first-principles-check`) is preserved
   in
   [`archive/napkin-2026-04-22b.md`](../../active/archive/napkin-2026-04-22b.md)
   and contributes to the permanent pattern file at
   [`patterns/inherited-framing-without-first-principles-check.md`](../../active/patterns/inherited-framing-without-first-principles-check.md).
   The PDR-015-amendment candidate (assumption-challenge gate per
   architectural-review output) remains in the pending-graduations
   register at
   [`repo-continuity.md § Deep consolidation status`](../repo-continuity.md#deep-consolidation-status)
   — trigger condition (i) is met, awaiting (ii) or (iii).
3. **Three new parallel plans** are active alongside this thread —
   none block release-identifier work, but the next session should
   know they exist so cross-plan coordination is deliberate:
   - [`agent-infrastructure-portability-remediation.plan.md`](../../../plans/agentic-engineering-enhancements/current/agent-infrastructure-portability-remediation.plan.md)
     — three-layer artefact-model audit + remediation. Touches
     `.agents/skills/`, `.claude/skills/`, ADR-125, vendor skill
     installations. **Coordination flag**: this plan's Phase 1
     canonicalisation pass already removed `.claude-plugin/plugin.json`
     shells across `.agents/skills/clerk-*/`. Future vendor-skill
     installs touched by observability work should read its current
     state before installing.
   - [`practice-and-process-structural-improvements.plan.md`](../../../plans/agentic-engineering-enhancements/current/practice-and-process-structural-improvements.plan.md)
     — fills structural gaps in the Practice (behavioural directive,
     planning skill, portability PDR/ADR). **Coordination flag**:
     when this plan lands `.agent/directives/collaboration.md`, the
     directive-grounding read at session start changes shape.
   - [`aggregated-tool-result-type-remediation.plan.md`](../../../plans/sdk-and-mcp-enhancements/aggregated-tool-result-type-remediation.plan.md)
     — composed-tool result-type pipeline. Eventually meets the MCP
     HTTP runtime work this thread covers; not blocking now.

Otherwise nothing about the release-identifier plan changed: WS0
remains landed at `06bf25d7`; WS1 RED (cross-resolver contract +
branch-URL precedence + cancellation wiring integration check) is
the next workstream; WS2 GREEN includes the resolver rewrite plus
the small `isValidReleaseName` denylist correction; WS3 is the
cancellation-script rewrite (~50 lines, canonical `semver` package,
branch gate added, asymmetric current/previous handling) + unit-test
rewrite + ADR-163 §10 re-amendment.

Owner-direction rules captured in the plan body's §Owner Direction
block (settled, not re-opened):

1. **Release identifier scheme**: production = root `package.json`
   semver at build time; preview = `VERCEL_BRANCH_URL` host (e.g.
   `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`).
   Build-time AND runtime resolvers must produce the SAME string per
   environment — single source of truth, no divergence.
2. **Production build cancellation**: builds on `main` cancelled
   unless the commit advances the root `package.json` semver beyond
   the previously-deployed version. Merge commits don't trigger
   production builds; only semantic-release commits do.

Discovery during the post-WS0 design discussion: the cancellation
script at
`packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`
(~205 lines, six unit-test branches) is over-built and missing the
branch-gate that ADR §1's truth table requires. The wiring (via
`apps/oak-curriculum-mcp-streamable-http/vercel.json`'s `ignoreCommand`)
is correct and stays unchanged. WS3 in the plan is now a **rewrite**
(~50 lines using the canonical `semver` npm package, branch gate
added, asymmetric current-vs-previous handling) + unit-test rewrite +
ADR-163 §10 re-amendment. Wiring integration check (originally WS3
work) folds into WS1.4 as planned.

The release-identifier work IS new code: WS1/WS2 rewrite
`resolvePreviewRelease` (build-time) and extend `resolveSentryRelease`
(runtime) to consume `VERCEL_BRANCH_URL` host; deletes the obsolete
`preview-<slug>-<sha>` shape and the `slugifyBranch` helper; lands a
cross-resolver contract test as the structural anti-drift gate.

The relevant plan surfaces are now:

- [`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
  — **next-session pickup**; the release-identifier alignment plan.
- [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
  — archived closure record for the completed repo-owned corrective
  lane.
- [`sentry-observability-maximisation-mcp.plan.md`](../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — parent context; the L-8 lane that landed the diverging
  build-time resolver this plan corrects.
- [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
  — separate future home for broader runtime simplification once
  owner-run validation is complete.
- [`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md)
  — closed note confirming monitor creation/operation are owner-external.

Underlying branch evidence still in force:
L-8 Correction WI 1-5 remain landed in `fb047f86`; the dedicated
`dist/server.js` deploy boundary is the verified deploy shape; the
shared Step 4 foundation work and the former
`oak-search-sdk` / `sdk-codegen` / `search-cli` backlog are retired as
authoritative history after the green repo-root rerun and the later
strict corrective pass.

**Consumed at**: WS0 ADR-163 amendment lands (done — `06bf25d7`).
Subsequent header rewrites refresh as workstreams land.
**Lifecycle**: rewrite as the plan moves through workstreams; delete
when the plan completes (WS7 doc propagation done, both rules proven
via Sentry MCP `find_releases` + the cancellation rule's existing
unit-test evidence + a captured cancellation event or controlled
rehearsal).

---

## Thread identity

- **Thread**: `observability-sentry-otel`
- **Thread purpose**: product-grade Sentry / OTel observability for
  the MCP HTTP server on Vercel, including release attribution,
  deploy proof, and request-context diagnostics.
- **Branch**: `feat/otel_sentry_enhancements` (branch-primary)

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| *`unattributed`* | *`unknown`* | *`unknown`* | *`unknown`* | `executor` | 2026-04-21 | 2026-04-21 |
| `Samwise` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `migration-maintenance` | 2026-04-21 | 2026-04-21 |
| `Merry` | `cursor` | `claude-opus-4-7` | *`unknown`* | `cleanup-only` | 2026-04-22 | 2026-04-22 |
| `Pippin` | `cursor` | `claude-opus-4-7` | *`unknown`* | `diagnosis-correction-implementation-doctrine-landing-plan-rewrite-release-identifier-plan-queueing-WS0-amendment-landing-post-WS0-WS3-cancellation-rewrite-design-into-plan-body-and-meta-session-sweep-commit-then-tier1-collapse-then-tier2-revisions-then-WS1-pre-flight-audit-no-code-landed` | 2026-04-22 | 2026-04-24 |
| `Codex` | `codex` | *`unknown`* | *`unknown`* | `repo-owned-repair-closeout-and-doc-consolidation` | 2026-04-23 | 2026-04-23 |
| `Frodo` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `commit-owner-pre-staged-plan-body-tightening-incidental-to-primary-session-work-on-plugin-capture-surface-wiring-and-sonarjs-plan; then-release-identifier-plan-revision-landing-and-WS2-§2.0-module-split-with-structural-fitness-test-and-§2.1-§2.7-deferred-to-fresh-session-by-owner-direction` | 2026-04-24 | 2026-04-24 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; they do not rewrite older attribution.

---

## Landing Target (per PDR-026)

**This session (release-identifier plan landing + WS2 §2.0 BLOCKING fix,
WS2 §2.1-§2.7 deferred)**: opener was the owner-authored payload
inside `/jc-start-right-thorough`: (1) commit the plan-revision
substance as a single `docs(plans)` landing; (2) WS2 §2.0 split of
`resolveGitSha` decoupled from `ROOT_PACKAGE_VERSION` as a single
commit; (3) WS2 §2.1-§2.7 unified `resolveRelease` + sentry-node
adapter + validator + caller-discipline. **Landed 1 and 2; 3
deferred.** Deferral-honesty discipline (per PDR-026):

- **What was attempted**: full payload sequence 1 → 2 → 3.
- **What landed**:
  - `9a0f9ebc` — `docs(plans): land release-identifier plan
    revisions + observability thread carry-forward`. 5 files,
    +1723/-627. Release-identifier substance only; practice-
    enhancement staged files (agentic-engineering-enhancements
    plan set, AGENT.md collaboration-reference, untracked
    collaboration directive + rule files) were left staged/
    untracked by explicit pathspec commit, not unstaged, per the
    "do not interfere with the parallel track's staging state"
    discipline the owner's mid-session note sharpened.
  - `a4e8facb` — `refactor(build-metadata): split resolveGitSha
    into git-sha.ts, decouple from @oaknational/env`. 6 files,
    +129/-111. WS2 §2.0 prerequisite: `resolveGitSha`,
    `GitShaSource`, `trimToUndefined`, `RuntimeMetadataError`,
    and `NO_DIAGNOSTICS` moved to
    `packages/core/build-metadata/src/git-sha.ts`;
    `runtime-metadata.ts` imports shared helpers back from
    `git-sha.ts`; `build-time-release.ts:15` re-points import;
    `index.ts` re-exports re-pointed. 3 `resolveGitSha` unit
    tests moved to new `tests/git-sha.unit.test.ts` alongside
    the new structural fitness test (asserts `git-sha.ts`
    source contains no reference to `@oaknational/env`).
    External app consumers (`oak-search-cli`,
    `oak-curriculum-mcp-streamable-http`) unchanged — they
    import via the package public API. 45 build-metadata tests
    pass; full pre-commit gates green (format, markdownlint,
    knip, depcruise clean at 1954 modules / 0 violations, 74
    turbo tasks).
- **What prevented WS2 §2.1-§2.7**: named priority trade-off —
  *single-atomic-commit discipline vs session context depth*.
  The plan explicitly mandates WS2 §2.1-§2.7 as one atomic
  commit (WS2 overall is one commit per the plan's stated
  discipline; §2.0 was split off by the payload as a separate
  commit because it is structurally independent). The remaining
  §2.1-§2.7 scope: type rename cascade (`BuildTimeRelease*` →
  `Release*` across types file, build-info.ts, index.ts,
  esbuild.config.ts, sentry-build-plugin.ts), shape change
  (`ResolvedRelease` drops the `gitSha` field), new
  `resolveRelease` implementation with `new URL()` preview
  parsing, sentry-node thin-adapter (dep add + types extends
  `ReleaseInput` + config-resolution delegation), atomic
  replacement (delete `slugifyBranch`, rewrite `preview-<slug>-<sha>`
  fixtures in `build-time-release.unit.test.ts` and
  `sentry-configured-build-gate.unit.test.ts`),
  `isValidReleaseName` rewrite per Sentry's documented denylist,
  caller-discipline snapshot at ~5 call sites. Scope estimate:
  3 packages × ~15 files with cascading type renames + test-
  fixture updates. Session at the decision point was ~60+
  turns deep with accumulated context from metacognition,
  reflective reading, and two substantive commits. Direct
  recommendation to owner: hand off to fresh session rather
  than push through under attention/context pressure; owner
  accepted (*"we will continue in a fresh session, run the
  session handoff process please"*).
- **Falsifiability**: a future agent opens a fresh session,
  reads the plan's WS2 §2.1-§2.7 sections, and lands the single
  atomic commit with all gates green. If that fresh session
  encounters material blockers not foreseen in the plan body
  (true unknown-unknowns, not cascading type-rename mechanics),
  the trade-off is refuted — a fresh session wasn't the missing
  ingredient. If they land cleanly in one commit, the trade-off
  held.
- **What next session re-attempts**: WS2 §2.1-§2.7 as a single
  atomic commit per the plan body, starting from branch HEAD
  `a4e8facb`. Plan authority is durable; `git-sha.ts` is
  stable; type shape changes now cascade from a known clean
  foundation. See §Next safe step for the step-by-step
  sequence.

**Behavioural note**: the session-opening metacognition artefact
(reviewed and approved before execution began) was the load-
bearing scaffold that held the payload's discipline. Reading
Pippin's `experience/2026-04-24-pippin-the-spiral-i-could-not-
see.md` as a felt-sense signal (not as intellectual history)
prevented the opening impulse to survey the plan or confirm
the WS1 supersession claim. The pause-and-handoff decision at
the WS2 §2.0/§2.1 boundary was an instance of the same
restraint applied at a different scale — recognising that
attempting a large atomic refactor under accumulating session
context is a variant of the Pippin spiral shape, and
volunteering the hand-off earned the clean commit boundary.
Captured in napkin + (possibly) an experience file at session
close.

---

**Prior session (planning + reviewer cycle, no code landed)**:
opener was *"WS1 RED contract tests, separate commit / turn
boundary"*. **Unlanded.** What was attempted, what prevented,
what next session re-attempts (per PDR-026 §Deferral-honesty
discipline):

- **What was attempted**: WS1 RED contract tests on the
  release-identifier plan.
- **What prevented**: a named owner trade-off, not a clock or
  budget excuse. The owner explicitly directed the sequence
  Tier 1 review → revise → Tier 2 review → fix all → audit
  before any code execution (selections recorded in transcript
  `4c46c2fc-2f86-493b-8049-30c9a318fd7e`:
  `tier1_then_review`, `revise_then_tier2`, `fix_all_then_go`).
  Mid-cycle the architectural-collapse decision (two resolvers
  → one core, sentry-node delegates) was accepted, which made
  the WS1 RED tests as originally specified obsolete (the
  cross-resolver contract test no longer makes sense once the
  resolvers structurally cannot diverge — `SentryConfigEnvironment
  extends ReleaseInput` makes shape divergence impossible by
  construction).   Tier 2 review then surfaced 1 BLOCKING
  (eager `readFileSync` at module init via `ROOT_PACKAGE_VERSION`
  → resolved via new WS2 §2.0 module-split prerequisite),
  plus 7 MAJOR/MINOR Wilma findings, plus 3 BLOCKING / 8 MAJOR /
  5 MINOR/NIT docs-adr-reviewer findings that materially reshaped
  WS1, WS2, WS3, WS3.4 (ADR-163 §10 second amendment), and the
  Documentation Propagation table. WS1 audit (3 layers,
  read-only) confirmed no architectural surprises blocking WS2.
- **Falsifiability**: the owner's explicit selections are
  preserved in the agent transcript; the plan diff
  (`git diff --cached .agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`,
  ~+994 lines) is the artefact of the cycle; the WS1 audit
  outputs are reproducible by re-running the three audit layers
  named in the plan body's WS1 section. A future agent can
  verify whether the trade-off held (deeper plan robustness for
  one session of zero-code) by checking whether WS2's first
  commit advances the plan to GREEN with materially fewer
  in-flight reviewer cycles than would have been needed without
  this session's work.
- **What next session re-attempts**: WS2 GREEN — the resolver
  collapse implementation. WS1 RED as originally specified is
  superseded; per the revised plan, RED tests are now folded
  into WS2 step-by-step under TDD discipline (see
  [§Next safe step](#next-safe-step) below).

**Prior session (meta-session sweep — preserved for audit)**: the
previously-uncommitted plan refinement landed inside the
cross-cutting meta-session sweep at commit `ffec98b0` (80 files,
+12732/-3970), per explicit owner direction "commit all files
including from other threads". That
sweep also landed practice/process restructuring (continuity-practice
directive relocation, principles update, napkin rotation, history
archive split), vendor-skills expansion (Clerk backend API,
custom-ui core-2/core-3, orgs references), three new parallel plans
(portability remediation, practice/process structural improvements,
aggregated-tool result-type remediation), and engineering-doc
updates (ADR-078, build-system, testing-patterns, typescript-gotchas).

Pre-commit gates passed in 104s; HEAD = `ffec98b0`; working tree
clean. The commit-choice complexity flagged in the prior handoff
("Option A standalone vs Option B fold into WS1 RED") is resolved by
this sweep — WS1 RED now lands as a clean separate commit with no
plan-authority debt to settle first.

**Prior session (post-WS0 plan-body refinement — preserved for
audit)**: refined the plan body to encode the agreed WS3
cancellation-script rewrite (~50 lines, canonical `semver` package,
branch gate, asymmetric current/previous handling) + folded the
validator denylist correction into WS2. Landing was deferred at
owner direction to a session-handoff; the deferred commit folded
into the meta-session sweep above.

**Prior session (WS0 amendment landing — preserved for audit)**: WS0
of
[`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
in commit `06bf25d7`:

- ADR-163 §1 rewritten with the per-environment release-identifier
  truth table (production = root `package.json` semver;
  preview/non-main-production = `VERCEL_BRANCH_URL` host's leftmost
  label; development = `dev-<shortSha>`; `SENTRY_RELEASE_OVERRIDE`
  always wins; both build-time and runtime resolvers must produce the
  SAME string per environment).
- ADR-163 §10 added: production-build cancellation rule formalised,
  including its truth table, the canonical script path
  (`packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`),
  the workspace shim, the `vercel.json` `ignoreCommand` wiring, and
  the fail-open trade-off when previous-version resolution fails.
- §3 and §5 cross-linked to §1's per-environment grain so the "one
  release → many deploys" model now operates per-environment, not
  across the preview→production boundary.
- Process-gap finding: cross-resolver contract test named as the
  structural anti-drift gate (not procedural review discipline),
  with the new `libs ← core` devDependency edge documented.
- Four new Alternatives Considered entries (#11–#14) and two new
  Enforcement items (#5 cross-resolver contract; #6 cancellation
  wiring integration).
- Reviewer Dispositions block records the WS0.2 reviewer pass:
  `assumptions-reviewer`, `sentry-reviewer`,
  `architecture-reviewer-fred` — all BLOCKING + IMPORTANT findings
  ACCEPTED and applied (notably: qualifying `VERCEL_BRANCH_URL` as
  an Oak operational assumption rather than a Vercel guarantee;
  noting Oak's `SENTRY_RELEASE_NAME_PATTERN` diverges from Sentry's
  documented rules; reframing the impact as "split-release
  pollution" of Sentry release-health metrics).

Evidence:

- ADR amendment + plan file landed in `06bf25d7` (single commit, all
  pre-commit gates passed including dep-cruise + 74-task turbo cache);
- `feat/otel_sentry_enhancements` branch advanced;
- WS1 is the next workstream and lands as a separate commit per the
  user's turn-boundary instruction.

---

## Lane State

### Owning plan(s)

- **Next-session pickup**:
  [`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
  — release-identifier alignment + ADR-163 amendment + cancellation
  ADR linkage.
- **Repo-owned corrective lane closure record**:
  [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
- **Parent context**:
  [`sentry-observability-maximisation-mcp.plan.md`](../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
- **Separate future work**:
  [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
- **Closed repo monitoring lane**:
  [`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md)

### Current objective

Land the release-identifier single-source-of-truth plan WS by WS.
WS0 is **landed** (`06bf25d7`). Next: WS1 RED contract tests
(cross-resolver contract + branch-URL precedence + cancellation
wiring integration check), then WS2 GREEN resolver rewrite.

### Current state

- **Latest session (2026-04-24, Frodo / claude-code / claude-opus-4-7-1m,
  release-identifier landing + WS2 §2.0 BLOCKING fix, §2.1-§2.7
  deferred)**: two commits landed on `feat/otel_sentry_enhancements`
  — `9a0f9ebc` (plan-revision landing as `docs(plans)`, 5 files,
  +1723/-627) and `a4e8facb` (WS2 §2.0 split of `resolveGitSha`
  into new `packages/core/build-metadata/src/git-sha.ts`, 6 files,
  +129/-111). Codex subsequently landed a parallel-track
  practice-remediation commit sequence (`b40bc994`, `d2acdefb`,
  `991c552c`, `f6fd524e`, `69fd4f8c`) on top of the observability
  commits; branch HEAD at handoff time is `69fd4f8c`. The
  practice-track commits do NOT modify observability substance —
  they add collaboration directive + rules, canonicalise portable
  skill adapters, land plan coordination, etc. The fresh session
  opens from whatever branch HEAD is at that time (HEAD may
  advance further via continued parallel-track work); the
  observability substance (`resolveGitSha` split, plan revisions)
  remains intact either way. Working tree retains the practice-enhancement parallel
  track's staged/unstaged state untouched — `.agent/directives/
  AGENT.md` (staged collaboration-reference), the
  `.agent/plans/agentic-engineering-enhancements/` staged set,
  untracked `collaboration.md` + `follow-collaboration-practice.*`
  files, plus a wide set of unstaged modifications under
  `.agents/skills/` and adjacent surfaces (parallel-track WIP).
  **Architectural state post-§2.0**: `resolveGitSha` no longer
  transitively imports `@oaknational/env`; structural fitness test
  is the durable regression guard. `runtime-metadata.ts` keeps
  `resolveApplicationVersion` + `getDisplayHostname` and imports
  `trimToUndefined` / `RuntimeMetadataError` / `NO_DIAGNOSTICS`
  back from `git-sha.ts` (edge runtime-metadata → git-sha is
  clean; the env-dep'd module imports from the non-env-dep'd
  module, no cycle). External app consumers (`oak-search-cli`,
  `oak-curriculum-mcp-streamable-http`) import
  `resolveGitSha` via the package public API and needed no
  changes. `@oaknational/sentry-node`'s internal `resolveGitSha`
  (in `config-resolution.ts:174`) remains unchanged — it is
  defensive validation of structured inputs (not a parallel
  implementation of the same resolver), per Pippin's audit
  note.
- **WS2 §2.1-§2.7 remains open** with full scope per the plan
  body: new `resolveRelease` unified resolver in
  `@oaknational/build-metadata`, thin-adapter delegation from
  `@oaknational/sentry-node`, validator alignment with Sentry's
  documented denylist, caller-discipline snapshot pattern.
  Cascading type renames are known and enumerated in the plan.
  See §Next safe step for concrete sequence.
- **Prior session (2026-04-24, Pippin, planning + reviewer cycle)**:
  no commits landed; the working tree carried 12 staged files
  including ~+994 lines of substantive plan revision to
  [`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md).
  Architectural shape changed materially: **two resolvers
  collapsed to one** (`resolveRelease` in
  `@oaknational/build-metadata`; `@oaknational/sentry-node`
  becomes a thin adapter — `SentryConfigEnvironment extends
  ReleaseInput`). New types added to plan: `ReleaseInput`,
  `ReleaseSource`, `ReleaseEnvironment`, `ResolvedRelease`,
  `ReleaseError`. WS3.4 ADR-163 §10 second-amendment
  enumeration grew to 13 items (covers §1 retraction of the
  cross-resolver-contract-test framing, top-level Enforcement §5
  retraction, History entry preserve-and-add discipline, ADR
  index update per ADR-053 precedent, Disposition #4 retraction).
  New WS3.0 step adds a pre-landing reviewer dispatch on the
  amendment text. 1 BLOCKING (eager `readFileSync` at module
  init via `@oaknational/env`'s `ROOT_PACKAGE_VERSION`) resolved
  by new WS2 §2.0 prerequisite: split `resolveGitSha` into a
  module that does NOT import `ROOT_PACKAGE_VERSION` + add a
  structural fitness test. WS2 §2.7 added: caller-discipline
  rule (snapshot env at boundary, never mutate). WS5 quality
  gates updated to include `pnpm knip && pnpm depcruise`.
  Documentation Propagation table corrected (3 wrong paths
  fixed; 5 missing rows added; ADR index row added; CLI usage
  doc row added). `sentry-build-plugin.ts` path corrected
  (lives at `apps/oak-curriculum-mcp-streamable-http/build-scripts/`,
  not `packages/libs/sentry-node/src/`).
- **Pre-flight WS1 audit completed (this session, read-only,
  no commits)**: 3 layers — string-pattern `rg`, import-site `rg`
  (incl. `await import()` patterns), `pnpm knip` + `pnpm depcruise`.
  Knip + depcruise both clean (1952 modules, 4232 deps, 0
  violations). Audit "surprises" investigated and dissolved:
  `oak-search-cli` consumes `resolveGitSha` (already in WS3
  propagation scope by virtue of being in the import graph);
  `runtime-config-support.ts` files in both apps re-export
  `resolveGitSha` (handled by re-export rename mechanics);
  `@oaknational/sentry-node`'s `resolveGitSha` (config-resolution.ts:174)
  is **defensive validation of structured inputs**, not duplicate
  resolution — misleading naming, not architectural drift, the
  rename can be deferred to a future hygiene sweep without
  blocking WS2; `esbuild.config.ts` imports `ResolvedBuildTimeRelease`
  type which is handled by WS2's type-rename mechanics.
- **Intra-session micro-lane (prior 2026-04-24 session, `6764457d`)**:
  deleted
  `apps/oak-curriculum-mcp-streamable-http/e2e-tests/tool-examples-metadata.e2e.test.ts`
  and added
  `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/flat-zod-schema.integration.test.ts`
  to relocate the only assertion in the deleted file not already
  covered at integration level (aggregated-`fetch` `id` examples).
  Triggered by a 60s timeout on `pnpm test:e2e` under pre-push
  concurrency; deeper analysis showed the test violated the
  testing-strategy directive on three counts (testing upstream
  libraries, duplicating existing proofs, asserting content at
  E2E level). E2E suite now 22 files / 155 tests (was 23 / 159);
  no functional code changed.
- WS0 landed: ADR-163 amendment + plan file in `06bf25d7`; continuity
  refresh in `7b4de7a4`.
- Plan body refined to encode the WS3 cancellation-script rewrite +
  WS2 validator denylist correction; **landed in the meta-session
  sweep at `ffec98b0`** alongside cross-cutting practice/portability/
  sdk-mcp work. Plan authority is now durable; next session opens
  the plan, reads the current WS3 + WS2.5 sections as authoritative,
  and proceeds straight to WS1 RED.
- Cancellation script at
  `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`
  is over-built (~205 lines, hand-rolled semver parser/comparator,
  missing the `VERCEL_GIT_COMMIT_REF === 'main'` branch gate that ADR
  §1's truth table requires). WS3 in the plan is now a **rewrite**
  (~50 lines using the canonical `semver` npm package) + unit-test
  rewrite + ADR-163 §10 re-amendment to match the simpler shape.
  Wiring (via `apps/oak-curriculum-mcp-streamable-http/vercel.json`'s
  `ignoreCommand`) is correct and stays unchanged; the wiring
  integration check folds into WS1.4.
- `semver` is NOT yet a workspace dependency; WS3.1 adds it to
  `packages/core/build-metadata/package.json`.
- Build-time `resolvePreviewRelease` still emits
  `preview-<slug>-<sha>` (the divergent shape); runtime
  `resolveSentryRelease` still emits semver everywhere. WS1 RED
  tests pin the new contract, WS2 GREEN rewrites both resolvers to
  consume `VERCEL_BRANCH_URL` host's leftmost label, AND corrects
  `isValidReleaseName` to mirror Sentry's documented denylist (accept
  `latest`, reject `/`).
- `VERCEL_BRANCH_URL` is already in the env schema
  (`apps/oak-curriculum-mcp-streamable-http/src/env.ts`) and used in
  `runtime-config.ts` for hostname allowlisting; no schema change
  needed for the resolver work.
- The bounded repo-owned corrective lane remains complete and
  archived; `fb047f86` still supplies L-8 Correction WI 1-5; the
  `dist/server.js` deploy boundary is the verified deploy shape.
- No active repo-owned blocker beyond the plan's WS sequence.

### Blockers / low-confidence areas

- WS1 sets up the cross-resolver contract test as a new file; needs
  to live where both `packages/core/build-metadata` and
  `packages/libs/sentry-node` are accessible. ADR §1 + §10 names the
  edge as `libs ← core` devDependency; WS1 establishes that edge if
  not already present.
- WS1 cancellation-wiring integration check must read
  `apps/oak-curriculum-mcp-streamable-http/vercel.json` and assert
  the `ignoreCommand` resolves to the canonical script via the
  workspace shim — i.e. catches accidental shim deletion or path
  drift, not script logic (already covered by unit tests).
- End-to-end Sentry verification (WS6) requires a fresh preview
  deploy after WS2 lands. Push a no-op commit on
  `feat/otel_sentry_enhancements` if needed to trigger the deploy.

### Standing decisions

- This was **one bounded repo-owned follow-through lane**, not an
  ongoing stream of repo monitoring work.
- There is **no repo-owned monitor setup lane**. Repo scope stops at a
  clean handoff into owner-handled validation; monitor setup remains
  outside the repo.
- There are **no follow-up placeholders**. Future work either has a
  real home or is deleted.
- Canonicalisation remains valuable, but it is explicitly separate
  from the deploy-boundary repair.
- The local runner stack stays unless the verified deploy contract
  proves a smaller change is required.
- No child-process proof in tests. Production-only branches are covered
  by DI-friendly code tests plus a realistic production-build gate
  under representative env.
- A green repo-root rerun retires the old consumer backlog, but it does
  not replace a correctness review against the repository rules.
- No fallbacks, no wrappers, no JS-specific override paths, no
  compatibility layers.
- One fixed ESM-only export-surface contract across internal
  workspaces; no CJS support and no per-workspace improvisation.
- No further repo coding session is queued on this lane unless
  owner-run validation surfaces a fresh repo defect.

### Next safe step

**Branch HEAD is `a4e8facb`**. WS2 §2.0 is landed; the remaining
WS2 §2.1-§2.7 is a single atomic commit per the plan's explicit
"WS2 ... in one commit" discipline. Full scope (read the plan
body's WS2 §2.1-§2.7 for canonical detail):

1. **§2.1 Define unified types** in
   `packages/core/build-metadata/src/build-time-release-types.ts`:
   - `ReleaseInput` — drop the `[key: string]: string | undefined`
     index signature (Wilma MINOR #11). Fields: `SENTRY_RELEASE_OVERRIDE?`,
     `VERCEL_ENV?`, `VERCEL_BRANCH_URL?`, `VERCEL_GIT_COMMIT_REF?`,
     `VERCEL_GIT_COMMIT_SHA?`, `APP_VERSION?`.
   - `ReleaseSource` = `'SENTRY_RELEASE_OVERRIDE' | 'application_version'
     | 'vercel_branch_url' | 'development_short_sha'` — **delete
     `preview_branch_sha`**.
   - `ReleaseEnvironment` = `'production' | 'preview' | 'development'`
     (unchanged shape, renamed).
   - `ResolvedRelease` = `{ value, source, environment }` —
     **drop the `gitSha` field** from the old
     `ResolvedBuildTimeRelease`. Check callers for `.gitSha` use
     (`build-info.ts`, `persistBuildInfo` in `esbuild.config.ts`)
     and either re-resolve via `resolveGitSha` at the call site
     or thread gitSha separately; do NOT silently widen the type.
   - `ReleaseError.kind` variants: rename `missing_branch_in_preview`
     → `missing_branch_url_in_preview`; drop `invalid_git_sha`
     if no longer emitted. The final enum per the plan:
     `'invalid_release_override' | 'missing_application_version' |
     'invalid_application_version' | 'missing_branch_url_in_preview' |
     'missing_git_sha'`.
   - Retain legacy type aliases (`BuildTimeReleaseEnvironmentInput`,
     `BuildTimeReleaseSource`, etc.) only if external callers
     require them; the WS1 audit identified only internal
     consumers + the `sentry-build-plugin.ts` / `esbuild.config.ts`
     in `oak-curriculum-mcp-streamable-http`, so aliases likely
     unnecessary — remove cleanly.

2. **§2.2 Implement `resolveRelease`** in
   `build-time-release.ts` (keep file name; rename the exported
   function; retain `resolveBuildTimeRelease` as a trivial alias
   export to avoid a cascading rename of the
   `sentry-build-plugin.ts` + `esbuild.config.ts` call sites —
   or rename there too and drop the alias, owner's call). Logic
   per plan §2.2: `SENTRY_RELEASE_OVERRIDE` → override
   (validated via new §2.5 `isValidReleaseName`); effective
   environment derivation; production → `APP_VERSION` validated
   via `semver.valid()` (add `semver` as dependency to
   `packages/core/build-metadata/package.json` if not already
   present — note WS3 also needs `semver`, may already land
   earlier); preview → `new URL(input.VERCEL_BRANCH_URL)` with
   explicit rejection of malformed URL, empty hostname, IPv4/
   IPv6 literal, or host-label failing `isValidReleaseName`;
   development → `dev-<shortSha>` from `VERCEL_GIT_COMMIT_SHA`.

3. **§2.3 sentry-node thin adapter**:
   - `packages/libs/sentry-node/package.json` — add
     `@oaknational/build-metadata: workspace:*` as runtime
     `dependency`. Confirm `libs ← core` edge is permitted in
     `.dependency-cruiser.mjs` (it is; `no-core-to-libs`
     forbids the reverse only).
   - `packages/libs/sentry-node/src/types.ts` — make
     `SentryConfigEnvironment extends ReleaseInput` (import
     from `@oaknational/build-metadata`). Drop any fields
     duplicated in `ReleaseInput`.
   - `packages/libs/sentry-node/src/config-resolution.ts` —
     rewrite `resolveSentryRelease` body to delegate:

     ```typescript
     const result = resolveRelease(input);
     if (!result.ok) return err(toObservabilityConfigError(result.error));
     return ok(toResolvedSentryRelease(result.value));
     ```

     `toObservabilityConfigError` and `toResolvedSentryRelease`
     are pure total mappers.

4. **§2.4 Atomic replacement**:
   - Delete `slugifyBranch` from
     `build-time-release-internals.ts` (no consumers remain).
   - Delete `resolvePreviewRelease`'s old body; rewrite to
     use URL-parse logic or inline into `resolveRelease` body.
   - Update `build-time-release.unit.test.ts` — replace all
     `preview-<slug>-<sha>` assertions with
     `VERCEL_BRANCH_URL`-host assertions; update fixtures to
     supply `VERCEL_BRANCH_URL`.
   - Update
     `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-configured-build-gate.unit.test.ts`
     log-line assertions to match the new release-shape.
   - Update any other tests the `rg 'preview-'` audit in §Acceptance
     Criteria surfaces.

5. **§2.5 Validator alignment**: replace `isValidReleaseName`
   in `build-time-release-internals.ts` (or wherever it ends
   up post-collapse) with the Sentry-documented denylist
   exactly:

   ```typescript
   export function isValidReleaseName(value: string): boolean {
     if (value.length === 0 || value.length > 200) return false;
     if (value === '.' || value === '..') return false;
     if (value === ' ') return false;
     if (/[\n\t/\\]/u.test(value)) return false;
     return true;
   }
   ```

   Drop `SENTRY_RELEASE_NAME_PATTERN` if no consumer remains.
   Accept `latest`, reject `/`. Record any Oak-local tightening
   beyond Sentry's rules in TSDoc as
   *"Oak-local tightening — not Sentry-required"*.

6. **§2.6 Plugin wiring sanity** (likely no code change):
   confirm `apps/oak-curriculum-mcp-streamable-http/build-scripts/
   sentry-build-plugin.ts` sees the new resolver output
   transparently via its existing `release.name` feed — no
   hard-coded `preview-` prefix assumptions remain post-§2.4.

7. **§2.7 Caller discipline**: at every call site of
   `resolveRelease` / `resolveSentryRelease`, pass an explicit
   object-literal snapshot of the required env fields rather
   than `process.env` by reference. Call sites to update:
   - `apps/oak-curriculum-mcp-streamable-http/build-scripts/
     sentry-build-plugin.ts` (build-time)
   - `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`
     (runtime)
   - `apps/oak-search-cli/src/runtime-config.ts` (runtime)
   - `packages/libs/sentry-node/src/config.ts` and
     `config-resolution.ts` (internal)
   - Any test fixtures that currently pass a spread of
     `process.env` — replace with explicit literals.

**Deterministic validation (per plan §WS2 Acceptance)**:

```bash
pnpm --filter @oaknational/build-metadata test
pnpm --filter @oaknational/sentry-node test
pnpm --filter oak-curriculum-mcp-streamable-http test
pnpm depcruise
```

Plus the pre-commit hook's full 74-task turbo run.

**Commit message hint** (subject under 100 chars):
`refactor(build-metadata): unify release resolver in resolveRelease, sentry-node as thin adapter`
or similar. Body explains the collapse, the shape change on
`ResolvedRelease` (drops `gitSha`), the validator rewrite, and
the URL-parse preview path.

**WS3 (cancellation script rewrite + ADR-163 §10 second amendment)**
is a separate commit boundary AFTER WS2 §2.1-§2.7 GREEN. Read
the plan's WS3.0 pre-landing reviewer dispatch step before
drafting the WS3 commit. The WS3.4 13-item amendment enumeration
is comprehensive; a 14th amendment is the failure mode the plan
exists to prevent.

**WS3 (cancellation script rewrite + ADR-163 §10 second
amendment)** is a separate commit boundary after WS2 GREEN.
Read the WS3.0 step (pre-landing reviewer dispatch on the
amendment text) before drafting the WS3 commit. Read the WS3.4
13-item enumeration carefully — it is comprehensive and a
14th amendment is the failure mode this plan exists to prevent.

**Cancellation-wiring integration test** (originally WS1 step
3) folds into WS3's test rewrite under the same TDD discipline
— it remains a useful structural test (catches accidental shim
deletion), but no longer needs to live as a separate WS1 commit.

If owner-run validation of the previously-archived corrective lane
surfaces a fresh repo defect in parallel, that takes priority — open
the smallest targeted repair lane that names that defect explicitly,
park the release-identifier plan briefly.

**Behavioural carry-forward (read before opening WS2)**: this
session demonstrated `inherited-framing-without-first-principles-
check` at the reviewer-finding-consumption layer. Captured in
detail in [`napkin.md`](../../active/napkin.md) §Surprise (pattern
instance — second cross-session occurrence) and
[`experience/2026-04-24-pippin-the-spiral-i-could-not-see.md`](../../../experience/2026-04-24-pippin-the-spiral-i-could-not-see.md).
Posture for WS2 execution: code first, reviewer dispatch only at
plan-prescribed gates (WS3.0 pre-landing, post-WS6 fidelity-vs-
implementation), do not absorb mid-cycle audit findings into
plan revisions unless they block the next code action.

### Active track links

- None. `.agent/memory/operational/tracks/` contains only
  `.gitkeep` and `README.md`.

### Promotion watchlist

- PDR-015 candidate for an assumption-challenge gate on
  architectural-review outputs if the pattern recurs.
- ADR-163 amendment candidate widened this session: its gate-mapping
  table now also needs to cover the realistic production-build gate for
  env-gated Sentry esbuild-plugin paths once child-process proof is
  rejected by testing doctrine.
- Future promotion of
  [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
  only after owner-run validation is complete and there is real
  appetite for runtime simplification.

---

## Earlier Landed Substance Still In Force

- **Warnings are not deferrable**. Build warnings from vendor tooling
  are treated as blocking failures, not "verify later" notes.
- **The root cause of the failing preview is known**:
  `dist/index.js` was the deployed artefact, and its export shape did
  not honour Vercel's Express adapter contract.
- **Preview proof is gated on Step 4 honesty**. A green build or an app-
  local green test run is not sufficient while the repo still has
  hidden strictness/test-doctrine gaps.
- **L-8 is still the parent engineering lane** in
  [`sentry-observability-maximisation-mcp.plan.md`](../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md);
  the archived corrective-lane closure record now captures the repo
  work that previously sat between L-8 and owner-run validation.

The abandoned canonical-layout attempt still matters only as input to
the separate canonicalisation brief. It is no longer the binding shape
for this branch.

---

## Guardrails

Do **not**:

- pre-empt the contract with a guessed export shape;
- reopen broader canonicalisation work;
- recreate a repo monitoring lane;
- invent a new repo-owned repair cycle without a fresh defect from
  owner-run validation;
- treat monitor setup as in-repo acceptance work.
