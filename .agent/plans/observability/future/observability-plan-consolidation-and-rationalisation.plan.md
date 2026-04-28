---
name: Observability Plan Consolidation and Rationalisation
overview: >
  Substrate memo for a future owner-directed session that reviews the
  16+ Sentry / observability / monitoring plans for consolidation and
  rationalisation. Identifies overlap, dependency knots, blocking
  explorations, and candidates for merge / archive / promote. Does
  NOT itself decide; produces the surface a focused session can act
  on.
todos:
  - id: consolidation-session
    content: "Owner-directed session that reads this memo end-to-end and produces decisions: which plans merge, which archive, which split, which explorations to schedule, which workstreams to promote / defer."
    status: pending
isProject: false
---

# Observability Plan Consolidation and Rationalisation

**Status**: 🔵 SUBSTRATE — produces the input for a future focused
session; does not itself execute consolidation.

**Authored**: 2026-04-26 by `Sharded Stroustrup` after closing the
Sentry-validation substrate plan and being directed to "review the
spread of sentry and observability and monitoring plans for a
potential consolidation and rationalisation session".

---

## Why this exists

The repo currently has **18 observability-themed plan files**
across `.agent/plans/observability/` plus high-level mappings.
Several signals suggest a consolidation pass is overdue:

- Multiple plans block on the same explorations (3, 4, 6, 8) whose
  status isn't tracked in any single place.
- Several plans have overlapping scope (e.g. multiple plans touching
  search-cli Sentry wiring; the maximisation plan and the
  release-identifier plan both define release-resolution behaviour).
- The active maximisation-mcp plan is 3275 lines after multiple
  rounds of additive amendments — past the point where any one agent
  can hold the full graph in working memory.
- Some "future" plans may have been overtaken by events (e.g. the
  legacy `sentry-observability-maximisation.plan.md` predates the
  `-mcp` split); deciding which to archive vs preserve is a
  fitness-budget cleanup.
- The 2026-04-26 doc-driven gap-finding session (see napkin entry)
  surfaced six items not in any plan — evidence that the current
  spread isn't catching the full opportunity-set.

This memo provides the inventory + map a focused session needs to
make those calls without reconstructing the landscape from scratch.

---

## Plan inventory (18 files)

### Active

| Plan | Lines | Status | Primary scope |
|---|---|---|---|
| `active/sentry-observability-maximisation-mcp.plan.md` | 3275 | 🟠 in-progress | Umbrella Sentry/MCP-server plan: free-signal integrations, MCP context, metrics, fingerprinting (just added), operational hardening (just added) |
| `active/sentry-observability-translation-crosswalk.plan.md` | (small) | ✅ complete + maintenance | Crosswalk between maximisation plan and consuming workspaces |
| `active/mcp-local-startup-release-boundary.plan.md` | large | 🟢 Phase 2 done; Phase 3 in-progress | Local startup decoupled from Sentry release metadata |
| `active/gate-recovery-cadence.plan.md` | medium | 🟢 closed for current branch state | Quality-gate recovery doctrine |

### Current

| Plan | Status | Primary scope |
|---|---|---|
| `current/sentry-preview-validation-and-quality-triage.plan.md` | ✅ closed 2026-04-26 | This session's substrate; should rotate to archive/completed/ on next consolidate-docs pass |
| `current/pr-87-quality-finding-resolution.plan.md` | 🔴 not started | CodeQL + Sonar fix sequence on PR #87 |
| `current/sentry-release-identifier-single-source-of-truth.plan.md` | 🟡 WS2/3 done; WS4-7 pending | Release name single-source-of-truth refactor |
| `current/observability-events-workspace.plan.md` | 🟡 planning, blocked on Exploration 4 | New `packages/core/observability-events/` workspace for typed event schemas |
| `current/security-observability.plan.md` | 🟡 planning, blocked on events workspace + Exploration 6 | `auth_failure` + `rate_limit_triggered` emissions |
| `current/search-observability.plan.md` | 🟡 planning, MVP lanes pending | Search-CLI Sentry runtime; ES tracing; retrieval-quality metrics |
| `current/multi-sink-vendor-independence-conformance.plan.md` | 🟡 planning, blocked on Exploration 8 + events workspace | ESLint rule + emission-persistence test for vendor independence |
| `current/accessibility-observability.plan.md` | 🟡 planning, blocked on Exploration 3 | A11y emission contract |

