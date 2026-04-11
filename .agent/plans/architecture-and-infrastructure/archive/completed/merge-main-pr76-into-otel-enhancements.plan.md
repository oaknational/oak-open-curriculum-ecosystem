---
name: "Merge main (PR #76) into feat/otel_sentry_enhancements"
overview: >
  Merge origin/main (PR #76 React MCP App + design tokens, 977 files,
  ~78k insertions) into feat/otel_sentry_enhancements (7 commits, 36 files).
  4 text conflicts, 10 files changed on both sides, 96 files deleted by main
  (24 in the HTTP app). 6 hazards documented after Wilma and docs-ADR review.
  ADR-158 numbering collision. PR #78 also landed on main (ADR-158), so our
  ADR renumbers to ADR-158.
status: completed
last_updated: 2026-04-11
parent_plan: ./sentry-otel-integration.execution.plan.md
---

# Plan: Merge `origin/main` (PR #76) into `feat/otel_sentry_enhancements`

## Divergence

- Merge base: `54309a6a` (PR #73 merge commit)
- Main: 5 commits ahead (PR #76, PR #78, three release commits), 1048 files
- Branch: ~10 commits ahead (docs + rate limiting + plan work), 36 files
- PR #78 added ADR-157 (open education knowledge surfaces) — our ADR
  renumbers to ADR-158
- Asymmetry favours accepting main for most conflicts

**Important (Fred advisory)**: Confirm the highest ADR number at execution
time — main's velocity means new ADRs may land between planning and execution.

## Text Conflicts (4 files)

| File | Resolution |
|------|-----------|
| `.agent/plans/architecture-and-infrastructure/README.md` | Accept main structure, keep our updated status text and date |
| `apps/oak-curriculum-mcp-streamable-http/src/application.ts` | **Semantic** — main restructured the app composition root (widget build pipeline, new `getWidgetHtml` param). Accept main, re-apply rate limiting wiring. |
| `docs/architecture/architectural-decisions/README.md` | **ADR-158 collision** — both branches created ADR-158. Main: "Two-Threshold Fitness Model". Branch: "Multi-Layer Security and Rate Limiting". See Hazard 2 below. |
| `pnpm-lock.yaml` | Accept main, regenerate with `pnpm install` |

## Files Changed on Both Sides (10 files)

Most auto-merge cleanly. The risk zone:

| File | Risk | Notes |
|------|------|-------|
| `application.ts` | **High** | Text conflict — main restructured composition root |
| `ADR README.md` | **High** | ADR-158 numbering collision |
| `plans/arch/README.md` | Low | Both updated status text |
| `plans/arch/active/README.md` | Low | Both updated active plan list |
| `plans/arch/current/README.md` | Low | Both updated queue status |
| `execution.plan.md` | Low | Both updated snapshot; auto-merges |
| `HTTP app README.md` | Low | Both updated; auto-merges |
| `HTTP app package.json` | Low | Both added deps; auto-merges |
| `safety-and-security.md` | Low | Both updated; auto-merges |
| `pnpm-lock.yaml` | Low | Regenerate |

## Hazards

### Hazard 1: `tools-list-override.ts` deleted by main

**File**: `apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts`

Main deleted this file. Our branch's `core-endpoints.ts` imports it:
```
import { overrideToolsListHandler } from '../tools-list-override.js';
```

**Resolution**: Accept main's deletion. The override was a Zod 3 compatibility
shim that intercepted `tools/list` to preserve JSON Schema examples. Three
upstream changes made it obsolete: sdk-codegen now generates `flatZodSchema`
with `.meta({ examples })`, aggregated tools have `.describe()` metadata, and
Zod 4's `toJSONSchema()` preserves `.meta()` natively. Main's tool
registration passes `tool.inputSchema` directly — no override needed.

Fix: remove the `import { overrideToolsListHandler }` and its call from
`core-endpoints.ts`. No replacement logic needed — the SDK pipeline now
handles this end-to-end.

### Hazard 2: ADR-158 numbering collision

Both branches independently created ADR-158:
- **Branch**: `144-multi-layer-security-and-rate-limiting.md`
- **Main**: `144-two-threshold-fitness-model.md`

Main also added ADR-145 through ADR-156. Both files have different filenames
so Git merges them without conflict — but the numbering is broken.

**Resolution**: Renumber our ADR-158 to the next available number after
main's highest (ADR-156 → ours becomes **ADR-158**). Update the file, the
ADR index, all internal references, and cross-references in plans, prompts,
safety-and-security.md, and code comments.

### Hazard 3: `getWidgetHtml` DI chain — NOT a merge hazard

Investigation reveals both sides preserve the `getWidgetHtml` injection
pattern. Main added it in PR #76; it auto-merges cleanly because branch
didn't touch the relevant interfaces. The original concern was about
branch's `core-endpoints.ts` not having the field — but since we're
accepting main's inlined pattern and deleting `core-endpoints.ts` (Hazard
4 decision), this resolves automatically. **No action needed.**

### Hazard 4: `application.ts` composition pattern collision (Wilma finding)

Two conflicting architectural choices:
- **Main**: inlined `initializeCoreEndpoints()` inside `application.ts`
- **Branch**: extracted it to `src/app/core-endpoints.ts` (for max-lines)

Main also restructured for the widget build pipeline. Branch added rate
limiting wiring (`createRateLimiters`, `rateLimiterFactory` DI field,
limiter passing to route setup functions).

**Decision**: Accept main's inlined pattern. Delete branch's
`core-endpoints.ts`. Re-apply rate limiting wiring into main's structure.
Rationale: `core-endpoints` was a single-use extraction (called once) and
main consolidated it back; fighting that direction adds friction.

### Hazard 5: `setupOAuthAndCaching` signature mismatch (Wilma finding)

Branch extended the signature with `oauthRateLimiter: RequestHandler`.
Main's version does not have this parameter. The file auto-merges from
main (branch didn't change it structurally), but the call site in
`application.ts` passes the extra argument.

**Resolution**: After accepting main's `application.ts`, re-apply the
`oauthRateLimiter` parameter to `setupOAuthAndCaching` and its call site.
Same pattern as last merge — extend the function signature, update callers.

### Hazard 6: ADR-158 renumbering scope (15 files)

Files referencing ADR-158 on this branch:

1. `docs/architecture/architectural-decisions/144-multi-layer-security-and-rate-limiting.md`
2. `docs/architecture/architectural-decisions/README.md`
3. `docs/governance/safety-and-security.md`
4. `docs/operations/sentry-deployment-runbook.md`
5. `apps/oak-curriculum-mcp-streamable-http/README.md`
6. `apps/oak-curriculum-mcp-streamable-http/src/application.ts`
7. `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limiter-factory.ts`
8. `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limit-profiles.ts`
9. `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/index.ts`
10. `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
11. `.agent/plans/architecture-and-infrastructure/active/README.md`
12. `.agent/plans/architecture-and-infrastructure/README.md`
13. `.agent/plans/architecture-and-infrastructure/archive/completed/app-layer-rate-limiting.plan.md`
14. `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md`
15. This merge plan

Use a `sed` sweep for the rename, with the file list as verification:

```bash
git ls-files -z | xargs -0 sed -i '' 's/ADR-158/ADR-158/g'
git mv docs/architecture/architectural-decisions/144-multi-layer-security-and-rate-limiting.md \
       docs/architecture/architectural-decisions/158-multi-layer-security-and-rate-limiting.md
```

Then verify all 15 files updated correctly.

**Investigated and dismissed** (Hazards 3 and 6): `getWidgetHtml` DI chain
and `OAK_SERVER_BRANDING` both auto-merge cleanly from main — branch didn't
touch these interfaces. No action needed.

## Resolution Order

1. **Trivial**: accept main for `pnpm-lock.yaml`, plan READMEs
2. **ADR collision**: `sed` sweep ADR-158 → ADR-158, rename file, verify
3. **Composition**: accept main's inlined `initializeCoreEndpoints`,
   delete branch's `core-endpoints.ts`
4. **Semantic**: resolve `application.ts` — accept main's structure, then
   re-apply rate limiting wiring (`rateLimiterFactory` DI field,
   `createRateLimiters()` helper, limiter params to route setup functions).
   **Note (Barney)**: this will push `application.ts` to ~270 lines,
   breaching `max-lines`. Extract `createRateLimiters` to a small utility
   if needed, or accept the overshoot as a fast-follow.
5. **Hazard 1**: remove `overrideToolsListHandler` import
6. **Hazard 5 + Fred finding**: verify auto-merge preserves branch's
   extended signatures on `setupOAuthAndCaching` (+ full chain:
   `registerOAuthRoutes` → `createOAuthProxyRoutes`) and
   `mountAssetDownloadProxy` (+ `createAssetDownloadRoute`). If auto-merge
   dropped the rate limiter params, re-apply them.
7. **Non-conflicting adaptations**: check auto-merged test files —
   all callers of `createApp()` must now provide `getWidgetHtml`
8. `pnpm install` → `pnpm type-check` → `pnpm check`
9. **Post-merge check**: visually confirm `registerWidgetResource` uses
   `wrapResourceHandler`. Characterisation tests run as part of `pnpm check`.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `core-endpoints.ts` import break | High | Medium | Delete file, inline into main's pattern |
| ADR numbering collision | High | Low | `sed` sweep + verification |
| `application.ts` merge error | Medium | High | Type-check gate immediately after |
| Rate limiter signatures silently dropped | High | Medium | Explicit verification step (step 6) |
| `application.ts` breaches `max-lines` | High | Low | Extract helper or fast-follow |

## Estimated Complexity

- **Text conflicts**: 4 files (2 trivial, 2 semantic)
- **Real hazards**: 4 (composition, ADR collision, signatures, import cascade)
- **Non-conflicting adaptations**: ~8 files (test callers need `getWidgetHtml`)
- **ADR renumbering**: 15 files (mechanical `sed` sweep)
- **Scale**: Much smaller than PR #70 merge (4 conflicts vs 22)

## Reviewer Verdicts

| Reviewer | Verdict | Key Finding |
|----------|---------|-------------|
| Wilma | CRITICAL HAZARDS → downgraded after investigation | `getWidgetHtml` and `OAK_SERVER_BRANDING` are non-hazards |
| docs-ADR | GAPS FOUND → fixed | Deleted file count corrected, `getWidgetHtml` threading documented |
| Fred | COMPLIANT | `mountAssetDownloadProxy` signature gap; ADR freshness check |
| Barney | COMPLIANT WITH RECOMMENDATIONS | Trim non-action hazards, `max-lines` warning, `sed` sweep |
