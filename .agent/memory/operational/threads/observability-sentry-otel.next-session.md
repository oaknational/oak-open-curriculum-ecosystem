# Next-Session Record — `observability-sentry-otel` thread

**Authored**: 2026-04-23 latest session checkpoint (Codex / codex)
after deploy-boundary repair, root-gate cleanup, and pre-deploy
continuity refresh.

This session has now done both halves of the local repo work:

- it previously replaced the old mixed "repair plus future work plus
  monitoring" shape with three clear surfaces;
- it then verified the real Vercel import contract from primary
  evidence, landed the deploy-boundary repair, repaired the tail
  gating fallout, and reran `pnpm check` to green.

The three plan surfaces remain:

- [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
  is now a single-session operational repair plan for the deploy
  boundary, failing build gates, and preview/Sentry proof.
- [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
  is the separate home for broader runtime simplification.
- [`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md)
  records that monitor creation and ongoing uptime validation are now
  owner-external, not repo work.

The underlying app state is now:
L-8 Correction WI 1-5 remain landed in `fb047f86`, and the remaining
deploy-boundary repair is also landed locally in the current worktree.
The only open repo-owned step is the push-driven preview rerun and the
external `/healthz` + Sentry proof.

**Consumed at**: next session that resumes this thread.
**Lifecycle**: delete on session close once the preview `/healthz` and
Sentry proof land end to end; rewrite if deployment verification fails
and another repair turn is required.

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
| `Codex` | `codex` | *`unknown`* | *`unknown`* | `deploy-boundary-repair-root-gate-remediation-and-predeploy-closeout` | 2026-04-23 | 2026-04-23 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; they do not rewrite older attribution.

---

## Landing Target (per PDR-026)

The most recent session landed the full **local** remediation:

- verified the Vercel import contract from primary evidence and wrote
  the contract note into the operational plan;
- landed the dedicated `src/server.ts` / `dist/server.js`
  deploy boundary and its lazy request-handler seam;
- made esbuild warnings fatal and asserted the built deployed export
  contract at build time;
- repaired local follow-through surfaces (`scripts/server-harness.js`,
  `knip.config.ts`, portability mirror) and reran `pnpm check` to green;
- amended ADR-163 and refreshed continuity surfaces so the repaired
  shape is now the written truth.

What did **not** land:

- the replacement preview deploy;
- `/healthz` preview proof;
- Sentry preview-release and preview-traffic proof.

That work remains the binding target for the next execution session.

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

Close the remaining L-8 operational acceptance gap by pushing the
already-green repair and proving it on a real preview: successful boot,
`/healthz` 200, and preview release / traffic linkage in Sentry.

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
  `scripts/server-harness.js` now exercises `dist/server.js`,
  `knip.config.ts` names `src/server.ts`, and the `.claude` mirror for
  `no-warning-toleration` exists so portability stays green.
- `pnpm check` exits 0 after the repair.

### Blockers / low-confidence areas

- No local code blocker is known after `pnpm check` green.
- Preview/Sentry proof does not exist yet because the repaired branch
  has not been pushed and rerun on Vercel.
- External verification still depends on the owner-allowed deployment
  path: commit all files, push, monitor Vercel, then inspect preview
  `/healthz` and Sentry.

### Standing decisions

- This is **one operational repair session**, not an ongoing stream of
  repo monitoring work.
- There is **no repo-owned monitor setup lane**. Repo scope stops at a
  healthy `/healthz` endpoint plus preview/Sentry proof.
- There are **no follow-up placeholders**. Future work either has a
  real home or is deleted.
- Canonicalisation remains valuable, but it is explicitly separate
  from the deploy-boundary repair.
- The local runner stack stays unless the verified deploy contract
  proves a smaller change is required.

### Next safe step

Resume at the deployment boundary, not the coding boundary:

1. commit all current files on `feat/otel_sentry_enhancements`;
2. push the branch and monitor the Vercel preview build to completion;
3. hit preview `/healthz` and record the successful response;
4. verify preview release and preview traffic in Sentry.

### Active track links

- None. `.agent/memory/operational/tracks/` contains only
  `.gitkeep` and `README.md`.

### Promotion watchlist

- PDR-015 candidate for an assumption-challenge gate on
  architectural-review outputs if the pattern recurs.
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
- treat monitor setup as in-repo acceptance work.
