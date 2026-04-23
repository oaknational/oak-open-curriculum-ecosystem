# Next-Session Record — `observability-sentry-otel` thread

**Authored**: 2026-04-23 continuation (Codex / codex) after the owner
rejected the workaround-heavy follow-through shape, the active plan was
reset to first principles, and the next session was explicitly framed
as the final correctness/rules/build session.

This thread no longer sits at "finish the 27/14/48 backlog next", but
it also cannot treat the previous bounded follow-through as acceptable
final state.

The deploy-boundary repair is real, and the former consumer strictness
backlog is still authoritative history because the full repo-root gate
sequence passed through `pnpm format:root`. But the follow-through that
came after that rerun introduced principle-breaking decisions:

- EYFS-specific sitemap fallback handling;
- an `oaksearch` wrapper;
- JS-specific lint overrides;
- a partial export-surface workaround set instead of one fixed
  contract;
- clean-contract drift;
- a configured-arm Sentry gate that still fails to load the canonical
  app-local env source even though `.env.local` contains
  `SENTRY_AUTH_TOKEN`.

The remaining repo-owned work before any owner-directed preview/Sentry
proof is therefore a **corrective final session**:

- remove the bad decisions rather than extending them;
- define one fixed ESM-only export-surface contract across the relevant
  internal workspaces;
- rerun strict sitemap validation with no EYFS special treatment;
- fix the actual `oaksearch` package/install/build problem;
- fix the lingering `Multiple projects found ...` diagnostic
  structurally;
- fix the Sentry gate env-loading contract so the app-local token
  source is actually loaded;
- add one built-code-only product proof;
- rerun authoritative validation;
- only then hand off to the owner-directed preview check and manual
  `/healthz` + Sentry evidence collection.

The three plan surfaces remain:

