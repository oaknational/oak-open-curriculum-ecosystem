---
name: PR-87 CodeQL Alerts (focused)
overview: >
  Close all open CodeQL alerts on PR-87. CodeQL only. Sonar is out of
  scope here; a separate Sonar plan will follow after this lands.
status: current
last_updated: 2026-04-28T15:25Z
supersedes: .agent/plans/observability/archive/superseded/pr-87-architectural-cleanup.plan.superseded-by-codeql-only-reset-2026-04-28.md
branch: feat/otel_sentry_enhancements
pr: https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/87
todos:
  - id: alert-69-investigate
    content: "Alert #69 (js/missing-rate-limiting at app/bootstrap-helpers.ts:151): investigate why CodeQL flags this site even though the app-instance app.use(rateLimiter) wiring exists. Likely brand-recogniser limitation; cure is Phase-2.1-style brand narrowing or owner-authorised dismissal with file:line evidence."
    status: pending
  - id: alerts-70-71-72-81-brand-narrowing
    content: "Alerts #70/71/72/81 (js/missing-rate-limiting at auth-routes:106/151/153 and oauth-proxy-routes:87): brand-preservation type narrowing through RateLimitRequestHandler so CodeQL's recogniser sees the limiter at the registration site."
    status: pending
  - id: alerts-76-77-schema-cache
    content: "Alerts #76/#77 (js/http-to-file-access at packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts:99 and :106): introduce typed SchemaCache capability so the validated OpenAPIObject, path, size, symlink, and tempfile constraints are encoded at the capability boundary."
    status: pending
  - id: verify
    content: "Push, re-fetch live CodeQL alerts on PR head, confirm 0 open. Update PR description with closure evidence per alert."
    status: pending
---

# PR-87 CodeQL Alerts — Focused Plan

## Why this exists

The previous plan tried to close CodeQL **and** Sonar **and** duplications **and**
16 micro-clusters in 12 phases. After multiple sessions and several committed
phases, gates remained red. The work was high-quality but mixed-mechanic — each
session paid a re-grounding cost that exceeded the per-session closure rate.

This plan is scope-locked: **CodeQL alerts only**, one row per alert, structural
cure or owner-authorised dismissal-with-evidence per row. No phases. No "Stance"
section. No re-grounding tables. When the table is empty, the gate is green.

## Existing in-flight work on this branch

Two prior commits landed and are part of PR-87 history. They are not redone here:

- `9b2b2ed7` + `84571ccf` + `5d6622d0` — Phase 1 vercel-ignore lockdown (closed
  Sonar hotspot `AZ3D3iflrIk5eL0ceU__`). CodeQL impact: none directly.
- `a7ce1a39` + `d3e86fd1` — Phase 2.0.5 Vercel-aware `keyGenerator` cure +
  doc alignment. **HARDENING**, not exploit closure. CodeQL impact: none — the
  `js/missing-rate-limiting` recogniser doesn't read runtime keyGenerator
  behaviour. Closure of alerts #70/71/72/81 still depends on brand narrowing
  in this plan.

## Out of scope (separate plan after this lands)

- All Sonar findings (violations, hotspots, duplications, QG conditions).
- Cluster H (semver), I (health-probe regex), J (build-output `.match` → `.exec`),
  K (commit-queue micro-cluster), L (replaceAll), M/N (negated conditions),
  O (singletons), D (generated-code duplication).
- ADR-158 amendments beyond what landed in `d3e86fd1`.
- Methodology-lesson placement (deferred to Practice Core consultation).

If a CodeQL alert closure incidentally also closes a Sonar finding, that is fine
— but Sonar is not the success criterion here.

## The table

Live state at plan open (2026-04-28T~15:00Z, fetched via
`gh api 'repos/oaknational/oak-open-curriculum-ecosystem/code-scanning/alerts?ref=refs/pull/87/head&state=open'`):
**7 open alerts**.

| #  | Rule                     | Site                                                                                             | Cure (one-line)                                                                                                                                            | Owner |
|----|--------------------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 69 | js/missing-rate-limiting | `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts:151`                       | Investigate recogniser shape. If brand-narrowing fixes (as alerts #70-72/81 below) close it: same cure. If a different shape: name the cure or escalate.   |       |
| 70 | js/missing-rate-limiting | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:151`                                 | Brand-preservation type narrowing through `RateLimitRequestHandler` end-to-end (factory return → DI param types → registration sites → test fake).        |       |
| 71 | js/missing-rate-limiting | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:153`                                 | Same as #70.                                                                                                                                                |       |
| 72 | js/missing-rate-limiting | `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts:87`               | Same as #70.                                                                                                                                                |       |
| 81 | js/missing-rate-limiting | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:106`                                 | Same as #70.                                                                                                                                                |       |
| 76 | js/http-to-file-access   | `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts:99`                               | Introduce typed `SchemaCache` capability encoding validated `OpenAPIObject`, path, size, symlink, tempfile, and rename constraints at the capability boundary. |       |
| 77 | js/http-to-file-access   | `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts:106`                              | Same as #76 (one structural cure closes both).                                                                                                              |       |

### Disposition discipline

For each row: a closure is one of (a) a structural code change that makes the
recogniser stop flagging the site, or (b) a documented dismissal via
`gh api ... PATCH` with `dismissed_reason: false_positive | won't_fix` and an
inline rationale citing file:line evidence. **No suppression, no recogniser
disable, no rule downgrade.** If neither (a) nor (b) is feasible for a row,
escalate to the owner with the file:line evidence and the structural reason
the cure isn't tractable; do not silently leave the row open.

## Execution rules (deliberately small)

1. One alert (or one tightly-coupled cluster, e.g. #70-72/81) per commit.
2. Pre-phase: run reviewers when the change is non-trivial. Skip reviewers
   when the change is mechanical and small.
3. Each commit body: cite the alert number, the cure shape, and the recogniser
   evidence.
4. After each push: re-fetch the open-alerts list. Update the table by striking
   closed rows and adding the closing commit SHA in a "closed" column.
5. When the table is empty, run Phase 12 verify (push final, re-fetch, PR
   description update).

## Verification

`gh api 'repos/oaknational/oak-open-curriculum-ecosystem/code-scanning/alerts?ref=refs/pull/87/head&state=open' --paginate`
returning an empty array (or only owner-authorised dismissals) is the success
condition. Sonar gate state is irrelevant to this plan's success.