### Future

| Plan | Likely action |
|---|---|
| `future/sentry-observability-maximisation.plan.md` | **Probably archive/superseded** — predates the `-mcp` split; check vs `active/sentry-observability-maximisation-mcp.plan.md` for what was promoted |
| `future/ai-telemetry-wiring.plan.md` | Keep as future; gate is LLM tool adoption |
| `future/cross-system-correlated-tracing.plan.md` | Keep — owner-noted future-state trigger ("when search-cli is wired to same Sentry org") |
| `future/cost-and-capacity-telemetry.plan.md` | Keep as future |
| `future/curriculum-content-observability.plan.md` | Keep as future; depends on content product direction |
| `future/customer-facing-status-page.plan.md` | Keep as future; gate is public-beta |
| `future/deployment-impact-bisection.plan.md` | Keep as future |
| `future/feature-flag-provider-selection.plan.md` | Keep as future; L-10 in maximisation depends on this |
| `future/mcp-http-runtime-canonicalisation.plan.md` | Keep as future; runtime simplification |
| `future/second-backend-evaluation.plan.md` | Keep as future |
| `future/security-observability-phase-2.plan.md` | Keep as future; depends on Phase 1 (current/security-observability.plan.md) |
| `future/slo-and-error-budget.plan.md` | Keep as future; gate is alpha distributions |
| `future/statuspage-integration.plan.md` | Possibly merge with `customer-facing-status-page.plan.md` if scope overlaps |

### Top-level

- `observability/README.md`
- `observability/high-level-observability-plan.md` (active wave-tracker)
- `observability/what-the-system-emits-today.md` (snapshot)

---

## Dependency knots

**Knot 1: Events workspace gates four downstream plans**

`current/observability-events-workspace.plan.md` is blocked on
Exploration 4 (structured event schemas). It in turn blocks:

- `current/security-observability.plan.md` (needs event-schema
  workspace for `auth_failure` shape)
- `current/multi-sink-vendor-independence-conformance.plan.md`
  (emission-persistence test needs event types)
- `current/search-observability.plan.md` § search_query emission
- `active/sentry-observability-maximisation-mcp.plan.md` § L-3 MCP
  context (cross-references events workspace for `tool_invoked`)

**Resolution**: get Exploration 4 status; if not done, schedule it
or accept that 4 downstream plans stay paused.

**Knot 2: Exploration backlog**

Four explorations gate plan workstreams; status of all four is
unclear:

| Exploration | Gates | Status |
|---|---|---|
| 3 | a11y observability | unknown |
| 4 | event schemas | unknown |
| 6 | Cloudflare + Sentry security boundary | unknown |
| 8 | vendor-independence test shape | unknown |

**Resolution**: produce a single page that lists exploration status,
owner, and current open question. May already exist in
`high-level-observability-plan.md`; verify.

**Knot 3: Maximisation plan size and scope**

`active/sentry-observability-maximisation-mcp.plan.md` at 3275
lines + 30+ lanes is hard to navigate. It has now absorbed:

- L-IMM (immediate hardening, just added)
- L-OPS (deferred operational maturity, just added)
- ~10 deferred lanes already
- ~10 in-flight lanes (L-1, L-2, L-3, L-4b, L-8, L-EH-final etc.)

**Candidate split** (option for the consolidation session):

- Keep maximisation-mcp focused on **emission lanes** (L-1, L-3, L-4b)
- Spin off **L-IMM + L-OPS** into a dedicated
  `sentry-operational-hardening.plan.md`
- Spin off **L-7 / L-8 build-pipeline** into the existing
  `mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md` (already
  branched off per the L-7 note)
- Spin off **L-13 / L-14** into the future statuspage / SLO / alerts
  cluster

This would shrink maximisation-mcp by ~40-50% and clarify per-lane
ownership.

