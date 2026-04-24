# Next-Session Record — `observability-sentry-otel` thread

**Last refreshed**: 2026-04-24 (Pippin / cursor / claude-opus-4-7)
after a small intra-session test-relocation micro-lane landed in
`6764457d` (see `### Current state` for context). Prior refresh
on the same day captured the cross-cutting meta-session sweep at
`ffec98b0` which folded this thread's previously-uncommitted
plan-body refinement (WS3 cancellation-script rewrite + WS2
validator denylist correction) into a larger commit alongside
practice/process restructuring, vendor-skills expansion, and three
new parallel plans. The release-identifier plan refinement is now
durable; this thread picks up at WS1 RED with no commit-choice
overhead.

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
| `Pippin` | `cursor` | `claude-opus-4-7` | *`unknown`* | `diagnosis-correction-implementation-doctrine-landing-plan-rewrite-release-identifier-plan-queueing-WS0-amendment-landing-post-WS0-WS3-cancellation-rewrite-design-into-plan-body-and-meta-session-sweep-commit` | 2026-04-22 | 2026-04-24 |
| `Codex` | `codex` | *`unknown`* | *`unknown`* | `repo-owned-repair-closeout-and-doc-consolidation` | 2026-04-23 | 2026-04-23 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; they do not rewrite older attribution.

---

## Landing Target (per PDR-026)

**This session (meta-session sweep)**: the previously-uncommitted plan
refinement landed inside the cross-cutting meta-session sweep at
commit `ffec98b0` (80 files, +12732/-3970), per explicit owner
direction "commit all files including from other threads". That
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

- **Intra-session micro-lane (2026-04-24, `6764457d`)**: deleted
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

Open the plan file and re-read the current WS3 + WS2.5 sections —
they are authoritative as of `ffec98b0`. No commit-choice overhead.
Then proceed straight to WS1 of
[`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
— RED contract tests, separate commit/turn boundary from WS0:

1. Add the cross-resolver contract test asserting that
   `resolveBuildTimeRelease` (build-time, `packages/core/build-metadata`)
   and `resolveSentryRelease` (runtime, `packages/libs/sentry-node`)
   produce the SAME string for the same env inputs across the §1
   truth-table rows. Establish the `libs ← core` devDependency edge
   if it doesn't already exist (per ADR §1's process-gap finding).
2. Add the branch-URL-precedence test pinning that both resolvers
   extract the leftmost host label of `VERCEL_BRANCH_URL` for
   preview/non-main-production (with `SENTRY_RELEASE_OVERRIDE`
   precedence preserved).
3. Add the cancellation-wiring integration test asserting that
   `apps/oak-curriculum-mcp-streamable-http/vercel.json`'s
   `ignoreCommand` resolves through the workspace shim to the
   canonical script — catches shim deletion or path drift; does not
   re-test script logic (already covered).
4. Tests are RED in WS1 (build-time still emits old shape); WS2
   makes them GREEN by rewriting `resolvePreviewRelease` and
   extending `resolveSentryRelease`.

If owner-run validation of the previously-archived corrective lane
surfaces a fresh repo defect in parallel, that takes priority — open
the smallest targeted repair lane that names that defect explicitly,
park the release-identifier plan briefly.

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
