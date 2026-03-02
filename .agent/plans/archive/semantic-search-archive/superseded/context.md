# Semantic Search Recovery – Context Log

_Last updated: 28 October 2025 12:25 GMT_

---

## Current Snapshot

- **Snagging plan** – `snagging-resolution-plan.md` is now closed; remaining multi-status work is tracked in `../status-handling.plan.md`.
- **Schema decorations** – `schema-enhancement-404.ts` mirrors the live 404 envelope (`message`, `code`, nested `data`) while leaving the upstream schema untouched.
- **Generator readiness** – `mcp-tool-generator`, response-map, and schema separation suites are green; regenerated artefacts expose `{status, data}` unions for every documented response.
- **Runtime surface** – `/mcp` stdio server publishes status-aware envelopes end-to-end; streamable HTTP serialises the same `{status,data}` envelope and the Accept guard now distinguishes missing auth (401) from missing event-stream (406) as per smoke findings.
- **Quality gates** – Repo-wide `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm test:ui`, and both `pnpm smoke:dev:stub`/`pnpm smoke:dev:live` completed successfully on 28 October 2025 12:14 GMT.
- **Next focus** – Assemble the commit package and any remaining documentation addenda for review.
- **Remote verification** – Preview URL `https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp` stays green via the commander-based smoke runner.

---

## Focus: Status-Aware Response Handling

- Responses are defined by **method + path + status**; every branch must be generated at type-gen time from the decorated schema.
- Flow remains **original schema → decoration pipeline (with collision guards) → generated handling code**, keeping runtime a thin façade (`.agent/directives/schema-first-execution.md`).
- No runtime type assertions or ad-hoc narrowing—generated artefacts expose readonly descriptors and discriminated unions.
- Detailed roadmap, acceptance criteria, and validation commands live in `../status-handling.plan.md`.

---

## Active Tasks

- [x] Emit status descriptor helper and supporting generator tests.
- [x] Enforce decoration collision protection for method/path/status tuples.
- [x] Generate status-aware invoke logic and multi-schema validation.
- [x] Prove behaviour through SDK tests, smoke suites, and fail-fast checks for undocumented statuses.
- [ ] Refresh documentation and prepare the release bundle (`pnpm make`/`pnpm qg` if required by reviewers).

---

- 24 October 2025 23:40 BST — Phase 4 complete: SDK executor tests updated, smoke stub/live/remote runs verified 200/404 handling and fail-fast messaging across environments.
- 24 October 2025 23:10 BST — Phase 3 complete: generators emit multi-status invoke logic, validation aggregates attempted statuses, runtime/unit suites adjusted, and type-gen/lint/test commands rerun.
- 24 October 2025 22:20 BST — Phase 2 complete: added shared status guard, updated decorators, extended schema separation tests, and re-ran type-gen/lint successfully.
- 24 October 2025 21:55 BST — Phase 1 complete: generated frozen descriptor map keyed by operation/status, added generator unit coverage, regenerated artefacts, and confirmed lint/tests clean.
- Phase 7 wrapped on 24 October 2025 with schema decorations, smoke harness upgrades, and remote validation all green.
- Stub/live/REST payload captures remain available under `tmp/smoke-logs/analysis/` for regression analysis during status-handling delivery.
- 28 October 2025 10:50 GMT — Streamable HTTP handlers/tests emit status-aware envelopes; stdio + streamable apps and SDK suites green. Full repo quality gates remain to be rerun.
- 28 October 2025 10:33 GMT — SDK + stdio status-aware pipeline green (unit/integration/e2e); streamable HTTP adaptation + repo-wide quality gate reruns pending.
- 27 October 2025 19:34 BST — Phase 0 baseline re-established; Phase 1 multi-status regression tests applied (SDK/stdio/streamable HTTP) and red as expected pending runtime implementation.
- 27 October 2025 19:10 GMT — Generator/runtime tightened to preserve literal status unions, `pnpm type-gen`, `pnpm type-check`, and `pnpm lint` rerun successfully; stdio server integration tests remain red awaiting status-aware response handling (plan steps 3.6–3.8).
- 28 October 2025 12:25 GMT — Plan/context refreshed post-Phase 3; commit packaging is the final outstanding task.
