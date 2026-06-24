# Future Plans — Developer Experience

Deferred strategic backlog for later milestones.

| Horizon | Plan | Scope | Prerequisites |
|---|---|---|---|
| Later | [cursor-plugins-practice-and-oak-developer.plan.md](./cursor-plugins-practice-and-oak-developer.plan.md) | Plugins bundling Practice + Oak developer capability (gathered into the external-facing skills/plugins synthesis) | — |
| Later | [generated-document-pipeline-extraction-plan.md](./generated-document-pipeline-extraction-plan.md) | Shared docs pipeline extraction for SDK and search app | Confirm owning workspace and execution budget |
| Later | [sdk-publishing-and-versioning-plan.md](./sdk-publishing-and-versioning-plan.md) | Publishing/versioning and release automation hardening | Delivery window for package release work |
| Later | [tsdoc-generated-docs-overhaul.plan.md](./tsdoc-generated-docs-overhaul.plan.md) | TSDoc output quality audit and overhaul | Baseline audit and acceptance criteria lock |

## CI & test efficiency thread (2026-06-24 scan)

Independently shippable — each promotes to its own focused branch. No mega-branch.
Recommended value order: pool → playwright → corpus-flake → parallelise → ruletester.

| Priority | Plan | Scope | Key dependency |
|---|---|---|---|
| High | [ci-vitest-pool-threads-migration.plan.md](./ci-vitest-pool-threads-migration.plan.md) | Retire the stale `forks`/`isolate` workaround → `threads` (630-file suite) | Measured trial must be clean (no global-state tests) |
| High | [ci-cache-playwright-browser.plan.md](./ci-cache-playwright-browser.plan.md) | Cache the per-run Playwright browser install | Touches `ci.yml` (sequence with parallelise) |
| Medium | [ci-parallelise-static-checks.plan.md](./ci-parallelise-static-checks.plan.md) | Overlap fast static checks with build+test | Touches `ci.yml`; re-measure after pool change |
| Medium | [ci-ruletester-type-aware-audit.plan.md](./ci-ruletester-type-aware-audit.plan.md) | Type-aware RuleTester parsing only where rules inspect types | — |
| Low | [ci-harden-corpus-scale-test-flake.plan.md](./ci-harden-corpus-scale-test-flake.plan.md) | Share corpus computation; prevent the 5s-timeout flake class (post-#219) | — |

Strategic context: [roadmap.md](../roadmap.md)

In-progress execution: [active/README.md](../active/README.md)
Next-up queue: [current/README.md](../current/README.md)

Documentation tracking for all phases:
[documentation-sync-log.md](../documentation-sync-log.md)
