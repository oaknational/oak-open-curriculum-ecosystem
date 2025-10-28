# Semantic Search Phase 1 – UX Plan

## Vision

Deliver a polished, accessible semantic search experience across landing, structured, natural-language, admin, and status surfaces so Phase 1 closes with confidence in UX quality, deterministic fixtures, and observability.

## Completed Highlights

- Landing experience rebuilt with CTA-first hero and `/search` redirect; structured and natural routes now dedicated views with consistent heroes, skip links, and deterministic fixtures.
- Navigation, shared layouts, and fixture toggles aligned across search/admin/status; accessibility sweeps (RTL + Playwright + manual) captured as evidence.
- Natural-language flow rebuilt as prompt-only pipeline with derived summary, SDK schema validation, and regression protection.
- Operations layout introduced for admin/status; telemetry dashboard now emits aria-live guidance, fixture notices, and platform outage alerts with passing RTL/Playwright coverage (Playwright run: `tests/visual/admin.telemetry.spec.ts`, artefacts under `apps/oak-open-curriculum-semantic-search/test-results/admin.telemetry-*`).
- Status page tone hardened with richer outage/degraded copy plus unit/integration tests covering card summaries (`app/status/status-helpers.unit.test.ts`, `app/status/StatusClient.integration.test.tsx`).
- Documentation (README, ARCHITECTURE) refreshed to describe layout hierarchy, telemetry pipeline, and artefact expectations; markdown lint suite passing.

## Remaining Actions

1. **Action 18 – Grounding checkpoint**
   - Re-read GO.md, reconcile plan vs. repo reality before closing actions.
2. **Action 19 – Quality gate (first pass)**
   - Run `pnpm qg`, collate evidence for search/admin/status after telemetry & tone updates.
3. **Action 20 – Final UX sweep**
   - Cross-surface review (landing, structured, natural, admin, status) with fixtures enabled; record accessibility notes and outstanding polish items (if any).
4. **Action 21 – Quality gate (final pass)**
   - Re-run `pnpm qg`, archive artefacts, prepare release notes / sign-off summary.

## Post-Phase Follow-up

- **Action 22 – Live persistence validation**: when live search endpoints are available, enable zero-hit persistence, seed real zero-hit searches, confirm dashboard telemetry, and capture supporting artefacts.

## Evidence Checklist (for upcoming actions)

- Updated admin dashboard screenshots/logs demonstrating SDK fixture history (Action 16) – see `test-results/admin.telemetry-*` from latest Playwright run.
- Status page tone screenshots + axe reports post-hardening (Action 17).
- Full `pnpm qg` logs and artefact bundle for Actions 19 & 21.

## Notes

- Continue using British spelling and SDK-generated fixtures for deterministic coverage.
- Artefacts are for analysis and immediate improvement; regenerate only when verifying a change.