- [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
  is now the reset follow-through plan for the final corrective
  repo-owned session: remove the bad decisions, restore strict
  validation, define the fixed export contract, fix the actual
  build/install/env problems, add one built-code proof, and rerun the
  authoritative gates.
- [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
  is the separate home for broader runtime simplification.
- [`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md)
  records that monitor creation and ongoing uptime validation are now
  owner-external, not repo work.

The underlying branch state is now:
L-8 Correction WI 1-5 remain landed in `fb047f86`; the dedicated
`dist/server.js` deploy boundary, shared Step 4 foundation work, and
the former `oak-search-sdk` / `sdk-codegen` / `search-cli` backlog are
now validated by a green full repo-root gate rerun through
`pnpm format:root`; but that rerun is execution evidence rather than
acceptable final branch state because the follow-through after it
introduced workaround-heavy changes that the reset plan now treats as
defects to remove.

**Consumed at**: next session that resumes this thread.
**Lifecycle**: delete on session close once the corrective final
session lands the reset plan, the corrected validation sequence is
green, and the later owner-directed preview `/healthz` + Sentry proof
both land end to end; rewrite if another repair turn is required.

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
| `Pippin` | `cursor` | `claude-opus-4-7` | *`unknown`* | `diagnosis-correction-implementation-doctrine-landing-and-plan-rewrite` | 2026-04-22 | 2026-04-23 |
| `Codex` | `codex` | *`unknown`* | *`unknown`* | `principles-reset-analysis-plan-rewrite-and-final-session-handoff` | 2026-04-23 | 2026-04-23 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; they do not rewrite older attribution.

---

## Landing Target (per PDR-026)

Attempted: critically review the post-rerun follow-through against the
repository rules, record which decisions were bad, reset the active
plan to a strict correctness-first shape, and leave the next session
with one final repo-owned landing target.

Prevented: the owner explicitly redirected this session to
"acknowledge, analyse, report, stop" and then to "update the plan with
all of that and do nothing else". No corrective implementation was
allowed after that instruction. Evidence: the active plan was rewritten
to the reset shape, the continuity surfaces were updated, and no new
tests/reruns/repairs were attempted after the correction. Falsifiability:
the next session can verify that the reset plan exists, that the
principle-breaking code remains in the worktree until removed, and that
no post-reset gate evidence is recorded here.

Landed within that target:

- The active observability plan now records the owner correction
  explicitly: no fallbacks, no wrappers, no JS overrides, one fixed
  ESM-only export contract, strict sitemap validation, honest env
  loading, and one built-code-only product proof.
- This thread record and `repo-continuity.md` now encode the next
  session as the final correctness/rules/build session rather than
  another bounded workaround pass.
- The local-token fact is now captured accurately: the app-local
  `.env.local` contains `SENTRY_AUTH_TOKEN`; the defect is the current
  command path's failure to load that canonical source.
- Entry-point drift was rechecked; `AGENTS.md`, `CLAUDE.md`, and
  `GEMINI.md` remain pointer-only.

Authoritative but non-final evidence still in force:

- The earlier full repo-root rerun through `pnpm format:root` did
  execute successfully.
- That rerun is not the acceptable final branch state because the
  follow-through after it introduced principle-breaking changes that
  now need to be removed.

---

## Lane State

### Owning plan(s)

- **Current execution authority**:
  [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
- **Parent context**:
  [`sentry-observability-maximisation-mcp.plan.md`](../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
- **Separate future work**:
  [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
- **Closed repo monitoring lane**:
  [`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md)

### Current objective

Make the next session the final repo-owned correctness/rules/build
session: remove the bad workaround decisions, restore strict
validation, fix the actual build/install/env problems, rerun the
authoritative validation sequence, and only then hand off cleanly to an
owner-directed preview check.

### Current state

- `fb047f86` still supplies WI 1-5 of the L-8 Correction: build-time
  release resolution, plugin intent typing, esbuild-arm split, and
  the scoped removal of the MCP HTTP pre-flight root-version validation.
- The real `@vercel/node` contract is now verified from primary
  evidence: the deployed artefact must default-export a function, and
  the current repo-owned deployed entry is explicitly `dist/server.js`.
- The deploy-boundary repair is landed locally: `src/server.ts`
  memoises the real app handler, `package.json` `main` now points at
  `dist/server.js`, and the local listener remains `dist/index.js`.
- The warning path that previously reached runtime is now blocked at
  build time: esbuild warnings fail the build, and the built deployed
  artefact must satisfy the default-export contract.
- The supporting repo-tail fallout is repaired locally:
  `scripts/server-harness.js` is back on the source DI path,
  `knip.config.ts` names `src/server.ts`, and the `.claude` mirror for
  `no-warning-toleration` exists so portability stays green.
- Shared Step 4 foundation work is also landed locally:
  - `@oaknational/eslint-plugin-standards` package gates are green
    after single-source plugin registration, typed rules, deterministic
    `max-files-per-dir`, and rule-test rationalisation;
  - `@oaknational/type-helpers` package gates are green after removing
    `typeSafeFromEntries` / `typeSafeOwnKeys` and rewriting consumers;
  - the MCP HTTP app gates are green after removing child-process proof
    and invalid runtime-config test surfaces.
- The remaining consumer backlog is now cleared authoritatively:
  - `@oaknational/oak-search-sdk`,
    `@oaknational/sdk-codegen`, and `@oaknational/search-cli`
    now pass the full repo-root rerun with the required
    emission/logger seams;
  - the two `search-cli` runtime-config test-boundary violations are
    gone.
- The previous green rerun remains execution evidence, but it is not
  acceptable final branch state for this lane because the follow-through
  that came after it introduced principle-breaking decisions:
  EYFS fallback logic, an `oaksearch` wrapper, JS-specific lint
  overrides, a partial export-surface workaround set, and
  clean-contract drift.
- The active plan now treats those as defects to remove, not as
  acceptable architecture.
- The last authoritative full repo-root gate run passed
  `pnpm secrets:scan:all`, `pnpm clean`, `pnpm test:root-scripts`,
  `pnpm sdk-codegen`, `pnpm build`, `pnpm type-check`,
  `pnpm doc-gen`, `pnpm lint:fix`, `pnpm test`, `pnpm test:widget`,
  `pnpm test:e2e`, `pnpm test:ui`, `pnpm test:a11y`,
  `pnpm test:widget:ui`, `pnpm test:widget:a11y`,
  `pnpm smoke:dev:stub`, `pnpm subagents:check`,
  `pnpm portability:check`, `pnpm markdownlint:root`, and
  `pnpm format:root`.
- `pnpm sdk-codegen` in that authoritative run still printed
  `Invalid programme URLs detected` for five Foundation programme
  URLs while exiting 0.
- Vercel builds still warn that pnpm failed to create
  `/vercel/path0/node_modules/.bin/oaksearch` because
  `@oaknational/search-cli/dist/bin/oaksearch.js` is missing at
  install time.
- The configured-arm Sentry gate command exists, but its contract is
  still wrong: `apps/oak-curriculum-mcp-streamable-http/.env.local`
  contains `SENTRY_AUTH_TOKEN`, yet the command path does not load that
  canonical app-local env source.
- `@oaknational/oak-curriculum-mcp-streamable-http` lint still prints
  the `Multiple projects found ...` diagnostic even though root
  `pnpm lint:fix` passes; that surface still needs honest treatment.
- Owner-directed preview `/healthz` and Sentry proof were
  intentionally not attempted after the green root rerun because the
  remaining repo-owned corrective follow-through still needs to land
  first.

### Blockers / low-confidence areas

- No architectural blocker is currently known in the remaining lane;
  the open work is concrete, but the previous attempt at closing it
  drifted into prohibited workaround patterns.
- The remaining branch-level acceptance gap is the corrective reset:
  remove the bad workaround decisions, fix the actual env/install/export
  issues, restore strict validation, and rerun the authoritative gates.
- Owner-directed preview/Sentry proof does not exist yet and would be
  non-authoritative if attempted before the remaining repo-owned
  follow-through lands.
- The `Multiple projects found ...` lint diagnostic is still a
  low-confidence honesty gap until its root cause is understood.
- The five invalid programme URLs reported by `pnpm sdk-codegen` in the
  authoritative rerun are still unresolved and must be rechecked under
  a strict validator with **no** EYFS special treatment.
- The Vercel `oaksearch` bin-link warning is still unexplained at the
  package/install boundary and therefore remains part of the live
  follow-through lane.
- The configured-arm Sentry gate failure is now understood as an
  env-loading contract bug, not as proof that the app-local token is
  absent.

### Standing decisions

- This is **one bounded repo-owned follow-through lane**, not an
  ongoing stream of repo monitoring work.
- There is **no repo-owned monitor setup lane**. Repo scope stops at a
  clean handoff into the owner-directed preview check; monitor setup
  remains outside the repo.
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
- The next session is intended to be the **last one on this lane** and
  must focus on correctness, rules, and getting the build working.
- Preview proof before the remaining repo-owned follow-through lands is
  not authoritative and must not be used to bypass the honesty work.

### Next safe step

Resume at the corrective reset, not at the preview boundary:

1. remove the principle-breaking changes already introduced in this
   lane: EYFS fallback handling, the `oaksearch` wrapper, JS-specific
   lint overrides, partial export-surface workaround logic, and any
   clean-contract drift;
2. define and apply one fixed ESM-only export-surface contract across
   the relevant internal workspaces;
3. rerun `pnpm -F @oaknational/sdk-codegen scan:sitemap` and
   `pnpm sdk-codegen` under a strict validator with **no** EYFS special
   treatment;
4. fix the actual `oaksearch` package/install/build issue and the
   outstanding `Multiple projects found ...` diagnostic structurally;
5. fix the configured-arm Sentry build command so it loads the
   canonical app-local env source honestly;
6. add and run one built-code-only product proof after `pnpm build`;
7. rerun the authoritative validation sequence from the repo root;
8. only then hand back to the owner-directed preview check.

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
  only after the repaired preview is stable and Sentry proof exists.

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
  the current repair plan is the execution authority for its remaining
  preview/Sentry proof.

The abandoned canonical-layout attempt still matters only as input to
the separate canonicalisation brief. It is no longer the binding shape
for this branch.

---

## Guardrails

Do **not**:

- pre-empt the contract with a guessed export shape;
- reopen broader canonicalisation work;
- recreate a repo monitoring lane;
- push another preview before the dedicated realistic production-build
  gate exists and the lingering non-fatal diagnostics have an honest
  disposition;
- treat monitor setup as in-repo acceptance work.