**Knot 4: Search-CLI Sentry has its own plan AND lanes elsewhere**

- `current/search-observability.plan.md` owns search-CLI Sentry
  (Layer 1 CLI runtime + Layers 2/3 ES + retrieval-quality)
- `active/sentry-observability-maximisation-mcp.plan.md` § L-4b
  metrics adapter is a prerequisite
- `future/cross-system-correlated-tracing.plan.md` is the
  trace-propagation extension (owner direction 2026-04-26: extend
  `tracePropagationTargets` when search-CLI joins same Sentry org)

**Resolution candidate**: declare search-observability as the
authority for search-CLI Sentry; cross-reference but don't duplicate
in maximisation.

**Knot 5: Two release-identifier-shaped plans**

- `current/sentry-release-identifier-single-source-of-truth.plan.md`
  (refactor to one resolver function)
- `active/mcp-local-startup-release-boundary.plan.md` (separate but
  overlapping concern: local startup release identity)

Both touch the resolver. **Resolution candidate**: confirm the two
have separate substantive scope; if not, archive the smaller one.

---

## Likely archive candidates

These plans are probably superseded; the consolidation session
should confirm and move them:

1. **`future/sentry-observability-maximisation.plan.md`** — predates
   the `-mcp` split. Almost certainly superseded by
   `active/sentry-observability-maximisation-mcp.plan.md`.
2. **`current/sentry-preview-validation-and-quality-triage.plan.md`**
   — closed 2026-04-26 (this session's substrate). Should rotate
   to `archive/completed/` on next consolidate-docs.
3. **`active/gate-recovery-cadence.plan.md`** — Phase 2 closed for
   current branch state per its status header. Verify completion;
   archive if done.

---

## Surface area the consolidation session must produce decisions on

A 60-90 minute focused session, owner-led, would close:

1. **Exploration scheduling**: Explorations 3, 4, 6, 8 — schedule or
   defer (with rationale in each); update `high-level-observability-plan.md`
   with the answer.
2. **Maximisation split decision**: keep the 3275-line plan as a
   single artefact, or split into focused sub-plans (the
   knot-3 candidate above)?
3. **Archive moves**: confirm and execute the three archive
   candidates listed above.
4. **Search-CLI authority**: confirm `current/search-observability.plan.md`
   is the single authority for search-CLI Sentry wiring; cross-link
   from maximisation rather than duplicate.
5. **Release-identifier overlap**: confirm or merge the two
   release-identifier-shaped plans.
6. **Status-page cluster**: decide whether `customer-facing-status-page.plan.md`
   and `statuspage-integration.plan.md` are one plan or two.
7. **Wave-tracker hygiene**: ensure `high-level-observability-plan.md`
   reflects the post-session state — every plan referenced from
   waves 2-5 has a status note that matches the per-plan body.

---

## Pre-session preparation (cheap, can happen any time)

These don't need owner decisions, just legwork:

- Run `pnpm practice:fitness:informational` and capture the
  observability-plan fitness measurements (lines / chars / link
  health) so the consolidation session can see actual sizes
  rather than rough estimates.
- Walk each "future/" plan and tag it with `gating-condition: <X>`
  so the wave tracker doesn't surface plans that can't move yet.
- Verify each plan's TODOs status reflects reality (some claim
  "completed" lanes that may be partially landed).

This memo's job ends at producing the surface for a session; it does
not itself decide. Once the session runs, replace this memo with
its outputs (decisions, archive moves, exploration schedule).

---

## Cross-references

- [`high-level-observability-plan.md`](../high-level-observability-plan.md)
  — the active wave tracker; should be the receiving plan for
  consolidation outcomes.
- [`active/sentry-observability-maximisation-mcp.plan.md`](../active/sentry-observability-maximisation-mcp.plan.md)
  — the umbrella plan most affected by Knot 3 split decision.
- Napkin entry 2026-04-26 (Sharded Stroustrup) on
  `vendor-doc-review-for-unknown-unknowns` — surfaced the
  L-IMM / L-OPS additions that bloated maximisation-mcp further
  and triggered this consolidation memo.
