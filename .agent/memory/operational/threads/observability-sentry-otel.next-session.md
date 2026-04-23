# Next-Session Record — `observability-sentry-otel` thread

**Authored**: 2026-04-23 continuation (Codex / codex) after the
repo-owned corrective lane closed and the remaining validation stages
were explicitly externalised to the owner.

This thread is no longer waiting for another repo coding session to
finish the bounded follow-through. That work is archived complete. What
remains is owner-run validation outside repo-plan scope, with reopen
only if that work surfaces a fresh repo-owned defect.

The relevant plan surfaces are now:

- [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
  — archived closure record for the completed repo-owned corrective
  lane.
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

**Consumed at**: only if owner-run validation surfaces a new repo-owned
defect, or when runtime simplification is deliberately promoted.
**Lifecycle**: delete once owner-run validation completes with no new
repo work; rewrite if that validation opens a fresh repo-owned repair
lane.

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
| `Codex` | `codex` | *`unknown`* | *`unknown`* | `repo-owned-repair-closeout-and-doc-consolidation` | 2026-04-23 | 2026-04-23 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; they do not rewrite older attribution.

---

## Landing Target (per PDR-026)

Landed: archived the completed repo-owned corrective lane, refreshed the
live continuity surfaces to point at that archive record, and recorded
that the remaining validation stages are owner-handled separately —
[`archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md).

Evidence:

- the archived closure record exists at the path above;
- this thread record and `repo-continuity.md` now describe the lane as
  complete rather than queuing another repo coding session;
- entry-point drift remains absent (`AGENTS.md`, `CLAUDE.md`,
  `GEMINI.md` are still pointer-only).

No new product validation was run in this closeout because the owner
explicitly separated validation from this session.

---

## Lane State

### Owning plan(s)

- **Repo-owned corrective lane closure record**:
  [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
- **Parent context**:
  [`sentry-observability-maximisation-mcp.plan.md`](../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
- **Separate future work**:
  [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
- **Closed repo monitoring lane**:
  [`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md)

### Current objective

Hold the repo steady while the owner runs the separate validation
stages. Reopen only if that validation surfaces a new repo-owned defect
or if runtime simplification is deliberately promoted.

### Current state

- The bounded repo-owned corrective lane is complete and archived at
  [`archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md).
- `fb047f86` still supplies WI 1-5 of the L-8 Correction: build-time
  release resolution, plugin intent typing, esbuild-arm split, and the
  scoped removal of the MCP HTTP pre-flight root-version validation.
- The real `@vercel/node` contract is verified from primary evidence:
  the deployed artefact must default-export a function, and the current
  repo-owned deployed entry is explicitly `dist/server.js`.
- The strict corrective pass removed the workaround-heavy follow-through
  shape, restored strict sitemap validation, fixed the configured-arm
  Sentry env-loading contract, and closed the package/install/build
  issues that had kept the lane open.
- The earlier full repo-root rerun through `pnpm format:root` remains
  authoritative execution evidence for the branch-wide repair work.
- No active repo-owned validation step remains queued in this thread;
  manual preview `/healthz`, preview-release, preview-traffic, and
  Sentry evidence are now owner-handled separately.

### Blockers / low-confidence areas

- No active repo-owned blocker is queued.
- The only open uncertainty is external to this thread's repo plan:
  owner-run validation may yet surface a new defect.
- If that happens, reopen with the smallest targeted repo lane rather
  than reviving the completed corrective plan wholesale.

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

Wait for the owner-run validation stages.

1. If owner validation returns a fresh repo defect, open the smallest
   targeted repair lane that names that defect explicitly.
2. If owner validation is clean and runtime simplification is wanted,
   promote
   [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md).
3. Otherwise, do not invent another repo-owned follow-through cycle.

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
